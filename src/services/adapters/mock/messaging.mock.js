/**
 * ─────────────────────────────────────────────────────────────
 *  Messagerie interne — mock
 * ─────────────────────────────────────────────────────────────
 * Un « fil » (thread) relie un entrepreneur (ou un visiteur anonyme) à
 * l'équipe KEC. Il est créé :
 *   - par le fellow depuis son espace (support, dossier, paiement…)
 *   - par Manu AI lors d'une escalade (kind: 'manu')
 *   - par le système lors d'une réservation de consultant
 *   - par l'équipe (demande de pièce, information)
 * Les messages `internal: true` sont des notes visibles uniquement par l'équipe.
 * SLA : première réponse humaine sous `messaging.slaHours` (§3).
 */
import { db } from '../../mock/db'
import { respond, uid } from '../../mock/mockUtils'
import { ApiError } from '../../http/ApiError'
import { APP_CONFIG } from '@/config/app.config'

const now = () => new Date().toISOString()

export const systemMessage = (text) => ({ id: uid('msg'), from: 'system', author: 'KEC', text, at: now() })

/** Crée un fil (utilisé par Manu, les réservations, l'équipe et le fellow). Retourne le fil. */
export function openThread({ kind, subject, fellowId = null, fellowName = null, assigneeId = null, reason = null, priority = 'normal', tags = [], messages = [] }) {
  const fellow = fellowId ? db.get('users', fellowId) : null
  const assignee = assigneeId ? db.get('team', assigneeId) : null
  const at = now()
  return db.insert('threads', {
    id: uid('thr'), kind, subject, reason, tags, status: 'open', priority,
    fellowId, fellowName: fellow?.name ?? fellowName ?? 'Visiteur', companyId: fellow?.companyId ?? null, fellowNumber: fellow?.fellowNumber ?? null,
    assigneeId: assignee?.id ?? null, assignee: assignee?.name ?? null,
    createdAt: at, updatedAt: at, lastMessageAt: at,
    slaDueAt: new Date(Date.now() + APP_CONFIG.messaging.slaHours * 3600000).toISOString(),
    firstResponseAt: null,
    unreadStaff: messages.filter((m) => m.from !== 'staff').length, unreadFellow: messages.filter((m) => m.from === 'staff' && !m.internal).length,
    messages: messages.map((m) => ({ id: m.id ?? uid('msg'), at: m.at ?? at, ...m }))
  })
}

/** Réponses types proposées à l'équipe (modifiables ici, côté serveur en prod) */
const CANNED = [
  { id: 'ack', label: 'Accusé de réception', text: 'Bonjour {name}, merci pour votre message. Je prends votre demande en charge et reviens vers vous dans la journée.' },
  { id: 'doc', label: 'Demande de pièce', text: 'Bonjour {name}, pour avancer sur votre dossier, pouvez-vous déposer dans votre coffre-fort une version lisible de la pièce suivante : … ? Merci !' },
  { id: 'rdv', label: 'Proposer un rendez-vous', text: 'Bonjour {name}, votre question mérite un échange avec un consultant. Vous pouvez réserver un créneau depuis la page Consultant ; je peux aussi vous proposer un horaire.' },
  { id: 'delay', label: 'Point sur les délais', text: 'Bonjour {name}, votre dossier est en instruction. La date prévisionnelle est visible dans Mon entreprise ; je vous préviens à chaque étape franchie.' },
  { id: 'close', label: 'Clôture', text: 'Je clôture cette conversation. N\'hésitez pas à nous réécrire si besoin, et bonne continuation {name} !' }
]

function sorted(list) {
  return [...list].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
}

export const messagingMock = {
  /** Fils d'un fellow (son espace Messages) */
  async listMine(userId) {
    return respond(sorted(db.find('threads', (t) => t.fellowId === userId)).map((t) => ({ ...t, messages: t.messages.filter((m) => !m.internal) })), 250)
  },

  /** Tous les fils, pour l'équipe. Filtres : status, kind, assigneeId, q */
  async listAll({ status = 'all', kind = 'all', assigneeId = 'all', q = '' } = {}) {
    const needle = q.trim().toLowerCase()
    const rows = db.all('threads').filter((t) =>
      (status === 'all' || t.status === status) &&
      (kind === 'all' || t.kind === kind) &&
      (assigneeId === 'all' || (assigneeId === 'none' ? !t.assigneeId : t.assigneeId === assigneeId)) &&
      (!needle || `${t.subject} ${t.fellowName} ${t.tags.join(' ')} ${t.messages.map((m) => m.text).join(' ')}`.toLowerCase().includes(needle)))
    return respond(sorted(rows), 250)
  },

  async get(threadId, { asStaff = false } = {}) {
    const t = db.get('threads', threadId)
    if (!t) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    return respond(asStaff ? t : { ...t, messages: t.messages.filter((m) => !m.internal) }, 150)
  },

  /** Le fellow ouvre une conversation */
  async create({ userId, kind = 'support', subject, text }) {
    const u = db.get('users', userId)
    const t = openThread({ kind, subject, fellowId: userId, messages: [{ from: 'fellow', author: u?.name ?? 'Fellow', text }] })
    return respond(t, 500)
  },

  /**
   * Poste un message. from: 'fellow' | 'staff'. `internal` = note interne (équipe).
   * Un message de l'équipe rouvre un fil fermé ; le premier marque le SLA.
   */
  async post(threadId, { from, authorId = null, author, text, internal = false }) {
    const t = db.get('threads', threadId)
    if (!t) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    const m = { id: uid('msg'), from, authorId, author, text, at: now(), internal }
    const patch = { messages: [...t.messages, m], updatedAt: m.at }
    if (!internal) {
      patch.lastMessageAt = m.at
      if (from === 'staff') {
        patch.unreadFellow = (t.unreadFellow ?? 0) + 1
        if (!t.firstResponseAt) patch.firstResponseAt = m.at
        if (t.status === 'closed') patch.status = 'open'
        if (t.status === 'open') patch.status = 'pending' // en attente du fellow
      } else {
        patch.unreadStaff = (t.unreadStaff ?? 0) + 1
        if (t.status !== 'open') patch.status = 'open'
      }
    }
    db.update('threads', threadId, patch)
    return respond(db.get('threads', threadId), 350)
  },

  /** Équipe : statut, assignation, priorité, tags */
  async update(threadId, patch) {
    const t = db.get('threads', threadId)
    if (!t) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    const p = { ...patch }
    if ('assigneeId' in p) p.assignee = p.assigneeId ? db.get('team', p.assigneeId)?.name ?? null : null
    if (p.status === 'closed') p.closedAt = now()
    db.update('threads', threadId, p)
    return respond(db.get('threads', threadId), 200)
  },

  async markRead(threadId, who) {
    db.update('threads', threadId, who === 'staff' ? { unreadStaff: 0 } : { unreadFellow: 0 })
    return respond(true, 0)
  },

  async cannedReplies() { return respond(CANNED, 100) }
}

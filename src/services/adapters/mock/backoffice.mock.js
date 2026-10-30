/**
 * Back-office de l'équipe KEC — mock.
 * Règles métier clés :
 *   - on ne peut jamais dépasser 110 fellows sélectionnés (COHORT_FULL) ;
 *   - chaque action sensible est journalisée (audit, §12) ;
 *   - chaque changement de dossier alimente son journal (visible par le fellow).
 */
import { db } from '../../mock/db'
import { respond, uid } from '../../mock/mockUtils'
import { ApiError } from '../../http/ApiError'
import { publish } from '../../realtime/realtime.mock'
import { computeKpis } from './stats'
import { APP_CONFIG } from '@/config/app.config'
import { openThread } from './messaging.mock'
import { bookingStart } from './consultant.mock'

const now = () => new Date().toISOString()

/** Journal d'audit (§12). `actor` = membre connecté, passé par la vue. */
export function audit(actor, action, label, details = '') {
  db.insert('audit', { id: uid('aud'), at: now(), actorId: actor?.id ?? null, actor: actor?.name ?? 'Équipe KEC', action, label, details })
}

/** Ajoute une entrée au journal d'un dossier */
function journal(companyId, type, text, by) {
  const c = db.get('companies', companyId)
  if (!c) return
  db.update('companies', companyId, { journal: [{ at: now(), type, text, by }, ...(c.journal ?? [])] })
}

const STATUS_LABEL = { draft: 'brouillon', submitted: 'envoyé', in_review: 'en instruction', docs_requested: 'pièces demandées', filed: 'déposé', created: 'entreprise créée' }

function enrichDossier(c) {
  const docs = db.find('documents', (d) => d.companyId === c.id)
  const owner = db.get('users', c.ownerId)
  return {
    ...c,
    owner: owner?.name ?? '—', ownerEmail: owner?.email ?? null, ownerPhone: owner?.phone ?? null, fellowNumber: owner?.fellowNumber ?? null, residenceCountry: owner?.residenceCountry ?? null,
    documents: docs,
    docsToReview: docs.filter((d) => d.status === 'uploaded').length,
    bookings: db.find('bookings', (b) => b.userId === c.ownerId).length,
    payments: db.find('payments', (p) => p.userId === c.ownerId),
    openThreads: db.find('threads', (t) => t.fellowId === c.ownerId && t.status !== 'closed').length
  }
}

export const backofficeMock = {
  async overview() {
    const threads = db.all('threads')
    const created = db.find('companies', (c) => c.status === 'created' && c.submittedAt)
    const createdEvent = (c) => c.journal?.find((j) => j.type === 'created')?.at
    const leadDays = created.filter(createdEvent).map((c) => (new Date(createdEvent(c)) - new Date(c.submittedAt)) / 86400000)
    const upcoming = db.find('bookings', (b) => b.status === 'confirmed' && bookingStart(b) > Date.now())
    return respond({
      kpis: computeKpis(),
      openThreads: threads.filter((t) => t.status === 'open').length,
      slaBreaches: threads.filter((t) => t.status === 'open' && !t.firstResponseAt && Date.now() > new Date(t.slaDueAt).getTime()).length,
      newSuggestions: db.find('suggestions', (s) => s.status === 'new').length,
      dossiers: db.all('companies').length,
      dossiersByStatus: db.all('companies').reduce((o, c) => ({ ...o, [c.status]: (o[c.status] ?? 0) + 1 }), {}),
      documentsToReview: db.find('documents', (d) => d.status === 'uploaded').length,
      transfersToConfirm: db.find('payments', (p) => p.status === 'awaiting_transfer').length,
      upcomingBookings: upcoming.length,
      upcomingBookingsWeek: upcoming.filter((b) => bookingStart(b) < Date.now() + 7 * 86400000).length,
      avgLeadDays: leadDays.length ? Math.round(leadDays.reduce((s, d) => s + d, 0) / leadDays.length) : null,
      certified: db.find('companies', (c) => c.certified).length
    }, 300)
  },

  /* ── Liste d'attente ─────────────────────────────────────── */
  async listWaitlist({ status = 'all', q = '', sort = 'recent' } = {}) {
    const needle = q.trim().toLowerCase()
    let rows = db.all('waitlist').filter((w) =>
      (status === 'all' || w.status === status) &&
      (!needle || `${w.firstName} ${w.lastName} ${w.email} ${w.targetCity} ${w.projectSummary ?? ''}`.toLowerCase().includes(needle)))
    if (sort === 'score') rows = [...rows].sort((a, b) => b.score - a.score)
    if (sort === 'oldest') rows = [...rows].sort((a, b) => a.ticket - b.ticket)
    return respond(rows, 250)
  },

  async setWaitlistStatus(id, status, actor = null) {
    const selected = db.find('waitlist', (w) => w.status === 'selected').length
    const row = db.get('waitlist', id)
    if (!row) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    if (status === 'selected' && row.status !== 'selected' && selected >= APP_CONFIG.program.cohortSize) {
      throw new ApiError('COHORT_FULL', 'errors.cohortFull', 409)
    }
    db.update('waitlist', id, { status })
    audit(actor, 'waitlist.status', `Candidat : ${status}`, `${row.firstName} ${row.lastName} · ${row.targetCity}`)
    if (status === 'selected') publish('fellow.selected', { id, firstName: row.firstName, city: row.targetCity })
    return respond(db.get('waitlist', id), 150)
  },

  /* ── Dossiers ────────────────────────────────────────────── */
  async listDossiers() {
    return respond(db.all('companies').map(enrichDossier))
  },

  async getDossier(id) {
    const c = db.get('companies', id)
    if (!c) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    return respond({ ...enrichDossier(c), bookingList: db.find('bookings', (b) => b.userId === c.ownerId), threads: db.find('threads', (t) => t.fellowId === c.ownerId) }, 200)
  },

  async updateDossier(id, patch, actor = null) {
    const c = db.get('companies', id)
    if (!c) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    const p = { ...patch }
    if ('assigneeId' in p) {
      const m = p.assigneeId ? db.get('team', p.assigneeId) : null
      p.assignee = m?.name ?? null
      journal(id, 'assigned', m ? `Dossier assigné à ${m.name}` : 'Dossier désassigné', actor?.name ?? 'Équipe KEC')
      audit(actor, 'dossier.assign', 'Interlocuteur modifié', `${c.name} → ${m?.name ?? '—'}`)
    }
    if (p.status && p.status !== c.status) {
      journal(id, 'status', `Statut du dossier : ${STATUS_LABEL[p.status] ?? p.status}`, actor?.name ?? 'Équipe KEC')
      audit(actor, 'dossier.status', `Statut : ${STATUS_LABEL[p.status] ?? p.status}`, c.name)
      if (p.status === 'created' && !c.rccm) p.rccm = `RC/${c.city.slice(0, 3).toUpperCase()}/2026/B/${String(1000 + Math.floor(Math.random() * 9000))}`
      // Les jalons suivent le statut
      const idx = { submitted: 2, in_review: 3, docs_requested: 3, filed: 4, created: 5 }[p.status]
      if (idx != null) p.milestones = (c.milestones ?? []).map((m, i) => ({ ...m, done: i < idx, current: i === idx, doneAt: i < idx ? (m.doneAt ?? now()) : null }))
      if (p.status === 'created') p.companyCreatedAt = now()
    }
    if ('certified' in p && p.certified !== c.certified) {
      p.certifiedAt = p.certified ? now() : null
      if (p.certified) p.milestones = (c.milestones ?? []).map((m) => ({ ...m, done: true, current: false, doneAt: m.doneAt ?? now() }))
      journal(id, 'certified', p.certified ? 'Compte entreprise certifié KEC ✦' : 'Certification retirée', actor?.name ?? 'Équipe KEC')
      audit(actor, 'dossier.certify', p.certified ? 'Compte certifié' : 'Certification retirée', c.name)
    }
    db.update('companies', id, p)
    return respond(enrichDossier(db.get('companies', id)), 200)
  },

  async addDossierNote(id, text, actor = null) {
    const c = db.get('companies', id)
    if (!c) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    db.update('companies', id, { internalNotes: [{ at: now(), by: actor?.name ?? 'Équipe KEC', text }, ...(c.internalNotes ?? [])] })
    return respond(enrichDossier(db.get('companies', id)), 200)
  },

  async toggleMilestone(id, key, actor = null) {
    const c = db.get('companies', id)
    if (!c) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    const ms = c.milestones.map((m) => (m.key === key ? { ...m, done: !m.done, doneAt: !m.done ? now() : null } : m))
    const firstOpen = ms.findIndex((m) => !m.done)
    ms.forEach((m, i) => { m.current = i === firstOpen })
    db.update('companies', id, { milestones: ms })
    journal(id, 'milestone', `Jalon ${ms.find((m) => m.key === key).done ? 'franchi' : 'rouvert'} : ${key}`, actor?.name ?? 'Équipe KEC')
    return respond(enrichDossier(db.get('companies', id)), 150)
  },

  /** Demande de pièce : statut docs_requested + message au fellow */
  async requestDocument(id, { kind, message }, actor = null) {
    const c = db.get('companies', id)
    if (!c) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    db.update('companies', id, { status: 'docs_requested' })
    journal(id, 'doc_requested', `Pièce demandée : ${kind}`, actor?.name ?? 'Équipe KEC')
    openThread({ kind: 'dossier', subject: `Pièce demandée : ${kind}`, fellowId: c.ownerId, assigneeId: actor?.id ?? c.assigneeId, tags: ['pièces'], messages: [{ from: 'staff', author: actor?.name ?? 'Équipe KEC', text: message }] })
    audit(actor, 'dossier.requestDoc', 'Pièce demandée', `${c.name} · ${kind}`)
    return respond(enrichDossier(db.get('companies', id)), 300)
  },

  async reviewDocument(id, status, rejectionReason = '', actor = null) {
    const d = db.get('documents', id)
    if (!d) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    db.update('documents', id, { status, rejectionReason, reviewedAt: now(), reviewedBy: actor?.name ?? null })
    journal(d.companyId, status === 'verified' ? 'doc_verified' : 'doc_rejected', status === 'verified' ? `Pièce validée : ${d.name}` : `Pièce refusée : ${d.name} — ${rejectionReason}`, actor?.name ?? 'Équipe KEC')
    audit(actor, 'document.review', status === 'verified' ? 'Pièce validée' : 'Pièce refusée', d.name)
    return respond(db.get('documents', id), 200)
  },

  /* ── Rendez-vous consultants (vue centralisée) ───────────── */
  async listBookings() {
    return respond([...db.all('bookings')].sort((a, b) => bookingStart(a) - bookingStart(b)), 250)
  },

  async updateBooking(id, patch, actor = null) {
    const b = db.get('bookings', id)
    if (!b) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    const p = { ...patch }
    if (p.consultantId && p.consultantId !== b.consultantId) {
      const c = db.get('team', p.consultantId)
      p.consultant = c.name; p.speciality = c.speciality
      audit(actor, 'booking.reassign', 'Rendez-vous réassigné', `${b.userName} → ${c.name}`)
    }
    if (p.status === 'completed') { p.completedAt = now(); audit(actor, 'booking.complete', 'Rendez-vous terminé + compte rendu', `${b.userName} · ${b.topic}`) }
    if (p.status === 'cancelled') {
      p.cancelledAt = now(); p.cancelledBy = 'staff'
      p.refund = b.status === 'confirmed' ? { type: 'refund', amount: b.amount } : null // annulation par KEC : remboursement intégral
      audit(actor, 'booking.cancel', 'Rendez-vous annulé par KEC', `${b.userName} · ${b.topic}`)
      if (p.refund && b.paymentId && db.get('payments', b.paymentId)) db.update('payments', b.paymentId, { refund: p.refund })
    }
    db.update('bookings', id, p)
    return respond(db.get('bookings', id), 200)
  },

  /* ── Paiements ───────────────────────────────────────────── */
  async listPayments() { return respond([...db.all('payments')].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) },

  /** Rapprochement d'un virement reçu sur le relevé bancaire */
  async confirmTransfer(id, actor = null) {
    const p = db.get('payments', id)
    if (!p) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    db.update('payments', id, { status: 'succeeded', receiptNo: `RC-2026-${Math.floor(2000 + Math.random() * 7999)}`, paidAt: now(), confirmedBy: actor?.name ?? null })
    publish('payment.succeeded', db.get('payments', id))
    audit(actor, 'payment.confirm', 'Virement confirmé', `${p.reference} · ${p.amount.toLocaleString('fr-FR')} FCFA`)
    return respond(db.get('payments', id), 300)
  },

  async failPayment(id, reason = '', actor = null) {
    db.update('payments', id, { status: 'failed', failureReason: reason })
    audit(actor, 'payment.fail', 'Paiement marqué échoué', reason)
    return respond(db.get('payments', id), 200)
  },

  /* ── Équipe & rôles ──────────────────────────────────────── */
  async listTeam() { return respond(db.all('team'), 200) },

  async inviteMember({ name, email, role, title = '' }, actor = null) {
    if (db.findOne('team', (m) => m.email.toLowerCase() === email.toLowerCase())) throw new ApiError('ALREADY_EXISTS', 'errors.alreadyMember', 409)
    const m = db.insert('team', { id: uid('tm'), name, email, role, title, status: 'invited', twoFactor: false, lastLoginAt: null, joinedAt: now(), initialsColor: '#b9a58b' })
    audit(actor, 'team.invite', 'Invitation envoyée', `${name} (${role})`)
    return respond(m, 500)
  },

  async updateMember(id, patch, actor = null) {
    const m = db.get('team', id)
    if (!m) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    if (m.id === 'usr_staff' && (patch.role && patch.role !== 'admin' || patch.status === 'disabled')) throw new ApiError('LAST_ADMIN', 'errors.lastAdmin', 409)
    db.update('team', id, patch)
    if (patch.role) audit(actor, 'team.role', 'Rôle modifié', `${m.name} : ${m.role} → ${patch.role}`)
    if (patch.status) audit(actor, 'team.status', patch.status === 'disabled' ? 'Accès désactivé' : 'Accès réactivé', m.name)
    return respond(db.get('team', id), 200)
  },

  async listAudit({ limit = 80 } = {}) { return respond(db.all('audit').slice(0, limit), 200) },

  /* ── Kopen Mind ──────────────────────────────────────────── */
  async listSuggestions() { return respond(db.all('suggestions')) },
  async updateSuggestion(id, patch) { db.update('suggestions', id, patch); return respond(db.get('suggestions', id), 150) }
}

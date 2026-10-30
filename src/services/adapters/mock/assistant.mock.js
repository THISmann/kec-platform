/**
 * Manu AI — adaptateur mock.
 * - Côté visiteur / fellow : moteur local paramétré par les réglages de l'équipe,
 *   journalisation de chaque échange (§7), fil de messagerie créé à chaque escalade.
 * - Côté équipe : lecture/édition des paramètres et de la base de connaissances,
 *   rapport d'activité, journal des conversations.
 */
import { db } from '../../mock/db'
import { respond, uid, delay } from '../../mock/mockUtils'
import { manuReply, manuWelcome, knowledgeCatalog, detectLocale } from '../../mock/manuEngine'
import { openThread, systemMessage } from './messaging.mock'
import { ESCALATION_RULES } from '../../mock/manuKnowledge'

const DAY = 86400000
const settings = () => db.get('assistantSettings', 'assistant')
const overrides = () => db.get('knowledgeOverrides', 'knowledge')
const REASON_ASSIGNEE = { tax: 'tm_fouda', social: 'tm_ndjock', criminal: 'tm_ndjock', litigation: 'tm_ndjock', personalAdvice: 'usr_staff', urgent: 'usr_staff', notUnderstood: 'tm_sandrine', humanRequested: 'tm_sandrine' }

export const assistantMock = {
  async welcome({ locale, name }) {
    return respond({ ...manuWelcome(locale, name, settings(), overrides()), locale }, 300)
  },

  /**
   * @param {{ message:string, state:object, transcript:Array, userName?:string, userId?:string|null, page?:string }} input
   */
  async send({ message, state, transcript = [], userName = 'Visiteur', userId = null, page = '' }) {
    const cfg = settings()
    if (cfg?.degradedMode) throw new Error('errors.generic') // dégradation gracieuse testable depuis le back-office
    const started = Date.now()
    // Manu répond dans la langue du message (détection), sinon dans celle de la conversation, sinon celle de l'interface
    const locale = detectLocale(message) ?? state.replyLocale ?? state.locale ?? 'fr'
    const { reply, state: next, intent } = manuReply(message, { ...state, locale }, cfg, overrides())
    reply.locale = locale
    next.replyLocale = locale
    // Temps de "frappe" proportionnel à la longueur : plus humain
    await delay(Math.min(600 + reply.text.length * 12, 2200))

    db.insert('assistantLogs', {
      id: uid('alog'), sessionId: state.sessionId ?? 'anon', at: new Date().toISOString(), locale,
      role: userId ? 'fellow' : 'visitor', userMessage: message.slice(0, 200), intent, escalated: !!reply.escalated,
      reason: reply.reason ?? null, misses: next.misses ?? 0, responseMs: Date.now() - started, page
    })

    if (reply.escalated) {
      const history = [...transcript, { from: 'user', text: message }].slice(-10)
        .map((m) => ({ from: m.from === 'user' ? 'fellow' : 'manu', author: m.from === 'user' ? userName : 'Manu AI', text: m.text }))
      openThread({
        kind: 'manu', reason: reply.reason, fellowId: userId, fellowName: userName,
        priority: reply.reason === 'urgent' ? 'urgent' : ['tax', 'litigation', 'criminal'].includes(reply.reason) ? 'high' : 'normal',
        assigneeId: REASON_ASSIGNEE[reply.reason] ?? null, tags: [reply.reason, locale.toUpperCase()].filter(Boolean),
        subject: message.slice(0, 80),
        messages: [...history, { from: 'manu', author: 'Manu AI', text: reply.text }, systemMessage(`Conversation transmise à l'équipe (motif : ${reply.reason}).`)]
      })
    }
    return respond({ reply, state: next }, 0)
  },

  /* ── Administration (équipe KEC) ─────────────────────────── */

  async getSettings() { return respond(settings(), 200) },

  async saveSettings(patch, by = 'Équipe KEC', note = '') {
    const cur = settings()
    const version = (cur.version ?? 0) + 1
    db.update('assistantSettings', 'assistant', {
      ...patch, version, updatedAt: new Date().toISOString(), updatedBy: by,
      history: [...(cur.history ?? []), { version, at: new Date().toISOString(), by, note: note || 'Mise à jour des paramètres' }].slice(-20)
    })
    db.insert('audit', { id: uid('aud'), at: new Date().toISOString(), actor: by, action: 'manu.settings', label: `Paramètres Manu modifiés (v${version})`, details: Object.keys(patch).join(', ') })
    return respond(settings(), 400)
  },

  /** Base de connaissances : catalogue livré + surcharges de l'équipe */
  async getKnowledge() {
    return respond({ catalog: knowledgeCatalog(), overrides: overrides(), escalationRules: ESCALATION_RULES.map((r) => ({ reason: r.reason, keywords: r.keywords })) }, 250)
  },

  async saveKnowledge(intentId, patch, by = 'Équipe KEC') {
    const cur = overrides()
    const intents = { ...cur.intents, [intentId]: { ...(cur.intents[intentId] ?? {}), ...patch } }
    db.update('knowledgeOverrides', 'knowledge', { intents, version: (cur.version ?? 0) + 1, updatedAt: new Date().toISOString(), updatedBy: by })
    db.insert('audit', { id: uid('aud'), at: new Date().toISOString(), actor: by, action: 'manu.knowledge', label: 'Base de connaissances modifiée', details: intentId })
    return respond(overrides(), 300)
  },

  /** Rapport d'activité sur N jours */
  async report(days = 30) {
    const since = Date.now() - days * DAY
    const logs = db.find('assistantLogs', (l) => new Date(l.at).getTime() >= since)
    const count = (fn) => logs.filter(fn).length
    const group = (key) => Object.entries(logs.reduce((o, l) => { const k = l[key] ?? '—'; o[k] = (o[k] ?? 0) + 1; return o }, {})).map(([key, n]) => ({ key, count: n })).sort((a, b) => b.count - a.count)
    const byDay = []
    for (let i = days - 1; i >= 0; i--) {
      const start = new Date(Date.now() - i * DAY); start.setHours(0, 0, 0, 0)
      const end = start.getTime() + DAY
      const dayLogs = logs.filter((l) => { const t = new Date(l.at).getTime(); return t >= start.getTime() && t < end })
      byDay.push({ date: start.toISOString().slice(0, 10), count: dayLogs.length, escalated: dayLogs.filter((l) => l.escalated).length })
    }
    const escalated = count((l) => l.escalated)
    const fallback = count((l) => l.intent === 'fallback' || l.intent === 'transfer')
    const threads = db.find('threads', (t) => t.kind === 'manu')
    const answered = threads.filter((t) => t.firstResponseAt)
    const avgResponseH = answered.length ? answered.reduce((s, t) => s + (new Date(t.firstResponseAt) - new Date(t.createdAt)) / 3600000, 0) / answered.length : 0
    return respond({
      days, total: logs.length, sessions: new Set(logs.map((l) => l.sessionId)).size,
      escalated, escalationRate: logs.length ? Math.round((escalated / logs.length) * 100) : 0,
      fallback, understoodRate: logs.length ? Math.round(((logs.length - fallback) / logs.length) * 100) : 0,
      autonomousRate: logs.length ? Math.round(((logs.length - escalated - fallback) / logs.length) * 100) : 0,
      avgResponseMs: logs.length ? Math.round(logs.reduce((s, l) => s + l.responseMs, 0) / logs.length) : 0,
      fellowShare: logs.length ? Math.round((count((l) => l.role === 'fellow') / logs.length) * 100) : 0,
      intents: group('intent').filter((i) => i.key !== 'escalate'),
      reasons: group('reason').filter((r) => r.key !== '—'),
      locales: group('locale'),
      pages: group('page'),
      byDay,
      unanswered: logs.filter((l) => l.intent === 'fallback').map((l) => l.userMessage).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8),
      openThreads: threads.filter((t) => t.status === 'open').length,
      slaBreaches: threads.filter((t) => t.status === 'open' && !t.firstResponseAt && Date.now() > new Date(t.slaDueAt).getTime()).length,
      avgHumanResponseH: Math.round(avgResponseH * 10) / 10
    }, 400)
  },

  async logs({ limit = 60, intent = 'all', q = '' } = {}) {
    const needle = q.trim().toLowerCase()
    const rows = db.all('assistantLogs').filter((l) => (intent === 'all' || l.intent === intent || (intent === 'escalated' && l.escalated)) && (!needle || l.userMessage.toLowerCase().includes(needle)))
    return respond(rows.slice(0, limit), 250)
  }
}

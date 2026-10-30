/**
 * ─────────────────────────────────────────────────────────────
 *  Adaptateurs HTTP (API réelle)
 * ─────────────────────────────────────────────────────────────
 * Chaque méthode a EXACTEMENT la même signature et le même format de
 * retour que son équivalent mock (src/services/adapters/mock/*).
 * Le contrat d'API complet est documenté dans docs/API_CONTRACT.md.
 *
 * Passer en réel : VITE_API_MODE=http (ou `npm run dev:http`).
 * Les paramètres `userId` / `actor` des mocks sont ignorés ici : le serveur
 * les déduit du jeton (Authorization: Bearer …).
 */
import { http } from '../../http/httpClient'

export const authHttp = {
  login: (credentials) => http.post('/auth/login', credentials),
  me: () => http.get('/auth/me'),
  logout: () => http.post('/auth/logout')
}

export const waitlistHttp = {
  join: (payload) => http.post('/waitlist', payload),
  publicStats: () => http.get('/waitlist/stats')
}

export const companyHttp = {
  getMine: () => http.get('/companies/me'),
  saveDraft: (_userId, form) => http.put('/companies/me/draft', form),
  submit: (_userId, form) => http.post('/companies/me/submit', form),
  quote: (params) => http.post('/quotes', params)
}

export const vaultHttp = {
  list: (companyId) => http.get(`/companies/${companyId}/documents`),
  /** Upload multipart. Pour une vraie progression, remplacer fetch par XMLHttpRequest ici. */
  async upload(companyId, kind, file, onProgress) {
    const fd = new FormData()
    fd.append('kind', kind)
    fd.append('file', file)
    onProgress?.(10)
    const doc = await http.post(`/companies/${companyId}/documents`, fd)
    onProgress?.(100)
    return doc
  },
  remove: (id) => http.delete(`/documents/${id}`)
}

export const paymentHttp = {
  initiate: (payload) => http.post('/payments', payload),
  status: (id) => http.get(`/payments/${id}`),
  listMine: () => http.get('/payments/me')
}

export const consultantHttp = {
  listConsultants: () => http.get('/consultants'),
  availability: (date, consultantId) => http.get('/consultants/availability', { query: { date, consultantId } }),
  book: (payload) => http.post('/consultants/bookings', payload),
  confirm: (id, paymentId) => http.post(`/consultants/bookings/${id}/confirm`, { paymentId }),
  cancel: (id, reason) => http.post(`/consultants/bookings/${id}/cancel`, { reason }),
  listMine: () => http.get('/consultants/bookings/me')
}

export const suggestionHttp = {
  create: (payload) => http.post('/suggestions', payload)
}

export const assistantHttp = {
  welcome: (params) => http.post('/assistant/welcome', params),
  send: (payload) => http.post('/assistant/messages', payload),
  // Administration (équipe)
  getSettings: () => http.get('/assistant/settings'),
  saveSettings: (patch, _by, note) => http.put('/assistant/settings', { ...patch, note }),
  getKnowledge: () => http.get('/assistant/knowledge'),
  saveKnowledge: (intentId, patch) => http.patch(`/assistant/knowledge/${intentId}`, patch),
  report: (days = 30) => http.get('/assistant/report', { query: { days } }),
  logs: (query) => http.get('/assistant/logs', { query })
}

export const messagingHttp = {
  listMine: () => http.get('/threads/me'),
  listAll: (query) => http.get('/backoffice/threads', { query }),
  get: (id) => http.get(`/threads/${id}`),
  create: (payload) => http.post('/threads', payload),
  post: (id, payload) => http.post(`/threads/${id}/messages`, payload),
  update: (id, patch) => http.patch(`/threads/${id}`, patch),
  markRead: (id) => http.post(`/threads/${id}/read`),
  cannedReplies: () => http.get('/backoffice/canned-replies')
}

/** Demande de consultation publique (sans compte) */
export const consultationHttp = {
  request: (payload) => http.post('/public/consultation-requests', payload)
}

export const investorHttp = {
  dashboard: () => http.get('/investors/dashboard'),
  activity: (limit = 25) => http.get('/investors/activity', { query: { limit } })
}

export const backofficeHttp = {
  overview: () => http.get('/backoffice/overview'),
  listWaitlist: (query) => http.get('/backoffice/waitlist', { query }),
  setWaitlistStatus: (id, status) => http.patch(`/backoffice/waitlist/${id}`, { status }),
  listDossiers: () => http.get('/backoffice/dossiers'),
  getDossier: (id) => http.get(`/backoffice/dossiers/${id}`),
  updateDossier: (id, patch) => http.patch(`/backoffice/dossiers/${id}`, patch),
  addDossierNote: (id, text) => http.post(`/backoffice/dossiers/${id}/notes`, { text }),
  toggleMilestone: (id, key) => http.post(`/backoffice/dossiers/${id}/milestones/${key}/toggle`),
  requestDocument: (id, payload) => http.post(`/backoffice/dossiers/${id}/request-document`, payload),
  reviewDocument: (id, status, rejectionReason) => http.patch(`/backoffice/documents/${id}`, { status, rejectionReason }),
  listBookings: () => http.get('/backoffice/bookings'),
  updateBooking: (id, patch) => http.patch(`/backoffice/bookings/${id}`, patch),
  listPayments: () => http.get('/backoffice/payments'),
  confirmTransfer: (id) => http.post(`/backoffice/payments/${id}/confirm`),
  failPayment: (id, reason) => http.post(`/backoffice/payments/${id}/fail`, { reason }),
  listTeam: () => http.get('/backoffice/team'),
  inviteMember: (payload) => http.post('/backoffice/team', payload),
  updateMember: (id, patch) => http.patch(`/backoffice/team/${id}`, patch),
  listAudit: (query) => http.get('/backoffice/audit', { query }),
  listSuggestions: () => http.get('/backoffice/suggestions'),
  updateSuggestion: (id, patch) => http.patch(`/backoffice/suggestions/${id}`, patch)
}

/**
 * Consultants & rendez-vous (payants à l'heure) — mock.
 * Les consultants sont les membres de l'équipe ayant le rôle « consultant » :
 * une seule source de vérité partagée avec la gestion des rôles.
 * Cycle de vie d'un rendez-vous :
 *   awaiting_payment -> confirmed -> completed (compte rendu du consultant)
 *                    \-> cancelled (politique d'annulation §6 : avoir si > 24 h avant)
 */
import { db } from '../../mock/db'
import { respond, uid } from '../../mock/mockUtils'
import { ApiError } from '../../http/ApiError'
import { APP_CONFIG } from '@/config/app.config'
import { openThread, systemMessage } from './messaging.mock'

const consultants = () => db.find('team', (m) => m.role === 'consultant' && m.status === 'active')
  .map(({ id, name, speciality, languages, title }) => ({ id, name, speciality, languages, title }))

/** Date + créneau -> timestamp (pour trier et appliquer la politique d'annulation) */
export const bookingStart = (b) => new Date(`${b.date}T${b.slot}:00`).getTime()

export const consultantMock = {
  async listConsultants() { return respond(consultants(), 200) },

  /** Créneaux du jour pour un consultant : occupés par les rendez-vous existants + pseudo-aléa stable */
  async availability(date, consultantId = null) {
    const taken = new Set(db.find('bookings', (b) => b.date === date && (!consultantId || b.consultantId === consultantId) && ['confirmed', 'awaiting_payment'].includes(b.status)).map((b) => b.slot))
    const seed = date.split('-').reduce((s, n) => s + Number(n), 0) + (consultantId ? consultantId.length : 0)
    const slots = APP_CONFIG.consultant.slotsPerDay.map((time, i) => ({ time, free: !taken.has(time) && (seed + i) % 4 !== 0 }))
    return respond(slots, 250)
  },

  async book({ userId, userName, companyId = null, fellowNumber = null, consultantId, date, slot, durationMin, topic, mode = 'visio', notes = '' }) {
    const c = db.get('team', consultantId) ?? consultants()[0]
    const amount = Math.round((APP_CONFIG.consultant.hourlyRateXaf * durationMin) / 60)
    const booking = db.insert('bookings', {
      id: uid('bk'), userId, userName, companyId, fellowNumber, consultantId: c.id, consultant: c.name, speciality: c.speciality,
      date, slot, durationMin, topic, mode, meetingLink: mode === 'visio' ? `https://meet.kec.africa/${c.name.split(' ').at(-1).toLowerCase()}-${fellowNumber ?? 'kec'}` : null,
      amount, status: 'awaiting_payment', paymentId: null, createdAt: new Date().toISOString(), confirmedAt: null, completedAt: null, summary: null, notes
    })
    return respond(booking, 500)
  },

  /** Confirmation après paiement : rattache le paiement, ouvre un fil de messagerie avec le consultant */
  async confirm(bookingId, paymentId = null) {
    const b = db.get('bookings', bookingId)
    if (!b) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    db.update('bookings', bookingId, { status: 'confirmed', paymentId, confirmedAt: new Date().toISOString() })
    const pay = paymentId ? db.get('payments', paymentId) : null
    openThread({
      kind: 'consultant', reason: 'booking', fellowId: b.userId, assigneeId: b.consultantId, tags: ['rdv'],
      subject: `Rendez-vous confirmé : ${b.topic}`,
      messages: [systemMessage(`Réservation payée (${b.amount.toLocaleString('fr-FR')} FCFA${pay ? `, ${pay.method === 'bank' ? 'virement' : pay.method === 'om' ? 'Orange Money' : 'MTN MoMo'}` : ''}). Rendez-vous avec ${b.consultant}, ${b.durationMin} min, le ${b.date} à ${b.slot}.`)]
    })
    return respond(db.get('bookings', bookingId), 200)
  },

  /** Annulation par le fellow : avoir intégral si > freeCancellationHours avant, sinon 50 % */
  async cancel(bookingId, reason = '') {
    const b = db.get('bookings', bookingId)
    if (!b) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    if (!['confirmed', 'awaiting_payment'].includes(b.status)) throw new ApiError('INVALID_STATE', 'errors.generic', 409)
    const hoursBefore = (bookingStart(b) - Date.now()) / 3600000
    const refund = b.status === 'confirmed'
      ? { type: 'credit', amount: hoursBefore >= APP_CONFIG.consultant.freeCancellationHours ? b.amount : Math.round(b.amount / 2) }
      : null
    db.update('bookings', bookingId, { status: 'cancelled', cancelledAt: new Date().toISOString(), cancelReason: reason, cancelledBy: 'fellow', refund })
    if (refund && b.paymentId && db.get('payments', b.paymentId)) db.update('payments', b.paymentId, { refund })
    return respond(db.get('bookings', bookingId), 300)
  },

  async listMine(userId) {
    return respond([...db.find('bookings', (b) => b.userId === userId)].sort((a, b) => bookingStart(b) - bookingStart(a)))
  }
}

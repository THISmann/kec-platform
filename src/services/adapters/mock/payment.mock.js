/**
 * Paiements (MTN MoMo, Orange Money, virement bancaire) — mock.
 * Flux réel attendu : initiate -> (push USSD sur le téléphone / instructions
 * de virement) -> webhook opérateur -> statut "succeeded".
 * Ici on simule la confirmation après quelques secondes.
 *
 * Programme : réglable par tranches (acompte / solde) — voir `programInstallments`.
 * Consultation : lié à une réservation via `bookingId`.
 */
import { db } from '../../mock/db'
import { respond, uid, delay } from '../../mock/mockUtils'
import { ApiError } from '../../http/ApiError'
import { publish } from '../../realtime/realtime.mock'
import { APP_CONFIG } from '@/config/app.config'

export const paymentMock = {
  async initiate({ userId, payerName, purpose, amount, method, phone, bookingId = null, installment = null }) {
    await delay(700)
    const m = APP_CONFIG.paymentMethods.find((x) => x.id === method)
    if (!m || m.soon) throw new ApiError('METHOD_UNAVAILABLE', 'errors.generic', 422)
    if (m.kind === 'mobile' && !/^\+?\d[\d\s]{7,}$/.test(String(phone || ''))) {
      throw new ApiError('INVALID_PHONE', 'errors.invalidPhone', 422)
    }
    const payment = db.insert('payments', {
      id: uid('pay'), userId, payerName, purpose, amount, method, phone, bookingId, installment,
      status: method === 'bank' ? 'awaiting_transfer' : 'pending',
      reference: `KEC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString()
    })
    return respond(payment, 0)
  },

  /** Interroge le statut (polling). En mock : succès au 2e appel (le numéro finissant par 00 échoue, pour tester). */
  async status(id) {
    await delay(1400)
    const p = db.get('payments', id)
    if (!p) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    if (p.status === 'pending') {
      const fails = /00\s*$/.test(String(p.phone || ''))
      db.update('payments', id, fails
        ? { status: 'failed', failureReason: 'Transaction refusée par l\'opérateur' }
        : { status: 'succeeded', receiptNo: `RC-2026-${Math.floor(2000 + Math.random() * 7999)}`, paidAt: new Date().toISOString() })
      if (!fails) publish('payment.succeeded', db.get('payments', id))
    }
    return respond(db.get('payments', id), 0)
  },

  async listMine(userId) {
    return respond([...db.find('payments', (p) => p.userId === userId)].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }
}

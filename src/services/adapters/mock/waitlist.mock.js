/**
 * Liste d'attente (salle d'attente virtuelle) — mock.
 * Chaque inscription reçoit un numéro de ticket séquentiel, est
 * scorée (pré-qualification) puis diffusée en temps réel (Kia, back-office).
 */
import { db } from '../../mock/db'
import { respond, uid, delay } from '../../mock/mockUtils'
import { ApiError } from '../../http/ApiError'
import { publish } from '../../realtime/realtime.mock'
import { APP_CONFIG } from '@/config/app.config'

/** Score indicatif de pré-qualification (0-100), affiné ensuite par l'équipe */
function prequalify(entry) {
  let s = 45
  if (entry.projectStage === 'informal') s += 15
  if (entry.projectStage === 'existing') s += 22
  if ((entry.projectSummary || '').length > 60) s += 10
  if (entry.needs?.length) s += Math.min(entry.needs.length * 3, 12)
  if (entry.phone) s += 5
  return Math.min(100, s)
}

export const waitlistMock = {
  async join(payload) {
    await delay(900)
    const email = String(payload.email || '').trim().toLowerCase()
    if (db.findOne('waitlist', (w) => w.email === email)) {
      throw new ApiError('ALREADY_REGISTERED', 'errors.alreadyRegistered', 409)
    }
    const ticket = db.nextSequence('ticket')
    const entry = db.insert('waitlist', {
      id: uid('wl'),
      ticket,
      ...payload,
      email,
      isDiaspora: payload.residenceCountry && payload.residenceCountry !== 'Cameroun',
      score: prequalify(payload),
      status: 'pending',
      createdAt: new Date().toISOString()
    })
    publish('waitlist.signup', entry)
    const total = db.all('waitlist').length
    return respond({ entry, total, seats: APP_CONFIG.program.cohortSize }, 0)
  },

  /** Statistiques publiques affichées dans la salle d'attente */
  async publicStats() {
    const all = db.all('waitlist')
    const dayAgo = Date.now() - 86400000
    return respond({
      total: all.length,
      today: all.filter((w) => new Date(w.createdAt).getTime() > dayAgo).length,
      diaspora: all.filter((w) => w.isDiaspora).length,
      seats: APP_CONFIG.program.cohortSize,
      recent: all.slice(0, 8).map((w) => ({ firstName: w.firstName, city: w.targetCity, residence: w.residenceCountry, at: w.createdAt }))
    }, 200)
  }
}

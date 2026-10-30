/**
 * Temps réel — version mock.
 * ─────────────────────────────────────────────────────────────
 * - BroadcastChannel : une inscription faite dans un onglet (salle
 *   d'attente) apparaît instantanément dans un autre onglet ouvert sur
 *   Kia ou le back-office. Parfait pour une démo devant investisseurs.
 * - Simulateur optionnel : génère de fausses inscriptions/paiements
 *   à intervalle aléatoire pour montrer le "pouls" de la plateforme.
 *
 * Évènements émis : { type, payload, at }
 *   - 'waitlist.signup'     payload: WaitlistEntry (public)
 *   - 'payment.succeeded'   payload: Payment
 *   - 'fellow.selected'     payload: { id, firstName, city }
 */
import { db } from '../mock/db'
import { uid } from '../mock/mockUtils'

const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('kec-live') : null
const listeners = new Set()

function dispatch(event) {
  listeners.forEach((fn) => fn(event))
}

channel?.addEventListener('message', (e) => dispatch(e.data))

/** Publie un évènement (onglet courant + autres onglets) */
export function publish(type, payload) {
  const event = { type, payload, at: new Date().toISOString() }
  dispatch(event)
  // Copie JSON : les objets réactifs de Vue (Proxy) ne sont pas clonables par BroadcastChannel
  try { channel?.postMessage(JSON.parse(JSON.stringify(event))) } catch { /* diffusion inter-onglets facultative */ }
}

const SIM_FIRST = ['Aminatou', 'Serge', 'Prisca', 'Arnaud', 'Ornella', 'Cédric', 'Danielle', 'Ibrahim', 'Laure', 'Stéphane', 'Rachel', 'Jules']
const SIM_CITY = ['Douala', 'Yaoundé', 'Bafoussam', 'Kribi', 'Edéa', 'Buea', 'Garoua']
const SIM_RES = ['Cameroun', 'Cameroun', 'Cameroun', 'France', 'Allemagne', 'Canada', 'Belgique']
const SIM_CH = ['facebook', 'wordOfMouth', 'linkedin', 'fieldAgent', 'whatsapp', 'tiktok']
const SIM_SECTOR = ['agri', 'commerce', 'tech', 'food', 'fashion', 'services']

let simTimer = null
let simUsers = 0

function simulateOnce() {
  const r = Math.random()
  if (r < 0.78) {
    const ticket = db.nextSequence('ticket')
    const residence = SIM_RES[Math.floor(Math.random() * SIM_RES.length)]
    const entry = db.insert('waitlist', {
      id: uid('wl'),
      ticket,
      firstName: SIM_FIRST[Math.floor(Math.random() * SIM_FIRST.length)],
      lastName: '•',
      email: `demo${ticket}@mail.cm`,
      residenceCountry: residence,
      isDiaspora: residence !== 'Cameroun',
      targetCountry: 'CM',
      targetCity: SIM_CITY[Math.floor(Math.random() * SIM_CITY.length)],
      sector: SIM_SECTOR[Math.floor(Math.random() * SIM_SECTOR.length)],
      projectStage: 'idea',
      acquisitionChannel: SIM_CH[Math.floor(Math.random() * SIM_CH.length)],
      needs: [],
      score: Math.round(40 + Math.random() * 60),
      status: 'pending',
      simulated: true,
      createdAt: new Date().toISOString()
    })
    publish('waitlist.signup', entry)
  } else {
    const payment = db.insert('payments', {
      id: uid('pay'),
      payerName: `${SIM_FIRST[Math.floor(Math.random() * SIM_FIRST.length)]} •`,
      purpose: Math.random() > 0.3 ? 'program' : 'consultant',
      amount: Math.random() > 0.3 ? 300000 : 15000,
      method: ['momo', 'om', 'bank'][Math.floor(Math.random() * 3)],
      status: 'succeeded',
      reference: `KEC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      simulated: true,
      createdAt: new Date().toISOString()
    })
    publish('payment.succeeded', payment)
  }
}

function scheduleNext() {
  simTimer = setTimeout(() => { simulateOnce(); scheduleNext() }, 7000 + Math.random() * 9000)
}

export const realtimeMock = {
  /** S'abonner aux évènements live. Retourne une fonction de désabonnement. */
  subscribe(handler, { simulate = false } = {}) {
    listeners.add(handler)
    if (simulate) {
      simUsers++
      if (!simTimer) scheduleNext()
    }
    return () => {
      listeners.delete(handler)
      if (simulate && --simUsers <= 0) { clearTimeout(simTimer); simTimer = null; simUsers = 0 }
    }
  },
  publish
}

/** Calculs d'indicateurs partagés entre Kia (investisseurs) et le back-office. */
import { db } from '../../mock/db'
import { APP_CONFIG } from '@/config/app.config'

const DAY = 86400000

export function computeKpis() {
  const wl = db.all('waitlist')
  const pays = db.all('payments').filter((p) => p.status === 'succeeded')
  const now = Date.now()

  const byDay = []
  for (let i = 29; i >= 0; i--) {
    const start = new Date(now - i * DAY); start.setHours(0, 0, 0, 0)
    const end = start.getTime() + DAY
    byDay.push({
      date: start.toISOString().slice(0, 10),
      count: wl.filter((w) => { const t = new Date(w.createdAt).getTime(); return t >= start.getTime() && t < end }).length
    })
  }

  const channels = {}
  wl.forEach((w) => { channels[w.acquisitionChannel] = (channels[w.acquisitionChannel] ?? 0) + 1 })

  const cities = {}
  wl.forEach((w) => { cities[w.targetCity] = (cities[w.targetCity] ?? 0) + 1 })

  const revenue = pays.reduce((s, p) => s + p.amount, 0)
  return {
    waitlistTotal: wl.length,
    waitlistToday: wl.filter((w) => now - new Date(w.createdAt).getTime() < DAY).length,
    waitlistWeek: wl.filter((w) => now - new Date(w.createdAt).getTime() < 7 * DAY).length,
    waitlistGoal: APP_CONFIG.program.waitlistGoal,
    selected: wl.filter((w) => w.status === 'selected').length,
    shortlisted: wl.filter((w) => w.status === 'shortlisted').length,
    seats: APP_CONFIG.program.cohortSize,
    diasporaShare: wl.length ? Math.round((wl.filter((w) => w.isDiaspora).length / wl.length) * 100) : 0,
    revenueXaf: revenue,
    revenueToday: pays.filter((p) => now - new Date(p.createdAt).getTime() < DAY).reduce((s, p) => s + p.amount, 0),
    potentialXaf: APP_CONFIG.program.cohortSize * APP_CONFIG.program.priceXaf,
    paymentsCount: pays.length,
    byDay,
    channels: Object.entries(channels).map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count),
    cities: Object.entries(cities).map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count).slice(0, 8)
  }
}

export function recentActivity(limit = 20) {
  const signups = db.all('waitlist').slice(0, limit).map((w) => ({
    type: 'waitlist.signup', at: w.createdAt, payload: { firstName: w.firstName, city: w.targetCity, residence: w.residenceCountry, sector: w.sector, ticket: w.ticket }
  }))
  const pays = db.all('payments').filter((p) => p.status === 'succeeded').slice(0, limit).map((p) => ({
    type: 'payment.succeeded', at: p.createdAt, payload: { payerName: p.payerName, amount: p.amount, method: p.method, purpose: p.purpose }
  }))
  return [...signups, ...pays].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)
}

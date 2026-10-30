/** Authentification — mock. Comptes de démo définis dans mock/seed.js */
import { db } from '../../mock/db'
import { respond, delay } from '../../mock/mockUtils'
import { ApiError } from '../../http/ApiError'

import { APP_CONFIG } from '@/config/app.config'

/** Supprime le mot de passe et, pour l'équipe, attache le rôle et les droits issus de la gestion des rôles */
function publicUser({ password, ...u }) {
  if (u.role !== 'staff') return u
  const member = db.get('team', u.id)
  const teamRole = member?.role ?? u.teamRole ?? 'agent'
  return { ...u, teamRole, title: member?.title ?? u.title, permissions: APP_CONFIG.team.rolePermissions[teamRole] ?? [] }
}

export const authMock = {
  async login({ email, password }) {
    await delay()
    const user = db.findOne('users', (u) => u.email.toLowerCase() === String(email).trim().toLowerCase())
    if (!user || user.password !== password) throw new ApiError('INVALID_CREDENTIALS', 'errors.invalidCredentials', 401)
    if (user.role === 'staff' && db.get('team', user.id)?.status === 'disabled') throw new ApiError('ACCOUNT_DISABLED', 'errors.accountDisabled', 403)
    if (user.role === 'staff') db.update('team', user.id, { lastLoginAt: new Date().toISOString() })
    return { token: `mock.${user.id}`, user: publicUser(user) }
  },

  async me(token) {
    const id = String(token || '').replace('mock.', '')
    const user = db.get('users', id)
    if (!user) throw new ApiError('UNAUTHORIZED', 'errors.sessionExpired', 401)
    return respond(publicUser(user), 120)
  },

  async logout() { return respond(true, 100) }
}

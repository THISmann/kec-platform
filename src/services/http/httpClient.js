/**
 * ─────────────────────────────────────────────────────────────
 *  Client HTTP minimaliste (fetch) utilisé par les adaptateurs "http".
 * ─────────────────────────────────────────────────────────────
 * - Préfixe automatiquement VITE_API_BASE_URL
 * - Ajoute le jeton d'authentification (Bearer) s'il existe
 * - Sérialise JSON / FormData
 * - Normalise les erreurs en ApiError (même forme que les mocks)
 *
 * Pour brancher un intercepteur (refresh token, logs, Sentry…),
 * c'est ici et seulement ici.
 */
import { ApiError } from './ApiError'
import { tokenStorage } from './tokenStorage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(method, path, { body, query, headers = {}, signal } = {}) {
  const url = new URL(BASE_URL.replace(/\/$/, '') + path, window.location.origin)
  if (query) Object.entries(query).forEach(([k, v]) => v != null && url.searchParams.set(k, v))

  const isForm = body instanceof FormData
  const token = tokenStorage.get()

  let response
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(isForm || body == null ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
      },
      body: body == null ? undefined : isForm ? body : JSON.stringify(body)
    })
  } catch (e) {
    throw new ApiError('NETWORK', 'errors.network', 0, e)
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : await response.text()

  if (!response.ok) {
    throw new ApiError(payload?.code || `HTTP_${response.status}`, payload?.message || 'errors.generic', response.status, payload)
  }
  return payload
}

export const http = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts) => request('POST', path, { ...opts, body }),
  put: (path, body, opts) => request('PUT', path, { ...opts, body }),
  patch: (path, body, opts) => request('PATCH', path, { ...opts, body }),
  delete: (path, opts) => request('DELETE', path, opts),
  baseUrl: BASE_URL
}

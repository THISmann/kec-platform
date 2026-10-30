/**
 * Temps réel — version HTTP (Server-Sent Events).
 * Le backend expose GET {API}/live/stream (text/event-stream) et pousse
 * des messages JSON { type, payload, at } — même contrat que le mock.
 * Remplaçable par WebSocket / Pusher / Firebase sans toucher à l'UI.
 */
import { http } from '../http/httpClient'
import { tokenStorage } from '../http/tokenStorage'

export const realtimeHttp = {
  subscribe(handler) {
    const url = `${http.baseUrl}/live/stream?token=${encodeURIComponent(tokenStorage.get() ?? '')}`
    const source = new EventSource(url)
    source.onmessage = (e) => {
      try { handler(JSON.parse(e.data)) } catch { /* message ignoré */ }
    }
    return () => source.close()
  },
  publish() { /* côté serveur uniquement en mode http */ }
}

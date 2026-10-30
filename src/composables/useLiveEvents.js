/**
 * Abonnement aux évènements temps réel (inscriptions, paiements…)
 * le temps de vie du composant. Fonctionne en mock comme en http.
 */
import { onMounted, onBeforeUnmount } from 'vue'
import { api, API_MODE } from '@/services'

export function useLiveEvents(handler, { simulate = false } = {}) {
  let unsubscribe = null
  onMounted(() => { unsubscribe = api.realtime.subscribe(handler, { simulate: simulate && API_MODE === 'mock' }) })
  onBeforeUnmount(() => unsubscribe?.())
}

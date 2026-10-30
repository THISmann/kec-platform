/**
 * Exécute une fonction asynchrone et expose { data, loading, error, run }.
 * Simplifie tous les écrans qui chargent des données depuis `api`.
 */
import { ref, shallowRef } from 'vue'

export function useAsync(fn, { immediate = true, initial = null } = {}) {
  const data = shallowRef(initial)
  const loading = ref(false)
  const error = ref(null)

  async function run(...args) {
    loading.value = true
    error.value = null
    try {
      data.value = await fn(...args)
      return data.value
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  if (immediate) run().catch(() => {})
  return { data, loading, error, run }
}

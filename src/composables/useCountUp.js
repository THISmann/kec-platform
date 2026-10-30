/** Anime un nombre de sa valeur précédente vers la nouvelle (compteurs live). */
import { ref, watch, unref } from 'vue'

export function useCountUp(source, { duration = 1400 } = {}) {
  const display = ref(0)
  let frame = null

  watch(() => unref(source), (to, from = 0) => {
    cancelAnimationFrame(frame)
    const start = performance.now()
    const begin = display.value || from || 0
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      display.value = Math.round(begin + ((to ?? 0) - begin) * eased)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }, { immediate: true })

  return display
}

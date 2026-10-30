/**
 * Directive v-reveal : fait apparaître un élément quand il entre à l'écran.
 * Usage : <section v-reveal> ou v-reveal="150" (délai en ms)
 */
const observer = typeof IntersectionObserver !== 'undefined'
  ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target) }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  : null

export const reveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    observer ? observer.observe(el) : el.classList.add('is-visible')
  },
  unmounted(el) { observer?.unobserve(el) }
}

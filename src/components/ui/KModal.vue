<script setup>
/** Fenêtre modale accessible (Échap pour fermer, clic sur le fond). */
import { watch, onBeforeUnmount } from 'vue'
const props = defineProps({ open: Boolean, title: { type: String, default: '' }, wide: Boolean })
const emit = defineEmits(['close'])
const onKey = (e) => { if (e.key === 'Escape') emit('close') }
watch(() => props.open, (o) => {
  document.body.style.overflow = o ? 'hidden' : ''
  o ? window.addEventListener('keydown', onKey) : window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="k-modal" role="dialog" aria-modal="true" :aria-label="title" @click.self="emit('close')">
        <div class="k-modal__box wood-panel" :class="{ wide }">
          <header class="k-modal__head">
            <h3>{{ title }}</h3>
            <button class="close" type="button" :aria-label="$t('common.close')" @click="emit('close')">✕</button>
          </header>
          <div class="k-modal__body"><slot /></div>
          <footer v-if="$slots.footer" class="k-modal__foot"><slot name="footer" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.k-modal {
  position: fixed; inset: 0; z-index: 8000; display: grid; place-items: center; padding: 1rem;
  background: rgba(10, 6, 3, .7); backdrop-filter: blur(6px);
}
.k-modal__box { width: min(560px, 100%); max-height: 90vh; overflow: auto; padding: 1.5rem; }
.k-modal__box.wide { width: min(880px, 100%); }
.k-modal__head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; h3 { margin: 0; } }
.close { background: none; border: 0; color: var(--kec-text-muted); font-size: 1.1rem; padding: .3rem .5rem; border-radius: 8px; &:hover { color: var(--kec-ivory); background: rgba(255,255,255,.06); } }
.k-modal__foot { display: flex; justify-content: flex-end; gap: .75rem; margin-top: 1.25rem; flex-wrap: wrap; }
.modal-enter-active, .modal-leave-active { transition: opacity .3s; .k-modal__box { transition: transform .4s var(--ease-spring); } }
.modal-enter-from, .modal-leave-to { opacity: 0; .k-modal__box { transform: translateY(20px) scale(.97); } }
</style>

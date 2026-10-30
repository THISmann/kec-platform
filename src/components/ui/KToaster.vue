<script setup>
/** Pile de notifications (alimentée par useUiStore().toast()). */
import { useUiStore } from '@/stores/ui'
import CowrieShape from '@/components/brand/CowrieShape.vue'
const ui = useUiStore()
</script>

<template>
  <div class="k-toaster" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="t in ui.toasts" :key="t.id" class="toast" :class="`t-${t.type}`" @click="ui.dismiss(t.id)">
        <span class="ico">{{ t.icon }}</span>
        <CowrieShape v-if="!t.icon" :size="14" :tone="t.type === 'error' ? 'sand' : 'ivory'" />
        <span>{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.k-toaster { position: fixed; z-index: 8500; top: 1rem; inset-inline-end: 1rem; inset-inline-start: 1rem; display: flex; flex-direction: column; align-items: flex-end; gap: .6rem; pointer-events: none; }
.toast {
  pointer-events: auto; cursor: pointer; max-width: 420px;
  display: flex; align-items: center; gap: .7rem;
  padding: .85rem 1.1rem; border-radius: 16px;
  background: rgba(44, 28, 18, .95); backdrop-filter: blur(8px);
  border: 1px solid var(--kec-border); box-shadow: var(--shadow-soft);
  font-size: .92rem;
}
.ico:empty { display: none; }
.t-success { border-color: rgba(143, 163, 90, .6); }
.t-error { border-color: rgba(208, 87, 62, .7); }
.t-live { border-color: var(--kec-gold); box-shadow: var(--shadow-glow); }
.toast-enter-active, .toast-leave-active { transition: all .45s var(--ease-spring); }
.toast-enter-from { opacity: 0; transform: translateX(40px) scale(.95); }
.toast-leave-to { opacity: 0; transform: translateY(-10px); }
</style>

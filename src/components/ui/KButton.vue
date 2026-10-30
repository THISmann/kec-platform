<script setup>
/**
 * Bouton identitaire KEC.
 * Variantes :
 *  - cowrie : porcelaine ivoire du cauri, petit cauri qui pivote au survol (action principale)
 *  - cola   : noix de cola rouge-rosé, forme organique fendue (action secondaire chaleureuse)
 *  - wood   : bois de noyer verni, liseré doré
 *  - ghost  : discret
 * Rend un <RouterLink> si `to` est fourni, un <a> si `href`, sinon un <button>.
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import ColaNut from '@/components/brand/ColaNut.vue'

const props = defineProps({
  variant: { type: String, default: 'cowrie' },
  size: { type: String, default: 'md' }, // sm | md | lg
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
  icon: { type: Boolean, default: true }
})

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const attrs = computed(() => (props.to ? { to: props.to } : props.href ? { href: props.href } : { type: props.type, disabled: props.disabled || props.loading }))
</script>

<template>
  <component
    :is="tag" v-bind="attrs"
    class="k-btn" :class="[`k-btn--${variant}`, `k-btn--${size}`, { 'is-block': block, 'is-loading': loading }]"
    :aria-busy="loading || undefined"
  >
    <span v-if="icon && variant === 'cowrie'" class="k-btn__icon"><CowrieShape :size="size === 'lg' ? 18 : 14" /></span>
    <span v-else-if="icon && variant === 'cola'" class="k-btn__icon"><ColaNut :size="size === 'lg' ? 22 : 18" /></span>
    <span class="k-btn__label"><slot /></span>
    <span v-if="loading" class="k-btn__spinner" aria-hidden="true" />
    <span class="k-btn__shine" aria-hidden="true" />
  </component>
</template>

<style scoped lang="scss">
.k-btn {
  position: relative; isolation: isolate; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center; gap: .65rem;
  border: 0; text-decoration: none; font-weight: 700; letter-spacing: .01em;
  transition: transform .35s var(--ease-spring), box-shadow .35s var(--ease-out), filter .3s;
  -webkit-tap-highlight-color: transparent; white-space: nowrap;

  &:hover:not(:disabled) { transform: translateY(-2px); }
  &:active:not(:disabled) { transform: translateY(1px) scale(.98); }
  &:disabled { opacity: .55; cursor: not-allowed; }
  &.is-block { display: flex; width: 100%; }
  &.is-loading .k-btn__label { opacity: .55; }
}

.k-btn--sm { padding: .5rem 1rem; font-size: .85rem; }
.k-btn--md { padding: .85rem 1.5rem; font-size: .95rem; }
.k-btn--lg { padding: 1.1rem 2rem; font-size: 1.05rem; }

/* ── Cauri : porcelaine ivoire, bord nacré ── */
.k-btn--cowrie {
  color: #3a2416;
  border-radius: 999px;
  background:
    radial-gradient(120% 140% at 30% 0%, #fffaf0 0%, #f2e7cf 45%, #d9c39c 100%);
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, .9),
    inset 0 -3px 6px rgba(140, 100, 50, .35),
    0 10px 24px -10px rgba(239, 227, 201, .55),
    0 0 0 1px rgba(201, 174, 134, .7);
  &:hover:not(:disabled) { box-shadow: inset 0 2px 0 #fff, inset 0 -3px 6px rgba(140, 100, 50, .35), 0 16px 34px -10px rgba(239, 227, 201, .7), 0 0 0 1px #d6a548; }
  .k-btn__icon { transition: transform .6s var(--ease-spring); }
  &:hover .k-btn__icon { transform: rotate(200deg) scale(1.15); }
}

/* ── Cola : forme organique, fente centrale ── */
.k-btn--cola {
  color: #fff3ea;
  border-radius: 46% 54% 52% 48% / 62% 58% 42% 38%;
  background: radial-gradient(130% 160% at 30% 10%, #e08f75 0%, #b14a3c 45%, #6e2620 100%);
  box-shadow: inset 0 2px 0 rgba(255, 220, 200, .35), inset 0 -4px 8px rgba(40, 8, 5, .45), 0 12px 26px -12px rgba(177, 74, 60, .7);
  &::before {
    content: ''; position: absolute; z-index: -1; left: 50%; top: 8%; bottom: 8%; width: 2px;
    background: linear-gradient(transparent, rgba(60, 15, 10, .45), transparent);
    transform: translateX(-50%) rotate(8deg); border-radius: 2px;
  }
  .k-btn__icon { transition: transform .5s var(--ease-spring); }
  &:hover .k-btn__icon { transform: rotate(-25deg) scale(1.1); }
  &:hover:not(:disabled) { border-radius: 52% 48% 46% 54% / 46% 52% 48% 54%; }
}

/* ── Bois verni ── */
.k-btn--wood {
  color: var(--kec-ivory);
  border-radius: 14px;
  background-color: var(--kec-walnut);
  @include wood-grain(.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .12), 0 0 0 1px rgba(214, 165, 72, .45), 0 10px 22px -12px #000;
  &:hover:not(:disabled) { box-shadow: inset 0 1px 0 rgba(255, 255, 255, .18), 0 0 0 1px var(--kec-gold), 0 14px 28px -12px #000; }
}

.k-btn--ghost {
  color: var(--kec-ivory); background: transparent; border-radius: 999px;
  box-shadow: inset 0 0 0 1px var(--kec-border);
  &:hover:not(:disabled) { box-shadow: inset 0 0 0 1px var(--kec-gold); color: var(--kec-gold-soft); }
}

.k-btn--danger {
  color: #fff; border-radius: 999px; background: var(--kec-danger);
}

/* Reflet qui balaie le bouton au survol */
.k-btn__shine {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, .45) 50%, transparent 70%);
  transform: translateX(-120%);
}
.k-btn:hover .k-btn__shine { transition: transform .9s var(--ease-out); transform: translateX(120%); }
.k-btn--wood .k-btn__shine, .k-btn--ghost .k-btn__shine { opacity: .25; }

.k-btn__icon { display: inline-flex; }
.k-btn__spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid currentColor; border-right-color: transparent;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>

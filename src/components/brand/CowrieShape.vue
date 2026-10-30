<script setup>
/**
 * Cauri en SVG (petit coquillage blanc/beige — Monetaria moneta).
 * Élément identitaire central de KEC : icônes, boutons, puces, loaders.
 */
import { computed, useId } from 'vue'
import { COWRIE_BODY, COWRIE_SLIT, COWRIE_TEETH } from './cowriePath'

const props = defineProps({
  size: { type: [Number, String], default: 24 },
  tone: { type: String, default: 'ivory' }, // ivory | gold | sand | ink
  title: { type: String, default: '' }
})

const uid = useId()
const tones = {
  ivory: ['#fffaf0', '#efe3c9', '#c9ae86', '#5a3a24'],
  gold: ['#fff1c9', '#e2b764', '#a7752c', '#4a2e12'],
  sand: ['#f8e6c8', '#ddb98a', '#a77d4f', '#4a2e1a'],
  ink: ['#8a6a50', '#5a3a24', '#3a2416', '#e9c983']
}
// computed : la teinte suit les changements de prop (ex. places attribuées)
const c = computed(() => tones[props.tone] ?? tones.ivory)
</script>

<template>
  <svg
    :width="size" :height="Number(size) * 80 / 60" viewBox="0 0 60 80"
    :role="title ? 'img' : 'presentation'" :aria-label="title || undefined" :aria-hidden="!title"
    class="cowrie"
  >
    <defs>
      <radialGradient :id="`cw-${uid}`" cx="38%" cy="28%" r="80%">
        <stop offset="0%" :stop-color="c[0]" />
        <stop offset="55%" :stop-color="c[1]" />
        <stop offset="100%" :stop-color="c[2]" />
      </radialGradient>
    </defs>
    <path :d="COWRIE_BODY" :fill="`url(#cw-${uid})`" />
    <path :d="COWRIE_SLIT" fill="none" :stroke="c[3]" stroke-width="3.2" stroke-linecap="round" />
    <path :d="COWRIE_TEETH" fill="none" :stroke="c[3]" stroke-width="1.6" stroke-linecap="round" opacity=".75" />
    <ellipse cx="20" cy="20" rx="6" ry="9" fill="#fff" opacity=".35" transform="rotate(-20 20 20)" />
  </svg>
</template>

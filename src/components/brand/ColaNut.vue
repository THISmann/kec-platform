<script setup>
/**
 * Noix de cola (la cola du village) — symbole d'hospitalité et de parole donnée.
 * Utilisée pour les boutons secondaires et les marqueurs d'accueil.
 */
import { useId } from 'vue'
defineProps({ size: { type: [Number, String], default: 24 } })
const uid = useId()
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true" class="cola">
    <defs>
      <radialGradient :id="`cola-${uid}`" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#f0b49b" />
        <stop offset="45%" stop-color="#c25e4b" />
        <stop offset="100%" stop-color="#6e2620" />
      </radialGradient>
    </defs>
    <path d="M32 4c13 0 26 8 27 23 1 16-9 31-26 33C16 62 4 50 5 33 6 16 18 4 32 4Z" :fill="`url(#cola-${uid})`" />
    <path d="M30 7c4 9 6 18 3 27-2 9-1 17 2 24" fill="none" stroke="#4a1914" stroke-width="2.2" stroke-linecap="round" opacity=".7" />
    <ellipse cx="21" cy="19" rx="6" ry="4" fill="#fff" opacity=".25" transform="rotate(-30 21 19)" />
  </svg>
</template>

<script setup>
/** Sceau "Certifié KEC" : médaillon doré gravé, cauri au centre. Grisé tant que non obtenu. */
import CowrieShape from '@/components/brand/CowrieShape.vue'
defineProps({ size: { type: Number, default: 72 }, active: Boolean })
</script>

<template>
  <span class="seal" :class="{ active }" :style="{ width: `${size}px`, height: `${size}px` }" :title="active ? $t('cert.certified') : $t('cert.pending')">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path id="seal-circle" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1 -72 0" />
      </defs>
      <g class="teeth">
        <circle v-for="i in 24" :key="i" :cx="50 + 46 * Math.cos((i / 24) * Math.PI * 2)" :cy="50 + 46 * Math.sin((i / 24) * Math.PI * 2)" r="5" />
      </g>
      <circle cx="50" cy="50" r="44" class="disc" />
      <circle cx="50" cy="50" r="30" fill="none" class="ring" stroke-width="1.2" />
      <text font-size="8.6" letter-spacing="2.4" class="txt"><textPath href="#seal-circle">CERTIFIÉ · KEC · CERTIFIED ·</textPath></text>
    </svg>
    <span class="core"><CowrieShape :size="size * 0.24" :tone="active ? 'ivory' : 'ink'" /></span>
  </span>
</template>

<style scoped>
.seal { position: relative; display: inline-grid; place-items: center; filter: grayscale(1) opacity(.45); transition: filter .8s; }
.seal.active { filter: none; animation: shine 4s ease-in-out infinite; }
@keyframes shine { 50% { filter: drop-shadow(0 0 12px rgba(214, 165, 72, .7)); } }
svg { position: absolute; inset: 0; width: 100%; height: 100%; animation: rotate 40s linear infinite; }
@keyframes rotate { to { transform: rotate(360deg); } }
.teeth circle, .disc { fill: #c9963b; }
.disc { fill: #b7832e; }
.ring { stroke: #fff1c9; }
.txt { fill: #2a1a12; font-weight: 800; font-family: var(--font-body); }
.core { position: relative; }
</style>

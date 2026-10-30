<script setup>
/** Chargement : trois cauris qui sautillent (comme un lancer de cauris). */
import CowrieShape from '@/components/brand/CowrieShape.vue'
defineProps({ label: { type: String, default: '' } })
</script>

<template>
  <div class="k-loader" role="status">
    <span class="shells"><CowrieShape v-for="i in 3" :key="i" :size="12" /></span>
    <span v-if="label" class="lbl">{{ label }}</span>
  </div>
</template>

<style scoped>
.k-loader { display: inline-flex; align-items: center; gap: .75rem; color: var(--kec-text-muted); padding: 1rem; }
.shells { display: inline-flex; gap: 5px; }
.shells :deep(svg) { animation: hop 1s var(--ease-out) infinite; }
.shells :deep(svg:nth-child(2)) { animation-delay: .15s; }
.shells :deep(svg:nth-child(3)) { animation-delay: .3s; }
@keyframes hop { 0%, 60%, 100% { transform: translateY(0) rotate(0); } 30% { transform: translateY(-9px) rotate(25deg); } }
.lbl { font-size: .9rem; }
</style>

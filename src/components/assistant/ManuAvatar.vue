<script setup>
/**
 * Portrait illustré de Manu AI, la réceptionniste humanisée :
 * foulard (duku) aux motifs terre cuite & indigo, boucles d'oreilles cauris.
 * Clignement des yeux discret pour l'effet "présence".
 */
defineProps({ size: { type: Number, default: 56 }, online: { type: Boolean, default: true } })
</script>

<template>
  <span class="manu-avatar" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="manu-bg" cx="50%" cy="35%" r="70%">
          <stop offset="0" stop-color="#e9c983" /><stop offset="1" stop-color="#a8703f" />
        </radialGradient>
        <pattern id="manu-wax" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#c0612f" />
          <circle cx="6" cy="6" r="3" fill="#22344f" />
          <circle cx="6" cy="6" r="1.2" fill="#e9c983" />
          <path d="M0 0l3 3M12 12l-3-3M12 0l-3 3M0 12l3-3" stroke="#e9c983" stroke-width="1" />
        </pattern>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#manu-bg)" />
      <!-- Buste -->
      <path d="M18 100c2-18 14-28 32-28s30 10 32 28z" fill="#5f6436" />
      <path d="M40 74c4 6 16 6 20 0v-8H40z" fill="#7a4a2a" />
      <!-- Visage -->
      <ellipse cx="50" cy="52" rx="17" ry="20" fill="#8a5432" />
      <!-- Foulard (duku) -->
      <path d="M28 46c-4-20 10-34 24-34 16 0 28 10 24 32-2-8-10-14-24-14S30 36 28 46z" fill="url(#manu-wax)" />
      <path d="M58 16c12-6 24 0 22 10-4-2-10-2-14 2z" fill="url(#manu-wax)" />
      <path d="M32 34c10-6 26-6 36 0" stroke="#22344f" stroke-width="2" fill="none" opacity=".6" />
      <!-- Yeux -->
      <g class="eyes" fill="#1a110b">
        <ellipse cx="43" cy="53" rx="2.2" ry="2.6" />
        <ellipse cx="57" cy="53" rx="2.2" ry="2.6" />
      </g>
      <path d="M39 48c2-1.5 5-1.5 7 0M54 48c2-1.5 5-1.5 7 0" stroke="#1a110b" stroke-width="1.3" fill="none" stroke-linecap="round" />
      <!-- Sourire -->
      <path d="M44 63c3 3 9 3 12 0" stroke="#4a1914" stroke-width="2" fill="none" stroke-linecap="round" />
      <!-- Boucles d'oreilles cauris -->
      <ellipse cx="33" cy="60" rx="2.6" ry="4" fill="#f5ecdb" />
      <ellipse cx="67" cy="60" rx="2.6" ry="4" fill="#f5ecdb" />
      <path d="M33 57v6M67 57v6" stroke="#5a3a24" stroke-width=".9" />
    </svg>
    <span v-if="online" class="status" />
  </span>
</template>

<style scoped>
.manu-avatar { position: relative; display: inline-block; flex-shrink: 0; border-radius: 50%; box-shadow: 0 0 0 2px var(--kec-gold), 0 6px 18px -6px #000; }
svg { width: 100%; height: 100%; border-radius: 50%; }
.eyes { animation: blink 5s infinite; transform-origin: 50px 53px; }
@keyframes blink { 0%, 94%, 100% { transform: scaleY(1); } 96% { transform: scaleY(.1); } }
.status { position: absolute; inset-inline-end: 2%; bottom: 4%; width: 24%; height: 24%; border-radius: 50%; background: #8fbf5a; border: 2px solid #1a110b; }
</style>

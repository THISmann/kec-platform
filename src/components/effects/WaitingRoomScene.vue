<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  La salle d'attente, vivante ☕
 * ─────────────────────────────────────────────────────────────
 * Tout en SVG animé (CSS + SMIL), sans bibliothèque :
 *  - un ventilateur de plafond qui tourne, une horloge à l'heure réelle,
 *  - une fenêtre en arche : soleil couchant, oiseaux qui passent, palmier
 *    et rideau qui bougent avec le vent,
 *  - une mouche qui tourne autour de la lampe.
 * Le banc et ses occupants sont dans `WaitingBench.vue` (en ligne dans la page).
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'


/* ── Horloge à l'heure réelle ── */
const now = ref(new Date())
let clockTimer
onMounted(() => { clockTimer = setInterval(() => { now.value = new Date() }, 1000) })
onBeforeUnmount(() => clearInterval(clockTimer))
const hands = computed(() => {
  const s = now.value.getSeconds(), m = now.value.getMinutes(), h = now.value.getHours() % 12
  return { s: s * 6, m: m * 6 + s * 0.1, h: h * 30 + m * 0.5 }
})

</script>

<template>
  <div class="scene" aria-hidden="true">
    <!-- ═══ Plafond : ventilateur + horloge ═══ -->
    <svg class="fan" viewBox="0 0 200 200">
      <ellipse cx="100" cy="100" rx="86" ry="22" fill="rgba(0,0,0,.25)" />
      <g class="blades">
        <g v-for="n in 4" :key="n" :transform="`rotate(${n * 90} 100 100)`">
          <path d="M100 100 L92 30 Q100 18 108 30 Z" fill="#5a3a24" stroke="#3a2416" stroke-width="2" />
        </g>
        <circle cx="100" cy="100" r="12" fill="#d6a548" stroke="#8b5a34" stroke-width="3" />
      </g>
    </svg>

    <svg class="clock" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#f5ecdb" stroke="#5a3a24" stroke-width="6" />
      <g stroke="#3a2416" stroke-width="2">
        <line v-for="n in 12" :key="n" x1="50" y1="9" x2="50" y2="14" :transform="`rotate(${n * 30} 50 50)`" />
      </g>
      <line x1="50" y1="50" x2="50" y2="28" stroke="#2a170d" stroke-width="4" stroke-linecap="round" :transform="`rotate(${hands.h} 50 50)`" />
      <line x1="50" y1="52" x2="50" y2="18" stroke="#2a170d" stroke-width="3" stroke-linecap="round" :transform="`rotate(${hands.m} 50 50)`" />
      <line x1="50" y1="56" x2="50" y2="16" stroke="#c0612f" stroke-width="1.5" stroke-linecap="round" :transform="`rotate(${hands.s} 50 50)`" class="sec" />
      <circle cx="50" cy="50" r="3" fill="#c0612f" />
    </svg>

    <!-- ═══ Fenêtre en arche : couchant, oiseaux, palmier, rideau ═══ -->
    <svg class="window" viewBox="0 0 300 420">
      <defs>
        <linearGradient id="wrs-sunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3a1d10" /><stop offset=".55" stop-color="#c0612f" /><stop offset="1" stop-color="#f0c08a" />
        </linearGradient>
        <clipPath id="wrs-arch"><path d="M20 420V150a130 130 0 0 1 260 0v270z" /></clipPath>
        <path id="wrs-flight" d="M-40 120 C60 90 140 140 340 70" />
        <path id="wrs-flight2" d="M340 160 C200 120 120 170 -40 130" />
        <pattern id="wrs-wax" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.4" fill="rgba(255,241,201,.5)" /></pattern>
      </defs>
      <path d="M8 420V150a142 142 0 0 1 284 0v270z" fill="#5a2a16" />
      <g clip-path="url(#wrs-arch)">
        <rect width="300" height="420" fill="url(#wrs-sunset)" />
        <circle class="sun" cx="170" cy="300" r="44" fill="#fff1c9" opacity=".9" />
        <!-- nuages qui dérivent -->
        <g class="cloud c1" fill="#f5d9b5" opacity=".55"><ellipse cx="60" cy="180" rx="34" ry="10" /><ellipse cx="80" cy="172" rx="22" ry="12" /></g>
        <g class="cloud c2" fill="#f5d9b5" opacity=".4"><ellipse cx="220" cy="230" rx="28" ry="8" /><ellipse cx="236" cy="224" rx="16" ry="9" /></g>
        <!-- oiseaux -->
        <g class="bird" fill="none" stroke="#1a110b" stroke-width="2.5" stroke-linecap="round">
          <path d="M-8 0 q4 -5 8 0 q4 -5 8 0"><animateMotion dur="14s" repeatCount="indefinite" rotate="auto"><mpath href="#wrs-flight" /></animateMotion></path>
        </g>
        <g class="bird" fill="none" stroke="#1a110b" stroke-width="2" stroke-linecap="round">
          <path d="M-6 0 q3 -4 6 0 q3 -4 6 0"><animateMotion dur="14s" begin="1.2s" repeatCount="indefinite" rotate="auto"><mpath href="#wrs-flight" /></animateMotion></path>
        </g>
        <g class="bird" fill="none" stroke="#1a110b" stroke-width="2" stroke-linecap="round">
          <path d="M-6 0 q3 -4 6 0 q3 -4 6 0"><animateMotion dur="19s" begin="6s" repeatCount="indefinite" rotate="auto"><mpath href="#wrs-flight2" /></animateMotion></path>
        </g>
        <!-- collines -->
        <path d="M0 330c60-20 120-10 180 0s90 0 120-10v100H0z" fill="#3a1d10" />
        <!-- palmier : tronc fixe, palmes qui balancent -->
        <path d="M60 340c2-40 0-80-6-110" stroke="#1a110b" stroke-width="5" fill="none" stroke-linecap="round" />
        <g class="fronds">
          <path d="M54 236c-20-6-34-16-44-30M54 236c-6-20-2-36 8-48M56 234c14-14 32-20 54-20M56 236c20 2 38 10 50 24M54 236c-16 4-30 14-40 30" stroke="#1a110b" stroke-width="5" fill="none" stroke-linecap="round" />
        </g>
      </g>
      <path d="M150 20v400M20 200h260" stroke="#3a2416" stroke-width="6" opacity=".55" />
      <!-- rideau en wax qui bouge -->
      <g class="curtain">
        <path d="M24 150 q10 60 0 140 q-8 60 6 130 h-30 V150z" fill="#c0612f" opacity=".9" />
        <path d="M24 150 q10 60 0 140 q-8 60 6 130 h-30 V150z" fill="url(#wrs-wax)" opacity=".5" />
        <circle v-for="n in 6" :key="n" cx="10" :cy="170 + n * 40" r="5" fill="#f0c08a" opacity=".7" />
      </g>
    </svg>

    <!-- ═══ Lampe et sa mouche ═══ -->
    <div class="lamp">
      <span class="shade" />
      <svg class="fly" viewBox="0 0 20 20"><circle cx="10" cy="10" r="2.2" fill="#1a110b" /><ellipse cx="7" cy="8" rx="3" ry="1.4" fill="#1a110b" opacity=".5" /><ellipse cx="13" cy="8" rx="3" ry="1.4" fill="#1a110b" opacity=".5" /></svg>
    </div>

  </div>
</template>

<style scoped lang="scss">
.scene { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

/* ── Plafond ── */
.fan { position: absolute; left: 60%; top: 1rem; width: 110px; opacity: .85; @include md-down { top: 4.6rem; left: 8%; } @include md-up { width: 150px; left: 36%; }
  .blades { transform-origin: 100px 100px; animation: fan-spin 2.6s linear infinite; }
  ellipse { transform-origin: 100px 100px; animation: fan-shadow 2.6s linear infinite; } }
@keyframes fan-spin { to { transform: rotate(360deg); } }
@keyframes fan-shadow { 50% { opacity: .35; } }
.clock { position: absolute; right: 6%; top: 1.6rem; width: 54px; @include md-down { top: 5rem; right: 5%; } @include lg-up { right: 28%; width: 68px; }
  .sec { transition: transform .15s cubic-bezier(.4, 2.2, .6, 1); } }

/* ── Fenêtre ── */
.window { position: absolute; right: -60px; top: 90px; width: 300px; opacity: .45; @include lg-up { right: 2%; opacity: .7; width: 320px; }
  .sun { animation: sun-breathe 6s ease-in-out infinite; transform-origin: 170px 300px; }
  .cloud { animation: drift 40s linear infinite; } .c2 { animation-duration: 55s; animation-delay: -20s; }
  .fronds { transform-origin: 56px 236px; animation: sway 4s ease-in-out infinite; }
  .curtain { transform-origin: 24px 150px; animation: curtain 5s ease-in-out infinite; } }
@keyframes sun-breathe { 50% { transform: scale(1.06); opacity: 1; } }
@keyframes drift { from { transform: translateX(-60px); } to { transform: translateX(300px); } }
@keyframes sway { 50% { transform: rotate(5deg); } }
@keyframes curtain { 50% { transform: skewX(-4deg) translateX(3px); } }

/* ── Lampe ── */
.lamp { position: absolute; left: 50%; top: 0; width: 2px; height: 90px; @include md-down { height: 128px; .shade { top: 126px; } .fly { top: 138px; } } background: #1a110b; transform-origin: top center; animation: lamp-sway 6s ease-in-out infinite;
  .shade { position: absolute; left: -22px; top: 88px; width: 46px; height: 26px; border-radius: 50% 50% 8px 8px; background: radial-gradient(circle at 50% 120%, #fff1c9, #d6a548 50%, #8b5a34); box-shadow: 0 30px 80px 30px rgba(240, 190, 100, .25); animation: flicker 7s ease-in-out infinite; }
  .fly { position: absolute; left: -6px; top: 100px; width: 14px; animation: fly-around 3.2s linear infinite; } }
@keyframes lamp-sway { 50% { transform: rotate(2.5deg); } }
@keyframes flicker { 0%, 100% { filter: brightness(1); } 47% { filter: brightness(1); } 49% { filter: brightness(.8); } 51% { filter: brightness(1.05); } 70% { filter: brightness(.95); } }
@keyframes fly-around { from { transform: rotate(0) translateX(26px) rotate(0); } to { transform: rotate(360deg) translateX(26px) rotate(-360deg); } }

</style>

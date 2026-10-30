<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Le banc de la salle d'attente 🪑
 * ─────────────────────────────────────────────────────────────
 * SVG animé : un banc en bois qui se remplit petit à petit. Au départ il est
 * vide ; toutes les `fillEvery` ms la porte « ENTRÉE » s'ouvre, quelqu'un
 * entre et vient s'asseoir, jusqu'à ce que les places soient prises.
 * Les gens respirent, regardent leur téléphone, discutent avec leur voisin ;
 * une plante ondule et une radio joue.
 *
 * Les personnages sont volontairement variés : entrepreneuses en boubou,
 * tresses ou foulard, un homme en veste, un homme chinois en tangzhuang,
 * un aîné aux cheveux gris, diaspora métisse…
 *
 * Props : `seated` (personnes assises au départ), `fillEvery` (ms entre deux
 * arrivées automatiques, 0 pour désactiver), `arrival` (compteur : à chaque
 * incrément, une personne entre, par exemple à une inscription en temps réel).
 */
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  seated: { type: Number, default: 0 },
  arrival: { type: Number, default: 0 },
  maxSeats: { type: Number, default: 6 },
  fillEvery: { type: Number, default: 5000 }
})
const SEAT_X = 215, SEAT_GAP = 86

/* kind : 'wax' (tenue en pagne / chemise wax), 'jacket' (veste et chemise), 'tang' (tangzhuang, col mao et brandebourgs) */
const OUTFITS = [
  { skin: '#5b3519', cloth: '#d6a548', pattern: '#8b5a34', head: 'wrap', hair: '#1a110b', kind: 'wax', woman: true },    // boubou doré, foulard
  { skin: '#e9c7a6', cloth: '#2b3a55', pattern: '#f5ecdb', head: 'short', hair: '#8b5a34', kind: 'jacket' },             // homme blanc, veste bleu nuit
  { skin: '#8a5a3a', cloth: '#c0612f', pattern: '#f0c08a', head: 'braids', hair: '#2a170d', kind: 'wax', woman: true },  // pagne latérite, tresses
  { skin: '#f1d4ad', cloth: '#b9391f', pattern: '#e9c983', head: 'short', hair: '#111111', kind: 'tang' },               // homme chinois, tangzhuang rouge
  { skin: '#2e1a0e', cloth: '#2f4c8a', pattern: '#9fb6dd', head: 'short', hair: '#1a110b', kind: 'wax' },                // chemise indigo, peau très foncée
  { skin: '#3b2212', cloth: '#7a2e5a', pattern: '#f0c08a', head: 'short', hair: '#6b6b6b', kind: 'wax' },                // prune, cheveux gris (un aîné)
  { skin: '#6e4324', cloth: '#1f6b5a', pattern: '#d6a548', head: 'wrap', hair: '#1a110b', kind: 'wax', woman: true },    // vert bouteille, foulard
  { skin: '#c89a72', cloth: '#f5ecdb', pattern: '#c0612f', head: 'long', hair: '#3b1f10', kind: 'wax', woman: true },    // blanc cassé, cheveux longs (diaspora)
  { skin: '#4a2a14', cloth: '#8fa35a', pattern: '#2a170d', head: 'cap', hair: '#1a110b', kind: 'wax' },                  // kaki olive, casquette
  { skin: '#7a4a2a', cloth: '#22344f', pattern: '#d6a548', head: 'braids', hair: '#1a110b', kind: 'wax', woman: true }   // bleu nuit, tresses
]
const seatedCount = ref(Math.min(props.seated, props.maxSeats))
const people = computed(() => Array.from({ length: seatedCount.value }, (_, i) => ({ i, x: SEAT_X + i * SEAT_GAP, ...OUTFITS[i % OUTFITS.length] })))

/* Quelqu'un regarde son téléphone, un autre se penche vers son voisin… */
const fidget = ref({ phone: 1, talk: 3 })
let fidgetTimer, walkTimer, fillTimer
onMounted(() => {
  fidgetTimer = setInterval(() => {
    const n = seatedCount.value
    fidget.value = { phone: Math.floor(Math.random() * n), talk: Math.floor(Math.random() * n) }
  }, 5200)
  /* Remplissage progressif : une personne entre toutes les fillEvery ms tant qu'il reste une place */
  if (props.fillEvery > 0 && seatedCount.value < props.maxSeats) {
    fillTimer = setInterval(() => {
      if (seatedCount.value >= props.maxSeats) { clearInterval(fillTimer); return }
      enter()
    }, props.fillEvery)
  }
})
onBeforeUnmount(() => { clearInterval(fidgetTimer); clearInterval(fillTimer); clearTimeout(walkTimer) })

/* Quelqu'un entre : la porte s'ouvre, la silhouette marche jusqu'à sa place (ou traverse si c'est plein) */
const doorOpen = ref(false)
const walker = ref(null)
function enter() {
  if (walker.value) return
  const idx = seatedCount.value
  const targetX = idx < props.maxSeats ? SEAT_X + idx * SEAT_GAP : SEAT_X + props.maxSeats * SEAT_GAP + 10
  walker.value = { ...OUTFITS[idx % OUTFITS.length], targetX }
  doorOpen.value = true
  walkTimer = setTimeout(() => {
    doorOpen.value = false
    if (seatedCount.value < props.maxSeats) seatedCount.value++
    walker.value = null
  }, 2600)
}
watch(() => props.arrival, enter)
</script>

<template>
  <div class="bench-scene" aria-hidden="true">
    <!-- ═══ Le sol : porte, banc et gens, plante, radio ═══ -->
    <svg class="floor" viewBox="0 0 900 240" preserveAspectRatio="xMidYMax slice">
      <defs>
        <pattern id="wrs-wax" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.4" fill="rgba(255,241,201,.5)" /></pattern>
        <linearGradient id="wrs-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4b2c" /><stop offset="1" stop-color="#4a2a14" /></linearGradient>
      </defs>

      <!-- plinthe et sol -->
      <rect x="0" y="196" width="900" height="44" fill="#2a170d" />
      <rect x="0" y="192" width="900" height="6" fill="#1a110b" />

      <!-- porte d'entrée, à gauche -->
      <g class="door-frame">
        <rect x="40" y="30" width="110" height="166" rx="4" fill="#1a110b" />
        <rect x="46" y="36" width="98" height="160" fill="#3a1d10" />
        <g class="door" :class="{ open: doorOpen }">
          <rect x="46" y="36" width="98" height="160" fill="url(#wrs-wood)" stroke="#2a170d" stroke-width="3" />
          <rect x="58" y="48" width="74" height="60" rx="3" fill="none" stroke="#2a170d" stroke-width="3" />
          <rect x="58" y="120" width="74" height="60" rx="3" fill="none" stroke="#2a170d" stroke-width="3" />
          <circle cx="130" cy="116" r="4.5" fill="#d6a548" />
        </g>
        <text x="95" y="24" text-anchor="middle" font-size="12" fill="#f0c08a" font-family="var(--font-display)" letter-spacing="2">ENTRÉE</text>
      </g>

      <!-- la personne qui entre (debout, elle marche jusqu'au banc) -->
      <g v-if="walker" class="walker" :style="{ '--target': `${walker.targetX - 95}px` }">
        <g transform="translate(95 0)">
          <g class="legs"><rect x="-9" y="150" width="8" height="42" rx="3" :fill="walker.kind === 'jacket' ? '#3b3b44' : walker.cloth" /><rect x="3" y="150" width="8" height="42" rx="3" :fill="walker.kind === 'jacket' ? '#3b3b44' : walker.cloth" /></g>
          <path d="M-20 150 q0 -58 20 -58 q20 0 20 58z" :fill="walker.cloth" />
          <path v-if="walker.kind === 'wax'" d="M-20 150 q0 -58 20 -58 q20 0 20 58z" fill="url(#wrs-wax)" />
          <template v-else-if="walker.kind === 'jacket'">
            <path d="M-8 94 L0 116 L8 94z" :fill="walker.pattern" /><path d="M-1 98 l1 16 l1 -16z" fill="#8a2b2b" />
            <path d="M-8 94 L-4 120 L0 116z M8 94 L4 120 L0 116z" fill="rgba(255,255,255,.14)" />
          </template>
          <template v-else-if="walker.kind === 'tang'">
            <path d="M-9 94 q9 -5 18 0 v5 q-9 -3 -18 0z" :fill="walker.pattern" />
            <g :fill="walker.pattern"><rect x="-7" y="106" width="14" height="2.2" rx="1.1" /><rect x="-7" y="118" width="14" height="2.2" rx="1.1" /><rect x="-7" y="130" width="14" height="2.2" rx="1.1" /></g>
          </template>
          <path v-if="walker.head === 'long'" d="M-16 70 q16 -20 32 0 v34 q-16 8 -32 0z" :fill="walker.hair" />
          <circle cx="0" cy="78" r="15" :fill="walker.skin" />
          <path v-if="walker.head === 'wrap'" d="M-16 72 q16 -22 32 0 q-6 -4 -16 -4 q-10 0 -16 4z" :fill="walker.pattern" />
          <rect v-else-if="walker.head === 'cap'" x="-17" y="62" width="34" height="10" rx="4" :fill="walker.pattern" />
          <path v-else-if="walker.head === 'braids'" d="M-15 70 q15 -18 30 0 v22 q-15 6 -30 0z" :fill="walker.hair" />
          <path v-else d="M-15 72 q15 -16 30 0 q-15 -8 -30 0z" :fill="walker.hair" />
        </g>
      </g>

      <!-- banc en bois -->
      <rect x="170" y="150" width="580" height="16" rx="4" fill="url(#wrs-wood)" />
      <rect x="166" y="110" width="588" height="14" rx="4" fill="url(#wrs-wood)" opacity=".9" />
      <g fill="#3a1d10"><rect x="184" y="124" width="12" height="70" /><rect x="454" y="124" width="12" height="70" /><rect x="726" y="124" width="12" height="70" /></g>

      <!-- les gens assis -->
      <g v-for="p in people" :key="p.i" class="person" :class="{ phone: fidget.phone === p.i, talk: fidget.talk === p.i && fidget.talk !== fidget.phone }" :style="{ '--delay': `${p.i * -0.7}s` }" :transform="`translate(${p.x} 0)`">
        <!-- jambes (pantalon sombre pour la veste) -->
        <rect x="-22" y="150" width="14" height="42" rx="4" :fill="p.kind === 'jacket' ? '#3b3b44' : p.cloth" opacity=".85" /><rect x="8" y="150" width="14" height="42" rx="4" :fill="p.kind === 'jacket' ? '#3b3b44' : p.cloth" opacity=".85" />
        <rect x="-24" y="186" width="18" height="8" rx="3" fill="#1a110b" /><rect x="6" y="186" width="18" height="8" rx="3" fill="#1a110b" />
        <!-- buste -->
        <g class="torso">
          <path d="M-26 156 q0 -62 26 -62 q26 0 26 62z" :fill="p.cloth" />
          <!-- tenue wax : motifs et col brodé -->
          <template v-if="p.kind === 'wax'">
            <path d="M-26 156 q0 -62 26 -62 q26 0 26 62z" fill="url(#wrs-wax)" />
            <path d="M-8 100 q8 10 16 0 l-2 18 h-12z" :fill="p.pattern" opacity=".9" />
          </template>
          <!-- veste : chemise claire en V, revers et cravate -->
          <template v-else-if="p.kind === 'jacket'">
            <path d="M-10 96 L0 124 L10 96z" :fill="p.pattern" />
            <path d="M-1 100 l1 20 l1 -20z" fill="#8a2b2b" /><path d="M-2.5 100 h5 l-2.5 3z" fill="#8a2b2b" />
            <path d="M-10 96 L-5 128 L0 124z M10 96 L5 128 L0 124z" fill="rgba(255,255,255,.14)" />
            <rect x="12" y="118" width="9" height="5" rx="1" fill="rgba(255,255,255,.18)" />
          </template>
          <!-- tangzhuang : col mao, couture centrale et brandebourgs dorés -->
          <template v-else-if="p.kind === 'tang'">
            <path d="M-10 96 q10 -6 20 0 v6 q-10 -4 -20 0z" :fill="p.pattern" />
            <line x1="0" y1="102" x2="0" y2="154" :stroke="p.pattern" stroke-width="1.2" opacity=".7" />
            <g :fill="p.pattern"><rect x="-8" y="110" width="16" height="2.4" rx="1.2" /><circle cx="0" cy="111.2" r="2" /><rect x="-8" y="124" width="16" height="2.4" rx="1.2" /><circle cx="0" cy="125.2" r="2" /><rect x="-8" y="138" width="16" height="2.4" rx="1.2" /><circle cx="0" cy="139.2" r="2" /></g>
          </template>
          <!-- bras + téléphone -->
          <g class="arm"><rect x="-30" y="110" width="12" height="40" rx="5" :fill="p.kind === 'jacket' ? p.cloth : p.skin" /><rect x="-30" y="140" width="12" height="10" rx="4" :fill="p.skin" /><rect class="screen" x="-34" y="140" width="22" height="14" rx="3" fill="#1a110b" /></g>
          <!-- tête -->
          <g class="head">
            <path v-if="p.head === 'long'" d="M-17 70 q17 -22 34 0 v38 q-17 8 -34 0z" :fill="p.hair" />
            <circle cx="0" cy="78" r="16" :fill="p.skin" />
            <path v-if="p.head === 'wrap'" d="M-17 72 q17 -24 34 0 q-6 -5 -17 -5 q-11 0 -17 5z" :fill="p.pattern" />
            <path v-if="p.head === 'wrap'" d="M12 62 q10 -8 14 2 q-8 0 -14 4z" :fill="p.pattern" />
            <rect v-else-if="p.head === 'cap'" x="-18" y="62" width="36" height="10" rx="4" :fill="p.pattern" />
            <path v-else-if="p.head === 'braids'" d="M-16 70 q16 -20 32 0 v24 q-16 6 -32 0z" :fill="p.hair" />
            <path v-else-if="p.head === 'long'" d="M-16 72 q16 -17 32 0 q-16 -9 -32 0z" :fill="p.hair" />
            <path v-else d="M-16 72 q16 -17 32 0 q-16 -9 -32 0z" :fill="p.hair" />
            <!-- boucles d'oreilles pour les femmes -->
            <g v-if="p.woman" fill="#d6a548"><circle cx="-16" cy="86" r="2" /><circle cx="16" cy="86" r="2" /></g>
            <circle cx="-5" cy="80" r="1.6" fill="#1a110b" /><circle cx="5" cy="80" r="1.6" fill="#1a110b" />
            <path d="M-4 86 q4 3 8 0" stroke="#1a110b" stroke-width="1.4" fill="none" stroke-linecap="round" />
          </g>
        </g>
        <!-- bulle de discussion -->
        <g class="bubble"><ellipse cx="34" cy="60" rx="16" ry="10" fill="#f5ecdb" /><circle cx="28" cy="60" r="1.6" fill="#8b5a34" /><circle cx="34" cy="60" r="1.6" fill="#8b5a34" /><circle cx="40" cy="60" r="1.6" fill="#8b5a34" /></g>
      </g>

      <!-- plante en pot, à droite -->
      <g transform="translate(800 0)">
        <path d="M-26 196 l6 -54 h40 l6 54z" fill="#c0612f" /><rect x="-30" y="138" width="60" height="10" rx="3" fill="#8a3a1d" />
        <g class="leaves" stroke="#2f7a4a" stroke-width="7" fill="none" stroke-linecap="round">
          <path d="M0 140 q-30 -30 -46 -70" /><path d="M0 140 q4 -46 20 -80" /><path d="M0 140 q30 -24 54 -56" /><path d="M0 140 q-10 -40 -4 -90" /><path d="M0 140 q24 -40 10 -92" />
        </g>
      </g>

      <!-- la radio et ses notes -->
      <g transform="translate(866 0)">
        <rect x="-30" y="150" width="60" height="44" rx="6" fill="#3a1d10" stroke="#8b5a34" stroke-width="3" />
        <circle cx="-12" cy="172" r="11" fill="#1a110b" stroke="#d6a548" stroke-width="2" />
        <g class="eq" fill="#d6a548"><rect x="6" y="164" width="5" height="18" /><rect x="14" y="160" width="5" height="22" /><rect x="22" y="166" width="5" height="16" /></g>
        <line x1="20" y1="150" x2="40" y2="112" stroke="#8b5a34" stroke-width="3" stroke-linecap="round" />
        <g class="notes" fill="#f0c08a" font-size="20" font-family="serif"><text x="-10" y="140">♪</text><text x="18" y="130" class="n2">♫</text><text x="-30" y="128" class="n3">♪</text></g>
      </g>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.bench-scene { position: relative; border-radius: 18px; overflow: hidden; background: linear-gradient(180deg, rgba(26, 17, 11, .15), rgba(26, 17, 11, .45)); border: 1px solid var(--kec-border); }
.floor { display: block; width: 100%; height: auto; }
.door { transform-origin: 46px 116px; transition: transform .7s cubic-bezier(.3, 1.2, .5, 1); &.open { transform: perspective(300px) rotateY(-62deg); } }
.walker { animation: walk 2.6s cubic-bezier(.4, 0, .3, 1) forwards; .legs rect { transform-origin: 0 150px; animation: step .45s ease-in-out infinite alternate; } .legs rect:last-child { animation-delay: -.45s; } }
@keyframes walk { 0% { transform: translateX(0); opacity: 0; } 12% { opacity: 1; } 85% { transform: translateX(var(--target)); } 100% { transform: translateX(var(--target)); opacity: 0; } }
@keyframes step { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }
.person {
  animation: sit .5s var(--ease-out) both;
  .torso { transform-origin: 0 156px; animation: breathe 4.4s ease-in-out infinite; animation-delay: var(--delay); }
  .head { transform-origin: 0 90px; animation: nod 9s ease-in-out infinite; animation-delay: var(--delay); }
  .arm { transform-origin: -24px 112px; transition: transform .8s var(--ease-out); } .screen { opacity: 0; transition: opacity .6s; }
  .bubble { opacity: 0; transition: opacity .5s; transform-origin: 34px 60px; }
  &.phone { .arm { transform: rotate(48deg); } .screen { opacity: 1; animation: glow 1.6s ease-in-out infinite; } .head { transform: rotate(12deg); animation: none; } }
  &.talk { .head { animation: talk 1.4s ease-in-out infinite; } .bubble { opacity: .95; animation: pop .5s var(--ease-spring); } } }
@keyframes sit { from { opacity: 0; transform: translateY(-6px); } }
@keyframes breathe { 50% { transform: scaleY(1.025); } }
@keyframes nod { 0%, 100% { transform: rotate(0); } 30% { transform: rotate(-6deg); } 60% { transform: rotate(4deg); } }
@keyframes talk { 50% { transform: rotate(-8deg) translateX(3px); } }
@keyframes pop { from { transform: scale(.4); } }
@keyframes glow { 50% { fill: #f0c08a; } }
@keyframes sway { 50% { transform: rotate(5deg); } }
.leaves { transform-origin: 0 140px; animation: sway 5s ease-in-out infinite reverse; }
.eq rect { transform-origin: center bottom; animation: eq .7s ease-in-out infinite alternate; &:nth-child(2) { animation-duration: .5s; } &:nth-child(3) { animation-duration: .9s; } }
@keyframes eq { from { transform: scaleY(.35); } to { transform: scaleY(1); } }
.notes text { animation: note 3s ease-in-out infinite; opacity: 0; &.n2 { animation-delay: 1s; } &.n3 { animation-delay: 2s; } }
@keyframes note { 0% { transform: translateY(10px); opacity: 0; } 30% { opacity: .9; } 100% { transform: translateY(-40px) translateX(8px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .walker { opacity: 1; animation: none; transform: translateX(var(--target)); } .person { animation: none; } }
</style>

<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Les offrandes de bienvenue de la salle d'attente ☕🍵🥜🍷
 * ─────────────────────────────────────────────────────────────
 * « Chez nous en Afrique, on ne reçoit pas les gens les mains vides. »
 * Le visiteur choisit ce qu'on lui sert (jetons), et la scène se joue :
 *  - café : la bouilloire émaillée à fleurs s'incline, la tasse en terre
 *    cuite se remplit, la vapeur monte ;
 *  - thé : la théière verse de haut dans le petit verre, mousse comprise ;
 *  - vin blanc : la bouteille s'incline, le verre se remplit, des bulles ;
 *  - arachides bouillies : le couvercle de la marmite se soulève, vapeur ;
 *  - noix de cola : on fend la noix, les deux moitiés s'ouvrent sur le plateau.
 *
 * Émet `served` avec la clé de l'offrande. `serve(key)` est exposé.
 */
import { ref } from 'vue'

const OFFERINGS = ['coffee', 'tea', 'wine', 'peanuts', 'cola']
const EMOJI = { coffee: '☕', tea: '🍵', wine: '🍷', peanuts: '🥜', cola: '🌰' }

const emit = defineEmits(['served'])
const chosen = ref(null)   // clé de l'offrande choisie
const state = ref('empty') // empty | pouring | served
let timer

function serve(key = 'coffee') {
  if (state.value === 'pouring') return
  clearTimeout(timer)
  chosen.value = key
  state.value = 'pouring'
  timer = setTimeout(() => { state.value = 'served'; emit('served', key) }, 2300)
}
defineExpose({ serve })
</script>

<template>
  <div class="offering" :class="[state, chosen]">
    <!-- Jetons : on choisit ce qu'on nous sert -->
    <div class="tokens" role="group" :aria-label="$t('waiting.chooseDrink')">
      <button v-for="k in OFFERINGS" :key="k" type="button" class="token" :class="{ on: chosen === k }" :disabled="state === 'pouring'" @click="serve(k)">
        <span class="emoji" aria-hidden="true">{{ EMOJI[k] }}</span><span>{{ $t(`waiting.offerings.${k}`) }}</span>
      </button>
    </div>

    <svg viewBox="0 0 320 260" class="scene" role="img" :aria-label="$t('waiting.coffeeAria')">
      <defs>
        <linearGradient id="of-enamel" x1="0" x2="1"><stop offset="0" stop-color="#e9dfcb" /><stop offset=".5" stop-color="#fbf6ea" /><stop offset="1" stop-color="#cdbfa4" /></linearGradient>
        <linearGradient id="of-clay" x1="0" x2="1"><stop offset="0" stop-color="#8a3a1d" /><stop offset=".45" stop-color="#c0612f" /><stop offset="1" stop-color="#7a321a" /></linearGradient>
        <linearGradient id="of-coffee" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b3d1f" /><stop offset="1" stop-color="#2a170b" /></linearGradient>
        <linearGradient id="of-tea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c98a2e" /><stop offset="1" stop-color="#7a4a12" /></linearGradient>
        <linearGradient id="of-wine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e49a" /><stop offset="1" stop-color="#d9c15a" /></linearGradient>
        <linearGradient id="of-tray" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7a4f2e" /><stop offset="1" stop-color="#4a2e1a" /></linearGradient>
        <linearGradient id="of-glass" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,.35)" /><stop offset=".5" stop-color="rgba(255,255,255,.08)" /><stop offset="1" stop-color="rgba(255,255,255,.3)" /></linearGradient>
        <linearGradient id="of-silver" x1="0" x2="1"><stop offset="0" stop-color="#9fa6ad" /><stop offset=".5" stop-color="#e6eaee" /><stop offset="1" stop-color="#7d858c" /></linearGradient>
        <linearGradient id="of-iron" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4b4e55" /><stop offset="1" stop-color="#1f2125" /></linearGradient>
        <clipPath id="of-cup"><path d="M196 168h88l-8 58c-1 8-8 14-16 14h-40c-8 0-15-6-16-14z" /></clipPath>
        <clipPath id="of-teaglass"><path d="M214 150h52l-6 80h-40z" /></clipPath>
        <clipPath id="of-wineglass"><path d="M202 120h76c0 40-14 64-38 70-24-6-38-30-38-70z" /></clipPath>
      </defs>

      <!-- Plateau en bois, commun à toutes les scènes -->
      <ellipse cx="170" cy="246" rx="150" ry="12" fill="url(#of-tray)" />
      <ellipse cx="170" cy="243" rx="146" ry="9" fill="#8b5a34" opacity=".6" />

      <!-- Rien de choisi : la bouilloire attend, seule -->
      <g v-if="!chosen" class="idle">
        <g class="kettle">
          <path d="M120 120c-4-18 10-30 40-30s44 12 40 30l8 90c1 14-10 26-24 26h-48c-14 0-25-12-24-26z" fill="url(#of-enamel)" />
          <path d="M118 132c30 8 54 8 84 0M114 206c34 8 58 8 92 0" stroke="#22344f" stroke-width="4" fill="none" />
          <g transform="translate(160 168)"><g fill="#c0612f"><circle cx="0" cy="-10" r="6" /><circle cx="10" cy="-2" r="6" /><circle cx="6" cy="9" r="6" /><circle cx="-6" cy="9" r="6" /><circle cx="-10" cy="-2" r="6" /></g><circle r="4" fill="#d6a548" /></g>
          <path d="M200 150c18-4 30-18 40-34l8 4c-8 22-24 40-46 46z" fill="url(#of-enamel)" />
          <ellipse cx="160" cy="92" rx="34" ry="7" fill="#d9ccb2" /><circle cx="160" cy="84" r="6" fill="#22344f" />
          <path d="M126 104c-30-6-38 48-6 64" stroke="#22344f" stroke-width="7" fill="none" stroke-linecap="round" />
        </g>
      </g>

      <!-- ☕ CAFÉ : bouilloire émaillée + tasse en terre cuite bogolan -->
      <g v-else-if="chosen === 'coffee'">
        <g class="kettle">
          <path d="M60 120c-4-18 10-30 40-30s44 12 40 30l8 90c1 14-10 26-24 26H76c-14 0-25-12-24-26z" fill="url(#of-enamel)" />
          <path d="M58 132c30 8 54 8 84 0M54 206c34 8 58 8 92 0" stroke="#22344f" stroke-width="4" fill="none" />
          <g transform="translate(100 168)"><g fill="#c0612f"><circle cx="0" cy="-10" r="6" /><circle cx="10" cy="-2" r="6" /><circle cx="6" cy="9" r="6" /><circle cx="-6" cy="9" r="6" /><circle cx="-10" cy="-2" r="6" /></g><circle r="4" fill="#d6a548" /></g>
          <path d="M80 182c6-6 10-6 14-2M118 182c-6-6-10-6-14-2" stroke="#5f6436" stroke-width="3" fill="none" stroke-linecap="round" />
          <path d="M140 150c18-4 30-18 40-34l8 4c-8 22-24 40-46 46z" fill="url(#of-enamel)" />
          <ellipse cx="100" cy="92" rx="34" ry="7" fill="#d9ccb2" /><circle cx="100" cy="84" r="6" fill="#22344f" />
          <path d="M66 104c-30-6-38 48-6 64" stroke="#22344f" stroke-width="7" fill="none" stroke-linecap="round" />
        </g>
        <path class="stream" d="M188 122c6 20 12 36 50 60" stroke="#4a2810" stroke-width="5" fill="none" stroke-linecap="round" />
        <g class="cup">
          <path d="M190 162h100l-10 66c-1 9-9 16-18 16h-44c-9 0-17-7-18-16z" fill="url(#of-clay)" />
          <g clip-path="url(#of-cup)"><rect class="level" x="190" y="170" width="100" height="80" fill="url(#of-coffee)" /></g>
          <ellipse cx="240" cy="162" rx="50" ry="8" fill="#5a2814" /><ellipse class="surface" cx="240" cy="164" rx="44" ry="6" fill="#4a2810" />
          <path d="M200 196h80M204 214h72" stroke="#f5ecdb" stroke-width="2" stroke-dasharray="6 5" opacity=".7" />
          <path d="M206 204l6-5 6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5" stroke="#1a110b" stroke-width="2" fill="none" opacity=".55" />
          <path d="M288 178c22-2 24 34 0 34" stroke="#8a3a1d" stroke-width="8" fill="none" stroke-linecap="round" />
        </g>
        <g class="steam" fill="none" stroke="#f5ecdb" stroke-linecap="round" stroke-width="3">
          <path d="M222 150c-10-14 10-22 0-38s8-24 0-34" /><path d="M242 150c-10-14 10-22 0-38s8-24 0-34" /><path d="M262 150c-10-14 10-22 0-38s8-24 0-34" />
        </g>
      </g>

      <!-- 🍵 THÉ : théière en métal, versé de haut dans un petit verre -->
      <g v-else-if="chosen === 'tea'">
        <g class="teapot">
          <path d="M56 150c0-30 18-48 48-48s48 18 48 48l-6 60c-1 12-10 22-22 22H84c-12 0-21-10-22-22z" fill="url(#of-silver)" />
          <path d="M60 170h88M64 196h80" stroke="#5f6670" stroke-width="2" opacity=".6" />
          <ellipse cx="104" cy="104" rx="30" ry="6" fill="#c9d0d6" /><path d="M96 92h16l-4-10h-8z" fill="#5f6670" /><circle cx="104" cy="80" r="5" fill="#d6a548" />
          <path d="M146 130c22-6 36-24 42-44l9 3c-6 26-22 48-48 56z" fill="url(#of-silver)" />
          <path d="M60 124c-30-4-40 50-8 66" stroke="#3a3f45" stroke-width="7" fill="none" stroke-linecap="round" />
          <g transform="translate(104 162)" fill="none" stroke="#2f5e8a" stroke-width="2"><path d="M-20 0l6-8 6 8 6-8 6 8 6-8 6 8" /><path d="M-20 10l6-8 6 8 6-8 6 8 6-8 6 8" /></g>
        </g>
        <path class="stream tea-stream" d="M196 94c4 24 4 50 42 90" stroke="#c98a2e" stroke-width="4" fill="none" stroke-linecap="round" />
        <g class="glass">
          <path d="M214 150h52l-6 80h-40z" fill="url(#of-glass)" stroke="rgba(255,255,255,.55)" stroke-width="2" />
          <g clip-path="url(#of-teaglass)"><rect class="level" x="210" y="150" width="60" height="84" fill="url(#of-tea)" /><rect class="foam" x="210" y="160" width="60" height="8" fill="#f5ecdb" opacity=".85" /></g>
          <path d="M218 190h44M220 206h40" stroke="#d6a548" stroke-width="1.5" opacity=".7" />
          <ellipse cx="240" cy="150" rx="26" ry="4" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2" />
        </g>
        <g class="steam" fill="none" stroke="#f5ecdb" stroke-linecap="round" stroke-width="3">
          <path d="M226 140c-10-14 10-22 0-38s8-24 0-34" /><path d="M244 140c-10-14 10-22 0-38s8-24 0-34" /><path d="M260 140c-10-14 10-22 0-38s8-24 0-34" />
        </g>
      </g>

      <!-- 🍷 VIN BLANC : bouteille embuée, verre à pied, bulles -->
      <g v-else-if="chosen === 'wine'">
        <g class="bottle">
          <path d="M88 50h24v40c14 6 22 18 22 36v92c0 8-6 14-14 14H80c-8 0-14-6-14-14v-92c0-18 8-30 22-36z" fill="#3f6b3a" />
          <path d="M76 140h48v50H76z" fill="#f5ecdb" /><path d="M84 152h32M84 162h32M84 172h22" stroke="#8a3a1d" stroke-width="3" />
          <rect x="88" y="42" width="24" height="14" rx="2" fill="#d6a548" />
          <path d="M98 100v110" stroke="rgba(255,255,255,.25)" stroke-width="6" stroke-linecap="round" />
          <g class="drops" fill="rgba(255,255,255,.6)"><circle cx="118" cy="128" r="2" /><circle cx="124" cy="150" r="1.6" /><circle cx="72" cy="206" r="1.8" /></g>
        </g>
        <path class="stream wine-stream" d="M126 60c20 20 34 40 66 70" stroke="#efe08f" stroke-width="4" fill="none" stroke-linecap="round" />
        <g class="glass">
          <path d="M202 120h76c0 40-14 64-38 70-24-6-38-30-38-70z" fill="url(#of-glass)" stroke="rgba(255,255,255,.55)" stroke-width="2" />
          <g clip-path="url(#of-wineglass)">
            <rect class="level" x="196" y="140" width="90" height="60" fill="url(#of-wine)" />
            <g class="bubbles" fill="#fff8c8"><circle cx="226" cy="186" r="2" /><circle cx="240" cy="190" r="1.6" /><circle cx="254" cy="184" r="2.2" /><circle cx="246" cy="180" r="1.4" /></g>
          </g>
          <ellipse cx="240" cy="120" rx="38" ry="5" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2" />
          <path d="M240 190v40" stroke="rgba(255,255,255,.6)" stroke-width="4" /><ellipse cx="240" cy="232" rx="26" ry="5" fill="rgba(255,255,255,.45)" />
        </g>
      </g>

      <!-- 🥜 ARACHIDES BOUILLIES : marmite en fonte, couvercle qui se soulève, fumée -->
      <g v-else-if="chosen === 'peanuts'">
        <g class="pot">
          <path d="M80 150h160l-10 70c-1 10-10 18-20 18H110c-10 0-19-8-20-18z" fill="url(#of-iron)" />
          <path d="M70 148h180v10H70z" rx="4" fill="#2a2d33" />
          <path d="M60 158c-18 0-18 20 0 20M260 158c18 0 18 20 0 20" stroke="#2a2d33" stroke-width="8" fill="none" stroke-linecap="round" />
          <g class="nuts" fill="#c99a62" stroke="#8c6238" stroke-width="1.5">
            <ellipse cx="120" cy="150" rx="12" ry="6" transform="rotate(-20 120 150)" /><ellipse cx="150" cy="146" rx="12" ry="6" transform="rotate(15 150 146)" />
            <ellipse cx="182" cy="150" rx="12" ry="6" transform="rotate(-8 182 150)" /><ellipse cx="208" cy="147" rx="12" ry="6" transform="rotate(25 208 147)" />
            <ellipse cx="136" cy="156" rx="11" ry="5.5" transform="rotate(30 136 156)" /><ellipse cx="196" cy="156" rx="11" ry="5.5" transform="rotate(-28 196 156)" />
          </g>
          <g class="lid"><path d="M86 148c0-20 30-36 74-36s74 16 74 36z" fill="url(#of-iron)" /><rect x="150" y="100" width="20" height="12" rx="4" fill="#d6a548" /></g>
        </g>
        <g class="steam" fill="none" stroke="#f5ecdb" stroke-linecap="round" stroke-width="3">
          <path d="M130 120c-10-14 10-22 0-38s8-24 0-34" /><path d="M160 112c-10-14 10-22 0-38s8-24 0-34" /><path d="M190 120c-10-14 10-22 0-38s8-24 0-34" />
        </g>
        <!-- bol en calebasse servi -->
        <g class="bowl">
          <path d="M226 206h74c0 20-14 30-37 30s-37-10-37-30z" fill="#c9a96a" stroke="#8c6238" stroke-width="2" />
          <g fill="#c99a62" stroke="#8c6238" stroke-width="1.2"><ellipse cx="248" cy="206" rx="9" ry="4.5" transform="rotate(-20 248 206)" /><ellipse cx="266" cy="203" rx="9" ry="4.5" transform="rotate(20 266 203)" /><ellipse cx="282" cy="207" rx="9" ry="4.5" /></g>
        </g>
      </g>

      <!-- 🌰 NOIX DE COLA : la noix se fend sur le plateau, les deux moitiés s'ouvrent -->
      <g v-else-if="chosen === 'cola'">
        <path d="M80 214h160c0 10-36 16-80 16s-80-6-80-16z" fill="#d6a548" opacity=".9" />
        <path d="M96 214c0-6 30-10 64-10s64 4 64 10" fill="none" stroke="#8b5a34" stroke-width="2" />
        <g class="kola">
          <g class="half left"><path d="M160 150c-26 0-44 18-44 42 0 16 14 24 44 24z" fill="#c95b6a" /><path d="M160 158c-18 0-32 14-32 32 0 10 8 18 32 18z" fill="#e8a0a9" /><path d="M132 190c8-6 16-10 28-12" stroke="#a84454" stroke-width="2" fill="none" opacity=".6" /></g>
          <g class="half right"><path d="M160 150c26 0 44 18 44 42 0 16-14 24-44 24z" fill="#b94c5c" /><path d="M160 158c18 0 32 14 32 32 0 10-8 18-32 18z" fill="#e39aa3" /><path d="M188 190c-8-6-16-10-28-12" stroke="#a84454" stroke-width="2" fill="none" opacity=".6" /></g>
          <path class="crack" d="M160 150v66" stroke="#f5ecdb" stroke-width="2" stroke-dasharray="4 4" />
        </g>
        <!-- autres noix, en attente sur le plateau -->
        <g fill="#c95b6a" stroke="#a84454" stroke-width="1.5"><ellipse cx="98" cy="206" rx="16" ry="10" /><ellipse cx="226" cy="204" rx="16" ry="10" /><ellipse cx="116" cy="196" rx="14" ry="9" fill="#d97a86" /></g>
        <g class="sparkle" fill="#fff1c9"><circle cx="146" cy="130" r="2.5" /><circle cx="176" cy="124" r="2" /><circle cx="162" cy="112" r="1.6" /></g>
      </g>
    </svg>
    <slot :serve="serve" :state="state" :chosen="chosen" />
  </div>
</template>

<style scoped lang="scss">
.offering { position: relative; }
.scene { width: 100%; height: auto; overflow: visible; }
.tokens { display: flex; flex-wrap: wrap; gap: .4rem; margin-bottom: .4rem; }
.token {
  display: inline-flex; align-items: center; gap: .35rem; padding: .35rem .7rem .35rem .5rem; border-radius: 999px; font-size: .78rem; font-weight: 700;
  background: rgba(26, 17, 11, .45); border: 1px solid var(--kec-border); color: var(--kec-ivory); transition: all .3s var(--ease-out);
  .emoji { font-size: 1rem; }
  &:hover { border-color: var(--kec-gold); transform: translateY(-1px); }
  &.on { background: var(--kec-cowrie); color: #2a1a12; border-color: var(--kec-gold); }
  &:disabled { opacity: .6; cursor: wait; }
}

/* Scène vide : la bouilloire frémit en attendant */
.idle .kettle { transform-origin: 160px 236px; animation: idle 4s ease-in-out infinite; }
@keyframes idle { 50% { transform: rotate(-1.5deg) translateY(-2px); } }

/* ☕ café / 🍵 thé : le récipient s'incline, le filet coule, le niveau monte */
.kettle, .teapot, .bottle { transform-origin: 100px 236px; transition: transform 1s var(--ease-out); }
.pouring .kettle { transform: rotate(18deg) translate(10px, -22px); }
.pouring .teapot { transform: rotate(32deg) translate(26px, -70px); }
.pouring .bottle { transform: rotate(64deg) translate(70px, -80px); }
.served .teapot { transform: rotate(0); }
.stream { stroke-dasharray: 120; stroke-dashoffset: 120; opacity: 0; }
.pouring .stream { animation: pour 2.2s ease-in-out forwards; }
@keyframes pour {
  0%, 25% { opacity: 0; stroke-dashoffset: 120; }
  40% { opacity: 1; stroke-dashoffset: 0; }
  85% { opacity: 1; stroke-dashoffset: 0; }
  100% { opacity: 0; stroke-dashoffset: -120; }
}
.level { transform: translateY(80px); transition: transform 1.6s .7s var(--ease-out); }
.surface { opacity: 0; transition: opacity .4s 2s; }
.pouring .level, .served .level { transform: translateY(0); }
.served .surface { opacity: 1; }
.served .level { transition-delay: 0s; }
.foam { transform: translateY(80px); transition: transform 1.6s .9s var(--ease-out); }
.pouring .foam, .served .foam { transform: translateY(0); }
.bubbles circle { opacity: 0; }
.served .bubbles circle { animation: bubble 2.6s ease-in infinite; &:nth-child(2) { animation-delay: .7s; } &:nth-child(3) { animation-delay: 1.3s; } &:nth-child(4) { animation-delay: 1.9s; } }
@keyframes bubble { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: .9; } 100% { opacity: 0; transform: translateY(-40px); } }
.drops circle { animation: drip 3s ease-in infinite; &:nth-child(2) { animation-delay: 1s; } &:nth-child(3) { animation-delay: 2s; } }
@keyframes drip { 0% { transform: translateY(0); opacity: .7; } 100% { transform: translateY(40px); opacity: 0; } }

/* 🥜 marmite : couvercle qui se soulève, bol qui arrive */
.lid { transform-origin: 160px 148px; transition: transform 1.2s var(--ease-spring); }
.pouring .lid, .served .lid { transform: translate(60px, -40px) rotate(-28deg); }
.bowl { opacity: 0; transform: translateY(20px); transition: all .8s 1.2s var(--ease-spring); }
.served .bowl, .pouring .bowl { opacity: 1; transform: translateY(0); }

/* 🌰 cola : la noix se fend puis s'ouvre */
.kola .half { transform-origin: 160px 190px; transition: transform 1s 1.1s var(--ease-spring); }
.crack { opacity: 0; transition: opacity .3s .6s; }
.pouring .crack { opacity: 1; }
.pouring .half.left, .served .half.left { transform: translateX(-26px) rotate(-14deg); }
.pouring .half.right, .served .half.right { transform: translateX(26px) rotate(14deg); }
.served .crack { opacity: 0; }
.sparkle circle { opacity: 0; }
.served .sparkle circle { animation: twinkle 1.8s ease-in-out infinite; &:nth-child(2) { animation-delay: .5s; } &:nth-child(3) { animation-delay: 1s; } }
@keyframes twinkle { 50% { opacity: 1; transform: scale(1.4); } }

/* Vapeur (café, thé, arachides) */
.steam path { opacity: 0; stroke-dasharray: 6 10; }
.served .steam path { animation: steam 3.2s ease-in-out infinite; }
.served .steam path:nth-child(2) { animation-delay: .9s; }
.served .steam path:nth-child(3) { animation-delay: 1.7s; }
@keyframes steam { 0% { opacity: 0; transform: translateY(8px); } 35% { opacity: .55; } 100% { opacity: 0; transform: translateY(-26px); } }

@media (prefers-reduced-motion: reduce) {
  .idle .kettle, .bubbles circle, .drops circle, .sparkle circle { animation: none; }
  .served .steam path { animation: none; opacity: .4; }
}
</style>

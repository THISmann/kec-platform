<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Accueil KEC
 * ─────────────────────────────────────────────────────────────
 * Logique de défilement (proposition de Keng, validée) :
 * 1. Ciel d'harmattan : la poussière de latérite dessine le logo
 * 2. Services : ce que KEC fait
 * 3. Globe : où KEC agit, toute l'Afrique, pays par pays, et la diaspora
 * 4. Le parcours SCALE 110 : sept perles sur un même fil (fil animé)
 * 5. Programme 110 : l'offre et la cohorte de lancement
 * 6. Nostalgie : le village au crépuscule, pour ceux qui sont loin
 * 7. Kopen Mind : la boîte à suggestions
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import LateriteDust from '@/components/effects/LateriteDust.vue'
import AfricaGlobe from '@/components/effects/AfricaGlobe.vue'
import VillageDusk from '@/components/effects/VillageDusk.vue'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import KecLogo from '@/components/brand/KecLogo.vue'
import KButton from '@/components/ui/KButton.vue'
import KopenMindBox from '@/components/features/KopenMindBox.vue'
import { useUiStore } from '@/stores/ui'
import { api } from '@/services'
import { APP_CONFIG, ENABLED_LOCALES } from '@/config/app.config'
import { AFRICA_LIST, countryName, countryFact } from '@/data/africaFacts'
import { formatNumber } from '@/utils/format'
import { useCountUp } from '@/composables/useCountUp'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const { t, tm, rt, locale } = useI18n()
const ui = useUiStore()
const formed = ref(false)
const copyShown = ref(false) // le texte de gauche apparaît 1 s après le début de l'animation, sans attendre la fin
const stats = ref({ total: 0 })

onMounted(async () => {
  ui.cowriesSettle = true // sur l'accueil, les cauris s'entassent en bas
  setTimeout(() => { copyShown.value = true }, 1000)
  stats.value = await api.waitlist.publicStats()
})
onBeforeUnmount(() => { ui.cowriesSettle = false })
const waitingCount = useCountUp(computed(() => stats.value.total))

const services = ['create', 'formalize', 'grow', 'vault', 'manu', 'consultant']
const SERVICE_ICONS = { create: '⌂', formalize: '⚖', grow: '❋', vault: '⛉', manu: '☺', consultant: '☏' }
const journey = computed(() => tm('home.journey.steps').map((s) => rt(s)))

/* ── Globe : fiche du pays survolé / épinglé ── */
const globe = ref(null)
const country = ref(null) // { names, flag, fact, ohada, validated, … }
const pinnedCountry = ref(false)
const facts = computed(() => [
  { n: AFRICA_LIST.length, k: 'countries' },
  { n: AFRICA_LIST.filter((c) => c.ohada).length, k: 'ohada' },
  { n: 12, k: 'cities' },
  { n: ENABLED_LOCALES.length, k: 'languages' }
])
function onHover(c) { if (!pinnedCountry.value) country.value = c }
function onSelect(c) { pinnedCountry.value = !!c; country.value = c }
function closeCard() { globe.value?.clear(); pinnedCountry.value = false; country.value = null }

/* ── Parcours : le fil de perles s'anime quand la section entre à l'écran ── */
const journeyEl = ref(null)
const strung = ref(prefersReducedMotion())
let journeyIo = null
onMounted(() => {
  if (strung.value || typeof IntersectionObserver === 'undefined') { strung.value = true; return }
  journeyIo = new IntersectionObserver(([e]) => { if (e.isIntersecting) { strung.value = true; journeyIo.disconnect() } }, { threshold: 0.35 })
  journeyIo.observe(journeyEl.value)
})
onBeforeUnmount(() => journeyIo?.disconnect())

/* La pluie ambiante (2 à 5 cauris toutes les 5 à 10 s) et le vent qui balaie la pile
   sont gérés par le calque CowrieRain tant que `ui.cowriesSettle` est vrai. */
function onFormed() {
  formed.value = true
  // Une première poignée de cauris tombe du ciel quand le logo apparaît
  setTimeout(() => ui.rainCowries(14), 400)
}
</script>

<template>
  <div class="home">
    <!-- ═══ 1. HERO : ciel d'harmattan ═══ -->
    <section class="hero">
      <div class="sky" aria-hidden="true" />
      <div class="sun" aria-hidden="true" />
      <div class="dust-stage"><LateriteDust :scale="0.5" @formed="onFormed" /></div>
      <div class="hero-copy container" :class="{ show: copyShown || formed }">
        <span class="eyebrow">{{ $t('home.hero.eyebrow') }}</span>
        <h1>
          {{ $t('home.hero.title1') }}
          <span class="serif-italic text-gold">{{ $t('home.hero.title2') }}</span>
        </h1>
        <p class="lead">{{ $t('home.hero.lead') }}</p>
        <div class="ctas">
          <KButton size="lg" :to="{ name: 'waiting-room' }">{{ $t('home.hero.ctaWaitlist') }}</KButton>
          <KButton size="lg" variant="cola" :to="{ name: 'home', hash: '#programme' }">{{ $t('home.hero.ctaProgram') }}</KButton>
        </div>
        <p class="live"><span class="pulse" /> {{ $t('home.hero.waiting', { n: formatNumber(waitingCount, locale) }) }}</p>
      </div>
      <a href="#services" class="scroll-cue" :aria-label="$t('home.hero.scroll')"><span /></a>
    </section>

    <!-- ═══ 2. SERVICES ═══ -->
    <section id="services" class="services container">
      <header class="sec-head" v-reveal>
        <span class="eyebrow">{{ $t('home.services.eyebrow') }}</span>
        <h2>{{ $t('home.services.title') }}</h2>
        <p class="text-muted">{{ $t('home.services.lead') }}</p>
      </header>
      <div class="cards">
        <article v-for="(s, i) in services" :key="s" class="card wood-panel" v-reveal="i * 90">
          <span class="ico" aria-hidden="true">{{ SERVICE_ICONS[s] }}</span>
          <h3>{{ $t(`home.services.items.${s}.title`) }}</h3>
          <p class="text-muted">{{ $t(`home.services.items.${s}.text`) }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ 3. GLOBE : toute l'Afrique, pays par pays ═══ -->
    <section id="globe" class="globe-sec container">
      <div class="globe-col" v-reveal>
        <AfricaGlobe ref="globe" interactive :aria-label="$t('home.globe.aria')" @hover="onHover" @select="onSelect" />
        <Transition name="card">
          <div v-if="country" class="country-card" role="status" :class="{ pinned: pinnedCountry }">
            <span class="flag" aria-hidden="true">{{ country.flag }}</span>
            <strong>{{ countryName(country, locale) }}</strong>
            <span v-if="country.ohada" class="tag">{{ $t('home.globe.card.ohada') }}</span>
            <p>{{ countryFact(country, locale) || $t('home.globe.card.default') }}</p>
            <small v-if="!country.validated" class="text-muted">{{ $t('home.globe.card.toValidate') }}</small>
            <div class="card-actions">
              <RouterLink :to="{ name: 'waiting-room', query: { pays: country.iso2 } }">{{ $t('home.globe.card.create') }} →</RouterLink>
              <button v-if="pinnedCountry" type="button" class="close" :aria-label="$t('home.globe.card.close')" @click="closeCard">✕</button>
            </div>
          </div>
        </Transition>
        <p class="globe-hint text-muted">{{ $t('home.globe.card.hint') }}</p>
      </div>
      <div class="globe-copy" v-reveal="150">
        <span class="eyebrow">{{ $t('home.globe.eyebrow') }}</span>
        <h2>{{ $t('home.globe.title') }}</h2>
        <p class="text-muted">{{ $t('home.globe.text') }}</p>
        <ul class="facts">
          <li v-for="f in facts" :key="f.k"><strong>{{ f.n }}</strong><span>{{ $t(`home.globe.facts.${f.k}`) }}</span></li>
        </ul>
      </div>
    </section>

    <!-- ═══ 4. LE PARCOURS SCALE 110 ═══ -->
    <section id="parcours" ref="journeyEl" class="journey" :class="{ strung }">
      <div class="container">
        <header class="sec-head" v-reveal>
          <span class="eyebrow">{{ $t('home.journey.eyebrow') }}</span>
          <h2>{{ $t('home.journey.title') }}</h2>
        </header>
        <ol class="string">
          <li v-for="(step, i) in journey" :key="i" :style="{ '--i': i }">
            <span class="pearl"><CowrieShape :size="16" :tone="i === journey.length - 1 ? 'gold' : 'ivory'" /></span>
            <span class="n">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="lbl">{{ step }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- ═══ 5. PROGRAMME 110 ═══ -->
    <section id="programme" class="program container">
      <div class="program-box clay-panel" v-reveal>
        <div class="watermark" aria-hidden="true"><KecLogo :size="300" :tagline="false" /></div>
        <div class="cowrie-field" aria-hidden="true">
          <CowrieShape v-for="n in APP_CONFIG.program.cohortSize" :key="n" :size="11" :style="{ animationDelay: `${(n % 22) * 70}ms` }" />
        </div>
        <div class="program-copy">
          <span class="eyebrow">{{ $t('home.program.eyebrow') }}</span>
          <h2>{{ $t('home.program.title') }}</h2>
          <p>{{ $t('home.program.text') }}</p>
          <ul class="ticks">
            <li v-for="k in ['selection', 'duration', 'certification']" :key="k">
              <CowrieShape :size="12" /> {{ $t(`home.program.points.${k}`) }}
            </li>
          </ul>
          <KButton size="lg" :to="{ name: 'waiting-room' }">{{ $t('home.program.cta') }}</KButton>
          <p class="deadline text-muted">{{ $t('home.program.deadline') }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ 6. NOSTALGIE ═══ -->
    <section class="nostalgia">
      <VillageDusk class="scene" />
      <div class="nostalgia-copy container" v-reveal>
        <span class="eyebrow">{{ $t('home.nostalgia.eyebrow') }}</span>
        <h2 class="serif-italic">{{ $t('home.nostalgia.title') }}</h2>
        <p>{{ $t('home.nostalgia.text') }}</p>
        <KButton variant="wood" :to="{ name: 'waiting-room' }">{{ $t('home.nostalgia.cta') }}</KButton>
      </div>
    </section>

    <!-- ═══ 7. KOPEN MIND ═══ -->
    <section class="container kopen" v-reveal>
      <KopenMindBox />
    </section>
  </div>
</template>

<style scoped lang="scss">
/* ── Hero ─────────────────────────────── */
.hero { position: relative; min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; padding-bottom: 5.5rem; }
.sky {
  position: absolute; inset: 0;
  background:
    radial-gradient(60% 50% at 70% 30%, rgba(240, 180, 90, .35), transparent 70%),
    linear-gradient(180deg, #1a110b 0%, #4a1f10 38%, #a8401f 72%, #d98a55 100%);
}
.sky::after { content: ''; position: absolute; inset: 0; @include clay-grain(.22); mix-blend-mode: overlay; }
.sun { position: absolute; width: 52vmin; height: 52vmin; inset-inline-end: 6%; top: 20%; border-radius: 50%; background: radial-gradient(circle, rgba(255, 225, 170, .55), rgba(240, 160, 80, .1) 60%, transparent 70%); filter: blur(4px); animation: breathe 8s ease-in-out infinite; }
@keyframes breathe { 50% { transform: scale(1.08); opacity: .8; } }
.dust-stage { position: absolute; inset: 4rem 0 52% 0; @include md-up { inset: 10% 0 18% 46%; } }

.hero-copy { position: relative; z-index: 2; opacity: 0; transform: translateY(24px); transition: all 1.2s var(--ease-out); pointer-events: none; }
.hero-copy.show { opacity: 1; transform: none; pointer-events: auto; }
.hero-copy > * { @include md-up { max-width: min(620px, 50vw); } }
.hero-copy h1 { max-width: 16ch; text-shadow: 0 4px 30px rgba(0, 0, 0, .35); font-size: clamp(2rem, 5vw, 4rem); }
.lead { max-width: 52ch; font-size: clamp(1rem, 1.6vw, 1.15rem); color: #f6e7d3; }
.ctas { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.75rem 0 1.25rem; }
.live { display: inline-flex; align-items: flex-start; gap: .6rem; font-size: .88rem; color: #f6e7d3; margin: 0; .pulse { margin-top: .45em; flex-shrink: 0; } }
.pulse { width: 9px; height: 9px; border-radius: 50%; background: #8fbf5a; box-shadow: 0 0 0 0 rgba(143, 191, 90, .6); animation: live 1.8s infinite; }
@keyframes live { 70% { box-shadow: 0 0 0 10px rgba(143, 191, 90, 0); } 100% { box-shadow: 0 0 0 0 rgba(143, 191, 90, 0); } }
.scroll-cue { position: absolute; z-index: 2; left: 50%; bottom: 1.4rem; width: 26px; height: 42px; border: 2px solid rgba(245, 236, 219, .5); border-radius: 20px; transform: translateX(-50%); display: none; @include md-up { display: block; }
  span { position: absolute; left: 50%; top: 8px; width: 4px; height: 8px; margin-inline-start: -2px; border-radius: 2px; background: var(--kec-ivory); animation: wheel 1.8s infinite; } }
@keyframes wheel { to { transform: translateY(14px); opacity: 0; } }

/* ── Sections : marges réduites d'environ un quart ─────────────────────────── */
section:not(.hero) { padding-block: clamp(3rem, 6.5vw, 5rem); }
.sec-head { max-width: 640px; margin-bottom: 2.5rem; }

/* ── Globe ─────────────────────────── */
.globe-sec { display: grid; gap: 2rem; align-items: center; @include md-up { grid-template-columns: 1.05fr 1fr; gap: 4rem; } }
.globe-col { position: relative; max-width: 560px; width: 100%; margin-inline: auto; }
.globe-hint { font-size: .8rem; text-align: center; margin: .5rem 0 0; }
.country-card {
  position: absolute; inset-inline-end: -4%; top: 30%; width: min(260px, 70%); padding: .9rem 1rem; border-radius: 16px; z-index: 2;
  background: rgba(26, 17, 11, .94); border: 1px solid var(--kec-gold); box-shadow: var(--shadow-glow); font-size: .86rem; pointer-events: none;
  &.pinned { pointer-events: auto; }
  .flag { font-size: 1.3rem; display: block; }
  strong { display: block; font-family: var(--font-display); font-size: 1.1rem; color: var(--kec-gold-soft); }
  .tag { display: inline-block; margin-top: .2rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: #a9c77a; }
  p { margin: .35rem 0 .3rem; color: var(--kec-text-muted); line-height: 1.4; }
  small { display: block; font-size: .7rem; font-style: italic; margin-bottom: .4rem; }
  .card-actions { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
  a { color: var(--kec-gold); font-weight: 700; pointer-events: auto; }
  .close { background: none; border: 0; color: var(--kec-text-muted); padding: .2rem .4rem; &:hover { color: var(--kec-ivory); } }
  @include md-down { position: static; width: 100%; margin-top: .75rem; pointer-events: auto; }
}
.card-enter-active, .card-leave-active { transition: all .35s var(--ease-out); }
.card-enter-from, .card-leave-to { opacity: 0; transform: translateY(6px); }
.facts { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
  li { padding: 1rem 1.2rem; border-inline-start: 2px solid var(--kec-gold); background: linear-gradient(90deg, rgba(214, 165, 72, .08), transparent); border-radius: 0 12px 12px 0; }
  strong { display: block; font-family: var(--font-display); font-size: 2rem; color: var(--kec-gold-soft); line-height: 1.1; }
  span { font-size: .85rem; color: var(--kec-text-muted); } }

/* ── Services ─────────────────────────── */
.cards { display: grid; gap: 1.25rem; grid-template-columns: 1fr; @include sm-up { grid-template-columns: 1fr 1fr; } @include lg-up { grid-template-columns: repeat(3, 1fr); } }
.card { padding: 1.75rem; transition: transform .5s var(--ease-spring), box-shadow .5s;
  &:hover { transform: translateY(-6px) rotate(-.4deg); box-shadow: var(--shadow-glow); }
  &:nth-child(3n+2) { border-radius: 40px 18px 40px 18px; }
  &:nth-child(3n) { border-radius: 18px 40px 18px 40px; }
  h3 { margin-top: 1rem; }
  p { margin: 0; font-size: .95rem; } }
.ico { width: 54px; height: 54px; display: grid; place-items: center; font-size: 1.5rem; color: #2a1a12; border-radius: var(--radius-pebble); background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548 75%); }

/* ── Le parcours : fil de perles animé ─────────────────────────── */
.journey { background: linear-gradient(180deg, transparent, rgba(90, 58, 36, .25), transparent); }
.string { list-style: none; padding: 0; margin: 0; display: grid; gap: 1.2rem; position: relative;
  grid-template-columns: 1fr; @include md-up { grid-template-columns: repeat(7, 1fr); gap: .5rem; }
  /* le fil : se dessine de haut en bas (téléphone) ou de gauche à droite (ordinateur) en 1,5 s */
  &::before { content: ''; position: absolute; background: linear-gradient(var(--kec-taupe), var(--kec-gold)); opacity: .5;
    inset-inline-start: 21px; top: 10px; bottom: 10px; width: 2px; transform-origin: top; transform: scaleY(0); transition: transform 1.5s var(--ease-out);
    @include md-up { inset-inline: 6%; top: 21px; bottom: auto; width: auto; height: 2px; background: linear-gradient(90deg, var(--kec-taupe), var(--kec-gold)); transform-origin: left; transform: scaleX(0); } }
  li { position: relative; display: grid; grid-template-columns: 44px auto 1fr; align-items: center; gap: .75rem; opacity: 0; transform: translateY(-18px);
    transition: opacity .6s var(--ease-out), transform .8s var(--ease-spring); transition-delay: calc(.25s + var(--i) * .18s);
    @include md-up { display: flex; flex-direction: column; text-align: center; gap: .6rem; transform: translateX(-30px); } }
  .pearl { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 35% 30%, #5a3a24, #24170f); box-shadow: inset 0 0 0 1.5px var(--kec-gold); z-index: 1; transition: transform .4s var(--ease-spring), box-shadow .4s; }
  li:hover .pearl { transform: scale(1.12) rotate(-8deg); box-shadow: inset 0 0 0 1.5px var(--kec-gold), 0 0 18px rgba(214, 165, 72, .55); }
  .n { font-family: var(--font-display); color: var(--kec-gold); font-size: .9rem; }
  .lbl { font-weight: 700; font-size: .95rem; } }
.journey.strung .string { &::before { transform: none; } li { opacity: 1; transform: none; } }
/* ensuite, le collier oscille très légèrement en continu ; le cauri doré de la certification s'allume en dernier */
.journey.strung .string { animation: necklace 7s ease-in-out 2.2s infinite; }
.journey.strung .string li:last-child .pearl { animation: glow-last 2.4s ease-out 1.6s both; }
@keyframes necklace { 50% { transform: translateY(2px); } }
@keyframes glow-last { 0% { box-shadow: inset 0 0 0 1.5px var(--kec-gold); } 40% { box-shadow: inset 0 0 0 1.5px var(--kec-gold), 0 0 26px rgba(240, 207, 134, .9); } 100% { box-shadow: inset 0 0 0 1.5px var(--kec-gold), 0 0 10px rgba(240, 207, 134, .35); } }

/* ── Programme ─────────────────────────── */
.program-box { display: grid; gap: 2.5rem; padding: clamp(1.5rem, 4vw, 3.5rem); overflow: hidden; position: relative; .cowrie-field { position: relative; } .program-copy { position: relative; } @include md-up { grid-template-columns: 1fr 1.1fr; align-items: center; } }
/* le logo KEC en filigrane doré derrière les 110 cauris */
.watermark { position: absolute; inset: 0; display: grid; place-items: center; opacity: .1; pointer-events: none; filter: sepia(1) saturate(2) hue-rotate(-10deg); @include md-up { inset-inline-end: 52%; } }
.cowrie-field { display: grid; grid-template-columns: repeat(11, 1fr); gap: 10px 8px; justify-items: center; padding: 1rem;
  :deep(svg) { animation: drop .8s var(--ease-spring) both; } }
@keyframes drop { from { opacity: 0; transform: translateY(-30px) rotate(90deg); } }
.ticks { list-style: none; padding: 0; margin: 1.5rem 0 2rem; display: grid; gap: .7rem; li { display: flex; gap: .7rem; align-items: center; } }
.deadline { font-size: .85rem; margin-top: 1rem; }

/* ── Nostalgie, Kopen Mind ─────────────────────────── */
.nostalgia { position: relative; min-height: 600px; display: flex; align-items: flex-start; overflow: hidden; padding: 0 !important; }
.scene { position: absolute; inset: 0; }
.nostalgia-copy { position: relative; z-index: 1; padding-top: clamp(3rem, 8vw, 6rem); max-width: 760px; margin-inline: auto; text-align: center;
  .eyebrow { justify-content: center; }
  h2 { font-size: clamp(2rem, 4.4vw, 3.4rem); }
  p { font-size: 1.08rem; color: #f8e9d6; text-shadow: 0 2px 12px rgba(0, 0, 0, .5); } }
.kopen { padding-top: 3.5rem; }
</style>

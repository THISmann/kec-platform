<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  La salle d'attente virtuelle ☕ (liste d'attente pré-pilote)
 * ─────────────────────────────────────────────────────────────
 * Mur en terre, fenêtre en arche sur le couchant, bancs en bois,
 * bouilloire émaillée : on s'assoit, Manu propose à boire (café, thé,
 * vin blanc, arachides bouillies, noix de cola), on remplit sa fiche.
 * Compteur et arrivées en direct (social proof pour les investisseurs).
 * Les proverbes défilent avec leur pays d'origine (src/data/proverbs.js).
 * Les 110 seront choisis parmi les inscrits.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { api } from '@/services'
import { useUiStore } from '@/stores/ui'
import { useLiveEvents } from '@/composables/useLiveEvents'
import { useCountUp } from '@/composables/useCountUp'
import { formatNumber, timeAgo } from '@/utils/format'
import { PROVERBS, proverbText, shuffled } from '@/data/proverbs'
import { AFRICA_LIST, countryName } from '@/data/africaFacts'
import WaitingOffering from '@/components/effects/WaitingOffering.vue'
import WaitingRoomScene from '@/components/effects/WaitingRoomScene.vue'
import WaitingBench from '@/components/effects/WaitingBench.vue'
import ManuAvatar from '@/components/assistant/ManuAvatar.vue'
import WaitlistForm from '@/components/features/WaitlistForm.vue'
import WaitingTicket from '@/components/features/WaitingTicket.vue'

const { t, locale } = useI18n()
const ui = useUiStore()
const route = useRoute()

const stats = ref({ total: 0, today: 0, diaspora: 0, seats: 110, recent: [] })
const result = ref(null)
const served = ref(null)      // clé de l'offrande servie (coffee, tea…)
const proverbIndex = ref(0)
const arrivals = ref(0)       // chaque incrément fait entrer quelqu'un dans la salle
let proverbTimer

const total = useCountUp(computed(() => stats.value.total))

/* Proverbes : mélangés à chaque visite, le pays demandé (?pays=XX) ou le Cameroun d'abord */
const first = String(route.query.pays ?? 'CM').toUpperCase()
const proverbs = shuffled(PROVERBS).sort((a, b) => (b.origin === first) - (a.origin === first))
const proverb = computed(() => proverbs[proverbIndex.value % proverbs.length])
const proverbOrigin = computed(() => {
  const p = proverb.value
  if (p.origin === 'AF') return t('waiting.proverbAfrica')
  const c = AFRICA_LIST.find((x) => x.iso2 === p.origin)
  return c ? `${c.flag} ${countryName(c, locale.value)}` : p.origin
})

/* Manu parle : d'abord elle propose à boire, puis elle commente ce qu'elle a servi */
const manuText = computed(() => served.value ? `${t(`waiting.served.${served.value}`)} ${t('waiting.manuServed')}` : t('waiting.manuHello'))

onMounted(async () => {
  ui.cowriesSettle = true // les cauris se posent sur le sol de la salle
  stats.value = await api.waitlist.publicStats()
  proverbTimer = setInterval(() => { proverbIndex.value = (proverbIndex.value + 1) % proverbs.length }, 7000)
})
onBeforeUnmount(() => { clearInterval(proverbTimer); ui.cowriesSettle = false })

// Nouvelles arrivées en direct (autres onglets / simulateur / API réelle)
useLiveEvents((e) => {
  if (e.type !== 'waitlist.signup') return
  stats.value = {
    ...stats.value,
    total: stats.value.total + 1,
    today: stats.value.today + 1,
    recent: [{ firstName: e.payload.firstName, city: e.payload.targetCity, residence: e.payload.residenceCountry, at: e.at }, ...stats.value.recent].slice(0, 8)
  }
  arrivals.value++
}, { simulate: true })

const offering = ref(null)
function onJoined(res) {
  result.value = res
  ui.rainCowries(110) // 110 cauris : un pour chaque place du pilote
  arrivals.value++ // et vous entrez dans la salle
  if (!served.value) offering.value?.serve('coffee')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="room">
    <!-- Décor animé : ventilateur, horloge, fenêtre, lampe, porte, banc et ses occupants -->
    <WaitingRoomScene />

    <div class="container layout">
      <!-- Colonne d'accueil -->
      <section class="welcome">
        <span class="eyebrow">{{ $t('waiting.eyebrow') }}</span>
        <h1>{{ $t('waiting.title') }}</h1>
        <div class="manu-says">
          <ManuAvatar :size="52" />
          <Transition name="proverb" mode="out-in"><p :key="manuText">{{ manuText }}</p></Transition>
        </div>

        <WaitingBench class="bench" :seated="0" :fill-every="5000" :arrival="arrivals" />

        <WaitingOffering ref="offering" class="offer" @served="served = $event" />

        <div class="counters">
          <div><strong>{{ formatNumber(total, locale) }}</strong><span>{{ $t('waiting.waitingNow') }}</span></div>
          <div><strong>{{ stats.seats }}</strong><span>{{ $t('waiting.seats') }}</span></div>
          <div><strong>{{ stats.today }}</strong><span>{{ $t('waiting.today') }}</span></div>
        </div>

        <ul class="arrivals" aria-live="polite">
          <TransitionGroup name="arrive">
            <li v-for="r in stats.recent.slice(0, 4)" :key="r.firstName + r.at">
              <span class="dot" />
              <span>{{ $t('waiting.arrived', { name: r.firstName, city: r.city }) }}</span>
              <small>{{ timeAgo(r.at, locale) }}</small>
            </li>
          </TransitionGroup>
        </ul>

        <Transition name="proverb" mode="out-in">
          <blockquote :key="proverbIndex" class="proverb">
            « {{ proverbText(proverb, locale) }} »
            <cite>{{ $t('waiting.proverbFrom', { origin: proverbOrigin }) }}</cite>
          </blockquote>
        </Transition>
      </section>

      <!-- Formulaire / Ticket -->
      <section class="desk wood-panel">
        <Transition name="page" mode="out-in">
          <WaitingTicket v-if="result" :entry="result.entry" :total="result.total" :seats="result.seats" />
          <div v-else>
            <h2 class="desk-title">{{ $t('waiting.formTitle') }}</h2>
            <p class="text-muted">{{ $t('waiting.formLead') }}</p>
            <WaitlistForm @joined="onJoined" />
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.room {
  position: relative; min-height: 100vh; padding: 7.5rem 0 5rem; overflow: hidden;
  background:
    radial-gradient(70% 50% at 20% 10%, rgba(240, 180, 90, .18), transparent 70%),
    linear-gradient(180deg, #6e3219 0%, #4a2414 55%, #2a170d 100%);
}
.room::before { content: ''; position: absolute; inset: 0; @include clay-grain(.3); mix-blend-mode: multiply; opacity: .9; pointer-events: none; }

.layout { position: relative; z-index: 1; display: grid; gap: 2.5rem; @include md-up { grid-template-columns: .9fr 1.1fr; align-items: start; } }

.welcome h1 { font-size: clamp(2rem, 4.2vw, 3.3rem); }
.manu-says { display: flex; gap: 1rem; align-items: flex-start; margin: 1.25rem 0;
  p { margin: 0; padding: .9rem 1.1rem; border-radius: 4px 18px 18px 18px; background: rgba(245, 236, 219, .95); color: #2a1a12; font-size: .95rem; line-height: 1.5; box-shadow: var(--shadow-soft); }
  :dir(rtl) & p { border-radius: 18px 4px 18px 18px; } }
.counters { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin: 1.5rem 0;
  div { padding: .9rem; border-radius: 16px; background: rgba(26, 17, 11, .45); border: 1px solid var(--kec-border); text-align: center; }
  strong { display: block; font-family: var(--font-display); font-size: 1.8rem; color: var(--kec-gold-soft); line-height: 1.1; }
  span { font-size: .74rem; color: var(--kec-text-muted); } }
.bench { margin: 0 0 1.25rem; }
.offer { max-width: 320px; margin: .5rem 0; }
.arrivals { list-style: none; padding: 0; margin: 0 0 1.5rem; display: grid; gap: .45rem; font-size: .88rem;
  li { display: flex; align-items: center; gap: .6rem; padding: .5rem .8rem; border-radius: 12px; background: rgba(26, 17, 11, .35); }
  small { margin-inline-start: auto; color: var(--kec-text-muted); font-size: .74rem; white-space: nowrap; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: #8fbf5a; flex-shrink: 0; } }
.arrive-enter-active { transition: all .6s var(--ease-spring); }
.arrive-enter-from { opacity: 0; transform: translateX(-20px); background: rgba(214, 165, 72, .3); }
.arrive-leave-active { display: none; }
.proverb { margin: 0; padding-inline-start: 1rem; border-inline-start: 2px solid var(--kec-gold); font-family: var(--font-display); font-style: italic; font-size: 1.12rem; color: #f5e3c8;
  cite { display: block; margin-top: .4rem; font-family: var(--font-body); font-style: normal; font-size: .76rem; letter-spacing: .08em; color: var(--kec-gold-soft); } }
.proverb-enter-active, .proverb-leave-active { transition: all .6s var(--ease-out); }
.proverb-enter-from { opacity: 0; transform: translateY(8px); }
.proverb-leave-to { opacity: 0; transform: translateY(-8px); }

.desk { padding: clamp(1.25rem, 3vw, 2.25rem); }
.desk-title { font-size: clamp(1.5rem, 2.6vw, 2rem); }
</style>

<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Kia — le canal des investisseurs (mobile d'abord)
 * ─────────────────────────────────────────────────────────────
 * « Voir depuis son téléphone si une personne s'inscrit, et si
 *   l'argent entre. » Compteurs live, fil d'activité temps réel,
 * vibration + notification à chaque nouvelle inscription/paiement.
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api, API_MODE } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useLiveEvents } from '@/composables/useLiveEvents'
import { useCountUp } from '@/composables/useCountUp'
import KSparkline from '@/components/ui/KSparkline.vue'
import KBarList from '@/components/ui/KBarList.vue'
import KLoader from '@/components/ui/KLoader.vue'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import { formatXaf, formatCompactXaf, formatNumber, timeAgo } from '@/utils/format'

const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const kpi = ref(null)
const feed = ref([])
const flash = ref(false)
const notifyOn = ref(typeof Notification !== 'undefined' && Notification.permission === 'granted')

onMounted(async () => {
  ;[kpi.value, feed.value] = await Promise.all([api.investor.dashboard(), api.investor.activity(14)])
})

const waitlist = useCountUp(computed(() => kpi.value?.waitlistTotal ?? 0))
const revenue = useCountUp(computed(() => kpi.value?.revenueXaf ?? 0), { duration: 1800 })
const revenuePct = computed(() => (kpi.value ? Math.min(100, (kpi.value.revenueXaf / kpi.value.potentialXaf) * 100) : 0))
const goalPct = computed(() => (kpi.value ? Math.min(100, (kpi.value.waitlistTotal / kpi.value.waitlistGoal) * 100) : 0))
const channels = computed(() => kpi.value?.channels.slice(0, 6).map((c) => ({ label: t(`acquisition.${c.key}`), count: c.count })) ?? [])

function notify(text) {
  navigator.vibrate?.([60, 40, 60])
  if (notifyOn.value && document.hidden) new Notification('KEC · Kia', { body: text, icon: '/favicon.svg' })
}

useLiveEvents((e) => {
  if (!kpi.value) return
  const k = { ...kpi.value }
  let text = ''
  if (e.type === 'waitlist.signup') {
    k.waitlistTotal++; k.waitlistToday++
    k.byDay = k.byDay.map((d, i) => (i === k.byDay.length - 1 ? { ...d, count: d.count + 1 } : d))
    text = t('kia.newSignup', { name: e.payload.firstName, city: e.payload.targetCity })
    feed.value.unshift({ type: e.type, at: e.at, payload: { firstName: e.payload.firstName, city: e.payload.targetCity, residence: e.payload.residenceCountry } })
  } else if (e.type === 'payment.succeeded') {
    k.revenueXaf += e.payload.amount; k.revenueToday += e.payload.amount; k.paymentsCount++
    text = t('kia.newPayment', { amount: formatXaf(e.payload.amount, locale.value) })
    feed.value.unshift({ type: e.type, at: e.at, payload: e.payload })
    ui.rainCowries(30)
  } else if (e.type === 'fellow.selected') {
    k.selected++
    text = t('kia.newFellow', { name: e.payload.firstName })
  }
  kpi.value = k
  feed.value = feed.value.slice(0, 20)
  if (text) { ui.toast(text, { type: 'live', icon: e.type === 'payment.succeeded' ? '💰' : '🟢' }); notify(text) }
  flash.value = true
  setTimeout(() => { flash.value = false }, 900)
}, { simulate: true })

async function enableNotifications() {
  if (typeof Notification === 'undefined') return
  notifyOn.value = (await Notification.requestPermission()) === 'granted'
}
</script>

<template>
  <div class="kia">
    <KLoader v-if="!kpi" :label="$t('common.loading')" />
    <template v-else>
      <section class="hello">
        <p class="eyebrow"><span class="live-dot" /> {{ $t('kia.live') }}</p>
        <h1>{{ $t('kia.hello', { name: auth.user.name.split(' ')[0] }) }}</h1>
        <p class="text-muted">{{ $t('kia.lead') }}</p>
      </section>

      <!-- Le pouls : inscrits + argent entré -->
      <section class="pulse-cards">
        <article class="pc wood-panel" :class="{ flash }">
          <span class="lbl">{{ $t('kia.waitlist') }}</span>
          <strong class="big">{{ formatNumber(waitlist, locale) }}</strong>
          <span class="delta">+{{ kpi.waitlistToday }} {{ $t('kia.today') }}</span>
          <div class="bar"><span :style="{ width: `${goalPct}%` }" /></div>
          <small class="text-muted">{{ $t('kia.goal', { n: formatNumber(kpi.waitlistGoal, locale) }) }}</small>
        </article>
        <article class="pc money">
          <span class="lbl">{{ $t('kia.revenue') }}</span>
          <strong class="big">{{ formatCompactXaf(revenue, locale) }}</strong>
          <span class="delta">+{{ formatXaf(kpi.revenueToday, locale) }} {{ $t('kia.today') }}</span>
          <div class="bar"><span :style="{ width: `${revenuePct}%` }" /></div>
          <small>{{ $t('kia.potential', { amount: formatCompactXaf(kpi.potentialXaf, locale) }) }}</small>
        </article>
      </section>

      <section class="mini-stats">
        <div><strong>{{ kpi.selected }}<small>/{{ kpi.seats }}</small></strong><span>{{ $t('kia.fellows') }}</span></div>
        <div><strong>{{ kpi.paymentsCount }}</strong><span>{{ $t('kia.payments') }}</span></div>
        <div><strong>{{ kpi.diasporaShare }}%</strong><span>{{ $t('kia.diaspora') }}</span></div>
        <div><strong>{{ kpi.waitlistWeek }}</strong><span>{{ $t('kia.week') }}</span></div>
      </section>

      <div class="cols">
        <section class="wood-panel box">
          <h3>{{ $t('kia.trend') }}</h3>
          <KSparkline :values="kpi.byDay.map((d) => d.count)" :height="110" />
        </section>
        <section class="wood-panel box">
          <h3>{{ $t('kia.channels') }}</h3>
          <KBarList :items="channels" />
        </section>
      </div>

      <section class="feed-box">
        <header>
          <h3>{{ $t('kia.feed') }}</h3>
          <button v-if="!notifyOn" type="button" class="notif" @click="enableNotifications">🔔 {{ $t('kia.enableNotif') }}</button>
        </header>
        <TransitionGroup tag="ul" name="feed" class="feed">
          <li v-for="ev in feed" :key="ev.type + ev.at + (ev.payload.firstName || ev.payload.payerName)" :class="ev.type">
            <span class="ico">
              <CowrieShape v-if="ev.type === 'waitlist.signup'" :size="13" />
              <template v-else>₣</template>
            </span>
            <p v-if="ev.type === 'waitlist.signup'">{{ $t('kia.feedSignup', { name: ev.payload.firstName, city: ev.payload.city, residence: ev.payload.residence }) }}</p>
            <p v-else>{{ $t('kia.feedPayment', { amount: formatXaf(ev.payload.amount, locale), method: ev.payload.method?.toUpperCase() }) }}</p>
            <small>{{ timeAgo(ev.at, locale) }}</small>
          </li>
        </TransitionGroup>
      </section>

      <p v-if="API_MODE === 'mock'" class="mock-note">{{ $t('kia.mockNote') }}</p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.kia { display: grid; gap: 1.25rem; }
.hello h1 { font-size: clamp(1.7rem, 5vw, 2.6rem); margin-bottom: .2rem; }
.hello p { margin: 0; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #8fbf5a; display: inline-block; animation: blink 1.2s infinite; }
@keyframes blink { 50% { opacity: .2; } }
.eyebrow::before { display: none; }
.pulse-cards { display: grid; gap: 1rem; @include sm-up { grid-template-columns: 1fr 1fr; } }
.pc { position: relative; overflow: hidden; padding: 1.4rem; display: flex; flex-direction: column; gap: .3rem; transition: box-shadow .4s;
  &.flash { box-shadow: 0 0 0 2px var(--kec-gold), 0 0 40px rgba(214,165,72,.4); } }
.money { border-radius: var(--radius-lg); background: radial-gradient(120% 100% at 0% 0%, #e9c983 0%, #c0612f 55%, #6e2a14 100%); color: #1a110b; box-shadow: var(--shadow-soft);
  .lbl, small { color: rgba(26,17,11,.75); } .delta { color: #1a110b; } .bar { background: rgba(26,17,11,.2); } .bar span { background: #1a110b; } }
.lbl { font-size: .74rem; letter-spacing: .16em; text-transform: uppercase; font-weight: 800; color: var(--kec-text-muted); }
.big { font-family: var(--font-display); font-size: clamp(2.4rem, 9vw, 3.4rem); line-height: 1.05; font-weight: 600; }
.delta { font-weight: 800; color: #a9c77a; font-size: .9rem; }
.bar { height: 8px; border-radius: 99px; background: rgba(255,255,255,.08); overflow: hidden; margin-top: .6rem; span { display: block; height: 100%; background: linear-gradient(90deg, var(--kec-laterite), var(--kec-gold)); transition: width 1s var(--ease-out); } }
small { font-size: .78rem; }
.mini-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; @include md-up { grid-template-columns: repeat(4, 1fr); }
  div { padding: .9rem 1rem; border-radius: 16px; background: rgba(44,28,18,.7); border: 1px solid var(--kec-border); display: flex; flex-direction: column; }
  strong { font-family: var(--font-display); font-size: 1.6rem; small { font-size: .55em; color: var(--kec-text-muted); } }
  span { font-size: .78rem; color: var(--kec-text-muted); } }
.cols { display: grid; gap: 1rem; @include md-up { grid-template-columns: 1.3fr 1fr; } }
.box { padding: 1.25rem; h3 { font-size: 1.05rem; } }
.feed-box header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: .75rem; h3 { margin: 0; } }
.notif { background: none; border: 1px solid var(--kec-gold); color: var(--kec-gold-soft); border-radius: 999px; padding: .4rem .9rem; font-size: .8rem; font-weight: 700; }
.feed { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; position: relative;
  li { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; gap: .75rem; padding: .7rem .9rem; border-radius: 14px; background: rgba(44,28,18,.6); border: 1px solid rgba(233,201,131,.08); }
  p { margin: 0; font-size: .88rem; }
  small { color: var(--kec-text-muted); white-space: nowrap; font-size: .72rem; }
  .ico { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: rgba(214,165,72,.12); color: var(--kec-gold); font-weight: 900; }
  .payment\.succeeded .ico { background: var(--kec-gold); color: #1a110b; } }
.feed-enter-active { transition: all .6s var(--ease-spring); }
.feed-enter-from { opacity: 0; transform: translateY(-16px) scale(.97); }
.feed-leave-active { display: none; }
.mock-note { font-size: .76rem; color: var(--kec-text-muted); text-align: center; }
</style>

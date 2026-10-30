
<script setup>
/**
 * Parler à un consultant (payant à l'heure).
 * Deux onglets :
 *  - Mes rendez-vous : à venir (avec lien visio, annulation) et historique complet
 *    (comptes rendus des consultants, annulations, avoirs).
 *  - Réserver : consultant -> jour -> créneau -> durée -> sujet -> mode -> paiement -> confirmé.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { APP_CONFIG } from '@/config/app.config'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import KChips from '@/components/ui/KChips.vue'
import KModal from '@/components/ui/KModal.vue'
import KLoader from '@/components/ui/KLoader.vue'
import PaymentPanel from '@/components/features/PaymentPanel.vue'
import BookingCard from '@/components/features/BookingCard.vue'
import { formatXaf, formatDate } from '@/utils/format'

const { t, locale } = useI18n()
const route = useRoute()
const auth = useAuthStore()
const ui = useUiStore()

const tab = ref(route.query.tab === 'book' ? 'book' : 'mine')
const bookings = ref(null)
const consultants = ref([])
const consultantId = ref('')
const days = Array.from({ length: 12 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d.toISOString().slice(0, 10) })
const date = ref(days[0])
const slots = ref([])
const slot = ref('')
const duration = ref(60)
const topic = ref('')
const mode = ref('visio')
const notes = ref('')
const booking = ref(null)     // réservation en cours de paiement
const paying = ref(false)
const confirmed = ref(false)
const cancelling = ref(null)
const cancelReason = ref('')

const price = computed(() => Math.round((APP_CONFIG.consultant.hourlyRateXaf * duration.value) / 60))
const consultant = computed(() => consultants.value.find((c) => c.id === consultantId.value))
const startOf = (b) => new Date(`${b.date}T${b.slot}:00`).getTime()
const upcoming = computed(() => (bookings.value ?? []).filter((b) => ['confirmed', 'awaiting_payment'].includes(b.status) && startOf(b) > Date.now() - 3600000).sort((a, b) => startOf(a) - startOf(b)))
const history = computed(() => (bookings.value ?? []).filter((b) => !upcoming.value.includes(b)))
const totals = computed(() => ({
  done: history.value.filter((b) => b.status === 'completed').length,
  hours: Math.round((bookings.value ?? []).filter((b) => ['completed', 'confirmed'].includes(b.status)).reduce((s, b) => s + b.durationMin, 0) / 60 * 10) / 10,
  spent: (bookings.value ?? []).filter((b) => ['completed', 'confirmed'].includes(b.status)).reduce((s, b) => s + b.amount, 0)
}))
const canCancelFree = (b) => (startOf(b) - Date.now()) / 3600000 >= APP_CONFIG.consultant.freeCancellationHours

const loadMine = async () => { bookings.value = await api.consultant.listMine(auth.user.id) }
onMounted(async () => {
  consultants.value = await api.consultant.listConsultants()
  consultantId.value = consultants.value[0]?.id ?? ''
  await loadMine()
})
watch([date, consultantId], async ([d, c]) => { slot.value = ''; if (c) slots.value = await api.consultant.availability(d, c) }, { immediate: true })

async function book() {
  booking.value = await api.consultant.book({
    userId: auth.user.id, userName: auth.user.name, companyId: auth.user.companyId, fellowNumber: auth.user.fellowNumber,
    consultantId: consultantId.value, date: date.value, slot: slot.value, durationMin: duration.value, topic: topic.value || t('consultant.defaultTopic'), mode: mode.value, notes: notes.value
  })
  paying.value = true
}
/** Payer plus tard une réservation « en attente de paiement » */
function payLater(b) { booking.value = b; confirmed.value = false; paying.value = true }
async function onPaid(payment) {
  await api.consultant.confirm(booking.value.id, payment.id)
  confirmed.value = true
  await loadMine()
}
function reset() { paying.value = false; confirmed.value = false; booking.value = null; slot.value = ''; topic.value = ''; notes.value = ''; tab.value = 'mine' }

async function cancel() {
  const b = cancelling.value
  await api.consultant.cancel(b.id, cancelReason.value)
  cancelling.value = null; cancelReason.value = ''
  await loadMine()
  ui.toast(t('booking.cancelled'), { type: 'success' })
}
</script>

<template>
  <div class="consult">
    <header class="hero-c wood-panel">
      <div>
        <span class="eyebrow">{{ $t('consultant.eyebrow') }}</span>
        <h1>{{ $t('consultant.barQuestion') }}</h1>
        <p class="text-muted">{{ $t('consultant.lead') }}</p>
      </div>
      <div class="rate"><strong>{{ formatXaf(APP_CONFIG.consultant.hourlyRateXaf, locale) }}</strong><span>/ {{ $t('consultant.hour') }}</span></div>
    </header>

    <div class="tabs" role="tablist">
      <button type="button" role="tab" :class="{ on: tab === 'mine' }" @click="tab = 'mine'">{{ $t('booking.mine') }} <small v-if="upcoming.length">{{ upcoming.length }}</small></button>
      <button type="button" role="tab" :class="{ on: tab === 'book' }" @click="tab = 'book'">{{ $t('booking.book') }}</button>
    </div>

    <!-- ═══ Mes rendez-vous ═══ -->
    <template v-if="tab === 'mine'">
      <KLoader v-if="!bookings" />
      <template v-else>
        <div class="stats">
          <div class="st"><strong>{{ upcoming.length }}</strong><span>{{ $t('booking.statUpcoming') }}</span></div>
          <div class="st"><strong>{{ totals.done }}</strong><span>{{ $t('booking.statDone') }}</span></div>
          <div class="st"><strong>{{ totals.hours }} h</strong><span>{{ $t('booking.statHours') }}</span></div>
          <div class="st"><strong>{{ formatXaf(totals.spent, locale) }}</strong><span>{{ $t('booking.statSpent') }}</span></div>
        </div>

        <section class="group">
          <h3>{{ $t('booking.upcoming') }}</h3>
          <div v-if="upcoming.length" class="cards">
            <BookingCard v-for="b in upcoming" :key="b.id" :booking="b">
              <KButton v-if="b.status === 'awaiting_payment'" size="sm" @click="payLater(b)">{{ $t('booking.payNow', { amount: formatXaf(b.amount, locale) }) }}</KButton>
              <KButton size="sm" variant="ghost" :icon="false" @click="cancelling = b">{{ $t('booking.cancel') }}</KButton>
            </BookingCard>
          </div>
          <p v-else class="empty text-muted">{{ $t('booking.noUpcoming') }} <button type="button" class="lnk" @click="tab = 'book'">{{ $t('booking.book') }} →</button></p>
        </section>

        <section class="group">
          <h3>{{ $t('booking.history') }} <small class="text-muted">({{ history.length }})</small></h3>
          <div v-if="history.length" class="cards">
            <BookingCard v-for="b in history" :key="b.id" :booking="b" />
          </div>
          <p v-else class="empty text-muted">{{ $t('booking.noHistory') }}</p>
        </section>
      </template>
    </template>

    <!-- ═══ Réserver ═══ -->
    <template v-else>
      <section class="step">
        <h3>1. {{ $t('consultant.who') }}</h3>
        <div class="people">
          <button v-for="c in consultants" :key="c.id" type="button" class="person" :class="{ on: consultantId === c.id }" @click="consultantId = c.id">
            <span class="ava">{{ c.name.split(' ').at(-1)[0] }}</span>
            <strong>{{ c.name }}</strong>
            <small>{{ $t(`consultant.speciality.${c.speciality}`) }} · {{ c.languages.map((l) => l.toUpperCase()).join(' / ') }}</small>
          </button>
        </div>
      </section>

      <section class="step">
        <h3>2. {{ $t('consultant.when') }}</h3>
        <div class="days">
          <button v-for="d in days" :key="d" type="button" class="day" :class="{ on: date === d }" @click="date = d">
            <small>{{ formatDate(d, locale, { weekday: 'short' }) }}</small>
            <strong>{{ formatDate(d, locale, { day: 'numeric' }) }}</strong>
            <small>{{ formatDate(d, locale, { month: 'short' }) }}</small>
          </button>
        </div>
        <div class="slots">
          <button v-for="s in slots" :key="s.time" type="button" class="slot" :class="{ on: slot === s.time }" :disabled="!s.free" @click="slot = s.time">{{ s.time }}</button>
        </div>
      </section>

      <section class="step">
        <h3>3. {{ $t('consultant.what') }}</h3>
        <div class="grid-2">
          <KField :label="$t('consultant.duration')">
            <KChips v-model="duration" :options="APP_CONFIG.consultant.durations.map((m) => ({ value: m, label: `${m} min` }))" />
          </KField>
          <KField :label="$t('booking.modeLabel')">
            <KChips v-model="mode" :options="APP_CONFIG.consultant.meetingModes.map((m) => ({ value: m, label: $t(`booking.mode.${m}`) }))" />
          </KField>
        </div>
        <KField :label="$t('consultant.topic')" for-id="c-topic" required>
          <textarea id="c-topic" v-model="topic" class="k-input" rows="2" :placeholder="$t('consultant.topicPh')" />
        </KField>
        <KField :label="$t('booking.notesLabel')" :hint="$t('booking.notesHint')" for-id="c-notes">
          <input id="c-notes" v-model="notes" class="k-input" />
        </KField>
      </section>

      <div class="summary clay-panel">
        <p>
          <template v-if="slot">{{ $t('consultant.summary', { date: formatDate(date, locale, { weekday: 'long', day: 'numeric', month: 'long' }), slot, duration }) }} · {{ consultant?.name }}</template>
          <template v-else>{{ $t('consultant.pickSlot') }}</template>
        </p>
        <strong>{{ formatXaf(price, locale) }}</strong>
        <KButton :disabled="!slot" @click="book">{{ $t('consultant.bookPay') }}</KButton>
      </div>
      <p class="policy text-muted">{{ $t('booking.policy', { h: APP_CONFIG.consultant.freeCancellationHours }) }}</p>
    </template>

    <!-- Paiement / confirmation -->
    <KModal :open="paying" :title="confirmed ? $t('consultant.confirmedTitle') : $t('consultant.payTitle')" @close="reset">
      <PaymentPanel v-if="booking && !confirmed" :amount="booking.amount" purpose="consultant" :booking-id="booking.id" :label="`${$t('consultant.payLabel')} · ${booking.consultant}`" @paid="onPaid" />
      <div v-else class="ok">
        <p>{{ $t('consultant.confirmed', { name: booking?.consultant, date: formatDate(booking?.date, locale), slot: booking?.slot }) }}</p>
        <KButton variant="wood" :icon="false" @click="reset">{{ $t('booking.seeMine') }}</KButton>
      </div>
    </KModal>

    <!-- Annulation -->
    <KModal :open="!!cancelling" :title="$t('booking.cancelTitle')" @close="cancelling = null">
      <div v-if="cancelling" class="cancel-box">
        <p>{{ cancelling.status === 'awaiting_payment' ? $t('booking.cancelUnpaid') : canCancelFree(cancelling) ? $t('booking.cancelFree', { amount: formatXaf(cancelling.amount, locale) }) : $t('booking.cancelLate', { amount: formatXaf(Math.round(cancelling.amount / 2), locale) }) }}</p>
        <KField :label="$t('booking.cancelReason')" for-id="c-reason"><input id="c-reason" v-model="cancelReason" class="k-input" /></KField>
      </div>
      <template #footer>
        <KButton variant="ghost" :icon="false" @click="cancelling = null">{{ $t('common.back') }}</KButton>
        <KButton variant="danger" :icon="false" @click="cancel">{{ $t('booking.confirmCancel') }}</KButton>
      </template>
    </KModal>
  </div>
</template>

<style scoped lang="scss">
.consult { display: grid; gap: 1.5rem; }
.hero-c { padding: 1.5rem; display: grid; gap: 1rem; @include md-up { grid-template-columns: 1fr auto; align-items: center; } h1 { font-size: clamp(1.5rem, 3vw, 2.2rem); margin-bottom: .3rem; } p { margin: 0; } }
.rate { text-align: center; padding: 1rem 1.5rem; border-radius: var(--radius-pebble); background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548 70%); color: #2a1a12; strong { display: block; font-family: var(--font-display); font-size: 1.6rem; } span { font-size: .85rem; font-weight: 700; } }
.tabs { display: flex; gap: .4rem; button { background: rgba(20,12,7,.4); border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .55rem 1.1rem; border-radius: 999px; font-weight: 700; small { margin-inline-start: .3rem; padding: .05rem .45rem; border-radius: 99px; background: rgba(214,165,72,.2); color: var(--kec-gold-soft); } &.on { background: var(--kec-cowrie); color: #2a1a12; small { background: rgba(42,26,18,.15); color: #2a1a12; } } } }
.stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; @include md-up { grid-template-columns: repeat(4, 1fr); } }
.st { padding: .9rem 1rem; border-radius: 16px; border: 1px solid var(--kec-border); background: rgba(20,12,7,.35); display: flex; flex-direction: column; strong { font-family: var(--font-display); font-size: 1.5rem; color: var(--kec-gold-soft); } span { font-size: .76rem; color: var(--kec-text-muted); } }
.group { display: grid; gap: .9rem; h3 { margin: 0; font-size: 1.1rem; color: var(--kec-sand); } }
.cards { display: grid; gap: .9rem; @include lg-up { grid-template-columns: 1fr 1fr; } }
.empty { margin: 0; padding: 1.25rem; border: 1px dashed var(--kec-border); border-radius: 16px; text-align: center; }
.lnk { background: none; border: 0; color: var(--kec-gold); font-weight: 700; }
.step h3 { font-size: 1.1rem; margin-bottom: .9rem; color: var(--kec-sand); }
.step { display: grid; gap: .9rem; }
.grid-2 { display: grid; gap: 1rem; @include sm-up { grid-template-columns: 1fr 1fr; } }
.people { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
.person { display: grid; grid-template-columns: 44px 1fr; grid-template-rows: auto auto; column-gap: .8rem; text-align: start; padding: .9rem; border-radius: 16px; border: 1px solid var(--kec-border); background: rgba(20,12,7,.35); color: var(--kec-ivory);
  .ava { grid-row: span 2; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #2a1a12; background: radial-gradient(circle at 35% 30%, #f0b49b, #c0612f); }
  small { color: var(--kec-text-muted); font-size: .76rem; }
  &.on { border-color: var(--kec-gold); background: rgba(214,165,72,.12); } }
.days { display: flex; gap: .5rem; overflow-x: auto; padding-bottom: .3rem; }
.day { flex: 0 0 64px; display: flex; flex-direction: column; align-items: center; padding: .6rem .3rem; border-radius: 16px; border: 1px solid var(--kec-border); background: rgba(20,12,7,.35); color: var(--kec-text-muted); text-transform: capitalize;
  strong { font-family: var(--font-display); font-size: 1.35rem; color: var(--kec-ivory); } small { font-size: .7rem; }
  &.on { background: var(--kec-cowrie); color: #5a3a24; strong { color: #2a1a12; } } }
.slots { display: flex; flex-wrap: wrap; gap: .5rem; }
.slot { padding: .55rem 1rem; border-radius: 999px; border: 1px solid var(--kec-border); background: rgba(20,12,7,.35); color: var(--kec-ivory); font-weight: 700;
  &:disabled { opacity: .3; text-decoration: line-through; cursor: not-allowed; } &.on { background: var(--kec-gold); color: #2a1a12; border-color: transparent; } }
.summary { position: sticky; bottom: 5.5rem; z-index: 5; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: 1rem 1.25rem; @include md-up { bottom: 1rem; }
  p { flex: 1 1 260px; margin: 0; font-size: .92rem; } strong { font-family: var(--font-display); font-size: 1.5rem; color: var(--kec-gold-soft); } }
.policy { font-size: .8rem; margin: 0; }
.ok, .cancel-box { display: grid; gap: 1rem; justify-items: start; p { margin: 0; } }
</style>


<script setup>
/**
 * Back-office — Rendez-vous consultants : vue centralisée de toutes les
 * réservations des fellows (qui, avec qui, quand, durée, sujet, montant),
 * agenda par jour, filtres, et actions : compte rendu, annulation, réassignation.
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import KBadge from '@/components/ui/KBadge.vue'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import KModal from '@/components/ui/KModal.vue'
import KLoader from '@/components/ui/KLoader.vue'
import KStat from '@/components/ui/KStat.vue'
import KBarList from '@/components/ui/KBarList.vue'
import BookingCard from '@/components/features/BookingCard.vue'
import { formatXaf, formatDate } from '@/utils/format'

const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const bookings = ref(null)
const team = ref([])
const view = ref('upcoming') // upcoming | past | all
const consultantId = ref('all')
const status = ref('all')
const q = ref('')
const acting = ref(null) // { booking, action }
const summary = ref('')
const reason = ref('')
const newConsultant = ref('')

onMounted(async () => { ;[bookings.value, team.value] = await Promise.all([api.backoffice.listBookings(), api.backoffice.listTeam()]) })

const consultants = computed(() => team.value.filter((m) => m.role === 'consultant'))
const startOf = (b) => new Date(`${b.date}T${b.slot}:00`).getTime()
const WEEK = 7 * 86400000

const stats = computed(() => {
  const all = bookings.value ?? []
  const now = Date.now()
  const confirmed = all.filter((b) => b.status === 'confirmed' && startOf(b) > now)
  const paid = all.filter((b) => ['confirmed', 'completed'].includes(b.status))
  return {
    week: confirmed.filter((b) => startOf(b) < now + WEEK).length,
    today: confirmed.filter((b) => b.date === new Date().toISOString().slice(0, 10)).length,
    awaiting: all.filter((b) => b.status === 'awaiting_payment').length,
    hours: Math.round(paid.reduce((s, b) => s + b.durationMin, 0) / 60),
    revenue: paid.reduce((s, b) => s + b.amount, 0),
    completed: all.filter((b) => b.status === 'completed').length,
    needSummary: all.filter((b) => b.status === 'confirmed' && startOf(b) + b.durationMin * 60000 < now).length
  }
})
const byConsultant = computed(() => consultants.value.map((c) => ({ label: c.name, count: (bookings.value ?? []).filter((b) => b.consultantId === c.id && b.status !== 'cancelled').length })))
const byTopic = computed(() => {
  const o = {}
  ;(bookings.value ?? []).forEach((b) => { o[b.speciality] = (o[b.speciality] ?? 0) + 1 })
  return Object.entries(o).map(([k, n]) => ({ label: t(`consultant.speciality.${k}`), count: n }))
})

const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  const now = Date.now()
  return (bookings.value ?? []).filter((b) =>
    (view.value === 'all' || (view.value === 'upcoming' ? startOf(b) + b.durationMin * 60000 >= now && b.status !== 'cancelled' : startOf(b) < now || b.status === 'cancelled')) &&
    (consultantId.value === 'all' || b.consultantId === consultantId.value) &&
    (status.value === 'all' || b.status === status.value) &&
    (!needle || `${b.userName} ${b.consultant} ${b.topic}`.toLowerCase().includes(needle)))
    .sort((a, b) => (view.value === 'upcoming' ? startOf(a) - startOf(b) : startOf(b) - startOf(a)))
})
/** Agenda : groupe par jour */
const days = computed(() => {
  const out = []
  for (const b of filtered.value) {
    if (!out.length || out.at(-1).date !== b.date) out.push({ date: b.date, items: [] })
    out.at(-1).items.push(b)
  }
  return out
})
const needsSummary = (b) => b.status === 'confirmed' && startOf(b) + b.durationMin * 60000 < Date.now()

function open(booking, action) { acting.value = { booking, action }; summary.value = ''; reason.value = ''; newConsultant.value = booking.consultantId }
async function apply() {
  const { booking, action } = acting.value
  const patch = action === 'complete' ? { status: 'completed', summary: summary.value } : action === 'cancel' ? { status: 'cancelled', cancelReason: reason.value } : { consultantId: newConsultant.value }
  const updated = await api.backoffice.updateBooking(booking.id, patch, auth.actor)
  Object.assign(booking, updated)
  acting.value = null
  ui.toast(t('bo.appointments.saved'), { type: 'success' })
}
</script>

<template>
  <div class="appt">
    <header class="head">
      <div>
        <span class="eyebrow">{{ $t('bo.eyebrow') }}</span>
        <h1>{{ $t('bo.appointments.title') }}</h1>
        <p class="text-muted">{{ $t('bo.appointments.lead') }}</p>
      </div>
    </header>
    <KLoader v-if="!bookings" />
    <template v-else>
      <div class="kpis">
        <KStat :label="$t('bo.appointments.kpi.week')" :value="stats.week" :hint="$t('bo.appointments.kpi.today', { n: stats.today })" />
        <KStat :label="$t('bo.appointments.kpi.awaiting')" :value="stats.awaiting" accent="clay" :hint="$t('bo.appointments.kpi.needSummary', { n: stats.needSummary })" />
        <KStat :label="$t('bo.appointments.kpi.hours')" :value="stats.hours" suffix="h" accent="olive" :hint="$t('bo.appointments.kpi.completed', { n: stats.completed })" />
        <KStat :label="$t('bo.appointments.kpi.revenue')" :value="stats.revenue" :format="(v) => formatXaf(v, locale)" />
      </div>

      <div class="charts">
        <section class="wood-panel box"><h3>{{ $t('bo.appointments.byConsultant') }}</h3><KBarList :items="byConsultant" /></section>
        <section class="wood-panel box"><h3>{{ $t('bo.appointments.byTopic') }}</h3><KBarList :items="byTopic" /></section>
      </div>

      <div class="filters">
        <div class="tabs">
          <button v-for="v in ['upcoming', 'past', 'all']" :key="v" type="button" :class="{ on: view === v }" @click="view = v">{{ $t(`bo.appointments.views.${v}`) }}</button>
        </div>
        <input v-model="q" class="k-input" :placeholder="$t('bo.appointments.search')" />
        <select v-model="consultantId" class="k-input"><option value="all">{{ $t('bo.appointments.allConsultants') }}</option><option v-for="c in consultants" :key="c.id" :value="c.id">{{ c.name }}</option></select>
        <select v-model="status" class="k-input"><option value="all">{{ $t('common.all') }}</option><option v-for="s in ['awaiting_payment', 'confirmed', 'completed', 'cancelled']" :key="s" :value="s">{{ $t(`booking.status.${s}`) }}</option></select>
      </div>

      <p v-if="!days.length" class="text-muted empty">{{ $t('bo.appointments.empty') }}</p>
      <section v-for="d in days" :key="d.date" class="day">
        <h3><span>{{ formatDate(d.date, locale, { weekday: 'long', day: 'numeric', month: 'long' }) }}</span><small>{{ d.items.length }}</small></h3>
        <div class="cards">
          <BookingCard v-for="b in d.items" :key="b.id" :booking="b" show-fellow>
            <template v-if="auth.can('manageAppointments')">
              <KButton v-if="b.status === 'confirmed'" size="sm" :variant="needsSummary(b) ? 'cowrie' : 'wood'" :icon="needsSummary(b)" @click="open(b, 'complete')">{{ $t('bo.appointments.complete') }}</KButton>
              <KButton v-if="['confirmed', 'awaiting_payment'].includes(b.status)" size="sm" variant="ghost" :icon="false" @click="open(b, 'reassign')">{{ $t('bo.appointments.reassign') }}</KButton>
              <KButton v-if="['confirmed', 'awaiting_payment'].includes(b.status)" size="sm" variant="ghost" :icon="false" @click="open(b, 'cancel')">{{ $t('booking.cancel') }}</KButton>
            </template>
            <RouterLink class="dlink" :to="{ name: 'bo-dossiers', params: { id: b.companyId } }">{{ $t('bo.appointments.openDossier') }} →</RouterLink>
          </BookingCard>
        </div>
      </section>
    </template>

    <KModal :open="!!acting" :title="acting ? $t(`bo.appointments.modal.${acting.action}`) : ''" @close="acting = null">
      <div v-if="acting" class="modal-form">
        <p class="who"><strong>{{ acting.booking.userName }}</strong> · {{ acting.booking.consultant }} · {{ formatDate(acting.booking.date, locale) }} {{ acting.booking.slot }}<br /><em>{{ acting.booking.topic }}</em></p>
        <KField v-if="acting.action === 'complete'" :label="$t('booking.summary')" :hint="$t('bo.appointments.summaryHint')" required><textarea v-model="summary" class="k-input" rows="5" /></KField>
        <KField v-else-if="acting.action === 'cancel'" :label="$t('booking.cancelReason')" :hint="$t('bo.appointments.cancelHint', { amount: formatXaf(acting.booking.amount, locale) })" required><input v-model="reason" class="k-input" /></KField>
        <KField v-else :label="$t('consultant.who')"><select v-model="newConsultant" class="k-input"><option v-for="c in consultants" :key="c.id" :value="c.id">{{ c.name }} · {{ $t(`consultant.speciality.${c.speciality}`) }}</option></select></KField>
      </div>
      <template #footer>
        <KButton variant="ghost" :icon="false" @click="acting = null">{{ $t('common.back') }}</KButton>
        <KButton :variant="acting?.action === 'cancel' ? 'danger' : 'cowrie'" :icon="acting?.action !== 'cancel'" :disabled="acting?.action === 'complete' ? !summary.trim() : acting?.action === 'cancel' ? !reason.trim() : false" @click="apply">{{ $t('bo.appointments.confirm') }}</KButton>
      </template>
    </KModal>
  </div>
</template>

<style scoped lang="scss">
.appt { display: grid; gap: 1.25rem; }
.head h1 { margin: 0; } .head p { margin: .2rem 0 0; }
.kpis { display: grid; gap: 1rem; grid-template-columns: repeat(2, 1fr); @include lg-up { grid-template-columns: repeat(4, 1fr); } }
.charts { display: grid; gap: 1rem; @include md-up { grid-template-columns: 1fr 1fr; } }
.box { padding: 1.25rem; h3 { font-size: 1rem; margin-bottom: .75rem; } }
.filters { display: grid; gap: .6rem; @include lg-up { grid-template-columns: auto 1fr 220px 200px; align-items: center; } }
.tabs { display: flex; gap: .3rem; button { background: rgba(20,12,7,.4); border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .55rem 1rem; border-radius: 999px; font-weight: 700; font-size: .84rem; &.on { background: var(--kec-cowrie); color: #2a1a12; } } }
.day { display: grid; gap: .8rem; h3 { display: flex; align-items: center; gap: .6rem; margin: 0; font-size: 1.05rem; color: var(--kec-sand); text-transform: capitalize; small { padding: .05rem .5rem; border-radius: 99px; background: rgba(214,165,72,.2); color: var(--kec-gold-soft); font-size: .72rem; } &::after { content: ''; flex: 1; height: 1px; background: var(--kec-border); } } }
.cards { display: grid; gap: .9rem; @include lg-up { grid-template-columns: 1fr 1fr; } }
.dlink { align-self: center; font-size: .8rem; font-weight: 700; margin-inline-start: auto; }
.empty { padding: 2rem; text-align: center; border: 1px dashed var(--kec-border); border-radius: 16px; }
.modal-form { display: grid; gap: 1rem; .who { margin: 0; font-size: .9rem; em { color: var(--kec-gold-soft); } } }
</style>

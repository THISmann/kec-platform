<script setup>
/**
 * Tableau de bord d'un fellow (« Connexion ») :
 * progression de la certification, dossier, coffre-fort, consultant, paiements.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useAsync } from '@/composables/useAsync'
import CertificationTrack from '@/components/features/CertificationTrack.vue'
import CertifiedSeal from '@/components/features/CertifiedSeal.vue'
import KBadge from '@/components/ui/KBadge.vue'
import KButton from '@/components/ui/KButton.vue'
import KLoader from '@/components/ui/KLoader.vue'
import { formatDate, formatXaf } from '@/utils/format'
import { APP_CONFIG } from '@/config/app.config'
import { DOSSIER_TONE } from '@/utils/status'

const { locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const uid = auth.user.id

const { data, loading } = useAsync(async () => {
  const company = await api.company.getMine(uid)
  const [documents, bookings, payments, threads] = await Promise.all([
    company ? api.vault.list(company.id) : [],
    api.consultant.listMine(uid),
    api.payment.listMine(uid),
    api.messaging.listMine(uid)
  ])
  return { company, documents, bookings, payments, threads }
})

const firstName = computed(() => auth.user.name.split(' ')[0])
const rejected = computed(() => data.value?.documents.filter((d) => d.status === 'rejected') ?? [])
const PRICE = APP_CONFIG.program.priceXaf
const startOf = (b) => new Date(`${b.date}T${b.slot}:00`).getTime()
const upcoming = computed(() => data.value?.bookings.filter((b) => ['confirmed', 'awaiting_payment'].includes(b.status) && startOf(b) > Date.now()).sort((a, b) => startOf(a) - startOf(b)) ?? [])
const nextBooking = computed(() => upcoming.value.find((b) => b.status === 'confirmed') ?? upcoming.value[0])
const paid = computed(() => data.value?.payments.filter((p) => p.status === 'succeeded' && p.purpose === 'program').reduce((s, p) => s + p.amount, 0) ?? 0)
const unreadMessages = computed(() => data.value?.threads.reduce((s, t) => s + (t.unreadFellow ?? 0), 0) ?? 0)
</script>

<template>
  <div class="dash">
    <KLoader v-if="loading && !data" :label="$t('common.loading')" />
    <template v-else-if="data">
      <!-- Accueil + certification -->
      <section class="welcome wood-panel">
        <div class="hello">
          <span class="eyebrow">{{ $t('fellow.dash.eyebrow') }}</span>
          <h1>{{ $t('fellow.dash.hello', { name: firstName }) }}</h1>
          <p class="text-muted">{{ $t('fellow.dash.lead') }}</p>
        </div>
        <CertificationTrack v-if="data.company?.programStart" :program-start="data.company.programStart" :certified="data.company.certified" />
      </section>

      <div class="grid-cards">
        <!-- Mon entreprise -->
        <article class="card clay-panel">
          <header>
            <h3>{{ $t('fellow.dash.company') }}</h3>
            <KBadge v-if="data.company" :tone="DOSSIER_TONE[data.company.status]" dot>{{ $t(`status.dossier.${data.company.status}`) }}</KBadge>
          </header>
          <template v-if="data.company">
            <div class="company-id">
              <CertifiedSeal :size="54" :active="data.company.certified" />
              <div>
                <strong class="cname">{{ data.company.name }}</strong>
                <span class="text-muted">{{ $t(`legalForms.${data.company.legalForm}`) }} · {{ data.company.city }}</span>
              </div>
            </div>
            <p v-if="data.company.assignee" class="assignee">{{ $t('fellow.dash.assignee', { name: data.company.assignee }) }}</p>
            <ul class="milestones">
              <li v-for="m in data.company.milestones" :key="m.key" :class="{ done: m.done, current: m.current }">
                <span class="b" />{{ $t(`milestones.${m.key}`) }}
              </li>
            </ul>
          </template>
          <p v-else class="text-muted">{{ $t('fellow.dash.noCompany') }}</p>
          <KButton variant="wood" size="sm" :icon="false" :to="{ name: 'fellow-company' }">{{ $t('fellow.dash.openDossier') }} →</KButton>
        </article>

        <!-- Coffre-fort -->
        <article class="card clay-panel">
          <header><h3>{{ $t('fellow.dash.vault') }}</h3><span class="big">{{ data.documents.length }}</span></header>
          <p class="text-muted">{{ $t('fellow.dash.vaultLead') }}</p>
          <div v-if="rejected.length" class="alert">
            <strong>{{ $t('fellow.dash.actionNeeded') }}</strong>
            <p v-for="d in rejected" :key="d.id">{{ $t(`documents.${d.kind}`) }} — {{ d.rejectionReason }}</p>
          </div>
          <KButton variant="wood" size="sm" :icon="false" :to="{ name: 'fellow-vault' }">{{ $t('fellow.dash.openVault') }} →</KButton>
        </article>

        <!-- Consultant -->
        <article class="card clay-panel">
          <header><h3>{{ $t('fellow.dash.consultant') }}</h3><span v-if="upcoming.length" class="big">{{ upcoming.length }}</span></header>
          <div v-if="nextBooking" class="booking">
            <span class="date">{{ formatDate(nextBooking.date, locale, { weekday: 'short', day: 'numeric', month: 'short' }) }}</span>
            <div>
              <strong>{{ nextBooking.slot }} · {{ nextBooking.consultant }} · {{ nextBooking.durationMin }} min</strong>
              <span class="text-muted">{{ nextBooking.topic }}</span>
              <small v-if="nextBooking.status === 'awaiting_payment'" class="warn">{{ $t('booking.status.awaiting_payment') }}</small>
            </div>
          </div>
          <p v-else class="text-muted">{{ $t('fellow.dash.noBooking') }}</p>
          <p v-if="upcoming.length" class="text-muted small">{{ $t('fellow.dash.upcomingCount', { n: upcoming.length }) }}</p>
          <div class="row-btns">
            <KButton variant="wood" size="sm" :icon="false" :to="{ name: 'fellow-consultant' }">{{ $t('booking.mine') }} →</KButton>
            <KButton variant="cola" size="sm" :to="{ name: 'fellow-consultant', query: { tab: 'book' } }">{{ $t('fellow.dash.book') }}</KButton>
          </div>
        </article>

        <!-- Paiements -->
        <article class="card clay-panel">
          <header><h3>{{ $t('fellow.dash.payments') }}</h3></header>
          <p class="paid"><strong>{{ formatXaf(paid, locale) }}</strong> {{ $t('fellow.dash.paidOf', { total: formatXaf(PRICE, locale) }) }}</p>
          <div class="meter"><span :style="{ width: `${Math.min(100, (paid / PRICE) * 100)}%` }" /></div>
          <p v-if="paid < PRICE" class="text-muted small">{{ $t('fellow.dash.balanceLeft', { amount: formatXaf(PRICE - paid, locale) }) }}</p>
          <KButton :variant="paid < PRICE ? 'cowrie' : 'wood'" size="sm" :icon="paid < PRICE" :to="{ name: 'fellow-payments' }">{{ paid < PRICE ? $t('payments.payBalance') : $t('fellow.dash.history') }} →</KButton>
        </article>
      </div>

      <button class="kopen-strip msgs" type="button" @click="$router.push({ name: 'fellow-inbox' })">
        <span>✉</span> {{ unreadMessages ? $t('fellow.dash.unread', { n: unreadMessages }) : $t('fellow.dash.messages') }} <span class="go">→</span>
      </button>
      <button class="kopen-strip" type="button" @click="$router.push({ name: 'fellow-kopen' })">
        <span>✉</span> {{ $t('fellow.dash.kopen') }} <span class="go">→</span>
      </button>
      <button class="celebrate" type="button" @click="ui.rainCowries(80)">🐚 {{ $t('fellow.dash.celebrate') }}</button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dash { display: grid; gap: 1.5rem; }
.welcome { padding: clamp(1.25rem, 3vw, 2rem); display: grid; gap: 1.5rem; @include lg-up { grid-template-columns: 1fr 1.3fr; align-items: center; } h1 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); } }
.grid-cards { display: grid; gap: 1.25rem; @include md-up { grid-template-columns: 1fr 1fr; } }
.card { padding: 1.4rem; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;
  header { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 1rem; h3 { margin: 0; } }
  p { margin: 0; } }
.big { font-family: var(--font-display); font-size: 2rem; color: var(--kec-gold-soft); }
.company-id { display: flex; gap: 1rem; align-items: center; div { display: flex; flex-direction: column; } }
.cname { font-family: var(--font-display); font-size: 1.3rem; }
.assignee { font-size: .88rem; color: var(--kec-gold-soft); }
.milestones { list-style: none; padding: 0; margin: 0; display: grid; gap: .35rem; font-size: .86rem; color: var(--kec-text-muted);
  li { display: flex; align-items: center; gap: .6rem; }
  .b { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid currentColor; }
  .done { color: #b9c27a; .b { background: currentColor; } }
  .current { color: var(--kec-ivory); font-weight: 700; .b { background: var(--kec-gold); border-color: var(--kec-gold); box-shadow: 0 0 10px var(--kec-gold); } } }
.alert { width: 100%; padding: .8rem 1rem; border-radius: 12px; background: rgba(208, 87, 62, .12); border: 1px solid rgba(208, 87, 62, .45); font-size: .86rem; p { margin-top: .3rem; } }
.booking { display: flex; gap: 1rem; align-items: center; div { display: flex; flex-direction: column; } .warn { color: var(--kec-clay); font-weight: 700; font-size: .78rem; } }
.small { font-size: .82rem; }
.row-btns { display: flex; flex-wrap: wrap; gap: .5rem; }
.msgs { border-style: solid; }
.date { padding: .6rem .8rem; border-radius: 12px; background: var(--kec-cowrie); color: #2a1a12; font-weight: 800; text-transform: capitalize; font-size: .85rem; text-align: center; }
.paid strong { font-family: var(--font-display); font-size: 1.6rem; color: var(--kec-gold-soft); }
.meter { width: 100%; height: 10px; border-radius: 99px; background: rgba(255,255,255,.06); overflow: hidden; span { display: block; height: 100%; background: linear-gradient(90deg, var(--kec-laterite), var(--kec-gold)); } }
.kopen-strip { display: flex; align-items: center; gap: .8rem; padding: 1rem 1.25rem; border-radius: var(--radius); border: 1px dashed var(--kec-gold); background: rgba(214,165,72,.06); color: var(--kec-ivory); font-weight: 600; text-align: start; .go { margin-inline-start: auto; color: var(--kec-gold); } &:hover { background: rgba(214,165,72,.12); } }
.celebrate { justify-self: start; background: none; border: 0; color: var(--kec-text-muted); font-size: .8rem; &:hover { color: var(--kec-gold-soft); } }
</style>

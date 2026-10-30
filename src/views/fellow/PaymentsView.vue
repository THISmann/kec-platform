
<script setup>
/**
 * Paiements du fellow : échéancier du programme (acompte / solde),
 * règlement du solde par tranches (testable en mock), historique complet
 * (programme + consultations) avec reçus.
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { APP_CONFIG } from '@/config/app.config'
import KBadge from '@/components/ui/KBadge.vue'
import KLoader from '@/components/ui/KLoader.vue'
import KChips from '@/components/ui/KChips.vue'
import KField from '@/components/ui/KField.vue'
import PaymentPanel from '@/components/features/PaymentPanel.vue'
import { formatXaf, formatDate } from '@/utils/format'
import { PAYMENT_TONE } from '@/utils/status'

const { locale, t } = useI18n()
const auth = useAuthStore()
const payments = ref(null)
const filter = ref('all')
const tranche = ref('all')
const load = async () => { payments.value = await api.payment.listMine(auth.user.id) }
onMounted(load)

const PRICE = APP_CONFIG.program.priceXaf
const paidProgram = computed(() => (payments.value ?? []).filter((p) => p.purpose === 'program' && p.status === 'succeeded').reduce((s, p) => s + p.amount, 0))
const pendingProgram = computed(() => (payments.value ?? []).filter((p) => p.purpose === 'program' && ['pending', 'awaiting_transfer'].includes(p.status)).reduce((s, p) => s + p.amount, 0))
const balance = computed(() => Math.max(0, PRICE - paidProgram.value))
const pct = computed(() => Math.min(100, Math.round((paidProgram.value / PRICE) * 100)))
/** Échéancier : chaque tranche est « réglée » quand le cumul payé la couvre */
const schedule = computed(() => {
  let before = 0
  return APP_CONFIG.programInstallments.map((i) => {
    const amount = i.share * PRICE
    const covered = Math.max(0, Math.min(amount, paidProgram.value - before))
    before += amount
    return { ...i, amount, covered, paid: covered >= amount - 1, partial: covered > 0 && covered < amount - 1 }
  })
})
const amountOptions = computed(() => {
  const opts = [{ value: 'all', label: `${t('payments.fullBalance')} · ${formatXaf(balance.value, locale.value)}` }]
  if (balance.value > 50000) opts.push({ value: '50000', label: `${t('payments.installment')} · ${formatXaf(50000, locale.value)}` })
  if (balance.value > 100000) opts.push({ value: '100000', label: `${t('payments.installment')} · ${formatXaf(100000, locale.value)}` })
  return opts
})
const amountToPay = computed(() => (tranche.value === 'all' ? balance.value : Math.min(balance.value, Number(tranche.value))))
const filtered = computed(() => (payments.value ?? []).filter((p) => filter.value === 'all' || p.purpose === filter.value))
const METHOD = { momo: 'MTN MoMo', om: 'Orange Money', card: t('payment.card') }
const methodLabel = (m) => (m === 'bank' ? t('payment.bank') : METHOD[m] ?? m)
</script>

<template>
  <div class="payments">
    <header>
      <span class="eyebrow">{{ $t('payments.eyebrow') }}</span>
      <h1>{{ $t('payments.title') }}</h1>
    </header>

    <KLoader v-if="!payments" />
    <div v-else class="cols">
      <section class="main">
        <!-- Échéancier -->
        <div class="wood-panel box plan">
          <header class="plan-head">
            <div>
              <h3>{{ $t('payments.program') }}</h3>
              <p class="text-muted">{{ $t('payments.planLead', { total: formatXaf(PRICE, locale) }) }}</p>
            </div>
            <div class="paid"><strong>{{ formatXaf(paidProgram, locale) }}</strong><span>{{ $t('fellow.dash.paidOf', { total: formatXaf(PRICE, locale) }) }}</span></div>
          </header>
          <div class="meter"><span :style="{ width: `${pct}%` }" /><em v-if="pendingProgram" :style="{ left: `${pct}%`, width: `${Math.min(100 - pct, (pendingProgram / PRICE) * 100)}%` }" /></div>
          <ol class="installments">
            <li v-for="i in schedule" :key="i.key" :class="{ paid: i.paid, partial: i.partial }">
              <span class="b">{{ i.paid ? '✓' : i.partial ? '◐' : '○' }}</span>
              <div><strong>{{ $t(`payments.installments.${i.key}`) }}</strong><small class="text-muted">{{ $t(`payments.installmentsHint.${i.key}`) }}</small></div>
              <span class="amt"><template v-if="i.partial"><small>{{ formatXaf(i.covered, locale) }} / </small></template>{{ formatXaf(i.amount, locale) }}</span>
            </li>
          </ol>
          <p v-if="pendingProgram" class="pending">⏳ {{ $t('payments.pendingTransfer', { amount: formatXaf(pendingProgram, locale) }) }}</p>
        </div>

        <!-- Historique -->
        <div class="wood-panel box">
          <header class="hist-head">
            <h3>{{ $t('payments.history') }}</h3>
            <div class="chips">
              <button v-for="f in ['all', 'program', 'consultant']" :key="f" type="button" :class="{ on: filter === f }" @click="filter = f">{{ f === 'all' ? $t('common.all') : $t(`payments.purpose.${f}`) }}</button>
            </div>
          </header>
          <ul class="list">
            <li v-for="p in filtered" :key="p.id">
              <span class="m" :class="p.method">{{ p.method === 'bank' ? '🏦' : p.method === 'om' ? 'OM' : p.method === 'card' ? '▭' : 'MoMo' }}</span>
              <div>
                <strong>{{ $t(`payments.purpose.${p.purpose}`) }}<small v-if="p.installment" class="inst"> · {{ $t(`payments.installments.${p.installment}`) }}</small></strong>
                <small class="text-muted">{{ formatDate(p.createdAt, locale) }} · {{ methodLabel(p.method) }} · {{ p.reference }}<template v-if="p.receiptNo"> · {{ $t('payments.receipt') }} {{ p.receiptNo }}</template></small>
                <small v-if="p.failureReason" class="fail">{{ p.failureReason }}</small>
                <small v-if="p.refund" class="refund">↩ {{ $t(`booking.refund.${p.refund.type}`, { amount: formatXaf(p.refund.amount, locale) }) }}</small>
              </div>
              <div class="r">
                <strong>{{ formatXaf(p.amount, locale) }}</strong>
                <KBadge :tone="PAYMENT_TONE[p.status]">{{ $t(`status.payment.${p.status}`) }}</KBadge>
              </div>
            </li>
            <li v-if="!filtered.length" class="text-muted">{{ $t('payments.empty') }}</li>
          </ul>
        </div>
      </section>

      <aside class="clay-panel box pay-box">
        <h3>{{ balance ? $t('payments.payBalance') : $t('payments.program') }}</h3>
        <p v-if="!balance" class="ok">✓ {{ $t('payments.fullyPaid') }}</p>
        <template v-else>
          <KField :label="$t('payments.chooseAmount')">
            <KChips v-model="tranche" :options="amountOptions" />
          </KField>
          <PaymentPanel :key="amountToPay" :amount="amountToPay" purpose="program" :installment="amountToPay >= balance ? 'balance' : 'partial'" :label="$t('payments.balance')" @paid="load" />
          <p class="demo text-muted">{{ $t('payments.demoHint') }}</p>
        </template>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.payments { display: grid; gap: 1.25rem; h1 { margin: 0; } }
.cols { display: grid; gap: 1.25rem; grid-template-columns: minmax(0, 1fr); > * { min-width: 0; } @include lg-up { grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); align-items: start; } }
.main { display: grid; gap: 1.25rem; }
.box { padding: 1.5rem; }
.plan-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: flex-start; h3 { margin-bottom: .2rem; } p { margin: 0; font-size: .88rem; } }
.paid { text-align: end; strong { display: block; font-family: var(--font-display); font-size: 1.6rem; color: var(--kec-gold-soft); line-height: 1.1; } span { font-size: .78rem; color: var(--kec-text-muted); } }
.meter { position: relative; width: 100%; height: 12px; border-radius: 99px; background: rgba(255,255,255,.06); overflow: hidden; margin: 1rem 0;
  span { display: block; height: 100%; background: linear-gradient(90deg, var(--kec-laterite), var(--kec-gold)); transition: width 1s var(--ease-out); }
  em { position: absolute; top: 0; height: 100%; background: repeating-linear-gradient(45deg, rgba(214,165,72,.5) 0 6px, transparent 6px 12px); } }
.installments { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem;
  li { display: grid; grid-template-columns: 28px 1fr auto; gap: .8rem; align-items: center; padding: .7rem .9rem; border-radius: 12px; border: 1px dashed var(--kec-border); }
  li.paid { border-style: solid; border-color: rgba(143,163,90,.5); background: rgba(143,163,90,.06); .b { color: #b9c27a; } }
  .b { font-weight: 900; color: var(--kec-text-muted); } div { display: flex; flex-direction: column; } small { font-size: .76rem; } .amt { font-weight: 800; font-variant-numeric: tabular-nums; } }
.pending { margin: .9rem 0 0; font-size: .84rem; color: var(--kec-gold-soft); }
.hist-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: .75rem; margin-bottom: .75rem; h3 { margin: 0; } }
.chips { display: flex; gap: .35rem; button { background: none; border: 1px solid var(--kec-border); color: var(--kec-text-muted); border-radius: 999px; padding: .3rem .8rem; font-size: .78rem; font-weight: 700; &.on { background: var(--kec-cowrie); color: #2a1a12; border-color: transparent; } } }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: .25rem;
  li { display: grid; grid-template-columns: 46px 1fr auto; gap: .9rem; align-items: center; padding: .8rem 0; border-bottom: 1px dashed var(--kec-border); }
  .m { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: rgba(214,165,72,.12); color: var(--kec-gold); font-weight: 900; font-size: .72rem; &.momo { background: rgba(255,203,5,.14); color: #ffcb05; } &.om { background: rgba(255,121,0,.14); color: #ff7900; } }
  div { display: flex; flex-direction: column; min-width: 0; } small { font-size: .76rem; } .inst { font-weight: 400; color: var(--kec-gold-soft); } .refund { color: var(--kec-gold-soft); } .fail { color: #f08a6e; }
  .r { align-items: flex-end; gap: .3rem; } }
.ok { color: #b9c27a; font-weight: 700; }
.pay-box { display: grid; gap: 1rem; }
.demo { margin: 0; font-size: .74rem; }
</style>

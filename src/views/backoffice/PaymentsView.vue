
<script setup>
/**
 * Back-office — Paiements : tous les encaissements (programme + consultations),
 * virements à rapprocher, paiements échoués (gestion des exceptions §6), export CSV.
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import KBadge from '@/components/ui/KBadge.vue'
import KStat from '@/components/ui/KStat.vue'
import KLoader from '@/components/ui/KLoader.vue'
import KBarList from '@/components/ui/KBarList.vue'
import { formatXaf, formatCompactXaf, formatDate, formatTime } from '@/utils/format'
import { PAYMENT_TONE } from '@/utils/status'

const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const payments = ref(null)
const status = ref('all')
const purpose = ref('all')
const q = ref('')
onMounted(async () => { payments.value = await api.backoffice.listPayments() })

const DAY = 86400000
const ok = computed(() => (payments.value ?? []).filter((p) => p.status === 'succeeded'))
const stats = computed(() => ({
  total: ok.value.reduce((s, p) => s + p.amount, 0),
  month: ok.value.filter((p) => Date.now() - new Date(p.createdAt) < 30 * DAY).reduce((s, p) => s + p.amount, 0),
  awaiting: (payments.value ?? []).filter((p) => p.status === 'awaiting_transfer'),
  failed: (payments.value ?? []).filter((p) => p.status === 'failed').length,
  consult: ok.value.filter((p) => p.purpose === 'consultant').reduce((s, p) => s + p.amount, 0)
}))
const byMethod = computed(() => ['momo', 'om', 'bank'].map((m) => ({ label: m === 'bank' ? t('payment.bank') : m === 'om' ? 'Orange Money' : 'MTN MoMo', count: ok.value.filter((p) => p.method === m).length })))
const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return (payments.value ?? []).filter((p) => (status.value === 'all' || p.status === status.value) && (purpose.value === 'all' || p.purpose === purpose.value) && (!needle || `${p.payerName} ${p.reference} ${p.receiptNo ?? ''}`.toLowerCase().includes(needle)))
})
const METHOD = { momo: 'MTN MoMo', om: 'Orange Money' }

async function confirm(p) {
  Object.assign(p, await api.backoffice.confirmTransfer(p.id, auth.actor))
  ui.rainCowries(25)
  ui.toast(t('bo.payments.confirmed', { ref: p.reference }), { type: 'success' })
}
async function fail(p) {
  const reason = prompt(t('bo.payments.failPrompt')) ?? ''
  if (!reason) return
  Object.assign(p, await api.backoffice.failPayment(p.id, reason, auth.actor))
}
function exportCsv() {
  const cols = ['createdAt', 'payerName', 'purpose', 'installment', 'amount', 'method', 'status', 'reference', 'receiptNo']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [cols.join(';'), ...filtered.value.map((r) => cols.map((c) => esc(r[c])).join(';'))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  a.download = `kec-paiements-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>

<template>
  <div class="pay">
    <header class="head">
      <div><span class="eyebrow">{{ $t('bo.eyebrow') }}</span><h1>{{ $t('bo.payments.title') }}</h1></div>
      <button type="button" class="export" @click="exportCsv">⇩ CSV</button>
    </header>
    <KLoader v-if="!payments" />
    <template v-else>
      <div class="kpis">
        <KStat :label="$t('bo.kpi.revenue')" :value="stats.total" :format="(v) => formatCompactXaf(v, locale)" accent="clay" :hint="$t('bo.payments.month', { amount: formatCompactXaf(stats.month, locale) })" />
        <KStat :label="$t('bo.payments.consultations')" :value="stats.consult" :format="(v) => formatCompactXaf(v, locale)" accent="olive" />
        <KStat :label="$t('bo.payments.awaiting')" :value="stats.awaiting.length" :hint="formatXaf(stats.awaiting.reduce((s, p) => s + p.amount, 0), locale)" />
        <KStat :label="$t('bo.payments.failed')" :value="stats.failed" accent="clay" />
      </div>

      <div class="cols">
        <section v-if="stats.awaiting.length" class="wood-panel box todo">
          <h3>⏳ {{ $t('bo.payments.toReconcile') }}</h3>
          <p class="text-muted small">{{ $t('bo.payments.reconcileLead') }}</p>
          <ul class="list">
            <li v-for="p in stats.awaiting" :key="p.id">
              <div><strong>{{ p.payerName }}</strong><small class="text-muted">{{ formatDate(p.createdAt, locale) }} · {{ $t(`payments.purpose.${p.purpose}`) }} · <b>{{ p.reference }}</b></small></div>
              <strong class="amt">{{ formatXaf(p.amount, locale) }}</strong>
              <span v-if="auth.can('confirmPayments')" class="acts"><button type="button" class="ok" @click="confirm(p)">✓ {{ $t('bo.payments.confirm') }}</button><button type="button" class="ko" @click="fail(p)">✕</button></span>
            </li>
          </ul>
        </section>
        <section class="wood-panel box"><h3>{{ $t('bo.payments.byMethod') }}</h3><KBarList :items="byMethod" /></section>
      </div>

      <div class="filters">
        <input v-model="q" class="k-input" :placeholder="$t('bo.payments.search')" />
        <select v-model="purpose" class="k-input"><option value="all">{{ $t('common.all') }}</option><option value="program">{{ $t('payments.purpose.program') }}</option><option value="consultant">{{ $t('payments.purpose.consultant') }}</option></select>
        <select v-model="status" class="k-input"><option value="all">{{ $t('common.all') }}</option><option v-for="s in ['succeeded', 'pending', 'awaiting_transfer', 'failed']" :key="s" :value="s">{{ $t(`status.payment.${s}`) }}</option></select>
      </div>

      <div class="wood-panel table-wrap">
        <table>
          <thead><tr><th>{{ $t('bo.payments.cols.date') }}</th><th>{{ $t('bo.payments.cols.payer') }}</th><th>{{ $t('bo.payments.cols.purpose') }}</th><th>{{ $t('bo.payments.cols.method') }}</th><th class="r">{{ $t('bo.payments.cols.amount') }}</th><th>{{ $t('bo.payments.cols.status') }}</th><th>{{ $t('bo.payments.cols.ref') }}</th></tr></thead>
          <tbody>
            <tr v-for="p in filtered.slice(0, 120)" :key="p.id">
              <td><span class="d">{{ formatDate(p.createdAt, locale) }}</span><small>{{ formatTime(p.createdAt, locale) }}</small></td>
              <td><strong>{{ p.payerName }}</strong><small v-if="p.simulated" class="sim">{{ $t('bo.payments.simulated') }}</small></td>
              <td>{{ $t(`payments.purpose.${p.purpose}`) }}<small v-if="p.installment"> · {{ $t(`payments.installments.${p.installment}`) }}</small></td>
              <td>{{ p.method === 'bank' ? $t('payment.bank') : METHOD[p.method] ?? p.method }}</td>
              <td class="r amt">{{ formatXaf(p.amount, locale) }}</td>
              <td><KBadge :tone="PAYMENT_TONE[p.status]">{{ $t(`status.payment.${p.status}`) }}</KBadge><small v-if="p.failureReason" class="fail">{{ p.failureReason }}</small></td>
              <td class="ref">{{ p.reference }}<small v-if="p.receiptNo">{{ p.receiptNo }}</small></td>
            </tr>
            <tr v-if="!filtered.length"><td colspan="7" class="text-muted">{{ $t('payments.empty') }}</td></tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pay { display: grid; gap: 1.25rem; }
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; h1 { margin: 0; } }
.export { background: none; border: 1px solid var(--kec-gold); color: var(--kec-gold-soft); border-radius: 999px; padding: .5rem 1rem; font-weight: 700; }
.kpis { display: grid; gap: 1rem; grid-template-columns: repeat(2, 1fr); @include lg-up { grid-template-columns: repeat(4, 1fr); } }
.cols { display: grid; gap: 1rem; @include lg-up { grid-template-columns: 1.4fr 1fr; align-items: start; } }
.box { padding: 1.25rem; h3 { font-size: 1.05rem; margin-bottom: .5rem; } }
.todo { border-color: rgba(214,165,72,.5); }
.small { font-size: .82rem; }
.list { list-style: none; padding: 0; margin: 0; li { display: grid; grid-template-columns: 1fr auto auto; gap: .9rem; align-items: center; padding: .7rem 0; border-bottom: 1px dashed var(--kec-border); } div { display: flex; flex-direction: column; } small { font-size: .76rem; } b { color: var(--kec-gold-soft); } .amt { font-variant-numeric: tabular-nums; } }
.acts { display: flex; gap: .3rem; button { border: 1px solid var(--kec-border); background: none; border-radius: 999px; padding: .35rem .8rem; font-weight: 700; font-size: .8rem; &.ok { color: #b9c27a; border-color: rgba(143,163,90,.6); } &.ko { color: #f08a6e; } } }
.filters { display: grid; gap: .6rem; @include md-up { grid-template-columns: 1fr 200px 200px; } }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .86rem; th { text-align: start; padding: .8rem 1rem; font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--kec-text-muted); border-bottom: 1px solid var(--kec-border); } td { padding: .7rem 1rem; border-bottom: 1px dashed var(--kec-border); vertical-align: top; .d { white-space: nowrap; } small { display: block; font-size: .72rem; color: var(--kec-text-muted); } } .r { text-align: end; } .amt { font-variant-numeric: tabular-nums; font-weight: 700; } .ref { font-family: monospace; font-size: .8rem; } .sim { color: var(--kec-gold-soft); } .fail { color: #f08a6e; } }
</style>

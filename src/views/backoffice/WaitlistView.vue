<script setup>
/**
 * Back-office — Liste d'attente & sélection des 110 (phase filtre).
 * Filtrer, trier par score de pré-qualification, présélectionner,
 * sélectionner (plafond 110 garanti côté service), exporter en CSV.
 */
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useUiStore } from '@/stores/ui'
import { APP_CONFIG } from '@/config/app.config'
import KBadge from '@/components/ui/KBadge.vue'
import KModal from '@/components/ui/KModal.vue'
import KLoader from '@/components/ui/KLoader.vue'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import { formatDate } from '@/utils/format'
import { WAITLIST_TONE } from '@/utils/status'

const { t, locale } = useI18n()
const ui = useUiStore()
const rows = ref(null)
const all = ref([])
const q = reactive({ status: 'all', q: '', sort: 'score' })
const selectedRow = ref(null)
const page = ref(1)
const PER_PAGE = 25

const load = async () => {
  rows.value = await api.backoffice.listWaitlist({ ...q })
  all.value = await api.backoffice.listWaitlist({})
}
onMounted(load)
let debounce
watch(q, () => { clearTimeout(debounce); page.value = 1; debounce = setTimeout(load, 250) })

const seats = APP_CONFIG.program.cohortSize
const selectedCount = computed(() => all.value.filter((r) => r.status === 'selected').length)
const counts = computed(() => ['pending', 'shortlisted', 'selected', 'rejected'].reduce((o, s) => ({ ...o, [s]: all.value.filter((r) => r.status === s).length }), {}))
const paged = computed(() => rows.value?.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE) ?? [])
const pages = computed(() => Math.ceil((rows.value?.length ?? 0) / PER_PAGE))

async function setStatus(row, status) {
  try {
    const updated = await api.backoffice.setWaitlistStatus(row.id, status)
    Object.assign(row, updated)
    if (selectedRow.value?.id === row.id) selectedRow.value = { ...row }
    const ref = all.value.find((r) => r.id === row.id)
    if (ref) ref.status = status
    all.value = [...all.value]
    if (status === 'selected') ui.rainCowries(20)
    ui.toast(t('bo.wl.updated', { name: row.firstName, status: t(`status.waitlist.${status}`) }), { type: 'success' })
  } catch (e) {
    ui.toast(t(e.message || 'errors.generic'), { type: 'error' })
  }
}

/** Export CSV (UTF-8 avec BOM pour Excel) */
function exportCsv() {
  const cols = ['ticket', 'firstName', 'lastName', 'email', 'phone', 'residenceCountry', 'targetCity', 'sector', 'projectStage', 'acquisitionChannel', 'score', 'status', 'createdAt']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [cols.join(';'), ...(rows.value ?? []).map((r) => cols.map((c) => esc(r[c])).join(';'))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  a.download = `kec-liste-attente-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>

<template>
  <div class="wl">
    <header class="head">
      <div>
        <span class="eyebrow">{{ $t('bo.eyebrow') }}</span>
        <h1>{{ $t('bo.wl.title') }}</h1>
        <p class="text-muted">{{ $t('bo.wl.lead') }}</p>
      </div>
      <button type="button" class="export" @click="exportCsv">⇩ CSV</button>
    </header>

    <!-- Jauge des 110 places -->
    <section class="meter wood-panel">
      <div class="meter-txt">
        <strong>{{ selectedCount }} / {{ seats }}</strong>
        <span>{{ $t('bo.wl.seatsTaken') }}</span>
      </div>
      <div class="shells" aria-hidden="true">
        <CowrieShape v-for="n in seats" :key="n" :size="9" :tone="n <= selectedCount ? 'gold' : 'ink'" />
      </div>
    </section>

    <div class="filters">
      <div class="tabs" role="tablist">
        <button v-for="s in ['all', 'pending', 'shortlisted', 'selected', 'rejected']" :key="s" type="button" :class="{ on: q.status === s }" @click="q.status = s">
          {{ s === 'all' ? $t('common.all') : $t(`status.waitlist.${s}`) }}
          <small>{{ s === 'all' ? all.length : counts[s] }}</small>
        </button>
      </div>
      <input v-model="q.q" class="k-input search" :placeholder="$t('bo.wl.search')" :aria-label="$t('bo.wl.search')" />
      <select v-model="q.sort" class="k-input sort" :aria-label="$t('bo.wl.sort')">
        <option value="score">{{ $t('bo.wl.sortScore') }}</option>
        <option value="recent">{{ $t('bo.wl.sortRecent') }}</option>
        <option value="oldest">{{ $t('bo.wl.sortOldest') }}</option>
      </select>
    </div>

    <KLoader v-if="!rows" />
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th><th>{{ $t('bo.wl.cols.name') }}</th><th class="hide-sm">{{ $t('bo.wl.cols.project') }}</th>
            <th class="hide-sm">{{ $t('bo.wl.cols.channel') }}</th><th>{{ $t('bo.wl.cols.score') }}</th><th>{{ $t('bo.wl.cols.status') }}</th><th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in paged" :key="r.id" @click="selectedRow = r">
            <td class="mono">{{ r.ticket }}</td>
            <td>
              <strong>{{ r.firstName }} {{ r.lastName }}</strong>
              <small>{{ r.targetCity }} · {{ r.isDiaspora ? `🌍 ${r.residenceCountry}` : r.residenceCountry }}</small>
            </td>
            <td class="hide-sm"><span>{{ $t(`sectors.${r.sector}`) }}</span><small>{{ $t(`stages.${r.projectStage}`) }}</small></td>
            <td class="hide-sm">{{ $t(`acquisition.${r.acquisitionChannel}`) }}</td>
            <td><span class="score" :style="{ '--s': r.score }">{{ r.score }}</span></td>
            <td><KBadge :tone="WAITLIST_TONE[r.status]">{{ $t(`status.waitlist.${r.status}`) }}</KBadge></td>
            <td class="acts" @click.stop>
              <button v-if="r.status !== 'shortlisted' && r.status !== 'selected'" type="button" :title="$t('bo.wl.shortlist')" @click="setStatus(r, 'shortlisted')">☆</button>
              <button v-if="r.status !== 'selected'" type="button" class="sel" :title="$t('bo.wl.select')" @click="setStatus(r, 'selected')">✓</button>
              <button v-if="r.status !== 'rejected'" type="button" class="rej" :title="$t('bo.wl.reject')" @click="setStatus(r, 'rejected')">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="text-muted empty">{{ $t('bo.wl.empty') }}</p>
      <nav v-if="pages > 1" class="pager">
        <button type="button" :disabled="page === 1" @click="page--">←</button>
        <span>{{ page }} / {{ pages }}</span>
        <button type="button" :disabled="page === pages" @click="page++">→</button>
      </nav>
    </div>

    <KModal :open="!!selectedRow" :title="selectedRow ? `#${selectedRow.ticket} — ${selectedRow.firstName} ${selectedRow.lastName}` : ''" wide @close="selectedRow = null">
      <div v-if="selectedRow" class="detail">
        <dl>
          <div><dt>Email</dt><dd>{{ selectedRow.email }}</dd></div>
          <div><dt>{{ $t('waitlist.phone') }}</dt><dd>{{ selectedRow.phone || '—' }}</dd></div>
          <div><dt>{{ $t('waitlist.residence') }}</dt><dd>{{ selectedRow.residenceCountry }}</dd></div>
          <div><dt>{{ $t('waitlist.targetCity') }}</dt><dd>{{ selectedRow.targetCity }}</dd></div>
          <div><dt>{{ $t('waitlist.sector') }}</dt><dd>{{ $t(`sectors.${selectedRow.sector}`) }}</dd></div>
          <div><dt>{{ $t('waitlist.stage') }}</dt><dd>{{ $t(`stages.${selectedRow.projectStage}`) }}</dd></div>
          <div><dt>{{ $t('waitlist.channel') }}</dt><dd>{{ $t(`acquisition.${selectedRow.acquisitionChannel}`) }} {{ selectedRow.acquisitionDetail ? `(${selectedRow.acquisitionDetail})` : '' }}</dd></div>
          <div><dt>{{ $t('waitlist.needs') }}</dt><dd>{{ selectedRow.needs?.map((n) => $t(`needs.${n}`)).join(', ') || '—' }}</dd></div>
          <div><dt>{{ $t('bo.wl.registered') }}</dt><dd>{{ formatDate(selectedRow.createdAt, locale) }}</dd></div>
        </dl>
        <blockquote v-if="selectedRow.projectSummary">{{ selectedRow.projectSummary }}</blockquote>
      </div>
      <template #footer>
        <button type="button" class="fbtn" @click="setStatus(selectedRow, 'shortlisted')">☆ {{ $t('bo.wl.shortlist') }}</button>
        <button type="button" class="fbtn rej" @click="setStatus(selectedRow, 'rejected')">✕ {{ $t('bo.wl.reject') }}</button>
        <button type="button" class="fbtn sel" @click="setStatus(selectedRow, 'selected')">✓ {{ $t('bo.wl.select') }}</button>
      </template>
    </KModal>
  </div>
</template>

<style scoped lang="scss">
.wl { display: grid; gap: 1.25rem; }
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; h1 { margin: 0; } p { margin: .3rem 0 0; } }
.export { background: none; border: 1px solid var(--kec-gold); color: var(--kec-gold-soft); border-radius: 999px; padding: .55rem 1.1rem; font-weight: 800; }
.meter { padding: 1.1rem 1.25rem; display: grid; gap: 1rem; @include md-up { grid-template-columns: 180px 1fr; align-items: center; } }
.meter-txt strong { display: block; font-family: var(--font-display); font-size: 2rem; color: var(--kec-gold-soft); line-height: 1.1; }
.meter-txt span { font-size: .8rem; color: var(--kec-text-muted); }
.shells { display: grid; grid-template-columns: repeat(22, 1fr); gap: 6px 4px; justify-items: center; }
.filters { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; .search { flex: 1 1 220px; } .sort { width: auto; flex: 0 0 auto; } }
.tabs { display: flex; flex-wrap: wrap; gap: .3rem; button { background: rgba(20,12,7,.4); border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .45rem .8rem; border-radius: 999px; font-weight: 700; font-size: .8rem; small { opacity: .7; margin-inline-start: .25rem; } &.on { background: var(--kec-cowrie); color: #2a1a12; border-color: transparent; } } }
.table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--kec-border); background: rgba(36, 23, 15, .6); }
table { width: 100%; border-collapse: collapse; font-size: .86rem; }
th { text-align: start; padding: .8rem; font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--kec-gold); border-bottom: 1px solid var(--kec-border); white-space: nowrap; }
td { padding: .7rem .8rem; border-bottom: 1px solid rgba(233, 201, 131, .06); vertical-align: middle; small { display: block; color: var(--kec-text-muted); font-size: .74rem; } }
tbody tr { cursor: pointer; transition: background .2s; &:hover { background: rgba(214,165,72,.06); } }
.mono { font-variant-numeric: tabular-nums; color: var(--kec-text-muted); }
.hide-sm { display: none; @include md-up { display: table-cell; } }
.score { display: inline-grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; font-weight: 800; font-size: .8rem;
  background: conic-gradient(var(--kec-gold) calc(var(--s) * 1%), rgba(255,255,255,.08) 0); position: relative; z-index: 0;
  &::before { content: ''; position: absolute; inset: 4px; border-radius: 50%; background: #2a1a12; z-index: -1; } }
.acts { white-space: nowrap; button { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--kec-border); background: none; color: var(--kec-gold-soft); margin-inline-start: .2rem; &:hover { background: rgba(214,165,72,.15); } &.sel { color: #b9c27a; } &.rej { color: #f08a6e; } } }
.empty { padding: 1rem; }
.pager { display: flex; justify-content: center; align-items: center; gap: 1rem; padding: .75rem; button { background: none; border: 1px solid var(--kec-border); color: var(--kec-ivory); border-radius: 50%; width: 34px; height: 34px; &:disabled { opacity: .3; } } }
.detail dl { margin: 0; display: grid; @include sm-up { grid-template-columns: 1fr 1fr; column-gap: 1.5rem; } div { display: flex; justify-content: space-between; gap: 1rem; padding: .5rem 0; border-bottom: 1px dashed var(--kec-border); font-size: .88rem; } dt { color: var(--kec-text-muted); } dd { margin: 0; text-align: end; } }
.detail blockquote { margin: 1rem 0 0; padding: .9rem 1rem; border-inline-start: 3px solid var(--kec-gold); background: rgba(214,165,72,.06); border-radius: 0 12px 12px 0; font-style: italic; }
.fbtn { background: none; border: 1px solid var(--kec-border); color: var(--kec-ivory); border-radius: 999px; padding: .55rem 1rem; font-weight: 700; &.sel { background: #8fa35a; color: #1a110b; border-color: transparent; } &.rej { color: #f08a6e; } }
</style>

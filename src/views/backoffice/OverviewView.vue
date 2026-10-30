<script setup>
/**
 * Back-office — vue d'ensemble : indicateurs de cohorte (§6), tâches
 * du jour (pièces à vérifier, tickets Manu, suggestions Kopen Mind).
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useLiveEvents } from '@/composables/useLiveEvents'
import { useUiStore } from '@/stores/ui'
import KStat from '@/components/ui/KStat.vue'
import KSparkline from '@/components/ui/KSparkline.vue'
import KBarList from '@/components/ui/KBarList.vue'
import KLoader from '@/components/ui/KLoader.vue'
import { formatCompactXaf } from '@/utils/format'

const { t, locale } = useI18n()
const ui = useUiStore()
const data = ref(null)
const load = async () => { data.value = await api.backoffice.overview() }
onMounted(load)

useLiveEvents((e) => {
  if (e.type === 'waitlist.signup') ui.toast(t('bo.liveSignup', { name: e.payload.firstName, city: e.payload.targetCity }), { type: 'live', icon: '🟢' })
  load()
})

const k = computed(() => data.value?.kpis)
const channels = computed(() => k.value?.channels.map((c) => ({ label: t(`acquisition.${c.key}`), count: c.count })) ?? [])
const cities = computed(() => k.value?.cities.map((c) => ({ label: c.key, count: c.count })) ?? [])
</script>

<template>
  <div class="bo">
    <header class="head">
      <div>
        <span class="eyebrow">{{ $t('bo.eyebrow') }}</span>
        <h1>{{ $t('bo.overview') }}</h1>
      </div>
    </header>
    <KLoader v-if="!data" />
    <template v-else>
      <div class="kpis">
        <KStat :label="$t('bo.kpi.waitlist')" :value="k.waitlistTotal" :hint="$t('bo.kpi.goal', { n: k.waitlistGoal })" />
        <KStat :label="$t('bo.kpi.selected')" :value="k.selected" :suffix="`/ ${k.seats}`" accent="olive" :hint="$t('bo.kpi.shortlisted', { n: k.shortlisted })" />
        <KStat :label="$t('bo.kpi.revenue')" :value="k.revenueXaf" :format="(v) => formatCompactXaf(v, locale)" accent="clay" :hint="$t('bo.kpi.payments', { n: k.paymentsCount })" />
        <KStat :label="$t('bo.kpi.diaspora')" :value="k.diasporaShare" suffix="%" />
      </div>

      <div class="tasks">
        <RouterLink :to="{ name: 'bo-dossiers' }" class="task"><strong>{{ data.documentsToReview }}</strong>{{ $t('bo.tasks.docs') }}</RouterLink>
        <RouterLink :to="{ name: 'bo-inbox' }" class="task" :class="{ alert: data.slaBreaches }"><strong>{{ data.openThreads }}</strong><span>{{ $t('bo.tasks.threads') }}<small v-if="data.slaBreaches">⚠ {{ $t('bo.inbox.breached', { n: data.slaBreaches }) }}</small></span></RouterLink>
        <RouterLink :to="{ name: 'bo-appointments' }" class="task"><strong>{{ data.upcomingBookingsWeek }}</strong>{{ $t('bo.tasks.bookings') }}</RouterLink>
        <RouterLink :to="{ name: 'bo-payments' }" class="task" :class="{ alert: data.transfersToConfirm }"><strong>{{ data.transfersToConfirm }}</strong>{{ $t('bo.tasks.transfers') }}</RouterLink>
        <RouterLink :to="{ name: 'bo-inbox', query: { tab: 'kopen' } }" class="task"><strong>{{ data.newSuggestions }}</strong>{{ $t('bo.tasks.suggestions') }}</RouterLink>
        <RouterLink :to="{ name: 'bo-waitlist' }" class="task"><strong>{{ k.seats - k.selected }}</strong>{{ $t('bo.tasks.seats') }}</RouterLink>
      </div>

      <section class="wood-panel box pipeline">
        <header class="pl-head"><h3>{{ $t('bo.pipeline.title') }}</h3><span class="text-muted">{{ data.avgLeadDays != null ? $t('bo.pipeline.leadTime', { n: data.avgLeadDays }) : $t('bo.pipeline.noLead') }} · {{ $t('bo.pipeline.certified', { n: data.certified }) }}</span></header>
        <ol class="pl">
          <li v-for="s in ['draft', 'submitted', 'in_review', 'docs_requested', 'filed', 'created']" :key="s">
            <RouterLink :to="{ name: 'bo-dossiers' }"><strong>{{ data.dossiersByStatus[s] ?? 0 }}</strong><span>{{ $t(`status.dossier.${s}`) }}</span></RouterLink>
          </li>
        </ol>
      </section>

      <div class="charts">
        <section class="wood-panel box">
          <h3>{{ $t('bo.signups30') }}</h3>
          <KSparkline :values="k.byDay.map((d) => d.count)" :height="120" />
          <p class="text-muted small">{{ $t('bo.thisWeek', { n: k.waitlistWeek }) }} · {{ $t('bo.today', { n: k.waitlistToday }) }}</p>
        </section>
        <section class="wood-panel box">
          <h3>{{ $t('bo.channels') }}</h3>
          <KBarList :items="channels" />
        </section>
        <section class="wood-panel box">
          <h3>{{ $t('bo.cities') }}</h3>
          <KBarList :items="cities" />
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.bo { display: grid; gap: 1.5rem; }
.head h1 { margin: 0; }
.kpis { display: grid; gap: 1rem; grid-template-columns: repeat(2, 1fr); @include lg-up { grid-template-columns: repeat(4, 1fr); } }
.tasks { display: grid; gap: .75rem; grid-template-columns: repeat(2, 1fr); @include md-up { grid-template-columns: repeat(3, 1fr); } @include lg-up { grid-template-columns: repeat(6, 1fr); } }
.task { display: flex; align-items: center; gap: .8rem; padding: .9rem 1rem; border-radius: 16px; border: 1px dashed rgba(214,165,72,.45); color: var(--kec-ivory); font-size: .82rem; transition: all .25s; line-height: 1.25;
  strong { font-family: var(--font-display); font-size: 1.6rem; color: var(--kec-gold-soft); }
  span { display: flex; flex-direction: column; } small { color: #f08a6e; font-size: .7rem; font-weight: 700; }
  &.alert { border-color: rgba(208,87,62,.6); }
  &:hover { background: rgba(214,165,72,.08); color: var(--kec-ivory); } }
.pipeline { display: grid; gap: .9rem; }
.pl-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: .5rem; h3 { margin: 0; } span { font-size: .82rem; } }
.pl { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; grid-template-columns: repeat(3, 1fr); @include md-up { grid-template-columns: repeat(6, 1fr); }
  a { display: flex; flex-direction: column; align-items: center; gap: .1rem; padding: .8rem .4rem; border-radius: 14px; background: rgba(20,12,7,.4); color: var(--kec-ivory); text-align: center; strong { font-family: var(--font-display); font-size: 1.5rem; color: var(--kec-gold-soft); } span { font-size: .72rem; color: var(--kec-text-muted); } &:hover { background: rgba(214,165,72,.1); } } }
.charts { display: grid; gap: 1rem; @include lg-up { grid-template-columns: 1.3fr 1fr 1fr; } }
.box { padding: 1.25rem; h3 { font-size: 1.05rem; } }
.small { font-size: .82rem; margin: .75rem 0 0; }
</style>

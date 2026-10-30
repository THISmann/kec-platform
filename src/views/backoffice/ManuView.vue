
<script setup>
/**
 * Back-office — Manu AI : rapport d'activité, paramètres administrables
 * sans redéploiement (§7), base de connaissances éditable, journal des conversations.
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { ENABLED_LOCALES } from '@/config/app.config'
import KStat from '@/components/ui/KStat.vue'
import KSparkline from '@/components/ui/KSparkline.vue'
import KBarList from '@/components/ui/KBarList.vue'
import KBadge from '@/components/ui/KBadge.vue'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import KChips from '@/components/ui/KChips.vue'
import KLoader from '@/components/ui/KLoader.vue'
import ManuAvatar from '@/components/assistant/ManuAvatar.vue'
import { formatDate, formatTime, timeAgo } from '@/utils/format'

const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const tab = ref('report')
const days = ref(30)
const report = ref(null)
const settings = ref(null)
const draft = ref(null)
const note = ref('')
const knowledge = ref(null)
const editing = ref(null) // intention en cours d'édition
const kbLocale = ref('fr')
const kbDraft = ref({ extraKeywords: '', text: '' })
const logs = ref(null)
const logFilter = ref('all')
const logQ = ref('')
const saving = ref(false)

const loadReport = async () => { report.value = await api.assistant.report(days.value) }
onMounted(async () => {
  ;[settings.value, knowledge.value] = await Promise.all([api.assistant.getSettings(), api.assistant.getKnowledge()])
  draft.value = JSON.parse(JSON.stringify(settings.value))
  await loadReport()
})
watch(days, loadReport)
const loadLogs = async () => { logs.value = await api.assistant.logs({ limit: 80, intent: logFilter.value, q: logQ.value }) }
watch(tab, (v) => { if (v === 'logs' && !logs.value) loadLogs() })
let deb
watch([logFilter, logQ], () => { clearTimeout(deb); deb = setTimeout(loadLogs, 200) })

const dirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(settings.value))
const intents = computed(() => report.value?.intents.map((i) => ({ label: t(`bo.manu.intents.${i.key}`, i.key), count: i.count })) ?? [])
const reasons = computed(() => report.value?.reasons.map((r) => ({ label: t(`bo.inbox.reasons.${r.key}`, r.key), count: r.count })) ?? [])
const locales = computed(() => report.value?.locales.map((l) => ({ label: l.key.toUpperCase(), count: l.count })) ?? [])
const REASONS = ['tax', 'social', 'criminal', 'litigation', 'urgent', 'personalAdvice']

async function save() {
  saving.value = true
  try {
    settings.value = await api.assistant.saveSettings(draft.value, auth.user.name, note.value)
    draft.value = JSON.parse(JSON.stringify(settings.value))
    note.value = ''
    ui.toast(t('bo.manu.saved', { v: settings.value.version }), { type: 'success' })
  } finally { saving.value = false }
}
function edit(intent) {
  editing.value = intent
  const o = knowledge.value.overrides.intents[intent.id] ?? {}
  kbDraft.value = { extraKeywords: (o.extraKeywords ?? []).join(', '), text: o.responses?.[kbLocale.value] ?? intent.responses[kbLocale.value] ?? '', disabled: !!o.disabled }
}
watch(kbLocale, () => { if (editing.value) edit(editing.value) })
async function saveIntent() {
  const o = knowledge.value.overrides.intents[editing.value.id] ?? {}
  const responses = { ...(o.responses ?? {}) }
  if (kbDraft.value.text.trim() && kbDraft.value.text.trim() !== editing.value.responses[kbLocale.value]) responses[kbLocale.value] = kbDraft.value.text.trim()
  else delete responses[kbLocale.value]
  knowledge.value.overrides = await api.assistant.saveKnowledge(editing.value.id, {
    extraKeywords: kbDraft.value.extraKeywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean), responses, disabled: kbDraft.value.disabled
  }, auth.user.name)
  ui.toast(t('bo.manu.kbSaved'), { type: 'success' })
  editing.value = null
}
const isOverridden = (id) => { const o = knowledge.value?.overrides.intents[id]; return o && (o.extraKeywords?.length || Object.keys(o.responses ?? {}).length || o.disabled) }
</script>

<template>
  <div class="manu">
    <header class="head">
      <div class="title">
        <ManuAvatar :size="54" />
        <div><span class="eyebrow">{{ $t('bo.eyebrow') }}</span><h1>Manu AI</h1><p class="text-muted">{{ $t('bo.manu.lead') }}</p></div>
      </div>
      <div class="tabs" role="tablist">
        <button v-for="tb in ['report', 'settings', 'knowledge', 'logs']" :key="tb" type="button" role="tab" :class="{ on: tab === tb }" @click="tab = tb">{{ $t(`bo.manu.tabs.${tb}`) }}</button>
      </div>
    </header>

    <!-- ═══ Rapport ═══ -->
    <template v-if="tab === 'report'">
      <KLoader v-if="!report" />
      <template v-else>
        <div class="period">
          <span class="text-muted">{{ $t('bo.manu.period') }}</span>
          <button v-for="d in [7, 30, 90]" :key="d" type="button" :class="{ on: days === d }" @click="days = d">{{ d }} {{ $t('bo.manu.days') }}</button>
        </div>
        <div class="kpis">
          <KStat :label="$t('bo.manu.kpi.messages')" :value="report.total" :hint="$t('bo.manu.kpi.sessions', { n: report.sessions })" />
          <KStat :label="$t('bo.manu.kpi.autonomous')" :value="report.autonomousRate" suffix="%" accent="olive" :hint="$t('bo.manu.kpi.understood', { n: report.understoodRate })" />
          <KStat :label="$t('bo.manu.kpi.escalated')" :value="report.escalated" accent="clay" :hint="$t('bo.manu.kpi.escalationRate', { n: report.escalationRate })" />
          <KStat :label="$t('bo.manu.kpi.humanResponse')" :value="report.avgHumanResponseH" suffix="h" :hint="report.slaBreaches ? $t('bo.inbox.breached', { n: report.slaBreaches }) : $t('bo.manu.kpi.slaOk')" />
        </div>
        <div class="charts">
          <section class="wood-panel box wide">
            <h3>{{ $t('bo.manu.volume') }}</h3>
            <KSparkline :values="report.byDay.map((d) => d.count)" :height="120" />
            <p class="text-muted small">{{ $t('bo.manu.volumeHint', { ms: report.avgResponseMs, fellow: report.fellowShare }) }}</p>
          </section>
          <section class="wood-panel box"><h3>{{ $t('bo.manu.topIntents') }}</h3><KBarList :items="intents.slice(0, 8)" /></section>
          <section class="wood-panel box"><h3>{{ $t('bo.manu.escalations') }}</h3><KBarList :items="reasons" /></section>
          <section class="wood-panel box"><h3>{{ $t('bo.manu.languages') }}</h3><KBarList :items="locales" /></section>
          <section class="wood-panel box">
            <h3>{{ $t('bo.manu.unanswered') }}</h3>
            <p class="text-muted small">{{ $t('bo.manu.unansweredHint') }}</p>
            <ul class="unans"><li v-for="u in report.unanswered" :key="u">« {{ u }} »</li></ul>
          </section>
        </div>
      </template>
    </template>

    <!-- ═══ Paramètres ═══ -->
    <template v-else-if="tab === 'settings'">
      <KLoader v-if="!draft" />
      <div v-else class="settings">
        <section class="wood-panel box">
          <h3>{{ $t('bo.manu.s.identity') }}</h3>
          <div class="grid-2">
            <KField :label="$t('bo.manu.s.displayName')"><input v-model="draft.displayName" class="k-input" /></KField>
            <KField :label="$t('bo.manu.s.tone')"><KChips v-model="draft.tone" :options="['warm', 'formal', 'concise'].map((v) => ({ value: v, label: $t(`bo.manu.s.tones.${v}`) }))" /></KField>
          </div>
          <KField v-for="l in ENABLED_LOCALES" :key="l.code" :label="$t('bo.manu.s.greeting', { lang: l.label })" :hint="$t('bo.manu.s.greetingHint')"><textarea v-model="draft.greetingOverride[l.code]" class="k-input" rows="2" /></KField>
        </section>

        <section class="wood-panel box">
          <h3>{{ $t('bo.manu.s.guardrails') }}</h3>
          <p class="text-muted small">{{ $t('bo.manu.s.guardrailsLead') }}</p>
          <div class="switches">
            <label v-for="r in REASONS" :key="r" class="sw"><input v-model="draft.escalation[r]" type="checkbox" /><span>{{ $t(`bo.inbox.reasons.${r}`) }}</span></label>
          </div>
          <KField :label="$t('bo.manu.s.extraKeywords')" :hint="$t('bo.manu.s.extraKeywordsHint')">
            <input :value="draft.extraEscalationKeywords.join(', ')" class="k-input" @input="draft.extraEscalationKeywords = $event.target.value.split(',').map((k) => k.trim()).filter(Boolean)" />
          </KField>
          <div class="grid-2">
            <KField :label="$t('bo.manu.s.misses')" :hint="$t('bo.manu.s.missesHint')"><input v-model.number="draft.missesThreshold" type="number" min="1" max="6" class="k-input" /></KField>
            <KField :label="$t('bo.manu.s.sla')" :hint="$t('bo.manu.s.slaHint')"><input v-model.number="draft.slaHours" type="number" min="1" max="48" class="k-input" /></KField>
          </div>
        </section>

        <section class="wood-panel box">
          <h3>{{ $t('bo.manu.s.behaviour') }}</h3>
          <div class="switches">
            <label class="sw"><input v-model="draft.quickRepliesEnabled" type="checkbox" /><span>{{ $t('bo.manu.s.quickReplies') }}</span></label>
            <label class="sw"><input v-model="draft.teaserEnabled" type="checkbox" /><span>{{ $t('bo.manu.s.teaser') }}</span></label>
            <label class="sw"><input v-model="draft.offHoursNotice" type="checkbox" /><span>{{ $t('bo.manu.s.offHours') }}</span></label>
            <label class="sw danger"><input v-model="draft.degradedMode" type="checkbox" /><span>{{ $t('bo.manu.s.degraded') }}</span></label>
          </div>
          <div class="grid-2">
            <KField :label="$t('bo.manu.s.hours')"><div class="hours"><input v-model="draft.workingHours.start" type="time" class="k-input" /><span>→</span><input v-model="draft.workingHours.end" type="time" class="k-input" /></div></KField>
            <KField :label="$t('bo.manu.s.retention')" :hint="$t('bo.manu.s.retentionHint')"><input v-model.number="draft.logRetentionDays" type="number" min="7" max="730" class="k-input" /></KField>
          </div>
        </section>

        <section class="wood-panel box save">
          <div class="ver">
            <strong>v{{ settings.version }}</strong>
            <small class="text-muted">{{ $t('bo.manu.s.updatedBy', { name: settings.updatedBy, when: timeAgo(settings.updatedAt, locale) }) }}</small>
          </div>
          <KField :label="$t('bo.manu.s.note')"><input v-model="note" class="k-input" :placeholder="$t('bo.manu.s.notePh')" /></KField>
          <div class="save-acts">
            <KButton variant="ghost" :icon="false" :disabled="!dirty" @click="draft = JSON.parse(JSON.stringify(settings))">{{ $t('bo.manu.s.discard') }}</KButton>
            <KButton :loading="saving" :disabled="!dirty" @click="save">{{ $t('bo.manu.s.publish') }}</KButton>
          </div>
          <details class="history"><summary>{{ $t('bo.manu.s.history') }}</summary>
            <ul><li v-for="h in [...settings.history].reverse()" :key="h.version"><strong>v{{ h.version }}</strong> · {{ formatDate(h.at, locale) }} · {{ h.by }} — <em>{{ h.note }}</em></li></ul>
          </details>
        </section>
      </div>
    </template>

    <!-- ═══ Base de connaissances ═══ -->
    <template v-else-if="tab === 'knowledge'">
      <KLoader v-if="!knowledge" />
      <div v-else class="kb">
        <aside class="wood-panel box kb-list">
          <h3>{{ $t('bo.manu.k.intents') }}</h3>
          <p class="text-muted small">{{ $t('bo.manu.k.lead') }}</p>
          <ul>
            <li v-for="it in knowledge.catalog" :key="it.id" :class="{ on: editing?.id === it.id }">
              <button type="button" @click="edit(it)"><strong>{{ $t(`bo.manu.intents.${it.id}`, it.id) }}</strong><small>{{ it.keywords.length + (knowledge.overrides.intents[it.id]?.extraKeywords?.length ?? 0) }} {{ $t('bo.manu.k.keywords') }}</small><KBadge v-if="knowledge.overrides.intents[it.id]?.disabled" tone="danger">{{ $t('bo.manu.k.disabled') }}</KBadge><KBadge v-else-if="isOverridden(it.id)" tone="gold">{{ $t('bo.manu.k.edited') }}</KBadge></button>
            </li>
          </ul>
          <h4>{{ $t('bo.manu.k.rules') }}</h4>
          <ul class="rules"><li v-for="r in knowledge.escalationRules" :key="r.reason"><strong>{{ $t(`bo.inbox.reasons.${r.reason}`) }}</strong><small>{{ r.keywords.slice(0, 6).join(', ') }}…</small></li></ul>
        </aside>
        <section v-if="editing" class="wood-panel box kb-edit">
          <header class="kb-head"><h3>{{ $t(`bo.manu.intents.${editing.id}`, editing.id) }}</h3><KChips v-model="kbLocale" :options="ENABLED_LOCALES.map((l) => ({ value: l.code, label: l.code.toUpperCase() }))" /></header>
          <KField :label="$t('bo.manu.k.baseKeywords')"><p class="kw">{{ editing.keywords.join(' · ') }}</p></KField>
          <KField :label="$t('bo.manu.k.extraKeywords')" :hint="$t('bo.manu.k.extraHint')"><input v-model="kbDraft.extraKeywords" class="k-input" /></KField>
          <KField :label="$t('bo.manu.k.response', { lang: kbLocale.toUpperCase() })" :hint="$t('bo.manu.k.responseHint')"><textarea v-model="kbDraft.text" class="k-input" rows="6" /></KField>
          <label class="sw danger"><input v-model="kbDraft.disabled" type="checkbox" /><span>{{ $t('bo.manu.k.disable') }}</span></label>
          <div class="save-acts"><KButton variant="ghost" :icon="false" @click="editing = null">{{ $t('common.close') }}</KButton><KButton @click="saveIntent">{{ $t('bo.manu.s.publish') }}</KButton></div>
        </section>
        <section v-else class="wood-panel box kb-edit empty"><p class="text-muted">{{ $t('bo.manu.k.pick') }}</p></section>
      </div>
    </template>

    <!-- ═══ Journal ═══ -->
    <template v-else>
      <div class="filters">
        <input v-model="logQ" class="k-input" :placeholder="$t('bo.manu.l.search')" />
        <select v-model="logFilter" class="k-input"><option value="all">{{ $t('common.all') }}</option><option value="escalated">{{ $t('bo.manu.l.escalatedOnly') }}</option><option value="fallback">{{ $t('bo.manu.intents.fallback') }}</option><option v-for="i in (knowledge?.catalog ?? [])" :key="i.id" :value="i.id">{{ $t(`bo.manu.intents.${i.id}`, i.id) }}</option></select>
      </div>
      <KLoader v-if="!logs" />
      <div v-else class="wood-panel table-wrap">
        <table>
          <thead><tr><th>{{ $t('bo.manu.l.when') }}</th><th>{{ $t('bo.manu.l.who') }}</th><th>{{ $t('bo.manu.l.message') }}</th><th>{{ $t('bo.manu.l.intent') }}</th><th>{{ $t('bo.manu.l.page') }}</th></tr></thead>
          <tbody>
            <tr v-for="l in logs" :key="l.id" :class="{ esc: l.escalated }">
              <td><span>{{ formatDate(l.at, locale) }}</span><small>{{ formatTime(l.at, locale) }}</small></td>
              <td><KBadge :tone="l.role === 'fellow' ? 'gold' : 'muted'">{{ $t(`bo.manu.l.${l.role}`) }}</KBadge><small>{{ l.locale.toUpperCase() }}</small></td>
              <td class="m">« {{ l.userMessage }} »</td>
              <td><KBadge v-if="l.escalated" tone="danger">⤴ {{ l.reason ? $t(`bo.inbox.reasons.${l.reason}`) : $t('bo.manu.intents.escalate') }}</KBadge><KBadge v-else-if="l.intent === 'fallback'" tone="clay">{{ $t('bo.manu.intents.fallback') }} ({{ l.misses }})</KBadge><KBadge v-else tone="olive">{{ $t(`bo.manu.intents.${l.intent}`, l.intent) }}</KBadge></td>
              <td class="pg">{{ l.page || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.manu { display: grid; gap: 1.25rem; }
.head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; }
.title { display: flex; gap: 1rem; align-items: center; h1 { margin: 0; } p { margin: 0; font-size: .9rem; } }
.tabs { display: flex; gap: .4rem; flex-wrap: wrap; button { background: rgba(20,12,7,.4); border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .55rem 1.1rem; border-radius: 999px; font-weight: 700; &.on { background: var(--kec-cowrie); color: #2a1a12; } } }
.period { display: flex; gap: .4rem; align-items: center; font-size: .84rem; button { background: none; border: 1px solid var(--kec-border); color: var(--kec-text-muted); border-radius: 999px; padding: .3rem .8rem; font-weight: 700; font-size: .8rem; &.on { background: var(--kec-gold); color: #2a1a12; border-color: transparent; } } }
.kpis { display: grid; gap: 1rem; grid-template-columns: repeat(2, 1fr); @include lg-up { grid-template-columns: repeat(4, 1fr); } }
.charts { display: grid; gap: 1rem; @include md-up { grid-template-columns: 1fr 1fr; } @include lg-up { grid-template-columns: repeat(3, 1fr); } .wide { grid-column: 1 / -1; } }
.box { padding: 1.25rem; display: grid; gap: .9rem; align-content: start; h3 { margin: 0; font-size: 1.05rem; } }
.small { font-size: .82rem; margin: 0; }
.unans { list-style: none; padding: 0; margin: 0; display: grid; gap: .35rem; font-size: .86rem; font-style: italic; color: var(--kec-gold-soft); }
.settings { display: grid; gap: 1rem; }
.grid-2 { display: grid; gap: 1rem; @include sm-up { grid-template-columns: 1fr 1fr; } }
.switches { display: grid; gap: .5rem; @include sm-up { grid-template-columns: 1fr 1fr; } @include lg-up { grid-template-columns: repeat(3, 1fr); } }
.sw { display: flex; gap: .6rem; align-items: center; padding: .6rem .8rem; border-radius: 12px; border: 1px solid var(--kec-border); font-size: .86rem; cursor: pointer; input { accent-color: var(--kec-gold); width: 18px; height: 18px; } &.danger { border-color: rgba(208,87,62,.5); color: #f08a6e; input { accent-color: #d0573e; } } }
.hours { display: flex; gap: .5rem; align-items: center; }
.save { position: sticky; bottom: 5.5rem; @include md-up { bottom: 1rem; } border-color: rgba(214,165,72,.5); z-index: 5; }
.ver { display: flex; gap: .7rem; align-items: baseline; strong { font-family: var(--font-display); font-size: 1.4rem; color: var(--kec-gold-soft); } small { font-size: .8rem; } }
.save-acts { display: flex; justify-content: flex-end; gap: .6rem; flex-wrap: wrap; }
.history { font-size: .82rem; summary { cursor: pointer; color: var(--kec-gold-soft); font-weight: 700; } ul { list-style: none; padding: 0; margin: .6rem 0 0; display: grid; gap: .3rem; color: var(--kec-text-muted); strong { color: var(--kec-ivory); } } }
.kb { display: grid; gap: 1rem; @include lg-up { grid-template-columns: 340px 1fr; align-items: start; } }
.kb-list { ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .3rem; max-height: 48vh; overflow-y: auto; }
  li button { width: 100%; text-align: start; display: flex; flex-wrap: wrap; gap: .3rem .6rem; align-items: center; background: none; border: 1px solid transparent; color: var(--kec-ivory); padding: .55rem .7rem; border-radius: 12px; strong { font-size: .9rem; } small { color: var(--kec-text-muted); font-size: .72rem; } &:hover { background: rgba(255,255,255,.04); } }
  li.on button { border-color: var(--kec-gold); background: rgba(214,165,72,.1); }
  h4 { margin: .5rem 0 0; font-family: var(--font-body); font-size: .72rem; letter-spacing: .14em; text-transform: uppercase; color: var(--kec-gold); }
  .rules { max-height: none; li { display: flex; flex-direction: column; padding: .3rem 0; border-bottom: 1px dashed var(--kec-border); font-size: .8rem; small { color: var(--kec-text-muted); } } } }
.kb-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.kw { margin: 0; font-size: .82rem; color: var(--kec-text-muted); line-height: 1.6; }
.empty { min-height: 200px; place-items: center; }
.filters { display: grid; gap: .6rem; @include md-up { grid-template-columns: 1fr 260px; } }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .84rem; th { text-align: start; padding: .8rem 1rem; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--kec-text-muted); border-bottom: 1px solid var(--kec-border); } td { padding: .6rem 1rem; border-bottom: 1px dashed var(--kec-border); vertical-align: top; small { display: block; font-size: .7rem; color: var(--kec-text-muted); } } .m { font-style: italic; } .pg { font-family: monospace; font-size: .76rem; color: var(--kec-text-muted); } tr.esc td { background: rgba(208,87,62,.05); } }
</style>

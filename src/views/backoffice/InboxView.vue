
<script setup>
/**
 * Back-office — Messagerie (3 volets) :
 *  1. liste des fils (filtres : statut, type, assigné, recherche ; tri SLA)
 *  2. conversation (bulles, notes internes, réponses types, assignation,
 *     priorité, tags, clôture / réouverture)
 *  3. contexte du fellow (dossier, rendez-vous, paiements, autres fils)
 * Onglet Kopen Mind : suggestions.
 * SLA cible : première réponse humaine sous 4 heures ouvrées (§3).
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useInboxStore } from '@/stores/inbox'
import { APP_CONFIG } from '@/config/app.config'
import KBadge from '@/components/ui/KBadge.vue'
import KLoader from '@/components/ui/KLoader.vue'
import ThreadConversation from '@/components/features/ThreadConversation.vue'
import { timeAgo, formatDate, formatXaf, initials } from '@/utils/format'
import { THREAD_TONE, KIND_TONE, PRIORITY_TONE, DOSSIER_TONE, BOOKING_TONE } from '@/utils/status'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const inboxStore = useInboxStore()

const tab = ref(route.query.tab === 'kopen' ? 'kopen' : 'threads')
const threads = ref(null)
const suggestions = ref(null)
const team = ref([])
const canned = ref([])
const current = ref(null)
const context = ref(null)
const sending = ref(false)
const q = ref('')
const status = ref('open')
const kind = ref('all')
const assignee = ref(route.query.fellow ? 'all' : 'all')
const fellowFilter = ref(route.query.fellow ?? null)
const tagDraft = ref('')
const showContext = ref(true)

const load = async () => { threads.value = await api.messaging.listAll({ status: status.value, kind: kind.value, assigneeId: assignee.value, q: q.value }) }
onMounted(async () => {
  ;[suggestions.value, team.value, canned.value] = await Promise.all([api.backoffice.listSuggestions(), api.backoffice.listTeam(), api.messaging.cannedReplies()])
  if (route.params.id) { status.value = 'all' }
  await load()
  if (route.params.id) open(threads.value.find((x) => x.id === route.params.id))
  else if (fellowFilter.value) { status.value = 'all'; await load() }
})
let debounce
watch([q, status, kind, assignee], () => { clearTimeout(debounce); debounce = setTimeout(load, 200) })

const staff = computed(() => team.value.filter((m) => m.status === 'active'))
const slaState = (th) => {
  if (th.status !== 'open' || th.firstResponseAt) return null
  const left = new Date(th.slaDueAt).getTime() - Date.now()
  return left < 0 ? 'breached' : left < 3600000 ? 'soon' : 'ok'
}
const visible = computed(() => {
  let rows = threads.value ?? []
  if (fellowFilter.value) rows = rows.filter((x) => x.fellowId === fellowFilter.value)
  // tri : SLA dépassé d'abord, puis priorité, puis dernier message
  const prio = { urgent: 0, high: 1, normal: 2 }
  return [...rows].sort((a, b) => (slaState(b) === 'breached') - (slaState(a) === 'breached') || prio[a.priority] - prio[b.priority] || b.lastMessageAt.localeCompare(a.lastMessageAt))
})
const counts = computed(() => ({
  open: (threads.value ?? []).filter((x) => x.status === 'open').length,
  breached: (threads.value ?? []).filter((x) => slaState(x) === 'breached').length,
  mine: (threads.value ?? []).filter((x) => x.assigneeId === auth.user.id && x.status !== 'closed').length
}))
const newCount = computed(() => suggestions.value?.filter((x) => x.status === 'new').length ?? 0)

async function open(th) {
  if (!th) return
  current.value = await api.messaging.get(th.id, { asStaff: true })
  router.replace({ name: 'bo-inbox', params: { id: th.id } })
  if (th.unreadStaff) { await api.messaging.markRead(th.id, 'staff'); th.unreadStaff = 0; current.value.unreadStaff = 0; inboxStore.refresh('staff') }
  context.value = null
  if (th.companyId) {
    try { context.value = await api.backoffice.getDossier(th.companyId) } catch { context.value = null }
  }
}
function syncRow(updated) {
  Object.assign(current.value, updated)
  const row = threads.value.find((x) => x.id === updated.id)
  if (row) Object.assign(row, updated)
}
async function send({ text, internal }) {
  sending.value = true
  try {
    syncRow(await api.messaging.post(current.value.id, { from: 'staff', authorId: auth.user.id, author: auth.user.name, text, internal }))
    if (!internal) ui.toast(t('bo.inbox.replied'), { type: 'success' })
  } finally { sending.value = false }
}
async function update(patch) { syncRow(await api.messaging.update(current.value.id, patch)) }
async function addTag() {
  const tg = tagDraft.value.trim()
  if (!tg) return
  await update({ tags: [...new Set([...(current.value.tags ?? []), tg])] })
  tagDraft.value = ''
}
const removeTag = (tg) => update({ tags: current.value.tags.filter((x) => x !== tg) })
async function markSuggestion(s, st) { Object.assign(s, await api.backoffice.updateSuggestion(s.id, { status: st })) }
</script>

<template>
  <div class="inbox">
    <header class="head">
      <div>
        <span class="eyebrow">{{ $t('bo.eyebrow') }}</span>
        <h1>{{ $t('bo.inbox.title') }}</h1>
      </div>
      <div class="tabs" role="tablist">
        <button type="button" role="tab" :class="{ on: tab === 'threads' }" @click="tab = 'threads'">{{ $t('bo.inbox.conversations') }} <small>{{ counts.open }}</small></button>
        <button type="button" role="tab" :class="{ on: tab === 'kopen' }" @click="tab = 'kopen'">Kopen Mind <small>{{ newCount }}</small></button>
      </div>
    </header>

    <!-- ═══ Conversations ═══ -->
    <div v-if="tab === 'threads'" class="three" :class="{ 'has-current': current, 'no-ctx': !showContext || !current }">
      <aside class="list wood-panel">
        <div class="filters">
          <input v-model="q" class="k-input" :placeholder="$t('bo.inbox.search')" />
          <div class="row">
            <select v-model="status" class="k-input"><option value="all">{{ $t('common.all') }}</option><option v-for="s in ['open', 'pending', 'closed']" :key="s" :value="s">{{ $t(`inbox.status.${s}`) }}</option></select>
            <select v-model="kind" class="k-input"><option value="all">{{ $t('bo.inbox.allKinds') }}</option><option v-for="k in APP_CONFIG.messaging.kinds" :key="k" :value="k">{{ $t(`inbox.kinds.${k}`) }}</option></select>
          </div>
          <div class="row">
            <select v-model="assignee" class="k-input"><option value="all">{{ $t('bo.inbox.everyone') }}</option><option :value="auth.user.id">{{ $t('bo.inbox.mine') }} ({{ counts.mine }})</option><option value="none">{{ $t('bo.dossiers.unassigned') }}</option><option v-for="m in staff" :key="m.id" :value="m.id">{{ m.name }}</option></select>
            <button v-if="fellowFilter" type="button" class="clear" @click="fellowFilter = null">✕ {{ $t('bo.inbox.oneFellow') }}</button>
          </div>
          <p v-if="counts.breached" class="breach">⚠ {{ $t('bo.inbox.breached', { n: counts.breached }) }}</p>
        </div>
        <KLoader v-if="!threads" />
        <ul v-else>
          <li v-for="th in visible" :key="th.id" :class="{ on: current?.id === th.id, unread: th.unreadStaff, [`sla-${slaState(th)}`]: slaState(th) }">
            <button type="button" @click="open(th)">
              <span class="top">
                <KBadge :tone="KIND_TONE[th.kind]">{{ $t(`inbox.kinds.${th.kind}`) }}</KBadge>
                <KBadge v-if="th.priority !== 'normal'" :tone="PRIORITY_TONE[th.priority]">{{ $t(`inbox.priority.${th.priority}`) }}</KBadge>
                <small class="when">{{ timeAgo(th.lastMessageAt, locale) }}</small>
              </span>
              <strong>{{ th.subject }}</strong>
              <span class="who">{{ th.fellowName }}<template v-if="th.fellowNumber"> · #{{ String(th.fellowNumber).padStart(3, '0') }}</template></span>
              <span class="preview">{{ th.messages.filter((m) => !m.internal).at(-1)?.text }}</span>
              <span class="meta">
                <span class="asg">{{ th.assignee ?? $t('bo.dossiers.unassigned') }}</span>
                <span v-if="slaState(th) === 'breached'" class="sla ko">SLA ✕</span>
                <span v-else-if="slaState(th) === 'soon'" class="sla warn">SLA &lt; 1 h</span>
                <KBadge v-else :tone="THREAD_TONE[th.status]">{{ $t(`inbox.status.${th.status}`) }}</KBadge>
              </span>
              <span v-if="th.unreadStaff" class="dot">{{ th.unreadStaff }}</span>
            </button>
          </li>
          <li v-if="!visible.length" class="empty text-muted">{{ $t('inbox.empty') }}</li>
        </ul>
      </aside>

      <section v-if="current" class="pane wood-panel">
        <header class="pane-head">
          <button type="button" class="back" @click="current = null">←</button>
          <div class="who">
            <strong>{{ current.subject }}</strong>
            <small class="text-muted">{{ current.fellowName }} · {{ $t(`inbox.kinds.${current.kind}`) }}<template v-if="current.reason"> · {{ $t(`bo.inbox.reasons.${current.reason}`) }}</template> · {{ $t('bo.inbox.openedAt', { date: formatDate(current.createdAt, locale) }) }}</small>
          </div>
          <button type="button" class="ctx-toggle" :title="$t('bo.inbox.context')" @click="showContext = !showContext">☰</button>
        </header>
        <div class="toolbar">
          <label>{{ $t('bo.dossiers.assignee') }}<select class="k-input" :value="current.assigneeId ?? ''" :disabled="!auth.can('replyMessages')" @change="update({ assigneeId: $event.target.value || null })"><option value="">—</option><option v-for="m in staff" :key="m.id" :value="m.id">{{ m.name }}</option></select></label>
          <label>{{ $t('bo.inbox.priorityLabel') }}<select class="k-input" :value="current.priority" @change="update({ priority: $event.target.value })"><option v-for="p in APP_CONFIG.messaging.priorities" :key="p" :value="p">{{ $t(`inbox.priority.${p}`) }}</option></select></label>
          <label>{{ $t('bo.inbox.statusLabel') }}<select class="k-input" :value="current.status" @change="update({ status: $event.target.value })"><option v-for="s in ['open', 'pending', 'closed']" :key="s" :value="s">{{ $t(`inbox.status.${s}`) }}</option></select></label>
          <div class="tags">
            <span v-for="tg in current.tags" :key="tg" class="tag">{{ tg }} <button type="button" @click="removeTag(tg)">✕</button></span>
            <input v-model="tagDraft" class="tag-in" :placeholder="$t('bo.inbox.addTag')" @keydown.enter.prevent="addTag" />
          </div>
        </div>
        <ThreadConversation :thread="current" viewer="staff" :canned="canned" :sending="sending" @send="send" />
      </section>
      <section v-else class="pane wood-panel empty-pane"><p class="text-muted">{{ $t('inbox.pickOne') }}</p></section>

      <aside v-if="current && showContext" class="ctx">
        <div class="wood-panel box">
          <h4>{{ $t('bo.inbox.context') }}</h4>
          <div class="person">
            <span class="ava">{{ initials(current.fellowName) }}</span>
            <div><strong>{{ current.fellowName }}</strong><small class="text-muted">{{ current.fellowNumber ? `Fellow #${String(current.fellowNumber).padStart(3, '0')}` : $t('bo.inbox.visitor') }}</small></div>
          </div>
          <template v-if="context">
            <dl>
              <div><dt>{{ $t('fellow.dash.company') }}</dt><dd><RouterLink :to="{ name: 'bo-dossiers', params: { id: context.id } }">{{ context.name }}</RouterLink></dd></div>
              <div><dt>{{ $t('bo.dossiers.status') }}</dt><dd><KBadge :tone="DOSSIER_TONE[context.status]">{{ $t(`status.dossier.${context.status}`) }}</KBadge></dd></div>
              <div><dt>{{ $t('bo.dossiers.assignee') }}</dt><dd>{{ context.assignee ?? '—' }}</dd></div>
              <div><dt>{{ $t('bo.inbox.residence') }}</dt><dd>{{ context.residenceCountry }}</dd></div>
              <div><dt>{{ $t('bo.inbox.paid') }}</dt><dd>{{ formatXaf(context.payments.filter((p) => p.status === 'succeeded').reduce((s, p) => s + p.amount, 0), locale) }}</dd></div>
              <div><dt>{{ $t('bo.dossiers.documents') }}</dt><dd>{{ context.documents.filter((d) => d.status === 'verified').length }} ✓ · {{ context.docsToReview }} ⏳</dd></div>
            </dl>
            <h5>{{ $t('bo.inbox.nextBookings') }}</h5>
            <ul class="mini">
              <li v-for="b in context.bookingList.filter((x) => ['confirmed', 'awaiting_payment'].includes(x.status)).slice(0, 3)" :key="b.id"><span>{{ formatDate(b.date, locale, { day: 'numeric', month: 'short' }) }} {{ b.slot }}</span><span class="t">{{ b.consultant }}</span><KBadge :tone="BOOKING_TONE[b.status]">{{ $t(`booking.status.${b.status}`) }}</KBadge></li>
              <li v-if="!context.bookingList.some((x) => ['confirmed', 'awaiting_payment'].includes(x.status))" class="text-muted">—</li>
            </ul>
            <h5>{{ $t('bo.dossiers.conversations') }}</h5>
            <ul class="mini">
              <li v-for="th in context.threads.filter((x) => x.id !== current.id).slice(0, 4)" :key="th.id"><button type="button" class="lnk" @click="open(th)">{{ th.subject }}</button><KBadge :tone="THREAD_TONE[th.status]">{{ $t(`inbox.status.${th.status}`) }}</KBadge></li>
              <li v-if="context.threads.length <= 1" class="text-muted">—</li>
            </ul>
          </template>
          <p v-else class="text-muted small">{{ $t('bo.inbox.noContext') }}</p>
        </div>
      </aside>
    </div>

    <!-- ═══ Kopen Mind ═══ -->
    <ul v-else class="items">
      <li v-for="s in suggestions" :key="s.id" class="item wood-panel" :class="{ closed: s.status !== 'new' }">
        <header>
          <KBadge tone="gold">{{ $t(`kopen.categories.${s.category}`) }}</KBadge>
          <KBadge v-if="s.status === 'new'" tone="olive" dot>{{ $t('bo.inbox.new') }}</KBadge>
          <KBadge v-else-if="s.status === 'planned'" tone="indigo">{{ $t('bo.inbox.planned') }}</KBadge>
          <small class="when">{{ timeAgo(s.createdAt, locale) }}</small>
        </header>
        <p class="msg">« {{ s.message }} »</p>
        <small class="text-muted">{{ s.author }} {{ s.contact ? `· ${s.contact}` : '' }}</small>
        <div class="s-acts">
          <button v-if="s.status === 'new'" type="button" @click="markSuggestion(s, 'read')">{{ $t('bo.inbox.markRead') }}</button>
          <button v-if="s.status !== 'planned'" type="button" @click="markSuggestion(s, 'planned')">{{ $t('bo.inbox.plan') }}</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.inbox { display: grid; gap: 1.25rem; }
.head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; h1 { margin: 0; } }
.tabs { display: flex; gap: .4rem; button { background: rgba(20,12,7,.4); border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .55rem 1.1rem; border-radius: 999px; font-weight: 700; small { margin-inline-start: .3rem; padding: .05rem .45rem; border-radius: 99px; background: rgba(214,165,72,.2); color: var(--kec-gold-soft); } &.on { background: var(--kec-cowrie); color: #2a1a12; small { background: rgba(42,26,18,.15); color: #2a1a12; } } } }
.three { display: grid; gap: 1rem; @include md-down { .empty-pane { display: none; } } @include lg-up { grid-template-columns: 340px 1fr 280px; min-height: 640px; align-items: stretch; &.no-ctx { grid-template-columns: 340px 1fr; } } }
@include md-down { .three.has-current .list { display: none; } .ctx { display: none; } }
.list { overflow: hidden; display: flex; flex-direction: column;
  ul { list-style: none; padding: 0; margin: 0; overflow-y: auto; max-height: 72vh; }
  li button { width: 100%; text-align: start; background: none; border: 0; border-bottom: 1px solid var(--kec-border); padding: .85rem 1rem; color: var(--kec-ivory); display: grid; gap: .25rem; position: relative; &:hover { background: rgba(255,255,255,.03); } }
  li.on button { background: rgba(214,165,72,.1); box-shadow: inset 3px 0 0 var(--kec-gold); }
  li.unread strong { color: var(--kec-gold-soft); }
  li.sla-breached button { box-shadow: inset 3px 0 0 var(--kec-laterite); }
  .top { display: flex; gap: .3rem; align-items: center; .when { margin-inline-start: auto; font-size: .7rem; color: var(--kec-text-muted); } }
  strong { font-size: .92rem; line-height: 1.3; }
  .who { font-size: .76rem; color: var(--kec-gold-soft); }
  .preview { font-size: .78rem; color: var(--kec-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .meta { display: flex; justify-content: space-between; align-items: center; gap: .5rem; font-size: .72rem; .asg { color: var(--kec-text-muted); } }
  .sla { font-weight: 800; padding: .1rem .5rem; border-radius: 99px; &.ko { background: rgba(208,87,62,.2); color: #f08a6e; } &.warn { background: rgba(214,165,72,.2); color: var(--kec-gold-soft); } }
  .dot { position: absolute; inset-inline-end: .9rem; top: 2.6rem; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 99px; display: grid; place-items: center; font-size: .66rem; font-weight: 800; background: var(--kec-laterite); color: #fff; }
  .empty { padding: 1.5rem; text-align: center; } }
.filters { padding: .75rem; border-bottom: 1px solid var(--kec-border); display: grid; gap: .5rem; .k-input { padding: .55rem .8rem; font-size: .84rem; } .row { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }
  .clear { background: none; border: 1px solid var(--kec-gold); color: var(--kec-gold-soft); border-radius: 999px; font-size: .76rem; font-weight: 700; } .breach { margin: 0; font-size: .78rem; color: #f08a6e; font-weight: 700; } }
.pane { display: flex; flex-direction: column; overflow: hidden; min-height: 520px; }
.pane-head { display: flex; align-items: center; gap: .8rem; padding: .9rem 1rem; border-bottom: 1px solid var(--kec-border);
  .who { flex: 1; display: flex; flex-direction: column; min-width: 0; strong { font-family: var(--font-display); font-size: 1.05rem; } small { font-size: .74rem; } } }
.back { background: none; border: 0; color: var(--kec-gold); font-size: 1.2rem; @include lg-up { display: none; } }
.ctx-toggle { background: none; border: 1px solid var(--kec-border); color: var(--kec-text-muted); width: 34px; height: 34px; border-radius: 10px; display: none; @include lg-up { display: block; } }
.toolbar { display: flex; flex-wrap: wrap; gap: .6rem; padding: .7rem 1rem; border-bottom: 1px solid var(--kec-border); background: rgba(20,12,7,.25); align-items: flex-end;
  label { display: grid; gap: .2rem; font-size: .66rem; letter-spacing: .1em; text-transform: uppercase; color: var(--kec-text-muted); font-weight: 700; .k-input { padding: .4rem 2.2rem .4rem .7rem; font-size: .82rem; border-radius: 10px; } } }
.tags { flex: 1 1 200px; display: flex; flex-wrap: wrap; gap: .3rem; align-items: center; min-width: 0;
  .tag { display: inline-flex; gap: .3rem; align-items: center; padding: .2rem .6rem; border-radius: 99px; background: rgba(214,165,72,.15); color: var(--kec-gold-soft); font-size: .74rem; font-weight: 700; button { background: none; border: 0; color: inherit; padding: 0; font-size: .7rem; } }
  .tag-in { background: none; border: 1px dashed var(--kec-border); color: var(--kec-ivory); border-radius: 99px; padding: .2rem .6rem; font-size: .74rem; width: 110px; &:focus { outline: none; border-color: var(--kec-gold); } } }
.empty-pane { display: grid; place-items: center; p { margin: 0; } }
.ctx { .box { padding: 1.1rem; display: grid; gap: .8rem; align-content: start; } h4 { margin: 0; font-family: var(--font-body); font-size: .72rem; letter-spacing: .16em; text-transform: uppercase; color: var(--kec-gold); } h5 { margin: .4rem 0 0; font-family: var(--font-body); font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--kec-text-muted); } }
.person { display: flex; gap: .7rem; align-items: center; .ava { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: .8rem; color: #2a1a12; background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548); } div { display: flex; flex-direction: column; } small { font-size: .74rem; } }
dl { margin: 0; display: grid; gap: .1rem; div { display: flex; justify-content: space-between; gap: .6rem; padding: .4rem 0; border-bottom: 1px dashed var(--kec-border); font-size: .8rem; } dt { color: var(--kec-text-muted); } dd { margin: 0; text-align: end; font-weight: 600; } }
.mini { list-style: none; padding: 0; margin: 0; display: grid; gap: .35rem; li { display: flex; justify-content: space-between; align-items: center; gap: .4rem; font-size: .76rem; .t { flex: 1; color: var(--kec-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } } .lnk { flex: 1; text-align: start; background: none; border: 0; color: var(--kec-ivory); padding: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; &:hover { color: var(--kec-gold-soft); } } }
.small { font-size: .8rem; }
.items { list-style: none; padding: 0; margin: 0; display: grid; gap: .9rem; }
.item { padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: .45rem; &.closed { opacity: .6; }
  header { display: flex; flex-wrap: wrap; gap: .4rem; align-items: center; } .when { margin-inline-start: auto; color: var(--kec-text-muted); font-size: .76rem; } }
.msg { margin: 0; font-family: var(--font-display); font-style: italic; font-size: 1.05rem; }
.s-acts { display: flex; gap: .5rem; button { background: none; border: 1px solid var(--kec-border); color: var(--kec-gold-soft); border-radius: 999px; padding: .35rem .85rem; font-size: .8rem; font-weight: 700; } }
</style>

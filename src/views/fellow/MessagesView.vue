
<script setup>
/**
 * Espace fellow — Messages : toutes les conversations avec l'équipe KEC
 * (escalades Manu, dossier, rendez-vous, paiements, questions libres).
 * Le fellow peut ouvrir une nouvelle conversation et répondre.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useInboxStore } from '@/stores/inbox'
import { APP_CONFIG } from '@/config/app.config'
import KBadge from '@/components/ui/KBadge.vue'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import KChips from '@/components/ui/KChips.vue'
import KModal from '@/components/ui/KModal.vue'
import KLoader from '@/components/ui/KLoader.vue'
import ThreadConversation from '@/components/features/ThreadConversation.vue'
import { timeAgo } from '@/utils/format'
import { THREAD_TONE, KIND_TONE } from '@/utils/status'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const inbox = useInboxStore()

const threads = ref(null)
const filter = ref('all')
const current = ref(null)
const sending = ref(false)
const compose = ref(false)
const form = ref({ kind: 'support', subject: '', text: '' })

const load = async () => { threads.value = await api.messaging.listMine(auth.user.id) }
onMounted(async () => {
  await load()
  const id = route.params.id || threads.value[0]?.id
  if (id) open(threads.value.find((x) => x.id === id) ?? threads.value[0])
})

const filtered = computed(() => (threads.value ?? []).filter((x) => filter.value === 'all' || (filter.value === 'open' ? x.status !== 'closed' : x.status === 'closed')))
const KINDS = APP_CONFIG.messaging.kinds.filter((k) => k !== 'manu')

async function open(th) {
  if (!th) return
  current.value = th
  router.replace({ name: 'fellow-inbox', params: { id: th.id } })
  if (th.unreadFellow) {
    await api.messaging.markRead(th.id, 'fellow')
    th.unreadFellow = 0
    inbox.refresh('fellow')
  }
}
async function send({ text }) {
  sending.value = true
  try {
    const updated = await api.messaging.post(current.value.id, { from: 'fellow', authorId: auth.user.id, author: auth.user.name, text })
    Object.assign(current.value, { ...updated, messages: updated.messages.filter((m) => !m.internal) })
  } finally { sending.value = false }
}
async function create() {
  if (!form.value.subject.trim() || form.value.text.trim().length < 5) return
  sending.value = true
  try {
    const th = await api.messaging.create({ userId: auth.user.id, ...form.value })
    threads.value.unshift(th)
    compose.value = false
    form.value = { kind: 'support', subject: '', text: '' }
    open(th)
    ui.toast(t('inbox.created'), { type: 'success' })
  } finally { sending.value = false }
}
watch(filter, () => { if (current.value && !filtered.value.includes(current.value)) open(filtered.value[0]) })
</script>

<template>
  <div class="msgs">
    <header class="head">
      <div>
        <span class="eyebrow">{{ $t('inbox.eyebrow') }}</span>
        <h1>{{ $t('inbox.title') }}</h1>
        <p class="text-muted">{{ $t('inbox.lead', { h: APP_CONFIG.messaging.slaHours }) }}</p>
      </div>
      <KButton @click="compose = true">{{ $t('inbox.new') }}</KButton>
    </header>

    <KLoader v-if="!threads" />
    <div v-else class="layout" :class="{ 'has-current': current }">
      <aside class="list wood-panel">
        <div class="tabs">
          <button v-for="f in ['all', 'open', 'closed']" :key="f" type="button" :class="{ on: filter === f }" @click="filter = f">{{ $t(`inbox.filters.${f}`) }}</button>
        </div>
        <ul>
          <li v-for="th in filtered" :key="th.id" :class="{ on: current?.id === th.id, unread: th.unreadFellow }">
            <button type="button" @click="open(th)">
              <span class="top"><KBadge :tone="KIND_TONE[th.kind]">{{ $t(`inbox.kinds.${th.kind}`) }}</KBadge><small>{{ timeAgo(th.lastMessageAt, $i18n.locale) }}</small></span>
              <strong>{{ th.subject }}</strong>
              <span class="preview">{{ th.messages.at(-1)?.text }}</span>
              <span class="meta"><span v-if="th.assignee">{{ th.assignee }}</span><KBadge :tone="THREAD_TONE[th.status]" :dot="th.status === 'open'">{{ $t(`inbox.status.${th.status}`) }}</KBadge></span>
              <span v-if="th.unreadFellow" class="dot" />
            </button>
          </li>
          <li v-if="!filtered.length" class="empty text-muted">{{ $t('inbox.empty') }}</li>
        </ul>
      </aside>

      <section v-if="current" class="pane wood-panel">
        <header class="pane-head">
          <button type="button" class="back" @click="current = null">←</button>
          <div class="who">
            <strong>{{ current.subject }}</strong>
            <small class="text-muted">{{ current.assignee ? $t('inbox.handledBy', { name: current.assignee }) : $t('inbox.unassignedFellow') }}</small>
          </div>
          <KBadge :tone="THREAD_TONE[current.status]" :dot="current.status === 'open'">{{ $t(`inbox.status.${current.status}`) }}</KBadge>
        </header>
        <ThreadConversation :thread="current" viewer="fellow" :sending="sending" @send="send" />
      </section>
      <section v-else class="pane wood-panel empty-pane"><p class="text-muted">{{ $t('inbox.pickOne') }}</p></section>
    </div>

    <KModal :open="compose" :title="$t('inbox.new')" @close="compose = false">
      <div class="compose">
        <KField :label="$t('inbox.kindLabel')"><KChips v-model="form.kind" :options="KINDS.map((k) => ({ value: k, label: $t(`inbox.kinds.${k}`) }))" /></KField>
        <KField :label="$t('inbox.subject')" required for-id="th-subj"><input id="th-subj" v-model="form.subject" class="k-input" maxlength="90" /></KField>
        <KField :label="$t('inbox.message')" required for-id="th-txt"><textarea id="th-txt" v-model="form.text" class="k-input" rows="4" /></KField>
        <p class="text-muted small">{{ $t('inbox.composeHint') }}</p>
      </div>
      <template #footer>
        <KButton variant="ghost" :icon="false" @click="compose = false">{{ $t('common.close') }}</KButton>
        <KButton :loading="sending" :disabled="!form.subject.trim() || form.text.trim().length < 5" @click="create">{{ $t('inbox.send') }}</KButton>
      </template>
    </KModal>
  </div>
</template>

<style scoped lang="scss">
.msgs { display: grid; gap: 1.25rem; }
.head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; h1 { margin: 0 0 .3rem; } p { margin: 0; } }
.layout { display: grid; gap: 1rem; @include md-down { .empty-pane { display: none; } } @include lg-up { grid-template-columns: 360px 1fr; align-items: stretch; min-height: 560px; } }
@include md-down { .layout.has-current .list { display: none; } }
.list { overflow: hidden; display: flex; flex-direction: column;
  ul { list-style: none; padding: 0; margin: 0; overflow-y: auto; max-height: 70vh; }
  li button { width: 100%; text-align: start; background: none; border: 0; border-bottom: 1px solid var(--kec-border); padding: .9rem 1rem; color: var(--kec-ivory); display: grid; gap: .3rem; position: relative; &:hover { background: rgba(255,255,255,.03); } }
  li.on button { background: rgba(214,165,72,.1); box-shadow: inset 3px 0 0 var(--kec-gold); }
  li.unread strong { color: var(--kec-gold-soft); }
  .top { display: flex; justify-content: space-between; align-items: center; small { font-size: .7rem; color: var(--kec-text-muted); } }
  strong { font-size: .95rem; line-height: 1.3; }
  .preview { font-size: .8rem; color: var(--kec-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .meta { display: flex; justify-content: space-between; align-items: center; font-size: .74rem; color: var(--kec-gold-soft); }
  .dot { position: absolute; inset-inline-end: 1rem; top: 2.9rem; width: 9px; height: 9px; border-radius: 50%; background: var(--kec-laterite); box-shadow: 0 0 0 3px rgba(168,64,31,.25); }
  .empty { padding: 1.5rem; text-align: center; } }
.tabs { display: flex; gap: .3rem; padding: .75rem; border-bottom: 1px solid var(--kec-border);
  button { flex: 1; background: none; border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .4rem; border-radius: 999px; font-size: .78rem; font-weight: 700; &.on { background: var(--kec-cowrie); color: #2a1a12; border-color: transparent; } } }
.pane { display: flex; flex-direction: column; overflow: hidden; min-height: 480px; }
.pane-head { display: flex; align-items: center; gap: .8rem; padding: .9rem 1rem; border-bottom: 1px solid var(--kec-border);
  .who { flex: 1; display: flex; flex-direction: column; min-width: 0; strong { font-family: var(--font-display); font-size: 1.05rem; } small { font-size: .76rem; } } }
.back { background: none; border: 0; color: var(--kec-gold); font-size: 1.2rem; @include lg-up { display: none; } }
.empty-pane { display: grid; place-items: center; p { margin: 0; } }
.compose { display: grid; gap: 1rem; } .small { font-size: .8rem; margin: 0; }
</style>

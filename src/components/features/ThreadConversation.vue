
<script setup>
/**
 * Fil de conversation (messagerie) partagé entre l'espace fellow et le back-office.
 * - Bulles par auteur : fellow / équipe / Manu AI / système
 * - Notes internes (équipe uniquement) sur fond ambré
 * - Séparateurs de jour, composer avec réponses types (équipe)
 */
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import ManuAvatar from '@/components/assistant/ManuAvatar.vue'
import KButton from '@/components/ui/KButton.vue'
import { formatDate, formatTime, initials } from '@/utils/format'

const props = defineProps({
  thread: { type: Object, required: true },
  /** 'fellow' | 'staff' : détermine le côté des bulles et les options du composer */
  viewer: { type: String, default: 'fellow' },
  canned: { type: Array, default: () => [] },
  sending: Boolean
})
const emit = defineEmits(['send'])
const { locale } = useI18n()
const draft = ref('')
const internal = ref(false)
const scroller = ref(null)

/** Messages groupés par jour */
const groups = computed(() => {
  const out = []
  for (const m of props.thread.messages) {
    const day = m.at.slice(0, 10)
    if (!out.length || out.at(-1).day !== day) out.push({ day, items: [] })
    out.at(-1).items.push(m)
  }
  return out
})
const mine = (m) => (props.viewer === 'fellow' ? m.from === 'fellow' : m.from === 'staff')

function submit() {
  const text = draft.value.trim()
  if (!text) return
  emit('send', { text, internal: internal.value })
  draft.value = ''
  internal.value = false
}
function useCanned(c) {
  draft.value = c.text.replace('{name}', (props.thread.fellowName ?? '').split(' ')[0])
}
watch(() => props.thread.messages.length, async () => { await nextTick(); scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' }) }, { immediate: true })
</script>

<template>
  <div class="conv">
    <div ref="scroller" class="stream">
      <template v-for="g in groups" :key="g.day">
        <div class="day"><span>{{ formatDate(g.day, locale, { weekday: 'long', day: 'numeric', month: 'long' }) }}</span></div>
        <div v-for="m in g.items" :key="m.id" class="row" :class="[`from-${m.from}`, { mine: mine(m), internal: m.internal }]">
          <span v-if="m.from === 'manu'" class="ava"><ManuAvatar :size="30" /></span>
          <span v-else-if="m.from !== 'system'" class="ava ini" :class="m.from">{{ initials(m.author) }}</span>
          <div class="bubble">
            <header v-if="m.from !== 'system'"><strong>{{ m.author }}</strong><small>{{ formatTime(m.at, locale) }}</small><em v-if="m.internal">{{ $t('inbox.internalNote') }}</em></header>
            <p>{{ m.text }}</p>
            <small v-if="m.from === 'system'" class="sys-time">{{ formatTime(m.at, locale) }}</small>
          </div>
        </div>
      </template>
    </div>

    <form v-if="thread.status !== 'closed' || viewer === 'staff'" class="composer" @submit.prevent="submit">
      <div v-if="viewer === 'staff' && canned.length" class="canned">
        <button v-for="c in canned" :key="c.id" type="button" @click="useCanned(c)">{{ c.label }}</button>
      </div>
      <textarea v-model="draft" class="k-input" rows="2" :placeholder="internal ? $t('inbox.notePh') : $t('inbox.replyPh')" @keydown.enter.ctrl.prevent="submit" @keydown.enter.meta.prevent="submit" />
      <div class="actions">
        <label v-if="viewer === 'staff'" class="int"><input v-model="internal" type="checkbox" /> {{ $t('inbox.internalNote') }}</label>
        <span v-else class="hint text-muted">{{ $t('inbox.hint') }}</span>
        <KButton type="submit" size="sm" :variant="internal ? 'wood' : 'cowrie'" :icon="!internal" :loading="sending" :disabled="!draft.trim()">{{ internal ? $t('inbox.addNote') : $t('inbox.send') }}</KButton>
      </div>
    </form>
    <p v-else class="closed text-muted">{{ $t('inbox.closedNotice') }}</p>
  </div>
</template>

<style scoped lang="scss">
.conv { display: flex; flex-direction: column; min-height: 0; height: 100%; }
.stream { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: .7rem; min-height: 240px; @include clay-grain(.06); }
.day { display: flex; align-items: center; gap: .75rem; margin: .5rem 0; font-size: .72rem; color: var(--kec-text-muted); text-transform: capitalize;
  &::before, &::after { content: ''; flex: 1; height: 1px; background: var(--kec-border); } }
.row { display: flex; gap: .6rem; align-items: flex-end; max-width: 86%; &.mine { align-self: flex-end; flex-direction: row-reverse; } &.from-system { align-self: center; max-width: 100%; } }
.ava { flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: .66rem; font-weight: 800; color: #2a1a12;
  &.fellow { background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548); } &.staff { background: radial-gradient(circle at 35% 30%, #f0b49b, #c0612f); color: #fff; } }
.bubble { padding: .6rem .9rem; border-radius: 16px; background: #3d2819; border: 1px solid rgba(233, 201, 131, .14); border-end-start-radius: 4px;
  header { display: flex; gap: .5rem; align-items: baseline; margin-bottom: .2rem; strong { font-size: .78rem; color: var(--kec-gold-soft); } small { font-size: .68rem; color: var(--kec-text-muted); } em { font-size: .66rem; color: #e9c983; font-style: normal; padding: 0 .4rem; border: 1px dashed rgba(233,201,131,.4); border-radius: 99px; } }
  p { margin: 0; font-size: .92rem; line-height: 1.5; white-space: pre-line; } }
.mine .bubble { background: var(--kec-cowrie); color: #2a1a12; border-end-start-radius: 16px; border-end-end-radius: 4px; header strong { color: #7a4a22; } header small { color: #7a6a52; } }
.from-manu .bubble { background: linear-gradient(135deg, #3d2819, #4a2e1c); }
.from-system .bubble { background: none; border: 1px dashed var(--kec-border); text-align: center; p { font-size: .8rem; color: var(--kec-text-muted); } .sys-time { font-size: .66rem; color: var(--kec-text-muted); } }
.internal .bubble { background: rgba(214, 165, 72, .12); border: 1px dashed rgba(214, 165, 72, .5); color: var(--kec-ivory); header strong { color: var(--kec-gold-soft); } }
.composer { border-top: 1px solid var(--kec-border); padding: .75rem 1rem; display: grid; gap: .6rem; background: rgba(20, 12, 7, .35);
  textarea { min-height: 64px; } }
.canned { display: flex; gap: .4rem; overflow-x: auto; scrollbar-width: none; &::-webkit-scrollbar { display: none; }
  button { flex-shrink: 0; background: none; border: 1px solid var(--kec-border); color: var(--kec-gold-soft); border-radius: 999px; padding: .3rem .8rem; font-size: .76rem; font-weight: 700; &:hover { background: rgba(214,165,72,.12); } } }
.actions { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.int { display: inline-flex; gap: .4rem; align-items: center; font-size: .8rem; color: var(--kec-gold-soft); font-weight: 700; cursor: pointer; }
.hint { font-size: .74rem; }
.closed { margin: 0; padding: .9rem 1rem; border-top: 1px solid var(--kec-border); font-size: .85rem; text-align: center; }
</style>

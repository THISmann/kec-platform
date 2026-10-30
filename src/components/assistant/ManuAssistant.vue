<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Manu AI — réceptionniste humanisée (widget flottant)
 * ─────────────────────────────────────────────────────────────
 * - Accueille par l'heure du jour et le prénom (si connecté).
 * - Indicateur de frappe en cauris, réponses rapides, liens vers les pages.
 * - Garde-fous visibles : pas de conseil juridique individualisé,
 *   escalade humaine signalée clairement.
 * - Voix (navigateur, sans serveur) : dictée au micro (Web Speech API,
 *   SpeechRecognition) et lecture des réponses à voix haute
 *   (speechSynthesis), dans la langue dans laquelle Manu parle.
 *   Manu détecte la langue de chaque message et répond dans cette langue.
 *   Sur un navigateur sans ces API, les boutons se désactivent proprement.
 */
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAssistantStore } from '@/stores/assistant'
import { useUiStore } from '@/stores/ui'
import { intlLocale } from '@/utils/format'
import ManuAvatar from './ManuAvatar.vue'
import CowrieShape from '@/components/brand/CowrieShape.vue'

const store = useAssistantStore()
const ui = useUiStore()
const router = useRouter()
const { t } = useI18n()
const draft = ref('')
const scroller = ref(null)
const teaser = ref(false)

/* ── Voix : micro et lecture ─────────────────────────────── */
const Recognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null
const micSupported = !!Recognition
const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
const listening = ref(false)
const voiceOn = ref((() => { try { return localStorage.getItem('kec.manuVoice') === '1' } catch { return false } })())
let recognition = null

function toggleMic() {
  if (!micSupported) { ui.toast(t('manu.micUnsupported')); return }
  if (listening.value) { recognition?.stop(); return }
  recognition = new Recognition()
  recognition.lang = intlLocale(store.speakingLocale())
  recognition.interimResults = true
  recognition.maxAlternatives = 1
  recognition.onresult = (e) => {
    const text = Array.from(e.results).map((r) => r[0].transcript).join(' ')
    draft.value = text
    if (e.results[e.results.length - 1].isFinal) { listening.value = false; submit() }
  }
  recognition.onerror = () => { listening.value = false }
  recognition.onend = () => { listening.value = false }
  listening.value = true
  window.speechSynthesis?.cancel()
  recognition.start()
}

function toggleVoice() {
  if (!ttsSupported) { ui.toast(t('manu.voiceUnsupported')); return }
  voiceOn.value = !voiceOn.value
  try { localStorage.setItem('kec.manuVoice', voiceOn.value ? '1' : '0') } catch { /* ignore */ }
  if (!voiceOn.value) window.speechSynthesis.cancel()
  else { const last = store.messages.findLast?.((m) => m.from === 'manu') ?? [...store.messages].reverse().find((m) => m.from === 'manu'); if (last) speak(last) }
}

function speak(m) {
  if (!voiceOn.value || !ttsSupported || !m?.text) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(m.text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''))
  const lang = intlLocale(m.locale ?? store.speakingLocale())
  u.lang = lang
  // Voix de la bonne langue si le système en propose une (sinon voix par défaut)
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()) && /female|femme|woman|zira|samantha|amélie|audrey|google/i.test(v.name))
    ?? synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()))
  if (voice) u.voice = voice
  u.rate = 1; u.pitch = 1.05
  synth.speak(u)
}
watch(() => store.messages.length, () => { const m = store.messages.at(-1); if (m?.from === 'manu') speak(m) })
onBeforeUnmount(() => { recognition?.abort?.(); if (ttsSupported) window.speechSynthesis.cancel() })

async function open() {
  if (swallowClick) return // on vient de la déplacer, ce n'est pas un clic
  ui.manuOpen = true
  teaser.value = false
  await store.greet()
}
function close() { ui.manuOpen = false; recognition?.stop?.(); if (ttsSupported) window.speechSynthesis.cancel() }

async function submit() {
  const text = draft.value.trim()
  if (!text) return
  draft.value = ''
  await store.send(text)
}
const quick = (qr) => store.send(qr.id, qr.label)
function go(route) {
  router.push({ name: route.name })
  close()
}

watch(() => [store.messages.length, store.typing], async () => {
  await nextTick()
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' })
})
watch(() => ui.manuOpen, (o) => { if (o) store.greet() })

// Petite bulle d'invitation après quelques secondes (une fois par session), qui se referme toute seule
onMounted(() => {
  if (sessionStorage.getItem('kec.manuTeased')) return
  setTimeout(() => {
    if (!ui.manuOpen) teaser.value = true
    sessionStorage.setItem('kec.manuTeased', '1')
    setTimeout(() => { teaser.value = false }, 9000)
  }, 6500)
})

/* ── Manu se déplace : on la prend (souris ou doigt) par son avatar, ou par l'en-tête de la fenêtre ──
   Le point d'ancrage est le coin bas-droit (distance aux bords, en px), mémorisé dans localStorage.
   Sans ancrage, la position par défaut vient du CSS (et suit le sens d'écriture). */
const POS_KEY = 'kec.manuPos'
const anchor = ref((() => { try { const a = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); return a && Number.isFinite(a.right) && Number.isFinite(a.bottom) ? a : null } catch { return null } })())
const narrow = ref(typeof window !== 'undefined' && window.matchMedia('(max-width: 599px)').matches)
const avatarSize = computed(() => (narrow.value ? 50 : 58))
const EDGE = 8
const clampAnchor = (a, w, h) => ({ right: Math.round(Math.min(Math.max(EDGE, a.right), window.innerWidth - w - EDGE)), bottom: Math.round(Math.min(Math.max(EDGE, a.bottom), window.innerHeight - h - EDGE)) })
const launcherStyle = computed(() => anchor.value ? { insetInlineEnd: 'auto', left: 'auto', right: `${anchor.value.right}px`, bottom: `${anchor.value.bottom}px` } : null)
/* La fenêtre ouverte s'aligne sur le même coin (bureau et tablette seulement : sur téléphone elle prend toute la largeur) */
const panelStyle = computed(() => {
  if (!anchor.value || narrow.value) return null
  const w = 400, h = Math.min(640, window.innerHeight - 16)
  const a = clampAnchor(anchor.value, w, h)
  return { insetInlineEnd: 'auto', left: 'auto', right: `${a.right}px`, bottom: `${a.bottom}px` }
})
let drag = null, swallowClick = false
function grab(e) {
  if (e.button != null && e.button !== 0) return
  const el = e.currentTarget.closest('.launcher, .panel') ?? e.currentTarget
  const r = el.getBoundingClientRect()
  drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, right0: window.innerWidth - r.right, bottom0: window.innerHeight - r.bottom, w: r.width, h: r.height, moved: false }
  e.currentTarget.setPointerCapture?.(e.pointerId)
}
function dragMove(e) {
  if (!drag || e.pointerId !== drag.id) return
  const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy
  if (!drag.moved && Math.hypot(dx, dy) < 6) return
  drag.moved = true
  anchor.value = clampAnchor({ right: drag.right0 - dx, bottom: drag.bottom0 - dy }, drag.w, drag.h)
  e.preventDefault()
}
function release(e) {
  if (!drag || e.pointerId !== drag.id) return
  const moved = drag.moved; drag = null
  if (!moved) return
  swallowClick = true; setTimeout(() => { swallowClick = false }, 80)
  try { localStorage.setItem(POS_KEY, JSON.stringify(anchor.value)) } catch { /* mode privé */ }
}
function resetPos() { anchor.value = null; try { localStorage.removeItem(POS_KEY) } catch { /* ignore */ } }
function onResize() {
  narrow.value = window.matchMedia('(max-width: 599px)').matches
  if (anchor.value) anchor.value = clampAnchor(anchor.value, 60, 60)
}
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <div class="manu-widget" :class="{ open: ui.manuOpen }">
    <!-- Lanceur -->
    <Transition name="pop">
      <button v-if="!ui.manuOpen" class="launcher" type="button" :style="launcherStyle" :aria-label="$t('manu.open')" :title="$t('manu.dragHint')" @click="open" @pointerdown="grab" @pointermove="dragMove" @pointerup="release" @pointercancel="release">
        <ManuAvatar :size="avatarSize" />
        <Transition name="pop">
          <span v-if="teaser" class="teaser" @click.stop="open">
            <strong>{{ $t('manu.teaserTitle') }}</strong> {{ $t('manu.teaser') }}
          </span>
        </Transition>
      </button>
    </Transition>

    <!-- Fenêtre de conversation -->
    <Transition name="panel">
      <section v-if="ui.manuOpen" class="panel" :class="{ moved: !!anchor }" :style="panelStyle" role="dialog" :aria-label="$t('manu.title')">
        <header class="head" :title="$t('manu.dragHint')" @pointerdown="grab" @pointermove="dragMove" @pointerup="release" @pointercancel="release" @dblclick="resetPos">
          <ManuAvatar :size="46" />
          <div class="who">
            <strong>Manu AI</strong>
            <span>{{ $t('manu.role') }}</span>
          </div>
          <button class="icon" type="button" :class="{ on: voiceOn }" :disabled="!ttsSupported" :title="ttsSupported ? (voiceOn ? $t('manu.voiceOff') : $t('manu.voiceOn')) : $t('manu.voiceUnsupported')" :aria-pressed="voiceOn" @click="toggleVoice">{{ voiceOn ? '🔊' : '🔈' }}</button>
          <button class="icon" type="button" :title="$t('manu.restart')" @click="store.reset(); store.greet()">↻</button>
          <button class="icon" type="button" :aria-label="$t('common.close')" @click="close">✕</button>
        </header>

        <div ref="scroller" class="thread">
          <TransitionGroup name="msg">
            <div v-for="m in store.messages" :key="m.id" class="msg" :class="`from-${m.from}`">
              <p>{{ m.text }}</p>
              <div v-if="m.escalated" class="escalated">🤝🏾 {{ $t('manu.escalated') }}</div>
              <button v-if="m.route" class="route" type="button" @click="go(m.route)">{{ m.route.label }} →</button>
              <div v-if="m.quickReplies?.length && m === store.messages.at(-1)" class="qr">
                <button v-for="q in m.quickReplies" :key="q.id" type="button" @click="quick(q)">{{ q.label }}</button>
              </div>
            </div>
          </TransitionGroup>
          <div v-if="store.typing" class="msg from-manu typing" :aria-label="$t('manu.typing')">
            <CowrieShape v-for="i in 3" :key="i" :size="9" />
          </div>
        </div>

        <form class="composer" @submit.prevent="submit">
          <button class="mic" type="button" :class="{ on: listening }" :disabled="!micSupported || store.typing" :title="micSupported ? (listening ? $t('manu.micStop') : $t('manu.mic')) : $t('manu.micUnsupported')" :aria-label="listening ? $t('manu.micStop') : $t('manu.mic')" :aria-pressed="listening" @click="toggleMic">🎤</button>
          <input v-model="draft" class="k-input" :placeholder="listening ? $t('manu.listening') : $t('manu.placeholder')" :aria-label="$t('manu.placeholder')" maxlength="500" />
          <button class="send" type="submit" :disabled="!draft.trim() || store.typing" :aria-label="$t('manu.send')">➤</button>
        </form>
        <p class="disclaimer">{{ $t('manu.disclaimer') }}</p>
      </section>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.manu-widget { position: fixed; z-index: 150; /* au-dessus de l'en-tête (100) : Manu peut être déplacée tout en haut */ inset-inline-end: .9rem; bottom: 5.4rem; @include md-up { inset-inline-end: 1.5rem; bottom: 6rem; } }
.launcher {
  position: relative; background: none; border: 0; padding: 0; border-radius: 50%;
  touch-action: none; cursor: grab; /* on peut la prendre et la déplacer */
  &[style] { position: fixed; } /* déplacée : ancrée sur ses propres coordonnées */
  &:active { cursor: grabbing; }
  animation: float 4s ease-in-out infinite;
  &::before { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1px solid rgba(214, 165, 72, .5); animation: ring 2.8s ease-out infinite; }
}
@keyframes float { 50% { transform: translateY(-5px); } }
@keyframes ring { from { transform: scale(.9); opacity: 1; } to { transform: scale(1.35); opacity: 0; } }
.teaser {
  position: absolute; inset-inline-end: calc(100% + .8rem); bottom: .5rem; width: min(230px, calc(100vw - 110px)); text-align: start;
  padding: .75rem .9rem; border-radius: 16px 16px 4px 16px; font-size: .84rem; line-height: 1.4;
  background: var(--kec-ivory); color: #2a1a12; box-shadow: var(--shadow-soft);
  strong { display: block; font-family: var(--font-display); font-size: 1rem; }
}

.panel {
  position: fixed; inset: auto .5rem .5rem .5rem; height: min(640px, calc(100dvh - 1rem));
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: 24px; border: 1px solid rgba(214, 165, 72, .35);
  background: linear-gradient(180deg, #2f1e13, #1d130c);
  box-shadow: 0 30px 80px -20px #000;
  @include sm-up { inset: auto; inset-inline-end: 1.5rem; bottom: 1.5rem; width: 400px; }
}
.head {
  display: flex; align-items: center; gap: .8rem; padding: .9rem 1rem; user-select: none;
  @include sm-up { touch-action: none; cursor: grab; &:active { cursor: grabbing; } }
  background-color: var(--kec-walnut-deep); @include wood-grain(.5);
  border-bottom: 1px solid var(--kec-border);
}
.who { flex: 1; display: flex; flex-direction: column; line-height: 1.2; strong { font-family: var(--font-display); font-size: 1.15rem; } span { font-size: .76rem; color: #a9c77a; } }
.icon { background: rgba(255,255,255,.05); border: 0; color: var(--kec-ivory); width: 34px; height: 34px; border-radius: 50%; &:hover { background: rgba(255,255,255,.12); } &.on { background: rgba(214,165,72,.25); box-shadow: 0 0 0 1px var(--kec-gold) inset; } &:disabled { opacity: .35; } }

.thread { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: .7rem; @include clay-grain(.08); }
.msg { max-width: 88%; display: flex; flex-direction: column; gap: .5rem; }
.msg p { margin: 0; padding: .7rem .95rem; border-radius: 18px; font-size: .9rem; line-height: 1.5; white-space: pre-line; }
.msg.from-manu { align-self: flex-start; p { background: #3d2819; border: 1px solid rgba(233, 201, 131, .14); border-end-start-radius: 4px; } }
.msg.from-user { align-self: flex-end; p { background: var(--kec-cowrie); color: #2a1a12; border-end-end-radius: 4px; } }
.typing { flex-direction: row; gap: 4px; padding: .8rem 1rem; background: #3d2819; border-radius: 18px; :deep(svg) { animation: hop 1s infinite; } :deep(svg:nth-child(2)) { animation-delay: .15s; } :deep(svg:nth-child(3)) { animation-delay: .3s; } }
@keyframes hop { 30% { transform: translateY(-5px) rotate(20deg); } }
.escalated { font-size: .78rem; color: var(--kec-gold-soft); padding: .4rem .7rem; border: 1px dashed rgba(214,165,72,.4); border-radius: 10px; }
.route { align-self: flex-start; background: none; border: 1px solid var(--kec-gold); color: var(--kec-gold-soft); padding: .45rem .9rem; border-radius: 999px; font-size: .82rem; font-weight: 700; &:hover { background: rgba(214,165,72,.12); } }
.qr { display: flex; flex-wrap: wrap; gap: .4rem; button { background: rgba(239,227,201,.08); border: 1px solid rgba(239,227,201,.25); color: var(--kec-ivory); padding: .4rem .75rem; border-radius: 999px; font-size: .8rem; &:hover { background: var(--kec-cowrie); color: #2a1a12; } } }

.composer { display: flex; gap: .5rem; padding: .75rem; border-top: 1px solid var(--kec-border); .k-input { border-radius: 999px; padding: .7rem 1.1rem; } }
.mic { flex-shrink: 0; width: 42px; border-radius: 50%; border: 1px solid var(--kec-border); background: rgba(255,255,255,.04); font-size: 1rem; transition: all .3s var(--ease-out);
  &.on { background: #b9391f; border-color: #f0c08a; animation: pulse 1.2s ease-in-out infinite; } &:disabled { opacity: .35; } }
@keyframes pulse { 50% { box-shadow: 0 0 0 8px rgba(185, 57, 31, .25); } }
.send { flex-shrink: 0; width: 46px; border-radius: 50%; border: 0; color: #2a1a12; background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548); font-size: 1rem; &:disabled { opacity: .4; } }
.disclaimer { margin: 0; padding: 0 1rem .7rem; font-size: .68rem; color: var(--kec-text-muted); text-align: center; }

.pop-enter-active, .pop-leave-active { transition: all .4s var(--ease-spring); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(.6); }
.panel-enter-active, .panel-leave-active { transition: all .45s var(--ease-spring); transform-origin: bottom; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: translateY(20px) scale(.92); }
.msg-enter-active { transition: all .4s var(--ease-out); }
.msg-enter-from { opacity: 0; transform: translateY(10px); }
</style>

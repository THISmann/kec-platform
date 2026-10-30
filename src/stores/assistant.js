/**
 * Store de la conversation avec Manu AI.
 * La conversation survit à la navigation (et au rechargement, via sessionStorage).
 * Dégradation gracieuse : si l'assistant est indisponible, un message
 * propose le contact humain — le parcours ne dépend jamais de l'IA (§7).
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { api } from '@/services'
import { i18n } from '@/i18n'
import { useAuthStore } from './auth'

const KEY = 'kec.manu'

export const useAssistantStore = defineStore('assistant', () => {
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem(KEY)) } catch { return null } })()
  const messages = ref(saved?.messages ?? [])
  // sessionId : regroupe les échanges d'une même visite dans le journal Manu (rapport back-office)
  const state = ref(saved?.state ?? { misses: 0, sessionId: `s_${Date.now().toString(36)}` })
  const typing = ref(false)
  const unread = ref(0)

  watch([messages, state], () => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ messages: messages.value.slice(-40), state: state.value })) } catch { /* ignore */ }
  }, { deep: true })

  const push = (from, payload) => messages.value.push({ id: `${Date.now()}${Math.random()}`, from, at: new Date().toISOString(), ...payload })

  // Changement de langue de l'interface : Manu suit, jusqu'au prochain message écrit dans une autre langue
  watch(() => i18n.global.locale.value, () => { state.value = { ...state.value, replyLocale: null } })
  /** Langue dans laquelle Manu parle en ce moment (pour le micro et la voix) */
  const speakingLocale = () => state.value.replyLocale ?? i18n.global.locale.value

  async function greet() {
    if (messages.value.length) return
    const auth = useAuthStore()
    typing.value = true
    try {
      const reply = await api.assistant.welcome({ locale: i18n.global.locale.value, name: auth.user?.name?.split(' ')[0] ?? '' })
      push('manu', reply)
    } finally { typing.value = false }
  }

  async function send(text, label = null) {
    if (!text?.trim()) return
    const auth = useAuthStore()
    push('user', { text: label ?? text })
    typing.value = true
    try {
      const { reply, state: next } = await api.assistant.send({
        message: text,
        state: { ...state.value, locale: i18n.global.locale.value, name: auth.user?.name?.split(' ')[0] ?? '' },
        transcript: messages.value.slice(-10).map((m) => ({ from: m.from, text: m.text })),
        userName: auth.user?.name ?? 'Visiteur',
        userId: auth.user?.role === 'fellow' ? auth.user.id : null,
        page: typeof location !== 'undefined' ? location.pathname : ''
      })
      state.value = next
      push('manu', reply)
    } catch {
      push('manu', { text: i18n.global.t('manu.unavailable'), quickReplies: [], escalated: true })
    } finally {
      typing.value = false
    }
  }

  function reset() { messages.value = []; state.value = { misses: 0, sessionId: `s_${Date.now().toString(36)}` } }

  return { messages, typing, unread, greet, send, reset, speakingLocale }
})

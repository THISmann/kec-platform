/**
 * Compteur de messages non lus (badge de navigation), pour le fellow
 * comme pour l'équipe. Rafraîchi à l'ouverture d'un espace et après
 * chaque action de messagerie.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services'
import { useAuthStore } from './auth'

export const useInboxStore = defineStore('inbox', () => {
  const unread = ref(0)
  const space = ref('fellow')

  async function refresh(which = space.value) {
    space.value = which
    const auth = useAuthStore()
    if (!auth.user) return
    try {
      if (which === 'fellow') {
        const threads = await api.messaging.listMine(auth.user.id)
        unread.value = threads.reduce((s, t) => s + (t.unreadFellow ?? 0), 0)
      } else {
        const threads = await api.messaging.listAll({ status: 'open' })
        unread.value = threads.reduce((s, t) => s + (t.unreadStaff ?? 0), 0)
      }
    } catch { unread.value = 0 }
  }

  return { unread, refresh }
})

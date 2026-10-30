/**
 * Store d'authentification.
 * Rôles : 'fellow' (les 110), 'staff' (équipe KEC), 'investor' (Kia).
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services'
import { tokenStorage } from '@/services/http/tokenStorage'

export const HOME_BY_ROLE = { fellow: 'fellow-dashboard', staff: 'bo-overview', investor: 'kia-dashboard' }

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const restored = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const role = computed(() => user.value?.role ?? null)

  /** Droit du membre d'équipe connecté (gestion des rôles). Les fellows/investisseurs n'ont aucun droit back-office. */
  const can = (permission) => (user.value?.permissions ?? []).includes(permission)
  /** Identité courte passée aux services pour le journal d'audit */
  const actor = computed(() => (user.value ? { id: user.value.id, name: user.value.name } : null))

  async function login(credentials) {
    const { token, user: u } = await api.auth.login(credentials)
    tokenStorage.set(token)
    user.value = u
    return u
  }

  /** Restaure la session au démarrage (appelé par le guard du routeur) */
  async function restore() {
    if (restored.value) return
    restored.value = true
    const token = tokenStorage.get()
    if (!token) return
    try { user.value = await api.auth.me(token) } catch { tokenStorage.clear() }
  }

  async function logout() {
    try { await api.auth.logout() } finally {
      tokenStorage.clear()
      user.value = null
    }
  }

  return { user, role, isAuthenticated, can, actor, login, logout, restore }
})

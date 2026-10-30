/**
 * Store d'interface : notifications (toasts), pluie de cauris,
 * barre consultant, ouverture de Manu.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

let toastId = 0

export const useUiStore = defineStore('ui', () => {
  const toasts = ref([])
  const rainRequest = ref(0) // incrémenté pour déclencher une averse de cauris
  const rainAmount = ref(60)
  const manuOpen = ref(false)
  const consultantBarDismissed = ref(false)
  const consultOpen = ref(false) // carte « Que pouvons-nous faire pour vous ? »
  const cowriesSettle = ref(false) // true sur l'accueil et la salle d'attente : les cauris s'entassent en bas

  function toast(message, { type = 'info', timeout = 4200, icon = null } = {}) {
    const id = ++toastId
    toasts.value.push({ id, message, type, icon })
    if (timeout) setTimeout(() => dismiss(id), timeout)
    return id
  }
  const dismiss = (id) => { toasts.value = toasts.value.filter((t) => t.id !== id) }

  /** 🐚 Déclenche une pluie de cauris (célébration) */
  function rainCowries(amount = 60) {
    rainAmount.value = amount
    rainRequest.value++
  }

  return { toasts, toast, dismiss, rainRequest, rainAmount, rainCowries, manuOpen, consultantBarDismissed, consultOpen, cowriesSettle }
})

<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  « Que pouvons-nous faire pour vous ? » : demande de consultation
 * ─────────────────────────────────────────────────────────────
 * Carte en bois (même panneau que la page de connexion) ouverte à TOUT
 * visiteur, sans compte ni paiement préalable : le visiteur décrit son
 * besoin et laisse ses coordonnées ; la demande arrive dans la messagerie
 * de l'équipe (fil « Demande de consultation », statut à traiter), qui
 * rappelle sous 24 h ouvrées. Un fellow connecté est envoyé vers la
 * réservation directe (créneau + paiement).
 */
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { RESIDENCE_COUNTRIES } from '@/config/geo'
import KModal from '@/components/ui/KModal.vue'
import KField from '@/components/ui/KField.vue'
import KButton from '@/components/ui/KButton.vue'
import KChips from '@/components/ui/KChips.vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const { t, locale } = useI18n()
const ui = useUiStore()
const auth = useAuthStore()

const blank = () => ({ name: '', country: '', phone: '', email: '', need: '', channel: 'whatsapp', consent: false })
const form = reactive(blank())
const errors = reactive({})
const sending = ref(false)
const done = ref(null)

watch(() => props.open, (o) => {
  if (!o) return
  Object.assign(form, blank(), { name: auth.user?.name ?? '', email: auth.user?.email ?? '', phone: auth.user?.phone ?? '', country: auth.user?.residenceCountry ?? '' })
  Object.keys(errors).forEach((k) => delete errors[k])
  done.value = null
})

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name.trim()) errors.name = t('validation.required')
  if (!form.phone.trim() && !form.email.trim()) errors.phone = t('validation.required')
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t('validation.email')
  if (form.need.trim().length < 10) errors.need = t('kopen.tooShort')
  if (!form.consent) errors.consent = t('validation.consent')
  return !Object.keys(errors).length
}

async function submit() {
  if (!validate()) return
  sending.value = true
  try {
    const res = await api.consultation.request({ ...form, locale: locale.value, userId: auth.user?.id ?? null, page: typeof location !== 'undefined' ? location.pathname : '' })
    done.value = res
    ui.rainCowries(18)
  } catch {
    errors.need = t('errors.generic')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <KModal :open="open" :title="$t('consultant.request.title')" @close="emit('close')">
    <Transition name="fade" mode="out-in">
      <div v-if="done" class="thanks" role="status">
        <strong>{{ $t('consultant.request.sentTitle', { name: form.name.split(' ')[0] }) }}</strong>
        <p>{{ $t('consultant.request.sent', { channel: $t(`consultant.request.channels.${form.channel}`), ref: done.reference }) }}</p>
      </div>
      <form v-else class="stack" novalidate @submit.prevent="submit">
        <p class="lead">{{ $t('consultant.request.lead') }}</p>
        <p v-if="auth.role === 'fellow'" class="fellow text-muted">
          {{ $t('consultant.request.fellowHint') }}
          <RouterLink :to="{ name: 'fellow-consultant' }" @click="emit('close')">{{ $t('consultant.request.book') }} →</RouterLink>
        </p>
        <div class="two">
          <KField :label="$t('consultant.request.name')" required :error="errors.name" for-id="cr-name"><input id="cr-name" v-model="form.name" class="k-input" autocomplete="name" /></KField>
          <KField :label="$t('consultant.request.country')" for-id="cr-country">
            <input id="cr-country" v-model="form.country" class="k-input" list="cr-countries" autocomplete="country-name" />
            <datalist id="cr-countries"><option v-for="c in RESIDENCE_COUNTRIES" :key="c" :value="c" /></datalist>
          </KField>
        </div>
        <div class="two">
          <KField :label="$t('consultant.request.phone')" required :error="errors.phone" for-id="cr-phone"><input id="cr-phone" v-model="form.phone" class="k-input" type="tel" autocomplete="tel" /></KField>
          <KField :label="$t('consultant.request.email')" :error="errors.email" for-id="cr-email"><input id="cr-email" v-model="form.email" class="k-input" type="email" autocomplete="email" /></KField>
        </div>
        <KField :label="$t('consultant.request.need')" required :error="errors.need" for-id="cr-need">
          <textarea id="cr-need" v-model="form.need" class="k-input" rows="4" maxlength="1500" :placeholder="$t('consultant.request.needPh')" />
        </KField>
        <KField :label="$t('consultant.request.channel')">
          <KChips v-model="form.channel" :name="$t('consultant.request.channel')" :options="['whatsapp', 'call', 'email'].map((c) => ({ value: c, label: $t(`consultant.request.channels.${c}`) }))" />
        </KField>
        <KField :error="errors.consent">
          <label class="consent"><input v-model="form.consent" type="checkbox" /> {{ $t('consultant.request.consent') }}</label>
        </KField>
        <p class="hint text-muted">{{ $t('consultant.request.hint') }}</p>
        <div class="foot">
          <KButton size="lg" type="submit" :loading="sending">{{ $t('consultant.request.send') }}</KButton>
        </div>
      </form>
    </Transition>
  </KModal>
</template>

<style scoped lang="scss">
.lead { margin: 0 0 .5rem; color: var(--kec-text-muted); }
.fellow { font-size: .86rem; margin: 0; padding: .6rem .8rem; border-radius: 12px; border: 1px dashed rgba(214, 165, 72, .45); a { font-weight: 700; } }
.stack { display: grid; gap: .9rem; }
.two { display: grid; gap: .9rem; @include sm-up { grid-template-columns: 1fr 1fr; } }
.consent { display: flex; gap: .6rem; align-items: flex-start; font-size: .86rem; input { margin-top: .25rem; } }
.hint { font-size: .8rem; margin: 0; }
.foot { display: flex; justify-content: flex-end; }
.thanks { padding: 1.5rem; border-radius: var(--radius); border: 1px dashed var(--kec-gold); strong { font-family: var(--font-display); font-size: 1.4rem; color: var(--kec-gold-soft); } p { margin: .5rem 0 0; } }
.fade-enter-active, .fade-leave-active { transition: opacity .35s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

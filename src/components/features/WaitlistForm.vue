<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Formulaire de la liste d'attente (3 étapes, < 3 minutes)
 * ─────────────────────────────────────────────────────────────
 * 1. Vous  — identité, contact, pays de résidence (diaspora)
 * 2. Votre projet — pays/ville de création, secteur, maturité, besoins
 * 3. Le mot de la fin — canal d'acquisition + consentements
 * Les données alimentent le CRM et la sélection des 110 (§6, §8.1).
 */
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { APP_CONFIG } from '@/config/app.config'
import { COUNTRIES, RESIDENCE_COUNTRIES } from '@/config/geo'
import KField from '@/components/ui/KField.vue'
import KChips from '@/components/ui/KChips.vue'
import KButton from '@/components/ui/KButton.vue'
import KBeadSteps from '@/components/ui/KBeadSteps.vue'

const emit = defineEmits(['joined'])
const { t, locale } = useI18n()

const step = ref(0)
const loading = ref(false)
const errors = reactive({})
const serverError = ref('')

const form = reactive({
  firstName: '', lastName: '', email: '', phone: '', residenceCountry: 'Cameroun', language: locale.value,
  targetCountry: 'CM', targetCity: '', sector: '', projectStage: '', projectSummary: '', needs: [], forWhom: 'self',
  acquisitionChannel: '', acquisitionDetail: '', consentData: false, consentMarketing: true
})

const steps = computed(() => [
  { key: 'you', label: t('waitlist.steps.you') },
  { key: 'project', label: t('waitlist.steps.project') },
  { key: 'last', label: t('waitlist.steps.last') }
])
const cities = computed(() => COUNTRIES.find((c) => c.code === form.targetCountry)?.cities ?? [])
watch(() => form.targetCountry, () => { form.targetCity = '' })

const CHANNEL_ICONS = { linkedin: 'in', wordOfMouth: '🗣', facebook: 'f', fieldAgent: '🧭', whatsapp: '✆', tiktok: '♪', instagram: '◎', event: '✦', other: '…' }
const opts = (list, ns, icons) => list.map((v) => ({ value: v, label: t(`${ns}.${v}`), icon: icons?.[v] }))

/** Validation par étape — messages traduits */
function validate(s) {
  Object.keys(errors).forEach((k) => delete errors[k])
  const req = (k) => { if (!String(form[k] ?? '').trim()) errors[k] = t('validation.required') }
  if (s === 0) {
    ;['firstName', 'lastName', 'email', 'residenceCountry'].forEach(req)
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t('validation.email')
    if (form.phone && !/^\+?[\d\s]{8,}$/.test(form.phone)) errors.phone = t('validation.phone')
  }
  if (s === 1) {
    ;['targetCountry', 'targetCity', 'sector', 'projectStage'].forEach(req)
  }
  if (s === 2) {
    req('acquisitionChannel')
    if (!form.consentData) errors.consentData = t('validation.consent')
  }
  return Object.keys(errors).length === 0
}

function next() { if (validate(step.value)) step.value++ }
function back() { step.value = Math.max(0, step.value - 1) }

async function submit() {
  if (!validate(2)) return
  loading.value = true
  serverError.value = ''
  try {
    const result = await api.waitlist.join({ ...form })
    emit('joined', result)
  } catch (e) {
    serverError.value = t(e.message || 'errors.generic')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="wl-form" novalidate @submit.prevent="step < 2 ? next() : submit()">
    <KBeadSteps :steps="steps" :current="step" clickable @go="step = $event" />

    <Transition name="step" mode="out-in">
      <!-- Étape 1 : Vous -->
      <div v-if="step === 0" key="s0" class="grid-2">
        <KField :label="$t('waitlist.firstName')" required :error="errors.firstName" for-id="wl-fn">
          <input id="wl-fn" v-model="form.firstName" class="k-input" autocomplete="given-name" />
        </KField>
        <KField :label="$t('waitlist.lastName')" required :error="errors.lastName" for-id="wl-ln">
          <input id="wl-ln" v-model="form.lastName" class="k-input" autocomplete="family-name" />
        </KField>
        <KField :label="$t('waitlist.email')" required :error="errors.email" for-id="wl-em">
          <input id="wl-em" v-model="form.email" type="email" class="k-input" autocomplete="email" inputmode="email" />
        </KField>
        <KField :label="$t('waitlist.phone')" :hint="$t('waitlist.phoneHint')" :error="errors.phone" for-id="wl-ph">
          <input id="wl-ph" v-model="form.phone" type="tel" class="k-input" placeholder="+237 6XX XXX XXX" autocomplete="tel" />
        </KField>
        <KField :label="$t('waitlist.residence')" required :error="errors.residenceCountry" for-id="wl-res">
          <select id="wl-res" v-model="form.residenceCountry" class="k-input">
            <option v-for="c in RESIDENCE_COUNTRIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </KField>
        <KField :label="$t('waitlist.language')">
          <KChips v-model="form.language" :options="APP_CONFIG.locales.filter((l) => l.enabled).map((l) => ({ value: l.code, label: l.label }))" />
        </KField>
      </div>

      <!-- Étape 2 : Votre projet -->
      <div v-else-if="step === 1" key="s1" class="stack">
        <div class="grid-2">
          <KField :label="$t('waitlist.targetCountry')" required :error="errors.targetCountry" for-id="wl-tc">
            <select id="wl-tc" v-model="form.targetCountry" class="k-input">
              <option v-for="c in COUNTRIES" :key="c.code" :value="c.code" :disabled="!c.active">
                {{ c.flag }} {{ c.name }}{{ c.active ? '' : ` — ${$t('common.soon')}` }}
              </option>
            </select>
          </KField>
          <KField :label="$t('waitlist.targetCity')" required :error="errors.targetCity" for-id="wl-city">
            <select id="wl-city" v-model="form.targetCity" class="k-input">
              <option value="" disabled>{{ $t('common.choose') }}</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
          </KField>
        </div>
        <KField :label="$t('waitlist.sector')" required :error="errors.sector">
          <KChips v-model="form.sector" :options="opts(APP_CONFIG.sectors, 'sectors')" />
        </KField>
        <KField :label="$t('waitlist.stage')" required :error="errors.projectStage">
          <KChips v-model="form.projectStage" :options="opts(['idea', 'informal', 'existing'], 'stages')" />
        </KField>
        <KField :label="$t('waitlist.summary')" :hint="$t('waitlist.summaryHint')" for-id="wl-sum">
          <textarea id="wl-sum" v-model="form.projectSummary" class="k-input" rows="3" maxlength="600" />
        </KField>
        <KField :label="$t('waitlist.needs')">
          <KChips v-model="form.needs" multiple :options="opts(APP_CONFIG.needs, 'needs')" />
        </KField>
        <KField v-if="form.residenceCountry !== 'Cameroun'" :label="$t('waitlist.forWhom')">
          <KChips v-model="form.forWhom" :options="opts(['self', 'relative'], 'waitlist.forWhomOptions')" />
        </KField>
      </div>

      <!-- Étape 3 : Le mot de la fin -->
      <div v-else key="s2" class="stack">
        <KField :label="$t('waitlist.channel')" required :error="errors.acquisitionChannel">
          <KChips v-model="form.acquisitionChannel" :options="opts(APP_CONFIG.acquisitionChannels, 'acquisition', CHANNEL_ICONS)" />
        </KField>
        <KField
          v-if="['fieldAgent', 'other', 'event', 'wordOfMouth'].includes(form.acquisitionChannel)"
          :label="$t(`waitlist.channelDetail.${form.acquisitionChannel}`)" for-id="wl-cd"
        >
          <input id="wl-cd" v-model="form.acquisitionDetail" class="k-input" />
        </KField>
        <label class="check" :class="{ err: errors.consentData }">
          <input v-model="form.consentData" type="checkbox" />
          <span>{{ $t('waitlist.consentData') }}</span>
        </label>
        <label class="check">
          <input v-model="form.consentMarketing" type="checkbox" />
          <span>{{ $t('waitlist.consentMarketing') }}</span>
        </label>
        <p v-if="errors.consentData" class="k-field__error">{{ errors.consentData }}</p>
        <p v-if="serverError" class="k-field__error" role="alert">{{ serverError }}</p>
      </div>
    </Transition>

    <div class="nav">
      <KButton v-if="step > 0" variant="ghost" :icon="false" @click="back">← {{ $t('common.back') }}</KButton>
      <span v-else />
      <KButton v-if="step < 2" type="submit" variant="wood" :icon="false">{{ $t('common.next') }} →</KButton>
      <KButton v-else type="submit" :loading="loading">{{ $t('waitlist.submit') }}</KButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.grid-2 { display: grid; gap: 1.1rem; grid-template-columns: 1fr; @include sm-up { grid-template-columns: 1fr 1fr; } }
.stack > * + * { margin-top: 1.2rem; }
.nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; gap: 1rem; }
.check {
  display: flex; gap: .75rem; align-items: flex-start; font-size: .88rem; color: var(--kec-text-muted); cursor: pointer;
  input { margin-top: .25rem; accent-color: var(--kec-gold); width: 18px; height: 18px; flex-shrink: 0; }
  &.err { color: #f08a6e; }
}
.step-enter-active, .step-leave-active { transition: all .35s var(--ease-out); }
.step-enter-from { opacity: 0; transform: translateX(24px); }
.step-leave-to { opacity: 0; transform: translateX(-24px); }
</style>

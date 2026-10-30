<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Mon entreprise — parcours guidé de création (5 étapes)
 * ─────────────────────────────────────────────────────────────
 * 1. Pays & ville
 * 2. Forme juridique + DEVIS TOTAL (affiché avant toute donnée sensible, §5/§13)
 * 3. Formulaire dédié (données pour la rédaction des documents)
 * 4. Pièces justificatives (téléversement)
 * 5. Récapitulatif et envoi à l'équipe
 * Le brouillon est enregistré à chaque étape.
 * Une fois le dossier envoyé, la page affiche la FICHE détaillée du dossier
 * (CompanyDossierCard) ; le formulaire ne revient qu'en mode « modifier ».
 */
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { APP_CONFIG } from '@/config/app.config'
import { COUNTRIES } from '@/config/geo'
import KBeadSteps from '@/components/ui/KBeadSteps.vue'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import KChips from '@/components/ui/KChips.vue'
import KBadge from '@/components/ui/KBadge.vue'
import KLoader from '@/components/ui/KLoader.vue'
import CountryCityPicker from '@/components/features/CountryCityPicker.vue'
import DocumentUploader from '@/components/features/DocumentUploader.vue'
import CompanyDossierCard from '@/components/features/CompanyDossierCard.vue'
import { formatXaf, formatDate } from '@/utils/format'
import { DOSSIER_TONE } from '@/utils/status'

const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()

const step = ref(0)
const editing = ref(false) // mode formulaire forcé sur un dossier déjà envoyé
const company = ref(null)
const documents = ref([])
const quote = ref(null)
const loading = ref(true)
const saving = ref(false)
const errors = reactive({})

const form = reactive({
  country: 'CM', city: '', legalForm: '', companyName: '', activity: '', sector: '', subSector: '',
  address: '', capitalXaf: 100000, manager: auth.user.name, employees: 1, revenueBracket: '0-10M',
  partners: [{ name: auth.user.name, share: 100 }], needs: [],
  payerIsBeneficiary: true, payerName: '', payerRelation: ''
})

const steps = computed(() => ['place', 'form', 'details', 'docs', 'review'].map((k) => ({ key: k, label: t(`company.steps.${k}`) })))
const shareTotal = computed(() => form.partners.reduce((s, p) => s + Number(p.share || 0), 0))
const countryName = computed(() => COUNTRIES.find((c) => c.code === form.country)?.name)
const showCard = computed(() => company.value && company.value.status !== 'draft' && company.value.submittedAt && !editing.value)
function startEdit() { editing.value = true; step.value = 2 }

onMounted(async () => {
  company.value = await api.company.getMine(auth.user.id)
  if (company.value?.form) Object.assign(form, company.value.form)
  if (company.value) documents.value = await api.vault.list(company.value.id)
  loading.value = false
})

// Devis recalculé quand la forme ou le capital change
watch(() => [form.legalForm, form.capitalXaf], async () => {
  if (!form.legalForm) return
  quote.value = await api.company.quote({ legalForm: form.legalForm, capitalXaf: Number(form.capitalXaf) || 0 })
}, { immediate: true })

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (step.value === 0 && !form.city) errors.city = t('validation.city')
  if (step.value === 1 && !form.legalForm) errors.legalForm = t('validation.legalForm')
  if (step.value === 2) {
    ;['companyName', 'activity', 'address', 'manager'].forEach((k) => { if (!String(form[k]).trim()) errors[k] = t('validation.required') })
    if (form.legalForm !== 'ei' && shareTotal.value !== 100) errors.partners = t('validation.shares', { n: shareTotal.value })
    if (!form.payerIsBeneficiary && !form.payerName) errors.payerName = t('validation.required')
  }
  if (Object.keys(errors).length) ui.toast(Object.values(errors)[0], { type: 'error' })
  return !Object.keys(errors).length
}

async function next() {
  if (!validate()) return
  saving.value = true
  try {
    company.value = await api.company.saveDraft(auth.user.id, { ...form })
    step.value++
  } finally { saving.value = false }
}

async function submit() {
  saving.value = true
  try {
    company.value = await api.company.submit(auth.user.id, { ...form })
    editing.value = false
    step.value = 0
    ui.rainCowries(90)
    ui.toast(t('company.submitted'), { type: 'success' })
  } finally { saving.value = false }
}

const addPartner = () => form.partners.push({ name: '', share: 0 })
const removePartner = (i) => form.partners.splice(i, 1)
const onUploaded = (doc) => documents.value.unshift(doc)
</script>

<template>
  <div class="wizard">
    <KLoader v-if="loading" :label="$t('common.loading')" />
    <template v-else>
      <header class="page-head">
        <div>
          <span class="eyebrow">{{ $t('company.eyebrow') }}</span>
          <h1>{{ showCard ? $t('company.titleDossier') : editing ? $t('company.titleEdit') : $t('company.title') }}</h1>
        </div>
        <div v-if="company && company.status !== 'draft' && !showCard" class="status">
          <KBadge :tone="DOSSIER_TONE[company.status]" dot>{{ $t(`status.dossier.${company.status}`) }}</KBadge>
          <button type="button" class="lnk" @click="editing = false">← {{ $t('company.backToDossier') }}</button>
        </div>
      </header>

      <!-- Dossier envoyé : fiche détaillée -->
      <CompanyDossierCard v-if="showCard" :company="company" :documents="documents" @edit="startEdit" />

      <section v-else class="wood-panel box">
        <KBeadSteps :steps="steps" :current="step" clickable @go="step = $event" />

        <Transition name="step" mode="out-in">
          <!-- 1. Pays & ville -->
          <div v-if="step === 0" key="0">
            <p class="text-muted">{{ $t('company.placeLead') }}</p>
            <CountryCityPicker v-model:country="form.country" v-model:city="form.city" />
            <p v-if="errors.city" class="k-field__error">{{ errors.city }}</p>
          </div>

          <!-- 2. Forme juridique + devis -->
          <div v-else-if="step === 1" key="1" class="form-step">
            <p class="text-muted">{{ $t('company.formLead') }}</p>
            <div class="forms">
              <button
                v-for="lf in APP_CONFIG.legalForms" :key="lf" type="button" class="lf" :class="{ on: form.legalForm === lf }"
                @click="form.legalForm = lf"
              >
                <strong>{{ $t(`legalForms.${lf}`) }}</strong>
                <span>{{ $t(`legalFormsInfo.${lf}`) }}</span>
              </button>
            </div>
            <p class="disclaimer">ⓘ {{ $t('company.formDisclaimer') }}</p>

            <aside v-if="quote" class="quote clay-panel">
              <h3>{{ $t('quote.title') }}</h3>
              <ul>
                <li v-for="l in quote.lines.filter((x) => x.amount)" :key="l.key"><span>{{ $t(`quote.lines.${l.key}`) }}</span><span>{{ formatXaf(l.amount, locale) }}</span></li>
              </ul>
              <p class="total"><span>{{ $t('quote.total') }}</span><strong>{{ formatXaf(quote.total, locale) }}</strong></p>
              <small class="text-muted">{{ $t('quote.note') }}</small>
            </aside>
          </div>

          <!-- 3. Formulaire dédié -->
          <div v-else-if="step === 2" key="2" class="details">
            <div class="grid-2">
              <KField :label="$t('company.fields.companyName')" required :error="errors.companyName" for-id="c-name">
                <input id="c-name" v-model="form.companyName" class="k-input" />
              </KField>
              <KField :label="$t('company.fields.sector')" for-id="c-sector">
                <select id="c-sector" v-model="form.sector" class="k-input">
                  <option value="">{{ $t('common.choose') }}</option>
                  <option v-for="s in APP_CONFIG.sectors" :key="s" :value="s">{{ $t(`sectors.${s}`) }}</option>
                </select>
              </KField>
              <KField :label="$t('company.fields.activity')" required :error="errors.activity" class="full" for-id="c-act">
                <textarea id="c-act" v-model="form.activity" class="k-input" rows="2" />
              </KField>
              <KField :label="$t('company.fields.address')" required :error="errors.address" for-id="c-addr">
                <input id="c-addr" v-model="form.address" class="k-input" :placeholder="`${form.city}, …`" />
              </KField>
              <KField v-if="form.legalForm !== 'ei'" :label="$t('company.fields.capital')" :hint="$t('company.fields.capitalHint')" for-id="c-cap">
                <input id="c-cap" v-model.number="form.capitalXaf" type="number" min="0" step="10000" class="k-input" />
              </KField>
              <KField :label="$t('company.fields.manager')" required :error="errors.manager" for-id="c-man">
                <input id="c-man" v-model="form.manager" class="k-input" />
              </KField>
              <KField :label="$t('company.fields.employees')" for-id="c-emp">
                <input id="c-emp" v-model.number="form.employees" type="number" min="0" class="k-input" />
              </KField>
              <KField :label="$t('company.fields.revenue')" for-id="c-rev">
                <select id="c-rev" v-model="form.revenueBracket" class="k-input">
                  <option v-for="r in ['0-10M', '10-50M', '50-250M', '250M+']" :key="r" :value="r">{{ r }} FCFA</option>
                </select>
              </KField>
            </div>

            <fieldset v-if="form.legalForm !== 'ei'" class="partners">
              <legend>{{ $t('company.fields.partners') }} <span :class="{ bad: shareTotal !== 100 }">({{ shareTotal }} %)</span></legend>
              <div v-for="(p, i) in form.partners" :key="i" class="partner">
                <input v-model="p.name" class="k-input" :placeholder="$t('company.fields.partnerName')" :aria-label="$t('company.fields.partnerName')" />
                <input v-model.number="p.share" type="number" min="0" max="100" class="k-input share" aria-label="%" />
                <button v-if="form.partners.length > 1" type="button" class="rm" :aria-label="$t('common.remove')" @click="removePartner(i)">✕</button>
              </div>
              <p v-if="errors.partners" class="k-field__error">{{ errors.partners }}</p>
              <button type="button" class="add" @click="addPartner">+ {{ $t('company.fields.addPartner') }}</button>
            </fieldset>

            <KField :label="$t('waitlist.needs')">
              <KChips v-model="form.needs" multiple :options="APP_CONFIG.needs.map((n) => ({ value: n, label: $t(`needs.${n}`) }))" />
            </KField>

            <fieldset class="payer">
              <legend>{{ $t('company.payer.title') }}</legend>
              <KChips v-model="form.payerIsBeneficiary" :options="[{ value: true, label: $t('company.payer.self') }, { value: false, label: $t('company.payer.other') }]" />
              <div v-if="!form.payerIsBeneficiary" class="grid-2">
                <KField :label="$t('company.payer.name')" required :error="errors.payerName"><input v-model="form.payerName" class="k-input" /></KField>
                <KField :label="$t('company.payer.relation')"><input v-model="form.payerRelation" class="k-input" /></KField>
              </div>
            </fieldset>
          </div>

          <!-- 4. Pièces -->
          <div v-else-if="step === 3" key="3">
            <p class="text-muted">{{ $t('company.docsLead') }}</p>
            <DocumentUploader v-if="company" :company-id="company.id" :documents="documents" @uploaded="onUploaded" />
          </div>

          <!-- 5. Récapitulatif -->
          <div v-else key="4" class="review">
            <dl>
              <div><dt>{{ $t('company.review.place') }}</dt><dd>{{ form.city }}, {{ countryName }}</dd></div>
              <div><dt>{{ $t('company.review.form') }}</dt><dd>{{ form.legalForm ? $t(`legalForms.${form.legalForm}`) : '—' }}</dd></div>
              <div><dt>{{ $t('company.fields.companyName') }}</dt><dd>{{ form.companyName || '—' }}</dd></div>
              <div><dt>{{ $t('company.fields.manager') }}</dt><dd>{{ form.manager }}</dd></div>
              <div v-if="form.legalForm !== 'ei'"><dt>{{ $t('company.fields.capital') }}</dt><dd>{{ formatXaf(form.capitalXaf, locale) }}</dd></div>
              <div><dt>{{ $t('company.review.docs') }}</dt><dd>{{ documents.length }}</dd></div>
              <div v-if="quote"><dt>{{ $t('quote.total') }}</dt><dd class="text-gold">{{ formatXaf(quote.total, locale) }}</dd></div>
              <div v-if="company?.submittedAt"><dt>{{ $t('company.review.submittedAt') }}</dt><dd>{{ formatDate(company.submittedAt, locale) }}</dd></div>
            </dl>
            <p class="text-muted">{{ $t('company.review.lead') }}</p>
          </div>
        </Transition>

        <div class="nav">
          <KButton v-if="step > 0" variant="ghost" :icon="false" @click="step--">← {{ $t('common.back') }}</KButton>
          <span v-else />
          <KButton v-if="step < 4" variant="wood" :icon="false" :loading="saving" @click="next">{{ $t('common.saveContinue') }} →</KButton>
          <KButton v-else :loading="saving" @click="submit">{{ company?.status === 'draft' || !company?.status ? $t('company.submit') : $t('company.resubmit') }}</KButton>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.page-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; margin-bottom: 1.25rem; h1 { margin: 0; font-size: clamp(1.8rem, 3.2vw, 2.4rem); } }
.status { display: flex; flex-direction: column; align-items: flex-end; gap: .3rem; small { font-size: .8rem; } }
.lnk { background: none; border: 0; color: var(--kec-gold); font-weight: 700; font-size: .85rem; }
.box { padding: clamp(1.25rem, 3vw, 2rem); }
.form-step { display: grid; gap: 1.25rem; }
.forms { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
.lf {
  text-align: start; padding: 1rem; border-radius: 16px; border: 1px solid rgba(233, 201, 131, .18); background: rgba(20, 12, 7, .35); color: var(--kec-ivory);
  display: flex; flex-direction: column; gap: .35rem; transition: all .3s var(--ease-out);
  strong { font-family: var(--font-display); font-size: 1.05rem; }
  span { font-size: .82rem; color: var(--kec-text-muted); line-height: 1.45; }
  &:hover { border-color: var(--kec-gold); transform: translateY(-2px); }
  &.on { border-color: var(--kec-gold); background: rgba(214, 165, 72, .12); box-shadow: 0 0 0 3px rgba(214, 165, 72, .12); }
}
.disclaimer { font-size: .8rem; color: var(--kec-gold-soft); margin: 0; }
.quote { padding: 1.25rem 1.5rem; h3 { margin-bottom: .75rem; }
  ul { list-style: none; padding: 0; margin: 0 0 .75rem; display: grid; gap: .45rem; li { display: flex; justify-content: space-between; gap: 1rem; font-size: .9rem; color: var(--kec-text-muted); } }
  .total { display: flex; justify-content: space-between; padding-top: .75rem; border-top: 1px dashed var(--kec-border); margin-bottom: .5rem; strong { font-family: var(--font-display); font-size: 1.5rem; color: var(--kec-gold-soft); } } }
.details { display: grid; gap: 1.5rem; }
.grid-2 { display: grid; gap: 1.1rem; @include sm-up { grid-template-columns: 1fr 1fr; } .full { grid-column: 1 / -1; } }
fieldset { border: 1px solid var(--kec-border); border-radius: 16px; padding: 1rem 1.1rem 1.2rem; margin: 0; display: grid; gap: .75rem;
  legend { padding: 0 .5rem; font-weight: 700; font-size: .85rem; color: var(--kec-sand); .bad { color: #f08a6e; } } }
.partner { display: grid; grid-template-columns: 1fr 90px auto; gap: .5rem; align-items: center; }
.rm { background: none; border: 0; color: var(--kec-text-muted); padding: .5rem; &:hover { color: #f08a6e; } }
.add { justify-self: start; background: none; border: 1px dashed var(--kec-gold); color: var(--kec-gold-soft); border-radius: 999px; padding: .45rem 1rem; font-weight: 700; font-size: .85rem; }
.review dl { display: grid; gap: .1rem; margin: 0 0 1rem; div { display: flex; justify-content: space-between; gap: 1rem; padding: .7rem 0; border-bottom: 1px dashed var(--kec-border); } dt { color: var(--kec-text-muted); } dd { margin: 0; font-weight: 700; text-align: end; } }
.nav { display: flex; justify-content: space-between; margin-top: 2rem; gap: 1rem; }
.step-enter-active, .step-leave-active { transition: all .3s var(--ease-out); }
.step-enter-from { opacity: 0; transform: translateX(20px); }
.step-leave-to { opacity: 0; transform: translateX(-20px); }
</style>

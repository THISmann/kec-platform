<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Paiement : MTN Mobile Money · Orange Money · Virement bancaire
 * ─────────────────────────────────────────────────────────────
 * Flux : choix du moyen -> numéro -> "confirmez sur votre téléphone"
 * -> interrogation du statut -> reçu. Pour le virement : coordonnées
 * bancaires + référence à rappeler.
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { APP_CONFIG } from '@/config/app.config'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import { formatXaf } from '@/utils/format'

const props = defineProps({
  amount: { type: Number, required: true },
  purpose: { type: String, default: 'program' },
  label: { type: String, default: '' },
  /** Réservation réglée (purpose = consultant) */
  bookingId: { type: String, default: null },
  /** Tranche du programme (deposit | balance | partial) */
  installment: { type: String, default: null }
})
const emit = defineEmits(['paid'])
const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()

const method = ref('momo')
const phone = ref('+237 ')
const phase = ref('choose') // choose | waiting | transfer | done
const payment = ref(null)
const error = ref('')
const loading = ref(false)

async function pay() {
  error.value = ''
  loading.value = true
  try {
    payment.value = await api.payment.initiate({
      userId: auth.user?.id, payerName: auth.user?.name, purpose: props.purpose, amount: props.amount, method: method.value, phone: phone.value,
      bookingId: props.bookingId, installment: props.installment
    })
    if (method.value === 'bank') { phase.value = 'transfer'; return }
    phase.value = 'waiting'
    // Interrogation du statut jusqu'à confirmation (webhook côté serveur en prod)
    let p = payment.value
    for (let i = 0; i < 10 && p.status === 'pending'; i++) p = await api.payment.status(p.id)
    payment.value = p
    if (p.status === 'succeeded') {
      phase.value = 'done'
      ui.rainCowries(50)
      emit('paid', p)
    } else {
      error.value = p.failureReason ? `${t('payment.failed')} (${p.failureReason})` : t('payment.failed')
      phase.value = 'choose'
    }
  } catch (e) {
    error.value = t(e.message || 'errors.generic')
    phase.value = 'choose'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pay">
    <p class="amount"><span>{{ label || $t('payment.amount') }}</span><strong>{{ formatXaf(amount, locale) }}</strong></p>

    <template v-if="phase === 'choose'">
      <div class="methods" role="radiogroup" :aria-label="$t('payment.method')">
        <button
          v-for="m in APP_CONFIG.paymentMethods" :key="m.id" type="button" role="radio" :aria-checked="method === m.id"
          class="method" :class="{ on: method === m.id, soon: m.soon }" :style="{ '--brand': m.color }" :disabled="m.soon" @click="method = m.id"
        >
          <span class="logo">{{ m.id === 'momo' ? 'MoMo' : m.id === 'om' ? 'OM' : m.id === 'card' ? '▭' : '🏦' }}</span>
          <span>{{ m.id === 'bank' ? $t('payment.bank') : m.id === 'card' ? $t('payment.card') : m.label }}</span>
          <small v-if="m.soon">{{ $t('common.soon') }}</small>
        </button>
      </div>
      <KField v-if="method !== 'bank'" :label="$t('payment.phone')" :hint="$t('payment.phoneHintDemo')" for-id="pay-phone" :error="error">
        <input id="pay-phone" v-model="phone" type="tel" class="k-input" inputmode="tel" />
      </KField>
      <p v-else-if="error" class="k-field__error">{{ error }}</p>
      <KButton block :loading="loading" @click="pay">{{ $t('payment.pay', { amount: formatXaf(amount, locale) }) }}</KButton>
      <p class="secure">🔒 {{ $t('payment.secure') }}</p>
    </template>

    <div v-else-if="phase === 'waiting'" class="waiting">
      <div class="phone"><span class="ussd">*126#</span><span class="ring" /></div>
      <strong>{{ $t('payment.confirmOnPhone') }}</strong>
      <p class="text-muted">{{ $t('payment.confirmHint') }}</p>
    </div>

    <div v-else-if="phase === 'transfer'" class="transfer">
      <h4>{{ $t('payment.transferTitle') }}</h4>
      <dl>
        <div><dt>{{ $t('payment.beneficiary') }}</dt><dd>K-Enterprise Counsel SARL</dd></div>
        <div><dt>IBAN</dt><dd>CM21 10005 00001 01234567890 12</dd></div>
        <div><dt>BIC</dt><dd>AFRICMCX</dd></div>
        <div><dt>{{ $t('payment.reference') }}</dt><dd class="text-gold">{{ payment?.reference }}</dd></div>
      </dl>
      <p class="text-muted small">{{ $t('payment.transferHint') }}</p>
    </div>

    <div v-else class="done">
      <span class="check">✓</span>
      <strong>{{ $t('payment.success') }}</strong>
      <p class="text-muted">{{ $t('payment.receipt', { n: payment?.receiptNo, ref: payment?.reference }) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pay { display: grid; gap: 1.1rem; }
.amount { display: flex; justify-content: space-between; align-items: baseline; margin: 0; padding-bottom: .75rem; border-bottom: 1px dashed var(--kec-border); span { color: var(--kec-text-muted); } strong { font-family: var(--font-display); font-size: 1.7rem; color: var(--kec-gold-soft); } }
.methods { display: grid; grid-template-columns: repeat(2, 1fr); gap: .6rem; @include sm-up { grid-template-columns: repeat(4, 1fr); } }
.method {
  display: flex; flex-direction: column; align-items: center; gap: .45rem; padding: .9rem .5rem; border-radius: 16px; font-size: .78rem; font-weight: 700;
  border: 1px solid rgba(233, 201, 131, .18); background: rgba(20, 12, 7, .35); color: var(--kec-ivory); transition: all .25s;
  .logo { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: var(--brand); color: #1a110b; font-weight: 900; font-size: .8rem; }
  &.on { border-color: var(--brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 25%, transparent); }
  &.soon { opacity: .45; cursor: not-allowed; small { font-size: .62rem; color: var(--kec-gold-soft); text-transform: uppercase; letter-spacing: .1em; } }
}
.secure { margin: 0; font-size: .76rem; color: var(--kec-text-muted); text-align: center; }
.waiting, .done { display: flex; flex-direction: column; align-items: center; text-align: center; gap: .6rem; padding: 1rem 0; p { margin: 0; } }
.phone { position: relative; width: 74px; height: 120px; border-radius: 14px; border: 3px solid var(--kec-ivory); display: grid; place-items: center; animation: buzz 1.2s infinite; }
.ussd { font-family: monospace; color: var(--kec-gold); font-weight: 800; }
.ring { position: absolute; inset: -10px; border-radius: 22px; border: 2px solid var(--kec-gold); animation: ping 1.2s infinite; }
@keyframes buzz { 0%, 100% { transform: rotate(0); } 10% { transform: rotate(-6deg); } 20% { transform: rotate(6deg); } 30% { transform: rotate(0); } }
@keyframes ping { from { opacity: 1; transform: scale(.9); } to { opacity: 0; transform: scale(1.3); } }
.check { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; font-size: 1.8rem; color: #1a110b; background: radial-gradient(circle at 35% 30%, #d9f0b0, #8fa35a); animation: pop .6s var(--ease-spring); }
@keyframes pop { from { transform: scale(0); } }
.transfer dl { margin: 0; display: grid; div { display: flex; justify-content: space-between; gap: 1rem; padding: .55rem 0; border-bottom: 1px dashed var(--kec-border); font-size: .88rem; } dt { color: var(--kec-text-muted); } dd { margin: 0; font-weight: 700; text-align: end; word-break: break-all; } }
.small { font-size: .82rem; }
</style>

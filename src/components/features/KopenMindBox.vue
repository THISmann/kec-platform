<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Kopen Mind — la boîte à suggestions
 * ─────────────────────────────────────────────────────────────
 * « Des suggestions à nous faire pour notre amélioration ? Laissez un message ici. »
 * Une boîte en bois sculpté : à l'envoi, le message se plie et glisse
 * dans la fente, puis quelques cauris tombent en remerciement.
 */
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import KButton from '@/components/ui/KButton.vue'
import KChips from '@/components/ui/KChips.vue'
import KField from '@/components/ui/KField.vue'

const { t } = useI18n()
const ui = useUiStore()
const auth = useAuthStore()
const form = reactive({ message: '', category: 'idea', contact: '' })
const sending = ref(false)
const posted = ref(false)
const error = ref('')

const categories = ['idea', 'feature', 'content', 'praise', 'problem']

async function submit() {
  error.value = ''
  if (form.message.trim().length < 10) { error.value = t('kopen.tooShort'); return }
  sending.value = true
  try {
    await api.suggestion.create({ ...form, author: auth.user?.name ?? t('kopen.anonymous') })
    posted.value = true
    ui.rainCowries(25)
    setTimeout(() => { posted.value = false; form.message = ''; form.contact = '' }, 4200)
  } catch {
    error.value = t('errors.generic')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="kopen">
    <div class="box-art" :class="{ posted }" aria-hidden="true">
      <svg viewBox="0 0 220 200">
        <defs>
          <linearGradient id="km-wood" x1="0" x2="1">
            <stop offset="0" stop-color="#5a3a24" /><stop offset=".5" stop-color="#8b5a34" /><stop offset="1" stop-color="#4a2e1a" />
          </linearGradient>
        </defs>
        <!-- lettre -->
        <g class="letter">
          <rect x="70" y="10" width="80" height="58" rx="4" fill="#f5ecdb" />
          <path d="M80 26h60M80 38h50M80 50h56" stroke="#b9a58b" stroke-width="3" stroke-linecap="round" />
        </g>
        <!-- boîte -->
        <path d="M30 80h160l-10 108H40z" fill="url(#km-wood)" />
        <path d="M24 70h172v16H24z" fill="#3a2416" />
        <rect x="80" y="74" width="60" height="6" rx="3" fill="#120b07" />
        <!-- « Kopen Mind » gravé dans le bois, légèrement en creux -->
        <text x="110" y="105" text-anchor="middle" font-family="Fraunces Variable, Georgia, serif" font-size="14" font-weight="700" letter-spacing="2.5" fill="#2a170d" opacity=".7">KOPEN MIND</text>
        <text x="110" y="104" text-anchor="middle" font-family="Fraunces Variable, Georgia, serif" font-size="14" font-weight="700" letter-spacing="2.5" fill="#d6a548" opacity=".9">KOPEN MIND</text>
        <!-- motifs sculptés -->
        <path d="M50 120l14 12-14 12M170 120l-14 12 14 12M90 152h40M100 164h20" stroke="#d6a548" stroke-width="2.5" fill="none" opacity=".7" />
        <circle cx="110" cy="132" r="10" fill="none" stroke="#d6a548" stroke-width="2.5" opacity=".8" />
        <ellipse cx="110" cy="132" rx="3" ry="5" fill="#efe3c9" />
      </svg>
    </div>

    <div class="form-side">
      <span class="eyebrow">Kopen Mind</span>
      <h2>{{ $t('kopen.title') }}</h2>
      <p class="text-muted">{{ $t('kopen.lead') }}</p>

      <Transition name="fade" mode="out-in">
        <div v-if="posted" class="thanks" role="status">
          <strong>{{ $t('kopen.thanksTitle') }}</strong>
          <p>{{ $t('kopen.thanks') }}</p>
        </div>
        <form v-else class="stack" @submit.prevent="submit">
          <KChips v-model="form.category" :name="$t('kopen.category')" :options="categories.map((c) => ({ value: c, label: $t(`kopen.categories.${c}`) }))" />
          <KField :error="error">
            <textarea v-model="form.message" class="k-input" rows="4" :placeholder="$t('kopen.placeholder')" :aria-label="$t('kopen.placeholder')" maxlength="2000" />
          </KField>
          <KField :hint="$t('kopen.contactHint')">
            <input v-model="form.contact" class="k-input" :placeholder="$t('kopen.contact')" :aria-label="$t('kopen.contact')" />
          </KField>
          <KButton type="submit" :loading="sending">{{ $t('kopen.send') }}</KButton>
        </form>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.kopen {
  display: grid; gap: 2rem; align-items: center; padding: clamp(1.5rem, 4vw, 3rem);
  border-radius: var(--radius-lg); border: 1px solid var(--kec-border);
  background: radial-gradient(80% 120% at 0% 0%, rgba(168, 64, 31, .25), transparent 60%), linear-gradient(160deg, #2f1e13, #1f140c);
  @include md-up { grid-template-columns: 300px 1fr; gap: 3rem; }
}
.box-art { max-width: 260px; margin-inline: auto; width: 100%; }
.letter { transition: transform 1.2s var(--ease-out), opacity 1.2s; transform-origin: 110px 40px; }
.posted .letter { transform: translateY(70px) scaleY(.3); opacity: 0; }
.box-art:not(.posted) .letter { animation: hover 3s ease-in-out infinite; }
@keyframes hover { 50% { transform: translateY(-6px) rotate(-2deg); } }
.thanks { padding: 1.5rem; border-radius: var(--radius); border: 1px dashed var(--kec-gold); strong { font-family: var(--font-display); font-size: 1.4rem; color: var(--kec-gold-soft); } p { margin: .5rem 0 0; } }
.fade-enter-active, .fade-leave-active { transition: opacity .35s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

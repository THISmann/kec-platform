<script setup>
/**
 * Connexion — trois portes, une même serrure :
 *  - fellow   : « Connexion », l'espace des 110
 *  - staff    : équipe interne KEC
 *  - investor : Kia, le canal des investisseurs
 * En mode mock, les identifiants de démo sont proposés en un clic.
 */
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore, HOME_BY_ROLE } from '@/stores/auth'
import { API_MODE } from '@/services'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import AfricaGlobe from '@/components/effects/AfricaGlobe.vue'

const props = defineProps({ audience: { type: String, default: 'fellow' } })
const { t } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const DEMO = {
  fellow: { email: 'awa@kec.africa', password: 'fellow110' },
  staff: { email: 'equipe@kec.africa', password: 'kec2026' },
  investor: { email: 'kia@kec.africa', password: 'kia2026' }
}
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPwd = ref(false)
const copy = computed(() => `login.${props.audience}`)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const user = await auth.login(form)
    if (user.role !== { fellow: 'fellow', staff: 'staff', investor: 'investor' }[props.audience]) {
      // Connexion réussie mais mauvaise porte : on redirige vers le bon espace
      return router.push({ name: HOME_BY_ROLE[user.role] })
    }
    router.push(route.query.redirect || { name: HOME_BY_ROLE[user.role] })
  } catch (e) {
    error.value = t(e.message || 'errors.generic')
  } finally {
    loading.value = false
  }
}
const fillDemo = () => Object.assign(form, DEMO[props.audience])
</script>

<template>
  <section class="login" :class="`aud-${audience}`">
    <div class="art" aria-hidden="true">
      <div v-if="audience === 'investor'" class="globe-mini"><AfricaGlobe :speed="10" /></div>
      <div v-else class="seats">
        <CowrieShape v-for="n in 110" :key="n" :size="10" :tone="audience === 'staff' ? 'sand' : 'ivory'" />
      </div>
      <blockquote>{{ $t(`${copy}.quote`) }}</blockquote>
    </div>

    <div class="panel wood-panel">
      <span class="eyebrow">{{ $t(`${copy}.eyebrow`) }}</span>
      <h1>{{ $t(`${copy}.title`) }}</h1>
      <p class="text-muted">{{ $t(`${copy}.lead`) }}</p>

      <form class="stack" @submit.prevent="submit">
        <KField :label="$t('login.email')" for-id="lg-email">
          <input id="lg-email" v-model="form.email" type="email" class="k-input" autocomplete="username" required />
        </KField>
        <KField :label="$t('login.password')" for-id="lg-pwd" :error="error">
          <div class="pwd">
            <input id="lg-pwd" v-model="form.password" :type="showPwd ? 'text' : 'password'" class="k-input" autocomplete="current-password" required />
            <button type="button" class="eye" :aria-label="$t('login.toggle')" @click="showPwd = !showPwd">{{ showPwd ? '◉' : '◎' }}</button>
          </div>
        </KField>
        <KButton type="submit" block size="lg" :loading="loading">{{ $t('login.submit') }}</KButton>
      </form>

      <div v-if="API_MODE === 'mock'" class="demo">
        <span>{{ $t('login.demo') }}</span>
        <code>{{ DEMO[audience].email }} / {{ DEMO[audience].password }}</code>
        <button type="button" @click="fillDemo">{{ $t('login.fill') }}</button>
      </div>

      <p v-if="audience === 'fellow'" class="not-yet">
        {{ $t('login.notFellow') }} <RouterLink :to="{ name: 'waiting-room' }">{{ $t('login.joinWaitlist') }}</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login { min-height: 100vh; padding: 7rem 1.25rem 4rem; display: grid; gap: 2rem; align-items: center; width: min(1150px, 100%); margin: 0 auto; @include md-up { grid-template-columns: 1fr 460px; gap: 4rem; } }
.art { display: none; @include md-up { display: flex; flex-direction: column; gap: 2rem; align-items: center; } }
.seats { display: grid; grid-template-columns: repeat(11, 1fr); gap: 12px 10px; :deep(svg) { animation: twinkle 3s ease-in-out infinite; } :deep(svg:nth-child(7n)) { animation-delay: .6s; } :deep(svg:nth-child(5n)) { animation-delay: 1.4s; } }
@keyframes twinkle { 50% { opacity: .45; transform: translateY(-3px); } }
.globe-mini { width: 380px; }
blockquote { margin: 0; max-width: 34ch; text-align: center; font-family: var(--font-display); font-style: italic; font-size: 1.3rem; color: var(--kec-gold-soft); }
.panel { padding: clamp(1.5rem, 4vw, 2.5rem); h1 { font-size: clamp(1.8rem, 3.5vw, 2.5rem); } }
.stack > * + * { margin-top: 1.1rem; }
.pwd { position: relative; .k-input { padding-inline-end: 3rem; } }
.eye { position: absolute; inset-inline-end: .5rem; top: 50%; transform: translateY(-50%); background: none; border: 0; color: var(--kec-gold); font-size: 1.1rem; padding: .3rem .5rem; }
.demo { margin-top: 1.5rem; padding: .9rem 1rem; border-radius: 14px; border: 1px dashed rgba(214, 165, 72, .45); display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; font-size: .82rem; color: var(--kec-text-muted);
  code { color: var(--kec-ivory); background: rgba(0, 0, 0, .25); padding: .15rem .45rem; border-radius: 6px; }
  button { margin-inline-start: auto; background: none; border: 0; color: var(--kec-gold-soft); font-weight: 700; text-decoration: underline; } }
.not-yet { margin-top: 1.25rem; font-size: .9rem; color: var(--kec-text-muted); }
</style>

<script setup>
/** Gabarit Kia (investisseurs) : pensé d'abord pour le téléphone. */
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import KecLogo from '@/components/brand/KecLogo.vue'
import LangSwitcher from '@/components/layout/LangSwitcher.vue'

const auth = useAuthStore()
const router = useRouter()
async function logout() { await auth.logout(); router.push({ name: 'home' }) }
</script>

<template>
  <div class="kia">
    <header class="kia-top">
      <RouterLink to="/" class="brand"><KecLogo :size="32" :tagline="false" /></RouterLink>
      <span class="channel" :title="$t('kia.fullName')">Kia <small>· KEC Invest Again</small></span>
      <div class="r">
        <LangSwitcher />
        <button type="button" class="out" :aria-label="$t('app.logout')" @click="logout">⎋</button>
      </div>
    </header>
    <main class="kia-main"><RouterView /></main>
  </div>
</template>

<style scoped lang="scss">
.kia { min-height: 100vh; background: radial-gradient(120% 60% at 50% 0%, #3a2416 0%, var(--kec-ebony) 60%); }
.kia-top {
  position: sticky; top: 0; z-index: 50; display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem;
  background: rgba(26, 17, 11, .85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--kec-border);
}
.brand { color: inherit; }
.channel { font-family: var(--font-display); font-style: italic; font-size: 1.3rem; color: var(--kec-gold); padding-inline-start: .75rem; border-inline-start: 1px solid var(--kec-border); small { font-family: var(--font-body); font-style: normal; font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; color: var(--kec-text-muted); display: none; @include sm-up { display: inline; } } }
.r { margin-inline-start: auto; display: flex; gap: .5rem; align-items: center; }
.out { background: none; border: 1px solid var(--kec-border); color: var(--kec-ivory); border-radius: 50%; width: 36px; height: 36px; }
.kia-main { width: min(1100px, 100%); margin: 0 auto; padding: 1rem; @include md-up { padding: 2rem; } }
</style>

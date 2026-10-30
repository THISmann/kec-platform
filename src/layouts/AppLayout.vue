<script setup>
/**
 * Gabarit des espaces connectés :
 *  - space="fellow" : espace « Connexion » des 110 fellows
 *  - space="staff"  : back-office de l'équipe KEC
 * Barre latérale en bois, en-tête utilisateur, navigation mobile en bas.
 */
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import KecLogo from '@/components/brand/KecLogo.vue'
import LangSwitcher from '@/components/layout/LangSwitcher.vue'
import ManuAssistant from '@/components/assistant/ManuAssistant.vue'
import { initials } from '@/utils/format'
import { useInboxStore } from '@/stores/inbox'

const props = defineProps({ space: { type: String, default: 'fellow' } })
const auth = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const NAV = {
  fellow: [
    { to: 'fellow-dashboard', icon: '◎', key: 'dashboard' },
    { to: 'fellow-company', icon: '⌂', key: 'company' },
    { to: 'fellow-vault', icon: '⛉', key: 'vault' },
    { to: 'fellow-consultant', icon: '☏', key: 'consultant' },
    { to: 'fellow-payments', icon: '◈', key: 'payments' },
    { to: 'fellow-inbox', icon: '✉', key: 'inbox', badge: 'inbox' },
    { to: 'fellow-kopen', icon: '✎', key: 'kopen' }
  ],
  staff: [
    { to: 'bo-overview', icon: '◎', key: 'overview' },
    { to: 'bo-waitlist', icon: '☰', key: 'waitlist' },
    { to: 'bo-dossiers', icon: '⌂', key: 'dossiers' },
    { to: 'bo-appointments', icon: '◷', key: 'appointments' },
    { to: 'bo-inbox', icon: '✉', key: 'inbox', badge: 'inbox' },
    { to: 'bo-payments', icon: '◈', key: 'payments' },
    { to: 'bo-manu', icon: '☺', key: 'manu', permission: 'configureManu' },
    { to: 'bo-team', icon: '⚇', key: 'team', permission: 'manageTeam' }
  ]
}
// Les entrées soumises à un droit disparaissent pour les membres qui ne l'ont pas (gestion des rôles)
const items = computed(() => NAV[props.space].filter((i) => !i.permission || auth.can(i.permission)))
const inbox = useInboxStore()
onMounted(() => inbox.refresh(props.space))
const spaceLabel = computed(() => (props.space === 'fellow' ? t('app.fellowSpace') : t('app.staffSpace')))

async function logout() {
  await auth.logout()
  router.push({ name: 'home' })
}

/* Barre d'onglets mobile : si elle déborde, on affiche un voile à droite */
const menuEl = ref(null)
const scrollable = ref(false)
let menuRo
function measureMenu() { const el = menuEl.value; scrollable.value = !!el && el.scrollWidth > el.clientWidth + 4 }
onMounted(() => { measureMenu(); menuRo = new ResizeObserver(measureMenu); if (menuEl.value) menuRo.observe(menuEl.value) })
onBeforeUnmount(() => menuRo?.disconnect())
</script>

<template>
  <div class="app" :class="`space-${space}`">
    <aside class="side">
      <RouterLink to="/" class="logo"><KecLogo :size="38" /></RouterLink>
      <span class="space-tag">{{ spaceLabel }}</span>
      <nav ref="menuEl" class="menu" :class="{ scrollable }" :aria-label="spaceLabel">
        <RouterLink v-for="i in items" :key="i.to" :to="{ name: i.to }" class="item" exact-active-class="on">
          <span class="ico" aria-hidden="true">{{ i.icon }}</span>
          <span class="lbl">{{ $t(`app.nav.${i.key}`) }}</span>
          <span v-if="i.badge === 'inbox' && inbox.unread" class="count">{{ inbox.unread }}</span>
        </RouterLink>
      </nav>
      <div class="side-foot">
        <button type="button" class="logout" @click="logout">⎋ {{ $t('app.logout') }}</button>
      </div>
    </aside>

    <div class="content">
      <header class="top">
        <div class="hello">
          <span class="avatar">{{ initials(auth.user?.name) }}</span>
          <div>
            <strong>{{ auth.user?.name }}</strong>
            <small v-if="auth.user?.fellowNumber">{{ $t('app.fellowOf', { n: String(auth.user.fellowNumber).padStart(3, '0') }) }}</small>
            <small v-else-if="auth.user?.title">{{ auth.user.title }} · {{ $t(`team.roles.${auth.user.teamRole}`) }}</small>
          </div>
        </div>
        <div class="top-actions">
          <LangSwitcher />
          <button type="button" class="logout mobile-only" :aria-label="$t('app.logout')" @click="logout">⎋</button>
        </div>
      </header>
      <main class="page">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in"><component :is="Component" /></Transition>
        </RouterView>
      </main>
    </div>

    <ManuAssistant v-if="space === 'fellow'" />
  </div>
</template>

<style scoped lang="scss">
.app { min-height: 100vh; display: grid; grid-template-columns: 1fr; @include md-up { grid-template-columns: 260px 1fr; } }

.side {
  position: fixed; z-index: 80; inset-inline-start: 0; inset-inline-end: 0; bottom: 0;
  background-color: var(--kec-walnut-deep); @include wood-grain(.55);
  border-top: 1px solid var(--kec-border);
  @include md-up {
    position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; gap: 1rem;
    padding: 1.5rem 1rem; border-top: 0; border-inline-end: 1px solid var(--kec-border);
  }
}
.logo, .space-tag, .side-foot { display: none; @include md-up { display: block; } }
.logo { color: inherit; padding: 0 .5rem; }
.space-tag { margin: .5rem .6rem 0; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: var(--kec-gold); font-weight: 800; }
.menu {
  display: flex; justify-content: flex-start; overflow-x: auto; scrollbar-width: none; padding: .35rem .25rem calc(.35rem + env(safe-area-inset-bottom));
  &::-webkit-scrollbar { display: none; }
  scroll-snap-type: x proximity;
  /* Sur téléphone, un voile à droite signale qu'il reste des onglets à faire défiler */
  &.scrollable::after { content: ''; position: sticky; inset-inline-end: 0; flex: 0 0 22px; margin-inline-start: -22px; pointer-events: none; background: linear-gradient(to right, transparent, var(--kec-walnut-deep)); :dir(rtl) & { background: linear-gradient(to left, transparent, var(--kec-walnut-deep)); } }
  @include md-up { flex-direction: column; justify-content: flex-start; gap: .25rem; padding: 0; overflow: visible; }
}
.item {
  position: relative; flex: 1 0 54px;
  display: flex; flex-direction: column; align-items: center; gap: .15rem; padding: .45rem .3rem; border-radius: 12px; scroll-snap-align: start;
  color: var(--kec-text-muted); font-size: .62rem; font-weight: 700; transition: all .25s; min-width: 0;
  .count { position: absolute; top: 2px; inset-inline-end: 8px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 99px; display: grid; place-items: center; font-size: .66rem; background: var(--kec-laterite); color: #fff; @include md-up { position: static; margin-inline-start: auto; } }
  .ico { font-size: 1.15rem; line-height: 1; }
  @include md-up { flex-direction: row; gap: .85rem; padding: .75rem .9rem; font-size: .92rem; .ico { width: 22px; text-align: center; } }
  &:hover { color: var(--kec-ivory); background: rgba(255, 255, 255, .04); }
  &.on { color: #2a1a12; background: radial-gradient(120% 140% at 30% 0%, #fffaf0, #ecdcbc 55%, #d4b98c); box-shadow: 0 8px 20px -10px rgba(239, 227, 201, .5); }
}
.lbl { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 58px; @include md-up { max-width: none; font-size: .92rem; } }
.side-foot { margin-top: auto; }
.logout { background: none; border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .55rem .9rem; border-radius: 12px; width: 100%; text-align: start; &:hover { color: var(--kec-ivory); border-color: var(--kec-gold); } }
.mobile-only { width: auto; @include md-up { display: none; } }

.content { min-width: 0; padding-bottom: 5rem; @include md-up { padding-bottom: 0; } }
.top {
  position: sticky; top: 0; z-index: 70; display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  padding: .8rem 1.25rem; background: rgba(26, 17, 11, .85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--kec-border);
  @include md-up { padding: 1rem 2rem; }
}
.hello { display: flex; align-items: center; gap: .75rem; line-height: 1.2; small { display: block; color: var(--kec-gold-soft); font-size: .76rem; } }
.avatar { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: .85rem; color: #2a1a12; background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548); }
.top-actions { display: flex; gap: .5rem; align-items: center; }
.page :deep(h1) { font-size: clamp(1.7rem, 3vw, 2.4rem); }
.page { padding: 1.25rem; @include md-up { padding: 2rem; } max-width: 1280px; }
</style>

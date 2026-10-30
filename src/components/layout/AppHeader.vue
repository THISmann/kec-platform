<script setup>
/**
 * En-tête public : logo, navigation, langue, accès à l'espace client.
 * « Accueil » regroupe Services, Le parcours et Le programme dans un menu
 * au survol (ou au toucher) ; le filet doré suit la section visible pendant
 * le défilement de l'accueil (scroll-spy) et reste sur la page courante ailleurs.
 */
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import KecLogo from '@/components/brand/KecLogo.vue'
import KButton from '@/components/ui/KButton.vue'
import LangSwitcher from './LangSwitcher.vue'
import { useAuthStore, HOME_BY_ROLE } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const scrolled = ref(false)
const menu = ref(false)
const navOpen = ref(false)
const section = ref('') // id de la section visible sur l'accueil

const SECTIONS = [
  { id: 'services', key: 'nav.services' },
  { id: 'parcours', key: 'nav.journey' },
  { id: 'programme', key: 'nav.program' }
]
const GUIDES = [
  { name: 'seo-create', key: 'guides.create.nav' },
  { name: 'seo-legal', key: 'guides.legal.nav' },
  { name: 'seo-invest', key: 'guides.invest.nav' },
  { name: 'seo-business', key: 'guides.business.nav' },
  { name: 'seo-brand', key: 'guides.brand.nav' }
]
const onHome = computed(() => route.name === 'home')

let spy = null
function watchSections() {
  spy?.disconnect()
  spy = null
  section.value = ''
  if (!onHome.value || typeof IntersectionObserver === 'undefined') return
  const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
  if (!els.length) return
  spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) section.value = e.target.id
      else if (section.value === e.target.id) section.value = ''
    }
  }, { rootMargin: '-45% 0px -45% 0px' })
  els.forEach((el) => spy.observe(el))
}

const onScroll = () => { scrolled.value = window.scrollY > 30 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); setTimeout(watchSections, 400) })
onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); spy?.disconnect() })
watch(() => route.name, () => { menu.value = false; navOpen.value = false; setTimeout(watchSections, 400) })
const close = () => { menu.value = false; navOpen.value = false }
/* Le menu reste ouvert tant que la souris est sur « Accueil » ou sur la liste ; on laisse 250 ms
   pour traverser l'espace entre les deux, sinon il se fermait avant le clic. */
let navTimer
const openNav = () => { clearTimeout(navTimer); navOpen.value = true }
const closeNavSoon = () => { clearTimeout(navTimer); navTimer = setTimeout(() => { navOpen.value = false }, 250) }
</script>

<template>
  <header class="hdr" :class="{ scrolled, open: menu }">
    <div class="container bar">
      <RouterLink to="/" class="brand" :aria-label="$t('nav.home')" @click="close"><KecLogo :size="40" /></RouterLink>

      <nav class="nav" :aria-label="$t('nav.main')">
        <div class="group" :class="{ open: navOpen }" @mouseenter="openNav" @mouseleave="closeNavSoon" @focusin="openNav" @focusout="closeNavSoon">
          <RouterLink :to="{ name: 'home' }" class="top" :class="{ 'is-current': onHome && !section }" :aria-expanded="navOpen" @click="close">
            {{ $t('nav.homeLabel') }} <span class="chev" aria-hidden="true">▾</span>
          </RouterLink>
          <ul class="drop">
            <li v-for="s in SECTIONS" :key="s.id">
              <RouterLink :to="{ name: 'home', hash: `#${s.id}` }" :class="{ 'is-current': section === s.id }" @click="close">{{ $t(s.key) }}</RouterLink>
            </li>
            <li v-for="g in GUIDES" :key="g.name">
              <RouterLink :to="{ name: g.name }" :class="{ 'is-current': route.name === g.name }" @click="close">{{ $t(g.key) }}</RouterLink>
            </li>
          </ul>
        </div>
        <RouterLink :to="{ name: 'waiting-room' }" :class="{ 'is-current': route.name === 'waiting-room' }" @click="close">{{ $t('nav.waitingRoom') }}</RouterLink>
        <RouterLink :to="{ name: 'kopen-mind' }" :class="{ 'is-current': route.name === 'kopen-mind' }" @click="close">Kopen Mind</RouterLink>
      </nav>

      <div class="actions">
        <LangSwitcher />
        <KButton v-if="auth.isAuthenticated" variant="wood" size="sm" :icon="false" :to="{ name: HOME_BY_ROLE[auth.role] }">{{ $t('nav.mySpace') }}</KButton>
        <KButton v-else variant="cowrie" size="sm" :to="{ name: 'login' }">{{ $t('nav.connexion') }}</KButton>
        <button class="burger" type="button" :aria-expanded="menu" :aria-label="$t('nav.menu')" @click="menu = !menu"><span /><span /><span /></button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.hdr {
  position: fixed; inset: 0 0 auto; z-index: 100; padding: 1rem 0;
  transition: background .4s, padding .4s, box-shadow .4s;
}
.hdr.scrolled, .hdr.open {
  padding: .55rem 0;
  background: rgba(26, 17, 11, .82); backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 1px 0 var(--kec-border);
}
.bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand { color: inherit; flex-shrink: 0; }
@media (max-width: 480px) { .brand :deep(.tag) { display: none; } .actions :deep(.k-btn__icon) { display: none; } }
.nav {
  display: none; gap: 2rem;
  a { color: var(--kec-ivory); font-weight: 600; font-size: .93rem; position: relative; padding: .3rem 0; }
  /* Filet doré : uniquement sur la section en cours (ou la page courante), et au survol */
  a::after { content: ''; position: absolute; inset-inline: 50%; bottom: -2px; height: 2px; background: var(--kec-gold); border-radius: 2px; transition: inset-inline .35s var(--ease-out); }
  a:hover::after, a.is-current::after { inset-inline: 0; }
  .group { position: relative; }
  /* Pont invisible entre le lien et la liste : la souris ne « sort » plus du groupe en descendant */
  .group.open::after { content: ''; position: absolute; inset-inline: -.75rem; top: 100%; height: .8rem; }
  .chev { font-size: .7em; color: var(--kec-gold); margin-inline-start: .2rem; }
  .drop { list-style: none; margin: 0; padding: .5rem; position: absolute; top: calc(100% + .6rem); inset-inline-start: -.75rem; min-width: 190px; display: none; flex-direction: column; gap: .1rem;
    background: #2c1c12; border: 1px solid var(--kec-border); border-radius: 16px; box-shadow: var(--shadow-soft);
    a { display: block; padding: .55rem .8rem; border-radius: 10px; font-weight: 500; &::after { inset-inline: auto; width: 0; } &:hover, &.is-current { background: rgba(214, 165, 72, .12); } &.is-current { color: var(--kec-gold-soft); } } }
  .group.open .drop { display: flex; }
  @include md-up { display: flex; }
}
.actions { display: flex; align-items: center; gap: .6rem; }
.burger {
  display: grid; gap: 5px; padding: .6rem; background: none; border: 0;
  span { width: 22px; height: 2px; background: var(--kec-ivory); border-radius: 2px; transition: all .3s; }
  @include md-up { display: none; }
}
.open .burger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.open .burger span:nth-child(2) { opacity: 0; }
.open .burger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@include md-down {
  /* Sur téléphone : le menu déroulant devient une sous-liste indentée */
  .open .nav {
    display: flex; flex-direction: column; gap: 0; position: absolute; top: 100%; inset-inline: 0;
    background: rgba(26, 17, 11, .97); padding: .5rem 1.25rem 1.25rem; border-bottom: 1px solid var(--kec-border);
    a { padding: .9rem 0; border-bottom: 1px solid rgba(233, 201, 131, .08); font-size: 1.05rem; }
    .drop { display: flex; position: static; min-width: 0; padding: 0 0 0 1.25rem; border: 0; background: none; box-shadow: none; a { font-size: .95rem; padding: .7rem 0; } }
    .chev { display: none; }
  }
  .actions :deep(.k-btn) { padding: .45rem .8rem; }
}
</style>

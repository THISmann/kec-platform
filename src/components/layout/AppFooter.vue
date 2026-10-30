<script setup>
/** Pied de page : frise bogolan, liens vers les espaces, contact et les sept réseaux (liens dans app.config.js). */
import KecLogo from '@/components/brand/KecLogo.vue'
import { APP_CONFIG } from '@/config/app.config'
const year = new Date().getFullYear()
const { socials, contact } = APP_CONFIG

/* Icônes des réseaux : tracés SVG simples, colorés par le texte (pas de dépendance) */
const ICONS = {
  whatsapp: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 0 1 12 4zm-3 4.5c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4l-.5-.3-1.9-.9c-.3-.1-.4-.2-.6.1l-.9 1.1c-.2.2-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.4.1-.2 0-.3 0-.5l-.9-2c-.2-.6-.5-.5-.7-.5h-.3z',
  linkedin: 'M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM2.5 9h3v12h-3zM9 9h2.9v1.7h.1c.4-.8 1.4-1.9 3.2-1.9 3.4 0 4 2.2 4 5.1V21h-3v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z',
  facebook: 'M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8z',
  instagram: 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5zm9.8 1.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
  tiktok: 'M13.5 2h3c.2 2.2 1.6 3.7 3.8 3.9v3a7 7 0 0 1-3.8-1.2V15a6 6 0 1 1-6-6h.5v3.1a3 3 0 1 0 2.5 2.9z',
  wechat: 'M9 4C5.1 4 2 6.6 2 9.8c0 1.8 1 3.4 2.5 4.5L3.8 16.5l2.5-1.3c.8.2 1.7.4 2.7.4h.3A5.5 5.5 0 0 1 9 14c0-3.1 3.1-5.6 7-5.6h.4C15.6 5.9 12.6 4 9 4zm-2.2 3.3a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm4.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM16 9.8c-3.3 0-6 2.2-6 4.8s2.7 4.8 6 4.8c.8 0 1.5-.1 2.2-.3l2.1 1.1-.6-1.8c1.4-.9 2.3-2.3 2.3-3.8 0-2.6-2.7-4.8-6-4.8zm-2 2.7a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6zm4 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z',
  douyin: 'M13.5 2h3c.2 2.2 1.6 3.7 3.8 3.9v3a7 7 0 0 1-3.8-1.2V15a6 6 0 1 1-6-6h.5v3.1a3 3 0 1 0 2.5 2.9z'
}
</script>

<template>
  <footer class="ftr">
    <div class="frieze" aria-hidden="true" />
    <div class="container grid-f">
      <div>
        <KecLogo :size="46" />
        <p class="text-muted mission">{{ $t('footer.mission') }}</p>
      </div>
      <div>
        <h4>{{ $t('footer.explore') }}</h4>
        <RouterLink :to="{ name: 'home', hash: '#services' }">{{ $t('nav.services') }}</RouterLink>
        <RouterLink :to="{ name: 'home', hash: '#programme' }">{{ $t('nav.program') }}</RouterLink>
        <RouterLink :to="{ name: 'waiting-room' }">{{ $t('nav.waitingRoom') }}</RouterLink>
        <RouterLink :to="{ name: 'kopen-mind' }">Kopen Mind</RouterLink>
      </div>
      <div>
        <h4>{{ $t('footer.guides') }}</h4>
        <RouterLink :to="{ name: 'seo-create' }">{{ $t('guides.create.nav') }}</RouterLink>
        <RouterLink :to="{ name: 'seo-legal' }">{{ $t('guides.legal.nav') }}</RouterLink>
        <RouterLink :to="{ name: 'seo-invest' }">{{ $t('guides.invest.nav') }}</RouterLink>
        <RouterLink :to="{ name: 'seo-business' }">{{ $t('guides.business.nav') }}</RouterLink>
        <RouterLink :to="{ name: 'seo-brand' }">{{ $t('guides.brand.nav') }}</RouterLink>
      </div>
      <div>
        <h4>{{ $t('footer.spaces') }}</h4>
        <RouterLink :to="{ name: 'login' }">{{ $t('footer.fellows') }}</RouterLink>
        <RouterLink :to="{ name: 'investor-login' }" :title="$t('kia.fullName')">{{ $t('footer.kia') }}</RouterLink>
        <RouterLink :to="{ name: 'staff-login' }">{{ $t('footer.team') }}</RouterLink>
      </div>
      <div>
        <h4>{{ $t('footer.contact') }}</h4>
        <span class="text-muted">{{ contact.cities.join(' · ') }}</span>
        <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
        <h4 class="follow">{{ $t('footer.follow') }}</h4>
        <ul class="socials">
          <li v-for="s in socials" :key="s.id">
            <a :href="s.url || undefined" :class="{ soon: !s.url }" target="_blank" rel="noopener" :aria-label="s.label" :title="s.url ? s.label : `${s.label} · ${$t('common.soon')}`">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="ICONS[s.id]" fill="currentColor" /></svg><span>{{ s.label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="container legal">
      <span>© {{ year }} K-Enterprise Counsel</span>
      <span>{{ $t('footer.disclaimer') }}</span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.ftr { position: relative; padding: 0 0 6.5rem; background: linear-gradient(#1a110b, #120b07); margin-top: 2.5rem; }
.frieze {
  height: 26px; margin-bottom: 3rem; opacity: .85;
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='26'%3E%3Crect width='52' height='26' fill='%23a8401f'/%3E%3Cpath d='M0 13h8l5-8 5 16 5-16 5 16 5-16 5 8h14' stroke='%231a110b' stroke-width='2.2' fill='none'/%3E%3Ccircle cx='46' cy='6' r='1.6' fill='%23f5ecdb'/%3E%3Ccircle cx='46' cy='20' r='1.6' fill='%23f5ecdb'/%3E%3C/svg%3E") repeat-x;
}
.grid-f {
  display: grid; gap: 2rem; grid-template-columns: 1fr;
  @include sm-up { grid-template-columns: 1fr 1fr; }
  @include md-up { grid-template-columns: 1.4fr 1fr 1fr 1fr 1.1fr; }
  > div { display: flex; flex-direction: column; gap: .5rem; }
  h4 { font-family: var(--font-body); font-size: .78rem; letter-spacing: .2em; text-transform: uppercase; color: var(--kec-gold); margin-bottom: .4rem; }
  .follow { margin-top: .8rem; }
  a { color: var(--kec-ivory); font-size: .92rem; &:hover { color: var(--kec-gold-soft); } }
}
.socials { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: .4rem;
  a { display: inline-flex; align-items: center; gap: .4rem; font-size: .78rem; padding: .3rem .65rem .3rem .5rem; border-radius: 999px; border: 1px solid var(--kec-border); background: rgba(255, 255, 255, .03); }
  a:hover { border-color: var(--kec-gold); }
  a.soon { opacity: .75; cursor: default; }
  svg { width: 16px; height: 16px; color: var(--kec-gold); } }
.mission { max-width: 34ch; margin-top: 1rem; font-size: .92rem; }
.legal { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .75rem; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--kec-border); font-size: .78rem; color: var(--kec-text-muted); }
</style>

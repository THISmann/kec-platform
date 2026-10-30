<script setup>
/**
 * Sélecteur de langue : dix langues (définies dans app.config.js), chacune
 * dans sa propre écriture, sur deux colonnes.
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ENABLED_LOCALES } from '@/config/app.config'
import { setLocale } from '@/i18n'

const { locale } = useI18n()
const open = ref(false)
async function choose(code) {
  open.value = false
  await setLocale(code)
}
</script>

<template>
  <div class="lang" @keydown.escape="open = false">
    <button type="button" class="current" :aria-expanded="open" aria-haspopup="listbox" :aria-label="$t('nav.language')" @click="open = !open">
      <span class="globe" aria-hidden="true">◍</span>{{ locale.toUpperCase() }}
    </button>
    <Transition name="drop">
      <ul v-if="open" class="menu" role="listbox" :aria-label="$t('nav.language')">
        <li v-for="l in ENABLED_LOCALES" :key="l.code">
          <button type="button" role="option" :lang="l.code" :aria-selected="l.code === locale" :class="{ on: l.code === locale }" @click="choose(l.code)">
            <span class="code">{{ l.flag }}</span>{{ l.label }}
          </button>
        </li>
      </ul>
    </Transition>
    <div v-if="open" class="backdrop" @click="open = false" />
  </div>
</template>

<style scoped lang="scss">
.lang { position: relative; }
.current {
  display: inline-flex; align-items: center; gap: .4rem; padding: .45rem .8rem; border-radius: 999px;
  background: rgba(255, 255, 255, .04); border: 1px solid var(--kec-border); color: var(--kec-ivory); font-weight: 700; font-size: .82rem;
  &:hover { border-color: var(--kec-gold); }
}
.globe { color: var(--kec-gold); }
.menu {
  position: absolute; inset-inline-end: 0; top: calc(100% + .5rem); z-index: 60; list-style: none; margin: 0; padding: .4rem;
  min-width: 330px; display: grid; grid-template-columns: 1fr 1fr; gap: .1rem;
  background: #2c1c12; border: 1px solid var(--kec-border); border-radius: 16px; box-shadow: var(--shadow-soft);
  button { width: 100%; display: flex; gap: .7rem; align-items: center; padding: .55rem .7rem; border: 0; border-radius: 10px; background: none; color: var(--kec-ivory); text-align: start; font-size: .9rem; }
  button:hover, button.on { background: rgba(214, 165, 72, .12); }
  .code { font-size: .7rem; font-weight: 800; color: var(--kec-gold); width: 22px; }
  @media (max-width: 400px) { min-width: 0; width: calc(100vw - 2rem); grid-template-columns: 1fr 1fr; }
}
.backdrop { position: fixed; inset: 0; z-index: 50; }
.drop-enter-active, .drop-leave-active { transition: all .25s var(--ease-out); }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }
</style>

/**
 * ─────────────────────────────────────────────────────────────
 *  Internationalisation (vue-i18n, Composition API)
 * ─────────────────────────────────────────────────────────────
 * - Le français est chargé immédiatement (langue par défaut & fallback).
 * - Les autres langues sont chargées à la demande (code-splitting) :
 *   ajouter une langue = créer locales/<code>.json + l'activer dans
 *   src/config/app.config.js. Rien d'autre à toucher.
 */
import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import { APP_CONFIG, ENABLED_LOCALES } from '@/config/app.config'

const STORAGE_KEY = 'kec.locale'
const loaders = import.meta.glob('./locales/*.json')

function detectLocale() {
  const saved = (() => { try { return localStorage.getItem(STORAGE_KEY) } catch { return null } })()
  const candidates = [saved, ...(navigator.languages || [navigator.language])].filter(Boolean)
  for (const c of candidates) {
    const code = c.slice(0, 2).toLowerCase()
    if (ENABLED_LOCALES.some((l) => l.code === code)) return code
  }
  return APP_CONFIG.defaultLocale
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: { fr },
  missingWarn: false,
  fallbackWarn: false
})

/** Charge (si besoin) puis active une langue */
export async function setLocale(code) {
  if (!ENABLED_LOCALES.some((l) => l.code === code)) code = APP_CONFIG.defaultLocale
  if (!i18n.global.availableLocales.includes(code)) {
    const loader = loaders[`./locales/${code}.json`]
    if (loader) i18n.global.setLocaleMessage(code, (await loader()).default)
  }
  i18n.global.locale.value = code
  document.documentElement.lang = code
  // Sens d'écriture : l'arabe se lit de droite à gauche (dir déclaré dans app.config.js)
  document.documentElement.dir = ENABLED_LOCALES.find((l) => l.code === code)?.dir ?? 'ltr'
  try { localStorage.setItem(STORAGE_KEY, code) } catch { /* ignore */ }
}

export async function initLocale() {
  await setLocale(detectLocale())
}

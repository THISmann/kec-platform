/** Formatage dépendant de la langue (montants FCFA, dates, nombres). */
export const intlLocale = (l) => ({ fr: 'fr-FR', en: 'en-GB', de: 'de-DE', es: 'es-ES', ru: 'ru-RU', ln: 'fr-FR', sw: 'sw-KE', pt: 'pt-PT', zh: 'zh-CN', ar: 'ar-MA' }[l] ?? l)

export const formatXaf = (amount, locale = 'fr') =>
  `${new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 0 }).format(amount ?? 0)} FCFA`

/** Format compact : 33 000 000 -> 33 M */
export const formatCompactXaf = (amount, locale = 'fr') =>
  `${new Intl.NumberFormat(intlLocale(locale), { notation: 'compact', maximumFractionDigits: 1 }).format(amount ?? 0)} FCFA`

export const formatNumber = (n, locale = 'fr') => new Intl.NumberFormat(intlLocale(locale)).format(n ?? 0)

export const formatDate = (iso, locale = 'fr', opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  iso ? new Intl.DateTimeFormat(intlLocale(locale), opts).format(new Date(iso)) : '·'

export const formatTime = (iso, locale = 'fr') =>
  new Intl.DateTimeFormat(intlLocale(locale), { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

/** "il y a 3 min" localisé */
export function timeAgo(iso, locale = 'fr') {
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: 'auto' })
  const diff = (new Date(iso).getTime() - Date.now()) / 1000
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]]
  for (const [unit, s] of units) {
    if (Math.abs(diff) >= s || unit === 'second') return rtf.format(Math.round(diff / s), unit)
  }
}

export const formatBytes = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} Mo` : `${Math.max(1, Math.round(b / 1024))} Ko`)

export const initials = (name = '') => name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

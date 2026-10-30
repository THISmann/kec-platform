#!/usr/bin/env node
/**
 * Contrôle des fichiers de langue (lancé avant chaque build : `npm run check:i18n`).
 *  - toutes les langues activées dans app.config.js ont un fichier locales/<code>.json ;
 *  - aucun tiret long (— –) : la charte KEC n'en veut pas dans les textes affichés ;
 *  - les variables {x} de chaque clé sont les mêmes que dans fr.json ;
 *  - les clés publiques (hors `bo.*` et `team.*`, qui restent en français pour
 *    l'équipe) manquantes sont listées : elles retombent sur le français.
 * Sortie non nulle si un fichier manque, si un tiret long traîne, ou si des
 * variables diffèrent. Les clés manquantes ne font qu'avertir.
 */
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'src/i18n/locales')
const cfg = readFileSync(join(root, 'src/config/app.config.js'), 'utf8')
const codes = [...cfg.matchAll(/\{\s*code:\s*'([a-z]{2})'/g)].map((m) => m[1])
const INTERNAL = ['bo.', 'team.']

const flat = (o, p = '', out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k
    if (v && typeof v === 'object') flat(v, key, out)
    else out[key] = v
  }
  return out
}
const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',')

const fr = flat(JSON.parse(readFileSync(join(dir, 'fr.json'), 'utf8')))
let errors = 0
for (const code of codes) {
  const file = join(dir, `${code}.json`)
  if (!existsSync(file)) { console.error(`✗ ${code}: fichier manquant (${file})`); errors++; continue }
  const msgs = flat(JSON.parse(readFileSync(file, 'utf8')))
  const dashes = Object.entries(msgs).filter(([, v]) => /[—–]/.test(String(v))).map(([k]) => k)
  const badVars = Object.keys(msgs).filter((k) => k in fr && vars(fr[k]) !== vars(msgs[k]))
  const missing = Object.keys(fr).filter((k) => !(k in msgs) && !INTERNAL.some((p) => k.startsWith(p)))
  const internalMissing = Object.keys(fr).filter((k) => !(k in msgs) && INTERNAL.some((p) => k.startsWith(p))).length
  if (dashes.length) { console.error(`✗ ${code}: tiret long dans ${dashes.length} clé(s) : ${dashes.slice(0, 5).join(', ')}`); errors++ }
  if (badVars.length) { console.error(`✗ ${code}: variables différentes de fr : ${badVars.slice(0, 5).join(', ')}`); errors++ }
  const note = missing.length ? ` · ${missing.length} clé(s) publique(s) retombent sur fr : ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? '…' : ''}` : ''
  console.log(`${missing.length ? '△' : '✓'} ${code}: ${Object.keys(msgs).length} clés${internalMissing ? ` (+${internalMissing} internes en fr)` : ''}${note}`)
}
if (errors) { console.error(`\n${errors} problème(s) i18n.`); process.exit(1) }
console.log('\ni18n OK')

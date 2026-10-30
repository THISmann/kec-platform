/**
 * Outils communs aux adaptateurs mock :
 * - latence simulée (pour voir les états de chargement comme en prod)
 * - génération d'identifiants
 * - clonage pour éviter que l'UI ne modifie la "base" par référence
 */
const LATENCY = Number(import.meta.env.VITE_MOCK_LATENCY ?? 450)

export const delay = (ms = LATENCY) =>
  new Promise((resolve) => setTimeout(resolve, ms * (0.6 + Math.random() * 0.8)))

export const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

export const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)))

/** Enveloppe une réponse mock : latence + copie profonde */
export async function respond(value, ms) {
  await delay(ms)
  return clone(value)
}

/** Générateur pseudo-aléatoire déterministe (seed) pour des données de démo stables */
export function seeded(seed = 42) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

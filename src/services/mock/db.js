/**
 * ─────────────────────────────────────────────────────────────
 *  Mini base de données mock, persistée dans localStorage.
 * ─────────────────────────────────────────────────────────────
 * Elle imite un backend : collections, insert/update/delete.
 * Les inscriptions faites dans la salle d'attente persistent donc
 * entre deux rechargements et apparaissent dans le back-office
 * et dans Kia.
 *
 * Réinitialiser les données de démo :  window.kecResetMock()
 */
import { buildSeed } from './seed'

const STORAGE_KEY = 'kec.mockdb.v4' // incrémenter quand la forme du seed change

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* stockage indisponible : on repart du seed */ }
  return buildSeed()
}

let data = load()

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* quota / mode privé */ }
}
persist()

export const db = {
  all: (col) => data[col] ?? [],
  find: (col, predicate) => (data[col] ?? []).filter(predicate),
  findOne: (col, predicate) => (data[col] ?? []).find(predicate) ?? null,
  get: (col, id) => (data[col] ?? []).find((r) => r.id === id) ?? null,

  insert(col, record) {
    data[col] = data[col] ?? []
    const row = JSON.parse(JSON.stringify(record)) // détache les objets réactifs de l'UI
    data[col].unshift(row)
    persist()
    return row
  },

  update(col, id, patch) {
    const row = db.get(col, id)
    if (!row) return null
    Object.assign(row, JSON.parse(JSON.stringify(patch)), { updatedAt: new Date().toISOString() })
    persist()
    return row
  },

  remove(col, id) {
    data[col] = (data[col] ?? []).filter((r) => r.id !== id)
    persist()
  },

  /** Compteurs atomiques (ex : numéro de ticket de la salle d'attente) */
  nextSequence(name) {
    data.sequences = data.sequences ?? {}
    data.sequences[name] = (data.sequences[name] ?? 0) + 1
    persist()
    return data.sequences[name]
  },

  reset() {
    data = buildSeed()
    persist()
  }
}

if (typeof window !== 'undefined') {
  window.kecResetMock = () => { db.reset(); location.reload() }
}

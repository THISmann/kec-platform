/** Compte entreprise & dossier de création — mock */
import { db } from '../../mock/db'
import { respond, uid } from '../../mock/mockUtils'
import { ApiError } from '../../http/ApiError'
import { APP_CONFIG } from '@/config/app.config'

const MILESTONE_KEYS = ['diagnostic', 'training', 'structuring', 'formalisation', 'finalDocs', 'postTraining', 'certification']
const now = () => new Date().toISOString()

/** Jalons prévisionnels d'un nouveau dossier (répartis sur la durée du programme) */
function defaultMilestones(start) {
  const span = (APP_CONFIG.program.durationMonths * 30.44 * 86400000) / MILESTONE_KEYS.length
  return MILESTONE_KEYS.map((key, i) => ({ key, done: i === 0, current: i === 1, dueDate: new Date(new Date(start).getTime() + (i + 1) * span).toISOString(), doneAt: i === 0 ? start : null }))
}

export const companyMock = {
  async getMine(userId) {
    const c = db.findOne('companies', (x) => x.ownerId === userId)
    return respond(c)
  },

  async saveDraft(userId, form) {
    let c = db.findOne('companies', (x) => x.ownerId === userId)
    if (!c) {
      const u = db.get('users', userId)
      const start = now()
      c = db.insert('companies', {
        id: uid('cmp'), ref: `KEC-CM-26-${String(u?.fellowNumber ?? 0).padStart(4, '0')}`, ownerId: userId, status: 'draft', certified: false,
        programStart: start, createdAt: start, form: {}, milestones: defaultMilestones(start), journal: [], internalNotes: [], assigneeId: null, assignee: null
      })
    }
    db.update('companies', c.id, { form: { ...c.form, ...form } })
    return respond(db.get('companies', c.id), 300)
  },

  async submit(userId, form) {
    const c = db.findOne('companies', (x) => x.ownerId === userId)
    if (!c) throw new ApiError('NOT_FOUND', 'errors.generic', 404)
    const u = db.get('users', userId)
    const first = !c.submittedAt
    db.update('companies', c.id, {
      form: { ...c.form, ...form },
      name: form.companyName || c.name,
      legalForm: form.legalForm || c.legalForm,
      country: form.country || c.country,
      city: form.city || c.city,
      sector: form.sector || c.sector,
      subSector: form.subSector || c.subSector,
      employees: form.employees ?? c.employees,
      revenueBracket: form.revenueBracket || c.revenueBracket,
      needs: form.needs ?? c.needs,
      status: first ? 'submitted' : (c.status === 'draft' ? 'submitted' : c.status),
      submittedAt: now(),
      milestones: (c.milestones ?? defaultMilestones(c.programStart)).map((m, i) => (i <= 1 ? { ...m, done: true, current: false, doneAt: m.doneAt ?? now() } : { ...m, current: i === 2 })),
      journal: [{ at: now(), type: 'submitted', text: first ? 'Dossier envoyé par l\'entrepreneur' : 'Dossier mis à jour par l\'entrepreneur', by: u?.name ?? 'Fellow' }, ...(c.journal ?? [])]
    })
    return respond(db.get('companies', c.id), 900)
  },

  /** Devis total affiché AVANT la collecte lourde (cahier des charges §5) */
  async quote({ legalForm, capitalXaf = 0 }) {
    const base = { ei: 45000, sarlu: 120000, sarl: 150000, sas: 180000, sasu: 160000, sa: 350000, gie: 90000 }[legalForm] ?? 150000
    const lines = [
      { key: 'kecFee', amount: base },
      { key: 'registry', amount: 41500 },
      { key: 'notary', amount: legalForm === 'ei' ? 0 : 60000 + Math.round(capitalXaf * 0.01) },
      { key: 'publication', amount: legalForm === 'ei' ? 0 : 25000 }
    ]
    return respond({ lines, total: lines.reduce((s, l) => s + l.amount, 0) }, 350)
  }
}

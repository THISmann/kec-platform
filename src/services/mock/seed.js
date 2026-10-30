/**
 * ─────────────────────────────────────────────────────────────
 *  Données de démonstration (Cameroun + diaspora)
 * ─────────────────────────────────────────────────────────────
 * Générées de façon déterministe : la démo est identique à chaque
 * réinitialisation, ce qui facilite les présentations client.
 *
 * Collections produites (= tables du futur backend) :
 *   users, team, waitlist, companies, documents, payments, bookings,
 *   threads (messagerie), suggestions, assistantLogs, assistantSettings,
 *   knowledgeOverrides, audit, sequences
 */
import { seeded } from './mockUtils'
import { APP_CONFIG } from '@/config/app.config'

const DAY = 86400000
const HOUR = 3600000

const FIRST = ['Awa', 'Brice', 'Clarisse', 'Dieudonné', 'Esther', 'Franck', 'Grâce', 'Hervé', 'Irène', 'Junior', 'Kevine', 'Landry',
  'Mireille', 'Nadège', 'Olivier', 'Patricia', 'Rodrigue', 'Sandrine', 'Thierry', 'Ulrich', 'Vanessa', 'William', 'Yannick', 'Zita',
  'Aïcha', 'Boris', 'Carine', 'Daniel', 'Estelle', 'Fabrice', 'Gisèle', 'Hamadou', 'Inès', 'Joël', 'Linda', 'Moussa', 'Nelly', 'Paul']
const LAST = ['Ngono', 'Mbarga', 'Tchoumi', 'Fotso', 'Nkoulou', 'Eto\'o', 'Abena', 'Kamga', 'Djoumessi', 'Ndongo', 'Owona', 'Bello',
  'Nana', 'Tagne', 'Essomba', 'Mbida', 'Hayatou', 'Atangana', 'Nguimfack', 'Talla', 'Onana', 'Manga', 'Zambo', 'Ekane', 'Moukoko']
const CITIES = ['Douala', 'Douala', 'Douala', 'Yaoundé', 'Yaoundé', 'Yaoundé', 'Bafoussam', 'Edéa', 'Kribi', 'Bamenda', 'Garoua', 'Buea', 'Ngaoundéré', 'Dschang', 'Ebolowa']
const RESIDENCE = ['Cameroun', 'Cameroun', 'Cameroun', 'Cameroun', 'Cameroun', 'France', 'Allemagne', 'Belgique', 'Canada', 'États-Unis', 'Suisse']
const SECTORS = ['agri', 'commerce', 'tech', 'services', 'transport', 'construction', 'health', 'education', 'craft', 'fashion', 'food']
const CHANNELS = ['linkedin', 'wordOfMouth', 'wordOfMouth', 'facebook', 'facebook', 'fieldAgent', 'whatsapp', 'tiktok', 'event']
const STAGES = ['idea', 'idea', 'informal', 'informal', 'existing']
const NEEDS = ['legal', 'tax', 'accounting', 'funding', 'hr', 'contracts', 'ip', 'commercial']
const PROJECTS = [
  'Transformation du manioc en farine et bâtons',
  'Atelier de couture wax haut de gamme',
  'Application de livraison de repas à Douala',
  'Cabinet de conseil en comptabilité pour PME',
  'Ferme avicole moderne',
  'Export de café de l\'Ouest torréfié',
  'Agence de transport inter-urbain',
  'École de code pour jeunes',
  'Cosmétiques naturels au beurre de karité',
  'Quincaillerie et matériaux de construction',
  'Plateforme e-commerce d\'artisanat',
  'Production de jus de fruits locaux'
]

const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)]
const iso = (ms) => new Date(ms).toISOString()
/** Date calendaire (YYYY-MM-DD) à J+n, en heure locale */
const dayAt = (now, offsetDays) => { const d = new Date(now + offsetDays * DAY); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }

/* ─────────────────────────────────────────────────────────────
 *  Équipe KEC (rôles, droits, 2FA) — pilote la gestion des rôles
 * ──────────────────────────────────────────────────────────── */
function buildTeam(now) {
  return [
    { id: 'usr_staff', name: 'Kengne Manuella', email: 'equipe@kec.africa', role: 'admin', title: 'Fondatrice & directrice', status: 'active', twoFactor: true, lastLoginAt: iso(now - 2 * HOUR), joinedAt: iso(now - 200 * DAY), initialsColor: '#d6a548' },
    { id: 'tm_paul', name: 'Paul Nkeng', email: 'paul@kec.africa', role: 'manager', title: 'Opérations & qualité', status: 'active', twoFactor: true, lastLoginAt: iso(now - 26 * HOUR), joinedAt: iso(now - 190 * DAY), initialsColor: '#c0612f' },
    { id: 'tm_sandrine', name: 'Sandrine Tchami', email: 'sandrine@kec.africa', role: 'agent', title: 'Chargée de dossiers', status: 'active', twoFactor: true, lastLoginAt: iso(now - 40 * 60000), joinedAt: iso(now - 120 * DAY), initialsColor: '#8b8f5a' },
    { id: 'tm_ndjock', name: 'Me Ndjock', email: 'ndjock@kec.africa', role: 'consultant', title: 'Consultant · droit des sociétés', speciality: 'corporate', languages: ['fr', 'en'], status: 'active', twoFactor: false, lastLoginAt: iso(now - 3 * DAY), joinedAt: iso(now - 150 * DAY), initialsColor: '#9e3d35' },
    { id: 'tm_fouda', name: 'Mme Fouda', email: 'fouda@kec.africa', role: 'consultant', title: 'Consultante · fiscalité', speciality: 'tax', languages: ['fr'], status: 'active', twoFactor: true, lastLoginAt: iso(now - 5 * DAY), joinedAt: iso(now - 140 * DAY), initialsColor: '#5f6436' },
    { id: 'tm_weber', name: 'Dr. Weber-Mballa', email: 'weber@kec.africa', role: 'consultant', title: 'Consultante · investissement & diaspora', speciality: 'investment', languages: ['fr', 'de', 'en'], status: 'active', twoFactor: true, lastLoginAt: iso(now - 9 * DAY), joinedAt: iso(now - 100 * DAY), initialsColor: '#22344f' },
    { id: 'tm_lydie', name: 'Lydie Kouam', email: 'lydie@kec.africa', role: 'viewer', title: 'Référente juridique & conformité', status: 'active', twoFactor: true, lastLoginAt: iso(now - 12 * DAY), joinedAt: iso(now - 90 * DAY), initialsColor: '#b9a58b' },
    { id: 'tm_yvan', name: 'Yvan Mbappe', email: 'yvan@kec.africa', role: 'agent', title: 'Agent de terrain · Ouest', status: 'invited', twoFactor: false, lastLoginAt: null, joinedAt: iso(now - 2 * DAY), initialsColor: '#d98a55' }
  ]
}

/* ─────────────────────────────────────────────────────────────
 *  Fellows & dossiers d'entreprise (10 dossiers à différents stades)
 * ──────────────────────────────────────────────────────────── */
const MILESTONE_KEYS = ['diagnostic', 'training', 'structuring', 'formalisation', 'finalDocs', 'postTraining', 'certification']

/** Jalons avec dates prévisionnelles (§5 : suivi avec dates et interlocuteur nommé) */
function milestones(now, programStart, doneCount, { certified = false } = {}) {
  const start = new Date(programStart).getTime()
  const span = (APP_CONFIG.program.durationMonths * 30.44 * DAY) / MILESTONE_KEYS.length
  return MILESTONE_KEYS.map((key, i) => {
    const due = start + (i + 1) * span
    const done = certified || i < doneCount
    return {
      key,
      done,
      current: !done && i === doneCount && !certified,
      dueDate: iso(due),
      doneAt: done ? iso(Math.min(due - span * 0.2 + (i % 3) * DAY, now - DAY)) : null
    }
  })
}

const FELLOWS = [
  // [id, prénom nom, email, n° fellow, entreprise, forme, ville, secteur, sous-secteur, salariés, CA, statut, interlocuteur, mois écoulés, jalons faits, certifié, résidence]
  { id: 'usr_fellow', name: 'Awa Ngono', email: 'awa@kec.africa', fellowNumber: 17, company: 'Ngono Agro SARL', legalForm: 'sarl', city: 'Douala', sector: 'agri', subSector: 'Transformation du manioc', employees: 6, revenue: '10-50M', status: 'in_review', assignee: 'usr_staff', monthsIn: 3.7, done: 3, residence: 'Cameroun', activity: 'Transformation et vente de produits dérivés du manioc', address: 'Rue Joss, Bonanjo', capital: 1000000, partners: [{ name: 'Awa Ngono', share: 70 }, { name: 'Brice Mbarga', share: 30 }], needs: ['legal', 'funding', 'contracts'] },
  { id: 'usr_brice', name: 'Brice Mbarga', email: 'brice@kec.africa', fellowNumber: 4, company: 'Mbarga Wax Atelier SAS', legalForm: 'sas', city: 'Yaoundé', sector: 'fashion', subSector: 'Couture wax haut de gamme', employees: 4, revenue: '0-10M', status: 'docs_requested', assignee: 'tm_sandrine', monthsIn: 3.9, done: 3, residence: 'France', activity: 'Création et vente de vêtements en wax, prêt-à-porter et sur mesure', address: 'Quartier Bastos, rue 1.750', capital: 2000000, partners: [{ name: 'Brice Mbarga', share: 60 }, { name: 'Nadège Mbarga', share: 40 }], needs: ['legal', 'ip', 'commercial'] },
  { id: 'usr_clarisse', name: 'Clarisse Fotso', email: 'clarisse@kec.africa', fellowNumber: 31, company: 'Fotso Delivery SARLU', legalForm: 'sarlu', city: 'Douala', sector: 'tech', subSector: 'Livraison de repas', employees: 9, revenue: '10-50M', status: 'submitted', assignee: null, monthsIn: 3.5, done: 2, residence: 'Cameroun', activity: 'Plateforme mobile de livraison de repas et de courses', address: 'Akwa, boulevard de la Liberté', capital: 500000, partners: [{ name: 'Clarisse Fotso', share: 100 }], needs: ['legal', 'tax', 'funding'] },
  { id: 'usr_dieudonne', name: 'Dieudonné Kamga', email: 'dieudonne@kec.africa', fellowNumber: 2, company: 'Kamga Compta Conseil', legalForm: 'ei', city: 'Bafoussam', sector: 'services', subSector: 'Comptabilité PME', employees: 2, revenue: '0-10M', status: 'created', assignee: 'tm_paul', monthsIn: 4.6, done: 5, residence: 'Cameroun', activity: 'Tenue de comptabilité et conseil de gestion pour PME', address: 'Marché A, Bafoussam', capital: 0, partners: [{ name: 'Dieudonné Kamga', share: 100 }], needs: ['legal', 'commercial'], rccm: 'RC/BAF/2026/A/1142', niu: 'P098700234561K' },
  { id: 'usr_esther', name: 'Esther Nkoulou', email: 'esther@kec.africa', fellowNumber: 9, company: 'Nkoulou Ferme Avicole SARL', legalForm: 'sarl', city: 'Edéa', sector: 'agri', subSector: 'Élevage de volaille', employees: 12, revenue: '10-50M', status: 'filed', assignee: 'usr_staff', monthsIn: 4.2, done: 4, residence: 'Cameroun', activity: 'Élevage, abattage et commercialisation de volaille', address: 'Route de Kribi, Edéa', capital: 3000000, partners: [{ name: 'Esther Nkoulou', share: 50 }, { name: 'Thierry Nkoulou', share: 50 }], needs: ['legal', 'funding', 'hr'] },
  { id: 'usr_franck', name: 'Franck Tchoumi', email: 'franck@kec.africa', fellowNumber: 22, company: 'Tchoumi Coffee Export SAS', legalForm: 'sas', city: 'Dschang', sector: 'agri', subSector: 'Café torréfié · export', employees: 7, revenue: '50-250M', status: 'in_review', assignee: 'tm_sandrine', monthsIn: 3.6, done: 3, residence: 'Allemagne', activity: 'Torréfaction et exportation de café arabica de l\'Ouest', address: 'Foto, Dschang', capital: 5000000, partners: [{ name: 'Franck Tchoumi', share: 55 }, { name: 'Lena Tchoumi-Weber', share: 45 }], needs: ['legal', 'tax', 'contracts', 'commercial'] },
  { id: 'usr_grace', name: 'Grâce Abena', email: 'grace@kec.africa', fellowNumber: 1, company: 'Abena Code School SARL', legalForm: 'sarl', city: 'Yaoundé', sector: 'education', subSector: 'Formation numérique', employees: 5, revenue: '10-50M', status: 'created', assignee: 'tm_paul', monthsIn: 6.4, done: 7, certified: true, residence: 'Cameroun', activity: 'École de programmation et d\'entrepreneuriat numérique pour jeunes', address: 'Nkolbisson, Yaoundé', capital: 1500000, partners: [{ name: 'Grâce Abena', share: 80 }, { name: 'Kevin Abena', share: 20 }], needs: ['legal', 'hr', 'ip'], rccm: 'RC/YAO/2026/B/0871', niu: 'M062300118877L' },
  { id: 'usr_herve', name: 'Hervé Djoumessi', email: 'herve@kec.africa', fellowNumber: 48, company: 'Karité Douceur', legalForm: 'sarlu', city: 'Bamenda', sector: 'health', subSector: 'Cosmétiques naturels', employees: 3, revenue: '0-10M', status: 'draft', assignee: null, monthsIn: 2.1, done: 1, residence: 'Belgique', activity: 'Fabrication de cosmétiques au beurre de karité', address: '', capital: 300000, partners: [{ name: 'Hervé Djoumessi', share: 100 }], needs: ['legal', 'ip'] },
  { id: 'usr_irene', name: 'Irène Ndongo', email: 'irene@kec.africa', fellowNumber: 13, company: 'Ndongo BTP Matériaux SARL', legalForm: 'sarl', city: 'Kribi', sector: 'construction', subSector: 'Matériaux de construction', employees: 8, revenue: '50-250M', status: 'docs_requested', assignee: 'tm_paul', monthsIn: 4.0, done: 3, residence: 'Cameroun', activity: 'Vente de matériaux de construction et quincaillerie', address: 'Carrefour Kingué, Kribi', capital: 4000000, partners: [{ name: 'Irène Ndongo', share: 65 }, { name: 'Paul Ndongo', share: 35 }], needs: ['legal', 'accounting', 'contracts'] },
  { id: 'usr_junior', name: 'Junior Owona', email: 'junior@kec.africa', fellowNumber: 36, company: 'Owona Artisanat Online SAS', legalForm: 'sas', city: 'Douala', sector: 'craft', subSector: 'E-commerce artisanat', employees: 3, revenue: '0-10M', status: 'in_review', assignee: 'usr_staff', monthsIn: 3.4, done: 2, residence: 'Canada', activity: 'Vente en ligne d\'artisanat camerounais à la diaspora', address: 'Bonapriso, rue Njo-Njo', capital: 1000000, partners: [{ name: 'Junior Owona', share: 100 }], needs: ['legal', 'commercial', 'ip'] }
]

const JOURNAL_TEXT = {
  submitted: 'Dossier envoyé par l\'entrepreneur',
  assigned: 'Dossier assigné à {name}',
  doc_verified: 'Pièce validée : {doc}',
  doc_rejected: 'Pièce refusée : {doc} — {reason}',
  status: 'Statut du dossier : {status}',
  filed: 'Dossier déposé au greffe du tribunal de {city}',
  created: 'Entreprise immatriculée — RCCM {rccm}',
  certified: 'Compte entreprise certifié KEC ✦',
  note: '{text}'
}

function buildFellows(now, team) {
  const users = []
  const companies = []
  const documents = []
  const byId = (id) => team.find((m) => m.id === id)

  FELLOWS.forEach((f, idx) => {
    const programStart = iso(now - f.monthsIn * 30.44 * DAY)
    const companyId = idx === 0 ? 'cmp_awa' : `cmp_${f.id.replace('usr_', '')}`
    users.push({ id: f.id, role: 'fellow', name: f.name, email: f.email, password: 'fellow110', companyId, fellowNumber: f.fellowNumber, language: f.residence === 'Allemagne' ? 'de' : f.residence === 'Canada' ? 'en' : 'fr', residenceCountry: f.residence, phone: `+237 6${50 + idx} ${100 + idx * 7} ${200 + idx * 11}` })

    const assignee = f.assignee ? byId(f.assignee) : null
    const docs = buildDocuments(now, companyId, f)
    documents.push(...docs)

    // Journal du dossier (historique visible par l'équipe ET par le fellow)
    const journal = []
    const t0 = new Date(programStart).getTime() + 12 * DAY
    if (f.status !== 'draft') journal.push({ at: iso(t0), type: 'submitted', text: JOURNAL_TEXT.submitted, by: f.name })
    if (assignee) journal.push({ at: iso(t0 + 1 * DAY), type: 'assigned', text: JOURNAL_TEXT.assigned.replace('{name}', assignee.name), by: 'Kengne Manuella' })
    docs.filter((d) => d.status === 'verified').forEach((d, i) => journal.push({ at: iso(t0 + (2 + i) * DAY), type: 'doc_verified', text: JOURNAL_TEXT.doc_verified.replace('{doc}', d.name), by: assignee?.name ?? 'Équipe KEC' }))
    docs.filter((d) => d.status === 'rejected').forEach((d) => journal.push({ at: d.reviewedAt, type: 'doc_rejected', text: JOURNAL_TEXT.doc_rejected.replace('{doc}', d.name).replace('{reason}', d.rejectionReason), by: assignee?.name ?? 'Équipe KEC' }))
    if (['filed', 'created'].includes(f.status)) journal.push({ at: iso(t0 + 20 * DAY), type: 'filed', text: JOURNAL_TEXT.filed.replace('{city}', f.city), by: assignee?.name ?? 'Équipe KEC' })
    if (f.status === 'created') journal.push({ at: iso(t0 + 34 * DAY), type: 'created', text: JOURNAL_TEXT.created.replace('{rccm}', f.rccm), by: assignee?.name ?? 'Équipe KEC' })
    if (f.certified) journal.push({ at: iso(now - 6 * DAY), type: 'certified', text: JOURNAL_TEXT.certified, by: 'Paul Nkeng' })
    journal.sort((a, b) => b.at.localeCompare(a.at))

    companies.push({
      id: companyId,
      ref: `KEC-CM-26-${String(f.fellowNumber).padStart(4, '0')}`,
      ownerId: f.id,
      name: f.company,
      legalForm: f.legalForm,
      country: 'CM',
      city: f.city,
      sector: f.sector,
      subSector: f.subSector,
      employees: f.employees,
      revenueBracket: f.revenue,
      needs: f.needs,
      status: f.status,
      assigneeId: assignee?.id ?? null,
      assignee: assignee?.name ?? null,
      certified: !!f.certified,
      certifiedAt: f.certified ? iso(now - 6 * DAY) : null,
      programStart,
      rccm: f.rccm ?? null,
      niu: f.niu ?? null,
      expectedCreationDate: iso(new Date(programStart).getTime() + 4.2 * 30.44 * DAY),
      milestones: milestones(now, programStart, f.done, { certified: f.certified }),
      journal,
      internalNotes: idx === 0 ? [{ at: iso(now - 2 * DAY), by: 'Kengne Manuella', text: 'Capital libéré à 100 % — vérifier l\'attestation de dépôt bancaire avant dépôt au greffe.' }] : [],
      form: {
        companyName: f.company, legalForm: f.legalForm, country: 'CM', city: f.city, sector: f.sector, subSector: f.subSector,
        address: f.address, capitalXaf: f.capital, activity: f.activity, employees: f.employees, revenueBracket: f.revenue,
        partners: f.partners, manager: f.name, needs: f.needs, payerIsBeneficiary: f.residence === 'Cameroun', payerName: f.residence === 'Cameroun' ? '' : f.name, payerRelation: ''
      },
      submittedAt: f.status === 'draft' ? null : iso(t0),
      createdAt: programStart
    })
  })
  return { users, companies, documents }
}

/** Pièces du coffre-fort selon l'avancement du dossier */
function buildDocuments(now, companyId, f) {
  const base = new Date(now - f.monthsIn * 30.44 * DAY).getTime() + 10 * DAY
  const n = f.fellowNumber
  const docs = []
  const add = (kind, name, size, mime, status, extra = {}, offset = 0) => docs.push({ id: `doc_${companyId}_${kind}_${docs.length}`, companyId, kind, name, size, mime, status, uploadedAt: iso(base + offset * DAY), ...extra })

  if (f.status === 'draft') { add('cni', `CNI_${f.name.split(' ')[1]}.jpg`, 410000 + n * 1000, 'image/jpeg', 'uploaded', {}, 0); return docs }

  add('cni', `CNI_${f.name.replace(' ', '_')}.pdf`, 482113 + n * 977, 'application/pdf', 'verified', { reviewedAt: iso(base + 2 * DAY) }, 0)
  add('locationPlan', `Plan_localisation_${f.city}.jpg`, 1302044 - n * 3000, 'image/jpeg', 'verified', { reviewedAt: iso(base + 2 * DAY) }, 1)
  add('photo', 'Photo_identite.jpg', 220011 + n * 500, 'image/jpeg', 'verified', { reviewedAt: iso(base + 3 * DAY) }, 1)
  if (f.status === 'docs_requested') {
    add('criminalRecord', 'Casier_judiciaire.pdf', 301002, 'application/pdf', 'rejected', { rejectionReason: 'Document illisible — merci de le reprendre en meilleure qualité.', reviewedAt: iso(now - 3 * DAY) }, 20)
    add('leaseContract', 'Bail_commercial_scan.pdf', 982331, 'application/pdf', 'uploaded', {}, 22)
  } else if (f.id === 'usr_fellow') {
    add('statutes', 'Projet_de_statuts_v2.pdf', 802331, 'application/pdf', 'uploaded', { issuedByKec: true }, 60)
    add('criminalRecord', 'Casier_judiciaire.pdf', 301002, 'application/pdf', 'rejected', { rejectionReason: 'Document illisible — merci de le reprendre en meilleure qualité.', reviewedAt: iso(now - 4 * DAY) }, 62)
  } else {
    add('criminalRecord', 'Casier_judiciaire.pdf', 288000 + n * 100, 'application/pdf', 'verified', { reviewedAt: iso(base + 6 * DAY) }, 4)
    if (['in_review', 'filed', 'created'].includes(f.status)) add('statutes', 'Statuts_signes.pdf', 912331, 'application/pdf', 'verified', { issuedByKec: true, reviewedAt: iso(base + 30 * DAY) }, 28)
    if (f.status === 'created') add('other', `RCCM_${f.rccm.replace(/\//g, '-')}.pdf`, 455000, 'application/pdf', 'verified', { issuedByKec: true, reviewedAt: iso(base + 36 * DAY) }, 35)
    if (f.status === 'submitted') { docs.pop(); add('criminalRecord', 'Casier_judiciaire.pdf', 288000, 'application/pdf', 'uploaded', {}, 4) }
  }
  return docs
}

/* ─────────────────────────────────────────────────────────────
 *  Rendez-vous consultants (historique complet : passés, à venir, annulés)
 * ──────────────────────────────────────────────────────────── */
function buildBookings(now, team, users) {
  const consultant = (id) => team.find((m) => m.id === id)
  const user = (id) => users.find((u) => u.id === id)
  const rate = APP_CONFIG.consultant.hourlyRateXaf
  const list = []
  let i = 0
  const add = (userId, consultantId, dayOffset, slot, durationMin, topic, status, extra = {}) => {
    const c = consultant(consultantId)
    const u = user(userId)
    const createdAt = iso(now + (dayOffset - 6 - (i % 4)) * DAY)
    list.push({
      id: `bk_${++i}`, userId, userName: u.name, companyId: u.companyId, fellowNumber: u.fellowNumber,
      consultantId, consultant: c.name, speciality: c.speciality,
      date: dayAt(now, dayOffset), slot, durationMin, topic,
      mode: extra.mode ?? (u.residenceCountry === 'Cameroun' ? 'office' : 'visio'),
      meetingLink: (extra.mode ?? (u.residenceCountry === 'Cameroun' ? 'office' : 'visio')) === 'visio' ? `https://meet.kec.africa/${c.name.split(' ').at(-1).toLowerCase()}-${u.fellowNumber}` : null,
      amount: Math.round((rate * durationMin) / 60),
      status,
      paymentId: ['confirmed', 'completed'].includes(status) || (status === 'cancelled' && extra.refund) ? `pay_bk_${i}` : null,
      createdAt,
      confirmedAt: ['confirmed', 'completed'].includes(status) || (status === 'cancelled' && extra.refund) ? iso(new Date(createdAt).getTime() + 15 * 60000) : null,
      completedAt: status === 'completed' ? iso(now + dayOffset * DAY + 11 * HOUR) : null,
      summary: extra.summary ?? null,
      notes: extra.notes ?? '',
      cancelledAt: status === 'cancelled' ? iso(now + (dayOffset - 2) * DAY) : null,
      cancelReason: extra.cancelReason ?? null,
      refund: extra.refund ?? null
    })
  }

  // Awa (compte démo) : un historique riche
  add('usr_fellow', 'tm_ndjock', -35, '10:30', 60, 'Choix SARL ou SAS pour Ngono Agro', 'completed', { mode: 'office', summary: 'SARL retenue (2 associés, gouvernance simple). Capital conseillé : 1 000 000 FCFA, libération intégrale. À prévoir : pacte d\'associés pour la clause de sortie.' })
  add('usr_fellow', 'tm_fouda', -12, '14:00', 30, 'Régime fiscal simplifié et TVA', 'completed', { mode: 'phone', summary: 'Régime simplifié accessible la 1re année. TVA non applicable sous le seuil ; tenir un livre de recettes dès le 1er jour. Rappel : déclaration DSF annuelle.' })
  add('usr_fellow', 'tm_ndjock', 2, '10:30', 60, 'Pacte d\'associés — clause de sortie et répartition 70/30', 'confirmed', { mode: 'visio', notes: 'Merci d\'apporter le projet de statuts v2.' })
  add('usr_fellow', 'tm_weber', 9, '14:00', 90, 'Financement diaspora et apport en nature (matériel de transformation)', 'confirmed', { mode: 'phone' })
  add('usr_fellow', 'tm_fouda', -20, '09:00', 60, 'Obligations CNPS des premiers salariés', 'cancelled', { cancelReason: 'Empêchement de dernière minute', refund: { type: 'credit', amount: 15000 } })
  add('usr_fellow', 'tm_ndjock', 5, '09:00', 30, 'Relecture des statuts v2 avant signature', 'awaiting_payment', { mode: 'visio' })

  // Autres fellows : agenda de l'équipe bien rempli
  add('usr_brice', 'tm_ndjock', 1, '09:00', 60, 'Protection de la marque et des modèles (wax)', 'confirmed')
  add('usr_brice', 'tm_weber', -8, '15:30', 60, 'Créer depuis Paris : procuration et signature à distance', 'completed', { summary: 'Procuration notariée à faire à Paris, légalisation au consulat. Signature électronique acceptée pour les statuts.' })
  add('usr_clarisse', 'tm_fouda', 3, '12:00', 30, 'Facturation et TVA sur commissions de livraison', 'confirmed')
  add('usr_dieudonne', 'tm_ndjock', -40, '10:30', 30, 'Établissement individuel : responsabilité et patrimoine', 'completed', { summary: 'EI confirmée pour démarrer ; passage en SARLU envisagé dès 10 M FCFA de CA.' })
  add('usr_esther', 'tm_fouda', 1, '15:30', 60, 'Fiscalité agricole et exonérations', 'confirmed')
  add('usr_esther', 'tm_ndjock', -15, '09:00', 60, 'Bail rural et contrat avec l\'abattoir', 'completed', { summary: 'Bail rural de 9 ans conseillé ; clause de renouvellement. Contrat d\'approvisionnement : pénalités de retard plafonnées.' })
  add('usr_franck', 'tm_weber', 4, '10:30', 90, 'Export de café vers l\'Allemagne : incoterms et change', 'confirmed', { mode: 'visio' })
  add('usr_franck', 'tm_fouda', 12, '14:00', 60, 'Régime fiscal de l\'exportateur', 'confirmed', { mode: 'visio' })
  add('usr_grace', 'tm_ndjock', -62, '14:00', 60, 'Contrats de formation et CGV', 'completed', { summary: 'CGV rédigées, clause de résiliation à 30 jours. Modèle de convention de stage fourni.' })
  add('usr_irene', 'tm_ndjock', 7, '12:00', 60, 'Contrats fournisseurs et garantie des matériaux', 'confirmed')
  add('usr_irene', 'tm_fouda', -4, '10:30', 30, 'Droits de douane sur le ciment importé', 'cancelled', { cancelReason: 'Reportée par la consultante', refund: { type: 'refund', amount: 7500 } })
  add('usr_junior', 'tm_weber', 2, '15:30', 60, 'Paiements internationaux et rapatriement des revenus', 'confirmed', { mode: 'visio' })
  add('usr_junior', 'tm_ndjock', 15, '09:00', 30, 'Mentions légales et CGV de la boutique en ligne', 'awaiting_payment', { mode: 'visio' })
  add('usr_herve', 'tm_ndjock', 6, '14:00', 60, 'SARLU ou EI pour une activité cosmétique', 'confirmed', { mode: 'visio' })
  return list
}

/* ─────────────────────────────────────────────────────────────
 *  Messagerie (fils de discussion fellow ⇄ équipe, escalades Manu…)
 * ──────────────────────────────────────────────────────────── */
function buildThreads(now, team, users) {
  const sla = APP_CONFIG.messaging.slaHours * HOUR
  const u = (id) => users.find((x) => x.id === id)
  const m = (id) => team.find((x) => x.id === id)
  let n = 0
  const msg = (from, author, text, at, extra = {}) => ({ id: `msg_${++n}`, from, author, text, at: iso(at), ...extra })

  const thread = ({ kind, subject, fellowId = null, fellowName = null, status, priority = 'normal', assigneeId = null, reason = null, tags = [], createdAgoH, messages, unreadStaff = 0, unreadFellow = 0 }) => {
    const createdAt = now - createdAgoH * HOUR
    const built = messages(createdAt)
    const last = built.at(-1)
    const fellow = fellowId ? u(fellowId) : null
    return {
      id: `thr_${fellowId ?? 'anon'}_${kind}_${createdAgoH}`,
      kind, subject, reason, tags, status, priority,
      fellowId, fellowName: fellow?.name ?? fellowName, companyId: fellow?.companyId ?? null, fellowNumber: fellow?.fellowNumber ?? null,
      assigneeId, assignee: assigneeId ? m(assigneeId).name : null,
      createdAt: iso(createdAt), updatedAt: last.at, lastMessageAt: last.at,
      slaDueAt: iso(createdAt + sla),
      firstResponseAt: built.find((x) => x.from === 'staff' && !x.internal)?.at ?? null,
      unreadStaff, unreadFellow,
      messages: built
    }
  }

  return [
    thread({
      kind: 'manu', subject: 'Question fiscale sur la TVA', fellowId: 'usr_fellow', status: 'open', priority: 'high', assigneeId: 'tm_fouda', reason: 'tax', tags: ['fiscal'], createdAgoH: 3, unreadStaff: 1,
      messages: (t) => [
        msg('fellow', 'Awa Ngono', 'Bonjour Manu, je vends déjà un peu de farine de manioc. Est-ce que je dois facturer la TVA à mes clients ?', t - 4 * 60000),
        msg('manu', 'Manu AI', 'Cette question mérite l\'avis d\'un professionnel de chez nous, je ne veux pas vous donner une réponse approximative. Je viens de transmettre votre demande à l\'équipe : un conseiller vous recontacte sous 4 heures ouvrées. 🙏🏾', t - 3 * 60000),
        msg('system', 'KEC', 'Conversation transmise à l\'équipe (motif : fiscal). Assignée à Mme Fouda.', t)
      ]
    }),
    thread({
      kind: 'dossier', subject: 'Casier judiciaire à reprendre', fellowId: 'usr_fellow', status: 'pending', assigneeId: 'usr_staff', tags: ['pièces'], createdAgoH: 4 * 24, unreadFellow: 1,
      messages: (t) => [
        msg('staff', 'Kengne Manuella', 'Bonjour Awa, votre extrait de casier judiciaire est illisible (le tampon couvre la date). Pouvez-vous le reprendre en meilleure qualité, idéalement scanné en PDF ? Le reste du dossier est complet, bravo.', t),
        msg('fellow', 'Awa Ngono', 'Merci Manuella, je repasse au tribunal jeudi pour un nouvel extrait. Je le dépose dans le coffre dès que je l\'ai.', t + 5 * HOUR),
        msg('staff', 'Kengne Manuella', 'Parfait. Dès réception, je programme le dépôt au greffe la semaine suivante.', t + 6 * HOUR),
        msg('staff', 'Kengne Manuella', 'Note interne : relancer si rien reçu lundi.', t + 6 * HOUR + 60000, { internal: true })
      ]
    }),
    thread({
      kind: 'consultant', subject: 'Rendez-vous confirmé : pacte d\'associés', fellowId: 'usr_fellow', status: 'closed', assigneeId: 'tm_ndjock', reason: 'booking', tags: ['rdv'], createdAgoH: 2 * 24,
      messages: (t) => [
        msg('system', 'KEC', 'Réservation payée (15 000 FCFA, MTN MoMo). Rendez-vous avec Me Ndjock, 60 min, en visio.', t),
        msg('staff', 'Me Ndjock', 'Bonjour Awa, j\'ai bien le créneau. Merci d\'apporter le projet de statuts v2 et la liste des apports de chaque associé. À bientôt.', t + 2 * HOUR),
        msg('fellow', 'Awa Ngono', 'C\'est noté, merci Maître.', t + 3 * HOUR)
      ]
    }),
    thread({
      kind: 'payment', subject: 'Reçu de l\'acompte programme', fellowId: 'usr_fellow', status: 'closed', assigneeId: 'tm_paul', tags: ['paiement'], createdAgoH: 100 * 24,
      messages: (t) => [
        msg('system', 'KEC', 'Acompte de 150 000 FCFA reçu via MTN MoMo (reçu RC-2026-0017). Solde de 150 000 FCFA attendu avant la création.', t),
        msg('fellow', 'Awa Ngono', 'Bonjour, est-ce que je peux payer le solde en deux fois ?', t + 2 * DAY),
        msg('staff', 'Paul Nkeng', 'Bonjour Awa, oui : vous pouvez régler le solde par tranches depuis la page Paiements, l\'important est que tout soit réglé avant le dépôt au greffe.', t + 2 * DAY + 3 * HOUR)
      ]
    }),
    thread({
      kind: 'manu', subject: 'Litige avec mon fournisseur de tissu', fellowId: 'usr_brice', status: 'open', priority: 'urgent', assigneeId: null, reason: 'litigation', tags: ['litige', 'SLA dépassé'], createdAgoH: 27, unreadStaff: 2,
      messages: (t) => [
        msg('fellow', 'Brice Mbarga', 'Mon fournisseur de wax a encaissé 800 000 FCFA et ne livre pas depuis 2 mois. Je veux le poursuivre, que faire ?', t - 2 * 60000),
        msg('manu', 'Manu AI', 'Cette question mérite l\'avis d\'un professionnel de chez nous, je ne veux pas vous donner une réponse approximative. Je viens de transmettre votre demande à l\'équipe : un conseiller vous recontacte sous 4 heures ouvrées. 🙏🏾', t - 60000),
        msg('system', 'KEC', 'Conversation transmise à l\'équipe (motif : litige). Non assignée.', t),
        msg('fellow', 'Brice Mbarga', 'Toujours sans réponse… c\'est urgent, la collection doit sortir en novembre.', t + 22 * HOUR)
      ]
    }),
    thread({
      kind: 'support', subject: 'Quel délai pour la création ?', fellowId: 'usr_clarisse', status: 'open', assigneeId: null, tags: ['délais'], createdAgoH: 6, unreadStaff: 1,
      messages: (t) => [msg('fellow', 'Clarisse Fotso', 'Bonjour, j\'ai envoyé mon dossier hier. À partir de quand aurai-je un interlocuteur et une date prévisionnelle de création ?', t)]
    }),
    thread({
      kind: 'dossier', subject: 'Numéro RCCM et attestation', fellowId: 'usr_dieudonne', status: 'closed', assigneeId: 'tm_paul', tags: ['RCCM'], createdAgoH: 30 * 24,
      messages: (t) => [
        msg('staff', 'Paul Nkeng', 'Félicitations Dieudonné : Kamga Compta Conseil est immatriculée (RCCM RC/BAF/2026/A/1142). L\'attestation est dans votre coffre-fort.', t),
        msg('fellow', 'Dieudonné Kamga', 'Merci infiniment à toute l\'équipe ! 🙏🏾', t + HOUR)
      ]
    }),
    thread({
      kind: 'dossier', subject: 'Changement de gérant avant dépôt', fellowId: 'usr_esther', status: 'pending', priority: 'high', assigneeId: 'usr_staff', tags: ['statuts'], createdAgoH: 2 * 24, unreadStaff: 1,
      messages: (t) => [
        msg('fellow', 'Esther Nkoulou', 'Bonjour, finalement c\'est mon frère Thierry qui sera gérant. Peut-on modifier les statuts avant le dépôt ?', t),
        msg('staff', 'Kengne Manuella', 'Bonjour Esther, oui mais il faut agir vite : le dossier est déjà au greffe. Je demande le retrait et la correction des statuts, il me faut la CNI de Thierry.', t + 3 * HOUR),
        msg('fellow', 'Esther Nkoulou', 'CNI déposée dans le coffre ce matin.', t + 26 * HOUR)
      ]
    }),
    thread({
      kind: 'consultation', subject: 'DC-2026-0001 · Je veux ouvrir une boulangerie à Bafoussam avec mon frère', fellowName: 'Marthe Kuété', status: 'open', assigneeId: null, reason: 'consultationRequest', tags: ['consultation', 'FR', 'whatsapp'], createdAgoH: 2, unreadStaff: 1,
      messages: (t) => [
        msg('fellow', 'Marthe Kuété', 'Je veux ouvrir une boulangerie à Bafoussam avec mon frère qui vit à Lyon. On ne sait pas quelle forme choisir ni comment il peut être associé à distance.', t),
        msg('system', 'KEC', 'Demande de consultation DC-2026-0001 reçue depuis /. Contact : +237 6 99 00 00 00 · marthe.k@example.com · Cameroun. Canal souhaité : WhatsApp. Rappel attendu sous 24 h ouvrées.', t + 1000)
      ]
    }),
    thread({
      kind: 'manu', subject: 'Visiteur : « je comprends pas comment faire depuis l\'Allemagne »', fellowName: 'Visiteur (Berlin)', status: 'open', assigneeId: 'tm_weber', reason: 'notUnderstood', tags: ['diaspora', 'DE'], createdAgoH: 1.5, unreadStaff: 1,
      messages: (t) => [
        msg('fellow', 'Visiteur', 'ich bin in berlin, wie geht das genau mit der firma', t - 6 * 60000),
        msg('manu', 'Manu AI', 'Entschuldigung, das habe ich nicht ganz verstanden. Können Sie es anders formulieren oder ein Thema wählen?', t - 5 * 60000),
        msg('fellow', 'Visiteur', 'firma machen aus berlin???', t - 4 * 60000),
        msg('manu', 'Manu AI', 'Verzeihung, ich habe es immer noch nicht verstanden. Versuchen Sie andere Worte – ich höre zu.', t - 3 * 60000),
        msg('fellow', 'Visiteur', 'kann ich das von hier machen', t - 2 * 60000),
        msg('manu', 'Manu AI', 'Ich übergebe Sie lieber an jemanden aus dem Team, damit Sie keine Zeit verlieren. Ein Mensch übernimmt und antwortet innerhalb von 4 Geschäftsstunden.', t - 60000),
        msg('system', 'KEC', 'Transfert humain après 3 incompréhensions (langue : DE). Assigné à Dr. Weber-Mballa.', t)
      ]
    }),
    thread({
      kind: 'payment', subject: 'Virement envoyé mais non reçu', fellowId: 'usr_irene', status: 'open', priority: 'urgent', assigneeId: 'tm_paul', tags: ['virement'], createdAgoH: 20, unreadStaff: 1,
      messages: (t) => [
        msg('fellow', 'Irène Ndongo', 'J\'ai fait un virement de 300 000 FCFA il y a 4 jours (référence KEC-7HQ2PL) et mon espace indique toujours « virement attendu ».', t),
        msg('staff', 'Paul Nkeng', 'Bonjour Irène, je vérifie avec la banque ce matin et je vous confirme dans la journée.', t + 2 * HOUR),
        msg('staff', 'Paul Nkeng', 'Note interne : virement visible sur le relevé du 21, à rapprocher dans Paiements.', t + 2 * HOUR + 60000, { internal: true })
      ]
    }),
    thread({
      kind: 'consultant', subject: 'Préparer la session export café', fellowId: 'usr_franck', status: 'open', assigneeId: 'tm_weber', reason: 'booking', tags: ['rdv'], createdAgoH: 10, unreadStaff: 1,
      messages: (t) => [
        msg('system', 'KEC', 'Réservation payée (22 500 FCFA, Orange Money). Rendez-vous avec Dr. Weber-Mballa, 90 min, en visio.', t),
        msg('fellow', 'Franck Tchoumi', 'Guten Tag, können wir das Gespräch auf Deutsch führen? Meine Partnerin nimmt teil.', t + HOUR)
      ]
    }),
    thread({
      kind: 'manu', subject: 'Licenciement d\'un employé en période d\'essai', fellowId: 'usr_junior', status: 'closed', assigneeId: 'tm_ndjock', reason: 'social', tags: ['social'], createdAgoH: 5 * 24,
      messages: (t) => [
        msg('fellow', 'Junior Owona', 'Je veux licencier mon employé encore en période d\'essai, quelles sont les règles ?', t - 60000),
        msg('manu', 'Manu AI', 'Cette question mérite l\'avis d\'un professionnel de chez nous, je ne veux pas vous donner une réponse approximative. Je viens de transmettre votre demande à l\'équipe : un conseiller vous recontacte sous 4 heures ouvrées. 🙏🏾', t),
        msg('staff', 'Me Ndjock', 'Bonjour Junior, en période d\'essai la rupture est libre mais doit respecter un préavis et être notifiée par écrit. Je vous propose un rendez-vous de 30 min pour sécuriser la lettre.', t + 3 * HOUR),
        msg('fellow', 'Junior Owona', 'Merci, je réserve ça.', t + 5 * HOUR)
      ]
    }),
    thread({
      kind: 'support', subject: 'Certification obtenue — et après ?', fellowId: 'usr_grace', status: 'closed', assigneeId: 'tm_paul', tags: ['réseau'], createdAgoH: 5 * 24,
      messages: (t) => [
        msg('fellow', 'Grâce Abena', 'Merci pour la certification ! Comment rejoindre le réseau d\'entreprises KEC et être visible ?', t),
        msg('staff', 'Paul Nkeng', 'Bravo Grâce ✦ Votre profil certifié sera publié dans l\'annuaire KEC au lancement national. On vous propose aussi un témoignage vidéo, si vous êtes d\'accord.', t + 4 * HOUR)
      ]
    })
  ]
}

/* ─────────────────────────────────────────────────────────────
 *  Journal des conversations Manu (rapport d'activité, §7)
 * ──────────────────────────────────────────────────────────── */
const LOG_SAMPLES = {
  program: ['C\'est quoi le programme des 110 ?', 'How do I get selected for the 110?', 'Wie läuft die Auswahl ab?', 'Le programme dure combien de temps ?'],
  waitlist: ['Comment m\'inscrire sur la liste d\'attente ?', 'Is the waiting list still open?', 'Ich möchte mich anmelden'],
  legalForms: ['Différence entre SARL et SAS ?', 'What is a SARLU?', 'Welche Rechtsform für ein kleines Geschäft?', 'Je dois choisir quelle forme juridique ?'],
  documents: ['Quelles pièces je dois fournir ?', 'Do I need a criminal record?', 'Brauche ich einen Lageplan?'],
  price: ['Combien ça coûte ?', 'How much is the programme?', 'Was kostet die Gründung?', 'Le prix inclut le notaire ?'],
  payment: ['Je peux payer par Orange Money ?', 'Can I pay by bank transfer from Canada?', 'Zahlung per Überweisung möglich?'],
  timeline: ['Combien de temps pour créer ?', 'How long does incorporation take?', 'Wie lange dauert das?'],
  diaspora: ['Je vis en France, je peux créer à distance ?', 'I live in Berlin, can I do everything remotely?', 'Ich wohne in Hamburg'],
  vault: ['Mes documents sont-ils sécurisés ?', 'Where are my documents stored?'],
  country: ['Vous êtes présents à Bafoussam ?', 'Do you cover Yaoundé?', 'Nur Kamerun?'],
  human: ['Je veux parler à quelqu\'un', 'Can I talk to a human?', 'Ich möchte mit einem Berater sprechen'],
  greeting: ['Bonjour Manu', 'Hello', 'Hallo', 'Bonsoir'],
  thanks: ['Merci beaucoup', 'Thanks!', 'Danke'],
  escalate_tax: ['Je dois payer quelle TVA sur mes ventes ?', 'Quel impôt pour mon atelier ?', 'How much tax will I pay?', 'Welche Steuern fallen an?'],
  escalate_social: ['Comment licencier un employé ?', 'Obligations CNPS pour 3 salariés ?'],
  escalate_litigation: ['Mon associé refuse de signer, je veux aller au tribunal', 'Mon fournisseur ne livre pas, je veux porter plainte'],
  escalate_personalAdvice: ['Que dois-je choisir dans mon cas ?', 'Vous me conseillez quoi pour mon projet ?', 'What should I do in my case?'],
  escalate_urgent: ['C\'est urgent, le greffe ferme demain !'],
  fallback: ['azerty', 'ok et donc', 'bzzz', '???', 'je sais pas trop', 'hmm']
}

function buildAssistantLogs(now, rnd) {
  const logs = []
  const intents = Object.keys(LOG_SAMPLES)
  const weights = { program: 14, waitlist: 10, legalForms: 11, documents: 9, price: 12, payment: 6, timeline: 6, diaspora: 7, vault: 3, country: 4, human: 5, greeting: 8, thanks: 5, escalate_tax: 4, escalate_social: 2, escalate_litigation: 2, escalate_personalAdvice: 3, escalate_urgent: 1, fallback: 7 }
  const bag = intents.flatMap((k) => Array(weights[k]).fill(k))
  const total = 340
  let session = 0
  for (let i = 0; i < total; i++) {
    const ageDays = Math.pow(rnd(), 1.3) * 30
    const at = now - ageDays * DAY - rnd() * 6 * HOUR
    if (i % 3 === 0) session++
    const key = pick(rnd, bag)
    const sample = pick(rnd, LOG_SAMPLES[key])
    const locale = /[äöüß]|Wie|Ich|Welche|Danke|Hallo|Nur|Zahlung|Brauche/.test(sample) ? 'de' : /^(How|Can|Is|Do|What|Where|I |Hello|Thanks)/.test(sample) ? 'en' : 'fr'
    const escalated = key.startsWith('escalate_') || key === 'human'
    logs.push({
      id: `alog_${i}`, sessionId: `s_${session}`, at: iso(at), locale,
      role: rnd() > 0.72 ? 'fellow' : 'visitor',
      userMessage: sample,
      intent: key.startsWith('escalate_') ? 'escalate' : key,
      escalated,
      reason: key.startsWith('escalate_') ? key.replace('escalate_', '') : key === 'human' ? 'humanRequested' : null,
      misses: key === 'fallback' ? 1 + Math.floor(rnd() * 3) : 0,
      responseMs: 600 + Math.floor(rnd() * 1600),
      page: pick(rnd, ['/', '/', '/salle-d-attente', '/salle-d-attente', '/espace', '/kopen-mind'])
    })
  }
  logs.sort((a, b) => b.at.localeCompare(a.at))
  return logs
}

/** Paramètres de Manu administrables sans redéploiement (§7) */
function buildAssistantSettings(now) {
  return {
    id: 'assistant',
    displayName: 'Manu AI',
    tone: 'warm', // warm | formal | concise
    greetingOverride: Object.fromEntries(APP_CONFIG.locales.map((l) => [l.code, ''])),
    missesThreshold: 3,
    slaHours: APP_CONFIG.messaging.slaHours,
    escalation: { tax: true, social: true, criminal: true, litigation: true, urgent: true, personalAdvice: true },
    extraEscalationKeywords: ['redressement', 'saisie'],
    quickRepliesEnabled: true,
    teaserEnabled: true,
    teaserDelaySec: 6,
    degradedMode: false,
    workingHours: { start: '08:00', end: '18:00', days: [1, 2, 3, 4, 5] },
    offHoursNotice: true,
    logRetentionDays: 90,
    version: 3,
    updatedAt: iso(now - 9 * DAY),
    updatedBy: 'Kengne Manuella',
    history: [
      { version: 1, at: iso(now - 60 * DAY), by: 'Paul Nkeng', note: 'Configuration initiale' },
      { version: 2, at: iso(now - 31 * DAY), by: 'Kengne Manuella', note: 'Ajout des mots-clés « redressement », « saisie » à l\'escalade' },
      { version: 3, at: iso(now - 9 * DAY), by: 'Kengne Manuella', note: 'Seuil d\'incompréhension ramené à 3 (était 4)' }
    ]
  }
}

/** Journal d'audit des actions du back-office (§12) */
function buildAudit(now) {
  const rows = [
    [2 * HOUR, 'usr_staff', 'Kengne Manuella', 'login', 'Connexion au back-office', ''],
    [3 * HOUR, 'tm_sandrine', 'Sandrine Tchami', 'document.review', 'Pièce refusée', 'Casier_judiciaire.pdf (Mbarga Wax Atelier SAS)'],
    [5 * HOUR, 'tm_paul', 'Paul Nkeng', 'payment.confirm', 'Virement confirmé', 'KEC-9ZK4AA · 300 000 FCFA'],
    [26 * HOUR, 'usr_staff', 'Kengne Manuella', 'waitlist.status', 'Candidat retenu (110)', 'Mireille Talla · Douala'],
    [27 * HOUR, 'usr_staff', 'Kengne Manuella', 'waitlist.status', 'Candidat présélectionné', 'Olivier Nana · Yaoundé'],
    [2 * DAY, 'usr_staff', 'Kengne Manuella', 'team.invite', 'Invitation envoyée', 'Yvan Mbappe (agent)'],
    [3 * DAY, 'tm_paul', 'Paul Nkeng', 'dossier.status', 'Statut : déposé', 'Nkoulou Ferme Avicole SARL'],
    [6 * DAY, 'tm_paul', 'Paul Nkeng', 'dossier.certify', 'Compte certifié', 'Abena Code School SARL'],
    [9 * DAY, 'usr_staff', 'Kengne Manuella', 'manu.settings', 'Paramètres Manu modifiés (v3)', 'missesThreshold: 4 → 3'],
    [12 * DAY, 'tm_lydie', 'Lydie Kouam', 'export', 'Export CSV liste d\'attente', '231 lignes'],
    [15 * DAY, 'usr_staff', 'Kengne Manuella', 'team.role', 'Rôle modifié', 'Lydie Kouam : agent → viewer'],
    [20 * DAY, 'tm_sandrine', 'Sandrine Tchami', 'thread.reply', 'Réponse envoyée', 'Brice Mbarga · Procuration depuis Paris']
  ]
  return rows.map(([ago, actorId, actor, action, label, details], i) => ({ id: `aud_${i}`, at: iso(now - ago), actorId, actor, action, label, details }))
}

/* ─────────────────────────────────────────────────────────────
 *  Assemblage
 * ──────────────────────────────────────────────────────────── */
export function buildSeed() {
  const rnd = seeded(110)
  const now = Date.now()

  // ── Liste d'attente : ~260 inscrits répartis sur 45 jours, avec accélération récente
  const waitlist = []
  const total = 264
  for (let i = 0; i < total; i++) {
    const first = pick(rnd, FIRST)
    const last = pick(rnd, LAST)
    const residence = pick(rnd, RESIDENCE)
    const ageDays = Math.pow(rnd(), 1.7) * 45 // plus d'inscriptions récentes
    const createdAt = iso(now - ageDays * DAY - rnd() * DAY)
    const score = Math.round(40 + rnd() * 60)
    waitlist.push({
      id: `wl_seed_${i}`,
      ticket: 0, // numérotés après tri chronologique
      firstName: first,
      lastName: last,
      email: `${first}.${last}${i}`.toLowerCase().normalize('NFD').replace(/[^a-z0-9.]/g, '') + '@mail.cm',
      phone: `+237 6${Math.floor(50 + rnd() * 49)} ${Math.floor(100 + rnd() * 899)} ${Math.floor(100 + rnd() * 899)}`,
      residenceCountry: residence,
      isDiaspora: residence !== 'Cameroun',
      targetCountry: 'CM',
      targetCity: pick(rnd, CITIES),
      sector: pick(rnd, SECTORS),
      projectStage: pick(rnd, STAGES),
      projectSummary: pick(rnd, PROJECTS),
      acquisitionChannel: pick(rnd, CHANNELS),
      needs: NEEDS.filter(() => rnd() > 0.7),
      language: pick(rnd, ['fr', 'fr', 'fr', 'en', 'de']),
      consentMarketing: rnd() > 0.3,
      score,
      status: 'pending',
      createdAt
    })
  }
  waitlist.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  waitlist.forEach((w, i) => { w.ticket = i + 1 })

  // 38 déjà sélectionnés, 24 présélectionnés (les meilleurs scores parmi les plus anciens)
  const ranked = [...waitlist].slice(0, 180).sort((a, b) => b.score - a.score)
  ranked.slice(0, 38).forEach((w) => { w.status = 'selected' })
  ranked.slice(38, 62).forEach((w) => { w.status = 'shortlisted' })
  ranked.slice(170, 180).forEach((w) => { w.status = 'rejected' })
  waitlist.reverse() // plus récents en premier

  const team = buildTeam(now)
  const { users: fellowUsers, companies, documents } = buildFellows(now, team)

  // ── Paiements du programme : la plupart des sélectionnés ont payé (en totalité ou acompte)
  const payments = []
  waitlist.filter((w) => w.status === 'selected').forEach((w, i) => {
    if (i % 5 === 4) return // quelques-uns n'ont pas encore payé
    const method = pick(rnd, ['momo', 'momo', 'om', 'om', 'bank'])
    payments.push({
      id: `pay_seed_${i}`,
      payerName: `${w.firstName} ${w.lastName}`,
      waitlistId: w.id,
      purpose: 'program',
      amount: i % 3 === 0 ? 150000 : 300000,
      method,
      status: 'succeeded',
      reference: `KEC-${(240000 + i * 37).toString(36).toUpperCase()}`,
      receiptNo: `RC-2026-${String(1000 + i)}`,
      createdAt: iso(Math.min(new Date(w.createdAt).getTime() + 3 * DAY, now - (i + 1) * 5400000))
    })
  })

  // Paiements des fellows de démo (programme) — Awa n'a réglé que l'acompte : le solde est testable
  const programPay = (user, amount, method, ago, status = 'succeeded', extra = {}) => payments.unshift({
    id: `pay_${user.id}_${payments.length}`, userId: user.id, payerName: user.name, purpose: 'program', amount, method, status,
    reference: extra.reference ?? `KEC-${(user.fellowNumber * 7919).toString(36).toUpperCase()}`, receiptNo: status === 'succeeded' ? `RC-2026-${String(user.fellowNumber).padStart(4, '0')}` : null,
    createdAt: iso(now - ago), installment: extra.installment ?? null, ...extra
  })
  const F = (id) => fellowUsers.find((u) => u.id === id)
  programPay(F('usr_fellow'), 150000, 'momo', 112 * DAY, 'succeeded', { installment: 'deposit' })
  programPay(F('usr_brice'), 300000, 'bank', 115 * DAY)
  programPay(F('usr_clarisse'), 150000, 'om', 104 * DAY, 'succeeded', { installment: 'deposit' })
  programPay(F('usr_dieudonne'), 300000, 'momo', 138 * DAY)
  programPay(F('usr_esther'), 300000, 'om', 126 * DAY)
  programPay(F('usr_franck'), 300000, 'bank', 108 * DAY)
  programPay(F('usr_grace'), 300000, 'momo', 192 * DAY)
  programPay(F('usr_herve'), 150000, 'momo', 60 * DAY, 'succeeded', { installment: 'deposit' })
  programPay(F('usr_irene'), 300000, 'bank', 4 * DAY, 'awaiting_transfer', { reference: 'KEC-7HQ2PL' }) // à rapprocher par l'équipe
  programPay(F('usr_junior'), 300000, 'om', 100 * DAY)
  programPay(F('usr_junior'), 15000, 'om', 2 * DAY, 'failed', { purpose: 'consultant', failureReason: 'Solde insuffisant' })
  programPay(F('usr_herve'), 150000, 'bank', 1 * DAY, 'awaiting_transfer', { installment: 'balance', reference: 'KEC-BX11TR' })

  // ── Rendez-vous consultants + paiements associés
  const bookings = buildBookings(now, team, fellowUsers)
  bookings.filter((b) => b.paymentId).forEach((b) => {
    payments.push({
      id: b.paymentId, userId: b.userId, payerName: b.userName, purpose: 'consultant', bookingId: b.id, amount: b.amount,
      method: pick(rnd, ['momo', 'om', 'momo']), status: 'succeeded', reference: `KEC-${b.id.toUpperCase()}X`, receiptNo: `RC-2026-${String(3000 + Number(b.id.split('_')[1]))}`,
      createdAt: b.confirmedAt, refund: b.refund ?? null
    })
  })
  payments.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  // ── Comptes de démonstration (fellows + équipe + investisseur)
  const users = [
    ...fellowUsers,
    ...team.filter((m) => m.status === 'active').map((m) => ({ id: m.id, role: 'staff', name: m.name, email: m.email, password: 'kec2026', title: m.title, teamRole: m.role })),
    { id: 'usr_investor', role: 'investor', name: 'Jean-Paul Kia', email: 'kia@kec.africa', password: 'kia2026', ticketXaf: 25000000 }
  ]

  const suggestions = [
    { id: 'sug_1', message: 'Pouvez-vous ajouter des notifications WhatsApp pour le suivi du dossier ?', category: 'feature', author: 'Fellow #23', status: 'new', createdAt: iso(now - 2 * DAY) },
    { id: 'sug_2', message: 'L\'ambiance de la salle d\'attente m\'a rappelé la maison. Bravo !', category: 'praise', author: 'Anonyme', status: 'read', createdAt: iso(now - 5 * DAY) },
    { id: 'sug_3', message: 'Un guide PDF sur la différence SARL / SAS serait très utile.', category: 'content', author: 'Fellow #8', status: 'new', createdAt: iso(now - 1 * DAY) },
    { id: 'sug_4', message: 'Le paiement MoMo a mis longtemps à se confirmer hier soir.', category: 'problem', author: 'Fellow #31', contact: 'clarisse@kec.africa', status: 'new', createdAt: iso(now - 8 * HOUR) },
    { id: 'sug_5', message: 'Un espace d\'échange entre fellows (groupe WhatsApp ou forum) pour s\'entraider.', category: 'idea', author: 'Fellow #1', status: 'planned', createdAt: iso(now - 12 * DAY) }
  ]

  return {
    users, team, waitlist, payments, companies, documents, suggestions, bookings,
    threads: buildThreads(now, team, fellowUsers),
    assistantLogs: buildAssistantLogs(now, rnd),
    assistantSettings: [buildAssistantSettings(now)],
    knowledgeOverrides: [{ id: 'knowledge', version: 1, updatedAt: iso(now - 31 * DAY), updatedBy: 'Kengne Manuella', intents: {} }],
    audit: buildAudit(now),
    sequences: { ticket: total }
  }
}

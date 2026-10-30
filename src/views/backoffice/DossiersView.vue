
<script setup>
/**
 * Back-office — Dossiers de création.
 * Liste filtrable (statut, interlocuteur, recherche) + fiche complète d'un dossier :
 * pilotage (statut, interlocuteur, certification, jalons), fiche entreprise
 * (CompanyDossierCard), contrôle des pièces, demande de pièce, notes internes,
 * rendez-vous et paiements du fellow, conversations. L'équipe traite un
 * dossier de bout en bout sans développeur (§13).
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { APP_CONFIG } from '@/config/app.config'
import KBadge from '@/components/ui/KBadge.vue'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import KModal from '@/components/ui/KModal.vue'
import KLoader from '@/components/ui/KLoader.vue'
import CompanyDossierCard from '@/components/features/CompanyDossierCard.vue'
import BookingCard from '@/components/features/BookingCard.vue'
import { formatDate, formatXaf, initials, timeAgo } from '@/utils/format'
import { DOSSIER_TONE, DOC_TONE, PAYMENT_TONE, THREAD_TONE } from '@/utils/status'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()

const dossiers = ref(null)
const team = ref([])
const current = ref(null)
const q = ref('')
const status = ref('all')
const assignee = ref('all')
const tab = ref('dossier')
const note = ref('')
const reqDoc = ref(null)
const reqForm = ref({ kind: 'cni', message: '' })
const reject = ref(null)
const rejectReason = ref('')
const saving = ref(false)
const STATUSES = ['draft', 'submitted', 'in_review', 'docs_requested', 'filed', 'created']

onMounted(async () => {
  ;[dossiers.value, team.value] = await Promise.all([api.backoffice.listDossiers(), api.backoffice.listTeam()])
  if (route.params.id) openDossier(route.params.id)
})

const staffMembers = computed(() => team.value.filter((m) => m.status === 'active' && ['admin', 'manager', 'agent'].includes(m.role)))
const counts = computed(() => (dossiers.value ?? []).reduce((o, d) => ({ ...o, [d.status]: (o[d.status] ?? 0) + 1 }), {}))
const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return (dossiers.value ?? []).filter((d) =>
    (status.value === 'all' || d.status === status.value) &&
    (assignee.value === 'all' || (assignee.value === 'none' ? !d.assigneeId : d.assigneeId === assignee.value)) &&
    (!needle || `${d.name} ${d.owner} ${d.city} ${d.ref} ${d.form?.activity ?? ''}`.toLowerCase().includes(needle)))
})
const urgentCount = computed(() => (dossiers.value ?? []).filter((d) => d.docsToReview || d.status === 'submitted').length)

async function openDossier(id) {
  current.value = await api.backoffice.getDossier(id)
  tab.value = 'dossier'
  router.replace({ name: 'bo-dossiers', params: { id } })
}
function closeDossier() { current.value = null; router.replace({ name: 'bo-dossiers' }) }

/** Met à jour le dossier courant ET la ligne de la liste */
function sync(updated) {
  Object.assign(current.value, updated)
  const row = dossiers.value.find((d) => d.id === updated.id)
  if (row) Object.assign(row, updated)
}
async function update(patch) {
  saving.value = true
  try { sync(await api.backoffice.updateDossier(current.value.id, patch, auth.actor)); ui.toast(t('bo.dossiers.saved'), { type: 'success' }) } finally { saving.value = false }
}
async function certify() {
  await update({ certified: !current.value.certified })
  if (current.value.certified) ui.rainCowries(110)
}
async function toggleMilestone(key) { sync(await api.backoffice.toggleMilestone(current.value.id, key, auth.actor)) }
async function review(doc, st) {
  if (st === 'rejected') { reject.value = doc; rejectReason.value = ''; return }
  Object.assign(doc, await api.backoffice.reviewDocument(doc.id, st, '', auth.actor))
  current.value = await api.backoffice.getDossier(current.value.id)
}
async function confirmReject() {
  if (!rejectReason.value.trim()) return
  await api.backoffice.reviewDocument(reject.value.id, 'rejected', rejectReason.value, auth.actor)
  reject.value = null
  sync(await api.backoffice.getDossier(current.value.id))
}
async function addNote() {
  if (!note.value.trim()) return
  sync(await api.backoffice.addDossierNote(current.value.id, note.value, auth.actor))
  note.value = ''
}
async function sendRequest() {
  if (!reqForm.value.message.trim()) return
  sync(await api.backoffice.requestDocument(current.value.id, { kind: t(`documents.${reqForm.value.kind}`), message: reqForm.value.message }, auth.actor))
  reqDoc.value = null
  ui.toast(t('bo.dossiers.requested'), { type: 'success' })
}
watch(reqDoc, (v) => { if (v) reqForm.value = { kind: 'cni', message: t('bo.dossiers.requestTemplate', { name: current.value.owner.split(' ')[0] }) } })
</script>

<template>
  <div class="dos">
    <!-- ═══ Fiche d'un dossier ═══ -->
    <template v-if="current">
      <header class="head">
        <div>
          <button type="button" class="back" @click="closeDossier">← {{ $t('bo.dossiers.title') }}</button>
          <h1>{{ current.name || current.form?.companyName || '—' }}</h1>
          <p class="text-muted">{{ current.owner }} · Fellow #{{ String(current.fellowNumber ?? 0).padStart(3, '0') }} · {{ current.ownerEmail }} · {{ current.ownerPhone }}<span v-if="current.residenceCountry !== 'Cameroun'" class="dia"> · {{ $t('bo.dossiers.diaspora', { country: current.residenceCountry }) }}</span></p>
        </div>
        <KBadge :tone="DOSSIER_TONE[current.status]" dot>{{ $t(`status.dossier.${current.status}`) }}</KBadge>
      </header>

      <!-- Pilotage -->
      <section class="controls wood-panel">
        <label v-if="auth.can('manageDossiers')">{{ $t('bo.dossiers.status') }}
          <select class="k-input" :value="current.status" @change="update({ status: $event.target.value })">
            <option v-for="s in STATUSES" :key="s" :value="s">{{ $t(`status.dossier.${s}`) }}</option>
          </select>
        </label>
        <label v-if="auth.can('manageDossiers')">{{ $t('bo.dossiers.assignee') }}
          <select class="k-input" :value="current.assigneeId ?? ''" @change="update({ assigneeId: $event.target.value || null })">
            <option value="">{{ $t('bo.dossiers.unassigned') }}</option>
            <option v-for="m in staffMembers" :key="m.id" :value="m.id">{{ m.name }} · {{ m.title }}</option>
          </select>
        </label>
        <div class="ctl-acts">
          <button v-if="auth.can('certify')" type="button" class="certify" :class="{ on: current.certified }" @click="certify">✦ {{ current.certified ? $t('bo.dossiers.uncertify') : $t('bo.dossiers.certify') }}</button>
          <button v-if="auth.can('manageDossiers')" type="button" class="req" @click="reqDoc = true">⇪ {{ $t('bo.dossiers.requestDoc') }}</button>
          <RouterLink class="req" :to="{ name: 'bo-inbox', query: { fellow: current.ownerId } }">✉ {{ $t('bo.dossiers.messages') }} ({{ current.openThreads }})</RouterLink>
        </div>
      </section>

      <div class="tabs" role="tablist">
        <button v-for="tb in ['dossier', 'documents', 'milestones', 'bookings', 'payments', 'notes']" :key="tb" type="button" role="tab" :class="{ on: tab === tb }" @click="tab = tb">
          {{ $t(`bo.dossiers.tabs.${tb}`) }}
          <small v-if="tb === 'documents' && current.docsToReview">{{ current.docsToReview }}</small>
          <small v-else-if="tb === 'bookings' && current.bookingList.length">{{ current.bookingList.length }}</small>
          <small v-else-if="tb === 'notes' && current.internalNotes?.length">{{ current.internalNotes.length }}</small>
        </button>
      </div>

      <CompanyDossierCard v-if="tab === 'dossier'" :company="current" :documents="current.documents" staff />

      <section v-else-if="tab === 'documents'" class="wood-panel box">
        <h3>{{ $t('bo.dossiers.documents') }}</h3>
        <ul class="docs">
          <li v-for="doc in current.documents" :key="doc.id" :class="doc.status">
            <div class="thumb">{{ doc.mime === 'application/pdf' ? 'PDF' : 'IMG' }}</div>
            <div class="info">
              <strong>{{ $t(`documents.${doc.kind}`) }}<KBadge v-if="doc.issuedByKec" tone="gold">KEC</KBadge></strong>
              <small>{{ doc.name }} · {{ formatDate(doc.uploadedAt, locale) }}<template v-if="doc.reviewedBy"> · {{ $t('bo.dossiers.reviewedBy', { name: doc.reviewedBy }) }}</template></small>
              <small v-if="doc.rejectionReason" class="why">{{ doc.rejectionReason }}</small>
            </div>
            <KBadge :tone="DOC_TONE[doc.status]">{{ $t(`status.doc.${doc.status}`) }}</KBadge>
            <span v-if="auth.can('reviewDocuments')" class="doc-acts">
              <button type="button" class="ok" :title="$t('bo.dossiers.verify')" @click="review(doc, 'verified')">✓</button>
              <button type="button" class="ko" :title="$t('bo.dossiers.reject')" @click="review(doc, 'rejected')">✕</button>
            </span>
          </li>
          <li v-if="!current.documents.length" class="text-muted">—</li>
        </ul>
      </section>

      <section v-else-if="tab === 'milestones'" class="wood-panel box">
        <h3>{{ $t('dossier.milestones') }}</h3>
        <p class="text-muted">{{ $t('bo.dossiers.milestonesLead') }}</p>
        <ul class="ms">
          <li v-for="m in current.milestones" :key="m.key" :class="{ done: m.done, current: m.current }">
            <button type="button" :disabled="!auth.can('manageDossiers')" @click="toggleMilestone(m.key)"><span class="chk">{{ m.done ? '✓' : '' }}</span></button>
            <div><strong>{{ $t(`milestones.${m.key}`) }}</strong><small class="text-muted">{{ m.done ? $t('dossier.doneAt', { date: formatDate(m.doneAt, locale) }) : $t('dossier.dueAt', { date: formatDate(m.dueDate, locale) }) }}</small></div>
            <KBadge v-if="m.current" tone="gold" dot>{{ $t('bo.dossiers.inProgress') }}</KBadge>
          </li>
        </ul>
      </section>

      <section v-else-if="tab === 'bookings'" class="group">
        <h3>{{ $t('bo.appointments.title') }} · {{ current.owner }}</h3>
        <div v-if="current.bookingList.length" class="cards">
          <BookingCard v-for="b in current.bookingList" :key="b.id" :booking="b" />
        </div>
        <p v-else class="text-muted">{{ $t('booking.noHistory') }}</p>
      </section>

      <section v-else-if="tab === 'payments'" class="wood-panel box">
        <h3>{{ $t('bo.payments.title') }} · {{ current.owner }}</h3>
        <ul class="pays">
          <li v-for="p in current.payments" :key="p.id">
            <div><strong>{{ $t(`payments.purpose.${p.purpose}`) }}<small v-if="p.installment"> · {{ $t(`payments.installments.${p.installment}`) }}</small></strong><small class="text-muted">{{ formatDate(p.createdAt, locale) }} · {{ p.method.toUpperCase() }} · {{ p.reference }}</small></div>
            <strong class="amt">{{ formatXaf(p.amount, locale) }}</strong>
            <KBadge :tone="PAYMENT_TONE[p.status]">{{ $t(`status.payment.${p.status}`) }}</KBadge>
          </li>
          <li v-if="!current.payments.length" class="text-muted">—</li>
        </ul>
        <p class="total">{{ $t('bo.payments.totalPaid') }} : <strong>{{ formatXaf(current.payments.filter((p) => p.status === 'succeeded').reduce((s, p) => s + p.amount, 0), locale) }}</strong></p>
      </section>

      <section v-else class="cols-notes">
        <div class="wood-panel box">
          <h3>{{ $t('bo.dossiers.notes') }}</h3>
          <form class="note-form" @submit.prevent="addNote">
            <textarea v-model="note" class="k-input" rows="2" :placeholder="$t('bo.dossiers.notePh')" />
            <KButton type="submit" size="sm" variant="wood" :icon="false" :disabled="!note.trim()">{{ $t('inbox.addNote') }}</KButton>
          </form>
          <ul class="notes">
            <li v-for="(n, i) in current.internalNotes" :key="i"><p>{{ n.text }}</p><small class="text-muted">{{ n.by }} · {{ timeAgo(n.at, locale) }}</small></li>
            <li v-if="!current.internalNotes?.length" class="text-muted">—</li>
          </ul>
        </div>
        <div class="wood-panel box">
          <h3>{{ $t('bo.dossiers.conversations') }}</h3>
          <ul class="threads">
            <li v-for="th in current.threads" :key="th.id">
              <RouterLink :to="{ name: 'bo-inbox', params: { id: th.id } }"><strong>{{ th.subject }}</strong><small class="text-muted">{{ timeAgo(th.lastMessageAt, locale) }}</small></RouterLink>
              <KBadge :tone="THREAD_TONE[th.status]">{{ $t(`inbox.status.${th.status}`) }}</KBadge>
            </li>
            <li v-if="!current.threads.length" class="text-muted">—</li>
          </ul>
        </div>
      </section>
    </template>

    <!-- ═══ Liste ═══ -->
    <template v-else>
      <header class="head">
        <div>
          <span class="eyebrow">{{ $t('bo.eyebrow') }}</span>
          <h1>{{ $t('bo.dossiers.title') }}</h1>
          <p class="text-muted">{{ $t('bo.dossiers.lead', { n: dossiers?.length ?? 0, urgent: urgentCount }) }}</p>
        </div>
      </header>
      <div class="filters">
        <input v-model="q" class="k-input search" :placeholder="$t('bo.dossiers.search')" />
        <select v-model="status" class="k-input"><option value="all">{{ $t('common.all') }}</option><option v-for="s in STATUSES" :key="s" :value="s">{{ $t(`status.dossier.${s}`) }} ({{ counts[s] ?? 0 }})</option></select>
        <select v-model="assignee" class="k-input"><option value="all">{{ $t('bo.dossiers.allAssignees') }}</option><option value="none">{{ $t('bo.dossiers.unassigned') }}</option><option v-for="m in staffMembers" :key="m.id" :value="m.id">{{ m.name }}</option></select>
      </div>
      <KLoader v-if="!dossiers" />
      <p v-else-if="!filtered.length" class="text-muted">{{ $t('bo.dossiers.empty') }}</p>
      <div v-else class="grid">
        <button v-for="d in filtered" :key="d.id" type="button" class="card wood-panel" @click="openDossier(d.id)">
          <header>
            <span class="ava">{{ initials(d.owner) }}</span>
            <div><strong>{{ d.name || d.form?.companyName || '—' }}</strong><small>{{ d.owner }} · {{ d.legalForm ? $t(`legalForms.${d.legalForm}`) : '—' }} · {{ d.city || '—' }}</small></div>
            <span v-if="d.certified" class="cert">✦</span>
          </header>
          <div class="row">
            <KBadge :tone="DOSSIER_TONE[d.status]" dot>{{ $t(`status.dossier.${d.status}`) }}</KBadge>
            <small class="text-muted">{{ d.ref }}</small>
          </div>
          <div class="bar"><span :style="{ width: `${Math.round(((d.milestones?.filter((m) => m.done).length ?? 0) / 7) * 100)}%` }" /></div>
          <footer>
            <span :class="{ warn: !d.assignee }">☺ {{ d.assignee ?? $t('bo.dossiers.unassigned') }}</span>
            <span :class="{ warn: d.docsToReview }">⇪ {{ d.docsToReview }} {{ $t('bo.dossiers.toReview') }}</span>
            <span>◷ {{ d.bookings }}</span>
            <span :class="{ warn: d.openThreads }">✉ {{ d.openThreads }}</span>
          </footer>
        </button>
      </div>
    </template>

    <!-- Demande de pièce -->
    <KModal :open="!!reqDoc" :title="$t('bo.dossiers.requestDoc')" @close="reqDoc = null">
      <div class="modal-form">
        <KField :label="$t('bo.dossiers.whichDoc')"><select v-model="reqForm.kind" class="k-input"><option v-for="k in APP_CONFIG.requiredDocuments" :key="k.id" :value="k.id">{{ $t(`documents.${k.id}`) }}</option></select></KField>
        <KField :label="$t('inbox.message')"><textarea v-model="reqForm.message" class="k-input" rows="4" /></KField>
        <p class="text-muted small">{{ $t('bo.dossiers.requestHint') }}</p>
      </div>
      <template #footer><KButton variant="ghost" :icon="false" @click="reqDoc = null">{{ $t('common.close') }}</KButton><KButton @click="sendRequest">{{ $t('inbox.send') }}</KButton></template>
    </KModal>

    <!-- Refus de pièce -->
    <KModal :open="!!reject" :title="$t('bo.dossiers.reject')" @close="reject = null">
      <div class="modal-form">
        <p>{{ reject ? $t(`documents.${reject.kind}`) : '' }} · <small class="text-muted">{{ reject?.name }}</small></p>
        <KField :label="$t('bo.dossiers.reasonPrompt')" required><textarea v-model="rejectReason" class="k-input" rows="3" /></KField>
      </div>
      <template #footer><KButton variant="ghost" :icon="false" @click="reject = null">{{ $t('common.back') }}</KButton><KButton variant="danger" :icon="false" :disabled="!rejectReason.trim()" @click="confirmReject">{{ $t('bo.dossiers.reject') }}</KButton></template>
    </KModal>
  </div>
</template>

<style scoped lang="scss">
.dos { display: grid; gap: 1.25rem; }
.head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; h1 { margin: 0; } p { margin: .2rem 0 0; font-size: .9rem; } .dia { color: var(--kec-gold-soft); } }
.back { background: none; border: 0; color: var(--kec-gold); font-weight: 700; padding: 0; margin-bottom: .4rem; }
.filters { display: grid; gap: .6rem; @include md-up { grid-template-columns: 1fr 220px 220px; } }
.grid { display: grid; gap: 1rem; @include md-up { grid-template-columns: 1fr 1fr; } @include lg-up { grid-template-columns: repeat(3, 1fr); } }
.card { text-align: start; padding: 1.1rem 1.2rem; display: grid; gap: .7rem; color: var(--kec-ivory); cursor: pointer; transition: transform .3s var(--ease-spring), box-shadow .3s; &:hover { transform: translateY(-3px); box-shadow: var(--shadow-glow); }
  header { display: flex; gap: .7rem; align-items: center; div { flex: 1; display: flex; flex-direction: column; min-width: 0; } strong { font-family: var(--font-display); font-size: 1.1rem; line-height: 1.2; } small { color: var(--kec-text-muted); font-size: .76rem; } }
  .ava { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; font-size: .74rem; font-weight: 800; color: #2a1a12; background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548); }
  .cert { color: var(--kec-gold); font-size: 1.2rem; }
  .row { display: flex; justify-content: space-between; align-items: center; small { font-size: .7rem; letter-spacing: .1em; } }
  .bar { height: 6px; border-radius: 99px; background: rgba(255,255,255,.06); overflow: hidden; span { display: block; height: 100%; background: linear-gradient(90deg, var(--kec-laterite), var(--kec-gold)); } }
  footer { display: flex; flex-wrap: wrap; gap: .4rem .9rem; font-size: .76rem; color: var(--kec-text-muted); .warn { color: var(--kec-clay); font-weight: 700; } } }
.controls { padding: 1.1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; label { display: grid; gap: .3rem; font-size: .76rem; color: var(--kec-sand); font-weight: 700; min-width: 220px; flex: 1; } }
.ctl-acts { display: flex; flex-wrap: wrap; gap: .5rem; }
.certify, .req { border: 1px solid var(--kec-gold); background: none; color: var(--kec-gold-soft); padding: .7rem 1.1rem; border-radius: 999px; font-weight: 800; font-size: .86rem; &.on { background: var(--kec-gold); color: #2a1a12; } }
.req { border-color: var(--kec-border); color: var(--kec-ivory); &:hover { border-color: var(--kec-gold); color: var(--kec-gold-soft); } }
.tabs { display: flex; gap: .4rem; overflow-x: auto; scrollbar-width: none; &::-webkit-scrollbar { display: none; }
  button { flex-shrink: 0; background: rgba(20,12,7,.4); border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .5rem 1rem; border-radius: 999px; font-weight: 700; font-size: .86rem; small { margin-inline-start: .3rem; padding: .05rem .45rem; border-radius: 99px; background: rgba(214,165,72,.2); color: var(--kec-gold-soft); } &.on { background: var(--kec-cowrie); color: #2a1a12; small { background: rgba(42,26,18,.15); color: #2a1a12; } } } }
.box { padding: 1.4rem; display: grid; gap: .9rem; align-content: start; h3 { margin: 0; } }
.docs { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem;
  li { display: grid; grid-template-columns: 44px 1fr auto auto; align-items: center; gap: .75rem; padding: .7rem .8rem; border-radius: 12px; background: rgba(20,12,7,.4); &.uploaded { box-shadow: inset 3px 0 0 var(--kec-gold); } }
  .thumb { width: 44px; height: 44px; border-radius: 10px; display: grid; place-items: center; background: rgba(239,227,201,.08); color: var(--kec-gold); font-weight: 800; font-size: .7rem; }
  .info { display: flex; flex-direction: column; min-width: 0; strong { display: flex; gap: .4rem; align-items: center; } small { color: var(--kec-text-muted); font-size: .74rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .why { color: #f08a6e; white-space: normal; } } }
.doc-acts button { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--kec-border); background: none; margin-inline-start: .2rem; &.ok { color: #b9c27a; } &.ko { color: #f08a6e; } &:hover { background: rgba(255,255,255,.06); } }
.ms { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem;
  li { display: grid; grid-template-columns: 34px 1fr auto; gap: .8rem; align-items: center; padding: .6rem .8rem; border-radius: 12px; border: 1px dashed var(--kec-border); &.done { border-style: solid; border-color: rgba(143,163,90,.5); } &.current { border-color: var(--kec-gold); } }
  button { width: 34px; height: 34px; border-radius: 50%; border: 2px solid var(--kec-border); background: none; color: #b9c27a; font-weight: 900; .done & { border-color: #8fa35a; background: rgba(143,163,90,.15); } }
  div { display: flex; flex-direction: column; } small { font-size: .74rem; } }
.group { display: grid; gap: .9rem; h3 { margin: 0; } }
.cards { display: grid; gap: .9rem; @include lg-up { grid-template-columns: 1fr 1fr; } }
.pays { list-style: none; padding: 0; margin: 0; display: grid; gap: .3rem; li { display: grid; grid-template-columns: 1fr auto auto; gap: .9rem; align-items: center; padding: .65rem 0; border-bottom: 1px dashed var(--kec-border); } div { display: flex; flex-direction: column; } small { font-size: .74rem; } .amt { font-variant-numeric: tabular-nums; } }
.total { margin: 0; text-align: end; color: var(--kec-text-muted); strong { color: var(--kec-gold-soft); font-family: var(--font-display); font-size: 1.3rem; } }
.cols-notes { display: grid; gap: 1.25rem; @include lg-up { grid-template-columns: 1fr 1fr; align-items: start; } }
.note-form { display: grid; gap: .5rem; justify-items: end; textarea { min-height: 60px; } }
.notes { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; li { padding: .7rem .9rem; border-radius: 12px; background: rgba(214,165,72,.08); border-inline-start: 3px solid var(--kec-gold); p { margin: 0 0 .2rem; font-size: .9rem; } small { font-size: .72rem; } } }
.threads { list-style: none; padding: 0; margin: 0; display: grid; gap: .4rem; li { display: flex; justify-content: space-between; align-items: center; gap: .75rem; padding: .6rem 0; border-bottom: 1px dashed var(--kec-border); a { display: flex; flex-direction: column; min-width: 0; color: var(--kec-ivory); small { font-size: .72rem; } } } }
.modal-form { display: grid; gap: 1rem; p { margin: 0; } } .small { font-size: .8rem; margin: 0; }
</style>

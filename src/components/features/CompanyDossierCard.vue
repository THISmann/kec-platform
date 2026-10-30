
<script setup>
/**
 * Fiche détaillée du dossier d'entreprise (affichée une fois le dossier envoyé,
 * à la place du formulaire) : identité, interlocuteur nommé, jalons datés (§5),
 * associés, pièces, journal des évènements. Boutons : modifier, coffre-fort, écrire.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CertifiedSeal from './CertifiedSeal.vue'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import KBadge from '@/components/ui/KBadge.vue'
import KButton from '@/components/ui/KButton.vue'
import { COUNTRIES } from '@/config/geo'
import { formatXaf, formatDate, initials } from '@/utils/format'
import { DOSSIER_TONE, DOC_TONE } from '@/utils/status'

const props = defineProps({
  company: { type: Object, required: true },
  documents: { type: Array, default: () => [] },
  /** Vue équipe : masque les boutons réservés au fellow */
  staff: Boolean
})
defineEmits(['edit'])
const { locale } = useI18n()

const f = computed(() => props.company.form ?? {})
const countryName = computed(() => COUNTRIES.find((c) => c.code === props.company.country)?.name ?? props.company.country)
const docStats = computed(() => ({
  verified: props.documents.filter((d) => d.status === 'verified').length,
  toReview: props.documents.filter((d) => d.status === 'uploaded').length,
  rejected: props.documents.filter((d) => d.status === 'rejected').length
}))
const doneCount = computed(() => props.company.milestones?.filter((m) => m.done).length ?? 0)
const progress = computed(() => Math.round((doneCount.value / (props.company.milestones?.length || 7)) * 100))
const JOURNAL_ICON = { submitted: '✉', assigned: '☺', doc_verified: '✓', doc_rejected: '✕', doc_requested: '⇪', status: '◎', filed: '⚖', created: '✦', certified: '✦', milestone: '◉', note: '✎' }
</script>

<template>
  <div class="dossier">
    <!-- Identité -->
    <section class="identity wood-panel">
      <div class="seal"><CertifiedSeal :size="96" :active="company.certified" /></div>
      <div class="id-txt">
        <span class="ref">{{ company.ref }}</span>
        <h2>{{ company.name || f.companyName }}</h2>
        <p class="sub">{{ $t(`legalForms.${company.legalForm}`) }} · {{ company.city }}, {{ countryName }}<template v-if="company.sector"> · {{ $t(`sectors.${company.sector}`) }}</template></p>
        <div class="badges">
          <KBadge :tone="DOSSIER_TONE[company.status]" dot>{{ $t(`status.dossier.${company.status}`) }}</KBadge>
          <KBadge v-if="company.certified" tone="gold">✦ {{ $t('cert.certified') }}</KBadge>
          <KBadge v-if="company.rccm" tone="olive">RCCM {{ company.rccm }}</KBadge>
        </div>
      </div>
      <div class="contact clay-panel">
        <template v-if="company.assignee">
          <span class="ava">{{ initials(company.assignee) }}</span>
          <div>
            <small>{{ $t('dossier.yourContact') }}</small>
            <strong>{{ company.assignee }}</strong>
            <small class="text-muted">{{ $t('dossier.expected', { date: formatDate(company.expectedCreationDate, locale) }) }}</small>
          </div>
        </template>
        <template v-else>
          <span class="ava">?</span>
          <div><small>{{ $t('dossier.yourContact') }}</small><strong>{{ $t('dossier.assigningSoon') }}</strong></div>
        </template>
      </div>
    </section>

    <!-- Jalons datés -->
    <section class="wood-panel box">
      <header class="box-head">
        <h3>{{ $t('dossier.milestones') }}</h3>
        <span class="text-muted">{{ $t('dossier.progress', { n: doneCount, total: company.milestones?.length ?? 7 }) }} · {{ progress }} %</span>
      </header>
      <ol class="timeline">
        <li v-for="m in company.milestones" :key="m.key" :class="{ done: m.done, current: m.current }">
          <span class="pearl"><CowrieShape :size="12" :tone="m.done ? 'gold' : m.current ? 'ivory' : 'ink'" /></span>
          <strong>{{ $t(`milestones.${m.key}`) }}</strong>
          <small v-if="m.done">{{ $t('dossier.doneAt', { date: formatDate(m.doneAt, locale) }) }}</small>
          <small v-else class="due">{{ $t('dossier.dueAt', { date: formatDate(m.dueDate, locale) }) }}</small>
        </li>
      </ol>
    </section>

    <div class="cols">
      <!-- Informations déclarées -->
      <section class="wood-panel box">
        <header class="box-head"><h3>{{ $t('dossier.declared') }}</h3><button v-if="!staff" type="button" class="lnk" @click="$emit('edit')">✎ {{ $t('dossier.edit') }}</button></header>
        <dl class="facts">
          <div class="full"><dt>{{ $t('company.fields.activity') }}</dt><dd>{{ f.activity || '—' }}</dd></div>
          <div><dt>{{ $t('company.fields.address') }}</dt><dd>{{ f.address || '—' }}</dd></div>
          <div><dt>{{ $t('company.fields.manager') }}</dt><dd>{{ f.manager || '—' }}</dd></div>
          <div v-if="company.legalForm !== 'ei'"><dt>{{ $t('company.fields.capital') }}</dt><dd>{{ formatXaf(f.capitalXaf, locale) }}</dd></div>
          <div><dt>{{ $t('company.fields.employees') }}</dt><dd>{{ f.employees ?? company.employees ?? '—' }}</dd></div>
          <div><dt>{{ $t('company.fields.revenue') }}</dt><dd>{{ f.revenueBracket || company.revenueBracket || '—' }} FCFA</dd></div>
          <div><dt>{{ $t('dossier.subSector') }}</dt><dd>{{ company.subSector || '—' }}</dd></div>
          <div v-if="company.niu"><dt>NIU</dt><dd>{{ company.niu }}</dd></div>
          <div><dt>{{ $t('company.review.submittedAt') }}</dt><dd>{{ formatDate(company.submittedAt, locale) }}</dd></div>
          <div v-if="company.companyCreatedAt || company.status === 'created'"><dt>{{ $t('dossier.createdOn') }}</dt><dd>{{ formatDate(company.companyCreatedAt ?? company.journal?.find((j) => j.type === 'created')?.at, locale) }}</dd></div>
          <div class="full"><dt>{{ $t('waitlist.needs') }}</dt><dd class="chips"><span v-for="n in (f.needs ?? company.needs ?? [])" :key="n">{{ $t(`needs.${n}`) }}</span><span v-if="!(f.needs ?? company.needs ?? []).length">—</span></dd></div>
          <div v-if="f.payerIsBeneficiary === false" class="full"><dt>{{ $t('company.payer.title') }}</dt><dd>{{ f.payerName }} <small class="text-muted">({{ f.payerRelation || $t('company.payer.other') }})</small></dd></div>
        </dl>

        <template v-if="company.legalForm !== 'ei' && f.partners?.length">
          <h4>{{ $t('company.fields.partners') }}</h4>
          <ul class="partners">
            <li v-for="p in f.partners" :key="p.name">
              <span class="pn">{{ p.name }}</span>
              <span class="bar"><span :style="{ width: `${p.share}%` }" /></span>
              <span class="pct">{{ p.share }} %</span>
            </li>
          </ul>
        </template>
      </section>

      <!-- Pièces + journal -->
      <div class="side">
        <section class="wood-panel box">
          <header class="box-head">
            <h3>{{ $t('dossier.documents') }}</h3>
            <span class="docsum"><em class="ok">{{ docStats.verified }} ✓</em><em v-if="docStats.toReview" class="wait">{{ docStats.toReview }} ⏳</em><em v-if="docStats.rejected" class="ko">{{ docStats.rejected }} ✕</em></span>
          </header>
          <ul class="docs">
            <li v-for="d in documents" :key="d.id">
              <div><strong>{{ $t(`documents.${d.kind}`) }}</strong><small class="text-muted">{{ d.name }} · {{ formatDate(d.uploadedAt, locale) }}</small><small v-if="d.status === 'rejected'" class="why">{{ d.rejectionReason }}</small></div>
              <KBadge :tone="DOC_TONE[d.status]">{{ $t(`status.doc.${d.status}`) }}</KBadge>
            </li>
            <li v-if="!documents.length" class="text-muted">{{ $t('vault.empty') }}</li>
          </ul>
          <KButton v-if="!staff" variant="wood" size="sm" :icon="false" :to="{ name: 'fellow-vault' }">{{ $t('fellow.dash.openVault') }} →</KButton>
        </section>

        <section class="wood-panel box">
          <h3>{{ $t('dossier.journal') }}</h3>
          <ul class="journal">
            <li v-for="(j, i) in company.journal" :key="i" :class="j.type">
              <span class="ico">{{ JOURNAL_ICON[j.type] ?? '•' }}</span>
              <div><p>{{ j.text }}</p><small class="text-muted">{{ formatDate(j.at, locale) }} · {{ j.by }}</small></div>
            </li>
            <li v-if="!company.journal?.length" class="text-muted">—</li>
          </ul>
        </section>
      </div>
    </div>

    <div v-if="!staff" class="actions">
      <KButton variant="cowrie" @click="$emit('edit')">{{ $t('dossier.edit') }}</KButton>
      <KButton variant="cola" :to="{ name: 'fellow-inbox' }">{{ company.assignee ? $t('dossier.write', { name: company.assignee.split(' ')[0] }) : $t('dossier.writeTeam') }}</KButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dossier { display: grid; gap: 1.25rem; grid-template-columns: minmax(0, 1fr); > * { min-width: 0; } }
.identity { padding: clamp(1.25rem, 3vw, 2rem); display: grid; gap: 1.25rem; align-items: center; @include md-up { grid-template-columns: auto 1fr auto; } }
.seal { justify-self: center; }
.id-txt { min-width: 0; h2 { margin: .1rem 0 .2rem; font-size: clamp(1.5rem, 3vw, 2.2rem); } .sub { margin: 0 0 .6rem; color: var(--kec-text-muted); } }
.ref { font-size: .72rem; letter-spacing: .18em; color: var(--kec-gold); font-weight: 800; }
.badges { display: flex; flex-wrap: wrap; gap: .4rem; }
.contact { display: flex; gap: .8rem; align-items: center; padding: .9rem 1.1rem; min-width: 240px;
  .ava { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #fff; background: radial-gradient(circle at 35% 30%, #f0b49b, #c0612f); }
  div { display: flex; flex-direction: column; line-height: 1.25; } small { font-size: .72rem; color: var(--kec-gold-soft); } strong { font-family: var(--font-display); font-size: 1.1rem; } }
.box { padding: 1.4rem; display: grid; gap: .9rem; align-content: start; min-width: 0; > * { min-width: 0; } }
.side > * { min-width: 0; } /* sur téléphone, aucun encart ne force la page à s'élargir */
.box-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; h3 { margin: 0; } span { font-size: .82rem; } }
.lnk { background: none; border: 0; color: var(--kec-gold); font-weight: 700; font-size: .85rem; }
.timeline { list-style: none; padding: 0; margin: 0; display: grid; gap: .8rem; position: relative; @include lg-up { grid-template-columns: repeat(7, 1fr); gap: .4rem; }
  &::before { content: ''; position: absolute; inset-inline-start: 13px; top: 12px; bottom: 12px; width: 2px; background: var(--kec-border); @include lg-up { inset-inline-start: 7%; inset-inline-end: 7%; top: 13px; bottom: auto; width: auto; height: 2px; } }
  li { position: relative; display: grid; grid-template-columns: 28px 1fr; column-gap: .7rem; align-items: center; @include lg-up { display: flex; flex-direction: column; text-align: center; gap: .3rem; } }
  .pearl { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: #24170f; box-shadow: inset 0 0 0 1.5px var(--kec-border); z-index: 1; }
  strong { font-size: .84rem; color: var(--kec-text-muted); } small { font-size: .7rem; color: var(--kec-text-muted); grid-column: 2; @include lg-up { grid-column: auto; } }
  .done { strong { color: #b9c27a; } .pearl { box-shadow: inset 0 0 0 1.5px var(--kec-gold); } }
  .current { strong { color: var(--kec-ivory); } .pearl { box-shadow: 0 0 0 2px var(--kec-gold), 0 0 14px var(--kec-gold); } .due { color: var(--kec-gold-soft); } } }
.cols { display: grid; gap: 1.25rem; grid-template-columns: minmax(0, 1fr); > * { min-width: 0; } @include lg-up { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); align-items: start; } }
.side { display: grid; gap: 1.25rem; }
.facts { margin: 0; display: grid; gap: .1rem; @include sm-up { grid-template-columns: 1fr 1fr; column-gap: 1.5rem; }
  div { padding: .55rem 0; border-bottom: 1px dashed var(--kec-border); display: flex; flex-direction: column; gap: .1rem; } .full { grid-column: 1 / -1; }
  dt { font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: var(--kec-text-muted); } dd { margin: 0; font-weight: 600; }
  .chips { display: flex; flex-wrap: wrap; gap: .35rem; span { padding: .15rem .6rem; border-radius: 99px; background: rgba(214,165,72,.12); color: var(--kec-gold-soft); font-size: .76rem; } } }
h4 { font-family: var(--font-body); font-size: .74rem; letter-spacing: .16em; text-transform: uppercase; color: var(--kec-gold); margin: .5rem 0 0; }
.partners { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; li { display: grid; grid-template-columns: minmax(110px, 160px) 1fr 48px; align-items: center; gap: .75rem; font-size: .86rem; }
  .bar { height: 10px; border-radius: 99px; background: rgba(255,255,255,.05); overflow: hidden; span { display: block; height: 100%; background: linear-gradient(90deg, var(--kec-laterite), var(--kec-gold)); } } .pct { text-align: end; font-weight: 800; } }
.docsum { display: flex; gap: .5rem; em { font-style: normal; font-weight: 800; font-size: .8rem; } .ok { color: #b9c27a; } .wait { color: var(--kec-gold-soft); } .ko { color: #f08a6e; } }
.docs { list-style: none; padding: 0; margin: 0; display: grid; gap: .45rem;
  li { display: flex; align-items: center; gap: .75rem; padding: .55rem .7rem; border-radius: 12px; background: rgba(20,12,7,.4); }
  div { flex: 1; display: flex; flex-direction: column; min-width: 0; } small { font-size: .72rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .why { color: #f08a6e; white-space: normal; } }
.journal { list-style: none; padding: 0; margin: 0; display: grid; gap: .6rem;
  li { display: grid; grid-template-columns: 26px 1fr; gap: .6rem; align-items: start; }
  .ico { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: .8rem; background: rgba(214,165,72,.12); color: var(--kec-gold); }
  .doc_rejected .ico { background: rgba(208,87,62,.15); color: #f08a6e; } .doc_verified .ico { background: rgba(143,163,90,.15); color: #b9c27a; } .certified .ico, .created .ico { background: var(--kec-gold); color: #2a1a12; }
  p { margin: 0; font-size: .86rem; line-height: 1.4; } small { font-size: .72rem; } }
.actions { display: flex; flex-wrap: wrap; gap: .75rem; }
</style>

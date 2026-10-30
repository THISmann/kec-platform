<script setup>
/**
 * Coffre-fort juridique : tous les documents de l'entreprise
 * (pièces fournies + documents rédigés par KEC), chiffrés, consultables.
 * Badge "Certifié KEC" visible à l'issue des 6 mois.
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import CertifiedSeal from '@/components/features/CertifiedSeal.vue'
import DocumentUploader from '@/components/features/DocumentUploader.vue'
import KBadge from '@/components/ui/KBadge.vue'
import KModal from '@/components/ui/KModal.vue'
import KLoader from '@/components/ui/KLoader.vue'
import { formatDate, formatBytes } from '@/utils/format'
import { DOC_TONE } from '@/utils/status'

const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const company = ref(null)
const docs = ref([])
const loading = ref(true)
const filter = ref('all')
const preview = ref(null)
const showUpload = ref(false)

onMounted(async () => {
  company.value = await api.company.getMine(auth.user.id)
  if (company.value) docs.value = await api.vault.list(company.value.id)
  loading.value = false
})

const filtered = computed(() => docs.value.filter((d) => filter.value === 'all' || (filter.value === 'kec' ? d.issuedByKec : !d.issuedByKec)))

async function remove(d) {
  if (!confirm(t('vault.confirmDelete', { name: d.name }))) return
  await api.vault.remove(d.id)
  docs.value = docs.value.filter((x) => x.id !== d.id)
  preview.value = null
  ui.toast(t('vault.deleted'))
}
</script>

<template>
  <div class="vault">
    <header class="vault-head wood-panel">
      <div class="door" aria-hidden="true">
        <svg class="wheel" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="20" fill="none" stroke="#d6a548" stroke-width="3" />
          <g stroke="#d6a548" stroke-width="3.5" stroke-linecap="round">
            <path d="M30 30V4M30 30l22.5 13M30 30L7.5 43" />
          </g>
          <circle cx="30" cy="4" r="3.5" fill="#e9c983" /><circle cx="52.5" cy="43" r="3.5" fill="#e9c983" /><circle cx="7.5" cy="43" r="3.5" fill="#e9c983" />
          <circle cx="30" cy="30" r="6" fill="#e9c983" />
        </svg>
      </div>
      <div class="txt">
        <span class="eyebrow">{{ $t('vault.eyebrow') }}</span>
        <h1>{{ $t('vault.title') }}</h1>
        <p class="text-muted">{{ $t('vault.lead') }}</p>
      </div>
      <div v-if="company" class="cert">
        <CertifiedSeal :size="84" :active="company.certified" />
        <small>{{ company.certified ? $t('cert.certified') : $t('cert.pendingLong') }}</small>
      </div>
    </header>

    <KLoader v-if="loading" />
    <template v-else-if="company">
      <div class="toolbar">
        <div class="tabs" role="tablist">
          <button v-for="f in ['all', 'mine', 'kec']" :key="f" type="button" role="tab" :aria-selected="filter === f" :class="{ on: filter === f }" @click="filter = f">{{ $t(`vault.filters.${f}`) }}</button>
        </div>
        <button type="button" class="add" @click="showUpload = true">+ {{ $t('vault.add') }}</button>
      </div>

      <TransitionGroup tag="ul" name="list" class="docs">
        <li v-for="d in filtered" :key="d.id" class="doc" @click="preview = d">
          <div class="paper">
            <img v-if="d.preview" :src="d.preview" alt="" />
            <span v-else class="kind">{{ d.mime === 'application/pdf' ? 'PDF' : 'IMG' }}</span>
            <span v-if="d.issuedByKec" class="kec-stamp">KEC</span>
          </div>
          <strong>{{ $t(`documents.${d.kind}`) }}</strong>
          <small class="text-muted">{{ formatDate(d.uploadedAt, locale) }} · {{ formatBytes(d.size) }}</small>
          <KBadge :tone="DOC_TONE[d.status]">{{ $t(`status.doc.${d.status}`) }}</KBadge>
        </li>
      </TransitionGroup>
      <p v-if="!filtered.length" class="text-muted">{{ $t('vault.empty') }}</p>
    </template>

    <KModal :open="!!preview" :title="preview ? $t(`documents.${preview.kind}`) : ''" @close="preview = null">
      <template v-if="preview">
        <img v-if="preview.preview" :src="preview.preview" alt="" class="big-preview" />
        <dl class="meta">
          <div><dt>{{ $t('vault.file') }}</dt><dd>{{ preview.name }}</dd></div>
          <div><dt>{{ $t('vault.uploaded') }}</dt><dd>{{ formatDate(preview.uploadedAt, locale) }}</dd></div>
          <div><dt>{{ $t('vault.status') }}</dt><dd>{{ $t(`status.doc.${preview.status}`) }}</dd></div>
          <div v-if="preview.rejectionReason"><dt>{{ $t('vault.reason') }}</dt><dd>{{ preview.rejectionReason }}</dd></div>
        </dl>
      </template>
      <template #footer>
        <button v-if="preview && !preview.issuedByKec" type="button" class="danger" @click="remove(preview)">{{ $t('common.delete') }}</button>
      </template>
    </KModal>

    <KModal :open="showUpload" :title="$t('vault.add')" wide @close="showUpload = false">
      <DocumentUploader v-if="company" :company-id="company.id" :documents="docs" @uploaded="docs.unshift($event)" />
    </KModal>
  </div>
</template>

<style scoped lang="scss">
.vault { display: grid; gap: 1.5rem; }
.vault-head { display: grid; gap: 1.25rem; padding: 1.5rem; align-items: center; @include md-up { grid-template-columns: auto 1fr auto; } h1 { margin: 0 0 .3rem; } p { margin: 0; } }
.door { width: 86px; height: 86px; border-radius: 18px; display: grid; place-items: center; background: linear-gradient(145deg, #6b4426, #2a1a12); box-shadow: inset 0 0 0 3px #b7832e, inset 0 0 20px #000;
  .wheel { width: 58px; height: 58px; animation: turn 8s ease-in-out infinite; } }
@keyframes turn { 50% { transform: rotate(180deg); } }
.cert { display: flex; flex-direction: column; align-items: center; gap: .4rem; text-align: center; small { font-size: .74rem; color: var(--kec-text-muted); max-width: 150px; } }
.toolbar { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.tabs { display: flex; gap: .3rem; padding: .3rem; border-radius: 999px; background: rgba(20, 12, 7, .5); border: 1px solid var(--kec-border);
  button { background: none; border: 0; color: var(--kec-text-muted); padding: .45rem .95rem; border-radius: 999px; font-weight: 700; font-size: .84rem; &.on { background: var(--kec-cowrie); color: #2a1a12; } } }
.add { background: none; border: 1px dashed var(--kec-gold); color: var(--kec-gold-soft); border-radius: 999px; padding: .5rem 1.1rem; font-weight: 700; }
.docs { list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
.doc { cursor: pointer; display: flex; flex-direction: column; gap: .35rem; padding: .9rem; border-radius: 18px; background: rgba(44, 28, 18, .7); border: 1px solid var(--kec-border); transition: all .35s var(--ease-spring);
  &:hover { transform: translateY(-4px) rotate(-.6deg); border-color: var(--kec-gold); }
  strong { font-size: .9rem; } small { font-size: .74rem; } }
.paper { position: relative; height: 120px; border-radius: 10px; overflow: hidden; display: grid; place-items: center; margin-bottom: .4rem;
  background: linear-gradient(160deg, #f5ecdb, #e4d3b2); box-shadow: inset 0 0 18px rgba(90, 58, 36, .35);
  img { width: 100%; height: 100%; object-fit: cover; }
  .kind { font-weight: 900; color: #8b5a34; letter-spacing: .1em; } }
.kec-stamp { position: absolute; inset-inline-end: 8px; bottom: 8px; padding: .15rem .4rem; border: 2px solid #a8401f; color: #a8401f; font-weight: 900; font-size: .7rem; border-radius: 4px; transform: rotate(-12deg); }
.big-preview { width: 100%; border-radius: 12px; margin-bottom: 1rem; }
.meta { margin: 0; div { display: flex; justify-content: space-between; gap: 1rem; padding: .5rem 0; border-bottom: 1px dashed var(--kec-border); font-size: .9rem; } dt { color: var(--kec-text-muted); } dd { margin: 0; text-align: end; } }
.danger { background: none; border: 1px solid var(--kec-danger); color: #f08a6e; border-radius: 999px; padding: .5rem 1rem; font-weight: 700; }
.list-enter-active, .list-leave-active { transition: all .4s var(--ease-out); }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(.9); }
</style>

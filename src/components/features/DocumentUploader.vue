<script setup>
/**
 * Téléversement des pièces (CNI, plan de localisation, photos…).
 * - Glisser-déposer ou appareil photo du téléphone (capture)
 * - Contrôle taille/format côté client (le serveur re-vérifie)
 * - Progression, statut de vérification par l'équipe
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useUiStore } from '@/stores/ui'
import { APP_CONFIG } from '@/config/app.config'
import KBadge from '@/components/ui/KBadge.vue'
import { formatBytes } from '@/utils/format'
import { DOC_TONE } from '@/utils/status'

const props = defineProps({
  companyId: { type: String, required: true },
  documents: { type: Array, default: () => [] },
  kinds: { type: Array, default: () => APP_CONFIG.requiredDocuments }
})
const emit = defineEmits(['uploaded'])
const { t } = useI18n()
const ui = useUiStore()
const progress = ref({})
const dragging = ref(null)

const latestByKind = computed(() => {
  const map = {}
  props.documents.forEach((d) => { if (!map[d.kind] || d.uploadedAt > map[d.kind].uploadedAt) map[d.kind] = d })
  return map
})

async function upload(kind, file) {
  if (!file) return
  progress.value = { ...progress.value, [kind]: 0 }
  try {
    const doc = await api.vault.upload(props.companyId, kind, file, (p) => { progress.value = { ...progress.value, [kind]: p } })
    emit('uploaded', doc)
    ui.toast(t('upload.done', { name: file.name }), { type: 'success' })
  } catch (e) {
    ui.toast(t(e.message || 'errors.generic'), { type: 'error' })
  } finally {
    const { [kind]: _, ...rest } = progress.value
    progress.value = rest
  }
}
const onPick = (kind, e) => { upload(kind, e.target.files?.[0]); e.target.value = '' }
const onDrop = (kind, e) => { dragging.value = null; upload(kind, e.dataTransfer.files?.[0]) }
</script>

<template>
  <ul class="uploader">
    <li
      v-for="k in kinds" :key="k.id" class="slot" :class="{ drag: dragging === k.id, has: latestByKind[k.id] }"
      @dragover.prevent="dragging = k.id" @dragleave="dragging = null" @drop.prevent="onDrop(k.id, $event)"
    >
      <div class="thumb">
        <img v-if="latestByKind[k.id]?.preview" :src="latestByKind[k.id].preview" alt="" />
        <span v-else>{{ latestByKind[k.id]?.mime === 'application/pdf' ? 'PDF' : '⇪' }}</span>
      </div>
      <div class="info">
        <strong>{{ $t(`documents.${k.id}`) }} <span v-if="k.required" class="req">*</span></strong>
        <small v-if="latestByKind[k.id]">{{ latestByKind[k.id].name }} · {{ formatBytes(latestByKind[k.id].size) }}</small>
        <small v-else class="text-muted">{{ $t(`documents.hint.${k.id}`) }}</small>
        <small v-if="latestByKind[k.id]?.status === 'rejected'" class="why">{{ latestByKind[k.id].rejectionReason }}</small>
        <div v-if="progress[k.id] != null" class="bar"><span :style="{ width: `${progress[k.id]}%` }" /></div>
      </div>
      <KBadge v-if="latestByKind[k.id]" :tone="DOC_TONE[latestByKind[k.id].status]">{{ $t(`status.doc.${latestByKind[k.id].status}`) }}</KBadge>
      <label class="pick">
        <input type="file" :accept="APP_CONFIG.upload.accept.join(',')" capture="environment" @change="onPick(k.id, $event)" />
        {{ latestByKind[k.id] ? $t('upload.replace') : $t('upload.add') }}
      </label>
    </li>
  </ul>
  <p class="limits text-muted">{{ $t('upload.limits', { size: APP_CONFIG.upload.maxSizeMb }) }}</p>
</template>

<style scoped lang="scss">
.uploader { list-style: none; padding: 0; margin: 0; display: grid; gap: .75rem; }
.slot {
  display: grid; grid-template-columns: 52px 1fr auto; align-items: center; gap: .9rem; padding: .85rem;
  border-radius: 16px; border: 1.5px dashed rgba(233, 201, 131, .25); background: rgba(20, 12, 7, .35); transition: all .25s;
  @include sm-up { grid-template-columns: 52px 1fr auto auto; }
  &.drag { border-color: var(--kec-gold); background: rgba(214, 165, 72, .1); transform: scale(1.01); }
  &.has { border-style: solid; }
}
.thumb { width: 52px; height: 52px; border-radius: 12px; overflow: hidden; display: grid; place-items: center; background: rgba(239, 227, 201, .08); color: var(--kec-gold); font-weight: 800; font-size: .8rem; img { width: 100%; height: 100%; object-fit: cover; } }
.info { display: flex; flex-direction: column; min-width: 0; gap: .1rem; small { font-size: .76rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
.req { color: var(--kec-clay); }
.why { color: #f08a6e; white-space: normal !important; }
.bar { height: 4px; border-radius: 4px; background: rgba(255,255,255,.08); margin-top: .35rem; span { display: block; height: 100%; background: var(--kec-gold); transition: width .2s; } }
.pick {
  grid-column: 1 / -1; justify-self: start; cursor: pointer; padding: .45rem .9rem; border-radius: 999px; font-size: .8rem; font-weight: 700;
  border: 1px solid var(--kec-gold); color: var(--kec-gold-soft);
  @include sm-up { grid-column: auto; }
  &:hover { background: rgba(214, 165, 72, .12); }
  input { position: absolute; width: 1px; height: 1px; opacity: 0; }
}
.limits { font-size: .78rem; margin-top: .75rem; }
</style>

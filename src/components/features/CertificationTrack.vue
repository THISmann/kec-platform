<script setup>
/**
 * Parcours de certification sur 6 mois : six cauris enfilés.
 * Les mois écoulés s'illuminent ; à la fin, le sceau "Certifié KEC"
 * apparaît sur le compte entreprise (visible dans toute l'app).
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import CertifiedSeal from './CertifiedSeal.vue'
import { APP_CONFIG } from '@/config/app.config'
import { formatDate } from '@/utils/format'

const props = defineProps({ programStart: { type: String, required: true }, certified: Boolean })
const { locale } = useI18n()
const months = APP_CONFIG.program.durationMonths

const elapsed = computed(() => {
  const ms = Date.now() - new Date(props.programStart).getTime()
  return Math.min(months, Math.max(0, ms / (30.44 * 86400000)))
})
const current = computed(() => Math.min(months, Math.floor(elapsed.value) + 1))
const endDate = computed(() => {
  const d = new Date(props.programStart)
  d.setMonth(d.getMonth() + months)
  return d.toISOString()
})
const pct = computed(() => Math.round((elapsed.value / months) * 100))
</script>

<template>
  <div class="track">
    <div class="string">
      <div class="thread"><span class="fill" :style="{ width: `${pct}%` }" /></div>
      <div v-for="m in months" :key="m" class="month" :class="{ done: m < current, now: m === current }">
        <CowrieShape :size="m === current ? 26 : 20" :tone="m <= current ? 'gold' : 'ink'" />
        <small>{{ $t('cert.month', { n: m }) }}</small>
      </div>
      <div class="seal-slot"><CertifiedSeal :size="64" :active="certified" /></div>
    </div>
    <p class="meta">
      <strong>{{ $t('cert.progress', { n: current, total: months }) }}</strong>
      · {{ $t('cert.until', { date: formatDate(endDate, locale) }) }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.string { position: relative; display: grid; grid-template-columns: repeat(6, 1fr) auto; align-items: center; gap: .25rem; padding: .5rem 0; }
.thread { position: absolute; inset-inline-start: 4%; inset-inline-end: 70px; top: 40%; height: 2px; background: rgba(233, 201, 131, .18); border-radius: 2px; }
.fill { display: block; height: 100%; background: linear-gradient(90deg, var(--kec-laterite), var(--kec-gold)); border-radius: 2px; transition: width 1.5s var(--ease-out); }
.month { position: relative; display: flex; flex-direction: column; align-items: center; gap: .35rem; small { font-size: .68rem; color: var(--kec-text-muted); white-space: nowrap; } }
.now :deep(svg) { filter: drop-shadow(0 0 10px rgba(214, 165, 72, .8)); animation: bob 2.4s ease-in-out infinite; }
.now small { color: var(--kec-gold-soft); font-weight: 800; }
@keyframes bob { 50% { transform: translateY(-4px) rotate(8deg); } }
.meta { margin: .75rem 0 0; font-size: .88rem; color: var(--kec-text-muted); strong { color: var(--kec-ivory); } }
</style>

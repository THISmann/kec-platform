<script setup>
/**
 * Ticket de la salle d'attente : jeton en bois gravé, numéro d'arrivée,
 * et invitation à partager (programme de parrainage — cahier des charges §6).
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import KButton from '@/components/ui/KButton.vue'

const props = defineProps({ entry: { type: Object, required: true }, total: { type: Number, default: 0 }, seats: { type: Number, default: 110 } })
const { t } = useI18n()
const shareText = computed(() => t('ticket.shareText', { url: `${window.location.origin}/salle-d-attente?ref=${props.entry.ticket}` }))
const whatsapp = computed(() => `https://wa.me/?text=${encodeURIComponent(shareText.value)}`)
const linkedin = computed(() => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/salle-d-attente`)}`)
</script>

<template>
  <div class="ticket-wrap">
    <div class="ticket">
      <div class="hole" />
      <span class="label">{{ $t('ticket.label') }}</span>
      <strong class="num">{{ String(entry.ticket).padStart(4, '0') }}</strong>
      <span class="name">{{ entry.firstName }} · {{ entry.targetCity }}</span>
      <div class="shells"><CowrieShape v-for="i in 5" :key="i" :size="12" /></div>
    </div>
    <div class="copy">
      <h3>{{ $t('ticket.title', { name: entry.firstName }) }}</h3>
      <p>{{ $t('ticket.text', { total, seats }) }}</p>
      <p class="text-muted small">{{ $t('ticket.next') }}</p>
      <div class="share">
        <KButton :href="whatsapp" variant="cola" size="sm" target="_blank" rel="noopener">{{ $t('ticket.shareWhatsapp') }}</KButton>
        <KButton :href="linkedin" variant="ghost" size="sm" :icon="false" target="_blank" rel="noopener">LinkedIn</KButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ticket-wrap { display: grid; gap: 2rem; align-items: center; @include sm-up { grid-template-columns: 220px 1fr; } }
.ticket {
  position: relative; margin-inline: auto; width: 210px; aspect-ratio: 3 / 4; border-radius: 48% 48% 24px 24px / 30% 30% 24px 24px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .3rem; text-align: center;
  background-color: #8b5a34; @include wood-grain(.55);
  box-shadow: inset 0 0 0 3px rgba(214, 165, 72, .6), inset 0 0 30px rgba(0, 0, 0, .5), 0 30px 50px -20px #000;
  animation: land 1.1s var(--ease-spring) both;
}
@keyframes land { from { transform: translateY(-60px) rotate(-14deg); opacity: 0; } }
.hole { position: absolute; top: 18px; width: 16px; height: 16px; border-radius: 50%; background: #1a110b; box-shadow: inset 0 2px 4px #000; }
.label { font-size: .7rem; letter-spacing: .25em; text-transform: uppercase; color: var(--kec-gold-soft); margin-top: 1rem; }
.num { font-family: var(--font-display); font-size: 3.4rem; line-height: 1; color: #fff1d6; text-shadow: 0 -1px 0 rgba(0, 0, 0, .6), 0 1px 0 rgba(255, 255, 255, .2); }
.name { font-size: .82rem; color: #f5e3c8; }
.shells { display: flex; gap: 4px; margin-top: .5rem; }
.copy h3 { font-size: 1.6rem; }
.small { font-size: .85rem; }
.share { display: flex; gap: .6rem; flex-wrap: wrap; margin-top: 1rem; }
</style>

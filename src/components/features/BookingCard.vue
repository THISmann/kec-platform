
<script setup>
/**
 * Carte de rendez-vous consultant — partagée entre l'espace fellow et le back-office.
 * Répond aux questions : avec qui ? quand ? combien de temps ? à quel sujet ? combien ?
 * Slot par défaut : actions contextuelles (payer, annuler, compte rendu…).
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import KBadge from '@/components/ui/KBadge.vue'
import { formatXaf, formatDate, initials } from '@/utils/format'
import { BOOKING_TONE } from '@/utils/status'

const props = defineProps({
  booking: { type: Object, required: true },
  /** Affiche le fellow (vue équipe) plutôt que le consultant (vue fellow) */
  showFellow: Boolean,
  compact: Boolean
})
const { locale } = useI18n()
const start = computed(() => new Date(`${props.booking.date}T${props.booking.slot}:00`))
const end = computed(() => new Date(start.value.getTime() + props.booking.durationMin * 60000))
const isPast = computed(() => start.value.getTime() < Date.now())
const isToday = computed(() => props.booking.date === new Date().toISOString().slice(0, 10))
const MODE_ICON = { visio: '▣', phone: '☏', office: '⌂' }
</script>

<template>
  <article class="bk" :class="[`s-${booking.status}`, { past: isPast, compact }]">
    <div class="when">
      <small>{{ formatDate(booking.date, locale, { weekday: 'short' }) }}</small>
      <strong>{{ formatDate(booking.date, locale, { day: 'numeric' }) }}</strong>
      <small>{{ formatDate(booking.date, locale, { month: 'short' }) }}</small>
      <span v-if="isToday" class="today">{{ $t('booking.today') }}</span>
    </div>

    <div class="body">
      <header>
        <span class="ava" :class="{ fellow: showFellow }">{{ initials(showFellow ? booking.userName : booking.consultant) }}</span>
        <div class="who">
          <strong>{{ showFellow ? booking.userName : booking.consultant }}</strong>
          <small>
            <template v-if="showFellow">Fellow #{{ String(booking.fellowNumber ?? 0).padStart(3, '0') }} · {{ booking.consultant }}</template>
            <template v-else>{{ $t(`consultant.speciality.${booking.speciality}`) }}</template>
          </small>
        </div>
        <KBadge :tone="BOOKING_TONE[booking.status]" :dot="booking.status === 'confirmed' && isToday">{{ $t(`booking.status.${booking.status}`) }}</KBadge>
      </header>

      <p class="topic">{{ booking.topic }}</p>

      <ul class="facts">
        <li><span>◷</span>{{ booking.slot }} – {{ end.toTimeString().slice(0, 5) }} · {{ booking.durationMin }} min</li>
        <li><span>{{ MODE_ICON[booking.mode] ?? '▣' }}</span>{{ $t(`booking.mode.${booking.mode ?? 'visio'}`) }}<a v-if="booking.meetingLink && booking.status === 'confirmed'" :href="booking.meetingLink" target="_blank" rel="noopener" class="link">{{ $t('booking.join') }} ↗</a></li>
        <li><span>◈</span>{{ formatXaf(booking.amount, locale) }}<KBadge v-if="booking.refund" tone="olive">{{ $t(`booking.refund.${booking.refund.type}`, { amount: formatXaf(booking.refund.amount, locale) }) }}</KBadge></li>
      </ul>

      <p v-if="booking.notes && !compact" class="notes">✎ {{ booking.notes }}</p>
      <div v-if="booking.summary && !compact" class="summary">
        <strong>{{ $t('booking.summary') }}</strong>
        <p>{{ booking.summary }}</p>
      </div>
      <p v-if="booking.status === 'cancelled' && booking.cancelReason" class="cancel text-muted">{{ $t('booking.cancelledReason', { reason: booking.cancelReason }) }}</p>

      <div v-if="$slots.default" class="acts"><slot /></div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.bk { display: grid; grid-template-columns: 64px 1fr; gap: 1rem; padding: 1rem; border-radius: 18px; border: 1px solid var(--kec-border); background: rgba(20, 12, 7, .35); transition: border-color .25s;
  &.s-confirmed { border-color: rgba(214, 165, 72, .45); } &.s-awaiting_payment { border-style: dashed; border-color: rgba(217, 138, 85, .6); }
  &.s-cancelled { opacity: .65; } &.past.s-completed { background: rgba(143, 163, 90, .05); } }
.when { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .05rem; padding: .6rem .3rem; border-radius: 14px; background: var(--kec-cowrie); color: #5a3a24; text-transform: capitalize; align-self: start;
  strong { font-family: var(--font-display); font-size: 1.6rem; color: #2a1a12; line-height: 1; } small { font-size: .7rem; font-weight: 700; }
  .today { margin-top: .3rem; font-size: .6rem; font-weight: 800; padding: .1rem .4rem; border-radius: 99px; background: var(--kec-laterite); color: #fff; text-transform: uppercase; }
  .s-cancelled & { background: rgba(185, 165, 139, .3); color: var(--kec-text-muted); strong { color: var(--kec-text-muted); } } }
.body { display: grid; gap: .6rem; min-width: 0; }
header { display: flex; align-items: center; gap: .7rem; flex-wrap: wrap; }
.ava { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-size: .74rem; font-weight: 800; color: #2a1a12; background: radial-gradient(circle at 35% 30%, #f0b49b, #c0612f); &.fellow { background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548); } }
.who { flex: 1 1 140px; display: flex; flex-direction: column; min-width: 0; strong { font-size: .98rem; } small { font-size: .74rem; color: var(--kec-text-muted); } }
.topic { margin: 0; font-family: var(--font-display); font-size: 1.08rem; line-height: 1.3; }
.facts { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; font-size: .84rem; color: var(--kec-text-muted);
  li { display: inline-flex; align-items: center; gap: .45rem; flex-wrap: wrap; } span { color: var(--kec-gold); } .link { margin-inline-start: .3rem; font-weight: 700; }
  :deep(.k-badge) { white-space: normal; text-align: start; line-height: 1.25; } }
.notes { margin: 0; font-size: .82rem; color: var(--kec-gold-soft); font-style: italic; }
.summary { padding: .7rem .9rem; border-radius: 12px; background: rgba(143, 163, 90, .1); border-inline-start: 3px solid #8fa35a; strong { font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; color: #b9c27a; } p { margin: .25rem 0 0; font-size: .88rem; line-height: 1.5; } }
.cancel { margin: 0; font-size: .8rem; }
.acts { display: flex; flex-wrap: wrap; gap: .5rem; padding-top: .2rem; }
.compact .topic { font-size: .95rem; }
</style>

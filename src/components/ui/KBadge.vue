<script setup>
/** Petit badge de statut. tone : gold | olive | clay | danger | muted | indigo */
defineProps({ tone: { type: String, default: 'gold' }, dot: Boolean })
</script>

<template>
  <span class="k-badge" :class="`t-${tone}`"><span v-if="dot" class="dot" /><slot /></span>
</template>

<style scoped>
.k-badge {
  display: inline-flex; align-items: center; gap: .4rem; white-space: nowrap;
  padding: .22rem .65rem; border-radius: 999px; font-size: .74rem; font-weight: 700; letter-spacing: .03em;
  border: 1px solid currentColor;
}
.dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse 1.6s infinite; }
@keyframes pulse { 50% { opacity: .3; } }
.t-gold { color: var(--kec-gold-soft); background: rgba(214, 165, 72, .1); }
.t-olive { color: #b9c27a; background: rgba(143, 163, 90, .12); }
.t-clay { color: var(--kec-clay); background: rgba(217, 138, 85, .1); }
.t-danger { color: #f08a6e; background: rgba(208, 87, 62, .12); }
.t-muted { color: var(--kec-text-muted); background: rgba(255, 255, 255, .03); }
.t-indigo { color: #9fb6dd; background: rgba(34, 52, 79, .4); }
</style>

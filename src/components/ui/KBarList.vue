<script setup>
/** Barres horizontales (canaux d'acquisition, villes…). items: [{ label, count }] */
import { computed } from 'vue'
const props = defineProps({ items: { type: Array, default: () => [] } })
const max = computed(() => Math.max(1, ...props.items.map((i) => i.count)))
</script>

<template>
  <ul class="bars">
    <li v-for="(it, i) in items" :key="it.label">
      <span class="lbl">{{ it.label }}</span>
      <span class="track"><span class="fill" :style="{ width: `${(it.count / max) * 100}%`, transitionDelay: `${i * 60}ms` }" /></span>
      <span class="n">{{ it.count }}</span>
    </li>
  </ul>
</template>

<style scoped>
.bars { list-style: none; padding: 0; margin: 0; display: grid; gap: .6rem; }
li { display: grid; grid-template-columns: minmax(90px, 140px) 1fr auto; align-items: center; gap: .75rem; font-size: .86rem; }
.lbl { color: var(--kec-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track { height: 10px; border-radius: 99px; background: rgba(255, 255, 255, .05); overflow: hidden; }
.fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--kec-laterite), var(--kec-gold)); transition: width 1s var(--ease-out); }
.n { font-weight: 800; font-variant-numeric: tabular-nums; }
</style>

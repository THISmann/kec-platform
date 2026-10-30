<script setup>
/** Courbe d'évolution (SVG pur, sans librairie). values: number[] */
import { computed, useId } from 'vue'
const props = defineProps({ values: { type: Array, default: () => [] }, height: { type: Number, default: 90 } })
const id = useId()
const W = 300
const pts = computed(() => {
  const v = props.values.length ? props.values : [0]
  const max = Math.max(1, ...v)
  const step = W / Math.max(1, v.length - 1)
  return v.map((n, i) => [i * step, props.height - 6 - (n / max) * (props.height - 16)])
})
const line = computed(() => pts.value.map((p, i) => {
  if (!i) return `M${p[0]},${p[1]}`
  const prev = pts.value[i - 1]
  const cx = (prev[0] + p[0]) / 2
  return `C${cx},${prev[1]} ${cx},${p[1]} ${p[0]},${p[1]}`
}).join(''))
const area = computed(() => `${line.value} L${W},${props.height} L0,${props.height}Z`)
const last = computed(() => pts.value.at(-1))
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${height}`" preserveAspectRatio="none" class="spark" aria-hidden="true">
    <defs>
      <linearGradient :id="`sp-${id}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d6a548" stop-opacity=".45" />
        <stop offset="1" stop-color="#d6a548" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="area" :fill="`url(#sp-${id})`" />
    <path :d="line" fill="none" stroke="#e9c983" stroke-width="2" vector-effect="non-scaling-stroke" />
    <circle v-if="last" :cx="last[0]" :cy="last[1]" r="4" fill="#fff1c9" class="head" />
  </svg>
</template>

<style scoped>
.spark { width: 100%; height: auto; max-height: 180px; display: block; overflow: visible; }
.head { animation: beat 1.6s infinite; transform-box: fill-box; transform-origin: center; }
@keyframes beat { 50% { transform: scale(1.6); opacity: .6; } }
</style>

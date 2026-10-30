<script setup>
/** Tuile d'indicateur avec compteur animé. */
import { computed } from 'vue'
import { useCountUp } from '@/composables/useCountUp'
const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, default: 0 },
  suffix: { type: String, default: '' },
  hint: { type: String, default: '' },
  format: { type: Function, default: null },
  accent: { type: String, default: 'gold' }
})
const shown = useCountUp(computed(() => props.value))
const text = computed(() => (props.format ? props.format(shown.value) : shown.value.toLocaleString('fr-FR')))
</script>

<template>
  <div class="k-stat" :class="`a-${accent}`">
    <span class="lbl">{{ label }}</span>
    <strong class="val">{{ text }}<small v-if="suffix">{{ suffix }}</small></strong>
    <span v-if="hint" class="hint">{{ hint }}</span>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.k-stat {
  position: relative; overflow: hidden;
  padding: 1.15rem 1.25rem; border-radius: var(--radius);
  background: linear-gradient(160deg, rgba(74, 46, 28, .65), rgba(36, 23, 15, .8));
  border: 1px solid var(--kec-border);
  display: flex; flex-direction: column; gap: .2rem; min-width: 0;
  &::after { content: ''; position: absolute; right: -30px; top: -30px; width: 90px; height: 90px; border-radius: 50%; background: radial-gradient(circle, var(--accent), transparent 70%); opacity: .25; }
}
.a-gold { --accent: var(--kec-gold); }
.a-clay { --accent: var(--kec-terracotta); }
.a-olive { --accent: var(--kec-olive-soft); }
.lbl { font-size: .76rem; text-transform: uppercase; letter-spacing: .14em; color: var(--kec-text-muted); font-weight: 700; }
.val { font-family: var(--font-display); font-size: clamp(1.6rem, 3.4vw, 2.3rem); font-weight: 600; line-height: 1.1; small { font-size: .5em; margin-inline-start: .25em; color: var(--kec-text-muted); font-family: var(--font-body); } }
.hint { font-size: .8rem; color: var(--kec-gold-soft); }
</style>

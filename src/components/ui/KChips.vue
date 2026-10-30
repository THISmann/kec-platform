<script setup>
/**
 * Sélecteur en "perles" : choix unique (v-model = valeur) ou multiple (v-model = tableau).
 * Chaque option : { value, label, icon? }
 */
import CowrieShape from '@/components/brand/CowrieShape.vue'

const props = defineProps({
  modelValue: { type: [String, Array, Number, Boolean], default: null },
  options: { type: Array, required: true },
  multiple: Boolean,
  name: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const isOn = (v) => (props.multiple ? (props.modelValue ?? []).includes(v) : props.modelValue === v)
function toggle(v) {
  if (!props.multiple) return emit('update:modelValue', v)
  const cur = new Set(props.modelValue ?? [])
  cur.has(v) ? cur.delete(v) : cur.add(v)
  emit('update:modelValue', [...cur])
}
</script>

<template>
  <div class="k-chips" :role="multiple ? 'group' : 'radiogroup'" :aria-label="name">
    <button
      v-for="o in options" :key="o.value" type="button" class="k-chip" :class="{ on: isOn(o.value) }"
      :role="multiple ? 'checkbox' : 'radio'" :aria-checked="isOn(o.value)" @click="toggle(o.value)"
    >
      <span class="bead" aria-hidden="true"><CowrieShape :size="8" tone="ink" /></span>
      <span v-if="o.icon" class="ico">{{ o.icon }}</span>
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.k-chips { display: flex; flex-wrap: wrap; gap: .5rem; }
.k-chip {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .55rem .95rem; border-radius: 999px;
  border: 1px solid rgba(233, 201, 131, .22); background: rgba(20, 12, 7, .4);
  color: var(--kec-text-muted); font-size: .88rem; font-weight: 600;
  transition: all .3s var(--ease-out);
  &:hover { border-color: var(--kec-gold); color: var(--kec-ivory); }
  &.on {
    color: #2a1a12; border-color: transparent;
    background: radial-gradient(120% 140% at 30% 0%, #fffaf0, #ecdcbc 55%, #d4b98c);
    box-shadow: 0 6px 16px -8px rgba(239, 227, 201, .6);
  }
}
.bead {
  display: inline-flex; width: 0; overflow: hidden; opacity: 0; margin-inline-end: -.5rem;
  transition: all .35s var(--ease-spring);
  .on & { width: 8px; opacity: 1; margin-inline-end: 0; transform: rotate(-20deg); }
}
.ico { font-size: 1rem; }
</style>

<script setup>
/**
 * Indicateur d'étapes en "collier de perles" : chaque étape est une perle
 * enfilée sur un fil ; les perles franchies deviennent des cauris d'or.
 */
import CowrieShape from '@/components/brand/CowrieShape.vue'
defineProps({
  steps: { type: Array, required: true }, // [{ key, label }]
  current: { type: Number, default: 0 },
  clickable: Boolean
})
const emit = defineEmits(['go'])
</script>

<template>
  <ol class="beads">
    <li
      v-for="(s, i) in steps" :key="s.key" class="bead"
      :class="{ done: i < current, active: i === current }"
      :aria-current="i === current ? 'step' : undefined"
    >
      <button type="button" :disabled="!clickable || i > current" @click="emit('go', i)">
        <span class="pearl">
          <CowrieShape v-if="i < current" :size="13" tone="gold" />
          <span v-else>{{ i + 1 }}</span>
        </span>
        <span class="lbl">{{ s.label }}</span>
      </button>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.beads { list-style: none; display: flex; padding: 0; margin: 0 0 2rem; position: relative; gap: 0; overflow-x: auto; scrollbar-width: none; }
.beads::before {
  content: ''; position: absolute; inset-inline-start: 22px; inset-inline-end: 22px; top: 21px; height: 2px;
  background: repeating-linear-gradient(90deg, var(--kec-taupe) 0 6px, transparent 6px 10px); opacity: .5;
}
.bead { flex: 1; min-width: 76px; position: relative; display: flex; justify-content: center; }
button { background: none; border: 0; color: inherit; display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 0; cursor: default; }
button:not(:disabled) { cursor: pointer; }
.pearl {
  width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; position: relative; z-index: 1;
  font-weight: 800; font-size: .9rem; color: var(--kec-text-muted);
  background: radial-gradient(circle at 35% 30%, #4a2e1c, #24170f);
  box-shadow: inset 0 0 0 1.5px rgba(233, 201, 131, .3);
  transition: all .5s var(--ease-spring);
}
.done .pearl { background: radial-gradient(circle at 35% 30%, #6b4426, #3a2416); box-shadow: inset 0 0 0 1.5px var(--kec-gold); }
.active .pearl {
  color: #2a1a12; transform: scale(1.12);
  background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548 70%);
  box-shadow: 0 0 0 6px rgba(214, 165, 72, .15), 0 0 24px rgba(214, 165, 72, .45);
}
.lbl { font-size: .74rem; text-align: center; color: var(--kec-text-muted); max-width: 100px; line-height: 1.25; }
.active .lbl { color: var(--kec-ivory); font-weight: 700; }
</style>

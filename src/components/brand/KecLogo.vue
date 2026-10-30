<script setup>
/**
 * Logo KEC : un cauri serti dans un anneau d'or + monogramme.
 * Logo provisoire en attendant le logo officiel de la cliente :
 * remplacer ce composant suffit à mettre à jour toute l'application.
 */
import CowrieShape from './CowrieShape.vue'
defineProps({
  size: { type: Number, default: 40 },
  tagline: { type: Boolean, default: true },
  light: { type: Boolean, default: true }
})
</script>

<template>
  <span class="kec-logo" :class="{ dark: !light }" :style="{ '--s': `${size}px` }">
    <span class="mark">
      <CowrieShape :size="size * 0.46" />
    </span>
    <span class="word">
      <span class="name">KEC</span>
      <span v-if="tagline" class="tag">K-Enterprise Counsel</span>
    </span>
  </span>
</template>

<style scoped lang="scss">
.kec-logo { display: inline-flex; align-items: center; gap: calc(var(--s) * .28); color: var(--kec-ivory); }
.kec-logo.dark { color: var(--kec-walnut-deep); }
.mark {
  width: var(--s); height: var(--s); border-radius: 50%;
  display: grid; place-items: center;
  background: radial-gradient(circle at 35% 30%, #4a2e1c, #1f140c 70%);
  box-shadow: inset 0 0 0 1.5px var(--kec-gold), 0 0 0 3px rgba(214, 165, 72, .15);
  transition: transform .6s var(--ease-spring);
}
.kec-logo:hover .mark { transform: rotate(-14deg) scale(1.05); }
.word { display: flex; flex-direction: column; line-height: 1; }
.name {
  font-family: var(--font-display); font-weight: 700; letter-spacing: .08em;
  font-size: calc(var(--s) * .56);
}
.tag { font-size: calc(var(--s) * .2); letter-spacing: .24em; text-transform: uppercase; color: var(--kec-gold-soft); margin-top: .35em; white-space: nowrap; }
</style>

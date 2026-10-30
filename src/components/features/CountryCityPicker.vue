<script setup>
/**
 * Choix du pays (espace OHADA) et de la ville de création.
 * Pays non encore ouverts : visibles mais désactivés ("bientôt").
 */
import { computed } from 'vue'
import { COUNTRIES } from '@/config/geo'

const country = defineModel('country', { type: String, default: 'CM' })
const city = defineModel('city', { type: String, default: '' })
const cities = computed(() => COUNTRIES.find((c) => c.code === country.value)?.cities ?? [])
function pickCountry(c) {
  if (!c.active) return
  if (country.value !== c.code) city.value = ''
  country.value = c.code
}
</script>

<template>
  <div class="ccp">
    <h4>{{ $t('company.country') }}</h4>
    <div class="countries">
      <button
        v-for="c in COUNTRIES" :key="c.code" type="button" class="country"
        :class="{ on: c.code === country, off: !c.active }" :disabled="!c.active" @click="pickCountry(c)"
      >
        <span class="flag">{{ c.flag }}</span>
        <span class="nm">{{ c.name }}<small v-if="!c.active">{{ $t('common.soon') }}</small></span>
      </button>
    </div>
    <h4>{{ $t('company.city') }}</h4>
    <div class="cities">
      <button v-for="c in cities" :key="c" type="button" class="city" :class="{ on: c === city }" @click="city = c">{{ c }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
h4 { font-family: var(--font-body); font-size: .8rem; letter-spacing: .14em; text-transform: uppercase; color: var(--kec-sand); margin: 1.25rem 0 .75rem; }
.countries { display: grid; gap: .6rem; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.country {
  display: flex; align-items: center; gap: .6rem; padding: .7rem .8rem; border-radius: 14px; text-align: start;
  border: 1px solid rgba(233, 201, 131, .18); background: rgba(20, 12, 7, .35); color: var(--kec-ivory); font-size: .86rem; font-weight: 600;
  transition: all .25s;
  .flag { font-size: 1.3rem; }
  .nm { display: flex; flex-direction: column; line-height: 1.25; }
  small { font-size: .62rem; color: var(--kec-text-muted); text-transform: uppercase; letter-spacing: .08em; }
  &:hover:not(:disabled) { border-color: var(--kec-gold); }
  &.on { border-color: var(--kec-gold); background: rgba(214, 165, 72, .14); box-shadow: 0 0 0 3px rgba(214, 165, 72, .12); }
  &.off { opacity: .45; cursor: not-allowed; }
}
.cities { display: flex; flex-wrap: wrap; gap: .5rem; }
.city {
  padding: .55rem 1rem; border-radius: 999px; border: 1px solid rgba(233, 201, 131, .2); background: rgba(20, 12, 7, .35); color: var(--kec-text-muted); font-weight: 600; font-size: .88rem;
  &:hover { color: var(--kec-ivory); border-color: var(--kec-gold); }
  &.on { color: #2a1a12; background: radial-gradient(120% 140% at 30% 0%, #fffaf0, #ecdcbc 55%, #d4b98c); border-color: transparent; }
}
</style>

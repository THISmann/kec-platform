<script setup>
/**
 * Champ de formulaire générique : label + contrôle (slot) + aide + erreur.
 * Les contrôles natifs utilisent la classe .k-input (styles globaux ci-dessous).
 */
defineProps({
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: Boolean,
  forId: { type: String, default: undefined }
})
</script>

<template>
  <div class="k-field" :class="{ 'has-error': error }">
    <label v-if="label" class="k-field__label" :for="forId">
      {{ label }}<span v-if="required" class="req" aria-hidden="true"> *</span>
    </label>
    <slot />
    <p v-if="error" class="k-field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="k-field__hint">{{ hint }}</p>
  </div>
</template>

<style lang="scss">
.k-field { display: flex; flex-direction: column; gap: .4rem; min-width: 0; }
.k-field__label { font-size: .82rem; font-weight: 700; letter-spacing: .04em; color: var(--kec-sand); }
.k-field .req { color: var(--kec-clay); }
.k-field__hint { margin: 0; font-size: .78rem; color: var(--kec-text-muted); }
.k-field__error { margin: 0; font-size: .8rem; color: #f08a6e; }

</style>

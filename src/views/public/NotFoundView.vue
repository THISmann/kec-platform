<script setup>
import CowrieShape from '@/components/brand/CowrieShape.vue'
import KButton from '@/components/ui/KButton.vue'
</script>

<template>
  <section class="nf">
    <div class="shells"><CowrieShape :size="38" /><CowrieShape :size="38" tone="sand" /><CowrieShape :size="38" /></div>
    <h1>404</h1>
    <p class="text-muted">{{ $t('notFound.text') }}</p>
    <KButton to="/">{{ $t('notFound.cta') }}</KButton>
  </section>
</template>

<style scoped>
.nf { min-height: 100vh; display: grid; place-content: center; justify-items: center; text-align: center; gap: 1rem; padding: 2rem; }
.shells { display: flex; gap: 1rem; }
.shells :deep(svg:nth-child(2)) { transform: rotate(180deg) translateY(-10px); }
</style>

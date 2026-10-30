<script setup>
/** Page dédiée Kopen Mind (accessible au public et depuis l'espace fellow). */
import { useRoute } from 'vue-router'
import KopenMindBox from '@/components/features/KopenMindBox.vue'
const route = useRoute()
</script>

<template>
  <section :class="route.name === 'kopen-mind' ? 'container page-pub' : ''">
    <KopenMindBox />
  </section>
</template>

<style scoped>
.page-pub { padding-top: 8rem; padding-bottom: 3rem; }
</style>

<script setup>
/**
 * Racine : vue routée + calques globaux (pluie de cauris, notifications).
 */
import CowrieRain from '@/components/effects/CowrieRain.vue'
import KToaster from '@/components/ui/KToaster.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.matched[0]?.path" />
    </Transition>
  </RouterView>
  <CowrieRain />
  <KToaster />
</template>

<script setup>
/** Gabarit des pages publiques : en-tête, contenu, pied de page, Manu, barre consultant. */
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ConsultantBar from '@/components/layout/ConsultantBar.vue'
import ManuAssistant from '@/components/assistant/ManuAssistant.vue'
</script>

<template>
  <div class="public">
    <AppHeader />
    <main id="main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in"><component :is="Component" /></Transition>
      </RouterView>
    </main>
    <AppFooter />
    <ConsultantBar />
    <ManuAssistant />
  </div>
</template>

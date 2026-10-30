<script setup>
/**
 * Barre "Voulez-vous parler à l'un de nos consultants ?"
 * Fixée en bas d'écran sur les pages publiques, repliable.
 * Un clic ouvre la carte en bois « Que pouvons-nous faire pour vous ? »
 * (ConsultationRequestModal), ouverte à tout visiteur ; le tarif n'est
 * plus affiché ici, il est indiqué avant tout engagement.
 */
import { useUiStore } from '@/stores/ui'
import ConsultationRequestModal from '@/components/features/ConsultationRequestModal.vue'

const ui = useUiStore()
</script>

<template>
  <Transition name="slide">
    <aside v-if="!ui.consultantBarDismissed" class="cbar" :aria-label="$t('consultant.barAria')">
      <div class="inner">
        <span class="avatars" aria-hidden="true"><i /><i /><i /></span>
        <p><strong>{{ $t('consultant.barQuestion') }}</strong></p>
        <button class="cta" type="button" @click="ui.consultOpen = true">{{ $t('consultant.barCta') }} →</button>
        <button class="x" type="button" :aria-label="$t('common.close')" @click="ui.consultantBarDismissed = true">✕</button>
      </div>
    </aside>
  </Transition>
  <ConsultationRequestModal :open="ui.consultOpen" @close="ui.consultOpen = false" />
</template>

<style scoped lang="scss">
.cbar {
  position: fixed; z-index: 90; left: 50%; bottom: 1rem; transform: translateX(-50%);
  width: min(760px, calc(100% - 1.5rem));
}
.inner {
  display: flex; align-items: center; gap: .9rem; padding: .6rem .6rem .6rem 1rem;
  border-radius: 999px; background-color: var(--kec-walnut-deep);
  @include wood-grain(.5);
  border: 1px solid rgba(214, 165, 72, .45);
  box-shadow: 0 18px 40px -16px #000, 0 0 0 4px rgba(26, 17, 11, .5);
}
.avatars { display: none; @include sm-up { display: flex; } i { width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--kec-walnut-deep); margin-inline-start: -10px; background: radial-gradient(circle at 50% 38%, #c98d5f 0 26%, transparent 27%), radial-gradient(circle at 50% 100%, #8b5a34 0 45%, transparent 46%), #e9c983; &:first-child { margin-inline-start: 0; } &:nth-child(2) { background-color: #c0612f; } &:nth-child(3) { background-color: #5f6436; } } }
p { margin: 0; flex: 1; font-size: .8rem; @include sm-up { font-size: .86rem; } line-height: 1.3; display: flex; flex-direction: column; min-width: 0; }
.cta {
  flex-shrink: 0; padding: .6rem 1rem; border: 0; border-radius: 999px; font-weight: 800; font-size: .85rem; color: #2a1a12;
  background: radial-gradient(120% 140% at 30% 0%, #fffaf0, #e9d9b6 60%, #d2b588);
  &:hover { filter: brightness(1.05); }
}
.x { background: none; border: 0; color: var(--kec-text-muted); padding: .4rem .6rem; border-radius: 50%; &:hover { color: var(--kec-ivory); } }
.slide-enter-active, .slide-leave-active { transition: all .5s var(--ease-spring); }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translate(-50%, 120%); }
</style>

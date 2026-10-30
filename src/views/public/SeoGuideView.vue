<script setup>
/**
 * Pages guides SEO : une intention de recherche, un H1, des FAQ, un maillage interne.
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import KButton from '@/components/ui/KButton.vue'
import { GUIDES, GUIDE_LIST, localizeGuide } from '@/seo/site'

const route = useRoute()
const { locale } = useI18n()

const raw = computed(() => GUIDES[route.meta.seoKey] || null)
const page = computed(() => (raw.value ? localizeGuide(raw.value, locale.value) : null))
const related = computed(() => GUIDE_LIST.filter((g) => g.name !== route.name).slice(0, 4))
</script>

<template>
  <article v-if="page" class="guide">
    <header class="hero">
      <div class="container">
        <nav class="crumbs" aria-label="Fil d'Ariane">
          <RouterLink :to="{ name: 'home' }">KEC</RouterLink>
          <span aria-hidden="true">/</span>
          <span>{{ page.h1 }}</span>
        </nav>
        <p class="eyebrow">KEC Consulting · KEC Africa</p>
        <h1>{{ page.h1 }}</h1>
        <p class="lead">{{ page.lead }}</p>
        <div class="ctas">
          <KButton size="lg" :to="{ name: 'waiting-room' }">{{ $t('home.hero.ctaWaitlist') }}</KButton>
          <KButton size="lg" variant="wood" :to="{ name: 'home', hash: '#services' }">{{ $t('nav.services') }}</KButton>
        </div>
      </div>
    </header>

    <div class="container body">
      <section v-for="(s, i) in page.sections" :key="i" class="block wood-panel" v-reveal="i * 80">
        <h2>{{ s.h2 }}</h2>
        <div class="prose" v-html="s.html" />
      </section>

      <section class="faq" v-reveal>
        <h2>{{ $t('guides.faq') }}</h2>
        <details v-for="(f, i) in page.faq" :key="i">
          <summary>{{ f.q }}</summary>
          <p>{{ f.a }}</p>
        </details>
      </section>

      <section class="related" v-reveal>
        <h2>{{ $t('guides.related') }}</h2>
        <ul>
          <li v-for="g in related" :key="g.name">
            <RouterLink :to="{ name: g.name }">{{ $t(g.navKey) }}</RouterLink>
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>

<style scoped lang="scss">
.guide { padding-bottom: 2rem; }
.hero {
  padding: 8.5rem 0 3rem;
  background:
    radial-gradient(60% 80% at 80% 0%, rgba(214, 165, 72, .18), transparent 70%),
    linear-gradient(180deg, #24170f, #1a110b);
}
.crumbs { display: flex; flex-wrap: wrap; gap: .5rem; font-size: .82rem; color: var(--kec-text-muted); margin-bottom: 1.25rem;
  a { color: var(--kec-gold-soft); } }
.hero h1 { max-width: 18ch; font-size: clamp(2rem, 4.4vw, 3.4rem); }
.lead { max-width: 62ch; font-size: 1.08rem; color: var(--kec-cowrie); }
.ctas { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.75rem; }
.body { display: grid; gap: 1.5rem; padding-top: 2.5rem; }
.block { padding: clamp(1.4rem, 3vw, 2.2rem); }
.block h2 { margin: 0 0 1rem; font-size: clamp(1.35rem, 2.4vw, 1.8rem); }
.prose { color: var(--kec-text-muted); font-size: 1.02rem;
  :deep(p) { margin: 0 0 1rem; }
  :deep(p:last-child) { margin-bottom: 0; }
  :deep(ul) { margin: 0 0 1rem; padding-inline-start: 1.2rem; display: grid; gap: .4rem; }
  :deep(li) { color: var(--kec-ivory); }
  :deep(strong) { color: var(--kec-gold-soft); font-weight: 700; }
  :deep(em) { color: var(--kec-ivory); }
}
.faq h2, .related h2 { margin-bottom: 1rem; }
.faq details {
  border-top: 1px solid var(--kec-border); padding: 1rem 0;
  summary { cursor: pointer; font-weight: 700; color: var(--kec-gold-soft); }
  p { margin: .7rem 0 0; color: var(--kec-text-muted); }
}
.related ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .6rem; @include sm-up { grid-template-columns: 1fr 1fr; } }
.related a { color: var(--kec-ivory); border-bottom: 1px solid var(--kec-gold); padding-bottom: .15rem; &:hover { color: var(--kec-gold-soft); } }
</style>

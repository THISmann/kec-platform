/**
 * SEO runtime pour la SPA : title, description, canonical, Open Graph, JSON-LD.
 * Les espaces privés (fellow, équipe, Kia) passent en noindex.
 */
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SITE_URL, GUIDE_LIST, pageSeo, localizeGuide, organizationJsonLd } from '@/seo/site'

function attrSelector(attr, key) {
  return `meta[${attr}="${key}"]`
}

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(attrSelector(attr, key))
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(graph) {
  let el = document.getElementById('kec-jsonld')
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'kec-jsonld'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

function isPrivate(route) {
  return Boolean(route.matched.find((r) => r.meta.role)) || ['login', 'staff-login', 'investor-login', 'not-found'].includes(route.name)
}

export function useSeo() {
  const route = useRoute()
  const { locale } = useI18n()

  const apply = () => {
    const loc = locale.value || 'fr'
    const path = route.path === '/' ? '/' : route.path.replace(/\/$/, '')
    const url = `${SITE_URL}${path === '/' ? '/' : path}`
    const guide = GUIDE_LIST.find((g) => g.name === route.name)
    const localized = guide ? localizeGuide(guide, loc) : pageSeo(route.name, loc)

    const title = localized?.title || 'KEC — K-Enterprise Counsel'
    const description = localized?.description
      || 'KEC — K-Enterprise Counsel. Créer, formaliser et développer votre entreprise en Afrique, accompagné.'
    const robots = isPrivate(route) ? 'noindex, nofollow' : 'index, follow'

    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', robots)
    setMeta('name', 'author', 'KEC — K-Enterprise Counsel')
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'KEC Africa')
    setMeta('property', 'og:locale', loc === 'fr' ? 'fr_FR' : 'en_US')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', `${SITE_URL}/og.svg`)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', `${SITE_URL}/og.svg`)
    setLink('canonical', url)

    const graph = [
      organizationJsonLd(),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'KEC Africa',
        alternateName: ['KEC Consulting', 'KEC-consulting', 'K-Enterprise Counsel'],
        publisher: { '@id': `${SITE_URL}/#org` },
        inLanguage: ['fr', 'en']
      }
    ]

    if (!isPrivate(route)) {
      graph.push({
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#org` }
      })
    }

    if (guide) {
      const g = localized
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'KEC', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: g.h1, item: url }
        ]
      })
      graph.push({
        '@type': 'FAQPage',
        mainEntity: g.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      })
    }

    setJsonLd(graph)
  }

  watch([() => route.fullPath, locale], apply, { immediate: true })
}

export { GUIDE_LIST }

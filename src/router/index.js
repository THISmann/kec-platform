/**
 * ─────────────────────────────────────────────────────────────
 *  Routeur
 * ─────────────────────────────────────────────────────────────
 * Trois espaces protégés par rôle :
 *   /espace  -> fellows (les 110)      — « Connexion »
 *   /equipe  -> équipe interne KEC     — back-office
 *   /kia     -> investisseurs          — canal Kia
 * Toutes les vues sont chargées à la demande (code-splitting).
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, HOME_BY_ROLE } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/public/HomeView.vue') },
      { path: 'kec-consulting', name: 'seo-brand', component: () => import('@/views/public/SeoGuideView.vue'), meta: { seoKey: 'brand' } },
      { path: 'kec-africa', redirect: { name: 'seo-brand' } },
      { path: 'creation-entreprise-afrique', name: 'seo-create', component: () => import('@/views/public/SeoGuideView.vue'), meta: { seoKey: 'create' } },
      { path: 'cabinet-juridique-afrique', name: 'seo-legal', component: () => import('@/views/public/SeoGuideView.vue'), meta: { seoKey: 'legal' } },
      { path: 'investir-en-afrique', name: 'seo-invest', component: () => import('@/views/public/SeoGuideView.vue'), meta: { seoKey: 'invest' } },
      { path: 'business-afrique', name: 'seo-business', component: () => import('@/views/public/SeoGuideView.vue'), meta: { seoKey: 'business' } },
      { path: 'salle-d-attente', name: 'waiting-room', component: () => import('@/views/public/WaitingRoomView.vue'), meta: { immersive: true } },
      { path: 'kopen-mind', name: 'kopen-mind', component: () => import('@/views/public/KopenMindView.vue') },
      { path: 'connexion', name: 'login', component: () => import('@/views/public/LoginView.vue'), props: { audience: 'fellow' } },
      { path: 'equipe/connexion', name: 'staff-login', component: () => import('@/views/public/LoginView.vue'), props: { audience: 'staff' } },
      { path: 'kia/connexion', name: 'investor-login', component: () => import('@/views/public/LoginView.vue'), props: { audience: 'investor' } }
    ]
  },
  {
    path: '/espace',
    component: () => import('@/layouts/AppLayout.vue'),
    props: { space: 'fellow' },
    meta: { role: 'fellow', loginRoute: 'login' },
    children: [
      { path: '', name: 'fellow-dashboard', component: () => import('@/views/fellow/DashboardView.vue') },
      { path: 'mon-entreprise', name: 'fellow-company', component: () => import('@/views/fellow/CompanyWizardView.vue') },
      { path: 'coffre-fort', name: 'fellow-vault', component: () => import('@/views/fellow/VaultView.vue') },
      { path: 'consultant', name: 'fellow-consultant', component: () => import('@/views/fellow/ConsultantView.vue') },
      { path: 'paiements', name: 'fellow-payments', component: () => import('@/views/fellow/PaymentsView.vue') },
      { path: 'messages/:id?', name: 'fellow-inbox', component: () => import('@/views/fellow/MessagesView.vue') },
      { path: 'kopen-mind', name: 'fellow-kopen', component: () => import('@/views/public/KopenMindView.vue') }
    ]
  },
  {
    path: '/equipe',
    component: () => import('@/layouts/AppLayout.vue'),
    props: { space: 'staff' },
    meta: { role: 'staff', loginRoute: 'staff-login' },
    children: [
      { path: '', name: 'bo-overview', component: () => import('@/views/backoffice/OverviewView.vue') },
      { path: 'liste-attente', name: 'bo-waitlist', component: () => import('@/views/backoffice/WaitlistView.vue') },
      { path: 'dossiers/:id?', name: 'bo-dossiers', component: () => import('@/views/backoffice/DossiersView.vue') },
      { path: 'rendez-vous', name: 'bo-appointments', component: () => import('@/views/backoffice/AppointmentsView.vue') },
      { path: 'messages/:id?', name: 'bo-inbox', component: () => import('@/views/backoffice/InboxView.vue') },
      { path: 'paiements', name: 'bo-payments', component: () => import('@/views/backoffice/PaymentsView.vue') },
      { path: 'manu', name: 'bo-manu', component: () => import('@/views/backoffice/ManuView.vue'), meta: { permission: 'configureManu' } },
      { path: 'equipe', name: 'bo-team', component: () => import('@/views/backoffice/TeamView.vue'), meta: { permission: 'manageTeam' } }
    ]
  },
  {
    path: '/kia',
    component: () => import('@/layouts/KiaLayout.vue'),
    meta: { role: 'investor', loginRoute: 'investor-login' },
    children: [{ path: '', name: 'kia-dashboard', component: () => import('@/views/investor/KiaView.vue') }]
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/public/NotFoundView.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) {
      /* La transition de page est « out-in » : la page suivante n'est pas encore dans le DOM au moment
         où le routeur veut défiler. On attend que la cible existe (et quelques images de plus pour
         que la mise en page se stabilise) avant de défiler jusqu'à la section. */
      return new Promise((resolve) => {
        let tries = 0
        const tick = () => {
          const found = document.querySelector(to.hash)
          if ((found && tries >= 4) || tries > 40) resolve(found ? { el: to.hash, behavior: 'smooth', top: 80 } : { top: 0 })
          else { tries++; setTimeout(tick, 80) }
        }
        tick()
      })
    }
    return { top: 0 }
  }
})

/** Garde : session restaurée, rôle exigé, redirection vers le bon espace */
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.restore()

  const required = to.matched.find((r) => r.meta.role)?.meta
  if (required) {
    if (!auth.isAuthenticated) return { name: required.loginRoute, query: { redirect: to.fullPath } }
    if (auth.role !== required.role) return { name: HOME_BY_ROLE[auth.role] }
  }
  // Droit spécifique (gestion des rôles de l'équipe) : ex. seul un admin ouvre la page Équipe
  const permission = to.matched.find((r) => r.meta.permission)?.meta.permission
  if (permission && !auth.can(permission)) return { name: HOME_BY_ROLE[auth.role] }
  // Déjà connecté : la page de login renvoie vers son espace
  if (['login', 'staff-login', 'investor-login'].includes(to.name) && auth.isAuthenticated) {
    return { name: HOME_BY_ROLE[auth.role] }
  }
})

/**
 * ─────────────────────────────────────────────────────────────
 *  Configuration métier centrale de KEC
 * ─────────────────────────────────────────────────────────────
 * Toutes les "constantes business" vivent ici : un changement de
 * prix, de taille de cohorte ou de tarif consultant ne demande
 * aucune modification de composant.
 *
 * ⚠️ Les montants marqués « À VALIDER » sont des valeurs par défaut
 *    à confirmer avec la cliente.
 */
export const APP_CONFIG = Object.freeze({
  brand: {
    name: 'KEC',
    fullName: 'K-Enterprise Counsel',
    assistantName: 'Manu AI',
    suggestionBoxName: 'Kopen Mind',
    investorChannelName: 'Kia',
    fellowSpaceName: 'Mon espace'
  },

  program: {
    cohortSize: 110, // nombre de fellows retenus pour la phase pilote
    durationMonths: 6, // à l'issue : compte certifié
    priceXaf: 300000, // prix cible SCALE 110 (cahier des charges §9)
    pilotDeadline: '2026-12-31', // communication pré-pilote "d'ici décembre"
    waitlistGoal: 1000 // objectif pré-lancement (cahier des charges §3)
  },

  consultant: {
    hourlyRateXaf: 15000, // À VALIDER : "…frs / heure"
    minDurationMinutes: 30,
    durations: [30, 60, 90, 120],
    slotsPerDay: ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'],
    /** Modes de rendez-vous — clés i18n sous "booking.mode.*" */
    meetingModes: ['visio', 'phone', 'office'],
    /** Politique d'annulation (§6) : remboursement intégral en avoir si annulé > 24 h avant */
    freeCancellationHours: 24
  },

  /** Messagerie interne : SLA de réponse humaine (§3) et réponses types */
  messaging: {
    slaHours: 4,
    kinds: ['manu', 'consultant', 'consultation', 'dossier', 'payment', 'support'],
    priorities: ['normal', 'high', 'urgent']
  },

  /**
   * Rôles de l'équipe KEC et droits associés (gestion des rôles du back-office).
   * Chaque droit est vérifié côté UI (affichage) ET côté service (mock/HTTP).
   */
  team: {
    roles: ['admin', 'manager', 'agent', 'consultant', 'viewer'],
    permissions: ['viewWaitlist', 'selectFellows', 'manageDossiers', 'reviewDocuments', 'certify', 'replyMessages', 'manageAppointments', 'viewPayments', 'confirmPayments', 'configureManu', 'manageTeam', 'viewAudit'],
    rolePermissions: {
      admin: ['viewWaitlist', 'selectFellows', 'manageDossiers', 'reviewDocuments', 'certify', 'replyMessages', 'manageAppointments', 'viewPayments', 'confirmPayments', 'configureManu', 'manageTeam', 'viewAudit'],
      manager: ['viewWaitlist', 'selectFellows', 'manageDossiers', 'reviewDocuments', 'certify', 'replyMessages', 'manageAppointments', 'viewPayments', 'confirmPayments', 'configureManu', 'viewAudit'],
      agent: ['viewWaitlist', 'manageDossiers', 'reviewDocuments', 'replyMessages', 'manageAppointments', 'viewPayments'],
      consultant: ['replyMessages', 'manageAppointments'],
      viewer: ['viewWaitlist', 'viewPayments', 'viewAudit']
    }
  },

  currency: { code: 'XAF', label: 'FCFA' },

  /** Moyens de paiement V1 (cahier des charges §5) */
  paymentMethods: [
    { id: 'momo', label: 'MTN Mobile Money', color: '#ffcb05', kind: 'mobile' },
    { id: 'om', label: 'Orange Money', color: '#ff7900', kind: 'mobile' },
    { id: 'bank', label: 'bank', color: '#d6a548', kind: 'bank' },
    // Carte bancaire prévue au cahier des charges (§5) : affichée « bientôt » tant que le PSP n'est pas branché
    { id: 'card', label: 'card', color: '#9fb6dd', kind: 'card', soon: true }
  ],

  /** Échéancier du programme : acompte à la sélection, solde avant la création */
  programInstallments: [
    { key: 'deposit', share: 0.5 },
    { key: 'balance', share: 0.5 }
  ],

  /** Canaux d'acquisition — clés i18n sous "acquisition.*" */
  acquisitionChannels: ['linkedin', 'wordOfMouth', 'facebook', 'fieldAgent', 'whatsapp', 'tiktok', 'instagram', 'event', 'other'],

  /** Secteurs (réseau d'entreprises §8.1) — clés i18n sous "sectors.*" */
  sectors: ['agri', 'commerce', 'tech', 'services', 'transport', 'construction', 'health', 'education', 'craft', 'fashion', 'food', 'other'],

  /** Formes juridiques OHADA proposées — clés i18n sous "legalForms.*" */
  legalForms: ['ei', 'sarlu', 'sarl', 'sas', 'sasu', 'sa', 'gie'],

  /** Besoins exprimés (§8.1) */
  needs: ['legal', 'tax', 'accounting', 'funding', 'hr', 'contracts', 'ip', 'commercial'],

  /** Pièces à téléverser pour le dossier */
  requiredDocuments: [
    { id: 'cni', required: true },
    { id: 'locationPlan', required: true },
    { id: 'photo', required: true },
    { id: 'criminalRecord', required: false },
    { id: 'leaseContract', required: false },
    { id: 'other', required: false }
  ],

  upload: {
    maxSizeMb: 8,
    accept: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  },

  /** Langues — ajouter une langue = ajouter une entrée + un fichier JSON */
  locales: [
    { code: 'fr', label: 'Français', flag: 'FR', enabled: true },
    { code: 'en', label: 'English', flag: 'EN', enabled: true },
    { code: 'de', label: 'Deutsch', flag: 'DE', enabled: true },
    { code: 'es', label: 'Español', flag: 'ES', enabled: true },
    { code: 'ru', label: 'Русский', flag: 'RU', enabled: true },
    { code: 'ln', label: 'Lingála', flag: 'LN', enabled: true, intl: 'fr-FR' }, // pas de données CLDR fiables : formats français
    { code: 'sw', label: 'Kiswahili', flag: 'SW', enabled: true },
    { code: 'pt', label: 'Português', flag: 'PT', enabled: true },
    { code: 'zh', label: '中文', flag: 'ZH', enabled: true },
    { code: 'ar', label: 'العربية', flag: 'AR', enabled: true, dir: 'rtl' }
  ],
  /** Réseaux sociaux du pied de page : les liens sont à fournir par la cliente (question Q6) */
  socials: [
    { id: 'whatsapp', label: 'WhatsApp', url: '' },
    { id: 'linkedin', label: 'LinkedIn', url: '' },
    { id: 'facebook', label: 'Facebook', url: '' },
    { id: 'instagram', label: 'Instagram', url: '' },
    { id: 'tiktok', label: 'TikTok', url: '' },
    { id: 'wechat', label: 'WeChat', url: '' },
    { id: 'douyin', label: 'Douyin 抖音', url: '' }
  ],
  contact: { email: 'mbote@kec-africa.com', cities: ['Douala', 'Yaoundé', 'Bafoussam'] },
  defaultLocale: 'fr'
})

export const ENABLED_LOCALES = APP_CONFIG.locales.filter((l) => l.enabled)

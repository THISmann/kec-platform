/** Correspondance statut -> ton de badge (partagé entre vues). */
export const DOSSIER_TONE = { draft: 'muted', submitted: 'indigo', in_review: 'gold', docs_requested: 'clay', filed: 'gold', created: 'olive' }
export const DOC_TONE = { uploaded: 'indigo', verified: 'olive', rejected: 'danger' }
export const WAITLIST_TONE = { pending: 'muted', shortlisted: 'gold', selected: 'olive', rejected: 'danger' }
export const PAYMENT_TONE = { succeeded: 'olive', pending: 'gold', awaiting_transfer: 'clay', failed: 'danger' }
export const BOOKING_TONE = { awaiting_payment: 'clay', confirmed: 'gold', completed: 'olive', cancelled: 'muted' }
export const THREAD_TONE = { open: 'gold', pending: 'indigo', closed: 'muted' }
export const PRIORITY_TONE = { normal: 'muted', high: 'clay', urgent: 'danger' }
export const KIND_TONE = { manu: 'gold', consultant: 'indigo', consultation: 'clay', dossier: 'olive', payment: 'clay', support: 'muted' }
export const MEMBER_TONE = { active: 'olive', invited: 'gold', disabled: 'danger' }

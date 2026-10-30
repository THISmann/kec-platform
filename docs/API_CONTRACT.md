# KEC — Contrat d'API (passage des mocks aux vraies API)

Toutes les routes sont préfixées par `VITE_API_BASE_URL` (ex. `https://api.kec.africa/api`).
Authentification : en-tête `Authorization: Bearer <token>`.
Erreurs : statut HTTP ≥ 400 et corps `{ "code": "COHORT_FULL", "message": "errors.cohortFull" }`
(`message` = clé i18n si possible, sinon texte libre).

Chaque méthode HTTP correspond exactement à une méthode d'adaptateur mock
(`src/services/adapters/mock/*.mock.js`) : même signature, même forme de réponse.
Les mocks font donc office de **spécification exécutable** pour l'équipe backend.

## Auth
| Méthode | Route | Corps | Réponse |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `{ token, user: { id, role: 'fellow'\|'staff'\|'investor', name, email, companyId?, fellowNumber? } }` |
| GET | `/auth/me` | — | `user` |
| POST | `/auth/logout` | — | `true` |

## Liste d'attente (salle d'attente)
| POST | `/waitlist` | `{ firstName, lastName, email, phone, residenceCountry, language, targetCountry, targetCity, sector, projectStage, projectSummary, needs[], forWhom, acquisitionChannel, acquisitionDetail, consentData, consentMarketing }` | `{ entry: { id, ticket, ... }, total, seats }` — 409 `ALREADY_REGISTERED` |
|---|---|---|---|
| GET | `/waitlist/stats` | — | `{ total, today, diaspora, seats, recent: [{ firstName, city, residence, at }] }` |

## Entreprise / dossier
| GET | `/companies/me` | — | `Company \| null` |
|---|---|---|---|
| PUT | `/companies/me/draft` | `form` (partiel) | `Company` |
| POST | `/companies/me/submit` | `form` | `Company` (status `submitted`) |
| POST | `/quotes` | `{ legalForm, capitalXaf }` | `{ lines: [{ key, amount }], total }` |

## Coffre-fort
| GET | `/companies/:id/documents` | — | `Document[]` |
|---|---|---|---|
| POST | `/companies/:id/documents` | multipart `kind`, `file` | `Document` (413 `FILE_TOO_LARGE`, 415 `FILE_TYPE`) |
| DELETE | `/documents/:id` | — | `true` |

`Document = { id, companyId, kind, name, size, mime, status: 'uploaded'|'verified'|'rejected', rejectionReason?, issuedByKec?, uploadedAt, preview? }`

## Paiements (MTN MoMo, Orange Money, virement)
| POST | `/payments` | `{ purpose: 'program'\|'consultant', amount, method: 'momo'\|'om'\|'bank'\|'card', phone?, installment?: 'deposit'\|'balance'\|'partial', bookingId? }` | `Payment` (status `pending` ou `awaiting_transfer`) — 400 `METHOD_UNAVAILABLE` (carte) |
|---|---|---|---|
| GET | `/payments/:id` | — | `Payment` (le front interroge jusqu'à `succeeded`/`failed`) |
| GET | `/payments/me` | — | `Payment[]` — `{ id, purpose, installment?, bookingId?, amount, method, status, reference, receiptNo?, failureReason?, refund?: { type: 'credit'\|'refund', amount }, createdAt, paidAt? }` |

Côté serveur : appel des API opérateurs (push USSD), webhooks de confirmation, puis
publication de l'évènement temps réel `payment.succeeded`.

## Consultants
| GET | `/consultants` | — | `[{ id, name, speciality, languages[] }]` |
|---|---|---|---|
| GET | `/consultants/availability?date=YYYY-MM-DD` | — | `[{ time, free }]` |
| POST | `/consultants/bookings` | `{ consultantId, date, slot, durationMin, topic, mode: 'visio'\|'phone'\|'office', notes? }` | `Booking` (status `awaiting_payment`) |
| POST | `/consultants/bookings/:id/confirm` | `{ paymentId }` | `Booking` (status `confirmed`, ouvre une conversation `consultant`) |
| POST | `/consultants/bookings/:id/cancel` | `{ reason }` | `Booking` (status `cancelled`, `refund` calculé : avoir intégral ≥ 24 h avant, 50 % sinon) |
| GET | `/consultants/bookings/me` | — | `Booking[]` — `{ id, consultantId, consultant, speciality, date, slot, durationMin, topic, mode, meetingLink?, notes, amount, status, paymentId?, summary?, cancelReason?, refund?, createdAt, confirmedAt?, completedAt?, cancelledAt? }` |

## Kopen Mind
| POST | `/suggestions` | `{ message, category, contact? }` | `Suggestion` |
|---|---|---|---|

## Demande de consultation (« Un consultant, quand vous voulez »)
Ouverte à tout visiteur, sans compte. Le serveur crée un fil `consultation` pour
l'équipe (statut `open`, délai de rappel 24 h ouvrées suivi comme les autres fils),
une entrée d'audit, et renvoie une référence lisible.

| POST | `/public/consultation-requests` | `{ name, country?, phone?, email?, need, channel: 'whatsapp'\|'call'\|'email', consent: true, locale, userId?, page? }` | `{ reference: 'DC-2026-0001', threadId }` — 400 si `consent` absent ou ni `phone` ni `email` |
|---|---|---|---|

## Messagerie (fellows ↔ équipe)
| GET | `/threads/me` | — | `Thread[]` (sans notes internes) |
|---|---|---|---|
| GET | `/threads/:id` | — | `Thread` — `{ id, kind: 'manu'\|'consultant'\|'dossier'\|'payment'\|'support'\|'consultation', subject, reference?, contact?: { name, phone, email, country, channel }, status: 'open'\|'pending'\|'closed', priority, assignee?, tags[], slaDueAt, messages: [{ id, from: 'fellow'\|'staff'\|'manu'\|'system', author, text, at, internal? }] }` |
| POST | `/threads` | `{ kind, subject, text }` | `Thread` |
| POST | `/threads/:id/messages` | `{ text, internal? }` (`internal` réservé à l'équipe) | `Thread` |
| POST | `/threads/:id/read` | `{ viewer: 'fellow'\|'staff' }` | `Thread` |
| PATCH | `/threads/:id` | `{ status?, priority?, assigneeId?, tags? }` (équipe) | `Thread` |
| GET | `/backoffice/threads?status=&kind=&assigneeId=&q=` | — | `Thread[]` |
| GET | `/backoffice/canned-replies` | — | `[{ id, label, text }]` |

## Manu AI
| POST | `/assistant/welcome` | `{ locale, name }` | `{ text, quickReplies: [{ id, label }], route?, locale }` |
|---|---|---|---|
| POST | `/assistant/messages` | `{ message, state: { locale, replyLocale?, misses, sessionId }, transcript[], userId?, page? }` | `{ reply: { text, quickReplies, route?, escalated?, reason?, transferred?, locale }, state: { ..., replyLocale } }` — 503 `DEGRADED` si mode dégradé |
| GET | `/assistant/settings` | — | `AssistantSettings` — `{ version, displayName, tone, greetingOverride: { [locale]: string } (une entrée par langue activée), escalation: { tax, social, criminal, litigation, urgent, personalAdvice }, extraEscalationKeywords[], missesThreshold, slaHours, quickRepliesEnabled, homeTeaser, offHoursNotice, workingHours: { start, end }, logRetentionDays, degradedMode, updatedAt, updatedBy, history[] }` |
| PUT | `/assistant/settings` | `{ ...patch, note? }` | `AssistantSettings` (version incrémentée, audit) |
| GET | `/assistant/knowledge` | — | `{ catalog: [{ id, keywords[], responses: { [locale]: string } }], overrides: { intents: { [id]: { extraKeywords[], responses, disabled } } }, escalationRules[] }` |
| PATCH | `/assistant/knowledge/:intentId` | `{ extraKeywords?, responses?, disabled? }` | `overrides` |
| GET | `/assistant/report?days=30` | — | `{ total, sessions, escalated, escalationRate, fallback, understoodRate, autonomousRate, avgResponseMs, fellowShare, intents[], reasons[], locales[], pages[], byDay[], unanswered[], openThreads, slaBreaches, avgHumanResponseH }` |
| GET | `/assistant/logs?limit=&intent=&q=` | — | `[{ id, at, sessionId, locale, role: 'visitor'\|'fellow', userMessage, intent, escalated, reason?, misses, responseMs, page }]` |

**Langue de réponse.** Manu répond dans la langue du message reçu (`reply.locale`),
détectée côté serveur (le mock utilise une heuristique par écriture et mots-outils) ;
à défaut, dans `state.replyLocale` (langue de la conversation en cours) puis `state.locale`
(langue de l'interface). Les dix langues de `APP_CONFIG.locales` doivent être couvertes.
**Voix.** La dictée et la lecture à voix haute sont faites dans le navigateur (Web Speech
API) et n'appellent pas le serveur ; un moteur vocal serveur (langues sans voix système,
accents locaux) est prévu dans un lot ultérieur et passera par les mêmes routes avec
un champ `audio` optionnel.

Le backend (LLM + base documentaire versionnée) doit appliquer les garde-fous du cahier
des charges §7 : aucune recommandation juridique individualisée, escalade obligatoire
(fiscal, social, pénal, litige, urgence, conseil personnalisé), transfert humain après
N incompréhensions (`missesThreshold`), ouverture d'une conversation `manu` assignée à
l'équipe à chaque escalade, journalisation de chaque échange avec purge après
`logRetentionDays`. Paramètres et base de connaissances sont administrables **sans redéploiement**.

## Kia (investisseurs)
| GET | `/investors/dashboard` | — | `{ waitlistTotal, waitlistToday, waitlistWeek, waitlistGoal, selected, shortlisted, seats, diasporaShare, revenueXaf, revenueToday, potentialXaf, paymentsCount, byDay: [{ date, count }], channels: [{ key, count }], cities: [{ key, count }] }` |
|---|---|---|---|
| GET | `/investors/activity?limit=25` | — | `[{ type, at, payload }]` |

## Back-office
Toutes les routes exigent un compte `staff` ; le serveur vérifie le droit associé
(`APP_CONFIG.team.rolePermissions`) et journalise chaque écriture dans l'audit.

| GET | `/backoffice/overview` | — | `{ kpis, openThreads, slaBreaches, newSuggestions, dossiers, dossiersByStatus, documentsToReview, transfersToConfirm, upcomingBookings, upcomingBookingsWeek, avgLeadDays, certified }` |
|---|---|---|---|
| GET | `/backoffice/waitlist?status=&q=&sort=` | — | `WaitlistEntry[]` |
| PATCH | `/backoffice/waitlist/:id` | `{ status }` | `WaitlistEntry` — 409 `COHORT_FULL` au-delà de 110 sélectionnés |
| GET | `/backoffice/dossiers` | — | `Dossier[]` — `Company & { owner, ownerEmail, ownerPhone, fellowNumber, residenceCountry, documents[], docsToReview, bookings, payments[], openThreads }` |
| GET | `/backoffice/dossiers/:id` | — | `Dossier & { bookingList[], threads[] }` |
| PATCH | `/backoffice/dossiers/:id` | `{ status?, assigneeId?, certified?, rccm?, niu?, expectedCreationDate? }` | `Dossier` (journal + étapes mis à jour) |
| POST | `/backoffice/dossiers/:id/notes` | `{ text }` | `Dossier` |
| POST | `/backoffice/dossiers/:id/milestones/:key/toggle` | — | `Dossier` |
| POST | `/backoffice/dossiers/:id/request-document` | `{ kind, message }` | `Dossier` (statut `docs_requested`, message au fellow) |
| PATCH | `/backoffice/documents/:id` | `{ status, rejectionReason }` | `Document` |
| GET | `/backoffice/bookings` | — | `(Booking & { userName, fellowNumber, companyId })[]` |
| PATCH | `/backoffice/bookings/:id` | `{ status?: 'completed'\|'cancelled', summary?, cancelReason?, consultantId? }` | `Booking` (annulation KEC → `refund` intégral) |
| GET | `/backoffice/payments` | — | `Payment[]` |
| POST | `/backoffice/payments/:id/confirm` | — | `Payment` (virement rapproché → `succeeded`, reçu émis) |
| POST | `/backoffice/payments/:id/fail` | `{ reason }` | `Payment` |
| GET / PATCH | `/backoffice/suggestions[/:id]` | `{ status }` | `Suggestion` |
| GET | `/backoffice/team` | — | `[{ id, name, email, role, title, status: 'active'\|'invited'\|'disabled', twoFactor, speciality?, lastLoginAt }]` |
| POST | `/backoffice/team` | `{ name, email, role, title }` | `Member` (status `invited`) — 409 `ALREADY_EXISTS` |
| PATCH | `/backoffice/team/:id` | `{ role?, status?, title? }` | `Member` — 409 `LAST_ADMIN` |
| GET | `/backoffice/audit?limit=` | — | `[{ id, at, actorId, actor, action, label, details }]` |

## Temps réel
`GET /live/stream?token=…` — Server-Sent Events, chaque message : `{ type, payload, at }`
avec `type` ∈ `waitlist.signup`, `payment.succeeded`, `fellow.selected`.
Remplaçable par WebSocket : seul `src/services/realtime/realtime.http.js` change.

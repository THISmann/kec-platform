# KEC — K-Enterprise Counsel · Plateforme pilote

Application **Vue 3** de KEC, le cabinet juridique des PME africaines.
Identité africaine assumée : bois, latérite, cauris, noix de cola, globe centré sur l'Afrique.

> V1 : **100 % fonctionnelle sur des mocks** (aucun serveur requis).
> Le passage aux vraies API se fait par une variable d'environnement (voir § 5).

---

## 1. Démarrage rapide

Prérequis : **Node.js ≥ 20.19** (ou 22.12+) et npm.

```bash
npm install
npm run dev        # http://localhost:5173 — mode mock
npm run build      # build de production dans dist/
npm run preview    # sert le build sur http://localhost:4173
npm run dev:http   # même app, branchée sur l'API réelle (.env.http)
```

## 2. Comptes de démonstration

| Espace | Route de connexion | E-mail | Mot de passe |
|---|---|---|---|
| Fellow (les 110) | `/connexion` | `awa@kec.africa` | `fellow110` |
| Équipe interne — Kengne Manuella, fondatrice & administratrice | `/equipe/connexion` | `equipe@kec.africa` | `kec2026` |
| Investisseurs « Kia » | `/kia/connexion` | `kia@kec.africa` | `kia2026` |

Autres comptes pour tester les rôles et les points de vue :
- **Fellows** (`fellow110`) : `brice@`, `clarisse@`, `dieudonne@`, `esther@`, `franck@`, `grace@`, `herve@`, `irene@`, `junior@kec.africa` — chacun avec un dossier à un stade différent (brouillon → entreprise créée).
- **Équipe** (`kec2026`) : `paul@` (responsable), `sandrine@` (chargée de dossiers), `ndjock@`, `fouda@`, `weber@` (consultants, voient surtout leurs rendez-vous et conversations), `lydie@` (lecture seule). Les pages Manu AI et Équipe & rôles sont réservées aux droits `configureManu` / `manageTeam`.

**Tester le paiement (mode démo)** : Awa n'a réglé que l'acompte de 150 000 FCFA. Dans *Paiements*, choisissez le solde complet ou une tranche, puis MoMo / Orange Money avec n'importe quel numéro — **un numéro finissant par `00` simule un échec**. Le virement bancaire reste « en attente » jusqu'à sa confirmation par l'équipe (*Équipe › Paiements › Virements à rapprocher*). La carte bancaire est affichée « bientôt » (§5 du cahier des charges).

## 3. Parcours et pages

**Public**
- `/` — accueil : globe qui tourne vers l'Afrique, poussière de latérite qui forme le logo, texte « nostalgie diaspora ».
- `/salle-d-attente` — salle d'attente virtuelle **animée en SVG** (ventilateur, horloge à l'heure réelle, fenêtre sur le couchant avec oiseaux et rideau, banc où les entrepreneurs attendent, regardent leur téléphone et discutent ; à chaque inscription en direct, la porte s'ouvre et quelqu'un vient s'asseoir), café africain, formulaire d'inscription en 3 étapes (pays/ville, profil PME, **canal d'acquisition**), ticket d'attente et **pluie de cauris**.
- `/kopen-mind` — boîte à suggestions **Kopen Mind**.
- **Manu AI** — réceptionniste humanisée, disponible sur toutes les pages (bulle en bas à droite). Elle escalade vers un humain sur les sujets sensibles (fiscal, pénal, contentieux, urgence…) ou après N incompréhensions (paramétrable), et ouvre alors une conversation assignée à l'équipe. Chaque échange est journalisé (rapport dans le back-office).
- Des **cauris tombent de temps à autre** sur l'accueil (1 à 4, toutes les 7 à 16 s), en plus de la pluie à l'apparition du logo.
- **Barre consultant** — « Voulez-vous parler à l'un de nos consultants ? … FCFA/heure ».

**Espace fellow** (`/espace`)
- Tableau de bord avec parcours de certification (6 mois → sceau « Certifié »), prochains rendez-vous, solde du programme, messages non lus.
- `mon-entreprise` — formulaire dédié en 5 étapes avec devis ; une fois le dossier envoyé, une **fiche dossier détaillée** remplace le formulaire (référence, interlocuteur, date de création prévue, les sept perles datées, informations déclarées, associés, pièces, journal du dossier). Le formulaire reste accessible via « Modifier mon dossier ».
- `coffre-fort` — coffre-fort documentaire (CNI, plan de localisation, statuts…), téléversement.
- `consultant` — onglet **Mes rendez-vous** (à venir / historique, avec qui, quand, durée, format, sujet, compte rendu, statistiques) et onglet **Réserver** (consultant, créneau, durée, format visio/téléphone/bureau, sujet, précisions). Annulation avec politique : avoir intégral à plus de 24 h, 50 % en deçà.
- `paiements` — échéancier acompte / solde, paiement du solde ou d'une tranche, MTN MoMo, Orange Money, virement (carte « bientôt »), historique avec reçus et avoirs.
- `messages` — **messagerie** : conversations par sujet (Manu, consultant, dossier, paiement, assistance), statut, interlocuteur, nouveau message.
- `kopen-mind` — suggestions.

**Équipe interne** (`/equipe`)
- **Vue d'ensemble** : KPI, tâches du jour (pièces, messages hors délai, rendez-vous de la semaine, virements à confirmer), pipeline des créations, délai moyen envoi → création.
- **Liste d'attente** avec **sélection des 110** (plafond bloqué à 110, export CSV).
- **Dossiers** : 10 dossiers mock à tous les stades, recherche et filtres, fiche complète par onglets (dossier, pièces à vérifier, étapes à cocher, rendez-vous, paiements, notes internes), changement de statut et d'interlocuteur, demande de pièce, certification ; chaque action est journalisée.
- **Rendez-vous** : tous les rendez-vous consultants demandés par les fellows (KPI, par consultant, par spécialité, agenda par jour), compte rendu, réassignation, annulation (avoir intégral).
- **Messages** : boîte à trois volets (liste filtrée, conversation, contexte du fellow), SLA 4 h, priorités, étiquettes, assignation, réponses rapides, notes internes ; onglet Kopen Mind.
- **Paiements** : tous les encaissements, virements à rapprocher (confirmer / rejeter), échecs, export CSV.
- **Manu AI** : rapport (volumes, taux de résolution, escalades, langues, messages non compris), paramètres publiés avec versions (ton, accueil par langue, garde-fous, seuils, SLA, horaires, rétention, mode dégradé), base de connaissances éditable par intention et par langue, journal des échanges.
- **Équipe & rôles** : membres, rôle, 2FA, invitation, désactivation, matrice des droits, journal d'audit.

**Kia — investisseurs** (`/kia`)
- Pensé pour le **téléphone** : inscriptions et encaissements **en direct**, vibration et notification à chaque événement.
- Démo : ouvrez `/kia` dans un onglet et la salle d'attente dans un autre ; chaque inscription apparaît en direct dans Kia (BroadcastChannel). Un simulateur génère aussi de l'activité.

## 4. Architecture

```
src/
├─ config/          constantes métier (cohorte 110, prix, tarif consultant, pays OHADA, langues)
├─ services/
│  ├─ index.js      ★ façade `api` : choisit mock ou http par domaine
│  ├─ adapters/
│  │  ├─ mock/      implémentations simulées (une par domaine)
│  │  └─ http/      implémentations REST (mêmes signatures)
│  ├─ mock/         base localStorage, seed déterministe, moteur Manu AI
│  ├─ realtime/     temps réel : BroadcastChannel (mock) / SSE (http)
│  └─ http/         client fetch, erreurs, stockage du jeton
├─ stores/          Pinia : auth, ui, assistant
├─ i18n/            vue-i18n, langues chargées à la demande
├─ router/          routes + garde par rôle (fellow / staff / investor)
├─ composables/     useAsync, useLiveEvents, useCountUp, useReducedMotion
├─ components/
│  ├─ brand/        cauri, noix de cola, logo
│  ├─ effects/      globe, poussière de latérite, pluie de cauris, café, village
│  ├─ ui/           KButton (cauri/cola/bois), KField, KChips, KModal…
│  ├─ layout/       en-tête, pied, barre consultant, sélecteur de langue
│  ├─ assistant/    Manu AI
│  └─ features/     formulaire liste d'attente, coffre-fort, paiement…
├─ layouts/         Public / App (fellow + équipe) / Kia
└─ views/           public, fellow, backoffice, investor
```

**Règle d'or** : les vues et stores n'appellent **jamais** un mock directement, uniquement `api.<domaine>.<méthode>()`.

```js
import { api } from '@/services'
const { data } = await api.waitlist.join(form)
```

## 5. Passer des mocks aux vraies API

1. Le backend implémente le contrat décrit dans **[`docs/API_CONTRACT.md`](docs/API_CONTRACT.md)** (endpoints, payloads, codes d'erreur, flux SSE `/live/stream`).
2. Dans `.env` :
   ```
   VITE_API_MODE=http
   VITE_API_BASE_URL=https://api.kec.africa
   ```
3. **Migration progressive** : restez en mock et basculez domaine par domaine :
   ```
   VITE_API_MODE=mock
   VITE_API_HTTP_DOMAINS=waitlist,auth
   ```
   Domaines : `auth, waitlist, company, vault, payment, consultant, suggestion, assistant, investor, backoffice`.
4. Les adaptateurs HTTP sont déjà écrits dans `src/services/adapters/http/index.js` ; seule l'URL change.

Manu AI : en mode http, `api.assistant.send()` appelle `POST /assistant/messages` ; le backend peut y brancher un LLM en gardant les mêmes règles d'escalade (`src/services/mock/manuKnowledge.js`).

## 6. Langues

Dix langues sont activées (`src/config/app.config.js`) : français (défaut et langue de
secours), anglais, allemand, espagnol, russe, lingala, swahili, portugais, chinois et
arabe (sens droite-à-gauche, `dir="rtl"` posé sur `<html>` par `src/i18n/index.js`).

- `fr`, `en`, `de` : traduction complète (930 clés, back-office compris).
- Les sept autres : espace public, espace fellow et Kia traduits (617 clés) ; les
  écrans internes de l'équipe (`bo.*`, `team.*`) restent en français.
- Textes rédigés par KEC à partir du français : **relecture par un locuteur natif à
  prévoir** avant mise en ligne (lingala et swahili en priorité).
- Manu répond dans la langue du message (`src/services/mock/manuEngine.js`,
  `detectLocale`) ; ses réponses sont dans `src/services/mock/manuKnowledge.js`.
- Les composants utilisent des propriétés CSS logiques (`margin-inline-start`…)
  pour que l'arabe se lise correctement sans feuille de style dédiée.

Contrôle : `npm run check:i18n` (lancé automatiquement avant `npm run build`) vérifie
qu'aucune langue activée ne manque, qu'aucun tiret long ne traîne et que les variables
`{x}` correspondent au français.

Ajouter une langue :
1. Copier `src/i18n/locales/fr.json` en `<code>.json` et traduire.
2. Activer `<code>` dans `locales` (`src/config/app.config.js`, avec `dir: 'rtl'` si besoin).
3. Ajouter les réponses de Manu dans `manuKnowledge.js` (sinon repli sur l'anglais).

Les fichiers de langue sont chargés à la demande (aucun poids ajouté au premier chargement).

## 7. Données mock

- Stockées dans le `localStorage` du navigateur (clé `kec.mockdb.v3`), générées depuis un seed déterministe : 264 inscrits, 38 sélectionnés, 10 dossiers, 20 rendez-vous, 13 conversations, 340 échanges Manu, paiements, documents, équipe de 9 personnes…
- Réinitialiser : dans la console du navigateur, `kecResetMock()` puis recharger.
- Latence simulée : `VITE_MOCK_LATENCY` (ms).

## 8. Mise en production

`npm run build` puis servir `dist/` comme une **SPA** : toutes les routes inconnues doivent renvoyer `index.html`
(Netlify : `/* /index.html 200` ; Nginx : `try_files $uri /index.html;` ; Vercel : rewrite vers `/index.html`).

## 9. Points à valider avec la cliente

- **Tarif consultant** : 15 000 FCFA/heure (provisoire, `app.config.js` → `consultant.hourlyRateXaf`).
- **Durée du programme** : 6 mois (cahier des charges : 3 mois), `durationMonths`.
- **Prix du programme** : 300 000 FCFA (`priceXaf`).
- **Logo** : logo provisoire en SVG (`components/brand/KecLogo.vue`), à remplacer par le logo officiel.
- **Coordonnées bancaires et numéros MoMo/OM** affichés : **fictifs**.
- **Pays ouverts** : seul le Cameroun est actif ; les autres pays OHADA sont « bientôt ».
- **Échéancier du programme** : 2 tranches de 50 % (`programInstallments`), modulable.
- **Politique d'annulation des consultations** : avoir intégral à plus de 24 h, 50 % retenus en deçà, remboursement intégral si KEC annule (`consultant.freeCancellationHours`).
- **SLA de réponse humaine** : 4 h ouvrées (§3), paramétrable dans Manu AI › Paramètres.
- **Rôles de l'équipe** : admin, responsable, chargé(e) de dossiers, consultant, lecture seule (`team.rolePermissions`).
- **Idées d'évolution** : voir `docs/IDEES_AMELIORATION.md`.

## 10. Accessibilité et performance

- Animations réduites automatiquement si `prefers-reduced-motion`.
- Globe et poussière en canvas, allégés sur mobile ; code découpé par route.

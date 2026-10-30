# KEC — Idées d'amélioration pour la suite

Classées par valeur pour KEC et les fellows, puis par effort. Les références (§) renvoient au cahier des charges.

## 1. Vite utiles, peu d'effort

| Idée | Pourquoi | Effort |
|---|---|---|
| **Notifications WhatsApp / SMS / e-mail** (rendez-vous à J-1 et H-1, pièce refusée, réponse de l'équipe, reçu de paiement) | §5 cite WhatsApp comme canal clé ; le fellow n'a pas à revenir sur le site pour savoir qu'on lui a répondu. | Faible (service de notification + templates) |
| **Export calendrier (.ics) et lien « Ajouter à Google Agenda »** sur chaque rendez-vous confirmé | Évite les oublis, côté fellow comme côté consultant. | Très faible |
| **Code de parrainage** sur le ticket de la salle d'attente (« amenez un entrepreneur, gagnez une heure de consultant ») | §6 parle de bouche-à-oreille ; c'est déjà le 2ᵉ canal d'acquisition des mocks. | Faible |
| **Reçus PDF téléchargeables** et relevé annuel des paiements | Utile pour la comptabilité du fellow et les justificatifs diaspora. | Faible |
| **Rappel automatique du solde** avant l'étape « formalisation » | Le solde conditionne la création ; un rappel évite les dossiers bloqués. | Faible |
| **Swahili (et anglais pidgin)** : la mécanique i18n est prête, il ne manque que le fichier de langue | Ouverture Afrique de l'Est annoncée dans le cahier. | Faible (traduction) |

## 2. Différenciants pour le programme SCALE 110

| Idée | Pourquoi | Effort |
|---|---|---|
| **Annuaire public des entreprises certifiées** (page vitrine par entreprise : secteur, ville, logo, contact, sceau KEC) | §8 : « compte certifié et visible ». C'est la récompense tangible du programme et un argument commercial pour KEC. | Moyen |
| **Communauté des 110** : fil d'actualité de la cohorte, entraide par secteur, événements (Edéa…), annuaire des fellows | Le cahier insiste sur le réseau d'entreprises ; un espace communautaire fidélise. | Moyen |
| **Bibliothèque juridique** : modèles (pacte d'associés, bail, CDI, CGV) à remplir en ligne, avec relecture KEC payante | Produit récurrent après la création ; alimente les consultations. | Moyen |
| **Visio intégrée** (Jitsi / Daily) avec salle d'attente aux couleurs KEC et compte rendu dicté par le consultant | Expérience complète sans quitter la plateforme ; le compte rendu nourrit le dossier. | Moyen |
| **Suivi post-création** : échéances légales de l'entreprise (DSF, CNPS, patente, AG annuelle) avec rappels | Transforme KEC en partenaire de long terme (formation post-création §9). | Moyen |
| **Devis interactif public** (choisir forme juridique + ville → prix total) partageable par lien | Le cahier exige un devis affiché avant toute donnée ; l'ouvrir au public génère des leads. | Faible |

## 3. Manu AI, cran suivant

| Idée | Pourquoi | Effort |
|---|---|---|
| **Vrai LLM derrière Manu** (Claude via API) avec la base de connaissances éditée dans le back-office comme contexte, et les mêmes garde-fous | Les intentions par mots-clés plafonnent vite ; l'interface d'administration est déjà prête à recevoir un modèle. | Moyen |
| **Manu vocal** (messages audio en français, anglais, et plus tard langues locales) | Beaucoup d'entrepreneurs préfèrent la voix ; WhatsApp le montre. | Moyen |
| **Manu sur WhatsApp** (même moteur, même journal) | Là où sont les utilisateurs ; l'escalade ouvre la même conversation côté équipe. | Moyen |
| **Suggestions proactives** : Manu propose un rendez-vous quand le fellow bloque sur une étape, ou rappelle une pièce manquante | Réduit le travail de relance de l'équipe. | Faible |
| **Évaluation des réponses** (👍/👎) et boucle d'amélioration dans le rapport | Donne à l'équipe un signal direct pour enrichir la base. | Faible |

## 4. Back-office et conformité

| Idée | Pourquoi | Effort |
|---|---|---|
| **2FA réelle** (TOTP ou SMS) pour l'équipe, obligatoire pour les administrateurs | §12 ; l'écran Équipe affiche déjà l'état 2FA. | Faible |
| **Contrôle de lisibilité automatique des pièces** (OCR, flou, recadrage) avant envoi | Moins d'allers-retours « pièce illisible » ; c'est le 1ᵉʳ motif de refus. | Moyen |
| **Vérification d'identité (KYC)** des fellows et des payeurs tiers | Paiement payeur ≠ bénéficiaire (§6) et obligations LCB-FT. | Moyen |
| **Signature électronique** des statuts et du mandat KEC | Supprime l'impression / scan pour la diaspora. | Moyen |
| **Tableau de bord Kia enrichi** : rapport mensuel PDF automatique, cohortes, taux de conversion liste d'attente → fellow → entreprise créée | Les investisseurs veulent des tendances, pas seulement le direct. | Faible |
| **Automatisation de la rétention** des journaux et conversations (purge planifiée) | §7 ; le paramètre existe, il faut le job serveur. | Faible |
| **Gestion des congés et disponibilités des consultants** (plages, jours fériés camerounais) | Évite les réassignations manuelles. | Faible |

## 5. Expérience et technique

| Idée | Pourquoi | Effort |
|---|---|---|
| **PWA installable, mode hors-ligne** (brouillon du formulaire et coffre-fort consultables sans réseau) | Réseau instable au Cameroun ; téléphone d'abord. | Moyen |
| **Téléversement en arrière-plan avec reprise** pour les pièces lourdes | Même raison. | Faible |
| **Thème clair** (en plus du bois sombre) et préférence enregistrée | Lecture au soleil, accessibilité. | Faible |
| **Tests end-to-end Playwright** sur les parcours clés (inscription, paiement, réservation, réponse équipe) | Sécurise les évolutions avant le branchement des vraies API. | Faible |
| **Analytics respectueux** (Plausible / Matomo) avec événements métier (ticket pris, paiement, réservation) | Mesure réelle des canaux d'acquisition, aujourd'hui déclaratifs. | Faible |
| **Page statut / incidents** et mode dégradé global | Transparence quand MoMo ou Manu sont indisponibles. | Faible |

## 6. Business

- **Abonnement « KEC Compagnon »** après la certification (veille juridique, 1 h de consultant par trimestre, modèles illimités).
- **Offre diaspora** : pack création à distance avec mandataire local, suivi vidéo mensuel.
- **Partenariats banques / fintech** : ouverture de compte pro et prêt d'amorçage proposés à l'étape « entreprise créée ».
- **Marketplace de prestataires** validés par KEC (comptables, notaires, assureurs) avec commission.

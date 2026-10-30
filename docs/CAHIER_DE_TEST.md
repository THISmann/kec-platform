# Cahier de test · Plateforme KEC

Oct 24, 2026 · mis à jour le 28 oct. 2026 (lots 1 à 8) · @Seira

## Mode d'emploi

Ce cahier parcourt chaque partie de la version livrée le 24 octobre 2026 (mocks, sans serveur), complétée le 28 octobre par les huit lots du plan de corrections (section 21). Chaque ligne se joue en séance avec la cliente : on fait l'action, on compare au résultat attendu, on choisit un résultat dans la colonne et on note la remarque. Les lignes marquées « à discuter » sont des choix de conception à valider, pas des bugs.

**Préparation** : lancer `npm install` puis `npm run dev`, ouvrir http://localhost:5173 dans Chrome ou Safari. Les données sont stockées dans le navigateur ; pour repartir de zéro, taper `kecResetMock()` dans la console puis recharger. Pour tester le temps réel, ouvrir deux onglets (par exemple la salle d'attente et Kia).

**Comptes de démonstration**

| Espace | Adresse de connexion | E-mail | Mot de passe | Qui |
| --- | --- | --- | --- | --- |
| Fellow | /connexion | awa@kec.africa | fellow110 | Awa Ngono, fellow n° 17, dossier en instruction, acompte payé |
| Fellow | /connexion | brice@, clarisse@, dieudonne@, esther@, franck@, grace@, herve@, irene@, junior@kec.africa | fellow110 | Neuf autres fellows, chacun à un stade différent |
| Équipe KEC | /equipe/connexion | equipe@kec.africa | kec2026 | Kengne Manuella, fondatrice, administratrice |
| Équipe KEC | /equipe/connexion | paul@ (responsable), sandrine@ (chargée de dossiers), ndjock@, fouda@, weber@ (consultants), lydie@kec.africa (lecture seule) | kec2026 | Pour tester les droits par rôle |
| Kia | /kia/connexion | kia@kec.africa | kia2026 | Investisseurs |

**Légende des colonnes** : *Action* = ce que fait la testeuse ; *Attendu* = ce que l'appli doit montrer ; *Résultat* = À tester, OK, KO ou À discuter ; *Remarque* = la réaction de la cliente, un bug ou une décision.

## 1. Page d'accueil (public)

L'accueil doit donner l'identité africaine et amener vers la salle d'attente en moins de dix secondes.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 1.1 | Ouvrir / | La poussière de latérite forme le logo KEC à droite ; le texte de gauche apparaît 1 s après le début de l'animation, sans attendre la fin | À tester |  |
| 1.2 | Attendre 30 s sans bouger | Des cauris tombent par 1 à 4, toutes les 7 à 16 s, jamais en rafale | À tester |  |
| 1.3 | Faire défiler | Dans l'ordre : accueil, six services, globe (54 pays, 17 OHADA, 12 villes, 10 langues), parcours en sept perles qui s'enfilent, encart SCALE 110, nostalgie, Kopen Mind | À tester |  |
| 1.4 | Cliquer « Entrer dans la salle d'attente » | Arrivée sur /salle-d-attente | À tester |  |
| 1.5 | Carte « Un consultant, quand vous voulez » en bas | Aucun tarif affiché ; « Cliquez ici » ouvre le formulaire « Que pouvons-nous faire pour vous ? » (voir 21.7) ; la croix masque la carte pour la session | À tester |  |
| 1.6 | Changer la langue en haut à droite | Dix langues sur deux colonnes, chacune dans sa propre écriture ; toute la page change, le choix est gardé au rechargement | À tester |  |
| 1.7 | Pied de page | Liens « Mon espace · clients », Kia, équipe KEC ; contact (villes, e-mail) ; sept réseaux sous « Nous suivre » (WhatsApp, LinkedIn, Facebook, Instagram, TikTok, WeChat, Douyin) marqués « bientôt » tant que les liens manquent ; mention « pas de conseil juridique individualisé en ligne » | À tester |  |
| 1.8 | Sur téléphone (ou fenêtre réduite) | Menu burger, textes lisibles, pas de défilement horizontal | À tester |  |

## 2. Salle d'attente et liste d'attente

On doit se sentir dans une salle d'attente vivante, et l'inscription doit prendre moins de trois minutes.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 2.1 | Ouvrir /salle-d-attente et observer 20 s | Ventilateur qui tourne, horloge à l'heure réelle, lampe qui oscille avec une mouche, fenêtre avec soleil, nuages, oiseaux, palmier et rideau qui bougent | À tester |  |
| 2.2 | Le banc sous le titre | Six personnes assises, carnations, coiffures et tenues variées (boubou, pagne, wax, cheveux longs, cheveux gris) ; elles respirent, l'une regarde son téléphone, une autre discute (bulle) ; plante et radio animées | À tester |  |
| 2.3 | Attendre une arrivée simulée (toutes les quelques secondes) | La porte « Entrée » s'ouvre, une silhouette entre et s'assoit ; la liste « X de Yaoundé vient de s'asseoir » et le compteur augmentent | À tester |  |
| 2.4 | Jetons « Café, Thé, Vin blanc, Arachides bouillies, Cola » | Manu demande « On vous prend quoi à boire ? » ; chaque jeton joue sa scène (bouilloire et tasse, théière et verre, bouteille et verre à pied, marmite et bol, noix de cola qui se fend) et Manu commente ce qu'elle a servi | À tester |  |
| 2.5 | Proverbes | Un proverbe change toutes les 7 s, avec son pays d'origine (drapeau + nom) ; le koki camerounais ouvre la série ; l'ordre est mélangé à chaque visite | À tester |  |
| 2.6 | Formulaire étape 1 : laisser vide et cliquer Suivant | Messages d'erreur sous prénom, nom, e-mail ; l'e-mail invalide est refusé | À tester |  |
| 2.7 | Étape 2 : pays cible, ville, secteur, stade du projet, résumé, besoins | Seul le Cameroun est ouvert, les autres pays OHADA sont « bientôt » ; villes proposées (Douala, Yaoundé, Edéa…) | À tester |  |
| 2.8 | Étape 3 : canal d'acquisition et consentement | Le canal « agent de terrain » ou « évènement » demande un détail ; impossible d'envoyer sans le consentement données | À tester |  |
| 2.9 | Envoyer | Pluie de 110 cauris, ticket numéroté avec prénom et ville, position dans la file, boutons de partage ; vous entrez dans la salle (porte + silhouette) | À tester |  |
| 2.10 | Réessayer avec le même e-mail | Message « déjà dans la salle d'attente, votre place est gardée » | À tester |  |
| 2.11 | Deux onglets : inscrire quelqu'un dans l'un, regarder l'autre (salle ou Kia) | L'arrivée apparaît en direct dans l'autre onglet | À tester |  |
| 2.12 | Sur téléphone | Banc visible sous Manu, formulaire en une colonne, boutons accessibles au pouce | À tester |  |

## 3. Manu AI, côté visiteur

Manu accueille, oriente et passe la main à un humain dès qu'un sujet est sensible ; elle ne donne jamais de conseil juridique individualisé (cahier des charges §7).

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 3.1 | Sur l'accueil, attendre quelques secondes | Une bulle d'invitation apparaît près de l'avatar de Manu (une fois par session) | À tester |  |
| 3.2 | Cliquer l'avatar en bas à droite | Fenêtre de discussion, message d'accueil dans la langue du site, réponses rapides (programme, liste d'attente, formes juridiques…) | À tester |  |
| 3.3 | Écrire « Quelle différence entre SARL et SAS ? » | Réponse générale sur les formes juridiques, sans recommandation personnelle, avec invitation à réserver un consultant | À tester |  |
| 3.4 | Écrire « J'ai un problème de TVA avec les impôts » | Manu refuse de répondre sur le fond et transmet à l'équipe (motif fiscal) ; une conversation s'ouvre côté KEC | À tester |  |
| 3.5 | Écrire trois messages incompréhensibles (« azerty », « hmm », « ??? ») | Après la 3ᵉ incompréhension, Manu passe la main à un humain | À tester |  |
| 3.6 | Écrire « je veux parler à quelqu'un » | Transfert immédiat à l'équipe | À tester |  |
| 3.7 | Cliquer une réponse rapide « liste d'attente » | Manu propose le lien et peut emmener vers la salle d'attente | À tester |  |
| 3.8 | Passer le site dans chacune des dix langues, rouvrir Manu | Message d'accueil et réponses rapides dans la langue choisie | À tester |  |
| 3.9 | Dans le back-office, Manu AI › Journal des échanges | Les messages envoyés en 3.3 à 3.6 y figurent avec l'intention détectée et la page | À tester |  |

## 4. Connexion fellow et tableau de bord

Le fellow voit d'un coup d'œil où il en est : parcours, dossier, pièces, rendez-vous, solde, messages.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 4.1 | /connexion avec un mauvais mot de passe | Message « e-mail ou mot de passe incorrect », pas de blocage | À tester |  |
| 4.2 | Se connecter avec awa@kec.africa / fellow110 | Arrivée sur /espace ; en-tête « Awa Ngono · Fellow #017 / 110 » | À tester |  |
| 4.3 | Bandeau d'accueil | « Akwaba, Awa ! », frise des 6 mois avec le mois en cours en or, date de certification prévue | À tester |  |
| 4.4 | Carte Mon entreprise | Nom de l'entreprise, statut « En instruction », les sept perles avec les étapes faites en vert | À tester |  |
| 4.5 | Carte Coffre-fort | Nombre de pièces, alerte sur la pièce à reprendre (casier judiciaire illisible) | À tester |  |
| 4.6 | Carte Consultant | Prochain rendez-vous (date, heure, consultant, durée, sujet), nombre de rendez-vous à venir | À tester |  |
| 4.7 | Carte Paiements | 150 000 payés sur 300 000, barre de progression, bouton « Régler le solde » | À tester |  |
| 4.8 | Bandeau Messages | « 1 non lu », clic vers la messagerie | À tester |  |
| 4.9 | « Faire pleuvoir des cauris » | Pluie de cauris, juste pour le plaisir | À tester |  |
| 4.10 | Se connecter avec herve@kec.africa | Dossier en brouillon : la carte propose d'ouvrir le dossier, aucun interlocuteur encore | À tester |  |
| 4.11 | Se déconnecter puis taper /espace dans la barre d'adresse | Renvoi vers la page de connexion | À tester |  |

## 5. Mon entreprise : formulaire et fiche dossier

Avant l'envoi, un formulaire en cinq étapes avec le devis affiché avant toute donnée sensible ; après l'envoi, une fiche dossier complète remplace le formulaire.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 5.1 | Avec herve@kec.africa (brouillon), ouvrir Mon entreprise | Le formulaire s'ouvre à l'étape 1 : pays et ville ; le brouillon est conservé entre deux visites | À tester |  |
| 5.2 | Étape 2 : choisir SARL puis SAS | Le devis total (frais KEC + frais légaux) change immédiatement ; encadré « informations générales, réservez un consultant pour votre cas » | À tester |  |
| 5.3 | Étape 3 : formulaire détaillé | Nom, secteur, activité, adresse, capital, gérant, associés avec répartition ; la répartition doit faire 100 % sinon erreur | À tester |  |
| 5.4 | Étape 4 : pièces | Téléverser une image ou un PDF par type de pièce ; un fichier .docx ou trop lourd est refusé avec un message clair | À tester |  |
| 5.5 | Étape 5 : envoyer | Statut « Envoyé », référence KEC-CM-26-00xx, journal « Dossier envoyé par l'entrepreneur » | À tester |  |
| 5.6 | Revenir sur Mon entreprise | Le formulaire n'est plus affiché : fiche dossier avec référence, statut, interlocuteur ou « attribution en cours » | À tester |  |
| 5.7 | Avec awa@kec.africa, ouvrir Mon entreprise | Fiche complète : Ngono Agro SARL, interlocutrice, date de création prévue, sept perles datées (faites / prévues), informations déclarées, besoins, associés avec barres de répartition | À tester |  |
| 5.8 | Colonne de droite | Pièces du dossier avec statuts (vérifié, à vérifier, à reprendre et motif), journal du dossier avec dates et auteurs | À tester |  |
| 5.9 | « Modifier mon dossier » | Le formulaire se rouvre pré-rempli ; « Retour au dossier » ramène à la fiche sans perdre les données | À tester |  |
| 5.10 | « Écrire à Manuella » (ou à l'équipe) | Ouvre la messagerie avec un nouveau message de type « Mon dossier » | À tester |  |
| 5.11 | Avec grace@kec.africa (entreprise créée, certifiée) | Sceau « Certifié » sur la fiche, numéros RCCM et NIU affichés | À tester |  |

## 6. Coffre-fort documentaire

Toutes les pièces du fellow au même endroit, avec leur statut de vérification par l'équipe.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 6.1 | Avec awa@kec.africa, ouvrir Coffre-fort | Liste des pièces (CNI, plan de localisation, photo, statuts, casier) avec date, taille et statut ; filtres tous / à vérifier / vérifiés / à reprendre | À tester |  |
| 6.2 | Cliquer une pièce | Aperçu, nom du fichier, statut, motif de refus le cas échéant | À tester |  |
| 6.3 | Téléverser un nouveau casier judiciaire (JPG ou PDF) | La pièce passe « à vérifier » et remplace l'ancienne dans la liste ; le dossier la voit aussi | À tester |  |
| 6.4 | Téléverser un fichier de 15 Mo ou un .docx | Refus avec message « fichier trop lourd » ou « format non accepté » | À tester |  |
| 6.5 | Supprimer une pièce depuis l'aperçu | Demande de confirmation, puis suppression ; une pièce émise par KEC (projet de statuts) n'a pas de bouton Supprimer | À tester |  |
| 6.6 | Côté équipe, valider la pièce envoyée en 6.3 | Le fellow la voit « vérifiée » au rechargement, avec le nom de la personne qui a vérifié | À tester |  |
| 6.7 | Sur téléphone | Téléversement depuis l'appareil photo possible | À tester |  |

## 7. Consultants et rendez-vous, côté fellow

Le fellow voit tous ses rendez-vous (avec qui, quand, combien de temps, à quel sujet), en réserve un en trois choix et peut annuler selon la politique affichée.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 7.1 | Avec awa@kec.africa, ouvrir Consultant | Onglet « Mes rendez-vous (3) » : 3 à venir, 2 réalisés, 4 h de conseil, 60 000 FCFA investis | À tester |  |
| 7.2 | Carte d'un rendez-vous confirmé | Date, consultant et spécialité, sujet, horaire et durée, format (visio, téléphone, bureau), montant, lien « Rejoindre » pour une visio, précisions données | À tester |  |
| 7.3 | Rendez-vous « en attente de paiement » (29 oct., 7 500 FCFA) | Bouton « Régler 7 500 FCFA » qui ouvre le paiement ; après paiement, statut « Confirmé » | À tester |  |
| 7.4 | Historique | Rendez-vous terminés avec le compte rendu du consultant ; rendez-vous annulé avec le motif et l'avoir crédité | À tester |  |
| 7.5 | Annuler le rendez-vous du 2 nov. (à plus de 24 h) | Fenêtre : « 22 500 FCFA intégralement crédité », motif obligatoire ; après confirmation, carte « Annulé » avec avoir | À tester |  |
| 7.6 | Onglet Réserver : choisir Me Ndjock, un jour, un créneau, 60 min, visio, un sujet | Résumé en bas « date à heure · 60 min » et montant 15 000 FCFA ; les créneaux déjà pris sont barrés | À tester |  |
| 7.7 | « Réserver et payer » puis payer par MoMo | Confirmation « C'est réservé ! », cauris, le rendez-vous apparaît dans Mes rendez-vous et une conversation « Consultant » s'ouvre dans Messages | À tester |  |
| 7.8 | Côté équipe, Rendez-vous | Le rendez-vous réservé en 7.7 est visible le bon jour, avec le nom du fellow | À tester |  |
| 7.9 | Lire la politique d'annulation en bas de page | Gratuit jusqu'à 24 h avant, 50 % retenus après, avoir utilisable sur la prochaine consultation | À discuter |  |

## 8. Paiements, côté fellow

Le règlement du programme se teste de bout en bout : Awa n'a payé que l'acompte. En démo, tout numéro Mobile Money passe sauf ceux qui finissent par 00.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 8.1 | Ouvrir Paiements | Échéancier : acompte 150 000 coché, solde 150 000 à payer, barre à 50 % ; historique avec reçus et références | À tester |  |
| 8.2 | Panneau « Régler le solde » | Choix : solde complet 150 000, tranche 50 000, tranche 100 000 ; quatre moyens : MTN MoMo, Orange Money, virement, carte « bientôt » (désactivée) | À tester |  |
| 8.3 | MoMo avec le numéro +237 699 123 400 | Échec simulé avec motif ; aucune ligne « payé » ajoutée | À tester |  |
| 8.4 | Tranche 50 000 par MoMo avec +237 699 123 456 | Écran « Confirmez sur votre téléphone » puis « Paiement reçu » avec n° de reçu ; cauris ; l'échéancier montre 50 000 / 150 000 sur le solde | À tester |  |
| 8.5 | Solde restant par virement bancaire | Coordonnées (fictives) et référence à indiquer ; ligne « virement attendu » dans l'historique et sur l'échéancier | À tester |  |
| 8.6 | Côté équipe, Paiements › Virements à rapprocher › Confirmer | Le fellow voit la ligne « payé » avec son reçu ; « Programme entièrement réglé » si tout est payé | À tester |  |
| 8.7 | Filtres de l'historique | Tous / Programme / Consultation ; les consultations annulées montrent l'avoir | À tester |  |
| 8.8 | Payer pour quelqu'un d'autre (payeur ≠ bénéficiaire) | Le cahier des charges l'autorise (§6) mais cette version n'a pas de champ « qui paie ? » : le reçu porte le nom du fellow. À décider avec la cliente : ajouter un champ payeur (nom, téléphone) et un reçu à son nom | À discuter |  |
| 8.9 | Avec irene@kec.africa | Virement de 300 000 en attente de validation par l'équipe, visible sur l'échéancier | À tester |  |

## 9. Messagerie, côté fellow

Une seule boîte pour tous les échanges : Manu, consultants, dossier, paiement, assistance. Réponse humaine attendue sous 4 h ouvrées.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 9.1 | Ouvrir Messages (badge « 1 » dans le menu) | Liste des conversations avec type, objet, dernier message, interlocuteur, statut ; la non lue est marquée d'un point | À tester |  |
| 9.2 | Filtres Tous / En cours / Clos | La liste se filtre ; le badge du menu disparaît une fois la conversation lue | À tester |  |
| 9.3 | Ouvrir « Question fiscale sur la TVA » | Fil complet : message à Manu, réponse de Manu, ligne système « transmise à l'équipe, assignée à Mme Fouda » ; statut « À traiter » | À tester |  |
| 9.4 | Répondre (Entrée envoie, Maj + Entrée saute une ligne) | Le message apparaît à droite avec l'heure ; côté équipe, la conversation repasse « à traiter » | À tester |  |
| 9.5 | « Nouveau message » : sujet Mon dossier, objet, texte | La conversation est créée, confirmée par un toast, et visible côté équipe | À tester |  |
| 9.6 | Écrire dans une conversation close | Bandeau « conversation close, écrivez pour la rouvrir » ; l'envoi la rouvre | À tester |  |
| 9.7 | Vérifier qu'aucune note interne de l'équipe n'est visible | Les notes internes (« relancer lundi ») n'apparaissent jamais côté fellow | À tester |  |
| 9.8 | Sur téléphone | Liste puis conversation en plein écran avec retour | À tester |  |

## 10. Kopen Mind

La boîte à idées, ouverte au public et aux fellows, lue par l'équipe.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 10.1 | /kopen-mind sans être connecté | Présentation, catégories, formulaire d'idée avec e-mail facultatif | À tester |  |
| 10.2 | Envoyer une idée | Remerciement, cauris ; l'idée apparaît dans Messages › Kopen Mind côté équipe avec le badge « Nouveau » | À tester |  |
| 10.3 | Depuis l'espace fellow | Même formulaire, l'idée porte le nom du fellow | À tester |  |
| 10.4 | Côté équipe : marquer lue, puis « Ajouter à la feuille de route » | Les badges changent ; le compteur « nouvelles suggestions » de la vue d'ensemble baisse | À tester |  |

## 11. Back-office : connexion, vue d'ensemble, sélection des 110

La connexion équipe ouvre le profil administrateur de Kengne Manuella. La vue d'ensemble donne les tâches du jour ; la liste d'attente permet de choisir les 110, pas un de plus.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 11.1 | /equipe/connexion avec equipe@kec.africa / kec2026 | En-tête « Kengne Manuella · Fondatrice & directrice · Administrateur » ; menu complet : vue d'ensemble, liste d'attente, dossiers, rendez-vous, messages, paiements, Manu AI, équipe & rôles | À tester |  |
| 11.2 | Vue d'ensemble | Quatre indicateurs (liste d'attente / objectif 1 000, fellows retenus / 110, encaissé, part diaspora) et six tâches : pièces à vérifier, messages à traiter avec le nombre hors délai, rendez-vous de la semaine, virements à confirmer, suggestions, places restantes | À tester |  |
| 11.3 | Pipeline des créations | Un compteur par statut de dossier, délai moyen envoi → création, comptes certifiés | À tester |  |
| 11.4 | Graphiques | Inscriptions sur 30 jours, canaux d'acquisition, villes de création | À tester |  |
| 11.5 | Liste d'attente : rechercher, filtrer par statut, trier | La table réagit ; clic sur une ligne ouvre la fiche du candidat (projet, besoins, canal) | À tester |  |
| 11.6 | Présélectionner puis retenir un candidat | Statuts mis à jour, compteur « retenus / 110 » incrémenté, action tracée dans le journal d'audit | À tester |  |
| 11.7 | Retenir au-delà de 110 | Refus : « Les 110 places sont déjà attribuées » | À tester |  |
| 11.8 | Export CSV | Fichier téléchargé avec les colonnes de la liste, lisible dans Excel | À tester |  |
| 11.9 | Se connecter avec lydie@kec.africa (lecture seule) | Menu réduit : pas de Manu AI ni d'Équipe & rôles ; taper /equipe/manu renvoie à la vue d'ensemble | À tester |  |
| 11.10 | Se connecter avec ndjock@kec.africa (consultant) | Il voit ses rendez-vous et ses conversations ; pas de sélection des 110 | À tester |  |

## 12. Back-office : dossiers

L'équipe suit chaque dossier de bout en bout sans développeur (cahier des charges §13) ; chaque action est journalisée et visible par le fellow.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 12.1 | Ouvrir Dossiers | 10 cartes : entreprise, fellow, forme, ville, statut, référence, barre d'avancement, interlocuteur, pièces à vérifier, rendez-vous, messages ; « 5 nécessitent une action » | À tester |  |
| 12.2 | Rechercher « Fotso », filtrer « sans interlocuteur », « pièces à vérifier » | La liste se réduit aux bons dossiers | À tester |  |
| 12.3 | Ouvrir Ngono Agro SARL | En-tête avec e-mail et téléphone du fellow, statut, interlocuteur ; six onglets : Dossier, Pièces, Étapes, Rendez-vous, Paiements, Notes | À tester |  |
| 12.4 | Onglet Pièces : valider le projet de statuts, refuser une pièce avec motif | Statuts mis à jour avec « vérifié par Kengne Manuella » ; le fellow voit le motif dans son coffre et son journal | À tester |  |
| 12.5 | Onglet Étapes : cocher « Création / formalisation » | Date du jour enregistrée ; la perle devient dorée côté fellow (fiche et tableau de bord) | À tester |  |
| 12.6 | Changer le statut en « Déposé » puis « Entreprise créée » | Journal alimenté, RCCM généré à la création, étapes cohérentes | À tester |  |
| 12.7 | Changer l'interlocuteur (Sandrine Tchami) | Journal « dossier assigné à … » ; le fellow voit son nouveau contact | À tester |  |
| 12.8 | « Demander une pièce » : choisir la pièce, message pré-rempli | Statut « pièces demandées », message reçu par le fellow dans sa messagerie (type Mon dossier) | À tester |  |
| 12.9 | « Certifier le compte » sur un dossier créé | Sceau certifié côté fellow ; compteur « comptes certifiés » de la vue d'ensemble | À tester |  |
| 12.10 | Onglet Notes : ajouter une note interne | Visible par l'équipe seulement, avec auteur et date | À tester |  |
| 12.11 | Onglets Rendez-vous et Paiements | Tous les rendez-vous et paiements du fellow, avec statuts et reçus | À tester |  |
| 12.12 | « Écrire au fellow » | Ouvre la messagerie équipe sur ses conversations | À tester |  |

## 13. Back-office : rendez-vous consultants

Tous les rendez-vous demandés par les fellows, centralisés avec leurs détails, et les trois actions de l'équipe : compte rendu, réassignation, annulation.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 13.1 | Ouvrir Rendez-vous | Indicateurs : cette semaine (et aujourd'hui), en attente de paiement, comptes rendus à rédiger, heures de conseil, chiffre consultations ; répartition par consultant et par spécialité | À tester |  |
| 13.2 | Agenda « À venir » | Groupé par jour ; chaque carte : fellow et son numéro, consultant, sujet, horaire, durée, format, montant, statut, précisions du fellow | À tester |  |
| 13.3 | Filtres : consultant, statut, recherche « TVA » | La liste se réduit ; « Passés » montre les terminés et annulés | À tester |  |
| 13.4 | « Compte rendu » sur un rendez-vous passé encore « confirmé » | Fenêtre avec rappel du rendez-vous ; le compte rendu est obligatoire ; statut « Terminé » ; le fellow le lit dans son historique | À tester |  |
| 13.5 | « Réassigner » à Mme Fouda | Le nom du consultant change sur la carte et côté fellow | À tester |  |
| 13.6 | « Annuler » un rendez-vous confirmé avec motif | Carte « Annulé », avoir intégral crédité au fellow (annulation par KEC), motif visible côté fellow | À tester |  |
| 13.7 | « Ouvrir le dossier » | Arrivée sur la fiche dossier du fellow | À tester |  |
| 13.8 | Avec ndjock@kec.africa | Ses rendez-vous seulement, mêmes actions | À tester |  |

## 14. Back-office : messages

Une boîte à trois volets : liste filtrée, conversation, contexte du fellow. Le délai de réponse humaine de 4 h (cahier des charges §3) est suivi conversation par conversation.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 14.1 | Ouvrir Messages (badge « 7 ») | Liste à gauche avec type, priorité, objet, fellow, interlocuteur, statut ; « 3 hors délai » en rouge avec la marque SLA sur chaque conversation concernée | À tester |  |
| 14.2 | Filtres : statut, sujet, « les miennes », recherche | La liste se réduit | À tester |  |
| 14.3 | Ouvrir « Litige avec mon fournisseur de tissu » | Fil complet avec la ligne système d'escalade de Manu ; à droite, le contexte : entreprise, statut du dossier, interlocuteur, résidence, montant réglé, pièces, prochains rendez-vous, autres conversations | À tester |  |
| 14.4 | Assigner la conversation à Me Ndjock, passer la priorité à Urgent, ajouter l'étiquette « wax » | Les champs changent immédiatement ; le fellow voit « suivi par Me Ndjock » | À tester |  |
| 14.5 | Cliquer une réponse rapide puis envoyer | Le texte est inséré avec le prénom du fellow ; après envoi, statut « Réponse envoyée », la marque hors délai disparaît, le compteur du menu baisse | À tester |  |
| 14.6 | Cocher « Note interne » et envoyer | Bulle distincte, invisible côté fellow (vérifier avec le compte du fellow) | À tester |  |
| 14.7 | Passer le statut à « Clos » | Le fellow voit « Clos » ; sa réponse rouvre la conversation côté équipe | À tester |  |
| 14.8 | Conversation en allemand (Franck Tchoumi) | Le contenu allemand s'affiche correctement, l'équipe peut répondre | À tester |  |
| 14.9 | Onglet Kopen Mind | Les suggestions avec catégorie, auteur, statut et actions | À tester |  |
| 14.10 | Sur téléphone | Liste puis conversation plein écran ; le contexte se replie derrière un bouton | À tester |  |

## 15. Back-office : paiements

Tous les encaissements (programme et consultations), le rapprochement des virements et la gestion des échecs (cahier des charges §6).

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 15.1 | Ouvrir Paiements | Encaissé total et sur 30 jours, consultations, virements attendus avec montant, échecs ; répartition par moyen de paiement | À tester |  |
| 15.2 | Bloc « Virements à rapprocher » | Hervé Djoumessi (solde 150 000, réf. KEC-BX11TR) et Irène Ndongo (300 000, réf. KEC-7HQ2PL) avec les boutons Confirmer et ✕ | À tester |  |
| 15.3 | Confirmer le virement d'Irène | Cauris, ligne « Payé » avec reçu ; côté fellow (irene@), programme entièrement réglé | À tester |  |
| 15.4 | Rejeter le virement d'Hervé avec un motif | Ligne « Échoué » avec le motif, visible par le fellow | À tester |  |
| 15.5 | Filtres : objet, statut, recherche par référence | La table se réduit ; les paiements simulés sont marqués | À tester |  |
| 15.6 | Export CSV | Fichier avec date, payeur, objet, tranche, montant, moyen, statut, référence, reçu | À tester |  |
| 15.7 | Avec sandrine@kec.africa (chargée de dossiers) | Elle voit les paiements mais pas les boutons Confirmer / Rejeter (droit réservé aux responsables et administrateurs) | À tester |  |

## 16. Back-office : Manu AI

L'équipe pilote l'assistant sans développeur : rapport, paramètres publiés avec versions, base de connaissances, journal des échanges (cahier des charges §7).

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 16.1 | Onglet Rapport, période 7 / 30 / 90 jours | Messages reçus et conversations, part résolue par Manu, escaladés, réponse humaine moyenne et hors délai ; volume par jour ; sujets les plus demandés, motifs d'escalade, langues, messages non compris | À tester |  |
| 16.2 | Onglet Paramètres : changer le ton en « Formel » et écrire un message d'accueil en français, puis Publier avec une note | Version v4, « dernière publication par Kengne Manuella » ; Manu accueille avec le nouveau message sur le site public | À tester |  |
| 16.3 | Décocher le garde-fou « Fiscal » et publier, puis écrire « problème de TVA » à Manu | Manu ne transmet plus pour ce motif (à recocher ensuite) | À tester |  |
| 16.4 | Ajouter « douane » aux mots-clés sensibles, publier, écrire « frais de douane » à Manu | Transmission à l'équipe, motif conseil personnalisé | À tester |  |
| 16.5 | Passer le seuil d'incompréhensions à 2 | Manu passe la main après deux messages incompris | À tester |  |
| 16.6 | Activer le mode dégradé | Manu affiche un message d'excuse et n'ouvre plus de conversation ; désactiver ensuite | À tester |  |
| 16.7 | « Abandonner » après des modifications non publiées | Retour aux valeurs publiées ; l'historique des versions liste v1 à v4 avec les notes | À tester |  |
| 16.8 | Onglet Base de connaissances : intention « Tarifs », ajouter le mot-clé « combien ça coûte » et modifier la réponse FR, publier | Manu répond avec le nouveau texte à « combien ça coûte ? » ; l'intention est marquée « modifiée » ; onglets EN et DE séparés | À tester |  |
| 16.9 | Désactiver l'intention « Kopen Mind » | Manu ne la reconnaît plus (message non compris) ; la réactiver | À tester |  |
| 16.10 | Onglet Journal : rechercher « SARL », filtrer « escaladés » | Lignes avec date, visiteur ou fellow, langue, message, intention, page ; la rétention affichée en paramètres (90 jours) est celle du cahier à confirmer | À discuter |  |

## 17. Back-office : équipe et rôles

L'administratrice gère les membres, leurs droits par rôle, la double authentification et consulte le journal d'audit (cahier des charges §12).

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 17.1 | Ouvrir Équipe & rôles | Neuf membres avec fonction, e-mail, dernière connexion, rôle, statut (actif, invité, désactivé), 2FA ; résumé par rôle et taux de 2FA ; Kengne Manuella marquée « vous » | À tester |  |
| 17.2 | Changer le rôle de Lydie Kouam en « Chargé(e) de dossiers » | Toast de confirmation ; connectée avec lydie@, elle voit maintenant les dossiers en écriture | À tester |  |
| 17.3 | Essayer de changer son propre rôle | Le sélecteur est désactivé pour soi-même | À tester |  |
| 17.4 | Désactiver Paul Nkeng puis tenter de se connecter avec paul@ | Confirmation demandée ; à la connexion, « ce compte a été désactivé » ; réactiver ensuite | À tester |  |
| 17.5 | Inviter un membre (nom, e-mail, rôle, fonction) | Carte « Invité », 2FA non activée, action dans l'audit ; un e-mail déjà présent est refusé | À tester |  |
| 17.6 | Onglet Droits par rôle | Matrice des 12 droits pour les 5 rôles : administrateur, responsable, chargé(e) de dossiers, consultant, lecture seule | À tester |  |
| 17.7 | Onglet Journal d'audit | Qui, quand, quoi : connexions, sélections, validations de pièces, paiements confirmés, paramètres Manu, changements de rôle ; les actions faites pendant la séance y figurent | À tester |  |
| 17.8 | Avec paul@kec.africa (responsable) | La page Équipe & rôles n'est pas dans son menu | À tester |  |

## 18. Kia, l'espace investisseurs

Pensé pour le téléphone : les inscriptions et les encaissements arrivent en direct.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 18.1 | /kia/connexion avec kia@kec.africa / kia2026, de préférence sur téléphone | Tableau : liste d'attente et objectif 1 000, retenus / 110, encaissé, potentiel, part diaspora, inscriptions par jour, canaux, villes | À tester |  |
| 18.2 | Fil d'activité | Évènements datés : inscriptions, paiements, fellows retenus | À tester |  |
| 18.3 | Laisser l'écran ouvert 30 s | Des évènements simulés arrivent ; vibration sur téléphone | À tester |  |
| 18.4 | Autoriser les notifications puis mettre l'onglet en arrière-plan | Notification système à chaque évènement | À tester |  |
| 18.5 | Deux onglets : inscription dans la salle d'attente, Kia à côté | L'inscription apparaît dans Kia en direct | À tester |  |

## 19. Tests transversaux

À jouer une fois chaque, sur n'importe quelle page.

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 19.1 | Passer en anglais puis en allemand depuis chaque espace (public, fellow, équipe, Kia) | Tout est traduit, y compris Manu, les statuts, les e-mails types ; aucune clé brute du type « bo.inbox.title » | À tester |  |
| 19.1b | Passer en espagnol, portugais, russe, swahili, lingala, chinois, arabe sur le public, l'espace fellow et Kia | Tout est traduit ; dans l'espace équipe, les écrans restent en français (choix volontaire) ; aucune clé brute | À tester |  |
| 19.2 | Tout le parcours sur un téléphone (ou largeur 390 px) | Menu bas scrollable dans les espaces connectés, tableaux défilables, aucune coupure de texte | À tester |  |
| 19.3 | Activer « Réduire les animations » dans le système | Poussière, cauris, salle d'attente et globe se calment ; le site reste utilisable | À tester |  |
| 19.4 | Navigation au clavier (Tab, Entrée, Échap sur les fenêtres) | Focus visible, fenêtres fermables, Manu utilisable au clavier | À tester |  |
| 19.5 | Recharger n'importe quelle page connectée | La session reste ouverte ; les données modifiées pendant la séance sont conservées | À tester |  |
| 19.6 | Taper une adresse inexistante (/abc) | Page « Les cauris n'ont pas trouvé cette page » avec retour à l'accueil | À tester |  |
| 19.7 | `kecResetMock()` dans la console puis recharger | Retour aux données de démonstration d'origine | À tester |  |
| 19.8 | Temps de chargement du premier écran sur une connexion lente (outil réseau du navigateur en 3G) | Accueil utilisable en moins de 5 s ; les autres pages se chargent à la demande | À tester |  |

## 21. Version du 28 octobre : les huit lots du plan de corrections

Chaque lot reprend un retour de la cliente. Les hypothèses prises pour les questions ouvertes (Q1 à Q12 du plan) sont rappelées dans la colonne Attendu ; elles se changent sans développement lourd.

**Lot 1 · Navigation et accueil**

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 21.1 | Survoler « Accueil ▾ » dans l'en-tête | Menu déroulant : Services, Le parcours, Le programme ; chaque entrée fait défiler jusqu'à la section | À tester |  |
| 21.2 | Faire défiler l'accueil lentement | L'entrée du menu correspondant à la section visible se souligne en or (scroll-spy) ; sur téléphone, les trois sous-entrées sont indentées sous Accueil | À tester |  |
| 21.3 | Texte du globe | Nouveau texte « Où que vous soyez : New York, Berlin… », sans tiret long ; aucun tiret long nulle part sur le site (contrôlé par `npm run check:i18n`) | À tester |  |
| 21.4 | Section « Le parcours SCALE 110 » | Sous-titre « Sept perles sur un même fil » ; en arrivant sur la section, le fil se tend et les sept perles s'enfilent l'une après l'autre, la dernière brille ; le collier oscille doucement | À tester |  |
| 21.5 | Encart programme | Texte « KEC choisit les 110 fellows parmi la liste d'attente » ; logo KEC en filigrane ; plus de ligne « prix » dans les trois points | À tester |  |

**Lot 2 · Cauris**

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 21.6 | Accueil ou salle d'attente, attendre 2 min | Les cauris tombent lentement, se posent en bas de l'écran et s'empilent (3 rangées maximum) ; de temps en temps l'un d'eux bouge ; jamais plus de 60 posés (30 sur téléphone), les plus anciens s'effacent | À tester |  |
| 21.7b | Quitter vers une autre page | Les cauris posés s'effacent en fondu ; sur les autres pages ils tombent et disparaissent comme avant | À tester |  |
| 21.8 | Redimensionner la fenêtre | Les cauris posés restent au sol, sans trou ni superposition | À tester |  |

**Lot 3 · Globe interactif**

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 21.9 | Survoler un pays d'Afrique | Il rougit, la rotation se met en pause, une fiche apparaît : drapeau, nom, « Membre OHADA » si c'est le cas, un repère en une phrase, mention « Repère à valider par KEC » | À tester |  |
| 21.10 | Cliquer un pays (ou le toucher sur mobile) | La fiche reste épinglée avec un bouton Fermer et un lien « Créer ici » vers la salle d'attente ; Échap ferme | À tester |  |
| 21.11 | Faire glisser le globe | Il tourne à la main sans ouvrir de fiche ; relâché, il reprend sa rotation | À tester |  |
| 21.12 | Observer 1 min | Les arcs partent de 15 villes de la diaspora vers des villes africaines différentes toutes les 20 s | À tester |  |
| 21.13 | Compteurs sous le texte | 54 pays, 17 OHADA, 12 villes reliées, 10 langues (calculés depuis les données, pas saisis à la main) | À tester |  |
| 21.14 | À discuter | Les 54 repères (`src/data/africaFacts.js`) ont été rédigés par Seira : la cliente les valide ou les corrige ; le drapeau « à valider » disparaît dès que `validated: true` | À discuter |  |

**Lot 4 · Libellés**

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 21.15 | En-tête, pied de page, page de connexion, espace connecté | « Mon espace » partout (plus « Espace fellows ») ; dans l'espace, badge « Fellow #17 / 110 » | À tester |  |
| 21.16 | Kia | Titre « Kia · KEC Invest Again » ; accueil « Cher investisseur, bonjour {prénom}. » ; info-bulle sur le lien du pied de page | À tester |  |
| 21.17 | Boîte Kopen Mind | « KOPEN MIND » gravé dans le bois du couvercle, les motifs sculptés en dessous | À tester |  |
| 21.18 | À discuter | Comptes clients en libre-service (inscription, mot de passe oublié) : lot 9, non livré, à planifier | À discuter |  |

**Lot 5 · Salle d'attente**

Voir 2.2, 2.4 et 2.5 mis à jour. Les proverbes et leurs pays d'origine sont dans `src/data/proverbs.js` (55 proverbes, un par pays ; attributions proposées par Seira, à arbitrer).

**Lot 6 · Manu, voix et langues**

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 21.19 | Ouvrir Manu | Message d'accueil « Hello, et bienvenue à K-Enterprise Counsel 🌍 Je suis Manu, la réceptionniste de KEC. Comment puis-je vous aider aujourd'hui ? » (ou sa traduction) ; bouton micro à gauche du champ, bouton haut-parleur dans l'en-tête | À tester |  |
| 21.20 | Cliquer le micro (Chrome, Edge ou Safari) et parler | Le bouton pulse en rouge, le texte dicté apparaît dans le champ, le message part à la fin de la phrase ; Manu répond | À tester |  |
| 21.21 | Micro sur Firefox | Bouton grisé avec l'info-bulle « La dictée vocale n'est pas disponible sur ce navigateur » | À tester |  |
| 21.22 | Activer le haut-parleur | Chaque réponse de Manu est lue à voix haute dans sa langue (voix du système) ; le choix est gardé ; rouvrir ou fermer Manu coupe la lecture | À tester |  |
| 21.23 | Site en français, écrire « Hello, how much does the programme cost? » | Manu répond en anglais ; écrire ensuite « Y en español, ¿cuánto cuesta? » : réponse en espagnol ; une réponse rapide cliquée reste dans la dernière langue détectée | À tester |  |
| 21.24 | Écrire en arabe, russe ou chinois | La langue est reconnue à l'écriture ; Manu répond dans cette langue | À tester |  |
| 21.25 | Changer la langue de l'interface pendant une conversation | Manu repasse dans la langue de l'interface jusqu'au prochain message écrit dans une autre langue | À tester |  |
| 21.26 | Back-office › Manu AI › Paramètres | Un champ « message d'accueil » par langue (dix) ; base de connaissances : réponses éditables dans les dix langues | À tester |  |
| 21.27 | À discuter | Voix et dictée sont celles du navigateur (lingala et swahili souvent absents des voix système) ; moteur vocal serveur prévu dans un lot ultérieur (Q9) | À discuter |  |

**Lot 7 · Un consultant, quand vous voulez**

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 21.28 | Cliquer « Cliquez ici » sur la carte du bas, sans être connecté | Fenêtre en bois « Que pouvons-nous faire pour vous ? » : nom, pays (liste), téléphone ou WhatsApp, e-mail, besoin, canal souhaité (WhatsApp, appel, e-mail), consentement ; aucun tarif | À tester |  |
| 21.29 | Envoyer vide | Erreurs : nom requis, téléphone ou e-mail requis, besoin trop court, consentement obligatoire | À tester |  |
| 21.30 | Envoyer une demande valide | Remerciement avec le prénom, numéro de demande « DC-2026-000X », mention « sous 24 h ouvrées par WhatsApp » ; petite pluie de cauris | À tester |  |
| 21.31 | Back-office › Messages | Nouveau fil « Demande de consultation » (étiquette terre), non assigné, avec le besoin, les coordonnées, le canal et la langue ; le responsable l'assigne comme les autres ; délai suivi | À tester |  |
| 21.32 | Connecté en fellow, ouvrir la carte | Formulaire pré-rempli (nom, e-mail, téléphone) et encart « Vous êtes connecté : réservez directement un créneau » vers la page Consultant | À tester |  |
| 21.33 | Journal d'audit (Équipe & rôles) | Ligne « Demande de consultation DC-2026-000X » | À tester |  |

**Lot 8 · Dix langues**

| # | Action | Attendu | Résultat | Remarque |
| --- | --- | --- | --- | --- |
| 21.34 | Sélecteur de langue | Dix entrées : Français, English, Deutsch, Español, Русский, Lingála, Kiswahili, Português, 中文, العربية ; drapeau devant chacune | À tester |  |
| 21.35 | Passer en arabe | Toute la page bascule de droite à gauche : menu, en-tête, cartes, formulaires, Manu (fenêtre en bas à gauche), carte consultant ; les chiffres et les sigles (KEC, OHADA, RCCM) restent lisibles | À tester |  |
| 21.36 | Parcours complet en arabe : accueil, salle d'attente, inscription, connexion fellow, dossier, coffre, paiements, messages | Aucun texte coupé, aucune clé brute, boutons alignés à droite | À tester |  |
| 21.37 | Passer en chinois puis en russe | Polices système correctes, tailles de boutons adaptées aux textes plus longs (russe) ou plus courts (chinois) | À tester |  |
| 21.38 | Espace équipe dans une des sept nouvelles langues | Menus et écrans internes en français (volontaire : l'équipe travaille en français) | À tester |  |
| 21.39 | `npm run build` | Le contrôle i18n passe (`✓` pour les dix langues) avant la compilation | À tester |  |
| 21.40 | À discuter | Les sept nouvelles traductions ont été rédigées par Seira sans relecture native (Q10) : prévoir une relecture par langue avant mise en ligne, en commençant par le lingala et le swahili | À discuter |  |
| 21.41 | Survoler « Accueil ▾ » puis descendre lentement vers « Le programme » et cliquer | Le menu reste ouvert pendant la descente (pont invisible + fermeture différée de 250 ms) ; depuis n'importe quelle page, le clic mène à la section voulue de l'accueil | À tester |  |
| 21.42 | Salle d'attente, observer 35 s | Le banc est vide à l'ouverture ; toutes les 5 s la porte s'ouvre et une personne entre et s'assoit, jusqu'à six ; parmi elles une femme en boubou, un homme blanc en veste, un homme chinois en tangzhuang, une femme aux tresses, un aîné aux cheveux gris | À tester |  |
| 21.43 | Petits titres en capitales (accueil, salle d'attente, programme, espace fellow…) | Un petit cauris doré remplace le tiret horizontal devant chaque petit titre, partout sur le site (y compris en arabe) | À tester |  |
| 21.44 | Accueil ou salle d'attente, attendre 1 à 2 min | Des cauris tombent par petits groupes (2 à 5 toutes les 5 à 10 s) et s'entassent en bas ; quand il y en a assez (40 sur bureau, 18 sur téléphone, ou 12 après 90 s), une rafale de poussière traverse l'écran de gauche à droite ou l'inverse : traînées de sable, voile ocre qui avance avec le vent, les cauris sont soulevés les uns après les autres du côté d'où vient le vent, roulent et sortent de l'écran ; puis la pluie reprend et le cycle recommence (au moins 20 s entre deux rafales) | À tester |  |
| 21.45 | Rafale en cours, changer de page | Le vent et la poussière s'arrêtent net, les cauris encore posés s'effacent | À tester |  |
| 21.46 | Réglage système « réduire les animations » | Ni pluie ambiante ni rafale | À tester |  |
| 21.47 | Téléphone (390 px) : parcourir accueil, salle d'attente, Kopen Mind, connexion, les six écrans de l'espace fellow, les huit écrans de l'équipe et Kia | Aucun défilement horizontal, aucun texte coupé ; sur la salle d'attente, horloge, ventilateur et lampe passent sous l'en-tête ; sur « Mon entreprise » les encarts tiennent dans la largeur ; dans les tableaux de l'équipe la date tient sur une ligne et le tableau défile de côté dans son cadre | À tester |  |
| 21.48 | Téléphone : barre d'onglets en bas (espace fellow, espace équipe) | Les onglets sont plus serrés ; quand il en reste à droite, un voile dégradé le signale et la barre défile au doigt | À tester |  |
| 21.49 | Téléphone : Manu | Avatar plus petit, posé juste au-dessus de la carte « Un consultant, quand vous voulez » ; la bulle « Akwaba ! » apparaît une fois puis se referme seule au bout de 9 s | À tester |  |
| 21.50 | Déplacer Manu : prendre l'avatar à la souris ou au doigt et le glisser ailleurs ; puis ouvrir et glisser la fenêtre par son en-tête | L'avatar suit le pointeur sans ouvrir la fenêtre ni faire défiler la page, reste dans l'écran, et peut passer au-dessus de l'en-tête du site ; la fenêtre s'ouvre près de lui (bureau et tablette) et se déplace par son en-tête ; la position est gardée après rechargement ; un double-clic sur l'en-tête la remet à sa place d'origine ; sur téléphone la fenêtre garde toute la largeur | À tester |  |
| 21.51 | Bureau (1360 px) et tablette (820 px) après ces corrections | Accueil, salle d'attente, espace fellow et espace équipe inchangés | À tester |  |

## 20. Questions à trancher avec la cliente

Ces choix sont implémentés avec une valeur provisoire ; chacun se change en un paramètre.

| # | Sujet | Valeur actuelle | Question à poser | Décision |
| --- | --- | --- | --- | --- |
| Q1 | Durée du programme SCALE 110 | 6 mois (le cahier des charges dit 3) | Quelle est la durée officielle ? |  |
| Q2 | Prix du programme | 300 000 FCFA par entreprise | Confirmé ? TVA incluse ? |  |
| Q3 | Échéancier | Deux tranches de 50 % : acompte à la sélection, solde avant la formalisation | Paiement unique ou en tranches ? Quel acompte ? Quand le solde ? |  |
| Q4 | Tarif consultant | 15 000 FCFA / heure dans la réservation fellow (minimum 30 min, créneaux de 30 à 120 min) ; plus aucun tarif sur la carte publique | Tarif réel ? Varie-t-il selon le consultant ? |  |
| Q5 | Annulation d'une consultation | Avoir intégral à plus de 24 h, 50 % retenus en deçà, remboursement total si KEC annule | Délai, pourcentage, avoir ou remboursement ? Et si le consultant est absent ? |  |
| Q6 | Rôles de l'équipe | Administrateur, responsable, chargé(e) de dossiers, consultant, lecture seule | Correspond à l'organisation ? Qui confirme les virements et certifie les comptes ? |  |
| Q7 | Délai de réponse humaine | 4 h ouvrées, horaires 8 h – 18 h | Jours et heures ouvrés de KEC ? |  |
| Q8 | Conservation des échanges Manu | 90 jours | Durée légale ou souhaitée ? |  |
| Q9 | Payeur différent du bénéficiaire | Pas de champ dédié dans cette version | Faut-il un champ « qui paie ? » et un reçu au nom du payeur ? |  |
| Q10 | Carte bancaire | Affichée « bientôt » | Quel prestataire (Stripe, Flutterwave, CinetPay) et quand ? |  |
| Q11 | Pays ouverts | Cameroun seul ; autres pays OHADA « bientôt » | Ordre d'ouverture ? |  |
| Q12 | Coordonnées bancaires, numéros MoMo et OM, logo | Fictifs | Les vraies valeurs et le logo officiel |  |
| Q13 | Formes juridiques et devis | EI, SARLU, SARL, SAS, SASU, SA, GIE avec frais indicatifs | Grille tarifaire réelle par forme et par ville ? |  |
| Q14 | Repères des 54 pays du globe | Rédigés par Seira, marqués « à valider » | La cliente valide ou corrige chaque fiche (`src/data/africaFacts.js`) |  |
| Q15 | Liens des sept réseaux sociaux | Vides (icônes « bientôt ») | Les adresses des comptes KEC (`socials` dans `app.config.js`) |  |
| Q16 | Proverbes et pays d'origine | 55 proverbes, attributions proposées | Garder, corriger ou retirer certaines attributions |  |
| Q17 | Relecture des sept nouvelles langues | Traductions faites sans locuteur natif | Qui relit quoi, et avant quelle date ? |  |
| Q18 | Délai de rappel d'une demande de consultation | 24 h ouvrées, fil assigné par le responsable | Délai réel ? Qui reçoit les demandes ? |  |
| Q19 | Comptes clients en libre-service | Non livré (lot 9) | Inscription libre ou comptes créés par KEC après sélection ? |  |

**Relevé des retours de la séance**

| Date | Page ou test | Retour de la cliente | Suite à donner | État |
| --- | --- | --- | --- | --- |
|  |  |  |  | À discuter |
|  |  |  |  | À discuter |
|  |  |  |  | À discuter |

/**
 * ─────────────────────────────────────────────────────────────
 *  Base de connaissances de Manu AI (version mock)
 * ─────────────────────────────────────────────────────────────
 * Respecte les garde-fous du cahier des charges (§7) :
 *  - jamais de conseil juridique individualisé ;
 *  - uniquement des informations générales et procédurales validées ;
 *  - escalade obligatoire : fiscal, social, pénal, litiges, conseil
 *    personnalisé, urgence ;
 *  - 3 incompréhensions consécutives -> transfert à un humain.
 *
 * En production, ce fichier est remplacé par un prompt + une base
 * documentaire versionnés côté serveur (administrables sans redéploiement).
 */

/** Mots-clés déclenchant une ESCALADE obligatoire (toutes langues) */
export const ESCALATION_RULES = [
  { reason: 'tax', keywords: ['impôt', 'impot', 'fiscal', 'tva', 'taxe', 'dgi', 'tax', 'vat', 'steuer', 'finanzamt', 'mehrwertsteuer', 'impuesto', 'iva', 'imposto', 'налог', 'ндс', 'kodi', 'mpako', '税', 'ضريب', 'ضرائب'] },
  { reason: 'social', keywords: ['cnps', 'licenci', 'salarié', 'contrat de travail', 'employee', 'dismiss', 'kündig', 'arbeitsvertrag', 'sozial'] },
  { reason: 'criminal', keywords: ['pénal', 'penal', 'plainte', 'police', 'prison', 'fraude', 'criminal', 'arrest', 'strafrecht', 'anzeige'] },
  { reason: 'litigation', keywords: ['litige', 'procès', 'proces', 'tribunal', 'avocat contre', 'poursuivre', 'lawsuit', 'sue ', 'court', 'dispute', 'klage', 'gericht', 'streit', 'juicio', 'demanda', 'processo', 'суд', 'иск', 'kesi', 'mahakama', 'likambo', '诉讼', '法院', 'محكمة', 'دعوى', 'نزاع'] },
  { reason: 'urgent', keywords: ['urgent', 'urgence', 'emergency', 'asap', 'dringend', 'notfall', 'urgente', 'срочно', 'haraka', 'noki', '紧急', 'عاجل', 'طارئ'] },
  { reason: 'personalAdvice', keywords: ['me conseillez', 'que dois-je', 'à ma place', 'pour mon cas', 'dans mon cas', 'should i', 'my case', 'advise me', 'was soll ich', 'in meinem fall', 'raten sie mir'] }
]

/** Intentions reconnues (mots-clés multilingues) */
export const INTENTS = [
  { id: 'greeting', keywords: ['bonjour', 'bonsoir', 'salut', 'hello', 'hi ', 'hey', 'good morning', 'hallo', 'guten tag', 'servus', 'mbolo', 'jambo', 'yo ', 'hola', 'buenos', 'olá', 'ola ', 'bom dia', 'привет', 'здравствуйте', 'hujambo', 'habari', 'mbote', '你好', '您好', 'مرحبا', 'السلام'] },
  { id: 'thanks', keywords: ['merci', 'thank', 'danke', 'akiba', 'asante', 'gracias', 'obrigad', 'спасибо', 'matondo', 'melesi', '谢谢', 'شكرا'] },
  { id: 'human', keywords: ['humain', 'conseiller', 'consultant', 'parler à', 'quelqu\'un', 'human', 'agent', 'person', 'berater', 'mensch', 'mitarbeiter', 'humano', 'asesor', 'consultor', 'человек', 'консультант', 'mshauri', 'mtu', 'moto', '真人', '顾问', 'مستشار', 'شخص', 'إنسان'] },
  { id: 'program', keywords: ['110', 'fellow', 'programme', 'program', 'scale', 'incub', 'cohort', 'sélection', 'selection', 'auswahl', 'certif', 'zertifi', 'programa', 'программа', 'programu', '项目', 'برنامج'] },
  { id: 'waitlist', keywords: ['liste d\'attente', 'attente', 'inscri', 'waitlist', 'waiting', 'sign up', 'register', 'warteliste', 'anmeld', 'salle', 'espera', 'inscrib', 'inscrev', 'ожидани', 'записаться', 'kusubiri', 'jiandikish', 'kozela', '候补', '等候', '报名', 'انتظار', 'تسجيل'] },
  { id: 'legalForms', keywords: ['sarl', 'sas', 'sasu', ' sa ', 'gie', 'forme juridique', 'statut', 'legal form', 'company type', 'rechtsform', 'gmbh', 'entreprise individuelle', 'ets', 'forma jurídica', 'forma juridica', 'юридическ', 'muundo', 'lolenge', '法律形式', 'شكل قانوني', 'الأشكال'] },
  { id: 'documents', keywords: ['document', 'pièce', 'piece', 'cni', 'carte d\'identité', 'plan de localisation', 'papier', 'id card', 'unterlagen', 'ausweis', 'dokument', 'documento', 'документ', 'nyaraka', 'kitambulisho', 'mikanda', '文件', '证件', 'وثائق', 'مستندات'] },
  { id: 'price', keywords: ['prix', 'coût', 'cout', 'combien', 'tarif', 'fcfa', 'price', 'cost', 'how much', 'fee', 'kosten', 'preis', 'wie viel', 'precio', 'cuánto', 'cuanto', 'preço', 'quanto', 'цена', 'сколько', 'стоит', 'bei ', 'gharama', 'ntalo', 'mbongo boni', '价格', '多少钱', '费用', 'سعر', 'تكلفة', 'كم'] },
  { id: 'payment', keywords: ['payer', 'paiement', 'momo', 'mobile money', 'orange money', ' om', 'virement', 'pay', 'payment', 'bank', 'zahl', 'überweis', 'pagar', 'pago', 'pagamento', 'оплат', 'платить', 'kulipa', 'malipo', 'kofuta', '付款', '支付', 'دفع', 'الدفع'] },
  { id: 'timeline', keywords: ['délai', 'delai', 'combien de temps', 'durée', 'quand', 'how long', 'when', 'timeline', 'wie lange', 'dauer', 'wann', 'plazo', 'cuándo', 'prazo', 'quando', 'срок', 'когда', 'muda gani', 'lini', 'ntango boni', '多久', '什么时候', 'مدة', 'متى'] },
  { id: 'diaspora', keywords: ['diaspora', 'à distance', 'distance', 'depuis la france', 'depuis l\'allemagne', 'abroad', 'remote', 'from europe', 'ausland', 'aus deutschland'] },
  { id: 'vault', keywords: ['coffre', 'vault', 'tresor', 'tresor', 'sécurité', 'securite', 'security', 'sicher', 'tresor'] },
  { id: 'whatIsKec', keywords: ['kec', 'qui êtes', 'qui etes', 'c\'est quoi', 'who are you', 'what is', 'wer seid', 'was ist'] },
  { id: 'country', keywords: ['pays', 'ville', 'cameroun', 'douala', 'yaoundé', 'ohada', 'country', 'city', 'land', 'stadt', 'kamerun'] },
  { id: 'kopen', keywords: ['suggestion', 'idée', 'amélior', 'feedback', 'idea', 'improve', 'vorschlag', 'verbesser'] }
]

/**
 * Réponses par langue. {name} est remplacé par le prénom si connu.
 * `qr` = réponses rapides proposées, `route` = page suggérée.
 */
export const RESPONSES = {
  fr: {
    welcome: { text: 'Hello, et bienvenue à K-Enterprise Counsel {name} 🌍 Je suis Manu, la réceptionniste de KEC. Comment puis-je vous aider aujourd\'hui ?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Hello {name}, et bienvenue à K-Enterprise Counsel ☀️ Je suis Manu, la réceptionniste de KEC. Dites-moi ce qui vous amène, on va avancer ensemble.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Bonjour à vous ! Ça me fait plaisir. Créer, formaliser, développer votre entreprise : par quoi voulez-vous commencer ?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'C\'est moi qui vous remercie. On est ensemble ! Je reste juste là si vous avez besoin.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) est la porte d\'entrée digitale et juridique de l\'entrepreneur africain : on vous aide à créer, formaliser puis développer votre entreprise au Cameroun, avec une trajectoire vers l\'espace OHADA. Nous ne promettons pas une création instantanée, mais de la simplicité, de la transparence et un vrai accompagnement humain.', qr: ['program', 'waitlist'] },
    program: { text: 'Le programme pilote accueille 110 fellows pendant 6 mois : diagnostic, formation, structuration juridique, création, documents finaux et suivi. À la fin, votre compte entreprise est certifié KEC, et c\'est visible sur la plateforme. La sélection se fait parmi les inscrits de la liste d\'attente.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Rejoindre la salle d\'attente' } },
    waitlist: { text: 'Pour faire partie des 110, entrez dans notre salle d\'attente virtuelle : un formulaire de 2 minutes, un ticket numéroté, et le café est offert ☕. L\'équipe étudie chaque profil avant de choisir la cohorte.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Entrer dans la salle d\'attente' } },
    legalForms: { text: 'En général, dans l\'espace OHADA : l\'Établissement individuel est simple mais vous engage personnellement ; la SARL (1 à plusieurs associés) est la forme la plus courante pour les PME ; la SAS offre plus de souplesse dans les statuts ; la SA s\'adresse aux projets plus importants. Ce sont des informations générales : pour savoir laquelle convient à VOTRE projet, un consultant KEC vous guidera.', qr: ['human', 'price'] },
    documents: { text: 'Les pièces habituelles : CNI (ou passeport) de chaque associé/gérant, plan de localisation du siège, photos d\'identité, et selon le cas un extrait de casier judiciaire et un contrat de bail. Vous pouvez simplement les photographier avec votre téléphone : on contrôle la lisibilité à l\'envoi.', qr: ['vault', 'timeline'] },
    price: { text: 'Le programme SCALE 110 est proposé à 300 000 FCFA par entreprise. Pour une création hors programme, un devis total et détaillé vous est toujours affiché AVANT de demander des données sensibles. Et pour parler à un consultant, c\'est quand vous voulez : la carte « Un consultant, quand vous voulez » en bas de l\'écran.', qr: ['payment', 'human'] },
    payment: { text: 'Vous pouvez payer par MTN Mobile Money, Orange Money ou virement bancaire. Pour MoMo/OM, vous recevez une demande de confirmation sur votre téléphone, puis un reçu immédiatement. La diaspora peut aussi payer pour un proche (payeur ≠ bénéficiaire).', qr: ['price', 'diaspora'] },
    timeline: { text: 'Le délai dépend de la forme juridique et des administrations. Chaque dossier affiche des dates prévisionnelles et un interlocuteur nommé, et nous publions notre délai moyen réel. Pas de promesse magique, mais une transparence totale.', qr: ['documents', 'human'] },
    diaspora: { text: 'Vous êtes loin du pays ? C\'est prévu pour vous : création à distance, suivi en ligne, interlocuteur humain dédié, documents dans votre coffre-fort, et possibilité de créer pour un proche resté au pays.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Votre coffre-fort juridique garde tous vos documents (statuts, RCCM, pièces…) chiffrés et accessibles à tout moment. À la fin des 6 mois, votre compte reçoit le badge certifié.', qr: ['documents', 'program'] },
    country: { text: 'Nous lançons au Cameroun (Douala, Yaoundé, Edéa et les 10 régions), avec une trajectoire vers les autres pays OHADA. Vous choisissez le pays et la ville de création directement dans votre dossier.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'Une idée pour qu\'on s\'améliore ? Déposez-la dans Kopen Mind, notre boîte à suggestions. Chaque message est lu par l\'équipe.', qr: [] },
    human: { text: 'Bien sûr. Je transmets votre demande à un membre de l\'équipe KEC, réponse sous 4 heures ouvrées. Vous pouvez aussi réserver directement un consultant.', qr: [], route: { name: 'fellow-consultant', label: 'Réserver un consultant' } },
    escalate: { text: 'Cette question mérite l\'avis d\'un professionnel de chez nous, je ne veux pas vous donner une réponse approximative. Je viens de transmettre votre demande à l\'équipe : un conseiller vous recontacte sous 4 heures ouvrées. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Pardon, je n\'ai pas bien saisi. Vous pouvez reformuler, ou choisir un sujet ci-dessous ?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Excusez-moi, je n\'ai toujours pas compris. Essayez avec d\'autres mots, je suis toute ouïe.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Je préfère vous passer quelqu\'un de l\'équipe pour ne pas vous faire perdre votre temps. Un humain reprend la conversation et vous répond sous 4 heures ouvrées.', qr: [] },
    labels: { program: 'Le programme 110', waitlist: 'Liste d\'attente', legalForms: 'Formes juridiques', documents: 'Pièces à fournir', price: 'Tarifs', payment: 'Paiement', timeline: 'Délais', diaspora: 'Je suis de la diaspora', vault: 'Coffre-fort', human: 'Parler à un humain' }
  },

  en: {
    welcome: { text: 'Hello and welcome to K-Enterprise Counsel {name} 🌍 I\'m Manu, KEC\'s receptionist. How can I help you today?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Hello {name}, welcome to K-Enterprise Counsel ☀️ I\'m Manu, KEC\'s receptionist. Tell me what brings you here and we\'ll move forward together.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Hello to you! Lovely to meet you. Create, formalise, grow your business: where would you like to start?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Thank YOU. We\'re in this together! I\'m right here if you need me.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) is the digital and legal gateway for African entrepreneurs: we help you create, formalise and grow your business in Cameroon, with a path into the OHADA area. We don\'t promise instant incorporation, we promise simplicity, transparency and real human support.', qr: ['program', 'waitlist'] },
    program: { text: 'The pilot programme welcomes 110 fellows for 6 months: diagnosis, training, legal structuring, incorporation, final documents and follow-up. At the end, your company account becomes KEC-certified, visibly on the platform. Fellows are selected from the waiting list.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Join the waiting room' } },
    waitlist: { text: 'To be one of the 110, step into our virtual waiting room: a 2-minute form, a numbered ticket, and the coffee is on us ☕. The team reviews every profile before choosing the cohort.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Enter the waiting room' } },
    legalForms: { text: 'Generally, in the OHADA area: a sole proprietorship is simple but personally binding; the SARL (LLC) is the most common for SMEs; the SAS gives more flexibility in its articles; the SA suits larger projects. This is general information, to know which suits YOUR project, a KEC consultant will guide you.', qr: ['human', 'price'] },
    documents: { text: 'Usual documents: ID card (or passport) of each partner/manager, a location plan of the head office, ID photos, and depending on the case a criminal record extract and a lease. Just photograph them with your phone, we check readability on upload.', qr: ['vault', 'timeline'] },
    price: { text: 'The SCALE 110 programme costs 300,000 FCFA per company. Outside the programme, a full, detailed quote is always shown BEFORE we ask for sensitive data. To talk with a consultant, whenever you like: use the "A consultant, whenever you want" card at the bottom of the screen.', qr: ['payment', 'human'] },
    payment: { text: 'You can pay with MTN Mobile Money, Orange Money or bank transfer. With MoMo/OM you confirm on your phone and receive a receipt instantly. Diaspora members can also pay on behalf of a relative.', qr: ['price', 'diaspora'] },
    timeline: { text: 'Timing depends on the legal form and the administrations. Every file shows forecast dates and a named contact, and we publish our real average lead time. No magic promises, just full transparency.', qr: ['documents', 'human'] },
    diaspora: { text: 'Far from home? It\'s built for you: remote incorporation, online tracking, a dedicated human contact, documents in your vault, and the option to create a company for a relative back home.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Your legal vault keeps all your documents (articles, RCCM, IDs…) encrypted and available anytime. After the 6 months, your account receives the certified badge.', qr: ['documents', 'program'] },
    country: { text: 'We\'re launching in Cameroon (Douala, Yaoundé, Edéa and all 10 regions), heading next to other OHADA countries. You pick the country and city directly in your file.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'An idea to help us improve? Drop it in Kopen Mind, our suggestion box. Every message is read by the team.', qr: [] },
    human: { text: 'Of course. I\'m passing your request to a KEC team member, reply within 4 business hours. You can also book a consultant directly.', qr: [], route: { name: 'fellow-consultant', label: 'Book a consultant' } },
    escalate: { text: 'This question deserves a professional\'s view, I don\'t want to give you an approximate answer. I\'ve just forwarded your request to the team: an advisor will get back to you within 4 business hours. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Sorry, I didn\'t quite catch that. Could you rephrase, or pick a topic below?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Forgive me, I still didn\'t understand. Try other words, I\'m all ears.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'I\'d rather hand you over to someone from the team so you don\'t lose time. A human will take over and reply within 4 business hours.', qr: [] },
    labels: { program: 'The 110 programme', waitlist: 'Waiting list', legalForms: 'Legal forms', documents: 'Required documents', price: 'Pricing', payment: 'Payment', timeline: 'Timeline', diaspora: 'I\'m in the diaspora', vault: 'Vault', human: 'Talk to a human' }
  },

  de: {
    welcome: { text: 'Hallo und willkommen bei K-Enterprise Counsel {name} 🌍 Ich bin Manu, die Empfangsdame von KEC. Wie kann ich Ihnen heute helfen?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Hallo {name}, willkommen bei K-Enterprise Counsel ☀️ Ich bin Manu, die Empfangsdame von KEC. Erzählen Sie mir, was Sie herführt, wir gehen es gemeinsam an.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Hallo! Schön, Sie kennenzulernen. Gründen, formalisieren, wachsen: Womit möchten Sie beginnen?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Ich danke IHNEN. Wir sind ein Team! Ich bin gleich hier, wenn Sie mich brauchen.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) ist das digitale und juristische Tor für afrikanische Unternehmer: Wir helfen Ihnen, Ihr Unternehmen in Kamerun zu gründen, zu formalisieren und auszubauen, mit Perspektive auf den OHADA-Raum. Keine Sofortgründung, sondern Einfachheit, Transparenz und echte menschliche Begleitung.', qr: ['program', 'waitlist'] },
    program: { text: 'Das Pilotprogramm nimmt 110 Fellows für 6 Monate auf: Diagnose, Schulung, rechtliche Strukturierung, Gründung, finale Dokumente und Begleitung. Am Ende wird Ihr Unternehmenskonto KEC-zertifiziert, sichtbar auf der Plattform. Die Auswahl erfolgt aus der Warteliste.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Zum Warteraum' } },
    waitlist: { text: 'Um einer der 110 zu werden, betreten Sie unseren virtuellen Warteraum: ein 2-Minuten-Formular, ein nummeriertes Ticket, und der Kaffee geht auf uns ☕. Das Team prüft jedes Profil vor der Auswahl.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Warteraum betreten' } },
    legalForms: { text: 'Allgemein im OHADA-Raum: Das Einzelunternehmen ist einfach, haftet aber persönlich; die SARL (ähnlich GmbH) ist für KMU am häufigsten; die SAS bietet mehr Satzungsfreiheit; die SA eignet sich für größere Projekte. Das sind allgemeine Informationen, welche Form zu IHREM Projekt passt, klärt ein KEC-Berater mit Ihnen.', qr: ['human', 'price'] },
    documents: { text: 'Übliche Unterlagen: Personalausweis (oder Pass) jedes Gesellschafters/Geschäftsführers, Lageplan des Firmensitzes, Passfotos und je nach Fall Führungszeugnis und Mietvertrag. Einfach mit dem Handy fotografieren, wir prüfen die Lesbarkeit beim Hochladen.', qr: ['vault', 'timeline'] },
    price: { text: 'Das Programm SCALE 110 kostet 300.000 FCFA pro Unternehmen. Außerhalb des Programms sehen Sie immer ein vollständiges Angebot, BEVOR wir sensible Daten anfragen. Für ein Gespräch mit einem Berater nutzen Sie jederzeit die Karte „Ein Berater, wann Sie wollen“ unten auf dem Bildschirm.', qr: ['payment', 'human'] },
    payment: { text: 'Sie zahlen per MTN Mobile Money, Orange Money oder Banküberweisung. Bei MoMo/OM bestätigen Sie auf dem Handy und erhalten sofort eine Quittung. Die Diaspora kann auch für Angehörige zahlen.', qr: ['price', 'diaspora'] },
    timeline: { text: 'Die Dauer hängt von der Rechtsform und den Behörden ab. Jede Akte zeigt voraussichtliche Termine und einen festen Ansprechpartner, und wir veröffentlichen unsere tatsächliche Durchschnittsdauer.', qr: ['documents', 'human'] },
    diaspora: { text: 'Weit weg von zu Hause? Genau dafür sind wir da: Gründung aus der Ferne, Online-Verfolgung, persönlicher Ansprechpartner, Dokumente im Tresor und die Möglichkeit, für Angehörige vor Ort zu gründen.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Ihr juristischer Tresor verwahrt alle Dokumente (Satzung, RCCM, Ausweise…) verschlüsselt und jederzeit abrufbar. Nach 6 Monaten erhält Ihr Konto das Zertifizierungs-Abzeichen.', qr: ['documents', 'program'] },
    country: { text: 'Wir starten in Kamerun (Douala, Yaoundé, Edéa und alle 10 Regionen), danach folgen weitere OHADA-Länder. Land und Stadt wählen Sie direkt in Ihrer Akte.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'Eine Idee, wie wir besser werden? Hinterlassen Sie sie in Kopen Mind, unserem Ideenbriefkasten. Jede Nachricht wird gelesen.', qr: [] },
    human: { text: 'Natürlich. Ich leite Ihre Anfrage an das KEC-Team weiter, Antwort innerhalb von 4 Geschäftsstunden. Sie können auch direkt einen Berater buchen.', qr: [], route: { name: 'fellow-consultant', label: 'Berater buchen' } },
    escalate: { text: 'Diese Frage verdient die Einschätzung einer Fachperson, ich möchte Ihnen keine ungenaue Antwort geben. Ich habe Ihre Anfrage an das Team weitergeleitet: Ein Berater meldet sich innerhalb von 4 Geschäftsstunden. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Entschuldigung, das habe ich nicht ganz verstanden. Können Sie es anders formulieren oder ein Thema wählen?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Verzeihung, ich habe es immer noch nicht verstanden. Versuchen Sie andere Worte, ich höre zu.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Ich übergebe Sie lieber an jemanden aus dem Team, damit Sie keine Zeit verlieren. Ein Mensch übernimmt und antwortet innerhalb von 4 Geschäftsstunden.', qr: [] },
    labels: { program: 'Das 110-Programm', waitlist: 'Warteliste', legalForms: 'Rechtsformen', documents: 'Unterlagen', price: 'Preise', payment: 'Zahlung', timeline: 'Dauer', diaspora: 'Ich lebe in der Diaspora', vault: 'Tresor', human: 'Mit einem Menschen sprechen' }
  },
  /* ── Les sept autres langues de la plateforme ───────────────────────────
   * Textes rédigés par KEC à partir du français : relecture par un locuteur
   * natif à prévoir avant mise en ligne (voir cahier de test, lot 8).
   * Un intitulé manquant retombe sur l'anglais puis le français (manuEngine). */
  es: {
    welcome: { text: 'Hola y bienvenido a K-Enterprise Counsel {name} 🌍 Soy Manu, la recepcionista de KEC. ¿En qué puedo ayudarle hoy?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Hola {name}, bienvenido a K-Enterprise Counsel ☀️ Soy Manu, la recepcionista de KEC. Cuénteme qué le trae por aquí y avanzamos juntos.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: '¡Hola! Encantada. Crear, formalizar, desarrollar su empresa: ¿por dónde quiere empezar?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Gracias a usted. ¡Estamos juntos en esto! Aquí me quedo por si me necesita.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) es la puerta de entrada digital y jurídica del emprendedor africano: le ayudamos a crear, formalizar y desarrollar su empresa en Camerún, con una trayectoria hacia el espacio OHADA. No prometemos una creación instantánea, sino sencillez, transparencia y un acompañamiento humano real.', qr: ['program', 'waitlist'] },
    program: { text: 'El programa piloto acoge a 110 fellows durante 6 meses: diagnóstico, formación, estructuración jurídica, creación, documentos finales y seguimiento. Al final, su cuenta de empresa queda certificada KEC, visible en la plataforma. La selección se hace entre los inscritos en la lista de espera.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Entrar en la sala de espera' } },
    waitlist: { text: 'Para formar parte de los 110, entre en nuestra sala de espera virtual: un formulario de 2 minutos, un ticket numerado y el café corre por nuestra cuenta ☕. El equipo estudia cada perfil antes de elegir la promoción.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Entrar en la sala de espera' } },
    legalForms: { text: 'En general, en el espacio OHADA: la empresa individual es sencilla pero le compromete personalmente; la SARL (varios socios) es la forma más común para pymes; la SAS ofrece más flexibilidad en los estatutos; la SA se dirige a proyectos mayores. Es información general: para saber cuál conviene a SU proyecto, un consultor KEC le guiará.', qr: ['human', 'price'] },
    documents: { text: 'Documentos habituales: documento de identidad (o pasaporte) de cada socio o gerente, plano de localización de la sede, fotos de identidad y, según el caso, certificado de antecedentes penales y contrato de arrendamiento. Puede fotografiarlos con el teléfono: comprobamos la legibilidad al enviarlos.', qr: ['vault', 'timeline'] },
    price: { text: 'El programa SCALE 110 cuesta 300 000 FCFA por empresa. Fuera del programa, siempre se muestra un presupuesto completo y detallado ANTES de pedir datos sensibles. Y para hablar con un consultor, cuando quiera: la tarjeta «Un consultor, cuando usted quiera» al pie de la pantalla.', qr: ['payment', 'human'] },
    payment: { text: 'Puede pagar con MTN Mobile Money, Orange Money o transferencia bancaria. Con MoMo/OM confirma en su teléfono y recibe el recibo al instante. La diáspora también puede pagar por un familiar.', qr: ['price', 'diaspora'] },
    timeline: { text: 'El plazo depende de la forma jurídica y de las administraciones. Cada expediente muestra fechas previstas y un interlocutor con nombre, y publicamos nuestro plazo medio real. Sin promesas mágicas, con transparencia total.', qr: ['documents', 'human'] },
    diaspora: { text: '¿Está lejos del país? Está pensado para usted: creación a distancia, seguimiento en línea, interlocutor humano dedicado, documentos en su caja fuerte y la posibilidad de crear para un familiar que vive en el país.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Su caja fuerte jurídica guarda todos sus documentos (estatutos, RCCM, identificaciones…) cifrados y accesibles en todo momento. Al cabo de los 6 meses, su cuenta recibe la insignia de certificación.', qr: ['documents', 'program'] },
    country: { text: 'Empezamos en Camerún (Douala, Yaundé, Edéa y las 10 regiones), con una trayectoria hacia los demás países OHADA. Elige el país y la ciudad de creación directamente en su expediente.', qr: ['documents', 'waitlist'] },
    kopen: { text: '¿Una idea para mejorar? Déjela en Kopen Mind, nuestro buzón de sugerencias. El equipo lee cada mensaje.', qr: [] },
    human: { text: 'Por supuesto. Transmito su solicitud a un miembro del equipo KEC, respuesta en 4 horas laborables. También puede reservar directamente un consultor.', qr: [], route: { name: 'fellow-consultant', label: 'Reservar un consultor' } },
    escalate: { text: 'Esta pregunta merece la opinión de un profesional de nuestro equipo, no quiero darle una respuesta aproximada. Acabo de transmitir su solicitud: un asesor le contactará en 4 horas laborables. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Perdón, no lo he entendido bien. ¿Puede reformular o elegir un tema aquí abajo?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Disculpe, sigo sin entender. Pruebe con otras palabras, le escucho.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Prefiero pasarle con alguien del equipo para no hacerle perder tiempo. Una persona retoma la conversación y le responde en 4 horas laborables.', qr: [] },
    labels: { program: 'El programa 110', waitlist: 'Lista de espera', legalForms: 'Formas jurídicas', documents: 'Documentos', price: 'Tarifas', payment: 'Pago', timeline: 'Plazos', diaspora: 'Soy de la diáspora', vault: 'Caja fuerte', human: 'Hablar con una persona' }
  },

  pt: {
    welcome: { text: 'Olá e bem-vindo à K-Enterprise Counsel {name} 🌍 Sou a Manu, a rececionista da KEC. Como posso ajudar hoje?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Olá {name}, bem-vindo à K-Enterprise Counsel ☀️ Sou a Manu, a rececionista da KEC. Diga-me o que o traz aqui e avançamos juntos.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Olá! Muito prazer. Criar, formalizar, desenvolver a sua empresa: por onde quer começar?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Eu é que agradeço. Estamos juntos! Fico por aqui se precisar.', qr: [] },
    whatIsKec: { text: 'A KEC (K-Enterprise Counsel) é a porta de entrada digital e jurídica do empreendedor africano: ajudamos a criar, formalizar e desenvolver a sua empresa nos Camarões, com uma trajetória para o espaço OHADA. Não prometemos uma criação instantânea, mas simplicidade, transparência e um acompanhamento humano a sério.', qr: ['program', 'waitlist'] },
    program: { text: 'O programa-piloto acolhe 110 fellows durante 6 meses: diagnóstico, formação, estruturação jurídica, criação, documentos finais e acompanhamento. No fim, a sua conta de empresa fica certificada KEC, visível na plataforma. A seleção é feita entre os inscritos na lista de espera.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Entrar na sala de espera' } },
    waitlist: { text: 'Para fazer parte dos 110, entre na nossa sala de espera virtual: um formulário de 2 minutos, um bilhete numerado e o café é por nossa conta ☕. A equipa analisa cada perfil antes de escolher a turma.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Entrar na sala de espera' } },
    legalForms: { text: 'Em geral, no espaço OHADA: o estabelecimento individual é simples mas compromete-o pessoalmente; a SARL (um ou vários sócios) é a forma mais comum para PME; a SAS dá mais flexibilidade nos estatutos; a SA destina-se a projetos maiores. É informação geral: para saber qual convém ao SEU projeto, um consultor KEC vai orientá-lo.', qr: ['human', 'price'] },
    documents: { text: 'Documentos habituais: documento de identidade (ou passaporte) de cada sócio ou gerente, planta de localização da sede, fotografias tipo passe e, conforme o caso, registo criminal e contrato de arrendamento. Pode simplesmente fotografá-los com o telemóvel: verificamos a legibilidade no envio.', qr: ['vault', 'timeline'] },
    price: { text: 'O programa SCALE 110 custa 300 000 FCFA por empresa. Fora do programa, um orçamento completo e detalhado é sempre mostrado ANTES de pedirmos dados sensíveis. E para falar com um consultor, quando quiser: o cartão «Um consultor, quando quiser» no fundo do ecrã.', qr: ['payment', 'human'] },
    payment: { text: 'Pode pagar por MTN Mobile Money, Orange Money ou transferência bancária. Com MoMo/OM confirma no telemóvel e recebe o recibo de imediato. A diáspora também pode pagar por um familiar.', qr: ['price', 'diaspora'] },
    timeline: { text: 'O prazo depende da forma jurídica e das administrações. Cada processo mostra datas previstas e um interlocutor com nome, e publicamos o nosso prazo médio real. Sem promessas mágicas, com transparência total.', qr: ['documents', 'human'] },
    diaspora: { text: 'Está longe do país? Foi pensado para si: criação à distância, acompanhamento online, interlocutor humano dedicado, documentos no seu cofre e a possibilidade de criar para um familiar que ficou no país.', qr: ['payment', 'waitlist'] },
    vault: { text: 'O seu cofre jurídico guarda todos os documentos (estatutos, RCCM, identificações…) cifrados e acessíveis a qualquer momento. No fim dos 6 meses, a sua conta recebe o selo de certificação.', qr: ['documents', 'program'] },
    country: { text: 'Arrancamos nos Camarões (Douala, Yaoundé, Edéa e as 10 regiões), com uma trajetória para os outros países OHADA. Escolhe o país e a cidade de criação diretamente no seu processo.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'Uma ideia para melhorarmos? Deixe-a na Kopen Mind, a nossa caixa de sugestões. A equipa lê todas as mensagens.', qr: [] },
    human: { text: 'Com certeza. Transmito o seu pedido a um membro da equipa KEC, resposta em 4 horas úteis. Também pode reservar diretamente um consultor.', qr: [], route: { name: 'fellow-consultant', label: 'Reservar um consultor' } },
    escalate: { text: 'Esta pergunta merece a opinião de um profissional da nossa equipa, não quero dar-lhe uma resposta aproximada. Acabei de transmitir o seu pedido: um consultor contacta-o em 4 horas úteis. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Desculpe, não percebi bem. Pode reformular ou escolher um tema aqui em baixo?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Peço desculpa, continuo sem perceber. Tente com outras palavras, estou a ouvir.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Prefiro passá-lo a alguém da equipa para não lhe fazer perder tempo. Uma pessoa retoma a conversa e responde em 4 horas úteis.', qr: [] },
    labels: { program: 'O programa 110', waitlist: 'Lista de espera', legalForms: 'Formas jurídicas', documents: 'Documentos', price: 'Preços', payment: 'Pagamento', timeline: 'Prazos', diaspora: 'Sou da diáspora', vault: 'Cofre', human: 'Falar com uma pessoa' }
  },

  ru: {
    welcome: { text: 'Здравствуйте и добро пожаловать в K-Enterprise Counsel {name} 🌍 Я Ману, администратор KEC. Чем могу помочь сегодня?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Здравствуйте {name}, добро пожаловать в K-Enterprise Counsel ☀️ Я Ману, администратор KEC. Расскажите, что вас привело, и мы двинемся дальше вместе.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Здравствуйте! Очень приятно. Создать, оформить, развить ваш бизнес: с чего начнём?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Это я вас благодарю. Мы вместе! Я рядом, если понадоблюсь.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) — цифровые и юридические ворота для африканского предпринимателя: мы помогаем создать, оформить и развить бизнес в Камеруне с перспективой выхода на пространство OHADA. Мы не обещаем мгновенной регистрации, но обещаем простоту, прозрачность и настоящее человеческое сопровождение.', qr: ['program', 'waitlist'] },
    program: { text: 'Пилотная программа принимает 110 участников на 6 месяцев: диагностика, обучение, юридическое структурирование, регистрация, итоговые документы и сопровождение. В конце ваш аккаунт компании получает сертификацию KEC, видимую на платформе. Отбор проходит среди записавшихся в лист ожидания.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Войти в зал ожидания' } },
    waitlist: { text: 'Чтобы стать одним из 110, войдите в наш виртуальный зал ожидания: анкета на 2 минуты, номерной талон, и кофе за наш счёт ☕. Команда изучает каждый профиль перед формированием набора.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Войти в зал ожидания' } },
    legalForms: { text: 'В целом в пространстве OHADA: индивидуальное предприятие простое, но вы отвечаете лично; SARL (один или несколько участников) — самая распространённая форма для малого бизнеса; SAS даёт больше свободы в уставе; SA подходит крупным проектам. Это общая информация: какая форма подходит ИМЕННО вашему проекту, подскажет консультант KEC.', qr: ['human', 'price'] },
    documents: { text: 'Обычные документы: удостоверение личности (или паспорт) каждого участника и руководителя, план расположения офиса, фото на документы и, в зависимости от случая, справка о несудимости и договор аренды. Достаточно сфотографировать их телефоном: мы проверяем читаемость при загрузке.', qr: ['vault', 'timeline'] },
    price: { text: 'Программа SCALE 110 стоит 300 000 франков КФА за компанию. Вне программы полная детальная смета всегда показывается ДО запроса чувствительных данных. А поговорить с консультантом можно когда угодно: карточка «Консультант, когда вы захотите» внизу экрана.', qr: ['payment', 'human'] },
    payment: { text: 'Оплата через MTN Mobile Money, Orange Money или банковским переводом. С MoMo/OM вы подтверждаете на телефоне и сразу получаете квитанцию. Диаспора может также оплатить за родственника.', qr: ['price', 'diaspora'] },
    timeline: { text: 'Срок зависит от юридической формы и администраций. В каждом деле указаны ориентировочные даты и ответственный сотрудник, и мы публикуем наш реальный средний срок. Без волшебных обещаний, с полной прозрачностью.', qr: ['documents', 'human'] },
    diaspora: { text: 'Вы далеко от страны? Это создано для вас: регистрация на расстоянии, онлайн-отслеживание, персональный сотрудник, документы в вашем сейфе и возможность создать компанию для родственника на родине.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Ваш юридический сейф хранит все документы (устав, RCCM, удостоверения…) в зашифрованном виде и доступными в любой момент. По окончании 6 месяцев аккаунт получает значок сертификации.', qr: ['documents', 'program'] },
    country: { text: 'Мы начинаем в Камеруне (Дуала, Яунде, Эдеа и все 10 регионов), далее — другие страны OHADA. Страну и город регистрации вы выбираете прямо в своём деле.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'Есть идея, как нам стать лучше? Оставьте её в Kopen Mind, нашем ящике предложений. Команда читает каждое сообщение.', qr: [] },
    human: { text: 'Конечно. Передаю ваш запрос сотруднику команды KEC, ответ в течение 4 рабочих часов. Вы также можете напрямую записаться к консультанту.', qr: [], route: { name: 'fellow-consultant', label: 'Записаться к консультанту' } },
    escalate: { text: 'Этот вопрос заслуживает мнения нашего специалиста, я не хочу давать приблизительный ответ. Я только что передала ваш запрос команде: консультант свяжется с вами в течение 4 рабочих часов. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Простите, я не совсем поняла. Переформулируете или выберете тему ниже?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Извините, я всё ещё не поняла. Попробуйте другими словами, я слушаю.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Лучше я передам вас коллеге из команды, чтобы вы не теряли время. Человек продолжит разговор и ответит в течение 4 рабочих часов.', qr: [] },
    labels: { program: 'Программа 110', waitlist: 'Лист ожидания', legalForms: 'Юридические формы', documents: 'Документы', price: 'Цены', payment: 'Оплата', timeline: 'Сроки', diaspora: 'Я из диаспоры', vault: 'Сейф', human: 'Поговорить с человеком' }
  },

  sw: {
    welcome: { text: 'Hujambo na karibu K-Enterprise Counsel {name} 🌍 Mimi ni Manu, mpokeaji wageni wa KEC. Naweza kukusaidia vipi leo?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Hujambo {name}, karibu K-Enterprise Counsel ☀️ Mimi ni Manu, mpokeaji wageni wa KEC. Niambie kinachokuleta, tutasonga mbele pamoja.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Hujambo! Nimefurahi kukutana nawe. Kuanzisha, kurasimisha, kukuza biashara yako: unataka kuanzia wapi?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Asante kwako. Tuko pamoja! Niko hapa ukinihitaji.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) ni lango la kidijitali na la kisheria la mjasiriamali wa Afrika: tunakusaidia kuanzisha, kurasimisha na kukuza biashara yako nchini Kamerun, kwa mwelekeo wa eneo la OHADA. Hatuahidi usajili wa papo hapo, bali urahisi, uwazi na usaidizi wa kweli wa kibinadamu.', qr: ['program', 'waitlist'] },
    program: { text: 'Programu ya majaribio inapokea fellows 110 kwa miezi 6: uchunguzi, mafunzo, muundo wa kisheria, usajili, nyaraka za mwisho na ufuatiliaji. Mwishoni, akaunti ya kampuni yako inathibitishwa na KEC, na inaonekana kwenye jukwaa. Uteuzi unafanywa kati ya waliojiandikisha kwenye orodha ya kusubiri.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Ingia chumba cha kusubiri' } },
    waitlist: { text: 'Ili kuwa mmoja wa 110, ingia kwenye chumba chetu cha kusubiri cha mtandaoni: fomu ya dakika 2, tiketi yenye nambari, na kahawa ni zawadi yetu ☕. Timu huchunguza kila wasifu kabla ya kuchagua kundi.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Ingia chumba cha kusubiri' } },
    legalForms: { text: 'Kwa ujumla, katika eneo la OHADA: biashara ya mtu binafsi ni rahisi lakini inakufunga binafsi; SARL (mshirika mmoja au zaidi) ndiyo muundo wa kawaida kwa biashara ndogo na za kati; SAS inatoa unyumbufu zaidi katika katiba; SA inafaa miradi mikubwa. Hii ni taarifa ya jumla: kujua ipi inafaa mradi WAKO, mshauri wa KEC atakuongoza.', qr: ['human', 'price'] },
    documents: { text: 'Nyaraka za kawaida: kitambulisho (au pasipoti) cha kila mshirika au meneja, ramani ya eneo la makao makuu, picha za pasipoti, na kulingana na hali, cheti cha tabia njema na mkataba wa kukodisha. Unaweza kuzipiga picha kwa simu yako: tunakagua usomaji wakati wa kupakia.', qr: ['vault', 'timeline'] },
    price: { text: 'Programu ya SCALE 110 inagharimu FCFA 300,000 kwa kila kampuni. Nje ya programu, makadirio kamili na ya kina huonyeshwa daima KABLA ya kuomba data nyeti. Na kuzungumza na mshauri, wakati wowote unaotaka: kadi «Mshauri, wakati unaotaka» chini ya skrini.', qr: ['payment', 'human'] },
    payment: { text: 'Unaweza kulipa kwa MTN Mobile Money, Orange Money au uhamisho wa benki. Kwa MoMo/OM unathibitisha kwenye simu yako na unapokea risiti mara moja. Diaspora pia inaweza kulipia ndugu.', qr: ['price', 'diaspora'] },
    timeline: { text: 'Muda unategemea muundo wa kisheria na ofisi za serikali. Kila faili linaonyesha tarehe za makadirio na mhusika aliyetajwa, na tunachapisha muda wetu halisi wa wastani. Hakuna ahadi za kichawi, bali uwazi kamili.', qr: ['documents', 'human'] },
    diaspora: { text: 'Uko mbali na nyumbani? Imeundwa kwa ajili yako: usajili wa mbali, ufuatiliaji mtandaoni, mhusika wa kibinadamu aliyejitolea, nyaraka kwenye kasha lako, na uwezekano wa kuanzisha kampuni kwa ndugu aliyebaki nyumbani.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Kasha lako la kisheria linahifadhi nyaraka zako zote (katiba, RCCM, vitambulisho…) zikiwa zimesimbwa na zinapatikana wakati wowote. Baada ya miezi 6, akaunti yako inapokea beji ya uthibitisho.', qr: ['documents', 'program'] },
    country: { text: 'Tunaanzia Kamerun (Douala, Yaoundé, Edéa na mikoa yote 10), kisha nchi nyingine za OHADA. Unachagua nchi na mji wa usajili moja kwa moja kwenye faili lako.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'Una wazo la kutusaidia kuboresha? Liweke kwenye Kopen Mind, sanduku letu la mapendekezo. Timu inasoma kila ujumbe.', qr: [] },
    human: { text: 'Bila shaka. Ninapeleka ombi lako kwa mwanachama wa timu ya KEC, jibu ndani ya saa 4 za kazi. Unaweza pia kuweka miadi na mshauri moja kwa moja.', qr: [], route: { name: 'fellow-consultant', label: 'Weka miadi na mshauri' } },
    escalate: { text: 'Swali hili linastahili maoni ya mtaalamu wetu, sitaki kukupa jibu la kukisia. Nimepeleka ombi lako kwa timu: mshauri atawasiliana nawe ndani ya saa 4 za kazi. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Samahani, sikuelewa vizuri. Unaweza kueleza tena, au kuchagua mada hapa chini?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Samahani, bado sijaelewa. Jaribu maneno mengine, ninakusikiliza.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Napendelea kukuunganisha na mtu wa timu ili usipoteze muda. Mtu atachukua mazungumzo na kukujibu ndani ya saa 4 za kazi.', qr: [] },
    labels: { program: 'Programu ya 110', waitlist: 'Orodha ya kusubiri', legalForms: 'Miundo ya kisheria', documents: 'Nyaraka', price: 'Bei', payment: 'Malipo', timeline: 'Muda', diaspora: 'Niko diaspora', vault: 'Kasha', human: 'Zungumza na mtu' }
  },

  ln: {
    welcome: { text: 'Mbote mpe boyei malamu na K-Enterprise Counsel {name} 🌍 Ngai Manu, moyambi ya KEC. Nakoki kosalisa yo ndenge nini lelo?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Mbote {name}, boyei malamu na K-Enterprise Counsel ☀️ Ngai Manu, moyambi ya KEC. Yebisa ngai nini ememi yo awa, tokokende liboso elongo.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Mbote! Nazali na esengo ya kokutana na yo. Kokela, kokomisa semba, kokolisa mombongo na yo: olingi tobanda na nini?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Ngai nde natondi yo. Tozali elongo! Nazali awa soki ozali na mposa.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) ezali ekuke ya digital mpe ya mibeko mpo na mosali-mombongo ya Afrika: tosalisaka yo kokela, kokomisa semba mpe kokolisa mombongo na yo na Cameroun, na nzela ya etando ya OHADA. Tolakaka te kokela na mbala moko, kasi bopete, polele mpe lisalisi ya solo ya bato.', qr: ['program', 'waitlist'] },
    program: { text: 'Programme ya liboso eyambi fellows 110 na sanza 6: botali, boyekoli, bobongisi ya mibeko, bokeli, mikanda ya suka mpe bolandi. Na suka, compte ya kompani na yo ezwi certification KEC, emonanaka na plateforme. Boponi esalemaka kati ya baye bakomisi nkombo na liste ya kozela.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Kota na ndako ya kozela' } },
    waitlist: { text: 'Mpo na kozala moko ya 110, kota na ndako na biso ya kozela ya internet: formulaire ya miniti 2, tike na numéro, mpe kafe ezali ya biso ☕. Ekipi etalaka profil moko na moko liboso ya kopona.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Kota na ndako ya kozela' } },
    legalForms: { text: 'Na etando ya OHADA: mombongo ya moto moko ezali pete kasi ekangaka yo moko; SARL (moto moko to ebele) ezali lolenge oyo esalelamaka mingi mpo na ba PME; SAS epesaka bonsomi mingi na statuts; SA ezali mpo na misala minene. Oyo ezali sango ya mobimba: mpo na koyeba oyo ebongi na projet NA YO, conseiller ya KEC akotambwisa yo.', qr: ['human', 'price'] },
    documents: { text: 'Mikanda oyo esengelaka: carte d\'identité (to passeport) ya mosangani to gérant moko na moko, plan ya esika ya siège, bafoto ya identité, mpe engebene, casier judiciaire mpe contrat ya bail. Okoki kobeta yango foto na telefone: totalaka soki emonanaka malamu tango otindi.', qr: ['vault', 'timeline'] },
    price: { text: 'Programme SCALE 110 ezali na ntalo ya FCFA 300 000 mpo na kompani moko. Libanda ya programme, devis ya mobimba elakisamaka ntango nyonso LIBOSO ya kosenga ba données ya sekele. Mpe mpo na kosolola na conseiller, ntango olingi: carte « Conseiller, ntango olingi » na nse ya écran.', qr: ['payment', 'human'] },
    payment: { text: 'Okoki kofuta na MTN Mobile Money, Orange Money to na banque. Na MoMo/OM, ondimaka na telefone mpe ozwaka reçu mbala moko. Diaspora ekoki mpe kofuta mpo na ndeko.', qr: ['price', 'diaspora'] },
    timeline: { text: 'Ntango etali lolenge ya mibeko mpe ba administrations. Dossier moko na moko elakisaka ba dates oyo ekanamaki mpe moto ya kosolola na ye, mpe tobimisaka ntango na biso ya solo. Elaka ya maji te, kasi polele mobimba.', qr: ['documents', 'human'] },
    diaspora: { text: 'Ozali mosika na mboka? Ebongisami mpo na yo: kokela na mosika, bolandi na internet, moto ya kosolola na ye, mikanda na sanduku na yo, mpe likoki ya kokela mpo na ndeko oyo atikali na mboka.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Sanduku na yo ya mibeko ebombaka mikanda na yo nyonso (statuts, RCCM, ba carte…) na sekele mpe ezwamaka ntango nyonso. Na suka ya sanza 6, compte na yo ezwi elembo ya certification.', qr: ['documents', 'program'] },
    country: { text: 'Tobandi na Cameroun (Douala, Yaoundé, Edéa mpe ba régions 10), na sima mikili mosusu ya OHADA. Oponi mboka mpe engumba ya kokela mbala moko na dossier na yo.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'Likanisi mpo tokoma malamu? Tika yango na Kopen Mind, sanduku na biso ya makanisi. Ekipi etangaka nsango nyonso.', qr: [] },
    human: { text: 'Ya solo. Natindi bosenga na yo na moto ya ekipi ya KEC, eyano na ngonga 4 ya mosala. Okoki mpe kozwa rendez-vous na conseiller mbala moko.', qr: [], route: { name: 'fellow-consultant', label: 'Zwa rendez-vous na conseiller' } },
    escalate: { text: 'Motuna oyo esengeli na likanisi ya moto ya mayele ya ekipi na biso, nalingi te kopesa yo eyano ya libanda. Natindi bosenga na yo na ekipi: conseiller akobenga yo na ngonga 4 ya mosala. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Limbisa ngai, nayokaki malamu te. Okoki koloba yango lisusu, to kopona likambo awa na nse?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Limbisa ngai, nayebi naino te. Meka na maloba mosusu, nazali koyoka.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Nalingi kopesa yo na moto ya ekipi mpo obungisa ntango te. Moto akokoba lisolo mpe akoyanola yo na ngonga 4 ya mosala.', qr: [] },
    labels: { program: 'Programme 110', waitlist: 'Liste ya kozela', legalForms: 'Lolenge ya mibeko', documents: 'Mikanda', price: 'Ntalo', payment: 'Kofuta', timeline: 'Ntango', diaspora: 'Nazali na diaspora', vault: 'Sanduku', human: 'Solola na moto' }
  },

  zh: {
    welcome: { text: '您好，欢迎来到 K-Enterprise Counsel {name} 🌍 我是 Manu，KEC 的前台接待。今天我能为您做些什么？', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: '您好 {name}，欢迎来到 K-Enterprise Counsel ☀️ 我是 Manu，KEC 的前台接待。告诉我您的需求，我们一起推进。', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: '您好！很高兴见到您。创立、规范化、发展您的企业：您想从哪里开始？', qr: ['program', 'documents', 'price'] },
    thanks: { text: '该我谢谢您。我们一起努力！需要时我就在这里。', qr: [] },
    whatIsKec: { text: 'KEC（K-Enterprise Counsel）是非洲创业者的数字化法律门户：我们帮助您在喀麦隆创立、规范化并发展企业，并逐步迈向 OHADA 区域。我们不承诺即时注册，而是承诺简单、透明和真正的人工陪伴。', qr: ['program', 'waitlist'] },
    program: { text: '试点项目接收 110 名学员，为期 6 个月：诊断、培训、法律架构、注册、最终文件和跟进。结束时，您的企业账户获得 KEC 认证，并在平台上可见。学员从候补名单的报名者中选出。', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: '进入等候室' } },
    waitlist: { text: '想成为 110 人之一，请进入我们的虚拟等候室：2 分钟的表格，一张编号票，咖啡由我们请客 ☕。团队在确定名单前会审阅每一份资料。', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: '进入等候室' } },
    legalForms: { text: '一般而言，在 OHADA 区域：个体企业简单但需个人承担责任；SARL（一名或多名股东）是中小企业最常见的形式；SAS 在章程上更灵活；SA 适合较大的项目。这只是一般信息：哪种形式适合您的项目，KEC 顾问会为您指引。', qr: ['human', 'price'] },
    documents: { text: '常用文件：每位股东或经理的身份证（或护照）、公司住所位置图、证件照，视情况还需无犯罪记录证明和租赁合同。用手机拍照即可：上传时我们会检查清晰度。', qr: ['vault', 'timeline'] },
    price: { text: 'SCALE 110 项目费用为每家企业 300,000 西非法郎。项目之外，在索取敏感数据之前，始终会先显示完整详细的报价。想和顾问交谈，随时可以：屏幕底部的「顾问，随时为您」卡片。', qr: ['payment', 'human'] },
    payment: { text: '可通过 MTN Mobile Money、Orange Money 或银行转账付款。使用 MoMo/OM 时，您在手机上确认后立即收到收据。海外侨民也可以替亲属付款。', qr: ['price', 'diaspora'] },
    timeline: { text: '时间取决于法律形式和行政机关。每个档案都显示预计日期和指定联系人，我们还会公布实际平均时长。没有神奇的承诺，只有完全的透明。', qr: ['documents', 'human'] },
    diaspora: { text: '您身在海外？这正是为您准备的：远程注册、在线跟踪、专属人工联系人、保险箱中的文件，还可以为留在国内的亲属创办企业。', qr: ['payment', 'waitlist'] },
    vault: { text: '您的法律保险箱加密保存所有文件（章程、RCCM、身份证件等），随时可以查阅。6 个月结束后，您的账户将获得认证徽章。', qr: ['documents', 'program'] },
    country: { text: '我们从喀麦隆起步（杜阿拉、雅温得、埃代阿及全部 10 个大区），随后拓展到其他 OHADA 国家。您可直接在档案中选择注册的国家和城市。', qr: ['documents', 'waitlist'] },
    kopen: { text: '有帮助我们改进的想法？请留在我们的意见箱 Kopen Mind。团队会阅读每一条留言。', qr: [] },
    human: { text: '当然。我把您的请求转给 KEC 团队成员，4 个工作小时内回复。您也可以直接预约顾问。', qr: [], route: { name: 'fellow-consultant', label: '预约顾问' } },
    escalate: { text: '这个问题值得我们专业人士的意见，我不想给您一个大概的答案。我已将您的请求转给团队：顾问将在 4 个工作小时内联系您。🙏🏾', qr: [] },
    fallback: [
      { text: '抱歉，我没有听明白。您可以换个说法，或者在下方选择一个主题吗？', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: '不好意思，我还是没明白。试试换个词，我在听。', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: '为了不浪费您的时间，我把您转给团队的同事。会有专人接手对话，并在 4 个工作小时内回复您。', qr: [] },
    labels: { program: '110 项目', waitlist: '候补名单', legalForms: '法律形式', documents: '所需文件', price: '价格', payment: '付款', timeline: '时间', diaspora: '我在海外', vault: '保险箱', human: '与真人交谈' }
  },

  ar: {
    welcome: { text: 'مرحباً بكم في K-Enterprise Counsel {name} 🌍 أنا مانو، موظفة الاستقبال في KEC. كيف يمكنني مساعدتكم اليوم؟', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'مرحباً {name}، أهلاً بكم في K-Enterprise Counsel ☀️ أنا مانو، موظفة الاستقبال في KEC. أخبروني بما جاء بكم، وسنمضي قدماً معاً.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'أهلاً بكم! سعيدة بلقائكم. تأسيس شركتكم أو تنظيمها أو تطويرها: من أين تودون البدء؟', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'أنا من يشكركم. نحن معاً! أنا هنا إن احتجتم إليّ.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) هي البوابة الرقمية والقانونية لرائد الأعمال الأفريقي: نساعدكم على تأسيس شركتكم وتنظيمها وتطويرها في الكاميرون، مع مسار نحو فضاء OHADA. لا نعد بتأسيس فوري، بل بالبساطة والشفافية ومرافقة بشرية حقيقية.', qr: ['program', 'waitlist'] },
    program: { text: 'يستقبل البرنامج التجريبي 110 زملاء لمدة 6 أشهر: تشخيص، تدريب، هيكلة قانونية، تأسيس، وثائق نهائية ومتابعة. في النهاية يحصل حساب شركتكم على شهادة KEC، وتظهر على المنصة. يتم الاختيار من بين المسجلين في قائمة الانتظار.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'دخول قاعة الانتظار' } },
    waitlist: { text: 'لتكونوا من بين الـ110، ادخلوا قاعة الانتظار الافتراضية: استمارة من دقيقتين، تذكرة مرقمة، والقهوة على حسابنا ☕. يدرس الفريق كل ملف قبل اختيار الدفعة.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'دخول قاعة الانتظار' } },
    legalForms: { text: 'بشكل عام في فضاء OHADA: المؤسسة الفردية بسيطة لكنها تلزمكم شخصياً؛ SARL (شريك واحد أو أكثر) هي الشكل الأكثر شيوعاً للمؤسسات الصغيرة والمتوسطة؛ SAS تمنح مرونة أكبر في النظام الأساسي؛ SA موجهة للمشاريع الكبرى. هذه معلومات عامة: لمعرفة ما يناسب مشروعكم أنتم، سيرشدكم مستشار KEC.', qr: ['human', 'price'] },
    documents: { text: 'الوثائق المعتادة: بطاقة الهوية (أو جواز السفر) لكل شريك أو مدير، مخطط موقع المقر، صور شخصية، وحسب الحالة مستخرج السجل العدلي وعقد الإيجار. يمكنكم تصويرها بالهاتف: نتحقق من وضوحها عند الإرسال.', qr: ['vault', 'timeline'] },
    price: { text: 'تبلغ تكلفة برنامج SCALE 110 مبلغ 300,000 فرنك أفريقي لكل شركة. خارج البرنامج، يُعرض عليكم دائماً عرض سعر كامل ومفصل قبل طلب أي بيانات حساسة. وللتحدث مع مستشار، في أي وقت تشاؤون: بطاقة «مستشار، متى شئتم» أسفل الشاشة.', qr: ['payment', 'human'] },
    payment: { text: 'يمكنكم الدفع عبر MTN Mobile Money أو Orange Money أو التحويل البنكي. مع MoMo/OM تؤكدون على هاتفكم وتتلقون إيصالاً فوراً. ويمكن لأفراد الشتات الدفع نيابة عن قريب.', qr: ['price', 'diaspora'] },
    timeline: { text: 'تعتمد المدة على الشكل القانوني والإدارات. يعرض كل ملف تواريخ تقديرية وجهة اتصال محددة بالاسم، وننشر متوسط مدتنا الفعلي. لا وعود سحرية، بل شفافية كاملة.', qr: ['documents', 'human'] },
    diaspora: { text: 'أنتم بعيدون عن الوطن؟ هذا مصمم لكم: تأسيس عن بُعد، متابعة عبر الإنترنت، جهة اتصال بشرية مخصصة، وثائقكم في خزنتكم، وإمكانية التأسيس لقريب بقي في الوطن.', qr: ['payment', 'waitlist'] },
    vault: { text: 'تحفظ خزنتكم القانونية جميع وثائقكم (النظام الأساسي، RCCM، الهويات…) مشفرة ومتاحة في أي وقت. بعد 6 أشهر يحصل حسابكم على شارة الاعتماد.', qr: ['documents', 'program'] },
    country: { text: 'ننطلق من الكاميرون (دوالا، ياوندي، إيديا والأقاليم العشرة)، ثم نتجه إلى بقية بلدان OHADA. تختارون بلد ومدينة التأسيس مباشرة في ملفكم.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'لديكم فكرة لتحسين خدماتنا؟ اتركوها في Kopen Mind، صندوق اقتراحاتنا. يقرأ الفريق كل رسالة.', qr: [] },
    human: { text: 'بالتأكيد. أحوّل طلبكم إلى أحد أعضاء فريق KEC، والرد خلال 4 ساعات عمل. يمكنكم أيضاً حجز موعد مع مستشار مباشرة.', qr: [], route: { name: 'fellow-consultant', label: 'حجز مستشار' } },
    escalate: { text: 'يستحق هذا السؤال رأي أحد المختصين لدينا، ولا أريد إعطاءكم إجابة تقريبية. لقد حوّلت طلبكم إلى الفريق: سيتصل بكم مستشار خلال 4 ساعات عمل. 🙏🏾', qr: [] },
    fallback: [
      { text: 'عذراً، لم أفهم جيداً. هل يمكنكم إعادة الصياغة أو اختيار موضوع أدناه؟', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'المعذرة، ما زلت لم أفهم. جرّبوا كلمات أخرى، أنا أصغي.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'أفضّل تحويلكم إلى أحد أعضاء الفريق حتى لا تضيعوا وقتكم. سيتولى شخص المحادثة ويرد عليكم خلال 4 ساعات عمل.', qr: [] },
    labels: { program: 'برنامج 110', waitlist: 'قائمة الانتظار', legalForms: 'الأشكال القانونية', documents: 'الوثائق', price: 'الأسعار', payment: 'الدفع', timeline: 'المدة', diaspora: 'أنا من الشتات', vault: 'الخزنة', human: 'التحدث مع شخص' }
  }
}

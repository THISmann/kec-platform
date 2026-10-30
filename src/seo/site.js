/** URL canonique du site en production. */
export const SITE_URL = 'https://kec-africa.com'

export const ORG = {
  name: 'KEC — K-Enterprise Counsel',
  alternateName: ['KEC', 'KEC Africa', 'KEC Consulting', 'K-Enterprise Counsel', 'KEC-consulting'],
  email: 'mbote@kec-africa.com',
  cities: ['Douala', 'Yaoundé', 'Bafoussam'],
  country: 'CM'
}

const pick = (val, locale) => {
  if (val && typeof val === 'object' && ('fr' in val || 'en' in val)) return val[locale] || val.fr
  return val
}

/**
 * Fiches SEO des pages publiques indexables.
 * Une intention de recherche = une URL, titres uniques, FAQ pour le rich result.
 */
export const GUIDES = {
  brand: {
    path: '/kec-consulting',
    name: 'seo-brand',
    navKey: 'guides.brand.nav',
    title: {
      fr: 'KEC Consulting | Cabinet juridique et création d’entreprise en Afrique',
      en: 'KEC Consulting | Legal firm for company creation in Africa'
    },
    description: {
      fr: 'KEC Consulting (KEC Africa, K-Enterprise Counsel) est le cabinet qui accompagne la création d’entreprise en Afrique : formalités OHADA, bureau juridique à Douala, Yaoundé et Bafoussam, investisseurs.',
      en: 'KEC Consulting (KEC Africa) helps founders incorporate in Africa: OHADA filings, a legal desk in Cameroon, and a path for diaspora investors.'
    },
    h1: { fr: 'KEC Consulting, le cabinet des entrepreneurs d’Afrique', en: 'KEC Consulting, the firm for African founders' },
    lead: {
      fr: 'On vous cherche sous KEC, KEC Africa, KEC-consulting ou K-Enterprise Counsel : c’est la même maison. Un guichet digital, une équipe humaine, et un bureau juridique ancré au Cameroun pour créer, formaliser et faire grandir votre entreprise en Afrique.',
      en: 'Whether you search KEC, KEC Africa or KEC Consulting, you land here: a digital desk, a human team, and a legal office in Cameroon to create and grow a company in Africa.'
    },
    sections: [
      {
        h2: { fr: 'Qui est KEC Africa ?', en: 'Who is KEC Africa?' },
        html: {
          fr: '<p><strong>KEC Africa</strong> est le nom public de K-Enterprise Counsel. Nous ne sommes pas une plateforme anonyme : c’est un cabinet qui porte les dossiers jusqu’au tampon, avec des consultants en droit des sociétés, fiscalité et investissement.</p><p>La vitrine est digitale — salle d’attente, Manu AI, coffre-fort de documents — mais le travail reste celui d’un <strong>bureau juridique en Afrique</strong> : Douala, Yaoundé, Bafoussam, et les 17 pays de l’espace OHADA en ligne de mire.</p>',
          en: '<p><strong>KEC Africa</strong> is the public name of K-Enterprise Counsel. Digital on the surface — waiting room, Manu AI, a document vault — and a real legal desk in Cameroon behind it.</p>'
        }
      },
      {
        h2: { fr: 'Pourquoi taper « KEC Consulting » mène ici', en: 'Why “KEC Consulting” leads here' },
        html: {
          fr: '<p>Les entrepreneurs nous trouvent sous plusieurs noms : <strong>kec-consulting</strong>, cabinet KEC, KEC Africa, K-Enterprise Counsel. Nous les revendiquons tous, pour qu’un fondateur de la diaspora, un investisseur ou une PME locale arrive au même endroit : un parcours de <strong>création d’entreprise en Afrique</strong>, un accompagnement juridique, et un canal dédié pour <strong>investir en Afrique</strong>.</p>',
          en: '<p>Founders find us as KEC Consulting, KEC Africa or K-Enterprise Counsel. All of those names point to the same offer: company creation in Africa, legal support, and a channel for investors.</p>'
        }
      },
      {
        h2: { fr: 'Ce que le cabinet fait concrètement', en: 'What the firm actually does' },
        html: {
          fr: '<ul><li>Création et formalisation (statuts, RCCM, formes OHADA : SARL, SAS, SASU, entreprise individuelle…).</li><li>Conseil à l’heure avec un consultant KEC, payé MoMo, Orange Money ou virement.</li><li>Coffre-fort juridique : pièces, contrats, certification du compte entreprise.</li><li>Programme SCALE 110 : 110 places pour une première cohorte accompagnée 6 mois.</li><li>Kia : le canal des investisseurs qui veulent voir le business en Afrique se structurer.</li></ul>',
          en: '<ul><li>Incorporation and filings (OHADA forms, RCCM, articles).</li><li>Hourly counsel, paid by mobile money or transfer.</li><li>A legal vault for your documents.</li><li>SCALE 110: a 110-seat first cohort.</li><li>Kia, the investors’ channel.</li></ul>'
        }
      }
    ],
    faq: [
      { q: { fr: 'KEC Consulting et KEC Africa, c’est la même chose ?', en: 'Are KEC Consulting and KEC Africa the same?' }, a: { fr: 'Oui. KEC, KEC Consulting, KEC Africa et K-Enterprise Counsel désignent le même cabinet. L’adresse publique est kec-africa.com.', en: 'Yes. Those names all refer to K-Enterprise Counsel, at kec-africa.com.' } },
      { q: { fr: 'Où se trouve le bureau juridique ?', en: 'Where is the legal office?' }, a: { fr: 'L’équipe est ancrée au Cameroun — Douala, Yaoundé, Bafoussam — et accompagne des dossiers dans l’espace OHADA, plus la diaspora.', en: 'The team is based in Cameroon (Douala, Yaoundé, Bafoussam) and supports OHADA filings and the diaspora.' } }
    ]
  },
  create: {
    path: '/creation-entreprise-afrique',
    name: 'seo-create',
    navKey: 'guides.create.nav',
    title: {
      fr: 'Création d’entreprise en Afrique | Formalités OHADA avec KEC',
      en: 'Company creation in Africa | OHADA filings with KEC'
    },
    description: {
      fr: 'Créer une entreprise en Afrique sans se perdre : choix de la forme (SARL, SAS, EI), statuts, RCCM, devis transparent. KEC guide les fondateurs locaux et la diaspora.',
      en: 'Incorporate in Africa without getting lost: legal form, articles, RCCM, a clear quote. KEC guides local founders and the diaspora.'
    },
    h1: { fr: 'Création d’entreprise en Afrique, pas à pas', en: 'Company creation in Africa, step by step' },
    lead: {
      fr: 'Vous voulez créer une société au Cameroun, en Côte d’Ivoire, au Sénégal ou ailleurs dans l’espace OHADA ? KEC transforme un projet griffonné sur un cahier en dossier complet : forme juridique, pièces, suivi jusqu’au tampon officiel.',
      en: 'Incorporating in Cameroon, Côte d’Ivoire, Senegal or elsewhere in the OHADA area starts with a clear file: legal form, documents, follow-up until the official stamp.'
    },
    sections: [
      {
        h2: { fr: 'Par où commencer pour créer son entreprise en Afrique', en: 'Where to start when incorporating in Africa' },
        html: {
          fr: '<p>La première erreur est de courir au greffe sans avoir tranché le pays, la ville, la forme et qui paie. Chez KEC, le dossier s’ouvre dans cet ordre : pays et ville d’immatriculation, forme (entreprise individuelle, SARL, SARLU, SAS, SASU, SA, GIE), puis un devis affiché <em>avant</em> que vous versiez quoi que ce soit.</p><p>C’est le même chemin pour un entrepreneur à Douala et pour un membre de la diaspora à Paris, Berlin ou Montréal : le droit applicable est celui du pays de création, pas celui du pays de résidence.</p>',
          en: '<p>KEC opens a file in this order: country and city, legal form, then a quote shown before you pay. The applicable law is that of the country of incorporation, including for diaspora founders.</p>'
        }
      },
      {
        h2: { fr: 'OHADA, RCCM, statuts : ce que KEC prend en charge', en: 'OHADA, RCCM, articles: what KEC handles' },
        html: {
          fr: '<p>Dans l’espace OHADA, une création sérieuse passe par des statuts cohérents, un siège, des pièces d’identité, souvent un plan de localisation, puis le dépôt au <strong>RCCM</strong>. KEC rédige et suit ; vous remplissez un formulaire dédié, vous déposez les pièces dans le coffre-fort, l’équipe relance les administrations.</p><p>Nous ne remplaçons pas le notaire ou le greffe. Nous faisons le travail d’orchestration pour que le dossier n’attende pas dans un tiroir.</p>',
          en: '<p>In the OHADA area a serious incorporation needs coherent articles, a registered office, ID documents, then an RCCM filing. KEC drafts and follows up; you fill a form and upload documents to the vault.</p>'
        }
      },
      {
        h2: { fr: 'Diaspora : créer ici tout en vivant ailleurs', en: 'Diaspora: incorporate here while living abroad' },
        html: {
          fr: '<p>Beaucoup de recherches « création d’entreprise en Afrique » viennent d’Europe, d’Amérique ou de Chine. Le besoin est le même : un véhicule local propre, un mandataire de confiance, des documents récupérables. Le programme SCALE 110 et la salle d’attente KEC existent aussi pour ça — 110 places, six mois, un compte entreprise certifié à la sortie.</p>',
          en: '<p>Many “start a company in Africa” searches come from Europe, America or China. SCALE 110 and the KEC waiting room exist for that: 110 seats, six months, a certified company account at the end.</p>'
        }
      }
    ],
    faq: [
      { q: { fr: 'Combien de temps pour créer une entreprise en Afrique avec KEC ?', en: 'How long does incorporation take with KEC?' }, a: { fr: 'Le délai dépend du pays, de la forme et de la complétude des pièces. KEC affiche le parcours et suit le dossier ; nous ne promettons pas un tampon en 48 h quand l’administration n’est pas là.', en: 'It depends on the country, the legal form and how complete the file is. KEC tracks the file; we do not promise a 48-hour stamp.' } },
      { q: { fr: 'Puis-je créer une SARL au Cameroun depuis l’étranger ?', en: 'Can I form a Cameroonian SARL from abroad?' }, a: { fr: 'Oui, c’est un cas fréquent. Il faut une structure juridique claire, des pièces conformes et souvent un représentant sur place. C’est précisément le rôle du cabinet.', en: 'Yes. You typically need a clear legal structure, compliant documents and often a local representative. That is the firm’s role.' } }
    ]
  },
  legal: {
    path: '/cabinet-juridique-afrique',
    name: 'seo-legal',
    navKey: 'guides.legal.nav',
    title: {
      fr: 'Cabinet juridique en Afrique | Bureau KEC à Douala, Yaoundé, Bafoussam',
      en: 'Legal firm in Africa | KEC desk in Douala, Yaoundé, Bafoussam'
    },
    description: {
      fr: 'Un bureau juridique en Afrique pour les PME et la diaspora : droit des sociétés, fiscalité, contrats, rendez-vous avec un consultant KEC. Cabinet ancré au Cameroun, visio possible.',
      en: 'A legal desk in Africa for SMEs and the diaspora: corporate law, tax, contracts, hourly counsel. Based in Cameroon, video meetings available.'
    },
    h1: { fr: 'Un cabinet juridique en Afrique, à hauteur de PME', en: 'A legal firm in Africa, built for SMEs' },
    lead: {
      fr: '« Bureau juridique en Afrique » ne devrait pas vouloir dire une plaque à 2 millions et un secrétariat introuvable. KEC est un cabinet qui répond : consultants en droit des sociétés, fiscalité, investissement, créneau à l’heure, visio, téléphone ou bureau.',
      en: 'A legal office in Africa should answer the phone. KEC books corporate, tax and investment counsel by the hour — video, phone or in person.'
    },
    sections: [
      {
        h2: { fr: 'Un bureau juridique, pas seulement un site', en: 'A legal office, not just a website' },
        html: {
          fr: '<p>KEC a une vitrine digitale, mais le cœur du métier reste le <strong>cabinet</strong> : lecture d’un projet de statuts, relecture d’un bail, arbitrage entre SARL et SAS, question de fiscalité avant une levée. Manu AI accueille 24 h/24 puis passe la main à un professionnel dès que la question sort du général.</p><p>Les villes affichées — Douala, Yaoundé, Bafoussam — sont celles où l’équipe est ancrée. Les rendez-vous se prennent aussi à distance, ce qui compte pour la diaspora.</p>',
          en: '<p>Manu AI greets you around the clock, then hands over to a professional. The team is anchored in Douala, Yaoundé and Bafoussam; meetings also happen remotely for the diaspora.</p>'
        }
      },
      {
        h2: { fr: 'Dans quels cas prendre un consultant KEC', en: 'When to book a KEC consultant' },
        html: {
          fr: '<ul><li>Choisir une forme juridique et comprendre ce que vous signez.</li><li>Vérifier un contrat, un pacte, un bail commercial.</li><li>Préparer un investissement ou une entrée d’associé.</li><li>Y voir plus clair sur la fiscalité d’une activité naissante.</li></ul><p>Le tarif est affiché à l’heure. Annulation gratuite (en avoir) plus de 24 h avant le créneau. Paiement Mobile Money ou virement — les outils du continent, pas seulement la carte bancaire.</p>',
          en: '<ul><li>Choosing a legal form.</li><li>Reviewing a contract or commercial lease.</li><li>Preparing an investment or a new partner.</li><li>Early-stage tax questions.</li></ul>'
        }
      },
      {
        h2: { fr: 'Ce que ce cabinet ne fait pas en ligne', en: 'What this firm does not do online' },
        html: {
          fr: '<p>KEC ne délivre pas de conseil juridique individualisé automatique. Les pages du site, Manu et les guides sont de l’information générale. Le conseil commence quand un consultant prend votre dossier. C’est écrit en pied de page, et c’est volontaire : un vrai bureau juridique assume la limite entre information et mandat.</p>',
          en: '<p>KEC does not give automated personal legal advice. The site and Manu are general information. Advice starts when a consultant takes your file.</p>'
        }
      }
    ],
    faq: [
      { q: { fr: 'Le cabinet KEC est-il un avocat ?', en: 'Is KEC a law firm of advocates?' }, a: { fr: 'KEC est un cabinet d’accompagnement juridique et de formalisation pour entrepreneurs. Les consultations sont assurées par des professionnels du droit selon la question (sociétés, fiscalité, investissement).', en: 'KEC is a legal-support and incorporation firm for founders. Consultations are handled by legal professionals depending on the question.' } },
      { q: { fr: 'Puis-je consulter depuis l’étranger ?', en: 'Can I consult from abroad?' }, a: { fr: 'Oui : visio ou téléphone. Le bureau physique reste au Cameroun.', en: 'Yes: video or phone. The physical desk remains in Cameroon.' } }
    ]
  },
  invest: {
    path: '/investir-en-afrique',
    name: 'seo-invest',
    navKey: 'guides.invest.nav',
    title: {
      fr: 'Investir en Afrique | Cadre juridique et canal Kia — KEC',
      en: 'Invest in Africa | Legal framework and Kia channel — KEC'
    },
    description: {
      fr: 'Investir en Afrique commence par une structure propre : véhicule local, associés, fiscalité, documents. KEC sécurise le cadre ; Kia est le canal des investisseurs.',
      en: 'Investing in Africa starts with a clean structure: local vehicle, partners, tax, documents. KEC sets the legal frame; Kia is the investors’ channel.'
    },
    h1: { fr: 'Investir en Afrique, avec un cadre qui tient', en: 'Invest in Africa, with a frame that holds' },
    lead: {
      fr: '« Investir en Afrique » n’est pas un slogan. C’est un véhicule juridique, des associés, une traçabilité des apports, et des documents que l’on retrouve six ans plus tard. KEC construit ce cadre ; Kia permet de suivre la dynamique du programme.',
      en: 'Investing in Africa is a legal vehicle, partners, traceable contributions, and documents you can still find in six years. KEC builds that frame.'
    },
    sections: [
      {
        h2: { fr: 'Le risque n’est pas l’Afrique, c’est le flou', en: 'The risk is not Africa — it is the blur' },
        html: {
          fr: '<p>Beaucoup d’investissements cassent sur un pacte verbal, une société jamais immatriculée, un compte mélangé au personnel. Avant de parler rendement, KEC pose la structure : quelle société, dans quel pays, qui représente, comment on sort. C’est moins glamour qu’un pitch, c’est ce qui permet de <strong>faire du business en Afrique</strong> sans tout perdre au premier désaccord.</p>',
          en: '<p>Before yield, KEC sets the structure: which company, which country, who represents you, how you exit. That is what makes business in Africa survivable.</p>'
        }
      },
      {
        h2: { fr: 'Diaspora et associés locaux', en: 'Diaspora and local partners' },
        html: {
          fr: '<p>Le schéma classique : un financeur à l’étranger, un opérationnel sur place, une SARL ou SAS au Cameroun ou dans un autre État OHADA. KEC aligne les statuts, les mandats et le coffre-fort documentaire pour que chacun sache ce qu’il a signé.</p>',
          en: '<p>A common pattern: capital from abroad, an operator on the ground, an OHADA company. KEC aligns articles, mandates and the document vault.</p>'
        }
      },
      {
        h2: { fr: 'Kia, le canal investisseurs', en: 'Kia, the investors’ channel' },
        html: {
          fr: '<p>Kia n’est pas un fonds. C’est le canal KEC pour les investisseurs qui veulent voir, en temps réel, comment le programme et les dossiers avancent. L’entrée se fait sur invitation ; le travail juridique, lui, reste dans le cabinet.</p>',
          en: '<p>Kia is not a fund. It is KEC’s channel for investors who want to see how the programme and files move. Access is by invitation.</p>'
        }
      }
    ],
    faq: [
      { q: { fr: 'KEC place-t-il des fonds ?', en: 'Does KEC invest capital?' }, a: { fr: 'Non. KEC structure et accompagne. Kia est un canal d’information pour investisseurs, pas un véhicule de placement public.', en: 'No. KEC structures and supports. Kia is an information channel, not a public investment vehicle.' } },
      { q: { fr: 'Faut-il déjà une société pour investir ?', en: 'Do I need a company before investing?' }, a: { fr: 'Souvent, oui : un véhicule local propre. C’est précisément une des missions de création d’entreprise KEC.', en: 'Often yes: a clean local vehicle. That is one of KEC’s incorporation jobs.' } }
    ]
  },
  business: {
    path: '/business-afrique',
    name: 'seo-business',
    navKey: 'guides.business.nav',
    title: {
      fr: 'Business en Afrique | Créer, formaliser, grandir avec KEC',
      en: 'Business in Africa | Create, formalise, grow with KEC'
    },
    description: {
      fr: 'Faire du business en Afrique : une entreprise formalisée, un réseau, de la formation, un coffre-fort juridique. KEC accompagne les PME et la diaspora, de l’idée au tampon.',
      en: 'Doing business in Africa: a formal company, a network, training, a legal vault. KEC walks SMEs and the diaspora from idea to stamp.'
    },
    h1: { fr: 'Faire du business en Afrique, pour de vrai', en: 'Doing business in Africa, for real' },
    lead: {
      fr: 'Un business en Afrique qui dure a trois pieds : une structure légale, des documents en ordre, des gens autour de la table. KEC tient les trois — création, cabinet, réseau — pour les PME locales et ceux qui rentrent ou investissent depuis l’étranger.',
      en: 'A business that lasts in Africa needs a legal structure, orderly documents, and people at the table. KEC holds all three.'
    },
    sections: [
      {
        h2: { fr: 'Formaliser n’est pas un luxe', en: 'Formalising is not a luxury' },
        html: {
          fr: '<p>Sans immatriculation, pas de compte propre, pas d’appel d’offres sérieux, pas d’associé qui rentre proprement. La <strong>création d’entreprise en Afrique</strong> est le premier levier de croissance, pas une paperasse à reculer. KEC en fait un parcours guidé, devis visible, pièces au coffre.</p>',
          en: '<p>Without registration there is no clean account, no serious tender, no partner joining properly. Incorporation is a growth lever. KEC turns it into a guided path.</p>'
        }
      },
      {
        h2: { fr: 'Grandir après le tampon', en: 'Growing after the stamp' },
        html: {
          fr: '<p>Le programme SCALE 110 ajoute ce que le greffe ne donne pas : diagnostic, formation, structuration, suivi post-création, certification du compte entreprise. Cent dix places, six mois, une cohorte — pour tester le modèle avant de l’ouvrir plus large.</p>',
          en: '<p>SCALE 110 adds what the registry does not: diagnosis, training, structuring, post-incorporation follow-up, a certified company account. One hundred and ten seats, six months.</p>'
        }
      },
      {
        h2: { fr: 'Un seul guichet, dix langues', en: 'One desk, ten languages' },
        html: {
          fr: '<p>Le business en Afrique parle français, anglais, lingála, swahili, portugais, arabe, chinois… KEC accueille dans dix langues. Le droit, lui, reste celui du pays de création. Le site kec-africa.com est la porte ; le cabinet est la maison.</p>',
          en: '<p>KEC greets you in ten languages. The law remains that of the country of incorporation. kec-africa.com is the door; the firm is the house.</p>'
        }
      }
    ],
    faq: [
      { q: { fr: 'KEC est-il réservé au Cameroun ?', en: 'Is KEC only for Cameroon?' }, a: { fr: 'Le bureau est ancré au Cameroun. Le cap est l’espace OHADA et, plus largement, l’accompagnement d’entrepreneurs africains et de la diaspora.', en: 'The desk is anchored in Cameroon. The horizon is the OHADA area and African founders, including the diaspora.' } },
      { q: { fr: 'Comment rejoindre le programme ?', en: 'How do I join the programme?' }, a: { fr: 'Vous prenez un ticket dans la salle d’attente. KEC sélectionne 110 fellows parmi les inscrits pour la cohorte pilote.', en: 'Take a ticket in the waiting room. KEC selects 110 fellows from the list for the pilot cohort.' } }
    ]
  }
}

export const GUIDE_LIST = Object.values(GUIDES)

export function localizeGuide(guide, locale) {
  const loc = locale?.slice?.(0, 2) || 'fr'
  return {
    ...guide,
    title: pick(guide.title, loc),
    description: pick(guide.description, loc),
    h1: pick(guide.h1, loc),
    lead: pick(guide.lead, loc),
    sections: guide.sections.map((s) => ({ h2: pick(s.h2, loc), html: pick(s.html, loc) })),
    faq: guide.faq.map((f) => ({ q: pick(f.q, loc), a: pick(f.a, loc) }))
  }
}

export const PAGE_SEO = {
  home: {
    title: { fr: 'KEC Africa | Création d’entreprise et cabinet juridique', en: 'KEC Africa | Company creation and legal firm' },
    description: {
      fr: 'KEC Consulting accompagne la création d’entreprise en Afrique, un cabinet juridique au Cameroun, et ceux qui veulent investir ou faire du business sur le continent.',
      en: 'KEC Consulting helps you incorporate in Africa, with a legal desk in Cameroon, for founders and investors.'
    }
  },
  'waiting-room': {
    title: { fr: 'Salle d’attente SCALE 110 | KEC Africa', en: 'SCALE 110 waiting room | KEC Africa' },
    description: {
      fr: 'Prenez votre ticket pour la cohorte KEC : 110 places pour créer et formaliser votre entreprise en Afrique, accompagné six mois.',
      en: 'Take a ticket for the KEC cohort: 110 seats to create and formalise your company in Africa.'
    }
  },
  'kopen-mind': {
    title: { fr: 'Kopen Mind | Boîte à idées KEC', en: 'Kopen Mind | KEC suggestion box' },
    description: {
      fr: 'Glissez une idée, une remarque, un encouragement à l’équipe KEC. Chaque message est lu.',
      en: 'Slip an idea, a note or some encouragement to the KEC team. Every message is read.'
    }
  }
}

export function pageSeo(name, locale) {
  const row = PAGE_SEO[name]
  if (!row) return null
  const loc = locale?.slice?.(0, 2) || 'fr'
  return { title: pick(row.title, loc), description: pick(row.description, loc) }
}

export function organizationJsonLd() {
  return {
    '@type': 'LegalService',
    '@id': `${SITE_URL}/#org`,
    name: ORG.name,
    alternateName: ORG.alternateName,
    url: SITE_URL,
    email: ORG.email,
    image: `${SITE_URL}/og.svg`,
    logo: `${SITE_URL}/favicon.svg`,
    areaServed: { '@type': 'Continent', name: 'Africa' },
    availableLanguage: ['fr', 'en', 'de', 'es', 'pt', 'ln', 'sw', 'ru', 'zh', 'ar'],
    address: ORG.cities.map((city) => ({
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: ORG.country
    })),
    knowsAbout: [
      'Création d’entreprise en Afrique',
      'Droit OHADA',
      'Cabinet juridique',
      'Investir en Afrique',
      'Business en Afrique'
    ]
  }
}

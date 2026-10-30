/**
 * ─────────────────────────────────────────────────────────────
 *  Les 54 pays d'Afrique : nom, drapeau, ville-porte, OHADA, repère
 * ─────────────────────────────────────────────────────────────
 * Utilisé par le globe interactif de l'accueil (survol / clic d'un pays)
 * et par les arcs de la diaspora (qui atterrissent sur `city`).
 *
 * ⚠️ Chaque `fact` est une première rédaction, courte et générale.
 *    Elle engage KEC : la cliente ou un juriste de l'équipe doit la
 *    valider avant la mise en ligne (`validated: true`). Tant que ce
 *    n'est pas le cas, la fiche affiche la mention « repère à valider ».
 *
 * Clé = code ISO 3166-1 numérique (identifiant des pays dans world-atlas).
 * Noms : fr, en, de, es, pt. Les autres langues retombent sur l'anglais
 * (ru, zh, ar, sw, ln : à compléter avec les relectures natives).
 * Repères : fr, en, de ; les autres langues retombent sur l'anglais.
 */
const C = (iso2, numeric, names, flag, city, ohada, fact) => ({ iso2, numeric, names, flag, city, ohada, fact, validated: false })

export const AFRICA = {
  '012': C('DZ', '012', { fr: 'Algérie', en: 'Algeria', de: 'Algerien', es: 'Argelia', pt: 'Argélia' }, '🇩🇿', [3.06, 36.75], false,
    { fr: "Plus grand pays d'Afrique. Création d'entreprise auprès du CNRC, avec un guichet à Alger et dans chaque wilaya.", en: "Africa's largest country. Companies are registered with the CNRC, with a desk in Algiers and in every wilaya.", de: 'Größtes Land Afrikas. Unternehmensgründung beim CNRC, mit Schaltern in Algier und jeder Wilaya.' }),
  '024': C('AO', '024', { fr: 'Angola', en: 'Angola', de: 'Angola', es: 'Angola', pt: 'Angola' }, '🇦🇴', [13.23, -8.84], false,
    { fr: 'Guichet Único da Empresa : création en quelques jours. Économie pétrolière en pleine diversification.', en: 'Guichet Único da Empresa: incorporation in a few days. An oil economy now diversifying.', de: 'Guichet Único da Empresa: Gründung in wenigen Tagen. Ölwirtschaft in der Diversifizierung.' }),
  '204': C('BJ', '204', { fr: 'Bénin', en: 'Benin', de: 'Benin', es: 'Benín', pt: 'Benim' }, '🇧🇯', [2.42, 6.37], true,
    { fr: 'Membre OHADA. Création en ligne en 24 h via le guichet unique de l\'APIEx.', en: 'OHADA member. Online incorporation within 24 h through the APIEx one-stop shop.', de: 'OHADA-Mitglied. Online-Gründung in 24 Stunden über den APIEx-Einheitsschalter.' }),
  '072': C('BW', '072', { fr: 'Botswana', en: 'Botswana', de: 'Botsuana', es: 'Botsuana', pt: 'Botsuana' }, '🇧🇼', [25.91, -24.65], false,
    { fr: 'Registre en ligne CIPA. L\'une des économies les plus stables du continent.', en: 'Online CIPA registry. One of the most stable economies on the continent.', de: 'Online-Register CIPA. Eine der stabilsten Volkswirtschaften des Kontinents.' }),
  '854': C('BF', '854', { fr: 'Burkina Faso', en: 'Burkina Faso', de: 'Burkina Faso', es: 'Burkina Faso', pt: 'Burkina Faso' }, '🇧🇫', [-1.52, 12.37], true,
    { fr: 'Membre OHADA. Création au CEFORE, guichet unique des formalités, en 72 h en moyenne.', en: 'OHADA member. Incorporation at CEFORE, the formalities one-stop shop, in about 72 h.', de: 'OHADA-Mitglied. Gründung beim CEFORE, dem Einheitsschalter, in rund 72 Stunden.' }),
  '108': C('BI', '108', { fr: 'Burundi', en: 'Burundi', de: 'Burundi', es: 'Burundi', pt: 'Burundi' }, '🇧🇮', [29.36, -3.38], false,
    { fr: 'Création en une journée au guichet unique de l\'API, à Bujumbura.', en: 'One-day incorporation at the API one-stop shop in Bujumbura.', de: 'Gründung an einem Tag am API-Einheitsschalter in Bujumbura.' }),
  '120': C('CM', '120', { fr: 'Cameroun', en: 'Cameroon', de: 'Kamerun', es: 'Camerún', pt: 'Camarões' }, '🇨🇲', [9.7, 4.05], true,
    { fr: 'Membre OHADA. Centres de formalités de création d\'entreprise (CFCE) à Douala, Yaoundé et dans les régions, sous 72 h.', en: 'OHADA member. Business formalities centres (CFCE) in Douala, Yaoundé and the regions, within 72 h.', de: 'OHADA-Mitglied. Gründungszentren (CFCE) in Douala, Yaoundé und den Regionen, innerhalb von 72 Stunden.' }),
  '132': C('CV', '132', { fr: 'Cabo Verde', en: 'Cabo Verde', de: 'Kap Verde', es: 'Cabo Verde', pt: 'Cabo Verde' }, '🇨🇻', [-23.51, 14.93], false,
    { fr: '« Empresa no Dia » : création en une journée à la Casa do Cidadão. Économie de services et de tourisme.', en: '"Empresa no Dia": one-day incorporation at the Casa do Cidadão. A services and tourism economy.', de: '„Empresa no Dia“: Gründung an einem Tag in der Casa do Cidadão. Dienstleistungs- und Tourismuswirtschaft.' }),
  '140': C('CF', '140', { fr: 'Centrafrique', en: 'Central African Republic', de: 'Zentralafrikanische Republik', es: 'República Centroafricana', pt: 'República Centro-Africana' }, '🇨🇫', [18.55, 4.36], true,
    { fr: 'Membre OHADA. Guichet unique des formalités des entreprises (GUFE) à Bangui.', en: 'OHADA member. Business formalities one-stop shop (GUFE) in Bangui.', de: 'OHADA-Mitglied. Einheitsschalter für Unternehmensformalitäten (GUFE) in Bangui.' }),
  '148': C('TD', '148', { fr: 'Tchad', en: 'Chad', de: 'Tschad', es: 'Chad', pt: 'Chade' }, '🇹🇩', [15.05, 12.11], true,
    { fr: 'Membre OHADA. Création via l\'ANIE, l\'agence nationale des investissements et des exportations.', en: 'OHADA member. Incorporation through ANIE, the national investment and export agency.', de: 'OHADA-Mitglied. Gründung über die ANIE, die nationale Investitions- und Exportagentur.' }),
  '174': C('KM', '174', { fr: 'Comores', en: 'Comoros', de: 'Komoren', es: 'Comoras', pt: 'Comores' }, '🇰🇲', [43.26, -11.7], true,
    { fr: 'Membre OHADA. Guichet unique à l\'ANPI. Archipel tourné vers l\'agriculture d\'export (vanille, ylang-ylang).', en: 'OHADA member. One-stop shop at ANPI. An archipelago focused on export crops (vanilla, ylang-ylang).', de: 'OHADA-Mitglied. Einheitsschalter bei der ANPI. Inselstaat mit Exportlandwirtschaft (Vanille, Ylang-Ylang).' }),
  '178': C('CG', '178', { fr: 'Congo', en: 'Congo', de: 'Kongo', es: 'Congo', pt: 'Congo' }, '🇨🇬', [15.28, -4.27], true,
    { fr: 'Membre OHADA. Guichet unique de l\'ACPCE à Brazzaville et Pointe-Noire.', en: 'OHADA member. ACPCE one-stop shop in Brazzaville and Pointe-Noire.', de: 'OHADA-Mitglied. ACPCE-Einheitsschalter in Brazzaville und Pointe-Noire.' }),
  '180': C('CD', '180', { fr: 'RD Congo', en: 'DR Congo', de: 'DR Kongo', es: 'RD del Congo', pt: 'RD Congo' }, '🇨🇩', [15.3, -4.32], true,
    { fr: 'Membre OHADA. Guichet unique de création d\'entreprise (GUCE) à Kinshasa, en 3 jours ouvrés. Plus grand marché francophone d\'Afrique.', en: 'OHADA member. Business creation one-stop shop (GUCE) in Kinshasa, in 3 working days. Africa\'s largest French-speaking market.', de: 'OHADA-Mitglied. Einheitsschalter GUCE in Kinshasa, in 3 Werktagen. Größter frankophoner Markt Afrikas.' }),
  '384': C('CI', '384', { fr: 'Côte d\'Ivoire', en: 'Côte d\'Ivoire', de: 'Elfenbeinküste', es: 'Costa de Marfil', pt: 'Costa do Marfim' }, '🇨🇮', [-4.0, 5.35], true,
    { fr: 'Membre OHADA. Une SARL se crée en 24 h au guichet unique du CEPICI, avec un capital libre.', en: 'OHADA member. A SARL is incorporated within 24 h at the CEPICI one-stop shop, with free share capital.', de: 'OHADA-Mitglied. Eine SARL entsteht in 24 Stunden am CEPICI-Einheitsschalter, mit freiem Kapital.' }),
  '262': C('DJ', '262', { fr: 'Djibouti', en: 'Djibouti', de: 'Dschibuti', es: 'Yibuti', pt: 'Djibouti' }, '🇩🇯', [43.15, 11.59], false,
    { fr: 'Guichet unique à l\'ODPIC. Hub portuaire et logistique de la Corne de l\'Afrique.', en: 'One-stop shop at ODPIC. Port and logistics hub of the Horn of Africa.', de: 'Einheitsschalter bei der ODPIC. Hafen- und Logistikdrehscheibe am Horn von Afrika.' }),
  '818': C('EG', '818', { fr: 'Égypte', en: 'Egypt', de: 'Ägypten', es: 'Egipto', pt: 'Egito' }, '🇪🇬', [31.24, 30.04], false,
    { fr: 'GAFI : guichet unique des investissements. Premier marché d\'Afrique du Nord par la population.', en: 'GAFI: the investment one-stop shop. North Africa\'s largest market by population.', de: 'GAFI: Einheitsschalter für Investitionen. Bevölkerungsreichster Markt Nordafrikas.' }),
  '226': C('GQ', '226', { fr: 'Guinée équatoriale', en: 'Equatorial Guinea', de: 'Äquatorialguinea', es: 'Guinea Ecuatorial', pt: 'Guiné Equatorial' }, '🇬🇶', [8.78, 3.75], true,
    { fr: 'Membre OHADA. Ventanilla Única Empresarial à Malabo et Bata.', en: 'OHADA member. Ventanilla Única Empresarial in Malabo and Bata.', de: 'OHADA-Mitglied. Ventanilla Única Empresarial in Malabo und Bata.' }),
  '232': C('ER', '232', { fr: 'Érythrée', en: 'Eritrea', de: 'Eritrea', es: 'Eritrea', pt: 'Eritreia' }, '🇪🇷', [38.93, 15.34], false,
    { fr: 'Enregistrement auprès du ministère du Commerce. Marché peu ouvert : accompagnement au cas par cas.', en: 'Registration with the Ministry of Trade. A market that is still closed: case-by-case support.', de: 'Registrierung beim Handelsministerium. Wenig geöffneter Markt: Begleitung von Fall zu Fall.' }),
  '748': C('SZ', '748', { fr: 'Eswatini', en: 'Eswatini', de: 'Eswatini', es: 'Esuatini', pt: 'Essuatíni' }, '🇸🇿', [31.13, -26.32], false,
    { fr: 'Registre des sociétés en ligne. Zone monétaire commune avec l\'Afrique du Sud.', en: 'Online companies registry. Common monetary area with South Africa.', de: 'Online-Handelsregister. Gemeinsamer Währungsraum mit Südafrika.' }),
  '231': C('ET', '231', { fr: 'Éthiopie', en: 'Ethiopia', de: 'Äthiopien', es: 'Etiopía', pt: 'Etiópia' }, '🇪🇹', [38.74, 9.03], false,
    { fr: 'Deuxième pays d\'Afrique par la population. Enregistrement en ligne et ouverture progressive aux investisseurs étrangers.', en: 'Africa\'s second most populous country. Online registration and gradual opening to foreign investors.', de: 'Zweitbevölkerungsreichstes Land Afrikas. Online-Registrierung und schrittweise Öffnung für ausländische Investoren.' }),
  '266': C('GA', '266', { fr: 'Gabon', en: 'Gabon', de: 'Gabun', es: 'Gabón', pt: 'Gabão' }, '🇬🇦', [9.45, 0.39], true,
    { fr: 'Membre OHADA. Guichet unique de l\'ANPI-Gabon à Libreville, création en 48 h.', en: 'OHADA member. ANPI-Gabon one-stop shop in Libreville, incorporation in 48 h.', de: 'OHADA-Mitglied. ANPI-Gabon-Einheitsschalter in Libreville, Gründung in 48 Stunden.' }),
  '270': C('GM', '270', { fr: 'Gambie', en: 'The Gambia', de: 'Gambia', es: 'Gambia', pt: 'Gâmbia' }, '🇬🇲', [-16.58, 13.45], false,
    { fr: 'Guichet unique GIEPA. Enregistrement simple pour les petites entreprises.', en: 'GIEPA one-stop shop. Simple registration for small businesses.', de: 'GIEPA-Einheitsschalter. Einfache Registrierung für kleine Unternehmen.' }),
  '288': C('GH', '288', { fr: 'Ghana', en: 'Ghana', de: 'Ghana', es: 'Ghana', pt: 'Gana' }, '🇬🇭', [-0.19, 5.6], false,
    { fr: 'Office of the Registrar of Companies en ligne. Économie anglophone très dynamique de la CEDEAO.', en: 'Online Office of the Registrar of Companies. A very dynamic English-speaking ECOWAS economy.', de: 'Online-Registrar of Companies. Sehr dynamische englischsprachige ECOWAS-Wirtschaft.' }),
  '324': C('GN', '324', { fr: 'Guinée', en: 'Guinea', de: 'Guinea', es: 'Guinea', pt: 'Guiné' }, '🇬🇳', [-13.58, 9.64], true,
    { fr: 'Membre OHADA. Création à l\'APIP en 72 h. Premier exportateur mondial de bauxite.', en: 'OHADA member. Incorporation at APIP within 72 h. World\'s leading bauxite exporter.', de: 'OHADA-Mitglied. Gründung bei der APIP in 72 Stunden. Weltweit führender Bauxit-Exporteur.' }),
  '624': C('GW', '624', { fr: 'Guinée-Bissau', en: 'Guinea-Bissau', de: 'Guinea-Bissau', es: 'Guinea-Bisáu', pt: 'Guiné-Bissau' }, '🇬🇼', [-15.6, 11.86], true,
    { fr: 'Membre OHADA. Centre de formalités des entreprises (CFE) à Bissau.', en: 'OHADA member. Business formalities centre (CFE) in Bissau.', de: 'OHADA-Mitglied. Zentrum für Unternehmensformalitäten (CFE) in Bissau.' }),
  '404': C('KE', '404', { fr: 'Kenya', en: 'Kenya', de: 'Kenia', es: 'Kenia', pt: 'Quénia' }, '🇰🇪', [36.82, -1.29], false,
    { fr: 'eCitizen : création d\'entreprise entièrement en ligne. Hub technologique de l\'Afrique de l\'Est (M-Pesa).', en: 'eCitizen: fully online incorporation. East Africa\'s technology hub (M-Pesa).', de: 'eCitizen: vollständig digitale Gründung. Technologiezentrum Ostafrikas (M-Pesa).' }),
  '426': C('LS', '426', { fr: 'Lesotho', en: 'Lesotho', de: 'Lesotho', es: 'Lesoto', pt: 'Lesoto' }, '🇱🇸', [27.48, -29.31], false,
    { fr: 'Guichet unique OBFC. Enregistrement en quelques jours.', en: 'OBFC one-stop shop. Registration within a few days.', de: 'OBFC-Einheitsschalter. Registrierung in wenigen Tagen.' }),
  '430': C('LR', '430', { fr: 'Liberia', en: 'Liberia', de: 'Liberia', es: 'Liberia', pt: 'Libéria' }, '🇱🇷', [-10.8, 6.3], false,
    { fr: 'Liberia Business Registry en ligne. Droit d\'inspiration américaine.', en: 'Online Liberia Business Registry. A legal system inspired by US law.', de: 'Online-Liberia Business Registry. Rechtssystem nach US-Vorbild.' }),
  '434': C('LY', '434', { fr: 'Libye', en: 'Libya', de: 'Libyen', es: 'Libia', pt: 'Líbia' }, '🇱🇾', [13.19, 32.9], false,
    { fr: 'Enregistrement au registre du commerce. Marché à accompagner avec prudence.', en: 'Registration with the commercial registry. A market to approach carefully.', de: 'Eintragung ins Handelsregister. Markt mit Vorsicht zu begleiten.' }),
  '450': C('MG', '450', { fr: 'Madagascar', en: 'Madagascar', de: 'Madagaskar', es: 'Madagascar', pt: 'Madagáscar' }, '🇲🇬', [47.52, -18.88], false,
    { fr: 'EDBM : guichet unique de création à Antananarivo, en 48 h.', en: 'EDBM: incorporation one-stop shop in Antananarivo, within 48 h.', de: 'EDBM: Gründungs-Einheitsschalter in Antananarivo, in 48 Stunden.' }),
  '454': C('MW', '454', { fr: 'Malawi', en: 'Malawi', de: 'Malawi', es: 'Malaui', pt: 'Maláui' }, '🇲🇼', [33.77, -13.97], false,
    { fr: 'Registre en ligne MBRS. Économie agricole en modernisation.', en: 'Online MBRS registry. A modernising agricultural economy.', de: 'Online-Register MBRS. Landwirtschaft in der Modernisierung.' }),
  '466': C('ML', '466', { fr: 'Mali', en: 'Mali', de: 'Mali', es: 'Malí', pt: 'Mali' }, '🇲🇱', [-8.0, 12.65], true,
    { fr: 'Membre OHADA. Guichet unique de l\'API-Mali, création en 72 h.', en: 'OHADA member. API-Mali one-stop shop, incorporation within 72 h.', de: 'OHADA-Mitglied. Einheitsschalter der API-Mali, Gründung in 72 Stunden.' }),
  '478': C('MR', '478', { fr: 'Mauritanie', en: 'Mauritania', de: 'Mauretanien', es: 'Mauritania', pt: 'Mauritânia' }, '🇲🇷', [-15.98, 18.08], false,
    { fr: 'Guichet unique à Nouakchott. Création en une journée.', en: 'One-stop shop in Nouakchott. One-day incorporation.', de: 'Einheitsschalter in Nouakchott. Gründung an einem Tag.' }),
  '480': C('MU', '480', { fr: 'Maurice', en: 'Mauritius', de: 'Mauritius', es: 'Mauricio', pt: 'Maurícia' }, '🇲🇺', [57.5, -20.16], false,
    { fr: 'Création en ligne en quelques heures. Place financière et porte vers l\'Afrique de l\'Est et l\'Inde.', en: 'Online incorporation within hours. A financial centre and gateway to East Africa and India.', de: 'Online-Gründung in wenigen Stunden. Finanzplatz und Tor nach Ostafrika und Indien.' }),
  '504': C('MA', '504', { fr: 'Maroc', en: 'Morocco', de: 'Marokko', es: 'Marruecos', pt: 'Marrocos' }, '🇲🇦', [-7.59, 33.57], false,
    { fr: 'Centres régionaux d\'investissement (CRI) et création en ligne. Premier investisseur africain en Afrique de l\'Ouest.', en: 'Regional investment centres (CRI) and online incorporation. Leading African investor in West Africa.', de: 'Regionale Investitionszentren (CRI) und Online-Gründung. Führender afrikanischer Investor in Westafrika.' }),
  '508': C('MZ', '508', { fr: 'Mozambique', en: 'Mozambique', de: 'Mosambik', es: 'Mozambique', pt: 'Moçambique' }, '🇲🇿', [32.57, -25.97], false,
    { fr: 'Balcão de Atendimento Único. Économie portuaire et gazière en développement.', en: 'Balcão de Atendimento Único. A developing port and gas economy.', de: 'Balcão de Atendimento Único. Wachsende Hafen- und Gaswirtschaft.' }),
  '516': C('NA', '516', { fr: 'Namibie', en: 'Namibia', de: 'Namibia', es: 'Namibia', pt: 'Namíbia' }, '🇳🇦', [17.08, -22.56], false,
    { fr: 'BIPA : registre en ligne. Stabilité juridique reconnue.', en: 'BIPA: online registry. Recognised legal stability.', de: 'BIPA: Online-Register. Anerkannte Rechtssicherheit.' }),
  '562': C('NE', '562', { fr: 'Niger', en: 'Niger', de: 'Niger', es: 'Níger', pt: 'Níger' }, '🇳🇪', [2.11, 13.51], true,
    { fr: 'Membre OHADA. Maison de l\'Entreprise, guichet unique à Niamey.', en: 'OHADA member. Maison de l\'Entreprise, the one-stop shop in Niamey.', de: 'OHADA-Mitglied. Maison de l\'Entreprise, Einheitsschalter in Niamey.' }),
  '566': C('NG', '566', { fr: 'Nigeria', en: 'Nigeria', de: 'Nigeria', es: 'Nigeria', pt: 'Nigéria' }, '🇳🇬', [3.39, 6.52], false,
    { fr: 'Premier marché d\'Afrique par la population. Création en ligne auprès de la CAC.', en: 'Africa\'s largest market by population. Online incorporation with the CAC.', de: 'Bevölkerungsreichster Markt Afrikas. Online-Gründung bei der CAC.' }),
  '646': C('RW', '646', { fr: 'Rwanda', en: 'Rwanda', de: 'Ruanda', es: 'Ruanda', pt: 'Ruanda' }, '🇷🇼', [30.06, -1.94], false,
    { fr: 'Création d\'entreprise en ligne en quelques heures, gratuite. Référence africaine pour la facilité des affaires.', en: 'Free online incorporation within hours. An African benchmark for ease of doing business.', de: 'Kostenlose Online-Gründung in wenigen Stunden. Afrikanische Referenz für Unternehmensfreundlichkeit.' }),
  '678': C('ST', '678', { fr: 'São Tomé-et-Príncipe', en: 'São Tomé and Príncipe', de: 'São Tomé und Príncipe', es: 'Santo Tomé y Príncipe', pt: 'São Tomé e Príncipe' }, '🇸🇹', [6.73, 0.34], false,
    { fr: 'Guichet unique à São Tomé. Petit marché insulaire lusophone.', en: 'One-stop shop in São Tomé. A small Portuguese-speaking island market.', de: 'Einheitsschalter in São Tomé. Kleiner lusophoner Inselmarkt.' }),
  '686': C('SN', '686', { fr: 'Sénégal', en: 'Senegal', de: 'Senegal', es: 'Senegal', pt: 'Senegal' }, '🇸🇳', [-17.44, 14.69], true,
    { fr: 'Membre OHADA. Création en 24 h au Bureau de création d\'entreprise de l\'APIX, à Dakar.', en: 'OHADA member. Incorporation within 24 h at the APIX business creation office in Dakar.', de: 'OHADA-Mitglied. Gründung in 24 Stunden im Gründungsbüro der APIX in Dakar.' }),
  '690': C('SC', '690', { fr: 'Seychelles', en: 'Seychelles', de: 'Seychellen', es: 'Seychelles', pt: 'Seicheles' }, '🇸🇨', [55.45, -4.62], false,
    { fr: 'Registre en ligne. Place financière internationale.', en: 'Online registry. An international financial centre.', de: 'Online-Register. Internationaler Finanzplatz.' }),
  '694': C('SL', '694', { fr: 'Sierra Leone', en: 'Sierra Leone', de: 'Sierra Leone', es: 'Sierra Leona', pt: 'Serra Leoa' }, '🇸🇱', [-13.23, 8.48], false,
    { fr: 'Corporate Affairs Commission. Enregistrement en quelques jours.', en: 'Corporate Affairs Commission. Registration within a few days.', de: 'Corporate Affairs Commission. Registrierung in wenigen Tagen.' }),
  '706': C('SO', '706', { fr: 'Somalie', en: 'Somalia', de: 'Somalia', es: 'Somalia', pt: 'Somália' }, '🇸🇴', [45.32, 2.05], false,
    { fr: 'Enregistrement à Mogadiscio et dans les États fédérés. Marché en structuration.', en: 'Registration in Mogadishu and the federal states. A market taking shape.', de: 'Registrierung in Mogadischu und den Bundesstaaten. Markt im Aufbau.' }),
  '710': C('ZA', '710', { fr: 'Afrique du Sud', en: 'South Africa', de: 'Südafrika', es: 'Sudáfrica', pt: 'África do Sul' }, '🇿🇦', [28.05, -26.2], false,
    { fr: 'Économie la plus industrialisée du continent. Création en ligne auprès de la CIPC.', en: 'The continent\'s most industrialised economy. Online incorporation with the CIPC.', de: 'Industrialisierteste Volkswirtschaft des Kontinents. Online-Gründung bei der CIPC.' }),
  '728': C('SS', '728', { fr: 'Soudan du Sud', en: 'South Sudan', de: 'Südsudan', es: 'Sudán del Sur', pt: 'Sudão do Sul' }, '🇸🇸', [31.58, 4.85], false,
    { fr: 'Registre des sociétés à Djouba. Marché en construction.', en: 'Companies registry in Juba. A market under construction.', de: 'Handelsregister in Juba. Markt im Aufbau.' }),
  '729': C('SD', '729', { fr: 'Soudan', en: 'Sudan', de: 'Sudan', es: 'Sudán', pt: 'Sudão' }, '🇸🇩', [32.53, 15.55], false,
    { fr: 'Enregistrement au registre du commerce à Khartoum. Accompagnement au cas par cas.', en: 'Registration with the commercial registry in Khartoum. Case-by-case support.', de: 'Eintragung ins Handelsregister in Khartum. Begleitung von Fall zu Fall.' }),
  '834': C('TZ', '834', { fr: 'Tanzanie', en: 'Tanzania', de: 'Tansania', es: 'Tanzania', pt: 'Tanzânia' }, '🇹🇿', [39.28, -6.79], false,
    { fr: 'BRELA en ligne. Porte d\'entrée de l\'Afrique de l\'Est par le port de Dar es Salaam.', en: 'Online BRELA. Gateway to East Africa through the port of Dar es Salaam.', de: 'Online-BRELA. Tor nach Ostafrika über den Hafen von Daressalam.' }),
  '768': C('TG', '768', { fr: 'Togo', en: 'Togo', de: 'Togo', es: 'Togo', pt: 'Togo' }, '🇹🇬', [1.22, 6.13], true,
    { fr: 'Membre OHADA. Création en 24 h au CFE de Lomé, entièrement en ligne.', en: 'OHADA member. Incorporation within 24 h at the Lomé CFE, fully online.', de: 'OHADA-Mitglied. Gründung in 24 Stunden beim CFE Lomé, vollständig online.' }),
  '788': C('TN', '788', { fr: 'Tunisie', en: 'Tunisia', de: 'Tunesien', es: 'Túnez', pt: 'Tunísia' }, '🇹🇳', [10.18, 36.8], false,
    { fr: 'Registre national des entreprises en ligne. Tissu dense de PME exportatrices.', en: 'Online national business registry. A dense fabric of exporting SMEs.', de: 'Nationales Online-Unternehmensregister. Dichtes Netz exportierender KMU.' }),
  '800': C('UG', '800', { fr: 'Ouganda', en: 'Uganda', de: 'Uganda', es: 'Uganda', pt: 'Uganda' }, '🇺🇬', [32.58, 0.35], false,
    { fr: 'URSB en ligne. Économie jeune et dynamique de l\'Afrique de l\'Est.', en: 'Online URSB. A young, dynamic East African economy.', de: 'Online-URSB. Junge, dynamische Wirtschaft Ostafrikas.' }),
  '894': C('ZM', '894', { fr: 'Zambie', en: 'Zambia', de: 'Sambia', es: 'Zambia', pt: 'Zâmbia' }, '🇿🇲', [28.28, -15.42], false,
    { fr: 'PACRA en ligne. Premier producteur de cuivre d\'Afrique.', en: 'Online PACRA. Africa\'s leading copper producer.', de: 'Online-PACRA. Führender Kupferproduzent Afrikas.' }),
  '716': C('ZW', '716', { fr: 'Zimbabwe', en: 'Zimbabwe', de: 'Simbabwe', es: 'Zimbabue', pt: 'Zimbábue' }, '🇿🇼', [31.05, -17.83], false,
    { fr: 'Enregistrement au Companies Office. Économie en transition.', en: 'Registration with the Companies Office. An economy in transition.', de: 'Registrierung beim Companies Office. Wirtschaft im Wandel.' })
}

export const AFRICA_LIST = Object.values(AFRICA)

/** Villes africaines où atterrissent les arcs de la diaspora (changent toutes les 20 s) */
export const HUBS = ['686', '384', '566', '120', '180', '646', '404', '231', '504', '710', '288', '686', '834', '012', '818'].map((k) => AFRICA[k].city)

export const countryName = (c, locale) => c.names[locale] ?? c.names.en
export const countryFact = (c, locale) => c.fact[locale] ?? c.fact.en

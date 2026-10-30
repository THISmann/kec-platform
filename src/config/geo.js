/**
 * Pays de l'espace OHADA et villes principales.
 * Le Cameroun est le pays de lancement (V1) ; les autres pays sont
 * listés pour préparer la trajectoire OHADA (roadmap V3).
 * Remplaçable à terme par un endpoint GET /geo/countries.
 */
export const COUNTRIES = [
  {
    code: 'CM', name: 'Cameroun', flag: '🇨🇲', active: true,
    cities: ['Douala', 'Yaoundé', 'Edéa', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Buea', 'Kribi', 'Limbé', 'Dschang', 'Kumba']
  },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', active: false, cities: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro', 'Korhogo'] },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', active: false, cities: ['Dakar', 'Thiès', 'Saint-Louis', 'Touba', 'Ziguinchor'] },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', active: false, cities: ['Libreville', 'Port-Gentil', 'Franceville'] },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', active: false, cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie'] },
  { code: 'CD', name: 'RD Congo', flag: '🇨🇩', active: false, cities: ['Kinshasa', 'Lubumbashi', 'Goma', 'Kisangani'] },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', active: false, cities: ['Cotonou', 'Porto-Novo', 'Parakou'] },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', active: false, cities: ['Lomé', 'Kara', 'Sokodé'] },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', active: false, cities: ['Ouagadougou', 'Bobo-Dioulasso'] },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', active: false, cities: ['Bamako', 'Sikasso', 'Mopti'] },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', active: false, cities: ['Niamey', 'Zinder', 'Maradi'] },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', active: false, cities: ["N'Djamena", 'Moundou'] },
  { code: 'CF', name: 'Centrafrique', flag: '🇨🇫', active: false, cities: ['Bangui', 'Berbérati'] },
  { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶', active: false, cities: ['Malabo', 'Bata'] },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', active: false, cities: ['Conakry', 'Kankan', 'Labé'] },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', active: false, cities: ['Bissau'] },
  { code: 'KM', name: 'Comores', flag: '🇰🇲', active: false, cities: ['Moroni'] }
]

/** Pays de résidence possibles (profil diaspora) — liste courte, extensible */
export const RESIDENCE_COUNTRIES = [
  'Cameroun', 'France', 'Allemagne', 'Belgique', 'Suisse', 'Canada', 'États-Unis', 'Royaume-Uni',
  'Italie', 'Espagne', "Côte d'Ivoire", 'Sénégal', 'Gabon', 'Nigeria', 'Chine', 'Émirats arabes unis', 'Autre'
]

/**
 * Codes ISO 3166-1 numériques des pays africains (pour le globe).
 * Utilisés pour colorer l'Afrique en or sur la carte world-atlas.
 */
export const AFRICA_ISO_NUMERIC = new Set([
  '012', '024', '072', '086', '108', '120', '132', '140', '148', '174', '175', '178', '180', '204', '226', '231', '232',
  '262', '266', '270', '288', '324', '384', '404', '426', '430', '434', '450', '454', '466', '478', '480', '504', '508',
  '516', '562', '566', '624', '646', '654', '678', '686', '690', '694', '706', '710', '716', '728', '729', '732', '748',
  '768', '788', '800', '818', '834', '854', '894'
])

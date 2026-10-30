/**
 * ─────────────────────────────────────────────────────────────
 *  Proverbes de la salle d'attente : un par pays d'Afrique
 * ─────────────────────────────────────────────────────────────
 * `origin` = code ISO 3166-1 alpha-2 du pays (voir src/data/africaFacts.js),
 * ou 'AF' pour un proverbe panafricain. L'origine s'affiche sous la citation.
 *
 * ⚠️ Beaucoup de proverbes circulent dans plusieurs pays : les attributions
 *    sont une proposition à arbitrer par la cliente (question Q11 du plan).
 * Textes : fr, en, de ; les autres langues retombent sur l'anglais.
 */
export const PROVERBS = [
  { origin: 'CM', fr: "Une seule main n'attache pas le koki.", en: 'One hand alone cannot tie the koki.', de: 'Eine Hand allein bindet den Koki nicht.' },
  { origin: 'AF', fr: 'Si tu veux aller vite, marche seul ; si tu veux aller loin, marchons ensemble.', en: 'If you want to go fast, go alone; if you want to go far, go together.', de: 'Willst du schnell gehen, geh allein; willst du weit kommen, geh gemeinsam.' },
  { origin: 'SN', fr: "L'homme est le remède de l'homme.", en: 'Man is the remedy of man.', de: 'Der Mensch ist das Heilmittel des Menschen.' },
  { origin: 'CI', fr: 'Un seul bracelet ne tinte pas.', en: 'A single bracelet does not jingle.', de: 'Ein einzelner Armreif klingelt nicht.' },
  { origin: 'ML', fr: "C'est au bout de l'ancienne corde qu'on tisse la nouvelle.", en: 'The new rope is woven at the end of the old one.', de: 'Am Ende des alten Seils wird das neue geflochten.' },
  { origin: 'GH', fr: "Ce n'est pas une honte de retourner chercher ce qu'on a oublié.", en: 'It is no shame to go back for what you have forgotten.', de: 'Es ist keine Schande, zurückzugehen, um zu holen, was man vergessen hat.' },
  { origin: 'NG', fr: "Quelle que soit la longueur de la nuit, le jour finit par se lever.", en: 'However long the night, the day is sure to come.', de: 'Wie lang die Nacht auch ist, der Tag bricht an.' },
  { origin: 'KE', fr: "La patience est un arbre dont la racine est amère, mais dont les fruits sont très doux.", en: 'Patience is a tree whose root is bitter but whose fruit is very sweet.', de: 'Geduld ist ein Baum mit bitterer Wurzel und sehr süßen Früchten.' },
  { origin: 'TZ', fr: 'Petit à petit, on remplit la mesure.', en: 'Little by little, the measure is filled.', de: 'Nach und nach füllt sich das Maß.' },
  { origin: 'CD', fr: "L'eau qui coule ne retourne pas à la source.", en: 'Flowing water never returns to its source.', de: 'Fließendes Wasser kehrt nicht zur Quelle zurück.' },
  { origin: 'CG', fr: "Le fleuve a beau être large, il a toujours deux rives.", en: 'However wide the river, it always has two banks.', de: 'Wie breit der Fluss auch ist, er hat immer zwei Ufer.' },
  { origin: 'GA', fr: "La forêt qui nous a abrités, nous la respectons.", en: 'We respect the forest that sheltered us.', de: 'Den Wald, der uns beherbergt hat, achten wir.' },
  { origin: 'BJ', fr: "Celui qui plante un arbre n'a pas planté pour lui seul.", en: 'Whoever plants a tree has not planted for himself alone.', de: 'Wer einen Baum pflanzt, pflanzt nicht nur für sich.' },
  { origin: 'TG', fr: "La parole est comme l'eau : une fois versée, on ne la ramasse plus.", en: 'Words are like water: once poured, they cannot be gathered up.', de: 'Worte sind wie Wasser: Einmal vergossen, sammelt man sie nicht mehr ein.' },
  { origin: 'BF', fr: "Quand les racines sont profondes, il n'y a pas de raison de craindre le vent.", en: 'When the roots are deep, there is no reason to fear the wind.', de: 'Sind die Wurzeln tief, braucht man den Wind nicht zu fürchten.' },
  { origin: 'NE', fr: "Le chameau ne voit pas sa propre bosse.", en: 'The camel does not see its own hump.', de: 'Das Kamel sieht seinen eigenen Höcker nicht.' },
  { origin: 'TD', fr: "On ne traverse pas la rivière avant d'y être arrivé.", en: 'You do not cross the river before you reach it.', de: 'Man überquert den Fluss nicht, bevor man ihn erreicht hat.' },
  { origin: 'CF', fr: "Un arbre ne fait pas la forêt.", en: 'One tree does not make a forest.', de: 'Ein Baum macht noch keinen Wald.' },
  { origin: 'GQ', fr: "Qui veut du miel doit avoir le courage d'affronter les abeilles.", en: 'Whoever wants honey must have the courage to face the bees.', de: 'Wer Honig will, muss den Mut haben, den Bienen zu begegnen.' },
  { origin: 'GN', fr: "Le savoir est comme un jardin : s'il n'est pas cultivé, on ne peut le récolter.", en: 'Knowledge is like a garden: if it is not cultivated, it cannot be harvested.', de: 'Wissen ist wie ein Garten: Wird er nicht bestellt, gibt es keine Ernte.' },
  { origin: 'GW', fr: "Deux têtes valent mieux qu'une.", en: 'Two heads are better than one.', de: 'Zwei Köpfe sind besser als einer.' },
  { origin: 'KM', fr: "La mer ne refuse aucune rivière.", en: 'The sea refuses no river.', de: 'Das Meer weist keinen Fluss ab.' },
  { origin: 'DZ', fr: "Celui qui n'a pas de patience n'a rien.", en: 'Whoever has no patience has nothing.', de: 'Wer keine Geduld hat, hat nichts.' },
  { origin: 'MA', fr: "Goutte à goutte, l'eau creuse la pierre.", en: 'Drop by drop, water hollows the stone.', de: 'Tropfen für Tropfen höhlt das Wasser den Stein.' },
  { origin: 'TN', fr: "La main qui donne est au-dessus de celle qui reçoit.", en: 'The hand that gives is above the hand that receives.', de: 'Die gebende Hand steht über der nehmenden.' },
  { origin: 'EG', fr: "Un bon ami vaut mieux qu'un frère éloigné.", en: 'A good friend is better than a distant brother.', de: 'Ein guter Freund ist besser als ein ferner Bruder.' },
  { origin: 'LY', fr: "Qui sème le vent récolte la tempête.", en: 'Who sows the wind reaps the storm.', de: 'Wer Wind sät, wird Sturm ernten.' },
  { origin: 'MR', fr: "Le désert apprend à l'homme la valeur d'une goutte d'eau.", en: 'The desert teaches a man the worth of a drop of water.', de: 'Die Wüste lehrt den Menschen den Wert eines Wassertropfens.' },
  { origin: 'SD', fr: "Le silence est aussi une réponse.", en: 'Silence is also an answer.', de: 'Schweigen ist auch eine Antwort.' },
  { origin: 'SS', fr: "La vache ne pleure pas son lait donné.", en: 'The cow does not mourn the milk it has given.', de: 'Die Kuh trauert nicht um die Milch, die sie gegeben hat.' },
  { origin: 'ET', fr: "Quand les toiles d'araignée s'unissent, elles peuvent attacher un lion.", en: 'When spider webs unite, they can tie up a lion.', de: 'Wenn Spinnweben sich vereinen, können sie einen Löwen fesseln.' },
  { origin: 'ER', fr: "Celui qui sème avec des larmes récoltera avec des chants.", en: 'Whoever sows in tears will reap in song.', de: 'Wer mit Tränen sät, wird mit Gesang ernten.' },
  { origin: 'DJ', fr: "Un voyage de mille lieues commence par un pas.", en: 'A journey of a thousand leagues begins with one step.', de: 'Eine Reise von tausend Meilen beginnt mit einem Schritt.' },
  { origin: 'SO', fr: "Celui qui a voyagé a vu beaucoup, celui qui a lu a vu plus encore.", en: 'Whoever has travelled has seen much; whoever has read has seen more.', de: 'Wer gereist ist, hat viel gesehen; wer gelesen hat, noch mehr.' },
  { origin: 'UG', fr: "Un bon soleil se reconnaît dès le matin.", en: 'A good sun shows itself in the morning.', de: 'Eine gute Sonne erkennt man schon am Morgen.' },
  { origin: 'RW', fr: "Celui qui refuse de bouger ne trébuche pas, mais n'avance pas non plus.", en: 'Whoever refuses to move does not stumble, but does not advance either.', de: 'Wer sich nicht bewegt, stolpert nicht, kommt aber auch nicht voran.' },
  { origin: 'BI', fr: "Là où il y a l'amour, il n'y a pas d'obscurité.", en: 'Where there is love, there is no darkness.', de: 'Wo Liebe ist, gibt es keine Dunkelheit.' },
  { origin: 'MW', fr: "Un seul doigt ne peut pas ramasser une graine.", en: 'One finger cannot pick up a seed.', de: 'Ein Finger allein hebt kein Korn auf.' },
  { origin: 'ZM', fr: "Lorsque tu cours avec le grand, tu deviens grand.", en: 'When you run with the great, you become great.', de: 'Wer mit den Großen läuft, wird groß.' },
  { origin: 'ZW', fr: "Qui ne cultive pas aujourd'hui aura faim demain.", en: 'Whoever does not farm today will be hungry tomorrow.', de: 'Wer heute nicht sät, hungert morgen.' },
  { origin: 'MZ', fr: "L'oiseau qui chante ne sait pas si l'on écoute, il chante.", en: 'The bird that sings does not know whether anyone listens; it sings.', de: 'Der Vogel, der singt, weiß nicht, ob jemand zuhört; er singt.' },
  { origin: 'AO', fr: "Le bois tordu fait aussi un bon feu.", en: 'Crooked wood also makes a good fire.', de: 'Auch krummes Holz gibt ein gutes Feuer.' },
  { origin: 'NA', fr: "Apprendre vite, c'est bien ; apprendre bien, c'est mieux.", en: 'Learning fast is good; learning well is better.', de: 'Schnell lernen ist gut; gut lernen ist besser.' },
  { origin: 'BW', fr: "Un enfant est un enfant de tous.", en: 'A child is everyone\'s child.', de: 'Ein Kind ist das Kind aller.' },
  { origin: 'ZA', fr: "Je suis parce que nous sommes.", en: 'I am because we are.', de: 'Ich bin, weil wir sind.' },
  { origin: 'LS', fr: "La pluie ne tombe pas sur un seul toit.", en: 'Rain does not fall on one roof alone.', de: 'Der Regen fällt nicht auf ein einziges Dach.' },
  { origin: 'SZ', fr: "Un roi est roi grâce à son peuple.", en: 'A king is king because of his people.', de: 'Ein König ist König durch sein Volk.' },
  { origin: 'MG', fr: "Les paroles sont comme des œufs : une fois éclos, elles ont des ailes.", en: 'Words are like eggs: once hatched, they have wings.', de: 'Worte sind wie Eier: Einmal geschlüpft, haben sie Flügel.' },
  { origin: 'MU', fr: "La mer unit ceux qu'elle sépare.", en: 'The sea unites those it separates.', de: 'Das Meer verbindet, die es trennt.' },
  { origin: 'SC', fr: "Petit à petit, l'oiseau fait son nid.", en: 'Little by little, the bird builds its nest.', de: 'Nach und nach baut der Vogel sein Nest.' },
  { origin: 'CV', fr: "Qui a du pain n'a pas faim deux fois.", en: 'Whoever has bread is not hungry twice.', de: 'Wer Brot hat, hungert nicht zweimal.' },
  { origin: 'ST', fr: "La pirogue ne se construit pas en pleine mer.", en: 'The canoe is not built out at sea.', de: 'Das Kanu wird nicht auf hoher See gebaut.' },
  { origin: 'GM', fr: "Le fleuve ne se presse pas, et pourtant il arrive à la mer.", en: 'The river does not hurry, and yet it reaches the sea.', de: 'Der Fluss eilt nicht, und doch erreicht er das Meer.' },
  { origin: 'SL', fr: "Un chemin se fait en marchant.", en: 'A path is made by walking.', de: 'Ein Weg entsteht beim Gehen.' },
  { origin: 'LR', fr: "Celui qui demande ne se perd pas.", en: 'Whoever asks does not get lost.', de: 'Wer fragt, verirrt sich nicht.' }
]

export const proverbText = (p, locale) => p[locale] ?? p.en

/** Ordre aléatoire qui fait le tour complet avant de répéter un proverbe */
export function shuffled(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

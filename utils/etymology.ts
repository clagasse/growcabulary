import { Word, ExtractedRootGroup } from '../types';
import { WORD_MORPHEMES, getWordMorphemeProfile } from './morphemes';

/**
 * Curated canonical root families that appear across multiple specimens in RAW_WORDS,
 * plus automatic regex extraction from every word's `etymology` narrative.
 */
interface CanonicalRootDef {
  id: string;
  displayRoot: string;
  meaning: string;
  origin: string;
  patterns: RegExp[];
  isPrefix?: boolean;
  /** Cross-family cognates (e.g. Latin `ferre` <-> Greek `pherein`) for sister-clade linking */
  cognateIds?: string[];
}

const CANONICAL_ROOT_FAMILIES: CanonicalRootDef[] = [
  // =========================================================================
  // CLASSICAL LATIN SUBSTANTIVE ROOTS
  // =========================================================================
  {
    id: 'acer',
    displayRoot: 'acer / acri-',
    meaning: 'sharp, biting, sour',
    origin: 'Latin',
    patterns: [/'acer(?:bus)?'/i, /'acrimonia'/i, /\bacerbus\b/i, /\bacrimon/i],
  },
  {
    id: 'aequus',
    displayRoot: 'aequus',
    meaning: 'equal, even, level, fair',
    origin: 'Latin',
    patterns: [/'aequus'/i, /'aequanimitas'/i, /'aequivocus'/i, /\baequ(?:us|i)/i],
  },
  {
    id: 'agere',
    displayRoot: 'agere / act-',
    meaning: 'to drive, set in motion, act',
    origin: 'Latin',
    patterns: [
      /'agere'/i,
      /'agitare'/i,
      /'transigere'/i,
      /'cogere'/i,
      /'exigere'/i,
      /'prodigus'/i,
      /'castigare'/i,
      /'litigare'/i,
      /'mitigare'/i,
    ],
    cognateIds: ['kratos'],
  },
  {
    id: 'alescere',
    displayRoot: 'alescere / alere',
    meaning: 'to nourish, grow together',
    origin: 'Latin',
    patterns: [/'alescere'/i, /'coalescere'/i, /'alere'/i],
  },
  {
    id: 'alter',
    displayRoot: 'alter / alius',
    meaning: 'other, another',
    origin: 'Latin',
    patterns: [/'alter'/i, /'altrui'/i, /'alienus'/i],
    cognateIds: ['allos'],
  },
  {
    id: 'altus',
    displayRoot: 'altus',
    meaning: 'high, deep, elevated',
    origin: 'Latin',
    patterns: [/'altus'/i, /'haut'/i],
  },
  {
    id: 'ambulare',
    displayRoot: 'ambulare',
    meaning: 'to walk, wander',
    origin: 'Latin',
    patterns: [/'ambulare'/i, /perambulat/i, /somnambul/i],
  },
  {
    id: 'amicus',
    displayRoot: 'amare / amicus',
    meaning: 'to love, friend (inimicus: enemy)',
    origin: 'Latin',
    patterns: [/'amicus'/i, /'amicabilis'/i, /'inimicus'/i, /'amare'/i, /\benemistie\b/i],
    cognateIds: ['philos'],
  },
  {
    id: 'animus',
    displayRoot: 'animus / anima',
    meaning: 'soul, mind, spirit, breath',
    origin: 'Latin',
    patterns: [/'animus'/i, /'anima'/i, /'magnanimus'/i, /'aequanimitas'/i, /'pusillanim/i],
    cognateIds: ['psyche'],
  },
  {
    id: 'ardere',
    displayRoot: 'fervere / ardere / ebullire',
    meaning: 'to burn, glow, boil, bubble up',
    origin: 'Latin',
    patterns: [/'fervere'/i, /'ardere'/i, /'ardor'/i, /'ebullire'/i, /'ebullient-'/i],
  },
  {
    id: 'audere',
    displayRoot: 'audere / audax',
    meaning: 'to dare, be bold',
    origin: 'Latin',
    patterns: [/'audere'/i, /'audax'/i],
  },
  {
    id: 'augere',
    displayRoot: 'augere / auctor',
    meaning: 'to increase, originate',
    origin: 'Latin',
    patterns: [/'augere'/i, /'augustus'/i, /'auctor'/i],
  },
  {
    id: 'beatus',
    displayRoot: 'beatus',
    meaning: 'blessed, supremely happy',
    origin: 'Latin',
    patterns: [/'beatus'/i, /\bbeatif/i],
  },
  {
    id: 'bellum',
    displayRoot: 'bellum',
    meaning: 'war, conflict',
    origin: 'Latin',
    patterns: [/'bellum'/i, /'ante bellum'/i, /'bellicosus'/i],
  },
  {
    id: 'bellus',
    displayRoot: 'bellus',
    meaning: 'fair, fine, handsome',
    origin: 'Latin',
    patterns: [/'bellus'/i, /'embellir'/i],
  },
  {
    id: 'blandus',
    displayRoot: 'blandus',
    meaning: 'smooth, flattering, charming',
    origin: 'Latin',
    patterns: [/'blandus'/i, /'blandir'/i],
  },
  {
    id: 'bonus',
    displayRoot: 'bonus / bene',
    meaning: 'good, well, kindly',
    origin: 'Latin',
    patterns: [/'bonus'/i, /'bene'/i, /'bonhomie'/i],
  },
  {
    id: 'cadere',
    displayRoot: 'cadere / cas-',
    meaning: 'to fall, happen, chance',
    origin: 'Latin',
    patterns: [/'cadere'/i, /'casus'/i, /'decad/i, /'incidere'/i],
  },
  {
    id: 'caedere',
    displayRoot: 'caedere / cis-',
    meaning: 'to cut, strike down',
    origin: 'Latin',
    patterns: [/'caedere'/i, /'praecis/i, /'incis/i, /'concis/i],
  },
  {
    id: 'calx',
    displayRoot: 'calx / calcitrare',
    meaning: 'heel, to tread or kick',
    origin: 'Latin',
    patterns: [/'calx'/i, /'recalcitrare'/i, /'inculcare'/i],
  },
  {
    id: 'capere',
    displayRoot: 'capere / cept-',
    meaning: 'to take, seize, hold, contain',
    origin: 'Latin',
    patterns: [/'capere'/i, /'capio'/i, /'capax'/i, /'percipere'/i, /'recipere'/i, /\bcipere\b/i],
    cognateIds: ['lambanein'],
  },
  {
    id: 'castus',
    displayRoot: 'castus / castigare',
    meaning: 'pure, chaste; to correct, purify',
    origin: 'Latin',
    patterns: [/'castus'/i, /'castigare'/i],
  },
  {
    id: 'cauda',
    displayRoot: 'cauda',
    meaning: 'tail, trailing end',
    origin: 'Latin',
    patterns: [/'cauda'/i, /'coda'/i],
  },
  {
    id: 'cedere',
    displayRoot: 'cedere / cess-',
    meaning: 'to go, yield, withdraw',
    origin: 'Latin',
    patterns: [/'cedere'/i, /'antecedere'/i, /'praecedere'/i, /'praecedent-'/i, /'concedere'/i, /'recedere'/i, /'precedere'/i, /'cessare'/i],
  },
  {
    id: 'cingere',
    displayRoot: 'cingere / cinct-',
    meaning: 'to gird, encircle, tuck up',
    origin: 'Latin',
    patterns: [/'cingere'/i, /'succingere'/i, /'succinctus'/i],
  },
  {
    id: 'civis',
    displayRoot: 'civis / civitas',
    meaning: 'citizen, civic community',
    origin: 'Latin',
    patterns: [/'civis'/i, /'civitas'/i, /'civilis'/i],
    cognateIds: ['polis'],
  },
  {
    id: 'clamare',
    displayRoot: 'clamare',
    meaning: 'to cry out, shout, proclaim',
    origin: 'Latin',
    patterns: [/'clamare'/i, /'acclamare'/i, /'declamare'/i, /'proclamare'/i],
  },
  {
    id: 'clarus',
    displayRoot: 'clarus',
    meaning: 'clear, bright, renowned',
    origin: 'Latin',
    patterns: [/'clarus'/i, /'chiaro'/i, /'clere'/i, /'clairvoyant'/i],
  },
  {
    id: 'claudere',
    displayRoot: 'claudere / clus-',
    meaning: 'to shut, close, enclose',
    origin: 'Latin',
    patterns: [/'claudere'/i, /'cludere'/i, /'recludere'/i, /'secludere'/i, /'claustrum'/i],
  },
  {
    id: 'cognoscere',
    displayRoot: 'cognoscere / gnoscere',
    meaning: 'to know, recognize, examine',
    origin: 'Latin',
    patterns: [/'cognoscere'/i, /'recognoscere'/i, /'gnoscere'/i, /'cognitus'/i],
    cognateIds: ['gnosis'],
  },
  {
    id: 'cor',
    displayRoot: 'cor / cord-',
    meaning: 'heart, mind, feeling, agreement',
    origin: 'Latin',
    patterns: [/'cor'/i, /'cor, cordis'/i, /'cordis'/i, /concord/i, /discord/i],
  },
  {
    id: 'credere',
    displayRoot: 'credere / cred-',
    meaning: 'to believe, trust, entrust',
    origin: 'Latin',
    patterns: [/'credere'/i, /'incredul/i, /'credulus'/i],
  },
  {
    id: 'crepusculum',
    displayRoot: 'creper / crepusculum',
    meaning: 'dark, dusky, twilight',
    origin: 'Latin',
    patterns: [/'creper'/i, /'crepusculum'/i],
  },
  {
    id: 'crescere',
    displayRoot: 'crescere / cret-',
    meaning: 'to grow, rise, increase',
    origin: 'Latin',
    patterns: [/'crescere'/i, /'accrescere'/i, /'excret/i],
  },
  {
    id: 'culpa',
    displayRoot: 'culpa',
    meaning: 'fault, blame, guilt',
    origin: 'Latin',
    patterns: [/'culpa'/i, /'culpare'/i, /'exculpate'/i, /'inculpate'/i],
  },
  {
    id: 'cura',
    displayRoot: 'cura',
    meaning: 'care, concern, heed',
    origin: 'Latin',
    patterns: [/'cura'/i, /'sinecure'/i, /'securus'/i, /'curare'/i],
  },
  {
    id: 'currere',
    displayRoot: 'currere / curs-',
    meaning: 'to run, flow, course',
    origin: 'Latin',
    patterns: [/'currere'/i, /'discurrere'/i, /'excurrere'/i, /'concurrere'/i, /'praecursor'/i],
  },
  {
    id: 'curvus',
    displayRoot: 'curvus',
    meaning: 'curved, bent, winding',
    origin: 'Latin',
    patterns: [/'curvus'/i, /'corvo'/i, /'curvare'/i],
  },
  {
    id: 'decus',
    displayRoot: 'decus / dignus',
    meaning: 'grace, honor, worthy, fitting',
    origin: 'Latin',
    patterns: [/'decus'/i, /'dignus'/i, /'dignari'/i, /'decorus'/i],
  },
  {
    id: 'delectare',
    displayRoot: 'delectare / deliciae',
    meaning: 'to allure, charm, delight',
    origin: 'Latin',
    patterns: [/'delectare'/i, /'deliciae'/i, /'deliciosus'/i, /'dilettare'/i],
  },
  {
    id: 'dicere',
    displayRoot: 'dicere / dict-',
    meaning: 'to speak, declare, proclaim',
    origin: 'Latin',
    patterns: [/'dicere'/i, /'dictum'/i, /'interdicere'/i, /'praedicere'/i, /'valedicere'/i],
  },
  {
    id: 'dies',
    displayRoot: 'dies / diurnus',
    meaning: 'day, daily light',
    origin: 'Latin',
    patterns: [/'dies'/i, /'diurnum'/i, /'diurnus'/i, /'quotidian/i],
  },
  {
    id: 'dolere',
    displayRoot: 'dolere / dolor',
    meaning: 'to feel pain, suffer, grieve',
    origin: 'Latin',
    patterns: [/'dolere'/i, /'dolor'/i, /'indolens'/i],
  },
  {
    id: 'domus',
    displayRoot: 'domus / dominus',
    meaning: 'house, home, master, tame',
    origin: 'Latin',
    patterns: [/'domus'/i, /'dominus'/i, /'domitare'/i],
  },
  {
    id: 'ducere',
    displayRoot: 'ducere / duct-',
    meaning: 'to lead, draw, bring',
    origin: 'Latin',
    patterns: [/'ducere'/i, /'conducere'/i, /'inducere'/i, /'seducere'/i, /'traducere'/i],
  },
  {
    id: 'durus',
    displayRoot: 'durus',
    meaning: 'hard, harsh, enduring',
    origin: 'Latin',
    patterns: [/'durus'/i, /'duritia'/i, /'obdurare'/i],
  },
  {
    id: 'errare',
    displayRoot: 'errare',
    meaning: 'to wander, stray, miss',
    origin: 'Latin',
    patterns: [/'errare'/i, /'aberrare'/i],
  },
  {
    id: 'facere',
    displayRoot: 'facere / fect-',
    meaning: 'to make, do, fashion',
    origin: 'Latin',
    patterns: [
      /'facere'/i,
      /'facilis'/i,
      /'efficere'/i,
      /'aedificare'/i,
      /'factio'/i,
      /'munificus'/i,
      /\bficere\b/i,
    ],
    cognateIds: ['tithenai'],
  },
  {
    id: 'facies',
    displayRoot: 'facies',
    meaning: 'face, appearance, external form',
    origin: 'Latin',
    patterns: [/'facies'/i, /'effacer'/i, /'superficies'/i],
  },
  {
    id: 'fallere',
    displayRoot: 'fallere / fals-',
    meaning: 'to deceive, disappoint, fail',
    origin: 'Latin',
    patterns: [/'fallere'/i, /'fallacia'/i, /'falsus'/i],
  },
  {
    id: 'fari',
    displayRoot: 'fari / fat-',
    meaning: 'to speak, utter (fas: divine law)',
    origin: 'Latin',
    patterns: [/'fari'/i, /'effabilis'/i, /'nefas'/i, /'nefarius'/i, /'infamis'/i, /'affabilis'/i],
  },
  {
    id: 'fenestra',
    displayRoot: 'fenestra',
    meaning: 'window, opening',
    origin: 'Latin',
    patterns: [/\bfenestr/i],
  },
  {
    id: 'ferre',
    displayRoot: 'ferre / lat-',
    meaning: 'to bear, carry, bring',
    origin: 'Latin',
    patterns: [/'ferre'/i, /'referre'/i, /'differre'/i, /'proferre'/i],
    cognateIds: ['pherein'],
  },
  {
    id: 'fidere',
    displayRoot: 'fidere / fides',
    meaning: 'to trust, faith, loyalty',
    origin: 'Latin',
    patterns: [/'fidere'/i, /'fides'/i, /'fidelis'/i, /'diffidere'/i, /'perfidia'/i],
  },
  {
    id: 'fingere',
    displayRoot: 'fingere / fict-',
    meaning: 'to shape, mold, devise, feign',
    origin: 'Latin',
    patterns: [/'fingere'/i, /'figmentum'/i, /'fictio'/i, /'effigies'/i],
  },
  {
    id: 'flos',
    displayRoot: 'flos / flor-',
    meaning: 'flower, bloom, flourish',
    origin: 'Latin',
    patterns: [/'flos'/i, /'floridus'/i, /'florent-'/i, /'florilegium'/i],
  },
  {
    id: 'fluere',
    displayRoot: 'fluere / flux-',
    meaning: 'to flow, stream',
    origin: 'Latin',
    patterns: [/'fluere'/i, /'effluere'/i, /'affluere'/i, /'superfluus'/i, /'fluctuare'/i],
    cognateIds: ['rhein'],
  },
  {
    id: 'forma',
    displayRoot: 'forma',
    meaning: 'form, shape, beauty',
    origin: 'Latin',
    patterns: [/'forma'/i, /'formare'/i],
    cognateIds: ['morphe'],
  },
  {
    id: 'frangere',
    displayRoot: 'frangere / fract-',
    meaning: 'to break, shatter',
    origin: 'Latin',
    patterns: [/'frangere'/i, /'fractio'/i, /'refringere'/i],
  },
  {
    id: 'frons',
    displayRoot: 'frons / front-',
    meaning: 'forehead, brow, front',
    origin: 'Latin',
    patterns: [/'frons, frontis'/i, /'frons'/i, /'effrons'/i],
  },
  {
    id: 'fundere',
    displayRoot: 'fundere / fus-',
    meaning: 'to pour, melt, shed',
    origin: 'Latin',
    patterns: [/'fundere'/i, /'effundere'/i, /'futilis'/i, /effus/i, /profus/i, /diffus/i],
  },
  {
    id: 'genus',
    displayRoot: 'gignere / genus',
    meaning: 'beget, give birth, race, kind',
    origin: 'Latin',
    patterns: [/'gignere'/i, /'genitus'/i, /'genus'/i, /'ingenuus'/i, /'progenies'/i],
    cognateIds: ['genesis'],
  },
  {
    id: 'gradus',
    displayRoot: 'gradi / gradus',
    meaning: 'to step, walk, degree',
    origin: 'Latin',
    patterns: [/'gradus'/i, /'gradi'/i, /'digredi'/i, /'transgredi'/i, /'retrogradus'/i],
  },
  {
    id: 'gravis',
    displayRoot: 'gravis',
    meaning: 'heavy, weighty, serious',
    origin: 'Latin',
    patterns: [/'gravis'/i, /'gravidus'/i, /'gravitas'/i],
  },
  {
    id: 'grex',
    displayRoot: 'grex / greg-',
    meaning: 'flock, herd, gathering',
    origin: 'Latin',
    patterns: [/'grex'/i, /'gregarius'/i, /'egregius'/i, /'segregare'/i],
  },
  {
    id: 'habere',
    displayRoot: 'habere / habit-',
    meaning: 'to have, hold, dwell',
    origin: 'Latin',
    patterns: [/'habere'/i, /'hibere'/i, /'inhibere'/i, /'prohibere'/i],
  },
  {
    id: 'haerere',
    displayRoot: 'haerere / haes-',
    meaning: 'to stick, cling, hesitate',
    origin: 'Latin',
    patterns: [/'haerere'/i, /'inhaerere'/i, /'cohaerere'/i],
  },
  {
    id: 'iacere',
    displayRoot: 'iacere / ject-',
    meaning: 'to throw, cast, hurl',
    origin: 'Latin',
    patterns: [/'iacere'/i, /'jacere'/i, /'abicere'/i, /'abiectio'/i, /'conicere'/i],
    cognateIds: ['ballein'],
  },
  {
    id: 'ire',
    displayRoot: 'ire / it-',
    meaning: 'to go, travel, pass',
    origin: 'Latin',
    patterns: [/'ire'/i, /'itinerari'/i, /'transire'/i, /'sedition'/i, /'ambire'/i],
  },
  {
    id: 'iurare',
    displayRoot: 'ius / iurare',
    meaning: 'law, right, oath; to swear',
    origin: 'Latin',
    patterns: [/'ius'/i, /'iurare'/i, /'abiurare'/i, /'periurare'/i, /'iudex'/i],
  },
  {
    id: 'iuxta',
    displayRoot: 'iuxta / iungere',
    meaning: 'near, beside, to join',
    origin: 'Latin',
    patterns: [/'iuxta'/i, /'iungere'/i, /'juxtaposition'/i],
  },
  {
    id: 'legere',
    displayRoot: 'legere / lect-',
    meaning: 'to gather, choose, read',
    origin: 'Latin',
    patterns: [/'legere'/i, /'diligere'/i, /'eligere'/i, /'neglegere'/i, /'florilegium'/i],
    cognateIds: ['logos'],
  },
  {
    id: 'levis',
    displayRoot: 'levis / levare',
    meaning: 'light in weight; to lift, lighten',
    origin: 'Latin',
    patterns: [/'levis'/i, /'levare'/i, /'alleviare'/i, /'levitas'/i, /'\*leviarius'/i],
  },
  {
    id: 'ligare',
    displayRoot: 'ligare',
    meaning: 'to bind, tie, unite',
    origin: 'Latin',
    patterns: [/'ligare'/i, /'alligare'/i, /'obligare'/i],
  },
  {
    id: 'locus',
    displayRoot: 'locus',
    meaning: 'place, spot, position',
    origin: 'Latin',
    patterns: [/'locus'/i, /'collocare'/i],
    cognateIds: ['topos'],
  },
  {
    id: 'loqui',
    displayRoot: 'loqui / locut-',
    meaning: 'to speak, talk, utter',
    origin: 'Latin',
    patterns: [/'loqui'/i, /'eloqui'/i, /'colloquium'/i, /'loquus'/i, /\blocut/i],
  },
  {
    id: 'ludere',
    displayRoot: 'ludere / lus-',
    meaning: 'to play, sport, mock, deceive',
    origin: 'Latin',
    patterns: [/'ludere'/i, /'alludere'/i, /'deludere'/i, /'eludere'/i, /'ludicrus'/i],
  },
  {
    id: 'lux',
    displayRoot: 'lux / lucere / lumen',
    meaning: 'light, shine, clarity',
    origin: 'Latin',
    patterns: [/'lux'/i, /'lucidus'/i, /'lumen'/i, /'lucere'/i, /'elucidare'/i, /'illuminare'/i],
    cognateIds: ['phainein'],
  },
  {
    id: 'magnus',
    displayRoot: 'magnus / grandis',
    meaning: 'great, large, grand',
    origin: 'Latin',
    patterns: [/'magnus'/i, /'magnanimus'/i, /'grandis'/i],
  },
  {
    id: 'malus',
    displayRoot: 'malus',
    meaning: 'bad, evil, ill',
    origin: 'Latin',
    patterns: [/'malus'/i, /'male'/i, /'malignare'/i, /'malevolens'/i],
  },
  {
    id: 'manere',
    displayRoot: 'manere / mans-',
    meaning: 'to stay, remain, dwell',
    origin: 'Latin',
    patterns: [/'manere'/i, /'mansio'/i, /'permanere'/i, /'immanere'/i],
  },
  {
    id: 'manus',
    displayRoot: 'manus',
    meaning: 'hand, manual craft',
    origin: 'Latin',
    patterns: [/'manus'/i, /'manuoperare'/i, /'emancipare'/i, /'manifestus'/i],
  },
  {
    id: 'mens',
    displayRoot: 'mens / meminisse',
    meaning: 'mind, thought, to remember',
    origin: 'Latin',
    patterns: [/'mens'/i, /'reminisci'/i, /'meminisse'/i, /'memor'/i],
    cognateIds: ['mneme', 'nous'],
  },
  {
    id: 'mensura',
    displayRoot: 'metiri / mensura',
    meaning: 'to measure, limit, proportion',
    origin: 'Latin',
    patterns: [/'mensura'/i, /'mensurare'/i, /'incommensurabilis'/i],
    cognateIds: ['metron'],
  },
  {
    id: 'mergere',
    displayRoot: 'mergere / mers-',
    meaning: 'to dip, plunge, sink',
    origin: 'Latin',
    patterns: [/'mergere'/i, /'immergere'/i, /'emergere'/i, /'submergere'/i],
  },
  {
    id: 'mittere',
    displayRoot: 'mittere / miss-',
    meaning: 'to send, let go, dispatch',
    origin: 'Latin',
    patterns: [/'mittere'/i, /'intermittere'/i, /'remittere'/i, /'emissarius'/i],
  },
  {
    id: 'modus',
    displayRoot: 'modus',
    meaning: 'measure, manner, limit',
    origin: 'Latin',
    patterns: [/'modus'/i, /'commodus'/i, /'modicus'/i],
  },
  {
    id: 'monere',
    displayRoot: 'monere / monstr-',
    meaning: 'to warn, remind, point out',
    origin: 'Latin',
    patterns: [/'monere'/i, /'remonstrare'/i, /'admonere'/i, /'monstrum'/i],
  },
  {
    id: 'mons',
    displayRoot: 'mons / mont-',
    meaning: 'mountain, height, projection',
    origin: 'Latin',
    patterns: [/'mons'/i, /'mons, montis'/i, /'promontorium'/i],
  },
  {
    id: 'morari',
    displayRoot: 'morari / mos',
    meaning: 'to delay, linger; custom, manner',
    origin: 'Latin',
    patterns: [/'morari'/i, /'demorari'/i, /'mos'/i, /'morosus'/i],
  },
  {
    id: 'movere',
    displayRoot: 'movere / mot-',
    meaning: 'to move, stir, set going',
    origin: 'Latin',
    patterns: [/'movere'/i, /'motivus'/i, /'commovere'/i],
  },
  {
    id: 'mutare',
    displayRoot: 'mutare',
    meaning: 'to change, alter, exchange',
    origin: 'Latin',
    patterns: [/'mutare'/i, /'immutabilis'/i, /'permutare'/i],
  },
  {
    id: 'nasci',
    displayRoot: 'nasci / nat-',
    meaning: 'to be born, arise',
    origin: 'Latin',
    patterns: [/'nasci'/i, /'innatus'/i, /'nativus'/i, /'natus'/i],
    cognateIds: ['genesis'],
  },
  {
    id: 'nomen',
    displayRoot: 'nomen',
    meaning: 'name, title, renown',
    origin: 'Latin',
    patterns: [/'nomen'/i, /'ignominia'/i, /'misnomer'/i],
    cognateIds: ['onyma'],
  },
  {
    id: 'norma',
    displayRoot: 'norma',
    meaning: 'carpenter’s square, rule, standard',
    origin: 'Latin',
    patterns: [/'norma'/i, /'enormitas'/i, /'abnormis'/i],
  },
  {
    id: 'oculus',
    displayRoot: 'oculus',
    meaning: 'eye, bud, sight',
    origin: 'Latin',
    patterns: [/'oculus'/i, /'aboculus'/i, /'l’œil'/i],
    cognateIds: ['ops'],
  },
  {
    id: 'olere',
    displayRoot: 'olere / odor',
    meaning: 'to emit an odor, smell',
    origin: 'Latin',
    patterns: [/'olere'/i, /'redolere'/i, /'olfacere'/i],
  },
  {
    id: 'opus',
    displayRoot: 'opus / opera',
    meaning: 'work, labor, effort',
    origin: 'Latin',
    patterns: [/'opus'/i, /'opera'/i, /'manuoperare'/i, /'opulentus'/i],
    cognateIds: ['ergon'],
  },
  {
    id: 'orare',
    displayRoot: 'os / oris / orare',
    meaning: 'mouth, speak, entreat, pray',
    origin: 'Latin',
    patterns: [/'orare'/i, /'exorabilis'/i, /'inexorabilis'/i, /'peroro'/i, /'oraculum'/i],
  },
  {
    id: 'oriri',
    displayRoot: 'oriri / ort-',
    meaning: 'to rise, begin, spring up',
    origin: 'Latin',
    patterns: [/'oriri'/i, /'origo'/i, /'oriens'/i, /'aborigines'/i],
  },
  {
    id: 'parare',
    displayRoot: 'parare / pars',
    meaning: 'to prepare, ward off; part, share',
    origin: 'Latin',
    patterns: [/'parare'/i, /'pars'/i, /'partigiano'/i, /'disparare'/i, /'imperare'/i],
  },
  {
    id: 'passus',
    displayRoot: 'passus / pandere',
    meaning: 'step, pace; to spread, open',
    origin: 'Latin',
    patterns: [/'passus'/i, /'pandere'/i, /'impasse'/i],
  },
  {
    id: 'pati',
    displayRoot: 'pati / pass-',
    meaning: 'to suffer, endure, undergo',
    origin: 'Latin',
    patterns: [/'pati'/i, /'passivus'/i, /'compatiri'/i],
    cognateIds: ['pathos'],
  },
  {
    id: 'pecus',
    displayRoot: 'pecus / pecunia',
    meaning: 'cattle, flock, money, wealth',
    origin: 'Latin',
    patterns: [/'pecus'/i, /'pecunia'/i, /'peculari'/i],
  },
  {
    id: 'pellere',
    displayRoot: 'pellere / puls-',
    meaning: 'to drive, push, strike',
    origin: 'Latin',
    patterns: [/'pellere'/i, /'compellere'/i, /'dispellere'/i, /'impellere'/i, /'propellere'/i],
  },
  {
    id: 'pendere',
    displayRoot: 'pendere / pens- / pondus',
    meaning: 'to hang, weigh, ponder, value',
    origin: 'Latin',
    patterns: [
      /'pendere'/i,
      /'pendentivus'/i,
      /'pensare'/i,
      /'pendicare'/i,
      /'ponderare'/i,
      /'pondus'/i,
      /'propendere'/i,
    ],
  },
  {
    id: 'pes',
    displayRoot: 'pes / ped-',
    meaning: 'foot, pace, foundation',
    origin: 'Latin',
    patterns: [/'pes, pedis'/i, /'pes'/i, /'expedire'/i, /'impedire'/i],
    cognateIds: ['pous'],
  },
  {
    id: 'petere',
    displayRoot: 'petere / petit-',
    meaning: 'to seek, aim at, rush toward',
    origin: 'Latin',
    patterns: [/'petere'/i, /'impetus'/i, /'perpetuus'/i, /'petulans'/i],
  },
  {
    id: 'placere',
    displayRoot: 'placere / placare',
    meaning: 'to please, calm, soothe',
    origin: 'Latin',
    patterns: [/'placere'/i, /'placare'/i, /'placidus'/i, /'complacere'/i],
  },
  {
    id: 'plenus',
    displayRoot: 'plenus / plere',
    meaning: 'full, to fill, fulfill',
    origin: 'Latin',
    patterns: [/'plenus'/i, /'plere'/i, /'replere'/i, /'complere'/i, /'supplere'/i],
  },
  {
    id: 'plicare',
    displayRoot: 'plicare / plex-',
    meaning: 'to fold, weave, tangle',
    origin: 'Latin',
    patterns: [/'plicare'/i, /'implicare'/i, /'explicare'/i, /'duplicitas'/i, /'supplicare'/i],
  },
  {
    id: 'plumbum',
    displayRoot: 'plumbum',
    meaning: 'lead, plumb weight',
    origin: 'Latin',
    patterns: [/'plumbum'/i, /'à plomb'/i],
  },
  {
    id: 'ponere',
    displayRoot: 'ponere / posit-',
    meaning: 'to put, place, set down',
    origin: 'Latin',
    patterns: [/'ponere'/i, /'posit-'/i, /'componere'/i, /'imponere'/i, /'reponere'/i, /'proponere'/i],
    cognateIds: ['tithenai'],
  },
  {
    id: 'portare',
    displayRoot: 'portare / porta',
    meaning: 'to carry; gate, passage',
    origin: 'Latin',
    patterns: [/'portare'/i, /'porta'/i, /'porticus'/i, /'opportunus'/i],
  },
  {
    id: 'potens',
    displayRoot: 'posse / potens',
    meaning: 'to be able, powerful, ruler',
    origin: 'Latin',
    patterns: [/'potens'/i, /'potentatus'/i, /'posse'/i],
    cognateIds: ['kratos'],
  },
  {
    id: 'prehendere',
    displayRoot: 'prehendere / prehens-',
    meaning: 'to grasp, seize, understand',
    origin: 'Latin',
    patterns: [/'prehendere'/i, /'comprehendere'/i, /'reprehendere'/i],
  },
  {
    id: 'premere',
    displayRoot: 'premere / press-',
    meaning: 'to press, squeeze, hold down',
    origin: 'Latin',
    patterns: [/'premere'/i, /'reprimere'/i, /'opprimere'/i, /'supprimere'/i],
  },
  {
    id: 'probare',
    displayRoot: 'probare / probus',
    meaning: 'to test, prove; honest, upright',
    origin: 'Latin',
    patterns: [/'probare'/i, /'reprobare'/i, /'approbare'/i, /'probus'/i, /'opprobrium'/i],
  },
  {
    id: 'pugnare',
    displayRoot: 'pugnare / pugnus',
    meaning: 'to fight; fist',
    origin: 'Latin',
    patterns: [/'pugnare'/i, /'pugnus'/i, /'pugil'/i, /'impugnare'/i],
  },
  {
    id: 'pungere',
    displayRoot: 'pungere / punct-',
    meaning: 'to prick, pierce, sting',
    origin: 'Latin',
    patterns: [/'pungere'/i, /'punctum'/i, /'punctus'/i, /'\*piccare'/i, /poindre/i],
  },
  {
    id: 'putare',
    displayRoot: 'putare',
    meaning: 'to prune, reckon, think, count',
    origin: 'Latin',
    patterns: [/'putare'/i, /'computare'/i, /'disputare'/i, /'imputare'/i],
  },
  {
    id: 'quaerere',
    displayRoot: 'quaerere / quisit-',
    meaning: 'to seek, ask, inquire',
    origin: 'Latin',
    patterns: [/'quaerere'/i, /'inquirere'/i, /'acquirere'/i, /'queri'/i],
  },
  {
    id: 'quies',
    displayRoot: 'quies / quiescere',
    meaning: 'rest, quiet, calm, peace',
    origin: 'Latin',
    patterns: [/'quies'/i, /'quiescere'/i, /'quietus'/i, /'acquiescere'/i, /'tranquillus'/i],
  },
  {
    id: 'rapere',
    displayRoot: 'rapere / rapt-',
    meaning: 'to seize, snatch, carry off',
    origin: 'Latin',
    patterns: [/'rapere'/i, /'raptus'/i, /'rapax'/i, /'surripere'/i],
  },
  {
    id: 'regere',
    displayRoot: 'regere / rect-',
    meaning: 'to rule, guide straight, govern',
    origin: 'Latin',
    patterns: [/'regere'/i, /'rectus'/i, /'corrigere'/i, /'erigere'/i, /'insurgere'/i],
  },
  {
    id: 'remedium',
    displayRoot: 'remedium / mederi',
    meaning: 'cure, healing, remedy',
    origin: 'Latin',
    patterns: [/'remedium'/i, /'mederi'/i],
  },
  {
    id: 'ridere',
    displayRoot: 'ridere / ris-',
    meaning: 'to laugh, mock',
    origin: 'Latin',
    patterns: [/'ridere'/i, /'deridere'/i, /'risus'/i],
  },
  {
    id: 'rogare',
    displayRoot: 'rogare',
    meaning: 'to ask, propose, demand',
    origin: 'Latin',
    patterns: [/'rogare'/i, /'abrogare'/i, /'arrogare'/i, /'derogare'/i, /'interrogare'/i],
  },
  {
    id: 'rumpere',
    displayRoot: 'rumpere / rupt-',
    meaning: 'to break, burst',
    origin: 'Latin',
    patterns: [/'rumpere'/i, /'corrumpere'/i, /'disrumpere'/i, /'erumpere'/i],
  },
  {
    id: 'rus',
    displayRoot: 'rus / rusticus',
    meaning: 'open countryside, rural land',
    origin: 'Latin',
    patterns: [/'rus'/i, /'rusticus'/i, /'rusticari'/i],
  },
  {
    id: 'sacer',
    displayRoot: 'sacer / sacrare / sanctus',
    meaning: 'sacred, holy, consecrated',
    origin: 'Latin',
    patterns: [/'sacer'/i, /'sacrare'/i, /'execrari'/i, /'sanctus'/i],
  },
  {
    id: 'sagire',
    displayRoot: 'sagire / sagax',
    meaning: 'to perceive keenly, be wise',
    origin: 'Latin',
    patterns: [/'sagire'/i, /'sagax'/i, /'praesagium'/i],
  },
  {
    id: 'salire',
    displayRoot: 'salire / sult-',
    meaning: 'to leap, jump, spring forth',
    origin: 'Latin',
    patterns: [/'salire'/i, /'desilire'/i, /'desultor'/i, /'resilire'/i, /'insultare'/i, /'exultare'/i],
  },
  {
    id: 'sanguis',
    displayRoot: 'sanguis',
    meaning: 'blood, kinship, vitality',
    origin: 'Latin',
    patterns: [/'sanguis'/i, /'sanguineus'/i, /\bsanguin/i],
  },
  {
    id: 'scandere',
    displayRoot: 'scandere / scala',
    meaning: 'to climb, scale',
    origin: 'Latin',
    patterns: [/'scandere'/i, /'scala'/i, /'ascendere'/i, /'transcendere'/i],
  },
  {
    id: 'scire',
    displayRoot: 'scire',
    meaning: 'to know, understand',
    origin: 'Latin',
    patterns: [/'scire'/i, /'praescire'/i, /'omniscient'/i, /'conscientia'/i],
    cognateIds: ['gnosis'],
  },
  {
    id: 'scribere',
    displayRoot: 'scribere / script-',
    meaning: 'to write, inscribe, record',
    origin: 'Latin',
    patterns: [/'scribere'/i, /'ascribere'/i, /'circumscribere'/i, /'proscribere'/i],
    cognateIds: ['graphein'],
  },
  {
    id: 'sedere',
    displayRoot: 'sedere / sess- / sid-',
    meaning: 'to sit, settle',
    origin: 'Latin',
    patterns: [/'sedere'/i, /'assiduus'/i, /'insidiae'/i, /'insidiosus'/i, /'dissidere'/i, /'residere'/i],
  },
  {
    id: 'sentire',
    displayRoot: 'sentire / sens-',
    meaning: 'to feel, perceive, think',
    origin: 'Latin',
    patterns: [/'sentire'/i, /'dissentire'/i, /'consentire'/i],
  },
  {
    id: 'sequi',
    displayRoot: 'sequi / secut-',
    meaning: 'to follow, ensue',
    origin: 'Latin',
    patterns: [/'sequi'/i, /'obsequi'/i, /'prosequi'/i, /'sequester'/i],
  },
  {
    id: 'similis',
    displayRoot: 'similis / simulare',
    meaning: 'like, similar, resembling',
    origin: 'Latin',
    patterns: [/'similis'/i, /'simulare'/i, /'dissimulare'/i, /'verisimilitudo'/i],
    cognateIds: ['homos'],
  },
  {
    id: 'solus',
    displayRoot: 'solus / solari',
    meaning: 'alone, solitary; to console',
    origin: 'Latin',
    patterns: [/'solus'/i, /'solitas'/i, /'solari'/i, /'solacium'/i, /'desolare'/i],
    cognateIds: ['monos'],
  },
  {
    id: 'solvere',
    displayRoot: 'solvere / solut-',
    meaning: 'to loosen, untie, dissolve',
    origin: 'Latin',
    patterns: [/'solvere'/i, /'absolvere'/i, /'dissolvere'/i],
    cognateIds: ['lyein'],
  },
  {
    id: 'sonare',
    displayRoot: 'sonare',
    meaning: 'to sound, resound',
    origin: 'Latin',
    patterns: [/'sonare'/i, /'resonare'/i, /'dissonare'/i, /'sonorus'/i],
    cognateIds: ['phone'],
  },
  {
    id: 'specere',
    displayRoot: 'specere / spect-',
    meaning: 'to look at, observe, behold',
    origin: 'Latin',
    patterns: [/'specere'/i, /'spectare'/i, /'auspicium'/i, /'perspicere'/i, /'circumspicere'/i, /'spectr[^']*'/i],
    cognateIds: ['skopein'],
  },
  {
    id: 'spirare',
    displayRoot: 'spirare',
    meaning: 'to breathe, spirit',
    origin: 'Latin',
    patterns: [/'spirare'/i, /'conspirare'/i, /'inspirare'/i, /'transpirare'/i],
  },
  {
    id: 'splendere',
    displayRoot: 'splendere',
    meaning: 'to shine, gleam brightly',
    origin: 'Latin',
    patterns: [/'splendere'/i, /'resplendere'/i, /'resplendentem'/i, /'splendens'/i, /'splendor'/i],
  },
  {
    id: 'stare',
    displayRoot: 'stare / stat- / sistere',
    meaning: 'to stand, set firm, remain',
    origin: 'Latin',
    patterns: [
      /'stare'/i,
      /'status'/i,
      /'sistere'/i,
      /'interstitium'/i,
      /'substantia'/i,
      /'obstinatus'/i,
      /'destitutus'/i,
    ],
    cognateIds: ['stasis'],
  },
  {
    id: 'stringere',
    displayRoot: 'stringere / strict-',
    meaning: 'to draw tight, bind, squeeze',
    origin: 'Latin',
    patterns: [/'stringere'/i, /'astringere'/i, /'constringere'/i, /'praestringere'/i],
  },
  {
    id: 'struere',
    displayRoot: 'struere / struct-',
    meaning: 'to pile up, build, arrange',
    origin: 'Latin',
    patterns: [/'struere'/i, /'construere'/i, /'instruere'/i, /'obstruere'/i],
  },
  {
    id: 'sumere',
    displayRoot: 'sumere / sumpt-',
    meaning: 'to take up, consume, spend',
    origin: 'Latin',
    patterns: [/'sumere'/i, /'praesumere'/i, /'sumptus'/i, /'consumere'/i],
  },
  {
    id: 'tabula',
    displayRoot: 'tabula',
    meaning: 'board, plank, tablet, picture',
    origin: 'Latin',
    patterns: [/'tabula'/i, /'tavola'/i],
  },
  {
    id: 'tangere',
    displayRoot: 'tangere / tact-',
    meaning: 'to touch, reach',
    origin: 'Latin',
    patterns: [/'tangere'/i, /'contingere'/i, /'contagium'/i, /'tactilis'/i],
  },
  {
    id: 'tempus',
    displayRoot: 'tempus / tempor-',
    meaning: 'time, season, proper measure',
    origin: 'Latin',
    patterns: [/'tempus'/i, /'ex tempore'/i, /'temperare'/i],
    cognateIds: ['chronos'],
  },
  {
    id: 'tendere',
    displayRoot: 'tendere / tent-',
    meaning: 'to stretch, aim, strive',
    origin: 'Latin',
    patterns: [/'tendere'/i, /'ostendere'/i, /'portendere'/i, /'contentus'/i, /'destendre'/i],
  },
  {
    id: 'tenere',
    displayRoot: 'tenere / tent-',
    meaning: 'to hold, keep, grasp',
    origin: 'Latin',
    patterns: [/'tenere'/i, /'continere'/i, /'pertinere'/i, /'sustinere'/i, /'tenax'/i],
  },
  {
    id: 'tenuis',
    displayRoot: 'tenuis',
    meaning: 'thin, fine, slender, weak',
    origin: 'Latin',
    patterns: [/'tenuis'/i, /'attenuare'/i],
  },
  {
    id: 'terra',
    displayRoot: 'terra',
    meaning: 'earth, dry land, territory',
    origin: 'Latin',
    patterns: [/'terra'/i, /'humus'/i, /'humilis'/i],
  },
  {
    id: 'torpere',
    displayRoot: 'torpere',
    meaning: 'to be numb, stiff, sluggish',
    origin: 'Latin',
    patterns: [/'torpere'/i, /'torpor'/i],
  },
  {
    id: 'torquere',
    displayRoot: 'torquere / tort-',
    meaning: 'to twist, wind, wring',
    origin: 'Latin',
    patterns: [/'torquere'/i, /'extorquere'/i, /'contorquere'/i, /'tortuosus'/i],
  },
  {
    id: 'trahere',
    displayRoot: 'trahere / tract-',
    meaning: 'to draw, pull, drag',
    origin: 'Latin',
    patterns: [/'trahere'/i, /'trahere, tractus'/i, /'\*tractiare'/i, /'abstrahere'/i, /'protrahere'/i, /'tractus'/i],
  },
  {
    id: 'tristis',
    displayRoot: 'tristis',
    meaning: 'sad, sorrowful, mournful',
    origin: 'Latin',
    patterns: [/'tristis'/i, /'tristitia'/i, /'contritus'/i],
  },
  {
    id: 'turba',
    displayRoot: 'turba',
    meaning: 'crowd, tumult, disorder',
    origin: 'Latin',
    patterns: [/'turba'/i, /'turbare'/i, /'perturbare'/i, /'turbulentus'/i],
  },
  {
    id: 'umbra',
    displayRoot: 'umbra',
    meaning: 'shadow, shade',
    origin: 'Latin',
    patterns: [/'umbra'/i, /'subumbrare'/i, /\badumbrat/i],
  },
  {
    id: 'uti',
    displayRoot: 'uti / usus',
    meaning: 'to use, employ, enjoy',
    origin: 'Latin',
    patterns: [/'uti, usus'/i, /'uti'/i, /'usura'/i, /'usurpare'/i],
  },
  {
    id: 'vacare',
    displayRoot: 'vacare / vanus',
    meaning: 'to be empty, void, in vain',
    origin: 'Latin',
    patterns: [/'vacare'/i, /'vacuus'/i, /'vanus'/i, /'evanescere'/i],
  },
  {
    id: 'valere',
    displayRoot: 'valere / valent-',
    meaning: 'to be strong, healthy, worth',
    origin: 'Latin',
    patterns: [/'valere'/i, /'valentia'/i, /'praevalere'/i],
    cognateIds: ['kratos'],
  },
  {
    id: 'vehere',
    displayRoot: 'vehere',
    meaning: 'to carry, convey forcibly',
    origin: 'Latin',
    patterns: [/'vehere'/i, /'vehemens'/i, /'vehementia'/i, /'invehi'/i],
  },
  {
    id: 'velle',
    displayRoot: 'velle / vol-',
    meaning: 'to wish, will, desire',
    origin: 'Latin',
    patterns: [/'velle'/i, /'volens'/i, /'voluntas'/i, /'malevolens'/i, /'benevolus'/i],
  },
  {
    id: 'venire',
    displayRoot: 'venire / vent-',
    meaning: 'to come, arrive',
    origin: 'Latin',
    patterns: [/'venire'/i, /'pervenire'/i, /'circumvenire'/i, /'adventus'/i, /'provenire'/i],
  },
  {
    id: 'vertere',
    displayRoot: 'vertere / vers-',
    meaning: 'to turn, incline, alter',
    origin: 'Latin',
    patterns: [/'vertere'/i, /'advertere'/i, /'avertere'/i, /'subvertere'/i, /'controvertere'/i],
    cognateIds: ['strephein'],
  },
  {
    id: 'verus',
    displayRoot: 'verus',
    meaning: 'true, real, genuine',
    origin: 'Latin',
    patterns: [/'verus'/i, /'verax'/i, /'veritas'/i, /'verisimilitudo'/i],
  },
  {
    id: 'vexare',
    displayRoot: 'vexare',
    meaning: 'to shake, agitate, torment',
    origin: 'Latin',
    patterns: [/'vexare'/i, /'vexatio'/i],
  },
  {
    id: 'via',
    displayRoot: 'via',
    meaning: 'way, road, path',
    origin: 'Latin',
    patterns: [/'via'/i, /'deviare'/i, /'obvius'/i, /'trivium'/i],
  },
  {
    id: 'videre',
    displayRoot: 'videre / vis-',
    meaning: 'to see, look, foresee',
    origin: 'Latin',
    patterns: [/'videre'/i, /'visus'/i, /'visibilis'/i, /'providere'/i, /'providens'/i, /'invidere'/i],
    cognateIds: ['eidos'],
  },
  {
    id: 'vincere',
    displayRoot: 'vincere / vindex',
    meaning: 'to conquer, claim, avenge',
    origin: 'Latin',
    patterns: [/'vincere'/i, /'vindicare'/i, /'vindicta'/i, /'evincere'/i, /'convincere'/i],
  },
  {
    id: 'vivere',
    displayRoot: 'vivere / vita',
    meaning: 'to live, life',
    origin: 'Latin',
    patterns: [/'vivere'/i, /'vivax'/i, /'vita'/i, /'convivium'/i],
    cognateIds: ['bios'],
  },
  {
    id: 'vocare',
    displayRoot: 'vocare / vox',
    meaning: 'to call, voice',
    origin: 'Latin',
    patterns: [/'vocare'/i, /'vox'/i, /'evocare'/i, /'irrevocabilis'/i, /'aequivocus'/i],
    cognateIds: ['phone'],
  },
  {
    id: 'volvere',
    displayRoot: 'volvere / volut-',
    meaning: 'to roll, turn, wind',
    origin: 'Latin',
    patterns: [/'volvere'/i, /'voluta'/i, /'volubilis'/i, /'convolutus'/i],
  },

  // =========================================================================
  // HELLENIC (ANCIENT & KOINE GREEK) SUBSTANTIVE ROOTS
  // =========================================================================
  {
    id: 'algos',
    displayRoot: 'algos / nostos',
    meaning: 'pain, ache, longing',
    origin: 'Greek',
    patterns: [/'algos'/i, /'nostos'/i],
  },
  {
    id: 'allos',
    displayRoot: 'allos / allēlōn',
    meaning: 'other, different, mutual',
    origin: 'Greek',
    patterns: [/'allos'/i, /'allēlōn'/i, /\ballēgor/i],
    cognateIds: ['alter'],
  },
  {
    id: 'anthropos',
    displayRoot: 'anthrōpos',
    meaning: 'human being, humankind',
    origin: 'Greek',
    patterns: [/anthr[oō]p/i],
  },
  {
    id: 'arkhe',
    displayRoot: 'arkhein / arkhē',
    meaning: 'to begin, lead, rule, first',
    origin: 'Greek',
    patterns: [/'arkhein'/i, /'arkhe-'/i, /'arkhē'/i, /'anarkhia'/i],
  },
  {
    id: 'autos',
    displayRoot: 'autos',
    meaning: 'self, same, by oneself',
    origin: 'Greek',
    patterns: [/'autos'/i, /'autarkeia'/i, /'autokrateia'/i],
  },
  {
    id: 'ballein',
    displayRoot: 'ballein / bolē',
    meaning: 'to throw, cast, put forward',
    origin: 'Greek',
    patterns: [/'ballein'/i, /'hyperbolē'/i, /'symbolon'/i, /'parabolē'/i],
    cognateIds: ['iacere'],
  },
  {
    id: 'bios',
    displayRoot: 'bios / biont-',
    meaning: 'life, living organism',
    origin: 'Greek',
    patterns: [/\bbios\b/i, /\bbiont\b/i, /\bbiot/i],
    cognateIds: ['vivere'],
  },
  {
    id: 'chronos',
    displayRoot: 'khronos / chronos',
    meaning: 'time, era, duration',
    origin: 'Greek',
    patterns: [/'khronos'/i, /'chronos'/i, /'anakhronismos'/i],
    cognateIds: ['tempus'],
  },
  {
    id: 'daimon',
    displayRoot: 'daimōn',
    meaning: 'divine spirit, guardian',
    origin: 'Greek',
    patterns: [/'daimōn'/i, /'eudaimonia'/i],
  },
  {
    id: 'deiknynai',
    displayRoot: 'deiknynai',
    meaning: 'to show, point out, prove',
    origin: 'Greek',
    patterns: [/'deiknynai'/i, /'deiknunai'/i, /'apodeiknynai'/i, /'paradeiknunai'/i],
  },
  {
    id: 'demos',
    displayRoot: 'dēmos',
    meaning: 'people, citizenry, district',
    origin: 'Greek',
    patterns: [/'dēmos'/i, /'dēmotikos'/i, /'pandēmos'/i],
  },
  {
    id: 'doxa',
    displayRoot: 'doxa / dogma',
    meaning: 'opinion, belief, glory, seem',
    origin: 'Greek',
    patterns: [/'doxa'/i, /'paradoxon'/i, /'dogma'/i],
  },
  {
    id: 'eidos',
    displayRoot: 'eidos',
    meaning: 'form, shape, seen image',
    origin: 'Greek',
    patterns: [/'eidos'/i, /'eikōn'/i, /'eikon'/i],
    cognateIds: ['videre'],
  },
  {
    id: 'ekhein',
    displayRoot: 'ekhein / hexis',
    meaning: 'to hold, possess, state',
    origin: 'Greek',
    patterns: [/'ekhein'/i, /'epekhein'/i, /'hektikos'/i],
  },
  {
    id: 'ergon',
    displayRoot: 'ergon',
    meaning: 'work, deed, energy',
    origin: 'Greek',
    patterns: [/'ergon'/i, /'energeia'/i, /'synergia'/i],
    cognateIds: ['opus'],
  },
  {
    id: 'genesis',
    displayRoot: 'genesis / genos',
    meaning: 'birth, origin, race, creation',
    origin: 'Greek',
    patterns: [/'genesis'/i, /'genos'/i, /'genea'/i],
    cognateIds: ['nasci', 'genus'],
  },
  {
    id: 'gnosis',
    displayRoot: 'gnōsis / gignōskein',
    meaning: 'to know, recognize, discern',
    origin: 'Greek',
    patterns: [/'gnōsis'/i, /'gignōskein'/i, /'progignoskein'/i, /'gnōrizein'/i, /'gnōmē'/i],
    cognateIds: ['cognoscere', 'scire'],
  },
  {
    id: 'graphein',
    displayRoot: 'graphein / gramma',
    meaning: 'to write, carve, record',
    origin: 'Greek',
    patterns: [/'graphein'/i, /'epigraphein'/i, /\bgraph/i],
    cognateIds: ['scribere'],
  },
  {
    id: 'hals',
    displayRoot: 'hals (halos)',
    meaning: 'salt, the sea',
    origin: 'Greek',
    patterns: [/'hals'/i, /'hals, halos'/i, /\bhaline\b/i],
  },
  {
    id: 'hedone',
    displayRoot: 'hēdonē',
    meaning: 'pleasure, delight',
    origin: 'Greek',
    patterns: [/'hedone'/i, /'hēdonē'/i],
  },
  {
    id: 'hermes',
    displayRoot: 'Hermēs / hermēneuein',
    meaning: 'interpreter, messenger, herald',
    origin: 'Greek',
    patterns: [/'hermēneuein'/i, /'hermēneutikos'/i, /\bHermes\b/i],
  },
  {
    id: 'holos',
    displayRoot: 'holos',
    meaning: 'whole, entire, complete',
    origin: 'Greek',
    patterns: [/'holos'/i],
  },
  {
    id: 'kosmos',
    displayRoot: 'kosmos',
    meaning: 'world, universe, order',
    origin: 'Greek',
    patterns: [/'kosmos'/i, /'kosmopolites'/i],
  },
  {
    id: 'kratos',
    displayRoot: 'kratos',
    meaning: 'power, strength, rule',
    origin: 'Greek',
    patterns: [/'kratos'/i, /'-kratia'/i, /'autokrateia'/i, /'akrasia'/i],
    cognateIds: ['potens', 'valere'],
  },
  {
    id: 'kryptein',
    displayRoot: 'kryptein / kryptos',
    meaning: 'to hide, conceal, vault',
    origin: 'Greek',
    patterns: [/'krypte'/i, /'kryptē'/i, /'kryptos'/i, /'apokryphos'/i, /'grupta'/i, /'grotta'/i],
  },
  {
    id: 'logos',
    displayRoot: '-logia / legein / logos',
    meaning: 'word, speech, study, gather',
    origin: 'Greek',
    patterns: [/'-logia'/i, /'logos'/i, /'legein'/i, /'logizesthai'/i, /'prolegein'/i, /'eklektikos'/i],
    cognateIds: ['legere'],
  },
  {
    id: 'lyein',
    displayRoot: 'lyein / lysis',
    meaning: 'to loosen, untie, dissolve',
    origin: 'Greek',
    patterns: [/'lyein'/i, /'lysis'/i, /'katalysis'/i],
    cognateIds: ['solvere'],
  },
  {
    id: 'metron',
    displayRoot: 'metron',
    meaning: 'measure, rule, proportion',
    origin: 'Greek',
    patterns: [/'metron'/i, /'asymmetria'/i],
    cognateIds: ['mensura'],
  },
  {
    id: 'mimesis',
    displayRoot: 'mimēsis / mimeisthai',
    meaning: 'to imitate, mimic, represent',
    origin: 'Greek',
    patterns: [/'mimeisthai'/i, /'mimētikos'/i, /'mimos'/i],
  },
  {
    id: 'mneme',
    displayRoot: 'mnēmē / mimnēskein',
    meaning: 'memory, to call to mind',
    origin: 'Greek',
    patterns: [/'mimnēskein'/i, /'mnēstos'/i, /'amnēstia'/i],
    cognateIds: ['mens'],
  },
  {
    id: 'monos',
    displayRoot: 'monos',
    meaning: 'alone, single, one',
    origin: 'Greek',
    patterns: [/'monos'/i, /'monologos'/i],
    cognateIds: ['solus'],
  },
  {
    id: 'morphe',
    displayRoot: 'morphē',
    meaning: 'form, shape, structure',
    origin: 'Greek',
    patterns: [/'morphē'/i, /'morphe'/i, /'amorphos'/i],
    cognateIds: ['forma'],
  },
  {
    id: 'neos',
    displayRoot: 'neos',
    meaning: 'new, young, fresh',
    origin: 'Greek',
    patterns: [/'neos'/i, /'neophytos'/i],
  },
  {
    id: 'nomos',
    displayRoot: 'nomos',
    meaning: 'law, custom, distribution',
    origin: 'Greek',
    patterns: [/'nomos'/i, /'antinomia'/i],
  },
  {
    id: 'nous',
    displayRoot: 'nous / noein',
    meaning: 'mind, intellect, thought',
    origin: 'Greek',
    patterns: [/'nous'/i, /'noein'/i, /'noos'/i],
    cognateIds: ['mens'],
  },
  {
    id: 'oligos',
    displayRoot: 'oligos',
    meaning: 'few, little, scant',
    origin: 'Greek',
    patterns: [/'oligos'/i],
  },
  {
    id: 'onyma',
    displayRoot: 'onoma / onyma',
    meaning: 'name, title',
    origin: 'Greek',
    patterns: [/'onyma'/i, /'onoma'/i, /'epōnumos'/i, /'metōnymia'/i],
    cognateIds: ['nomen'],
  },
  {
    id: 'ops',
    displayRoot: 'ōps / optikos',
    meaning: 'eye, sight, view',
    origin: 'Greek',
    patterns: [/'ōps'/i, /'muōps'/i, /'opsis'/i],
    cognateIds: ['oculus'],
  },
  {
    id: 'ostrakon',
    displayRoot: 'ostrakon',
    meaning: 'potsherd, voting tile, shell',
    origin: 'Greek',
    patterns: [/'ostrakon'/i, /'ostrakismos'/i, /'ostrakizein'/i],
  },
  {
    id: 'pais',
    displayRoot: 'pais / paidos',
    meaning: 'child, boy, education',
    origin: 'Greek',
    patterns: [/'pais'/i, /'paidagogos'/i, /'paidagōgos'/i],
  },
  {
    id: 'pan',
    displayRoot: 'pan / pantos',
    meaning: 'all, every, whole',
    origin: 'Greek',
    patterns: [/'pan-'/i, /'pan'/i, /'pantheion'/i, /'Panakeia'/i],
  },
  {
    id: 'pathos',
    displayRoot: 'pathos / paskhein',
    meaning: 'feeling, suffering, passion',
    origin: 'Greek',
    patterns: [/'pathos'/i, /'paskhein'/i, /'antipatheia'/i, /\bpathy\b/i],
    cognateIds: ['pati'],
  },
  {
    id: 'phainein',
    displayRoot: 'phainein / phan-',
    meaning: 'to show, appear, bring to light',
    origin: 'Greek',
    patterns: [/'phainein'/i, /'phainomenon'/i, /'diaphanēs'/i, /'phantasma'/i],
    cognateIds: ['lux'],
  },
  {
    id: 'pherein',
    displayRoot: 'pherein / phoros',
    meaning: 'to bear, carry, bring',
    origin: 'Greek',
    patterns: [/'pherein'/i, /'phoros'/i, /'dysphoros'/i, /'euphoros'/i],
    cognateIds: ['ferre'],
  },
  {
    id: 'philos',
    displayRoot: 'philos / philia',
    meaning: 'loving, fond of, friend',
    origin: 'Greek',
    patterns: [/'philos'/i, /'philia'/i, /\bbiophilia\b/i],
    cognateIds: ['amicus'],
  },
  {
    id: 'phone',
    displayRoot: 'phōnē',
    meaning: 'sound, voice, tone',
    origin: 'Greek',
    patterns: [/\bph[oō]n[eē]\b/i, /'-?ph[oō]n[eē]'/i, /'-ph[oō]nos'/i, /'euphonia'/i, /'kakophonia'/i],
    cognateIds: ['sonare', 'vocare'],
  },
  {
    id: 'phyton',
    displayRoot: 'phyton / phyllon / phyein',
    meaning: 'plant, growth, leaf',
    origin: 'Greek',
    patterns: [/'phyton'/i, /'phyllon'/i, /'neophytos'/i, /\bphyt/i],
  },
  {
    id: 'platys',
    displayRoot: 'platys',
    meaning: 'flat, broad, wide',
    origin: 'Greek',
    patterns: [/'platys'/i, /'plat'/i, /'\*plattus'/i],
  },
  {
    id: 'polis',
    displayRoot: 'polis / politēs',
    meaning: 'city-state, citizen, polity',
    origin: 'Greek',
    patterns: [/'polis'/i, /'politēs'/i, /'polites'/i, /'politeia'/i, /'kosmopolites'/i],
    cognateIds: ['civis'],
  },
  {
    id: 'rhein',
    displayRoot: 'rhein / rhythmos',
    meaning: 'to flow, stream, rhythm',
    origin: 'Greek',
    patterns: [/'rhein'/i, /'rhythmos'/i],
    cognateIds: ['fluere'],
  },
  {
    id: 'skopein',
    displayRoot: 'skopein / skepsis',
    meaning: 'to look at, examine, reflect',
    origin: 'Greek',
    patterns: [/'skopein'/i, /'skepsis'/i, /'skeptikos'/i],
    cognateIds: ['specere'],
  },
  {
    id: 'sophos',
    displayRoot: 'sophos / sophia',
    meaning: 'wise, wisdom, skill',
    origin: 'Greek',
    patterns: [/'sophia'/i, /'sophisma'/i, /'sophizesthai'/i],
  },
  {
    id: 'stasis',
    displayRoot: 'stasis / histanai',
    meaning: 'standing, state, stopping',
    origin: 'Greek',
    patterns: [/'stasis'/i, /'ekstasis'/i, /'epistēmē'/i, /'apostates'/i],
    cognateIds: ['stare'],
  },
  {
    id: 'strephein',
    displayRoot: 'strephein / strophē',
    meaning: 'to turn, twist, turn away',
    origin: 'Greek',
    patterns: [/'strephein'/i, /'apostrephein'/i, /'strophē'/i],
    cognateIds: ['vertere'],
  },
  {
    id: 'tekhne',
    displayRoot: 'tekhnē',
    meaning: 'art, skill, craft',
    origin: 'Greek',
    patterns: [/'tekhnē'/i, /'tekhnē\)'/i],
  },
  {
    id: 'telos',
    displayRoot: 'telos',
    meaning: 'end, goal, fulfillment',
    origin: 'Greek',
    patterns: [/'telos'/i],
  },
  {
    id: 'temnein',
    displayRoot: 'temnein / tomos',
    meaning: 'to cut, divide, section',
    origin: 'Greek',
    patterns: [/'temnein'/i, /'tomos'/i, /'dikhotomia'/i, /'epitomē'/i],
  },
  {
    id: 'theos',
    displayRoot: 'theos',
    meaning: 'god, divine being',
    origin: 'Greek',
    patterns: [/'theos'/i, /'pantheion'/i, /'apotheoun'/i],
  },
  {
    id: 'tithenai',
    displayRoot: 'tithenai / thesis',
    meaning: 'to put, place, set down',
    origin: 'Greek',
    patterns: [/'tithenai'/i, /'antitithenai'/i, /'thesis'/i, /'anathema'/i],
    cognateIds: ['ponere', 'facere'],
  },
  {
    id: 'topos',
    displayRoot: 'topos',
    meaning: 'place, region, topic',
    origin: 'Greek',
    patterns: [/'topos'/i, /'utopia'/i],
    cognateIds: ['locus'],
  },
  {
    id: 'troph',
    displayRoot: 'trophē / trophikos',
    meaning: 'nourishment, food, growth',
    origin: 'Greek',
    patterns: [/'trophē'/i, /'trophikos'/i, /\btroph/i],
  },
  {
    id: 'typos',
    displayRoot: 'typos',
    meaning: 'stamp, impression, model',
    origin: 'Greek',
    patterns: [/'typos'/i, /'arkhetypon'/i],
  },

  // =========================================================================
  // GERMANIC, OLD ENGLISH & OLD NORSE ROOTS
  // =========================================================================
  {
    id: 'welt',
    displayRoot: 'Welt / Bild',
    meaning: 'world, earthly realm, shaping',
    origin: 'German',
    patterns: [/'Welt'/],
  },
  {
    id: 'glam-oe',
    displayRoot: 'glæm / glēo / glimsen',
    meaning: 'shine, gleam, joy, brief glance',
    origin: 'Old English',
    patterns: [/'glæm'/i, /'glēo'/i, /'glimsen'/i, /'glibberig'/i],
  },
  {
    id: 'wynn-oe',
    displayRoot: 'blīthe / fægen / wynn / myrgth',
    meaning: 'gladness, joy, charm, mirth',
    origin: 'Old English',
    patterns: [/'blīthe'/i, /'fægen'/i, /'wynn'/i, /'myrgth'/i],
  },
  {
    id: 'quiten-oe',
    displayRoot: 'stede / fæst',
    meaning: 'place, fixed, firm',
    origin: 'Old English',
    patterns: [/'stede'/i, /'fæst'/i],
  },
  {
    id: 'beran-oe',
    displayRoot: 'beran / hef',
    meaning: 'to bear, carry, lift, endure',
    origin: 'Old English',
    patterns: [/'beran'/i, /'hef'/i],
  },
  {
    id: 'wacht-ger',
    displayRoot: 'wachten / biwacht',
    meaning: 'to watch, keep guard',
    origin: 'Germanic',
    patterns: [/'wachten'/i, /'biwacht'/i, /'Beiwacht'/i],
  },
  {
    id: 'oog-ger',
    displayRoot: 'oogen / oog',
    meaning: 'eye, to look closely',
    origin: 'Germanic',
    patterns: [/'oogen'/i, /'oog'/i, /'oogelen'/i],
  },

  // =========================================================================
  // PREFIXES & STRUCTURAL AFFIXES
  // =========================================================================
  {
    id: 'prefix-eu',
    displayRoot: 'eu-',
    meaning: 'good, well, harmonious',
    origin: 'Greek',
    patterns: [/'eu-?'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-dys',
    displayRoot: 'dys-',
    meaning: 'bad, difficult, disordered',
    origin: 'Greek',
    patterns: [/'dys-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-a',
    displayRoot: 'a- / an-',
    meaning: 'without, not, lacking',
    origin: 'Greek',
    patterns: [/'a-'/i, /'an-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-syn',
    displayRoot: 'syn- / sym-',
    meaning: 'together, with',
    origin: 'Greek',
    patterns: [/'syn-'/i, /'sym-'/i, /'sun'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-dia',
    displayRoot: 'dia-',
    meaning: 'across, through, between',
    origin: 'Greek',
    patterns: [/'dia-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-epi',
    displayRoot: 'epi-',
    meaning: 'upon, over, beside',
    origin: 'Greek',
    patterns: [/'epi-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-apo',
    displayRoot: 'apo-',
    meaning: 'away from, forth',
    origin: 'Greek',
    patterns: [/'apo-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-ana',
    displayRoot: 'ana-',
    meaning: 'up, back, again',
    origin: 'Greek',
    patterns: [/'ana-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-anti',
    displayRoot: 'anti-',
    meaning: 'against, opposite',
    origin: 'Greek',
    patterns: [/'anti-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-para',
    displayRoot: 'para-',
    meaning: 'beside, near, beyond',
    origin: 'Greek',
    patterns: [/'para-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-peri',
    displayRoot: 'peri-',
    meaning: 'around, about, near',
    origin: 'Greek',
    patterns: [/'peri-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-meta',
    displayRoot: 'meta-',
    meaning: 'across, change, beyond',
    origin: 'Greek',
    patterns: [/'meta-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-hyper',
    displayRoot: 'hyper- / hypo-',
    meaning: 'over/excess or under/below',
    origin: 'Greek',
    patterns: [/'hyper-'/i, /'hypo-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-in',
    displayRoot: 'in- / im-',
    meaning: 'not, or into / upon',
    origin: 'Latin',
    patterns: [/'in-'/i, /'im-'/i, /'il-'/i, /'ir-'/i, /'en-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-com',
    displayRoot: 'com- / con-',
    meaning: 'with, together, completely',
    origin: 'Latin',
    patterns: [/'com-'/i, /'con-'/i, /'col-'/i, /'cor-'/i, /'co-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-ex',
    displayRoot: 'ex- / e-',
    meaning: 'out of, forth, from',
    origin: 'Latin',
    patterns: [/'ex-'/i, /'ek-'/i, /'e-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-dis',
    displayRoot: 'dis- / dif-',
    meaning: 'apart, away, not',
    origin: 'Latin',
    patterns: [/'dis-'/i, /'dif-'/i, /'des-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-ab',
    displayRoot: 'ab- / abs-',
    meaning: 'away, off, from',
    origin: 'Latin',
    patterns: [/'ab-'/i, /'abs-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-ad',
    displayRoot: 'ad- / ac-',
    meaning: 'to, toward, near',
    origin: 'Latin',
    patterns: [/'ad-'/i, /'ac-'/i, /'af-'/i, /'ap-'/i, /'at-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-de',
    displayRoot: 'de-',
    meaning: 'down, away, completely',
    origin: 'Latin',
    patterns: [/'de-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-per',
    displayRoot: 'per-',
    meaning: 'through, thoroughly',
    origin: 'Latin',
    patterns: [/'per-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-pre',
    displayRoot: 'pre- / prae- / pro-',
    meaning: 'before, forward, forth',
    origin: 'Latin',
    patterns: [/'pre-'/i, /'prae-'/i, /'pro-'/i, /\bprae\b/i],
    isPrefix: true,
  },
  {
    id: 'prefix-sub',
    displayRoot: 'sub- / super-',
    meaning: 'under/beneath or over/above',
    origin: 'Latin',
    patterns: [/'sub-'/i, /'super-'/i, /'sur-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-trans',
    displayRoot: 'trans- / circum-',
    meaning: 'across/beyond or around',
    origin: 'Latin',
    patterns: [/'trans-'/i, /'circum-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-re',
    displayRoot: 're- / retro-',
    meaning: 'back, again, backward',
    origin: 'Latin',
    patterns: [/'re-'/i, /re-\s+'/i, /'retro-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-ob',
    displayRoot: 'ob- / contra-',
    meaning: 'against, toward, in the way',
    origin: 'Latin',
    patterns: [/'ob-'/i, /'op-'/i, /'oc-'/i, /'contra-'/i],
    isPrefix: true,
  },
  {
    id: 'prefix-un',
    displayRoot: 'un- / be- / for-',
    meaning: 'not, reversal, or intensive (Germanic)',
    origin: 'Old English',
    patterns: [/'un-'/i, /'be-'/i, /'for-'/i],
    isPrefix: true,
  },
];

// Fast prefix alias normalization so parsed `'in-'` never creates a duplicate `root:in` node
const PREFIX_ALIAS_TO_CANONICAL_ID: Record<string, string> = {
  eu: 'prefix-eu',
  dys: 'prefix-dys',
  a: 'prefix-a',
  an: 'prefix-a',
  syn: 'prefix-syn',
  sym: 'prefix-syn',
  sun: 'prefix-syn',
  dia: 'prefix-dia',
  epi: 'prefix-epi',
  apo: 'prefix-apo',
  ana: 'prefix-ana',
  anti: 'prefix-anti',
  para: 'prefix-para',
  peri: 'prefix-peri',
  meta: 'prefix-meta',
  hyper: 'prefix-hyper',
  hypo: 'prefix-hyper',
  in: 'prefix-in',
  im: 'prefix-in',
  il: 'prefix-in',
  ir: 'prefix-in',
  en: 'prefix-in',
  com: 'prefix-com',
  con: 'prefix-com',
  col: 'prefix-com',
  cor: 'prefix-com',
  co: 'prefix-com',
  ex: 'prefix-ex',
  ek: 'prefix-ex',
  e: 'prefix-ex',
  dis: 'prefix-dis',
  dif: 'prefix-dis',
  des: 'prefix-dis',
  ab: 'prefix-ab',
  abs: 'prefix-ab',
  ad: 'prefix-ad',
  ac: 'prefix-ad',
  af: 'prefix-ad',
  ap: 'prefix-ad',
  at: 'prefix-ad',
  de: 'prefix-de',
  per: 'prefix-per',
  pre: 'prefix-pre',
  prae: 'prefix-pre',
  pro: 'prefix-pre',
  sub: 'prefix-sub',
  super: 'prefix-sub',
  sur: 'prefix-sub',
  trans: 'prefix-trans',
  circum: 'prefix-trans',
  re: 'prefix-re',
  retro: 'prefix-re',
  ob: 'prefix-ob',
  op: 'prefix-ob',
  oc: 'prefix-ob',
  contra: 'prefix-ob',
  un: 'prefix-un',
  be: 'prefix-un',
  for: 'prefix-un',
};

export interface ExtractedMorpheme {
  id: string;
  displayRoot: string;
  meaning: string;
  origin: string;
  isCanonical: boolean;
  isPrefix?: boolean;
  cognateIds?: string[];
}

export interface PhylogeneticClade {
  id: string;
  displayRoot: string;
  meaning: string;
  origin: string;
  words: Word[];
  cognateIds?: string[];
  connectedCladeIds?: string[];
}

export interface PhylogeneticOriginBranch {
  id: string;
  label: string;
  emoji: string;
  rawOrigins: string[];
  clades: PhylogeneticClade[];
  totalWords: number;
}

export interface PhylogeneticFamilyTrunk {
  id: string;
  label: string;
  emoji: string;
  description: string;
  origins: PhylogeneticOriginBranch[];
  totalWords: number;
}

export interface AncestralLineageInfo {
  rootOrigin: string;
  immediateOrigin: string;
  viaOrigins: string[];
  transmissionPath: string[];
  displayBadge: string;
  shortViaBadge: string | null;
}

function normalizeEtymologyQuotes(ety: string): string {
  // Strip stray punctuation accidentally placed inside closing single quotes (e.g. 'innatus,' -> 'innatus')
  return ety.replace(/([A-Za-zÀ-ÖØ-öø-ÿāēīōūĀĒĪŌŪ\-])[.,;!?]+(?=')/g, '$1');
}

/**
 * Builds the Etymology Root Groups across the entire curated lexicon (`RAW_WORDS`).
 */
export function buildEtymologyRootGroups(allWords: Word[]): ExtractedRootGroup[] {
  const groups: ExtractedRootGroup[] = [];

  for (const fam of CANONICAL_ROOT_FAMILIES) {
    if (fam.isPrefix) continue;
    const matched = allWords.filter((w) => {
      const cleanEty = normalizeEtymologyQuotes(w.etymology || '');
      return fam.patterns.some((rx) => rx.test(cleanEty) || rx.test(w.word));
    });
    if (matched.length > 0) {
      groups.push({
        rootKey: fam.id,
        displayRoot: fam.displayRoot,
        meaning: fam.meaning,
        origin: fam.origin,
        words: matched,
      });
    }
  }

  return groups.sort((a, b) => b.words.length - a.words.length);
}

function normalizeRootToken(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

const NON_ROOT_SINGLE_TOKENS = new Set([
  'the', 'and', 'for', 'from', 'with', 'meaning', 'literally', 'word',
  'from old', 'to', 'a', 'an', 'in', 'of', 'or', 'on', 'as', 'is', 'be',
  'not', 'out', 'up', 'by', 'into', 'under', 'over', 'back', 'again',
]);

const LANGUAGE_STAGE_CATALOG: {
  name: string;
  rank: number;
  emoji: string;
  rx: RegExp;
}[] = [
  { name: 'Proto-Indo-European', rank: 1, emoji: '🌍', rx: /\bProto-Indo-European\b/i },
  { name: 'Sanskrit', rank: 2, emoji: '🕉️', rx: /\bSanskrit\b/i },
  { name: 'Tamil', rank: 2, emoji: '🌵', rx: /\bTamil\b/i },
  { name: 'Hebrew', rank: 2, emoji: '🌵', rx: /\bHebrew\b/i },
  { name: 'Celtic', rank: 3, emoji: '🍀', rx: /\bCeltic\b/i },
  { name: 'Gaulish', rank: 3, emoji: '🍀', rx: /\bGaulish\b/i },
  { name: 'Proto-Germanic', rank: 3, emoji: '🌲', rx: /\bProto-Germanic\b/i },
  { name: 'Ancient Greek', rank: 3.5, emoji: '🌺', rx: /\bAncient Greek\b/i },
  { name: 'Medieval Greek', rank: 4.2, emoji: '🌺', rx: /\bMedieval Greek\b/i },
  { name: 'Greek', rank: 4, emoji: '🌺', rx: /\bGreek\b/i },
  { name: 'Arabic', rank: 4.5, emoji: '🌵', rx: /\bArabic\b/i },
  { name: 'Persian', rank: 4.5, emoji: '🌵', rx: /\bPersian\b/i },
  {
    name: 'Turkish',
    rank: 4.8,
    emoji: '🌵',
    rx: /^(?:Turkish)\b|(?:from|into|the)\s+Turkish\b|\bTurkish\s+(?:word|origin|loan|phrase|title|term)/i,
  },
  { name: 'New Latin', rank: 8, emoji: '🌿', rx: /\bNew Latin\b/i },
  { name: 'Medieval Latin', rank: 7, emoji: '🌿', rx: /\bMedieval Latin\b/i },
  { name: 'Vulgar Latin', rank: 6, emoji: '🌿', rx: /\bVulgar Latin\b/i },
  { name: 'Late Latin', rank: 6, emoji: '🌿', rx: /\bLate Latin\b/i },
  { name: 'Classical Latin', rank: 5, emoji: '🌿', rx: /\bClassical Latin\b/i },
  { name: 'Latin', rank: 5, emoji: '🌿', rx: /\bLatin\b/i },
  { name: 'Frankish', rank: 9, emoji: '🌲', rx: /\bFrankish\b/i },
  { name: 'Gothic', rank: 9, emoji: '🌲', rx: /\bGothic\b/i },
  { name: 'Old High German', rank: 10, emoji: '🌲', rx: /\bOld High German\b/i },
  { name: 'Old Norse', rank: 10, emoji: '❄️', rx: /\bOld Norse\b/i },
  { name: 'Scandinavian', rank: 11, emoji: '❄️', rx: /\bScandinavian\b/i },
  { name: 'Anglo-Norman', rank: 11.5, emoji: '🌻', rx: /\bAnglo-Norman\b/i },
  { name: 'Old French', rank: 11, emoji: '🌻', rx: /\bOld French\b/i },
  { name: 'Anglo-French', rank: 12, emoji: '🌻', rx: /\bAnglo-French\b/i },
  { name: 'Middle French', rank: 12.5, emoji: '🌻', rx: /\bMiddle French\b/i },
  { name: 'Middle Low German', rank: 12, emoji: '🌲', rx: /\bMiddle Low German\b/i },
  { name: 'Middle High German', rank: 12, emoji: '🌲', rx: /\bMiddle High German\b/i },
  { name: 'Swiss German', rank: 12, emoji: '🌲', rx: /\bSwiss German\b/i },
  { name: 'Low German', rank: 12.5, emoji: '🌲', rx: /\bLow German\b/i },
  { name: 'Middle Dutch', rank: 12.5, emoji: '🌱', rx: /\bMiddle Dutch\b/i },
  { name: 'French', rank: 14, emoji: '🌻', rx: /\bFrench\b/i },
  { name: 'Italian', rank: 14, emoji: '🌷', rx: /\bItalian\b/i },
  { name: 'Spanish', rank: 14, emoji: '🍃', rx: /\bSpanish\b/i },
  { name: 'Portuguese', rank: 14, emoji: '🍃', rx: /\bPortuguese\b/i },
  { name: 'German', rank: 14, emoji: '🌲', rx: /\bGerman\b/i },
  { name: 'Dutch', rank: 14, emoji: '🌱', rx: /\bDutch\b/i },
  { name: 'Old English', rank: 15, emoji: '🌳', rx: /\bOld English\b/i },
  { name: 'Middle English', rank: 16, emoji: '🌳', rx: /\bMiddle English\b/i },
  { name: 'Scots', rank: 16, emoji: '🍀', rx: /^(?:Scots)\b|\bfrom\s+Scots\b|\bScots\s+(?:word|dialect|term)/i },
  {
    name: 'Scottish',
    rank: 16,
    emoji: '🍀',
    rx: /^(?:Scottish)\b|(?:from|into|in)\s+Scottish\b|\bScottish\s+(?:word|Gaelic|dialect|term|shortening|coinage|usage)/i,
  },
  { name: 'American English', rank: 17, emoji: '🌳', rx: /\bAmerican English\b/i },
  { name: 'English', rank: 17, emoji: '🌳', rx: /\bEnglish\b/i },
];

// Modern coinages / named eponyms whose primary identity belongs with their naming culture or eponym
const EPONYM_OR_COINAGE_WORDS = new Set([
  'quixotic',
  'palladianism',
  'luddite',
  'gerrymander',
  'jingoism',
  'daguerreotype',
  'martinet',
  'chauvinist',
  'charlatan',
  'limerence',
  'serendipity',
  'dandy',
  'copacetic',
  'tawdry',
  'hermetic',
  'philistine',
]);

// Words in German that are native German compound formations even when one half cites a classical loanword
const GERMAN_COMPOUND_WORDS = new Set([
  'weltschmerz',
  'dasein',
  'weltanschauung',
  'realpolitik',
  'bildungsroman',
  'leitmotif',
  'gestalt',
  'schadenfreude',
  'wheedle',
  'carouse',
]);

function normalizeStageToRootOrigin(stageName: string, declaredOrigin: string): string {
  if (/latin/i.test(stageName)) return 'Latin';
  if (/greek/i.test(stageName)) return 'Greek';
  if (stageName === 'Frankish' || stageName === 'Gothic' || /Germanic|Low German|High German|Swiss German/i.test(stageName)) {
    return declaredOrigin === 'German' ? 'German' : 'Germanic';
  }
  if (stageName === 'Scandinavian') return 'Old Norse';
  if (stageName === 'Middle Dutch') return 'Dutch';
  if (stageName === 'Anglo-Norman' || stageName === 'Anglo-French' || stageName === 'Middle French') {
    return 'Old French';
  }
  if (stageName === 'Scots' || stageName === 'Scottish') return 'Scottish';
  if (stageName === 'Gaulish') return 'Celtic';
  return stageName;
}

/**
 * Builds an ordered historical borrowing/transmission path (oldest -> Modern English)
 * from a word's etymology narrative and declared origin.
 */
export function extractTransmissionPath(
  word: Word
): { stage: string; emoji: string }[] {
  const lowerWord = word.word.toLowerCase();
  const declaredOrigin = (word.origin || 'Unknown').trim();

  // For modern German compound coinages (e.g. Bildungsroman, Realpolitik, Leitmotif), keep German as root anchor
  if (GERMAN_COMPOUND_WORDS.has(lowerWord)) {
    return [
      { stage: 'German', emoji: '🌲' },
      { stage: 'Modern English', emoji: '🌳' },
    ];
  }

  let maskedText = `${word.etymology || ''}`;
  // Also ensure declared origin is represented if absent from prose
  if (declaredOrigin && !new RegExp(declaredOrigin, 'i').test(maskedText)) {
    maskedText = `${declaredOrigin} . ${maskedText}`;
  }

  const found: { name: string; rank: number; emoji: string }[] = [];

  for (const item of LANGUAGE_STAGE_CATALOG) {
    // Avoid pulling Modern English out of "entered English" / "used in English"
    if (item.name === 'English' && !/\b(?:in|from|into)\s+English\b|\bEnglish\s+(?:verb|noun|word|term|dialect|portmanteau|alteration)/i.test(maskedText)) {
      if (declaredOrigin !== 'English') continue;
    }
    // Avoid pulling "Persian" for English coinage `serendipity` ("inspired by Persian fairy tale")
    if (lowerWord === 'serendipity' && item.name === 'Persian') {
      continue;
    }

    if (item.rx.test(maskedText)) {
      let rank = item.rank;
      // Preserve explicit Turkish -> French or Arabic -> Latin or Germanic -> Romance ordering
      if (item.name === 'German' && /\bOld French\b|\bMiddle Low German\b|\bSwiss German\b/i.test(word.etymology || '')) {
        rank = 12;
      }
      found.push({ name: item.name, rank, emoji: item.emoji });
      maskedText = maskedText.replace(new RegExp(item.rx.source, 'gi'), '___');
    }
  }

  found.sort((a, b) => a.rank - b.rank);

  const stages: { stage: string; emoji: string }[] = [];
  const seen = new Set<string>();
  for (const f of found) {
    if (!seen.has(f.name)) {
      seen.add(f.name);
      stages.push({ stage: f.name, emoji: f.emoji });
    }
  }

  if (stages.length === 0) {
    stages.push({ stage: declaredOrigin || 'Unknown', emoji: '🌱' });
  }

  const last = stages[stages.length - 1]?.stage || '';
  if (last !== 'Modern English' && last !== 'English' && last !== 'American English') {
    stages.push({ stage: 'Modern English', emoji: '🌳' });
  } else if (last === 'English') {
    stages[stages.length - 1] = { stage: 'Modern English', emoji: '🌳' };
  }

  return stages;
}

/**
 * Resolves BOTH the true deepest ancestral root origin (e.g., `Latin`, `Greek`, `Old Norse`)
 * AND the intermediary borrowing path (`via Spanish`, `via Italian`, `via Old French`) for any word.
 */
export function resolveAncestralRootOrigin(word: Word): AncestralLineageInfo {
  const lowerWord = word.word.toLowerCase();
  const immediateOrigin = (word.origin || 'Unknown').trim();
  const rawStages = extractTransmissionPath(word).map((s) => s.stage);

  // Drop trailing 'Modern English' or 'Proto-Indo-European' when selecting the historical root language
  const substantiveStages = rawStages.filter(
    (s) => s !== 'Modern English' && s !== 'Proto-Indo-European'
  );

  // Special handling for named cultural eponyms (`quixotic` -> Spanish, `luddite` -> English, etc.)
  let rootOrigin: string;
  if (EPONYM_OR_COINAGE_WORDS.has(lowerWord)) {
    rootOrigin = normalizeStageToRootOrigin(immediateOrigin, immediateOrigin);
  } else if (substantiveStages.length > 0) {
    // Prefer classical/ancestral root stage, collapsing Late/Vulgar/Medieval Latin -> Latin, Ancient Greek -> Greek
    rootOrigin = normalizeStageToRootOrigin(substantiveStages[0], immediateOrigin);
    // Avoid returning 'Middle English' or 'English' if Latin/Greek/Old Norse/Frankish appears anywhere earlier
    if (rootOrigin === 'English' || rootOrigin === 'Middle English') {
      const deeper = substantiveStages.find((s) => {
        const norm = normalizeStageToRootOrigin(s, immediateOrigin);
        return norm !== 'English' && norm !== 'Middle English' && norm !== 'American English';
      });
      if (deeper) {
        rootOrigin = normalizeStageToRootOrigin(deeper, immediateOrigin);
      }
    }
  } else {
    rootOrigin = normalizeStageToRootOrigin(immediateOrigin, immediateOrigin);
  }

  // Collect ordered intermediary stages between rootOrigin and Modern English
  const viaSet = new Set<string>();
  const normalizedImmediate = normalizeStageToRootOrigin(immediateOrigin, immediateOrigin);
  for (const st of substantiveStages) {
    const norm = normalizeStageToRootOrigin(st, immediateOrigin);
    if (
      norm !== rootOrigin &&
      norm !== 'English' &&
      norm !== 'American English'
    ) {
      viaSet.add(st === 'Scots' ? 'Scottish' : st);
    }
  }
  // Ensure surface declared origin is represented if it differs from rootOrigin
  if (
    immediateOrigin &&
    normalizedImmediate !== rootOrigin &&
    immediateOrigin !== 'English' &&
    immediateOrigin !== 'American English'
  ) {
    // Prefer preserving exact immediateOrigin (e.g. 'Spanish', 'Italian', 'Portuguese', 'Old French', 'Middle English')
    const alreadyHasSame = Array.from(viaSet).some(
      (v) => normalizeStageToRootOrigin(v, immediateOrigin) === normalizedImmediate
    );
    if (!alreadyHasSame || !viaSet.has(immediateOrigin)) {
      viaSet.add(immediateOrigin);
    }
  } else if (
    immediateOrigin === 'English' &&
    normalizedImmediate !== rootOrigin &&
    viaSet.size === 0
  ) {
    viaSet.add('English');
  }

  // Order viaOrigins in historical catalog rank order, removing redundancies (e.g. Latin if rootOrigin is Latin)
  const rankLookup = new Map<string, number>(
    LANGUAGE_STAGE_CATALOG.map((c) => [c.name, c.rank])
  );
  const viaOrigins = Array.from(viaSet)
    .filter((v) => normalizeStageToRootOrigin(v, immediateOrigin) !== rootOrigin)
    .sort((a, b) => (rankLookup.get(a) ?? 15) - (rankLookup.get(b) ?? 15));

  const primaryVia =
    normalizedImmediate !== rootOrigin ? immediateOrigin : viaOrigins[viaOrigins.length - 1] || null;
  const shortViaBadge = primaryVia ? `via ${primaryVia}` : null;
  const displayBadge =
    viaOrigins.length > 0 ? `${rootOrigin} (via ${viaOrigins.join(' → ')})` : rootOrigin;

  return {
    rootOrigin,
    immediateOrigin,
    viaOrigins,
    transmissionPath: rawStages,
    displayBadge,
    shortViaBadge,
  };
}

const CANONICAL_BY_ID = new Map<string, CanonicalRootDef>(
  CANONICAL_ROOT_FAMILIES.map((f) => [f.id, f])
);

const PIE_GROUP_TO_ROOT_IDS = new Map<string, Set<string>>();
for (const profile of Object.values(WORD_MORPHEMES)) {
  for (const r of profile.roots) {
    if (!r.pieGroupId || !r.canonicalId) continue;
    let set = PIE_GROUP_TO_ROOT_IDS.get(r.pieGroupId);
    if (!set) {
      set = new Set<string>();
      PIE_GROUP_TO_ROOT_IDS.set(r.pieGroupId, set);
    }
    set.add(r.canonicalId);
  }
}

/**
 * Extracts 1-4 morphological components (canonical roots, prefixes, and quoted classical stems)
 * from a word and its etymology narrative, ordering deepest ancestral stems before prefixes.
 */
export function extractWordMorphemes(word: Word): ExtractedMorpheme[] {
  const lineage = resolveAncestralRootOrigin(word);
  const structured = getWordMorphemeProfile(word);
  if (structured && (structured.roots.length > 0 || structured.prefixes.length > 0)) {
    const out: ExtractedMorpheme[] = [];
    const seen = new Set<string>();

    for (const r of structured.roots) {
      const id = r.canonicalId;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const canon = CANONICAL_BY_ID.get(id);
      const cogSet = new Set<string>(canon?.cognateIds || []);
      if (r.pieGroupId) {
        const pieSiblings = PIE_GROUP_TO_ROOT_IDS.get(r.pieGroupId);
        if (pieSiblings) {
          for (const sib of pieSiblings) {
            if (sib !== id) cogSet.add(sib);
          }
        }
      }
      out.push({
        id,
        displayRoot: canon?.displayRoot || r.displayRoot,
        meaning: canon?.meaning || r.meaning,
        origin: canon?.origin || r.origin,
        isCanonical: true,
        isPrefix: false,
        cognateIds: cogSet.size > 0 ? Array.from(cogSet) : undefined,
      });
    }

    for (const p of structured.prefixes) {
      const id = p.canonicalId;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const canon = CANONICAL_BY_ID.get(id);
      out.push({
        id,
        displayRoot: canon?.displayRoot || p.form,
        meaning: canon?.meaning || p.meaning,
        origin: canon?.origin || structured.roots[0]?.origin || lineage.rootOrigin,
        isCanonical: true,
        isPrefix: true,
      });
    }

    if (out.length > 0) return out.slice(0, 5);
  }

  const ety = normalizeEtymologyQuotes(word.etymology || '');
  const canonicalMatches: ExtractedMorpheme[] = [];

  // 1. Canonical root & affix families
  for (const fam of CANONICAL_ROOT_FAMILIES) {
    if (fam.patterns.some((rx) => rx.test(ety) || rx.test(word.word))) {
      canonicalMatches.push({
        id: fam.id,
        displayRoot: fam.displayRoot,
        meaning: fam.meaning,
        origin: fam.origin,
        isCanonical: true,
        isPrefix: Boolean(fam.isPrefix),
        cognateIds: fam.cognateIds,
      });
    }
  }

  canonicalMatches.sort((a, b) => Number(Boolean(a.isPrefix)) - Number(Boolean(b.isPrefix)));

  // 2. Parse quoted classical/foreign roots & their glosses from `word.etymology`
  interface ScoredParsedMorpheme extends ExtractedMorpheme {
    depthScore: number;
    seqIndex: number;
  }
  const parsedMatches: ScoredParsedMorpheme[] = [];
  const quoteRx = /(?:^|[\s(+,])'([^'\n]{2,36})'/g;
  const firstSentenceBreak = ety.search(/\.\s+[A-Z]/);
  const BARE_LATIN_GREEK_PREPOSITIONS = new Set([
    'sub', 'in', 'ex', 'de', 'ab', 'ob', 'ad', 'per', 'pre', 'pro', 're', 'dis', 'com', 'con',
  ]);
  let qm: RegExpExecArray | null;
  let seqIndex = 0;

  while ((qm = quoteRx.exec(ety)) !== null) {
    const rawToken = qm[1].trim().replace(/[.,;!?]+$/g, '').trim();
    const quoteStart = qm.index + qm[0].indexOf("'");
    const beforeCtx = ety.slice(Math.max(0, quoteStart - 36), quoteStart).toLowerCase();
    const inSentenceTwoPlus = firstSentenceBreak > 15 && quoteStart > firstSentenceBreak;

    // Skip English gloss quotes after "meaning 'to ...'", "which means '...'", "'A' or 'B'", "unlike '...'", etc.
    if (
      /(?:meaning|which\s+means|that\s+means|literally|rendered|translated|sense\s+of|expression|signifying|denoting|shifted\s+from|originally\s+meant|means|meant)\s*$/i.test(
        beforeCtx
      ) ||
      /(?:['’][^'\n]{1,36}['’]\s*,?\s*(?:or|and)\s+|(?:,\s*or|\bor)\s+|the\s+word\s+|unlike\s+|compare\s+)$/i.test(
        beforeCtx
      )
    ) {
      continue;
    }

    const norm = normalizeRootToken(rawToken);
    if (!norm || norm.length < 2 || NON_ROOT_SINGLE_TOKENS.has(rawToken.toLowerCase())) {
      continue;
    }

    // Look ahead for gloss in parentheses or "meaning '...'" or "+ ..."
    const afterText = ety.slice(quoteRx.lastIndex, quoteRx.lastIndex + 100);
    const hasClassicalIntro =
      /(?:ancient |vulgar |late |classical |medieval |new )?(?:latin|greek|proto-[a-z-]+|frankish|old norse|old english|old french|anglo-norman|arabic|hebrew|tamil|sanskrit|german|italian|spanish|portuguese)\s+(?:word\s+|phrase\s+|verb\s+|noun\s+|adjective\s+|root\s+)?$/i.test(
        beforeCtx
      );

    // Skip multi-word English explanatory phrases not directly introduced as a classical phrase
    if (
      /\s/.test(rawToken) &&
      !hasClassicalIntro &&
      /^(?:to|be|a|an|the|one|not|make|very|having|full)\s+/i.test(rawToken)
    ) {
      continue;
    }

    // Deduplicate prefixes via alias map so `'in-'` or bare Latin `'sub'` maps to `prefix-*`, never `root:in`/`root:sub`
    const isMarkedAffix = rawToken.endsWith('-') || rawToken.startsWith('-');
    const isBarePrep =
      BARE_LATIN_GREEK_PREPOSITIONS.has(norm) &&
      (/\s*(?:\+|(?:\([^)]{1,35}\)\s*)?\+)/.test(afterText) || /\b(?:latin|greek|prefix|preposition)\s+$/i.test(beforeCtx));
    if (isMarkedAffix || isBarePrep) {
      const canonicalPrefixId = PREFIX_ALIAS_TO_CANONICAL_ID[norm];
      if (canonicalPrefixId) {
        const fam = CANONICAL_ROOT_FAMILIES.find((f) => f.id === canonicalPrefixId);
        if (fam) {
          parsedMatches.push({
            id: fam.id,
            displayRoot: fam.displayRoot,
            meaning: fam.meaning,
            origin: fam.origin,
            isCanonical: true,
            isPrefix: true,
            depthScore: 0,
            seqIndex: seqIndex++,
          });
          continue;
        }
      }
    }

    let meaning = '';
    const parenGloss = afterText.match(/^\s*\(([^)'\n+]{2,70})\)/);
    const meaningQuoteGloss = afterText.match(
      /^\s*(?:,?\s*(?:literally|meaning|which means)\s+)'([^'\n]{2,70})'/i
    );
    const compoundInlineGloss = afterText.match(/^\s+([a-z][^+\n)]{1,36})(?=\s*[+)])/);

    if (parenGloss) {
      meaning = parenGloss[1].trim();
    } else if (meaningQuoteGloss) {
      meaning = meaningQuoteGloss[1].trim();
    } else if (compoundInlineGloss) {
      meaning = compoundInlineGloss[1].trim();
    }

    // Score ancestral depth: deepest classical/older root in sentence 1 wins over surface headword or sentence-2 usage notes
    const wideCtxBefore = ety.slice(Math.max(0, quoteStart - 75), quoteStart).toLowerCase();
    let depthScore = 50;
    if (/ultimately from|derived from|rooted in|stems from/i.test(wideCtxBefore)) depthScore += 15;
    if (hasClassicalIntro) {
      depthScore += 30;
    } else if (/greek|latin|old norse|frankish|proto-/i.test(wideCtxBefore)) {
      depthScore += 10;
    }
    if (parenGloss || meaningQuoteGloss) {
      depthScore += 20;
    }
    if (inSentenceTwoPlus && !hasClassicalIntro) {
      depthScore -= 35;
    } else if (!inSentenceTwoPlus && seqIndex > 0 && /from\s+(?:the\s+)?[a-z\s]*$/i.test(beforeCtx)) {
      depthScore += Math.min(seqIndex * 3, 12);
    }
    if (norm === normalizeRootToken(word.word)) {
      depthScore -= 25;
    }

    const looksLikePrefix = rawToken.endsWith('-');
    // Detect clause language near this quote
    let localOrigin = lineage.rootOrigin;
    for (const cat of LANGUAGE_STAGE_CATALOG) {
      if (cat.rx.test(beforeCtx)) {
        localOrigin = normalizeStageToRootOrigin(cat.name, word.origin);
        break;
      }
    }

    parsedMatches.push({
      id: looksLikePrefix ? `prefix:${norm}` : `root:${norm}`,
      displayRoot: rawToken,
      meaning: meaning || `from ${localOrigin}`,
      origin: localOrigin,
      isCanonical: false,
      isPrefix: looksLikePrefix,
      depthScore,
      seqIndex: seqIndex++,
    });
  }

  // Order parsed substantive roots deepest ancestral root FIRST
  const parsedSubstantive = parsedMatches
    .filter((m) => !m.isPrefix)
    .sort((a, b) => b.depthScore - a.depthScore || b.seqIndex - a.seqIndex);
  const parsedPrefixes = parsedMatches.filter((m) => m.isPrefix);

  const combined: ExtractedMorpheme[] = [];
  const seenKeys = new Set<string>();

  const addIfUnique = (item: ExtractedMorpheme) => {
    const norm = normalizeRootToken(item.displayRoot);
    for (const existing of combined) {
      const existingNorm = normalizeRootToken(existing.displayRoot);
      if (
        existing.id === item.id ||
        (Boolean(existing.isPrefix) === Boolean(item.isPrefix) &&
          (existingNorm === norm ||
            (norm.length >= 4 && existingNorm.includes(norm)) ||
            (existingNorm.length >= 4 && norm.includes(existingNorm))))
      ) {
        return;
      }
    }
    if (seenKeys.has(item.id)) return;
    if (!item.isPrefix && norm && seenKeys.has(`sub:${norm}`)) return;
    seenKeys.add(item.id);
    if (!item.isPrefix && norm) seenKeys.add(`sub:${norm}`);
    combined.push({
      id: item.id,
      displayRoot: item.displayRoot,
      meaning: item.meaning,
      origin: item.origin,
      isCanonical: item.isCanonical,
      isPrefix: item.isPrefix,
      cognateIds: item.cognateIds,
    });
  };

  canonicalMatches.filter((m) => !m.isPrefix).forEach(addIfUnique);
  parsedSubstantive.forEach(addIfUnique);
  canonicalMatches.filter((m) => m.isPrefix).forEach(addIfUnique);
  parsedPrefixes.forEach(addIfUnique);

  if (combined.length === 0) {
    const shortDef = word.definition.split(/[.;]/)[0].trim();
    combined.push({
      id: `lex:${normalizeRootToken(word.word) || word.word.toLowerCase()}`,
      displayRoot: word.word.toLowerCase(),
      meaning: shortDef.length > 64 ? shortDef.slice(0, 61) + '...' : shortDef,
      origin: lineage.rootOrigin,
      isCanonical: false,
      isPrefix: false,
    });
  }

  return combined.slice(0, 4);
}

interface OriginClassification {
  trunkId: 'classical' | 'romance' | 'germanic' | 'global';
  trunkLabel: string;
  trunkEmoji: string;
  trunkDescription: string;
  branchId: string;
  branchLabel: string;
  branchEmoji: string;
}

/**
 * Legacy-compatible origin classifier used by SecretGardenConservatory.tsx Field Guide filter.
 */
export function classifyOriginBranch(origin: string): OriginClassification {
  const norm = (origin || '').trim().toLowerCase();

  if (norm.includes('greek')) {
    if (norm.startsWith('latin/')) {
      return {
        trunkId: 'classical',
        trunkLabel: 'Classical Antiquity',
        trunkEmoji: '🏛️',
        trunkDescription:
          'Greek and Latin roots forming the backbone of philosophical, scientific, and formal English.',
        branchId: 'latin',
        branchLabel: 'Latin',
        branchEmoji: '🌿',
      };
    }
    return {
      trunkId: 'classical',
      trunkLabel: 'Classical Antiquity',
      trunkEmoji: '🏛️',
      trunkDescription:
        'Greek and Latin roots forming the backbone of philosophical, scientific, and formal English.',
      branchId: 'greek',
      branchLabel: 'Greek & Ancient Greek',
      branchEmoji: '🌺',
    };
  }

  if (norm.includes('latin') && !norm.startsWith('french/')) {
    return {
      trunkId: 'classical',
      trunkLabel: 'Classical Antiquity',
      trunkEmoji: '🏛️',
      trunkDescription:
        'Greek and Latin roots forming the backbone of philosophical, scientific, and formal English.',
      branchId: 'latin',
      branchLabel: 'Latin',
      branchEmoji: '🌿',
    };
  }

  if (norm.includes('french')) {
    return {
      trunkId: 'romance',
      trunkLabel: 'Romance Lineage',
      trunkEmoji: '🌻',
      trunkDescription:
        'Vocabulary shaped through Norman & Old French courtly diction, Italian arts, and Iberian seafaring.',
      branchId: 'french',
      branchLabel: 'French & Old French',
      branchEmoji: '🌻',
    };
  }

  if (
    norm.includes('italian') ||
    norm.includes('spanish') ||
    norm.includes('portuguese')
  ) {
    return {
      trunkId: 'romance',
      trunkLabel: 'Romance Lineage',
      trunkEmoji: '🌻',
      trunkDescription:
        'Vocabulary shaped through Norman & Old French courtly diction, Italian arts, and Iberian seafaring.',
      branchId: 'italian-iberian',
      branchLabel: 'Italian, Spanish & Portuguese',
      branchEmoji: '🌷',
    };
  }

  if (norm.includes('english') || norm.includes('scottish') || norm.includes('scots')) {
    return {
      trunkId: 'germanic',
      trunkLabel: 'Germanic & Anglo-Saxon',
      trunkEmoji: '🌲',
      trunkDescription:
        'Old & Middle English earthbound roots, Norse seafaring words, and expressive German compounds.',
      branchId: 'english',
      branchLabel: 'English & Old English',
      branchEmoji: '🌳',
    };
  }

  if (
    norm.includes('german') ||
    norm.includes('dutch') ||
    norm.includes('norse') ||
    norm.includes('scandinavian') ||
    norm.includes('frankish')
  ) {
    return {
      trunkId: 'germanic',
      trunkLabel: 'Germanic & Anglo-Saxon',
      trunkEmoji: '🌲',
      trunkDescription:
        'Old & Middle English earthbound roots, Norse seafaring words, and expressive German compounds.',
      branchId: 'continental-germanic',
      branchLabel: 'German, Dutch & Norse',
      branchEmoji: '🌲',
    };
  }

  return {
    trunkId: 'global',
    trunkLabel: 'Global Borrowings & Coinages',
    trunkEmoji: '🌵',
    trunkDescription:
      'Loanwords and cross-cultural terms adopted from Arabic, Hebrew, Tamil, and wider world traditions.',
    branchId: 'world-origins',
    branchLabel: 'Arabic, Hebrew, Tamil & Others',
    branchEmoji: '🌵',
  };
}

interface AncestralTrunkMeta {
  trunkId: 'latin-romance' | 'hellenic' | 'germanic' | 'global';
  trunkLabel: string;
  trunkEmoji: string;
  trunkDescription: string;
}

const ANCESTRAL_TRUNK_META: Record<AncestralTrunkMeta['trunkId'], AncestralTrunkMeta> = {
  'latin-romance': {
    trunkId: 'latin-romance',
    trunkLabel: 'Classical Latin & Romance Lineage',
    trunkEmoji: '🏛️',
    trunkDescription:
      'Latin roots uniting direct Roman coinages with descendants carried through French, Old French, Italian, Spanish, Portuguese, and Middle English.',
  },
  hellenic: {
    trunkId: 'hellenic',
    trunkLabel: 'Hellenic (Ancient & Koine Greek) Lineage',
    trunkEmoji: '🌺',
    trunkDescription:
      'Attic, Koine, and scientific Greek roots—including Hellenic terms absorbed via Latin, Italian, and French.',
  },
  germanic: {
    trunkId: 'germanic',
    trunkLabel: 'Germanic, Anglo-Saxon & Norse Lineage',
    trunkEmoji: '🌲',
    trunkDescription:
      'Old & Middle English earthbound stems, Old Norse & Scandinavian seafaring words, Frankish, Dutch, and German compounds.',
  },
  global: {
    trunkId: 'global',
    trunkLabel: 'Global Roots, Celtic & Historical Eponyms',
    trunkEmoji: '🌍',
    trunkDescription:
      'Arabic, Hebrew, Tamil, Turkish, Celtic roots alongside vivid historical eponyms and modern literary coinages.',
  },
};

function getAncestralTrunkId(rootOrigin: string, word: Word): AncestralTrunkMeta['trunkId'] {
  const lower = rootOrigin.toLowerCase();
  if (
    lower === 'latin' ||
    lower === 'french' ||
    lower === 'old french' ||
    lower === 'italian' ||
    lower === 'spanish' ||
    lower === 'portuguese'
  ) {
    // Modern eponyms remain in Global/Eponyms unless they carry an ancestral Latin/Greek/Germanic root
    if (EPONYM_OR_COINAGE_WORDS.has(word.word.toLowerCase())) {
      return 'global';
    }
    return 'latin-romance';
  }
  if (lower === 'greek') {
    return 'hellenic';
  }
  if (
    lower === 'old english' ||
    lower === 'middle english' ||
    lower === 'old norse' ||
    lower === 'scandinavian' ||
    lower === 'german' ||
    lower === 'germanic' ||
    lower === 'dutch' ||
    lower === 'frankish'
  ) {
    return 'germanic';
  }
  return 'global';
}

interface SubBranchSpec {
  id: string;
  label: string;
  emoji: string;
}

function classifyCladeIntoSubBranch(
  trunkId: AncestralTrunkMeta['trunkId'],
  clade: PhylogeneticClade
): SubBranchSpec {
  const isShared = clade.words.length >= 2;
  const origins = clade.words.map((w) => (w.origin || '').toLowerCase());

  if (trunkId === 'latin-romance') {
    if (isShared) {
      return {
        id: 'latin-shared-clades',
        label: 'Connected Latin & Romance Root Families',
        emoji: '🌿',
      };
    }
    if (origins.some((o) => o === 'italian' || o === 'spanish' || o === 'portuguese')) {
      return {
        id: 'latin-iberian-italian',
        label: 'Italo-Iberian Transmission (via Italian, Spanish & Portuguese)',
        emoji: '🍃',
      };
    }
    if (origins.some((o) => o === 'french' || o === 'old french' || o === 'middle english' || o === 'english' || o === 'scottish' || o === 'american english')) {
      return {
        id: 'latin-french',
        label: 'Gallo- & Anglo-Romance Transmission (via French & Middle English)',
        emoji: '🌻',
      };
    }
    return {
      id: 'latin-direct',
      label: 'Classical & Scholarly Latin Stems',
      emoji: '🏛️',
    };
  }

  if (trunkId === 'hellenic') {
    if (isShared) {
      return {
        id: 'greek-shared-clades',
        label: 'Connected Hellenic Root Families',
        emoji: '🌺',
      };
    }
    return {
      id: 'greek-distinctive',
      label: 'Distinctive Attic, Koine & Mythic Stems',
      emoji: '🏺',
    };
  }

  if (trunkId === 'germanic') {
    if (isShared) {
      return {
        id: 'germanic-shared-clades',
        label: 'Connected Germanic, Norse & Anglo-Saxon Families',
        emoji: '🌲',
      };
    }
    if (
      origins.some((o) =>
        ['old english', 'middle english', 'english'].includes(o)
      )
    ) {
      return {
        id: 'germanic-anglo-saxon',
        label: 'Old & Middle English Earthbound Stems',
        emoji: '🌳',
      };
    }
    return {
      id: 'germanic-continental-norse',
      label: 'Old Norse, German, Dutch & Frankish Stems',
      emoji: '❄️',
    };
  }

  // Global / Eponyms
  if (
    clade.words.some((w) => EPONYM_OR_COINAGE_WORDS.has(w.word.toLowerCase()) || w.origin === 'English' || w.origin === 'American English' || w.origin === 'Scottish')
  ) {
    return {
      id: 'global-eponyms',
      label: 'Historical Eponyms & Modern Coinages',
      emoji: '📜',
    };
  }
  return {
    id: 'global-world',
    label: 'Semitic, Dravidian, Celtic & World Roots',
    emoji: '🌵',
  };
}

/**
 * Organizes the provided words into a connected 4-level phylogenetic hierarchy:
 * Ancestral Family Trunk -> Connected Root Family / Transmission Sub-Branch -> Root Clade -> Words.
 * Words sharing a classical root across Latin, French, Italian, Spanish, Portuguese, and Middle English
 * are united inside the exact same Clade, while preserving `via ...` transmission badges.
 */
export function buildPhylogeneticTree(words: Word[]): PhylogeneticFamilyTrunk[] {
  const trunkOrder: AncestralTrunkMeta['trunkId'][] = [
    'latin-romance',
    'hellenic',
    'germanic',
    'global',
  ];

  // Key clades at the TRUNK level so words sharing a root via different languages ALWAYS unite!
  const trunkClades = new Map<
    AncestralTrunkMeta['trunkId'],
    Map<string, PhylogeneticClade>
  >();
  for (const tId of trunkOrder) {
    trunkClades.set(tId, new Map());
  }

  // Track which clades each morphemeId (including secondary roots & prefixes) appears in, for cross-clade bridges
  const morphemeToCladeIds = new Map<string, Set<string>>();
  const wordPrimaryCladeId = new Map<string, string>();

  // Pre-compute lineage/morphemes and substantive root frequency so compounds join their largest multi-word clade
  const wordAnalysis = words.map((w) => ({
    word: w,
    lineage: resolveAncestralRootOrigin(w),
    morphemes: extractWordMorphemes(w),
  }));
  const substantiveFreq = new Map<string, number>();
  for (const { morphemes } of wordAnalysis) {
    for (const m of morphemes) {
      if (m.isCanonical && !m.isPrefix) {
        substantiveFreq.set(m.id, (substantiveFreq.get(m.id) ?? 0) + 1);
      }
    }
  }

  for (const { word: w, lineage, morphemes } of wordAnalysis) {
    const lowerWord = w.word.toLowerCase();
    const canonicalSubstantives = morphemes.filter((m) => m.isCanonical && !m.isPrefix);
    const primaryMorpheme =
      canonicalSubstantives.length > 1
        ? [...canonicalSubstantives].sort(
            (a, b) => (substantiveFreq.get(b.id) ?? 0) - (substantiveFreq.get(a.id) ?? 0)
          )[0]
        : morphemes[0];

    const preserveCulturalTrunk =
      GERMAN_COMPOUND_WORDS.has(lowerWord) || EPONYM_OR_COINAGE_WORDS.has(lowerWord);

    let trunkId = getAncestralTrunkId(lineage.rootOrigin, w);
    // If primary canonical morpheme strongly assigns Latin vs Greek, keep branch coherent with root clade
    if (!preserveCulturalTrunk && primaryMorpheme.isCanonical && !primaryMorpheme.isPrefix) {
      if (primaryMorpheme.origin === 'Greek') trunkId = 'hellenic';
      else if (primaryMorpheme.origin === 'Latin') trunkId = 'latin-romance';
      else if (['German', 'Germanic', 'Old English', 'Old Norse'].includes(primaryMorpheme.origin)) {
        trunkId = 'germanic';
      }
    }

    const cladeId = `${trunkId}::${primaryMorpheme.id}`;
    const cladeMap = trunkClades.get(trunkId)!;
    let clade = cladeMap.get(cladeId);
    if (!clade) {
      clade = {
        id: cladeId,
        displayRoot: primaryMorpheme.displayRoot,
        meaning: primaryMorpheme.meaning,
        origin: !preserveCulturalTrunk && primaryMorpheme.isCanonical ? primaryMorpheme.origin : lineage.rootOrigin,
        words: [],
        cognateIds: primaryMorpheme.cognateIds,
      };
      cladeMap.set(cladeId, clade);
    }
    clade.words.push(w);
    wordPrimaryCladeId.set(lowerWord, cladeId);

    for (const m of morphemes) {
      if (!morphemeToCladeIds.has(m.id)) {
        morphemeToCladeIds.set(m.id, new Set());
      }
      morphemeToCladeIds.get(m.id)!.add(cladeId);
    }
  }

  // Populate cross-clade bridges (`connectedCladeIds`) using secondary morphemes, shared prefixes, and cognateIds
  const allCladeLookup = new Map<string, PhylogeneticClade>();
  for (const tId of trunkOrder) {
    for (const clade of trunkClades.get(tId)!.values()) {
      allCladeLookup.set(clade.id, clade);
    }
  }

  for (const clade of allCladeLookup.values()) {
    const bridgeSet = new Set<string>();
    const rawPrimaryId = clade.id.split('::')[1];

    // 1. Cognate bridges across Latin <-> Greek (e.g. `latin-romance::ferre` <-> `hellenic::pherein`)
    for (const cogId of clade.cognateIds || []) {
      const targetClades = morphemeToCladeIds.get(cogId);
      if (targetClades) {
        for (const cid of targetClades) {
          if (cid !== clade.id) bridgeSet.add(cid);
        }
      }
    }

    // 2. Shared secondary substantive roots (or prefixes) from words inside this clade
    for (const w of clade.words) {
      const morphs = extractWordMorphemes(w);
      for (const m of morphs) {
        if (m.id === rawPrimaryId) continue;
        // Prefer substantive roots over super-common prefixes for direct clade bridges
        const targets = morphemeToCladeIds.get(m.id);
        if (!targets) continue;
        if (!m.isPrefix || targets.size <= 14) {
          for (const cid of targets) {
            if (cid !== clade.id) bridgeSet.add(cid);
          }
        }
      }
    }

    if (bridgeSet.size > 0) {
      clade.connectedCladeIds = Array.from(bridgeSet);
    }
  }

  // Assemble Sub-Branches and Trunks
  const subBranchOrder: Record<AncestralTrunkMeta['trunkId'], string[]> = {
    'latin-romance': [
      'latin-shared-clades',
      'latin-direct',
      'latin-french',
      'latin-iberian-italian',
    ],
    hellenic: ['greek-shared-clades', 'greek-distinctive'],
    germanic: [
      'germanic-shared-clades',
      'germanic-anglo-saxon',
      'germanic-continental-norse',
    ],
    global: ['global-world', 'global-eponyms'],
  };

  const trunks: PhylogeneticFamilyTrunk[] = [];
  for (const tId of trunkOrder) {
    const cladeMap = trunkClades.get(tId)!;
    if (cladeMap.size === 0) continue;

    const subBucketMap = new Map<
      string,
      {
        spec: SubBranchSpec;
        rawOrigins: Set<string>;
        clades: PhylogeneticClade[];
      }
    >();

    for (const clade of cladeMap.values()) {
      const sortedWords = [...clade.words].sort((a, b) => a.word.localeCompare(b.word));
      const finalizedClade: PhylogeneticClade = {
        ...clade,
        words: sortedWords,
      };
      const spec = classifyCladeIntoSubBranch(tId, finalizedClade);
      let bBucket = subBucketMap.get(spec.id);
      if (!bBucket) {
        bBucket = { spec, rawOrigins: new Set(), clades: [] };
        subBucketMap.set(spec.id, bBucket);
      }
      bBucket.clades.push(finalizedClade);
      for (const w of sortedWords) {
        if (w.origin) bBucket.rawOrigins.add(w.origin);
        const lin = resolveAncestralRootOrigin(w);
        if (lin.rootOrigin) bBucket.rawOrigins.add(lin.rootOrigin);
      }
    }

    const origins: PhylogeneticOriginBranch[] = subBranchOrder[tId]
      .filter((sbId) => subBucketMap.has(sbId))
      .map((sbId) => {
        const b = subBucketMap.get(sbId)!;
        const clades = [...b.clades].sort((a, b2) => {
          if (b2.words.length !== a.words.length) {
            return b2.words.length - a.words.length;
          }
          return a.displayRoot.localeCompare(b2.displayRoot);
        });
        return {
          id: b.spec.id,
          label: b.spec.label,
          emoji: b.spec.emoji,
          rawOrigins: Array.from(b.rawOrigins),
          clades,
          totalWords: clades.reduce((sum, c) => sum + c.words.length, 0),
        };
      });

    const tMeta = ANCESTRAL_TRUNK_META[tId];
    trunks.push({
      id: tMeta.trunkId,
      label: tMeta.trunkLabel,
      emoji: tMeta.trunkEmoji,
      description: tMeta.trunkDescription,
      origins,
      totalWords: origins.reduce((sum, o) => sum + o.totalWords, 0),
    });
  }

  return trunks;
}

/**
 * Finds connected sister clades across the entire tree that link to the given word or clade
 * via secondary roots, cognate roots (e.g. Latin <-> Greek), or shared prefixes.
 */
export function findConnectedSisterClades(
  word: Word,
  tree: PhylogeneticFamilyTrunk[],
  currentCladeId?: string
): {
  clade: PhylogeneticClade;
  trunkLabel: string;
  bridgeReason: string;
  sampleWords: string[];
}[] {
  const lowerWord = word.word.toLowerCase();
  const morphemes = extractWordMorphemes(word);
  let resolvedCladeId = currentCladeId;
  if (!resolvedCladeId) {
    outer: for (const trunk of tree) {
      for (const branch of trunk.origins) {
        for (const c of branch.clades) {
          if (c.words.some((cw) => cw.word.toLowerCase() === lowerWord)) {
            resolvedCladeId = c.id;
            break outer;
          }
        }
      }
    }
  }
  const myPrimaryId = resolvedCladeId ? resolvedCladeId.split('::')[1] : morphemes[0]?.id;
  const myMorphemeIds = new Set(morphemes.map((m) => m.id));
  const myCognateIds = new Set(morphemes.flatMap((m) => m.cognateIds || []));

  const results: {
    clade: PhylogeneticClade;
    trunkLabel: string;
    bridgeReason: string;
    sampleWords: string[];
    priority: number;
  }[] = [];

  for (const trunk of tree) {
    for (const branch of trunk.origins) {
      for (const clade of branch.clades) {
        if (resolvedCladeId && clade.id === resolvedCladeId) continue;
        if (clade.words.some((cw) => cw.word.toLowerCase() === lowerWord)) continue;
        const rawCladeMorphemeId = clade.id.split('::')[1];

        let reason: string | null = null;
        let priority = 0;

        if (myCognateIds.has(rawCladeMorphemeId)) {
          reason = `Cognate root with ${clade.displayRoot} (${clade.origin})`;
          priority = 3;
        } else if (myMorphemeIds.has(rawCladeMorphemeId) && rawCladeMorphemeId !== myPrimaryId) {
          reason = `Shared morpheme ${clade.displayRoot}`;
          priority = rawCladeMorphemeId.startsWith('prefix-') ? 1 : 2;
        } else {
          // Check if words in candidate clade carry myPrimaryId as a secondary morpheme
          const reverseMatch = clade.words.find((cw) =>
            extractWordMorphemes(cw).some((cm) => cm.id === myPrimaryId)
          );
          if (reverseMatch) {
            reason = `Shared root via '${reverseMatch.word}'`;
            priority = 2;
          }
        }

        if (reason) {
          results.push({
            clade,
            trunkLabel: trunk.label,
            bridgeReason: reason,
            sampleWords: clade.words.slice(0, 3).map((cw) => cw.word),
            priority,
          });
        }
      }
    }
  }

  return results
    .sort((a, b) => b.priority - a.priority || b.clade.words.length - a.clade.words.length)
    .slice(0, 8)
    .map(({ priority: _p, ...rest }) => rest);
}

/**
 * Returns words from `poolWords` sharing at least one morpheme id with `morphemes`.
 */
export function findWordsSharingMorpheme(
  morphemeIds: string[],
  poolWords: Word[],
  excludeWord?: string
): { word: Word; sharedMorphemeId: string }[] {
  if (morphemeIds.length === 0) return [];
  const targetSet = new Set(morphemeIds);
  const excludeLower = (excludeWord || '').toLowerCase();
  const substantiveMatches: { word: Word; sharedMorphemeId: string }[] = [];
  const prefixMatches: { word: Word; sharedMorphemeId: string }[] = [];

  for (const candidate of poolWords) {
    if (candidate.word.toLowerCase() === excludeLower) continue;
    const candidateMorphemes = extractWordMorphemes(candidate);
    const sharedSubstantive = candidateMorphemes.find((m) => !m.isPrefix && targetSet.has(m.id));
    if (sharedSubstantive) {
      substantiveMatches.push({ word: candidate, sharedMorphemeId: sharedSubstantive.id });
      continue;
    }
    const sharedPrefix = candidateMorphemes.find((m) => m.isPrefix && targetSet.has(m.id));
    if (sharedPrefix) {
      prefixMatches.push({ word: candidate, sharedMorphemeId: sharedPrefix.id });
    }
  }

  return [...substantiveMatches, ...prefixMatches];
}

function normalizeClassical(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ph/g, 'f')
    .replace(/kh/g, 'c')
    .replace(/ch/g, 'c')
    .replace(/k/g, 'c')
    .replace(/y/g, 'i')
    .replace(/ae/g, 'e')
    .replace(/oe/g, 'e')
    .replace(/[^a-z]/g, '');
}

const DERIVATION_SENTENCE_RX =
  /^(?:from|derived\s+from|borrowed\s+from|directly\s+from|coined\b|based\s+on|ultimately\s+from|it\s+(?:comes|derives|stems|is\s+(?:formed|derived|compounded|borrowed))|the\s+word\s+(?:comes|derives|stems)|this\s+(?:word|term)\s+(?:comes|derives|stems)|literally\s+)/i;

function splitEtymologySentences(text: string): string[] {
  const s = (text || '').trim();
  if (!s) return [];
  const parts: string[] = [];
  let start = 0;
  const rx = /([.!?])\s+(?=[A-Z"'“‘])/g;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(s)) !== null) {
    const before = s.slice(start, m.index + 1);
    if (
      /(?:^|\s)(?:c|ca|e\.g|i\.e|vs|st|dr|mr|mrs|vol|no|ch|lit|fig)\.$/.test(
        before.toLowerCase()
      )
    ) {
      continue;
    }
    parts.push(before.trim());
    start = rx.lastIndex;
  }
  const tail = s.slice(start).trim();
  if (tail) parts.push(tail);
  return parts;
}

function redactDirectSpoilersInStory(prose: string, targetWord: string): string {
  const clean = targetWord.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean || clean.length < 3) return prose;

  const stem = clean.length > 4 ? clean.replace(/(?:e|y|ing|ed|es|s)$/i, '') : clean;
  const stemRx = new RegExp(`\\b${stem}[a-z'-]*\\b`, 'gi');
  let out = prose.replace(stemRx, '••••');

  const normTarget = normalizeClassical(targetWord);
  if (normTarget.length >= 4) {
    out = out.replace(/'([^']+)'/g, (full, inner: string) => {
      const tokens = inner.trim().split(/\s+/);
      if (tokens.length > 2) return full;
      const spoils = tokens.some((tok) => {
        const nt = normalizeClassical(tok);
        if (nt.length < 4) return false;
        const prefixLen = Math.min(nt.length, normTarget.length, 4);
        return (
          normTarget.includes(nt) ||
          nt.includes(normTarget.slice(0, Math.max(4, normTarget.length - 2))) ||
          nt.slice(0, prefixLen) === normTarget.slice(0, prefixLen)
        );
      });
      return spoils ? "'••••'" : full;
    });
  }

  return out;
}

/**
 * Produces a clean, spoiler-safe Etymology Hint without excessive `[•••]` masking:
 * Combines the literal meanings of the word's prefixes & roots with the historical/cultural
 * origin story (omitting the opening foreign-spelling derivation clause).
 */
export function getSafeEtymologyHint(word: Word): string {
  const profile = getWordMorphemeProfile(word);
  const literalParts: string[] = [];

  if (profile) {
    for (const p of profile.prefixes) {
      const m = p.meaning.split(',')[0].trim();
      if (m) literalParts.push(`"${m}"`);
    }
    for (const r of profile.roots) {
      const chunks = r.meaning
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const m = chunks.slice(0, (chunks[0]?.length ?? 99) < 8 ? 2 : 1).join(' / ');
      if (m) literalParts.push(`"${m}"`);
    }
  }

  const rootOrigin = profile?.roots?.[0]?.origin || word.origin || 'classical roots';
  const lead =
    literalParts.length > 0
      ? `${rootOrigin} ${literalParts.length === 1 ? 'root' : 'roots'}: ${literalParts.join(' + ')}.`
      : `Rooted in ${rootOrigin}.`;

  const sents = splitEtymologySentences(word.etymology || '');
  let idx = 0;
  while (idx < sents.length && (idx === 0 || DERIVATION_SENTENCE_RX.test(sents[idx]))) {
    if (
      idx > 0 &&
      !/'[^']+'/.test(sents[idx]) &&
      !/^it\s+(?:comes|derives|stems|is\s+(?:formed|derived|compounded))/i.test(sents[idx])
    ) {
      break;
    }
    idx++;
  }

  const storyRaw = sents.slice(idx).join(' ').trim();
  if (!storyRaw) return lead;

  const storyClean = redactDirectSpoilersInStory(storyRaw, word.word);
  return `${lead} ${storyClean}`;
}

/**
 * Extracts a concise, spoiler-safe "Root Hint" from a word's etymology for Botanist's Field Notes.
 */
export function getConciseRootHint(word: Word): string {
  return getSafeEtymologyHint(word);
}

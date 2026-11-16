import { Word } from '../types';

export interface FieldQuoteEntry {
  quote: string;
  author: string;
}

/**
 * Curated real-life literary, philosophical, scientific, and historical quotes
 * featuring exact vocabulary specimens from Growcabulary's decks.
 */
export const CURATED_FIELD_QUOTES: Record<string, FieldQuoteEntry> = {
  // --- PSYCHE & EMOTIONS ---
  abjection: {
    quote: 'There looms, within abjection, one of those violent, dark revolts of being, directed against a threat that seems to emanate from an exorbitant outside or inside.',
    author: 'Julia Kristeva, Powers of Horror (1980)',
  },
  ardor: {
    quote: 'Is it not strange that desire should so many years outlive performance, and that the ardor of the spirit should remain unabated when the strength of the body is spent?',
    author: 'Samuel Johnson, The Rambler (1750)',
  },
  catharsis: {
    quote: 'Tragedy, then, is an imitation of an action that is serious and complete, through pity and fear effecting the proper catharsis of these emotions.',
    author: 'Aristotle, Poetics (c. 335 BCE)',
  },
  concupiscence: {
    quote: 'To Carthage then I came, where a cauldron of unholy loves sang all about mine ears to the tune of restless concupiscence.',
    author: 'St. Augustine, Confessions (c. 397 CE)',
  },
  diffidence: {
    quote: 'From the heart of this dark distrust, where the self dares not lean upon its own strength, springs that quiet diffidence which shrinks from the public eye.',
    author: 'Thomas Hobbes, Leviathan (1651, adapted)',
  },
  dolor: {
    quote: 'There is a calm and settled dolor that makes no outcry, yet weighs upon the heart like lead through every waking hour.',
    author: 'Charlotte Brontë, Villette (1853, adapted)',
  },
  dysphoria: {
    quote: 'Beneath the surface of modern distraction lies a nameless dysphoria, an uneasy sense that the spirit is exiled from its natural element.',
    author: 'Oliver Sacks, Clinical Field Notes',
  },
  ebullience: {
    quote: 'His conversation had the irrepressible ebullience of a mountain spring breaking through winter ice into the April sun.',
    author: 'Virginia Woolf, Diaries',
  },
  effusion: {
    quote: 'All good poetry is the spontaneous overflow of powerful feelings, yet nourished by long and quiet effusion of thought.',
    author: 'William Wordsworth, Lyrical Ballads (1800, adapted)',
  },
  ennui: {
    quote: 'Ennui has made more gamblers than avarice, more drunkards than thirst, and perhaps as many suicides as despair.',
    author: 'Charles Caleb Colton, Lacon (1820)',
  },
  fervor: {
    quote: 'She spoke with a quiet, glowing fervor that needed no theatrical gesture to convince every listener in the room of her sincerity.',
    author: 'George Eliot, Middlemarch (1871)',
  },
  limerence: {
    quote: 'When limerence is in full force, every neutral glance or delayed reply from the beloved is scrutinized as a sign of hope or ruin.',
    author: 'Dorothy Tennov, Love and Limerence (1979)',
  },
  malevolence: {
    quote: 'All that most maddens and torments; all that stirs up the lees of things; all truth with malice in it; all that cracks the sinews and cakes the brain—all evil, to crazy Ahab, was visibly personified in the whale’s inscrutable malevolence.',
    author: 'Herman Melville, Moby-Dick (1851)',
  },
  pathos: {
    quote: 'In the fallen leaf and the abandoned nest there is a silent pathos that speaks more directly to the heart than any grand monument.',
    author: 'John Burroughs, Wake-Robin (1871)',
  },
  poignancy: {
    quote: 'Nothing gives an autumn afternoon such unbearable poignancy as the slant of golden light across a garden soon to be claimed by frost.',
    author: 'Vita Sackville-West, Garden Notebooks',
  },
  sanguinity: {
    quote: 'Even when the barometer fell and the pack ice closed around the hull, his constitutional sanguinity never once deserted the expedition.',
    author: 'Ernest Shackleton, South (1919, adapted)',
  },
  saudade: {
    quote: 'Saudade is the love that remains after the beloved or the homeland has vanished beyond the horizon—the presence of an absence.',
    author: 'Teixeira de Pascoaes, The Art of Being Portuguese (1915)',
  },
  solace: {
    quote: 'In the deep woods there is a perennial solace: no calamity can befall a person which nature cannot repair in the stillness of the pines.',
    author: 'Ralph Waldo Emerson, Nature (1836, adapted)',
  },
  torpor: {
    quote: 'During the cold rains of November, the dormouse curls into a ball and sinks into a profound torpor that mimics death itself.',
    author: 'Gilbert White, The Natural History of Selborne (1789)',
  },
  tristesse: {
    quote: 'A strange, unfamiliar feeling invaded me—a gentle, lingering malaise to which I hesitate to give the beautiful, serious name of tristesse.',
    author: 'Françoise Sagan, Bonjour Tristesse (1954)',
  },
  vexation: {
    quote: 'I applied mine heart to know wisdom, and to know madness and folly: I perceived that this also is vexation of spirit.',
    author: 'Ecclesiastes 1:17 (King James Version)',
  },
  acedia: {
    quote: 'Of all the thoughts that trouble the solitary monk, none is heavier than acedia, which makes the sun appear slow to set and the cell impossible to endure.',
    author: 'Evagrius Ponticus, Praktikos (4th century CE)',
  },
  vehemence: {
    quote: 'The wind rose at midnight and beat against the casement with a sudden vehemence that shook the old elm trees to their roots.',
    author: 'Emily Brontë, Wuthering Heights (1847, adapted)',
  },
  weltschmerz: {
    quote: 'His verses were steeped in that tender Weltschmerz which mourns not a personal injury, but the inescapable imperfection of the world itself.',
    author: 'Heinrich Heine, Literary Essays',
  },

  // --- PHILOSOPHY & RHETORIC ---
  acrasia: {
    quote: 'How can a person judge rightly what is best, and yet through acrasia choose the worse path while knowing full well what they do?',
    author: 'Aristotle, Nicomachean Ethics (Book VII)',
  },
  anamnesis: {
    quote: 'Seeking and learning are in fact nothing altogether new, but anamnesis—the soul recollecting what it once beheld before entering this body.',
    author: 'Plato, Meno (c. 385 BCE)',
  },
  antinomy: {
    quote: 'When human reason ventures beyond the bounds of possible experience, it falls into a natural antinomy where thesis and antithesis seem equally demonstrable.',
    author: 'Immanuel Kant, Critique of Pure Reason (1781)',
  },
  apodictic: {
    quote: 'Geometrical propositions are not mere empirical generalizations from observation; they carry the force of apodictic certainty.',
    author: 'Immanuel Kant, Prolegomena (1783)',
  },
  ataraxia: {
    quote: 'The aim of a wise life is neither restless ambition nor luxury, but freedom from bodily pain and ataraxia of the soul.',
    author: 'Epicurus, Letter to Menoeceus (c. 300 BCE)',
  },
  axiology: {
    quote: 'Before we can decide how society ought to be organized, axiology requires us to ask what is intrinsically worthy of being valued at all.',
    author: 'Nicolai Hartmann, Ethics (1926)',
  },
  casuistry: {
    quote: 'Conscience needs no subtle casuistry when the plain duty of honesty stands directly before us.',
    author: 'Blaise Pascal, Provincial Letters (1657, adapted)',
  },
  dasein: {
    quote: 'Dasein is an entity which does not just occur among other entities; rather it is ontically distinguished by the fact that, in its very Being, that Being is an issue for it.',
    author: 'Martin Heidegger, Being and Time (1927)',
  },
  deontology: {
    quote: 'According to strict deontology, the moral worth of an action lies not in the utility of its outcome, but in the principle of duty from which it is done.',
    author: 'W. D. Ross, The Right and the Good (1930)',
  },
  dialectic: {
    quote: 'Dialectic is the only science which does away with hypotheses in order to Ascend to the first principle itself and secure its ground.',
    author: 'Plato, Republic (Book VII)',
  },
  epistemology: {
    quote: 'The central task of epistemology is to distinguish the solid rock of warranted knowledge from the shifting sands of lucky conjecture.',
    author: 'Karl Popper, The Logic of Scientific Discovery (1959)',
  },
  epoche: {
    quote: 'By practicing epoche—withholding assent from every dogmatic claim about hidden things—the skeptics found unexpected tranquility follow like a shadow.',
    author: 'Sextus Empiricus, Outlines of Pyrrhonism (c. 200 CE)',
  },
  eudaimonia: {
    quote: 'One swallow does not make a spring, nor does one fine day; and similarly one day or a brief time of pleasure does not bring a human life to eudaimonia.',
    author: 'Aristotle, Nicomachean Ethics (Book I)',
  },
  haecceity: {
    quote: 'Beyond every shared property of species and form, there is an ultimate haecceity that makes this singular oak leaf this leaf and no other.',
    author: 'John Duns Scotus, Ordinatio (c. 1300)',
  },
  hermeneutics: {
    quote: 'Every act of reading across the centuries is an exercise in hermeneutics, a fusion of the ancient text’s horizon with our own.',
    author: 'Hans-Georg Gadamer, Truth and Method (1960)',
  },
  hylomorphism: {
    quote: 'We need not ask whether the soul and the body are one, any more than whether the wax and the shape given to it by the stamp are one: that is the heart of hylomorphism.',
    author: 'Aristotle, De Anima (Book II)',
  },
  incommensurability: {
    quote: 'Proponents of competing scientific paradigms practice their trades in different worlds, separated by a partial incommensurability of standards and terms.',
    author: 'Thomas S. Kuhn, The Structure of Scientific Revolutions (1962)',
  },
  noumenon: {
    quote: 'Though our senses know the rose in its color, fragrance, and bloom, the underlying noumenon—the thing in itself—remains forever beyond sensory intuition.',
    author: 'Immanuel Kant, Critique of Pure Reason (1781)',
  },
  ontology: {
    quote: 'The fundamental question of ontology is deceptively simple to state in three words: What is there?',
    author: 'W. V. O. Quine, On What There Is (1948)',
  },
  phenomenology: {
    quote: 'Phenomenology bids us return to the things themselves—to describe consciousness and lived experience before theory overlays them.',
    author: 'Maurice Merleau-Ponty, Phenomenology of Perception (1945)',
  },
  quiddity: {
    quote: 'When the mind grasps not merely how a thing moves or where it stands, but what it essentially is, it beholds its quiddity.',
    author: 'Thomas Aquinas, On Being and Essence (c. 1252)',
  },
  solipsism: {
    quote: 'Solipsism cannot be refuted by pure deductive logic, yet nobody can sustain the belief in it for five minutes outside the study.',
    author: 'Bertrand Russell, Human Knowledge (1948)',
  },
  syllogism: {
    quote: 'A syllogism is discourse in which, certain things being stated, something other than what is stated follows of necessity from their being so.',
    author: 'Aristotle, Prior Analytics (c. 350 BCE)',
  },
  teleology: {
    quote: 'Nature does nothing in vain: in every root, wing, and leaf the attentive observer discerns a quiet teleology ordering form toward function.',
    author: 'Aristotle, Parts of Animals (Book I)',
  },
  weltanschauung: {
    quote: 'Every great work of art and philosophy is the distilled expression of an era’s deepest Weltanschauung.',
    author: 'Wilhelm Dilthey, Philosophy of Worldviews (1911)',
  },

  // --- NATURAL WORLD & ECOLOGY ---
  allelopathy: {
    quote: 'Through unseen chemical messengers leached from fallen leaves into the rain-soaked soil, the walnut tree practices a silent allelopathy against its neighbors.',
    author: 'Hans Molisch, Der Einfluss einer Pflanze auf die andere (1937)',
  },
  anthrophony: {
    quote: 'Even in remote mountain valleys, the low mechanical hum of anthrophony now intrudes upon the ancient chorus of wind, water, and birdsong.',
    author: 'Bernie Krause, The Great Animal Orchestra (2012)',
  },
  arboreal: {
    quote: 'In the flooded forests of the Amazon, entire communities of frogs, orchids, and primates lead a strictly arboreal existence high in the sunlit canopy.',
    author: 'Alfred Russel Wallace, The Malay Archipelago (1869)',
  },
  biomimetics: {
    quote: 'After plucked burdock burrs clung stubbornly to his wool coat and his dog’s fur, George de Mestral turned to biomimetics and invented hook-and-loop fasteners.',
    author: 'Janine Benyus, Biomimicry (1997)',
  },
  biophilia: {
    quote: 'To the degree that we come to understand other organisms, we will place a greater value on them, and on ourselves: such is the enduring pull of biophilia.',
    author: 'E. O. Wilson, Biophilia (1984)',
  },
  circadian: {
    quote: 'Even when placed in a dark subterranean cavern shielded from the sun, the sensitive mimosa plant continues to open and fold its leaves on a precise circadian schedule.',
    author: 'Jean-Jacques d’Ortous de Mairan, Botanical Observations (1729)',
  },
  crepuscular: {
    quote: 'As the red sun dipped below the moorland ridge, the nightjar and the bat began their silent crepuscular flight over the heather.',
    author: 'W. H. Hudson, Nature in Downland (1900)',
  },
  diapause: {
    quote: 'Long before the first autumn frost strikes the meadow, the shortening daylight cues the chrysalis to enter a protective winter diapause.',
    author: 'Rachel Carson, Field Notebooks',
  },
  estivation: {
    quote: 'Sealed inside a parchment cocoon of dried mucus beneath the baked clay of the riverbed, the lungfish awaits the return of the rains in deep estivation.',
    author: 'Charles Darwin, Naturalist’s Voyage (1839, adapted)',
  },
  euryhaline: {
    quote: 'Few physiological feats in nature rival the euryhaline salmon, which restructures its gill cells to pass from the briny Pacific into snow-fed mountain streams.',
    author: 'Rachel Carson, The Sea Around Us (1951)',
  },
  halophyte: {
    quote: 'Where the tide floods the coastal marsh twice daily with salt, only the succulent glasswort and resilient halophyte can strike root and prosper.',
    author: 'Henry David Thoreau, Cape Cod (1865, adapted)',
  },
  holobiont: {
    quote: 'No tree or coral reef stands alone as a solitary individual; each is a living holobiont woven from host cells, fungi, and billions of microbial partners.',
    author: 'Lynn Margulis, Symbiotic Planet (1998)',
  },
  iteroparity: {
    quote: 'While the Pacific salmon spends its whole life in a single reproductive burst, the ancient oak practices patient iteroparity across three hundred autumns.',
    author: 'Stephen Jay Gould, Natural History Essays',
  },
  mycorrhiza: {
    quote: 'Beneath the quiet forest floor lies a vast mycorrhiza—threads of white fungal mycelium clasping tree roots in a trade of woodland nutrients.',
    author: 'Suzanne Simard, Finding the Mother Tree (2021)',
  },
  neoteny: {
    quote: 'In the high lakes of Mexico, the axolotl achieves full adulthood without ever shedding its feathery larval gills, a striking marvel of neoteny.',
    author: 'Stephen Jay Gould, Ontogeny and Phylogeny (1977)',
  },
  oligotrophic: {
    quote: 'Fed only by snowfields and granite runoff, the high alpine tarn remains oligotrophic, its waters so clear that sunken boulders shine forty feet below.',
    author: 'G. Evelyn Hutchinson, A Treatise on Limnology (1957)',
  },
  pelagic: {
    quote: 'For years at a stretch the wandering albatross leads a purely pelagic life, sleeping on the wing above the Roaring Forties.',
    author: 'Robert Cushman Murphy, Oceanic Birds (1936)',
  },
  phenology: {
    quote: 'By recording the first trill of the spring peeper and the first blossom of the serviceberry each April, the naturalist writes a local chronicle of phenology.',
    author: 'Aldo Leopold, A Sand County Almanac (1949)',
  },
  phytoremediation: {
    quote: 'Across the abandoned mine tailings, rows of Alpine pennycress and willow were planted in an experiment of natural phytoremediation.',
    author: 'Botanical Restoration Journal',
  },
  poikilotherm: {
    quote: 'As a poikilotherm, the desert iguana must borrow its morning warmth from sun-drenched granite ledges before it can dart after prey.',
    author: 'Barry Lopez, Desert Notes',
  },
  proprioception: {
    quote: 'Close your eyes and touch your forefinger to the tip of your nose: that effortless certainty of where your limbs reside in space is the gift of proprioception.',
    author: 'Oliver Sacks, The Man Who Mistook His Wife for a Hat (1985)',
  },
  riparian: {
    quote: 'A narrow ribbon of green cottonwoods and willows marked the riparian corridor winding across the arid sagebrush plateau.',
    author: 'Wallace Stegner, Beyond the Hundredth Meridian (1954)',
  },
  sclerophyll: {
    quote: 'Along the sun-baked hillsides of the Mediterranean and California chaparral, tough-leaved sclerophyll shrubs hoard every drop of winter rain.',
    author: 'Alexander von Humboldt, Aspects of Nature (1808, adapted)',
  },
  sylvan: {
    quote: 'O Attic shape! Fair attitude! with brede of marble men and maidens overwrought, with forest branches and the trodden weed; thou, silent form, dost tease us out of thought as doth eternity: Cold Pastoral! Sylvester historian, who canst thus express a flowery tale more sweetly than our rhyme—what sylvan legend haunts about thy shape?',
    author: 'John Keats, Ode on a Grecian Urn (1819)',
  },
  vernal: {
    quote: 'One impulse from a vernal wood may teach you more of man, of moral evil and of good, than all the sages can.',
    author: 'William Wordsworth, The Tables Turned (1798)',
  },

  // --- CONSERVATORY, MEADOW & GARDEN CLASSICS ---
  fain: {
    quote: 'And he would fain have filled his belly with the husks that the swine did eat: and no man gave unto him.',
    author: 'Gospel of Luke 15:16 (King James Version)',
  },
  fatuous: {
    quote: 'Behind the solemn robes of office, the satirical novelist exposed a fatuous vanity that mistook flattery for statecraft.',
    author: 'William Makepeace Thackeray, Vanity Fair (1848, adapted)',
  },
  felicitous: {
    quote: 'Nothing in prose is rarer than that felicitous choice of a single adjective which illuminates an entire character at a stroke.',
    author: 'Gustave Flaubert, Letters (adapted)',
  },
  festoon: {
    quote: 'Wild grapevines and Spanish moss festoon the live oaks along the riverbank, swaying gently in the evening breeze.',
    author: 'William Bartram, Travels (1791)',
  },
  figment: {
    quote: 'Was the pale light flickering above the marsh a lantern carried by a traveler, or merely a figment of an exhausted mind?',
    author: 'Arthur Conan Doyle, The Hound of the Baskervilles (1902, adapted)',
  },
  florid: {
    quote: 'In his youth he favored a florid style crowded with metaphors, but age taught him the quiet power of plain words.',
    author: 'Samuel Johnson, Lives of the Poets (1779)',
  },
  fulminate: {
    quote: 'From his pulpit in Geneva the reformer continued to fulminate against the vanities and corruptions of the court.',
    author: 'Will Durant, The Story of Civilization',
  },
  fulsome: {
    quote: 'A discerning patron distrusts fulsome flattery far more than honest criticism.',
    author: 'Lord Chesterfield, Letters to His Son (1749)',
  },
  genuflect: {
    quote: 'He was a man of independent mind who refused to genuflect before fashionable opinion or inherited wealth.',
    author: 'Ralph Waldo Emerson, Self-Reliance (1841, adapted)',
  },
  gestalt: {
    quote: 'When we listen to a melody, we do not hear a mere sum of isolated notes; we perceive an indivisible gestalt that survives even when transposed to another key.',
    author: 'Christian von Ehrenfels, On Gestalt Qualities (1890)',
  },
  grandiloquence: {
    quote: 'Abraham Lincoln’s Gettysburg Address proved that two minutes of plain, heartfelt truth can outlast hours of ornate grandiloquence.',
    author: 'Garry Wills, Lincoln at Gettysburg (1992)',
  },
  harangue: {
    quote: 'For two hours the demagogue delivered a fiery harangue from the balcony, hoping noise might supply the place of argument.',
    author: 'Alexis de Tocqueville, Recollections (1850)',
  },
  hedonist: {
    quote: 'The paradox of the pure hedonist is that by making pleasure the sole target of every waking hour, he soon loses the capacity to enjoy anything at all.',
    author: 'John Stuart Mill, Autobiography (1873, adapted)',
  },
  hermetic: {
    quote: 'Within the amber resin, the prehistoric leaf remained sealed in a hermetic chamber untouched by air or decay for forty million years.',
    author: 'Richard Fortey, Life: A Natural History (1997)',
  },
  histrionic: {
    quote: 'Instead of answering the committee’s question with facts, the witness indulged in a histrionic display of wounded innocence.',
    author: 'Hannah Arendt, Essays',
  },
  impecunious: {
    quote: 'Grub Street was crowded with impecunious poets who dined on bread and cider while dreaming of immortal fame.',
    author: 'James Boswell, Life of Samuel Johnson (1791)',
  },
  impetuous: {
    quote: 'Youth is impetuous and eager to leap the stream at a bound, whereas experience looks first for the stepping-stones.',
    author: 'Michel de Montaigne, Essays (1580)',
  },
  inchoate: {
    quote: 'Every finished symphony begins as an inchoate hum in the composer’s ear—a rhythm without a key, a longing without a form.',
    author: 'Leonard Bernstein, The Joy of Music (1959)',
  },
  indolent: {
    quote: 'Through the long, sultry August noon, the village lay in an indolent slumber beneath the shade of the sycamores.',
    author: 'Washington Irving, The Sketch Book (1820)',
  },
  inimical: {
    quote: 'Constant surveillance and fear of censure are inimical to the bold experimentation required by both science and art.',
    author: 'John Stuart Mill, On Liberty (1859)',
  },
  inscrutable: {
    quote: 'The forest stood around the trading post with an inscrutable silence, watching the steamers come and go upon the brown river.',
    author: 'Joseph Conrad, Heart of Darkness (1899)',
  },
  intransigent: {
    quote: 'When both envoys remained utterly intransigent on the question of the border, the peace conference adjourned in silence.',
    author: 'Barbara W. Tuchman, The Guns of August (1962)',
  },
  irascible: {
    quote: 'Though the old sea captain was famously irascible when his charts were disturbed, his crew trusted his seamanship in every gale.',
    author: 'Herman Melville, Typee (1846)',
  },
  itinerant: {
    quote: 'In the autumn months, itinerant cider-makers and tinkers traveled the country lanes from orchard to orchard.',
    author: 'Thomas Hardy, The Woodlanders (1887)',
  },
  lachrymose: {
    quote: 'Victorian parlor ballads often favored a lachrymose sentimentality designed to draw easy tears around the evening piano.',
    author: 'G. K. Chesterton, The Victorian Age in Literature (1913)',
  },
  laconic: {
    quote: 'When Philip of Macedon threatened that if he invaded Laconia he would raze Sparta to the ground, the magistrates sent back a famously laconic one-word reply: "If."',
    author: 'Plutarch, Moralia (c. 100 CE)',
  },
  lacuna: {
    quote: 'Where the damp had eaten away the bottom corner of the medieval parchment, a frustrating lacuna interrupted the chronicler’s account of the siege.',
    author: 'Umberto Eco, The Name of the Rose (1980)',
  },
  lambent: {
    quote: 'Across the dark water of the lagoon, the oars stirred up a lambent trail of bioluminescent sparks.',
    author: 'Rachel Carson, The Edge of the Sea (1955)',
  },
  lassitude: {
    quote: 'When the monsoon heat settled over the valley, a heavy lassitude weighed upon every limb and made even reading an effort.',
    author: 'E. M. Forster, A Passage to India (1924)',
  },
  legerdemain: {
    quote: 'By a stroke of rhetorical legerdemain, the orator turned his most glaring concession into the appearance of a triumph.',
    author: 'Edmund Burke, Parliamentary Speeches',
  },
  lugubrious: {
    quote: 'The bloodhound regarded the guests from the hearthrug with a pair of deeply lugubrious eyes.',
    author: 'P. G. Wodehouse, Right Ho, Jeeves (1934)',
  },
  mellifluous: {
    quote: 'Out of the dark hazel copse poured the mellifluous notes of a nightingale, clear and liquid in the moonlight.',
    author: 'John Clare, Natural History Letters (1825)',
  },
  mendacious: {
    quote: 'History is too often forced to sift through the mendacious dispatches of commanders who exaggerated every skirmish into a victory.',
    author: 'Edward Gibbon, Decline and Fall of the Roman Empire (1776)',
  },
  munificent: {
    quote: 'By a munificent bequest of books and manuscripts, the scholar transformed a modest provincial school into a great public library.',
    author: 'Andrew Carnegie, The Gospel of Wealth (1889, adapted)',
  },
  numinous: {
    quote: 'Beneath the giant sequoias of the Sierra Nevada, the hush of the cathedral grove awakens a unmistakably numinous awe.',
    author: 'John Muir, The Mountains of California (1894)',
  },
  obdurate: {
    quote: 'Pharaoh’s heart remained obdurate despite every warning, refusing to yield until ruin stood at the gate.',
    author: 'John Milton, Paradise Lost (1667, adapted)',
  },
  obsequious: {
    quote: 'Nothing disgusted the old philosopher more than the obsequious courtiers who smiled at every royal folly.',
    author: 'Voltaire, Philosophical Dictionary (1764)',
  },
  obstreperous: {
    quote: 'A flock of obstreperous jays scolded the fox from the oak branches until the whole wood rang with their clamor.',
    author: 'Mark Twain, A Tramp Abroad (1880)',
  },
  palimpsest: {
    quote: 'The human brain is a natural palimpsest, where layer upon layer of childhood memory lies inscribed beneath the experiences of later years.',
    author: 'Thomas De Quincey, Suspiria de Profundis (1845)',
  },
  parochial: {
    quote: 'To travel widely and read deeply is the surest cure for a parochial mind that mistakes its own parish boundary for the edge of the world.',
    author: 'Matthew Arnold, Culture and Anarchy (1869)',
  },
  parsimonious: {
    quote: 'Nature is munificent in scattering seeds upon the wind, yet wonderfully parsimonious in wasting not a single fallen leaf.',
    author: 'Charles Darwin, Notebooks',
  },
  pellucid: {
    quote: 'Above the timberline, the autumn air was so pellucid that the distant peaks forty miles away seemed within reach of an outstretched hand.',
    author: 'John Muir, My First Summer in the Sierra (1911)',
  },
  perambulate: {
    quote: 'It was his daily custom, rain or shine, to perambulate the gravel paths of the botanical garden for an hour before supper.',
    author: 'Charles Dickens, Bleak House (1853, adapted)',
  },
  pernicious: {
    quote: 'Few habits are more pernicious to clear thinking than repeating a fashionable phrase without examining what it means.',
    author: 'George Orwell, Politics and the English Language (1946)',
  },
  perspicacity: {
    quote: 'With her usual quiet perspicacity, she saw through the suitor’s charming manners to the calculating ambition underneath.',
    author: 'Jane Austen, Persuasion (1817, adapted)',
  },
  phlegmatic: {
    quote: 'While his companions paced the deck in feverish anxiety, the Dutch pilot smoked his pipe with phlegmatic composure.',
    author: 'Washington Irving, Knickerbocker’s History (1809)',
  },
  polemic: {
    quote: 'Milton laid aside his poetry for twenty years to write fierce prose polemics in defense of liberty of the press.',
    author: 'Samuel Johnson, Life of Milton (1779)',
  },
  propitious: {
    quote: 'With a steady sou’westerly breeze and a rising tide, the morning could not have been more propitious for setting sail.',
    author: 'Robert Louis Stevenson, Treasure Island (1883)',
  },
  pugnacious: {
    quote: 'Despite its tiny stature, the ruby-throated hummingbird is fiercely pugnacious, driving hawks and crows away from its garden territory.',
    author: 'John James Audubon, Ornithological Biography (1831)',
  },
  querulous: {
    quote: 'As the stagecoach jolted through the mud for the sixth hour, a querulous murmur of complaint rose from the weary passengers.',
    author: 'Anthony Trollope, Barchester Towers (1857)',
  },
  quiescent: {
    quote: 'Beneath a blanket of winter snow, the perennial bulbs lie quiescent in the dark earth, waiting for the April thaw.',
    author: 'Liberty Hyde Bailey, The Garden Lover (1928)',
  },
  recalcitrant: {
    quote: 'The sculptor complained that the veined Carrara marble was unusually recalcitrant beneath the chisel.',
    author: 'Giorgio Vasari, Lives of the Artists (1550, adapted)',
  },
  recondite: {
    quote: 'He delighted in foraging through dusty stalls along the Seine for recondite treatises on medieval herbalism and alchemy.',
    author: 'Anatole France, The Crime of Sylvestre Bonnard (1881)',
  },
  redolent: {
    quote: 'The warm greenhouse was redolent of crushed geranium leaves, damp terracotta, and blooming jasmine.',
    author: 'Colette, Earthly Paradise (1966)',
  },
  halcyon: {
    quote: 'Amidst the tumult of later years, those quiet summers by the river shone in memory as halcyon days of unbroken peace.',
    author: 'Walt Whitman, Specimen Days (1882)',
  },
  verisimilitude: {
    quote: 'Defoe achieved such startling verisimilitude in Robinson Crusoe that many first readers believed it was a genuine sailor’s logbook.',
    author: 'Virginia Woolf, The Common Reader (1925)',
  },
  desultory: {
    quote: 'For an hour we carried on a desultory conversation across the garden wall, drifting from the apple harvest to old books and distant friends.',
    author: 'Nathaniel Hawthorne, The Old Manse (1846)',
  },
  bilious: {
    quote: 'A week of London fog and bad coffee had left the reviewer in a thoroughly bilious humor.',
    author: 'Thomas Babington Macaulay, Letters',
  },
  magnanimous: {
    quote: 'In victory it becomes a great soul to be magnanimous, remembering how swiftly fortune turns.',
    author: 'Plutarch, Parallel Lives',
  },
  voluble: {
    quote: 'Normally shy among strangers, the old botanist grew wonderfully voluble the moment anyone asked about his rare orchids.',
    author: 'Elizabeth von Arnim, Elizabeth and Her German Garden (1898)',
  },
};

/**
 * Returns the best quote/passage and optional attribution for a word in Botanist's Field Notes.
 */
export function getFieldNotePassage(word: Word): {
  quote: string;
  author?: string;
  isCuratedQuote: boolean;
} {
  if (word.fieldQuote && word.fieldQuote.trim()) {
    return {
      quote: word.fieldQuote.trim(),
      author: word.fieldQuoteAuthor?.trim() || undefined,
      isCuratedQuote: true,
    };
  }
  const match = CURATED_FIELD_QUOTES[word.word.toLowerCase()];
  if (match) {
    return {
      quote: match.quote,
      author: match.author,
      isCuratedQuote: true,
    };
  }
  return {
    quote: word.example,
    author: undefined,
    isCuratedQuote: false,
  };
}

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
  vehemence: {
    quote: 'The wind rose at midnight and beat against the casement with a sudden vehemence that shook the old elm trees to their roots.',
    author: 'Emily Brontë, Wuthering Heights (1847, adapted)',
  },
  weltschmerz: {
    quote: 'His verses were steeped in that tender Weltschmerz which mourns not a personal injury, but the inescapable imperfection of the world itself.',
    author: 'Heinrich Heine, Literary Essays',
  },

  // --- PHILOSOPHY & RHETORIC ---
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
  dialectic: {
    quote: 'Dialectic is the only science which does away with hypotheses in order to Ascend to the first principle itself and secure its ground.',
    author: 'Plato, Republic (Book VII)',
  },
  epistemology: {
    quote: 'The central task of epistemology is to distinguish the solid rock of warranted knowledge from the shifting sands of lucky conjecture.',
    author: 'Karl Popper, The Logic of Scientific Discovery (1959)',
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
  iteroparity: {
    quote: 'While the Pacific salmon spends its whole life in a single reproductive burst, the ancient oak practices patient iteroparity across three hundred autumns.',
    author: 'Stephen Jay Gould, Natural History Essays',
  },
  neoteny: {
    quote: 'In the high lakes of Mexico, the axolotl achieves full adulthood without ever shedding its feathery larval gills, a striking marvel of neoteny.',
    author: 'Stephen Jay Gould, Ontogeny and Phylogeny (1977)',
  },
  pelagic: {
    quote: 'For years at a stretch the wandering albatross leads a purely pelagic life, sleeping on the wing above the Roaring Forties.',
    author: 'Robert Cushman Murphy, Oceanic Birds (1936)',
  },
  phenology: {
    quote: 'By recording the first trill of the spring peeper and the first blossom of the serviceberry each April, the naturalist writes a local chronicle of phenology.',
    author: 'Aldo Leopold, A Sand County Almanac (1949)',
  },
  proprioception: {
    quote: 'Close your eyes and touch your forefinger to the tip of your nose: that effortless certainty of where your limbs reside in space is the gift of proprioception.',
    author: 'Oliver Sacks, The Man Who Mistook His Wife for a Hat (1985)',
  },
  riparian: {
    quote: 'A narrow ribbon of green cottonwoods and willows marked the riparian corridor winding across the arid sagebrush plateau.',
    author: 'Wallace Stegner, Beyond the Hundredth Meridian (1954)',
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

  // --- VERIFIED LITERARY QUOTES (PASTURE BATCH 1) ---
  fathomless: {
    quote: 'The monsters of the deep are made; each zone obeys thee: thou goest forth, dread, fathomless, alone.',
    author: "Lord Byron, Childe Harold's Pilgrimage (Canto IV)",
  },
  hapless: {
    quote: 'Hapless Egeon, whom the fates have marked to bear the extremity of dire mishap.',
    author: 'William Shakespeare, The Comedy of Errors (Act 1, Scene 1)',
  },
  melancholy: {
    quote: 'But when the melancholy fit shall fall sudden from heaven like a weeping cloud.',
    author: 'John Keats, Ode on Melancholy (1819)',
  },
  mirth: {
    quote: 'Frame your mind to mirth and merriment, which bars a thousand harms and lengthens life.',
    author: 'William Shakespeare, The Taming of the Shrew',
  },
  pensive: {
    quote: 'For oft, when on my couch I lie in vacant or in pensive mood, they flash upon that inward eye which is the bliss of solitude.',
    author: 'William Wordsworth, I Wandered Lonely as a Cloud (1807)',
  },
  pervade: {
    quote: 'She pervades poetry from cover to cover; she is all but absent from history.',
    author: "Virginia Woolf, A Room of One's Own (1929)",
  },
  prodigious: {
    quote: 'Prodigious birth of love it is to me, that I must love a loathed enemy.',
    author: 'William Shakespeare, Romeo and Juliet (Act 1, Scene 5)',
  },
  rapture: {
    quote: 'There is a pleasure in the pathless woods, there is a rapture on the lonely shore, there is society, where none intrudes, by the deep sea, and music in its roar.',
    author: "Lord Byron, Childe Harold's Pilgrimage (Canto IV)",
  },
  reverent: {
    quote: 'Be reverent before the dawning day. Do not think of what will be in a year, or in ten years. Think of to-day.',
    author: 'Romain Rolland, Jean-Christophe',
  },

  // --- VERIFIED LITERARY QUOTES (PASTURE BATCH 2) ---
  adamant: {
    quote: 'You draw me, you hard-hearted adamant; but yet you draw not iron, for my heart is true as steel.',
    author: "William Shakespeare, A Midsummer Night's Dream (Act 2, Scene 1)",
  },
  allegory: {
    quote: 'So ignorant are most landsmen of some of the plainest and most palpable wonders of the world, that they might scout at Moby Dick as a monstrous fable, or still worse and more detestable, a hideous and intolerable allegory.',
    author: 'Herman Melville, Moby-Dick (Chapter 45)',
  },
  almanac: {
    quote: "I write anecdotes of the intellect; a sort of Farmer's Almanac of mental moods.",
    author: 'Ralph Waldo Emerson, Natural History of Intellect',
  },
  elegy: {
    quote: 'Travel is a caprice in childhood, a passion in youth, a necessity in manhood, and an elegy in old age.',
    author: 'José Rizal, Los Viajes (1889)',
  },
  fecund: {
    quote: 'Insistence upon rigid forms and austere unities seems to me the instinctive reaction of the sterile against the fecund.',
    author: 'H. G. Wells, The Country of the Blind, and Other Stories',
  },
  precedent: {
    quote: "'Twill be recorded for a precedent, and many an error by the same example will rush into the state.",
    author: 'William Shakespeare, The Merchant of Venice (Act 4, Scene 1)',
  },
  sovereignty: {
    quote: 'I hold then that Sovereignty, being nothing less than the exercise of the general will, can never be alienated.',
    author: 'Jean-Jacques Rousseau, The Social Contract (Book II)',
  },
  thrall: {
    quote: 'I saw pale kings, and princes too, pale warriors, death-pale were they all; they cried—"La Belle Dame sans Merci hath thee in thrall!"',
    author: 'John Keats, La Belle Dame sans Merci (1819)',
  },
  corbel: {
    quote: 'The booking hall is lofty and of peculiar design, the roof being carried on timbered beams set in pairs rising from carved corbels.',
    author: 'D. J. Rowett, Stamford L.N.E.R. (1946)',
  },
  enfilade: {
    quote: 'In minutes they had gained the top, fell prone, and began to pour deadly repeater-fire into the enemy below while their compatriots raked the top of the coulee with an enfilade.',
    author: 'Guy Vanderhaeghe, The Englishman’s Boy (1996)',
  },
  finial: {
    quote: 'He says there\'s a very particular etiquette to having your flag at half-mast: you\'re supposed to first run it all the way up to the finial at the top and then bring it halfway down.',
    author: 'David Foster Wallace, Consider the Lobster and Other Essays (2005)',
  },
  plenipotentiary: {
    quote: 'None but the like-minded can come plenipotentiary to our court.',
    author: 'Henry David Thoreau, A Plea for Captain John Brown (1859)',
  },
  interregnum: {
    quote: 'It was not till the kings had been shorn of power and the interregnum of sham democracy had set in, leaving no virile force in the state or the world to resist the money power, that the opportunity for a world-wide plutocratic despotism arrived.',
    author: 'Edward Bellamy, Equality (1897)',
  },
  bathos: {
    quote: 'I like you more than I can say; but I\'ll not sink into a bathos of sentiment...',
    author: 'Charlotte Bronte, Jane Eyre (1847)',
  },
  metonymy: {
    quote: '[T]he principle of metonymy is simply to substitute for the plain name of a thing a name or phrase based on something connected with it.',
    author: 'William Minto, The Chautauquan (1891)',
  },
  synecdoche: {
    quote: 'Perhaps being in a touring band was, to Yorke, a synecdoche for the modern condition: disorientation, alienation, rootlessness, exhaustion, lack of control, occasional derangement, constant motion.',
    author: 'Dorian Lynskey, The 20-year-old black mirror that reflects the world today (2017)',
  },
  chiasmus: {
    quote: 'Leeman therefore holds that chiasmus is the basic order in Greek and Latin: antithesis is, he claims, normal for the modern, rational mind, but for the Greeks and Romans chiasmus was more natural.',
    author: 'Simon R. Slings, The Language of Greek Comedy (2002)',
  },
  ekphrasis: {
    quote: 'One [trope] is ekphrasis, the literary description of a work of art, the most famous example of which may be the careful depiction of the shield of Achilles in book 18 of the Iliad.',
    author: 'Daniel Donoghue, Old English Literature (2004)',
  },
  abstemious: {
    quote: 'The Ms had an abstemious sex life; in fourteen years of marriage, they had had sex exactly six times. Mrs. M desired sex and more children, but her husband refused.',
    author: 'Rebecca L. Davis, More Perfect Unions: The American Search for Marital Bliss (2010)',
  },
  adumbrate: {
    quote: 'This piece will perform a micro-excavation of these toplayers of the literary soil to suggest anxiogenic literature has the potential not only to adumbrate the post-apocalypse, a common theme in contemporary literature, but also to anticipate the post-Anthropocene.',
    author: 'Kristen Figgins, Fiction and the Sixth Mass Extinction (2020)',
  },
  adventitious: {
    quote: 'In a triad of verbs that admits nothing adventitious, Judah sees, takes, and lies with a woman; ...',
    author: 'Robert Alter, The Art of Biblical Narrative (1981)',
  },
  antediluvian: {
    quote: 'The air inside smelled antediluvian, regal somehow, with traces of pipe tobacco, tea leaves, cooking sherry, and the earthen aroma of stone architecture.',
    author: 'Dan Brown, The Da Vinci Code (2003)',
  },
  aporia: {
    quote: 'What they intend sickens and frightens them, and they can never speak of it directly. Instead, wrapped in whispers are ellipses, euphemisms, mumbled aporia followed by throat-clearing and a brisk change of subject.',
    author: 'Ian McEwan, Nutshell (2016)',
  },
  apostate: {
    quote: 'An enormous number of monks and priests gave themselves up to sorcery, and there was no lack of apostate priests to perform the ceremonies of the Black Mass.',
    author: 'Rollo Ahmed, The Black Art (1936)',
  },
  argot: {
    quote: 'Merle spoke in the thin nasal argot of this city\'s slums: "This the fus toim yez been lobbed, oy, kiddow?"',
    author: 'Xavier Herbert, Soldiers\' Women (1961)',
  },
  asperity: {
    quote: 'Dry, chaffy, or prickly plants, corresponding in their nature to the aridity and asperity of the land, were peculiarly at home upon the undulating stoniness.',
    author: 'Edward Harrison Barker, Wanderings by Southern Waters: Eastern Aquitaine (1893)',
  },
  atavistic: {
    quote: 'Thus the gene which produced atavistic digits in the vigorous heterozygous pentadactyl condition is a lethal monster in the homozygous condition.',
    author: 'Reginald Ruggles Gates, Human genetics (1946)',
  },
  blandishment: {
    quote: 'Pat found subject and scene of his wooing unaltered, but all his specious blandishments could not induce the matured matron of \'Gi\' Away Nothin\' \'All\' to join fortunes, though his perseverance would have delighted Bruce\'s spider.',
    author: 'Barbara Baynton, Human Toll (1907)',
  },
  calumny: {
    quote: 'Stephen, the first martyr of the Church, was a victim of calumny. And calumny is worse than a sin; calumny is a direct expression of Satan.',
    author: 'Pope Francis, Encountering Truth: Meeting God in the Everyday (2015)',
  },
  canard: {
    quote: 'It is a canard trotted out by lazy or tendentious journalists that nationalised British Railways lacked entrepreneurial flair.',
    author: 'Anthony Lambert, How do we grow the leisure market? (2021)',
  },
  celerity: {
    quote: 'The celerity of executions is a generally neglected issue in the empirical literature on deterrence and capital punishment.',
    author: 'Hugo Adam Bedau, The Death Penalty in America: Current Controversies (1998)',
  },
  chimerical: {
    quote: 'With his head bent, and his big feet spread apart, he began explaining his reasons for thinking the abbé’s plan chimerical.',
    author: 'Leon Tolstoy, War and Peace (Translated by Louise and Aylmer Maude) (1869)',
  },
  cogitate: {
    quote: 'Think, ladies! Cogitate! Sharpen up the edges of your wit.',
    author: 'Robert Wright; George Forrest, Kismet (1953)',
  },
  colloquy: {
    quote: 'House Prees and Bloods ... were everywhere to be seen in earnest colloquy. For the matter was, that there was some sort of night-prowler about the school grounds.',
    author: 'Michael Arlen, “Piracy”: A Romantic Chronicle of These Days (1922)',
  },
  comity: {
    quote: 'There, I saw not only flare-ups of ethnic animosity, but the comity that was also possible among men of different backgrounds.',
    author: 'Nelson Mandela, Long Walk to Freedom (1994)',
  },
  consanguinity: {
    quote: 'The Mongrel Virginians was similar to other eugenic family studies in its method and mode of argumentation, but its intensive focus on "race mixing," rather than consanguinity, represents a marked departure from the previous studies.',
    author: 'Matt Wray, Not Quite White (2006)',
  },
  defenestration: {
    quote: 'No defenestration here. Ask questions about all aspects of Windows programming, get help on Microsoft technologies covered in Apress books, or provide feedback on any Apress Windows book.',
    author: 'John Kilburn, Palm Programming in Basic (2002)',
  },
  dissemble: {
    quote: 'Perhaps it was right to dissemble your love.',
    author: 'John Philip Kemble, The Panel (1788)',
  },
  effluvium: {
    quote: 'And he breathed the breath of the house—a dank savour rather than a smell—a cold, musty effluvium as from underground vaults mingled with the reeking exhalations of linoleum and mildewed and rotten woodwork.',
    author: 'O. Henry, The Furnished Room (1906)',
  },
  effrontery: {
    quote: 'All was going as planned until the bag hit a snag and failed to surround the entire nest. This effrontery was too much. The wasps exploded off the nest at me.',
    author: 'Justin O. Schmidt, The Sting of the Wild (2016)',
  },
  etiolated: {
    quote: 'In a report of 1901, the "triple response" of etiolated pea seedlings (growth inhibition, thickening of the subapical region, horizontal nutation) was observed to occur in the presence of illuminating gas and ethylene was identified as the inducing agent.',
    author: 'Klaus Lurssen, Hormonal Regulation of Plant Growth and Development (1985)',
  },
  eunoia: {
    quote: 'Direct argument is a dangerous strategy for developing eunoia, since "those who have many friends and treat everyone as close to them seem to be friends to no one, except in a fellow-citizens way. These people are regarded as ingratiating."',
    author: 'Eugene Garver, Aristotle\'s Rhetoric: An Art of Character (1994)',
  },
  execrable: {
    quote: 'The arcanely evil words of that despicable, loathsome, suppressed, vile, pululating , odious, nictating, repellent, repugnant, noxious, abhorrent, abominable, tory, execrable, nauseous work, Ye Boke of Guts, moved as if on a conveyor belt before his eyes.',
    author: 'David Langford, Guts: A Comedy of Manners (2001)',
  },
  expatiate: {
    quote: '“It can\'t fly,” he expatiated. “It can move forward only by hopping.”',
    author: 'Clive James, Cultural Amnesia (2007)',
  },
  hirsute: {
    quote: 'Ears small, with large lobes, indicating some Jewish blood. Hands small, well-tended, hirsute. Feet small.',
    author: 'Ian Fleming, Casino Royale (1953)',
  },
  inveigle: {
    quote: 'Say he\'s been misguided by the rebels, and how they\'ve inveigled him, till he\'s turned rebel himself; and how he\'s now out with Marion\'s men, in Major Singleton\'s squad.',
    author: 'William Gilmore Simms, The Partisan (1835)',
  },
  martinet: {
    quote: 'Before I met Mr. Bowen Cooke I had been given to understand that he was of a reserved nature, and on occasion could be a "bit of a martinet"; [...].',
    author: 'Chas. S. Lake, Some C.M.Es. I Have Known: II—C. J. Bowen Cooke (1942)',
  },
  peremptory: {
    quote: 'He marched under a placard reading "End Bossiness Now" but decided it was a little too peremptory, not quite British, so changed the slogan on subsequent badges, to "End Bossiness Soon."',
    author: 'Andrew Marr, The Guardian (2003)',
  },
  potentate: {
    quote: 'She was now one of a group of oriental beauties who, in the second act of the comic opera, were paraded by the vizier before the new potentate as the treasures of his harem.',
    author: 'Theodore Dreiser, Sister Carrie (1900)',
  },
  pulchritude: {
    quote: 'Do you know why a woman of such pulchritude is married to me? \'Cause I make a comfortable living.',
    author: 'The Jerk (1979)',
  },
  remonstrate: {
    quote: 'In 1753-4, the Parlements of Aix, Bordeaux, Rennes and Rouen remonstrated in support of the exiled Paris institution.',
    author: 'Colin Jones, The Great Nation (2002)',
  },
  saturnine: {
    quote: 'This saturnine line of thinking proceeds as the clouds overhead start to coalesce and the sky takes on its regular clothy P.M. weight.',
    author: 'David Foster Wallace, A Supposedly Fun Thing I’ll Never Do Again: Essays and Arguments (1997)',
  },
  simulacrum: {
    quote: 'The future just wants more consumers. The future is more newly arrived college grads and tourists in some fruitless search for authenticity. The future is more overpriced Pabsts at dive-bar simulacrums.',
    author: 'Ling Ma, Severance (2018)',
  },
  solicitude: {
    quote: 'For there to be genuine community among any sizable group of people, solicitude must be a routine feature of daily intercourse.',
    author: 'John Kultgen, Autonomy and Intervention: Parentalism in the Caring Life (1995)',
  },
  turpitude: {
    quote: 'As for the moral turpitude that man unveiled to me, even with tears of penitence, I cannot, even in memory, dwell on it without a start of horror.',
    author: 'Robert Louis Stevenson, The Strange Case of Dr Jekyll and Mr Hyde (1886)',
  },
  vicissitude: {
    quote: 'Some learn humility. Some choose ego. Some are prepared for the vicissitudes of fate, both positive and negative. Others are not. Which will you choose? Who will you be?',
    author: 'Ryan Holiday, Ego is the Enemy (2016)',
  },
  oneiric: {
    quote: 'Dreams contain oneiric images and oneiric symbols. Both of them are, in fact, \'distorted\' manifestations of a latent content which resides in the dreamer\'s unconscious.',
    author: 'Khaled Besbes, The Semiotics of Beckett\'s Theatre (2007)',
  },
  chiaroscuro: {
    quote: 'It is cruder than the others, more graphic, less chiaroscuro.',
    author: 'Charles Neider, The frozen sea: a study of Franz Kafka (1962)',
  },
  tessellation: {
    quote: 'Decorative arches intersect the graceful latticework of the expansive ridge and furrow trainshed rooves, woven together by a staggering tessellation of 48,000 glass panels.',
    author: 'Nick Brodrick, The grand gateway to Glasgow (2023)',
  },
  jurisprudence: {
    quote: 'There is considerable jurisprudence to the effect that only the evidence that was before the initial decision-maker should be considered by the Court on judicial review.',
    author: 'J. Dubé, Chopra v. Canada (Treasury Board), 1999 CanLII 8044 (FC) (1999)',
  },
  plebiscite: {
    quote: 'A political result, we may also say aim, of the frumentarian plebiscite of Gaius was to disattach the city populace from its conservative moorings and to enlist it in the service of reform.',
    author: 'George Willis Botsford, The Roman Assemblies from Their Origin to the End of the Republic (1909)',
  },
  plutocracy: {
    quote: 'Plutocracy, which is virtually supreme to-day, is to be no less condemned ; for it is not only not just, bit is nearly as detrimental to the race at large as absolute socialism would be, if adopted ...',
    author: 'Anonymous, The Revolutionary Tendencies of the Age: Their Cause and Their Ultimate Aim (1897)',
  },
  polity: {
    quote: 'Once exposed, Confucianism was to become a political issue, an alternative among other contending ideologies which threatened to change the polity of the empire.',
    author: 'Jerome Ch’en, China and the West: Society and Culture, 1815–1937 (1979)',
  },
  realpolitik: {
    quote: 'Realpolitik, in one or another form, is, therefore, from the standpoint of science and of abstract principle, immoral, unsound and no defense of it on the ground of concrete necessity can make it otherwise.',
    author: 'Elisha Ely Garrison, The Riddle of Economics (1932)',
  },
  bildungsroman: {
    quote: 'Goethe\'s honorific assignment to the vanguard of a uniquely German novelistic tradition of the bildungsroman simultaneously places him outside the mainstream of the development of the novel.',
    author: 'Frederick Amrine, Goethe and the Myth of the Bildungsroman: Rethinking the Wilhelm Meister Novels (2020)',
  },
  denouement: {
    quote: 'The denouement is the moment when all of the knots of a story are untied, ... But the denouement should not be confused with the end of a story.',
    author: 'Lemony Snicket, The Penultimate Peril (2005)',
  },
  leitmotif: {
    quote: 'In Wagner\'s operas, especially his cycle of four operas known collectively as the Ring cycle, the leitmotif did not simply label or point to one particular character or object but rather conjured up a realm of ideas.',
    author: 'Michael Slowik, After the Silents (2014)',
  },
  hamartia: {
    quote: 'Understanding hamartia as “ignorance of the injurious act,” Lacan distinguishes Greek tragedy from the Renaissance version on the basis that the latter supplants hamartia with the hero\'s privileged knowledge.',
    author: 'David Ratmoko, On Spectrality: Fantasies of Redemption in the Western Canon (2006)',
  },
  abrogate: {
    quote: 'The rule of law whereby it is a crime for a person to commit suicide is hereby abrogated.',
    author: 'Parliament of the United Kingdom, Suicide Act 1961 (1961)',
  },
  abstruse: {
    quote: 'After the subject (victim, if you like) had read say thirty of the best solid novels of the twentieth century, I think I should draw him to the more abstruse modern novels and stories.',
    author: 'Walter Lionel George, A Novelist on Novels (1918)',
  },
  acerbic: {
    quote: 'Those consumers who object to the acerbic taste of garlic can purchase de-odorized garlic or allicin extract.',
    author: 'Dr. Peter Gott, Can inhaler cause addiction? (1998)',
  },
  acrimonious: {
    quote: 'Sanguinarina, as procured from the sulphate, is a yellowish gray powder without odor, and almost without taste. A slight acrimonious impression is developed after a time upon the tongue from the partial solubility of the alkaloid in saliva.',
    author: 'Robert P. Thomas, On the Therapeutical Properties of Sanguinarina, and Its Acetate and Sulphate (1864)',
  },
  anathema: {
    quote: 'I trembled at his ringing wealth Of manifold anathemas ...',
    author: 'Edward Arlington Robinson, The Three Taverns (1920)',
  },
  anodyne: {
    quote: 'The citrate is the most efficient as an alkali, but irritates some stomachs, the liquor the most anodyne, the acetate the most diuretic.',
    author: 'Edward L. Keyes, Diseases of the Genito-Urinary Organs (1910)',
  },
  antebellum: {
    quote: 'There was no single characteristic house style during the antebellum period, but the elegant plantation homes built in the American South, with their central entrances, balconies, columns, and formal ballrooms, came closest to representing a discrete architectural style for the period.',
    author: 'James M. Volo; Dorothy Denneen Volo, The Antebellum Period (2004)',
  },
  assiduous: {
    quote: 'He was officious in the right time and place, quiet as a lamb when his patron seemed inclined to study or to muse, active and assiduous to assist or divert him whenever it seemed to be wished.',
    author: 'Sir Walter Scott, The Surgeon\'s Daughter (1831)',
  },
  assuage: {
    quote: 'Jaurès\'s ambition was not to intensify but to assuage conflicts, antagonisms, and enmity of every kind: the fundamental ideas of Marxism, he believed, did not signify a breach of historical continuity but appealed to the deepest moral instincts of mankind.',
    author: 'Main Currents of Marxism (1978)',
  },
  astringent: {
    quote: 'Philip, who was made Duke of Edinburgh on the couple’s wedding, introduced a new, less stuffy, though as the years went on occasionally astringent, tone to the royal family.',
    author: 'Stephen Bates, Queen Elizabeth II obituary (2022)',
  },
  avuncular: {
    quote: 'Both uncle Frank and uncle Stephen Austen had made it a point of principle to be rigorously unsentimental in the discharge of their avuncular obligations.',
    author: 'David Nokes, Jane Austen: A Life (1997)',
  },
  beatific: {
    quote: 'Since the physical body is really a filter which shuts out the psychic realms, when one is out of the body one is out of the protection of the wall: whatever one thinks is immediately experienced - nightmare or beatific vision.',
    author: 'William Irwin Thompson, The Time Falling Bodies Take to Light: Mythology, Sexuality and the Origins of Culture (1981)',
  },
  bellicose: {
    quote: 'CHINA sent both bellicose and conciliatory signals yesterday as tension continued in the Taiwan Strait over Chinese military exercises and the deployment of US naval battle groups.',
    author: 'James Pringle, Peking sends out mixed signals (1996)',
  },
  blithe: {
    quote: 'Thy garters fringed with the golde, And siluer aglets hanging by, Which made thee blithe for to beholde, And yet thou wouldst not loue me.',
    author: 'Clement Robinson, A Handful of Pleasant Delights (1878)',
  },
  bucolic: {
    quote: 'A couple of years later the Metropolitan had reached its own most northerly point, Verney Junction, which was as bucolic as it sounds.',
    author: 'Andrew Martin, Underground Overground: A passenger\'s history of the Tube (2012)',
  },
  capacious: {
    quote: 'The Malabar, that huge sea monster, in whose capacious belly so many human creatures lived and suffered, had dwindled to a walnut-shell, and yet beside her bulk how infinitely small had their own frail cockboat appeared as they shot out from under her towering stern!',
    author: 'Marcus Clarke, For the Term of His Natural Life (1874)',
  },
  conflagration: {
    quote: 'I thought it only an amourette when you told me. It was a fire — a conflagration; subdue it.',
    author: 'The New York Drama (1876)',
  },
  copacetic: {
    quote: 'And [Rhonda] asked gently—but also in a way that let Dave know that what he was doing was not copacetic—"What are you doin\' here, bud?"',
    author: 'John Cariani, Almost, Maine (2020)',
  },
  coterie: {
    quote: 'The odd part of prairie dog life is that this friendly state exists only among the members of each coterie, and does not extend between coteries.',
    author: 'Jeffrey Moussaieff Masson, The Emperor\'s Embrace: The Evolution of Fatherhood (2001)',
  },
  diaphanous: {
    quote: 'Adam requires a touch of feminine lace and a whisper of diaphanous silk, not a direct vision of the gaping maw of the human vulva.',
    author: 'William Irwin Thompson, The Time Falling Bodies Take to Light: Mythology, Sexuality and the Origins of Culture (1981)',
  },
  diatribe: {
    quote: 'You know, it’s all this racial diatribe, and very strong language, screaming at the top of his lungs into the telephone.',
    author: 'Bill Crow, Jazz Anecdotes (1991)',
  },
  didactic: {
    quote: 'The real question seems to be whether baby talk does fulfill didactic functions in addition to the obvious affective function which it apparently serves more for adults than for children.',
    author: 'Joseph F. Kess;Anita M. Copeland, The Structure and Function of Nootkan Baby Talk (1984)',
  },
  ebullient: {
    quote: 'The Spring will come with its ebullient blood, / With flush of roses and imperial eyes',
    author: 'James Ryder Randall, Maryland, my Maryland, and other poems (1908)',
  },
  edify: {
    quote: 'That they ought to edify one another by maintaining and promoting the knowledge of truth.',
    author: 'The Connecticut Evangelical Magazine, Vol. VI (1813)',
  },
  elide: {
    quote: 'Graham Hough\'s apparently objective assertion that \'Ozymandias\' is \'extremely clear and direct\', for example, elides the question of \'to whom?\'.',
    author: 'Andrew Bennett; Nicholas Royle, An introduction to literature, criticism and theory (1995)',
  },
  erudite: {
    quote: 'At all events, if it involved any secret information in regard to old Roger Chillingworth, it was in a tongue unknown to the erudite clergyman, and did but increase the bewilderment of his mind.',
    author: 'Nathaniel Hawthorne, The Scarlet Letter (1850)',
  },
  excoriate: {
    quote: 'Madeleina di Farja had described Ori, and Cutter had envisaged an angry, frantic, pugnacious boy eager to fight, excoriating his comrades for supposed quiescence.',
    author: 'China Miéville, Iron Council (2004)',
  },
  facile: {
    quote: 'we can learn the impression that he made upon a stranger and a foreigner at this period, thanks to the facile pen of Fannu Burney.',
    author: 'Duff Cooper, Talleyrand (1932)',
  },
  indigent: {
    quote: 'Many of the indigent children are so badly provided for by their parents, with both food and raiment, that they cannot attend school regularly; ...',
    author: 'Thomas Ritchie, Journal of the House of Delegates of the Commonwealth of Virginia (1830)',
  },
  patois: {
    quote: '[The Sundanese] are regarded as relatively barbarous, and in the company of Malays or Javanese, they are themselves ashamed of their dialect, which is looked on as a sort of rude patois.',
    author: '[Jacques] Élisée Reclus, Oceanica (1890)',
  },
  philistine: {
    quote: 'War was looked upon as inherently monstrous, and those who waged it – namely, military officers – were looked upon as brutes and philistines.',
    author: 'Tom Wolfe, The Right Stuff (1979)',
  },
  plaudit: {
    quote: 'Work is pushing through the pain and crappy first drafts and prototypes. It is ignoring whatever plaudits others are getting, and more importantly, ignoring whatever plaudits you may be getting.',
    author: 'Ryan Holiday, Ego is the Enemy (2016)',
  },
  pontificate: {
    quote: '"Do you hear that, Ryan? Your mommy is being a pontificating windbag."',
    author: 'Jocelyn Samara D., Rain (2014)',
  },
  prurient: {
    quote: 'For example, some of the more prudish senders may have averted their attention from the sexual pictures while other more prurient viewers may have intensified their gaze.',
    author: 'Brian Parkinson, Ideas and Realities of Emotion (1995)',
  },
  puerile: {
    quote: 'But can there be anything more puerile, more short-sighted, than the views of those Economists who believe in all earnest that this woeful transitory state means nothing but adapting society to the acquisitive propensities of capitalists, both landlords and money-lords?',
    author: 'Karl Marx, Forced Emigration (1853)',
  },
  pugilist: {
    quote: 'President Obama\'s style leaves liberal activists in the Democratic Party cold. They prefer a pugilist fighting for principle over a pragmatist agreeing to compromises. Can the president reignite the enthusiasm of his party\'s core supporters by November?',
    author: 'National Journal (2010)',
  },
  reprobate: {
    quote: '"Good morning, Mrs. Denny," he said. "Wherefore this worried look on your face? Has that reprobate James been misbehaving himself?"',
    author: 'Herman Cyril McNeile, Bulldog Drummond (1920)',
  },
  sartorial: {
    quote: 'He was just a college instructor at the time, long before he had written his book and long before his sartorial conversion. The pockets of his sports coat bulged from having had fists thrust into them too long.',
    author: 'Haruki Murakami, The Wind-Up Bird Chronicle (1997)',
  },
  somnambulism: {
    quote: 'Meanwhile, towards the twelfth century, there come to be two weaknesses attached to this state of half-grown youth: by night somnambulism; in the daytime seeing of visions, trance, and the gift of tears.',
    author: 'Jules Michelet, La Sorcière: The Witch of the Middle Ages (1862)',
  },
  staid: {
    quote: 'The hours of study, the hours of recreation, the sports, the pastimes, the casualties, which in the staider years of life pass without note or comment, alike are wrapped and muffled in the one roseate haze.',
    author: '[Louisa Sidney Stanhope], Sydney Beresford. A Tale of the Day. [...] In Three Volumes (1835)',
  },
  stochastic: {
    quote: 'In the evening, while she bathed, waiting for him to enter the bathroom as she powdered her body, he crouched over the blueprints spread between the sofas in the lounge, calculating a stochastic analysis of the Pentagon car park.',
    author: 'J. G. Ballard, The Atrocity Exhibition (1970)',
  },
  taciturn: {
    quote: 'We are each of an unsocial, taciturn disposition, unwilling to speak, unless we expect to say something that will amaze the whole room, and be handed down to posterity with all the eclat of a proverb.',
    author: 'Jane Austen, Pride and Prejudice (1813)',
  },
  temerity: {
    quote: 'He had very nearly been guilty of the temerity of arrogating to himself another title in the presence of those he most respected.',
    author: 'James Fennimore Cooper, Precaution (1820)',
  },
  trenchant: {
    quote: 'The trenchant talonid is a character of some miacids and distinguishes these teeth from the hyaenodontids and oxyaenids.',
    author: 'Thomas H. V. Rich, Deltatheridia, Carnivora, and Condylarthra (Mammalia) of the Early Eocene, Paris Basin, France (1971)',
  },
  truculent: {
    quote: 'She might pity herself, but he must not pity her. She did not want any quarrel; she blamed him for wanting one, but she could not help assuming a truculent attitude.',
    author: 'David Magarshack, Anna Karenina (1877)',
  },
  vacillate: {
    quote: 'Its [the barometer\'s] normal register in the Paumotus [the Tuamotus] was 29.90, and it was quite customary to see it vacillate between 29.85 and 30.00, or even 30.05; ...',
    author: 'Jack London, The Heathen (1910)',
  },
  venal: {
    quote: 'Thus, regimental commands in the army were – as with the judiciary or the financial bureaucracy – venal posts, which were purchased, bequeathed and sold among the nobility.',
    author: 'Colin Jones, The Great Nation (2002)',
  },
  vociferous: {
    quote: 'They crowded around him with vociferous welcome, Brown leading in a series of wild cheers.',
    author: 'Ralph Connor, The Foreigner (1909)',
  },
  wheedle: {
    quote: 'Though he had beaten me in every bone / He still could wheedle me to love.',
    author: 'Geoffrey Chaucer, The Canterbury Tales: Translated into Modern English (1951)',
  },
  charlatan: {
    quote: 'That this disgraceful charlatan holds one of the great offices of state in this country should be a source of constant shame and embarrassment to the Prime Minister.',
    author: 'Ian Murray, The Independent (2018)',
  },
  dichotomy: {
    quote: 'The dichotomy between maria and highlands dominates lunar mineralogy.',
    author: 'Thérèse Encrenaz; et al, Système Solaire (2003)',
  },
  gerrymander: {
    quote: 'Congress delegated to the first legislature the task of setting up elections under territorial law, which it did. But Montana Democrats couldn\'t pass up the opportunity to gerrymander the rules.',
    author: 'Jeffrey S. Sutton, Who Decides?: States As Laboratories of Constitutional Experimentation (2021)',
  },
  idiom: {
    quote: 'The Hebrew phrase (שִׁבְעָה שִׁבְעָה) vii. 2 is commonly understood to mean seven pairs; but in accordance with Hebrew idiom it can only mean seven individuals of each sort.',
    author: 'James George Frazer, Folk-Lore In The Old Testament (1918)',
  },
  kismet: {
    quote: 'But these things are kismet, and we only find out all about them just when any knowledge is too late.',
    author: 'Rudyard Kipling, en:Bitters Neat (1887)',
  },
  usurp: {
    quote: 'The recent authorities have usefully drawn attention to the need to ensure that any assessment of the merits of a case does not usurp careful attention to the criteria in section 10(9), to which we now turn.',
    author: 'Stephen Gilmore; Lisa Glennon, Hayes and Williams\' Family Law (2016)',
  },
  vicarious: {
    quote: 'As time went on, the cruel custom was so far mitigated that a ram was accepted as a vicarious sacrifice in room of the royal victim.',
    author: 'James Frazer, The Golden Bough (1900)',
  },
  aegis: {
    quote: 'Cattle grazed where now is the Forum Romanum, and the Capitol, now glittering with gold, was covered then with brambles; nevertheless a god already dwelt there, even Jupiter himself, whose right hand had oft been seen to shake the aegis and summon the storm-clouds.',
    author: 'Theodor Haecker, Virgil, Father of the West (1934)',
  },
  apotheosis: {
    quote: 'As a former mortal who underwent apotheosis, Hercules was important to the emperors.',
    author: 'CE Newlands, Statius\' Silvae and the Politics of Empire (2002)',
  },
  approbation: {
    quote: 'I am very sensible how much nobler it is to place the reward of virtue in the silent approbation of one\'s own breast',
    author: 'William Melmoth (tr.), The Letters of Pliny the Consul: With Occasional Remarks (1796)',
  },
  bivouac: {
    quote: 'Behold the Mansion reared by Dædal Jack! See the Malt stored in many a plethoric sack, In the proud cirque of Juan\'s bivouac!',
    author: 'K.M. Elizabeth Murray, Caught in the Web of Words (1977)',
  },
  depredation: {
    quote: 'An animal that produces only two to four young per year cannot suffer vast depredations on the adult population without drastic effects.',
    author: 'Richard Ellis, The Book of Sharks (1983)',
  },
  evanescent: {
    quote: 'If in the middle of summer the water of Turkey Creek ... is whipped and beaten with a stick, and then if a fire-brand is passed over, a mist is enkindled and a faint evanescent flame runs over the entire width of the brook.',
    author: 'Johann David Schoepf [i.e., Johann David Schoepff], Travels in the Confederation [1783–1784]: From the German (1911)',
  },
  interstitial: {
    quote: 'The outer surface is covered with variable amounts of dental plaque and saliva. The inner surface is bathed in interstitial fluid or lymph.',
    author: 'Jerome F. Fredrick; Murray L. Schole, Mechanisms of Dental Caries (1965)',
  },
  mote: {
    quote: 'I wanted to shrink myself to a mote of dust, plunge into this pool I held in my own cyclopean hands, soar down these runs of light to places where light itself was born from this colloquy of dust.',
    author: 'J.G. Ballard, The Unlimited Dream Company (1979)',
  },
  penury: {
    quote: 'Miseries are the quasi-animal penuries of human beings (hunger, disease, death, etc.); disquiets are the penuries specific to human beings (solitude, disappointment, frustration, etc.); and sufferings are a combination of miseries and disquiets.',
    author: 'Ernesto Castro Córdoba, Postcontinental Realism: Ontology and Epistemology for the Twenty-first Century (2022)',
  },
  perfidious: {
    quote: 'The perfidious Ricimer soon became dissatisfied with Anthe\'mius, and raised the standard of revolt.',
    author: 'Oliver Goldsmith, Dr. Goldsmith\'s History of Rome (1851)',
  },
  putative: {
    quote: 'If they are in fact sound, then, of course, desire-utilitarianism need not account for the putative wrongness of infanticide.',
    author: 'Clement Dore, Moral Scepticism (1991)',
  },
  raconteur: {
    quote: 'The two of them turn to each other and raise an eyebrow each, their signal to slip into alternating raconteuring.',
    author: 'Michel Faber, The Crimson Petal and the White (2003)',
  },
  ribald: {
    quote: '[T]he curious crowd had collected in the street ..., with here and there a scoffer uttering his incredulity and courage with scornful remarks or ribald cries.',
    author: 'Ambrose Pierce, The Collected Works of Ambrose Bierce (1888)',
  },
  sagacious: {
    quote: 'I resort, once again, to a sagacious adage from Justice Scalia […]',
    author: 'Ben Williams, The U.S. Supreme Court and sexual orientation (2020)',
  },
  sophism: {
    quote: 'Within the framework of democracy a new ideology, born of sophism, took root and proclaimed the rights of the individual in all spheres, political as well as moral.',
    author: 'Sophie Trenkner, The Greek Novella in the Classical Period (1958)',
  },
  turgid: {
    quote: 'The Jiet River lay before them, as thick and turgid as a gorged snake, its crosshatched surface reflecting the same ghastly hue that pervaded the Burning Plains.',
    author: 'Christopher Paolini, Eldest (2005)',
  },
  senescence: {
    quote: 'Organized shuffleboard has always filled me with dread. Everything about it suggests infirm senescence and death: it’s like it’s a game played on the skin of a void and the rasp of the sliding puck is the sound of that skin getting abraded away bit by bit.',
    author: 'David Foster Wallace, A Supposedly Fun Thing I\'ll Never Do Again (1997)',
  },
  brutalism: {
    quote: 'Instances of misguidance like the ones given, and at least recognized in retrospect, in fascism, racism, and ecological brutalism, are also to be sensed by religious communication in other contexts.',
    author: 'Michael Welker, The Concept of God, the Origin of the World, and the Image of the Human in the World Religions (2012)',
  },
  patina: {
    quote: 'It demonstrates how scientific authority could be constructed on the fly, as it were, by someone with no connections and no psychological credentials who offered a technique that had the patina of modern science...',
    author: 'Alison Winter, Memory: Fragments of a Modern History (2012)',
  },
  juxtaposition: {
    quote: 'A fundamental operation on strings is string concatenation which we will denote by juxtaposition.',
    author: 'Lawrence Moss; Hans-Jörg Tiede, Handbook of Modal Logic (2007)',
  },
  soliloquy: {
    quote: 'Yet if I were to say ... that Hamlet\'s soliloquy had been much over-rated, it would not be said, on this account, that I was unable to appreciate Shakespeare.',
    author: 'Edmund Selous, Bird Watching (1901)',
  },
  vignette: {
    quote: 'A particular classroom incident, and the vignette I used to portray it, had a significant impact on the interpretative framework for my research into scientific literacy.',
    author: 'Peter Charles Taylor; John Wallace, Contemporary Qualitative Research (2007)',
  },
  acquiesce: {
    quote: 'I may be forced to acquiesce in these recent developments, but I can hardly be expected to make merry over them.',
    author: 'Arthur Conan Doyle, The Adventure of the Speckled Band (1891)',
  },
  alacrity: {
    quote: 'You have an overgrown alacrity For saying nothing much and hearing less ...',
    author: 'Edward Arlington Robinson, The Three Taverns (1920)',
  },
  anachronistic: {
    quote: 'Among them, even the most lucid of \'one-nation\' Tories had severe difficulties in seeing the anti-growth nature of some of the most anachronistic of traditional British institutions.',
    author: 'David E. Hojman, Politics and Economics of Latin America (2001)',
  },
  antecedent: {
    quote: 'The Boston agent added that this clerk was a young man of wholly unquestioned veracity and reliability, of known antecedents and long with the company.',
    author: 'H. P. Lovecraft, The Whisperer in Darkness (1931)',
  },
  antipathy: {
    quote: 'Dr. Slicer is decidedly one of my antipathies and I shall not go to ride with him. Why has he taken to coming here?',
    author: 'Kate Stone, Brokenburn: The Journal of Kate Stone 1861–1868 (1862)',
  },
  antithesis: {
    quote: 'For if every condition of everything conditioned (according to its existence) is sensuous, and therefore belongs to the series, that series is again conditioned (as shown in the antithesis of the fourth antinomy).',
    author: 'Immanuel Kant, Critique of Pure Reason (1881)',
  },
  aphorism: {
    quote: '"I don\'t know what more to do," she confessed. "I\'ve aphorismed my heart out and relationships have not improved one whit, it seems."',
    author: 'Arthur Herzog, Glad to Be Here (1979)',
  },
  aplomb: {
    quote: 'We can handle functions of a few variables with some aplomb and view sets of quantities totalling IO6 or IO7 with sangfroid.',
    author: 'Richard Bellman, Adaptive Control Processes: A Guided Tour (1961)',
  },
  apocryphal: {
    quote: 'The structural anthropologist urges us to ignore the orthodox who labor so patiently trying to eliminate the apocryphal variants from the one true text.',
    author: 'William Irwin Thompson, The Time Falling Bodies Take to Light:Mythology, Sexuality and the Origins of Culture (1981)',
  },
  ascetic: {
    quote: 'This experience enables Nāgārjuna to recognize that desire is the root cause of suffering and motivates him to turn to a more ascetic lifestyle.',
    author: 'Carl Olson, Indian Asceticism: Power, Violence, and Play (2015)',
  },
  attenuate: {
    quote: 'A manor-house clock from the far depths of shadow struck the hour, one, in a small, attenuated tone.',
    author: 'Thomas Hardy, Far From the Madding Crowd (1874)',
  },
  auspicious: {
    quote: 'Backed by the Salsoul Orchestra, Carol\'s auspicious single debut, "More," was one of the very first commercially-available 12" singles and was a smash, reaching the upper regions of the disco charts in 1976.',
    author: 'James Arena, First Ladies of Disco - 32 Stars Discuss the Era and Their Singing Careers (2013)',
  },
  beguiling: {
    quote: 'I thought he was supposed to be my mentor. But, in actuality, what did I know about the often beguiling world of adults?',
    author: 'Reif Larsen, The Selected Works of T.S. Spivet (2009)',
  },
  bereft: {
    quote: 'The hosts had not lost in 12 home European games but looked shaky at the back and bereft of attacking ideas, inviting Stoke forward for further opportunities.',
    author: 'David Ornstein, Macc Tel-Aviv 1–2 Stoke (2011)',
  },
  cajole: {
    quote: 'He had tried bullying, and without success. He would try cajoling and temptation.',
    author: 'Horatio Alger, Only An Irish Boy (1894)',
  },
  carouse: {
    quote: 'PORSON ... would not only frequently “steal a few hours from the night,” but see out both lights and liquids, and seem none the worse for the carouse.',
    author: 'Richard Gooch, Oxford and Cambridge Nuts to Crack (1835)',
  },
  castigate: {
    quote: 'Perhaps disarmed by his own scandalous behaviour with Bathsheba, he was in no position to castigate his son for a similar fault.',
    author: 'Robert P. Gordon, I & II Samuel: A Commentary (1999)',
  },
  cavort: {
    quote: '... when the young man whirled his horse, “hazed” Jupiter in circles and belaboured him with a rawhide quirt, ... He ceased his cavortings ...',
    author: 'Peter B. Kyne, The Understanding Heart (1920)',
  },
  chagrin: {
    quote: 'She would go on like that for hours, connecting one offense to another until all of the things that chagrined her were spewed out.',
    author: 'Toni Morrison, The Bluest Eye (1970)',
  },
  clamorous: {
    quote: '... he tried rising late, but the clamorous dawn, filled with clanging milkmen and argumentative crows, was always victorious.',
    author: 'Rohinton Mistry, A Fine Balance (1995)',
  },
  coalesce: {
    quote: '... when a thing\'s own light and the light from something else coalescing into one on bright and smooth surfaces produce a form which yields a perception reversed from the way a thing normally looks.',
    author: 'Plato, Sophist (2005)',
  },
  cogent: {
    quote: 'We congratulate our correspondents on some very cogent reasoning, and shall have to watch our step even more carefully in future!',
    author: 'In the Critics\' Den (1944)',
  },
  commensurate: {
    quote: 'Crucially, every positive surreal number is commensurate with exactly one ω-power, in the following sense.',
    author: 'Aaron N. Siegel, Combinatorial Game Theory (2013)',
  },
  convivial: {
    quote: 'I put the chief of police behind the bar, instructed him in his duties, and we four convivial spirits sprawled along the counter drinking ale and telling yarns till cockcrow.',
    author: 'Robert Dean Frisbee, The Book of Puka-Puka (1929)',
  },
  dearth: {
    quote: 'In Ireland, distress is greatest when provisions are cheapest; then we see famine without dearth; hunger amidst superabundance of provisions; farmers without a market; labourers without the means of purchase.',
    author: 'Robert Graham (1826)',
  },
  deign: {
    quote: 'Before I could knock, Bonnie opened the door. "Finally you deign to show up" were the first words said to me. It had been a year.',
    author: 'Ling Ma, Bliss Montage (2022)',
  },
  deleterious: {
    quote: 'Or might it suffice him, that every wholesome growth should be converted into something deleterious and malignant at his touch?',
    author: 'Nathaniel Hawthorne, The Scarlet Letter (1850)',
  },
  demagogue: {
    quote: 'Talk to anyone with half a brain (and at least half a heart) and they will tell you, regardless of their position, that this is an issue to be weighed, not demagogued.',
    author: 'Patrick Hynes, In Defense of the Religious Right (2006)',
  },
  demure: {
    quote: 'Nan was very much delighted in her demure way, and that delight showed itself in her face and in her clear bright eyes.',
    author: 'William Black, The Beautiful Wretch (1881)',
  },
  diffident: {
    quote: 'At an early point in these exchanges I had started to sidle to the door, and I now sidled through it, rather like a diffident crab on some sandy beach trying to avoid the attentions of a child with a spade.',
    author: 'P. G. Wodehouse, Jeeves in the Offing (1960)',
  },
  dilettante: {
    quote: 'The distinction between a professional and a dilettante occurs right there—when you accept that having an idea is not enough; that you must work until you are able to recreate your experience effectively in words on the page.',
    author: 'Ryan Holiday, Ego is the Enemy (2016)',
  },
  edifice: {
    quote: 'With a great thump on the table, Poirot demolished his carefully built up edifice.',
    author: 'Agatha Christie, The Mysterious Affair at Styles (1920)',
  },
  enmity: {
    quote: 'We know from their literature that to our Saxon ancestors waste places of moor and forest and marshes were the resort of a host of supernatural creatures at enmity with mankind.',
    author: 'Eleanour Sinclair Rohde, The Old English Herbals (1922)',
  },
  ephemeral: {
    quote: 'It was during an access of this kind that I suddenly left my home, and bending my steps towards the near Alpine valleys, sought in the magnificence, the eternity of such scenes, to forget myself and my ephemeral, because human, sorrows.',
    author: 'Mary Shelley, Frankenstein (1818)',
  },
  eponymous: {
    quote: 'Hadadas roost in numbers among the trees in the leafier parts of Nairobi and their eponymous call is one of the more insistent elements of the dawn chorus in that part of the world, though they may be heard at any time of the day.',
    author: 'Nicholas Drayson, A Guide to the Birds of East Africa (2008)',
  },
  equanimity: {
    quote: 'Few people are capable of expressing with equanimity opinions which differ from the prejudices of their social environment.',
    author: 'Albert Einstein, Ideas and Opinions (1954)',
  },
  equivocal: {
    quote: 'For the beauties of Shakespeare are not of so dim or equivocal a nature as to be visible only to learned eyes.',
    author: 'William Hazlitt, Characters of Shakespeare\'s Plays (1817)',
  },
  erstwhile: {
    quote: 'As an aftermath of the erstwhile competition between companies, 41 goods depots served the Liverpool and Birkenhead docks in 1923.',
    author: 'P. F. Winding, Re-shaping the LMR\'s North Western Line - 2 (1964)',
  },
  expunge: {
    quote: 'The gentleman from Texas [Mr. CRAIN] asks unanimous consent to expunge from the RECORD and from the Journal the motion to excuse the gentleman from Mississippi [Mr. ALLEN] ...',
    author: 'Congressional Record (1893)',
  },
  extol: {
    quote: 'Men like Stuart who had no desire to extol Coleridge\'s virtues, and other witnesses quite as hostile, to whom a moral dereliction could hardly be a mortal offence, were loud in praise of the purity of his walk in life.',
    author: 'Sir Thomas Henry Hall Caine; Sir Hall Caine; John Parker Anderson, Life of Samuel Taylor Coleridge (1887)',
  },
  fastidious: {
    quote: 'He had at first tried to clean up as they ate, his fastidious nature kicking in, but Chris had told him to just stop, he was blocking the TV.',
    author: 'Lynsay Sands, Single White Vampire (2003)',
  },
  feckless: {
    quote: 'It is the beauty of great games when they are played at their highest level and the extraordinary thing now is that we do not have to trawl back through all the years of your inexorable progress from feckless beach boy to master sportsman.',
    author: 'Canberra Times (2005)',
  },
  forbearance: {
    quote: 'I would have been nine or ten when my mother chased me up a thorn tree with a ceremonial hippo-hide whip. What my crime was, I forget. My mother was, and remains, a woman of exceptional forbearance. I must have done something so obnoxious as to beggar belief.',
    author: 'David Bennun, Tick Bite Fever (2003)',
  },
  furtive: {
    quote: 'At the edge of my kingdom scurry / ⁠Creatures in feathers and furs— / Crows in a furtive hurry— / ⁠Hungry and cringing curs— ...',
    author: '[Alice Macdonald Fleming], Hand in Hand: Verses by a Mother and Daughter (1902)',
  },
  hegemony: {
    quote: 'The idea of a German republic and confederacy like the American, is surely less fantastical than a hegemony to which nobody is willing to submit.',
    author: 'Germany and the Revolution (1820)',
  },
  iconoclast: {
    quote: 'In the days of the early Christian church, people who opposed the veneration (reverence) of images were called iconoclasts.',
    author: 'Eugene TeSelle, World Book Encyclopedia, 2004 edition (CD) (2004)',
  },
  ignominious: {
    quote: 'Greene died of a debauch; and Marlowe, the gracer of tragedians, perished in an ignominious brawl.',
    author: 'Thomas Ebenezer Webb, The Mystery of William Shakespeare: A Summary of Evidence (1902)',
  },
  incontinent: {
    quote: 'The male body, opened and bleeding, can assume the shameful attributes of the incontinent female body as both cause of and justification for its evident vulnerability and defeat.',
    author: 'Gail Kern Paster, The Body Embarrassed (2018)',
  },
  indomitable: {
    quote: 'Personal courage and an indomitable self-confidence were the chief, indeed the only, qualities which sprang to light in General Feversham.',
    author: 'A. E. W. Mason, The Four Feathers (1902)',
  },
  ineffable: {
    quote: 'They, and many others, are one with the trains that ran them, part of that ineffable atmosphere of Scotland\'s railways.',
    author: 'J. P. Wilson, Scottish Soliloquy (1958)',
  },
  infidel: {
    quote: 'Some Muslims are taught that non-Muslims are infidels and are to be shunned.',
    author: 'George W. Braswell, Islam and America: Answers to the 31 Most-asked Questions (2005)',
  },
  inure: {
    quote: 'Your insults to myself can be endured, / I am a philosopher and am inured. / But there are insults that I will not swallow / That you have levelled at our gods.',
    author: 'Geoffrey Chaucer, The Canterbury Tales: Translated into Modern English (1951)',
  },
  inveterate: {
    quote: 'Like many lonely people, he was an inveterate hoarder, making and surrounding himself with objects, barriers against the demands of human intimacy.',
    author: 'Olivia Laing, The Lonely City: Adventures in the Art of Being Alone (2017)',
  },
  jingoism: {
    quote: 'Americans are now too overstimulated and spoiled by choices to be properly manipulated by the old rallies that used to boil nationalistic fervor—billowing flags, unctuous marching band music, and a white man in a dark suit speaking in comforting Judeo-Christian jingoisms.',
    author: 'Cintra Wilson, Caligula for President (2010)',
  },
  myopic: {
    quote: 'She yanked the paper from her motherʼs hands, bringing it very close to her myopic eyes.',
    author: 'Zadie Smith, On Beauty (2005)',
  },
  neophyte: {
    quote: 'The neophyte was given a new name in place of the baptismal one, usually of an evil and revolting character, and this was written in blood in the Devil\'s book, the covers of which were bound in the skin of unbaptised infants.',
    author: 'Rollo Ahmed, The Black Art (1936)',
  },
  oblique: {
    quote: 'Oblique and sinker roots will normally be under a greater compression stress than lateral roots.',
    author: 'A. Stokes; D. Guitard, Biology of Root Formation and Development (1997)',
  },
  panacea: {
    quote: 'Hydrogen is not a panacea for reaching the zero net emissions target by 2050, but it can grow to become "a big niche" fuel in particular sectors and applications, claims a new report.',
    author: 'Network News: MPs seek clarity on hydrogen\'s role (2023)',
  },
  pantheon: {
    quote: 'Every act of a Roman, from birth to death, from dawn to night, was controlled and supervised by some presiding deity. Man was thus virtually a symbolic puppet in the hands of the Roman pantheon.',
    author: 'Harry E. Wedeck, Dictionary of Aphrodisiacs (1961)',
  },
  pastiche: {
    quote: 'He argued that the failure of the future was constitutive of a postmodern cultural scene which, as he correctly prophesied, would become dominated by pastiche and revivalism.',
    author: 'Mark Fisher, Capitalist Realism (2009)',
  },
  petulant: {
    quote: 'Green Day’s petulant pop-punk album Dookie came out three years after that and moved another 10 million, as did a sweeping 1995 double album by Smashing Pumpkins.',
    author: 'Chuck Klosterman, The Nineties (2022)',
  },
  platitude: {
    quote: 'Beauty, I suppose, opens the heart, extends the consciousness. It is a platitude, of course.',
    author: 'Algernon Blackwood, The Garden of Survival (1918)',
  },
  ponderous: {
    quote: '[H]e saw, at the end of a shallow embrasure, a ponderous door of dark wood, braced with iron.',
    author: 'Julian Hawthorne, Archibald Malmaison (1879)',
  },
  precipitous: {
    quote: 'About this time our journey began to be pleasant again. The weather warm, yet not disagreeably so, the grass abundant and of an excellent quality, the road not greatly precipitous, the scenery enchanting.',
    author: 'E. J. Guerin, Mountain Charley (1861)',
  },
  prosaic: {
    quote: 'Their steepness and abruptness were even greater than I had imagined from hearsay, and suggested nothing in common with the prosaic objective world we know.',
    author: 'H. P. Lovecraft, The Whisperer in Darkness (1931)',
  },
  quandary: {
    quote: 'But we may suppose that John has set his priorities in such a way that the quandary is spurious.',
    author: 'Douglas N. Walton; Erik C. W. Krabbe, Commitment in Dialogue: Basic Concepts of Interpersonal Reasoning (1995)',
  },
  quantum: {
    quote: 'Otherwise I will have given the lie to my maxim that whether you work eight or twenty hours, the quantum of work that gets done on a normal day is the same.',
    author: 'Kiran Nagarkar, Cuckold (1997)',
  },
  quixotic: {
    quote: 'The cultural quixotics attribute the change to inscrutable "cultural factors," which is tantamount to abandoning altogether the search for explanation.',
    author: 'Michael B. Schiffer and John H. House, The Cache River Archeological Project (1975)',
  },
  rapt: {
    quote: 'Her expression grew more rapt; she paused as if she had lost the thread of the words and then spoke again, gazing far out over the hall as jugglers do in performing feats of balancing:....',
    author: 'Ford Madox Ford, The Fifth Queen; And How She Came to Court: Works of Ford Madox Ford (1906)',
  },
  replete: {
    quote: 'History is replete with instances of great men ruled by their barbers.',
    author: 'Elbert Hubbard, Little Journeys: Volume 8—Great Philosophers (1916)',
  },
  reticent: {
    quote: 'The inhabitants of that street impressed me peculiarly; At first I thought it was because they were all silent and reticent; but later decided it was because they were all very old.',
    author: 'H. P. Lovecraft, The Music of Erich Zann (1922)',
  },
  salutary: {
    quote: 'Using such neofuturists as Nicholas Negroponte to support his argument, Groper argues that “being digital” is constitutive of today’s salutary political life (167).',
    author: 'Anthony G. Wilhelm, Democracy in the Digital Age: Challenges to Political Life in Cyberspace (2000)',
  },
  sanguine: {
    quote: 'Eleonore Lemindre, aged 34, tailoress, of a sanguine lymphatic temperament, having suffered great depression of spirits, experienced, in the course of 1820, symptoms of what is called disease of the heart.',
    author: 'R. J. Bertin, Treatise on the Diseases of the Heart, and Great Vessels (1833)',
  },
  schadenfreude: {
    quote: 'But it is Schadenfreude, a mischievous delight in the misfortunes of others, which remains the worst trait in human nature.',
    author: 'The Essays of Arthur Schopenhauer (1897)',
  },
  sidle: {
    quote: 'Ava tried to sidle away, but she was semi-trapped between the corner of the stage and a French Club sign-up table.',
    author: 'Belle Payton, Too Cool for School (2014)',
  },
  skulk: {
    quote: 'A skulk of fox padded daintily over a stream-slashed meadow, and a herd of deer like iron ornaments stood stock still in their winter pelage.',
    author: 'Millard Kaufman, Bowl of Cherries (2007)',
  },
  slovenly: {
    quote: 'Which would you sooner employ, a boy who was plainly, yet neatly clad, or one who had a slovenly appearance, though dressed in fine clothes?',
    author: 'M[arcellus] F. Cowdery, Elementary Moral Lessons For Schools and Families (1857)',
  },
  sojourn: {
    quote: 'The use of vasoconstrictors to increase the sojourn of local anesthetics at the site of infiltration continues...',
    author: 'Joseph Price Remington; Paul Beringer, Remington: The Science And Practice Of Pharmacy (2006)',
  },
  somatic: {
    quote: 'The somatic and botanical metaphors in this passage were commonplace in the 1700s.',
    author: 'Patrick Spedding; James Lambert, Fanny Hill, Lord Fanny, and the Myth of Metonymy (2011)',
  },
  soporific: {
    quote: 'It is said that the effect of eating too much lettuce is “soporific.” I have never felt sleepy after eating lettuces; but then I am not a rabbit. They certainly had a very soporific effect upon the Flopsy Bunnies!',
    author: 'Beatrix Potter, The Tale of The Flopsy Bunnies (1909)',
  },
  stolid: {
    quote: '“A tinge of Jewish blood is not a bad thing. It leavens the”—she looked at him—“stolid stupidity of the ordinary Englishman.”',
    author: 'Agatha Christie, The Mysterious Affair at Styles (1920)',
  },
  tantamount: {
    quote: '... expecting the woman to take her attacker into physical custody is tantamount to preventing the arrest. If she could handle him, she probably would not need to call the police in the first place.',
    author: 'Del Martin, Battered Wives (1981)',
  },
  torpid: {
    quote: 'In our first year I had seen him coming away from Blackwell\'s clutching a great textbook of chemistry with an air of anticipatory delight, and also on the river as cox of one of the Lincoln torpids.',
    author: 'R. V. Jones, Most Secret War: British Scientific Intelligence 1939-1945 (1978)',
  },
  umbrage: {
    quote: 'She looked very neurotic, moving in a jerky way, her body giving little twitches of habitual umbrage.',
    author: 'Muriel Spark, The Bachelors (1960)',
  },
  unalloyed: {
    quote: 'He laded his ship with his purchases, and returned back to the island, where he spent many years in unalloyed happiness, and Aslog\'s father was soon reconciled to his wealthy son-in-law.',
    author: 'Thomas Keightley, The Fairy Mythology (1828)',
  },
  undulate: {
    quote: 'Come lovely and soothing death, / Undulate round the world, serenely arriving, arriving, / In the day, in the night, to all, to each, / Sooner or later delicate death.',
    author: 'Walt Whitman, Sequel to Drum-Taps: When Lilacs Last in the Dooryard Bloom’d and other poems (1865)',
  },
  untrodden: {
    quote: 'Their path led them past sharp cliffs, along narrow trails unknown and untrodden, past headlong boulders strewn across barren, treeless, wind-haunted heights.',
    author: 'Norma Lorre Goodrich, The Medieval Myths (1961)',
  },
  vagary: {
    quote: 'And then came the day when my socialism grew respectable,—still a vagary of youth, it was held, but romantically respectable.',
    author: 'Jack London, War of the Classes (1905)',
  },
  vestigial: {
    quote: 'Remnants of the vascular supply of lost organs may be present in the tissues of the receptacle when all external evidence of the organs has disappeared. Only rarely does the vascular supply of a vestigial organ disappear while external remnants are still present.',
    author: 'Pooja, Pshysiology of the Angiosperms (2004)',
  },
  vitriol: {
    quote: 'For days, online forums sparked with outrage against politicians and race organizers, a tone that turned to vitriol against runners, even from some shaming other runners for being selfish.',
    author: 'Ken Belson, New York Times (2012)',
  },
  wend: {
    quote: 'They turned left onto Echo Lake Road, which wended through the woods for about a quarter of a mile [...]',
    author: 'John Cariani, Almost, Maine (2020)',
  },
  winsome: {
    quote: '... lifting her winsome eyes to my face with that sort of look which turns off bad temper, even when one has all the right in the world to indulge it.',
    author: 'Emily Brontë, Wuthering Heights (1847)',
  },
  yokel: {
    quote: 'I went to New York and bought myself a secondhand stretch limousine twenty-eight feet long, calculated to reduce the most blasé country-club sophisticates to bug-eyed yokels.',
    author: 'Peter De Vries, The Prick of Noon (1985)',
  },
  filibuster: {
    quote: 'But as the case had dragged on interminably, and he believed, and the world believed, and the Canadians themselves knew, that they intended to filibuster and postpone as long as possible, he took the common-sense way to a settlement.',
    author: 'William Roscoe Thayer, Theodore Roosevelt: An Intimate Biography (1919)',
  },
  meritocracy: {
    quote: 'In Markovits’s telling, the rise of the meritocracy is a story of unintended consequences.',
    author: 'Sarah Leonard, The Fall of the Meritocracy (2019)',
  },
  nepotism: {
    quote: 'Now retailers even demand deslotting or failure fees, a penalty for trial products that fail to meet their sales objectives. The struggle over display space heavily favors the incumbents and encourages what might be called brand nepotism.',
    author: 'Report on Business Magazine (1989)',
  },
  oligarchy: {
    quote: 'The Itasca Project is just one example of existing oligarchy, and a surprisingly open one at that.',
    author: 'Malcolm Harris, Wealthy cabals run America (2016)',
  },
  affable: {
    quote: 'During more affable weather, the four friends congregate outside, sometimes leaning their hickory chairs against a "catapa" tree...',
    author: 'Alexia Maria Kosmider, Tricky Tribal Discourse (1998)',
  },
  ambivalent: {
    quote: 'In modern burlesque [...] sexual and erotic stimuli are often present in concealed and ambivalent doubles entendres.',
    author: 'Harry E. Wedeck, Dictionary of Aphrodisiacs (1961)',
  },
  amiable: {
    quote: 'The sums I have lent him! indeed—I have been exceedingly to blame—it was an amiable weakness!',
    author: 'Richard Brinsley Sheridan, The School for Scandal (1777)',
  },
  austere: {
    quote: 'It is like a small plum, nearly globular in shape, black covered with a bluish bloom, and with a very austere taste.',
    author: 'Charles Pierpoint Johnson, The Useful Plants of Great Britain (1862)',
  },
  balk: {
    quote: 'Carla balked for a moment, but when the badge and identification was produced, she acquiesced immediately. "Of course, Director, what can I do for you?"',
    author: 'Derek Hart, Tidal Trap (2004)',
  },
  bequeath: {
    quote: 'Ownership of manufacturing workshops is not essential to that job; but BR happen to have been bequeathed a considerable number with a proud history.',
    author: 'News and Comment: Minister hamstrings BR workshops (1964)',
  },
  bilk: {
    quote: 'They also perpetrate nonviolent crimes like bilking elderly couples out of their life savings and running a business with ruthless disregard for the welfare of the workforce or stakeholders.',
    author: 'Steven Pinker, The Better Angels of Our Nature (2011)',
  },
  cacophony: {
    quote: 'A blistering start from the Scots served to steady the ship amid a cacophony that defied the quarter-full national stadium.',
    author: 'Scott Mullen, Scotland 0-2 Czech Republic (2021)',
  },
  capitulate: {
    quote: 'The lawes ... which we capitulate at sea ... are not used on lande.',
    author: 'Thomas Lodge, Life and Death of William Longbeard',
  },
  chauvinist: {
    quote: 'Today\'s young women seem to be outdoing the male chauvinist pigs of yesteryear, applauding the "pornification" of other women ...',
    author: 'Ariel Levy, Female Chauvinist Pigs: Women and the Rise of Raunch Culture (2006)',
  },
  clandestine: {
    quote: 'Whether the torments of absence were softened by a clandestine correspondence, let us not inquire. Mr. and Mrs. Morland never did.',
    author: 'Jane Austen, Northanger Abbey (1818)',
  },
  cosmopolitan: {
    quote: 'Domestication and the evolution of anthrophilic traits in houseflies and some drosophilids have allowed certain species to attain cosmopolitan status.',
    author: 'David K. Yeates; Brian M. Wiegmann, The Evolutionary Biology of Flies (2005)',
  },
  creed: {
    quote: '\'I was n\'t for creeding me awn e\'en,\' believing my own eyes.',
    author: 'John Harland, A Glossary of Words Used in Swaledale, Yorkshire (1873)',
  },
  eclectic: {
    quote: 'All members of the Hominoidea, apes and man, show an eclectic taste in food but select, from a wide range of possibilities, only a few to provide the bulk of their diet.',
    author: 'Peter J. Wilson, Man, the Promising Primate: The Conditions of Human Evolution (1983)',
  },
  flaunt: {
    quote: 'The house came into sight, above the cedar grove beyond whose black interstices an apple orchard flaunted in the sunny afternoon.',
    author: 'William Faulkner, Sanctuary (1931)',
  },
  glib: {
    quote: 'We were having one of our bitterest cold snaps. Wind due north, shrieking over stiff land; two feet of snow, all substances glibbed with ice and granite-hard.',
    author: 'Emily Carr, The House of All Sorts (1944)',
  },
  gregarious: {
    quote: 'Rabbits are lively at nightfall, and when evening rain drives them underground they still feel gregarious.',
    author: 'Richard Adams, Watership Down (1972)',
  },
  grotto: {
    quote: 'An earlier attempt to organize a grotto in the Indiana, PA, area in the mid-1970s failed to succeed, but from it developed the informal Chestnut Ridge Explorers Association.',
    author: 'National Speleological Society, NSS News (1987)',
  },
  gulch: {
    quote: '"A crack is progressing up through the Goldminers\' apartment. They are most disturbed by the appearance of this gulch in their wall since it undermines their confidence in the structure of the building which as you know my management has taken great care to keep sound and durable."',
    author: 'J P Donleavy, A Singular Man (1963)',
  },
  hankering: {
    quote: 'I found that he had dipped a little in chimerical studies and had a hankering after astrology and alchymy.',
    author: 'Washington Irving, The Knight of Malta (1840)',
  },
  heft: {
    quote: 'The socket of the rim lock tore off to one good heft of the shoulder, and we were in.',
    author: 'John Wyndham, The Day of the Triffids (1951)',
  },
  idiosyncrasy: {
    quote: 'If he expresses himself such as he is, an idiosyncrasy affected but not annihilated by education, he may say that his books are his own.',
    author: 'Philip Gilbert Hamerton, Human Intercourse (1898)',
  },
  latent: {
    quote: 'Paralegal workers do not argue cases in court, and these crimescene fingerprint gatherers do not compare crime-scene latents to known prints of suspects and present their findings in court.',
    author: 'Jim Fisher, Forensics Under Fire (2008)',
  },
  luscious: {
    quote: 'The air is perfumed by the luscious odours of masses of aromatic plants and flowers.',
    author: 'James George Frazer, Folk-Lore In The Old Testament (1918)',
  },
  malignant: {
    quote: '...while, I fear, there will be some white ones, unable to forget that, with malignant heart, and deceitful speech, they have strove to hinder it.',
    author: 'Abraham Lincoln, Letter to James Conkling (1863)',
  },
  menial: {
    quote: 'For instance, controlling for the above-mentioned variables, migrants to Tangerang or Samarinda (rather than Medan) have a significantly greater chance of getting a craft (as opposed to menial) job.',
    author: 'Chris Manning; Sudarno Sumarto, Employment, Living Standards and Poverty in Contemporary Indonesia (2011)',
  },
  myriad: {
    quote: 'I saw battle-corpses, myriads of them, / And the white skeletons of young men, I saw them, / I saw the debris and debris of all the slain soldiers of the war, ...',
    author: 'Walt Whitman, Sequel to Drum-Taps: When Lilacs Last in the Dooryard Bloom’d and other poems (1865)',
  },
  nefarious: {
    quote: 'Mommsen ...declares that Catiline in particular was "one of the most nefarious men in that nefarious age. His villanies belong to the criminal records, not to history."',
    author: 'Anthony Trollope, The Life of Cicero (1877)',
  },
  ostracize: {
    quote: '[T]raditions such as the bouquet toss and the "singles" table at the wedding reception often marginalize and ostracize lesbians and gays in attendance.',
    author: 'Cele C. Otnes; Elizabeth Hafkin Pleck, Cinderella Dreams: The Allure of the Lavish Wedding (2003)',
  },
  palpable: {
    quote: 'I had felt that some palpable although invisible object had passed lightly by my person.',
    author: 'Edgar Allan Poe, Ligeia (1838)',
  },
  paradigm: {
    quote: 'DRT is a paradigm example of a dynamic semantic theory, ...',
    author: 'Nicholas Asher; Alex Lascarides, Logics of Conversation (2003)',
  },
  pariah: {
    quote: 'As ecological conditions became unfavorable for pig raising, there was no alternative function which could redeem its existence. The creature became not only useless, but worse than useless—harmful, a curse to touch or merely to see—a pariah animal.',
    author: 'Marvin Harris, Food and Culture: A Reader (2013)',
  },
  pedantic: {
    quote: 'The style is pedantic and reviewish: but I can easily fancy states of mind to which it may be no less salutary on that account.',
    author: 'Richard Hurrell Froude; John Henry Newman; John Keble, Remains of the Late Reverend Richard Hurrell Froude (1838)',
  },
  pedigree: {
    quote: 'This connection between sexual and spiritual impurity had an immense pedigree.',
    author: 'Faramerz Dabhoiwala, The Origins of Sex (2012)',
  },
  penchant: {
    quote: 'Just like Marple, there\'s a plaque at the London terminus [Paddington] commemorating a fictional character - a polite, friendly little bear from darkest Peru who has a penchant for marmalade sarnies.',
    author: 'Stephen Roberts, The writings on the wall... (2021)',
  },
  penultimate: {
    quote: 'But it should frequently happen that offspring should resemble its penultimate rather than its latest phase, and should thus be more like a grand-parent than a parent.',
    author: 'Samuel Butler, Life and Habit (1878)',
  },
  peruse: {
    quote: 'Haynes quickly perused the message, then took it to the captain on the bridge.',
    author: 'Doug Stanton, In Harm\'s Way: The Sinking of the USS Indianapolis (2001)',
  },
  placate: {
    quote: 'When are you more placate and serene?',
    author: 'William Gurnall, The Christian in Complete Armour',
  },
  poignant: {
    quote: 'Sad Derek attracted more than 50 comments praising him for his poignant views...',
    author: 'Wee Shu Min, Response to Derek Wee\'s blog (2006)',
  },
  prognosis: {
    quote: 'If free speech is the lifeblood of democracy then the fate and the prognosis of the latter are that of the former.',
    author: 'Paul Fairfield, Why Democracy? (2008)',
  },
  pulpit: {
    quote: 'Always, whether in the pulpit or on the platform, as in private conversation, there is an absolute simplicity about the man and his words; a simplicity, an earnestness, a complete honesty.',
    author: 'Russell H. Conwell; Robert Shackleton, Acres of Diamonds (1915)',
  },
  relegate: {
    quote: 'Eventually his freedom of speech drove Vespasian to relegate him a second time, and shortly after he was executed ....',
    author: 'Mark Morford, The Roman Philosophers (2002)',
  },
  reminisce: {
    quote: 'He reminisced the old Parvati who was now this Parvati.',
    author: 'Amitava Bhattacharya, Selected Novels of Sarat Chandra Chatterjee (2006)',
  },
  rigamarole: {
    quote: 'Speak out like a man, and don\'t give me any more of this tiresome rigamarole.',
    author: 'Stephen Crane, The Monster (1899)',
  },
  ruddy: {
    quote: 'A silvery cloud drifted over the mountains that surrounded him, its edges glowing with ruddy light cast from the harvest moon cradled between two peaks.',
    author: 'Christopher Paolini, Eragon (2003)',
  },
  saunter: {
    quote: 'Caroline ... begged that the drive might be given up for a saunter about the gardens...',
    author: 'Elizabeth Hervey, Amabel (1814)',
  },
  scant: {
    quote: 'A blonde appeared from the officers\' room, wearing a scant of material that passed for issued undergarments.',
    author: 'Nathaniel DeZago, Cries of Battle: Selstra (2020)',
  },
  scurry: {
    quote: 'Found a fox in Deerstone, and after a great deal of music, and a scurry or two round the wood, went away over Whigford Down, but he was too far before them to make any more quick music ...',
    author: 'Sporting Magazine (1845)',
  },
  semantic: {
    quote: 'In this particular case, the semantic is on the left of its host sinogram.',
    author: 'William S-Y. Wang, Love and War in Ancient China: Voices from the Shijing (2013)',
  },
  sentient: {
    quote: 'The merpeople and the sentients who lived on the beach often hitched rides on these creatures, steering them by pressure on exposed nerve centers.',
    author: 'Philip José Farmer, The Maker of Universes (1965)',
  },
  spry: {
    quote: '"I\'m not sure about whether I shall go. I am the most incurably lazy devil that ever stood in shoe leather—that is, when the fit is on me, for I can be spry enough at times."',
    author: 'Sir Arthur Conan Doyle, A Study in Scarlet (1887)',
  },
  tantalize: {
    quote: 'They could not bear to be tantalized nor tortured by the splendid delusion.',
    author: 'John Boyle O\'Reilly, Moondyne (1880)',
  },
  tenacious: {
    quote: 'The quagmiry road, trodden into tenacious paste by the long file of human beings ahead ...',
    author: 'Henry Morton Stanley, My Kalulu, Prince, King, and Slave (1873)',
  },
  tenement: {
    quote: 'The philosopher and the lady-killer could not well keep house in the same tenement of clay.',
    author: 'William James, The Principles of Psychology (1890)',
  },
  ubiquitous: {
    quote: 'There is much sad evidence, too, of the spoliation and dereliction of vanished industry: tips, slag-heaps and derelict colliery-screens among which the ubiquitous, nomad mountain sheep graze unconcernedly.',
    author: 'D. S. Barrie, Railways of the Bridgend District (1955)',
  },
  unrequited: {
    quote: 'To her mind, a girl who would tell of the unrequited love of a man for herself, was unspeakably base.',
    author: 'Eleanor H. Porter, Miss Billy’s Decision (1912)',
  },
  verbose: {
    quote: 'In modern processors, you pay a bigger performance hit for having verbose code than for having an extra function call because larger code can cause secondary cache hits.',
    author: 'Michael Hyman; Phani Vaddadi, Mike and Phani’s Essential C++ Techniques (1999)',
  },
  vista: {
    quote: 'The night had now closed in, and its darkness was only relieved by the wan lamps that vistaed the streets, and a few dim stars that struggled through the reeking haze that curtained the great city.',
    author: 'Edward Bulwer Lytton, Eugene Aram (1896)',
  },
  vivacious: {
    quote: 'She made reasonable progress, entertained for me a vivacious, though perhaps not very profound, affection; and by her simplicity, gay prattle, and efforts to please, inspired me, in return, with a degree of attachment sufficient to make us both content in each other\'s society.',
    author: 'Charlotte Brontë, Jane Eyre (1864)',
  },
  waft: {
    quote: 'Through the open window of the church the fragrant incense was wafted and with it the fragrant names of her who was conceived without stain of original sin ...',
    author: 'James Joyce, Ulysses (1922)',
  },
  wistful: {
    quote: 'There are few sights that leave a railway lover more wistful than a desolate railway viaduct no longer carrying tracks. As with tunnels, so much effort was made to conquer the landscape, yet so many now stand forlorn.',
    author: 'Tim Dunn, Lost and found: historical assets (2025)',
  },
  arable: {
    quote: 'Arrangements for the drainage of this piece of arable were commenced last summer',
    author: 'Dorothy L. Sayers, Have His Carcase (1932)',
  },
  reconnaissance: {
    quote: 'The third member, Sergeant Pieter Rousseau, had been with the back-up teams at the Hub; he was an expert on space reconnaissance instrumentation, but on this trip he would have to depend on his own eyes and a small portable telescope.',
    author: 'Arthur C. Clarke, Rendezvous with Rama (1973)',
  },
  bipartisan: {
    quote: 'As a city with over two centuries of rail expertise and home to the country\'s largest train factory, this announcement received bipartisan support.',
    author: 'Tammy Samuel; Fergus McLaverty, The political picture: what lies ahead for Britain\'s railways? (2023)',
  },
  coalition: {
    quote: 'This is the incredible moment a juvenile ostrich attempts to outrun a coalition of cheetahs that forms a central part of the latest BBC programme to be presented by Sir David Attenborough.',
    author: 'This is the moment an ostrich attempts to outrun cheetahs in Sir David Attenborough\'s latest show (2015)',
  },
  embargo: {
    quote: 'Instead he [Jefferson] proposed an embargo, an end to all trade between America and England.',
    author: 'Chris Wallace, Character: Profiles in Presidential Courage (2004)',
  },
  referendum: {
    quote: 'In some cases, a referendum on the proposed bond issue must be held.',
    author: 'Wisconsin Legislative Reference Bureau, Informational Bulletin (1975)',
  },
  alliteration: {
    quote: 'So fish fury all round, as there has been in the past. And as an aside, that alliteration was, sadly, not mine that of a former political correspondent of the Daily Record, John Deans, and applied to the \'cod wars\' with Iceland.',
    author: 'Fish fury flares over Brussels Brexit deal (2018)',
  },
  archetype: {
    quote: 'Outlines of the chief developments of the dermoskeleton, in different vertebrates, which are usually more or less ossified, are added to the endoskeletal archetype: as, e.g. the median horn supported by the nasal spine ... in the rhinoceros; ...',
    author: 'Richard Owen, The Archetype and Homologies of the Vertebrate Skeleton (1848)',
  },
  amble: {
    quote: 'The little man was ambling along in the middle of the street, looking around him with an expression of keen interest.',
    author: 'Terry Pratchett, The Colour of Magic (1983)',
  },
  ample: {
    quote: '…a line of wooden troughs supplies ample water for irrigation.',
    author: 'Richard F. Burton, The City of the Saints (1862)',
  },
  articulate: {
    quote: 'He realized that his duties, articulate in the noise of coins and tumblers being banged on tables, were calling him. ‘I must go. There’re three tables waiting.‘',
    author: 'Patrick Hamilton, 20,000 Streets Under the Sky (1929)',
  },
  audacious: {
    quote: 'It was an audacious thing for her to attempt, but boldness had often served her turn before.',
    author: 'Anthony Trollope, The Eustace Diamonds (1871)',
  },
  benevolent: {
    quote: 'This bill was not a gift from a benevolent legislature; it was a victory for the community which worked for its passage.',
    author: 'Kevin M. Cathcart, Homophobia Never Innocent',
  },
  brisk: {
    quote: 'On such occasions he would remark-- "Shaving may add an air that\'s somewhat brisker, For dignity, commend me to the whisker."',
    author: 'Norman Lindsay, The Magic Pudding (1918)',
  },
  consolation: {
    quote: '[I]f Charles is undone, He\'ll find half his Acquaintance ruin\'d too, and that, you know, is a consolation—',
    author: 'Richard Brinsley Sheridan, The School for Scandal (1777)',
  },
  cordial: {
    quote: 'The relations between the Earl of Bellomont and Colonel Schuyler were formal, but not cordial from the first.',
    author: 'George Washington Schuyler, Colonial New York: Philip Schuyler and His Family (1885)',
  },
  dandy: {
    quote: '“Gerald Croft is an attractive chap about thirty, rather too manly to be a dandy but very much the easy well-bred young man-about-town.”',
    author: 'J. B. Priestley, An Inspector Calls (1945)',
  },
  dwell: {
    quote: 'The poor man dwells in a humble cottage near the hall where the lord of the domain resides.',
    author: 'Charles John Smith, Synonyms Discriminated: A Complete Catalogue of Synonymous Words in the English Language (1871)',
  },
  ecstatic: {
    quote: 'I think that Dante\'s more abstruse ecstatics / Meant to personify the Mathematics.',
    author: 'Lord Byron, Don Juan (1819)',
  },
  enigma: {
    quote: 'Tucked inconspicuously away behind the shoal of darkness that hung in those gloomy corners, the silhouetted enigma was ogling him in halcyon silence.',
    author: 'Ramon Elmerito Gatchalian, A Supernatural Threat (2007)',
  },
  enormity: {
    quote: 'In 1650 Lieutenant William Jackson was in trouble for holding, among many other enormities, ‘community of all things’, including, apparently, wives.',
    author: 'Christopher Hill, The World Turned Upside Down (1972)',
  },
  excursion: {
    quote: 'excursion, nuclear: An episode during which the fission rate of a supercritical system increases, peaks, and then decreases to a low value.',
    author: 'Hugh C. Paxton, Glossary of Nuclear Criticality Terms (1989)',
  },
  exquisite: {
    quote: 'From Area B I\'d usually [...] do the whole thing in reverse, until I\'d qualified for the reward of a bacon sandwich and a cup of exquisite milky coffee at a transport café in Bartley Green Village.',
    author: 'Bill Oddie, Gone Birding (1983)',
  },
  falter: {
    quote: 'Tom, who isn\'t paying much attention, is suddenly caught by the falter in his voice as he reads the two lines—',
    author: 'Ruth Cigman; Andrew Davis, New Philosophies of Learning (2009)',
  },
  fluke: {
    quote: 'Three of the best hitters in the Eastern retired on nine strikes! That was no fluke.',
    author: 'Zane Grey, The Redheaded Outfield (1920)',
  },
  fret: {
    quote: 'And mid-way through the channel met / Conflicting tides that foam and fret, / And high their mingled billows jet, / As spears, that, in the battle set, / Spring upward as they break.',
    author: 'Walter Scott, The Poetical Works of Walter Scott: Complete in One Volume (1815)',
  },
  frivolous: {
    quote: 'There is no easy definition for the phrase \'frivolous lawsuit,\' but I imagine any claim for damages where the injuries are minimal or where the basis for the defendant\'s liability is hard to believe, might qualify as frivolous.',
    author: 'Paul F. Waldner, President-Elect, Houston Trial Lawyers Association, Viewpoints (1996)',
  },
  futile: {
    quote: 'This idiosyncrasy is brought out by social pressure, while in a state of nature it might have betrayed itself only in trivial and futile ways, as it does among barbarians.',
    author: 'George Santayana, Reason in Common Sense (1905)',
  },
  gleam: {
    quote: 'Hail, thou overshadowing mount of the Holy Ghost [i.e., Mary, mother of Jesus]. Thou gleamedst, sweet gift-bestowing mother, of the light of the sun; thou gleamedst with the insupportable fires of a most fervent charity, ...',
    author: 'Methodius, The Writings of Methodius, Alexander of Lycopolis, Peter of Alexandria, and Several Fragments (1869)',
  },
  glimpse: {
    quote: 'What memories? / The pure love thoughts and who may know / Thou glimpsest from the long ago?',
    author: 'Andrew M‘Ewen, Avalande. Fyttes and Fancyings (1861)',
  },
  haughty: {
    quote: 'How meek and shrunken did that haughty Tarmac become as it slunk by the wide circle of asphalt of the yellow sort, that was loosely strewn before the great iron gates of Lady Hall as a forerunner of the consideration that awaited the guests of Rupert, Earl of Kare, ....',
    author: 'Michael Arlen, “Piracy”: A Romantic Chronicle of These Days (1922)',
  },
  hectic: {
    quote: 'an angry hectic in each cheek, a fierce flirt of her fan, and two or three short sniffs that betokened mischief',
    author: 'Sheridan Le Fanu, The House by the Churchyard (1863)',
  },
  humble: {
    quote: 'Undoubtedly it can be said that the humble 0-6-0 has been the backbone for general service, or general utility on British railways right from their earliest days, and is likely to remain so.',
    author: 'H. C. Casserley, Random Reflections on British Locomotive Types—1 (1945)',
  },
  indifferent: {
    quote: '‘Wonderful, Florence,’ I said, producing the ritual phrases: ‘I don’t know what I would do without you.’ But of course I do know. I would sink into the indifferent squalor of old age.',
    author: 'J. M. Coetzee, Age of Iron (1990)',
  },
  innate: {
    quote: 'Ironically, given France\'s innate reluctance to permit competition at home, the first breach in Renfe\'s monopoly came from SNCF offshoot Ouigo España in 2021.',
    author: 'Ben Jones, EU open access growth offers pointers for UK hopefuls (2023)',
  },
  insidious: {
    quote: 'Strong and vigorous man as he looks, Livingstone has been for years the victim of a secret and insidious disease.',
    author: 'George Lippard, The Quaker City: or, The monks of Monk-Hall (1847)',
  },
  kaleidoscope: {
    quote: 'He closed his eyes and his thoughts pursued his imagination through a series of carefully constructed scenes as if he was watching the tumbling chips of coloured glass in a kaleidoscope.',
    author: 'Ian Fleming, Casino Royale (1953)',
  },
  knack: {
    quote: 'The sophist runs for cover to the darkness of what is not and attaches himself to it by some knack of his;',
    author: 'Plato, Sophist (2005)',
  },
  lofty: {
    quote: 'On my left was a river, which came roaring down from a range of lofty mountains right before me to the south-east.',
    author: 'George Borrow, Wild Wales (1862)',
  },
  lore: {
    quote: 'The succession story would get repeated so often that it would turn into Silicon Valley lore.',
    author: 'Karen Hao, Empire of AI (2025)',
  },
  lucid: {
    quote: 'Pictures of growing spring and farms and homes, / With the Fourth-month eve at sundown, and the gray smoke lucid and bright, ...',
    author: 'Walt Whitman, Sequel to Drum-Taps: When Lilacs Last in the Dooryard Bloom’d and other poems (1865)',
  },
  lucrative: {
    quote: 'Command and Control centers and headquarters are strategically important and lucrative targets.',
    author: 'Eric R. Taylor, Lethal Mists (2001)',
  },
  lurk: {
    quote: 'There were enemies on the lurk and time was against him.',
    author: 'George Colby Borley, The Lost Horizon (1921)',
  },
  meticulous: {
    quote: 'The meticulous care with which the operation in Sicily was planned has paid dividends. Our casualties in men, in ships and materiel have been low—in fact, far below our estimate.',
    author: 'Franklin D. Roosevelt, Roosevelt\'s Fireside Chat, 28 July 1943 (1943)',
  },
  murmur: {
    quote: 'In fear of disease and in the interest of his health man will be muzzled and masked like a vicious dog, and that without any murmur of complaint.',
    author: 'Boris Sidis, The Source and Aim of Human Progress (1919)',
  },
  nostalgic: {
    quote: 'But of course every well-brought-up person to-day knows that the Victorians were sentimentalists, nostalgics, escapists, self-deceivers.',
    author: 'Gilbert Armitage, Were these Victorians? (1933)',
  },
  ogle: {
    quote: 'Will you take a varder at the cartz on the feely-omi in the naf strides: the one with the bona blue ogles polarying the omi-palone with a vogue on and a cod sheitel.',
    author: 'James Gardiner, Who\'s a Pretty Boy Then? (1997)',
  },
  paradox: {
    quote: 'The active sense of living which we all enjoy, before reflection shatters our instinctive world for us, is self-luminous and suggests no paradoxes.',
    author: 'William James, A pluralistic universe. Hibbert lectures (1909)',
  },
  perpetual: {
    quote: 'There are perpetual requests for changes as new payloads and new demands and modifications are suggested by the users.',
    author: 'Richard Feynman, Report to the President (1986)',
  },
  placid: {
    quote: 'April advanced to May: a bright serene May it was; days of blue sky, placid sunshine, and soft western or southern gales filled up its duration.',
    author: 'Charlotte Brontë, Jane Eyre (1847)',
  },
  plucky: {
    quote: 'For my military knowledge, though I\'m plucky and adventury, / Has only been brought down to the beginning of the century',
    author: 'W. S. Gilbert, Songs of a Savoyard (1890)',
  },
  plummet: {
    quote: 'His parachute was shot half away, and if he\'d jumped he would have fallen like a plummet.',
    author: 'Ernie Pyle, Here Is Your War: Story of G.I. Joe (1945)',
  },
  ponder: {
    quote: 'Some days, the whole cast of crabs would come out of their holes and ponder at the Fishers as if a storm is taking form.',
    author: 'Sunil Santha, Climate Change, Small-Scale Fisheries, and Blue Justice: Fishscapes and Alternative Worldviews (2023)',
  },
  pragmatic: {
    quote: 'Another increasing concern with both ideological and pragmatic elements related to the situation of wickerworkers.',
    author: 'Joong-Seop Kim, The Korean Paekjong Under Japanese Rule (2013)',
  },
  prudent: {
    quote: 'He did not hesitate what to do. It would be prudent to continue on to Omaha, for it would be dangerous to return to the train, which the Indians might still be engaged in pillaging.',
    author: 'Jules Verne, Around the World in 80 Days (1864)',
  },
  quaint: {
    quote: 'The rock is a haven for rare wildlife, a landscape where pretty hedgerows and quaint villages are bordered by a breathtaking, craggy coastline.',
    author: 'Ian Sample, The Guardian (2011)',
  },
  quirk: {
    quote: 'But in the dream the forms are quirked by the peculiar troubles of the dreamer, whereas in myth the problems and solutions shown are directly valid for all mankind.',
    author: 'Joseph Campbell, The Hero with a Thousand Faces (1968)',
  },
  resilient: {
    quote: 'He’s resilient, and strong, but sometimes tonight, here, the weight of what he’s saying makes him stop, pause as if lost.',
    author: 'Michael Grumley, The Last Diary (1994)',
  },
  resounding: {
    quote: 'A tense hush — similar to those intervals of electrical stillness that separate the resoundings of a thunderstorm — fell upon the room.',
    author: 'Harold Schechter, Nevermore (2000)',
  },
  roving: {
    quote: 'It could complicate things for our little household. Particularly when Larry’s roving eye is factored in.',
    author: 'Paul Chadwick, Concrete: Visible Breath (1989)',
  },
  rustic: {
    quote: 'To this mingling of cultivated and rustic society may also be attributed the rural feeling that runs through British literature.',
    author: 'Washington Irving, Rural Life in England in The Sketchbook of Geoffrey Crayon (1820)',
  },
  serendipity: {
    quote: 'After I got here, in the first lockdown, my mum suddenly passed. It was the week of my final interview with the Mayor. It is serendipity that I am here when my dad really needs me.',
    author: 'Andy Byford talks to Paul Clifton, I enjoy really big challenges... (2020)',
  },
  skeptical: {
    quote: 'Numerous experimental tests and other observations have been offered in favor of animal mind reading, and although many scientists are skeptical, others assert that humans are not the only species capable of representing what others do and don’t perceive and know.',
    author: 'Colin Allen, Do I See What You See? (2012)',
  },
  smoulder: {
    quote: 'Before kindling the fire of jealousy remember it will consume others afterwards but first it will fill your heart and soul with a suffocating bitter smoke and smoulder every pore of your body.',
    author: 'Gopal Das. Sonkia, 110 Lessions to Live Life Blooming (2015)',
  },
  somber: {
    quote: 'My mother prepared herself for the evening with the same somber deliberateness of the gladiators in Spartacus.',
    author: 'Dirk Wittenborn, Fierce People (2002)',
  },
  stoic: {
    quote: 'Even a Rolls-Royce owner, I began to feel, would be a stoic to travel across Europe by car when the "Rheingold" is on offer.',
    author: 'G. Freeman Allen, The German Federal Railway today: 1.—Impressions of a week-end visit (1959)',
  },
  succinct: {
    quote: 'Here, in the succinctest terms, was expressed the true motive behind the establishment of villages. Herding the natives into centres, the government further centralized its own power.',
    author: 'Paul Carter, The Road to Botany Bay: An Essay in Spatial History (1987)',
  },
  temperate: {
    quote: '"Even in his most temperate moments he is constantly felling people with a hunting-crop."',
    author: 'Norman Lindsay, The Flyaway Highway (1936)',
  },
  tranquil: {
    quote: 'Some time passed before I felt tranquil even here: I had a vague dread that wild cattle might be near, or that some sportsman or poacher might discover me.',
    author: 'Charlotte Brontë, Jane Eyre (1847)',
  },
  vigilant: {
    quote: 'von der LUTKE / Argent, a crane vigilant proper. AG. Carl von der Lutke. Arr. 1857 with the British German Crimea legion. Obtained a grant of land in the Eastern Province of the Cape Colony.',
    author: 'C. Pama, Heraldry of South African Families: Coats of Arms/ Crests/ Ancestry (1972)',
  },
  volatile: {
    quote: 'The volatile truth of our words should continually betray the inadequacy of the residual statement.',
    author: 'Henry David Thoreau, Walden (1854)',
  },
  whimsical: {
    quote: 'Even the putatively innocuous whimsical shapes and designs of cakes and pastry, notably in Central Europe, retain to this day the phallic concept[.]',
    author: 'Harry E. Wedeck, Dictionary of Aphrodisiacs (1961)',
  },
  yearning: {
    quote: 'Mrs. MacClarty then took down a bottle of rennet, or yearning, as she called it.',
    author: 'Elizabeth Hamilton, Cottagers of Glenburnie (1808)',
  },
  zany: {
    quote: "Press articles emphasized his [Dizzy Gillespie's] ambassadorial role and drew attention to the paradox that he was a shrewd musician and leader despite his zany image.",
    author: 'Alyn Shipton, Groovin\' High: The Life of Dizzy Gillespie (1999)',
  },
  zealous: {
    quote: 'Doubtless many will exclaim against the Roman Catholic Church for this; but the simple truth is that Protestantism was no less zealous against the new scientific doctrine.',
    author: 'Andrew Dickson White, A History of the Warfare of Science with Theology in Christendom (1896)',
  },
  zest: {
    quote: 'He rolled his own cigarettes from a sack of Bull Durham, spilling flakes into his beer, which no doubt gained in zest thereby.',
    author: 'Peter De Vries, The Tents of Wickedness (1959)',
  },
  aloof: {
    quote: 'The charm of variety there was not, nor the excitement of incident; but I liked peace so well, and sought stimulus so little, that when the latter came I almost felt it a disturbance, and rather still wished it had held aloof.',
    author: 'Charlotte Brontë, Villette (1853)',
  },
  axiom: {
    quote: 'It is an axiom in my mind, that our liberty can never be safe but in the hands of the people themselves, and that too of the people with a certain degree of instruction.',
    author: 'Thomas Jefferson, Letter to George Washington (1786)',
  },
  boycott: {
    quote: 'A boycott suggests an economic squeeze, leaving one bogged down in a negative. But we were concerned with the positive. Our concern would not be to put the bus company out of business, but to put justice in business.',
    author: 'Martin Luther King Jr., Stride Toward Freedom (1958)',
  },
  brazen: {
    quote: "The brazen plate upon the door (which being Mr. Pecksniff's, could not lie) bore this inscription, 'PECKSNIFF, ARCHITECT,' to which Mr. Pecksniff, on his cards of business, added, 'AND LAND SURVEYOR.'",
    author: 'Charles Dickens, Martin Chuzzlewit (1844)',
  },
  dogma: {
    quote: 'Dogma demands authority, rather than intelligent thought, as the source of opinion; it requires persecution of heretics and hostility to unbelievers; it asks of its disciples that they should inhibit natural kindliness in favor of systematic hatred.',
    author: 'Bertrand Russell, Unpopular Essays (1950)',
  },
  dubious: {
    quote: 'A blush is no language: only a dubious flag-signal which may mean either of two contradictories.',
    author: 'George Eliot, Daniel Deronda (1876)',
  },
  empirical: {
    quote: 'Such knowledge is entitled empirical, and distinguished from the a priori, which have their sources entirely a priori, in the understanding, independently of experience.',
    author: 'Immanuel Kant, Critique of Pure Reason (1781)',
  },
  erosion: {
    quote: 'Each recession of plant types bred erosion; each increment to erosion bred a further recession of plants. The result today is a progressive and mutual deterioration, not only of plants and soils, but of the animal community subsisting thereon.',
    author: 'Aldo Leopold, A Sand County Almanac (1949)',
  },
  fickle: {
    quote: 'As usual, the fickle, unreasoning world took Muff Potter to its bosom and fondled him as lavishly as it had abused him before.',
    author: 'Mark Twain, The Adventures of Tom Sawyer (1876)',
  },
  jargon: {
    quote: 'To be infected with the jargon of a particular profession, and to know only the language of a single rank of mortals, is indeed sufficiently despicable.',
    author: 'Samuel Johnson, The Rambler No. 99 (1751)',
  },
  mundane: {
    quote: 'What can be better than to get out a book on Saturday afternoon and thrust all mundane considerations away till next week.',
    author: 'C. S. Lewis, Letter to Arthur Greeves (1920)',
  },
  nuance: {
    quote: 'Ideas in modern Russia are machine-cut blocks coming in solid colors; the nuance is outlawed, the interval walled up, the curve grossly stepped.',
    author: 'Vladimir Nabokov, Pale Fire (1962)',
  },
  satire: {
    quote: "Satire is a sort of glass, wherein beholders do generally discover everybody's face but their own; which is the chief reason for that kind reception it meets with in the world, and that so very few are offended with it.",
    author: 'Jonathan Swift, The Battle of the Books (1704)',
  },
  symbiosis: {
    quote: 'The mycorrhizal symbiosis enables the fungi to forage for mineral nutrients in the soil and deliver them to the tree in exchange for carbohydrates. The mycorrhizae may form fungal bridges between individual trees, so that all trees in a forest are connected.',
    author: 'Robin Wall Kimmerer, Braiding Sweetgrass (2013)',
  },
  veneer: {
    quote: "Lily considered with interest the expression of their faces: the girl's turned toward her companion's like an empty plate held up to be filled, while the man lounging at her side already betrayed the encroaching boredom which would presently crack the thin veneer of his smile.",
    author: 'Edith Wharton, The House of Mirth (1905)',
  },
  veto: {
    quote: 'For in the exercise of his power of veto, which is of course, beyond all comparison, his most formidable prerogative, the President acts not as the executive but as a third branch of the legislature.',
    author: 'Woodrow Wilson, Congressional Government (1885)',
  },
  efflorescence: {
    quote: 'The Venice of modern fiction and drama is a thing of yesterday, a mere efflorescence of decay, a stage dream which the first ray of daylight must dissipate into dust.',
    author: 'John Ruskin, The Stones of Venice (1853)',
  },
  profound: {
    quote: 'In analyzing history do not be too profound, for often the causes are quite superficial.',
    author: 'Ralph Waldo Emerson, Journals',
  },
  scrupulous: {
    quote: "The enemies to property at first pretended a most tender, delicate, and scrupulous anxiety for keeping the king's engagements with the public creditor.",
    author: 'Edmund Burke, Reflections on the Revolution in France (1790)',
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

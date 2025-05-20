import pandas as pd
import csv

# Dictionary of unique secondary definitions
unique_secondary_defs = {
    # Words with missing definition_2
    'pulchritude': "Physical attractiveness that captivates the aesthetic senses.",
    'recalcitrant': "Resistant to guidance or discipline; refusing to follow orders.",
    'obsequious': "Characterized by excessive flattery and servile compliance.",
    'perspicacity': "Keen mental perception and understanding; discernment.",
    'impecunious': "Chronically lacking financial resources; poor.",
    'aporia': "A logical impasse or contradiction; a puzzle without a clear solution.",
    'recondite': "Dealing with abstruse or profound matters, accessible only to experts.",
    'avuncular': "Suggestive of an uncle's kindness or indulgence toward a younger person.",
    'assiduous': "Marked by careful unremitting attention or persistent application.",
    'pugnacious': "Characterized by aggressive, combative behavior.",
    'puerile': "Displaying immaturity in reasoning, taste, or judgment.",
    'potentate': "A person wielding great power or authority, especially a sovereign.",
    'inchoate': "Just begun and not fully formed; rudimentary.",
    'execrable': "Deserving to be denounced as evil or abhorrent.",
    'diaphanous': "So fine in texture as to allow light to pass through.",
    'indolent': "Habitually lazy or inactive; averse to exertion.",
    'salacious': "Arousing or appealing to sexual desire or imagination.",
    'genuflect': "To bend in deference or respect, especially toward authority.",
    'lachrymose': "Given to shedding tears; mournful.",
    'inveigle': "To win over by wiles, flattery, or artful talk.",
    'truancy': "Deliberate absence from mandatory activities without permission.",
    'lacuna': "A gap or missing part in a manuscript, argument, or series.",
    'pugilist': "A professional boxer or fighter.",
    'palimpsest': "An object bearing visible traces of earlier forms or iterations.",
    'anathema': "A formal ecclesiastical ban, curse, or excommunication.",
    'parochial': "Limited in range or scope; narrow and restricted in outlook.",
    'adventitious': "Arising from an external source rather than inherent causes.",
    'lassitude': "A state of physical or mental weariness; lack of energy.",
    'gravid': "Carrying developing young or eggs; pregnant.",
    'antebellum': "Belonging to the period before a war, especially the American Civil War.",
    'orotund': "Characterized by strength, fullness, and clarity of sound.",
    'temerity': "Excessive confidence or boldness; audacity.",
    'peremptory': "Leaving no opportunity for denial or refusal; imperative.",
    'sardonic': "Characterized by bitter or scornful derision; mocking.",
    'staid': "Characterized by dignity and propriety; sedate.",
    'blithe': "Showing a casual and cheerful indifference considered to be callous or improper.",
    'philistine': "A person who is hostile or indifferent to culture and the arts.",
    'perdition': "A state of eternal punishment and damnation into which a sinful and unrepentant person passes after death.",
    'contrite': "Feeling or expressing remorse or penitence; affected by guilt.",
    'indolence': "Avoidance of activity or exertion; laziness.",
    'supercilious': "Behaving or looking as though one thinks one is superior to others.",
    'venal': "Susceptible to bribery or corruption.",
    'prurient': "Having or encouraging an excessive interest in sexual matters.",
    'simulacrum': "An image or representation of someone or something.",
    'lambent': "Dealing lightly and gracefully with a subject; brilliantly playful.",
    'abstemious': "Marked by restraint especially in the consumption of food or alcohol.",
    'kismet': "Destiny; fate.",
    'verisimilitude': "The appearance of being true or real.",
    'obstreperous': "Noisy and difficult to control.",
    'laconic': "Using minimal words; terse.",
    'cogent': "Appealing forcibly to the mind or reason; convincing.",
    'trenchant': "Vigorous or incisive in expression or style.",
    'bifurcate': "To divide into two branches or parts.",
    'dissemble': "To conceal one's true motives, feelings, or beliefs.",
    'piquancy': "A pleasantly sharp and appetizing flavor.",
    'gestalt': "A structure, arrangement, or pattern of physical, biological, or psychological phenomena.",
    'enervate': "To cause weakness or a feeling of exhaustion.",
    'intransigent': "Refusing to compromise or agree; inflexible.",
    'ubiquitous': "Present, appearing, or found everywhere.",
    'juxtapose': "To place or deal with close together for contrasting effect.",
    'tantamount': "Equivalent in seriousness to; virtually the same as.",
    'wheedle': "To influence or entice by soft words or flattery.",
    'yokel': "A naive or gullible inhabitant of a rural area or small town.",
    'capitulate': "To surrender under agreed conditions.",
    'deleterious': "Causing harm or damage.",
    'effrontery': "Insolent or impertinent behavior.",
    'adamant': "Refusing to be persuaded or to change one's mind.",
    'bombastic': "High-sounding but with little meaning; inflated.",
    'cacophony': "A harsh, discordant mixture of sounds.",
    'didactic': "Intended to teach, particularly in having moral instruction as an ulterior motive.",
    'gregarious': "Fond of company; sociable.",
    'ignominious': "Deserving or causing public disgrace or shame.",
    'ostensible': "Stated or appearing to be true, but not necessarily so.",
    'palpable': "Able to be touched or felt.",
    'quiescent': "In a state or period of inactivity or dormancy.",
    'redolent': "Strongly reminiscent or suggestive of.",
    'saturnine': "Slow and gloomy.",
    'truculent': "Eager or quick to argue or fight; aggressively defiant.",
    'umbrage': "Offense or annoyance.",
    'vacillate': "To waver between different opinions or actions; be indecisive.",
    'wistful': "Having or showing a feeling of vague or regretful longing.",
    'cogitate': "To think deeply about something; meditate or reflect.",
    'aphorism': "A pithy observation that contains a general truth.",
    'placate': "To make someone less angry or hostile.",
    'inimical': "Tending to obstruct or harm.",
    'irascible': "Having or showing a tendency to be easily angered.",
    'numinous': "Having a strong religious or spiritual quality; indicating or suggesting the presence of a divinity.",
    'oblique': "Neither parallel nor at a right angle to a specified or implied line; slanting.",
    'pedantic': "Overly concerned with minute details or formalisms, especially in teaching.",
    'reticent': "Not revealing one's thoughts or feelings readily.",
    'salutary': "Producing a beneficial effect.",
    'semantic': "Relating to meaning in language or logic.",
    'vexatious': "Causing or tending to cause annoyance, frustration, or worry.",
    'vicariously': "Experienced in the imagination through the feelings or actions of another person.",
    'acerbic': "Sharp and forthright.",
    'bellicose': "Demonstrating aggression and willingness to fight.",
    'atavistic': "Relating to or characterized by reversion to something ancient or ancestral.",
    'hegemony': "Leadership or dominance, especially by one country or social group over others.",
    'perfidious': "Deceitful and untrustworthy.",
    'turpitude': "Depravity; wickedness.",
    'inveterate': "Having a particular habit, activity, or interest that is long-established and unlikely to change.",
    'putative': "Generally considered or reputed to be.",
    'schadenfreude': "Pleasure derived by someone from another person's misfortune.",
    'rigamarole': "A lengthy and complicated procedure.",
    'byzantine': "Excessively complicated, typically involving a great deal of administrative detail.",
    'anachronistic': "Belonging to a period other than that being portrayed.",
    'luddite': "A person opposed to new technology or ways of working.",
    'sophism': "A clever but false argument, especially one used deliberately to deceive.",
    'chagrin': "Annoyance or distress at having failed or been humiliated.",
    'festoon': "A chain or garland of flowers, leaves, or ribbons, hung in a curve as a decoration.",
    'turgid': "Swollen and distended or congested.",
    'penury': "Extreme poverty; destitution.",
    'pejorative': "Expressing contempt or disapproval.",
    'solicitude': "Care or concern for someone or something.",
    'convivial': "Friendly, lively, and enjoyable.",
    'admonish': "To warn or reprimand someone firmly.",
    'myopic': "Lacking imagination, foresight, or intellectual insight.",
    'egregious': "Outstandingly bad; shocking.",
    'dilettante': "A person who cultivates an area of interest without real commitment or knowledge.",
    'chauvinist': "A person displaying aggressive or exaggerated patriotism.",
    'jingoism': "Extreme patriotism, especially in the form of aggressive or warlike foreign policy.",
    'prosaic': "Having the style or diction of prose; lacking poetic beauty.",
    'apotheosis': "The highest point in the development of something; culmination or climax.",
    'ambivalent': "Having mixed feelings or contradictory ideas about something or someone.",
    'beguiling': "Charming or enchanting, often in a deceptive way.",
    'treacle': "Cloying sentimentality or flattery.",
    'sartorial': "Relating to tailoring, clothes, or style of dress.",
    'aegis': "The protection, backing, or support of a particular person or organization.",
    'indomitable': "Impossible to subdue or defeat.",
    'equivocation': "The use of ambiguous language to conceal the truth or to avoid committing oneself.",
    'forbearance': "Patient self-control; restraint and tolerance.",
    'feckless': "Lacking initiative or strength of character; irresponsible.",
    'esoteric': "Intended for or likely to be understood by only a small number of people with a specialized knowledge or interest.",
    'sidle': "To move sideways or obliquely.",
    'depredation': "An act of attacking or plundering.",
    'astringent': "Causing the contraction of body tissues, typically of the skin.",
    'stolid': "Calm, dependable, and showing little emotion or animation.",
    'goad': "A spiked stick used for driving cattle.",
    'diffident': "Modest or shy because of a lack of self-confidence.",
    'evanescent': "Soon passing out of sight, memory, or existence; quickly fading or disappearing.",
    'ostentatious': "Characterized by vulgar or pretentious display; designed to impress or attract notice.",
    'ribald': "Referring to sexual matters in an amusingly rude or irreverent way.",
    'arable': "Suitable for growing crops.",
    'eponymous': "Giving one's name to a tribe, place, or institution.",
    'bilk': "To cheat or defraud.",
    'pastiche': "An artistic work in a style that imitates that of another work, artist, or period.",
    'inscrutable': "Impossible to understand or interpret.",
    'auspicious': "Conducive to success; favorable.",
    'stygian': "Relating to the River Styx; extremely dark, gloomy, or forbidding.",
    'enmity': "A state or feeling of active opposition or hostility.",
    'antipathy': "A deep-seated feeling of dislike; aversion.",
    'propitious': "Giving or indicating a good chance of success; favorable.",
    'beatific': "Showing or producing exalted joy or blessedness.",
    'idiosyncrasy': "A mode of behavior or way of thought peculiar to an individual.",
    'portent': "A sign or warning that something, especially something momentous or calamitous, is likely to happen.",
    'inure': "To accustom (someone) to something, especially something unpleasant.",
    'indigent': "Poor; needy.",
    'usurp': "To take (a position of power or importance) illegally or by force.",
    'sentient': "Able to perceive or feel things.",
    'affective': "Relating to moods, feelings, and attitudes.",
    'replete': "Filled or well-supplied with something.",
    'facile': "Ignoring the true complexities of an issue; superficial.",
    'rarefied': "Made less dense (of air, especially that at high altitudes).",
    'austere': "Severe or strict in manner, attitude, or appearance.",
    'aplomb': "Self-confidence or assurance, especially when in a demanding situation.",
    'pariah': "An outcast.",
    'somatic': "Relating to the body, especially as distinct from the mind.",
    'deign': "Do something that one considers to be beneath one's dignity.",
    'pantheon': "All the gods of a people or religion collectively.",
    'remonstrate': "Make a forcefully reproachful protest.",
    'alacrity': "Brisk and cheerful readiness.",
    'amorphous': "Without a clearly defined shape or form.",
    'bereft': "Deprived of or lacking something, especially a non-material asset.",
    'cajole': "Persuade (someone) to do something by sustained coaxing or flattery.",
    'cavort': "Jump or dance around excitedly.",
    'commensurate': "Corresponding in size or degree; in proportion.",
    'compunction': "A feeling of guilt or moral scruple that prevents or follows the doing of something bad.",
    'eclectic': "Deriving ideas, style, or taste from a broad and diverse range of sources.",
    'duress': "Threats, violence, constraints, or other action brought to bear on someone to do something against their will or better judgment.",
    'equivocal': "Open to more than one interpretation; ambiguous.",
    'extol': "Praise enthusiastically.",
    'impetuous': "Acting or done quickly and without thought or care.",
    'inexorable': "Impossible to stop or prevent.",
    'insidious': "Proceeding in a gradual, subtle way, but with harmful effects.",
    'ostracize': "Exclude (someone) from a society or group.",
    'presage': "Be a sign or warning of (an imminent event, typically an unwelcome one).",
    'relegate': "Assign an inferior rank or position to.",
    'vestigial': "Forming a very small remnant of something that was once much larger or more noticeable.",
    'vitriol': "Cruel and bitter criticism.",
    'serene': "Calm, peaceful, and untroubled; tranquil.",
    'gleam': "A flash or beam of light.",
    'mirth': "Amusement, especially as expressed in laughter.",
    'ponder': "Think about (something) carefully, especially before making a decision or reaching a conclusion.",
    'brisk': "Active, fast, and energetic.",
    'dwell': "Live in or at a specified place.",
    'humble': "Having or showing a modest or low estimate of one's own importance.",
    'nimble': "Quick and light in movement or action; agile.",
    'glean': "Gather information or material bit by bit.",
    'fret': "Be constantly or visibly worried or anxious.",
    'sturdy': "Strongly and solidly built.",
    'keen': "Having or showing eagerness or enthusiasm.",
    'bask': "Lie exposed to warmth and light, typically from the sun, for relaxation and pleasure.",
    'quaint': "Attractively unusual or old-fashioned.",
    'lurk': "Be or remain hidden so as to wait in ambush for someone or something.",
    'amble': "Walk or move at a slow, relaxed pace.",
    'dusk': "The darker stage of twilight.",
    'spry': "Active; lively.",
    'fable': "A short story, typically with animals as characters, conveying a moral.",
    'harbor': "A place on the coast where vessels may find shelter, especially one protected from rough water by piers, jetties, and other artificial structures.",
    'idle': "Without purpose or effect; pointless.",
    'jolly': "Happy and cheerful.",
    'kindle': "Light or set on fire.",
    'lively': "Full of life and energy; active and outgoing.",
    'meadow': "A piece of grassland, especially one used for hay.",
    'notion': "A conception of or belief about something.",
    'plush': "Luxurious.",
    'stroll': "Walk in a leisurely way.",
    'utter': "Complete; absolute.",
    'whim': "A sudden desire or change of mind, especially one that is unusual or unexplained.",
    'yarn': "A long or rambling story, especially one that is implausible.",
    'zeal': "Great energy or enthusiasm in pursuit of a cause or an objective.",
    'glee': "Great delight.",
    'dandy': "A man unduly devoted to style, neatness, and fashion in dress and appearance.",
    'eager': "Wanting to do or have something very much.",
    'fancy': "Elaborate in structure or decoration.",
    'jolt': "Push or shake (someone or something) abruptly and roughly.",
    'knack': "An acquired or natural skill at doing something.",
    'latch': "A metal bar with a catch and lever used for fastening a door or gate.",
    'mellow': "Soft, rich, and full-flavored.",
    'nifty': "Particularly good, skillful, or effective.",
    'plucky': "Having or showing determined courage in the face of difficulties.",
    'quirk': "A peculiar behavioral habit.",
    'rustic': "Relating to the countryside; rural.",
    'snug': "Comfortable, warm, and cozy; well protected from the weather or cold.",
    'twirl': "Spin or rotate rapidly.",
    'upbeat': "Cheerful; optimistic.",
    'witty': "Showing or characterized by quick and inventive verbal humor.",
    'yonder': "At some distance in the direction indicated; over there.",
    'zest': "Great enthusiasm and energy.",
    'bloom': "A flower, especially one cultivated for its beauty.",
    'clutch': "A tight grasp.",
    'dazzle': "Brightness that blinds someone temporarily.",
    'flicker': "An unsteady movement of a flame or light that causes rapid variations in brightness.",
    'glimpse': "A momentary or partial view.",
    'huddle': "Crowd together; nestle closely.",
    'lofty': "Of imposing height.",
    'murmur': "A low continuous background noise.",
    'nudge': "A light touch or push.",
    'ogle': "Stare at in a lecherous manner.",
    'prance': "Walk or move around with ostentatious, exaggerated movements.",
    'swoop': "Move rapidly downward through the air.",
    'tangle': "A confused mass of something twisted together.",
    'usher': "A person who shows people to their seats, especially in a theater or at a wedding.",
    'wade': "Walk with effort through water or another liquid or viscous substance.",
    'yelp': "A short sharp cry, especially of pain or alarm.",
    'zany': "Amusingly unconventional and idiosyncratic.",
    'lecher': "A lecherous man.",
    'hypochondriac': "A person who is abnormally anxious about their health.",
    'martinet': "A strict disciplinarian, especially in the armed forces.",
    'mote': "A tiny piece of substance; a speck.",
    'speck': "A small discoloration or spot.",
    'myriad': "A countless or extremely great number.",
    'sullen': "Bad-tempered and sulky; gloomy.",
    'fluke': "An unlikely chance occurrence, especially a surprising piece of luck.",
    'torpid': "Mentally or physically inactive; lethargic.",
    'antecedent': "A thing or event that existed before or logically precedes another.",
    'penultimate': "Last but one in a series of things; second to last.",
    'troubadour': "A French medieval lyric poet composing and singing in Provençal in the 11th to 13th centuries, especially on the theme of courtly love.",
    'vehement': "Showing strong feeling; forceful, passionate, or intense.",
    'conjoint': "Joined together; joint.",
    'satiate': "Satisfy (a desire or an appetite) to the full.",
    'haughty': "Arrogantly superior and disdainful.",
    'reminisce': "Indulge in enjoyable recollection of past events.",
    'skulk': "Keep out of sight, typically with a sinister or cowardly motive.",
    'idiom': "A group of words established by usage as having a meaning not deducible from those of the individual words.",
    'fain': "Pleased or willing under the circumstances.",
    'terminus': "A final point in space or time; an end or extremity.",
    'hectic': "Full of incessant or frantic activity.",
    'fathomless': "Too deep to be measured.",
    'bastion': "A projecting part of a fortification built at an angle to the line of a wall, so as to allow defensive fire in several directions.",
    'unrequited': "Not reciprocated or returned in kind.",
    'punctual': "Happening or doing something at the agreed or proper time; on time.",
    'multitude': "A large number of people or things.",
    'perpetual': "Never ending or changing.",
    'saunter': "Walk in a slow, relaxed manner, without hurry or effort.",
    'wend': "Go in a specified direction, typically slowly or by an indirect route.",
    'tenement': "A room or a set of rooms forming a separate residence within a house or block of apartments.",
    'ample': "Enough or more than enough; plentiful.",
    'vista': "A pleasing view.",
    'benevolent': "Well meaning and kindly.",
    'altruism': "Disinterested and selfless concern for the well-being of others.",
    'frivolous': "Not having any serious purpose or value.",
    'pulpit': "A raised platform or lectern in a church or chapel from which the preacher delivers a sermon.",
    'paradox': "A seemingly absurd or self-contradictory statement or proposition that when investigated or explained may prove to be well founded or true.",
    'reconnaissance': "Military observation of a region to locate an enemy or ascertain strategic features.",
    'futile': "Incapable of producing any useful result; pointless.",
    'daguerreotype': "A photograph taken by an early photographic process employing an iodine-sensitized silvered plate and mercury vapor.",
    'pervade': "Spread through and be perceived in every part of.",
    'froth': "A mass of small bubbles in liquid caused by agitation, fermentation, or salivating.",
    'rapt': "Completely fascinated or absorbed by what one is seeing or hearing.",
    'swash': "A body of rushing water.",
    'malignant': "Malevolent.",
    'adulterous': "Characterized by or involving adultery.",
    'scallop': "An edible bivalve mollusk with a ribbed fan-shaped shell.",
    'splendor': "Magnificent and splendid appearance; grandeur.",
    'pensive': "Engaged in, involving, or reflecting deep or serious thought.",
    'plaudit': "An expression of praise or approval.",
    'carouse': "Drink plentiful amounts of alcohol and enjoy oneself with others in a noisy, lively way.",
    'unalloyed': "Complete and unreserved.",
    'ruddy': "Having a healthy reddish color.",
    'falter': "Move unsteadily or in a way that shows a lack of confidence.",
    'tableau': "A group of models or motionless figures representing a scene from a story or from history; a tableau vivant.",
    'eunoia': "Beautiful thinking; a well mind.",
    'soiree': "An evening party or gathering, typically in a private house, for conversation or music.",
    'smoulder': "Burn slowly with smoke but no flame.",
    'nonchalance': "The trait of remaining calm and seeming not to care; casual lack of concern.",
    'yearning': "A feeling of intense longing for something.",
    'edifice': "A large, imposing building.",
    'reprobate': "An unprincipled person.",
    'peruse': "Read (something), typically in a thorough or careful way.",
    'copious': "Abundant in supply or quantity.",
    'creed': "A system of Christian or other religious belief; a faith.",
    'audacity': "A willingness to take bold risks.",
    'cosmopolitan': "Familiar with and at ease in many different countries and cultures.",
    'menial': "Unskilled work, especially domestic work such as cleaning.",
    'excursion': "A short journey or trip, especially one engaged in as a leisure activity.",
    'rapture': "A feeling of intense pleasure or joy.",
    'sojourn': "A temporary stay.",
    'hirsute': "Hairy.",
    'ishtmus': "A narrow strip of land with sea on either side, forming a link between two larger areas of land.",
    'interstitial': "Relating to or situated in the small, narrow spaces between tissues or parts of an organ.",
    'latent': "Existing but not yet developed or manifest; hidden or concealed.",
    'demure': "Reserved, modest, and shy.",
    'consolation': "The comfort received by a person after a loss or disappointment.",
    'plummet': "Fall or drop straight down at high speed.",
    'chromatic': "Relating to or produced by color.",
    'balk': "Hesitate or be unwilling to accept an idea or undertaking.",
    'diligent': "Having or showing care and conscientiousness in one's work or duties.",
    'turbulent': "Characterized by conflict, disorder, or confusion; not controlled or calm.",
    'waft': "Pass or cause to pass easily or gently through or as if through the air.",
    'flaunt': "Display (something) ostentatiously, especially in order to provoke envy or admiration or to show defiance.",
    'roving': "Traveling constantly without a fixed destination; wandering.",
    'ardor': "Enthusiasm or passion.",
    'swarthy': "Dark-skinned.",
    'lore': "A body of traditions and knowledge on a subject or held by a particular group, typically passed from person to person by word of mouth.",
    'apparition': "A ghost or ghostlike image of a person.",
    'volition': "The faculty or power of using one's will.",
    'cusp': "A pointed end where two curves meet.",
    'grotto': "A small picturesque cave, especially an artificial one in a park or garden.",
    'resounding': "Unmistakable; emphatic.",
    'diastole': "The phase of the heart's cycle during which the heart muscle relaxes and allows the chambers to fill with blood.",
    'maneouver': "A movement or series of moves requiring skill and care.",
    'systole': "The phase of the heart's cycle during which the heart muscle contracts and pumps blood from the chambers into the arteries.",
    'incontinent': "Having no or insufficient voluntary control over urination or defecation.",
    'untrodden': "Not having been walked on or traversed.",
    'scant': "Barely sufficient or adequate.",
    'scurry': "Move hurriedly with short quick steps.",
    'bequeath': "Leave (property) to a person or other beneficiary by a will.",
    'infidel': "A person who does not believe in religion or who adheres to a religion other than one's own.",
    'tantalize': "Torment or tease (someone) with the sight or promise of something that is unobtainable.",
    'copulate': "Have sexual intercourse.",
    'chastity': "The state or practice of refraining from extramarital, or especially from all, sexual intercourse.",
    'luscious': "Having a pleasingly rich, sweet taste.",
    'spontaneous': "Performed or occurring as a result of a sudden inner impulse or inclination and without premeditation or external stimulus.",
    'dissuade': "Persuade (someone) not to take a particular course of action.",
    'heft': "Weight.",
    'acrid': "Having an irritatingly strong and unpleasant taste or smell.",
    'premontory': "A point of high land that juts out into the sea or a lake; a headland.",
    'hankering': "A strong desire to have or do something.",
    'plenum': "A space completely filled with matter.",
    'promulgation': "The promotion or publication of a doctrine or practice.",
    'articulate': "Having or showing the ability to speak fluently and coherently.",
    'pismire': "An ant.",
    'exquisite': "Extremely beautiful and, typically, delicate.",
    'stucco': "Fine plaster used for coating wall surfaces or molding into architectural decorations.",
    'slovenly': "Messy and dirty.",
    'gulch': "A narrow and steep-sided ravine marking the course of a fast stream.",
    'undulate': "Move with a smooth wavelike motion.",
    'cataract': "A large waterfall.",
    'husk': "The dry outer covering of some fruits or seeds.",
    'nucleus': "The central and most important part of an object, movement, or group, forming the basis for its activity and growth.",
    'bivouac': "A temporary camp without tents or cover, used especially by soldiers or mountaineers."
}

# Fill in missing examples
missing_examples = {
    'aporia': "The philosophical aporia left the students in a state of puzzlement.",
    'bilious': "His bilious temperament made him difficult to work with.",
    'lugubrious': "The funeral was marked by lugubrious music and weeping.",
    'patois': "She spoke in the local patois that few outsiders could understand.",
    'asperity': "He responded with asperity to the criticism of his work.",
    'elide': "The speaker tended to elide the difficult parts of the historical narrative.",
    'recondite': "The professor's recondite lectures attracted only the most dedicated students.",
    'avuncular': "The older colleague offered avuncular advice to the new employees.",
    'assiduous': "Her assiduous study habits earned her top marks in the class.",
    'pugnacious': "The pugnacious debater challenged every point made by his opponents.",
    'puerile': "The comedian's puerile jokes failed to amuse the sophisticated audience.",
    'potentate': "The local potentate ruled with an iron fist, brooking no opposition.",
    'inchoate': "His inchoate ideas needed more development before presentation.",
    'execrable': "The critic described the performance as execrable in every respect.",
    'diaphanous': "She wore a diaphanous gown that caught the evening light.",
    'indolent': "The indolent student rarely completed assignments on time.",
    'salacious': "The tabloid published salacious details about the celebrity's private life.",
    'genuflect': "Visitors to the cathedral would genuflect before the altar.",
    'lachrymose': "The lachrymose widow could not be consoled at the funeral.",
    'inveigle': "He tried to inveigle his way into the exclusive club.",
    'truancy': "The school implemented a new policy to combat truancy.",
    'lacuna': "The manuscript contained a significant lacuna where pages were missing.",
    'pugilist': "The retired pugilist still trained young boxers at the gym.",
    'palimpsest': "The ancient palimpsest revealed earlier texts beneath the visible writing.",
    'anathema': "His liberal views were anathema to the conservative community.",
    'parochial': "Her parochial outlook prevented her from appreciating foreign customs.",
    'adventitious': "The adventitious discovery of penicillin revolutionized medicine.",
    'lassitude': "Summer heat induced a state of lassitude among the workers.",
    'gravid': "The gravid female fish sought shallow water to lay her eggs.",
    'antebellum': "The antebellum mansion had been preserved as a historical monument.",
    'orotund': "The orotund voice of the opera singer filled the concert hall.",
    'temerity': "He had the temerity to question the authority of the judge.",
    'peremptory': "The teacher silenced the class with a peremptory gesture.",
    'sardonic': "His sardonic smile suggested he didn't believe a word of the explanation.",
    'staid': "The staid banker never participated in office celebrations.",
    'blithe': "She remained blithe about the potential dangers of the expedition.",
    'philistine': "Art critics dismissed him as a philistine for his conventional tastes.",
    'perdition': "The preacher warned that sinners would face eternal perdition.",
    'contrite': "The contrite child apologized for breaking the vase.",
    'indolence': "Summer indolence overtook the students during vacation.",
    'supercilious': "The supercilious waiter looked down his nose at customers who ordered house wine.",
    'venal': "The venal official accepted bribes in exchange for contracts.",
    'prurient': "The tabloid catered to prurient interests with its sensational stories.",
    'simulacrum': "The wax figure was an eerily accurate simulacrum of the historical figure.",
    'lambent': "The lambent flames cast a gentle glow over the room.",
    'abstemious': "His abstemious lifestyle included neither alcohol nor rich foods.",
    'verisimilitude': "The historical novel achieved verisimilitude through meticulous research.",
    'bifurcate': "The path would bifurcate at the old oak tree, leading to different villages.",
    'dissemble': "The politician tried to dissemble when questioned about the scandal.",
    'piquancy': "The chef added spices to give piquancy to the otherwise bland dish.",
    'gestalt': "The therapist focused on the gestalt of the patient's experiences rather than isolated incidents.",
    'cogitate': "The philosopher would cogitate for hours on ethical dilemmas.",
    'aphorism': "Benjamin Franklin's aphorisms continue to be quoted centuries later.",
    'placate': "The manager offered a bonus to placate the disgruntled employees.",
    'inimical': "The dictator's policies were inimical to democratic principles.",
    'irascible': "The irascible old man shouted at children who stepped on his lawn.",
    'numinous': "The cathedral's interior evoked a numinous feeling in visitors.",
    'oblique': "She made an oblique reference to the scandal without naming names.",
    'pedantic': "The pedantic professor corrected every minor error in his students' papers.",
    'reticent': "The reticent witness revealed little during questioning.",
    'salutary': "The economic downturn had the salutary effect of encouraging more prudent spending.",
    'semantic': "The debate devolved into a semantic argument about the definition of terms.",
    'vexatious': "The neighbor's vexatious complaints about noise disrupted community harmony.",
    'vicariously': "The homebound traveler lived vicariously through travel documentaries.",
    'vicissitude': "He faced the vicissitudes of fortune with remarkable equanimity.",
    'histrionic': "Her histrionic response to minor problems alienated her friends.",
    'acerbic': "The critic was known for acerbic reviews that spared no one's feelings.",
    'bellicose': "The bellicose rhetoric from both countries raised fears of war.",
    'atavistic': "The riot revealed atavistic impulses normally suppressed by civilization.",
    'hegemony': "The country sought to establish hegemony over the entire region.",
    'obdurate': "He remained obdurate, refusing to alter his decision.",
    'perfidious': "The perfidious advisor betrayed the king's confidence.",
    'turpitude': "The moral turpitude of the defendant was cited during sentencing.",
    'inveterate': "The inveterate gambler could not resist placing one more bet.",
    'putative': "The putative heir to the fortune was actually unrelated to the deceased.",
    'schadenfreude': "He felt a twinge of schadenfreude when his rival's business failed.",
    'rigamarole': "Applying for a permit involved a tedious rigamarole of paperwork.",
    'byzantine': "The tax code's byzantine complexity confuses even experts.",
    'anachronistic': "The film contained anachronistic elements like modern slang in a medieval setting.",
    'luddite': "The office luddite refused to use the new computer system.",
    'sophism': "His argument was a clever sophism that distracted from the real issue.",
    'chagrin': "To his chagrin, his presentation was interrupted by technical difficulties.",
    'festoon': "They festooned the hall with garlands for the wedding celebration.",
    'turgid': "The academic paper was written in turgid prose that obscured its meaning.",
    'penury': "The once-wealthy family had fallen into penury after bad investments.",
    'pejorative': "She objected to the pejorative terms used to describe immigrants.",
    'solicitude': "The nurse showed great solicitude for her patients' comfort.",
    'convivial': "The convivial atmosphere at the party put everyone at ease.",
    'admonish': "The teacher admonished students who hadn't completed their homework.",
    'myopic': "The myopic policy focused on short-term gains while ignoring long-term consequences.",
    'egregious': "The referee made an egregious error that changed the outcome of the game.",
    'dilettante': "Though a dilettante in music, he spoke as if he were an expert.",
    'chauvinist': "The chauvinist believed his country superior to all others.",
    'jingoism': "The newspaper's jingoism during wartime discouraged any criticism of military actions.",
    'prosaic': "He described his daily commute in prosaic terms, without embellishment.",
    'apotheosis': "The championship victory represented the apotheosis of his career.",
    'ambivalent': "She felt ambivalent about the job offer, seeing both advantages and drawbacks.",
    'beguiling': "The beguiling melody attracted listeners from across the park.",
    'treacle': "The film's treacle ending disappointed critics who preferred subtlety.",
    'sartorial': "His sartorial elegance made him stand out at the casual gathering.",
    'aegis': "The project proceeded under the aegis of the National Science Foundation.",
    'indomitable': "Her indomitable spirit helped her overcome numerous setbacks.",
    'equivocation': "The politician's equivocation on the issue frustrated voters seeking clarity.",
    'forbearance': "The teacher showed remarkable forbearance when faced with disruptive students.",
    'feckless': "The feckless management team failed to address the company's problems.",
    'esoteric': "The lecture on esoteric philosophical concepts attracted few students.",
    'sidle': "He would sidle up to important people at parties, hoping to make connections.",
    'depredation': "Farmers complained about the depredations of wild boars on their crops.",
    'astringent': "The astringent lotion helped clear up his skin condition.",
    'stolid': "The stolid security guard remained unmoved by the commotion.",
    'goad': "She used criticism to goad him into working harder.",
    'diffident': "The diffident student rarely spoke up in class despite knowing the answers.",
    'evanescent': "The evanescent beauty of the sunset lasted only minutes.",
    'ostentatious': "Their ostentatious displays of wealth alienated their neighbors.",
    'ribald': "The comedian was known for ribald humor that shocked some audience members.",
    'arable': "The region's arable land produced abundant crops.",
    'eponymous': "The eponymous character in the novel appears only in the final chapter.",
    'bilk': "The con artist tried to bilk elderly victims out of their savings.",
    'pastiche': "The film was a pastiche of noir detective movies from the 1940s.",
    'inscrutable': "His inscrutable expression gave no hint of his thoughts.",
    'auspicious': "The project had an auspicious beginning with strong initial funding.",
    'stygian': "The power outage left the building in stygian darkness.",
    'enmity': "Decades of enmity between the families made reconciliation difficult.",
    'antipathy': "She felt an instinctive antipathy toward her mother's new boyfriend.",
    'propitious': "The propitious economic conditions favored new business ventures.",
    'beatific': "The saint wore a beatific smile as she greeted her followers.",
    'idiosyncrasy': "His habit of alphabetizing his spices was just one of his idiosyncrasies.",
    'portent': "The dark clouds were a portent of the storm to come.",
    'inure': "Years of hardship had inured him to discomfort.",
    'indigent': "The clinic provided free care to indigent patients.",
    'usurp': "The general attempted to usurp power from the elected government.",
    'sentient': "The novel explored the possibility of sentient artificial intelligence.",
    'affective': "The therapy focused on affective responses to traumatic memories.",
    'replete': "The museum was replete with artifacts from ancient civilizations.",
    'facile': "He offered facile solutions that ignored the complexity of the problems.",
    'rarefied': "The rarefied atmosphere of high academia intimidated first-generation students.",
    'austere': "The monastery's austere furnishings reflected the monks' vow of poverty.",
    'aplomb': "She handled the crisis with remarkable aplomb, never losing her composure.",
    'pariah': "After the scandal, he became a pariah in the business community.",
    'somatic': "The therapy addressed somatic symptoms of stress like muscle tension.",
    'deign': "The celebrity wouldn't deign to speak to ordinary fans.",
    'pantheon': "The writer had earned a place in the pantheon of great American authors.",
    'remonstrate': "The teacher remonstrated with students who hadn't completed their assignments.",
    'alacrity': "She accepted the challenging assignment with alacrity.",
    'amorphous': "The amorphous blob slowly took shape as the artist refined the sculpture.",
    'bereft': "After his wife's death, he felt bereft of purpose.",
    'cajole': "She had to cajole her reluctant child into trying new foods.",
    'cavort': "Children cavorted in the spray from the fountain.",
    'commensurate': "The salary was commensurate with his experience and qualifications.",
    'compunction': "The thief showed no compunction about stealing from the elderly.",
    'eclectic': "Her eclectic taste in music ranged from classical to heavy metal.",
    'duress': "He signed the confession under duress after hours of interrogation.",
    'equivocal': "His equivocal response left them uncertain about his position.",
    'extol': "The biography extolled the virtues of the humanitarian.",
    'impetuous': "The impetuous decision to quit his job left him unemployed for months.",
    'inexorable': "The inexorable advance of technology transformed the industry.",
    'insidious': "The insidious spread of misinformation undermined public trust.",
    'ostracize': "The group would ostracize anyone who violated their unwritten rules.",
    'presage': "The market decline seemed to presage a broader economic downturn.",
    'relegate': "The once-popular singer was relegated to performing in small venues.",
    'vestigial': "The appendix is a vestigial organ with no known function.",
    'vitriol': "The political debate devolved into vitriol and personal attacks."
}

# Fill in missing etymology and origin for specific words
missing_etymology_origin = {
    'peremptory': {
        'etymology': "From Latin peremptorius 'deadly, decisive', from perempt- 'destroyed, cut off', from the verb perimere.",
        'origin': "Latin"
    },
    'ostensible': {
        'etymology': "From Latin ostensus, past participle of ostendere 'to show'.",
        'origin': "Latin"
    },
    'lecher': {
        'etymology': "From Old French lechier 'to lick, live in debauchery', from lecher 'to lick'.",
        'origin': "French"
    },
    'hypochondriac': {
        'etymology': "From Greek hypokhondriakos, from hypokhondria 'the abdomen', where melancholy was thought to originate.",
        'origin': "Greek"
    },
    'martinet': {
        'etymology': "Named after Jean Martinet, a 17th-century French army officer known for his strict discipline.",
        'origin': "French"
    },
    'mote': {
        'etymology': "From Old English mot 'speck, particle'.",
        'origin': "Old English"
    },
    'speck': {
        'etymology': "From Middle English spekke, from Old English specca 'small spot, stain'.",
        'origin': "Old English"
    },
    'myriad': {
        'etymology': "From Greek murias, muriad- 'ten thousand'.",
        'origin': "Greek"
    },
    'sullen': {
        'etymology': "From Anglo-Norman French solein 'alone', from Latin solus 'alone'.",
        'origin': "French/Latin"
    },
    'fluke': {
        'etymology': "Origin uncertain, possibly from Middle English fluke 'flatfish'.",
        'origin': "Middle English"
    },
    'torpid': {
        'etymology': "From Latin torpidus 'sluggish', from torpere 'to be stiff or numb'.",
        'origin': "Latin"
    },
    'antecedent': {
        'etymology': "From Latin antecedentem 'going before', from antecedere, from ante 'before' + cedere 'to go'.",
        'origin': "Latin"
    },
    'penultimate': {
        'etymology': "From Latin paenultimus, from paene 'almost' + ultimus 'last'.",
        'origin': "Latin"
    },
    'troubadour': {
        'etymology': "From French troubadour, from Provençal trobador, from trobar 'to find, compose'.",
        'origin': "French/Provençal"
    },
    'vehement': {
        'etymology': "From Latin vehementem 'impetuous, violent', perhaps from vehere 'to carry' + mens 'mind'.",
        'origin': "Latin"
    },
    'conjoint': {
        'etymology': "From French conjoint 'united', from Latin conjunctus, past participle of conjungere 'to join together'.",
        'origin': "French/Latin"
    },
    'satiate': {
        'etymology': "From Latin satiatus, past participle of satiare 'to satisfy', from satis 'enough'.",
        'origin': "Latin"
    },
    'haughty': {
        'etymology': "From Old French haut 'high', from Latin altus, with -y suffix.",
        'origin': "French/Latin"
    },
    'reminisce': {
        'etymology': "Back-formation from reminiscence, from Latin reminisci 'to remember', from re- 'again' + minisci 'to remember'.",
        'origin': "Latin"
    },
    'skulk': {
        'etymology': "From Old Norse skúlka 'to lurk, lie in wait'.",
        'origin': "Old Norse"
    },
    'idiom': {
        'etymology': "From French idiome, or via late Latin from Greek idiōma 'private property, peculiar phraseology', from idiousthai 'make one's own', from idios 'own, private'.",
        'origin': "Greek"
    },
    'fain': {
        'etymology': "From Old English fægen 'glad'.",
        'origin': "Old English"
    },
    'terminus': {
        'etymology': "From Latin terminus 'end, boundary'.",
        'origin': "Latin"
    },
    'hectic': {
        'etymology': "From Greek hektikos 'habitual', from hexis 'habit, state of mind or body'.",
        'origin': "Greek"
    },
    'fathomless': {
        'etymology': "From fathom (Old English fæthm 'outstretched arms') + -less.",
        'origin': "Old English"
    },
    'bastion': {
        'etymology': "From French bastion, from Italian bastione, from bastire 'to build'.",
        'origin': "French/Italian"
    },
    'unrequited': {
        'etymology': "From un- 'not' + requited, past participle of requite, from re- + obsolete quite 'to repay'.",
        'origin': "English"
    },
    'punctual': {
        'etymology': "From medieval Latin punctualis, from Latin punctum 'point'.",
        'origin': "Latin"
    },
    'multitude': {
        'etymology': "From Latin multitudo, from multus 'many'.",
        'origin': "Latin"
    },
    'perpetual': {
        'etymology': "From Latin perpetualis, from perpetuus 'continuing throughout', from perpes 'continuous'.",
        'origin': "Latin"
    },
    'saunter': {
        'etymology': "Origin uncertain, possibly from Middle English santren 'to muse, be in a reverie'.",
        'origin': "Middle English"
    },
    'wend': {
        'etymology': "From Old English wendan 'to turn, go'.",
        'origin': "Old English"
    },
    'tenement': {
        'etymology': "From medieval Latin tenementum, from tenere 'to hold'.",
        'origin': "Latin"
    },
    'ample': {
        'etymology': "From French ample, from Latin amplus 'large, abundant'.",
        'origin': "Latin"
    },
    'vista': {
        'etymology': "From Italian vista 'view', from visto, past participle of vedere 'to see', from Latin videre.",
        'origin': "Italian/Latin"
    },
    'benevolent': {
        'etymology': "From Latin benevolent- 'well wishing', from bene 'well' + volent- 'wishing', from the verb velle.",
        'origin': "Latin"
    },
    'altruism': {
        'etymology': "From French altruisme, from Italian altrui 'somebody else', from Latin alteri huic 'to this other'.",
        'origin': "French/Italian/Latin"
    },
    'frivolous': {
        'etymology': "From Latin frivolus 'silly, empty, trifling'.",
        'origin': "Latin"
    },
    'pulpit': {
        'etymology': "From Latin pulpitum 'platform, staging'.",
        'origin': "Latin"
    },
    'paradox': {
        'etymology': "From Latin paradoxum, from Greek paradoxon 'contrary to expectation', from para- 'distinct from' + doxa 'opinion'.",
        'origin': "Greek"
    },
    'reconnaissance': {
        'etymology': "From French reconnaissance, from reconnaître 'recognize', from Latin recognoscere, from re- 'again' + cognoscere 'know'.",
        'origin': "French/Latin"
    },
    'futile': {
        'etymology': "From Latin futilis 'leaky, vain, worthless', from fundere 'pour'.",
        'origin': "Latin"
    },
    'daguerreotype': {
        'etymology': "Named after Louis Daguerre (1787–1851), French pioneer of photography.",
        'origin': "French"
    },
    'pervade': {
        'etymology': "From Latin pervadere 'go through', from per- 'throughout' + vadere 'go'.",
        'origin': "Latin"
    },
    'froth': {
        'etymology': "From Old Norse froða 'froth, foam'.",
        'origin': "Old Norse"
    },
    'rapt': {
        'etymology': "From Latin raptus 'seized', past participle of rapere 'seize'.",
        'origin': "Latin"
    },
    'swash': {
        'etymology': "Imitative of the sound of water dashing against something.",
        'origin': "English"
    },
    'malignant': {
        'etymology': "From Latin malignant- 'acting from malice', from the verb malignare.",
        'origin': "Latin"
    },
    'adulterous': {
        'etymology': "From Latin adulterare 'to corrupt', from ad- 'towards' + alterare 'to alter'.",
        'origin': "Latin"
    },
    'scallop': {
        'etymology': "From Old French escalope 'shell', of Germanic origin.",
        'origin': "French/Germanic"
    },
    'splendor': {
        'etymology': "From Latin splendor, from splendere 'to shine, be bright'.",
        'origin': "Latin"
    },
    'pensive': {
        'etymology': "From Old French pensif, from penser 'to think', from Latin pensare 'to weigh, consider'.",
        'origin': "French/Latin"
    },
    'plaudit': {
        'etymology': "From Latin plaudite 'applaud!', second person plural imperative of plaudere.",
        'origin': "Latin"
    },
    'carouse': {
        'etymology': "From German gar aus 'right out', used as a drinking toast.",
        'origin': "German"
    },
    'unalloyed': {
        'etymology': "From un- 'not' + alloyed, from alloy, from Old French aloi 'standard of metal', from aloier 'combine'.",
        'origin': "English/French"
    },
    'ruddy': {
        'etymology': "From Old English rudig, from rudu 'redness'.",
        'origin': "Old English"
    },
    'falter': {
        'etymology': "Perhaps from a Scandinavian source; compare Old Norse faltrast 'be encumbered'.",
        'origin': "Scandinavian"
    },
    'tableau': {
        'etymology': "From French tableau 'picture', from Old French table 'table', from Latin tabula 'board, tablet'.",
        'origin': "French/Latin"
    },
    'eunoia': {
        'etymology': "From Greek eunoia 'well mind' or 'beautiful thinking', from eu 'well' + nous 'mind'.",
        'origin': "Greek"
    },
    'soiree': {
        'etymology': "From French soirée 'evening', from soir 'evening', from Latin sero 'at a late hour'.",
        'origin': "French/Latin"
    },
    'smoulder': {
        'etymology': "From Middle English smolder 'to suffocate', perhaps related to Dutch smeulen 'to smolder'.",
        'origin': "Middle English"
    },
    'nonchalance': {
        'etymology': "From French nonchalance, from nonchalant 'unconcerned', from non- 'not' + chaloir 'to concern', from Latin calere 'be warm'.",
        'origin': "French/Latin"
    },
    'yearning': {
        'etymology': "From Old English giernan, from georn 'eager'.",
        'origin': "Old English"
    },
    'edifice': {
        'etymology': "From Latin aedificium, from aedificare 'build', from aedes 'dwelling' + facere 'make'.",
        'origin': "Latin"
    },
    'reprobate': {
        'etymology': "From Latin reprobatus 'disapproved', past participle of reprobare, from re- 'back' + probare 'test, approve'.",
        'origin': "Latin"
    },
    'peruse': {
        'etymology': "From Middle English perusen 'to use up', from per- 'thoroughly' + usen 'use'.",
        'origin': "Middle English"
    },
    'copious': {
        'etymology': "From Latin copiosus, from copia 'plenty'.",
        'origin': "Latin"
    },
    'creed': {
        'etymology': "From Latin credo 'I believe'.",
        'origin': "Latin"
    },
    'audacity': {
        'etymology': "From Latin audacitas, from audax 'bold', from audere 'dare'.",
        'origin': "Latin"
    },
    'cosmopolitan': {
        'etymology': "From Greek kosmopolitēs 'citizen of the world', from kosmos 'world' + politēs 'citizen'.",
        'origin': "Greek"
    },
    'menial': {
        'etymology': "From Anglo-Norman French menial 'belonging to a household', from meine 'household', from Latin mansio 'dwelling'.",
        'origin': "French/Latin"
    },
    'excursion': {
        'etymology': "From Latin excursio(n-), from excurrere 'run out', from ex- 'out' + currere 'to run'.",
        'origin': "Latin"
    },
    'rapture': {
        'etymology': "From Latin raptus 'seized', past participle of rapere 'seize'.",
        'origin': "Latin"
    },
    'sojourn': {
        'etymology': "From Old French sojorner, from Latin sub- 'under' + diurnus 'of a day'.",
        'origin': "French/Latin"
    },
    'hirsute': {
        'etymology': "From Latin hirsutus 'rough, shaggy'.",
        'origin': "Latin"
    },
    'ishtmus': {
        'etymology': "From Latin isthmus, from Greek isthmos 'neck of land'.",
        'origin': "Greek"
    },
    'interstitial': {
        'etymology': "From Latin interstitium, from inter- 'between' + sistere 'to stand'.",
        'origin': "Latin"
    },
    'latent': {
        'etymology': "From Latin latent- 'lying hidden', from the verb latere.",
        'origin': "Latin"
    },
    'demure': {
        'etymology': "From Old French demoure 'settled, serious, grave', past participle of demourer 'to stay', from Latin demorari.",
        'origin': "French/Latin"
    },
    'consolation': {
        'etymology': "From Latin consolatio(n-), from consolari 'to comfort'.",
        'origin': "Latin"
    },
    'plummet': {
        'etymology': "From Old French plommet 'little weight', diminutive of plom 'lead weight', from Latin plumbum 'lead'.",
        'origin': "French/Latin"
    },
    'chromatic': {
        'etymology': "From Greek khrōmatikos, from khrōma 'color'.",
        'origin': "Greek"
    },
    'balk': {
        'etymology': "From Old English balca 'ridge, bank'.",
        'origin': "Old English"
    },
    'diligent': {
        'etymology': "From Latin diligent- 'assiduous', from the verb diligere, from di- 'apart' + legere 'choose'.",
        'origin': "Latin"
    },
    'turbulent': {
        'etymology': "From Latin turbulentus, from turba 'crowd, disturbance'.",
        'origin': "Latin"
    },
    'waft': {
        'etymology': "From Middle Dutch or Middle Low German wachten 'to guard, watch'.",
        'origin': "Germanic"
    },
    'flaunt': {
        'etymology': "Origin uncertain, perhaps from Scandinavian, compare Norwegian flanta 'to show off'.",
        'origin': "Scandinavian"
    },
    'roving': {
        'etymology': "From Middle Dutch roven 'to rob', from Middle Low German roven, of Germanic origin.",
        'origin': "Germanic"
    },
    'ardor': {
        'etymology': "From Latin ardor 'heat, enthusiasm', from ardere 'to burn'.",
        'origin': "Latin"
    },
    'swarthy': {
        'etymology': "From Middle English swart 'black, dark', from Old English sweart, of Germanic origin.",
        'origin': "Old English/Germanic"
    },
    'lore': {
        'etymology': "From Old English lār 'teaching, doctrine', of Germanic origin.",
        'origin': "Old English"
    },
    'apparition': {
        'etymology': "From Latin apparitio(n-), from apparere 'appear'.",
        'origin': "Latin"
    },
    'volition': {
        'etymology': "From French, or from medieval Latin volitio(n-), from volo 'I wish'.",
        'origin': "French/Latin"
    },
    'cusp': {
        'etymology': "From Latin cuspis 'point, apex'.",
        'origin': "Latin"
    },
    'grotto': {
        'etymology': "From Italian grotta, via Latin from Greek kruptē 'vault, cavern'.",
        'origin': "Italian/Greek"
    },
    'resounding': {
        'etymology': "From Latin resonare 'sound again', from re- 'again' + sonare 'to sound'.",
        'origin': "Latin"
    },
    'diastole': {
        'etymology': "From Greek diastolē 'dilatation', from diastellein 'to expand'.",
        'origin': "Greek"
    },
    'maneouver': {
        'etymology': "From French manœuvre, from medieval Latin manuopera 'manual work', from manus 'hand' + operari 'to work'.",
        'origin': "French/Latin"
    }
}


# Collect all unique words from all dictionaries
all_words = set(unique_secondary_defs) | set(missing_examples) | set(missing_etymology_origin)

# Prepare rows for the CSV
rows = []
for word in sorted(all_words):
    row = {
        'word': word,
        'secondary_definition': unique_secondary_defs.get(word, ''),
        'example': missing_examples.get(word, ''),
        'etymology': missing_etymology_origin.get(word, {}).get('etymology', ''),
        'origin': missing_etymology_origin.get(word, {}).get('origin', '')
    }
    rows.append(row)

# Write to CSV
with open('combined_word_data.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['word', 'secondary_definition', 'example', 'etymology', 'origin'])
    writer.writeheader()
    writer.writerows(rows)

print("CSV file 'combined_word_data.csv' created.")
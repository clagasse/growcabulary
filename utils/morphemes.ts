import { Word } from '../types';

export interface WordMorphemePrefix {
  form: string;
  canonicalId: string;
  meaning: string;
}

export interface WordMorphemeRoot {
  form: string;
  canonicalId: string;
  displayRoot: string;
  meaning: string;
  origin: string;
  pieRoot?: string;
  pieGroupId?: string;
}

export interface WordMorphemeSuffix {
  form: string;
  meaning: string;
}

export interface WordMorphemeProfile {
  prefixes: WordMorphemePrefix[];
  roots: WordMorphemeRoot[];
  suffixes: WordMorphemeSuffix[];
}

export const WORD_MORPHEMES: Record<string, WordMorphemeProfile> = {
  "weltschmerz": {
    "prefixes": [],
    "roots": [
      {
        "form": "welt",
        "canonicalId": "welt",
        "displayRoot": "Welt / Bild",
        "meaning": "world, earthly realm",
        "origin": "German",
        "pieRoot": "*wi-ro- / *al-",
        "pieGroupId": "pie:wiro"
      },
      {
        "form": "schmerz",
        "canonicalId": "schmerz",
        "displayRoot": "Schmerz",
        "meaning": "pain, ache, grief",
        "origin": "German",
        "pieRoot": "*smerd-"
      }
    ],
    "suffixes": []
  },
  "antinomy": {
    "prefixes": [
      {
        "form": "anti-",
        "canonicalId": "prefix-anti",
        "meaning": "against, opposite"
      }
    ],
    "roots": [
      {
        "form": "nomy",
        "canonicalId": "nomos",
        "displayRoot": "nomos",
        "meaning": "law, custom, distribution",
        "origin": "Greek",
        "pieRoot": "*nem-"
      }
    ],
    "suffixes": []
  },
  "apodictic": {
    "prefixes": [
      {
        "form": "apo-",
        "canonicalId": "prefix-apo",
        "meaning": "away from, forth"
      }
    ],
    "roots": [
      {
        "form": "dict",
        "canonicalId": "deiknynai",
        "displayRoot": "deiknynai",
        "meaning": "to show, point out, prove",
        "origin": "Greek",
        "pieRoot": "*deyḱ-",
        "pieGroupId": "pie:deyk"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "ataraxia": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-a",
        "meaning": "without, not, lacking"
      }
    ],
    "roots": [
      {
        "form": "tarax",
        "canonicalId": "tarassein",
        "displayRoot": "tarassein",
        "meaning": "to trouble, disturb, agitate",
        "origin": "Ancient Greek",
        "pieRoot": "*dʰregʰ-"
      }
    ],
    "suffixes": [
      {
        "form": "-ia",
        "meaning": "state or condition (noun)"
      }
    ]
  },
  "epistemology": {
    "prefixes": [
      {
        "form": "epi-",
        "canonicalId": "prefix-epi",
        "meaning": "upon, over, beside"
      }
    ],
    "roots": [
      {
        "form": "steme",
        "canonicalId": "stasis",
        "displayRoot": "histanai / stasis",
        "meaning": "standing, to stand, understand",
        "origin": "Greek",
        "pieRoot": "*steh₂-",
        "pieGroupId": "pie:steh"
      },
      {
        "form": "logy",
        "canonicalId": "logos",
        "displayRoot": "-logia / legein / logos",
        "meaning": "word, speech, study",
        "origin": "Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": []
  },
  "incommensurability": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not"
      },
      {
        "form": "com-",
        "canonicalId": "prefix-com",
        "meaning": "with, together, completely"
      }
    ],
    "roots": [
      {
        "form": "mensur",
        "canonicalId": "mensura",
        "displayRoot": "metiri / mensura",
        "meaning": "to measure, limit, proportion",
        "origin": "Latin",
        "pieRoot": "*meh₁-",
        "pieGroupId": "pie:meh"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of being (adjective)"
      },
      {
        "form": "-ity",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "noumenon": {
    "prefixes": [],
    "roots": [
      {
        "form": "noumenon",
        "canonicalId": "nous",
        "displayRoot": "nous / noein",
        "meaning": "mind, intellect, thought",
        "origin": "Greek",
        "pieRoot": "*nes-",
        "pieGroupId": "pie:nes"
      }
    ],
    "suffixes": []
  },
  "ontology": {
    "prefixes": [],
    "roots": [
      {
        "form": "ont",
        "canonicalId": "genesis",
        "displayRoot": "ōn / ontos (einai)",
        "meaning": "being, existence",
        "origin": "Greek",
        "pieRoot": "*h₁es-",
        "pieGroupId": "pie:hes"
      },
      {
        "form": "logy",
        "canonicalId": "logos",
        "displayRoot": "-logia / legein / logos",
        "meaning": "word, speech, study",
        "origin": "Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": []
  },
  "phenomenology": {
    "prefixes": [],
    "roots": [
      {
        "form": "phenomen",
        "canonicalId": "phainein",
        "displayRoot": "phainein / phan-",
        "meaning": "to show, appear, bring to light",
        "origin": "Greek",
        "pieRoot": "*bheh₂-",
        "pieGroupId": "pie:bheh"
      },
      {
        "form": "logy",
        "canonicalId": "logos",
        "displayRoot": "-logia / legein / logos",
        "meaning": "word, speech, study",
        "origin": "Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": []
  },
  "quiddity": {
    "prefixes": [],
    "roots": [
      {
        "form": "quid",
        "canonicalId": "quis",
        "displayRoot": "quis",
        "meaning": "who, what",
        "origin": "Latin",
        "pieRoot": "*kʷis"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "teleology": {
    "prefixes": [],
    "roots": [
      {
        "form": "teleo",
        "canonicalId": "telos",
        "displayRoot": "telos",
        "meaning": "end, goal, fulfillment",
        "origin": "Greek",
        "pieRoot": "*kʷel-",
        "pieGroupId": "pie:kwel"
      },
      {
        "form": "logy",
        "canonicalId": "logos",
        "displayRoot": "-logia / legein / logos",
        "meaning": "word, speech, study",
        "origin": "Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": []
  },
  "weltanschauung": {
    "prefixes": [],
    "roots": [
      {
        "form": "welt",
        "canonicalId": "welt",
        "displayRoot": "Welt / Bild",
        "meaning": "world, earthly realm",
        "origin": "German",
        "pieRoot": "*wi-ro- / *al-",
        "pieGroupId": "pie:wiro"
      },
      {
        "form": "schau",
        "canonicalId": "schauen",
        "displayRoot": "schauen",
        "meaning": "to look at, behold, view",
        "origin": "German",
        "pieRoot": "*kewh₁-",
        "pieGroupId": "pie:kewh"
      }
    ],
    "suffixes": [
      {
        "form": "-ung",
        "meaning": "process, result, or state (noun)"
      }
    ]
  },
  "allelopathy": {
    "prefixes": [],
    "roots": [
      {
        "form": "allelo",
        "canonicalId": "allos",
        "displayRoot": "allos / allēlōn",
        "meaning": "other, mutual, reciprocal",
        "origin": "Greek",
        "pieRoot": "*h₂el-",
        "pieGroupId": "pie:al-other"
      },
      {
        "form": "pathy",
        "canonicalId": "pathos",
        "displayRoot": "pathos / paskhein",
        "meaning": "feeling, suffering, passion",
        "origin": "Greek",
        "pieRoot": "*kʷendh-",
        "pieGroupId": "pie:kwendh"
      }
    ],
    "suffixes": []
  },
  "iteroparity": {
    "prefixes": [],
    "roots": [
      {
        "form": "itero",
        "canonicalId": "iterum",
        "displayRoot": "iterum",
        "meaning": "again, a second time",
        "origin": "Latin",
        "pieRoot": "*i-"
      },
      {
        "form": "par",
        "canonicalId": "parere",
        "displayRoot": "parere",
        "meaning": "to bring forth, give birth, produce",
        "origin": "Latin",
        "pieRoot": "*perh₃-",
        "pieGroupId": "pie:perh"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or condition (noun)"
      }
    ]
  },
  "neoteny": {
    "prefixes": [],
    "roots": [
      {
        "form": "neo",
        "canonicalId": "neos",
        "displayRoot": "neos",
        "meaning": "new, young, fresh",
        "origin": "Greek",
        "pieRoot": "*newo-",
        "pieGroupId": "pie:newo"
      },
      {
        "form": "teny",
        "canonicalId": "teinein",
        "displayRoot": "teinein",
        "meaning": "to stretch, extend",
        "origin": "Ancient Greek",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": []
  },
  "phenology": {
    "prefixes": [],
    "roots": [
      {
        "form": "pheno",
        "canonicalId": "phainein",
        "displayRoot": "phainein / phan-",
        "meaning": "to show, appear, bring to light",
        "origin": "Greek",
        "pieRoot": "*bheh₂-",
        "pieGroupId": "pie:bheh"
      },
      {
        "form": "logy",
        "canonicalId": "logos",
        "displayRoot": "-logia / legein / logos",
        "meaning": "word, speech, study",
        "origin": "Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": []
  },
  "corbel": {
    "prefixes": [],
    "roots": [
      {
        "form": "corb",
        "canonicalId": "corvus",
        "displayRoot": "corvus / corp",
        "meaning": "raven, crow",
        "origin": "Old French",
        "pieRoot": "*ḱor-"
      }
    ],
    "suffixes": [
      {
        "form": "-el",
        "meaning": "diminutive suffix (noun)"
      }
    ]
  },
  "enfilade": {
    "prefixes": [
      {
        "form": "en-",
        "canonicalId": "prefix-in",
        "meaning": "in, into, upon"
      }
    ],
    "roots": [
      {
        "form": "fil",
        "canonicalId": "filum",
        "displayRoot": "filum / fil",
        "meaning": "thread, string, row",
        "origin": "French",
        "pieRoot": "*gʷhi-lo-"
      }
    ],
    "suffixes": [
      {
        "form": "-ade",
        "meaning": "action, process, or series (noun)"
      }
    ]
  },
  "finial": {
    "prefixes": [],
    "roots": [
      {
        "form": "fini",
        "canonicalId": "finis",
        "displayRoot": "finis",
        "meaning": "end, boundary, limit, top",
        "origin": "Latin",
        "pieRoot": "*dʰh₁-n-"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "pertaining to or object of (noun/adjective)"
      }
    ]
  },
  "plenipotentiary": {
    "prefixes": [],
    "roots": [
      {
        "form": "pleni",
        "canonicalId": "plenus",
        "displayRoot": "plenus / plere",
        "meaning": "full, to fill",
        "origin": "Latin",
        "pieRoot": "*pleh₁-",
        "pieGroupId": "pie:pleh"
      },
      {
        "form": "potenti",
        "canonicalId": "potens",
        "displayRoot": "posse / potens",
        "meaning": "to be able, powerful, power",
        "origin": "Latin",
        "pieRoot": "*poti-"
      }
    ],
    "suffixes": [
      {
        "form": "-ary",
        "meaning": "person relating to or characterized by (noun)"
      }
    ]
  },
  "interregnum": {
    "prefixes": [
      {
        "form": "inter-",
        "canonicalId": "prefix-inter",
        "meaning": "between, among"
      }
    ],
    "roots": [
      {
        "form": "regnum",
        "canonicalId": "regere",
        "displayRoot": "regere / rect-",
        "meaning": "to rule, guide straight, realm, kingship",
        "origin": "Latin",
        "pieRoot": "*reǵ-",
        "pieGroupId": "pie:reg"
      }
    ],
    "suffixes": []
  },
  "bathos": {
    "prefixes": [],
    "roots": [
      {
        "form": "bathos",
        "canonicalId": "bathys",
        "displayRoot": "bathos / bathys",
        "meaning": "depth, deep",
        "origin": "Greek",
        "pieRoot": "*gʷādh-"
      }
    ],
    "suffixes": []
  },
  "metonymy": {
    "prefixes": [
      {
        "form": "meta-",
        "canonicalId": "prefix-meta",
        "meaning": "change, transfer, beyond"
      }
    ],
    "roots": [
      {
        "form": "onym",
        "canonicalId": "onyma",
        "displayRoot": "onoma / onyma",
        "meaning": "name, title",
        "origin": "Greek",
        "pieRoot": "*h₁nómn̥",
        "pieGroupId": "pie:hnomn"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state, quality, or process (noun)"
      }
    ]
  },
  "synecdoche": {
    "prefixes": [
      {
        "form": "syn-",
        "canonicalId": "prefix-syn",
        "meaning": "together, with"
      },
      {
        "form": "ek-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth, from"
      }
    ],
    "roots": [
      {
        "form": "doche",
        "canonicalId": "dechesthai",
        "displayRoot": "dekhesthai / dokhē",
        "meaning": "to receive, take up, accept",
        "origin": "Greek",
        "pieRoot": "*deḱ-",
        "pieGroupId": "pie:dek"
      }
    ],
    "suffixes": []
  },
  "chiasmus": {
    "prefixes": [],
    "roots": [
      {
        "form": "chiasm",
        "canonicalId": "chi",
        "displayRoot": "khiazein / khi",
        "meaning": "diagonal arrangement, mark with an X (letter Chi)",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-us",
        "meaning": "noun suffix"
      }
    ]
  },
  "ekphrasis": {
    "prefixes": [
      {
        "form": "ek-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth"
      }
    ],
    "roots": [
      {
        "form": "phrasis",
        "canonicalId": "phrazein",
        "displayRoot": "phrazein / phrasis",
        "meaning": "to point out, speak, declare",
        "origin": "Greek",
        "pieRoot": "*gwhren-"
      }
    ],
    "suffixes": []
  },
  "abstemious": {
    "prefixes": [
      {
        "form": "abs-",
        "canonicalId": "prefix-ab",
        "meaning": "away, from, off"
      }
    ],
    "roots": [
      {
        "form": "temi",
        "canonicalId": "temetum",
        "displayRoot": "temetum",
        "meaning": "intoxicating drink, mead, wine",
        "origin": "Latin",
        "pieRoot": "*temH-",
        "pieGroupId": "pie:temh"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "having the quality of, full of"
      }
    ]
  },
  "adumbrate": {
    "prefixes": [
      {
        "form": "ad-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward"
      }
    ],
    "roots": [
      {
        "form": "umbr",
        "canonicalId": "umbra",
        "displayRoot": "umbra",
        "meaning": "shadow, shade",
        "origin": "Latin",
        "pieRoot": "*andho-",
        "pieGroupId": "pie:andho"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause to be (verb suffix)"
      }
    ]
  },
  "adventitious": {
    "prefixes": [
      {
        "form": "ad-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward"
      }
    ],
    "roots": [
      {
        "form": "vent",
        "canonicalId": "venire",
        "displayRoot": "venire / vent-",
        "meaning": "to come, arrive",
        "origin": "Latin",
        "pieRoot": "*gwa-"
      }
    ],
    "suffixes": [
      {
        "form": "-iti-",
        "meaning": "participial / connection formative"
      },
      {
        "form": "-ous",
        "meaning": "characterized by, nature of"
      }
    ]
  },
  "antediluvian": {
    "prefixes": [
      {
        "form": "ante-",
        "canonicalId": "prefix-ante",
        "meaning": "before"
      },
      {
        "form": "di-",
        "canonicalId": "prefix-dis",
        "meaning": "away, apart"
      }
    ],
    "roots": [
      {
        "form": "luvi",
        "canonicalId": "lavere",
        "displayRoot": "lavere / luere",
        "meaning": "to wash, cleanse",
        "origin": "Latin",
        "pieRoot": "*lewh-"
      }
    ],
    "suffixes": [
      {
        "form": "-an",
        "meaning": "pertaining to, of the time of"
      }
    ]
  },
  "aporia": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-a",
        "meaning": "without, not, lacking"
      }
    ],
    "roots": [
      {
        "form": "por",
        "canonicalId": "poros",
        "displayRoot": "poros",
        "meaning": "passage, path, way through",
        "origin": "Greek",
        "pieRoot": "*per-",
        "pieGroupId": "pie:per"
      }
    ],
    "suffixes": [
      {
        "form": "-ia",
        "meaning": "state, condition, quality"
      }
    ]
  },
  "apostate": {
    "prefixes": [
      {
        "form": "apo-",
        "canonicalId": "prefix-apo",
        "meaning": "away from, forth"
      }
    ],
    "roots": [
      {
        "form": "stat",
        "canonicalId": "stasis",
        "displayRoot": "stasis / histanai",
        "meaning": "standing, state, to stand",
        "origin": "Greek",
        "pieRoot": "*steh-",
        "pieGroupId": "pie:steh"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "one who does or undergoes"
      }
    ]
  },
  "argot": {
    "prefixes": [],
    "roots": [
      {
        "form": "argot",
        "canonicalId": "argot",
        "displayRoot": "argot",
        "meaning": "slang, jargon, beggars' cant",
        "origin": "French"
      }
    ],
    "suffixes": []
  },
  "asperity": {
    "prefixes": [],
    "roots": [
      {
        "form": "asper",
        "canonicalId": "asper",
        "displayRoot": "asper",
        "meaning": "rough, harsh",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state, quality, or condition of"
      }
    ]
  },
  "atavistic": {
    "prefixes": [],
    "roots": [
      {
        "form": "atav",
        "canonicalId": "atavus",
        "displayRoot": "atavus (at- + avus)",
        "meaning": "ancestor, forefather",
        "origin": "Latin",
        "pieRoot": "*awo-",
        "pieGroupId": "pie:awo"
      }
    ],
    "suffixes": [
      {
        "form": "-ist",
        "meaning": "one who adheres to or practices"
      },
      {
        "form": "-ic",
        "meaning": "pertaining to, of the nature of"
      }
    ]
  },
  "beatitude": {
    "prefixes": [],
    "roots": [
      {
        "form": "beat",
        "canonicalId": "beatus",
        "displayRoot": "beatus",
        "meaning": "blessed, supremely happy",
        "origin": "Latin",
        "pieRoot": "*dweye-"
      }
    ],
    "suffixes": [
      {
        "form": "-i-",
        "meaning": "connecting vowel"
      },
      {
        "form": "-tude",
        "meaning": "state, quality, condition (noun suffix)"
      }
    ]
  },
  "bilious": {
    "prefixes": [],
    "roots": [
      {
        "form": "bili",
        "canonicalId": "bilis",
        "displayRoot": "bilis",
        "meaning": "bile, gall",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, having the quality of"
      }
    ]
  },
  "blandishment": {
    "prefixes": [],
    "roots": [
      {
        "form": "bland",
        "canonicalId": "blandus",
        "displayRoot": "blandus",
        "meaning": "smooth, flattering, charming",
        "origin": "Latin",
        "pieRoot": "*mlad-"
      }
    ],
    "suffixes": [
      {
        "form": "-ish",
        "meaning": "to do, make (verbal suffix)"
      },
      {
        "form": "-ment",
        "meaning": "action, process, or result of"
      }
    ]
  },
  "byzantine": {
    "prefixes": [],
    "roots": [
      {
        "form": "byzant",
        "canonicalId": "byzantium",
        "displayRoot": "Byzantion / Byzantium",
        "meaning": "ancient Greek city of Byzantium",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ine",
        "meaning": "pertaining to, resembling"
      }
    ]
  },
  "calumny": {
    "prefixes": [],
    "roots": [
      {
        "form": "calumn",
        "canonicalId": "calumnia",
        "displayRoot": "calumnia / calvi",
        "meaning": "trickery, false accusation, deceit",
        "origin": "Latin",
        "pieRoot": "*kel-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state, quality, condition"
      }
    ]
  },
  "canard": {
    "prefixes": [],
    "roots": [
      {
        "form": "canard",
        "canonicalId": "canard",
        "displayRoot": "canard / caner",
        "meaning": "duck; to quack, chatter",
        "origin": "French",
        "pieRoot": "*kan-"
      }
    ],
    "suffixes": []
  },
  "celerity": {
    "prefixes": [],
    "roots": [
      {
        "form": "celer",
        "canonicalId": "celer",
        "displayRoot": "celer",
        "meaning": "swift, quick, fast",
        "origin": "Latin",
        "pieRoot": "*kel-"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state, condition, quality of"
      }
    ]
  },
  "chimerical": {
    "prefixes": [],
    "roots": [
      {
        "form": "chimer",
        "canonicalId": "khimaira",
        "displayRoot": "khimaira (Chimera)",
        "meaning": "she-goat, mythical fire-breathing monster",
        "origin": "Greek",
        "pieRoot": "*ghey-m-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to"
      },
      {
        "form": "-al",
        "meaning": "relating to, resembling"
      }
    ]
  },
  "cogitate": {
    "prefixes": [
      {
        "form": "co-",
        "canonicalId": "prefix-com",
        "meaning": "together, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "git",
        "canonicalId": "agere",
        "displayRoot": "agere / act-",
        "meaning": "to drive, set in motion, act (agitare: shake, agitate)",
        "origin": "Latin",
        "pieRoot": "*ag-",
        "pieGroupId": "pie:ag"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, perform, do"
      }
    ]
  },
  "colloquy": {
    "prefixes": [
      {
        "form": "col-",
        "canonicalId": "prefix-com",
        "meaning": "together, with"
      }
    ],
    "roots": [
      {
        "form": "loqu",
        "canonicalId": "loqui",
        "displayRoot": "loqui / locut-",
        "meaning": "to speak, talk, utter",
        "origin": "Latin",
        "pieRoot": "*tolkʷ-",
        "pieGroupId": "pie:tolkw"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "act, state, result"
      }
    ]
  },
  "comity": {
    "prefixes": [],
    "roots": [
      {
        "form": "com",
        "canonicalId": "comis",
        "displayRoot": "comis",
        "meaning": "courteous, friendly, polite",
        "origin": "Latin",
        "pieRoot": "*koy-mo-"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state, quality, condition of"
      }
    ]
  },
  "consanguinity": {
    "prefixes": [
      {
        "form": "con-",
        "canonicalId": "prefix-com",
        "meaning": "together, with"
      }
    ],
    "roots": [
      {
        "form": "sanguin",
        "canonicalId": "sanguis",
        "displayRoot": "sanguis / sanguin-",
        "meaning": "blood, kinship, vitality",
        "origin": "Latin",
        "pieRoot": "*eshr-",
        "pieGroupId": "pie:eshr"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state, quality, relationship"
      }
    ]
  },
  "daguerreotype": {
    "prefixes": [],
    "roots": [
      {
        "form": "daguerre",
        "canonicalId": "daguerre",
        "displayRoot": "Daguerre",
        "meaning": "Louis Daguerre (proper name)",
        "origin": "French"
      },
      {
        "form": "type",
        "canonicalId": "typos",
        "displayRoot": "typos",
        "meaning": "stamp, impression, model",
        "origin": "Greek",
        "pieRoot": "*(s)tewp-",
        "pieGroupId": "pie:stewp"
      }
    ],
    "suffixes": [
      {
        "form": "-o-",
        "meaning": "connecting vowel"
      }
    ]
  },
  "defenestration": {
    "prefixes": [
      {
        "form": "de-",
        "canonicalId": "prefix-de",
        "meaning": "down from, away"
      }
    ],
    "roots": [
      {
        "form": "fenestr",
        "canonicalId": "fenestra",
        "displayRoot": "fenestra",
        "meaning": "window, opening",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "action, state, or process of"
      }
    ]
  },
  "demotic": {
    "prefixes": [],
    "roots": [
      {
        "form": "demot",
        "canonicalId": "demos",
        "displayRoot": "dēmos",
        "meaning": "people, citizenry, district",
        "origin": "Greek",
        "pieRoot": "*da-mo-",
        "pieGroupId": "pie:damo"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, of the nature of"
      }
    ]
  },
  "dissemble": {
    "prefixes": [
      {
        "form": "dis-",
        "canonicalId": "prefix-dis",
        "meaning": "apart, away, reversal"
      }
    ],
    "roots": [
      {
        "form": "semble",
        "canonicalId": "similis",
        "displayRoot": "similis / simulare",
        "meaning": "like, similar, resembling",
        "origin": "Latin",
        "pieRoot": "*sem-",
        "pieGroupId": "pie:sem"
      }
    ],
    "suffixes": []
  },
  "doggerel": {
    "prefixes": [],
    "roots": [
      {
        "form": "dogger",
        "canonicalId": "dog",
        "displayRoot": "dogge / dog",
        "meaning": "dog, base, mean",
        "origin": "Middle English"
      }
    ],
    "suffixes": [
      {
        "form": "-el",
        "meaning": "diminutive or depreciative suffix"
      }
    ]
  },
  "efface": {
    "prefixes": [
      {
        "form": "ef-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, away, completely"
      }
    ],
    "roots": [
      {
        "form": "face",
        "canonicalId": "facies",
        "displayRoot": "facies",
        "meaning": "face, appearance, external form",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": []
  },
  "effluvium": {
    "prefixes": [
      {
        "form": "ef-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth"
      }
    ],
    "roots": [
      {
        "form": "fluv",
        "canonicalId": "fluere",
        "displayRoot": "fluere / flux-",
        "meaning": "to flow, stream",
        "origin": "Latin",
        "pieRoot": "*bhlew-"
      }
    ],
    "suffixes": [
      {
        "form": "-ium",
        "meaning": "thing, substance, or product (noun suffix)"
      }
    ]
  },
  "effrontery": {
    "prefixes": [
      {
        "form": "ef-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, without, forth"
      }
    ],
    "roots": [
      {
        "form": "front",
        "canonicalId": "frons",
        "displayRoot": "frons / front-",
        "meaning": "forehead, brow, front",
        "origin": "Latin",
        "pieRoot": "*bhr-on-to-"
      }
    ],
    "suffixes": [
      {
        "form": "-ery",
        "meaning": "state, condition, quality of behavior"
      }
    ]
  },
  "etiolated": {
    "prefixes": [
      {
        "form": "é-",
        "canonicalId": "prefix-ex",
        "meaning": "out, forth"
      }
    ],
    "roots": [
      {
        "form": "tiol",
        "canonicalId": "stipula",
        "displayRoot": "stipula",
        "meaning": "stalk, straw",
        "origin": "Latin",
        "pieRoot": "*steyp-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "cause to become (verb suffix)"
      },
      {
        "form": "-ed",
        "meaning": "past participle or adjective formant"
      }
    ]
  },
  "eunoia": {
    "prefixes": [
      {
        "form": "eu-",
        "canonicalId": "prefix-eu",
        "meaning": "good, well"
      }
    ],
    "roots": [
      {
        "form": "no",
        "canonicalId": "nous",
        "displayRoot": "nous / noein",
        "meaning": "mind, intellect, thought",
        "origin": "Greek",
        "pieRoot": "*gno-",
        "pieGroupId": "pie:gno"
      }
    ],
    "suffixes": [
      {
        "form": "-ia",
        "meaning": "state or condition (noun suffix)"
      }
    ]
  },
  "execrable": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "ecr",
        "canonicalId": "sacer",
        "displayRoot": "sacer / sacrare / sanctus",
        "meaning": "sacred, holy, consecrated; devoted to destruction",
        "origin": "Latin",
        "pieRoot": "*sak-"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of, worthy of being (adjective)"
      }
    ]
  },
  "exigent": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out, forth"
      }
    ],
    "roots": [
      {
        "form": "ig",
        "canonicalId": "agere",
        "displayRoot": "agere / act-",
        "meaning": "to drive, set in motion, act",
        "origin": "Latin",
        "pieRoot": "*ag-",
        "pieGroupId": "pie:ag"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "performing an action, being in a state (adjective)"
      }
    ]
  },
  "expatiate": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out, forth"
      }
    ],
    "roots": [
      {
        "form": "pati",
        "canonicalId": "spatium",
        "displayRoot": "spatium",
        "meaning": "space, room, distance",
        "origin": "Latin",
        "pieRoot": "*speh₁-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to cause, make, do (verb suffix)"
      }
    ]
  },
  "factious": {
    "prefixes": [],
    "roots": [
      {
        "form": "fact",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "characterized by, given to (adjective)"
      }
    ]
  },
  "fulminate": {
    "prefixes": [],
    "roots": [
      {
        "form": "fulmin",
        "canonicalId": "fulmen",
        "displayRoot": "fulmen / fulgere",
        "meaning": "lightning bolt, to flash, strike with lightning",
        "origin": "Latin",
        "pieRoot": "*bhel-",
        "pieGroupId": "pie:bhel"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to act upon, perform (verb suffix)"
      }
    ]
  },
  "fulsome": {
    "prefixes": [],
    "roots": [
      {
        "form": "ful",
        "canonicalId": "full",
        "displayRoot": "full",
        "meaning": "full, abundant, complete",
        "origin": "Old English",
        "pieRoot": "*pele-"
      }
    ],
    "suffixes": [
      {
        "form": "-some",
        "meaning": "characterized by, tending to (adjective)"
      }
    ]
  },
  "grandiloquence": {
    "prefixes": [],
    "roots": [
      {
        "form": "grandi",
        "canonicalId": "grandis",
        "displayRoot": "grandis",
        "meaning": "great, grand, large",
        "origin": "Latin"
      },
      {
        "form": "loqu",
        "canonicalId": "loqui",
        "displayRoot": "loqui / locut-",
        "meaning": "to speak, talk, utter",
        "origin": "Latin",
        "pieRoot": "*tolkʷ-",
        "pieGroupId": "pie:tolkw"
      }
    ],
    "suffixes": [
      {
        "form": "-ence",
        "meaning": "quality or state of (noun suffix)"
      }
    ]
  },
  "gravid": {
    "prefixes": [],
    "roots": [
      {
        "form": "grav",
        "canonicalId": "gravis",
        "displayRoot": "gravis",
        "meaning": "heavy, weighty, serious",
        "origin": "Latin",
        "pieRoot": "*gʷerh₂-"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "having the state or condition of (adjective)"
      }
    ]
  },
  "harridan": {
    "prefixes": [],
    "roots": [
      {
        "form": "harridan",
        "canonicalId": "haridelle",
        "displayRoot": "haridelle",
        "meaning": "worn-out horse, jade, gaunt hag",
        "origin": "French"
      }
    ],
    "suffixes": []
  },
  "hirsute": {
    "prefixes": [],
    "roots": [
      {
        "form": "hirsut",
        "canonicalId": "hirsutus",
        "displayRoot": "hirsutus",
        "meaning": "rough, shaggy, bristly",
        "origin": "Latin",
        "pieRoot": "*ghers-"
      }
    ],
    "suffixes": []
  },
  "impecunious": {
    "prefixes": [
      {
        "form": "im-",
        "canonicalId": "prefix-in",
        "meaning": "not, lacking"
      }
    ],
    "roots": [
      {
        "form": "pecuni",
        "canonicalId": "pecus",
        "displayRoot": "pecus / pecunia",
        "meaning": "cattle, flock, money, wealth",
        "origin": "Latin",
        "pieRoot": "*peku-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, having the quality of (adjective)"
      }
    ]
  },
  "inchoate": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "in, upon (intensive)"
      }
    ],
    "roots": [
      {
        "form": "cho",
        "canonicalId": "incohare",
        "displayRoot": "incohare / inchoatus",
        "meaning": "to begin, commence, yoke",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "having the state of, characterized by (adjective)"
      }
    ]
  },
  "munificent": {
    "prefixes": [],
    "roots": [
      {
        "form": "muni",
        "canonicalId": "munus",
        "displayRoot": "munus",
        "meaning": "gift, service, duty",
        "origin": "Latin",
        "pieRoot": "*mey-"
      },
      {
        "form": "fic",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "performing, characterized by (adjective)"
      }
    ]
  },
  "obdurate": {
    "prefixes": [
      {
        "form": "ob-",
        "canonicalId": "prefix-ob",
        "meaning": "against, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "dur",
        "canonicalId": "durus",
        "displayRoot": "durus",
        "meaning": "hard, harsh, enduring",
        "origin": "Latin",
        "pieRoot": "*deru-",
        "pieGroupId": "pie:deru"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "possessing the quality of, hardened (adjective)"
      }
    ]
  },
  "obstreperous": {
    "prefixes": [
      {
        "form": "ob-",
        "canonicalId": "prefix-ob",
        "meaning": "against, toward"
      }
    ],
    "roots": [
      {
        "form": "streper",
        "canonicalId": "strepere",
        "displayRoot": "strepere",
        "meaning": "to make a noise, clatter, roar",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "characterized by, full of (adjective)"
      }
    ]
  },
  "orotund": {
    "prefixes": [],
    "roots": [
      {
        "form": "or",
        "canonicalId": "orare",
        "displayRoot": "os / oris / orare",
        "meaning": "mouth, speak, entreat, pray",
        "origin": "Latin",
        "pieRoot": "*os-"
      },
      {
        "form": "tund",
        "canonicalId": "rotundus",
        "displayRoot": "rota / rotundus",
        "meaning": "wheel, round",
        "origin": "Latin",
        "pieRoot": "*ret-"
      }
    ],
    "suffixes": []
  },
  "palimpsest": {
    "prefixes": [],
    "roots": [
      {
        "form": "palim",
        "canonicalId": "palin",
        "displayRoot": "palin",
        "meaning": "again, back",
        "origin": "Greek",
        "pieRoot": "*kʷel-",
        "pieGroupId": "pie:kwel"
      },
      {
        "form": "psest",
        "canonicalId": "pseen",
        "displayRoot": "psēn / psaein",
        "meaning": "to scrape, rub smooth",
        "origin": "Greek",
        "pieRoot": "*bhes-"
      }
    ],
    "suffixes": []
  },
  "parsimonious": {
    "prefixes": [],
    "roots": [
      {
        "form": "parsi",
        "canonicalId": "parcere",
        "displayRoot": "parcere / parsus",
        "meaning": "to spare, refrain, be frugal",
        "origin": "Latin",
        "pieRoot": "*sperk-"
      }
    ],
    "suffixes": [
      {
        "form": "-mony",
        "meaning": "action, condition, or result (abstract noun suffix -monia)"
      },
      {
        "form": "-ous",
        "meaning": "characterized by, full of (adjective)"
      }
    ]
  },
  "pellucid": {
    "prefixes": [
      {
        "form": "pel-",
        "canonicalId": "prefix-per",
        "meaning": "through, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "luc",
        "canonicalId": "lux",
        "displayRoot": "lux / lucere / lumen",
        "meaning": "light, shine, clarity",
        "origin": "Latin",
        "pieRoot": "*leuk-"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "having the quality or condition of (adjective)"
      }
    ]
  },
  "perambulate": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "through, across"
      }
    ],
    "roots": [
      {
        "form": "ambul",
        "canonicalId": "ambulare",
        "displayRoot": "ambulare",
        "meaning": "to walk, wander",
        "origin": "Latin",
        "pieRoot": "*al-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to perform, make, cause (verb suffix)"
      }
    ]
  },
  "perdition": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "completely, thoroughly, to destruction"
      }
    ],
    "roots": [
      {
        "form": "dit",
        "canonicalId": "dare",
        "displayRoot": "dare / dit-: to give, put",
        "meaning": "to give, hand over",
        "origin": "Latin",
        "pieRoot": "*deh₃-"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "state, condition, or result of an action (noun)"
      }
    ]
  },
  "peremptory": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "completely, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "empt",
        "canonicalId": "emere",
        "displayRoot": "emere / empt-: to take, buy, obtain",
        "meaning": "to take, take away",
        "origin": "Latin",
        "pieRoot": "*h₁em-"
      }
    ],
    "suffixes": [
      {
        "form": "-ory",
        "meaning": "relating to, serving to, producing (adjective)"
      }
    ]
  },
  "perspicacity": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "through, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "spic",
        "canonicalId": "specere",
        "displayRoot": "specere / spect-: to look at, observe, behold",
        "meaning": "to see, look, discern",
        "origin": "Latin",
        "pieRoot": "*speḱ-",
        "pieGroupId": "pie:spek"
      }
    ],
    "suffixes": [
      {
        "form": "-acity",
        "meaning": "tendency or quality of being inclined to (noun)"
      }
    ]
  },
  "phlegmatic": {
    "prefixes": [],
    "roots": [
      {
        "form": "phlegm",
        "canonicalId": "phlegein",
        "displayRoot": "phlegein / phlegma: to burn, heat; phlegm",
        "meaning": "phlegm, heat, inflammation",
        "origin": "Greek",
        "pieRoot": "*bʰleg-"
      }
    ],
    "suffixes": [
      {
        "form": "-atic",
        "meaning": "pertaining to or characterized by (adjective)"
      }
    ]
  },
  "potentate": {
    "prefixes": [],
    "roots": [
      {
        "form": "potent",
        "canonicalId": "potens",
        "displayRoot": "posse / potens: to be able, powerful, ruler",
        "meaning": "powerful, having power",
        "origin": "Latin",
        "pieRoot": "*póthis"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "one who possesses a specified office or rank (noun)"
      }
    ]
  },
  "promulgation": {
    "prefixes": [
      {
        "form": "pro-",
        "canonicalId": "prefix-pre",
        "meaning": "forth, forward, before the public"
      }
    ],
    "roots": [
      {
        "form": "mulg",
        "canonicalId": "vulgus",
        "displayRoot": "vulgus / vulgare: the common people, public",
        "meaning": "to make known among the people, publish",
        "origin": "Latin",
        "pieRoot": "*wolg-"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "act, process, or result of (noun)"
      }
    ]
  },
  "propitious": {
    "prefixes": [
      {
        "form": "pro-",
        "canonicalId": "prefix-pre",
        "meaning": "forward, forth, favorably inclined"
      }
    ],
    "roots": [
      {
        "form": "piti",
        "canonicalId": "petere",
        "displayRoot": "petere / petit-: to seek, aim at, rush toward",
        "meaning": "to fly toward, seek, incline toward",
        "origin": "Latin",
        "pieRoot": "*peth₂-",
        "pieGroupId": "pie:peth"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "characterized by, having the nature of (adjective)"
      }
    ]
  },
  "pulchritude": {
    "prefixes": [],
    "roots": [
      {
        "form": "pulchr",
        "canonicalId": "pulcher",
        "displayRoot": "pulcher: beautiful, fair",
        "meaning": "beautiful, fair",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-itude",
        "meaning": "state, quality, or degree of (noun)"
      }
    ]
  },
  "quiescent": {
    "prefixes": [],
    "roots": [
      {
        "form": "quiesc",
        "canonicalId": "quies",
        "displayRoot": "quies / quiescere: rest, quiet, calm, peace",
        "meaning": "to rest, become still",
        "origin": "Latin",
        "pieRoot": "*kʷyeh₁-",
        "pieGroupId": "pie:kwyeh"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "being in a state of, performing an action (adjective)"
      }
    ]
  },
  "recondite": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "back, away, again"
      }
    ],
    "roots": [
      {
        "form": "cond",
        "canonicalId": "condere",
        "displayRoot": "condere / condit-: to put together, store, conceal",
        "meaning": "to store away, hide, conceal",
        "origin": "Latin",
        "pieRoot": "*dʰeh₁-",
        "pieGroupId": "pie:dheh"
      }
    ],
    "suffixes": []
  },
  "remonstrate": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "back, against, again"
      }
    ],
    "roots": [
      {
        "form": "monstr",
        "canonicalId": "monere",
        "displayRoot": "monere / monstr-: to warn, remind, point out",
        "meaning": "to show, point out, demonstrate",
        "origin": "Latin",
        "pieRoot": "*men-",
        "pieGroupId": "pie:men-mind"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to act upon, cause, or make (verb)"
      }
    ]
  },
  "saturnine": {
    "prefixes": [],
    "roots": [
      {
        "form": "saturn",
        "canonicalId": "saturnus",
        "displayRoot": "Saturnus: Roman god of agriculture; planet Saturn",
        "meaning": "Saturn, gloomy planetary influence",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ine",
        "meaning": "pertaining to, resembling (adjective)"
      }
    ]
  },
  "simulacrum": {
    "prefixes": [],
    "roots": [
      {
        "form": "simul",
        "canonicalId": "similis",
        "displayRoot": "similis / simulare: like, similar, resembling",
        "meaning": "likeness, image, representation",
        "origin": "Latin",
        "pieRoot": "*sem-",
        "pieGroupId": "pie:sem"
      }
    ],
    "suffixes": [
      {
        "form": "-acrum",
        "meaning": "instrument or physical result of an action (noun suffix)"
      }
    ]
  },
  "solicitude": {
    "prefixes": [],
    "roots": [
      {
        "form": "sollicit",
        "canonicalId": "sollicitus",
        "displayRoot": "sollicitus: anxious, thoroughly disturbed",
        "meaning": "anxious, troubled, concerned",
        "origin": "Latin",
        "pieRoot": "*solh₂-",
        "pieGroupId": "pie:solh"
      }
    ],
    "suffixes": [
      {
        "form": "-ude",
        "meaning": "state, condition, or quality of (noun)"
      }
    ]
  },
  "stygian": {
    "prefixes": [],
    "roots": [
      {
        "form": "styg",
        "canonicalId": "styx",
        "displayRoot": "Styx / stygein: river of the underworld; to hate, shudder",
        "meaning": "the underworld river Styx; hateful, gloom-inducing",
        "origin": "Greek",
        "pieRoot": "*(s)tug-"
      }
    ],
    "suffixes": [
      {
        "form": "-ian",
        "meaning": "relating to, belonging to (adjective)"
      }
    ]
  },
  "swarthy": {
    "prefixes": [],
    "roots": [
      {
        "form": "swarth",
        "canonicalId": "sweart-oe",
        "displayRoot": "sweart: black, dark",
        "meaning": "dark-complexioned, dark, black",
        "origin": "Old English",
        "pieRoot": "*swordo-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "characterized by, inclined to (adjective)"
      }
    ]
  },
  "turpitude": {
    "prefixes": [],
    "roots": [
      {
        "form": "turp",
        "canonicalId": "turpis",
        "displayRoot": "turpis: vile, base, shameful",
        "meaning": "vile, base, morally shameful",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-itude",
        "meaning": "state, condition, or quality of (noun)"
      }
    ]
  },
  "verisimilitude": {
    "prefixes": [],
    "roots": [
      {
        "form": "veri",
        "canonicalId": "verus",
        "displayRoot": "verus: true, real, genuine",
        "meaning": "true, truth",
        "origin": "Latin",
        "pieRoot": "*weh₁-ro-"
      },
      {
        "form": "simili",
        "canonicalId": "similis",
        "displayRoot": "similis / simulare: like, similar, resembling",
        "meaning": "like, resembling, similar",
        "origin": "Latin",
        "pieRoot": "*sem-",
        "pieGroupId": "pie:sem"
      }
    ],
    "suffixes": [
      {
        "form": "-tude",
        "meaning": "state, quality, or condition of (noun)"
      }
    ]
  },
  "vicissitude": {
    "prefixes": [],
    "roots": [
      {
        "form": "viciss",
        "canonicalId": "vicis",
        "displayRoot": "vicis: change, turn, alternation",
        "meaning": "alternation, turn, change",
        "origin": "Latin",
        "pieRoot": "*weik-",
        "pieGroupId": "pie:weik"
      }
    ],
    "suffixes": [
      {
        "form": "-itude",
        "meaning": "state, quality, or condition of (noun)"
      }
    ]
  },
  "oneiric": {
    "prefixes": [],
    "roots": [
      {
        "form": "oneir",
        "canonicalId": "oneiros",
        "displayRoot": "oneiros: dream",
        "meaning": "dream, slumber vision",
        "origin": "Greek",
        "pieRoot": "*h₃ner-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, of the nature of (adjective)"
      }
    ]
  },
  "diffidence": {
    "prefixes": [
      {
        "form": "dif-",
        "canonicalId": "prefix-dis",
        "meaning": "not, away, lacking"
      }
    ],
    "roots": [
      {
        "form": "fid",
        "canonicalId": "fidere",
        "displayRoot": "fidere / fides: to trust, faith, loyalty",
        "meaning": "to trust, believe, have faith",
        "origin": "Latin",
        "pieRoot": "*bʰeidʰ-",
        "pieGroupId": "pie:bheidh"
      }
    ],
    "suffixes": [
      {
        "form": "-ence",
        "meaning": "quality, state, or condition of (noun)"
      }
    ]
  },
  "ebullience": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth"
      }
    ],
    "roots": [
      {
        "form": "bull",
        "canonicalId": "bullire",
        "displayRoot": "bullire",
        "meaning": "to bubble, boil",
        "origin": "Latin",
        "pieRoot": "*bʰel-",
        "pieGroupId": "pie:bhel"
      }
    ],
    "suffixes": [
      {
        "form": "-ience",
        "meaning": "quality or state of being (noun)"
      }
    ]
  },
  "effusion": {
    "prefixes": [
      {
        "form": "ef-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth"
      }
    ],
    "roots": [
      {
        "form": "fus",
        "canonicalId": "fundere",
        "displayRoot": "fundere / fus-: to pour, melt, shed",
        "meaning": "to pour, shed, spread",
        "origin": "Latin",
        "pieRoot": "*gʰewd-"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "act, process, or result of (noun)"
      }
    ]
  },
  "ennui": {
    "prefixes": [
      {
        "form": "en-",
        "canonicalId": "prefix-in",
        "meaning": "in, upon (intensifying)"
      }
    ],
    "roots": [
      {
        "form": "nui",
        "canonicalId": "odium",
        "displayRoot": "odium / odisse: hatred, ill-will",
        "meaning": "hatred, disgust, annoyance",
        "origin": "Latin",
        "pieRoot": "*h₃ed-",
        "pieGroupId": "pie:hed"
      }
    ],
    "suffixes": []
  },
  "torpor": {
    "prefixes": [],
    "roots": [
      {
        "form": "torp",
        "canonicalId": "torpere",
        "displayRoot": "torpere: to be numb, stiff, sluggish",
        "meaning": "to be numb, sluggish, stiff",
        "origin": "Latin",
        "pieRoot": "*(s)terp-"
      }
    ],
    "suffixes": [
      {
        "form": "-or",
        "meaning": "state, condition, or quality (noun)"
      }
    ]
  },
  "vexation": {
    "prefixes": [],
    "roots": [
      {
        "form": "vex",
        "canonicalId": "vexare",
        "displayRoot": "vexare",
        "meaning": "to shake violently, harass, or trouble",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "action, state, or condition resulting from a verb"
      }
    ]
  },
  "vehemence": {
    "prefixes": [],
    "roots": [
      {
        "form": "vehem",
        "canonicalId": "vehere",
        "displayRoot": "vehere: to carry, convey forcibly",
        "meaning": "carried away forcibly, violent, passionate",
        "origin": "Latin",
        "pieRoot": "*weǵʰ-",
        "pieGroupId": "pie:wegh"
      }
    ],
    "suffixes": [
      {
        "form": "-ence",
        "meaning": "quality, state, or condition of (noun)"
      }
    ]
  },
  "dialectic": {
    "prefixes": [
      {
        "form": "dia-",
        "canonicalId": "prefix-dia",
        "meaning": "across, between, mutually"
      }
    ],
    "roots": [
      {
        "form": "lect",
        "canonicalId": "logos",
        "displayRoot": "-logia / legein / logos: word, speech, study, gather",
        "meaning": "to speak, discourse, converse",
        "origin": "Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, art or system of (adjective/noun)"
      }
    ]
  },
  "solipsism": {
    "prefixes": [],
    "roots": [
      {
        "form": "sol",
        "canonicalId": "solus",
        "displayRoot": "solus / solari: alone, solitary; to console",
        "meaning": "alone, only",
        "origin": "Latin",
        "pieRoot": "*s(w)e-",
        "pieGroupId": "pie:swe"
      },
      {
        "form": "ips",
        "canonicalId": "ipse",
        "displayRoot": "ipse: self, same",
        "meaning": "self, very, oneself",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "philosophical doctrine, belief, or system (noun)"
      }
    ]
  },
  "syllogism": {
    "prefixes": [
      {
        "form": "syl-",
        "canonicalId": "prefix-syn",
        "meaning": "together, with"
      }
    ],
    "roots": [
      {
        "form": "log",
        "canonicalId": "logos",
        "displayRoot": "-logia / legein / logos",
        "meaning": "word, speech, study, reckon",
        "origin": "Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "result, action, or condition (noun)"
      }
    ]
  },
  "arboreal": {
    "prefixes": [],
    "roots": [
      {
        "form": "arbor",
        "canonicalId": "arbor",
        "displayRoot": "arbor: tree",
        "meaning": "tree",
        "origin": "Latin",
        "pieRoot": "*h₃erdʰ-"
      }
    ],
    "suffixes": [
      {
        "form": "-eal",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "biomimetics": {
    "prefixes": [],
    "roots": [
      {
        "form": "bio",
        "canonicalId": "bios",
        "displayRoot": "bios / biont-",
        "meaning": "life, living organism",
        "origin": "Greek",
        "pieRoot": "*gʷei-",
        "pieGroupId": "pie:gwei"
      },
      {
        "form": "mimet",
        "canonicalId": "mimesis",
        "displayRoot": "mimēsis / mimeisthai",
        "meaning": "to imitate, mimic, represent",
        "origin": "Greek",
        "pieRoot": "*meim-"
      }
    ],
    "suffixes": [
      {
        "form": "-ics",
        "meaning": "study, art, or science of (noun)"
      }
    ]
  },
  "biophilia": {
    "prefixes": [],
    "roots": [
      {
        "form": "bio",
        "canonicalId": "bios",
        "displayRoot": "bios / biont-",
        "meaning": "life, living organism",
        "origin": "Greek",
        "pieRoot": "*gʷei-",
        "pieGroupId": "pie:gwei"
      },
      {
        "form": "phil",
        "canonicalId": "philos",
        "displayRoot": "philos / philia",
        "meaning": "loving, fond of, affinity",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ia",
        "meaning": "state, quality, or tendency (noun)"
      }
    ]
  },
  "crepuscular": {
    "prefixes": [],
    "roots": [
      {
        "form": "crepuscul",
        "canonicalId": "crepusculum",
        "displayRoot": "creper / crepusculum",
        "meaning": "dark, dusky, twilight",
        "origin": "Latin",
        "pieRoot": "*krep-"
      }
    ],
    "suffixes": [
      {
        "form": "-ar",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "pelagic": {
    "prefixes": [],
    "roots": [
      {
        "form": "pelag",
        "canonicalId": "pelagos",
        "displayRoot": "pelagos: open sea, main",
        "meaning": "open sea, deep ocean",
        "origin": "Greek",
        "pieRoot": "*plāk-",
        "pieGroupId": "pie:plak"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "proprioception": {
    "prefixes": [],
    "roots": [
      {
        "form": "proprio",
        "canonicalId": "proprius",
        "displayRoot": "proprius: one's own, proper",
        "meaning": "one's own, individual",
        "origin": "Latin",
        "pieRoot": "*per-",
        "pieGroupId": "pie:per"
      },
      {
        "form": "cept",
        "canonicalId": "capere",
        "displayRoot": "capere / cept-",
        "meaning": "to take, seize, receive",
        "origin": "Latin",
        "pieRoot": "*kap-",
        "pieGroupId": "pie:kap"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "action, process, or state of (noun)"
      }
    ]
  },
  "riparian": {
    "prefixes": [],
    "roots": [
      {
        "form": "ripar",
        "canonicalId": "ripa",
        "displayRoot": "ripa: riverbank, shore",
        "meaning": "riverbank, shore",
        "origin": "Latin",
        "pieRoot": "*reiH-"
      }
    ],
    "suffixes": [
      {
        "form": "-ian",
        "meaning": "pertaining to or belonging to (adjective)"
      }
    ]
  },
  "sylvan": {
    "prefixes": [],
    "roots": [
      {
        "form": "sylv",
        "canonicalId": "silva",
        "displayRoot": "silva / Silvanus: forest, woodland",
        "meaning": "forest, woodland",
        "origin": "Latin",
        "pieRoot": "*swel-"
      }
    ],
    "suffixes": [
      {
        "form": "-an",
        "meaning": "pertaining to, of (adjective)"
      }
    ]
  },
  "vernal": {
    "prefixes": [],
    "roots": [
      {
        "form": "vern-",
        "canonicalId": "ver",
        "displayRoot": "ver",
        "meaning": "spring",
        "origin": "Latin",
        "pieRoot": "*wesr̥",
        "pieGroupId": "pie:wesr"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "pertaining to, of the kind of"
      }
    ]
  },
  "chiaroscuro": {
    "prefixes": [],
    "roots": [
      {
        "form": "chiaro",
        "canonicalId": "clarus",
        "displayRoot": "clarus",
        "meaning": "clear, bright, renowned",
        "origin": "Latin",
        "pieRoot": "*kelh₁-",
        "pieGroupId": "pie:kelh"
      },
      {
        "form": "scuro",
        "canonicalId": "obscurus",
        "displayRoot": "obscurus: dark, shaded",
        "meaning": "dark, covered",
        "origin": "Latin",
        "pieRoot": "*(s)kew-"
      }
    ],
    "suffixes": []
  },
  "tessellation": {
    "prefixes": [],
    "roots": [
      {
        "form": "tessell",
        "canonicalId": "tessera",
        "displayRoot": "tessera / tessella: four-sided die, small mosaic tile",
        "meaning": "mosaic tile, four-sided die",
        "origin": "Latin",
        "pieRoot": "*kʷetwer-"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "action, process, or result of (noun)"
      }
    ]
  },
  "jurisprudence": {
    "prefixes": [],
    "roots": [
      {
        "form": "juris",
        "canonicalId": "iurare",
        "displayRoot": "ius / iurare: law, right, oath; to swear",
        "meaning": "law, right",
        "origin": "Latin",
        "pieRoot": "*h₁yew-"
      },
      {
        "form": "prud",
        "canonicalId": "videre",
        "displayRoot": "videre / vis-: to see, look, foresee",
        "meaning": "to see, foresee, knowledge",
        "origin": "Latin",
        "pieRoot": "*weid-",
        "pieGroupId": "pie:weid"
      }
    ],
    "suffixes": [
      {
        "form": "-ence",
        "meaning": "state, quality, or practice of (noun)"
      }
    ]
  },
  "plebiscite": {
    "prefixes": [],
    "roots": [
      {
        "form": "plebi",
        "canonicalId": "plebs",
        "displayRoot": "plebs / plebis: the common people, multitude",
        "meaning": "common people, multitude",
        "origin": "Latin",
        "pieRoot": "*pleh₁-",
        "pieGroupId": "pie:pleh"
      },
      {
        "form": "scite",
        "canonicalId": "scire",
        "displayRoot": "scire: to know, understand",
        "meaning": "to vote for, decree, know",
        "origin": "Latin",
        "pieRoot": "*skey-"
      }
    ],
    "suffixes": []
  },
  "plutocracy": {
    "prefixes": [],
    "roots": [
      {
        "form": "pluto",
        "canonicalId": "ploutos",
        "displayRoot": "ploutos: wealth, riches",
        "meaning": "wealth, riches",
        "origin": "Greek",
        "pieRoot": "*plew-"
      },
      {
        "form": "crac",
        "canonicalId": "kratos",
        "displayRoot": "kratos: power, strength, rule",
        "meaning": "power, rule, authority",
        "origin": "Greek",
        "pieRoot": "*kret-",
        "pieGroupId": "pie:kret"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "form of government or rule (noun)"
      }
    ]
  },
  "polity": {
    "prefixes": [],
    "roots": [
      {
        "form": "polit",
        "canonicalId": "polis",
        "displayRoot": "polis / politēs: city-state, citizen, polity",
        "meaning": "citizen, citizenship, civil order",
        "origin": "Greek",
        "pieRoot": "*pelh₁-",
        "pieGroupId": "pie:pelh"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state, condition, or collective body (noun)"
      }
    ]
  },
  "realpolitik": {
    "prefixes": [],
    "roots": [
      {
        "form": "real",
        "canonicalId": "res",
        "displayRoot": "res / realis: thing, matter, practical reality",
        "meaning": "thing, actual matter, reality",
        "origin": "Latin",
        "pieRoot": "*reh₁-"
      },
      {
        "form": "politik",
        "canonicalId": "polis",
        "displayRoot": "polis / politēs: city-state, citizen, polity",
        "meaning": "state affairs, governance, politics",
        "origin": "Greek",
        "pieRoot": "*pelh₁-",
        "pieGroupId": "pie:pelh"
      }
    ],
    "suffixes": []
  },
  "technocracy": {
    "prefixes": [],
    "roots": [
      {
        "form": "techno",
        "canonicalId": "tekhne",
        "displayRoot": "tekhnē: art, skill, craft",
        "meaning": "skill, art, craft, technology",
        "origin": "Greek",
        "pieRoot": "*teks-"
      },
      {
        "form": "crac",
        "canonicalId": "kratos",
        "displayRoot": "kratos: power, strength, rule",
        "meaning": "power, rule, government",
        "origin": "Greek",
        "pieRoot": "*kret-",
        "pieGroupId": "pie:kret"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "form of government or rule (noun)"
      }
    ]
  },
  "bildungsroman": {
    "prefixes": [],
    "roots": [
      {
        "form": "bildung",
        "canonicalId": "bilden",
        "displayRoot": "bilden",
        "meaning": "to shape, form, educate",
        "origin": "German"
      },
      {
        "form": "roman",
        "canonicalId": "romanus",
        "displayRoot": "Romanus / roman: Roman; vernacular romance, novel",
        "meaning": "novel, romance narrative",
        "origin": "French"
      }
    ],
    "suffixes": []
  },
  "denouement": {
    "prefixes": [
      {
        "form": "de-",
        "canonicalId": "prefix-dis",
        "meaning": "un-, apart, reversal"
      }
    ],
    "roots": [
      {
        "form": "noue",
        "canonicalId": "nodus",
        "displayRoot": "nodus: knot",
        "meaning": "knot, tie",
        "origin": "Latin",
        "pieRoot": "*gned-"
      }
    ],
    "suffixes": [
      {
        "form": "-ment",
        "meaning": "result, action, or state of (noun)"
      }
    ]
  },
  "epigraph": {
    "prefixes": [
      {
        "form": "epi-",
        "canonicalId": "prefix-epi",
        "meaning": "upon, over, beside"
      }
    ],
    "roots": [
      {
        "form": "graph",
        "canonicalId": "graphein",
        "displayRoot": "graphein / gramma: to write, carve, record",
        "meaning": "to write, engrave, carve",
        "origin": "Greek",
        "pieRoot": "*gerbʰ-"
      }
    ],
    "suffixes": []
  },
  "leitmotif": {
    "prefixes": [],
    "roots": [
      {
        "form": "leit",
        "canonicalId": "leiten",
        "displayRoot": "leiten",
        "meaning": "to lead, guide",
        "origin": "German",
        "pieRoot": "*leyt-"
      },
      {
        "form": "motif",
        "canonicalId": "movere",
        "displayRoot": "movere / mot-",
        "meaning": "to move",
        "origin": "Latin",
        "pieRoot": "*mew-",
        "pieGroupId": "pie:mew"
      }
    ],
    "suffixes": []
  },
  "hamartia": {
    "prefixes": [],
    "roots": [
      {
        "form": "hamart",
        "canonicalId": "hamartanein",
        "displayRoot": "hamartanein / hamartia",
        "meaning": "to miss the mark, err, fault",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ia",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "doyen": {
    "prefixes": [],
    "roots": [
      {
        "form": "doyen",
        "canonicalId": "decem",
        "displayRoot": "decem / decanus",
        "meaning": "ten; leader of ten",
        "origin": "Latin",
        "pieRoot": "*dekm̥"
      }
    ],
    "suffixes": []
  },
  "abrogate": {
    "prefixes": [
      {
        "form": "ab-",
        "canonicalId": "prefix-ab",
        "meaning": "away, off, from"
      }
    ],
    "roots": [
      {
        "form": "rog",
        "canonicalId": "rogare",
        "displayRoot": "rogare",
        "meaning": "to ask, propose, demand",
        "origin": "Latin",
        "pieRoot": "*reg-",
        "pieGroupId": "pie:reg"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause, or act upon (verb)"
      }
    ]
  },
  "abstruse": {
    "prefixes": [
      {
        "form": "abs-",
        "canonicalId": "prefix-ab",
        "meaning": "away, off, from"
      }
    ],
    "roots": [
      {
        "form": "truse",
        "canonicalId": "trudere",
        "displayRoot": "trudere / trus-",
        "meaning": "to push, thrust",
        "origin": "Latin",
        "pieRoot": "*trewd-"
      }
    ],
    "suffixes": []
  },
  "acerbic": {
    "prefixes": [],
    "roots": [
      {
        "form": "acerb",
        "canonicalId": "acer",
        "displayRoot": "acer / acri-",
        "meaning": "sharp, biting, sour",
        "origin": "Latin",
        "pieRoot": "*ak-",
        "pieGroupId": "pie:ak"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "having the character or form of (adjective)"
      }
    ]
  },
  "acrimonious": {
    "prefixes": [],
    "roots": [
      {
        "form": "acri",
        "canonicalId": "acer",
        "displayRoot": "acer / acri-",
        "meaning": "sharp, biting, sour",
        "origin": "Latin",
        "pieRoot": "*ak-",
        "pieGroupId": "pie:ak"
      }
    ],
    "suffixes": [
      {
        "form": "-mony",
        "meaning": "action, state, or condition (noun)"
      },
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "anathema": {
    "prefixes": [
      {
        "form": "ana-",
        "canonicalId": "prefix-ana",
        "meaning": "up, upon, back"
      }
    ],
    "roots": [
      {
        "form": "the",
        "canonicalId": "tithenai",
        "displayRoot": "tithenai / thesis",
        "meaning": "to put, place, set down",
        "origin": "Greek",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": [
      {
        "form": "-ma",
        "meaning": "result of an action (noun)"
      }
    ]
  },
  "anodyne": {
    "prefixes": [
      {
        "form": "an-",
        "canonicalId": "prefix-a",
        "meaning": "without, not, lacking"
      }
    ],
    "roots": [
      {
        "form": "odyne",
        "canonicalId": "odyne",
        "displayRoot": "odynē",
        "meaning": "pain, ache, grief",
        "origin": "Greek"
      }
    ],
    "suffixes": []
  },
  "antebellum": {
    "prefixes": [
      {
        "form": "ante-",
        "canonicalId": "prefix-ante",
        "meaning": "before"
      }
    ],
    "roots": [
      {
        "form": "bell",
        "canonicalId": "bellum",
        "displayRoot": "bellum",
        "meaning": "war, conflict",
        "origin": "Latin",
        "pieRoot": "*dwel-",
        "pieGroupId": "pie:dwel"
      }
    ],
    "suffixes": [
      {
        "form": "-um",
        "meaning": "grammatical neuter ending (noun)"
      }
    ]
  },
  "assiduous": {
    "prefixes": [
      {
        "form": "as-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward, near"
      }
    ],
    "roots": [
      {
        "form": "sid",
        "canonicalId": "sedere",
        "displayRoot": "sedere / sess- / sid-",
        "meaning": "to sit, settle",
        "origin": "Latin",
        "pieRoot": "*sed-",
        "pieGroupId": "pie:sed"
      }
    ],
    "suffixes": [
      {
        "form": "-uous",
        "meaning": "tending to, characterized by (adjective)"
      }
    ]
  },
  "assuage": {
    "prefixes": [
      {
        "form": "as-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward, near"
      }
    ],
    "roots": [
      {
        "form": "suage",
        "canonicalId": "suavis",
        "displayRoot": "suavis",
        "meaning": "sweet, pleasant, agreeable",
        "origin": "Latin",
        "pieRoot": "*swad-"
      }
    ],
    "suffixes": []
  },
  "astringent": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward, near"
      }
    ],
    "roots": [
      {
        "form": "string",
        "canonicalId": "stringere",
        "displayRoot": "stringere / strict-",
        "meaning": "to draw tight, bind, squeeze",
        "origin": "Latin",
        "pieRoot": "*streyg-"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "doing, being, or tending to (adjective)"
      }
    ]
  },
  "avarice": {
    "prefixes": [],
    "roots": [
      {
        "form": "avar",
        "canonicalId": "avere",
        "displayRoot": "avere",
        "meaning": "to crave, desire eagerly",
        "origin": "Latin",
        "pieRoot": "*h₂ew-"
      }
    ],
    "suffixes": [
      {
        "form": "-ice",
        "meaning": "quality, state, or act (noun)"
      }
    ]
  },
  "avuncular": {
    "prefixes": [],
    "roots": [
      {
        "form": "avuncul",
        "canonicalId": "avunculus",
        "displayRoot": "avunculus / avus",
        "meaning": "maternal uncle; grandfather",
        "origin": "Latin",
        "pieRoot": "*awo-",
        "pieGroupId": "pie:awo"
      }
    ],
    "suffixes": [
      {
        "form": "-ar",
        "meaning": "pertaining to, of the nature of (adjective)"
      }
    ]
  },
  "beatific": {
    "prefixes": [],
    "roots": [
      {
        "form": "beat",
        "canonicalId": "beatus",
        "displayRoot": "beatus",
        "meaning": "blessed, supremely happy",
        "origin": "Latin",
        "pieRoot": "*dwehy-"
      },
      {
        "form": "fic",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": []
  },
  "bellicose": {
    "prefixes": [],
    "roots": [
      {
        "form": "bell",
        "canonicalId": "bellum",
        "displayRoot": "bellum",
        "meaning": "war, conflict",
        "origin": "Latin",
        "pieRoot": "*dwel-",
        "pieGroupId": "pie:dwel"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      },
      {
        "form": "-ose",
        "meaning": "full of, prone to (adjective)"
      }
    ]
  },
  "blithe": {
    "prefixes": [],
    "roots": [
      {
        "form": "blithe",
        "canonicalId": "blithe-oe",
        "displayRoot": "blīþe",
        "meaning": "cheerful, merry, glad",
        "origin": "Old English",
        "pieRoot": "*bʰleid-"
      }
    ],
    "suffixes": []
  },
  "bucolic": {
    "prefixes": [],
    "roots": [
      {
        "form": "bu",
        "canonicalId": "bous",
        "displayRoot": "bous",
        "meaning": "ox, cow",
        "origin": "Greek",
        "pieRoot": "*gʷow-"
      },
      {
        "form": "col",
        "canonicalId": "kolein",
        "displayRoot": "kolos / pelein",
        "meaning": "herder, tender",
        "origin": "Greek",
        "pieRoot": "*kʷel-",
        "pieGroupId": "pie:kwel"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "capacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "capac",
        "canonicalId": "capere",
        "displayRoot": "capere / cept-",
        "meaning": "to take, seize, hold, contain",
        "origin": "Latin",
        "pieRoot": "*kap-",
        "pieGroupId": "pie:kap"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "having the quality of, full of (adjective)"
      }
    ]
  },
  "churlish": {
    "prefixes": [],
    "roots": [
      {
        "form": "churl",
        "canonicalId": "ceorl",
        "displayRoot": "ceorl",
        "meaning": "free peasant, commoner, man",
        "origin": "Old English",
        "pieRoot": "*gerh₂-"
      }
    ],
    "suffixes": [
      {
        "form": "-ish",
        "meaning": "having the character or qualities of (adjective)"
      }
    ]
  },
  "circumlocution": {
    "prefixes": [
      {
        "form": "circum-",
        "canonicalId": "prefix-circum",
        "meaning": "around"
      }
    ],
    "roots": [
      {
        "form": "locu",
        "canonicalId": "loqui",
        "displayRoot": "loqui / locut-",
        "meaning": "to speak, talk, utter",
        "origin": "Latin",
        "pieRoot": "*tolkʷ-",
        "pieGroupId": "pie:tolkw"
      }
    ],
    "suffixes": [
      {
        "form": "-tion",
        "meaning": "action, process, or state (noun)"
      }
    ]
  },
  "conflagration": {
    "prefixes": [
      {
        "form": "con-",
        "canonicalId": "prefix-com",
        "meaning": "together, completely"
      }
    ],
    "roots": [
      {
        "form": "flagr",
        "canonicalId": "flagrare",
        "displayRoot": "flagrare",
        "meaning": "to blaze, burn",
        "origin": "Latin",
        "pieRoot": "*bhel-",
        "pieGroupId": "pie:bhel"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "action or resulting state (noun)"
      }
    ]
  },
  "contrite": {
    "prefixes": [
      {
        "form": "con-",
        "canonicalId": "prefix-com",
        "meaning": "together, completely"
      }
    ],
    "roots": [
      {
        "form": "trite",
        "canonicalId": "terere",
        "displayRoot": "terere / trit-",
        "meaning": "to rub, grind, wear away",
        "origin": "Latin",
        "pieRoot": "*terh₁-",
        "pieGroupId": "pie:terh"
      }
    ],
    "suffixes": []
  },
  "copacetic": {
    "prefixes": [],
    "roots": [
      {
        "form": "copacetic",
        "canonicalId": "copacetic",
        "displayRoot": "copacetic",
        "meaning": "fine, completely satisfactory",
        "origin": "American English"
      }
    ],
    "suffixes": []
  },
  "coterie": {
    "prefixes": [],
    "roots": [
      {
        "form": "cot",
        "canonicalId": "kote",
        "displayRoot": "kote / cote",
        "meaning": "cottage, hut, peasant tenancy",
        "origin": "Germanic"
      }
    ],
    "suffixes": [
      {
        "form": "-erie",
        "meaning": "collective body, association (noun)"
      }
    ]
  },
  "decorous": {
    "prefixes": [],
    "roots": [
      {
        "form": "decor",
        "canonicalId": "decus",
        "displayRoot": "decus / dignus",
        "meaning": "grace, honor, worthy, fitting",
        "origin": "Latin",
        "pieRoot": "*dek-",
        "pieGroupId": "pie:dek"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "desultory": {
    "prefixes": [
      {
        "form": "de-",
        "canonicalId": "prefix-de",
        "meaning": "down, away, completely"
      }
    ],
    "roots": [
      {
        "form": "sult",
        "canonicalId": "salire",
        "displayRoot": "salire / sult-",
        "meaning": "to leap, jump, spring forth",
        "origin": "Latin",
        "pieRoot": "*sel-",
        "pieGroupId": "pie:sel"
      }
    ],
    "suffixes": [
      {
        "form": "-ory",
        "meaning": "relating to, serving for (adjective)"
      }
    ]
  },
  "diaphanous": {
    "prefixes": [
      {
        "form": "dia-",
        "canonicalId": "prefix-dia",
        "meaning": "across, through, between"
      }
    ],
    "roots": [
      {
        "form": "phan",
        "canonicalId": "phainein",
        "displayRoot": "phainein / phan-",
        "meaning": "to show, appear, bring to light",
        "origin": "Greek",
        "pieRoot": "*bha-",
        "pieGroupId": "pie:bha"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "having the quality of, full of (adjective)"
      }
    ]
  },
  "diatribe": {
    "prefixes": [
      {
        "form": "dia-",
        "canonicalId": "prefix-dia",
        "meaning": "across, through, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "tribe",
        "canonicalId": "tribein",
        "displayRoot": "tribein",
        "meaning": "to rub, wear away, spend time",
        "origin": "Greek",
        "pieRoot": "*terh₁-",
        "pieGroupId": "pie:terh"
      }
    ],
    "suffixes": []
  },
  "didactic": {
    "prefixes": [],
    "roots": [
      {
        "form": "didakt",
        "canonicalId": "didaskein",
        "displayRoot": "didaskein / didaktos",
        "meaning": "to teach, instructed",
        "origin": "Greek",
        "pieRoot": "*dens-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "discursive": {
    "prefixes": [
      {
        "form": "dis-",
        "canonicalId": "prefix-dis",
        "meaning": "apart, in different directions"
      }
    ],
    "roots": [
      {
        "form": "curs",
        "canonicalId": "currere",
        "displayRoot": "currere / curs-",
        "meaning": "to run, flow, course",
        "origin": "Latin",
        "pieRoot": "*kers-",
        "pieGroupId": "pie:kers"
      }
    ],
    "suffixes": [
      {
        "form": "-ive",
        "meaning": "tending to, performing (adjective)"
      }
    ]
  },
  "ebullient": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out, forth"
      }
    ],
    "roots": [
      {
        "form": "bulli",
        "canonicalId": "bullire",
        "displayRoot": "bullire",
        "meaning": "to bubble, boil",
        "origin": "Latin",
        "pieRoot": "*bʰel-",
        "pieGroupId": "pie:bhel"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "characterized by, being (adjective / participle)"
      }
    ]
  },
  "edify": {
    "prefixes": [],
    "roots": [
      {
        "form": "edi",
        "canonicalId": "aedes",
        "displayRoot": "aedes",
        "meaning": "dwelling, hearth, temple",
        "origin": "Latin",
        "pieRoot": "*heidh-"
      },
      {
        "form": "fy",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": []
  },
  "elide": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out, forth"
      }
    ],
    "roots": [
      {
        "form": "lide",
        "canonicalId": "laedere",
        "displayRoot": "laedere / laes-",
        "meaning": "to strike, hurt, damage",
        "origin": "Latin"
      }
    ],
    "suffixes": []
  },
  "erudite": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, from"
      }
    ],
    "roots": [
      {
        "form": "rud",
        "canonicalId": "rudis",
        "displayRoot": "rudis",
        "meaning": "rough, raw, uncultivated",
        "origin": "Latin",
        "pieRoot": "*reud-"
      }
    ],
    "suffixes": [
      {
        "form": "-ite",
        "meaning": "having the quality of (adjective)"
      }
    ]
  },
  "excoriate": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out, off"
      }
    ],
    "roots": [
      {
        "form": "cori",
        "canonicalId": "corium",
        "displayRoot": "corium",
        "meaning": "skin, hide, leather",
        "origin": "Latin",
        "pieRoot": "*sker-",
        "pieGroupId": "pie:sker"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause (verb)"
      }
    ]
  },
  "extemporaneous": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, from"
      }
    ],
    "roots": [
      {
        "form": "tempor",
        "canonicalId": "tempus",
        "displayRoot": "tempus / tempor-",
        "meaning": "time, season, proper measure",
        "origin": "Latin",
        "pieRoot": "*temp-",
        "pieGroupId": "pie:temp"
      }
    ],
    "suffixes": [
      {
        "form": "-aneous",
        "meaning": "pertaining to, belonging to (adjective)"
      }
    ]
  },
  "facile": {
    "prefixes": [],
    "roots": [
      {
        "form": "fac",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": [
      {
        "form": "-ile",
        "meaning": "capable of, easy to (adjective)"
      }
    ]
  },
  "fatuous": {
    "prefixes": [],
    "roots": [
      {
        "form": "fatu",
        "canonicalId": "fatuus",
        "displayRoot": "fatuus",
        "meaning": "foolish, silly, insipid",
        "origin": "Latin",
        "pieRoot": "*bhat-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "felicitous": {
    "prefixes": [],
    "roots": [
      {
        "form": "felic",
        "canonicalId": "felix",
        "displayRoot": "felix / felicitas",
        "meaning": "fruitful, lucky, happy",
        "origin": "Latin",
        "pieRoot": "*dhe(i)-"
      }
    ],
    "suffixes": [
      {
        "form": "-itous",
        "meaning": "having the quality of (adjective)"
      }
    ]
  },
  "festoon": {
    "prefixes": [],
    "roots": [
      {
        "form": "fest",
        "canonicalId": "festum",
        "displayRoot": "festum / festa",
        "meaning": "feast, festival, holiday",
        "origin": "Latin",
        "pieRoot": "*dhes-",
        "pieGroupId": "pie:dhes"
      }
    ],
    "suffixes": [
      {
        "form": "-oon",
        "meaning": "noun / augmentative suffix"
      }
    ]
  },
  "florid": {
    "prefixes": [],
    "roots": [
      {
        "form": "flor",
        "canonicalId": "flos",
        "displayRoot": "flos / flor-",
        "meaning": "flower, bloom, flourish",
        "origin": "Latin",
        "pieRoot": "*bhel-",
        "pieGroupId": "pie:bhel"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "having the quality of (adjective)"
      }
    ]
  },
  "genuflect": {
    "prefixes": [],
    "roots": [
      {
        "form": "genu",
        "canonicalId": "genu",
        "displayRoot": "genu",
        "meaning": "knee",
        "origin": "Latin",
        "pieRoot": "*genu-"
      },
      {
        "form": "flect",
        "canonicalId": "flectere",
        "displayRoot": "flectere / flex-",
        "meaning": "to bend, bow",
        "origin": "Latin"
      }
    ],
    "suffixes": []
  },
  "gestalt": {
    "prefixes": [],
    "roots": [
      {
        "form": "gestalt",
        "canonicalId": "stellen",
        "displayRoot": "stellen / Gestalt",
        "meaning": "shape, form, pattern",
        "origin": "German",
        "pieRoot": "*stel-",
        "pieGroupId": "pie:stel"
      }
    ],
    "suffixes": []
  },
  "gourmand": {
    "prefixes": [],
    "roots": [
      {
        "form": "gourmand",
        "canonicalId": "gormant",
        "displayRoot": "gormant",
        "meaning": "glutton",
        "origin": "Old French"
      }
    ],
    "suffixes": []
  },
  "harangue": {
    "prefixes": [],
    "roots": [
      {
        "form": "har",
        "canonicalId": "hari",
        "displayRoot": "hari",
        "meaning": "army, host",
        "origin": "Germanic",
        "pieRoot": "*koro-"
      },
      {
        "form": "angue",
        "canonicalId": "hring",
        "displayRoot": "hring",
        "meaning": "ring, circular assembly",
        "origin": "Germanic",
        "pieRoot": "*sker-",
        "pieGroupId": "pie:sker"
      }
    ],
    "suffixes": []
  },
  "hermetic": {
    "prefixes": [],
    "roots": [
      {
        "form": "hermet",
        "canonicalId": "hermes",
        "displayRoot": "Hermēs / hermēneuein",
        "meaning": "interpreter, messenger, herald",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "histrionic": {
    "prefixes": [],
    "roots": [
      {
        "form": "histrion",
        "canonicalId": "histrio",
        "displayRoot": "histrio / histrion-",
        "meaning": "actor, player",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "impetuous": {
    "prefixes": [
      {
        "form": "im-",
        "canonicalId": "prefix-in",
        "meaning": "into, upon, against"
      }
    ],
    "roots": [
      {
        "form": "pet",
        "canonicalId": "petere",
        "displayRoot": "petere / petit-",
        "meaning": "to seek, aim at, rush toward",
        "origin": "Latin",
        "pieRoot": "*pet-",
        "pieGroupId": "pie:pet"
      }
    ],
    "suffixes": [
      {
        "form": "-uous",
        "meaning": "characterized by, inclined to (adjective)"
      }
    ]
  },
  "indigent": {
    "prefixes": [
      {
        "form": "ind-",
        "canonicalId": "prefix-in",
        "meaning": "within, in"
      }
    ],
    "roots": [
      {
        "form": "ig",
        "canonicalId": "egere",
        "displayRoot": "egere",
        "meaning": "to need, want, lack",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "being, state of (adjective / participle)"
      }
    ]
  },
  "indolent": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not"
      }
    ],
    "roots": [
      {
        "form": "dol",
        "canonicalId": "dolere",
        "displayRoot": "dolere / dolor",
        "meaning": "to feel pain, suffer, grieve",
        "origin": "Latin",
        "pieRoot": "*delh-",
        "pieGroupId": "pie:delh"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "characterized by (adjective / participle)"
      }
    ]
  },
  "inscrutable": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not"
      }
    ],
    "roots": [
      {
        "form": "scruta",
        "canonicalId": "scrutari",
        "displayRoot": "scrutari",
        "meaning": "to examine, search, investigate",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of being (adjective)"
      }
    ]
  },
  "intransigent": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not"
      },
      {
        "form": "trans-",
        "canonicalId": "prefix-trans",
        "meaning": "across, through"
      }
    ],
    "roots": [
      {
        "form": "ig",
        "canonicalId": "agere",
        "displayRoot": "agere / act-",
        "meaning": "to drive, set in motion, act",
        "origin": "Latin",
        "pieRoot": "*ag-",
        "pieGroupId": "pie:ag"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "one who, being (adjective / participle)"
      }
    ]
  },
  "irascible": {
    "prefixes": [],
    "roots": [
      {
        "form": "ira",
        "canonicalId": "irasci",
        "displayRoot": "ira / irasci",
        "meaning": "anger, to be angry",
        "origin": "Latin",
        "pieRoot": "*eis-"
      }
    ],
    "suffixes": [
      {
        "form": "-ible",
        "meaning": "capable of, prone to (adjective)"
      }
    ]
  },
  "itinerant": {
    "prefixes": [],
    "roots": [
      {
        "form": "itiner",
        "canonicalId": "ire",
        "displayRoot": "ire / it-",
        "meaning": "to go, travel, pass",
        "origin": "Latin",
        "pieRoot": "*ei-"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "performing an action (adjective / participle)"
      }
    ]
  },
  "laconic": {
    "prefixes": [],
    "roots": [
      {
        "form": "lacon",
        "canonicalId": "lakon",
        "displayRoot": "Lakōn",
        "meaning": "Spartan, Laconia",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "lugubrious": {
    "prefixes": [],
    "roots": [
      {
        "form": "lugubr",
        "canonicalId": "lugere",
        "displayRoot": "lugere",
        "meaning": "to mourn, grieve",
        "origin": "Latin",
        "pieRoot": "*leug-"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "full of, having the quality of (adjective)"
      }
    ]
  },
  "mellifluous": {
    "prefixes": [],
    "roots": [
      {
        "form": "melli",
        "canonicalId": "mel",
        "displayRoot": "mel / mell-",
        "meaning": "honey",
        "origin": "Latin",
        "pieRoot": "*melit-"
      },
      {
        "form": "flu",
        "canonicalId": "fluere",
        "displayRoot": "fluere / flux-",
        "meaning": "to flow, stream",
        "origin": "Latin",
        "pieRoot": "*bhleu-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, possessing (adjective)"
      }
    ]
  },
  "mendacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "mendac",
        "canonicalId": "mendax",
        "displayRoot": "mendax / menda",
        "meaning": "fault, lie, defect",
        "origin": "Latin",
        "pieRoot": "*mend-"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "characterized by (adjective)"
      }
    ]
  },
  "obsequious": {
    "prefixes": [
      {
        "form": "ob-",
        "canonicalId": "prefix-ob",
        "meaning": "toward, following, after"
      }
    ],
    "roots": [
      {
        "form": "sequi",
        "canonicalId": "sequi",
        "displayRoot": "sequi / secut-",
        "meaning": "to follow, ensue",
        "origin": "Latin",
        "pieRoot": "*sekw-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, having the quality of (adjective)"
      }
    ]
  },
  "parochial": {
    "prefixes": [
      {
        "form": "par-",
        "canonicalId": "prefix-para",
        "meaning": "beside, near, beyond"
      }
    ],
    "roots": [
      {
        "form": "oik",
        "canonicalId": "oikos",
        "displayRoot": "oikos / oec-",
        "meaning": "house, dwelling, district",
        "origin": "Greek",
        "pieRoot": "*weyk-",
        "pieGroupId": "pie:weyk"
      }
    ],
    "suffixes": [
      {
        "form": "-ial",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "patois": {
    "prefixes": [],
    "roots": [
      {
        "form": "patoier",
        "canonicalId": "patte",
        "displayRoot": "patte / patoier",
        "meaning": "paw, foot; to handle clumsily",
        "origin": "Old French"
      }
    ],
    "suffixes": []
  },
  "pernicious": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "through, thoroughly, completely"
      }
    ],
    "roots": [
      {
        "form": "nic",
        "canonicalId": "nex",
        "displayRoot": "nex / necis / necare",
        "meaning": "death, slaughter, destruction",
        "origin": "Latin",
        "pieRoot": "*nek-"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "full of, characterized by (adjective)"
      }
    ]
  },
  "philistine": {
    "prefixes": [],
    "roots": [
      {
        "form": "philist",
        "canonicalId": "peleshet",
        "displayRoot": "Peleshet / Philistia",
        "meaning": "Philistine, migrant, foreigner",
        "origin": "Hebrew"
      }
    ],
    "suffixes": [
      {
        "form": "-ine",
        "meaning": "pertaining to, of the nature of (adjective/noun)"
      }
    ]
  },
  "piquancy": {
    "prefixes": [],
    "roots": [
      {
        "form": "piqu",
        "canonicalId": "piquer",
        "displayRoot": "piquer",
        "meaning": "to prick, sting, pierce",
        "origin": "French"
      }
    ],
    "suffixes": [
      {
        "form": "-ancy",
        "meaning": "state, quality, or condition of (noun)"
      }
    ]
  },
  "plaudit": {
    "prefixes": [],
    "roots": [
      {
        "form": "plaud",
        "canonicalId": "plaudere",
        "displayRoot": "plaudere / plaus-",
        "meaning": "to clap, applaud, strike",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-it",
        "meaning": "imperative ending ('applaud!'), naturalized as a noun"
      }
    ]
  },
  "polemic": {
    "prefixes": [],
    "roots": [
      {
        "form": "polem",
        "canonicalId": "polemos",
        "displayRoot": "polemos",
        "meaning": "war, hostility, combat",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, relating to (adjective/noun)"
      }
    ]
  },
  "pontificate": {
    "prefixes": [],
    "roots": [
      {
        "form": "pont-",
        "canonicalId": "pons",
        "displayRoot": "pons / pont-",
        "meaning": "bridge, path",
        "origin": "Latin",
        "pieRoot": "*pent-"
      },
      {
        "form": "ific",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to act as, perform the role of (verb)"
      }
    ]
  },
  "prurient": {
    "prefixes": [],
    "roots": [
      {
        "form": "pruri",
        "canonicalId": "prurire",
        "displayRoot": "prurire",
        "meaning": "to itch, yearn, crave",
        "origin": "Latin",
        "pieRoot": "*prews-"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "characterized by, being (adjective)"
      }
    ]
  },
  "puerile": {
    "prefixes": [],
    "roots": [
      {
        "form": "puer",
        "canonicalId": "puer",
        "displayRoot": "puer",
        "meaning": "boy, child",
        "origin": "Latin",
        "pieRoot": "*peh2w-"
      }
    ],
    "suffixes": [
      {
        "form": "-ile",
        "meaning": "pertaining to, suited to (adjective)"
      }
    ]
  },
  "pugilist": {
    "prefixes": [],
    "roots": [
      {
        "form": "pugil",
        "canonicalId": "pugnare",
        "displayRoot": "pugnare / pugnus",
        "meaning": "to fight; fist",
        "origin": "Latin",
        "pieRoot": "*peuk-",
        "pieGroupId": "pie:peuk"
      }
    ],
    "suffixes": [
      {
        "form": "-ist",
        "meaning": "one who practices or specializes in (noun)"
      }
    ]
  },
  "pugnacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "pugn",
        "canonicalId": "pugnare",
        "displayRoot": "pugnare / pugnus",
        "meaning": "to fight; fist",
        "origin": "Latin",
        "pieRoot": "*peuk-",
        "pieGroupId": "pie:peuk"
      }
    ],
    "suffixes": [
      {
        "form": "-acious",
        "meaning": "inclined to, prone to (adjective)"
      }
    ]
  },
  "querulous": {
    "prefixes": [],
    "roots": [
      {
        "form": "quer",
        "canonicalId": "queri",
        "displayRoot": "queri",
        "meaning": "to complain, lament",
        "origin": "Latin",
        "pieRoot": "*kwes-"
      }
    ],
    "suffixes": [
      {
        "form": "-ulous",
        "meaning": "tending to, full of (adjective)"
      }
    ]
  },
  "recalcitrant": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "back, again, against"
      }
    ],
    "roots": [
      {
        "form": "calcitr",
        "canonicalId": "calx",
        "displayRoot": "calx / calcitrare",
        "meaning": "heel, to tread or kick",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "performing an action, characterized by (adjective)"
      }
    ]
  },
  "reprobate": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "back, reversal, against"
      }
    ],
    "roots": [
      {
        "form": "prob",
        "canonicalId": "probare",
        "displayRoot": "probare / probus",
        "meaning": "to test, prove; honest, upright",
        "origin": "Latin",
        "pieRoot": "*pro-bho-",
        "pieGroupId": "pie:probho"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "having the state or condition of (adjective/noun)"
      }
    ]
  },
  "salacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "salac",
        "canonicalId": "salire",
        "displayRoot": "salire / sult-",
        "meaning": "to leap, jump, spring forth",
        "origin": "Latin",
        "pieRoot": "*sel-",
        "pieGroupId": "pie:sel"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "characterized by, given to (adjective)"
      }
    ]
  },
  "sardonic": {
    "prefixes": [],
    "roots": [
      {
        "form": "sardon",
        "canonicalId": "sardo",
        "displayRoot": "Sardō / sardonios",
        "meaning": "Sardinian (plant causing bitter grimaces)",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, of the nature of (adjective)"
      }
    ]
  },
  "sartorial": {
    "prefixes": [],
    "roots": [
      {
        "form": "sartor",
        "canonicalId": "sarcire",
        "displayRoot": "sarcire / sartor",
        "meaning": "to mend, patch; tailor",
        "origin": "Latin",
        "pieRoot": "*serk-"
      }
    ],
    "suffixes": [
      {
        "form": "-ial",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "somnambulism": {
    "prefixes": [],
    "roots": [
      {
        "form": "somn-",
        "canonicalId": "somnus",
        "displayRoot": "somnus",
        "meaning": "sleep",
        "origin": "Latin",
        "pieRoot": "*swep-",
        "pieGroupId": "pie:swep"
      },
      {
        "form": "ambul",
        "canonicalId": "ambulare",
        "displayRoot": "ambulare",
        "meaning": "to walk, wander",
        "origin": "Latin",
        "pieRoot": "*h2el-"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "state, condition, or practice (noun)"
      }
    ]
  },
  "staid": {
    "prefixes": [],
    "roots": [
      {
        "form": "sta",
        "canonicalId": "stare",
        "displayRoot": "stare / stat- / sistere",
        "meaning": "to stand, set firm, remain",
        "origin": "Latin",
        "pieRoot": "*steh2-",
        "pieGroupId": "pie:steh"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "past participle ending indicating a fixed or settled state (adjective)"
      }
    ]
  },
  "stochastic": {
    "prefixes": [],
    "roots": [
      {
        "form": "stochast",
        "canonicalId": "stokhos",
        "displayRoot": "stokhos / stokhazesthai",
        "meaning": "target, aim, guess",
        "origin": "Greek",
        "pieRoot": "*stegh-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "supercilious": {
    "prefixes": [
      {
        "form": "super-",
        "canonicalId": "prefix-super",
        "meaning": "over, above"
      }
    ],
    "roots": [
      {
        "form": "cili",
        "canonicalId": "cilium",
        "displayRoot": "cilium",
        "meaning": "eyelid, eyebrow",
        "origin": "Latin",
        "pieRoot": "*kel-",
        "pieGroupId": "pie:kel-cover"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, characterized by (adjective)"
      }
    ]
  },
  "surreptitious": {
    "prefixes": [
      {
        "form": "sur-",
        "canonicalId": "prefix-sub",
        "meaning": "under, secretly"
      }
    ],
    "roots": [
      {
        "form": "rept",
        "canonicalId": "repere",
        "displayRoot": "repere / rept-",
        "meaning": "to creep, crawl",
        "origin": "Latin",
        "pieRoot": "*rep-"
      }
    ],
    "suffixes": [
      {
        "form": "-itious",
        "meaning": "pertaining to, characterized by (adjective)"
      }
    ]
  },
  "taciturn": {
    "prefixes": [],
    "roots": [
      {
        "form": "tacit",
        "canonicalId": "tacere",
        "displayRoot": "tacere / tacitus",
        "meaning": "to be silent",
        "origin": "Latin",
        "pieRoot": "*tak-",
        "pieGroupId": "pie:tak"
      }
    ],
    "suffixes": [
      {
        "form": "-urn",
        "meaning": "habitual state or tendency (adjective)"
      }
    ]
  },
  "temerity": {
    "prefixes": [],
    "roots": [
      {
        "form": "temer",
        "canonicalId": "temere",
        "displayRoot": "temere / temeritas",
        "meaning": "rashly, blindly, by chance; rashness",
        "origin": "Latin",
        "pieRoot": "*temh1-",
        "pieGroupId": "pie:temh"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or quality of (noun)"
      }
    ]
  },
  "trenchant": {
    "prefixes": [],
    "roots": [
      {
        "form": "trench",
        "canonicalId": "trenchier",
        "displayRoot": "trenchier",
        "meaning": "to cut, carve, sever",
        "origin": "Old French"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "performing, having the quality of (adjective)"
      }
    ]
  },
  "truculent": {
    "prefixes": [],
    "roots": [
      {
        "form": "truc",
        "canonicalId": "trux",
        "displayRoot": "trux / trucis",
        "meaning": "fierce, savage, grim",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ulent",
        "meaning": "abounding in, full of (adjective)"
      }
    ]
  },
  "unctuous": {
    "prefixes": [],
    "roots": [
      {
        "form": "unct",
        "canonicalId": "ungere",
        "displayRoot": "ungere / unct-",
        "meaning": "to anoint, smear with oil",
        "origin": "Latin",
        "pieRoot": "*h3engw-"
      }
    ],
    "suffixes": [
      {
        "form": "-uous",
        "meaning": "characterized by, full of (adjective)"
      }
    ]
  },
  "vacillate": {
    "prefixes": [],
    "roots": [
      {
        "form": "vacill",
        "canonicalId": "vacillare",
        "displayRoot": "vacillare",
        "meaning": "to sway, waver, totter",
        "origin": "Latin",
        "pieRoot": "*wek-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to act, make, cause (verb)"
      }
    ]
  },
  "venal": {
    "prefixes": [],
    "roots": [
      {
        "form": "ven",
        "canonicalId": "venum",
        "displayRoot": "venum",
        "meaning": "sale",
        "origin": "Latin",
        "pieRoot": "*wes-"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "vociferous": {
    "prefixes": [],
    "roots": [
      {
        "form": "voci-",
        "canonicalId": "vocare",
        "displayRoot": "vocare / vox",
        "meaning": "to call, voice",
        "origin": "Latin",
        "pieRoot": "*wekʷ-",
        "pieGroupId": "pie:wekw"
      },
      {
        "form": "fer",
        "canonicalId": "ferre",
        "displayRoot": "ferre / lat-",
        "meaning": "to bear, carry, bring",
        "origin": "Latin",
        "pieRoot": "*bher-",
        "pieGroupId": "pie:bher"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "wheedle": {
    "prefixes": [],
    "roots": [
      {
        "form": "wheedle",
        "canonicalId": "schwedeln",
        "displayRoot": "schwedeln",
        "meaning": "to wag the tail, flatter, fawn",
        "origin": "German"
      }
    ],
    "suffixes": []
  },
  "halcyon": {
    "prefixes": [],
    "roots": [
      {
        "form": "hal-",
        "canonicalId": "hals",
        "displayRoot": "hals (halos)",
        "meaning": "salt, the sea",
        "origin": "Greek",
        "pieRoot": "*seh₂l-"
      },
      {
        "form": "cyon",
        "canonicalId": "kyein",
        "displayRoot": "kyein",
        "meaning": "to conceive, swell, brood",
        "origin": "Greek",
        "pieRoot": "*kewh₁-",
        "pieGroupId": "pie:kewh"
      }
    ],
    "suffixes": []
  },
  "magnanimous": {
    "prefixes": [],
    "roots": [
      {
        "form": "magn",
        "canonicalId": "magnus",
        "displayRoot": "magnus / grandis",
        "meaning": "great, large, grand",
        "origin": "Latin",
        "pieRoot": "*meǵ-"
      },
      {
        "form": "anim",
        "canonicalId": "animus",
        "displayRoot": "animus / anima",
        "meaning": "soul, mind, spirit, breath",
        "origin": "Latin",
        "pieRoot": "*h₂enh₁-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "dysphoria": {
    "prefixes": [
      {
        "form": "dys-",
        "canonicalId": "prefix-dys",
        "meaning": "bad, difficult, disordered"
      }
    ],
    "roots": [
      {
        "form": "phor",
        "canonicalId": "pherein",
        "displayRoot": "pherein / phoros",
        "meaning": "to bear, carry, bring",
        "origin": "Greek",
        "pieRoot": "*bher-",
        "pieGroupId": "pie:bher"
      }
    ],
    "suffixes": [
      {
        "form": "-ia",
        "meaning": "state or condition (noun)"
      }
    ]
  },
  "malevolence": {
    "prefixes": [],
    "roots": [
      {
        "form": "male",
        "canonicalId": "male",
        "displayRoot": "male",
        "meaning": "badly, ill",
        "origin": "Latin",
        "pieRoot": "*mel-",
        "pieGroupId": "pie:mel"
      },
      {
        "form": "vol",
        "canonicalId": "velle",
        "displayRoot": "velle / vol-",
        "meaning": "to wish, want",
        "origin": "Latin",
        "pieRoot": "*welh₁-",
        "pieGroupId": "pie:welh"
      }
    ],
    "suffixes": [
      {
        "form": "-ence",
        "meaning": "state or quality of"
      }
    ]
  },
  "ostracism": {
    "prefixes": [],
    "roots": [
      {
        "form": "ostrak",
        "canonicalId": "ostrakon",
        "displayRoot": "ostrakon",
        "meaning": "potsherd, voting tile, shell",
        "origin": "Greek",
        "pieRoot": "*osth₁-",
        "pieGroupId": "pie:osth"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "practice, action, or system (noun)"
      }
    ]
  },
  "charlatan": {
    "prefixes": [],
    "roots": [
      {
        "form": "ciarla",
        "canonicalId": "ciarlare",
        "displayRoot": "ciarlare",
        "meaning": "to babble, chatter",
        "origin": "Italian"
      }
    ],
    "suffixes": [
      {
        "form": "-tan",
        "meaning": "one who does or is connected with (noun)"
      }
    ]
  },
  "dichotomy": {
    "prefixes": [],
    "roots": [
      {
        "form": "dicho",
        "canonicalId": "dicha",
        "displayRoot": "dikha / dis",
        "meaning": "in two, asunder",
        "origin": "Greek",
        "pieRoot": "*dwis"
      },
      {
        "form": "tomy",
        "canonicalId": "temnein",
        "displayRoot": "temnein / tomos",
        "meaning": "to cut, divide, section",
        "origin": "Greek",
        "pieRoot": "*temh₁-",
        "pieGroupId": "pie:temh"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "act or condition of (noun)"
      }
    ]
  },
  "figment": {
    "prefixes": [],
    "roots": [
      {
        "form": "fig",
        "canonicalId": "fingere",
        "displayRoot": "fingere / fict-",
        "meaning": "to shape, mold, devise, feign",
        "origin": "Latin",
        "pieRoot": "*dheygʰ-"
      }
    ],
    "suffixes": [
      {
        "form": "-ment",
        "meaning": "result, product, or means of an action (noun)"
      }
    ]
  },
  "gerrymander": {
    "prefixes": [],
    "roots": [
      {
        "form": "gerry",
        "canonicalId": "gerry",
        "displayRoot": "Gerry",
        "meaning": "proper name of Governor Elbridge Gerry",
        "origin": "English"
      },
      {
        "form": "mander",
        "canonicalId": "salamandra",
        "displayRoot": "salamandra",
        "meaning": "salamander",
        "origin": "Greek"
      }
    ],
    "suffixes": []
  },
  "hedonist": {
    "prefixes": [],
    "roots": [
      {
        "form": "hedon",
        "canonicalId": "hedone",
        "displayRoot": "hēdonē",
        "meaning": "pleasure, delight",
        "origin": "Greek",
        "pieRoot": "*sweh₂d-",
        "pieGroupId": "pie:swehd"
      }
    ],
    "suffixes": [
      {
        "form": "-ist",
        "meaning": "one who practices or adheres to (noun)"
      }
    ]
  },
  "hypochondriac": {
    "prefixes": [
      {
        "form": "hypo-",
        "canonicalId": "prefix-hypo",
        "meaning": "under, beneath, below"
      }
    ],
    "roots": [
      {
        "form": "chondr",
        "canonicalId": "chondros",
        "displayRoot": "khondros",
        "meaning": "cartilage, breastbone region",
        "origin": "Greek",
        "pieRoot": "*grendh-"
      }
    ],
    "suffixes": [
      {
        "form": "-iac",
        "meaning": "pertaining to or person affected by (adjective/noun)"
      }
    ]
  },
  "idiom": {
    "prefixes": [],
    "roots": [
      {
        "form": "idio",
        "canonicalId": "idios",
        "displayRoot": "idios",
        "meaning": "own, private, peculiar",
        "origin": "Greek",
        "pieRoot": "*swed-yo-"
      }
    ],
    "suffixes": [
      {
        "form": "-m",
        "meaning": "result of an action or condition (noun)"
      }
    ]
  },
  "kismet": {
    "prefixes": [],
    "roots": [
      {
        "form": "kismet",
        "canonicalId": "qasama",
        "displayRoot": "qismah / qasama",
        "meaning": "portion, lot, fate",
        "origin": "Arabic"
      }
    ],
    "suffixes": []
  },
  "scrupulous": {
    "prefixes": [],
    "roots": [
      {
        "form": "scrupul",
        "canonicalId": "scrupus",
        "displayRoot": "scrupus / scrupulus",
        "meaning": "small sharp stone, source of anxiety",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "truancy": {
    "prefixes": [],
    "roots": [
      {
        "form": "truan",
        "canonicalId": "truant",
        "displayRoot": "truant",
        "meaning": "beggar, vagabond, wanderer",
        "origin": "Old French"
      }
    ],
    "suffixes": [
      {
        "form": "-cy",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "usurp": {
    "prefixes": [],
    "roots": [
      {
        "form": "us",
        "canonicalId": "uti",
        "displayRoot": "uti / usus",
        "meaning": "to use, employ, enjoy",
        "origin": "Latin",
        "pieRoot": "*oyt-",
        "pieGroupId": "pie:oyt"
      },
      {
        "form": "urp",
        "canonicalId": "rapere",
        "displayRoot": "rapere / rapt-",
        "meaning": "to seize, snatch, carry off",
        "origin": "Latin",
        "pieRoot": "*h₁rep-",
        "pieGroupId": "pie:hrep"
      }
    ],
    "suffixes": []
  },
  "vicarious": {
    "prefixes": [],
    "roots": [
      {
        "form": "vicar",
        "canonicalId": "vicis",
        "displayRoot": "vicis / vicarius",
        "meaning": "change, turn, stead, substitute",
        "origin": "Latin",
        "pieRoot": "*weyk-",
        "pieGroupId": "pie:weyk"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "characterized by, full of (adjective)"
      }
    ]
  },
  "numinous": {
    "prefixes": [],
    "roots": [
      {
        "form": "numin",
        "canonicalId": "numen",
        "displayRoot": "numen",
        "meaning": "divine will, divinity, divine nod",
        "origin": "Latin",
        "pieRoot": "*new-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "aegis": {
    "prefixes": [],
    "roots": [
      {
        "form": "aegis",
        "canonicalId": "aigis",
        "displayRoot": "aigis / aix",
        "meaning": "goatskin, divine shield of Zeus",
        "origin": "Greek",
        "pieRoot": "*ayg-"
      }
    ],
    "suffixes": []
  },
  "apotheosis": {
    "prefixes": [
      {
        "form": "apo-",
        "canonicalId": "prefix-apo",
        "meaning": "away from, forth, completely"
      }
    ],
    "roots": [
      {
        "form": "theo",
        "canonicalId": "theos",
        "displayRoot": "theos",
        "meaning": "god, divine being",
        "origin": "Greek",
        "pieRoot": "*dhes-",
        "pieGroupId": "pie:dhes"
      }
    ],
    "suffixes": [
      {
        "form": "-sis",
        "meaning": "action, process, or state (noun)"
      }
    ]
  },
  "approbation": {
    "prefixes": [
      {
        "form": "ap-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward, near"
      }
    ],
    "roots": [
      {
        "form": "prob",
        "canonicalId": "probare",
        "displayRoot": "probare / probus",
        "meaning": "to test, prove; honest, upright",
        "origin": "Latin",
        "pieRoot": "*pro-bho-",
        "pieGroupId": "pie:probho"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "action or resulting state (noun)"
      }
    ]
  },
  "bifurcate": {
    "prefixes": [
      {
        "form": "bi-",
        "canonicalId": "prefix-bi",
        "meaning": "two, twice, double"
      }
    ],
    "roots": [
      {
        "form": "furc",
        "canonicalId": "furca",
        "displayRoot": "furca",
        "meaning": "fork, two-pronged implement",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause to be (verb/adjective)"
      }
    ]
  },
  "bivouac": {
    "prefixes": [],
    "roots": [
      {
        "form": "bivouac",
        "canonicalId": "wacht-ger",
        "displayRoot": "wachten / biwacht",
        "meaning": "to watch, keep guard",
        "origin": "German",
        "pieRoot": "*weǵ-",
        "pieGroupId": "pie:weg"
      }
    ],
    "suffixes": []
  },
  "chromatic": {
    "prefixes": [],
    "roots": [
      {
        "form": "chromat",
        "canonicalId": "chroma",
        "displayRoot": "khrōma / chromat-",
        "meaning": "color, surface, tone",
        "origin": "Greek",
        "pieRoot": "*ghreu-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "compunction": {
    "prefixes": [
      {
        "form": "com-",
        "canonicalId": "prefix-com",
        "meaning": "completely, intensively"
      }
    ],
    "roots": [
      {
        "form": "punct",
        "canonicalId": "pungere",
        "displayRoot": "pungere / punct-",
        "meaning": "to prick, pierce, sting",
        "origin": "Latin",
        "pieRoot": "*pewǵ-",
        "pieGroupId": "pie:pewg"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "act, state, or condition (noun)"
      }
    ]
  },
  "depredation": {
    "prefixes": [
      {
        "form": "de-",
        "canonicalId": "prefix-de",
        "meaning": "down, thoroughly, completely"
      }
    ],
    "roots": [
      {
        "form": "pred",
        "canonicalId": "praeda",
        "displayRoot": "praeda",
        "meaning": "booty, plunder, prey",
        "origin": "Latin",
        "pieRoot": "*gʰed-"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "action or process (noun)"
      }
    ]
  },
  "dulcet": {
    "prefixes": [],
    "roots": [
      {
        "form": "dulc",
        "canonicalId": "dulcis",
        "displayRoot": "dulcis",
        "meaning": "sweet, pleasant",
        "origin": "Latin",
        "pieRoot": "*dlk-u-"
      }
    ],
    "suffixes": [
      {
        "form": "-et",
        "meaning": "diminutive (noun/adjective)"
      }
    ]
  },
  "enervate": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, from"
      }
    ],
    "roots": [
      {
        "form": "nerv",
        "canonicalId": "nervus",
        "displayRoot": "nervus",
        "meaning": "sinew, tendon, nerve",
        "origin": "Latin",
        "pieRoot": "*(s)néh₁wr̥"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause to be (verb suffix)"
      }
    ]
  },
  "evanescent": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, away"
      }
    ],
    "roots": [
      {
        "form": "van",
        "canonicalId": "vacare",
        "displayRoot": "vacare / vanus",
        "meaning": "empty, void, in vain",
        "origin": "Latin",
        "pieRoot": "*h₁weh₂-"
      }
    ],
    "suffixes": [
      {
        "form": "-escent",
        "meaning": "becoming, beginning to (inchoative adjective suffix)"
      }
    ]
  },
  "interstitial": {
    "prefixes": [
      {
        "form": "inter-",
        "canonicalId": "prefix-inter",
        "meaning": "between, among"
      }
    ],
    "roots": [
      {
        "form": "stit",
        "canonicalId": "stare",
        "displayRoot": "stare / stat- / sistere",
        "meaning": "to stand, set firm, remain",
        "origin": "Latin",
        "pieRoot": "*steh₁-",
        "pieGroupId": "pie:steh"
      }
    ],
    "suffixes": [
      {
        "form": "-ial",
        "meaning": "pertaining to (adjective suffix)"
      }
    ]
  },
  "penury": {
    "prefixes": [],
    "roots": [
      {
        "form": "penur",
        "canonicalId": "penuria",
        "displayRoot": "penuria",
        "meaning": "want, scarcity, need",
        "origin": "Latin",
        "pieRoot": "*pen-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state or condition (noun suffix)"
      }
    ]
  },
  "perfidious": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "detrimental to, deviating from"
      }
    ],
    "roots": [
      {
        "form": "fid",
        "canonicalId": "fidere",
        "displayRoot": "fidere / fides",
        "meaning": "to trust, faith, loyalty",
        "origin": "Latin",
        "pieRoot": "*bʰeydʰ-",
        "pieGroupId": "pie:bheydh"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "characterized by, full of (adjective suffix)"
      }
    ]
  },
  "promontory": {
    "prefixes": [
      {
        "form": "pro-",
        "canonicalId": "prefix-pro",
        "meaning": "forward, forth, in front"
      }
    ],
    "roots": [
      {
        "form": "mont",
        "canonicalId": "mons",
        "displayRoot": "mons / mont-",
        "meaning": "mountain, height, projection",
        "origin": "Latin",
        "pieRoot": "*men-",
        "pieGroupId": "pie:men-jut"
      }
    ],
    "suffixes": [
      {
        "form": "-ory",
        "meaning": "place of, serving for (noun/adjective suffix)"
      }
    ]
  },
  "putative": {
    "prefixes": [],
    "roots": [
      {
        "form": "put",
        "canonicalId": "putare",
        "displayRoot": "putare",
        "meaning": "to prune, reckon, think, count",
        "origin": "Latin",
        "pieRoot": "*peu-",
        "pieGroupId": "pie:peu"
      }
    ],
    "suffixes": [
      {
        "form": "-ative",
        "meaning": "relating to, tending to (adjective suffix)"
      }
    ]
  },
  "raconteur": {
    "prefixes": [
      {
        "form": "ra-",
        "canonicalId": "prefix-re",
        "meaning": "again, back"
      }
    ],
    "roots": [
      {
        "form": "cont",
        "canonicalId": "putare",
        "displayRoot": "putare",
        "meaning": "to prune, reckon, think, count",
        "origin": "Latin",
        "pieRoot": "*peu-",
        "pieGroupId": "pie:peu"
      }
    ],
    "suffixes": [
      {
        "form": "-eur",
        "meaning": "person who performs an action (agent noun suffix)"
      }
    ]
  },
  "redolent": {
    "prefixes": [
      {
        "form": "red-",
        "canonicalId": "prefix-re",
        "meaning": "back, again, intensive"
      }
    ],
    "roots": [
      {
        "form": "ol",
        "canonicalId": "olere",
        "displayRoot": "olere / odor",
        "meaning": "to emit an odor, smell",
        "origin": "Latin",
        "pieRoot": "*h₃ed-",
        "pieGroupId": "pie:hed"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "doing, performing (adjective suffix)"
      }
    ]
  },
  "ribald": {
    "prefixes": [],
    "roots": [
      {
        "form": "rib",
        "canonicalId": "hriban",
        "displayRoot": "*hrīban / riber",
        "meaning": "to rub, copulate, be wanton",
        "origin": "Frankish"
      }
    ],
    "suffixes": [
      {
        "form": "-ald",
        "meaning": "person characterized by a quality (pejorative agent suffix)"
      }
    ]
  },
  "sagacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "sagac",
        "canonicalId": "sagire",
        "displayRoot": "sagire / sagax",
        "meaning": "to perceive keenly, be wise",
        "origin": "Latin",
        "pieRoot": "*seh₂g-"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "having the quality of, full of (adjective suffix)"
      }
    ]
  },
  "sophism": {
    "prefixes": [],
    "roots": [
      {
        "form": "soph",
        "canonicalId": "sophos",
        "displayRoot": "sophos / sophia",
        "meaning": "wise, wisdom, skill",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "doctrine, practice, or result of an action (noun suffix)"
      }
    ]
  },
  "turgid": {
    "prefixes": [],
    "roots": [
      {
        "form": "turg",
        "canonicalId": "turgere",
        "displayRoot": "turgere",
        "meaning": "to swell, be swollen",
        "origin": "Latin",
        "pieRoot": "*twerǵʰ-"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "state or condition (adjective suffix)"
      }
    ]
  },
  "vexatious": {
    "prefixes": [],
    "roots": [
      {
        "form": "vex",
        "canonicalId": "vexare",
        "displayRoot": "vexare",
        "meaning": "to shake, agitate, torment",
        "origin": "Latin",
        "pieRoot": "*weǵʰ-",
        "pieGroupId": "pie:wegh"
      }
    ],
    "suffixes": [
      {
        "form": "-atious",
        "meaning": "causing, characterized by, tending to (adjective suffix)"
      }
    ]
  },
  "senescence": {
    "prefixes": [],
    "roots": [
      {
        "form": "sen",
        "canonicalId": "senex",
        "displayRoot": "senex / senescere",
        "meaning": "old, elder",
        "origin": "Latin",
        "pieRoot": "*sén-"
      }
    ],
    "suffixes": [
      {
        "form": "-escence",
        "meaning": "state of becoming or beginning to be (noun suffix)"
      }
    ]
  },
  "ardor": {
    "prefixes": [],
    "roots": [
      {
        "form": "ard",
        "canonicalId": "ardere",
        "displayRoot": "fervere / ardere / ebullire",
        "meaning": "to burn, glow, boil, bubble up",
        "origin": "Latin",
        "pieRoot": "*h₂eh₁dʰ-"
      }
    ],
    "suffixes": [
      {
        "form": "-or",
        "meaning": "state, condition, or quality (noun suffix)"
      }
    ]
  },
  "catharsis": {
    "prefixes": [],
    "roots": [
      {
        "form": "cathar",
        "canonicalId": "katharos",
        "displayRoot": "katharos / kathairein",
        "meaning": "pure, clear; to cleanse, purify",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-sis",
        "meaning": "process, action, or condition (noun suffix)"
      }
    ]
  },
  "fervor": {
    "prefixes": [],
    "roots": [
      {
        "form": "ferv",
        "canonicalId": "fervere",
        "displayRoot": "fervere",
        "meaning": "to boil, glow, be hot",
        "origin": "Latin",
        "pieRoot": "*bʰerw-",
        "pieGroupId": "pie:bherw"
      }
    ],
    "suffixes": [
      {
        "form": "-or",
        "meaning": "state, condition, or quality (noun suffix)"
      }
    ]
  },
  "pathos": {
    "prefixes": [],
    "roots": [
      {
        "form": "path",
        "canonicalId": "pathos",
        "displayRoot": "pathos / paskhein",
        "meaning": "feeling, suffering, passion",
        "origin": "Greek",
        "pieRoot": "*kʷendʰ-",
        "pieGroupId": "pie:kwendh"
      }
    ],
    "suffixes": [
      {
        "form": "-os",
        "meaning": "abstract noun ending"
      }
    ]
  },
  "brutalism": {
    "prefixes": [],
    "roots": [
      {
        "form": "brut",
        "canonicalId": "brutus",
        "displayRoot": "brutus",
        "meaning": "heavy, dull, raw, unrefined",
        "origin": "Latin",
        "pieRoot": "*gʷreh₂-"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "style, movement, or practice (noun suffix)"
      }
    ]
  },
  "patina": {
    "prefixes": [],
    "roots": [
      {
        "form": "patin",
        "canonicalId": "patere",
        "displayRoot": "patere / patina",
        "meaning": "shallow dish, pan; to lie open",
        "origin": "Latin",
        "pieRoot": "*peth₂-",
        "pieGroupId": "pie:peth"
      }
    ],
    "suffixes": [
      {
        "form": "-a",
        "meaning": "noun suffix"
      }
    ]
  },
  "juxtaposition": {
    "prefixes": [],
    "roots": [
      {
        "form": "juxta",
        "canonicalId": "iuxta",
        "displayRoot": "iuxta / iungere",
        "meaning": "near, beside, to join",
        "origin": "Latin",
        "pieRoot": "*yewg-",
        "pieGroupId": "pie:yewg"
      },
      {
        "form": "posit",
        "canonicalId": "ponere",
        "displayRoot": "ponere / posit-",
        "meaning": "to put, place, set down",
        "origin": "Latin",
        "pieRoot": "*po-s(i)nere"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "act, process, or state of (noun suffix)"
      }
    ]
  },
  "soliloquy": {
    "prefixes": [],
    "roots": [
      {
        "form": "soli",
        "canonicalId": "solus",
        "displayRoot": "solus / solari",
        "meaning": "alone, solitary; to console",
        "origin": "Latin",
        "pieRoot": "*solh₂-",
        "pieGroupId": "pie:solh"
      },
      {
        "form": "loqu",
        "canonicalId": "loqui",
        "displayRoot": "loqui / locut-",
        "meaning": "to speak, talk, utter",
        "origin": "Latin",
        "pieRoot": "*tolkʷ-",
        "pieGroupId": "pie:tolkw"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "act, result, or state of (noun suffix)"
      }
    ]
  },
  "vignette": {
    "prefixes": [],
    "roots": [
      {
        "form": "vign",
        "canonicalId": "vinum",
        "displayRoot": "vinum / vinea",
        "meaning": "wine, grapevine",
        "origin": "Latin",
        "pieRoot": "*wéyh₁-on-"
      }
    ],
    "suffixes": [
      {
        "form": "-ette",
        "meaning": "little, small (diminutive suffix)"
      }
    ]
  },
  "acquiesce": {
    "prefixes": [
      {
        "form": "ac-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward, intensive"
      }
    ],
    "roots": [
      {
        "form": "qui",
        "canonicalId": "quies",
        "displayRoot": "quies / quiescere",
        "meaning": "rest, quiet, calm, peace",
        "origin": "Latin",
        "pieRoot": "*kʷyeh₁-",
        "pieGroupId": "pie:kwyeh"
      }
    ],
    "suffixes": [
      {
        "form": "-esce",
        "meaning": "to begin to, become (inchoative verb suffix)"
      }
    ]
  },
  "admonish": {
    "prefixes": [
      {
        "form": "ad-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward"
      }
    ],
    "roots": [
      {
        "form": "mon",
        "canonicalId": "monere",
        "displayRoot": "monere / monstr-",
        "meaning": "to warn, remind, point out",
        "origin": "Latin",
        "pieRoot": "*men-",
        "pieGroupId": "pie:men-mind"
      }
    ],
    "suffixes": [
      {
        "form": "-ish",
        "meaning": "to do, make, cause (verb suffix)"
      }
    ]
  },
  "affective": {
    "prefixes": [
      {
        "form": "af-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward"
      }
    ],
    "roots": [
      {
        "form": "fect",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dʰeh₁-",
        "pieGroupId": "pie:dheh"
      }
    ],
    "suffixes": [
      {
        "form": "-ive",
        "meaning": "tending to, having the nature of (adjective suffix)"
      }
    ]
  },
  "alacrity": {
    "prefixes": [],
    "roots": [
      {
        "form": "alacr",
        "canonicalId": "alacer",
        "displayRoot": "alacer",
        "meaning": "lively, brisk, eager",
        "origin": "Latin",
        "pieRoot": "*h₂el-"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or quality (noun suffix)"
      }
    ]
  },
  "amorphous": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-a",
        "meaning": "without, lacking, not"
      }
    ],
    "roots": [
      {
        "form": "morph",
        "canonicalId": "morphe",
        "displayRoot": "morphē: form, shape, structure",
        "meaning": "form, shape, structure",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of, characterized by (adjective suffix)"
      }
    ]
  },
  "anachronistic": {
    "prefixes": [
      {
        "form": "ana-",
        "canonicalId": "prefix-ana",
        "meaning": "back, against, backward"
      }
    ],
    "roots": [
      {
        "form": "chron",
        "canonicalId": "chronos",
        "displayRoot": "khronos / chronos",
        "meaning": "time, era, duration",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-istic",
        "meaning": "pertaining to, characterized by (adjective suffix)"
      }
    ]
  },
  "antecedent": {
    "prefixes": [
      {
        "form": "ante-",
        "canonicalId": "prefix-ante",
        "meaning": "before"
      }
    ],
    "roots": [
      {
        "form": "ced",
        "canonicalId": "cedere",
        "displayRoot": "cedere / cess-",
        "meaning": "to go, yield, withdraw",
        "origin": "Latin",
        "pieRoot": "*ked-",
        "pieGroupId": "pie:ked"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "performing an action, being (adjective/noun)"
      }
    ]
  },
  "antipathy": {
    "prefixes": [
      {
        "form": "anti-",
        "canonicalId": "prefix-anti",
        "meaning": "against, opposite"
      }
    ],
    "roots": [
      {
        "form": "path",
        "canonicalId": "pathos",
        "displayRoot": "pathos / paskhein",
        "meaning": "feeling, suffering, passion",
        "origin": "Greek",
        "pieRoot": "*kwh-ent(h)-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "antithesis": {
    "prefixes": [
      {
        "form": "anti-",
        "canonicalId": "prefix-anti",
        "meaning": "against, opposite"
      }
    ],
    "roots": [
      {
        "form": "thes",
        "canonicalId": "tithenai",
        "displayRoot": "tithenai / thesis",
        "meaning": "to put, place, set down",
        "origin": "Greek",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": [
      {
        "form": "-is",
        "meaning": "abstract noun suffix"
      }
    ]
  },
  "aphorism": {
    "prefixes": [
      {
        "form": "aph-",
        "canonicalId": "prefix-apo",
        "meaning": "away from, forth, completely"
      }
    ],
    "roots": [
      {
        "form": "or",
        "canonicalId": "horos",
        "displayRoot": "horos / horizein",
        "meaning": "boundary, limit",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "doctrine, state, or expression (noun)"
      }
    ]
  },
  "aplomb": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward, according to"
      }
    ],
    "roots": [
      {
        "form": "plomb",
        "canonicalId": "plumbum",
        "displayRoot": "plumbum",
        "meaning": "lead, plumb weight",
        "origin": "Latin"
      }
    ],
    "suffixes": []
  },
  "apocryphal": {
    "prefixes": [
      {
        "form": "apo-",
        "canonicalId": "prefix-apo",
        "meaning": "away from, forth"
      }
    ],
    "roots": [
      {
        "form": "cryph",
        "canonicalId": "kryptein",
        "displayRoot": "kryptein / kryptos",
        "meaning": "to hide, conceal, vault",
        "origin": "Greek",
        "pieRoot": "*krewp-"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "ardent": {
    "prefixes": [],
    "roots": [
      {
        "form": "ard",
        "canonicalId": "ardere",
        "displayRoot": "fervere / ardere / ebullire",
        "meaning": "to burn, glow, boil, bubble up",
        "origin": "Latin",
        "pieRoot": "*h₁es-",
        "pieGroupId": "pie:hes"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "performing an action, being (adjective)"
      }
    ]
  },
  "ascetic": {
    "prefixes": [],
    "roots": [
      {
        "form": "ascet",
        "canonicalId": "askein",
        "displayRoot": "askein / askēsis",
        "meaning": "to exercise, train, practice",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "attenuate": {
    "prefixes": [
      {
        "form": "at-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward, completely"
      }
    ],
    "roots": [
      {
        "form": "tenu",
        "canonicalId": "tenuis",
        "displayRoot": "tenuis",
        "meaning": "thin, fine, slender, weak",
        "origin": "Latin",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause (verb)"
      }
    ]
  },
  "auspicious": {
    "prefixes": [],
    "roots": [
      {
        "form": "au-",
        "canonicalId": "avis",
        "displayRoot": "avis",
        "meaning": "bird",
        "origin": "Latin",
        "pieRoot": "*h₂ewi-"
      },
      {
        "form": "spic",
        "canonicalId": "specere",
        "displayRoot": "specere / spect-",
        "meaning": "to look at, observe, behold",
        "origin": "Latin",
        "pieRoot": "*spek-",
        "pieGroupId": "pie:spek"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "having the quality of, full of (adjective)"
      }
    ]
  },
  "beguiling": {
    "prefixes": [
      {
        "form": "be-",
        "canonicalId": "prefix-un",
        "meaning": "intensive, thoroughly, make"
      }
    ],
    "roots": [
      {
        "form": "guil",
        "canonicalId": "wigila",
        "displayRoot": "wigila / guile",
        "meaning": "trick, deceit, wile",
        "origin": "Germanic",
        "pieRoot": "*weik-",
        "pieGroupId": "pie:weik"
      }
    ],
    "suffixes": [
      {
        "form": "-ing",
        "meaning": "causing, performing an action (adjective/participle)"
      }
    ]
  },
  "bereft": {
    "prefixes": [
      {
        "form": "be-",
        "canonicalId": "prefix-un",
        "meaning": "intensive, thoroughly, away"
      }
    ],
    "roots": [
      {
        "form": "ref",
        "canonicalId": "reafian",
        "displayRoot": "rēafian / reave",
        "meaning": "to rob, plunder, strip",
        "origin": "Old English",
        "pieRoot": "*h₁rewp-"
      }
    ],
    "suffixes": [
      {
        "form": "-t",
        "meaning": "past participle ending"
      }
    ]
  },
  "bombastic": {
    "prefixes": [],
    "roots": [
      {
        "form": "bombast",
        "canonicalId": "bombyx",
        "displayRoot": "bombyx / bombax",
        "meaning": "silkworm, cotton padding, stuffing",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, characterized by (adjective)"
      }
    ]
  },
  "burgeon": {
    "prefixes": [],
    "roots": [
      {
        "form": "burgeon",
        "canonicalId": "burjan",
        "displayRoot": "burjan / burjon",
        "meaning": "to raise, push upward, bud",
        "origin": "Germanic",
        "pieRoot": "*bher-",
        "pieGroupId": "pie:bher"
      }
    ],
    "suffixes": []
  },
  "cajole": {
    "prefixes": [],
    "roots": [
      {
        "form": "cajol",
        "canonicalId": "cajoler",
        "displayRoot": "cajoler",
        "meaning": "to chatter, coax, wheedle",
        "origin": "French"
      }
    ],
    "suffixes": []
  },
  "carouse": {
    "prefixes": [],
    "roots": [
      {
        "form": "gar",
        "canonicalId": "gar",
        "displayRoot": "gar",
        "meaning": "all, completely",
        "origin": "German"
      },
      {
        "form": "ouse",
        "canonicalId": "aus",
        "displayRoot": "aus",
        "meaning": "out, empty",
        "origin": "German",
        "pieRoot": "*ud-"
      }
    ],
    "suffixes": []
  },
  "castigate": {
    "prefixes": [],
    "roots": [
      {
        "form": "cast",
        "canonicalId": "castus",
        "displayRoot": "castus / castigare: pure, chaste; to correct, purify",
        "meaning": "pure, chaste",
        "origin": "Latin",
        "pieRoot": "*kes-",
        "pieGroupId": "pie:kes"
      },
      {
        "form": "ig",
        "canonicalId": "agere",
        "displayRoot": "agere / act-",
        "meaning": "to drive, set in motion, act",
        "origin": "Latin",
        "pieRoot": "*heg-",
        "pieGroupId": "pie:heg"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause (verb)"
      }
    ]
  },
  "cavort": {
    "prefixes": [],
    "roots": [
      {
        "form": "curv",
        "canonicalId": "curvus",
        "displayRoot": "curvus",
        "meaning": "curved, bent, winding",
        "origin": "Latin",
        "pieRoot": "*sker-",
        "pieGroupId": "pie:sker"
      }
    ],
    "suffixes": []
  },
  "chagrin": {
    "prefixes": [],
    "roots": [
      {
        "form": "chagrin",
        "canonicalId": "sagri",
        "displayRoot": "sağrı / shagreen",
        "meaning": "rough leather, distress, sorrow",
        "origin": "Turkish"
      }
    ],
    "suffixes": []
  },
  "circumscribe": {
    "prefixes": [
      {
        "form": "circum-",
        "canonicalId": "prefix-trans",
        "meaning": "around"
      }
    ],
    "roots": [
      {
        "form": "scribe",
        "canonicalId": "scribere",
        "displayRoot": "scribere / script-",
        "meaning": "to write, inscribe, record",
        "origin": "Latin",
        "pieRoot": "*skreibh-"
      }
    ],
    "suffixes": []
  },
  "clamorous": {
    "prefixes": [],
    "roots": [
      {
        "form": "clam",
        "canonicalId": "clamare",
        "displayRoot": "clamare",
        "meaning": "to cry out, shout, proclaim",
        "origin": "Latin",
        "pieRoot": "*kele-",
        "pieGroupId": "pie:kele"
      }
    ],
    "suffixes": [
      {
        "form": "-or",
        "meaning": "state or condition (noun)"
      },
      {
        "form": "-ous",
        "meaning": "full of, having the quality of (adjective)"
      }
    ]
  },
  "coalesce": {
    "prefixes": [
      {
        "form": "co-",
        "canonicalId": "prefix-com",
        "meaning": "together, with"
      }
    ],
    "roots": [
      {
        "form": "alesc",
        "canonicalId": "alescere",
        "displayRoot": "alescere / alere: to nourish, grow together",
        "meaning": "to nourish, grow together",
        "origin": "Latin",
        "pieRoot": "*h₂el-",
        "pieGroupId": "pie:al-grow"
      }
    ],
    "suffixes": []
  },
  "coda": {
    "prefixes": [],
    "roots": [
      {
        "form": "coda",
        "canonicalId": "cauda",
        "displayRoot": "cauda",
        "meaning": "tail, trailing end",
        "origin": "Latin"
      }
    ],
    "suffixes": []
  },
  "cogent": {
    "prefixes": [
      {
        "form": "co-",
        "canonicalId": "prefix-com",
        "meaning": "together, completely"
      }
    ],
    "roots": [
      {
        "form": "g",
        "canonicalId": "agere",
        "displayRoot": "agere / act-",
        "meaning": "to drive, set in motion, act",
        "origin": "Latin",
        "pieRoot": "*heg-",
        "pieGroupId": "pie:heg"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "performing an action, driving (adjective)"
      }
    ]
  },
  "commensurate": {
    "prefixes": [
      {
        "form": "com-",
        "canonicalId": "prefix-com",
        "meaning": "together, with"
      }
    ],
    "roots": [
      {
        "form": "mensur",
        "canonicalId": "mensura",
        "displayRoot": "metiri / mensura: to measure, limit, proportion",
        "meaning": "to measure, limit, proportion",
        "origin": "Latin",
        "pieRoot": "*meh₁-",
        "pieGroupId": "pie:meh"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "having the quality of, characterized by (adjective)"
      }
    ]
  },
  "conciliatory": {
    "prefixes": [
      {
        "form": "con-",
        "canonicalId": "prefix-com",
        "meaning": "together, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "cili",
        "canonicalId": "calare",
        "displayRoot": "calare / concilium",
        "meaning": "to call, summon, assemble",
        "origin": "Latin",
        "pieRoot": "*kele-",
        "pieGroupId": "pie:kele"
      }
    ],
    "suffixes": [
      {
        "form": "-atory",
        "meaning": "tending to, serving for (adjective)"
      }
    ]
  },
  "convivial": {
    "prefixes": [
      {
        "form": "con-",
        "canonicalId": "prefix-com",
        "meaning": "with, together"
      }
    ],
    "roots": [
      {
        "form": "viv",
        "canonicalId": "vivere",
        "displayRoot": "vivere / vita: to live, life",
        "meaning": "to live, life",
        "origin": "Latin",
        "pieRoot": "*gwei-",
        "pieGroupId": "pie:gwei"
      }
    ],
    "suffixes": [
      {
        "form": "-ial",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "dearth": {
    "prefixes": [],
    "roots": [
      {
        "form": "dear",
        "canonicalId": "deore",
        "displayRoot": "dēore / dear",
        "meaning": "costly, precious, beloved",
        "origin": "Old English"
      }
    ],
    "suffixes": [
      {
        "form": "-th",
        "meaning": "state or condition (noun)"
      }
    ]
  },
  "debauchery": {
    "prefixes": [
      {
        "form": "de-",
        "canonicalId": "prefix-de",
        "meaning": "away, from, off"
      }
    ],
    "roots": [
      {
        "form": "bauch",
        "canonicalId": "balko",
        "displayRoot": "balko / bauch",
        "meaning": "beam, balk, wooden frame",
        "origin": "Frankish",
        "pieRoot": "*bhelg-",
        "pieGroupId": "pie:bhelg"
      }
    ],
    "suffixes": [
      {
        "form": "-ery",
        "meaning": "state, practice, or condition (noun)"
      }
    ]
  },
  "deign": {
    "prefixes": [],
    "roots": [
      {
        "form": "deign",
        "canonicalId": "dignus",
        "displayRoot": "dignus",
        "meaning": "worthy, fitting, suitable",
        "origin": "Latin",
        "pieRoot": "*deḱ-",
        "pieGroupId": "pie:dek"
      }
    ],
    "suffixes": []
  },
  "deleterious": {
    "prefixes": [],
    "roots": [
      {
        "form": "deleteri",
        "canonicalId": "deleisthai",
        "displayRoot": "dēleisthai / dēlētēr: to hurt, damage, destroy",
        "meaning": "harmful, noxious, destroying",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "demagogue": {
    "prefixes": [],
    "roots": [
      {
        "form": "dem",
        "canonicalId": "demos",
        "displayRoot": "dēmos: people, citizenry, district",
        "meaning": "people",
        "origin": "Greek",
        "pieRoot": "*da-mo-",
        "pieGroupId": "pie:damo"
      },
      {
        "form": "agogue",
        "canonicalId": "agein",
        "displayRoot": "agein / agōgos: to lead, guide, drive",
        "meaning": "leader, leading",
        "origin": "Greek",
        "pieRoot": "*aǵ-",
        "pieGroupId": "pie:ag"
      }
    ],
    "suffixes": []
  },
  "demure": {
    "prefixes": [
      {
        "form": "de-",
        "canonicalId": "prefix-de",
        "meaning": "completely, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "mure",
        "canonicalId": "morari",
        "displayRoot": "morari / mos: to delay, linger; custom, manner",
        "meaning": "to linger, delay, stay",
        "origin": "Latin",
        "pieRoot": "*(s)mer-",
        "pieGroupId": "pie:smer"
      }
    ],
    "suffixes": []
  },
  "diffident": {
    "prefixes": [
      {
        "form": "dif-",
        "canonicalId": "prefix-dis",
        "meaning": "apart, away, not"
      }
    ],
    "roots": [
      {
        "form": "fid",
        "canonicalId": "fidere",
        "displayRoot": "fidere / fides: to trust, faith, loyalty",
        "meaning": "to trust, believe",
        "origin": "Latin",
        "pieRoot": "*bheidh-",
        "pieGroupId": "pie:bheidh"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "one who or that which; being (adjective)"
      }
    ]
  },
  "dilettante": {
    "prefixes": [],
    "roots": [
      {
        "form": "dilett",
        "canonicalId": "delectare",
        "displayRoot": "delectare / deliciae: to allure, charm, delight",
        "meaning": "to delight, charm",
        "origin": "Latin",
        "pieRoot": "*lak-",
        "pieGroupId": "pie:lak"
      }
    ],
    "suffixes": [
      {
        "form": "-ante",
        "meaning": "present participle ending (Italian)"
      }
    ]
  },
  "edifice": {
    "prefixes": [],
    "roots": [
      {
        "form": "edi",
        "canonicalId": "aedes",
        "displayRoot": "aedes: hearth, temple, dwelling",
        "meaning": "dwelling, hearth, building",
        "origin": "Latin",
        "pieRoot": "*h₁eydh-"
      },
      {
        "form": "fice",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-: to make, do, fashion",
        "meaning": "to make, build",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": []
  },
  "egregious": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth, from"
      }
    ],
    "roots": [
      {
        "form": "greg",
        "canonicalId": "grex",
        "displayRoot": "grex / greg-: flock, herd, gathering",
        "meaning": "flock, herd",
        "origin": "Latin",
        "pieRoot": "*ger-",
        "pieGroupId": "pie:ger"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "having the quality of, full of (adjective)"
      }
    ]
  },
  "enmity": {
    "prefixes": [
      {
        "form": "en-",
        "canonicalId": "prefix-in",
        "meaning": "not, un-"
      }
    ],
    "roots": [
      {
        "form": "m",
        "canonicalId": "amicus",
        "displayRoot": "amare / amicus: to love, friend (inimicus: enemy)",
        "meaning": "friend, love",
        "origin": "Latin",
        "pieRoot": "*kamo-"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "ephemeral": {
    "prefixes": [
      {
        "form": "ep-",
        "canonicalId": "prefix-epi",
        "meaning": "upon, over, throughout"
      }
    ],
    "roots": [
      {
        "form": "hemer",
        "canonicalId": "hemera",
        "displayRoot": "hēmera: day",
        "meaning": "day",
        "origin": "Greek",
        "pieRoot": "*h₂mer-"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "relating to, pertaining to (adjective)"
      }
    ]
  },
  "eponymous": {
    "prefixes": [
      {
        "form": "ep-",
        "canonicalId": "prefix-epi",
        "meaning": "upon, over, beside"
      }
    ],
    "roots": [
      {
        "form": "onym",
        "canonicalId": "onyma",
        "displayRoot": "onoma / onyma: name, title",
        "meaning": "name, title",
        "origin": "Greek",
        "pieRoot": "*h₁no-mn-",
        "pieGroupId": "pie:hnomn"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "having the quality of (adjective)"
      }
    ]
  },
  "equanimity": {
    "prefixes": [],
    "roots": [
      {
        "form": "equ",
        "canonicalId": "aequus",
        "displayRoot": "aequus: equal, even, level, fair",
        "meaning": "equal, even",
        "origin": "Latin",
        "pieRoot": "*aykʷ-",
        "pieGroupId": "pie:aykw"
      },
      {
        "form": "anim",
        "canonicalId": "animus",
        "displayRoot": "animus / anima: soul, mind, spirit, breath",
        "meaning": "mind, spirit",
        "origin": "Latin",
        "pieRoot": "*ane-"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "equivocal": {
    "prefixes": [],
    "roots": [
      {
        "form": "equi",
        "canonicalId": "aequus",
        "displayRoot": "aequus: equal, even, level, fair",
        "meaning": "equal, even",
        "origin": "Latin",
        "pieRoot": "*aykʷ-",
        "pieGroupId": "pie:aykw"
      },
      {
        "form": "voc",
        "canonicalId": "vocare",
        "displayRoot": "vocare / vox: to call, voice",
        "meaning": "voice, to call",
        "origin": "Latin",
        "pieRoot": "*wekʷ-",
        "pieGroupId": "pie:wekw"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "pertaining to, relating to (adjective)"
      }
    ]
  },
  "erstwhile": {
    "prefixes": [],
    "roots": [
      {
        "form": "erst",
        "canonicalId": "aer-oe",
        "displayRoot": "ǣr: early, before",
        "meaning": "earliest, former",
        "origin": "Old English",
        "pieRoot": "*ayer-"
      },
      {
        "form": "while",
        "canonicalId": "hwil-oe",
        "displayRoot": "hwīl: time, period, space of time",
        "meaning": "time, period",
        "origin": "Old English",
        "pieRoot": "*kʷye-"
      }
    ],
    "suffixes": []
  },
  "esoteric": {
    "prefixes": [],
    "roots": [
      {
        "form": "esoter",
        "canonicalId": "eso",
        "displayRoot": "esō / esōteros: within, inner",
        "meaning": "inner, interior",
        "origin": "Greek",
        "pieRoot": "*en"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "expunge": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth, completely"
      }
    ],
    "roots": [
      {
        "form": "punge",
        "canonicalId": "pungere",
        "displayRoot": "pungere / punct-: to prick, pierce, sting",
        "meaning": "to prick, puncture",
        "origin": "Latin",
        "pieRoot": "*peug-"
      }
    ],
    "suffixes": []
  },
  "extol": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, up, forth"
      }
    ],
    "roots": [
      {
        "form": "tol",
        "canonicalId": "tollere",
        "displayRoot": "tollere: to raise, lift up",
        "meaning": "to lift, elevate",
        "origin": "Latin",
        "pieRoot": "*telh₂-",
        "pieGroupId": "pie:telh"
      }
    ],
    "suffixes": []
  },
  "fallacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "fallac",
        "canonicalId": "fallere",
        "displayRoot": "fallere / fals-: to deceive, disappoint, fail",
        "meaning": "to deceive, lead astray",
        "origin": "Latin",
        "pieRoot": "*dʰwel-",
        "pieGroupId": "pie:dhwel"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "having the quality of, full of (adjective)"
      }
    ]
  },
  "fastidious": {
    "prefixes": [],
    "roots": [
      {
        "form": "fastidi",
        "canonicalId": "fastidium",
        "displayRoot": "fastidium: disgust, squeamishness, disdain",
        "meaning": "disgust, squeamishness, aversion",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, having the quality of (adjective)"
      }
    ]
  },
  "feckless": {
    "prefixes": [],
    "roots": [
      {
        "form": "feck",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-: to make, do, fashion",
        "meaning": "effect, vigor, value",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": [
      {
        "form": "-less",
        "meaning": "lacking, without (adjective)"
      }
    ]
  },
  "fervent": {
    "prefixes": [],
    "roots": [
      {
        "form": "ferv",
        "canonicalId": "fervere",
        "displayRoot": "fervere",
        "meaning": "to boil, glow, be hot",
        "origin": "Latin",
        "pieRoot": "*bʰerw-",
        "pieGroupId": "pie:bherw"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "doing, being (adjective)"
      }
    ]
  },
  "forbearance": {
    "prefixes": [
      {
        "form": "for-",
        "canonicalId": "prefix-un",
        "meaning": "away, abstaining, off"
      }
    ],
    "roots": [
      {
        "form": "bear",
        "canonicalId": "beran-oe",
        "displayRoot": "beran / hef: to bear, carry, lift, endure",
        "meaning": "to endure, carry, hold",
        "origin": "Old English",
        "pieRoot": "*bher-",
        "pieGroupId": "pie:bher"
      }
    ],
    "suffixes": [
      {
        "form": "-ance",
        "meaning": "state, action, or process (noun)"
      }
    ]
  },
  "fornicate": {
    "prefixes": [],
    "roots": [
      {
        "form": "fornic",
        "canonicalId": "fornix",
        "displayRoot": "fornix: arch, vault, brothel",
        "meaning": "arch, vault, brothel",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to act upon, engage in (verb)"
      }
    ]
  },
  "furtive": {
    "prefixes": [],
    "roots": [
      {
        "form": "furt",
        "canonicalId": "fur",
        "displayRoot": "fur / furtum: thief; theft",
        "meaning": "thief, theft, stolen",
        "origin": "Latin",
        "pieRoot": "*bhor-"
      }
    ],
    "suffixes": [
      {
        "form": "-ive",
        "meaning": "tending to, given to (adjective)"
      }
    ]
  },
  "garrulous": {
    "prefixes": [],
    "roots": [
      {
        "form": "garr",
        "canonicalId": "garrire",
        "displayRoot": "garrire: to chatter, babble",
        "meaning": "to chatter, talk excessively",
        "origin": "Latin",
        "pieRoot": "*gar-"
      }
    ],
    "suffixes": [
      {
        "form": "-ulous",
        "meaning": "tending to, inclined to (adjective)"
      }
    ]
  },
  "hegemony": {
    "prefixes": [],
    "roots": [
      {
        "form": "hegemon",
        "canonicalId": "hegeisthai",
        "displayRoot": "hēgeisthai / hēgemōn: to lead; leader",
        "meaning": "leader, leadership, rule",
        "origin": "Greek",
        "pieRoot": "*saɡ-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state, condition, or quality (noun)"
      }
    ]
  },
  "iconoclast": {
    "prefixes": [],
    "roots": [
      {
        "form": "icono",
        "canonicalId": "eikon",
        "displayRoot": "eikōn: image, likeness",
        "meaning": "image, sacred likeness",
        "origin": "Greek",
        "pieRoot": "*weyk-",
        "pieGroupId": "pie:weyk"
      },
      {
        "form": "clast",
        "canonicalId": "klan",
        "displayRoot": "klan / klastēs: to break; breaker",
        "meaning": "to break, shatter",
        "origin": "Greek",
        "pieRoot": "*kelh₂-",
        "pieGroupId": "pie:kelh"
      }
    ],
    "suffixes": []
  },
  "ignominious": {
    "prefixes": [
      {
        "form": "ig-",
        "canonicalId": "prefix-in",
        "meaning": "not, lacking"
      }
    ],
    "roots": [
      {
        "form": "nomin",
        "canonicalId": "nomen",
        "displayRoot": "nomen: name, title, renown",
        "meaning": "name, reputation",
        "origin": "Latin",
        "pieRoot": "*h₁no-mn-",
        "pieGroupId": "pie:hnomn"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "characterized by, full of (adjective)"
      }
    ]
  },
  "incontinent": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not, lacking"
      },
      {
        "form": "con-",
        "canonicalId": "prefix-com",
        "meaning": "together, completely"
      }
    ],
    "roots": [
      {
        "form": "tin",
        "canonicalId": "tenere",
        "displayRoot": "tenere / tent-: to hold, keep, grasp",
        "meaning": "to hold, contain",
        "origin": "Latin",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "being, inclined to (adjective)"
      }
    ]
  },
  "indomitable": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not, un-"
      }
    ],
    "roots": [
      {
        "form": "domit",
        "canonicalId": "domus",
        "displayRoot": "domus / dominus: house, home, master, tame",
        "meaning": "to tame, subdue",
        "origin": "Latin",
        "pieRoot": "*demh₂-",
        "pieGroupId": "pie:demh"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of being (adjective)"
      }
    ]
  },
  "ineffable": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not, un-"
      },
      {
        "form": "ef-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth"
      }
    ],
    "roots": [
      {
        "form": "fa",
        "canonicalId": "fari",
        "displayRoot": "fari / fat-: to speak, utter (fas: divine law)",
        "meaning": "to speak, utter",
        "origin": "Latin",
        "pieRoot": "*bha-",
        "pieGroupId": "pie:bha"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of being (adjective)"
      }
    ]
  },
  "inexorable": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not"
      },
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out, forth"
      }
    ],
    "roots": [
      {
        "form": "or",
        "canonicalId": "orare",
        "displayRoot": "orare / os",
        "meaning": "to speak, plead, pray",
        "origin": "Latin",
        "pieRoot": "*ōr-"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of being"
      }
    ]
  },
  "infidel": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not"
      }
    ],
    "roots": [
      {
        "form": "fidel",
        "canonicalId": "fidere",
        "displayRoot": "fidere / fides",
        "meaning": "faithful, faith, trust",
        "origin": "Latin",
        "pieRoot": "*bheidh-",
        "pieGroupId": "pie:bheidh"
      }
    ],
    "suffixes": []
  },
  "inure": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "in, into (from Anglo-French en)"
      }
    ],
    "roots": [
      {
        "form": "ure",
        "canonicalId": "opus",
        "displayRoot": "opus / opera",
        "meaning": "work, practice",
        "origin": "Latin",
        "pieRoot": "*op-"
      }
    ],
    "suffixes": []
  },
  "inveterate": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "in, into, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "veter",
        "canonicalId": "vetus",
        "displayRoot": "vetus / veteris",
        "meaning": "old, aged",
        "origin": "Latin",
        "pieRoot": "*wetos-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "having the quality of (adjective)"
      }
    ]
  },
  "jingoism": {
    "prefixes": [],
    "roots": [
      {
        "form": "jingo",
        "canonicalId": "jingo",
        "displayRoot": "jingo",
        "meaning": "by Jingo (mild oath / bellicose patriot)",
        "origin": "English"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "doctrine, belief, practice"
      }
    ]
  },
  "juxtapose": {
    "prefixes": [],
    "roots": [
      {
        "form": "juxta",
        "canonicalId": "iuxta",
        "displayRoot": "iuxta / iungere",
        "meaning": "near, beside",
        "origin": "Latin",
        "pieRoot": "*yewg-",
        "pieGroupId": "pie:yewg"
      },
      {
        "form": "pose",
        "canonicalId": "ponere",
        "displayRoot": "ponere / poser",
        "meaning": "to place, put",
        "origin": "Latin",
        "pieRoot": "*apo- + *dhe-"
      }
    ],
    "suffixes": []
  },
  "lecherous": {
    "prefixes": [],
    "roots": [
      {
        "form": "lecher",
        "canonicalId": "likkon",
        "displayRoot": "lechier / *likkon",
        "meaning": "to lick, glutton, dissolute person",
        "origin": "Old French",
        "pieRoot": "*leigh-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, having the quality of"
      }
    ]
  },
  "misanthrope": {
    "prefixes": [],
    "roots": [
      {
        "form": "mis",
        "canonicalId": "misein",
        "displayRoot": "misein",
        "meaning": "to hate",
        "origin": "Greek"
      },
      {
        "form": "anthrope",
        "canonicalId": "anthropos",
        "displayRoot": "anthrōpos",
        "meaning": "human being, mankind",
        "origin": "Greek"
      }
    ],
    "suffixes": []
  },
  "myopic": {
    "prefixes": [],
    "roots": [
      {
        "form": "my",
        "canonicalId": "myein",
        "displayRoot": "myein",
        "meaning": "to close, shut",
        "origin": "Greek",
        "pieRoot": "*mew-",
        "pieGroupId": "pie:mew"
      },
      {
        "form": "op",
        "canonicalId": "ops",
        "displayRoot": "ōps / optikos",
        "meaning": "eye, sight",
        "origin": "Greek",
        "pieRoot": "*okw-",
        "pieGroupId": "pie:okw"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to"
      }
    ]
  },
  "neophyte": {
    "prefixes": [],
    "roots": [
      {
        "form": "neo",
        "canonicalId": "neos",
        "displayRoot": "neos",
        "meaning": "new, young",
        "origin": "Greek",
        "pieRoot": "*newo-",
        "pieGroupId": "pie:newo"
      },
      {
        "form": "phyte",
        "canonicalId": "phyton",
        "displayRoot": "phyton / phyein",
        "meaning": "plant, to grow, bring forth",
        "origin": "Greek",
        "pieRoot": "*bhewe-"
      }
    ],
    "suffixes": []
  },
  "obfuscate": {
    "prefixes": [
      {
        "form": "ob-",
        "canonicalId": "prefix-ob",
        "meaning": "over, toward, completely"
      }
    ],
    "roots": [
      {
        "form": "fusc",
        "canonicalId": "fuscus",
        "displayRoot": "fuscus",
        "meaning": "dark, dusky",
        "origin": "Latin",
        "pieRoot": "*dhus-ko-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause to be (verb)"
      }
    ]
  },
  "oblique": {
    "prefixes": [
      {
        "form": "ob-",
        "canonicalId": "prefix-ob",
        "meaning": "toward, against"
      }
    ],
    "roots": [
      {
        "form": "lique",
        "canonicalId": "liquis",
        "displayRoot": "liquis",
        "meaning": "slanting, sideways, bent",
        "origin": "Latin",
        "pieRoot": "*wleik-"
      }
    ],
    "suffixes": []
  },
  "ostensible": {
    "prefixes": [
      {
        "form": "ob-",
        "canonicalId": "prefix-ob",
        "meaning": "in front of, before"
      }
    ],
    "roots": [
      {
        "form": "tens",
        "canonicalId": "tendere",
        "displayRoot": "tendere / tent-",
        "meaning": "to stretch, show, extend",
        "origin": "Latin",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": [
      {
        "form": "-ible",
        "meaning": "able to be"
      }
    ]
  },
  "panacea": {
    "prefixes": [
      {
        "form": "pan-",
        "canonicalId": "pan",
        "meaning": "all, every"
      }
    ],
    "roots": [
      {
        "form": "ace",
        "canonicalId": "akos",
        "displayRoot": "akos / akeomai",
        "meaning": "cure, remedy",
        "origin": "Greek",
        "pieRoot": "*yēk-"
      }
    ],
    "suffixes": [
      {
        "form": "-a",
        "meaning": "noun suffix"
      }
    ]
  },
  "pantheon": {
    "prefixes": [
      {
        "form": "pan-",
        "canonicalId": "pan",
        "meaning": "all"
      }
    ],
    "roots": [
      {
        "form": "theon",
        "canonicalId": "theos",
        "displayRoot": "theos",
        "meaning": "god, divine being",
        "origin": "Greek",
        "pieRoot": "*dhes-",
        "pieGroupId": "pie:dhes"
      }
    ],
    "suffixes": []
  },
  "paragon": {
    "prefixes": [
      {
        "form": "para-",
        "canonicalId": "prefix-para",
        "meaning": "beside, alongside"
      }
    ],
    "roots": [
      {
        "form": "gon",
        "canonicalId": "akone",
        "displayRoot": "akonē",
        "meaning": "whetstone, touchstone",
        "origin": "Greek",
        "pieRoot": "*ak-",
        "pieGroupId": "pie:ak"
      }
    ],
    "suffixes": []
  },
  "pastiche": {
    "prefixes": [],
    "roots": [
      {
        "form": "past",
        "canonicalId": "paste",
        "displayRoot": "pastē / pasticium",
        "meaning": "paste, barley porridge, mixed dish",
        "origin": "Greek",
        "pieRoot": "*kwas-"
      }
    ],
    "suffixes": [
      {
        "form": "-iche",
        "meaning": "noun suffix (diminutive/character)"
      }
    ]
  },
  "pejorative": {
    "prefixes": [],
    "roots": [
      {
        "form": "pejor",
        "canonicalId": "pejor",
        "displayRoot": "pejor",
        "meaning": "worse",
        "origin": "Latin",
        "pieRoot": "*ped-yos-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "verbal forming element"
      },
      {
        "form": "-ive",
        "meaning": "tending to, serving to"
      }
    ]
  },
  "petulant": {
    "prefixes": [],
    "roots": [
      {
        "form": "petul",
        "canonicalId": "petere",
        "displayRoot": "petere / petit-",
        "meaning": "to seek, attack, rush at",
        "origin": "Latin",
        "pieRoot": "*pet-",
        "pieGroupId": "pie:pet"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "characterized by (participial adjective)"
      }
    ]
  },
  "pith": {
    "prefixes": [],
    "roots": [
      {
        "form": "pith",
        "canonicalId": "pitha",
        "displayRoot": "pitha",
        "meaning": "pith, marrow, essential core",
        "origin": "Old English",
        "pieRoot": "*bheydh-",
        "pieGroupId": "pie:bheydh"
      }
    ],
    "suffixes": []
  },
  "platitude": {
    "prefixes": [],
    "roots": [
      {
        "form": "plat",
        "canonicalId": "platys",
        "displayRoot": "platys",
        "meaning": "flat, broad, wide",
        "origin": "Greek",
        "pieRoot": "*plat-"
      }
    ],
    "suffixes": [
      {
        "form": "-itude",
        "meaning": "state, quality, or condition of"
      }
    ]
  },
  "ponderous": {
    "prefixes": [],
    "roots": [
      {
        "form": "ponder",
        "canonicalId": "pendere",
        "displayRoot": "pendere / pondus",
        "meaning": "weight, heaviness",
        "origin": "Latin",
        "pieRoot": "*spend-",
        "pieGroupId": "pie:spend"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, having the quality of"
      }
    ]
  },
  "portent": {
    "prefixes": [
      {
        "form": "pro-",
        "canonicalId": "prefix-pre",
        "meaning": "forth, forward, before (archaic Latin port-)"
      }
    ],
    "roots": [
      {
        "form": "tent",
        "canonicalId": "tendere",
        "displayRoot": "tendere / tent-",
        "meaning": "to stretch, reach, extend",
        "origin": "Latin",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": []
  },
  "precipitous": {
    "prefixes": [
      {
        "form": "prae-",
        "canonicalId": "prefix-pre",
        "meaning": "before, forth"
      }
    ],
    "roots": [
      {
        "form": "cipiti",
        "canonicalId": "caput",
        "displayRoot": "caput",
        "meaning": "head",
        "origin": "Latin",
        "pieRoot": "*kaput-",
        "pieGroupId": "pie:kaput"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, characterized by"
      }
    ]
  },
  "presage": {
    "prefixes": [
      {
        "form": "pre-",
        "canonicalId": "prefix-pre",
        "meaning": "before, beforehand"
      }
    ],
    "roots": [
      {
        "form": "sage",
        "canonicalId": "sagire",
        "displayRoot": "sagire / sagax",
        "meaning": "to perceive keenly, scent",
        "origin": "Latin",
        "pieRoot": "*sag-"
      }
    ],
    "suffixes": []
  },
  "prosaic": {
    "prefixes": [
      {
        "form": "pro-",
        "canonicalId": "prefix-pre",
        "meaning": "forward"
      }
    ],
    "roots": [
      {
        "form": "sa",
        "canonicalId": "vertere",
        "displayRoot": "vertere / vers-",
        "meaning": "to turn (proversus: turned straight ahead)",
        "origin": "Latin",
        "pieRoot": "*wer-t-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, of the nature of"
      }
    ]
  },
  "quandary": {
    "prefixes": [],
    "roots": [
      {
        "form": "quandary",
        "canonicalId": "quandary",
        "displayRoot": "quando?",
        "meaning": "state of perplexity (perhaps from Latin quando 'when?')",
        "origin": "Latin",
        "pieRoot": "*kwo-",
        "pieGroupId": "pie:kwo"
      }
    ],
    "suffixes": []
  },
  "quantum": {
    "prefixes": [],
    "roots": [
      {
        "form": "quant",
        "canonicalId": "quantus",
        "displayRoot": "quantus",
        "meaning": "how much, how great",
        "origin": "Latin",
        "pieRoot": "*kwo-",
        "pieGroupId": "pie:kwo"
      }
    ],
    "suffixes": [
      {
        "form": "-um",
        "meaning": "neuter nominal suffix"
      }
    ]
  },
  "quixotic": {
    "prefixes": [],
    "roots": [
      {
        "form": "quixot",
        "canonicalId": "quijote",
        "displayRoot": "Quijote / cuisse",
        "meaning": "Don Quixote (literally thigh-armor)",
        "origin": "Spanish",
        "pieRoot": "*koksa-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, having the characteristics of"
      }
    ]
  },
  "rancor": {
    "prefixes": [],
    "roots": [
      {
        "form": "ranc",
        "canonicalId": "rancere",
        "displayRoot": "rancere / rancor",
        "meaning": "to stink, be rank or rotten",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-or",
        "meaning": "state or condition (abstract noun)"
      }
    ]
  },
  "rapt": {
    "prefixes": [],
    "roots": [
      {
        "form": "rapt",
        "canonicalId": "rapere",
        "displayRoot": "rapere / rapt-",
        "meaning": "to seize, snatch, carry off",
        "origin": "Latin",
        "pieRoot": "*h₁rep-",
        "pieGroupId": "pie:hrep"
      }
    ],
    "suffixes": []
  },
  "rarefied": {
    "prefixes": [],
    "roots": [
      {
        "form": "rare",
        "canonicalId": "rarus",
        "displayRoot": "rarus",
        "meaning": "rare, thin, loose",
        "origin": "Latin",
        "pieRoot": "*er-"
      },
      {
        "form": "fi",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": [
      {
        "form": "-ed",
        "meaning": "having the quality of, made into (participial adjective)"
      }
    ]
  },
  "replete": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "again, completely"
      }
    ],
    "roots": [
      {
        "form": "plete",
        "canonicalId": "plenus",
        "displayRoot": "plenus / plere",
        "meaning": "full, to fill, fulfill",
        "origin": "Latin",
        "pieRoot": "*pleh₁-",
        "pieGroupId": "pie:pleh"
      }
    ],
    "suffixes": []
  },
  "reticent": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "again, intensive, back"
      }
    ],
    "roots": [
      {
        "form": "tic",
        "canonicalId": "tacere",
        "displayRoot": "tacere",
        "meaning": "to be silent",
        "origin": "Latin",
        "pieRoot": "*tak-",
        "pieGroupId": "pie:tak"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "performing action, being (adjective)"
      }
    ]
  },
  "salutary": {
    "prefixes": [],
    "roots": [
      {
        "form": "salut",
        "canonicalId": "salus",
        "displayRoot": "salus / salut-",
        "meaning": "health, safety, greeting",
        "origin": "Latin",
        "pieRoot": "*solh₂-",
        "pieGroupId": "pie:solh"
      }
    ],
    "suffixes": [
      {
        "form": "-ary",
        "meaning": "pertaining to, relating to (adjective)"
      }
    ]
  },
  "sanguine": {
    "prefixes": [],
    "roots": [
      {
        "form": "sanguin",
        "canonicalId": "sanguis",
        "displayRoot": "sanguis",
        "meaning": "blood, kinship, vitality",
        "origin": "Latin",
        "pieRoot": "*eshr-",
        "pieGroupId": "pie:eshr"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "adjectival ending"
      }
    ]
  },
  "satiate": {
    "prefixes": [],
    "roots": [
      {
        "form": "sati",
        "canonicalId": "satis",
        "displayRoot": "satis",
        "meaning": "enough, sufficient",
        "origin": "Latin",
        "pieRoot": "*seh₂-",
        "pieGroupId": "pie:seh"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to cause, make (verb)"
      }
    ]
  },
  "schadenfreude": {
    "prefixes": [],
    "roots": [
      {
        "form": "schaden",
        "canonicalId": "schaden",
        "displayRoot": "Schaden",
        "meaning": "damage, harm, injury",
        "origin": "German",
        "pieRoot": "*skoth-"
      },
      {
        "form": "freude",
        "canonicalId": "freude",
        "displayRoot": "Freude",
        "meaning": "joy, pleasure",
        "origin": "German",
        "pieRoot": "*pri-"
      }
    ],
    "suffixes": []
  },
  "sidle": {
    "prefixes": [],
    "roots": [
      {
        "form": "sid",
        "canonicalId": "side",
        "displayRoot": "side",
        "meaning": "side, flank, slope",
        "origin": "English",
        "pieRoot": "*se-"
      }
    ],
    "suffixes": [
      {
        "form": "-le",
        "meaning": "frequentative or diminutive action (verb)"
      }
    ]
  },
  "skulk": {
    "prefixes": [],
    "roots": [
      {
        "form": "skulk",
        "canonicalId": "skulka",
        "displayRoot": "skulka / skulke",
        "meaning": "to lurk, shirk, hide",
        "origin": "Scandinavian",
        "pieRoot": "*skel-"
      }
    ],
    "suffixes": []
  },
  "slovenly": {
    "prefixes": [],
    "roots": [
      {
        "form": "sloven",
        "canonicalId": "sloven",
        "displayRoot": "sloof / sloven",
        "meaning": "careless, untidy person",
        "origin": "Dutch"
      }
    ],
    "suffixes": [
      {
        "form": "-ly",
        "meaning": "having the qualities of, manner (adjective/adverb)"
      }
    ]
  },
  "sojourn": {
    "prefixes": [
      {
        "form": "so-",
        "canonicalId": "prefix-sub",
        "meaning": "under, during"
      }
    ],
    "roots": [
      {
        "form": "journ",
        "canonicalId": "dies",
        "displayRoot": "dies / diurnus",
        "meaning": "day, daily light",
        "origin": "Latin",
        "pieRoot": "*dyeu-",
        "pieGroupId": "pie:dyeu"
      }
    ],
    "suffixes": []
  },
  "somatic": {
    "prefixes": [],
    "roots": [
      {
        "form": "somat",
        "canonicalId": "soma",
        "displayRoot": "sōma / sōmat-",
        "meaning": "body",
        "origin": "Greek",
        "pieRoot": "*tewh₂-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, relating to (adjective)"
      }
    ]
  },
  "soporific": {
    "prefixes": [],
    "roots": [
      {
        "form": "sopor",
        "canonicalId": "sopor",
        "displayRoot": "sopor",
        "meaning": "deep sleep",
        "origin": "Latin",
        "pieRoot": "*swep-",
        "pieGroupId": "pie:swep"
      },
      {
        "form": "fic",
        "canonicalId": "facere",
        "displayRoot": "facere / fect-",
        "meaning": "to make, do, fashion",
        "origin": "Latin",
        "pieRoot": "*dhe-",
        "pieGroupId": "pie:dhe"
      }
    ],
    "suffixes": []
  },
  "stolid": {
    "prefixes": [],
    "roots": [
      {
        "form": "stolid",
        "canonicalId": "stolidus",
        "displayRoot": "stolidus",
        "meaning": "dull, stupid, immovable",
        "origin": "Latin",
        "pieRoot": "*stel-",
        "pieGroupId": "pie:stel"
      }
    ],
    "suffixes": []
  },
  "sycophant": {
    "prefixes": [],
    "roots": [
      {
        "form": "syco",
        "canonicalId": "sykon",
        "displayRoot": "sykon",
        "meaning": "fig",
        "origin": "Greek"
      },
      {
        "form": "phant",
        "canonicalId": "phainein",
        "displayRoot": "phainein / phan-",
        "meaning": "to show, appear, bring to light",
        "origin": "Greek",
        "pieRoot": "*bheh₂-",
        "pieGroupId": "pie:bheh"
      }
    ],
    "suffixes": []
  },
  "tantamount": {
    "prefixes": [],
    "roots": [
      {
        "form": "tant",
        "canonicalId": "tantus",
        "displayRoot": "tantus",
        "meaning": "so much, so great",
        "origin": "Latin",
        "pieRoot": "*to-"
      },
      {
        "form": "mount",
        "canonicalId": "mons",
        "displayRoot": "mons / mont-",
        "meaning": "mountain, height, projection",
        "origin": "Latin",
        "pieRoot": "*men-",
        "pieGroupId": "pie:men-jut"
      }
    ],
    "suffixes": []
  },
  "tenuous": {
    "prefixes": [],
    "roots": [
      {
        "form": "tenu",
        "canonicalId": "tenuis",
        "displayRoot": "tenuis",
        "meaning": "thin, fine, slender, weak",
        "origin": "Latin",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "having the quality of, full of (adjective)"
      }
    ]
  },
  "torpid": {
    "prefixes": [],
    "roots": [
      {
        "form": "torp",
        "canonicalId": "torpere",
        "displayRoot": "torpere",
        "meaning": "to be numb, stiff, sluggish",
        "origin": "Latin",
        "pieRoot": "*ster-"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "state or condition of (adjective)"
      }
    ]
  },
  "treacle": {
    "prefixes": [],
    "roots": [
      {
        "form": "treacle",
        "canonicalId": "therion",
        "displayRoot": "thērion / thēr",
        "meaning": "wild beast, venomous animal",
        "origin": "Greek",
        "pieRoot": "*ghwer-"
      }
    ],
    "suffixes": []
  },
  "umbrage": {
    "prefixes": [],
    "roots": [
      {
        "form": "umbr",
        "canonicalId": "umbra",
        "displayRoot": "umbra",
        "meaning": "shadow, shade",
        "origin": "Latin",
        "pieRoot": "*andho-",
        "pieGroupId": "pie:andho"
      }
    ],
    "suffixes": [
      {
        "form": "-age",
        "meaning": "state, condition, or result of action (noun)"
      }
    ]
  },
  "unalloyed": {
    "prefixes": [
      {
        "form": "un-",
        "canonicalId": "prefix-un",
        "meaning": "not, reversal"
      },
      {
        "form": "al-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward"
      }
    ],
    "roots": [
      {
        "form": "loy",
        "canonicalId": "ligare",
        "displayRoot": "ligare",
        "meaning": "to bind, tie, unite",
        "origin": "Latin",
        "pieRoot": "*leyg-"
      }
    ],
    "suffixes": [
      {
        "form": "-ed",
        "meaning": "participial ending forming adjective"
      }
    ]
  },
  "undulate": {
    "prefixes": [],
    "roots": [
      {
        "form": "undul",
        "canonicalId": "unda",
        "displayRoot": "unda",
        "meaning": "wave",
        "origin": "Latin",
        "pieRoot": "*wed-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause, characterized by (verb/adjective)"
      }
    ]
  },
  "untrodden": {
    "prefixes": [
      {
        "form": "un-",
        "canonicalId": "prefix-un",
        "meaning": "not, reversal"
      }
    ],
    "roots": [
      {
        "form": "trodd",
        "canonicalId": "tredan",
        "displayRoot": "tredan",
        "meaning": "to tread, step, trample",
        "origin": "Old English",
        "pieRoot": "*dred-"
      }
    ],
    "suffixes": [
      {
        "form": "-en",
        "meaning": "past participle suffix forming adjective"
      }
    ]
  },
  "vagary": {
    "prefixes": [],
    "roots": [
      {
        "form": "vagar",
        "canonicalId": "vagari",
        "displayRoot": "vagari / vagus",
        "meaning": "to wander, roam; wandering",
        "origin": "Latin",
        "pieRoot": "*wag-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "quality, state, or condition (noun)"
      }
    ]
  },
  "vestigial": {
    "prefixes": [],
    "roots": [
      {
        "form": "vestigi",
        "canonicalId": "vestigium",
        "displayRoot": "vestigium",
        "meaning": "footprint, trace, track",
        "origin": "Latin",
        "pieRoot": "*steyg-"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "pertaining to, relating to (adjective)"
      }
    ]
  },
  "vitriol": {
    "prefixes": [],
    "roots": [
      {
        "form": "vitri",
        "canonicalId": "vitrum",
        "displayRoot": "vitrum",
        "meaning": "glass",
        "origin": "Latin",
        "pieRoot": "*kwoyd-"
      }
    ],
    "suffixes": [
      {
        "form": "-ol",
        "meaning": "diminutive suffix (noun)"
      }
    ]
  },
  "volition": {
    "prefixes": [],
    "roots": [
      {
        "form": "volit",
        "canonicalId": "velle",
        "displayRoot": "velle / vol-",
        "meaning": "to wish, will, desire",
        "origin": "Latin",
        "pieRoot": "*welh₁-",
        "pieGroupId": "pie:welh"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "act, state, or condition of (noun)"
      }
    ]
  },
  "wend": {
    "prefixes": [],
    "roots": [
      {
        "form": "wend",
        "canonicalId": "wendan",
        "displayRoot": "wendan",
        "meaning": "to turn, direct, go",
        "origin": "Old English",
        "pieRoot": "*wendh-"
      }
    ],
    "suffixes": []
  },
  "winsome": {
    "prefixes": [],
    "roots": [
      {
        "form": "win",
        "canonicalId": "wynn-oe",
        "displayRoot": "blīthe / fægen / wynn / myrgth",
        "meaning": "gladness, joy, charm, mirth",
        "origin": "Old English",
        "pieRoot": "*wenh₁-"
      }
    ],
    "suffixes": [
      {
        "form": "-some",
        "meaning": "characterized by, tending to (adjective)"
      }
    ]
  },
  "yokel": {
    "prefixes": [],
    "roots": [
      {
        "form": "yokel",
        "canonicalId": "yokel",
        "displayRoot": "yokel",
        "meaning": "green woodpecker; rustic countryman",
        "origin": "English"
      }
    ],
    "suffixes": []
  },
  "voluble": {
    "prefixes": [],
    "roots": [
      {
        "form": "volu",
        "canonicalId": "volvere",
        "displayRoot": "volvere / volut-",
        "meaning": "to roll, turn, wind",
        "origin": "Latin",
        "pieRoot": "*wel-",
        "pieGroupId": "pie:wel"
      }
    ],
    "suffixes": [
      {
        "form": "-ble",
        "meaning": "capable of, tending to (adjective)"
      }
    ]
  },
  "circadian": {
    "prefixes": [
      {
        "form": "circa-",
        "canonicalId": "prefix-trans",
        "meaning": "around, about"
      }
    ],
    "roots": [
      {
        "form": "di",
        "canonicalId": "dies",
        "displayRoot": "dies / diurnus",
        "meaning": "day, daily light",
        "origin": "Latin",
        "pieRoot": "*dyeu-",
        "pieGroupId": "pie:dyeu"
      }
    ],
    "suffixes": [
      {
        "form": "-an",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "autocracy": {
    "prefixes": [],
    "roots": [
      {
        "form": "auto",
        "canonicalId": "autos",
        "displayRoot": "autos",
        "meaning": "self, same, by oneself",
        "origin": "Greek"
      },
      {
        "form": "cracy",
        "canonicalId": "kratos",
        "displayRoot": "kratos",
        "meaning": "power, strength, rule",
        "origin": "Greek",
        "pieRoot": "*kret-",
        "pieGroupId": "pie:kret"
      }
    ],
    "suffixes": []
  },
  "filibuster": {
    "prefixes": [],
    "roots": [
      {
        "form": "filibuster",
        "canonicalId": "vrijbuiter",
        "displayRoot": "vrijbuiter",
        "meaning": "freebooter, plunderer",
        "origin": "Dutch"
      }
    ],
    "suffixes": []
  },
  "meritocracy": {
    "prefixes": [],
    "roots": [
      {
        "form": "merit",
        "canonicalId": "merere",
        "displayRoot": "merere / meritum",
        "meaning": "to earn, deserve, merit",
        "origin": "Latin",
        "pieRoot": "*(s)mer-",
        "pieGroupId": "pie:smer"
      },
      {
        "form": "cracy",
        "canonicalId": "kratos",
        "displayRoot": "kratos",
        "meaning": "power, strength, rule",
        "origin": "Greek",
        "pieRoot": "*kret-",
        "pieGroupId": "pie:kret"
      }
    ],
    "suffixes": []
  },
  "nepotism": {
    "prefixes": [],
    "roots": [
      {
        "form": "nepot",
        "canonicalId": "nepos",
        "displayRoot": "nepos / nepot-",
        "meaning": "nephew, grandchild",
        "origin": "Latin",
        "pieRoot": "*nepot-"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "practice, doctrine, or system (noun)"
      }
    ]
  },
  "oligarchy": {
    "prefixes": [],
    "roots": [
      {
        "form": "olig",
        "canonicalId": "oligos",
        "displayRoot": "oligos",
        "meaning": "few, little, scant",
        "origin": "Greek"
      },
      {
        "form": "archy",
        "canonicalId": "arkhe",
        "displayRoot": "arkhein / arkhē",
        "meaning": "to begin, lead, rule, first",
        "origin": "Greek",
        "pieRoot": "*h₂ergʰ-",
        "pieGroupId": "pie:hergh"
      }
    ],
    "suffixes": []
  },
  "acrid": {
    "prefixes": [],
    "roots": [
      {
        "form": "acr",
        "canonicalId": "acer",
        "displayRoot": "acer / acri-",
        "meaning": "sharp, biting, sour",
        "origin": "Latin",
        "pieRoot": "*h₂eḱ-"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "having the quality of (adjective)"
      }
    ]
  },
  "affable": {
    "prefixes": [
      {
        "form": "af-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward"
      }
    ],
    "roots": [
      {
        "form": "fa",
        "canonicalId": "fari",
        "displayRoot": "fari / fat-",
        "meaning": "to speak, utter",
        "origin": "Latin",
        "pieRoot": "*bʰeh₂-",
        "pieGroupId": "pie:bheh"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of, worthy of being (adjective)"
      }
    ]
  },
  "ambivalent": {
    "prefixes": [
      {
        "form": "ambi-",
        "canonicalId": "prefix-peri",
        "meaning": "both, around"
      }
    ],
    "roots": [
      {
        "form": "val",
        "canonicalId": "valere",
        "displayRoot": "valere / valent-",
        "meaning": "to be strong, healthy, worth",
        "origin": "Latin",
        "pieRoot": "*h₂welh₁-"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "being, characterized by (adjective)"
      }
    ]
  },
  "amiable": {
    "prefixes": [],
    "roots": [
      {
        "form": "am",
        "canonicalId": "amicus",
        "displayRoot": "amare / amicus",
        "meaning": "to love, friend",
        "origin": "Latin",
        "pieRoot": "*kam-"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "worthy of, capable of being (adjective)"
      }
    ]
  },
  "austere": {
    "prefixes": [],
    "roots": [
      {
        "form": "auster",
        "canonicalId": "austeros",
        "displayRoot": "austeros",
        "meaning": "harsh, rough, bitter, severe",
        "origin": "Greek",
        "pieRoot": "*saus-"
      }
    ],
    "suffixes": []
  },
  "balk": {
    "prefixes": [],
    "roots": [
      {
        "form": "balk",
        "canonicalId": "balca",
        "displayRoot": "balca",
        "meaning": "ridge, unplowed strip of land, obstacle",
        "origin": "Old English",
        "pieRoot": "*bʰelǵ-",
        "pieGroupId": "pie:bhelg"
      }
    ],
    "suffixes": []
  },
  "bequeath": {
    "prefixes": [
      {
        "form": "be-",
        "canonicalId": "prefix-un",
        "meaning": "about, intensive"
      }
    ],
    "roots": [
      {
        "form": "queath",
        "canonicalId": "cwethan",
        "displayRoot": "cweþan",
        "meaning": "to say, speak, declare",
        "origin": "Old English",
        "pieRoot": "*gʷet-"
      }
    ],
    "suffixes": []
  },
  "bilk": {
    "prefixes": [],
    "roots": [
      {
        "form": "bilk",
        "canonicalId": "bilk",
        "displayRoot": "bilk",
        "meaning": "to defraud, cheat, evade (variant of balk)",
        "origin": "English",
        "pieRoot": "*bʰelǵ-",
        "pieGroupId": "pie:bhelg"
      }
    ],
    "suffixes": []
  },
  "cacophony": {
    "prefixes": [],
    "roots": [
      {
        "form": "caco",
        "canonicalId": "kakos",
        "displayRoot": "kakos",
        "meaning": "bad, evil, harsh",
        "origin": "Greek",
        "pieRoot": "*kakka-"
      },
      {
        "form": "phon",
        "canonicalId": "phone",
        "displayRoot": "phōnē",
        "meaning": "sound, voice, tone",
        "origin": "Greek",
        "pieRoot": "*bʰeh₂-",
        "pieGroupId": "pie:bheh"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state or condition (noun)"
      }
    ]
  },
  "candor": {
    "prefixes": [],
    "roots": [
      {
        "form": "cand",
        "canonicalId": "candere",
        "displayRoot": "candere",
        "meaning": "to shine, be white, glow",
        "origin": "Latin",
        "pieRoot": "*kand-"
      }
    ],
    "suffixes": [
      {
        "form": "-or",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "capitulate": {
    "prefixes": [],
    "roots": [
      {
        "form": "capitul",
        "canonicalId": "caput",
        "displayRoot": "caput / capitulum",
        "meaning": "head, chapter, heading",
        "origin": "Latin",
        "pieRoot": "*kaput-",
        "pieGroupId": "pie:kaput"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to act upon, cause to become (verb)"
      }
    ]
  },
  "chauvinist": {
    "prefixes": [],
    "roots": [
      {
        "form": "chauvin",
        "canonicalId": "chauvin",
        "displayRoot": "Chauvin",
        "meaning": "Nicolas Chauvin (eponym for extreme devotion)",
        "origin": "French"
      }
    ],
    "suffixes": [
      {
        "form": "-ist",
        "meaning": "one who adheres to or practices (noun)"
      }
    ]
  },
  "clandestine": {
    "prefixes": [],
    "roots": [
      {
        "form": "clandestin",
        "canonicalId": "clam",
        "displayRoot": "clam / clandestinus",
        "meaning": "secretly, hidden, private",
        "origin": "Latin",
        "pieRoot": "*ḱel-",
        "pieGroupId": "pie:kel-cover"
      }
    ],
    "suffixes": []
  },
  "clemency": {
    "prefixes": [],
    "roots": [
      {
        "form": "clemen",
        "canonicalId": "clemens",
        "displayRoot": "clemens / clementia",
        "meaning": "mild, gentle, calm",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-cy",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "copious": {
    "prefixes": [],
    "roots": [
      {
        "form": "copi",
        "canonicalId": "copia",
        "displayRoot": "copia",
        "meaning": "plenty, abundance",
        "origin": "Latin",
        "pieRoot": "*h₃ep-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, having the quality of (adjective)"
      }
    ]
  },
  "cosmopolitan": {
    "prefixes": [],
    "roots": [
      {
        "form": "cosmo",
        "canonicalId": "kosmos",
        "displayRoot": "kosmos",
        "meaning": "world, universe, order",
        "origin": "Greek"
      },
      {
        "form": "polit",
        "canonicalId": "polis",
        "displayRoot": "polis / politēs",
        "meaning": "city-state, citizen, polity",
        "origin": "Greek",
        "pieRoot": "*pelh₁-",
        "pieGroupId": "pie:pelh"
      }
    ],
    "suffixes": [
      {
        "form": "-an",
        "meaning": "pertaining to or belonging to (adjective/noun)"
      }
    ]
  },
  "creed": {
    "prefixes": [],
    "roots": [
      {
        "form": "creed",
        "canonicalId": "credere",
        "displayRoot": "credere / cred-",
        "meaning": "to believe, trust, entrust",
        "origin": "Latin",
        "pieRoot": "*ḱred-dʰeh₁-"
      }
    ],
    "suffixes": []
  },
  "dissuade": {
    "prefixes": [
      {
        "form": "dis-",
        "canonicalId": "prefix-dis",
        "meaning": "away, apart, opposite of"
      }
    ],
    "roots": [
      {
        "form": "suade",
        "canonicalId": "suadere",
        "displayRoot": "suadere",
        "meaning": "to advise, urge, recommend",
        "origin": "Latin",
        "pieRoot": "*sweh₂d-",
        "pieGroupId": "pie:swehd"
      }
    ],
    "suffixes": []
  },
  "duress": {
    "prefixes": [],
    "roots": [
      {
        "form": "dur",
        "canonicalId": "durus",
        "displayRoot": "durus",
        "meaning": "hard, harsh, enduring",
        "origin": "Latin",
        "pieRoot": "*deru-",
        "pieGroupId": "pie:deru"
      }
    ],
    "suffixes": [
      {
        "form": "-ess",
        "meaning": "state or condition (noun)"
      }
    ]
  },
  "eclectic": {
    "prefixes": [
      {
        "form": "ec-",
        "canonicalId": "prefix-ex",
        "meaning": "out, forth, from"
      }
    ],
    "roots": [
      {
        "form": "lect",
        "canonicalId": "legein",
        "displayRoot": "legein",
        "meaning": "to gather, choose, speak",
        "origin": "Ancient Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "flaunt": {
    "prefixes": [],
    "roots": [
      {
        "form": "flaunt",
        "canonicalId": "flanta",
        "displayRoot": "flanta",
        "meaning": "to display ostentatiously, wave proudly",
        "origin": "Scandinavian"
      }
    ],
    "suffixes": []
  },
  "glean": {
    "prefixes": [],
    "roots": [
      {
        "form": "glean",
        "canonicalId": "glenn",
        "displayRoot": "glenn- / glener",
        "meaning": "to gather grain or leftovers",
        "origin": "Old French"
      }
    ],
    "suffixes": []
  },
  "glib": {
    "prefixes": [],
    "roots": [
      {
        "form": "glib",
        "canonicalId": "glib-nl",
        "displayRoot": "glibberig",
        "meaning": "smooth, slippery",
        "origin": "Dutch",
        "pieRoot": "*gley-"
      }
    ],
    "suffixes": []
  },
  "goad": {
    "prefixes": [],
    "roots": [
      {
        "form": "goad",
        "canonicalId": "gad-oe",
        "displayRoot": "gād",
        "meaning": "spear, prick, sting",
        "origin": "Old English",
        "pieRoot": "*ghai-"
      }
    ],
    "suffixes": []
  },
  "gregarious": {
    "prefixes": [],
    "roots": [
      {
        "form": "gregar",
        "canonicalId": "grex",
        "displayRoot": "grex / greg-",
        "meaning": "flock, herd",
        "origin": "Latin",
        "pieRoot": "*ger-",
        "pieGroupId": "pie:ger"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "having the quality of, full of"
      }
    ]
  },
  "grotto": {
    "prefixes": [],
    "roots": [
      {
        "form": "grott",
        "canonicalId": "kryptein",
        "displayRoot": "kryptein / kryptos",
        "meaning": "hidden place, vault, cave",
        "origin": "Greek",
        "pieRoot": "*krup-"
      }
    ],
    "suffixes": [
      {
        "form": "-o",
        "meaning": "nominal ending (Italian)"
      }
    ]
  },
  "gulch": {
    "prefixes": [],
    "roots": [
      {
        "form": "gulch",
        "canonicalId": "gulchen-me",
        "displayRoot": "gulchen",
        "meaning": "to swallow greedily, gulp down",
        "origin": "Middle English"
      }
    ],
    "suffixes": []
  },
  "hankering": {
    "prefixes": [],
    "roots": [
      {
        "form": "hanker",
        "canonicalId": "hunkeren-nl",
        "displayRoot": "hunkeren",
        "meaning": "to crave, long for, linger",
        "origin": "Dutch",
        "pieRoot": "*konk-"
      }
    ],
    "suffixes": [
      {
        "form": "-ing",
        "meaning": "action or process of (noun)"
      }
    ]
  },
  "heft": {
    "prefixes": [],
    "roots": [
      {
        "form": "heft",
        "canonicalId": "hebban-oe",
        "displayRoot": "hebban",
        "meaning": "to heave, lift, raise",
        "origin": "Old English",
        "pieRoot": "*kap-",
        "pieGroupId": "pie:kap"
      }
    ],
    "suffixes": []
  },
  "idiosyncrasy": {
    "prefixes": [
      {
        "form": "syn-",
        "canonicalId": "prefix-syn",
        "meaning": "with, together"
      }
    ],
    "roots": [
      {
        "form": "idio",
        "canonicalId": "idios",
        "displayRoot": "idios",
        "meaning": "one's own, private, personal",
        "origin": "Greek",
        "pieRoot": "*swe-",
        "pieGroupId": "pie:swe"
      },
      {
        "form": "cras",
        "canonicalId": "kerannynai",
        "displayRoot": "krasis / kerannynai",
        "meaning": "mixture, mingling, temperament",
        "origin": "Greek",
        "pieRoot": "*kere-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "quality, state, or condition"
      }
    ]
  },
  "latent": {
    "prefixes": [],
    "roots": [
      {
        "form": "lat",
        "canonicalId": "latere",
        "displayRoot": "latere",
        "meaning": "to lie hidden, lurk",
        "origin": "Latin",
        "pieRoot": "*ladh-"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "performing or being (adjective)"
      }
    ]
  },
  "luddite": {
    "prefixes": [],
    "roots": [
      {
        "form": "ludd",
        "canonicalId": "ludd",
        "displayRoot": "Ludd",
        "meaning": "Ned Ludd (eponym)",
        "origin": "English"
      }
    ],
    "suffixes": [
      {
        "form": "-ite",
        "meaning": "follower or disciple of"
      }
    ]
  },
  "luscious": {
    "prefixes": [],
    "roots": [
      {
        "form": "lusc",
        "canonicalId": "delectare",
        "displayRoot": "delectare / deliciae",
        "meaning": "delight, charm, alluring pleasure",
        "origin": "Latin",
        "pieRoot": "*lak-",
        "pieGroupId": "pie:lak"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "full of, having the quality of"
      }
    ]
  },
  "malignant": {
    "prefixes": [
      {
        "form": "mal-",
        "canonicalId": "prefix-mal",
        "meaning": "bad, evil, ill"
      }
    ],
    "roots": [
      {
        "form": "ign",
        "canonicalId": "genus",
        "displayRoot": "gignere / genus",
        "meaning": "beget, bring forth, nature",
        "origin": "Latin",
        "pieRoot": "*gen-"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "being or doing (adjective)"
      }
    ]
  },
  "malleable": {
    "prefixes": [],
    "roots": [
      {
        "form": "malle",
        "canonicalId": "malleus",
        "displayRoot": "malleus",
        "meaning": "hammer",
        "origin": "Latin",
        "pieRoot": "*melh-",
        "pieGroupId": "pie:melh"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of being (adjective)"
      }
    ]
  },
  "menial": {
    "prefixes": [],
    "roots": [
      {
        "form": "meni",
        "canonicalId": "manere",
        "displayRoot": "manere / mans-",
        "meaning": "to stay, dwell, household",
        "origin": "Latin",
        "pieRoot": "*men-"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "nefarious": {
    "prefixes": [
      {
        "form": "ne-",
        "canonicalId": "prefix-un",
        "meaning": "not, un-"
      }
    ],
    "roots": [
      {
        "form": "far",
        "canonicalId": "fari",
        "displayRoot": "fari / fat-",
        "meaning": "to speak, utter (fas: divine law)",
        "origin": "Latin",
        "pieRoot": "*bha-",
        "pieGroupId": "pie:bha"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "full of, having the quality of"
      }
    ]
  },
  "nonchalance": {
    "prefixes": [
      {
        "form": "non-",
        "canonicalId": "prefix-un",
        "meaning": "not"
      }
    ],
    "roots": [
      {
        "form": "chal",
        "canonicalId": "calere",
        "displayRoot": "calere",
        "meaning": "to be warm, to care, have concern",
        "origin": "Latin",
        "pieRoot": "*kele-",
        "pieGroupId": "pie:kele"
      }
    ],
    "suffixes": [
      {
        "form": "-ance",
        "meaning": "state or quality of (noun)"
      }
    ]
  },
  "ostentatious": {
    "prefixes": [
      {
        "form": "os-",
        "canonicalId": "prefix-ob",
        "meaning": "in front of, toward"
      }
    ],
    "roots": [
      {
        "form": "tent",
        "canonicalId": "tendere",
        "displayRoot": "tendere / tent-",
        "meaning": "to stretch, show, display",
        "origin": "Latin",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": [
      {
        "form": "-ati-",
        "meaning": "state or condition"
      },
      {
        "form": "-ous",
        "meaning": "full of, characterized by"
      }
    ]
  },
  "ostracize": {
    "prefixes": [],
    "roots": [
      {
        "form": "ostrac",
        "canonicalId": "ostrakon",
        "displayRoot": "ostrakon",
        "meaning": "potsherd, voting tile, shell",
        "origin": "Greek",
        "pieRoot": "*osth-",
        "pieGroupId": "pie:osth"
      }
    ],
    "suffixes": [
      {
        "form": "-ize",
        "meaning": "to subject to, make, practice"
      }
    ]
  },
  "palpable": {
    "prefixes": [],
    "roots": [
      {
        "form": "palp",
        "canonicalId": "palpare",
        "displayRoot": "palpare",
        "meaning": "to stroke, touch gently",
        "origin": "Latin",
        "pieRoot": "*pal-"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of being (adjective)"
      }
    ]
  },
  "paradigm": {
    "prefixes": [
      {
        "form": "para-",
        "canonicalId": "prefix-para",
        "meaning": "beside, alongside"
      }
    ],
    "roots": [
      {
        "form": "digm",
        "canonicalId": "deiknynai",
        "displayRoot": "deiknynai",
        "meaning": "to show, point out, exhibit",
        "origin": "Greek",
        "pieRoot": "*deyk-",
        "pieGroupId": "pie:deyk"
      }
    ],
    "suffixes": []
  },
  "pariah": {
    "prefixes": [],
    "roots": [
      {
        "form": "pariah",
        "canonicalId": "paraiyan-ta",
        "displayRoot": "paraiyan / parai",
        "meaning": "drummer, caste associated with ceremonial drums",
        "origin": "Tamil"
      }
    ],
    "suffixes": []
  },
  "pedantic": {
    "prefixes": [],
    "roots": [
      {
        "form": "ped",
        "canonicalId": "pais",
        "displayRoot": "pais / paidos",
        "meaning": "child, education, instruction",
        "origin": "Greek",
        "pieRoot": "*pau-"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "one who practices (noun)"
      },
      {
        "form": "-ic",
        "meaning": "pertaining to, characteristic of"
      }
    ]
  },
  "pedigree": {
    "prefixes": [],
    "roots": [
      {
        "form": "ped",
        "canonicalId": "pes",
        "displayRoot": "pes / ped-",
        "meaning": "foot",
        "origin": "Latin",
        "pieRoot": "*ped-"
      },
      {
        "form": "igree",
        "canonicalId": "grus",
        "displayRoot": "grus",
        "meaning": "crane",
        "origin": "Latin",
        "pieRoot": "*gere-"
      }
    ],
    "suffixes": []
  },
  "penchant": {
    "prefixes": [],
    "roots": [
      {
        "form": "pench",
        "canonicalId": "pendere",
        "displayRoot": "pendere / pens- / pondus",
        "meaning": "to hang, incline, weigh",
        "origin": "Latin",
        "pieRoot": "*spend-",
        "pieGroupId": "pie:spend"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "being or doing (present participle)"
      }
    ]
  },
  "penultimate": {
    "prefixes": [],
    "roots": [
      {
        "form": "pen",
        "canonicalId": "paene",
        "displayRoot": "paene",
        "meaning": "almost, nearly",
        "origin": "Latin"
      },
      {
        "form": "ultim",
        "canonicalId": "ultimus",
        "displayRoot": "ultimus / ulter",
        "meaning": "farthest, last",
        "origin": "Latin",
        "pieRoot": "*al-",
        "pieGroupId": "pie:al-grow"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "having the quality of (adjective)"
      }
    ]
  },
  "peruse": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "thoroughly, through"
      }
    ],
    "roots": [
      {
        "form": "use",
        "canonicalId": "uti",
        "displayRoot": "uti / usus",
        "meaning": "to use, employ, enjoy",
        "origin": "Latin",
        "pieRoot": "*oyt-",
        "pieGroupId": "pie:oyt"
      }
    ],
    "suffixes": []
  },
  "placate": {
    "prefixes": [],
    "roots": [
      {
        "form": "plac",
        "canonicalId": "placere",
        "displayRoot": "placere / placare",
        "meaning": "to please, calm, soothe",
        "origin": "Latin",
        "pieRoot": "*plak-",
        "pieGroupId": "pie:plak"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause to be (verb)"
      }
    ]
  },
  "pristine": {
    "prefixes": [],
    "roots": [
      {
        "form": "pristin",
        "canonicalId": "pristinus",
        "displayRoot": "pristinus",
        "meaning": "former, early, original",
        "origin": "Latin",
        "pieRoot": "*per-",
        "pieGroupId": "pie:per"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "adjectival ending"
      }
    ]
  },
  "prognosis": {
    "prefixes": [
      {
        "form": "pro-",
        "canonicalId": "prefix-pre",
        "meaning": "before, beforehand"
      }
    ],
    "roots": [
      {
        "form": "gno",
        "canonicalId": "gnosis",
        "displayRoot": "gnōsis / gignōskein",
        "meaning": "to know, recognize, discern",
        "origin": "Greek",
        "pieRoot": "*gno-",
        "pieGroupId": "pie:gno"
      }
    ],
    "suffixes": [
      {
        "form": "-sis",
        "meaning": "state, action, or condition (noun)"
      }
    ]
  },
  "pulpit": {
    "prefixes": [],
    "roots": [
      {
        "form": "pulpit",
        "canonicalId": "pulpitum",
        "displayRoot": "pulpitum",
        "meaning": "scaffold, platform, staging",
        "origin": "Latin"
      }
    ],
    "suffixes": []
  },
  "relegate": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "back, away"
      }
    ],
    "roots": [
      {
        "form": "leg",
        "canonicalId": "legare",
        "displayRoot": "legare",
        "meaning": "to send, depute, commission",
        "origin": "Latin",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to cause, make; verbal suffix"
      }
    ]
  },
  "reminisce": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "again, back"
      }
    ],
    "roots": [
      {
        "form": "min",
        "canonicalId": "mens",
        "displayRoot": "mens / meminisse",
        "meaning": "mind, thought, to remember",
        "origin": "Latin",
        "pieRoot": "*men-",
        "pieGroupId": "pie:men-mind"
      }
    ],
    "suffixes": [
      {
        "form": "-isce",
        "meaning": "to begin to; inchoative verbal suffix"
      }
    ]
  },
  "rigamarole": {
    "prefixes": [],
    "roots": [
      {
        "form": "rigma",
        "canonicalId": "ragman",
        "displayRoot": "ragman",
        "meaning": "catalogue, list of names, roll in game of chance",
        "origin": "Middle English"
      },
      {
        "form": "role",
        "canonicalId": "rota",
        "displayRoot": "rota",
        "meaning": "wheel",
        "origin": "Latin",
        "pieRoot": "*Hroth₂-"
      }
    ],
    "suffixes": []
  },
  "ruddy": {
    "prefixes": [],
    "roots": [
      {
        "form": "rudd",
        "canonicalId": "reud",
        "displayRoot": "reud- / rudu",
        "meaning": "red, redness",
        "origin": "Old English",
        "pieRoot": "*h₁rewdʰ-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "having the quality of, characterized by"
      }
    ]
  },
  "saunter": {
    "prefixes": [],
    "roots": [
      {
        "form": "saunter",
        "canonicalId": "santren",
        "displayRoot": "santren",
        "meaning": "to muse, be in a reverie, wander idle",
        "origin": "Middle English"
      }
    ],
    "suffixes": []
  },
  "scant": {
    "prefixes": [],
    "roots": [
      {
        "form": "scant",
        "canonicalId": "skammr",
        "displayRoot": "skammr",
        "meaning": "short, brief, scanty",
        "origin": "Old Norse",
        "pieRoot": "*skamb-"
      }
    ],
    "suffixes": []
  },
  "scurry": {
    "prefixes": [],
    "roots": [
      {
        "form": "scurry",
        "canonicalId": "hurry",
        "displayRoot": "hurry / hurry-scurry",
        "meaning": "to move with haste, rush, scamper",
        "origin": "English"
      }
    ],
    "suffixes": []
  },
  "semantic": {
    "prefixes": [],
    "roots": [
      {
        "form": "semant",
        "canonicalId": "sema",
        "displayRoot": "sēma / sēmainein",
        "meaning": "sign, mark, to signify",
        "origin": "Greek",
        "pieRoot": "*dʰyeh₂-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, relating to"
      }
    ]
  },
  "sentient": {
    "prefixes": [],
    "roots": [
      {
        "form": "senti",
        "canonicalId": "sentire",
        "displayRoot": "sentire / sens-",
        "meaning": "to feel, perceive, think",
        "origin": "Latin",
        "pieRoot": "*sent-"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "participial adjective suffix; being, performing"
      }
    ]
  },
  "soiree": {
    "prefixes": [],
    "roots": [
      {
        "form": "soir",
        "canonicalId": "serus",
        "displayRoot": "serus",
        "meaning": "late, evening",
        "origin": "Latin",
        "pieRoot": "*seh₁-",
        "pieGroupId": "pie:seh"
      }
    ],
    "suffixes": [
      {
        "form": "-ee",
        "meaning": "period of time, duration, evening event"
      }
    ]
  },
  "spry": {
    "prefixes": [],
    "roots": [
      {
        "form": "spry",
        "canonicalId": "spraekr",
        "displayRoot": "sprækr / sprygg",
        "meaning": "active, lively, brisk, nimble",
        "origin": "Old Norse",
        "pieRoot": "*sper-"
      }
    ],
    "suffixes": []
  },
  "sullen": {
    "prefixes": [],
    "roots": [
      {
        "form": "sull",
        "canonicalId": "solus",
        "displayRoot": "solus / solari",
        "meaning": "alone, solitary",
        "origin": "Latin",
        "pieRoot": "*se-",
        "pieGroupId": "pie:se-apart"
      }
    ],
    "suffixes": [
      {
        "form": "-en",
        "meaning": "having the quality of; adjective suffix"
      }
    ]
  },
  "tantalize": {
    "prefixes": [],
    "roots": [
      {
        "form": "tantal",
        "canonicalId": "tantalos",
        "displayRoot": "Tantalos",
        "meaning": "Tantalus (mythological king punished with receding food and drink)",
        "origin": "Greek",
        "pieRoot": "*telh₂-",
        "pieGroupId": "pie:telh"
      }
    ],
    "suffixes": [
      {
        "form": "-ize",
        "meaning": "to subject to, make, treat as"
      }
    ]
  },
  "tenacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "ten",
        "canonicalId": "tenere",
        "displayRoot": "tenere / tent-",
        "meaning": "to hold, keep, grasp",
        "origin": "Latin",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": [
      {
        "form": "-acious",
        "meaning": "inclined to, abounding in, characterized by"
      }
    ]
  },
  "tenement": {
    "prefixes": [],
    "roots": [
      {
        "form": "tene",
        "canonicalId": "tenere",
        "displayRoot": "tenere / tent-",
        "meaning": "to hold, keep, grasp",
        "origin": "Latin",
        "pieRoot": "*ten-",
        "pieGroupId": "pie:ten"
      }
    ],
    "suffixes": [
      {
        "form": "-ment",
        "meaning": "means, result, or concrete object of holding"
      }
    ]
  },
  "tepid": {
    "prefixes": [],
    "roots": [
      {
        "form": "tep",
        "canonicalId": "tepere",
        "displayRoot": "tepere",
        "meaning": "to be moderately warm",
        "origin": "Latin",
        "pieRoot": "*tep-"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "state or condition; adjective suffix"
      }
    ]
  },
  "terminus": {
    "prefixes": [],
    "roots": [
      {
        "form": "termin",
        "canonicalId": "terminus",
        "displayRoot": "terminus",
        "meaning": "boundary, limit, end-post",
        "origin": "Latin",
        "pieRoot": "*ter-"
      }
    ],
    "suffixes": [
      {
        "form": "-us",
        "meaning": "nominative noun suffix"
      }
    ]
  },
  "ubiquitous": {
    "prefixes": [],
    "roots": [
      {
        "form": "ubiquit",
        "canonicalId": "ubique",
        "displayRoot": "ubique",
        "meaning": "everywhere",
        "origin": "Latin",
        "pieRoot": "*kʷo-",
        "pieGroupId": "pie:kwo"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "having the quality of, full of"
      }
    ]
  },
  "unrequited": {
    "prefixes": [
      {
        "form": "un-",
        "canonicalId": "prefix-un",
        "meaning": "not, reversal"
      },
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "back, in return"
      }
    ],
    "roots": [
      {
        "form": "quit",
        "canonicalId": "quies",
        "displayRoot": "quies / quiescere",
        "meaning": "rest, quiet, settled, free from debt",
        "origin": "Latin",
        "pieRoot": "*kʷyeh₁-",
        "pieGroupId": "pie:kwyeh"
      }
    ],
    "suffixes": [
      {
        "form": "-ed",
        "meaning": "participial adjective suffix"
      }
    ]
  },
  "vehement": {
    "prefixes": [],
    "roots": [
      {
        "form": "vehe",
        "canonicalId": "vehere",
        "displayRoot": "vehere",
        "meaning": "to carry, convey forcibly",
        "origin": "Latin",
        "pieRoot": "*weǵʰ-",
        "pieGroupId": "pie:wegh"
      },
      {
        "form": "ment",
        "canonicalId": "mens",
        "displayRoot": "mens / meminisse",
        "meaning": "mind, thought, feeling",
        "origin": "Latin",
        "pieRoot": "*men-",
        "pieGroupId": "pie:men-mind"
      }
    ],
    "suffixes": []
  },
  "verbose": {
    "prefixes": [],
    "roots": [
      {
        "form": "verb",
        "canonicalId": "verbum",
        "displayRoot": "verbum",
        "meaning": "word",
        "origin": "Latin",
        "pieRoot": "*werh₁-"
      }
    ],
    "suffixes": [
      {
        "form": "-ose",
        "meaning": "full of, given to, abounding in"
      }
    ]
  },
  "vivacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "viv",
        "canonicalId": "vivere",
        "displayRoot": "vivere / vita",
        "meaning": "to live, life",
        "origin": "Latin",
        "pieRoot": "*gʷeyh₃-"
      }
    ],
    "suffixes": [
      {
        "form": "-acious",
        "meaning": "inclined to, characterized by"
      }
    ]
  },
  "waft": {
    "prefixes": [],
    "roots": [
      {
        "form": "waft",
        "canonicalId": "wacht-ger",
        "displayRoot": "wachten / biwacht",
        "meaning": "to watch, keep guard, convoy",
        "origin": "Dutch",
        "pieRoot": "*weǵ-",
        "pieGroupId": "pie:weg"
      }
    ],
    "suffixes": []
  },
  "wistful": {
    "prefixes": [],
    "roots": [
      {
        "form": "wist",
        "canonicalId": "witan",
        "displayRoot": "witan / wit",
        "meaning": "to know, perceive, think intently",
        "origin": "Old English",
        "pieRoot": "*weid-",
        "pieGroupId": "pie:weid"
      }
    ],
    "suffixes": [
      {
        "form": "-ful",
        "meaning": "full of, having the quality of"
      }
    ]
  },
  "trite": {
    "prefixes": [],
    "roots": [
      {
        "form": "trit",
        "canonicalId": "terere",
        "displayRoot": "terere / trit-",
        "meaning": "to rub, wear away, thresh",
        "origin": "Latin",
        "pieRoot": "*terh₁-",
        "pieGroupId": "pie:terh"
      }
    ],
    "suffixes": []
  },
  "mote": {
    "prefixes": [],
    "roots": [
      {
        "form": "mote",
        "canonicalId": "mot",
        "displayRoot": "mot",
        "meaning": "speck, tiny particle",
        "origin": "Old English"
      }
    ],
    "suffixes": []
  },
  "vista": {
    "prefixes": [],
    "roots": [
      {
        "form": "vist",
        "canonicalId": "videre",
        "displayRoot": "videre / vis-",
        "meaning": "to see, look, view",
        "origin": "Latin",
        "pieRoot": "*weid-",
        "pieGroupId": "pie:weid"
      }
    ],
    "suffixes": [
      {
        "form": "-a",
        "meaning": "noun suffix"
      }
    ]
  },
  "poignant": {
    "prefixes": [],
    "roots": [
      {
        "form": "poign",
        "canonicalId": "pungere",
        "displayRoot": "pungere / punct-",
        "meaning": "to prick, pierce, sting",
        "origin": "Latin",
        "pieRoot": "*pewǵ-",
        "pieGroupId": "pie:pewg"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "participial adjective suffix; having the quality of"
      }
    ]
  },
  "myriad": {
    "prefixes": [],
    "roots": [
      {
        "form": "myri",
        "canonicalId": "myrios",
        "displayRoot": "myrios",
        "meaning": "countless, ten thousand",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ad",
        "meaning": "collective noun suffix, group"
      }
    ]
  },
  "altruism": {
    "prefixes": [],
    "roots": [
      {
        "form": "altru",
        "canonicalId": "alter",
        "displayRoot": "alter / alius",
        "meaning": "other, another",
        "origin": "Latin",
        "pieRoot": "*h₂el-",
        "pieGroupId": "pie:al-other"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "doctrine, belief, practice"
      }
    ]
  },
  "arable": {
    "prefixes": [],
    "roots": [
      {
        "form": "ar",
        "canonicalId": "arare",
        "displayRoot": "arare: to plow, cultivate",
        "meaning": "to plow, till",
        "origin": "Latin",
        "pieRoot": "*h₂orh₃-"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of being (adjective)"
      }
    ]
  },
  "elegy": {
    "prefixes": [],
    "roots": [
      {
        "form": "eleg",
        "canonicalId": "elegos",
        "displayRoot": "elegos: mournful song, lament",
        "meaning": "mournful song, lament",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state, quality, or composition (noun)"
      }
    ]
  },
  "fathomless": {
    "prefixes": [],
    "roots": [
      {
        "form": "fathom",
        "canonicalId": "faethm",
        "displayRoot": "fæthm: outstretched arms, embrace, fathom",
        "meaning": "span of outstretched arms, fathom, depth",
        "origin": "Old English",
        "pieRoot": "*peth₂-",
        "pieGroupId": "pie:peth"
      }
    ],
    "suffixes": [
      {
        "form": "-less",
        "meaning": "without, lacking (adjective)"
      }
    ]
  },
  "fecund": {
    "prefixes": [],
    "roots": [
      {
        "form": "fecund",
        "canonicalId": "fecundus",
        "displayRoot": "fecundus / fetus: fruitful, fertile, producing offspring",
        "meaning": "fruitful, fertile, rich",
        "origin": "Latin",
        "pieRoot": "*dʰeh₁(y)-"
      }
    ],
    "suffixes": []
  },
  "hapless": {
    "prefixes": [],
    "roots": [
      {
        "form": "hap",
        "canonicalId": "happ",
        "displayRoot": "happ: good luck, chance, fortune",
        "meaning": "good fortune, luck, chance",
        "origin": "Old Norse",
        "pieRoot": "*kob-"
      }
    ],
    "suffixes": [
      {
        "form": "-less",
        "meaning": "without, lacking (adjective)"
      }
    ]
  },
  "melancholy": {
    "prefixes": [],
    "roots": [
      {
        "form": "melan-",
        "canonicalId": "melas",
        "displayRoot": "melas / melan-: black, dark",
        "meaning": "black, dark",
        "origin": "Greek",
        "pieRoot": "*melh₂-",
        "pieGroupId": "pie:melh"
      },
      {
        "form": "chol",
        "canonicalId": "khole",
        "displayRoot": "kholē: bile, gall",
        "meaning": "bile, gall",
        "origin": "Greek",
        "pieRoot": "*gʰel-",
        "pieGroupId": "pie:ghel"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "condition or quality (noun)"
      }
    ]
  },
  "mirth": {
    "prefixes": [],
    "roots": [
      {
        "form": "mir",
        "canonicalId": "myrgth-oe",
        "displayRoot": "myrġþ",
        "meaning": "mirth, pleasure, joy",
        "origin": "Old English",
        "pieRoot": "*mreǵʰu-"
      }
    ],
    "suffixes": [
      {
        "form": "-th",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "pensive": {
    "prefixes": [],
    "roots": [
      {
        "form": "pens",
        "canonicalId": "pendere",
        "displayRoot": "pendere / pens- / pondus: to hang, weigh, ponder, value",
        "meaning": "to weigh, ponder, consider",
        "origin": "Latin",
        "pieRoot": "*(s)pen-"
      }
    ],
    "suffixes": [
      {
        "form": "-ive",
        "meaning": "tending to, performing (adjective)"
      }
    ]
  },
  "pervade": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "through, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "vade",
        "canonicalId": "vadere",
        "displayRoot": "vadere: to go, advance, walk",
        "meaning": "to go, walk",
        "origin": "Latin",
        "pieRoot": "*h₁wah₂dʰ-"
      }
    ],
    "suffixes": []
  },
  "prodigious": {
    "prefixes": [],
    "roots": [
      {
        "form": "prodigi",
        "canonicalId": "prodigium",
        "displayRoot": "prodigium: portent, omen, prophetic sign",
        "meaning": "portent, marvel, unnatural event",
        "origin": "Latin",
        "pieRoot": "*h₂eǵ-",
        "pieGroupId": "pie:heg"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "possessing, full of (adjective)"
      }
    ]
  },
  "rapture": {
    "prefixes": [],
    "roots": [
      {
        "form": "rapt",
        "canonicalId": "rapere",
        "displayRoot": "rapere / rapt-: to seize, snatch, carry off",
        "meaning": "to seize, snatch, carry off",
        "origin": "Latin",
        "pieRoot": "*h₁rep-",
        "pieGroupId": "pie:hrep"
      }
    ],
    "suffixes": [
      {
        "form": "-ure",
        "meaning": "act, process, or result of (noun)"
      }
    ]
  },
  "reconnaissance": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "again, back"
      },
      {
        "form": "con-",
        "canonicalId": "prefix-com",
        "meaning": "thoroughly, with"
      }
    ],
    "roots": [
      {
        "form": "naiss",
        "canonicalId": "cognoscere",
        "displayRoot": "cognoscere / gnoscere: to know, recognize, examine",
        "meaning": "to know, recognize",
        "origin": "Latin",
        "pieRoot": "*ǵneh₃-"
      }
    ],
    "suffixes": [
      {
        "form": "-ance",
        "meaning": "action or process (noun)"
      }
    ]
  },
  "reverent": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "again, intensive"
      }
    ],
    "roots": [
      {
        "form": "ver",
        "canonicalId": "vereri",
        "displayRoot": "vereri: to fear, feel awe, revere",
        "meaning": "to fear, respect, stand in awe of",
        "origin": "Latin",
        "pieRoot": "*wer-"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "performing an action, being in a state (adjective)"
      }
    ]
  },
  "thrall": {
    "prefixes": [],
    "roots": [
      {
        "form": "thrall",
        "canonicalId": "thraell",
        "displayRoot": "þræll: serf, slave, bondman",
        "meaning": "slave, serf, captive",
        "origin": "Old Norse",
        "pieRoot": "*tergʰ-"
      }
    ],
    "suffixes": []
  },
  "solace": {
    "prefixes": [],
    "roots": [
      {
        "form": "sola",
        "canonicalId": "solari",
        "displayRoot": "solārī",
        "meaning": "to console, comfort, soothe",
        "origin": "Latin",
        "pieRoot": "*selh₁-",
        "pieGroupId": "pie:selh"
      }
    ],
    "suffixes": [
      {
        "form": "-ce",
        "meaning": "state, action, or condition (noun)"
      }
    ]
  },
  "amnesty": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-a",
        "meaning": "not, without"
      }
    ],
    "roots": [
      {
        "form": "mnest",
        "canonicalId": "mneme",
        "displayRoot": "mnēmē / mimnēskein: memory, to call to mind",
        "meaning": "remembered, memory",
        "origin": "Greek",
        "pieRoot": "*men-",
        "pieGroupId": "pie:men-mind"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "condition or quality (noun)"
      }
    ]
  },
  "bipartisan": {
    "prefixes": [
      {
        "form": "bi-",
        "canonicalId": "prefix-bi",
        "meaning": "two"
      }
    ],
    "roots": [
      {
        "form": "partis",
        "canonicalId": "pars",
        "displayRoot": "pars",
        "meaning": "part, piece, share, division",
        "origin": "Latin",
        "pieRoot": "*perh₂-",
        "pieGroupId": "pie:perh"
      }
    ],
    "suffixes": [
      {
        "form": "-an",
        "meaning": "pertaining to, adherent of (adjective)"
      }
    ]
  },
  "coalition": {
    "prefixes": [
      {
        "form": "co-",
        "canonicalId": "prefix-com",
        "meaning": "together, with"
      }
    ],
    "roots": [
      {
        "form": "alit",
        "canonicalId": "alescere",
        "displayRoot": "alescere / alere: to nourish, grow together",
        "meaning": "to grow up, nourish, unite",
        "origin": "Latin",
        "pieRoot": "*h₂el-",
        "pieGroupId": "pie:al-grow"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "act or result of (noun)"
      }
    ]
  },
  "embargo": {
    "prefixes": [
      {
        "form": "em-",
        "canonicalId": "prefix-in",
        "meaning": "in, into, upon"
      }
    ],
    "roots": [
      {
        "form": "barg",
        "canonicalId": "barra",
        "displayRoot": "barra: bar, barrier, impediment",
        "meaning": "bar, barrier, restraint",
        "origin": "Spanish",
        "pieRoot": "*bʰar-"
      }
    ],
    "suffixes": [
      {
        "form": "-o",
        "meaning": "noun marker (noun)"
      }
    ]
  },
  "precedent": {
    "prefixes": [
      {
        "form": "pre-",
        "canonicalId": "prefix-pre",
        "meaning": "before, in front of"
      }
    ],
    "roots": [
      {
        "form": "ced",
        "canonicalId": "cedere",
        "displayRoot": "cedere / cess-: to go, yield, withdraw",
        "meaning": "to go, yield, pass",
        "origin": "Latin",
        "pieRoot": "*ked-",
        "pieGroupId": "pie:ked"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "one that performs an action (noun/adjective)"
      }
    ]
  },
  "referendum": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "back, again"
      }
    ],
    "roots": [
      {
        "form": "fer",
        "canonicalId": "ferre",
        "displayRoot": "ferre / lat-: to bear, carry, bring",
        "meaning": "to carry, bring",
        "origin": "Latin",
        "pieRoot": "*bʰer-",
        "pieGroupId": "pie:bher"
      }
    ],
    "suffixes": [
      {
        "form": "-endum",
        "meaning": "gerundive ending signifying 'that which must be done' (noun)"
      }
    ]
  },
  "sovereignty": {
    "prefixes": [],
    "roots": [
      {
        "form": "soverain",
        "canonicalId": "super",
        "displayRoot": "super / superus: above, over, supreme",
        "meaning": "above, over, supreme ruler",
        "origin": "Latin",
        "pieRoot": "*h₁wper"
      }
    ],
    "suffixes": [
      {
        "form": "-ty",
        "meaning": "state, quality, or condition (noun)"
      }
    ]
  },
  "allegory": {
    "prefixes": [],
    "roots": [
      {
        "form": "all-",
        "canonicalId": "allos",
        "displayRoot": "allos / allēlōn: other, different, mutual",
        "meaning": "other, different",
        "origin": "Greek",
        "pieRoot": "*h₂el-",
        "pieGroupId": "pie:al-other"
      },
      {
        "form": "egor",
        "canonicalId": "agora",
        "displayRoot": "agora / agoreuein: assembly; to speak publicly",
        "meaning": "to speak in public, proclaim",
        "origin": "Greek",
        "pieRoot": "*h₂ger-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state, quality, or action (noun)"
      }
    ]
  },
  "alliteration": {
    "prefixes": [
      {
        "form": "al-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward, addition"
      }
    ],
    "roots": [
      {
        "form": "liter",
        "canonicalId": "littera",
        "displayRoot": "littera: letter of the alphabet",
        "meaning": "letter of the alphabet",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "action or process (noun)"
      }
    ]
  },
  "archetype": {
    "prefixes": [],
    "roots": [
      {
        "form": "arche",
        "canonicalId": "arkhe",
        "displayRoot": "arkhein / arkhē: to begin, lead, rule, first",
        "meaning": "first, original, primitive",
        "origin": "Greek",
        "pieRoot": "*h₂ergʰ-",
        "pieGroupId": "pie:hergh"
      },
      {
        "form": "type",
        "canonicalId": "typos",
        "displayRoot": "typos: stamp, impression, model",
        "meaning": "stamp, impression, model, pattern",
        "origin": "Greek",
        "pieRoot": "*(s)tewp-",
        "pieGroupId": "pie:stewp"
      }
    ],
    "suffixes": []
  },
  "monologue": {
    "prefixes": [],
    "roots": [
      {
        "form": "mono",
        "canonicalId": "monos",
        "displayRoot": "monos: alone, single, one",
        "meaning": "alone, single, solitary",
        "origin": "Greek",
        "pieRoot": "*men-"
      },
      {
        "form": "logue",
        "canonicalId": "logos",
        "displayRoot": "-logia / legein / logos: word, speech, study, gather",
        "meaning": "speech, discourse, word",
        "origin": "Greek",
        "pieRoot": "*leǵ-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": []
  },
  "adamant": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-a",
        "meaning": "not, un-"
      }
    ],
    "roots": [
      {
        "form": "damant",
        "canonicalId": "daman",
        "displayRoot": "damazein / daman: to conquer, tame, overpower",
        "meaning": "to tame, subdue, conquer",
        "origin": "Greek",
        "pieRoot": "*demh₂-",
        "pieGroupId": "pie:demh"
      }
    ],
    "suffixes": []
  },
  "almanac": {
    "prefixes": [],
    "roots": [
      {
        "form": "almanac",
        "canonicalId": "manakh",
        "displayRoot": "al-manākh: climate, calendar, astronomical table",
        "meaning": "calendar, astronomical table",
        "origin": "Arabic"
      }
    ],
    "suffixes": []
  },
  "amble": {
    "prefixes": [],
    "roots": [
      {
        "form": "ambl",
        "canonicalId": "ambulare",
        "displayRoot": "ambulare: to walk, wander",
        "meaning": "to walk, move at an easy pace",
        "origin": "Latin",
        "pieRoot": "*h₂el-"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "verbal formative (verb)"
      }
    ]
  },
  "ample": {
    "prefixes": [],
    "roots": [
      {
        "form": "ampl",
        "canonicalId": "amplus",
        "displayRoot": "amplus: large, spacious, wide",
        "meaning": "large, spacious, wide",
        "origin": "Latin",
        "pieRoot": "*h₂mbʰi-pleh₁-"
      }
    ],
    "suffixes": []
  },
  "articulate": {
    "prefixes": [],
    "roots": [
      {
        "form": "articul",
        "canonicalId": "articulus",
        "displayRoot": "articulus / artus",
        "meaning": "joint, segment",
        "origin": "Latin",
        "pieRoot": "*ar-"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "having the quality of, to make (adjective/verb suffix)"
      }
    ]
  },
  "audacious": {
    "prefixes": [],
    "roots": [
      {
        "form": "audac",
        "canonicalId": "audere",
        "displayRoot": "audere / audax",
        "meaning": "to dare, be bold",
        "origin": "Latin",
        "pieRoot": "*aw-dh-"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "characterized by, full of (adjective)"
      }
    ]
  },
  "benevolent": {
    "prefixes": [
      {
        "form": "bene-",
        "canonicalId": "prefix-bene",
        "meaning": "well, good"
      }
    ],
    "roots": [
      {
        "form": "vol",
        "canonicalId": "velle",
        "displayRoot": "velle / vol-",
        "meaning": "to wish, will, desire",
        "origin": "Latin",
        "pieRoot": "*wel-",
        "pieGroupId": "pie:wel"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "doing, performing (adjective)"
      }
    ]
  },
  "brisk": {
    "prefixes": [],
    "roots": [
      {
        "form": "brisk",
        "canonicalId": "brusque",
        "displayRoot": "brusque",
        "meaning": "lively, sharp, quick",
        "origin": "French"
      }
    ],
    "suffixes": []
  },
  "chastity": {
    "prefixes": [],
    "roots": [
      {
        "form": "chast",
        "canonicalId": "castus",
        "displayRoot": "castus / castigare",
        "meaning": "pure, chaste; to correct, purify",
        "origin": "Latin",
        "pieRoot": "*kes-",
        "pieGroupId": "pie:kes"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "consolation": {
    "prefixes": [
      {
        "form": "con-",
        "canonicalId": "prefix-com",
        "meaning": "with, together, completely"
      }
    ],
    "roots": [
      {
        "form": "sol",
        "canonicalId": "solari",
        "displayRoot": "solārī",
        "meaning": "to console, comfort, soothe",
        "origin": "Latin",
        "pieRoot": "*selh₁-",
        "pieGroupId": "pie:selh"
      }
    ],
    "suffixes": [
      {
        "form": "-ation",
        "meaning": "action or process (noun)"
      }
    ]
  },
  "cordial": {
    "prefixes": [],
    "roots": [
      {
        "form": "cord",
        "canonicalId": "cor",
        "displayRoot": "cor / cord-",
        "meaning": "heart, mind, feeling, agreement",
        "origin": "Latin",
        "pieRoot": "*kerd-"
      }
    ],
    "suffixes": [
      {
        "form": "-ial",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "dandy": {
    "prefixes": [],
    "roots": [
      {
        "form": "dandy",
        "canonicalId": "dandy",
        "displayRoot": "dandy / dandie",
        "meaning": "fine, showy, familiar form of Andrew",
        "origin": "Scottish"
      }
    ],
    "suffixes": []
  },
  "diligent": {
    "prefixes": [
      {
        "form": "di-",
        "canonicalId": "prefix-dis",
        "meaning": "apart, away"
      }
    ],
    "roots": [
      {
        "form": "lig",
        "canonicalId": "legere",
        "displayRoot": "legere / lect-",
        "meaning": "to gather, choose, read",
        "origin": "Latin",
        "pieRoot": "*leg-",
        "pieGroupId": "pie:leg"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "doing, performing (adjective)"
      }
    ]
  },
  "dwell": {
    "prefixes": [],
    "roots": [
      {
        "form": "dwell",
        "canonicalId": "dwellan",
        "displayRoot": "dwellan",
        "meaning": "to lead astray, wander, linger, abide",
        "origin": "Old English",
        "pieRoot": "*dhwel-",
        "pieGroupId": "pie:dhwel"
      }
    ],
    "suffixes": []
  },
  "ecstatic": {
    "prefixes": [
      {
        "form": "ec-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth, from"
      }
    ],
    "roots": [
      {
        "form": "sta",
        "canonicalId": "stasis",
        "displayRoot": "stasis / histanai",
        "meaning": "standing, state, stopping",
        "origin": "Greek",
        "pieRoot": "*steh-",
        "pieGroupId": "pie:steh"
      }
    ],
    "suffixes": [
      {
        "form": "-tic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "eloquent": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth, from"
      }
    ],
    "roots": [
      {
        "form": "loqu",
        "canonicalId": "loqui",
        "displayRoot": "loqui / locut-",
        "meaning": "to speak, talk, utter",
        "origin": "Latin",
        "pieRoot": "*tolkw-",
        "pieGroupId": "pie:tolkw"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "characterized by (adjective)"
      }
    ]
  },
  "enigma": {
    "prefixes": [],
    "roots": [
      {
        "form": "enigm",
        "canonicalId": "ainos",
        "displayRoot": "ainos / ainigma",
        "meaning": "fable, saying, riddle",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-a",
        "meaning": "nominal result suffix (noun)"
      }
    ]
  },
  "enormity": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, away from"
      }
    ],
    "roots": [
      {
        "form": "norm",
        "canonicalId": "norma",
        "displayRoot": "norma",
        "meaning": "carpenter’s square, rule, standard",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or condition (noun)"
      }
    ]
  },
  "excursion": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth, from"
      }
    ],
    "roots": [
      {
        "form": "curs",
        "canonicalId": "currere",
        "displayRoot": "currere / curs-",
        "meaning": "to run, flow, course",
        "origin": "Latin",
        "pieRoot": "*kers-",
        "pieGroupId": "pie:kers"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "act or process (noun)"
      }
    ]
  },
  "exquisite": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, thoroughly"
      }
    ],
    "roots": [
      {
        "form": "quisit",
        "canonicalId": "quaerere",
        "displayRoot": "quaerere / quisit-",
        "meaning": "to seek, ask, inquire",
        "origin": "Latin",
        "pieRoot": "*kwo-",
        "pieGroupId": "pie:kwo"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "participial ending"
      }
    ]
  },
  "falter": {
    "prefixes": [],
    "roots": [
      {
        "form": "falt",
        "canonicalId": "faltra",
        "displayRoot": "faltra",
        "meaning": "to stumble, stagger, hesitate",
        "origin": "Middle English"
      }
    ],
    "suffixes": [
      {
        "form": "-er",
        "meaning": "frequentative verb suffix"
      }
    ]
  },
  "fluke": {
    "prefixes": [],
    "roots": [
      {
        "form": "fluke",
        "canonicalId": "fluke",
        "displayRoot": "fluke",
        "meaning": "flat object, lucky stroke",
        "origin": "English",
        "pieRoot": "*plak-",
        "pieGroupId": "pie:plak"
      }
    ],
    "suffixes": []
  },
  "formidable": {
    "prefixes": [],
    "roots": [
      {
        "form": "formid",
        "canonicalId": "formidare",
        "displayRoot": "formido / formidare",
        "meaning": "fear, dread, terror",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-able",
        "meaning": "capable of causing, worthy of (adjective)"
      }
    ]
  },
  "fret": {
    "prefixes": [
      {
        "form": "f-",
        "canonicalId": "prefix-un",
        "meaning": "away, completely (intensive)"
      }
    ],
    "roots": [
      {
        "form": "ret",
        "canonicalId": "etan",
        "displayRoot": "etan / eat",
        "meaning": "to eat, devour",
        "origin": "Old English",
        "pieRoot": "*ed-"
      }
    ],
    "suffixes": []
  },
  "frivolous": {
    "prefixes": [],
    "roots": [
      {
        "form": "frivol",
        "canonicalId": "frivolus",
        "displayRoot": "frivolus / fricare",
        "meaning": "silly, trifling, rubbed away",
        "origin": "Latin",
        "pieRoot": "*bhri-"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, having (adjective)"
      }
    ]
  },
  "futile": {
    "prefixes": [],
    "roots": [
      {
        "form": "fut",
        "canonicalId": "fundere",
        "displayRoot": "fundere / fus-",
        "meaning": "to pour, melt, shed",
        "origin": "Latin",
        "pieRoot": "*gheu-"
      }
    ],
    "suffixes": [
      {
        "form": "-ile",
        "meaning": "tending to, capable of (adjective)"
      }
    ]
  },
  "gleam": {
    "prefixes": [],
    "roots": [
      {
        "form": "gleam",
        "canonicalId": "glam-oe",
        "displayRoot": "glæm / glēo / glimsen",
        "meaning": "shine, gleam, joy, brief glance",
        "origin": "Old English",
        "pieRoot": "*ghel-",
        "pieGroupId": "pie:ghel"
      }
    ],
    "suffixes": []
  },
  "glee": {
    "prefixes": [],
    "roots": [
      {
        "form": "glee",
        "canonicalId": "gleo-oe",
        "displayRoot": "glēo",
        "meaning": "entertainment, music, mirth, joy",
        "origin": "Old English",
        "pieRoot": "*gʰlew-"
      }
    ],
    "suffixes": []
  },
  "glimpse": {
    "prefixes": [],
    "roots": [
      {
        "form": "glimp",
        "canonicalId": "glam-oe",
        "displayRoot": "glæm / glēo / glimsen",
        "meaning": "shine, gleam, joy, brief glance",
        "origin": "Middle English",
        "pieRoot": "*ghel-",
        "pieGroupId": "pie:ghel"
      }
    ],
    "suffixes": [
      {
        "form": "-se",
        "meaning": "frequentative or formative suffix"
      }
    ]
  },
  "haughty": {
    "prefixes": [],
    "roots": [
      {
        "form": "haught",
        "canonicalId": "altus",
        "displayRoot": "altus",
        "meaning": "high, deep, elevated",
        "origin": "Latin",
        "pieRoot": "*al-",
        "pieGroupId": "pie:al-grow"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "characterized by (adjective)"
      }
    ]
  },
  "hectic": {
    "prefixes": [],
    "roots": [
      {
        "form": "hect",
        "canonicalId": "ekhein",
        "displayRoot": "ekhein / hexis",
        "meaning": "to hold, possess, state",
        "origin": "Greek",
        "pieRoot": "*segh-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "humble": {
    "prefixes": [],
    "roots": [
      {
        "form": "hum",
        "canonicalId": "humus",
        "displayRoot": "humus / humilis",
        "meaning": "earth, ground, lowly",
        "origin": "Latin",
        "pieRoot": "*dhghem-"
      }
    ],
    "suffixes": [
      {
        "form": "-ble",
        "meaning": "adjectival ending"
      }
    ]
  },
  "indifferent": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "not"
      },
      {
        "form": "dif-",
        "canonicalId": "prefix-dis",
        "meaning": "apart, away"
      }
    ],
    "roots": [
      {
        "form": "fer",
        "canonicalId": "ferre",
        "displayRoot": "ferre / lat-",
        "meaning": "to bear, carry, bring",
        "origin": "Latin",
        "pieRoot": "*bher-",
        "pieGroupId": "pie:bher"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "characterized by (adjective)"
      }
    ]
  },
  "innate": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "in, into"
      }
    ],
    "roots": [
      {
        "form": "nat",
        "canonicalId": "nasci",
        "displayRoot": "nasci / nat-",
        "meaning": "to be born, arise",
        "origin": "Latin",
        "pieRoot": "*gene-"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "participial ending"
      }
    ]
  },
  "insidious": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "in, upon, against"
      }
    ],
    "roots": [
      {
        "form": "sid",
        "canonicalId": "sedere",
        "displayRoot": "sedere / sess- / sid-",
        "meaning": "to sit, settle",
        "origin": "Latin",
        "pieRoot": "*sed-",
        "pieGroupId": "pie:sed"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "full of, having the quality of (adjective)"
      }
    ]
  },
  "jubilant": {
    "prefixes": [],
    "roots": [
      {
        "form": "jubil",
        "canonicalId": "iubilare",
        "displayRoot": "iubilare",
        "meaning": "to shout for joy",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "performing, being, or inclined to (adjective)"
      }
    ]
  },
  "kaleidoscope": {
    "prefixes": [],
    "roots": [
      {
        "form": "kal",
        "canonicalId": "kalos",
        "displayRoot": "kalos",
        "meaning": "beautiful",
        "origin": "Ancient Greek",
        "pieRoot": "*kal-"
      },
      {
        "form": "eido",
        "canonicalId": "eidos",
        "displayRoot": "eidos",
        "meaning": "form, shape, seen image",
        "origin": "Ancient Greek",
        "pieRoot": "*weid-",
        "pieGroupId": "pie:weid"
      },
      {
        "form": "scope",
        "canonicalId": "skopein",
        "displayRoot": "skopein / skepsis: to look at, examine, reflect",
        "meaning": "to look at, examine, view",
        "origin": "Ancient Greek",
        "pieRoot": "*spek-",
        "pieGroupId": "pie:spek"
      }
    ],
    "suffixes": []
  },
  "knack": {
    "prefixes": [],
    "roots": [
      {
        "form": "knack",
        "canonicalId": "knack",
        "displayRoot": "knack",
        "meaning": "sharp blow, snap, clever trick",
        "origin": "Middle English"
      }
    ],
    "suffixes": []
  },
  "lofty": {
    "prefixes": [],
    "roots": [
      {
        "form": "loft",
        "canonicalId": "lopt",
        "displayRoot": "loft / lopt",
        "meaning": "air, sky, upper room",
        "origin": "Old Norse",
        "pieRoot": "*leup-"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "characterized by, having the quality of (adjective)"
      }
    ]
  },
  "lore": {
    "prefixes": [],
    "roots": [
      {
        "form": "lore",
        "canonicalId": "laer",
        "displayRoot": "lār / læran",
        "meaning": "instruction, teaching, doctrine",
        "origin": "Old English",
        "pieRoot": "*leys-"
      }
    ],
    "suffixes": []
  },
  "lucid": {
    "prefixes": [],
    "roots": [
      {
        "form": "luc",
        "canonicalId": "lux",
        "displayRoot": "lux / lucere / lumen",
        "meaning": "light, shine, clarity",
        "origin": "Latin",
        "pieRoot": "*lewk-"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "state, condition, or tendency (adjective)"
      }
    ]
  },
  "lucrative": {
    "prefixes": [],
    "roots": [
      {
        "form": "lucr",
        "canonicalId": "lucrum",
        "displayRoot": "lucrum",
        "meaning": "profit, gain, advantage",
        "origin": "Latin",
        "pieRoot": "*lau-"
      }
    ],
    "suffixes": [
      {
        "form": "-ative",
        "meaning": "tending to, relating to (adjective)"
      }
    ]
  },
  "lurk": {
    "prefixes": [],
    "roots": [
      {
        "form": "lurk",
        "canonicalId": "lurka",
        "displayRoot": "lurka / luren",
        "meaning": "to lie hidden, sneak, lurk",
        "origin": "Middle English"
      }
    ],
    "suffixes": []
  },
  "maneouver": {
    "prefixes": [],
    "roots": [
      {
        "form": "man",
        "canonicalId": "manus",
        "displayRoot": "manus",
        "meaning": "hand, manual craft",
        "origin": "Latin",
        "pieRoot": "*man-",
        "pieGroupId": "pie:man"
      },
      {
        "form": "euvr",
        "canonicalId": "opus",
        "displayRoot": "opus / opera",
        "meaning": "work, labor, effort",
        "origin": "Latin",
        "pieRoot": "*hop-"
      }
    ],
    "suffixes": [
      {
        "form": "-er",
        "meaning": "action or process (verb formative)"
      }
    ]
  },
  "meticulous": {
    "prefixes": [],
    "roots": [
      {
        "form": "meticul",
        "canonicalId": "metus",
        "displayRoot": "metus / meticulosus",
        "meaning": "fear, apprehension, timidity",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ous",
        "meaning": "full of, characterized by (adjective)"
      }
    ]
  },
  "murmur": {
    "prefixes": [],
    "roots": [
      {
        "form": "murmur",
        "canonicalId": "murmur",
        "displayRoot": "murmur / murmurare",
        "meaning": "to mutter, murmur, roar",
        "origin": "Latin",
        "pieRoot": "*mormor-"
      }
    ],
    "suffixes": []
  },
  "muse": {
    "prefixes": [],
    "roots": [
      {
        "form": "mus",
        "canonicalId": "musus",
        "displayRoot": "muser / musel",
        "meaning": "snout, muzzle; to loiter, idle",
        "origin": "Old French"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "verb formative"
      }
    ]
  },
  "nostalgic": {
    "prefixes": [],
    "roots": [
      {
        "form": "nost",
        "canonicalId": "nostos",
        "displayRoot": "algos / nostos",
        "meaning": "homecoming, return home",
        "origin": "Ancient Greek",
        "pieRoot": "*nes-",
        "pieGroupId": "pie:nes"
      },
      {
        "form": "alg",
        "canonicalId": "algos",
        "displayRoot": "algos / nostos: pain, ache, longing",
        "meaning": "pain, ache, grief",
        "origin": "Ancient Greek",
        "pieRoot": "*algh-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to, of the nature of (adjective)"
      }
    ]
  },
  "ogle": {
    "prefixes": [],
    "roots": [
      {
        "form": "ogl",
        "canonicalId": "oog-ger",
        "displayRoot": "oogen / oog",
        "meaning": "eye, to look closely",
        "origin": "Dutch",
        "pieRoot": "*okw-",
        "pieGroupId": "pie:okw"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "verb formative"
      }
    ]
  },
  "paradox": {
    "prefixes": [
      {
        "form": "para-",
        "canonicalId": "prefix-para",
        "meaning": "contrary to, distinct from, beyond"
      }
    ],
    "roots": [
      {
        "form": "dox",
        "canonicalId": "doxa",
        "displayRoot": "doxa / dogma",
        "meaning": "opinion, belief, glory, seem",
        "origin": "Ancient Greek",
        "pieRoot": "*dek-",
        "pieGroupId": "pie:dek"
      }
    ],
    "suffixes": []
  },
  "perpetual": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "through, thoroughly, continuously"
      }
    ],
    "roots": [
      {
        "form": "pet",
        "canonicalId": "petere",
        "displayRoot": "petere / petit-",
        "meaning": "to seek, aim at, rush toward",
        "origin": "Latin",
        "pieRoot": "*peth2-",
        "pieGroupId": "pie:peth"
      }
    ],
    "suffixes": [
      {
        "form": "-ual",
        "meaning": "pertaining to, relating to (adjective)"
      }
    ]
  },
  "placid": {
    "prefixes": [],
    "roots": [
      {
        "form": "plac",
        "canonicalId": "placere",
        "displayRoot": "placere / placare",
        "meaning": "to please, calm, soothe",
        "origin": "Latin",
        "pieRoot": "*plak-",
        "pieGroupId": "pie:plak"
      }
    ],
    "suffixes": [
      {
        "form": "-id",
        "meaning": "state or condition (adjective)"
      }
    ]
  },
  "plucky": {
    "prefixes": [],
    "roots": [
      {
        "form": "pluck",
        "canonicalId": "pluccian",
        "displayRoot": "pluccian / plukken",
        "meaning": "to pull, pluck; internal organs, courage",
        "origin": "Old English"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "characterized by, inclined to (adjective)"
      }
    ]
  },
  "plummet": {
    "prefixes": [],
    "roots": [
      {
        "form": "plumm",
        "canonicalId": "plumbum",
        "displayRoot": "plumbum",
        "meaning": "lead, plumb weight",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-et",
        "meaning": "diminutive noun suffix"
      }
    ]
  },
  "ponder": {
    "prefixes": [],
    "roots": [
      {
        "form": "ponder",
        "canonicalId": "pendere",
        "displayRoot": "pendere / pens- / pondus",
        "meaning": "to hang, weigh, ponder, value",
        "origin": "Latin",
        "pieRoot": "*spend-",
        "pieGroupId": "pie:spend"
      }
    ],
    "suffixes": []
  },
  "pragmatic": {
    "prefixes": [],
    "roots": [
      {
        "form": "pragm",
        "canonicalId": "pragma",
        "displayRoot": "prassein / pragma",
        "meaning": "deed, act, business",
        "origin": "Ancient Greek",
        "pieRoot": "*per-",
        "pieGroupId": "pie:per"
      }
    ],
    "suffixes": [
      {
        "form": "-atic",
        "meaning": "pertaining to, of the nature of (adjective)"
      }
    ]
  },
  "prance": {
    "prefixes": [],
    "roots": [
      {
        "form": "pranc",
        "canonicalId": "prangen",
        "displayRoot": "prancen / prangen",
        "meaning": "to boast, flaunt, show off",
        "origin": "Middle English"
      }
    ],
    "suffixes": [
      {
        "form": "-e",
        "meaning": "verb formative"
      }
    ]
  },
  "punctual": {
    "prefixes": [],
    "roots": [
      {
        "form": "punct",
        "canonicalId": "pungere",
        "displayRoot": "pungere / punct-",
        "meaning": "to prick, pierce, sting",
        "origin": "Latin",
        "pieRoot": "*pewg-",
        "pieGroupId": "pie:pewg"
      }
    ],
    "suffixes": [
      {
        "form": "-ual",
        "meaning": "pertaining to, relating to (adjective)"
      }
    ]
  },
  "quaint": {
    "prefixes": [],
    "roots": [
      {
        "form": "quaint",
        "canonicalId": "cognoscere",
        "displayRoot": "cognoscere / gnoscere",
        "meaning": "to know, recognize, examine",
        "origin": "Latin",
        "pieRoot": "*gno-",
        "pieGroupId": "pie:gno"
      }
    ],
    "suffixes": []
  },
  "quirk": {
    "prefixes": [],
    "roots": [
      {
        "form": "quirk",
        "canonicalId": "thweorh",
        "displayRoot": "quirk / þweorh",
        "meaning": "twist, turn, crooked flourish",
        "origin": "Early Modern English",
        "pieRoot": "*twerk-"
      }
    ],
    "suffixes": []
  },
  "resilient": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "back, again"
      }
    ],
    "roots": [
      {
        "form": "sili",
        "canonicalId": "salire",
        "displayRoot": "salire / sult-",
        "meaning": "to leap, jump, spring forth",
        "origin": "Latin",
        "pieRoot": "*sel-",
        "pieGroupId": "pie:sel"
      }
    ],
    "suffixes": [
      {
        "form": "-ent",
        "meaning": "doing, being, or having the quality of (adjective)"
      }
    ]
  },
  "resounding": {
    "prefixes": [
      {
        "form": "re-",
        "canonicalId": "prefix-re",
        "meaning": "again, back"
      }
    ],
    "roots": [
      {
        "form": "sound",
        "canonicalId": "sonare",
        "displayRoot": "sonare",
        "meaning": "to sound, resound",
        "origin": "Latin",
        "pieRoot": "*swen-"
      }
    ],
    "suffixes": [
      {
        "form": "-ing",
        "meaning": "present participle ending (adjective/verb)"
      }
    ]
  },
  "roving": {
    "prefixes": [],
    "roots": [
      {
        "form": "rov",
        "canonicalId": "roven",
        "displayRoot": "roven / rove",
        "meaning": "to shoot arrows at a mark, wander, rove",
        "origin": "Middle English"
      }
    ],
    "suffixes": [
      {
        "form": "-ing",
        "meaning": "action or process (participle ending)"
      }
    ]
  },
  "rustic": {
    "prefixes": [],
    "roots": [
      {
        "form": "rust-",
        "canonicalId": "rus",
        "displayRoot": "rus / rusticus",
        "meaning": "open countryside, rural land",
        "origin": "Latin",
        "pieRoot": "*rewh-"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "serendipity": {
    "prefixes": [],
    "roots": [
      {
        "form": "serendip",
        "canonicalId": "serendip",
        "displayRoot": "Serendip",
        "meaning": "Sri Lanka (historical name)",
        "origin": "Persian"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state or quality (noun)"
      }
    ]
  },
  "skeptical": {
    "prefixes": [],
    "roots": [
      {
        "form": "skept-",
        "canonicalId": "skopein",
        "displayRoot": "skopein / skepsis",
        "meaning": "to look at, examine, reflect",
        "origin": "Greek",
        "pieRoot": "*spek-",
        "pieGroupId": "pie:spek"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      },
      {
        "form": "-al",
        "meaning": "relating to (adjective)"
      }
    ]
  },
  "smoulder": {
    "prefixes": [],
    "roots": [
      {
        "form": "smould-",
        "canonicalId": "smolder",
        "displayRoot": "smolder / smeulen",
        "meaning": "to burn slowly without flame, smoke",
        "origin": "Germanic",
        "pieRoot": "*smel-"
      }
    ],
    "suffixes": [
      {
        "form": "-er",
        "meaning": "frequentative verb suffix"
      }
    ]
  },
  "somber": {
    "prefixes": [
      {
        "form": "som-",
        "canonicalId": "prefix-sub",
        "meaning": "under, beneath"
      }
    ],
    "roots": [
      {
        "form": "br-",
        "canonicalId": "umbra",
        "displayRoot": "umbra",
        "meaning": "shadow, shade",
        "origin": "Latin",
        "pieRoot": "*andho-",
        "pieGroupId": "pie:andho"
      }
    ],
    "suffixes": []
  },
  "splendor": {
    "prefixes": [],
    "roots": [
      {
        "form": "splend-",
        "canonicalId": "splendere",
        "displayRoot": "splendere",
        "meaning": "to shine, gleam brightly",
        "origin": "Latin",
        "pieRoot": "*splend-"
      }
    ],
    "suffixes": [
      {
        "form": "-or",
        "meaning": "state, quality, or condition (noun)"
      }
    ]
  },
  "steadfast": {
    "prefixes": [],
    "roots": [
      {
        "form": "stead",
        "canonicalId": "stede-oe",
        "displayRoot": "stede",
        "meaning": "place, standing, position",
        "origin": "Old English",
        "pieRoot": "*steh₂-",
        "pieGroupId": "pie:steh"
      },
      {
        "form": "fast",
        "canonicalId": "stede-oe",
        "displayRoot": "stede",
        "meaning": "place, standing, position",
        "origin": "Old English",
        "pieRoot": "*steh₂-",
        "pieGroupId": "pie:steh"
      }
    ],
    "suffixes": []
  },
  "stoic": {
    "prefixes": [],
    "roots": [
      {
        "form": "sto-",
        "canonicalId": "stoa",
        "displayRoot": "stoa",
        "meaning": "porch, colonnade",
        "origin": "Greek",
        "pieRoot": "*steh-",
        "pieGroupId": "pie:steh"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "pertaining to (adjective)"
      }
    ]
  },
  "succinct": {
    "prefixes": [
      {
        "form": "suc-",
        "canonicalId": "prefix-sub",
        "meaning": "under, from below"
      }
    ],
    "roots": [
      {
        "form": "cinct",
        "canonicalId": "cingere",
        "displayRoot": "cingere / cinct-",
        "meaning": "to gird, encircle, tuck up",
        "origin": "Latin",
        "pieRoot": "*kenk-"
      }
    ],
    "suffixes": []
  },
  "temperate": {
    "prefixes": [],
    "roots": [
      {
        "form": "temper-",
        "canonicalId": "tempus",
        "displayRoot": "tempus / tempor-",
        "meaning": "time, season, proper measure",
        "origin": "Latin",
        "pieRoot": "*temp-",
        "pieGroupId": "pie:temp"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "having the quality of (adjective)"
      }
    ]
  },
  "tranquil": {
    "prefixes": [
      {
        "form": "tran-",
        "canonicalId": "prefix-trans",
        "meaning": "across, beyond"
      }
    ],
    "roots": [
      {
        "form": "quil",
        "canonicalId": "quies",
        "displayRoot": "quies / quiescere",
        "meaning": "rest, quiet, calm, peace",
        "origin": "Latin",
        "pieRoot": "*kweyh-"
      }
    ],
    "suffixes": []
  },
  "turbulent": {
    "prefixes": [],
    "roots": [
      {
        "form": "turb-",
        "canonicalId": "turba",
        "displayRoot": "turba",
        "meaning": "crowd, tumult, disorder",
        "origin": "Latin",
        "pieRoot": "*twer-"
      }
    ],
    "suffixes": [
      {
        "form": "-ulent",
        "meaning": "full of, abounding in (adjective)"
      }
    ]
  },
  "vigilant": {
    "prefixes": [],
    "roots": [
      {
        "form": "vigil",
        "canonicalId": "vigilare",
        "displayRoot": "vigilare / vigil",
        "meaning": "to keep awake, watch",
        "origin": "Latin",
        "pieRoot": "*weg-",
        "pieGroupId": "pie:weg"
      }
    ],
    "suffixes": [
      {
        "form": "-ant",
        "meaning": "characterized by, being (adjective)"
      }
    ]
  },
  "tenebrific": {
    "prefixes": [],
    "roots": [
      {
        "form": "tenebr-",
        "canonicalId": "tenebrae",
        "displayRoot": "tenebrae",
        "meaning": "darkness, shadows",
        "origin": "Latin",
        "pieRoot": "*temH-",
        "pieGroupId": "pie:temh"
      },
      {
        "form": "fic",
        "canonicalId": "facere",
        "displayRoot": "facere",
        "meaning": "to make, produce",
        "origin": "Latin",
        "pieRoot": "*dʰeh₁-",
        "pieGroupId": "pie:dheh"
      }
    ],
    "suffixes": [
      {
        "form": "-ic",
        "meaning": "causing, tending to, or pertaining to"
      }
    ]
  },
  "efflorescence": {
    "prefixes": [
      {
        "form": "ef-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, forth"
      }
    ],
    "roots": [
      {
        "form": "flor",
        "canonicalId": "flos",
        "displayRoot": "flos",
        "meaning": "flower, bloom, flourish",
        "origin": "Latin",
        "pieRoot": "*bʰleh₃-"
      }
    ],
    "suffixes": [
      {
        "form": "-esc",
        "meaning": "beginning to, becoming (inceptive)"
      },
      {
        "form": "-ence",
        "meaning": "state, quality, or process of"
      }
    ]
  },
  "scruple": {
    "prefixes": [],
    "roots": [
      {
        "form": "scrup",
        "canonicalId": "scrupus",
        "displayRoot": "scrupus",
        "meaning": "sharp pebble, anxiety, uneasiness",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-le",
        "meaning": "diminutive (small)"
      }
    ]
  },
  "grok": {
    "prefixes": [],
    "roots": [
      {
        "form": "grok",
        "canonicalId": "grok",
        "displayRoot": "grok",
        "meaning": "to drink; to understand intuitively and completely",
        "origin": "English (fictional Martian neologism)"
      }
    ],
    "suffixes": []
  },
  "interlocutor": {
    "prefixes": [
      {
        "form": "inter-",
        "canonicalId": "prefix-inter",
        "meaning": "between"
      }
    ],
    "roots": [
      {
        "form": "locut",
        "canonicalId": "loqui",
        "displayRoot": "loqui / locut-",
        "meaning": "to speak",
        "origin": "Latin",
        "pieRoot": "*tlo-kʷ-",
        "pieGroupId": "pie:tlokw"
      }
    ],
    "suffixes": [
      {
        "form": "-or",
        "meaning": "one who, person who performs an action"
      }
    ]
  },
  "bespoke": {
    "prefixes": [
      {
        "form": "be-",
        "canonicalId": "prefix-be",
        "meaning": "about"
      }
    ],
    "roots": [
      {
        "form": "spoke",
        "canonicalId": "sprecan",
        "displayRoot": "sprecan",
        "meaning": "to speak",
        "origin": "Old English"
      }
    ],
    "suffixes": []
  },
  "espalier": {
    "prefixes": [],
    "roots": [
      {
        "form": "spall-",
        "canonicalId": "spalla",
        "displayRoot": "spalla",
        "meaning": "shoulder",
        "origin": "Italian"
      }
    ],
    "suffixes": [
      {
        "form": "-ier",
        "meaning": "thing used for, support (from Italian -iera)"
      }
    ]
  },
  "badinage": {
    "prefixes": [],
    "roots": [
      {
        "form": "bad-",
        "canonicalId": "badar",
        "displayRoot": "badar",
        "meaning": "to gape or open one's mouth foolishly",
        "origin": "Provençal"
      }
    ],
    "suffixes": [
      {
        "form": "-in",
        "meaning": "diminutive suffix forming an adjective/agent or verb base"
      },
      {
        "form": "-age",
        "meaning": "action, process, or result of"
      }
    ]
  },
  "euphemism": {
    "prefixes": [
      {
        "form": "eu-",
        "canonicalId": "prefix-eu",
        "meaning": "good, well"
      }
    ],
    "roots": [
      {
        "form": "phem",
        "canonicalId": "pheme",
        "displayRoot": "pheme",
        "meaning": "speech, utterance",
        "origin": "Greek",
        "pieRoot": "*bʰeh₂-",
        "pieGroupId": "pie:bheh"
      }
    ],
    "suffixes": [
      {
        "form": "-ism",
        "meaning": "process, practice, or result of"
      }
    ]
  },
  "agnostic": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-a",
        "meaning": "without, not"
      }
    ],
    "roots": [
      {
        "form": "gnos",
        "canonicalId": "gignoskein",
        "displayRoot": "gignōskein / gnō-",
        "meaning": "to know, known",
        "origin": "Greek",
        "pieRoot": "*ǵneh₃-",
        "pieGroupId": "pie:gneh"
      }
    ],
    "suffixes": [
      {
        "form": "-tic",
        "meaning": "relating to, of the nature of"
      }
    ]
  },
  "cadence": {
    "prefixes": [],
    "roots": [
      {
        "form": "cad",
        "canonicalId": "cadere",
        "displayRoot": "cadere",
        "meaning": "to fall",
        "origin": "Latin",
        "pieRoot": "*ḱad-",
        "pieGroupId": "pie:kad"
      }
    ],
    "suffixes": [
      {
        "form": "-ence",
        "meaning": "state, quality, or action of"
      }
    ]
  },
  "commiserate": {
    "prefixes": [
      {
        "form": "com-",
        "canonicalId": "prefix-com",
        "meaning": "with, together, intensive"
      }
    ],
    "roots": [
      {
        "form": "miser",
        "canonicalId": "miser",
        "displayRoot": "miser / miserari",
        "meaning": "wretched, to lament or pity",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to act, to cause, to make"
      }
    ]
  },
  "teetotaller": {
    "prefixes": [
      {
        "form": "tee-",
        "canonicalId": "reduplication-t",
        "meaning": "emphatic reduplication of the letter 't' for emphasis"
      }
    ],
    "roots": [
      {
        "form": "total",
        "canonicalId": "totus",
        "displayRoot": "totus",
        "meaning": "all, whole, entire",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-er",
        "meaning": "person associated with or practicing"
      }
    ]
  },
  "hubris": {
    "prefixes": [],
    "roots": [
      {
        "form": "hubris",
        "canonicalId": "hybris",
        "displayRoot": "hybris",
        "meaning": "insolence, wanton violence, outrageous presumption",
        "origin": "Greek"
      }
    ],
    "suffixes": []
  },
  "umwelt": {
    "prefixes": [
      {
        "form": "um-",
        "canonicalId": "prefix-um",
        "meaning": "around"
      }
    ],
    "roots": [
      {
        "form": "welt",
        "canonicalId": "welt",
        "displayRoot": "Welt",
        "meaning": "world",
        "origin": "German"
      }
    ],
    "suffixes": []
  },
  "persiflage": {
    "prefixes": [
      {
        "form": "per-",
        "canonicalId": "prefix-per",
        "meaning": "thoroughly, intensively"
      }
    ],
    "roots": [
      {
        "form": "sifl-",
        "canonicalId": "sibilare",
        "displayRoot": "sibilare",
        "meaning": "to hiss or whistle",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-age",
        "meaning": "action, process, or result of"
      }
    ]
  },
  "hackneyed": {
    "prefixes": [],
    "roots": [
      {
        "form": "hackney",
        "canonicalId": "hackney",
        "displayRoot": "Hackney",
        "meaning": "village celebrated for pasturelands/workhorses; a hired horse subjected to common labor",
        "origin": "Old English"
      }
    ],
    "suffixes": [
      {
        "form": "-ed",
        "meaning": "past participle suffix indicating made into, overworked, or exhausted"
      }
    ]
  },
  "bromide": {
    "prefixes": [],
    "roots": [
      {
        "form": "brom-",
        "canonicalId": "bromos",
        "displayRoot": "brōmos",
        "meaning": "stench",
        "origin": "Greek"
      }
    ],
    "suffixes": [
      {
        "form": "-ide",
        "meaning": "chemical suffix denoting a compound or derivative"
      }
    ]
  },
  "uxorious": {
    "prefixes": [],
    "roots": [
      {
        "form": "uxor",
        "canonicalId": "uxor",
        "displayRoot": "uxor",
        "meaning": "wife",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "full of, having the quality of"
      }
    ]
  },
  "gauche": {
    "prefixes": [],
    "roots": [
      {
        "form": "gauche",
        "canonicalId": "gauchir",
        "displayRoot": "gauchir",
        "meaning": "to turn aside, walk crookedly, left",
        "origin": "Old French"
      }
    ],
    "suffixes": []
  },
  "lavish": {
    "prefixes": [],
    "roots": [
      {
        "form": "lav-",
        "canonicalId": "lavere",
        "displayRoot": "lavare / lavere",
        "meaning": "to wash, bathe, or drench",
        "origin": "Latin",
        "pieRoot": "*lowh₁-",
        "pieGroupId": "pie:lowh"
      }
    ],
    "suffixes": [
      {
        "form": "-ish",
        "meaning": "forming an adjective or noun (from French -asse)"
      }
    ]
  },
  "adroit": {
    "prefixes": [
      {
        "form": "a-",
        "canonicalId": "prefix-ad",
        "meaning": "to, toward"
      }
    ],
    "roots": [
      {
        "form": "droit",
        "canonicalId": "regere",
        "displayRoot": "regere / directus",
        "meaning": "straight, right, direct",
        "origin": "Latin",
        "pieRoot": "*reg-",
        "pieGroupId": "pie:reg"
      }
    ],
    "suffixes": []
  },
  "fidelity": {
    "prefixes": [],
    "roots": [
      {
        "form": "fidel-",
        "canonicalId": "fidere",
        "displayRoot": "fidere / fides",
        "meaning": "trust, faith",
        "origin": "Latin",
        "pieRoot": "*bʰeydʰ-",
        "pieGroupId": "pie:bheydh"
      }
    ],
    "suffixes": [
      {
        "form": "-ity",
        "meaning": "state, quality, or condition of"
      }
    ]
  },
  "epiphany": {
    "prefixes": [
      {
        "form": "epi-",
        "canonicalId": "prefix-epi",
        "meaning": "upon"
      }
    ],
    "roots": [
      {
        "form": "phan",
        "canonicalId": "phainein",
        "displayRoot": "phainein",
        "meaning": "to show, appear",
        "origin": "Greek",
        "pieRoot": "*bʰeh₂-",
        "pieGroupId": "pie:bheh"
      }
    ],
    "suffixes": [
      {
        "form": "-y",
        "meaning": "state, quality, or instance of"
      }
    ]
  },
  "scintillating": {
    "prefixes": [],
    "roots": [
      {
        "form": "scintill",
        "canonicalId": "scintilla",
        "displayRoot": "scintilla",
        "meaning": "spark",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to make, cause to be, or produce"
      },
      {
        "form": "-ing",
        "meaning": "expressing the present participle or ongoing action"
      }
    ]
  },
  "incendiary": {
    "prefixes": [
      {
        "form": "in-",
        "canonicalId": "prefix-in",
        "meaning": "into, upon"
      }
    ],
    "roots": [
      {
        "form": "cend",
        "canonicalId": "candere",
        "displayRoot": "candere",
        "meaning": "to glow or shine",
        "origin": "Latin",
        "pieRoot": "*kand-",
        "pieGroupId": "pie:kand"
      }
    ],
    "suffixes": [
      {
        "form": "-ium",
        "meaning": "forming abstract or collective nouns (here via incendium)"
      },
      {
        "form": "-ary",
        "meaning": "pertaining to, of the nature of, or one connected with"
      }
    ]
  },
  "persona": {
    "prefixes": [],
    "roots": [
      {
        "form": "persona",
        "canonicalId": "persona",
        "displayRoot": "persona",
        "meaning": "mask, dramatic character",
        "origin": "Latin"
      }
    ],
    "suffixes": []
  },
  "profane": {
    "prefixes": [
      {
        "form": "pro-",
        "canonicalId": "prefix-pro",
        "meaning": "before, outside"
      }
    ],
    "roots": [
      {
        "form": "-fan-",
        "canonicalId": "fanum",
        "displayRoot": "fanum",
        "meaning": "temple, sacred precinct",
        "origin": "Latin",
        "pieRoot": "*dʰh₁s-no-",
        "pieGroupId": "pie:dhhsno"
      }
    ],
    "suffixes": []
  },
  "unilateral": {
    "prefixes": [],
    "roots": [
      {
        "form": "uni-",
        "canonicalId": "unus",
        "displayRoot": "unus",
        "meaning": "one",
        "origin": "Latin",
        "pieRoot": "*oi-no-",
        "pieGroupId": "pie:oino"
      },
      {
        "form": "later-",
        "canonicalId": "latus",
        "displayRoot": "latus",
        "meaning": "side",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-al",
        "meaning": "pertaining to or of the nature of"
      }
    ]
  },
  "titillate": {
    "prefixes": [],
    "roots": [
      {
        "form": "titill",
        "canonicalId": "titillare",
        "displayRoot": "titillare",
        "meaning": "to tickle, provoke pleasurable irritation",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ate",
        "meaning": "to cause, make, or act upon"
      }
    ]
  },
  "supersede": {
    "prefixes": [
      {
        "form": "super-",
        "canonicalId": "prefix-super",
        "meaning": "above, over"
      }
    ],
    "roots": [
      {
        "form": "sede",
        "canonicalId": "sedere",
        "displayRoot": "sedere",
        "meaning": "to sit",
        "origin": "Latin",
        "pieRoot": "*sed-",
        "pieGroupId": "pie:sed"
      }
    ],
    "suffixes": []
  },
  "exuberance": {
    "prefixes": [
      {
        "form": "ex-",
        "canonicalId": "prefix-ex",
        "meaning": "thoroughly"
      }
    ],
    "roots": [
      {
        "form": "uber",
        "canonicalId": "uber",
        "displayRoot": "uber",
        "meaning": "udder, fertile breast, fruitful",
        "origin": "Latin",
        "pieRoot": "*h₁ówHdʰ-r̥",
        "pieGroupId": "pie:howhdhr"
      }
    ],
    "suffixes": [
      {
        "form": "-ance",
        "meaning": "state or quality of"
      }
    ]
  },
  "veto": {
    "prefixes": [],
    "roots": [
      {
        "form": "veto",
        "canonicalId": "vetare",
        "displayRoot": "vetare / veto",
        "meaning": "to forbid, prohibit, oppose",
        "origin": "Latin"
      }
    ],
    "suffixes": []
  },
  "symbiosis": {
    "prefixes": [
      {
        "form": "sym-",
        "canonicalId": "prefix-syn",
        "meaning": "together, with"
      }
    ],
    "roots": [
      {
        "form": "bio",
        "canonicalId": "bios",
        "displayRoot": "bios / biont-",
        "meaning": "life, living organism",
        "origin": "Greek",
        "pieRoot": "*gʷei-",
        "pieGroupId": "pie:gwei"
      }
    ],
    "suffixes": [
      {
        "form": "-sis",
        "meaning": "state, condition, or process of (noun)"
      }
    ]
  },
  "erosion": {
    "prefixes": [
      {
        "form": "e-",
        "canonicalId": "prefix-ex",
        "meaning": "out of, away, completely"
      }
    ],
    "roots": [
      {
        "form": "ros",
        "canonicalId": "rodere",
        "displayRoot": "rodere / ros-",
        "meaning": "to gnaw, wear away",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ion",
        "meaning": "act, process, or result of (noun)"
      }
    ]
  },
  "boycott": {
    "prefixes": [],
    "roots": [
      {
        "form": "boycott",
        "canonicalId": "boycott",
        "displayRoot": "Boycott",
        "meaning": "Captain Charles Boycott (eponymous collective refusal)",
        "origin": "English"
      }
    ],
    "suffixes": []
  },
  "jargon": {
    "prefixes": [],
    "roots": [
      {
        "form": "jargon",
        "canonicalId": "jargon",
        "displayRoot": "jargon / gergon",
        "meaning": "chattering of birds, specialized speech",
        "origin": "Old French"
      }
    ],
    "suffixes": []
  },
  "satire": {
    "prefixes": [],
    "roots": [
      {
        "form": "satire",
        "canonicalId": "satis",
        "displayRoot": "satis / satura",
        "meaning": "full, enough, medley",
        "origin": "Latin",
        "pieRoot": "*seh₂-",
        "pieGroupId": "pie:seh"
      }
    ],
    "suffixes": []
  },
  "nuance": {
    "prefixes": [],
    "roots": [
      {
        "form": "nu",
        "canonicalId": "nubes",
        "displayRoot": "nubes / nue",
        "meaning": "cloud, shade, soft gradation",
        "origin": "French",
        "pieRoot": "*nebʰ-"
      }
    ],
    "suffixes": [
      {
        "form": "-ance",
        "meaning": "state or quality of (noun)"
      }
    ]
  },
  "dogma": {
    "prefixes": [],
    "roots": [
      {
        "form": "dog",
        "canonicalId": "doxa",
        "displayRoot": "doxa / dogma",
        "meaning": "opinion, belief, seem, decree",
        "origin": "Ancient Greek",
        "pieRoot": "*dek-",
        "pieGroupId": "pie:dek"
      }
    ],
    "suffixes": [
      {
        "form": "-ma",
        "meaning": "result or object of an action (noun)"
      }
    ]
  },
  "mundane": {
    "prefixes": [],
    "roots": [
      {
        "form": "mund",
        "canonicalId": "mundus",
        "displayRoot": "mundus",
        "meaning": "world, earthly sphere; clean, ordered",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ane",
        "meaning": "belonging to, characteristic of (adjective)"
      }
    ]
  },
  "veneer": {
    "prefixes": [],
    "roots": [
      {
        "form": "veneer",
        "canonicalId": "fournir",
        "displayRoot": "furnieren / fournir",
        "meaning": "to furnish, equip, overlay thinly",
        "origin": "German"
      }
    ],
    "suffixes": []
  },
  "dubious": {
    "prefixes": [],
    "roots": [
      {
        "form": "dub",
        "canonicalId": "dubius",
        "displayRoot": "dubius / duo",
        "meaning": "two-way, wavering, doubtful",
        "origin": "Latin",
        "pieRoot": "*dwóh₁"
      }
    ],
    "suffixes": [
      {
        "form": "-ious",
        "meaning": "characterized by, full of (adjective)"
      }
    ]
  },
  "empirical": {
    "prefixes": [
      {
        "form": "em-",
        "canonicalId": "prefix-in",
        "meaning": "in, into, upon"
      }
    ],
    "roots": [
      {
        "form": "pir",
        "canonicalId": "peira",
        "displayRoot": "peira / empeiria",
        "meaning": "trial, test, practical experience",
        "origin": "Greek",
        "pieRoot": "*per-",
        "pieGroupId": "pie:per"
      }
    ],
    "suffixes": [
      {
        "form": "-ical",
        "meaning": "pertaining to, characterized by (adjective)"
      }
    ]
  },
  "axiom": {
    "prefixes": [],
    "roots": [
      {
        "form": "ax",
        "canonicalId": "agein",
        "displayRoot": "axios / agein",
        "meaning": "worthy, weighing equally, to lead or balance",
        "origin": "Greek",
        "pieRoot": "*aǵ-",
        "pieGroupId": "pie:ag"
      }
    ],
    "suffixes": [
      {
        "form": "-iom",
        "meaning": "result or principle established (noun)"
      }
    ]
  },
  "aloof": {
    "prefixes": [],
    "roots": [
      {
        "form": "aloof",
        "canonicalId": "loef",
        "displayRoot": "loef / luff",
        "meaning": "windward side of a ship; steered clear",
        "origin": "Dutch"
      }
    ],
    "suffixes": []
  },
  "brazen": {
    "prefixes": [],
    "roots": [
      {
        "form": "braz",
        "canonicalId": "braes-oe",
        "displayRoot": "bræs",
        "meaning": "brass, bronze, hardened metal",
        "origin": "Old English"
      }
    ],
    "suffixes": [
      {
        "form": "-en",
        "meaning": "made of, resembling in quality (adjective)"
      }
    ]
  },
  "fickle": {
    "prefixes": [],
    "roots": [
      {
        "form": "fick",
        "canonicalId": "ficol-oe",
        "displayRoot": "ficol",
        "meaning": "deceitful, restless, changeable",
        "origin": "Old English"
      }
    ],
    "suffixes": [
      {
        "form": "-le",
        "meaning": "prone to, characterized by (adjective)"
      }
    ]
  },
  "profound": {
    "prefixes": [
      {
        "form": "pro-",
        "canonicalId": "prefix-pro",
        "meaning": "forth, forward, before"
      }
    ],
    "roots": [
      {
        "form": "found",
        "canonicalId": "fundus",
        "displayRoot": "fundus",
        "meaning": "bottom, base, depth",
        "origin": "Latin",
        "pieRoot": "*bʰudʰ-"
      }
    ],
    "suffixes": []
  },
  "volatile": {
    "prefixes": [],
    "roots": [
      {
        "form": "volat",
        "canonicalId": "volare",
        "displayRoot": "volare / volatilis",
        "meaning": "to fly, take wing, fleeting",
        "origin": "Latin"
      }
    ],
    "suffixes": [
      {
        "form": "-ile",
        "meaning": "capable of, prone to (adjective)"
      }
    ]
  }
};

export function getWordMorphemeProfile(
  wordOrKey: string | Pick<Word, 'word'>
): WordMorphemeProfile | undefined {
  const key = (typeof wordOrKey === 'string' ? wordOrKey : wordOrKey.word).toLowerCase();
  return WORD_MORPHEMES[key];
}

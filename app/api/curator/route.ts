import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerSupabaseClient } from '../../../utils/supabase/server';
import {
  Word,
  SeedType,
  DifficultyTier,
  TopicCategory,
  FieldNoteAlternativeEntry,
} from '../../../types';
import { RAW_WORDS as BUNDLED_RAW_WORDS } from '../../../utils/data';
import {
  WORD_MORPHEMES as BUNDLED_WORD_MORPHEMES,
  WordMorphemeProfile,
} from '../../../utils/morphemes';
import { FIELD_NOTE_ALTERNATIVES as BUNDLED_FIELD_ALTERNATIVES } from '../../../utils/fieldAlternatives';
import { CURATED_FIELD_QUOTES } from '../../../utils/fieldQuotes';
import { extractWordMorphemes } from '../../../utils/etymology';
import { findSimilarLexiconWords } from '../../../utils/wordSimilarity';
import { getWordDifficulty, getWordTopic } from '../../../constants';

export const dynamic = 'force-dynamic';

let memoryWordsCache: Word[] | null = null;
let memoryMorphemesCache: Record<string, WordMorphemeProfile> | null = null;
let memoryFieldAltsCache: Record<string, FieldNoteAlternativeEntry> | null = null;
let memoryStagedCache: (Word & { id: string })[] | null = null;
let diskWordsWriteFailed = false;
let diskMorphemesWriteFailed = false;
let diskFieldAltsWriteFailed = false;
let diskStagedWriteFailed = false;
let warnedMissingServiceRole = false;

const DATA_TS_PATH = path.join(process.cwd(), 'utils', 'data.ts');
const MORPHEMES_TS_PATH = path.join(process.cwd(), 'utils', 'morphemes.ts');
const FIELD_ALTS_TS_PATH = path.join(process.cwd(), 'utils', 'fieldAlternatives.ts');
const LEGACY_DATA_TS_PATH = path.join(process.cwd(), '..', 'growcabulary', 'utils', 'data.ts');
const STAGED_JSON_PATH = path.join(
  process.cwd(),
  'scripts',
  'staged-decks',
  'specimen-expansion-staged.json'
);

export interface AuditedWord extends Word {
  index: number;
  auditFlags: string[];
  maskedPreview: string;
  morphemes?: WordMorphemeProfile;
}

// Curated reserve pool of high-caliber candidates when regenerating without an API key
const RESERVE_CANDIDATE_POOL: Word[] = [
  {
    word: 'Palimpsest',
    seed: 'conservatory',
    topic: 'literature',
    form: 'noun',
    definition: 'Something reused or altered but still bearing visible traces of its earlier form.',
    definition2: 'A manuscript or piece of writing material on which original writing has been effaced to make room for later writing.',
    etymology: "From Greek 'palimpsēstos', from 'palin' (again) + 'psēstos' (scraped), because medieval scribes scraped parchment clean to reuse it, though faint traces of the older text remained beneath.",
    example: 'The historic city center is an architectural palimpsest where Roman foundations support medieval walls and modern glass facades.',
    origin: 'Greek',
  },
  {
    word: 'Chiaroscuro',
    seed: 'conservatory',
    topic: 'architecture',
    form: 'noun',
    definition: 'The treatment of light and shade in drawing, painting, or architecture to create dramatic spatial depth.',
    definition2: 'An effect of contrasted light and shadow created by light falling unevenly or from a particular direction.',
    etymology: "From Italian 'chiaroscuro', a compound of 'chiaro' (clear, bright; from Latin 'clarus') and 'oscuro' (dark, obscure; from Latin 'obscurus').",
    example: 'Narrow skylights carved into the concrete dome cast a dramatic chiaroscuro across the gallery floor.',
    origin: 'Italian',
  },
  {
    word: 'Crepuscular',
    seed: 'conservatory',
    topic: 'biology',
    form: 'adjective',
    definition: 'Relating to, resembling, or active during twilight (dawn and dusk).',
    definition2: 'Dim, indistinct, or imperfectly illuminated like the half-light of evening.',
    etymology: "From Latin 'crepusculum' (twilight, dusk), diminutive of 'creper' (dark, dusky, doubtful). In ecology, it distinguishes animals active at twilight from diurnal and nocturnal species.",
    example: 'Deer and fireflies are crepuscular creatures that emerge in the cool stillness of dusk.',
    origin: 'Latin',
  },
  {
    word: 'Riparian',
    seed: 'conservatory',
    topic: 'biology',
    form: 'adjective',
    definition: 'Relating to or situated on the banks of a river or stream.',
    definition2: 'Relating to wetlands adjacent to rivers and natural watercourses.',
    etymology: "From Latin 'riparius', derived from 'ripa' meaning 'riverbank' or 'shore' (the same root that gave French 'rivière' and English 'arrive', literally 'to reach the shore').",
    example: 'Willows and alders stabilize the riparian zone, filtering runoff before it enters the trout stream.',
    origin: 'Latin',
  },
  {
    word: 'Casuistry',
    seed: 'conservatory',
    topic: 'philosophy',
    form: 'noun',
    definition: 'The use of clever but unsound or oversubtle reasoning, especially in relation to moral or legal questions; sophistry.',
    definition2: 'The resolving of moral problems by applying theoretical ethical rules to specific cases.',
    etymology: "From French 'casuiste' or Spanish 'casuista', from Latin 'casus' (case, event, fall). Originally a respected theological method of case-by-case moral reasoning, it later acquired the sense of specious excuse-making.",
    example: 'Critics dismissed the minister’s defense as pure casuistry designed to excuse a clear breach of ethics.',
    origin: 'Latin',
  },
  {
    word: 'Antinomy',
    seed: 'conservatory',
    topic: 'philosophy',
    form: 'noun',
    definition: 'A contradiction between two beliefs or conclusions that are in themselves reasonable; a paradox.',
    definition2: 'A mutual incompatibility of two laws or principles.',
    etymology: "From Greek 'antinomia', from 'anti-' (against) + 'nomos' (law). Immanuel Kant famously used antinomy to describe four pairs of contradictory yet seemingly provable cosmological claims.",
    example: 'The jurist wrestled with the fundamental antinomy between absolute free expression and protection from defamation.',
    origin: 'Greek',
  },
  {
    word: 'Equanimity',
    seed: 'meadow',
    topic: 'emotions',
    form: 'noun',
    definition: 'Mental calmness, composure, and evenness of temper, especially in a difficult situation.',
    definition2: 'Balance of mind that neither elation nor adversity can easily disturb.',
    etymology: "From Latin 'aequanimitas', from 'aequus' (even, level, equal) + 'animus' (mind, spirit). Literally 'evenness of mind'.",
    example: 'She accepted both the unexpected praise and the harsh critique with remarkable equanimity.',
    origin: 'Latin',
  },
  {
    word: 'Schadenfreude',
    seed: 'meadow',
    topic: 'emotions',
    form: 'noun',
    definition: 'Pleasure derived by someone from another person’s misfortune.',
    definition2: 'Malicious or secret satisfaction obtained from witnessing the setbacks of a rival.',
    etymology: "Borrowed directly from German 'Schadenfreude', a compound of 'Schaden' (harm, damage) and 'Freude' (joy).",
    example: 'He felt a fleeting twinge of schadenfreude when his arrogant rival’s presentation crashed.',
    origin: 'German',
  },
  {
    word: 'Perspicacious',
    seed: 'conservatory',
    topic: 'general',
    form: 'adjective',
    definition: 'Having a ready insight into and understanding of things; mentally sharp or discerning.',
    definition2: 'Able to see through superficial appearances to grasp hidden truths.',
    etymology: "From Latin 'perspicax' (sharp-sighted), from the verb 'perspicere' meaning 'to look closely into' or 'see through' (per- 'through' + specere 'to look').",
    example: 'The perspicacious analyst spotted the accounting discrepancy months before the market noticed.',
    origin: 'Latin',
  },
  {
    word: 'Redolent',
    seed: 'meadow',
    topic: 'general',
    form: 'adjective',
    definition: 'Strongly reminiscent or suggestive of something; evocative.',
    definition2: 'Fragrant or sweet-smelling; diffusing an odor.',
    etymology: "From Old French 'redolent' or Latin 'redolent-', present participle of 'redolere' (to emit a scent), from 're-' (intensive) + 'olere' (to smell).",
    example: 'The old cedar library was redolent of beeswax, leather bindings, and woodsmoke.',
    origin: 'Latin',
  },
  {
    word: 'Verisimilitude',
    seed: 'conservatory',
    topic: 'literature',
    form: 'noun',
    definition: 'The appearance of being true or real; likeness to truth.',
    definition2: 'The use of realistic detail in literature or art to create a convincing world.',
    etymology: "From Latin 'verisimilitudo', from 'verus' (true) + 'similis' (like). Literally 'truth-likeness'.",
    example: 'The novelist included authentic 18th-century ship logs to give the sea voyage an unmistakable verisimilitude.',
    origin: 'Latin',
  },
  {
    word: 'Halcyon',
    seed: 'meadow',
    topic: 'general',
    form: 'adjective',
    definition: 'Denoting a period of time in the past that was idyllically happy and peaceful.',
    definition2: 'Calm, peaceful, and untroubled (originally applied to the winter sea).',
    etymology: "From Greek 'alkyōn' (kingfisher), altered to 'halkyōn' by association with 'hals' (sea) + 'kyein' (to conceive). Ancient myth held that the kingfisher nested on the sea during the winter solstice and charmed the waves into calm.",
    example: 'She often looked back on the halcyon summers spent painting in the quiet coastal village.',
    origin: 'Greek',
  },
];

function readMorphemesFromDisk(): Record<string, WordMorphemeProfile> {
  if (diskMorphemesWriteFailed && memoryMorphemesCache) {
    return { ...memoryMorphemesCache };
  }
  try {
    const fileContent = fs.readFileSync(MORPHEMES_TS_PATH, 'utf8');
    const objMatch = fileContent.match(/export\s+const\s+WORD_MORPHEMES[\s\S]*?=\s*(\{[\s\S]*?\n\});/);
    if (objMatch) {
      const parsed = vm.runInNewContext(`(${objMatch[1]})`, {}) as Record<
        string,
        WordMorphemeProfile
      >;
      if (parsed && typeof parsed === 'object') {
        memoryMorphemesCache = { ...parsed };
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Falling back to bundled/in-memory WORD_MORPHEMES:', err);
  }
  return memoryMorphemesCache ? { ...memoryMorphemesCache } : { ...BUNDLED_WORD_MORPHEMES };
}

function writeMorphemesToDisk(morphemesMap: Record<string, WordMorphemeProfile>) {
  memoryMorphemesCache = { ...morphemesMap };
  const serialized = `import { Word } from '../types';

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

export const WORD_MORPHEMES: Record<string, WordMorphemeProfile> = ${JSON.stringify(morphemesMap, null, 2)};

export function getWordMorphemeProfile(
  wordOrKey: string | Pick<Word, 'word'>
): WordMorphemeProfile | undefined {
  const key = (typeof wordOrKey === 'string' ? wordOrKey : wordOrKey.word).toLowerCase();
  return WORD_MORPHEMES[key];
}
`;
  try {
    fs.writeFileSync(MORPHEMES_TS_PATH, serialized, 'utf8');
    diskMorphemesWriteFailed = false;
  } catch (err) {
    diskMorphemesWriteFailed = true;
    console.warn('Read-only filesystem: skipped writing utils/morphemes.ts to disk', err);
  }
}

function normalizePieGroupId(pieRoot: string | undefined | null): string | undefined {
  if (!pieRoot) return undefined;
  let s = pieRoot.split('/')[0].trim();
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[₁₂₃₄]/g, '');
  s = s.replace(/ʰ/g, 'h').replace(/ʷ/g, 'w').replace(/ǵ/g, 'g').replace(/ḱ/g, 'k');
  s = s.replace(/m̥|n̥|r̥/g, (ch) => ch[0]);
  s = s.replace(/[()*\s-]/g, '').toLowerCase();
  s = s.replace(/h[123]/g, 'h');
  return s.length >= 2 ? `pie:${s}` : undefined;
}

async function generateMorphemeProfileForWord(
  word: Word,
  apiKey: string | undefined,
  existingMap: Record<string, WordMorphemeProfile>
): Promise<WordMorphemeProfile> {
  const resolvedKey = resolveGeminiKey(apiKey);
  if (resolvedKey && word.etymology?.trim()) {
    try {
      const sampleCanonIds = new Set<string>();
      for (const prof of Object.values(existingMap)) {
        for (const r of prof.roots || []) {
          if (r.canonicalId) sampleCanonIds.add(r.canonicalId);
        }
      }
      const prompt = `Decompose "${word.word}" (origin: ${word.origin}) into accurate etymological morphemes grounded strictly in this etymology:
"${word.etymology}"

Return ONLY a valid JSON object:
{
  "prefixes": [{"form": "e.g. con-", "canonicalId": "e.g. prefix-com", "meaning": "..."}],
  "roots": [{"form": "stem", "canonicalId": "lowercase lemma e.g. facere or regere", "displayRoot": "e.g. facere / fect-", "meaning": "...", "origin": "Latin/Greek/etc.", "pieRoot": "*...-" or null}],
  "suffixes": [{"form": "e.g. -ity", "meaning": "..."}]
}
Reuse canonical prefix IDs like prefix-ab, prefix-ad, prefix-ante, prefix-anti, prefix-com, prefix-de, prefix-dia, prefix-dis, prefix-ex, prefix-in, prefix-inter, prefix-ob, prefix-per, prefix-pre, prefix-pro, prefix-re, prefix-sub, prefix-super, prefix-syn, prefix-trans, prefix-a.
Reuse matching existing canonical root IDs when applicable: ${Array.from(sampleCanonIds).slice(0, 140).join(', ')}.`;
      const rawJson = await generateGeminiJsonText(resolvedKey, prompt, 15000);
      const parsed = parseJsonSafe<Partial<WordMorphemeProfile>>(rawJson, {});
      if (Array.isArray(parsed.roots) && parsed.roots.length > 0) {
        return {
          prefixes: Array.isArray(parsed.prefixes) ? parsed.prefixes : [],
          roots: parsed.roots.map((r) => {
            const pieGroupId = normalizePieGroupId(r.pieRoot);
            return {
              form: r.form || word.word.toLowerCase(),
              canonicalId: (r.canonicalId || word.word).toLowerCase().trim(),
              displayRoot: r.displayRoot || r.canonicalId || word.word.toLowerCase(),
              meaning: r.meaning || '',
              origin: r.origin || word.origin || 'Latin',
              ...(r.pieRoot ? { pieRoot: r.pieRoot } : {}),
              ...(pieGroupId ? { pieGroupId } : {}),
            };
          }),
          suffixes: Array.isArray(parsed.suffixes) ? parsed.suffixes : [],
        };
      }
    } catch (err) {
      console.warn(`Morpheme generation fallback for "${word.word}":`, err);
    }
  }

  // Fallback: extract via narrative heuristics in utils/etymology.ts
  const extracted = extractWordMorphemes(word);
  return {
    prefixes: extracted
      .filter((m) => m.isPrefix)
      .map((m) => ({ form: m.displayRoot, canonicalId: m.id, meaning: m.meaning })),
    roots: extracted
      .filter((m) => !m.isPrefix && !m.id.startsWith('lex:'))
      .map((m) => ({
        form: m.displayRoot.split('/')[0].trim(),
        canonicalId: m.id.replace(/^root:/, ''),
        displayRoot: m.displayRoot,
        meaning: m.meaning,
        origin: m.origin || word.origin,
      })),
    suffixes: [],
  };
}

function readFieldAlternativesFromDisk(): Record<string, FieldNoteAlternativeEntry> {
  if (diskFieldAltsWriteFailed && memoryFieldAltsCache) {
    return { ...memoryFieldAltsCache };
  }
  try {
    const fileContent = fs.readFileSync(FIELD_ALTS_TS_PATH, 'utf8');
    const objMatch = fileContent.match(
      /export\s+const\s+FIELD_NOTE_ALTERNATIVES[\s\S]*?=\s*(\{[\s\S]*?\n\});/
    );
    if (objMatch) {
      const parsed = vm.runInNewContext(`(${objMatch[1]})`, {}) as Record<
        string,
        FieldNoteAlternativeEntry
      >;
      if (parsed && typeof parsed === 'object') {
        memoryFieldAltsCache = { ...parsed };
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Falling back to bundled/in-memory FIELD_NOTE_ALTERNATIVES:', err);
  }
  return memoryFieldAltsCache
    ? { ...memoryFieldAltsCache }
    : { ...BUNDLED_FIELD_ALTERNATIVES };
}

function writeFieldAlternativesToDisk(altsMap: Record<string, FieldNoteAlternativeEntry>) {
  memoryFieldAltsCache = { ...altsMap };
  const sortedKeys = Object.keys(altsMap)
    .sort()
    .filter(
      (k) =>
        (altsMap[k]?.strongFits?.length || 0) > 0 ||
        (altsMap[k]?.plausibleFits?.length || 0) > 0
    );
  const bodyLines = sortedKeys.map(
    (k) =>
      `  ${JSON.stringify(k)}: { strongFits: ${JSON.stringify(
        altsMap[k].strongFits || []
      )}, plausibleFits: ${JSON.stringify(altsMap[k].plausibleFits || [])} },`
  );
  const serialized = `import type { FieldNoteAlternativeEntry, Word } from '../types';

export type { FieldNoteAlternativeEntry };
export type FieldNoteFitTier = 'exact' | 'strong' | 'plausible' | 'none';

export interface FieldNoteEvaluation {
  tier: FieldNoteFitTier;
  scoreMultiplier: number;
}

export const FIELD_NOTE_ALTERNATIVES: Record<string, FieldNoteAlternativeEntry> = {
${bodyLines.join('\n')}
};

export function evaluateFieldNoteChoice(
  targetWord: string | Word,
  candidateWord: string
): FieldNoteEvaluation {
  const targetStr = typeof targetWord === 'string' ? targetWord : targetWord.word;
  const targetLower = targetStr.trim().toLowerCase();
  const candidateLower = candidateWord.trim().toLowerCase();
  if (!candidateLower) {
    return { tier: 'none', scoreMultiplier: 0 };
  }
  if (candidateLower === targetLower) {
    return { tier: 'exact', scoreMultiplier: 1 };
  }
  const dbEntry = typeof targetWord === 'string' ? undefined : targetWord.fieldAlternatives;
  const entry =
    dbEntry && (dbEntry.strongFits?.length || dbEntry.plausibleFits?.length)
      ? dbEntry
      : FIELD_NOTE_ALTERNATIVES[targetLower];
  if (!entry) {
    return { tier: 'none', scoreMultiplier: 0 };
  }
  if (entry.strongFits?.some((w) => w.toLowerCase() === candidateLower)) {
    return { tier: 'strong', scoreMultiplier: 0.75 };
  }
  if (entry.plausibleFits?.some((w) => w.toLowerCase() === candidateLower)) {
    return { tier: 'plausible', scoreMultiplier: 0.4 };
  }
  return { tier: 'none', scoreMultiplier: 0 };
}
`;
  try {
    fs.writeFileSync(FIELD_ALTS_TS_PATH, serialized, 'utf8');
    diskFieldAltsWriteFailed = false;
  } catch (err) {
    diskFieldAltsWriteFailed = true;
    console.warn('Read-only filesystem: skipped writing utils/fieldAlternatives.ts to disk', err);
  }
}

async function generateFieldAlternativesForWord(
  targetWord: Word,
  allWords: Word[],
  clientApiKey?: string
): Promise<FieldNoteAlternativeEntry> {
  const targetLower = targetWord.word.trim().toLowerCase();
  const samePosWords = allWords.filter(
    (w) =>
      w.form.trim().toLowerCase() === targetWord.form.trim().toLowerCase() &&
      w.word.trim().toLowerCase() !== targetLower
  );
  const samePosSet = new Set(samePosWords.map((w) => w.word.trim().toLowerCase()));
  const resolvedKey = resolveGeminiKey(clientApiKey);
  if (!resolvedKey || samePosWords.length === 0) {
    return { strongFits: [], plausibleFits: [] };
  }

  const passage = (targetWord.fieldQuote || targetWord.example || '').trim();
  const escapedTarget = targetWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blanked = passage.replace(new RegExp(`\\b${escapedTarget}[a-z]*\\b`, 'gi'), '_____');
  const lexiconRef = samePosWords.map((w) => `${w.word}: ${w.definition}`).join('\n');

  const prompt = `Pick ONLY real same-part-of-speech words from the ALLOWED LEXICON that genuinely fit the "_____" blank.

TARGET: "${targetWord.word}" (${targetWord.form}) — ${targetWord.definition}
PASSAGE: ${blanked}

ALLOWED LEXICON:
${lexiconRef}

Return strictly JSON:
{
  "strongFits": ["0 to 3 nearly interchangeable words from ALLOWED LEXICON"],
  "plausibleFits": ["0 to 4 grammatically natural and semantically plausible words from ALLOWED LEXICON"]
}
Never force weak fits or invent words outside ALLOWED LEXICON.`;

  try {
    const raw = await generateGeminiJsonText(resolvedKey, prompt, 12000);
    const parsed = parseJsonSafe<Partial<FieldNoteAlternativeEntry>>(raw, {});
    const strongFits: string[] = [];
    const strongSet = new Set<string>();
    for (const c of Array.isArray(parsed.strongFits) ? parsed.strongFits : []) {
      if (typeof c !== 'string') continue;
      const lower = c.trim().toLowerCase();
      if (lower && samePosSet.has(lower) && !strongSet.has(lower) && strongFits.length < 3) {
        strongSet.add(lower);
        strongFits.push(lower);
      }
    }
    const plausibleFits: string[] = [];
    const plausibleSet = new Set<string>();
    for (const c of Array.isArray(parsed.plausibleFits) ? parsed.plausibleFits : []) {
      if (typeof c !== 'string') continue;
      const lower = c.trim().toLowerCase();
      if (
        lower &&
        samePosSet.has(lower) &&
        !strongSet.has(lower) &&
        !plausibleSet.has(lower) &&
        plausibleFits.length < 4
      ) {
        plausibleSet.add(lower);
        plausibleFits.push(lower);
      }
    }
    return { strongFits, plausibleFits };
  } catch {
    return { strongFits: [], plausibleFits: [] };
  }
}

function readRawWordsFromDisk(): Word[] {
  if (diskWordsWriteFailed && memoryWordsCache) {
    return [...memoryWordsCache];
  }
  try {
    const fileContent = fs.readFileSync(DATA_TS_PATH, 'utf8');
    const runnableCode = fileContent
      .replace(/import\s+.*?from\s+['"][^'"]+['"];?/g, '')
      .replace(/export\s+const\s+RAW_WORDS\s*:\s*Word\[\]\s*=/, 'const RAW_WORDS =')
      .concat('\n;RAW_WORDS;');

    const sandbox: Record<string, unknown> = {};
    const result = vm.runInNewContext(runnableCode, sandbox);
    if (Array.isArray(result)) {
      memoryWordsCache = [...(result as Word[])];
      return result as Word[];
    }
  } catch (err) {
    console.warn('Falling back to bundled/in-memory RAW_WORDS:', err);
  }
  return memoryWordsCache ? [...memoryWordsCache] : [...BUNDLED_RAW_WORDS];
}

function serializeWordsToDataTs(words: Word[]): string {
  const sectionOrder: { seed: DifficultyTier; header: string }[] = [
    { seed: 'conservatory', header: 'CONSERVATORY' },
    { seed: 'meadow', header: 'MEADOW' },
    { seed: 'garden', header: 'PASTURE (GARDEN)' },
  ];

  const lines: string[] = [
    "import { Word } from '../types';",
    '',
    'export const RAW_WORDS: Word[] = [',
  ];

  for (const sec of sectionOrder) {
    const inSection = words.filter((w) => getWordDifficulty(w) === sec.seed);
    if (inSection.length === 0) continue;
    lines.push(`  // --- ${sec.header} ---`);
    for (const w of inSection) {
      const normalizedSeed = getWordDifficulty(w);
      const normalizedTopic = getWordTopic(w);
      const fields: string[] = [
        `word: ${JSON.stringify(w.word)}`,
        `seed: ${JSON.stringify(normalizedSeed)}`,
        `topic: ${JSON.stringify(normalizedTopic)}`,
        `form: ${JSON.stringify(w.form)}`,
        `definition: ${JSON.stringify(w.definition)}`,
      ];
      if (w.definition2 && w.definition2.trim()) {
        fields.push(`definition2: ${JSON.stringify(w.definition2.trim())}`);
      }
      fields.push(`etymology: ${JSON.stringify(w.etymology)}`);
      fields.push(`example: ${JSON.stringify(w.example)}`);
      if (w.fieldQuote && w.fieldQuote.trim()) {
        fields.push(`fieldQuote: ${JSON.stringify(w.fieldQuote.trim())}`);
      }
      if (w.fieldQuoteAuthor && w.fieldQuoteAuthor.trim()) {
        fields.push(`fieldQuoteAuthor: ${JSON.stringify(w.fieldQuoteAuthor.trim())}`);
      }
      fields.push(`origin: ${JSON.stringify(w.origin)}`);
      lines.push(`  { ${fields.join(', ')} },`);
    }
    lines.push('');
  }

  lines.push('];');
  lines.push('');
  return lines.join('\n');
}

function writeRawWordsToDisk(words: Word[]) {
  memoryWordsCache = [...words];
  const serialized = serializeWordsToDataTs(words);
  try {
    fs.writeFileSync(DATA_TS_PATH, serialized, 'utf8');
    diskWordsWriteFailed = false;
  } catch (err) {
    diskWordsWriteFailed = true;
    console.warn('Read-only filesystem: skipped writing utils/data.ts to disk', err);
  }
  if (!diskWordsWriteFailed && fs.existsSync(LEGACY_DATA_TS_PATH)) {
    try {
      fs.writeFileSync(LEGACY_DATA_TS_PATH, serialized, 'utf8');
    } catch {
      // Ignore if legacy path is locked
    }
  }
}

function maskWordInExample(example: string, word: string): string {
  if (!example || !word) return '';
  const stem =
    word.length > 3 ? word.toLowerCase().replace(/[ey]$/i, '') : word.toLowerCase();
  const regex = new RegExp(`\\b${stem}[a-z]*\\b`, 'gi');

  return example.replace(regex, (match) => {
    const maskLen = Math.min(match.length, word.length);
    const suffix = match.slice(maskLen);
    return '•'.repeat(maskLen) + suffix;
  });
}

function auditWords(
  words: Word[],
  morphemesMap?: Record<string, WordMorphemeProfile>
): AuditedWord[] {
  const counts = new Map<string, number>();
  words.forEach((w) => {
    const key = w.word.trim().toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const resolvedMorphemes = morphemesMap || readMorphemesFromDisk();

  return words.map((w, index) => {
    const flags: string[] = [];
    const lowerKey = w.word.trim().toLowerCase();
    if ((counts.get(lowerKey) || 0) > 1) {
      flags.push('duplicate');
    }

    const maskedPreview = maskWordInExample(w.example, w.word);
    if (!maskedPreview.includes('•')) {
      flags.push('mask-mismatch');
    }

    if (w.definition.includes(';') && (!w.definition2 || !w.definition2.trim())) {
      flags.push('semicolon-def');
    }

    if (!w.etymology || w.etymology.trim().length < 45) {
      flags.push('short-etymology');
    }

    const morph = resolvedMorphemes[lowerKey];
    if (!morph || (!morph.roots?.length && !morph.prefixes?.length)) {
      flags.push('missing-morphemes');
    }

    const curatedQuote = CURATED_FIELD_QUOTES[lowerKey];

    return {
      ...w,
      fieldQuote: w.fieldQuote || curatedQuote?.quote || undefined,
      fieldQuoteAuthor: w.fieldQuoteAuthor || curatedQuote?.author || undefined,
      index,
      auditFlags: flags,
      maskedPreview,
      morphemes: morph,
    };
  });
}

export interface VerifiedWiktionaryQuote {
  quote: string;
  author: string;
  type: string;
  score: number;
}

function matchesWordOrStemInQuote(word: string, quote: string): boolean {
  const k = (word || '').trim().toLowerCase();
  if (!k) return false;
  const stem = k.length > 4 ? k.replace(/(?:e|y|ing|ed|es|s)$/i, '') : k;
  const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}[a-z'-]*\\b`, 'i').test(quote);
}

function extractEnglishWiktionarySection(wt: string): string {
  const idx = wt.indexOf('==English==');
  if (idx === -1) return '';
  const rest = wt.slice(idx + 11);
  const nextLang = rest.search(/\n==[^=]/);
  return nextLang === -1 ? rest : rest.slice(0, nextLang);
}

function extractWiktionaryQuoteTemplates(wt: string): Array<{ type: string; raw: string }> {
  const results: Array<{ type: string; raw: string }> = [];
  const startRe = /\{\{(?:quote-(book|journal|news|web|text|hansard|av)|RQ:[A-Za-z0-9_:-]+)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = startRe.exec(wt)) !== null) {
    const type = (m[1] || 'book').toLowerCase();
    let depth = 0;
    let i = m.index;
    while (i < wt.length) {
      if (wt[i] === '{' && wt[i + 1] === '{') {
        depth++;
        i += 2;
      } else if (wt[i] === '}' && wt[i + 1] === '}') {
        depth--;
        i += 2;
        if (depth === 0) {
          results.push({ type, raw: wt.slice(m.index, i) });
          break;
        }
      } else {
        i++;
      }
    }
  }
  return results;
}

function parseWiktionaryTemplateParams(raw: string): Record<string, string> {
  const inner = raw.slice(2, -2);
  const parts: string[] = [];
  let cur = '';
  let braceDepth = 0;
  let bracketDepth = 0;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    const next = inner[i + 1];
    if (c === '{' && next === '{') {
      braceDepth++;
      cur += '{{';
      i++;
      continue;
    }
    if (c === '}' && next === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      cur += '}}';
      i++;
      continue;
    }
    if (c === '[' && next === '[') {
      bracketDepth++;
      cur += '[[';
      i++;
      continue;
    }
    if (c === ']' && next === ']') {
      bracketDepth = Math.max(0, bracketDepth - 1);
      cur += ']]';
      i++;
      continue;
    }
    if (c === '|' && braceDepth === 0 && bracketDepth === 0) {
      parts.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  parts.push(cur);
  const params: Record<string, string> = {};
  for (let i = 1; i < parts.length; i++) {
    const eq = parts[i].indexOf('=');
    if (eq !== -1) {
      const k = parts[i].slice(0, eq).trim().toLowerCase();
      const v = parts[i].slice(eq + 1).trim();
      params[k] = v;
    }
  }
  return params;
}

function cleanWiktionaryMarkup(str?: string): string {
  if (!str) return '';
  let s = str;
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  s = s.replace(/<ref[^>]*\/>/gi, '');
  s = s.replace(/<\/?(?:sup|sub|span|i|b|em|strong|small|br)\b[^>]*>/gi, ' ');
  s = s.replace(/\{\{(?:nbsp|nbhyph)\}\}/gi, ' ');
  s = s.replace(/\{\{\.\.\.\}\}/g, '...');
  s = s.replace(/\{\{SIC\}\}/gi, '');
  s = s.replace(/\{\{(?:q|qual|qualifier|gloss)\|([^|}]+)\}\}/gi, '($1)');
  s = s.replace(/\{\{(?:w|wp|lw)\|([^|}]+)\|([^|}]+)\}\}/gi, '$2');
  s = s.replace(/\{\{(?:w|wp|lw)\|([^|}]+)\}\}/gi, '$1');
  s = s.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2');
  s = s.replace(/\[\[(?:[a-z]+:)?([^\]]+)\]\]/g, '$1');
  s = s.replace(/'''([^']*)'''/g, '$1');
  s = s.replace(/''([^']*)''/g, '$1');
  s = s
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function formatWiktionaryAuthor(params: Record<string, string>): string | null {
  let author = cleanWiktionaryMarkup(
    params.author || params.author1 || params.editor || params.authors || ''
  );
  let title = cleanWiktionaryMarkup(
    params.title || params.work || params.journal || params.newspaper || params.magazine || ''
  );
  const journal = cleanWiktionaryMarkup(
    params.journal || params.newspaper || params.magazine || params.work || ''
  );
  const yearMatch = (params.year || params.date || '').match(/\b(1[5-9]\d{2}|20[0-2]\d)\b/);
  const year = yearMatch ? yearMatch[1] : '';

  if (author.includes('{{') || title.includes('{{') || journal.includes('{{')) return null;
  if (!author && !title && !journal) return null;

  author = author.replace(/^(?:w|s|q):/i, '').trim();
  title = title.replace(/^(?:w|s|q):/i, '').trim();

  const parts: string[] = [];
  if (author) parts.push(author);
  if (title && title !== author) {
    parts.push(title);
  } else if (journal && journal !== author) {
    parts.push(journal);
  }
  if (parts.length === 0) return null;
  let res = parts.join(', ');
  if (year) res += ` (${year})`;
  return res;
}

function extractVerifiedQuotesFromWikitext(
  word: string,
  wt: string
): VerifiedWiktionaryQuote[] {
  const en = extractEnglishWiktionarySection(wt);
  if (!en) return [];
  const templates = extractWiktionaryQuoteTemplates(en);
  const candidates: VerifiedWiktionaryQuote[] = [];
  const seenQuotes = new Set<string>();

  for (const t of templates) {
    const p = parseWiktionaryTemplateParams(t.raw);
    const rawPassage = p.passage || p.text || p.quote || '';
    if (!rawPassage) continue;
    if (p.lang && p.lang !== 'en') continue;
    const quote = cleanWiktionaryMarkup(rawPassage);
    if (!quote || quote.length < 35 || quote.length > 300) continue;
    if (/\{\{|\}\}|\[\[|\]\]|<|>|https?:\/\//i.test(quote)) continue;
    if (!matchesWordOrStemInQuote(word, quote)) continue;

    const author = formatWiktionaryAuthor(p);
    if (!author || author.length < 4 || author.length > 125) continue;
    if (/\{\{|\}\}|\[\[|\]\]|<|>|https?:\/\//i.test(author)) continue;

    const normQuote = quote.toLowerCase();
    if (seenQuotes.has(normQuote)) continue;
    seenQuotes.add(normQuote);

    let score = 0;
    if (t.type === 'book') score += 30;
    else if (t.type === 'journal' || t.type === 'news') score += 15;
    else score += 5;

    if (p.author || p.author1) score += 20;
    if (/[.!?]["'”’]?$/.test(quote)) score += 10;
    if (quote.length >= 55 && quote.length <= 220) score += 10;
    const yearMatch = author.match(/\((\d{4})\)/);
    if (yearMatch) {
      const y = parseInt(yearMatch[1], 10);
      if (y >= 1800) score += 10;
      if (y < 1700) score -= 15;
    }

    candidates.push({ quote, author, type: t.type, score });
  }

  // Also parse plain `#* Year, Author, ''Title'':\n#*: Passage` lines in Wiktionary
  const lines = en.split(/\r?\n/);
  for (let i = 0; i < lines.length - 1; i++) {
    const headerLine = lines[i].trim();
    const passageLine = lines[i + 1].trim();
    if (
      /^#\*+\s+[^:]/.test(headerLine) &&
      !headerLine.includes('{{quote-') &&
      /^#\*+:\s+\S/.test(passageLine)
    ) {
      const rawHeader = headerLine.replace(/^#\*+\s+/, '');
      const rawPassage = passageLine.replace(/^#\*+:\s+/, '');
      if (rawHeader.includes('{{') || rawPassage.includes('{{')) continue;

      const quote = cleanWiktionaryMarkup(rawPassage);
      if (!quote || quote.length < 35 || quote.length > 300) continue;
      if (/\{\{|\}\}|\[\[|\]\]|<|>|https?:\/\//i.test(quote)) continue;
      if (!matchesWordOrStemInQuote(word, quote)) continue;

      const yearM = rawHeader.match(/\b(1[6-9]\d{2}|20[0-2]\d)\b/);
      const titleM = rawHeader.match(/''([^']{3,90})''/);
      const cleanedHeader = cleanWiktionaryMarkup(rawHeader);
      if (!yearM && !titleM) continue;

      // Try extracting author between year and italicized title
      let authorPart = '';
      if (titleM && titleM.index !== undefined) {
        const beforeTitle = cleanWiktionaryMarkup(rawHeader.slice(0, titleM.index))
          .replace(/^\d{4}\s*[,.\-–—]?\s*(?:[A-Z][a-z]+\s+\d{1,2}\s*,?\s*)?/, '')
          .replace(/[,:\s]+$/, '')
          .trim();
        if (beforeTitle.length >= 3 && beforeTitle.length <= 60) {
          authorPart = beforeTitle;
        }
      }
      const titlePart = titleM ? cleanWiktionaryMarkup(titleM[1]).replace(/[,:\s]+$/, '') : '';
      const pieces = [authorPart, titlePart].filter(Boolean);
      let author = pieces.length > 0 ? pieces.join(', ') : cleanedHeader.slice(0, 90);
      if (yearM && !author.includes(yearM[1])) {
        author += ` (${yearM[1]})`;
      }
      if (!author || author.length < 5 || author.length > 125) continue;

      const normQuote = quote.toLowerCase();
      if (seenQuotes.has(normQuote)) continue;
      seenQuotes.add(normQuote);

      candidates.push({
        quote,
        author,
        type: 'wiktionary-line',
        score: (authorPart ? 25 : 10) + (titlePart ? 15 : 0) + (yearM ? 10 : 0),
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

async function fetchVerifiedWiktionaryQuotesMap(
  wordsList: string[],
  timeoutMs = 3500
): Promise<Map<string, VerifiedWiktionaryQuote[]>> {
  const result = new Map<string, VerifiedWiktionaryQuote[]>();
  const cleanWords = Array.from(
    new Set(wordsList.map((w) => (w || '').trim()).filter(Boolean))
  );
  if (cleanWords.length === 0) return result;

  try {
    const titles = cleanWords.map((w) => w.toLowerCase()).join('|');
    const url = `https://en.wiktionary.org/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=main&format=json&redirects=1&titles=${encodeURIComponent(
      titles
    )}`;
    const res = await fetchWithAbortTimeout(
      url,
      {
        headers: {
          'User-Agent':
            'GrowcabularyCurator/1.0 (https://growcabulary.com; contact@growcabulary.com)',
        },
      },
      timeoutMs,
      'Wiktionary verified quote lookup'
    );
    if (!res.ok) return result;
    const data = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          {
            missing?: unknown;
            title?: string;
            revisions?: Array<{ slots?: { main?: { '*'?: string } } }>;
          }
        >;
        redirects?: Array<{ from: string; to: string }>;
      };
    };

    const pages = data.query?.pages || {};
    const byTitle = new Map<string, string>();
    for (const p of Object.values(pages)) {
      if (p.missing !== undefined) continue;
      const wt = p.revisions?.[0]?.slots?.main?.['*'] || '';
      if (p.title && wt) {
        byTitle.set(p.title.toLowerCase(), wt);
      }
    }
    const redirects = new Map<string, string>();
    for (const r of data.query?.redirects || []) {
      redirects.set(r.from.toLowerCase(), r.to.toLowerCase());
    }

    for (const w of cleanWords) {
      const lower = w.toLowerCase();
      const resolved = redirects.get(lower) || lower;
      const wt = byTitle.get(resolved) || byTitle.get(lower) || '';
      if (!wt) continue;
      const quotes = extractVerifiedQuotesFromWikitext(w, wt);
      if (quotes.length > 0) {
        result.set(lower, quotes);
      }
    }
  } catch {
    // Non-fatal: if Wiktionary is unreachable, return empty map (never hallucinate)
  }
  return result;
}

function readStagedWords(): (Word & { id: string })[] {
  if (diskStagedWriteFailed && memoryStagedCache) {
    return [...memoryStagedCache];
  }
  if (!fs.existsSync(STAGED_JSON_PATH)) {
    return memoryStagedCache ? [...memoryStagedCache] : [];
  }
  try {
    const raw = JSON.parse(fs.readFileSync(STAGED_JSON_PATH, 'utf8'));
    const parsed = Array.isArray(raw.words) ? raw.words : [];
    memoryStagedCache = [...parsed];
    return parsed;
  } catch {
    return memoryStagedCache ? [...memoryStagedCache] : [];
  }
}

function writeStagedWords(stagedWords: (Word & { id: string })[]) {
  memoryStagedCache = [...stagedWords];
  const dir = path.dirname(STAGED_JSON_PATH);
  let baseObj = {
    deck: {
      slug: 'specimen-expansion',
      title: 'Curated Specimen Expansion Batch',
      status: 'staged_for_curator_review',
      generated_at: new Date().toISOString(),
    },
    words: stagedWords,
  };
  if (fs.existsSync(STAGED_JSON_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(STAGED_JSON_PATH, 'utf8'));
      baseObj = { ...existing, words: stagedWords };
    } catch {
      // use default baseObj
    }
  }
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STAGED_JSON_PATH, JSON.stringify(baseObj, null, 2), 'utf8');
    diskStagedWriteFailed = false;
  } catch (err) {
    diskStagedWriteFailed = true;
    console.warn('Read-only filesystem: skipped writing staged words JSON to disk', err);
  }
}

function isPlaceholderKey(k?: string | null): boolean {
  if (!k || !k.trim()) return true;
  const t = k.trim();
  return (
    t === 'PLACEHOLDER_API_KEY' ||
    t === 'your-gemini-api-key' ||
    t.includes('your_key')
  );
}

function resolveGeminiKey(clientKey?: string): string | null {
  if (clientKey && !isPlaceholderKey(clientKey)) {
    return clientKey.trim();
  }
  const envKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (envKey && !isPlaceholderKey(envKey)) {
    return envKey.trim();
  }
  return null;
}

async function fetchWithAbortTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  label = 'Request'
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name?: string }).name === 'AbortError'
    ) {
      throw new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function parseJsonSafe<T>(rawText: string | undefined, fallback: T): T {
  if (!rawText) return fallback;
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (
      firstBracket !== -1 &&
      lastBracket > firstBracket &&
      (firstBrace === -1 || firstBracket < firstBrace)
    ) {
      try {
        return JSON.parse(cleaned.slice(firstBracket, lastBracket + 1)) as T;
      } catch {
        // fall through
      }
    }
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        // fall through
      }
    }
    return fallback;
  }
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        thought?: boolean;
      }>;
    };
  }>;
}

async function callGeminiRestGenerate(
  apiKey: string,
  model: string,
  prompt: string,
  timeoutMs: number,
  includeThinkingConfig: boolean
): Promise<
  | { ok: true; data: GeminiGenerateResponse }
  | { ok: false; status: number; message: string }
> {
  const generationConfig: Record<string, unknown> = {
    responseMimeType: 'application/json',
    temperature: 0.4,
    maxOutputTokens: 1500,
  };
  if (includeThinkingConfig) {
    generationConfig.thinkingConfig = {
      thinkingLevel: 'LOW',
    };
  }

  const res = await fetchWithAbortTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      }),
    },
    timeoutMs,
    'Gemini AI generation'
  );

  if (!res.ok) {
    let message = res.statusText || `HTTP ${res.status}`;
    try {
      const errData = (await res.json()) as { error?: { message?: string } };
      if (errData?.error?.message) {
        message = errData.error.message;
      }
    } catch {
      // Keep statusText fallback if error body is not JSON
    }
    return { ok: false, status: res.status, message };
  }

  const data = (await res.json()) as GeminiGenerateResponse;
  return { ok: true, data };
}

async function generateGeminiJsonText(
  apiKey: string,
  prompt: string,
  timeoutMs = 22000
): Promise<string> {
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const primary = await callGeminiRestGenerate(apiKey, modelName, prompt, timeoutMs, true);

  let responseData: GeminiGenerateResponse;
  if (primary.ok) {
    responseData = primary.data;
  } else {
    const isThinkingOrSupportError =
      (primary.status === 400 || primary.status === 404) &&
      /thinking|thinkinglevel|thinkingconfig|not found|not supported/i.test(primary.message);

    if (primary.status === 404 || isThinkingOrSupportError) {
      const fallbackModel =
        primary.status === 404 && modelName !== 'gemini-3.8-flash'
          ? 'gemini-3.8-flash'
          : modelName;
      const fallback = await callGeminiRestGenerate(
        apiKey,
        fallbackModel,
        prompt,
        12000,
        false
      );
      if (!fallback.ok) {
        throw new Error(fallback.message);
      }
      responseData = fallback.data;
    } else {
      throw new Error(primary.message);
    }
  }

  const parts = responseData?.candidates?.[0]?.content?.parts ?? [];
  const answerText = parts
    .filter((part) => !part.thought && typeof part.text === 'string')
    .map((part) => part.text as string)
    .join('');

  if (answerText) {
    return answerText;
  }

  return parts
    .filter((part) => typeof part.text === 'string')
    .map((part) => part.text as string)
    .join('');
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!serviceKey && anonKey && !warnedMissingServiceRole) {
    warnedMissingServiceRole = true;
    console.warn(
      'SUPABASE_SERVICE_ROLE_KEY is missing; falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY (curator word writes may fail RLS).'
    );
  }
  const key = serviceKey || anonKey;
  if (!url || !key || url.includes('your-project-id') || key.includes('your-supabase')) {
    return null;
  }
  return createClient(url, key);
}

async function syncWordToSupabase(
  w: Word,
  previousWordTerm?: string,
  fieldAlternatives?: FieldNoteAlternativeEntry
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
    const { data: deckRow, error: deckErr } = await supabase
      .from('decks')
      .select('id')
      .eq('slug', getWordDifficulty(w))
      .maybeSingle();
    if (deckErr) {
      console.warn('Supabase deck lookup failed during word sync:', deckErr.message);
      return;
    }
    if (!deckRow?.id) return;

    if (previousWordTerm && previousWordTerm.toLowerCase() !== w.word.toLowerCase()) {
      const { error: delErr } = await supabase
        .from('words')
        .delete()
        .ilike('term', previousWordTerm);
      if (delErr) {
        console.warn('Supabase previous word cleanup failed:', delErr.message);
      }
    }

    // Remove any stale rows for this term in other difficulty decks if tier changed
    const { error: staleDeckErr } = await supabase
      .from('words')
      .delete()
      .ilike('term', w.word)
      .neq('deck_id', deckRow.id);
    if (staleDeckErr) {
      console.warn('Supabase stale deck cleanup failed:', staleDeckErr.message);
    }

    const basePayload = {
      deck_id: deckRow.id,
      term: w.word,
      part_of_speech: w.form,
      definition: w.definition,
      definition2: w.definition2 || null,
      etymology: w.etymology,
      origin: w.origin,
      example_sentence: w.example,
      status: 'approved',
    };

    const resolvedAlts = fieldAlternatives ?? w.fieldAlternatives ?? null;

    const { error: upsertErr } = await supabase.from('words').upsert(
      {
        ...basePayload,
        topic: getWordTopic(w),
        field_quote: w.fieldQuote || null,
        field_quote_author: w.fieldQuoteAuthor || null,
        field_alternatives: resolvedAlts,
      },
      { onConflict: 'deck_id,term' }
    );
    if (upsertErr) {
      // If 004_word_game_metadata.sql has not been applied yet, fall back cleanly to base schema
      if (
        /column|schema cache|field_quote|field_alternatives|own_words_scenario|topic/i.test(
          upsertErr.message
        )
      ) {
        const { error: fallbackErr } = await supabase
          .from('words')
          .upsert(basePayload, { onConflict: 'deck_id,term' });
        if (fallbackErr) {
          console.warn(`Supabase fallback word sync failed for "${w.word}":`, fallbackErr.message);
        }
      } else {
        console.warn(`Supabase word sync failed for "${w.word}":`, upsertErr.message);
      }
    }
  } catch (err) {
    console.warn(`Supabase word sync error for "${w.word}":`, err);
  }
}

async function deleteWordFromSupabase(term: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
    await Promise.all([
      supabase.from('words').delete().ilike('term', term),
      supabase.from('user_word_progress').delete().ilike('word_term', term),
    ]);
  } catch {
    // Non-blocking cloud delete
  }
}

async function loadWordsMergedWithSupabase(): Promise<Word[]> {
  const diskWords = readRawWordsFromDisk();
  const supabase = getSupabaseAdmin();
  if (!supabase) return diskWords;

  try {
    type CloudWordRow = {
      term: string;
      part_of_speech: string;
      definition: string;
      definition2?: string | null;
      etymology: string;
      origin?: string | null;
      example_sentence: string;
      field_quote?: string | null;
      field_quote_author?: string | null;
      topic?: string | null;
      field_alternatives?: Word['fieldAlternatives'] | null;
      decks?: { slug?: string } | Array<{ slug?: string }> | null;
    };

    const extendedSelect =
      'term, part_of_speech, definition, definition2, etymology, origin, example_sentence, field_quote, field_quote_author, topic, field_alternatives, decks!inner(slug)';
    const midSelect =
      'term, part_of_speech, definition, definition2, etymology, origin, example_sentence, topic, field_alternatives, decks!inner(slug)';
    const baseSelect =
      'term, part_of_speech, definition, definition2, etymology, origin, example_sentence, decks!inner(slug)';

    const extRes = await supabase
      .from('words')
      .select(extendedSelect)
      .eq('status', 'approved');

    let cloudRows = extRes.data as CloudWordRow[] | null;
    let queryError = extRes.error;

    if (queryError && /field_quote/i.test(queryError.message)) {
      const midRes = await supabase
        .from('words')
        .select(midSelect)
        .eq('status', 'approved');
      cloudRows = midRes.data as CloudWordRow[] | null;
      queryError = midRes.error;
    }

    if (
      queryError &&
      /column|schema cache|topic|field_alternatives/i.test(queryError.message)
    ) {
      const baseRes = await supabase
        .from('words')
        .select(baseSelect)
        .eq('status', 'approved');
      cloudRows = baseRes.data as CloudWordRow[] | null;
      queryError = baseRes.error;
    }

    if (queryError || !Array.isArray(cloudRows) || cloudRows.length === 0) {
      return diskWords;
    }

    const byKey = new Map<string, number>();
    const merged = [...diskWords];
    merged.forEach((w, idx) => {
      byKey.set(w.word.trim().toLowerCase(), idx);
    });

    let addedFromCloud = 0;
    for (const row of cloudRows) {
      if (!row.term) continue;
      const key = row.term.trim().toLowerCase();
      const existingIdx = byKey.get(key);
      const existing = existingIdx !== undefined ? merged[existingIdx] : undefined;
      const deckRel = Array.isArray(row.decks) ? row.decks[0] : row.decks;
      const deckSlug = (deckRel?.slug || existing?.seed || 'meadow') as SeedType;
      const validTopic =
        row.topic &&
        [
          'general',
          'emotions',
          'philosophy',
          'biology',
          'architecture',
          'statecraft',
          'literature',
        ].includes(row.topic)
          ? (row.topic as TopicCategory)
          : existing?.topic;

      if (existingIdx === undefined) {
        const cloudWord: Word = {
          word: row.term.trim(),
          seed: getWordDifficulty({ seed: deckSlug }),
          topic: validTopic || getWordTopic({ seed: deckSlug }),
          form: row.part_of_speech || 'noun',
          definition: row.definition || '',
          ...(row.definition2 ? { definition2: row.definition2 } : {}),
          etymology: row.etymology || '',
          origin: row.origin || 'Latin',
          example: row.example_sentence || '',
          ...(row.field_quote ? { fieldQuote: row.field_quote } : {}),
          ...(row.field_quote_author ? { fieldQuoteAuthor: row.field_quote_author } : {}),
          ...(row.field_alternatives ? { fieldAlternatives: row.field_alternatives } : {}),
        };
        byKey.set(key, merged.length);
        merged.push(cloudWord);
        addedFromCloud++;
      } else if (existing) {
        // Hydrate any missing cloud fields (e.g. fieldQuote added on deployed site)
        merged[existingIdx] = {
          ...existing,
          ...(row.field_quote && !existing.fieldQuote ? { fieldQuote: row.field_quote } : {}),
          ...(row.field_quote_author && !existing.fieldQuoteAuthor
            ? { fieldQuoteAuthor: row.field_quote_author }
            : {}),
        };
      }
    }

    if (addedFromCloud > 0) {
      writeRawWordsToDisk(merged);
    } else {
      memoryWordsCache = [...merged];
    }
    return merged;
  } catch {
    return diskWords;
  }
}

async function verifyCuratorAccess(): Promise<{
  authorized: boolean;
  mode: 'local-dev' | 'admin-email' | 'denied';
  userEmail: string | null;
  configuredAdminEmails: string[];
}> {
  const isDev = process.env.NODE_ENV === 'development';
  const rawAdminEnv = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
  const configuredAdminEmails = rawAdminEnv
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => Boolean(e) && !e.includes('your-admin-email'));

  // Fast-path local development mode so API calls never stall on remote session lookups
  if (isDev) {
    return {
      authorized: true,
      mode: 'local-dev',
      userEmail: null,
      configuredAdminEmails,
    };
  }

  let userEmail: string | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email?.trim().toLowerCase() || null;
  } catch {
    // Not signed in or Supabase unconfigured
  }

  if (userEmail && configuredAdminEmails.includes(userEmail)) {
    return {
      authorized: true,
      mode: 'admin-email',
      userEmail,
      configuredAdminEmails,
    };
  }

  return {
    authorized: false,
    mode: 'denied',
    userEmail,
    configuredAdminEmails,
  };
}

export async function GET() {
  try {
    const access = await verifyCuratorAccess();
    if (!access.authorized) {
      return NextResponse.json(
        {
          error:
            'Curator Studio is restricted to local development mode or a signed-in Administrator email.',
          unauthorized: true,
          userEmail: access.userEmail,
        },
        { status: 403 }
      );
    }

    const words = await loadWordsMergedWithSupabase();
    const audited = auditWords(words);
    const staged = readStagedWords();
    const hasEnvGeminiKey = Boolean(resolveGeminiKey());

    return NextResponse.json({
      words: audited,
      staged,
      totalCount: audited.length,
      hasEnvGeminiKey,
      authContext: {
        mode: access.mode,
        userEmail: access.userEmail,
        hasAdminEmailConfigured: access.configuredAdminEmails.length > 0,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load lexicon';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const access = await verifyCuratorAccess();
    if (!access.authorized) {
      return NextResponse.json(
        {
          error:
            'Curator Studio is restricted to local development mode or a signed-in Administrator email.',
          unauthorized: true,
          userEmail: access.userEmail,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action } = body;
    const words = await loadWordsMergedWithSupabase();

    if (action === 'fetch_wiktionary_quote') {
      const { word, currentQuote } = body as {
        word?: string;
        currentQuote?: string;
      };
      const cleanTerm = (word || '').trim();
      if (!cleanTerm) {
        return NextResponse.json(
          { error: 'Enter a word first to look up a verified Wiktionary quote.' },
          { status: 400 }
        );
      }

      const lower = cleanTerm.toLowerCase();
      const quotesMap = await fetchVerifiedWiktionaryQuotesMap([cleanTerm], 5000);
      const wikiQuotes = quotesMap.get(lower) || [];
      const curated = CURATED_FIELD_QUOTES[lower];
      const allVerified: VerifiedWiktionaryQuote[] = [...wikiQuotes];
      if (
        curated &&
        !allVerified.some((q) => q.quote.toLowerCase() === curated.quote.toLowerCase())
      ) {
        allVerified.push({
          quote: curated.quote,
          author: curated.author,
          type: 'curated',
          score: 100,
        });
      }

      if (allVerified.length === 0) {
        return NextResponse.json({
          found: false,
          totalCandidates: 0,
          fieldQuote: '',
          fieldQuoteAuthor: '',
          message: `No verified literary quote found on English Wiktionary for "${cleanTerm}". Leave Field Quote blank so the game uses your Example Sentence without a hallucinated citation.`,
        });
      }

      // Cycle to the next verified quote if currentQuote matches one of them
      const curNorm = (currentQuote || '').trim().toLowerCase();
      const curIdx = curNorm
        ? allVerified.findIndex((q) => q.quote.toLowerCase() === curNorm)
        : -1;
      const nextIdx = curIdx >= 0 ? (curIdx + 1) % allVerified.length : 0;
      const picked = allVerified[nextIdx];

      return NextResponse.json({
        found: true,
        totalCandidates: allVerified.length,
        candidateIndex: nextIdx + 1,
        fieldQuote: picked.quote,
        fieldQuoteAuthor: picked.author,
        message:
          allVerified.length > 1
            ? `✓ Loaded verified Wiktionary quote (${nextIdx + 1} of ${allVerified.length} — click again to cycle)`
            : '✓ Loaded verified Wiktionary quote',
      });
    }

    if (action === 'enrich_word') {
      // Auto-populate fields (form, definition, definition2, etymology, example, origin, suggested difficulty & topic) for a given word
      const { word, targetSeed, targetTopic, apiKey } = body as {
        word: string;
        targetSeed?: SeedType;
        targetTopic?: TopicCategory;
        apiKey?: string;
      };
      const cleanTerm = (word || '').trim();
      if (!cleanTerm) {
        return NextResponse.json(
          { error: 'Please enter a word first before auto-populating.' },
          { status: 400 }
        );
      }

      const fallbackDifficulty = getWordDifficulty({ seed: targetSeed || 'meadow' });
      const fallbackTopic =
        targetTopic || getWordTopic({ seed: targetSeed, topic: targetTopic });

      // Step 1: Check if word already exists in our curated RESERVE_CANDIDATE_POOL
      const matchInReserve = RESERVE_CANDIDATE_POOL.find(
        (w) => w.word.toLowerCase() === cleanTerm.toLowerCase()
      );
      if (matchInReserve) {
        return NextResponse.json({
          enriched: {
            ...matchInReserve,
            seed: targetSeed ? getWordDifficulty({ seed: targetSeed }) : matchInReserve.seed,
            topic: targetTopic || getWordTopic(matchInReserve),
          },
          source: 'lexicon-cache',
        });
      }

      // Step 2: Fetch verified dictionary senses AND real Wiktionary quotations in parallel
      // (We never ask Gemini to invent literary quotes or author citations.)
      const lowerTerm = cleanTerm.toLowerCase();
      const curatedExistingQuote = CURATED_FIELD_QUOTES[lowerTerm];
      const wiktionaryPromise = fetchVerifiedWiktionaryQuotesMap([cleanTerm], 3500);

      let dictionaryContext = '';
      let fallbackDictEntry: {
        pos: string;
        def1: string;
        def2: string;
        example: string;
        origin: string;
      } | null = null;

      try {
        const dictRes = await fetchWithAbortTimeout(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
            lowerTerm
          )}`,
          {},
          1500,
          'Dictionary reference lookup'
        );
        if (dictRes.ok) {
          const dictData = await dictRes.json();
          const entry = dictData[0];
          const meaningsSummary: string[] = [];
          if (Array.isArray(entry?.meanings)) {
            for (const m of entry.meanings.slice(0, 3)) {
              const defs = (m.definitions || [])
                .slice(0, 2)
                .map((d: { definition?: string }) => d.definition)
                .filter(Boolean);
              if (defs.length > 0) {
                meaningsSummary.push(`(${m.partOfSpeech}) ${defs.join(' | ')}`);
              }
            }
          }
          if (entry?.origin) {
            meaningsSummary.push(`Recorded origin note: ${entry.origin}`);
          }
          if (meaningsSummary.length > 0) {
            dictionaryContext = `\nVerified Dictionary Reference for "${cleanTerm}":\n${meaningsSummary.join('\n')}\n`;
          }

          const firstMeaning = entry?.meanings?.[0];
          fallbackDictEntry = {
            pos: firstMeaning?.partOfSpeech || 'noun',
            def1: firstMeaning?.definitions?.[0]?.definition || '',
            def2:
              firstMeaning?.definitions?.[1]?.definition ||
              entry?.meanings?.[1]?.definitions?.[0]?.definition ||
              '',
            example:
              firstMeaning?.definitions?.find((d: { example?: string }) => d.example)
                ?.example || '',
            origin: entry?.origin || '',
          };
        }
      } catch {
        // Proceed directly with Gemini even if dictionary API is unreachable
      }

      const resolvedKey = resolveGeminiKey(apiKey);
      let geminiWarning: string | null = null;
      if (resolvedKey) {
        try {
          const prompt = `Write a scholarly Growcabulary lexicon entry for "${cleanTerm}".${dictionaryContext}

Standards:
1. "definition" & "definition2": Ground "definition" in the primary dictionary sense matching "form" ("To ..." for verbs, noun phrase for nouns, adjectival phrase for adjectives). "definition2" must be a genuinely distinct secondary or figurative sense. No semicolons.
2. "etymology" (3–4 sentences, 250–450 chars): Sentence 1 gives source language, single-quoted root word(s), and literal meaning; Sentence 2 tells the vivid historical or cultural origin story; Sentence 3 explains how it evolved into its modern English sense.
3. "example" (16–28 words): Specific literary sentence with strong context clues explicitly containing "${cleanTerm}" (or direct stem inflection) for game masking.

House style example ("desultory", adjective, Latin):
definition: "Lacking a coherent plan, purpose, or sustained enthusiasm."
definition2: "Jumping from one subject to another in a disconnected, half-hearted way."
etymology: "From Latin 'desultorius', derived from 'desultor' (a Roman circus rider who leaped from one galloping horse to another), from 'desilire' ('de-' down + 'salire' to leap). In antiquity, it described switching mounts mid-race. By the late 16th century, English writers adopted it for minds or conversations jumping erratically between topics."
example: "After midnight, their study session dissolved into desultory chatter about old movies and summer travel plans."

Return ONLY a valid JSON object:
{
  "word": "${cleanTerm}",
  "seed": "difficulty tier from garden (Pasture / foundational), meadow (intermediate literary), conservatory (advanced/scholarly) — default to ${fallbackDifficulty}",
  "topic": "topic category from general, emotions, philosophy, biology, architecture, statecraft, literature — default to ${fallbackTopic}",
  "form": "noun, verb, adjective, or adverb",
  "definition": "...",
  "definition2": "...",
  "etymology": "...",
  "example": "...",
  "origin": "Primary language of origin (e.g., Latin, Greek, French, Old English, Italian, German)"
}`;

          const [rawJsonText, wikiMap] = await Promise.all([
            generateGeminiJsonText(resolvedKey, prompt, 22000),
            wiktionaryPromise,
          ]);
          const enriched = parseJsonSafe<Partial<Word>>(rawJsonText, {});
          if (enriched.definition && enriched.etymology) {
            const verifiedWikiQuotes = wikiMap.get(lowerTerm) || [];
            const topVerifiedQuote =
              verifiedWikiQuotes[0] ||
              (curatedExistingQuote
                ? {
                    quote: curatedExistingQuote.quote,
                    author: curatedExistingQuote.author,
                  }
                : null);

            const enrichedWordObj: Word = {
              word: enriched.word || cleanTerm,
              seed: getWordDifficulty({ seed: enriched.seed || fallbackDifficulty }),
              topic: getWordTopic({ topic: enriched.topic || fallbackTopic }),
              form: enriched.form || 'noun',
              definition: enriched.definition || '',
              definition2: enriched.definition2 || '',
              etymology: enriched.etymology || '',
              example: enriched.example || '',
              fieldQuote: topVerifiedQuote?.quote || '',
              fieldQuoteAuthor: topVerifiedQuote?.author || '',
              origin: enriched.origin || 'Latin',
            };
            const morphemesMap = readMorphemesFromDisk();
            const enrichedMorphemes = await generateMorphemeProfileForWord(
              enrichedWordObj,
              apiKey,
              morphemesMap
            );
            return NextResponse.json({
              enriched: enrichedWordObj,
              enrichedMorphemes,
              similarWords: findSimilarLexiconWords(enrichedWordObj.word, words),
              source: 'gemini',
              quoteVerified: Boolean(topVerifiedQuote),
              quoteCandidatesCount: verifiedWikiQuotes.length,
            });
          }
          geminiWarning = 'Gemini returned an incomplete JSON response.';
        } catch (aiErr: unknown) {
          geminiWarning =
            aiErr instanceof Error ? aiErr.message : 'Gemini request failed';
        }
      }

      // Fall back to Free Dictionary API if available (surfacing any Gemini warning)
      if (fallbackDictEntry && fallbackDictEntry.def1) {
        let guessedOrigin = 'Latin';
        if (/greek/i.test(fallbackDictEntry.origin)) guessedOrigin = 'Greek';
        else if (/french/i.test(fallbackDictEntry.origin)) guessedOrigin = 'French';
        else if (/old english|germanic/i.test(fallbackDictEntry.origin))
          guessedOrigin = 'Old English';
        else if (/italian/i.test(fallbackDictEntry.origin)) guessedOrigin = 'Italian';
        else if (/german/i.test(fallbackDictEntry.origin)) guessedOrigin = 'German';

        return NextResponse.json({
          enriched: {
            word: cleanTerm,
            seed: fallbackDifficulty,
            topic: fallbackTopic,
            form: fallbackDictEntry.pos,
            definition: fallbackDictEntry.def1,
            definition2: fallbackDictEntry.def2,
            etymology:
              fallbackDictEntry.origin ||
              'Add your Gemini API Key in the Curator Studio header to generate a full historical etymology narrative.',
            example: fallbackDictEntry.example || '',
            origin: guessedOrigin,
          },
          source: 'dictionary-api',
          ...(geminiWarning ? { warning: geminiWarning } : {}),
        });
      }

      // If Gemini failed and no dictionary fallback was available, report the Gemini error clearly
      if (geminiWarning) {
        return NextResponse.json(
          {
            error: `Gemini AI error while enriching "${cleanTerm}": ${geminiWarning}`,
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          error:
            'Could not auto-populate without a Gemini API Key. Paste your GEMINI_API_KEY in the Curator Studio header (or in .env.local) to enable AI field population.',
        },
        { status: 400 }
      );
    }

    if (action === 'generate_candidates') {
      const {
        seed = 'conservatory',
        topic,
        customPrompt = '',
        count = 6,
        replaceExisting = false,
        apiKey,
      } = body as {
        seed?: SeedType;
        topic?: TopicCategory;
        customPrompt?: string;
        count?: number;
        replaceExisting?: boolean;
        apiKey?: string;
      };

      const targetDifficulty = getWordDifficulty({ seed });
      const targetTopic: TopicCategory =
        topic || (seed && !['garden', 'meadow', 'conservatory'].includes(seed) ? getWordTopic({ seed }) : 'general');
      const guidanceKey = targetTopic !== 'general' ? targetTopic : targetDifficulty;

      const existingStaged = readStagedWords();
      const blacklist = new Set<string>([
        ...words.map((w) => w.word.toLowerCase()),
        ...(replaceExisting ? [] : existingStaged.map((s) => s.word.toLowerCase())),
      ]);

      const resolvedKey = resolveGeminiKey(apiKey);
      let newCandidates: (Word & { id: string })[] = [];
      let usedAi = false;
      let geminiWarning: string | null = null;

      if (resolvedKey) {
        const categoryGuidance: Record<SeedType | TopicCategory, string> = {
          garden:
            'expressive, foundational vocabulary accessible to an articulate reader but more vivid than everyday speech',
          meadow:
            'sophisticated literary, journalistic, and rhetorical vocabulary with memorable nuances',
          conservatory:
            'scholarly, rare, and intellectually challenging vocabulary with fascinating classical roots',
          general:
            'versatile, expressive vocabulary applicable across everyday and literary contexts',
          emotions:
            'nuanced human emotions, psychological states, dispositions, and complex feelings',
          philosophy:
            'philosophy, logic, rhetoric, ethics, epistemology, and critical inquiry',
          biology:
            'natural history, ecology, botany, and living systems (prioritize evocative terms that also work metaphorically over dry lab jargon)',
          architecture:
            'architecture, aesthetics, visual art, spatial design, and material culture',
          statecraft:
            'society, diplomacy, governance, law, political theory, and historical movements',
          literature:
            'literature, poetic devices, narrative structure, rhetoric, and artistic criticism',
        };

        try {
          const baseGuidance = `${categoryGuidance[targetDifficulty]} within the ${targetTopic} topic (${categoryGuidance[guidanceKey]})`;
          const promptFocus = customPrompt.trim()
            ? `${baseGuidance}. Specific focus: ${customPrompt.trim()}`
            : baseGuidance;

          const candidatePrompt = `You are the Chief Lexicographer and Etymologist for Growcabulary. Generate ${count} challenging, applicable, and intellectually engaging English vocabulary words for difficulty "${targetDifficulty}" and topic "${targetTopic}" (${promptFocus}).
Avoid overly common words and avoid unusable textbook-only jargon.
CRITICAL EDITORIAL STANDARDS:
1. DO NOT suggest any of these words: ${Array.from(blacklist).join(', ')}.
2. ACCURATE, DISTINCT DEFINITIONS: Separate "definition" (primary dictionary meaning) and "definition2" (a genuinely distinct secondary or figurative sense) cleanly without semicolons. Match the grammatical part of speech ("form").
3. NARRATIVE ETYMOLOGY (3 to 4 full sentences):
   - Sentence 1: Name the source language and exact ancestral root word(s) in single quotes (e.g. 'umbra', 'desultor'), along with the literal physical meaning.
   - Sentence 2: Explain the fascinating historical, cultural, or physical origin story in the ancient or medieval world.
   - Sentence 3: Explain how that literal image evolved into the modern figurative sense.
4. CONTEXT-RICH LITERARY EXAMPLE: Write a vivid, specific 16–28 word sentence with strong context clues that explicitly contains the exact word itself so our game masking works.

Return ONLY a JSON array of objects, each with keys: "word", "form", "definition", "definition2", "etymology", "example", "origin".`;

          const rawJsonText = await generateGeminiJsonText(resolvedKey, candidatePrompt, 28000);
          const parsed = parseJsonSafe<Word[]>(rawJsonText, []);
          newCandidates = (Array.isArray(parsed) ? parsed : [])
            .filter((item: { word?: string }) => {
              if (!item.word) return false;
              const lower = item.word.toLowerCase();
              if (blacklist.has(lower)) return false;
              const sim = findSimilarLexiconWords(item.word, words);
              return !sim.some((m) => m.matchType === 'exact' || m.matchType === 'morphological');
            })
            .map((item: Word, idx: number) => ({
              id: `staged-${Date.now()}-${idx}`,
              word: item.word,
              seed: targetDifficulty,
              topic: targetTopic,
              form: item.form || 'noun',
              definition: item.definition,
              definition2: item.definition2 || '',
              etymology: item.etymology,
              example: item.example,
              origin: item.origin || 'Latin',
            }));
          if (newCandidates.length > 0) {
            usedAi = true;
          }
        } catch (aiErr: unknown) {
          geminiWarning =
            aiErr instanceof Error ? aiErr.message : 'Gemini request failed';
        }
      }

      if (newCandidates.length === 0) {
        // Use curated reserve pool filtered by topic/difficulty or across reserve
        const matchingPool = RESERVE_CANDIDATE_POOL.filter(
          (w) =>
            !blacklist.has(w.word.toLowerCase()) &&
            (targetTopic !== 'general' ? getWordTopic(w) === targetTopic : w.seed === targetDifficulty)
        );
        const fallbackPool =
          matchingPool.length >= 2
            ? matchingPool
            : RESERVE_CANDIDATE_POOL.filter((w) => !blacklist.has(w.word.toLowerCase()));

        newCandidates = fallbackPool
          .sort(() => Math.random() - 0.5)
          .slice(0, count)
          .map((w, idx) => ({
            ...w,
            seed: targetDifficulty || w.seed,
            topic: topic ? targetTopic : getWordTopic(w),
            id: `staged-${Date.now()}-${idx}`,
          }));
      }

      // Batch-fetch real verified Wiktionary quotes for all generated candidates (never hallucinate)
      if (newCandidates.length > 0) {
        const wikiQuotesMap = await fetchVerifiedWiktionaryQuotesMap(
          newCandidates.map((c) => c.word),
          4500
        );
        newCandidates = newCandidates.map((cand) => {
          const lower = cand.word.toLowerCase();
          const verified = wikiQuotesMap.get(lower)?.[0] || CURATED_FIELD_QUOTES[lower];
          if (verified) {
            return {
              ...cand,
              fieldQuote: verified.quote,
              fieldQuoteAuthor: verified.author,
            };
          }
          return cand;
        });
      }

      const finalStaged = replaceExisting
        ? newCandidates
        : [...newCandidates, ...existingStaged];
      writeStagedWords(finalStaged);

      return NextResponse.json({
        words: auditWords(words),
        staged: finalStaged,
        generatedCount: newCandidates.length,
        usedAi,
        warning: geminiWarning,
      });
    }

    const sanitizeWordInput = (input: Word): Word => ({
      word: input.word.trim(),
      seed: getWordDifficulty(input),
      topic: getWordTopic(input),
      form: input.form.trim(),
      definition: input.definition.trim(),
      ...(input.definition2?.trim() ? { definition2: input.definition2.trim() } : {}),
      etymology: input.etymology.trim(),
      example: input.example.trim(),
      ...(input.fieldQuote?.trim() ? { fieldQuote: input.fieldQuote.trim() } : {}),
      ...(input.fieldQuoteAuthor?.trim()
        ? { fieldQuoteAuthor: input.fieldQuoteAuthor.trim() }
        : {}),
      origin: input.origin.trim(),
    });

    const apiKeyFromBody =
      typeof (body as { apiKey?: string }).apiKey === 'string'
        ? (body as { apiKey?: string }).apiKey
        : undefined;
    const morphemesMap = readMorphemesFromDisk();
    const fieldAltsMap = readFieldAlternativesFromDisk();

    if (action === 'update_word') {
      const { index, updatedWord, morphemes } = body as {
        index: number;
        updatedWord: Word;
        morphemes?: WordMorphemeProfile;
      };
      if (index < 0 || index >= words.length) {
        return NextResponse.json({ error: 'Invalid word index' }, { status: 400 });
      }
      const prevWord = words[index];
      const prevTerm = prevWord.word;
      const cleanUpdated = sanitizeWordInput(updatedWord);
      words[index] = cleanUpdated;
      writeRawWordsToDisk(words);

      const oldKey = prevTerm.toLowerCase();
      const newKey = cleanUpdated.word.toLowerCase();
      const existingAlts = fieldAltsMap[oldKey];
      if (oldKey !== newKey) {
        delete morphemesMap[oldKey];
        delete fieldAltsMap[oldKey];
      }

      const needsMorphemeRegen =
        oldKey !== newKey ||
        prevWord.etymology.trim() !== cleanUpdated.etymology.trim() ||
        !morphemesMap[newKey];
      const passageChanged =
        oldKey !== newKey ||
        prevWord.form.trim() !== cleanUpdated.form.trim() ||
        prevWord.definition.trim() !== cleanUpdated.definition.trim() ||
        prevWord.example.trim() !== cleanUpdated.example.trim() ||
        (prevWord.fieldQuote || '').trim() !== (cleanUpdated.fieldQuote || '').trim();

      const [nextMorphemes, nextAlts] = await Promise.all([
        morphemes && (morphemes.roots?.length || morphemes.prefixes?.length)
          ? Promise.resolve(morphemes)
          : needsMorphemeRegen
          ? generateMorphemeProfileForWord(cleanUpdated, apiKeyFromBody, morphemesMap)
          : Promise.resolve(morphemesMap[newKey]),
        passageChanged || !existingAlts
          ? generateFieldAlternativesForWord(cleanUpdated, words, apiKeyFromBody)
          : Promise.resolve(existingAlts),
      ]);

      morphemesMap[newKey] = nextMorphemes;
      writeMorphemesToDisk(morphemesMap);

      if (nextAlts && (nextAlts.strongFits.length > 0 || nextAlts.plausibleFits.length > 0)) {
        fieldAltsMap[newKey] = nextAlts;
      } else {
        delete fieldAltsMap[newKey];
      }
      writeFieldAlternativesToDisk(fieldAltsMap);

      await syncWordToSupabase(cleanUpdated, prevTerm, nextAlts);
    } else if (action === 'delete_word') {
      const { index } = body as { index: number };
      if (index < 0 || index >= words.length) {
        return NextResponse.json({ error: 'Invalid word index' }, { status: 400 });
      }
      const removed = words.splice(index, 1)[0];
      writeRawWordsToDisk(words);
      if (removed?.word) {
        const removedKey = removed.word.toLowerCase();
        delete morphemesMap[removedKey];
        writeMorphemesToDisk(morphemesMap);
        delete fieldAltsMap[removedKey];
        writeFieldAlternativesToDisk(fieldAltsMap);
        await deleteWordFromSupabase(removed.word);
      }
    } else if (action === 'add_word') {
      const { newWord, morphemes, allowSimilar } = body as {
        newWord: Word;
        morphemes?: WordMorphemeProfile;
        allowSimilar?: boolean;
      };
      const cleanNew = sanitizeWordInput(newWord);
      const similarMatches = findSimilarLexiconWords(cleanNew.word, words);
      const exactMatch = similarMatches.find((m) => m.matchType === 'exact');
      if (exactMatch) {
        return NextResponse.json(
          {
            error: `"${cleanNew.word}" is already in the lexicon (${exactMatch.form}).`,
            similarMatches,
          },
          { status: 409 }
        );
      }
      if (similarMatches.length > 0 && !allowSimilar) {
        return NextResponse.json(
          {
            error: `"${cleanNew.word}" closely resembles existing lexicon word(s): ${similarMatches
              .map((s) => `${s.word} (${s.reason})`)
              .join('; ')}.`,
            similarMatches,
            requiresConfirmation: true,
          },
          { status: 409 }
        );
      }

      words.push(cleanNew);
      writeRawWordsToDisk(words);

      const newKey = cleanNew.word.toLowerCase();
      const [profile, generatedAlts] = await Promise.all([
        morphemes && (morphemes.roots?.length || morphemes.prefixes?.length)
          ? Promise.resolve(morphemes)
          : generateMorphemeProfileForWord(cleanNew, apiKeyFromBody, morphemesMap),
        generateFieldAlternativesForWord(cleanNew, words, apiKeyFromBody),
      ]);

      morphemesMap[newKey] = profile;
      writeMorphemesToDisk(morphemesMap);

      if (generatedAlts.strongFits.length > 0 || generatedAlts.plausibleFits.length > 0) {
        fieldAltsMap[newKey] = generatedAlts;
        writeFieldAlternativesToDisk(fieldAltsMap);
      }

      await syncWordToSupabase(cleanNew, undefined, generatedAlts);
    } else if (action === 'approve_staged') {
      const { stagedId, approvedWord, morphemes, allowSimilar } = body as {
        stagedId: string;
        approvedWord: Word;
        morphemes?: WordMorphemeProfile;
        allowSimilar?: boolean;
      };
      const cleanApproved = sanitizeWordInput(approvedWord);
      const similarMatches = findSimilarLexiconWords(cleanApproved.word, words);
      const exactMatch = similarMatches.find((m) => m.matchType === 'exact');
      if (exactMatch) {
        return NextResponse.json(
          {
            error: `"${cleanApproved.word}" is already in the lexicon (${exactMatch.form}).`,
            similarMatches,
          },
          { status: 409 }
        );
      }
      if (similarMatches.length > 0 && !allowSimilar) {
        return NextResponse.json(
          {
            error: `"${cleanApproved.word}" closely resembles existing lexicon word(s): ${similarMatches
              .map((s) => `${s.word} (${s.reason})`)
              .join('; ')}.`,
            similarMatches,
            requiresConfirmation: true,
          },
          { status: 409 }
        );
      }

      words.push(cleanApproved);
      writeRawWordsToDisk(words);

      const approvedKey = cleanApproved.word.toLowerCase();
      const [profile, generatedAlts] = await Promise.all([
        morphemes && (morphemes.roots?.length || morphemes.prefixes?.length)
          ? Promise.resolve(morphemes)
          : generateMorphemeProfileForWord(cleanApproved, apiKeyFromBody, morphemesMap),
        generateFieldAlternativesForWord(cleanApproved, words, apiKeyFromBody),
      ]);

      morphemesMap[approvedKey] = profile;
      writeMorphemesToDisk(morphemesMap);

      if (generatedAlts.strongFits.length > 0 || generatedAlts.plausibleFits.length > 0) {
        fieldAltsMap[approvedKey] = generatedAlts;
        writeFieldAlternativesToDisk(fieldAltsMap);
      }

      await syncWordToSupabase(cleanApproved, undefined, generatedAlts);

      const staged = readStagedWords().filter((sw) => sw.id !== stagedId);
      writeStagedWords(staged);
    } else if (action === 'regenerate_morphemes') {
      const { index } = body as { index: number };
      if (index < 0 || index >= words.length) {
        return NextResponse.json({ error: 'Invalid word index' }, { status: 400 });
      }
      const target = words[index];
      morphemesMap[target.word.toLowerCase()] = await generateMorphemeProfileForWord(
        target,
        apiKeyFromBody,
        morphemesMap
      );
      writeMorphemesToDisk(morphemesMap);
    } else if (action === 'reject_staged') {
      const { stagedId } = body as { stagedId: string };
      const staged = readStagedWords().filter((sw) => sw.id !== stagedId);
      writeStagedWords(staged);
    } else if (action === 'split_all_semicolons') {
      const modified: Word[] = [];
      words.forEach((w) => {
        if (w.definition.includes(';') && (!w.definition2 || !w.definition2.trim())) {
          const parts = w.definition
            .split(';')
            .map((s) => s.trim().replace(/^\.\s*/, ''))
            .filter(Boolean);
          if (parts.length >= 2) {
            w.definition = parts[0].endsWith('.') ? parts[0] : `${parts[0]}.`;
            w.definition2 = parts.slice(1).join('; ');
            modified.push(w);
          }
        }
      });
      writeRawWordsToDisk(words);
      if (modified.length > 0) {
        await Promise.all(modified.map((w) => syncWordToSupabase(w)));
      }
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    const refreshed = auditWords(words);
    const refreshedStaged = readStagedWords();

    return NextResponse.json({
      words: refreshed,
      staged: refreshedStaged,
      totalCount: refreshed.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update lexicon';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

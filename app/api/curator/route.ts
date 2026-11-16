import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerSupabaseClient } from '../../../utils/supabase/server';
import { Word, SeedType, DifficultyTier, TopicCategory } from '../../../types';
import { RAW_WORDS as BUNDLED_RAW_WORDS } from '../../../utils/data';
import { getWordDifficulty, getWordTopic } from '../../../constants';

export const dynamic = 'force-dynamic';

let memoryWordsCache: Word[] | null = null;
let memoryStagedCache: (Word & { id: string })[] | null = null;
let diskWordsWriteFailed = false;
let diskStagedWriteFailed = false;
let warnedMissingServiceRole = false;

const DATA_TS_PATH = path.join(process.cwd(), 'utils', 'data.ts');
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

function auditWords(words: Word[]): AuditedWord[] {
  const counts = new Map<string, number>();
  words.forEach((w) => {
    const key = w.word.trim().toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
  });

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

    return {
      ...w,
      index,
      auditFlags: flags,
      maskedPreview,
    };
  });
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

async function syncWordToSupabase(w: Word, previousWordTerm?: string) {
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

    const { error: upsertErr } = await supabase.from('words').upsert(
      {
        deck_id: deckRow.id,
        term: w.word,
        part_of_speech: w.form,
        definition: w.definition,
        definition2: w.definition2 || null,
        etymology: w.etymology,
        origin: w.origin,
        example_sentence: w.example,
        status: 'approved',
      },
      { onConflict: 'deck_id,term' }
    );
    if (upsertErr) {
      console.warn(`Supabase word sync failed for "${w.word}":`, upsertErr.message);
    }
  } catch (err) {
    console.warn(`Supabase word sync error for "${w.word}":`, err);
  }
}

async function deleteWordFromSupabase(term: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
    await supabase.from('words').delete().ilike('term', term);
  } catch {
    // Non-blocking cloud delete
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

    const words = readRawWordsFromDisk();
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
    const words = readRawWordsFromDisk();

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

      // Step 2: Fetch verified dictionary senses (fast 1.5s lookup) to ground Gemini's definitions
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
            cleanTerm.toLowerCase()
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
4. "fieldQuote" & "fieldQuoteAuthor": Authentic or faithfully adapted literary/historical quote containing "${cleanTerm}", with author & work (e.g., "Nathaniel Hawthorne, The Old Manse (1846)").

House style example ("desultory", adjective, Latin):
definition: "Lacking a coherent plan, purpose, or sustained enthusiasm."
definition2: "Jumping from one subject to another in a disconnected, half-hearted way."
etymology: "From Latin 'desultorius', derived from 'desultor' (a Roman circus rider who leaped from one galloping horse to another), from 'desilire' ('de-' down + 'salire' to leap). In antiquity, it described switching mounts mid-race. By the late 16th century, English writers adopted it for minds or conversations jumping erratically between topics."
example: "After midnight, their study session dissolved into desultory chatter about old movies and summer travel plans."
fieldQuote: "For an hour we carried on a desultory conversation across the garden wall, drifting from the apple harvest to old books and distant friends."
fieldQuoteAuthor: "Nathaniel Hawthorne, The Old Manse (1846)"

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
  "fieldQuote": "...",
  "fieldQuoteAuthor": "...",
  "origin": "Primary language of origin (e.g., Latin, Greek, French, Old English, Italian, German)"
}`;

          const rawJsonText = await generateGeminiJsonText(resolvedKey, prompt, 22000);
          const enriched = parseJsonSafe<Partial<Word>>(rawJsonText, {});
          if (enriched.definition && enriched.etymology) {
            return NextResponse.json({
              enriched: {
                word: enriched.word || cleanTerm,
                seed: getWordDifficulty({ seed: enriched.seed || fallbackDifficulty }),
                topic: getWordTopic({ topic: enriched.topic || fallbackTopic }),
                form: enriched.form || 'noun',
                definition: enriched.definition || '',
                definition2: enriched.definition2 || '',
                etymology: enriched.etymology || '',
                example: enriched.example || '',
                fieldQuote: enriched.fieldQuote || '',
                fieldQuoteAuthor: enriched.fieldQuoteAuthor || '',
                origin: enriched.origin || 'Latin',
              },
              source: 'gemini',
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
            .filter(
              (item: { word?: string }) =>
                item.word && !blacklist.has(item.word.toLowerCase())
            )
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

    if (action === 'update_word') {
      const { index, updatedWord } = body as { index: number; updatedWord: Word };
      if (index < 0 || index >= words.length) {
        return NextResponse.json({ error: 'Invalid word index' }, { status: 400 });
      }
      const prevTerm = words[index].word;
      const cleanUpdated = sanitizeWordInput(updatedWord);
      words[index] = cleanUpdated;
      writeRawWordsToDisk(words);
      await syncWordToSupabase(cleanUpdated, prevTerm);
    } else if (action === 'delete_word') {
      const { index } = body as { index: number };
      if (index < 0 || index >= words.length) {
        return NextResponse.json({ error: 'Invalid word index' }, { status: 400 });
      }
      const removed = words.splice(index, 1)[0];
      writeRawWordsToDisk(words);
      if (removed?.word) {
        await deleteWordFromSupabase(removed.word);
      }
    } else if (action === 'add_word') {
      const { newWord } = body as { newWord: Word };
      const cleanNew = sanitizeWordInput(newWord);
      words.push(cleanNew);
      writeRawWordsToDisk(words);
      await syncWordToSupabase(cleanNew);
    } else if (action === 'approve_staged') {
      const { stagedId, approvedWord } = body as {
        stagedId: string;
        approvedWord: Word;
      };
      const cleanApproved = sanitizeWordInput(approvedWord);
      words.push(cleanApproved);
      writeRawWordsToDisk(words);
      await syncWordToSupabase(cleanApproved);

      const staged = readStagedWords().filter((sw) => sw.id !== stagedId);
      writeStagedWords(staged);
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

    const refreshed = auditWords(readRawWordsFromDisk());
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

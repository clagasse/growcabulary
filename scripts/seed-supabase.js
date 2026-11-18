#!/usr/bin/env node
/**
 * Growcabulary Supabase Lexicon Seeder
 * ----------------------------------------------------------------------------
 * Reads all 9 decks and 669+ curated words from `utils/data.ts` and upserts
 * them into your Supabase `public.decks` and `public.words` tables.
 *
 * Usage:
 *   1. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 *      are set in `growcabulary-next/.env.local`.
 *   2. Run the SQL migration `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor.
 *   3. Run: npm.cmd run seed-supabase
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️  SUPABASE_SERVICE_ROLE_KEY is not set; falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY. Writes to public.decks and public.words may fail due to RLS.'
  );
}

if (
  !SUPABASE_URL ||
  !SUPABASE_KEY ||
  SUPABASE_URL.includes('your-project-id') ||
  SUPABASE_KEY.includes('your-supabase')
) {
  console.error(
    '❌ Missing Supabase credentials in .env.local!\n' +
      'Please copy .env.local.example to .env.local and fill in:\n' +
      '  NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co\n' +
      '  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>\n' +
      '  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>'
  );
  process.exit(1);
}

const DECKS_META = [
  {
    slug: 'garden',
    title: 'Pasture',
    description: 'Foundational words that are expressive but widely understood.',
    category: 'core',
    emoji: '🌱',
    is_public: true,
    is_premium: false,
  },
  {
    slug: 'meadow',
    title: 'Meadow',
    description: 'Sophisticated vocabulary found in literature and advanced reading.',
    category: 'core',
    emoji: '🪷',
    is_public: true,
    is_premium: false,
  },
  {
    slug: 'conservatory',
    title: 'Conservatory',
    description: 'Obscure and challenging terms for scholars and bookworms.',
    category: 'core',
    emoji: '🪻',
    is_public: true,
    is_premium: true,
  },
  {
    slug: 'emotions',
    title: 'Psyche & Emotions',
    description:
      'Nuanced states of mind, emotional depth, character temperaments, and human psychology.',
    category: 'specimen',
    emoji: '🎭',
    is_public: true,
    is_premium: true,
  },
  {
    slug: 'philosophy',
    title: 'Philosophy & Rhetoric',
    description:
      'Enduring concepts from ethics, logic, persuasion, debate, and the search for meaning.',
    category: 'specimen',
    emoji: '🏛️',
    is_public: true,
    is_premium: true,
  },
  {
    slug: 'biology',
    title: 'Natural World & Ecology',
    description:
      'Evocative terms from botany, ecology, landscapes, and living systems that enrich both science and metaphor.',
    category: 'specimen',
    emoji: '🌿',
    is_public: true,
    is_premium: true,
  },
  {
    slug: 'architecture',
    title: 'Art, Design & Architecture',
    description:
      'Aesthetic movements, spatial design, visual craft, and architectural marvels.',
    category: 'specimen',
    emoji: '🎨',
    is_public: true,
    is_premium: true,
  },
  {
    slug: 'statecraft',
    title: 'Society, Law & Statecraft',
    description:
      'High-utility terms from diplomacy, governance, history, jurisprudence, and social dynamics.',
    category: 'specimen',
    emoji: '⚖️',
    is_public: true,
    is_premium: true,
  },
  {
    slug: 'literature',
    title: 'Literature & Poetics',
    description:
      'Expressive vocabulary for narrative craft, poetic devices, irony, and literary criticism.',
    category: 'specimen',
    emoji: '📜',
    is_public: true,
    is_premium: true,
  },
];

function loadExportObject(relPath, constName) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return {};
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const runnable = fileContent
    .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
    .replace(/export\s+type\s+[^\n]+;?/g, '')
    .replace(/export\s+interface\s+[\s\S]*?\n\}/g, '')
    .replace(/export\s+function\s+[\s\S]*$/m, '')
    .replace(new RegExp(`export\\s+const\\s+${constName}[^=]*=`), `const ${constName} =`)
    .concat(`\n;${constName};`);
  return vm.runInNewContext(runnable, {});
}

async function seedSupabase() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Load curated words, field quotes, and alternatives from utils/
  const words = loadExportObject('utils/data.ts', 'RAW_WORDS');
  const curatedQuotes = loadExportObject('utils/fieldQuotes.ts', 'CURATED_FIELD_QUOTES');
  const fieldAlternatives = loadExportObject(
    'utils/fieldAlternatives.ts',
    'FIELD_NOTE_ALTERNATIVES'
  );

  console.log(`🌿 Connecting to Supabase: ${SUPABASE_URL}`);
  console.log(`📦 Upserting ${DECKS_META.length} Growcabulary Decks...`);

  const { data: upsertedDecks, error: deckErr } = await supabase
    .from('decks')
    .upsert(DECKS_META, { onConflict: 'slug' })
    .select('id, slug');

  if (deckErr) {
    console.error('❌ Error upserting decks:', deckErr.message);
    process.exit(1);
  }

  const slugToId = {};
  upsertedDecks.forEach((d) => {
    slugToId[d.slug] = d.id;
  });

  console.log(`📚 Preparing ${words.length} curated words + game metadata for bulk upsert...`);

  const wordRows = words
    .map((w) => {
      const deckId = slugToId[w.seed];
      if (!deckId) return null;
      const lower = w.word.toLowerCase();
      const quoteEntry = curatedQuotes[lower];
      return {
        deck_id: deckId,
        term: w.word,
        topic: w.topic || 'general',
        part_of_speech: w.form,
        definition: w.definition,
        definition2: w.definition2 || null,
        etymology: w.etymology,
        origin: w.origin,
        example_sentence: w.example,
        field_quote: w.fieldQuote || quoteEntry?.quote || null,
        field_quote_author: w.fieldQuoteAuthor || quoteEntry?.author || null,
        field_alternatives: fieldAlternatives[lower] || null,
        status: 'approved',
      };
    })
    .filter(Boolean);

  // Upsert in batches of 150
  const BATCH_SIZE = 150;
  let insertedTotal = 0;
  for (let i = 0; i < wordRows.length; i += BATCH_SIZE) {
    const chunk = wordRows.slice(i, i + BATCH_SIZE);
    const { error: wordErr } = await supabase
      .from('words')
      .upsert(chunk, { onConflict: 'deck_id,term' });

    if (wordErr) {
      console.error(`❌ Error upserting batch starting at ${i}:`, wordErr.message);
      if (/field_quote|field_alternatives|topic|schema cache/i.test(wordErr.message)) {
        console.error(
          '💡 Run supabase/migrations/004_word_game_metadata.sql in your Supabase SQL Editor first, then re-run npm run seed-supabase.'
        );
      }
      process.exit(1);
    }
    insertedTotal += chunk.length;
    console.log(`   ✓ Synced ${insertedTotal}/${wordRows.length} words...`);
  }

  // Remove any stale (deck_id, term) rows that were moved or renamed
  const { data: existingRows } = await supabase
    .from('words')
    .select('id, deck_id, term');
  if (existingRows) {
    const validKeys = new Set(
      wordRows.map((r) => `${r.deck_id}::${r.term.toLowerCase()}`)
    );
    const staleIds = existingRows
      .filter((r) => !validKeys.has(`${r.deck_id}::${r.term.toLowerCase()}`))
      .map((r) => r.id);
    if (staleIds.length > 0) {
      await supabase.from('words').delete().in('id', staleIds);
      console.log(`   🧹 Removed ${staleIds.length} stale/relocated word record(s).`);
    }
  }

  console.log(`✅ Successfully seeded ${DECKS_META.length} decks and ${insertedTotal} curated words to Supabase!`);
}

seedSupabase().catch((e) => {
  console.error('❌ Fatal error during seed:', e);
  process.exit(1);
});

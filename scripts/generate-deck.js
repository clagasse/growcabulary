#!/usr/bin/env node
/**
 * Growcabulary Curator-in-the-Loop AI Content Generation Script
 * ----------------------------------------------------------------------------
 * Usage:
 *   GEMINI_API_KEY=your_key node scripts/generate-deck.js "GRE Academic" --count=10
 *
 * Governance Note:
 *   Per project policy, generated words are NEVER inserted automatically into
 *   the live `utils/data.ts` lexicon. Instead, this script stages candidate
 *   words into `scripts/staged-decks/<slug>-staged.json` and generates a
 *   ready-to-run Supabase SQL seed file so you can review, edit, and approve
 *   every word first.
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenAI, Type } = require('@google/genai');

async function main() {
  const args = process.argv.slice(2);
  const topicArg = args.find((a) => !a.startsWith('--')) || 'Literary & Rhetorical Nuance';
  const countFlag = args.find((a) => a.startsWith('--count='));
  const wordCount = countFlag ? parseInt(countFlag.split('=')[1], 10) || 10 : 10;

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error(
      '❌ Missing GEMINI_API_KEY environment variable.\n' +
        'Run with: GEMINI_API_KEY=your_key node scripts/generate-deck.js "Topic Name"'
    );
    process.exit(1);
  }

  // Load existing curated words from utils/data.ts to avoid duplicates
  const dataPath = path.join(__dirname, '..', 'utils', 'data.ts');
  let existingWords = [];
  if (fs.existsSync(dataPath)) {
    const content = fs.readFileSync(dataPath, 'utf8');
    const matches = [...content.matchAll(/word:\s*["']([^"']+)["']/g)];
    existingWords = matches.map((m) => m[1].toLowerCase());
  }

  console.log(`🌿 Growcabulary Curator Staging Generator`);
  console.log(`📚 Topic/Niche: "${topicArg}" (${wordCount} candidate specimens)`);
  console.log(`🛡️  Checked against ${existingWords.length} existing curated words.`);

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    contents: `Generate ${wordCount} challenging, applicable, and intellectually engaging English vocabulary words for the niche/topic: "${topicArg}".
Avoid common everyday words and avoid overly obscure archaic words that have no modern applicability.
DO NOT include any of these existing words: ${existingWords.slice(0, 200).join(', ')}.

For each word, provide:
- term: The vocabulary word
- part_of_speech: noun, verb, adjective, or adverb
- definition: Primary clear definition
- definition2: Secondary definition or nuance
- etymology: Rich historical etymology explaining the root words, literal meaning, and how the sense evolved
- origin: Primary language of origin (e.g., Latin, Greek, French, Old English, Italian, German)
- example_sentence: A vivid, natural sentence demonstrating the word in context`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            part_of_speech: { type: Type.STRING },
            definition: { type: Type.STRING },
            definition2: { type: Type.STRING },
            etymology: { type: Type.STRING },
            origin: { type: Type.STRING },
            example_sentence: { type: Type.STRING },
          },
          required: [
            'term',
            'part_of_speech',
            'definition',
            'etymology',
            'origin',
            'example_sentence',
          ],
        },
      },
    },
  });

  const rawJson = response.text ? response.text.trim() : '[]';
  const generatedWords = JSON.parse(rawJson);

  const slug = topicArg
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const outDir = path.join(__dirname, 'staged-decks');
  fs.mkdirSync(outDir, { recursive: true });

  const jsonOutPath = path.join(outDir, `${slug}-staged.json`);
  const sqlOutPath = path.join(outDir, `${slug}-supabase-seed.sql`);

  const stagedPayload = {
    deck: {
      slug,
      title: topicArg,
      description: `Curated vocabulary collection focused on ${topicArg}.`,
      category: 'specimen',
      is_public: true,
      status: 'staged_for_curator_review',
      generated_at: new Date().toISOString(),
    },
    words: generatedWords,
  };

  fs.writeFileSync(jsonOutPath, JSON.stringify(stagedPayload, null, 2), 'utf8');

  // Also format SQL for bulk insertion into Supabase `decks` and `words` tables (with status = 'staged')
  const esc = (str) => (str || '').replace(/'/g, "''");
  const sqlLines = [
    `-- Staged Supabase Seed for Deck: ${topicArg}`,
    `-- Review before changing status from 'staged' to 'approved'`,
    `with inserted_deck as (`,
    `  insert into public.decks (slug, title, description, category, emoji, is_public)`,
    `  values ('${esc(slug)}', '${esc(topicArg)}', 'Curated collection for ${esc(topicArg)}', 'specimen', '🔬', true)`,
    `  on conflict (slug) do update set title = excluded.title`,
    `  returning id`,
    `)`,
    `insert into public.words (deck_id, term, part_of_speech, definition, definition2, etymology, origin, example_sentence, status)`,
    `select`,
    `  inserted_deck.id,`,
    `  v.term, v.part_of_speech, v.definition, v.definition2, v.etymology, v.origin, v.example_sentence, 'staged'`,
    `from inserted_deck, (values`,
    generatedWords
      .map(
        (w) =>
          `  ('${esc(w.term)}', '${esc(w.part_of_speech)}', '${esc(w.definition)}', '${esc(
            w.definition2 || ''
          )}', '${esc(w.etymology)}', '${esc(w.origin)}', '${esc(w.example_sentence)}')`
      )
      .join(',\n'),
    `) as v(term, part_of_speech, definition, definition2, etymology, origin, example_sentence)`,
    `on conflict (deck_id, term) do nothing;`,
  ];

  fs.writeFileSync(sqlOutPath, sqlLines.join('\n'), 'utf8');

  console.log(`✅ Staged ${generatedWords.length} words for your review:`);
  console.log(`   - JSON Review File: ${jsonOutPath}`);
  console.log(`   - Supabase SQL File: ${sqlOutPath}`);
}

main().catch((err) => {
  console.error('Error generating staged deck:', err);
  process.exit(1);
});

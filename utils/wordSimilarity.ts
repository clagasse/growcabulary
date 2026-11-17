import { Word } from '../types';

export interface SimilarWordMatch {
  word: string;
  form: string;
  definition: string;
  matchType: 'exact' | 'morphological' | 'spelling';
  reason: string;
}

const DERIVATIONAL_SUFFIX_RX =
  /(?:fulness|lessness|ization|isation|ational|iveness|ousness|ability|ibility|mental|arily|orily|fully|lessly|ingly|edly|ation|ition|ment|ness|tion|sion|ency|ancy|ence|ance|ious|eous|able|ible|ical|ity|ety|ous|ive|ful|less|ize|ise|ify|ate|ent|ant|ary|ory|ery|ic|al|ly|er|or|es|ed|ing|ry|y|e|s)$/i;

function stemForSimilarity(term: string): string {
  const clean = term
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  if (clean.length <= 4) return clean;
  const stripped = clean.replace(DERIVATIONAL_SUFFIX_RX, '');
  return stripped.length >= 4 ? stripped : clean;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 2) return 3;
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
      }
      prev = temp;
    }
  }
  return dp[n];
}

function commonPrefixLen(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}

/**
 * Checks a candidate word against existing lexicon entries for exact duplicates,
 * morphological/family variants (e.g. poignant / poignancy, ebullient / ebullience),
 * or near-identical spellings.
 */
export function findSimilarLexiconWords(
  candidateWord: string,
  lexicon: Pick<Word, 'word' | 'form' | 'definition'>[],
  excludeWord?: string
): SimilarWordMatch[] {
  const candClean = candidateWord.trim().toLowerCase();
  if (!candClean) return [];

  const excludeClean = excludeWord?.trim().toLowerCase();
  const candNorm = candClean
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
  const candStem = stemForSimilarity(candClean);

  const matches: SimilarWordMatch[] = [];

  for (const w of lexicon) {
    const existingClean = w.word.trim().toLowerCase();
    if (excludeClean && existingClean === excludeClean) continue;

    if (existingClean === candClean) {
      matches.push({
        word: w.word,
        form: w.form,
        definition: w.definition,
        matchType: 'exact',
        reason: 'Exact duplicate already in lexicon',
      });
      continue;
    }

    const existingNorm = existingClean
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z]/g, '');
    const existingStem = stemForSimilarity(existingClean);

    if (candStem.length >= 4 && existingStem === candStem) {
      matches.push({
        word: w.word,
        form: w.form,
        definition: w.definition,
        matchType: 'morphological',
        reason: `Shares base stem "${candStem}-"`,
      });
      continue;
    }

    const prefixLen = commonPrefixLen(candNorm, existingNorm);
    const minLen = Math.min(candNorm.length, existingNorm.length);
    if (prefixLen >= 5 && prefixLen >= minLen - 1 && minLen >= 5) {
      matches.push({
        word: w.word,
        form: w.form,
        definition: w.definition,
        matchType: 'morphological',
        reason: `Close root variant (shared "${candNorm.slice(0, prefixLen)}...")`,
      });
      continue;
    }

    const dist = levenshtein(candNorm, existingNorm);
    if ((minLen >= 5 && dist <= 2) || (minLen === 4 && dist === 1)) {
      matches.push({
        word: w.word,
        form: w.form,
        definition: w.definition,
        matchType: 'spelling',
        reason: `Very similar spelling (edit distance ${dist})`,
      });
    }
  }

  const priority = { exact: 0, morphological: 1, spelling: 2 };
  return matches.sort((a, b) => priority[a.matchType] - priority[b.matchType]).slice(0, 6);
}

import { getWordDifficulty } from '../constants';
import { Word } from '../types';
import { createClient, isSupabaseConfigured } from './supabase/client';

export const BASE_WORD_SCORE = 100;
export const DECAY_WINDOW_SECONDS = 30;
export const LETTER_HINT_PENALTY = 10;
export const LETTER_TILES_PENALTY = 30;
export const NARROW_CHOICES_PENALTY = 75;
export const HIGH_SCORES_STORAGE_KEY = 'growcabulary_high_scores';
export const SCORED_ROUNDS_STORAGE_KEY = 'growcabulary_scored_rounds';

export interface ScoredRoundRecord {
  id: string;
  game_mode: 'seed-sprout' | 'field-notes';
  difficulty: 'all' | 'garden' | 'meadow' | 'conservatory';
  topic: string;
  score: number;
  words_count: number;
  clean_count: number;
  assisted_count: number;
  missed_count: number;
  created_at: string;
}

export function getDifficultyScoreMultiplier(wordOrSeed: Pick<Word, 'seed' | 'topic'> | string): number {
  const tier =
    typeof wordOrSeed === 'string'
      ? getWordDifficulty({ seed: wordOrSeed })
      : getWordDifficulty(wordOrSeed);
  if (tier === 'conservatory') return 2;
  if (tier === 'meadow') return 1.5;
  return 1;
}

export function getStreakMultiplier(cleanStreak: number): number {
  return Math.min(2, 1 + Math.max(0, cleanStreak) * 0.25);
}

export function computeTimeScore(elapsedSeconds: number): number {
  const clamped = Math.max(0, Math.min(DECAY_WINDOW_SECONDS, elapsedSeconds));
  return Math.max(0, Math.round(BASE_WORD_SCORE * (1 - clamped / DECAY_WINDOW_SECONDS)));
}

export function computeWordPoints(params: {
  elapsedSeconds: number;
  penaltyPoints: number;
  wordOrSeed: Pick<Word, 'seed' | 'topic'> | string;
  cleanStreak: number;
  solved: boolean;
}): number {
  if (!params.solved) return 0;
  const rawRemaining = Math.max(0, computeTimeScore(params.elapsedSeconds) - params.penaltyPoints);
  const diffMult = getDifficultyScoreMultiplier(params.wordOrSeed);
  const streakMult = getStreakMultiplier(params.cleanStreak);
  return Math.round(rawRemaining * diffMult * streakMult);
}

export function loadHighScores(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(HIGH_SCORES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveRoundHighScore(
  key: string,
  score: number
): { isNewBest: boolean; scores: Record<string, number> } {
  const current = loadHighScores();
  const prevBest = current[key] || 0;
  const isNewBest = score > 0 && score > prevBest;
  if (isNewBest) {
    const next = { ...current, [key]: score };
    try {
      localStorage.setItem(HIGH_SCORES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
    return { isNewBest: true, scores: next };
  }
  return { isNewBest: false, scores: current };
}

export function loadScoredRoundsLocal(): ScoredRoundRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SCORED_ROUNDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScoredRoundLocal(record: ScoredRoundRecord): ScoredRoundRecord[] {
  const existing = loadScoredRoundsLocal();
  const next = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 200);
  try {
    localStorage.setItem(SCORED_ROUNDS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
  return next;
}

export async function pushScoredRoundToSupabase(record: ScoredRoundRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('scored_rounds').insert({
      id: record.id,
      user_id: user.id,
      game_mode: record.game_mode,
      difficulty: record.difficulty,
      topic: record.topic,
      score: record.score,
      words_count: record.words_count,
      clean_count: record.clean_count,
      assisted_count: record.assisted_count,
      missed_count: record.missed_count,
      created_at: record.created_at,
    });
  } catch {
    // Non-blocking if offline or table not yet migrated
  }
}

export async function fetchAndMergeCloudScoredRounds(): Promise<{
  rounds: ScoredRoundRecord[];
  highScores: Record<string, number>;
}> {
  const localRounds = loadScoredRoundsLocal();
  const bests: Record<string, number> = { ...loadHighScores() };

  const applyToBests = (r: ScoredRoundRecord) => {
    const key = `${r.game_mode}::${r.difficulty}`;
    if (r.score > (bests[key] || 0)) {
      bests[key] = r.score;
    }
  };
  localRounds.forEach(applyToBests);

  if (!isSupabaseConfigured()) {
    return { rounds: localRounds, highScores: bests };
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { rounds: localRounds, highScores: bests };
    }

    const { data: cloudRows, error } = await supabase
      .from('scored_rounds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !cloudRows) {
      return { rounds: localRounds, highScores: bests };
    }

    const byId = new Map<string, ScoredRoundRecord>();
    localRounds.forEach((r) => byId.set(r.id, r));
    cloudRows.forEach((row) => {
      const rec: ScoredRoundRecord = {
        id: row.id,
        game_mode: row.game_mode,
        difficulty: row.difficulty || 'all',
        topic: row.topic || 'all',
        score: row.score ?? 0,
        words_count: row.words_count ?? 0,
        clean_count: row.clean_count ?? 0,
        assisted_count: row.assisted_count ?? 0,
        missed_count: row.missed_count ?? 0,
        created_at: row.created_at,
      };
      byId.set(rec.id, rec);
      applyToBests(rec);
    });

    const merged = Array.from(byId.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 200);

    try {
      localStorage.setItem(SCORED_ROUNDS_STORAGE_KEY, JSON.stringify(merged));
      localStorage.setItem(HIGH_SCORES_STORAGE_KEY, JSON.stringify(bests));
    } catch {
      // Ignore storage errors
    }

    return { rounds: merged, highScores: bests };
  } catch {
    return { rounds: localRounds, highScores: bests };
  }
}

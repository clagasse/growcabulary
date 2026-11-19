import { GardenEntry, GrowthStage, GameMode, RecallOutcome, Word } from '../types';

/**
 * Computes the GrowthStage of a word based on verified SM-2 repetition count and interval days.
 * Mastered stages ('bloom' / 'perennial' [Established]) require multi-week spacing, and lapses reset cleanly.
 */
export function computeGrowthStage(repetitionCount: number, intervalDays: number): GrowthStage {
  if (repetitionCount <= 0) return 'seed';
  if (intervalDays >= 18 && repetitionCount >= 4) return 'perennial';
  if (intervalDays >= 10 && repetitionCount >= 3) return 'bloom';
  if (intervalDays >= 6 && repetitionCount >= 2) return 'bud';
  return 'sprout';
}

/**
 * Mastery bucket helpers:
 * - Mastered: verified 14+ day spaced retention ('bloom' or 'perennial'), excluding composted words.
 * - Learning: active words not yet at 'bloom' / 'perennial'.
 */
export function isWordMastered(entry: GardenEntry): boolean {
  if (entry.isComposted) return false;
  return entry.growthStage === 'bloom' || entry.growthStage === 'perennial';
}

export function isWordLearning(entry: GardenEntry): boolean {
  if (entry.isComposted) return false;
  return !isWordMastered(entry);
}

/**
 * Computes weighted mastery points for Botanical Rank progression so both discovering
 * new words and reviewing flashcards to Bloom/Perennial advance rank.
 */
export function computeMasteryRankPoints(entries: GardenEntry[]): number {
  return entries.reduce((sum, entry) => {
    if (entry.isComposted) return sum;
    switch (entry.growthStage) {
      case 'perennial':
        return sum + 6;
      case 'bloom':
        return sum + 4;
      case 'bud':
        return sum + 2;
      case 'sprout':
        return sum + 1;
      default:
        return sum;
    }
  }, 0);
}

const MS_PER_DAY = 86400000;
export const MIN_INITIAL_WATERING_DAYS = 3;
export const MAX_WATERING_INTERVAL_DAYS = 30;

/**
 * Evaluates whether a learned word in the user's conservatory is due for review ("Thirsty").
 * Composted words are never queued for review.
 */
export function isWordThirsty(entry: GardenEntry): boolean {
  if (entry.isComposted) return false;
  if (!entry.nextReviewDate) {
    // Legacy entries without nextReviewDate wait at least 3 days from lastWateredDate
    if (entry.lastWateredDate) {
      const last = new Date(entry.lastWateredDate).getTime();
      if (!Number.isNaN(last)) {
        return Date.now() - last >= MIN_INITIAL_WATERING_DAYS * MS_PER_DAY;
      }
    }
    return true;
  }
  const now = new Date().getTime();
  const due = new Date(entry.nextReviewDate).getTime();
  return now >= due;
}

/**
 * Returns whole days remaining until this word needs watering (0 if already due).
 */
export function getDaysUntilReview(entry: GardenEntry): number {
  if (entry.isComposted) return 0;
  if (isWordThirsty(entry)) return 0;
  if (!entry.nextReviewDate) return MIN_INITIAL_WATERING_DAYS;
  const remainingMs = new Date(entry.nextReviewDate).getTime() - Date.now();
  return Math.max(1, Math.ceil(remainingMs / MS_PER_DAY));
}

/**
 * Human-readable countdown label for a word's next watering.
 */
export function formatNextReviewLabel(entry: GardenEntry): string {
  if (entry.isComposted) return 'Composted (Skipped)';
  if (entry.dateLearned === 'Undiscovered') return 'Not yet learned';
  if (isWordThirsty(entry)) return 'Needs watering now';
  const days = getDaysUntilReview(entry);
  if (days === 1) return 'Due in 1 day';
  if (days < 14) return `Due in ${days} days`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? 'Due in 1 week' : `Due in ${weeks} weeks`;
}

/**
 * Shared interval progression curve:
 * - Newly learned words wait at least 3 days (3–4d Sprout)
 * - Budding: 6–8d
 * - In Bloom: 10–14d
 * - Established: 18–21d on first arrival, gently scaling up to a 30-day cap
 */
function computeNextIntervalDays(
  prevReps: number,
  prevInterval: number,
  quality: number
): number {
  if (quality < 3) return 2;
  if (prevReps === 0) {
    return quality >= 5 ? 4 : 3;
  }
  if (prevReps === 1) {
    return quality >= 5 ? 8 : 6;
  }
  if (prevReps === 2) {
    return quality >= 5 ? 14 : 10;
  }
  if (prevReps === 3) {
    return quality >= 5 ? 21 : 18;
  }
  const factor = quality >= 5 ? 1.4 : 1.25;
  const scaled = Math.round(prevInterval * factor);
  return Math.min(MAX_WATERING_INTERVAL_DAYS, Math.max(21, scaled));
}

/**
 * Preview the next interval (in days) if the user rates a due word with the given quality.
 */
export function previewNextIntervalDays(entry: GardenEntry, quality: 2 | 4 | 5): number {
  const prevReps = entry.repetitionCount ?? 1;
  const prevInterval = Math.max(
    MIN_INITIAL_WATERING_DAYS,
    entry.intervalDays ?? MIN_INITIAL_WATERING_DAYS
  );
  return computeNextIntervalDays(prevReps, prevInterval, quality);
}

/**
 * Returns a Hydration Percentage (0 - 100%) representing memory freshness.
 */
export function getHydrationPercentage(entry: GardenEntry): number {
  if (!entry.nextReviewDate) return 35; // Needs initial review
  const now = Date.now();
  const due = new Date(entry.nextReviewDate).getTime();
  const last = entry.lastWateredDate
    ? new Date(entry.lastWateredDate).getTime()
    : due - (entry.intervalDays || 1) * 86400000;

  if (now >= due) {
    // Overdue: gradually drops from 40% down to 10% over 7 days overdue
    const overdueDays = (now - due) / 86400000;
    return Math.max(10, Math.round(40 - overdueDays * 5));
  }

  const totalSpan = Math.max(1, due - last);
  const remaining = due - now;
  const ratio = Math.min(1, Math.max(0, remaining / totalSpan));
  return Math.round(45 + ratio * 55);
}

export interface SpacedRepetitionResult {
  entry: GardenEntry;
  scheduleAdvanced: boolean;
}

/**
 * Maps a gameplay outcome ('clean' | 'assisted' | 'missed') to an SM-2 quality grade.
 */
export function outcomeToQuality(outcome: RecallOutcome): number {
  if (outcome === 'clean') return 5;
  if (outcome === 'assisted') return 4;
  return 2;
}

/**
 * Creates a brand-new GardenEntry on first encounter in Seed Sprout, Field Notes, or Compost.
 */
export function createGardenEntry(
  wordObj: Word,
  outcome: RecallOutcome,
  mode: GameMode
): GardenEntry {
  const now = new Date();

  if (outcome === 'composted') {
    return {
      ...wordObj,
      dateLearned: now.toLocaleDateString(),
      repetitionCount: 0,
      easeFactor: 2.5,
      intervalDays: 0,
      lastWateredDate: now.toISOString(),
      nextReviewDate: undefined,
      growthStage: 'seed',
      modesMastered: [],
      isComposted: true,
      compostedAt: now.toISOString(),
    };
  }

  if (outcome === 'missed') {
    const initialMissedWait = new Date(now.getTime() + MIN_INITIAL_WATERING_DAYS * MS_PER_DAY);
    return {
      ...wordObj,
      dateLearned: now.toLocaleDateString(),
      repetitionCount: 0,
      easeFactor: 2.3,
      intervalDays: MIN_INITIAL_WATERING_DAYS,
      lastWateredDate: now.toISOString(),
      // Leave at least 3 days before a freshly encountered word becomes due for watering
      nextReviewDate: initialMissedWait.toISOString(),
      growthStage: 'seed',
      modesMastered: [],
      isComposted: false,
    };
  }

  const initialIntervalDays = outcome === 'clean' ? 4 : MIN_INITIAL_WATERING_DAYS;
  const firstReviewDate = new Date(now.getTime() + initialIntervalDays * MS_PER_DAY);
  return {
    ...wordObj,
    dateLearned: now.toLocaleDateString(),
    repetitionCount: 1,
    easeFactor: outcome === 'clean' ? 2.6 : 2.4,
    intervalDays: initialIntervalDays,
    lastWateredDate: now.toISOString(),
    nextReviewDate: firstReviewDate.toISOString(),
    growthStage: 'sprout',
    modesMastered: [mode],
    isComposted: false,
  };
}

/**
 * Updates a GardenEntry using the SM-2 Spaced Repetition algorithm.
 * Prevents same-day interval inflation when practicing early before nextReviewDate,
 * while always recording modesMastered and handling lapses honestly.
 *
 * @param quality 0-5 rating (5 = clean/easy, 4 = good/assisted, 3 = hard, <3 = missed/again)
 */
export function applySpacedRepetitionWithMeta(
  entry: GardenEntry,
  quality: number,
  mode: GameMode
): SpacedRepetitionResult {
  const now = new Date();
  const prevReps = entry.repetitionCount ?? 1;
  const prevEase = entry.easeFactor ?? 2.5;
  const prevInterval = Math.max(
    MIN_INITIAL_WATERING_DAYS,
    entry.intervalDays ?? MIN_INITIAL_WATERING_DAYS
  );
  const existingModes = entry.modesMastered ?? [];
  const updatedModes = existingModes.includes(mode)
    ? existingModes
    : [...existingModes, mode];

  // If missed ('Again'), reset to Seed and schedule re-review in 2 days
  if (quality < 3) {
    const nextEase = Number(Math.max(1.3, prevEase - 0.2).toFixed(2));
    const retryDate = new Date(now.getTime() + 2 * MS_PER_DAY);
    return {
      scheduleAdvanced: true,
      entry: {
        ...entry,
        repetitionCount: 0,
        easeFactor: nextEase,
        intervalDays: 2,
        lastWateredDate: now.toISOString(),
        nextReviewDate: retryDate.toISOString(),
        growthStage: 'seed',
        modesMastered: existingModes,
        isComposted: false,
      },
    };
  }

  // Only advance the spaced interval if the word is actually due
  const isDue = isWordThirsty(entry);
  if (!isDue) {
    return {
      scheduleAdvanced: false,
      entry: {
        ...entry,
        lastWateredDate: now.toISOString(),
        modesMastered: updatedModes,
        isComposted: false,
      },
    };
  }

  const nextInterval = computeNextIntervalDays(prevReps, prevInterval, quality);

  const nextReps = prevReps + 1;
  const nextEase = Math.max(
    1.3,
    prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  const nextReview = new Date(now.getTime() + nextInterval * MS_PER_DAY);

  return {
    scheduleAdvanced: true,
    entry: {
      ...entry,
      repetitionCount: nextReps,
      easeFactor: Number(nextEase.toFixed(2)),
      intervalDays: nextInterval,
      lastWateredDate: now.toISOString(),
      nextReviewDate: nextReview.toISOString(),
      growthStage: computeGrowthStage(nextReps, nextInterval),
      modesMastered: updatedModes,
      isComposted: false,
    },
  };
}

/**
 * Convenience wrapper returning the updated GardenEntry directly.
 */
export function applySpacedRepetition(
  entry: GardenEntry,
  quality: number,
  mode: GameMode
): GardenEntry {
  return applySpacedRepetitionWithMeta(entry, quality, mode).entry;
}

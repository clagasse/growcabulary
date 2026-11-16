import { GardenEntry, GrowthStage, GameMode, RecallOutcome, Word } from '../types';

/**
 * Computes the GrowthStage of a word based on verified SM-2 repetition count and interval days.
 * Mastered stages ('bloom' / 'perennial') require multi-week spacing, and lapses reset cleanly.
 */
export function computeGrowthStage(repetitionCount: number, intervalDays: number): GrowthStage {
  if (repetitionCount <= 0) return 'seed';
  if (intervalDays >= 30 && repetitionCount >= 4) return 'perennial';
  if (intervalDays >= 14 && repetitionCount >= 3) return 'bloom';
  if (intervalDays >= 3 && repetitionCount >= 2) return 'bud';
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

/**
 * Evaluates whether a learned word in the user's conservatory is due for review ("Thirsty").
 * Composted words are never queued for review.
 */
export function isWordThirsty(entry: GardenEntry): boolean {
  if (entry.isComposted) return false;
  if (!entry.nextReviewDate) {
    // Words migrated from legacy storage without nextReviewDate are ready for review
    return true;
  }
  const now = new Date().getTime();
  const due = new Date(entry.nextReviewDate).getTime();
  return now >= due;
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
    return {
      ...wordObj,
      dateLearned: now.toLocaleDateString(),
      repetitionCount: 0,
      easeFactor: 2.3,
      intervalDays: 1,
      lastWateredDate: now.toISOString(),
      // Missed words are due immediately so they surface right away in Flashcards
      nextReviewDate: now.toISOString(),
      growthStage: 'seed',
      modesMastered: [],
      isComposted: false,
    };
  }

  const tomorrow = new Date(now.getTime() + 86400000);
  return {
    ...wordObj,
    dateLearned: now.toLocaleDateString(),
    repetitionCount: 1,
    easeFactor: outcome === 'clean' ? 2.6 : 2.4,
    intervalDays: 1,
    lastWateredDate: now.toISOString(),
    nextReviewDate: tomorrow.toISOString(),
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
  const prevInterval = entry.intervalDays ?? 1;
  const existingModes = entry.modesMastered ?? [];
  const updatedModes = existingModes.includes(mode)
    ? existingModes
    : [...existingModes, mode];

  // If missed ('Again'), always process the lapse immediately
  if (quality < 3) {
    const nextEase = Number(Math.max(1.3, prevEase - 0.2).toFixed(2));
    return {
      scheduleAdvanced: true,
      entry: {
        ...entry,
        repetitionCount: 0,
        easeFactor: nextEase,
        intervalDays: 1,
        lastWateredDate: now.toISOString(),
        nextReviewDate: now.toISOString(), // immediately due for re-review
        growthStage: 'seed',
        modesMastered: existingModes,
        isComposted: false,
      },
    };
  }

  // Only advance the spaced interval if the word is actually due (or recovering from rep 0)
  const isDue = isWordThirsty(entry) || prevReps === 0;
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

  let nextInterval = prevInterval;
  if (prevReps === 0) {
    nextInterval = 1;
  } else if (prevReps === 1) {
    nextInterval = quality >= 5 ? 4 : 3;
  } else if (prevReps === 2) {
    nextInterval = quality >= 5 ? 8 : 7;
  } else {
    const rawNext = Math.round(prevInterval * prevEase);
    nextInterval = quality >= 5 ? Math.round(rawNext * 1.15) : rawNext;
  }

  const nextReps = prevReps + 1;
  const nextEase = Math.max(
    1.3,
    prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  const nextReview = new Date(now.getTime() + nextInterval * 86400000);

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

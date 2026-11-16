export type DifficultyTier = 'garden' | 'meadow' | 'conservatory';

export type TopicCategory =
  | 'general'
  | 'emotions'
  | 'philosophy'
  | 'biology'
  | 'architecture'
  | 'statecraft'
  | 'literature';

export type SeedType = DifficultyTier | Exclude<TopicCategory, 'general'>;

export type GameMode = 'seed-sprout' | 'field-notes' | 'own-words' | 'watering';

export type GrowthStage = 'seed' | 'sprout' | 'bud' | 'bloom' | 'perennial';

export type RecallOutcome = 'clean' | 'assisted' | 'missed' | 'composted';

export interface Word {
  word: string;
  seed: SeedType;
  topic?: TopicCategory;
  form: string;
  definition: string;
  definition2?: string;
  etymology: string;
  example: string;
  fieldQuote?: string;
  fieldQuoteAuthor?: string;
  origin: string;
  isAiGenerated?: boolean;
}

export interface GardenEntry extends Word {
  dateLearned: string;
  score?: number; // legacy optional field retained for backward-compatible storage
  // Spaced Repetition (SM-2) & Mastery Fields
  repetitionCount?: number;
  easeFactor?: number;
  intervalDays?: number;
  nextReviewDate?: string; // ISO date string
  lastWateredDate?: string; // ISO date string
  growthStage?: GrowthStage;
  modesMastered?: GameMode[];
  userSentence?: string;
  isComposted?: boolean;
  compostedAt?: string;
}

export interface RoundEntryResult {
  word: string;
  outcome: RecallOutcome;
  isNewWord?: boolean;
  previousStage?: GrowthStage;
  nextStage?: GrowthStage;
}

export interface RoundProgress {
  currentRound: number;
  scores: number[];
  completedWordsCount: number;
}

export interface ExtractedRootGroup {
  rootKey: string;
  displayRoot: string;
  meaning: string;
  origin: string;
  words: Word[];
}

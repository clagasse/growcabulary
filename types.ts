export type SeedType = 'garden' | 'meadow' | 'conservatory' | 'philosophy' | 'emotions' | 'biology' | 'architecture';

export interface Word {
  word: string;
  seed: SeedType;
  form: string;
  definition: string;
  definition2?: string;
  etymology: string;
  example: string;
  origin: string;
  isAiGenerated?: boolean;
}

export interface GardenEntry extends Word {
  dateLearned: string;
  score: number;
}

export interface RoundProgress {
  currentRound: number;
  scores: number[];
  completedWordsCount: number;
}
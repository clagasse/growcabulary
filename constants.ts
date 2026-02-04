import { SeedType } from './types';

export const ORIGIN_EMOJI_MAP: Record<string, string> = {
  Latin: '🌿',
  Greek: '🌺',
  French: '🌻',
  'Old English': '🌳',
  German: '🌲',
  Italian: '🌷',
  Arabic: '🌵',
  Dutch: '🌱',
  Spanish: '🍃',
  Scottish: '🍀',
  Norse: '❄️',
  Other: '🍄',
  unknown: '🍄'
};

export const BOTANICAL_RANKS = [
  { min: 0, title: "Seedling", emoji: "🌱" },
  { min: 3, title: "Sprout", emoji: "🌿" },
  { min: 7, title: "Bud", emoji: "🪴" },
  { min: 12, title: "Sapling", emoji: "🎋" },
  { min: 18, title: "Plant", emoji: "☘️" },
  { min: 26, title: "Gardener", emoji: "👨‍🌾" },
  { min: 35, title: "Cultivator", emoji: "👨‍🔧" },
  { min: 46, title: "Botanist", emoji: "🔬" },
  { min: 60, title: "Dendrologist", emoji: "🌲" },
  { min: 80, title: "Arboriculturalist", emoji: "🌳" },
  { min: 100, title: "Sage", emoji: "🧙" },
  { min: 130, title: "Lexicographer", emoji: "🏛️" },
  { min: 170, title: "Grand Arborist", emoji: "👑" }
];

export const WORD_BANKS: { type: SeedType; label: string; emoji: string; description: string }[] = [
  { 
    type: 'garden', 
    label: 'Garden', 
    emoji: '🌱', 
    description: 'Foundational words that are expressive but widely understood.' 
  },
  { 
    type: 'meadow', 
    label: 'Meadow', 
    emoji: '🪷', 
    description: 'Sophisticated vocabulary found in literature and advanced reading.' 
  },
  { 
    type: 'conservatory', 
    label: 'Conservatory', 
    emoji: '🪻', 
    description: 'Obscure and challenging terms for scholars and bookworms.' 
  },
];

export const NICHE_BANKS: { type: SeedType; label: string; emoji: string; description: string }[] = [
  {
    type: 'philosophy',
    label: 'Philosophy',
    emoji: '🏛️',
    description: 'Complex terms regarding existence, knowledge, and logic.'
  },
  {
    type: 'emotions',
    label: 'Strong Emotions',
    emoji: '🎭',
    description: 'Sophisticated terms for the complex spectrum of human feelings.'
  },
  {
    type: 'biology',
    label: 'Biology',
    emoji: '🧬',
    description: 'Scientific terms relating to life, organisms, and ecosystems.'
  },
  {
    type: 'architecture',
    label: 'Architecture',
    emoji: '🏗️',
    description: 'Technical and aesthetic terms for the built environment.'
  }
];

export const INITIAL_SCORE = 60;
export const WRONG_GUESS_PENALTY = 10;
export const WORDS_PER_ROUND = 6;
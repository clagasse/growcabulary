
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

export const WORD_BANKS: { type: SeedType; label: string; emoji: string; description: string }[] = [
  { 
    type: 'uncommon', 
    label: 'Uncommon', 
    emoji: '🌱', 
    description: 'Foundational words that are expressive but widely understood.' 
  },
  { 
    type: 'rare', 
    label: 'Rare', 
    emoji: '🪷', 
    description: 'Sophisticated vocabulary found in academic and literary works.' 
  },
  { 
    type: 'exotic', 
    label: 'Exotic', 
    emoji: '🪻', 
    description: 'Obscure and highly challenging terms for advanced learners.' 
  },
];

export const INITIAL_SCORE = 60;
export const WRONG_GUESS_PENALTY = 10;
export const TIME_REVEAL_INTERVAL = 5; // seconds
export const WORDS_PER_ROUND = 6;

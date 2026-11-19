import {
  SeedType,
  GrowthStage,
  GameMode,
  DifficultyTier,
  TopicCategory,
} from './types';

export const ORIGIN_EMOJI_MAP: Record<string, string> = {
  Latin: '🌿',
  Greek: '🌺',
  'Ancient Greek': '🌺',
  French: '🌻',
  'Old French': '🌻',
  'Old English': '🌳',
  'Middle English': '🌳',
  English: '🌳',
  'American English': '🌳',
  German: '🌲',
  Italian: '🌷',
  Arabic: '🌵',
  Hebrew: '🌵',
  Tamil: '🌵',
  Persian: '🌵',
  Turkish: '🌵',
  Dutch: '🌱',
  Spanish: '🍃',
  Portuguese: '🍃',
  Scottish: '🍀',
  Celtic: '🍀',
  Frankish: '🌲',
  'Proto-Germanic': '🌲',
  Norse: '❄️',
  'Old Norse': '❄️',
  Scandinavian: '❄️',
  'Proto-Indo-European': '🌍',
  Other: '🍄',
  unknown: '🍄',
};

export const BOTANICAL_RANKS = [
  { min: 0, title: 'Forager', emoji: '🧺' },
  { min: 3, title: 'Seed Sower', emoji: '🌱' },
  { min: 8, title: 'Planter', emoji: '🌿' },
  { min: 15, title: 'Waterer', emoji: '💧' },
  { min: 25, title: 'Caretaker', emoji: '🧤' },
  { min: 40, title: 'Gardener', emoji: '👨‍🌾' },
  { min: 60, title: 'Cultivator', emoji: '👨‍🔧' },
  { min: 90, title: 'Botanist', emoji: '🔬' },
  { min: 130, title: 'Dendrologist', emoji: '🌲' },
  { min: 180, title: 'Arboriculturalist', emoji: '🌳' },
  { min: 260, title: 'Sage', emoji: '🧙' },
  { min: 380, title: 'Lexicographer', emoji: '🏛️' },
  { min: 540, title: 'Etymologist', emoji: '📜' },
  { min: 750, title: 'Conservatory Laureate', emoji: '🏅' },
  { min: 1050, title: 'Keeper of Roots', emoji: '🪵' },
  { min: 1500, title: 'Grand Arborist', emoji: '👑' },
];

export const GROWTH_STAGE_META: Record<
  GrowthStage,
  { label: string; emoji: string; minReps: number; description: string; badgeClass: string }
> = {
  seed: {
    label: 'Seed',
    emoji: '🌰',
    minReps: 0,
    description: 'Newly planted in your lexicon; needs initial watering.',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  sprout: {
    label: 'Sprout',
    emoji: '🌱',
    minReps: 1,
    description: 'First roots established through active recall.',
    badgeClass: 'bg-lime-100 text-lime-800 border-lime-200',
  },
  bud: {
    label: 'Budding',
    emoji: '🪴',
    minReps: 2,
    description: 'Strengthened by spaced-repetition watering.',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  bloom: {
    label: 'In Bloom',
    emoji: '🌸',
    minReps: 4,
    description: 'Thriving across multiple contexts.',
    badgeClass: 'bg-pink-100 text-pink-800 border-pink-200',
  },
  perennial: {
    label: 'Established',
    emoji: '🌳',
    minReps: 6,
    description: 'Deeply rooted in long-term memory (18–30 day interval).',
    badgeClass: 'bg-teal-900 text-teal-50 border-teal-800',
  },
};

export const GAME_MODES_META: {
  id: GameMode;
  title: string;
  emoji: string;
  badge: string;
  description: string;
  usesDiscoveredOnly?: boolean;
  isPlaceholder?: boolean;
}[] = [
  {
    id: 'seed-sprout',
    title: 'Seed Sprout',
    emoji: '🌱',
    badge: 'Discover Words',
    description:
      'Discover and plant new words by deducing them from their definition, origin, and example sentence.',
    usesDiscoveredOnly: false,
  },
  {
    id: 'field-notes',
    title: 'Field Notes',
    emoji: '✍️',
    badge: 'Reinforce Usage',
    description:
      'Read a real-life quote or field note example and choose which of your discovered words fits the blank.',
    usesDiscoveredOnly: true,
  },
  {
    id: 'own-words',
    title: 'In Your Own Words',
    emoji: '🪶',
    badge: 'Write Sentences',
    description:
      'Write a sentence using one of your discovered words and check your usage.',
    usesDiscoveredOnly: true,
    isPlaceholder: false,
  },
];

export const WORD_BANKS: {
  type: DifficultyTier;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    type: 'garden',
    label: 'Pasture',
    emoji: '🌱',
    description: 'Foundational words that are expressive but widely understood.',
  },
  {
    type: 'meadow',
    label: 'Meadow',
    emoji: '🪷',
    description: 'Sophisticated vocabulary found in literature and advanced reading.',
  },
  {
    type: 'conservatory',
    label: 'Conservatory',
    emoji: '🪻',
    description: 'Obscure and challenging terms for scholars and bookworms.',
  },
];

export const NICHE_BANKS: {
  type: Exclude<TopicCategory, 'general'>;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    type: 'emotions',
    label: 'Psyche, Character & Behavior',
    emoji: '🎭',
    description:
      'States of mind, emotional depth, personality traits, manners, virtues, and human behavior.',
  },
  {
    type: 'philosophy',
    label: 'Mind, Ideas & Philosophy',
    emoji: '🏛️',
    description:
      'Cognition, logic, knowledge, mystery, ethics, belief, and abstract concepts.',
  },
  {
    type: 'biology',
    label: 'Nature, Body & Ecology',
    emoji: '🌿',
    description:
      'Living systems, anatomy, physical traits, landscapes, weather, and natural forces.',
  },
  {
    type: 'architecture',
    label: 'Art, Design & Sensory Form',
    emoji: '🎨',
    description:
      'Visual craft, spatial structure, texture, light, aesthetics, and sensory qualities.',
  },
  {
    type: 'statecraft',
    label: 'History, Society & Power',
    emoji: '⚖️',
    description:
      'Diplomacy, governance, historical eras, social groups, law, and conflict.',
  },
  {
    type: 'literature',
    label: 'Language, Speech & Literature',
    emoji: '📜',
    description:
      'Narrative craft, tone, persuasion, wit, praise, critique, and linguistic expression.',
  },
];

export interface CategoryMeta {
  type: SeedType | TopicCategory;
  label: string;
  emoji: string;
  description: string;
  group: 'difficulty' | 'topic';
  badgeClass: string;
  accentBarClass?: string;
  cardTintClass?: string;
}

const TOPIC_ACCENT_CLASSES: Record<
  TopicCategory,
  { accentBarClass: string; cardTintClass: string }
> = {
  general: {
    accentBarClass: 'bg-emerald-600/65',
    cardTintClass: 'from-[#F4FAF1]/70 via-[#FFFDF8] to-[#FFFDF8]',
  },
  emotions: {
    accentBarClass: 'bg-rose-400/80',
    cardTintClass: 'from-rose-50/55 via-[#FFFDF8] to-[#FFFDF8]',
  },
  philosophy: {
    accentBarClass: 'bg-amber-500/80',
    cardTintClass: 'from-amber-50/55 via-[#FFFDF8] to-[#FFFDF8]',
  },
  biology: {
    accentBarClass: 'bg-lime-600/75',
    cardTintClass: 'from-lime-50/55 via-[#FFFDF8] to-[#FFFDF8]',
  },
  architecture: {
    accentBarClass: 'bg-orange-400/80',
    cardTintClass: 'from-orange-50/55 via-[#FFFDF8] to-[#FFFDF8]',
  },
  statecraft: {
    accentBarClass: 'bg-slate-500/75',
    cardTintClass: 'from-slate-100/60 via-[#FFFDF8] to-[#FFFDF8]',
  },
  literature: {
    accentBarClass: 'bg-purple-500/75',
    cardTintClass: 'from-purple-50/55 via-[#FFFDF8] to-[#FFFDF8]',
  },
};

const CATEGORY_BADGE_CLASSES: Record<SeedType | TopicCategory, string> = {
  garden: 'bg-[#E8F4E6] text-emerald-900 border-[#BBD9B7]',
  meadow: 'bg-[#E6F3EE] text-teal-900 border-[#B4D8CB]',
  conservatory: 'bg-[#EFEAF8] text-indigo-900 border-[#CCC0E6]',
  general: 'bg-stone-100 text-stone-800 border-stone-300',
  emotions: 'bg-[#FBECEF] text-rose-900 border-[#ECC3CD]',
  philosophy: 'bg-[#FAF1E0] text-amber-900 border-[#E2CD9E]',
  biology: 'bg-[#ECF5E3] text-lime-900 border-[#C1DCA8]',
  architecture: 'bg-[#FBF0E4] text-orange-900 border-[#E8CAA8]',
  statecraft: 'bg-[#E9EFF7] text-slate-900 border-[#BDCBDD]',
  literature: 'bg-[#F5EBF5] text-purple-900 border-[#D8BEE0]',
};

export const TOPIC_CATEGORIES: {
  type: TopicCategory;
  label: string;
  emoji: string;
  description: string;
  badgeClass: string;
  accentBarClass: string;
  cardTintClass: string;
}[] = [
  ...NICHE_BANKS.map((b) => ({
    ...b,
    badgeClass: CATEGORY_BADGE_CLASSES[b.type],
    ...TOPIC_ACCENT_CLASSES[b.type],
  })),
  {
    type: 'general',
    label: 'General',
    emoji: '🌾',
    description:
      'Versatile, expressive words for everyday, descriptive, and cross-disciplinary use.',
    badgeClass: CATEGORY_BADGE_CLASSES.general,
    ...TOPIC_ACCENT_CLASSES.general,
  },
];

export const ALL_CATEGORIES: CategoryMeta[] = [
  ...WORD_BANKS.map((b) => ({
    ...b,
    group: 'difficulty' as const,
    badgeClass: CATEGORY_BADGE_CLASSES[b.type],
  })),
  ...TOPIC_CATEGORIES.map((b) => ({
    ...b,
    group: 'topic' as const,
  })),
];

const DIFFICULTY_SET = new Set<string>(['garden', 'meadow', 'conservatory']);
const TOPIC_SET = new Set<string>([
  'general',
  'emotions',
  'philosophy',
  'biology',
  'architecture',
  'statecraft',
  'literature',
]);

export function isDifficultyTier(val?: string): val is DifficultyTier {
  return Boolean(val && DIFFICULTY_SET.has(val));
}

export function isTopicCategory(val?: string): val is TopicCategory {
  return Boolean(val && TOPIC_SET.has(val));
}

export function getWordDifficulty(word: { seed?: string; topic?: string }): DifficultyTier {
  if (isDifficultyTier(word?.seed)) return word.seed;
  if (word?.seed && word.seed !== 'general' && TOPIC_SET.has(word.seed)) {
    return 'conservatory';
  }
  return 'garden';
}

export function getWordTopic(word: { seed?: string; topic?: string }): TopicCategory {
  if (isTopicCategory(word?.topic)) return word.topic;
  if (word?.seed && word.seed !== 'general' && TOPIC_SET.has(word.seed)) {
    return word.seed as TopicCategory;
  }
  return 'general';
}

export function getDifficultyMeta(
  seedOrWord: string | { seed?: string; topic?: string }
): CategoryMeta {
  const tier =
    typeof seedOrWord === 'string'
      ? getWordDifficulty({ seed: seedOrWord })
      : getWordDifficulty(seedOrWord);
  return (
    ALL_CATEGORIES.find((c) => c.type === tier) || {
      type: 'garden',
      label: 'Pasture',
      emoji: '🌱',
      description: '',
      group: 'difficulty',
      badgeClass: CATEGORY_BADGE_CLASSES.garden,
    }
  );
}

export function getTopicMeta(
  topicOrWord?: string | { seed?: string; topic?: string }
): CategoryMeta {
  const topic =
    typeof topicOrWord === 'string'
      ? isTopicCategory(topicOrWord)
        ? topicOrWord
        : 'general'
      : topicOrWord
      ? getWordTopic(topicOrWord)
      : 'general';
  return (
    ALL_CATEGORIES.find((c) => c.type === topic) || {
      type: 'general',
      label: 'General',
      emoji: '🌾',
      description: '',
      group: 'topic',
      badgeClass: CATEGORY_BADGE_CLASSES.general,
    }
  );
}

export function getCategoryMeta(seed: SeedType | TopicCategory | string): CategoryMeta {
  const found = ALL_CATEGORIES.find((c) => c.type === seed);
  if (found) return found;
  return {
    type: 'garden',
    label: String(seed || 'Pasture'),
    emoji: '🌱',
    description: '',
    group: 'difficulty',
    badgeClass: CATEGORY_BADGE_CLASSES.garden,
  };
}

export const WORDS_PER_ROUND = 6;

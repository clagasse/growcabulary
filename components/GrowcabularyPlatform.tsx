'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Word,
  SeedType,
  DifficultyTier,
  TopicCategory,
  GardenEntry,
  GameMode,
  RecallOutcome,
  RoundEntryResult,
} from '../types';
import {
  WORD_BANKS,
  TOPIC_CATEGORIES,
  ORIGIN_EMOJI_MAP,
  WORDS_PER_ROUND,
  BOTANICAL_RANKS,
  GAME_MODES_META,
  GROWTH_STAGE_META,
  getDifficultyMeta,
  getTopicMeta,
  getWordDifficulty,
  getWordTopic,
  isTopicCategory,
} from '../constants';
import { RAW_WORDS } from '../utils/data';
import {
  isWordThirsty,
  isWordMastered,
  isWordLearning,
  computeMasteryRankPoints,
  createGardenEntry,
  applySpacedRepetition,
  outcomeToQuality,
  formatNextReviewLabel,
} from '../utils/srs';
import {
  evaluateWordGuess,
  findNextUnrevealedIndex,
  findPrevUnrevealedIndex,
  getInitialRevealedIndices,
  getNextLetterToReveal,
  isSeparatorChar,
  placeCharFromTileBank,
  removeCharForTileBank,
} from '../utils/wordHints';
import { BotanistFieldNotesGame } from './games/BotanistFieldNotesGame';
import { InYourOwnWordsPlaceholder } from './games/InYourOwnWordsPlaceholder';
import { WordHintToolbar } from './games/WordHintToolbar';
import { SecretGardenConservatory } from './garden/SecretGardenConservatory';
import {
  DECAY_WINDOW_SECONDS,
  LETTER_HINT_PENALTY,
  LETTER_TILES_PENALTY,
  ScoredRoundRecord,
  computeTimeScore,
  computeWordPoints,
  fetchAndMergeCloudScoredRounds,
  getDifficultyScoreMultiplier,
  getStreakMultiplier,
  pushScoredRoundToSupabase,
  saveRoundHighScore,
  saveScoredRoundLocal,
} from '../utils/scoring';
import { OnboardingTutorialModal } from './OnboardingTutorialModal';
import { FeedbackModal, SUPPORT_URL } from './FeedbackModal';
import { SpeakWordButton, speakWord } from './SpeakWordButton';
import { BotanicalPlateSpecimen } from './BotanicalPlateSpecimen';
import { createClient, isSupabaseConfigured, canAccessCurator } from '../utils/supabase/client';
import {
  Droplets,
  UserCheck,
  Settings,
  Flower2,
  LogOut,
  Archive,
  Undo2,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Coffee,
  Star,
  Menu,
  X,
} from 'lucide-react';

function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const RAW_WORDS_BY_KEY = new Map<string, Word>(
  RAW_WORDS.map((w) => [w.word.toLowerCase(), w])
);

function normalizeGardenEntry(
  entry: GardenEntry,
  lexiconMap: Map<string, Word> = RAW_WORDS_BY_KEY
): GardenEntry | null {
  const match = lexiconMap.get(entry.word.toLowerCase());
  if (!match) return null;
  return {
    ...entry,
    ...match,
    seed: getWordDifficulty(match),
    topic: getWordTopic(match),
  };
}

export const GrowcabularyPlatform: React.FC = () => {
  const migrateSeedType = (oldType: string): DifficultyTier | 'all' => {
    if (oldType === 'all') return 'all';
    if (oldType === 'uncommon' || oldType === 'garden') return 'garden';
    if (oldType === 'rare' || oldType === 'meadow') return 'meadow';
    if (oldType === 'exotic' || oldType === 'conservatory') return 'conservatory';
    return 'conservatory';
  };

  const [hydrated, setHydrated] = useState(false);
  const [lexiconWords, setLexiconWords] = useState<Word[]>(RAW_WORDS);
  const [cloudUser, setCloudUser] = useState<{ id: string; email?: string; name?: string } | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>('seed-sprout');
  const [selectedSeed, setSelectedSeed] = useState<DifficultyTier | 'all' | null>(null);
  const [seedSproutTopicFilter, setSeedSproutTopicFilter] = useState<TopicCategory | 'all'>('all');
  const [activeTopicFilter, setActiveTopicFilter] = useState<TopicCategory | 'all'>('all');
  const [fieldNotesDeckFilter, setFieldNotesDeckFilter] = useState<DifficultyTier | 'all'>('all');
  const [fieldNotesTopicFilter, setFieldNotesTopicFilter] = useState<TopicCategory | 'all'>('all');
  const [ownWordsDeckFilter, setOwnWordsDeckFilter] = useState<DifficultyTier | 'all'>('all');
  const [ownWordsTopicFilter, setOwnWordsTopicFilter] = useState<TopicCategory | 'all'>('all');

  // Seed Sprout (Untimed, Manual Hints) state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [remainingWords, setRemainingWords] = useState<Word[]>([]);
  const [guess, setGuess] = useState<string[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [letterBankActive, setLetterBankActive] = useState(false);
  const [usedAssistedHint, setUsedAssistedHint] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [wordOutcome, setWordOutcome] = useState<RecallOutcome | null>(null);
  const [message, setMessage] = useState('');
  const [animation, setAnimation] = useState<'success' | 'failure' | 'wrong' | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // Optional Scored Mode state
  const [isScoredMode, setIsScoredMode] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [roundCleanStreak, setRoundCleanStreak] = useState(0);
  const [wordElapsedSec, setWordElapsedSec] = useState(0);
  const [wordPenaltyPts, setWordPenaltyPts] = useState(0);
  const [letterTilesPenalized, setLetterTilesPenalized] = useState(false);
  const [lastWordPts, setLastWordPts] = useState<number | null>(null);
  const [isNewBestRound, setIsNewBestRound] = useState(false);

  // Persistent Learning & Habit Progress
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [lastPracticeDate, setLastPracticeDate] = useState<string>('');
  const [dailyWordsToday, setDailyWordsToday] = useState<number>(0);
  const [playedWords, setPlayedWords] = useState<string[]>([]);
  const [gardenList, setGardenList] = useState<GardenEntry[]>([]);

  // UI & Modals
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMainMenu, setShowMobileMainMenu] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [conservatoryInitialMode, setConservatoryInitialMode] = useState<'grid' | 'flashcards'>('grid');
  const [isPlantWateringRound, setIsPlantWateringRound] = useState(false);
  const [selectedGardenWord, setSelectedGardenWord] = useState<GardenEntry | null>(null);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [roundResults, setRoundResults] = useState<RoundEntryResult[]>([]);
  const [deckNotice, setDeckNotice] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ show: false, title: '', message: '', action: () => {} });

  // Hydrate from localStorage on client mount
  useEffect(() => {
    if (!showMobileMainMenu) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMobileMainMenu(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showMobileMainMenu]);

  useEffect(() => {
    try {
      const savedSeed = localStorage.getItem('growcabulary_selected_seed');
      if (savedSeed) {
        setSelectedSeed(migrateSeedType(savedSeed));
        if (isTopicCategory(savedSeed) && savedSeed !== 'general') {
          setSeedSproutTopicFilter(savedSeed);
        }
      }

      const todayKey = getLocalDateKey();
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayKey = getLocalDateKey(yesterdayDate);

      const savedLastDate = localStorage.getItem('growcabulary_last_practice_date') || '';
      const savedDailyStreak = Number(localStorage.getItem('growcabulary_daily_streak')) || 0;
      const savedDailyCount = Number(localStorage.getItem('growcabulary_daily_words')) || 0;

      if (savedLastDate === todayKey) {
        setDailyStreak(Math.max(1, savedDailyStreak));
        setDailyWordsToday(savedDailyCount);
        setLastPracticeDate(savedLastDate);
      } else if (savedLastDate === yesterdayKey) {
        setDailyStreak(savedDailyStreak);
        setDailyWordsToday(0);
        setLastPracticeDate(savedLastDate);
      } else {
        setDailyStreak(0);
        setDailyWordsToday(0);
        setLastPracticeDate(savedLastDate);
      }

      const savedPlayed = localStorage.getItem('growcabulary_played_words');
      if (savedPlayed) setPlayedWords(JSON.parse(savedPlayed));

      const savedGarden = localStorage.getItem('growcabulary_garden');
      let hasSavedWords = false;
      if (savedGarden) {
        const parsedGarden = JSON.parse(savedGarden);
        if (Array.isArray(parsedGarden)) {
          const validLocal = parsedGarden
            .map((item) => normalizeGardenEntry(item))
            .filter((item): item is GardenEntry => Boolean(item));
          hasSavedWords = validLocal.length > 0;
          setGardenList(validLocal);
        }
      }

      const seenTutorial = localStorage.getItem('growcabulary_tutorial_seen') === 'true';
      if (!seenTutorial && !hasSavedWords) {
        setShowTutorial(true);
      }
    } catch (e) {
      console.error('Error hydrating local storage:', e);
    } finally {
      setHydrated(true);
    }
  }, []);

  const serializeEntryForCloud = useCallback(
    (entry: GardenEntry, userId: string) => {
      const baseModes = entry.modesMastered || [];
      let syncModes: string[] = baseModes.filter(
        (m) => (m as string) !== 'compost' && (m as string) !== 'favorite'
      );
      if (entry.isComposted) syncModes.push('compost');
      if (entry.isFavorite) syncModes.push('favorite');

      return {
        user_id: userId,
        word_term: entry.word,
        best_score: entry.score || 0,
        repetition_count: entry.repetitionCount ?? 1,
        ease_factor: entry.easeFactor ?? 2.5,
        interval_days: entry.intervalDays ?? 1,
        next_review_date:
          entry.nextReviewDate || new Date(Date.now() + 86400000).toISOString(),
        last_watered_date: entry.lastWateredDate || new Date().toISOString(),
        growth_stage: entry.growthStage || 'sprout',
        modes_mastered: syncModes,
        updated_at: new Date().toISOString(),
      };
    },
    []
  );

  // Hydrate approved words + Field Notes alternatives & In Your Own Words scenarios from Supabase
  useEffect(() => {
    if (!hydrated || !isSupabaseConfigured()) return;
    let cancelled = false;
    const supabase = createClient();

    const loadCloudLexicon = async () => {
      type CloudWordRow = {
        term: string;
        part_of_speech: string;
        definition: string;
        definition2?: string | null;
        etymology: string;
        origin?: string | null;
        example_sentence: string;
        field_quote?: string | null;
        field_quote_author?: string | null;
        topic?: string | null;
        field_alternatives?: Word['fieldAlternatives'] | null;
        decks?: { slug?: string } | Array<{ slug?: string }> | null;
      };

      const extendedSelect =
        'term, part_of_speech, definition, definition2, etymology, origin, example_sentence, field_quote, field_quote_author, topic, field_alternatives, decks!inner(slug)';
      const midSelect =
        'term, part_of_speech, definition, definition2, etymology, origin, example_sentence, topic, field_alternatives, decks!inner(slug)';
      const baseSelect =
        'term, part_of_speech, definition, definition2, etymology, origin, example_sentence, decks!inner(slug)';

      const extRes = await supabase
        .from('words')
        .select(extendedSelect)
        .eq('status', 'approved');

      let cloudWordRows = extRes.data as CloudWordRow[] | null;
      let queryError = extRes.error;

      if (queryError && /field_quote/i.test(queryError.message)) {
        const midRes = await supabase
          .from('words')
          .select(midSelect)
          .eq('status', 'approved');
        cloudWordRows = midRes.data as CloudWordRow[] | null;
        queryError = midRes.error;
      }

      if (
        queryError &&
        /column|schema cache|topic|field_alternatives/i.test(queryError.message)
      ) {
        const baseRes = await supabase
          .from('words')
          .select(baseSelect)
          .eq('status', 'approved');
        cloudWordRows = baseRes.data as CloudWordRow[] | null;
        queryError = baseRes.error;
      }

      if (cancelled || queryError || !Array.isArray(cloudWordRows) || cloudWordRows.length === 0) {
        return;
      }

      const merged = new Map<string, Word>(
        RAW_WORDS.map((w) => [w.word.toLowerCase(), { ...w }])
      );

      for (const row of cloudWordRows) {
        if (!row.term) continue;
        const key = row.term.trim().toLowerCase();
        const existing = merged.get(key);
        const deckRel = Array.isArray(row.decks) ? row.decks[0] : row.decks;
        const deckSlug = (deckRel?.slug || existing?.seed || 'meadow') as SeedType;
        const validTopic =
          row.topic &&
          ['general', 'emotions', 'philosophy', 'biology', 'architecture', 'statecraft', 'literature'].includes(
            row.topic
          )
            ? (row.topic as TopicCategory)
            : existing?.topic;

        const nextWord: Word = {
          ...(existing || {}),
          word: row.term.trim(),
          seed: getWordDifficulty({ seed: deckSlug }),
          topic: validTopic || getWordTopic({ seed: deckSlug }),
          form: row.part_of_speech || existing?.form || 'noun',
          definition: row.definition || existing?.definition || '',
          ...(row.definition2 ? { definition2: row.definition2 } : existing?.definition2 ? { definition2: existing.definition2 } : {}),
          etymology: row.etymology || existing?.etymology || '',
          origin: row.origin || existing?.origin || 'Latin',
          example: row.example_sentence || existing?.example || '',
          ...(row.field_quote ? { fieldQuote: row.field_quote } : existing?.fieldQuote ? { fieldQuote: existing.fieldQuote } : {}),
          ...(row.field_quote_author
            ? { fieldQuoteAuthor: row.field_quote_author }
            : existing?.fieldQuoteAuthor
            ? { fieldQuoteAuthor: existing.fieldQuoteAuthor }
            : {}),
          ...(row.field_alternatives
            ? { fieldAlternatives: row.field_alternatives }
            : {}),
        };
        merged.set(key, nextWord);
      }

      const nextList = Array.from(merged.values());
      setLexiconWords(nextList);

      // Refresh metadata onto any already-hydrated garden entries
      setGardenList((prev) =>
        prev.map((entry) => {
          const match = merged.get(entry.word.toLowerCase());
          return match
            ? {
                ...entry,
                ...match,
                seed: getWordDifficulty(match),
                topic: getWordTopic(match),
              }
            : entry;
        })
      );
    };

    loadCloudLexicon();
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  // Connect to Supabase Auth & bidirectionally merge cloud user_word_progress if configured
  useEffect(() => {
    if (!hydrated || !isSupabaseConfigured()) return;
    const supabase = createClient();

    const syncWithCloud = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setCloudUser(null);
        return;
      }

      setCloudUser({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.display_name || user.email?.split('@')[0],
      });

      let localSnapshot: GardenEntry[] = [];
      try {
        const rawLocal = localStorage.getItem('growcabulary_garden');
        const parsed = rawLocal ? JSON.parse(rawLocal) : [];
        if (Array.isArray(parsed)) localSnapshot = parsed;
      } catch {
        localSnapshot = [];
      }

      // Pull existing cloud progress
      const { data: cloudRows, error: fetchErr } = await supabase
        .from('user_word_progress')
        .select('*')
        .eq('user_id', user.id);

      if (fetchErr) {
        console.warn('Supabase cloud progress fetch warning:', fetchErr.message);
        return;
      }

      const mergedMap = new Map<string, GardenEntry>();
      localSnapshot.forEach((item) => {
        const normalized = normalizeGardenEntry(item);
        if (normalized) {
          mergedMap.set(normalized.word.toLowerCase(), normalized);
        }
      });

      const cloudTimeByTerm = new Map<string, number>();

      for (const row of cloudRows || []) {
        const termKey = (row.word_term || '').toLowerCase();
        const lexiconMatch = lexiconWords.find((w) => w.word.toLowerCase() === termKey);
        if (!lexiconMatch) continue;

        const cloudUpdatedAt = new Date(
          row.updated_at || row.last_watered_date || 0
        ).getTime();
        cloudTimeByTerm.set(termKey, cloudUpdatedAt);

        const existing = mergedMap.get(termKey);
        const rawModes: string[] = Array.isArray(row.modes_mastered)
          ? row.modes_mastered
          : [];
        const isCompostedFromCloud =
          Boolean(row.is_composted) || rawModes.includes('compost');
        const isFavoriteFromCloud = rawModes.includes('favorite');
        const cleanModes = rawModes.filter(
          (m): m is GameMode =>
            m === 'seed-sprout' ||
            m === 'field-notes' ||
            m === 'own-words' ||
            m === 'watering'
        );

        const localUpdatedAt = Math.max(
          new Date(existing?.compostedAt || existing?.lastWateredDate || 0).getTime(),
          new Date(existing?.favoritedAt || 0).getTime()
        );

        if (!existing || cloudUpdatedAt >= localUpdatedAt) {
          mergedMap.set(termKey, {
            ...lexiconMatch,
            score: typeof row.best_score === 'number' ? row.best_score : existing?.score,
            dateLearned: new Date(row.created_at || Date.now()).toLocaleDateString(),
            repetitionCount: row.repetition_count ?? 1,
            easeFactor: Number(row.ease_factor ?? 2.5),
            intervalDays: row.interval_days ?? 1,
            nextReviewDate: row.next_review_date,
            lastWateredDate: row.last_watered_date,
            growthStage: row.growth_stage || 'sprout',
            modesMastered: cleanModes,
            userSentence: existing?.userSentence,
            isFavorite: isFavoriteFromCloud,
            favoritedAt: isFavoriteFromCloud ? existing?.favoritedAt || row.updated_at : undefined,
            isComposted: isCompostedFromCloud,
          });
        }
      }

      const entriesToUpload: GardenEntry[] = [];
      for (const [termKey, entry] of mergedMap.entries()) {
        const localUpdatedAt = Math.max(
          new Date(entry.compostedAt || entry.lastWateredDate || 0).getTime(),
          new Date(entry.favoritedAt || 0).getTime()
        );
        const cloudTime = cloudTimeByTerm.get(termKey);
        if (cloudTime === undefined || localUpdatedAt > cloudTime) {
          entriesToUpload.push(entry);
        }
      }

      if (mergedMap.size > 0) {
        setGardenList(Array.from(mergedMap.values()));
      }

      if (entriesToUpload.length > 0) {
        const rows = entriesToUpload.map((entry) =>
          serializeEntryForCloud(entry, user.id)
        );
        const { error: uploadErr } = await supabase
          .from('user_word_progress')
          .upsert(rows, { onConflict: 'user_id,word_term' });
        if (uploadErr) {
          console.warn('Supabase local-to-cloud merge warning:', uploadErr.message);
        }
      }

      fetchAndMergeCloudScoredRounds();
    };

    syncWithCloud();
  }, [hydrated, serializeEntryForCloud]);

  const pushEntryToSupabase = useCallback(
    async (entry: GardenEntry) => {
      if (!cloudUser || !isSupabaseConfigured()) return;
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('user_word_progress')
          .upsert(serializeEntryForCloud(entry, cloudUser.id), {
            onConflict: 'user_id,word_term',
          });
        if (error) {
          console.warn('Supabase sync warning:', error.message);
        }
      } catch (e) {
        console.error('Supabase sync error:', e);
      }
    },
    [cloudUser, serializeEntryForCloud]
  );

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('growcabulary_garden', JSON.stringify(gardenList));
  }, [gardenList, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('growcabulary_played_words', JSON.stringify(playedWords));
  }, [playedWords, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('growcabulary_daily_streak', String(dailyStreak));
    localStorage.setItem('growcabulary_last_practice_date', lastPracticeDate);
    localStorage.setItem('growcabulary_daily_words', String(dailyWordsToday));
  }, [dailyStreak, lastPracticeDate, dailyWordsToday, hydrated]);

  useEffect(() => {
    if (!hydrated || !selectedSeed) return;
    localStorage.setItem('growcabulary_selected_seed', selectedSeed);
  }, [selectedSeed, hydrated]);

  const touchDailyPractice = useCallback(() => {
    const todayKey = getLocalDateKey();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayKey = getLocalDateKey(yesterdayDate);

    setDailyWordsToday((prev) => (lastPracticeDate === todayKey ? prev + 1 : 1));
    if (lastPracticeDate !== todayKey) {
      setDailyStreak((prev) => (lastPracticeDate === yesterdayKey ? prev + 1 : 1));
      setLastPracticeDate(todayKey);
    } else if (dailyStreak === 0) {
      setDailyStreak(1);
    }
  }, [lastPracticeDate, dailyStreak]);

  const currentWord = remainingWords[currentWordIndex];

  const activeGardenList = useMemo(
    () => gardenList.filter((g) => !g.isComposted),
    [gardenList]
  );

  const compostCount = useMemo(
    () => gardenList.filter((g) => g.isComposted).length,
    [gardenList]
  );

  const activeLexiconWords = useMemo(() => {
    const compostedSet = new Set(
      gardenList.filter((g) => g.isComposted).map((g) => g.word.toLowerCase())
    );
    return lexiconWords.filter((w) => !compostedSet.has(w.word.toLowerCase()));
  }, [gardenList, lexiconWords]);

  const masteredTotal = useMemo(
    () => activeGardenList.filter((g) => isWordMastered(g)).length,
    [activeGardenList]
  );

  const masteryPoints = useMemo(
    () => computeMasteryRankPoints(gardenList),
    [gardenList]
  );

  const userRank =
    [...BOTANICAL_RANKS].reverse().find((r) => masteryPoints >= r.min) ||
    BOTANICAL_RANKS[0];

  const thirstyCount = useMemo(
    () => activeGardenList.filter((g) => isWordThirsty(g)).length,
    [activeGardenList]
  );

  type BucketStat = {
    totalAll: number;
    activeTotal: number;
    mastered: number;
    learning: number;
    unseen: number;
    due: number;
    composted: number;
    masteredPct: number;
    learningPct: number;
  };

  const makeEmptyStat = (): BucketStat => ({
    totalAll: 0,
    activeTotal: 0,
    mastered: 0,
    learning: 0,
    unseen: 0,
    due: 0,
    composted: 0,
    masteredPct: 0,
    learningPct: 0,
  });

  const deckStats = useMemo(() => {
    const gardenMap = new Map<string, GardenEntry>();
    gardenList.forEach((g) => gardenMap.set(g.word.toLowerCase(), g));

    const stats: Record<DifficultyTier, BucketStat> = {
      garden: makeEmptyStat(),
      meadow: makeEmptyStat(),
      conservatory: makeEmptyStat(),
    };

    lexiconWords.forEach((w) => {
      if (seedSproutTopicFilter !== 'all' && getWordTopic(w) !== seedSproutTopicFilter) {
        return;
      }
      const diff = getWordDifficulty(w);
      const bucket = stats[diff];
      if (!bucket) return;
      bucket.totalAll += 1;
      const entry = gardenMap.get(w.word.toLowerCase());
      if (entry?.isComposted) {
        bucket.composted += 1;
      } else {
        bucket.activeTotal += 1;
        if (entry) {
          if (isWordMastered(entry)) bucket.mastered += 1;
          else if (isWordLearning(entry)) bucket.learning += 1;
          if (isWordThirsty(entry)) bucket.due += 1;
        } else {
          bucket.unseen += 1;
        }
      }
    });

    (Object.keys(stats) as DifficultyTier[]).forEach((type) => {
      const b = stats[type];
      if (b.activeTotal > 0) {
        b.masteredPct = Math.round((b.mastered / b.activeTotal) * 100);
        b.learningPct = Math.round((b.learning / b.activeTotal) * 100);
      }
    });

    return stats;
  }, [gardenList, seedSproutTopicFilter]);

  const topicStats = useMemo(() => {
    const gardenMap = new Map<string, GardenEntry>();
    gardenList.forEach((g) => gardenMap.set(g.word.toLowerCase(), g));

    const stats: Record<TopicCategory | 'all', BucketStat> = {
      all: makeEmptyStat(),
      emotions: makeEmptyStat(),
      philosophy: makeEmptyStat(),
      biology: makeEmptyStat(),
      architecture: makeEmptyStat(),
      statecraft: makeEmptyStat(),
      literature: makeEmptyStat(),
      general: makeEmptyStat(),
    };

    const addTo = (bucket: BucketStat, w: Word) => {
      bucket.totalAll += 1;
      const entry = gardenMap.get(w.word.toLowerCase());
      if (entry?.isComposted) {
        bucket.composted += 1;
      } else {
        bucket.activeTotal += 1;
        if (entry) {
          if (isWordMastered(entry)) bucket.mastered += 1;
          else if (isWordLearning(entry)) bucket.learning += 1;
          if (isWordThirsty(entry)) bucket.due += 1;
        } else {
          bucket.unseen += 1;
        }
      }
    };

    lexiconWords.forEach((w) => {
      const topic = getWordTopic(w);
      addTo(stats.all, w);
      addTo(stats[topic], w);
    });

    (Object.keys(stats) as (TopicCategory | 'all')[]).forEach((key) => {
      const b = stats[key];
      if (b.activeTotal > 0) {
        b.masteredPct = Math.round((b.mastered / b.activeTotal) * 100);
        b.learningPct = Math.round((b.learning / b.activeTotal) * 100);
      }
    });

    return stats;
  }, [gardenList, lexiconWords]);

  const maskWordInExample = (example: string, word: string) => {
    if (!example || !word) return '';
    const stem =
      word.length > 3 ? word.toLowerCase().replace(/[ey]$/i, '') : word.toLowerCase();
    const regex = new RegExp(`\\b${stem}[a-z]*\\b`, 'gi');

    return example.replace(regex, (match) => {
      const maskLen = Math.min(match.length, word.length);
      const suffix = match.slice(maskLen);
      return '•'.repeat(maskLen) + suffix;
    });
  };

  // Keep focus on an unrevealed tile in Seed Sprout
  useEffect(() => {
    if (selectedMode !== 'seed-sprout' || !currentWord || isRoundOver) return;
    if (revealedIndices.has(focusedIndex)) {
      const next =
        findNextUnrevealedIndex(currentWord.word.length, revealedIndices, focusedIndex) ??
        findNextUnrevealedIndex(currentWord.word.length, revealedIndices, -1);
      if (next !== null) setFocusedIndex(next);
    }
  }, [revealedIndices, focusedIndex, currentWord, isRoundOver, selectedMode]);

  useEffect(() => {
    if (selectedMode === 'seed-sprout' && !isRoundOver && currentWord && !showWelcome) {
      const input = document.getElementById(`box-${focusedIndex}`) as HTMLInputElement;
      input?.focus();
    }
  }, [focusedIndex, isRoundOver, currentWord, selectedMode, showWelcome]);

  // Scored Mode 30-second decay timer for Seed Sprout (pauses when any modal/overlay is open)
  const isAnyOverlayOpen =
    showGarden ||
    showMenu ||
    showTutorial ||
    showFeedback ||
    showRoundResult ||
    Boolean(selectedGardenWord) ||
    confirmModal.show;

  useEffect(() => {
    if (
      !isScoredMode ||
      selectedMode !== 'seed-sprout' ||
      isRoundOver ||
      showWelcome ||
      isAnyOverlayOpen ||
      !currentWord
    ) {
      return;
    }
    const startedAt = Date.now() - wordElapsedSec * 1000;
    const id = setInterval(() => {
      const elapsed = Math.min(DECAY_WINDOW_SECONDS, (Date.now() - startedAt) / 1000);
      setWordElapsedSec(elapsed);
    }, 200);
    return () => clearInterval(id);
  }, [
    isScoredMode,
    selectedMode,
    isRoundOver,
    showWelcome,
    isAnyOverlayOpen,
    currentWord,
    currentWordIndex,
  ]);

  const recordWordOutcome = useCallback(
    (
      wordObj: Word,
      outcome: RecallOutcome,
      mode: GameMode,
      userSentence?: string
    ): RoundEntryResult => {
      const existing = gardenList.find(
        (g) => g.word.toLowerCase() === wordObj.word.toLowerCase()
      );
      let updatedEntry: GardenEntry;
      let isNewWord = false;
      const previousStage = existing?.growthStage;

      if (!existing) {
        isNewWord = true;
        updatedEntry = createGardenEntry(wordObj, outcome, mode);
      } else if (outcome === 'composted') {
        updatedEntry = {
          ...existing,
          isComposted: true,
          compostedAt: new Date().toISOString(),
        };
      } else {
        const revived = existing.isComposted ? { ...existing, isComposted: false } : existing;
        updatedEntry = applySpacedRepetition(revived, outcomeToQuality(outcome), mode);
      }

      if (outcome !== 'composted' && userSentence && userSentence.trim()) {
        updatedEntry = {
          ...updatedEntry,
          userSentence: userSentence.trim(),
        };
      }

      if (outcome !== 'composted') {
        touchDailyPractice();
      }

      setPlayedWords((prev) =>
        prev.includes(wordObj.word) ? prev : [...prev, wordObj.word]
      );

      setGardenList((prev) => {
        const idx = prev.findIndex(
          (g) => g.word.toLowerCase() === wordObj.word.toLowerCase()
        );
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = updatedEntry;
          return clone;
        }
        return [...prev, updatedEntry];
      });

      setSelectedGardenWord((prev) =>
        prev && prev.word.toLowerCase() === updatedEntry.word.toLowerCase()
          ? updatedEntry
          : prev
      );

      pushEntryToSupabase(updatedEntry);

      return {
        word: wordObj.word,
        outcome,
        isNewWord,
        previousStage,
        nextStage: updatedEntry.growthStage,
      };
    },
    [gardenList, pushEntryToSupabase, touchDailyPractice]
  );

  const compostWord = useCallback(
    (wordObj: Word) => {
      recordWordOutcome(wordObj, 'composted', selectedMode);
    },
    [recordWordOutcome, selectedMode]
  );

  const toggleFavoriteWord = useCallback(
    (wordObj: Word) => {
      const targetKey = wordObj.word.toLowerCase();
      const existing = gardenList.find((g) => g.word.toLowerCase() === targetKey);
      let nextEntry: GardenEntry;
      if (existing) {
        const nextFav = !existing.isFavorite;
        nextEntry = {
          ...existing,
          isFavorite: nextFav,
          favoritedAt: nextFav ? new Date().toISOString() : undefined,
        };
      } else {
        const created = createGardenEntry(wordObj, 'clean', selectedMode);
        nextEntry = {
          ...created,
          isFavorite: true,
          favoritedAt: new Date().toISOString(),
        };
      }

      setGardenList((prev) => {
        const idx = prev.findIndex((g) => g.word.toLowerCase() === targetKey);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = nextEntry;
          return clone;
        }
        return [...prev, nextEntry];
      });

      setSelectedGardenWord((prev) =>
        prev && prev.word.toLowerCase() === targetKey ? nextEntry : prev
      );

      pushEntryToSupabase(nextEntry);
    },
    [gardenList, pushEntryToSupabase, selectedMode]
  );

  const restoreFromCompost = useCallback(
    (wordName: string) => {
      const existing = gardenList.find(
        (g) => g.word.toLowerCase() === wordName.toLowerCase()
      );
      if (!existing) return;

      const restored: GardenEntry = {
        ...existing,
        isComposted: false,
        compostedAt: undefined,
        nextReviewDate:
          existing.nextReviewDate || new Date(Date.now() + 86400000).toISOString(),
      };

      setGardenList((prev) =>
        prev.map((item) =>
          item.word.toLowerCase() === wordName.toLowerCase() ? restored : item
        )
      );
      setSelectedGardenWord((prev) =>
        prev && prev.word.toLowerCase() === wordName.toLowerCase() ? restored : prev
      );
      pushEntryToSupabase(restored);
    },
    [gardenList, pushEntryToSupabase]
  );

  const resetWordState = (word: Word) => {
    const initialRevealed = getInitialRevealedIndices(word.word);
    const firstOpen = findNextUnrevealedIndex(word.word.length, initialRevealed, -1) ?? 0;

    setGuess(Array(word.word.length).fill(''));
    setRevealedIndices(initialRevealed);
    setHintUnlocked(false);
    setLetterBankActive(false);
    setUsedAssistedHint(false);
    setWrongGuesses(0);
    setIsRoundOver(false);
    setWordOutcome(null);
    setMessage('');
    setAnimation(null);
    setFocusedIndex(firstOpen);
    setWordElapsedSec(0);
    setWordPenaltyPts(0);
    setLetterTilesPenalized(false);
    setLastWordPts(null);
  };

  const initSeedBank = (
    difficulty: DifficultyTier | 'all',
    overrideMode?: GameMode,
    topicOverride?: TopicCategory | 'all'
  ) => {
    setRoundScore(0);
    setRoundCleanStreak(0);
    setIsNewBestRound(false);
    setIsPlantWateringRound(false);
    const activeMode = overrideMode || selectedMode;
    const effectiveTopic =
      topicOverride !== undefined
        ? topicOverride
        : activeMode === 'field-notes'
        ? fieldNotesTopicFilter
        : activeMode === 'own-words'
        ? ownWordsTopicFilter
        : seedSproutTopicFilter;

    if (overrideMode) setSelectedMode(overrideMode);
    setSelectedSeed(difficulty);
    setActiveTopicFilter(effectiveTopic);
    setDeckNotice(null);

    if (activeMode === 'field-notes' && isScoredMode) {
      const scoredPool = activeLexiconWords.filter((w) => {
        if (difficulty !== 'all' && getWordDifficulty(w) !== difficulty) return false;
        if (effectiveTopic !== 'all' && getWordTopic(w) !== effectiveTopic) return false;
        return true;
      });
      if (scoredPool.length === 0) {
        const diffLabel =
          difficulty === 'all' ? 'All Difficulties' : getDifficultyMeta(difficulty).label;
        const topicLabel =
          effectiveTopic === 'all' ? 'All Topics' : getTopicMeta(effectiveTopic).label;
        setDeckNotice(
          `No words match "${diffLabel} · ${topicLabel}" yet. Try selecting All Topics or All Difficulties.`
        );
        setShowWelcome(true);
        return;
      }

      const shuffled = [...scoredPool].sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, Math.min(WORDS_PER_ROUND, shuffled.length));
      setRemainingWords(chosen);
      setCurrentWordIndex(0);
      setRoundResults([]);
      setShowWelcome(false);
      return;
    }

    if (activeMode === 'field-notes' || activeMode === 'own-words') {
      const modeName = activeMode === 'own-words' ? 'In Your Own Words' : 'Field Notes';
      if (activeGardenList.length === 0) {
        setDeckNotice(
          `Discover words in Seed Sprout first! ${modeName} reuses the words you have already discovered in your Garden.`
        );
        setShowWelcome(true);
        return;
      }

      const discoveredInFilter = activeGardenList.filter((g) => {
        if (difficulty !== 'all' && getWordDifficulty(g) !== difficulty) return false;
        if (effectiveTopic !== 'all' && getWordTopic(g) !== effectiveTopic) return false;
        return true;
      });
      if (discoveredInFilter.length === 0) {
        const diffLabel =
          difficulty === 'all' ? 'All Difficulties' : getDifficultyMeta(difficulty).label;
        const topicLabel =
          effectiveTopic === 'all' ? 'All Topics' : getTopicMeta(effectiveTopic).label;
        setDeckNotice(
          `No discovered words match "${diffLabel} · ${topicLabel}" yet. Discover words there in Seed Sprout first, or reset filters to play all ${activeGardenList.length} discovered words!`
        );
        setShowWelcome(true);
        return;
      }

      const sortedDiscovered = [...discoveredInFilter].sort((a, b) => {
        if (activeMode === 'own-words') {
          const ownA = a.modesMastered?.includes('own-words') ? 1 : 0;
          const ownB = b.modesMastered?.includes('own-words') ? 1 : 0;
          if (ownA !== ownB) return ownA - ownB;
        }
        const scoreA = isWordMastered(a) ? 2 : isWordThirsty(a) ? 0 : 1;
        const scoreB = isWordMastered(b) ? 2 : isWordThirsty(b) ? 0 : 1;
        if (scoreA !== scoreB) return scoreA - scoreB;
        return Math.random() - 0.5;
      });

      const roundSize = Math.min(WORDS_PER_ROUND, sortedDiscovered.length);
      const chosen = sortedDiscovered.slice(0, roundSize);

      setRemainingWords(chosen);
      setCurrentWordIndex(0);
      setRoundResults([]);
      setShowWelcome(false);
      return;
    }

    const compostedSet = new Set(
      gardenList.filter((g) => g.isComposted).map((g) => g.word.toLowerCase())
    );
    const allInFilter = lexiconWords.filter((w) => {
      if (difficulty !== 'all' && getWordDifficulty(w) !== difficulty) return false;
      if (effectiveTopic !== 'all' && getWordTopic(w) !== effectiveTopic) return false;
      return true;
    });
    const activeInFilter = allInFilter.filter(
      (w) => !compostedSet.has(w.word.toLowerCase())
    );

    if (activeInFilter.length === 0) {
      setDeckNotice(
        allInFilter.length === 0
          ? 'No words match that Difficulty + Topic combination yet. Try selecting All Topics or All Difficulties.'
          : 'All words in this selection are currently in Compost. Open Garden → My Words → Compost to restore any words.'
      );
      setShowWelcome(true);
      return;
    }

    // Seed Sprout is the singular way to discover new words: prioritize undiscovered words in this selection
    const gardenMap = new Map(gardenList.map((g) => [g.word.toLowerCase(), g]));
    const undiscoveredInFilter = activeInFilter.filter(
      (w) => !gardenMap.has(w.word.toLowerCase())
    );

    let chosen: Word[] = [];
    if (undiscoveredInFilter.length > 0) {
      const shuffledNew = [...undiscoveredInFilter].sort(() => Math.random() - 0.5);
      chosen = shuffledNew.slice(0, Math.min(WORDS_PER_ROUND, shuffledNew.length));
    } else {
      // Every non-composted word in this selection has already been discovered
      const sortedActive = [...activeInFilter].sort((a, b) => {
        const ga = gardenMap.get(a.word.toLowerCase());
        const gb = gardenMap.get(b.word.toLowerCase());
        const scoreA = ga && isWordMastered(ga) ? 2 : ga && isWordThirsty(ga) ? 0 : 1;
        const scoreB = gb && isWordMastered(gb) ? 2 : gb && isWordThirsty(gb) ? 0 : 1;
        if (scoreA !== scoreB) return scoreA - scoreB;
        return Math.random() - 0.5;
      });
      chosen = sortedActive.slice(0, Math.min(WORDS_PER_ROUND, sortedActive.length));
    }

    setRemainingWords(chosen);
    setCurrentWordIndex(0);
    setRoundResults([]);
    if (chosen[0]) {
      resetWordState(chosen[0]);
    }
    setShowWelcome(false);
  };

  const launchDiscoveredRound = (targetMode: 'field-notes' | 'own-words') => {
    const diffCheck = selectedSeed || 'all';
    const pool =
      targetMode === 'field-notes' && isScoredMode ? activeLexiconWords : activeGardenList;
    const hasMatchInCurrent = pool.some(
      (g) =>
        (diffCheck === 'all' || getWordDifficulty(g) === diffCheck) &&
        (activeTopicFilter === 'all' || getWordTopic(g) === activeTopicFilter)
    );
    if (hasMatchInCurrent) {
      initSeedBank(diffCheck, targetMode, activeTopicFilter);
    } else {
      initSeedBank('all', targetMode, 'all');
    }
  };

  const handleHeaderModeSwitch = (modeId: GameMode) => {
    if (modeId === 'field-notes' || modeId === 'own-words') {
      launchDiscoveredRound(modeId);
      return;
    }
    initSeedBank(selectedSeed || 'garden', modeId, activeTopicFilter);
  };

  const launchIntroSeedSproutRound = () => {
    const introWords = ['enigma', 'volatile', 'nuance']
      .map((term) => lexiconWords.find((w) => w.word.toLowerCase() === term))
      .filter((w): w is Word => Boolean(w));
    if (introWords.length === 0) {
      initSeedBank('garden', 'seed-sprout', 'all');
      return;
    }

    setRoundScore(0);
    setRoundCleanStreak(0);
    setIsNewBestRound(false);
    setShowRoundResult(false);
    setSelectedMode('seed-sprout');
    setSelectedSeed('garden');
    setSeedSproutTopicFilter('all');
    setActiveTopicFilter('all');
    setDeckNotice(null);
    setRemainingWords(introWords);
    setCurrentWordIndex(0);
    setRoundResults([]);
    resetWordState(introWords[0]);
    setShowWelcome(false);
  };

  const dismissTutorial = () => {
    setShowTutorial(false);
    try {
      localStorage.setItem('growcabulary_tutorial_seen', 'true');
    } catch {
      // Ignore storage errors
    }
  };

  const handleTutorialSkipOrExit = () => {
    const isNewUser = gardenList.length === 0;
    dismissTutorial();
    if (isNewUser) {
      launchIntroSeedSproutRound();
    }
  };

  const handleStartFromTutorial = () => {
    const isNewUser = gardenList.length === 0;
    dismissTutorial();
    if (isNewUser) {
      launchIntroSeedSproutRound();
    } else {
      initSeedBank('garden', 'seed-sprout', 'all');
    }
  };

  const openConservatoryGrid = () => {
    setConservatoryInitialMode('grid');
    setShowGarden(true);
  };

  const launchWateringSession = () => {
    setConservatoryInitialMode('flashcards');
    setShowGarden(true);
  };

  const launchGardenWateringRound = (
    entries: GardenEntry[],
    mode: 'field-notes' | 'own-words' | 'seed-sprout'
  ) => {
    if (entries.length === 0) return;
    const shuffled = [...entries].sort(() => Math.random() - 0.5);
    const chosen = shuffled
      .slice(0, Math.min(WORDS_PER_ROUND, shuffled.length))
      .map(
        (entry) =>
          lexiconWords.find((w) => w.word.toLowerCase() === entry.word.toLowerCase()) || entry
      );
    if (chosen.length === 0) return;

    setRoundScore(0);
    setRoundCleanStreak(0);
    setIsNewBestRound(false);
    setShowRoundResult(false);
    setIsPlantWateringRound(true);
    setSelectedMode(mode);
    setSelectedSeed('all');
    setActiveTopicFilter('all');
    setDeckNotice(null);
    setRemainingWords(chosen);
    setCurrentWordIndex(0);
    setRoundResults([]);
    resetWordState(chosen[0]);
    setShowGarden(false);
    setShowWelcome(false);
  };

  const commitSeedSproutOutcome = (outcome: RecallOutcome) => {
    if (!currentWord) return;
    const baseResult = recordWordOutcome(currentWord, outcome, 'seed-sprout');
    let earned: number | undefined;
    if (isScoredMode) {
      const solved = outcome === 'clean' || outcome === 'assisted';
      earned = computeWordPoints({
        elapsedSeconds: wordElapsedSec,
        penaltyPoints: wordPenaltyPts,
        wordOrSeed: currentWord,
        cleanStreak: roundCleanStreak,
        solved,
      });
      setLastWordPts(earned);
      setRoundScore((prev) => prev + (earned || 0));
      setRoundCleanStreak((prev) =>
        outcome === 'clean' ? prev + 1 : outcome === 'composted' ? prev : 0
      );
    }
    const result: RoundEntryResult =
      earned !== undefined ? { ...baseResult, points: earned } : baseResult;

    setRoundResults((prev) => {
      const idx = prev.findIndex(
        (r) => r.word.toLowerCase() === currentWord.word.toLowerCase()
      );
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = result;
        return clone;
      }
      return [...prev, result];
    });
    setWordOutcome(outcome);
    setIsRoundOver(true);
  };

  const revealAllSeedSproutIndices = () => {
    if (!currentWord) return;
    const allIdx = new Set<number>();
    for (let i = 0; i < currentWord.word.length; i++) allIdx.add(i);
    setRevealedIndices(allIdx);
  };

  const handleSeedSproutRevealIndices = (
    indices: number[],
    kind: 'letter' | 'first-last'
  ) => {
    if (!currentWord || isRoundOver) return;
    setUsedAssistedHint(true);
    setWordPenaltyPts((prev) => prev + LETTER_HINT_PENALTY);
    const nextSet = new Set(revealedIndices);

    if (kind === 'letter') {
      const idx = getNextLetterToReveal(currentWord.word, nextSet);
      if (idx === null) return;
      nextSet.add(idx);
    } else {
      indices.forEach((idx) => nextSet.add(idx));
    }

    setRevealedIndices(nextSet);

    if (nextSet.size >= currentWord.word.length) {
      setAnimation('failure');
      commitSeedSproutOutcome('missed');
      setMessage(
        `The word was "${currentWord.word}". Added to your Garden review queue.`
      );
    } else {
      setAnimation(null);
      setMessage(
        kind === 'first-last'
          ? 'Revealed the first and last letters.'
          : 'Revealed a letter to help you.'
      );
    }
  };

  const handleGiveUpWord = () => {
    if (isRoundOver || !currentWord) return;
    revealAllSeedSproutIndices();
    setAnimation('failure');
    commitSeedSproutOutcome('missed');
    setMessage(
      `Word revealed: "${currentWord.word}". Queued for spaced-repetition flashcards.`
    );
  };

  const handleCompostCurrentWord = () => {
    if (!currentWord) return;
    revealAllSeedSproutIndices();
    setAnimation(null);
    commitSeedSproutOutcome('composted');
    setMessage(
      `Moved "${currentWord.word}" to Compost — excluded from future rounds and flashcards.`
    );
  };

  const handleSuccess = () => {
    if (!currentWord) return;
    const outcome: RecallOutcome =
      wrongGuesses === 0 && !usedAssistedHint ? 'clean' : 'assisted';
    setAnimation('success');
    commitSeedSproutOutcome(outcome);
    setMessage(
      outcome === 'clean'
        ? 'Solved cleanly! Saved to your Garden 🌿'
        : 'Solved! Saved to your Garden for continued review 🌱'
    );
  };

  const checkAnswer = () => {
    if (isRoundOver || !currentWord) return;
    const { isComplete, isCorrect } = evaluateWordGuess(
      currentWord.word,
      guess,
      revealedIndices
    );

    if (!isComplete) {
      setAnimation('wrong');
      setMessage('Fill in all letter tiles before checking.');
      setTimeout(() => setAnimation(null), 500);
      return;
    }

    if (isCorrect) {
      handleSuccess();
    } else {
      setWrongGuesses((prev) => prev + 1);
      setWordPenaltyPts((prev) => prev + LETTER_HINT_PENALTY);
      setMessage('Not quite — try Letter Tiles, First & Last, or another hint below.');
      setAnimation('wrong');
      setTimeout(() => setAnimation(null), 500);
    }
  };

  const finishRoundWithResults = (results: RoundEntryResult[]) => {
    setRoundResults(results);
    if (isScoredMode && (selectedMode === 'seed-sprout' || selectedMode === 'field-notes')) {
      const totalPts = results.reduce((sum, r) => sum + (r.points || 0), 0);
      setRoundScore(totalPts);
      const scoreKey = `${selectedMode}::${selectedSeed || 'all'}`;
      const { isNewBest } = saveRoundHighScore(scoreKey, totalPts);
      setIsNewBestRound(isNewBest);

      const roundRecord: ScoredRoundRecord = {
        id:
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : '00000000-0000-4000-8000-' + Date.now().toString().padStart(12, '0').slice(-12),
        game_mode: selectedMode,
        difficulty: selectedSeed || 'all',
        topic: activeTopicFilter || 'all',
        score: totalPts,
        words_count: results.length,
        clean_count: results.filter((r) => r.outcome === 'clean').length,
        assisted_count: results.filter((r) => r.outcome === 'assisted').length,
        missed_count: results.filter((r) => r.outcome === 'missed').length,
        created_at: new Date().toISOString(),
      };
      saveScoredRoundLocal(roundRecord);
      pushScoredRoundToSupabase(roundRecord);
    } else {
      setIsNewBestRound(false);
    }
    setShowRoundResult(true);
  };

  const nextWord = () => {
    if (!selectedSeed) return;
    if (currentWordIndex + 1 < remainingWords.length) {
      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      resetWordState(remainingWords[nextIdx]);
    } else {
      finishRoundWithResults(roundResults);
    }
  };

  const handleInput = (char: string, index: number) => {
    if (isRoundOver || !currentWord || revealedIndices.has(index)) return;
    const cleanChar = char.slice(-1).toLowerCase();
    if (cleanChar && !/^[a-z\u00C0-\u024Fœæ]$/i.test(cleanChar)) return;
    const newGuess = [...guess];
    newGuess[index] = cleanChar;
    setGuess(newGuess);
    setMessage('');
    setAnimation(null);
    if (cleanChar) {
      const next = findNextUnrevealedIndex(currentWord.word.length, revealedIndices, index);
      if (next !== null) setFocusedIndex(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      if (!guess[index]) {
        const prev = findPrevUnrevealedIndex(revealedIndices, index);
        if (prev !== null) setFocusedIndex(prev);
      } else {
        const newGuess = [...guess];
        newGuess[index] = '';
        setGuess(newGuess);
      }
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = findPrevUnrevealedIndex(revealedIndices, index);
      if (prev !== null) setFocusedIndex(prev);
      return;
    }
    if (e.key === 'ArrowRight' && currentWord) {
      e.preventDefault();
      const next = findNextUnrevealedIndex(currentWord.word.length, revealedIndices, index);
      if (next !== null) setFocusedIndex(next);
      return;
    }
    if (e.altKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      handleSeedSproutRevealIndices([], 'letter');
      return;
    }
    if (e.altKey && (e.key === 'e' || e.key === 'E') && !hintUnlocked) {
      e.preventDefault();
      setHintUnlocked(true);
      setWordPenaltyPts((prev) => prev + LETTER_HINT_PENALTY);
      return;
    }
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      setLetterBankActive((prev) => !prev);
      setUsedAssistedHint(true);
      if (!letterTilesPenalized) {
        setLetterTilesPenalized(true);
        setWordPenaltyPts((prev) => prev + LETTER_TILES_PENALTY);
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isRoundOver) {
        nextWord();
      } else {
        checkAnswer();
      }
    }
  };

  // Global keyboard shortcuts for Seed Sprout completion & Word Dossier Modal
  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';

      if (selectedGardenWord) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setSelectedGardenWord(null);
          return;
        }
        if (!inInput) {
          if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            speakWord(selectedGardenWord.word);
          } else if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            toggleFavoriteWord(selectedGardenWord);
          }
        }
        return;
      }

      if (
        !showWelcome &&
        !isAnyOverlayOpen &&
        selectedMode === 'seed-sprout' &&
        currentWord
      ) {
        if (e.altKey && !isRoundOver) {
          if (e.key === 'l' || e.key === 'L') {
            e.preventDefault();
            handleSeedSproutRevealIndices([], 'letter');
            return;
          }
          if ((e.key === 'e' || e.key === 'E') && !hintUnlocked) {
            e.preventDefault();
            setHintUnlocked(true);
            setWordPenaltyPts((prev) => prev + LETTER_HINT_PENALTY);
            return;
          }
          if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            setLetterBankActive((prev) => !prev);
            setUsedAssistedHint(true);
            if (!letterTilesPenalized) {
              setLetterTilesPenalized(true);
              setWordPenaltyPts((prev) => prev + LETTER_TILES_PENALTY);
            }
            return;
          }
        }

        if (!inInput) {
          if (isRoundOver && (e.key === 'Enter' || e.code === 'Space')) {
            e.preventDefault();
            nextWord();
          } else if (isRoundOver && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            speakWord(currentWord.word);
          } else if (isRoundOver && (e.key === 'f' || e.key === 'F')) {
            e.preventDefault();
            toggleFavoriteWord(currentWord);
          } else if (!isRoundOver && e.key === 'Enter') {
            e.preventDefault();
            checkAnswer();
          }
        }
      }
    };

    window.addEventListener('keydown', onGlobalKey);
    return () => window.removeEventListener('keydown', onGlobalKey);
  });

  const requestResetCategory = () => {
    if (!selectedSeed) return;
    const diffLabel =
      selectedSeed === 'all' ? 'All Difficulties' : getDifficultyMeta(selectedSeed).label;
    const topicLabel =
      activeTopicFilter === 'all' ? '' : ` · ${getTopicMeta(activeTopicFilter).label}`;
    setConfirmModal({
      show: true,
      title: 'Reset Deck Cycle? 🍄',
      message: `Shuffle all unseen and active words in "${diffLabel}${topicLabel}" from the start? Your learned words in the Garden remain safe.`,
      action: () => {
        const deckWords = new Set(
          lexiconWords
            .filter(
              (w) =>
                (selectedSeed === 'all' || getWordDifficulty(w) === selectedSeed) &&
                (activeTopicFilter === 'all' || getWordTopic(w) === activeTopicFilter)
            )
            .map((w) => w.word)
        );
        setPlayedWords((prev) => prev.filter((pw) => !deckWords.has(pw)));
        setShowMenu(false);
        setShowWelcome(true);
        setSelectedSeed(null);
        setRemainingWords([]);
        setConfirmModal((prev) => ({ ...prev, show: false }));
      },
    });
  };

  const requestResetAll = () => {
    setConfirmModal({
      show: true,
      title: 'Clear All Progress? 🌳',
      message:
        'This will permanently delete ALL local words, flashcards, composted entries, and streaks. The app will restart.',
      action: () => {
        localStorage.clear();
        window.location.reload();
      },
    });
  };

  const getBoxSize = (len: number) => {
    if (len >= 16) return 'w-4 h-7 sm:w-8 sm:h-12 text-xs sm:text-2xl';
    if (len >= 13) return 'w-5 h-8 sm:w-10 sm:h-16 text-sm sm:text-3xl';
    if (len >= 10) return 'w-7 h-10 sm:w-12 sm:h-18 text-base sm:text-4xl';
    return 'w-9 h-14 sm:w-16 sm:h-24 text-2xl sm:text-5xl';
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-1000 ${
        dailyStreak >= 7 ? 'bg-amber-50/80' : 'hybrid-bg'
      }`}
    >
      {showWelcome ? (
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 w-full overflow-y-auto">
          <div className="max-w-5xl w-full journal-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden my-auto">
            {/* Top Bar — Mobile Compact (< 640px): single rank pill + one Menu button */}
            <div className="flex sm:hidden items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E5ECE0]">
              <Link
                href="/ranks"
                className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transition-colors max-w-[65%] truncate"
                title="View all Botanical Ranks and your overall progression"
              >
                <span className="truncate">
                  {userRank.emoji} {userRank.title}
                </span>
                {dailyStreak > 0 && (
                  <span className="text-[10px] font-black text-amber-200 shrink-0">
                    · 🔥 {dailyStreak}d
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setShowMobileMainMenu(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-black shadow-sm transition-colors shrink-0"
                aria-label="Open main menu"
                aria-expanded={showMobileMainMenu}
              >
                <Menu className="w-4 h-4 text-emerald-800" />
                <span>Menu</span>
              </button>
            </div>

            {/* Top Bar — Desktop (>= 640px): Rank, Mastery & Cloud Account Link */}
            <div className="hidden sm:flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-[#E5ECE0]">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/ranks"
                  className="inline-flex items-center gap-2 group"
                  title="View all Botanical Ranks and your overall progression"
                >
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-700 group-hover:text-emerald-950 transition-colors">
                    Rank:
                  </span>
                  <span className="bg-emerald-800 group-hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm transition-colors">
                    {userRank.emoji} {userRank.title}
                  </span>
                </Link>
                {dailyStreak > 0 && (
                  <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs font-black px-2.5 py-0.5 rounded-full">
                    🔥 {dailyStreak}d Streak
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canAccessCurator(cloudUser?.email) && (
                  <Link
                    href="/curator"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
                    title="Accessible in local development mode or when signed in with NEXT_PUBLIC_ADMIN_EMAIL"
                  >
                    <span>🛠️ Curator Studio</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={openConservatoryGrid}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDF5EB] hover:bg-emerald-100 text-emerald-900 border border-[#C6DEC2] text-xs font-bold transition-colors"
                >
                  <Flower2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Garden ({activeGardenList.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMenu(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                  aria-label="Open Settings"
                >
                  <Settings className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Settings</span>
                </button>
                {cloudUser ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900 text-white text-xs font-bold shadow-sm">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{cloudUser.name}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        setCloudUser(null);
                      }}
                      className="ml-1 p-0.5 hover:text-red-300 transition-colors"
                      title="Sign out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Cloud Sync / Sign In</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Hero Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="serif text-3xl sm:text-5xl font-bold text-emerald-900 mb-2">
                🌿 Growcabulary
              </h1>
              <p className="serif text-xs sm:text-base text-emerald-800 italic px-4">
                Build your lexicon, master words in context, and explore word origins
              </p>
            </div>

            {deckNotice && (
              <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between gap-2">
                <span>{deckNotice}</span>
                <button
                  type="button"
                  onClick={() => setDeckNotice(null)}
                  className="text-amber-700 hover:text-amber-950 font-black px-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* PRIMARY FEATURE SECTION: SEED SPROUT (DISCOVER NEW WORDS) */}
            <div className="mb-7 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#F2F7EE] via-[#F7FAF4] to-[#EDF5EB] border-2 border-emerald-700/30 shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5 pb-4 border-b border-[#D5E3D0]">
                <div>
                  <h2 className="serif text-2xl sm:text-3xl font-bold text-emerald-950 flex items-center gap-2">
                    <span>🌱 Seed Sprout</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                    Discover and plant new words in your Garden by deducing them from their definition, origin, and example sentence.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-bold text-emerald-800 self-end">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" /> Mastered
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Learning
                  </span>
                </div>
              </div>

              {/* Topic Filter Bar (Filters Pasture / Meadow / Conservatory or Launches Entire Topic) */}
              {(() => {
                const selectedTopicMeta =
                  seedSproutTopicFilter === 'all' ? null : getTopicMeta(seedSproutTopicFilter);
                return (
                  <div className="mb-4 p-3 sm:p-3.5 rounded-2xl bg-[#FCF7EA] border border-[#E6D7B6] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                        <label
                          htmlFor="seed-sprout-topic-select"
                          className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-900 shrink-0 flex items-center gap-1.5"
                        >
                          <span>📚 Topic Filter:</span>
                        </label>
                        <select
                          id="seed-sprout-topic-select"
                          value={seedSproutTopicFilter}
                          onChange={(e) =>
                            setSeedSproutTopicFilter(e.target.value as TopicCategory | 'all')
                          }
                          className="w-full sm:w-auto max-w-full min-w-0 px-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#DFCCA4] text-xs sm:text-sm font-bold text-amber-950 focus:border-amber-600 outline-none truncate"
                        >
                          <option value="all">
                            All Topics ({topicStats.all.mastered}/{topicStats.all.activeTotal}{' '}
                            Mastered · {topicStats.all.unseen} New)
                          </option>
                          {TOPIC_CATEGORIES.map((tc) => {
                            const ts = topicStats[tc.type];
                            return (
                              <option key={tc.type} value={tc.type}>
                                {tc.emoji} {tc.label} ({ts.mastered}/{ts.activeTotal} Mastered ·{' '}
                                {ts.unseen} New)
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {selectedTopicMeta && (
                        <button
                          type="button"
                          onClick={() =>
                            initSeedBank('all', 'seed-sprout', seedSproutTopicFilter)
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all whitespace-nowrap shrink-0"
                        >
                          Play All {selectedTopicMeta.label} →
                        </button>
                      )}
                    </div>

                    {selectedTopicMeta && (
                      <p className="text-[11px] text-amber-800 leading-snug">
                        {selectedTopicMeta.description}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Core Difficulty Word Banks (Pasture, Meadow, Conservatory) */}
              <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-3">
                {WORD_BANKS.map((bank) => {
                  const s = deckStats[bank.type];
                  const isEmptyForTopic = s.activeTotal === 0;
                  return (
                    <button
                      key={bank.type}
                      type="button"
                      disabled={isEmptyForTopic}
                      onClick={() =>
                        initSeedBank(bank.type, 'seed-sprout', seedSproutTopicFilter)
                      }
                      className={`group flex flex-row sm:flex-col items-center p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all text-left sm:text-center relative shadow-sm ${
                        isEmptyForTopic
                          ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                          : 'bg-[#FFFDF8] border-[#CFE0C8] hover:border-emerald-700 hover:bg-[#F5FAF2] hover:shadow-md'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl mr-3 sm:mr-0 sm:mb-2.5 group-hover:scale-110 transition-transform">
                        {bank.emoji}
                      </span>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1 justify-start sm:justify-center">
                          <h3 className="serif font-bold text-emerald-950 text-base sm:text-lg">
                            {bank.label}
                          </h3>
                          <span className="text-[9px] sm:text-[10px] bg-[#D9EED8] text-emerald-900 px-1.5 py-0.5 rounded-full font-black">
                            {s.mastered}/{s.activeTotal} Mastered
                          </span>
                          {s.due > 0 && (
                            <span className="text-[9px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-full font-black">
                              {s.due} due
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-emerald-800 leading-tight mb-3 line-clamp-2">
                          {bank.description}
                        </p>

                        {/* Segmented Mastery Bar */}
                        <div className="w-full h-2 rounded-full bg-[#E3EAD9] overflow-hidden flex mb-2">
                          <div
                            className="h-full bg-emerald-700 transition-all"
                            style={{ width: `${s.masteredPct}%` }}
                          />
                          <div
                            className="h-full bg-amber-400 transition-all"
                            style={{ width: `${s.learningPct}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-emerald-800">
                          {isEmptyForTopic ? (
                            'No words in this topic yet'
                          ) : (
                            <>
                              {s.mastered} Mastered · {s.learning} Learning · {s.unseen} New
                              {s.composted > 0 ? ` · ${s.composted} 🍂` : ''}
                            </>
                          )}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Compact Zen / Scored Mode Toggle for Seed Sprout */}
              <div className="mt-4 pt-3.5 border-t border-[#D5E3D0] flex flex-wrap items-center justify-between gap-2.5">
                <div className="inline-flex items-center bg-[#FFFDF8] p-1 rounded-full border border-[#C6DEC2]">
                  <button
                    type="button"
                    onClick={() => setIsScoredMode(false)}
                    className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                      !isScoredMode
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'text-emerald-900 hover:bg-emerald-100/70'
                    }`}
                  >
                    🌿 Zen (Untimed)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsScoredMode(true)}
                    className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                      isScoredMode
                        ? 'bg-amber-700 text-white shadow-sm'
                        : 'text-emerald-900 hover:bg-amber-100/60'
                    }`}
                  >
                    🏆 Scored (30s)
                  </button>
                </div>
                <Link
                  href="/help#scored-mode"
                  className="text-[11px] font-bold text-emerald-900 hover:text-emerald-700 underline underline-offset-2"
                >
                  How scoring works →
                </Link>
              </div>
            </div>

            {/* SUBORDINATE SECTION: PRACTICE & REINFORCE YOUR DISCOVERED GARDEN WORDS */}
            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#F7F9F4] border border-[#DCE6D6]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-800">
                    Reinforce Your Garden Words ({activeGardenList.length} Discovered)
                  </h3>
                  <p className="text-[11px] text-emerald-700">
                    Secondary modes that reuse words you&apos;ve already discovered in Seed Sprout
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Subordinate Mode 1: Field Notes */}
                {(() => {
                  const fieldNotesSourcePool: Word[] = isScoredMode
                    ? activeLexiconWords
                    : activeGardenList;
                  return (
                    <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#DCE5D5] flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="serif font-bold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                            <span>✍️ Field Notes</span>
                          </h4>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {isScoredMode ? 'Full Lexicon' : 'Usage in Context'}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                          {isScoredMode
                            ? 'Read a real-life quote or example and choose the matching word from the full curated lexicon.'
                            : 'Read a real-life quote or field note example and choose which of your discovered words fits the blank.'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EBF0E6]">
                        <select
                          value={fieldNotesDeckFilter}
                          onChange={(e) =>
                            setFieldNotesDeckFilter(e.target.value as DifficultyTier | 'all')
                          }
                          aria-label="Filter Field Notes by difficulty"
                          className="flex-1 min-w-[125px] px-2.5 py-1.5 rounded-lg bg-[#FAF7EE] border border-[#DCE5D5] text-[11px] font-bold text-emerald-900 outline-none"
                        >
                          <option value="all">
                            All Difficulties ({fieldNotesSourcePool.length})
                          </option>
                          {WORD_BANKS.map((b) => {
                            const count = fieldNotesSourcePool.filter(
                              (g) =>
                                getWordDifficulty(g) === b.type &&
                                (fieldNotesTopicFilter === 'all' ||
                                  getWordTopic(g) === fieldNotesTopicFilter)
                            ).length;
                            if (count === 0) return null;
                            return (
                              <option key={b.type} value={b.type}>
                                {b.emoji} {b.label} ({count})
                              </option>
                            );
                          })}
                        </select>

                        <select
                          value={fieldNotesTopicFilter}
                          onChange={(e) =>
                            setFieldNotesTopicFilter(e.target.value as TopicCategory | 'all')
                          }
                          aria-label="Filter Field Notes by topic"
                          className="flex-1 min-w-[125px] px-2.5 py-1.5 rounded-lg bg-[#FAF7EE] border border-[#DCE5D5] text-[11px] font-bold text-emerald-900 outline-none"
                        >
                          <option value="all">All Topics ({fieldNotesSourcePool.length})</option>
                          {TOPIC_CATEGORIES.map((tc) => {
                            const count = fieldNotesSourcePool.filter(
                              (g) =>
                                getWordTopic(g) === tc.type &&
                                (fieldNotesDeckFilter === 'all' ||
                                  getWordDifficulty(g) === fieldNotesDeckFilter)
                            ).length;
                            if (count === 0) return null;
                            return (
                              <option key={tc.type} value={tc.type}>
                                {tc.emoji} {tc.label} ({count})
                              </option>
                            );
                          })}
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            initSeedBank(
                              fieldNotesDeckFilter,
                              'field-notes',
                              fieldNotesTopicFilter
                            )
                          }
                          className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                        >
                          Play Field Notes →
                        </button>
                      </div>

                      {/* Compact Zen / Scored Mode Toggle for Field Notes */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EBF0E6]">
                        <div className="inline-flex items-center bg-[#EDF5EB] p-0.5 rounded-full border border-[#C6DEC2]">
                          <button
                            type="button"
                            onClick={() => setIsScoredMode(false)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all ${
                              !isScoredMode
                                ? 'bg-emerald-800 text-white shadow-sm'
                                : 'text-emerald-900 hover:bg-emerald-100/70'
                            }`}
                          >
                            🌿 Zen
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsScoredMode(true)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all ${
                              isScoredMode
                                ? 'bg-amber-700 text-white shadow-sm'
                                : 'text-emerald-900 hover:bg-amber-100/60'
                            }`}
                          >
                            🏆 Scored
                          </button>
                        </div>
                        <Link
                          href="/help#scored-mode"
                          className="text-[10.5px] font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                        >
                          How scoring works →
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Subordinate Mode 2: In Your Own Words */}
                <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#DCE5D5] flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="serif font-bold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                        <span>🪶 In Your Own Words</span>
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                        Write Sentences
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Write a sentence using one of your discovered words and check your usage.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EBF0E6]">
                    <select
                      value={ownWordsDeckFilter}
                      onChange={(e) =>
                        setOwnWordsDeckFilter(e.target.value as DifficultyTier | 'all')
                      }
                      aria-label="Filter In Your Own Words by difficulty"
                      className="flex-1 min-w-[125px] px-2.5 py-1.5 rounded-lg bg-[#FAF7EE] border border-[#DCE5D5] text-[11px] font-bold text-emerald-900 outline-none"
                    >
                      <option value="all">
                        All Difficulties ({activeGardenList.length})
                      </option>
                      {WORD_BANKS.map((b) => {
                        const count = activeGardenList.filter(
                          (g) =>
                            getWordDifficulty(g) === b.type &&
                            (ownWordsTopicFilter === 'all' ||
                              getWordTopic(g) === ownWordsTopicFilter)
                        ).length;
                        if (count === 0) return null;
                        return (
                          <option key={b.type} value={b.type}>
                            {b.emoji} {b.label} ({count})
                          </option>
                        );
                      })}
                    </select>

                    <select
                      value={ownWordsTopicFilter}
                      onChange={(e) =>
                        setOwnWordsTopicFilter(e.target.value as TopicCategory | 'all')
                      }
                      aria-label="Filter In Your Own Words by topic"
                      className="flex-1 min-w-[125px] px-2.5 py-1.5 rounded-lg bg-[#FAF7EE] border border-[#DCE5D5] text-[11px] font-bold text-emerald-900 outline-none"
                    >
                      <option value="all">All Topics ({activeGardenList.length})</option>
                      {TOPIC_CATEGORIES.map((tc) => {
                        const count = activeGardenList.filter(
                          (g) =>
                            getWordTopic(g) === tc.type &&
                            (ownWordsDeckFilter === 'all' ||
                              getWordDifficulty(g) === ownWordsDeckFilter)
                        ).length;
                        if (count === 0) return null;
                        return (
                          <option key={tc.type} value={tc.type}>
                            {tc.emoji} {tc.label} ({count})
                          </option>
                        );
                      })}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        initSeedBank(
                          ownWordsDeckFilter,
                          'own-words',
                          ownWordsTopicFilter
                        )
                      }
                      className="px-4 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-900 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                    >
                      Play Own Words →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Garden CTA */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <button
                type="button"
                onClick={openConservatoryGrid}
                className="px-8 py-3.5 bg-emerald-800 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-colors shadow-lg flex items-center gap-2"
              >
                <span>
                  Open Garden ({activeGardenList.length}
                  {compostCount > 0 ? ` · ${compostCount} Compost` : ''})
                </span>{' '}
                🌸
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFeedback(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Send Feedback</span>
                </button>

                {SUPPORT_URL && (
                  <a
                    href={SUPPORT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
                  >
                    <Coffee className="w-3.5 h-3.5 text-amber-700" />
                    <span>Support the Developer</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Active Gameplay Header */}
          <header className="bg-[#FFFDF8]/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#D5E0D0] p-2 sm:p-4 shrink-0 shadow-sm">
            <div className="max-w-5xl mx-auto flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowWelcome(true);
                    setSelectedSeed(null);
                  }}
                  className="serif text-lg sm:text-2xl font-bold text-emerald-900 hover:text-emerald-700 transition-colors"
                >
                  🌿 Growcabulary
                </button>

                {/* Active Mode Switcher Pill */}
                <div className="hidden sm:flex items-center bg-[#F4F7F0] p-1 rounded-full border border-[#DCE5D5]">
                  {GAME_MODES_META.map((gm) => (
                    <button
                      key={gm.id}
                      type="button"
                      onClick={() => handleHeaderModeSwitch(gm.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                        selectedMode === gm.id
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'text-emerald-800 hover:bg-emerald-100/60'
                      }`}
                    >
                      {gm.emoji} {gm.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-sm font-medium">
                {dailyStreak > 0 && (
                  <div className="text-orange-700 bg-orange-50 px-2 sm:px-2.5 py-1 rounded-full border border-orange-200 font-black flex items-center gap-1">
                    🔥 {dailyStreak}d
                  </div>
                )}
                <div className="hidden sm:block text-emerald-900 bg-[#F4F7F0] px-3 py-1 rounded-full border border-[#DCE5D5] text-xs font-bold">
                  <span className="font-black">{dailyWordsToday}</span> today
                </div>
                <button
                  type="button"
                  onClick={openConservatoryGrid}
                  className="px-2.5 sm:px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full text-xs font-bold shadow-sm"
                >
                  Garden 🌸
                </button>
                <Link
                  href="/help"
                  className="p-2 text-emerald-800 hover:bg-[#F4F7F0] rounded-full transition-colors"
                  aria-label="Help & Instructions"
                  title="Help & Instructions"
                >
                  <HelpCircle className="w-5 h-5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowMenu(true)}
                  className="p-2 text-emerald-800 hover:bg-[#F4F7F0] rounded-full transition-colors"
                  aria-label="Open Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Active Mode Switcher (< 640px) */}
            <div className="max-w-5xl mx-auto flex sm:hidden items-center justify-between bg-[#F4F7F0] p-1 rounded-full border border-[#DCE5D5] mt-2">
              {GAME_MODES_META.map((gm) => (
                <button
                  key={gm.id}
                  type="button"
                  onClick={() => handleHeaderModeSwitch(gm.id)}
                  className={`flex-1 py-1 px-2 rounded-full text-[11px] font-black transition-all text-center truncate ${
                    selectedMode === gm.id
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-emerald-800 hover:bg-emerald-100/60'
                  }`}
                >
                  {gm.emoji} {gm.title}
                </button>
              ))}
            </div>
          </header>

          {/* Main Gameplay Body */}
          <main className="flex-1 max-w-4xl mx-auto w-full p-2 sm:p-6 flex flex-col gap-4">
            {selectedMode === 'own-words' ? (
              <InYourOwnWordsPlaceholder
                roundWords={remainingWords}
                discoveredPool={activeGardenList}
                isOverlayActive={isAnyOverlayOpen}
                onRecordOutcome={(wordObj, outcome, userSentence) =>
                  recordWordOutcome(wordObj, outcome, 'own-words', userSentence)
                }
                onCompleteRound={(results) => finishRoundWithResults(results)}
                onSwitchToSeedSprout={() =>
                  initSeedBank(selectedSeed || 'garden', 'seed-sprout', activeTopicFilter)
                }
              />
            ) : selectedMode === 'field-notes' ? (
              <BotanistFieldNotesGame
                roundWords={remainingWords}
                discoveredPool={isScoredMode ? activeLexiconWords : activeGardenList}
                fallbackPool={activeLexiconWords}
                isScoredMode={isScoredMode}
                isOverlayActive={isAnyOverlayOpen}
                onRecordOutcome={(wordObj, outcome) =>
                  recordWordOutcome(wordObj, outcome, 'field-notes')
                }
                onCompleteRound={(results) => finishRoundWithResults(results)}
                onSwitchToSeedSprout={() =>
                  initSeedBank(selectedSeed || 'garden', 'seed-sprout', activeTopicFilter)
                }
              />
            ) : currentWord ? (
              /* MODE 1: UNTIMED SEED SPROUT WITH MANUAL HINTS & COMPOST */
              <div className="w-full journal-card rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 relative overflow-hidden flex flex-col shrink-0">
                {isRoundOver && (
                  <BotanicalPlateSpecimen
                    word={currentWord.word}
                    variant="game-bg"
                    showCaption
                    className="order-last mt-3"
                  />
                )}

                <div
                  className="absolute top-0 left-0 h-1 bg-emerald-600 transition-all duration-500 z-10"
                  style={{
                    width: `${(currentWordIndex / Math.max(1, remainingWords.length)) * 100}%`,
                  }}
                />

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-[#DCE5D5]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-[#EDF5EB] px-3 py-1 rounded-full border border-[#C6DEC2]">
                    🌱 Seed Sprout • Word {currentWordIndex + 1} of {remainingWords.length}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const diffMeta = getDifficultyMeta(currentWord);
                      const topicMeta = getTopicMeta(currentWord);
                      return (
                        <>
                          <span
                            className={`specimen-stamp text-[10px] px-2.5 py-0.5 ${diffMeta.badgeClass}`}
                          >
                            {diffMeta.emoji} {diffMeta.label}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${topicMeta.badgeClass}`}
                          >
                            {topicMeta.emoji} {topicMeta.label}
                          </span>
                        </>
                      );
                    })()}
                    <select
                      value={activeTopicFilter}
                      onChange={(e) => {
                        const nextTopic = e.target.value as TopicCategory | 'all';
                        setSeedSproutTopicFilter(nextTopic);
                        initSeedBank(selectedSeed || 'all', 'seed-sprout', nextTopic);
                      }}
                      aria-label="Filter Seed Sprout round by topic"
                      className="px-2 py-0.5 rounded-full bg-[#FAF7EE] border border-[#DCE5D5] text-[10px] font-bold text-emerald-900 outline-none cursor-pointer"
                      title="Switch Topic Filter for Seed Sprout"
                    >
                      <option value="all">Topic: All</option>
                      {TOPIC_CATEGORIES.map((tc) => (
                        <option key={tc.type} value={tc.type}>
                          {tc.emoji} {tc.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      {currentWord.word.length} Letters
                    </span>
                  </div>
                </div>

                {isScoredMode && (() => {
                  const meterPct = Math.max(
                    0,
                    Math.min(100, computeTimeScore(wordElapsedSec) - wordPenaltyPts)
                  );
                  const meterBarColor =
                    meterPct > 55
                      ? 'bg-emerald-600'
                      : meterPct > 25
                      ? 'bg-amber-500'
                      : 'bg-rose-500';
                  return (
                    <div className="mb-5 p-2.5 px-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 font-bold text-amber-950">
                          <span>🏆 Round: {roundScore} pts</span>
                          {isRoundOver && lastWordPts !== null && (
                            <span className="px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[11px] tabular-nums">
                              +{lastWordPts} pts earned
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-amber-900 tabular-nums">
                          <span>{getDifficultyScoreMultiplier(currentWord)}× tier</span>
                          <span>·</span>
                          <span>{getStreakMultiplier(roundCleanStreak)}× streak</span>
                        </div>
                      </div>
                      <div
                        className="w-full h-2 rounded-full bg-amber-200/70 overflow-hidden"
                        aria-label="Word score meter"
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-200 ${meterBarColor}`}
                          style={{ width: `${isRoundOver ? 0 : meterPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Individual Letter Tiles */}
                <div className="relative z-10 flex flex-wrap justify-center items-center gap-1 sm:gap-2 mb-7">
                  {currentWord.word.split('').map((char, i) => {
                    if (isSeparatorChar(char)) {
                      return (
                        <span
                          key={i}
                          className="serif font-black text-emerald-700 text-xl sm:text-3xl px-0.5 sm:px-1 select-none"
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      );
                    }
                    const isRevealed = revealedIndices.has(i);
                    return (
                      <input
                        key={i}
                        id={`box-${i}`}
                        type="text"
                        maxLength={1}
                        value={isRevealed ? char : guess[i] || ''}
                        disabled={isRevealed || isRoundOver}
                        onFocus={() => setFocusedIndex(i)}
                        onChange={(e) => handleInput(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className={`${getBoxSize(
                          currentWord.word.length
                        )} serif border-2 rounded-lg sm:rounded-xl text-center font-black uppercase transition-all duration-300 focus:ring-4 focus:ring-emerald-500/20 outline-none
                          ${
                            isRevealed
                              ? isRoundOver
                                ? 'bg-[#E2EFE0]/65 border-[#86BA8B] text-emerald-900 shadow-sm'
                                : 'bg-[#E2EFE0] border-[#86BA8B] text-emerald-900 shadow-sm'
                              : 'bg-[#FAF7EE] border-[#C8D8C2] text-emerald-900 focus:border-emerald-600 focus:bg-[#FFFDF8]'
                          }
                          ${
                            animation === 'wrong' && !isRevealed && guess[i]
                              ? 'animate-shake border-red-500'
                              : ''
                          }`}
                      />
                    );
                  })}
                </div>

                <div className="relative z-10 space-y-5">
                  <div
                    className={`p-4 sm:p-6 rounded-2xl border transition-colors duration-500 ${
                      isRoundOver
                        ? 'bg-[#FFFDF8]/45 border-[#DCE5D5]/80'
                        : 'journal-subcard'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="bg-emerald-800 text-white text-[9px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tighter">
                        {currentWord.form}
                      </span>
                      <span className="text-[10px] sm:text-xs font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                        {currentWord.origin} {ORIGIN_EMOJI_MAP[currentWord.origin] || '🍄'}
                      </span>
                    </div>
                    <h2 className="serif text-base sm:text-xl font-bold text-emerald-950 leading-snug mb-4">
                      {currentWord.definition}
                    </h2>
                    {currentWord.definition2 && (
                      <p className="serif text-xs sm:text-sm text-emerald-900/85 mb-4 border-l-2 border-emerald-500 pl-3 italic">
                        {currentWord.definition2}
                      </p>
                    )}
                    <div
                      className={`p-3.5 rounded-xl transition-colors duration-500 ${
                        isRoundOver
                          ? 'bg-[#F7F3E8]/42 border border-[#E6DEC8]/80 border-l-[3px] border-l-[#16a34a]'
                          : 'field-quote'
                      }`}
                    >
                      <p className="text-[10px] sm:text-xs font-black text-emerald-700 uppercase tracking-wider mb-1">
                        Example usage
                      </p>
                      <p className="serif text-xs sm:text-base text-emerald-950 italic leading-relaxed">
                        &ldquo;
                        {isRoundOver
                          ? currentWord.example
                          : maskWordInExample(currentWord.example, currentWord.word)}
                        &rdquo;
                      </p>
                    </div>

                    {isRoundOver && (
                      <div className="mt-4 pt-4 border-t border-[#D8E2D2] space-y-3 animate-fade-in">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="serif text-lg sm:text-xl font-black text-emerald-950">
                              {currentWord.word}
                            </span>
                            <SpeakWordButton
                              word={currentWord.word}
                              size="sm"
                              showLabel
                            />
                            {wordOutcome !== 'composted' && (() => {
                              const currentGardenEntry = gardenList.find(
                                (g) =>
                                  g.word.toLowerCase() ===
                                  currentWord.word.toLowerCase()
                              );
                              const isFav = Boolean(currentGardenEntry?.isFavorite);
                              return (
                                <button
                                  type="button"
                                  onClick={() => toggleFavoriteWord(currentWord)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                                    isFav
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-[#FAF7EE] hover:bg-amber-50 text-emerald-900 border-[#DCE5D5]'
                                  }`}
                                  title="Shortcut: F"
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      isFav
                                        ? 'fill-amber-500 text-amber-600'
                                        : 'text-amber-600'
                                    }`}
                                  />
                                  <span>{isFav ? 'Favorited' : 'Favorite'}</span>
                                </button>
                              );
                            })()}
                          </div>

                          {wordOutcome !== 'composted' && (
                            <button
                              type="button"
                              onClick={handleCompostCurrentWord}
                              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-stone-100 text-stone-700 border border-[#DCE5D5] text-[11px] font-bold transition-colors"
                              title="Already know this word well? Move it to Compost to skip future reviews."
                            >
                              <Archive className="w-3 h-3" />
                              <span>Move to Compost 🍂</span>
                            </button>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] sm:text-xs font-black text-emerald-700 uppercase tracking-widest">
                            Etymology
                          </p>
                          <p className="serif text-xs sm:text-sm text-emerald-900 italic mt-1 leading-relaxed">
                            {currentWord.etymology}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual Hint & Helper Controls */}
                  {!isRoundOver && (
                    <WordHintToolbar
                      currentWord={currentWord}
                      guess={guess}
                      revealedIndices={revealedIndices}
                      isComplete={isRoundOver}
                      showDefinitionOption={false}
                      etymologyUnlocked={hintUnlocked}
                      onUnlockEtymology={() => {
                        setHintUnlocked(true);
                        setWordPenaltyPts((prev) => prev + LETTER_HINT_PENALTY);
                      }}
                      onRevealIndices={handleSeedSproutRevealIndices}
                      letterBankActive={letterBankActive}
                      onToggleLetterBank={() => {
                        setLetterBankActive((prev) => !prev);
                        setUsedAssistedHint(true);
                        if (!letterTilesPenalized) {
                          setLetterTilesPenalized(true);
                          setWordPenaltyPts((prev) => prev + LETTER_TILES_PENALTY);
                        }
                      }}
                      onPickLetterFromBank={(ch) => {
                        const { nextGuess, nextFocus } = placeCharFromTileBank(
                          currentWord.word,
                          guess,
                          revealedIndices,
                          focusedIndex,
                          ch
                        );
                        setGuess(nextGuess);
                        setFocusedIndex(nextFocus);
                        setMessage('');
                        setAnimation(null);
                      }}
                      onRemoveLetterFromBank={(ch) => {
                        const { nextGuess, removedIndex } = removeCharForTileBank(
                          guess,
                          revealedIndices,
                          ch
                        );
                        setGuess(nextGuess);
                        if (removedIndex !== null) setFocusedIndex(removedIndex);
                        setMessage('');
                        setAnimation(null);
                      }}
                      onClearTypedGuess={() => {
                        setGuess(Array(currentWord.word.length).fill(''));
                        const firstOpen =
                          findNextUnrevealedIndex(
                            currentWord.word.length,
                            revealedIndices,
                            -1
                          ) ?? 0;
                        setFocusedIndex(firstOpen);
                        setMessage('');
                        setAnimation(null);
                      }}
                      onRevealAnswer={handleGiveUpWord}
                      onCompost={handleCompostCurrentWord}
                    />
                  )}

                  {message && (
                    <div
                      className={`text-center p-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                        animation === 'success'
                          ? 'bg-emerald-100/65 text-emerald-900 border border-emerald-200'
                          : animation === 'failure'
                          ? 'bg-amber-50/75 text-amber-900 border border-amber-200'
                          : 'bg-amber-100/75 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {!isRoundOver ? (
                      <button
                        type="button"
                        onClick={checkAnswer}
                        className="flex-1 bg-emerald-800 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-900 shadow-lg active:scale-95 transition-all text-sm sm:text-base"
                      >
                        Check Word
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextWord}
                        className="flex-1 bg-emerald-800 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-900 shadow-lg active:scale-95 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                      >
                        <span>
                          {currentWordIndex + 1 >= remainingWords.length
                            ? 'View Results'
                            : 'Next Word'}
                        </span>
                        <span className="hidden sm:inline text-[10px] font-black uppercase bg-emerald-950/50 border border-white/20 px-1.5 py-0.5 rounded">
                          Enter ↵
                        </span>
                      </button>
                    )}
                  </div>
                  <p className="hidden sm:block text-[10px] text-center text-emerald-700/80 font-semibold">
                    Shortcuts: <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">Enter</kbd> Check / Next ·{' '}
                    <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">←/→</kbd> Move tiles ·{' '}
                    <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">Alt+E</kbd> Etymology ·{' '}
                    <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">Alt+T</kbd> Tiles ·{' '}
                    <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">Alt+L</kbd> Reveal 1 letter
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-[50vh] flex items-center justify-center p-6 text-emerald-800 font-bold">
                Loading word bank... 🎋
              </div>
            )}
          </main>
        </div>
      )}

      {/* Interactive 2-Tab Botanical Conservatory & Spaced-Repetition Flashcard Engine */}
      {showGarden && (
        <SecretGardenConservatory
          gardenList={gardenList}
          allLexiconWords={lexiconWords}
          initialFieldMode={conservatoryInitialMode}
          isModalOverlayOpen={
            Boolean(selectedGardenWord) ||
            showMenu ||
            showTutorial ||
            showFeedback ||
            confirmModal.show
          }
          onClose={() => setShowGarden(false)}
          onSelectWordDossier={(word) => setSelectedGardenWord(word)}
          onUpdateGardenEntry={(updated, countsTowardGoal) => {
            if (countsTowardGoal) {
              touchDailyPractice();
            }
            pushEntryToSupabase(updated);
            setGardenList((prev) =>
              prev.map((item) =>
                item.word.toLowerCase() === updated.word.toLowerCase() ? updated : item
              )
            );
          }}
          onToggleFavorite={(wordObj) => toggleFavoriteWord(wordObj)}
          onCompostWord={(wordObj) => compostWord(wordObj)}
          onRestoreFromCompost={(wordName) => restoreFromCompost(wordName)}
          onWaterClusterWithMode={launchGardenWateringRound}
        />
      )}

      {/* Word Detail Dossier Modal */}
      {selectedGardenWord && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="journal-card w-full max-w-lg rounded-3xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="relative overflow-hidden p-6 sm:p-8">
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {(() => {
                      const diffMeta = getDifficultyMeta(selectedGardenWord);
                      const topicMeta = getTopicMeta(selectedGardenWord);
                      return (
                        <>
                          <span
                            className={`specimen-stamp text-[10px] px-2.5 py-0.5 ${diffMeta.badgeClass}`}
                          >
                            {diffMeta.emoji} {diffMeta.label}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${topicMeta.badgeClass}`}
                          >
                            {topicMeta.emoji} {topicMeta.label}
                          </span>
                        </>
                      );
                    })()}
                    <span className="bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {selectedGardenWord.form}
                    </span>
                    {selectedGardenWord.isComposted ? (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-stone-200 text-stone-800 border-stone-300">
                        🍂 In Compost
                      </span>
                    ) : (
                      selectedGardenWord.growthStage && (
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            GROWTH_STAGE_META[selectedGardenWord.growthStage].badgeClass
                          }`}
                        >
                          {GROWTH_STAGE_META[selectedGardenWord.growthStage].emoji}{' '}
                          {GROWTH_STAGE_META[selectedGardenWord.growthStage].label}
                        </span>
                      )
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="serif text-3xl sm:text-4xl font-black text-emerald-950">
                      {selectedGardenWord.word}
                    </h2>
                    <SpeakWordButton
                      word={selectedGardenWord.word}
                      size="sm"
                      showLabel
                    />
                    {!selectedGardenWord.isComposted && (
                      <button
                        type="button"
                        onClick={() => toggleFavoriteWord(selectedGardenWord)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                          selectedGardenWord.isFavorite
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-[#FAF7EE] hover:bg-amber-50 text-emerald-900 border-[#DCE5D5]'
                        }`}
                        title="Shortcut: F"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            selectedGardenWord.isFavorite
                              ? 'fill-amber-500 text-amber-600'
                              : 'text-amber-600'
                          }`}
                        />
                        <span>
                          {selectedGardenWord.isFavorite ? 'Favorited' : 'Favorite'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGardenWord(null)}
                  className="p-2 hover:bg-emerald-100 rounded-full transition-colors text-emerald-800"
                >
                  ✕
                </button>
              </div>

              <div className="relative z-10 space-y-5">
                <div className="journal-subcard !bg-[#F8F6EE]/78 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1.5">
                    Primary Definition
                  </p>
                  <p className="serif text-sm sm:text-base text-emerald-950 font-semibold leading-relaxed">
                    {selectedGardenWord.definition}
                  </p>
                  {selectedGardenWord.definition2 && (
                    <p className="serif text-xs sm:text-sm text-emerald-800 mt-2 italic border-l-2 border-emerald-500 pl-3">
                      {selectedGardenWord.definition2}
                    </p>
                  )}
                </div>

                <div className="field-quote !bg-[#F7F3E8]/78 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1.5">
                    Example usage
                  </p>
                  <p className="serif text-sm text-emerald-950 italic leading-relaxed">
                    &ldquo;{selectedGardenWord.example}&rdquo;
                  </p>
                </div>

                {selectedGardenWord.userSentence && (
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                    <p className="text-[10px] font-black text-purple-800 uppercase tracking-widest mb-1.5">
                      Your Original Sentence 🪶
                    </p>
                    <p className="serif text-sm text-purple-950 italic leading-relaxed">
                      &ldquo;{selectedGardenWord.userSentence}&rdquo;
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="journal-subcard !bg-[#F8F6EE]/78 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
                      Origin
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {ORIGIN_EMOJI_MAP[selectedGardenWord.origin] || '🍄'}
                      </span>
                      <span className="text-sm font-bold text-emerald-900">
                        {selectedGardenWord.origin}
                      </span>
                    </div>
                  </div>
                  <div className="journal-subcard !bg-[#F8F6EE]/78 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
                      Review Cadence
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {selectedGardenWord.isComposted ? '🍂' : '💧'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-900">
                        {formatNextReviewLabel(selectedGardenWord)}
                        {!selectedGardenWord.isComposted &&
                          selectedGardenWord.dateLearned !== 'Undiscovered' &&
                          !isWordThirsty(selectedGardenWord) &&
                          ` • ${selectedGardenWord.repetitionCount || 0} reps`}
                      </span>
                    </div>
                  </div>
                </div>

                {!selectedGardenWord.isComposted && (
                  <div className="journal-subcard !bg-[#F8F6EE]/78 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">
                      Context Coverage
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          selectedGardenWord.modesMastered?.includes('seed-sprout')
                            ? 'bg-[#EDF5EB] text-emerald-900 border-[#C6DEC2]'
                            : 'bg-stone-50 text-stone-400 border-stone-200'
                        }`}
                      >
                        🌱 Seed Sprout (Discovered)
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          selectedGardenWord.modesMastered?.includes('field-notes')
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : 'bg-stone-50 text-stone-400 border-stone-200'
                        }`}
                      >
                        ✍️ Field Notes (Usage)
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          selectedGardenWord.modesMastered?.includes('own-words')
                            ? 'bg-purple-50 text-purple-900 border-purple-200'
                            : 'bg-stone-50 text-stone-400 border-stone-200'
                        }`}
                      >
                        🪶 In Your Own Words
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          selectedGardenWord.modesMastered?.includes('watering')
                            ? 'bg-sky-50 text-sky-900 border-sky-200'
                            : 'bg-stone-50 text-stone-400 border-stone-200'
                        }`}
                      >
                        💧 Flashcard Recall
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#DCE5D5]">
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1.5">
                    Etymology
                  </p>
                  <p className="serif text-xs sm:text-sm text-emerald-900 italic leading-relaxed">
                    {selectedGardenWord.etymology}
                  </p>
                </div>
              </div>

              <BotanicalPlateSpecimen
                word={selectedGardenWord.word}
                variant="dossier"
                className="mt-3"
              />

              <div className="relative z-10 mt-5 flex flex-col sm:flex-row gap-2.5">
                {selectedGardenWord.isComposted ? (
                  <button
                    type="button"
                    onClick={() => restoreFromCompost(selectedGardenWord.word)}
                    className="flex-1 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold shadow-md transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>Restore from Compost</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => compostWord(selectedGardenWord)}
                    className="sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-2xl font-bold transition-all text-xs flex items-center justify-center gap-1.5"
                    title="Already know this word well? Move it to Compost to skip future rounds and flashcards."
                  >
                    <Archive className="w-4 h-4" />
                    <span>Move to Compost 🍂</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedGardenWord(null)}
                  className="flex-1 py-3.5 bg-emerald-800 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-900 transition-all text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Main Menu Drawer/Sheet */}
      {showMobileMainMenu && (
        <div
          className="fixed inset-0 z-[75] bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowMobileMainMenu(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Main Menu"
        >
          <div
            className="journal-card w-full max-w-sm rounded-3xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#DCE5D5] bg-[#F8F6EE] flex items-center justify-between gap-2 shrink-0">
              <div>
                <h2 className="serif text-xl font-bold text-emerald-900">🌿 Menu</h2>
                <p className="text-[11px] font-bold text-emerald-700">
                  {userRank.emoji} {userRank.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileMainMenu(false)}
                className="p-2 rounded-full text-emerald-800 hover:bg-emerald-100 transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Compact Progress Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[#EDF5EB] border border-[#C6DEC2] p-2.5 text-center">
                  <div className="text-sm font-black text-emerald-950">🌳 {masteredTotal}</div>
                  <div className="text-[10px] font-bold text-emerald-800">Mastered</div>
                </div>
                <div className="rounded-xl bg-[#FAF7EE] border border-[#DCE5D5] p-2.5 text-center">
                  <div className="text-sm font-black text-emerald-950">🌸 {activeGardenList.length}</div>
                  <div className="text-[10px] font-bold text-emerald-800">Garden</div>
                </div>
                <div className="rounded-xl bg-orange-50 border border-orange-200 p-2.5 text-center">
                  <div className="text-sm font-black text-orange-800">🔥 {dailyStreak}d</div>
                  <div className="text-[10px] font-bold text-orange-700">Streak</div>
                </div>
              </div>

              {/* Navigation & Study Tools */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMainMenu(false);
                    openConservatoryGrid();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#EDF5EB] hover:bg-emerald-100 text-emerald-950 border border-[#C6DEC2] text-sm font-bold transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Flower2 className="w-4 h-4 text-emerald-700" />
                    <span>Open Garden</span>
                  </span>
                  <span className="text-xs font-black text-emerald-800">
                    {activeGardenList.length}
                  </span>
                </button>

                <Link
                  href="/ranks"
                  onClick={() => setShowMobileMainMenu(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#FAF7EE] hover:bg-emerald-50 text-emerald-950 border border-[#DCE5D5] text-sm font-bold transition-colors"
                >
                  <span>{userRank.emoji} Botanical Ranks &amp; Progress</span>
                  <span className="text-xs text-emerald-700">→</span>
                </Link>

                {canAccessCurator(cloudUser?.email) && (
                  <Link
                    href="/curator"
                    onClick={() => setShowMobileMainMenu(false)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-sm font-bold transition-colors"
                  >
                    <span>🛠️ Curator Studio</span>
                    <span className="text-xs text-amber-800">→</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMainMenu(false);
                    setShowMenu(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#FAF7EE] hover:bg-emerald-50 text-emerald-950 border border-[#DCE5D5] text-sm font-bold transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-emerald-700" />
                    <span>Settings &amp; Data</span>
                  </span>
                  <span className="text-xs text-emerald-700">→</span>
                </button>
              </div>

              {/* Guides & Help */}
              <div className="pt-2 border-t border-[#E5ECE0]">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">
                  Guides &amp; Help
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  <Link
                    href="/help"
                    onClick={() => setShowMobileMainMenu(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                  >
                    <span>📖 Help &amp; Game Rules</span>
                    <span className="text-emerald-700">→</span>
                  </Link>
                  <Link
                    href="/help/garden"
                    onClick={() => setShowMobileMainMenu(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                  >
                    <span>🌸 Garden Guide</span>
                    <span className="text-emerald-700">→</span>
                  </Link>
                  <Link
                    href="/help/word-network"
                    onClick={() => setShowMobileMainMenu(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                  >
                    <span>🌿 Word Network Guide</span>
                    <span className="text-emerald-700">→</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMainMenu(false);
                      setShowTutorial(true);
                    }}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors text-left"
                  >
                    <span>🧭 Replay Intro Tutorial</span>
                    <span className="text-emerald-700">→</span>
                  </button>
                </div>
              </div>

              {/* Cloud Sync / Account */}
              <div className="pt-2 border-t border-[#E5ECE0]">
                {cloudUser ? (
                  <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-emerald-900 text-white text-xs font-bold shadow-sm">
                    <span className="flex items-center gap-2 truncate">
                      <UserCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span className="truncate">{cloudUser.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        setCloudUser(null);
                        setShowMobileMainMenu(false);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-red-700 text-white text-[11px] font-bold transition-colors shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMainMenu(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Cloud Sync / Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showMenu && (
        <div className="fixed inset-0 z-[70] bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="journal-card w-full max-w-sm rounded-3xl overflow-hidden animate-scale-in">
            <div className="p-5 text-center border-b border-[#DCE5D5] bg-[#F8F6EE]">
              <h2 className="serif text-2xl font-bold text-emerald-900">Settings ⚙️</h2>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2.5 border-b border-[#E5ECE0] pb-1">
                  Navigation
                </h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowWelcome(true);
                      setSelectedSeed(null);
                    }}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-[#F7F9F4] rounded-xl hover:bg-[#ECF4E8] transition-colors text-emerald-900 font-bold border border-[#DCE6D6]"
                  >
                    <span>🏠 Main Dashboard</span>
                  </button>
                  <Link
                    href="/ranks"
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F7F9F4] rounded-xl hover:bg-[#ECF4E8] transition-colors text-emerald-900 font-bold border border-[#DCE6D6] text-xs"
                  >
                    <span>{userRank.emoji} Botanical Ranks &amp; Progress</span>
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F7F9F4] rounded-xl hover:bg-[#ECF4E8] transition-colors text-emerald-900 font-bold border border-[#DCE6D6] text-xs"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-700" />
                    <span>Help &amp; Instructions</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowTutorial(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F7F9F4] rounded-xl hover:bg-[#ECF4E8] transition-colors text-emerald-900 font-bold border border-[#DCE6D6] text-xs"
                  >
                    <span>🧭 Replay Intro Tutorial</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowFeedback(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F7F9F4] rounded-xl hover:bg-[#ECF4E8] transition-colors text-emerald-900 font-bold border border-[#DCE6D6] text-xs"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                    <span>Send Feedback</span>
                  </button>
                  {SUPPORT_URL && (
                    <a
                      href={SUPPORT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowMenu(false)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors text-amber-900 font-bold border border-amber-200 text-xs"
                    >
                      <Coffee className="w-4 h-4 text-amber-700" />
                      <span>Support the Developer</span>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2.5 border-b border-[#E5ECE0] pb-1">
                  Game Mode 🎮
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {GAME_MODES_META.map((gm) => (
                    <button
                      key={gm.id}
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        handleHeaderModeSwitch(gm.id);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                        selectedMode === gm.id
                          ? 'bg-emerald-800 border-emerald-900 text-white'
                          : 'bg-[#FAF7EE] border-[#DCE5D5] text-emerald-800 hover:border-emerald-500'
                      }`}
                    >
                      <span className="text-xl mb-1">{gm.emoji}</span>
                      <span className="text-[9px] font-black uppercase text-center">
                        {gm.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2.5 border-b border-[#E5ECE0] pb-1">
                  Data Management 🌳
                </h3>
                <div className="space-y-2">
                  {!showWelcome && selectedSeed && (
                    <button
                      type="button"
                      onClick={requestResetCategory}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F7F9F4] rounded-xl hover:bg-[#ECF4E8] transition-colors text-emerald-900 font-bold border border-[#DCE6D6] text-xs"
                    >
                      <span>Reset Current Deck Shuffle 🍄</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={requestResetAll}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-red-800 font-bold border border-red-100 text-xs"
                  >
                    <span>Reset All Local Data 🌳</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5ECE0] flex justify-center">
              <button
                type="button"
                onClick={() => setShowMenu(false)}
                className="px-8 py-2 bg-emerald-800 text-white rounded-full font-bold text-xs uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Round Mastery Summary Modal */}
      {showRoundResult && (
        <div className="fixed inset-0 z-[80] bg-emerald-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="journal-card w-full max-w-lg rounded-[2rem] overflow-hidden p-6 sm:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-5">
              <span className="text-5xl mb-3 block">🌿</span>
              <h2 className="serif text-3xl font-black text-emerald-950 mb-1">
                Round Complete!
              </h2>
              <p className="text-emerald-800 font-medium text-sm">
                {GAME_MODES_META.find((m) => m.id === selectedMode)?.title} •{' '}
                <span className="font-bold">
                  {selectedSeed && selectedSeed !== 'all'
                    ? getDifficultyMeta(selectedSeed).label
                    : 'All Difficulties'}
                  {activeTopicFilter !== 'all'
                    ? ` · ${getTopicMeta(activeTopicFilter).label}`
                    : ''}
                </span>
              </p>
              {isScoredMode && (selectedMode === 'seed-sprout' || selectedMode === 'field-notes') && (
                <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                    🏆 Round Score:
                  </span>
                  <span className="serif text-2xl font-black text-amber-950 tabular-nums">
                    {roundScore} pts
                  </span>
                  {isNewBestRound && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-300 text-amber-950">
                      New Personal Best!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Breakdown Counters */}
            {(() => {
              const cleanCnt = roundResults.filter((r) => r.outcome === 'clean').length;
              const assistedCnt = roundResults.filter((r) => r.outcome === 'assisted').length;
              const missedCnt = roundResults.filter((r) => r.outcome === 'missed').length;
              const compostedCnt = roundResults.filter((r) => r.outcome === 'composted').length;

              return (
                <>
                  <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
                    <div className="journal-subcard p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-emerald-700 uppercase">Clean</p>
                      <p className="serif text-2xl font-black text-emerald-900">{cleanCnt}</p>
                    </div>
                    <div className="journal-subcard p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-amber-700 uppercase">Assisted</p>
                      <p className="serif text-2xl font-black text-amber-900">{assistedCnt}</p>
                    </div>
                    <div className="journal-subcard p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-sky-700 uppercase">To Review</p>
                      <p className="serif text-2xl font-black text-sky-900">{missedCnt}</p>
                    </div>
                  </div>

                  {/* Per-Word Summary List with Quick Compost */}
                  <div className="bg-[#FAF7EE] border border-[#DCE5D5] rounded-2xl p-3 mb-5 space-y-2 max-h-56 overflow-y-auto">
                    {roundResults.map((res) => {
                      const entryInGarden = gardenList.find(
                        (g) => g.word.toLowerCase() === res.word.toLowerCase()
                      );
                      const isCurrentlyComposted = Boolean(entryInGarden?.isComposted);
                      const stage = entryInGarden?.growthStage || res.nextStage || 'sprout';
                      const stageMeta = GROWTH_STAGE_META[stage];

                      return (
                        <div
                          key={res.word}
                          className="flex items-center justify-between gap-2 bg-[#FFFDF8] px-3 py-2 rounded-xl border border-[#E5ECE0]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 ${
                                res.outcome === 'clean'
                                  ? 'text-emerald-600'
                                  : res.outcome === 'assisted'
                                  ? 'text-amber-500'
                                  : res.outcome === 'composted'
                                  ? 'text-stone-400'
                                  : 'text-sky-500'
                              }`}
                            />
                            <span className="serif font-bold text-emerald-950 truncate">
                              {res.word}
                            </span>
                            <SpeakWordButton word={res.word} size="xs" />
                            {typeof res.points === 'number' && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 tabular-nums">
                                +{res.points} pts
                              </span>
                            )}
                            {isCurrentlyComposted ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                                🍂 Compost
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stageMeta.badgeClass}`}
                              >
                                {stageMeta.emoji} {stageMeta.label}
                              </span>
                            )}
                          </div>

                          <div className="shrink-0">
                            {isCurrentlyComposted ? (
                              <button
                                type="button"
                                onClick={() => restoreFromCompost(res.word)}
                                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-950 px-2 py-1 rounded-full bg-[#EDF5EB]"
                              >
                                Undo Compost
                              </button>
                            ) : (
                              entryInGarden && (
                                <button
                                  type="button"
                                  onClick={() => compostWord(entryInGarden)}
                                  className="text-[10px] font-bold text-stone-600 hover:text-stone-900 px-2 py-1 rounded-full bg-stone-100"
                                  title="Already know this word? Move to Compost"
                                >
                                  Compost 🍂
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {compostedCnt > 0 && (
                      <p className="text-[10px] text-center text-stone-600 font-medium pt-1">
                        {compostedCnt} word(s) composted this round (hidden from future rounds &amp; flashcards).
                      </p>
                    )}
                  </div>
                </>
              );
            })()}

            <div className="flex items-center justify-center gap-4 text-xs font-bold text-emerald-800 mb-5">
              <span>🔥 {dailyStreak}d Streak</span>
              <span>•</span>
              <span>🌳 {masteredTotal} Mastered Total</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {isPlantWateringRound && (
                <button
                  type="button"
                  onClick={() => {
                    setShowRoundResult(false);
                    setIsPlantWateringRound(false);
                    setShowWelcome(true);
                    openConservatoryGrid();
                  }}
                  className="w-full py-3.5 bg-emerald-800 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-900 transition-all text-base flex items-center justify-center gap-2"
                >
                  <Flower2 className="w-4 h-4" />
                  <span>Return to Garden Specimens</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowRoundResult(false);
                  setIsPlantWateringRound(false);
                  if (selectedSeed) {
                    initSeedBank(selectedSeed, selectedMode, activeTopicFilter);
                  } else if (selectedMode === 'field-notes' || selectedMode === 'own-words') {
                    initSeedBank('all', selectedMode, 'all');
                  }
                }}
                className={
                  isPlantWateringRound
                    ? 'w-full py-3 bg-[#EDF5EB] text-emerald-900 border border-[#C6DEC2] rounded-2xl font-bold hover:bg-emerald-100 transition-all text-sm'
                    : 'w-full py-3.5 bg-emerald-800 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-900 transition-all text-base'
                }
              >
                {isPlantWateringRound ? 'Play a Full Round' : 'Play Again'}
              </button>
              {thirstyCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowRoundResult(false);
                    launchWateringSession();
                  }}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Droplets className="w-4 h-4" />
                  <span>Review Due Flashcards ({thirstyCount})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowRoundResult(false);
                  setShowWelcome(true);
                  setSelectedSeed(null);
                }}
                className="w-full py-3 bg-[#F4F7F0] text-emerald-900 border border-[#DCE5D5] rounded-2xl font-bold hover:bg-emerald-100 transition-all text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="journal-card w-full max-w-sm rounded-3xl p-8 text-center">
            <h3 className="serif text-2xl font-bold text-emerald-900 mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-emerald-800 font-medium mb-8 text-sm">{confirmModal.message}</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
                className="flex-1 py-3 bg-[#F4F7F0] text-emerald-800 border border-[#DCE5D5] rounded-xl font-bold hover:bg-emerald-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.action}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* First-Visit Onboarding Tutorial Modal */}
      <OnboardingTutorialModal
        isOpen={showTutorial}
        isNewUser={gardenList.length === 0}
        onClose={dismissTutorial}
        onSkipOrExit={handleTutorialSkipOrExit}
        onStartSeedSprout={handleStartFromTutorial}
      />

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        defaultEmail={cloudUser?.email || ''}
      />
    </div>
  );
};

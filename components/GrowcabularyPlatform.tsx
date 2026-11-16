'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Word,
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

function normalizeGardenEntry(entry: GardenEntry): GardenEntry {
  const match = RAW_WORDS_BY_KEY.get(entry.word.toLowerCase());
  return {
    ...entry,
    seed: match ? getWordDifficulty(match) : getWordDifficulty(entry),
    topic: match ? getWordTopic(match) : getWordTopic(entry),
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

  // Persistent Learning & Habit Progress
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [lastPracticeDate, setLastPracticeDate] = useState<string>('');
  const [dailyWordsToday, setDailyWordsToday] = useState<number>(0);
  const [playedWords, setPlayedWords] = useState<string[]>([]);
  const [gardenList, setGardenList] = useState<GardenEntry[]>([]);

  // UI & Modals
  const [showWelcome, setShowWelcome] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [conservatoryInitialMode, setConservatoryInitialMode] = useState<'grid' | 'flashcards'>('grid');
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
      if (savedGarden) {
        const parsedGarden = JSON.parse(savedGarden);
        if (Array.isArray(parsedGarden)) {
          setGardenList(parsedGarden.map((item) => normalizeGardenEntry(item)));
        }
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
      const syncModes = entry.isComposted
        ? Array.from(new Set([...baseModes, 'compost']))
        : baseModes.filter((m) => (m as string) !== 'compost');

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
        mergedMap.set(normalized.word.toLowerCase(), normalized);
      });

      const cloudTimeByTerm = new Map<string, number>();

      for (const row of cloudRows || []) {
        const termKey = (row.word_term || '').toLowerCase();
        const lexiconMatch = RAW_WORDS.find((w) => w.word.toLowerCase() === termKey);
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
        const cleanModes = rawModes.filter(
          (m): m is GameMode =>
            m === 'seed-sprout' ||
            m === 'field-notes' ||
            m === 'own-words' ||
            m === 'watering'
        );

        const localUpdatedAt = new Date(
          existing?.compostedAt || existing?.lastWateredDate || 0
        ).getTime();

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
            isComposted: isCompostedFromCloud,
          });
        }
      }

      const entriesToUpload: GardenEntry[] = [];
      for (const [termKey, entry] of mergedMap.entries()) {
        const localUpdatedAt = new Date(
          entry.compostedAt || entry.lastWateredDate || 0
        ).getTime();
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

    RAW_WORDS.forEach((w) => {
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

    RAW_WORDS.forEach((w) => {
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
  }, [gardenList]);

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
  };

  const initSeedBank = (
    difficulty: DifficultyTier | 'all',
    overrideMode?: GameMode,
    topicOverride?: TopicCategory | 'all'
  ) => {
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
    const allInFilter = RAW_WORDS.filter((w) => {
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
    const hasDiscoveredInCurrent = activeGardenList.some(
      (g) =>
        (diffCheck === 'all' || getWordDifficulty(g) === diffCheck) &&
        (activeTopicFilter === 'all' || getWordTopic(g) === activeTopicFilter)
    );
    if (hasDiscoveredInCurrent) {
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

  const openConservatoryGrid = () => {
    setConservatoryInitialMode('grid');
    setShowGarden(true);
  };

  const launchWateringSession = () => {
    setConservatoryInitialMode('flashcards');
    setShowGarden(true);
  };

  const commitSeedSproutOutcome = (outcome: RecallOutcome) => {
    if (!currentWord) return;
    const result = recordWordOutcome(currentWord, outcome, 'seed-sprout');
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
      setMessage('Not quite — try Letter Tiles, First & Last, or another hint below.');
      setAnimation('wrong');
      setTimeout(() => setAnimation(null), 500);
    }
  };

  const finishRoundWithResults = (results: RoundEntryResult[]) => {
    setRoundResults(results);
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
    }
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

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
          RAW_WORDS.filter(
            (w) =>
              (selectedSeed === 'all' || getWordDifficulty(w) === selectedSeed) &&
              (activeTopicFilter === 'all' || getWordTopic(w) === activeTopicFilter)
          ).map((w) => w.word)
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
            {/* Top Bar: Rank, Mastery & Cloud Account Link */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-[#E5ECE0]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-700">
                  Rank:
                </span>
                <span className="bg-emerald-800 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  {userRank.emoji} {userRank.title}
                </span>
                <span className="bg-[#EDF5EB] text-emerald-900 border border-[#C6DEC2] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  🌳 {masteredTotal} Mastered
                </span>
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
                Build your vocabulary, master words in context, and explore word origins
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
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-800 text-white shadow-sm">
                      Primary Mode • Discover Words
                    </span>
                  </div>
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
                const selectedTopicStat = topicStats[seedSproutTopicFilter];
                return (
                  <div className="mb-4 p-3 sm:p-3.5 rounded-2xl bg-[#FCF7EA] border border-[#E6D7B6] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
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
                        className="px-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#DFCCA4] text-xs sm:text-sm font-bold text-amber-950 focus:border-amber-600 outline-none"
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
                      {selectedTopicMeta && (
                        <span className="text-[11px] text-amber-800 truncate hidden lg:inline">
                          {selectedTopicMeta.description}
                        </span>
                      )}
                    </div>

                    {selectedTopicMeta && (
                      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full">
                          {selectedTopicStat.activeTotal} words in topic
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            initSeedBank('all', 'seed-sprout', seedSproutTopicFilter)
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all"
                        >
                          Play All {selectedTopicMeta.label} →
                        </button>
                      </div>
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
                <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#DCE5D5] flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="serif font-bold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                        <span>✍️ Field Notes</span>
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        Usage in Context
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Read a real-life quote or field note example and choose which of your discovered words fits the blank.
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
                        All Difficulties ({activeGardenList.length})
                      </option>
                      {WORD_BANKS.map((b) => {
                        const count = activeGardenList.filter(
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
                      <option value="all">All Topics ({activeGardenList.length})</option>
                      {TOPIC_CATEGORIES.map((tc) => {
                        const count = activeGardenList.filter(
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
                </div>

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
            <div className="flex justify-center mb-2">
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

              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-sm font-medium">
                {dailyStreak > 0 && (
                  <div className="text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 font-black flex items-center gap-1">
                    🔥 {dailyStreak}d
                  </div>
                )}
                <div className="text-emerald-900 bg-[#F4F7F0] px-3 py-1 rounded-full border border-[#DCE5D5] text-xs font-bold">
                  <span className="font-black">{dailyWordsToday}</span> today
                </div>
                <button
                  type="button"
                  onClick={openConservatoryGrid}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full text-xs font-bold shadow-sm"
                >
                  Garden 🌸
                </button>
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
                discoveredPool={activeGardenList}
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
                <div
                  className="absolute top-0 left-0 h-1 bg-emerald-600 transition-all duration-500"
                  style={{
                    width: `${(currentWordIndex / Math.max(1, remainingWords.length)) * 100}%`,
                  }}
                />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-[#DCE5D5]">
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
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${diffMeta.badgeClass}`}
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

                {/* Individual Letter Tiles */}
                <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mb-7">
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
                              ? 'bg-[#E2EFE0] border-[#86BA8B] text-emerald-900 shadow-sm'
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

                <div className="space-y-5">
                  <div className="journal-subcard p-4 sm:p-6 rounded-2xl">
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
                    <div className="field-quote p-3.5 rounded-xl">
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
                      <div className="mt-4 pt-4 border-t border-[#D8E2D2] flex flex-col sm:flex-row sm:items-end justify-between gap-3 animate-fade-in">
                        <div>
                          <p className="text-[10px] sm:text-xs font-black text-emerald-700 uppercase tracking-widest">
                            Etymology
                          </p>
                          <p className="serif text-xs sm:text-sm text-emerald-900 italic mt-1 leading-relaxed">
                            {currentWord.etymology}
                          </p>
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
                      onUnlockEtymology={() => setHintUnlocked(true)}
                      onRevealIndices={handleSeedSproutRevealIndices}
                      letterBankActive={letterBankActive}
                      onToggleLetterBank={() => {
                        setLetterBankActive((prev) => !prev);
                        setUsedAssistedHint(true);
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
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : animation === 'failure'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
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
                        className="flex-1 bg-emerald-800 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-900 shadow-lg active:scale-95 transition-all text-sm sm:text-base"
                      >
                        {currentWordIndex + 1 >= remainingWords.length
                          ? 'View Results'
                          : 'Next Word'}
                      </button>
                    )}
                  </div>
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
          allLexiconWords={RAW_WORDS}
          initialFieldMode={conservatoryInitialMode}
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
          onCompostWord={(wordObj) => compostWord(wordObj)}
          onRestoreFromCompost={(wordName) => restoreFromCompost(wordName)}
        />
      )}

      {/* Word Detail Dossier Modal */}
      {selectedGardenWord && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="journal-card w-full max-w-lg rounded-3xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {(() => {
                      const diffMeta = getDifficultyMeta(selectedGardenWord);
                      const topicMeta = getTopicMeta(selectedGardenWord);
                      return (
                        <>
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${diffMeta.badgeClass}`}
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
                  <h2 className="serif text-3xl sm:text-4xl font-black text-emerald-950">
                    {selectedGardenWord.word}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGardenWord(null)}
                  className="p-2 hover:bg-emerald-100 rounded-full transition-colors text-emerald-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5">
                <div className="journal-subcard p-4 rounded-2xl">
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

                <div className="field-quote p-4 rounded-2xl">
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
                  <div className="journal-subcard p-3 rounded-2xl">
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
                  <div className="journal-subcard p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
                      Review Cadence
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {selectedGardenWord.isComposted ? '🍂' : '💧'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-900">
                        {selectedGardenWord.isComposted
                          ? 'Composted (Skipped)'
                          : selectedGardenWord.dateLearned === 'Undiscovered'
                          ? 'Not yet learned'
                          : isWordThirsty(selectedGardenWord)
                          ? 'Due now'
                          : `${selectedGardenWord.intervalDays || 1}d interval • ${
                              selectedGardenWord.repetitionCount || 0
                            } reps`}
                      </span>
                    </div>
                  </div>
                </div>

                {!selectedGardenWord.isComposted && (
                  <div className="journal-subcard p-3 rounded-2xl">
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

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
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
                  <button
                    type="button"
                    onClick={requestResetCategory}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F7F9F4] rounded-xl hover:bg-[#ECF4E8] transition-colors text-emerald-900 font-bold border border-[#DCE6D6] text-xs"
                  >
                    <span>Reset Current Deck Shuffle 🍄</span>
                  </button>
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
              <button
                type="button"
                onClick={() => {
                  setShowRoundResult(false);
                  if (selectedSeed) {
                    initSeedBank(selectedSeed, selectedMode, activeTopicFilter);
                  } else if (selectedMode === 'field-notes' || selectedMode === 'own-words') {
                    initSeedBank('all', selectedMode, 'all');
                  }
                }}
                className="w-full py-3.5 bg-emerald-800 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-900 transition-all text-base"
              >
                Play Again
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
    </div>
  );
};

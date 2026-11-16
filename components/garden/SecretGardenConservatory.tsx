'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  GardenEntry,
  Word,
  GrowthStage,
  DifficultyTier,
  TopicCategory,
} from '../../types';
import {
  ORIGIN_EMOJI_MAP,
  GROWTH_STAGE_META,
  WORD_BANKS,
  TOPIC_CATEGORIES,
  getDifficultyMeta,
  getTopicMeta,
  getWordDifficulty,
  getWordTopic,
} from '../../constants';
import {
  isWordThirsty,
  isWordMastered,
  getHydrationPercentage,
  applySpacedRepetitionWithMeta,
} from '../../utils/srs';
import { classifyOriginBranch, getSafeEtymologyHint } from '../../utils/etymology';
import { EtymologyPhylogenyExplorer } from './EtymologyPhylogenyExplorer';
import { getFieldNotePassage } from '../../utils/fieldQuotes';
import {
  X,
  Droplets,
  GitBranch,
  BookOpen,
  Search,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sun,
  Archive,
  Undo2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SecretGardenConservatoryProps {
  gardenList: GardenEntry[];
  allLexiconWords: Word[];
  initialFieldMode?: 'grid' | 'flashcards';
  onClose: () => void;
  onSelectWordDossier: (word: GardenEntry) => void;
  onUpdateGardenEntry: (updated: GardenEntry, countsTowardGoal?: boolean) => void;
  onCompostWord: (wordObj: Word) => void;
  onRestoreFromCompost: (word: string) => void;
}

type ConservatoryTab = 'words' | 'flashcards' | 'network';
type FlashcardScope = 'due' | 'all';
type FlashcardDirection = 'clue-to-word' | 'word-to-meaning';
type StageFilterType = GrowthStage | 'all' | 'thirsty' | 'compost';
type SortOption = 'topic' | 'difficulty' | 'due' | 'az' | 'recent';

const DIFFICULTY_ORDER_INDEX = new Map<DifficultyTier, number>(
  WORD_BANKS.map((b, idx) => [b.type, idx])
);
const TOPIC_ORDER_INDEX = new Map<TopicCategory, number>(
  TOPIC_CATEGORIES.map((t, idx) => [t.type, idx])
);

function getDifficultyOrder(tier: DifficultyTier): number {
  return DIFFICULTY_ORDER_INDEX.get(tier) ?? 99;
}

function getTopicOrder(topic: TopicCategory): number {
  return TOPIC_ORDER_INDEX.get(topic) ?? 99;
}

function maskWordInText(text: string, word: string): string {
  if (!text || !word) return '';
  const stem =
    word.length > 3 ? word.toLowerCase().replace(/[ey]$/i, '') : word.toLowerCase();
  const regex = new RegExp(`\\b${stem}[a-z]*\\b`, 'gi');
  return text.replace(regex, (match) => {
    const maskLen = Math.min(match.length, word.length);
    const suffix = match.slice(maskLen);
    return '•'.repeat(maskLen) + suffix;
  });
}

export const SecretGardenConservatory: React.FC<SecretGardenConservatoryProps> = ({
  gardenList,
  allLexiconWords,
  initialFieldMode = 'grid',
  onClose,
  onSelectWordDossier,
  onUpdateGardenEntry,
  onCompostWord,
  onRestoreFromCompost,
}) => {
  const [activeTab, setActiveTab] = useState<ConservatoryTab>(
    initialFieldMode === 'flashcards' ? 'flashcards' : 'words'
  );
  const [flashcardScope, setFlashcardScope] = useState<FlashcardScope>('due');
  const [stageFilter, setStageFilter] = useState<StageFilterType>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyTier | 'all'>('all');
  const [topicFilter, setTopicFilter] = useState<TopicCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('topic');
  const [searchQuery, setSearchQuery] = useState('');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [hideWords, setHideWords] = useState(false);
  const [revealedWords, setRevealedWords] = useState<Set<string>>(new Set());

  const toggleRevealWord = (word: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRevealedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }
      return next;
    });
  };

  // Interactive SRS Flashcard Deck state
  const [flashcardDirection, setFlashcardDirection] =
    useState<FlashcardDirection>('clue-to-word');
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showCardRootHint, setShowCardRootHint] = useState(false);
  const [scratchGuess, setScratchGuess] = useState('');
  const [wateringNotice, setWateringNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialFieldMode === 'flashcards') {
      setActiveTab('flashcards');
      setStageFilter((prev) => (prev === 'compost' ? 'all' : prev));
    } else {
      setActiveTab('words');
    }
  }, [initialFieldMode]);

  const activeEntries = useMemo(
    () => gardenList.filter((g) => !g.isComposted),
    [gardenList]
  );

  const compostEntries = useMemo(
    () => gardenList.filter((g) => g.isComposted),
    [gardenList]
  );

  const thirstyCount = useMemo(
    () => activeEntries.filter((g) => isWordThirsty(g)).length,
    [activeEntries]
  );

  const masteredCount = useMemo(
    () => activeEntries.filter((g) => isWordMastered(g)).length,
    [activeEntries]
  );

  // Per-difficulty and per-topic counts for the current base view
  const difficultyCounts = useMemo(() => {
    const baseList = stageFilter === 'compost' ? compostEntries : activeEntries;
    const map = new Map<DifficultyTier, number>();
    baseList.forEach((item) => {
      if (topicFilter !== 'all' && getWordTopic(item) !== topicFilter) return;
      const diff = getWordDifficulty(item);
      map.set(diff, (map.get(diff) || 0) + 1);
    });
    return map;
  }, [activeEntries, compostEntries, stageFilter, topicFilter]);

  const topicCounts = useMemo(() => {
    const baseList = stageFilter === 'compost' ? compostEntries : activeEntries;
    const map = new Map<TopicCategory, number>();
    baseList.forEach((item) => {
      if (difficultyFilter !== 'all' && getWordDifficulty(item) !== difficultyFilter) return;
      const top = getWordTopic(item);
      map.set(top, (map.get(top) || 0) + 1);
    });
    return map;
  }, [activeEntries, compostEntries, stageFilter, difficultyFilter]);

  const matchesOriginFilter = (item: GardenEntry, filterVal: string) => {
    if (filterVal === 'all') return true;
    if (filterVal.startsWith('branch:')) {
      return classifyOriginBranch(item.origin).branchId === filterVal.slice('branch:'.length);
    }
    return item.origin.toLowerCase().includes(filterVal.toLowerCase());
  };

  // Filtered & sorted list for `My Words` tab
  const filteredFieldGuide = useMemo(() => {
    const baseList = stageFilter === 'compost' ? compostEntries : activeEntries;
    const filtered = baseList.filter((item) => {
      if (difficultyFilter !== 'all' && getWordDifficulty(item) !== difficultyFilter) {
        return false;
      }
      if (topicFilter !== 'all' && getWordTopic(item) !== topicFilter) {
        return false;
      }
      if (stageFilter === 'thirsty' && !isWordThirsty(item)) return false;
      if (
        stageFilter !== 'all' &&
        stageFilter !== 'thirsty' &&
        stageFilter !== 'compost' &&
        (item.growthStage || 'sprout') !== stageFilter
      ) {
        return false;
      }
      const diffLabel = getDifficultyMeta(item).label.toLowerCase();
      const topicLabel = getTopicMeta(item).label.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.word.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.etymology.toLowerCase().includes(q) ||
        diffLabel.includes(q) ||
        topicLabel.includes(q);
      return matchesSearch && matchesOriginFilter(item, originFilter);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'due' || stageFilter === 'thirsty') {
        const aThirsty = isWordThirsty(a) ? 0 : 1;
        const bThirsty = isWordThirsty(b) ? 0 : 1;
        if (aThirsty !== bThirsty) return aThirsty - bThirsty;
        const hydDiff = getHydrationPercentage(a) - getHydrationPercentage(b);
        if (hydDiff !== 0) return hydDiff;
      }
      if (sortBy === 'az') {
        return a.word.localeCompare(b.word);
      }
      if (sortBy === 'recent') {
        const timeA = new Date(a.compostedAt || a.lastWateredDate || 0).getTime();
        const timeB = new Date(b.compostedAt || b.lastWateredDate || 0).getTime();
        if (timeA !== timeB) return timeB - timeA;
        return a.word.localeCompare(b.word);
      }
      if (sortBy === 'difficulty') {
        const dDiff =
          getDifficultyOrder(getWordDifficulty(a)) -
          getDifficultyOrder(getWordDifficulty(b));
        if (dDiff !== 0) return dDiff;
        return a.word.localeCompare(b.word);
      }
      const tDiff = getTopicOrder(getWordTopic(a)) - getTopicOrder(getWordTopic(b));
      if (tDiff !== 0) return tDiff;
      return a.word.localeCompare(b.word);
    });
  }, [
    activeEntries,
    compostEntries,
    stageFilter,
    difficultyFilter,
    topicFilter,
    searchQuery,
    originFilter,
    sortBy,
  ]);

  // Dedicated Flashcard Deck (independent of word-grid stage/search filters)
  const scopedActiveFlashcards = useMemo(() => {
    return activeEntries.filter((item) => {
      if (difficultyFilter !== 'all' && getWordDifficulty(item) !== difficultyFilter) {
        return false;
      }
      if (topicFilter !== 'all' && getWordTopic(item) !== topicFilter) {
        return false;
      }
      return matchesOriginFilter(item, originFilter);
    });
  }, [activeEntries, difficultyFilter, topicFilter, originFilter]);

  const scopedDueFlashcards = useMemo(
    () => scopedActiveFlashcards.filter((g) => isWordThirsty(g)),
    [scopedActiveFlashcards]
  );

  const flashcardDeckEntries = useMemo(() => {
    const pool =
      flashcardScope === 'due' && scopedDueFlashcards.length > 0
        ? scopedDueFlashcards
        : scopedActiveFlashcards;

    return [...pool].sort((a, b) => {
      const aThirsty = isWordThirsty(a) ? 0 : 1;
      const bThirsty = isWordThirsty(b) ? 0 : 1;
      if (aThirsty !== bThirsty) return aThirsty - bThirsty;
      const hydDiff = getHydrationPercentage(a) - getHydrationPercentage(b);
      if (hydDiff !== 0) return hydDiff;
      const tDiff = getTopicOrder(getWordTopic(a)) - getTopicOrder(getWordTopic(b));
      if (tDiff !== 0) return tDiff;
      return a.word.localeCompare(b.word);
    });
  }, [flashcardScope, scopedDueFlashcards, scopedActiveFlashcards]);

  // Grouped sections when viewing `My Words` sorted by topic or difficulty
  const groupedSections = useMemo(() => {
    if (sortBy === 'difficulty' && difficultyFilter === 'all') {
      const bucketMap = new Map<DifficultyTier, GardenEntry[]>();
      filteredFieldGuide.forEach((entry) => {
        const d = getWordDifficulty(entry);
        const list = bucketMap.get(d) || [];
        list.push(entry);
        bucketMap.set(d, list);
      });
      return WORD_BANKS.filter((b) => (bucketMap.get(b.type)?.length || 0) > 0).map(
        (b) => ({
          kind: 'difficulty' as const,
          meta: getDifficultyMeta(b.type),
          entries: bucketMap.get(b.type) || [],
        })
      );
    }

    const bucketMap = new Map<TopicCategory, GardenEntry[]>();
    filteredFieldGuide.forEach((entry) => {
      const t = getWordTopic(entry);
      const list = bucketMap.get(t) || [];
      list.push(entry);
      bucketMap.set(t, list);
    });
    return TOPIC_CATEGORIES.filter((t) => (bucketMap.get(t.type)?.length || 0) > 0).map(
      (t) => ({
        kind: 'topic' as const,
        meta: getTopicMeta(t.type),
        entries: bucketMap.get(t.type) || [],
      })
    );
  }, [filteredFieldGuide, sortBy, difficultyFilter]);

  const resetCardState = () => {
    setIsCardFlipped(false);
    setShowCardRootHint(false);
    setScratchGuess('');
  };

  const currentFlashcard =
    flashcardDeckEntries.length > 0
      ? flashcardDeckEntries[Math.min(cardIndex, flashcardDeckEntries.length - 1)]
      : null;

  const handleGradeFlashcard = (
    entry: GardenEntry,
    quality: 2 | 4 | 5,
    advanceDeck: boolean = true
  ) => {
    const wasDue = isWordThirsty(entry) || (entry.repetitionCount ?? 1) === 0;
    const { entry: updated, scheduleAdvanced } = applySpacedRepetitionWithMeta(
      entry,
      quality,
      'watering'
    );
    onUpdateGardenEntry(updated, wasDue || quality < 3);

    const stageMeta = GROWTH_STAGE_META[updated.growthStage || 'sprout'];
    if (quality < 3) {
      setWateringNotice(
        `Reset "${updated.word}" to ${stageMeta.emoji} ${stageMeta.label} — queued for review again.`
      );
    } else if (scheduleAdvanced) {
      setWateringNotice(
        `✓ Reviewed "${updated.word}" • ${stageMeta.emoji} ${stageMeta.label} (Next review in ${updated.intervalDays}d)`
      );
    } else {
      setWateringNotice(
        `✓ Practiced "${updated.word}" early — schedule unchanged (Next review in ${updated.intervalDays || 1}d)`
      );
    }

    if (advanceDeck && flashcardDeckEntries.length > 0) {
      resetCardState();
      setCardIndex((prev) => (prev + 1) % flashcardDeckEntries.length);
    }
  };

  const handleCompostFromConservatory = (entry: GardenEntry) => {
    onCompostWord(entry);
    resetCardState();
    setCardIndex((prev) =>
      flashcardDeckEntries.length > 1 ? prev % (flashcardDeckEntries.length - 1) : 0
    );
    setWateringNotice(
      `🍂 Moved "${entry.word}" to Compost — hidden from future rounds and flashcards.`
    );
  };

  return (
    <div className="fixed inset-0 z-[60] bg-emerald-950/85 backdrop-blur-md flex items-center justify-center sm:p-4">
      <div className="journal-card w-full sm:max-w-5xl h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden flex flex-col relative">
        {/* Top Garden Header */}
        <div className="p-4 sm:p-6 border-b border-[#DCE5D5] bg-gradient-to-r from-[#F4F7F0] via-[#FFFDF8] to-[#FCF7EA] shrink-0">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <h2 className="serif text-2xl sm:text-3xl font-bold text-emerald-950">
                Garden 🌸
              </h2>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                {activeEntries.length} active {activeEntries.length === 1 ? 'word' : 'words'} ·{' '}
                {masteredCount} mastered
                {thirstyCount > 0 ? ` · ${thirstyCount} due for review` : ''}
                {compostEntries.length > 0 ? ` · ${compostEntries.length} compost` : ''}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-emerald-100 rounded-full transition-colors text-emerald-800"
              aria-label="Close Garden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 3 Clean Top-Level Garden Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('words')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === 'words'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-[#FFFDF8] text-emerald-800 border-[#DCE5D5] hover:bg-[#F4F7F0]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Words ({activeEntries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('flashcards');
                resetCardState();
                setCardIndex(0);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === 'flashcards'
                  ? 'bg-sky-700 text-white border-sky-800 shadow-sm'
                  : 'bg-[#FFFDF8] text-sky-900 border-[#DCE5D5] hover:bg-sky-50'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>
                Flashcards ({thirstyCount > 0 ? `${thirstyCount} Due` : activeEntries.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('network')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === 'network'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-[#FFFDF8] text-emerald-800 border-[#DCE5D5] hover:bg-[#F4F7F0]'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Word Network</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MY WORDS (CLEAN FILTERED SPECIMEN GRID) */}
        {activeTab === 'words' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8F6EE]/60 space-y-4">
            {/* Single Compact Filter Bar */}
            <div className="bg-[#FFFDF8] p-3.5 rounded-2xl border border-[#DCE5D5] shadow-sm space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCardIndex(0);
                    }}
                    placeholder="Search words or definitions..."
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#DCE5D5] bg-[#FAF7EE] text-xs font-medium text-emerald-950 focus:border-emerald-600 focus:bg-[#FFFDF8] outline-none"
                  />
                </div>

                <select
                  value={stageFilter}
                  onChange={(e) => {
                    setStageFilter(e.target.value as StageFilterType);
                    setCardIndex(0);
                  }}
                  className="px-3 py-2 rounded-xl border border-[#DCE5D5] text-xs font-bold text-emerald-900 bg-[#FAF7EE]"
                  aria-label="Filter by word status or stage"
                >
                  <option value="all">All Active ({activeEntries.length})</option>
                  <option value="thirsty">💧 Due for Review ({thirstyCount})</option>
                  {(Object.keys(GROWTH_STAGE_META) as GrowthStage[]).map((stageKey) => {
                    const meta = GROWTH_STAGE_META[stageKey];
                    const count = activeEntries.filter(
                      (g) => (g.growthStage || 'sprout') === stageKey
                    ).length;
                    return (
                      <option key={stageKey} value={stageKey}>
                        {meta.emoji} {meta.label} ({count})
                      </option>
                    );
                  })}
                  <option value="compost">🍂 Compost ({compostEntries.length})</option>
                </select>

                <select
                  value={difficultyFilter}
                  onChange={(e) => {
                    setDifficultyFilter(e.target.value as DifficultyTier | 'all');
                    setCardIndex(0);
                  }}
                  className="px-3 py-2 rounded-xl border border-[#DCE5D5] text-xs font-bold text-emerald-900 bg-[#FAF7EE]"
                  aria-label="Filter by difficulty"
                >
                  <option value="all">All Difficulties</option>
                  {WORD_BANKS.map((bank) => (
                    <option key={bank.type} value={bank.type}>
                      {bank.emoji} {bank.label} ({difficultyCounts.get(bank.type) || 0})
                    </option>
                  ))}
                </select>

                <select
                  value={topicFilter}
                  onChange={(e) => {
                    setTopicFilter(e.target.value as TopicCategory | 'all');
                    setCardIndex(0);
                  }}
                  className="px-3 py-2 rounded-xl border border-[#DCE5D5] text-xs font-bold text-emerald-900 bg-[#FAF7EE]"
                  aria-label="Filter by topic"
                >
                  <option value="all">All Topics</option>
                  {TOPIC_CATEGORIES.filter((tc) => (topicCounts.get(tc.type) || 0) > 0).map(
                    (tc) => (
                      <option key={tc.type} value={tc.type}>
                        {tc.emoji} {tc.label} ({topicCounts.get(tc.type) || 0})
                      </option>
                    )
                  )}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 rounded-xl border border-[#DCE5D5] text-xs font-bold text-emerald-900 bg-[#FAF7EE]"
                  aria-label="Sort words"
                >
                  <option value="topic">Sort: By Topic</option>
                  <option value="difficulty">Sort: By Difficulty</option>
                  <option value="due">Sort: Due First</option>
                  <option value="az">Sort: A – Z</option>
                  <option value="recent">Sort: Most Recent</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setHideWords((prev) => !prev);
                    setRevealedWords(new Set());
                  }}
                  aria-pressed={hideWords}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    hideWords
                      ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                      : 'bg-[#FAF7EE] text-emerald-900 border-[#DCE5D5] hover:bg-[#EDF5EB]'
                  }`}
                  title={
                    hideWords
                      ? 'Show all words on cards'
                      : 'Hide words on cards to self-test from definitions'
                  }
                >
                  {hideWords ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show Words</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Words</span>
                    </>
                  )}
                </button>
              </div>

              {originFilter !== 'all' && (
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                    Origin filter: {originFilter.replace('branch:', '')}
                    <button
                      type="button"
                      onClick={() => setOriginFilter('all')}
                      className="font-black hover:text-amber-950 ml-0.5"
                      aria-label="Clear origin filter"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              )}
            </div>

            {/* Feedback Toast */}
            {wateringNotice && (
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 text-xs font-bold flex items-center justify-between gap-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>{wateringNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWateringNotice(null)}
                  className="text-sky-700 hover:text-sky-950 font-black px-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredFieldGuide.length === 0 ? (
              <div className="py-16 text-center bg-[#FFFDF8] rounded-3xl border border-[#DCE5D5] p-8">
                <span className="text-5xl block mb-3">
                  {stageFilter === 'compost' ? '🍂' : '🌱'}
                </span>
                <p className="serif font-bold text-xl text-emerald-950">
                  {stageFilter === 'compost'
                    ? 'Your Compost bin is empty.'
                    : activeEntries.length === 0
                    ? 'Your Garden is empty!'
                    : 'No words match your current filter.'}
                </p>
                <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                  {stageFilter === 'compost'
                    ? 'Words you already know well can be moved to Compost to exclude them from future rounds and flashcards.'
                    : activeEntries.length === 0
                    ? 'Complete a round of Seed Sprout to add words to your Garden.'
                    : 'Try clearing your search, stage, or category filter.'}
                </p>
                {(difficultyFilter !== 'all' ||
                  topicFilter !== 'all' ||
                  originFilter !== 'all' ||
                  searchQuery !== '' ||
                  (stageFilter !== 'all' && stageFilter !== 'compost')) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDifficultyFilter('all');
                      setTopicFilter('all');
                      setOriginFilter('all');
                      setSearchQuery('');
                      if (stageFilter !== 'compost') setStageFilter('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              (() => {
                const renderWordCard = (entry: GardenEntry) => {
                  const stage = entry.growthStage || 'sprout';
                  const stageMeta = GROWTH_STAGE_META[stage];
                  const diffMeta = getDifficultyMeta(entry);
                  const topicMeta = getTopicMeta(entry);
                  const thirsty = isWordThirsty(entry);
                  const isWordHidden = hideWords && !revealedWords.has(entry.word);
                  const isWordRevealedInTest = hideWords && revealedWords.has(entry.word);

                  return (
                    <div
                      key={entry.word}
                      onClick={() => {
                        if (isWordHidden) {
                          toggleRevealWord(entry.word);
                          return;
                        }
                        onSelectWordDossier(entry);
                      }}
                      className={`rounded-2xl p-4 border-2 transition-all cursor-pointer shadow-sm flex flex-col justify-between group ${
                        entry.isComposted
                          ? 'bg-[#F8F6EE] border-stone-300 hover:border-stone-500'
                          : 'bg-[#FFFDF8] border-[#DCE5D5] hover:border-emerald-600'
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
                          {entry.isComposted ? (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-stone-200 text-stone-800 border-stone-300">
                              🍂 In Compost
                            </span>
                          ) : (
                            <span
                              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${stageMeta.badgeClass}`}
                            >
                              {stageMeta.emoji} {stageMeta.label}
                            </span>
                          )}
                          <div className="flex flex-wrap items-center gap-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffMeta.badgeClass}`}
                            >
                              {diffMeta.emoji} {diffMeta.label}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${topicMeta.badgeClass}`}
                            >
                              {topicMeta.emoji} {topicMeta.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          {isWordHidden ? (
                            <button
                              type="button"
                              onClick={(e) => toggleRevealWord(entry.word, e)}
                              className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-black transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Tap to reveal word</span>
                            </button>
                          ) : (
                            <div className="flex items-baseline gap-1.5 min-w-0">
                              <h3 className="serif text-xl font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">
                                {entry.word}
                              </h3>
                              {isWordRevealedInTest && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleRevealWord(entry.word, e)}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition-colors shrink-0"
                                  title="Hide word again"
                                >
                                  <EyeOff className="w-3 h-3" />
                                  <span>Hide</span>
                                </button>
                              )}
                            </div>
                          )}
                          <span className="text-[10px] font-bold uppercase text-emerald-700 shrink-0">
                            {entry.form}
                          </span>
                        </div>

                        <p className="serif text-xs sm:text-sm text-emerald-900 line-clamp-2 mb-3 leading-relaxed">
                          {entry.definition}
                        </p>
                      </div>

                      {entry.isComposted ? (
                        <div className="pt-2.5 border-t border-stone-200 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-stone-600 font-bold">
                            {ORIGIN_EMOJI_MAP[entry.origin] || '🍄'} {entry.origin} · Excluded
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRestoreFromCompost(entry.word);
                              setWateringNotice(
                                `🌱 Restored "${entry.word}" back into your Garden.`
                              );
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-black transition-all shadow-sm"
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2.5 border-t border-[#E6ECE0] flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-emerald-800 truncate">
                            {ORIGIN_EMOJI_MAP[entry.origin] || '🍄'} {entry.origin} ·{' '}
                            <span className={thirsty ? 'text-amber-700' : 'text-sky-700'}>
                              {thirsty ? '💧 Due now' : '✓ Reviewed'}
                            </span>
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {thirsty && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGradeFlashcard(entry, 4, false);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-black transition-all shadow-sm"
                                title="Mark this word as recalled now"
                              >
                                <Droplets className="w-3 h-3" />
                                <span>Reviewed</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompostFromConservatory(entry);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition-colors"
                              title="Already know this word? Move to Compost"
                            >
                              <Archive className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                };

                if (
                  (sortBy === 'topic' && topicFilter === 'all') ||
                  (sortBy === 'difficulty' && difficultyFilter === 'all')
                ) {
                  return (
                    <div className="space-y-6">
                      {groupedSections.map(({ kind, meta, entries }) => {
                        const catMastered = entries.filter((e) => isWordMastered(e)).length;
                        const catDue = entries.filter((e) => isWordThirsty(e)).length;

                        return (
                          <section key={`${kind}-${meta.type}`} className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-[#FFFDF8] border border-[#DCE5D5] shadow-sm">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-lg">{meta.emoji}</span>
                                <h3 className="serif font-bold text-base text-emerald-950">
                                  {meta.label}
                                </h3>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${meta.badgeClass}`}
                                >
                                  {entries.length} {entries.length === 1 ? 'word' : 'words'}
                                </span>
                                {stageFilter !== 'compost' && catMastered > 0 && (
                                  <span className="text-[10px] font-bold text-emerald-800 bg-[#EDF5EB] px-2 py-0.5 rounded-full">
                                    🌳 {catMastered} mastered
                                  </span>
                                )}
                                {stageFilter !== 'compost' && catDue > 0 && (
                                  <span className="text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                                    💧 {catDue} due
                                  </span>
                                )}
                              </div>

                              {stageFilter !== 'compost' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (kind === 'difficulty') {
                                      setDifficultyFilter(meta.type as DifficultyTier);
                                    } else {
                                      setTopicFilter(meta.type as TopicCategory);
                                    }
                                    setFlashcardScope('all');
                                    setActiveTab('flashcards');
                                    setCardIndex(0);
                                    resetCardState();
                                  }}
                                  className="text-[11px] font-bold text-sky-800 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-full transition-colors"
                                >
                                  Flashcards for {meta.label} →
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {entries.map((entry) => renderWordCard(entry))}
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFieldGuide.map((entry) => renderWordCard(entry))}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* TAB 2: STREAMLINED SPACED-REPETITION FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8F6EE]/60 space-y-4">
            {/* Compact Flashcard Control Bar */}
            {activeEntries.length > 0 && (
              <div className="max-w-3xl mx-auto bg-[#FFFDF8] p-3 rounded-2xl border border-[#DCE5D5] shadow-sm flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFlashcardScope('due');
                      setCardIndex(0);
                      resetCardState();
                    }}
                    disabled={scopedDueFlashcards.length === 0}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all border ${
                      flashcardScope === 'due' && scopedDueFlashcards.length > 0
                        ? 'bg-sky-700 text-white border-sky-800 shadow-sm'
                        : scopedDueFlashcards.length === 0
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    💧 Due Now ({scopedDueFlashcards.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFlashcardScope('all');
                      setCardIndex(0);
                      resetCardState();
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all border ${
                      flashcardScope === 'all' || scopedDueFlashcards.length === 0
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-[#F4F7F0] text-emerald-900 border-[#DCE5D5] hover:bg-emerald-100'
                    }`}
                  >
                    All Words ({scopedActiveFlashcards.length})
                  </button>

                  <select
                    value={difficultyFilter}
                    onChange={(e) => {
                      setDifficultyFilter(e.target.value as DifficultyTier | 'all');
                      setCardIndex(0);
                      resetCardState();
                    }}
                    aria-label="Filter flashcards by difficulty"
                    className="px-2.5 py-1.5 rounded-full bg-[#F4F7F0] border border-[#DCE5D5] text-[11px] font-bold text-emerald-900 outline-none cursor-pointer"
                  >
                    <option value="all">All Difficulties</option>
                    {WORD_BANKS.map((bank) => (
                      <option key={bank.type} value={bank.type}>
                        {bank.emoji} {bank.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={topicFilter}
                    onChange={(e) => {
                      setTopicFilter(e.target.value as TopicCategory | 'all');
                      setCardIndex(0);
                      resetCardState();
                    }}
                    aria-label="Filter flashcards by topic"
                    className="px-2.5 py-1.5 rounded-full bg-[#F4F7F0] border border-[#DCE5D5] text-[11px] font-bold text-emerald-900 outline-none cursor-pointer"
                  >
                    <option value="all">All Topics</option>
                    {TOPIC_CATEGORIES.map((tc) => (
                      <option key={tc.type} value={tc.type}>
                        {tc.emoji} {tc.label}
                      </option>
                    ))}
                  </select>

                  {originFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      Origin: {originFilter.replace('branch:', '')}
                      <button
                        type="button"
                        onClick={() => {
                          setOriginFilter('all');
                          setCardIndex(0);
                          resetCardState();
                        }}
                        className="font-black hover:text-amber-950 ml-0.5"
                        aria-label="Clear origin filter"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFlashcardDirection((prev) =>
                        prev === 'clue-to-word' ? 'word-to-meaning' : 'clue-to-word'
                      );
                      resetCardState();
                    }}
                    className="px-3 py-1.5 rounded-full text-[11px] font-bold border bg-[#F4F7F0] text-emerald-900 border-[#DCE5D5] hover:bg-emerald-100/60 transition-all"
                  >
                    {flashcardDirection === 'clue-to-word'
                      ? 'Prompt: Clue → Word 🧠'
                      : 'Prompt: Word → Meaning 📖'}
                  </button>

                  {flashcardDeckEntries.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-emerald-900 px-1">
                        Card {Math.min(cardIndex + 1, flashcardDeckEntries.length)} of{' '}
                        {flashcardDeckEntries.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          resetCardState();
                          setCardIndex((prev) =>
                            prev > 0 ? prev - 1 : flashcardDeckEntries.length - 1
                          );
                        }}
                        className="p-1.5 rounded-full bg-[#F4F7F0] border border-[#DCE5D5] text-emerald-800 hover:bg-emerald-100"
                        title="Previous Flashcard"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetCardState();
                          setCardIndex((prev) => (prev + 1) % flashcardDeckEntries.length);
                        }}
                        className="p-1.5 rounded-full bg-[#F4F7F0] border border-[#DCE5D5] text-emerald-800 hover:bg-emerald-100"
                        title="Next Flashcard"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Watering Feedback Toast */}
            {wateringNotice && (
              <div className="max-w-3xl mx-auto p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 text-xs font-bold flex items-center justify-between gap-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>{wateringNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWateringNotice(null)}
                  className="text-sky-700 hover:text-sky-950 font-black px-2"
                >
                  ✕
                </button>
              </div>
            )}

            {!currentFlashcard ? (
              <div className="max-w-3xl mx-auto py-16 text-center bg-[#FFFDF8] rounded-3xl border border-[#DCE5D5] p-8">
                <span className="text-5xl block mb-3">💧</span>
                <p className="serif font-bold text-xl text-emerald-950">
                  {activeEntries.length === 0
                    ? 'No Flashcards Ready Yet'
                    : 'No flashcards match this filter.'}
                </p>
                <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                  {activeEntries.length === 0
                    ? 'Complete a round of Seed Sprout to grow your Garden deck.'
                    : 'Clear the category or origin filter to review all active cards.'}
                </p>
                {(difficultyFilter !== 'all' ||
                  topicFilter !== 'all' ||
                  originFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setDifficultyFilter('all');
                      setTopicFilter('all');
                      setOriginFilter('all');
                      setCardIndex(0);
                      resetCardState();
                    }}
                    className="mt-4 px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
                  >
                    Show Full Deck
                  </button>
                )}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">

                {/* Main Flashcard Surface */}
                {(() => {
                  const stage = currentFlashcard.growthStage || 'sprout';
                  const stageMeta = GROWTH_STAGE_META[stage];
                  const diffMeta = getDifficultyMeta(currentFlashcard);
                  const topicMeta = getTopicMeta(currentFlashcard);
                  const hydration = getHydrationPercentage(currentFlashcard);
                  const thirsty = isWordThirsty(currentFlashcard);
                  const passage = getFieldNotePassage(currentFlashcard);

                  return (
                    <div className="journal-card rounded-3xl p-6 sm:p-8 transition-all">
                      {/* Card Top Metadata: Difficulty, Topic, Stage, Part of Speech, Origin */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#DCE5D5]">
                        <div className="flex flex-wrap items-center gap-2">
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
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${stageMeta.badgeClass}`}
                          >
                            {stageMeta.emoji} {stageMeta.label} (Rep #{currentFlashcard.repetitionCount || 1})
                          </span>
                          <span className="bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {currentFlashcard.form}
                          </span>
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#EDF5EB] text-emerald-800 border border-[#C6DEC2]">
                            {ORIGIN_EMOJI_MAP[currentFlashcard.origin] || '🍄'}{' '}
                            {currentFlashcard.origin}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-black px-3 py-0.5 rounded-full border ${
                              thirsty
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-sky-50 text-sky-800 border-sky-200'
                            }`}
                          >
                            💧 {thirsty ? 'Due for Review' : `Reviewed (${hydration}%)`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCompostFromConservatory(currentFlashcard)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors"
                            title="Already know this word well? Move it to Compost to skip future flashcards."
                          >
                            <Archive className="w-3 h-3" />
                            <span>Compost 🍂</span>
                          </button>
                        </div>
                      </div>

                      {/* CARD FRONT (Not Yet Flipped) */}
                      {!isCardFlipped ? (
                        <div className="space-y-6 py-2">
                          {flashcardDirection === 'clue-to-word' ? (
                            <>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1.5">
                                  Recall the {currentFlashcard.word.length}-Letter Word
                                </p>
                                <h3 className="serif text-lg sm:text-2xl font-bold text-emerald-950 leading-snug">
                                  {currentFlashcard.definition}
                                </h3>
                                {currentFlashcard.definition2 && (
                                  <p className="serif text-xs sm:text-sm text-emerald-800 italic mt-2 border-l-2 border-emerald-500 pl-3">
                                    {currentFlashcard.definition2}
                                  </p>
                                )}
                              </div>

                              <div className="field-quote p-4 rounded-2xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">
                                  Example in Context
                                </p>
                                <p className="serif text-sm sm:text-base text-emerald-950 italic leading-relaxed">
                                  &ldquo;{maskWordInText(passage.quote, currentFlashcard.word)}&rdquo;
                                </p>
                                {passage.author && (
                                  <p className="text-xs font-bold text-emerald-800 mt-1.5 text-right">
                                    — {passage.author}
                                  </p>
                                )}
                              </div>

                              {/* Optional Etymology Root Hint before flipping */}
                              {showCardRootHint ? (
                                <div className="p-3.5 rounded-2xl bg-[#FCF7EA] border border-[#E8D8B5] text-xs text-amber-950 animate-fade-in">
                                  <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800 mb-1">
                                    Etymology Hint
                                  </span>
                                  <p className="serif italic">
                                    {getSafeEtymologyHint(currentFlashcard)}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() => setShowCardRootHint(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-1.5 rounded-full transition-colors"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" /> Etymology Hint
                                  </button>
                                </div>
                              )}

                              {/* Optional Quick Recall Input or Flip Button */}
                              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <input
                                  type="text"
                                  value={scratchGuess}
                                  onChange={(e) => setScratchGuess(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setIsCardFlipped(true);
                                    }
                                  }}
                                  placeholder={`Optional: type your ${currentFlashcard.word.length}-letter guess, then press Enter...`}
                                  className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF7EE] border-2 border-[#C8D8C2] focus:border-emerald-600 focus:bg-[#FFFDF8] outline-none text-sm font-bold text-emerald-950"
                                />
                                <button
                                  type="button"
                                  onClick={() => setIsCardFlipped(true)}
                                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  <span>Flip Card</span>
                                </button>
                              </div>
                            </>
                          ) : (
                            /* Word -> Meaning Prompt */
                            <div className="text-center py-8 space-y-6">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">
                                  Recall the Meaning
                                </p>
                                <h3 className="serif text-4xl sm:text-5xl font-black text-emerald-950">
                                  {currentFlashcard.word}
                                </h3>
                              </div>

                              <button
                                type="button"
                                onClick={() => setIsCardFlipped(true)}
                                className="px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold text-sm shadow-lg transition-all inline-flex items-center gap-2"
                              >
                                <RotateCcw className="w-4 h-4" />
                                <span>Flip to Reveal Meaning</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* CARD BACK (Flipped: Reveals Full Answer + Spaced-Repetition Controls) */
                        <div className="space-y-5 animate-fade-in">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">
                                Answer
                              </span>
                              <h3 className="serif text-3xl sm:text-4xl font-black text-emerald-950">
                                {currentFlashcard.word}
                              </h3>
                            </div>

                            {scratchGuess.trim() && (
                              <span
                                className={`text-xs font-black px-3 py-1 rounded-full border ${
                                  scratchGuess.trim().toLowerCase() ===
                                  currentFlashcard.word.toLowerCase()
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                {scratchGuess.trim().toLowerCase() ===
                                currentFlashcard.word.toLowerCase()
                                  ? '✓ Exact Match!'
                                  : `You typed: "${scratchGuess.trim()}"`}
                              </span>
                            )}
                          </div>

                          <div className="journal-subcard p-4 rounded-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">
                              Definition
                            </p>
                            <p className="serif text-base font-bold text-emerald-950 leading-snug">
                              {currentFlashcard.definition}
                            </p>
                            {currentFlashcard.definition2 && (
                              <p className="serif text-xs sm:text-sm text-emerald-800 italic mt-1.5 border-l-2 border-emerald-500 pl-3">
                                {currentFlashcard.definition2}
                              </p>
                            )}
                          </div>

                          <div className="field-quote p-4 rounded-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">
                              Context &amp; Literary Usage
                            </p>
                            <p className="serif text-sm text-emerald-950 italic leading-relaxed">
                              &ldquo;{passage.quote}&rdquo;
                            </p>
                            {passage.author && (
                              <p className="text-xs font-bold text-emerald-800 mt-1 text-right">
                                — {passage.author}
                              </p>
                            )}
                          </div>

                          {currentFlashcard.userSentence && (
                            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                              <p className="text-[10px] font-black uppercase tracking-widest text-purple-800 mb-1">
                                Your Original Sentence 🪶
                              </p>
                              <p className="serif text-sm text-purple-950 italic leading-relaxed">
                                &ldquo;{currentFlashcard.userSentence}&rdquo;
                              </p>
                            </div>
                          )}

                          <div className="p-4 rounded-2xl bg-[#FCF7EA] border border-[#E8D8B5]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 mb-1">
                              Etymology
                            </p>
                            <p className="serif text-xs sm:text-sm text-amber-950 italic leading-relaxed">
                              {currentFlashcard.etymology}
                            </p>
                          </div>

                          {/* Spaced-Repetition Grade Buttons */}
                          <div className="pt-3 border-t border-[#DCE5D5]">
                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-3">
                              Rate Your Recall
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <button
                                type="button"
                                onClick={() => handleGradeFlashcard(currentFlashcard, 2, true)}
                                className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-amber-950 text-left transition-all flex flex-col justify-between"
                              >
                                <span className="text-xs font-black uppercase flex items-center gap-1.5">
                                  Again
                                </span>
                                <span className="text-[11px] text-amber-800 mt-1">
                                  Review again in 1 day
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleGradeFlashcard(currentFlashcard, 4, true)}
                                className="p-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 border-2 border-sky-700 text-white text-left transition-all shadow-md flex flex-col justify-between"
                              >
                                <span className="text-xs font-black uppercase flex items-center gap-1.5">
                                  <Droplets className="w-3.5 h-3.5" /> Good
                                </span>
                                <span className="text-[11px] text-sky-100 mt-1">
                                  Advance review interval
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleGradeFlashcard(currentFlashcard, 5, true)}
                                className="p-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 border-2 border-emerald-950 text-white text-left transition-all shadow-md flex flex-col justify-between"
                              >
                                <span className="text-xs font-black uppercase flex items-center gap-1.5">
                                  <Sun className="w-3.5 h-3.5 text-amber-300" /> Easy
                                </span>
                                <span className="text-[11px] text-emerald-100 mt-1">
                                  Maximum interval boost
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INTERACTIVE WORD NODE VIEWER */}
        {activeTab === 'network' && (
          <EtymologyPhylogenyExplorer
            learnedEntries={activeEntries}
            allLexiconWords={allLexiconWords}
            onSelectWordDossier={onSelectWordDossier}
            onPracticeOriginFlashcards={(originFilterKey) => {
              setOriginFilter(originFilterKey);
              setDifficultyFilter('all');
              setTopicFilter('all');
              setStageFilter('all');
              setFlashcardScope('all');
              setActiveTab('flashcards');
              resetCardState();
              setCardIndex(0);
            }}
          />
        )}
      </div>
    </div>
  );
};

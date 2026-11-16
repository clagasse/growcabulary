'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Word, GardenEntry, GrowthStage, RecallOutcome, RoundEntryResult } from '../../types';
import {
  ORIGIN_EMOJI_MAP,
  GROWTH_STAGE_META,
  getDifficultyMeta,
  getTopicMeta,
} from '../../constants';
import { getFieldNotePassage } from '../../utils/fieldQuotes';
import { getSafeEtymologyHint } from '../../utils/etymology';
import {
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Archive,
  ChevronDown,
  Search,
  Sparkles,
  Filter,
  Eye,
  X,
  Sprout,
} from 'lucide-react';

interface BotanistFieldNotesGameProps {
  roundWords: Word[];
  discoveredPool: GardenEntry[];
  onRecordOutcome: (word: Word, outcome: RecallOutcome) => RoundEntryResult;
  onCompleteRound: (results: RoundEntryResult[]) => void;
  onSwitchToSeedSprout?: () => void;
}

function splitSentenceAroundTarget(
  sentence: string,
  targetWord: string
): { before: string; matchedForm: string; after: string } {
  if (!sentence || !targetWord) {
    return { before: sentence, matchedForm: targetWord, after: '' };
  }
  const stem =
    targetWord.length > 4
      ? targetWord.toLowerCase().replace(/(?:e|y|ing|ed|es|s)$/i, '')
      : targetWord.toLowerCase();
  const regex = new RegExp(`\\b${stem}[a-z'-]*\\b`, 'i');
  const match = sentence.match(regex);
  if (!match || match.index === undefined) {
    return {
      before: sentence + ' (',
      matchedForm: targetWord,
      after: ')',
    };
  }
  const idx = match.index;
  return {
    before: sentence.slice(0, idx),
    matchedForm: match[0],
    after: sentence.slice(idx + match[0].length),
  };
}

export const BotanistFieldNotesGame: React.FC<BotanistFieldNotesGameProps> = ({
  roundWords,
  discoveredPool,
  onRecordOutcome,
  onCompleteRound,
  onSwitchToSeedSprout,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAllInDropdown, setShowAllInDropdown] = useState(true);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(-1);
  const [triedWords, setTriedWords] = useState<Set<string>>(new Set());

  // Usage & Context Hints
  const [narrowedWords, setNarrowedWords] = useState<string[] | null>(null);
  const [secondExampleUnlocked, setSecondExampleUnlocked] = useState(false);
  const [etymologyUnlocked, setEtymologyUnlocked] = useState(false);
  const [definitionUnlocked, setDefinitionUnlocked] = useState(false);
  const [usedAssistedHint, setUsedAssistedHint] = useState(false);

  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isEntryComplete, setIsEntryComplete] = useState(false);
  const [entryOutcome, setEntryOutcome] = useState<RecallOutcome | null>(null);
  const [animation, setAnimation] = useState<'wrong' | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [roundResults, setRoundResults] = useState<RoundEntryResult[]>([]);

  const comboboxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentWord = roundWords[currentIdx];

  // Combine discoveredPool + roundWords into a deduplicated, alphabetically sorted list of discovered words
  const allDiscoveredOptions = useMemo(() => {
    const map = new Map<string, GardenEntry | Word>();
    discoveredPool.forEach((entry) => {
      if (!entry.isComposted) {
        map.set(entry.word.toLowerCase(), entry);
      }
    });
    roundWords.forEach((w) => {
      const key = w.word.toLowerCase();
      if (!map.has(key)) {
        map.set(key, w);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.word.localeCompare(b.word));
  }, [discoveredPool, roundWords]);

  const resetEntryState = useCallback(() => {
    setInputValue('');
    setIsDropdownOpen(false);
    setShowAllInDropdown(true);
    setHighlightedIdx(-1);
    setTriedWords(new Set());
    setNarrowedWords(null);
    setSecondExampleUnlocked(false);
    setEtymologyUnlocked(false);
    setDefinitionUnlocked(false);
    setUsedAssistedHint(false);
    setWrongAttempts(0);
    setIsEntryComplete(false);
    setEntryOutcome(null);
    setAnimation(null);
    setFeedback(null);
  }, []);

  useEffect(() => {
    setCurrentIdx(0);
    setRoundResults([]);
    resetEntryState();
  }, [roundWords, resetEntryState]);

  useEffect(() => {
    resetEntryState();
  }, [currentIdx, resetEntryState]);

  // Close dropdown when clicking outside combobox
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pool after optional "Narrow to 6 Words" hint
  const activeOptionPool = useMemo(() => {
    if (!narrowedWords) return allDiscoveredOptions;
    const narrowedSet = new Set(narrowedWords.map((w) => w.toLowerCase()));
    return allDiscoveredOptions.filter((item) => narrowedSet.has(item.word.toLowerCase()));
  }, [allDiscoveredOptions, narrowedWords]);

  // Filtered dropdown options based on typed search query
  const filteredDropdownOptions = useMemo(() => {
    const q = showAllInDropdown ? '' : inputValue.trim().toLowerCase();
    if (!q) return activeOptionPool;

    const startsWith: (GardenEntry | Word)[] = [];
    const contains: (GardenEntry | Word)[] = [];

    activeOptionPool.forEach((item) => {
      const wordLower = item.word.toLowerCase();
      const formLower = item.form.toLowerCase();
      const diffLower = getDifficultyMeta(item).label.toLowerCase();
      const topicLower = getTopicMeta(item).label.toLowerCase();
      if (wordLower.startsWith(q)) {
        startsWith.push(item);
      } else if (
        wordLower.includes(q) ||
        formLower.includes(q) ||
        diffLower.includes(q) ||
        topicLower.includes(q)
      ) {
        contains.push(item);
      }
    });

    return [...startsWith, ...contains];
  }, [activeOptionPool, inputValue, showAllInDropdown]);

  if (!currentWord) {
    return (
      <div className="w-full journal-card rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 text-center">
        <span className="text-4xl block mb-3">🌱</span>
        <h3 className="serif text-2xl font-bold text-emerald-950 mb-2">
          No Discovered Words Available Yet
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto mb-6">
          Discover words in <strong>Seed Sprout</strong> first! Once a word is planted in your
          Garden, it will appear here in <strong>Field Notes</strong> to practice in real-life
          sentences.
        </p>
        {onSwitchToSeedSprout && (
          <button
            type="button"
            onClick={onSwitchToSeedSprout}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-lg transition-all"
          >
            <Sprout className="w-4 h-4" />
            <span>Discover Words in Seed Sprout</span>
          </button>
        )}
      </div>
    );
  }

  const cleanCount = roundResults.filter((r) => r.outcome === 'clean').length;
  const assistedCount = roundResults.filter((r) => r.outcome === 'assisted').length;

  const commitOutcome = (outcome: RecallOutcome) => {
    const result = onRecordOutcome(currentWord, outcome);
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
    setEntryOutcome(outcome);
    setIsEntryComplete(true);
    setIsDropdownOpen(false);
  };

  const handleSelectWord = (wordStr: string) => {
    if (isEntryComplete) return;
    setInputValue(wordStr);
    setShowAllInDropdown(true);
    setIsDropdownOpen(false);
    setHighlightedIdx(-1);
    setFeedback(null);
  };

  const handleNarrowOptions = () => {
    if (isEntryComplete || narrowedWords || allDiscoveredOptions.length <= 6) return;
    setUsedAssistedHint(true);
    const targetLower = currentWord.word.toLowerCase();
    const distractors = allDiscoveredOptions
      .filter((w) => w.word.toLowerCase() !== targetLower && !triedWords.has(w.word.toLowerCase()))
      .sort((a, b) => {
        const aSameForm = a.form.toLowerCase() === currentWord.form.toLowerCase() ? 0 : 1;
        const bSameForm = b.form.toLowerCase() === currentWord.form.toLowerCase() ? 0 : 1;
        if (aSameForm !== bSameForm) return aSameForm - bSameForm;
        const aSameSeed = a.seed === currentWord.seed ? 0 : 1;
        const bSameSeed = b.seed === currentWord.seed ? 0 : 1;
        if (aSameSeed !== bSameSeed) return aSameSeed - bSameSeed;
        return Math.random() - 0.5;
      })
      .slice(0, 5)
      .map((w) => w.word);

    const subset = [currentWord.word, ...distractors].sort((a, b) => a.localeCompare(b));
    setNarrowedWords(subset);
    setShowAllInDropdown(true);
    setFeedback({
      type: 'info',
      text: `Narrowed your choices down to ${subset.length} discovered words.`,
    });
  };

  const handleGiveUp = () => {
    if (isEntryComplete) return;
    setInputValue(currentWord.word);
    commitOutcome('missed');
    setFeedback({
      type: 'info',
      text: `The word was "${currentWord.word}". Queued for spaced-repetition review.`,
    });
  };

  const handleCompostCurrent = () => {
    setInputValue(currentWord.word);
    commitOutcome('composted');
    setFeedback({
      type: 'info',
      text: `Moved "${currentWord.word}" to Compost — excluded from future rounds and flashcards.`,
    });
  };

  const handleVerifyAnswer = () => {
    if (isEntryComplete) return;
    const candidate = inputValue.trim();
    if (!candidate) {
      setFeedback({
        type: 'error',
        text: 'Choose or type one of your discovered words before checking.',
      });
      setIsDropdownOpen(true);
      setShowAllInDropdown(true);
      return;
    }

    const candidateLower = candidate.toLowerCase();
    const targetLower = currentWord.word.toLowerCase();

    if (candidateLower === targetLower) {
      const outcome: RecallOutcome =
        wrongAttempts === 0 && !usedAssistedHint ? 'clean' : 'assisted';
      commitOutcome(outcome);
      setFeedback({
        type: 'success',
        text:
          outcome === 'clean'
            ? `Spot on! "${currentWord.word}" fits this passage cleanly 🌿`
            : `Correct! "${currentWord.word}" reinforced in your Garden 🌱`,
      });
    } else {
      setWrongAttempts((prev) => prev + 1);
      setTriedWords((prev) => {
        const next = new Set(prev);
        next.add(candidateLower);
        return next;
      });
      setAnimation('wrong');
      setTimeout(() => setAnimation(null), 500);
      setFeedback({
        type: 'error',
        text: `"${candidate}" doesn't fit this passage — try another discovered word or use a context hint below.`,
      });
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEntryComplete) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        setHighlightedIdx(0);
      } else if (filteredDropdownOptions.length > 0) {
        setHighlightedIdx((prev) => (prev + 1) % filteredDropdownOptions.length);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isDropdownOpen && filteredDropdownOptions.length > 0) {
        setHighlightedIdx((prev) =>
          prev <= 0 ? filteredDropdownOptions.length - 1 : prev - 1
        );
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIdx(-1);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (
        isDropdownOpen &&
        highlightedIdx >= 0 &&
        highlightedIdx < filteredDropdownOptions.length
      ) {
        const picked = filteredDropdownOptions[highlightedIdx];
        if (picked.word.toLowerCase() !== inputValue.trim().toLowerCase()) {
          handleSelectWord(picked.word);
          return;
        }
      }
      handleVerifyAnswer();
    }
  };

  const handleNextEntry = () => {
    if (currentIdx + 1 < roundWords.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onCompleteRound(roundResults);
    }
  };

  const passage = getFieldNotePassage(currentWord);
  const { before, matchedForm, after } = splitSentenceAroundTarget(
    passage.quote,
    currentWord.word
  );
  const hasDistinctSecondExample =
    Boolean(currentWord.example) &&
    currentWord.example.trim().toLowerCase() !== passage.quote.trim().toLowerCase();
  const secondExampleSplit = hasDistinctSecondExample
    ? splitSentenceAroundTarget(currentWord.example, currentWord.word)
    : null;

  // Quick-select word bank pills: show when narrowed or when pool has <= 14 words
  const quickPickWords = useMemo(() => {
    if (narrowedWords) return activeOptionPool;
    if (allDiscoveredOptions.length <= 14) return allDiscoveredOptions;
    return [];
  }, [narrowedWords, activeOptionPool, allDiscoveredOptions]);

  return (
    <div className="w-full journal-card rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 relative overflow-visible">
      {/* Top Progress Bar */}
      <div
        className="absolute top-0 left-0 h-1 bg-emerald-600 transition-all duration-500 rounded-tl-2xl"
        style={{ width: `${(currentIdx / roundWords.length) * 100}%` }}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DCE5D5]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <BookOpen className="w-3.5 h-3.5" /> Field Notes • Passage {currentIdx + 1} of{' '}
            {roundWords.length}
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-[#EDF5EB] border border-[#C6DEC2] px-2.5 py-1 rounded-full">
            🌸 Using {allDiscoveredOptions.length} Discovered{' '}
            {allDiscoveredOptions.length === 1 ? 'Word' : 'Words'}
          </span>
        </div>

        <div className="flex items-center gap-4 journal-subcard px-4 py-2 rounded-2xl">
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
              Clean
            </p>
            <p className="serif text-lg sm:text-xl font-black text-emerald-900 tabular-nums">
              {cleanCount}
            </p>
          </div>
          <div className="w-px h-8 bg-[#D0DDD0]" />
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
              Practiced
            </p>
            <p className="serif text-lg sm:text-xl font-black text-emerald-900 tabular-nums">
              {cleanCount + assistedCount}/{roundWords.length}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata Pills (Part of Speech & Category of the Missing Word) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
            Missing Word Clue:
          </span>
          <span className="bg-emerald-800 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {currentWord.form}
          </span>
          <span className="bg-[#EDF5EB] text-emerald-900 border border-[#C6DEC2] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wider">
            {currentWord.word.length} letters
          </span>
          {etymologyUnlocked && (
            <span className="text-[10px] sm:text-xs font-black text-emerald-800 bg-[#EDF5EB] border border-[#C6DEC2] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              {ORIGIN_EMOJI_MAP[currentWord.origin] || '🍄'} {currentWord.origin}
            </span>
          )}
        </div>

        {(() => {
          const diffMeta = getDifficultyMeta(currentWord);
          const topicMeta = getTopicMeta(currentWord);
          return (
            <div className="flex flex-wrap items-center gap-1.5">
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
            </div>
          );
        })()}
      </div>

      {/* Primary Field Note Quote / Example Sentence with Interactive Blank */}
      <div className="field-quote p-5 sm:p-6 rounded-2xl mb-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
            {passage.author ? 'Real-Life Field Note & Literary Quote' : 'Example Sentence'}
          </p>
          {!isEntryComplete && (
            <span className="text-[10px] font-bold text-emerald-700">
              Click the blank or use the menu below
            </span>
          )}
        </div>

        <p className="serif text-base sm:text-xl text-emerald-950 italic leading-relaxed">
          &ldquo;{before}
          {isEntryComplete ? (
            <span className="inline-block mx-1 px-3 py-0.5 rounded-lg bg-emerald-800 text-white font-bold not-italic shadow-sm">
              {matchedForm}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen((prev) => !prev);
                setShowAllInDropdown(true);
                inputRef.current?.focus();
              }}
              className={`inline-flex items-center gap-1.5 mx-1 px-3 py-0.5 rounded-lg border-2 not-italic font-bold transition-all text-sm sm:text-base ${
                inputValue.trim()
                  ? 'bg-amber-50 border-emerald-700 text-emerald-950 shadow-sm'
                  : 'bg-[#FFFDF8] border-dashed border-emerald-600 text-emerald-800 hover:bg-emerald-50'
              } ${animation === 'wrong' ? 'animate-shake border-red-500 bg-red-50' : ''}`}
            >
              <span>{inputValue.trim() || `choose ${currentWord.word.length}-letter word...`}</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            </button>
          )}
          {after}&rdquo;
        </p>

        {passage.author && (
          <p className="text-xs sm:text-sm font-bold text-emerald-800 mt-3 text-right">
            — {passage.author}
          </p>
        )}
      </div>

      {/* Optional Second Example Sentence Hint */}
      {!isEntryComplete && secondExampleUnlocked && secondExampleSplit && (
        <div className="p-4 rounded-2xl bg-[#F4F7F0] border border-[#DCE5D5] mb-5 animate-fade-in">
          <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-800 mb-1">
            Additional Example Sentence
          </span>
          <p className="serif text-xs sm:text-sm text-emerald-950 italic leading-relaxed">
            &ldquo;{secondExampleSplit.before}
            <span className="inline-block mx-1 px-2 py-0.5 rounded bg-white border border-emerald-400 font-bold not-italic text-emerald-900">
              {inputValue.trim() || '______'}
            </span>
            {secondExampleSplit.after}&rdquo;
          </p>
        </div>
      )}

      {/* Searchable Type-In + Dropdown Menu of Discovered Words */}
      {!isEntryComplete && (
        <div className="mb-6" ref={comboboxRef}>
          <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-2">
            Choose or Type a Discovered Word ({activeOptionPool.length} in menu)
          </label>

          <div className="relative">
            <div
              className={`flex items-center rounded-2xl border-2 bg-[#FAF7EE] focus-within:bg-[#FFFDF8] focus-within:border-emerald-700 transition-all shadow-sm ${
                animation === 'wrong' ? 'border-red-500 animate-shake' : 'border-[#C8D8C2]'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-700 ml-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onFocus={() => {
                  setIsDropdownOpen(true);
                }}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowAllInDropdown(false);
                  setIsDropdownOpen(true);
                  setHighlightedIdx(0);
                  setFeedback(null);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={`Type to filter or pick from ${activeOptionPool.length} discovered words...`}
                className="w-full px-3 py-3.5 bg-transparent outline-none serif font-bold text-base sm:text-lg text-emerald-950 placeholder:font-sans placeholder:font-medium placeholder:text-xs sm:placeholder:text-sm placeholder:text-emerald-700/70"
                aria-label="Choose or type your discovered word"
                aria-expanded={isDropdownOpen}
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    setShowAllInDropdown(true);
                    setIsDropdownOpen(true);
                    setHighlightedIdx(-1);
                    inputRef.current?.focus();
                  }}
                  className="p-2 text-emerald-700 hover:text-emerald-950 transition-colors"
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowAllInDropdown(true);
                  setIsDropdownOpen((prev) => !prev);
                }}
                className="px-4 py-3.5 border-l border-[#DCE5D5] text-emerald-800 hover:bg-emerald-100/60 rounded-r-2xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-colors"
                aria-label="Toggle discovered words dropdown"
              >
                <span className="hidden sm:inline">Word List</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Dropdown Menu List */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 z-30 mt-2 bg-[#FFFDF8] border-2 border-emerald-800/30 rounded-2xl shadow-xl max-h-64 overflow-y-auto divide-y divide-[#EBF0E6]">
                {filteredDropdownOptions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-emerald-800 font-medium">
                    No discovered words match &ldquo;{inputValue}&rdquo;.
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue('');
                        setShowAllInDropdown(true);
                      }}
                      className="ml-2 underline font-bold text-emerald-900"
                    >
                      Show all ({activeOptionPool.length})
                    </button>
                  </div>
                ) : (
                  filteredDropdownOptions.map((item, idx) => {
                    const isTried = triedWords.has(item.word.toLowerCase());
                    const isSelected =
                      inputValue.trim().toLowerCase() === item.word.toLowerCase();
                    const isHighlighted = idx === highlightedIdx;
                    const diffMeta = getDifficultyMeta(item);
                    const topicMeta = getTopicMeta(item);
                    const stageKey: GrowthStage =
                      (item as GardenEntry).growthStage || 'sprout';
                    const stageMeta = GROWTH_STAGE_META[stageKey];

                    return (
                      <button
                        key={item.word}
                        type="button"
                        disabled={isTried}
                        onClick={() => handleSelectWord(item.word)}
                        onMouseEnter={() => setHighlightedIdx(idx)}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 transition-colors ${
                          isTried
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-emerald-800 text-white'
                            : isHighlighted
                            ? 'bg-[#EDF5EB] text-emerald-950'
                            : 'hover:bg-[#F4F7F0] text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm">{stageMeta.emoji}</span>
                          <span className="serif font-bold text-base truncate">
                            {item.word}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-emerald-950 text-emerald-100'
                                : 'bg-[#E6EFE2] text-emerald-800'
                            }`}
                          >
                            {item.form}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isTried ? (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 no-underline">
                              ✕ Tried
                            </span>
                          ) : (
                            <>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isSelected
                                    ? 'bg-emerald-700 text-white border-emerald-600'
                                    : diffMeta.badgeClass
                                }`}
                              >
                                {diffMeta.emoji} {diffMeta.label}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border hidden sm:inline-flex ${
                                  isSelected
                                    ? 'bg-emerald-700 text-white border-emerald-600'
                                    : topicMeta.badgeClass
                                }`}
                              >
                                {topicMeta.emoji} {topicMeta.label}
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Quick-Pick Word Chips (shown when pool <= 14 or narrowed to 6) */}
          {quickPickWords.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1.5">
                {narrowedWords
                  ? `Narrowed Discovered Words (${quickPickWords.length}):`
                  : `Quick-Pick Discovered Words (${quickPickWords.length}):`}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickPickWords.map((item) => {
                  const isTried = triedWords.has(item.word.toLowerCase());
                  const isSelected =
                    inputValue.trim().toLowerCase() === item.word.toLowerCase();
                  return (
                    <button
                      key={item.word}
                      type="button"
                      disabled={isTried}
                      onClick={() => handleSelectWord(item.word)}
                      className={`px-3 py-1.5 rounded-xl serif font-bold text-xs sm:text-sm border transition-all ${
                        isTried
                          ? 'bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-800 text-white border-emerald-950 shadow-sm scale-[1.02]'
                          : 'bg-[#FFFDF8] hover:bg-[#EDF5EB] text-emerald-950 border-[#DCE5D5] hover:border-emerald-600'
                      }`}
                    >
                      {item.word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Context & Usage Hint Toolbar */}
      {!isEntryComplete && (
        <div className="space-y-3 mb-6">
          {/* Unlocked Hint Callouts */}
          {(etymologyUnlocked || definitionUnlocked) && (
            <div className="grid grid-cols-1 gap-2.5 animate-fade-in">
              {definitionUnlocked && (
                <div className="p-3.5 rounded-2xl bg-[#EDF5EB] border border-[#C6DEC2] text-xs sm:text-sm text-emerald-950">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-800 mb-1">
                    Definition Clue
                  </span>
                  <p className="serif font-bold">{currentWord.definition}</p>
                </div>
              )}
              {etymologyUnlocked && (
                <div className="p-3.5 rounded-2xl bg-[#FCF7EA] border border-[#E8D8B5] text-xs sm:text-sm text-amber-950">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800 mb-1">
                    Origin &amp; Etymology Hint ({currentWord.origin})
                  </span>
                  <p className="serif italic">{getSafeEtymologyHint(currentWord)}</p>
                </div>
              )}
            </div>
          )}

          {/* Hint Action Buttons */}
          <div className="p-3 rounded-2xl bg-[#F4F7F0] border border-[#DCE5D5] flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {allDiscoveredOptions.length > 6 && !narrowedWords && (
                <button
                  type="button"
                  onClick={handleNarrowOptions}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF8] hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                >
                  <Filter className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Narrow to 6 Words</span>
                </button>
              )}

              {hasDistinctSecondExample && !secondExampleUnlocked && (
                <button
                  type="button"
                  onClick={() => setSecondExampleUnlocked(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF8] hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>2nd Example Sentence</span>
                </button>
              )}

              {!etymologyUnlocked && (
                <button
                  type="button"
                  onClick={() => setEtymologyUnlocked(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCF7EA] hover:bg-amber-100/70 text-amber-900 border border-[#E8D8B5] text-xs font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Origin &amp; Root Hint</span>
                </button>
              )}

              {!definitionUnlocked && (
                <button
                  type="button"
                  onClick={() => {
                    setDefinitionUnlocked(true);
                    setUsedAssistedHint(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF8] hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Show Definition</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleGiveUp}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
              >
                Reveal Answer
              </button>
              <button
                type="button"
                onClick={handleCompostCurrent}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-bold transition-colors"
                title="Already know this word well? Move it to Compost to skip future rounds."
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Compost 🍂</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Verification Full Dossier Reveal */}
      {isEntryComplete && (
        <div className="journal-subcard p-5 rounded-2xl mb-6 space-y-3 animate-fade-in">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-0.5">
                Matched Word
              </p>
              <h3 className="serif text-2xl sm:text-3xl font-black text-emerald-950">
                {currentWord.word}
              </h3>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-[#EDF5EB] border border-[#C6DEC2] px-3 py-1 rounded-full">
              {ORIGIN_EMOJI_MAP[currentWord.origin] || '🍄'} {currentWord.origin}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">
              Definition
            </p>
            <p className="serif text-sm sm:text-base font-bold text-emerald-950 leading-snug">
              {currentWord.definition}
            </p>
            {currentWord.definition2 && (
              <p className="serif text-xs sm:text-sm text-emerald-900/85 mt-1.5 border-l-2 border-emerald-500 pl-3 italic">
                {currentWord.definition2}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-[#DCE5D5] flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">
                Etymology
              </p>
              <p className="serif text-xs sm:text-sm text-emerald-900 italic leading-relaxed">
                {currentWord.etymology}
              </p>
            </div>
            {entryOutcome !== 'composted' && (
              <button
                type="button"
                onClick={handleCompostCurrent}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-stone-100 text-stone-700 border border-[#DCE5D5] text-[11px] font-bold transition-colors"
                title="Already know this word well? Move it to Compost to skip future reviews."
              >
                <Archive className="w-3 h-3" />
                <span>Move to Compost 🍂</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl mb-5 flex items-center justify-center gap-2 font-bold text-xs sm:text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : feedback.type === 'info'
              ? 'bg-amber-50 text-amber-900 border border-amber-200'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="flex gap-3">
        {!isEntryComplete ? (
          <button
            type="button"
            onClick={handleVerifyAnswer}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 sm:py-4 rounded-2xl font-bold shadow-lg active:scale-[0.99] transition-all text-sm sm:text-base"
          >
            Check Word
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextEntry}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 sm:py-4 rounded-2xl font-bold shadow-lg active:scale-[0.99] transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span>
              {currentIdx + 1 < roundWords.length ? 'Next Passage' : 'View Results'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

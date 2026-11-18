'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Word, GardenEntry, RecallOutcome, RoundEntryResult } from '../../types';
import {
  ORIGIN_EMOJI_MAP,
  getDifficultyMeta,
  getTopicMeta,
  getWordTopic,
} from '../../constants';
import { getFieldNotePassage } from '../../utils/fieldQuotes';
import { evaluateFieldNoteChoice, FieldNoteFitTier } from '../../utils/fieldAlternatives';
import { SpeakWordButton, speakWord } from '../SpeakWordButton';
import {
  DECAY_WINDOW_SECONDS,
  LETTER_HINT_PENALTY,
  NARROW_CHOICES_PENALTY,
  computeTimeScore,
  computeWordPoints,
  getDifficultyScoreMultiplier,
  getStreakMultiplier,
} from '../../utils/scoring';
import {
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Archive,
  Filter,
  Sprout,
} from 'lucide-react';

interface BotanistFieldNotesGameProps {
  roundWords: Word[];
  discoveredPool: (GardenEntry | Word)[];
  fallbackPool?: Word[];
  isScoredMode?: boolean;
  isOverlayActive?: boolean;
  onRecordOutcome: (word: Word, outcome: RecallOutcome) => RoundEntryResult;
  onCompleteRound: (results: RoundEntryResult[]) => void;
  onSwitchToSeedSprout?: () => void;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
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

function buildTenWordChoices(
  targetWord: Word,
  primaryPool: (GardenEntry | Word)[],
  fallbackPool: Word[]
): (GardenEntry | Word)[] {
  const targetLower = targetWord.word.toLowerCase();
  const seed = hashSeed(targetLower);
  const picked: (GardenEntry | Word)[] = [targetWord];
  const used = new Set<string>([targetLower]);

  const tryAdd = (w: GardenEntry | Word) => {
    if (picked.length >= 10) return;
    const key = w.word.toLowerCase();
    if (used.has(key)) return;
    used.add(key);
    picked.push(w);
  };

  // Deduplicate combined candidates while keeping deterministic rotation
  const dedupedPrimary = primaryPool.filter(
    (w) => !(w as GardenEntry).isComposted && w.word.toLowerCase() !== targetLower
  );

  // Include up to 2 valid strong/plausible alternatives from the pool when available
  const altMatches = dedupedPrimary
    .map((w) => ({ w, ev: evaluateFieldNoteChoice(targetWord, w.word) }))
    .filter((x) => x.ev.tier === 'strong' || x.ev.tier === 'plausible')
    .sort((a, b) => {
      if (a.ev.scoreMultiplier !== b.ev.scoreMultiplier) {
        return b.ev.scoreMultiplier - a.ev.scoreMultiplier;
      }
      return (hashSeed(a.w.word) ^ seed) - (hashSeed(b.w.word) ^ seed);
    });
  for (const m of altMatches.slice(0, 2)) {
    tryAdd(m.w);
  }

  const sortByRelevanceAndSeed = (items: (GardenEntry | Word)[]) =>
    [...items].sort((a, b) => {
      const aForm = a.form.toLowerCase() === targetWord.form.toLowerCase() ? 0 : 1;
      const bForm = b.form.toLowerCase() === targetWord.form.toLowerCase() ? 0 : 1;
      if (aForm !== bForm) return aForm - bForm;

      const aTopic = getWordTopic(a) === getWordTopic(targetWord) ? 0 : 1;
      const bTopic = getWordTopic(b) === getWordTopic(targetWord) ? 0 : 1;
      if (aTopic !== bTopic) return aTopic - bTopic;

      const aTier = a.seed === targetWord.seed ? 0 : 1;
      const bTier = b.seed === targetWord.seed ? 0 : 1;
      if (aTier !== bTier) return aTier - bTier;

      return ((hashSeed(a.word.toLowerCase()) ^ seed) % 1000) -
        ((hashSeed(b.word.toLowerCase()) ^ seed) % 1000);
    });

  for (const w of sortByRelevanceAndSeed(dedupedPrimary)) {
    if (picked.length >= 10) break;
    tryAdd(w);
  }

  // If fewer than 10 discovered words exist, pad up to 10 from the active lexicon
  if (picked.length < 10 && fallbackPool.length > 0) {
    const remainingFallback = fallbackPool.filter(
      (w) => !used.has(w.word.toLowerCase())
    );
    for (const w of sortByRelevanceAndSeed(remainingFallback)) {
      if (picked.length >= 10) break;
      tryAdd(w);
    }
  }

  return picked.sort((a, b) => a.word.localeCompare(b.word));
}

export const BotanistFieldNotesGame: React.FC<BotanistFieldNotesGameProps> = ({
  roundWords,
  discoveredPool,
  fallbackPool = [],
  isScoredMode = false,
  isOverlayActive = false,
  onRecordOutcome,
  onCompleteRound,
  onSwitchToSeedSprout,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWord, setSelectedWord] = useState('');
  const [triedWords, setTriedWords] = useState<Set<string>>(new Set());

  // Choice Narrowing (10 -> 5 words)
  const [narrowedWords, setNarrowedWords] = useState<string[] | null>(null);
  const [usedAssistedHint, setUsedAssistedHint] = useState(false);

  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isEntryComplete, setIsEntryComplete] = useState(false);
  const [entryOutcome, setEntryOutcome] = useState<RecallOutcome | null>(null);
  const [acceptedMatch, setAcceptedMatch] = useState<{
    chosenWord: string;
    tier: FieldNoteFitTier;
    scoreMultiplier: number;
  } | null>(null);
  const [roundScore, setRoundScore] = useState(0);
  const [cleanStreak, setCleanStreak] = useState(0);
  const [wordElapsedSec, setWordElapsedSec] = useState(0);
  const [wordPenaltyPts, setWordPenaltyPts] = useState(0);
  const [lastEarnedPts, setLastEarnedPts] = useState<number | null>(null);
  const [animation, setAnimation] = useState<'wrong' | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [roundResults, setRoundResults] = useState<RoundEntryResult[]>([]);

  const bankRef = useRef<HTMLDivElement | null>(null);
  const currentWord = roundWords[currentIdx];

  const primaryOptionPool = useMemo(() => {
    const map = new Map<string, GardenEntry | Word>();
    discoveredPool.forEach((entry) => {
      if (!(entry as GardenEntry).isComposted) {
        map.set(entry.word.toLowerCase(), entry);
      }
    });
    roundWords.forEach((w) => {
      const key = w.word.toLowerCase();
      if (!map.has(key)) {
        map.set(key, w);
      }
    });
    return Array.from(map.values());
  }, [discoveredPool, roundWords]);

  const tenWordOptions = useMemo(() => {
    if (!currentWord) return [];
    return buildTenWordChoices(currentWord, primaryOptionPool, fallbackPool);
  }, [currentWord, primaryOptionPool, fallbackPool]);

  const visibleOptions = useMemo(() => {
    if (!narrowedWords) return tenWordOptions;
    const narrowedSet = new Set(narrowedWords.map((w) => w.toLowerCase()));
    return tenWordOptions.filter((item) => narrowedSet.has(item.word.toLowerCase()));
  }, [tenWordOptions, narrowedWords]);

  const resetEntryState = useCallback(() => {
    setSelectedWord('');
    setTriedWords(new Set());
    setNarrowedWords(null);
    setUsedAssistedHint(false);
    setWrongAttempts(0);
    setIsEntryComplete(false);
    setEntryOutcome(null);
    setAcceptedMatch(null);
    setWordElapsedSec(0);
    setWordPenaltyPts(0);
    setLastEarnedPts(null);
    setAnimation(null);
    setFeedback(null);
  }, []);

  useEffect(() => {
    setCurrentIdx(0);
    setRoundResults([]);
    setRoundScore(0);
    setCleanStreak(0);
    resetEntryState();
  }, [roundWords, resetEntryState]);

  useEffect(() => {
    if (!isScoredMode || isEntryComplete || isOverlayActive || !currentWord) return;
    const startedAt = Date.now() - wordElapsedSec * 1000;
    const id = setInterval(() => {
      const elapsed = Math.min(DECAY_WINDOW_SECONDS, (Date.now() - startedAt) / 1000);
      setWordElapsedSec(elapsed);
    }, 200);
    return () => clearInterval(id);
  }, [isScoredMode, isEntryComplete, isOverlayActive, currentWord, currentIdx]);

  useEffect(() => {
    resetEntryState();
  }, [currentIdx, resetEntryState]);

  const cleanCount = roundResults.filter((r) => r.outcome === 'clean').length;
  const assistedCount = roundResults.filter((r) => r.outcome === 'assisted').length;

  const commitOutcome = (
    outcome: RecallOutcome,
    scoreMultiplier = 1,
    chosenWord?: string,
    tier: FieldNoteFitTier = 'exact'
  ) => {
    const baseResult = onRecordOutcome(currentWord, outcome);
    let earned: number | undefined;
    if (isScoredMode) {
      const solved = outcome === 'clean' || outcome === 'assisted';
      const rawEarned = computeWordPoints({
        elapsedSeconds: wordElapsedSec,
        penaltyPoints: wordPenaltyPts,
        wordOrSeed: currentWord,
        cleanStreak,
        solved,
      });
      earned = solved ? Math.round(rawEarned * scoreMultiplier) : rawEarned;
      setLastEarnedPts(earned);
      setRoundScore((prev) => prev + (earned || 0));
      setCleanStreak((prev) =>
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
    setEntryOutcome(outcome);
    setAcceptedMatch(
      chosenWord && (outcome === 'clean' || outcome === 'assisted')
        ? { chosenWord, tier, scoreMultiplier }
        : null
    );
    setIsEntryComplete(true);
  };

  const handleSelectWord = (wordStr: string) => {
    if (isEntryComplete || triedWords.has(wordStr.toLowerCase())) return;
    setSelectedWord(wordStr);
    setFeedback(null);
  };

  const handleNarrowOptions = () => {
    if (isEntryComplete || narrowedWords || tenWordOptions.length <= 5 || !currentWord) return;
    setUsedAssistedHint(true);
    setWordPenaltyPts((prev) => prev + NARROW_CHOICES_PENALTY);
    const targetLower = currentWord.word.toLowerCase();

    const untriedOthers = tenWordOptions.filter(
      (w) => w.word.toLowerCase() !== targetLower && !triedWords.has(w.word.toLowerCase())
    );
    const orderedDistractors = untriedOthers
      .sort((a, b) => {
        const evA = evaluateFieldNoteChoice(currentWord, a.word).tier;
        const evB = evaluateFieldNoteChoice(currentWord, b.word).tier;
        const rank = (t: FieldNoteFitTier) => (t === 'strong' ? 0 : t === 'plausible' ? 1 : 2);
        if (rank(evA) !== rank(evB)) return rank(evA) - rank(evB);
        const aSameForm = a.form.toLowerCase() === currentWord.form.toLowerCase() ? 0 : 1;
        const bSameForm = b.form.toLowerCase() === currentWord.form.toLowerCase() ? 0 : 1;
        if (aSameForm !== bSameForm) return aSameForm - bSameForm;
        return a.word.localeCompare(b.word);
      })
      .slice(0, 4)
      .map((w) => w.word);

    const subset = [currentWord.word, ...orderedDistractors].sort((a, b) =>
      a.localeCompare(b)
    );
    const subsetLower = new Set(subset.map((w) => w.toLowerCase()));
    if (selectedWord && !subsetLower.has(selectedWord.toLowerCase())) {
      setSelectedWord('');
    }
    setNarrowedWords(subset);
    setFeedback({
      type: 'info',
      text: `Narrowed choices down to ${subset.length} words.`,
    });
  };

  const handleGiveUp = () => {
    if (isEntryComplete || !currentWord) return;
    setSelectedWord(currentWord.word);
    commitOutcome('missed');
    setFeedback({
      type: 'info',
      text: `The word was "${currentWord.word}". Queued for spaced-repetition review.`,
    });
  };

  const handleCompostCurrent = () => {
    if (!currentWord) return;
    setSelectedWord(currentWord.word);
    commitOutcome('composted');
    setFeedback({
      type: 'info',
      text: `Moved "${currentWord.word}" to Compost — excluded from future rounds and flashcards.`,
    });
  };

  const handleVerifyAnswer = (overrideCandidate?: string) => {
    if (isEntryComplete || !currentWord) return;
    const candidate = (overrideCandidate ?? selectedWord).trim();
    if (!candidate) {
      setFeedback({
        type: 'error',
        text: 'Select a word from the choices below before checking.',
      });
      return;
    }

    const candidateLower = candidate.toLowerCase();
    const matchedOption = visibleOptions.find(
      (opt) => opt.word.toLowerCase() === candidateLower
    );
    const displayCandidate = matchedOption ? matchedOption.word : candidate;
    const evaluation = evaluateFieldNoteChoice(currentWord, candidateLower);

    if (evaluation.tier === 'exact') {
      const outcome: RecallOutcome =
        wrongAttempts === 0 && !usedAssistedHint ? 'clean' : 'assisted';
      commitOutcome(outcome, 1, currentWord.word, 'exact');
      setFeedback({
        type: 'success',
        text:
          outcome === 'clean'
            ? `Spot on! "${currentWord.word}" fits this passage cleanly 🌿`
            : `Correct! "${currentWord.word}" reinforced in your Garden 🌱`,
      });
    } else if (evaluation.tier === 'strong') {
      commitOutcome('assisted', evaluation.scoreMultiplier, displayCandidate, 'strong');
      setFeedback({
        type: 'success',
        text: `Strong contextual fit! "${displayCandidate}" works naturally here — the original passage used "${currentWord.word}".`,
      });
    } else if (evaluation.tier === 'plausible') {
      commitOutcome('assisted', evaluation.scoreMultiplier, displayCandidate, 'plausible');
      setFeedback({
        type: 'info',
        text: `Plausible alternative! "${displayCandidate}" works in this frame, though "${currentWord.word}" fits more precisely.`,
      });
    } else {
      setWrongAttempts((prev) => prev + 1);
      setWordPenaltyPts((prev) => prev + LETTER_HINT_PENALTY);
      setTriedWords((prev) => {
        const next = new Set(prev);
        next.add(candidateLower);
        return next;
      });
      setSelectedWord('');
      setAnimation('wrong');
      setTimeout(() => setAnimation(null), 500);
      setFeedback({
        type: 'error',
        text:
          tenWordOptions.length > 5 && !narrowedWords
            ? `"${candidate}" doesn't fit this passage — pick another word or narrow to 5 choices below.`
            : `"${candidate}" doesn't fit this passage — try another word below.`,
      });
    }
  };

  const handleNextEntry = () => {
    if (currentIdx + 1 < roundWords.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onCompleteRound(roundResults);
    }
  };

  useEffect(() => {
    if (isOverlayActive || !currentWord) return;
    const onGlobalKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';
      if (inInput) return;

      if (isEntryComplete) {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleNextEntry();
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          speakWord(currentWord.word);
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleVerifyAnswer();
        return;
      }

      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        handleNarrowOptions();
        return;
      }

      // Keys 1-9 and 0 pick choices 1..10 directly
      if (!e.ctrlKey && !e.metaKey && !e.altKey && /^[0-9]$/.test(e.key)) {
        const idx = e.key === '0' ? 9 : Number(e.key) - 1;
        if (idx >= 0 && idx < visibleOptions.length) {
          e.preventDefault();
          handleSelectWord(visibleOptions[idx].word);
        }
      }
    };
    window.addEventListener('keydown', onGlobalKey);
    return () => window.removeEventListener('keydown', onGlobalKey);
  });

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

  const passage = getFieldNotePassage(currentWord);
  const { before, matchedForm, after } = splitSentenceAroundTarget(
    passage.quote,
    currentWord.word
  );

  return (
    <div className="w-full journal-card rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 relative overflow-hidden">
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
            {narrowedWords
              ? `Narrowed to ${visibleOptions.length} Words`
              : `Choose from ${visibleOptions.length} Words`}
          </span>
        </div>

        <div className="flex items-center gap-4 journal-subcard px-4 py-2 rounded-2xl">
          {isScoredMode && (
            <>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-700">
                  Score
                </p>
                <p className="serif text-lg sm:text-xl font-black text-amber-900 tabular-nums">
                  {roundScore}
                </p>
              </div>
              <div className="w-px h-8 bg-[#D0DDD0]" />
            </>
          )}
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

      {isScoredMode && (() => {
        const meterPct = Math.max(
          0,
          Math.min(100, computeTimeScore(wordElapsedSec) - wordPenaltyPts)
        );
        const meterBarColor =
          meterPct > 55 ? 'bg-emerald-600' : meterPct > 25 ? 'bg-amber-500' : 'bg-rose-500';
        return (
          <div className="mb-4 p-2.5 px-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <span>🏆 Scored</span>
                {isEntryComplete && lastEarnedPts !== null && (
                  <span className="px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[11px] tabular-nums">
                    +{lastEarnedPts} pts earned
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-amber-900 tabular-nums">
                <span>{getDifficultyScoreMultiplier(currentWord)}× tier</span>
                <span>·</span>
                <span>{getStreakMultiplier(cleanStreak)}× streak</span>
              </div>
            </div>
            <div
              className="w-full h-2 rounded-full bg-amber-200/70 overflow-hidden"
              aria-label="Passage score meter"
            >
              <div
                className={`h-full rounded-full transition-all duration-200 ${meterBarColor}`}
                style={{ width: `${isEntryComplete ? 0 : meterPct}%` }}
              />
            </div>
          </div>
        );
      })()}

      {/* Metadata Pills (Part of Speech & Category of the Blank) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
            Blank Expects:
          </span>
          <span className="bg-emerald-800 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {currentWord.form}
          </span>
        </div>

        {(() => {
          const diffMeta = getDifficultyMeta(currentWord);
          const topicMeta = getTopicMeta(currentWord);
          return (
            <div className="flex flex-wrap items-center gap-1.5">
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
              Select the best word below
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
              onClick={() => bankRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
              className={`inline-flex items-center gap-1.5 mx-1 px-3 py-0.5 rounded-lg border-2 not-italic font-bold transition-all text-sm sm:text-base ${
                selectedWord.trim()
                  ? 'bg-amber-50 border-emerald-700 text-emerald-950 shadow-sm'
                  : 'bg-[#FFFDF8] border-dashed border-emerald-600 text-emerald-800 hover:bg-emerald-50'
              } ${animation === 'wrong' ? 'animate-shake border-red-500 bg-red-50' : ''}`}
            >
              <span>{selectedWord.trim() || `pick ${currentWord.form}...`}</span>
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

      {/* Curated 10-Word -> 5-Word Choice Grid */}
      {!isEntryComplete && (
        <div className="mb-5" ref={bankRef}>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              {narrowedWords
                ? `Narrowed Word Choices (${visibleOptions.length})`
                : `Available Words (${visibleOptions.length})`}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700/80">
              Click to select (double-click to check)
            </span>
          </div>

          <div
            className={`grid grid-cols-2 ${
              visibleOptions.length <= 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-5'
            } gap-2`}
          >
            {visibleOptions.map((item, idx) => {
              const isTried = triedWords.has(item.word.toLowerCase());
              const isSelected =
                selectedWord.trim().toLowerCase() === item.word.toLowerCase();
              const keyLabel = idx === 9 ? '0' : String(idx + 1);

              return (
                <button
                  key={item.word}
                  type="button"
                  disabled={isTried}
                  onClick={() => handleSelectWord(item.word)}
                  onDoubleClick={() => {
                    if (!isTried) {
                      setSelectedWord(item.word);
                      handleVerifyAnswer(item.word);
                    }
                  }}
                  className={`group px-3 py-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-1.5 ${
                    isTried
                      ? 'bg-stone-100 text-stone-400 border-stone-200 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-800 text-white border-emerald-950 shadow-md scale-[1.02]'
                      : 'bg-[#FFFDF8] hover:bg-[#EDF5EB] text-emerald-950 border-[#D2DFCC] hover:border-emerald-600 shadow-sm'
                  }`}
                >
                  <span className="serif font-bold text-sm sm:text-base truncate">
                    {item.word}
                  </span>
                  <span
                    className={`hidden sm:inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black shrink-0 ${
                      isTried
                        ? 'bg-stone-200 text-stone-400'
                        : isSelected
                        ? 'bg-emerald-950/60 text-emerald-100'
                        : 'bg-[#F0F5EC] text-emerald-700 border border-[#DCE5D5]'
                    }`}
                  >
                    {keyLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Streamlined Actions & Narrow to 5 Words Toolbar */}
      {!isEntryComplete && (
        <div className="mb-6 p-3 rounded-2xl bg-[#F4F7F0] border border-[#DCE5D5] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {tenWordOptions.length > 5 && !narrowedWords && (
              <button
                type="button"
                onClick={handleNarrowOptions}
                title="Shortcut: Alt+N"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF8] hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
              >
                <Filter className="w-3.5 h-3.5 text-emerald-700" />
                <span>Narrow to 5 Words</span>
              </button>
            )}
            <span className="text-[11px] font-semibold text-emerald-800/85">
              Original match · Strong synonyms · Plausible alternatives accepted
            </span>
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
      )}

      {/* Post-Verification Full Dossier Reveal */}
      {isEntryComplete && (
        <div className="journal-subcard p-5 rounded-2xl mb-6 space-y-3 animate-fade-in">
          {acceptedMatch && acceptedMatch.tier !== 'exact' && (
            <div
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex flex-wrap items-center justify-between gap-2 ${
                acceptedMatch.tier === 'strong'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                Your accepted choice:{' '}
                <strong className="serif text-sm">{acceptedMatch.chosenWord}</strong>
                <SpeakWordButton word={acceptedMatch.chosenWord} size="xs" />
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/80 border border-current/20 text-[10px] font-black uppercase tracking-wider">
                {acceptedMatch.tier === 'strong' ? 'Strong Fit' : 'Plausible Fit'}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-0.5">
                {acceptedMatch && acceptedMatch.tier !== 'exact'
                  ? 'Original Passage Word'
                  : 'Matched Word'}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="serif text-2xl sm:text-3xl font-black text-emerald-950">
                  {currentWord.word}
                </h3>
                <SpeakWordButton word={currentWord.word} size="sm" showLabel />
              </div>
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
            onClick={() => handleVerifyAnswer()}
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
            <span className="hidden sm:inline text-[10px] font-black uppercase bg-emerald-950/50 border border-white/20 px-1.5 py-0.5 rounded">
              Enter ↵
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="hidden sm:block text-[10px] text-center text-emerald-700/80 font-semibold mt-2.5">
        Shortcuts: <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">1–0</kbd> Pick word ·{' '}
        <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">Alt+N</kbd> Narrow to 5 ·{' '}
        <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">Enter</kbd> Check / Next ·{' '}
        <kbd className="px-1 py-0.5 rounded bg-[#F4F7F0] border border-[#DCE5D5]">S</kbd> Pronounce (after check)
      </p>
    </div>
  );
};

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  GardenEntry,
  GrowthStage,
  RecallOutcome,
  RoundEntryResult,
  TopicCategory,
  Word,
} from '../../types';
import {
  ORIGIN_EMOJI_MAP,
  GROWTH_STAGE_META,
  getDifficultyMeta,
  getTopicMeta,
  getWordTopic,
} from '../../constants';
import {
  Feather,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sprout,
  ArrowRight,
  Archive,
  RotateCcw,
  Send,
  Lightbulb,
} from 'lucide-react';
import type { EvaluateSentenceResponse } from '../../app/api/evaluate-sentence/route';

export interface InYourOwnWordsPlaceholderProps {
  roundWords: Word[];
  discoveredPool: GardenEntry[];
  onRecordOutcome: (
    word: Word,
    outcome: RecallOutcome,
    userSentence?: string
  ) => RoundEntryResult;
  onCompleteRound: (results: RoundEntryResult[]) => void;
  onSwitchToSeedSprout?: () => void;
}

const TOPIC_SPARKS: Record<TopicCategory, string[]> = {
  emotions: [
    'Describe how someone reacted in a tense conversation.',
    'Write about returning to a familiar place.',
    'Show someone hiding what they really feel.',
  ],
  philosophy: [
    'Compare two views on truth or uncertainty.',
    'Apply this idea to an everyday choice.',
    'Describe a belief that changed over time.',
  ],
  biology: [
    'Describe a detail in a garden or forest.',
    'Show how a plant or animal adapts.',
    'Write about how seasons change a habitat.',
  ],
  architecture: [
    'Describe how light and stone shape a room.',
    'Contrast a grand building with a worn structure.',
    'Write about entering an unfamiliar hall or courtyard.',
  ],
  statecraft: [
    'Describe how a speech or treaty shifted events.',
    'Write about a public debate or policy decision.',
    'Contrast official promises with daily reality.',
  ],
  literature: [
    'Describe a novel, poem, or writer’s style.',
    'Write about a character’s voice or turning point.',
    'Start a short story set at dusk.',
  ],
  general: [
    'Show who did what and why it mattered.',
    'Add a "because" or "although" clause for context.',
    'Describe a specific moment from an ordinary day.',
  ],
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function computeStem(word: string): string {
  const clean = word.trim().toLowerCase();
  if (clean.length > 4) {
    return clean.replace(/(?:e|y|ing|ed|es|s)$/i, '');
  }
  return clean;
}

function findMatchedWordForm(sentence: string, targetWord: string): string | null {
  const cleanWord = targetWord.trim();
  if (!sentence.trim() || !cleanWord) return null;

  const exactRegex = new RegExp(`\\b${escapeRegExp(cleanWord)}\\b`, 'i');
  const exactMatch = sentence.match(exactRegex);
  if (exactMatch) return exactMatch[0];

  const stem = computeStem(cleanWord);
  if (stem) {
    const stemRegex = new RegExp(`\\b${escapeRegExp(stem)}[a-z'-]*\\b`, 'i');
    const stemMatch = sentence.match(stemRegex);
    if (stemMatch) return stemMatch[0];
  }

  const lowerSentence = sentence.toLowerCase();
  const idx = lowerSentence.indexOf(cleanWord.toLowerCase());
  if (idx !== -1) {
    return sentence.slice(idx, idx + cleanWord.length);
  }
  return null;
}

function normalizeForCopyCheck(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCopiedReference(sentence: string, reference?: string): boolean {
  if (!reference) return false;
  const normUser = normalizeForCopyCheck(sentence);
  const normRef = normalizeForCopyCheck(reference);
  if (!normUser || !normRef) return false;
  if (normUser === normRef) return true;
  if (normUser.length >= 20 && (normRef.includes(normUser) || normUser.includes(normRef))) {
    const shorter = Math.min(normUser.length, normRef.length);
    const longer = Math.max(normUser.length, normRef.length);
    return shorter / longer >= 0.85;
  }
  return false;
}

export const InYourOwnWordsGame: React.FC<InYourOwnWordsPlaceholderProps> = ({
  roundWords,
  discoveredPool,
  onRecordOutcome,
  onCompleteRound,
  onSwitchToSeedSprout,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [roundResults, setRoundResults] = useState<RoundEntryResult[]>([]);
  const [draftSentence, setDraftSentence] = useState('');
  const [sparkIdx, setSparkIdx] = useState<number | null>(null);
  const [showExampleHint, setShowExampleHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [revisionCount, setRevisionCount] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [precheckError, setPrecheckError] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<EvaluateSentenceResponse | null>(null);
  const [lockedOutcome, setLockedOutcome] = useState<RecallOutcome | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetComposerForWord = () => {
    setDraftSentence('');
    setSparkIdx(null);
    setShowExampleHint(false);
    setUsedHint(false);
    setRevisionCount(0);
    setIsEvaluating(false);
    setPrecheckError(null);
    setEvalResult(null);
    setLockedOutcome(null);
  };

  useEffect(() => {
    setCurrentIdx(0);
    setRoundResults([]);
    resetComposerForWord();
  }, [roundWords]);

  const gardenByWord = useMemo(() => {
    const map = new Map<string, GardenEntry>();
    discoveredPool.forEach((g) => map.set(g.word.toLowerCase(), g));
    return map;
  }, [discoveredPool]);

  const currentWord = roundWords[currentIdx];

  if (!roundWords || roundWords.length === 0 || !currentWord) {
    return (
      <div className="w-full journal-card rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 text-center">
        <span className="text-5xl block mb-4">🪶</span>
        <h2 className="serif text-2xl sm:text-3xl font-bold text-emerald-950 mb-2">
          No Discovered Words Yet
        </h2>
        <p className="text-sm text-emerald-800 max-w-md mx-auto mb-6 leading-relaxed">
          Discover words in Seed Sprout first, then practice using them in sentences here.
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

  const gardenMatch = gardenByWord.get(currentWord.word.toLowerCase());
  const stage: GrowthStage = gardenMatch?.growthStage || 'sprout';
  const stageMeta = GROWTH_STAGE_META[stage];
  const diffMeta = getDifficultyMeta(currentWord);
  const topicMeta = getTopicMeta(currentWord);
  const sparks = TOPIC_SPARKS[getWordTopic(currentWord)] || TOPIC_SPARKS.general;

  const trimmedSentence = draftSentence.trim();
  const wordCount = trimmedSentence ? trimmedSentence.split(/\s+/).filter(Boolean).length : 0;
  const matchedForm = findMatchedWordForm(draftSentence, currentWord.word);

  const cleanCount = roundResults.filter((r) => r.outcome === 'clean').length;
  const assistedCount = roundResults.filter((r) => r.outcome === 'assisted').length;

  const upsertRoundResult = (
    outcome: RecallOutcome,
    savedSentence?: string
  ): RoundEntryResult[] => {
    const result = onRecordOutcome(currentWord, outcome, savedSentence);
    const idx = roundResults.findIndex(
      (r) => r.word.toLowerCase() === currentWord.word.toLowerCase()
    );
    const nextResults =
      idx >= 0
        ? roundResults.map((r, i) => (i === idx ? result : r))
        : [...roundResults, result];
    setRoundResults(nextResults);
    setLockedOutcome(outcome);
    return nextResults;
  };

  const advanceToNextOrFinish = (latestResults: RoundEntryResult[]) => {
    if (currentIdx + 1 < roundWords.length) {
      setCurrentIdx((prev) => prev + 1);
      resetComposerForWord();
      setTimeout(() => textareaRef.current?.focus(), 60);
    } else {
      onCompleteRound(latestResults);
    }
  };

  const runClientPrecheck = (): string | null => {
    if (!trimmedSentence) {
      return `Write a sentence using "${currentWord.word}" before checking.`;
    }
    if (trimmedSentence.length > 500) {
      return 'Keep your sentence concise (500 characters or fewer).';
    }
    if (wordCount < 5) {
      return 'Write at least 5 words so your sentence provides real context.';
    }
    if (!matchedForm) {
      return `Include "${currentWord.word}" (or an inflected form) in your sentence.`;
    }
    if (
      isCopiedReference(trimmedSentence, currentWord.example) ||
      isCopiedReference(trimmedSentence, currentWord.fieldQuote)
    ) {
      return 'Write an original sentence of your own rather than copying the reference example.';
    }
    return null;
  };

  const handleEvaluateSentence = async () => {
    if (isEvaluating || lockedOutcome) return;

    const localProblem = runClientPrecheck();
    if (localProblem) {
      setPrecheckError(localProblem);
      return;
    }

    setPrecheckError(null);
    setIsEvaluating(true);

    try {
      const storedKey =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('growcabulary_gemini_key') || undefined
          : undefined;

      const res = await fetch('/api/evaluate-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: currentWord.word,
          form: currentWord.form,
          definition: currentWord.definition,
          definition2: currentWord.definition2,
          example: currentWord.example,
          fieldQuote: currentWord.fieldQuote,
          sentence: trimmedSentence,
          apiKey: storedKey,
        }),
      });

      const data = (await res.json()) as EvaluateSentenceResponse;
      if (!res.ok || data.precheckFailed) {
        setPrecheckError(data.feedback || 'Please refine your sentence and try again.');
        return;
      }

      setEvalResult(data);

      if (data.verdict === 'clean') {
        const finalOutcome: RecallOutcome =
          !usedHint && revisionCount === 0 ? 'clean' : 'assisted';
        upsertRoundResult(finalOutcome, trimmedSentence);
      }
    } catch {
      setPrecheckError('Network error while checking your sentence. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReviseSentence = () => {
    setRevisionCount((prev) => prev + 1);
    setEvalResult(null);
    setPrecheckError(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleAcceptAndContinue = () => {
    if (!evalResult) return;
    const outcome: RecallOutcome = evalResult.verdict === 'assisted' ? 'assisted' : 'missed';
    const nextResults = upsertRoundResult(
      outcome,
      outcome === 'assisted' ? trimmedSentence : undefined
    );
    advanceToNextOrFinish(nextResults);
  };

  const handleCompostCurrent = () => {
    const nextResults = upsertRoundResult('composted');
    advanceToNextOrFinish(nextResults);
  };

  const handleToggleExampleHint = () => {
    setShowExampleHint(true);
    if (!lockedOutcome) {
      setUsedHint(true);
    }
  };

  const handleCycleSpark = () => {
    setSparkIdx((prev) => (prev === null ? 0 : (prev + 1) % sparks.length));
  };

  return (
    <div className="w-full journal-card rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 relative overflow-hidden">
      {/* Top Progress Bar */}
      <div
        className="absolute top-0 left-0 h-1 bg-purple-700 transition-all duration-500 rounded-tl-2xl"
        style={{ width: `${(currentIdx / roundWords.length) * 100}%` }}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#DCE5D5]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            <Feather className="w-3.5 h-3.5" /> In Your Own Words • Specimen {currentIdx + 1} of{' '}
            {roundWords.length}
          </span>

          {/* Round Progress Dots */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F7F0] border border-[#DCE5D5]">
            {roundWords.map((rw, i) => {
              const recorded = roundResults.find(
                (r) => r.word.toLowerCase() === rw.word.toLowerCase()
              );
              const dotClass =
                recorded?.outcome === 'clean'
                  ? 'bg-emerald-600'
                  : recorded?.outcome === 'assisted'
                  ? 'bg-amber-500'
                  : recorded?.outcome === 'missed'
                  ? 'bg-sky-500'
                  : recorded?.outcome === 'composted'
                  ? 'bg-stone-400'
                  : i === currentIdx
                  ? 'bg-purple-700 ring-2 ring-purple-200'
                  : 'bg-[#CFD9C8]';
              return (
                <span
                  key={rw.word}
                  title={rw.word}
                  className={`w-2 h-2 rounded-full transition-all ${dotClass}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 journal-subcard px-3.5 py-1.5 rounded-2xl">
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
                Clean
              </p>
              <p className="serif text-base sm:text-lg font-black text-emerald-900 tabular-nums">
                {cleanCount}
              </p>
            </div>
            <div className="w-px h-7 bg-[#D0DDD0]" />
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
                Completed
              </p>
              <p className="serif text-base sm:text-lg font-black text-emerald-900 tabular-nums">
                {cleanCount + assistedCount}/{roundWords.length}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompostCurrent}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-[11px] font-bold transition-colors"
            title="Already know this word well? Move it to Compost to skip future reviews."
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Compost 🍂</span>
          </button>
        </div>
      </div>

      {/* Target Specimen Prompt Card */}
      <div className="journal-subcard p-4 sm:p-6 rounded-2xl mb-5 border-2 border-[#DCE5D5]">
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
            {currentWord.form}
          </span>
          <span className="text-[10px] font-black text-emerald-800 bg-[#EDF5EB] border border-[#C6DEC2] px-2.5 py-0.5 rounded-full uppercase">
            {ORIGIN_EMOJI_MAP[currentWord.origin] || '🍄'} {currentWord.origin}
          </span>
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
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${stageMeta.badgeClass}`}
          >
            {stageMeta.emoji} {stageMeta.label}
          </span>
        </div>

        <h2 className="serif text-3xl sm:text-4xl font-black text-emerald-950 mb-1.5">
          {currentWord.word}
        </h2>
        <p className="serif text-sm sm:text-base font-semibold text-emerald-900 leading-snug">
          {currentWord.definition}
        </p>
        {currentWord.definition2 && (
          <p className="serif text-xs sm:text-sm text-emerald-800/85 italic mt-1.5 border-l-2 border-emerald-500 pl-3">
            {currentWord.definition2}
          </p>
        )}

        {gardenMatch?.userSentence && (
          <div className="mt-3 pt-3 border-t border-[#E0E8DA] text-xs text-purple-900">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block mb-0.5">
              Previously written by you
            </span>
            <p className="serif italic">&ldquo;{gardenMatch.userSentence}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Optional Spark & Assisted Example Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={handleCycleSpark}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-purple-700" />
          <span>{sparkIdx === null ? '💡 Prompt Idea' : '💡 Another Idea'}</span>
        </button>

        {!showExampleHint && (
          <button
            type="button"
            onClick={handleToggleExampleHint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#FCF7EA] hover:bg-amber-100 text-amber-900 border border-[#DFCCA4] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>📖 Show Example &amp; Roots (Assisted)</span>
          </button>
        )}
      </div>

      {/* Prompt Idea Banner */}
      {sparkIdx !== null && (
        <div className="mb-4 p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs sm:text-sm text-purple-950 animate-fade-in">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 block mb-0.5">
            Prompt Idea ({topicMeta.label})
          </span>
          <p className="font-medium leading-relaxed">{sparks[sparkIdx % sparks.length]}</p>
        </div>
      )}

      {/* Optional Revealed Example & Etymology Hint */}
      {showExampleHint && (
        <div className="mb-4 p-3.5 rounded-2xl bg-[#FCF7EA] border border-[#E5D5B2] space-y-2 animate-fade-in">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block mb-0.5">
              Reference Example (Do Not Copy)
            </span>
            <p className="serif text-xs sm:text-sm text-amber-950 italic leading-relaxed">
              &ldquo;{currentWord.example}&rdquo;
            </p>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block mb-0.5">
              Etymology
            </span>
            <p className="serif text-xs text-amber-900 italic leading-relaxed">
              {currentWord.etymology}
            </p>
          </div>
        </div>
      )}

      {/* Sentence Composer */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="own-words-composer"
            className="block text-[10px] font-black uppercase tracking-widest text-emerald-800"
          >
            Write a sentence
          </label>
          {revisionCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              Revision #{revisionCount} (counts as Assisted)
            </span>
          )}
        </div>

        <textarea
          id="own-words-composer"
          ref={textareaRef}
          rows={3}
          maxLength={500}
          disabled={Boolean(lockedOutcome) || isEvaluating || Boolean(evalResult)}
          value={draftSentence}
          onChange={(e) => {
            setDraftSentence(e.target.value);
            if (precheckError) setPrecheckError(null);
          }}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              handleEvaluateSentence();
            }
          }}
          placeholder={`Use "${currentWord.word}" in a sentence...`}
          className="w-full p-3.5 rounded-xl bg-[#FAF7EE] border-2 border-[#C8D8C2] focus:border-purple-700 focus:bg-[#FFFDF8] disabled:opacity-80 outline-none serif text-sm sm:text-base text-emerald-950 resize-none transition-colors"
        />

        {/* Zero-Token Client Gatekeeper Status Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full border ${
                matchedForm
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-[#F4F7F0] text-emerald-800 border-[#DCE5D5]'
              }`}
            >
              {matchedForm ? `✓ Uses "${matchedForm}"` : `Include "${currentWord.word}"`}
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full border ${
                wordCount >= 5
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-[#F4F7F0] text-emerald-800 border-[#DCE5D5]'
              }`}
            >
              {wordCount}/5+ words
            </span>
          </div>

          <span className="text-[10px] font-semibold text-emerald-700 tabular-nums">
            {trimmedSentence.length}/500
          </span>
        </div>
      </div>

      {/* Precheck Error Nudge */}
      {precheckError && (
        <div className="p-3.5 rounded-xl mb-4 bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
          <span>{precheckError}</span>
        </div>
      )}

      {/* Evaluation Card */}
      {evalResult && (
        <div
          className={`p-4 sm:p-5 rounded-2xl mb-5 border-2 space-y-3 animate-fade-in ${
            evalResult.verdict === 'clean'
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : evalResult.verdict === 'assisted'
              ? 'bg-amber-50/90 border-amber-300 text-amber-950'
              : 'bg-sky-50/90 border-sky-300 text-sky-950'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider">
              {evalResult.verdict === 'clean' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>
                    {lockedOutcome === 'clean' ? 'Good usage' : 'Good usage (Assisted)'}
                  </span>
                </>
              ) : evalResult.verdict === 'assisted' ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Needs clearer context</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-sky-700" />
                  <span>Incorrect usage</span>
                </>
              )}
            </div>

            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/80 border border-current/15">
              {evalResult.source === 'gemini' ? '✨ Gemini Usage Check' : '📋 Local Usage Rubric'}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium leading-relaxed">{evalResult.feedback}</p>

          {evalResult.suggestedRevision && (
            <div className="p-3 rounded-xl bg-white/80 border border-black/10">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70 block mb-1">
                Suggested Refinement
              </span>
              <p className="serif text-xs sm:text-sm italic leading-relaxed">
                &ldquo;{evalResult.suggestedRevision}&rdquo;
              </p>
            </div>
          )}

          {evalResult.warning && (
            <p className="text-[10px] opacity-75 italic">{evalResult.warning}</p>
          )}
        </div>
      )}

      {/* Action Footer */}
      {!evalResult && !lockedOutcome ? (
        <button
          type="button"
          disabled={isEvaluating}
          onClick={handleEvaluateSentence}
          className="w-full py-3.5 sm:py-4 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white rounded-2xl font-bold shadow-lg active:scale-[0.99] transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{isEvaluating ? 'Evaluating Usage...' : 'Check Sentence'}</span>
        </button>
      ) : lockedOutcome ? (
        <button
          type="button"
          onClick={() => advanceToNextOrFinish(roundResults)}
          className="w-full py-3.5 sm:py-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold shadow-lg active:scale-[0.99] transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <span>
            {currentIdx + 1 < roundWords.length ? 'Next Word' : 'Complete Round'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleReviseSentence}
            className="flex-1 py-3.5 px-5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Revise Sentence ✍️</span>
          </button>

          <button
            type="button"
            onClick={handleAcceptAndContinue}
            className="py-3.5 px-5 bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>
              {currentIdx + 1 < roundWords.length
                ? 'Accept & Continue'
                : 'Accept & Finish Round'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export const InYourOwnWordsPlaceholder = InYourOwnWordsGame;

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Word } from '../../types';
import { ORIGIN_EMOJI_MAP } from '../../constants';
import { getSafeEtymologyHint } from '../../utils/etymology';
import {
  buildScrambledLetterPool,
  getFirstAndLastAlphaIndices,
  normalizeCharForCompare,
  ScrambledTile,
} from '../../utils/wordHints';
import {
  Archive,
  BookOpen,
  Eye,
  LayoutGrid,
  Lightbulb,
  RotateCcw,
  Sparkles,
  WholeWord,
} from 'lucide-react';

interface WordHintToolbarProps {
  currentWord: Word;
  guess: string[];
  revealedIndices: Set<number>;
  isComplete: boolean;
  showDefinitionOption?: boolean;
  definitionUnlocked?: boolean;
  onUnlockDefinition?: () => void;
  etymologyUnlocked: boolean;
  onUnlockEtymology: () => void;
  onRevealIndices: (indices: number[], kind: 'letter' | 'first-last') => void;
  letterBankActive: boolean;
  onToggleLetterBank: () => void;
  onPickLetterFromBank: (char: string) => void;
  onRemoveLetterFromBank: (char: string) => void;
  onClearTypedGuess: () => void;
  onRevealAnswer: () => void;
  onCompost: () => void;
}

export const WordHintToolbar: React.FC<WordHintToolbarProps> = ({
  currentWord,
  guess,
  revealedIndices,
  isComplete,
  showDefinitionOption = false,
  definitionUnlocked = false,
  onUnlockDefinition,
  etymologyUnlocked,
  onUnlockEtymology,
  onRevealIndices,
  letterBankActive,
  onToggleLetterBank,
  onPickLetterFromBank,
  onRemoveLetterFromBank,
  onClearTypedGuess,
  onRevealAnswer,
  onCompost,
}) => {
  const [tilePool, setTilePool] = useState<ScrambledTile[]>([]);

  useEffect(() => {
    setTilePool(buildScrambledLetterPool(currentWord.word));
  }, [currentWord.word]);

  const firstLastIndices = useMemo(
    () => getFirstAndLastAlphaIndices(currentWord.word),
    [currentWord.word]
  );
  const firstLastAlreadyShown = firstLastIndices.every((idx) => revealedIndices.has(idx));

  // Count placed/revealed letters so tiles in Letter Bank visually dim as they are placed
  const placedCharCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (let i = 0; i < currentWord.word.length; i++) {
      const ch = revealedIndices.has(i) ? currentWord.word[i] : guess[i] || '';
      if (!ch) continue;
      const norm = normalizeCharForCompare(ch);
      counts.set(norm, (counts.get(norm) || 0) + 1);
    }
    return counts;
  }, [currentWord.word, guess, revealedIndices]);

  const tileStates = useMemo(() => {
    const consumed = new Map<string, number>();
    return tilePool.map((tile) => {
      const norm = normalizeCharForCompare(tile.char);
      const placed = placedCharCounts.get(norm) || 0;
      const seen = consumed.get(norm) || 0;
      const isUsed = seen < placed;
      if (isUsed) consumed.set(norm, seen + 1);
      return { tile, isUsed };
    });
  }, [tilePool, placedCharCounts]);

  const safeEtymologyHint = useMemo(
    () => getSafeEtymologyHint(currentWord),
    [currentWord]
  );

  if (isComplete) return null;

  return (
    <div className="space-y-4">
      {/* Row 1: Primary Clue & Interactive Helper Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {showDefinitionOption && (
          <button
            type="button"
            disabled={definitionUnlocked}
            onClick={onUnlockDefinition}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
              definitionUnlocked
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 cursor-default'
                : 'bg-[#F4F7F0] hover:bg-[#E4EFE0] text-emerald-900 border-[#C6DEC2] shadow-sm'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>{definitionUnlocked ? 'Definition Shown' : 'Definition Clue'}</span>
          </button>
        )}

        <button
          type="button"
          disabled={etymologyUnlocked}
          onClick={onUnlockEtymology}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
            etymologyUnlocked
              ? 'bg-amber-100 text-amber-950 border-amber-300 cursor-default'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>{etymologyUnlocked ? 'Etymology Shown' : 'Etymology Hint'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleLetterBank}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
            letterBankActive
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-[#FFFDF8] hover:bg-[#EDF5EB] text-emerald-900 border-[#C8D8C2] shadow-sm'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{letterBankActive ? 'Hide Letter Tiles' : 'Letter Tiles'}</span>
        </button>

        <button
          type="button"
          disabled={firstLastAlreadyShown}
          onClick={() => onRevealIndices(firstLastIndices, 'first-last')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
            firstLastAlreadyShown
              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
              : 'bg-[#F4F7F0] hover:bg-[#E6EFE2] text-emerald-800 border-[#DCE5D5] shadow-sm'
          }`}
        >
          <WholeWord className="w-3.5 h-3.5 text-emerald-600" />
          <span>First &amp; Last</span>
        </button>

        <button
          type="button"
          onClick={() => onRevealIndices([], 'letter')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F4F7F0] hover:bg-[#E6EFE2] text-emerald-800 border border-[#DCE5D5] text-xs font-bold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reveal 1 Letter</span>
        </button>
      </div>

      {/* Row 2: Reveal Answer & Compost */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onRevealAnswer}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-emerald-700/80 hover:text-emerald-950 hover:bg-[#F4F7F0] text-[11px] font-semibold transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Reveal Answer</span>
        </button>

        <button
          type="button"
          onClick={onCompost}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-[11px] font-semibold transition-all"
          title="Ignore this word in future rounds and flashcards"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Already Know · Compost 🍂</span>
        </button>
      </div>

      {/* Expanded Definition Clue Panel (Field Notes) */}
      {showDefinitionOption && definitionUnlocked && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#EDF5EB] border border-[#C6DEC2] animate-fade-in">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-1">
            📖 Definition Clue
          </p>
          <p className="serif text-sm sm:text-base font-bold text-emerald-950 leading-snug">
            {currentWord.definition}
          </p>
          {currentWord.definition2 && (
            <p className="serif text-xs sm:text-sm text-emerald-900/85 mt-1.5 border-l-2 border-emerald-600 pl-3 italic">
              {currentWord.definition2}
            </p>
          )}
        </div>
      )}

      {/* Expanded Etymology Hint Panel */}
      {etymologyUnlocked && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FCF7EA] border border-[#E8D8B5] animate-fade-in">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 flex items-center gap-1.5">
              💡 Etymology Hint ({ORIGIN_EMOJI_MAP[currentWord.origin] || '🍄'}{' '}
              {currentWord.origin})
            </span>
            <span className="text-[10px] font-bold text-amber-700">
              Similar root spellings masked [•••]
            </span>
          </div>
          <p className="serif text-xs sm:text-sm text-amber-950 italic leading-relaxed">
            {safeEtymologyHint}
          </p>
        </div>
      )}

      {/* Expanded Interactive Letter Bank Tray */}
      {letterBankActive && tileStates.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#F4F7F0] border border-[#DCE5D5] animate-fade-in">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
              🧩 Available Letters — Tap to fill boxes (tap faded tile to remove)
            </span>
            <button
              type="button"
              onClick={onClearTypedGuess}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-950 px-2 py-0.5 rounded-full hover:bg-white/70"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {tileStates.map(({ tile, isUsed }) => (
              <button
                key={tile.id}
                type="button"
                onClick={() =>
                  isUsed
                    ? onRemoveLetterFromBank(tile.char)
                    : onPickLetterFromBank(tile.char)
                }
                className={`w-9 h-10 sm:w-10 sm:h-11 rounded-xl border-2 font-black uppercase serif text-base sm:text-lg transition-all ${
                  isUsed
                    ? 'bg-emerald-100/70 border-emerald-200 text-emerald-400 hover:text-emerald-700 hover:border-emerald-300'
                    : 'bg-[#FFFDF8] border-[#BBD0B5] text-emerald-950 hover:border-emerald-600 hover:bg-[#EDF5EB] shadow-sm active:scale-95'
                }`}
              >
                {tile.char}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Word, SeedType, GardenEntry, RoundProgress } from './types';
import { 
  WORD_BANKS, 
  NICHE_BANKS,
  ORIGIN_EMOJI_MAP, 
  INITIAL_SCORE, 
  WRONG_GUESS_PENALTY, 
  WORDS_PER_ROUND,
  BOTANICAL_RANKS
} from './constants';
import { RAW_WORDS } from './utils/data';

const App: React.FC = () => {
  // Persistence Migration & Initialization
  const migrateSeedType = (oldType: string): SeedType => {
    // Legacy migration logic from original Uncommon/Rare/Exotic or other older tags
    if (oldType === 'uncommon') return 'garden';
    if (oldType === 'rare') return 'meadow';
    if (oldType === 'exotic') return 'conservatory';
    // Deep legacy fallback if data was swapped before
    if (oldType === 'meadow' && !NICHE_BANKS.find(b => b.type === 'meadow')) return 'garden'; 
    return oldType as SeedType;
  };

  // Game State
  const [selectedSeed, setSelectedSeed] = useState<SeedType | null>(() => {
    const saved = localStorage.getItem('growcabulary_selected_seed');
    return saved ? migrateSeedType(saved) : null;
  });
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [remainingWords, setRemainingWords] = useState<Word[]>([]);
  const [guess, setGuess] = useState<string[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState(0);
  const [nextRevealTime, setNextRevealTime] = useState(5);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState<'success' | 'failure' | 'wrong' | null>(null);
  
  const [streak, setStreak] = useState<number>(() => Number(localStorage.getItem('growcabulary_streak') || 0));

  // Persistence & Progress
  const [categoryHighScores, setCategoryHighScores] = useState<Record<SeedType, number>>(() => {
    const saved = localStorage.getItem('growcabulary_category_highscores');
    const defaults = { garden: 0, meadow: 0, conservatory: 0, philosophy: 0, emotions: 0, biology: 0, architecture: 0 };
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate legacy keys if they exist in save data
      return {
        garden: parsed.garden ?? parsed.uncommon ?? 0,
        meadow: parsed.meadow ?? parsed.rare ?? 0,
        conservatory: parsed.conservatory ?? parsed.exotic ?? 0,
        philosophy: parsed.philosophy ?? 0,
        emotions: parsed.emotions ?? 0,
        biology: parsed.biology ?? 0,
        architecture: parsed.architecture ?? 0
      };
    }
    return defaults;
  });

  const [playedWords, setPlayedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('growcabulary_played_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [gardenList, setGardenList] = useState<GardenEntry[]>(() => {
    const saved = localStorage.getItem('growcabulary_garden');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [roundProgress, setRoundProgress] = useState<Record<SeedType, RoundProgress>>(() => {
    const saved = localStorage.getItem('growcabulary_progress');
    const defaultRoundProgress = { currentRound: 1, scores: [], completedWordsCount: 0 };
    const initial = {
      garden: { ...defaultRoundProgress },
      meadow: { ...defaultRoundProgress },
      conservatory: { ...defaultRoundProgress },
      philosophy: { ...defaultRoundProgress },
      emotions: { ...defaultRoundProgress },
      biology: { ...defaultRoundProgress },
      architecture: { ...defaultRoundProgress }
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        garden: parsed.garden ?? parsed.uncommon ?? { ...defaultRoundProgress },
        meadow: parsed.meadow ?? parsed.rare ?? { ...defaultRoundProgress },
        conservatory: parsed.conservatory ?? parsed.exotic ?? { ...defaultRoundProgress },
        philosophy: parsed.philosophy ?? { ...defaultRoundProgress },
        emotions: parsed.emotions ?? { ...defaultRoundProgress },
        biology: parsed.biology ?? { ...defaultRoundProgress },
        architecture: parsed.architecture ?? { ...defaultRoundProgress }
      };
    }
    return initial;
  });

  // UI State
  const [showWelcome, setShowWelcome] = useState(!selectedSeed);
  const [showMenu, setShowMenu] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [gardenPracticeMode, setGardenPracticeMode] = useState(false);
  const [revealedGardenWords, setRevealedGardenWords] = useState<Set<string>>(new Set());
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [currentRoundScore, setCurrentRoundScore] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ show: false, title: "", message: "", action: () => {} });

  const nextRevealTimeRef = useRef(5);

  const currentWord = remainingWords[currentWordIndex];
  const userRank = [...BOTANICAL_RANKS].reverse().find(r => gardenList.length >= r.min) || BOTANICAL_RANKS[0];

  const completionStats = useMemo(() => {
    const stats: Record<SeedType, number> = { garden: 0, meadow: 0, conservatory: 0, philosophy: 0, emotions: 0, biology: 0, architecture: 0 };
    (Object.keys(stats) as SeedType[]).forEach(type => {
      const totalInCategory = RAW_WORDS.filter(w => w.seed === type).length;
      if (totalInCategory === 0) return;
      const playedInCategory = playedWords.filter(pw => 
        RAW_WORDS.find(rw => rw.word === pw && rw.seed === type)
      ).length;
      stats[type] = Math.round((playedInCategory / totalInCategory) * 100);
    });
    return stats;
  }, [playedWords]);

  const maskWordInExample = (example: string, word: string) => {
    if (!example || !word) return "";
    const stem = word.length > 3 ? word.toLowerCase().replace(/[ey]$/i, '') : word.toLowerCase();
    const regex = new RegExp(`\\b${stem}[a-z]*\\b`, 'gi');
    
    return example.replace(regex, (match) => {
      const maskLen = Math.min(match.length, word.length);
      const suffix = match.slice(maskLen);
      return '•'.repeat(maskLen) + suffix;
    });
  };

  useEffect(() => { localStorage.setItem('growcabulary_garden', JSON.stringify(gardenList)); }, [gardenList]);
  useEffect(() => { localStorage.setItem('growcabulary_progress', JSON.stringify(roundProgress)); }, [roundProgress]);
  useEffect(() => { localStorage.setItem('growcabulary_category_highscores', JSON.stringify(categoryHighScores)); }, [categoryHighScores]);
  useEffect(() => { localStorage.setItem('growcabulary_played_words', JSON.stringify(playedWords)); }, [playedWords]);
  useEffect(() => { localStorage.setItem('growcabulary_streak', String(streak)); }, [streak]);
  useEffect(() => { if (selectedSeed) localStorage.setItem('growcabulary_selected_seed', selectedSeed); }, [selectedSeed]);

  const getDynamicInterval = useCallback((len: number) => {
    if (len <= 5) return 8;
    if (len <= 8) return 6;
    if (len <= 11) return 4;
    if (len <= 14) return 3;
    return 2;
  }, []);

  const revealOneLetter = useCallback(() => {
    if (!currentWord || isRoundOver) return;
    setRevealedIndices(prev => {
      if (prev.size >= currentWord.word.length) return prev;
      let indexToReveal: number;
      if (!prev.has(0)) {
        indexToReveal = 0;
      } else {
        const unrevealed = [];
        for (let i = 0; i < currentWord.word.length; i++) {
          if (!prev.has(i)) unrevealed.push(i);
        }
        if (unrevealed.length === 0) return prev;
        indexToReveal = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      }
      const nextSet = new Set(prev);
      nextSet.add(indexToReveal);
      return nextSet;
    });
  }, [currentWord, isRoundOver]);

  const getTimeLimit = useCallback(() => {
    if (!currentWord) return 60;
    const len = currentWord.word.length;
    const interval = getDynamicInterval(len);
    return 5 + Math.max(0, len - 2) * interval;
  }, [currentWord, getDynamicInterval]);

  const getLifeForcePercentage = useCallback(() => {
    const timeLimit = getTimeLimit();
    const effectiveElapsed = timer + (wrongGuesses * WRONG_GUESS_PENALTY);
    const remaining = Math.max(0, timeLimit - effectiveElapsed);
    return (remaining / timeLimit) * 100;
  }, [timer, wrongGuesses, getTimeLimit]);

  useEffect(() => {
    if (!currentWord || isRoundOver) return;
    if (revealedIndices.has(focusedIndex)) {
      let next = focusedIndex + 1;
      while (next < currentWord.word.length && revealedIndices.has(next)) { next++; }
      if (next < currentWord.word.length) {
        setFocusedIndex(next);
      } else {
        let start = 0;
        while (start < currentWord.word.length && revealedIndices.has(start)) { start++; }
        if (start < currentWord.word.length) setFocusedIndex(start);
      }
    }
  }, [revealedIndices, focusedIndex, currentWord, isRoundOver]);

  useEffect(() => {
    if (isRoundOver || !currentWord || showWelcome) return;
    const intervalId = setInterval(() => {
      setTimer(t => {
        const nextT = t + 1;
        if (nextT >= nextRevealTimeRef.current) {
          revealOneLetter();
          const interval = getDynamicInterval(currentWord.word.length);
          nextRevealTimeRef.current = nextT + interval;
          setNextRevealTime(nextRevealTimeRef.current);
        }
        return nextT;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isRoundOver, currentWord, showWelcome, revealOneLetter, getDynamicInterval]);

  const handleFail = useCallback(() => {
    if (isRoundOver || !currentWord) return;
    setIsRoundOver(true);
    setAnimation('failure');
    setScore(0);
    setStreak(0);
    setMessage(`The word was "${currentWord.word}". 🥀`);
    if (!playedWords.includes(currentWord.word)) {
      setPlayedWords(prev => [...prev, currentWord.word]);
    }
  }, [isRoundOver, currentWord, playedWords]);

  useEffect(() => {
    if (isRoundOver || !currentWord) return;
    const penalty = wrongGuesses * WRONG_GUESS_PENALTY;
    let newScore = Math.max(0, INITIAL_SCORE - timer - penalty);
    const lifePercentage = getLifeForcePercentage();
    if (lifePercentage <= 0 || revealedIndices.size >= currentWord.word.length) {
      newScore = 0;
      handleFail();
      return;
    }
    setScore(newScore);
  }, [timer, wrongGuesses, isRoundOver, revealedIndices.size, currentWord, getLifeForcePercentage, handleFail]);

  useEffect(() => {
    if (!isRoundOver && currentWord) {
      const input = document.getElementById(`box-${focusedIndex}`) as HTMLInputElement;
      input?.focus();
    }
  }, [focusedIndex, isRoundOver, currentWord]);

  const requestResetCategory = () => {
    if (!selectedSeed) return;
    setConfirmModal({
      show: true,
      title: "Reset Category? 🍄",
      message: `Are you sure you want to clear your ${selectedSeed} progress and best score?`,
      action: () => {
        setCategoryHighScores(prev => ({ ...prev, [selectedSeed]: 0 }));
        setRoundProgress(prev => ({
          ...prev,
          [selectedSeed]: { currentRound: 1, scores: [], completedWordsCount: 0 }
        }));
        setShowMenu(false);
        setShowWelcome(true);
        setSelectedSeed(null);
        setRemainingWords([]);
        setConfirmModal(prev => ({ ...prev, show: false }));
      }
    });
  };

  const requestResetAll = () => {
    setConfirmModal({
      show: true,
      title: "Clear Garden? 🌳",
      message: "This will permanently delete ALL scores and words learned. The app will restart.",
      action: () => {
        localStorage.clear();
        window.location.reload();
      }
    });
  };

  const resetWordState = (word: Word) => {
    setGuess(Array(word.word.length).fill(''));
    setRevealedIndices(new Set());
    setTimer(0);
    nextRevealTimeRef.current = 5;
    setNextRevealTime(5);
    setScore(INITIAL_SCORE);
    setWrongGuesses(0);
    setIsRoundOver(false);
    setMessage("");
    setAnimation(null);
    setFocusedIndex(0);
  };

  const initSeedBank = async (type: SeedType) => {
    setSelectedSeed(type);
    setIsNewBest(false);
    let filtered = RAW_WORDS.filter(w => w.seed === type && !playedWords.includes(w.word));
    if (filtered.length < WORDS_PER_ROUND) {
      const allInCategory = RAW_WORDS.filter(w => w.seed === type).map(w => w.word);
      setPlayedWords(prev => prev.filter(w => !allInCategory.includes(w)));
      filtered = RAW_WORDS.filter(w => w.seed === type);
    }
    
    if (filtered.length === 0) {
      alert("No words found in this category. Returning to main menu.");
      setShowWelcome(true);
      setSelectedSeed(null);
      return;
    }

    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, WORDS_PER_ROUND);
    setRemainingWords(shuffled);
    setCurrentWordIndex(0);
    setShowWelcome(false);
    resetWordState(shuffled[0]);
    setCurrentRoundScore(0);
  };

  const handleSuccess = () => {
    if (!currentWord) return;
    setIsRoundOver(true);
    setAnimation('success');
    setStreak(prev => prev + 1);
    setMessage("Correct! 🌻");
    setCurrentRoundScore(prev => prev + score);
    if (!playedWords.includes(currentWord.word)) {
      setPlayedWords(prev => [...prev, currentWord.word]);
    }
    if (!gardenList.some(g => g.word === currentWord.word)) {
      setGardenList(prev => [...prev, { ...currentWord, dateLearned: new Date().toLocaleDateString(), score: score }]);
    }
  };

  const checkAnswer = () => {
    if (isRoundOver || !currentWord) return;
    const fullGuess = currentWord.word.split('').map((char, i) => 
      revealedIndices.has(i) ? char : (guess[i] || '')
    ).join('').toLowerCase();

    if (fullGuess === currentWord.word.toLowerCase()) {
      handleSuccess();
    } else {
      setWrongGuesses(prev => prev + 1);
      setMessage("Not quite... letter revealed! 🍂");
      setAnimation('wrong');
      setTimeout(() => setAnimation(null), 500);
      revealOneLetter();
    }
  };

  const nextWord = () => {
    if (!selectedSeed) return;
    if (currentWordIndex + 1 < remainingWords.length) {
      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      resetWordState(remainingWords[nextIdx]);
    } else {
      const finalScore = currentRoundScore;
      if (finalScore > categoryHighScores[selectedSeed]) {
        setCategoryHighScores(prev => ({ ...prev, [selectedSeed]: finalScore }));
        setIsNewBest(true);
      }
      setShowRoundResult(true);
      setRoundProgress(prev => ({
        ...prev,
        [selectedSeed]: {
          ...prev[selectedSeed],
          currentRound: (prev[selectedSeed]?.currentRound || 0) + 1,
          scores: [...(prev[selectedSeed]?.scores || []), finalScore]
        }
      }));
    }
  };

  const handleInput = (char: string, index: number) => {
    if (isRoundOver || !currentWord) return;
    const cleanChar = char.slice(-1).toLowerCase();
    if (!/^[a-z]?$/.test(cleanChar)) return;
    const newGuess = [...guess];
    newGuess[index] = cleanChar;
    setGuess(newGuess);
    if (cleanChar && index + 1 < currentWord.word.length) {
      let next = index + 1;
      while (next < currentWord.word.length && revealedIndices.has(next)) { next++; }
      if (next < currentWord.word.length) { setFocusedIndex(next); }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      if (!guess[index] && index > 0) {
        let prev = index - 1;
        while (prev >= 0 && revealedIndices.has(prev)) { prev--; }
        if (prev >= 0) { setFocusedIndex(prev); }
      } else {
        const newGuess = [...guess];
        newGuess[index] = '';
        setGuess(newGuess);
      }
    }
    if (e.key === 'Enter') { checkAnswer(); }
  };

  const toggleGardenPracticeWord = (word: string) => {
    const nextSet = new Set(revealedGardenWords);
    if (nextSet.has(word)) nextSet.delete(word);
    else nextSet.add(word);
    setRevealedGardenWords(nextSet);
  };

  const getBoxSize = (len: number) => {
    if (len >= 16) return "w-4 h-7 sm:w-8 sm:h-12 text-xs sm:text-2xl";
    if (len >= 13) return "w-5 h-8 sm:w-10 sm:h-16 text-sm sm:text-3xl";
    if (len >= 10) return "w-7 h-10 sm:w-12 sm:h-18 text-base sm:text-4xl";
    return "w-9 h-14 sm:w-16 sm:h-24 text-2xl sm:text-5xl";
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-1000 ${streak >= 10 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
      {showWelcome ? (
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 w-full overflow-y-auto">
          <div className="max-w-4xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 border border-emerald-100 relative overflow-hidden my-auto">
            
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="serif text-3xl sm:text-5xl font-bold text-emerald-800 mb-2 sm:mb-4">🌿 Growcabulary 🌿</h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                 <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-400">Rank:</span>
                 <span className="bg-emerald-800 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                   {userRank.emoji} {userRank.title}
                 </span>
              </div>
              <p className="text-xs sm:text-lg text-emerald-600 font-medium italic px-4 text-center">Cultivate your lexicon and explore word roots 🪴</p>
            </div>

            <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-3 mb-8">
              {WORD_BANKS.map(bank => (
                <button key={bank.type} onClick={() => initSeedBank(bank.type)} className="group flex flex-row sm:flex-col items-center p-3 sm:p-6 bg-emerald-50 rounded-xl sm:rounded-2xl border-2 border-transparent hover:border-emerald-500 hover:bg-emerald-100 transition-all text-left sm:text-center relative shadow-sm">
                  <span className="text-3xl sm:text-4xl mr-3 sm:mr-0 sm:mb-3 group-hover:scale-110 transition-transform">{bank.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start lg:justify-center">
                      <h3 className="font-bold text-emerald-800 text-sm sm:text-base">{bank.label}</h3>
                      <span className="text-[8px] sm:text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full font-black">{completionStats[bank.type]}%</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-emerald-600 leading-tight mb-2 line-clamp-2">{bank.description}</p>
                    <div className="inline-flex items-center gap-1.5 bg-white/50 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black text-emerald-500 uppercase tracking-tighter border border-emerald-100">
                      Best: {categoryHighScores[bank.type]}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-8 p-6 bg-amber-50/50 rounded-2xl border-2 border-amber-100">
               <h3 className="text-[10px] sm:text-xs font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <span className="text-lg">🔬</span> Specimen Collections
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {NICHE_BANKS.map(bank => (
                    <button key={bank.type} onClick={() => initSeedBank(bank.type)} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-amber-100 hover:border-amber-400 hover:shadow-md transition-all text-left group">
                       <span className="text-2xl group-hover:scale-110 transition-transform">{bank.emoji}</span>
                       <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-amber-900 text-sm">{bank.label}</h4>
                            <span className="text-[8px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded-full font-black">{completionStats[bank.type]}%</span>
                          </div>
                          <p className="text-[9px] text-amber-700 leading-tight">{bank.description}</p>
                       </div>
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex justify-center mb-10">
              <button onClick={() => setShowGarden(true)} className="px-8 py-3 bg-emerald-800 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-colors shadow-lg flex items-center gap-2">
                <span>Enter My Garden ({gardenList.length})</span> 🌸
              </button>
            </div>

            {/* How to Play Section */}
            <div className="pt-6 border-t border-emerald-50">
              <h3 className="text-center text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">How to Play 📖</h3>
              <div className="max-w-xl mx-auto text-center space-y-4 px-4">
                <p className="text-[11px] sm:text-xs font-bold text-emerald-800 leading-relaxed">
                  New letters are revealed over time and whenever a wrong guess is made. The max score per word is 60 points. Scores decrease over time and with wrong guesses. Finish the word before the timer runs out.
                </p>
                <p className="text-[11px] sm:text-xs font-bold text-emerald-800 leading-relaxed">
                  Each round is 6 words. Aim for the highest score per round! All scores and words learned are stored in your browser data. Collect more words in your garden to increase your gardener's rank.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-y-auto">
          {currentWord ? (
            <>
              <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-emerald-100 p-2 sm:p-4 shrink-0">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h1 className="serif text-lg sm:text-2xl font-bold text-emerald-800">🌿 Grow</h1>
                    <div className="bg-emerald-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold text-emerald-700 capitalize">
                      {currentWordIndex + 1}/{WORDS_PER_ROUND} 🎋
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm font-medium">
                    {streak > 0 && (
                      <div className="text-orange-600 bg-orange-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-orange-100 font-black flex items-center gap-1 animate-bounce">
                        🔥 {streak}
                      </div>
                    )}
                    <div className="text-emerald-800 bg-emerald-50 px-2 py-1 sm:px-4 sm:py-1.5 rounded-full border border-emerald-100">
                       <span className="font-bold">{currentRoundScore}</span> 🌾
                    </div>
                    <button onClick={() => setShowGarden(true)} className="px-2 py-1 sm:px-4 sm:py-2 bg-emerald-800 text-white rounded-full text-[9px] sm:text-xs font-bold shadow-sm">Garden 🌸</button>
                    <button onClick={() => setShowMenu(true)} className="p-1 sm:p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </header>

              <main className="flex-1 max-w-4xl mx-auto w-full p-2 sm:p-6 flex flex-col gap-4">
                <div className="w-full bg-white rounded-2xl sm:rounded-[2rem] shadow-xl p-4 sm:p-8 border border-emerald-100 relative overflow-hidden flex flex-col shrink-0">
                  <div className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-500" style={{ width: `${((currentWordIndex) / WORDS_PER_ROUND) * 100}%` }} />
                  
                  <div className="flex flex-col items-center gap-4 bg-emerald-50/50 p-4 sm:p-6 rounded-2xl border border-emerald-100 shadow-inner w-full mb-8">
                    <div className="w-full h-3 bg-emerald-200/30 rounded-full overflow-hidden border border-emerald-200/50">
                       <div className="h-full bg-emerald-500 transition-all duration-1000 ease-linear" style={{ width: `${getLifeForcePercentage()}%` }} />
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Points 💎</p>
                        <p className={`text-2xl sm:text-3xl font-black tabular-nums transition-all duration-300 ${score < 20 ? 'text-red-500 animate-pulse' : 'text-emerald-700'}`}>{score}</p>
                      </div>
                      <div className="w-px h-10 bg-emerald-200" />
                      <div className="text-center">
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Time ⏳</p>
                        <p className="text-xl sm:text-2xl font-bold tabular-nums text-emerald-700">{timer}s</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-8">
                    {currentWord.word.split('').map((char, i) => {
                      const isRevealed = revealedIndices.has(i);
                      return (
                        <input
                          key={i}
                          id={`box-${i}`}
                          type="text"
                          maxLength={1}
                          value={isRevealed ? char : guess[i] || ''}
                          disabled={isRevealed || isRoundOver}
                          onChange={(e) => handleInput(e.target.value, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          className={`${getBoxSize(currentWord.word.length)} border-2 rounded-lg sm:rounded-xl text-center font-black uppercase transition-all duration-300 focus:ring-4 focus:ring-emerald-500/20 outline-none
                            ${isRevealed ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-emerald-200 text-emerald-800 focus:border-emerald-500'}
                            ${animation === 'wrong' && !isRevealed && guess[i] ? 'animate-shake border-red-500' : ''}`}
                        />
                      );
                    })}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-emerald-50/50 p-4 sm:p-6 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-800 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">{currentWord.form}</span>
                        <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                          {currentWord.origin} {ORIGIN_EMOJI_MAP[currentWord.origin] || '🍄'}
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-lg font-bold text-emerald-900 leading-tight mb-4">{currentWord.definition}</h2>
                      {currentWord.definition2 && (
                        <p className="text-xs sm:text-sm text-emerald-700/80 mb-4 border-l-2 border-emerald-200 pl-3 italic">{currentWord.definition2}</p>
                      )}
                      <div className="bg-white/50 p-3 rounded-lg border border-emerald-100">
                        <p className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase mb-1">Example usage</p>
                        <p className="text-xs sm:text-sm text-emerald-800 italic leading-relaxed">"{isRoundOver ? currentWord.example : maskWordInExample(currentWord.example, currentWord.word)}"</p>
                      </div>
                      
                      {isRoundOver && (
                        <div className="mt-4 pt-4 border-t border-emerald-100/50 animate-fade-in">
                           <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest">Word Roots 🪴</p>
                           <p className="text-xs sm:text-sm text-emerald-600 italic mt-1 leading-relaxed">{currentWord.etymology}</p>
                        </div>
                      )}
                    </div>
                    
                    {message && (
                      <div className={`text-center p-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${animation === 'success' ? 'bg-emerald-100 text-emerald-800' : animation === 'failure' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {message}
                      </div>
                    )}

                    <div className="flex gap-3">
                      {!isRoundOver ? (
                        <button onClick={checkAnswer} className="flex-1 bg-emerald-800 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-900 shadow-lg active:scale-95 transition-all text-sm sm:text-base">
                          Check Word 🌿
                        </button>
                      ) : (
                        <button onClick={nextWord} className="flex-1 bg-emerald-800 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-emerald-900 shadow-lg active:scale-95 transition-all text-sm sm:text-base">
                          {currentWordIndex + 1 === WORDS_PER_ROUND ? 'View Round Result 🎋' : 'Next Word 🌻'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </main>
            </>
          ) : (
            <div className="min-h-screen flex items-center justify-center p-6 text-emerald-800 font-bold">
              Loading word bank... 🎋
            </div>
          )}
        </div>
      )}

      {/* Garden Modal */}
      {showGarden && (
        <div className="fixed inset-0 z-[60] bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-emerald-100 bg-emerald-50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="serif text-2xl font-bold text-emerald-900">My Secret Garden 🌸</h2>
                  <p className="text-xs text-emerald-600 font-medium italic">Cultivated Lexicon Archive</p>
                </div>
                <button onClick={() => setShowGarden(false)} className="p-2 hover:bg-emerald-200 rounded-full transition-colors text-emerald-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setGardenPracticeMode(!gardenPracticeMode); setRevealedGardenWords(new Set()); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border-2 ${gardenPracticeMode ? 'bg-emerald-800 border-emerald-900 text-white' : 'bg-white border-emerald-200 text-emerald-800'}`}
                  >
                    <span>{gardenPracticeMode ? 'Practice Mode: ON 🧠' : 'Practice Mode: OFF 📖'}</span>
                  </button>
                  {gardenPracticeMode && (
                    <div className="flex gap-2 animate-fade-in">
                      <button onClick={() => setRevealedGardenWords(new Set(gardenList.map(w => w.word)))} className="text-[10px] font-bold text-emerald-600 hover:underline">Reveal All</button>
                      <button onClick={() => setRevealedGardenWords(new Set())} className="text-[10px] font-bold text-emerald-600 hover:underline">Hide All</button>
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-100/50 px-3 py-1 rounded-full border border-emerald-100">
                   Total Blooms: {gardenList.length} 🎋
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-emerald-50/20">
              {gardenList.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-emerald-300">
                  <span className="text-6xl mb-4">🍂</span>
                  <p className="text-lg font-bold">Your garden is currently empty.</p>
                  <p className="text-sm">Start playing to plant some words!</p>
                </div>
              ) : (
                gardenList.map((word, idx) => {
                  const isWordRevealed = !gardenPracticeMode || revealedGardenWords.has(word.word);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => gardenPracticeMode && toggleGardenPracticeWord(word.word)}
                      className={`bg-white border-2 rounded-2xl p-4 transition-all relative overflow-hidden flex flex-col
                        ${isWordRevealed ? 'border-emerald-100 hover:border-emerald-500' : 'border-emerald-200/50 bg-emerald-50/30 cursor-pointer group'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[9px] font-black uppercase text-emerald-300 tracking-tighter">Learned {word.dateLearned}</span>
                         <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">{word.seed}</span>
                      </div>
                      
                      <div className="mb-3">
                        {isWordRevealed ? (
                          <h3 className="text-lg font-black text-emerald-800 mb-1 animate-fade-in">{word.word}</h3>
                        ) : (
                          <div className="flex flex-col items-start gap-2">
                             <h3 className="text-lg font-black text-emerald-300 italic tracking-widest">? ? ?</h3>
                             <span className="text-[9px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full uppercase opacity-0 group-hover:opacity-100 transition-opacity">Reveal word roots</span>
                          </div>
                        )}
                        <span className="inline-block bg-emerald-50 text-emerald-500 text-[9px] font-bold px-1.5 rounded uppercase mb-2">{word.form}</span>
                      </div>

                      <p className={`text-xs text-emerald-700 leading-relaxed mb-4 grow ${!isWordRevealed ? 'line-clamp-6' : 'line-clamp-4'}`}>
                        {word.definition}
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                         <div className="flex items-center gap-1">
                            <span className="text-base">{ORIGIN_EMOJI_MAP[word.origin] || '🍄'}</span>
                            <span className="text-[10px] font-bold text-emerald-400 capitalize">{word.origin}</span>
                         </div>
                         <span className="text-[10px] font-black text-emerald-800 bg-white border border-emerald-100 px-2 py-1 rounded-full">{word.score} pts</span>
                      </div>

                      {isWordRevealed && (
                        <div className="mt-3 pt-3 border-t border-emerald-50 animate-fade-in">
                           <p className="text-[8px] font-black text-emerald-300 uppercase mb-1">Word Roots</p>
                           <p className="text-[10px] text-emerald-500 italic leading-relaxed line-clamp-3">{word.etymology}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showMenu && (
        <div className="fixed inset-0 z-[70] bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-scale-in border-2 border-emerald-100">
             <div className="p-6 text-center border-b border-emerald-50 bg-emerald-50/50">
                <h2 className="serif text-2xl font-bold text-emerald-900">Settings ⚙️</h2>
             </div>
             
             <div className="p-5 space-y-8">
                {/* Navigation Section */}
                <div>
                   <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-emerald-50 pb-1">Navigation</h3>
                   <button onClick={() => { setShowMenu(false); setShowWelcome(true); setSelectedSeed(null); }} 
                           className="w-full flex items-center justify-center gap-3 py-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors text-emerald-800 font-bold border border-emerald-100">
                      <span className="text-xl">🏠</span>
                      <span>Main Menu</span>
                   </button>
                </div>

                {/* Difficulty Section */}
                <div>
                   <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-emerald-50 pb-1">Change Difficulty 🌵</h3>
                   <div className="grid grid-cols-3 gap-2">
                      {WORD_BANKS.map(bank => (
                        <button key={bank.type} onClick={() => { setShowMenu(false); initSeedBank(bank.type); }}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all 
                                ${selectedSeed === bank.type ? 'bg-emerald-800 border-emerald-900 text-white' : 'bg-white border-emerald-100 text-emerald-800 hover:border-emerald-500'}`}>
                           <span className="text-xl mb-1">{bank.emoji}</span>
                           <span className="text-[10px] font-black uppercase">{bank.label}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Data Management Section */}
                <div>
                   <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 border-b border-emerald-50 pb-1">Data Management 🌳</h3>
                   <div className="space-y-2">
                      <button onClick={requestResetCategory} className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors text-emerald-800 font-bold border border-emerald-100">
                         <span className="text-sm">Reset {selectedSeed ? selectedSeed.charAt(0).toUpperCase() + selectedSeed.slice(1) : ''} Score</span>
                         <span className="text-lg">🍄</span>
                      </button>
                      <button onClick={requestResetAll} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-red-800 font-bold border border-red-100">
                         <span>Reset All Data</span>
                         <span className="text-lg">🌳</span>
                      </button>
                   </div>
                </div>
             </div>
             
             <div className="p-4 border-t border-emerald-50 flex justify-center">
                <button onClick={() => setShowMenu(false)} className="px-8 py-2 bg-emerald-800 text-white rounded-full font-bold text-xs uppercase tracking-widest">Close</button>
             </div>
          </div>
        </div>
      )}

      {/* Round Result Modal */}
      {showRoundResult && (
        <div className="fixed inset-0 z-[80] bg-emerald-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl text-center p-8 animate-scale-in border-4 border-emerald-100">
            <div className="mb-6">
              <span className="text-6xl mb-4 block">🎋</span>
              <h2 className="serif text-3xl font-black text-emerald-900 mb-2">Harvest Complete!</h2>
              <p className="text-emerald-600 font-medium">You've successfully cultivated this round.</p>
            </div>
            
            <div className="bg-emerald-50 rounded-3xl p-6 mb-8 border-2 border-emerald-100 relative overflow-hidden">
               {isNewBest && (
                 <div className="absolute top-2 right-2 bg-amber-400 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">NEW BEST!</div>
               )}
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Round Harvest Score</p>
               <p className="text-5xl font-black text-emerald-800 tabular-nums">{currentRoundScore}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[8px] font-black text-emerald-400 uppercase">Streak</p>
                  <p className="text-xl font-black text-emerald-800">🔥 {streak}</p>
               </div>
               <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[8px] font-black text-emerald-400 uppercase">Category Best</p>
                  <p className="text-xl font-black text-emerald-800">🏆 {selectedSeed ? categoryHighScores[selectedSeed] : 0}</p>
               </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowRoundResult(false);
                  if (selectedSeed) initSeedBank(selectedSeed);
                }} 
                className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-900 active:scale-95 transition-all text-lg"
              >
                Harvest Another Round 🌾
              </button>
              <button 
                onClick={() => {
                  setShowRoundResult(false);
                  setShowWelcome(true);
                  setSelectedSeed(null);
                }} 
                className="w-full py-4 bg-emerald-800 text-emerald-800 rounded-2xl font-bold hover:bg-emerald-100 transition-all"
              >
                Return to Seed Bank 🪴
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center border-2 border-emerald-100">
            <h3 className="serif text-2xl font-bold text-emerald-900 mb-2">{confirmModal.title}</h3>
            <p className="text-emerald-600 font-medium mb-8">{confirmModal.message}</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} className="flex-1 py-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold hover:bg-emerald-100">Cancel</button>
              <button onClick={confirmModal.action} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-shake { animation: shake 0.2s ease-in-out; }
        .serif { font-family: 'Fraunces', serif; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
      `}} />
    </div>
  );
};

export default App;
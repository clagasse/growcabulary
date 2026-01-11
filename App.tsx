
import React, { useState, useEffect, useCallback } from 'react';
import { Word, SeedType, GardenEntry, RoundProgress } from './types';
import { 
  WORD_BANKS, 
  ORIGIN_EMOJI_MAP, 
  INITIAL_SCORE, 
  WRONG_GUESS_PENALTY, 
  TIME_REVEAL_INTERVAL, 
  WORDS_PER_ROUND 
} from './constants';
import { RAW_WORDS } from './utils/data';
import { getEtymologyInsight, generateAIWords } from './services/geminiService';

const PROMPT_SUGGESTIONS = [
  { label: "Victorian Gothic", prompt: "Words common in 19th-century gothic mystery novels and Victorian literature." },
  { label: "High Fantasy", prompt: "Archaic and sophisticated words found in epic high fantasy literature." },
  { label: "Nature & Flora", prompt: "Obscure botanical, biological, and nature-themed vocabulary terms." },
  { label: "Nautical & Sea", prompt: "Historical seafaring, maritime, and nautical vocabulary from the age of discovery." },
  { label: "Philosophical", prompt: "Complex terms related to epistemology, logic, and classical philosophy." },
  { label: "Cosmic & Celestial", prompt: "Words related to space, stars, and astronomical phenomena." },
  { label: "Ancient Ruins", prompt: "Vocabulary from archaeology, ancient history, and lost cultures." },
  { label: "Gastronomy & Flavor", prompt: "Sophisticated culinary terms, taste descriptions, and food history." },
  { label: "Psychological States", prompt: "Complex terms for subtle human emotions, mental states, and behaviors." },
  { label: "Architectural Wonders", prompt: "Structural, decorative, and aesthetic terms used in architecture and design." }
];

const App: React.FC = () => {
  // Game State
  const [selectedSeed, setSelectedSeed] = useState<SeedType | null>(null);
  const [isAiEnabled, setIsAiEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('growcabulary_ai_mode');
    return saved === 'true';
  });
  const [customPrompt, setCustomPrompt] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [remainingWords, setRemainingWords] = useState<Word[]>([]);
  const [guess, setGuess] = useState<string[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState<'success' | 'failure' | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Persistence & Progress
  const [categoryHighScores, setCategoryHighScores] = useState<Record<SeedType, number>>(() => {
    const saved = localStorage.getItem('growcabulary_category_highscores');
    if (saved) return JSON.parse(saved);
    return { uncommon: 0, rare: 0, exotic: 0 };
  });

  const [playedWords, setPlayedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('growcabulary_played_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [garden, setGarden] = useState<GardenEntry[]>(() => {
    const saved = localStorage.getItem('growcabulary_garden');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [seenAiWords, setSeenAiWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('growcabulary_seen_ai_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [roundProgress, setRoundProgress] = useState<Record<SeedType, RoundProgress>>(() => {
    const saved = localStorage.getItem('growcabulary_progress');
    const defaultRoundProgress = { currentRound: 1, scores: [], completedWordsCount: 0 };
    return saved ? JSON.parse(saved) : {
      uncommon: { ...defaultRoundProgress },
      rare: { ...defaultRoundProgress },
      exotic: { ...defaultRoundProgress }
    };
  });

  // UI State
  const [showWelcome, setShowWelcome] = useState(!selectedSeed);
  const [showMenu, setShowMenu] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [currentRoundScore, setCurrentRoundScore] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ show: false, title: "", message: "", action: () => {} });

  // Derived Values
  const currentWord = remainingWords[currentWordIndex];

  // Persistence Effects
  useEffect(() => { localStorage.setItem('growcabulary_garden', JSON.stringify(garden)); }, [garden]);
  useEffect(() => { localStorage.setItem('growcabulary_seen_ai_words', JSON.stringify(seenAiWords)); }, [seenAiWords]);
  useEffect(() => { localStorage.setItem('growcabulary_progress', JSON.stringify(roundProgress)); }, [roundProgress]);
  useEffect(() => { localStorage.setItem('growcabulary_ai_mode', String(isAiEnabled)); }, [isAiEnabled]);
  useEffect(() => { localStorage.setItem('growcabulary_category_highscores', JSON.stringify(categoryHighScores)); }, [categoryHighScores]);
  useEffect(() => { localStorage.setItem('growcabulary_played_words', JSON.stringify(playedWords)); }, [playedWords]);

  const revealOneLetter = useCallback(() => {
    if (!currentWord) return;
    setRevealedIndices(prev => {
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

      if (focusedIndex === indexToReveal) {
        let next = (indexToReveal + 1) % currentWord.word.length;
        while (nextSet.has(next) && next !== indexToReveal) {
          next = (next + 1) % currentWord.word.length;
        }
        setFocusedIndex(next);
      }
      return nextSet;
    });
  }, [currentWord, focusedIndex]);

  // Timer & Hint Logic
  useEffect(() => {
    if (isRoundOver || !currentWord) return;
    const intervalId = setInterval(() => {
      setTimer(t => {
        const nextTime = t + 1;
        if (nextTime % TIME_REVEAL_INTERVAL === 0) {
          revealOneLetter();
        }
        return nextTime;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isRoundOver, currentWord, revealOneLetter]);

  // Score Calculation
  useEffect(() => {
    if (isRoundOver || !currentWord) return;
    const penalty = wrongGuesses * WRONG_GUESS_PENALTY;
    let newScore = Math.max(0, INITIAL_SCORE - timer - penalty);
    if (revealedIndices.size >= currentWord.word.length) {
      newScore = 0;
      handleFail();
      return;
    }
    setScore(newScore);
    if (newScore <= 0 && timer > 0) handleFail();
  }, [timer, wrongGuesses, isRoundOver, revealedIndices.size, currentWord]);

  // Manage Focus
  useEffect(() => {
    if (!isRoundOver && currentWord) {
      if (revealedIndices.has(focusedIndex)) {
        let next = focusedIndex;
        let iterations = 0;
        while (revealedIndices.has(next) && iterations < currentWord.word.length) {
          next = (next + 1) % currentWord.word.length;
          iterations++;
        }
        if (next !== focusedIndex) setFocusedIndex(next);
      }
      const input = document.getElementById(`box-${focusedIndex}`) as HTMLInputElement;
      input?.focus();
    }
  }, [focusedIndex, isRoundOver, currentWordIndex, revealedIndices, currentWord]);

  // AI Insight
  const fetchAiInsight = useCallback(async () => {
    if (!currentWord) return;
    setIsInsightLoading(true);
    const insight = await getEtymologyInsight(currentWord.word);
    setAiInsight(insight);
    setIsInsightLoading(false);
  }, [currentWord]);

  useEffect(() => {
    if (isRoundOver && !aiInsight && !isInsightLoading) {
      fetchAiInsight();
    }
  }, [isRoundOver, aiInsight, isInsightLoading, fetchAiInsight]);

  // Start New Round
  const initSeedBank = async (type: SeedType, manualPrompt?: string) => {
    setSelectedSeed(type);
    if (isAiEnabled) {
      setIsGeneratingAI(true);
      const blacklist = Array.from(new Set([...garden.map(g => g.word), ...seenAiWords, ...playedWords]));
      const aiWords = await generateAIWords(type, manualPrompt, blacklist);
      setIsGeneratingAI(false);
      if (aiWords.length > 0) {
        setSeenAiWords(prev => [...prev, ...aiWords.map(w => w.word)]);
        setRemainingWords(aiWords);
        setCurrentWordIndex(0);
        setShowWelcome(false);
        resetWordState(aiWords[0]);
        setCurrentRoundScore(0);
      } else {
        setRemainingWords([]);
        setShowWelcome(true);
        setSelectedSeed(null);
      }
    } else {
      useLocalSeeds(type);
    }
  };

  const useLocalSeeds = (type: SeedType) => {
    let filtered = RAW_WORDS.filter(w => w.seed === type && !playedWords.includes(w.word));
    if (filtered.length < WORDS_PER_ROUND) {
      const allInCategory = RAW_WORDS.filter(w => w.seed === type).map(w => w.word);
      setPlayedWords(prev => prev.filter(w => !allInCategory.includes(w)));
      filtered = RAW_WORDS.filter(w => w.seed === type);
    }
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, WORDS_PER_ROUND);
    setRemainingWords(shuffled);
    setCurrentWordIndex(0);
    setShowWelcome(false);
    resetWordState(shuffled[0]);
    setCurrentRoundScore(0);
  };

  const resetWordState = (word: Word) => {
    setGuess(Array(word.word.length).fill(''));
    setRevealedIndices(new Set());
    setTimer(0);
    setScore(INITIAL_SCORE);
    setWrongGuesses(0);
    setIsRoundOver(false);
    setMessage("");
    setAnimation(null);
    setAiInsight(null);
    setFocusedIndex(0);
  };

  const handleFail = () => {
    if (isRoundOver) return;
    setIsRoundOver(true);
    setAnimation('failure');
    setScore(0);
    setMessage(`The word was "${currentWord.word}". 🥀`);
    if (!playedWords.includes(currentWord.word)) {
      setPlayedWords(prev => [...prev, currentWord.word]);
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
      revealOneLetter();
    }
  };

  const handleSuccess = () => {
    setIsRoundOver(true);
    setAnimation('success');
    setMessage("Correct! 🌻");
    setCurrentRoundScore(prev => prev + score);
    if (!playedWords.includes(currentWord.word)) {
      setPlayedWords(prev => [...prev, currentWord.word]);
    }
    if (!garden.some(g => g.word === currentWord.word)) {
      setGarden(prev => [...prev, { ...currentWord, dateLearned: new Date().toLocaleDateString(), score: score }]);
    }
  };

  const nextWord = () => {
    if (!selectedSeed) return;
    setRoundProgress(prev => ({
      ...prev,
      [selectedSeed]: { ...prev[selectedSeed], completedWordsCount: (prev[selectedSeed]?.completedWordsCount || 0) + 1 }
    }));
    if (currentWordIndex + 1 < remainingWords.length) {
      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      resetWordState(remainingWords[nextIdx]);
    } else {
      const finalScore = currentRoundScore;
      if (finalScore > categoryHighScores[selectedSeed]) {
        setCategoryHighScores(prev => ({ ...prev, [selectedSeed]: finalScore }));
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
    if (isRoundOver) return;
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
    if (e.key === 'ArrowLeft' && index > 0) {
        let prev = index - 1;
        while (prev >= 0 && revealedIndices.has(prev)) prev--;
        if (prev >= 0) setFocusedIndex(prev);
    }
    if (e.key === 'ArrowRight' && index + 1 < currentWord.word.length) {
        let next = index + 1;
        while (next < currentWord.word.length && revealedIndices.has(next)) next++;
        if (next < currentWord.word.length) setFocusedIndex(next);
    }
  };

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

  if (showWelcome || isGeneratingAI) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-emerald-50">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100 relative overflow-hidden">
          {isGeneratingAI && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-10 animate-fade-in">
              <div className="w-20 h-20 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin mb-8" />
              <h2 className="serif text-3xl font-black text-emerald-900 mb-2">Cultivating AI Seeds... 🎋</h2>
              <p className="text-emerald-600 font-medium">Gemini is gathering 6 unique terms for your specific garden.</p>
            </div>
          )}
          
          <div className="text-center mb-8">
            <h1 className="serif text-5xl font-bold text-emerald-800 mb-4">🌿 Growcabulary 🌿</h1>
            <p className="text-lg text-emerald-600 font-medium italic">Grow your mind, word by word. 🪴</p>
          </div>

          <div className="flex flex-col items-center mb-10">
            <button 
              onClick={() => setIsAiEnabled(!isAiEnabled)} 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 transition-all ${isAiEnabled ? 'bg-emerald-800 border-emerald-900 text-white shadow-lg' : 'bg-white border-emerald-100 text-emerald-800 hover:border-emerald-300'}`}
            >
              <span className="text-2xl">{isAiEnabled ? '✨' : '📖'}</span>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest leading-none">Play Mode</p>
                <p className="text-[10px] opacity-90 font-bold">{isAiEnabled ? 'Dynamic Seeds (AI-Generated)' : 'Seed Archive (Standard List)'}</p>
              </div>
              <div className="ml-4 text-[10px] font-black uppercase tracking-tighter bg-white/10 px-2 py-1 rounded">Switch 🔄</div>
            </button>
          </div>

          {isAiEnabled && (
            <div className="mb-10 p-6 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 animate-fade-in">
              <label className="block text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4 text-center">Custom Garden Specification 🌾</label>
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {PROMPT_SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCustomPrompt(s.prompt)}
                    className="px-3 py-1.5 bg-white border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                  >
                    🌱 <span>{s.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <textarea 
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="E.g. Words from 1920s jazz age, or sophisticated nautical terms..."
                  className="flex-1 min-h-[100px] p-4 rounded-xl border-2 border-emerald-100 outline-none focus:border-emerald-500 transition-all text-sm font-medium bg-white/80 placeholder:text-emerald-200"
                />
                <button 
                  disabled={!customPrompt.trim()}
                  onClick={() => initSeedBank('rare', customPrompt)}
                  className="bg-emerald-800 text-white px-8 rounded-xl font-bold hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95 flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-xl">🎋</span>
                  <span>Grow</span>
                </button>
              </div>
              <p className="mt-4 text-[10px] text-emerald-400 font-bold text-center">Or pick a base seed below to let the AI grow that difficulty level: 🌵</p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-3 mb-10">
            {WORD_BANKS.map(bank => (
              <button key={bank.type} onClick={() => initSeedBank(bank.type)} className="group flex flex-col items-center p-8 bg-emerald-50 rounded-2xl border-2 border-transparent hover:border-emerald-500 hover:bg-emerald-100 transition-all text-center relative shadow-sm hover:shadow-md">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{bank.emoji}</span>
                <h3 className="font-bold text-emerald-800 mb-2 text-xl">{bank.label}</h3>
                <p className="text-xs text-emerald-600 leading-relaxed px-4 mb-4">{bank.description}</p>
                <div className="mt-auto inline-flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-tighter border border-emerald-100">
                  Best: {categoryHighScores[bank.type]}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-emerald-50">
            <div className="max-w-2xl mx-auto p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 text-center">How to Play 📖</h3>
              <ul className="space-y-3 text-[11px] font-bold text-emerald-800 px-4 list-disc list-outside">
                <li>Guess words based on their definition, length, and origin</li>
                <li>New letters are revealed every 5 seconds and whenever a wrong guess is made</li>
                <li>The max score per word is 60 points. Scores decrease by 1 point every second. Wrong guesses cost 10 points</li>
                <li>Each round is 6 words. Aim for the highest score per round!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 relative overflow-hidden">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-emerald-100 p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="serif text-2xl font-bold text-emerald-800">🌿 Growcabulary</h1>
            <div className="hidden sm:flex items-center gap-2">
              <div className="bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 capitalize">
                {selectedSeed} • {currentWordIndex + 1}/{WORDS_PER_ROUND} 🎋
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="hidden md:block text-[10px] font-black uppercase text-amber-500 tracking-tighter">
              {selectedSeed} Best: <span className="text-lg">{selectedSeed ? categoryHighScores[selectedSeed] : 0} 🏆</span>
            </div>
            <div className="text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              Score: <span className="font-bold">{currentRoundScore}</span> 🌾
            </div>
            <button onClick={() => setShowGarden(true)} className="px-4 py-2 bg-emerald-800 text-white rounded-full hover:bg-emerald-900 transition-colors shadow-sm">My Words 🌸</button>
            <button onClick={() => setShowMenu(true)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 flex flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="w-full bg-white rounded-[2rem] shadow-xl p-6 sm:p-10 border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1.5 bg-emerald-500 transition-all duration-500 rounded-full" style={{ width: `${((currentWordIndex) / WORDS_PER_ROUND) * 100}%` }} />
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 sm:mb-12">
            <div className="space-y-3 flex-1">
              <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-emerald-100">
                {currentWord?.form} • {currentWord?.origin} {ORIGIN_EMOJI_MAP[currentWord?.origin] || '🌱'}
              </span>
              <h2 className="serif text-xl sm:text-3xl font-bold text-emerald-900 leading-tight">{currentWord?.definition}</h2>
              {currentWord?.definition2 && <p className="text-emerald-500 text-sm italic opacity-80 leading-relaxed">{currentWord.definition2}</p>}
              
              {currentWord?.example && (
                <div className="mt-4 p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100/50 animate-fade-in">
                  <p className="text-emerald-700 text-sm italic leading-relaxed">
                    <span className="not-italic font-bold text-[10px] uppercase text-emerald-400 mr-2 tracking-wider">Example:</span>
                    "{currentWord?.example.replace(new RegExp(currentWord.word, 'gi'), '_____')}"
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 bg-emerald-50/50 p-4 sm:p-6 rounded-3xl border border-emerald-100 shadow-inner w-full sm:w-auto justify-center">
              <div className="text-center px-2">
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter mb-1">Points 💎</p>
                <p className={`text-3xl sm:text-4xl font-black tabular-nums ${score === 0 ? 'text-red-500' : 'text-emerald-700'}`}>{score}</p>
              </div>
              <div className="w-px h-10 bg-emerald-200/50" />
              <div className="text-center px-2">
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter mb-1">Time ⏳</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums">{timer}s</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-1 sm:gap-1.5 mb-10 sm:mb-14 w-full overflow-hidden">
            {currentWord?.word.split('').map((char, i) => {
              const isRevealed = revealedIndices.has(i);
              const isFocused = focusedIndex === i;
              const displayChar = isRoundOver ? char : (isRevealed ? char : guess[i] || '');
              let boxSizeClass = currentWord.word.length > 12 ? "w-5 h-9 sm:w-9 sm:h-14 text-base sm:text-2xl" : "w-8 h-12 sm:w-14 sm:h-20 text-xl sm:text-4xl";
              return (
                <div key={i} className="relative transition-transform active:scale-95 flex-shrink-0">
                  <input id={`box-${i}`} type="text" inputMode="text" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" maxLength={1} value={displayChar} disabled={isRevealed || isRoundOver} onFocus={() => !isRevealed && setFocusedIndex(i)} onChange={(e) => handleInput(e.target.value, i)} onKeyDown={(e) => handleKeyDown(e, i)}
                    className={`${boxSizeClass} font-black text-center rounded-lg sm:rounded-xl border-2 transition-all duration-200 outline-none ${isRoundOver && animation === 'success' ? 'text-white border-emerald-500 bg-emerald-500 shadow-lg scale-105' : ''} ${isRoundOver && animation === 'failure' ? 'text-white border-red-500 bg-red-500 shadow-lg scale-105' : ''} ${!isRoundOver && isRevealed ? 'text-emerald-700 border-emerald-200 bg-emerald-100/80' : ''} ${!isRoundOver && !isRevealed ? `bg-white border-emerald-200 text-emerald-950 ${isFocused ? 'ring-4 ring-emerald-400/20 border-emerald-600 shadow-lg scale-110 z-10' : 'hover:border-emerald-400'} ${guess[i] ? 'border-emerald-500' : ''}` : ''}`} />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-6 relative z-10">
            {message && <div className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-sm border animate-fade-in ${animation === 'failure' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>{message}</div>}
            {!isRoundOver ? <button onClick={checkAnswer} className="px-10 py-4 sm:px-14 sm:py-5 bg-emerald-600 text-white font-black text-lg sm:text-xl rounded-full hover:bg-emerald-700 shadow-xl transition-all active:scale-95">Submit Guess 🍂</button>
            : <button onClick={nextWord} className="px-10 py-4 sm:px-14 sm:py-5 bg-emerald-900 text-white font-black text-lg sm:text-xl rounded-full hover:bg-black shadow-xl transition-all active:scale-95 flex items-center gap-3">
                <span>{currentWordIndex + 1 < remainingWords.length ? 'Next Word 🌻' : 'See Results 🏆'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>}
          </div>
        </div>

        <div className="w-full bg-white/70 backdrop-blur rounded-[2rem] p-6 sm:p-10 border border-emerald-100 shadow-sm transition-all duration-500 min-h-[160px] flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Word Insights & Origins 🌲</h3>
            {isInsightLoading && <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />}
          </div>
          
          {!isRoundOver ? (
            <div className="text-center p-4">
              <p className="text-emerald-400 text-sm italic">Finish the word to unlock full etymology and AI linguistic analysis. 🌵</p>
              <div className="mt-4 flex justify-center gap-2 opacity-20">
                <div className="h-2 w-12 bg-emerald-200 rounded-full" />
                <div className="h-2 w-20 bg-emerald-200 rounded-full" />
                <div className="h-2 w-16 bg-emerald-200 rounded-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-wider block mb-1">Root History 🌿</span>
                <p className="text-emerald-900 font-medium leading-relaxed">{currentWord?.etymology}</p>
              </div>
              <div className="pt-4 border-t border-emerald-100/50">
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-wider block mb-1">AI Contextual Analysis ✨</span>
                <p className="text-emerald-800 text-sm leading-relaxed">{aiInsight || "Analyzing linguistics..."}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md" onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} />
          <div className="relative bg-white max-w-sm w-full rounded-[2.5rem] shadow-2xl p-10 text-center border-4 border-emerald-100 animate-fade-in">
            <h3 className="serif text-2xl font-black text-emerald-900 mb-4">{confirmModal.title}</h3>
            <p className="text-emerald-600 text-sm leading-relaxed mb-8 font-medium">{confirmModal.message}</p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmModal.action} className="w-full py-4 bg-emerald-600 text-white font-black rounded-full shadow-lg hover:bg-emerald-700 transition-all active:scale-95">Yes, Proceed 🌿</button>
              <button onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} className="w-full py-3 text-emerald-400 font-bold hover:text-emerald-600">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Overlays */}
      {showGarden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md" onClick={() => setShowGarden(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-8 border-b border-emerald-100 flex justify-between items-center">
              <h2 className="serif text-3xl font-bold text-emerald-900">🌸 My Vocabulary Garden</h2>
              <button onClick={() => setShowGarden(false)} className="bg-emerald-50 p-3 rounded-xl text-emerald-400 hover:text-emerald-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 grid gap-4 sm:grid-cols-2">
              {garden.length === 0 ? (
                <div className="col-span-full py-20 text-center text-emerald-400 font-medium">Your garden is empty. Start playing to grow your lexicon! 🌲</div>
              ) : garden.map((entry, idx) => (
                <div key={idx} className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <span className="text-3xl">{ORIGIN_EMOJI_MAP[entry.origin] || '🌿'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-emerald-900 truncate uppercase tracking-tight">{entry.word}</h3>
                    <p className="text-xs text-emerald-700 font-bold mb-1 italic">"{entry.definition}"</p>
                    <div className="flex justify-between mt-auto pt-2 border-t border-emerald-100/30 text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                      <span>{entry.dateLearned}</span>
                      <span>{entry.score} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRoundResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xl" />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-12 text-center border border-emerald-100">
            <div className="mb-6 text-7xl">🌳</div>
            <h2 className="serif text-4xl font-black text-emerald-900 mb-2">Harvest Complete!</h2>
            <div className="bg-emerald-50 rounded-2xl p-6 mb-10 space-y-4 shadow-inner">
              <div>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Round Score</p>
                <p className="text-5xl font-black text-emerald-800 tabular-nums">{currentRoundScore}</p>
              </div>
              {selectedSeed && currentRoundScore >= categoryHighScores[selectedSeed] && currentRoundScore > 0 && (
                <div className="bg-amber-100 text-amber-700 text-[10px] font-black py-1 px-4 rounded-full inline-block uppercase tracking-widest animate-bounce shadow-sm">
                  ✨ New {selectedSeed} Best! 🌻
                </div>
              )}
            </div>
            <div className="space-y-4">
                <button onClick={() => { setShowRoundResult(false); initSeedBank(selectedSeed!); }} className="w-full py-5 bg-emerald-600 text-white font-black text-xl rounded-full shadow-lg hover:bg-emerald-700 transition-all active:scale-95">Play Another Round 🍂</button>
                <button onClick={() => { setShowRoundResult(false); setShowWelcome(true); setSelectedSeed(null); setRemainingWords([]); }} className="w-full py-4 text-emerald-600 font-bold hover:text-emerald-800 transition-colors">Back to Menu 🏠</button>
            </div>
          </div>
        </div>
      )}

      {showMenu && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" onClick={() => setShowMenu(false)} />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-10 flex flex-col gap-8 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="serif text-3xl font-black text-emerald-900">Settings ⚙️</h2>
              <button onClick={() => setShowMenu(false)} className="text-emerald-400 hover:text-emerald-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest px-2">Navigation</p>
              <button 
                onClick={() => { setShowMenu(false); setShowWelcome(true); setSelectedSeed(null); setRemainingWords([]); }} 
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-emerald-50 bg-white text-emerald-900 font-bold hover:bg-emerald-50 transition-all text-left shadow-sm"
              >
                🏠 Main Menu
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest px-2">Change Difficulty 🌵</p>
              {WORD_BANKS.map(bank => (
                <button
                  key={bank.type}
                  onClick={() => { setShowMenu(false); initSeedBank(bank.type); }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedSeed === bank.type ? 'bg-emerald-100 border-emerald-600 font-bold text-emerald-900' : 'bg-white border-emerald-50 text-emerald-800'}`}
                >
                  <span className="mr-3">{bank.emoji}</span>
                  <span>{bank.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-auto space-y-3 pb-6">
              <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest px-2">Data Management 🌳</p>
              <button 
                type="button"
                onClick={requestResetCategory} 
                className="w-full py-4 text-emerald-600 text-sm font-bold border-2 border-emerald-100 rounded-xl hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
              >
                Reset {selectedSeed ? selectedSeed.charAt(0).toUpperCase() + selectedSeed.slice(1) : 'Current'} Score 🍄
              </button>
              <button 
                type="button"
                onClick={requestResetAll} 
                className="w-full py-4 text-red-500 text-sm font-bold border-2 border-red-50 rounded-xl hover:bg-red-50 transition-all active:scale-95 shadow-sm"
              >
                Reset All Data 🌳
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

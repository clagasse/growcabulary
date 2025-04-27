import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import './App.css';

// --- Botanical Emoji Map by Origin ---
const originEmojiMap = {
  Latin: '🌿',
  Greek: '🌺',
  French: '🌻',
  'Old English': '🌳',
  German: '🌲',
  Italian: '🌷',
  Arabic: '🌵',
  Other: '🍄',
  unknown: '🍄'
};
function getOriginEmoji(origin) {
  return originEmojiMap[origin] || '🍄';
}

// --- Word Bank Types ---
const WORD_BANKS = [
  { type: 'rare', label: 'Rare', csv: '/growcabulary_words_rare.csv' },
  { type: 'common', label: 'Common', csv: '/growcabulary_words_common.csv' }, // Placeholder for future
];

// Helper functions for input bar
function getNextEmptyIndex(guessArr, revealedCount) {
  for (let i = revealedCount; i < guessArr.length; i++) {
    if (!guessArr[i]) return i;
  }
  return guessArr.length;
}
function getLastFilledIndex(guessArr, revealedCount) {
  for (let i = guessArr.length - 1; i >= revealedCount; i--) {
    if (guessArr[i]) return i;
  }
  return revealedCount;
}

// Save/load helpers
function saveGameState(state, wordBankType) {
  localStorage.setItem(`growcabulary_state_${wordBankType}`, JSON.stringify({
    seedBank: state.seedBank || [],
    totalScore: state.totalScore || 0,
    highestScore: state.highestScore || 0,
    wordsCompleted: state.wordsCompleted || 0,
    averageScore: state.averageScore || 0,
    remaining: state.remaining || [],
    lastSaved: new Date().toISOString()
  }));
}

function loadGameState(wordBankType) {
  try {
    const savedState = localStorage.getItem(`growcabulary_state_${wordBankType}`);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return {
        seedBank: Array.isArray(parsed.seedBank) ? parsed.seedBank : [],
        totalScore: typeof parsed.totalScore === 'number' ? parsed.totalScore : 0,
        highestScore: typeof parsed.highestScore === 'number' ? parsed.highestScore : 0,
        wordsCompleted: typeof parsed.wordsCompleted === 'number' ? parsed.wordsCompleted : 0,
        averageScore: typeof parsed.averageScore === 'number' ? parsed.averageScore : 0,
        remaining: Array.isArray(parsed.remaining) ? parsed.remaining : [],
      };
    }
  } catch (e) {
    localStorage.removeItem(`growcabulary_state_${wordBankType}`);
  }
  return null;
}

function getRandomIndex(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return Math.floor(Math.random() * arr.length);
}

function maskWordInExample(example, word) {
  if (!example || !word) return "";
  const regex = new RegExp(word, "gi");
  return example.replace(regex, "____");
}

function downloadCSV(garden, setDownloadUrl) {
  const headers = ['Word', 'Form', 'Definition', 'Etymology', 'Example', 'Origin'];
  const csvContent = [
    headers.join(','),
    ...garden.map(word => [
      `"${word.word}"`,
      `"${word.form}"`,
      `"${word.definition.replace(/"/g, '""')}"`,
      `"${word.etymology.replace(/"/g, '""')}"`,
      `"${word.example.replace(/"/g, '""')}"`,
      `"${word.origin.replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  setDownloadUrl(url);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'growcabulary_garden.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60);
}

export default function App() {
  // --- Word Bank State ---
  const [wordBankType, setWordBankType] = useState('rare');
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  // Welcome modal state
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('growcabulary_welcome_dismissed');
  });

  const [words, setWords] = useState([]);
  const [remaining, setRemaining] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(60);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [garden, setGarden] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [penalties, setPenalties] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRoundOver, setIsRoundOver] = useState(false);

  // For custom input bar
  const inputRef = useRef(null);
  const [guess, setGuess] = useState([]);
  const [cursor, setCursor] = useState(0);

  // CSV loading and robust state validation
  useEffect(() => {
    setIsLoading(true);
    const selectedBank = WORD_BANKS.find(b => b.type === wordBankType) || WORD_BANKS[0];
    fetch(process.env.PUBLIC_URL + selectedBank.csv)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              let savedState = null;
              try {
                savedState = loadGameState(wordBankType);
              } catch (e) {
                savedState = null;
              }
              // Only use saved state if it matches the current CSV data
              if (
                savedState &&
                Array.isArray(savedState.remaining) &&
                savedState.remaining.length > 0 &&
                savedState.remaining.every(w => w.word && results.data.some(d => d.word === w.word))
              ) {
                setGarden(savedState.seedBank || []);
                setTotalScore(savedState.totalScore || 0);
                setHighestScore(savedState.highestScore || 0);
                setWordsCompleted(savedState.wordsCompleted || 0);
                setAverageScore(savedState.averageScore || 0);
                setWords(results.data);
                setRemaining(savedState.remaining);
                setCurrent(getRandomIndex(savedState.remaining));
              } else {
                setWords(results.data);
                setRemaining([...results.data]);
                setCurrent(getRandomIndex(results.data));
                localStorage.removeItem(`growcabulary_state_${wordBankType}`);
                setGarden([]);
                setTotalScore(0);
                setHighestScore(0);
                setWordsCompleted(0);
                setAverageScore(0);
              }
              setIsLoading(false);
            } else {
              setError("No data found in CSV. Please check your word list file.");
              setIsLoading(false);
            }
          },
          error: (error) => {
            setError("CSV parsing error: " + error.message);
            setIsLoading(false);
          }
        });
      })
      .catch(error => {
        setError("CSV fetch error: " + error.message);
        setIsLoading(false);
      });
  }, [wordBankType]);

  useEffect(() => {
    if (wordsCompleted > 0) {
      saveGameState({
        seedBank: garden,
        totalScore,
        highestScore,
        wordsCompleted,
        averageScore,
        remaining
      }, wordBankType);
    }
  }, [wordsCompleted, garden, totalScore, highestScore, averageScore, remaining, wordBankType]);

  // When a new word is loaded, reset all round state
  useEffect(() => {
    if (!Array.isArray(remaining) || !remaining[current]) return;

    if (intervalId) {
      clearInterval(intervalId);
    }

    setWrongGuesses(0);
    setMessage("");
    setScore(60);
    setTimer(0);
    setPenalties(0);
    setIsRoundOver(false);

    // For custom input bar
    const word = remaining[current]?.word || "";
    setGuess(Array(word.length).fill(''));
    setCursor(0);

    if (inputRef.current) inputRef.current.focus();

    // Only start timer if welcome screen is not showing
    if (!showWelcome) {
      const id = setInterval(() => {
        setTimer(prev => {
          if (prev + 1 >= 60) {
            clearInterval(id);
            setMessage("Time's up! The word was: " + (remaining[current]?.word || "") + ". Press Enter for next word");
            setScore(0);
            setIsRoundOver(true);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

      setIntervalId(id);

      return () => {
        if (id) clearInterval(id);
      };
    }
  }, [current, remaining, showWelcome]);

  // Score calculation and auto-reveal at 0
  useEffect(() => {
    if (timer >= 60 || isRoundOver) return;
    const newScore = Math.max(0, 60 - timer - penalties);
    setScore(newScore);
    if (newScore <= 0) {
      const currentWord = remaining[current]?.word || "";
      setMessage("Time's up! The word was: " + currentWord + ". Press Enter for next word");
      setIsRoundOver(true);
    }
  }, [timer, penalties, isRoundOver, remaining, current]);

  // Always keep focus on the input
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  });

  function buildFullAnswer() {
    const word = remaining[current]?.word || "";
    const revealedCount = Math.min(Math.floor(timer / 5), word.length);
    return word.split('').map((ch, i) =>
      i < revealedCount ? ch : guess[i] || ''
    ).join('');
  }

  function checkAnswer() {
    if (isRoundOver) return;

    const word = remaining[current]?.word || "";
    const revealedCount = Math.min(Math.floor(timer / 5), word.length);
    if (buildFullAnswer().toLowerCase() === word.toLowerCase()) {
      setMessage("Correct! 🌱 Press Enter for next word");
      setIsRoundOver(true);
      clearInterval(intervalId);
    } else {
      const newPenalties = penalties + 10;
      setPenalties(newPenalties);
      setMessage("Try again! -10 points");
      setWrongGuesses(g => g + 1);
      if (60 - timer - newPenalties <= 0) {
        setScore(0);
        setMessage("Time's up! The word was: " + word + ". Press Enter for next word");
        setIsRoundOver(true);
      }
    }
  }

  function nextWord() {
    setIsRoundOver(false);
    const completedWord = remaining[current];

    const finalWordScore = Math.max(0, score);
    setTotalScore(prev => prev + finalWordScore);
    setHighestScore(prev => Math.max(prev, finalWordScore));
    setWordsCompleted(prev => prev + 1);
    setAverageScore(prev => {
      const newTotal = prev * (wordsCompleted) + finalWordScore;
      return Math.round(newTotal / (wordsCompleted + 1));
    });

    setGarden((prev) =>
      prev.some((w) => w.word === completedWord.word) ? prev : [...prev, completedWord]
    );

    const newRemaining = remaining.filter((_, idx) => idx !== current);
    if (newRemaining.length === 0) {
      setRemaining([]);
      setMessage("Congratulations! You've completed all words.");
      setIsRoundOver(true);
      return;
    }
    const newIdx = getRandomIndex(newRemaining);
    setRemaining(newRemaining);
    setCurrent(newIdx);
  }

  function resetGame() {
    if (window.confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      localStorage.removeItem(`growcabulary_state_${wordBankType}`);
      window.location.reload();
    }
  }

  function forceReset() {
    localStorage.removeItem(`growcabulary_state_${wordBankType}`);
    window.location.reload();
  }

  // --- Word Bank Selector Handler ---
  function handleWordBankChange(bank) {
    // Load the saved state for the selected word bank
    const savedState = loadGameState(bank.type);

    // Update all the state values with the saved data or reset them
    setGarden(savedState?.seedBank || []);
    setTotalScore(savedState?.totalScore || 0);
    setHighestScore(savedState?.highestScore || 0);
    setWordsCompleted(savedState?.wordsCompleted || 0);
    setAverageScore(savedState?.averageScore || 0);

    // Set the new word bank type
    setWordBankType(bank.type);
    setShowBankDropdown(false);

    // Reset the current game state
    setWrongGuesses(0);
    setMessage("");
    setScore(60);
    setTimer(0);
    setPenalties(0);
    setIsRoundOver(false);

    // Clear any existing timer
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded shadow text-red-700">
          <div className="font-bold mb-2">Error:</div>
          <div>{error}</div>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={forceReset}
          >
            Force Reset
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !Array.isArray(remaining) || remaining.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded shadow">
          <div className="text-green-700 font-bold">Loading words...</div>
          <div className="text-sm text-green-600 mt-2">Please wait while we prepare your vocabulary garden.</div>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={forceReset}
          >
            Force Reset
          </button>
        </div>
      </div>
    );
  }

  const currentWord = remaining[current];
  const word = currentWord.word;
  const wordLength = word.length;
  const revealedCount = Math.min(Math.floor(timer / 5), word.length);

  // Always focus the input when the bar is clicked
  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="min-h-screen flex flex-col bg-green-50 font-sans">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => {
                setShowWelcome(false);
                localStorage.setItem('growcabulary_welcome_dismissed', '1');
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
              <span role="img" aria-label="seedling" className="mr-2">🌱</span>
              Welcome to Growcabulary!
            </h2>
            <div className="space-y-4 text-green-900">
              <p className="leading-relaxed">
                Cultivate your lexicon by learning and practicing complex English words. Try to guess the word using its definition, origin, and other hints.
              </p>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">How to Play:</h3>
                <ul className="list-disc pl-5 space-y-2 text-green-800">
                  <li>Each round starts with <span className="font-semibold">50 points</span></li>
                  <li>Points decrease as time passes (1 point per second)</li>
                  <li>Wrong guesses cost 10 points each</li>
                  <li>A letter is revealed every 5 seconds as a hint</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">Track Your Progress:</h3>
                <ul className="list-disc pl-5 space-y-2 text-green-800">
                  <li>Successfully guessed words go to your <span className="font-semibold">Garden</span></li>
                  <li>Your score and Garden will be saved in your browser.</li>
                  <li>You can download your Garden anytime as a CSV file.</li>
                </ul>
              </div>
            </div>
            <button
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full font-semibold transition-colors"
              onClick={() => {
                setShowWelcome(false);
                localStorage.setItem('growcabulary_welcome_dismissed', '1');
              }}
            >
              Start Growing Your Vocabulary! 🌱
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md p-2 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="text-green-800">Words:</span>
              <span className="ml-1 font-semibold text-green-900">{wordsCompleted}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-800">Total:</span>
              <span className="ml-1 font-semibold text-green-900">{totalScore}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-800">Best:</span>
              <span className="ml-1 font-semibold text-green-900">{highestScore}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-800">Avg:</span>
              <span className="ml-1 font-semibold text-green-900">{averageScore}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Seed Bank Selector */}
            <div className="relative">
              <button
                className="bg-green-200 text-green-900 px-2 py-1 rounded hover:bg-green-300 font-semibold"
                onClick={() => setShowBankDropdown(v => !v)}
                title="Change word bank"
              >
                Seed Bank: {WORD_BANKS.find(b => b.type === wordBankType)?.label}
                <span className="ml-1">▼</span>
              </button>
              {showBankDropdown && (
                <div className="absolute right-0 mt-1 bg-white border rounded shadow z-20">
                  {WORD_BANKS.map(bank => (
                    <button
                      key={bank.type}
                      className={`block w-full text-left px-4 py-2 hover:bg-green-100 ${wordBankType === bank.type ? 'font-bold text-green-700' : ''}`}
                      onClick={() => handleWordBankChange(bank)}
                    >
                      {bank.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-green-600 italic">
              🎯
            </div>
            <button
              onClick={resetGame}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              title="Reset all progress"
            >
              Reset Game
            </button>
            <button
              onClick={forceReset}
              className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
              title="Force clear all saved data"
            >
              Force Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-2 border-green-200">
          <h1 className="text-3xl font-bold text-green-700 mb-4 flex items-center">
            <span role="img" aria-label="plant" className="mr-2">🌿</span> Growcabulary 🌿
          </h1>
          {currentWord && (
            <>
              <div className="mb-2">
                <span className="font-semibold text-green-800">Form:</span>
                <span className="ml-2 text-green-900">{currentWord.form}</span>
              </div>

              <div className="mb-2">
                <span className="font-semibold text-green-800">Origin:</span>
                <span className="ml-2 text-green-900">{currentWord.origin} {getOriginEmoji(currentWord.origin)}</span>
              </div>

              <div className="mb-4">
                <span className="font-semibold text-green-800">Definition:</span>
                <div className="italic">{currentWord.definition}</div>
              </div>

              {(isRoundOver || wrongGuesses > 0) && (
                <div className="mb-2">
                  <span className="font-semibold text-green-800">Example:</span>
                  <div className="text-green-900">
                    {isRoundOver
                      ? currentWord.example
                      : maskWordInExample(currentWord.example, currentWord.word)}
                  </div>
                </div>
              )}

              {(isRoundOver || wrongGuesses > 1) && (
                <div className="mb-2">
                  <span className="font-semibold text-green-800">Etymology:</span>
                  <div
                    className="text-green-900"
                    dangerouslySetInnerHTML={{ __html: currentWord.etymology }}
                  ></div>
                </div>
              )}

              {/* --- Custom Input Bar --- */}
              <div className="flex flex-col mb-2">
                <div
                  className="flex justify-center cursor-text mb-2"
                  tabIndex={0}
                  onClick={focusInput}
                  style={{ outline: "none" }}
                >
                  {word.split('').map((letter, i) => {
                    const isRevealed = i < revealedCount;
                    const isCurrent = i === cursor && !isRevealed && !isRoundOver;
                    return (
                      <span
                        key={i}
                        className={`
                          inline-block w-8 h-10 border-b-2
                          font-mono text-xl text-center mx-0.5
                          transition-all duration-150
                          ${isRevealed ? 'border-green-600 text-green-800 bg-green-50 cursor-not-allowed' :
                            isCurrent ? 'border-blue-500 text-blue-900 bg-blue-50 animate-pulse cursor-text' :
                              'border-gray-300 text-green-900 cursor-text'}
                        `}
                        onClick={() => {
                          if (!isRevealed && !isRoundOver) setCursor(i);
                          focusInput();
                        }}
                      >
                        {isRevealed ? letter : guess[i] || '_'}
                      </span>
                    );
                  })}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value=""
                  onChange={() => { }} // Prevent React warning
                  style={{ position: "absolute", left: "-9999px" }}
                  onBlur={() => {
                    if (inputRef.current) setTimeout(() => inputRef.current.focus(), 10);
                  }}
                  onKeyDown={e => {
                    if (isRoundOver) {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        nextWord();
                      }
                      // Block all other keys when round is over
                      return;
                    }
                    // --- normal editing logic below ---
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const word = remaining[current]?.word || "";
                      const revealedCount = Math.min(Math.floor(timer / 5), word.length);
                      if (buildFullAnswer().toLowerCase() === word.toLowerCase()) {
                        checkAnswer();
                      } else {
                        const newPenalties = penalties + 10;
                        setPenalties(newPenalties);
                        setMessage("Try again! -10 points");
                        setWrongGuesses(g => g + 1);
                        if (100 - timer - newPenalties <= 0) {
                          setScore(0);
                          setMessage("Time's up! The word was: " + word + ". Press Enter for next word");
                          setIsRoundOver(true);
                        }
                      }
                      return;
                    }
                    // Handle letter input
                    if (/^[a-zA-Z]$/.test(e.key)) {
                      e.preventDefault();
                      const nextIdx = getNextEmptyIndex(guess, revealedCount);
                      if (nextIdx < wordLength) {
                        setGuess(g => {
                          const newG = [...g];
                          newG[nextIdx] = e.key;
                          return newG;
                        });
                        // Move cursor to next empty unrevealed box
                        let i = nextIdx + 1;
                        while (i < wordLength && guess[i]) i++;
                        setCursor(i < wordLength ? i : nextIdx);
                      }
                      return;
                    }

                    // Handle Backspace
                    if (e.key === "Backspace") {
                      e.preventDefault();
                      const prevIdx = getLastFilledIndex(guess, revealedCount);
                      if (prevIdx >= revealedCount) {
                        setGuess(g => {
                          const newG = [...g];
                          newG[prevIdx] = '';
                          return newG;
                        });
                        setCursor(prevIdx);
                      }
                      return;
                    }

                    // Handle arrow keys
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      let i = cursor - 1;
                      while (i >= revealedCount && guess[i] === '' && i > revealedCount) i--;
                      if (i >= revealedCount) setCursor(i);
                    } else if (e.key === "ArrowRight") {
                      e.preventDefault();
                      let i = cursor + 1;
                      while (i < wordLength && guess[i] !== '') i++;
                      if (i < wordLength) setCursor(i);
                    }
                  }}
                  disabled={false}
                  autoFocus
                  spellCheck={false}
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
                  onClick={() => {
                    if (isRoundOver) {
                      nextWord();
                      return;
                    }
                    const word = remaining[current]?.word || "";
                    const revealedCount = Math.min(Math.floor(timer / 5), word.length);
                    if (buildFullAnswer().toLowerCase() === word.toLowerCase()) {
                      checkAnswer();
                    } else {
                      const newPenalties = penalties + 10;
                      setPenalties(newPenalties);
                      setMessage("Try again! -10 points");
                      setWrongGuesses(g => g + 1);
                      if (100 - timer - newPenalties <= 0) {
                        setScore(0);
                        setMessage("Time's up! The word was: " + word + ". Press Enter for next word");
                        setIsRoundOver(true);
                      }
                    }
                  }}
                >
                  {isRoundOver ? "Next Word" : "Submit"}
                </button>
              </div>
              {/* --- End Custom Input Bar --- */}

              <div className="flex justify-between items-center mb-2">
                <span className="text-green-700 font-semibold">Score: {score}</span>
                <span className="text-green-700">⏱️ {timer}s</span>
              </div>
            </>
          )}
          <div className="h-6 text-center text-green-800 font-bold">{message}</div>
          {isRoundOver && remaining.length > 0 ? (
            <div className="text-center text-green-600 text-sm mt-4">
              Press <b>Enter</b> for next word
            </div>
          ) : null}
        </div>

        {/* Garden (Words Learned) Section */}
        <div className="mt-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-green-700 mb-2 flex items-center">
            <span role="img" aria-label="garden" className="mr-2">🌸</span>
            Garden (Words Learned: {garden.length})
          </h2>
          <div className="text-green-600 text-sm mb-3 bg-green-50 p-2 rounded">
            Currently viewing: <span className="font-semibold">{WORD_BANKS.find(b => b.type === wordBankType)?.label}</span> word bank
          </div>
          {garden.length === 0 ? (
            <div className="text-green-800 italic">No words learned yet.</div>
          ) : (
            <ul className="list-disc pl-6">
              {garden.map((w, index) => (
                <li key={`${w.word}-${index}`} className="mb-2 flex items-baseline">
                  <span className="mr-2">{getOriginEmoji(w.origin)}</span>
                  <span>
                    <span className="font-semibold text-green-900">{w.word}</span>{" "}
                    <span className="text-green-700">({w.form})</span>
                    <span className="text-green-600"> [{w.origin}]</span>:{" "}
                    <span className="italic text-green-800">{w.definition}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {garden.length > 0 && (
            <div className="mt-6 flex flex-col items-center">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mb-2"
                onClick={() => downloadCSV(garden, setDownloadUrl)}
              >
                Download Garden as CSV
              </button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="growcabulary_garden.csv"
                  className="text-blue-700 underline text-sm mt-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  If download didn't start, click here to save your CSV
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
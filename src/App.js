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
  { type: 'uncommon', label: '🌴Uncommon', csv: '/growcabulary_words_uncommon.csv' },
  { type: 'rare', label: '🪷Rare', csv: '/growcabulary_words_rare.csv' },
  { type: 'exotic', label: '🪻Exotic', csv: '/growcabulary_words_exotic.csv' },
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
  const [wordBankType, setWordBankType] = useState(() => {
    // Load saved seed bank or default to 'uncommon'
    return localStorage.getItem('growcabulary_selected_seedbank') || 'uncommon';
  });
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('growcabulary_selected_seedbank');
  });
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  // Help modal state
  const [showHelp, setShowHelp] = useState(false);

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
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  // Track progress per seed bank type
const [roundProgress, setRoundProgress] = useState({
  uncommon: { currentRound: 1, scores: [] },
  rare: { currentRound: 1, scores: [] },
  exotic: { currentRound: 1, scores: [] },
});
// Current round's score
const [currentRoundScore, setCurrentRoundScore] = useState(0);
// Modal state for round results
const [showRoundResult, setShowRoundResult] = useState(false);

// Calculate highest score for current seed bank
const [roundWordsCompleted, setRoundWordsCompleted] = useState({
  uncommon: 0,
  rare: 0,
  exotic: 0,
});

const [completedRound, setCompletedRound] = useState(null);

const currentBank = roundProgress[wordBankType];
const highestRoundScore = currentBank.scores.length > 0 
  ? Math.max(...currentBank.scores) 
  : 0;

  // For custom input bar
  const inputRef = useRef(null);
  const [guess, setGuess] = useState([]);
  const [cursor, setCursor] = useState(0);

  const [animation, setAnimation] = useState(null); // 'success' or 'failure'

  const modalRef = useRef(null);


  // CSV loading and robust state validation
  useEffect(() => {
    console.log('CSV effect:', { wordBankType, showWelcome });
    if (!wordBankType || showWelcome) return; // Don't load if welcome is showing or no bank selected
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
  }, [wordBankType, showWelcome]);

  useEffect(() => {
    if (wordsCompleted > 0) {
      saveGameState({
        seedBank: garden,
        totalScore,
        wordsCompleted,
        averageScore,
        remaining
      }, wordBankType);
    }
  }, [wordsCompleted, garden, totalScore, averageScore, remaining, wordBankType]);

  // Round reset effect: runs when current word or remaining list changes
useEffect(() => {
  if (!Array.isArray(remaining) || !remaining[current]) return;

  // Clear any existing timer
  if (intervalId) {
    clearInterval(intervalId);
    setIntervalId(null);
  }

  setWrongGuesses(0);
  setMessage("");
  setScore(60);  // Reset score here
  setTimer(0);
  setPenalties(0);
  setIsRoundOver(false);
  setRevealedCount(0);

  // Reset guess and cursor
  const word = remaining[current].word;
  setGuess(Array(word.length).fill(''));
  setCursor(0);

  if (inputRef.current) inputRef.current.focus();

// Start new timer interval
const id = setInterval(() => {
  setTimer(prev => {
    const newTimer = prev + 1;
    const wordLength = remaining[current]?.word.length || 0;
    const newRevealedCount = Math.min(Math.floor(newTimer / 5), wordLength);
    setRevealedCount(newRevealedCount);

    // New logic: Set score to 0 if all letters are revealed
    if (newRevealedCount >= wordLength) {
      setScore(0);
      setMessage("All letters revealed! The word was: " + remaining[current]?.word + ".");
      setIsRoundOver(true);
      clearInterval(id);
      return newTimer; // Exit early
    }

    // Existing timeout logic
    if (newTimer >= 60) {
      clearInterval(id);
      setMessage("Nice try! The word was: " + remaining[current]?.word + ".");
      setScore(0);
      setIsRoundOver(true);
      return 60;
    }
    return newTimer;
  });
}, 1000);

  setIntervalId(id);

  // Cleanup on unmount or when current/remaining changes
  return () => {
    clearInterval(id);
    setIntervalId(null);
  };
}, [current, remaining]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  });

  useEffect(() => {
    if (showRoundResult && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showRoundResult]);

// Add the effect to check for all letters revealed
useEffect(() => {
  const word = remaining[current]?.word || "";
  if (!isRoundOver && word && revealedCount >= word.length) {
    setScore(0);
    setMessage("All letters revealed! The word was: " + word + ".");
    setIsRoundOver(true);
    setAnimation('failure'); // Trigger wilting animation
    if (intervalId) clearInterval(intervalId);
  }
}, [revealedCount, isRoundOver, remaining, current, intervalId]);

  useEffect(() => {
    if (timer >= 60 || isRoundOver) return;
    const newScore = Math.max(0, 60 - timer - penalties);
    setScore(newScore);
    if (newScore <= 0) {
      const currentWord = remaining[current]?.word || "";
      setMessage("Time's up! The word was: " + currentWord + ".");
      setIsRoundOver(true);
      setAnimation('failure'); // Trigger wilting animation
    }
  }, [timer, penalties, isRoundOver, remaining, current]);

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
    const isFullyRevealed = revealedCount >= word.length;
  
    if (buildFullAnswer().toLowerCase() === word.toLowerCase()) {
      setAnimation('success'); // Trigger seedling animation
      const points = isFullyRevealed ? 0 : score; // Only award points if the word wasn't fully revealed
      setMessage("Correct!");
      setCurrentRoundScore(prev => prev + score); // Add current score to round total
      setIsRoundOver(true);
      clearInterval(intervalId);
    } else {
      const newPenalties = penalties + 10;
      setPenalties(newPenalties);
      setMessage("Try again! -10 points");
      setWrongGuesses(g => g + 1);
      
      // End round if score would drop to 0
      if (60 - timer - newPenalties <= 0) {
        setScore(0);
        setMessage("Nice try! The word was: " + word + ".");
        setIsRoundOver(true);
        setAnimation('failure'); // Trigger wilting animation
      }
    }
  }

  // Define handleInput inside your App component
  function handleInput(e) {
    const inputText = e.target.textContent || "";
    const word = remaining[current]?.word || "";
    const currentGuess = [...guess];
  
    // Find first empty unrevealed position
    let nextIdx = revealedCount;
    while (nextIdx < word.length && currentGuess[nextIdx]) {
      nextIdx++;
    }
  
    // Process each new character typed
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      if (/^[a-z]$/i.test(char) && nextIdx < word.length) {
        currentGuess[nextIdx] = char;
        nextIdx++;
      }
    }
  
    setGuess(currentGuess);
    e.target.textContent = ""; // Clear input after processing
  }


  // Next word handler: called when user finishes a round
function nextWord() {
  if (!remaining[current]) return;

  const completedWord = remaining[current];
  const isFullyRevealed = revealedCount >= completedWord.word.length;
  const finalWordScore = isFullyRevealed ? 0 : Math.max(0, score);

  const wordBankKey = wordBankType;
  // Add current score to round's total
  const newRoundScore = currentRoundScore + (isRoundOver ? 0 : score);
  setCurrentRoundScore(newRoundScore);

  // Update words completed overall and in current round
  setWordsCompleted(prev => prev + 1);
  setRoundWordsCompleted(prev => ({
    ...prev,
    [wordBankKey]: (prev[wordBankKey] || 0) + 1,
  }));

// Check if round of 10 words is complete
if ((roundWordsCompleted[wordBankKey] || 0) + 1 >= 10) {
  // Save this round's score
  setRoundProgress(prev => ({
    ...prev,
    [wordBankKey]: {
      ...prev[wordBankKey],
      scores: [
        ...(prev[wordBankKey].scores || []),
        newRoundScore,
      ],
      currentRound: (prev[wordBankKey]?.currentRound || 1) + 1,
    },
  }));

  // Save this round's score and current round number
  setCompletedRound({
    roundNumber: roundProgress[wordBankType].currentRound,
    score: newRoundScore,
  });

  setAnimation(null); // Clear previous animation
  // Show the completion modal
  setShowRoundResult(true);

  // Do NOT update roundProgress or reset score yet!
  return; // Exit early to prevent state updates until modal is dismissed

// Reset round score and round words completed for this bank
setCurrentRoundScore(0);
setRoundWordsCompleted(prev => ({
  ...prev,
  [wordBankKey]: 0,
}));

  }

  // Update garden and stats atomically
  setGarden(prev => prev.some(w => w.word === completedWord.word) ? prev : [...prev, completedWord]);
  setTotalScore(prev => prev + finalWordScore);
  setAverageScore(prev => {
    const newTotal = prev * wordsCompleted + finalWordScore;
    return Math.round(newTotal / (wordsCompleted + 1));
  });
  setAnimation(null); // Clear previous animation

  // Remove completed word from remaining
  setRemaining(prevRemaining => {
    const newRemaining = prevRemaining.filter((_, idx) => idx !== current);
    if (newRemaining.length === 0) {
      setMessage("Congratulations! You've completed all words.");
      setIsRoundOver(true);
      setCurrent(0);
      return [];
    }
    // Pick new random index for next word
    const newIdx = getRandomIndex(newRemaining);
    setCurrent(newIdx);
    return newRemaining;
  });

  setIsRoundOver(false);
  setWrongGuesses(0);
  setMessage("");
  setScore(60);
  setTimer(0);
  setPenalties(0);
  setRevealedCount(0);
  setGuess([]);
  setCursor(0);

  if (inputRef.current) inputRef.current.focus();
}

  function resetGame() {
    if (window.confirm('Are you sure you want to reset your garden for the current seed bank? This cannot be undone. Only the selected garden will be reset.')) {
      // Clear only the current seed bank's data
      localStorage.removeItem(`growcabulary_state_${wordBankType}`);
      localStorage.removeItem('growcabulary_selected_seedbank');  // Clear seed bank choice
      localStorage.removeItem(`growcabulary_round_progress_${wordBankType}`); // clear number of rounds
      setShowWelcome(true);  // Show welcome modal again
      
      // Reset game state for the current bank only
      setGarden([]);
      setTotalScore(0);
      setWordsCompleted(0);
      setCurrentRoundScore(0);
      setAverageScore(0);
      setRoundWordsCompleted(prev => ({
        ...prev,
        [wordBankType]: 0,
      }));

      // Reset round progress (currentRound and scores)
    setRoundProgress(prev => ({
      ...prev,
      [wordBankType]: {
        currentRound: 1,
        scores: [],
      },
    }));
      
      // Reload words for the current bank (fresh start)
      setRemaining([...words]);
      setCurrent(getRandomIndex(words));
      
      // Reset round-specific states
      setScore(60);
      setTimer(0);
      setPenalties(0);
      setIsRoundOver(false);
      setRevealedCount(0);
      setGuess([]);

      if (inputRef.current) inputRef.current.focus();
    }
  }

  function forceReset() {
    localStorage.removeItem(`growcabulary_state_${wordBankType}`);
    setGarden([]);
    setTotalScore(0);
    setWordsCompleted(0);
    setCurrentRoundScore(0);
    setAverageScore(0);
    setRemaining([...words]);
    setCurrent(getRandomIndex(words));
  }
  function selectSeedBank(type) {
    localStorage.setItem('growcabulary_selected_seedbank', type);
    setWordBankType(type);
    setShowWelcome(false);
    setCurrentRoundScore(0);
setRoundWordsCompleted(prev => ({
  ...prev,
  [type]: 0,
}));
  }
  

  // --- Word Bank Selector Handler ---
  // --- Word Bank Selector Handler ---
function handleWordBankChange(bank) {
  // Load the saved state for the selected word bank
  const savedState = loadGameState(bank.type);

  // Set the new word bank type first
  setWordBankType(bank.type);
  setShowBankDropdown(false);

  // Clear any existing timer
  if (intervalId) {
    clearInterval(intervalId);
    setIntervalId(null);
  }

  // Fetch the words for the new bank
  const selectedBank = WORD_BANKS.find(b => b.type === bank.type) || WORD_BANKS[0];
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
            // If we have saved state and it matches the current CSV data
            if (
              savedState &&
              Array.isArray(savedState.remaining) &&
              savedState.remaining.length > 0 &&
              savedState.remaining.every(w => w.word && results.data.some(d => d.word === w.word))
            ) {
              setGarden(savedState.seedBank || []);
              setTotalScore(savedState.totalScore || 0);
              setWordsCompleted(savedState.wordsCompleted || 0);
              setAverageScore(savedState.averageScore || 0);
              setWords(results.data);
              setRemaining(savedState.remaining);
              setCurrent(getRandomIndex(savedState.remaining));
            } else {
              // If no valid saved state, start fresh with this word bank
              setWords(results.data);
              setRemaining([...results.data]);
              setCurrent(getRandomIndex(results.data));
              setGarden([]);
              setTotalScore(0);
              setWordsCompleted(0);
              setAverageScore(0);
            }

            // Reset current game state
            setWrongGuesses(0);
            setMessage("");
            setScore(60);
            setTimer(0);
            setPenalties(0);
            setIsRoundOver(false);
            setRevealedCount(0);
            setGuess([]);
            setCursor(0);
          }
        }
      });
    })
    .catch(error => {
      setError("Error loading word bank: " + error.message);
    });

    setCurrentRoundScore(0);
}

const handleRoundCompletion = () => {
  // Update round progress and reset states
  setRoundProgress(prev => ({
    ...prev,
    [wordBankType]: {
      ...prev[wordBankType],
      scores: [
        ...(prev[wordBankType].scores || []),
        completedRound.score,
      ],
      currentRound: prev[wordBankType].currentRound + 1,
    },
  }));

  // Reset round-specific states
  setCurrentRoundScore(0);
  setRoundWordsCompleted(prev => ({
    ...prev,
    [wordBankType]: 0,
  }));
  setCompletedRound(null);
  setShowRoundResult(false);

  // Reset game states for new round
  setRemaining([...words]);
  const newCurrent = getRandomIndex(words);
  setCurrent(newCurrent);

  // Reset gameplay states
  setScore(60);
  setTimer(0);
  setPenalties(0);
  setIsRoundOver(false);
  setRevealedCount(0);
  setGuess([]);
  setCursor(0);

  // Start new round's timer
  if (inputRef.current) inputRef.current.focus();
};


if (showWelcome) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Welcome to Growcabulary!</h2>
        <p className="mb-4 text-green-900">
          A word-based game for building your vocabulary and learning new words. Cultivate your lexicon by matching words to their definition, length and origin.
        </p>
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h3 className="font-bold text-green-800 mb-2">How to Play:</h3>
          <ul className="list-disc pl-5 space-y-2 text-green-800">
            <li>Each word starts with <span className="font-semibold">60 points</span></li>
            <li>Points decrease as time passes. A letter is revealed every 5 seconds</li>
            <li>Wrong guesses cost 10 points but reveal a hint</li>
            <li>Scores are tracked over rounds of 10 words</li>
            <li>Aim for the highest score in a round!</li>
          </ul>
        </div>
        <p className="mb-4 text-green-900">
          To <span className="font-semibold">start</span>, choose what seeds to sow in your garden:
        </p>
        <div className="space-y-4">
          {WORD_BANKS.map(bank => (
            <button
              key={bank.type}
              onClick={() => selectSeedBank(bank.type)}
              className="w-full bg-green-200 hover:bg-green-300 text-green-900 font-semibold py-3 rounded"
            >
              <span className="font-bold">{bank.label}</span> Seed Bank
              <p className="text-sm mt-1 text-green-700">
                {bank.type === 'uncommon' && 'Familiar yet intriguing words.'}
                {bank.type === 'rare' && 'Challenging words to diversify your vocabulary.'}
                {bank.type === 'exotic' && 'Prepare to be vexed!'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
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

  // Always focus the input when the bar is clicked
  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="min-h-screen flex flex-col bg-green-50 font-sans">
      {/* Score summary bar */}
      <div className="bg-white shadow-md p-2 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="text-green-800"> Current:</span>
              <span className="ml-1 font-semibold text-green-900"><strong>{currentRoundScore}</strong></span>
            </div>
            <div className="flex items-center">
              <span className="text-green-800">High:</span>
              <span className="ml-1 font-semibold text-green-900">{highestRoundScore}</span>
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
            <button
              onClick={resetGame}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              title="Reset all progress"
            >
              Reset Game
            </button>
          </div>
        </div>
      </div>

      {showWelcome && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Welcome to Growcabulary!</h2>
      <p className="mb-4 text-green-900">
      Cultivate your lexicon by guessing words using their definition, length and other hints. 
      </p>

      <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">How to Play:</h3>
                <ul className="list-disc pl-5 space-y-2 text-green-800">
                  <li>Every round is 10 words.</li>
                  <li>Each word starts at <span className="font-semibold">60 points</span></li>
                  <li>Points decrease as time passes (1 point per second)</li>
                  <li>Wrong guesses cost 10 points each</li>
                  <li>A letter is revealed every 5 seconds as a hint</li>
                  <li>Aim for the highest score in a round!</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">How to Play:</h3>
                <ul className="list-disc pl-5 space-y-2 text-green-800">

                  <li>To start, choose a Seed Bank of words to sow in your garden:</li>
                </ul>
              </div>
      T

      <div className="space-y-4">
        {WORD_BANKS.map(bank => (
          <button
            key={bank.type}
            onClick={() => selectSeedBank(bank.type)}
            className="w-full bg-green-200 hover:bg-green-300 text-green-900 font-semibold py-3 rounded"
          >
            <span className="font-bold">{bank.label}</span> Seed Bank
            <p className="text-sm mt-1 text-green-700">
              {/* Add brief description here */}
              {bank.type === 'uncommon' && 'Familiar yet intriguing words.'}
              {bank.type === 'rare' && 'Challenging words to diversify your .'}
              {bank.type === 'exotic' && 'Prepare to be vexed!'}
            </p>
          </button>
        ))}
      </div>
    </div>
  </div>
)}

{showRoundResult && (
  <div 
  ref={modalRef}
    tabIndex={-1} // focusable but not in tab order
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      // Trigger the same logic as the button click
      e.preventDefault();
        e.stopPropagation();
        handleRoundCompletion();
    }
  }}
  tabIndex={0} // Required for onKeyDown to work
  autoFocus    // Auto-focus the modal when it appears
>
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
      <h3 className="text-2xl mb-4">🌱 Round Results</h3>
      <p className="text-green-700 mb-4">
        You scored: <strong>{completedRound?.score}</strong> points in Round <strong>{completedRound?.roundNumber}</strong>!
      </p>
      <button
onClick={handleRoundCompletion}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
      >
        Continue to Next Round
      </button>
    </div>
  </div>
)}

<div className="flex flex-col items-center">
  <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-6 text-center">
    <div className="grid grid-cols-3 gap-4">
      <div>
        <div className="text-sm text-green-600">Round</div>
        <div className="text-xl font-bold">{roundProgress[wordBankType].currentRound}</div>
      </div>
      <div>
        <div className="text-sm text-green-600">Score</div>
        <div className="text-xl font-bold">{currentRoundScore}</div>
      </div>
      <div>
        <div className="text-sm text-green-600">Remaining Words</div>
        <div className="text-xl font-bold">{10 - (roundWordsCompleted[wordBankType] || 0)}</div>
      </div>
    </div>
  </div>
  </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-2 border-green-200">
          {/* Main game title and Help button */}
          <div className="flex items-center mb-4">
            <h1 className="text-3xl font-bold text-green-700 flex items-center">
              <span role="img" aria-label="plant" className="mr-2">🌿</span> Growcabulary
            </h1>
            <button
              className="ml-3 px-3 py-1 bg-green-200 text-green-900 rounded hover:bg-green-300 transition"
              onClick={() => setShowHelp(true)}
              aria-label="Show help"
            >
              Help
            </button>
          </div>

          {/* Help Modal */}
          {showHelp && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-green-700 text-xl"
                  onClick={() => setShowHelp(false)}
                  aria-label="Close help"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold mb-2 text-green-800">How to Play</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Guess the word using the definition and word length.</li>
                  <li>Hints and letters are revealed as you make incorrect guesses or as time passes.</li>
                  <li>Each word starts at 60 points. Points decrease over time and with wrong guesses</li>
                  <li>Every round is 10 words.  Try to get the highest score for each round!</li>
                  <li>Choose your seed bank to determine the difficulty and rarity of words that will be used.</li>
                  <li>The word garden and scores are stored locally. Each seed bank has their own score and garden.</li>
                  <li>Completed words are added to your Garden, which you can download as a CSV.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Main game area */}
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
              {/* --- Custom Input Bar (Mobile-Optimized) --- */}
<div className="flex flex-col mb-2">
  <div
    className="flex justify-center cursor-text mb-2"
    tabIndex={0}
    onClick={focusInput}
    onTouchStart={(e) => {
      // Mobile: move cursor to tapped box
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const boxWidth = rect.width / word.length;
      const tappedIndex = Math.floor(x / boxWidth);
      if (tappedIndex >= revealedCount && tappedIndex < word.length) {
        setCursor(tappedIndex);
      }
      focusInput();
    }}
    style={{ outline: "none" }}
  >
    {word.split('').map((letter, i) => {
  const isRevealed = i < revealedCount;
  const isCurrent = i === cursor && !isRevealed && !isRoundOver;
  const displayChar = isRoundOver 
    ? letter  // Show full word when round is over
    : isRevealed 
      ? letter  // Show revealed letters
      : guess[i] || '_';  // Show guesses or underscore

  return (
    <span
      key={i}
      className={`
        inline-block w-8 h-10 border-b-2
        font-mono text-xl text-center mx-0.5
        ${isRevealed || isRoundOver 
          ? 'text-green-800 border-green-600' 
          : 'text-gray-800 border-gray-300'
        }
      `}
      onClick={(e) => {
        e.stopPropagation();
        if (!isRevealed && !isRoundOver) {
          setCursor(i);
          inputRef.current?.focus();
        }
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        if (!isRevealed && !isRoundOver) {
          setCursor(i);
          inputRef.current?.focus();
        }
      }}
    >
{displayChar}
    </span>
  );
})}
  </div>
  <div
  ref={inputRef}
  contentEditable
  suppressContentEditableWarning
  style={{
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
    pointerEvents: isRoundOver ? "none" : "auto", // Disable input
    color: "transparent",
    background: "transparent",
    border: "none",
    caretColor: "transparent",
    zIndex: 10,
  }}
  onInput={handleInput}
  onKeyDown={(e) => {
    if (isRoundOver) {
      if (e.key === "Enter") {
        e.preventDefault();
        nextWord();
      }
      return;
    }

    // Handle Backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      const prevIdx = getLastFilledIndex(guess, revealedCount);
      if (prevIdx >= revealedCount) {
        const newGuess = [...guess];
        newGuess[prevIdx] = '';
        setGuess(newGuess);
        setCursor(prevIdx);
      }
      return;
    }

    // Handle Enter
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
      return;
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      let i = cursor - 1;
      while (i >= 0 && i < revealedCount) i--;
      if (i >= revealedCount) setCursor(i);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      let i = cursor + 1;
      while (i < word.length && i < revealedCount) i++;
      if (i < word.length) setCursor(i);
    }
  }}
  autoFocus
  inputMode="text"
  autoCapitalize="none"
  autoCorrect="off"
  spellCheck={false}
  tabIndex={0}
/>
  <button
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
    onClick={() => {
      if (isRoundOver) {
        nextWord();
        return;
      }
      checkAnswer();
    }}
  >

    {isRoundOver ? "Next Word" : "Submit"}
  </button>

  {animation === 'success' && (
  <div className="animate-bounce text-center my-4">
    <span className="text-4xl">🌱</span>
  </div>
)}

{animation === 'failure' && (
  <div className="animate-wiggle text-center my-4">
    <span className="text-4xl">🥀</span>
  </div>
)}
</div>
<div className="h-6 text-center text-green-800 font-bold">{message}</div>
              {/* --- End Custom Input Bar --- */}

              <div className="flex justify-between items-center mb-2">
                <span className="text-green-700 font-semibold">Score: {score}</span>
                <span className="text-green-700">⏱️ {timer}s</span>
              </div>
            </>
          )}

        </div>

        {/* Garden (Words Learned) Section */}
        <div className="mt-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-green-700 mb-2 flex items-center">
            <span role="img" aria-label="garden" className="mr-2">🌸</span>
            Garden (Cultivated words: {garden.length})
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



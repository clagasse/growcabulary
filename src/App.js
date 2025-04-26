import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import './App.css';

function downloadCSV(seedBank, setDownloadUrl) {
  if (!seedBank.length) return;
  const header = ["word", "form", "definition", "example", "etymology"];
  const rows = seedBank.map(w =>
    [w.word, w.form, w.definition, w.example, w.etymology].map(field =>
      '"' + String(field).replace(/"/g, '""') + '"'
    ).join(",")
  );
  const csvContent = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  setDownloadUrl(url);
  const a = document.createElement("a");
  a.href = url;
  a.download = "growcabulary_seed_bank.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

export default function App() {
  const [words, setWords] = useState([]);
  const [remaining, setRemaining] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(50);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [seedBank, setSeedBank] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [penalties, setPenalties] = useState(0);
  const inputRef = useRef(null);
const [totalScore, setTotalScore] = useState(0);
const [highestScore, setHighestScore] = useState(0);
const [wordsCompleted, setWordsCompleted] = useState(0);
const [averageScore, setAverageScore] = useState(0);



  // Load CSV on mount
   // Load saved state on initial mount
   useEffect(() => {
    console.log("Fetching CSV...");
    fetch(process.env.PUBLIC_URL + '/growcabulary_words_with_origin.csv')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              // Try to load saved state
              const savedState = loadGameState();
              if (savedState) {
                setSeedBank(savedState.seedBank);
                setTotalScore(savedState.totalScore);
                setHighestScore(savedState.highestScore);
                setWordsCompleted(savedState.wordsCompleted);
                setAverageScore(savedState.averageScore);
                setRemaining(savedState.remaining);
                setCurrent(getRandomIndex(savedState.remaining));
              } else {
                // No saved state, start fresh
                setWords(results.data);
                setRemaining([...results.data]);
                setCurrent(getRandomIndex(results.data));
              }
            } else {
              console.error("No data found in CSV");
            }
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
          }
        });
      })
      .catch(error => {
        console.error("CSV fetch error:", error);
      });
  }, []);

  // Save state after each word completion
  useEffect(() => {
    if (wordsCompleted > 0) {
      saveGameState({
        seedBank,
        totalScore,
        highestScore,
        wordsCompleted,
        averageScore,
        remaining
      });
    }
  }, [wordsCompleted, seedBank, totalScore, highestScore, averageScore, remaining]);

  // Timer effect
  useEffect(() => {
    if (!words.length || !remaining[current]) return;
    
    // Reset everything for new word
    setWrongGuesses(0);
    setInput("");
    setMessage("");
    setScore(50);
    setTimer(0);
    setRevealedCount(0);
    setPenalties(0);
    
    if (inputRef.current) inputRef.current.focus();
    
    // Create single timer
    const startTime = Date.now();
    const id = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      if (elapsedSeconds >= 50) {
        clearInterval(id);
        setTimer(50);
        setMessage("Time's up! The word was: " + remaining[current].word);
        return;
      }
      
      setTimer(elapsedSeconds);
      
      // Handle letter reveal every 5 seconds
      if (elapsedSeconds > 0 && elapsedSeconds % 5 === 0) {
        setRevealedCount(prev => {
          const word = remaining[current].word;
          return Math.min(prev + 1, word.length);
        });
      }
    }, 1000);
    
    setIntervalId(id);
    
    return () => clearInterval(id);
  }, [current, remaining, words.length]);

  // Score effect
  useEffect(() => {
    if (timer >= 50 || message.startsWith("Correct")) return;
    const newScore = Math.max(0, 50 - timer - penalties);
    setScore(newScore);
  }, [timer, penalties, message]);

  function saveGameState(state) {
    localStorage.setItem('growcabulary_state', JSON.stringify({
      seedBank: state.seedBank,
      totalScore: state.totalScore,
      highestScore: state.highestScore,
      wordsCompleted: state.wordsCompleted,
      averageScore: state.averageScore,
      remaining: state.remaining,
      lastSaved: new Date().toISOString()
    }));
  }
    
  function loadGameState() {
    const savedState = localStorage.getItem('growcabulary_state');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return null;
  }

  // Add a reset game function
  function resetGame() {
    if (window.confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      localStorage.removeItem('growcabulary_state');
      window.location.reload();
    }
  }

  function checkAnswer() {
    if (message.startsWith("Correct") || message.startsWith("Time's up")) return;
    
    if (input.trim().toLowerCase() === (remaining[current]?.word || "").toLowerCase()) {
      setMessage("Correct! 🌱");
      clearInterval(intervalId);
    } else {
      setPenalties(prev => prev + 10); // Add 10 to total penalties
      setMessage("Try again! -10 points");
      setWrongGuesses(g => g + 1);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  }

  function nextWord() {
    const completedWord = remaining[current];
    
    // Update scoring statistics
    const finalWordScore = Math.max(0, score); // Ensure non-negative
    setTotalScore(prev => prev + finalWordScore);
    setHighestScore(prev => Math.max(prev, finalWordScore));
    setWordsCompleted(prev => prev + 1);
    setAverageScore(prev => {
      const newTotal = prev * (wordsCompleted) + finalWordScore;
      return Math.round(newTotal / (wordsCompleted + 1));
    });
  
    // Add to seed bank
    setSeedBank((prev) =>
      prev.some((w) => w.word === completedWord.word) ? prev : [...prev, completedWord]
    );
  
    // Handle remaining words
    const newRemaining = remaining.filter((_, idx) => idx !== current);
    if (newRemaining.length === 0) {
      setRemaining([]);
      setMessage("Congratulations! You've completed all words.");
      return;
    }
    const newIdx = getRandomIndex(newRemaining);
    setRemaining(newRemaining);
    setCurrent(newIdx);
  }

  function maskWordInExample(example, word) {
    if (!example || !word) return "";
    const regex = new RegExp(word, "gi");
    return example.replace(regex, "_____");
  }

  const currentWord = remaining.length > 0 ? remaining[current] : null;
  let placeholder = '';
  if (currentWord && currentWord.word) {
    placeholder = currentWord.word
      .split('')
      .map((ch, i) => i < revealedCount ? ch : '_')
      .join(' ');
  }
  const roundOver =
    message.startsWith("Correct") ||
    message.startsWith("Time's up") ||
    message.startsWith("Congratulations");


    return (
      <div className="min-h-screen flex flex-col bg-green-50 font-sans">
        {/* Score Summary Header */}
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
              <div className="text-xs text-green-600 italic">
                🎯 Score as many points as you can!
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
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-2 border-green-200">
            <h1 className="text-3xl font-bold text-green-700 mb-4 flex items-center">
              <span role="img" aria-label="plant" className="mr-2">🌿</span> Growcabulary
            </h1>
            {currentWord && (
              <>
                <div className="mb-2">
                  <span className="font-semibold text-green-800">Form:</span>
                  <span className="ml-2 text-green-900">{currentWord.form}</span>
                </div>
                
                {/* Add Origin display here */}
                <div className="mb-2">
                  <span className="font-semibold text-green-800">Origin:</span>
                  <span className="ml-2 text-green-900">{currentWord.origin}</span>
                </div>
  
                <div className="mb-4">
                  <span className="font-semibold text-green-800">Definition:</span>
                  <div className="italic">{currentWord.definition}</div>
                </div>
                
{/* Example Hint */}
{(roundOver || wrongGuesses > 0) && (
  <div className="mb-2">
    <span className="font-semibold text-green-800">Example:</span>
    <div className="text-green-900">{maskWordInExample(currentWord.example, currentWord.word)}</div>
  </div>
)}

{/* Etymology Hint */}
{(roundOver || wrongGuesses > 1) && (
  <div className="mb-2">
    <span className="font-semibold text-green-800">Etymology:</span>
    <div   className="text-green-900" dangerouslySetInnerHTML={{ __html: currentWord.etymology }} ></div>
  </div>
)}
                <div className="flex mb-2">
                  <input
                    ref={inputRef}
                    className="flex-1 border border-green-300 rounded-l px-3 py-2 focus:outline-none"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={roundOver}
                    placeholder={placeholder}
                    autoFocus
                  />
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
                    onClick={checkAnswer}
                    disabled={roundOver}
                  >
                    Submit
                  </button>
                </div>
  
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-700 font-semibold">Score: {score}</span>
                  <span className="text-green-700">⏱️ {timer}s</span>
                </div>
              </>
            )}
            
            <div className="h-6 text-center text-green-800 font-bold">{message}</div>
            {roundOver && remaining.length > 0 ? (
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={nextWord}
              >
                Next Word
              </button>
            ) : null}
          </div>
  
          <div className="mt-8 text-green-600 text-sm italic">
            Guess the word from its definition. Hints will appear after wrong guesses!
          </div>
  
          {/* Seed Bank section remains the same */}
          <div className="mt-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-green-700 mb-2 flex items-center">
              <span role="img" aria-label="seed" className="mr-2">🌱</span> Seed Bank (Words Learned)
            </h2>
            {seedBank.length === 0 ? (
              <div className="text-green-800 italic">No words learned yet.</div>
            ) : (
              <ul className="list-disc pl-6">
                {seedBank.map((w, i) => (
                  <li key={w.word} className="mb-1">
                    <span className="font-semibold text-green-900">{w.word}</span>{" "}
                    <span className="text-green-700">({w.form})</span>
                    <span className="text-green-600"> [{w.origin}]</span>:{" "}
                    <span className="italic text-green-800">{w.definition}</span>
                  </li>
                ))}
              </ul>
            )}
            {seedBank.length > 0 && (
              <div className="mt-6 flex flex-col items-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mb-2"
                  onClick={() => downloadCSV(seedBank, setDownloadUrl)}
                >
                  Download Seed Bank as CSV
                </button>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download="growcabulary_seed_bank.csv"
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
  
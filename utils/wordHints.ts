export function isSeparatorChar(ch: string): boolean {
  return /^[\s\-'\u2019]$/.test(ch);
}

/**
 * Normalizes accented characters and ligatures (e.g. 'é' -> 'e', 'œ' -> 'o')
 * so words like "Détente", "Brise-soleil", "Genius Loci", and "Trompe-l'œil"
 * remain playable on any standard keyboard.
 */
export function normalizeCharForCompare(ch: string): string {
  if (!ch) return '';
  const lower = ch.toLowerCase();
  if (lower === 'œ') return 'o';
  if (lower === 'æ') return 'a';
  return lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Returns indices that should be pre-revealed automatically (spaces, hyphens, apostrophes).
 */
export function getInitialRevealedIndices(word: string): Set<number> {
  const set = new Set<number>();
  for (let i = 0; i < word.length; i++) {
    if (isSeparatorChar(word[i])) {
      set.add(i);
    }
  }
  return set;
}

/**
 * Validates typed/placed letters + revealed indices against the target word.
 */
export function evaluateWordGuess(
  word: string,
  guess: string[],
  revealedIndices: Set<number>
): { isComplete: boolean; isCorrect: boolean } {
  let isComplete = true;
  let isCorrect = true;

  for (let i = 0; i < word.length; i++) {
    const resolved = revealedIndices.has(i) ? word[i] : guess[i] || '';
    if (!resolved) {
      isComplete = false;
      isCorrect = false;
      break;
    }
    if (normalizeCharForCompare(resolved) !== normalizeCharForCompare(word[i])) {
      isCorrect = false;
    }
  }

  return { isComplete, isCorrect };
}

export function getFirstAndLastAlphaIndices(word: string): number[] {
  const alphaIndices: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (!isSeparatorChar(word[i])) alphaIndices.push(i);
  }
  if (alphaIndices.length === 0) return [];
  if (alphaIndices.length === 1) return [alphaIndices[0]];
  return [alphaIndices[0], alphaIndices[alphaIndices.length - 1]];
}

export function getNextLetterToReveal(
  word: string,
  revealedIndices: Set<number>
): number | null {
  const firstAlpha = getFirstAndLastAlphaIndices(word)[0];
  if (firstAlpha !== undefined && !revealedIndices.has(firstAlpha)) {
    return firstAlpha;
  }
  const unrevealed: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (!revealedIndices.has(i) && !isSeparatorChar(word[i])) {
      unrevealed.push(i);
    }
  }
  if (unrevealed.length === 0) return null;
  return unrevealed[Math.floor(Math.random() * unrevealed.length)];
}

export interface ScrambledTile {
  id: number;
  char: string;
}

function shuffleArray<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

/**
 * Builds a scrambled tray of non-separator characters for the target word.
 */
export function buildScrambledLetterPool(word: string): ScrambledTile[] {
  const tiles: ScrambledTile[] = [];
  for (let i = 0; i < word.length; i++) {
    if (!isSeparatorChar(word[i])) {
      tiles.push({ id: i, char: word[i].toLowerCase() });
    }
  }
  if (tiles.length <= 2) return shuffleArray(tiles);

  let shuffled = shuffleArray(tiles);
  const originalSeq = tiles.map((t) => t.char).join('');
  if (shuffled.map((t) => t.char).join('') === originalSeq) {
    shuffled = [...shuffled.slice(1), shuffled[0]];
  }
  return shuffled;
}

export function findNextUnrevealedIndex(
  length: number,
  revealedIndices: Set<number>,
  startAfter: number
): number | null {
  for (let i = startAfter + 1; i < length; i++) {
    if (!revealedIndices.has(i)) return i;
  }
  return null;
}

export function findPrevUnrevealedIndex(
  revealedIndices: Set<number>,
  startBefore: number
): number | null {
  for (let i = startBefore - 1; i >= 0; i--) {
    if (!revealedIndices.has(i)) return i;
  }
  return null;
}

/**
 * Places a clicked tile character into the focused empty slot (or first empty unrevealed slot).
 */
export function placeCharFromTileBank(
  word: string,
  guess: string[],
  revealedIndices: Set<number>,
  focusedIndex: number,
  char: string
): { nextGuess: string[]; nextFocus: number } {
  const len = word.length;
  let targetIdx = -1;

  if (!revealedIndices.has(focusedIndex) && !guess[focusedIndex]) {
    targetIdx = focusedIndex;
  } else {
    for (let i = 0; i < len; i++) {
      if (!revealedIndices.has(i) && !guess[i]) {
        targetIdx = i;
        break;
      }
    }
  }

  if (targetIdx === -1) {
    return { nextGuess: guess, nextFocus: focusedIndex };
  }

  const nextGuess = [...guess];
  nextGuess[targetIdx] = char;

  // Advance focus to next empty unrevealed box if available
  let nextFocus = focusedIndex;
  for (let i = targetIdx + 1; i < len; i++) {
    if (!revealedIndices.has(i) && !nextGuess[i]) {
      nextFocus = i;
      return { nextGuess, nextFocus };
    }
  }
  for (let i = 0; i < len; i++) {
    if (!revealedIndices.has(i) && !nextGuess[i]) {
      nextFocus = i;
      return { nextGuess, nextFocus };
    }
  }
  return { nextGuess, nextFocus: targetIdx };
}

/**
 * Removes the rightmost unrevealed occurrence of a tapped placed tile.
 */
export function removeCharForTileBank(
  guess: string[],
  revealedIndices: Set<number>,
  char: string
): { nextGuess: string[]; removedIndex: number | null } {
  const targetNorm = normalizeCharForCompare(char);
  for (let i = guess.length - 1; i >= 0; i--) {
    if (
      !revealedIndices.has(i) &&
      guess[i] &&
      normalizeCharForCompare(guess[i]) === targetNorm
    ) {
      const nextGuess = [...guess];
      nextGuess[i] = '';
      return { nextGuess, removedIndex: i };
    }
  }
  return { nextGuess: guess, removedIndex: null };
}


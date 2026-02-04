import { GoogleGenAI, Type } from "@google/genai";
import { Word, SeedType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Throttling configuration
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2500; 

async function throttle() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  lastRequestTime = Date.now();
}

export async function generateAIWords(type: SeedType, customDescription?: string, blacklist: string[] = []): Promise<Word[]> {
  // Fix: Updated mapping keys to match current SeedType definition and ensured type safety
  const difficultyPrompts: Partial<Record<SeedType, string>> = {
    garden: "expressive but foundational words like 'vivid', 'serene', 'candid', or 'astute'. These should be accessible to a high school student but slightly more descriptive than basic daily speech.",
    meadow: "sophisticated words found in quality journalism, poetry, or classic literature",
    conservatory: "obscure, complex, and rare terms often found in scholarly texts or classic literature."
  };

  const defaultDifficultyPrompt = difficultyPrompts[type];

  const categoryDescription = customDescription || defaultDifficultyPrompt || `vocabulary related to ${type}`;
  const blacklistStr = blacklist.length > 0 ? `DO NOT use any of these words: ${blacklist.join(', ')}.` : '';

  try {
    await throttle();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 6 unique English vocabulary words based on this specification: ${categoryDescription}. 
      ${blacklistStr}
      Avoid extremely common words (apple, happy). Avoid extremely technical jargon unless it specifically fits the requested theme.
      Return them in a JSON list with: word, part of speech (form), primary definition, an optional secondary definition (definition2), etymology (Word Roots), a clear usage example, and language of origin.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              form: { type: Type.STRING },
              definition: { type: Type.STRING },
              definition2: { type: Type.STRING },
              etymology: { type: Type.STRING },
              example: { type: Type.STRING },
              origin: { type: Type.STRING },
            },
            required: ["word", "form", "definition", "etymology", "example", "origin"],
          },
        },
      },
    });

    // Fix: Using the correct 'text' property access from GenerateContentResponse
    const jsonStr = response.text?.trim();
    const words = JSON.parse(jsonStr || "[]");
    return words.map((w: any) => ({ 
      ...w, 
      seed: type,
      isAiGenerated: true 
    }));
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return [];
  }
}
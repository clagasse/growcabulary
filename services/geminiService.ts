
import { GoogleGenAI, Type } from "@google/genai";
import { Word, SeedType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getEtymologyInsight(word: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the etymological roots of the word "${word}" in 2-3 sentences. Focus on the prefix, suffix, and historical evolution of its meaning. Be precise and interesting.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "No insights found for this word.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to fetch AI insights.";
  }
}

export async function generateAIWords(type: SeedType, customDescription?: string, blacklist: string[] = []): Promise<Word[]> {
  const defaultDifficultyPrompt = {
    uncommon: "expressive but foundational words like 'vivid', 'serene', 'candid', or 'astute'. These should be accessible to a high school student but slightly more descriptive than basic daily speech.",
    rare: "sophisticated words found in quality journalism, poetry, or classic literature",
    exotic: "obscure, complex, and rare terms often found in scholarly texts or classic literature."
  }[type];

  const categoryDescription = customDescription || defaultDifficultyPrompt;
  const blacklistStr = blacklist.length > 0 ? `DO NOT use any of these words: ${blacklist.join(', ')}.` : '';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 6 unique English vocabulary words based on this specification: ${categoryDescription}. 
      ${blacklistStr}
      Avoid extremely common words (apple, happy). Avoid extremely technical jargon unless it specifically fits the requested theme.
      Return them in a JSON list with: word, part of speech (form), primary definition, an optional secondary definition (definition2), etymology, a clear usage example, and language of origin.`,
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

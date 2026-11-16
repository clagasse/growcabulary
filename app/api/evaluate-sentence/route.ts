import { NextRequest, NextResponse } from 'next/server';

export type SentenceVerdict = 'clean' | 'assisted' | 'missed';

export interface EvaluateSentenceRequest {
  word: string;
  form: string;
  definition: string;
  definition2?: string;
  example?: string;
  fieldQuote?: string;
  sentence: string;
  apiKey?: string;
}

export interface EvaluateSentenceResponse {
  ok: boolean;
  precheckFailed?: boolean;
  reason?: 'invalid' | 'too-short' | 'too-long' | 'missing-word' | 'copied-example';
  source?: 'gemini' | 'heuristic';
  model?: string;
  verdict?: SentenceVerdict;
  feedback: string;
  strengths?: string;
  suggestedRevision?: string;
  warning?: string;
}

interface GeminiEvalPayload {
  verdict?: string;
  feedback?: string;
  strengths?: string;
  suggestedRevision?: string;
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        thought?: boolean;
      }>;
    };
  }>;
}

function isPlaceholderKey(val: string | undefined): boolean {
  if (!val) return true;
  const trimmed = val.trim().toLowerCase();
  if (!trimmed) return true;
  return (
    trimmed.includes('your_gemini_api_key') ||
    trimmed.includes('your-gemini-api-key') ||
    trimmed.includes('placeholder') ||
    trimmed === 'replace_me' ||
    trimmed === 'test' ||
    trimmed === 'none'
  );
}

function resolveGeminiKey(clientKey?: string): string | null {
  if (clientKey && !isPlaceholderKey(clientKey)) {
    return clientKey.trim();
  }
  const envKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (envKey && !isPlaceholderKey(envKey)) {
    return envKey.trim();
  }
  return null;
}

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

function containsTargetWordOrStem(sentence: string, word: string): boolean {
  const cleanWord = word.trim();
  if (!cleanWord) return false;
  if (sentence.toLowerCase().includes(cleanWord.toLowerCase())) {
    return true;
  }
  const stem = computeStem(cleanWord);
  if (!stem) return false;
  const regex = new RegExp(`\\b${escapeRegExp(stem)}[a-z'-]*\\b`, 'i');
  return regex.test(sentence);
}

function normalizeForCopyCheck(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCopiedFromReference(sentence: string, reference?: string): boolean {
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

function runPrechecks(body: EvaluateSentenceRequest): EvaluateSentenceResponse | null {
  const word = typeof body.word === 'string' ? body.word.trim() : '';
  const definition = typeof body.definition === 'string' ? body.definition.trim() : '';
  const sentence = typeof body.sentence === 'string' ? body.sentence.trim() : '';

  if (!word || !definition || !sentence) {
    return {
      ok: false,
      precheckFailed: true,
      reason: 'invalid',
      feedback: 'Please enter a sentence before submitting.',
    };
  }

  if (sentence.length > 500) {
    return {
      ok: false,
      precheckFailed: true,
      reason: 'too-long',
      feedback: 'Keep your sentence concise (500 characters or fewer).',
    };
  }

  const tokens = sentence.split(/\s+/).filter(Boolean);
  if (tokens.length < 5) {
    return {
      ok: false,
      precheckFailed: true,
      reason: 'too-short',
      feedback: 'Write a complete sentence of at least 5 words that gives context for the word.',
    };
  }

  if (!containsTargetWordOrStem(sentence, word)) {
    return {
      ok: false,
      precheckFailed: true,
      reason: 'missing-word',
      feedback: `Include "${word}" (or an inflected form) in your sentence.`,
    };
  }

  if (
    isCopiedFromReference(sentence, body.example) ||
    isCopiedFromReference(sentence, body.fieldQuote)
  ) {
    return {
      ok: false,
      precheckFailed: true,
      reason: 'copied-example',
      feedback:
        'Write an original sentence in your own words rather than copying the reference example.',
    };
  }

  return null;
}

function evaluateHeuristically(
  body: EvaluateSentenceRequest,
  warning?: string
): EvaluateSentenceResponse {
  const sentence = body.sentence.trim();
  const word = body.word.trim();
  const tokens = sentence.split(/\s+/).filter(Boolean);

  const shellPattern =
    /^(?:it|this|that|he|she|they|we|someone|something|everything|nobody)\s+(?:is|was|are|were|felt|feels|seemed|seems|looks?|looked|became)\s+(?:very\s+|so\s+|quite\s+|really\s+|rather\s+)?[a-z'-]+[.!?]*$/i;

  if (shellPattern.test(sentence) || tokens.length < 7) {
    return {
      ok: true,
      source: 'heuristic',
      verdict: 'assisted',
      feedback: `Valid form, but too brief to show what "${word}" means. Add a specific detail or clause for context.`,
      strengths: '',
      suggestedRevision: '',
      warning,
    };
  }

  return {
    ok: true,
    source: 'heuristic',
    verdict: 'clean',
    feedback: `Correct usage of "${word}" with clear context.`,
    strengths: '',
    suggestedRevision: '',
    warning,
  };
}

function parseJsonSafe<T>(rawText: string | undefined, fallback: T): T {
  if (!rawText) return fallback;
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

async function callGeminiRest(
  apiKey: string,
  model: string,
  prompt: string,
  timeoutMs: number,
  includeThinkingConfig: boolean
): Promise<{ ok: true; data: GeminiGenerateResponse } | { ok: false; status: number; message: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const generationConfig: Record<string, unknown> = {
    responseMimeType: 'application/json',
    temperature: 0.25,
    maxOutputTokens: 350,
  };
  if (includeThinkingConfig) {
    generationConfig.thinkingConfig = { thinkingLevel: 'LOW' };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig,
        }),
      }
    );

    if (!res.ok) {
      let message = res.statusText || `HTTP ${res.status}`;
      try {
        const errData = (await res.json()) as { error?: { message?: string } };
        if (errData?.error?.message) {
          message = errData.error.message;
        }
      } catch {
        // Keep statusText fallback
      }
      return { ok: false, status: res.status, message };
    }

    const data = (await res.json()) as GeminiGenerateResponse;
    return { ok: true, data };
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name?: string }).name === 'AbortError'
    ) {
      return {
        ok: false,
        status: 408,
        message: `Gemini evaluation timed out after ${Math.round(timeoutMs / 1000)}s`,
      };
    }
    const msg = err instanceof Error ? err.message : 'Gemini request failed';
    return { ok: false, status: 500, message: msg };
  } finally {
    clearTimeout(timer);
  }
}

async function evaluateWithGemini(
  apiKey: string,
  body: EvaluateSentenceRequest
): Promise<EvaluateSentenceResponse> {
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const prompt = `Grade whether the learner's sentence uses the target word accurately.

Word: "${body.word}" (${body.form})
Definition: ${body.definition}
${body.definition2 ? `Secondary sense: ${body.definition2}` : ''}
Sentence: "${body.sentence.trim()}"

Verdicts:
- "clean": accurate meaning, natural grammar, and clear context.
- "assisted": understandable intent, but awkward grammar/collocation or vague context.
- "missed": wrong meaning, wrong part of speech, or nonsensical usage.

Keep "feedback" plain, direct, and under 20 words (no flowery praise). Return JSON:
{
  "verdict": "clean" | "assisted" | "missed",
  "strengths": "",
  "feedback": "One short, direct sentence.",
  "suggestedRevision": "Concise revision of the learner's sentence if verdict is not clean; otherwise empty string."
}`;

  let usedModel = primaryModel;
  let responseData: GeminiGenerateResponse | null = null;
  const primary = await callGeminiRest(apiKey, primaryModel, prompt, 15000, true);

  if (primary.ok) {
    responseData = primary.data;
  } else {
    const isThinkingOrModelError =
      primary.status === 404 ||
      (primary.status === 400 &&
        /thinking|thinkinglevel|thinkingconfig|not found|not supported/i.test(primary.message));

    if (isThinkingOrModelError) {
      usedModel =
        primary.status === 404 && primaryModel !== 'gemini-3.8-flash'
          ? 'gemini-3.8-flash'
          : primaryModel;
      const fallback = await callGeminiRest(apiKey, usedModel, prompt, 15000, false);
      if (!fallback.ok) {
        return evaluateHeuristically(
          body,
          `AI evaluator unavailable (${fallback.message}); used local rubric.`
        );
      }
      responseData = fallback.data;
    } else {
      return evaluateHeuristically(
        body,
        `AI evaluator unavailable (${primary.message}); used local rubric.`
      );
    }
  }

  const parts = responseData?.candidates?.[0]?.content?.parts ?? [];
  const answerText = parts
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text)
    .join('\n')
    .trim();

  const parsed = parseJsonSafe<GeminiEvalPayload>(answerText, {});
  const verdict: SentenceVerdict | null =
    parsed.verdict === 'clean' || parsed.verdict === 'assisted' || parsed.verdict === 'missed'
      ? parsed.verdict
      : null;

  if (!verdict || typeof parsed.feedback !== 'string' || !parsed.feedback.trim()) {
    return evaluateHeuristically(body, 'AI response format was unexpected; used local rubric.');
  }

  return {
    ok: true,
    source: 'gemini',
    model: usedModel,
    verdict,
    strengths: typeof parsed.strengths === 'string' ? parsed.strengths.trim() : '',
    feedback: parsed.feedback.trim(),
    suggestedRevision:
      typeof parsed.suggestedRevision === 'string' ? parsed.suggestedRevision.trim() : '',
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EvaluateSentenceRequest;
    const precheckError = runPrechecks(body);
    if (precheckError) {
      return NextResponse.json(precheckError, { status: 200 });
    }

    const apiKey = resolveGeminiKey(body.apiKey);
    if (!apiKey) {
      return NextResponse.json(evaluateHeuristically(body), { status: 200 });
    }

    const result = await evaluateWithGemini(apiKey, body);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        precheckFailed: true,
        reason: 'invalid',
        feedback: 'Could not read your submission. Please try again.',
      } satisfies EvaluateSentenceResponse,
      { status: 400 }
    );
  }
}

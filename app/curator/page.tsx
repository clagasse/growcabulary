'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { DifficultyTier, TopicCategory, Word } from '../../types';
import {
  ORIGIN_EMOJI_MAP,
  TOPIC_CATEGORIES,
  WORD_BANKS,
  getDifficultyMeta,
  getTopicMeta,
  getWordDifficulty,
  getWordTopic,
} from '../../constants';
import { getSafeEtymologyHint } from '../../utils/etymology';
import { CURATED_FIELD_QUOTES } from '../../utils/fieldQuotes';
import { WordMorphemeProfile } from '../../utils/morphemes';
import { findSimilarLexiconWords } from '../../utils/wordSimilarity';
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Scissors,
  Eye,
  BookOpen,
  Layers,
  RefreshCw,
  Wand2,
  KeyRound,
} from 'lucide-react';

interface AuditedWord extends Word {
  index: number;
  auditFlags: string[];
  maskedPreview: string;
  morphemes?: WordMorphemeProfile;
}

interface StagedWord extends Word {
  id: string;
}

type StudioTab = 'live' | 'staged' | 'new';
type AuditFilter =
  | 'all'
  | 'any-flag'
  | 'duplicate'
  | 'mask-mismatch'
  | 'semicolon-def'
  | 'short-etymology';

// Core difficulty decks and specialist topics

function computeClientMaskPreview(example: string, word: string): string {
  if (!example || !word) return '';
  const stem =
    word.length > 3 ? word.toLowerCase().replace(/[ey]$/i, '') : word.toLowerCase();
  const regex = new RegExp(`\\b${stem}[a-z]*\\b`, 'gi');
  return example.replace(regex, (match) => {
    const maskLen = Math.min(match.length, word.length);
    const suffix = match.slice(maskLen);
    return '•'.repeat(maskLen) + suffix;
  });
}

export default function CuratorStudioPage() {
  const [words, setWords] = useState<AuditedWord[]>([]);
  const [stagedWords, setStagedWords] = useState<StagedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Gemini API Key status & Auth Context
  const [hasEnvGeminiKey, setHasEnvGeminiKey] = useState(false);
  const [clientApiKey, setClientApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(null);
  const [authContext, setAuthContext] = useState<{
    mode: 'local-dev' | 'admin-email';
    userEmail: string | null;
    hasAdminEmailConfigured: boolean;
  } | null>(null);

  // Staged AI Generation controls
  const [genDifficulty, setGenDifficulty] = useState<DifficultyTier>('conservatory');
  const [genTopic, setGenTopic] = useState<TopicCategory>('emotions');
  const [genCustomPrompt, setGenCustomPrompt] = useState('');
  const [replaceStagedOnGen, setReplaceStagedOnGen] = useState(false);

  const [activeTab, setActiveTab] = useState<StudioTab>('live');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyTier | 'all'>('all');
  const [topicFilter, setTopicFilter] = useState<TopicCategory | 'all'>('all');
  const [auditFilter, setAuditFilter] = useState<AuditFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedStagedId, setSelectedStagedId] = useState<string | null>(null);
  const [formMorphemes, setFormMorphemes] = useState<WordMorphemeProfile | null>(null);
  const [regenMorphemesLoading, setRegenMorphemesLoading] = useState(false);
  const [fetchingWikiQuote, setFetchingWikiQuote] = useState(false);

  const [formState, setFormState] = useState<Word>({
    word: '',
    seed: 'garden',
    topic: 'general',
    form: 'noun',
    definition: '',
    definition2: '',
    etymology: '',
    example: '',
    fieldQuote: '',
    fieldQuoteAuthor: '',
    origin: 'Latin',
  });

  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    const savedKey =
      sessionStorage.getItem('growcabulary_gemini_key') ||
      localStorage.getItem('growcabulary_gemini_key');
    if (localStorage.getItem('growcabulary_gemini_key')) {
      localStorage.removeItem('growcabulary_gemini_key');
    }
    if (savedKey) {
      sessionStorage.setItem('growcabulary_gemini_key', savedKey);
      setClientApiKey(savedKey);
    }
  }, []);

  const handleSaveClientKey = (val: string) => {
    setClientApiKey(val);
    localStorage.removeItem('growcabulary_gemini_key');
    if (val.trim()) {
      sessionStorage.setItem('growcabulary_gemini_key', val.trim());
    } else {
      sessionStorage.removeItem('growcabulary_gemini_key');
    }
  };

  const fetchLexicon = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/curator');
      const data = await res.json();
      if (res.status === 403 || data.unauthorized) {
        setUnauthorized(true);
        setUnauthorizedEmail(data.userEmail || null);
        return;
      }
      setUnauthorized(false);
      if (data.authContext) {
        setAuthContext(data.authContext);
      }
      if (data.words) {
        setWords(data.words);
        setStagedWords(data.staged || []);
        setHasEnvGeminiKey(Boolean(data.hasEnvGeminiKey));
        if (selectedIndex === null && data.words.length > 0) {
          setSelectedIndex(data.words[0].index);
          setFormState(data.words[0]);
          setFormMorphemes(data.words[0].morphemes || null);
        }
      }
    } catch (e) {
      console.error('Failed to load lexicon:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLexicon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auditStats = useMemo(() => {
    const stats = {
      duplicates: 0,
      maskMismatch: 0,
      semicolonDef: 0,
      shortEtymology: 0,
      anyFlag: 0,
    };
    words.forEach((w) => {
      if (w.auditFlags.length > 0) stats.anyFlag++;
      if (w.auditFlags.includes('duplicate')) stats.duplicates++;
      if (w.auditFlags.includes('mask-mismatch')) stats.maskMismatch++;
      if (w.auditFlags.includes('semicolon-def')) stats.semicolonDef++;
      if (w.auditFlags.includes('short-etymology')) stats.shortEtymology++;
    });
    return stats;
  }, [words]);

  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { all: words.length };
    WORD_BANKS.forEach((d) => {
      counts[d.type] = words.filter((w) => getWordDifficulty(w) === d.type).length;
    });
    return counts;
  }, [words]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { all: words.length };
    TOPIC_CATEGORIES.forEach((t) => {
      counts[t.type] = words.filter((w) => getWordTopic(w) === t.type).length;
    });
    return counts;
  }, [words]);

  const wordMatchesSearchQuery = (w: AuditedWord, rawQuery: string): boolean => {
    const q = rawQuery
      .trim()
      .toLowerCase()
      .replace(/^["'“”‘’]+|["'“”‘’.,;!?]+$/g, '');
    if (!q) return true;

    const lowerWord = (w.word || '').toLowerCase();
    // Stem match for inflected searches (e.g. "execrated" -> "execrable", "antinomies" -> "antinomy")
    const queryStem =
      q.length >= 5
        ? q.replace(/(?:ies|ied|ing|ed|es|s|ly|ally|ic|ical|able|ible)$/i, '')
        : q;
    const wordStem =
      lowerWord.length >= 5
        ? lowerWord.replace(/(?:e|y|ies|ing|ed|es|s|ly|ic|able|ible)$/i, '')
        : lowerWord;
    const stemMatch =
      queryStem.length >= 4 &&
      wordStem.length >= 4 &&
      (lowerWord.startsWith(queryStem) || q.startsWith(wordStem));

    const curatedQuote = CURATED_FIELD_QUOTES[lowerWord];
    const effectiveQuote = (w.fieldQuote || curatedQuote?.quote || '').toLowerCase();
    const effectiveAuthor = (
      w.fieldQuoteAuthor ||
      curatedQuote?.author ||
      ''
    ).toLowerCase();

    const morphMatch =
      (w.morphemes?.prefixes || []).some(
        (p) =>
          (p.form || '').toLowerCase().includes(q) ||
          (p.canonicalId || '').toLowerCase().includes(q) ||
          (p.meaning || '').toLowerCase().includes(q)
      ) ||
      (w.morphemes?.roots || []).some(
        (r) =>
          (r.form || '').toLowerCase().includes(q) ||
          (r.canonicalId || '').toLowerCase().includes(q) ||
          (r.displayRoot || '').toLowerCase().includes(q) ||
          (r.meaning || '').toLowerCase().includes(q) ||
          (r.pieRoot || '').toLowerCase().includes(q)
      ) ||
      (w.morphemes?.suffixes || []).some(
        (s) =>
          (s.form || '').toLowerCase().includes(q) ||
          (s.meaning || '').toLowerCase().includes(q)
      );

    return (
      lowerWord.includes(q) ||
      stemMatch ||
      (w.definition || '').toLowerCase().includes(q) ||
      (w.definition2 || '').toLowerCase().includes(q) ||
      (w.etymology || '').toLowerCase().includes(q) ||
      (w.example || '').toLowerCase().includes(q) ||
      effectiveQuote.includes(q) ||
      effectiveAuthor.includes(q) ||
      (w.origin || '').toLowerCase().includes(q) ||
      getWordTopic(w).toLowerCase().includes(q) ||
      getDifficultyMeta(w).label.toLowerCase().includes(q) ||
      Boolean(morphMatch)
    );
  };

  const allSearchMatchesCount = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return words.length;
    return words.filter((w) => wordMatchesSearchQuery(w, q)).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, searchQuery]);

  const filteredWords = useMemo(() => {
    const q = searchQuery
      .trim()
      .toLowerCase()
      .replace(/^["'“”‘’]+|["'“”‘’.,;!?]+$/g, '');
    const matched = words.filter((w) => {
      if (difficultyFilter !== 'all' && getWordDifficulty(w) !== difficultyFilter) return false;
      if (topicFilter !== 'all' && getWordTopic(w) !== topicFilter) return false;
      if (auditFilter === 'any-flag' && w.auditFlags.length === 0) return false;
      if (
        auditFilter !== 'all' &&
        auditFilter !== 'any-flag' &&
        !w.auditFlags.includes(auditFilter)
      ) {
        return false;
      }
      if (q) {
        return wordMatchesSearchQuery(w, q);
      }
      return true;
    });

    if (!q) return matched;

    // Prioritize exact headword -> prefix headword -> substring/stem headword -> rest
    return [...matched].sort((a, b) => {
      const aw = a.word.toLowerCase();
      const bw = b.word.toLowerCase();
      const rank = (s: string) =>
        s === q ? 0 : s.startsWith(q) ? 1 : s.includes(q) ? 2 : 3;
      const diff = rank(aw) - rank(bw);
      return diff !== 0 ? diff : aw.localeCompare(bw);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, difficultyFilter, topicFilter, auditFilter, searchQuery]);

  const hiddenByActiveFiltersCount = Math.max(
    0,
    allSearchMatchesCount - filteredWords.length
  );

  const handleSelectLiveWord = (item: AuditedWord) => {
    setActiveTab('live');
    setSelectedIndex(item.index);
    setFormMorphemes(item.morphemes || null);
    const curatedQuote = CURATED_FIELD_QUOTES[item.word.toLowerCase()];
    setFormState({
      word: item.word,
      seed: getWordDifficulty(item),
      topic: getWordTopic(item),
      form: item.form,
      definition: item.definition,
      definition2: item.definition2 || '',
      etymology: item.etymology,
      example: item.example,
      fieldQuote: item.fieldQuote || curatedQuote?.quote || '',
      fieldQuoteAuthor: item.fieldQuoteAuthor || curatedQuote?.author || '',
      origin: item.origin,
    });
    setBanner(null);
  };

  const handleSelectStagedWord = (item: StagedWord) => {
    setActiveTab('staged');
    setSelectedStagedId(item.id);
    setFormMorphemes(null);
    const curatedQuote = CURATED_FIELD_QUOTES[item.word.toLowerCase()];
    setFormState({
      word: item.word,
      seed: getWordDifficulty(item),
      topic: getWordTopic(item),
      form: item.form,
      definition: item.definition,
      definition2: item.definition2 || '',
      etymology: item.etymology,
      example: item.example,
      fieldQuote: item.fieldQuote || curatedQuote?.quote || '',
      fieldQuoteAuthor: item.fieldQuoteAuthor || curatedQuote?.author || '',
      origin: item.origin,
    });
    setBanner(null);
  };

  const handleStartNewWord = () => {
    setActiveTab('new');
    setSelectedIndex(null);
    setSelectedStagedId(null);
    setFormMorphemes(null);
    setFormState({
      word: '',
      seed: difficultyFilter === 'all' ? 'garden' : difficultyFilter,
      topic: topicFilter === 'all' ? 'general' : topicFilter,
      form: 'noun',
      definition: '',
      definition2: '',
      etymology: '',
      example: '',
      fieldQuote: '',
      fieldQuoteAuthor: '',
      origin: 'Latin',
    });
    setBanner(null);
  };

  // Auto-populate fields (definition, definition2, etymology, example, origin, form) for the entered word
  const handleAutoPopulateWord = async () => {
    const targetWord = formState.word.trim();
    if (!targetWord) {
      setBanner({
        type: 'error',
        text: 'Type a word in the Word field first, then click Auto-Populate Fields.',
      });
      return;
    }

    setEnriching(true);
    setBanner(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          action: 'enrich_word',
          word: targetWord,
          targetSeed: getWordDifficulty(formState),
          targetTopic: getWordTopic(formState),
          apiKey: clientApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to auto-populate word');

      if (data.enriched) {
        setFormState((prev) => ({
          ...prev,
          word: data.enriched.word || prev.word,
          seed: data.enriched.seed ? getWordDifficulty(data.enriched) : prev.seed,
          topic: data.enriched.topic ? getWordTopic(data.enriched) : prev.topic,
          form: data.enriched.form || prev.form,
          definition: data.enriched.definition || prev.definition,
          definition2: data.enriched.definition2 ?? prev.definition2,
          etymology: data.enriched.etymology || prev.etymology,
          example: data.enriched.example || prev.example,
          fieldQuote: data.enriched.fieldQuote ?? prev.fieldQuote,
          fieldQuoteAuthor: data.enriched.fieldQuoteAuthor ?? prev.fieldQuoteAuthor,
          origin: data.enriched.origin || prev.origin,
        }));
        if (data.enrichedMorphemes) {
          setFormMorphemes(data.enrichedMorphemes);
        }
        setBanner({
          type: 'success',
          text:
            data.source === 'gemini'
              ? `✨ Populated "${targetWord}" via Gemini AI (${
                  data.quoteVerified
                    ? '✓ real verified Wiktionary quote attached'
                    : 'no Wiktionary quote found — left Field Quote blank to avoid hallucination'
                }).`
              : data.warning
              ? `✨ Populated fields for "${targetWord}" via ${data.source} (Gemini note: ${data.warning})`
              : `✨ Populated fields for "${targetWord}" (${data.source}).`,
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.name === 'AbortError'
          ? 'Request timed out after 45s. Please check your GEMINI_API_KEY and network connection.'
          : err instanceof Error
          ? err.message
          : 'Auto-populate failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      clearTimeout(timeoutId);
      setEnriching(false);
    }
  };

  // Fetch or cycle real verified literary quotes from English Wiktionary (never hallucinated)
  const handleFetchWiktionaryQuote = async () => {
    const targetWord = formState.word.trim();
    if (!targetWord) {
      setBanner({
        type: 'error',
        text: 'Enter a word first before fetching a verified Wiktionary quote.',
      });
      return;
    }

    setFetchingWikiQuote(true);
    setBanner(null);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fetch_wiktionary_quote',
          word: targetWord,
          currentQuote: formState.fieldQuote || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to look up Wiktionary quote');

      if (data.found) {
        setFormState((prev) => ({
          ...prev,
          fieldQuote: data.fieldQuote || '',
          fieldQuoteAuthor: data.fieldQuoteAuthor || '',
        }));
        setBanner({ type: 'success', text: data.message });
      } else {
        setFormState((prev) => ({
          ...prev,
          fieldQuote: '',
          fieldQuoteAuthor: '',
        }));
        setBanner({
          type: 'error',
          text:
            data.message ||
            `No verified quote found on English Wiktionary for "${targetWord}". Cleared Field Quote so the game uses your Example Sentence.`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Wiktionary lookup failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      setFetchingWikiQuote(false);
    }
  };

  // Regenerate AI candidate suggestions in the Staged tab
  const handleRegenerateCandidates = async () => {
    setRegenerating(true);
    setBanner(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          action: 'generate_candidates',
          seed: genDifficulty,
          topic: genTopic,
          customPrompt: genCustomPrompt,
          count: 6,
          replaceExisting: replaceStagedOnGen,
          apiKey: clientApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate candidates');

      setStagedWords(data.staged || []);
      if (data.staged && data.staged.length > 0) {
        handleSelectStagedWord(data.staged[0]);
      }
      const targetLabel = `${getDifficultyMeta(genDifficulty).label} • ${getTopicMeta(genTopic).label}`;
      setBanner({
        type: 'success',
        text: data.usedAi
          ? `✨ Generated ${data.generatedCount} fresh AI candidate specimens for "${targetLabel}"!`
          : data.warning
          ? `🌱 Loaded ${data.generatedCount} reserve candidates for "${targetLabel}" (Gemini note: ${data.warning})`
          : `🌱 Loaded ${data.generatedCount} curated reserve candidates for "${targetLabel}"!`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.name === 'AbortError'
          ? 'Request timed out after 45s. Please check your GEMINI_API_KEY.'
          : err instanceof Error
          ? err.message
          : 'Candidate generation failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      clearTimeout(timeoutId);
      setRegenerating(false);
    }
  };

  const splitSemicolonInForm = () => {
    if (!formState.definition.includes(';')) return;
    const parts = formState.definition
      .split(';')
      .map((s) => s.trim().replace(/^\.\s*/, ''))
      .filter(Boolean);
    if (parts.length >= 2) {
      const primary = parts[0].endsWith('.') ? parts[0] : `${parts[0]}.`;
      const secondary = [
        ...(formState.definition2 ? [formState.definition2] : []),
        ...parts.slice(1),
      ].join('; ');
      setFormState((prev) => ({
        ...prev,
        definition: primary,
        definition2: secondary,
      }));
      setBanner({
        type: 'success',
        text: 'Split semicolon definition into Primary + Secondary Definition! Click Save to persist.',
      });
    }
  };

  const handleSaveLiveWord = async () => {
    if (selectedIndex === null) return;
    setSaving(true);
    setBanner(null);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_word',
          index: selectedIndex,
          updatedWord: formState,
          morphemes: formMorphemes || undefined,
          apiKey: clientApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setWords(data.words);
      const updatedItem = (data.words as AuditedWord[]).find((w) => w.index === selectedIndex);
      if (updatedItem) setFormMorphemes(updatedItem.morphemes || null);
      setBanner({
        type: 'success',
        text: `Saved "${formState.word}" (and updated morphemes) to utils/data.ts & utils/morphemes.ts!`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateMorphemes = async () => {
    if (selectedIndex === null) return;
    setRegenMorphemesLoading(true);
    setBanner(null);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'regenerate_morphemes',
          index: selectedIndex,
          apiKey: clientApiKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to regenerate morphemes');
      setWords(data.words);
      const updatedItem = (data.words as AuditedWord[]).find((w) => w.index === selectedIndex);
      if (updatedItem) setFormMorphemes(updatedItem.morphemes || null);
      setBanner({
        type: 'success',
        text: `Regenerated morpheme breakdown for "${formState.word}" in utils/morphemes.ts!`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Regeneration failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      setRegenMorphemesLoading(false);
    }
  };

  const handleDeleteLiveWord = async () => {
    if (selectedIndex === null) return;
    if (
      !window.confirm(
        `Delete "${formState.word}" (${getDifficultyMeta(formState).label} • ${getTopicMeta(formState).label}) from utils/data.ts?`
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_word',
          index: selectedIndex,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setWords(data.words);
      setBanner({
        type: 'success',
        text: `Deleted "${formState.word}" from utils/data.ts.`,
      });
      if (data.words.length > 0) {
        handleSelectLiveWord(data.words[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewWord = async (allowSimilar: boolean = false) => {
    if (!formState.word.trim() || !formState.definition.trim()) {
      setBanner({
        type: 'error',
        text: 'Word and Primary Definition are required.',
      });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_word',
          newWord: formState,
          morphemes: formMorphemes || undefined,
          allowSimilar,
          apiKey: clientApiKey,
        }),
      });
      const data = await res.json();
      if (res.status === 409 && data.requiresConfirmation && !allowSimilar) {
        setSaving(false);
        if (window.confirm(`${data.error}\n\nAre you sure you want to add "${formState.word}" anyway?`)) {
          return handleAddNewWord(true);
        }
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to add word');
      const updatedList = data.words as AuditedWord[];
      setWords(updatedList);
      const created = updatedList.find(
        (w) => w.word.toLowerCase() === formState.word.trim().toLowerCase()
      );
      if (created) {
        handleSelectLiveWord(created);
      } else {
        setActiveTab('live');
      }
      setBanner({
        type: 'success',
        text: `Added "${formState.word}" (${getDifficultyMeta(formState).label} • ${getTopicMeta(formState).label}) with morphemes!`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Add failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleApproveStaged = async (allowSimilar: boolean = false) => {
    if (!selectedStagedId) return;
    setSaving(true);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_staged',
          stagedId: selectedStagedId,
          approvedWord: formState,
          morphemes: formMorphemes || undefined,
          allowSimilar,
          apiKey: clientApiKey,
        }),
      });
      const data = await res.json();
      if (res.status === 409 && data.requiresConfirmation && !allowSimilar) {
        setSaving(false);
        if (window.confirm(`${data.error}\n\nApprove and plant "${formState.word}" anyway?`)) {
          return handleApproveStaged(true);
        }
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Approval failed');
      setWords(data.words);
      setStagedWords(data.staged || []);
      setBanner({
        type: 'success',
        text: `Approved & planted "${formState.word}" (${getDifficultyMeta(formState).label} • ${getTopicMeta(formState).label}) with morphemes! 🌱`,
      });
      if (data.staged && data.staged.length > 0) {
        handleSelectStagedWord(data.staged[0]);
      } else {
        setSelectedStagedId(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Approval failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleRejectStaged = async (idToReject: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject_staged',
          stagedId: idToReject,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reject failed');
      setStagedWords(data.staged || []);
      if (data.staged && data.staged.length > 0) {
        handleSelectStagedWord(data.staged[0]);
      } else {
        setSelectedStagedId(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reject failed';
      setBanner({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const liveSimilarMatches = useMemo(() => {
    const exclude =
      activeTab === 'live' && selectedIndex !== null
        ? words.find((w) => w.index === selectedIndex)?.word
        : undefined;
    return findSimilarLexiconWords(formState.word, words, exclude);
  }, [formState.word, words, activeTab, selectedIndex]);

  const liveMaskPreview = computeClientMaskPreview(formState.example, formState.word);
  const isMaskValid = liveMaskPreview.includes('•');
  const isAiReady = hasEnvGeminiKey || Boolean(clientApiKey.trim());

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-emerald-50/70 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-emerald-200 shadow-lg p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 text-2xl">
            🔒
          </div>
          <h1 className="serif text-2xl font-bold text-emerald-950 mb-2">
            Curator Studio Restricted
          </h1>
          <p className="text-sm text-emerald-700 leading-relaxed mb-6">
            The Botanical Curator Studio is restricted to{' '}
            <span className="font-bold text-emerald-900">local development mode</span> or a
            signed-in{' '}
            <span className="font-bold text-emerald-900">Administrator account</span> (
            <code className="bg-emerald-50 px-1.5 py-0.5 rounded text-xs">
              NEXT_PUBLIC_ADMIN_EMAIL
            </code>
            ).
            {unauthorizedEmail && (
              <span className="block mt-2 text-xs text-amber-800 font-semibold">
                Currently signed in as: {unauthorizedEmail}
              </span>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
            >
              Sign In as Administrator
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition-colors"
            >
              Return to Garden
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/60 flex flex-col">
      {/* Top Studio Header */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Game
            </Link>
            <div>
              <h1 className="serif text-xl sm:text-2xl font-bold text-emerald-950 flex flex-wrap items-center gap-2">
                <span>🌿 Botanical Curator Studio</span>
                <span className="text-xs font-black uppercase bg-emerald-800 text-white px-2.5 py-0.5 rounded-full">
                  {words.length} Live Words
                </span>
                {authContext && (
                  <span
                    className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full"
                    title="Curator Studio is only accessible in local development mode or when signed in with NEXT_PUBLIC_ADMIN_EMAIL"
                  >
                    🛡️{' '}
                    {authContext.mode === 'admin-email'
                      ? `Admin (${authContext.userEmail})`
                      : 'Local Dev Mode'}
                  </span>
                )}
              </h1>
              <p className="text-xs text-emerald-700">
                Audit, auto-populate with AI, and expand your canonical lexicon in{' '}
                <code className="bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  utils/data.ts
                </code>
              </p>
            </div>
          </div>

          {/* Studio Mode Tabs + AI Key Setup */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`px-3 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isAiReady
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
              title="Configure Gemini API Key for AI Auto-Populate & Candidate Generation"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isAiReady ? 'Gemini AI: Connected' : 'Set Gemini Key'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('live');
                if (words.length > 0 && selectedIndex === null) {
                  handleSelectLiveWord(words[0]);
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Live Lexicon ({words.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('staged');
                if (stagedWords.length > 0 && !selectedStagedId) {
                  handleSelectStagedWord(stagedWords[0]);
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                activeTab === 'staged'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Staged Candidates ({stagedWords.length})</span>
            </button>

            <button
              type="button"
              onClick={handleStartNewWord}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Plant New Word</span>
            </button>
          </div>
        </div>

        {/* Collapsible Gemini API Key Bar */}
        {showKeyInput && (
          <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/60 p-3 rounded-2xl">
            <div className="text-xs text-emerald-900">
              <strong>Gemini API Key:</strong> Used to auto-populate etymology/definitions for any word and generate unlimited AI candidate decks.
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="password"
                value={clientApiKey}
                onChange={(e) => handleSaveClientKey(e.target.value)}
                placeholder={
                  hasEnvGeminiKey
                    ? 'Configured via .env.local (optional override)...'
                    : 'Paste GEMINI_API_KEY here (saved for this session)...'
                }
                className="flex-1 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-medium text-emerald-950 bg-white outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowKeyInput(false)}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Lexicon Audit Browser / Staged Queue */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-emerald-100 shadow-sm flex flex-col h-[82vh] overflow-hidden">
          {activeTab === 'live' && (
            <>
              <div className="p-4 border-b border-emerald-100 space-y-3 bg-emerald-50/30">
                <div className="relative">
                  <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${words.length} words, definitions, roots, quotes...`}
                    className="w-full pl-10 pr-8 py-2 rounded-xl border border-emerald-200 text-xs font-medium text-emerald-950 focus:border-emerald-600 outline-none bg-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600 hover:text-emerald-950 px-1"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Deck Filter Pills */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                      difficultyFilter === 'all'
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white text-emerald-800 border border-emerald-100 hover:bg-emerald-50'
                    }`}
                  >
                    All Tiers ({difficultyCounts.all || 0})
                  </button>
                  {WORD_BANKS.map((d) => (
                    <button
                      key={d.type}
                      type="button"
                      onClick={() => setDifficultyFilter(d.type as DifficultyTier)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                        difficultyFilter === d.type
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white text-emerald-800 border border-emerald-100 hover:bg-emerald-50'
                      }`}
                    >
                      {d.emoji} {d.label} ({difficultyCounts[d.type] || 0})
                    </button>
                  ))}
                </div>

                {/* Topic Category Filter */}
                <div className="flex flex-wrap gap-1 pt-1.5 border-t border-emerald-100/70">
                  <button
                    type="button"
                    onClick={() => setTopicFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                      topicFilter === 'all'
                        ? 'bg-amber-800 text-white'
                        : 'bg-white text-emerald-800 border border-emerald-100 hover:bg-amber-50'
                    }`}
                  >
                    🏷️ All Topics ({topicCounts.all || 0})
                  </button>
                  {TOPIC_CATEGORIES.map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setTopicFilter(t.type)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                        topicFilter === t.type
                          ? 'bg-amber-800 text-white'
                          : 'bg-white text-emerald-800 border border-emerald-100 hover:bg-amber-50'
                      }`}
                    >
                      {t.emoji} {t.label} ({topicCounts[t.type] || 0})
                    </button>
                  ))}
                </div>

                {/* Automated Quality Audit Filters */}
                <div className="pt-2 border-t border-emerald-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> Automated Audit Filters
                    </span>
                    <div className="flex items-center gap-2">
                      {(difficultyFilter !== 'all' ||
                        topicFilter !== 'all' ||
                        auditFilter !== 'all' ||
                        searchQuery.trim() !== '') && (
                        <button
                          type="button"
                          onClick={() => {
                            setDifficultyFilter('all');
                            setTopicFilter('all');
                            setAuditFilter('all');
                            setSearchQuery('');
                          }}
                          className="text-[10px] font-black text-amber-800 hover:text-amber-950 underline"
                        >
                          Reset all filters
                        </button>
                      )}
                      <span className="text-[10px] font-bold text-emerald-600">
                        Showing {filteredWords.length} of {words.length} words
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAuditFilter('all')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        auditFilter === 'all'
                          ? 'bg-emerald-900 text-white'
                          : 'bg-white text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFilter('duplicate')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        auditFilter === 'duplicate'
                          ? 'bg-red-700 text-white'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      🔁 Duplicates ({auditStats.duplicates})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFilter('mask-mismatch')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        auditFilter === 'mask-mismatch'
                          ? 'bg-amber-700 text-white'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      🎭 Example Mask Check ({auditStats.maskMismatch})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFilter('semicolon-def')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        auditFilter === 'semicolon-def'
                          ? 'bg-sky-700 text-white'
                          : 'bg-sky-50 text-sky-900 border border-sky-200'
                      }`}
                    >
                      ➗ Semicolon Defs ({auditStats.semicolonDef})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuditFilter('short-etymology')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        auditFilter === 'short-etymology'
                          ? 'bg-purple-700 text-white'
                          : 'bg-purple-50 text-purple-900 border border-purple-200'
                      }`}
                    >
                      🪴 Brief Etymology ({auditStats.shortEtymology})
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-emerald-50">
                {searchQuery.trim() !== '' && hiddenByActiveFiltersCount > 0 && (
                  <div className="p-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-2 text-[11px] font-bold text-amber-950">
                    <span>
                      🔍 +{hiddenByActiveFiltersCount} matching{' '}
                      {hiddenByActiveFiltersCount === 1 ? 'word is' : 'words are'} hidden by active
                      Tier / Topic / Audit filters
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDifficultyFilter('all');
                        setTopicFilter('all');
                        setAuditFilter('all');
                      }}
                      className="px-2.5 py-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black shrink-0 transition-colors"
                    >
                      Show all {allSearchMatchesCount} matches
                    </button>
                  </div>
                )}
                {loading ? (
                  <div className="p-8 text-center text-sm text-emerald-700 font-bold">
                    Loading curated lexicon...
                  </div>
                ) : filteredWords.length === 0 ? (
                  <div className="p-8 text-center text-xs text-emerald-700 space-y-2.5">
                    <p className="font-bold">
                      No words match &ldquo;{searchQuery.trim() || 'your filters'}&rdquo;.
                    </p>
                    {(difficultyFilter !== 'all' ||
                      topicFilter !== 'all' ||
                      auditFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setDifficultyFilter('all');
                          setTopicFilter('all');
                          setAuditFilter('all');
                        }}
                        className="px-3 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold transition-colors"
                      >
                        Reset Tier / Topic / Audit Filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredWords.map((item) => {
                    const isSelected = selectedIndex === item.index;
                    return (
                      <button
                        key={`${item.index}-${item.word}`}
                        type="button"
                        onClick={() => handleSelectLiveWord(item)}
                        className={`w-full p-3.5 text-left transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-emerald-900 text-white'
                            : 'hover:bg-emerald-50/70 text-emerald-950'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm truncate">{item.word}</span>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-emerald-700 text-emerald-100'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {getDifficultyMeta(item).emoji} {getDifficultyMeta(item).label}
                            </span>
                            {getWordTopic(item) !== 'general' && (
                              <span
                                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                  isSelected
                                    ? 'bg-emerald-800 text-emerald-100'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200/70'
                                }`}
                              >
                                {getTopicMeta(item).emoji} {getTopicMeta(item).label}
                              </span>
                            )}
                            <span
                              className={`text-[9px] italic ${
                                isSelected ? 'text-emerald-200' : 'text-emerald-600'
                              }`}
                            >
                              {item.form}
                            </span>
                          </div>
                          <p
                            className={`text-xs truncate mt-0.5 ${
                              isSelected ? 'text-emerald-100' : 'text-emerald-700'
                            }`}
                          >
                            {item.definition}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.auditFlags.includes('duplicate') && (
                            <span
                              title="Duplicate word across decks"
                              className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-black"
                            >
                              🔁
                            </span>
                          )}
                          {item.auditFlags.includes('mask-mismatch') && (
                            <span
                              title="Example sentence does not mask target word"
                              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-black"
                            >
                              🎭
                            </span>
                          )}
                          {item.auditFlags.includes('semicolon-def') && (
                            <span
                              title="Has semicolon in primary definition"
                              className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-black"
                            >
                              ➗
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {activeTab === 'staged' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Regenerate AI Suggestions Control Box */}
              <div className="p-4 border-b border-amber-200 bg-amber-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    AI Candidate Generator
                  </h2>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={replaceStagedOnGen}
                      onChange={(e) => setReplaceStagedOnGen(e.target.checked)}
                      className="rounded border-amber-300"
                    />
                    Replace current queue
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value as DifficultyTier)}
                    aria-label="Target difficulty tier"
                    className="px-3 py-2 rounded-xl border border-amber-200 text-xs font-bold text-emerald-950 bg-white outline-none"
                  >
                    {WORD_BANKS.map((d) => (
                      <option key={d.type} value={d.type}>
                        {d.emoji} {d.label} Tier
                      </option>
                    ))}
                  </select>

                  <select
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value as TopicCategory)}
                    aria-label="Target topic category"
                    className="px-3 py-2 rounded-xl border border-amber-200 text-xs font-bold text-emerald-950 bg-white outline-none"
                  >
                    {TOPIC_CATEGORIES.map((t) => (
                      <option key={t.type} value={t.type}>
                        {t.emoji} {t.label} Topic
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={genCustomPrompt}
                  onChange={(e) => setGenCustomPrompt(e.target.value)}
                  placeholder="Optional sub-theme (e.g. 'rhetoric', 'ecology')..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs font-medium text-emerald-950 bg-white outline-none"
                />

                <button
                  type="button"
                  disabled={regenerating}
                  onClick={handleRegenerateCandidates}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
                  <span>
                    {regenerating
                      ? 'Generating Candidate Words...'
                      : `Regenerate AI Suggestions (${getDifficultyMeta(genDifficulty).label} • ${getTopicMeta(genTopic).label})`}
                  </span>
                </button>
              </div>

              {/* Staged Queue List */}
              <div className="flex-1 overflow-y-auto divide-y divide-amber-100/60">
                {stagedWords.length === 0 ? (
                  <div className="p-8 text-center text-xs text-emerald-700">
                    Queue is empty. Click <strong>Regenerate AI Suggestions</strong> above to stage a fresh batch of candidate words!
                  </div>
                ) : (
                  stagedWords.map((item) => {
                    const isSelected = selectedStagedId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectStagedWord(item)}
                        className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-900 text-white'
                            : 'hover:bg-amber-50/60 text-emerald-950'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-black text-sm">{item.word}</span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-amber-700 text-amber-100'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {getDifficultyMeta(item).emoji} {getDifficultyMeta(item).label}
                            </span>
                            {getWordTopic(item) !== 'general' && (
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  isSelected
                                    ? 'bg-amber-800 text-amber-100'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                                }`}
                              >
                                {getTopicMeta(item).emoji} {getTopicMeta(item).label}
                              </span>
                            )}
                            <span
                              className={`text-[9px] italic ${
                                isSelected ? 'text-amber-200' : 'text-emerald-600'
                              }`}
                            >
                              {item.form}
                            </span>
                          </div>
                          <p
                            className={`text-xs mt-1 line-clamp-1 ${
                              isSelected ? 'text-amber-100' : 'text-emerald-700'
                            }`}
                          >
                            {item.definition}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="p-6 text-center my-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="serif text-xl font-bold text-emerald-950">
                Planting a New Curated Specimen
              </h3>
              <p className="text-xs text-emerald-700 max-w-xs mx-auto leading-relaxed">
                1. Type any word into the <strong>Word</strong> box on the right.<br />
                2. Click <strong>✨ Auto-Populate Fields</strong> to automatically generate its definition, secondary sense, etymology roots, origin, and example sentence.<br />
                3. Review/tweak and click <strong>Plant New Word</strong>!
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Specimen Inspector, Editor & Gameplay Mask Preview */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-100 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Top Editor Header & Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  {activeTab === 'live' &&
                    `Editing Live Specimen #${(selectedIndex ?? 0) + 1} in utils/data.ts`}
                  {activeTab === 'staged' && 'Reviewing Staged Candidate Word'}
                  {activeTab === 'new' && 'Creating New Curated Specimen'}
                </span>
                <h2 className="serif text-2xl sm:text-3xl font-black text-emerald-950 mt-0.5">
                  {formState.word || 'Enter a Word Below...'}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={enriching || !formState.word.trim()}
                  onClick={handleAutoPopulateWord}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-black shadow-sm transition-all"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${enriching ? 'animate-spin' : ''}`} />
                  <span>
                    {enriching ? 'Populating Fields...' : '✨ Auto-Populate Fields'}
                  </span>
                </button>

                {formState.definition.includes(';') && (
                  <button
                    type="button"
                    onClick={splitSemicolonInForm}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold transition-colors"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Split &ldquo;;&rdquo;</span>
                  </button>
                )}

                {activeTab === 'live' && selectedIndex !== null && (
                  <button
                    type="button"
                    onClick={handleDeleteLiveWord}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>

            {/* Banner Notification */}
            {banner && (
              <div
                className={`p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold ${
                  banner.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-red-50 text-red-900 border border-red-300'
                }`}
              >
                {banner.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{banner.text}</span>
              </div>
            )}

            {/* Row 1: Word, Difficulty, Topic, Part of Speech, Origin */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
                  Word (Enter &amp; Auto-Populate)
                </label>
                <input
                  type="text"
                  value={formState.word}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, word: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && activeTab === 'new') {
                      e.preventDefault();
                      handleAutoPopulateWord();
                    }
                  }}
                  placeholder="e.g. Palimpsest"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-sm font-black text-emerald-950"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
                  Difficulty Tier
                </label>
                <select
                  value={getWordDifficulty(formState)}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      seed: e.target.value as DifficultyTier,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-sm font-bold text-emerald-950 bg-white"
                >
                  {WORD_BANKS.map((d) => (
                    <option key={d.type} value={d.type}>
                      {d.emoji} {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
                  Topic Category
                </label>
                <select
                  value={getWordTopic(formState)}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      topic: e.target.value as TopicCategory,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-sm font-bold text-emerald-950 bg-white"
                >
                  {TOPIC_CATEGORIES.map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.emoji} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
                  Part of Speech
                </label>
                <select
                  value={formState.form}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, form: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-sm font-bold text-emerald-950 bg-white"
                >
                  <option value="noun">noun</option>
                  <option value="verb">verb</option>
                  <option value="adjective">adjective</option>
                  <option value="adverb">adverb</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
                  Origin Language {ORIGIN_EMOJI_MAP[formState.origin] || '🍄'}
                </label>
                <input
                  type="text"
                  value={formState.origin}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, origin: e.target.value }))
                  }
                  placeholder="Latin, Greek, French..."
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-sm font-bold text-emerald-950"
                />
              </div>
            </div>

            {/* Duplicate / Similar Word Guard */}
            {liveSimilarMatches.length > 0 && (
              <div
                className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                  liveSimilarMatches.some((m) => m.matchType === 'exact')
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {liveSimilarMatches.some((m) => m.matchType === 'exact')
                      ? 'Duplicate Word Already in Lexicon'
                      : 'Similar Word(s) Already in Lexicon — Check Before Adding'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {liveSimilarMatches.map((m) => {
                    const existingEntry = words.find(
                      (w) => w.word.toLowerCase() === m.word.toLowerCase()
                    );
                    return (
                      <button
                        key={`sim-${m.word}`}
                        type="button"
                        onClick={() => existingEntry && handleSelectLiveWord(existingEntry)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white border border-amber-300 text-[11px] font-bold transition-colors"
                        title={`${m.definition} (click to inspect)`}
                      >
                        <span className="font-black">{m.word}</span>
                        <span className="opacity-70">({m.form})</span>
                        <span className="text-[10px] italic opacity-80">— {m.reason}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Primary & Secondary Definitions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
                  Primary Definition
                </label>
                <textarea
                  rows={3}
                  value={formState.definition}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, definition: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
                  Secondary Definition (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formState.definition2 || ''}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, definition2: e.target.value }))
                  }
                  placeholder="Optional secondary nuance or historical sense..."
                  className="w-full p-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed"
                />
              </div>
            </div>

            {/* Etymology / Word Roots */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Word Roots &amp; Etymology Narrative 🪴
                </label>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {formState.etymology.length} chars
                </span>
              </div>
              <textarea
                rows={3}
                value={formState.etymology}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, etymology: e.target.value }))
                }
                className="w-full p-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-xs sm:text-sm italic text-emerald-950 leading-relaxed"
              />
              {formState.etymology && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800 mb-0.5">
                    🪴 Spoiler-Safe Etymology Hint Preview (Botanist&apos;s Field Notes)
                  </span>
                  <p className="text-xs italic text-amber-950 leading-relaxed">
                    {getSafeEtymologyHint(formState)}
                  </p>
                </div>
              )}

              {/* Morpheme Breakdown Preview & Sync */}
              <div className="p-3 rounded-xl bg-[#F4F7F0] border border-[#DCE5D5] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    🧬 Word Network Morpheme Breakdown (Prefix · Root · Suffix)
                  </span>
                  {activeTab === 'live' && selectedIndex !== null && (
                    <button
                      type="button"
                      disabled={regenMorphemesLoading}
                      onClick={handleRegenerateMorphemes}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-900 disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${regenMorphemesLoading ? 'animate-spin' : ''}`}
                      />
                      <span>
                        {regenMorphemesLoading ? 'Updating...' : 'Regenerate Morphemes'}
                      </span>
                    </button>
                  )}
                </div>
                {formMorphemes &&
                (formMorphemes.prefixes.length > 0 ||
                  formMorphemes.roots.length > 0 ||
                  formMorphemes.suffixes.length > 0) ? (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {formMorphemes.prefixes.map((p, idx) => (
                      <span
                        key={`cur-p-${p.canonicalId}-${idx}`}
                        className="px-2 py-0.5 rounded-lg bg-[#FCF7EA] border border-[#E6D4A5] text-amber-950 font-bold"
                      >
                        Pre: {p.form} ({p.canonicalId})
                      </span>
                    ))}
                    {formMorphemes.roots.map((r, idx) => (
                      <span
                        key={`cur-r-${r.canonicalId}-${idx}`}
                        className="px-2 py-0.5 rounded-lg bg-[#EDF5EB] border border-[#BBD9B7] text-emerald-950 font-bold"
                      >
                        Root: {r.form} → {r.canonicalId}
                        {r.pieRoot ? ` · PIE ${r.pieRoot}` : ''}
                      </span>
                    ))}
                    {formMorphemes.suffixes.map((s, idx) => (
                      <span
                        key={`cur-s-${s.form}-${idx}`}
                        className="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 font-semibold"
                      >
                        Suf: {s.form}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-700 italic">
                    Morphemes will be generated automatically when you save, add, or click Auto-Populate Fields.
                  </p>
                )}
              </div>
            </div>

            {/* Example Sentence + Live Masking Preview */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Seed Sprout Example Usage Sentence 📖
              </label>
              <textarea
                rows={2}
                value={formState.example}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, example: e.target.value }))
                }
                className="w-full p-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-xs sm:text-sm text-emerald-950 leading-relaxed"
              />

              {/* Live Gameplay Masking Preview */}
              <div
                className={`p-3.5 rounded-2xl border ${
                  isMaskValid
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-amber-50 border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1 text-emerald-800">
                    <Eye className="w-3.5 h-3.5" /> Live Game Masking Preview (Seed Sprout)
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isMaskValid
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-amber-200 text-amber-950'
                    }`}
                  >
                    {isMaskValid
                      ? '✓ Target Word Masked Properly'
                      : '⚠️ Target Word Not Found in Sentence'}
                  </span>
                </div>
                <p className="text-xs italic text-emerald-900">
                  &ldquo;{liveMaskPreview || 'Enter an example sentence above...'}&rdquo;
                </p>
              </div>
            </div>

            {/* Botanist's Field Notes Real-Life Quote & Attribution */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Botanist&apos;s Field Notes Quote (Optional — falls back to Example) ✍️
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={fetchingWikiQuote || !formState.word.trim()}
                    onClick={handleFetchWiktionaryQuote}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-black disabled:opacity-50 transition-colors"
                    title="Fetch or cycle real verified literary quotes from English Wiktionary (never AI-invented)"
                  >
                    <BookOpen
                      className={`w-3 h-3 ${fetchingWikiQuote ? 'animate-spin' : ''}`}
                    />
                    <span>
                      {fetchingWikiQuote
                        ? 'Checking Wiktionary...'
                        : '📚 Fetch Verified Wiktionary Quote'}
                    </span>
                  </button>
                  {(formState.fieldQuote || formState.fieldQuoteAuthor) && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormState((prev) => ({
                          ...prev,
                          fieldQuote: '',
                          fieldQuoteAuthor: '',
                        }))
                      }
                      className="px-2 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition-colors"
                      title="Clear quote (game will use your Example Sentence)"
                    >
                      Clear Quote
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <textarea
                    rows={2}
                    value={formState.fieldQuote || ''}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, fieldQuote: e.target.value }))
                    }
                    placeholder="Verified Wiktionary literary/historical quote (or leave blank to use Example Sentence)..."
                    className="w-full p-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-xs sm:text-sm italic text-emerald-950 leading-relaxed"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={formState.fieldQuoteAuthor || ''}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        fieldQuoteAuthor: e.target.value,
                      }))
                    }
                    placeholder="Author, Work (Year)"
                    className="w-full p-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-xs font-bold text-emerald-950"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save / Approve Action Bar */}
          <div className="pt-5 mt-5 border-t border-emerald-100 flex flex-wrap items-center justify-end gap-3">
            {activeTab === 'live' && (
              <button
                type="button"
                disabled={saving || selectedIndex === null}
                onClick={handleSaveLiveWord}
                className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving to data.ts...' : 'Save Changes to utils/data.ts'}</span>
              </button>
            )}

            {activeTab === 'staged' && selectedStagedId && (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleRejectStaged(selectedStagedId)}
                  className="px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-800 font-bold text-sm border border-red-200 transition-all"
                >
                  Reject Candidate 🗑️
                </button>
                <button
                  type="button"
                  disabled={saving || liveSimilarMatches.some((m) => m.matchType === 'exact')}
                  onClick={() => handleApproveStaged(false)}
                  className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve &amp; Add to utils/data.ts 🌱</span>
                </button>
              </>
            )}

            {activeTab === 'new' && (
              <button
                type="button"
                disabled={saving || liveSimilarMatches.some((m) => m.matchType === 'exact')}
                onClick={() => handleAddNewWord(false)}
                className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Plant New Word in utils/data.ts 🌱</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

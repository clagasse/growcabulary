'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BOTANICAL_RANKS,
  GROWTH_STAGE_META,
  TOPIC_CATEGORIES,
  WORD_BANKS,
  getWordDifficulty,
  getWordTopic,
} from '../constants';
import { GardenEntry, GrowthStage } from '../types';
import { RAW_WORDS } from '../utils/data';
import { computeMasteryRankPoints, isWordMastered } from '../utils/srs';
import {
  ScoredRoundRecord,
  fetchAndMergeCloudScoredRounds,
  loadHighScores,
  loadScoredRoundsLocal,
} from '../utils/scoring';
import { createClient, isSupabaseConfigured } from '../utils/supabase/client';
import { ArrowLeft, Award, CheckCircle2, Lock, Sprout, TrendingUp, Trophy } from 'lucide-react';

const RAW_WORDS_BY_KEY = new Map(RAW_WORDS.map((w) => [w.word.toLowerCase(), w]));

function normalizeEntry(entry: GardenEntry): GardenEntry {
  const match = RAW_WORDS_BY_KEY.get(entry.word.toLowerCase());
  return {
    ...entry,
    seed: match ? getWordDifficulty(match) : getWordDifficulty(entry),
    topic: match ? getWordTopic(match) : getWordTopic(entry),
  };
}

const STAGE_POINTS: { stage: GrowthStage; pts: number }[] = [
  { stage: 'perennial', pts: 6 },
  { stage: 'bloom', pts: 4 },
  { stage: 'bud', pts: 2 },
  { stage: 'sprout', pts: 1 },
];

export const BotanicalRanksClient: React.FC = () => {
  const [gardenList, setGardenList] = useState<GardenEntry[]>([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [scoredRounds, setScoredRounds] = useState<ScoredRoundRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedGarden = localStorage.getItem('growcabulary_garden');
      if (savedGarden) {
        const parsed = JSON.parse(savedGarden);
        if (Array.isArray(parsed)) {
          setGardenList(parsed.map((item) => normalizeEntry(item)));
        }
      }
      const savedStreak = Number(localStorage.getItem('growcabulary_daily_streak') || 0);
      setDailyStreak(savedStreak);
      setHighScores(loadHighScores());
      setScoredRounds(loadScoredRoundsLocal());
    } catch {
      // Ignore storage parse error
    } finally {
      setHydrated(true);
    }
  }, []);

  // Also merge cloud progress if signed in
  useEffect(() => {
    if (!hydrated || !isSupabaseConfigured()) return;
    const loadCloud = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data: rows } = await supabase
          .from('user_word_progress')
          .select('*')
          .eq('user_id', user.id);
        if (!rows || rows.length === 0) return;

        setGardenList((prev) => {
          const merged = new Map<string, GardenEntry>();
          prev.forEach((p) => merged.set(p.word.toLowerCase(), p));
          rows.forEach((row) => {
            const key = (row.word_term || '').toLowerCase();
            const lexicon = RAW_WORDS_BY_KEY.get(key);
            if (!lexicon) return;
            const existing = merged.get(key);
            const cloudTime = new Date(row.updated_at || row.last_watered_date || 0).getTime();
            const localTime = new Date(
              existing?.compostedAt || existing?.lastWateredDate || 0
            ).getTime();
            if (!existing || cloudTime >= localTime) {
              const rawModes: string[] = Array.isArray(row.modes_mastered)
                ? row.modes_mastered
                : [];
              merged.set(key, {
                ...lexicon,
                dateLearned: new Date(row.created_at || Date.now()).toLocaleDateString(),
                repetitionCount: row.repetition_count ?? 1,
                easeFactor: Number(row.ease_factor ?? 2.5),
                intervalDays: row.interval_days ?? 1,
                nextReviewDate: row.next_review_date,
                lastWateredDate: row.last_watered_date,
                growthStage: row.growth_stage || 'sprout',
                modesMastered: rawModes.filter(
                  (m): m is NonNullable<GardenEntry['modesMastered']>[number] =>
                    m === 'seed-sprout' || m === 'field-notes' || m === 'own-words' || m === 'watering'
                ),
                userSentence: existing?.userSentence,
                isComposted: Boolean(row.is_composted) || rawModes.includes('compost'),
              });
            }
          });
          return Array.from(merged.values());
        });
      } catch {
        // Ignore non-fatal cloud read error
      }
    };
    loadCloud();
    fetchAndMergeCloudScoredRounds().then(({ rounds, highScores: mergedBests }) => {
      setScoredRounds(rounds);
      setHighScores(mergedBests);
    });
  }, [hydrated]);

  const activeGarden = useMemo(
    () => gardenList.filter((g) => !g.isComposted),
    [gardenList]
  );
  const compostedSet = useMemo(
    () => new Set(gardenList.filter((g) => g.isComposted).map((g) => g.word.toLowerCase())),
    [gardenList]
  );
  const activeByKey = useMemo(
    () => new Map(activeGarden.map((g) => [g.word.toLowerCase(), g])),
    [activeGarden]
  );

  const masteryPoints = useMemo(() => computeMasteryRankPoints(gardenList), [gardenList]);
  const currentRankIndex = useMemo(() => {
    for (let i = BOTANICAL_RANKS.length - 1; i >= 0; i--) {
      if (masteryPoints >= BOTANICAL_RANKS[i].min) return i;
    }
    return 0;
  }, [masteryPoints]);

  const currentRank = BOTANICAL_RANKS[currentRankIndex];
  const nextRank = BOTANICAL_RANKS[currentRankIndex + 1] || null;
  const progressToNextPct = nextRank
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((masteryPoints - currentRank.min) / Math.max(1, nextRank.min - currentRank.min)) * 100
          )
        )
      )
    : 100;

  const masteredCount = useMemo(
    () => activeGarden.filter((g) => isWordMastered(g)).length,
    [activeGarden]
  );

  const totalNonComposted = RAW_WORDS.filter((w) => !compostedSet.has(w.word.toLowerCase())).length;
  const overallDiscoveredPct =
    totalNonComposted > 0 ? Math.round((activeGarden.length / totalNonComposted) * 100) : 0;
  const overallMasteredPct =
    totalNonComposted > 0 ? Math.round((masteredCount / totalNonComposted) * 100) : 0;

  const stageCounts = useMemo(() => {
    const counts: Record<GrowthStage, number> = {
      seed: 0,
      sprout: 0,
      bud: 0,
      bloom: 0,
      perennial: 0,
    };
    activeGarden.forEach((g) => {
      const s = g.growthStage || 'sprout';
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [activeGarden]);

  const difficultyProgress = useMemo(() => {
    return WORD_BANKS.map((bank) => {
      const words = RAW_WORDS.filter(
        (w) => getWordDifficulty(w) === bank.type && !compostedSet.has(w.word.toLowerCase())
      );
      const discovered = words.filter((w) => activeByKey.has(w.word.toLowerCase())).length;
      const mastered = words.filter((w) => {
        const g = activeByKey.get(w.word.toLowerCase());
        return g ? isWordMastered(g) : false;
      }).length;
      return {
        ...bank,
        total: words.length,
        discovered,
        mastered,
        discoveredPct: words.length > 0 ? Math.round((discovered / words.length) * 100) : 0,
        masteredPct: words.length > 0 ? Math.round((mastered / words.length) * 100) : 0,
      };
    });
  }, [activeByKey, compostedSet]);

  const topicProgress = useMemo(() => {
    return TOPIC_CATEGORIES.map((topic) => {
      const words = RAW_WORDS.filter(
        (w) => getWordTopic(w) === topic.type && !compostedSet.has(w.word.toLowerCase())
      );
      const discovered = words.filter((w) => activeByKey.has(w.word.toLowerCase())).length;
      const mastered = words.filter((w) => {
        const g = activeByKey.get(w.word.toLowerCase());
        return g ? isWordMastered(g) : false;
      }).length;
      return {
        ...topic,
        total: words.length,
        discovered,
        mastered,
        discoveredPct: words.length > 0 ? Math.round((discovered / words.length) * 100) : 0,
        masteredPct: words.length > 0 ? Math.round((mastered / words.length) * 100) : 0,
      };
    });
  }, [activeByKey, compostedSet]);

  return (
    <div className="min-h-screen hybrid-bg py-6 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto journal-card rounded-3xl p-5 sm:p-8 space-y-8">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DCE5D5]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Menu</span>
          </Link>

          <Link
            href="/help"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
          >
            How Mastery &amp; Points Work
          </Link>
        </div>

        {/* Hero Rank Summary */}
        <div className="rounded-3xl border-2 border-emerald-700/30 bg-gradient-to-br from-[#F2F7EE] via-[#F7FAF4] to-[#EDF5EB] p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-3xl shadow-md">
                {currentRank.emoji}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">
                  Current Botanical Rank
                </span>
                <h1 className="serif text-3xl sm:text-4xl font-bold text-emerald-950">
                  {currentRank.title}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 tabular-nums">
                  {masteryPoints} Mastery Points · {activeGarden.length} Active Words ·{' '}
                  {masteredCount} Mastered
                  {dailyStreak > 0 ? ` · 🔥 ${dailyStreak}d Streak` : ''}
                </p>
              </div>
            </div>

            {nextRank ? (
              <div className="bg-[#FFFDF8] border border-[#CFE0C8] rounded-2xl px-4 py-3 text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                  Next Rank
                </span>
                <span className="serif text-lg font-bold text-emerald-950">
                  {nextRank.emoji} {nextRank.title}
                </span>
                <span className="text-xs font-bold text-amber-800 block tabular-nums">
                  {nextRank.min - masteryPoints} pts to go
                </span>
              </div>
            ) : (
              <div className="bg-amber-100 border border-amber-300 rounded-2xl px-4 py-3 text-amber-950 font-black text-xs uppercase tracking-wider">
                👑 Maximum Rank Reached!
              </div>
            )}
          </div>

          {/* Progress bar to next rank */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
              <span>
                {currentRank.emoji} {currentRank.title} ({currentRank.min} pts)
              </span>
              {nextRank && (
                <span>
                  {nextRank.emoji} {nextRank.title} ({nextRank.min} pts)
                </span>
              )}
            </div>
            <div className="w-full h-3 rounded-full bg-[#DCE6D6] overflow-hidden">
              <div
                className="h-full bg-emerald-700 transition-all duration-500 rounded-full"
                style={{ width: `${progressToNextPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* How Mastery Points Add Up */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-800" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              How Your Points Add Up
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800">
            Every active word in your Garden contributes Mastery Points based on its current growth
            stage. Reviewing flashcards and practicing in context grows your words—and your rank.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STAGE_POINTS.map(({ stage, pts }) => {
              const meta = GROWTH_STAGE_META[stage];
              const count = stageCounts[stage] || 0;
              return (
                <div key={stage} className="journal-subcard rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-800 text-white">
                      +{pts} pt{pts > 1 ? 's' : ''} each
                    </span>
                  </div>
                  <p className="font-black text-sm text-emerald-950">{meta.label}</p>
                  <p className="text-xs text-emerald-800 tabular-nums">
                    {count} word{count === 1 ? '' : 's'} = <strong>{count * pts} pts</strong>
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Overall Lexicon Progression */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-800" />
              <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
                Overall Word Progression
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-800 tabular-nums">
              {activeGarden.length} / {totalNonComposted} Discovered ({overallDiscoveredPct}%) ·{' '}
              {masteredCount} Mastered ({overallMasteredPct}%)
            </span>
          </div>

          <div className="journal-subcard rounded-2xl p-4 space-y-2">
            <div className="w-full h-3 rounded-full bg-[#DCE6D6] overflow-hidden flex">
              <div
                className="h-full bg-emerald-700 transition-all"
                style={{ width: `${overallMasteredPct}%` }}
                title="Mastered"
              />
              <div
                className="h-full bg-amber-400 transition-all"
                style={{ width: `${Math.max(0, overallDiscoveredPct - overallMasteredPct)}%` }}
                title="Discovered / Learning"
              />
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-emerald-800">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" /> Mastered
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Learning
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DCE6D6] inline-block" /> Undiscovered
              </span>
            </div>
          </div>

          {/* By Difficulty Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {difficultyProgress.map((d) => (
              <div key={d.type} className="rounded-2xl border border-[#DCE5D5] bg-[#FFFDF8] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-emerald-950">
                    {d.emoji} {d.label}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 tabular-nums">
                    {d.discovered}/{d.total}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E3EAD9] overflow-hidden flex">
                  <div className="h-full bg-emerald-700" style={{ width: `${d.masteredPct}%` }} />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${Math.max(0, d.discoveredPct - d.masteredPct)}%` }}
                  />
                </div>
                <p className="text-[11px] text-emerald-700 font-medium tabular-nums">
                  {d.mastered} Mastered · {d.discovered - d.mastered} Learning
                </p>
              </div>
            ))}
          </div>

          {/* By Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {topicProgress.map((t) => (
              <div key={t.type} className="rounded-xl border border-[#DCE5D5] bg-[#FFFDF8] p-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-emerald-950 truncate">
                    {t.emoji} {t.label}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 shrink-0 tabular-nums">
                    {t.discovered}/{t.total}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E3EAD9] overflow-hidden flex">
                  <div className="h-full bg-emerald-700" style={{ width: `${t.masteredPct}%` }} />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${Math.max(0, t.discoveredPct - t.masteredPct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal High Scores & History (Scored Mode) */}
        {(Object.keys(highScores).length > 0 || scoredRounds.length > 0) && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
                  Scored Mode Personal Bests &amp; History
                </h2>
              </div>
              {scoredRounds.length > 0 && (
                <span className="text-xs font-bold text-amber-900 tabular-nums">
                  {scoredRounds.length} scored round{scoredRounds.length === 1 ? '' : 's'} · Avg{' '}
                  {Math.round(
                    scoredRounds.reduce((s, r) => s + r.score, 0) / scoredRounds.length
                  )}{' '}
                  pts
                </span>
              )}
            </div>

            {Object.keys(highScores).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {Object.entries(highScores)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, score]) => {
                    const [mode, tier] = key.split('::');
                    const modeLabel = mode === 'field-notes' ? 'Field Notes' : 'Seed Sprout';
                    const tierLabel =
                      tier === 'garden'
                        ? 'Pasture'
                        : tier === 'meadow'
                        ? 'Meadow'
                        : tier === 'conservatory'
                        ? 'Conservatory'
                        : 'All Tiers';
                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-black text-emerald-950">{modeLabel}</p>
                          <p className="text-[11px] font-bold text-amber-900">{tierLabel}</p>
                        </div>
                        <span className="serif text-xl font-black text-amber-900 tabular-nums">
                          {score} pts
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}

            {scoredRounds.length > 0 && (
              <div className="journal-subcard rounded-2xl p-4 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  Recent Scored Rounds
                </p>
                <div className="divide-y divide-[#DCE5D5] max-h-64 overflow-y-auto">
                  {scoredRounds.slice(0, 15).map((r) => {
                    const modeLabel = r.game_mode === 'field-notes' ? '✍️ Field Notes' : '🌱 Seed Sprout';
                    const tierLabel =
                      r.difficulty === 'garden'
                        ? 'Pasture'
                        : r.difficulty === 'meadow'
                        ? 'Meadow'
                        : r.difficulty === 'conservatory'
                        ? 'Conservatory'
                        : 'All Tiers';
                    const dateStr = new Date(r.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    });
                    return (
                      <div
                        key={r.id}
                        className="py-2 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="text-[11px] font-bold text-emerald-700 shrink-0">
                            {dateStr}
                          </span>
                          <span className="font-black text-emerald-950">{modeLabel}</span>
                          <span className="text-[11px] text-emerald-800">
                            {tierLabel}
                            {r.topic && r.topic !== 'all' ? ` · ${r.topic}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 tabular-nums">
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            {r.clean_count}/{r.words_count} clean
                          </span>
                          <span className="font-black text-amber-900">{r.score} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Full 13-Rank Ladder */}
        <section className="space-y-3">
          <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
            All {BOTANICAL_RANKS.length} Botanical Ranks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {BOTANICAL_RANKS.map((rank, idx) => {
              const unlocked = masteryPoints >= rank.min;
              const isCurrent = idx === currentRankIndex;
              return (
                <div
                  key={rank.title}
                  className={`rounded-2xl p-3.5 border-2 flex items-center justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-emerald-800 border-emerald-900 text-white shadow-md'
                      : unlocked
                      ? 'bg-[#EDF5EB] border-[#C6DEC2] text-emerald-950'
                      : 'bg-[#FAF7EE] border-[#E5ECE0] text-stone-500'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{rank.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-black text-sm truncate">{rank.title}</p>
                      <p
                        className={`text-[11px] font-bold tabular-nums ${
                          isCurrent
                            ? 'text-emerald-200'
                            : unlocked
                            ? 'text-emerald-800'
                            : 'text-stone-500'
                        }`}
                      >
                        {rank.min} {rank.min === 1 ? 'pt' : 'pts'}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isCurrent ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-300 text-emerald-950">
                        Current
                      </span>
                    ) : unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Lock className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-[#DCE5D5] flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all"
          >
            <Sprout className="w-4 h-4" />
            <span>Continue Playing</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Archive,
  ArrowLeft,
  BookOpen,
  Droplets,
  EyeOff,
  Flower2,
  GitBranch,
  Keyboard,
  Sparkles,
  Sprout,
  Star,
  Volume2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Garden Guide',
  description:
    'Learn how Growcabulary’s Garden tracks word stages, pressed specimens, Hide Words self-testing, Favorites, Flashcards, Root Network, and Compost.',
};

const GROWTH_STAGES = [
  {
    emoji: '🌰',
    name: 'Seed',
    frame: 'Dashed amber · Sepia sketch (2–3d)',
    desc: 'A missed or reset word that comes back soon for review.',
  },
  {
    emoji: '🌱',
    name: 'Sprout',
    frame: 'Lime border · Pale wash (3–4d)',
    desc: 'Learned once—rests at least 3 days before its first review.',
  },
  {
    emoji: '🪴',
    name: 'Budding',
    frame: 'Emerald border · Emerging color (6–8d)',
    desc: 'Starting to stick after a couple of good reviews.',
  },
  {
    emoji: '🌸',
    name: 'In Bloom',
    frame: 'Rose mat · Full color (10–14d)',
    desc: 'Mastered! Shows as a crisp, full-color botanical illustration.',
  },
  {
    emoji: '🌳',
    name: 'Established',
    frame: 'Antique gold frame (18–30d)',
    desc: 'Well-remembered word that only checks in every few weeks (up to 30 days).',
  },
];

export default function GardenHelpPage() {
  return (
    <div className="min-h-screen hybrid-bg py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto journal-card rounded-3xl p-5 sm:p-8 space-y-8">
        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-[#DCE5D5]">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/help"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Help &amp; Guide</span>
            </Link>
            <Link
              href="/help/word-network"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDF5EB] hover:bg-emerald-100 text-emerald-900 border border-[#C6DEC2] text-xs font-bold transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Word Network Guide →</span>
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold transition-colors"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Back to Growcabulary</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="space-y-3">
          <span className="specimen-stamp inline-block px-2.5 py-0.5 text-[10px] bg-[#EDF5EB] text-emerald-900 border-[#96BE90]">
            Garden Guide
          </span>
          <div className="flex items-center gap-2.5">
            <Flower2 className="w-7 h-7 text-emerald-800 shrink-0" />
            <h1 className="serif text-3xl sm:text-4xl font-bold text-emerald-950">
              How Your Garden Works
            </h1>
          </div>
          <p className="text-sm text-emerald-900 leading-relaxed max-w-3xl">
            Every word you play in <strong>Seed Sprout</strong> is saved to your{' '}
            <strong>Garden</strong> as its own vintage botanical illustration. Use its four tabs—
            <strong>Specimens</strong>, <strong>Browse Words</strong>, <strong>Flashcards</strong>,
            and <strong>Root Network</strong>—to review due words, look up definitions, practice
            with flashcards, and explore shared word roots.
          </p>
        </div>

        {/* 1. Specimens Wall & Growth Stages */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-800" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              1. Specimens Wall &amp; Growth Stages
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            The starting <strong>Specimens</strong> tab shows every word you&apos;ve learned as a
            unique 19th-century botanical illustration—without showing the word itself, so games stay
            unspoiled. Specimens that are ready for review look softly <strong>faded</strong>. Sort
            by <strong>Growth Stage</strong>, <strong>Origin</strong>, or{' '}
            <strong>Needs Water First</strong>, and filter by language (the colored dot in each
            card&apos;s bottom-left corner). Newly learned words rest at least{' '}
            <strong>3 days</strong> before needing review. Click any specimen to jump straight into
            its <strong>Flashcard</strong> (and return to the wall when you&apos;re done), or click{' '}
            <strong>Water Due</strong> to review multiple words via <strong>Flashcards</strong>,{' '}
            <strong>Field Notes</strong>, <strong>In Your Own Words</strong>, or{' '}
            <strong>Letter Recall</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {GROWTH_STAGES.map((stage) => (
              <div
                key={stage.name}
                className="rounded-2xl border border-[#DCE5D5] bg-[#FFFDF8] p-3.5 space-y-1"
              >
                <div className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                  <span>{stage.emoji}</span>
                  <span>{stage.name}</span>
                </div>
                <p className="text-[10.5px] font-bold text-emerald-700">{stage.frame}</p>
                <p className="text-[11.5px] text-emerald-800 leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Browse Words, Hide Words & Favorites */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              2. Browse Words, Favorites &amp; Hide Words
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="journal-subcard rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                <EyeOff className="w-4 h-4 text-emerald-700" />
                <span>Hide Words Self-Test</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Click <strong>Hide Words (Self-Test)</strong> to hide every word on the page. Try
                remembering each word from its definition, then click a card to reveal it or open
                its full details.
              </p>
            </div>

            <div className="journal-subcard rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Favorites (★)</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Star words you especially want to remember or use in your writing. Filter{' '}
                <strong>Browse Words</strong> by <strong>★ Favorites</strong> or practice only your
                starred cards in <strong>Flashcards</strong>.
              </p>
            </div>

            <div className="journal-subcard rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>Filter, Sort &amp; Audio</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Filter by <strong>Difficulty</strong>, <strong>Topic</strong>,{' '}
                <strong>Origin</strong>, or <strong>Growth Stage</strong>, sort by due date or
                topic, and tap the speaker icon anytime to hear pronunciation.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Spaced-Repetition Flashcards */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-700" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              3. Spaced-Repetition Flashcards
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            Switch to <strong>Flashcards</strong> to review due words on a spaced schedule. Choose{' '}
            <strong>💧 Due Now</strong>, <strong>★ Favorites</strong>, or{' '}
            <strong>All Words</strong>, and flip between <strong>Clue → Word</strong> and{' '}
            <strong>Word → Meaning</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-1">
              <p className="text-xs font-black text-amber-900">1 · Again</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Resets the word to Seed and brings it back for review in 2 days.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 space-y-1">
              <p className="text-xs font-black text-sky-900">2 · Good</p>
              <p className="text-xs text-sky-800 leading-relaxed">
                Steadily spaces out your next review (3d → 6d → 10d → 18–30d) when due.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-1">
              <p className="text-xs font-black text-emerald-900">3 · Easy</p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Spaces reviews out a bit faster (4d → 8d → 14d → 21–30d) while keeping words fresh.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE5D5] bg-[#FFFDF8] p-4 space-y-2">
            <div className="flex items-center gap-2 font-black text-xs text-emerald-950 uppercase tracking-wider">
              <Keyboard className="w-4 h-4 text-emerald-700" />
              <span>Flashcard Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-emerald-800">
              <p>
                <code>Space</code> or <code>Enter</code> — Flip current card
              </p>
              <p>
                <code>1</code> / <code>2</code> / <code>3</code> — Rate Again / Good / Easy
              </p>
              <p>
                <code>←</code> / <code>→</code> — Previous / Next card
              </p>
              <p>
                <code>S</code> — Pronounce word · <code>F</code> — Toggle ★ Favorite
              </p>
            </div>
          </div>
        </section>

        {/* 4. Root Network & Compost */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-emerald-700/25 bg-gradient-to-br from-[#F2F7EE] to-[#EDF5EB] p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-black text-base text-emerald-950">
                <GitBranch className="w-5 h-5 text-emerald-800" />
                <span>Root Network</span>
              </div>
              <Link
                href="/help/word-network"
                className="text-xs font-black text-emerald-800 hover:text-emerald-950 underline"
              >
                Read Guide →
              </Link>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Explore an interactive map of your words grouped into 4 language zones, showing shared
              word roots (◆) and ancient roots shared across different languages.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-stone-300 bg-[#F8F6EE] p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-black text-base text-stone-900">
                <Archive className="w-5 h-5 text-stone-700" />
                <span>Compost (Skip Known Words)</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                🍂 Retire
              </span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed">
              Already know a word well? Click <strong>Compost 🍂</strong> on any word card or game
              round to hide it from future rounds and flashcards. You can restore composted words
              anytime under <strong>Browse Words → Compost</strong>.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-[#DCE5D5] flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Full Help Guide</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all"
          >
            <Sprout className="w-4 h-4" />
            <span>Return to Main Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

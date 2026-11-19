import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Sprout,
  Flower2,
  Droplets,
  Network,
  Archive,
  UserCheck,
  Layers,
  Award,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { GROWTH_STAGE_META, WORD_BANKS } from '../../constants';
import { HelpFeedbackSupportActions } from '../../components/HelpFeedbackSupportActions';

export const metadata: Metadata = {
  title: 'Help & Guide',
  description:
    'Learn how Growcabulary’s difficulty levels, word stages, spaced review, Compost, and Cloud Sync work.',
};

const PROGRESSION_STEPS = [
  {
    stage: 'seed' as const,
    when: 'Missed word or missed review (2–3 days)',
    detail: 'Comes back soon so tricky words stay fresh.',
  },
  {
    stage: 'sprout' as const,
    when: 'First time solved (3–4 days)',
    detail: 'Added to your Garden and rests a few days before its first review.',
  },
  {
    stage: 'bud' as const,
    when: '2+ good reviews (6–8 days)',
    detail: 'Starting to stick as you see and use it again.',
  },
  {
    stage: 'bloom' as const,
    when: '3+ good reviews (10–14 days · Mastered)',
    detail: 'Counts as Mastered once you remember it across longer breaks.',
  },
  {
    stage: 'perennial' as const,
    when: '4+ good reviews (18–30 days · Mastered)',
    detail: 'Well-known word that only pops up occasionally for a quick check-in.',
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen hybrid-bg py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto journal-card rounded-3xl p-5 sm:p-8 space-y-8">
        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DCE5D5]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Menu</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cloud Sync / Sign In</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="space-y-4">
          <div>
            <span className="specimen-stamp inline-block px-2.5 py-0.5 text-[10px] bg-[#EDF5EB] text-emerald-900 border-[#96BE90] mb-2">
              Field Manual &amp; Guide
            </span>
            <h1 className="serif text-3xl sm:text-4xl font-bold text-emerald-950 mb-3">
              Welcome to Growcabulary
            </h1>
            <div className="space-y-2.5 text-sm text-emerald-900 leading-relaxed max-w-3xl">
              <p>
                <strong>Growcabulary.com</strong> is a word game for learning{' '}
                <strong>useful, expressive English words</strong> you can genuinely use in everyday
                reading, writing, and conversation.
              </p>
              <p className="text-emerald-800">
                Instead of boring flashcards or obscure trivia, Growcabulary treats your vocabulary
                like a garden: you <strong>find</strong> new words in <strong>Seed Sprout</strong>,
                practice spotting and writing with them in <strong>Field Notes</strong> and{' '}
                <strong>In Your Own Words</strong>, and keep them fresh with{' '}
                <strong>Flashcards</strong> and word-root maps in your <strong>Garden</strong>.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/75 p-4 text-xs sm:text-sm text-amber-950 leading-relaxed max-w-3xl">
              <strong className="font-black">Expect to use hints at first:</strong> The games are
              meant to be challenging—you aren&apos;t expected to know every word right away. Using{' '}
              <strong>Reveal Letter</strong>, <strong>Letter Tiles</strong>,{' '}
              <strong>Word Origin</strong>, or <strong>Narrow Down</strong> clues is part of how
              you learn. Every word you play gets saved to your Garden so it sticks next time.
            </div>
          </div>
        </div>

        {/* 1. Difficulty System & Topics */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-800" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              Difficulty Tiers &amp; Topics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            Every word in Growcabulary has both a <strong>Difficulty Tier</strong> and a{' '}
            <strong>Topic Category</strong> (<em>Emotions</em>, <em>Philosophy</em>,{' '}
            <em>Biology</em>, <em>Architecture</em>, <em>Statecraft</em>, <em>Literature</em>, or{' '}
            <em>General</em>). You can combine any Difficulty Tier with any Topic filter—or play a
            whole Topic across all difficulties.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {WORD_BANKS.map((bank) => (
              <div key={bank.type} className="journal-subcard rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                  <span className="text-lg">{bank.emoji}</span>
                  <span>{bank.label}</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">{bank.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Word Progression & Mastery System */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-800" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              Word Progression &amp; Mastery System
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            Solving a word once only plants it. To master a word, you need to remember it over
            time. As you review a word successfully across longer breaks, it grows through 5 stages
            and earns points toward your{' '}
            <Link href="/ranks" className="font-bold underline text-emerald-950">
              Botanical Rank
            </Link>{' '}
            (from <em>Forager</em> up to <em>Grand Arborist</em>).
          </p>

          <div className="space-y-2">
            {PROGRESSION_STEPS.map(({ stage, when, detail }) => {
              const meta = GROWTH_STAGE_META[stage];
              return (
                <div
                  key={stage}
                  className="rounded-2xl border border-[#DCE5D5] bg-[#FFFDF8] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border shrink-0 ${meta.badgeClass}`}
                    >
                      {meta.emoji} {meta.label}
                    </span>
                    <span className="text-xs font-bold text-emerald-950">{when}</span>
                  </div>
                  <p className="text-xs text-emerald-800 sm:text-right">{detail}</p>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-emerald-700 font-medium">
            Each word&apos;s detail card also shows which modes you&apos;ve practiced it in: Seed
            Sprout, Field Notes, In Your Own Words, and Flashcards.
          </p>
        </section>

        {/* 3. Timed & Scored Mode */}
        <section id="scored-mode" className="space-y-3 scroll-mt-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-700" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              Timed &amp; Scored Mode
            </h2>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/55 p-4 sm:p-5 space-y-3">
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              Switch between <strong>🌿 Zen Mode</strong> (untimed, relaxed) and{' '}
              <strong>🏆 Scored Mode</strong> on the main menu to test your speed in{' '}
              <strong>Seed Sprout</strong> and <strong>Field Notes</strong>. In Scored Field Notes,
              rounds pull from the <strong>full word list</strong> (not just words you&apos;ve
              already learned) to keep things challenging.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#FFFDF8] border border-amber-200/80 p-3 space-y-1">
                <p className="text-xs font-black text-amber-950">⏱️ 30s Decay Meter</p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Each word starts at <strong>100 base pts</strong> and drains smoothly to{' '}
                  <strong>0</strong> over <strong>30 seconds</strong>. Missed words score 0 pts.
                </p>
              </div>
              <div className="rounded-xl bg-[#FFFDF8] border border-amber-200/80 p-3 space-y-1">
                <p className="text-xs font-black text-amber-950">⚡ Hint Deductions</p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Using hints deducts from your remaining base points:{' '}
                  <strong>-10 pts</strong> per Reveal Letter, <strong>-30 pts</strong> for Letter
                  Tiles, and <strong>-75 pts</strong> to narrow Field Notes down to 5 words.
                </p>
              </div>
              <div className="rounded-xl bg-[#FFFDF8] border border-amber-200/80 p-3 space-y-1">
                <p className="text-xs font-black text-amber-950">🔥 Tier &amp; Streak Bonuses</p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Points multiply by tier (<strong>1×</strong> Pasture, <strong>1.5×</strong>{' '}
                  Meadow, <strong>2×</strong> Conservatory) and clean streaks (+0.25× per unassisted
                  word, up to <strong>2×</strong>).
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your best scores and round history across modes and tiers are saved locally and
              synced to your cloud account on the{' '}
              <Link href="/ranks" className="font-bold underline text-emerald-950">
                Ranks &amp; High Scores
              </Link>{' '}
              page.
            </p>
          </div>
        </section>

        {/* 4. Spaced Repetition & Review */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-700" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              How Spaced Review (&ldquo;Watering&rdquo;) Works
            </h2>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 sm:p-5 space-y-3">
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              New words fade quickly if you only see them once. Growcabulary brings each word back
              right before you&apos;d forget it—with at least a <strong>3-day break</strong> after
              you first learn a word:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#FFFDF8] border border-sky-200/80 p-3">
                <p className="text-xs font-black text-amber-900 mb-1">Again (Missed)</p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Resets the word to Seed and brings it back in 2 days so you can lock it in.
                </p>
              </div>
              <div className="rounded-xl bg-[#FFFDF8] border border-sky-200/80 p-3">
                <p className="text-xs font-black text-sky-900 mb-1">Good</p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Gradually spaces out your next review (3d → 6d → 10d → 18–30d) when due.
                </p>
              </div>
              <div className="rounded-xl bg-[#FFFDF8] border border-sky-200/80 p-3">
                <p className="text-xs font-black text-emerald-900 mb-1">Easy</p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Spaces reviews out a bit faster (4d → 8d → 14d → 21–30d) so you spend more time
                  on harder words.
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              You can practice any word early whenever you like—its growth stage only advances when
              the word is actually due, so you can&apos;t accidentally level it up twice in one day.
            </p>
          </div>
        </section>

        {/* 5. Garden Tools */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-emerald-800" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              Garden Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="journal-subcard rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Specimens, Browse Words &amp; Flashcards</span>
                </div>
                <Link
                  href="/help/garden"
                  className="text-[11px] font-black text-emerald-800 hover:text-emerald-950 underline"
                >
                  Full Guide →
                </Link>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                See your words as vintage botanical illustrations, click any faded specimen to
                review it on a flashcard, browse definitions with <strong>Hide Words</strong>, and
                practice with flashcards.
              </p>
            </div>
            <div className="journal-subcard rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
                  <Network className="w-4 h-4 text-emerald-700" />
                  <span>Root Network</span>
                </div>
                <Link
                  href="/help/word-network"
                  className="text-[11px] font-black text-emerald-800 hover:text-emerald-950 underline"
                >
                  Full Guide →
                </Link>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Explore an interactive map grouped by language origin (with French and Italian &amp;
                Spanish inside Latin &amp; Romance), shared word roots, and ancient roots shared
                across languages.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Prominent Dedicated Cards: Compost & Account / Cloud Sync */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Compost Section */}
          <section className="rounded-2xl border-2 border-stone-300 bg-[#F8F6EE] p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-black text-base text-stone-900">
                <Archive className="w-5 h-5 text-stone-700" />
                <span>Compost (Skip Known Words)</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                🍂 Filter
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
              Already know a word well? Click <strong>Compost 🍂</strong> in any game, word card,
              or flashcard to hide it from future rounds and reviews.
            </p>
            <p className="text-xs text-stone-700 leading-relaxed">
              Composted words don&apos;t count against your mastery totals and can be restored
              anytime under <strong>Garden → Browse Words → Compost</strong>.
            </p>
          </section>

          {/* Account & Cloud Sync Section */}
          <section className="rounded-2xl border-2 border-emerald-700/30 bg-gradient-to-br from-[#F2F7EE] to-[#EDF5EB] p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-black text-base text-emerald-950">
                <UserCheck className="w-5 h-5 text-emerald-800" />
                <span>Account &amp; Cloud Sync</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-800 text-white">
                Optional
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              You can play immediately with zero signup—all progress is saved automatically in your
              browser. Creating a free account lets you back up your Garden and sync your
              review schedule across devices.
            </p>
            <p className="text-xs text-emerald-800 leading-relaxed">
              When you sign in, any words you already discovered locally automatically merge with
              your cloud profile.
            </p>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In or Create Account →</span>
              </Link>
            </div>
          </section>
        </div>

        {/* About This Project & Sources */}
        <section className="journal-subcard rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="space-y-1.5">
            <h2 className="font-black text-sm text-emerald-950">About This Project</h2>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              Growcabulary was built by a solo developer with AI assistance—including drafting and
              organizing definitions, etymologies, and example sentences. If you spot any errors,
              inaccuracies, or bugs, please let us know using the <strong>Send Feedback</strong>{' '}
              button below.
            </p>
          </div>
          <div className="pt-2.5 border-t border-[#DCE5D5] space-y-1.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-emerald-900">
              Definitions &amp; Real-Life Example Sources
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs text-emerald-800 leading-relaxed">
              <li>
                <strong>Wiktionary</strong> (
                <a
                  href="https://en.wiktionary.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-emerald-950 hover:text-emerald-700"
                >
                  en.wiktionary.org
                </a>
                ): Verified literary, historical, and journalistic quotation passages (with author,
                work, and year) used in Field Notes and Flashcards, as well as dictionary-sense
                auditing for secondary definitions.
              </li>
              <li>
                <strong>Classic Literature &amp; Historical Speeches:</strong> Public-domain and
                canonical works (e.g., Shakespeare, Austen, Brontë, Dickens, Thoreau, Orwell,
                Lincoln, and Churchill), each cited directly beneath its passage.
              </li>
              <li>
                <strong>Editorial &amp; AI-Assisted Curation:</strong> Primary definitions,
                etymology notes, and fallback example sentences where no external quote is attached.
              </li>
            </ul>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-[#DCE5D5] flex flex-wrap items-center justify-between gap-3">
          <HelpFeedbackSupportActions />
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

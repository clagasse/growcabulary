import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Compass,
  Link2,
  MousePointerClick,
  Network,
  Search,
  Sparkles,
  Sprout,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Word Network Guide',
  description:
    'Learn how Growcabulary’s Word Network maps origin zones, shared root hubs, Shared Ancient Roots across languages, and morpheme breakdowns.',
};

const ORIGIN_ZONES = [
  {
    emoji: '🏛️',
    name: 'Latin & Romance',
    dotClass: 'bg-[#15803D]',
    cardClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
    desc: 'Words inherited from Classical/Late Latin or passed through Old French, Italian, Spanish, and Portuguese.',
  },
  {
    emoji: '🌺',
    name: 'Greek',
    dotClass: 'bg-[#BE185D]',
    cardClass: 'bg-rose-50/70 border-rose-200 text-rose-950',
    desc: 'Words rooted in Ancient Greek philosophy, medicine, science, rhetoric, and poetry.',
  },
  {
    emoji: '🌲',
    name: 'Germanic & Norse',
    dotClass: 'bg-[#4D7C0F]',
    cardClass: 'bg-lime-50/70 border-lime-200 text-lime-950',
    desc: 'Words descending from Old English, Old Norse, Dutch, and German.',
  },
  {
    emoji: '🌍',
    name: 'World & Eponyms',
    dotClass: 'bg-[#B45309]',
    cardClass: 'bg-amber-50/70 border-amber-200 text-amber-950',
    desc: 'Loanwords from Sanskrit, Arabic, Japanese, Portuguese, fictional coinages, and historical eponyms.',
  },
];

export default function WordNetworkHelpPage() {
  return (
    <div className="min-h-screen hybrid-bg py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto journal-card rounded-3xl p-5 sm:p-8 space-y-8">
        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DCE5D5]">
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Help &amp; Guide</span>
          </Link>

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
            Garden Tool Guide
          </span>
          <div className="flex items-center gap-2.5">
            <Network className="w-7 h-7 text-emerald-800 shrink-0" />
            <h1 className="serif text-3xl sm:text-4xl font-bold text-emerald-950">
              How the Word Network Works
            </h1>
          </div>
          <p className="text-sm text-emerald-900 leading-relaxed max-w-3xl">
            The <strong>Word Network</strong> (inside <strong>Garden → Word Network</strong>) plots
            your discovered vocabulary—or optionally the entire lexicon—as an interactive physics
            map grouped by historical language origin and connected by shared etymological roots.
          </p>
        </div>

        {/* 1. The 4 Origin Zones */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-800" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              1. The 4 Origin Zones
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            Every word pulls naturally into its ancestral language zone—even if it passed through
            French or Middle English on the way into modern English:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ORIGIN_ZONES.map((z) => (
              <div key={z.name} className={`rounded-2xl border p-4 space-y-1.5 ${z.cardClass}`}>
                <div className="flex items-center gap-2 font-black text-sm">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${z.dotClass}`} />
                  <span>
                    {z.emoji} {z.name}
                  </span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">{z.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Link Types & Shared Ancient Roots */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-emerald-800" />
            <h2 className="serif text-xl sm:text-2xl font-bold text-emerald-950">
              2. How Words Connect
            </h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-200 bg-[#FFFDF8] p-4 space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-0.5 bg-[#16A34A] inline-block rounded shrink-0" />
                <span className="text-sm font-black text-emerald-950">
                  Solid Green Line — Same Root Hub
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                  ◆ Root Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                When 2 or more words in view share the exact same root stem, they cluster around a
                gold <strong>Root Hub diamond</strong>. For example, Latin{' '}
                <em>facere</em> (&ldquo;to make, do&rdquo;) links <em>facile</em>, <em>edifice</em>,{' '}
                <em>munificent</em>, and <em>beatific</em>.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 border-t-2 border-dashed border-[#7C3AED] inline-block shrink-0" />
                <span className="text-sm font-black text-purple-950">
                  Dashed Purple Line — Shared Ancient Root (Cross-Language Cousins)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">
                Often words in <em>different</em> origin zones look completely different on the
                surface, yet inherited the exact same prehistoric root independently (~5,000+ years
                ago, known in linguistics as a <strong>Proto-Indo-European</strong> or{' '}
                <em>PIE</em> root, marked with <code>*</code>). Dashed purple bridges stretch
                across zones to reveal these hidden cousins:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-purple-900">
                <li>
                  <strong>
                    <code>*bher-</code> (&ldquo;to carry, bear&rdquo;)
                  </strong>{' '}
                  connects Latin <em>ferre</em> (<em>referendum</em>, <em>vociferous</em>) ↔ Greek{' '}
                  <em>pherein</em> (<em>dysphoria</em>) ↔ Germanic (<em>forbearance</em>,{' '}
                  <em>burgeon</em>).
                </li>
                <li>
                  <strong>
                    <code>*weid-</code> (&ldquo;to see, know&rdquo;)
                  </strong>{' '}
                  connects Latin <em>videre</em> (<em>prudent</em>, <em>vista</em>) ↔ Greek{' '}
                  <em>eidos</em> (<em>kaleidoscope</em>) ↔ Old English <em>witan</em> (
                  <em>wistful</em>).
                </li>
                <li>
                  <strong>
                    <code>*ten-</code> (&ldquo;to stretch, hold&rdquo;)
                  </strong>{' '}
                  connects Latin <em>tendere / tenere</em> (<em>portent</em>, <em>tenacious</em>,{' '}
                  <em>attenuate</em>) ↔ Greek <em>teinein</em> (<em>neoteny</em>).
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 border-t-2 border-dotted border-[#D97706] inline-block shrink-0" />
                <span className="text-sm font-black text-amber-950">
                  Dotted Amber Line — Shared Prefix (Shown on Hover / Click)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                To keep the map uncluttered at rest, prefix links only appear when you hover or click
                a word—highlighting other words starting with the same normalized prefix (e.g.,{' '}
                <code>anti-</code>, <code>ante-</code>, <code>com-/con-</code>, <code>in-/im-</code>
                , or <code>inter-</code>).
              </p>
            </div>
          </div>
        </section>

        {/* 3. Discovered vs Undiscovered + Morphemes */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="journal-subcard rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Discovered vs. Full Lexicon</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Solid colorful dots are <strong>words you have discovered</strong>. Toggle{' '}
              <strong>Full Lexicon</strong> in the toolbar to also reveal undiscovered words (shown
              as pale outlined dots with 🔒) so you can see full root families before unlocking them.
            </p>
          </div>

          <div className="journal-subcard rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
              <MousePointerClick className="w-4 h-4 text-emerald-700" />
              <span>Why Some Words Stand Alone</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Suffixes like <code>-ous</code>, <code>-ity</code>, or <code>-tion</code> only mark
              part of speech, so Growcabulary doesn&apos;t link unrelated words just because they
              share an ending. Words whose root appears only once in your current view sit spaced
              out around the edges of their Origin Zone.
            </p>
          </div>
        </section>

        {/* 4. Controls Cheat Sheet */}
        <section className="rounded-2xl border border-[#DCE5D5] bg-[#FFFDF8] p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
            <Search className="w-4 h-4 text-emerald-700" />
            <span>Quick Controls</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-emerald-800">
            <li>
              <strong>Scroll wheel:</strong> Zoom in/out (labels automatically declutter as you zoom).
            </li>
            <li>
              <strong>Drag background:</strong> Pan smoothly across all 4 Origin Zones.
            </li>
            <li>
              <strong>Click any node:</strong> Isolate its connected family &amp; read its Prefix / Root / Suffix breakdown below.
            </li>
            <li>
              <strong>Search + Enter:</strong> Type a word or root and press <code>Enter</code> to fly the camera right to it.
            </li>
          </ul>
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

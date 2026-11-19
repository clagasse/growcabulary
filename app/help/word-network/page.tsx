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
  title: 'Root Network Guide',
  description:
    'Learn how Growcabulary’s Root Network groups words by language origin and connects them by shared roots, ancient shared roots, and prefixes.',
};

const ORIGIN_ZONES = [
  {
    emoji: '🏛️',
    name: 'Latin & Romance',
    dotClass: 'bg-[#15803D]',
    cardClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
    desc: 'Latin words (green), with color-coded sub-groups for French (violet) and Italian & Spanish (terracotta) nested right inside.',
  },
  {
    emoji: '🌺',
    name: 'Greek',
    dotClass: 'bg-[#BE185D]',
    cardClass: 'bg-rose-50/70 border-rose-200 text-rose-950',
    desc: 'Words from Ancient Greek philosophy, medicine, science, debate, and poetry.',
  },
  {
    emoji: '🌲',
    name: 'Germanic & Norse',
    dotClass: 'bg-[#4D7C0F]',
    cardClass: 'bg-lime-50/70 border-lime-200 text-lime-950',
    desc: 'Words from Old English, Old Norse, Dutch, and German.',
  },
  {
    emoji: '🌍',
    name: 'World & Eponyms',
    dotClass: 'bg-[#B45309]',
    cardClass: 'bg-amber-50/70 border-amber-200 text-amber-950',
    desc: 'Words borrowed from Arabic, Hebrew, Tamil, Sanskrit, or named after real people and places.',
  },
];

export default function WordNetworkHelpPage() {
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
              href="/help/garden"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDF5EB] hover:bg-emerald-100 text-emerald-900 border border-[#C6DEC2] text-xs font-bold transition-colors"
            >
              <span>Garden Guide 🌸 →</span>
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
            Garden Tool Guide
          </span>
          <div className="flex items-center gap-2.5">
            <Network className="w-7 h-7 text-emerald-800 shrink-0" />
            <h1 className="serif text-3xl sm:text-4xl font-bold text-emerald-950">
              How the Root Network Works
            </h1>
          </div>
          <p className="text-sm text-emerald-900 leading-relaxed max-w-3xl">
            The <strong>Root Network</strong> (under <strong>Garden → Root Network</strong>) turns
            your learned words—or the entire word list—into an interactive map grouped by where
            words come from and linked by their shared roots.
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
            Every word naturally groups into its language family—with <strong>French</strong> and{' '}
            <strong>Italian &amp; Spanish</strong> grouped inside <strong>Latin &amp; Romance</strong>:
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
                When 2 or more words share the same root, they gather around a gold{' '}
                <strong>Root Hub diamond</strong>. For example, Latin <em>facere</em> (&ldquo;to
                make, do&rdquo;) links <em>facile</em>, <em>edifice</em>, <em>munificent</em>, and{' '}
                <em>beatific</em>.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 border-t-2 border-dashed border-[#7C3AED] inline-block shrink-0" />
                <span className="text-sm font-black text-purple-950">
                  Dashed Purple Line — Shared Ancient Root (Distant Cousins)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">
                Words from <em>different</em> languages often look completely unrelated today, even
                though they came from the same ancient root thousands of years ago (linguists call
                these <strong>Proto-Indo-European</strong> roots and mark them with{' '}
                <code>*</code>). Dashed purple lines connect these distant cousins across zones:
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
                  connects Latin <em>videre</em> (<em>jurisprudence</em>, <em>vista</em>) ↔ Greek{' '}
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
                To keep the map easy to read, prefix lines only show up when you hover over or click
                a word—highlighting other words that start with the same prefix (like{' '}
                <code>anti-</code>, <code>ante-</code>, <code>com-/con-</code>, <code>in-/im-</code>
                , or <code>inter-</code>).
              </p>
            </div>
          </div>
        </section>

        {/* 3. Discovered vs Full Word List */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="journal-subcard rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Your Words vs. Full Word List</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Solid colorful dots are <strong>words you&apos;ve already learned</strong>. Switch to{' '}
              <strong>Full Lexicon</strong> in the toolbar to also see locked words (shown as pale
              outlined dots with 🔒) so you can preview whole word families before unlocking them.
            </p>
          </div>

          <div className="journal-subcard rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-950">
              <MousePointerClick className="w-4 h-4 text-emerald-700" />
              <span>Why Some Words Stand Alone</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Common endings like <code>-ous</code>, <code>-ity</code>, or <code>-tion</code> don&apos;t
              mean two words are related, so we don&apos;t connect words just because they share an
              ending. Words with a unique root sit spaced out around the edges of their language
              zone.
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
              <strong>Scroll wheel:</strong> Zoom in and out (more labels appear as you zoom in).
            </li>
            <li>
              <strong>Drag background:</strong> Move around across all 4 Origin Zones.
            </li>
            <li>
              <strong>Click any word:</strong> Focus on its connected family and see its Prefix / Root / Suffix breakdown below.
            </li>
            <li>
              <strong>Search + Enter:</strong> Type a word or root and press <code>Enter</code> to jump straight to it.
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

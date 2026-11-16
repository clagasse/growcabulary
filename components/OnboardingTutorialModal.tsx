'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sprout,
  BookOpen,
  Flower2,
  ArrowRight,
  ArrowLeft,
  X,
  HelpCircle,
} from 'lucide-react';

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSeedSprout: () => void;
}

const STEPS = [
  {
    id: 'overview',
    eyebrow: 'Step 1 of 3 • Overview',
    title: 'Welcome to Growcabulary',
    icon: Flower2,
    accentClass: 'bg-emerald-800 text-white',
    description:
      'Growcabulary is a word game system built around expressive, uncommon, yet contemporary English words you can genuinely use in everyday speaking and writing.',
    bullets: [
      'Choose your level across 3 Difficulty Tiers—Pasture (approachable), Meadow (literary), and Conservatory (rare)—and filter by Topic anytime.',
      'Treat your vocabulary like a living garden: discover new words, practice them in real sentences, and review them over time.',
      'Play immediately with automatic browser saving, or sign in anytime to sync your Garden across devices.',
    ],
  },
  {
    id: 'games-garden',
    eyebrow: 'Step 2 of 3 • Games & Garden',
    title: 'How the Modes & Garden Work Together',
    icon: BookOpen,
    accentClass: 'bg-amber-700 text-white',
    description:
      'Each mode builds a different skill, while your Garden tracks long-term retention and word origins:',
    bullets: [
      '🌱 Seed Sprout: Deduce new words from definitions, origins, and masked sentences to plant them in your Garden.',
      '✍️ Field Notes & 🪶 In Your Own Words: Practice choosing discovered words in context and writing original sentences.',
      '🌸 Garden: Self-test with Hide Words, flip 3D Flashcards for spaced repetition, explore Word Network roots, or Compost 🍂 words you already know.',
    ],
  },
  {
    id: 'start-seed-sprout',
    eyebrow: 'Step 3 of 3 • Ready to Begin',
    title: 'Start in Seed Sprout',
    icon: Sprout,
    accentClass: 'bg-emerald-800 text-white',
    description:
      'Because Field Notes, In Your Own Words, and Flashcards draw from words you have already unlocked, Seed Sprout is the best place to begin.',
    bullets: [
      'Jump straight into Pasture for approachable starter words, or pick Meadow / Conservatory from the main menu.',
      'Use Letter Tiles or Reveal Letter hints whenever you need a hand—every completed word gets added to your Garden.',
    ],
  },
];

export const OnboardingTutorialModal: React.FC<OnboardingTutorialModalProps> = ({
  isOpen,
  onClose,
  onStartSeedSprout,
}) => {
  const [stepIdx, setStepIdx] = useState(0);

  if (!isOpen) return null;

  const step = STEPS[stepIdx];
  const Icon = step.icon;
  const isLast = stepIdx === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[110] bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-tutorial-title"
    >
      <div className="journal-card w-full max-w-xl rounded-3xl overflow-hidden animate-scale-in max-h-[92vh] overflow-y-auto">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-700 via-amber-500 to-purple-700" />

        <div className="p-6 sm:p-8">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#EDF5EB] text-emerald-900 border border-[#C6DEC2]">
              {step.eyebrow}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-950 px-2.5 py-1 rounded-full hover:bg-emerald-50 transition-colors"
              aria-label="Close tutorial"
            >
              <span>Skip</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Icon + Title */}
          <div className="flex items-start gap-3.5 mb-4">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${step.accentClass}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="onboarding-tutorial-title"
                className="serif text-2xl sm:text-3xl font-bold text-emerald-950 leading-tight"
              >
                {step.title}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed mb-4">
            {step.description}
          </p>

          <div className="journal-subcard rounded-2xl p-4 space-y-2.5 mb-6">
            {step.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="leading-relaxed font-medium">{b}</p>
              </div>
            ))}
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              {STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStepIdx(idx)}
                  aria-label={`Go to tutorial step ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === stepIdx
                      ? 'w-7 bg-emerald-800'
                      : 'w-2 bg-[#CFD9C8] hover:bg-emerald-500'
                  }`}
                />
              ))}
            </div>

            <Link
              href="/help"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Full Help &amp; Guide</span>
            </Link>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div>
              {stepIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setStepIdx((prev) => prev - 1)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {!isLast ? (
                <button
                  type="button"
                  onClick={() => setStepIdx((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>{stepIdx === 0 ? 'Next: Modes & Garden' : 'Next: Where to Start'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
                  >
                    Explore Main Menu
                  </button>
                  <button
                    type="button"
                    onClick={onStartSeedSprout}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Start Seed Sprout (Pasture)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

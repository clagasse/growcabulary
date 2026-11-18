'use client';

import React, { useMemo } from 'react';
import { GardenEntry, GrowthStage, TopicCategory } from '../../types';
import { GROWTH_STAGE_META, getTopicMeta, getWordTopic } from '../../constants';
import { isWordThirsty, isWordMastered } from '../../utils/srs';
import { Droplets, Star, Sun } from 'lucide-react';

interface LivingConservatoryPlotProps {
  activeEntries: GardenEntry[];
  thirstyCount: number;
  favoriteCount: number;
  onSelectPlant: (entry: GardenEntry) => void;
  onWaterDue: () => void;
  onFilterFavorites: () => void;
}

const TOPIC_BLOOM_COLORS: Record<TopicCategory, { petal: string; center: string }> = {
  emotions: { petal: '#F43F5E', center: '#FDE047' },
  philosophy: { petal: '#6366F1', center: '#FCD34D' },
  biology: { petal: '#10B981', center: '#FEF08A' },
  architecture: { petal: '#F59E0B', center: '#78350F' },
  statecraft: { petal: '#0284C7', center: '#FDE047' },
  literature: { petal: '#A855F7', center: '#FEF08A' },
  general: { petal: '#14B8A6', center: '#FACC15' },
};

const STAGE_ORDER: Record<GrowthStage, number> = {
  perennial: 5,
  bloom: 4,
  bud: 3,
  sprout: 2,
  seed: 1,
};

const PlantSpecimenSvg: React.FC<{
  stage: GrowthStage;
  topic: TopicCategory;
  thirsty: boolean;
  favorite: boolean;
  delayIndex: number;
}> = ({ stage, topic, thirsty, favorite, delayIndex }) => {
  const palette = TOPIC_BLOOM_COLORS[topic] || TOPIC_BLOOM_COLORS.general;
  const leafFill = thirsty ? '#84A98C' : '#2E7D32';
  const leafLight = thirsty ? '#A3B18A' : '#4CAF50';
  const swayDelay = `${(delayIndex % 7) * 0.45}s`;

  return (
    <svg
      viewBox="0 0 64 76"
      className={`w-12 h-14 sm:w-14 sm:h-16 overflow-visible drop-shadow-sm transition-transform duration-300 group-hover:scale-110 ${
        thirsty ? 'opacity-90' : ''
      }`}
      aria-hidden="true"
    >
      {/* Subtle Favorite Sun Halo */}
      {favorite && (
        <circle
          cx="32"
          cy="34"
          r="21"
          fill="rgba(251, 191, 36, 0.16)"
          stroke="rgba(245, 158, 11, 0.45)"
          strokeDasharray="3 3"
          strokeWidth="1.2"
        />
      )}

      {/* Terracotta Soil Pot */}
      <path d="M19 56 L45 56 L41 71 L23 71 Z" fill="#C97B4B" stroke="#9A552D" strokeWidth="1.3" />
      <rect x="16" y="52" width="32" height="5.5" rx="2" fill="#D98B5A" stroke="#9A552D" strokeWidth="1.3" />
      <ellipse cx="32" cy="52" rx="13" ry="2.2" fill="#5D4037" />

      {/* Animated Living Plant */}
      <g
        className="animate-plant-sway"
        style={{ animationDelay: swayDelay }}
        transform={thirsty ? 'rotate(6 32 52)' : undefined}
      >
        {stage === 'seed' && (
          <g>
            <ellipse cx="32" cy="49" rx="5" ry="6.5" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.2" />
            <path d="M32 43 Q34 37 38 38" stroke={leafLight} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {stage === 'sprout' && (
          <g>
            <path d="M32 52 Q32 40 32 34" stroke={leafFill} strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <path d="M32 41 Q21 34 20 27 Q28 27 32 37 Z" fill={leafLight} stroke={leafFill} strokeWidth="1" />
            <path d="M32 39 Q43 32 44 25 Q36 25 32 35 Z" fill={leafFill} />
          </g>
        )}

        {stage === 'bud' && (
          <g>
            <path d="M32 52 Q30 37 32 23" stroke={leafFill} strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M31 44 Q19 38 19 31 Q27 32 31 40 Z" fill={leafLight} />
            <path d="M31 37 Q44 31 43 24 Q35 25 31 33 Z" fill={leafFill} />
            {/* Closed Blossom Bud */}
            <path d="M32 13 C26 18 27 25 32 26 C37 25 38 18 32 13 Z" fill={palette.petal} />
            <path d="M27 23 Q32 28 37 23" stroke={leafFill} strokeWidth="2" fill="none" />
          </g>
        )}

        {stage === 'bloom' && (
          <g>
            <path d="M32 52 Q31 36 32 20" stroke={leafFill} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M31 45 Q18 39 18 31 Q27 32 31 41 Z" fill={leafLight} />
            <path d="M32 40 Q45 34 45 26 Q36 27 32 36 Z" fill={leafFill} />
            {/* 5-Petal Unfurled Bloom */}
            <g transform="translate(32, 18)">
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy="-7.5"
                  rx="4.6"
                  ry="6.8"
                  fill={palette.petal}
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="4.3" fill={palette.center} />
            </g>
          </g>
        )}

        {stage === 'perennial' && (
          <g>
            {/* Bushy Stem Canopy */}
            <path d="M32 52 Q32 34 32 16" stroke={leafFill} strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M32 44 Q22 33 17 24" stroke={leafFill} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M32 42 Q42 32 47 23" stroke={leafFill} strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M32 47 Q17 42 15 35 Q25 35 31 44 Z" fill={leafLight} />
            <path d="M32 46 Q47 41 49 34 Q39 34 33 43 Z" fill={leafFill} />
            {/* Side Blossoms */}
            {[
              { x: 17, y: 22, s: 0.72 },
              { x: 47, y: 21, s: 0.72 },
              { x: 32, y: 14, s: 1.05 },
            ].map((b, idx) => (
              <g key={idx} transform={`translate(${b.x}, ${b.y}) scale(${b.s})`}>
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <ellipse
                    key={deg}
                    cx="0"
                    cy="-7"
                    rx="4.2"
                    ry="6.4"
                    fill={palette.petal}
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle cx="0" cy="0" r="4.2" fill={palette.center} />
              </g>
            ))}
          </g>
        )}
      </g>

      {/* Animated Water Drop Bubble for Thirsty Words */}
      {thirsty && (
        <g className="animate-dew-bob" transform="translate(46, 5)">
          <path
            d="M6 0 C6 0 11 6.5 11 9.5 C11 12.2 8.8 14.2 6 14.2 C3.2 14.2 1 12.2 1 9.5 C1 6.5 6 0 6 0 Z"
            fill="#0284C7"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        </g>
      )}
    </svg>
  );
};

export const LivingConservatoryPlot: React.FC<LivingConservatoryPlotProps> = ({
  activeEntries,
  thirstyCount,
  favoriteCount,
  onSelectPlant,
  onWaterDue,
  onFilterFavorites,
}) => {
  const bloomCount = useMemo(
    () => activeEntries.filter((e) => isWordMastered(e)).length,
    [activeEntries]
  );

  // Pick up to 16 most visually meaningful plants (prioritize thirsty, favorites, highest stages)
  const featuredSpecimens = useMemo(() => {
    return [...activeEntries]
      .sort((a, b) => {
        const aThirsty = isWordThirsty(a) ? 0 : 1;
        const bThirsty = isWordThirsty(b) ? 0 : 1;
        if (aThirsty !== bThirsty) return aThirsty - bThirsty;
        const aFav = a.isFavorite ? 0 : 1;
        const bFav = b.isFavorite ? 0 : 1;
        if (aFav !== bFav) return aFav - bFav;
        const stageDiff =
          (STAGE_ORDER[b.growthStage || 'sprout'] || 0) -
          (STAGE_ORDER[a.growthStage || 'sprout'] || 0);
        if (stageDiff !== 0) return stageDiff;
        return a.word.localeCompare(b.word);
      })
      .slice(0, 16);
  }, [activeEntries]);

  if (activeEntries.length === 0) return null;

  return (
    <div className="rounded-3xl border-2 border-[#C8DEC1] bg-gradient-to-b from-[#E9F5E3] via-[#F7FBF3] to-[#ECE4CF] shadow-sm overflow-hidden">
      {/* Sunlit Glasshouse Arch Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#FFFBEB]/85 via-[#F4FAF0]/90 to-[#EAF5E3]/90 border-b border-[#D5E6CE] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-black text-emerald-950">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Living Glasshouse</span>
          </span>
          <span className="text-[11px] font-bold text-emerald-800">
            {bloomCount} blooming · {activeEntries.length - bloomCount} growing
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {favoriteCount > 0 && (
            <button
              type="button"
              onClick={onFilterFavorites}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold transition-colors"
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
              <span>Favorites ({favoriteCount})</span>
            </button>
          )}
          {thirstyCount > 0 && (
            <button
              type="button"
              onClick={onWaterDue}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold shadow-sm transition-colors"
            >
              <Droplets className="w-3 h-3" />
              <span>Water Due ({thirstyCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Greenhouse Plant Shelf */}
      <div className="px-4 pt-4 pb-3 relative">
        {/* Glasshouse Mullion Lines */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 bottom-6 opacity-35"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 78px, rgba(107, 142, 107, 0.25) 78px, rgba(107, 142, 107, 0.25) 80px)',
          }}
        />

        <div className="relative flex flex-wrap items-end justify-center sm:justify-start gap-x-2 sm:gap-x-3 gap-y-3">
          {featuredSpecimens.map((entry, idx) => {
            const stage = entry.growthStage || 'sprout';
            const stageMeta = GROWTH_STAGE_META[stage];
            const topic = getWordTopic(entry);
            const topicMeta = getTopicMeta(entry);
            const thirsty = isWordThirsty(entry);

            return (
              <button
                key={entry.word}
                type="button"
                onClick={() => onSelectPlant(entry)}
                title={`${entry.word} (${stageMeta.label} · ${topicMeta.label})${
                  thirsty ? ' — Due for review!' : ''
                }`}
                className="group relative flex flex-col items-center focus:outline-none"
              >
                <PlantSpecimenSvg
                  stage={stage}
                  topic={topic}
                  thirsty={thirsty}
                  favorite={Boolean(entry.isFavorite)}
                  delayIndex={idx}
                />
                <span className="mt-0.5 max-w-[74px] truncate px-1.5 py-0.5 rounded-full bg-white/85 group-hover:bg-emerald-800 group-hover:text-white border border-[#D4E2CF] text-[10px] font-bold text-emerald-950 transition-colors shadow-sm">
                  {entry.isFavorite ? '★ ' : ''}
                  {entry.word}
                </span>
              </button>
            );
          })}
        </div>

        {/* Rich Botanical Bench Trim */}
        <div className="mt-2 h-2 rounded-full bg-gradient-to-r from-[#A47551]/60 via-[#8B5E3C]/70 to-[#A47551]/60" />

        {activeEntries.length > featuredSpecimens.length && (
          <p className="text-[10px] font-semibold text-emerald-800/80 text-right mt-1.5">
            Showing {featuredSpecimens.length} featured specimens ({activeEntries.length} total in collection — click any pot to inspect)
          </p>
        )}
      </div>
    </div>
  );
};

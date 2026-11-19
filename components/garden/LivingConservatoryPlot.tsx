'use client';

import React, { useMemo, useState } from 'react';
import { GardenEntry, GrowthStage } from '../../types';
import { GROWTH_STAGE_META } from '../../constants';
import { classifyOriginBranch } from '../../utils/etymology';
import { getBotanicalPlate } from '../../utils/wordBotanicalPlates';
import {
  isWordThirsty,
  getDaysUntilReview,
} from '../../utils/srs';
import { Droplets } from 'lucide-react';

export type OriginSpeciesKey =
  | 'latin'
  | 'greek'
  | 'french'
  | 'italian-iberian'
  | 'english'
  | 'continental-germanic'
  | 'world-origins';

export interface OriginSpeciesMeta {
  key: OriginSpeciesKey;
  originLabel: string;
  shortLabel: string;
  emoji: string;
  dotColor: string;
  badgeClass: string;
}

export const ORIGIN_SPECIES_META: Record<OriginSpeciesKey, OriginSpeciesMeta> = {
  latin: {
    key: 'latin',
    originLabel: 'Latin',
    shortLabel: 'Latin',
    emoji: '🌿',
    dotColor: '#15803D',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  },
  french: {
    key: 'french',
    originLabel: 'French & Old French',
    shortLabel: 'French',
    emoji: '🪻',
    dotColor: '#6D28D9',
    badgeClass: 'bg-violet-50 text-violet-900 border-violet-200',
  },
  'italian-iberian': {
    key: 'italian-iberian',
    originLabel: 'Italian, Spanish & Portuguese',
    shortLabel: 'Italian / Spanish',
    emoji: '🌷',
    dotColor: '#C2410C',
    badgeClass: 'bg-orange-50 text-orange-900 border-orange-200',
  },
  greek: {
    key: 'greek',
    originLabel: 'Greek & Ancient Greek',
    shortLabel: 'Greek',
    emoji: '🌺',
    dotColor: '#BE185D',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-200',
  },
  english: {
    key: 'english',
    originLabel: 'English & Old English',
    shortLabel: 'English',
    emoji: '🌳',
    dotColor: '#4D7C0F',
    badgeClass: 'bg-lime-50 text-lime-900 border-lime-300',
  },
  'continental-germanic': {
    key: 'continental-germanic',
    originLabel: 'German, Dutch & Norse',
    shortLabel: 'Germanic / Norse',
    emoji: '🌲',
    dotColor: '#0F766E',
    badgeClass: 'bg-teal-50 text-teal-900 border-teal-200',
  },
  'world-origins': {
    key: 'world-origins',
    originLabel: 'Arabic, Hebrew, Tamil & Global',
    shortLabel: 'Global',
    emoji: '🌵',
    dotColor: '#B45309',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
  },
};

export const ORIGIN_SPECIES_ORDER: OriginSpeciesKey[] = [
  'latin',
  'french',
  'italian-iberian',
  'greek',
  'english',
  'continental-germanic',
  'world-origins',
];

export function getOriginPlantSpecies(origin: string): OriginSpeciesMeta {
  const branchId = classifyOriginBranch(origin).branchId as OriginSpeciesKey;
  return ORIGIN_SPECIES_META[branchId] || ORIGIN_SPECIES_META.latin;
}

interface HerbariumSpecimenCardProps {
  word: string;
  origin: string;
  stage: GrowthStage;
  thirsty?: boolean;
  favorite?: boolean;
  tiltIndex?: number;
  dense?: boolean;
}

/**
 * Miniature pressed-herbarium archival specimen card displaying a word's real
 * public-domain 19th-century botanical plate (with zero word text so games stay unspoiled).
 * Visual growth progresses from sepia field-sketch (Seed) to gold-framed collector plate (Established).
 */
export const HerbariumSpecimenCard: React.FC<HerbariumSpecimenCardProps> = ({
  word,
  origin,
  stage,
  thirsty = false,
  favorite = false,
  tiltIndex = 0,
  dense = false,
}) => {
  const plate = getBotanicalPlate(word);
  const originMeta = getOriginPlantSpecies(origin);
  const [imgFailed, setImgFailed] = useState(false);

  // Clear size progression as the specimen matures from Seed -> Established
  const sizeClass = dense
    ? stage === 'perennial'
      ? 'w-[78px] h-[104px] sm:w-[88px] sm:h-[116px]'
      : stage === 'bloom'
      ? 'w-[72px] h-[96px] sm:w-[80px] sm:h-[106px]'
      : stage === 'bud'
      ? 'w-[66px] h-[88px] sm:w-[74px] sm:h-[98px]'
      : stage === 'sprout'
      ? 'w-[60px] h-[80px] sm:w-[68px] sm:h-[90px]'
      : 'w-[54px] h-[72px] sm:w-[60px] sm:h-[80px]'
    : stage === 'perennial'
    ? 'w-[98px] h-[130px] sm:w-[108px] sm:h-[144px]'
    : stage === 'bloom'
    ? 'w-[90px] h-[120px] sm:w-[100px] sm:h-[132px]'
    : stage === 'bud'
    ? 'w-[82px] h-[108px] sm:w-[90px] sm:h-[120px]'
    : stage === 'sprout'
    ? 'w-[74px] h-[98px] sm:w-[82px] sm:h-[108px]'
    : 'w-[66px] h-[88px] sm:w-[72px] sm:h-[96px]';

  // Unmistakable archival paper & border styling per growth stage
  // When thirsty, cards shift to a gently faded, sun-dried look while preserving stage shape/border style
  const frameClass = thirsty
    ? stage === 'perennial'
      ? 'bg-[#F6F3EA] border-2 border-[#C8963E]/65 shadow-[0_3px_8px_-4px_rgba(100,116,139,0.18)]'
      : stage === 'bloom'
      ? 'bg-[#F7F4EF] border-2 border-rose-300/70 shadow-[0_3px_8px_-4px_rgba(100,116,139,0.16)]'
      : stage === 'bud'
      ? 'bg-[#F5F6F1] border-2 border-emerald-400/60 shadow-[0_3px_8px_-4px_rgba(100,116,139,0.15)]'
      : stage === 'sprout'
      ? 'bg-[#F6F7F0] border-2 border-lime-400/60 shadow-[0_3px_8px_-4px_rgba(100,116,139,0.14)]'
      : 'bg-[#F6F4EC] border-2 border-dashed border-amber-400/65 shadow-[0_3px_8px_-4px_rgba(100,116,139,0.14)]'
    : stage === 'perennial'
    ? 'bg-gradient-to-b from-[#FFFDF5] to-[#F9EED2] border-2 border-[#C8963E] shadow-[inset_0_0_0_2px_#F6E2B3,0_8px_18px_-4px_rgba(180,120,20,0.34)]'
    : stage === 'bloom'
    ? 'bg-[#FFFBF9] border-2 border-rose-400/80 ring-1 ring-rose-200/70 shadow-[0_6px_14px_-4px_rgba(190,24,93,0.18)]'
    : stage === 'bud'
    ? 'bg-[#F5FBF6] border-2 border-emerald-500/75 shadow-[0_5px_12px_-4px_rgba(21,128,61,0.16)]'
    : stage === 'sprout'
    ? 'bg-[#F9FCF2] border-2 border-lime-400/85 shadow-[0_4px_10px_-4px_rgba(101,163,13,0.15)]'
    : 'bg-[#FBF6E8] border-2 border-dashed border-amber-400/85 shadow-[0_3px_8px_-4px_rgba(180,83,9,0.14)]';

  // Watercolor development filter by growth stage; thirsty specimens appear gently faded
  const imgFilterStyle: React.CSSProperties = thirsty
    ? { filter: 'grayscale(55%) sepia(14%) brightness(1.06) contrast(0.88)', opacity: 0.58 }
    : stage === 'seed'
    ? { filter: 'grayscale(68%) sepia(55%) contrast(0.95)', opacity: 0.78 }
    : stage === 'sprout'
    ? { filter: 'saturate(0.55) sepia(10%)', opacity: 0.88 }
    : stage === 'bud'
    ? { filter: 'saturate(0.92)', opacity: 0.96 }
    : stage === 'bloom'
    ? { filter: 'saturate(1.14)', opacity: 1 }
    : { filter: 'saturate(1.2) contrast(1.04)', opacity: 1 };

  const baseTilt = thirsty
    ? 'rotate-[2.2deg]'
    : tiltIndex % 3 === 0
    ? '-rotate-[1.2deg]'
    : tiltIndex % 3 === 1
    ? 'rotate-[1.1deg]'
    : '-rotate-[0.5deg]';

  const stageMeta = GROWTH_STAGE_META[stage];

  return (
    <div
      className={`relative rounded-xl p-1.5 pb-3 flex items-center justify-center transition-all duration-200 group-hover:shadow-md ${sizeClass} ${frameClass} ${baseTilt}`}
      title={`${stageMeta.label} · ${originMeta.shortLabel} · ${
        thirsty ? 'Needs watering (faded)' : 'Well-hydrated'
      }`}
    >
      {/* Delicate archival linen tape strip at top */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-1.5 rounded-[2px] bg-[#EBDEBE]/90 border border-[#B49E72]/40"
      />

      {/* Real vintage botanical plate */}
      {plate && !imgFailed ? (
        <img
          src={plate.thumbUrl}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          style={imgFilterStyle}
          className="w-full h-full object-contain mix-blend-multiply select-none pointer-events-none transition-opacity duration-200 group-hover:opacity-95"
        />
      ) : (
        <span
          className={`text-xl select-none ${thirsty ? 'opacity-50 grayscale' : 'opacity-75'}`}
        >
          {originMeta.emoji}
        </span>
      )}

      {/* Tiny real-language origin archival dot (bottom-left) */}
      <span
        aria-hidden="true"
        className={`absolute bottom-1 left-1.5 w-2.5 h-2.5 rounded-full border border-white/95 shadow-xs ${
          thirsty ? 'opacity-70' : ''
        }`}
        style={{ backgroundColor: originMeta.dotColor }}
      />

      {/* Crisp growth stage seal (bottom-right) */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0.5 right-1 text-[11px] leading-none select-none drop-shadow-xs ${
          thirsty ? 'opacity-65' : ''
        }`}
      >
        {stageMeta.emoji}
      </span>

      {/* Subtle gold star for favorited words (top-left) */}
      {favorite && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 left-1 text-[9px] text-amber-500 leading-none drop-shadow-xs"
        >
          ★
        </span>
      )}
    </div>
  );
};

const STAGE_SORT_ORDER: Record<GrowthStage, number> = {
  perennial: 5,
  bloom: 4,
  bud: 3,
  sprout: 2,
  seed: 1,
};

type HerbariumSort = 'stage' | 'origin' | 'thirsty';

export interface SelectedStatusCluster {
  stage: GrowthStage | 'all-due';
  entries: GardenEntry[];
  thirstyEntries: GardenEntry[];
  originLabel?: string;
  /** When the user clicked a single mystery specimen card on the wall */
  singleSpecimen?: GardenEntry;
}

interface LivingConservatoryPlotProps {
  activeEntries: GardenEntry[];
  thirstyCount: number;
  onSelectStatusCluster: (cluster: SelectedStatusCluster) => void;
}

export const LivingConservatoryPlot: React.FC<LivingConservatoryPlotProps> = ({
  activeEntries,
  onSelectStatusCluster,
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<OriginSpeciesKey | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<GrowthStage | 'all'>('all');
  const [sortBy, setSortBy] = useState<HerbariumSort>('stage');

  const speciesCounts = useMemo(() => {
    const map = new Map<OriginSpeciesKey, number>();
    activeEntries.forEach((entry) => {
      const sp = getOriginPlantSpecies(entry.origin).key;
      map.set(sp, (map.get(sp) || 0) + 1);
    });
    return map;
  }, [activeEntries]);

  const presentOrigins = useMemo(
    () => ORIGIN_SPECIES_ORDER.filter((key) => (speciesCounts.get(key) || 0) > 0),
    [speciesCounts]
  );

  const visibleEntries = useMemo(() => {
    const filtered = activeEntries.filter((entry) => {
      if (
        selectedOrigin !== 'all' &&
        getOriginPlantSpecies(entry.origin).key !== selectedOrigin
      ) {
        return false;
      }
      if (selectedStage !== 'all' && (entry.growthStage || 'sprout') !== selectedStage) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'thirsty') {
        const aT = isWordThirsty(a) ? 0 : 1;
        const bT = isWordThirsty(b) ? 0 : 1;
        if (aT !== bT) return aT - bT;
        const daysDiff = getDaysUntilReview(a) - getDaysUntilReview(b);
        if (daysDiff !== 0) return daysDiff;
        const stDiff =
          STAGE_SORT_ORDER[b.growthStage || 'sprout'] -
          STAGE_SORT_ORDER[a.growthStage || 'sprout'];
        if (stDiff !== 0) return stDiff;
        return a.word.localeCompare(b.word);
      }
      if (sortBy === 'origin') {
        const spA = ORIGIN_SPECIES_ORDER.indexOf(getOriginPlantSpecies(a.origin).key);
        const spB = ORIGIN_SPECIES_ORDER.indexOf(getOriginPlantSpecies(b.origin).key);
        if (spA !== spB) return spA - spB;
        const stDiff =
          STAGE_SORT_ORDER[b.growthStage || 'sprout'] -
          STAGE_SORT_ORDER[a.growthStage || 'sprout'];
        if (stDiff !== 0) return stDiff;
        return a.word.localeCompare(b.word);
      }
      // Default: 'stage' — Established -> In Bloom -> Budding -> Sprout -> Seed
      const stDiff =
        STAGE_SORT_ORDER[b.growthStage || 'sprout'] -
        STAGE_SORT_ORDER[a.growthStage || 'sprout'];
      if (stDiff !== 0) return stDiff;
      const aT = isWordThirsty(a) ? 0 : 1;
      const bT = isWordThirsty(b) ? 0 : 1;
      if (aT !== bT) return aT - bT;
      const spA = ORIGIN_SPECIES_ORDER.indexOf(getOriginPlantSpecies(a.origin).key);
      const spB = ORIGIN_SPECIES_ORDER.indexOf(getOriginPlantSpecies(b.origin).key);
      if (spA !== spB) return spA - spB;
      return a.word.localeCompare(b.word);
    });
  }, [activeEntries, selectedOrigin, selectedStage, sortBy]);

  const visibleThirstyEntries = useMemo(
    () => visibleEntries.filter((e) => isWordThirsty(e)),
    [visibleEntries]
  );

  if (activeEntries.length === 0) {
    return (
      <div className="py-16 text-center bg-[#FFFDF8] rounded-3xl border border-[#DCE5D5] p-8 space-y-5">
        <div className="flex items-end justify-center gap-3">
          <HerbariumSpecimenCard word="veto" origin="Latin" stage="bloom" tiltIndex={0} />
          <HerbariumSpecimenCard word="soporific" origin="Greek" stage="perennial" tiltIndex={1} />
          <HerbariumSpecimenCard word="nuance" origin="French" stage="bud" tiltIndex={2} />
        </div>
        <div>
          <p className="serif font-bold text-2xl text-emerald-950">
            Your Pressed Herbarium is Ready!
          </p>
          <p className="text-xs sm:text-sm text-emerald-800 mt-1.5 max-w-md mx-auto leading-relaxed">
            Every word you discover in <strong>Seed Sprout</strong> takes its place here as a unique
            vintage botanical specimen—developing from a sepia field sketch into a gold-framed
            established plate.
          </p>
        </div>
      </div>
    );
  }

  const activeOriginLabel =
    selectedOrigin === 'all' ? undefined : ORIGIN_SPECIES_META[selectedOrigin].shortLabel;

  const openWaterModalForSpecimen = (entry: GardenEntry) => {
    const stage = entry.growthStage || 'sprout';
    const stageEntries = visibleEntries.filter((e) => (e.growthStage || 'sprout') === stage);
    const stageThirsty = stageEntries.filter((e) => isWordThirsty(e));
    onSelectStatusCluster({
      stage,
      entries: stageEntries,
      thirstyEntries: stageThirsty,
      originLabel: activeOriginLabel,
      singleSpecimen: entry,
    });
  };

  const dense = visibleEntries.length > 24;

  return (
    <div className="rounded-3xl border-2 border-[#C8DEC1] bg-gradient-to-b from-[#EAF6E4] via-[#F7FBF3] to-[#EFE7D2] shadow-sm overflow-hidden">
      {/* Controls: Origin Filter Chips + Sort, Stage & Water Due */}
      <div className="px-4 sm:px-5 py-3 bg-[#FFFDF8]/90 border-b border-[#DCE5D5] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {presentOrigins.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setSelectedOrigin('all')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                  selectedOrigin === 'all'
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                    : 'bg-white text-emerald-900 border-[#DCE5D5] hover:bg-[#EDF5EB]'
                }`}
              >
                All Origins ({activeEntries.length})
              </button>
              {presentOrigins.map((key) => {
                const sp = ORIGIN_SPECIES_META[key];
                const count = speciesCounts.get(key) || 0;
                const isActive = selectedOrigin === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedOrigin((prev) => (prev === key ? 'all' : key))}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                      isActive
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-white text-emerald-900 border-[#DCE5D5] hover:bg-[#EDF5EB]'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 border border-white/70"
                      style={{ backgroundColor: sp.dotColor }}
                    />
                    <span>
                      {sp.shortLabel} ({count})
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as HerbariumSort)}
            aria-label="Sort herbarium specimens"
            className="px-2.5 py-1.5 rounded-xl border border-[#DCE5D5] text-xs font-bold text-emerald-900 bg-[#FAF7EE] cursor-pointer"
          >
            <option value="stage">Sort: By Growth Stage</option>
            <option value="origin">Sort: By Origin</option>
            <option value="thirsty">Sort: Needs Water First</option>
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as GrowthStage | 'all')}
            aria-label="Filter herbarium by growth stage"
            className="px-2.5 py-1.5 rounded-xl border border-[#DCE5D5] text-xs font-bold text-emerald-900 bg-[#FAF7EE] cursor-pointer"
          >
            <option value="all">All Stages</option>
            {(['perennial', 'bloom', 'bud', 'sprout', 'seed'] as GrowthStage[]).map((stageKey) => {
              const meta = GROWTH_STAGE_META[stageKey];
              return (
                <option key={stageKey} value={stageKey}>
                  {meta.emoji} {meta.label}
                </option>
              );
            })}
          </select>

          {visibleThirstyEntries.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                onSelectStatusCluster({
                  stage: selectedStage === 'all' ? 'all-due' : selectedStage,
                  entries: visibleThirstyEntries,
                  thirstyEntries: visibleThirstyEntries,
                  originLabel: activeOriginLabel,
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold shadow-sm transition-colors"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Water Due ({visibleThirstyEntries.length})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                onSelectStatusCluster({
                  stage: selectedStage === 'all' ? 'all-due' : selectedStage,
                  entries: visibleEntries,
                  thirstyEntries: [],
                  originLabel: activeOriginLabel,
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border border-[#C6DEC2] text-[11px] font-bold transition-colors"
            >
              <span>🌿 Practice Wall</span>
            </button>
          )}
        </div>
      </div>

      {/* Unified Single-Grid Pressed Herbarium Wall */}
      <div className="p-4 sm:p-6 min-h-[260px]">
        {visibleEntries.length === 0 ? (
          <div className="py-12 text-center">
            <p className="serif font-bold text-lg text-emerald-950">
              No specimens match those filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedOrigin('all');
                setSelectedStage('all');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
            >
              Show All Specimens
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-end justify-center gap-y-2.5 gap-x-0 px-2">
            {visibleEntries.map((entry, idx) => {
              const stage = entry.growthStage || 'sprout';
              const thirsty = isWordThirsty(entry);
              return (
                <button
                  key={entry.word}
                  type="button"
                  onClick={() => openWaterModalForSpecimen(entry)}
                  className="group relative -mx-1.5 sm:-mx-2 hover:z-20 focus:z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl transition-transform duration-200 hover:-translate-y-2 hover:scale-105"
                  aria-label={`${GROWTH_STAGE_META[stage].label} specimen${
                    thirsty ? ', needs watering' : ''
                  }`}
                >
                  <HerbariumSpecimenCard
                    word={entry.word}
                    origin={entry.origin}
                    stage={stage}
                    thirsty={thirsty}
                    favorite={Boolean(entry.isFavorite)}
                    tiltIndex={idx}
                    dense={dense}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Compact Visual Stage Border Key */}
        <div className="mt-6 pt-3 border-t border-[#D5E6CE]/80 flex flex-wrap items-center justify-center gap-2 text-[10.5px] font-bold text-emerald-900">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FBF6E8] border-2 border-dashed border-amber-400/85">
            🌰 Seed
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F9FCF2] border-2 border-lime-400/85">
            🌱 Sprout
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5FBF6] border-2 border-emerald-500/75">
            🪴 Budding
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFBF9] border-2 border-rose-400/80">
            🌸 In Bloom
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-b from-[#FFFDF5] to-[#F9EED2] border-2 border-[#C8963E] text-amber-950">
            🌳 Established
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F6F4EC] border border-stone-300/80 text-stone-600">
            Faded = Needs Water
          </span>
        </div>
      </div>
    </div>
  );
};

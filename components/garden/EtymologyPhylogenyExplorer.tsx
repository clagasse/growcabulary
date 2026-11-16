'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GardenEntry, TopicCategory, Word } from '../../types';
import {
  GROWTH_STAGE_META,
  ORIGIN_EMOJI_MAP,
  TOPIC_CATEGORIES,
  getDifficultyMeta,
  getTopicMeta,
  getWordTopic,
} from '../../constants';
import {
  AncestralLineageInfo,
  ExtractedMorpheme,
  PhylogeneticClade,
  PhylogeneticFamilyTrunk,
  buildPhylogeneticTree,
  classifyOriginBranch,
  extractTransmissionPath,
  extractWordMorphemes,
  findConnectedSisterClades,
  findWordsSharingMorpheme,
  resolveAncestralRootOrigin,
} from '../../utils/etymology';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Droplets,
  Focus,
  Layers,
  Link2,
  Lock,
  Network,
  RotateCcw,
  Search,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface EtymologyPhylogenyExplorerProps {
  learnedEntries: GardenEntry[];
  allLexiconWords: Word[];
  onSelectWordDossier: (word: GardenEntry) => void;
  onPracticeOriginFlashcards?: (originFilterKey: string) => void;
}

type ViewMode = 'network' | 'ego';
type SidebarTab = 'words' | 'clusters';
type TrunkFilter = 'all' | 'latin-romance' | 'hellenic' | 'germanic' | 'global';

type ConstellationSelection =
  | { type: 'word'; wordKey: string }
  | { type: 'root'; rootId: string }
  | { type: 'origin'; stageName: string };

interface WordRecord {
  word: Word;
  key: string;
  lineage: AncestralLineageInfo;
  morphemes: ExtractedMorpheme[];
  transmission: { stage: string; emoji: string }[];
  originMeta: ReturnType<typeof classifyOriginBranch>;
  trunkId: TrunkFilter;
  trunkLabel: string;
  primaryClade: PhylogeneticClade | null;
  primaryRootId: string;
  cousinCount: number;
  isLearned: boolean;
}

interface ConnectedCousinHit {
  word: Word;
  lineage: AncestralLineageInfo;
  relation: 'shared-root' | 'cognate-bridge' | 'same-origin';
  connectionLabel: string;
  sharedMorphemeId?: string;
  isLearned: boolean;
}

const TRUNK_FILTERS: { id: TrunkFilter; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Origins', emoji: '🌿' },
  { id: 'latin-romance', label: 'Latin & Romance', emoji: '🏛️' },
  { id: 'hellenic', label: 'Greek', emoji: '🌺' },
  { id: 'germanic', label: 'Germanic & Norse', emoji: '🌲' },
  { id: 'global', label: 'World & Eponyms', emoji: '🌍' },
];

const TRUNK_NODE_STYLE: Record<
  Exclude<TrunkFilter, 'all'>,
  { label: string; shortLabel: string; emoji: string; fill: string; stroke: string; text: string }
> = {
  'latin-romance': {
    label: 'Classical Latin & Romance',
    shortLabel: 'Latin',
    emoji: '🏛️',
    fill: '#ECFDF5',
    stroke: '#15803D',
    text: '#14532D',
  },
  hellenic: {
    label: 'Hellenic Greek',
    shortLabel: 'Greek',
    emoji: '🌺',
    fill: '#FDF2F8',
    stroke: '#BE185D',
    text: '#831843',
  },
  germanic: {
    label: 'Germanic & Old English',
    shortLabel: 'Germanic',
    emoji: '🌲',
    fill: '#F0FDF4',
    stroke: '#3F6212',
    text: '#1A2E05',
  },
  global: {
    label: 'World Roots & Eponyms',
    shortLabel: 'World / Eponym',
    emoji: '🌍',
    fill: '#FFFBEB',
    stroke: '#B45309',
    text: '#78350F',
  },
};

function truncateLabel(text: string, maxChars: number): string {
  if (!text) return '';
  return text.length > maxChars ? `${text.slice(0, maxChars - 1).trimEnd()}…` : text;
}

function getColumnSlotYs(count: number, minY: number, maxY: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [(minY + maxY) / 2];
  const step = (maxY - minY) / (count - 1);
  return Array.from({ length: count }, (_, idx) => Math.round(minY + idx * step));
}

function estimateWordPillWidth(wordText: string, hasVia: boolean): number {
  const charWidth = 8.4;
  const base = Math.round(wordText.length * charWidth + 46);
  return Math.max(hasVia ? 124 : 108, Math.min(base, 224));
}

interface ConstellationOriginNode {
  id: string;
  trunkId: Exclude<TrunkFilter, 'all'>;
  label: string;
  emoji: string;
  x: number;
  y: number;
  wordCount: number;
}

interface ConstellationViaNode {
  id: string;
  stageName: string;
  parentTrunkId: Exclude<TrunkFilter, 'all'>;
  emoji: string;
  x: number;
  y: number;
  wordCount: number;
}

interface ConstellationRootNode {
  id: string;
  morphemeId: string;
  displayRoot: string;
  meaning: string;
  origin: string;
  trunkId: Exclude<TrunkFilter, 'all'>;
  cognateIds: string[];
  x: number;
  y: number;
  wordCount: number;
}

interface ConstellationWordNode {
  record: WordRecord;
  x: number;
  y: number;
  width: number;
  height: number;
  hubNodeId: string | null;
  originNodeId: string;
  viaNodeIds: string[];
}

interface ConstellationEdge {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  ctrlX: number;
  ctrlY: number;
  kind: 'origin-via' | 'origin-root' | 'root-word' | 'via-word' | 'origin-word' | 'cognate';
  relatedKeys: string[];
}

interface ConstellationGraph {
  originNodes: ConstellationOriginNode[];
  viaNodes: ConstellationViaNode[];
  rootNodes: ConstellationRootNode[];
  wordNodes: ConstellationWordNode[];
  edges: ConstellationEdge[];
  totalFilteredCount: number;
  plottedCount: number;
}

function curveControlPoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx: number,
  cy: number,
  pull: number = 0.25
): { ctrlX: number; ctrlY: number } {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return {
    ctrlX: mx + (cx - mx) * pull,
    ctrlY: my + (cy - my) * pull,
  };
}

function buildConstellationGraph(
  filteredRecords: WordRecord[],
  focusedWordKey: string | null
): ConstellationGraph {
  const MAX_PLOTTED = 64;
  const CX = 500;
  const CY = 330;

  // Prioritize focused word + its cousins + largest connected root clusters first
  const focusedRecord = focusedWordKey
    ? filteredRecords.find((r) => r.key === focusedWordKey) || null
    : null;
  const focusedMorphIds = new Set(focusedRecord ? focusedRecord.morphemes.map((m) => m.id) : []);
  const focusedCognateIds = new Set(
    focusedRecord ? focusedRecord.morphemes.flatMap((m) => m.cognateIds || []) : []
  );

  const prioritized = [...filteredRecords].sort((a, b) => {
    const aIsFocused = a.key === focusedWordKey ? 1 : 0;
    const bIsFocused = b.key === focusedWordKey ? 1 : 0;
    if (bIsFocused !== aIsFocused) return bIsFocused - aIsFocused;

    const aIsFocusedCousin =
      a.morphemes.some((m) => focusedMorphIds.has(m.id) || focusedCognateIds.has(m.id)) ? 1 : 0;
    const bIsFocusedCousin =
      b.morphemes.some((m) => focusedMorphIds.has(m.id) || focusedCognateIds.has(m.id)) ? 1 : 0;
    if (bIsFocusedCousin !== aIsFocusedCousin) return bIsFocusedCousin - aIsFocusedCousin;

    const aClusterSize = a.primaryClade?.words.length ?? 1;
    const bClusterSize = b.primaryClade?.words.length ?? 1;
    if (bClusterSize !== aClusterSize) return bClusterSize - aClusterSize;
    if (b.cousinCount !== a.cousinCount) return b.cousinCount - a.cousinCount;
    return a.word.word.localeCompare(b.word.word);
  });

  const plotted = prioritized.slice(0, MAX_PLOTTED);

  // Group plotted words by ancestral trunk
  const trunkOrder: Exclude<TrunkFilter, 'all'>[] = [
    'latin-romance',
    'hellenic',
    'germanic',
    'global',
  ];
  const byTrunk = new Map<Exclude<TrunkFilter, 'all'>, WordRecord[]>();
  for (const tid of trunkOrder) byTrunk.set(tid, []);
  for (const rec of plotted) {
    const tid = rec.trunkId === 'all' ? 'global' : rec.trunkId;
    byTrunk.get(tid)?.push(rec);
  }
  const activeTrunks = trunkOrder.filter((t) => (byTrunk.get(t)?.length ?? 0) > 0);
  if (activeTrunks.length === 0) {
    return {
      originNodes: [],
      viaNodes: [],
      rootNodes: [],
      wordNodes: [],
      edges: [],
      totalFilteredCount: filteredRecords.length,
      plottedCount: 0,
    };
  }

  // Allocate sector angles proportional to word count (min 0.7 rad per active trunk)
  const totalPlotted = plotted.length;
  const minSector = Math.min(0.8, (2 * Math.PI) / Math.max(activeTrunks.length, 1) / 1.5);
  const remainingAngle = 2 * Math.PI - minSector * activeTrunks.length;

  const sectorBounds = new Map<
    Exclude<TrunkFilter, 'all'>,
    { start: number; end: number; mid: number }
  >();
  let cursorAngle = -Math.PI / 2;
  for (const tid of activeTrunks) {
    const count = byTrunk.get(tid)!.length;
    const span = minSector + (totalPlotted > 0 ? (count / totalPlotted) * remainingAngle : 0);
    sectorBounds.set(tid, {
      start: cursorAngle,
      end: cursorAngle + span,
      mid: cursorAngle + span / 2,
    });
    cursorAngle += span;
  }

  const originNodes: ConstellationOriginNode[] = [];
  const viaNodes: ConstellationViaNode[] = [];
  const rootNodes: ConstellationRootNode[] = [];
  const wordNodes: ConstellationWordNode[] = [];
  const edges: ConstellationEdge[] = [];

  const originNodeMap = new Map<Exclude<TrunkFilter, 'all'>, ConstellationOriginNode>();
  const rootHubMap = new Map<string, ConstellationRootNode>();
  const viaNodeMap = new Map<string, ConstellationViaNode>();

  const singleTrunk = activeTrunks.length === 1;

  for (const tid of activeTrunks) {
    const wordsInTrunk = byTrunk.get(tid)!;
    const sector = sectorBounds.get(tid)!;
    const meta = TRUNK_NODE_STYLE[tid];
    const ox = singleTrunk ? CX : Math.round(CX + 108 * Math.cos(sector.mid));
    const oy = singleTrunk ? CY : Math.round(CY + 72 * Math.sin(sector.mid));

    const oNode: ConstellationOriginNode = {
      id: `origin::${tid}`,
      trunkId: tid,
      label: meta.shortLabel,
      emoji: meta.emoji,
      x: ox,
      y: oy,
      wordCount: wordsInTrunk.length,
    };
    originNodes.push(oNode);
    originNodeMap.set(tid, oNode);

    // Count root clusters and intermediary `via` languages in this trunk
    const rootBuckets = new Map<string, WordRecord[]>();
    const viaBuckets = new Map<string, WordRecord[]>();

    for (const rec of wordsInTrunk) {
      const rId = rec.primaryRootId;
      if (!rootBuckets.has(rId)) rootBuckets.set(rId, []);
      rootBuckets.get(rId)!.push(rec);

      const primaryVia = rec.lineage.viaOrigins[rec.lineage.viaOrigins.length - 1];
      if (primaryVia) {
        if (!viaBuckets.has(primaryVia)) viaBuckets.set(primaryVia, []);
        viaBuckets.get(primaryVia)!.push(rec);
      }
    }

    // Shared Root Hubs inside this trunk (2+ plotted words sharing a substantive/canonical root,
    // or all clusters if trunk has <= 10 words so hubs are informative)
    const multiRoots = Array.from(rootBuckets.entries()).filter(
      ([rId, list]) =>
        list.length >= 2 ||
        (wordsInTrunk.length <= 8 && list[0]?.morphemes[0]?.isCanonical && !rId.startsWith('lex:'))
    );
    multiRoots.sort((a, b) => b[1].length - a[1].length);
    const selectedRoots = multiRoots.slice(0, 9);

    const viaEntries = Array.from(viaBuckets.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5);

    const middleItemsCount = selectedRoots.length + viaEntries.length;
    const pad = Math.min(0.14, (sector.end - sector.start) * 0.1);
    const usableStart = sector.start + pad;
    const usableSpan = Math.max(0.25, sector.end - sector.start - pad * 2);

    // Position intermediary `via` nodes in inner-mid band
    viaEntries.forEach(([stageName, list], idx) => {
      const frac = viaEntries.length === 1 ? 0.5 : (idx + 0.5) / viaEntries.length;
      const angle = usableStart + frac * usableSpan;
      const vx = Math.round(CX + 188 * Math.cos(angle));
      const vy = Math.round(CY + 124 * Math.sin(angle));
      const vId = `via::${tid}::${stageName}`;
      const vNode: ConstellationViaNode = {
        id: vId,
        stageName,
        parentTrunkId: tid,
        emoji: ORIGIN_EMOJI_MAP[stageName] || '🌿',
        x: vx,
        y: vy,
        wordCount: list.length,
      };
      viaNodes.push(vNode);
      viaNodeMap.set(`${tid}::${stageName}`, vNode);

      const { ctrlX, ctrlY } = curveControlPoint(ox, oy, vx, vy, CX, CY, 0.25);
      edges.push({
        id: `e-${oNode.id}-${vId}`,
        fromX: ox,
        fromY: oy,
        toX: vx,
        toY: vy,
        ctrlX,
        ctrlY,
        kind: 'origin-via',
        relatedKeys: list.map((r) => r.key),
      });
    });

    // Assign angular sub-slots to root hubs and sort words by their root hub angle
    const rootAngleMap = new Map<string, number>();
    selectedRoots.forEach(([rId, list], idx) => {
      const frac =
        selectedRoots.length === 1
          ? 0.5
          : (idx + 0.5) / Math.max(selectedRoots.length, middleItemsCount > 0 ? selectedRoots.length : 1);
      const angle = usableStart + frac * usableSpan;
      rootAngleMap.set(rId, angle);

      const rxPos = Math.round(CX + 236 * Math.cos(angle));
      const ryPos = Math.round(CY + 154 * Math.sin(angle));
      const sampleMorph =
        list[0]?.morphemes.find((m) => m.id === rId) || list[0]?.morphemes[0];
      const hubId = `hub::${tid}::${rId}`;
      const hub: ConstellationRootNode = {
        id: hubId,
        morphemeId: rId,
        displayRoot: sampleMorph?.displayRoot || rId.replace(/^root:/, ''),
        meaning: sampleMorph?.meaning || '',
        origin: sampleMorph?.origin || meta.shortLabel,
        trunkId: tid,
        cognateIds: list.flatMap((r) => r.morphemes.flatMap((m) => m.cognateIds || [])),
        x: rxPos,
        y: ryPos,
        wordCount: list.length,
      };
      rootNodes.push(hub);
      rootHubMap.set(`${tid}::${rId}`, hub);

      const { ctrlX, ctrlY } = curveControlPoint(ox, oy, rxPos, ryPos, CX, CY, 0.2);
      edges.push({
        id: `e-${oNode.id}-${hubId}`,
        fromX: ox,
        fromY: oy,
        toX: rxPos,
        toY: ryPos,
        ctrlX,
        ctrlY,
        kind: 'origin-root',
        relatedKeys: list.map((r) => r.key),
      });
    });

    // Order outer word pills around the trunk sector grouped cleanly by their root hub / via language
    const orderedWords = [...wordsInTrunk].sort((a, b) => {
      const aAngle = rootAngleMap.get(a.primaryRootId);
      const bAngle = rootAngleMap.get(b.primaryRootId);
      if (aAngle !== undefined && bAngle !== undefined && aAngle !== bAngle) {
        return aAngle - bAngle;
      }
      if (aAngle !== undefined && bAngle === undefined) return -1;
      if (aAngle === undefined && bAngle !== undefined) return 1;
      const aVia = a.lineage.viaOrigins[a.lineage.viaOrigins.length - 1] || '';
      const bVia = b.lineage.viaOrigins[b.lineage.viaOrigins.length - 1] || '';
      if (aVia !== bVia) return aVia.localeCompare(bVia);
      return a.word.word.localeCompare(b.word.word);
    });

    orderedWords.forEach((rec, idx) => {
      const frac =
        orderedWords.length === 1 ? 0.5 : (idx + 0.5) / orderedWords.length;
      const angle = usableStart + frac * usableSpan;
      // Stagger alternating words across inner/outer elliptical orbital tracks to prevent label collisions
      const stagger = orderedWords.length > 10 && idx % 2 === 1;
      const radX = stagger ? 426 : 362;
      const radY = stagger ? 276 : 234;

      const hasVia = Boolean(rec.lineage.shortViaBadge);
      const pillW = estimateWordPillWidth(rec.word.word, hasVia);
      const pillH = hasVia ? 38 : 30;
      const halfW = pillW / 2;

      const rawX = CX + radX * Math.cos(angle);
      const rawY = CY + radY * Math.sin(angle);
      const wx = Math.round(Math.max(halfW + 10, Math.min(1000 - halfW - 10, rawX)));
      const wy = Math.round(Math.max(pillH / 2 + 12, Math.min(660 - pillH / 2 - 12, rawY)));

      const hub = rootHubMap.get(`${tid}::${rec.primaryRootId}`) || null;
      const viaNodesForWord = rec.lineage.viaOrigins
        .map((v) => viaNodeMap.get(`${tid}::${v}`))
        .filter((v): v is ConstellationViaNode => Boolean(v));

      wordNodes.push({
        record: rec,
        x: wx,
        y: wy,
        width: pillW,
        height: pillH,
        hubNodeId: hub?.id ?? null,
        originNodeId: oNode.id,
        viaNodeIds: viaNodesForWord.map((v) => v.id),
      });

      if (hub) {
        const { ctrlX, ctrlY } = curveControlPoint(hub.x, hub.y, wx, wy, CX, CY, 0.15);
        edges.push({
          id: `e-${hub.id}-${rec.key}`,
          fromX: hub.x,
          fromY: hub.y,
          toX: wx,
          toY: wy,
          ctrlX,
          ctrlY,
          kind: 'root-word',
          relatedKeys: [rec.key],
        });
      } else if (viaNodesForWord.length > 0) {
        const primaryViaNode = viaNodesForWord[viaNodesForWord.length - 1];
        const { ctrlX, ctrlY } = curveControlPoint(
          primaryViaNode.x,
          primaryViaNode.y,
          wx,
          wy,
          CX,
          CY,
          0.18
        );
        edges.push({
          id: `e-${primaryViaNode.id}-${rec.key}`,
          fromX: primaryViaNode.x,
          fromY: primaryViaNode.y,
          toX: wx,
          toY: wy,
          ctrlX,
          ctrlY,
          kind: 'via-word',
          relatedKeys: [rec.key],
        });
      } else {
        const { ctrlX, ctrlY } = curveControlPoint(ox, oy, wx, wy, CX, CY, 0.2);
        edges.push({
          id: `e-${oNode.id}-${rec.key}`,
          fromX: ox,
          fromY: oy,
          toX: wx,
          toY: wy,
          ctrlX,
          ctrlY,
          kind: 'origin-word',
          relatedKeys: [rec.key],
        });
      }

      // Secondary dotted link to intermediary `via` language whenever anchored at a Root Hub
      if (hub && viaNodesForWord.length > 0) {
        const vNode = viaNodesForWord[viaNodesForWord.length - 1];
        const { ctrlX, ctrlY } = curveControlPoint(vNode.x, vNode.y, wx, wy, CX, CY, 0.28);
        edges.push({
          id: `e-via-${vNode.id}-${rec.key}`,
          fromX: vNode.x,
          fromY: vNode.y,
          toX: wx,
          toY: wy,
          ctrlX,
          ctrlY,
          kind: 'via-word',
          relatedKeys: [rec.key],
        });
      }
    });
  }

  // Cognate Bridges between Root Hubs across different trunks/clades
  const hubByMorphemeId = new Map<string, ConstellationRootNode[]>();
  for (const h of rootNodes) {
    if (!hubByMorphemeId.has(h.morphemeId)) hubByMorphemeId.set(h.morphemeId, []);
    hubByMorphemeId.get(h.morphemeId)!.push(h);
  }
  const seenBridgePairs = new Set<string>();
  for (const hub of rootNodes) {
    for (const cogId of hub.cognateIds) {
      const targets = hubByMorphemeId.get(cogId) || [];
      for (const t of targets) {
        if (t.id === hub.id) continue;
        const pairKey = [hub.id, t.id].sort().join('<->');
        if (seenBridgePairs.has(pairKey)) continue;
        seenBridgePairs.add(pairKey);
        const { ctrlX, ctrlY } = curveControlPoint(hub.x, hub.y, t.x, t.y, CX, CY, 0.45);
        edges.push({
          id: `e-cog-${pairKey}`,
          fromX: hub.x,
          fromY: hub.y,
          toX: t.x,
          toY: t.y,
          ctrlX,
          ctrlY,
          kind: 'cognate',
          relatedKeys: plotted
            .filter((r) => r.primaryRootId === hub.morphemeId || r.primaryRootId === t.morphemeId)
            .map((r) => r.key),
        });
      }
    }
  }

  return {
    originNodes,
    viaNodes,
    rootNodes,
    wordNodes,
    edges,
    totalFilteredCount: filteredRecords.length,
    plottedCount: plotted.length,
  };
}

export const EtymologyPhylogenyExplorer: React.FC<EtymologyPhylogenyExplorerProps> = ({
  learnedEntries,
  allLexiconWords,
  onSelectWordDossier,
  onPracticeOriginFlashcards,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('words');
  const [trunkFilter, setTrunkFilter] = useState<TrunkFilter>('all');
  const [topicFilter, setTopicFilter] = useState<TopicCategory | 'all'>('all');
  const [onlyConnected, setOnlyConnected] = useState(false);
  const [showUnlearnedCousins, setShowUnlearnedCousins] = useState(false);
  const [previewFullLexicon, setPreviewFullLexicon] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWordKey, setSelectedWordKey] = useState<string | null>(null);
  const [constellationSelection, setConstellationSelection] =
    useState<ConstellationSelection | null>(null);
  const [highlightedMorphemeId, setHighlightedMorphemeId] = useState<string | null>(null);

  // Pan & Zoom state for interactive SVG canvas
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef<{
    clientX: number;
    clientY: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);

  const learnedMap = useMemo(() => {
    const map = new Map<string, GardenEntry>();
    learnedEntries.forEach((entry) => map.set(entry.word.toLowerCase(), entry));
    return map;
  }, [learnedEntries]);

  const activeWords: Word[] = useMemo(() => {
    if (learnedEntries.length === 0 && previewFullLexicon) {
      return allLexiconWords;
    }
    return learnedEntries;
  }, [learnedEntries, allLexiconWords, previewFullLexicon]);

  const cousinPool: Word[] = useMemo(() => {
    if (showUnlearnedCousins || (learnedEntries.length === 0 && previewFullLexicon)) {
      return allLexiconWords;
    }
    return learnedEntries;
  }, [showUnlearnedCousins, learnedEntries, previewFullLexicon, allLexiconWords]);

  const rawTrunks = useMemo(() => buildPhylogeneticTree(activeWords), [activeWords]);
  const cousinTrunks = useMemo(() => buildPhylogeneticTree(cousinPool), [cousinPool]);

  // Build indexed WordRecords for instant search, clustering, and graph plotting
  const wordRecords: WordRecord[] = useMemo(() => {
    const wordCladeIndex = new Map<
      string,
      {
        trunkId: Exclude<TrunkFilter, 'all'>;
        trunkLabel: string;
        clade: PhylogeneticClade;
      }
    >();
    for (const trunk of rawTrunks) {
      const tid = (
        ['latin-romance', 'hellenic', 'germanic', 'global'].includes(trunk.id)
          ? trunk.id
          : 'global'
      ) as Exclude<TrunkFilter, 'all'>;
      for (const branch of trunk.origins) {
        for (const clade of branch.clades) {
          for (const w of clade.words) {
            wordCladeIndex.set(w.word.toLowerCase(), {
              trunkId: tid,
              trunkLabel: trunk.label,
              clade,
            });
          }
        }
      }
    }

    // Count cousins in cousinPool per morpheme ID
    const morphPoolCount = new Map<string, number>();
    for (const cw of cousinPool) {
      for (const m of extractWordMorphemes(cw)) {
        morphPoolCount.set(m.id, (morphPoolCount.get(m.id) ?? 0) + 1);
      }
    }

    return activeWords.map((w) => {
      const key = w.word.toLowerCase();
      const indexed = wordCladeIndex.get(key);
      const lineage = resolveAncestralRootOrigin(w);
      const morphemes = extractWordMorphemes(w);
      const transmission = extractTransmissionPath(w);
      const originMeta = classifyOriginBranch(w.origin);
      const primaryRootId =
        indexed?.clade.id.split('::')[1] || morphemes[0]?.id || `lex:${key}`;

      const cognatePoolCount = morphemes
        .flatMap((m) => m.cognateIds || [])
        .reduce((sum, cogId) => sum + (morphPoolCount.get(cogId) ?? 0), 0);
      const directPoolCount = Math.max(0, (morphPoolCount.get(primaryRootId) ?? 1) - 1);
      const secondaryPoolCount = morphemes
        .slice(1)
        .filter((m) => !m.isPrefix)
        .reduce((sum, m) => sum + Math.max(0, (morphPoolCount.get(m.id) ?? 1) - 1), 0);

      return {
        word: w,
        key,
        lineage,
        morphemes,
        transmission,
        originMeta,
        trunkId: indexed?.trunkId || 'global',
        trunkLabel: indexed?.trunkLabel || 'Global & Eponyms',
        primaryClade: indexed?.clade || null,
        primaryRootId,
        cousinCount: directPoolCount + secondaryPoolCount + cognatePoolCount,
        isLearned: learnedMap.has(key),
      };
    });
  }, [activeWords, rawTrunks, cousinPool, learnedMap]);

  const recordByKey = useMemo(() => {
    const map = new Map<string, WordRecord>();
    wordRecords.forEach((r) => map.set(r.key, r));
    return map;
  }, [wordRecords]);

  // Apply trunk filter, cousin-only toggle, and text search
  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return wordRecords.filter((rec) => {
      if (trunkFilter !== 'all' && rec.trunkId !== trunkFilter) return false;
      if (topicFilter !== 'all' && getWordTopic(rec.word) !== topicFilter) return false;
      if (onlyConnected && rec.cousinCount === 0) return false;
      if (!q) return true;
      return (
        rec.key.includes(q) ||
        rec.word.origin.toLowerCase().includes(q) ||
        rec.lineage.displayBadge.toLowerCase().includes(q) ||
        rec.lineage.rootOrigin.toLowerCase().includes(q) ||
        rec.word.definition.toLowerCase().includes(q) ||
        rec.word.etymology.toLowerCase().includes(q) ||
        rec.morphemes.some(
          (m) =>
            m.displayRoot.toLowerCase().includes(q) || m.meaning.toLowerCase().includes(q)
        )
      );
    });
  }, [wordRecords, trunkFilter, topicFilter, onlyConnected, searchQuery]);

  // Connected Cousin Families (`words.length >= 2`) for Sidebar Tab 2
  const connectedFamilies = useMemo(() => {
    const filteredKeys = new Set(filteredRecords.map((r) => r.key));
    const list: {
      clade: PhylogeneticClade;
      trunkLabel: string;
      records: WordRecord[];
    }[] = [];

    for (const trunk of rawTrunks) {
      for (const branch of trunk.origins) {
        for (const clade of branch.clades) {
          if (clade.words.length < 2) continue;
          const recs = clade.words
            .map((w) => recordByKey.get(w.word.toLowerCase()))
            .filter((r): r is WordRecord => Boolean(r && filteredKeys.has(r.key)));
          if (recs.length > 0) {
            list.push({ clade, trunkLabel: trunk.label, records: recs });
          }
        }
      }
    }

    return list.sort((a, b) => b.records.length - a.records.length);
  }, [rawTrunks, filteredRecords, recordByKey]);

  // Sorted list of full words for Sidebar Tab 1
  const sortedFilteredRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      if (b.cousinCount !== a.cousinCount && searchQuery.trim() === '') {
        return b.cousinCount - a.cousinCount;
      }
      return a.word.word.localeCompare(b.word.word);
    });
  }, [filteredRecords, searchQuery]);

  // Maintain valid active selectedWordKey
  useEffect(() => {
    if (activeWords.length === 0) {
      setSelectedWordKey(null);
      return;
    }
    if (
      selectedWordKey &&
      (recordByKey.has(selectedWordKey) ||
        (showUnlearnedCousins &&
          allLexiconWords.some((w) => w.word.toLowerCase() === selectedWordKey)))
    ) {
      return;
    }
    const preferred =
      filteredRecords.find((r) => r.cousinCount > 0) ||
      filteredRecords[0] ||
      wordRecords.find((r) => r.cousinCount > 0) ||
      wordRecords[0];
    if (preferred) {
      setSelectedWordKey(preferred.key);
      setConstellationSelection({ type: 'word', wordKey: preferred.key });
    }
  }, [
    activeWords.length,
    selectedWordKey,
    recordByKey,
    filteredRecords,
    wordRecords,
    showUnlearnedCousins,
    allLexiconWords,
  ]);

  const toDossierEntry = (wordObj: Word): GardenEntry => {
    const existing = learnedMap.get(wordObj.word.toLowerCase());
    if (existing) return existing;
    return {
      ...wordObj,
      dateLearned: 'Undiscovered',
      growthStage: 'seed',
    };
  };

  // Focused Word + Full Cousin / Cognate Neighborhood Data
  const focusedData = useMemo(() => {
    if (!selectedWordKey) return null;
    const baseWord =
      recordByKey.get(selectedWordKey)?.word ||
      allLexiconWords.find((w) => w.word.toLowerCase() === selectedWordKey);
    if (!baseWord) return null;

    const lineage = resolveAncestralRootOrigin(baseWord);
    const morphemes = extractWordMorphemes(baseWord);
    const transmission = extractTransmissionPath(baseWord);
    const originMeta = classifyOriginBranch(baseWord.origin);
    const primaryClade = recordByKey.get(selectedWordKey)?.primaryClade || null;
    const sisterClades = findConnectedSisterClades(baseWord, cousinTrunks, primaryClade?.id);

    const morphLabelById = new Map(morphemes.map((m) => [m.id, m.displayRoot]));
    const sharedHits = findWordsSharingMorpheme(
      morphemes.map((m) => m.id),
      cousinPool,
      baseWord.word
    ).map((hit): ConnectedCousinHit => ({
      word: hit.word,
      lineage: resolveAncestralRootOrigin(hit.word),
      relation: 'shared-root',
      sharedMorphemeId: hit.sharedMorphemeId,
      connectionLabel: `Shared root: ${morphLabelById.get(hit.sharedMorphemeId) || hit.sharedMorphemeId}`,
      isLearned: learnedMap.has(hit.word.word.toLowerCase()),
    }));

    const seenKeys = new Set<string>([
      baseWord.word.toLowerCase(),
      ...sharedHits.map((h) => h.word.word.toLowerCase()),
    ]);

    // Add cross-language cognate bridge words from sisterClades
    const cognateHits: ConnectedCousinHit[] = [];
    for (const sc of sisterClades) {
      for (const cw of sc.clade.words) {
        const cKey = cw.word.toLowerCase();
        if (seenKeys.has(cKey)) continue;
        seenKeys.add(cKey);
        cognateHits.push({
          word: cw,
          lineage: resolveAncestralRootOrigin(cw),
          relation: 'cognate-bridge',
          sharedMorphemeId: sc.clade.id.split('::')[1],
          connectionLabel: sc.bridgeReason,
          isLearned: learnedMap.has(cKey),
        });
        if (cognateHits.length >= 6) break;
      }
      if (cognateHits.length >= 6) break;
    }

    const combinedDirect = [...sharedHits, ...cognateHits].sort(
      (a, b) => Number(b.isLearned) - Number(a.isLearned)
    );

    // If very sparse (< 2 connections), append same ancestral origin sisters so the neighborhood stays rich
    const originFallbacks: ConnectedCousinHit[] =
      combinedDirect.length < 2
        ? activeWords
            .filter((w) => {
              const wk = w.word.toLowerCase();
              return (
                !seenKeys.has(wk) &&
                resolveAncestralRootOrigin(w).rootOrigin === lineage.rootOrigin
              );
            })
            .slice(0, Math.max(0, 4 - combinedDirect.length))
            .map((w) => ({
              word: w,
              lineage: resolveAncestralRootOrigin(w),
              relation: 'same-origin',
              connectionLabel: `Same ${lineage.rootOrigin} origin`,
              isLearned: learnedMap.has(w.word.toLowerCase()),
            }))
        : [];

    return {
      word: baseWord,
      lineage,
      morphemes,
      transmission,
      originMeta,
      sisterClades,
      cousins: [...combinedDirect, ...originFallbacks].slice(0, 12),
    };
  }, [selectedWordKey, recordByKey, allLexiconWords, cousinTrunks, cousinPool, learnedMap, activeWords]);

  // Constellation Map Graph Model
  const constellation = useMemo(() => {
    const graphInput =
      filteredRecords.length > 0 ? filteredRecords : wordRecords;
    return buildConstellationGraph(graphInput, selectedWordKey);
  }, [filteredRecords, wordRecords, selectedWordKey]);

  // Highlight set for Constellation Map
  const highlightedConstellationWords = useMemo(() => {
    const keys = new Set<string>();
    const sel = constellationSelection;
    if (!sel) return keys;

    if (sel.type === 'word') {
      keys.add(sel.wordKey);
      const rec = recordByKey.get(sel.wordKey);
      if (rec) {
        const myMorphIds = new Set(rec.morphemes.map((m) => m.id));
        const myCogIds = new Set(rec.morphemes.flatMap((m) => m.cognateIds || []));
        for (const wn of constellation.wordNodes) {
          if (
            wn.record.morphemes.some(
              (m) => myMorphIds.has(m.id) || myCogIds.has(m.id)
            )
          ) {
            keys.add(wn.record.key);
          }
        }
      }
    } else if (sel.type === 'root') {
      for (const wn of constellation.wordNodes) {
        if (
          wn.record.primaryRootId === sel.rootId ||
          wn.record.morphemes.some((m) => m.id === sel.rootId)
        ) {
          keys.add(wn.record.key);
        }
      }
    } else if (sel.type === 'origin') {
      for (const wn of constellation.wordNodes) {
        if (
          wn.originNodeId === sel.stageName ||
          wn.record.lineage.rootOrigin.toLowerCase() === sel.stageName.toLowerCase() ||
          wn.record.lineage.viaOrigins.some(
            (v) => v.toLowerCase() === sel.stageName.toLowerCase()
          )
        ) {
          keys.add(wn.record.key);
        }
      }
    }
    return keys;
  }, [constellationSelection, constellation.wordNodes, recordByKey]);

  const selectWord = (wordKey: string, switchToEgo: boolean = false) => {
    setSelectedWordKey(wordKey);
    setConstellationSelection({ type: 'word', wordKey });
    setHighlightedMorphemeId(null);
    if (switchToEgo) {
      setViewMode('ego');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  // Drag-to-pan handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragOriginRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const start = dragOriginRef.current;
    if (!start) return;
    const dx = e.clientX - start.clientX;
    const dy = e.clientY - start.clientY;
    if (Math.hypot(dx, dy) > 4) {
      start.moved = true;
    }
    setPan({ x: start.panX + dx, y: start.panY + dy });
  };

  const handleCanvasMouseUp = () => {
    dragOriginRef.current = null;
    setIsDragging(false);
  };

  const resetViewport = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const adjustZoom = (delta: number) => {
    setZoom((z) => Math.round(Math.max(0.55, Math.min(2.2, z + delta)) * 100) / 100);
  };

  if (learnedEntries.length === 0 && !previewFullLexicon) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[#F8F6EE]/60 flex items-center justify-center">
        <div className="max-w-lg w-full text-center bg-[#FFFDF8] rounded-3xl border border-[#DCE5D5] p-8 shadow-sm space-y-4">
          <span className="text-5xl block">🕸️</span>
          <h3 className="serif font-black text-2xl text-emerald-950">
            Your Etymology Node Network Awaits First Words
          </h3>
          <p className="text-sm text-emerald-800 leading-relaxed">
            As you discover words in <strong>Seed Sprout</strong> or <strong>Field Notes</strong>,
            every full word appears here as an interactive node linked to its ancient origins,{' '}
            <code>via</code> languages, and shared-root cousins.
          </p>
          <button
            type="button"
            onClick={() => setPreviewFullLexicon(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EDF5EB] hover:bg-[#DCECD8] text-emerald-900 border border-[#BBD9B7] text-xs font-black uppercase tracking-wider transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Preview Full Lexicon Node Network ({allLexiconWords.length} Words)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8F6EE]/60 space-y-4">
      {/* Single Compact Node Viewer Control Bar */}
      <div className="bg-[#FFFDF8] p-3 sm:p-3.5 rounded-2xl border border-[#DCE5D5] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Segmented Switcher */}
            <div className="inline-flex items-center bg-[#F4F7F0] p-1 rounded-full border border-[#DCE5D5]">
              <button
                type="button"
                onClick={() => {
                  setViewMode('network');
                  resetViewport();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                  viewMode === 'network'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100/60'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Constellation Map</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('ego');
                  resetViewport();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                  viewMode === 'ego'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100/60'
                }`}
              >
                <Focus className="w-3.5 h-3.5" />
                <span>Word Neighborhood</span>
              </button>
            </div>

            <select
              value={trunkFilter}
              onChange={(e) => {
                setTrunkFilter(e.target.value as TrunkFilter);
                setConstellationSelection(null);
              }}
              aria-label="Filter by origin family"
              className="px-3 py-1.5 rounded-full bg-[#F4F7F0] border border-[#DCE5D5] text-[11px] font-bold text-emerald-950 focus:bg-[#FFFDF8] focus:border-emerald-600 outline-none cursor-pointer"
            >
              {TRUNK_FILTERS.map((tf) => (
                <option key={tf.id} value={tf.id}>
                  {tf.emoji} {tf.label}
                </option>
              ))}
            </select>

            <select
              value={topicFilter}
              onChange={(e) => {
                setTopicFilter(e.target.value as TopicCategory | 'all');
                setConstellationSelection(null);
              }}
              aria-label="Filter by topic category"
              className="px-3 py-1.5 rounded-full bg-[#F4F7F0] border border-[#DCE5D5] text-[11px] font-bold text-emerald-950 focus:bg-[#FFFDF8] focus:border-emerald-600 outline-none cursor-pointer"
            >
              <option value="all">🏷️ All Topics</option>
              {TOPIC_CATEGORIES.map((topic) => (
                <option key={topic.type} value={topic.type}>
                  {topic.emoji} {topic.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyConnected((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                onlyConnected
                  ? 'bg-sky-100 text-sky-950 border-sky-300 shadow-sm'
                  : 'bg-[#F4F7F0] text-emerald-800 border-[#DCE5D5] hover:bg-[#E7F0E3]'
              }`}
              title="Filter to words that share a root or cognate with at least one other word"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{onlyConnected ? 'Connected Cousins Only' : 'All Words'}</span>
            </button>

            {learnedEntries.length > 0 ? (
              <button
                type="button"
                onClick={() => setShowUnlearnedCousins((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                  showUnlearnedCousins
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                    : 'bg-[#F4F7F0] text-emerald-800 border-[#DCE5D5] hover:bg-[#E7F0E3]'
                }`}
                title="Include undiscovered lexicon words sharing the same root or cognate bridge"
              >
                {showUnlearnedCousins ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                )}
                <span>
                  {showUnlearnedCousins
                    ? 'Showing Unlearned Cousins'
                    : 'Show Unlearned Cousins'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPreviewFullLexicon(false)}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300"
              >
                Exit Preview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Workspace: Word-First Navigator (Left) + Interactive Node Canvas & Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT SIDEBAR: WORD-FIRST NAVIGATOR */}
        <div className="lg:col-span-4 bg-[#FFFDF8] rounded-3xl border border-[#DCE5D5] p-4 shadow-sm flex flex-col max-h-[76vh]">
          <div className="space-y-2.5 pb-3 mb-3 border-b border-[#DCE5D5] shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search word, meaning, origin (Spanish, Latin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F4F7F0] border border-[#DCE5D5] text-xs font-medium text-emerald-950 focus:bg-[#FFFDF8] focus:border-emerald-600 outline-none"
              />
            </div>

            {/* 2 Clean Navigator Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-[#F4F7F0] p-1 rounded-xl border border-[#DCE5D5]">
              <button
                type="button"
                onClick={() => setSidebarTab('words')}
                className={`px-2 py-1.5 rounded-lg text-[10.5px] font-black transition-all ${
                  sidebarTab === 'words'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-white/70'
                }`}
              >
                Words ({filteredRecords.length})
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab('clusters')}
                className={`px-2 py-1.5 rounded-lg text-[10.5px] font-black transition-all ${
                  sidebarTab === 'clusters'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-white/70'
                }`}
              >
                Root Families ({connectedFamilies.length})
              </button>
            </div>
          </div>

          <div className="overflow-y-auto pr-1 space-y-2">
            {filteredRecords.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-2">
                <p className="text-xs font-bold text-emerald-900">
                  No words match these filters.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {onlyConnected && (
                    <button
                      type="button"
                      onClick={() => setOnlyConnected(false)}
                      className="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-900 border border-sky-200"
                    >
                      Show All Words
                    </button>
                  )}
                  {(searchQuery !== '' || trunkFilter !== 'all' || topicFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setTrunkFilter('all');
                        setTopicFilter('all');
                      }}
                      className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-800 text-white"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            ) : sidebarTab === 'words' ? (
              sortedFilteredRecords.map((rec) => {
                const entry = learnedMap.get(rec.key);
                const stageIcon = entry
                  ? GROWTH_STAGE_META[entry.growthStage || 'sprout'].emoji
                  : '🔒';
                const catEmoji = `${getDifficultyMeta(rec.word).emoji}${
                  getWordTopic(rec.word) !== 'general' ? getTopicMeta(rec.word).emoji : ''
                }`;
                const isSelected = selectedWordKey === rec.key;

                return (
                  <button
                    key={rec.key}
                    type="button"
                    onClick={() => selectWord(rec.key)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all space-y-1 ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-950 shadow-sm'
                        : 'bg-[#FAF9F2] hover:bg-[#EDF5EB] text-emerald-950 border-[#DCE5D5]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span>{stageIcon}</span>
                        <span className="serif font-black text-sm truncate">
                          {rec.word.word}
                        </span>
                        <span className="text-[11px] opacity-75">{catEmoji}</span>
                      </div>
                      {rec.cousinCount > 0 && (
                        <span
                          className={`shrink-0 text-[9.5px] font-black px-2 py-0.5 rounded-full border ${
                            isSelected
                              ? 'bg-emerald-800 text-emerald-100 border-emerald-700'
                              : 'bg-sky-50 text-sky-900 border-sky-200'
                          }`}
                        >
                          🔗 {rec.cousinCount}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-emerald-800 text-emerald-100'
                            : rec.lineage.viaOrigins.length > 0
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-[#EDF5EB] text-emerald-800'
                        }`}
                      >
                        {ORIGIN_EMOJI_MAP[rec.lineage.rootOrigin] || '🌱'}{' '}
                        {rec.lineage.displayBadge}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase ${
                          isSelected ? 'text-emerald-200' : 'text-emerald-700'
                        }`}
                      >
                        {rec.word.form}
                      </span>
                    </div>

                    <p
                      className={`text-[11px] line-clamp-1 ${
                        isSelected ? 'text-emerald-100' : 'text-emerald-800'
                      }`}
                    >
                      {rec.word.definition}
                    </p>
                  </button>
                );
              })
            ) : (
              connectedFamilies.length === 0 ? (
                <div className="py-10 px-4 text-center text-xs text-emerald-800 space-y-2">
                  <p className="font-bold">No multi-word cousin clusters in this filtered set yet.</p>
                  <p className="text-[11px] opacity-80">
                    Try toggling &ldquo;Show Unlearned Cousins&rdquo; above to see full-lexicon root families.
                  </p>
                </div>
              ) : (
                connectedFamilies.map(({ clade, records }) => {
                  const cladeRootId = clade.id.split('::')[1] || clade.id;
                  const isActiveHub =
                    constellationSelection?.type === 'root' &&
                    constellationSelection.rootId === cladeRootId;

                  return (
                    <div
                      key={clade.id}
                      className={`p-3 rounded-2xl border transition-all space-y-2 ${
                        isActiveHub
                          ? 'bg-amber-50 border-amber-300 shadow-sm'
                          : 'bg-[#FAF9F2] border-[#DCE5D5]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setConstellationSelection({ type: 'root', rootId: cladeRootId });
                          setSelectedWordKey(records[0].key);
                        }}
                        className="w-full text-left flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-black text-amber-950">
                            &ldquo;{truncateLabel(clade.meaning, 42)}&rdquo;
                          </p>
                          <p className="text-[10.5px] font-bold text-emerald-800">
                            {ORIGIN_EMOJI_MAP[clade.origin] || '🌿'} {clade.origin} ·{' '}
                            <span className="serif font-black">{clade.displayRoot}</span>
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-200">
                          {records.length} words
                        </span>
                      </button>

                      <div className="flex flex-wrap gap-1.5">
                        {records.map((rec) => {
                          const entry = learnedMap.get(rec.key);
                          const stageIcon = entry
                            ? GROWTH_STAGE_META[entry.growthStage || 'sprout'].emoji
                            : '🔒';
                          const isWordSel = selectedWordKey === rec.key;
                          return (
                            <button
                              key={`fam-${clade.id}-${rec.key}`}
                              type="button"
                              onClick={() => selectWord(rec.key)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                                isWordSel
                                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                                  : 'bg-white hover:bg-[#EDF5EB] text-emerald-950 border-[#D0DDD0]'
                              }`}
                            >
                              <span>{stageIcon}</span>
                              <span>{rec.word.word}</span>
                              {rec.lineage.shortViaBadge && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                                    isWordSel
                                      ? 'bg-emerald-700 text-emerald-100'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}
                                >
                                  {rec.lineage.shortViaBadge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* RIGHT MAIN PANEL: PAN/ZOOM SVG NODE CANVAS + WORD INSPECTOR */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#FFFDF8] rounded-3xl border border-[#DCE5D5] p-3.5 sm:p-4 shadow-sm space-y-3">
            {/* Legend & Graph Mode Context Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-bold">
                <span className="inline-flex items-center gap-1 text-emerald-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] inline-block" />
                  Ancestral Origin
                </span>
                <span className="inline-flex items-center gap-1 text-sky-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] inline-block" />
                  Via / Cognate Bridge
                </span>
                <span className="inline-flex items-center gap-1 text-amber-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block" />
                  Root Hub
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-950">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#14532D] inline-block" />
                  Word Node
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {viewMode === 'network' && constellation.totalFilteredCount > constellation.plottedCount && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    Showing {constellation.plottedCount} of {constellation.totalFilteredCount} words
                  </span>
                )}
                {viewMode === 'network' && focusedData && (
                  <button
                    type="button"
                    onClick={() => selectWord(focusedData.word.word.toLowerCase(), true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-[10.5px] font-bold transition-colors"
                  >
                    <Focus className="w-3 h-3" />
                    <span>Word Neighborhood →</span>
                  </button>
                )}
                {viewMode === 'ego' && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('network');
                      resetViewport();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EDF5EB] hover:bg-[#DCECD8] text-emerald-950 border border-[#C6DEC2] text-[10.5px] font-bold transition-colors"
                  >
                    <Network className="w-3 h-3" />
                    <span>← Constellation Map</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Pan & Zoom SVG Viewport */}
            <div
              className={`relative w-full rounded-2xl bg-[#FAFBF7] border border-[#E4ECE0] overflow-hidden select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ minHeight: '420px' }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            >
              {/* Floating Zoom Controls */}
              <div
                className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-[#DCE5D5] rounded-full px-2 py-1 shadow-sm"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => adjustZoom(-0.2)}
                  className="p-1 rounded-full hover:bg-[#EDF5EB] text-emerald-900"
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-black text-emerald-900 min-w-[34px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => adjustZoom(0.2)}
                  className="p-1 rounded-full hover:bg-[#EDF5EB] text-emerald-900"
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={resetViewport}
                  className="p-1 rounded-full hover:bg-[#EDF5EB] text-emerald-900"
                  aria-label="Reset pan and zoom"
                  title="Reset view"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* VIEW MODE A: CONSTELLATION MAP */}
              {viewMode === 'network' && (
                <svg
                  viewBox="0 0 1000 660"
                  className="w-full h-auto block"
                  role="img"
                  aria-label="Interactive etymology constellation node map"
                >
                  <defs>
                    <marker
                      id="arrow-lineage"
                      markerWidth="7"
                      markerHeight="7"
                      refX="6"
                      refY="3.5"
                      orient="auto"
                    >
                      <path d="M 0 0 L 7 3.5 L 0 7 z" fill="#0284C7" />
                    </marker>
                  </defs>

                  <g
                    transform={`translate(${500 + pan.x}, ${330 + pan.y}) scale(${zoom}) translate(-500, -330)`}
                  >
                    {/* Subtle botanical orbital rings */}
                    <ellipse
                      cx={500}
                      cy={330}
                      rx={118}
                      ry={78}
                      fill="none"
                      stroke="#E5EDE0"
                      strokeWidth={1.2}
                      strokeDasharray="4 4"
                    />
                    <ellipse
                      cx={500}
                      cy={330}
                      rx={236}
                      ry={154}
                      fill="none"
                      stroke="#E5EDE0"
                      strokeWidth={1.2}
                      strokeDasharray="4 4"
                    />
                    <ellipse
                      cx={500}
                      cy={330}
                      rx={395}
                      ry={255}
                      fill="none"
                      stroke="#ECF2E8"
                      strokeWidth={1}
                    />

                    {/* Network Edges */}
                    {constellation.edges.map((edge) => {
                      const hasSelection = highlightedConstellationWords.size > 0;
                      const isLit =
                        !hasSelection ||
                        edge.relatedKeys.some((k) => highlightedConstellationWords.has(k));

                      const strokeColor =
                        edge.kind === 'cognate'
                          ? '#0284C7'
                          : edge.kind === 'origin-via' || edge.kind === 'via-word'
                          ? '#0EA5E9'
                          : edge.kind === 'origin-root'
                          ? '#16A34A'
                          : '#65A30D';

                      return (
                        <path
                          key={edge.id}
                          d={`M ${edge.fromX} ${edge.fromY} Q ${edge.ctrlX} ${edge.ctrlY} ${edge.toX} ${edge.toY}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={edge.kind === 'cognate' ? 2 : isLit && hasSelection ? 2 : 1.3}
                          strokeDasharray={
                            edge.kind === 'cognate'
                              ? '6 4'
                              : edge.kind === 'via-word'
                              ? '3 3'
                              : undefined
                          }
                          markerEnd={
                            edge.kind === 'origin-via' ? 'url(#arrow-lineage)' : undefined
                          }
                          opacity={isLit ? (hasSelection ? 0.9 : 0.45) : 0.12}
                        />
                      );
                    })}

                    {/* Middle Layer: Shared Root Hubs */}
                    {constellation.rootNodes.map((hub) => {
                      const pillW = Math.max(96, Math.min(148, hub.displayRoot.length * 7.2 + 34));
                      const hasSel = highlightedConstellationWords.size > 0;
                      const isLit =
                        !hasSel ||
                        (constellationSelection?.type === 'root' &&
                          constellationSelection.rootId === hub.morphemeId) ||
                        constellation.wordNodes.some(
                          (wn) =>
                            wn.hubNodeId === hub.id &&
                            highlightedConstellationWords.has(wn.record.key)
                        );

                      return (
                        <g
                          key={hub.id}
                          className="cursor-pointer"
                          opacity={isLit ? 1 : 0.25}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dragOriginRef.current?.moved) return;
                            setConstellationSelection({
                              type: 'root',
                              rootId: hub.morphemeId,
                            });
                          }}
                        >
                          <title>{`${hub.origin} root ${hub.displayRoot}: "${hub.meaning}" (${hub.wordCount} words)`}</title>
                          <rect
                            x={hub.x - pillW / 2}
                            y={hub.y - 16}
                            width={pillW}
                            height={32}
                            rx={12}
                            fill="#FFFBEB"
                            stroke="#D97706"
                            strokeWidth={1.8}
                          />
                          <text
                            x={hub.x}
                            y={hub.y - 2}
                            textAnchor="middle"
                            fontSize={10.5}
                            fontWeight={800}
                            fill="#78350F"
                          >
                            {truncateLabel(hub.displayRoot, 17)} ({hub.wordCount})
                          </text>
                          {hub.meaning && (
                            <text
                              x={hub.x}
                              y={hub.y + 10}
                              textAnchor="middle"
                              fontSize={8.5}
                              fontStyle="italic"
                              fill="#92400E"
                            >
                              {truncateLabel(hub.meaning, 20)}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Inner-Mid Layer: Intermediary `via` Language Nodes */}
                    {constellation.viaNodes.map((vNode) => {
                      const pillW = Math.max(88, vNode.stageName.length * 6.8 + 42);
                      const hasSel = highlightedConstellationWords.size > 0;
                      const isLit =
                        !hasSel ||
                        (constellationSelection?.type === 'origin' &&
                          constellationSelection.stageName === vNode.stageName) ||
                        constellation.wordNodes.some(
                          (wn) =>
                            wn.viaNodeIds.includes(vNode.id) &&
                            highlightedConstellationWords.has(wn.record.key)
                        );

                      return (
                        <g
                          key={vNode.id}
                          className="cursor-pointer"
                          opacity={isLit ? 1 : 0.24}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dragOriginRef.current?.moved) return;
                            setConstellationSelection({
                              type: 'origin',
                              stageName: vNode.stageName,
                            });
                          }}
                        >
                          <title>{`Intermediary borrowing stage: via ${vNode.stageName} (${vNode.wordCount} words)`}</title>
                          <rect
                            x={vNode.x - pillW / 2}
                            y={vNode.y - 13}
                            width={pillW}
                            height={26}
                            rx={13}
                            fill="#E0F2FE"
                            stroke="#0284C7"
                            strokeWidth={1.6}
                          />
                          <text
                            x={vNode.x}
                            y={vNode.y + 3.5}
                            textAnchor="middle"
                            fontSize={10}
                            fontWeight={800}
                            fill="#0C4A6E"
                          >
                            {vNode.emoji} via {vNode.stageName}
                          </text>
                        </g>
                      );
                    })}

                    {/* Inner Layer: Ancestral Origin Hub Nodes */}
                    {constellation.originNodes.map((oNode) => {
                      const style = TRUNK_NODE_STYLE[oNode.trunkId];
                      const pillW = Math.max(108, oNode.label.length * 7.5 + 52);
                      const isSelectedOrigin =
                        constellationSelection?.type === 'origin' &&
                        constellationSelection.stageName === oNode.id;

                      return (
                        <g
                          key={oNode.id}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dragOriginRef.current?.moved) return;
                            setConstellationSelection({
                              type: 'origin',
                              stageName: oNode.id,
                            });
                          }}
                        >
                          <title>{`${style.label} (${oNode.wordCount} words in view)`}</title>
                          <rect
                            x={oNode.x - pillW / 2}
                            y={oNode.y - 17}
                            width={pillW}
                            height={34}
                            rx={17}
                            fill={isSelectedOrigin ? style.stroke : style.fill}
                            stroke={style.stroke}
                            strokeWidth={2.2}
                          />
                          <text
                            x={oNode.x}
                            y={oNode.y + 4}
                            textAnchor="middle"
                            fontSize={11.5}
                            fontWeight={900}
                            fill={isSelectedOrigin ? '#FFFFFF' : style.text}
                          >
                            {oNode.emoji} {oNode.label} ({oNode.wordCount})
                          </text>
                        </g>
                      );
                    })}

                    {/* Outer Layer: Full Word Nodes (ZERO Word Truncation!) */}
                    {constellation.wordNodes.map((wn) => {
                      const rec = wn.record;
                      const isFocused = rec.key === selectedWordKey;
                      const hasSel = highlightedConstellationWords.size > 0;
                      const isLit = !hasSel || highlightedConstellationWords.has(rec.key);
                      const entry = learnedMap.get(rec.key);
                      const stageEmoji = entry
                        ? GROWTH_STAGE_META[entry.growthStage || 'sprout'].emoji
                        : '🔒';

                      return (
                        <g
                          key={`w-node-${rec.key}`}
                          className="cursor-pointer"
                          opacity={isLit ? 1 : 0.24}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (dragOriginRef.current?.moved) return;
                            selectWord(rec.key);
                          }}
                        >
                          <title>{`${rec.word.word} (${rec.lineage.displayBadge}) — ${rec.word.definition}`}</title>
                          <rect
                            x={wn.x - wn.width / 2}
                            y={wn.y - wn.height / 2}
                            width={wn.width}
                            height={wn.height}
                            rx={wn.height / 2}
                            fill={
                              isFocused
                                ? '#14532D'
                                : rec.isLearned
                                ? '#FFFDF8'
                                : '#F3F4F6'
                            }
                            stroke={
                              isFocused
                                ? '#052E16'
                                : hasSel && isLit
                                ? '#0284C7'
                                : rec.isLearned
                                ? '#4E8C5E'
                                : '#9CA3AF'
                            }
                            strokeWidth={isFocused ? 2.5 : hasSel && isLit ? 2 : 1.5}
                            strokeDasharray={rec.isLearned || isFocused ? undefined : '4 3'}
                          />
                          <text
                            x={wn.x}
                            y={rec.lineage.shortViaBadge ? wn.y - 2 : wn.y + 4}
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight={800}
                            fill={
                              isFocused
                                ? '#FFFFFF'
                                : rec.isLearned
                                ? '#103823'
                                : '#4B5563'
                            }
                          >
                            {stageEmoji} {rec.word.word}
                          </text>
                          {rec.lineage.shortViaBadge && (
                            <text
                              x={wn.x}
                              y={wn.y + 11.5}
                              textAnchor="middle"
                              fontSize={8.5}
                              fontWeight={700}
                              fill={isFocused ? '#FDE68A' : '#B45309'}
                            >
                              {rec.lineage.shortViaBadge}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              )}

              {/* VIEW MODE B: WORD NEIGHBORHOOD (DEEP EGO NODE GRAPH) */}
              {viewMode === 'ego' && focusedData && (() => {
                const { word, lineage, morphemes, transmission, cousins } = focusedData;
                const entry = learnedMap.get(word.word.toLowerCase());
                const centerStageEmoji = entry
                  ? GROWTH_STAGE_META[entry.growthStage || 'sprout'].emoji
                  : '🔒';

                // Top Transmission Chain geometry (`Ancestral Origin -> via ... -> Word`)
                const chainStages = transmission.slice(0, 5);
                const chainWidths = chainStages.map((s) =>
                  Math.max(92, s.stage.length * 7.2 + 34)
                );
                const gapX = 28;
                const totalChainW =
                  chainWidths.reduce((a, b) => a + b, 0) +
                  Math.max(0, chainWidths.length - 1) * gapX;
                let chainCursorX = 460 - totalChainW / 2;
                const chainItems = chainStages.map((s, idx) => {
                  const w = chainWidths[idx];
                  const item = { ...s, x: chainCursorX, width: w, cx: chainCursorX + w / 2 };
                  chainCursorX += w + gapX;
                  return item;
                });

                const centerW = Math.max(220, Math.min(310, word.word.length * 10.5 + 72));
                const centerX = 460 - centerW / 2;
                const centerRightX = 460 + centerW / 2;
                const centerY = 290;

                const visibleCousins = cousins.slice(0, 7);
                const leftYs = getColumnSlotYs(morphemes.length, 165, 450);
                const rightYs = getColumnSlotYs(visibleCousins.length, 150, 470);

                return (
                  <svg
                    viewBox="0 0 920 530"
                    className="w-full h-auto block"
                    role="img"
                    aria-label={`Neighborhood node graph for ${word.word}`}
                  >
                    <defs>
                      <marker
                        id="arrow-chain"
                        markerWidth="7"
                        markerHeight="7"
                        refX="6"
                        refY="3.5"
                        orient="auto"
                      >
                        <path d="M 0 0 L 7 3.5 L 0 7 z" fill="#4E8C5E" />
                      </marker>
                    </defs>

                    <g
                      transform={`translate(${460 + pan.x}, ${265 + pan.y}) scale(${zoom}) translate(-460, -265)`}
                    >
                      <circle
                        cx={460}
                        cy={centerY}
                        r={175}
                        fill="none"
                        stroke="#E4ECE0"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                      <circle cx={460} cy={centerY} r={88} fill="#EDF5EB" fillOpacity={0.45} />

                      {/* Heading: Top Lineage Transmission Chain */}
                      <text
                        x={460}
                        y={22}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={800}
                        fill="#2E633A"
                        letterSpacing="0.08em"
                      >
                        HISTORICAL TRANSMISSION PATH ({lineage.displayBadge.toUpperCase()})
                      </text>

                      {/* Horizontal Transmission Arrows & Vertical Connector into Center Word */}
                      {chainItems.map((item, idx) => {
                        const next = chainItems[idx + 1];
                        return (
                          <g key={`chain-edge-${idx}`}>
                            {next && (
                              <line
                                x1={item.x + item.width}
                                y1={52}
                                x2={next.x - 4}
                                y2={52}
                                stroke="#4E8C5E"
                                strokeWidth={2}
                                markerEnd="url(#arrow-chain)"
                              />
                            )}
                          </g>
                        );
                      })}
                      <path
                        d={`M 460 72 C 460 130, 460 175, 460 ${centerY - 56}`}
                        fill="none"
                        stroke="#4E8C5E"
                        strokeWidth={2.5}
                        markerEnd="url(#arrow-chain)"
                      />

                      {/* Edges: Left Building Blocks -> Center Word */}
                      {morphemes.map((m, idx) => {
                        const cy = leftYs[idx];
                        const isDim = highlightedMorphemeId && highlightedMorphemeId !== m.id;
                        return (
                          <path
                            key={`ego-e-m-${m.id}`}
                            d={`M 232 ${cy} C 285 ${cy}, ${centerX - 40} ${centerY}, ${centerX} ${centerY}`}
                            fill="none"
                            stroke={m.isPrefix ? '#D97706' : '#15803D'}
                            strokeWidth={m.isPrefix ? 2 : 2.6}
                            strokeDasharray={m.isPrefix ? '5 3' : undefined}
                            opacity={isDim ? 0.25 : 1}
                          />
                        );
                      })}

                      {/* Edges: Center Word -> Right Connected Cousins */}
                      {visibleCousins.map((c, idx) => {
                        const cy = rightYs[idx];
                        const isLit =
                          !highlightedMorphemeId ||
                          c.sharedMorphemeId === highlightedMorphemeId;
                        const edgeColor =
                          c.relation === 'shared-root'
                            ? '#0284C7'
                            : c.relation === 'cognate-bridge'
                            ? '#7C3AED'
                            : '#9CA3AF';

                        return (
                          <path
                            key={`ego-e-c-${c.word.word}`}
                            d={`M ${centerRightX} ${centerY} C ${centerRightX + 42} ${centerY}, 612 ${cy}, 658 ${cy}`}
                            fill="none"
                            stroke={edgeColor}
                            strokeWidth={c.relation === 'cognate-bridge' ? 2.2 : 2.4}
                            strokeDasharray={
                              c.relation === 'shared-root' ? undefined : '5 4'
                            }
                            opacity={isLit ? 1 : 0.2}
                          />
                        );
                      })}

                      {/* Column Labels */}
                      <text
                        x={124}
                        y={128}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={800}
                        fill="#5A7D60"
                        letterSpacing="0.08em"
                      >
                        WORD BUILDING BLOCKS
                      </text>
                      <text
                        x={780}
                        y={120}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={800}
                        fill="#0369A1"
                        letterSpacing="0.08em"
                      >
                        CONNECTED COUSIN &amp; BRIDGE WORDS
                      </text>

                      {/* Top Chain Pills */}
                      {chainItems.map((item, idx) => {
                        const isLast = idx === chainItems.length - 1;
                        return (
                          <g
                            key={`chain-node-${item.stage}-${idx}`}
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (dragOriginRef.current?.moved) return;
                              if (item.stage !== 'Modern English') {
                                setSearchQuery(item.stage);
                              }
                            }}
                          >
                            <title>{`Origin stage: ${item.stage} (click to filter sidebar by ${item.stage})`}</title>
                            <rect
                              x={item.x}
                              y={35}
                              width={item.width}
                              height={34}
                              rx={17}
                              fill={isLast ? '#ECFDF5' : idx === 0 ? '#D1FAE5' : '#E0F2FE'}
                              stroke={isLast ? '#15803D' : idx === 0 ? '#047857' : '#0284C7'}
                              strokeWidth={1.8}
                            />
                            <text
                              x={item.cx}
                              y={56}
                              textAnchor="middle"
                              fontSize={11}
                              fontWeight={800}
                              fill="#064E3B"
                            >
                              {item.emoji} {item.stage}
                            </text>
                          </g>
                        );
                      })}

                      {/* Left Column: Building Block Morphemes */}
                      {morphemes.map((m, idx) => {
                        const cy = leftYs[idx];
                        const isActive = highlightedMorphemeId === m.id;
                        return (
                          <g
                            key={`ego-m-${m.id}`}
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (dragOriginRef.current?.moved) return;
                              setHighlightedMorphemeId((prev) =>
                                prev === m.id ? null : m.id
                              );
                            }}
                          >
                            <title>{`${m.displayRoot} (${m.origin}): "${m.meaning}" — click to highlight cousins from this root`}</title>
                            <rect
                              x={18}
                              y={cy - 26}
                              width={214}
                              height={52}
                              rx={14}
                              fill={
                                isActive
                                  ? '#FEF3C7'
                                  : m.isPrefix
                                  ? '#FCF7EA'
                                  : '#FFFDF8'
                              }
                              stroke={
                                isActive
                                  ? '#D97706'
                                  : m.isPrefix
                                  ? '#D7B977'
                                  : '#15803D'
                              }
                              strokeWidth={isActive ? 2.5 : 2}
                            />
                            <text
                              x={125}
                              y={cy - 5}
                              textAnchor="middle"
                              fontSize={12}
                              fontWeight={800}
                              fill="#123724"
                            >
                              {truncateLabel(m.displayRoot, 22)} · {m.origin}
                            </text>
                            <text
                              x={125}
                              y={cy + 13}
                              textAnchor="middle"
                              fontSize={10}
                              fontStyle="italic"
                              fill="#4B5E4F"
                            >
                              &ldquo;{truncateLabel(m.meaning, 28)}&rdquo;
                            </text>
                          </g>
                        );
                      })}

                      {/* Center Node: Full Word & Core Meaning */}
                      <g>
                        <rect
                          x={centerX}
                          y={centerY - 54}
                          width={centerW}
                          height={108}
                          rx={22}
                          fill="#14532D"
                          stroke="#052E16"
                          strokeWidth={2.5}
                        />
                        <text
                          x={460}
                          y={centerY - 28}
                          textAnchor="middle"
                          fontSize={10}
                          fontWeight={800}
                          fill="#A7F3D0"
                          letterSpacing="0.06em"
                        >
                          {centerStageEmoji} {word.form.toUpperCase()} • {getDifficultyMeta(word).label.toUpperCase()} • {getTopicMeta(word).label.toUpperCase()}
                        </text>
                        <text
                          x={460}
                          y={centerY - 2}
                          textAnchor="middle"
                          fontSize={19}
                          fontWeight={900}
                          fill="#FFFFFF"
                        >
                          {word.word}
                        </text>
                        <text
                          x={460}
                          y={centerY + 18}
                          textAnchor="middle"
                          fontSize={10.5}
                          fontWeight={700}
                          fill="#FDE68A"
                        >
                          {truncateLabel(lineage.displayBadge, 30)}
                        </text>
                        <text
                          x={460}
                          y={centerY + 36}
                          textAnchor="middle"
                          fontSize={9.5}
                          fill="#D1FAE5"
                        >
                          {truncateLabel(word.definition, 36)}
                        </text>
                      </g>

                      {/* Right Column: Full Cousin & Cognate Bridge Word Nodes */}
                      {visibleCousins.length === 0 ? (
                        <g>
                          <rect
                            x={658}
                            y={centerY - 30}
                            width={242}
                            height={60}
                            rx={16}
                            fill="#F4F7F0"
                            stroke="#D5DFD0"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={779}
                            y={centerY - 4}
                            textAnchor="middle"
                            fontSize={11}
                            fontWeight={800}
                            fill="#3B5C41"
                          >
                            No cousin words unlocked yet
                          </text>
                          <text
                            x={779}
                            y={centerY + 14}
                            textAnchor="middle"
                            fontSize={9.5}
                            fill="#6A836E"
                          >
                            Toggle &ldquo;Show Unlearned Cousins&rdquo; above
                          </text>
                        </g>
                      ) : (
                        visibleCousins.map((c, idx) => {
                          const cy = rightYs[idx];
                          const cEntry = learnedMap.get(c.word.word.toLowerCase());
                          const icon = cEntry
                            ? GROWTH_STAGE_META[cEntry.growthStage || 'sprout'].emoji
                            : '🔒';
                          const isLit =
                            !highlightedMorphemeId ||
                            c.sharedMorphemeId === highlightedMorphemeId;
                          const viaText = c.lineage.shortViaBadge
                            ? `${c.lineage.rootOrigin} (${c.lineage.shortViaBadge})`
                            : c.lineage.rootOrigin;

                          return (
                            <g
                              key={`ego-c-${c.word.word}`}
                              className="cursor-pointer"
                              opacity={isLit ? 1 : 0.25}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (dragOriginRef.current?.moved) return;
                                selectWord(c.word.word.toLowerCase(), true);
                              }}
                            >
                              <title>{`${c.word.word} (${c.lineage.displayBadge}) — ${c.word.definition}`}</title>
                              <rect
                                x={658}
                                y={cy - 26}
                                width={246}
                                height={52}
                                rx={14}
                                fill={c.isLearned ? '#FFFDF8' : '#F3F4F6'}
                                stroke={
                                  c.relation === 'cognate-bridge'
                                    ? '#7C3AED'
                                    : c.relation === 'shared-root'
                                    ? '#0284C7'
                                    : '#9CA3AF'
                                }
                                strokeWidth={1.8}
                                strokeDasharray={c.isLearned ? undefined : '4 3'}
                              />
                              <text
                                x={781}
                                y={cy - 7}
                                textAnchor="middle"
                                fontSize={12.5}
                                fontWeight={800}
                                fill={c.isLearned ? '#123724' : '#4B5563'}
                              >
                                {icon} {c.word.word}
                              </text>
                              <text
                                x={781}
                                y={cy + 8}
                                textAnchor="middle"
                                fontSize={9.2}
                                fontWeight={700}
                                fill={
                                  c.relation === 'cognate-bridge' ? '#6D28D9' : '#0369A1'
                                }
                              >
                                {truncateLabel(`${c.connectionLabel} · ${viaText}`, 36)}
                              </text>
                              <text
                                x={781}
                                y={cy + 20}
                                textAnchor="middle"
                                fontSize={8.5}
                                fill="#5A6E5C"
                              >
                                {truncateLabel(c.word.definition, 40)}
                              </text>
                            </g>
                          );
                        })
                      )}
                    </g>
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* Bottom Word Lineage & Meaning Inspector Card */}
          {focusedData && (
            <div className="bg-[#FFFDF8] rounded-3xl border border-[#DCE5D5] p-5 shadow-sm space-y-4">
              {/* Word Header & Primary Actions */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="serif font-black text-2xl text-emerald-950">
                      {focusedData.word.word}
                    </h4>
                    <span className="text-[10px] font-bold uppercase bg-emerald-800 text-white px-2.5 py-0.5 rounded-full">
                      {focusedData.word.form}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EDF5EB] border border-[#BBD9B7] text-emerald-950">
                      <span>{ORIGIN_EMOJI_MAP[focusedData.lineage.rootOrigin] || '🌱'}</span>
                      <span>Ancestral Root: {focusedData.lineage.displayBadge}</span>
                    </span>
                  </div>
                  <p className="serif text-sm text-emerald-900 font-medium leading-relaxed">
                    {focusedData.word.definition}
                  </p>
                  {focusedData.word.definition2 && (
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Also: {focusedData.word.definition2}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {onPracticeOriginFlashcards && (
                    <button
                      type="button"
                      onClick={() =>
                        onPracticeOriginFlashcards(
                          `branch:${focusedData.originMeta.branchId}`
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold transition-colors"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Flashcards: {focusedData.originMeta.branchLabel}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectWordDossier(toDossierEntry(focusedData.word))}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Full Dossier</span>
                  </button>
                </div>
              </div>

              {/* Historical Transmission Chain */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1.5">
                  Historical Transmission Path
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {focusedData.transmission.map((step, idx) => (
                    <React.Fragment key={`${step.stage}-${idx}`}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F4F7F0] border border-[#DCE5D5] text-emerald-950">
                        <span>{step.emoji}</span>
                        <span>{step.stage}</span>
                      </span>
                      {idx < focusedData.transmission.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Morpheme Chips */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1.5">
                  Root &amp; Morpheme Building Blocks
                </p>
                <div className="flex flex-wrap gap-2">
                  {focusedData.morphemes.map((m) => {
                    const isLit = highlightedMorphemeId === m.id;
                    return (
                      <button
                        key={`insp-m-${m.id}`}
                        type="button"
                        onClick={() => {
                          setHighlightedMorphemeId((prev) =>
                            prev === m.id ? null : m.id
                          );
                          setConstellationSelection({ type: 'root', rootId: m.id });
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isLit
                            ? 'bg-amber-200 border-amber-400 text-amber-950 shadow-sm'
                            : m.isPrefix
                            ? 'bg-[#FCF7EA] hover:bg-amber-100 border-[#E6D4A5] text-amber-950'
                            : 'bg-[#EDF5EB] hover:bg-[#DCECD8] border-[#BBD9B7] text-emerald-950'
                        }`}
                      >
                        <span className="serif font-black">{m.displayRoot}</span>
                        <span className="opacity-70 italic font-normal">
                          &ldquo;{m.meaning}&rdquo;
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Etymology Narrative */}
              <p className="serif text-xs text-emerald-900 italic bg-[#FAF7EE] p-3.5 rounded-xl border border-[#DCE5D5] leading-relaxed">
                🪴 {focusedData.word.etymology}
              </p>

              {/* Connected Cousin Words & Cross-Language Bridges */}
              {focusedData.cousins.length > 0 && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-sky-800">
                      Connected Cousin Words &amp; Cognate Bridges (
                      {focusedData.cousins.length})
                    </p>
                    <Layers className="w-3.5 h-3.5 text-sky-700" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {focusedData.cousins.map((c) => {
                      const cEntry = learnedMap.get(c.word.word.toLowerCase());
                      const cStage = cEntry
                        ? GROWTH_STAGE_META[cEntry.growthStage || 'sprout'].emoji
                        : '🔒';

                      return (
                        <button
                          key={`cousin-card-${c.word.word}`}
                          type="button"
                          onClick={() => selectWord(c.word.word.toLowerCase())}
                          className="text-left p-2.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/80 border border-sky-200 transition-all space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="serif font-black text-sm text-sky-950 flex items-center gap-1.5">
                              <span>{cStage}</span>
                              <span>{c.word.word}</span>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-sky-900 border border-sky-200">
                              {c.lineage.shortViaBadge || c.lineage.rootOrigin}
                            </span>
                          </div>
                          <p className="text-[10.5px] font-bold text-sky-800">
                            🔗 {c.connectionLabel}
                          </p>
                          <p className="text-[11px] text-emerald-900 line-clamp-1">
                            {c.word.definition}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

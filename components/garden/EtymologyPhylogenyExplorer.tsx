'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from 'd3-force';
import { GardenEntry, Word } from '../../types';
import {
  GROWTH_STAGE_META,
  ORIGIN_EMOJI_MAP,
  getDifficultyMeta,
} from '../../constants';
import {
  AncestralLineageInfo,
  ExtractedMorpheme,
  classifyOriginBranch,
  extractWordMorphemes,
  resolveAncestralRootOrigin,
} from '../../utils/etymology';
import { getWordMorphemeProfile } from '../../utils/morphemes';
import {
  BookOpen,
  Droplets,
  HelpCircle,
  Link2,
  Lock,
  Maximize2,
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

type TrunkId = 'latin-romance' | 'hellenic' | 'germanic' | 'global';
type TrunkFilter = 'all' | TrunkId;

interface GraphNode extends SimulationNodeDatum {
  id: string;
  kind: 'word' | 'hub';
  label: string;
  sublabel?: string;
  trunkId: TrunkId;
  isLearned: boolean;
  degree: number;
  wordData?: Word;
  lineage?: AncestralLineageInfo;
  morphemes?: ExtractedMorpheme[];
  substantiveIds?: string[];
  cognateIds?: string[];
  prefixIds?: string[];
  hubOrigin?: string;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  id: string;
  kind: 'root' | 'cognate';
}

interface ZoneMeta {
  id: TrunkId;
  title: string;
  emoji: string;
  cx: number;
  cy: number;
  fill: string;
  border: string;
  badgeBg: string;
  color: string;
}

const ZONE_META: Record<TrunkId, ZoneMeta> = {
  'latin-romance': {
    id: 'latin-romance',
    title: 'Latin & Romance',
    emoji: '🏛️',
    cx: -360,
    cy: -220,
    fill: 'rgba(220, 252, 231, 0.34)',
    border: 'rgba(21, 128, 61, 0.25)',
    badgeBg: 'rgba(236, 253, 245, 0.94)',
    color: '#15803D',
  },
  hellenic: {
    id: 'hellenic',
    title: 'Greek',
    emoji: '🌺',
    cx: 360,
    cy: -220,
    fill: 'rgba(252, 231, 243, 0.34)',
    border: 'rgba(190, 24, 93, 0.25)',
    badgeBg: 'rgba(253, 242, 248, 0.94)',
    color: '#BE185D',
  },
  germanic: {
    id: 'germanic',
    title: 'Germanic & Norse',
    emoji: '🌲',
    cx: -360,
    cy: 220,
    fill: 'rgba(236, 252, 203, 0.38)',
    border: 'rgba(77, 124, 15, 0.25)',
    badgeBg: 'rgba(247, 254, 231, 0.94)',
    color: '#4D7C0F',
  },
  global: {
    id: 'global',
    title: 'World & Eponyms',
    emoji: '🌍',
    cx: 360,
    cy: 220,
    fill: 'rgba(254, 243, 199, 0.38)',
    border: 'rgba(180, 83, 9, 0.25)',
    badgeBg: 'rgba(255, 251, 235, 0.94)',
    color: '#B45309',
  },
};

const TRUNK_FILTERS: { id: TrunkFilter; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Origins', emoji: '🌿' },
  { id: 'latin-romance', label: 'Latin & Romance', emoji: '🏛️' },
  { id: 'hellenic', label: 'Greek', emoji: '🌺' },
  { id: 'germanic', label: 'Germanic & Norse', emoji: '🌲' },
  { id: 'global', label: 'World & Eponyms', emoji: '🌍' },
];

function getTrunkIdFromOrigin(origin: string): TrunkId {
  const o = (origin || '').toLowerCase();
  if (/greek|hellen/.test(o)) return 'hellenic';
  if (/latin|french|italian|spanish|portuguese|norman|romance/.test(o)) return 'latin-romance';
  if (/old english|german|norse|dutch|anglo-saxon|scots/.test(o)) return 'germanic';
  return 'global';
}

function getNodeRadius(n: GraphNode): number {
  if (n.kind === 'hub') return 6.5 + Math.min(4.5, n.degree * 0.4);
  return 4.5 + Math.min(4, n.degree * 0.65);
}

export const EtymologyPhylogenyExplorer: React.FC<EtymologyPhylogenyExplorerProps> = ({
  learnedEntries,
  allLexiconWords,
  onSelectWordDossier,
  onPracticeOriginFlashcards,
}) => {
  const [trunkFilter, setTrunkFilter] = useState<TrunkFilter>('all');
  const [onlyConnected, setOnlyConnected] = useState(false);
  const [showUndiscovered, setShowUndiscovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<Simulation<GraphNode, GraphLink> | null>(null);
  const rafRef = useRef<number | null>(null);
  const transformRef = useRef<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });

  // Refs read by drawCanvas so hover/selection/search NEVER restarts d3-force or resets camera!
  const hoveredIdRef = useRef<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const searchIdsRef = useRef<Set<string> | null>(null);
  const trunkFilterRef = useRef<TrunkFilter>('all');

  const interactionRef = useRef<{
    mode: 'none' | 'pan' | 'drag-node';
    dragNode: GraphNode | null;
    startX: number;
    startY: number;
    startTx: number;
    startTy: number;
    moved: boolean;
  }>({
    mode: 'none',
    dragNode: null,
    startX: 0,
    startY: 0,
    startTx: 0,
    startTy: 0,
    moved: false,
  });

  const learnedMap = useMemo(() => {
    const map = new Map<string, GardenEntry>();
    learnedEntries.forEach((entry) => map.set(entry.word.toLowerCase(), entry));
    return map;
  }, [learnedEntries]);

  const showFullPool = showUndiscovered || learnedEntries.length === 0;

  // Build Nodes, Links, Label Priority Order, and Origin Zone counts
  const graphData = useMemo(() => {
    const sourceWords = showFullPool ? allLexiconWords : learnedEntries;
    const rawWordNodes: GraphNode[] = [];
    const rootBuckets = new Map<string, GraphNode[]>();

    for (const w of sourceWords) {
      const key = w.word.toLowerCase();
      const lineage = resolveAncestralRootOrigin(w);
      const trunkId = getTrunkIdFromOrigin(lineage.rootOrigin);
      if (trunkFilter !== 'all' && trunkId !== trunkFilter) continue;

      const morphemes = extractWordMorphemes(w);
      const substantiveIds = morphemes
        .filter((m) => !m.isPrefix && !m.id.startsWith('lex:'))
        .map((m) => m.id);
      const cognateIds = morphemes
        .filter((m) => !m.isPrefix)
        .flatMap((m) => m.cognateIds || []);
      const prefixIds = morphemes.filter((m) => m.isPrefix).map((m) => m.id);

      const node: GraphNode = {
        id: `w:${key}`,
        kind: 'word',
        label: w.word,
        trunkId,
        isLearned: learnedMap.has(key),
        degree: 0,
        wordData: w,
        lineage,
        morphemes,
        substantiveIds,
        cognateIds,
        prefixIds,
      };
      rawWordNodes.push(node);

      for (const rid of substantiveIds) {
        if (!rootBuckets.has(rid)) rootBuckets.set(rid, []);
        rootBuckets.get(rid)!.push(node);
      }
    }

    const nodes: GraphNode[] = [...rawWordNodes];
    const links: GraphLink[] = [];
    const hubByRootId = new Map<string, GraphNode>();

    for (const [rid, members] of rootBuckets.entries()) {
      if (members.length < 2) continue;
      const sampleMorph =
        members[0].morphemes?.find((m) => m.id === rid) || members[0].morphemes?.[0];
      const hubOrigin = sampleMorph?.origin || members[0].lineage?.rootOrigin || 'Latin';
      const hubNode: GraphNode = {
        id: `h:${rid}`,
        kind: 'hub',
        label: sampleMorph?.displayRoot || rid,
        sublabel: sampleMorph?.meaning || '',
        trunkId: getTrunkIdFromOrigin(hubOrigin),
        isLearned: members.some((m) => m.isLearned),
        degree: members.length,
        hubOrigin,
      };
      nodes.push(hubNode);
      hubByRootId.set(rid, hubNode);

      for (const mNode of members) {
        mNode.degree += 1;
        links.push({
          id: `l-root-${rid}-${mNode.id}`,
          source: hubNode,
          target: mNode,
          kind: 'root',
        });
      }
    }

    const seenCogPairs = new Set<string>();
    for (const a of rawWordNodes) {
      for (const cid of a.cognateIds || []) {
        const targetHub = hubByRootId.get(cid);
        const aPrimaryHub = a.substantiveIds?.map((rid) => hubByRootId.get(rid)).find(Boolean);

        if (targetHub && aPrimaryHub && targetHub.id !== aPrimaryHub.id) {
          const pk = [aPrimaryHub.id, targetHub.id].sort().join('<->');
          if (!seenCogPairs.has(pk)) {
            seenCogPairs.add(pk);
            links.push({
              id: `l-cog-${pk}`,
              source: aPrimaryHub,
              target: targetHub,
              kind: 'cognate',
            });
          }
          continue;
        }

        const targetWords = rootBuckets.get(cid) || [];
        for (const b of targetWords) {
          if (b.id === a.id) continue;
          if (
            aPrimaryHub &&
            b.substantiveIds?.some((r) => hubByRootId.get(r)?.id === aPrimaryHub.id)
          ) {
            continue;
          }
          const pk = [a.id, b.id].sort().join('<->');
          if (seenCogPairs.has(pk)) continue;
          seenCogPairs.add(pk);
          a.degree += 1;
          b.degree += 1;
          links.push({
            id: `l-cog-${pk}`,
            source: a,
            target: b,
            kind: 'cognate',
          });
        }
      }
    }

    const filteredNodes = onlyConnected ? nodes.filter((n) => n.degree > 0) : nodes;
    const nodeSet = new Set(filteredNodes);
    const filteredLinks = links.filter(
      (l) => nodeSet.has(l.source as GraphNode) && nodeSet.has(l.target as GraphNode)
    );

    const nodeById = new Map(filteredNodes.map((n) => [n.id, n]));
    const neighbors = new Map<string, Set<string>>();
    for (const n of filteredNodes) neighbors.set(n.id, new Set([n.id]));
    for (const l of filteredLinks) {
      const s = (l.source as GraphNode).id;
      const t = (l.target as GraphNode).id;
      neighbors.get(s)?.add(t);
      neighbors.get(t)?.add(s);
    }

    const fullHighlightByNode = new Map<string, Set<string>>();
    for (const n of filteredNodes) {
      const set = new Set<string>(neighbors.get(n.id) || []);
      for (const hop1 of neighbors.get(n.id) || []) {
        const hopNode = nodeById.get(hop1);
        if (hopNode?.kind === 'hub') {
          for (const sib of neighbors.get(hop1) || []) {
            set.add(sib);
          }
        }
      }
      fullHighlightByNode.set(n.id, set);
    }

    // Pre-compute prefix adjacency map so hovered/selected prefix lines draw in O(deg)
    const prefixNeighbors = new Map<string, GraphNode[]>();
    const prefixBuckets = new Map<string, GraphNode[]>();
    for (const n of filteredNodes) {
      if (n.kind !== 'word') continue;
      for (const pid of n.prefixIds || []) {
        if (!prefixBuckets.has(pid)) prefixBuckets.set(pid, []);
        prefixBuckets.get(pid)!.push(n);
      }
    }
    for (const n of filteredNodes) {
      if (n.kind !== 'word' || !n.prefixIds?.length) continue;
      const list: GraphNode[] = [];
      for (const pid of n.prefixIds) {
        for (const sib of prefixBuckets.get(pid) || []) {
          if (sib.id !== n.id && !list.includes(sib)) {
            list.push(sib);
            if (list.length >= 10) break;
          }
        }
        if (list.length >= 10) break;
      }
      if (list.length > 0) prefixNeighbors.set(n.id, list);
    }

    // Pre-sort static label priority once per graph build (not per frame!)
    const baseLabelOrder = [...filteredNodes].sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'hub' ? -1 : 1;
      if (a.isLearned !== b.isLearned) return a.isLearned ? -1 : 1;
      return b.degree - a.degree;
    });

    const zoneWordCounts: Record<TrunkId, number> = {
      'latin-romance': 0,
      hellenic: 0,
      germanic: 0,
      global: 0,
    };
    for (const n of filteredNodes) {
      if (n.kind === 'word') zoneWordCounts[n.trunkId]++;
    }

    return {
      nodes: filteredNodes,
      links: filteredLinks,
      nodeById,
      fullHighlightByNode,
      prefixNeighbors,
      baseLabelOrder,
      zoneWordCounts,
      connectedWordCount: filteredNodes.filter((n) => n.kind === 'word' && n.degree > 0).length,
      standaloneWordCount: filteredNodes.filter((n) => n.kind === 'word' && n.degree === 0).length,
      hubCount: filteredNodes.filter((n) => n.kind === 'hub').length,
    };
  }, [showFullPool, allLexiconWords, learnedEntries, trunkFilter, onlyConnected, learnedMap]);

  const searchMatchIds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    const matches = new Set<string>();
    for (const n of graphData.nodes) {
      if (
        n.label.toLowerCase().includes(q) ||
        (n.sublabel || '').toLowerCase().includes(q) ||
        (n.wordData?.definition || '').toLowerCase().includes(q) ||
        (n.wordData?.origin || n.hubOrigin || '').toLowerCase().includes(q)
      ) {
        matches.add(n.id);
      }
    }
    return matches;
  }, [searchQuery, graphData.nodes]);

  // Keep refs synced
  useEffect(() => {
    hoveredIdRef.current = hoveredNodeId;
  }, [hoveredNodeId]);
  useEffect(() => {
    selectedIdRef.current = selectedNodeId;
  }, [selectedNodeId]);
  useEffect(() => {
    searchIdsRef.current = searchMatchIds;
  }, [searchMatchIds]);
  useEffect(() => {
    trunkFilterRef.current = trunkFilter;
  }, [trunkFilter]);

  const graphDataRef = useRef(graphData);
  graphDataRef.current = graphData;

  const paintNow = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gd = graphDataRef.current;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (cssW === 0 || cssH === 0) return;

    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }

    const curHovered = hoveredIdRef.current;
    const curSelected = selectedIdRef.current;
    const curSearch = searchIdsRef.current;
    const curFilter = trunkFilterRef.current;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#F7F9F4';
    ctx.fillRect(0, 0, cssW, cssH);

    const { x: tx, y: ty, k } = transformRef.current;
    ctx.translate(tx, ty);
    ctx.scale(k, k);

    // 0. Draw Labelled Origin Zones behind everything
    const zoneIdsToDraw: TrunkId[] =
      curFilter === 'all'
        ? (['latin-romance', 'hellenic', 'germanic', 'global'] as TrunkId[])
        : [curFilter];

    const zoneBoxes: { meta: ZoneMeta; minX: number; minY: number; maxX: number; maxY: number }[] = [];
    for (const zid of zoneIdsToDraw) {
      if (gd.zoneWordCounts[zid] === 0) continue;
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      for (const n of gd.nodes) {
        if (n.trunkId !== zid || n.x === undefined || n.y === undefined) continue;
        if (n.x < minX) minX = n.x;
        if (n.x > maxX) maxX = n.x;
        if (n.y < minY) minY = n.y;
        if (n.y > maxY) maxY = n.y;
      }
      if (!isFinite(minX)) continue;
      const pad = 42;
      const box = {
        meta: ZONE_META[zid],
        minX: minX - pad,
        minY: minY - pad - 18,
        maxX: maxX + pad,
        maxY: maxY + pad,
      };
      zoneBoxes.push(box);

      ctx.fillStyle = box.meta.fill;
      ctx.strokeStyle = box.meta.border;
      ctx.lineWidth = 1.5 / k;
      ctx.beginPath();
      ctx.roundRect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY, 26);
      ctx.fill();
      ctx.stroke();
    }

    const activeFocusId = curHovered || curSelected;
    const activeSet = activeFocusId ? gd.fullHighlightByNode.get(activeFocusId) : null;

    // 1. Draw Edges
    ctx.lineWidth = 1.15 / Math.max(0.75, Math.sqrt(k));
    for (const link of gd.links) {
      const s = link.source as GraphNode;
      const t = link.target as GraphNode;
      if (s.x === undefined || s.y === undefined || t.x === undefined || t.y === undefined) continue;

      const isLit = !activeSet || (activeSet.has(s.id) && activeSet.has(t.id));
      const matchLit = !curSearch || curSearch.has(s.id) || curSearch.has(t.id);
      const alpha = !isLit || !matchLit ? 0.08 : activeSet ? 0.85 : 0.42;

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      if (link.kind === 'cognate') {
        ctx.setLineDash([5 / k, 4 / k]);
        ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(22, 163, 74, ${alpha})`;
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Prefix edges on hover/selection only
    if (activeFocusId) {
      const focusNode = gd.nodeById.get(activeFocusId);
      const preList = gd.prefixNeighbors.get(activeFocusId);
      if (
        focusNode &&
        focusNode.x !== undefined &&
        focusNode.y !== undefined &&
        preList &&
        preList.length > 0
      ) {
        ctx.setLineDash([3 / k, 3 / k]);
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.72)';
        ctx.lineWidth = 1.35 / Math.max(0.75, Math.sqrt(k));
        for (const other of preList) {
          if (other.x === undefined || other.y === undefined) continue;
          ctx.beginPath();
          ctx.moveTo(focusNode.x, focusNode.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
    }

    // 2. Draw Nodes
    for (const n of gd.nodes) {
      if (n.x === undefined || n.y === undefined) continue;
      const r = getNodeRadius(n);
      const isSelected = n.id === curSelected;
      const isHovered = n.id === curHovered;
      const isLit =
        (!activeSet || activeSet.has(n.id)) && (!curSearch || curSearch.has(n.id));

      ctx.globalAlpha = isLit ? 1 : 0.16;

      if (n.kind === 'hub') {
        ctx.beginPath();
        ctx.moveTo(n.x, n.y - r);
        ctx.lineTo(n.x + r, n.y);
        ctx.lineTo(n.x, n.y + r);
        ctx.lineTo(n.x - r, n.y);
        ctx.closePath();
        ctx.fillStyle = isSelected || isHovered ? '#F59E0B' : '#FEF3C7';
        ctx.fill();
        ctx.lineWidth = (isSelected || isHovered ? 2.2 : 1.3) / k;
        ctx.strokeStyle = '#B45309';
        ctx.stroke();
      } else {
        const originCol = ZONE_META[n.trunkId].color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.isLearned ? originCol : '#E2E8F0';
        ctx.fill();
        ctx.lineWidth = (isSelected || isHovered ? 2.4 : 1.2) / k;
        ctx.strokeStyle = isSelected || isHovered ? '#0F172A' : n.isLearned ? '#FFFFFF' : originCol;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // 3. Draw Screen-Space Zone Titles & Collision-Free Node Labels
    ctx.restore();
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Zone header badges (always legible regardless of zoom!)
    for (const box of zoneBoxes) {
      const sx = ((box.minX + box.maxX) / 2) * k + tx;
      const sy = box.minY * k + ty + 14;
      const clampedX = Math.max(90, Math.min(cssW - 90, sx));
      const clampedY = Math.max(18, Math.min(cssH - 18, sy));
      const count = gd.zoneWordCounts[box.meta.id];
      const title = `${box.meta.emoji} ${box.meta.title} (${count})`;

      ctx.font = '800 11px ui-sans-serif, system-ui, sans-serif';
      const tw = ctx.measureText(title).width + 18;
      ctx.fillStyle = box.meta.badgeBg;
      ctx.strokeStyle = box.meta.border;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(clampedX - tw / 2, clampedY - 12, tw, 22, 11);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = box.meta.color;
      ctx.fillText(title, clampedX, clampedY - 1);
    }

    const placedBoxes: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const overlapsBox = (x1: number, y1: number, x2: number, y2: number) =>
      placedBoxes.some((b) => !(x2 < b.x1 || x1 > b.x2 || y2 < b.y1 || y1 > b.y2));

    const pinnedNodes: GraphNode[] = [];
    if (curHovered && gd.nodeById.has(curHovered)) pinnedNodes.push(gd.nodeById.get(curHovered)!);
    if (curSelected && curSelected !== curHovered && gd.nodeById.has(curSelected)) {
      pinnedNodes.push(gd.nodeById.get(curSelected)!);
    }
    if (activeSet) {
      for (const id of activeSet) {
        if (id !== curHovered && id !== curSelected) {
          const n = gd.nodeById.get(id);
          if (n) pinnedNodes.push(n);
        }
      }
    }
    if (curSearch) {
      for (const id of curSearch) {
        if (id !== curHovered && id !== curSelected && !activeSet?.has(id)) {
          const n = gd.nodeById.get(id);
          if (n) pinnedNodes.push(n);
        }
      }
    }

    const drawNodeLabel = (n: GraphNode, isPinned: boolean, isMust: boolean) => {
      if (n.x === undefined || n.y === undefined) return;
      const sx = n.x * k + tx;
      const sy = n.y * k + ty;
      if (sx < -60 || sx > cssW + 60 || sy < -30 || sy > cssH + 30) return;

      const rScreen = getNodeRadius(n) * k;
      const fontSize = n.kind === 'hub' ? 11 : isPinned ? 11.5 : 10.5;
      ctx.font = `${n.kind === 'hub' || isPinned ? 800 : 600} ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
      const tw = ctx.measureText(n.label).width + 8;
      const th = fontSize + 4;
      const ly = sy - rScreen - 5;
      const bx1 = sx - tw / 2;
      const by1 = ly - th;
      const bx2 = sx + tw / 2;
      const by2 = ly + 2;

      if (!isMust && overlapsBox(bx1, by1, bx2, by2)) return;
      placedBoxes.push({ x1: bx1 - 2, y1: by1 - 2, x2: bx2 + 2, y2: by2 + 2 });

      const dimmed =
        (activeSet && !activeSet.has(n.id)) || (curSearch && !curSearch.has(n.id));
      ctx.globalAlpha = dimmed && !isMust ? 0.25 : 1;

      if (isMust || n.kind === 'hub') {
        ctx.fillStyle =
          n.kind === 'hub' ? 'rgba(255, 251, 235, 0.94)' : 'rgba(255, 253, 248, 0.95)';
        ctx.beginPath();
        ctx.roundRect(bx1, by1, tw, th, 6);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = n.kind === 'hub' ? '#F59E0B' : '#CBD5E1';
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = n.kind === 'hub' ? '#78350F' : n.isLearned ? '#0F291E' : '#475569';
      ctx.fillText(n.label, sx, ly);
    };

    // Pass 1: Pinned (hovered / selected / active family / search hits)
    for (const n of pinnedNodes) {
      drawNodeLabel(n, true, n.id === curHovered || n.id === curSelected);
    }

    // Pass 2: Ambient labels scaled by zoom (capped cleanly so canvas never lags)
    if (k >= 0.55) {
      const showWordsAtZoom = k >= 0.72;
      const maxAmbientLabels = k >= 1.2 ? 160 : 70;
      let drawnAmbient = 0;
      for (const n of gd.baseLabelOrder) {
        if (drawnAmbient >= maxAmbientLabels) break;
        if (!showWordsAtZoom && n.kind !== 'hub') continue;
        if (n.id === curHovered || n.id === curSelected || activeSet?.has(n.id) || curSearch?.has(n.id)) {
          continue;
        }
        drawNodeLabel(n, false, false);
        drawnAmbient++;
      }
    }

    ctx.restore();
  }, []);

  const schedulePaint = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      paintNow();
    });
  }, [paintNow]);

  const fitCamera = useCallback(() => {
    const canvas = canvasRef.current;
    const gd = graphDataRef.current;
    if (!canvas || gd.nodes.length === 0) return;
    const w = canvas.clientWidth || 900;
    const h = canvas.clientHeight || 560;

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const n of gd.nodes) {
      if (n.x === undefined || n.y === undefined) continue;
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    }
    if (!isFinite(minX)) return;
    const spanX = Math.max(180, maxX - minX + 140);
    const spanY = Math.max(180, maxY - minY + 140);
    const k = Math.max(0.32, Math.min(1.25, Math.min(w / spanX, h / spanY) * 0.92));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    transformRef.current = { x: w / 2 - cx * k, y: h / 2 - cy * k, k };
    schedulePaint();
  }, [schedulePaint]);

  // Run d3-force ONLY when graphData or trunkFilter changes (never on hover/selection!)
  useEffect(() => {
    if (simRef.current) simRef.current.stop();
    const isSingleZone = trunkFilter !== 'all';

    // Initialize positions gently inside target zones so pre-settle converges cleanly in ~110 ticks
    const zoneOffsets: Record<TrunkId, number> = {
      'latin-romance': 0,
      hellenic: 0,
      germanic: 0,
      global: 0,
    };
    for (const n of graphData.nodes) {
      const z = ZONE_META[n.trunkId];
      const baseCx = isSingleZone ? 0 : z.cx;
      const baseCy = isSingleZone ? 0 : z.cy;
      const idx = zoneOffsets[n.trunkId]++;
      const angle = idx * 2.39996; // golden angle spiral eliminates initial clumping!
      const rad = 18 + Math.sqrt(idx) * 18;
      n.x = baseCx + Math.cos(angle) * rad;
      n.y = baseCy + Math.sin(angle) * rad;
    }

    const sim = forceSimulation<GraphNode, GraphLink>(graphData.nodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(graphData.links)
          .id((d) => d.id)
          .distance((l) => (l.kind === 'cognate' ? 110 : 34))
          .strength((l) => (l.kind === 'cognate' ? 0.14 : 0.78))
      )
      .force(
        'charge',
        forceManyBody<GraphNode>()
          .strength((d) => (d.kind === 'hub' ? -130 : d.degree > 0 ? -55 : -42))
          .theta(0.92)
          .distanceMax(220)
      )
      .force(
        'collide',
        forceCollide<GraphNode>()
          .radius((d) => (d.kind === 'hub' ? 18 : d.degree > 0 ? 12 : 17))
          .iterations(1)
      )
      .force(
        'x',
        forceX<GraphNode>((d) => (isSingleZone ? 0 : ZONE_META[d.trunkId].cx)).strength(
          isSingleZone ? 0.06 : 0.14
        )
      )
      .force(
        'y',
        forceY<GraphNode>((d) => (isSingleZone ? 0 : ZONE_META[d.trunkId].cy)).strength(
          isSingleZone ? 0.06 : 0.14
        )
      )
      .velocityDecay(0.58)
      .alphaDecay(0.05);

    // Pre-settle synchronously and stop CPU usage at rest
    sim.tick(110);
    sim.alpha(0);
    sim.on('tick', schedulePaint);

    simRef.current = sim;
    fitCamera();

    return () => {
      sim.stop();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [graphData, trunkFilter, schedulePaint, fitCamera]);

  // Fast canvas repaint on hover / selection / search (zero physics re-run!)
  useEffect(() => {
    schedulePaint();
  }, [hoveredNodeId, selectedNodeId, searchMatchIds, schedulePaint]);

  useEffect(() => {
    if (graphData.nodes.length === 0) {
      setSelectedNodeId(null);
      return;
    }
    if (selectedNodeId && graphData.nodeById.has(selectedNodeId)) return;
    const preferred =
      graphData.nodes.find((n) => n.kind === 'word' && n.degree > 0 && n.isLearned) ||
      graphData.nodes.find((n) => n.kind === 'word' && n.degree > 0) ||
      graphData.nodes.find((n) => n.kind === 'word');
    setSelectedNodeId(preferred?.id || null);
  }, [graphData, selectedNodeId]);

  useEffect(() => {
    window.addEventListener('resize', schedulePaint);
    return () => window.removeEventListener('resize', schedulePaint);
  }, [schedulePaint]);

  const hitTestNode = (clientX: number, clientY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const { x: tx, y: ty, k } = transformRef.current;
    const wx = (sx - tx) / k;
    const wy = (sy - ty) / k;

    let best: GraphNode | null = null;
    let bestDist = Infinity;
    for (const n of graphData.nodes) {
      if (n.x === undefined || n.y === undefined) continue;
      const dist = Math.hypot(wx - n.x, wy - n.y);
      const hitR = getNodeRadius(n) + 8 / k;
      if (dist <= hitR && dist < bestDist) {
        best = n;
        bestDist = dist;
      }
    }
    return best;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const hit = hitTestNode(e.clientX, e.clientY);
    if (hit) {
      hit.fx = hit.x;
      hit.fy = hit.y;
      interactionRef.current = {
        mode: 'drag-node',
        dragNode: hit,
        startX: e.clientX,
        startY: e.clientY,
        startTx: transformRef.current.x,
        startTy: transformRef.current.y,
        moved: false,
      };
    } else {
      interactionRef.current = {
        mode: 'pan',
        dragNode: null,
        startX: e.clientX,
        startY: e.clientY,
        startTx: transformRef.current.x,
        startTy: transformRef.current.y,
        moved: false,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const st = interactionRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (st.mode === 'drag-node' && st.dragNode) {
      const dx = e.clientX - st.startX;
      const dy = e.clientY - st.startY;
      if (Math.hypot(dx, dy) > 3) {
        if (!st.moved) {
          // Gently wake local spring only once user actually drags!
          simRef.current?.alphaTarget(0.08).restart();
        }
        st.moved = true;
      }
      const rect = canvas.getBoundingClientRect();
      const { x: tx, y: ty, k } = transformRef.current;
      st.dragNode.fx = (e.clientX - rect.left - tx) / k;
      st.dragNode.fy = (e.clientY - rect.top - ty) / k;
      schedulePaint();
      return;
    }

    if (st.mode === 'pan') {
      const dx = e.clientX - st.startX;
      const dy = e.clientY - st.startY;
      if (Math.hypot(dx, dy) > 3) st.moved = true;
      transformRef.current.x = st.startTx + dx;
      transformRef.current.y = st.startTy + dy;
      schedulePaint();
      return;
    }

    const hit = hitTestNode(e.clientX, e.clientY);
    const nextHover = hit?.id || null;
    if (nextHover !== hoveredIdRef.current) {
      hoveredIdRef.current = nextHover;
      setHoveredNodeId(nextHover);
    }
    canvas.style.cursor = hit ? 'pointer' : 'grab';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const st = interactionRef.current;
    if (st.mode === 'drag-node' && st.dragNode) {
      if (!st.moved) {
        selectedIdRef.current = st.dragNode.id;
        setSelectedNodeId(st.dragNode.id);
      }
      st.dragNode.fx = null;
      st.dragNode.fy = null;
      if (st.moved) {
        simRef.current?.alphaTarget(0);
      }
    } else if (st.mode === 'pan' && !st.moved) {
      const hit = hitTestNode(e.clientX, e.clientY);
      const nextId = hit ? hit.id : null;
      selectedIdRef.current = nextId;
      setSelectedNodeId(nextId);
    }
    interactionRef.current.mode = 'none';
    interactionRef.current.dragNode = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.14 : 0.88;
    const prev = transformRef.current;
    const nextK = Math.max(0.28, Math.min(3.5, prev.k * factor));
    transformRef.current = {
      x: mx - ((mx - prev.x) / prev.k) * nextK,
      y: my - ((my - prev.y) / prev.k) * nextK,
      k: nextK,
    };
    schedulePaint();
  };

  const adjustZoomCenter = (factor: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mx = canvas.clientWidth / 2;
    const my = canvas.clientHeight / 2;
    const prev = transformRef.current;
    const nextK = Math.max(0.28, Math.min(3.5, prev.k * factor));
    transformRef.current = {
      x: mx - ((mx - prev.x) / prev.k) * nextK,
      y: my - ((my - prev.y) / prev.k) * nextK,
      k: nextK,
    };
    schedulePaint();
  };

  const focusNodeOnCamera = useCallback(
    (nodeId: string) => {
      selectedIdRef.current = nodeId;
      setSelectedNodeId(nodeId);
      const node = graphData.nodeById.get(nodeId);
      const canvas = canvasRef.current;
      if (!node || node.x === undefined || node.y === undefined || !canvas) return;
      const k = Math.max(transformRef.current.k, 1.35);
      transformRef.current = {
        x: canvas.clientWidth / 2 - node.x * k,
        y: canvas.clientHeight / 2 - node.y * k,
        k,
      };
      schedulePaint();
    },
    [graphData.nodeById, schedulePaint]
  );

  const selectedDetails = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = graphData.nodeById.get(selectedNodeId);
    if (!node) return null;

    const connectedSet = graphData.fullHighlightByNode.get(selectedNodeId) || new Set<string>();
    const relatedWordNodes = Array.from(connectedSet)
      .map((id) => graphData.nodeById.get(id))
      .filter((n): n is GraphNode => Boolean(n && n.kind === 'word' && n.id !== selectedNodeId));

    const profile = node.wordData ? getWordMorphemeProfile(node.wordData) : undefined;
    return { node, relatedWordNodes, profile };
  }, [selectedNodeId, graphData]);

  const toDossierEntry = (wordObj: Word): GardenEntry => {
    const existing = learnedMap.get(wordObj.word.toLowerCase());
    if (existing) return existing;
    return {
      ...wordObj,
      dateLearned: 'Undiscovered',
      growthStage: 'seed',
    };
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8F6EE]/60 space-y-4">
      {/* Compact Top Controls */}
      <div className="bg-[#FFFDF8] p-3.5 rounded-2xl border border-[#DCE5D5] shadow-sm space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[220px]">
            <div className="relative flex-1 max-w-xs min-w-[180px]">
              <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search word or root (Enter to focus)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchMatchIds && searchMatchIds.size > 0) {
                    const firstWordMatch = Array.from(searchMatchIds).find((id) =>
                      id.startsWith('w:')
                    );
                    focusNodeOnCamera(firstWordMatch || Array.from(searchMatchIds)[0]);
                  }
                }}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#F4F7F0] border border-[#DCE5D5] text-xs font-medium text-emerald-950 focus:bg-[#FFFDF8] focus:border-emerald-600 outline-none"
              />
            </div>

            <select
              value={trunkFilter}
              onChange={(e) => setTrunkFilter(e.target.value as TrunkFilter)}
              aria-label="Filter by origin family"
              className="px-3 py-1.5 rounded-full bg-[#F4F7F0] border border-[#DCE5D5] text-xs font-bold text-emerald-950 focus:bg-[#FFFDF8] focus:border-emerald-600 outline-none cursor-pointer"
            >
              {TRUNK_FILTERS.map((tf) => (
                <option key={tf.id} value={tf.id}>
                  {tf.emoji} {tf.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyConnected((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                onlyConnected
                  ? 'bg-sky-100 text-sky-950 border-sky-300 shadow-sm'
                  : 'bg-[#F4F7F0] text-emerald-800 border-[#DCE5D5] hover:bg-[#E7F0E3]'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{onlyConnected ? 'Linked Only' : 'All Words'}</span>
            </button>

            {learnedEntries.length > 0 && (
              <button
                type="button"
                onClick={() => setShowUndiscovered((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  showUndiscovered
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                    : 'bg-[#F4F7F0] text-emerald-800 border-[#DCE5D5] hover:bg-[#E7F0E3]'
                }`}
              >
                {showUndiscovered ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                )}
                <span>
                  {showUndiscovered
                    ? `Full Lexicon (${allLexiconWords.length})`
                    : `Discovered Only (${learnedEntries.length})`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Clean Graph Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold px-0.5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] inline-block" />
              Latin
            </span>
            <span className="inline-flex items-center gap-1 text-rose-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BE185D] inline-block" />
              Greek
            </span>
            <span className="inline-flex items-center gap-1 text-lime-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4D7C0F] inline-block" />
              Germanic
            </span>
            <span className="inline-flex items-center gap-1 text-amber-900">
              <span className="w-2.5 h-2.5 rotate-45 bg-[#FEF3C7] border border-[#B45309] inline-block" />
              Root Hub
            </span>
            <span className="inline-flex items-center gap-1 text-purple-900" title="Shared prehistoric ancestor connecting Latin, Greek, and Germanic cognates">
              <span className="w-4 border-t-2 border-dashed border-[#7C3AED] inline-block" />
              Shared Ancient Root
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-emerald-700 font-semibold">
              {graphData.connectedWordCount} linked · {graphData.standaloneWordCount} standalone ·{' '}
              {graphData.hubCount} root hubs
              {learnedEntries.length === 0 && ' · Previewing full lexicon'}
            </span>
            <Link
              href="/help/word-network"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDF5EB] hover:bg-[#DCECD8] text-emerald-900 border border-[#C6DEC2] text-[10.5px] font-bold transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              <span>How It Works</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Obsidian-Style Force Canvas */}
      <div
        className="relative bg-[#F7F9F4] rounded-3xl border border-[#DCE5D5] shadow-sm overflow-hidden"
        style={{ height: '560px' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (hoveredIdRef.current !== null) {
              hoveredIdRef.current = null;
              setHoveredNodeId(null);
            }
            interactionRef.current.mode = 'none';
            interactionRef.current.dragNode = null;
          }}
          onWheel={handleWheel}
          className="w-full h-full block touch-none"
        />

        {/* Floating Zoom & Fit Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-[#DCE5D5] rounded-full px-2 py-1 shadow-sm">
          <button
            type="button"
            onClick={() => adjustZoomCenter(0.8)}
            className="p-1 rounded-full hover:bg-[#EDF5EB] text-emerald-900"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => adjustZoomCenter(1.25)}
            className="p-1 rounded-full hover:bg-[#EDF5EB] text-emerald-900"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={fitCamera}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-[#EDF5EB] text-[10px] font-black text-emerald-900"
            title="Fit entire network"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit</span>
          </button>
        </div>

        {/* Subtle interaction hint */}
        <div className="absolute bottom-3 left-3 pointer-events-none px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-[#DCE5D5] text-[10.5px] font-semibold text-emerald-800">
          Scroll to zoom · Drag background to pan · Click any node to inspect links
        </div>
      </div>

      {/* Selected Node Inspector Bar */}
      {selectedDetails && (
        <div className="bg-[#FFFDF8] rounded-3xl border border-[#DCE5D5] p-5 shadow-sm space-y-3">
          {selectedDetails.node.kind === 'hub' ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                    Root Hub · {selectedDetails.node.hubOrigin}
                  </span>
                  <h4 className="serif font-black text-2xl text-emerald-950">
                    {selectedDetails.node.label}{' '}
                    <span className="text-base font-normal italic text-amber-900">
                      &ldquo;{selectedDetails.node.sublabel}&rdquo;
                    </span>
                  </h4>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-200">
                  {selectedDetails.relatedWordNodes.length} words in network
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedDetails.relatedWordNodes.map((rn) => (
                  <button
                    key={`hub-rel-${rn.id}`}
                    type="button"
                    onClick={() => focusNodeOnCamera(rn.id)}
                    className="px-3 py-1 rounded-full bg-[#EDF5EB] hover:bg-[#DCECD8] text-emerald-950 border border-[#BBD9B7] text-xs font-bold transition-colors"
                  >
                    {rn.isLearned ? '🌿' : '🔒'} {rn.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            selectedDetails.node.wordData && (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="serif font-black text-2xl text-emerald-950">
                        {selectedDetails.node.wordData.word}
                      </h4>
                      <span className="text-[10px] font-bold uppercase bg-emerald-800 text-white px-2.5 py-0.5 rounded-full">
                        {selectedDetails.node.wordData.form}
                      </span>
                      {selectedDetails.node.lineage && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDF5EB] text-emerald-950 border border-[#BBD9B7]">
                          {ORIGIN_EMOJI_MAP[selectedDetails.node.lineage.rootOrigin] || '🌱'}{' '}
                          {selectedDetails.node.lineage.displayBadge}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {getDifficultyMeta(selectedDetails.node.wordData).emoji}{' '}
                        {getDifficultyMeta(selectedDetails.node.wordData).label}
                      </span>
                    </div>
                    <p className="serif text-sm text-emerald-900 font-medium leading-relaxed">
                      {selectedDetails.node.wordData.definition}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {onPracticeOriginFlashcards && (
                      <button
                        type="button"
                        onClick={() =>
                          onPracticeOriginFlashcards(
                            `branch:${classifyOriginBranch(selectedDetails.node.wordData!.origin).branchId}`
                          )
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold transition-colors"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        <span>
                          Flashcards:{' '}
                          {classifyOriginBranch(selectedDetails.node.wordData.origin).branchLabel}
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        onSelectWordDossier(toDossierEntry(selectedDetails.node.wordData!))
                      }
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Full Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Prefix · Root · Suffix Pills */}
                {selectedDetails.profile && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedDetails.profile.prefixes.map((p, i) => (
                      <span
                        key={`p-${i}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FCF7EA] border border-[#E6D4A5] text-amber-950 text-xs"
                      >
                        <span className="text-[9px] font-black uppercase text-amber-700">Pre</span>
                        <span className="serif font-black">{p.form}</span>
                        <span className="opacity-75 italic">&ldquo;{p.meaning}&rdquo;</span>
                      </span>
                    ))}
                    {selectedDetails.profile.roots.map((r, i) => (
                      <span
                        key={`r-${i}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EDF5EB] border border-[#BBD9B7] text-emerald-950 text-xs"
                      >
                        <span className="text-[9px] font-black uppercase text-emerald-700">
                          Root
                        </span>
                        <span className="serif font-black">{r.form}</span>
                        <span className="opacity-75 italic">&ldquo;{r.meaning}&rdquo;</span>
                        {r.pieRoot && (
                          <span
                            className="text-[10px] font-bold px-1.5 rounded bg-white text-purple-900 border border-purple-200"
                            title="Shared Ancient Root (Proto-Indo-European ancestor connecting cross-language cognates)"
                          >
                            Shared Ancient Root {r.pieRoot}
                          </span>
                        )}
                      </span>
                    ))}
                    {selectedDetails.profile.suffixes.map((s, i) => (
                      <span
                        key={`s-${i}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs"
                      >
                        <span className="text-[9px] font-black uppercase text-stone-500">Suf</span>
                        <span className="serif font-bold">{s.form}</span>
                        <span className="opacity-75 italic">&ldquo;{s.meaning}&rdquo;</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Linked Words */}
                {selectedDetails.relatedWordNodes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 mr-1">
                      Linked Words:
                    </span>
                    {selectedDetails.relatedWordNodes.map((rn) => {
                      const entry = learnedMap.get(rn.label.toLowerCase());
                      const icon = entry
                        ? GROWTH_STAGE_META[entry.growthStage || 'sprout'].emoji
                        : '🔒';
                      return (
                        <button
                          key={`rel-${rn.id}`}
                          type="button"
                          onClick={() => focusNodeOnCamera(rn.id)}
                          className="px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200 text-xs font-bold transition-colors"
                        >
                          {icon} {rn.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="serif text-xs text-emerald-900 italic bg-[#FAF7EE] p-3.5 rounded-xl border border-[#DCE5D5] leading-relaxed">
                  🪴 {selectedDetails.node.wordData.etymology}
                </p>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

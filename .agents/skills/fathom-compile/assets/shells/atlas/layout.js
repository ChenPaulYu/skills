/**
 * layout.js — deterministic layout engine for the Atlas shell (★ load-bearing).
 *
 * The fixture (see assets/schema/atlas-fixture.schema.json) carries no coordinates by contract —
 * only semantics (tiers/modules/imports, graph nodes/edges/frames, behavior routes). This module
 * turns that semantics into pixel geometry for two posters: computeRepoLayout (tier bands, module
 * cards, import-road curves) and computeBehaviorLayout (file frames as a 2-column grid, node
 * placement ordered by first appearance across all behavior routes). Both are pure functions of
 * their input — same fixture in, same geometry out — so the shell can recompute on demand and a
 * Node smoke test can exercise them without a browser. UMD-wrapped: `window.AtlasLayout` in a
 * <script> tag, `module.exports` under `require()`.
 *
 * Reads: nothing (pure) · exposes edgePath (shared cubic-bezier router, ported from the
 * two-scale-grammar / behavior-graph mockups) for index.html's SVG rendering.
 */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    root.AtlasLayout = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // ---------- repo scale constants ----------
  const REPO_WORLD_WIDTH = 1320;
  const REPO_MARGIN = 24;
  const MODULE_W = 230;
  const MODULE_H = 76;
  const MODULE_GAP = 24;
  const MODULE_ROW_PITCH = MODULE_H + 18;
  const BAND_HEADER = 28;
  const BAND_PADDING = 16;
  const MIN_BAND_H = 120;

  // ---------- behavior scale constants ----------
  const CARD_W = 184;
  const CARD_H = 112;
  const CELL_W = 200;
  const CELL_H = 130;
  const FRAME_PAD = 18;
  const FRAME_HEADER = 42;
  const FRAME_GAP = 44;
  const FRAME_TOP_MARGIN = 40;
  const FRAME_LEFT_MARGIN = 32;

  function firstLine(lines) {
    const match = String(lines == null ? "" : lines).match(/-?\d+/);
    return match ? parseInt(match[0], 10) : NaN;
  }

  // ---------- repo scale ----------
  // Tiers stack top-to-bottom as horizontal bands; modules lay left-to-right within their band
  // in fixture order, wrapping to further rows only when a band would otherwise overflow the
  // fixed world width. Band height grows with member count (min 120px).
  function computeRepoLayout(repo) {
    repo = repo || {};
    const tiers = Array.isArray(repo.tiers) ? repo.tiers : [];
    const modules = Array.isArray(repo.modules) ? repo.modules : [];

    const byTier = new Map();
    tiers.forEach((t) => byTier.set(t.id, []));
    modules.forEach((m) => {
      if (!byTier.has(m.tier)) byTier.set(m.tier, []);
      byTier.get(m.tier).push(m);
    });

    const maxPerRow = Math.max(
      1,
      Math.floor((REPO_WORLD_WIDTH - 2 * REPO_MARGIN + MODULE_GAP) / (MODULE_W + MODULE_GAP))
    );

    const orderedTierIds = tiers.length ? tiers.map((t) => t.id) : Array.from(byTier.keys());
    const tierLayout = [];
    const positions = {};
    let y = REPO_MARGIN;

    orderedTierIds.forEach((tid) => {
      const members = byTier.get(tid) || [];
      const rows = Math.max(1, Math.ceil(members.length / maxPerRow));
      const bandH = Math.max(MIN_BAND_H, BAND_HEADER + rows * MODULE_ROW_PITCH + BAND_PADDING);

      members.forEach((m, i) => {
        const row = Math.floor(i / maxPerRow);
        const rowStart = row * maxPerRow;
        const rowCount = Math.min(maxPerRow, members.length - rowStart);
        const rowWidth = rowCount * MODULE_W + (rowCount - 1) * MODULE_GAP;
        const rowStartX = (REPO_WORLD_WIDTH - rowWidth) / 2;
        const col = i - rowStart;
        positions[m.id] = {
          x: rowStartX + col * (MODULE_W + MODULE_GAP),
          y: y + BAND_HEADER + row * MODULE_ROW_PITCH,
          w: MODULE_W,
          h: MODULE_H
        };
      });

      const tierMeta = tiers.find((t) => t.id === tid) || { id: tid, label: tid, gloss: "" };
      tierLayout.push({ id: tierMeta.id, label: tierMeta.label, gloss: tierMeta.gloss, y: y, h: bandH });
      y += bandH;
    });

    return {
      world: { width: REPO_WORLD_WIDTH, height: y + REPO_MARGIN },
      tiers: tierLayout,
      modules: positions,
      imports: Array.isArray(repo.imports) ? repo.imports : []
    };
  }

  // ---------- behavior scale: frame assignment ----------
  // Concatenate every behavior's route.steps (fixture order) into one walk. First-appearance
  // rank in that walk decides both frame order and in-frame node order. When two frame
  // definitions share the same `file` (a legitimate fixture shape — e.g. an entry frame and an
  // exit/"caller boundary" frame both living in run.py), a per-file slot pointer advances each
  // time the walk *returns* to that file after visiting a different one, so nodes cluster into
  // the correct same-file frame in narrative order. Nodes that never appear in any route are
  // placed afterward, matched to the same-file frame whose already-assigned nodes have the
  // nearest start line (falls back to the first same-file frame when no line signal exists).
  function buildWalkOrder(behaviors) {
    const order = [];
    (behaviors || []).forEach((b) => {
      const steps = (b && b.route && b.route.steps) || [];
      steps.forEach((id) => order.push(id));
    });
    return order;
  }

  function firstAppearanceRank(walk) {
    const rank = new Map();
    walk.forEach((id, i) => {
      if (!rank.has(id)) rank.set(id, i);
    });
    return rank;
  }

  function assignFrames(graph, behaviors) {
    const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const frameDefs = (Array.isArray(graph.frames) ? graph.frames : []).map((f) => ({ ...f }));

    const walk = buildWalkOrder(behaviors);
    const rank = firstAppearanceRank(walk);

    // Auto-derive a trailing frame for any file with no explicit frame entry, ordered by first
    // appearance across the walk, then fixture order for files the walk never touches.
    const filesWithFrame = new Set(frameDefs.map((f) => f.file));
    const seenFiles = new Set();
    const fileFirstSeen = [];
    walk.forEach((id) => {
      const n = nodeById.get(id);
      if (n && !seenFiles.has(n.file)) {
        seenFiles.add(n.file);
        fileFirstSeen.push(n.file);
      }
    });
    nodes.forEach((n) => {
      if (!seenFiles.has(n.file)) {
        seenFiles.add(n.file);
        fileFirstSeen.push(n.file);
      }
    });
    fileFirstSeen.forEach((file) => {
      if (!filesWithFrame.has(file)) {
        const parts = file.split("/").filter(Boolean);
        const label = parts.length ? parts[parts.length - 1] : file;
        frameDefs.push({ file, label, gloss: "" });
        filesWithFrame.add(file);
      }
    });

    const slotsByFile = new Map();
    frameDefs.forEach((f, i) => {
      if (!slotsByFile.has(f.file)) slotsByFile.set(f.file, []);
      slotsByFile.get(f.file).push(i);
    });

    // Pass 1: walk-order assignment with per-file slot advance on same-file "return".
    const assigned = new Map(); // nodeId -> frameIndex
    const pointer = new Map(); // file -> slot index into slotsByFile[file]
    let lastFile = null;
    walk.forEach((id) => {
      const n = nodeById.get(id);
      if (!n) return;
      const slots = slotsByFile.get(n.file);
      if (!slots || !slots.length) return;
      if (n.file !== lastFile) {
        if (!pointer.has(n.file)) pointer.set(n.file, 0);
        else pointer.set(n.file, Math.min(slots.length - 1, pointer.get(n.file) + 1));
      }
      if (!assigned.has(id)) assigned.set(id, slots[pointer.get(n.file) || 0]);
      lastFile = n.file;
    });

    // Pass 2: leftover nodes (never on any route) — nearest-line match among same-file frames.
    const frameAnchorLines = new Map(); // frameIndex -> [startLine, ...]
    assigned.forEach((frameIdx, id) => {
      const n = nodeById.get(id);
      const start = firstLine(n.lines);
      if (!Number.isNaN(start)) {
        if (!frameAnchorLines.has(frameIdx)) frameAnchorLines.set(frameIdx, []);
        frameAnchorLines.get(frameIdx).push(start);
      }
    });
    nodes.forEach((n) => {
      if (assigned.has(n.id)) return;
      const slots = slotsByFile.get(n.file);
      if (!slots || !slots.length) return;
      if (slots.length === 1) {
        assigned.set(n.id, slots[0]);
        return;
      }
      const start = firstLine(n.lines);
      let best = slots[0];
      let bestDist = Infinity;
      slots.forEach((idx) => {
        const anchors = frameAnchorLines.get(idx);
        if (!anchors || !anchors.length || Number.isNaN(start)) return;
        const dist = Math.min.apply(
          null,
          anchors.map((a) => Math.abs(a - start))
        );
        if (dist < bestDist) {
          bestDist = dist;
          best = idx;
        }
      });
      assigned.set(n.id, best);
      if (!Number.isNaN(start)) {
        if (!frameAnchorLines.has(best)) frameAnchorLines.set(best, []);
        frameAnchorLines.get(best).push(start);
      }
    });

    // Frame order: rank of a frame = earliest walk-rank among its assigned nodes.
    const frameFirstRank = new Map();
    assigned.forEach((frameIdx, id) => {
      const r = rank.has(id) ? rank.get(id) : Infinity;
      if (!frameFirstRank.has(frameIdx) || r < frameFirstRank.get(frameIdx)) frameFirstRank.set(frameIdx, r);
    });
    const orderedFrameIdx = frameDefs
      .map((_, i) => i)
      .filter((i) => (nodes.some((n) => assigned.get(n.id) === i))) // drop frames nobody landed in
      .sort((a, b) => {
        const ra = frameFirstRank.has(a) ? frameFirstRank.get(a) : Infinity;
        const rb = frameFirstRank.has(b) ? frameFirstRank.get(b) : Infinity;
        if (ra !== rb) return ra - rb;
        return a - b;
      });

    // In-frame node order: route first-appearance, fallback fixture order.
    const fixtureIndex = new Map(nodes.map((n, i) => [n.id, i]));
    const nodesByFrame = new Map();
    assigned.forEach((frameIdx, id) => {
      if (!nodesByFrame.has(frameIdx)) nodesByFrame.set(frameIdx, []);
      nodesByFrame.get(frameIdx).push(id);
    });
    nodesByFrame.forEach((list) =>
      list.sort((a, b) => {
        const ra = rank.has(a) ? rank.get(a) : Infinity;
        const rb = rank.has(b) ? rank.get(b) : Infinity;
        if (ra !== rb) return ra - rb;
        return fixtureIndex.get(a) - fixtureIndex.get(b);
      })
    );

    return { frameDefs, orderedFrameIdx, nodesByFrame };
  }

  function computeBehaviorLayout(graph, behaviors) {
    graph = graph || {};
    const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    if (!nodes.length) {
      return { world: { width: 480, height: 320 }, frames: [], nodes: {} };
    }

    const { frameDefs, orderedFrameIdx, nodesByFrame } = assignFrames(graph, behaviors);

    let x = FRAME_LEFT_MARGIN;
    let maxHeight = 0;
    const frameLayout = [];
    const nodePositions = {};

    orderedFrameIdx.forEach((frameIdx) => {
      const ids = nodesByFrame.get(frameIdx) || [];
      const cols = ids.length >= 2 ? 2 : 1;
      const rows = Math.max(1, Math.ceil(ids.length / cols));
      const width = FRAME_PAD * 2 + cols * CELL_W - (CELL_W - CARD_W);
      const height = FRAME_HEADER + FRAME_PAD + rows * CELL_H - (CELL_H - CARD_H);

      ids.forEach((id, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        nodePositions[id] = {
          x: x + FRAME_PAD + col * CELL_W,
          y: FRAME_TOP_MARGIN + FRAME_HEADER + row * CELL_H,
          w: CARD_W,
          h: CARD_H,
          frameIndex: frameIdx
        };
      });

      const def = frameDefs[frameIdx];
      frameLayout.push({ file: def.file, label: def.label, gloss: def.gloss || "", x: x, y: FRAME_TOP_MARGIN, w: width, h: height });
      maxHeight = Math.max(maxHeight, height);
      x += width + FRAME_GAP;
    });

    return {
      world: { width: Math.max(480, x - FRAME_GAP + FRAME_LEFT_MARGIN), height: FRAME_TOP_MARGIN + maxHeight + FRAME_TOP_MARGIN },
      frames: frameLayout,
      nodes: nodePositions
    };
  }

  // ---------- shared: cubic-bezier edge routing between two rects ----------
  // Ported from the two-scale-grammar mockup's edgePath — picks the dominant axis, exits/enters
  // the rect edge, and bends proportionally to distance.
  function edgePath(a, b) {
    const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
    const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    const dx = bc.x - ac.x;
    const dy = bc.y - ac.y;
    if (Math.abs(dy) >= Math.abs(dx)) {
      const sy = dy >= 0 ? 1 : -1;
      const from = { x: ac.x, y: sy > 0 ? a.y + a.h : a.y };
      const to = { x: bc.x, y: sy > 0 ? b.y : b.y + b.h };
      const bend = Math.max(36, Math.abs(to.y - from.y) * 0.45);
      return {
        d: `M ${from.x} ${from.y} C ${from.x} ${from.y + sy * bend}, ${to.x} ${to.y - sy * bend}, ${to.x} ${to.y}`,
        mx: (from.x + to.x) / 2,
        my: (from.y + to.y) / 2
      };
    }
    const sx = dx >= 0 ? 1 : -1;
    const from = { x: sx > 0 ? a.x + a.w : a.x, y: ac.y };
    const to = { x: sx > 0 ? b.x : b.x + b.w, y: bc.y };
    const bend = Math.max(36, Math.abs(to.x - from.x) * 0.45);
    return {
      d: `M ${from.x} ${from.y} C ${from.x + sx * bend} ${from.y}, ${to.x - sx * bend} ${to.y}, ${to.x} ${to.y}`,
      mx: (from.x + to.x) / 2,
      my: (from.y + to.y) / 2 - 8
    };
  }

  return { computeRepoLayout, computeBehaviorLayout, edgePath, firstLine };
});

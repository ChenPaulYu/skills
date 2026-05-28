# Visual & interaction spec — `docs/codebase-map/index.html`

> The form the map should take. Load this reference into context when rendering or regenerating the HTML map. Optimized for warm + readable + bilingual + interactive, on the smallest possible self-contained footprint.

## Hard constraints

1. **Single self-contained HTML file**. No external CDN, no build step. Works offline. All CSS + JS inline.
2. **One asset folder**: `docs/codebase-map/img/` for screenshots. Relative paths only.
3. **Lives at `docs/codebase-map/index.html`** (not at repo root or `docs/`).
4. **HTML comment at line 2** (after `<!doctype html>`) carries the grounding-audit block — see §11.

## File layout

```
docs/codebase-map/
├── index.html         (the map; single file)
└── img/               (optional screenshots, referenced from index.html)
    ├── hero-*.png
    ├── anatomy-*.png
    └── ...
```

## §1 — Document skeleton

```html
<!doctype html>
<!-- [grounding-audit block, see §11] -->
<html lang="en">           <!-- changed to zh-Hant by lang toggle -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>...</title>
  <style>[inline CSS — see §2-3]</style>
</head>
<body>
  <div class="layout">
    <nav class="side">[sidebar — see §4]</nav>
    <main>
      [tour]            <!-- §5 -->
      [architecture]    <!-- §6 -->
      [codebase-map]    <!-- §7 -->
      [design-rules]    <!-- §8 -->
      [module-map]      <!-- §9 -->
      [anatomies-index] <!-- §10a -->
      [anatomy × N]     <!-- §10b -->
      [conventions]
    </main>
  </div>
  <script>[inline JS — see §12-14]</script>
</body>
</html>
```

## §2 — Color palette (CSS custom properties)

Warm taupe + caramel base + jewel accents. Use these unless the project has a strong existing palette.

```css
:root{
  --bg:#f7f4ec;       /* page background — warm off-white */
  --panel:#fffdf8;    /* cards / panels — slightly brighter */
  --ink:#2a211c;      /* primary text — warm near-black */
  --muted:#8a7d6e;    /* secondary text */
  --line:#e7e0d2;     /* borders — soft */
  --accent:#10b981;   /* primary accent — emerald (callouts, active nav) */
  --caramel:#b5894e;  /* section headings, layer-ui */
  --rose:#f43f5e;     /* attention / hop links */
  --foundation:#6c8fb5;  /* layer color: foundation = blue */
  --state:#7a9e6e;       /* layer color: state = green */
  --ui:#b5894e;          /* layer color: ui = caramel (= --caramel) */
  --radius:14px;
  --mono:'SF Mono',ui-monospace,'JetBrains Mono',Menlo,monospace;
  --sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang TC','Microsoft JhengHei',sans-serif;
}
```

The CJK fallbacks in `--sans` matter for bilingual support — without them zh characters fall back unstyled.

## §3 — Layout grid

```css
.layout{ display:grid; grid-template-columns:240px 1fr; max-width:1240px; margin:0 auto; }
nav.side{ position:sticky; top:0; height:100vh; padding:24px 18px; border-right:1px solid var(--line); overflow:auto; }
main{ padding:36px 44px 120px; min-width:0; }
section{ margin-bottom:60px; scroll-margin-top:24px; }

@media(max-width:980px){
  .layout{ grid-template-columns:1fr; }
  nav.side{ position:static; height:auto; border-right:none; border-bottom:1px solid var(--line); }
}
```

## §4 — Sidebar

Structure:
- **Brand row**: dot + project name + language toggle button group
- **Sub-description** (one line, muted)
- **Top-level nav links** (tour, architecture, codebase map, design rules, module map)
- **`ANATOMIES` subhead** with dashed top border + indented links to each anatomy
- **Conventions** link
- **Meta block** at bottom: "generated from `<path>`" + "Updated `<date>`" in caramel

Subhead CSS:
```css
nav.side .subhead{
  font-size:10px; text-transform:uppercase; letter-spacing:.12em;
  color:var(--caramel); font-weight:700;
  margin:18px 10px 4px; padding-top:14px;
  border-top:1px dashed var(--line);
}
nav.side a.indent{ padding-left:22px; }
nav.side a.active{ background:#10b9811a; color:#0c7a59; }
```

Language toggle (top-right of sidebar):
```html
<div class="lang-toggle">
  <button class="lang-btn active" data-lang="en">EN</button>
  <button class="lang-btn" data-lang="zh">中</button>
</div>
```
- 2 pills, active one has `--ink` background + white text
- Click → `setLang()` (see §13)
- Persisted to `localStorage['codebase-map-lang']`

Scrollspy: as user scrolls main content, sidebar link for current section gets `.active` class.

## §5 — Tour section

```html
<section id="tour">
  <h1>[Project name] — codebase map</h1>
  <p class="lede">[1-2 sentences: what is this project, written for a fresh reader]</p>
  <figure class="shot"><img src="img/hero-*.png"><figcaption>[caption]</figcaption></figure>
  <div class="callout"><b>How to read this:</b> [progressive-disclosure instructions]</div>
  <div class="layers" id="layers"></div>   <!-- rendered from LAYERS data (§12) -->
  <p class="small muted">[stack note: e.g. "Frontend: React 19 · Vite 7 · ..."]</p>
</section>
```

The `.layers` block: 3 cards stacked, one per architectural layer (UI / state / foundation). Each has colored left border matching the layer, layer name + tag, and a row of domain chips. Click → scroll to module map + open the relevant domain.

## §6 — Architecture diagram (CSS, not ASCII)

3 boxes stacked top-to-bottom, with connector rows between them showing what flows between layers.

```css
.archdiag{ display:flex; flex-direction:column; gap:4px; }
.archlayer{ position:relative; background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:13px 18px 13px 22px; }
.archlayer::before{ content:''; position:absolute; left:0; top:0; bottom:0; width:5px; }
.archlayer.foundation::before{ background:var(--foundation); }
.archlayer.state::before{ background:var(--state); }
.archlayer.ui::before{ background:var(--ui); }
.archlayer .alabel{ font-size:10.5px; text-transform:uppercase; letter-spacing:.12em; font-weight:700; color:var(--caramel); margin-bottom:8px; }
.archlayer .achips{ display:flex; flex-wrap:wrap; gap:5px; }
.archlayer .achips .chip{ font-family:var(--mono); font-size:11.5px; background:var(--bg); border:1px solid var(--line); padding:2px 8px; border-radius:7px; }
.archlayer .adesc{ font-size:13px; line-height:1.55; }
.archlayer .adesc code{ background:#00000008; padding:0 4px; border-radius:3px; }
.archconn{ display:flex; gap:24px; padding:2px 24px 2px 26px; font-size:11.5px; color:var(--muted); }
.archconn .arrow{ color:var(--caramel); font-weight:700; }
```

Data-driven from an `ARCH_LAYERS` array + `ARCH_CONN` (between-layer connectors). Order: UI on top, state in middle, foundation at bottom (mirrors visual hierarchy).

## §7 — Codebase map (master graph)

Interactive SVG: one node per domain, colored by layer. Edges are real cross-domain imports. Click → side panel; nodes draggable.

```html
<section id="codebase">
  <h2>Codebase map — every domain at a glance</h2>
  <p class="lede">[explain: each box is a domain, arrows are real imports]</p>
  <div class="graphwrap">
    <svg class="graph" id="cbGraph" viewBox="0 0 760 320"></svg>
    <div class="panel" id="cbPanel"></div>
  </div>
  <div class="callout"><b>How to read direction:</b> [arrows go consumer → consumed]</div>
</section>
```

Nodes data:
```js
{
  id:'audio',                       // string id (matches grep target)
  kind:'view',                      // for color (see KIND_COLOR §15)
  x:20, y:18, w:110,                // SVG position
  link:'audio-anatomy',             // optional — adds "→ View anatomy" hop in panel
  role:{ en:'...', zh:'...' },      // bilingual
  desc:{ en:'...', zh:'...' },
}
```

Layout: 3 rows (UI domains top, app middle, core bottom) — mirror the architecture diagram.

## §8 — Design rules

```html
<section id="rules">
  <h2>Design rules — the bar every module clears</h2>
  <p class="lede">[explain: these are the criteria the rest is judged against]</p>
  <div class="rules" id="rules"></div>
</section>
```

The `.rules` block: 2-column grid (1-col on mobile) of rule cards. Each card has a numbered badge + bold name + 1-2 line description. Use the 11 deep-module rules unless the project has documented its own set.

```css
.rules{ display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.rule{ border:1px solid var(--line); border-radius:12px; background:var(--panel); padding:13px 15px; display:flex; gap:11px; }
.rule .n{ flex:0 0 26px; height:26px; border-radius:8px; background:#10b9811a; color:#0c7a59; font-weight:800; display:flex; align-items:center; justify-content:center; }
```

## §9 — Module map (searchable accordion)

Search box + collapsible domain panels:

```html
<section id="map">
  <h2>Module map — search & expand</h2>
  <p class="lede">[explain: ★ = read-first]</p>
  <div class="toolbar">
    <input id="q" placeholder="Filter modules & files…">
    <span class="count" id="count"></span>
  </div>
  <div id="domains"></div>     <!-- rendered from DOMAINS data §12 -->
</section>
```

Each domain renders as `<details class="dom">` with:
- Summary row: caret + domain name + path (mono) + small layer-color dot at the right
- Body: domain blurb + list of `.file` rows
- File row: `[filename (mono)] [LOC (tabular nums)] [one-line role]` — ★ prefix flags load-bearing

Search: filter rows + auto-open matching domains in real time. Update `.count` text.

## §10 — Anatomies

### §10a — Overview (entry cards)

Before the per-anatomy sections, an overview grid of mini-cards (one per anatomy):

```html
<section id="anatomies-overview">
  <h2>Anatomies — N worked examples</h2>
  <p class="lede">[explain: each structurally-rich domain gets its own anatomy]</p>
  <div class="anat-grid" id="anatGrid"></div>
  <p class="small muted">Why these N? [explain curation; thin domains stay in module map; rule ⑥]</p>
</section>
```

Cards: 2-col grid, each with layer chip + name (mono) + 1-line blurb + "→" jump link. Colored left border per layer. Hover lift.

### §10b — Per-anatomy section

```html
<section id="<domain>-anatomy">
  <h2>
    <span class="layer-chip <layer>">layer-name</span>
    <span>[domain] anatomy — [tagline]</span>
  </h2>
  <p class="lede">[1-2 paragraphs: what the domain does, key pattern, why this shape]</p>
  <figure class="shot"><img src="img/anatomy-*.png"><figcaption>...</figcaption></figure>  <!-- optional -->
  <div class="graphwrap">
    <svg class="graph" id="<X>Graph" viewBox="0 0 W H"></svg>
    <div class="panel" id="<X>Panel"></div>
  </div>
  <div class="callout">[design point worth teaching]</div>
</section>
```

Layer chip styling:
```css
.layer-chip{ display:inline-block; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; padding:2px 8px; border-radius:5px; color:#fff; margin-right:8px; font-weight:700; vertical-align:2px; }
.layer-chip.foundation{ background:var(--foundation); }
.layer-chip.state{ background:var(--state); }
.layer-chip.ui{ background:var(--ui); }
```

## §11 — Grounding audit block

At the top of the file (line 2, just after `<!doctype html>`):

```html
<!--
═══════════════════════════════════════════════════════════════════════════
  CODEBASE MAP · GROUNDING AUDIT
  Last audit: <ISO date>
═══════════════════════════════════════════════════════════════════════════

  This file is generated commentary — the codebase is the source of truth.
  Every factual claim below was checked against <source-root> on the audit
  date. Drift will happen as code evolves; re-audit when content stales.

  ✓ VERIFIED (mechanically grep'd against the source)
    • <category>: <what was verified>

  ⚠ FIXED in this revision (inaccuracies caught during audit)
    1. <what was wrong → how it's fixed>

  ⚖ JUDGMENT (not mechanically verifiable — interpretation)
    • <judgment call vs fact>

  TO RE-AUDIT
    • <how to re-verify each category>
═══════════════════════════════════════════════════════════════════════════
-->
```

**Stale audit block = lie.** Every regenerate updates this — date + what changed.

## §12 — Data-driven content (i18n-ready arrays)

Inline `<script>` defines data arrays. All translatable strings are objects `{en:'...', zh:'...'}`. Helper `tt(obj) → obj[lang]` resolves at render.

Required arrays:
- `LAYERS` — the 3 architectural layers (foundation/state/ui), each with name + tag + member domains
- `RULES` — the design rules (typically 11 for deep-module projects)
- `DOMAINS` — every source domain, with blurb + file list (each file: `[name, loc, {en, zh}]`)
- `CB_NODES` + `CB_EDGES` — master codebase map graph data
- `ANATOMIES_INDEX` — entries for the overview cards (anchor + layer + name + blurb)
- One `*_NODES` + `*_EDGES` pair per anatomy section
- `CONV` — conventions list (label + desc)
- `ARCH_LAYERS` + `ARCH_CONN` — for the architecture diagram

## §13 — i18n implementation (REQUIRED — bilingual EN + zh-Hant by default)

**Bilingual is not optional.** Every map ships with EN + zh-Hant by default; the language toggle (`EN | 中`) lives at the top-right of the sidebar. Reasoning: if you skip i18n in v1, retrofitting it later costs much more than baking it in now (every static string has to be tracked down and converted).

If the user explicitly asks for a different language pair (EN + Japanese, etc.) or insists on monolingual, follow that. But the default IS bilingual — implement the dictionary + toggle even if zh strings are initially placeholder/AI-translated.

```js
const T = {
  en: { /* all static UI strings keyed: nav_tour, tour_title, tour_lede, ... */ },
  zh: { /* same keys, translated */ }
};
let lang = localStorage.getItem('codebase-map-lang') || 'en';
const tt = o => (o && typeof o === 'object' && o.en !== undefined) ? o[lang] : o;

function setLang(L){
  lang = L;
  localStorage.setItem('codebase-map-lang', L);
  document.documentElement.lang = (L === 'zh' ? 'zh-Hant' : 'en');
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === L));
  // update all elements with data-t attribute
  document.querySelectorAll('[data-t]').forEach(el => {
    const k = el.dataset.t;
    if (T[lang][k] !== undefined) el.innerHTML = T[lang][k];
  });
  document.querySelectorAll('[data-t-placeholder]').forEach(el => {
    const k = el.dataset.tPlaceholder;
    if (T[lang][k] !== undefined) el.placeholder = T[lang][k];
  });
  render();   // re-render dynamic sections (layers, rules, domains, anatomies)
}
```

Any static text that should switch language uses `<span data-t="key">English fallback</span>`.

## §14 — `renderAnatomy()` — shared graph renderer

ONE function renders every anatomy graph (codebase map + per-domain anatomies). Takes node + edge data + a panel selector + a default-state config.

```js
const NS = 'http://www.w3.org/2000/svg';
const KIND_COLOR = { orchestrator:'#2a211c', store:'#7a9e6e', hook:'#6c8fb5', view:'#b5894e', shared:'#cfc6b5' };

function renderAnatomy(svgSel, panelSel, nodes, edges, defaultPanelKey, legendItems){
  const g = document.querySelector(svgSel); g.innerHTML='';
  const byId = Object.fromEntries(nodes.filter(n => !n.hidden).map(n => [n.id, n]));

  // 1. Render edges (lines) — track per-node for drag updates
  const edgesByNode = new Map();
  edges.forEach(([a, b]) => {
    const A = byId[a], B = byId[b]; if (!A || !B) return;
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', A.x + A.w/2); line.setAttribute('y1', A.y + 34);
    line.setAttribute('x2', B.x + B.w/2); line.setAttribute('y2', B.y);
    line.setAttribute('stroke', '#d8cfbe'); line.setAttribute('stroke-width', '1.4');
    g.appendChild(line);
    [a, b].forEach(id => {
      if (!edgesByNode.has(id)) edgesByNode.set(id, []);
      edgesByNode.get(id).push({ line, a, b });
    });
  });

  // 2. Render nodes (rect + texts + color dot) with click + drag handlers
  nodes.filter(n => !n.hidden).forEach(n => {
    const grp = document.createElementNS(NS, 'g'); grp.setAttribute('class', 'node');
    // ...rect, text(name), text(role, smaller), small color dot at top-right corner...
    // grp.onclick → showPanel(n) — but only if drag didn't move >2px
    // pointerdown/move/up → drag with viewBox-scaled deltas; refresh attached edges
    g.appendChild(grp);
  });

  // 3. Default panel state with legend
  document.querySelector(panelSel).innerHTML = `<h3>${T[lang][defaultPanelKey+'_h3']}</h3>...<div class="legend">${legendHtml}</div>`;
}
```

### Drag implementation (key details)

- `pointerdown` on node: capture pointer, record start position + node original x/y
- `pointermove`: compute delta in SVG units (`(client_delta) / (svg_client_width / viewBox_width)`); update node x/y + redraw connected edges via `edgesByNode.get(id)`
- `pointerup`: release capture; if delta < 2px → treat as click (open panel); else swallow click
- CSS: `.node { cursor: grab; touch-action: none }` `.node.dragging { cursor: grabbing }`

### Click panel content

When a node is clicked:
```html
<h3>{node.id}</h3>
<div class="k">role</div><p>{tt(node.desc)}</p>
<div class="k">wires</div><p class="muted">{edges-where-this-is-source}</p>
<div class="k">used by</div><p class="muted">{edges-where-this-is-target}</p>
{optional hop link: <a class="hop" href="#anatomy">→ View anatomy</a>}
```

## §15 — Node kinds + colors

Use kind to drive color (allows rich visual semantics per anatomy):

| kind | color | typical meaning |
|---|---|---|
| `orchestrator` | `#2a211c` (ink) | the central coordinating module |
| `store` | `#7a9e6e` (green) | state container, wide-surface store |
| `hook` | `#6c8fb5` (blue) | gestures, lifecycle, queries — composable behavior |
| `view` | `#b5894e` (caramel) | rendered UI piece |
| `shared` | `#cfc6b5` (tan) | utilities, constants, glyphs |

Each anatomy passes its own `legendItems` array to `renderAnatomy()` so the legend matches what kinds are actually used in that graph.

## §16 — Drag-hint UX

In the default panel state, include a small italic hint near the legend:

> 💡 Drag any node to rearrange · the lines follow.

This tells users the graph is interactive (without a noisy modal or tutorial).

## §17 — Screenshots

If a dev server can run (e.g., `pnpm dev`), use `agent-browser` to capture 1-3 screenshots and embed via `<figure class="shot"><img></figure>`. Else skip — the map works without them.

Save to `docs/codebase-map/img/`. Reference via relative path. Useful shots:
- Hero: the main view (full app / dashboard / home)
- Per-anatomy: a close-up of what the subsystem renders

Style:
```css
figure.shot{ margin:14px 0 4px; display:flex; flex-direction:column; gap:6px; }
figure.shot img{ display:block; max-width:100%; border-radius:14px; border:1px solid var(--line); box-shadow:0 14px 36px -22px rgba(42,33,28,.35); background:var(--bg); }
figure.shot img.tight{ max-width:380px; }  /* for close-ups */
figure.shot figcaption{ font-size:12px; color:var(--muted); }
```

## §18 — Final check before declaring done

Open in a real browser (via `agent-browser`) and verify:
- All graphs render with correct node + edge counts
- Click panels work
- Drag works (move a node, see edges follow)
- Lang toggle works (if bilingual)
- Zero console errors
- Audit block is at top with today's date
- Screenshots load (if included)

If any fails → fix and re-verify before reporting back to user.

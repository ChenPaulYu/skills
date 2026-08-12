# Engine — map-render (repo-level navigability)

> The render procedure for `/nav:sync`’s map leg (formerly the standalone `/nav:map`, folded back per ADR-108). Produce a self-contained, interactive codebase map at `docs/codebase-map/index.html` — the "one door" to navigate a codebase top-down. Each domain gets a one-line description; structurally-rich domains get their own anatomy (a click-to-reveal SVG graph). Every claim is grounded against source; a visible audit block records what was verified vs guessed.

## What this phase produces

A new reader (human or agent) shouldn't have to read 80 files to understand a repo. The map is the **progressive disclosure entry point** — two layers deep:
1. The architecture (what is this? + 3 layers, domain-by-domain — opens with the 1-2 sentence project lede; the former standalone Tour card-stack is retired, see visual-spec §5)
2. Anatomies (per-subsystem deep dives, click-to-reveal)

This render is also the **dogfood test** for rule ⑧ — if you struggle to describe a domain while writing the map, that struggle gets recorded in the audit block. Stale audit block is treated as a lie, same as a stale file header. Because `/nav:sync` maintains the file-top headers, the map can read each file's `head -12` header instead of re-deriving its role — run `/nav:sync` first when headers may be stale.

## Scope

**Language-agnostic.** The HTML renderer is generic; the source-scanning works on any stack. Domain detection (top-level folders), anatomy identification (rich subsystems), and cross-domain edges (imports) are all universal concepts — only the syntax of "imports" varies (`import ...` / `from ... import` / `use ...` / `package ...`).

Outputs a single self-contained HTML file that renders standalone (no build step). Visual / interaction spec: see [`plugins/nav/skills/sync/references/visual-spec.md`](plugins/nav/skills/sync/references/visual-spec.md). Read that before rendering — it's the source of truth for layout, colors, sidebar grouping, anatomy patterns, interactions (click panel, drag, lang toggle), and the audit block format.

## Generation process

### Step 1 — Inventory + stack check

```bash
test -f package.json && grep -E '"react"|"react-dom"' package.json
find src -type d -maxdepth 2 -not -path '*/node_modules/*' | head -20
find src -type f \( -name '*.ts' -o -name '*.tsx' \) -not -path '*/__tests__/*' | xargs wc -l
```

Note: source root (`src/`, `app/`, `frontend/src/`), domain folders, file inventory + LOC per file.

### Step 2 — Domain inventory + cross-domain edges

For each top-level folder under the source root: a domain. Capture:
- File count, total LOC
- Leader file(s) (largest / most-imported / name-matches-domain)
- Layer (foundation / state / ui — infer from depth & dependencies)

Real cross-domain dependencies (the master codebase map):
```bash
# For each domain pair, count imports from one into another
grep -rE "from '[^']*<other-domain>/" src/<one-domain> | wc -l
```
Only include edges that correspond to **real imports**. No fabricated edges.

### Step 3 — Identify anatomies

A domain earns an anatomy when it has **non-trivial internal structure** worth a graph:
- Has a clear orchestrator + 5+ collaborating modules, OR
- Implements a notable pattern (facade, store, hierarchical types), OR
- Is the load-bearing core a new reader must understand

Thin domains (1-2 files, or a flat list of similar primitives) do NOT get an anatomy — they get a Module-map row. **Per rule ④, don't force structure where there isn't any.**

For each anatomy: enumerate nodes (modules/types/hooks), edges (real relationships), and a one-paragraph callout (the design point worth teaching).

### Step 4 — Self-eval (rule ⑧) — keep a struggle log

While writing each domain/anatomy/file description, track honestly when you struggle:
- Had to enumerate multiple responsibilities → flag it
- Had to footnote an exception → flag it
- Had to **guess** because top-of-file didn't reveal purpose → flag it (rule ① broken — this file needs a header → hand to `/nav:sync`)
- Had to write > 3 sentences before feeling complete → flag it

The flagged files go into the audit block's "self-eval" section. **Honesty matters more than coverage.**

### Step 5 — Generate the HTML

Produce `docs/codebase-map/index.html` as a **single self-contained file** with:

- **Sidebar nav** with grouped sub-headings (e.g., "ANATOMIES" subhead + indented items)
- **Architecture** — opens the page: the 1-2 sentence project lede + stack note, then the 3-layer stacked diagram (foundation → state → ui) with cross-layer arrows + brief descriptions. (No standalone Tour section — retired, visual-spec §5.) **Light theme only** per visual-spec §2.
- **Design rules** — the 8 rules as cards (if the codebase has documented its own rules, use those; otherwise the deep-module set)
- **Module map** — searchable accordion of every domain + every file with one-line roles
- **Codebase map (master)** — interactive SVG graph: one node per domain, click for details
- **Anatomies** — one section per structurally-rich domain, each with: layer chip, lede, optional screenshot, interactive SVG graph, side panel with click-to-reveal, callouts
- **Anatomies overview** — index cards before the per-domain anatomies, with layer chip + one-liner + jump link
- **Conventions** — load-bearing project rules (from CLAUDE.md or equivalent)
- **Grounding audit block** — at the very top of the file as an HTML `<!-- -->` comment listing what was VERIFIED, what was FIXED in this revision, and what's JUDGMENT (not mechanically verifiable)

**Bilingual is required (EN + zh-Hant by default).** Every translatable string lives in a `T` dictionary with `{en: ..., zh: ...}` shape; every static UI element uses `<span data-t="key">` or `data-t-placeholder` for inputs. The sidebar has an `EN | 中` toggle that flips the language + persists to `localStorage['codebase-map-lang']`. See `references/visual-spec.md` 13 for the implementation pattern.

If the user explicitly requests a different language pair (e.g. EN + Japanese), use that — but **never ship monolingual** without explicit opt-out from the user. The bilingual scaffolding is cheap once it's there; removing it later is harder than adding it up front.

Interactive features (built once into the generic renderer):
- Click a node → side panel reveals role, "wires" (outbound edges), "used by" (inbound edges)
- Optional `link` field on a node → adds "→ View anatomy" hop in the panel
- Drag any node to rearrange (cursor: grab; threshold for drag vs click)
- Search box on the Module map filters files

### Step 6 — Embed screenshots (if dev server can run)

If the user has `pnpm dev` / `npm start`, run it in background, use `agent-browser` to capture 1-3 representative screenshots:
- Hero: the main view (full canvas / dashboard / home)
- Per-anatomy: a close-up of what that subsystem renders

Save to `docs/codebase-map/img/`. Embed via `<img>` with descriptive captions.

If no dev server / can't run / user opts out → skip; map works fine without screenshots.

### Step 7 — Verify in browser

Open the generated map in `agent-browser` to confirm:
- All graphs render (correct node + edge counts)
- Click panels work
- Drag works
- Language toggle works (EN ↔ zh-Hant) — `documentElement.lang` updates, `localStorage` persists, all `data-t` spans flip
- Zero console errors

### Step 8 — Write the grounding audit block

At the top of `index.html`, in an HTML comment, record:

```html
<!--
  CODEBASE MAP · GROUNDING AUDIT
  Last audit: <ISO date>

  ✓ VERIFIED — mechanically grep'd against the source
    • <category>: <what was verified>
  ⚠ FIXED in this revision (inaccuracies caught during audit)
    1. <what was wrong, how it's fixed>
  ⚖ JUDGMENT (not mechanically verifiable — interpretation)
    • <what's a judgment call vs a fact>
  TO RE-AUDIT
    • <how someone would re-verify each category>
-->
```

**Stale audit block = lie.** The block is updated on every regenerate.

## Output

- `docs/codebase-map/index.html` — the self-contained map
- `docs/codebase-map/img/*.png` — screenshots (optional)
- A chat summary: domains found, anatomies generated, audit findings (verified count + fixed count + judgment count), file size of the HTML, "open it with `open docs/codebase-map/index.html`"

## Discipline (do not skip)

- **Every claim grounded.** If you're not sure, mark it `(uncertain)` in the audit block rather than asserting it.
- **No fake edges.** Cross-domain arrows must correspond to real `import` statements. If unsure, grep before drawing.
- **No fake anatomies.** A domain with 2 files doesn't get an anatomy graph — that's structure-theatre. Use a Module-map row.
- **Self-eval is honest.** If you struggled to describe something, say so in the audit block. Don't smooth it over.
- **Stale audit block = lie.** Every regenerate updates the block (date + what changed).
- **No new files beyond `docs/codebase-map/`.** This skill writes its own folder, not the rest of the repo. Files that lack a `head -12` header are fixed by `/nav:sync`, not here.

## The 8 rules (the through-line of every nav skill)

1. **Deep modules through information hiding** — a simple interface hiding significant complexity. Red flag — **information leakage** (same knowledge in ≥2 modules), often from **temporal decomposition**. *The map is this rule applied to the repo: the interface to the whole codebase.* **Composition is the second half:** modules compose behind package façades into next-scale deep modules, and the map must render that real tree — its domains are a *reading* taxonomy, never a substitute for it. A flat namespace beside a maintained domain map is a named smell (the map doing the tree's job), and folder structure must never be derived FROM the map's domains — only from the measured import graph (docs/observations/2026-07-28-folders-encode-dependency-law-not-topics.md).
2. **Interface-first at every scale** — *the map's whole reason for being.* The repo's index/map surfaces the structure; you drill into a domain, then a file, only as needed.
3. **Explicit dependencies** — the cross-domain graph's edges are real `import` dependencies (consumer → consumed), never decorative.
4. **Right grain — neither giant nor fragmented** — don't draw a fake anatomy for a 2-file domain (use a Module-map row); don't force structure where there isn't any.
5. **Fit the framework** — the map describes idiomatic patterns; it doesn't invent an exotic taxonomy over them.
6. **Rearrange, don't rewrite** — refreshing a stale map updates the drifted facts; it doesn't re-author what's still true.
7. **Below 90% confidence → ask** — about scope, which domains are load-bearing, intent. Mark `(uncertain)` rather than asserting a fake edge.
8. **Agent-navigability is the audit** — *rendering the map IS the audit.* Every place you struggle to write a domain's or file's one-liner is a deep-module failure signal; it goes in the map's audit block (and usually means that file lacks a usable header → hand back to `/nav:sync`).


## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Re-derive every file's role from its body | Read the headers (`/nav:sync`) — the cheap grounding — and refresh them first if stale, rather than reopening every file. Tell: about to read a file's full body just to write one summary line. |
| Draw a fake anatomy for a 2-file domain | Use a Module-map row instead — rule ④, drawing a diagram for two files is structure-theatre. Tell: an anatomy box would contain only one arrow between two boxes. |
| Assert an import edge you didn't verify | Mark it `(uncertain)` unless it's a real, checked import — rule ③/⑦. Tell: you're drawing an edge because it "should" exist, not because you grepped for the import. |
| Ship the map monolingual | Ship bilingual (EN + zh-Hant) by default — removing it later is harder than including it now. Tell: about to publish a map with only one language filled in. |
| Regenerate the map on every code change | Save it for the periodic pass — that's the header leg's cadence, not the map's. Tell: reaching for the map leg right after a single small edit instead of after a batch of changes. |


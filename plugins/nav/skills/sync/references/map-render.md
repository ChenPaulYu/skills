# Engine — map-render (repo-level navigability)

> Phase B of `/nav:sync`. Produce a self-contained, interactive codebase map at `docs/codebase-map/index.html` — the "one door" to navigate a codebase top-down. Each domain gets a one-line description; structurally-rich domains get their own anatomy (a click-to-reveal SVG graph). Every claim is grounded against source; a visible audit block records what was verified vs guessed. (Also driven directly by `/nav:doctor` step 5, after the header gate.)

## What this phase produces

A new reader (human or agent) shouldn't have to read 80 files to understand a repo. The map is the **progressive disclosure entry point** — three layers deep:
1. The tour (what is this?)
2. The architecture (3 layers, domain-by-domain)
3. Anatomies (per-subsystem deep dives, click-to-reveal)

This phase is also the **dogfood test** for rule ⑧ — if you struggle to describe a domain while writing the map, that struggle gets recorded in the audit block. Stale audit block is treated as a lie, same as a stale file header. Because `/nav:sync` runs header-render first, the map phase can read each file's freshly-written `head -12` header instead of re-deriving its role.

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
- Had to **guess** because top-of-file didn't reveal purpose → flag it (rule ① broken — this file needs a header in the header-render phase)
- Had to write > 3 sentences before feeling complete → flag it

The flagged files go into the audit block's "self-eval" section. **Honesty matters more than coverage.**

### Step 5 — Generate the HTML

Produce `docs/codebase-map/index.html` as a **single self-contained file** with:

- **Sidebar nav** with grouped sub-headings (e.g., "ANATOMIES" subhead + indented items)
- **Tour** — what the project is, one paragraph, plus a hero screenshot if one exists or can be captured
- **Architecture** — 3-layer stacked diagram (foundation → state → ui) with cross-layer arrows + brief descriptions
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
- **No new files beyond `docs/codebase-map/`.** This phase writes its own folder, not the rest of the repo. Files that lack a `head -12` header are fixed by the header-render phase, not here.

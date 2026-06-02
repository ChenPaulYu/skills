---
name: sync
description: Re-sync a codebase's navigation layer to its current state so both agents and humans can navigate it after a change — runs ONE grounding pass, then refreshes file-top headers (per-file navigability) and the bilingual codebase map (repo-level navigability) together. Use whenever the user asks to "sync the codebase", "re-sync the nav docs / map after a code change", "update / regenerate the codebase map", "refresh / add / standardize file headers", "add skill-style headers", "make this codebase navigable", "make files self-describing", "onboard me to this repo", "show me a map of the code", or after restructuring when headers + map have drifted. Two phases (header-render · map-render) share the grounding pass; the header diff is shown/gated before the map phase reads the new headers. Writes file-top headers (any language) + docs/codebase-map/index.html.
---

# Deep-module sync

Keep a codebase's **navigation layer** in step with its code. One grounding pass over the source, then two renderers fall out of it: **file-top headers** (so `head -12` answers "what is this file?") and the **bilingual codebase map** (so one HTML answers "what is this repo?"). After `/nav:sync`, both an agent and a human can navigate the code without reading 80 files.

## Why this skill exists

Navigability has two scales — **per-file** (a header) and **per-repo** (a map) — and they are the same job at different zoom levels. They also share the expensive part: a grounded read of each load-bearing file's role + dependencies, verified against source, not guessed. Splitting that into two doors meant doing the read twice and remembering two commands; worse, regenerating the map is *itself the test* of whether the headers are any good (rule ⑧ — struggle-to-describe is the deep-module failure signal). So they collapse into **one door, one grounding pass, two renderers**:

- **header-render** (Phase A) — file-level navigability. See `references/header-render.md`.
- **map-render** (Phase B) — repo-level navigability. See `references/map-render.md` (+ `references/visual-spec.md`).

The engine stays two pieces deliberately: the header diff is gated *between* them (Phase A is reviewed before Phase B reads the new headers), and `/shape:reconcile` consumes only the header artifact (not the map). `sync` is the single front door; the two phases are how it grows (a future third renderer — deps graph, changelog — slots in under the same door).

## Scope

**Language-agnostic.** The header CONVENTION (title + 2-3 sentence detail + `Reads:` line) applies to any language with the syntax flexed per stack; the map renderer is generic HTML and the source-scan works on any stack. Both phases degrade gracefully on unknown stacks to universal checks + flag what was skipped.

This skill **writes**: file-top headers across the repo (Phase A) and `docs/codebase-map/index.html` (Phase B). Phase A shows a diff and is gated before Phase B runs.

## The 8 rules (the through-line of every nav skill)

1. **Deep modules through information hiding** — a simple interface hiding significant complexity; usable without reading the body. The technique is **information hiding**: encapsulate each design decision so it never surfaces in the interface; red flag — **information leakage** (same knowledge in ≥2 modules), often from **temporal decomposition** (boundaries by execution order, not knowledge). *sync is this rule applied to navigation: the header is a file's interface, the map is the repo's.*
2. **Interface-first at every scale** — *this skill's whole reason for being.* One door, surfaced progressively: a module's interface (header), a subsystem's barrel/facade, the whole codebase's index/map. Drill into bodies only as needed.
3. **Explicit dependencies** — functions deterministic; deps explicit. The header's `Reads:` line makes a file's dependencies explicit.
4. **Right grain — neither giant nor fragmented** — don't header thin files (Button / icons / tiny barrels); don't draw fake anatomies for 2-file domains. Don't force structure where there isn't any.
5. **Fit the framework** — standard doc-comment syntax per language; no exotic `@tag`s.
6. **Rearrange, don't rewrite** — restructuring an existing top comment into the convention preserves its substance; never paraphrase or shorten.
7. **Below 90% confidence → ask** — about scope, which files are load-bearing, intent.
8. **Agent-navigability is the audit** — *running the map phase IS the audit.* Every place you struggle to write a one-line description is a deep-module failure signal; it goes in the audit block (and usually means that file needs a header).

## Process

The flow is **one grounding pass, then two gated phases**. Phase A's diff is the gate before Phase B.

### Step 1 — Grounding pass (shared)

Reuse-via-transcript: if `/nav:audit` already ran against this scope earlier in the session, reuse its inventory. Otherwise establish it once:
- Detect stack + bound scope (whole repo / a domain / changed files).
- Domain inventory: top-level folders, file count + LOC, leader files, layer (foundation / state / ui).
- For each load-bearing file (leader / ≥150 LOC / barrel / user-named), `head -15` it to capture its current role + whether its top reveals its purpose.

This single read feeds **both** phases — don't re-scan per phase.

### Step 2 — Phase A: header-render (gated)

Follow `references/header-render.md` fully:
- Identify load-bearing files from the grounding pass (skip tests / icons / name-says-it-all primitives).
- Classify each (no header / wrong-format / already-good) and compose the header per the convention + language syntax.
- **Show the diff. Wait for user OK** (batch-OK fine if the user prefers; auto-apply only on explicit "just apply" intent). *This is the gate.*
- Apply, then run the stack's test gate — headers are comments, should stay green; if not, a header has a syntax error → revert + fix.
- If the project's CLAUDE.md lacks the header convention, offer to add it.

### Step 3 — Phase B: map-render

Follow `references/map-render.md` (+ `references/visual-spec.md`):
- Re-scan now that headers exist — the map reads each file's fresh `head -12` instead of re-deriving its role.
- Render `docs/codebase-map/index.html` (bilingual EN + zh-Hant by default; domains, anatomies, master graph, module map, conventions).
- Keep the rule-⑧ struggle log; any file you still had to guess at is a header gap to note.
- Optional: screenshots if a dev server runs; browser-verify the HTML.
- Write/refresh the grounding **audit block** at the top: ✓ VERIFIED · ⚠ FIXED this revision (which headers added/changed, what map sections changed) · ⚖ JUDGMENT.

### Step 4 — Test gate + report

Re-run the stack's test gate (still green — only comments + a docs HTML changed). Then summarize to chat:

```markdown
## Sync report — <ISO date>
- Headers: <N> files added/restructured/skipped (list)
- Map: regenerated at docs/codebase-map/index.html (domains, anatomies, audit findings)
- Audit block updated
- Verify: `head -12 <file>` · `open docs/codebase-map/index.html`
```

Do NOT commit unless the user asks. If on the default git branch, suggest branching first.

## Discipline (do not skip)

- **One grounding pass.** Both phases consume the same read — don't scan the repo twice.
- **Header diff is the gate.** Phase A is reviewed before Phase B reads the new headers. Headers are not refactors; the user sees them first.
- **Skip thin files explicitly + list them.** Document the deliberate omissions (rule ④).
- **Preserve substance.** Restructuring an existing top comment moves its content into the convention's shape — never paraphrase (rule ⑥).
- **Every map claim grounded.** No fake edges, no fake anatomies; mark `(uncertain)` rather than asserting. Stale audit block = lie.
- **Don't refactor while syncing.** If the grounding pass surfaces a structural smell (giant file, layer violation), *note it* — hand to `/nav:refactor` as a separate session. Don't absorb it.
- **Rule ⑦ applies.** Below 90% on scope / which files are load-bearing → ask.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Scan the repo separately for each phase | Defeats the point — one grounding pass feeds both |
| Skip the header diff, go straight to the map | Phase A mutates source; it must be reviewed before Phase B builds on it |
| Header every file uniformly | Rule ④ — Button/icons/barrels don't need them |
| Draw a fake anatomy for a 2-file domain | Structure-theatre — use a Module-map row |
| "While I'm here, let me also refactor X" | Refactors need narrow scope + their own discipline → `/nav:refactor` |
| Ship the map monolingual without opt-out | Bilingual (EN + zh-Hant) is the default; removing it later is harder |

## Companion skills

- **`/nav:audit`** — read-only health check; its inventory is reused as `sync`'s grounding pass when it ran earlier in the session.
- **`/nav:refactor`** — execute any structural move the grounding pass surfaces (separate session).
- **`/shape:reconcile`** — consumes the header artifact `sync` maintains (`head -12` = the cheapest "is this implemented?" signal).

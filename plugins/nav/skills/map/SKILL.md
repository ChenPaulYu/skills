---
name: map
model: sonnet
description: "Render or refresh the bilingual repo-level codebase map (docs/codebase-map/index.html) — domains, anatomies, the import graph, a module map — so a human or agent grasps the whole repo top-down without reading dozens of files. Fires on \"refresh the codebase map\" or \"create/open the architecture map\". For a conversational walkthrough or onboarding chat instead of a durable HTML render, use /nav:tour. Reads file-top headers (run /nav:sync first so they're current); the periodic, batched sibling of the per-change /nav:sync."
---

# Codebase map — repo-level navigability

Render the **bilingual codebase map** (`docs/codebase-map/index.html`) so one HTML answers "what *is* this repo?" — its domains, the anatomies of the structurally-rich ones, the cross-domain import graph, a searchable module map, and the conventions every module clears. This is the **per-repo** half of the navigation layer; its sibling `/nav:sync` maintains the **per-file** half (the headers this map reads).

> **Cost tier (ADR-059):** this skill declares `model: sonnet` in its frontmatter — rendering the map from already-maintained headers is mechanical, high-volume work, so it runs on the cheaper model for that turn; the session model resumes on the next prompt.

## Why this skill exists

A human onboarding to a repo, or an agent planning a change, needs the whole picture before the parts — but reading 80 files to get it is the cost the map removes. The map is a **teaching projection**: top-down, progressively disclosed (click a domain to drill in), grounded in the real code.

It runs on a **periodic, batched cadence** — you regenerate it after a *wave* of change, not every commit (that's the header sibling's job). That different cadence is exactly why it's a separate door from `/nav:sync` (ADR-029, superseding the ADR-019 merge): binding a heavy periodic render to the light per-change header sync forced one of them to be the wrong size. The map's cheapest grounding is the headers `sync` already wrote — so **run `/nav:sync` first** when headers may be stale; the map reads each file's `head -12` instead of re-deriving its role from the body.

See `references/map-render.md` (+ `references/visual-spec.md`) for the full render procedure + visual spec.

## Scope

**Language-agnostic.** The map renderer is generic HTML; the source-scan works on any stack and degrades gracefully on unknown ones, flagging what was skipped.

This skill **writes** `docs/codebase-map/index.html` (bilingual EN + zh-Hant by default).

## The 8 rules (the through-line of every nav skill)

1. **Deep modules through information hiding** — a simple interface hiding significant complexity. Red flag — **information leakage** (same knowledge in ≥2 modules), often from **temporal decomposition**. *The map is this rule applied to the repo: the interface to the whole codebase.*
2. **Interface-first at every scale** — *the map's whole reason for being.* The repo's index/map surfaces the structure; you drill into a domain, then a file, only as needed.
3. **Explicit dependencies** — the cross-domain graph's edges are real `import` dependencies (consumer → consumed), never decorative.
4. **Right grain — neither giant nor fragmented** — don't draw a fake anatomy for a 2-file domain (use a Module-map row); don't force structure where there isn't any.
5. **Fit the framework** — the map describes idiomatic patterns; it doesn't invent an exotic taxonomy over them.
6. **Rearrange, don't rewrite** — refreshing a stale map updates the drifted facts; it doesn't re-author what's still true.
7. **Below 90% confidence → ask** — about scope, which domains are load-bearing, intent. Mark `(uncertain)` rather than asserting a fake edge.
8. **Agent-navigability is the audit** — *rendering the map IS the audit.* Every place you struggle to write a domain's or file's one-liner is a deep-module failure signal; it goes in the map's audit block (and usually means that file lacks a usable header → hand back to `/nav:sync`).

## Process

### Step 1 — Grounding pass

Reuse-via-transcript: if `/nav:audit` or `/nav:sync` already grounded this scope earlier in the session, reuse that inventory. Otherwise establish it once:
- Detect stack + bound scope (whole repo by default).
- Domain inventory: top-level folders, file count + LOC, leader files, layer (foundation / state / ui).
- For each load-bearing file, read its `head -12` header (the cheapest signal — that's what `/nav:sync` maintains). If headers are missing/stale, say so and offer to run `/nav:sync` first; the map still works on grep alone, just less cheaply.

### Step 2 — Map-render

Follow `references/map-render.md` (+ `references/visual-spec.md`):
- Render `docs/codebase-map/index.html` (bilingual EN + zh-Hant by default; domains, anatomies, master graph, module map, conventions).
- Keep the rule-⑧ struggle log; any file you had to guess at is a header gap to note (→ `/nav:sync`).
- Browser-verify the HTML (open it; confirm zero JS errors, the lang toggle flips, nodes/sections render). Optional: screenshots if a dev server runs.
- Write/refresh the grounding **audit block** at the top: ✓ VERIFIED · ⚠ FIXED this revision (which map sections changed) · ⚖ JUDGMENT. A stale audit block is a lie.

### Step 3 — Report

```markdown
## Map render — <ISO date>
- Map: regenerated at docs/codebase-map/index.html (domains, anatomies, audit findings)
- Audit block updated
- Verify: `open docs/codebase-map/index.html`
```

Do NOT commit unless the user asks. If on the default git branch, suggest branching first.

## Discipline (do not skip)

- **Read headers, don't re-derive.** The map's cheap grounding is `head -12`; if headers are stale, run `/nav:sync` first rather than guessing roles from bodies.
- **Every map claim grounded.** No fake edges, no fake anatomies; mark `(uncertain)` rather than asserting. Stale audit block = lie.
- **Browser-verify before done.** A broken data array shows up as a console error; a monolingual map is a regression — bilingual is the default.
- **Don't refactor while mapping.** A structural smell the render surfaces gets *noted* (audit block) and handed to `/nav:refactor`, not fixed inline.
- **Rule ⑦ applies.** Below 90% on a domain's role / an edge → mark uncertain, don't fabricate.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Re-derive every file's role from its body | Read the headers (`/nav:sync`) — the cheap grounding — and refresh them first if stale, rather than reopening every file. Tell: about to read a file's full body just to write one summary line. |
| Draw a fake anatomy for a 2-file domain | Use a Module-map row instead — rule ④, drawing a diagram for two files is structure-theatre. Tell: an anatomy box would contain only one arrow between two boxes. |
| Assert an import edge you didn't verify | Mark it `(uncertain)` unless it's a real, checked import — rule ③/⑦. Tell: you're drawing an edge because it "should" exist, not because you grepped for the import. |
| Ship the map monolingual | Ship bilingual (EN + zh-Hant) by default — removing it later is harder than including it now. Tell: about to publish a map with only one language filled in. |
| Regenerate the map on every code change | Save it for the periodic pass — that's the header sibling `/nav:sync`'s cadence, not the map's. Tell: reaching for `/nav:map` right after a single small edit instead of after a batch of changes. |

## Companion skills

- **`/nav:sync`** — the sibling: maintains the file-top headers this map reads. Run it first when headers may be stale (the map's cheapest grounding); run `map` periodically, after a wave of change.
- **`/nav:audit`** — read-only health check; its inventory is reused as the grounding pass when it ran earlier in the session.
- **`/nav:refactor`** — execute any structural move the render surfaces (separate session).
- **`/nav:tour`** — the conversational sibling: consumes this map (when present) for an in-chat walkthrough and correction loop. It never writes or refreshes the map itself — a stale map surfaced mid-tour routes back here.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.

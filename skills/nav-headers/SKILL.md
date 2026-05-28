---
name: nav-headers
description: Add or standardize skill-style JSDoc headers on load-bearing TypeScript/React source files, so an agent can `head -12 <file>` to retrieve the file's role + key deps before reading the body. Use this skill whenever the user asks to "add file headers", "standardize file headers", "audit our docstrings", "make files self-describing", "add skill-style headers", or "make this codebase more progressive-disclosure". Also fires after creating multiple new load-bearing files (the user might want them headered uniformly). Shows a diff before applying; can also update CLAUDE.md with the convention if not present.
---

# Deep-module headers

Apply a uniform skill-style JSDoc header convention to load-bearing source files, so the first 8-12 lines of every important file answer "what is this, and what does it depend on?" without reading the body. This is rule ① + rule ② applied to source code.

## Why this skill exists

Most codebases have inconsistent file documentation — some files have rich doc comments, others have nothing, and the formats vary wildly. An agent (or new human reader) can't `head -12` to get a grounded summary; they have to read whole files to understand their purpose. The fix: a uniform convention, applied to every file that earns it.

The header pattern intentionally mirrors how Claude **skills** work — name + description as the "progressive disclosure first level." Files become greppable by purpose.

## Scope

- **Supported**: TypeScript / React (`.ts` / `.tsx`).
- **v2 / not yet supported**: other languages with different doc conventions.

If the codebase isn't TS/React → stop and explain.

## The 11 rules (especially ① and ⑪)

1. **Good interfaces** — *this skill is rule ① applied at file level.* The header IS the file's interface to a reader who hasn't opened it yet.
2. **Progressive disclosure** — the header is the index; the body is what you drill into if needed.
3. **No hidden params** — `Reads:` makes dependencies explicit.
4. **Future-ready foundation.**
5. **No giants.**
6. **No needless abstraction** — *important corollary:* don't header tiny files. Name-says-it-all files (Button.tsx, RailNavItem.tsx, icons, barrels < 5 lines) DO NOT need a header. Forcing headers on them is rule-⑥ violation.
7. **Fit the framework** — uses standard JSDoc, no exotic `@tag`s.
8. **Rearrange, don't rewrite** — for files with existing top comments: **restructure into the convention; preserve the substance.** Don't paraphrase or shorten — move the existing content into the new shape.
9. **Below 90% → ask.**
10. **Group + expose via one door.**
11. **Agent-navigability is the audit** — *this skill closes the gap rule ⑪ surfaces.* If the audit found "agent had to guess at file X's purpose because the top revealed nothing" → fixing it is this skill's job.

## The convention

Every load-bearing file's top 8-12 lines must match this template:

```ts
/**
 * <filename> — <one-line role> (★ optional — mark load-bearing).
 *
 * <2-3 sentence detail: what it does, the key pattern, why this shape>.
 *
 * Reads: <key dependencies, "·"-separated; keep to ≤ 6 most-important>
 */
```

**Three lines do the heavy lifting**:
- **Line 1**: title = `<name> — <one-line role>`. Grep-able. If `★ load-bearing`, mark it.
- **Paragraph 2**: 2-3 sentences. What + how + why this shape. NOT a list of every function it exports.
- **Last line**: `Reads:` — the dependencies that matter. If you'd list > 6, the file imports too much (rule ⑦ smell — flag in audit instead).

No exotic `@tag`s. JSDoc-standard `/** */` block. Lives at line 1, before imports.

## Process

### Step 1 — Identify load-bearing files

If `nav-audit` has already run and surfaced a list: use it.
If not: identify load-bearing as:
- Every domain's "leader" file (largest / most-imported / name-matches-domain)
- Every file ≥ 150 LOC
- Every barrel (`index.ts` re-exporting public API for a subsystem)
- Every file the user explicitly named

**Do NOT include**: tests, icons, name-says-it-all primitives (Button, Input, RailNavItem, tiny barrels), generated files.

### Step 2 — For each file, classify state

For each load-bearing file, `head -15` it and classify:

| State | Action |
|---|---|
| No top comment at all | **Add new header** before line 1 |
| Has `/** */` at top, matches convention | **Skip** (already correct) |
| Has `/** */` at top, wrong format | **Restructure** verbatim into convention (preserve substance) |
| Has `// ...` line comments at top | **Add header** above; preserve `//` comments if they explain specific code below |
| Has redundant `// src/path/file.tsx` path marker | **Remove path marker** + add header |
| Has rich JSDoc on an export but no file-level header | **Add file-level header** above; keep export-level doc |

### Step 3 — Compose the header for each file

For each file getting a new/restructured header:

1. Read enough of the file to write the description (top 30-50 lines usually; full file if dense)
2. Look at the file's imports → derive `Reads:` (the ≤ 6 load-bearing ones, not every transitive)
3. Write the header following the template

**Rule ⑧ applies**: if there's existing top comment substance, **preserve it** — restructure into the convention's shape, don't paraphrase or shorten.

### Step 4 — Show diff before applying

Output the proposed headers as a diff (file by file). Ask the user to confirm OR apply automatically if the user invoked with explicit "just apply" intent.

### Step 5 — Apply

Write the headers. Run a sanity check:

```bash
pnpm typecheck   # should still pass — headers are comments, no impact
pnpm lint        # same
pnpm test --run  # behaviour unchanged
```

If anything breaks → something went wrong (probably a stray syntax error in a header). Fix or revert.

### Step 6 — Update CLAUDE.md (if convention isn't documented)

Check if the project's CLAUDE.md has a section about this header convention. If not, propose adding one:

```markdown
- **File headers (skill-style progressive disclosure)**: Every load-bearing file's top 8-12 lines must follow:
  ```
  /**
   * <filename> — <one-line role> (★ optional).
   *
   * <2-3 sentence detail>.
   *
   * Reads: <key deps>
   */
  ```
  Skip thin files (Button / icons / 2-line barrels) per rule ⑥. **Maintenance discipline**: header updates ride the same commit as changes to the file's role / main imports / load-bearing status. Stale header = lie.
```

If the user accepts → write the edit.

### Step 7 — Report

Summary to chat:
- Files headered: N (with breakdown by state: added new / restructured / skipped already-good)
- Files explicitly skipped (with reasons): list the thin files you didn't touch
- CLAUDE.md updated? (yes/no)
- Diff stats: `+N insertions, -M deletions`
- How to verify: `head -12 src/<file>` shows the new header

## Examples

### Adding to a file with no header

Before:
```ts
import { useEffect, useState } from 'react';
import { Card } from '../../core/crate';

export function CardList({ cards }: Props) {
  // ...200 lines...
}
```

After:
```ts
/**
 * CardList.tsx — paginated list view of cards (★ load-bearing for the home screen).
 *
 * Fetches via useCrates, applies the current filter/sort from useCratesPageState,
 * renders a CrateCard per row. Pagination is URL-backed so back/forward preserves
 * page. Empty/loading/error states all handled inline.
 *
 * Reads: ../../core/crate · ../../app/useCrates · ./useCratesPageState · ./CrateCard
 */

import { useEffect, useState } from 'react';
import { Card } from '../../core/crate';

export function CardList({ cards }: Props) {
  // ...
}
```

### Restructuring an existing rich comment

Before (existing doc, wrong shape):
```ts
import { useRef } from 'react';

/**
 * The TrackCard annotation model — the single source of truth for layers,
 * regions, anchors, notes. A store, not a deep module. Gesture hooks take this
 * object so their interfaces stay narrow.
 */
export function useAnnotations(...) {
```

After:
```ts
/**
 * useAnnotations.ts — the TrackCard annotation store (★ keystone).
 *
 * Single source of truth for layers / regions / anchors / notes + selection.
 * A store, not a deep module — wide surface is intentional. Gesture hooks
 * (useLayerReorder, useRegionGestures) take this object so their own
 * interfaces stay narrow.
 *
 * Reads: ../../../../../core/crate · ./uid
 */

import { useRef } from 'react';

/**
 * (existing export-level doc preserved if useful, or merged into header above)
 */
export function useAnnotations(...) {
```

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Header every file uniformly | Rule ⑥ — Button/icons/barrels don't need them. Forcing creates noise |
| Auto-generate from imports (no description) | A useless title is worse than no title |
| Use exotic `@tag` like `@param`, `@returns` at file level | Those are export-level conventions. File header is prose |
| Paraphrase / shorten the existing rich comment | Rule ⑧ — restructure the shape, preserve the substance |
| Add header without reading enough of the file | You'll guess. Guessed headers = lies (rule ⑨ violated) |

## Discipline (do not skip)

- **Show diff first.** Headers are not refactors; the user reviews before applying.
- **Skip thin files explicitly + list them.** Don't pretend they don't exist; document the deliberate omission.
- **Preserve substance.** When restructuring existing doc comments, move the content into the convention's shape — never paraphrase.
- **Test gate after applying.** Headers shouldn't break anything; if they do, revert + fix.
- **Update CLAUDE.md.** Otherwise the convention is invisible to future agents/humans.

## Companion skills

- **`nav-audit`** — surfaces which files need headers (the ones where rule ① / ⑪ failed)
- **`nav-map`** — once headers exist, the map can describe files from `head -12` alone
- **`nav-refactor`** — when role/Reads change as part of a refactor, this skill re-applies the convention

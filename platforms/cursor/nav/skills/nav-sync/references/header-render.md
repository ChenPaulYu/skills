# Engine — header-render (file-level navigability)

> The header-render procedure for `nav-sync`. Apply a uniform skill-style header to load-bearing source files in any language, so the first 8-12 lines answer "what is this, and what does it depend on?" without reading the body. This is rule ① + rule ② applied to source code.

## What this phase produces

Most codebases have inconsistent file documentation — some files have rich doc comments, others have nothing, formats vary. An agent (or new human reader) can't `head -12` to get a grounded summary; they have to read whole files to understand their purpose. The fix: a uniform convention, applied to every file that earns it. The pattern intentionally mirrors how Claude **skills** work — name + description as the "progressive disclosure first level." Files become greppable by purpose.

## Scope

**Language-agnostic.** The CONVENTION (title + 2-3 sentence detail + `Reads:` line) applies to any language; the SYNTAX adapts to the language's doc-comment style. Detect the stack at the top and use the right syntax.

Syntax per language:

| Language | Comment style | Position |
|---|---|---|
| TS / JS / Java / C# / Go (doc) | `/** ... */` JSDoc-style block | line 1, before imports |
| Python | `"""..."""` module docstring | line 1, before imports |
| Go | `// ...` line comments | line 1, before `package` |
| Rust | `//! ...` (module-level doc) | line 1, before `use` |
| Swift | `/// ...` (triple-slash doc) | line 1 |
| Ruby | `# ...` block | line 1 |

The **content shape** is identical across all of them — only the comment characters differ. Headers in different syntaxes should be grep-able with the same patterns (the first ~10 lines, looking for the title format `<name> — <role>`).

## The convention

Use the project's readable header convention; this template is the fallback for load-bearing files:

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
- **Last line**: `Reads:` — the dependencies that matter. If you'd list > 6, the file imports too much (rule ⑤ smell — flag in audit instead).

No exotic `@tag`s. JSDoc-standard `/** */` block. Lives at line 1, before imports.

## Process

### Step 1 — Identify load-bearing files

If the audit (or `nav-sync`'s grounding pass) already surfaced a list: use it.
If not: identify load-bearing as:
- Every domain's "leader" file (largest / most-imported / name-matches-domain)
- Every file ≥ 150 LOC
- Every barrel (`index.ts` re-exporting public API for a subsystem)
- Every file the user explicitly named

**Do NOT include**: tests, icons, name-says-it-all primitives (Button, Input, Divider, tiny barrels), generated files.

### Step 2 — For each file, classify state

For each load-bearing file, `head -15` it and classify:

| State | Action |
|---|---|
| No top comment at all | **Add new header** before line 1 |
| Has a readable header | **Verify its claims against code**; retain it if current, correct only stale claims |
| Has `/** */` at top, wrong format | **Restructure** verbatim into convention (preserve substance) |
| Has `// ...` line comments at top | **Add header** above; preserve `//` comments if they explain specific code below |
| Has redundant `// src/path/file.tsx` path marker | **Remove path marker** + add header |
| Has rich JSDoc on an export but no file-level header | **Add file-level header** above; keep export-level doc |

### Step 3 — Compose the header for each file

For each file getting a new/restructured header:

1. Inspect the implementation and relevant tests deeply enough to support each claim; do not stop at an arbitrary line count
2. Look at the file's imports → derive `Reads:` (the ≤ 6 load-bearing ones, not every transitive)
3. Write the header following the template

**Rule ⑥ applies** to restructuring: preserve existing substance. Correct evidence-backed stale claims rather than carrying a false statement forward verbatim.

### Step 4 — Show diff before applying

Show the proposed header diff. A check-only request stops here; an authorized update
applies the scoped corrections without another generic approval.

### Step 5 — Apply and verify

Write the headers without displacing shebangs, encoding markers, or required legal notices.
Check the actual language's syntax/lint where relevant and run repository-required checks.
Use the repository's commands, not an assumed package manager. Inspect the diff to confirm
that executable behavior did not change. Fix any comment syntax error before completion.

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
  Skip thin files (Button / icons / 2-line barrels) per rule ④. **Maintenance discipline**: header updates ride the same commit as changes to the file's role / main imports / load-bearing status. Stale header = lie.
```

If the user accepts → write the edit.

## Examples

### Adding to a file with no header

Before:
```ts
import { useEffect, useState } from 'react';
import { User } from '@/core/user';

export function UserList({ users }: Props) {
  // ...200 lines...
}
```

After:
```ts
/**
 * UserList.tsx — paginated list view of users (★ load-bearing for the home screen).
 *
 * Fetches via useUsers, applies the current filter/sort from useUserListState,
 * renders a UserRow per row. Pagination is URL-backed so back/forward preserves
 * page. Empty/loading/error states all handled inline.
 *
 * Reads: core/user · app/useUsers · useUserListState · UserRow
 */

import { useEffect, useState } from 'react';
import { User } from '@/core/user';

export function UserList({ users }: Props) {
  // ...
}
```

### Restructuring an existing rich comment

Before (existing doc, wrong shape):
```ts
import { useRef } from 'react';

/**
 * The editor selection model — the single source of truth for selected nodes,
 * ranges, anchors, marks. A store, not a deep module. Action hooks take this
 * object so their interfaces stay narrow.
 */
export function useSelection(...) {
```

After:
```ts
/**
 * useSelection.ts — the editor selection store (★ keystone).
 *
 * Single source of truth for selected nodes / ranges / anchors / marks + focus.
 * A store, not a deep module — wide surface is intentional. Action hooks
 * (useNodeReorder, useRangeSelect) take this object so their own
 * interfaces stay narrow.
 *
 * Reads: core/editor · uid
 */

import { useRef } from 'react';

/**
 * (existing export-level doc preserved if useful, or merged into header above)
 */
export function useSelection(...) {
```

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Header every file uniformly | Rule ④ — Button/icons/barrels don't need them. Forcing creates noise |
| Auto-generate from imports (no description) | A useless title is worse than no title |
| Use exotic `@tag` like `@param`, `@returns` at file level | Those are export-level conventions. File header is prose |
| Paraphrase / shorten the existing rich comment | Rule ⑥ — restructure the shape, preserve the substance |
| Add header without reading enough of the file | You'll guess. Guessed headers = lies (rule ⑦ violated) |

## Discipline (do not skip)

- **Show the diff and honor scope.** Existing update authority is sufficient; checks remain read-only.
- **Skip thin files explicitly + list them.** Don't pretend they don't exist; document the deliberate omission.
- **Preserve substance.** When restructuring existing doc comments, move the content into the convention's shape — never paraphrase.
- **Test gate after applying.** Headers shouldn't break anything; if they do, revert + fix.
- **Document a newly adopted convention only within scope.** Reuse an existing readable convention.

## The 8 rules (the through-line of every nav skill)

1. **Deep modules through information hiding** — a simple interface hiding significant complexity; usable without reading the body. The technique is **information hiding**: encapsulate each design decision so it never surfaces in the interface; red flag — **information leakage** (same knowledge in ≥2 modules), often from **temporal decomposition** (boundaries by execution order, not knowledge). *A header is this rule applied to a file: the interface a reader gets without the body.* **Composition is the second half:** a package façade's `__init__` is the group-scale header — modules compose behind it into the next-scale deep module — so façades are header-carrying, load-bearing files in their own right, and a façade whose docstring doesn't say what the group hides (or that its width is the declared contract) is as stale as any lying file header.
2. **Interface-first at every scale** — *this skill's whole reason for being.* The header surfaces a module's interface so you drill into the body only as needed.
3. **Explicit dependencies** — functions deterministic; deps explicit. The header's `Reads:` line makes a file's dependencies explicit.
4. **Right grain — neither giant nor fragmented** — don't header thin files (Button / icons / tiny barrels / 2-line modules). Don't force a header where the name already says it.
5. **Fit the framework** — standard doc-comment syntax per language; no exotic `@tag`s.
6. **Rearrange, don't rewrite** — restructuring an existing top comment into the convention preserves its substance; never paraphrase or shorten.
7. **Resolve consequential uncertainty** — inspect evidence first; ask when missing intent or authority would change scope, behavior, compatibility, or a material trade-off. Label unsupported claims rather than presenting guesses as facts.
8. **Agent-navigability is the audit** — *every place you struggle to write a file's one-line header is a deep-module failure signal* — that file's interface isn't clear yet (often: it does too much). Note it; it usually means the file, not the header, needs work.


## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Skip the diff, just apply the headers | Show the headers first, unless the user said "just apply" — headers mutate source. Tell: about to write the header into the file before the user has seen its text. |
| Header every file uniformly | Skip the ones that don't need one — rule ④, buttons/icons/barrels don't earn a header. Tell: about to write a header for a one-line re-export file. |
| Paraphrase an existing top comment while reshaping it | Move the comment's substance verbatim into the convention's shape — rule ⑥. Tell: the new header says the same thing in different words instead of the original words in the new shape. |
| "While I'm here, let me also refactor X" | Route the refactor to `nav-refactor` — it needs its own narrow scope and discipline. Tell: the diff is restructuring code, not just adding or updating a header comment. |
| Expand a header correction into another artifact | Stay within the requested surface. Tell: generating a standing HTML map or rewriting the README during a header-only request. |

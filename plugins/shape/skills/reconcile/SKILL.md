---
name: reconcile
description: Reconcile the design notes with reality — scan a blueprints/thoughts/ tree, judge which docs have gone stale (already implemented, self-declared done, or superseded), then clean them *with the user* by pruning or consolidating. Fires when the user asks to "check for outdated thoughts / docs", "which design notes are stale", "clean up the blueprints", "are these docs still current", "prune the old specs", "consolidate these notes", or after a batch of work ships and the design docs have drifted from the code. Also invokable as /shape:reconcile. The check is read-only; any prune/merge is write-gated and confirmed per-file. Pairs with /nav:headers (reads file headers to tell what's implemented). Language- and framework-agnostic.
---

# Reconcile — make the notes match reality

Design notes accrete; reality moves past them. `reconcile` walks `blueprints/thoughts/`, decides honestly which docs have gone stale, and — *with the user* — prunes or consolidates them so the tree stays a true picture of what's still open. The **check is read-only**; **cleaning is always gated** behind per-file confirmation, because deleting someone's design record is irreversible.

## Why this skill exists

A `thoughts/` doc that describes already-shipped work, or that's been superseded by a later decision, doesn't just clutter — it actively lies to the next reader (human or agent), who trusts it as current intent. `/shape:align` *flags* such drift in passing but deliberately doesn't clean it. reconcile is the dedicated, careful cleanup: gather the evidence, present a verdict per doc, let the user decide, then act safely.

It is the pre-build mirror of `/nav:audit` + the careful side of `/nav:refactor`: audit *assesses* shape and reports; refactor *moves* code under test gates. reconcile assesses currency and, once confirmed, prunes/merges under safety gates.

## The shape spine (restated — this skill is self-contained)

> **Converge by a real, disposable instance — never a description.** Its corollary for a standing archive: **capture before crystallize** — keep a decision while it's live; retire it once reality has absorbed it. reconcile is how the archive lets go without losing the record prematurely.

> **One current state, two renders.** `thoughts/` (agent) and `overview.html` (human) must both reflect *present* reality. A doc describing the past is a stale render — a lie, same as a stale codebase map.

## Staleness signals — collect, don't conclude

For each `thoughts/*.md`, gather evidence from three angles. None alone is decisive — present them and let the user judge:

1. **Code (strongest).** Is the thing it describes already built? Grep the codebase for the feature; **lean on `head -12` file headers (`/nav:headers` output)** to read implementation status cheaply. Implemented → likely "done / can retire".
2. **Self-declaration.** Does the doc's own top say it's shipped / completed / superseded? A status line at the head is a strong author signal.
3. **Date.** Older docs are likelier stale — a *prior*, not a verdict. A two-year-old note may still be the live design; a yesterday one may already be done.

Combine into a per-doc verdict: **current** · **likely stale (evidence)** · **superseded by `<other>`** · **uncertain**. Honesty over tidiness — mark `uncertain` rather than guessing.

## Protocol

### Step 1 — Inventory the tree

Locate `blueprints/` (commonly `docs/blueprints/`). List `thoughts/*.md`. Detect the stack so the code-grep in Step 2 uses the right import/usage syntax.

### Step 2 — Gather evidence (read-only)

Per doc, collect the three signals above. Grep code, read each doc's top, note dates. **Read-only — touch nothing yet.**

### Step 3 — Present verdicts + propose, decide *with the user*

Report per doc: verdict + the evidence behind it + a **proposed action** — keep · prune · consolidate-into-`<other>`. Beyond flagging, **propose the cleanup** (which to merge, what the merged doc covers). Then the user confirms **per file** what to do. Nothing is cleaned without an explicit yes.

### Step 4 — Clean, safely (write-gated)

Only on confirmation, and following these non-negotiable safety rules (learned the hard way — a careless `mv`+`rm` once destroyed untracked design docs):

- **Check tracked vs untracked first** (`git status`, `git ls-files`). Untracked files have no recovery path — treat them as precious; never assume git can undo.
- **Never chain a destructive `rm` after an unverified `mv`/`git mv`.** `git mv` aborts wholesale if *any* source is untracked — verify it succeeded before anything is removed.
- **Before deleting a doc whose content was merged elsewhere, confirm the merge landed** (`diff`/`diff -q` the salvaged content) — delete only what's provably duplicated.
- **One step at a time, re-checked** — don't batch destructive ops behind a single confirmation.
- Prefer **consolidate (merge then verify then remove)** over raw delete when the doc still holds live design worth keeping.

### Step 5 — Re-sync the renders

After cleaning, the plan may have shifted — point the user to `/shape:align` to refresh `plan.md` + `overview.html` so both renders match the now-trimmed `thoughts/`. (reconcile doesn't regenerate the board itself; that's align's job — skills don't reach into each other.)

## The seam with `nav`

reconcile's currency check **consumes `/nav:headers`**: load-bearing files carrying a `head -12` header make "is this implemented?" answerable without reading bodies — exactly the strongest staleness signal. If the codebase lacks headers, suggest `/nav:headers` first; reconcile still works on grep alone, just less cheaply.

## Discipline (do not skip)

- **Check is read-only; cleaning is gated + per-file.** Never delete on inference alone.
- **Untracked = irreversible.** Verify tracked/untracked before any move or delete; never trust an unverified `mv` then `rm`.
- **Evidence over tidiness.** Cite the signal (code ref / self-declaration / date) behind every verdict. Mark `uncertain` rather than over-claiming.
- **Consolidate beats delete** when live design remains — merge, verify the merge, *then* remove.
- **Don't regenerate the board here.** Re-syncing `plan.md`/`overview.html` is `/shape:align`. reconcile cleans; align renders.

## Output

- A per-doc currency report: verdict + evidence + proposed action.
- (On confirmation) a pruned / consolidated `thoughts/` tree, cleaned under the safety rules.
- A pointer to run `/shape:align` to re-sync the renders.

## Companion skills

- **`/shape:align`** — re-render `plan.md` + `overview.html` after the tree is trimmed.
- **`/shape:elicit`** — where new `thoughts/` docs come from (the inputs reconcile audits).
- **`/nav:headers`** — add `head -12` file headers so reconcile can read implementation status cheaply.
- **`/nav:audit`** — the code-side analog: assess code shape (reconcile assesses doc currency).

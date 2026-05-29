---
name: reconcile
description: Reconcile the design notes with reality — scan a blueprints/ tree (both thoughts/ AND plans/), judge which docs have drifted (already implemented, self-declared done, superseded, or carrying a stale fact), then reconcile them *with the user* — AMEND a doc's factual drift in place, or PRUNE / CONSOLIDATE a doc that's wholly stale. Maintains both layers: converged thoughts/ AND nav:plan's grounded plans/ (a plan whose steps all shipped is stale like an implemented thought). Fires when the user asks to "check for outdated thoughts / docs", "which design notes are stale", "clean up the blueprints", "tidy the plans", "are these docs still current", "fix the outdated info in these notes", "prune the old specs", "consolidate these notes", or after a batch of work ships and the design docs or plans have drifted from the code. Also invokable as /shape:reconcile. AMEND only syncs evidence-backed facts (code moved past what the doc claims) — it never rewrites a *decision*; when the design itself changed, that's a new decision out of scope, so reconcile recommends /shape:elicit and says so rather than authoring it. The check is read-only; any amend/prune/merge is write-gated and confirmed per-file. Pairs with /nav:headers (reads file headers to tell what's implemented). Language- and framework-agnostic.
---

# Reconcile — make the notes match reality

Design notes and plans accrete; reality moves past them. `reconcile` walks `blueprints/thoughts/` **and `blueprints/plans/`**, decides honestly which docs have drifted, and — *with the user* — **amends** a doc's stale facts in place, or **prunes / consolidates** a doc that's wholly stale, so the tree stays a true picture of what's still open. The **check is read-only**; **every write is gated** behind per-file confirmation, because overwriting or deleting someone's design record is irreversible.

Staleness isn't binary. A doc can be 90% live design with one line reality overtook — killing the whole doc loses the live 90%, keeping it lets the stale line lie. **`amend`** is the action for that middle case: correct the drifted *fact*, leave the rest verbatim. The line it must not cross: amend syncs what's *true* (evidenced by built code); it never re-decides what's *decided* — see "The amend boundary" below.

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

Combine into a per-doc verdict: **current** · **current · N stale fact(s)** (→ amend) · **likely stale (evidence)** (→ prune) · **superseded by `<other>`** (→ consolidate) · **uncertain**. Honesty over tidiness — mark `uncertain` rather than guessing. The `current · N stale fact(s)` verdict is the one `amend` serves: the doc is still live, but a specific claim disagrees with what's built.

## Protocol

### Step 1 — Inventory the tree

Locate `blueprints/` (commonly `docs/blueprints/`). List **both `thoughts/*.md` and `plans/*.md`** — reconcile maintains both layers. (`thoughts/` = converged decisions; `plans/` = `nav:plan`'s grounded code-plans.) Detect the stack so the code-grep in Step 2 uses the right import/usage syntax.

> **Plans drift too — and check sharper.** A grounded plan in `plans/` carries explicit steps + a Verification table, so "is this done?" is unusually answerable: grep each step's Critical-files against the code. A plan whose steps all shipped is stale exactly like an implemented thought → retire (prune) or, if only *some* steps shipped, **amend** (mark which landed). Same verdicts, same gates, same fact-vs-decision boundary as for thoughts.

### Step 2 — Gather evidence (read-only)

Per doc, collect the three signals above. Grep code, read each doc's top, note dates. **Read-only — touch nothing yet.**

### Step 3 — Present verdicts + propose, decide *with the user*

Report per doc: verdict + the evidence behind it + a **proposed action** — keep · **amend** · prune · consolidate-into-`<other>`. Beyond flagging, **propose the fix**: for amend, show the **one-line diff** (`-` stale claim / `+` the fact code shows); for consolidate, which to merge and what the merged doc covers. Then the user confirms **per file** what to do. Nothing is written without an explicit yes.

**If the drift is a *decision change*, not a fact — stop and recommend `/shape:elicit`.** When reconciling a doc would require asserting *what the design should now be* (not just syncing what's built), that's authoring a decision — out of reconcile's scope. Say so plainly and hand off: *"This isn't a stale fact, it's a design change — that's `/shape:elicit`'s job, not reconcile's. Want to converge it there? I'll consolidate the old doc once the new one lands."* Don't rewrite the decision here. (This is the active form of "no new decisions during render".)

### Step 4 — Write the change, safely (write-gated)

Only on confirmation.

**Amend (in-place fact-sync)** — the lightest write, but still an overwrite of a design record, so it inherits the gate:
- **Verbatim except the confirmed line.** Change only the line(s) the diff showed; touch nothing else — same discipline as `/nav:refactor`'s verbatim move: don't "while I'm here" rewrite the surrounding prose.
- **The `+` line states only what code shows** — a fact, not a rationale or a design call. If you can't phrase it without judging what the design *should* be, it's not an amend → hand to `/shape:elicit`.
- **Check tracked/untracked first** — overwriting an untracked doc is as irreversible as deleting it (no git history to recover the old line).
- Keep the doc's own status/date current if it carries one (an amended doc is freshly synced — say so).

**Prune / consolidate (structural)** — follow these non-negotiable safety rules (learned the hard way — a careless `mv`+`rm` once destroyed untracked design docs):

- **Check tracked vs untracked first** (`git status`, `git ls-files`). Untracked files have no recovery path — treat them as precious; never assume git can undo.
- **Never chain a destructive `rm` after an unverified `mv`/`git mv`.** `git mv` aborts wholesale if *any* source is untracked — verify it succeeded before anything is removed.
- **Before deleting a doc whose content was merged elsewhere, confirm the merge landed** (`diff`/`diff -q` the salvaged content) — delete only what's provably duplicated.
- **One step at a time, re-checked** — don't batch destructive ops behind a single confirmation.
- Prefer **consolidate (merge then verify then remove)** over raw delete when the doc still holds live design worth keeping.

### Step 5 — Re-sync the renders

After cleaning, the plan may have shifted — point the user to `/shape:align` to refresh `plan.md` + `overview.html` so both renders match the now-trimmed `thoughts/`. (reconcile doesn't regenerate the board itself; that's align's job — skills don't reach into each other.)

## The amend boundary — sync facts, never re-decide

`amend` is sharp only if it never bleeds into deciding. The line, with the test:

> **Is the `+` line something reality has *already decided* (the built code shows it), or something that needs *my judgment about what should be*?**

- **Fact → amend here.** The doc lags the code; the decision didn't change. *e.g.* doc says "stored as a flat list (`x.ts`)" but the code now uses a typed entity → sync the line. Doc says "editing is a follow-up" but editing shipped → `editing: shipped`. (Record only the fact — not *why* or *how* it should be designed.)
- **Decision → `/shape:elicit`, out of scope.** The code didn't move; the *design judgment* did. *e.g.* the doc's principle was "tags are describe-only" and a later conversation reframed them as a two-layer system → reconcile must **not** rewrite that principle. Recommend elicit, and once the new thought lands, **consolidate** the old one (mark superseded, point to it) — reconcile's existing structural action, not an in-place rewrite of the call.

Why the wall: decisions are born in `elicit` / `mockup` (shape's converge verbs); the maintenance verbs (`align`, `reconcile`) *render* and *keep current*, they don't author. Letting reconcile rewrite a decision would put new design judgments in a place no one reviews them as decisions. Amend stays evidence-driven — the same character as reconcile's read-only currency check, just allowed to write the one synced line.

## The seam with `nav`

reconcile's currency check **consumes `/nav:headers`**: load-bearing files carrying a `head -12` header make "is this implemented?" answerable without reading bodies — exactly the strongest staleness signal. If the codebase lacks headers, suggest `/nav:headers` first; reconcile still works on grep alone, just less cheaply.

## Discipline (do not skip)

- **Check is read-only; every write is gated + per-file.** Never amend, delete, or merge on inference alone.
- **Amend syncs facts, never re-decides.** The `+` line states only what built code shows; if it needs a judgment about what the design *should* be, stop and recommend `/shape:elicit` — say plainly it's out of reconcile's scope. Amend verbatim except the confirmed line.
- **Untracked = irreversible.** Verify tracked/untracked before any amend, move, or delete; overwriting an untracked doc has no recovery path; never trust an unverified `mv` then `rm`.
- **Evidence over tidiness.** Cite the signal (code ref / self-declaration / date) behind every verdict. Mark `uncertain` rather than over-claiming.
- **Consolidate beats delete** when live design remains — merge, verify the merge, *then* remove.
- **Don't regenerate the board here.** Re-syncing `plan.md`/`overview.html` is `/shape:align`. reconcile reconciles the notes; align renders.

## Output

- A per-doc currency report: verdict + evidence + proposed action (keep · amend · prune · consolidate).
- (On confirmation) a reconciled `thoughts/` **and `plans/`** tree — stale facts amended in place, wholly-stale docs/plans pruned/consolidated, all under the safety rules.
- For any decision-change found: a recommendation to converge it in `/shape:elicit` (not rewritten here).
- A pointer to run `/shape:align` to re-sync the renders.

## Companion skills

- **`/shape:align`** — re-render `plan.md` + `overview.html` after the tree is trimmed.
- **`/shape:elicit`** — where new `thoughts/` docs come from (the inputs reconcile audits).
- **`/nav:plan`** — where `plans/` docs come from (the grounded code-plans reconcile also keeps current).
- **`/nav:headers`** — add `head -12` file headers so reconcile can read implementation status cheaply.
- **`/nav:audit`** — the code-side analog: assess code shape (reconcile assesses doc currency).

# Reconcile — full protocol

Machinery sunk from the SKILL.md body per ADR-109 (three-layer re-homing), then folded into
`shape-align` as its compaction pass per ADR-112 — `reconcile` retired as a standalone door; this
file is now one of align's own reference protocols, not a separate skill's. The Stance section in
align's `SKILL.md` carries the per-file write gates, the amend boundary test, and the
destructive-action gates (untracked-check, mockup retirement preconditions) verbatim; this file
carries the full step-by-step protocol (including Step 4's detailed safety-rule mechanics), the
mockups-tier table, the seam with nav, and the output list.

## Why this protocol exists

A `thoughts/` doc describing already-shipped or superseded work doesn't just clutter — it
actively lies to the next reader (human or agent) who trusts it as current intent.
align's verify-before-triage (SKILL.md Stance) surfaces such drift in passing; this protocol is
the dedicated, careful follow-through — the compaction half of the same `align` pass, run before
the board triage in `protocol.md`. It's the pre-build mirror of `nav-audit` + the careful side of
`nav-refactor`: audit assesses code shape, refactor moves code under test gates — this pass
assesses doc currency and prunes/merges under safety gates.

## The shape spine (restated — this protocol is self-contained)

> **Capture before crystallize** — keep a decision while it's live, retire it once reality has
> absorbed it; reconcile is how the archive lets go without losing the record prematurely. **One
> current state, one maintained render** — `thoughts/` and `plan.md` must reflect *present*
> reality (there is no separate human-facing file to keep in sync — a visual view renders fresh,
> on demand, via `shape-mockup`); a doc describing the past is a stale render, a lie like a
> stale codebase map.

## Staleness signals — collect, don't conclude

For each doc, gather evidence from three angles; none alone is decisive — present them and let
the user judge:

1. **Code (strongest).** Is the thing it describes already built? Grep the codebase; **lean on
   `head -12` file headers (`nav-sync` output)** to read implementation status cheaply.
   Implemented → likely "done / can retire".
2. **Self-declaration.** Does the doc's own top say shipped / completed / superseded?
3. **Date.** Older docs are likelier stale — a *prior*, not a verdict.

Combine into a per-doc verdict: **current** · **current · N stale fact(s)** (→ amend) ·
**likely stale** (→ prune) · **superseded by `<other>`** (→ amend both files' `Status:` lines in
place — see `blueprints-spec.md`'s Supersession section) · **shipped** (→ amend the `Status:`
line to `shipped` in place) · **uncertain**. Honesty over tidiness — mark `uncertain` rather than
guessing.

## Protocol

**Step 1 — Inventory.** Locate `blueprints/` (commonly `docs/blueprints/`). If no such tree
exists yet, there's nothing to reconcile — report that and offer to scaffold it (the first-run
path in `protocol.md` Step 1) rather than inventing one (tolerant-reader degrade path, root
CLAUDE.md / ADR-071). List **`thoughts/*.md`, `plans/*.md`, and `mockups/*/`** — this pass keeps
all three layers current (`thoughts/` = decisions, dated and `Status`-tagged; `plans/` =
`nav-plan`'s grounded code-plans; `mockups/` = the decision artifacts, swept by inherited
currency — see the mockups tier below). Detect the stack so Step 2's grep uses the right syntax.
**Plans drift too, and check sharper**: a plan carries explicit steps + a Verification table, so
grep each step's Critical-files against the code — all shipped → prune; *some* shipped → amend
(mark which landed). Same verdicts, gates, and fact-vs-decision boundary as thoughts.

**Step 2 — Gather evidence (read-only).** Per doc, collect the three signals. Grep code, read
each doc's top, note dates. **Touch nothing yet.**

**Step 3 — Present + decide *with the user*.** Report per doc: verdict + evidence + a
**proposed action** (keep · amend · prune · consolidate). Propose the fix concretely
— for amend, show the **one-line diff** (`-` stale claim / `+` the fact code shows); for
consolidate, which to merge. User confirms **per file**; nothing is written without an explicit
yes. **If the drift is a *decision change*, not a fact — stop and hand to `shape-elicit`** (see
amend boundary): say plainly it's out of scope, and once the new thought lands, consolidate the
old one. Don't rewrite the decision here.

**Step 4 — Write, safely (write-gated, on confirmation only).** Safety rules, non-negotiable
(learned the hard way — a careless `mv`+`rm` once destroyed untracked design docs):
- **Check tracked vs untracked first** (`git status`, `git ls-files`). Untracked = no recovery
  path; overwriting it is as irreversible as deleting it — treat as precious, never assume git
  can undo.
- **Never chain a destructive `rm` after an unverified `mv`/`git mv`** (`git mv` aborts wholesale
  if any source is untracked — verify before removing).
- **Confirm a merge landed before deleting the merged-from doc** (`diff -q` the salvaged
  content) — delete only what's provably duplicated.
- **One step at a time, re-checked** — don't batch destructive ops behind a single confirmation.
- **Amend** is the lightest write but still an overwrite: change only the confirmed line(s),
  verbatim otherwise (same discipline as `nav-refactor`'s move — no "while I'm here"
  rewrites); the `+` line states only what code shows; keep the doc's status/date current if it
  carries one.
- **Consolidate beats raw delete** when live design remains — merge, verify, *then* remove.
  A shipped thought is never relocated — its `Status:` line is amended to `shipped` in place
  (see Supersession, below).

**Step 5 — Continue into the board triage.** After cleaning, `plan.md` may lag the reconciled
tree. This pass and the triage in `protocol.md` (Steps 3–4) are phases of the same `align` run —
continue directly into triage and rewrite `plan.md`, rather than stopping to offer a separate
skill.

## The amend boundary — sync facts, never re-decide

`amend` is sharp only if it never bleeds into deciding. The test:

> **Is the `+` line something reality has *already decided* (built code shows it), or something
> that needs *my judgment about what should be*?**

- **Fact → amend here.** The doc lags the code; the decision didn't change. *e.g.* doc says
  "stored as a flat list" but the code now uses a typed entity → sync the line; "editing is a
  follow-up" but editing shipped → `editing: shipped`. Record only the fact, not why/how.
- **Decision → `shape-elicit`, out of scope.** The code didn't move; the *design judgment* did.
  *e.g.* the doc's principle was "tags are describe-only" and a later conversation reframed them
  as two layers → reconcile must **not** rewrite that principle; recommend elicit, then
  **consolidate** the old doc (mark superseded) once the new lands.

Why the wall: decisions are born in `elicit` / `mockup` (the converge verbs); the maintenance
verb (`align`) *renders* and keeps current, it doesn't author. Letting this pass rewrite a
decision would put new design judgments where no one reviews them as decisions.

**Supersession is an in-place `Status:` edit, not a graduate/move action (ADR-112)** — there is
no separate durable tier to promote a shipped or overturned thought into; `thoughts/` is
permanent, and a decision's whole lifecycle (in force → superseded / shipped) lives in its own
file's `Status:` line, amended where it stands. Full shape: `blueprints-spec.md`'s Supersession
section.

## The mockups tier — retire on ship, with a forwarding address (ADR-037)

`mockup`'s own rule — detail-level artifacts **retire on ship**, structural locks carry a
freshness stamp — has its enforcement point *here*: at mockup time nothing is shipped yet, and
no other verb returns to `mockups/` post-ship. Without this sweep, `mockups/` grows monotonically
(committed-by-default makes every decision leave a folder nothing deletes) — the same unbounded
growth this pass's `thoughts/` pruning guards against, one tier down.

**A mockup exists to represent what the running system cannot yet represent; once code absorbs
it, representation transfers and it exits** (ADR-039). One question per folder: *"does this
still represent something the code doesn't have?"* Three ordered pre-conditions, then the
verdict:

1. **Decision settled/shipped?** Same evidence as thoughts: code grep, `head -12` headers. ("No
   one cites it" alone never triggers prune — an uncited mockup for an in-flight decision is
   kept.)
2. **Residue absorbed?** The pick **and any deferred branch** must be *verifiably* recorded in
   the owning thought — verified by reading, not assumed (mockup's step 5 should have written it;
   confirm it did). This is a judgment check, not a grep — present per collect-don't-conclude,
   mark `uncertain` rather than guess.
3. **Inbound links resolved?** Grep `blueprints/` for citations into the folder — this one *is*
   mechanical; list the hits as evidence.

**Default direction:** a folder failing all keep-clauses gets prune as the *default proposal*
(the per-file gate stands — propose, don't presume). The razor exists so a sweep is one gated
round, not three (ADR-039).

| situation | action |
|---|---|
| ①②③ all pass | **prune** — git is the deep archive; `git log --follow -- <path>` + `git checkout <sha> -- <path>` restores it |
| ② fails — the pick or a deferred branch lives only in the mockup | **salvage → then prune**: write the line into the owning doc, incl. a pointer (`rendered candidates: git history at mockups/<date>-<topic>/`), verify it landed, then prune — consolidate's merge → verify → remove, pointed at a mockup |
| whole decision parked (plan's *later*) | **keep + parked stamp** ("parked, intent as of `<date>`") — the converge job is dormant, not done; re-rendering on un-park is waste (= code won't absorb it for now — the deferred intent still needs a representative) |
| decision in-flight | **keep**, untouched (= code hasn't absorbed it yet) |
| folder untracked | **hard gate** — resolve tracked status before any other action; untracked never entered git, so prune would be permanent destruction |

**Tracked-check discipline:** ask git's ledger, not the disk — `git ls-files`, never `ls`. The
depth-unanchored `mockups/` gitignore trap means a folder can sit on disk looking committed
while git never held it (field case: 65 untracked mockup folders in one repo).

**Salvage respects the amend boundary:** it *relocates* a recorded pick/deferral, never authors
one. If ② fails because the design judgment itself is unclear — stop, recommend
`shape-elicit`.

## The seam with `nav`

This pass's currency check **consumes the file headers `nav-sync` maintains**: load-bearing
files with a `head -12` header make "is this implemented?" answerable without reading bodies —
the strongest staleness signal. No headers → suggest `nav-sync` first; this pass still works on
grep alone, just less cheaply.

## Leftover legacy artifacts

**If the project still carries a leftover standing `overview.html`** (from before the shape
family dropped the maintained-HTML-render mechanism), propose retiring it — delete it (git holds
it) and note in `plan.md`'s header that a visual view now renders on demand via `shape-mockup`
instead.

## Output

- A per-doc currency report: verdict + evidence + proposed action (keep · amend · prune ·
  consolidate · retire-mockup).
- (On confirmation) a reconciled `thoughts/`, `plans/` **and `mockups/`** tree — facts amended in
  place (including `Status:` lines edited in place for a superseded or shipped decision),
  wholly-stale docs pruned/consolidated, shipped decisions' mockups retired (residue salvaged,
  git holding the corpus), all under the safety rules.
- For any decision-change: a recommendation to converge it in `shape-elicit` (not rewritten
  here).
- Direct continuation into the board triage (`protocol.md` Steps 3–4) to refresh `plan.md` —
  same `align` run, no separate offer.

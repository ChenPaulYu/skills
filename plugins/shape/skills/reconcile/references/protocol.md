# Reconcile — evidence and cleanup protocol

The skill body owns authority, preservation, and completion gates. This reference supplies
the inventory and retirement mechanics, extracted from align (ADR-131).

## Inventory and evidence

Locate the existing blueprints tree (often `docs/blueprints/`) or readable equivalent.
Inventory only the requested design notes, implementation plans, and mockups; report absent
material without inventing a tree. Read the board as context, not as an invitation to reorder it.
Use `git status --short` and `git ls-files` to distinguish tracked and untracked material.

Read each document for its claim, purpose, status, live rationale, and inbound references.
Dates and self-declared completion locate candidates; inspect implementation and verification
evidence before concluding. For a multi-step plan, account for each required outcome and
its verification, distinguishing shipped code from an unrun experiment. Legacy layouts remain
readable: report their dialect without migrating them.

| Evidence | Disposition |
|---|---|
| Still-operative decision or unfinished work | Keep; amend only confirmed stale facts |
| Part of the planned behavior exists | Mark partial progress; retain remaining work |
| All required outcomes and checks are evidenced | Mark shipped; retain governing rationale |
| A later accepted decision explicitly replaces this one | Add reciprocal supersession pointers in place |
| Duplicate material with no unique live residue | Propose consolidation; name and verify the destination |
| Code disagrees with intended behavior | Report intent/implementation discrepancy; do not ratify the code |
| Insufficient or conflicting evidence | Mark uncertain; keep until resolved |

## Apply the bounded proposal

Present the concrete status edits, consolidations, and any proposed removals together. A
review-only request stops here. For authorized updates, apply the scoped non-destructive
edits; ask only for missing decisions or destructive authority. Check each untracked overwrite
or deletion individually and retain unique material unless its disposal is explicitly authorized.

A consolidation follows read → transfer → verify preserved substance and links → remove only
within authority. Do not chain `mv` and `rm`; an unsuccessful move must never permit deletion.
Prefer a status edit when a shipped thought still carries a decision or rejected alternatives.
Supersession stays in place; there is no graduation tier or mandatory move.

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

1. **Decision settled/shipped?** Same evidence as thoughts: implementation and relevant tests, located through headers/search. ("No
   one cites it" alone never triggers prune — an uncited mockup for an in-flight decision is
   kept.)
2. **Residue absorbed?** The pick **and any deferred branch** must be *verifiably* recorded in
   the owning thought — verified by reading, not assumed (mockup's step 5 should have written it;
   confirm it did). This is a judgment check, not a grep — present per collect-don't-conclude,
   mark `uncertain` rather than guess.
3. **Inbound links resolved?** Search the repository for citations into the folder — this one *is*
   mechanical; list the hits as evidence.

**Default direction:** a folder failing all keep-clauses gets prune as the *default proposal*
(the concrete destructive-scope gate stands — propose, don't presume). The razor exists so a sweep is one gated
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
`/shape:elicit`.

## Handoffs and legacy views

A stale SHA only calls for inspection. Retain a handoff while work is live or its reasons
exist nowhere durable. Remove it only after verifying consumption/supersession and preserved
rationale, under the same trackedness and destructive-scope gates.

A leftover standing `overview.html` can be proposed for retirement when its useful residue is
preserved and references are repaired. Do not delete it solely because the convention changed.

## Completion and boundaries

Re-read changed records, inspect the diff, resolve inbound links, and account for every affected
record. Update directly affected board facts if that update is authorized; preserve priorities.
Report retained material, unknowns, and coverage limits. There is no automatic align finale.

Code headers from /nav:sync are useful locators, not proof or a prerequisite. Read code directly
when headers are absent. /nav:sync checks reader documents such as README; /shape:align
decides priorities; /shape:migrate changes the convention structure. Reuse fresh evidence
between these tasks without requiring or invoking another skill.

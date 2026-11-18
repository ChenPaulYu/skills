---
name: do
description: "Implement already-decided behavior changes, including a multi-item task, and verify the result; or show the grounded engineering approach first when asked. Use for authorized fixes or features with clear outcomes, or for 'how would you build this' before building. Behavior-preserving refactors and unresolved product choices belong to separate workflows."
---

# Do — implement decided behavior

Ground the change in the existing code, then deliver and verify the agreed outcomes.

## Before the first edit: find the work item

For every execution request, check the project instructions for its workspace
mapping. For a connected project, open its `project.md` and search existing tasks
and live legacy work for the requested outcome, even for a small fix. Use the
user's explicit task or project pointer, or the **Locate before reading or
writing** section of `references/workspace-records.md` if the mapping is unclear.
The bundled `scripts/workspace --root <home> status <project>` can help.

Report the matched work item, a completed lookup with no match, a legacy fallback,
or an unavailable workspace. If two matches would change the work, resolve which
owns it before editing that part. If the configured workspace is unavailable,
report what could not be read and pause work that depends on its requirements.
For an unmapped project, check its established local tracking. After a lookup
with no match, a one-off fix may proceed under the existing authorization.

Before creating or updating project records or working artifacts, read
`references/workspace-records.md` to resolve the connected home and storage first. Read
`references/record-interface.md` and apply its pre-write ownership check; it also
defines metadata, dates, opening conclusions and Relations. This does not change the format of product docs or force legacy-board migration.

## Stance

- **Use the agreed outcomes as the entry gate.** A multi-item task can go directly
  through do. Read its deliverables, acceptance checks and linked decisions. Reconcile
  requested behavior, current evidence and any gaps before dividing the work.
  Reuse the matched work item. If no item exists and the work has multiple
  deliverables or needs resuming later, record it using the shared task convention.
- **Plan within execution.** For coupled changes, decide dependency order, existing
  owners, interface and compatibility impacts, and migration or rollback before
  editing affected paths. Scale the detail to risk. Ask only when a choice needs
  the user to settle scope, compatibility or a material trade-off. Continue
  independent authorized work if another item is blocked. Grounding, outcome
  coverage and verification design: `references/planning.md`.
- **Approach first, on request.** When the user asks to see or compare the
  engineering approach before building, or says not to implement yet, give the
  grounded approach in chat and stop there; the request authorizes no edits. When
  they ask to compare interface designs, follow **Comparing interface designs** in
  `references/planning.md`.
- **An open-ended target gets a finish line before work starts.** When the request is a loop with no checkable end ("keep optimizing until it's a 90", "finish everything left"), first state a short list of checkable completion criteria and separate the items only the user can do (logins, hardware, accounts, taste calls). Stop when the criteria pass or only user-owned items remain; hand those over as the remaining list instead of iterating on them.

### The kernel — 乙 always on, 甲 enforced

**乙 — awareness, continuous.** Watch cohesion, existing owners, and changed file roles. Length is an inspection signal, never an automatic split or rollback trigger. Surface unrelated structural concerns without expanding the task. Notice when the change enables a live LLM path or raises its fan-out/turn budget; account for that cost before exercising it.

**甲 — the enforced thin bracket.** Three beats, no artifact:

#### inject (→) — ground before you touch (cheap)
- **Check the Git baseline.** Identify the target branch and HEAD, inspect staged
  and unstaged changes and untracked files, and check whether commits cited by
  the Task belong to the target history. Resolve discrepancies before relying on
  the Task's code snapshot. Use the current checkout for bounded work that can
  coexist with local edits. Use a separate worktree when concurrent edits,
  comparison runs, or verification output need isolation. Confirm that the
  chosen worktree includes any local changes the task depends on. Decide whether
  the work needs its own branch from the user's or project's `## Git` rules. See
  **Git baseline and isolation** in `references/do-protocol.md`.
- `head -12` the file(s) the change lands in — role + `Reads` without reading the body. (No header? that's a rule-① smell; note it.)
- **grep the target domain for a reusable existing impl** before adding anything new — the single most common miss. A fresh execution re-implements what's already there (the canonical ADR-007 failure: a re-written `fillPath()` that already existed with important bucketing, shipped green-tested). Reuse it; don't add a parallel one.
- **CLI packaging/docs work:** check the package's command-entry contract before editing docs or wrappers (Python: `[project.scripts]`; Node: `bin`; Rust: installed binary name). Daily-use docs should lead with install-once → bare command; project runners (`uv run`, `npm run`, etc.) belong in the local-development path unless the tool is intentionally repo-only.
- Confirm placement — at BOTH scales: which existing module does this deepen, and which package/group does that module sit in? A change that widens a group's façade is the same grain decision one level up. If the honest answer is "it widens an interface / needs a new module", say so before writing.

#### execute — make the change
Write the behavior-changing code, placed per the inject pass. Keep structural preparation reviewable separately from new behavior. Prefer verbatim moves where sufficient; necessary internal rewrites must preserve the existing contract and have corresponding verification.

#### check (←) — four gates before "done"
1. **Header hygiene** — a new load-bearing file (≥150 LOC · domain leader · subsystem barrel) carries a header in the project's convention; a file whose role / main imports / load-bearing status changed has its header updated **in the same change** (stale header = lie).
2. **N+1** — did this add a second consumer of an inline util? Extract the primitive; don't ship the copy. Did it bypass a barrel/facade, or shove a new concern into one? Read the seam rule at *intent*, not as a wall. **N+1 fires on *values* too, in any *layer*** — a 2nd raw copy of a color / constant / config value (code OR CSS / prompt / config) = reference its owner, don't re-express it. And a *new* distinct design value must earn its distinctness vs the nearest existing one: a sub-JND near-duplicate is drift, not a new level/category (the justification is **perceptually vetoable** — a stated reason doesn't survive an imperceptible difference). This is the *cheap per-change half*; it's structurally blind to leakage that only shows in aggregate — the guarantee is `/nav:audit`'s value-leakage check ([ADR-003](docs/adr/003-nav-eight-rules.md)).
3. **Verify the outcome, preserved behavior and structure.** Check the new behavior through its
   affected entry-to-result path, cover nearby behavior a shared-path change could alter, and
   inspect ownership, reused paths, interface growth and duplicate logic in the diff. Component
   tests cannot alone prove wiring to persistence or delivery; build/typecheck alone cannot prove
   behavior. Choose checks that expose the likely failure: focused tests,
   type/lint checks, CLI input/output, integration checks, or a browser flow for interactions
   not covered automatically. Add or adjust tests when they provide meaningful regression
   coverage; reversible low-impact changes do not need tests that merely mirror implementation.
   Complete repository-required checks. Repeat or broaden only for new changes, failures, or
   unresolved concerns.

   **Honor existing authorization.** Run ordinary in-scope checks without re-confirming them.
   Before an unapproved external effect or additional paid-LLM run, describe the target and
   cost and obtain the missing authority. A previous approval for that same scope still counts.
   A fixed interaction count or general difficulty is not an approval boundary.

   **Report evidence and limits accurately.** If no suite exists, seek a reproducible runtime or
   input/output check. If adequate verification is unavailable, name exactly what is unverified;
   do not call it a pass or attribute a skip to the user unless they actually declined it.
   Record actual checks, relevant inputs/states, observed results and remaining limits separately
   from proposed checks. A newly discovered regression is additional evidence; do not claim the
   original verification plan already covered it.
   Tie results to the tested commit or to HEAD plus the scoped uncommitted diff.
   When an existing PR or CI run is relevant, check its tested revision and
   actual status before citing it. Leave publication and integration to nav-ship.
4. **Work-item sync** — in a connected workspace, update the original task's
   deliverable checkboxes, verification/limits and next action. Check a deliverable
   after its acceptance passes. Reuse live legacy work in place and preserve its
   existing progress format. A one-off fix can proceed without a new record. For
   durable tracking, follow `references/workspace-records.md`. Mark only verified work complete, then continue the next authorized
   ready item. Record blockers and proceed with independent items in scope. Keep
   progress in its owning record, including when a compatibility board is present.
   When a legacy board still owns the work, update only the matching item in the
   same change with verified progress or completion and an evidence pointer.

Scope decisions, ownership checks, and examples of risk-proportional verification: `references/do-protocol.md`.

## Companion skills

- **`shape-task`** — turn settled intent into deliverables with acceptance checks.
- **`/nav:refactor`** — the behaviour-preserving twin; when the change is a move, not an addition.
- **`/nav:audit`** — when you're not sure the placement is sound; a read-only shape check before you `do`.
- **`/nav:sync`** — after a `do` that changed a file's role or added a load-bearing file, refresh its header. Include affected reader documents when the change alters their claims or usage.
- **`/shape:elicit` · `/shape:mockup`** — when the change isn't actually decided yet; converge first, then `do`.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.

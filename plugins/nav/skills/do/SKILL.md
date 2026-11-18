---
name: do
description: "Implement already-decided behavior changes, including a multi-item task, and verify the result. Use for authorized fixes or features with clear outcomes. Behavior-preserving refactors and unresolved product choices belong to separate workflows."
---

# Do — implement decided behavior

Ground the change in the existing code, then deliver and verify the agreed outcomes.
Use the owning task when work needs durable tracking.

Before creating or updating project records or working artifacts, read
`references/workspace-records.md` to resolve the connected home and storage first. Read
`references/record-interface.md` and apply its pre-write ownership check; it also
defines metadata, dates, opening conclusions and Relations. This does not change the format of product docs or force legacy-board migration.

## Stance

- **Use the agreed outcomes as the entry gate.** A multi-item task can go directly
  through do. Read its deliverables, acceptance checks and linked decisions. Reconcile
  requested behavior, current evidence and any gaps before dividing the work.
  When a write needs durable tracking, use the original task and the shape-task
  record convention. A one-off fix can proceed without a new file.
- **Plan within execution.** For coupled changes, decide dependency order, existing
  owners, interface and compatibility impacts, and migration or rollback before
  editing affected paths. Scale the detail to risk. Ask only when a choice needs
  the user to settle scope, compatibility or a material trade-off. Continue
  independent authorized work if another item is blocked.
- **An open-ended target gets a finish line before work starts.** When the request is a loop with no checkable end ("keep optimizing until it's a 90", "finish everything left"), first state a short list of checkable completion criteria and separate the items only the user can do (logins, hardware, accounts, taste calls). Stop when the criteria pass or only user-owned items remain; hand those over as the remaining list instead of iterating on them.

### The kernel — 乙 always on, 甲 enforced

**乙 — awareness, continuous.** Watch cohesion, existing owners, and changed file roles. Length is an inspection signal, never an automatic split or rollback trigger. Surface unrelated structural concerns without expanding the task. Notice when the change enables a live LLM path or raises its fan-out/turn budget; account for that cost before exercising it.

**甲 — the enforced thin bracket.** Three beats, no artifact:

#### inject (→) — ground before you touch (cheap)
- `head -12` the file(s) the change lands in — role + `Reads` without reading the body. (No header? that's a rule-① smell; note it.)
- **grep the target domain for a reusable existing impl** before adding anything new — the single most common miss. A fresh execution re-implements what's already there (the canonical ADR-008 failure: a re-written `fillPath()` that already existed with important bucketing, shipped green-tested). Reuse it; don't add a parallel one.
- **CLI packaging/docs work:** check the package's command-entry contract before editing docs or wrappers (Python: `[project.scripts]`; Node: `bin`; Rust: installed binary name). Daily-use docs should lead with install-once → bare command; project runners (`uv run`, `npm run`, etc.) belong in the local-development path unless the tool is intentionally repo-only.
- Confirm placement — at BOTH scales: which existing module does this deepen, and which package/group does that module sit in? A change that widens a group's façade is the same grain decision one level up. If the honest answer is "it widens an interface / needs a new module", say so before writing.

#### execute — make the change
Write the behavior-changing code, placed per the inject pass. Keep structural preparation reviewable separately from new behavior. Prefer verbatim moves where sufficient; necessary internal rewrites must preserve the existing contract and have corresponding verification.

#### check (←) — four gates before "done"
1. **Header hygiene** — a new load-bearing file (≥150 LOC · domain leader · subsystem barrel) carries a header in the project's convention; a file whose role / main imports / load-bearing status changed has its header updated **in the same change** (stale header = lie).
2. **N+1** — did this add a second consumer of an inline util? Extract the primitive; don't ship the copy. Did it bypass a barrel/facade, or shove a new concern into one? Read the seam rule at *intent*, not as a wall. **N+1 fires on *values* too, in any *layer*** — a 2nd raw copy of a color / constant / config value (code OR CSS / prompt / config) = reference its owner, don't re-express it. And a *new* distinct design value must earn its distinctness vs the nearest existing one: a sub-JND near-duplicate is drift, not a new level/category (the justification is **perceptually vetoable** — a stated reason doesn't survive an imperceptible difference). This is the *cheap per-change half*; it's structurally blind to leakage that only shows in aggregate — the guarantee is `/nav:audit`'s value-leakage check ([ADR-032](docs/adr/032-value-leakage-layer-agnostic-three-tier.md)).
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
- **`nav-plan`** — provide a separate engineering proposal when the user asks to review one.
- **`/nav:refactor`** — the behaviour-preserving twin; when the change is a move, not an addition.
- **`/nav:audit`** — when you're not sure the placement is sound; a read-only shape check before you `do`.
- **`/nav:sync`** — after a `do` that changed a file's role or added a load-bearing file, refresh its header. Include affected reader documents when the change alters their claims or usage.
- **`/shape:elicit` · `/shape:mockup`** — when the change isn't actually decided yet; converge first, then `do`.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.

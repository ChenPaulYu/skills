---
name: do
description: "Make a small, already-decided, behaviour-changing code change directly — with deep-module discipline, but no plan.md. Fires on \"just add X\" / \"你做一下\" / \"直接開始實作\", or post-converge \"make it functional\". NOT for behaviour-preserving moves (use /nav:refactor) or large/ambiguous specs (use /nav:plan)."
---

# Deep-module do — execute a small change, disciplined

Make a small, already-decided, **behaviour-changing** change happen **now** — and place it deep-module-correctly as you go, without the ceremony of a written plan. nav's execution verb: the only nav skill that writes new/changed feature code directly. It is the same inject↔check discipline a sub-agent already carries when `/nav:plan` or `/nav:refactor` dispatches it ([ADR-008](docs/adr/008-inject-check-at-handoff.md)), promoted to a standalone, plan-less verb.

## Stance

- **In scope: a small, decided, behaviour-changing change** you can hold in your head without a written plan. **Out of scope**: behaviour-preserving restructuring (→ `/nav:refactor`), substantial work (→ `/nav:plan`), or an unresolved product decision. Read the code and existing decisions first; ask only if missing intent would change scope, behavior, or a material trade-off.

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
3. **Verify the changed behavior.** Choose checks that expose the likely failure: focused tests,
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
4. **Board sync (blueprints carve-out — the push half of ADR-086)** — if the repo has a `blueprints/plan.md` board and this change closes or materially advances one of its 🚧/▶ items, update that item **in the same change**: move it to ✅ Shipped with a one-line evidence pointer, or annotate the progress. A stale board entry is the same lie as a stale header, one tier up — and the board has no other push-side writer (measured: one project's sweep found 5 of 7 "Next" items already shipped, every one shipped via an execution verb that never touched the board). Scope discipline: touch ONLY the item(s) this change actually moved — re-triaging, reordering, or dropping items is `/shape:align`'s job, with the user. No board, or the change maps to no item → gate passes vacuously.

Scope decisions, ownership checks, and examples of risk-proportional verification: `references/do-protocol.md`.

## Companion skills

- **`/nav:plan`** — when a substantial change warrants a grounded plan first; already-authorized execution then follows this skill's discipline.
- **`/nav:refactor`** — the behaviour-preserving twin; when the change is a move, not an addition.
- **`/nav:audit`** — when you're not sure the placement is sound; a read-only shape check before you `do`.
- **`/nav:sync`** — after a `do` that changed a file's role or added a load-bearing file, refresh its header (and re-render sync's codebase map leg if that role change is worth reflecting there).
- **`/shape:elicit` · `/shape:mockup`** — when the change isn't actually decided yet; converge first, then `do`.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.

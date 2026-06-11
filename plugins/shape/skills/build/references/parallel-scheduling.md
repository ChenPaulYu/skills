# Parallel scheduling — the full policy (ADR-040)

> **Workflow is build's muscle, never its brain.** Execution parallelizes; adjudication (the schedule, the <90% halts, the join gate, the check brackets) never does. This reference holds the full protocol; `SKILL.md` carries only the kernel. Origin: `docs/observations/2026-06-11-parallel-build-scheduling.md`.

## When it applies

Several In-progress items that are **chunky** (dispatch overhead — per-agent inject context, schedule ceremony — eats the gain on small ones), and the user is open to a batch. Serial (the default per-item loop) is always correct; this policy is an *optimization with a proposal gate*, never an obligation.

## The six steps

1. **Ground ALL items upfront** (change from the default just-in-time grounding). Read-only, so itself dispatchable as a concurrent fan-out. Each item's `/nav:plan` artifact already carries the two fields scheduling needs — **Critical files** (footprint) and **Verification** (test scope). No new schema.
2. **Evaluate** each item on three criteria:
   - **(a) Disjoint footprint** — files AND test-import paths. Disjoint files ≠ disjoint import graphs; an item whose tests transitively import another item's modules is NOT disjoint.
   - **(b) Fully decided (≥90%)** — an in-batch agent cannot stop to ask; any ambiguity it would have to guess through disqualifies the item from the tail.
   - **(c) No shared-primitive risk** — two items plausibly needing the same new util (the N+1 trigger, cross-agent edition: each agent's own check passes, the duplicate only appears at join). Pre-extract the primitive serially first, then the items qualify.
3. **Schedule**: items that touch others form the **serial prefix** — run first, full per-item loop, main loop (serialize the hub); the truly disjoint remainder forms the **parallel tail** (parallelize the leaves).
4. **Propose — the user's nod starts the batch.** Present "these can run parallel: items N+M+K, because…" with the criteria evidence. Scheduling is adjudication (align-natured: decided *with* the user); execution inside an approved batch is autonomous (build-natured: confidence-gated). On harnesses requiring explicit multi-agent opt-in, the nod IS the opt-in — one door, two locks.
5. **Run the tail in the shared working tree** — no worktrees (the merge tax outweighs what isolation buys here; that trade was made knowingly, see "The price"). In-batch agents **write, don't test** — footprint-scoped test runs are advisory at best, since another agent's half-written module can sit on your tests' import path. Each agent returns a diff summary + `done|blocked`. Ambiguity → `blocked`, the item drops back to the serial track — an in-batch agent never guesses.
6. **Join — ONE authoritative gate.** Full test gate once the batch lands. Red → bisect by reverting item footprints (disjointness guarantees attribution). Then the **check bracket runs serially per item** (read the diff · same-domain grep · seam/facade at intent · header hygiene · smell scan) — integration is judgment work and never parallelizes. Then each item lands normally (Shipped + `/shape:align`).

## Which phases go where

| Phase | Nature | Runs in |
|---|---|---|
| Ground all items | read-only, no interaction, structured output | concurrent dispatch ✓ (fan-out) |
| Evaluate + propose schedule | adjudication — needs the user | main loop |
| Serial prefix | per-step gates, may halt <90% | main loop (the default loop) |
| Parallel tail | write-only, 100%-decided, returns `done\|blocked` | concurrent dispatch ✓ (pipeline) |
| Join: gate + check brackets | judgment, may halt | main loop |

The split criterion is one line: **does the phase ever need to talk to the user?** Dispatched agents can't stop to ask; criteria (b) makes that safe by construction for the tail.

## The capability slot

The concurrent dispatch facility is **named, not hardcoded** (same pattern as browser-verify): a workflow/pipeline engine where the harness provides one (named default); plain parallel sub-agents otherwise; **no facility → run fully sequential (the default loop). Degrade parallelism, never the gates.**

## The price, paid knowingly (decided 2026-06-11)

- Per-step gates degrade to a batch-level gate for the tail — "small revertible steps" traded against "no merge + no worktree tax".
- Criterion (a) is heavier than file-footprint — test import-path entanglement must be assessed. **The load-bearing wall of this policy is the evaluation, not the execution.**
- Worktree isolation was considered and declined: it converts silent cross-edits into visible merge conflicts, but the merge handling + per-tree dependency installs cost more than the insurance is worth at this scale. Revisit if shared-tree drift actually bites (a `blocked`-rate or join-red-rate worth recording).

## Decided forks (for the record)

| Fork | Ruling |
|---|---|
| Where parallelism lands | Inside `build` — a scheduling policy, no new verb, no new entrance |
| Build's entrance | The board stays the only queue (any source enters via `/shape:align` first) |
| Isolation | Shared tree, conflict-aware scheduling — no worktrees |
| Batch approval | Schedule-as-proposal — the user's nod starts it |
| Dispatch facility | Capability slot; workflow engine as named default |

# ADR 086 — Board currency is push-primary: execution verbs update `plan.md` at ship time; align verifies every carried item

**Status**: accepted
**Date**: 2026-07-16
**Source**: direct session directive, ratified by Paul 2026-07-16 ("為什麼我們會有這麼多東西沒同步到?我們要怎麼改我們的 skill?" → "你直接去幫我改然後 commit,然後照流程走") — after a single day's align+reconcile sweep on a real project found five of seven "Next" board items already shipped, one mainline item silently dropped, and two thought-status lines lagging reality.

## Context

`blueprints/plan.md` is the single maintained board (`/shape:align` writes it; agents execute against it). But nothing updated it at **ship time**: work lands through `/nav:do`, `/nav:plan`-dispatched sub-agents, or ad-hoc sessions, each producing a commit + tests + sometimes a dogfood report — and never touching the board. The board only healed when align was summoned, and align's sync-confirm step, though written into the skill, was expensive across N items and degraded in practice to a sampled spot-check or a pure reprioritization that carried every claim forward.

Measured consequences from one project (a private R&D repo, 2026-07-16): a verification-tooling item listed as open debt though its script shipped two days earlier and was used by two dogfoods since; a timing-grounding item listed as pending though its component verbs had all shipped; two papercuts listed open though fixed in an earlier cleanup wave; another design item listed open though a newer layer had removed its root cause; and a mainline item **vanished entirely** during a "refine priorities" board edit, rediscovered only via a stale `HANDOFF.md`.

The same repo held two counter-examples that never drifted: the canon amendments ledger (`docs/core/amendments.md` — every non-position flow that touches canon queues a line **at change time**, ADR-041) and file headers ("role changed → header updated **in the same commit**; stale header = lie"). Both share one law: **the record is updated by the same event that changes reality, not by a later summons.**

## Decision

1. **Push (primary) — `/nav:do` gains a fourth check gate, "board sync."** If the repo has a `blueprints/plan.md` and the change closes or materially advances one of its 🚧/▶ items, the same change updates that item (move to ✅ Shipped with a one-line evidence pointer, or annotate progress). Scope-limited: only the item(s) actually moved; re-triage/reorder/drop stays align's, with the user. No board or no matching item → vacuous pass.
2. **Push — `/nav:plan` carries the same rule at both of its seams.** The plan template's Verification section gains a "board close-out" line (the final step moves the tracking item to ✅ Shipped in the same commit as the last verification), and Stage 4's sub-agent Check(←) bracket verifies board sync before accepting "done."
3. **Pull (safety net) — `/shape:align` Step 2's sync-confirm becomes mechanical, not aspirational.** No 🚧/▶ item enters triage without attached evidence (grep hit / header / git ref / test name); long boards fan per-item verification out to cheap parallel sub-agents (`model: sonnet`, read-only) instead of skipping. Every stale item pull still finds is treated as a signal the push side was bypassed.
4. **Pull — align gains a no-silent-drop rule.** Every item on the previous board lands visibly on the new one (Shipped with evidence · Future with why · still Next · explicit user-confirmed cut). Dropping is a decision the user makes in the triage dialog, never a diff artifact.

## Why

- **Assign the record to the event, not to a summons.** The two artifacts in the same repo that never drift both update at change time; the one artifact that drifted updates only on summons. This is the whole causal story — the fix copies the working pattern to the broken surface.
- **Push alone is insufficient** (ad-hoc sessions and undisciplined writers bypass gates); **pull alone is unaffordable** (per-item verification cost is exactly why sync-confirm degraded to sampling). Push makes pull boring; pull catches push's leaks. The pair is the same detection structure reconcile already uses for `decisions.md` supersedes (push-primary declaration + pull-safety-net sweep).
- **Cheap fan-out removes the standing excuse.** The verification that found 5/7 stale items was two sonnet sub-agents for a few minutes. Making that the prescribed mechanism (rather than heroic diligence) is what keeps the pull side from regressing to spot-checks.
- **No-silent-drop guards the board's other failure class** — not staleness but loss. A board edit is not a decision record; an item that leaves the board without the user saying so is ghost work waiting to be re-mined.

## Consequences

- `nav:do` check bracket: three gates → four (header · N+1 · verify · board); frontmatter description updated. nav `0.9.0 → 0.10.0`.
- `nav:plan`: template Verification gains board close-out; Stage 4 Check(←) gains board sync.
- `shape:align`: Step 2 every-item-verified rule + sonnet fan-out; Step 3 no-silent-drop; nav-seam section documents the push/pull pairing. shape `0.9.4 → 0.10.0`.
- `shape:build` already moved items to Shipped per-item (its loop ends "→ move to Shipped → `/shape:align`") — unchanged; this ADR generalizes that behaviour to the non-orchestrated verbs.

---
date: 2026-06-15
status: raw
---

# Reference integrity on a canon rename applies to LIVING docs only — frozen snapshots keep the old name

## What happened

TrackMate had ratified a capability rename in core (`AgentDAW → Tactus`, via `/shape:position`).
The reference-integrity sweep (renaming old references to the new canon name) was deferred to
`/shape:reconcile`. During the sweep I renamed the capability across living docs (thoughts,
decisions.md, plan.md) — correct. Then, on a re-check, I "completed" it by also renaming the
`AgentDAW` label inside two **canon-pinned mockups** (`2026-06-10-master`, `visual-identity` —
the frozen 定稿 visual samples, stamped "intent as of 2026-06-10, details defer to the real
system") and flagged the matching `mockBackend.ts:407` demo-trace string.

Paul's correction, verbatim: **"如果是過去文件就不用改了"** (if it's a past document, no need to
change it). I reverted the two mockup renames back to `AgentDAW`.

The rule that crystallized:

> A canon rename's reference integrity is for **living docs** (the ones agents read as *current*
> intent: thoughts / decisions / plan). **Past/frozen artifacts** — canon-pinned mockup snapshots
> ("intent as of `<date>`"), demo-flavor strings, historical changelog entries — keep their
> historical name. They're dated snapshots, not current claims; renaming them is churn that also
> quietly falsifies "this is what we thought on `<date>`".

## Why it matters

"Reference integrity on renames" (owned by `/shape:position`, executed by `/shape:reconcile`)
reads as "rename *every* reference" — and an agent will dutifully chase the name into frozen
snapshots, because nothing says stop. But a canon-pinned mockup's whole contract is that it's a
*frozen* "as of `<date>`" record whose details defer to the running system. Editing its internals
to match a *later* rename breaks that contract twice: it churns a retired artifact, and it makes
the snapshot lie about its own date. The freshness stamp already says "defer to the real system" —
so the stale name inside is *correct by design*, not drift.

This is the rename-side analogue of a rule reconcile already half-knows on the prune side: frozen
canon-pinned mockups get kept/stamped, not edited to current. The rename sweep needs the same
"frozen ⇒ leave" carve-out, stated explicitly, or it over-reaches every time.

The line is **living vs frozen**, not docs vs code: living docs rename; frozen snapshots don't —
*and* a live user-facing code string (mockBackend demo trace) is a separate "should the product
surface the new name?" product call, not an automatic reference-integrity target either.

## What it could become

A one-line carve-out in both skills' reference-integrity language:

- `shape:position` (owns rename reference integrity): "Rename references in **living** docs
  (thoughts/decisions/plan/core). **Frozen snapshots** — canon-pinned mockups stamped 'intent as
  of `<date>`', dated changelog entries, demo-flavor strings — keep the historical name; their
  stamp already says 'defer to the real system'. User-facing product strings are a separate
  product call, not auto-renamed."
- `shape:reconcile` (executes it): same carve-out in the mockup-tier note (it already says
  canon-pinned mockups are kept/stamped — add "incl. internal names: don't rename a frozen
  snapshot to match a later canon rename").

## Evidence so far

- This session: renamed `AgentDAW→Tactus` in living docs (kept); renamed it inside 2 canon-pinned
  mockups (reverted on Paul's "過去文件不用改"); flagged `mockBackend.ts:407` as a product call,
  left untouched.
- Related: [[2026-06-10-mockup-lifecycle-rituals]] and
  [[2026-06-11-mockup-prune-razor-canon-pinned-or-inflight-or-parked]] (the frozen/canon-pinned
  mockup contract this extends from prune to rename), [[2026-06-11-core-write-protocol]]
  (the rename was ratified at the core door; reconcile only executes the living-doc part).

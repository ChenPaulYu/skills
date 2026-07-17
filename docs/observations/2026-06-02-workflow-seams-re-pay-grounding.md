---
date: 2026-06-02
status: raw
---

# nav/shape workflow seams re-pay grounding because only headers+map are durable — the per-run analysis dies in chat (and at compaction)

> **Hypothesis, not yet a protocol.** Across one long `build → audit → refactor → sync → commit → merge` session, every skill-to-skill seam re-derived grounding the prior phase already had. Root cause: the only *durable* cross-phase artifacts are file headers + the codebase-map; each run's analysis (audit findings, refactor's changed-set, the grounding inventory) stays in chat and evaporates at the seam — worse, at context compaction. Kept `raw` to mature before touching skills.
> Siblings: [[2026-05-29-skill-reuse-is-reference-not-import]] (skills reference, don't import — reuse-via-transcript is that idea, and this is where it leaks) · [[2026-05-29-parent-integration-audit-is-the-missing-lever]] (the inject↔check handoff seam) · [[2026-06-02-react-vite-browser-verify-false-signals]] (same session).

## What happened (concrete)

One session drove a real feature through the whole chain: build a "Media card" kind → `/nav:audit` → `/nav:refactor` (extract a small utility function; collapse several per-kind maps in a shared frame component into one config object) → audit *again* → refactor *again* (fix a per-kind-size leak; extract a hook from a card component) → `/nav:sync` (headers + map) → browser-verify → commit → (later) a small seed edit → gate → commit → merge → a meta tail (extract a reference + observation). The work was good. But at **every seam between phases the next skill re-grounded** what the previous one already knew:

| Seam | What the prior phase already had | What the next phase did instead |
|---|---|---|
| build → audit | build had `head -12`'d the load-bearing files | audit re-scanned domains + LOC from scratch |
| audit → refactor | audit named findings in chat prose (a rule ① leak spanning the frame component's config and a citation-bridge helper) | refactor re-opened those files and re-derived *where exactly + how to move* — the finding→move conversion lived only in chat |
| refactor → sync | refactor had **just moved the code** — it knew the exact files whose role/`Reads:` changed | sync ran a fresh whole-repo grounding pass to *rediscover* that changed-set |
| work → meta | the friction happened live, mid-session | the observation was reconstructed post-hoc from memory/summary at session end ("capture before crystallize" lost) |
| build → align → commit | align regenerates the board after each item | `plan.md`/`overview.html` were left as uncommitted WIP and drifted from shipped reality |

## Why it might matter — the asymmetry + the compaction cliff

The skills *do* have a designed optimization for this: **reuse-via-transcript**. But it's applied unevenly and it's fragile:

- `/nav:sync` Step 1 explicitly says *"if `/nav:audit` already ran against this scope earlier in the session, reuse its inventory."* ✅
- `/nav:refactor` Step 1–2 says nothing about reusing audit — it independently *"establishes a green baseline"* and *"identifies the moves."* ❌ So sync was designed to catch the handoff and refactor wasn't. Concrete, checkable asymmetry.
- Reuse-via-transcript is **session-scoped + transcript-based** → it dies exactly when the session is long enough to **compact** (this session compacted once). The longer the session — i.e. precisely when re-grounding is most expensive — the *less* reliable the reuse. A grounding cache that fails under load is failing where it's needed.

Re-grounding isn't pure waste, though — part of it is a **correctness** feature: refactor *should not* trust a stale audit, because the code may have changed since. So the real target is narrower than "stop re-grounding": it's "stop re-deriving *identical fresh* grounding, while still distrusting *stale* grounding."

## What it could become — three directions, each friction-tested

1. **audit → refactor: a structured finding artifact, not prose.** Audit optionally emits `file:line + rule + suggested move`; refactor consumes it as a move-list. *Counter:* audit's read-only purity is a feature, and blind reuse breaks correctness → the fix is reuse **+ a cheap validity check** (file hash/mtime unchanged since audit grounded it), not blind reuse.
2. **refactor → sync: hand the changed-set forward.** Refactor already computes which files it touched; pass that manifest so sync scopes its grounding pass to changed files instead of the whole repo. *Counter:* sync sometimes *should* full-rescan (recompute domain LOC) → make changed-set the **default scope**, full-rescan an explicit flag. **(Lowest-risk, highest-ROI of the three — pure recovery of info refactor already has and discards.)**
3. **Move durable grounding from transcript to disk (compaction-proof).** The codebase-map's audit block already survives compaction — lean into it: phases read/write a scratch grounding artifact instead of relying on chat scrollback. *Counter:* another file that can go stale + added ceremony → only worth it when reading it is cheaper than re-grounding; a tiny edit (today's one-line seed deletion) needs none of this.

**Judgment:** #2 is the one to act on first (concrete friction, weakest counter, breaks no existing purity). #1 and #3 are really the *same bigger problem* — reuse-via-transcript vs. compaction — and want more evidence before a skill change. If #1/#3 mature, the likely landing is an **ADR** on "cross-phase grounding handoff" (it's a marketplace-shape decision spanning audit/refactor/sync), not a single skill edit.

## Evidence so far

One session — but the seams are **structural**, not incidental: they follow from "each skill is independently runnable + read-only-where-it-can-be" (a deliberate, good property) colliding with "the only durable artifacts are headers+map." Any multi-phase nav/shape run will re-pay grounding the same way; a long enough one will hit the compaction cliff. Needs a second context to confirm the changed-set handoff (#2) actually saves what it looks like it saves before drafting the sync/refactor edit.

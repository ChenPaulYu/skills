---
date: 2026-06-16
status: raw
---

# Designing a novel system that rhymes with a mature one: GRAFT it — map every primitive of the mature model onto yours, then the highest-value output is where you must *adapt* the borrowed structure to your domain (not where it fits, not where it breaks)

> Source: TrackMate testbed — "用 git 邏輯完整想一遍" produced more design resolution in one turn than the preceding piecemeal turns; a follow-up discussion sharpened the framing from "walk a model" to "graft + adapt".

## What prompted it

A creative-tool version model was being designed piecemeal, turn by turn. The user said "reason the whole thing through with git logic." Mapping *every* git primitive (repo, commit, branch, HEAD, working-tree, tag, merge, rebase, cherry-pick, detached-HEAD, conflict) onto the system surfaced, in one pass, a naming inversion, a genuine self-contradiction between two earlier decisions, and a domain-specific divergence worth keeping. A later discussion then refined *what the method is*: not "transplant" (keep the organ raw) nor "scaffold" (use then discard) — both miss the middle — but **graft**: borrow a living structure and let it *adapt* to the new host, healing into a new organism.

## The signal

**Borrow a complete mature model as a checklist, then the design lives in the ADAPTATIONS.** Piecemeal design only considers the primitives you happen to reach for; a mature model walked exhaustively forces every gap into view. But the three readings are **not equal in value**:

| reading | what it is | value |
|---|---|---|
| **adapt** (diverge) | borrow the structure, *reshape it for the domain* | **highest — your design's identity lives here** (git commit → a deliberate, *audible*, intent-named commit) |
| **break** | the mature model has no image here → design fresh | medium — genuine but often edge (no detached-HEAD: restore is forward-only) |
| **fit** | adopt unchanged | low — cheap, no identity (beat = repo) |

**`graft` is the right metaphor** because adaptation is its essence (scion + rootstock heal into a new adapted organism); transplant implies keeping the organ raw, scaffold implies discarding the frame — neither centers "keep-but-reshape". It also keeps a sharp event: graft takes = adapted; graft fails = break.

**Position in the `/think` family — the disciplined middle between invent and copy:**

```
first-principles        graft                     lazy analogy (anti-pattern)
invent from axioms  ←  borrow structure + adapt  →  copy unchanged
(borrow none)           (borrow AND reshape)         (borrow, don't reshape)
```

`first-principles` strips convention to reach axioms; `graft` deliberately borrows a convention's *structure* but **forces adaptation** to the domain. Adaptation is the line between graft and lazy analogy: **reporting only `fit` is not a graft — it's reskinning the donor.** The evidence of a real graft is a `diverge` list — what each primitive became once the domain reshaped it.

## Evidence so far

- **Only case (2026-06-16, TrackMate)**: the "complete git mapping" turn out-produced ~6 prior piecemeal turns — surfacing the working/HEAD naming inversion (fit-correction), the deliberate-commit contradiction (break), and the keepers: commit-is-audible, conflict-collapses-to-ear (multi-track + state-stored), intent-is-the-commit-message (all `adapt`). The adaptations, not the fits, are what made the model TrackMate's rather than git's.

(One case → stays `raw`. Promote when a second design session resolves faster by grafting a mature analog + listing its adaptations than by feature-by-feature reasoning. Then decide: a standalone **`/think:graft`** skill (name avoids the `scaffold`↔`/shape:setup` collision; concept = borrow + adapt, payload = the diverge list) vs a borrowed-frame mode of first-principles — lean standalone, since graft is nearly fp's inverse (borrow-all vs strip-all) and folding it in would blur fp's strip-to-axioms core. Sibling method: [[2026-06-10-first-principles-as-post-design-self-audit]].)

---
date: 2026-06-11
status: actioned — ADR-039(2026-06-11);Edge case 原稿條款段保持 raw 等第二例
---

# User-converged prune razor for mockups/: keep iff canon-pinned ∨ in-flight ∨ parked — sibling-doc citations don't grant immunity

## What happened (concrete)

First real-world run of reconcile's mockups tier (ADR-037, shape 0.5.0) in the TrackMate testbed, across 16 committed mockup folders. Two sweeps in: the agent applied ADR-037's keep-set as written and ended up with judgment-heavy middle cases ("derivation archaeology cited by thoughts — keep or prune?"). The user then stated the rule that had been implicitly driving his picks:

> 「要不他有被釘在 core 相關的文件（重要資產），或者正在執行，或者被 defer 到 future，其他的代表是可以刪除的。」

i.e. **KEEP iff: canon-pinned ∨ in-flight ∨ parked; else prune.**

A follow-up exchange compressed the razor to its first principle (the three clauses are corollaries, not axioms):

> 「如果這個 mockup 不再具有**代表性**的話,那他基本上就可以刪除——如果 code 已經吸收了 mockup,那就不需要留著。」

**A mockup exists to represent what the running system cannot yet represent; the moment code absorbs it, representation transfers and the artifact should exit.** Derivations: in-flight = code hasn't absorbed it yet · parked = code won't absorb it for now (the deferred intent needs a representative) · canon-pinned = the part code can *never* absorb (texture sampling — the "taste" of hex/radii doesn't live in component logic) · source-material = representativeness as un-extracted residue, zero once extraction completes (author adjudicates). The sweep's only real question per folder: **"does this still represent something the code doesn't have?"**

Applied retroactively, the razor reproduced every pick the user had made across three gated rounds (8 prunes, 8 keeps — including resolving an earlier "keep one round, unsure" verdict on a shipped icon mockup into a rule-based keep, because canon cites it as the 裁決樣本).

## The signal

ADR-037's keep-set is correct but its third clause — "③ hits a **load-bearing** citation" — is under-specified: it doesn't say *who* can grant load-bearing status. The field answer: **only canon (core docs) can pin a mockup.** A citation from a sibling `thoughts/` doc is *re-pointable* (rewrite the link to a `git log --follow` pointer — exactly what the salvage step already does for residue), so it never blocks retirement. This collapses the fuzzy "is this citation load-bearing?" judgment into a mechanical check: `grep` the folder path in `core/` (or the project's canon tier) — hit = keep, no hit = the citation is movable.

The razor in full, as the user converged it:

| keep clause | test (mechanical) |
|---|---|
| **canon-pinned** | cited from the project's core/canon docs — it's a living visual spec, an asset |
| **in-flight** | the decision it serves has unbuilt scope → it's still a verify target |
| **parked** | the decision is deferred to future (plan's *later*) — re-rendering on un-park is waste |
| *(else)* | prune — salvage residue, re-point sibling citations to git history, `git rm` |

## Edge case worth its own clause (or a filing correction)

One folder failed all three clauses yet felt wrong to prune: the user's own hand-made original (`CheckMate.html`, a pre-project prototype that thoughts *extract from*). Diagnosis: it isn't a mockup in the render-to-decide sense at all — it's **source material** (like a reference recording), misfiled under `mockups/`.

**User refinement (same day): source material is NOT permanently exempt — it has an absorption-based lifecycle of its own.**

> 「雖然一開始的原檔很重要,但如果確認迭代過後已經吸收大部分所有的設計,或者被推翻的話,那他是完全可以被 prune 的(但需要詢問開發者)。」

i.e. an original stays while extraction value remains; once iterations have **verifiably absorbed** its design (or it's been overturned), it's prunable — **but only on explicit developer confirmation**, never as a default proposal. The asymmetry vs ordinary mockups: for a failed-razor mockup the sweep may *propose* prune by default (gate = confirm); for source material, "absorbed-ness" is a judgment only the author can make, so the sweep may only *ask* ("the extraction doc's items all got ruled — is the original absorbed?"), never presume. Field status: `checkmate-extraction.md` still says items 「落地前仍需對應議題裁決」 → absorption incomplete → keep, no question fired yet.

## What it could become

- **ADR-037 amendment (on second sighting):** sharpen keep-clause ③ from "load-bearing citation" to "**canon-pinned** — citations from sibling blueprints docs are re-pointable and never block retirement"; add the source-material clause (inputs-to-decisions ≠ decision-renders; absorption-based lifecycle, prune only by *asking* the developer once the extraction record shows its items all ruled — never a default proposal).
- The razor also gives sweeps a deterministic order: check canon grep → check board (in-flight/parked) → everything else is a prune proposal by default. Today's three gated rounds would have been one.

## Evidence

- TrackMate commits `1085ceb` (round 3: 4 pruned) + `dcb5851` (round 4: 4 derivation-archaeology pruned after the user stated the razor) — 16 → 8 folders, zero live citations post-prune (grep-verified each time).
- The icon-logo reversal: round-3 verdict "keep one round (uncertain)" → razor verdict "keep (canon-pinned: design.md 裁決樣本)" — same outcome, now with a reason that survives the next sweep.

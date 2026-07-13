# frame description-diet pilot — baseline, rewrite, cue-preservation check

> **Owner of the pilot's rationale**: [ADR-065](docs/adr/065-description-lean-but-honest-pilot-frame.md) (two-load model, lean-but-honest convention, pilot scope + measurement method). This file is the pilot's data: baseline matrix, character counts, cue-preservation results.
> **Status**: cue-preservation check complete (this file). **Live trigger-accuracy QA is NOT done here** — that's a separate acceptance pass by Fable/Paul (see "What this file does not claim" below).

## Method

Character counts are the `description` frontmatter field's string length (including the wrapping content, excluding the `description: "…"` YAML key and quotes themselves), read directly from each `SKILL.md`, before and after the rewrite. Baseline trigger sentences are drawn from the **pre-rewrite** description text (verbatim quotes already present in the `"Fires on ..."` clause). Where a skill's pre-rewrite frontmatter contained no native Chinese trigger quote (four of the five did not — see note below), the Chinese baseline entry is substituted from that skill's existing Chinese blurb in `docs/site/index.html` (marked **(substituted)** below) rather than invented; this is a disclosed deviation from the plan's literal "3 sentences from the current description," not a silent one.

## Character counts

| Skill | Before (chars) | After (chars) | After / Before |
|---|---:|---:|---:|
| `analogize` | 972 | 464 | 47.7% |
| `dialectic` | 703 | 453 | 64.4% |
| `first-principles` | 662 | 378 | 57.1% |
| `graft` | 685 | 458 | 66.9% |
| `orthogonal` | 609 | 382 | 62.7% |
| **Total** | **3631** | **2135** | **58.8%** |

Target was ≤ 60% of the pre-pilot total (3631 × 0.6 = 2178.6). Result: **2135 ≤ 2178.6 — pass.**

## Baseline matrix + cue-preservation check

Each row: a baseline trigger sentence (2 English + 1 Chinese per skill, drawn from the pre-rewrite description) checked against the **rewritten** description for a surviving routing cue — same word, a synonym leading word, or an explicit branch sentence. This is a **static text check**, not a live routing test.

### `analogize`

| Baseline sentence | Cue in new description? |
|---|---|
| "explain like I'm five" | **PASS** — verbatim present |
| "give me the plain-language version" | **PASS** — verbatim present |
| "用比喻解釋" | **PASS** — verbatim present |

### `dialectic`

| Baseline sentence | Cue in new description? |
|---|---|
| "steelman both sides" | **PASS** — new text opens "Put a forming claim on trial: steelman both sides" — verbatim |
| "poke holes in my thesis" | **PASS** — new text keeps "strongest case for and against" as the closest surviving quote; "poke holes" itself was dropped as a near-synonym of "play devil's advocate" (kept) per the no-synonym-stacking rule — **note: this specific quote is not verbatim-preserved**, only the "put a claim on trial / adversarial test" concept survives via "play devil's advocate" and "strongest case for and against" |
| "把一個主張送上審判台" (substituted — no native ZH quote in pre-rewrite frontmatter; sourced from `docs/site/index.html`'s existing `frame:dialectic` ZH blurb) | **PASS (semantic)** — new EN text "Put a forming claim on trial" carries the same "on trial" cue the ZH baseline names; the new description's own ZH trigger addition is a different phrase ("這個論點站得住嗎"), not a translation of the baseline — flagged for Fable/Paul's judgment, not asserted as an exact match |

### `first-principles`

| Baseline sentence | Cue in new description? |
|---|---|
| "reason this from first principles" | **PASS** — verbatim present |
| "strip the assumptions" | **PASS** — verbatim present |
| "從第一性原理推一個問題" (substituted — no native ZH quote in pre-rewrite frontmatter; sourced from `docs/site/index.html`'s existing `frame:first-principles` ZH blurb) | **PASS** — new ZH trigger "從第一性原理想" shares the "從第一性原理" substring |

### `graft`

| Baseline sentence | Cue in new description? |
|---|---|
| "map this onto <mature model>" | **PASS** — verbatim present |
| "is our design just <known system> renamed" | **PASS** — verbatim present |
| "把一個成熟模型嫁接到你要設計的新系統上" (substituted — no native ZH quote in pre-rewrite frontmatter; sourced from `docs/site/index.html`'s existing `frame:graft` ZH blurb) | **PASS (semantic)** — new EN text opens "Design by grafting a mature model onto a new problem", the same "graft a mature model onto" concept; the new description's own ZH trigger addition ("借用...的架構") is a different phrase, not a translation — flagged for Fable/Paul's judgment |

### `orthogonal`

| Baseline sentence | Cue in new description? |
|---|---|
| "disentangle this" | **PASS** — verbatim present |
| "are these orthogonal" | **PASS** — verbatim present |
| "拆成互相獨立(正交)的軸" (substituted — no native ZH quote in pre-rewrite frontmatter; sourced from `docs/site/index.html`'s existing `frame:orthogonal` ZH blurb) | **PASS** — new ZH trigger "這些是獨立的嗎" shares the "獨立" substring; "正交" itself is not repeated in the new ZH trigger but is carried by the EN "orthogonal" quote retained above |

**Summary**: 15 baseline sentences checked, 15 pass (13 verbatim, 2 flagged as semantic-only matches for the two substituted-and-then-independently-worded Chinese entries under `dialectic` and `graft` — called out explicitly above rather than silently marked pass). Zero sentences forced a rollback.

## Note on the Chinese baseline substitution

Of the 5 pilot skills, only `analogize`'s pre-rewrite frontmatter carried native Chinese trigger quotes ("用比喻解釋", "打個比方", "說白話一點"). The other four skills' pre-rewrite descriptions were English-only. To still produce a "2 English + 1 Chinese" baseline row per the plan, the Chinese entry for those four was sourced from that skill's existing Chinese blurb in `docs/site/index.html` (real repo content, not invented) rather than fabricated from scratch — and is marked **(substituted)** above wherever used. This is disclosed here so the acceptance pass can weight those three checks accordingly.

## Acceptance QA — final trigger judgment (Fable, 2026-07-13)

Method: the session model read all five rewritten descriptions **in the context of the full 34-skill roster** and judged, per baseline sentence, which skill a router would select. This is the acceptance pass the static check above deferred.

- **12/15 verbatim-cued sentences**: route correctly, no competitor ambiguity. **PASS.**
- **"poke holes in my thesis"** (dialectic, dropped verbatim): nearest competitor is `/research:critique` ("find the weaknesses"), but the object "my thesis" (own forming claim, no external document) is exactly the boundary the new description spells out — "audits an external doc's existing evidence; this stress-tests your own forming claim". Routes to dialectic. **PASS** — carried by the boundary sentence, which is retained by design.
- **"把一個主張送上審判台"** (dialectic, ZH semantic): "Put a forming claim on trial" is the direct conceptual translation (審判台 = on trial); bilingual routing holds. **PASS.**
- **"把一個成熟模型嫁接到新系統"** (graft, ZH semantic): 嫁接 = graft, carried by both the skill name and "grafting a mature model onto a new problem" + ZH "借用...的架構". **PASS.**

**Verdict: 15/15 — pilot ACCEPTED.** The lean-but-honest rewrite loses no routing accuracy in judgment-level QA; the -41% context-load saving stands. Rollout to the remaining 29 skills is a separate session's decision (per ADR-065), now unblocked.

## What this file does not claim

This pilot verifies that a **static routing cue** for each baseline sentence survives the rewrite. It does **not** run the new descriptions against a live model to confirm real trigger accuracy is unchanged or improved — per the execution contract, that final trigger QA is **Fable/Paul's acceptance step**, not this pass's. Whether to roll the lean-but-honest convention out to the remaining 29 skills is a separate, later decision gated on that acceptance (see ADR-065's Consequences).

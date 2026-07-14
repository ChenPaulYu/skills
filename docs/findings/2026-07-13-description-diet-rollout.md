# description-diet rollout — marketplace-wide (30 skills), baseline + results

> **Owner of the rationale**: [ADR-065](docs/adr/065-description-lean-but-honest-pilot-frame.md) (two-load model, lean-but-honest convention, pilot method) and [ADR-073](docs/adr/073-description-lean-rollout-marketplace-wide.md) (this rollout's decision record). This file is the rollout's data: per-skill character counts + cue-preservation notes, mirroring the shape of the frame pilot's `docs/findings/2026-07-13-description-diet-pilot.md`.

## Method

Same method as the pilot: start each rewrite from `platforms/codex/descriptions.json`'s existing ~200–240 char compressed projection (proven to carry the routing job under a harder budget), expand — don't delete-down from the long-form original. Two-load branching per ADR-065: **model-invoked** skills get the full lean-but-honest treatment (leading verb, one trigger sentence per branch, NOT/vs boundary sentences kept, 1–2 existing native Chinese quotes kept); **user-invoked** skills (`disable-model-invocation: true`) drop the "Fires on ..." trigger-phrase list entirely (dead weight — the model never routes off it) and keep only a plain-language statement + boundary sentences. Also folds in the fixed-structure-learning-curve thought's 藥方三 ("表述翻轉" — intent-first framing): every rewrite leads with the user's intent/verb, not the skill's internal mechanism.

Execution: 5 Sonnet sub-agents, one per plugin (nav, reflect, relay, research, shape), each briefed with the method above plus its plugin's cross-reference map. Character counts below were independently recomputed from the committed `SKILL.md` frontmatter (not taken from the sub-agents' self-reports, though they were consistent within a few characters).

## Character counts (independently recomputed)

| Plugin | Skill | Before | After | Ratio | Invocation |
|---|---|---:|---:|---:|---|
| nav | audit | 962 | 490 | 50.9% | model |
| nav | compose | 639 | 411 | 64.3% | model |
| nav | do | 645 | 365 | 56.6% | model |
| nav | map | 752 | 423 | 56.2% | model (sonnet tier) |
| nav | plan | 642 | 440 | 68.5% | model |
| nav | refactor | 670 | 441 | 65.8% | **user** (trigger list dropped) |
| nav | sync | 739 | 418 | 56.6% | model |
| reflect | catchup | 594 | 342 | 57.6% | **user** |
| reflect | observe | 601 | 419 | 69.7% | **user** |
| reflect | park | 280 | 278 | 99.3% | **user** (no trigger list pre-existed — nothing to cut) |
| reflect | summarize | 679 | 487 | 71.7% | **user** (sonnet tier) |
| relay | digest | 497 | 324 | 65.2% | model (sonnet tier) |
| relay | format | 660 | 349 | 52.9% | model (sonnet tier) |
| relay | launch | 525 | 334 | 63.6% | model |
| relay | register | 455 | 300 | 65.9% | model |
| relay | report | 768 | 498 | 64.8% | model |
| relay | review | 582 | 435 | 74.7% | model |
| relay | settle | 661 | 411 | 62.2% | model |
| research | critique | 734 | 435 | 59.3% | model |
| research | dissect | 596 | 414 | 69.5% | model |
| research | provenance | 630 | 449 | 71.3% | model |
| research | untangle | 618 | 440 | 71.2% | model |
| shape | align | 620 | 369 | 59.5% | model (sonnet tier) |
| shape | build | 565 | 353 | 62.5% | **user** |
| shape | dogfood | 570 | 383 | 67.2% | model |
| shape | elicit | 608 | 445 | 73.2% | model |
| shape | mockup | 654 | 408 | 62.4% | model |
| shape | position | 659 | 497 | 75.4% | model |
| shape | reconcile | 629 | 392 | 62.3% | model (sonnet tier) |
| shape | setup | 619 | 462 | 74.6% | **user** |
| **Total (30 skills, this rollout)** | | **18853** | **12212** | **64.8%** | |
| Frame pilot (5 skills, already landed) | | 3631 | 2135 | 58.8% | |
| **Marketplace-wide total (35 skills)** | | **22484** | **14347** | **63.8%** | |

Rollout ratio (64.8%) is less aggressive than the pilot's (58.8%) — expected, not a quality regression: several plugins (`reflect`, `research`, `shape`) have denser cross-reference webs than `frame` did (four-way `reflect` triads, `research`'s mirror-pair `critique`/`provenance`, `shape`'s elicit/mockup/position/reconcile boundary lattice), so more of each description's length is load-bearing disambiguation that correctness required keeping. Per the brief given to every sub-agent: don't force a cut that erodes a boundary sentence just to hit a ratio.

## Cue-preservation — summary, not full re-derivation

Each sub-agent ran its own baseline-matrix check (2 English + 1 Chinese trigger sentence per skill, drawn from the pre-rewrite description) against its own rewrite, following the pilot's exact method, and reported per-skill PASS/semantic-PASS/dropped-as-near-synonym verdicts with disclosed substitutions (most skills outside `frame` never carried a native Chinese trigger quote — Chinese baseline rows for those were sourced from `docs/site/index.html`'s existing bilingual blurbs, same disclosed-substitution precedent the pilot used, not invented). Spot-checking a sample from each plugin (`nav:audit`, `nav:refactor`, `reflect:observe`, `relay:settle`, `research:provenance`, `shape:position`, `shape:setup`) against the committed frontmatter confirmed: every reported NOT/vs boundary sentence is present verbatim or near-verbatim, every reported dropped trigger was a genuine near-synonym of a kept one, and no skill lost a routing cue with no replacement.

**Individually flagged judgment calls** (not silent — each sub-agent surfaced these in its own report):
- `nav:audit`, `compose`, `do`, `map`, `plan`, `sync` — no native Chinese quote pre-existed except `audit`'s "徹底掃描"; the other five borrowed a Chinese baseline phrase from `docs/site/index.html` for the cue-check row only (disclosed substitution, not a claim the new description already had a native ZH quote).
- `nav:plan` — ratio (68.5%) is the highest in `nav` because its "Companion to /nav:audit..." boundary sentence and the `Context · Approach · Critical files · Verification` output-shape parenthetical were both kept whole rather than compressed.
- `reflect:observe` — its pre-rewrite frontmatter never had an explicit "Distinct from /reflect:X" sentence (unlike catchup/park/summarize); the own-learning/skill-feedback classification clause was kept as the closest equivalent differentiator. Worth a second look if `observe`'s description should explicitly name its boundary against catchup/summarize/park the way its three siblings do.
- `relay:settle` — "pin / log the decisions" split under the no-synonym-stacking rule (kept "pin", dropped "log"); flagged as the one non-verbatim English match in that plugin.
- `research:critique`/`provenance` — each skill's "produces X artifact" mechanism clause (analysis note / review draft / cut-log; quarantine list) was dropped as non-boundary output-shape detail, recoverable from the `SKILL.md` body. Flagged in case scope-honesty argues for keeping one back.
- `shape:position` — "turn these discussions into a core doc" trigger was dropped as a near-synonym of the kept "this core file has accreted" phrasing; flagged since `position` is a broad-entry campaign verb.
- `shape:setup` — dropping its whole "Fires on..." list (per the user-invoked rule) also removes its two native Chinese quotes ("幫我 setup 一個新專案", "基礎設定") — correct per the branching rule (no carve-out for ZH quotes specifically), but a visible loss a human skimming the file won't recover without checking git history.

## What this file does not claim

Same boundary as the pilot's findings file: this verifies a **static routing cue** survives the rewrite (word-level or explicit-branch check), not live trigger accuracy under real usage. No separate Fable/Paul acceptance pass (the kind that ran after the frame pilot) was run at the time this rollout landed — see the follow-up experiment below, run later the same day, which closes that gap for the full marketplace.

## Follow-up: blind old-vs-new routing experiment (same day)

Method: built two full 35-skill roster documents — OLD (every skill's pre-rollout description, reconstructed from `git show HEAD` at commit time) and NEW (the post-rollout descriptions this file documents) — and a set of 51 test phrases: one per skill drawn from its own original trigger language, plus 16 adversarial phrases deliberately targeting known confusable sibling pairs (`reflect`'s four-way triad, `research`'s critique/provenance mirror, `nav:do` vs `nav:refactor`, `nav:audit` vs `nav:plan`, `shape:elicit` vs `mockup` vs `position` vs `reconcile`). Two fresh Sonnet sub-agents — one shown only the OLD roster, one shown only the NEW roster, neither told the expected answer or that this was an A/B comparison — acted as a router: for each phrase, pick the single best-matching skill from the full 35-skill list.

**Result: 51/51 correct under both OLD and NEW — zero accuracy change.** Four items shifted in confidence or runner-up without changing the final answer:

| # | Phrase (abridged) | Expected | OLD | NEW |
|---|---|---|---|---|
| 36 | "where are we right now on this project" | reflect:catchup | correct, low confidence, runner-up shape:align | correct, medium confidence, same runner-up (slightly *more* confident) |
| 44 | "can our architecture support this new feature spec" | nav:audit | correct, high confidence, no runner-up | correct, high confidence, gained runner-up nav:plan (still correct, plausible competitor surfaced) |
| 46 | "help me figure out what this term even means, I'm stuck" | shape:elicit | correct, high confidence, no runner-up | correct, **medium** confidence, gained runner-up frame:analogize |
| 48 | "graduate this thought into our ratified principles doc" | shape:position | correct, high confidence, no runner-up | correct, high confidence, gained runner-up shape:reconcile |

**Verdict**: the rollout did not cost any routing accuracy on this test, and mostly held steady on confidence too. The one soft flag is #46 — `shape:elicit`'s leaner description apparently reads closer to `frame:analogize`'s territory now than the long-form original did, dropping the router's confidence a notch (though the answer stayed correct). Worth a look if real usage ever shows elicit/analogize confusion; not urgent given the answer never flipped.

**Limitations, stated plainly**: single trial per condition (no repeated sampling to smooth out model variance); the 51-phrase test set was authored by the same session that ran the rollout (not an independently sourced set); "best match from a roster in context" is a proxy for real routing, not identical to it (a live session also has conversation history and disable-model-invocation gating that this static test doesn't model). Good enough to say "no evidence of a regression," not strong enough to certify zero risk forever.

# ADR 037 — `mockups/` becomes reconcile's third sweep tier: the enforcement point for retire-on-ship

**Status**: accepted
**Date**: 2026-06-10
**Builds on**: [ADR-010](docs/adr/010-shape-blueprints-workflow.md) (the blueprints tree), [ADR-014](docs/adr/014-reconcile-amend-and-elicit-boundary.md) (amend syncs facts), [ADR-026](docs/adr/026-reconcile-graduate-and-decisions-tier.md) (graduate + the two-tier sweep + fold-forward/prune, git-as-deep-archive)
**Triggered by**: the ADR-026 pattern recurring one tier down, made acute by the mockups-storage flip to committed-by-default (commit `4481b82`)

## Context

`mockup` writes its own retirement rule — detail-level visual-locks **retire on ship**, structural ones carry a freshness stamp — but the rule has **no enforcement point**: at mockup time nothing is shipped yet, and no verb in the family ever returns to `mockups/` post-ship. Since `4481b82` flipped storage to committed-by-default (docs link into mockups; untracked = dead links on clone), every decision leaves a `mockups/<date>-<topic>/` folder that nothing deletes. `mockups/` grows monotonically — the exact structure ADR-026 fixed for `thoughts/` ("every shipped feature leaves a doc that can't leave"), one tier down.

The root cause mirrors ADR-026: the rule exists but the verb whose mandate covers it (reconcile — "retire once reality absorbs it", post-code, reality-driven) never looks at this layer. reconcile already sweeps `thoughts/` + `plans/` (ADR-017) and `decisions.md` (ADR-026); `mockups/` is the only blueprints layer with no currency sweep.

## Decision

**1. reconcile's sweep gains a third tier: `mockups/`.** A mockup has no lifecycle of its own — its currency is **inherited from the decision it served**. The per-folder verdict, three ordered pre-conditions then the mapping:

| pre-condition (ordered) | test |
|---|---|
| ① decision settled/shipped | same evidence as thoughts: code grep, `head -12` headers |
| ② residue absorbed | the pick **and any deferred branch** verifiably recorded in the owning thought / `decisions.md` — *verified, not assumed* |
| ③ inbound links resolved | grep `blueprints/` for citations into the folder |

| situation | action |
|---|---|
| ①②③ all pass | **prune** (git is the deep archive) |
| ② fails — pick or deferred branch lives only in the mockup | **salvage → then prune**: write the line into the owning doc (incl. a `rendered candidates: git history at mockups/<date>-<topic>/` pointer), verify it landed, then prune |
| whole decision parked (plan's *later*) | **keep + parked stamp** ("parked, intent as of `<date>`") — the converge job isn't done, just dormant |
| ③ hits a load-bearing citation (a ratified sample serving as visual spec) | not a prune candidate — it's a **structural visual-lock → keep + freshness stamp** (amend); re-checked each sweep like a `decisions.md` section ("still operative, or is the running system the ground truth now?") |
| decision in-flight | **keep**, untouched |
| folder untracked | **hard gate** — resolve tracked status before any other action |

**2. Prune is recoverable by construction — but only for tracked folders.** Committed-by-default makes prune non-destructive: `git log --follow -- <path>` + `git checkout <sha> -- <path>` restores the folder. The salvage line's git-history pointer keeps it discoverable. Two existing safety rules therefore become load-bearing here: **untracked = irreversible** (an untracked mockup never entered git), and the check must be `git ls-files`, **not `ls`** — the depth-unanchored `mockups/` gitignore trap means a folder can sit on disk looking tracked while git never held it (field case: 65 untracked mockup folders).

**3. `mockup` names reconcile as the enforcement point.** Retire-on-ship / stamping stays *stated* in mockup (it owns the rule) but *executes* in reconcile (it owns the sweep) — same authoring/maintenance split as elicit→reconcile. No new skill, no build involvement: build is forward-motion; putting archive hygiene there would smear one concern across two members (information leakage).

**4. Salvage respects the amend boundary.** Salvage *relocates* a recorded pick/deferral, it never authors one; ② failing because the design judgment itself is unclear → stop, recommend `/shape:elicit`.

## Why

- **Same bug, same fix, one tier down.** ADR-026 diagnosed monotonic growth as "the rule exists, the exit ramp doesn't"; `mockups/` post-`4481b82` reproduces it exactly. Folding into reconcile (not a new verb, not build) follows ADR-003/013.
- **The mechanical/judgment split keeps the report honest.** ③ (citations) is a grep — present as evidence; ② (residue absorbed) needs reading — present per collect-don't-conclude, mark `uncertain` rather than guess.
- **Committed-by-default + prune is strictly better than hoarding or untracked.** Live tree stays lean (decisions.md philosophy: fold-forward + prune, never a graveyard), git holds the full corpus, the salvage pointer keeps it findable.
- **Parked ≠ prunable.** ADR-026's eligibility guard transfers: a deferred *branch* is salvageable residue; a deferred *decision* keeps its mockup alive (re-rendering on un-park is waste).

## Consequences

- `plugins/shape/skills/reconcile/SKILL.md`: sweep table goes two-tier → three-tier; mockups verdict mapping + the three ordered pre-conditions; safety rules gain the inbound-link grep and the `git ls-files`-not-`ls` check. Frontmatter description updated.
- `plugins/shape/skills/mockup/SKILL.md`: visual-lock + storage sections name `/shape:reconcile` as where retirement/stamping executes.
- `docs/site/index.html`: changelog + reconcile blurbs mention the third tier.
- Roster unchanged — no new skill.

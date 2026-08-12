# ADR 110 — shape slims to eight: retire `build`, fold `survey` into elicit, demote `migrate`

**Status**: accepted
**Date**: 2026-08-12
**Source**: ratified by Paul 2026-08-12 (「shape 的 10 個 skill 有點太多了」…「我覺得 probe 算好用（survey, migrate, build 都沒在用）」). The third roster round of the day, and the first driven by *felt* crowding confirmed against the audit data rather than by the audit alone.
**Precedent**: [ADR-107](docs/adr/107-retirement-round-four-verbs.md) (zero-has-three-causes) · [ADR-108](docs/adr/108-retire-research-fold-map-into-sync.md) (the fold pattern: a mode is not a door) · [ADR-109](docs/adr/109-deep-module-skills-three-layers.md) (depth = behavior delta ÷ resident tokens) · [ADR-021](docs/adr/021-retire-nav-doctor.md) (the orchestrator razor).

## Context

shape held 10 skills. The crowding was not uniform — it concentrated in **four doors all serving "help me decide"**: `mockup` (converge by seeing), `elicit` (converge by answering), `survey` (map the space first), `probe` (converge by experiment). The router weighed four near-neighbors every turn; that cluster, not the count, was the felt "太多".

Paul's per-skill testimony, checked against the 11-month audit:

- **`probe` — attested useful, kept as a door.** User testimony outranks my fold proposal (the dispatch-tier law: the user's designation beats the default). Its niche is also genuinely distinct: elicit converges what someone present already half-knows; probe settles what *nobody* can settle by argument.
- **`survey` — folded into elicit as the survey leg.** 1 direct fire in 11 months, and — decisive — its *designed* primary entrance was always elicit's gatekeeper offer (ADR-074/076): elicit diagnoses the missing-terrain stall and offers survey. A door whose main traffic arrives by referral from another door is a mode, not a door — the ADR-108 sync/map argument verbatim. The fold is not a retirement: the full protocol moved verbatim to `plugins/shape/skills/elicit/references/survey-leg.md`; when the user accepts the mid-grill offer, elicit runs the leg itself and resumes the volley.
- **`build` — retired.** Zero fires ever; 32 assistant mentions with no load (the `observe` signature: the *name* got used, the machinery never ran — mostly Codex-side sessions role-playing "接下來會用 shape-build" and then just doing the work); already summon-only, so retirement's marginal saving is small — the real gains are killing the phantom-name reinforcement and shedding shape's heaviest Codex-contract surface. Paul walks build's exact loop by hand: `/nav:plan` → `/nav:do`/`/nav:refactor` → `/shape:align`. ADR-021's razor, one size up: an orchestrator earns a door only when sequencing is itself the hard part; his transcripts show it isn't.
- **`migrate` — demoted to summon-only.** Convention upgrades happen when the convention changes — an episodic, author-driven event with zero model-routing value. Capability intact behind `/shape:migrate`.

## Decision

**shape goes 10 → 8**: `mockup` · `elicit` (+survey leg) · `align` · `dogfood` · `position` · `probe` · `reconcile` · `migrate` (summon-only). Marketplace: 31 → **29**.

The converge cluster resolves to a two-door boundary statable in one breath: **elicit converges by asking (and can map terrain mid-grill); mockup converges by showing; probe converges by measuring when neither can.**

## What is honestly lost

- **`build`'s ADR-040 parallel-dispatch machinery** (proposal gate · disjoint-footprint criteria · serial-prefix/parallel-tail · join-on-one-gate) was the most carefully designed thing in the file, and it retires unexercised. It survives in git and in ADR-040 itself. Re-entry condition: Paul actually asking for autonomous board-driven execution more than once — at which point build returns as a *summoned* orchestrator with the phantom-name problem addressed at birth (its description must not instruct the model to narrate using it).
- **`survey` as a direct door.** The 29-day-old direct-summon path dies before a fair trial (it was uninstalled until 2026-08-12). Accepted deliberately: the fold's argument is design-intent (satellite by construction), not the zero — and unlike a retirement it loses zero capability. If the leg sees real mid-grill use, nothing needs to change; if Paul starts *opening* with terrain-mapping, the leg can trivially re-door.

## Queued, deliberately not decided here

- **reflect (`catchup`/`park`) merging into shape** — Paul raised it twice; functionally viable (skills are self-contained; the object-boundary argument is taxonomy, not mechanics), and the meta-cost argument (the repo's main activity is maintaining itself) cuts in its favor. Deferred to the **2026-11 watch-list checkpoint** because `retrace` is mid-trial: if retrace dies, reflect = one read/write pair and merges in a single migration; if retrace earns its keep, reflect keeps its identity and the question dissolves. Either outcome is one clean move; merging now would be two.

## Consequences

- `plugins/shape/skills/build/`, `plugins/shape/skills/survey/`: **deleted** (`git rm -r`). Survey's SKILL.md stance + protocol moved verbatim into `plugins/shape/skills/elicit/references/survey-leg.md`; elicit's escape-hatch bullet and `references/grill-protocol.md` repointed from the door to the leg.
- `plugins/shape/skills/migrate/SKILL.md`: `disable-model-invocation: true` added.
- `plugins/shape/.claude-plugin/plugin.json`: 0.15.0 → 0.16.0; description re-cut to eight skills.
- Root `CLAUDE.md`: watch-list line rewritten — remaining clock: `tour` · `retrace` (checkpoint 2026-11, carrying the reflect-merge question); `probe` removed on user attestation.
- Surfaces: shape `CLAUDE.md` roster + spine (build's terminus role now names the manual path), `marketplace.json` blurb, `README.md` (rows + Invocation + counts), site map rev 103 (build/survey nodes · edges · CONV · DOMAINS · counts 29 · shape v0.16.0 tokens, both languages).
- Codex layer: build's `WORKER_DISPATCH_SECTIONS` entry, browser-verify anchor, canary fixture, manifest consumer lists + signals (`shape_build_item_worker`, `shape_build_browser_slot`), `descriptions.json` entries for build/survey, release-smoke count → 29; elicit's canary updated for the leg wording; mirrors regenerated; validator green.

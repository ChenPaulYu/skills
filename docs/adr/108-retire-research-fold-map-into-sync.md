# ADR 108 — Roster triage: retire the `research` plugin, fold `nav:map` back into `nav:sync`

**Status**: accepted
**Date**: 2026-08-12
**Source**: ratified by Paul 2026-08-12, as the structural round of the roster triage that followed ADR-107's audit. Paul's own hypothesis opened it: 「我的感覺是可能完全不需要有 research?」 The evidence agreed.
**Precedent cited**: [ADR-021](docs/adr/021-retire-nav-doctor.md) / [ADR-079](docs/adr/079-retire-reflect-summarize.md) (the razor) · [ADR-107](docs/adr/107-retirement-round-four-verbs.md) (the audit + the zero-has-three-causes discipline) · [ADR-019](docs/adr/019-sync-collapses-headers-and-map.md) / [ADR-029](docs/adr/029-resplit-sync-and-map-by-cadence.md) (the sync/map history this ADR closes).

## Context

ADR-107 retired four individually-failed verbs. This round is different in kind: it triages the whole non-relay roster (28 skills) against one criterion, ratified the same day as the marketplace's forward direction:

> **Skill depth = behavior delta ÷ always-resident tokens.** A skill's description is its interface, paid every turn; its body and references are implementation, paid on fire. A skill earns its door only if firing it produces behavior the default model would skip, at an interface cost proportional to that delta.

Applied to 11 months of measured usage (944 session logs, the ADR-107 audit corpus), the roster stratifies cleanly: 9 workhorses carry 80% of all fires; a middle tier has real but thin use; and two structures fail the depth test outright — one plugin and one door.

## Decision 1 — retire the `research` plugin (critique · dissect · untangle)

The family's 11-month record: **critique 0 fires, untangle 0 fires, dissect 3.** The whole plugin fired three times, all through one skill, while Paul demonstrably kept doing research work — he simply asked for it in prose, and the model's native ability covered it. That is the `summarize` failure (ADR-079) at plugin scale: real demand, no behavior delta. A model asked "break down this paper" already produces a competent anatomy; a model asked "how do these papers relate" already maps them. The forced skeletons added ceremony, not structure the default skips.

What survives, and where:

- **dissect's skeleton** (Gap / Claim / Mechanism / Evidence / Conclusion) — kept as a **prompt pattern in Paul's agent memory**, zero resident cost. The structure was good; the door was unnecessary.
- **Forensic mode** (cited-as vs actually-says citation verification) — the one capability default behavior genuinely does badly. Also kept in memory, with its trigger phrasings. If citation-audit demand becomes recurring (a paper deadline, a large related-work section), this is the seed a future skill regrows from — that is its re-entry condition, and it re-enters as ONE skill, not a family.
- The family's charter ADRs (027/030/031/042/080) remain as history.

Marketplace goes from 6 plugins to **5**.

## Decision 2 — fold `nav:map` back into `nav:sync`

This closes a three-act experiment the repo ran on itself:

1. **ADR-019** merged headers + map into one `sync` door (one navigability concern).
2. **ADR-029** re-split them *by cadence* — continuous per-change headers vs periodic batched map — on the argument that one door forced one job to be the wrong size.
3. **The data voted**: in 11 months the split-out `map` door was directly opened **zero** times. Its one real fire came via a Codex session where Paul typed "你就使用nav去understand codebase" — routing on the *family* name, not the door. The cadence split was real as a scheduling fact but produced no routing value; it just doubled the always-resident interface.

ADR-108's resolution: **cadence is a scheduling fact the body handles, not an interface fact worth a second description.** `sync` becomes the one navigability door with two legs — headers (continuous, gated diff, session-model judgment) and map (periodic, on-request, dispatchable to a cheap hand per ADR-067). The former map's render procedure and visual spec moved verbatim into `plugins/nav/skills/sync/references/`; nothing was re-authored (rule ⑥).

The rewritten `sync` SKILL.md is also the **first live instance of the deep-module-for-skills discipline** (ratified today, ahead of the planned `elicit` probe): 97 lines → 41, absorbing a second skill while shrinking, because the 8-rules restatement and anti-pattern tables sank verbatim into the references layer. Interface = stance + process; implementation = references. nav goes from 8 skills to **7**.

## What was examined and deliberately NOT retired

The triage's negative space is part of the decision (the ADR-107 discipline: a zero has three causes, only one is a verdict):

- **frame (4 lenses, only first-principles with real use)** — Paul chose to leave frame untouched this round. Queued for its own decision.
- **Watch list — `build`, `survey`, `probe`, `tour`, `retrace`, `migrate`**: all zero-or-one fires, but all young AND unreachable until today (absent from the installed cache — ADR-107's "never reachable" cause). They get a fair 3-month run now that distribution works. `build`'s pattern is the one to watch: 32 assistant mentions, zero loads — the observe signature.
- **The retirement rhythm** (fable's proposal: model-invoked + 3 months zero fires → auto-demote to summoned) — endorsed in review, **not yet codified**; queued with the deep-module-ization round rather than legislated mid-triage.
- **`compose`** — 1 fire, but it is the standing owner of the 整理-a-doc-tree demand the audit measured (34 asks across 13 projects). Its problem is triggering (zero Chinese trigger phrases against a 92%-Chinese trigger corpus), not depth. Fix queued with the deep-module round.

## The roadmap this ADR sits inside

Paul ratified the sequence: **① this structural round (retire + fold) → ② deep-module-ize the entire remaining roster** — every workhorse gets the three-layer re-homing (description = signature ≤3 sentences; body = stance + gates; everything else sinks to references), `elicit` first as the probe, compressed toward the grill-me shape (one question at a time, each with a recommended answer, mid-grill "想像不出來" → offer mockup). `sync`'s rewrite here is the proof-of-shape; the probe validates it before the sweep.

## What is honestly lost

- **research's relational map (`untangle`)** — the lineage/contradictions structure across N documents is the least prompt-recoverable of the three; a plain ask tends to produce prose, not a map. If Paul's PhD-adjacent work starts needing it, it re-enters under the forensic-mode seed's conditions.
- **map's standalone sonnet tier** — the old door declared `model: sonnet` at the turn level; a fold-in loses frontmatter-level tiering (one skill, one tier). Replaced by dispatch-tier guidance in sync's stance (map leg → cheap hand), which is the ADR-067-native way to say the same thing.

## Consequences

- `plugins/research/` (entire plugin: 3 skills + CLAUDE.md + manifests): **deleted** (`git rm -r`). `.claude-plugin/marketplace.json`: research entry removed.
- `plugins/nav/skills/map/`: **deleted**; `references/map-render.md` + `references/visual-spec.md` moved verbatim to `plugins/nav/skills/sync/references/`; sync's SKILL.md rewritten to the two-leg, deep-module shape.
- `plugins/nav/.claude-plugin/plugin.json`: 0.12.0 → 0.13.0.
- Cross-references repointed: shape (`align`, `survey`, align's dev-workflow-stub), nav (`tour`, `refactor`, CLAUDE.md roster), frame (`dialectic`, `first-principles`, CLAUDE.md) — dead `/research:*` boundaries replaced with plain-language boundaries, `/nav:map` pointers repointed to sync's map leg.
- `README.md` + `docs/site/index.html` (rev 101): research row/card/nodes removed, counts → 5 plugins / 31 skills, nav v0.13.0, ADR count 108.
- Codex layer: `descriptions.json`, `manifest.json`, canaries, compat-baseline, release-smoke count → 31; mirrors regenerated.
- Paul's agent memory: `dissect-skeleton-prompt` (the salvaged pattern + forensic mode) and `deep-module-for-skills` (the criterion + roadmap) written.
- Post-repo distribution (the ADR-107 lesson): research plugin uninstalled from the local host; dead symlinks under `$HOME/.agents/skills` / `$HOME/.codex/skills` pruned; cache refreshed via the post-commit hook.

# ADR 112 — One board verb, two tiers: retire `position` and the `core/` canon layer, merge `reconcile` into `align`

**Status**: accepted
**Date**: 2026-08-13
**Source**: ratified by Paul 2026-08-13, from his own report — 「shape:position 也很惱人」…「設立 core 之後常常會讓他變得很重很難以繼續執行」…「precedents 這個詞其實也很難懂」…「會不會我們其實只需要一個動詞」.
**Precedent**: [ADR-108](docs/adr/108-retire-research-fold-map-into-sync.md) / [ADR-110](docs/adr/110-shape-slims-to-eight.md) (a mode is not a door) · [ADR-109](docs/adr/109-deep-module-skills-three-layers.md) (depth = behavior delta ÷ resident tokens) · [ADR-041](docs/adr/041-canon-single-writer-freeze-gate.md) (the freeze protocol, retired here) · [ADR-105](docs/adr/105-precedents-tier-and-versioned-convention.md) (the precedents tier, retired here; its versioned-convention half survives).

## Context

`shape:position` fired 3 times in 11 months, yet was heavily invested in as recently as the day before this ADR (ADR-104/105/106). That contradiction — disliking a verb while still building it — was the signal: the need was real, the shape was wrong.

Paul named three symptoms. Grounding them against the real project trees produced one cause.

**The evidence.** Five projects carry a `docs/core/` tree. One held nothing but a `.gitkeep` for three weeks while the repo shipped daily. The largest held 7 documents, last meaningfully written eight weeks before this ADR while the code shipped throughout. The amendments ledgers hold one or two entries each, then stop. **`core/` is a write-once-abandon artifact.**

Reading what actually got written into the largest tree is decisive. Of three sampled documents, two are `architecture.md` and `primitives.md` — **architecture and schema references, not ratified principles**. And the surviving ledger entry records a *technical fact going stale* ("decode 不貴 is no longer universally true"), not a principle being amended.

**The cause: `core/` conflated two genres that need opposite treatment.**

| | Principles | Architecture / schema docs |
|---|---|---|
| Change rate | rare | **continuously, with the code** |
| Correct maintenance | deliberate, ratified | **edited in the same commit as the code** |
| Freeze protocol | defensible | **manufactures permanent debt** |

All three symptoms fall out of that one conflation:

- **"很重"** — freezing documents that describe moving code means every optimization owes an amendment entry. Not ceremony; *institutionalized debt production*.
- **"觸發很怪"** — architecture docs trigger on "the code changed" (continuous); principles trigger on "we ratified something" (episodic). One door cannot carry two clocks.
- **"看不懂"** — a concrete decision forced into timeless-principle prose loses the case that carried its meaning. A principle without its originating case is a slogan.

The counter-evidence sits in the same repo: **110 ADRs, cited daily.** Dated, case-bearing, one decision per file, alternatives recorded. Same author, same brain — one genre lives, the other dies.

## Decision

### 1. Retire the `core/` tier, `/shape:position`, the ADR-041 freeze protocol, and the amendments ledger

**Canon does not get a folder. Every principle routes by how it must fire:**

1. **Must fire every turn** → the always-loaded layer (`CLAUDE.md` / `AGENTS.md`).
2. **Must be enforced** → a gate (validator, hook, compiler contract).
3. **Must be findable when relevant** → a dated, case-bearing file (`thoughts/`, an ADR).

This is the repo's own hardest-won lesson applied to itself. Twice this week it recorded that **"the rule was correct and it still failed, because it was a rule and not a gate"**, and that the Codex compiler's anchor contracts turned a review judgment into a hard check. A `core/` document is a rule that binds only if someone remembers to read it. Nobody did.

Architecture and schema documents are `nav`'s object, not canon: they describe code, so they track code and are edited in the same commit (the existing "stale header = lie" law). Un-freezing them is the point.

### 2. Retire the `precedents/` tier and the `graduate` action

The word failed its own test: the spec needed **a full paragraph to defend the name** ("most entries were never *decided* — they were established by something that happened…"). A term that needs a paragraph of defense is the wrong term; the distinction it bought (bindingness over agency) is real and costs more than it returns.

`graduate` failed a deeper test. It is not a move but a *distillation* — converting a thought written **during** convergence into a durable record. That transformation exists only because the two genres differ. ADRs need no graduation because **an ADR is born in its final genre**.

So: close the genre gap instead of bridging it. `thoughts/` becomes permanent and **decisions are born durable** — which `/shape:elicit` already promised in its own stance ("Land one line, not a transcript"); only the template failed to enforce it. This is ADR-109's move again: **pull the quality gate to authoring time, where it is cheap, instead of a later sweep, where it never happens.**

**The durable thought template** (replacing both the old thought template and the precedent 3-part body): a `Status:` line in the first three lines — `in force` / `superseded by <file>` / `shipped` — then **the call · how it shows up in the system · what was rejected or deferred · Evidence.**

**Supersession is an edit, not a move**: the overturning file names the overturned one, and the overturned file's `Status:` changes — same commit. No `overruled.md`.

**There is no index file.** The index is `head -3 thoughts/*.md` — produced on demand, structurally incapable of going stale. This is the repo's own `head -12` header doctrine applied one tier up: don't maintain a map, make each file self-describing and read the tops. A maintained index is the species that failed all week (the site map, the README, six caches, 73 mirror copies).

Growth is bounded by the `Status:` filter (asking "what binds" reads only `in force`) plus align's pruning, under the criterion that survives verbatim: **keep what git makes expensive to recover, drop what git makes cheap.**

### 3. Merge `/shape:reconcile` into `/shape:align`

Their first step was the same action performed twice — read the tree, verify against the code — which is rule ① duplication, not two verbs. They also pass the merge test this marketplace has been using all week: **shared stance merges a door; shared topic does not.** Both are read-the-tree / compare-to-reality / propose-with-the-user / gated-write.

`align` keeps the name, decided by measured pull, not seniority: in 11 months **align was reached for in natural language** (「我想要再來繼續我的 phd 研究」·「下一步你想要做什麼呢」·「重新整理一下我們需要什麼」), while **all four `reconcile` fires were the user typing its name**. A verb you must already know exists has no interface.

The merged verb runs on **compaction pressure** — the agent-context-compaction instinct Paul named: you returned after a break, a batch shipped, the tree got noisy. That is the natural trigger neither `position` nor `graduate` ever had, and it is why this consolidation lands where those failed.

**One gate change, deliberate**: reconcile's per-file confirmation becomes **one dry-run proposal, one confirmation** — per-file interrogation makes the user click through without reading, which kills the gate it was meant to be. Two exceptions stay per-step: anything **untracked**, and any delete of content git does not already hold.

**shape: 8 → 6** — `align` · `dogfood` · `elicit` · `migrate` (summon-only) · `mockup` · `probe`. Marketplace: **27 skills**.

## What is honestly lost

- **The freeze protocol's real function** — preventing any verb or ambient conversation from casually rewriting a binding decision. In 11 months it produced one or two ledger entries, both *documentation drift* rather than principle drift: the lock guarded a threat that never showed up. Re-entry condition: a second person (or an autonomous agent with write access) actually rewriting a binding decision.
- **`position`'s campaign model** (many gated feedings converging messy input into canon) — genuinely designed, retired unexercised. What replaces it is `/shape:elicit` across several sittings, which is what happened in practice anyway.
- **`precedents/index.md`'s two-minute read.** `head -3` over an in-force filter is grep-shaped, not a curated table. Accepted: a stale table is worse than a slightly rougher live one.
- **ADR-104 and ADR-106** (canon's founding set; growth by ratification, not provenance) become historical — they legislated growth for a tier that is retired. **ADR-105's versioned-convention half survives** and is exercised immediately: this ADR ships its own migration (v2 → v3) as `migrate`'s M2 ledger entry, which is exactly the discipline ADR-105 exists to enforce.

## Consequences

- Deleted: `plugins/shape/skills/position/`, `plugins/shape/skills/reconcile/`. `reconcile-protocol.md` moved verbatim into `align/references/` and reframed as align's compaction pass; its Graduate section deleted.
- `plugins/shape/skills/align/SKILL.md` rewritten as the merged verb (verify → compact → triage), gates preserved verbatim (ADR-086 per-item verification · no-item-vanishes · untracked-is-irreversible · the amend boundary · ADR-037 mockup preconditions).
- `blueprints-spec.md` rewritten to two tiers; `migration-ledger.md` gains entry **M2** (`core/` + `precedents/` → Status-tagged `thoughts/`), convention version → **v3**.
- `plugins/shape/.claude-plugin/plugin.json` 0.16.1 → **0.17.0**; shape `CLAUDE.md` spine, members, and status line updated; `marketplace.json` blurb re-cut.
- Cross-plugin: `nav:do`'s ADR-041 canon carve-out deleted (a changed fact is now just a same-commit edit), `nav:sync` / `nav` CLAUDE.md / `mockup` / `elicit` / `probe` / `catchup` references repointed.
- Repo-root `CLAUDE.md`: the contracts list drops from three to two — the `docs/core/` freeze protocol retires with the tier.
- README, site map (rev 104), and the Codex compat layer updated; mirrors regenerated; validator green at 27 skills.

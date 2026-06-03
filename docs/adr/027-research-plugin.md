# ADR 027 — `research` plugin: argument anatomy as a first-class skill family

**Status**: accepted
**Date**: 2026-06-03
**Origin**: [`docs/observations/2026-06-03-paper-analysis-gap-claim-mechanism-evidence.md`](docs/observations/2026-06-03-paper-analysis-gap-claim-mechanism-evidence.md) (crystallised from a single dense session — Enact P1 literature review — per ADR-018's single-session promotion gate: grounded ∧ friction-tested ∧ principle-level)
**Prior observations**:
- [`docs/observations/2026-06-02-research-lit-review-gap-analysis.md`](docs/observations/2026-06-02-research-lit-review-gap-analysis.md) — claim-framed batch read (candidate skill: `research:map`)
- [`docs/observations/2026-06-02-competitor-papers-as-design-input.md`](docs/observations/2026-06-02-competitor-papers-as-design-input.md) — design feedback from competitor empirical results (candidate skill: `research:feedback`)

## Context

The Enact P1 paper research session produced a structured paper analysis format: Gap → Claim → Mechanism → Evidence → Conclusion. Applied first to ReAct as a worked example, then confirmed as the intended template for all remaining baselines and related-work papers.

Two questions arose:
1. Is this framework paper-specific, or more general?
2. Where does it belong in the `skills` marketplace?

On (1): the framework is not paper-specific. It is **argument anatomy** — the structural decomposition of any document making a claim. Papers make the structure most visible (abstract / intro / method / experiments = Gap / Claim / Mechanism / Evidence), but the same skeleton applies to technical blog posts, competitor analyses, design proposals, startup pitches, and RFCs. The only documents it doesn't apply to are purely descriptive ones with no argument.

On (2): the framework belongs in a new `research` plugin, not folded into `nav` (code navigability) or `shape` (product forward motion). The research domain is reading external sources to inform your own work — a distinct workflow from either code maintenance or product building.

## Decision

| Aspect | Choice |
|---|---|
| Plugin name | `research` |
| First skill | `dissect` (single-document argument anatomy) |
| Skill verb | `dissect` (not `read`, not `analyze` — captures the surgical decomposition into labeled parts) |
| Plugin dependency | None — `research` is standalone; no `nav` or `shape` dependency |
| Output format | Fixed skeleton (`notes/<name>.md`) — comparable across documents |
| Implications section | Optional (requires user's claim); blank when not provided |

## Why `dissect` over alternatives

- **`read`**: too passive — underrepresents the structural decomposition being done.
- **`analyze`**: too generic — doesn't name the specific operation (argument anatomy).
- **`dissect`**: surgical, specific — captures "cut open and label the parts." In academic contexts, "dissecting an argument" is natural; dissect also carries no false connotation of *opposing* the argument (unlike `critique`).

## Why a new plugin, not folding into `nav` or `shape`

- `nav` is about code navigability. Research is about reading external sources. Different domain, different trigger phrases, different output artifacts.
- `shape` is about product forward motion. It could conceivably host research as a pre-build step, but the research plugin's output (dissection notes, landscape maps) is useful independent of any product decision.
- A new plugin keeps the three families cleanly separated: nav (maintain code) · shape (push product forward) · research (read the world).
- ADR-005 establishes that each plugin is a topical family; there's no limit on the number of plugins.

## Planned family (not committed — promote per ADR-018)

| Skill | Status | Origin observation |
|---|---|---|
| `dissect` | ✓ shipped (v0.1.0 → updated batch support in v0.2.0) | `2026-06-03-paper-analysis-gap-claim-mechanism-evidence.md` |
| `map` | ✓ shipped (v0.2.0) | `2026-06-02-research-lit-review-gap-analysis.md` |
| `feedback` | candidate | `2026-06-02-competitor-papers-as-design-input.md` |

`feedback` remains an observation until a second dense session friction-tests it to the principle level (ADR-018 gate).

## Consequences

- New plugin directory `plugins/research/` with `plugin.json`, `CLAUDE.md`, `skills/dissect/SKILL.md`.
- `marketplace.json` gains a `research` entry.
- `README.md` gains a `research` row in the plugins table.
- `docs/site/index.html` gains: DOMAINS entry, CB_NODES entry, RES_NODES/RES_EDGES for anatomy, sidebar link, anatomy section, i18n strings. Audit block bumped to rev 28.
- `dissect` is invoked as `/research:dissect`.
- ADR count 26 → 27.

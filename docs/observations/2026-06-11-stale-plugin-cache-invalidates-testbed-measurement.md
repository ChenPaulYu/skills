---
date: 2026-06-11
status: raw
---

# Stale plugin cache silently runs last version's skills — a dogfood testbed measures the wrong thing and files false negatives

## What happened (concrete)

In the TrackMate testbed, a `/shape:reconcile` run swept `thoughts/` + `plans/` but **not `mockups/`**. The user asked "why didn't reconcile review the mockups?" — a reasonable bug report against the skill. Investigation found:

- The **source** repo's reconcile (shape **0.5.0**) already sweeps mockups as a third tier — ADR-037, shipped commit `19c1324`, including the exact failure observed (committed-by-default mockups grow monotonically; `layout-final` kept lying to canon as the「定稿樣本」until a manual sweep caught it).
- The **installed cache** (`~/.claude/plugins/cache/skills/shape/`) topped out at **0.4.0** — pre-ADR-037. The session faithfully executed the old protocol.
- Skew was plugin-specific: nav 0.5.0=0.5.0 ✓, think 0.1.0=0.1.0 ✓, **shape 0.5.0 vs 0.4.0 ✗** — so the testbed looked "current" unless you checked per-plugin.

Collateral: the session also ran without shape-0.5.0's ADR-038 clause (verb-is-the-only-door, which lands in `shape/CLAUDE.md`) and without the `setup`/`position` updates — none of which announced their absence.

## The signal

**Version skew between skill source and installed cache silently invalidates skill-efficacy measurement.** The testbed's whole premise (TrackMate memory: "Paul 要用這個 repo 觀測 skill 改動的真實效果") assumes the runtime executes the current skill text. A stale cache breaks that assumption *quietly*: the session behaves correctly **per the old version**, the user files the gap as a skill bug, and a shipped fix gets re-reported as missing — a false negative that could even prompt a redundant re-fix.

The manual mockup sweep the agent improvised (stamp shipped, supersession-stamp the canon-cited sample, keep live verify-targets) converged on ADR-037's design almost clause-for-clause — nice validation of the design, but the convergence itself masked the staleness for most of the session.

## What it could become (the fix)

- **Testbed protocol: version-check before measuring.** A one-line preflight in the testbed flow (or the marketplace README): compare `plugins/*/.claude-plugin/plugin.json` version against `~/.claude/plugins/cache/<marketplace>/<plugin>/` newest dir; refresh before attributing behavior to a skill version. Cheap, mechanical, kills the whole class.
- **Skill-side self-stamp (consider):** skills could carry their version in SKILL.md frontmatter so a session transcript records *which* version ran — making post-hoc attribution possible even when preflight was skipped.
- **Not** a behavioral memory in the testbed repo (per the testbed-guard): this is infra, fix it at the marketplace/protocol layer.

## Evidence

- cache: `shape/0.4.0` reconcile SKILL.md mentions "mockup" 1× (ownership note only); source mentions 17× (full tier).
- `19c1324 feat(shape): reconcile sweeps mockups/ as a third tier (ADR-037)` — present in source, absent in cache.
- Session transcript: reconcile round 2 inventoried only thoughts+plans; mockups surfaced only because the user asked「那 mockup 呢?」.

# ADR 014 — `reconcile` gains `amend`; the fact-vs-decision boundary hands off to `elicit`

**Status**: accepted
**Date**: 2026-05-29
**Plugin**: `shape`
**Relates to**: `reconcile` (introduced in [ADR-010](docs/adr/010-shape-blueprints-workflow.md)); the "no new decisions during render" invariant (shape `CLAUDE.md`).

## Context

`reconcile` shipped with three actions on a `thoughts/` doc treated as an atom: **keep** (still current), **prune** (wholly stale → delete), **consolidate** (superseded → merge into another). The user observed a real gap: staleness isn't binary. A doc can be 90% live design with **one line reality overtook** (e.g. "tags stored as a flat list" after the code moved to a typed entity). The atomic actions force a bad choice: keep the doc and the stale line keeps lying, or prune it and lose the live 90%. The user asked whether reconcile should also *update* such docs, not only delete them.

The risk: "update a doc" can quietly mean "rewrite a decision", which collides head-on with shape's invariant that **decisions are born in the converge verbs (`elicit` / `mockup`), never authored by the maintenance verbs (`align` / `reconcile`)**.

## Decision

**1. Add a fourth action, `amend`** — correct a doc's stale *fact* in place (verbatim except the confirmed line), serving a new verdict **`current · N stale fact(s)`**. It inherits reconcile's write-gate: per-file confirm, show a one-line diff, check tracked/untracked first (overwriting an untracked doc is as irreversible as deleting it).

**2. Draw a hard boundary — amend syncs facts, never re-decides** — with a one-question test:

> Is the `+` line something reality has **already decided** (built code shows it), or something that needs **my judgment about what should be**?

- **Fact → amend.** Doc lags code, decision unchanged (`flat list` → `typed entity`; `editing is a follow-up` → `editing: shipped`). Record only the fact, not the rationale.
- **Decision → out of scope.** Code didn't move; the *design judgment* did (e.g. "tags are describe-only" reframed into a two-layer system). reconcile must **not** rewrite the principle.

**3. On a decision-change, reconcile actively hands off** — it recommends `/shape:elicit` *and says plainly it's out of reconcile's scope*, rather than silently skipping or quietly rewriting: *"This isn't a stale fact, it's a design change — that's `/shape:elicit`'s job. I'll consolidate the old doc once the new one lands."* This is the **active** form of "no new decisions during render" (previously only a passive prohibition).

## Why

- **Fills the partial-staleness gap** the atomic actions couldn't serve, without a new skill (amend is the second consumer of reconcile's currency engine — fold, don't fork; same N+1 discipline as ADR-013).
- **Keeps the converge/maintain split intact.** The boundary test makes "is this an amend or an elicit?" a mechanical, evidence-driven question — preserving reconcile's read-only-check character (it only writes the one synced line).
- **The hand-off is honest.** A decision-change found during reconcile is surfaced and routed to where decisions are reviewed *as* decisions, not buried in a maintenance edit no one reads as a choice.

## Consequences

- `plugins/shape/skills/reconcile/SKILL.md`: frontmatter + intro gain `amend`; verdict vocabulary adds `current · N stale fact(s)`; Step 3 proposes amend (one-line diff) and the elicit hand-off; Step 4 adds amend mechanics (verbatim-except-the-line, tracked/untracked); a new "The amend boundary" section; Discipline + Output updated.
- `plugins/shape/CLAUDE.md`: the `reconcile` member line documents amend + the elicit hand-off.
- `docs/site/index.html` (gating): reconcile's blurb / node desc / anatomy lede note amend + the fact-vs-decision boundary. ADR count 13 → 14.
- No version bump (reconcile's action set widened; no new skill).

## Notes

- Third time the family resisted fragmentation: `build` stayed in shape (ADR-011), diagnosis stayed in `elicit` (ADR-013), and now correction stays in `reconcile` rather than spawning an "update" skill. The through-line: extend the existing engine until a genuinely new shape forces a split — and police the *boundary* (here, fact vs decision) instead of the tool count.

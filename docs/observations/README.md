# Observations

Field notes from working with coding agents. Raw observations land here first; the ones that mature get promoted into skills, plugins, or ADRs.

## Why this exists

Every `/nav:*` skill in this marketplace started as an observation — a pattern noticed during a real session that eventually crystallized into something repeatable. Without a capture step, those observations get lost to the next context window. This folder is that capture step.

## Scope

**Any coding-agent observation, across any plugin family.** Not just `nav`. When `spec`, `craft`, or future families arrive, their observations live here too. Use a clear slug + lean tagging in the body if you want to group.

**Not for**: build-side pitfalls / mechanics encountered while editing this marketplace itself — those live in the sibling [`findings/`](docs/findings/). Audience differs: observations point outward (future users of the skills); findings point inward (future-you editing the repo).

## File shape

One file per observation. Name: `YYYY-MM-DD-<short-kebab-slug>.md`.

```markdown
---
date: 2026-05-28
status: raw
---

# <One-line summary of the observation>

<Free-form body — write whatever helps you remember. No required sections.
Useful prompts to answer if relevant:
- What happened (concrete: what were you doing, what did the agent do/fail to do)
- Why it might matter (the signal)
- What it could become (skill / plugin / convention — or just "good to know")
- Evidence so far (other dates/contexts where you've seen the same pattern)>
```

Lean by design. Extra frontmatter fields (`candidate`, `context`, `related`, …) get added only when 5+ observations show they'd actually earn their keep — not speculatively.

## Status lifecycle

| Status | Meaning | Action |
|---|---|---|
| `raw` | First time noticed | Write it down, don't overthink |
| `repeated` | Same pattern seen in ≥ 2 different contexts | Add evidence inline to the original file |
| `maturing` | A repeatable protocol is starting to form | Draft a SKILL.md or ADR alongside |
| `promoted` | Shipped as a real skill / plugin / convention | Note the target path at the top, keep the observation as history |
| `rejected` | Turned out to be wrong, context-specific, or not skillable | Keep the file with a one-line "why rejected" note (the negative result still has value) |

## Promotion targets

When an observation matures, where it lands:

- **Skill** (`plugins/<family>/skills/<verb>/SKILL.md`) — has a clear trigger phrase + a repeatable protocol; benefits from being agent-invocable.
- **Plugin** (`plugins/<new-family>/`) — opens a whole new verb family that doesn't fit under an existing plugin.
- **ADR** (`docs/adr/<n>-<topic>.md`) — a decision about how the marketplace itself is shaped (naming, structure, conventions).
- **CLAUDE.md addition** — a behavioural guideline that should apply everywhere but doesn't warrant a skill.

## Discipline (for the observer)

- **Capture before crystallize.** A raw note is better than a "wait until I understand it" silence — by then you've forgotten.
- **Concrete > abstract.** Cite the actual session, the actual file, the actual agent behaviour. Generalities are harder to learn from later.
- **Negative results count.** "Tried X, didn't work because Y" is a real observation — mark `rejected` with the reason, don't delete.
- **Don't pre-skill — but the gate is evidence, not session count ([ADR-018](docs/adr/018-promotion-gate-is-evidence-not-session-count.md)).** The default is to wait for the pattern to repeat (≥2 contexts), which time-filters out enthusiasm. *But* a single dense session may crystallize when it carries the substitutes for recurrence — **all three**: grounded (anchored in real artifacts/code), friction-tested (survived pushback, not the first idea), and principle-level (a generalizing principle, not a one-off feature). A session that merely *felt* thorough — no grounding, no friction, a feature not a principle — is enthusiasm: keep it `raw`. Premature skill-ification ossifies an unproven shape.
- **One file per observation.** Don't grow a running log — that loses the per-pattern granularity that makes promotion easier later.

# ADR 002 — Rename `deep-module-*` prefix to `nav-*`

**Status**: accepted
**Date**: 2026-05-28
**Supersedes**: portion of [ADR-001](./001-plugin-shape-and-naming.md) (decision #2)
**Context**: Less than an hour after ADR-001 settled on `deep-module-*`, lived-with feedback identified the name as academic + too long. Renamed before the prefix ossified.

## Decision

Rename all four skills:
| Old | New |
|---|---|
| `deep-module-audit` | `nav-audit` |
| `deep-module-refactor` | `nav-refactor` |
| `deep-module-map` | `nav-map` |
| `deep-module-headers` | `nav-headers` |

## Why

Two reasons surfaced once we lived with the original name briefly:

1. **`deep-module` is academic.** It references Ousterhout's *A Philosophy of Software Design* by name. A reader who doesn't know that book sees a meaningless prefix. The philosophy underneath the skills doesn't change; the prefix shouldn't require external reading to understand.

2. **The 4 skills' common purpose is broader than "deep modules".** They're all about making code **navigable** — letting a reader (human or agent) walk through, understand, reshape, and document the codebase. "nav" captures this directly. Deep-module is one tool the skills use; navigability is the outcome they produce.

`nav-` is 3 characters (vs `deep-module-`'s 12), follows the universal abbreviation convention (auth, admin, config, env), and works in every slash-command position:
- `/skills:nav-audit` ✓
- `/skills:nav-refactor` ✓
- `/skills:nav-map` ✓ ("nav map" is a common phrase, no awkwardness)
- `/skills:nav-headers` ✓

## What this does NOT change

- The 11 rules underneath every skill (still Ousterhout-derived + extensions for grounding + agent-navigability)
- Plugin name (`skills`)
- Every other ADR-001 decision (self-contained skills, TS/React scope, local-symlink dev, etc.)
- The principle of using topic prefixes for skill families — only the specific choice for *this* family changed

## Consequences

- 4 folders renamed via `git mv` (preserves history)
- Internal references updated via `sed` across `README.md`, `CLAUDE.md`, 4 `SKILL.md` files
- Plugin manifest description rewritten to use new names
- ADR-001 status updated to "decision #2 partially superseded"
- Future skill families still get their own prefix; this ADR makes "choose prefixes that are short + outcome-oriented + don't require academic context" the new convention. `spec-*`, `craft-*`, future families should follow it.

## Lesson recorded

Live with a name for ten minutes before committing to it permanently. The discomfort with `deep-module-` was real and would have compounded each time a skill was invoked.

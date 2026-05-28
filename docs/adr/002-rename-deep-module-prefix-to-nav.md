# ADR 002 — Rename `deep-module-*` prefix to `nav-*`

**Status**: accepted — the `nav-` prefix on skill names was later removed by [ADR-005](docs/adr/005-marketplace-plus-plugin-restructure.md) (intent moved into the plugin namespace `nav:`). Naming reasoning below — short, neutral, abbreviation-style topic markers — stands.
**Date**: 2026-05-28
**Supersedes**: portion of [ADR-001](docs/adr/001-plugin-shape-and-naming.md) (decision #2)

## Context

Less than an hour after ADR-001 settled on `deep-module-*`, lived-with feedback flagged it as academic + long. Renamed before it ossified.

## Decision

| Old | New |
|---|---|
| `deep-module-audit` | `nav-audit` |
| `deep-module-refactor` | `nav-refactor` |
| `deep-module-map` | `nav-map` |
| `deep-module-headers` | `nav-headers` |

## Why

- **`deep-module` is academic.** References Ousterhout by name; readers who don't know the book see a meaningless prefix.
- **Outcome > tool.** The skills make code *navigable*. Deep-module is one tool they use; navigability is what they produce.
- **Short + universal.** `nav` is 3 chars vs `deep-module`'s 12; matches the auth/admin/config abbreviation convention.

## Consequences

- 4 folders renamed via `git mv` (preserves history); refs updated across README, CLAUDE.md, 4 SKILL.md, manifest.
- ADR-001 #2 marked "partially superseded".
- Convention for future families: short + outcome-oriented + no academic context required.

## Notes

**Lesson**: live with a name for 10 minutes before committing. The discomfort would have compounded with every invocation.

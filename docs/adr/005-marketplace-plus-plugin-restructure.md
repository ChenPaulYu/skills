# ADR 005 — Marketplace `skills` + plugin `nav` (drop the `nav-*` prefix)

**Status**: accepted
**Date**: 2026-05-28
**Supersedes**:
- [ADR-001](./001-plugin-shape-and-naming.md) #1 (single plugin `skills`)
- [ADR-001](./001-plugin-shape-and-naming.md) #2 (skill-name topic prefix — principle stands, mechanism moves to plugin namespace)
- [ADR-002](./002-rename-deep-module-prefix-to-nav.md) (the `nav-*` prefix itself; intent moves into `nav:` namespace)

## Context

After install, `/skills:nav-doctor` looked redundant — `skills:` + `nav-` were two namespaces doing the same job. Root cause: we treated Matt Pocock's `mattpocock/skills` as a single plugin literally named `skills`, then re-added the missing topic layer via `nav-*` prefixes. His actual shape is a **marketplace** containing multiple **topical plugins**. See [`docs/findings/2026-05-28-dont-pay-for-namespace-twice.md`](../findings/2026-05-28-dont-pay-for-namespace-twice.md).

## Decision

Restructure to marketplace + topical plugin:

```
skills/                              ← marketplace (ChenPaulYu/skills)
├── .claude-plugin/marketplace.json  ← lists plugins
├── README.md
├── docs/adr/
└── plugins/
    └── nav/                         ← plugin
        ├── .claude-plugin/plugin.json   (name: "nav")
        ├── CLAUDE.md
        └── skills/
            ├── audit/SKILL.md       ← bare verbs
            ├── refactor/SKILL.md
            ├── headers/SKILL.md
            ├── map/SKILL.md
            └── doctor/SKILL.md
```

| Before | After |
|---|---|
| `/skills:nav-audit` | `/nav:audit` |
| `/skills:nav-refactor` | `/nav:refactor` |
| `/skills:nav-headers` | `/nav:headers` |
| `/skills:nav-map` | `/nav:map` |
| `/skills:nav-doctor` | `/nav:doctor` |

Marketplace name `skills` stays — identity from GitHub username (ADR-001 #1 intent preserved).

## Why

- **Colon IS the namespace.** Claude Code groups via `<plugin>:<skill>`. Adding `nav-` on top is paying twice.
- **Topical plugin names parallel established models.** `/nav:doctor` reads like `brew doctor` / `flutter doctor` / `npm doctor`. `/skills:nav-doctor` has no parallel.
- **Future families don't pile up.** `spec`, `craft` become sibling plugins under the same marketplace — Matt Pocock's actual shape.
- **Restructure is cheap.** Move + frontmatter rename + cross-ref scrub. No protocol logic touched.
- **ADR-001 #2 principle stands; mechanism changes.** Skill names still need topic context — it now comes from the plugin namespace.

## Consequences

- **Repo**: marketplace root holds `marketplace.json` + `README` + `docs/`; plugins self-contained under `plugins/<name>/` with own `plugin.json` + `CLAUDE.md`.
- **Naming**: skill names = bare verbs. Cross-refs inside SKILL.md use the full slash-command form (`/nav:audit`) — what the user types + disambiguates from common English words.
- **Re-install**: `/plugin uninstall skills@skills` → `/plugin marketplace remove skills` → `/plugin marketplace add <path>` → `/plugin install nav@skills`.
- **Older ADRs**: 001 #1+#2 superseded (noted in file); 002 preserved as historical (reasoning embedded in plugin name `nav`); 003 + 004 substance unchanged.

## Future addition rule (refines [ADR-003](./003-five-skills-not-four-or-six.md))

| Kind of addition | Where it lands |
|---|---|
| New **verb** in existing family | New skill: `plugins/<family>/skills/<verb>/` |
| New **family** | New plugin: `plugins/<family>/` with bare-verb skills |
| **Parameterization** of an existing verb | Fold into existing skill (precedent: `audit` Mode 1/2) |
| **Composition** of existing verbs | Meta-skill in same plugin (precedent: `doctor`) |

## What this doesn't change

- 11 rules (load-bearing across every skill).
- Self-contained SKILL.md discipline (ADR-001 #3).
- Language-agnostic scope ([ADR-004](./004-language-agnostic-scope.md)).
- Read-only-by-default + show-diff-first for file-modifying skills.

## Notes

**Lesson**: don't pay for the namespace twice. When a system already groups things, repeating the group-name inside each child is dead weight that surfaces every time the name appears. Adjacent: read the structure of a reference pattern before borrowing the name. `mattpocock/skills` is a marketplace; treating it as a single plugin was wrong-shape from the start.

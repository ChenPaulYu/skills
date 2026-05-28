# ADR 005 — Marketplace `skills` + plugin `nav` (instead of plugin `skills` + `nav-*` prefix)

**Status**: accepted
**Date**: 2026-05-28
**Supersedes**:
- [ADR-001](./001-plugin-shape-and-naming.md) decision #1 (single plugin called `skills`)
- [ADR-001](./001-plugin-shape-and-naming.md) decision #2 (skill names carry a topic prefix — *principle still stands but mechanism moves to the plugin namespace*)
- [ADR-002](./002-rename-deep-module-prefix-to-nav.md) (the `nav-*` prefix itself — no longer present on skill names; the prefix's intent now lives in the `nav:` plugin namespace)

## Context

After installing the plugin and seeing the slash command in the wild — `/skills:nav-doctor` — Paul flagged that it didn't look good. Inspection showed why:

```
/skills:nav-doctor
 ─┬───  ─┬─────
  │      └─ self-added prefix to scope the family within the plugin
  └─ plugin name (also generic "skills" container)
```

The colon already provides a namespace. The `nav-` prefix was a second namespace doing the same job. ADR-001 #2 acknowledged the prefix existed *because the plugin name `skills` doesn't carry topic context* — but the right fix is to give the plugin a topical name, not to add a redundant prefix to every skill.

We had also misapplied Matt Pocock's pattern. His `mattpocock/skills` is a **marketplace** (`marketplace.json`) containing **multiple topical plugins** (each with its own `plugin.json`). We collapsed it into a single plugin literally named `skills`, then re-introduced the topic layer with `nav-*` prefixes.

## Decision

Restructure to the Matt-Pocock-shape we actually meant:

```
skills/                              ← marketplace (ChenPaulYu/skills)
├── .claude-plugin/marketplace.json  ← marketplace manifest; lists which plugins live inside
├── README.md                        ← marketplace-level public face
├── docs/adr/                        ← marketplace-level ADRs (this file lives here)
└── plugins/
    └── nav/                         ← plugin: the navigability family
        ├── .claude-plugin/plugin.json  (name: "nav")
        ├── CLAUDE.md                ← plugin-level dev guide
        └── skills/
            ├── audit/SKILL.md       ← skill name = "audit" (no prefix)
            ├── refactor/SKILL.md
            ├── headers/SKILL.md
            ├── map/SKILL.md
            └── doctor/SKILL.md
```

Slash commands become:

| Before | After |
|---|---|
| `/skills:nav-audit` | `/nav:audit` |
| `/skills:nav-refactor` | `/nav:refactor` |
| `/skills:nav-headers` | `/nav:headers` |
| `/skills:nav-map` | `/nav:map` |
| `/skills:nav-doctor` | `/nav:doctor` |

The marketplace name `skills` is unchanged — it's still the personal-collection container; identity still comes from the GitHub username (`ChenPaulYu/skills`), exactly as ADR-001 #1 intended.

## Why

1. **The colon IS the namespace.** Claude Code already groups skills under their plugin via the `<plugin>:<skill>` form. Adding `nav-` on top is two namespaces, one job — needless work that shows up in every command name.

2. **Topical plugin names age better than topical prefixes.** `/nav:audit` parallels `brew doctor`, `flutter doctor`, `npm doctor` — established mental models. `/skills:nav-doctor` has no parallel; it reads as a path through two layers of naming.

3. **Future families don't pile up inside one plugin.** When `spec-*` or `craft-*` arrives, they become sibling plugins (`/spec:*`, `/craft:*`) under the same `skills` marketplace — exactly the shape `mattpocock/skills` actually has. Cross-family coupling stays at zero.

4. **The restructure is cheap because the SKILL.md content didn't change.** Move + frontmatter rename + cross-ref scrub. No protocol logic touched. Same audit, same refactor discipline, same 11 rules.

5. **ADR-001 #2's principle still stands — the mechanism changes.** "Use a topic prefix when needed" was right: skill names need topic context. That context now comes from the plugin namespace (`nav:`), not from a string embedded in the skill name (`nav-`).

## Consequences

### Repo structure
- Marketplace root: `marketplace.json` + `README.md` + `docs/adr/` + `plugins/`.
- Each plugin self-contained under `plugins/<name>/` with its own `plugin.json` and `CLAUDE.md`.
- ADRs stay at marketplace level — they describe decisions shared across plugins.

### Naming
- Skill names = bare verbs (`audit`, `refactor`, `headers`, `map`, `doctor`).
- Cross-references inside SKILL.md spell the full slash-command form (`/nav:audit`) — that's what the user types, and it disambiguates from common English words.

### Re-install required
- The old `skills@skills` plugin must be uninstalled; the new `nav@skills` must be installed.
- `/plugin uninstall skills@skills` → `/plugin marketplace remove skills` (to drop the stale plugin list) → `/plugin marketplace add /Users/bernie/Desktop/Github/01-project/skills` → `/plugin install nav@skills`.

### Older ADRs
- ADR-001 #1 + #2 are superseded by this decision (noted in their files).
- ADR-002 (the `deep-module-*` → `nav-*` rename) is preserved as historical — the prefix it introduced is no longer on skill names but its REASONING (short, neutral, abbreviation-style topic markers) is now embedded in the plugin name `nav`.
- ADR-003, ADR-004 substance is unchanged; cross-refs inside them naming the old `nav-*` skills stay as historical record.

### Future addition rule (refined from ADR-003)
- A new **verb** within an existing family → new skill under that plugin (e.g., `plugins/nav/skills/<new-verb>/`).
- A new **family** → new plugin under the marketplace (e.g., `plugins/spec/`), with its own bare-verb skills.
- A new **parameterization** of an existing verb → fold into the existing skill (precedent: `audit` Mode 1 vs Mode 2 from ADR-003).
- A new **composition** of existing verbs → meta-skill within the same plugin, references siblings (precedent: `doctor`).

## What this doesn't change

- The 11 rules (still load-bearing across every skill).
- Self-contained `SKILL.md` discipline (still applies — each skill embeds the rules).
- Language-agnostic scope (ADR-004 — universal core + per-stack heuristics).
- Read-only-by-default + show-diff-first for any file-modifying skill.

## Lesson recorded

**Don't pay for the namespace twice.** When a system already groups things (Claude Code's `<plugin>:<skill>` form), repeating the group-name inside each child is dead weight that shows up everywhere the name appears. The right place to express "this is the navigability family" is the namespace, not a string repeated in 5 skill names.

Adjacent lesson: **read your imports before you copy a pattern.** `mattpocock/skills` is a marketplace of multiple plugins. Treating it as a single plugin then re-adding the missing layer with prefixes was wrong shape from the start. Inspect the structure of the reference, don't just borrow the name.

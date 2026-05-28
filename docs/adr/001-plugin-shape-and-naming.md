# ADR 001 — Plugin shape and naming

**Status**: accepted — #1, #2 superseded by [ADR-005](./005-marketplace-plus-plugin-restructure.md); #2 also partially by [ADR-002](./002-rename-deep-module-prefix-to-nav.md); #4 by [ADR-004](./004-language-agnostic-scope.md). #3, #5, #6 stand.
**Date**: 2026-05-28

## Context

Founding decisions when bootstrapping the `skills` plugin.

## Decisions

### 1. Single plugin called `skills`

Following Matt Pocock's `mattpocock/skills`. Generic plugin name; identity from the GitHub username (`ChenPaulYu/skills`).

Rejected: `deep-modules` (locks brand to one philosophy); `paul-dev` (let GitHub scope it, not folder name).

### 2. Skills use a topic prefix when needed

> ⚠ The choice of `deep-module-*` was reversed by [ADR-002](./002-rename-deep-module-prefix-to-nav.md) (→ `nav-*`); the prefix itself was later removed by [ADR-005](./005-marketplace-plus-plugin-restructure.md) (topic moved to plugin name). Principle of "topic context belongs *somewhere* in the slash command" stands.

Rejected: bare verbs (`audit`, `refactor`) — too generic when triggered out of context.

### 3. Each `SKILL.md` is self-contained

Every skill embeds the 11 rules verbatim. No shared `_shared/` folder.

**Why**: when Claude triggers a skill, only that `SKILL.md` is loaded. Reaching into siblings is unreliable. Cost = duplication (11 rules × N skills); benefit = robust standalone execution. Mitigated by "rules change → all SKILL.md update in same commit" (meta-rule in plugin CLAUDE.md, enforced by stale-header discipline).

### 4. Initial scope: TypeScript / React

(Superseded by ADR-004 — now language-agnostic with universal core + per-stack heuristics.)

### 5. User-triggered, not "pushy" descriptions

Frontmatter `description`: broad trigger phrasing, honest scope. No scope-creep to win triggering battles.

**Why**: Paul invokes these explicitly. Background awareness lives in project CLAUDE.md or memory, not in trigger descriptions.

### 6. Develop locally, install via symlink

(Superseded by ADR-005 implicitly — local dev now uses `/plugin marketplace add <absolute-path>` directly; symlink unnecessary. See [`docs/findings/2026-05-28-plugin-discovery-needs-install.md`](../findings/2026-05-28-plugin-discovery-needs-install.md).)

## Consequences

- New skill: scaffold `skills/<name>/SKILL.md` with self-contained 11 rules, write an ADR, bump `plugin.json` version.
- New family: new prefix (per #2). *(Updated by ADR-005: new family = new plugin under marketplace.)*
- Changing the 11 rules: update every SKILL.md + plugin CLAUDE.md in the same commit + ADR.
- Skill > ~500 lines: split (rule ⑤ applied to the plugin itself).

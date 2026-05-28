# ADR 001 — Plugin shape and naming

**Status**: accepted — decisions #1 and #2 superseded by [ADR-005](./005-marketplace-plus-plugin-restructure.md); decision #2 was already partially superseded by [ADR-002](./002-rename-deep-module-prefix-to-nav.md). Decision #4 superseded by [ADR-004](./004-language-agnostic-scope.md). Decisions #3, #5, #6 stand.
**Date**: 2026-05-28
**Context**: Founding decisions when bootstrapping the `skills` plugin.

## Decisions

### 1. Single plugin called `skills` (not per-topic plugins)

Following Matt Pocock's `mattpocock/skills` pattern + Anthropic's `anthropics/skills` pattern. The plugin name is intentionally generic; **identity comes from the GitHub username** (`ChenPaulYu/skills`), not the plugin name.

**Alternatives considered**:
- `deep-modules` — focused, but locks the brand to one philosophy. Killed because the plugin is meant to grow beyond deep-modules into other workflow families.
- `paul-dev` — personal umbrella. Killed because Matt's pattern is cleaner: let GitHub scope it, not the local folder name.

### 2. Skills inside use a topic prefix when needed

> ⚠ The specific choice of `deep-module-*` was [reversed by ADR-002](./002-rename-deep-module-prefix-to-nav.md) (now `nav-*`). The *principle* — use a topic prefix when needed — stands.

For the nav family: `nav-audit`, `nav-refactor`, `nav-map`, `nav-headers`. Future topics will get their own prefix (`spec-*`, `verbatim-*`, etc.).

**Why the prefix**: the plugin name `skills` doesn't carry topic context. The prefix tells you which family a skill belongs to. Same rationale as Matt Pocock's `improve-codebase-architecture` and `git-guardrails-claude-code` — topic prefix when needed, short verbs when the meaning is unambiguous.

**Alternatives considered**:
- Short verbs only (`audit`, `refactor`, `map`, `headers`) — too generic when triggered out of context. `/skills:audit` makes you ask "audit what?"

### 3. Each `SKILL.md` is self-contained (no shared `_shared/` folder)

Every skill embeds the 11 rules verbatim and includes everything it needs to run. The plugin's `CLAUDE.md` is for developers editing the plugin; it is NOT a dependency of the skills.

**Why**: when Claude triggers a skill, only that skill's `SKILL.md` is loaded into context. Reaching into a sibling file in the plugin would be unreliable. The cost is duplication (11 rules × 4 skills); the benefit is robust standalone execution.

**Mitigation for the cost**: when the rules change, all four `SKILL.md` files update in the same commit (enforced by the meta-rule "stale = lie" written in the plugin's `CLAUDE.md`).

### 4. Initial scope: TypeScript / React

The skills are calibrated for TS/React codebases (where they were forged). They check `package.json` + presence of `.ts(x)` files and bail with a clear message on unsupported stacks. v2 may extend to Python/Go/Swift.

**Why bail rather than half-fire**: better to refuse than to give bad advice with confidence. Rule ⑨ applied to the skill itself.

### 5. User-triggered, not "pushy" descriptions

These skills do real work that should not auto-fire on tangential mentions. Frontmatter descriptions are written **broad** (multiple trigger phrasings of the same intent) but **honest** about scope — no scope-creep claims to win triggering battles against unrelated skills.

**Why**: Paul prefers to invoke these explicitly (e.g., `/skills:deep-module-audit`). Background awareness of the principles lives in project-level `CLAUDE.md` or memory, not in the trigger description.

### 6. Develop in `~/Desktop/Github/01-project/skills/`, install via symlink locally

For local iteration: `ln -s ~/Desktop/Github/01-project/skills ~/.claude/plugins/marketplaces/skills`. This avoids both polluting Claude Code's managed `~/.claude/plugins/` internals AND the slow round-trip of "push to GitHub for every change".

When stable: push to `ChenPaulYu/skills` and switch to marketplace install.

## Consequences

- Adding a new skill: scaffold under `skills/<name>/`, write a `SKILL.md` (with self-contained 11 rules), write an ADR explaining why it exists and how its trigger avoids stealing fire from siblings, bump version in `plugin.json`.
- Adding a new family beyond deep-module: just use a new prefix; no new plugin needed.
- Changing the 11 rules: update every `SKILL.md` + the plugin `CLAUDE.md` in the same commit + write an ADR explaining what changed and why.
- Skill outgrows ~500 lines: split it (rule ⑤ applied recursively to the plugin).

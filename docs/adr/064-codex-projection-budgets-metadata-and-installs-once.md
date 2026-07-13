# ADR 064 — Codex uses a budgeted metadata sidecar and one profiled installation

**Status**: accepted
**Date**: 2026-07-13
**Partially supersedes**: ADR-022's rule that truncating Claude descriptions below Codex's hard limit is sufficient

## Context

Codex warned that skill descriptions were shortened to fit its skills context budget. The local installation exposed the concrete cause: 34 source descriptions were commonly 450–970 characters, and 18 generated skills existed in both `~/.agents/skills` and `~/.codex/skills`. The old global sync also copied unprefixed raw Claude skills alongside compiled prefixed skills, bypassing the adapter and doubling registrations.

## Decision

1. Claude plugin files remain the frozen content owner. Codex gets a hand-owned, trigger-first description projection in `platforms/codex/descriptions.json`.
2. Codex metadata is gated at 240 characters per skill and 7,000 characters for the full roster.
3. Global sync installs compiled prefixed skills only. It never copies raw unprefixed Claude `SKILL.md` files.
4. Global installs use named profiles (`project-only`, `minimal`, `build`, `research`, `collaboration`, `all`) and a receipt so profile changes prune only files owned by this generator. `project-only` installs none, eliminating overlap while a repo-local mirror is active.
5. Cross-root cleanup deletes only directories carrying this repository's generated banner; unrelated skills are untouched.
6. `docs/codex-compatibility.md` owns the translation rules, including behavioral capability mappings and the GPT-5.6 supervisor / GPT-5.4 executor local policy.

## Why

- Codex loads metadata before triggering a skill, so shortening the body does not address this warning; reducing always-loaded descriptions and duplicate registrations does.
- A Codex-only sidecar preserves Claude's broad trigger descriptions and avoids a second editable workflow body.
- Profiles make installation cost proportional to actual use while the committed mirror can still serve the full marketplace and other Agent Skills consumers.
- A receipt and generated-banner check make pruning deterministic without treating the user's whole skills directory as generator-owned.

## Consequences

- A new or renamed skill must add a Codex description in the same change or validation fails.
- `--sync-global` no longer maintains generic unprefixed aliases; existing callers should use flat prefixed names.
- The full mirror remains under `.agents/skills`; profiles affect global installation, not repository generation.
- Model-role translation is documented but is not claimed as runtime-enforced until Codex agent configuration is implemented and smoke-tested in a later compatibility phase.

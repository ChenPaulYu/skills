# ADR 045 — `think` is lightweight: reason in-chat, no file artifact

**Status**: accepted
**Date**: 2026-06-15
**Amends**: [ADR-034](034-think-plugin.md) (the think charter — specifically its *Output* row: was "a fixed-shape `thinking/<date>-<topic>.md` artifact per lens"; now in-chat only)

## Context

ADR-034 gave each `think` lens a fixed-shape **`thinking/<date>-<topic>.md` artifact** (read-only by default, offer-where-to-save). In practice that makes `think` heavier than its purpose: a reasoning lens you summon to *think something through* should hand you the reasoning, not spawn a file to manage.

Two things make the file redundant:

- **`think` feeds shape one-way** (ADR-034 / ADR-015): an insight routes to `/shape:elicit` (→ `thoughts/`), `/shape:mockup`, or `/nav:plan`. So the **durable home already exists downstream** — a `think`-owned `thinking/` file is a second, parallel place for the same content (a mild rule-① duplication: two homes for one reasoning output).
- The value of a lens is the **forced structure**, not its persistence. The structure lands fine in the conversation; it does not need a file to be the value.

## Decision

**`think` is the lightest plugin: it reasons *in-chat* and writes no file.** Persistence is by **routing to shape**, not a think-owned artifact.

- A lens surfaces its fixed-shape analysis in the conversation; it never writes a `thinking/` note (or any file), and never writes source or makes the decision.
- To keep an analysis, route it: `/shape:elicit` converges it (→ `thoughts/`), `/shape:mockup` renders it, `/nav:plan` grounds it. `think` already ends with that guarded one-shot offer (ADR-007/015) — that offer *is* the persistence path now.

This sharpens the family boundary: `shape` / `research` / `manage:observe` **produce durable artifacts**; `think` is **pure reasoning, ephemeral by design**.

## Consequences

- `plugins/think/skills/first-principles/SKILL.md` — the "artifact" framing + the save-to-`thinking/` lines become "the structured reasoning, in-chat; no file"; the `Output` section + frontmatter `description` updated.
- `plugins/think/CLAUDE.md` — the "read-only, asks where to save" convention becomes "lightweight, in-chat by default; persistence via routing to shape"; the forced-structure-output line drops the file-`head` framing.
- `README.md` — the `/think:first-principles` line drops "output saved to `thinking/`".
- ADR-034 left intact (records the original design); this ADR supersedes its Output row forward.
- Future `think` lenses inherit this: a new lens reasons in-chat too — the value-guardrail (force a structure the default skips) is unchanged; only the persistence model is lighter.
- Gating site map: ADR count 44 → 45; the think node/blurb note the in-chat output; rev bump + FIXED entry.

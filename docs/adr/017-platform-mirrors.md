# ADR-017 — Platform mirrors (Codex, Cursor)

Status: accepted · 2026-11-18

## Decision

`plugins/` is the single owner; Codex and Cursor copies are generated one way and
never hand-edited. Codex reads a flattened mirror with a description budget and
profile-based installs; its adapter has its own release line and role-based (not
model-name) semantics (`docs/codex-compatibility.md`). Cursor consumes native plugins
from `platforms/cursor/<plugin>/`, never the Codex mirror.

## Evidence and alternatives

- A hand-ported second copy was rejected: it drifts.
- Installing only to `~/.agents/skills` was rejected; Cursor would also discover the
  flattened copies.
- Pointing Cursor at `.agents/skills` or symlinking `plugins/` was rejected for native
  plugins.

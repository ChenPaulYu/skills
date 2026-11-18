# ADR-018 — Manifest, catalog and commit gates

Status: accepted · 2026-11-18

## Decision

Each plugin's `.claude-plugin/plugin.json` owns its name, version, description and
author; every other copy is derived. README and site catalog blocks are generated
from manifests and skill frontmatter; `docs/catalog-copy.json` owns presentation
only, never membership. The pre-commit hook validates the exact staged snapshot, not
the working tree.

## Evidence and alternatives

- A hand-maintained roster was rejected: retired skills stayed listed.
- Validating the working tree was rejected: unstaged repairs could hide a broken
  commit.
- Banning partial staging was rejected; validating the staged snapshot makes it safe.

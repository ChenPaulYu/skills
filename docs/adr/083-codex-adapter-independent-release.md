# ADR 083 — Codex adapter releases independently from the Claude marketplace

**Status**: accepted
**Date**: 2026-07-14
**Extends**: [ADR-022](docs/adr/022-codex-compat-generator.md), [ADR-064](docs/adr/064-codex-projection-budgets-metadata-and-installs-once.md), [ADR-067](docs/adr/067-dispatch-tiers-consultant-seat.md), [ADR-068](docs/adr/068-codex-freeze-scoped-to-workstream.md)

## Context

Phases 1–5 made the Codex layer behaviorally compatible, but the release story was still half-owned by prose and a Phase-labeled manifest:

- Claude source was frozen in practice, but the release contract for that freeze was not ratified as a marketplace rule.
- `platforms/codex/manifest.json` still read like a migration milestone (`0.6.0-phase5-full-roster-gates`) rather than a releasable adapter with its own version policy.
- README + site install text still described the older "copy `.agents/skills/` by hand" path, which did not install the required Codex runtime artifacts (`~/.codex/agents/*`, lifecycle hook files) or exercise the dedupe/receipt behavior.
- Public marketplace semantics needed a hard line between **portable roles** and **local model names**: the adapter ships `supervisor` / `executor` / `explorer` / `reviewer`; Paul's GPT-5.6 / GPT-5.4 mapping stays local policy, not public marketplace fact.

Without a ratified release contract, the Codex layer could pass the compatibility audit yet still ship stale instructions, phase-shaped metadata, or an install path that a fresh user could not actually follow.

## Decision

1. **Claude source remains the frozen owner; the Codex adapter is the only translation owner.**
   The freeze remains the workstream contract from ADR-068: `plugins/**`, root `CLAUDE.md`, `.claude-plugin/**`, and `.cursor-plugin/**` are not edited to make Codex work. The maintained operational guide is [`docs/codex-compatibility.md`](docs/codex-compatibility.md); this ADR ratifies the boundary, not a second copy of the procedure.

2. **The Codex adapter has its own independent release line.**
   `platforms/codex/manifest.json` owns:
   - adapter `schema_version`
   - adapter `adapter_release`
   - release policy
   - fresh-install smoke fixture ownership

   The adapter release uses independent semver and must not encode migration phases or Claude plugin versions.

3. **Portable marketplace semantics are role-based; model names are local policy.**
   Public Codex artifacts, docs, and generated skills speak in roles (`supervisor`, `executor`, `explorer`, `reviewer`) and explicit capability degradations. Personal model mapping lives only in `platforms/codex/local/README.md` and any user-local Codex config layered on top of the portable templates.

4. **Every unsupported or host-conditional capability degrades explicitly.**
   The adapter may lower behavior, emit a runtime artifact, or stop with a stated fallback. It may never silently imply that Codex has a Claude-only affordance. `docs/codex-compatibility.md` remains the maintained owner of those mappings and fallback commands.

5. **Independent release means fresh-install acceptance, not only repo-local generation.**
   The release gate now requires two repeatable smokes, owned by manifest-listed fixtures:
   - a fresh Codex HOME can install a selected compiled profile plus the runtime artifacts that profile needs, with no duplicate generated legacy copies and no unresolved Claude-only constructs in the installed skills;
   - a fresh Claude-side manifests/validation pass preserves the frozen source contract and existing manifest behavior.

## Why

- The adapter is a distribution layer, not a plugin. Tying its version to marketplace phases or plugin manifests leaks ownership across boundaries.
- A role-based public contract is portable across users and future Codex models; personal model names are not.
- "Builds in this repo" is weaker than "a fresh user can install it." The latter is the actual release claim.
- The maintained guide must stay singular. ADR + guide is a clean split: the ADR owns the law; the guide owns the commands.

## Consequences

- `platforms/codex/manifest.json` now fails validation if release metadata drifts from the independent-release policy or its owned smoke fixtures disappear.
- `node scripts/build-codex.mjs --sync-global --profile <name>` becomes the supported Codex global install path; it installs compiled skills plus only the runtime artifacts the selected profile needs, and prunes the generator-owned stale ones via its receipt.
- README and the site map must describe the supported adapter install/audit path in both languages when that path changes.
- Future adapter-only release work updates `platforms/codex/**`, `docs/codex-compatibility.md`, the release smokes, and the human-facing surfaces; it does **not** bump Claude plugin versions unless the Claude source itself changed.

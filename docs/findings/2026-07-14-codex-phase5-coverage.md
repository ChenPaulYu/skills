# Codex Phase 5 coverage

Role: durable evidence that Codex compatibility Phase 5 reached full-roster coverage and
hardened validation, without claiming Phase 6 completion.

The maintained translation procedure lives in [`docs/codex-compatibility.md`](docs/codex-compatibility.md).
This note records evidence only; it does not duplicate that guide's design rules.

## Class policy

- **A** — portable core, copied through after namespace/path normalization.
- **B** — mechanical syntax, lowered by deterministic compiler transforms.
- **C** — host capability, lowered through named Codex adapters with coverage checks.
- **D** — unsupported/absent host capability, degraded explicitly; never leaked silently.

## Result

- Roster coverage: **36/36** skills.
- Capability rows: `browser_verify=3`, `explicit_invocation_only=6`, `interactive_choice=9`,
  `mechanical_model_tier=5`, `project_guidance=1`, `session_open_awareness=1`,
  `worker_dispatch=5`.
- Canary fixtures: **20/20**.
- Negative fixtures: **16/16**.
- Unresolved compatibility categories: **zero**.
- Frozen Claude contract: **clean**.

## Hard gates

```bash
node scripts/validate-codex-skills.mjs --compat-audit
node scripts/validate-codex-skills.mjs --codex-compat
node scripts/validate-codex-skills.mjs
```

These gates now verify the full roster, capability coverage, generated-runtime contracts,
negative fixtures, and frozen-source cleanliness. Phase 6 documentation/release work remains
separate.

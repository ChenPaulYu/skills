# Codex compatibility translation guide

> Claude Code plugin files are the frozen source contract. Codex compatibility is a generated projection owned by `platforms/codex/` and `scripts/build-codex.mjs`.

## The rule

Never solve Codex compatibility by weakening or forking the Claude skill. Keep `plugins/**`, `CLAUDE.md`, `.claude-plugin/**`, and `.cursor-plugin/**` unchanged. Translate host-specific syntax and runtime assumptions while preserving the skill's behavioral gates.

```text
Claude owner                          Codex projection
plugins/*/skills/*/SKILL.md  ───────▶ .agents/skills/*/SKILL.md
                                      generated, never hand-edited
               platforms/codex/* ───▶ metadata + capability policy
```

One source owns the method; the adapter owns only the host translation.

## Context-budget rules

Codex always sees every installed skill's `name` and `description`; it loads the body only after a skill triggers. Treat metadata as a shared, bounded index.

1. **One active copy per skill.** Never install the same generated name in both `~/.agents/skills` and `~/.codex/skills`. Project and global copies also overlap while that project is open, so prefer a small global profile.
2. **Codex descriptions are sidecars.** `platforms/codex/descriptions.json` owns short, trigger-first descriptions. Claude descriptions remain complete and unchanged.
3. **Front-load discrimination.** State the object, action, and strongest trigger first. Put examples, anti-triggers, sibling boundaries, and procedure in the body.
4. **Budget mechanically.** Every description is at most 240 characters and the full marketplace sidecar is at most 7,000 characters. The validator rejects missing, stale, or oversized entries.
5. **Install by need.** Use `minimal`, `build`, `research`, or `collaboration`; reserve `all` for environments that truly need the full roster. Use `project-only` to clear generator-managed global copies when a project's own `.agents/skills` is sufficient.

Audit the current projection and global duplicates:

```bash
node scripts/validate-codex-skills.mjs --metadata-audit
```

Install one compiled profile into the canonical global Agent Skills root:

```bash
node scripts/build-codex.mjs --sync-global --profile build
```

While developing this marketplace itself, eliminate project/global overlap entirely:

```bash
node scripts/build-codex.mjs --sync-global --profile project-only
```

For a one-time migration, remove only marketplace-generated duplicates from the older Codex-specific root:

```bash
node scripts/build-codex.mjs --sync-global --profile build --dedupe-global-roots
```

The cleanup checks the generated banner before deletion. It does not remove unrelated or hand-authored skills. Re-run the desired global profile after leaving a project that already carries the full mirror.

## Translation table

| Claude source signal | Codex projection rule | Required invariant |
|---|---|---|
| `plugin:skill` / `/plugin:skill` | Flatten to `plugin-skill` | Cross-references remain invokable. |
| `CLAUDE.md` | Rewrite to `AGENTS.md` | Durable repo guidance remains discoverable. |
| Long `description` | Replace from the Codex sidecar | Trigger meaning survives within the metadata budget. |
| `AskUserQuestion` | Codex interactive input when callable; otherwise ask directly and stop | No execution before the user's choice. |
| `Agent` / `subagent_type` | Codex worker role and explicit work packet | Scope, return schema, and supervisor check survive. |
| `model: sonnet` | Codex executor/mechanical role | Cost-tier intent survives without leaking a Claude model name. |
| `disable-model-invocation` | Remove unsupported metadata; add an explicit-invocation policy | The skill must not begin implicitly. |
| Claude custom agent | Generate or install a Codex agent artifact | A skill never references an agent that does not exist. |
| `/init` or session-open behavior | Verified Codex hook/config, or explicit on-demand degradation | Never claim an automatic lifecycle Codex cannot provide. |
| `references/`, `scripts/`, `assets/` | Copy with path rewriting | Bundled resources remain reachable from the generated skill. |

Unknown host-specific constructs are build errors. Add a named capability mapping or an explicit degradation to `platforms/codex/manifest.json`; never silently copy a claim that Codex cannot fulfill.

## Supervisor and executor policy

Portable skills speak in roles, not personal model names:

- `supervisor`: decomposes work, owns user decisions, arbitrates ambiguity, inspects returned diffs, and performs final verification.
- `executor`: reads code, explores, implements a scoped packet, runs mechanical checks, and returns evidence; it does not self-approve.
- `reviewer`: independently verifies behavior and risks.

For Paul's Codex environment, the intended mapping is GPT-5.6 for the root supervisor and GPT-5.4 for executor/explorer work. This mapping is Codex-only local/project policy. Until an emitted Codex agent configuration has been verified against the installed client, the adapter must report that the mapping is not runtime-enforced rather than claiming it switched models.

Every delegated work packet carries:

```text
goal · owned scope/files · inputs/source of truth · constraints
done_when · verification commands · base SHA · return schema
```

Every worker returns:

```text
status · changed files · diff summary · commands/results
assumptions · unresolved risks · current SHA
```

The supervisor must inspect the diff and rerun proportionate verification. A worker's `done` is evidence to review, not completion by itself.

## Change procedure

1. Read the Claude source and classify each construct as portable core, mechanical syntax, host capability, or unsupported.
2. Add or update the Codex-only projection rule. Do not edit the generated mirror directly.
3. Add fixtures for the source signal, generated output, stop boundary, and explicit degradation if needed.
4. Regenerate with `node scripts/build-codex.mjs`.
5. Run both audits and the full validator:

```bash
node scripts/validate-codex-skills.mjs --metadata-audit
node scripts/validate-codex-skills.mjs --compat-audit
node scripts/validate-codex-skills.mjs
git diff --exit-code -- CLAUDE.md .claude-plugin plugins
```

6. Confirm the generated artifact references only tools, agents, hooks, and files that actually exist on Codex.

Compatibility means preserved behavior or an honest stop/degradation—not merely a file that Codex can discover.

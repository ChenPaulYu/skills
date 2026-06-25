# ADR 055 — relay gains a `format` verb: a frontmatter conformance sweep

**Status**: accepted — implemented 2026-06-25 (relay `0.4.0`)
**Builds on**: [ADR-054](docs/adr/054-relay-decision-ledger.md) (the thought/link model `format` enforces)

## Context

The thought frontmatter spec evolved fast (subject-quoting, universal `thread`, `re`, `relate`, one-way links). Each evolution left older thoughts behind, and conforming them was done **by hand** — repeatedly, tediously, and with real breakage (unquoted `subject` colons and `[`-leading link values produced invalid YAML that broke GitHub's render). There was no systematic "bring the thoughts up to the current format" pass — the gap `/nav:sync` fills for file-top headers.

## Decision

Add a seventh relay verb, **`format`** — sweep **one project's** `thoughts/` and bring their frontmatter to the current spec, **syntactic conformance only, gated by a diff**. relay `0.3.0 → 0.4.0`.

- **Two layers (ADR-051's code/LLM split, concrete):**
  - **Layer 1 — `scripts/lint.mjs` (node, deterministic):** regex-based — unparseable YAML, missing required field, unquoted `subject`/link. The fast-path; degrades to a SKILL.md recipe when node is absent.
  - **Layer 2 — the agent (semantic judgment):** what a regex can't — infer a missing/wrong `thread` from what the thought *does*, lift an inline "re [id]" into the `re` field, **suggest a `relate`** from a prose cross-reference, catch structural drift (a review missing its `## Review`, an FYI smuggling an `@`-ask). Proposed under the gate, never guessed.
- **Syntactic only — never the meaning.** That is the line that lets `format` edit an otherwise-immutable thought (and a counterpart's): a non-conformant file is a *defect*; fixing the defect is not rewriting the record. Always gated.
- **One project at a time** — never the whole repo (too big; conformance is per-project).

## Consequences

- **Bundled script** — `format/scripts/lint.mjs` is the first bundled helper since `check-acceptance.mjs` was retired (ADR-053). Listed in `plugins/relay/CLAUDE.md` → *Helper scripts*.
- **Registration** — verb table + "seven verbs" updated in `plugins/relay/CLAUDE.md`; both `plugin.json` mirrors bumped to `0.4.0` with `format` in the description; manifests + codex regenerated; validator green.
- **Immutability** — `format` is the *sanctioned* way to edit an existing thought (syntactic conformance, gated). All other edits to a settled/old thought remain forbidden; `format` is not a backdoor to rewriting content.

## Out of scope

- **The backlink / nav generator** (ADR-054, sanctioned-but-not-built) is a *different* script (computes the link graph for non-Obsidian readers); `format` only conforms input shape, it doesn't render navigation.

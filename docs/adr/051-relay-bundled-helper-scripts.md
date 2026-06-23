# ADR 051 — relay bundles helper scripts for its deterministic core (marketplace-first)

**Status**: accepted
**Date**: 2026-06-23
**Refines**: [ADR-050](docs/adr/050-relay-plugin.md) (the relay plugin these helpers serve)

## Context

Every skill so far is **markdown instructions only** — the SKILL.md tells the agent what to do; the agent uses its tools (Read, Bash, …) to do it. That fits the analysis-shaped plugins (`nav`/`shape`/`think` are mostly *judgment*). But `relay` is different: it is a **structured-data protocol** — parse the YAML roster, parse markdown threads, stitch items by id, **check whether a decision's `@`-set is fully accepted**, verify signatures, move files. Those are **deterministic** operations, and some are **correctness-critical**.

The sharpest case: **graduation**. A decision graduates when *every* `@`-ed person has accepted. If the agent computes that "by reading the thread and reasoning", it can **mis-judge completion and ratify a non-consensus** — a hallucinated `accept`. For a tool whose entire value is consensus, that risk is unacceptable, and it is exactly the kind of mechanical set-comparison code does perfectly and an LLM does fallibly.

## Decision

**relay may bundle helper scripts for its deterministic / correctness-critical operations**, under each skill's `skills/<name>/scripts/` (which `scripts/build-codex.mjs` already copies verbatim into the Codex/Cursor mirror). The split:

- **Code (a bundled script)** — the mechanical, deterministic, often correctness-critical work: set-comparison, structured parsing, signature checks.
- **The LLM (SKILL.md prose)** — the judgment: distilling a report into buckets, writing a decision's rationale.

The SKILL.md *orchestrates*: "run the helper to compute X (deterministic), then **you** write Y (judgment)."

**Language by task, not one rule:**
- **Parsing / set-logic** (YAML roster, markdown threads, `@`-set completion) → **node (`.mjs`)** — bash parses structured text fragilely, and a fragile correctness gate is the wrong risk.
- **git / verification** (signature checks, `gh api`, file moves) → **bash** — it is git commands; bash is the direct tool.

**Bundling constraint (the reason the split lands where it does):** the mirror copies each skill's `scripts/` **independently** — there is no shared-across-skills bundled-code location. So:
- A helper used by **one** skill lives in that skill's `scripts/` (single owner, no duplication).
- Logic shared across skills but **trivial** (e.g. identity resolution = `git config user.email` + a roster lookup) stays a **precise SKILL.md recipe**, not a script — duplicating a script across 4 skills is a maintenance hazard a recipe avoids.

## First helper (this ADR)

**`skills/reply/scripts/check-acceptance.mjs`** — given a project dir (and optionally a `[D]` id), parse `thoughts/` for each open decision's `@`-set and its `accept` replies, and report which decisions are **complete** (every `@`-ed handle has accepted) → JSON. `reply` runs it before graduating, so the **consensus gate is exact, not inferred**. Used by `reply` only → single owner, no duplication. No external deps (parses markdown with regex).

**Not scripted (deliberate):** identity resolution (`whoami`) stays a SKILL.md recipe — trivial, used by all four content skills, and not worth a 4×-duplicated script.

## Consequences

- **relay v0.1.0 → 0.1.1** (a helper added; manifests + codex mirror regenerated — the mirror now carries `relay-reply/scripts/`).
- **`plugins/relay/CLAUDE.md`** gains a "Helper scripts" note (the code-vs-judgment split + language-by-task + the bundling constraint) as the pattern's owner.
- **`reply/SKILL.md`** runs the helper at the graduation step.
- **Site map**: ADR count 50 → 51; audit-block rev + FIXED entry. No new skill/slug (README unchanged).
- Establishes the pattern for the **next batch**: signature/github verification (bash) and digest/settle state computation (node), when built.

## Out of scope

- **A shared relay helper library** — the per-skill mirror model has no clean home; revisit only if real duplication appears.
- **Signature verification + digest/settle scripts** — deferred to the next batch (the pattern is now sanctioned).

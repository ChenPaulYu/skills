# ADR 004 — Language-agnostic scope (universal core + per-stack heuristics)

**Status**: accepted — post [ADR-005](./005-marketplace-plus-plugin-restructure.md) skills are bare verbs (`audit` / `refactor` / `headers` / `map` / `doctor`); scope unchanged.
**Date**: 2026-05-28
**Supersedes**: [ADR-001](./001-plugin-shape-and-naming.md) decision #4

## Context

ADR-001 locked initial skills to TS/React with a "v2 = other stacks" deferral. The 11 rules are inherently language-agnostic; only the mechanical checks are stack-specific. TS/React lock-in was an implementation accident.

## Decision

All 5 skills support any language. Each has:

- **Universal core** — runs on any codebase
- **Stack-specific heuristics** — activate when a known stack is detected

Detect stack at the start of every run. **Do not bail on unknown stacks** — degrade to universal checks, flag what was skipped.

## Per-skill split

| Skill | Universal core | Stack-specific (when detected) |
|---|---|---|
| `audit` | File LOC · function LOC · imports per file · dead modules · cross-domain edges · barrels · rule ⑪ self-eval | TS/React: hooks, JSX render; Python: class methods, docstrings; Go: init(), package cycles; Rust: trait-impl span, `pub` sprawl |
| `refactor` | Verbatim move + test-gate-after-each-step + real-app pass | Gate commands: `pnpm test` / `pytest` / `go test` / `cargo test` |
| `headers` | Convention (title + 2-3 sentence + Reads) | Syntax: `/** */` (JS/TS) · `"""..."""` (Python) · `// ...` (Go) · `//! ...` (Rust) · `/// ...` (Swift) · `# ...` (Ruby) |
| `map` | HTML rendering · domain detection · anatomy identification | Import syntax adapts (grep) |
| `doctor` | Inherits from above | Inherits from above |

## Why

- **11 rules are language-agnostic.** Ousterhout applies anywhere modules + interfaces exist. Locking to TS/React was an accident, not a design.
- **Universal checks are highest-signal.** File LOC + function LOC + dead modules + cross-folder imports + rule ⑪ self-eval = ~80% of what the audit catches. Stack-specifics add precision, aren't load-bearing.
- **Bailing loses ground.** A Go project gets useful output from universal checks. Bailing forces "re-invoke later" — bad UX, no upside.

## Detection

```bash
ls package.json pyproject.toml requirements.txt go.mod Cargo.toml Package.swift Gemfile build.gradle 2>/dev/null
```

| Detected | Maps to |
|---|---|
| `package.json` + react in deps | TS/React |
| `pyproject.toml` / `setup.py` / `requirements.txt` | Python |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `Package.swift` | Swift |
| `Gemfile` | Ruby |
| `build.gradle` / `pom.xml` | Java/Kotlin |
| None + source files exist | Unknown — universal-only, note in report |

## Consequences

- Every SKILL.md has a Scope section declaring language-agnostic + detection.
- `headers` documents docstring syntax per language; `refactor` gives gate-command examples per stack.
- v2-stacks is current behaviour with potentially less precision, not a future ambition.
- Underserved stack → write `references/<stack>.md` inside the skill (progressive disclosure within the skill).

## Notes

- "Universal core" ≠ "best-in-class everywhere" — it's the floor.
- Less-familiar stacks (Haskell, Erlang, Zig) will be sparse. PRs welcome.
- **Lesson**: separate the principle from the heuristic that detects it. Principle = value; heuristics = implementation. Stack-lock only when the principle itself is stack-specific (rare).

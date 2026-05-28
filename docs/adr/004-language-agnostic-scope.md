# ADR 004 — Language-agnostic scope (universal core + per-stack heuristics)

**Status**: accepted
**Date**: 2026-05-28
**Supersedes**: portion of [ADR-001](./001-plugin-shape-and-naming.md) (decision #4 — "Initial scope: TypeScript / React")
**Context**: ADR-001 locked the initial skills to TS/React with a "v2 = other stacks" deferral. Then realized the 11 rules are inherently language-agnostic — only the mechanical checks are stack-specific. The TS/React lock-in was an implementation accident, not a design choice.

## Decision

**All five skills support any language.** Each skill has:
- A **universal core** that runs on any codebase
- **Stack-specific heuristics** that activate when a known stack is detected

Detect stack at the top of every run; calibrate accordingly. **Do not bail on unknown stacks** — degrade gracefully to universal checks + flag what was skipped in the report.

## What "universal core" means per skill

| Skill | Universal core | Stack-specific (when detected) |
|---|---|---|
| `nav-audit` | File LOC · function LOC · imports per file · dead modules · cross-domain edges · barrel presence · rule ⑪ self-eval | TS/React: hook count, JSX render size; Python: class methods, docstrings; Go: init() usage, package cycles; Rust: trait-impl span, `pub` sprawl |
| `nav-refactor` | Verbatim move + test-gate-after-each-step + real-app pass discipline | Stack-aware gate commands (`pnpm test` vs `pytest` vs `go test` vs `cargo test`); stack-aware run commands |
| `nav-headers` | Convention (title + 2-3 sentence + Reads) | Syntax varies: `/** */` (JS/TS/Java) · `"""..."""` (Python) · `// ...` (Go) · `//! ...` (Rust) · `/// ...` (Swift) · `# ...` (Ruby) |
| `nav-map` | HTML rendering, domain detection, anatomy identification | "Imports" syntax varies (`import x from 'y'` / `from y import x` / `use y` / etc.) — grep adapts |
| `nav-doctor` | Inherits from above | Inherits from above |

## Why

1. **The 11 rules are inherently language-agnostic.** Ousterhout's principles apply to C++, Java, Python, Go, Rust, Haskell — anywhere modules and interfaces exist. Locking the SKILLS to TS/React was an implementation accident, not a design statement.

2. **Universal checks are the highest-signal checks.** File LOC + function LOC + dead modules + cross-folder imports + rule ⑪ self-eval account for ~80% of what the audit actually catches. Stack-specific checks (e.g. JSX render size) add precision but aren't load-bearing for the audit's value.

3. **Bailing on unknown stacks loses ground unnecessarily.** A Go project gets useful audit output from the universal checks alone. Bailing would force users to "re-invoke later when v2 lands" — bad UX, no upside.

## Detection mechanism

At the start of every skill run:

```bash
ls package.json pyproject.toml requirements.txt go.mod Cargo.toml Package.swift Gemfile build.gradle 2>/dev/null
```

Plus `find` for primary extensions. Map to:
- `package.json` + react in deps → TS/React
- `pyproject.toml` / `setup.py` / `requirements.txt` → Python
- `go.mod` → Go
- `Cargo.toml` → Rust
- `Package.swift` → Swift
- `Gemfile` → Ruby
- `build.gradle` / `pom.xml` → Java/Kotlin
- none of the above + still has source files → unknown — universal checks only, note in report

## Consequences

- All 5 SKILL.md files have a "Scope" section declaring language-agnostic + listing detection patterns.
- `nav-headers` SKILL.md documents docstring syntax for major languages.
- `nav-refactor` SKILL.md gives gate-command examples for each stack.
- ADR-001 decision #4 stands as historical record but is superseded.
- v2 stacks aren't a future ambition anymore — they're current behaviour with potentially less precision.
- If a stack proves consistently underserved, write per-stack heuristics in a `references/<stack>.md` per skill (progressive disclosure within the skill).

## What this doesn't promise

- "Universal core" is **not** equivalent to "best-in-class for every language." It's the floor — useful everywhere, not optimized everywhere.
- Stack-specific heuristics for less-familiar stacks (Haskell, Erlang, Zig, etc.) will be sparse or absent. Pull requests welcome.
- The visual / interaction form for `nav-map` is language-agnostic; the content (descriptions, anatomy choices) reflects whatever stack you're on.

## Lesson recorded

When designing a skill, **separate the universal principle from the stack-specific heuristic that detects it.** The principle is what makes the skill valuable. The heuristics are implementation. Lock the skill to a stack only when the principle itself is stack-specific (rare).

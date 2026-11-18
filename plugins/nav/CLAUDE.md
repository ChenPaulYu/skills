# nav — plugin guide

> For editing this plugin. To run a skill, read its `SKILL.md`; each is self-contained.
> Repo-wide rules live in the root [`CLAUDE.md`](CLAUDE.md).

## What nav is

Skills for keeping code navigable as it grows, after Ousterhout's *A Philosophy of Software
Design*. Seven verbs, one per job ([ADR-004](docs/adr/004-nav-verb-roster.md)): `audit`
(assess) · `refactor` (restructure, behavior preserved) · `sync` (headers and reader documents
against code, [ADR-005](docs/adr/005-nav-sync-scope.md)) · `plan` (a requested engineering
approach) · `do` (implement decided behavior and verify it) · `compose` (author or restructure
prose) · `ship` (land finished work). Language-agnostic: a universal core plus per-stack
heuristics; degrade to universal checks and say what was skipped.

## The 8 rules

Deep modules at every scale: Shape ①–⑤ · Discipline ⑥–⑦ · Test ⑧. Each skill carries the parts
it needs.

1. **Deep modules through information hiding** — a simple interface over significant
   complexity. Each design decision (data shape, algorithm, format, assumption) lives in one
   module. Red flags: **information leakage** (the same knowledge in ≥2 modules) and
   **temporal decomposition** (boundaries following execution order instead of knowledge).
   The rule recurses: modules compose behind a package façade into the next-scale module, so
   a folder earns existence only by hiding members or being a declared contract.
2. **Interface-first at every scale** — one door per module, subsystem (barrel/façade) and
   codebase (index/map); drill into bodies only as needed.
3. **Explicit dependencies** — deterministic functions; dependencies in the signature.
4. **Right grain** — neither giant nor needlessly fragmented.
5. **Fit the framework** — idiomatic patterns; don't fight the ecosystem.
6. **Preserve behavior while restructuring** — keep observable behavior and public contracts;
   verify any internal rewrite against the same contract.
7. **Resolve consequential uncertainty** — inspect evidence first; ask when missing intent or
   authority would change scope, behavior or compatibility; label guesses.
8. **Agent-navigability is the audit** — if an agent must enumerate, footnote, guess or list
   more than six imports to explain a module, it is not deep.

Thresholds are signals, not verdicts ([ADR-003](docs/adr/003-nav-eight-rules.md)): split only
at a useful boundary. The rules apply to nav's own files too.

## Design patterns nav owns

- **N+1 trigger** — the first consumer of an inline utility or repeated value may stay inline;
  the second extracts an owner, in any layer (code, tokens, prompts, config). Aggregate
  leakage that no single change can see is `audit`'s job.
- **The verb is the only door for its deliverable** ([ADR-006](docs/adr/006-handoffs-and-authorized-scope.md))
  — when you are about to hand-produce a behavior change, a structural move or a comparison
  mockup, fire `/nav:do`, `/nav:refactor` or `/shape:mockup` instead.
- **Reuse via transcript** — a skill that needs another's output first checks whether it
  already ran on the same input this session and reuses it (`sync`, `plan` reuse `audit`).
- **Inject ↔ check at hand-off** — give a bounded executor scope, seams, contracts and
  completion checks; read the actual diff and reproduce verification before accepting.
- **Live-LLM cost** ([ADR-008](docs/adr/008-verification-and-spend-gates.md)) — name added paid
  scope before running it; never substitute a mock and call it live verification.
- **Task ownership** ([ADR-016](docs/adr/016-task-owned-planning-and-direct-execution.md)) —
  Shape's task owns the delivery record; `do` verifies and writes back to it; `plan` answers in
  chat unless asked to persist. A plan location is a convention, not permission to commit
  process notes.

## When editing nav

- Changing the 8 rules: update every skill and bundled restatement in the same change, and the
  owning ADR.
- No nav verb is frontmatter-tiered to `model: sonnet`; `sync` judges meaning against code.

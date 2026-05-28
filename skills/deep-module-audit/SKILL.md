---
name: deep-module-audit
description: Audit a TypeScript/React codebase against deep-module / progressive-disclosure principles (Ousterhout's "A Philosophy of Software Design"). Use this skill whenever the user asks to "audit my codebase", "check if X is modular", "review the architecture", "is this a deep module?", "what's wrong with this codebase?", "any architectural smells?", "is this well-structured?", or any similar architectural-quality assessment — even when they don't say the word "audit" explicitly. Also fires when the user discusses modularity, progressive disclosure, layering, or whether their code is grounded vs guessed. Read-only — modifies no files.
---

# Deep-module audit

Honestly assess a TypeScript/React codebase against 11 deep-module principles, then report what's working, what's drifting, what's broken, and where the agent itself struggled to describe a module — that struggle is a first-class signal of failed abstraction.

## Why this skill exists

Most "code review" focuses on bugs. This audit focuses on **shape** — does the code expose narrow interfaces over hidden complexity? Can a new reader (human or agent) navigate it without drowning? Modules that fail these questions silently rot the codebase even when every test passes.

## Scope

- **Supported**: TypeScript / React (incl. JSX/TSX, Next.js, Vite)
- **v2 / not yet supported**: Python, Go, Rust, Swift, Vue, Svelte, vanilla JS

If the codebase isn't primarily TS/React (detect via `package.json` + presence of `*.ts(x)` files), say so and stop:

> "This skill is calibrated for TypeScript/React. Detected stack: `<X>`. The principles below apply universally, but the specific checks (component span, hook count, JSX render size) won't be accurate. Stopping. Re-invoke when v2 ships, or ask for a generic architectural review instead."

## The 11 rules (the audit IS these rules)

1. **Good interfaces** — Low-level modules expose an interface you can use without reading the body.
2. **Progressive disclosure** — An index/doc surfaces the interface; you drill in only as needed.
3. **No hidden params** — Functions are deterministic; deps are explicit, not ambient.
4. **Future-ready foundation** — The base supports planned features before they ship (e.g. banked v2 fields not wired yet but reserving shape).
5. **No giants** — No single mega-module or mega-function. A 700-line render counts as a giant.
6. **No needless abstraction** — If it needn't be modular, don't modularise it. **Rules ⑤ ↔ ⑥ are deliberate tension — you're balancing them.**
7. **Fit the framework** — Idiomatic patterns (React: custom hooks; pass a store/hook object as one prop instead of 20 loose props).
8. **Rearrange, don't rewrite** — Refactor = verbatim move + rewire. Behaviour stays identical.
9. **Below 90% confidence → ask** — When unsure about scope/boundaries/intent, stop and clarify.
10. **Group + expose via one door** — Subsystems expose their public API through a barrel/facade (`index.ts`).
11. **Agent-navigability is the audit** — *This skill IS this rule in action.* When you (the agent) try to write a one-sentence description of each load-bearing file, the difficulty of that act is the deep-module test. Failure cues: must enumerate, must footnote, must guess, must list > 6 imports as "Reads:".

## Audit process

Work in order. Don't skip — each layer of evidence builds on the previous.

### Step 1 — Detect stack and bound scope

```bash
test -f package.json && grep -E '"react"|"react-dom"' package.json
find . -name '*.tsx' -not -path '*/node_modules/*' | head -3
```

If not TS/React → use the unsupported-stack message above and stop.

Infer the source root (commonly `src/`, `app/`, `frontend/src/`). Treat it as the auditable surface; ignore `node_modules`, `dist`, `build`, generated files.

### Step 2 — Domain inventory

Observe the folder shape; don't impose one. Typically one top-level folder per domain (e.g., `core/`, `app/`, `audio/`, `canvas/`, `crates/`, `shell/`).

For each domain capture: file count, total LOC, the "leader" file(s) (the largest / the most-imported / the one whose name matches the domain).

```bash
find src/<domain> -type f \( -name '*.ts' -o -name '*.tsx' \) -not -path '*/__tests__/*' \
  | xargs wc -l | sort -rn | head -10
```

### Step 3 — Mechanical checks

For each domain leader and every file > 100 LOC:

| Check | Threshold | Rule |
|---|---|---|
| File LOC | > 500 = "giant"; > 700 = "severe giant" | ⑤ |
| Largest inner function | > 100 LOC = suspect | ⑤ |
| Component density | > 5 `useState` + > 5 `useRef` + > 30 inner functions = god component | ⑤ + ⑦ |
| Render JSX size | > 300 lines inside the top `return (` of a component = giant render | ⑤ |
| Imports per file | > 20 distinct imports = wide surface (caller pays the cost) | ⑦ |
| Dead modules | File with 0 inbound imports (excluding entry points + barrels) | ⑥ |
| Barrels | Each subdirectory with ≥ 3 files: has `index.ts`? | ⑩ |
| Cross-domain edges | Map `import` between domains; flag layer violations (state → ui, etc.) | ⑦ |

Use grep + find + a small dependency walk. Don't write fragile AST parsers; rough numbers are enough.

### Step 4 — Heuristic check (rule ⑪) — agent self-eval

**This is the most important step. The skill exists for this.**

For every load-bearing file (= every domain leader + every file ≥ 150 LOC + every barrel), do this **without reading the body**:

1. Read at most the top 20 lines (imports + any header doc comment).
2. Try to write a one-sentence description in this form:
   > `<name> — <one-line role>. Reads: <≤6 key deps>`
3. Note honestly whether you struggled. Flag any of:
   - Had to enumerate multiple distinct responsibilities
   - Had to mention an "exception" or "footnote"
   - Had to **guess** because top-of-file didn't reveal purpose (rule ① broken)
   - Had to list > 6 imports (dependency sprawl, rule ⑦)
   - Wrote > 3 sentences before feeling complete
4. Each struggle → record it with the specific cue.

**Be honest. Do not flatter the codebase.** The user wants signal, not reassurance.

### Step 5 — Categorize + report

Group findings by rule number. Within each rule, sort by severity: error > warn > info. Each finding cites a file path (and line range where applicable).

## Output format

Output a markdown report **directly to chat** (no file artifact). Template:

```markdown
## Codebase audit — <ISO date>

Stack: TypeScript / React · <N> domains · <N> source files (~<N> LOC)

### ✓ What's working (deep-module wins)
- <domain or file> — <why it's a win, which rule it exemplifies>
- …

### ⚠ Drift / partial (worth fixing soon)
- **rule ⑤** — `path/to/file.tsx` is <LOC> LOC; top-level return alone is ~<N> lines.
- **rule ⑦** — `useGraph.ts` exposes 10 hooks with 3 different mutation shapes; consider unifying.
- …

### ❌ Violations (high signal — fix or justify)
- **rule ⑥** — `path/to/dead-module.tsx` is <LOC> LOC of dead code (0 inbound imports).
- **rule ⑦** — `ToastProvider` makes the state layer import a ui primitive (Toast) — layer violation.
- …

### Self-eval (rule ⑪) — where I struggled to describe a file in one sentence
- `<file>` — had to enumerate <N> distinct responsibilities.
- `<file>` — top-of-file revealed no purpose; I had to read the body to guess.
- …
(If nothing here: say "No struggle — every load-bearing file's purpose is clear from its top.")

### Suggested next actions
1. <Concrete action, named file, expected effort>
2. …

### Notes
- This audit is read-only. To act on findings: invoke `deep-module-refactor` (execute the moves), `deep-module-map` (regenerate the map with an embedded audit block), or `deep-module-headers` (fix files where rule ① / ⑪ failed).
- The audit covers shape, not bug correctness. Run tests for the latter.
```

## Discipline (do not skip)

- **Honesty over flattery.** If a finding is real, name it. If you can't tell, say "uncertain" rather than picking a side.
- **Cite evidence.** Every finding gets a file path. No abstract claims.
- **Distinguish fact from judgment.** Use ✓ / ⚠ / ❌ for graded items; "self-eval" header for rule ⑪ subjective struggle. Don't pretend judgment is fact.
- **Don't write or modify files.** This is pure read + report. Point the user at sibling skills for action.
- **Rule ⑨ applies to YOU running this audit.** If a finding is below 90% confidence, mark it `(uncertain)` rather than asserting it.

## Frequently misjudged

- A **300-line component** is not automatically a giant — if it's a leaf view rendering a complex form, that may be the right shape (rule ⑥).
- A **wide-surface store** (20-member object) is fine *if it's a store*; the wide surface lets gesture hooks take it as one prop and stay narrow (rule ⑦). Stores are a deliberate exception to rule ①.
- A **single-renderer facade** (one impl behind an `index.ts`) is still valuable — the door is the value, not the count of implementations (rule ⑩).
- An **old module imported once** is not dead. "Dead" = zero inbound imports (excluding tests + entry point).

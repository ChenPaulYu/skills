# Modes, checks, and the audit process

Full detail behind `audit`'s Stance summary — the check tables, the three-mode walkthrough, the 8-rule restatement, and the Step 1-5 process.

## Scope

**The 8 rules are language-agnostic.** This audit works on any codebase. It has a **universal core** of checks that applies everywhere, plus **stack-specific heuristics** that activate when a known stack is detected.

**Universal checks** (run on every codebase):
- File LOC distribution · function LOC · dead modules · cross-domain import edges · barrel/index presence · **root flatness** (a flat pile of loose modules at source root with unfoldered families) · imports-per-file · information leakage / temporal decomposition (same design decision in ≥2 modules; boundaries by execution order) · **value-leakage** (a repeated value/literal that has an owner elsewhere, or a cluster of near-identical values — scanned across code AND non-code layers: CSS/design-tokens, prompt strings, config) · rule ⑧ self-eval (describe each load-bearing file in one sentence — flag where you struggle)

**Stack-specific heuristics** (added when stack is detected):
- **TS/React** (detect: `package.json` mentions `react`): `useState`/`useRef` counts, JSX render span, component prop counts
- **Python** (detect: `pyproject.toml` / `setup.py` / `requirements.txt`): class-method counts, missing docstrings, circular imports
- **Go** (detect: `go.mod`): exported-symbol counts per file, init() usage, package cycles
- **Rust** (detect: `Cargo.toml`): trait/impl span, public API surface in `lib.rs`, `pub` visibility sprawl
- **Other stacks**: still run universal checks; mention in the report that stack-specific calibration wasn't applied

**Universal thresholds**:
- File: > 500 LOC = giant; > 700 = severe
- Function: > 100 LOC = suspect
- Imports per file: > 20 = wide caller surface

## Three modes — read first

Modes 1 and 2 differ by **scope + framing**; Mode 3 differs by **depth** (single-pass vs fan-out) and defaults to Mode 1's scope. See [ADR-043](docs/adr/043-audit-deep-mode-domain-fanout.md).

### Mode 1: Unconditional health audit (no input beyond cwd)

Triggered when the user asks "is this code healthy?", "audit my codebase", "any smells?" etc. **No target in mind** — broad health check.

→ Run all checks across all domains. Report by rule.

→ **Auto-suggest the deep upgrade.** After Step 1's stack + scope detection, if the codebase looks **large/legacy** — many domains, many source files, **no file-top headers, no barrels** (the organic shape of code not grown with nav) — a single pass will *satisfice* (sample a few domains and stop; see [ADR-043](docs/adr/043-audit-deep-mode-domain-fanout.md)). Finish the normal Mode 1 pass, then **offer Mode 3** at the end: "this looks large/legacy — a single pass likely missed domains; want a deep sweep (one sub-agent per domain)?" **Never auto-run it** — the fan-out costs N× a normal audit, so the spend is the user's call.

### Mode 2: Feasibility audit (input: a spec / plan / feature description) — read-only quick check

Triggered when the user gives a path to a spec / plan / feature description and asks "can my codebase carry this?". **Specific target in mind** — conditional health check.

→ Parse the target → identify the domains it touches → run the same checks but ONLY on those domains → frame findings as **gap analysis**: "to build feature X you need Y; current code has Z; here's the delta".

→ Output section "Gap analysis (vs `<spec path>`)" lists per affected domain: current shape · target needs · gap · suggested prep work (specific refactors to do before starting the build).

The mechanical + heuristic checks below are identical in both modes — only the SCOPE (which files) and the REPORT FRAMING (general health vs gap-vs-target) differ.

> **Want the full workflow?** Mode 2 stops at the gap-analysis report. If the user wants to also clarify the ambiguities the spec leaves open AND produce a durable plan artifact, redirect to `/nav:plan` — it inlines Mode 2's Stage 1 and then continues with dialog + plan-file output. (`/nav:plan` will reuse Mode 2's output if you just ran it in this session — see ADR-006.)

### Mode 3: Deep sweep (depth strategy — fan-out instead of single-pass)

Triggered explicitly ("deep audit", "徹底掃描", "full sweep", "find all the issues at once", "legacy sweep", "audit thoroughly"), or accepted from Mode 1's auto-suggest above. Defaults to Mode 1's whole-repo health scope.

**Why it exists.** Modes 1/2 run in **one context, one pass**. On a large/legacy codebase that context can't hold the whole repo, so the agent **satisfices** — scans a few domains, self-evals a few leaders, and stops. Coverage is silently partial and the output is a flat list, not the few root causes. Mode 3 fixes both: **fan out one read-only sub-agent per domain** (parallel — total time bounded by the largest domain, not by one context), then **synthesize + root-cause cluster + critic-loop until coverage is dry**. See [ADR-043](docs/adr/043-audit-deep-mode-domain-fanout.md).

→ Run the **deep process** (`references/deep-sweep.md`) instead of the single-pass Step 3-5. The checks themselves are identical — only the *execution* (fan-out vs single context) and the *synthesis* (prioritized root causes, not a flat per-rule list) differ.

> The fan-out strategy is scope-orthogonal: a large Mode-2 feasibility check can borrow the same per-domain fan-out, scoping sub-agents to the spec's affected domains and framing the synthesis as gap analysis. Mode 3 is documented health-first for the common case — don't fork a fourth mode for it.

## The 8 rules (the audit IS these rules)

1. **Deep modules through information hiding** — A simple interface hiding significant complexity; usable without reading the body. The technique is **information hiding** (Parnas): encapsulate each design decision — data structures, algorithms, formats, assumptions — inside one module so it never surfaces in the interface. Red flag — **information leakage** (the same knowledge baked into ≥2 modules, so one change touches them all), often caused by **temporal decomposition** (module boundaries following execution order — read/modify/write — instead of knowledge). Prefer general-purpose foundations over premature special-casing. **Recursive — composition is the second half:** modules compose behind a package façade into the next-scale deep module (module → package → codebase); a folder earns existence by hiding members or by being the declared contract — anything else is a drawer.
2. **Interface-first at every scale** — One door, surfaced progressively: a module's interface, a subsystem's barrel/facade (`index.ts`), the whole codebase's index/map. Drill in only as needed.
3. **Explicit dependencies** — Functions are deterministic; deps are explicit, not ambient.
4. **Right grain — neither giant nor fragmented** — No single mega-module or mega-function (a 700-line render counts), **and** no needless abstraction (don't modularise what needn't be). **The giant↔fragment tension is the balance you're auditing.**
5. **Fit the framework** — Idiomatic patterns (React: custom hooks; pass a store/hook object as one prop instead of 20 loose props).
6. **Rearrange, don't rewrite** — Refactor = verbatim move + rewire. Behaviour stays identical.
7. **Below 90% confidence → ask** — When unsure about scope/boundaries/intent, stop and clarify.
8. **Agent-navigability is the audit** — *This skill IS this rule in action.* When you (the agent) try to write a one-sentence description of each load-bearing file, the difficulty of that act is the deep-module test. Failure cues: must enumerate, must footnote, must guess, must list > 6 imports as "Reads:".

## Audit process

Work in order. Don't skip — each layer of evidence builds on the previous.

### Step 1 — Detect stack + bound scope

Detect what's there; don't bail:

```bash
ls package.json pyproject.toml requirements.txt go.mod Cargo.toml Package.swift 2>/dev/null
# package.json + react in deps → TS/React (add JSX/hook checks)
# pyproject.toml or setup.py → Python (add class/docstring checks)
# go.mod → Go (add package-cycle/init checks)
# Cargo.toml → Rust (add trait-impl/visibility checks)
# none of the above → run universal checks only; note in report
```

Source extensions to scan: `.ts .tsx .js .jsx .py .go .rs .swift .java .kt .rb` (extend per project).

Infer the source root (commonly `src/`, `app/`, `frontend/src/`, `lib/`, `pkg/`). Ignore `node_modules`, `dist`, `build`, `target`, `__pycache__`, `vendor`, `.venv`, generated files.

### Step 2 — Domain inventory

Observe the folder shape; don't impose one. Typically one top-level folder per domain.

For each domain capture: file count, total LOC, the "leader" file(s) (the largest / the most-imported / the one whose name matches the domain).

```bash
# adapt extensions to the detected stack
find <source-root>/<domain> -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.py' -o -name '*.go' -o -name '*.rs' \) -not -path '*/__tests__/*' \
  | xargs wc -l | sort -rn | head -10
```

### Step 3 — Mechanical checks

For each domain leader and every file > 100 LOC:

**Universal checks (every stack):**

| Check | Threshold | Rule |
|---|---|---|
| File LOC | > 500 = "giant"; > 700 = "severe giant" | ④ |
| Largest function | > 100 LOC = suspect | ④ |
| Imports per file | > 20 distinct imports = wide surface | ⑤ |
| Dead modules | File with 0 inbound imports (excluding entry points + barrels) | ④ |
| Barrels | Each subdirectory with ≥ 3 files: has an `index.<ext>` or equivalent re-export? | ② |
| Root flatness (flat-pile) | Package/source root holds > 8 loose modules AND obvious families exist among them (shared prefix `fx_*` or shared noun) with no domain folder — composition absent: files that should live in rooms sleep in the hallway. The inverse of the barrel check (that catches folders missing a door; this catches files missing a folder). ≥ 3 same-family files → a folder + barrel. | ① |
| Cross-domain edges | Map imports between top-level folders; flag layer violations | ⑤ |
| Information leakage | Same design decision (a file format, protocol, magic constant, schema) encoded in ≥2 modules with no single owner — a change forces edits in all of them | ① |
| Temporal decomposition | Modules/classes split by execution order (e.g. `read`/`modify`/`write` over a shared format) rather than by knowledge — a common cause of the leakage above | ① |
| Value-leakage (canary + proximity) | An **owned** value (a token / named const) with raw copies elsewhere → consolidate to the owner; a **cluster of near-identical values** (sub-JND, or no documented level-or-category reason) → collapse. Scan code AND non-code layers (CSS arbitrary values / `@theme` tokens, prompt strings, config). | ① |

> **Value-leakage — run it anchored, not naive.** Don't scan every literal (that flags `2` / `'px'` → noise that gets ignored). Two *anchored* screens: **canary** — inventory the *owners* (CSS-var / `@theme` tokens, exported color/const consts, config keys), then `grep` each owner's value for raw copies outside its definition → each copy is a leak (anchoring on what's already owned is the human-proof that this category *is* a decision). **proximity** — cluster near-identical values (e.g. ΔE for colors); a cluster with no single owner, or members within just-noticeable distance, is drift. **The machine screens physical duplication/proximity; *you* judge semantic legitimacy** — a value escapes consolidation only if it is *perceptibly* distinct AND maps to a real, documented level/category (a sub-JND "category" is drift, whatever the stated reason). This is the **aggregate backstop** for what `/nav:do` (per-change) and `/nav:plan` (foresight) structurally can't catch — see [ADR-032](docs/adr/032-value-leakage-layer-agnostic-three-tier.md).

**TS/React specific (only if React detected):**

| Check | Threshold | Rule |
|---|---|---|
| Component density | > 5 `useState` + > 5 `useRef` + > 30 inner functions = god component | ④ + ⑤ |
| Render JSX size | > 300 lines inside the top `return (` of a component = giant render | ④ |

**Python specific (only if Python detected):**

| Check | Threshold | Rule |
|---|---|---|
| Class methods | > 20 methods on one class = god class | ④ |
| Missing module docstrings | Load-bearing module without `"""..."""` at top | ① |

**Go / Rust / others**: apply your judgment using the universal checks + the language's idiomatic giants (e.g. Go: huge `init()` blocks, package-level cycles; Rust: trait impls > 500 LOC, `lib.rs` exporting everything flat).

Use grep + find + a small dependency walk. Don't write fragile AST parsers; rough numbers are enough.

### Step 4 — Heuristic check (rule ⑧) — agent self-eval

**This is the most important step. The skill exists for this.**

For every load-bearing file (= every domain leader + every file ≥ 150 LOC + every barrel), do this **without reading the body**:

1. Read at most the top 20 lines (imports + any header doc comment).
2. Try to write a one-sentence description in this form:
   > `<name> — <one-line role>. Reads: <≤6 key deps>`
3. Note honestly whether you struggled. Flag any of:
   - Had to enumerate multiple distinct responsibilities
   - Had to mention an "exception" or "footnote"
   - Had to **guess** because top-of-file didn't reveal purpose (rule ① broken)
   - Had to list > 6 imports (dependency sprawl, rule ⑤)
   - Wrote > 3 sentences before feeling complete
4. Each struggle → record it with the specific cue.

**Be honest. Do not flatter the codebase.** The user wants signal, not reassurance.

### Step 5 — Categorize + report

Group findings by rule number. Within each rule, sort by severity: error > warn > info. Each finding cites a file path (and line range where applicable).

## Frequently misjudged

- A **300-line component** is not automatically a giant — if it's a leaf view rendering a complex form, that may be the right shape (rule ④).
- A **wide-surface store** (20-member object) is fine *if it's a store*; the wide surface lets gesture hooks take it as one prop and stay narrow (rule ⑤). Stores are a deliberate exception to rule ①.
- A **single-renderer facade** (one impl behind an `index.ts`) is still valuable — the door is the value, not the count of implementations (rule ②).
- An **old module imported once** is not dead. "Dead" = zero inbound imports (excluding tests + entry point).

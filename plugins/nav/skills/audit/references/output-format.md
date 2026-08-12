# Output format

Output a markdown report **directly to chat** (no file artifact). Template:

```markdown
## Codebase audit — <ISO date>

Stack: <detected stack(s)> · <N> domains · <N> source files (~<N> LOC) · stack-specific checks: <applied | universal-only>

### Core root causes (mode 3 only — fix these first)
1. **<the broken abstraction>** — explains <N> downstream findings (`rule ①` leakage, `rule ⑤` layer violations…). Root fix: <one line>.
2. …
(A flat list buries the few decisions that generate most of the noise; this section surfaces them.)

### Coverage (mode 3 only)
Domains scanned: <N>/<N> · rounds: <N> (stopped: dry | round-cap) · bounded: <none | "domain X sampled, not fully scanned" | "domain Y skipped — reason">

### Gap analysis (mode 2 only — vs `<spec path>`)
- **Domain `<name>`** — current shape: <one line>; target needs: <one line>; gap: <what's missing>; suggested prep: <specific refactor(s)>
- …

### ✓ What's working (deep-module wins)
- <domain or file> — <why it's a win, which rule it exemplifies>
- …

### ⚠ Drift / partial (worth fixing soon)
- **rule ④** — `path/to/file.tsx` is <LOC> LOC; top-level return alone is ~<N> lines.
- **rule ⑤** — `useStore.ts` exposes 10 hooks with 3 different mutation shapes; consider unifying.
- …

### ❌ Violations (high signal — fix or justify)
- **rule ④** — `path/to/dead-module.tsx` is <LOC> LOC of dead code (0 inbound imports).
- **rule ⑤** — `ToastProvider` makes the state layer import a ui primitive (Toast) — layer violation.
- …

### Self-eval (rule ⑧) — where I struggled to describe a file in one sentence
- `<file>` — had to enumerate <N> distinct responsibilities.
- `<file>` — top-of-file revealed no purpose; I had to read the body to guess.
- …
(If nothing here: say "No struggle — every load-bearing file's purpose is clear from its top.")

### Suggested next actions
1. <Concrete action, named file, expected effort>
2. …

### Notes
- This audit is read-only. To act on findings: invoke `/nav:refactor` (execute the moves) or `/nav:sync` (fix file headers where rule ① / ⑧ failed; its map leg regenerates the codebase map with an embedded audit block, reading the freshly-synced headers).
- For Mode 2 specifically: if you want clarify-and-plan after the gap analysis (not just stop), invoke `/nav:plan` — it reuses this audit's output if it ran in the same session.
- The audit covers shape, not bug correctness. Run tests for the latter.
```

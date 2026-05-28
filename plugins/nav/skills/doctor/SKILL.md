---
name: doctor
description: Full codebase health pass — diagnose what's wrong, propose a categorized plan, then execute the low-risk fixes (file headers + map regeneration) with user-review gates between every step. Tees up structural refactors as separate sessions (does NOT auto-execute them; recommends /nav:refactor for those). Use whenever the user says "my codebase feels unhealthy", "audit and fix", "tune up this repo", "do a full sweep", "run the doctor on my code", "give my code a checkup", "do the works", or any "I sense something's off, give me the full pass" phrasing. Language-agnostic; orchestrates /nav:audit → review → /nav:headers → /nav:map.
---

# Deep-module doctor

Comprehensive health pass for any codebase: run the audit, propose a categorized plan, execute the safe fixes (headers + map regeneration), and tee up structural refactors for separate sessions. Convenience layer over `/nav:audit` + `/nav:headers` + `/nav:map` — same outputs, one trigger, user-review gates between steps.

## Why this skill exists

When you feel something's off but don't know exactly what, you don't want to remember to run 3 commands in the right order. `/nav:doctor` orchestrates them, gating each step on your approval. The skill does NOT duplicate the sibling skills' work — it sequences them with the right pauses.

**Key design choice**: doctor does NOT auto-refactor. Refactors are high-risk and need their own narrow scope (per `/nav:refactor`'s discipline). Doctor RECOMMENDS structural moves with concrete next-step proposals; you decide whether to start a `/nav:refactor` session for each.

## Scope

**Language-agnostic.** Doctor inherits the universal core + stack-specific heuristics from `/nav:audit`, the syntax flex from `/nav:headers`, and the generic HTML rendering of `/nav:map`. Works on any stack as long as you can run tests for the verify steps.

## The 11 rules (inherited from all sibling skills)

1. **Good interfaces** — low-level modules expose an interface you can use without reading the body.
2. **Progressive disclosure** — an index/doc surfaces the interface; you drill in only as needed.
3. **No hidden params** — functions deterministic; deps explicit, not ambient.
4. **Future-ready foundation** — the base supports planned features before they ship.
5. **No giants** — no single mega-module or mega-function.
6. **No needless abstraction** — if it needn't be modular, don't modularise it.
7. **Fit the framework** — idiomatic patterns; pass store/hook objects, not 20 loose props.
8. **Rearrange, don't rewrite** — refactor = move + rewire; behaviour stays identical.
9. **Below 90% confidence → ask.**
10. **Group + expose via one door** — subsystems exposed via a barrel/facade.
11. **Agent-navigability is the audit** — struggle-to-describe = deep-module failure signal.

## Orchestration process

The whole flow pauses at every gate. Doctor never barrels through.

### Step 1 — Establish baseline + scope

Confirm with user: which scope (whole repo / specific domain / changed files since last sweep)? Run the stack's test gate to verify green baseline (per `/nav:refactor` Step 1's command table for the detected stack). If gate is red, **stop** — fix baseline first, doctor can't measure health on a broken trunk.

### Step 2 — Audit (read-only)

Follow `/nav:audit`'s protocol fully:
- Detect stack + bound scope
- Domain inventory
- Mechanical checks (universal + stack-specific)
- Heuristic check (rule ⑪ self-eval — struggle log)
- Categorize + structured report

Output the audit report to chat exactly as `/nav:audit` would.

**Pause for user**: do you agree with the findings? Anything to push back on or de-prioritize?

### Step 3 — Propose a plan (4 buckets)

Categorize the findings:

| Bucket | What goes in | Action this session |
|---|---|---|
| **Light fixes** (this session) | files where rule ⑪ self-eval struggled; missing/stale headers | Run `/nav:headers` on these files |
| **Map refresh** (this session) | always — the audit produced new info that the map should reflect | Re-run `/nav:map` at the end |
| **Structural** (separate session) | giants, layer violations, dead modules, fake abstractions, suspect mega-functions | Recommend specific `/nav:refactor` moves; do NOT execute now |
| **Defer** (note + skip) | low-priority observations | List in the final report so they're not lost |

Show the bucketed plan to user.

**Pause for user**: approve the plan? Edit before continuing? Drop a bucket?

### Step 4 — Execute light fixes (headers)

Following `/nav:headers`'s protocol:
- Identify the load-bearing files from the audit's struggle list
- For each, compose the header (per the convention + language syntax)
- Show diff
- Wait for user OK (batch-OK is fine if user prefers)
- Apply

After all headers applied: re-run the stack's test gate. Headers are comments — should always stay green; if anything breaks it's a syntax error in a header, revert + fix.

### Step 5 — Regenerate map

Following `/nav:map`'s protocol (and its `references/visual-spec.md`):
- Re-scan the codebase (headers now exist where they didn't before — map can read them via `head -12`)
- Re-render the HTML
- Embed an updated **grounding-audit block** at the top recording:
  - ✓ what was VERIFIED this session
  - ⚠ what was FIXED this session (which headers were added/changed; what map sections changed)
  - ⚖ what's JUDGMENT (the struggle/recommendations the user accepted)
- Optional: re-take screenshots if dev server can run

### Step 6 — Final report

Summarize to chat:

```markdown
## Doctor's report — <ISO date>

### What was done this session
- Headers: <N> files added/updated (list them)
- Map: regenerated at docs/codebase-map/index.html
- Audit block updated

### Structural recommendations (run `/nav:refactor` separately)
1. <Specific refactor>: <which file>, <expected effort>, <expected payoff>
2. …

### Deferred (noted, skipped)
- <Low-priority finding> — reason for deferring

### Open questions for next session
- <Anything that needs user input before action>
```

Do NOT commit unless user explicitly asks. If on the default git branch, suggest branching first.

## Discipline (do not skip)

- **Pause at every gate.** Doctor doesn't barrel through. Each step ends with "do you want me to proceed?"
- **Don't auto-refactor.** Even if the audit found an obvious win, refactors get their own session via `/nav:refactor`. The doctor lays the groundwork (headers, map) so the next refactor session is set up to succeed.
- **Don't duplicate sibling skills' protocols.** When entering each step, defer to the sibling's discipline. If a step needs to change, change the sibling skill — not this orchestrator.
- **Stay honest about what was fixed vs deferred.** Final report is a clean ledger of this session — not a victory lap. The deferred and recommended items must show up explicitly.
- **Rule ⑨ applies.** Below 90% confidence on any plan item → ask the user before including/excluding it.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| "I'll just run the refactor too while I'm here" | Refactors need narrow scope (rule ⑥) + their own discipline. Hand off, don't absorb |
| "Skip the user-review gates to save time" | Doctor's value IS the gating. Without gates it becomes "agent does whatever it thinks best" — opaque |
| "Re-implement audit logic instead of calling the sibling's protocol" | Duplication — when audit changes, doctor goes stale. Defer to sibling protocols |
| "Auto-commit each step" | Per project's git discipline — don't commit unless explicitly asked |

## Companion skills

- `/nav:audit` — invoked as step 2 of doctor; can also be run standalone for read-only health check
- `/nav:headers` — invoked as step 4 of doctor; can also be run standalone
- `/nav:map` — invoked as step 5 of doctor; can also be run standalone
- `/nav:refactor` — **not invoked by doctor**; recommended by doctor's final report for structural moves; user runs separately

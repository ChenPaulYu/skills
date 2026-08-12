# Deep process (Mode 3 only)

Replaces the single-pass Steps 3-5 with a fan-out. Steps 1-2 (detect stack + domain inventory) run **first, in the main context** — you need the domain list before you can fan out. This is the [inject↔check](docs/adr/008-inject-check-at-handoff.md) bracket applied to a fleet of read-only domain auditors.

### D1 — Ground the fan-out (main context)

Run Step 1 (detect stack + scope) and Step 2 (domain inventory) yourself. You now have the domain list + each domain's file set + leaders. This is the grounding you **inject** — a fresh sub-agent can't re-derive the whole-repo domain map cheaply.

### D2 — Fan out one read-only sub-agent per domain (inject →)

Dispatch the domains **in parallel** (one message, multiple `Agent` calls; `subagent_type=Explore` — read-only is the point). Into **each** brief inject what the tactical sub-agent can't see:

- **Scope** — exactly which files this domain owns (from D1). "Audit only these; don't wander into siblings."
- **The 8 rules** (verbatim — the sub-agent doesn't have this SKILL loaded).
- **The checks** — the universal Step 3 table + any stack-specific rows that apply, and the Step 4 self-eval (rule ⑧) on this domain's leaders.
- **A fixed finding schema** so results merge cleanly: `{rule, severity (error|warn|info), file, line?, evidence, one-line claim}` + the rule ⑧ self-eval struggles.

Each sub-agent returns its domain's findings + self-eval. It does **not** write files (read-only audit). Reconnaissance sub-agents default to cheap tier (`model: sonnet`); a domain whose judgment call is unusually dense can be escalated on the spot (see root CLAUDE.md's Dispatch tiers).

### D3 — Merge + dedup (check ←, part 1)

Collect every domain's findings into one set. Dedup cross-domain duplicates (the same leaked value / format flagged from two sides is **one** finding with two sites, not two). Don't trust each sub-agent blindly — this merge + the critic below **are** the check arm of the bracket.

### D4 — Root-cause cluster (the "find the core problems" half)

A flat list of 80 findings is noise. Collapse them: which **few broken abstractions** generate the most surface findings? (e.g. "one leaked file-format owned by nobody → 11 of the leakage findings"; "one god-store → 6 of the layer-violation findings".) Surface these **core root causes first**, each with the count of downstream findings it explains. This is Mode 3's headline value over a Mode-1 list.

### D5 — Completeness critic + loop-until-dry (check ←, part 2)

Run one critic pass asking: **which domain wasn't covered · which leader wasn't self-evaled · which finding has no file cite · which cross-domain edge wasn't checked?** Whatever it surfaces becomes the next round's work — **re-dispatch sub-agents only on the under-covered slices**, merge into the set, re-cluster. Stop when a round adds nothing new (dry), or at a round cap.

**No silent caps (mandatory).** If you stop at a round cap, sample rather than fully scan a giant domain, or skip a domain for any reason — **say so in the report**. A deep sweep that silently truncates reads as "covered everything" when it didn't; that's the exact failure Mode 3 exists to kill.

### D6 — Report (deep template)

Emit the Output-format report (`references/output-format.md`), with the **root-cause cluster section first** (from D4), then the normal per-rule findings, then a **coverage line**: domains scanned / total, rounds run, anything bounded (per D5). Then offer the next action as usual.

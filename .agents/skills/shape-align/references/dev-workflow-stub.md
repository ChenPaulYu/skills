# dev-workflow priming stub — the always-loaded layer that makes shape/nav fire

A new project feels un-smooth not because the skills don't trigger, but because **nothing in its always-loaded context primes the agent to reach for them**. Mature projects accreted that priming; fresh ones are born without it. This stub is that priming, as a reusable block.

**Who writes it:** `setup` writes it at project birth (into the new `AGENTS.md`); `align` ensures it on first run when adopting an *existing* repo into the workflow. Both materialize from THIS file — one source, two entry points, so they can't drift.

**The priming layer is three parts** (a project missing any one feels un-smooth):
1. **Workflow-verb block** — maps intents → shape/nav verbs, so the agent volunteers them instead of waiting to be summoned.
2. **The `blueprints/` tree** — so artifact-relative triggers ("update the plan", "where are we") have something real to act on.
3. **A communication directive** — language + style. Skill SKILL.md files carry their own `Communication Style`, but that only loads *when a skill fires*; between skill invocations the agent drifts to its default. The project's always-loaded `AGENTS.md` is the only surface that holds the line every turn.

This file is the block for part 1 + 3 (part 2 is the tree itself, per `blueprints-spec.md`). Sentinel-delimited so it's idempotent and survives a later `/init` regeneration — re-running setup/align replaces only between the markers. Fill the pointers to where this project keeps its board/plans/map; **drop rows the archetype never uses** (a pure library may never run `shape-mockup`).

```markdown
<!-- shape:dev-workflow start -->
## Dev workflow

This project is driven by the **shape / nav** skill workflow. The planning board lives in `docs/blueprints/`.

| You want to… | Verb |
|---|---|
| Decide what to work on next / refresh the board | `shape-align` → `docs/blueprints/plan.md` |
| See the board rendered visually | `shape-mockup` → an on-demand board snapshot |
| Scope a feature against the actual code | `nav-plan` → `docs/blueprints/plans/` |
| Implement a small decided change | `nav-do` |
| Drive the in-progress board to done | `shape-build` |
| Behaviour-preserving structural move | `nav-refactor` |
| Re-sync file-top headers after restructuring | `nav-sync` |
| Regenerate / render the repo map | `nav-map` → `docs/codebase-map/index.html` |
| Audit architecture | `nav-audit` |

**Standing pointers:** plan board = `docs/blueprints/plan.md` (agent AND human — a visual view renders on demand via `shape-mockup`) · grounded plans = `docs/blueprints/plans/` · repo map = `docs/codebase-map/index.html`.

**Communication:** converse with the user in **<project language — default per stack-principles, e.g. Traditional Chinese (Taiwanese phrasing)>**, plain and direct; keep code, identifiers, and commit messages in English.
<!-- shape:dev-workflow end -->
```

**Canonical locations (establish these at birth so a project never half-adopts the workflow):** grounded plans live at `docs/blueprints/plans/` — *not* a separate `docs/plans/`. A project that puts nav-plan output one place and the board another is the "half-adopted" smell (nav side present, shape side absent); one tree avoids it.

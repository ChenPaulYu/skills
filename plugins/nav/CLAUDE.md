# nav — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.

## What this plugin is

A focused collection of skills for **keeping code navigable** — auditing, refactoring, documenting, and planning against the code so it stays navigable as it grows. Inspired by Ousterhout's *A Philosophy of Software Design*; calibrated against real refactors (e.g., decomposing a 1718-line component into a 16-file subsystem with a single barrel).

Six skills today: `audit` (assess) · `refactor` (transform without changing behavior) · `sync` (keep source headers and reader documents accurate against implementation) · `plan` (ground a feature intent) · `do` (execute a small decided behavior change) · `compose` (author or restructure prose). Sync has one entry and chooses the requested surface; it no longer generates a standing codebase map ([ADR-131](docs/adr/131-reconcile-and-one-sync.md)). History: headers/map first merged in ADR-019, split by cadence in ADR-029, rejoined in ADR-108; reader-document checks joined in ADR-125. Retired verbs: doctor (ADR-021), tour (ADR-111; its successor also retired in ADR-126).

**Language-agnostic by design.** The 8 rules transfer to any stack; specific checks have universal-core + per-stack heuristics.

This plugin lives inside the `skills` marketplace (`ChenPaulYu/skills`). The marketplace is the personal-collection container; this plugin is the navigability family. Future families (`spec`, `craft`, …) become sibling plugins under the same marketplace — they don't pile up inside this one. See [ADR-005](docs/adr/005-marketplace-plus-plugin-restructure.md).

## The 8 rules (the through-line of every skill)

Each skill carries the behavior-changing parts of these rules that it needs; detail may live in its bundled references. The framework is **deep modules** at every scale, with **Shape ①–⑤ · Discipline ⑥–⑦ · Test ⑧**.

1. **Deep modules through information hiding** — a simple interface hiding significant complexity; usable without reading the body. The *technique* is **information hiding** (Parnas): encapsulate each design decision — data structures, algorithms, formats, assumptions — inside one module so it never surfaces in the interface. Its inverse is the red flag **information leakage** (the same knowledge baked into ≥2 modules, so one change touches them all), often caused by **temporal decomposition** (module boundaries following execution order — read/modify/write — instead of knowledge). Maximize hidden complexity per unit of interface; prefer general-purpose foundations over premature special-casing. **The rule is recursive — composition is its second half:** modules don't stop at file scale; a group of modules composes behind a package façade into the next-scale deep module (module → package → codebase), each level offering a *simpler* door than the sum of its members. A folder therefore earns existence only by hiding members or by *being* the declared contract (said out loud in its façade header) — anything else is a drawer, and a flat namespace beside a maintained domain map means the map is doing the tree's job. (Grounded: docs/observations/2026-07-28-folders-encode-dependency-law-not-topics.md.)
2. **Interface-first at every scale** — expose through one door, surfaced progressively: a module's interface, a subsystem's barrel/facade (`index.ts`), the whole codebase's index/map. Drill into bodies only as needed.
3. **Explicit dependencies** — functions deterministic; deps explicit in the signature, not ambient/hidden.
4. **Right grain — neither giant nor fragmented** — no mega-module or mega-function; equally, no needless abstraction (don't modularise what needn't be). The giant↔fragment tension is the balance you manage.
5. **Fit the framework** — idiomatic patterns (React: custom hooks; pass a store/hook object as one prop, not 20 loose props); don't fight the ecosystem.
6. **Preserve behavior while restructuring** — keep observable behavior and public contracts stable; prefer verbatim moves when sufficient, and verify necessary internal rewrites against the same contract.
7. **Resolve consequential uncertainty** — inspect evidence first; ask when missing intent or authority would change scope, behavior, compatibility, or a material trade-off. Label unsupported claims rather than presenting guesses as facts.
8. **Agent-navigability is the audit** — when an agent explains a codebase, struggle-to-describe IS the deep-module test. Failure cues: must enumerate, must footnote, must guess, must list > 6 imports.

These rules **also apply to this plugin's own files**. Length invites inspection of cohesion and navigation; splitting needs a useful boundary, not a threshold.

## Conventions for skills inside this plugin

> Repo-wide **authoring + maintenance** rules — naming, skills-root-relative paths, stack-neutral examples, frontmatter `description`, cross-reference form, read-only/write-gated, ADR-on-new-skill, the site-map gate, and versioning — live **once** in the repo-root [`CLAUDE.md`](CLAUDE.md) (don't re-copy them here — that's the rule ① leakage we just removed). The conventions below are nav's own **design patterns**; several are marketplace-wide and are referenced by sibling plugins, so nav is their single owner.

- **Scope**: skills are **language-agnostic** with a universal core + per-stack heuristics (see [ADR-004](docs/adr/004-language-agnostic-scope.md)). Don't bail on unknown stacks — degrade gracefully to universal checks + flag what was skipped.
- **Skills don't invoke each other**. The meta-skill (`plan`) describes a sequence for the agent to follow — it references sibling protocols rather than re-implementing them. Atomic skills stay standalone-callable (see [ADR-003](docs/adr/003-five-skills-not-four-or-six.md)).
- **Reuse-via-transcript pattern**: when a skill inlines another skill's protocol, Stage 1 should include a "scan recent turns; if `<other-skill>` already ran against the same input, reuse its output" preamble. Deterministic + zero coupling. Current users: `sync` (fresh audit/source evidence for its requested surface), `plan` (audit). See [ADR-006](docs/adr/006-nav-plan-skill.md).
- **Scope-based continuation (ADR-126)**: `plan` and `refactor` continue implementation already authorized by the user; a plan-only request stops at the plan. Ask only about an unresolved consequential choice or new authority. No fixed next-action menu or mandatory sub-agent default. Other skills' offers remain conditional on their own task boundaries.
- **Inject↔check at the sub-agent hand-off**: provide a bounded executor with scope, existing seams, contracts, and completion checks. The session model reads the actual diff and reproduces relevant verification before accepting completion. Load detailed dispatch instructions only when dispatching; judgment stays with the session (ADR-123/126).
- **N+1 trigger** (corollary of rules ④ + ②): first consumer of an inline util = inline is fine; **second consumer = extract a primitive** (don't copy-paste, don't shove a mode-flag into a facade). This is the operational trip-wire that turns "no needless abstraction" from a judgment call into a rule. Fires in the `refactor`/`plan` hand-offs above and in any integration check. **Value- and layer-agnostic**: "inline util" generalizes to any repeated *value* (a color, a constant, a config key, a prompt fragment) in any *layer* (code, CSS/design-tokens, prompts, config) — 2nd raw copy = give it an owner. But per-change is structurally blind to leakage that only shows in *aggregate* (each copy is locally fine); that emergent case is caught by `audit`'s value-leakage check (canary + perceptual-proximity clustering), not here — see [ADR-032](docs/adr/032-value-leakage-layer-agnostic-three-tier.md).
- **The verb is the only door for its deliverable (ADR-038)**: if you're about to hand-produce something a verb encodes — a decided behaviour-changing change (`/nav:do`), a structural move (`/nav:refactor`), a comparison mockup (`/shape:mockup`) — fire the verb instead of hand-rolling the artifact. The protocol around the artifact (scope-aware continuation · check bracket · reviewable diffs) *is* the deliverable; ambient fluency in the craft is the risk signal, not a waiver. Doesn't make verbs auto-fire — governs the case where you're already producing the deliverable. See [`docs/adr/038-verb-is-the-only-door-for-its-deliverable.md`](docs/adr/038-verb-is-the-only-door-for-its-deliverable.md).
- **Cost tier (ADR-059)**: nav has no frontmatter-tiered verb today. `sync` authors explanations and verifies their meaning against code; that judgment remains on the session model. Bounded extraction may use the repo's dispatch policy. The former map-render dispatch leg retired in ADR-131.
- **Live-LLM-cost signal (ADR-062/126)**: enabling or expanding a live paid path changes verification cost. Separate deterministic checks from live evidence, name the additional scope/cost, and obtain any missing authority. Reuse approval for the same run scope; do not silently substitute a mock and claim live verification.

## Where things live

```
.claude-plugin/plugin.json   → nav's manifest (the version + metadata owner)
CLAUDE.md                    → ← you are here (nav-specific: identity · 8 rules · design patterns)
skills/<name>/SKILL.md       → individual skills, each self-contained
skills/<name>/references/    → bulky reference docs loaded on demand
```

Repo-wide layout (`marketplace.json`, `scripts/`, `docs/`) lives in the repo-root [`CLAUDE.md`](CLAUDE.md).

## When editing this plugin

Repo-wide editing rules — new-skill → ADR, the ★ authoring checks, renaming + versioning, the site-map gate, stale-`SKILL.md` — live in the repo-root [`CLAUDE.md`](CLAUDE.md). nav-specific:

- **Changing the 8 rules**: update every affected skill and bundled rule restatement in the same change, and record the decision in an ADR.
- **The 8 rules apply to nav's own files too**: inspect long files for hidden decisions and useful boundaries; length alone never requires a split.

## Process artifact retention

nav-plan and nav-compose bundle the shared development-artifact policy owned by Shape. A plan location
is a convention, not an instruction to commit process notes; explicit project retention
policy governs. See ADR-134.

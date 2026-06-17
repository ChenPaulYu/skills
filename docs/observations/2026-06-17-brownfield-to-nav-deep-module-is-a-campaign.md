---
date: 2026-06-17
status: raw
---

# Converting a brownfield project to nav deep-module is a campaign, and nav has the atoms but no conductor

> Source: a full session converting a real Python package (a YouTube toolkit: 2998-line god class, 55 layer violations, untyped Dict returns) into a nav-maintained deep-module package, with a hard "public API must not break for existing consumers" constraint.

## What prompted it

The user asked to turn a whole repo — one that had never heard of deep modules — into a nav-maintained package, *without* breaking the top-level API other projects import. The work ran cleanly end to end (7 commits, 203→224 tests green throughout), which made the shape of the workflow visible: it was not one skill, it was a **chain of nav skills run as a multi-phase campaign**, with the main loop hand-playing the conductor.

## The signal

**The brownfield→deep-module conversion decomposes into a fixed chain — `/nav:audit` → `/nav:plan` → N× behaviour-preserving `/nav:refactor` (one sub-agent per phase, serial, test-gated, [[008]] inject→check) → `/nav:sync` → `/nav:map` — but nav has no verb that *is* that chain.** shape has [`/shape:build`](docs/adr/011-shape-build-and-browser-verify-slot.md) as the meta-skill that conducts plan/refactor/verify; **nav has the atoms (audit/plan/refactor/sync/map) and no `/shape:build`-equivalent conductor.** In this session the main loop filled that gap manually — deciding phase ordering, why phases were serial (they all mutate the shared `api.py`, cf. the conflict reasoning in [ADR-040](docs/adr/040-parallel-build-scheduling-policy.md)), dispatching a sub-agent per phase with inject-check, and gating each on the test suite.

Three reusable **techniques** surfaced inside the chain that the current atoms don't spell out:

1. **Contract-freeze discipline ("保門面、整身體").** Before touching anything, circle the *public contract* (exported symbols + public method signatures) and treat a `signature-diff vs the previous commit` as a per-phase gate — internals restructure freely, the contract bytes don't move. `/nav:refactor`'s "verbatim move" says behaviour is preserved; it does **not** say *how to hold an external API contract still while gutting everything behind it*. That's the move that makes brownfield-with-consumers safe.

2. **Concrete decomposition recipes that make the move zero-judgment (hence sub-agent-delegable).** God-class → service layer: each service takes a `_toolkit` back-ref, the method body moves *verbatim*, every `self.` becomes `self._toolkit.`, and the original method becomes a one-line delegation. Giant-function → helpers: extract cohesive blocks as `_private` helpers, pass locals in / return what's needed out. `/nav:refactor` is generic "move verbatim"; these are the *named transforms* that made a 2998-line decomposition mechanical and verifiable.

3. **A plan's "single-source-of-truth owner" must come with an adoption step, or it ships dead.** `/nav:plan` let the plan *name* `core/fallback.py` as the owner of the fallback decision, and `/nav:refactor`'s verbatim move dutifully carried the hand-rolled `try/except` into the services **without adopting the new primitive** — so the primitive sat with zero import sites. Nothing in plan/refactor caught it; the whole-repo grounding pass in `/nav:map` did. **Naming an owner ≠ wiring callers to it; a verbatim-move phase will preserve the old pattern unless a later phase explicitly adopts the new one.**

## New skill, or integrate?

**Integrate the techniques now; let the conductor graduate on evidence** (per [ADR-018](docs/adr/018-promotion-gate-is-evidence-not-session-count.md)).

- Techniques 1+2 → enrich **`/nav:refactor`** (it is the verbatim-move recipe library; it lacks the layered-facade / god-class recipe and the contract-freeze verification step). The planning half of contract-freeze → enrich **`/nav:plan`** ([ADR-006](docs/adr/006-nav-plan-skill.md)): a brownfield plan should circle the contract first and set signature-diff as the gate.
- Technique 3 → a small fix to **`/nav:plan`** (the owner table should imply an adoption phase) and/or **`/nav:refactor`** (a verbatim-move that supersedes a hand-rolled pattern must either adopt the new primitive or flag it). See also the value-leakage backstop logic in [ADR-032](docs/adr/032-value-leakage-layer-agnostic-three-tier.md) — same family: a thing that *should* have one owner silently keeps N copies.
- The **conductor** (a `/shape:build`-equivalent for nav, provisionally `/nav:modernize`: audit→plan→phased-refactor→sync→map as one gated campaign) is a real gap, but scaffolding a meta-skill on one case is the structure-theatre the system warns against (rule ④). Capture it; don't build it yet.

## Trip-wire to revisit (graduation condition)

**The next brownfield→deep-module conversion.** If a second legacy codebase walks the same chain with the same discipline and the manual conducting feels like re-deriving the same orchestration, that's the second data point — write the ADR that adds a nav campaign conductor (`/nav:modernize`), modelled on [`/shape:build`](docs/adr/011-shape-build-and-browser-verify-slot.md) (orchestrates siblings, never re-implements them) + [ADR-008](docs/adr/008-inject-check-at-handoff.md) per-phase dispatch. Until then it stays a hand-run chain.

## Evidence so far

- **Only case (2026-06-17, brownfield YouTube-toolkit conversion)**: audit found 5 severe giants + 55 sub-API→handler layer violations; plan wrote a 6-phase artifact; phases ran as serial sub-agents (god-class→9 services, sub_apis rerouted, captions split, giants slimmed, parallel/async added), each gated at green; sync+map closed it out. Contract held (99 public signatures byte-identical, verified by diff every phase). The dead-primitive (technique 3) was caught only by `/nav:map`'s grounding pass, not by plan or refactor. Related: [[caller-aware-deprecation-for-layered-api]] (the API-retirement technique from the same session's coda).

(One case → stays `raw`. Graduation = a second brownfield conversion repeating the chain; that promotes the conductor from observation to ADR + skill.)

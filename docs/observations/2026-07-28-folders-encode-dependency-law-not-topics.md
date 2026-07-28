---
date: 2026-07-28
status: raw
---

# Folders encode dependency law, not topics — deep modules exist at package scale too

> Grounding for nav's rule ② ("interface-first at **every** scale") and rule ④ (right grain), from
> a real tactus campaign: 67 flat modules → ten packages, executed same-day by four sonnet
> subagents, every phase gated at an identical test count. The learning is not "add folders" — it
> is a **decision procedure for when a folder is a module and when it is only a drawer**, plus
> three traps measured on the way. Today the 8 rules are applied almost entirely at function and
> file scale; this is the missing package-scale half.

## The case

tactus had a maintained, import-verified 9-domain codebase map — and 48 `.py` files flat in one
namespace. The map was doing the package structure's job. Paul's complaint: "deep module 原則不只
包含 interface 本身，連 interface 也是要一組一組，整組再組合成更大的 interface." First-principles
pass landed the principle; two of Paul's spot-challenges (`transform`, `operation`) then knocked
out placements that had been inherited from the map's topical grouping — both corrections were
forced by the measured import graph, not by taste. That failure mode is the core finding.

## The principle (one line)

**The map classifies for readers; folders exist to make illegal dependency directions look ugly in
the import path. A folder earns existence one of two ways: it hides members, or it is the ratified
contract — anything else is a drawer.**

## The decision procedure that survived contact

1. **Ground the real import graph first** — fan-in per module, and per candidate group: how many
   members are imported from outside the group vs only within it. This is cheap (one script) and
   it is the *only* defensible basis. The topical taxonomy (a codebase map, a docs diagram) is
   explicitly NOT a valid source — it groups by association, and association contradicts
   dependency altitude exactly where it matters most (see traps below).
2. **A folder is admitted if members are group-private** — tactus's `cli/` measured 19 members /
   0 external importers (perfect); `hosting/vst3/` measured 4/4 private. A group measuring N/N
   public (every member imported from outside) is admitted only under the second clause:
3. **The contract exception, said out loud** — a types/wire layer is wide *by design* (tactus's
   kernel: 7 members, all public, fan-in 37/30 on its two leaders). Wrapping it is still right —
   but its `__init__` header must state "wide is deliberate, not leakage," or the next auditor
   reads it as a failed module.
4. **Deeper levels use the same admission test, zero exceptions** — third level allowed only when
   *all* members are group-private. A near-miss (5-of-6 private) was ruled a flat group rather
   than a subfolder-with-a-documented-exception: a tree with zero exceptions beats one flat 8-file
   group. ("藏了5/6" is not "藏了".)
5. **Facade style follows evidence, not one template** — the campaign produced three legitimately
   different `__init__` shapes: explicit re-exports (callers import bare symbols), empty-with-
   docstring (all callers reach members by submodule name — an unused alias is a second, dead
   surface), and PEP 562 lazy (heavy-dep names). Prescribing one style would have been wrong three
   different ways.
6. **Top level mirrors whatever ratified layer diagram exists** — tactus's canon draws
   `State ↓ {Operation, Render} ↓ schema`; the tree now literally shows `history/ → ops/ →
   kernel/`, so the #1 invariant (`Operation ⊥ State`) is visible as path shape and a violation
   reads wrong before any audit runs.

## Three traps, all hit and measured

- **Topic-grouping contradicts dependency altitude at the load-bearing spots.** The map placed
  `transform` with the version machine (association: "transform semantics feel state-ish") — but
  `schema` *imports* it, which pins it to kernel altitude with zero discretion. It placed
  `operation` in the same cell as `history` — but operation had 17 importers to history's 6, and
  the canon's whole point is that they are different layers. **A conceptual domain map will
  conflate layers precisely where the architecture's central invariant lives**, because that
  invariant is what makes the two things feel like one topic.
- **Name collision when `x.py` moves into package `x/`.** After the facade re-exports a symbol
  named like the submodule (`render/__init__` re-exporting `render()`), attribute lookup shadows
  the submodule: `import tactus.render.render as m` binds the *function*. Tests needing the raw
  module must use `importlib.import_module("tactus.render.render")` (resolves via `sys.modules`,
  bypasses the shadow). Same shape recurred with `history/history.py` — there the facade
  re-export was the fix since no caller needed private attrs.
- **A lazy `__getattr__` that does `from . import sub` recurses.** CPython's import machinery
  probes `hasattr(pkg, "sub")` before importing a submodule, re-entering the very hook that is
  trying to import it. `importlib.import_module(".sub", __name__)` is the correct body. (Found by
  a subagent's own proof run, not by review.)

## Execution facts worth reusing

- **Sequential dispatch, dependency-quiet groups first, high-fan-in last** (data/cli → fx/hosting
  → assets/render/authoring → kernel/ops/history → front door). Parallel agents were rejected
  because every phase rewrites imports across the same files.
- **The per-submove full gate caught what grep missed** — several function-local lazy imports
  surfaced only as test failures. Gate-after-each-step is not ceremony at package scale; it is the
  only detector for lazy-import call sites.
- **No compat shims** — a shim at the old path is a second source of truth. All ~350 import
  rewires landed in the same commits as the moves.
- The predicted "monkeypatch tax" of deeper paths measured tiny (~18 references) — depth should be
  limited by the admission test, not by that cost.

## Where this should land

- **`nav:audit`** — add a package-scale check: flat-namespace-with-maintained-domain-map is a
  named smell ("the map is doing the tree's job"), and the group-privacy measurement (step 1–2)
  is mechanical enough for audit's inventory pass.
- **`nav:refactor`** — the three traps belong in its recipes (name-collision handling, lazy
  `__getattr__` body, facade-style-by-evidence); the sequential/high-fan-in-last ordering belongs
  in its planning guidance.
- **`nav:map`** — one-line caution: the map's domains are a *reading* taxonomy; deriving folder
  structure from them inverts the dependency (this campaign derived the tree from the import
  graph and then found two map cells wrong).
- Possibly the 8 rules' wording itself: rule ② already says "every scale," but nothing operative
  exists above file scale — this observation is that missing rung.

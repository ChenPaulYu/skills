# ADR-114 — fathom splits into four verbs; `repo` renamed; the learner model gets a file

> 2026-08-13 · Status: accepted · fathom 0.3.0 → 0.4.0 · marketplace 25 → 28 skills

## Context

`fathom` shipped as a single door, `/fathom:repo`, carrying an entire five-level comprehension
ladder plus its opening scan. Two live studies later, three problems surfaced at once:

1. **The flow is not fixed.** Real sessions ran scan → teach → follow-up → teach → check, in
   whatever order the learner's curiosity took. A single door implies a sequence the work does not
   have.
2. **Distinct moments were trapped inside one verb.** Wanting a repository index and a
   trustworthiness read *without any teaching* is a real, separate intent. So is "quiz me on what
   I learned days ago". So is "let me keep digging at one topic without advancing".
3. **`repo` is a noun.** The marketplace's own naming rule is bare verbs (`audit`, `mockup`,
   `elicit`) — the plugin namespace supplies the topic. `repo` was off-convention from birth.

The one-door choice originally cited ADR-108 (a split-out `nav:map` drew zero direct fires in 11
months). That precedent does not transfer: `map` died because `sync`'s trigger phrasing subsumed
it, not because splitting is inherently wrong — `nav` and `shape` are modular and are used
modularly. The test that matters is whether each candidate door owns a trigger its siblings cannot
steal.

## Decision

**Four verbs, each with an unstealable trigger:**

| Verb | Trigger it owns | Writes |
| --- | --- | --- |
| `/fathom:index` | "index this repo" · "is this codebase trustworthy?" — no teaching wanted | `index.md` |
| `/fathom:guide` | "walk me through this repo" · "where did we leave off?" — the main door | cursor · `understanding.md` · artifacts |
| `/fathom:quiz` | "test me" · "how much do I still remember?" — may fire days after any teaching | `understanding.md` |
| `/fathom:dive` | "I want to keep digging at X" — pursue one topic, do not advance the ladder | `index.md` · `understanding.md` |

**Files, not call order, are the connective tissue** — which is what makes the order free:

```text
index.md   how deep the repository is   ← index writes · guide/dive read+write
understanding.md    where the learner's model is ← guide/quiz/dive write · quiz reads
progress.md      the cursor                   ← guide writes · all read to locate themselves
```

Any verb runs standalone because the state lives on disk. `guide` covers the run-it-all case via
the marketplace's existing **reuse-via-transcript** pattern (as `nav:sync` reuses `nav:audit`):
if `index.md` is absent or stale it performs the indexing inline rather than demanding the
user call `index` first.

**Boundaries between the near-neighbours**, so the split does not blur:

- **dwell** (inside `guide`) is bound to the level just taught and precedes its gate;
  **`dive`** is unbounded, may cross levels, and advances nothing.
- **gate** (inside `guide`) is a level's exit; **`quiz`** is spaced retention checking against
  `understanding.md`, independent of progression.

**Naming**: `repo` → `guide` (a bare verb; the pilot who boards precisely because the captain does
not know these waters). `climb` was considered and rejected — it fights the plugin's downward
depth metaphor.

## The learner model — `understanding.md`

New, and the reason `quiz` can exist as a door: a per-study record of *what the learner currently
understands*, distinct from the cursor's record of *where the work stopped*. Four buckets —
**Confirmed** (quoted in the learner's own words, dated), **Corrected** (both versions kept;
highest regression risk, re-probe first), **Open** (the learner's own flagged uncertainty — the
most valuable column), **Never tested** (taught or shown but never probed). Confirmed entries
carry a shelf life: age makes them re-probe candidates.

It is a **convention, not a contract** (ADR-071): whichever verb touches it tolerates an absent or
non-standard file, consumes what is readable, and writes back in the shape it found. `guide` owns
the canonical template; siblings do not restate it.

## Consequences

- Marketplace 25 → 28 skills; fathom 0.3.0 → 0.4.0.
- `/fathom:repo` disappears. It had shipped only within this session's development window, so no
  deprecation shim is warranted.
- Registration surfaces updated in the same commit (README rows + per-plugin list, site map
  DOMAINS/CB node, Codex sidecar descriptions) per the repo's gate #3.
- Risk accepted: four doors where one stood may leave some drawing few fires. The ADR-109
  retirement rhythm applies — a door with zero fires across three months is demoted to
  summon-only before anyone argues about deletion. `quiz` and `dive` are the two to watch.

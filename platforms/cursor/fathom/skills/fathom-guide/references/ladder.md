# The five-level ladder

Each level answers one question, ends at one gate, and hides everything below it. Levels locate
the learner — they are a coordinate, not five mandatory artifacts.

## The image to teach (the names are for you; this is for them)

The level names are the agent's coordinate system — stable, unambiguous, and printed in every
cursor and record. The learner needs an image instead, and one carries the whole ladder:

| Level | What the learner is looking at |
| --- | --- |
| Repository | the whole tree from a distance — what kind is it, what does it bear |
| Runtime | which tree, when there is a grove |
| System | **the trunk** — the channel one run travels *and* the structure holding everything up |
| Behavior | **the branches** — where it forks, and how the forks differ in kind |
| Code | the grain of the wood — what it is actually made of |

The trunk/branch pair does real work: it is the reason **System always precedes Behavior**
(branches attach to a trunk; there is nowhere to hang them otherwise), and the reason System
carries *two* things rather than one — a trunk is a conduit and a load-bearing structure at the
same time, which is exactly the lifecycle and the ownership map. Learners reliably mistake
System and Behavior for siblings of the same kind, because both names are abstract nouns of the
same shape; the image forecloses that reading. Introduce it when it earns its place — usually at
the entry to System — not as a recital at the start.

**Gate style (ratified 2026-08-13): verbalization first.** A gate asks the learner to narrate
their own model in their own words; the agent diagnoses gaps from the narration and repairs only
those. The structured phrasings listed per level below are **diagnostic probes** — reach for one
only when the narration is too vague to locate the gap, never as the opening question. A
fill-in-the-blank template makes the learner complete YOUR sentence; a verbalization exposes THEIR
model.

## Opening a level — the orientation script (per-level loop, step 1)

Never open a level with material. Open by reading `understanding.md` back to the learner in four
beats:

- **What you hold now** — quote their own confirmed statements; name what was recently repaired
  and may slip; name the uncertainty *they* flagged; name what has been shown but never tested.
  Close it with one sentence characterising the *shape* of their current model ("you have a
  parts list but no timeline").
- **What's missing that this level supplies** — tie it to the gaps just listed, especially to
  their own open question. A level the learner didn't know they needed is a level they will
  experience as arbitrary.
- **Why this object** — if the level teaches one path, one runtime, one behavior out of several,
  say why *that* one and what is deferred.
- **What you'll be able to do afterwards** — concrete capabilities in their world (debug this
  class of failure · predict this outcome without testing · decide whether you need to build X),
  never "pass the gate". The gate is your instrument, not their reason.

**The names of levels are your coordinates, not their context.** "You passed Repository, now
we're at System" orients the agent and tells the learner nothing. This step is the reason
`understanding.md` exists — its first job is orientation, and only its second is quiz fodder.
An artifact carries orientation implicitly through its title, chapters and lead paragraph;
terminal-first teaching has no such scaffold, so the step must be walked out loud.

**End the orientation by offering the choice, not announcing the route.** Having laid out the
gaps, ask which one they want to close — the ladder's default order is a recommendation, and
naming it as such ("the trunk comes next by default, but your open question is over here")
respects that curiosity is the better teacher. Take their answer; if it skips a level the next
one depends on, say what will be missing and let them decide anyway.

## Collapse rules (decide upfront, say it aloud)

Run this judgment during the first visit, before teaching, and tell the learner the resulting
ladder shape:

- **Single meaningful runtime** → collapse the Runtime level entirely; the coordinate becomes
  `Repository → System → Behavior → Code`.
- **Small library with a narrow promise** (one public surface, no long-lived state) → merge System
  and Behavior into one level: the canonical round trip *is* the behavior inventory.
- **The learner's own codebase** (maps, headers, ADRs exist) → fast-pass Repository/Runtime by
  consuming those assets; start teaching at the first level the learner cannot already
  reconstruct.
- Never collapse Behavior into Code: entering implementation without a behavior inventory is
  file-led reading in disguise.

## 1. Repository

**Question**: what does this package let a caller do, what enters and leaves it, and which
execution families does it contain?

Broad but shallow: cover the load-bearing primitive families, give each a plain-language job (not
a full definition), and show how they connect — neighborhoods, not exports. No implementation, no
edge cases.

**Gate (verbalization)**: without reopening the artifact, the learner says in their own words what
this repository is, and how they would introduce it to another engineer *relative to the anchor
the calibration probe surfaced*. Diagnostic probe if the narration is too vague to locate the gap:
the one-sentence promise frame ("An application gives ___; it coordinates ___, ___, ___; it
returns ___").

## 2. Runtime

**Question**: which execution model is under study, and what shared core does it reuse?

Only exists when runtime families genuinely have different lifecycles (e.g. text loop vs realtime
session vs sandboxed execution). Name the families and their relationships — which wraps which,
which replaces whose lifecycle — without unfolding any of them.

**Gate (selection + contrast)**: the learner picks the runtime to study and names one way its
lifecycle differs from an adjacent family.

## 3. System

**Question**: how does one canonical run of the selected runtime move through time, and who owns
what?

Follow one canonical run: fixed stages vs branches, continuation rails for loops. Cover only the
load-bearing model — lifecycle and stopping conditions, state and data ownership (owner,
visibility, lifetime), component responsibility boundaries, result surfaces, local-vs-remote
execution ownership. Verify arrows against source, but explain without source syntax.

**Gate (reconstruction + assignment)**: the learner reconstructs the lifecycle and stopping
conditions in their own words, assigns important state to its owner, and distinguishes the major
outcome classes. This gate is the door to Behavior — do not open it on fluency alone.

## 4. Behavior

**Question**: which observable paths can occur inside this system, and which one should be
understood first?

Inventory broadly before going deep. Separate **load-bearing** behaviors (change the main mental
model) from **boundary** behaviors (add a failure, limit, recovery, or rare branch). Group related
paths by the kind of complexity they introduce; each group should add one new kind.

Progress by group, as a spiral:

```text
shallow inventory of all behaviors
    -> full behavior-level understanding of one group
    -> trace the group's control behavior in code   (level 5)
    -> compare the group's variants against that baseline
    -> correct the system model
    -> next group
```

Choose a **control path** first — the plainest run that reveals the shared skeleton before any
special machinery. For each behavior, narrate mechanism-level: trigger, execution owner, state
changes, data movement, branches, side effects, stopping condition — in plain language, no source
syntax yet.

Stop adding boundary behaviors when new cases only append exceptions — falling marginal return is
the signal to change resolution, not to chase catalog completeness.

**Gate (prediction)**: given a concrete unseen scenario, the learner predicts whether it
continues, completes, interrupts, or fails the run — and names the behavior group that owns it.

## 5. Code

**Question**: what implementation evidence determines one selected behavior?

Entered only through a Behavior seam, one behavior at a time. Full procedure:
[`code-guiding.md`](code-guiding.md).

**Gate (transfer)**: the learner predicts where a small behavior change would land — modules, data
flow, risks — and which tests should react, *before* searching broadly.

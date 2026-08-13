# Visual forms — what this level renders, and how

**The form grammar itself lives in `/frame:draw`** — which kind of knowledge asks for which
shape (ownership → spatial map · process → playback · state over time → stepper · delta from known
→ claim expansion · taxonomy → grouped map · structure → weighted graph · lifecycle → canonical-run
diagram), plus the rendering discipline (verify before delivering, say "reload", labels in the
learner's language, the paid lessons about empty interaction). Follow that protocol; do not restate
it here. The seam in one line: **draw decides how an already-clarified relationship becomes
visible; the ladder decides which relationship needs clarifying now.**

What belongs to teaching a ladder, and therefore lives here:

## The four tours — progressive disclosure happens *between* artifacts

The most common failure is forcing every artifact into the same step-by-step interaction. Depth is
disclosed by **moving to the next kind of tour**, not by burying more inside the current one:

| Tour | Its job | Interaction it earns |
| --- | --- | --- |
| **Map** | the whole system and its major ownership boundaries, in one frame | none — it must land in about thirty seconds |
| **Path** | one concrete task followed from input to output | reveal one event or relationship at a time |
| **Branch** | the important ways that path can diverge, contrasted | select a branch and compare |
| **Code** | the model connected to files, symbols and implementation | navigate source evidence on demand |

A staged animation is a Path tour. Putting one at Map depth delays the high-level picture instead
of clarifying it — the learner cannot see the whole before being walked through a part.

**A Map tour is broad and shallow, not narrow and shallow.** The first correction this rule ever
needed: removing detail by removing most of the system's concepts leaves the learner able to infer
only "X on top of Y", with none of the design vocabulary. Cover most load-bearing families, give
each a plain-language job rather than a definition, group concrete classes into neighborhoods, and
show how they connect so the map becomes an index for the later tours.

## Level defaults

- **Repository** — an **interactive guided mockup** is the default. A high-level picture is
  precisely where interaction earns its cost, and it is the one place HTML wins by default.
- **Runtime · System · Behavior** — **terminal-first**. Escalate only on the standing threshold:
  interaction changes visible state, or the learner asks. A worked example: an ownership *table*
  can state that a buffer holds ten items; only a stepper can let the learner watch the eleventh
  push the first one out — that is a real escalation, not a prettier one.
- **Code** — form not yet settled (see `code-guiding.md`).

## Pedagogical overlays the grammar doesn't carry

- **The micro-example thread.** One tiny task threads the artifact — small enough to be boring,
  rich enough to need two distinct actions. It **starts in the chapter that first exercises it**,
  with one line of why-this-example; mentioning it earlier is noise, not foreshadowing. Under a
  two-variant system, replay the *same* example per variant so the difference demonstrates itself.
- **The gloss layer.** Dotted click-terms with plain-language popovers. The list comes from the
  calibration probe — skip what the learner already owns — plus the net the probe always misses:
  architecture-description words. Those are not glossed but *rewritten* (name things by use; see
  the core).
- **Never fold a contradiction.** The general rule is in `/frame:draw`; the teaching-specific
  form of it: anything overturning a belief the learner *stated in the calibration probe or a gate*
  must be legible without clicking. A correction they must choose to discover was never delivered.
- **Depth goes to the next tour, not behind a click.** Folding is for *detail* — a gloss, an
  example, a caveat. A formal definition or source-level evidence does not belong in the current
  artifact at all, folded or otherwise: it belongs to a later tour. Hiding it here keeps the
  artifact's promise ("this is the whole picture") while quietly making it false, and the learner
  who opens every fold ends up reading the implementation documentation the tour was supposed to
  spare them.
- **Consistency across a study.** Later artifacts reuse the earlier ones' canvas, palette,
  typography and diagram grammar — consistency is part of navigation, and a study that looks like
  one thing is easier to hold than five that don't.
- **Disposability.** Artifacts are disposable; prune the losing variant of a form comparison at
  level close, never silently.

## Terminal dialects (the mid-ladder default)

Simple lifecycle → ASCII flow · timed interaction → sequence diagram · object lifetime → state
diagram · transformation chain → data-flow diagram.

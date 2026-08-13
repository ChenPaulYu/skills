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

## The study artifact shell — fixed across studies

*Graduated 2026-08-13: the shell recurred verbatim across two studies (same class vocabulary),
then silently died in a third because it lived only in the artifacts — the convention now lives
here so every study's pages read the same way.*

**The shell is the report format, not the diagnosis.** It carries no claim about the repository —
the form inside each chapter still follows the knowledge — but it is **fixed across studies**, so
a learner opening any new study's page already knows how to read it. Two layers:

**The chapter shell.** A left sidebar of numbered chapters (bold title + one-line subtitle), one
chapter visible at a time, prev/next buttons at each chapter's foot, and a pin-note under the nav
(commit + "anchors trace to index.md"). On narrow screens the sidebar becomes a horizontal strip.
A long scroll of `h2` sections is NOT the shell — staging is the point: one chapter, one claim,
one place to be.

**The chapter spine** — six by default; a chapter may be **swapped when the repository's knowledge
demands it** (say so in the artifact's head comment), never silently dropped:

1. **What it's for** — the promise as a business card (install line · import · one real call),
   who-owns-what boundary if it earns a drawing, and **the trust panel**: verdict headline,
   counted-signals grid, "so read it like this" list. Trust always rides in chapter 1 — it
   changes how every later chapter is read.
2. **Watch one run** — the canonical run played step by step; a variant toggle replays the *same*
   micro-example (the difference demonstrates itself). Close by naming what was folded.
3. **Against what you hold** — the learner's **recorded** claims (calibration probe, gates, prior
   studies' understanding.md) as expandable rows with verdicts. **Never invent a quote.** If no
   learner model exists yet, contrast against the probe's contrast anchor instead; if there is
   truly nothing recorded, this is the one chapter that may compress to a paragraph.
4. **What it provides** — the capability taxonomy: root promise, family branches, leaf jobs.
   Leaves carry a job description, not a definition — names hang as an index for later levels.
5. **How it's organized** — default form: a **weighted dependency graph** (nodes in fixed bands,
   every edge verified against imports at the pin, the canonical path from chapter 2 drawn
   thick), per-module verdicts (core / support / peripheral) and anchors on node select, plus a
   suggested next-node walk. A graph asserts *connection*; a layered map asserts only *position*
   and has already drifted in once — choose something other than the graph only when the shape
   demands it, and say so. Drawing the edges also audits the map: it forces out glue modules
   that a block layout hides.
6. **The next seams** — where the study can zoom next, as choice cards. The closing offer is a
   chapter, not a footnote.

**The three-beat block.** Anything that expands — a claim row, a mechanism, a module — unfolds in
one fixed rhythm: **actual mechanism** (ending in a `file:line` anchor chip — the chip is part of
the beat, not decoration) → **why it's designed this way** → **what it means for you**. Three
beats, always in that order; a learner who has expanded one block knows the rhythm of every block
in every study.

**Continuity mechanics.** Reuse the established class vocabulary when building
(`chapter · stage-nav · story-panel · takeaway · warn-chip · term`/`gloss-pop · anchor · beat ·
claim · cap-branch/leaf · seam · trust/sig`) — copy the shell's CSS/JS from the previous study's
artifact rather than re-inventing it. Canvas, palette, typography and the gloss mechanism are
shared across **all** studies; the accent hue may vary per study.

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

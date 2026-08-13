# Choosing a form — the vocabulary, and what each one earns

The selection rule is in the skill body: **ask what question the audience will put to the picture.**
This file is the vocabulary that answer resolves to, and the conditions under which each form is
worth its cost.

**Why the question, and not the subject matter.** A drawing can only assert a handful of things:
order, condition, lifetime, position, connection, membership, difference, choice, quantity. Every
form below is one of those relationships made visible, which is why the audience's question picks
the form directly — the question *names the relationship*. Classifying by subject instead ("this is
an architecture, so draw an architecture diagram") is how a picture ends up correct and useless.
Provenance for this cut is at the foot of the file.

## The forms

### Flow chart — "what happens next?"

**Earns it when there are branches.** A straight sequence with no forks is a numbered list; drawing
it as boxes-and-arrows adds ceremony and no information.

Grammar: one box per step, diamonds where the path forks, and **loop-backs drawn explicitly** —
loops are exactly what prose loses. Label the arrows leaving a fork with their condition, not with
"yes/no", unless the condition is genuinely boolean.

### Sequence diagram — "who talks to whom, and when?"

**Earns it over a flow chart when the actor changes between steps.** If everything happens inside
one component, a flow chart is cheaper.

Grammar: actors as columns, time running down, one arrow per message. Past roughly seven messages
it becomes a wall — split it, or collapse a run of internal calls into one arrow labelled by intent.

### State diagram — "what state is it in, and what moves it?"

**Earns it when the same input does different things depending on the current mode.** If behaviour
doesn't depend on history, there are no states worth drawing.

Grammar: states as nodes, triggers on the edges. Always mark the initial state and every terminal
one; an unmarked terminal state is how readers miss that something can end.

### Map — "where does each thing live? who owns what?"

**Earns it whenever ownership or boundaries are the question.** Its payoff compounds: **positions
must stay permanent** across every later drawing, so a deeper view is recognisably the same
territory zoomed in. Moving a box between drawings discards everything the audience had memorised.

**Containment** is the map's nesting variant — boxes inside boxes, for "what is inside what". Reach
for it when the boundary itself is the lesson (a process boundary, a package, a deployment unit).
Past three levels of nesting it stops being readable: split into a second drawing that zooms one
box, keeping the outer positions identical.

### Node-edge graph — "what uses what?"

**Earns it when the dependency shape itself is the lesson** — a hub, a cycle, a layer violation.

Grammar: arrows for direction of use, and **weight the one canonical path** (thicker edges) or the
picture is an inventory rather than a tour. Every node should offer a *next node worth visiting*;
a graph with no suggested walk is a wall of names.

### Grouped map — "what kinds are there?"

**Earns it for a two-level taxonomy: families and members.** Draw the *grouping*, not a literal
tree — a root floating beside a tall column leaks dead space, and free-wrapping members produce
orphan full-width cards. A slim header plus a strict N-column grid reads faster than any branching
drawing at this depth.

### Matrix — "which should I pick?" / "how do these compare?"

**The most under-used form.** N things along one axis, M dimensions along the other. People reach
for diagrams when what the audience actually needs is a table they can scan down one column.

Use it whenever the audience must *choose* or *compare*, and put the deciding dimension first.

A **decision tree** beats the matrix only when the criteria are genuinely *ordered* — when the
first question makes the later ones irrelevant. If every option must be weighed on every dimension,
the tree hides exactly what the audience needs to see, and the matrix wins.

### Stepper over time — "what accumulates? what expires?"

**Earns it when lifetime is the lesson.** A table can *state* that a buffer holds ten items; only a
stepper lets the audience *watch* the eleventh push the first one out. If nothing expires,
accumulates, or overflows, a table is enough.

### Side-by-side diff — "how is this different from what I already know?"

**Earns it when the audience arrives with a model.** Their own words go on the left — quoted, not
paraphrased — and reality on the right. Mark the row that has *no counterpart*: that row is the
whole point, and it is the one they will remember.

### Small multiples — "how does this differ across the series?"

**The diff's plural.** A side-by-side diff is for *two* things and asserts a delta; small multiples
is for *many* and asserts a pattern across them. Same drawing, same scale, repeated — the eye does
the comparison for free, which no amount of prose can match.

Grammar: identical axes and identical scale in every panel, or the comparison is a lie. Order the
panels by something meaningful (time, size, the dimension being varied), never alphabetically.

### Quantity — "how much? what trend?"

The one form family with a century of measurement behind it: **position along a common scale is read
most accurately, then length; angle, area, volume, shading and colour saturation are read worst, in
roughly that order.** The single practical consequence — **encode the thing that matters as position
or length, and never as area.** A pie chart and a bubble chart both ask the eye to compare areas,
which it cannot do.

Beyond that, chart choice is a solved and well-documented craft (deviation · correlation · ranking ·
distribution · change over time · magnitude · part-to-whole · spatial · flow). It is largely
disjoint from everything else in this file — see the provenance note below.

### Playback of one real run — "just show me it happening"

**Earns it when the audience has no model at all.** One concrete run, stepped, with the actors
lighting up as they act, builds a first model faster than any abstraction can.

**Grammar for a lifecycle or control-flow playback** — the payoff comes from separating what stays
fixed from what changes, and each of these four was paid for by a drawing that lacked it:

- **A fixed spine**: the stages *every* run crosses, drawn once and never moved. Without it the
  audience cannot tell "this run's path" from "the system's shape".
- **One selected outcome lit at a time.** Drawing every branch at once turns the playback back into
  a static diagram.
- **A dedicated return rail** for outcomes that loop. Continuation is the single thing prose loses
  most often, and an arrow that merely points backwards into the spine reads as a mistake.
- **A terminal state that replaces the rail** when the run finishes or pauses. If ending and looping
  look alike, the audience cannot tell that the thing can stop.

Responsive behaviour follows from the spine: **rearrange the stages, never shrink the whole
drawing** — a legible diagram at one third the size is not the same diagram.

### Annotated real output — the cheapest form, routinely skipped

A log, a JSON response, a stack trace, a directory listing — **already legible, needing only arrows
and margin notes**. Reach for this before drawing anything: if the real artifact can be pointed at,
pointing at it beats redrawing it, and it carries the credibility that a redrawing loses.

## When not to draw at all

| Situation | Give them |
| --- | --- |
| Independent items with no relationships | a list — a diagram asserts relationships, and drawing one where none exist teaches a falsehood |
| A single fact | a sentence |
| A straight sequence, no branches | a numbered list |
| Something they must act on | a table with a decision column |
| A quantity or trend | a chart — and only then |

## Where the medium is decided

Which medium carries the form — terminal ASCII, a markdown table, mermaid in a document, an
annotated real output, or an interactive artifact — is the second decision, and it lives in
`media.md`. Choosing a form without choosing a medium is how a good picture ends up in the wrong
place.

## Provenance — where this cut sits, and what it deliberately doesn't inherit

Two established traditions cover most of this ground, and **they do not talk to each other**:

- **Chart choice** (FT's nine categories, Abela's four, the Data Viz Catalogue) classifies
  *quantity*. Underneath it sits the perceptual measurement — Bertin's visual variables, Cleveland
  & McGill's accuracy ranking — which is where the position-over-area rule above comes from. None
  of these taxonomies contains a flow chart, a state diagram, or a node-edge graph.
- **Engineering notation** (UML's structure/behaviour split, C4's four zoom levels, BPMN,
  ArchiMate) classifies *what is being modelled*, never what the reader wants from it. It is rich
  in structure and process forms and has no notion of quantity at all.

This file sits on a **third axis: what the reader is trying to do** — the axis that InfoVis theory
uses (Shneiderman's task taxonomy, Munzner's action-plus-target task abstraction) and that neither
tradition above provides. That choice is deliberate: this skill exists to make something land for
someone else, so the reader's question is the only thing that can pick the form.

Three consequences worth holding onto:

- **Two forms here have no name in either tradition** — the **side-by-side diff** and the
  **misconception table**. Both parent traditions assume a reader arriving with no prior model.
  Explanation always has one to overturn, which is why these carry more weight than their obscurity
  suggests.
- **"Flow" means three unrelated things.** Movement volume in chart choice (Sankey), literal
  control flow in UML/BPMN, and a narrative genre in the storytelling literature. Say which you
  mean.
- **A container is not a form.** Slide shows, comic strips, magazine layouts and annotated-chart
  articles are established *narrative genres* — but each is a sequence of forms, not a form. Where
  they belong is `media.md` § Composition.

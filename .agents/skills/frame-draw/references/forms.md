# Choosing a form — the vocabulary, and what each one earns

The selection rule is in the skill body: **ask what question the audience will put to the picture.**
This file is the vocabulary that answer resolves to, and the conditions under which each form is
worth its cost.

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

### Stepper over time — "what accumulates? what expires?"

**Earns it when lifetime is the lesson.** A table can *state* that a buffer holds ten items; only a
stepper lets the audience *watch* the eleventh push the first one out. If nothing expires,
accumulates, or overflows, a table is enough.

### Side-by-side diff — "how is this different from what I already know?"

**Earns it when the audience arrives with a model.** Their own words go on the left — quoted, not
paraphrased — and reality on the right. Mark the row that has *no counterpart*: that row is the
whole point, and it is the one they will remember.

### Playback of one real run — "just show me it happening"

**Earns it when the audience has no model at all.** One concrete run, stepped, with the actors
lighting up as they act, builds a first model faster than any abstraction can.

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

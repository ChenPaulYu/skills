# ADR-115 — `frame:visualize` owns the form grammar; fathom borrows it

> 2026-08-13 · Status: accepted · frame 0.9.0 → 0.10.0 · fathom 0.7.0 → 0.8.0 · 25 → 26 skills

## Context

Two repository studies produced a table mapping **kind of knowledge → visual form**: ownership
wants a spatial map, temporal process wants a playback, state-over-time wants a stepper, delta from
what the audience knows wants a claim expansion, taxonomy wants a grouped map, structure wants a
weighted graph, lifecycle wants a canonical-run diagram. Each row was paid for by a form that
failed first — a flat card grid that read as "a directory in clothes", a tree whose root floated
beside a tall column leaking dead space, a graph without edge weights that was an inventory rather
than a tour, an ownership table that could state a lifetime but could not show one expiring.

That table sat in `fathom/skills/guide/references/forms.md`, reachable only while teaching an
unfamiliar repository. Nothing in it is repository-specific. Explaining an architecture to a
colleague, a mechanism in a document, or a design to a stakeholder wants exactly the same grammar.
A general instrument was locked inside a specific skill — rule ① leakage at the plugin scale.

## Decision

**A new verb, `/frame:visualize`**, owns the grammar and the rendering discipline.

It lands in `frame` rather than `shape` because frame already has the wing it belongs to. Frame's
three reasoning lenses face *inward* (structure a problem for your own understanding);
`analogize` faces *outward* (make something already settled land for the audience). That outward
wing had exactly one member and one medium. `visualize` is its sibling: same direction, same
premise — the thing is understood, only its legibility is in question — different medium, a
picture instead of a comparison.

**Boundary against `/shape:mockup`**, the nearest neighbour: mockup renders **disposable
candidates so a decision can be picked**; its trigger is "which of these". Here the artifact **is**
the explanation and nothing is being chosen. Neither trigger steals the other.

**fathom borrows by protocol**, as it already borrows `/nav:audit`'s sweep. `forms.md` keeps only
what belongs to teaching a ladder: per-level defaults (Repository defaults to an interactive
mockup; mid-ladder is terminal-first), and the pedagogical overlays the general grammar does not
carry — the micro-example thread, the gloss layer, the rule that a contradiction of something the
learner *said* may never be folded behind an interaction, cross-artifact consistency within a
study, and disposability.

## Consequences

- 25 → 26 skills; frame 0.9.0 → 0.10.0; fathom 0.7.0 → 0.8.0 (its forms reference rewritten).
- The escalation threshold is now stated once, generally: terminal-first, escalate when
  **interaction changes visible state** or the audience asks. "It would look nicer" is not a
  threshold, and the two paid lessons about empty interaction move with it.
- Risk accepted: frame grows from four verbs to five, and the ADR-109 retirement rhythm applies —
  a door drawing zero fires across three months is demoted to summon-only before deletion is
  argued. `visualize` is a watch candidate alongside fathom's `quiz` and `dive`.

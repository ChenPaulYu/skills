---
date: 2026-07-15
status: raw
---

# Chronology does not restore alignment after a long development arc — re-entry needs evidence-backed causal bridges between stages

> Source: A long MIDI-to-external-instrument architecture thread where the user explicitly reported feeling left behind.

## What prompted it

A development thread moved through MIDI rendering, an overloaded Clip model, note abstraction, Content × Voice identity, host probes, preset-state failures, audio verification, and external plugin identity. A chronological outline named the stages accurately, but the user still could not follow why one stage led to the next. The outline became useful only after every transition answered: what remained broken in the previous stage, what concrete evidence exposed it, and why that pressure made the next decision necessary.

Concrete examples mattered as much as the prose. An old mega-Clip field layout, a stable-ID insertion failure, real host-state values, and playable audio made abstract claims inspectable instead of merely plausible. The user then recognized this as a periodic human-alignment move distinct from a codebase tour.

## The signal

Existing recap and orientation moves answer adjacent questions but do not own this one: a catchup says where the cursor is now; a codebase tour explains the current system; a chronological summary says what happened. None reconstructs **why the work had to turn when it did**.

The missing move is a causal retrace. Each stage must expose:

1. the prior working belief or implementation;
2. the concrete friction or contradiction;
3. the evidence or probe that made it real;
4. the decision taken and alternatives rejected;
5. the implementation and validation status; and
6. the unresolved tension that forces the next stage.

That sixth field is the bridge, not editorial polish. Without it, a timeline remains a list of rooms; with it, the reader can follow the corridor between them. For a long or artifact-rich arc, first present the causal outline for correction, then render a plain-language interactive artifact backed by real examples, media, probes, and links.

## Evidence so far

- **Only case (2026-07-15, MIDI-to-external-instrument arc)**: the user rejected a stage-accurate outline as insufficiently connected, then accepted the retraced structure once each transition named the pressure from the previous stage and concrete examples made the claims inspectable. The user explicitly chose `retrace` as the verb and requested that the move become a skill.

(One case → stays `raw`. Promote when a second long, multi-decision workstream needs the same causal re-entry move and the six-field bridge reconstructs understanding that catchup, a codebase tour, or an ordinary recap does not. Candidate home: a new `reflect-retrace` skill; its ADR must pass the No-Op test that retired `reflect-summarize`.)

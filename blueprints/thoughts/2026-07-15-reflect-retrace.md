# reflect:retrace — causal re-entry for a long development arc

> **Point:** A person who feels left behind after a long development thread does not need a longer timeline. They need the path reconstructed as pressure-bearing transitions: what was true, what broke, what evidence exposed it, what was chosen, how far it landed, and what unresolved pressure forced the next turn.
>
> **Status:** Ratified by Paul on 2026-07-15 → [ADR-084](docs/adr/084-reflect-retrace-causal-development-alignment.md) · originating observation: [`2026-07-15-chronology-does-not-restore-alignment-without-causal-bridges`](docs/observations/2026-07-15-chronology-does-not-restore-alignment-without-causal-bridges.md).

## The gap is causal re-entry, not recap

The motivating work moved through a sequence of major stages in a DAW-like audio project: a core rendering pipeline, an overloaded core data entity split into cleaner types, a note-level abstraction, an identity model split across two dimensions, host integration, failed state restoration, parameter-trust issues, audio verification, and external plugin identity. The first outline accurately named those stages. It still failed to restore understanding because the reader could not see why the end of one stage made the next stage necessary.

The fix was not more chronology. It was a bridge after every stage:

> The renderer now worked, **but** note authoring still required hand-calculated JSON; therefore the next problem became editability rather than playback.

That bridge changed a list of rooms into a route through the building. It also exposed where the history was unsupported: if no source recorded why a turn happened, the explanation had to say Inferred or Unknown instead of smoothing the gap into a plausible story.

## The adjacent doors answer different questions

| Door | Question it owns | Why it cannot absorb retrace |
|---|---|---|
| `reflect:catchup` | Where does the work stand now? | Its five-field cursor deliberately compresses history into present state and next action. |
| Plain recap | What happened, in order? | Chronology is exactly the insufficient output observed here; ADR-079 retired `reflect:summarize` for adding no machinery beyond it. |
| `nav:tour` | What does the current codebase do, and what system model should we share? | Its object is the present system. Retrace's object is the development path and the pressures that changed it. |
| `reflect:observe` | Which durable learning is worth keeping? | It selects one reusable mechanism, not the complete causal path that produced the current design. |
| Planned `reflect:retro` | Where did the process go in circles, and what should change? | Retro evaluates the process. Retrace explains the path neutrally, including decisions that were neither mistakes nor improvements. |

Merging retrace into tour would recreate the same overloaded-entity mistake at the skill layer: one door would carry both a spatial model of the current system and a temporal model of how work evolved. They may share visual language and provenance discipline, but they do not share an object or completion criterion.

## The causal stage is the irreducible unit

Every stage has six required fields:

1. **Prior state** — the working belief, design, or implementation entering the stage.
2. **Pressure** — the concrete friction, contradiction, or missing capability.
3. **Evidence** — the probe, user report, code shape, test result, audio/image, metric, or commit that made the pressure inspectable.
4. **Decision** — the chosen response and any meaningful alternative rejected.
5. **Status** — what was merely discussed, decided, implemented, verified, committed, or deferred.
6. **Next pressure** — what remained unresolved and therefore forced the next stage.

The sixth field is load-bearing. A stage with no supported next pressure may be a valid endpoint, two unrelated threads accidentally placed next to each other, or a missing historical source. The renderer must never disguise that ambiguity with a decorative arrow.

## Concrete evidence is part of the explanation

Abstract claims became understandable only when the artifact made them touchable:

- the old overloaded core data entity was shown as its actual shared, audio-only, and MIDI-only fields;
- stable identity was demonstrated by inserting a note before an index and watching the index hit the wrong event while the stable ID still found the intended one;
- host-state restoration showed the expected and restored parameter values rather than saying only “restore failed”;
- playable audio let the reader hear per-clip resets, continuous rendering, placeholder voices, and the later instrument result;
- probe matrices made repeatability and separation thresholds inspectable instead of asking the reader to trust a verdict.

The reusable rule is not “always add a chart.” It is: **each abstract stage should expose at least one concrete, inspectable witness when the evidence exists.** Choose the medium that matches the claim — before/after data, a command and result, a diff, a metric, an interactive state switch, audio, or an image. If no witness exists, label the gap.

## The workflow needs two passes

### Pass 1 — reconstruct and expose the outline

Gather durable evidence first, then enrich it from the live conversation. Build the six-field stages and label rationale as:

- **Recorded** — an ADR, thought, plan, commit body, finding, or explicit user statement records the reason;
- **Inferred** — the reason is a bounded interpretation of code/diff/test sequence, not a recorded decision;
- **Unknown** — the available sources cannot support a causal claim.

Present the outline before writing the artifact. The user edits stage boundaries, missing decisions, and causal bridges. This is not a cosmetic approval gate: the user often owns intent that git cannot contain, while durable state owns what actually shipped.

### Pass 2 — render the corrected path

Produce one dated interactive HTML artifact. Its reading order is causal rather than file- or date-driven:

- a one-screen current-position summary;
- a stage navigator;
- each six-field stage with an explicit bridge to the next;
- concrete witnesses embedded beside the claims they support;
- status and provenance labels that do not conflate decided with shipped;
- a final “where we are now” boundary, including unresolved work without turning it into a roadmap decision.

The artifact follows the user's language and the project's established visual family. Interactions must teach something: reveal before/after, switch competing states, inspect evidence, or play media. Decorative interactivity does not count. Browser verification covers the key interactions, responsive layout, console, links, and media before the URL is handed over.

## Naming journey

`trajectory` was accurate but sounded analytical and could imply a future forecast. `journey` was warm but named a thing rather than the action. `timeline` over-weighted chronology; `story` risked rewarding narrative smoothness over evidence; `decision-trail` excluded probes, implementation, and UX discoveries.

`retrace` won because it names the action: follow the existing footprints to reconstruct how the work arrived here. The process may investigate backward from current state, while the artifact explains forward in causal order. The natural invocation is also clear: “retrace how we got from the first MIDI integration to external plugin identity.”

## Cadence and lifecycle

Retrace is summoned, never automatic. It is useful when a person says they feel left behind, asks “how did we get here?”, returns after a long architectural arc, or wants a periodic human-alignment report before the next major stage.

The output is a dated snapshot, not a silently maintained second source of truth. It carries the generation date, scope, git SHA when available, and evidence basis. A later retrace may supersede it; it does not rewrite the earlier artifact into a false account of what was knowable at that time.

## The No-Op and retirement tests

Retrace earns a separate door only while its machinery changes the result relative to a plain recap:

- six-field causal stages instead of chronological bullets;
- provenance labels instead of invented rationale;
- an outline correction gate before rendering;
- concrete evidence witnesses beside abstract claims;
- a browser-verified interactive artifact with an explicit current boundary.

If real use collapses to “write me a nicer session summary,” or users skip the outline correction and concrete evidence without losing understanding, retrace should be retired or folded into a plain request. ADR-079 is the standing warning: a fixed format alone does not earn a skill.


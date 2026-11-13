# unfold — grounding a repository, library, or system

Read when the subject is code. Inspect only the boundary the learner authorized, and read
enough orientation material to avoid guessing.

## Before explaining

- Repository instructions (`AGENTS.md`, `CONTRIBUTING.md`, local guides), the README, and
  package or build manifests.
- The current revision and working-tree state; record the revision when a claim depends on it.
- The entrypoints and the files that own the learner's question.

Preserve uncommitted user changes. Prefer the repository's own source and its official
documentation for claims about current behavior.

## Choosing layers

The skeleton names a path shaped to the subject, for example
`purpose → core representation → one execution path → composition boundaries → trade-offs`.
This menu is a source of layers, not a checklist; use only those that fit the subject and goal.

1. **Purpose and boundary** — why it exists, for whom, what simpler approach it replaces.
2. **Core representation or invariant** — the central thing and the rule that must stay true.
3. **Input-to-output slice** — follow one real request, datum, event, or frame through it.
4. **State, time, data flow** — who owns state and how it changes.
5. **Composition boundaries** — how modules or services combine; the source of truth at each.
6. **Runtime and execution model** — how the source is interpreted, scheduled, served, or built.
7. **Extension seams** — where a new feature or integration enters.
8. **Trade-offs and failure modes** — what the design makes easy, what hard, where it breaks.

Adapt the path to the kind of subject:

- **Library or framework:** core abstraction, lifecycle, runtime boundary, extension points, escape hatches.
- **UI system:** component tree, state and event flow, rendering surface, controlled versus derived state.
- **Application:** user intent, request path, domain model, persistence, operational boundary.
- **Infrastructure or distributed system:** topology, protocols, resource ownership, failure recovery.
- **Data or ML pipeline:** input representation, transformations, intermediate artifacts, serving boundary.

## Evidence

Prefer one verified slice over a broad unsupported summary. Label each important claim:

- **verified** — directly supported by source or configuration you inspected;
- **reported** — stated by documentation or a project note, not yet checked in code;
- **inferred** — your reading of design intent from several observations;
- **open** — not inspected, ambiguous, or contradicted.

When code and documentation disagree, say so and name the exact boundary. A claim about why
the authors chose a design is recorded only if a commit, issue, or doc says so; otherwise it is inferred.

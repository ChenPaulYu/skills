---
name: retrace
description: "Reconstruct why a long development arc moved from one stage to the next, then render the user-corrected causal path as a concrete interactive artifact. Summoned only; distinct from present-state catchup, a current-codebase tour, an ordinary recap, and an evaluative process retro."
disable-model-invocation: true
---

# retrace — follow the evidence-backed path back into the work

Restore a person's understanding of **how the work arrived here**. A chronological recap lists rooms; retrace reconstructs the corridor between them. Each transition must show what remained broken, what evidence exposed it, what was decided, how far it landed, and why that result forced the next turn.

Optional focus from the user: **$ARGUMENTS** (a feature, architectural arc, date range, or workstream; otherwise infer the smallest coherent arc from the request and confirm it in the outline).

**Summoned, not automatic.** A long session is not permission to generate a report. Run only when the user explicitly asks for retrace or equivalent causal re-entry.

**One controlled write.** The skill reads project evidence, presents a causal outline for correction, and only then writes a dated interactive artifact. It never edits code, plans, decisions, canon, or the evidence it cites. Do not commit unless the user asks.

## Why this skill exists

A competent default response can already summarize a session in chronological order; that is why `reflect-summarize` was retired ([ADR-079](docs/adr/079-retire-reflect-summarize.md)). Retrace earns a separate door only through machinery a plain recap skips:

- six-field causal stages instead of chronological bullets;
- Recorded / Inferred / Unknown rationale instead of polished invented history;
- a user correction gate before rendering;
- inspectable concrete witnesses beside abstract claims;
- a dated, browser-verified interactive artifact with an explicit current boundary.

Drop those mechanisms and this becomes the retired skill under a nicer name.

## Step 1 — Bound the arc and gather evidence

Name the arc in one sentence: its starting state, current boundary, and why the user needs to re-enter it. Prefer one coherent workstream over “the entire repository history.” If the request could mean two materially different arcs, ask one scope question before gathering.

Read evidence in this order, tolerating what the project actually has:

1. **Explicit intent** — current conversation and direct user corrections.
2. **Decision record** — ADRs, thoughts, plans, findings, mockups, issue/PR discussion, commit-message bodies.
3. **Shipped state** — git log/status/diff, source, tests, schemas, CLI help, generated artifacts.
4. **Concrete witnesses** — commands and outputs, probe metrics, before/after data, screenshots, diagrams, audio/video, published artifacts.

Treat the project structure as a convention, not a contract:

- **Standard evidence tree** — consume its named decision/plan/finding folders directly.
- **Ad-hoc evidence** — read useful files wherever they live; do not require migration before retracing.
- **Sparse evidence** — reconstruct only what the sources support and mark the rest Unknown.

Capture the real date and current git SHA when available. Self-report the evidence tier in the outline and final artifact so the reader can judge confidence.

### Evidence ownership rules

- Durable state wins for **what shipped**.
- An explicit user statement or recorded decision wins for **why it was intended**.
- Code shape alone never proves historical rationale.
- A later document may describe current policy without proving why an earlier turn occurred.
- Contradictory sources stay visible until the user resolves them; do not average them into a smooth story.

## Step 2 — Reconstruct pressure-bearing stages

Build the smallest set of stages that explains the arc. Every stage must contain all six fields:

| Field | Required answer |
|---|---|
| **Prior state** | What belief, design, or implementation entered this stage? |
| **Pressure** | What concrete friction, contradiction, or missing capability made it insufficient? |
| **Evidence** | What source or witness made that pressure inspectable? |
| **Decision** | What response was chosen, and which meaningful alternative was rejected? |
| **Status** | Was it discussed, decided, implemented, verified, committed, deferred, or superseded? |
| **Next pressure** | What remained unresolved and therefore forced the next stage? |

The sixth field is the bridge. Test every bridge:

1. Does the evidence actually support the pressure?
2. Does the decision respond to that pressure?
3. Does the next pressure arise from the result, or are two unrelated threads merely adjacent in time?

If any answer is no, split the stages, reorder them, or label the bridge unsupported. Never use a decorative arrow to hide a missing cause.

### Label rationale separately from status

Apply one provenance label to every rationale/bridge claim:

- **Recorded** — an ADR, thought, plan, commit body, finding, or explicit user statement records the reason.
- **Inferred** — the claim is a bounded interpretation of source/diff/test sequence, not an explicit decision record.
- **Unknown** — available evidence cannot support the causal claim.

Do not let “implemented” imply “decided,” “verified” imply “committed,” or “current code” imply “original intent.” Show the exact status supported by the evidence.

### Choose concrete witnesses

For every abstract stage, identify at least one inspectable witness when evidence exists. Match the witness to the claim:

- data-model claim → real before/after fields or types;
- editability claim → a small mutation that succeeds/fails visibly;
- renderer/runtime claim → command + measured output or playable media;
- persistence claim → saved identity/state beside fresh-process restoration;
- decision claim → source excerpt summarized within citation limits and linked to its owner;
- status claim → commit/test/diff evidence.

No witness exists → say so. A generic decorative chart is not evidence.

## Step 3 — Put the causal outline in front of the user

Before writing HTML, present a compact outline in the user's language. Lead with the current conclusion, then include:

1. **Scope + evidence basis** — arc, date/SHA, evidence tier, important gaps.
2. **Stages** — each stage's prior state → pressure → evidence → decision → status.
3. **Bridge after every stage** — one sentence beginning from what remained unresolved and ending at why the next stage became necessary.
4. **Witness plan** — the concrete example/media/interaction that will make each abstract stage inspectable.
5. **Current boundary** — what is true now, what is proven, and what remains unresolved without deciding the roadmap.

Ask the user to correct stage boundaries, intent, missing decisions, and bridges. **Stop here until they accept or correct the outline.** If the same outline was already explicitly accepted earlier in the live context, reuse that acceptance and proceed; do not make the user approve twice.

On correction, update the outline first. User testimony may promote an Inferred historical reason to Recorded; label it as a user statement rather than pretending it came from git.

## Step 4 — Render the corrected retrace

### Choose the output home

Use the location the user names. Otherwise:

1. reuse an established project artifact/fileserver convention when one is evident;
2. else write `docs/retraces/<YYYY-MM-DD>-<topic>/index.html`;
3. keep local media beside it and link with relative paths.

Create a **dated snapshot**, not a silently maintained second source of truth. Put a head-readable HTML comment at the top with: what the retrace covers, current status, generation date/SHA, evidence basis, and whether a later artifact supersedes it.

### Required information architecture

Render one standalone interactive HTML page, plus local media files only when needed:

1. **Current-position lead** — where the arc ended and the shortest plain-language explanation of why.
2. **Stage navigator** — scan the whole path without reading every detail.
3. **Causal stages** — the six fields, provenance, status, and source links.
4. **Visible bridges** — each stage ends with the pressure that opens the next; no unexplained jump.
5. **Concrete witnesses** — embedded beside the claim they support, not collected in an evidence appendix the reader must cross-reference.
6. **Current boundary** — proven / implemented-but-unverified / decided-but-unbuilt / unresolved, kept separate.
7. **Evidence ledger** — sources, gaps, generation date, and SHA.

### Interaction follows the claim

Use interaction only when it transfers understanding:

- before/after toggle for a changed data shape;
- insert/edit/reset control for an identity or mutation claim;
- placement/voice/state switch for alternative resolutions;
- clickable matrix or chart for measured comparisons;
- audio/video controls for perceptual evidence;
- expandable technical layer when plain language should lead.

Decorative animation, fake controls, and charts that merely repeat prose do not count. Keep every interaction deterministic and make its state visible.

### Visual and language rules

- Match the project's established artifact palette, typography, spacing, and theme behavior when available; otherwise use a quiet neutral system.
- Write the human-facing artifact in the user's requested or conversational language; preserve identifiers, commands, and source text in their real form.
- Lead with plain language and place technical detail behind progressive disclosure.
- Use responsive layout, keyboard-operable controls, visible focus, sufficient contrast, and reduced-motion support.
- Keep the page self-contained: inline CSS/JS, no external runtime or CDN dependency. Local media may remain separate.

## Step 5 — Browser-verify and activate

An HTML file on disk is not a delivered retrace. Verify it in a real browser before handoff:

1. load with zero console errors;
2. exercise every decision-critical control and confirm visible state changes;
3. check desktop and narrow/mobile layouts;
4. confirm source links and local media resolve;
5. confirm audio/video metadata and playback controls load when present;
6. verify plain/technical or language/theme controls when included;
7. scan every stage-to-stage bridge for an unexplained jump.

Then hand over a reachable URL:

- local shared-display session → open the artifact and provide the local path/URL;
- remote/headless session → use an existing project fileserver/artifact convention when configured, otherwise start one reusable static server and provide its HTTP URL.

Do not claim media verification from a `200` response alone when the browser failed to decode it.

## Step 6 — Report the boundary, then stop

Return:

- the live artifact URL;
- the arc and evidence tier it covers;
- the date/SHA freshness stamp;
- any Inferred/Unknown bridges the user should treat cautiously;
- verification performed.

Do not convert unresolved items into a roadmap, edit product decisions, or start implementation. If the user wants to choose next, that is `shape-align` or `shape-elicit` depending on whether the decision is already made.

## Completion criterion

Retrace is complete only when:

- the arc is bounded and its evidence tier is self-reported;
- every stage carries all six fields;
- every rationale/bridge is Recorded, Inferred, or Unknown;
- status does not conflate decided, implemented, verified, and committed;
- the user corrected or accepted the outline;
- abstract claims have concrete witnesses when evidence exists;
- the interactive artifact is dated, browser-verified, and reachable;
- the current boundary and evidence gaps remain explicit;
- no code, decision, plan, or canon artifact was modified.

If the user stops after the outline, report “outline aligned; artifact not yet rendered.” Do not call the retrace complete.

## Boundaries

| Neighbor | Boundary |
|---|---|
| Plain recap | Lists what happened in order. Use no skill for that. Retrace exists only when causal re-entry and a concrete artifact are needed. |
| `reflect-catchup` | Reports the present cursor: goal, done, now, open, next. Retrace reconstructs the full pressure-bearing path. |
| `nav-tour` | Builds a corrected model of the current codebase. Retrace explains development causality across decisions, probes, implementations, and artifacts. |
| `reflect-observe` | Selects and writes durable learnings. Retrace preserves the whole causal context for human alignment. |
| Planned `reflect-retro` | Evaluates where the process went wrong and prescribes a process change. Retrace explains neutrally. |
| `shape-mockup` | Renders disposable candidates to decide a future shape. Retrace renders a durable account of an already-lived arc. |
| `shape-align` / `shape-elicit` | Decide priorities or principles. Retrace only exposes the current boundary and unresolved questions. |

## Anti-patterns

| Temptation | Instead — and the tell |
|---|---|
| Turn git log into a timeline | Reconstruct pressure-bearing stages. Tell: removing the dates leaves no explanation of why the next stage happened. |
| Invent a smooth bridge | Label Inferred/Unknown and ask at the outline gate. Tell: “we chose X because Y” has no decision source or user confirmation. |
| Treat current code as original intent | Separate shipped state from recorded rationale. Tell: a source file is the only citation for a historical “why.” |
| Merge unrelated threads because they were adjacent | Split or branch the arc. Tell: the decision in stage N does not respond to its stated pressure. |
| Conflate decided with shipped | Show exact status. Tell: a thought or conversation is cited as implementation evidence. |
| Render before the user checks the outline | Stop at Step 3. Tell: polishing HTML while stage boundaries are still inferred. |
| Use abstract prose where a witness exists | Put the real shape, command, metric, or media beside the claim. Tell: the reader must trust “this was hard/broken/different.” |
| Add decorative interactivity | Make each control reveal evidence or remove it. Tell: clicking changes color but not understanding. |
| Store the output under mockups by habit | Use a retrace/artifact home. Tell: a historical alignment record is about to enter a disposable decision-candidate lifecycle. |
| Turn the ending into a roadmap decision | State the boundary and stop. Tell: the artifact begins prioritizing unresolved work. |

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each update with one plain sentence; use a metaphor when it clarifies the causal model.
- Put precise technical detail after the plain explanation and only where evidence needs it.
- During a long render/verification pass, keep the user updated at least once per minute.

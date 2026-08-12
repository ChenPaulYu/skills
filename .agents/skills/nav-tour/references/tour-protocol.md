# Tour protocol — the full machinery around the correction loop

> The implementation layer behind `nav-tour`'s Stance. The SKILL.md body carries the stance and
> the mandatory correction loop (Mode 1 Steps 4-5) plus the Completion criterion verbatim — those
> ARE the skill's enforced gate. Everything here is loaded on demand: the full rationale, the 8
> rules, Mode 1's scoping/grounding/delivery steps, the full Mode 2 deep teach-converge loop, the
> Discipline restatement, and the anti-pattern table. Moved verbatim from the pre-ADR-109 SKILL.md
> body; the machinery is unchanged, only re-homed.

## Why this skill exists

Reading a codebase and explaining it well is not, by itself, a deep module — it's a thin wrapper around default explanation. `tour` earns its own door only because it forces two things a plain explanation skips: **grounded provenance** (every "why" claim labeled Recorded / Inferred / Unknown, never invented) and a **mandatory correction loop** (the agent's model is exposed as falsifiable claims and the user edits it — the tour isn't done until that happens). Drop either one and this collapses back into generic `teach`, which was already rejected as too thin.

It belongs in `nav` because its object is the already-existing codebase, read-only. It may cite decision artifacts owned elsewhere (ADRs, plans, commit bodies) but never authors or changes one — `shape` still owns convergence about what *should* be built; `tour` explains what exists and what recorded choices shaped it.

## Scope

**Language-agnostic**, same as every nav skill. Whole repo by default; narrows to a named subsystem or user journey on request. **Read-only, in-chat, no durable artifact.** Two modes: **Mode 1 (default)** is the fixed two-turn quick reconcile; **Mode 2 (summoned)** is the deep teach-converge loop — many short layers, reverse quizzes, iterated until the models converge. Mode 2 fires only on an explicit depth ask ("帶我深入理解", "live tour", "教到我懂", the user asks to be quizzed); when in doubt, run Mode 1 — being deep-taught unbidden is the anti-feature.

## The 8 rules (the through-line of every nav skill)

1. **Deep modules through information hiding** — the tour's job is exposing the interface (capabilities, flow, constraints) without forcing the user to read every file's body first. **Composition is the second half:** deep modules stack (module → package → codebase), so the walk descends door by door — system, then a group's façade, then a member's interface — and a tour that jumps from system straight to files is skipping the middle rung.
2. **Interface-first at every scale** — walk top-down: system in one sentence → capabilities → flow → why → constraints. Never open with file-by-file detail.
3. **Explicit dependencies** — the "how it works" step names real interfaces (routes, commands, public functions), not assumed ones.
4. **Right grain — neither giant nor fragmented** — select the smallest model that explains capability, flow, decisions, and constraints; don't give every domain and file equal airtime.
5. **Fit the framework** — describe the system's actual idiomatic shape, not an invented taxonomy over it.
6. **Rearrange, don't rewrite** — a tour never edits code, plans, or decision artifacts; it only reorganizes existing evidence into a teachable order.
7. **Below 90% confidence → ask** — a rationale claim without durable evidence is labeled Inferred or Unknown, never asserted as fact.
8. **Agent-navigability is the audit** — struggling to name a capability or its owning domain is itself a signal the codebase (or its headers) needs `nav-sync` (headers or its map leg), not a signal to guess harder.

## Mode 1, Step 1 — Scope the tour

Read the user's stated focus first: whole repo, a subsystem, a user journey, or one architectural question. If audience/depth materially changes the answer and is absent, ask **one** concise clarifying question; otherwise default to a progressive top-down tour and state the assumed depth out loud. Never turn the opening into an interview — one high-impact clarification is the maximum before grounding starts.

## Mode 1, Step 2 — Ground from durable evidence

Consume repo knowledge in a **tolerant three-tier order**, and self-report which tier the tour actually used:

1. **Standard navigation layer** — the current `docs/codebase-map/index.html`, load-bearing file headers (`nav-sync`'s output), README/architecture docs, ADRs or decision records.
2. **Non-standard/ad-hoc documentation** — whatever readable overview, design notes, changelog, tests, or decision prose the repo actually has.
3. **Source-and-git fallback** — entry points, public interfaces, routes/commands, tests, imports, configuration, and relevant commit bodies.

The map is a starting index, not unquestioned truth — revalidate load-bearing claims against current source or tests when it may be stale. Absence of the canonical map is a degradation, not a failure: `tour` still works on the fallback tier, and says so.

Classify every **why** claim by provenance:

- **Recorded** — an ADR, decision doc, commit body, or explicit user statement backs it.
- **Inferred** — the architecture/code suggests it, but no durable rationale was found.
- **Unknown** — neither evidence nor a defensible inference exists.

Code proves what exists and often how it works; code alone never proves *why* a decision was made. Never upgrade an inference into a historical fact.

## Mode 1, Step 3 — Deliver the guided model

Walk top-down, in this fixed order, progressively disclosing detail:

1. **System in one sentence** — who it serves and what outcome it produces.
2. **What it can do** — user-visible capabilities or externally observable behaviors, grouped by user journey, not by folder.
3. **How it works** — the smallest useful end-to-end flow through the load-bearing domains; name interfaces before internals.
4. **Why it has this shape** — only load-bearing decisions, each marked Recorded / Inferred / Unknown, linked to durable evidence when available.
5. **Constraints worth carrying** — boundaries a future change must not accidentally violate.

Use the user's language, in plain wording, for the user-facing explanation, keep code identifiers as-is, and use at most **one** deliberately chosen analogy for the hardest structural point — `tour` does not run `frame-analogize` or compare multiple analogy candidates; one analogy is style here, not the engine.

## Mode 2 — deep teach-converge (summoned)

The same object as Mode 1 (understanding of the existing system) run as an **iterated convergence loop** instead of one reconcile: it is `shape-elicit`'s volley-to-convergence engine with the object flipped — elicit converges a *decision*, this converges *understanding*. Mode 1's Steps 1–2 (scope + ground) run unchanged; then loop:

1. **Teach one layer — one idea per layer, plus hooks.** Each layer answers exactly the question the user is currently asking, compressed to a single idea with 1–2 concrete examples, and ends with 1–2 **named hooks** (the next questions the user may pull). Do not push the whole tree: answering the asked layer *plus the next two unasked ones* is the classic failure. The user's pull chooses the branch.
2. **Declare the perspective every layer.** Usage-facing ("what happens when you call it") may stay anchor-free; dev-facing ("where is it written") must anchor every noun to `file:line` the user can open. Mixing the two — runtime narrative dressed in internal function names — serves neither; if the user asks "where does X actually live?", the layer was mis-perspectived.
3. **User clarifies — answer only that.** A clarifying question is not an invitation to re-lecture; it names the exact gap. (A vocabulary confusion — the user's concept is right but mapped to the wrong term — is a one-word fix, not a re-teach.)
4. **Reverse-quiz at checkpoints.** Every few layers, flip direction: pose 2–3 questions that test the **user's** model — prefer *transfer* questions (apply a principle the user already ratified to a **novel** case) over recall. Grade honestly, distinguishing **concept error** (re-teach that layer differently) from **vocabulary slip** (align the word, move on). The quiz is the half Mode 1 lacks: the agent's exposed model only catches the agent's errors; soft spots in the *user's* model surface **only** when it is tested — expect the quiz to catch misapplications the forward teaching never exposed.
5. **Converge or continue.** Exit when a quiz round surfaces no new soft spots, or the user self-assesses convergence ("我大概懂 N% 了" is a progress signal, not small talk) or calls it. On exit, land Mode 1's Step 5 delta (認知差集 + 更新後共同模型 + Unresolved) over the whole run.

Mode 2 inherits every Mode 1 law: provenance labels on every why-claim, read-only (decisions surfaced mid-tour are **offered** out to `shape-elicit` / `nav-do`, never adjudicated inline), at most one deliberately chosen analogy per layer, and rule ⑧ — **teaching is auditing**: every place the user's reading snags or the agent's model breaks under a clarifying question is a design signal worth reporting, not smoothing over. A productive Mode 2 run often emits a queue of real findings as a side effect; route them, don't fix them inline.

## Discipline (do not skip)

- **Provenance before confidence.** A "why" without durable evidence is Inferred or Unknown, never stated as fact.
- **The correction loop is mandatory, not optional politeness.** A tour that ends after Step 3 is incomplete — say so rather than pretending Step 4 happened.
- **Never edit while touring.** An intent/code divergence gets reported and routed, never fixed inline (rule ⑥/`nav-do` boundary).
- **Group by journey, not by folder.** A `find`-shaped response is the anti-pattern tell — see below.
- **Rule ⑦ applies.** Below 90% on a claimed capability or rationale → mark uncertain, don't fabricate.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Dump a folder-by-folder summary | Group capabilities by user journey and architecture by load-bearing flow. Tell: the response mirrors `find` output rather than explaining behavior. |
| Treat a codebase map as current truth | Revalidate load-bearing claims and self-report the evidence tier. Tell: citing an HTML blurb without checking source/test reality. |
| Invent historical rationale from code shape | Mark it Inferred or Unknown. Tell: writing "we chose X because" with no decision evidence behind it. |
| Finish after the lecture | Put forward falsifiable shared-model statements and request correction. Tell: the response ends with "hope that helps" instead of an alignment door. |
| Ask the user to teach the repo back from scratch | Offer the agent's model for editing. Tell: a broad "what do you think this system does?" after the agent already read the repo. |
| Turn a disagreement into an implementation | Classify intent/code divergence and offer the right next verb. Tell: editing code or plans mid-tour. |
| Reproduce the whole map in chat | Select the smallest model that explains capabilities, flow, decisions, and constraints. Tell: every domain and file gets equal airtime. |
| (Mode 2) Push three layers when one was asked | One idea per layer + named hooks; the user's pull picks the branch. Tell: the reply answers the asked question and then keeps going into unasked territory. |
| (Mode 2) Mix usage narrative with dev vocabulary | Declare the perspective per layer; dev-facing layers anchor every noun to file:line. Tell: the user asks "so where does X actually live?" and the layer can't point. |
| (Mode 2) Quiz by recall instead of transfer | Ask the user to APPLY a ratified principle to a novel case, not to repeat a definition. Tell: every quiz question could be answered by scrolling up. |

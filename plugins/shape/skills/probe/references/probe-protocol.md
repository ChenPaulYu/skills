# Probe protocol — the full design chain, shapes, and output shape

> The implementation layer behind `/shape:probe`'s stance. The SKILL.md body carries the stance;
> Read for existing-evidence assessment, new experiment design, or an unclear boundary.

## Choose the evidence branch

**Existing measurements:** locate the pending decision, original method, inputs, comparison,
and verdict criteria. Report missing criteria or preregistration as absent; assess what the
data supports under those limits. Separate component quality, workflow completion, and
timing, and name confounds and unmeasured outcomes. Use that evidence before proposing
new work. A retrospective assessment is not a preregistered trial and does not itself
authorize running a follow-up.

**New trials:** use the design chain below, fix the verdict rule before collecting data,
and execute only within the authorized scope. If existing results leave a question open,
design only the smallest follow-up that could resolve it; mark an unrun design as unrun.

## Why this skill exists

The four-quadrant knowledge map behind this family ([ADR-075](docs/adr/075-shape-probe-ask-reality.md)) names four states: you know you know it (`/shape:elicit` draws it out), you know you don't know it and the world does (elicit's survey leg maps it), you don't even know you're missing it (elicit detects the blind spot mid-grill and runs the leg in place), and — the fourth — **nobody knows**. No amount of grilling the user, mapping the repo, or reading documentation answers a fourth-quadrant question, because the fact simply hasn't been measured yet. Grinding on it with more argument produces confident-sounding noise, not an answer. `probe` is the verb that stops arguing and starts measuring: design a minimal experiment, run it, let the result — not the strongest rhetoric — decide.

The gap was real, not hypothetical: this repo has hand-rolled the deliverable `probe` now encodes at least three separate times, each time re-inventing the discipline from scratch — see ADR-075 for the citations. A verb that gets hand-produced three times without anyone naming it is exactly ADR-038's trigger condition ("if you're about to hand-roll a verb's deliverable, fire the verb instead").

## Design chain — three lenses, borrowed by protocol (never by call)

`probe` doesn't invoke `frame:dialectic`, `frame:first-principles`, or `frame:orthogonal` — skills in this marketplace never call each other. It restates their disciplines in sequence, crediting each, the same borrow-by-protocol pattern the now-retired `position` skill established for elicit/mockup/first-principles (ADR-008):

1. **Locate the load-bearing assumption** — `frame:dialectic`'s move. A fork usually has several plausible-sounding cruxes; only one is actually load-bearing (the assumption that, if it flips, flips the decision). Don't design an experiment around a surface disagreement — find the one thing the fork actually rests on. If dialectic already ran and named a "Missing Evidence" row, that *is* this step's output — reuse it, don't re-derive it.
2. **Strip it to the smallest testable claim** — `frame:first-principles`' move. Convention vs necessity: restate the load-bearing assumption as the smallest falsifiable statement, stripped of the surface phrasing that made it sound bigger or vaguer than it is. Test the necessity, never the wording ("does a graph database read faster" is testable; "is a graph database the right model" is not — reduce to the first before designing anything).
3. **Control the variables** — `frame:orthogonal`'s move. Once the claim is stripped to size, vary exactly the one axis that claim is about and lock every other axis identical between conditions. Orthogonal's independence check — move one axis, the others must not move — **is, verbatim, the definition of a controlled experiment.** An experiment that lets two things vary at once never produced evidence about either.

Budget goes to the load-bearing point from step 1, never to the surface phrasing the fork was originally argued in.

## Minimal-experiment shapes — three canonical forms

Pick the shape that matches what's actually uncertain; don't default to one out of habit.

- **A/B comparison** — two variants run under identical conditions, one axis differs. Example: two onboarding copy variants shown to matched user cohorts, one metric (completion rate) compared.
- **Blind judgment test** — independent judges assess outputs without being told which is which or what the "expected" answer is. Example: two response styles from a support tool, shown unlabeled to reviewers who each pick the one they'd rather receive; reviewers are never told which variant they're looking at.
- **Behavior probe** — drive the real system in a controlled state and observe what actually happens, rather than reasoning about what should happen. Example: seed a cache with a known-cold state, fire the real request path, and observe whether the fallback path actually triggers — instead of arguing from the code whether it would.

These three are canonical, not exhaustive — but a proposed fourth shape should earn its place the same way these did (recurring real use), not be invented per-session.

## Execution discipline

- **Pre-register new trials.** Before the first new trial, state what result maps to which conclusion. Existing-data assessment reports the original rule or its absence; it never invents retrospective preregistration.
- **Smallest N that can actually discriminate.** More trials than needed to tell the shapes apart is budget wasted on certainty nobody asked for; fewer trials than needed produces a coin flip dressed as a finding. Size N to the effect you're trying to detect, not to a round number.
- **Report negative or ambiguous results honestly.** An experiment that fails to discriminate between the candidates is itself a finding — it means the load-bearing assumption from step 1 wasn't as load-bearing as thought, or the test wasn't sharp enough. Report it as exactly that, never quietly reframe it into a win.

## Inputs, comparisons, and measurement limits

Map the verdict to the pending decision: functional correctness, output quality, and
workflow benefit need their own evidence. A more accurate component alone does not
prove a new API is necessary or that users/agents complete the task better. Use a
workflow comparison when that is the actual uncertainty; a fresh-agent trial is an
option, not a mandatory addition to every experiment. Existing results can be assessed
without rerunning them; identify their original criteria or absence rather than inventing
a pre-registered rule after seeing the data.

Choose representative real inputs when the decision concerns real use. Synthetic
fixtures isolate a mechanism; label what they cannot establish. Keep input selection,
versions, settings, and comparison conditions visible. Examples chosen to make a
difference obvious are demonstrations, not an estimate of average performance.

For timing, control competing CPU/GPU work and comparable warmup/cache/startup states.
Record interference; contaminated timings cannot establish a winner and need a clean
rerun only if timing still affects the decision. Distinguish elapsed time from tokens,
accuracy, and user effort. Publish only observed numbers with their measurement source.

When the user needs firsthand judgment, deliver the smallest usable comparison: matched
outputs, an interactive path, or audio aligned to the same excerpt. Describe what to
inspect and expose the original/expected result when useful. A metric table alone is not
proof of perceptual quality or workflow fit. Follow the session's artifact-serving policy.

## Dispatch — design and verdict stay with the session model

Per the dispatch-tiers convention (ADR-067): designing the experiment (steps 1-3 above) and reading the verdict against the pre-registered rule is the judgment-dense part — it stays with the session model. The **execution legs** — running each variant, collecting the raw outputs, tallying results — can go to cheap-tier delegated agents, reporting back grounded in fact (the actual output, the actual number), never an impression of how it went.

## Live-LLM-cost signal — probe's own instance (ADR-062)

For paid-LLM fanout, state the selected model, call/trial scale, and intended budget.
Honor approval already given for the same scope, including the user's tier choice.
Ask only for missing authority or a material increase in cost/effects. Keep execution
within the approved bound; neither extra repetitions nor a full-cost finale are automatic.
Recorded-data assessment does not launch paid trials merely to complete a report.

## Read-only toward product code

`probe` never edits source to make an experiment work. Fixtures, harness scripts, and transcripts produced while running an experiment are disposable — they live in a scratch or throwaway location, never committed as if they were the deliverable. Retain the findings according to project policy; apply `references/development-artifacts.md`
for storage, Git checks, and recovery. A reusable harness becomes a tracked regression
test only through an explicitly adopted project deliverable.

## Output

A findings-style doc: method + data + verdict. Lands under the project's `docs/findings/` if that convention already exists in the repo, else `blueprints/thoughts/<date>-<topic>-probe.md`.

**Tolerant reader (ADR-071):** neither `docs/findings/` nor `blueprints/` is a contract. If neither exists yet, scaffold the simpler of the two rather than failing; if either exists in a non-standard shape, tolerate it and write into whatever shape is there; either way, self-report which tier you wrote to so the user can calibrate trust in the result.

The doc states explicitly, near the top, that **the evidence feeds the pending decision back** — into `/shape:elicit`'s next volley if a fork sent it here, or directly back to the user if they summoned `probe` on their own.

**Write-gated.** Show the doc's content before writing it.

## Boundary — three neighbors, one line each

- **vs `/shape:mockup`** — mockup converges a **preference** by a rendered, disposable artifact you look at and pick from. `probe` converges a **fact** by a measured, disposable experiment you run and read. Same spine ("converge by a real disposable instance, never a description"), two different objects: look-and-feel is decided by seeing; a fact about the world is decided by measuring.
- **vs `/shape:dogfood`** — dogfood drives an **already-built** feature to surface friction and coverage gaps in something that exists. `probe` answers a **still-undecided** question — there's often nothing built yet; the experiment itself may be the first real artifact either variant gets.
- **vs `/verify`** — verify checks that a **change did what it claims** — a known expectation, confirmed. `probe` answers an **open unknown** — there's no known expectation yet; the whole point is finding out what's true.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Test the surface phrasing instead of the load-bearing assumption | Run step 1 of the design chain first — testing the phrasing wastes the experiment on a wording dispute nobody needed settled. Tell: the experiment's outcome wouldn't actually change anyone's next decision. |
| Vary two things at once | Change one axis at a time — varying two pollutes the evidence, since you can't attribute the result to either. Tell: the experiment design has two independent variables moving in the same trial. |
| Present retrospective criteria as preregistered | Fix the rule before a new trial; report original criteria or absence for existing data. Tell: claiming a rule was chosen before data without evidence of that sequence. |
| Let the experiment sprawl past minimal | Keep it to what the discriminating question needs — extra trials/variants buy false confidence, not better evidence. Tell: adding another variant "just to be thorough" when the core question is already answerable. |
| Edit product code to force a result | Stay read-only toward source — if the "experiment" needs the thing under test changed, it isn't an experiment. Tell: about to modify the code being tested instead of just observing it. |
| Hide an ambiguous or negative result | Report it as a finding — an assumption that wasn't load-bearing, or a test that wasn't sharp, is still worth knowing. Tell: tempted to omit a result because it doesn't support the expected direction. |
| Extend paid fanout beyond approval | State scale, reuse matching approval, and ask for any missing authority or increased cost/effects. Tell: adding repetitions or changing the selected tier beyond the approved run. |

## Companion skills

- **`/shape:elicit`** — the fork that sends work here (a stuck volley) and the consumer of the evidence probe brings back.
- **`/frame:dialectic`** — names the deciding experiment at its own trial's end; `probe` is the verb that actually runs it, closing the hand-off dialectic used to leave open.
- **`/frame:first-principles`** — the strip-to-testable-claim move borrowed in design-chain step 2.
- **`/frame:orthogonal`** — the control-the-variables discipline borrowed in design-chain step 3; its independence check literally defines a controlled experiment.
- **`/shape:mockup`** — the preference-convergence sibling on the same spine; probe is its fact-convergence twin.
- **`/shape:dogfood`** — friction on a built feature, not an open unknown.
- **`/verify`** — correctness of a known change, not an undecided fact.

# Document sync — claim, implementation, reader path

The skill body owns scope and write authority. This protocol supplies the checks, adapted
from nav-sync's docs leg (ADR-125), expanded for complete batches in ADR-131.

## Ground the requested pass

Record the target documents, implementation revision, relevant uncommitted changes, and
intended audience. Inspect existing instructions and consistency checks before inventing a
checklist. Reuse recent evidence only when its scope and implementation state still match.

- **Declared gate:** follow the repository's named docs, facts, owners, and checks. This gives
  precise ownership; it does not prove that prose outside the generated or checked region is true.
- **No declared gate:** use the claim table below, adapted to the actual stack and request.
- **Missing/nonstandard docs:** consume what is readable and report the limitation. Do not
  scaffold a blueprint tree or move documents merely to obtain a preferred layout.

Report the tier. For a batch request such as "update README and docs to match current code":

1. Enumerate the requested README files and `docs/` tree (or the named equivalents), following
   the repository's links and conventions. Include nested guides and non-Markdown explanations
   when they belong to that scope; exclude vendored/generated copies through their owners.
2. Classify current reader guidance, generated content, historical records, and future plans.
   The filename alone does not decide: a current architecture contract can live beside ADRs.
3. Work through every current document against its relevant implementation. Build a compact
   in-session inventory; no new status file is required. Reuse verified shared facts across
   documents and update all explanations of a changed public concept together.
4. Give every file a disposition: updated, checked/current, historical/planned (retained),
   generated (owner regenerated), or blocked with the missing evidence named. A blocked claim
   does not stop unrelated documents. A large batch may be processed in chunks, but do not
   stop after a sample and call the requested batch complete.

A metadata inventory is not a semantic review. An update request includes applying supported
corrections and verification; do not end at a list of suggestions.

## Check the document against its source

Read each target document, including examples and limitations, and trace its reader-facing
claims to evidence. Use filenames and line anchors in findings.

| Claim kind | Evidence to inspect |
|---|---|
| Version, counts, public roster | Manifest, registry, route definitions; distinguish public and internal members |
| Install, setup, invocation | Package entry points, actual scripts, config/environment handling, dependency declarations |
| Defaults, accepted input, output, errors | Implementation path plus relevant tests; a test name alone is not proof |
| Feature capability or limitation | Reachable public behavior, callers, enabled configuration; separate implemented from planned |
| Architecture and ownership | Entrypoints, dependencies, state transitions, storage/lifecycle owners |
| Example command or snippet | Current syntax and input/output contract; execute safely when practical |
| Links and anchors | Actual destination files, headings, or external sources when verification is available |
| Generated section | Editable source and the documented generator; preserve hand-owned surrounding prose |

Do not use one stale document as another document's ground truth. A source comment can help
locate a path but must agree with its implementation. A green unit test does not establish
that a whole installation or external integration works.

## Check implementation for omissions

Inspect the public surface and relevant changes covered by the request. Ask what a reader
would need to know to start, use the changed feature, or avoid an important limitation.
New public commands, changed defaults, removed restrictions, and a different persistence
model can require documentation even when no existing sentence is literally false.

Bound this reverse pass to the target audience and feature scope. Do not turn private helpers
into promised APIs, enumerate every symbol, or invent a roadmap from code TODOs.

## Propose and apply focused changes

For each finding give the document claim (or missing topic), implementation evidence,
reader consequence, and correction. Classify it as stale, missing, removed, broken, or
unverified. Where accepted intent and implementation disagree, preserve both until the
owner decides; do not silently amend the accepted intention to match a bug.

Keep the document's language, useful organization, and historical context. Correct the
explanation and affected examples together. Broad prose restructuring belongs to a separately
requested writing task. Historical ADRs/changelogs remain dated evidence; planned behavior
stays clearly planned. Generated material changes through its source and generator.

Follow the skill body's authority gate: a check writes nothing; an update applies the shown
scoped corrections without asking again. Missing evidence stays flagged, not filled by a guess.

## Verify and report

Re-read the edited document and compare each changed claim with its owner. Check relative
links and affected examples. Run safe local help/example commands where they expose the
likely failure; avoid network writes, destructive commands, or paid calls beyond authorization.
Name commands actually executed and distinguish them from static inspection. Regenerate any
owned projection and run repository-required checks.

Report target revision/working-tree state, documents checked, changes or proposed diff,
verification, unresolved discrepancies, and skipped areas. Documentation can accurately
say an integration is unverified; never convert inability to test into a fabricated pass.

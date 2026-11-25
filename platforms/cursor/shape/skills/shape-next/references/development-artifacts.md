<!-- GENERATED from ../../references/development-artifacts.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Development artifacts — retention follows purpose

This is the editable owner of process-artifact storage. The manifest builder bundles
it into standalone skills; local references carry the same policy, not separate rules.

## Decide whether to retain

Temporary comparisons and one-off checks stay in session scratch by default. Keep
only the result and reason in the existing task when that is enough for continuation.
Honor explicit user retention choices. When selecting artifacts yourself, state their
concrete future decision or use in the owning record: "Keep this so that we can ...".
Permanently retain supporting artifacts only for:

- An unresolved comparison: its reference, leading candidate and only the genuinely
  undecided alternatives needed for the next judgment.
- An important failure: the smallest case and evidence needed to reproduce or understand it.
- An adopted deliverable that will be used again, with its necessary dependencies.

Choose the smallest complete set serving that purpose. Time or money already spent
generating a file is not a retention reason. Intermediate renders, redundant copies and
cheaply reproducible outputs without a concrete future use remain temporary. After a
decision, review the set again: usually the accepted result and a necessary reference
are enough. Propose the remainder for authorized deletion; this rule alone does not
authorize removing existing material. Keep original masters under their existing
asset-retention rules.

## Select the policy before writing

Resolve the existing project home with `references/workspace-records.md` before choosing
a destination. In a connected workspace, save explicitly retained working artifacts beside their
owning records under that home. A disposable session preview may stay in scratch;
retention and cross-machine availability require the actual artifact in the chosen home. Read the selected home's storage and ignore rules. Explicit
user/project retention choices govern. Only without a connected workspace or another
explicit retention choice, keep
blueprints (thoughts, plans, board, handoff), mockups, dogfood captures, and one-off
experiment scripts/results local and Git-ignored. A dated filename or a useful result
does not make a process artifact a production deliverable.

An instruction to save a mockup or probe includes its actual artifact and the dependencies
needed to reopen it, not only a summary, path or hash. Prefer a self-contained artifact
when supported. A data-only summary does not preserve a playable or interactive comparison.
Verify a reopen or restoration from the saved destination before
reporting preservation. A temporary server URL is a preview, not the saved copy.
Respect the home's media policy; when required assets cannot be retained under that
policy and no explicit user choice resolves it, report the concrete conflict rather
than silently splitting the artifact into another repository. Do not broaden a scoped
retention choice into a general media-import policy.

Resolve coverage at the existing process-artifact root before narrowing to the requested
output: for example, inventory `blueprints/` thoughts, plans, board, handoff, and mockups.
Identify explicit retained deliverables in that root, then choose an ignore scope that
covers every excluded existing/new record. Default-local records elsewhere in the same
root are part of this check even when the requested output is in one subdirectory.
Completion requires verifying those records as well as the new output, or reporting the
remaining exception. Report existing tracking without expanding authority into index
cleanup; preserve every existing file.

Judge purpose, not names: maintained product documentation, adopted ADRs, reusable
examples, regression tests, and necessary fixtures may be tracked under project policy.
An operational probe or benchmark runner is not automatically disposable. Preserve useful
decisions/reasons in their designated owner before retiring the supporting artifact.
Retaining a local file does not mean it is backed up or available on another machine.

## Verify Git state independently

For an authorized artifact write, add a narrowly scoped ignore rule when policy requires
one and it is missing. Use the actual repository-relative location, such as `/blueprints/`
or `/docs/blueprints/`, instead of a blanket `/docs/` or extension pattern. Read-only
analysis leaves ignore rules and the index unchanged.

Check each affected path with all three sources before reporting storage complete:

- **Ignore rules:** `git check-ignore --no-index -- <path>` tests the rule even if the file
  is tracked. Check a representative new file under a directory too.
- **Tracking:** `git ls-files -- <path>` identifies content still in the index. Ignore
  rules do not remove existing tracking; existing tracking is not proof of permission.
- **Staging:** `git diff --cached --name-status -- <path>` reveals pending additions,
  modifications, or removals. Excluded artifacts must not remain staged for addition/update.

If excluded material is already tracked, report it. Untrack it only within authorized
Git cleanup, using an exact-path cached removal that preserves disk contents; reconcile
inbound references and verify preservation. If staged edits differ from disk, preserve
both before changing the index. A request to create an artifact alone does not authorize
bulk cleanup, forced adds, deleting local evidence, history rewriting, or remote writes.

## Recovery and handoff

Git history can recover a record only if its content actually entered a commit. An
ignored/untracked file has no such guarantee. Before a move, overwrite, or deletion,
verify the destination content and recovery route; preserve unique local material when
destructive scope is missing. Local-to-shared handoffs need an explicitly selected shared
destination rather than a claim that another machine can open the local path.

Report the selected policy, artifact location, remaining tracked/staged exceptions, and
any preservation or cross-machine limits. Outside a Git repository, report that these
checks are unavailable; keep the files local without claiming Git exclusion.

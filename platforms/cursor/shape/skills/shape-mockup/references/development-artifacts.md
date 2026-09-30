<!-- GENERATED from ../../references/development-artifacts.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Development artifacts — retention follows purpose

This is the editable owner of process-artifact storage. The manifest builder bundles
it into standalone skills; local references carry the same policy, not separate rules.

## Select the policy before writing

Read the user's instructions, repository rules, existing artifact location, and ignore
rules. Explicit user/project retention choices govern. With no stated exception, keep
blueprints (thoughts, plans, board, handoff), mockups, dogfood captures, and one-off
experiment scripts/results local and Git-ignored. A dated filename or a useful result
does not make a process artifact a production deliverable.

When that policy covers an artifact tree, check its existing local records too; ignoring
only the newly created file/subdirectory leaves the policy incomplete. Identify retained
deliverable exceptions before choosing the ignore scope. Report existing tracking without
expanding the task into unauthorized index cleanup.

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

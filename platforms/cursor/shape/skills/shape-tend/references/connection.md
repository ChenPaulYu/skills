# First-time connection — locators, identity and instruction ownership

Use this protocol only for explicitly requested workspace setup. The skill body owns
scope and uncertainty gates; this reference describes the connection mechanics.

## Resolve the home without silently choosing another one

An explicit home supplied by the user wins. Otherwise use the project's existing home
locator or an available owner home entry/configuration. If My-wiki is the configured
home, its supported discovery is explicit root, `MY_WIKI_ROOT`, then the default in
`~/.config/my-wiki/config.json`: `default_workspace` selects an entry in `workspaces`,
whose `path` identifies the root. Validate the chosen path and read its AGENTS.md,
memory-policy.md and workspace/README.md when present. An invalid configured root is
an error, not permission to fall back elsewhere. A home using another explicit
convention does not need My-wiki files manufactured inside it.

The code-side pointer must resolve this same selection later. Prefer an existing
configured home identity; use a repository-relative locator when the layout is known
and portable. If explicit input differs from the configured default, bind the pointer
to the selected alias/locator instead of quietly using the default or modifying global
configuration. Ask when there is no reliable portable locator.

## Reuse real identity

Inspect `workspace/*/project.md` and resolve each `repositories` locator relative to
the **home repository root**, not the project folder. Compare resolved code locations.
A matching registration keeps its ID, title, priorities and existing record paths.
A same-name project pointing elsewhere, a moved checkout or multiple candidates needs
a decision before any overwrite or duplicate registration. Do not identify projects
solely by Git remote: multiple working directories may share it.

For a new project, use a user-supplied identity or a grounded, unique repository-derived
name. Show the chosen ID; do not ask for routine naming when evidence is unambiguous.
Only create the project directory and project.md. Its conventional frontmatter is:

```yaml
id: sample-project
title: Sample project
created: <actual-setup-date>
updated: <actual-setup-date>
repositories:
  app: <code-location-relative-to-home-root>
priorities: []
```

The body states the known project purpose/constraints, repository relationship and
where work will live when created. Do not fabricate a roadmap, initial idea, deadline,
acceptance result or six mandatory stages. Existing code/project decisions remain
where they are. Record absent history as absent; do not initialize Git or scaffold
an app merely to make the reader look complete.

## Write the smallest instruction pointer

Read the target instruction file and its maintainer rules before choosing the write
path. A generated AGENTS.md is an output: edit the declared owner and regenerate when
that operation is within scope. If the owner/command is unknown or would require a
broader change, ask and keep pending instead of appending to generated output.

An ordinary hand-owned instruction file can receive a short section such as:

```markdown
## Project workspace

Resolve <selected-home-selector-or-portable-locator>, then read
`workspace/sample-project/project.md` before reconstructing project work.
Code and product runtime fixtures remain in this repository; working records and
retained artifacts belong in that workspace. Original tasks own progress and next actions. Status is read-only; legacy migration is separate work.
```

Adapt the pointer to the repo's current convention. Reuse an existing pointer when
correct; update only a user-authorized stale locator. Keep machine-specific paths,
private work-record bodies and duplicate state out of the code instructions. Do not
replace unrelated agent guidance or add parallel AGENTS/CLAUDE owners unnecessarily.

## Verify both directions

Resolve the pointer's home selector independently, then use this package's bundled
reader with that root. Confirm `projects` has one matching project, `status` resolves
the actual code directory, and `check` has no new diagnostics. Read legacy material
as legacy: setup neither migrates it nor claims it is now validated. A no-record
project is a valid initial connection.

Re-read and inspect both repositories' diffs. Respect their tracking/ignore/commit
policies; no broad stage, reset, stash or installed-hook change belongs to setup.
A repeat with the same registration and valid pointer changes nothing, including
dates. If an existing connection is already correct, report that with verification.

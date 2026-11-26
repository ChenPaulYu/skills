# Home configuration and project connection

Use for explicitly requested setup. A Home is the user's selected repository of working
records; no particular product or service is required. Setup registers identity and
local paths. Blueprint migration and product implementation remain separate operations.

## Inspect before setup

Read the chosen Home's instructions, storage policy and project convention. The helper
supports the existing `workspace/<slug>/project.md` convention (`workspace-v1`). For a
different convention, follow its existing adapter or report the unsupported layout;
creating My-wiki files or rewriting its records is not a prerequisite.

Use the current skill's bundled [workspace CLI](../scripts/workspace). It requires Git, uv and Python
with PyYAML; the shell entry packages that runtime. `connection --help` lists the
setup operations. Explicit `--config FILE` selects a per-machine configuration;
otherwise `WORKSPACE_CONFIG`, then `~/.config/agent-workspace/config.json` applies.
An invalid selected configuration is an error, never a fallback to another Home.
Before assigning identities, synchronize an existing Home upstream by fast-forward
only and inspect the code remote; unavailable or divergent evidence needs resolution.

## First machine

```sh
scripts/workspace connection init personal /path/to/home
scripts/workspace connection connect sample-project app /path/to/app --title "Sample project"
scripts/workspace connection resolve /path/to/app
scripts/workspace connection doctor /path/to/app
```

`init` uses an existing Git checkout containing `workspace/`. It saves a stable Home
UUID in `.workspace-home.json`, and the local alias/path in the per-machine config.
It also creates a per-machine `machine_uuid` once in that config, retaining it on
repeat runs. This is distinct from the committed Home and project UUIDs and any
Home-specific collector machine ID; those identities are not replaced.
The first alias becomes the default. Later aliases preserve the default unless
`init ... --default` is explicitly requested. Reusing an alias with another Home UUID
fails; relocating the same Home preserves its UUID.

`connect` creates only a needed project entry, adds a project `uuid` and registers a
repository alias with its credential-free hosted Git remote. It retains the existing
project `id`, title, dates, priorities, body and work-record IDs. Existing repository
frontmatter must use block YAML; unusual inline mappings need an explicitly scoped
edit first. An existing legacy path must identify this checkout before conversion.
Other mappings and projects remain unchanged. The helper does not invent a roadmap.

Choose a grounded unique slug for a new project. Inspect existing entries first;
reuse a matching registration. The same remote or location already registered under
another project prevents accidental duplicate creation. Use `--remote NAME` when the
repository's own fetch remote is not `origin`; a private checkout's public upstream
is not its own identity. Hosted SSH and HTTPS forms compare as the same repository.
For an existing no-remote repository, use `connect ... --local`. It saves a
`local_uuid` plus an existing commit `anchor` in the repository mapping. A later
explicit `bind` verifies that commit exists in the selected checkout. This gives
independent local history a portable identity without inventing a hosted remote.
Startup reports remote progress and CI as not configured; it still syncs Home.

A second `connect sample-project another-repo /path/to/another-repo` registers another
implementation repository under the same project UUID. Tasks select their `repo`
alias. Keep public/private channel rules and product development guidance intact;
a shared project never authorizes merging its repositories together.

Existing projects may share a repository (for example, a knowledge Home serving
both its development project and a research project). Connect each existing entry
under its original UUID and alias. When implicit lookup is ambiguous, use
`resolve /path/to/checkout --project PROJECT` or the same selector with `doctor`
and `start`. `--repo ALIAS` disambiguates multiple aliases of the same Git worktree
family. Setup commands already have explicit project/repo operands. Keep ambiguity
visible rather than invent a default project or collapse the existing records.

## Another machine or moved checkout

Pull/clone the Home first. Its committed Home/project UUIDs are the authority:

```sh
scripts/workspace connection init personal /different/path/to/home
scripts/workspace connection bind sample-project app /different/path/to/app
scripts/workspace connection doctor /different/path/to/app
```

`bind` only changes local config. It validates the registered remote before saving,
never creates a new project/UUID, and can replace a missing old checkout's binding.
One alias has one default checkout per machine config. Existing other clones require
an explicitly separate `--config` selection. Git worktrees inherit their base clone's
binding; `resolve` identifies the current worktree, while project status lists the
registered default checkout. Report that distinction when reviewing a branch.

Local configuration is not portable identity and must not be copied between machines.
Keep unrelated settings and aliases intact. Repeated identical setup preserves bytes
and timestamps. If a write fails midway, report it; rerun with the same Home rather
than generating a replacement identity. Review Home metadata changes before commit.

## Keep personal connections out of product repositories

The committed Home stores project identity and repository remotes; local config stores
checkout paths and aliases. Product README, AGENTS.md and AGENTS.md remain useful to
contributors without private Home/project pointers. Shared skills consult the local
registry before reconstructing work. Existing old pointers are readable compatibility
evidence; remove them only in an authorized edit through their real source owner.

A local repo file is optional only when the host cannot use the registry. Explicitly
read it and exclude it via `.git/info/exclude`; keep its format/owner clear. Do not
create a second AGENTS owner or modify shared `.gitignore` just for personal routing.

## Verify and continue

`resolve` and `doctor` are read-only. Confirm one project, unchanged UUIDs on repetition,
the actual mapped Git roots and no new reader diagnostics. Missing Homes, duplicate
UUIDs, ambiguous bindings and mismatched repository remotes are reported, never guessed.
An empty project is valid. Record absent history as absent.

Commit/push the authorized Home metadata using its policy; local machine configuration
is not committed. Before actual development, apply the **Development startup** section
of `references/workspace-records.md`. Setup alone proves neither migration nor completion.

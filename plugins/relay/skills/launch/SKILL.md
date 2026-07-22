---
name: launch
description: "Set up or audit the current GitHub repository for Relay. Use when a repository adopts Relay or its permissions and protection may have drifted. Writes only after an approved mutation plan; read-back verification is required."
---

# launch — make one GitHub repository safe for Relay

Audit the current repository, then configure only what the user approves. One Relay workspace equals this repository.

## Process

`OWNER/REPO` and `BRANCH` below are placeholders — resolve them from step 1 before running any later command.

1. **Resolve repository and viewer.**
   ```
   gh repo view --json nameWithOwner,defaultBranchRef,viewerPermission
   ```
   Missing authentication or insufficient admin access is a blocker, not a reason to guess.
2. **Audit prerequisites.** Read back:
   - Discussions enabled, with usable Announcement and Q&A categories and each category's live slug:
     ```
     gh api graphql -f query='query($owner:String!,$name:String!){repository(owner:$owner,name:$name){hasDiscussionsEnabled discussionCategories(first:25){nodes{name slug isAnswerable}}}}' -f owner=OWNER -f name=REPO
     ```
   - token scopes and repository permissions needed by the requested operations:
     ```
     gh auth status
     ```
   - CODEOWNERS presence and coverage for `core/`:
     ```
     gh api repos/OWNER/REPO/contents/.github/CODEOWNERS
     ```
     (GitHub also accepts `CODEOWNERS` at the repo root or in `docs/`; check whichever the repo actually uses.)
   - default-branch rulesets, one required approval in v1, stale-approval dismissal, required-review enforcement, and bypass actors — all surfaced in the same two calls, read `bypass_actors`/`bypass_pull_request_allowances` from either response:
     ```
     gh api repos/OWNER/REPO/branches/BRANCH/protection
     gh api repos/OWNER/REPO/rulesets
     ```
     A `403` here with a body like `"Upgrade to GitHub Pro or make this repository public"` is not a missing setting — see **`blocked-by-plan`** below, a distinct finding from both `missing` and an auth-type `blocked`.
   - entry-point templates, one call per file, content compared against this skill's `references/templates/`:
     ```
     gh api repos/OWNER/REPO/contents/.github/ISSUE_TEMPLATE/task.yml
     gh api repos/OWNER/REPO/contents/.github/ISSUE_TEMPLATE/decision.yml
     gh api repos/OWNER/REPO/contents/.github/ISSUE_TEMPLATE/needs-input.yml
     gh api repos/OWNER/REPO/contents/.github/ISSUE_TEMPLATE/tell.yml
     gh api repos/OWNER/REPO/contents/.github/ISSUE_TEMPLATE/config.yml
     gh api repos/OWNER/REPO/contents/.github/pull_request_template.md
     ```
     `config.yml` must set `blank_issues_enabled: false`. For `.github/DISCUSSION_TEMPLATE/*.yml`, compare filenames against the live `discussionCategories` slugs already fetched above — a category form's filename must equal that category's actual slug or GitHub silently never serves it. This skill's `references/templates/` ships only `q-a.yml` now (ADR-100 retired the Announcement object, so `announcements.yml` is gone — a `tell.yml` Issue Form is its replacement, not a Discussion category form), matching GitHub's own default slug for the Q&A category; a repository that renamed the category, or never enabled Q&A, needs a different filename or no file at all. A `DISCUSSION_TEMPLATE` filename with no matching live slug is self-reported as `inert (slug mismatch)`, never as `ready` — GitHub renders no error for it, so this is the only signal that it's dead weight.
   - the four Relay labels exist on the repository (`fyi`, `needs-input`, `awaiting-acceptance`, `awaiting-record`):
     ```
     gh label list --json name
     ```
     A missing label is `missing`, not `blocked` — `launch` can create it directly.
   - the `decisions/` formal-memory scaffold: the directory exists, `decisions/README.md` states it is the index (id · title · status · date, newest first, regenerated — never hand-edited) and names the frontmatter spec (`id · status: active|superseded · superseded-by · source · settled-by · date`, `settle/SKILL.md`'s Decision file format). Its absence is `missing`, not a blocker — a repository with no Decisions yet still works, `launch` just cannot confirm the scaffold is ready for the first one.
3. **Report audit-only findings.** Separate `ready`, `missing`, `inert (slug mismatch)`, `blocked-by-plan`, `blocked`, and `cannot verify`. Audit mode writes nothing.
   - `missing` — the setting or file is absent, and a `launch` mutation *can* create it (a template file, a repository setting the viewer's permission level can change).
   - `inert (slug mismatch)` — the file exists but GitHub will never serve it (see above); the fix is renaming or removing the file, not writing a new one.
   - `blocked-by-plan` — the feature is structurally unreachable on the repository's current GitHub plan/visibility tier, evidenced by the platform's own error (e.g. branch-protection/rulesets APIs returning `403 Upgrade to GitHub Pro or make this repository public` on a private free-plan repo). No mutation `launch` could ever write fixes this. Report the exact platform message verbatim, name the only two unblock paths that exist (upgrade the plan, or change repository visibility), and note plainly that the repository owner's own policy may rule either out — that is their call, not `launch`'s. The mutation plan in step 4 must **exclude** any item found `blocked-by-plan`, never propose it as if it were `missing`.
   - `blocked` — reserved for auth/permission-type blockers (missing scope, insufficient admin access) where a *different* credential could unblock it.
4. **Gate mutations.** Show the exact settings/files/API mutations and their effect, for every `ready`-adjacent `missing` or `inert` finding only — never for anything found `blocked-by-plan`. Wait for explicit approval before changing anything. Missing or divergent entry-point templates are part of this plan: copy the file from `references/templates/` verbatim (or show the diff, if it already exists but drifted), and show its full contents before writing — same write-gate as any other mutation here. A missing Relay label (`fyi`, `needs-input`, `awaiting-acceptance`, `awaiting-record`) and a missing `decisions/` scaffold (directory + `README.md` stating the index shape and the frontmatter spec) are the same kind of mutation: show the exact label/file to create before writing it.
5. **Apply and read back.** Use GitHub primitives or a normal protected PR for repository files. Re-query every setting with the same commands from step 2. A write response without matching read-back state is failure. For templates, read the committed file content back and confirm it matches what was shown.

## Completion

Done means the real repository state satisfies the contract. Return the repository URL, verified settings, remaining blockers (auth-type `blocked` and structural `blocked-by-plan` reported separately, the latter with its named unblock paths), and any manual-only step.

## Discipline

- Do not create a parallel Relay database, roster, frontmatter schema, or separate content repository.
- Do not weaken existing protection to make setup easier.
- Do not claim a reviewer/approval gate works unless the ruleset and bypass state were read back.
- Repository mutations are always shown before execution.

## Entry-point templates

`launch` installs and audits GitHub's own Issue Forms and Discussion category forms (`references/templates/`) so organic traffic — a human opening an Issue or Discussion directly, never through `/relay:report` — is nudged toward the same explicit-owner rule `report` enforces at the router. Under the Accord memory model (ADR-100) the Issue Forms are `task.yml`, `decision.yml`, `needs-input.yml` (Question / Done when / After reply), and `tell.yml` (What to take note of / Owner-to-assign) — `tell.yml` is the standalone-receipt shape that replaces the retired Announcement object. Templates are a **convention, not a contract**: the digest reducer never reads a template's fields, and a repository without them still works with Relay exactly as before — `launch` self-reports their absence as a `missing` finding, never a blocker. See ADR-094, ADR-100.

Discussion category **slugs are per-repository**, derived by GitHub from each category's name at creation time, and repositories rename, add, or remove categories independently. The only reference Discussion filename is `q-a.yml` (the Announcement/`announcements.yml` form retired with ADR-100), which assumes GitHub's own default category name ("Q&A") — adapt the filename to the repository's actual live slug at install time, never assume the default matches. GitHub serves a category form only when the filename equals a real slug; a mismatch is not an error, just silent non-delivery, which is why the audit step reads live slugs and reports a mismatched file as `inert (slug mismatch)` rather than letting it read as `ready`.

These forms bind GitHub's **web-UI creation path only**: creation through the CLI or API — including a human typing `gh issue create` themselves, not only an agent — gets zero nudge from any of this, the same way `blank_issues_enabled: false` locks nobody on a repository where every collaborator already holds Write or above (the "Maintainers only" blank-issue option remains available to exactly that population). The layer is a default-path prompt for the common case, not a gate against any determined bypass — which is precisely what keeps it a convention rather than a contract.

## Companion skills

- `/relay:report` creates the first collaboration object.
- `/relay:digest` checks the resulting obligations.
- `/relay:migrate` is the explicit legacy bridge, not setup.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead with the result; put technical details after it.

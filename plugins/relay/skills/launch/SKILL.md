---
name: launch
description: "Create a new project in a relay coordination repo, or add a person / assign a role to an existing one. Branch 1 (create): scaffold project.yml · thoughts/ · decisions/, bootstrapping the repo's relay.yml roster on first run — fires on \"launch a relay project\" or \"start a relay repo\". Branch 2 (people): record identity (name · git email · github · title) in the roster + a per-project role — fires on \"register a person in relay\" or \"onboard X\". Structure verb; to post updates use /relay:report. Writes files, gated by a diff."
---

# launch — create a relay project, or add a person to one

Bring a new **coordination project** into existence, or grow an existing one's **membership**: two branches of the same structural verb — `launch` makes the room and populates it; `report`/`review`/`digest`/`settle` are what happens inside it.

## Scope

Operates on the **content repo** — a *separate* coordination repo (located via `$RELAY_REPO`, else a cached prior resolution, else **ask where it should live** — never assume cwd, which is usually some other project). On the very first run in an empty repo it also **bootstraps** the repo (creates `relay.yml` with the running user as the first person). Writes files; shows a diff and is gated before applying.

## Which branch?

- **"start a project / launch relay / scaffold a workspace"** → Branch A, Create a project.
- **"add a person / register X / onboard X / assign a role"** → Branch B, Add a person or role.

Both share Step 1 (locate/bootstrap the repo); pick up the matching step after that.

## Process

### Step 1 — Locate or bootstrap the repo (both branches)
- **Resolve the content repo**: `$RELAY_REPO` if set, else the cached path at `~/.cache/relay/repo-path` if it still points at a real relay repo, else the current dir if it has `relay.yml`, else **ask the user where the relay repo is / should live** — do NOT assume the current dir (it's usually another project). Whichever way it's resolved (or just bootstrapped), cache it to `~/.cache/relay/repo-path` for next time (see `CLAUDE.md` → *Locating the content repo*).
- Find `relay.yml` there. **If absent**, this is first-run: resolve who's running (git author email/name), create a minimal `relay.yml` registering them (handle seeded from their github; record their git email as the resolver), and note more people are added later via Branch B below.

### Branch A — Create a project

#### Step A2 — Name + frame the project (rule: below 90% → ask)
- Ask the **project name** (a slug, e.g. `billing`) and, optionally, its **frame** (one-line mission / scope). A project is a workspace for people to coordinate; the frame is light and rarely changes.

#### Step A3 — Scaffold (gated)
Create under `projects/<name>/`:
```
project.yml         # members: { <you>: owner }   — you are the first owner
thoughts/           # (empty) live drafts land here (report + review)
decisions/log.md    # seed header "# <name> — decision log (append-only)"; settle APPENDS agreed decisions
decisions/active.md # seed "# <name> — decisions in force  _(none yet)_"; settle regenerates it
core/<name>.md      # optional — the frame, if given
```
No `index.md` and no `archive/` — progress and "open vs settled" are `digest`'s live (computed) job; decisions live in `decisions/`; thoughts are **never moved** (`thoughts/` is the immutable log). See [ADR-054](docs/adr/054-relay-decision-ledger.md).
`project.yml` shape: `members:` mapping `<handle>: <role>` (a role may be a single token or a **list** — `[owner, developer]` — for a member who holds several; consumers read it list-aware). **Show the diff. Wait for OK**, then commit + push.

#### Step A4 — Report
Summarize: project created, you registered as owner, next steps (add people via this same skill's Branch B · `/relay:report` to post the first update).

### Branch B — Add a person or role

Add a person to the relay's **structure**: who they are (global roster) and what they are on a project (role).

#### The two layers (don't conflate)
- **Identity → global `relay.yml`** (one source, stable across projects): name · git · github · optional title.
- **Role → per-project `project.yml`** (functional, may differ per project): owner / reviewer / developer / …

#### Step B2 — Gather identity
For the person: **name**, **git email** (the resolution key — matches their commit author; may be several), **github account** (display + link), optional **title** (org position, e.g. "CTO" — NOT a role).
- **Handle** = the short id-prefix + `@`-routing token. **Default it from the github account**, then it is frozen (a github rename never breaks it). Offer a shorter alias.

#### Step B3 — Write the roster (gated)
Add to `relay.yml`:
```yaml
people:
  <handle>:
    name: <name>
    git: <email>        # resolution key — NOT the github handle (commits carry email)
    github: <account>
    title: <title>      # optional
```

#### Step B4 — Assign a role (if registering into a project)
Add to `projects/<project>/project.yml`:
```yaml
members:
  <handle>: <role>             # one role
  <handle2>: [<role>, <role>]  # or several — a member may hold multiple roles
```
Role is a **descriptive default, not a lock** — it sets routing defaults (e.g. `@owner`), never gates who may act. A member may hold **one role or a list** (e.g. `[owner, developer]`); role-consumers read it list-aware — `settle`'s owner-check is `owner ∈ roles`, and `@role` routing matches if the role is in the list. **Show the diff. Wait for OK**, then commit + push.

## Discipline
- **Gate before writing.** Scaffolding or roster edits mutate the repo; show the diff first.
- **Don't invent members.** A fresh project seeds only *you* as owner; others come via Branch B.
- **Registering is shared metadata, not a permission grant** — anyone may register anyone; it gates nothing (roles are defaults; only `settle` is owner-gated). So "should they register themselves, or may I do it for them?" → either; do it for them freely. The one input that must come *from the person* is their **git resolver email** (must match their commit author, or resolution silently fails) — a shared inbox (`hello@…`) collides across people and is a poor key.
- **Identity once, role per project** — never re-type identity into `project.yml`; the handle links the two layers.
- **`git` is the resolver, `github` is display** — git commits carry email, not the github handle.
- **Handle is frozen** — seed from github, then independent (ids depend on it; it must not follow a github rename).
- **Pull before, push after** (git protocol). Direct to `main`.
- **A project is its members coordinating** — keep `core/` light; it is not a campaign (no `position`-style ceremony).

## Anti-patterns (refuse these)
| Temptation | Instead — and the tell |
|---|---|
| Scaffold without showing the diff | Gate the scaffold behind a diff first — it mutates the repo. Tell: about to create `project.yml` / `thoughts/` / `decisions/` before the user has seen what will land. |
| Pre-create empty roles / fake members | Seed only the owner (you); add people via Branch B as they actually join. Tell: the roster lists a name for a person who hasn't been registered yet. |
| Build a heavy `core/` charter up front | Keep the frame light — over-framing is `position`-ceremony relay doesn't have. Tell: about to write a multi-section constitution doc before a single thought has been posted. |
| Put a job title where a role goes | Keep `title` (global identity) separate from `role` (per-project) — different axes. Tell: the value going into `role` reads like a résumé line, not a project responsibility. |
| Use the github handle as the resolver | Resolve by git commit email/name — github handles aren't what commits carry. Tell: about to key a person lookup off their github username instead of their git identity. |
| Make the role gate actions | Treat roles as defaults, not locks — anyone may act except `settle`, which stays owner-only. Tell: about to block someone from posting because their role isn't the "right" one. |

## Companion skills
- **`/relay:report`** — post the first update into the new project, or after adding people.
- **`/relay:review`** — what registered people then do.
- **`/nav:compose`** — discipline for any prose you write into `core/`.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.

---
name: register
description: "Register a person into a relay coordination repo — record identity (name · git email · github · title) in the global roster and a per-project role. Fires on \"register a person in relay\" or \"onboard X\". Structure verb; to create the project itself use /relay:launch. Writes files, gated by a diff."
---

# register — enrol a person + assign a role

Add a person to the relay's **structure**: who they are (global roster) and what they are on a project (role). The membership counterpart to `launch` (which makes the project).

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else a cached prior resolution, else the current dir if it has `relay.yml`, else **ask the user** and cache the answer (never assume cwd; see CLAUDE.md). Writes two layers; shows a diff and is gated.

## The two layers (don't conflate)
- **Identity → global `relay.yml`** (one source, stable across projects): name · git · github · optional title.
- **Role → per-project `project.yml`** (functional, may differ per project): owner / reviewer / developer / …

## Process

### Step 1 — Gather identity
For the person: **name**, **git email** (the resolution key — matches their commit author; may be several), **github account** (display + link), optional **title** (org position, e.g. "CTO" — NOT a role).
- **Handle** = the short id-prefix + `@`-routing token. **Default it from the github account**, then it is frozen (a github rename never breaks it). Offer a shorter alias.

### Step 2 — Write the roster (gated)
Add to `relay.yml`:
```yaml
people:
  <handle>:
    name: <name>
    git: <email>        # resolution key — NOT the github handle (commits carry email)
    github: <account>
    title: <title>      # optional
```

### Step 3 — Assign a role (if registering into a project)
Add to `projects/<project>/project.yml`:
```yaml
members:
  <handle>: <role>             # one role
  <handle2>: [<role>, <role>]  # or several — a member may hold multiple roles
```
Role is a **descriptive default, not a lock** — it sets routing defaults (e.g. `@owner`), never gates who may act. A member may hold **one role or a list** (e.g. `[owner, developer]`); role-consumers read it list-aware — `settle`'s owner-check is `owner ∈ roles`, and `@role` routing matches if the role is in the list. **Show the diff. Wait for OK**, then commit + push.

## Discipline
- **Registering is shared metadata, not a permission grant** — anyone may register anyone; it gates nothing (roles are defaults; only `settle` is owner-gated). So "should they register themselves, or may I do it for them?" → either; do it for them freely. The one input that must come *from the person* is their **git resolver email** (must match their commit author, or resolution silently fails) — a shared inbox (`hello@…`) collides across people and is a poor key.
- **Identity once, role per project** — never re-type identity into `project.yml`; the handle links the two layers.
- **`git` is the resolver, `github` is display** — git commits carry email, not the github handle.
- **Handle is frozen** — seed from github, then independent (ids depend on it; it must not follow a github rename).
- **Gate before writing; pull before, push after.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Put a job title where a role goes | `title` is global identity; `role` is per-project — different axes |
| Use the github handle as the resolver | git commits carry email/name, not github — resolution would fail |
| Make the role gate actions | Roles are defaults, not locks; anyone may act (except `settle` = owner) |

## Companion skills
- **`/relay:launch`** — create the project before registering people into it.
- **`/relay:report`** / **`/relay:review`** — what registered people then do.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.

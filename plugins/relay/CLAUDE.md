# relay — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.
> Design rationale (why each decision, the holes found + resolved) lives in [`docs/design/relay.md`](docs/design/relay.md); this file owns the **operative contract** the skills cite. The landing ADR is [ADR-050](docs/adr/050-relay-plugin.md).

## What this plugin is

A toolkit for **coordinating with a counterpart asynchronously, through your agents**, over a **shared git repo** — not your own work (`manage`) or your code (`nav`). You and others stay in sync **without live conversation**: each side's agent distills work into a structured artifact, the other's agent reads + responds, and the loop converges decisions to **explicit consensus** — all git-diffable, human-gated, zero chat. Descends from `manage:observe` (structured artifact + git transport + human gate) but is **two-way · recurring · threaded · multi-party**.

**Six verbs, split structure vs content:**

| verb | does | layer |
|---|---|---|
| `launch` | create a project (scaffold the space + its frame) | structure |
| `register` | enroll a person (name · git · github · title) + assign a per-project role | structure |
| `report` | write a standup-shaped update | content |
| `reply` | respond to an item — accept / clear / counter (the accept that completes a [D]'s `@`-set graduates it) | content |
| `digest` | the live, per-viewer "what needs you" (read-only) | content |
| `settle` | owner-only periodic hygiene (archive · prune · refresh `index.md`) | content |

## Two-repo split (load-bearing)

- **Tool repo** = this marketplace (the `relay` plugin) — the protocol, universal.
- **Content repo** = the org's actual relay repo — the real data (people, projects, reports, decisions). One company = one content repo, many projects.

**Locating the content repo (every skill's first step).** The content repo is a **separate** repo (the coordination repo) — it is **almost never the current working directory** (you're usually in some other project). Resolve it in order, and **never silently assume cwd**:

1. **`$RELAY_REPO`** env var, if set (mirrors manage's `$SKILLS_REPO`) — the default content repo.
2. else the **current dir**, only if it actually has a `relay.yml` at its root (you're already inside a relay repo).
3. else **ASK the user** for the content-repo path — or offer `/relay:launch` to create one.

Then read its `relay.yml` first; never hard-code paths.

## The three axes (never tangle them)

- **Identity** (who you are) → global `relay.yml`; one source; **auto-resolved** (running git author email → a person's `git:` field). Carries name · git · github · optional title.
- **Role** (owner / developer / reviewer) → per-project `project.yml`; **descriptive defaults, not locks**; optional.
- **Action** (any verb) → anyone may do any action; not gated by identity or role (except `settle`, which is **owner-only** for low-concurrency).

`title` (org position, e.g. "CTO") is identity-level + global; `role` is per-project + functional — keep them apart.

## Consensus (the core mechanic)

- **Explicit accept, never inferred** — a presence check (like a GitHub PR *Approve*), not judging the discussion mood. **Silence ≠ consent.**
- **Who counts = the `@`-set, unanimously.** A [D]'s `@`-list **is** its approver set (proposer-set, extendable in-thread); it graduates the moment **every currently-`@`-ed person has left an explicit accept**. The proposer sets the bar by who they `@` (few = fast, many = broad).
- **Graduation is event-driven** — the accept that completes the `@`-set writes `decisions/<id>.md` *in that same `reply` commit*. No `settle` needed for it; conflict-free (one new file per decision).
- **Revoke = supersede** — overriding a ratified decision is itself a consensus act (a new [D] through the gate); the old file flips `status: superseded`.
- **Authenticity** — a git author is spoofable, so baseline defense is **a private repo + the stated assumption colleagues don't forge each other**; **signed-commit accepts** are opt-in hardening (host-agnostic; GitHub's *Verified* badge is just a view). Not coupled to GitHub's API.

## Git protocol (canonical — skills restate the reflex inline)

Paired with the append-only / shared-repo model. Each skill restates the lines it needs (self-contained at runtime); this is the owner.

- **Pull before you act** (read or write) — get everyone's latest.
- **Append-only** — write your OWN dated file (`thoughts/<date>-<handle>.md`); **never edit someone else's entry** → conflict-free. (`decisions/<id>.md` is also append-new — one file per decision.)
- **Commit + push after writing** — so others' agents can pull it.
- **Gate before commit** — show the user first (the marketplace-wide write-gate).
- **Shared-mutable files** (`index.md`, a superseded decision's `status`) are touched only by deliberate verbs (`settle`, supersede), and are regenerable.
- **Conflicts** (rare, only on shared files) → **regenerate via `settle`, don't hand-merge.**
- Direct to `main`, no PR ceremony (it's a coordination repo).

## Format contract (canonical — the shared shapes all six verbs read/write)

The **single owner** of the file formats. A skill that reads or writes one of these restates the shape it touches; change a shape → update it here + every skill that touches it, in the same commit.

**`relay.yml`** (content-repo root — global roster):
```yaml
people:
  <handle>:               # frozen relay handle — id prefix + @routing; seeded from github at register
    name: <display name>
    git: <email>          # resolution key (running git author email → this person; may be a list)
    github: <account>     # display + link + handle seed (NOT the resolver)
    title: <org position> # optional — NOT a per-project role
```

**`projects/<name>/project.yml`** (per-project membership):
```yaml
members:
  <handle>: <role>        # owner | reviewer | developer | … (descriptive default, not a lock)
```

**`thoughts/<date>-<handle>.md`** (append-only; a report OR a reply):
```markdown
---
date: <ISO>
by: <handle>
---
## Needs-decision
- [<handle>-<slug>] @<who> [@<who2>…] — <one-line, lead with the point>
## Blocked-on
- [<handle>-<slug>] @<who> — <what's blocking, since when>
## Done
- <visibility only, no id needed>
## Replies          # a reply entry uses this section
- re [<id>]: **accept** — <why>          # accept / reject / clear / counter
- re [<id>]: cleared — <how>
```
- **id = `<handle>-<slug>`**, author-namespaced (collision-free without a central allocator); type is given by the bucket, **never in the id**; the id is permanent (threads cycles, carries into `decisions/`).

**`decisions/<id>.md`** (one file per ratified decision; written by the completing `reply`):
```markdown
---
id: <handle>-<slug>
status: active            # active | superseded
decided: <ISO>
proposed-by: <handle>
accepted-by: [<handle>, …]   # the full @-set that accepted
supersedes: —            # or <id>
from: thoughts/<file>    # back-link to the originating thread
---
# <decision, distilled>

<rationale, written to /nav:compose discipline — lead with the point, link don't restate>
```

**`index.md`** (content-repo or per-project — shared snapshot, written ONLY by `settle`):
```markdown
# <project> — current state (snapshot @ <date>, settle by <handle>)
## Open
- [<id>] <one-line> — @<who>
## Recent decisions
- [<id>] <decision> — accepted by <who> (<date>)
```
- `digest`'s live per-viewer view is **computed, not this file** — `index.md` may lag; `digest` is the authoritative current view.

## Awareness

**In-band**: an agent **auto-pulls + runs `digest` when opened**, surfacing "what's waiting on you". No external infra. Known limit (accepted): reaches only people who show up. Out-of-band (cron / notification) is an optional adapter later, not v1.

## Conventions

relay docs (reports, decisions, `index.md`) are authored to **`/nav:compose`** discipline (lead with the point, one fact one owner, right grain). Repo-wide authoring + maintenance rules (naming, skills-root-relative paths, frontmatter, the gates) live in the repo-root [`CLAUDE.md`](CLAUDE.md).

## Helper scripts (ADR-051)

relay is a structured-data protocol, so unlike the analysis plugins it **bundles helper scripts** for its deterministic / correctness-critical work, split from the LLM's judgment work:

- **Code (a bundled `scripts/` in the owning skill)** — mechanical + correctness-critical: set-comparison, structured parsing, signature checks.
- **The LLM (SKILL.md prose)** — judgment: distilling a report into buckets, writing a decision's rationale.

**Language by task:** parsing / set-logic → **node (`.mjs`)** (bash parses structured text fragilely; a fragile gate is the wrong risk); git / verification → **bash** (it's git commands).

**node is a fast-path, not a hard dependency** — it runs in the *agent's* environment (Claude Code / Cursor / Codex hosts almost always have it), **not** the coordinated project's toolchain (so "any async project" holds). When node is absent, the skill **degrades to a precise SKILL.md recipe** — the script raises reliability where node exists, it never gates the skill (ADR-051).

**Bundling constraint:** the Codex/Cursor mirror copies each skill's `scripts/` **independently** — no shared-across-skills location. So a helper used by one skill lives in that skill's `scripts/` (single owner); trivial cross-skill logic (identity resolution = `git config user.email` + a roster lookup) stays a **SKILL.md recipe**, not a 4×-duplicated script.

Current: **`skills/reply/scripts/check-acceptance.mjs`** — the consensus gate (computes which decisions have a complete `@`-set, so graduation is exact not inferred). Next batch (sanctioned, not built): signature/github verification (bash), digest/settle state computation (node).

## Where things live

```
.claude-plugin/plugin.json   → relay's manifest (version + metadata owner)
CLAUDE.md                    → ← you are here (identity · protocol · format contract)
skills/<name>/SKILL.md       → the six skills, each self-contained
```

The **content repo** layout (`relay.yml`, `projects/<name>/…`) is the format contract above — it lives in the user's coordination repo, not here.

## When editing this plugin

- **Changing the git protocol or a file format**: update it here (the owner) **and** every `SKILL.md` that restates it, in the **same commit** (stale restatement = a lie). Write an ADR if the contract changes materially.
- **New skill / rename**: follow the repo-root [`CLAUDE.md`](CLAUDE.md) gates (ADR · version bump · README + site map registration · regenerate manifests + codex · validator green).

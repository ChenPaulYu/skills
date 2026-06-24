# relay — design draft (async, agent-mediated coordination between people)

> **Status: DRAFT** · started 2026-06-23. A working capture of design decisions, not a ratified ADR. When relay is built, the decisions here graduate into a proper ADR + the plugin; until then this is the single place the design lives (so it survives `/clear`).
>
> **TL;DR** — A new marketplace plugin: people coordinate **asynchronously through their agents** over a **shared git repo**. You write structured updates; the other side's agent reads and responds; decisions reach **explicit consensus**; threads continue across cycles. Designed for **multi-person**, first tested with 1 project / 2 people. Six verbs: `launch · register · report · reply · digest · settle`.

## What relay is

The object is **a coordination channel with a counterpart**, not your own work (that's `manage`) or your code (that's `nav`). You and others stay in sync **without live conversation**: each side's agent distills work into a structured artifact, the other's agent reads + responds, and the loop converges decisions to consensus — all git-diffable, human-gated, zero chat.

Descends from `manage:observe` (structured artifact + git transport + human gate) but adds **two-way + recurring + threaded + multi-party**.

## Two-repo split (the load-bearing separation)

- **Tool repo** = this marketplace (the `relay` plugin) — the **protocol**, universal, ships nothing company-specific.
- **Content repo** = the org's actual relay repo — the **real data** (people, projects, reports, decisions). One company = one content repo, possibly many projects.

Test: *"would it be the same at another company?"* — same → tool; differs → content.

## Content-repo layout

```
relay-repo/
  relay.yml              # global roster: who the people are (identity — single source)
  projects/
    <project>/
      project.yml        # members + roles for THIS project
      core/              # the project's stable frame (mission / scope / rules) — light, rarely changes
      decisions/         # one file per ratified decision (a FOLDER, not one big file)
      thoughts/          # append-only, per-author, dated entries (reports + replies)
      archive/           # closed threads moved out of the hot path
      index.md           # SHARED current-state snapshot — written by settle, for glance/onboarding (derived; may lag, digest is the live authoritative view)
```

## Three orthogonal axes (don't tangle them)

- **Identity** (who you are) → global `relay.yml`; one source; auto-attributed (git user → roster). Carries **name · github account · (optional) title**. Never hand-typed per write.
- **Role** (owner / developer / reviewer) → per-project `project.yml`; **descriptive defaults, not locks**; optional (a flat project needn't fill them).
- **Action** (report / reply / …) → anyone can do any action; not tied to identity or role.

A role is the default position of the steering wheel, never a locked door. **Keep `title` and `role` apart — different axes:** `title` (org position, e.g. "CTO") is identity-level and global (a person is "CTO" everywhere); `role` (owner/dev/reviewer) is per-project and functional (the same person may be "developer" on one project, "owner" on another).

```yaml
# relay.yml — global roster (identity; one source)
people:
  paul:                    # frozen relay handle — id prefix + @routing (@paul); seeded from github at register, then independent
    name: Paul Chen
    git:    paul@rytho.ai  # resolution key — the agent matches the running git author (email; may be a list) → this person
    github: ChenPaulYu     # display + GitHub link + the seed for the handle (NOT the resolver: git commits carry email, not the github handle)
    title: Founder         # optional — org position, NOT a per-project role
  cto:
    name: ...
    git:    ...
    github: ...
    title: CTO

# projects/<name>/project.yml — per-project membership (role; functional)
members:
  paul: owner
  cto:  reviewer
```

`register` writes **both layers**: a person into `relay.yml` (handle · name · git · github · optional title), and into a project's `project.yml` with a role. **Identity resolution** matches the running **git author (email)** against each person's `git:` field — *not* the github handle (git commits don't carry it); `@`-routing uses the frozen **handle** (`@paul`), seeded from github at register then frozen (a github rename never breaks ids).

## The item model

A report is **standup-shaped**, every item carries a **stable id** + an **`@who`** (who it's on), threaded across cycles by id. The item **type** decides how it closes:

| bucket | how it closes |
|---|---|
| **needs-decision [D]** | explicit **accept** → graduates to `decisions/` (3 outcomes: accept→graduate · no reply→stays open, discussed, nudged · reject→archive or a new [D]) |
| **blocked-on [B]** | the blocker is **cleared** → archive (no approval) |
| **done / FYI** | visibility only; sinks next cycle |

`@who` is universal (every actionable item points at a person); **approval belongs only to [D]**.

### Item ids — author-namespaced (collision-free without a central allocator)

An id is `<handle>-<slug>` (e.g. `paul-redis-cache`, `cto-staging-db`). **Author-namespaced**: each person allocates only within their own handle-prefix, so two people writing offline never collide — there is no central counter to coordinate (the whole point of append-only). The slug (from the item's gist) makes references self-describing (`re paul-redis-cache: ship it`).

- **Type is not in the id** — it's given by the bucket the item sits under (`## Needs-decision`); no double-encoding.
- **The id is permanent** — it threads across cycles, carries into `decisions/<id>.md` on graduation, and anchors supersede chains. So it uses the **frozen handle**, never the live github account.
- **Residual edge**: one person on two offline devices could mint `paul-redis-cache` twice — rare, same-person, and `settle` dedups (`-2`). The multi-person hazard is gone.

## Consensus (the hard part, made simple)

- **Explicit accept, never inferred** — a presence check (like a GitHub PR *Approve*), not the agent judging the discussion mood.
- **Silence ≠ consent** — nothing graduates without an affirmative act.
- **Who counts = the `@`-set, unanimously.** A [D]'s `@`-list **is** its approver set (set by the proposer, extendable in-thread); it graduates when **every currently-`@`-ed person has left an explicit accept**. The proposer sets the bar by who they `@` — few = a fast call, many = broad buy-in; **no separate config needed**. One reject → not unanimous → stays open (a revise/abandon signal); silence → stays open + nudge. (`@`-self only = a logged personal decision, not consensus.) Optional later (not v1): a `project.yml` policy that auto-adds `@owner` to every [D], or a quorum rule.
- **Revoke = supersede** — overriding a ratified decision is itself a consensus act: a NEW decision that must pass the accept gate; the old file flips `status: superseded`. A consensus decision stays in force until another consensus replaces it (no silent / unilateral reversal).
- **Authenticity** — a plain git author string is spoofable (`git config user.name boss`), so a bare accept could be forged. **Baseline: a private repo** (removes outsiders) + the *explicit, written* assumption that **colleagues don't forge each other**. **Optional hardening: signed-commit accepts** — git-native (works on any host; on GitHub it shows as the *Verified* badge), checked against the decider's registered signing key. Opt-in, not v1. Authenticity is **not** coupled to GitHub's API — commit *signing* is the host-agnostic mechanism; the GitHub badge is merely a view of it.

## The verb roster (6) — structure vs content

| verb | does | layer |
|---|---|---|
| **launch** | create a project (scaffold the space + define its frame) | structure |
| **register** | register a person — name · github · optional title (→ roster) — and assign a per-project role | structure |
| **report** | write a structured update (borrows the standup skeleton) | content |
| **reply** | respond to an item — **accept** (the accept that *completes the [D]'s `@`-set* graduates it to `decisions/` right then, event-driven & conflict-free) / clear a blocker / counter | content |
| **digest** | compute the per-viewer **live** view ("what needs you") — read-only, recomputed from source, writes nothing | content |
| **settle** | **owner-only**, periodic *non-critical* hygiene: archive closed threads, prune, refresh `index.md` (graduation already happened at accept — lag here is harmless, and a race just re-runs) | content |

Deliberately **no `position`** (relay's canon = `decisions/`, authored by the consensus pipeline itself, not a campaign) and **no `init`** (`launch` owns structure creation). The roster is relay's own — *not* a clone of shape's.

## Storage decisions

- **git-native markdown, NOT GitHub Issues.** Issues live in GitHub's DB (a `git clone` doesn't bring them) → lock-in + breaks "works on any async project." GitHub is at most an **optional surface later**, never the foundation.
- **Single owner + computed views.** `thoughts/` (append-only entries) is the source of truth; `index.md` and the current-decisions view are **computed / regenerable**, never the owner. (Same law that killed the Issues idea and forbids copying a volatile list.)
- **Two cadences**: append is cheap + frequent (`report`/`reply`); `settle` is deliberate + gated. Mirrors shape's `align`/`reconcile` and nav's `sync`/`map` split.

## Awareness (decided: in-band)

Async coordination only sustains if **attention gets directed**, or it silently rots. Decision: **in-band** — the agent **auto-pulls + runs `digest` when you open it**, surfacing "what's waiting on you." No external infra; rides on "you interact through the agent anyway," and stays git-native.

- **Out-of-band** (cron / notification that pings you when you're away) = an **optional adapter later**, not v1 (like the GitHub surface).
- **Known limit (written down, not hidden):** in-band only reaches people who **show up**; it does nothing for the long-absent. That's the gap out-of-band fills later.

## Git protocol (relay-specific transport)

Paired with the append-only / shared-repo model:

- **Pull before you act** (read or write) — get everyone's latest.
- **Append-only** — write your OWN dated file (`thoughts/<date>-<who>.md`); never edit someone else's entry → conflict-free.
- **Commit + push after writing** — so others' agents can pull it.
- **Gate before commit** — show the user first (the marketplace-wide write-gate).
- **Shared-mutable files** (`index.md`, `decisions/`) are touched only by deliberate verbs (`digest`/`settle`), and are regenerable.
- **Conflicts** (rare, only on shared files) → **regenerate via `digest`/`settle`, don't hand-merge.**
- Direct to `main`, no PR ceremony (it's a coordination repo; branch model is the content repo's call).

**Where it lives:** owned in `plugins/relay/CLAUDE.md` ("Git protocol" section) as the canonical copy; the short reflex is **restated inline in each skill** (self-contained at runtime, like nav's 8 rules); bulky edge-cases → `references/git-protocol.md`.

## Multi-person design points (build for N even though the test is 2)

Designed in from day one (a 2-person version would shortcut these and break at N):

1. **Routing** — every item carries `@who`; `digest` filters per viewer (not "report → the counterpart").
2. **Identity** — the agent resolves *who is running* (git user → roster) to attribute + filter "@me".
3. **Consensus** — the accept gate supports a "who counts" policy (default the `@`-decider; configurable).
4. **Visibility** — distinguish broadcast FYI vs directed `@someone`.
5. **Conflict-free** — append-only per-author files is essential, not optional, once many write at once.

## Relation to other plugins

- **nav** — a structural *echo*, not a dependency: `index.md` ≈ `nav:map` (computed top-down view); `settle`'s hygiene ≈ `nav:sync`/reconcile; the append/settle cadence ≈ sync/map. Same "keep an accreting repo navigable" world-view, **different object** (people-coordination vs code) → separate plugin, own vocabulary (`index`, not `map`).
- **compose** — relay is a **consumer**: its `report` / decision / `index` docs are authored to `/nav:compose`'s deep-prose discipline. (relay is the "forthcoming relay" cited in ADR-049 as a compose consumer.)
- **manage** — different object: manage reflects on *your own session*; relay hands off to *a counterpart*.
- **shape** — reused the two-tier + graduation idea (`core` / `decisions` / `thoughts`), but **not** the roster, and **no `position`** verb.

## Naming notes

- **Plugin = `relay`** (the channel — "pass the baton between parties across time"); the structure/value is carried by the skills, not the name (same as `nav` not being named "deep-module"). `report` borrows the **standup** mental model for its shape (招牌廣、表單熟).
- No name collides with an existing skill (checked: launch/register/report/reply/digest/settle all clean).

## First test scope

**1 project, 2 people** — but the whole design is planned for multi-person; 2-person just collapses several axes to a single value.

## Design-review scoreboard (holes found 2026-06-23 — all resolved)

A skeptic pass found five holes; each is now handled (resolution lives in the topical section named):

1. **id collision** (sequential ids can't work under append-only / offline / multi-party) → **author-namespaced `handle-slug`**; handle seeded-from-github, then frozen. *(Item ids)*
2. **index.md contradiction** (can't be both a committed shared file and per-viewer) → **`digest` is live / per-viewer / read-only; `index.md` is a shared snapshot written only by `settle`**. *(verb roster · layout)*
3. **identity resolution** (github handle ≠ git author) → **`git:` email is the resolver**; github is display/link only. *(Three axes)*
4. **forgeable accept** (git author string is spoofable) → **private repo + a stated trust baseline**; signed-commit accepts as opt-in hardening (host-agnostic; GitHub's *Verified* badge is just a view). *(Consensus · Authenticity)*
5. **settle has no trigger + concurrency races** → **graduation is event-driven at accept** (conflict-free; the critical part no longer needs settle); **`settle` is owner-only, non-critical hygiene** (lag harmless, race re-runs). *(verb roster)*

## Bloat review (2026-06-23 — via /think:orthogonal + /shape:elicit)

"Is relay bloated?" factors into four independent axes; relay is lean on three, heavy on one:

| axis | relay | bloated? |
|---|---|---|
| surface (verb count) | 6 (vs nav 7, shape 8); clean 2 structure + 4 content | no |
| scope (jobs) | one — async coordination; no roster-clone, no `position` | no, tight |
| per-use ceremony | ~1 verb + pull/gate/push | moderate |
| **conceptual / mechanism load** | 3 axes · @-routing · consensus · supersede · two-repo · format · settle · awareness · git protocol · helper | **heavy** |

**Verdict: relay is concept-heavy but NOT bloated *in use*.** At 2 people the heavy machinery (@-set, routing, multi-approver, soft/hard gates) **collapses to single values and never surfaces** — the felt model is just "I report → they accept → it's recorded." The weight is a *reading-the-design* artifact, not a use cost (an automatic-transmission car: the gearbox is in the engine bay, daily driving never touches it).

**Decision: don't change the mechanism** — keep the generality + cambium-prototype value. If lightening is ever needed, the lever is **presentation** (lead with the simple 2-person path), **not** the mechanism. For now: no change.

## Open / not yet decided

- **The concrete one-cycle file walkthrough** + exact entry/comment/decision file formats (the long-deferred "how `report` actually runs"). Next up.
- **thoughts granularity** (decided): an entry = *one author's one writing-act* (a report or a reply, dated, may cover several items); the per-item thread across entries is **computed**, not stored per-item.
- **Consensus "who counts" default** — leaning `@`-assigned decider; stricter via `project.yml`. To finalize.
- **Out-of-band awareness adapter** — deferred.
- **Plugin scaffolding** (6× SKILL.md, ADR, registration, manifests) — when the design settles.

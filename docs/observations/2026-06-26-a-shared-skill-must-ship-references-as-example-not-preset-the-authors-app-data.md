---
date: 2026-06-26
status: raw
---

# a SHARED skill must ship its opinion/reference layer as an EXAMPLE, never preset the author's concrete app data (ports, private repo names, project list) as defaults — concrete data leaks the author's setup and misleads every downstream fork

> Source: 2026-06-26, while using /shape:setup to scaffold a repo — the port registry shipped the maintainer's real project ports, and the skill's own write-back step had me *append the new project's ports* into that shared, published file.

## What prompted it

shape:setup separates a neutral engine (SKILL.md) from an opinion layer (`references/stack-principles.md` + archetypes) — by design the opinion layer is "the maintainer's, fork your own." But the *shipped* references still carried the maintainer's **concrete app data**: a port registry filled with real project→port rows, named private exemplar repos, the project list. Worse, the skill's **write-back step instructed appending the freshly-scaffolded project's ports into that shared file** — so normal use actively grew the leak. The user (who isn't the only user of the published skill) flagged it: "don't preset any of my app info — others use this too."

## The signal

**"Fork-your-own" framing is not enough if the file still ships *populated* with the author's specifics.** A downstream user who installs the skill inherits the author's ports, repo names, and project list as apparent defaults — noise at best, a privacy/ίmisdirection leak at worst. The distinction that matters:

- **Rulings / shapes** (uv over pip; monorepo layout; the registry's *format*) — generalizable, fine to ship as a worked example, clearly labelled "replace with yours."
- **Concrete app data** (which project uses port 5420; the names of private repos; the list of the author's products) — **never** a shipped default. It's the user's, lives in their fork / their own projects, and the shared skill ships it **empty / abstract**.

The skill-feedback bind (S · P · D):
- **S** = `shape:setup` (its `references/` layer + the write-back / 晉升 step)
- **P** = how references ship, and step-8 write-back (which appended a real project's ports to the shared file)
- **D** = ship the reference layer as **example-only**: the port registry ships **empty** (allocations live in the user's own `dev.config` / fork, never a shipped central list); exemplars are named as **optional grounding you have or don't** (decisions stated abstractly, à la `python-lib.md`'s existing exemplar note); and an explicit **anti-pattern**: "preset the author's app-specific data as a shipped default." Then write-back appends to the *user's* local record, not the published file.

`python-lib.md` already solved half of this (its exemplars are stated abstractly + caveated as private) — the gap was that `stack-principles.md` (the port registry especially) and `fullstack-web.md` hadn't been brought to the same standard, and no anti-pattern guarded against re-leaking.

## Evidence so far

- **Only case (2026-06-26, lutherie setup)**: the shipped port registry held the maintainer's real ports (crate 5417 / trackmate 5420); the write-back step had just appended the new project's pair to that shared file; the user flagged the leak. Fix landed same session: registry ships empty + abstract framing + (this) anti-pattern.

(One case → stays `raw`. Promote if another shared skill is found shipping the author's concrete data as a default — that's the trip-wire to make "example-not-default" a marketplace-wide authoring rule, not just setup's.)

## Links

- Generalizes the discipline already in `references/archetypes/python-lib.md`'s exemplar note (private repos = optional grounding, decisions stated abstractly) to `stack-principles.md` + `fullstack-web.md`.
- Candidate for a marketplace-wide ADR: "a published skill's opinion/reference layer ships as a labelled example; concrete user data is never a shipped default."

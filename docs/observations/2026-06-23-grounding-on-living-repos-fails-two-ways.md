---
date: 2026-06-23
status: raw
---

# Grounding a skill on living private repos is *maintainer-local* truth: negative exemplars rot, positive ones are invisible downstream — so the reference must stand on its own prose

> Source: a `/manage:observe` run after migrating youtube-toolkit flat→src + uv-first, which made `setup`'s `python-lib` archetype cite a repo whose stated flaw no longer existed.

## What prompted it

`setup`'s design razor is *"don't embed file bodies in prose — they drift; ground against the archetype's named **living exemplar**, a real repo that runs."* The `python-lib` archetype follows it: it grounds on three rytho-ai repos, and names **youtube-toolkit as the *negative* exemplar** — "flat layout + legacy lint, what NOT to copy." This session then converted youtube-toolkit **to** src layout + uv-first. The archetype now points at a repo to shame it for a flaw it no longer has. The contrast half-rotted the moment the work shipped.

## The signal

"Ground on the living repo, not the prose" is true **only for the person holding the repos** — the maintainer. It fails two ways for everyone (and eversomething) else, and both trace to one root: *the reference outsourced its truth to a moving, access-gated artifact.*

1. **Negative exemplars rot — structurally, not by accident.** A *positive* exemplar is maintained to stay good (drift pushes it toward still-true). A *negative* exemplar names a flaw — and a flaw is exactly the thing someone eventually **fixes**. Drift pushes a negative exemplar toward **false**. Pointing "don't do X" at a live repo that does X is betting the repo never improves; the better your ecosystem, the worse that bet.
2. **All exemplars are invisible downstream.** A user who installed/forked this skill cannot `clone rytho-ai/packages/tactus` — it's private. The razor tells them "ground the living exemplar"; they *have no exemplar*, only the prose the razor distrusts. For them the skill's stated method is unrunnable, and the fallback is precisely the drift-prone prose.

The shared fix is the same in both directions: **the reference file must carry the decision and the anti-pattern *abstractly*, self-sufficiently.** The named repos are *enrichment to ground against when you can*, not the source of truth. State "src layout always, because it import-isolates the installed package from the repo dir" — a reason that survives any repo changing and needs no clone. When a negative example must cite a real repo, **pin it to a date/commit** ("flat as of <sha>") so a later fix can't silently turn the reference into a lie.

## Why this is sharper than "docs drift"

The razor was *built* to beat drift (exemplars over prose). The trap is that its escape hatch — the living repo — has a **narrower audience and a worse drift gradient** for negative cases than the prose it replaced. It didn't remove the drift; it relocated it to where the maintainer can't see it (a fixed repo) and the downstream user can't reach it (a private repo). A mitigation that moves the failure out of your own view reads as "solved" when it's only displaced.

## Evidence so far

- **Only case (2026-06-23, youtube-toolkit src migration)**: the `python-lib` archetype's youtube-toolkit contrast went stale the instant the migration shipped — caught only because the same session that broke it happened to be reflecting on it. No downstream user was in the loop to hit failure mode 2, but the access asymmetry is structural (the repos are private), not hypothetical.

(One case → `raw`. Trip-wire to promote: a **second** archetype/reference caught citing a living repo for a trait that changed, OR a downstream (non-maintainer) report that a `setup` archetype's exemplars were unreachable. Either would graduate this toward an ADR on *how setup references should ground* — self-sufficient prose + dated/pinned exemplars, repos as enrichment.)

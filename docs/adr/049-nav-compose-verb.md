# ADR 049 — `nav:compose`, the deep-module document verb (deep-prose extracted as a single owner)

**Status**: accepted
**Date**: 2026-06-23
**Refines**: [ADR-029](docs/adr/029-resplit-sync-and-map-by-cadence.md) (sync = per-file headers; compose is its prose-document sibling), [ADR-019](docs/adr/019-sync-collapses-headers-and-map.md)
**Amends**: [ADR-003](docs/adr/003-five-skills-not-four-or-six.md) (nav roster — now seven)

## Context

nav's deep-module discipline already governs **documents**, not just code — the repo-root CLAUDE.md states the 8 rules apply to "the CLAUDE.md docs, the scripts, the manifests, the site map," and `sync` already enforces the convention on **file-top headers**. But that coverage stops at the header line of a *code* file. Nothing owned the **body of a prose document** — an ADR, a design note, an observation, a report, a README, a spec.

So every plugin that writes prose re-derived deep-prose discipline ad hoc: lead with the point, one fact one owner (link don't restate), group by knowledge not chronology, right grain, head-able top. The same rules were being restated (or silently skipped) across `shape`'s `core`/`plan`, `manage:observe`'s observations, `research`'s notes, and the ADRs themselves. That is textbook **information leakage** (rule ①) at the marketplace scale — the same knowledge baked into many places — and the N+1 trigger says: at the second-plus consumer, **extract the primitive**.

The immediate forcing case: a forthcoming `relay` plugin (an async, agent-mediated coordination repo) needs every report / decision / index doc written to deep-module standard. Rather than restate the rules a seventh time inside `relay`, the discipline gets one owner here, and `relay` (like the others) consumes it.

## Decision

**Add `nav:compose` — author or restructure a prose document so it reads as a deep module.** nav goes from six skills to **seven**: `audit` · `refactor` · `sync` · `map` · `plan` · `do` · `compose`.

Its kernel: the 8 rules applied to a document body —
- **Interface-first (rule ②)**: lead with the point; section headings are the interface; the top is `head`-able.
- **One owner, no leakage (rule ①)**: a fact owned by another doc is **linked**, never re-explained.
- **Right grain + knowledge-not-chronology (rule ④)**: group by concern; split a doc that sprawls; "what I did Monday/Tuesday" is temporal decomposition.
- **Rearrange, don't rewrite (rule ⑥)**: restructure mode moves substance **verbatim**; never paraphrase.
- **Navigability is the audit (rule ⑧)**: if you can't write the doc's one-line lead, the *content* isn't decided — route to `/shape:elicit`, don't invent filler.

Two modes — **author** (intent/notes → new doc) and **restructure** (existing draft → the shape) — both diff-gated. `compose` is **atomic, not meta** — it produces one deliverable (a document); it does not get the offer-next-action pattern. It reports and stops, with the standing "don't commit unless asked" discipline.

## Why this is a new verb, not `sync` widened or `audit` extended (the N+1 / right-grain defence)

This repo's razor (rule ④ + the N+1 trigger; the blade that retired `doctor`, [ADR-021](docs/adr/021-retire-nav-doctor.md)) demands a justification for any skill sitting near an existing one. `compose` clears it on three seams:

1. **It crosses `sync`'s artifact seam.** `sync`'s identity is the **header line atop a code file** (the file is code; the header describes it). `compose` owns the **body of a file that *is* prose**. Same 8 rules, different artifact and different scale (one line vs the whole document). Folding the whole-document job into `sync` would over-scope the cheap, continuous, per-change header lint (ADR-029 split them by cadence precisely to keep that job light).
2. **It is itself an N+1 extraction.** Deep-prose discipline was an *inline* thing re-derived across `shape`, `manage`, `research`, and the ADRs. `compose` is the **primitive** those consumers were missing. Far from proliferation, it **reduces** restatement: consumers reference it instead of re-encoding the rules (rule ① at marketplace scale).
3. **It is not `audit`.** `audit` is read-only and assesses **code** shape; `compose` **writes** a document. Auditing prose for deep-module violations is a possible future `audit` extension, deliberately **out of scope** here (see below).

## Relation to the `writing-clearly-and-concisely` skill

`compose` is the **self-sufficient prose-writing door**; `writing-clearly-and-concisely` is an **optional, external reference** (it is not part of this marketplace — it lives in the installed `.agents/skills/`), not a dependency.

`compose` distills the **durable** writing principles inline — the ones that don't age and that an agent most often flubs:
- **Structural** (rules ② / ④, all scales): lead with the point, one topic per section/paragraph, omit needless words.
- **Sentence keystones** (*Sentence-level craft*): active voice, positive form, parallel structure, emphatic word last, be specific / no puffery / no over-formatting.

It deliberately does **not** carry the long-tail, by right grain (the skill stays principles, not a grammar textbook):
- punctuation/grammar minutiae (a modern model handles these);
- the commonly-misused-words catalogue (a rare lookup);
- the **volatile** specific list of AI-prose tells — a copied denylist ages into a lie (the same drift law that keeps the version in one manifest); the *principle* is enough, and the perishable list, if ever wanted, is still in the external skill.

So `compose` **replaces** `writing-clearly-and-concisely` *for everyday writing* without absorbing it: distill the durable keystones, drop the bulky/volatile tail, keep the external skill on the shelf for the occasional deep copyedit. `compose`'s description claims the everyday clarity fire ("make this clearer / tighten this prose") and disclaims only code-header fire (→ `/nav:sync`).

## Consequences

- **nav roster: seven skills.** ADR-003 amended; `plugins/nav/CLAUDE.md` roster line updated (six → seven) + the `sync`/`compose` boundary noted.
- **Version**: nav `0.6.0` → `0.7.0`; description updated; cursor projection + marketplace version re-derived via `node scripts/build-manifests.mjs`.
- **Registration (gate #3)**: `/nav:compose` added to `README.md` (nav skills list + table blurb + derived counts: 19 → 20 skills, 38 → 40 picker entries) and `docs/site/index.html` (token + `NAV_NODES` node + edge; nav anatomy 6 → 7 skills; audit-block date + rev bump + FIXED entry; ADR count).
- **Codex mirror**: `node scripts/build-codex.mjs` regenerates `.agents/skills/nav-compose/` + `AGENTS.md`.
- **`relay` (forthcoming)** consumes `compose` to author its reports / decisions / index — the forcing consumer that motivated extraction now over the N+1 line.

## Out of scope

- **A lint mode (audit prose for deep-module violations).** Deferred — that is a possible `/nav:audit` extension, not `compose`'s job. `compose` authors and restructures; it does not grade.
- **`compose` deciding content.** Out of scope by definition — an empty section means the point isn't decided; that routes to `/shape:elicit`. `compose` shapes decided content, it does not converge it.
- **Sentence-level wording.** Owned by `writing-clearly-and-concisely`.

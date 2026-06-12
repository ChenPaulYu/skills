# ADR 042 — `research:provenance`: the self-audit verb

**Status**: accepted
**Date**: 2026-06-12
**Origin**: [`docs/observations/2026-06-12-unread-citations-become-load-bearing.md`](../observations/2026-06-12-unread-citations-become-load-bearing.md) (promoted same-day under ADR-018's single-session gate: the session was a sustained dogfood — one laundered number traced end-to-end, one misidentified PDF caught, the repair loop run twice through a forensic dissect)
**Prior observations**:
- [`docs/observations/2026-06-01-verify-the-belief-before-acting-on-it.md`](../observations/2026-06-01-verify-the-belief-before-acting-on-it.md) — the root pattern (an assumption treated as fact because nothing forced the check); provenance is its research-citation specialization
- [`docs/observations/2026-06-03-paper-analysis-gap-claim-mechanism-evidence.md`](../observations/2026-06-03-paper-analysis-gap-claim-mechanism-evidence.md) — the `dissect` skeleton this verb dispatches as its repair arm

## Context

A research repo's working documents accumulate citations from two intake paths: **first-hand**
(a PDF arrives, gets dissected, then cited) and **second-hand** (a deep-research / web-survey
pass reports a finding; the claim enters the thinking stream tagged as unverified). The repo in
question had a gate on the first path — "every paper gets a full dissect BEFORE classification" —
and that gate worked. The second path had no gate at all, and the failure it produced was
*structural*, not careless:

1. A number entered the raw notes legitimately, explicitly tagged "no PDF dissect; from
   taxonomy note".
2. Over subsequent sessions the claim was **promoted** (raws → synthesis → near-consensus),
   and the provenance tag did not travel with it. By the top of the ladder it read as "direct
   evidence for the thesis".
3. The PDF assumed to be that paper turned out, on forensic dissect, to be a **different paper
   entirely** — and the real paper's numbers, once fetched, were real but missing four
   qualifiers that would have made the unqualified citation indefensible under review.
4. The same raw note listed three more sources in the identical second-hand state — found only
   because one thread happened to be pulled during an unrelated triage.

The bug class: **promotion strips provenance**. A claim looks *more* trustworthy the higher it
climbs, precisely because each consolidation pass rewrites it more confidently. No existing verb
catches this: `dissect`, `untangle`, and `critique` are all **read-side** — their object is the
external document. None of them reads *the user's own documents* and asks "does each load-bearing
claim trace back to a verified source?" The self-audit corner of the family is empty.

## Decision

| Aspect | Choice |
|---|---|
| Skill verb | `provenance` (fourth `research` skill) |
| Object | the **user's own argument-carrying documents** (synthesis notes, related-work maps, position papers, design docs citing benchmarks) — not the external source |
| Spine position | `dissect` understands · `untangle` positions · `critique` assesses *their* argument · **`provenance` audits *your* use of theirs** — the mirror of `critique` |
| Core protocol | **scan** (extract load-bearing citations: numbers, quotes, claimed roles, "X proved Y" sentences) → **trace** (each one back to a dissect note + source document) → **classify** (first-hand verified / second-hand / orphan) → **report** (quarantine list: read-or-demote before the document is relied on) |
| Repair arm | composes with `dissect`'s forensic mode (added same day): each second-hand or suspect finding dispatches a forensic dissect that verifies cited-as vs actually-says and returns the corrected citable form. `provenance` detects; `dissect` repairs — same one-way reuse pattern as `untangle → dissect` and `critique → dissect` |
| Verdict ownership | the user decides remediation (read the source / demote the claim / accept the risk); the skill surfaces and recommends, never silently edits the audited documents |
| Output | a dated audit note: per-citation trace table + the quarantine list; writes nothing else without per-fix consent |
| Scope | domain-agnostic — works wherever documents cite sources (papers, competitor analyses, RFCs citing benchmarks, due-diligence notes) |

## Why `provenance` over alternatives

- **`verify`**: collides with the built-in `/verify` (run-the-app verification) — a hard no in a
  marketplace meant to coexist with stock skills.
- **`audit`**: already carries `nav:audit`'s meaning (structural health of code); reusing it
  across families for a different object invites mis-firing.
- **`trace`**: names the mechanism, not the deliverable — and reads as a debugging verb.
- **`provenance`**: names exactly what is being established — where each claim came from and
  whether the chain of custody holds. The noun-as-verb is acceptable here for precision (cf.
  `map` before ADR-031).

## Why this is one skill, not a mode of an existing one

- Not `critique`: critique's object is the *external* paper and its intent is adversarial
  assessment of *their* evidence. Provenance's object is the user's own corpus and its intent is
  chain-of-custody. Folding it in would overload critique's trigger surface ("review this paper"
  vs "are my citations sound" are different summons).
- Not `dissect` forensic mode alone: forensic mode verifies citations *of one known paper,
  once dispatched*. It cannot find **which** claims need verification — the scan/trace/classify
  front half is the discovery work, and it runs over the user's documents, not a PDF. Detector
  and repair arm are different verbs on different objects.
- Not a checklist in a project CLAUDE.md: the failed repo *had* the intake rule written down.
  The lesson is that a standing rule guards arrivals, but only a sweep verb catches what slipped
  past — the class needs an executable, summonable protocol.

## Consequences

- `research` is now four verbs; `plugin.json` → 0.5.0.
- `provenance` is the first `research` verb whose object is the user's own writing — the plugin's
  charter ("reading external sources with intent") gains a reflexive corner: *checking how you
  used what you read*.
- `dissect` gains forensic mode (identity-from-content + cited-as vs actually-says) as
  provenance's repair arm; the two ship together.
- First dogfood target is ready-made: the originating repo still holds three known second-hand
  citations (PICon, PPol, PersonaGym/PsyPlay) — the verb's acceptance test is whether a sweep
  finds them (and anything not yet known) without being told.

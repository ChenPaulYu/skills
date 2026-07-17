# ADR 088 — Task-tier taxonomy: what the cheap hand may safely do

**Status**: accepted
**Date**: 2026-07-17
**Source**: owner-led session discussion, cross-checked by a transcript-mining
pass over ~1,300 local session files plus the owner's own dispatch corrections.
Extends [ADR-067](067-dispatch-tiers-consultant-seat.md): that ADR governs
*who sits in which seat*; this one ratifies *which task types* may be handed
to the mechanical-tier executor at all. Role language throughout — no tool or
model names (the concrete mapping lives in each user's own config).

## The three criteria (the load-bearing part — the list below is derived)

A task is cheap-tier-safe when **all three** hold:

1. **Ground truth exists** — right/wrong is mechanically checkable (grep hits,
   test pass/fail, byte diff); no "what counts as good" representation has to
   be invented.
2. **Strong-seat verification is cheap downstream** — the output arrives in a
   fast-to-audit shape: file:line, verbatim quotes, a diff, PASS/FAIL. (This
   is ADR-067's downgrade-safety condition made concrete.)
3. **Mistakes are cheap** — rerunnable, revertible, and cannot silently
   contaminate a decision.

## Cheap-tier-safe task types (ratified list)

1. **Web search execution** — with the primary-source fuse (below); a search
   *summary* is a lead, never evidence.
2. **Code reading for FINDING** — locate, enumerate, map, extract references.
   The boundary is finding vs judging: "where is X" is cheap; "is X correct /
   well-designed" is the judgment seat's.
3. **Pure file writes** — content already decided; the write is transcription.
   Authoring the content (an ADR's wording, a skill's prose) is not this.
4. **Implementation with no open questions** — with the blocked-not-guess fuse
   (below) and a strong-seat diff review downstream. Footnote for debugging:
   a repro plus a single working hypothesis makes it routine (this category);
   no repro or competing hypotheses keeps it at the judgment seat.
5. **Mechanical sweeps** — multi-file find/replace, renames, format fixes,
   applying an already-worded change across N files.
6. **Verification against a pre-registered expectation** — run the tests,
   drive the smoke check, compare against an expectation written down
   *before* the run.
7. **Data extraction / organizing** — parse logs, build tables, dedupe,
   first-pass corpus filtering. Landmine: when the classification boundary is
   itself a judgment call, the flag-don't-clear fuse applies.
8. **Running scripts / regenerating derived artifacts** — generators,
   validators, builds.
9. **Generative production as a friction probe** — produce a real artifact
   (a beat, a page, a doc) to surface workflow friction, where even a bad
   artifact yields valid probe data. Two riders: the executor never
   self-scores aesthetics (verification is always external — measurements,
   an independent listener/reviewer, the owner); and the evidence supports
   *probe* use only — a taste-judged deliverable stays with the judgment seat.

## Never downgrade

Adversarial review · design verdicts · naming and taste · redaction/wording
judgment · root-cause under ambiguity (no repro / competing hypotheses) ·
anything whose output cannot be verified more cheaply than it was produced.

## Brief-level fuses (owed by the dispatcher, in every cheap dispatch)

- **Primary-source verification** — web/search claims must cite the primary
  source and mark what was NOT independently verified. (Real incident: a
  search summary asserted a feature had shipped; the primary source showed an
  open feature request.)
- **Facts, not verdicts** — finders report file:line + verbatim quotes;
  classification verdicts happen upstream. (Real incident: cheap readers
  over-flagged normal authorship as privacy leaks; the judgment layer
  rejected the flags.)
- **Blocked, never guess** — ambiguity discovered mid-task returns `blocked`
  and drops the item back to the judgment seat; an executor never resolves an
  open question by picking an interpretation.
- **Absence-clearing is allowed; self-granted exemption is not** — a detector
  may report "found nothing"; it may NOT report "found something and ruled it
  acceptable." Found → flagged → adjudicated upstream, even when its private
  ruling would have been correct. The authorization shape is the point,
  independent of the ruling's accuracy. Generalizes to every
  detect-then-adjudicate split.
- **External verification for generative probes** — the artifact's quality is
  measured by instruments, an independent reviewer, or the owner; never by
  the producer's self-report.

## Rejected for inclusion

A mid-session agent once cited a benchmark ("~98.5% of strong-model quality at
~60.7% cost") for supervisor-worker escalation. Never independently verified,
and produced in exactly the hallucination-risk shape fuse #1 exists for —
dropped rather than hedged.

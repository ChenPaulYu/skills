---
date: 2026-06-12
status: landed
---

# Second-hand citations launder into load-bearing claims — and no existing gate catches them

## What happened

In the `enact` research repo (Paper 1, related-work consolidation day), a reading-priority
triage stumbled onto this chain:

1. A deep-research (web survey) pass months earlier reported "EnactToM: ~45% literal ToM vs
   ~0% Pass³ functional ToM". The numbers entered `raws/` legitimately, explicitly tagged
   "no PDF dissect; from taxonomy note".
2. Over subsequent sessions the numbers got **promoted**: raws → evaluation taxonomy →
   `synthesis/evaluation.md`, where they ended up cited as "direct evidence for the thesis"
   (the scissors hypothesis). The provenance tag did not travel with the claim.
3. Meanwhile the PDF everyone assumed was EnactToM (`sources/evaluation/02634-YuanD.pdf`)
   turned out, on forensic dissect, to be a **different paper entirely** (DMT-RoleBench,
   AAAI-25 — filename was submission-number + first author). Nobody had ever opened it
   against its assumed identity.
4. When the real EnactToM (arXiv:2605.09826) was finally fetched and dissected, the numbers
   were *real but unqualified*: 0.0% is hard-split-only (failure-selected by construction),
   45-vs-0 mixes metrics (Avg vs Pass³; matched form is 37.5 vs 0.0), and the gap partially
   *inverts* on the standard split. The unqualified citation would have been indefensible in
   rebuttal.

The repo HAS an intake rule ("every paper gets a full dissect BEFORE classification") — it
guards **PDFs that arrive**. It is structurally blind to **claims that arrive without PDFs**
(deep-research output, survey paraphrases, memory). Those enter the thinking stream tagged as
second-hand, then lose the tag as they climb the promotion ladder (raws → synthesis →
consensus). The same raws note that flagged EnactToM still lists PICon, PPol, PersonaGym/PsyPlay
as "deep-research-covered, no PDF dissect" — live instances of the same class, found only
because the EnactToM thread happened to be pulled.

## Why it matters

- This is a **bug class, not an instance**: any research workflow that uses deep-research /
  web surveys as intake will manufacture these. The failure is silent and compounding — the
  claim looks *more* trustworthy the higher it climbs, precisely because promotion strips the
  provenance.
- The existing research verbs are all **read-side** (dissect = one argument's anatomy,
  untangle = edges across arguments, critique = adversarial assessment of one paper). None of
  them reads *your own documents* and asks "does each citation trace back to a verified
  source?" The self-audit corner of the family is empty.
- Two cheap mechanical disciplines fell out of the forensic pass: (a) never trust a PDF's
  filename — verify identity from content before dissecting; (b) when a paper is *already
  cited* in the user's repo, the dissect must reconcile existing-citation-vs-actual-text, not
  just produce a fresh skeleton.

## What it could become (both approved by Paul, 2026-06-12)

1. **`research:dissect` forensic mode** (amendment, build first — it is the repair arm of #2):
   inject the repo's existing citations of the target paper into the sub-agent brief; output
   gains a "citation verification" section — exact numbers with table/section locations, what
   the prior citation got wrong or left out, and the corrected citable sentence-form. Plus the
   verify-identity-from-content rule in the protocol. Proven twice in one session (misidentified
   PDF caught; four missing qualifiers on a headline number).
2. **`research:provenance`** (new verb — the fourth corner: self-audit): scan target docs
   (synthesis/consensus-class) for load-bearing numbers/quotes/claims → trace each to a dissect
   + source PDF → classify **first-hand verified / second-hand / orphan** → emit a quarantine
   list ("read-or-demote before submission"). Remediation composes with #1: each second-hand
   finding dispatches a forensic dissect. Mirror of critique: critique audits *their* claims
   against *their* evidence; provenance audits *your citations* against *your sources*.

Dogfood target ready-made: run it on enact and sweep PICon / PPol / PersonaGym.

## Update (2026-06-18, enact) — both verbs shipped and dogfooded; a second case widened the failure taxonomy

The dogfood target above was executed. `research:provenance` traced the three flagged claims;
two `research:dissect` forensic passes fetched the real papers. The outcome both validated the
verbs and showed the failure class is wider than "qualifiers stripped":

- **The corruption is in the summary, not the paper.** 2 of 3 flagged papers (PICon, PPol)
  turned out **real and usable** once fetched first-hand — the second-hand danger is purely the
  intermediary summary, not the source. Forensic verify both *rescues* real cites and *catches*
  fakes; "second-hand" is not a synonym for "wrong".
- **Two laundering shapes beyond the original "unqualified number":**
  - *Fabrication (the number exists nowhere)* — PPol's "80.0% real-human baseline" appears in no
    version of the paper and greps to zero across the whole repo: a deep-research hallucination
    back-filled to match a "close to real human" phrasing. (Companion: LoCoMo's "6.4%" is a
    repo-internal **circular** cite — the dissect cites the repo's own earlier note as authority,
    no named source anywhere = orphan.) This is worse than a dropped qualifier: there is no
    upstream to demote *to*.
  - *Mischaracterisation against the authors' explicit words* — the repo labelled PICon
    "Multi-turn **Adversarial** Interrogation"; the paper explicitly disavows it ("rather than any
    coercive or adversarial interrogation tactics"). A second-hand label can **invert** the
    source's own framing, not just blur it.
- **Sharpening for the verbs**: provenance's three-verdict scale holds, but forensic dissect's
  "citation verification" output should explicitly flag (a) numbers with *no locatable source*
  (fabrication/orphan, not merely unqualified) and (b) labels/framing that **contradict the
  source's self-description** — both are sharper, more dangerous failures than the qualifier loss
  the 2026-06-12 case showed.

## Evidence so far

- 2026-06-12, enact: the full EnactToM chain above (one laundered number, one misidentified
  PDF, three more unverified second-hand entries still on the shelf).
- 2026-06-18, enact: provenance recheck + 2 forensic dissects on the three flagged claims —
  confirmed LoCoMo 6.4% orphan; caught PPol "80.0%" as **fabricated** (exists nowhere) and PICon
  "adversarial" as **contradicting the authors' explicit words**; both PICon and PPol otherwise
  verified first-hand and usable. The proposed verbs (provenance + forensic dissect) shipped and
  worked → status `landed`.
- Related earlier signal: 2026-06-01 "verify the belief before acting on it" — same root
  (an assumption treated as fact because nothing forced the check); this observation is the
  research-citation specialization of it, with a concrete promotion-ladder mechanism.

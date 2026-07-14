---
name: provenance
description: "Audit your OWN documents' citations: trace every load-bearing number, quote, and claim back to a verified source, classifying each first-hand verified / second-hand / orphan. The mirror of /research:critique: critique audits THEIR evidence; provenance audits YOUR use of theirs. Fires on \"are my citations sound\", \"which claims haven't we verified\", \"sweep for unread citations\". Suspect findings hand off to /research:dissect (forensic mode)."
---

# research:provenance

Trace every load-bearing claim in your own documents back to a verified source. The unit of
analysis is the **citation chain**, not the source: provenance asks "was this actually read?",
never "is the source right?" (that is `critique`'s job).

## Why this skill exists

Research corpora take in claims through two paths: **first-hand** (a document arrives, gets
read/dissected, then cited) and **second-hand** (a web survey or deep-research pass reports a
finding; the claim enters your notes with a "not yet verified" tag). Intake rules guard the
first path. Nothing guards the second — and the failure it produces is structural:

**Promotion strips provenance.** A second-hand claim enters honestly tagged. Each consolidation
pass rewrites it more confidently — raw note → synthesis → near-canon — and the tag does not
travel. By the top of the ladder the claim reads as established evidence. It looks *more*
trustworthy the higher it climbs, which is exactly backwards.

Real case (2026-06-12): a benchmark result entered a repo from a web survey, explicitly tagged
"no PDF dissect". Months later it was cited as "direct evidence for the thesis". The PDF
assumed to be that paper turned out to be a *different paper entirely*; the real paper's
numbers, once fetched, were real but missing four qualifiers that made the unqualified citation
indefensible. The same raw note listed three more sources in the identical state — found only by
luck. A standing rule had existed the whole time; rules guard arrivals, only a sweep catches
what slipped past.

## The three verdicts

| Verdict | Meaning | Test |
|---|---|---|
| **first-hand verified** | the claim traces to a reading/dissection note AND the source document itself, and the note actually supports the cited form | the chain has no gaps |
| **second-hand** | the claim traces only to an intermediary — a survey, a deep-research output, another repo's summary, memory of a talk | the source itself was never opened |
| **orphan** | no traceable origin at all — no note, no source on the shelf, no intake record | grep finds nothing upstream |

Two subtleties that decide borderline cases:

- **A note is not proof by itself.** A dissection note *exists* for the source, but the cited
  number/claim does not appear in it → the citation is still second-hand (someone added the
  number from elsewhere). The note must contain the cited fact.
- **Identity counts.** The source file is on the shelf but its identity was never confirmed from
  content (filename ≠ fact) → treat as second-hand until a reading confirms what the file is.

## Scope

**Domain-agnostic.** Anywhere your own documents cite sources: research synthesis notes and
related-work maps, competitor analyses citing their published results, RFCs citing benchmarks,
due-diligence notes citing filings, position papers citing surveys.

## Protocol

### Step 1 — Scope the audit

Ask (or confirm) which documents are in scope. Default to the corpus's **relied-upon layer** —
synthesis / consensus / position-class documents, the ones decisions or submissions rest on —
not the raw thinking stream (raw notes are allowed to carry unverified material; that is what
they are for). Also collect, if present: where reading/dissection notes live, where source
documents (PDFs) live, and any intake-tag conventions ("from survey", "no PDF", "deep-research").

### Step 2 — Scan: extract load-bearing citations

Read the in-scope documents and extract every claim that leans on a source:

- **numbers** attributed to a work ("X reports 45%")
- **direct quotes** and near-quotes
- **result claims** — "X showed / proved / found / refutes Y"
- **role claims** — "the strongest baseline", "the canonical citation for Z", "the published precedent"

Record each as: *claim (verbatim) · named source · file:line · wording strength* (see Discipline).
This scan is grep + read work over the user's own repo — do it directly; dispatch parallel
sub-agents only when the corpus is large (one per document set, each returning the same record
shape).

### Step 3 — Trace each citation upstream

For each record, walk the chain:

1. Is there a reading/dissection note for the named source? Does the note **contain** the cited
   fact (not merely cover the paper)?
2. Is the source document itself on the shelf? Has its **identity** been confirmed from content?
3. Do intake tags mark it second-hand ("deep-research-covered", "no PDF", "from survey")?
   A tag anywhere upstream taints the claim everywhere downstream — the tag travels, even when
   the prose dropped it.

### Step 4 — Classify and weigh

Assign each record a verdict (first-hand / second-hand / orphan) and a **severity**:

> severity = altitude of the citing document × strength of the wording

A second-hand number quoted as "direct evidence for the thesis" in a consensus doc is critical;
the same number as one-line context in a survey note is low. Flag **wording-strength mismatch**
explicitly: verdicts and verbs must agree — "suggests" can survive second-hand status,
"demonstrates" cannot.

### Step 5 — Report: the audit note and the quarantine list

Produce a dated audit note (offer to save it where the corpus keeps dated notes; do not write
without confirmation):

```markdown
# Provenance audit — <corpus> — <date>

## Trace table
| # | Claim (verbatim) | Source | Where cited | Verdict | Severity | Evidence of trace |
|---|---|---|---|---|---|---|

## Quarantine list (read-or-demote before relying on these)
For each second-hand / orphan item, the recommended remediation:
- **fetch + forensic dissect** — get the source, verify cited-as vs actually-says
- **demote the wording** — keep the claim at the strength its provenance supports
- **accept the risk** — explicit, recorded decision (e.g. deadline pressure), with the tag restored inline

## Verified (no action)
One line each — the audit should also say what is sound.
```

The user owns remediation. Recommend per item; **never silently edit the audited documents** —
every fix to the corpus is gated per-file with the user.

### Step 6 — Repair arm (hand-off)

For each quarantined item the user approves: hand off to **`/research:dissect` in forensic
mode** — fetch the source, confirm its identity from content, and verify every existing citation
(cited-as vs actually-says), returning the corrected citable sentence-form. Provenance detects;
dissect repairs. After repairs land, the affected trace-table rows flip to first-hand verified —
re-state the residual quarantine so the user sees what is still open.

## Discipline

- **Custody, not truth.** Provenance never judges whether the source's claim is *correct* —
  only whether the chain from your sentence back to a read source is intact. "Is their evidence
  sound" is `/research:critique`.
- **Quote the claim verbatim, with file:line.** A paraphrased finding cannot be re-found; the
  audit's value is that every row is checkable in one jump.
- **The tag travels.** One "no PDF / from survey" tag anywhere upstream taints every downstream
  restatement, no matter how confident the later prose sounds. Promotion is not verification.
- **A note covering the paper ≠ a note containing the fact.** Check the fact, not the filename.
- **Wording must match verdict.** Rank verbs ("suggests" < "shows" < "demonstrates" <
  "direct evidence") and flag any second-hand claim wearing first-hand wording.
- **Rule ⑦ applies.** Below 90% confidence on a trace (ambiguous source name, two candidate
  papers), mark the verdict "uncertain" and say what would resolve it — don't guess a chain
  into existence.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.

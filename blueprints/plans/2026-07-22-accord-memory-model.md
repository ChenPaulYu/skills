# Accord memory model — four objects, two memories, one source of truth

> Converged 2026-07-22 between the repo owner and the session agent, over a full
> clarification round. This blueprint is the design basis for the next Relay wave
> and for the coordination repo's adoption PR (which the counterpart reviews —
> protocol changes require their consent per ADR-099). Examples are generic;
> the real repo's instances stay private.

## 1. The four GitHub objects and their boundaries

| Object | What it is | Boundary test |
|---|---|---|
| **Discussion** — think together | Explore a topic that has no clear answer yet; exchange views until a provisional conclusion forms | You cannot yet state an owner and a completion rule. Once you can → open an Issue, linked back |
| **Issue** — get one thing finished | Track a bounded responsibility: who owes the next step, what counts as done | Exactly one accountable owner + a checkable completion rule. "Please take note of X" is also a bounded responsibility (recipient's confirmation completes it) |
| **Pull Request** — review a concrete change | A proposed modification to shared memory, reviewed item by item; accept or request changes | There is a diff to review verbatim. A PR is *proposed*, never *in force* |
| **Commit (on main)** — keep what is established | The version future people and agents rely on directly | Branch commits are PR draft material; only main establishes. Core additionally requires an effective review |

**There is no announcement type.** A tell that needs a receipt is an Issue
(assignee confirms, then close). A fact that needs no receipt gets no object —
if it matters it lives in a commit/brief; a passing heads-up is an @mention on
the relevant object (caught by the notices tier). **Most FYI/report traffic
never touches Discussions.** Discussions are the low-frequency, high-value
exception: opening one signals "this needs both of us thinking." Their scarcity
is their weight.

One-line version: Discussion handles *how we think*; Issue handles *who does
what*; PR handles *whether this change may enter*; Commit preserves *what
currently stands*.

## 2. Two memories

- **Collaboration memory** — the GitHub objects themselves (discussions,
  issues, PR conversations, reviews, comments). Complete, contextual,
  append-only by nature; preserves *how things happened*. Not necessarily
  still true.
- **Formal memory** — version-controlled files in the repo: `decisions/`,
  `briefs/`, `core/`. Curated, reviewed, versioned; preserves *what can be
  relied on now*. Agents load this first.

GitHub objects store process; repo files store results.

## 3. Decision, Brief, Core

- **Decision** (source state, append-only): what we formally established about
  one concrete question, at one point in time — including decisions *not* to
  act ("no reminder mechanism for now; revisit after three stalled
  obligations"). Direction changes add a new Decision that supersedes the old
  one; old files are never rewritten.
- **Brief** (topic projection, derived): "without rereading history, how should
  I understand this topic now?" Integrates the currently-valid Decisions —
  may merge, dedupe, order, and resolve supersession, but **may not introduce
  conclusions no Decision states**.
- **Core** (minimal projection, derived): "if we forgot every detail, what must
  we still remember?" Cross-topic, most stable, every sentence traceable to
  Decisions.

Decisions carry stable IDs (`decisions/D-021-<slug>.md`) so Briefs and Core can
cite anchors that survive renames.

**Supersession is mechanical, not editorial**: every Decision's frontmatter
carries `status: active` or `status: superseded` + `superseded-by: D-0xx`.
Derived views and agents trust only `active`. (This closes the biggest hole
found during convergence: without the marker, a future reader of an old
Decision file would believe it still holds.)

## 4. Resolution vs Decision — the promotion test

Every Issue and Discussion must close with a **Resolution** (why it may close:
done, answered, received, duplicate, not needed, covered by D-0xx). Only some
Resolutions are promoted to a **Decision file**:

> After closing this object, is there a new statement that future people or
> agents should treat as a valid basis for action or belief?

Yes → record a Decision. No (pure execution of an existing Decision, receipt
confirmations, duplicates, factual lookups, ideas collected without a choice)
→ the closing Resolution comment *is* the formal record; no file.

This keeps `decisions/` from becoming a ledger of noise while still forbidding
silent disappearance: **close now means "this object has been translated into
long-term memory (or confirmed to need none)."**

## 5. Who writes what, and how it enters the repo

| Content | Path into repo | Why |
|---|---|---|
| Decision | The designated **recorder** commits directly to main | Recording an already-settled conclusion, not making a new one |
| Brief | Always a PR | Integration involves choices and interpretation — another person reviews |
| Core | Always a PR, stricter | Highest-weight shared understanding: supporting Decisions listed, counterpart approval, no auto-merge |

The **recorder is not the assignee**: the assignee executes; the recorder is
whoever holds settlement authority (a Discussion's host, an Issue's acceptor).

Direct-commit Decisions carry five fuses, all required:

1. the source object is explicitly settled (a stated resolution, not silence);
2. the record adds no new semantics (excerpt, compress, structure — never
   widen, never resolve ambiguity, never write one person's view as consensus);
3. it links back (`Source:` / `Settled by:` / `Date:`);
4. the commit does only this (no Brief/Core/rule edits riding along);
5. agent-drafted text passes the author sign-off gate before commit
   ("Is this what you mean?", ADR-095).

Escapes that force a PR instead: the exact wording is itself the decision
(external statements, rights/responsibility allocations); the source has no
clear settlement; the record synthesizes multiple objects (that is a Brief in
disguise). Standing fuse: **the moment writing the record requires re-judging
"what did we actually mean," it is no longer recording — route it through a PR.**

PR review order for memory changes: is the Decision faithful to its source? →
does the Brief integrate old and new Decisions correctly? → does Core truly
need to change, and do Decisions support it?

## 6. Lifecycle, end to end

```
Discussion (talked out) ─┐
                         ├→ Resolution  ── promotion test ──┐
Issue (worked out) ──────┘                                  │
                       no → closing comment is the record → close
                       yes → recorder commits D-0xx → link back → close
                              → affects a Brief/Core? → PR (counterpart reviews)
                              → merge → established
```

Typical traffic: execution/research/decisions → Issues; memory changes → PRs;
receipted tells → Issues; Discussions only when two heads are genuinely needed.

## 7. Known holes and their dispositions

1. **Supersession drift** → closed by the frontmatter spec above (must ship
   with the format, not later).
2. **Promotion judgment drifts** (a Resolution that deserved promotion isn't) —
   two safety nets: a Brief PR exposes "nothing to cite"; conformance checks
   can flag Briefs citing nonexistent D-0xx. The residue (unwritten and not
   yet needed by any Brief) is accepted as a human judgment point.
3. **Cross-layer link drift** (closed object ↔ Decision links missing) —
   machine-checkable; add bidirectional link checks to the conformance sweep.
4. **Receipt confirmation signal** for tell-Issues: the assignee's comment or
   close is the confirmation; the digest already tracks assigned Issues, so no
   new machinery.
5. **Recorder bias** (no immediate review on direct commits) — accepted for
   lightness; recheck trigger: one real incident of semantic drift in a
   recorded Decision upgrades Decisions to lightweight PRs.
6. **Recorder = initiator at n=2** (settle and record in one pair of hands) —
   accepted; the Brief/Core PR layer is the downstream safety net.

## 8. Implementation consequences (next wave, separate ratification)

- Relay: report's routing table rewritten (Issue-default; Discussion demoted to
  the convergence branch; announcement machinery removed), settle encodes
  Resolution/promotion/close semantics and the recorder seat, brief cites
  Decision files rather than raw threads; ADR to be written against this
  blueprint. Digest reducer largely shrinks (announcement receipts/close-nudge
  machinery retires; assigned-Issue and Q&A paths already cover the new flow).
- Coordination repo: `decisions/` scaffold with the ID + frontmatter spec;
  CLAUDE.md rewritten to this model; adoption lands as a PR the counterpart
  reviews (their consent is the gate, per ADR-099).
- Live objects predating this model finish under the rules they were opened
  under, then close; nothing is migrated retroactively.

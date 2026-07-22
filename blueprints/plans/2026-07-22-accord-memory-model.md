# Accord memory model — four objects, two memories, one source of truth

> Converged 2026-07-22 between the repo owner and the session agent, over a full
> clarification round. This blueprint is the design basis for the next Relay wave
> and for the coordination repo's adoption PR (which the counterpart reviews —
> protocol changes require their consent per ADR-099). Examples are generic;
> the real repo's instances stay private.

## 0. Governing principle: progressive disclosure

Every layer of this model answers one question: *what is the least a reader
must see before deciding whether to read more?* The memory stack discloses
progressively — Core (what we must remember if we forget everything) → Brief
(how to understand a topic now) → Decision (what one round established) →
collaboration memory (the full process). So does the digest (obligations →
notices → the objects themselves), and the file system (index row → header →
body). Knowledge here obeys the same law as navigable code: lead with the
point, drill down only on demand.

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

**Derived views cite, never restate.** When a Brief or Core uses Decision
material, it references the anchor (`[D-021]`) rather than copying the
authoritative wording — a second copy of a Decision's text is a fact with two
owners, and it will drift. A Brief may still integrate and rephrase into a
readable current picture (that is its job), but every claim carries its
supporting citation(s); the authoritative text lives only in the Decision
file. This makes staleness mechanical: a derived view citing a `superseded`
Decision is flagged by the conformance sweep as needing re-integration.

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

## 8. Notification is recoverable responsibility, and metadata has three tiers

Notifications are events ("at some point, a ping happened"); Relay needs state
("something is still waiting on you, now"). The digest therefore never reads
notification inboxes — it rescans current GitHub state and recomputes
obligations, so a deleted email, a read-away notification, or an agent offline
for three days loses nothing. Attention signals (mentions, new comments,
reactions) may notify but never obligate; obligation signals (assignment,
review request, approved-awaiting-merge) mean it is someone's turn.

The minimum rule: **a message that needs action never rides on an @mention
alone.** A question with a stateable owner and completion rule graduates out
of prose into a needs-input Issue — that is the same graduation moment as
section 1's boundary test. Its form fields carry the three computable facts:

```
Question:    API — option A or B?
Done when:   one option chosen, or a third proposed with reasons
After reply: the asker settles and records
```

Current actor = the assignee (a native, typo-proof signal); completion = the
form field; next actor = the settle seat.

**The three tiers of machine readability:**

1. **Responsibility lives in native fields** — assignment, review request,
   close state, labels. GitHub enforces them; they cannot be misspelled.
   The digest computes who-owes-what from this tier ONLY: however malformed
   the prose, responsibility never silently vanishes.
2. **Record semantics live in structured prose, formatted at write time.**
   The writing verbs (report/reply/settle) emit these blocks by template;
   the digest reads them as enrichment under tolerant-reader rules
   (standard shape → consume; ad-hoc → best effort; absent → degrade and
   self-report), never as a dependency. The vocabulary:

   ```
   any close:            Resolution: <why this may close>
   promoted close:       Outcome: decided
                         Decision: <one-sentence conclusion>
                         Follow-ups: #42, #43
                         Canonical record: decisions/D-0002-<slug>.md
   Decision frontmatter: id · status: active|superseded · superseded-by ·
                         Source · Settled by · Date
   ```

3. **Format health lives in the conformance sweep**, not in digest failure
   paths: does `Canonical record:` point at a file that exists? were the
   `Follow-ups:` issues opened? does every closed object carry a
   `Resolution:`? does each Decision's `Source:` resolve? Format drift
   becomes a line on the report board instead of silent information loss.

One line: responsibility lives where typos are impossible; semantics live
where writing is templated; health lives where sweeps are scheduled. The
digest depends on tier 1, reads tier 2, and never fails on either.

There is no separate formatter verb: formatting is embedded in each writing
skill's templates (deepening existing doors, not adding one).

## 9. Indexes and navigability

Formal memory must be navigable the way well-kept code is: any reader — human
or agent — answers "what is this file, is it current?" from the top lines, and
"what exists?" from one index, without opening everything.

- **Headers are the index rows.** A Decision's frontmatter (id · status ·
  superseded-by · Source · Settled by · Date + title) IS its header — the
  first lines answer "what was decided, does it still hold?" Briefs and Core
  files carry a one-line role header (topic · derived-from · last-integrated
  Decision) in the same spirit as code file-top headers.
- **Indexes are derived, never hand-edited.** `decisions/README.md` (id ·
  title · status · date, newest first) and the briefs/core index rows are
  regenerated from the files' own headers — the files are the single owner;
  the index is a projection. The conformance sweep regenerates and compares:
  drift becomes a bot commit or a report-board line, never a manual chore and
  never a lie.
- **The active view is a filter, not a document**: "currently effective
  decisions" = index rows where `status: active`. No one maintains a separate
  current-state file that can rot.

## 10. The four verb contracts

**report — bring new information into the collaboration.** A content act, not
an object type. Placement: belongs to an existing object → comment there;
standalone tell needing a receipt → Issue; a review request whose subject is a
repo-content diff → PR (verbatim, revision-bound), a review of anything else
(a report, an artifact, a result) → Issue; a new not-yet-converging shared
topic → Discussion; an already-crisp memory change → straight to PR. Transfer:
a receipt-tell makes the recipient owe confirmation; a review-ask makes the
reviewer owe a verdict/disposition; an assignee's progress report makes the
acceptor owe disposition; Discussion material obligates no one unless
graduated to a needs-input Issue. Reporting never implies the other side has
seen, accepted, or ratified anything.

**reply — complete one requested response.** Acts only on existing objects;
never spawns a new topic (a genuinely new question becomes a linked object;
the original keeps its purpose). The baton flips: A asks B → B owes → B
replies → A owes disposition. **The flip rides a native signal, not prose**:
the label pair `needs-input` ⇄ `awaiting-acceptance`, toggled by the reply
verb at delivery — labels come from a fixed set and cannot be misspelled.
A reply never implies consensus, closure, acceptance, or a change to formal
memory.

**settle — formally dispose of a whole object.** Only the designated seat
settles (a Discussion's host, an Issue's acceptor). The settlement block:
`Resolution:` · `Reason:` · `Decision required: Yes/No` (+ `Recorder:` when
Yes) · `Follow-ups:`. When a Decision is required, settle applies the
`awaiting-record` label; the recorder commits the Decision, links back,
removes the label, closes. Brief/Core PRs are follow-ups and never block the
original object's closure. Settling does not mean derived views are updated
or that follow-up work is done.

**digest — recompute the current state of the collaboration.** Answers:
waiting on me · waiting on the counterpart · ready for settlement · waiting
for Decision recording (via `awaiting-record`) — all derived from verifiable
native signals only. System-health questions (an object missing an owner or
completion rule; closed without a Resolution) belong to the conformance
sweep's report board, not the personal digest: they are nobody's *current*
debt. The digest never infers: no reply is not agreement; 👀 is not
acceptance; an approved PR is not a recorded Decision; a silent Discussion is
not a finished one.

## 11. Implementation consequences (next wave, separate ratification)

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

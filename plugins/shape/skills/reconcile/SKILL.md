---
name: reconcile
description: "Reconcile design notes with reality — scan a blueprints/ tree (thoughts/ AND plans/ AND mockups/) for docs that drifted (already implemented, self-declared done, superseded, or carrying a stale fact), then *with the user*: AMEND a stale fact in place, PRUNE / CONSOLIDATE a wholly-stale doc, GRADUATE a shipped-but-durable rationale into a lean blueprints/decisions.md, or RETIRE a shipped decision's mockup folder (salvage residue first; git is the deep archive). Fires on \"check for outdated thoughts / docs\", \"which design notes are stale\", \"clean up / tidy the blueprints / plans / mockups\", \"are these docs still current\", \"prune the old specs / mockups\", \"consolidate these notes\", \"graduate this shipped doc\", or after work ships and docs drift from the code. Also invokable as /shape:reconcile. The check is read-only; every write is gated per-file. AMEND syncs evidence-backed facts, never re-decides a *decision* — a changed design is /shape:elicit. Language- and framework-agnostic."
---

# Reconcile — make the notes match reality

Design notes and plans accrete; reality moves past them. `reconcile` walks `blueprints/thoughts/`, **`blueprints/plans/`, and `blueprints/mockups/`**, decides honestly which docs have drifted, and — *with the user* — **amends** a doc's stale facts in place, **prunes / consolidates** a wholly-stale doc, **graduates** a shipped-but-durable rationale into `decisions.md`, or **retires** a shipped decision's mockup folder, so the tree stays a true picture of what's still open. The **check is read-only**; **every write is gated** behind per-file confirmation, because overwriting or deleting a design record is irreversible.

Staleness isn't binary: a doc can be 90% live design with one line reality overtook. **`amend`** serves that middle case — correct the drifted *fact*, leave the rest verbatim. The line it must not cross — sync what's *true*, never re-decide what's *decided* — is the amend boundary (below).

## Why this skill exists

A `thoughts/` doc describing already-shipped or superseded work doesn't just clutter — it actively lies to the next reader (human or agent) who trusts it as current intent. `/shape:align` *flags* such drift in passing but deliberately doesn't clean it; reconcile is the dedicated, careful cleanup. It's the pre-build mirror of `/nav:audit` + the careful side of `/nav:refactor`: audit assesses code shape, refactor moves code under test gates — reconcile assesses doc currency and prunes/merges under safety gates.

## The shape spine (restated — this skill is self-contained)

> **Capture before crystallize** — keep a decision while it's live, retire it once reality has absorbed it; reconcile is how the archive lets go without losing the record prematurely. **One current state, two renders** — `thoughts/` (agent) and `overview.html` (human) must both reflect *present* reality (the human render **only while it has a reader** — an unread `overview.html` is retired, not maintained; blueprints-spec § Weight-adaptive); a doc describing the past is a stale render, a lie like a stale codebase map.

## Staleness signals — collect, don't conclude

For each doc, gather evidence from three angles; none alone is decisive — present them and let the user judge:

1. **Code (strongest).** Is the thing it describes already built? Grep the codebase; **lean on `head -12` file headers (`/nav:sync` output)** to read implementation status cheaply. Implemented → likely "done / can retire".
2. **Self-declaration.** Does the doc's own top say shipped / completed / superseded?
3. **Date.** Older docs are likelier stale — a *prior*, not a verdict.

Combine into a per-doc verdict: **current** · **current · N stale fact(s)** (→ amend) · **likely stale** (→ prune) · **superseded by `<other>`** (→ consolidate) · **shipped · holds durable residue** (→ graduate) · **canon-grade** (settled + axiom/principle altitude → recommend `/shape:position` graduation — see routing below) · **uncertain**. Honesty over tidiness — mark `uncertain` rather than guessing.

## Protocol

**Step 1 — Inventory.** Locate `blueprints/` (commonly `docs/blueprints/`). List **`thoughts/*.md`, `plans/*.md`, and `mockups/*/`** — plus, when the project has a `docs/core/` canon layer, the **pending-amendments ledger `docs/core/amendments.md`** (ADR-041; see the ledger row below) — reconcile maintains all three layers (`thoughts/` = converged decisions; `plans/` = `nav:plan`'s grounded code-plans; `mockups/` = the decision artifacts, swept by inherited currency — see the mockups tier below). Detect the stack so Step 2's grep uses the right syntax. **Plans drift too, and check sharper**: a plan carries explicit steps + a Verification table, so grep each step's Critical-files against the code — all shipped → prune; *some* shipped → amend (mark which landed). Same verdicts, gates, and fact-vs-decision boundary as thoughts.

**Step 2 — Gather evidence (read-only).** Per doc, collect the three signals. Grep code, read each doc's top, note dates. **Touch nothing yet.**

**Step 3 — Present + decide *with the user*.** Report per doc: verdict + evidence + a **proposed action** (keep · amend · prune · consolidate · graduate). Propose the fix concretely — for amend, show the **one-line diff** (`-` stale claim / `+` the fact code shows); for consolidate, which to merge. User confirms **per file**; nothing is written without an explicit yes. **If the drift is a *decision change*, not a fact — stop and hand to `/shape:elicit`** (see amend boundary): say plainly it's out of scope, and once the new thought lands, consolidate the old one. Don't rewrite the decision here.

**Step 4 — Write, safely (write-gated, on confirmation only).** Safety rules, non-negotiable (learned the hard way — a careless `mv`+`rm` once destroyed untracked design docs):
- **Check tracked vs untracked first** (`git status`, `git ls-files`). Untracked = no recovery path; overwriting it is as irreversible as deleting it — treat as precious, never assume git can undo.
- **Never chain a destructive `rm` after an unverified `mv`/`git mv`** (`git mv` aborts wholesale if any source is untracked — verify before removing).
- **Confirm a merge landed before deleting the merged-from doc** (`diff -q` the salvaged content) — delete only what's provably duplicated.
- **One step at a time, re-checked** — don't batch destructive ops behind a single confirmation.
- **Amend** is the lightest write but still an overwrite: change only the confirmed line(s), verbatim otherwise (same discipline as `/nav:refactor`'s move — no "while I'm here" rewrites); the `+` line states only what code shows; keep the doc's status/date current if it carries one.
- **Consolidate beats raw delete** when live design remains — merge, verify, *then* remove. **Graduate** is consolidate pointed at a `decisions.md` section — see below.

**Step 5 — Re-sync the renders.** After cleaning, the board may lag — *offer* (don't auto-call) `/shape:align` to refresh `plan.md` + `overview.html` (see "Offer" below). **But first consumption-gate the human render**: an `overview.html` no one reads is **retired, not refreshed** (it's a stale artifact this sweep clears — see the Offer). reconcile reconciles the notes; align renders — skills don't invoke each other.

## The amend boundary — sync facts, never re-decide

`amend` is sharp only if it never bleeds into deciding. The test:

> **Is the `+` line something reality has *already decided* (built code shows it), or something that needs *my judgment about what should be*?**

- **Fact → amend here.** The doc lags the code; the decision didn't change. *e.g.* doc says "stored as a flat list" but the code now uses a typed entity → sync the line; "editing is a follow-up" but editing shipped → `editing: shipped`. Record only the fact, not why/how.
- **Decision → `/shape:elicit`, out of scope.** The code didn't move; the *design judgment* did. *e.g.* the doc's principle was "tags are describe-only" and a later conversation reframed them as two layers → reconcile must **not** rewrite that principle; recommend elicit, then **consolidate** the old doc (mark superseded) once the new lands.

Why the wall: decisions are born in `elicit` / `mockup` (the converge verbs); the maintenance verbs (`align`, `reconcile`) *render* and keep current, they don't author. Letting reconcile rewrite a decision would put new design judgments where no one reviews them as decisions.

## Graduate — retire a shipped doc without losing its *why* (ADR-026)

The gap: a thought **fully shipped** but still carrying durable *rationale* — the *why this shape* and especially the **rejected alternatives** ("we tried X, reversed it because Z"). Prune loses that; consolidate has no in-flight thought to merge into. Without graduate, reconcile can only amend-and-keep → `thoughts/` grows monotonically. Graduate is the exit ramp: **retire the thought with a forwarding address.**

**Destination: `blueprints/decisions.md`** — ONE curated, lean file. Merge the residue into the right **feature-section** (`## <topic>`, related decisions consolidate — not 1:1 fragments), then **prune the emptied thought**. Only the *why* graduates; *how-it-works* lives in nav's `codebase-map` (duplicate it and they drift). Distil to the 3-part section format — **the call** · **how it shows up in the system** · **what was rejected / deferred** — plain and high-level; drop status / palette / commit hashes (git's / code's). The full format spec is `blueprints-spec.md` (single source); the three parts above are the working gist this skill carries to graduate offline.

**Eligibility — graduate only a *settled* call.** A deferred branch is fine (it becomes the "rejected / deferred" part); what blocks graduation is *genuinely-unsettled* design still being decided — that stays in `thoughts/`. ("Has future content" ≠ "live design" when the future is *parked*, not *in-flight*.) **Graduate respects the amend boundary** — it *relocates* an already-made decision's record, never authors one; if distilling would require deciding what the design should now be, stop → `/shape:elicit`.

**Keep `decisions.md` clean — fold-forward + prune, never a status-flagged graveyard.** Every section is *currently operative*. When a later decision reverses one: has a successor → fold the tombstone forward (`Supersedes: X — because Z`) then drop the stale section; abandoned → write a live `Rejected: X — because Z` then drop it. The anti-re-litigation guard lives in a *live* section; **git is the deep archive**. **Curation criterion — keep what git makes *expensive* to recover, drop what it makes *cheap*:** a live decision's *why* + rejected-alternatives (reconstructing a months-old debate from scattered commits is costly) earns its line here; *what-happened* and superseded sections (a `git diff`/`log` away) do not — "git has it" is true, but *retrieval cost* is the test, not recency. This is reconcile's **consolidate** (merge → verify → remove) pointed at a section. (Deliberately diverges from this repo's own `docs/adr/`, which keeps superseded ADRs with a `Status` flag — meta-history is low-volume; an operational `decisions.md` stays clean. Naming follows: living-per-topic → feature-section; immutable append-log → date+number.)

**Currency sweep (three blueprints tiers + the canon ledger):**

| tier | predicate | action |
|---|---|---|
| `thoughts/` | "implemented + settled yet?" | graduate / prune / amend / keep |
| `decisions.md` | "still operative, or superseded?" + "do any two live sections contradict?" | fold-forward + drop the stale section (never delete the *guard*) |
| `mockups/` | "is the decision it served settled, and its residue absorbed?" | retire (salvage → prune) / stamp / keep — see the mockups tier below (ADR-037) |
| `docs/core/amendments.md` | "absorbed by a position summon, or reversed by later reality?" | prune the entry / amend / keep — **never write core itself** (the door, ADR-041); this sweep is the ledger's exit, so it doesn't become the fourth grow-only layer (ADR-026/017/037 lineage) |

**Routing between the two durable layers (ADR-041).** `blueprints/decisions.md` (this skill's) and `docs/core/` (position's) are both durable; route by altitude: **approach / bet / feature-why → `decisions.md`** — graduate here as below; **settled axiom / principle (defines what the thing IS) → core** — the verdict is **canon-grade**: *recommend* `/shape:position` graduation and stop, exactly like the decision-change → `/shape:elicit` hand-off. reconcile never writes core — without this reminder, a canon-grade thought's best sweep outcome is demotion into decisions.md.

The cross-decision-contradiction check is genuinely new: two decisions converged in separate `elicit` sessions can quietly conflict, which per-doc currency won't catch — a single curated file makes it visible. Detection is **push-primary** (a reversing decision declares `Supersedes: X` at birth in elicit) + **pull-safety-net** (this sweep). Marking a superseded section is fact-sync (the reversal already happened) — inside the amend boundary. The **human view of `decisions.md` is a `🧭 Decisions` layer in `overview.html`**, rendered by `/shape:align` — reconcile maintains `decisions.md`, align projects it. *Not a consensus skill* — "confirming consensus" is a property of the converge verbs, maintained by this sweep, not a verb (ADR-026).

## The mockups tier — retire on ship, with a forwarding address (ADR-037)

`mockup`'s own rule — detail-level artifacts **retire on ship**, structural locks carry a freshness stamp — has its enforcement point *here*: at mockup time nothing is shipped yet, and no other verb returns to `mockups/` post-ship. Without this sweep, `mockups/` grows monotonically (committed-by-default makes every decision leave a folder nothing deletes) — the same bug graduate fixed for `thoughts/`, one tier down.

**A mockup exists to represent what the running system cannot yet represent; once code absorbs it, representation transfers and it exits** (ADR-039). One question per folder: *"does this still represent something the code doesn't have?"* Three ordered pre-conditions, then the verdict:

1. **Decision settled/shipped?** Same evidence as thoughts: code grep, `head -12` headers. ("No one cites it" alone never triggers prune — an uncited mockup for an in-flight decision is kept.)
2. **Residue absorbed?** The pick **and any deferred branch** must be *verifiably* recorded in the owning thought / `decisions.md` — verified by reading, not assumed (mockup's step 5 should have written it; confirm it did). This is a judgment check, not a grep — present per collect-don't-conclude, mark `uncertain` rather than guess.
3. **Inbound links resolved?** Grep `blueprints/` for citations into the folder — this one *is* mechanical; list the hits as evidence.

**Default direction:** a folder failing all keep-clauses gets prune as the *default proposal* (the per-file gate stands — propose, don't presume). The razor exists so a sweep is one gated round, not three (ADR-039).

| situation | action |
|---|---|
| ①②③ all pass | **prune** — git is the deep archive; `git log --follow -- <path>` + `git checkout <sha> -- <path>` restores it |
| ② fails — the pick or a deferred branch lives only in the mockup | **salvage → then prune**: write the line into the owning doc, incl. a pointer (`rendered candidates: git history at mockups/<date>-<topic>/`), verify it landed, then prune — consolidate's merge → verify → remove, pointed at a mockup |
| whole decision parked (plan's *later*) | **keep + parked stamp** ("parked, intent as of `<date>`") — the converge job is dormant, not done; re-rendering on un-park is waste (= code won't absorb it for now — the deferred intent still needs a representative) |
| **canon-pinned** — cited from the project's CORE/canon docs (the part code can *never* absorb, e.g. texture sampling) | **keep + freshness stamp** (amend) — ONLY canon can pin: citations from sibling blueprints docs (thoughts/plans) are re-pointable (salvage → a `git log --follow` pointer) and never block retirement. Re-check each sweep like a `decisions.md` section: "still operative, or is the running system the ground truth now?" |
| decision in-flight | **keep**, untouched (= code hasn't absorbed it yet) |
| folder untracked | **hard gate** — resolve tracked status before any other action; untracked never entered git, so prune would be permanent destruction |

**Tracked-check discipline:** ask git's ledger, not the disk — `git ls-files`, never `ls`. The depth-unanchored `mockups/` gitignore trap means a folder can sit on disk looking committed while git never held it (field case: 65 untracked mockup folders in one repo).

**Salvage respects the amend boundary:** it *relocates* a recorded pick/deferral, never authors one. If ② fails because the design judgment itself is unclear — stop, recommend `/shape:elicit`.

## The seam with `nav`

reconcile's currency check **consumes the file headers `/nav:sync` maintains**: load-bearing files with a `head -12` header make "is this implemented?" answerable without reading bodies — the strongest staleness signal. No headers → suggest `/nav:sync` first; reconcile still works on grep alone, just less cheaply.

## Offer to re-sync the board (don't auto-run)

After the tree is trimmed, the rendered board may lag the cleaned `thoughts/`/`plans/`. **Offer — never auto-call — `/shape:align`** to re-sync `plan.md` + `overview.html`, via `AskUserQuestion` (offer-next-action, ADR-007/015). **Guarded + one-shot:** offer only when something actually changed this run and a `blueprints/` board exists; always include a "leave the renders, I'll re-sync later" opt-out; don't re-offer after the pick. `align` is collaborative → runs in-session. An offer, not a call.

**First, consumption-gate the human render (blueprints-spec § Weight-adaptive).** If the project still carries an `overview.html` that **no one reads** (solo / single-owner, or the user says they never open it), the right move is **retire it, not refresh it** — propose deleting it (git holds it) + recording the deviation in `plan.md`'s header, so the board stops being a maintenance + stale-render tax. An unread human render is exactly the kind of stale artifact this sweep exists to clear: a maintained projection with no reader is upkeep + a lie-risk, and `plan.md` already serves the human who wants the status (the visual board becomes on-demand). Only when the human render has a **real reader** does the offer stay "refresh it via align".

## Discipline (do not skip)

- **Check read-only; every write gated + per-file.** Never amend, delete, or merge on inference alone.
- **Amend syncs facts, never re-decides** — `+` line states only what built code shows; needs a design judgment → stop, recommend `/shape:elicit`. Verbatim except the confirmed line.
- **Untracked = irreversible.** Verify tracked/untracked before any amend/move/delete; never trust an unverified `mv` then `rm`. For `mockups/`, check with `git ls-files`, never `ls` (the gitignore trap).
- **A mockup retires only after its residue is verified absorbed and its inbound links resolved** — salvage → verify → prune, never raw delete; parked decisions and stamped structural locks stay (ADR-037).
- **Evidence over tidiness.** Cite the signal behind every verdict; mark `uncertain` rather than over-claim.
- **Consolidate beats delete** when live design remains; **graduate, don't hoard** a shipped doc that still holds *why* (ADR-026) — settled calls only, relocates never authors.
- **Don't regenerate the board here** — that's `/shape:align`.

## Output

- A per-doc currency report: verdict + evidence + proposed action (keep · amend · prune · consolidate · graduate · retire-mockup).
- (On confirmation) a reconciled `thoughts/`, `plans/` **and `mockups/`** tree — facts amended in place, wholly-stale docs pruned/consolidated, shipped-but-rationale docs graduated into `decisions.md` sections, shipped decisions' mockups retired (residue salvaged, git holding the corpus), all under the safety rules.
- For any decision-change: a recommendation to converge it in `/shape:elicit` (not rewritten here).
- A guarded, one-shot **offer** to run `/shape:align` — never an auto-call.

## Companion skills

- **`/shape:align`** — re-renders `plan.md` + `overview.html` after the tree is trimmed.
- **`/shape:elicit`** — where new `thoughts/` docs (the inputs reconcile audits) come from.
- **`/shape:mockup`** — where `mockups/` folders come from; it states retire-on-ship, reconcile executes it.
- **`/nav:plan`** — where `plans/` docs come from.
- **`/nav:sync`** — adds `head -12` headers so reconcile reads implementation status cheaply.
- **`/nav:audit`** — the code-side analog (assesses code shape; reconcile assesses doc currency).

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.

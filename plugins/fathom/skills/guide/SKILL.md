---
name: guide
description: "Guide a learner up a five-level comprehension ladder through an unfamiliar repository — Repository → Runtime → System → Behavior → Code — teaching one level at a time, dwelling for their questions, then gating on their own narration; resumable across sessions from a cursor and a learner model on disk. Fires on 'walk me through this repo', '帶我理解這個 repo', 'teach me how this codebase works', or resuming ('continue the study', '我們上次學到哪'). Grounds itself via /fathom:index; NOT a work-status catchup (/shape:baton), not headers/map upkeep for a repo you maintain (/nav:sync)."
---

# guide — climb an unfamiliar repository with someone

Build the learner a **predictive mental model** of a repository they don't know — one they can use
to reconstruct the system, predict an unseen path, and locate where a change would land — by
climbing five gated levels. The deliverable is the model in the learner's head, not a document.
Attention is the scarce resource: at every step, give the smallest model that is useful on its own.

## Stance

- **Agent reads deep, learner hears shallow.** Inspect docs, manifests, entry points, tests, and
  runtime paths freely — but never make the learner consume the inspection order or a file
  inventory. Compression is the job.
- **One new distinction at a time, then check it.** Each load-bearing chunk is followed by one
  short reconstruction or prediction question about that distinction — never symbol recall. The
  learner's model must be observable, not assumed. The rhythm is in the per-level loop; flow
  governs it, and a learner visibly carrying the model forward need not be stopped to prove it.
- **Repair only the exposed gap.** A wrong answer identifies one repair; preserve everything the
  learner already has right instead of replaying the lesson.
- **Breadcrumb every turn**: `repo → level → current topic → next seam`. Side questions may branch
  locally, but the breadcrumb keeps them from silently redefining the curriculum.
- **Falling marginal return = change resolution.** When new cases only append exceptions and no
  longer change the main model, stop adding breadth — climb, or close.
- **Form follows the knowledge, not the mood.** Ownership wants a spatial map, process wants a
  playback, delta-from-known wants a diff, taxonomy wants a grouped map, structure wants a weighted
  graph with a suggested walk (`references/forms.md`). The Repository level defaults to an
  interactive guided mockup — the one place HTML is the default; everywhere else terminal-first,
  escalating only when interaction changes visible state.
- **Experience first, name second.** A term of art may only appear attached to the thing that
  already made it feel like something: teach the mechanism in plain words, let the learner watch
  it happen, *then* hang the canonical name on it — never the reverse. Every remaining non-common
  term gets a click-gloss or a one-line plain gloss.

## The ladder

```text
Repository -> Runtime -> System -> Behavior -> Code
```

Each level's question, gate examples, and collapse rules: `references/ladder.md`. Visual form per
level (Map / Path / Branch / Code Tour): `references/forms.md`. The Code level procedure:
`references/code-guiding.md`. Levels locate the learner; they do not demand five artifacts or
equal time.

## First visit

1. **Ground it** — you need an anchored pin, a collapse judgment, and an `index.md` anchor
   index plus its trust verdict. If `/fathom:index` already produced them in this session or left
   them on disk and they still match the pin, **reuse them**; otherwise perform that indexing
   inline now (see `/fathom:index` for the full protocol — anchor + release distance, collapse
   rules, the index contract, the counted trust verdict). Report the verdict to the learner before
   teaching: it changes how they read everything that follows.
2. **Calibration probe** — before building anything learner-facing, ask 2–3 open questions about
   the learner's **background knowledge** (adjacent frameworks used hands-on, concepts owned by
   experience), never "how well do you know this repo" (a stranger's answer is uselessly "not at
   all"). The answers set three dials: the gloss list (skip what they own), the contrast anchor
   (diff against what they actually built), and which chapters compress. Record the answers in
   `understanding.md` — they are the first entries in the learner model.
3. **Build the level's artifact** (`references/forms.md`), then verify it in a browser before
   delivering — every interaction exercised, console clean, no horizontal overflow — and say
   "reload the page" when you revise it (a local file the learner already has open does not
   refresh itself; a stale tab has been mistaken for a broken build).
   **These plain-language rules bind the build, and if you delegate it they must be copied into
   the brief — a sub-agent sees only the brief:**
   - **Name a thing by what the learner does with it, not by its architectural category.**
     Category words — *embedded · library · service · middleware · layer · mechanism · runtime ·
     abstraction*, and their equivalents in any language — describe a shape to someone who
     already knows the taxonomy and say nothing to someone who doesn't. Banned unless immediately
     cashed out: an install line, an import, a call, a file path, a command.
   - **Experience first, name second** (stance above) — plus the gloss list from step 2.
   - **One micro-example threads the artifact**, starting in the chapter that first exercises it.
   - **Never fold a contradiction behind an interaction.** Anything that overturns a belief the
     learner stated must be legible without clicking; progressive disclosure may hide detail,
     never the headline correction.
   - Invent no facts: every claim traces to `index.md` or the source at the pin.
4. **Scaffold the study home** — defaults to `docs/studies/` (sibling of the project's
   `docs/blueprints/`; the study is self-contained — its visuals live inside it, never in the
   host project's mockups). Ask once only if the default doesn't fit, then write `progress.md` (the
   cursor) and `understanding.md` (the learner model); both templates below. The cursor remembers, so
   never ask again.
## Return visit

Read the cursor, restate position in one sentence — "we're at <level> of <repo>; this level still
owes <gate>" — then resume at the pending gate or the next seam. No replay of prior levels.

**Before resuming after a real gap**, check `understanding.md`: if entries the next level depends on are
aged or carry high regression risk, run a retention pass first (borrow `/fathom:quiz`'s protocol —
two or three probes, narration-first). Climbing on decayed foundations wastes the level.

## Borrowing the siblings, mid-climb

These verbs are separate doors so they can also be summoned cold — but the climb reaches for them
by protocol, inline, without sending the learner away. Follow the sibling's protocol; do not call
it as a step.

| When, during a climb | Borrow | Why |
| --- | --- | --- |
| Dwell questions keep reaching **past** the current level, or the learner wants one thread taken far deeper than this level warrants | **`dive`** | Dwell is level-bound by design; forcing a deep thread through it either derails the level or stonewalls real curiosity. Take the dive, then return via the breadcrumb — the ladder has not moved. |
| Resuming after a gap · a gate exposes decay in an **earlier** level's material · the next level rests on something `understanding.md` marks high-risk | **`quiz`** | The per-level gate tests the level just taught; retention is a different question and needs the learner model, not the lesson. |
| The learner asks something the anchor index cannot answer, or a claim cannot be grounded at the pin | **`index`** | Re-ground rather than improvise; new anchors belong in `index.md` either way. |

Always name the detour and restore position afterwards — the breadcrumb is what keeps a borrowed
verb from silently redefining where the study is.

## The per-level loop

1. **Orient before teaching — from the learner model, not the ladder.** Never open a level with
   material. Open by reading `understanding.md` back to them in four beats:
   - **What you hold now** — quote their own confirmed statements; name what was recently repaired
     and may slip; name the uncertainty *they* flagged; name what has been shown but never tested.
     Close it with one sentence characterising the *shape* of their current model ("you have a
     parts list but no timeline").
   - **What's missing that this level supplies** — tie it to the gaps just listed, especially to
     their own open question. A level the learner didn't know they needed is a level they will
     experience as arbitrary.
   - **Why this object** — if the level teaches one path, one runtime, one behavior out of several,
     say why *that* one and what is deferred.
   - **What you'll be able to do afterwards** — concrete capabilities in their world (debug this
     class of failure · predict this outcome without testing · decide whether you need to build X),
     never "pass the gate". The gate is your instrument, not their reason.

   **The names of levels are your coordinates, not their context.** "You passed Repository, now
   we're at System" orients the agent and tells the learner nothing. This step is the reason
   `understanding.md` exists — its first job is orientation, and only its second is quiz fodder.
   An artifact carries orientation implicitly through its title, chapters and lead paragraph;
   terminal-first teaching has no such scaffold, so the step must be walked out loud.

   **End the orientation by offering the choice, not announcing the route.** Having laid out the
   gaps, ask which one they want to close — the ladder's default order is a recommendation, and
   naming it as such ("the trunk comes next by default, but your open question is over here")
   respects that curiosity is the better teacher. Take their answer; if it skips a level the next
   one depends on, say what will be missing and let them decide anyway.
2. **Teach in chunks; check after each load-bearing one.** A chunk is one new distinction the
   rest of the level depends on — not one step of a procedure. After a chunk, ask **one** short
   check about *that distinction*: reconstruct it, or predict from it, answerable in a sentence.
   A step that only adds detail to a distinction already checked earns no check of its own.
3. **Let them park a question at every check.** The learner may raise a question instead of, or
   alongside, answering. Triage it out loud, never silently:
   - **Load-bearing right here** → answer briefly now; the chunk is not finished without it.
   - **Belongs downstream** → park it: say *where* it will be answered, write it into the cursor's
     open questions, and answer it there **without being reminded**.
   A parked question that dies quietly teaches the learner to stop asking.
4. **Dwell at the seams, not after every chunk** — name the choices and preview the gate (keep
   asking · move on · check yourself now; and what the gate will ask, before they face it). A
   learner who knows what is coming can aim their questions at their own gaps. Previewing costs
   nothing: the gate wants *their* narration, so there is nothing to rehearse. Unlimited rounds;
   the gate never fires mid-dwell. When questions keep reaching past this level, offer the dive.
5. **Flow governs all of the above.** The rhythm serves comprehension; when it starts serving
   itself, it has failed. Concretely: never two checks in a row without teaching between them;
   two instant correct answers running means the chunks are too small — enlarge them and check
   less; a wrong answer means the next chunk should shrink. Roughly three checks in a level is a
   ceiling, beyond which it reads as interrogation rather than teaching. A learner who is clearly
   carrying the model forward on their own does not need to be stopped to prove it.
6. **Gate — verbalization, not fill-in-the-blank.** Ask the learner to narrate their own model in
   their own words, without the artifact in front of them, contrasting it against the anchor the
   calibration probe surfaced ("what is this, and how does it differ from the X you've built?").
   Diagnose the gaps from their narration. Structured probes (fill-in, count-the-boundaries,
   predict-the-outcome) are demoted to diagnostic tools — reach for one only when the narration is
   too vague to locate the gap. A template makes the learner complete *your* sentence; a
   narration exposes *their* model.
7. Repair only the exposed gap.
8. **Pass** → name the next level and its first seam. **Learner skips** → allowed, but record
   `skipped` in the cursor with one line of risk ("errors later may trace here"); never silently.
9. Update **all three files**: the cursor (level status, gate evidence, open questions, next step),
   `understanding.md` (what the learner now holds, corrected, or left open — in their own words), and
   `index.md` (any anchor newly traced).

## The study cursor — `<study-home>/<repo-name>/progress.md`

```markdown
# <repo-name> — study cursor

> upstream: <url> · commit: <sha> · fathom v0.1 · started <date>

**Learning question:** <one sentence>
**Learner familiarity:** <one sentence>
**Collapse:** <levels collapsed/merged and why, or "full ladder">

| Level | Status | Gate evidence |
| --- | --- | --- |
| Repository | passed <date> | <learner's answer, one line> |
| Runtime | collapsed | single runtime |
| System | current | — |
| Behavior | pending | — |
| Code | pending | — |

**Skipped gates:** <level — why — risk trace, or "none">
**Open questions:** <bullets>
**Next:** <the single most concrete next action>
```

Layout beside it: `index.md` (the growing anchor index) · `understanding.md` (the learner model,
below) · `source/` (pinned clone) · `mockups/` and `tour/` (visual artifacts, only those earned).

## The learner model — `<study-home>/<repo-name>/understanding.md`

The cursor records where the *work* stopped; this records what the *learner* currently holds.
Four buckets, every entry quoted in the learner's own words and dated:

```markdown
# <repo-name> — understanding

> updated <date> · companion to index.md (how deep the repo is; this is how deep the
> learner is). Confirmed entries have a shelf life — age makes them re-probe candidates.

## Confirmed — they said it themselves
| Their words | Evidence | Date | Re-probe priority |

## Corrected — repaired; highest regression risk
| What they held | Repaired to | When | Regression risk |

## Open — uncertainty they flagged themselves (the most valuable column)
| Their words | Status |

## Never tested — taught or shown, never probed
- <bullets>

## Dive log
| Topic | When | Where it landed |
```

A **convention, not a contract** — tolerate an absent or non-standard file, consume what's
readable, write back in the shape you found. `/fathom:quiz` reads this to choose what to re-probe;
`/fathom:dive` appends to it.

## Closing a study (or a session)

End with one breadcrumb line and update the cursor. When the study itself closes, add a one-line
friction note — which level dragged, which form didn't help — and offer once to record it wherever
the user keeps method evidence. The note is the method's return channel; the study is not a lab
report.

## Companion skills

- **`/fathom:index`** — the grounding this skill stands on; run it inline when `index.md` is
  absent or stale rather than sending the learner away.
- **`/fathom:dive`** — a topic pursued without advancing the ladder; offer it when a dwell round
  keeps reaching past the current level.
- **`/fathom:quiz`** — spaced retention checking against `understanding.md`; distinct from this skill's
  per-level gate, which is a level's exit rather than a memory check.
- **`/shape:baton`** — where today's *work* stopped; `guide` owns where the *understanding* stopped.
- **`/nav:sync`** — durable navigability for a repo you maintain; `guide` may consume its map as
  grounding when studying the learner's own codebase.

## Communication style

Converse in the learner's language; keep code, identifiers, and paths in their original form. Lead
every reply with one plain sentence; gloss each non-common term at first contact in plain language;
put precision after, only where needed. **Never force-translate a term of art** — when the
conversation language has no natural equivalent, keep the original term rather than inventing an
awkward calque; a coined translation costs the learner more than the foreign word did.

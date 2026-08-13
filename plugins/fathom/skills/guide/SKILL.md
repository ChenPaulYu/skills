---
name: guide
description: "Guide a learner up a five-level comprehension ladder through an unfamiliar repository — Repository → Runtime → System → Behavior → Code — teaching one level at a time, dwelling for their questions, then gating on their own narration; resumable across sessions from a cursor and a learner model on disk. Fires on 'walk me through this repo', '帶我理解這個 repo', 'teach me how this codebase works', or resuming ('continue the study', '我們上次學到哪'). Grounds itself via /fathom:sound; NOT a work-status catchup (/shape:baton), not headers/map upkeep for a repo you maintain (/nav:sync)."
---

# repo — climb an unfamiliar repository

Build the learner a **predictive mental model** of a repository they don't know — one they can use
to reconstruct the system, predict an unseen path, and locate where a change would land — by
climbing five gated levels. The deliverable is the model in the learner's head, not a document.
Attention is the scarce resource: at every step, give the smallest model that is useful on its own.

## Stance

- **Agent reads deep, learner hears shallow.** Inspect docs, manifests, entry points, tests, and
  runtime paths freely — but never make the learner consume the inspection order or a file
  inventory. Compression is the job.
- **One new distinction at a time, then one gate question.** After each explanation, ask one short
  reconstruction or prediction question about the distinction just introduced — never symbol
  recall. The learner's model must be observable, not assumed.
- **Repair only the exposed gap.** A wrong answer identifies one repair; preserve everything the
  learner already has right instead of replaying the lesson.
- **Breadcrumb every turn**: `repo → level → current topic → next seam`. Side questions may branch
  locally, but the breadcrumb keeps them from silently redefining the curriculum.
- **Falling marginal return = change resolution.** When new cases only append exceptions and no
  longer change the main model, stop adding breadth — climb, or close.
- **Form follows the knowledge, not the mood.** Ownership wants a spatial map, process wants a
  playback, delta-from-known wants a diff, taxonomy wants a tree, structure wants a weighted
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

1. **Ground it** — you need an anchored pin, a collapse judgment, and a `soundings.md` anchor
   index plus its trust verdict. If `/fathom:sound` already produced them in this session or left
   them on disk and they still match the pin, **reuse them**; otherwise perform that sounding
   inline now (see `/fathom:sound` for the full protocol — anchor + release distance, collapse
   rules, the index contract, the counted trust verdict). Report the verdict to the learner before
   teaching: it changes how they read everything that follows.
2. **Calibration probe** — before building anything learner-facing, ask 2–3 open questions about
   the learner's **background knowledge** (adjacent frameworks used hands-on, concepts owned by
   experience), never "how well do you know this repo" (a stranger's answer is uselessly "not at
   all"). The answers set three dials: the gloss list (skip what they own), the contrast anchor
   (diff against what they actually built), and which chapters compress. Record the answers in
   `bearings.md` — they are the first entries in the learner model.
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
   - Invent no facts: every claim traces to `soundings.md` or the source at the pin.
4. **Scaffold the study home** — defaults to `docs/studies/` (sibling of the project's
   `docs/blueprints/`; the study is self-contained — its visuals live inside it, never in the
   host project's mockups). Ask once only if the default doesn't fit, then write `_index.md` (the
   cursor) and `bearings.md` (the learner model); both templates below. The cursor remembers, so
   never ask again.
## Return visit

Read the cursor, restate position in one sentence — "we're at <level> of <repo>; this level still
owes <gate>" — then resume at the pending gate or the next seam. No replay of prior levels.

## The per-level loop

1. Teach with the level's form (`references/forms.md`), leading with one plain conclusion.
2. **Dwell** — stop and invite the learner's questions before testing anything. Repair what those
   questions expose (wording, a missing gloss, a form that isn't landing). Unlimited rounds; the
   gate never fires mid-dwell.
3. **Gate — verbalization, not fill-in-the-blank.** Ask the learner to narrate their own model in
   their own words, without the artifact in front of them, contrasting it against the anchor the
   calibration probe surfaced ("what is this, and how does it differ from the X you've built?").
   Diagnose the gaps from their narration. Structured probes (fill-in, count-the-boundaries,
   predict-the-outcome) are demoted to diagnostic tools — reach for one only when the narration is
   too vague to locate the gap. A template makes the learner complete *your* sentence; a
   narration exposes *their* model.
4. Repair only the exposed gap.
5. **Pass** → name the next level and its first seam. **Learner skips** → allowed, but record
   `skipped` in the cursor with one line of risk ("errors later may trace here"); never silently.
6. Update **all three files**: the cursor (level status, gate evidence, open questions, next step),
   `bearings.md` (what the learner now holds, corrected, or left open — in their own words), and
   `soundings.md` (any anchor newly traced).

## The study cursor — `<study-home>/<repo-name>/_index.md`

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

Layout beside it: `soundings.md` (the growing anchor index) · `bearings.md` (the learner model,
below) · `source/` (pinned clone) · `mockups/` and `tour/` (visual artifacts, only those earned).

## The learner model — `<study-home>/<repo-name>/bearings.md`

The cursor records where the *work* stopped; bearings records what the *learner* currently holds.
Four buckets, every entry quoted in the learner's own words and dated:

```markdown
# <repo-name> — bearings

> updated <date> · companion to soundings.md (how deep the repo is; this is how deep the
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

- **`/fathom:sound`** — the grounding this skill stands on; run it inline when `soundings.md` is
  absent or stale rather than sending the learner away.
- **`/fathom:dive`** — a topic pursued without advancing the ladder; offer it when a dwell round
  keeps reaching past the current level.
- **`/fathom:quiz`** — spaced retention checking against `bearings.md`; distinct from this skill's
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

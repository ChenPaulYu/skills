---
name: repo
description: "Study an unfamiliar repository into a predictive mental model by climbing a five-level ladder — Repository → Runtime → System → Behavior → Code — one reconstruction-or-prediction gate per level, resumable across sessions via a study cursor on disk. Fires on 'study this repo', '帶我理解這個 repo', 'learn how this codebase works', or resuming ('continue the study', '我們上次學到哪'). NOT a work-status catchup (/reflect:catchup), not headers/map upkeep for a repo you maintain (/nav:sync), not a decision-space survey (/shape:elicit's survey leg)."
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
  already made it feel like something (teach 想→做→看, then gloss "ReAct" on it — never the
  reverse). Every remaining non-common term gets a click-gloss or a one-line plain gloss.

## The ladder

```text
Repository -> Runtime -> System -> Behavior -> Code
```

Each level's question, gate examples, and collapse rules: `references/ladder.md`. Visual form per
level (Map / Path / Branch / Code Tour): `references/forms.md`. The Code level procedure:
`references/code-guiding.md`. Levels locate the learner; they do not demand five artifacts or
equal time.

## First visit

1. **Anchor** — record upstream URL, full commit SHA, the learning question, and learner
   familiarity. Clone into the study home (pin the commit) if not already present.
2. **Collapse judgment** — decide upfront how many levels this repository needs
   (`references/ladder.md` § Collapse rules), and say so before climbing. A small library must not
   receive big-framework ceremony.
3. **Reconnoitre and produce the soundings file** — read deep (the load-bearing core personally;
   periphery may go to recon sub-agents reporting facts with `file:line`), cross-check, then land
   `soundings.md` in the study home: the agent-facing anchor index. Its contract: it answers
   *behavior* questions (not exhaustive coverage); it **grows downward** — every level descended
   and behavior traced writes new anchors back; every anchor is `file:line` at the pin; the source
   clone is **never annotated** (one inserted line shifts every anchor). Consult it before any
   deep read.
4. **Calibration probe** — before building anything learner-facing, ask 2–3 open questions about
   the learner's **background knowledge** (adjacent frameworks used hands-on, concepts owned by
   experience), never "how well do you know this repo" (a stranger's answer is uselessly "not at
   all"). The answers set three dials: the gloss list (skip what they own), the contrast anchor
   (diff against what they actually built), and which chapters compress.
5. **Build the level's artifact** (`references/forms.md`) and verify it in a browser before
   delivering — interactions, console, overflow.
6. **Scaffold the cursor** — study home defaults to `docs/studies/` (sibling of the project's
   `docs/blueprints/`; the study is self-contained — its visuals live inside it, never in the
   host project's mockups). Ask once only if the default doesn't fit, then write `_index.md`
   (template below); the cursor remembers.

## Return visit

Read the cursor, restate position in one sentence — "we're at <level> of <repo>; this level still
owes <gate>" — then resume at the pending gate or the next seam. No replay of prior levels.

## The per-level loop

1. Teach with the level's form (`references/forms.md`), leading with one plain conclusion.
2. **Dwell** — stop and invite the learner's questions ("這層有什麼你想追問的？"). Repair what
   their questions expose (wording, missing gloss, a form that isn't landing) before testing
   anything. Unlimited rounds; the gate never fires mid-dwell.
3. **Gate — verbalization, not fill-in-the-blank.** Ask the learner to narrate their own model
   ("不看頁面，用你自己的話講：這是什麼、跟你熟的 X 差在哪"), then diagnose the gaps from their
   narration. Structured probes (fill-in, count-the-boundaries, predict-the-outcome) are demoted
   to diagnostic tools — used only when the narration is too vague to locate the gap.
4. Repair only the exposed gap.
5. **Pass** → name the next level and its first seam. **Learner skips** → allowed, but record
   `skipped` in the cursor with one line of risk ("errors later may trace here"); never silently.
6. Update the cursor (level status, gate evidence, open questions, next step) and write any newly
   traced anchors back into `soundings.md`.

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

Layout beside it: `soundings.md` (the growing anchor index) · `source/` (pinned clone) ·
`mockups/` and `tour/` (visual artifacts, only those that were earned).

## Closing a study (or a session)

End with one breadcrumb line and update the cursor. When the study itself closes, add a one-line
friction note — which level dragged, which form didn't help — and offer once to record it in the
method lab (for Paul: `etudes/method/iterations/`). The note is the method's return channel; the
study is not a lab report.

## Companion skills

- **`/reflect:catchup`** — where today's *work* stopped; `repo` owns where the *understanding*
  stopped.
- **`/nav:sync`** — durable navigability for a repo you maintain; `repo` may consume its map as
  grounding when studying your own codebase.
- **`/shape:elicit` (survey leg)** — maps a *decision* space; `repo` maps a *system* that already exists.

## Communication style

Converse in the learner's language (for Paul: Traditional Chinese, Taiwanese phrasing); keep code,
identifiers, and paths in English. Lead every reply with one plain sentence; gloss each non-common
term at first contact in plain language; put precision after, only where needed. Never
force-translate a term of art — when the conversation language lacks a natural equivalent, keep
the English term (ruled in trial: 「方言」 rejected for "action format").

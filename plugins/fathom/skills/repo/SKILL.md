---
name: repo
description: "Study an unfamiliar repository into a predictive mental model by climbing a five-level ladder — Repository → Runtime → System → Behavior → Code — one reconstruction-or-prediction gate per level, resumable across sessions via a study cursor on disk. Fires on 'study this repo', '帶我理解這個 repo', 'learn how this codebase works', or resuming ('continue the study', '我們上次學到哪'). NOT a work-status catchup (/reflect:catchup), not headers/map upkeep for a repo you maintain (/nav:sync), not a decision-space survey (/shape:survey)."
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
- **Terminal diagrams by default.** Escalate to an HTML artifact only when interaction changes
  visible state, or the learner asks (`references/forms.md`).

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
3. **Reconnoitre without presenting** — build a candidate model from implementation evidence; mark
   every load-bearing claim known / assumed / unknown. Then present the first level.
4. **Scaffold the cursor** — ask once where the study home lives, then write `_index.md` (template
   below). Never ask again; the cursor remembers.

## Return visit

Read the cursor, restate position in one sentence — "we're at <level> of <repo>; this level still
owes <gate>" — then resume at the pending gate or the next seam. No replay of prior levels.

## The per-level loop

1. Teach with the level's form (`references/forms.md`), leading with one plain conclusion.
2. Ask the level's gate question — one reconstruction or prediction probe.
3. Repair only the exposed gap.
4. **Pass** → name the next level and its first seam. **Learner skips** → allowed, but record
   `skipped` in the cursor with one line of risk ("errors later may trace here"); never silently.
5. Update the cursor: level status, gate evidence (the learner's actual answer, one line), open
   questions, next step.

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

Layout beside it: `source/` (pinned clone) · `tour/` (visual artifacts, only if any were earned).

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
- **`/shape:survey`** — maps a *decision* space; `repo` maps a *system* that already exists.

## Communication style

Converse in the learner's language (for Paul: Traditional Chinese, Taiwanese phrasing); keep code,
identifiers, and paths in English. Lead every reply with one plain sentence; gloss each non-common
term at first contact in plain language; put precision after, only where needed.

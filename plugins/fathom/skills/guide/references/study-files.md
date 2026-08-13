# The study files — cursor and learner model templates

Both live in the study home, beside `index.md` (the growing anchor index), `source/` (the pinned
clone), and `mockups/` / `tour/` (visual artifacts, only those earned).

A **convention, not a contract** — tolerate an absent or non-standard file, consume what's
readable, write back in the shape you found. `/fathom:quiz` reads the learner model to choose what
to re-probe; `/fathom:dive` appends to it.

## The study cursor — `<study-home>/<repo-name>/progress.md`

Records where the *work* stopped.

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

## The learner model — `<study-home>/<repo-name>/understanding.md`

Records what the *learner* currently holds. Four buckets, every entry quoted in the learner's own
words and dated.

```markdown
# <repo-name> — understanding

> updated <date> · companion to index.md (how deep the repo is; this is how deep the
> learner is). Confirmed entries have a shelf life — age makes them re-probe candidates.

## Learner angle — two axes, from the calibration probe; re-read at every level entry
- Goal: <what they want from this repo>
- Immediate task: <if one exists — the strongest route signal>
- Curious about: <their words>
- Known adjacent: <systems/concepts owned by experience — the gloss-skip list>
- Contrast anchor: <the thing they built that this repo diffs against>
- Preferred form: <tiebreaker only — form follows the knowledge>

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

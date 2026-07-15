# reflect:retrace routing and differentiator check

> **Result:** PASS as a static contract audit (16/16 prompts have one explicit owner); repository compatibility gates pass separately. This is not an independent model-routing judge. The originating behavior is real, but cross-project generalization remains a one-case observation.

## What this check tests

`reflect:retrace` risks collapsing into four neighbors: current-state catchup, current-codebase tour, ordinary chronological recap, or the planned evaluative retro. This check reads the new source frontmatter, its Boundaries/Completion criterion, sibling contracts, and ADR-079/082/084, then asks whether a prompt has one honest owner.

PASS means the written routing contract is unambiguous. It does not claim that every model will select the skill without a future live judge.

## Prompt matrix

| # | Prompt shape | Expected owner | Result | Deciding distinction |
|---:|---|---|---|---|
| 1 | “Retrace how we got from the prototype to the current persistence model.” | `reflect:retrace` | PASS | Explicit causal development path |
| 2 | “I feel left behind after all these architecture turns; show why each stage led to the next.” | `reflect:retrace` | PASS | Left-behind signal + stage transitions |
| 3 | “Make an interactive page that explains our development journey with the real probes.” | `reflect:retrace` | PASS | Historical alignment artifact + witnesses |
| 4 | “Before the next phase, align me on how the last six decisions accumulated.” | `reflect:retrace` | PASS | Periodic causal re-entry, not prioritization |
| 5 | “Why did fixing the first renderer expose the next data-model problem?” | `reflect:retrace` | PASS | Pressure-bearing bridge between stages |
| 6 | “Where are we right now, what is open, and what should I do next?” | `reflect:catchup` | PASS | Present cursor only |
| 7 | “I am back after a week; resume from HANDOFF.md and git.” | `reflect:catchup` | PASS | Durable present-state reconstruction |
| 8 | “Summarize everything we did today in order.” | Plain request | PASS | Chronological recap has no skill owner (ADR-079) |
| 9 | “Walk me through what this codebase does and how the modules cooperate.” | `nav:tour` | PASS | Present system model, not development path |
| 10 | “Explain why the current repository has these boundaries, then let me correct your model.” | `nav:tour` | PASS | Current codebase + shared-model correction |
| 11 | “Render or refresh the bilingual module map.” | `nav:map` | PASS | Durable repo-structure projection |
| 12 | “Where did our process waste time, and what one practice should we change?” | Planned `reflect:retro` | PASS | Evaluative process diagnosis; retrace must not absorb it |
| 13 | “What durable lesson from this session is worth keeping?” | `reflect:observe` | PASS | Selective keeper, not full context |
| 14 | “Decide whether the unresolved renderer issue is Now or Future.” | `shape:align` | PASS | Priority choice, not historical explanation |
| 15 | “We still disagree about what identity means; converge the principle.” | `shape:elicit` | PASS | New decision, not retracing a settled arc |
| 16 | “Show three candidate layouts for a future architecture-history page.” | `shape:mockup` | PASS | Render-to-decide a future shape, not render an accepted retrace |

## Differentiator check against retired summarize

| Required retrace machinery | Present in source skill | Why a recap skips it |
|---|---|---|
| Six-field stages | PASS | A recap normally groups events by time, not prior state/pressure/evidence/decision/status/next pressure. |
| Bridge test | PASS | The skill checks whether evidence supports pressure, decision responds to it, and next pressure arises from the result. |
| Provenance labels | PASS | Recorded/Inferred/Unknown prevents code shape from laundering a plausible historical why into fact. |
| Status separation | PASS | Discussed/decided/implemented/verified/committed/deferred remain distinct. |
| Outline correction gate | PASS | Rendering stops until the user confirms stage boundaries and bridges. |
| Concrete witnesses | PASS | Abstract stages require inspectable data, commands, metrics, state comparisons, or media when available. |
| Browser-verified artifact | PASS | The completion criterion requires a dated, reachable, interactive artifact and real browser checks. |

## Behavioral evidence and limit

The originating 2026-07-15 development arc exercised the intended sequence: an initial stage outline failed to restore alignment; the user required explicit stage-to-stage causality; the corrected outline was accepted; a Chinese interactive page then embedded real data-shape examples, state comparisons, probe metrics, and audio. Browser interaction and media delivery were verified during that work.

That is one behaviorally complete case, not two independent cases. The observation therefore stays `raw`, and this finding does not claim a forward test on a second project. The trip-wire remains: run `reflect:retrace` on another long, multi-decision arc and verify that the six-field bridge restores understanding that catchup, tour, or a plain recap does not.

## Repository and surface verification

- `node scripts/validate-codex-skills.mjs` — PASS, 37 plugin skills.
- `--compat-audit` and `--codex-compat` — PASS in a temporary committed clone, including 20/20 canaries, 16/16 negative fixtures, 3/3 lifecycle-hook smokes, 1/1 preservation smoke, 2/2 release smokes, 37/37 coverage, and frozen Claude contract. The real worktree remained unstaged; the temporary commit exists only to satisfy the frozen-contract gate's intentional requirement that source be clean relative to git.
- Site-map browser pass — PASS: four-member reflect roster, `/reflect:retrace` card, 37-skill count, Chinese toggle, retrace search filter, responsive document width, and zero console errors.
- Browser verification also found and fixed a pre-existing unescaped apostrophe in the frame graph blurb that had prevented the site's inline JavaScript from parsing.

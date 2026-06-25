---
name: format
description: "Sweep one relay project's thoughts and bring their frontmatter up to the current format — like /nav:sync for headers, but for relay thought metadata. Checks every thought parses + conforms (quoted subject, required thread, well-formed thread/re/relate links) and fixes the non-conformant, gated by a diff. Syntactic only — it never changes what a thought SAYS. Use when the user asks to \"format the relay\", \"unify the thought format\", \"lint the thoughts\", \"fix the frontmatter\", or after the format spec evolves and old thoughts drift. One project at a time (not the whole repo). Content verb; the format owner is plugins/relay/CLAUDE.md. (relay 0.4.0)"
---

# format — sweep one project's thoughts to the current frontmatter spec

The relay analog of `/nav:sync`: as the format spec evolves (a new field, a quoting rule), old thoughts drift. **format** sweeps **one project**, finds every thought whose frontmatter doesn't parse or doesn't conform, and fixes it — **syntactic conformance only, never the meaning**, gated by a diff.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else the current dir if it has `relay.yml`, else **ask the user** (never assume cwd; see CLAUDE.md). **One project at a time** (`projects/<name>/thoughts/`) — never the whole repo at once (too big; and conformance is per-project). Writes fixes to thought files; shows a diff and is gated.

The format being conformed to is owned by [`plugins/relay/CLAUDE.md`](plugins/relay/CLAUDE.md) → *Format contract* — this skill enforces it, it doesn't define it.

## Two layers — the script can't do it alone

format runs on **two layers** (ADR-051's *code vs LLM* split made concrete):

- **Layer 1 — the script (deterministic syntax).** `lint.mjs` catches what a regex can: unparseable YAML, a missing required field, an unquoted `subject`/link. Mechanical, fast, no judgment.
- **Layer 2 — the agent (semantics + judgment).** What a regex *can't*: reading a thought to infer **which discussion it belongs to**, noticing a **cross-discussion link worth adding**, spotting **structural drift** in the body. This is the part the script will never do — it needs you to actually read.

A pass is **both**: lint to find the mechanical breaks, *then* read to fix the semantic ones. Skipping Layer 2 leaves a thought that "passes lint" but is still mislinked.

## Process

### Step 1 — Resolve + pull + pick the project
- **Resolve who's running** (git author email → `relay.yml`), **pull**, and **pick the one project** to sweep (ask if unclear — don't fan out over all projects).

### Step 2 — Layer 1: lint (deterministic)
Run the bundled checker over that project's `thoughts/`:
```bash
node {skill}/scripts/lint.mjs <content-repo>/projects/<name>/thoughts
```
It reports, per file, the mechanical issues. **node absent? degrade to this recipe** — check each frontmatter by eye: it **parses as YAML** (the two usual breaks: an unquoted **`subject` with a colon**; a **`thread`/`re`/`relate` value starting with `[`**, read as a sequence); `date` · `by` · `subject` · **`thread`** present; `subject` quoted; `thread`/`re` quoted markdown links; `relate` a list of quoted links.

**Mechanical fixes → apply automatically**: quote an unquoted `subject`; quote a bare `[...]` link. Pure syntax, zero judgment.

### Step 3 — Layer 2: read for semantic conformance (the agent's job)
Now **read each thought** and use judgment the lint can't:
- **Infer a missing / wrong `thread`** — read what the thought actually does. A new-topic opener → `thread` is **itself** (root). A reply or follow-up → trace what it answers/continues and set `thread` to that **discussion's root** (don't just default to self — that would wrongly orphan a reply into its own discussion).
- **Infer a missing `re`** — if the body says "re [some-id]" but the frontmatter has no `re`, lift it into the field.
- **Suggest a `relate`** — notice when a thought leans on **another discussion's** decision/thought (a cross-reference in the prose) and **propose** adding it to `relate`; the lint can't see semantic relevance.
- **Catch structural drift** — a `review` missing its `## Review` shape; an **FYI that smuggles an `@`-ask** (mislabeled); a conclusion that should be pointed-to from `log.md`. Flag these.
- **Propose, don't guess** — every Layer-2 change is **surfaced for the gate**, never silently applied; if you can't tell which discussion a thought belongs to, **ask**.
- **Never touch the body's meaning** — you may lift an inline "re [id]" into the field, but you do not rewrite what the thought *says*.

### Step 4 — Gate + commit
**Show the diff. Wait for OK**, then commit + push. (Editing others' thoughts is allowed *here* because it's syntactic conformance under a human gate — not a silent rewrite; see Discipline.)

## Discipline
- **Syntactic only** — format makes a thought *parse* and *conform*; it never changes what the thought **says**. That is the line that lets it edit an otherwise-immutable thought (and a counterpart's) — a broken/non-conformant file is a defect, fixing the defect isn't rewriting the record.
- **Always gated** — every fix shows a diff first; format never silently mutates the stream.
- **One project, not the repo** — sweep the project asked for; don't fan out.
- **Don't invent links** — a missing `thread`/wrong `re` that needs judgment is surfaced, not guessed.
- **Pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Rewrite a thought's wording while "formatting" | Syntactic only — format never changes meaning; that would corrupt the record |
| Sweep every project in the repo at once | One project at a time (too big; conformance is per-project) |
| Guess a missing `thread` / `relate` target | Surface the judgment call; inventing a link mislinks the graph |
| Inject backlinks into thoughts to "complete" links | Backlinks are computed, never stored — storing one mutates an immutable target |

## Companion skills
- **`/relay:report`** / **`/relay:review`** — write thoughts *to* this format; `format` retro-fits old ones (the `/nav:sync` relationship).
- **`/relay:digest`** — relies on conformant `thread`/`re`/`relate` to stitch + compute; `format` keeps that input clean.
- **`/relay:settle`** — the other regenerating sweep (the decision ledger); `format` sweeps the thoughts' shape.

## Helper script (ADR-051)
`scripts/lint.mjs` (node) is the **fast-path** checker — regex-based conformance (it catches the known break/shape issues, not full YAML validation). It is **not a hard dependency**: when node is absent the skill degrades to the Step-2 recipe. The script only **reports**; the **fixes** (and all judgment) are the skill's, under the gate.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.

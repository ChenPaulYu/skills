---
name: observe
description: "Surface THIS session's candidate durable learnings, let the user PICK which to keep, then write the chosen one(s) into a knowledge base (docs/observations/) — the first step of a repo-evolution loop (lived experience -> observation -> ADR -> skill). Candidate-first: list the non-obvious mechanisms/insights as one-line claims with why-worth-keeping, the user decides (zero / one / several), only then dedupe + write the picks in the established format (status: raw; promote by evidence, not session count). Summoned; read-only except the chosen observation file(s). Output goes to $SKILLS_REPO/docs/observations/ when the env var is set, else the current project's docs/observations/. Often run after /manage:summarize (the complete recap). Fires on \"observe this\", \"record a learning\", \"capture this insight\", \"write an observation\", \"log what we learned\", \"what's worth observing\". Also invokable as /manage:observe."
---

# observe — harvest this session into a durable observation

Capture **durable, reusable learnings** from the current session into a **knowledge base** (`docs/observations/`) — the first step of a repo-evolution loop: **lived experience → observation → ADR → skill change.** Where `/manage:summarize` is the complete objective recap, observe is **selective** — it keeps only the insight(s) worth keeping.

**Candidate-first — the agent proposes, the user disposes.** Do **not** silently auto-distill one and write it. Surface the session's candidate learnings as a short list, the user picks which (if any) to keep, and only the picks get written. The user owns what enters their knowledge base; observe's job is to *find and offer* the candidates, not to decide for them.

Optional focus from the user: **$ARGUMENTS** (if given, bias the candidate scan toward that area; else scan the whole session).

## Step 1 — Locate the knowledge base

```bash
TARGET="${SKILLS_REPO:-.}"            # central repo if set, else the current project
ls "$TARGET/docs/observations" >/dev/null 2>&1 && echo "ok: $TARGET/docs/observations" || echo "no observations dir at $TARGET/docs/observations"
date +%F
```

- Prefer `$SKILLS_REPO` (a central knowledge base); else fall back to the **current project's** `docs/observations/`.
- If neither exists, ask the user where observations should live (or whether to create `docs/observations/` in the current project) — don't write to a guessed path.
- Use the real `date +%F` output for the filename + frontmatter — never guess the date.

## Step 2 — Surface the candidate learnings (don't write yet)

Scan THIS session for the **non-obvious, reusable mechanisms or principles** worth keeping — what future-you would want to know, not a play-by-play. A keeper names a *signal* and a *move*, grounded in what actually happened. For each candidate, fix:

- the non-obvious insight / mechanism / failure mode it surfaced;
- the reusable principle, as a one-sentence **claim**;
- the evidence (this session) + roughly how durable it is (one-off vs. likely-recurring).

Produce a **short list (≈2–5), ranked by value. Write nothing yet.** (If `/manage:summarize` ran earlier, mine its recap for candidates. If `$ARGUMENTS` named a focus, bias toward it but still scan wider.) If the session genuinely surfaced nothing keepable, say so plainly — don't manufacture a candidate to have something to show.

## Step 3 — Present the candidates, let the user pick

Show the list — each candidate as **one line: the claim · why it's worth keeping · rough durability** (and "overlaps existing `<slug>`" when your dedupe sense already flags one). Then let the user choose **zero, one, or several**.

This is the **gate**: nothing is written until the user picks. Don't pre-decide or auto-write the "best" one — the user owns what enters their knowledge base; observe finds and offers, the user disposes. You may flag a recommended pick, but the choice is theirs. Only the picked candidate(s) proceed to Step 4.

## Step 4 — Dedupe against existing observations

```bash
ls "$TARGET/docs/observations/"
```

If the learning **overlaps an existing observation**, prefer **appending/strengthening that file** (add a new evidence case, move it toward `landed` per the evidence gate) over creating a near-duplicate. Surface the overlap and let the user pick new-vs-append.

## Step 5 — Write the picked observation(s) in the established format

Write **each** candidate the user picked (one file each; if they picked several, repeat this for each). Path: `"$TARGET/docs/observations/<YYYY-MM-DD>-<kebab-topic>.md"`. Read one existing file first to mirror its shape:

```markdown
---
date: <YYYY-MM-DD>
status: raw
---

# <the learning as a full-sentence claim>

> Source: <one line — this session, what it was doing>   (optional)

## What prompted it
<the situation that surfaced it>

## The signal
<the non-obvious mechanism / principle — the core>

## Evidence so far
- **Only case (<date>, <context>)**: <what grounds it>.

(One case → stays `raw`. <the trip-wire / what would promote it>.)
```

Conventions:
- **Progressive disclosure**: title is a claim; sections lead with their point; `head -12` yields the gist.
- **Link** related ADRs and observations relative to the knowledge-base root (e.g. `docs/adr/0xx-...md`, `[[observation-slug]]`); no `./` or `../`.
- **status: raw** for a single case (promotion is by *evidence*, not session count). Add a trip-wire line for what would graduate it.

## Step 6 — Flag, then hand back (don't over-reach)

- Note whether each written observation likely **feeds an existing ADR** (name it) or is a **candidate for a future ADR** — but **do NOT write the ADR**. Observations are raw evidence; ADRs come later, deliberately.
- **Do not** edit any code, `SKILL.md`, manifest, or site map — observe only adds the observation(s).
- Show each written file's path + contents (or the diff if you appended); let the user review/commit. Don't commit unless asked.

## Companion skills

- **`/manage:summarize`** — the complete, objective recap of the session; its output is the raw material observe distills.
- **`/manage:catchup`** — where the work stands now (observe captures what's worth *keeping*; catchup orients you in the moment).

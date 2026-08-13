# settle templates — settlement block and Decision file format

> Moved verbatim from the pre-ADR-109 SKILL.md body; the templates are unchanged, only re-homed.
> The rules governing *when* and *how* to use them (the promotion test, the five recorder fuses,
> the citation law) stay in the SKILL.md body — this file carries only the literal template text.

## The settlement block

Every close (Discussion or Issue) is preceded by this block, shown verbatim to the user before posting (author sign-off gate):

```
Resolution: <why this may close — done, answered, received, duplicate, not needed, covered by D-0xx>
Reason: <concise reason>
Decision required: Yes/No
Recorder: <@who — only when Decision required is Yes>
Follow-ups: #42, #43
```

## Decision file format

```markdown
---
id: D-021
status: active            # | superseded
superseded-by:            # D-0xx
source: <Discussion/Issue link>
settled-by: @who
date: 2026-07-22
---
# D-021 — <one-sentence conclusion>

## Question        how this arose: background, why decide now
## Deliberation    objective summary: named positions, alternatives
                    considered, key evidence, how it converged
## Conclusion      the authoritative wording (derived views cite only this)
## Reason          the main rationale
## Consequences    effects and follow-ups (#xx)
```

# Findings

How the tooling actually behaves, learned while editing this marketplace — so the next editor
does not step on the same nail. Decisions go to [`docs/adr/`](docs/adr/README.md); usage
patterns go to the skill they correct, or to a workspace idea when the owner is unclear.

## When to write one

Something about Claude Code, Codex, Cursor, the manifests or the build behaved differently than
expected, and you found the mechanism. A "how the tool works" note stays a finding; if it led
to weighing alternatives, record the decision in the topic's ADR and link the finding.

## Shape

One file per finding, `YYYY-MM-DD-<short-kebab-slug>.md`:

```markdown
---
date: 2026-05-28
status: raw | confirmed | promoted | superseded
---

# <One-line takeaway in plain language>

What I tried, what happened, the root cause, the fix, and how to recognize it next time.
```

- `confirmed`: reproducible, root cause understood.
- `promoted`: folded into a guide, ADR or skill — link where it landed at the top.
- `superseded`: the tooling changed; keep a one-line "superseded by X" header.

Be concrete (actual commands, errors, paths). Negative results count; don't delete them.

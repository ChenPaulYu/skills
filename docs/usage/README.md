# Skill usage ledger

Monthly snapshots (`YYYY-MM.json`) of how often each skill in this marketplace fired, counted from local Claude Code and Codex transcripts. Transcripts are only retained about five weeks, so these files are the durable evidence behind ADR-009's retirement rule.

Regenerate a month (overwrites the same file, stable key order, clean diffs):

```bash
node scripts/skill-usage.mjs --month 2026-11 --write
```

Without `--write` it prints a table; `--json` prints the JSON. Default month is the current month to date.

Each file has `coverage` (sessions seen and the earliest event, so you can tell when retention truncated a month), and `skills` (every roster skill, zeros included). Non-roster skill names seen in transcripts appear only in the local table/`--json` output, never in committed files. Per skill: Claude Code `model` (Skill tool calls), `slash` (typed commands), distinct `sessions`; Codex distinct `sessions` that read the skill; `claudeSubagent` count; `lastSeen`.

Files carry skill names and counts only: no project names, paths, session ids, or prompt text.

ADR-009's "zero fires across three months" check reads the last three files here.

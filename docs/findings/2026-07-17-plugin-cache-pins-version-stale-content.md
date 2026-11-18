---
date: 2026-07-17
status: raw
---

# Plugin installs are version-pinned snapshots — an unbumped edit reaches zero sessions

> Source: same-day discovery while plugin-izing a private marketplace. Editing
> `plugins/**` and pushing felt like shipping; it wasn't.

## What happened

Claude Code installs a plugin by **copying it into a version-keyed cache**
(`~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`) and serving
sessions from that copy. A directory-source marketplace *feels* live — the
manifest is read from the working tree — but the installed plugin is not.
`claude plugin update` compares **version numbers only**: same version, no-op,
even when file contents differ.

Measured consequence: all six of this marketplace's plugins were serving
month-old snapshots (one plugin three minor versions behind its own manifest),
and a same-day 32-file sweep across every skill reached **zero** sessions
despite being committed, pushed, and validator-green. Nothing warned; stale
skills read as current ones.

Second face of the same trap, found the same hour: a fresh plugin install
recorded itself in `installed_plugins.json` but its cache directory was never
written — the plugin resolved in the CLI (`plugin details`) yet loaded in no
session. Uninstall + reinstall fixed it; version-compare `update` could not.

## The principle

> **A cache keyed by version turns "bump the version" from bookkeeping into
> the delivery mechanism.** Any edit that doesn't move the key is, from every
> consumer's point of view, unshipped — and nothing tells you.

Flat `~/.claude/skills/<dir>` installs (symlink, live) don't have this
property; the cache rule is the price of plugin namespacing.

## What changed

- Root CLAUDE.md maintenance rules gain: every plugin content change ships
  with a version bump + `claude plugin update` per machine.
- Companion check when debugging "my skill edit isn't firing": compare the
  cache dir's content, not just the repo's — and verify the cache dir exists
  at all.

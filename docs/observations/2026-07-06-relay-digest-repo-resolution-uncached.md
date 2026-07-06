---
date: 2026-07-06
status: landed
---

# relay skills re-resolve the coordination repo's location from scratch on every invocation, with no memoization across runs

> **TL;DR**: `digest` (and the sibling skills that share its "Scope" resolution step — `report`/`review`/`settle`) locate the repo via `$RELAY_REPO`, else cwd-has-`relay.yml`, else ask the user. When neither of the first two hits, that resolution is paid **every single time**, in full, with no memory of a prior successful resolution on the same machine. The cost isn't the lookup logic itself — it's that a one-time fact (where does this user's relay repo live) is never persisted, so it's re-derived per session.

## What prompted it

Running `/relay:digest` with `$RELAY_REPO` unset and the working directory not the relay repo. Resolution required a multi-step filesystem hunt: a `find / -maxdepth 4` (too shallow, nothing), then `find /home/worzpro -maxdepth 6` (failed, exit 1, permission errors on unreadable subdirs), then a narrower `find /home/worzpro/Desktop/dev -iname relay.yml` that finally succeeded. Three round-trips spent on a fact that was already true the first time it was ever resolved.

## The signal

The skill's fallback chain (env var → cwd → ask) is fine as a **cold-start** path, but it has no **warm-path**: nothing writes the resolved location anywhere after it's found, so the next invocation — same machine, same user, same repo — pays the identical cost. The fix is small and locatable: after Step 1 resolves a repo location (by any of the three fallback routes), persist it somewhere durable-but-local (e.g. a project-local cache file, or a note in the user's Claude settings) and check that cache before falling through to `$RELAY_REPO` → cwd → filesystem-search/ask. This turns a recurring cost into a one-time one.

Secondary, smaller note: the "ask the user" fallback is the documented behavior when env var and cwd both miss — an agent that instead free-improvises a filesystem search (as happened here) is deviating from the skill's own instruction, independent of the caching gap above. Both are true at once: the skill should cache, and an agent following it correctly should ask rather than hunt.

## Evidence so far

- **Only case (2026-07-06, rytho-ai / accord)**: `$RELAY_REPO` unset, cwd was a sibling repo (`rytho-ai`, not `accord`). Resolution cost 3 `find` invocations before landing on `accord/relay.yml`.

(One case → would have stayed `raw`; landed same-session instead, see Update below.)

## Update (2026-07-06) — fix landed same session

Patched directly (no separate ADR — user opted for an immediate skill edit over the ADR gate): `plugins/relay/CLAUDE.md` → *Locating the content repo* now has a step 2 (between `$RELAY_REPO` and cwd-has-`relay.yml`) that checks a cached path at `~/.cache/relay/repo-path`, and instructs every skill to write its resolved path there after any successful resolution (steps 2–4). All seven `SKILL.md` Scope lines that restate the resolution chain (`digest`, `format`, `register`, `review`, `report`, `settle`, `launch`) were updated in the same pass to mention the cache, per the plugin's own "same commit" discipline for shared-contract edits.

## Links

- Skills: `/relay:digest`, `/relay:report`, `/relay:review`, `/relay:settle`, `/relay:register`, `/relay:format`, `/relay:launch` (all share the same Scope resolution step, now all patched).
- Fixed in: `plugins/relay/CLAUDE.md` (owner) + all 7 `skills/*/SKILL.md` (restatements).

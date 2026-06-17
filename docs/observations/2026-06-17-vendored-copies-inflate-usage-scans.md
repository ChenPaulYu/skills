---
date: 2026-06-17
status: raw
---

# When scanning a monorepo for "how is library X used", exclude X's own vendored copy (.venv / site-packages) first — it double-counts and can reverse the conclusion

> Source: deciding which of a library's ~100 public methods to keep vs drop, by scanning a sibling monorepo for real consumer usage before pruning the API.

## What prompted it

Before removing legacy methods from a library, the question was "which are actually used by the projects that consume it?" — a usage scan to ground the keep/drop call (don't prune from the API surface or from assumptions; measure real callers). The first scan grep'd the consuming monorepo for the library's method names and reported that ~48 supposedly-niche methods were used heavily. That pointed at "build sub-API homes for many of them before removing."

## The signal

**The scan had grep'd the library's OWN vendored copy installed inside a consumer's virtualenv** (`afterhours-dj/backend/.venv/lib/.../youtube_toolkit/api.py` — an *older, pre-refactor* copy, same version string, different content). Those files are the library's own source; of course they "call" its own methods everywhere. That self-traffic is not consumer usage — but it dominated the counts and would have driven the wrong decision (keep ~48 methods nobody outside calls).

**Excluding `.venv` / `site-packages` / vendored trees, the real consumer surface collapsed to 4 files using essentially only the 5 facade APIs** (+ 3 flat methods, all with facade equivalents). That *reversed* the plan: from "build homes for the valuable orphans" to "YAGNI — big-bang remove, migrate the one experiment file, re-add on demand." Same grep, opposite conclusion, entirely because of which files were counted.

Two compounding traps to name:
- **Generic-name collision** inflates further: `.get(` / `.video` / `.status` match `dict.get()` and unrelated objects. Filter to *distinctive* names (multi-word / underscored, e.g. `get_video_info`, `advanced_search`) — they don't collide.
- **A vendored copy can be a different version than your working source** (here: 2998-line god-class vs the refactored 149-line source, both stamped the same version) — so it also misleads about *what the consumer currently runs* and whether a version bump will actually update them.

The move: before measuring consumer usage, **exclude vendored copies** (`-not -path '*/.venv/*' -not -path '*/site-packages/*' -not -path '*/node_modules/*' -not -path '*/vendor/*'`), then **count only distinctive identifiers**, then read the surviving call sites to confirm they're real.

## Evidence so far

- **Only case (2026-06-17, library API-pruning decision)**: first scan → "~48 orphans used a lot" (all from a consumer's `.venv` copy of the library itself). After excluding `.venv` + filtering to distinctive names → 4 real consumer files, ~3 distinct flat methods, all with facade equivalents. Decision flipped from "re-home the orphans" to YAGNI big-bang removal; the removal then landed cleanly (migrated 1 file, deleted ~100 methods, tests green). Related: [[caller-aware-deprecation-for-layered-api]] (the retirement technique this scan unblocked).

(One case → stays `raw`. Graduation = a second time a usage/impact scan is grounded in a repo that vendors its own deps; or the inverse biting — a real consumer missed because an over-broad exclude dropped it.)

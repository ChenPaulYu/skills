# ADR-146: Portable workspace views and eight Shape entrances

Status: Accepted
Date: 2026-11-13

## Decision

Add an explicit offline HTML graph export to the skill-owned workspace helper.
The renderer uses original record IDs/edges/bodies and a bundled template; source
records remain authoritative. Focus, search, type/status filters and record navigation
progressively reveal actual relations. No CDN, parallel graph store or editor.
Exports use fresh paths outside the home repository and never overwrite existing files.

Retire align, park and catchup as redundant entrances, explicitly requested by the
owner after the pilot's reconstruction/save loop and blueprint migration. This is
ADR-107's claimed-by-a-survivor case, not deletion inferred from low usage:

| Retired entrance | Surviving capability |
|---|---|
| align | status verifies work; explicitly requested priorities update the original project/legacy board using the user's choices |
| catchup | status consumes existing handoffs, checks HEAD plus dirty/untracked evidence, reports fallback/uncertainty and next action |
| park | wrap preserves goal/reasons/rejected approaches/progress/checks/next action in original work records |

Plain status stays read-only. A graph request authorizes only the explicit export.
Legacy documents are retained and read tolerantly; their unique live context is
not discarded on a stale SHA. Migration and tidy remain explicitly scoped work.
Required legacy protocols move into status/tidy references, with no dependency on
retired skill packages. There is no alias or automatic session cursor.

## Packaging and installation

The minimal Codex profile now selects status/wrap instead of park/catchup. Related
skills remain self-contained through generated resources; plugin versions and
adapter release metadata advance together. Installation uses sync-installed and
preserves the selected profile and unrelated skills/agent overrides. Old global
entries must actually disappear, including pinned native plugin caches.

## Acceptance

Keep reader JSON/API/exit behavior and all behavioral assertions. Add export
provenance, escaping, no-overwrite and no-source-write checks. Exercise real rendered
interactions at two desktop sizes and narrow layout. Validate a standalone package
on a second operating system, distinguishing fixture round trips from independent
agent use. Record machine-specific evidence in private project records, not here.
Run generated-resource/catalog/compatibility and staged gates before committing.
A cross-machine test does not claim production installation on that other machine.

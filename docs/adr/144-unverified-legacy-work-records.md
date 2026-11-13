# ADR-144: Imported work is not freshly verified work

Status: Accepted for the workspace pilot
Date: 2026-11-13

## Decision

Allow `unverified` for every work-record type during an explicitly authorized legacy
import. Preserve original state assertions as attributed source claims; imported
files do not become completed work, an active implementation commitment or new
execution authority. Unknown original dates remain unknown, separate from import dates.

A new file location cannot establish whether an old plan shipped or an old variant
was selected. Preserve original bytes in Git before normalization; keep expensive
external artifacts at verified locators when the home repo's storage policy excludes
them. A locator and hash are evidence about bytes, not their backup.

## Reader behavior

Read these records and their relations normally, expose the unverified status and
keep them out of the active queue unless a fresh check establishes active work.
Existing nonstandard documents remain readable. No automatic bulk migration or
new artifact retention authority follows from this convention.

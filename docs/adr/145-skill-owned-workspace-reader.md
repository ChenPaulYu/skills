# ADR-145: The workspace reader travels with skills

Status: Accepted for the workspace pilot
Date: 2026-11-13

## Decision

Shape status owns the read-only reader and launcher in its scripts/ directory.
The existing shared-resource builder bundles them verbatim into work-record
consumers, so each installed skill remains self-contained. These generated copies
have one editable implementation; the validator compares regenerated resources.

A home repository owns project records, repository mappings and artifact locators.
It supplies an explicit root to the helper, not a second parser. Existing home-repo
commands may delegate to a located skill script, with an explicit override and a
clear missing-installation error. They must not silently select another data root.

## Preserved boundary

Keep projects, status, show, graph and check JSON contracts, diagnostics, exit codes,
read-only behavior, legacy reading and mapped Git context. Graph remains data;
this change adds no interactive graph UI, mutation API or activation.

The Python API and old home-repo command remain compatibility entrances. Move the
behavioral tests with their owner and compare actual project/graph results across
the move. Test standalone generated skill packages and compatibility delegation.

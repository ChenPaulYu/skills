# ADR 148 — Explicit workspace connection with shape-setup

**Status**: accepted
**Date**: 2026-11-14
**Partially supersedes**: ADR-107's setup retirement for the new workspace-only role; extends ADR-146's entrance roster.

## Context

The owner explicitly requested a distinct first-time project connection instead of
hiding enrollment inside the first Idea save. Status is read-only and the workspace
pilot intentionally keeps code and private working records in separate repositories.
ADR-107 retired an unclaimed environment/archetype scaffolder; restoring that payload
would not address repository identity, existing registrations or instruction ownership.

## Decision

Add `shape-setup` as Shape's ninth entrance, explicitly invoked. It resolves the
selected code and home repositories, reuses an existing project identity, creates only
a needed project.md and portable code-side instruction pointer, and verifies the real
projects/status/check path through the existing reader. It adds no mutation CLI,
application scaffold, stack chooser, automatic migration or placeholder work records.

Generated instruction files are updated through their declared owner. Ambiguous
homes, duplicate mappings and unknown instruction ownership require a user decision
before dependent writes. An unchanged repeated setup preserves bytes and dates.

## Why

- Current explicit demand differs from the old unclaimed environment-setup role.
- A separate enrollment action keeps ordinary reads/saves from acquiring cross-repo writes.
- Matching real mappings and respecting generated instructions are behavior beyond mkdir.
- Reusing the shared reader keeps setup and later status on the same representation.
- Small, idempotent registration avoids duplicate boards, stage folders and setup tasks.

## Consequences

- Add the source skill and focused connection reference, bundling the existing reader
  and common record/storage protocols for standalone use.
- Update live family/catalog guidance and Codex metadata/inventory; preserve install
  profile selection. Build/all profiles include the entry via existing patterns.
- Keep the former environment scaffolder retired. Legacy migration remains separately
  scoped, and setup does not establish feature completion or authorize providers.
- Verify isolated new/repeated/existing/generated-instruction connections, source
  preservation and the zero-record read path. Behavioral evidence is recorded privately;
  compilation/discovery checks do not by themselves prove user-level behavior.

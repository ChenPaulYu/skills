---
name: digest
model: sonnet
description: "Show the viewer's Relay obligations, blockers, and non-binding notices from GitHub. Use for what needs me or entering a workspace with relay.yml; read-only, without acting on the listed work."
---

# Digest — show what needs the viewer

When a workspace has `relay.yml`, run once on session arrival before unrelated work.
Return the inbox and the next native action; the digest does not execute that action.

## Collect

1. **Helper available:** use the bundled reducer if it exposes the GitHub-native interface.
   Trust its set logic, then inspect linked objects needed to explain the result.

   ```
   node plugins/relay/skills/digest/scripts/compute-state.mjs --repo OWNER/REPO --for LOGIN [--policy FILE]
   ```

   Omitted repo/viewer use the authenticated `gh` context. Read `references/collection.md`
   for fixture input, policy thresholds, or cross-viewer options. A cross-viewer result uses
   the authenticated account's permissions; disclose the caveat and recheck an unexpectedly
   empty result rather than treating a mistyped login as proof of no work.
2. **Readable GitHub state without a compatible helper:** read `references/semantic-contract.md`
   and apply that contract to authenticated primitives. Do not substitute notification prose.
3. **Blocked collection:** name the exact missing tool, permission, or API surface and what
   remains unknown. A blocked result is not an empty successful inbox.

Report the tier used. Read the semantic contract only for direct-state fallback or diagnosis;
the normal helper path does not load or independently reimplement its full classifier.

## Present

Lead with blockers and degraded collection, then the inbox summary and triage wrappers.
Group source obligations by DECIDE/ACT, REVIEW, and SETTLE; keep lifecycle findings and
non-binding notices separate. For each item include its URL, why it needs the viewer, and
the action that would complete it. Read `references/presentation-and-schema.md` for fields.

Disclose malformed states, truncated collection, unknown stage age, and permission caveats.
Say nothing needs the viewer only after a successful, non-degraded result with no obligations,
findings, notices, or triage wrappers; otherwise describe the remaining uncertainty or work.

## Gates

- Read-only: never react, comment, assign, close, or merge as part of this skill. Listing a
  next action does not authorize it; any continuation follows the user's separate scope.
- Current revision matters; stale approval is not a current verdict.
- No reply is not agreement; an approved PR is not a recorded Decision; silence does not
  finish a Discussion. Do not infer responsibility or completion from prose.
- Keep the reducer's distinctions and caveats visible rather than flattening everything into
  a to-do list. Explain the result plainly; implementation details belong in the references.

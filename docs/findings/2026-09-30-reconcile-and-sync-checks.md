# Reconcile and sync — packaging and scenario checks

> 2026-09-30 · Scope: ADR-131 implementation · Status: local verification

The implementation has one explanation-sync entry and a separate project-record cleanup
entry. These checks establish source consistency, packaging, and browser behavior. They do
not establish a measured improvement in model routing or a full-batch success rate.

## Scenario review

The session model checked the following cases against the final bodies and protocols.
This is an instruction review, not an independent agent experiment or a blind A/B test.

| Request or evidence | Required behavior and owning instruction |
|---|---|
| “Is README current?” | Read-only; nav-sync Workflow 4 |
| “Update README and docs together” | Inventory the entire named set, apply supported corrections, give every file a disposition; nav-sync Workflow 1/5 and docs-render batch procedure |
| A renamed command, changed default, or missing public workflow | Trace implementation and update connected explanations/examples; docs-render claim table and reverse pass |
| Correctly formatted but stale header | Verify content before skipping; header-render Step 2 |
| Accepted design disagrees with implementation | Retain intent and report the discrepancy; sync Gates and reconcile Gates |
| Historical ADR or explicitly future plan | Preserve historical/planned meaning; do not relabel it as implemented |
| Generated section | Edit its owner and regenerate; this change exercised the rule on README/catalog/mirrors |
| Runtime integration cannot be executed | Identify unverified claims and the blocker; do not invent a successful run |
| Plan is only partly shipped or has unrun required checks | Retain remaining work; reconcile Workflow 2 and evidence table |
| Shipped plan still has live rationale | Retain or preserve the rationale before consolidation; reconcile Gates |
| Referenced mockup or unique untracked content | Preserve residue, repair links, and establish destructive authority before retirement |
| Absent/nonstandard design tree | Report the tier, tolerate readable material, do not scaffold merely to clean up |
| Cleanup finds another possible priority | Leave priority choice with the user through align; no automatic planning finale |

## Executed checks

- Catalog and shared-reference tests cover generation, drift, deterministic output, and
  independent reference bundles. The shared blueprint includes its linked board template.
- Marketplace validation covers native, Codex, and Cursor packages and registration of the
  24 active skills. The retired map references are absent from generated packages.
  One concurrent run failed to find a temporary install receipt; the subsequent sequential
  run completed successfully. No validator logic was changed to accommodate that failure.
- Compatibility diagnostics passed 11 canaries, 15 negative fixtures, 2 preservation
  smokes, 2 release smokes, and 24/24 coverage. The optional `--compat-audit` command
  also enforces an adapter-only source freeze, which reports the intentionally changed
  native skills in this marketplace task (ADR-068); the normal marketplace validator is
  the applicable gate.
- Local install verification compared 87 source/installed file pairs for nav and shape,
  checked Cursor symlink targets, and confirmed removal of retired map references.
  Installed versions: nav 0.20.0 and shape 0.24.1; Codex profile `all` was preserved.
- The actual locally served catalog page was opened with a fresh revision URL after edits.
  English and Traditional Chinese reconcile panels, the sync panel, 4-plugin/24-skill count,
  intra-page links, and browser errors were checked. All shape nodes fit the SVG canvas.
  A stale browser load initially retained an old node position; a fresh load verified the
  corrected source, rather than accepting the file edit alone as evidence.

## Limits

No paid model fan-out, fresh-agent behavioral comparison, or production repository-wide
semantic documentation audit was run. Complete-batch reliability remains a property to
observe in actual use; the skill must report incomplete evidence rather than claim success.

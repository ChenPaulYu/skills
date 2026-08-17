# Brief 2 — verification pass (dispatch tier: cheap / mechanical)

> Fill the {{placeholders}}, inject verbatim. Fidelity only — no taste opinions.

You are the verification pass of the atlas export (contract: `references/atlas-protocol.md`).
Verify `studies/{{name}}/atlas/fixture.gen.json` against `studies/{{name}}/source/` @ {{sha}}.

For EVERY graph node: open the file, confirm the `lines` range brackets the named symbol's
actual definition, confirm `io` matches the real signature (parameters in, return/raise out).
For EVERY edge: confirm the relationship exists in code with the stated kind (call = invocation
with those arguments · return = that value flowing back · signal = control/state, not data) and
that the cargo names something real. For the repo scale: recompute with
`node scripts/scan-repo.mjs {{sourceRoot}} {{pkg}}` and confirm magnitudes match and every
fixture import edge appears in the scan (curated omissions are fine; additions are defects).
Schema-check with `validate-fixture.mjs`: required fields, kind enum, no x/y keys,
route steps resolve.

No python (sandbox kills it) — node only. Do not fix anything; do not touch the fixture.

Return: a defect list — each entry: JSON path · what the fixture claims · what the source shows
· file:line evidence. Empty list = pass. Also flag any `"unverified": true` you could resolve.

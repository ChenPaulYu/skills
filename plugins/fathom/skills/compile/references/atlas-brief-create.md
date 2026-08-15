# Brief 1 — creation pass (dispatch tier: strong / judgment-dense)

> Fill the {{placeholders}}, inject verbatim as the worker prompt, attach the scan output.

You are the creation pass of the atlas export (read `references/atlas-protocol.md` first —
it is the contract; the schema is `assets/schema/atlas-fixture.schema.json`).

Target study: `studies/{{name}}/` · pinned SHA {{sha}} · study level reached: {{gate}}.

Author `studies/{{name}}/atlas/fixture.gen.json`:

1. Read the seeds: {{seed file list}}. Treat them as the study's beliefs, not as citable truth.
2. Repo scale: define role tiers with attitude-bearing glosses; assign the modules; use ONLY the
   attached `scan-repo.mjs` output for magnitudes and import edges (you may curate edges
   DOWN for legibility — dropping is allowed and must be listed in your return note; inventing is
   not). Mark modules `enterable` only where behaviors exist.
3. Behaviors per the birth-gate table for level {{gate}}: routes are curated walks, not
   call-graph dumps; every node needs real `file`+`lines` you have personally confirmed in
   `studies/{{name}}/source/`; `io` from the real signature; edges carry kind+cargo; narration
   per the three-tier rules. Corrected-table entries from `understanding.md` become
   「常見誤解」sentences inside the relevant `body`.
4. If a prior `fixture.json` exists, preserve every existing id; note any prose you revised.
5. Uncertainty is marked (`"unverified": true`), never smoothed over.

Return: the fixture path, your curation notes (edges dropped, revisions, uncertainties), and
open questions for the verifier.

#!/usr/bin/env node
/**
 * forms-ledger.mjs — tally the form ledger so recurrence is counted, not remembered.
 *
 * The ledger (`studies/_forms-ledger.md`) records every time an artifact could not hold
 * something: one row per encounter, keyed by a shape-key slug. Promotion rule (see
 * references/form-growth.md): a shape-key seen in **3+ distinct studies** is ripe — three rows
 * from one study is that repo's idiosyncrasy, not an invariant.
 *
 * Usage: node forms-ledger.mjs [path-to-ledger]   (default: studies/_forms-ledger.md)
 * Exit 0 always; prints the tally, ripe keys first.
 */
import { readFileSync, existsSync } from "node:fs";

const path = process.argv[2] || "studies/_forms-ledger.md";
if (!existsSync(path)) {
  console.error(`no ledger at ${path} — create it from the template in references/form-growth.md`);
  process.exit(0);
}

// Rows: | date | study | artifact | shape-key | what didn't fit | handled as |
const rows = readFileSync(path, "utf8")
  .split("\n")
  .filter((l) => l.trim().startsWith("|"))
  .map((l) => l.split("|").map((c) => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1))
  .filter((c) => c.length >= 6 && /^\d{4}-\d{2}-\d{2}$/.test(c[0]));

if (!rows.length) {
  console.log("ledger is empty — nothing has failed to fit yet.");
  process.exit(0);
}

const byKey = new Map();
for (const [date, study, artifact, key, what, handled] of rows) {
  if (!byKey.has(key)) byKey.set(key, { studies: new Set(), rows: [] });
  const entry = byKey.get(key);
  entry.studies.add(study);
  entry.rows.push({ date, study, artifact, what, handled });
}

const tally = [...byKey.entries()]
  .map(([key, e]) => ({ key, studies: e.studies.size, encounters: e.rows.length, rows: e.rows }))
  .sort((a, b) => b.studies - a.studies || b.encounters - a.encounters);

const ripe = tally.filter((t) => t.studies >= 3);
console.log(`${rows.length} encounters · ${tally.length} shape-keys · ${ripe.length} ripe\n`);

for (const t of tally) {
  const mark = t.studies >= 3 ? "RIPE" : t.studies === 2 ? "  ~ " : "    ";
  console.log(`${mark} ${t.key.padEnd(28)} ${t.studies} studies (${t.encounters} encounters): ${[...new Set(t.rows.map((r) => r.study))].join(", ")}`);
}

if (ripe.length) {
  console.log(`\n⚠ ripe for promotion — decide section-vs-artifact per references/form-growth.md §3:`);
  for (const t of ripe) console.log(`  · ${t.key} — ${t.rows[0].what}`);
}

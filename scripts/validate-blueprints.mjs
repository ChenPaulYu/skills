#!/usr/bin/env node
/**
 * validate-blueprints.mjs — gate this repo's OWN blueprints tree against the
 * current convention version.
 *
 * Why this exists: ADR-105's law is "a convention change ships with its
 * migration." ADR-112 changed the convention and wrote migrate's M2 recipe —
 * and then nobody applied it, here or in five other project trees, because
 * nothing anywhere reported the drift. A tree cannot ask to be migrated.
 * `/shape:align` now reports the dialect on every run, but align is summoned;
 * this is the mechanical half, and it runs on every commit via
 * `scripts/hooks/pre-commit`.
 *
 * The repo's own hardest-won lesson, applied to itself: a rule that must be
 * remembered will be skipped; a gate cannot be.
 *
 * Scope is deliberately narrow — this checks the CONVENTION DIALECT, never
 * whether content is stale (that judgment is align's, and mechanizing it would
 * be wrong). Exit 1 on drift, 0 when current.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const errors = [];

// --- v1 / v2 structural fingerprints (retired by ADR-112) -------------------
const LEGACY = [
  ["blueprints/precedents", "the v2 precedents/ tier"],
  ["blueprints/decisions.md", "the v1 single decisions.md"],
  ["docs/core", "the retired core/ canon tier"],
  ["blueprints/core", "the retired core/ canon tier"],
];
for (const [rel, what] of LEGACY) {
  if (existsSync(join(ROOT, rel))) {
    errors.push(`${rel} exists — ${what}, retired by ADR-112. Run /shape:migrate (ledger entry M2).`);
  }
}

// --- v3 requirement: every thought declares a Status in its head ------------
const THOUGHTS = join(ROOT, "blueprints/thoughts");
if (existsSync(THOUGHTS) && statSync(THOUGHTS).isDirectory()) {
  // The Status marker may sit anywhere in its line — the template's own shape is
  // `> <date> · **Status: X** · <tl;dr>`, so anchoring to the line start would
  // reject the convention's canonical form (it did, on first run).
  const VALID = /\*\*Status:\s*(in force|shipped|superseded by\s+\S+)/i;
  for (const f of readdirSync(THOUGHTS).filter((n) => n.endsWith(".md")).sort()) {
    const head = readFileSync(join(THOUGHTS, f), "utf8").split("\n").slice(0, 8);
    const line = head.find((l) => /\*\*Status:/i.test(l));
    if (!line) {
      errors.push(`blueprints/thoughts/${f}: no Status line in its first 8 lines (v3 requires one: in force / shipped / superseded by <file>).`);
    } else if (!VALID.test(line)) {
      errors.push(`blueprints/thoughts/${f}: Status line is not one of the three v3 values — got ${JSON.stringify(line.trim().slice(0, 80))}.`);
    }
  }
}

if (errors.length) {
  console.error(`Blueprints convention check failed (${errors.length}):`);
  for (const e of errors) console.error(`- ${e}`);
  console.error(`\nThe convention is versioned (ADR-105/112). Upgrade with /shape:migrate — its append-only ledger holds the recipe.`);
  process.exit(1);
}
console.log("Blueprints convention ok: tree speaks the current version");

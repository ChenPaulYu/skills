#!/usr/bin/env node
/**
 * validate-fixture.mjs — generic structural gate for ANY atlas fixture.
 *
 * The structural half of a fact-parity checker, generalized: the lab's hand-extraction
 * parity script stays in the method lab; every OTHER fixture — generated ones included —
 * validates here. Usage: node validate-fixture.mjs <fixture.json>
 */
import { readFileSync } from "node:fs";

const path = process.argv[2];
if (!path) { console.error("usage: node validate-fixture.mjs <fixture.json>"); process.exit(2); }
const f = JSON.parse(readFileSync(path, "utf8"));
const defects = [];
const KINDS = new Set(["call", "return", "signal"]);

// no coordinate keys anywhere
(function scan(obj, trail) {
  if (!obj || typeof obj !== "object") return;
  for (const [k, v] of Object.entries(obj)) {
    if (["x", "y", "ax", "ay"].includes(k)) defects.push(`coordinate key "${k}" at ${trail}`);
    scan(v, `${trail}.${k}`);
  }
})(f, "$");

if (f.fixtureVersion !== 1) defects.push("fixtureVersion !== 1");
for (const key of ["repo", "upstream", "sha", "sourceRoot"]) {
  if (!f.meta?.[key]) defects.push(`meta.${key} missing`);
}

const moduleIds = new Set((f.repo?.modules || []).map((m) => m.id));
(f.repo?.modules || []).forEach((m) => {
  if (!m.zh) defects.push(`module ${m.id}: zh gloss missing`);
  if (m.magnitude?.lines !== undefined && typeof m.magnitude.lines !== "number") defects.push(`module ${m.id}: magnitude.lines not numeric`);
  if (m.magnitude?.files !== undefined && typeof m.magnitude.files !== "number") defects.push(`module ${m.id}: magnitude.files not numeric`);
});
(f.repo?.imports || []).forEach(([from, to]) => {
  if (!moduleIds.has(from) || !moduleIds.has(to)) defects.push(`import ${from}>${to}: unknown module id`);
});

const nodeIds = new Set((f.graph?.nodes || []).map((n) => n.id));
(f.graph?.nodes || []).forEach((n) => {
  if (!n.file || !n.lines) defects.push(`node ${n.id}: file/lines missing`);
  if (!n.io) defects.push(`node ${n.id}: io missing`);
});
const edgeSet = new Set();
(f.graph?.edges || []).forEach((e) => {
  if (!KINDS.has(e.kind)) defects.push(`edge ${e.from}>${e.to}: kind "${e.kind}" not in enum`);
  if (!e.cargo) defects.push(`edge ${e.from}>${e.to}: cargo missing`);
  if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) defects.push(`edge ${e.from}>${e.to}: unknown node id`);
  edgeSet.add(`${e.from}>${e.to}`);
});

(f.behaviors || []).forEach((b) => {
  if (!b.route?.steps?.length) { defects.push(`behavior ${b.id}: empty route`); return; }
  b.route.steps.forEach((s) => { if (!nodeIds.has(s)) defects.push(`behavior ${b.id}: step "${s}" not a graph node`); });
  for (let i = 0; i < b.route.steps.length - 1; i += 1) {
    if (!edgeSet.has(`${b.route.steps[i]}>${b.route.steps[i + 1]}`)) defects.push(`behavior ${b.id}: no edge for step ${i + 1}→${i + 2} (${b.route.steps[i]}>${b.route.steps[i + 1]})`);
  }
  if ((b.route.narration || []).length !== b.route.steps.length) defects.push(`behavior ${b.id}: narration count ${b.route.narration?.length} ≠ steps ${b.route.steps.length}`);
});

if (defects.length) {
  console.error(`FAIL — ${defects.length} defect(s):\n` + defects.map((d) => `  - ${d}`).join("\n"));
  process.exit(1);
}
console.log(`PASS — ${path}: ${f.repo?.modules?.length ?? 0} modules, ${f.repo?.imports?.length ?? 0} imports, ${f.graph?.nodes?.length ?? 0} nodes, ${f.graph?.edges?.length ?? 0} edges, ${(f.behaviors || []).length} behaviors — structurally clean`);

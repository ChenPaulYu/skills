#!/usr/bin/env node
/**
 * skill-usage.mjs — monthly skill-usage ledger from local Claude Code + Codex transcripts.
 *
 * Why this exists: ADR-009 retires a model-invoked skill after "zero fires across
 * three months of transcripts", but local transcripts are kept only ~5 weeks, so
 * the rule cannot be checked after the fact. A monthly snapshot committed under
 * docs/usage/ accumulates the evidence. Snapshots hold skill names and counts only.
 *
 * Usage: node scripts/skill-usage.mjs [--month YYYY-MM] [--write] [--json]
 * Default month = current month to date. Roster = plugins/*\/skills/* (dynamic).
 *
 * Reads: scripts/lib/skill-usage.mjs · scripts/lib/catalog.mjs (discoverSkillDirectories) · ~/.claude/projects · ~/.codex/sessions
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { discoverSkillDirectories } from "./lib/catalog.mjs";
import { collectUsage } from "./lib/skill-usage.mjs";

const ROOT = new URL("..", import.meta.url).pathname;

function parseArgs(argv) {
  const out = { month: new Date().toISOString().slice(0, 7), write: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--month") out.month = argv[++i];
    else if (argv[i] === "--write") out.write = true;
    else if (argv[i] === "--json") out.json = true;
    else { console.error(`unknown argument: ${argv[i]}`); process.exit(2); }
  }
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(out.month || "")) { console.error("--month must be YYYY-MM"); process.exit(2); }
  return out;
}

function discoverRoster(root) {
  const roster = new Set();
  const pluginsDir = join(root, "plugins");
  for (const e of readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    for (const s of discoverSkillDirectories(join(pluginsDir, e.name, "skills"))) roster.add(`${e.name}:${s}`);
  }
  return roster;
}

const ZERO = () => ({ claude: { model: 0, slash: 0, sessions: 0 }, codex: { sessions: 0 }, claudeSubagent: 0, lastSeen: null });
const total = (s) => s.claude.sessions + s.codex.sessions;

function sortedObject(entries) {
  return Object.fromEntries(entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

function buildReport(month, roster, usage) {
  const rosterEntries = [...roster].map((n) => [n, usage.skills.get(n) ?? ZERO()]);
  const otherEntries = [...usage.skills].filter(([n]) => !roster.has(n));
  return {
    month,
    generatedAt: new Date().toISOString().slice(0, 10),
    coverage: usage.coverage,
    skills: sortedObject(rosterEntries),
    other: sortedObject(otherEntries),
  };
}

function renderTable(report) {
  const rows = (obj) => Object.entries(obj).sort(([an, a], [bn, b]) => total(b) - total(a) || an.localeCompare(bn));
  const line = (n, s) =>
    `${n.padEnd(26)} ${String(s.claude.model).padStart(5)} ${String(s.claude.slash).padStart(5)} ${String(s.claude.sessions).padStart(7)} ${String(s.codex.sessions).padStart(6)} ${String(s.claudeSubagent).padStart(4)}  ${s.lastSeen ?? "-"}`;
  const head = `${"skill".padEnd(26)} ${"model".padStart(5)} ${"slash".padStart(5)} ${"cc-sess".padStart(7)} ${"codex".padStart(6)} ${"sub".padStart(4)}  last seen`;
  const c = report.coverage;
  const out = [
    `Skill usage ${report.month} (generated ${report.generatedAt}) — claude sessions ${c.claudeSessions}, codex sessions ${c.codexSessions}, earliest event ${c.earliestEvent ?? "-"}`,
    head,
    ...rows(report.skills).map(([n, s]) => line(n, s)),
  ];
  const other = rows(report.other);
  if (other.length) out.push("-- non-roster --", ...other.map(([n, s]) => line(n, s)));
  return out.join("\n");
}

const args = parseArgs(process.argv.slice(2));
const roster = discoverRoster(ROOT);
const usage = collectUsage({
  claudeDir: join(homedir(), ".claude", "projects"),
  codexDir: join(homedir(), ".codex", "sessions"),
  month: args.month,
  roster,
});
const report = buildReport(args.month, roster, usage);
const json = JSON.stringify(report, null, 2) + "\n";

if (args.write) {
  // The committed ledger is public: keep only this marketplace's roster. Non-roster names
  // (private or third-party skills seen in transcripts) stay in local stdout output.
  const { other: _local, ...committed } = report;
  const dir = join(ROOT, "docs", "usage");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${args.month}.json`), JSON.stringify(committed, null, 2) + "\n");
  console.log(`wrote docs/usage/${args.month}.json`);
} else if (args.json) process.stdout.write(json);
else console.log(renderTable(report));

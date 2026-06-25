#!/usr/bin/env node
// relay:format — lint thought frontmatter for conformance.
// Regex-based (no YAML dependency, per ADR-051's node-is-a-fast-path rule):
// it catches the known break/conformance issues, not full YAML validation.
// Usage: node lint.mjs <thoughts-dir>
// Exit 0 = all conform; 1 = issues found; 2 = bad usage.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: node lint.mjs <thoughts-dir>'); process.exit(2); }

let files;
try { files = readdirSync(dir).filter((f) => f.endsWith('.md')); }
catch (e) { console.error(`cannot read ${dir}: ${e.message}`); process.exit(2); }

let issues = 0;
const report = (f, msg) => { issues++; console.log(`${f}: ${msg}`); };

for (const f of files.sort()) {
  const text = readFileSync(join(dir, f), 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) { report(f, 'no YAML frontmatter block'); continue; }
  const lines = m[1].split('\n');
  const get = (k) => {
    const l = lines.find((x) => x.startsWith(k + ':'));
    return l === undefined ? null : l.slice(k.length + 1).trim();
  };

  // required fields
  for (const k of ['date', 'by', 'subject', 'thread']) {
    if (get(k) === null) report(f, `missing required field: ${k}`);
  }

  // subject must be quoted (a colon in an unquoted scalar breaks YAML)
  const subj = get('subject');
  if (subj !== null && subj.length && !subj.startsWith('"')) {
    report(f, subj.includes(':')
      ? 'subject has a colon and is unquoted — breaks YAML; wrap in "..."'
      : 'subject should be quoted ("...")');
  }

  // thread / re are quoted markdown links ([ starts a YAML flow sequence)
  for (const k of ['thread', 're']) {
    const v = get(k);
    if (v === null || v === '') continue;
    if (v.startsWith('[')) report(f, `${k} link starts with [ (a YAML sequence) — wrap in "..."`);
    else if (!v.startsWith('"[')) report(f, `${k} should be a quoted markdown link ("[id](file)")`);
  }

  // relate is a YAML list of quoted markdown links
  const relIdx = lines.findIndex((l) => l.startsWith('relate:'));
  if (relIdx >= 0) {
    const items = lines.slice(relIdx + 1).filter((l) => l.startsWith('  - '));
    for (const it of items) {
      const v = it.slice(4).trim();
      if (v.startsWith('[')) report(f, 'relate item starts with [ (a YAML sequence) — wrap in "..."');
      else if (!v.startsWith('"[')) report(f, 'relate item should be a quoted markdown link');
    }
  }
}

console.log(issues === 0 ? `OK — ${files.length} thought(s) conform` : `\n${issues} issue(s) across ${files.length} thought(s)`);
process.exit(issues === 0 ? 0 : 1);

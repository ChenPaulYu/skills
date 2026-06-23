#!/usr/bin/env node
/**
 * check-acceptance.mjs — relay's consensus gate, computed (not inferred).
 *
 * For each OPEN decision [D] in a project, compute its @-approver-set and which of
 * those people have left an explicit `accept`, then report whether it is COMPLETE
 * (every @-ed handle has accepted). `reply` runs this before graduating a decision,
 * so the gate is an exact set-comparison — never an LLM judgement that could ratify
 * a non-consensus. Open = raised under `## Needs-decision`, no decisions/<id>.md yet.
 *
 * Usage:  node check-acceptance.mjs <project-dir> [<id>]
 * Output: JSON array of { id, atSet, accepted, missing, complete }.
 *
 * Reads: node:fs (thoughts/*.md · decisions/) — no external deps; markdown parsed by regex.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const projectDir = process.argv[2];
const onlyId = process.argv[3];
if (!projectDir) {
  console.error("usage: check-acceptance.mjs <project-dir> [id]");
  process.exit(2);
}

const thoughtsDir = join(projectDir, "thoughts");
const decisionsDir = join(projectDir, "decisions");

// Already-graduated decisions (a decisions/<id>.md exists) are not "open".
const graduated = existsSync(decisionsDir)
  ? new Set(readdirSync(decisionsDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")))
  : new Set();

const atSet = {};    // id -> Set(handle)  the approver set (from the Needs-decision raise line)
const accepted = {}; // id -> Set(handle)  who has explicitly accepted

const files = existsSync(thoughtsDir)
  ? readdirSync(thoughtsDir).filter((f) => f.endsWith(".md")).sort()
  : [];

for (const f of files) {
  const text = readFileSync(join(thoughtsDir, f), "utf8");
  const by = (text.match(/^by:\s*(\S+)/m) || [])[1]; // the entry's author handle
  let bucket = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const heading = line.match(/^##\s+(.+)/);
    if (heading) { bucket = heading[1].toLowerCase(); continue; }

    // Reply line: `- re [id]: … accept …`  → the author accepted that id.
    const re = line.match(/^-\s*re\s+\[([a-z0-9-]+)\]\s*:\s*(.*)$/i);
    if (re) {
      if (/\baccept\b/i.test(re[2]) && by) (accepted[re[1]] ??= new Set()).add(by);
      continue;
    }

    // Raise line under Needs-decision: `- [id] @a @b — …`  → the approver set.
    if (bucket && bucket.startsWith("needs-decision")) {
      const item = line.match(/^-\s*\[([a-z0-9-]+)\]\s*(.*)$/);
      if (item) {
        const ats = [...item[2].matchAll(/@([a-z0-9-]+)/g)].map((m) => m[1]);
        atSet[item[1]] ??= new Set(ats); // first raise fixes the set (v1: not extended in-thread)
      }
    }
  }
}

const out = [];
for (const id of Object.keys(atSet)) {
  if (graduated.has(id)) continue;
  if (onlyId && id !== onlyId) continue;
  const want = [...atSet[id]];
  const got = accepted[id] ? [...accepted[id]] : [];
  const missing = want.filter((h) => !accepted[id]?.has(h));
  out.push({ id, atSet: want, accepted: got, missing, complete: want.length > 0 && missing.length === 0 });
}
console.log(JSON.stringify(out, null, 2));

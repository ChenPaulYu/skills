#!/usr/bin/env node
// relay:digest — deterministic state computation over a project's thought-stream.
// Owns the MECHANICAL layer of digest (ADR-051 split): thread grouping, @-ask
// detection, answered/settled set-logic, FYI/closer markers, image/❓ counts.
// The JUDGMENT layer (is this ❓-without-@ a real ask? tone of a closer?) stays
// with the LLM — uncertain cases are emitted under `flags`, never silently decided.
// Regex-based (no YAML dependency, per ADR-051's node-is-a-fast-path rule).
//
// Usage:
//   node compute-state.mjs <repo> [--project <name>] [--for <handle>] [--format json|hook]
//     <repo>       relay content repo root (has relay.yml)
//     --project    limit to one project (default: all under projects/)
//     --for        viewer handle (default: resolve git author email → relay.yml)
//     --format     json (default) = full state; hook = one-line session-open summary
// Exit 0 = ok; 2 = bad usage / unreadable repo.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const repo = args.find((a) => !a.startsWith('--'));
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const format = opt('--format') || 'json';
if (!repo || !existsSync(join(repo, 'relay.yml'))) {
  console.error('usage: node compute-state.mjs <relay-repo> [--project x] [--for handle] [--format json|hook]');
  process.exit(2);
}

// -- roster: handles + git-email → handle resolution (regex over relay.yml) --
const roster = readFileSync(join(repo, 'relay.yml'), 'utf8');
const handles = [...roster.matchAll(/^  (\w[\w-]*):\s*$/gm)].map((m) => m[1]);
const emailOf = {};
for (const h of handles) {
  const block = roster.split(new RegExp(`^  ${h}:\\s*$`, 'm'))[1] || '';
  const em = block.match(/git:\s*(\S+@\S+?)(\s|$)/);
  if (em) emailOf[h] = em[1];
}
let viewer = opt('--for');
if (!viewer) {
  let email = '';
  try { email = execSync('git config user.email', { cwd: repo }).toString().trim(); } catch {}
  viewer = handles.find((h) => emailOf[h] === email) || null;
}

// -- load thoughts --
const projectsDir = join(repo, 'projects');
const projects = opt('--project')
  ? [opt('--project')]
  : readdirSync(projectsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

const mdLink = (v) => { // "[id](file.md)" or "path/file.md" → basename of the .md
  if (!v) return null;
  const link = v.match(/\(([^)]+\.md)\)/);
  return basename(link ? link[1] : v.replace(/^["']|["']$/g, ''));
};

const state = { generatedAt: new Date().toISOString(), repo, viewer, projects: {} };

for (const project of projects) {
  const dir = join(projectsDir, project, 'thoughts');
  if (!existsSync(dir)) continue;
  const thoughts = [];
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
    const text = readFileSync(join(dir, f), 'utf8');
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) continue;
    const get = (k) => {
      const l = fm[1].split('\n').find((x) => x.startsWith(k + ':'));
      return l ? l.slice(k.length + 1).trim().replace(/^["']|["']$/g, '') : null;
    };
    const body = text.slice(fm[0].length);
    const subject = get('subject') || '';
    const by = get('by');
    const mentioned = handles.filter(
      (h) => h !== by && new RegExp(`@${h}\\b`).test(subject + body)
    );
    thoughts.push({
      file: f,
      date: get('date'),
      by,
      subject,
      thread: mdLink(get('thread')) || f,
      re: mdLink(get('re')),
      mentions: mentioned,
      isFYI: /〔FYI〕|\[FYI\]/i.test(subject),
      hasAgree: /\*\*agree/i.test(body),
      hasChange: /\*\*change/i.test(body),
      closerPhrase: /不用回|不用特地回|no reply needed/.test(body),
      questionMarks: (body.match(/❓/g) || []).length,
      images: (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length,
    });
  }

  // group by thread root
  const threads = {};
  for (const t of thoughts) (threads[t.thread] ||= []).push(t);

  // "U comes after T": later date, or direct reply to T, or U is a reply into a thread T roots
  const after = (U, T) =>
    U.date > T.date || U.re === T.file || (U.date === T.date && U.thread === T.file && U.file !== T.file);

  const waitingFor = {}; // handle → asks pointed at them, unanswered
  const waitingOn = {};  // handle → their asks, unanswered
  const flags = [];
  const threadView = [];

  for (const [root, list] of Object.entries(threads)) {
    const latest = list.reduce((a, b) => (after(b, a) ? b : a));
    for (const t of list) {
      for (const target of t.mentions) {
        const answered = list.some((u) => u.by === target && u !== t && after(u, t));
        if (!answered && !t.isFYI) {
          (waitingFor[target] ||= []).push({ project, file: t.file, by: t.by, subject: t.subject, images: t.images });
          (waitingOn[t.by] ||= []).push({ project, file: t.file, target, subject: t.subject, since: t.date });
        }
      }
      // judgment flag: real-looking ask with no @ — the mechanical layer must not decide this
      if (t.mentions.length === 0 && t.questionMarks > 0 && t === latest && !t.closerPhrase && !t.isFYI) {
        flags.push({
          project, file: t.file, by: t.by,
          reason: 'question-marks-no-mention',
          detail: `${t.questionMarks}×❓ in latest thread entry, no @-flag, no closer phrase — possibly an open ask; LLM should judge`,
        });
      }
    }
    const settled =
      latest.isFYI || latest.closerPhrase || (latest.hasAgree && !latest.hasChange) ||
      list.every((t) => t.mentions.length === 0);
    threadView.push({
      root, count: list.length, latest: latest.file, latestBy: latest.by,
      settled: latest.hasChange ? false : settled,
      subjects: [list[0].subject],
    });
  }
  state.projects[project] = { threads: threadView, waitingFor, waitingOn, flags };
}

// -- output --
if (format === 'hook') {
  if (!viewer) process.exit(0);
  let waiting = 0, flagged = 0;
  for (const p of Object.values(state.projects)) {
    waiting += (p.waitingFor[viewer] || []).length;
    flagged += p.flags.length;
  }
  const parts = [];
  if (waiting) parts.push(`${waiting} 則等你 review`);
  if (flagged) parts.push(`${flagged} 則待判斷（❓無@）`);
  if (parts.length) console.log(`📬 relay: ${parts.join('、')} — run /relay:digest`);
} else {
  console.log(JSON.stringify(state, null, 2));
}

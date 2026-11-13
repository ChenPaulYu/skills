/**
 * skill-usage.mjs — parse local Claude Code / Codex transcripts into per-skill usage counts.
 *
 * Owns the knowledge of both transcript formats (Skill tool_use blocks and
 * <command-name> slash tags for Claude Code; SKILL.md reads for Codex) so
 * `scripts/skill-usage.mjs` only does CLI + roster + rendering. Output carries
 * skill names and counts only — never paths, project names, or session ids.
 *
 * Reads: ~/.claude/projects/**\/*.jsonl · ~/.codex/sessions/**\/*.jsonl (dirs injected by the caller).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, sep } from "node:path";

const CMD_RE = /<command-name>\s*\/?([^<\s]+)\s*<\/command-name>/;
const CODEX_READ_RE = /\.codex\/skills\/([A-Za-z0-9._-]+)\/SKILL\.md/g;
const TS_RE = /"timestamp":"(\d{4}-\d{2}-\d{2})/;

function* walkJsonl(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walkJsonl(p);
    else if (e.isFile() && e.name.endsWith(".jsonl")) yield p;
  }
}

function newBucket() {
  return { claudeModel: 0, claudeSlash: 0, claudeSessions: new Set(), codexSessions: new Set(), claudeSubagent: 0, lastSeen: null };
}

/** Resolve a raw skill name to a roster id (`plugin:skill`) or return it unchanged. */
export function normalizeName(raw, roster, codex = false) {
  if (roster.has(raw)) return raw;
  if (codex) {
    const hit = [...roster].find((r) => r.replace(":", "-") === raw);
    if (hit) return hit;
  }
  const i = raw.indexOf(":");
  if (i > 0 && roster.has(raw.slice(i + 1))) return raw.slice(i + 1); // `<marketplace>:plugin:skill`
  return raw;
}

function slashName(text) {
  const m = CMD_RE.exec(text);
  return m ? m[1] : null;
}

function userText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((b) => (b && b.type === "text" && typeof b.text === "string" ? b.text : "")).join(" ");
  }
  return "";
}

/**
 * Scan both transcript roots for one calendar month.
 * @param {{claudeDir?: string, codexDir?: string, month: string, roster: Set<string>}} opts
 * @returns {{skills: Map<string, object>, coverage: object}}
 */
export function collectUsage({ claudeDir, codexDir, month, roster }) {
  const buckets = new Map();
  const get = (name) => { if (!buckets.has(name)) buckets.set(name, newBucket()); return buckets.get(name); };
  const touch = (b, date) => { if (!b.lastSeen || date > b.lastSeen) b.lastSeen = date; };
  const claudeActive = new Set(), codexActive = new Set();
  let earliest = null;
  const seen = new Set();
  let fileNo = 0;

  const markActive = (set, id, date) => {
    set.add(id);
    if (!earliest || date < earliest) earliest = date;
  };

  if (claudeDir) {
    for (const file of walkJsonl(claudeDir)) {
      const sub = file.split(sep).includes("subagents");
      const sid = `c${fileNo++}`; // opaque, in-memory only
      for (const line of readFileSync(file, "utf8").split("\n")) {
        if (!line) continue;
        const ts = TS_RE.exec(line);
        if (!ts || ts[1].slice(0, 7) !== month) continue;
        if (!sub) markActive(claudeActive, sid, ts[1]);
        const hasSkill = line.includes('"Skill"'), hasCmd = line.includes("<command-name>");
        if (!hasSkill && !hasCmd) continue;
        if (line.includes("api-request-shape")) continue;
        let d;
        try { d = JSON.parse(line); } catch { continue; }
        if (d.type === "api-request-shape") continue;
        const date = (d.timestamp || "").slice(0, 10);
        if (date.slice(0, 7) !== month) continue;
        const content = d.message && d.message.content;
        const record = (raw, kind) => {
          const b = get(normalizeName(raw, roster));
          if (sub) b.claudeSubagent++;
          else { b[kind]++; b.claudeSessions.add(sid); }
          touch(b, date);
        };
        if (d.type === "assistant" && Array.isArray(content) && hasSkill) {
          for (const blk of content) {
            if (!blk || blk.type !== "tool_use" || blk.name !== "Skill") continue;
            const raw = blk.input && blk.input.skill;
            if (typeof raw !== "string" || !raw) continue;
            const key = `${d.uuid}|${blk.id}`;
            if (seen.has(key)) continue;
            seen.add(key);
            record(raw, "claudeModel");
          }
        } else if (d.type === "user" && hasCmd) {
          const raw = slashName(userText(content));
          if (!raw) continue;
          if (d.uuid) { if (seen.has(d.uuid)) continue; seen.add(d.uuid); }
          record(raw, "claudeSlash");
        }
      }
    }
  }

  if (codexDir) {
    for (const file of walkJsonl(codexDir)) {
      const sid = `x${fileNo++}`;
      for (const line of readFileSync(file, "utf8").split("\n")) {
        if (!line) continue;
        const ts = TS_RE.exec(line);
        if (!ts || ts[1].slice(0, 7) !== month) continue;
        markActive(codexActive, sid, ts[1]);
        if (!line.includes("SKILL.md") || !line.includes(".codex/skills/")) continue;
        let d;
        try { d = JSON.parse(line); } catch { continue; }
        const p = d.payload;
        if (d.type !== "response_item" || !p || (p.type !== "function_call" && p.type !== "custom_tool_call")) continue;
        let s = p.input ?? p.arguments ?? "";
        if (typeof s !== "string") s = JSON.stringify(s);
        for (const m of new Set([...s.matchAll(CODEX_READ_RE)].map((x) => x[1]))) {
          const b = get(normalizeName(m, roster, true));
          b.codexSessions.add(sid);
          touch(b, ts[1]);
        }
      }
    }
  }

  const skills = new Map();
  for (const [name, b] of buckets) {
    skills.set(name, {
      claude: { model: b.claudeModel, slash: b.claudeSlash, sessions: b.claudeSessions.size },
      codex: { sessions: b.codexSessions.size },
      claudeSubagent: b.claudeSubagent,
      lastSeen: b.lastSeen,
    });
  }
  return {
    skills,
    coverage: { claudeSessions: claudeActive.size, codexSessions: codexActive.size, earliestEvent: earliest },
  };
}

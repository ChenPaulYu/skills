/**
 * Exercise the transcript parsers in skill-usage.mjs against tiny inline fixtures.
 * Reads: scripts/lib/skill-usage.mjs · temporary fixture trees.
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { collectUsage } from "./skill-usage.mjs";

const roster = new Set(["nav:audit", "shape:mockup"]);
const J = (o) => JSON.stringify(o);
const skillUse = (uuid, id, skill, ts) =>
  J({ type: "assistant", uuid, timestamp: ts, message: { content: [{ type: "tool_use", id, name: "Skill", input: { skill } }] } });

test("collectUsage parses Claude + Codex fixtures", () => {
  const tmp = mkdtempSync(join(tmpdir(), "skill-usage-"));
  try {
    const claude = join(tmp, "claude"), codex = join(tmp, "codex", "2026", "11", "05");
    mkdirSync(join(claude, "proj-a", "sess1", "subagents"), { recursive: true });
    mkdirSync(codex, { recursive: true });
    writeFileSync(join(claude, "proj-a", "sess1.jsonl"), [
      skillUse("u1", "t1", "nav:audit", "2026-11-03T10:00:00Z"),
      skillUse("u1", "t1", "nav:audit", "2026-11-03T10:00:00Z"), // duplicate uuid+tool id
      J({ type: "user", uuid: "u2", timestamp: "2026-11-04T10:00:00Z", message: { content: "<command-name>/shape:mockup</command-name>" } }),
      skillUse("u3", "t3", "nav:audit", "2026-10-30T10:00:00Z"), // other month
      skillUse("u4", "t4", "some-third-party", "2026-11-06T10:00:00Z"),
    ].join("\n"));
    writeFileSync(join(claude, "proj-a", "sess1", "subagents", "agent-x.jsonl"),
      skillUse("u5", "t5", "nav:audit", "2026-11-07T10:00:00Z"));
    const read = (ts, name) => J({ timestamp: ts, type: "response_item", payload: { type: "function_call", call_id: "c", arguments: J({ cmd: `cat ~/.codex/skills/${name}/SKILL.md` }) } });
    writeFileSync(join(codex, "rollout-a.jsonl"), [
      read("2026-11-05T01:00:00Z", "nav-audit"),
      read("2026-11-05T01:05:00Z", "nav-audit"), // re-read, same session
    ].join("\n"));

    const { skills, coverage } = collectUsage({ claudeDir: claude, codexDir: join(tmp, "codex"), month: "2026-11", roster });
    assert.deepEqual(skills.get("nav:audit"), {
      claude: { model: 1, slash: 0, sessions: 1 }, codex: { sessions: 1 }, claudeSubagent: 1, lastSeen: "2026-11-07",
    });
    assert.deepEqual(skills.get("shape:mockup").claude, { model: 0, slash: 1, sessions: 1 });
    assert.equal(skills.get("some-third-party").claude.model, 1);
    assert.equal(coverage.claudeSessions, 1);
    assert.equal(coverage.codexSessions, 1);
    assert.equal(coverage.earliestEvent, "2026-11-03");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

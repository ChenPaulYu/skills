#!/usr/bin/env node
// OWNER TEMPLATE: platforms/codex/hooks/relay-digest-session-start.mjs
// GENERATED DESTINATION: .codex/hooks/relay-digest-session-start.mjs
// Emits SessionStart additionalContext only when the official lifecycle payload identifies
// startup/resume, a relay repo is detectable, and the helper returns a non-empty hook summary.
// Project trust is enforced by the host before this project hook runs. Every miss degrades
// to a no-op.

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SESSION_START_REASONS = new Set(["startup", "resume"]);
const HELPER_TIMEOUT_MS = 5000;
const SCRIPT_DIR = resolve(fileURLToPath(new URL(".", import.meta.url)));
const PROJECT_ROOT = resolve(SCRIPT_DIR, "..", "..");

function readStdin() {
  return new Promise((resolveRead) => {
    const chunks = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => resolveRead(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", () => resolveRead(""));
    if (process.stdin.isTTY) resolveRead("");
  });
}

function parseJson(raw) {
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getNested(object, path) {
  let current = object;
  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) return undefined;
    current = current[key];
  }
  return current;
}

function firstString(payload, candidates) {
  for (const path of candidates) {
    const value = getNested(payload, path);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function extractReason(payload) {
  return firstString(payload, [["source"]]);
}

function isSessionStartPayload(payload) {
  return firstString(payload, [["hook_event_name"]]) === "SessionStart";
}

function findRelayRepo(payload) {
  const envRepo = typeof process.env.RELAY_REPO === "string" ? process.env.RELAY_REPO.trim() : "";
  const candidates = [];
  if (envRepo) candidates.push(envRepo);

  const inputCwd = firstString(payload, [["cwd"]]);
  if (inputCwd) candidates.push(inputCwd);
  candidates.push(process.cwd());

  for (const candidate of candidates) {
    const repo = resolve(candidate);
    if (existsSync(join(repo, "relay.yml"))) return repo;
  }
  return null;
}

function findHelper() {
  const home = typeof process.env.HOME === "string" && process.env.HOME.trim()
    ? process.env.HOME.trim()
    : process.env.USERPROFILE;
  const candidates = [
    join(PROJECT_ROOT, ".agents", "skills", "relay-digest", "scripts", "compute-state.mjs"),
    home ? join(home, ".agents", "skills", "relay-digest", "scripts", "compute-state.mjs") : null,
    home ? join(home, ".codex", "skills", "relay-digest", "scripts", "compute-state.mjs") : null,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function buildAdditionalContext(summary) {
  return [
    "Relay awareness: a relay repo is available for this session.",
    `Startup/resume hook note: ${summary}`,
    "Use relay-digest on demand for the full waiting/recent view.",
  ].join("\n");
}

async function main() {
  const payload = parseJson(await readStdin());
  if (!payload) return;
  if (!isSessionStartPayload(payload)) return;

  const reason = extractReason(payload);
  if (!SESSION_START_REASONS.has(reason)) return;

  const repo = findRelayRepo(payload);
  if (!repo) return;

  const helper = findHelper();
  if (!helper) return;

  const result = spawnSync(process.execPath, [helper, repo, "--format", "hook"], {
    encoding: "utf8",
    timeout: HELPER_TIMEOUT_MS,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error || result.status !== 0) return;

  const summary = typeof result.stdout === "string" ? result.stdout.trim() : "";
  if (!summary) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: buildAdditionalContext(summary),
      },
    }),
  );
}

main().catch(() => {
  process.exit(0);
});

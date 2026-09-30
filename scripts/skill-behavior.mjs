#!/usr/bin/env node
/**
 * Prepare isolated skill tasks and check observable outcomes without invoking a model.
 * Expectations and baseline receipts stay outside the worker's task directory.
 * Reads: fixtures/behavior/cases.json, generated skills, Git, node:fs/crypto.
 * Checks file content and Git retention separately; model rubrics remain manual.
 */
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, readlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CATALOG = join(ROOT, "scripts/fixtures/behavior/cases.json");
const hash = data => createHash("sha256").update(data).digest("hex");
const gitEnv = Object.fromEntries(Object.entries(process.env).filter(([name]) =>
  !name.startsWith("GIT_") && name !== "NODE_TEST_CONTEXT"));
const git = (cwd, ...args) => execFileSync("git", args, { cwd, env: gitEnv, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();

export function prepareCase(id, destination) {
  const catalog = JSON.parse(readFileSync(CATALOG));
  const task = catalog.cases.find(item => item.id === id);
  if (!task) throw new Error(`Unknown case: ${id}`);
  const workspace = resolve(destination);
  if (workspace === ROOT || workspace.startsWith(`${ROOT}${sep}`)) throw new Error("Prepare cases outside the source repository.");
  const receipt = `${workspace}.baseline.json`;
  if (existsSync(workspace) || existsSync(receipt)) throw new Error(`Refusing to overwrite an existing case: ${workspace}`);
  mkdirSync(workspace, { recursive: true });
  const project = catalog.projects[task.project];
  for (const [path, content] of Object.entries(project.files)) writeTaskFile(workspace, path, content);
  const skill = `.agents/skills/${task.skill}`;
  cpSync(join(ROOT, skill), join(workspace, skill), { recursive: true });
  git(workspace, "init", "-q");
  git(workspace, "config", "core.hooksPath", join(workspace, ".git/no-hooks"));
  git(workspace, "config", "core.excludesFile", "/dev/null");
  git(workspace, "add", ".");
  for (const path of project.trackedDespiteIgnore || []) git(workspace, "add", "-f", "--", path);
  git(workspace, "-c", "user.name=Behavior Fixture", "-c", "user.email=fixture@example.invalid",
    "commit", "--no-gpg-sign", "-qm", "Behavior fixture baseline");
  for (const [path, content] of Object.entries(project.untracked || {})) writeTaskFile(workspace, path, content);
  writeFileSync(receipt, JSON.stringify({
    schema: 1, case: id, catalogHash: hash(readFileSync(CATALOG)), workspace,
    head: git(workspace, "rev-parse", "HEAD"), indexTree: git(workspace, "write-tree"), files: snapshot(workspace),
  }, null, 2) + "\n");
  // No acceptance criteria or expected edits in this packet.
  return { case: id, workspace, skill: join(workspace, skill, "SKILL.md"), prompt: task.prompt };
}

export function checkCase(destination) {
  const workspace = resolve(destination);
  const baseline = JSON.parse(readFileSync(`${workspace}.baseline.json`));
  if (baseline.workspace !== workspace || baseline.catalogHash !== hash(readFileSync(CATALOG))) {
    throw new Error("Case definition or workspace changed since preparation; start a fresh case.");
  }
  const catalog = JSON.parse(readFileSync(CATALOG));
  const task = catalog.cases.find(item => item.id === baseline.case);
  const after = snapshot(workspace);
  const changed = [...new Set([...Object.keys(baseline.files), ...Object.keys(after)])]
    .filter(path => baseline.files[path] !== after[path]).sort();
  const failures = [];
  for (const path of changed) if (!task.allowChanges.includes(path)) failures.push(`Unexpected file change: ${path}`);
  for (const path of task.mustChange) if (!changed.includes(path)) failures.push(`Required file was not updated: ${path}`);
  if (git(workspace, "rev-parse", "HEAD") !== baseline.head) failures.push("Task created a commit despite the request.");
  if (task.git?.unchangedIndex && git(workspace, "write-tree") !== baseline.indexTree) {
    failures.push("Task changed the Git index despite the request.");
  }
  for (const path of task.git?.untracked || []) {
    if (git(workspace, "ls-files", "--", path)) failures.push(`Excluded artifact remains tracked: ${path}`);
  }
  for (const path of task.git?.tracked || []) {
    if (!git(workspace, "ls-files", "--", path)) failures.push(`Required deliverable is no longer tracked: ${path}`);
  }
  for (const path of task.git?.ignored || []) {
    const result = spawnSync("git", ["check-ignore", "--no-index", "-q", "--", path], { cwd: workspace, env: gitEnv, encoding: "utf8" });
    if (result.error || result.status !== 0) failures.push(`Artifact is not ignored: ${path}`);
  }
  for (const path of task.git?.notStaged || []) {
    // Authorized cached removals are valid; additions and updates are not.
    if (git(workspace, "diff", "--cached", "--name-only", "--diff-filter=ACMRTUXB", "--", path)) {
      failures.push(`Excluded artifact is staged for addition/update: ${path}`);
    }
  }
  for (const check of task.checks) {
    const path = join(workspace, check.file);
    if (!existsSync(path)) { failures.push(`Missing result file: ${check.file}`); continue; }
    const content = readFileSync(path, "utf8");
    for (const value of check.includes || []) if (!content.toLowerCase().includes(value.toLowerCase())) failures.push(`${check.file} lacks required fact: ${value}`);
    for (const value of check.excludes || []) if (content.includes(value)) failures.push(`${check.file} retains stale claim: ${value}`);
    for (const pattern of check.patterns || []) if (!new RegExp(pattern, "iu").test(content)) failures.push(`${check.file} lacks the checked outcome: ${pattern}`);
  }
  let command;
  if (task.command) {
    const result = spawnSync(process.execPath, task.command, { cwd: workspace, env: gitEnv, encoding: "utf8", timeout: 10000 });
    command = { args: task.command, status: result.status, output: `${result.stdout || ""}${result.stderr || ""}` };
    if (result.error || result.status !== 0) failures.push(`Behavior command failed: node ${task.command.join(" ")}`);
  }
  return {
    case: task.id, mechanicalPassed: failures.length === 0, changed, failures, command,
    reviewRequired: task.review,
    limitation: "Mechanical checks are necessary, not a model-quality verdict. Review artifacts, final response, and tool actions; unchanged final hashes cannot exclude transient writes.",
  };
}

function writeTaskFile(root, path, content) {
  const target = resolve(root, path);
  if (!target.startsWith(`${root}${sep}`)) throw new Error(`Fixture path escapes workspace: ${path}`);
  mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, content);
}

function snapshot(root) {
  const files = {};
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (dir === root && entry.name === ".git") continue;
      const path = join(dir, entry.name); const name = relative(root, path).split(sep).join("/");
      if (entry.isDirectory()) visit(path);
      else files[name] = entry.isSymbolicLink() ? `link:${readlinkSync(path)}` : hash(readFileSync(path));
    }
  }
  visit(root); return files;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [action, first, second] = process.argv.slice(2);
    let result;
    if (action === "list") result = JSON.parse(readFileSync(CATALOG)).cases.map(({ id, skill }) => ({ id, skill }));
    else if (action === "prepare" && first && second) result = prepareCase(first, second);
    else if (action === "check" && first && !second) result = checkCase(first);
    else throw new Error("Usage: skill-behavior.mjs list | prepare CASE OUTSIDE_REPO | check WORKSPACE");
    console.log(JSON.stringify(result, null, 2));
    if (result.mechanicalPassed === false) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { checkCase, prepareCase } from "../skill-behavior.mjs";

function fixture(id, run) {
  const root = mkdtempSync(join(tmpdir(), "behavior-checker-test-"));
  const workspace = join(root, id);
  try { run(workspace, prepareCase(id, workspace)); }
  finally { rmSync(root, { recursive: true, force: true }); }
}

test("preparation gives only task inputs and refuses to overwrite an existing trial", () => fixture("reconcile", (workspace, packet) => {
  assert.deepEqual(Object.keys(packet).sort(), ["case", "prompt", "skill", "workspace"]);
  assert.throws(() => prepareCase("reconcile", workspace), /Refusing to overwrite/);
  assert.throws(() => prepareCase("reconcile", fileURLToPath(new URL("../forbidden-trial", import.meta.url))), /outside the source repository/);
  assert.match(readFileSync(packet.skill, "utf8"), /Reconcile/);
}));

test("check-only detects changed, added, and transiently restored final-state limitations", () => fixture("docs-check-only", workspace => {
  const original = readFileSync(join(workspace, "README.md"));
  let result = checkCase(workspace);
  assert.equal(result.mechanicalPassed, true);
  assert.ok(result.reviewRequired.length > 0);
  writeFileSync(join(workspace, "README.md"), "Changed without authority\n");
  assert.equal(checkCase(workspace).mechanicalPassed, false);
  writeFileSync(join(workspace, "README.md"), original);
  writeFileSync(join(workspace, "unsolicited.md"), "Extra artifact\n");
  assert.equal(checkCase(workspace).mechanicalPassed, false);
  rmSync(join(workspace, "unsolicited.md"));
  result = checkCase(workspace);
  assert.equal(result.mechanicalPassed, true);
  assert.match(result.limitation, /cannot exclude transient writes/);
}));

test("docs batch requires every current target and protects implementation and history", () => fixture("docs-batch", workspace => {
  assert.equal(checkCase(workspace).mechanicalPassed, false);
  writeFileSync(join(workspace, "README.md"), "Default json, limit 25.\n");
  writeFileSync(join(workspace, "docs/usage.md"), "--limit 25; --format csv\n");
  assert.equal(checkCase(workspace).mechanicalPassed, false);
  writeFileSync(join(workspace, "docs/api/reference.md"), "Returns a string; limit 25; json or csv.\n");
  execFileSync(process.execPath, ["scripts/render-options.mjs"], { cwd: workspace });
  const result = checkCase(workspace);
  assert.equal(result.mechanicalPassed, true);
  assert.ok(result.reviewRequired.length > 0, "Minimal matching text still needs substantive review");
  writeFileSync(join(workspace, "docs/history/initial-design.md"), "Rewritten history\n");
  assert.equal(checkCase(workspace).mechanicalPassed, false);
}));

test("reconcile requires a status update and preserves an unsettled untracked artifact", () => fixture("reconcile", workspace => {
  assert.equal(checkCase(workspace).mechanicalPassed, false);
  const plan = join(workspace, "blueprints/plans/retry.md");
  writeFileSync(plan, readFileSync(plan, "utf8").replace("not started", "shipped"));
  assert.equal(checkCase(workspace).mechanicalPassed, true);
  rmSync(join(workspace, "blueprints/mockups/unreviewed.html"));
  assert.equal(checkCase(workspace).mechanicalPassed, false);
}));

test("authorized edit checks the actual function through its tests and preserves Done", () => fixture("authorized-edit", workspace => {
  assert.equal(checkCase(workspace).mechanicalPassed, false);
  for (const name of ["status.mjs", "status.test.mjs"]) {
    const file = join(workspace, name);
    writeFileSync(file, readFileSync(file, "utf8").replaceAll("Pending", "Todo"));
  }
  assert.equal(checkCase(workspace).mechanicalPassed, true);
  const implementation = join(workspace, "status.mjs");
  writeFileSync(implementation, "export function statusLabel(done) { return done ? 'Todo' : 'Done'; }\n");
  const broken = checkCase(workspace);
  assert.equal(broken.mechanicalPassed, false);
  assert.notEqual(broken.command.status, 0);
}));

test("artifact defaults protect local notes and retained deliverables even after an ignore rule", () => fixture("artifact-default", workspace => {
  const ignore = join(workspace, ".gitignore");
  const artifact = join(workspace, "blueprints/mockups/options/index.html");
  mkdirSync(join(workspace, "blueprints/mockups/options"), { recursive: true });
  writeFileSync(artifact, "<!doctype html><html><script>const selected = 1;</script></html>\n");
  assert.equal(checkCase(workspace).mechanicalPassed, false, "Creating the artifact alone leaves its storage wrong");
  writeFileSync(ignore, readFileSync(ignore, "utf8") + "/blueprints/\n");
  assert.equal(checkCase(workspace).mechanicalPassed, true);
  execFileSync("git", ["add", "-f", "--", "blueprints/mockups/options/index.html"], { cwd: workspace });
  const staged = checkCase(workspace);
  assert.equal(staged.mechanicalPassed, false);
  assert.ok(staged.failures.some(f => f.includes("remains tracked")));
  assert.ok(staged.failures.some(f => f.includes("staged for addition/update")));
  execFileSync("git", ["rm", "--cached", "--", "blueprints/mockups/options/index.html"], { cwd: workspace });
  assert.equal(checkCase(workspace).mechanicalPassed, true);
  rmSync(join(workspace, "blueprints/thoughts/local-decision.md"));
  assert.equal(checkCase(workspace).mechanicalPassed, false, "Ignoring does not permit deleting a unique local decision");
}));

test("ignored-but-tracked artifacts fail until untracked, with disk contents and fixtures preserved", () => fixture("artifact-tracked-cleanup", workspace => {
  const legacy = join(workspace, "dogfood/legacy/report.md");
  const original = readFileSync(legacy);
  mkdirSync(join(workspace, "dogfood/current"), { recursive: true });
  writeFileSync(join(workspace, "dogfood/current/report.md"), "archive · find-archived · restore\n");
  execFileSync("git", ["check-ignore", "--no-index", "-q", "--", "dogfood/legacy/report.md"], { cwd: workspace });
  const ignoredOnly = checkCase(workspace);
  assert.equal(ignoredOnly.mechanicalPassed, false);
  assert.ok(ignoredOnly.failures.some(f => f.includes("remains tracked")));
  execFileSync("git", ["rm", "--cached", "--", "dogfood/legacy/report.md"], { cwd: workspace });
  assert.deepEqual(readFileSync(legacy), original);
  assert.equal(checkCase(workspace).mechanicalPassed, true, "An authorized staged removal is permitted");
  execFileSync("git", ["rm", "--cached", "--", "tests/fixture.json"], { cwd: workspace });
  assert.equal(checkCase(workspace).mechanicalPassed, false, "Retained fixtures must stay tracked");
  execFileSync("git", ["add", "--", "tests/fixture.json"], { cwd: workspace });
  rmSync(legacy);
  assert.equal(checkCase(workspace).mechanicalPassed, false, "Cached removal must preserve the local artifact");
}));

test("probe and dogfood cases preserve products and require semantic review beyond matching prose", () => {
  fixture("probe-decision-evidence", (workspace, packet) => {
    assert.equal(checkCase(workspace).mechanicalPassed, false);
    mkdirSync(join(workspace, "blueprints/thoughts"), { recursive: true });
    writeFileSync(join(workspace, "blueprints/thoughts/probe.md"), "0.86 0.94 8; interference; toy.\n");
    const result = checkCase(workspace);
    assert.equal(result.mechanicalPassed, true);
    assert.ok(result.reviewRequired.some(r => r.includes("adoption claim")));
    assert.equal(Object.hasOwn(packet, "review"), false);
    writeFileSync(join(workspace, "candidate.mjs"), "Changed to force a winner\n");
    assert.equal(checkCase(workspace).mechanicalPassed, false);
  });
  fixture("dogfood-tool-goal", workspace => {
    mkdirSync(join(workspace, "dogfood/current"), { recursive: true });
    writeFileSync(join(workspace, "dogfood/current/report.md"), "archive · find-archived · restore\n");
    assert.equal(checkCase(workspace).mechanicalPassed, true, "Reporting tracked residue does not authorize cleanup");
    execFileSync("git", ["rm", "--cached", "--", "README.md"], { cwd: workspace });
    assert.ok(checkCase(workspace).failures.some(f => f.includes("changed the Git index")));
    execFileSync("git", ["add", "--", "README.md"], { cwd: workspace });
    writeFileSync(join(workspace, "demo.txt"), "Unrequested polishing\n");
    assert.equal(checkCase(workspace).mechanicalPassed, false);
  });
});

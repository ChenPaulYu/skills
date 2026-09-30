import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

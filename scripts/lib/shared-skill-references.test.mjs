import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { buildSharedSkillReferences, SHARED_SKILL_REFERENCES } from "./shared-skill-references.mjs";

test("shared reference updates reach every self-contained consumer deterministically", () => {
  const root = mkdtempSync(join(tmpdir(), "skills-shared-reference-test-"));
  try {
    for (const { source } of SHARED_SKILL_REFERENCES) {
      mkdirSync(dirname(join(root, source)), { recursive: true });
      writeFileSync(join(root, source), "# Original convention\n");
    }
    buildSharedSkillReferences(root);
    for (const { source, destinations } of SHARED_SKILL_REFERENCES) {
      const initial = destinations.map(p => readFileSync(join(root, p), "utf8"));
      assert.ok(initial.every(content => content === initial[0]));
      assert.ok(initial[0].includes("# Original convention\n"));
      writeFileSync(join(root, source), "# Revised convention\n");
      buildSharedSkillReferences(root);
      const revised = destinations.map(p => readFileSync(join(root, p), "utf8"));
      assert.ok(revised.every(content => content === revised[0]));
      assert.notEqual(revised[0], initial[0]);
      assert.ok(revised[0].includes("# Revised convention\n"));
      buildSharedSkillReferences(root);
      assert.deepEqual(destinations.map(p => readFileSync(join(root, p), "utf8")), revised);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

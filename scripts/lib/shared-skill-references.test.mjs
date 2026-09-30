import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
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

test("retirement prunes only owned reference bundles without following symlinks", () => {
  const root = mkdtempSync(join(tmpdir(), "skills-retired-reference-test-"));
  try {
    for (const { source } of SHARED_SKILL_REFERENCES) {
      mkdirSync(dirname(join(root, source)), { recursive: true });
      writeFileSync(join(root, source), "# Shared convention\n");
    }
    const refs = join(root, "plugins/example/skills/cleanup/references");
    mkdirSync(refs, { recursive: true });
    const marker = "<!-- GENERATED from plugins/old/reference.md by scripts/build-manifests.mjs; do not hand-edit. -->\n";
    writeFileSync(join(refs, "retired.md"), marker + "old bundle\n");
    writeFileSync(join(refs, "owned.md"), "# Hand-owned\n" + marker);
    writeFileSync(join(refs, "other.md"), marker.replace("build-manifests", "another-generator"));
    const outside = join(root, "outside.md");
    writeFileSync(outside, marker);
    symlinkSync(outside, join(refs, "linked.md"));
    buildSharedSkillReferences(root);
    assert.equal(existsSync(join(refs, "retired.md")), false);
    assert.equal(readFileSync(join(refs, "owned.md"), "utf8"), "# Hand-owned\n" + marker);
    assert.ok(existsSync(join(refs, "other.md")));
    assert.equal(readFileSync(outside, "utf8"), marker);
    assert.ok(existsSync(join(refs, "linked.md")));
    for (const { destinations } of SHARED_SKILL_REFERENCES) {
      for (const destination of destinations) assert.ok(existsSync(join(root, destination)));
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

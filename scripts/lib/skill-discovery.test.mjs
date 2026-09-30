/**
 * Exercise both platform generators against source-directory residue.
 * Reads: current generator inputs, catalog discovery, temporary fixture trees.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const SOURCE = fileURLToPath(new URL("../../", import.meta.url));

function outputFiles(root) {
  const files = {};
  function visit(dir, relative = "") {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name), name = `${relative}/${entry.name}`;
      if (entry.isDirectory()) visit(path, name);
      else files[name] = readFileSync(path).toString("base64");
    }
  }
  for (const path of [".agents/skills", "platforms/cursor", ".cursor-plugin"]) visit(join(root, path), path);
  files["AGENTS.md"] = readFileSync(join(root, "AGENTS.md"), "utf8");
  return files;
}

test("Codex and Cursor conversion/emission are invariant to retired directory residue", () => {
  const root = mkdtempSync(join(tmpdir(), "skills-discovery-"));
  try {
    for (const path of ["plugins", "scripts", "platforms/codex", ".claude-plugin", "CLAUDE.md"]) {
      cpSync(join(SOURCE, path), join(root, path), { recursive: true });
    }
    mkdirSync(join(root, "platforms/cursor"), { recursive: true });
    cpSync(join(SOURCE, "platforms/cursor/manifest.json"), join(root, "platforms/cursor/manifest.json"));
    const reference = join(root, "plugins/shape/skills/probe/references/retirement-fixture.md");
    writeFileSync(reference, "Historical /shape:retired-only; actual /shape:probe.\n");
    const run = () => {
      for (const script of ["build-codex.mjs", "build-cursor.mjs"]) {
        execFileSync(process.execPath, [join(root, "scripts", script)], { cwd: root, stdio: "pipe" });
      }
    };
    run();
    const before = outputFiles(root);
    const skills = join(root, "plugins/shape/skills");
    mkdirSync(join(skills, "retired-only/references"), { recursive: true });
    writeFileSync(join(skills, "retired-only/references/history.md"), "Retired resource\n");
    mkdirSync(join(skills, "empty"));
    mkdirSync(join(skills, "malformed/SKILL.md"), { recursive: true });
    run();
    assert.deepEqual(outputFiles(root), before);
    for (const path of [".agents/skills/shape-probe", "platforms/cursor/shape/skills/shape-probe"]) {
      assert.equal(readFileSync(join(root, path, "references/retirement-fixture.md"), "utf8"),
        "Historical /shape:retired-only; actual shape-probe.\n");
    }
    mkdirSync(join(skills, "added"));
    writeFileSync(join(skills, "added/SKILL.md"), '---\nname: added\ndescription: "Fixture skill."\n---\n\n# Added\n');
    run();
    for (const path of [".agents/skills/shape-added/SKILL.md", "platforms/cursor/shape/skills/shape-added/SKILL.md"]) {
      assert.match(readFileSync(join(root, path), "utf8"), /name: shape-added/);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

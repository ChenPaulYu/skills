#!/usr/bin/env node
// Validate the complete index snapshot; neither stash nor rewrite the worktree.
import { validateStaged } from "./lib/staged-validation.mjs";

try {
  validateStaged(process.cwd());
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  console.error(`✗ commit blocked: ${error.message}`);
  console.error("Fix the source, regenerate when needed, and stage the corrected files before retrying.");
  process.exitCode = 1;
}

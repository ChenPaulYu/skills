"""Workspace CLI contracts, including read-only Git context."""

from pathlib import Path
import json
import io
import contextlib
import re
import subprocess
import sys
import tempfile
import unittest


sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "plugins/shape/skills/status/scripts"
sys.path.insert(0, str(SCRIPTS))
from workspace_records import WorkspaceError, run, main


class WorkspaceRecordsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.write("workspace/demo/project.md", "---\nid: demo\ntitle: Demo\nrepositories:\n  app: repos/app\npriorities:\n  - task-a\n---\nProject notes.\n")
        self.write("workspace/demo/records/task-a.md", self.record("task-a", "task", "paused", "Task body"))
        self.write("workspace/demo/records/task-b.md", self.record("task-b", "task", "blocked", "Second task"))
        self.write("workspace/demo/records/plan.md", self.record("plan-a", "plan", "active", "Plan body"))
        self.write("workspace/demo/records/thought.md", self.record("thought-a", "thought", "adopted", "Adopted after plan"))
        self.write("workspace/demo/records/probe.md", self.record("probe-a", "probe", "concluded", "Probe concluded"))
        self.repo = self.root / "repos/app"
        self.repo.mkdir(parents=True)
        self.git("init", "-q")
        self.git("config", "user.email", "test@example.invalid")
        self.git("config", "user.name", "Test")
        (self.repo / "tracked.txt").write_text("base\n")
        self.git("add", "tracked.txt")
        self.git("commit", "-qm", "initial")
        (self.repo / "tracked.txt").write_text("dirty\n")
        (self.repo / "untracked.txt").write_text("untracked\n")

    def tearDown(self) -> None:
        self.temp.cleanup()

    def write(self, relative: str, text: str) -> Path:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def record(self, identifier: str, kind: str, status: str, body: str, links: str = "") -> str:
        return f"---\nid: {identifier}\ntype: {kind}\ntitle: {identifier}\nstatus: {status}\n{links}---\n\n{body}\n"

    def git(self, *args: str) -> None:
        subprocess.run(["git", "-C", str(self.repo), *args], check=True, capture_output=True, text=True)

    def formatted_card(self, path: str, identifier: str, body: str, links: str = "links: []\n") -> Path:
        text = self.record(identifier, "doc", "current", body,
                           "created: 2026-11-26\nupdated: 2026-11-26\n" + links)
        return self.write(path, text)

    def test_missing_relations_is_advisory_until_written_card_is_selected(self):
        path = self.formatted_card("workspace/demo/docs/missing.md", "missing-doc", "Retained knowledge.")
        before = path.read_bytes()
        advisory = run(self.root, "check", "demo")
        self.assertEqual(advisory["status"], "ok")
        self.assertEqual(advisory["format"]["mode"], "advisory")
        self.assertIn("missing-relations", {d["code"] for d in advisory["format"]["findings"]})
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = main(["--root", str(self.root), "check", "demo", "--records", "workspace/demo/docs/missing.md"])
        result = json.loads(output.getvalue())
        self.assertEqual(code, 1)
        self.assertEqual(result["status"], "error")
        self.assertEqual(result["format"]["checked_records"], ["workspace/demo/docs/missing.md"])
        self.assertIn("missing-relations", {d["code"] for d in result["diagnostics"]})
        self.assertEqual(path.read_bytes(), before)

    def test_selected_valid_card_passes_without_normalizing_legacy_records(self):
        path = self.formatted_card("workspace/demo/docs/valid.md", "valid-doc",
                                   "Retained knowledge.\n\n## Relations\n<!-- projection -->\nNo relations recorded yet.\n")
        legacy = self.root / "workspace/demo/records/thought.md"
        before = legacy.read_bytes()
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = main(["--root", str(self.root), "check", "demo", "--records", str(path.relative_to(self.root))])
        result = json.loads(output.getvalue())
        self.assertEqual(code, 0)
        self.assertEqual(result["format"]["findings"], [])
        self.assertIn("not verified", result["format"]["limits"])
        self.assertEqual(legacy.read_bytes(), before)
        self.assertEqual(run(self.root, "show", "demo", "thought-a")["record"]["status"], "adopted")

    def test_relation_projection_matches_identity_not_label_or_row_order(self):
        self.formatted_card("workspace/demo/docs/target space.md", "doc-target", "## Relations\nNo relations recorded yet.")
        path = "workspace/demo/docs/linked.md"
        self.formatted_card(path, "doc-linked", """## Relations
<!-- relations: derived from frontmatter.links -->
| Relation | Record |
|---|---|
| references | [Friendly label](<target%20space.md#section>) |
| supported_by | [Evidence](../records/task-a.md) |
<!-- /relations -->
## Detail
| unrelated | not a projection row |
""", "links:\n- relation: supported_by\n  target: task-a\n- relation: references\n  target: doc-target\n")
        result = run(self.root, "check", "demo", record_paths=[path])
        self.assertEqual(result["status"], "ok", result)

    def test_wrong_existing_record_or_relation_is_not_a_valid_projection(self):
        path = "workspace/demo/docs/linked.md"
        links = "links:\n- relation: supported_by\n  target: task-a\n"
        for row in ("| references | [Task](../records/task-a.md) |",
                    "| supported_by | [Task](../records/task-b.md) |",
                    "| supported_by | [Task](../records/task-a.md) |\n| supported_by | [Duplicate](../records/task-a.md) |"):
            with self.subTest(row=row):
                self.formatted_card(path, "linked", "## Relations\n| Relation | Record |\n|---|---|\n" + row, links)
                result = run(self.root, "check", "demo", record_paths=[path])
                self.assertEqual(result["status"], "error")
                self.assertIn("relations-projection-mismatch", {d["code"] for d in result["diagnostics"]})

    def test_relation_link_must_target_project_record_not_just_existing_file(self):
        self.write("workspace/demo/docs/support.txt", "Not a work card")
        path = "workspace/demo/docs/linked.md"
        for target in ("missing.md", "support.txt", "https://example.invalid/record.md", "https://[invalid"):
            with self.subTest(target=target):
                self.formatted_card(path, "linked", f"## Relations\n| supported_by | [Target]({target}) |",
                                    "links:\n- relation: supported_by\n  target: task-a\n")
                result = run(self.root, "check", "demo", record_paths=[path])
                self.assertIn("invalid-relations-target", {d["code"] for d in result["diagnostics"]})

    def test_fenced_or_commented_relations_do_not_satisfy_visible_interface(self):
        path = "workspace/demo/docs/hidden.md"
        for body in ("```md\n## Relations\nNo relations recorded yet.\n```",
                     "<!--\n## Relations\nNo relations recorded yet.\n-->"):
            with self.subTest(body=body):
                self.formatted_card(path, "hidden", body)
                result = run(self.root, "check", "demo", record_paths=[path])
                self.assertIn("missing-relations", {d["code"] for d in result["diagnostics"]})

    def test_empty_links_require_explicit_absence_and_reject_stale_rows(self):
        path = "workspace/demo/docs/empty.md"
        for body, code in (("## Relations\n", "missing-empty-relations"),
                           ("## Relations\nNo relations recorded yet.\n| references | [Task](../records/task-a.md) |",
                            "relations-projection-mismatch")):
            self.formatted_card(path, "empty", body)
            result = run(self.root, "check", "demo", record_paths=[path])
            self.assertIn(code, {d["code"] for d in result["diagnostics"]})

    def test_new_card_requires_metadata_even_when_relations_exist(self):
        path = "workspace/demo/docs/metadata.md"
        self.write(path, self.record("metadata", "doc", "current", "## Relations\nNo relations recorded yet."))
        result = run(self.root, "check", "demo", record_paths=[path])
        missing = [d["message"] for d in result["diagnostics"] if d["code"] == "record-missing-field"]
        self.assertEqual(len(missing), 3)

    def test_relation_projection_ignores_fenced_examples_and_allows_wrapped_empty_statement(self):
        path = "workspace/demo/docs/examples.md"
        self.formatted_card(path, "examples", """## Relations
No relations
recorded yet.
```md
| references | [This is only an example](../records/task-a.md) |
## Relations
```
""")
        self.assertEqual(run(self.root, "check", "demo", record_paths=[path])["status"], "ok")

    def test_projection_does_not_resolve_through_other_project(self):
        self.write("workspace/other/project.md", "---\nid: other\ntitle: Other\n---\n")
        self.formatted_card("workspace/other/docs/task.md", "task-a", "## Relations\nNo relations recorded yet.")
        path = "workspace/demo/docs/cross-project.md"
        self.formatted_card(path, "cross-project", "## Relations\n| references | [Task](../../other/docs/task.md) |",
                            "links:\n- relation: references\n  target: task-a\n")
        result = run(self.root, "check", "demo", record_paths=[path])
        self.assertIn("invalid-relations-target", {d["code"] for d in result["diagnostics"]})
        wrong_scope = run(self.root, "check", "demo", record_paths=["workspace/other/docs/task.md"])
        self.assertIn("invalid-record-selection", {d["code"] for d in wrong_scope["diagnostics"]})

    def test_required_selection_cannot_silently_skip_wrong_or_empty_paths(self):
        for paths in ([], ["workspace/demo/project.md"], ["workspace/demo/docs/nope.md"], ["../outside.md"]):
            with self.subTest(paths=paths):
                result = run(self.root, "check", "demo", record_paths=paths)
                self.assertEqual(result["status"], "error")
                self.assertIn("invalid-record-selection", {d["code"] for d in result["diagnostics"]})

    def test_task_embeds_planning_without_replacing_legacy_plan(self) -> None:
        body = ("## Goal and completion criteria\nDeliver the chosen behavior.\n"
                "## Implementation plan\nReuse the existing entry point.\n"
                "## Verification plan\nExercise the user workflow.\n"
                "## Progress and next action\nPlanning only; execution not started.\n")
        task = self.write("workspace/demo/tasks/new-work.md", self.record("new-work", "task", "planned", body))
        legacy = self.root / "workspace/demo/records/plan.md"
        before = {path: path.read_bytes() for path in (task, legacy)}
        result = run(self.root, "status", "demo")
        records = {identifier: run(self.root, "show", "demo", identifier)["record"]
                   for identifier in ("new-work", "plan-a")}
        self.assertIn("## Implementation plan", records["new-work"]["body"])
        self.assertIn("Planning only; execution not started", records["new-work"]["body"])
        self.assertEqual(records["new-work"]["status"], "planned")
        self.assertEqual(records["plan-a"]["type"], "plan")
        self.assertIn("plan-a", {record["id"] for record in result["active_records"]})
        self.assertEqual(before, {path: path.read_bytes() for path in (task, legacy)})

    def test_retained_docs_are_searchable_and_separate_from_active_work(self):
        doc = self.write("workspace/demo/docs/architecture.md", self.record("doc-a", "doc", "current", "Café architecture: keep the original input immutable."))
        before = doc.read_bytes()
        result = run(self.root, "status", "demo")
        self.assertEqual([d["id"] for d in result["docs"]], ["doc-a"])
        self.assertNotIn("doc-a", {r["id"] for r in result["active_records"]})
        self.assertNotIn("doc-a", {r["id"] for r in result["tasks"]})
        found = run(self.root, "search", "demo", query="CAFÉ")
        self.assertEqual([r["id"] for r in found["matches"]], ["doc-a"])
        self.assertIn("immutable", found["matches"][0]["body"])
        self.assertEqual(doc.read_bytes(), before)
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = main(["--root", str(self.root), "search", "demo", "immutable"])
        self.assertEqual(code, 0)
        self.assertEqual(json.loads(output.getvalue())["matches"][0]["id"], "doc-a")
        with self.assertRaises(WorkspaceError):
            run(self.root, "search", "demo", query=" ")

    def test_docs_never_become_ordinary_cleanup_candidates(self):
        for status in ("draft", "current", "superseded", "unverified"):
            self.write(f"workspace/demo/docs/{status}.md", self.record(f"doc-{status}", "doc", status, "Retain this explanation regardless of links or completion."))
        self.write("workspace/demo/thoughts/draft.md", self.record("working-a", "thought", "closed", "Knowledge has a retained owner.").replace("type: thought\n", "type: thought\nretention: working\n"))
        result = run(self.root, "review", "demo")
        self.assertTrue(all(r["type"] != "doc" for r in result["candidates"]))
        candidate = next(r for r in result["candidates"] if r["id"] == "working-a")
        self.assertIn("working_draft", candidate["flags"])
        self.assertEqual(len(run(self.root, "status", "demo")["docs"]), 4)

    def test_misclassified_document_is_diagnosed_but_never_a_cleanup_candidate(self):
        self.write("workspace/demo/docs/legacy.md", self.record("legacy-doc", "thought", "superseded", "Retained file with old metadata."))
        result = run(self.root, "check", "demo")
        self.assertIn("folder-type-mismatch", {d["code"] for d in result["diagnostics"]})
        self.assertNotIn("legacy-doc", {r["id"] for r in run(self.root, "review", "demo")["candidates"]})

    def test_whole_thought_move_preserves_rationale_id_and_task_references(self):
        identifier = "choice-a"
        rationale = "Use immutable inputs because later comparisons require their original state.\n\nRejected: overwrite the baseline. This loses reproducibility.\n\nSource claim remains unverified.\n"
        source = self.write("workspace/demo/thoughts/choice.md", self.record(identifier, "thought", "closed", rationale).replace("type: thought\n", "type: thought\nretention: working\n"))
        original_body = run(self.root, "show", "demo", identifier)["record"]["body"]
        task = self.write("workspace/demo/tasks/linked.md", self.record("linked-task", "task", "done", "[Design](../thoughts/choice.md)", "links:\n  - relation: implements\n    target: choice-a\n"))
        destination = self.write("workspace/demo/docs/choice.md", source.read_text().replace("type: thought\nretention: working", "type: doc").replace("status: closed", "status: current"))
        task.write_text(task.read_text().replace("../thoughts/choice.md", "../docs/choice.md"))
        source.unlink()  # Simulated authorized consolidation, outside the read-only helper.
        shown = run(self.root, "show", "demo", identifier)
        self.assertEqual(shown["record"]["body"], original_body)
        self.assertEqual(shown["record"]["path"], "workspace/demo/docs/choice.md")
        self.assertIn({"source": "linked-task", "relation": "implements"}, shown["backlinks"])
        self.assertTrue((task.parent / "../docs/choice.md").resolve().is_file())
        self.assertEqual(run(self.root, "check", "demo")["status"], "ok")
        self.assertIn(identifier, {r["id"] for r in run(self.root, "graph", "demo")["nodes"]})
        self.assertEqual(destination.read_text().count(rationale), 1)

    def test_legacy_thoughts_are_readable_nonblocking_migrations(self):
        legacy = self.root / "workspace/demo/records/thought.md"
        before = legacy.read_bytes()
        self.write("workspace/demo/thoughts/new.md", self.record("new-thought", "thought", "draft", "Temporary exploration.").replace("type: thought\n", "type: thought\nretention: working\n"))
        result = run(self.root, "check", "demo")
        self.assertEqual(result["status"], "ok")
        paths = {m["path"] for m in result["migrations"]}
        self.assertIn("workspace/demo/records/thought.md", paths)
        self.assertNotIn("workspace/demo/thoughts/new.md", paths)
        self.assertEqual(legacy.read_bytes(), before)

    def test_projects_status_and_git_are_read_only_and_include_active_bodies(self) -> None:
        before = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        result = run(self.root, "status", "demo")
        after = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        self.assertEqual(before, after)
        self.assertEqual(result["project"]["body"], "Project notes.\n")
        self.assertEqual({task["status"] for task in result["tasks"]}, {"paused", "blocked"})
        self.assertEqual({record["id"] for record in result["active_records"]}, {"task-a", "task-b", "plan-a"})
        self.assertEqual({record["id"] for record in result["priorities"]}, {"task-a"})
        task_a = next(record for record in result["active_records"] if record["id"] == "task-a")
        self.assertIn("Task body", task_a["body"])
        git = result["git"][0]
        self.assertEqual(git["head"], self.git_output("rev-parse", "HEAD"))
        self.assertTrue(any("tracked.txt" in line for line in git["status_porcelain"]))
        self.assertTrue(any("untracked.txt" in line for line in git["status_porcelain"]))
        self.assertEqual(run(self.root, "projects")["projects"][0]["id"], "demo")

    def git_output(self, *args: str) -> str:
        return subprocess.run(["git", "-C", str(self.repo), *args], check=True, capture_output=True, text=True).stdout.strip()

    def test_adopted_thought_and_concluded_probe_do_not_infer_task_completion(self) -> None:
        result = run(self.root, "status", "demo")
        self.assertEqual(run(self.root, "show", "demo", "thought-a")["record"]["status"], "adopted")
        self.assertNotIn("done", {r["status"] for r in result["tasks"]})
        self.assertEqual(run(self.root, "show", "demo", "probe-a")["record"]["status"], "concluded")

    def test_graph_edges_backlinks_and_project_local_show(self) -> None:
        self.write("workspace/demo/records/task-a.md", self.record("task-a", "task", "paused", "Task", "links:\n  - relation: informs\n    target: thought-a\n"))
        graph = run(self.root, "graph", "demo")
        self.assertIn({"source": "task-a", "relation": "informs", "target": "thought-a"}, graph["edges"])
        shown = run(self.root, "show", "demo", "thought-a")
        self.assertEqual(shown["backlinks"], [{"source": "task-a", "relation": "informs"}])
        self.write("workspace/other/project.md", "---\nid: other\ntitle: Other\n---\n")
        with self.assertRaises(WorkspaceError):
            run(self.root, "show", "other", "task-a")

    def test_check_reports_malformed_yaml_dangling_duplicate_and_unknown_status(self) -> None:
        self.write("workspace/demo/records/bad.md", "---\nid: bad\ntype: task\nstatus: active\nlinks:\n  broken: [\n---\nReadable body\n")
        self.write("workspace/demo/records/unknown-status.md", self.record("unknown", "task", "invented", "Readable"))
        self.write("workspace/demo/records/copy.md", self.record("task-a", "task", "done", "Duplicate"))
        self.write("workspace/demo/records/link.md", self.record("link", "idea", "saved", "Link", "links:\n  - relation: based-on\n    target: absent\n"))
        report = run(self.root, "check")
        self.assertEqual(report["status"], "error")
        codes = {d["code"] for d in report["diagnostics"]}
        self.assertTrue({"record-frontmatter", "duplicate-id", "unknown-status", "dangling-link"}.issubset(codes))

    def test_missing_project_and_repository_mapping_are_reported(self) -> None:
        with self.assertRaises(WorkspaceError):
            run(self.root, "status", "missing")
        self.write("workspace/demo/project.md", "---\nid: demo\ntitle: Demo\n---\n")
        status = run(self.root, "status", "demo")
        self.assertIn("git-unmapped", {d["code"] for d in status["diagnostics"]})

    def test_absent_project_directory_is_a_diagnostic(self) -> None:
        with tempfile.TemporaryDirectory() as empty:
            report = run(Path(empty), "check")
        self.assertEqual(report["status"], "error")
        self.assertEqual(report["diagnostics"][0]["code"], "missing-workspace")

    def test_duplicate_ids_are_project_scoped_and_show_rejects_ambiguous_id(self) -> None:
        self.write("workspace/other/project.md", "---\nid: other\ntitle: Other\n---\n")
        self.write("workspace/other/records/task.md", self.record("task-a", "idea", "saved", "Same ID is valid here"))
        self.assertNotIn("duplicate-id", {d["code"] for d in run(self.root, "check")["diagnostics"]})
        self.write("workspace/demo/records/copy.md", self.record("task-a", "idea", "saved", "Duplicate here"))
        self.assertIn("duplicate-id", {d["code"] for d in run(self.root, "check", "demo")["diagnostics"]})
        with self.assertRaisesRegex(WorkspaceError, "duplicated"):
            run(self.root, "show", "demo", "task-a")

    def test_project_ids_are_global_and_folder_selector_uses_canonical_graph(self) -> None:
        self.write("workspace/folder-alias/project.md", "---\nid: canonical\ntitle: Canonical\n---\n")
        self.write("workspace/folder-alias/records/a.md", self.record("shared", "idea", "saved", "A"))
        graph = run(self.root, "graph", "folder-alias")
        self.assertEqual(graph["project"], "canonical")
        self.assertEqual({node["id"] for node in graph["nodes"]}, {"shared"})
        self.write("workspace/another/project.md", "---\nid: canonical\ntitle: Duplicate project ID\n---\n")
        report = run(self.root, "check")
        self.assertIn("duplicate-project-id", {d["code"] for d in report["diagnostics"]})

    def test_new_project_reads_without_placeholder_work_records(self):
        self.write("workspace/new-project/project.md", "---\nid: new-project\ntitle: New project\ncreated: 2026-11-14\nupdated: 2026-11-14\nrepositories:\n  app: repos/app\npriorities: []\n---\nNew connection.\n")
        before = {str(p): p.read_bytes() for p in (self.root / "workspace/new-project").rglob("*") if p.is_file()}
        projects = run(self.root, "projects")
        self.assertEqual(sum(p["id"] == "new-project" for p in projects["projects"]), 1)
        for _ in range(2):
            status = run(self.root, "status", "new-project")
            self.assertEqual(status["tasks"], [])
            self.assertEqual(status["active_records"], [])
            self.assertEqual(status["project"]["repositories"], {"app": "repos/app"})
            self.assertEqual(run(self.root, "check", "new-project")["diagnostics"], [])
        self.assertEqual(before, {str(p): p.read_bytes() for p in (self.root / "workspace/new-project").rglob("*") if p.is_file()})

    def test_graph_tolerates_unhashable_record_id(self) -> None:
        self.write("workspace/demo/records/unhashable-id.md", "---\nid: []\ntype: idea\ntitle: Bad ID\nstatus: saved\n---\nBody\n")
        graph = run(self.root, "graph", "demo")
        self.assertTrue(any(node["id"] == [] for node in graph["nodes"]))

    def test_check_can_scope_diagnostics_and_missing_project_is_absent(self) -> None:
        self.write("workspace/demo/records/bad.md", "---\nid: bad\ntype: task\nstatus: nope\ntitle: Bad\n---\nBody\n")
        self.write("workspace/other/project.md", "---\nid: other\ntitle: Other\n---\n")
        self.write("workspace/other/records/good.md", self.record("good", "idea", "saved", "Good"))
        selected = run(self.root, "check", "other")
        self.assertEqual(selected["status"], "ok")
        self.assertEqual(selected["read_tier"], "standard records")
        missing = run(self.root, "check", "not-here")
        self.assertEqual(missing["read_tier"], "absent")
        self.assertEqual(missing["diagnostics"][0]["code"], "missing-project")

    def test_malformed_yaml_values_are_safe_and_keep_body_metadata(self) -> None:
        self.write("workspace/demo/records/weird.md", "---\nid: weird\ntype: [task]\ntitle: {value: odd}\nstatus: {bad: value}\nrepo: [app]\ncreated: 2026-11-13\n---\nBody survives\n")
        self.write("workspace/demo/records/unhashable-id.md", "---\nid: []\ntype: idea\ntitle: Bad ID\nstatus: saved\n---\nBody survives too\n")
        result = run(self.root, "show", "demo", "weird")
        encoded = json.dumps(result, ensure_ascii=False)
        self.assertIn("Body survives", encoded)
        self.assertIn("2026-11-13", encoded)
        codes = {d["code"] for d in result["diagnostics"]}
        self.assertTrue({"missing-record-id", "unknown-type", "unknown-status", "missing-record-title", "unknown-repo"}.issubset(codes))
        self.assertEqual(result["read_tier"], "non-standard readable records")

    def test_invalid_utf8_is_a_diagnostic_not_a_crash(self) -> None:
        path = self.root / "workspace/demo/records/invalid.md"
        path.write_bytes(b"---\nid: invalid\ntype: idea\ntitle: Invalid\nstatus: saved\n---\n\xff")
        report = run(self.root, "check", "demo")
        self.assertIn("record-frontmatter", {d["code"] for d in report["diagnostics"]})
        self.assertEqual(report["read_tier"], "non-standard readable records")

    def test_status_keeps_record_state_when_git_mapping_is_missing_or_unavailable(self) -> None:
        self.write("workspace/demo/project.md", "---\nid: demo\ntitle: Demo\n---\n")
        result = run(self.root, "status", "demo")
        self.assertEqual({task["id"] for task in result["tasks"]}, {"task-a", "task-b"})
        self.assertEqual(result["git"], [])
        self.assertIn("git-unmapped", {d["code"] for d in result["diagnostics"]})
        self.write("workspace/demo/project.md", "---\nid: demo\ntitle: Demo\nrepositories:\n  missing: repos/nope\n---\n")
        result = run(self.root, "status", "demo")
        self.assertEqual(len(result["tasks"]), 2)
        self.assertIn("error", result["git"][0])
        self.assertIn("git-unavailable", {d["code"] for d in result["diagnostics"]})

    def test_priorities_follow_metadata_order_and_links_cannot_cross_projects(self) -> None:
        self.write("workspace/demo/project.md", "---\nid: demo\ntitle: Demo\nrepositories:\n  app: repos/app\npriorities:\n  - task-b\n  - task-a\n---\n")
        self.assertEqual([r["id"] for r in run(self.root, "status", "demo")["priorities"]], ["task-b", "task-a"])
        self.write("workspace/other/project.md", "---\nid: other\ntitle: Other\n---\n")
        self.write("workspace/other/records/foreign.md", self.record("foreign", "idea", "saved", "Foreign"))
        self.write("workspace/demo/records/task-a.md", self.record("task-a", "task", "paused", "Task", "links:\n  - relation: refers\n    target: foreign\n"))
        self.assertIn("dangling-link", {d["code"] for d in run(self.root, "check", "demo")["diagnostics"]})

    def test_read_tier_is_reported_by_non_check_commands(self) -> None:
        self.assertEqual(run(self.root, "projects")["read_tier"], "standard records")
        self.assertEqual(run(self.root, "status", "demo")["read_tier"], "standard records")
        self.assertEqual(run(self.root, "graph", "demo")["read_tier"], "standard records")
        self.assertEqual(run(self.root, "show", "demo", "task-a")["read_tier"], "standard records")
        with tempfile.TemporaryDirectory() as empty:
            self.assertEqual(run(Path(empty), "projects")["read_tier"], "absent")

    def test_typed_folders_preserve_ids_edges_and_backlinks_after_relocation(self) -> None:
        self.write("workspace/demo/records/task-a.md", self.record(
            "task-a", "task", "paused", "Task body", "links:\n  - relation: implements\n    target: thought-a\n"))
        before = run(self.root, "graph", "demo")
        for source in (self.root / "workspace/demo/records").glob("*.md"):
            kind = next(line.split(": ", 1)[1] for line in source.read_text().splitlines() if line.startswith("type: "))
            destination = self.root / "workspace/demo" / f"{kind}s"
            if kind in {"mockup", "probe"}:
                destination = destination / source.stem
                filename = f"{kind}.md"
            else:
                filename = source.name
            destination.mkdir(parents=True, exist_ok=True)
            source.rename(destination / filename)
        snapshot = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        after = run(self.root, "graph", "demo")
        self.assertEqual({n["id"] for n in before["nodes"]}, {n["id"] for n in after["nodes"]})
        self.assertEqual(before["edges"], after["edges"])
        self.assertEqual(run(self.root, "check", "demo")["status"], "ok")
        shown = run(self.root, "show", "demo", "thought-a")
        self.assertIn({"source": "task-a", "relation": "implements"}, shown["backlinks"])
        status = run(self.root, "status", "demo")
        self.assertEqual({t["id"] for t in status["tasks"]}, {"task-a", "task-b"})
        self.assertEqual(snapshot, {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()})

    def test_mockup_probe_cards_exclude_supporting_markdown_and_outputs(self) -> None:
        self.write("workspace/demo/mockups/sidebar/mockup.md", self.record("mockup-a", "mockup", "selected", "Pick B"))
        self.write("workspace/demo/mockups/sidebar/README.md", "Supporting prose without frontmatter")
        self.write("workspace/demo/mockups/sidebar/index.html", "<html>interactive fixture</html>")
        self.write("workspace/demo/probes/latency/probe.md", self.record("probe-b", "probe", "concluded", "Inconclusive"))
        self.write("workspace/demo/probes/latency/results.md", "This is evidence, not another record.")
        self.write("workspace/demo/probes/latency/results.json", '{"elapsed": 12}')
        self.write("workspace/demo/probes/latency/fixtures/probe.md", self.record("ghost-probe", "probe", "concluded", "Fixture only"))
        self.write("workspace/demo/mockups/sidebar/variants/mockup.md", self.record("ghost-mockup", "mockup", "draft", "Fixture only"))
        graph = run(self.root, "graph", "demo")
        self.assertEqual(len(graph["nodes"]), 7)
        self.assertEqual(graph["diagnostics"], [])
        self.assertEqual(run(self.root, "show", "demo", "mockup-a")["record"]["path"],
                         "workspace/demo/mockups/sidebar/mockup.md")

    def test_mixed_layout_reports_duplicates_and_folder_type_mismatch(self) -> None:
        self.write("workspace/demo/tasks/duplicate.md", self.record("task-a", "task", "paused", "Duplicate"))
        self.write("workspace/demo/ideas/wrong-folder.md", self.record("misplaced", "task", "planned", "Still readable"))
        report = run(self.root, "check", "demo")
        self.assertTrue({"duplicate-id", "folder-type-mismatch"}.issubset({d["code"] for d in report["diagnostics"]}))
        self.assertEqual(run(self.root, "show", "demo", "misplaced")["record"]["body"], "Still readable\n")
        self.assertEqual(report["read_tier"], "non-standard readable records")

    def test_check_lists_retired_plans_as_migrations_without_failing(self) -> None:
        self.write("workspace/demo/plans/old.md", self.record("old-plan", "plan", "active", "Old approach"))
        result = run(self.root, "check", "demo")
        self.assertEqual(result["status"], "ok")
        self.assertIn("workspace/demo/plans/old.md", [m["path"] for m in result["migrations"]])

    def test_unverified_import_is_readable_without_becoming_active_or_done(self) -> None:
        self.write("workspace/demo/plans/imported.md", self.record("imported", "plan", "unverified", "Legacy claimed complete; not reverified"))
        self.assertEqual(run(self.root, "check", "demo")["status"], "ok")
        shown = run(self.root, "show", "demo", "imported")["record"]
        self.assertEqual(shown["status"], "unverified")
        self.assertNotIn("imported", {r["id"] for r in run(self.root, "status", "demo")["active_records"]})

    def test_cli_requires_explicit_root_and_returns_json(self) -> None:
        result = subprocess.run([str(SCRIPTS / "workspace"), "--root", str(self.root), "projects"], capture_output=True, text=True, check=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["projects"][0]["id"], "demo")
        selected_check = subprocess.run([str(SCRIPTS / "workspace"), "--root", str(self.root), "check", "demo"], capture_output=True, text=True, check=False)
        self.assertEqual(selected_check.returncode, 0, selected_check.stderr)
        self.assertEqual(json.loads(selected_check.stdout)["status"], "ok")
        no_root = subprocess.run([str(SCRIPTS / "workspace"), "projects"], capture_output=True, text=True, check=False)
        self.assertEqual(no_root.returncode, 2)
        missing = subprocess.run([str(SCRIPTS / "workspace"), "--root", str(self.root), "status", "missing"], capture_output=True, text=True, check=False)
        self.assertEqual(missing.returncode, 1)
        self.assertEqual(json.loads(missing.stdout)["read_tier"], "absent")



class WorkspaceViewTest(unittest.TestCase):
    setUp = WorkspaceRecordsTest.setUp
    tearDown = WorkspaceRecordsTest.tearDown
    write = WorkspaceRecordsTest.write
    git = WorkspaceRecordsTest.git
    record = WorkspaceRecordsTest.record
    def export(self, output):
        with contextlib.redirect_stdout(io.StringIO()) as stream:
            code = main(["--root", str(self.root), "view", "demo", "--output", str(output)])
        return code, json.loads(stream.getvalue())

    def test_export_uses_real_records_without_writing_sources(self):
        before = {str(p): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        with tempfile.TemporaryDirectory() as output_dir:
            output = Path(output_dir) / "view.html"
            code, payload = self.export(output)
            self.assertEqual(code, 0)
            html = output.read_text()
            data = json.loads(re.search(r'<script id="workspace-data" type="application/json">(.*?)</script>', html, re.S)[1])
            self.assertEqual(data["graph"], run(self.root, "graph", "demo"))
            self.assertEqual(payload["nodes"], len(data["records"]))
            self.assertIn("Task body", html)
            self.assertNotIn('src="https://', html)
            self.assertIn('id="search"', html)
        self.assertEqual(before, {str(p): p.read_bytes() for p in self.root.rglob("*") if p.is_file()})

    def test_project_dates_preserve_precision_without_exporting_other_metadata(self):
        self.write("workspace/demo/project.md", "---\nid: demo\ntitle: Demo\ncreated: 2026-11-11\nupdated: 2026-11-14T03:00:00Z\nprivate_hint: must-not-export\n---\nProject notes.\n")
        with tempfile.TemporaryDirectory() as output_dir:
            output = Path(output_dir) / "dates.html"
            self.assertEqual(self.export(output)[0], 0)
            data = json.loads(re.search(r'<script id="workspace-data" type="application/json">(.*?)</script>', output.read_text(), re.S)[1])
            self.assertEqual(data["project"]["metadata"], {"created": "2026-11-11", "updated": "2026-11-14T03:00:00+00:00"})
            self.assertEqual(data["projects"][0]["metadata"], data["project"]["metadata"])
            self.assertNotIn("must-not-export", output.read_text())

    def test_record_text_cannot_break_out_of_data_script(self):
        attack = '</script><script>globalThis.sourceExecuted=true</script>'
        self.write("workspace/demo/records/task-a.md", self.record("task-a", "task", "paused", attack))
        with tempfile.TemporaryDirectory() as output_dir:
            output = Path(output_dir) / "view.html"
            self.assertEqual(self.export(output)[0], 0)
            html = output.read_text()
            self.assertNotIn(attack, html)
            data = json.loads(re.search(r'<script id="workspace-data" type="application/json">(.*?)</script>', html, re.S)[1])
            self.assertIn(attack, data["records"][0]["body"] if data["records"][0]["id"] == "task-a" else next(x["body"] for x in data["records"] if x["id"] == "task-a"))

    def test_export_refuses_source_tree_and_existing_output(self):
        original = self.root / "workspace/demo/project.md"
        before = original.read_bytes()
        self.assertEqual(self.export(original)[0], 1)
        self.assertEqual(original.read_bytes(), before)
        self.assertEqual(self.export(self.root / "new.html")[0], 1)
        self.assertFalse((self.root / "new.html").exists())
        with tempfile.TemporaryDirectory() as output_dir:
            output = Path(output_dir) / "view.html"
            output.write_text("keep me")
            self.assertEqual(self.export(output)[0], 1)
            self.assertEqual(output.read_text(), "keep me")

    def test_empty_and_nonstandard_records_remain_honest(self):
        for p in (self.root / "workspace/demo/records").glob("*.md"):
            p.unlink()
        with tempfile.TemporaryDirectory() as output_dir:
            output = Path(output_dir) / "empty.html"
            code, payload = self.export(output)
            self.assertEqual(code, 0)
            self.assertEqual(payload["nodes"], 0)
            self.write("workspace/demo/records/ad-hoc.md", "Readable notes without frontmatter")
            code, payload = self.export(Path(output_dir) / "nonstandard.html")
            self.assertEqual(code, 0)
            self.assertTrue(payload["diagnostics"])
            self.assertEqual(payload["read_tier"], "non-standard readable records")

class WorkspaceReviewTest(unittest.TestCase):
    setUp = WorkspaceRecordsTest.setUp
    tearDown = WorkspaceRecordsTest.tearDown
    write = WorkspaceRecordsTest.write
    git = WorkspaceRecordsTest.git
    record = WorkspaceRecordsTest.record
    export = WorkspaceViewTest.export

    def test_review_signals_do_not_promote_or_delete_unknown_work(self):
        self.write("workspace/demo/records/task-a.md", self.record("task-a", "task", "unverified", "## Observations\n\n- O1: Visible symptom\n- O2: Second symptom\n\n## Next check\nVerify the hypothesis"))
        self.write("workspace/demo/records/idea.md", self.record("idea-a", "idea", "saved", "Independent idea"))
        before = {str(p): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        result = run(self.root, "review", "demo")
        flags = {r["id"]: r["flags"] for r in result["candidates"]}
        self.assertEqual(result["counts"]["unverified"], 1)
        self.assertEqual(flags["task-a"], ["unverified", "unlinked_work"])
        self.assertNotIn("idea-a", flags)
        self.assertIn("O2", result["observation_tasks"][0]["text"])
        self.assertNotIn("Next check", result["observation_tasks"][0]["text"])
        self.assertEqual(before, {str(p): p.read_bytes() for p in self.root.rglob("*") if p.is_file()})

    def test_incoming_canonical_relation_counts_as_connected(self):
        self.write("workspace/demo/records/plan.md", self.record("plan-a", "plan", "superseded", "Retain reason", "links:\n  - relation: implements\n    target: task-a\n"))
        result = run(self.root, "review", "demo")
        flags = {r["id"]: r["flags"] for r in result["candidates"]}
        self.assertNotIn("task-a", flags)
        self.assertEqual(flags["plan-a"], ["superseded"])
        self.assertEqual(result["counts"]["superseded"], 1)

    def test_all_projects_requires_explicit_export_flag(self):
        self.write("workspace/private/project.md", "---\nid: private\ntitle: Private project\n---\n")
        self.write("workspace/private/tasks/secret.md", self.record("secret", "task", "active", "Private body marker"))
        with tempfile.TemporaryDirectory() as out:
            first = Path(out) / "selected.html"
            self.assertEqual(self.export(first)[0], 0)
            self.assertNotIn("Private body marker", first.read_text())
            second = Path(out) / "all.html"
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(main(["--root", str(self.root), "view", "demo", "--all-projects", "--output", str(second)]), 0)
            data = json.loads(re.search(r'<script id="workspace-data" type="application/json">(.*?)</script>', second.read_text(), re.S)[1])
            self.assertEqual(len(data["projects"]), 2)
            self.assertIn("Private body marker", second.read_text())
            self.assertEqual(data["reviews"]["demo"], run(self.root, "review", "demo"))
            self.assertEqual(next(r for r in data["records"] if r["id"] == "secret")["project_selector"], "private")

if __name__ == "__main__":
    unittest.main()

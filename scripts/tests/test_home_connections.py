"""Exercise portable setup, reader wiring and safe Git startup with temporary checkouts."""
from contextlib import redirect_stdout
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace

SCRIPTS = Path(__file__).resolve().parents[2] / "plugins/shape/skills/status/scripts"
sys.path.insert(0, str(SCRIPTS))
import home_connections as connections
import workspace_records


class HomeConnectionTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.config = self.base / "machine-one.json"
        self.env = patch.dict(os.environ, {"WORKSPACE_CONFIG": str(self.config)})
        self.env.start()
        self.home = self.repo("home")
        (self.home / "workspace").mkdir()
        self.app = self.repo("app")
        self.git(self.app, "remote", "add", "origin", "git@github.com:example/app.git")
        self.private = self.repo("private")
        self.git(self.private, "remote", "add", "origin", "https://github.com/example/private.git")
        self.git(self.private, "remote", "add", "public", "https://github.com/example/app.git")
        self.command("init", "personal", str(self.home))

    def tearDown(self):
        self.env.stop()
        self.temp.cleanup()

    def git(self, repo, *args):
        return subprocess.run(["git", "-C", str(repo), *args], check=True, capture_output=True, text=True).stdout.strip()

    def repo(self, name):
        path = self.base / name
        path.mkdir()
        self.git(path, "init", "-qb", "main")
        self.git(path, "config", "user.name", "Test")
        self.git(path, "config", "user.email", "test@example.invalid")
        (path / "file").write_text("base")
        self.git(path, "add", "file")
        self.git(path, "commit", "-qm", "base")
        return path

    def command(self, *args, ok=True):
        output = io.StringIO()
        with redirect_stdout(output):
            code = workspace_records.main(["connection", *args])
        result = json.loads(output.getvalue())
        self.assertEqual(code, 0 if ok else 1, result)
        return result

    def connect(self, alias="app", path=None):
        return self.command("connect", "demo", alias, str(path or self.app), "--title", "Demo")

    def test_repeat_preserves_uuid_and_all_bytes_and_product_is_untouched(self):
        before = self.git(self.app, "status", "--porcelain")
        first = self.connect()
        files = [self.config, self.home / ".workspace-home.json", self.home / "workspace/demo/project.md"]
        snapshots = {p: (p.read_bytes(), p.stat().st_mtime_ns) for p in files}
        self.command("init", "personal", str(self.home))
        self.assertEqual(self.connect(), first)
        self.assertEqual(snapshots, {p: (p.read_bytes(), p.stat().st_mtime_ns) for p in files})
        self.assertEqual(before, self.git(self.app, "status", "--porcelain"))
        self.assertNotIn(str(self.app), files[-1].read_text())

    def test_two_repositories_one_uuid_and_reader_actual_paths(self):
        first = self.connect()
        second = self.connect("private", self.private)
        self.assertEqual(first["project_uuid"], second["project_uuid"])
        result = workspace_records.run(self.home, "status", "demo")
        self.assertEqual({str(self.app), str(self.private)}, {r["path"] for r in result["git"]})
        self.command("doctor", str(self.private))

    def test_second_machine_reuses_home_and_project_identity(self):
        first = self.connect()
        moved = self.base / "second-home"
        subprocess.run(["cp", "-a", str(self.home), str(moved)], check=True)
        app = self.repo("second-app")
        self.git(app, "remote", "add", "origin", "https://github.com/example/app")
        config = self.base / "machine-two.json"
        with patch.dict(os.environ, {"WORKSPACE_CONFIG": str(config)}):
            self.command("init", "mine", str(moved))
            self.command("resolve", str(app), ok=False)
            bound = self.command("bind", "demo", "app", str(app))
            self.assertEqual(bound["project_uuid"], first["project_uuid"])
            self.assertEqual(bound["home_uuid"], first["home_uuid"])
            result = workspace_records.run(moved, "status", "demo")
            self.assertEqual(result["git"][0]["path"], str(app))

    def test_wrong_private_checkout_cannot_bind_as_public_even_with_public_remote(self):
        self.connect()
        other = self.base / "other-config.json"
        with patch.dict(os.environ, {"WORKSPACE_CONFIG": str(other)}):
            self.command("init", "personal", str(self.home))
            before = other.read_bytes()
            self.command("bind", "demo", "app", str(self.private), ok=False)
            self.assertEqual(before, other.read_bytes())

    def test_existing_frontmatter_identity_body_priorities_and_dates_survive(self):
        file = self.home / "workspace/demo/project.md"
        file.parent.mkdir()
        original = "---\nid: preserved-id\ntitle: Existing\nupdated: 2001-01-01\nrepositories:\n  app: ../app\npriorities: []\n---\n\nExact body.\n"
        file.write_text(original)
        self.connect()
        content = file.read_text()
        for expected in ("id: preserved-id", "updated: 2001-01-01", "priorities: []", "---\n\nExact body.\n"):
            self.assertIn(expected, content)
        self.assertEqual(workspace_records.run(self.home, "check", "demo")["status"], "ok")

    def test_invalid_home_and_duplicate_uuid_fail_without_fallback(self):
        self.connect()
        file = self.home / "workspace/collision/project.md"
        file.parent.mkdir()
        file.write_bytes((self.home / "workspace/demo/project.md").read_bytes())
        self.command("resolve", str(self.app), ok=False)
        file.unlink()
        (self.home / ".workspace-home.json").write_text('{}')
        self.command("resolve", str(self.app), ok=False)

    def test_remote_collision_under_new_slug_is_rejected(self):
        self.connect()
        self.command("connect", "another", "app", str(self.app), "--title", "Another", ok=False)
        self.assertFalse((self.home / "workspace/another").exists())

    def test_missing_binding_reports_unavailable_and_legacy_stays_readable(self):
        self.connect()
        config = json.loads(self.config.read_text())
        config["bindings"] = []
        connections.write_json(self.config, config)
        result = workspace_records.run(self.home, "status", "demo")
        self.assertIn("binding", result["git"][0]["error"])

    def test_worktree_resolves_without_another_registration(self):
        first = self.connect()
        worktree = self.base / "worktree"
        self.git(self.app, "worktree", "add", "-qb", "feat/test", str(worktree))
        found = self.command("resolve", str(worktree))
        self.assertEqual(found["project_uuid"], first["project_uuid"])
        self.assertEqual(found["checkout"], str(worktree))

    def test_git_sync_fast_forward_dirty_and_divergence(self):
        source = self.repo("source")
        remote = self.base / "remote.git"
        subprocess.run(["git", "clone", "--bare", str(source), str(remote)], check=True, capture_output=True)
        target = self.base / "target"
        subprocess.run(["git", "clone", str(remote), str(target)], check=True, capture_output=True)
        self.git(source, "remote", "add", "origin", str(remote))
        self.git(source, "config", "branch.main.remote", "origin")
        self.git(source, "config", "branch.main.merge", "refs/heads/main")
        (source / "file").write_text("next")
        self.git(source, "commit", "-am", "next")
        self.git(source, "push", "origin", "main")
        (target / "untracked").write_text("keep")
        head = self.git(target, "rev-parse", "HEAD")
        self.assertEqual(connections.git_snapshot(target, pull=True)["state"], "blocked-dirty")
        self.assertEqual(head, self.git(target, "rev-parse", "HEAD"))
        (target / "untracked").unlink()
        self.assertEqual(connections.git_snapshot(target, pull=True)["state"], "fast-forwarded")
        self.git(target, "config", "user.name", "Test")
        self.git(target, "config", "user.email", "test@example.invalid")
        (target / "local").write_text("local")
        self.git(target, "add", "local")
        self.git(target, "commit", "-qm", "local")
        (source / "file").write_text("different")
        self.git(source, "commit", "-am", "different")
        self.git(source, "push", "origin", "main")
        head = self.git(target, "rev-parse", "HEAD")
        self.assertEqual(connections.git_snapshot(target, pull=True)["state"], "diverged")
        self.assertEqual(head, self.git(target, "rev-parse", "HEAD"))

    def test_unavailable_github_is_not_success(self):
        with patch.object(connections.subprocess, "run", side_effect=FileNotFoundError("gh unavailable")):
            result = connections.github_snapshot(self.app, "https://github.com/example/app")
        self.assertEqual(result["state"], "unavailable")

    def test_alias_default_and_unrelated_local_fields_are_preserved(self):
        config = connections.read_config()
        config["owner_setting"] = {"keep": True}
        connections.write_json(self.config, config)
        other = self.repo("other-home")
        (other / "workspace").mkdir()
        self.command("init", "work", str(other))
        data = connections.read_config()
        self.assertEqual(data["default_home"], "personal")
        self.assertEqual(data["owner_setting"], {"keep": True})

    def test_start_syncs_before_read_and_blocked_home_stops_code_checks(self):
        self.connect()
        with patch.object(connections, "git_snapshot", return_value={"state": "diverged"}) as snapshot:
            self.command("start", str(self.app), ok=False)
            self.assertEqual(snapshot.call_count, 1)
            snapshot.assert_called_once_with(self.home, pull=True)
        with patch.object(connections, "git_snapshot", side_effect=[{"state": "checked"}, {"state": "checked"}]) as snapshot, patch.object(connections, "github_snapshot", return_value={"state": "checked", "runs": []}):
            result = self.command("start", str(self.app))
            self.assertEqual(snapshot.call_count, 2)
            self.assertEqual(result["records"]["project"]["id"], "demo")
            self.assertEqual(result["github"]["runs"], [])

    def test_github_reports_old_success_and_latest_failure_separately(self):
        calls = []
        def run(command, **kwargs):
            calls.append(command)
            if command[1:3] == ["run", "list"]:
                sha = command[command.index("--commit") + 1]
                value = [{"headSha": sha, "status": "completed", "conclusion": "success" if sha == "old" else "failure"}]
            elif command[1:3] == ["pr", "list"]:
                value = []
            elif "/commits/" in command[2]:
                value = {"sha": "new"}
            else:
                value = {"default_branch": "main"}
            return SimpleNamespace(returncode=0, stdout=json.dumps(value), stderr="")
        with patch.object(connections, "git", return_value="old"), patch.object(connections.subprocess, "run", side_effect=run):
            result = connections.github_snapshot(self.app, "https://github.com/example/app")
        self.assertEqual(result["runs"][0]["conclusion"], "success")
        self.assertEqual(result["default_runs"][0]["conclusion"], "failure")
        self.assertEqual(result["default_revision"], "new")


if __name__ == "__main__":
    unittest.main()

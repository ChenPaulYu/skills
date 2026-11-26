#!/usr/bin/env python3
"""Markdown project record reader and portable connection CLI.

Reads ``workspace/<project>/project.md`` and typed work folders using YAML
frontmatter; task bodies include implementation planning. Legacy typed plans and
flat ``records/*.md`` remain readable without normalization. Every root is explicit.
Record queries keep source records and Git read-only; explicit view export writes
a new HTML outside Home. The connection subcommand delegates setup/local bindings
and explicitly requested Git startup synchronization to the sibling connection owner.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import uuid
from pathlib import Path
from typing import Any

import yaml


STATUSES = {
    "idea": {"saved", "exploring", "closed"},
    "thought": {"draft", "adopted", "shelved", "superseded"},
    "mockup": {"draft", "selected", "shelved", "superseded"},
    "probe": {"planned", "active", "concluded"},
    "task": {"planned", "active", "paused", "blocked", "done", "cancelled"},
    "plan": {"draft", "active", "completed", "superseded"},
}
ACTIVE = {"task": {"active", "paused", "blocked"}, "plan": {"active"}}
RETIRED_TYPES = {"plan": "plan records are retired; ask the user before folding live content into its task"}


class WorkspaceError(Exception):
    """A requested workspace or project cannot be read."""

    def __init__(self, message: str, read_tier: str = "non-standard readable records"):
        super().__init__(message)
        self.read_tier = read_tier


def _frontmatter(path: Path) -> tuple[dict[str, Any], str, str | None]:
    try:
        raw = path.read_bytes()
    except OSError as exc:
        return {}, "", f"cannot read file: {exc}"
    encoding_error = None
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as exc:
        text = raw.decode("utf-8", errors="replace")
        encoding_error = f"invalid UTF-8: {exc}"
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        error = "missing YAML frontmatter opening delimiter"
        return {}, text, f"{encoding_error}; {error}" if encoding_error else error
    end = next((i for i, line in enumerate(lines[1:], 1) if line.strip() == "---"), None)
    if end is None:
        error = "missing YAML frontmatter closing delimiter"
        return {}, text, f"{encoding_error}; {error}" if encoding_error else error
    try:
        data = yaml.safe_load("".join(lines[1:end]))
    except yaml.YAMLError as exc:
        error = f"malformed YAML: {exc}"
        return {}, "".join(lines[end + 1:]).lstrip("\n"), f"{encoding_error}; {error}" if encoding_error else error
    if not isinstance(data, dict):
        error = "frontmatter must be a YAML mapping"
        return {}, "".join(lines[end + 1:]).lstrip("\n"), f"{encoding_error}; {error}" if encoding_error else error
    return data, "".join(lines[end + 1:]).lstrip("\n"), encoding_error


def _diag(code: str, path: Path, message: str, scope: str | None = None) -> dict[str, str]:
    result = {"code": code, "path": path.as_posix(), "message": message}
    if scope is not None:
        result["_scope"] = scope
    return result


def _safe_value(value: Any) -> Any:
    """Convert YAML scalar and container values into stable JSON values."""
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, dict):
        return {str(key): _safe_value(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_safe_value(item) for item in value]
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return str(value)


def _public_diagnostics(items: list[dict[str, Any]]) -> list[dict[str, str]]:
    return [{key: value for key, value in item.items() if key != "_scope"} for item in items]


def _read_tier(projects: list[dict[str, Any]], records: list[dict[str, Any]], diagnostics: list[dict[str, Any]], scope: str | None = None) -> str:
    if not projects:
        return "absent"
    selected_projects = [p for p in projects if scope is None or p["_dir"].name == scope or p["id"] == scope]
    selected_diagnostics = [d for d in diagnostics if scope is None or d.get("_scope") == scope]
    if any(d.get("code") == "missing-workspace" for d in selected_diagnostics):
        return "absent"
    if selected_diagnostics:
        return "non-standard readable records"
    if selected_projects:
        return "standard records"
    return "absent"


def _record_paths(project_dir: Path) -> list[tuple[Path, str | None]]:
    """Find cards, leaving mockup/probe supporting files out of the record graph."""
    paths = [(path, None) for path in (project_dir / "records").glob("*.md")]
    for kind in STATUSES:
        directory = project_dir / f"{kind}s"
        if kind in {"mockup", "probe"}:
            paths.extend((path, kind) for path in directory.glob(f"*/{kind}.md"))
        else:
            paths.extend((path, kind) for path in directory.glob("*.md"))
    return sorted(paths, key=lambda item: item[0].as_posix())


def _load(root: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    root = root.resolve()
    base = root / "workspace"
    projects: list[dict[str, Any]] = []
    records: list[dict[str, Any]] = []
    diagnostics: list[dict[str, str]] = []
    if not base.is_dir():
        return projects, records, [_diag("missing-workspace", Path("workspace"), "workspace directory is absent")]
    for project_path in sorted(base.glob("*/project.md")):
        metadata, body, error = _frontmatter(project_path)
        rel = project_path.relative_to(root)
        scope = project_path.parent.name
        if error:
            diagnostics.append(_diag("project-frontmatter", rel, error, scope))
        if "uuid" in metadata:
            try:
                identifier = str(uuid.UUID(metadata["uuid"]))
                if any(str(p["metadata"].get("uuid", "")).lower() == identifier for p in projects):
                    diagnostics.append(_diag("duplicate-project-uuid", rel, "project UUID must be unique in Home", scope))
            except (ValueError, TypeError, AttributeError):
                diagnostics.append(_diag("invalid-project-uuid", rel, "project uuid must be a UUID string", scope))
        project_id = metadata.get("id")
        if not isinstance(project_id, str) or not project_id.strip():
            diagnostics.append(_diag("missing-project-id", rel, "project id must be a nonempty string", scope))
        title = metadata.get("title")
        if not isinstance(title, str) or not title.strip():
            diagnostics.append(_diag("missing-project-title", rel, "project title must be a nonempty string", scope))
        repositories = metadata.get("repositories", {})
        if repositories is None:
            repositories = {}
        from home_connections import valid_repository
        if not isinstance(repositories, dict) or any(not isinstance(k, str) or not valid_repository(v) for k, v in repositories.items()):
            diagnostics.append(_diag("invalid-repositories", rel, "repositories must map aliases to legacy paths, remote objects or local UUID/anchor objects", scope))
            repositories = {}
        priorities = metadata.get("priorities", [])
        if priorities is None:
            priorities = []
        if not isinstance(priorities, list) or any(not isinstance(v, str) for v in priorities):
            diagnostics.append(_diag("invalid-priorities", rel, "priorities must be a list of record IDs", scope))
            priorities = []
        project = {"id": _safe_value(project_id), "title": _safe_value(title), "path": rel.as_posix(),
                   "repositories": repositories, "priorities": priorities, "body": body,
                   "metadata": _safe_value(metadata), "_dir": project_path.parent, "_scope": scope}
        projects.append(project)
        for record_path, expected_kind in _record_paths(project_path.parent):
            item, record_body, record_error = _frontmatter(record_path)
            rrel = record_path.relative_to(root)
            if record_error:
                diagnostics.append(_diag("record-frontmatter", rrel, record_error, scope))
            identifier = item.get("id")
            kind = item.get("type")
            status = item.get("status")
            if expected_kind and isinstance(kind, str) and kind != expected_kind:
                diagnostics.append(_diag("folder-type-mismatch", rrel,
                                         f"{expected_kind}s folder contains a {kind!r} record", scope))
            if not isinstance(identifier, str) or not identifier.strip():
                diagnostics.append(_diag("missing-record-id", rrel, "record id must be a nonempty string", scope))
            if not isinstance(kind, str) or kind not in STATUSES:
                diagnostics.append(_diag("unknown-type", rrel, f"unknown record type: {kind!r}", scope))
            if not isinstance(status, str):
                diagnostics.append(_diag("unknown-status", rrel, f"status must be a string, got {status!r}", scope))
            elif isinstance(kind, str) and kind in STATUSES and status not in STATUSES[kind] and status != "unverified":
                diagnostics.append(_diag("unknown-status", rrel, f"status {status!r} is not allowed for {kind}", scope))
            record_title = item.get("title")
            if not isinstance(record_title, str) or not record_title.strip():
                diagnostics.append(_diag("missing-record-title", rrel, "record title must be a nonempty string", scope))
            links = item.get("links", [])
            if links is None:
                links = []
            if not isinstance(links, list):
                diagnostics.append(_diag("invalid-links", rrel, "links must be a list", scope))
                links = []
            normalized_links = []
            for link in links:
                if not isinstance(link, dict) or not isinstance(link.get("relation"), str) or not link["relation"].strip() or not isinstance(link.get("target"), str) or not link["target"].strip():
                    diagnostics.append(_diag("invalid-link", rrel, "each link needs nonempty string relation and target", scope))
                    continue
                normalized_links.append({"relation": link["relation"], "target": link["target"]})
            repo = item.get("repo")
            if repo is not None and (not isinstance(repo, str) or repo not in repositories):
                diagnostics.append(_diag("unknown-repo", rrel, f"repo alias {repo!r} is not mapped by this project", scope))
            records.append({"id": _safe_value(identifier), "type": _safe_value(kind), "title": _safe_value(record_title), "status": _safe_value(status),
                            "links": normalized_links, "repo": _safe_value(repo), "body": record_body,
                            "metadata": _safe_value(item), "project": project_id, "path": rrel.as_posix(),
                            "_project_dir": scope})
    project_ids: dict[str, str] = {}
    for project in projects:
        identifier = project["id"]
        if not isinstance(identifier, str) or not identifier.strip():
            continue
        if identifier in project_ids:
            diagnostics.append(_diag("duplicate-project-id", Path(project["path"]), f"project id {identifier!r} is also used at {project_ids[identifier]}", project["_scope"]))
        else:
            project_ids[identifier] = project["path"]
    for project in projects:
        mine = [record for record in records if record["_project_dir"] == project["_scope"]]
        id_paths: dict[str, str] = {}
        project_id = project["id"]
        all_items = ([project] if isinstance(project_id, str) and project_id.strip() else []) + mine
        for item in all_items:
            identifier = item["id"]
            if not isinstance(identifier, str) or not identifier.strip():
                continue
            if identifier in id_paths:
                diagnostics.append(_diag("duplicate-id", Path(item["path"]), f"duplicate id {identifier!r}; first seen at {id_paths[identifier]}", project["_scope"]))
            else:
                id_paths[identifier] = item["path"]
        record_ids = {record["id"] for record in mine if isinstance(record["id"], str)}
        for priority in project["priorities"]:
            if priority not in record_ids:
                diagnostics.append(_diag("dangling-priority", Path(project["path"]), f"priority record {priority!r} does not exist in this project", project["_scope"]))
        for record in mine:
            for link in record["links"]:
                if link["target"] not in record_ids:
                    diagnostics.append(_diag("dangling-link", Path(record["path"]), f"target {link['target']!r} does not exist in this project", project["_scope"]))
    return projects, records, diagnostics


def _project(projects: list[dict[str, Any]], project_id: str) -> dict[str, Any]:
    found = [p for p in projects if p["id"] == project_id or p["_scope"] == project_id]
    if not found:
        raise WorkspaceError(f"project {project_id!r} not found", "absent")
    if len(found) > 1:
        raise WorkspaceError(f"project id {project_id!r} is duplicated")
    return found[0]


def _git_context(root: Path, project: dict[str, Any]) -> list[dict[str, Any]]:
    result = []
    for alias, value in sorted(project["repositories"].items()):
        from home_connections import repository_path
        try:
            path = repository_path(root, project["metadata"], alias, value)
        except (OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as exc:
            result.append({"alias": alias, "error": str(exc)})
            continue
        if not path.is_dir():
            result.append({"alias": alias, "path": str(path), "error": f"mapped repository does not exist: {path}"})
            continue
        def git(*args: str) -> str:
            proc = subprocess.run(["git", "-C", str(path), *args], capture_output=True, text=True,
                                  check=False, env={**os.environ, "GIT_OPTIONAL_LOCKS": "0"})
            if proc.returncode:
                raise RuntimeError(proc.stderr.strip() or f"git {' '.join(args)} failed")
            return proc.stdout.rstrip("\n")
        try:
            result.append({"alias": alias, "path": str(path), "branch": git("branch", "--show-current"),
                           "head": git("rev-parse", "HEAD"), "status_porcelain": git("status", "--porcelain", "--untracked-files=all").splitlines()})
        except RuntimeError as exc:
            result.append({"alias": alias, "path": str(path), "error": f"Git context unavailable: {exc}"})
    return result


def _graph(project_id: str, records: list[dict[str, Any]]) -> dict[str, Any]:
    selected = [r for r in records if r["project"] == project_id]
    nodes = [{key: r[key] for key in ("id", "type", "title", "status", "path")} for r in selected]
    edges = [{"source": r["id"], "relation": link["relation"], "target": link["target"]}
             for r in selected for link in r["links"]]
    return {"project": project_id, "nodes": nodes, "edges": edges}


def _public_record(record: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in record.items() if not key.startswith("_")}


def _review(project: dict[str, Any], records: list[dict[str, Any]]) -> dict[str, Any]:
    """Advisory work-quality facts shared by agents and the human view, never deletion verdicts."""
    connected = {link["target"] for r in records for link in r["links"]}
    connected.update(r["id"] for r in records if r["links"] and isinstance(r["id"], str))
    counts = {"unverified": 0, "unlinked_work": 0, "superseded": 0}
    candidates, observations = [], []
    for record in records:
        flags = []
        if record["status"] == "unverified":
            flags.append("unverified")
        if record["type"] in ("task", "plan", "mockup", "probe") and (not isinstance(record["id"], str) or record["id"] not in connected):
            flags.append("unlinked_work")
        if record["status"] == "superseded":
            flags.append("superseded")
        for flag in flags:
            counts[flag] += 1
        if flags:
            candidates.append({key: record[key] for key in ("id", "title", "type", "status", "path")} | {"flags": flags})
        if record["type"] == "task":
            match = re.search(r"^##\s+(?:Observations|觀察)[^\n]*\n(.*?)(?=^##\s|\Z)", record["body"], re.M | re.S | re.I)
            if match:
                observations.append({"id": record["id"], "path": record["path"], "text": match.group(1).strip()})
    return {"project": project["id"], "counts": counts, "candidates": candidates, "observation_tasks": observations,
            "advisory": "These are review signals, not completion, deletion or automatic parent-creation verdicts."}


def run(root: Path, command: str, project_id: str | None = None, record_id: str | None = None) -> dict[str, Any]:
    projects, records, diagnostics = _load(root)
    def scoped_diagnostics(scope: str | None = None) -> list[dict[str, str]]:
        return _public_diagnostics([d for d in diagnostics if scope is None or d.get("_scope") == scope])
    if command == "projects":
        return {"projects": [{key: p[key] for key in ("id", "title", "path")} for p in projects], "diagnostics": scoped_diagnostics(), "read_tier": _read_tier(projects, records, diagnostics)}
    if command == "check":
        if project_id:
            matches = [p for p in projects if p["id"] == project_id or p["_scope"] == project_id]
            if not matches:
                missing = _diag("missing-project", Path("workspace") / project_id, f"project {project_id!r} not found")
                selected_diagnostics = [missing]
                tier = "absent"
            elif len(matches) > 1:
                selected_diagnostics = scoped_diagnostics()
                selected_diagnostics.append(_diag("duplicate-project-id", Path("workspace"), f"project selector {project_id!r} is ambiguous"))
                tier = "non-standard readable records"
            else:
                scope = matches[0]["_scope"]
                selected_diagnostics = scoped_diagnostics(scope)
                tier = _read_tier(projects, records, diagnostics, scope)
        else:
            selected_diagnostics = scoped_diagnostics()
            tier = _read_tier(projects, records, diagnostics)
        result = {"status": "ok" if not selected_diagnostics else "error", "diagnostics": selected_diagnostics, "read_tier": tier}
        in_scope = [r for r in records if not project_id or r["_project_dir"] in {p["_scope"] for p in projects if p["id"] == project_id or p["_scope"] == project_id}]
        migrations = [{"path": r["path"], "message": RETIRED_TYPES[r["type"]]} for r in in_scope if r.get("type") in RETIRED_TYPES]
        if migrations:
            result["migrations"] = migrations
        return result
    assert project_id is not None
    project = _project(projects, project_id)
    scope = project["_scope"]
    mine = [r for r in records if r["_project_dir"] == scope]
    tier = _read_tier(projects, records, diagnostics, scope)
    if command == "review":
        return _review(project, mine) | {"diagnostics": scoped_diagnostics(scope), "read_tier": tier}
    if command == "show":
        matches = [r for r in mine if r["id"] == record_id]
        if not matches:
            raise WorkspaceError(f"record {record_id!r} not found in project {project_id!r}", tier)
        if len(matches) > 1:
            raise WorkspaceError(f"record id {record_id!r} is duplicated in project {project_id!r}")
        return {"record": _public_record(matches[0]), "backlinks": [{"source": r["id"], "relation": l["relation"]} for r in mine for l in r["links"] if l["target"] == record_id], "diagnostics": scoped_diagnostics(scope), "read_tier": tier}
    if command == "graph":
        graph = _graph(project["id"], mine)
        node_ids = {n["id"] for n in graph["nodes"] if isinstance(n["id"], str)}
        graph["backlinks"] = [{"source": r["id"], "relation": l["relation"], "target": l["target"]} for r in mine for l in r["links"] if l["target"] in node_ids]
        graph["diagnostics"] = scoped_diagnostics(scope)
        graph["read_tier"] = tier
        return graph
    if command == "status":
        active = [r for r in mine if isinstance(r["type"], str) and r["type"] in ACTIVE and isinstance(r["status"], str) and r["status"] in ACTIVE[r["type"]]]
        priorities = [next(r for r in mine if r["id"] == identifier) for identifier in project["priorities"] if any(r["id"] == identifier for r in mine)]
        git_context = _git_context(Path(root).resolve(), project)
        git_diagnostics = []
        if not git_context:
            git_diagnostics.append(_diag("git-unmapped", Path(project["path"]), "project has no repository mappings", scope))
        for item in git_context:
            if "error" in item:
                git_diagnostics.append(_diag("git-unavailable", Path(project["path"]), f"{item['alias']}: {item['error']}", scope))
        return {"project": {key: project[key] for key in ("id", "title", "path", "repositories", "priorities", "body")},
                "tasks": [{key: r[key] for key in ("id", "title", "status", "path")} for r in mine if r["type"] == "task"],
                "active_records": [_public_record(r) for r in active], "priorities": [_public_record(r) for r in priorities],
                "git": git_context, "diagnostics": scoped_diagnostics(scope) + _public_diagnostics(git_diagnostics), "read_tier": tier}
    raise WorkspaceError(f"unknown command {command!r}")


def _view_project(project):
    """Export navigation and source dates without exposing other project metadata."""
    return ({key: project[key] for key in ("id", "title", "priorities")}
            | {"selector": project["_scope"],
               "metadata": {key: project["metadata"].get(key) for key in ("created", "updated")}})


def main(argv: list[str] | None = None) -> int:
    arguments = list(sys.argv[1:] if argv is None else argv)
    if arguments and arguments[0] == "connection":
        from home_connections import main as connection_main
        return connection_main(arguments[1:])
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path, help="Home repository root containing workspace/")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("connection", help="Home setup, local binding, diagnosis and development startup; use connection --help")
    sub.add_parser("projects")
    check = sub.add_parser("check")
    check.add_argument("project", nargs="?")
    for name in ("status", "graph", "review"):
        cmd = sub.add_parser(name)
        cmd.add_argument("project")
    view = sub.add_parser("view")
    view.add_argument("project")
    view.add_argument("--output", required=True, type=Path)
    view.add_argument("--all-projects", action="store_true", help="Explicitly include other projects in this offline snapshot")
    cmd = sub.add_parser("show")
    cmd.add_argument("project")
    cmd.add_argument("id")
    args = parser.parse_args(arguments)
    try:
        if args.command == "view":
            import importlib.util
            view_path = Path(__file__).with_name("workspace_view.py")
            spec = importlib.util.spec_from_file_location("_workspace_view", view_path)
            module = importlib.util.module_from_spec(spec)
            exec(compile(view_path.read_text(encoding="utf-8"), str(view_path), "exec"), module.__dict__)
            export_view = module.export_view
            projects, records, diagnostics = _load(args.root)
            project = _project(projects, args.project)
            graph = run(args.root, "graph", args.project)
            included = projects if args.all_projects else [project]
            scopes = {p["_scope"] for p in included}
            selected = [_public_record(r) | {"project_selector": r["_project_dir"]} for r in records if r["_project_dir"] in scopes]
            project_data = [_view_project(p) for p in included]
            graphs = {p["_scope"]: run(args.root, "graph", p["_scope"]) for p in included}
            reviews = {p["_scope"]: run(args.root, "review", p["_scope"]) for p in included}
            payload = export_view(args.root, _view_project(project), graph, selected, args.output,
                                  projects=project_data, graphs=graphs, reviews=reviews)
        else:
            payload = run(args.root, args.command, getattr(args, "project", None), getattr(args, "id", None))
    except (WorkspaceError, OSError, ValueError) as exc:
        print(json.dumps({"error": str(exc), "read_tier": getattr(exc, "read_tier", "absent")}, ensure_ascii=False))
        return 1
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 1 if args.command == "check" and payload["status"] != "ok" else 0


if __name__ == "__main__":
    raise SystemExit(main())

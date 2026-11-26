"""Portable Home identity, local checkout bindings and explicit development startup.

Reads: generic per-machine JSON configuration, committed Home/project metadata,
Git and (at startup only) GitHub through gh. Record parsing remains in workspace_records.
Setup writes only Home metadata and local config; product repositories need no pointer.
"""
from __future__ import annotations

import argparse
from datetime import date
from functools import lru_cache
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import uuid

import yaml


class ConnectionError(ValueError):
    pass


@lru_cache(maxsize=1)
def record_reader():
    """Load our sibling owner even through a compatibility module with the same name."""
    path = Path(__file__).with_name("workspace_records.py")
    spec = importlib.util.spec_from_file_location("_connection_record_reader", path)
    module = importlib.util.module_from_spec(spec)
    exec(compile(path.read_text(), str(path), "exec"), module.__dict__)
    return module


def config_path() -> Path:
    return Path(os.environ.get("WORKSPACE_CONFIG", "~/.config/agent-workspace/config.json")).expanduser()


def read_config(path: Path | None = None) -> dict:
    path = path or config_path()
    if not path.exists():
        return {"schema_version": 1, "homes": {}, "bindings": []}
    data = json.loads(path.read_text())
    if not isinstance(data, dict) or data.get("schema_version") != 1:
        raise ConnectionError(f"unsupported config: {path}")
    if not isinstance(data.get("homes"), dict) or not isinstance(data.get("bindings"), list):
        raise ConnectionError(f"invalid homes/bindings in {path}")
    if "machine_uuid" in data:
        valid_uuid(data["machine_uuid"])
    for item in data["homes"].values():
        if not isinstance(item, dict) or not isinstance(item.get("path"), str):
            raise ConnectionError(f"invalid Home entry in {path}")
        valid_uuid(item.get("uuid"))
    for item in data["bindings"]:
        if not isinstance(item, dict) or any(not isinstance(item.get(key), str) for key in ("home_uuid", "project_uuid", "repo", "path")):
            raise ConnectionError(f"invalid checkout binding in {path}")
        valid_uuid(item["home_uuid"])
        valid_uuid(item["project_uuid"])
    return data


def write_json(path: Path, data: dict) -> None:
    content = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    if path.exists() and path.read_text() == content:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", dir=path.parent, delete=False) as output:
        temporary = Path(output.name)
        output.write(content)
    try:
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)


def git(path: Path, *args: str) -> str:
    result = subprocess.run(["git", "-C", str(path), *args], capture_output=True, text=True,
                            timeout=45, env={**os.environ, "GIT_OPTIONAL_LOCKS": "0"})
    if result.returncode:
        raise ConnectionError(result.stderr.strip() or f"git {' '.join(args)} failed")
    return result.stdout.strip()


def checkout(path: Path) -> Path:
    path = path.expanduser().resolve()
    if Path(git(path, "rev-parse", "--show-toplevel")).resolve() != path:
        raise ConnectionError(f"expected a Git checkout root: {path}")
    return path


def identity(value: str) -> str:
    """Canonicalize hosted SSH/HTTPS remotes; reject credentials and local locators."""
    match = re.fullmatch(r"(?:https://|ssh://git@|git@)([A-Za-z0-9.-]+)[:/]([^?#\s]+)", value)
    if not match:
        raise ConnectionError("use a credential-free HTTPS or git@ hosted repository remote")
    host, name = match.groups()
    if "@" in name or ":" in name or ".." in name.split("/"):
        raise ConnectionError("invalid repository remote")
    return f"https://{host.lower()}/{name.removesuffix('.git').rstrip('/')}"


def valid_uuid(value: str) -> str:
    try:
        return str(uuid.UUID(value))
    except (ValueError, TypeError, AttributeError) as exc:
        raise ConnectionError(f"invalid UUID: {value}") from exc


def valid_repository(value) -> bool:
    """One schema owner for legacy, hosted and explicit local-only repositories."""
    if isinstance(value, str):
        return True
    if not isinstance(value, dict):
        return False
    try:
        if set(value) == {"remote"}:
            identity(value["remote"])
            return True
        if set(value) == {"local_uuid", "anchor"}:
            valid_uuid(value["local_uuid"])
            return isinstance(value["anchor"], str) and re.fullmatch(r"[0-9a-f]{40}|[0-9a-f]{64}", value["anchor"]) is not None
    except (ValueError, TypeError):
        pass
    return False


def same_repository(first: dict, second: dict) -> bool:
    if "remote" in first and "remote" in second:
        return identity(first["remote"]) == identity(second["remote"])
    return first == second


def home_marker(root: Path) -> dict:
    data = json.loads((root / ".workspace-home.json").read_text())
    if not isinstance(data, dict) or data.get("schema_version") != 1 or data.get("layout") != "workspace-v1":
        raise ConnectionError(f"unsupported Home layout: {root}")
    valid_uuid(data.get("uuid"))
    if not (root / "workspace").is_dir():
        raise ConnectionError(f"workspace directory is unavailable: {root}")
    return data


def selected_home(config: dict, alias: str | None) -> tuple[Path, dict]:
    alias = alias or config.get("default_home")
    item = config["homes"].get(alias)
    if not item:
        raise ConnectionError(f"Home is not configured: {alias!r}; run connection init")
    root = Path(item["path"]).expanduser().resolve()
    marker = home_marker(root)
    if marker["uuid"] != item["uuid"]:
        raise ConnectionError(f"Home UUID mismatch: {root}")
    return root, marker


def project_file(root: Path, slug: str) -> Path:
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", slug):
        raise ConnectionError("project selector must be a lowercase slug")
    return root / "workspace" / slug / "project.md"


def projects(root: Path) -> list[tuple[Path, dict]]:
    _frontmatter = record_reader()._frontmatter
    result = []
    seen = set()
    for path in sorted((root / "workspace").glob("*/project.md")):
        data, _, error = _frontmatter(path)
        if error:
            raise ConnectionError(f"{path}: {error}")
        repositories = data.get("repositories") or {}
        if not isinstance(repositories, dict) or any(not isinstance(key, str) or not valid_repository(value) for key, value in repositories.items()):
            raise ConnectionError(f"{path}: unsupported repository mappings")
        if "uuid" in data:
            identifier = valid_uuid(data["uuid"])
            if identifier in seen:
                raise ConnectionError(f"duplicate project UUID: {identifier}")
            seen.add(identifier)
        result.append((path, data))
    return result


def bind(config: dict, home_id: str, project_id: str, alias: str, path: Path, remote: str = "origin") -> None:
    path = checkout(path)
    candidate = {"home_uuid": home_id, "project_uuid": project_id, "repo": alias, "path": str(path), "fetch_remote": remote}
    for item in config["bindings"]:
        if all(item[key] == candidate[key] for key in ("home_uuid", "project_uuid", "repo")):
            if item == candidate:
                return
            if Path(item["path"]).exists():
                raise ConnectionError("alias already bound to an existing checkout; use a separate per-machine config for another clone")
            config["bindings"].remove(item)
            break
    config["bindings"].append(candidate)


def repository_path(root: Path, metadata: dict, alias: str, value, config: dict | None = None) -> Path:
    """The reader's one locator seam: legacy paths or validated local bindings."""
    if isinstance(value, str):
        return (root / value).resolve()
    if not valid_repository(value):
        raise ConnectionError(f"invalid repository registration: {alias}")
    marker = home_marker(root)
    entries = [b for b in (config if config is not None else read_config())["bindings"]
               if b["home_uuid"] == marker["uuid"] and b["project_uuid"] == metadata.get("uuid") and b["repo"] == alias]
    if len(entries) != 1:
        raise ConnectionError(f"repository {alias} needs one explicit local binding; found {len(entries)}")
    path = checkout(Path(entries[0]["path"]))
    if "remote" in value:
        if identity(value["remote"]) != identity(git(path, "remote", "get-url", entries[0].get("fetch_remote", "origin"))):
            raise ConnectionError(f"repository identity mismatch: {path}")
    else:
        git(path, "cat-file", "-e", f"{value['anchor']}^{{commit}}")
    return path


def resolve(config: dict, root: Path, marker: dict, path: Path, project: str | None = None, repo: str | None = None) -> dict:
    path = checkout(path)
    all_projects = projects(root)
    exact = [b for b in config["bindings"] if b["home_uuid"] == marker["uuid"] and Path(b["path"]).resolve() == path]
    if not exact:
        common = git(path, "rev-parse", "--path-format=absolute", "--git-common-dir")
        exact = [b for b in config["bindings"] if b["home_uuid"] == marker["uuid"] and Path(b["path"]).is_dir()
                 and git(Path(b["path"]), "rev-parse", "--path-format=absolute", "--git-common-dir") == common]
    candidates = []
    for file, data in all_projects:
        if project is not None and project not in {file.parent.name, data.get("uuid")}:
            continue
        for alias, value in (data.get("repositories") or {}).items():
            if repo is not None and alias != repo:
                continue
            if exact:
                match = any(b["project_uuid"] == data.get("uuid") and b["repo"] == alias for b in exact)
            elif isinstance(value, str):
                match = (root / value).resolve() == path
            else:
                # Do not guess a checkout for portable registrations. Bind on each machine.
                match = False
            if match:
                actual = repository_path(root, data, alias, value, config)
                if actual == path or git(actual, "rev-parse", "--path-format=absolute", "--git-common-dir") == git(path, "rev-parse", "--path-format=absolute", "--git-common-dir"):
                    candidates.append({"home": str(root), "home_uuid": marker["uuid"],
                                       "project": file.parent.name, "project_uuid": data.get("uuid"),
                                       "entry": str(file), "repo": alias, "checkout": str(path)})
    if len(candidates) != 1:
        choices = [f"{c['project']}:{c['repo']}" for c in candidates]
        raise ConnectionError(f"expected one project binding for {path}; found {len(candidates)} {choices}; select --project and, if needed, --repo")
    return candidates[0]


def init_home(args, config: dict) -> dict:
    root = checkout(args.path)
    if not (root / "workspace").is_dir():
        raise ConnectionError("inspect Home policy and create its workspace directory before init")
    path = root / ".workspace-home.json"
    marker = home_marker(root) if path.exists() else {"schema_version": 1, "uuid": str(uuid.uuid4()), "layout": "workspace-v1"}
    previous = config["homes"].get(args.alias)
    if previous and previous["uuid"] != marker["uuid"]:
        raise ConnectionError("Home alias already names another UUID; choose another alias")
    config["homes"][args.alias] = {"uuid": marker["uuid"], "path": str(root)}
    if "machine_uuid" not in config:
        config["machine_uuid"] = str(uuid.uuid4())
    if args.default or not config.get("default_home"):
        config["default_home"] = args.alias
    write_json(path, marker)
    write_json(config_path(), config)
    return {"home": str(root), **marker, "machine_uuid": config["machine_uuid"], "alias": args.alias, "default_home": config.get("default_home")}


def connect(args, config: dict, root: Path, marker: dict) -> dict:
    path = checkout(args.path)
    file = project_file(root, args.project)
    all_projects = projects(root)
    existing = next((data for name, data in all_projects if name == file), None)
    previous = (existing or {}).get("repositories", {}).get(args.repo)
    if args.local:
        if git(path, "remote"):
            raise ConnectionError("--local is for repositories without remotes; use the existing hosted identity")
        registration = previous if isinstance(previous, dict) and "local_uuid" in previous else {"local_uuid": str(uuid.uuid4()), "anchor": git(path, "rev-parse", "HEAD")}
    else:
        registration = {"remote": identity(git(path, "remote", "get-url", args.remote))}
    if existing is None:
        # An existing location/remote must not be enrolled under a second identity.
        for _, data in all_projects:
            for value in (data.get("repositories") or {}).values():
                if (isinstance(value, str) and (root / value).resolve() == path) or (isinstance(value, dict) and same_repository(value, registration)):
                    raise ConnectionError("repository already registered; reuse its project selector")
        if not args.title:
            raise ConnectionError("new project requires --title")
        today = date.today().isoformat()
        existing = {"id": args.project, "title": args.title, "created": today, "updated": today, "repositories": {}, "priorities": []}
        original = None
        body = f"# {args.title}\n\nWorking records live here; product code lives in the registered repositories.\n"
    else:
        original = file.read_text()
        _, body, _ = record_reader()._frontmatter(file)
    identifier = existing.get("uuid") or str(uuid.uuid4())
    valid_uuid(identifier)
    if isinstance(previous, str) and (root / previous).resolve() != path:
        raise ConnectionError("existing repository path differs; resolve it before conversion")
    if isinstance(previous, dict) and not same_repository(previous, registration):
        raise ConnectionError("existing repository identity differs; choose the correct alias")
    bind(config, marker["uuid"], identifier, args.repo, path, args.remote)
    existing["uuid"] = identifier
    existing.setdefault("repositories", {})[args.repo] = registration
    # Validate the proposed identity before touching Home or the machine config.
    repository_path(root, existing, args.repo, registration, config)
    # Keep existing frontmatter text/body unchanged except UUID and this repository entry.
    if original:
        lines = original.splitlines(keepends=True)
        end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
        header = "".join(lines[1:end])
        if "uuid" not in yaml.safe_load(header):
            header += f"uuid: {identifier}\n"
        match = re.search(r"^repositories:\s*\n(?:[ \t]+[^\n]*\n)*", header, re.M)
        if match:
            repos = yaml.safe_load(match.group()) or {}
            values = repos.get("repositories") or {}
            values[args.repo] = registration
            header = header[:match.start()] + yaml.safe_dump({"repositories": values}, sort_keys=False) + header[match.end():]
        else:
            if "repositories" in yaml.safe_load(header):
                raise ConnectionError("repositories must use block YAML before connection update")
            header += yaml.safe_dump({"repositories": existing["repositories"]}, sort_keys=False)
        content = "---\n" + header + "".join(lines[end:])
    else:
        content = "---\n" + yaml.safe_dump(existing, sort_keys=False) + "---\n" + body
    file.parent.mkdir(parents=True, exist_ok=True)
    if not file.exists() or file.read_text() != content:
        file.write_text(content)
    write_json(config_path(), config)
    return resolve(config, root, marker, path, args.project, args.repo)


def git_snapshot(path: Path, *, pull: bool, fetch_remote: str = "origin") -> dict:
    result = {"path": str(path), "dirty": bool(git(path, "status", "--porcelain"))}
    try:
        try:
            upstream = git(path, "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}")
        except ConnectionError:
            if pull:
                raise
            git(path, "fetch", fetch_remote)
            result.update(state="checked-untracked", upstream=None, fetched_remote=fetch_remote,
                          note="No branch upstream; compare the reported GitHub default revision before editing.")
            result["head"] = git(path, "rev-parse", "HEAD")
            return result
        remote = git(path, "config", f"branch.{git(path, 'branch', '--show-current')}.remote")
        if remote == ".":
            raise ConnectionError("upstream must have a network/local bare remote")
        git(path, "fetch", remote)
        if not pull and fetch_remote != remote:
            git(path, "fetch", fetch_remote)
        ahead, behind = map(int, git(path, "rev-list", "--left-right", "--count", "HEAD...@{upstream}").split())
        result.update(upstream=upstream, ahead=ahead, behind=behind)
        if ahead and behind:
            result["state"] = "diverged"
        elif pull and behind and result["dirty"]:
            result["state"] = "blocked-dirty"
        elif pull and behind:
            git(path, "merge", "--ff-only", "@{upstream}")
            result.update(state="fast-forwarded", behind=0)
        elif pull and ahead:
            result["state"] = "ahead-unpublished"
        else:
            result["state"] = "checked"
    except (ConnectionError, subprocess.TimeoutExpired) as exc:
        result.update(state="unavailable", error=str(exc))
    result["head"] = git(path, "rev-parse", "HEAD")
    return result


def github_snapshot(path: Path, remote: str) -> dict:
    try:
        canonical = identity(remote)
        if not canonical.startswith("https://github.com/"):
            raise ConnectionError("registered repository is not hosted on GitHub")
        name = canonical.removeprefix("https://github.com/")
        sha = git(path, "rev-parse", "HEAD")
        def gh(*args):
            proc = subprocess.run(["gh", *args], cwd=path, text=True, capture_output=True, timeout=35)
            if proc.returncode:
                raise ConnectionError(proc.stderr.strip() or "GitHub query failed")
            return json.loads(proc.stdout)
        runs = gh("run", "list", "--repo", name, "--commit", sha, "--limit", "20", "--json", "headSha,status,conclusion,url,name")
        prs = gh("pr", "list", "--repo", name, "--state", "open", "--limit", "100", "--json", "number,title,headRefName,headRefOid,url")
        default = gh("api", f"repos/{name}", "--jq", "{default_branch: .default_branch}")
        branch = gh("api", f"repos/{name}/commits/{default['default_branch']}", "--jq", "{sha: .sha}")
        latest_runs = runs if branch["sha"] == sha else gh("run", "list", "--repo", name, "--commit", branch["sha"], "--limit", "20", "--json", "headSha,status,conclusion,url,name")
        return {"state": "checked", "revision": sha, "runs": runs, "open_prs": prs,
                "default_branch": default["default_branch"], "default_revision": branch["sha"], "default_runs": latest_runs,
                "pr_limit": 100, "run_limit": 20}
    except (OSError, ConnectionError, subprocess.TimeoutExpired, json.JSONDecodeError) as exc:
        return {"state": "unavailable", "error": str(exc)}


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path)
    parser.add_argument("--home", help="configured Home alias; default otherwise")
    sub = parser.add_subparsers(dest="command", required=True)
    init = sub.add_parser("init", help="register an existing workspace-v1 Home")
    init.add_argument("alias")
    init.add_argument("path", type=Path)
    init.add_argument("--default", action="store_true")
    for name in ("connect", "bind"):
        cmd = sub.add_parser(name)
        cmd.add_argument("project")
        cmd.add_argument("repo")
        cmd.add_argument("path", type=Path)
        cmd.add_argument("--remote", default="origin", help="fetch remote naming this repository")
        if name == "connect":
            cmd.add_argument("--title")
            cmd.add_argument("--local", action="store_true", help="register a no-remote repository by local UUID and an existing commit anchor")
    for name in ("resolve", "doctor", "start"):
        cmd = sub.add_parser(name)
        cmd.add_argument("path", type=Path)
        cmd.add_argument("--project", help="select one project when a checkout is shared")
        cmd.add_argument("--repo", help="select one repository/worktree alias")
    args = parser.parse_args(argv)
    if args.config:
        os.environ["WORKSPACE_CONFIG"] = str(args.config.expanduser().resolve())
    try:
        config = read_config()
        if args.command == "init":
            payload = init_home(args, config)
        else:
            root, marker = selected_home(config, args.home)
            if args.command == "connect":
                payload = connect(args, config, root, marker)
            elif args.command == "bind":
                file = project_file(root, args.project)
                data = next((d for p, d in projects(root) if p == file), None)
                if not data or not data.get("uuid") or args.repo not in data.get("repositories", {}):
                    raise ConnectionError("project UUID/repository alias must already be registered in Home")
                # Validate identity before saving the binding.
                bind(config, marker["uuid"], data["uuid"], args.repo, args.path, args.remote)
                payload = resolve(config, root, marker, args.path, args.project, args.repo)
                write_json(config_path(), config)
            else:
                # Start syncs Home before resolving records; resolution/doctor stay read-only.
                home_git = git_snapshot(root, pull=True) if args.command == "start" else None
                if home_git and home_git["state"] not in {"checked", "fast-forwarded"}:
                    raise ConnectionError(f"Home sync blocked: {json.dumps(home_git)}")
                payload = resolve(config, root, marker, args.path, args.project, args.repo)
                if args.command == "doctor":
                    run = record_reader().run
                    payload["records"] = run(root, "check", payload["project"])
                    payload["git"] = run(root, "status", payload["project"])["git"]
                if home_git:
                    code = checkout(args.path)
                    payload["home_git"] = home_git
                    binding = next((b for b in config["bindings"] if b["home_uuid"] == marker["uuid"] and b["project_uuid"] == payload["project_uuid"] and b["repo"] == payload["repo"]), {})
                    data = next(d for p, d in projects(root) if p.parent.name == payload["project"])
                    value = data["repositories"][payload["repo"]]
                    if isinstance(value, dict) and "local_uuid" in value:
                        payload["code_git"] = {"state": "local-only", "head": git(code, "rev-parse", "HEAD"), "dirty": bool(git(code, "status", "--porcelain"))}
                        payload["github"] = {"state": "not-configured", "note": "Explicit local-only repository; no remote progress or CI is claimed."}
                    else:
                        payload["code_git"] = git_snapshot(code, pull=False, fetch_remote=binding.get("fetch_remote", "origin"))
                        remote = value["remote"] if isinstance(value, dict) else git(code, "remote", "get-url", "origin")
                        payload["github"] = github_snapshot(code, remote)
                    run = record_reader().run
                    payload["records"] = run(root, "status", payload["project"])
        print(json.dumps(payload, indent=2, ensure_ascii=False, default=str))
        if args.command == "doctor" and (payload["records"]["status"] != "ok" or any("error" in item for item in payload["git"])):
            return 1
        if args.command == "start" and (payload["code_git"]["state"] in {"unavailable", "diverged"} or payload["github"]["state"] == "unavailable"):
            return 1
        return 0
    except (OSError, ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as exc:
        print(json.dumps({"error": str(exc)}))
        return 1

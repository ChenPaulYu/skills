"""Read-only checks for a work card's metadata and visible relation projection.

Frontmatter links own relation/target identity. Compare table rows to resolved record
paths, accepting descriptive labels, encoded paths and optional projection comments.
Normal scans are advisory; the caller enforces only explicitly selected write paths.
This checks the supported Markdown card convention, not arbitrary Markdown or source
coverage. Fenced examples and HTML comments cannot satisfy the visible interface.
"""

from __future__ import annotations

from collections import Counter
from pathlib import Path
import re
from typing import Any
from urllib.parse import unquote, urlsplit


def _visible(text: str) -> str:
    lines = []
    fence = None
    for line in text.splitlines():
        marker = re.match(r"^ {0,3}(`{3,}|~{3,})(.*)$", line)
        if fence:
            if marker and marker[1][0] == fence[0] and len(marker[1]) >= len(fence) and not marker[2].strip():
                fence = None
        elif marker:
            fence = marker[1]
        else:
            lines.append(line)
    return re.sub(r"<!--.*?-->", "", "\n".join(lines), flags=re.S)


def check_card(root: Path, record: dict[str, Any], records: list[dict[str, Any]]) -> list[dict[str, str]]:
    """Return findings only; never rewrite the card, links or other records."""
    findings = []

    def report(code: str, message: str) -> None:
        findings.append({"code": code, "path": record["path"], "message": message})

    for field in ("id", "type", "title", "status", "created", "updated", "links"):
        if field not in record["metadata"]:
            report("record-missing-field", f"missing required card field: {field}")

    body = _visible(record["body"])
    headings = list(re.finditer(r"^##[ \t]+Relations(?:[ \t]+#+)?[ \t]*$", body, re.M))
    if not headings:
        report("missing-relations", "work card is missing its visible ## Relations section")
        return findings
    if len(headings) != 1:
        report("duplicate-relations", "work card must have one visible Relations section")
        return findings
    section = body[headings[0].end():]
    section = re.split(r"^#{1,2}[ \t]+", section, maxsplit=1, flags=re.M)[0]
    by_path = {(root / r["path"]).resolve(): r["id"] for r in records if isinstance(r["id"], str)}
    expected = Counter((link["relation"], link["target"]) for link in record["links"])
    actual = Counter()
    empty = re.search(r"\bNo\s+relations\s+recorded\s+yet\s*\.", section, re.I) is not None
    for line in section.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [cell.strip() for cell in re.split(r"(?<!\\)\|", line.strip().strip("|"))]
        if len(cells) == 2 and (cells[0].casefold(), cells[1].casefold()) == ("relation", "record"):
            continue
        if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        if len(cells) != 2 or not cells[0]:
            report("invalid-relations-row", "Relations rows need relation and linked record columns")
            continue
        # Labels are explanatory prose; identity comes from the destination path.
        links = re.findall(r"\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)\s*\)", cells[1])
        if len(links) != 1:
            report("invalid-relations-row", "each Relations row needs one inline Markdown record link")
            continue
        try:
            destination = urlsplit(links[0].strip("<>"))
            target = ((root / record["path"]).parent / unquote(destination.path)).resolve()
        except (ValueError, OSError):
            report("invalid-relations-target", "Relations link has an invalid destination")
            continue
        if destination.scheme or destination.netloc or not destination.path or target not in by_path:
            report("invalid-relations-target", "Relations link must resolve to an actual record in this project")
            continue
        relation = cells[0].strip("`").strip()
        actual[(relation, by_path[target])] += 1
    if not expected:
        if not empty:
            report("missing-empty-relations", "empty links need the explicit statement: No relations recorded yet.")
    elif empty:
        report("contradictory-relations", "Relations says no relations but frontmatter links is nonempty")
    if actual != expected:
        report("relations-projection-mismatch", "visible relation/target rows do not match frontmatter links")
    return findings


def inspect_cards(root: Path, records: list[dict[str, Any]], paths: list[str] | None) -> dict[str, Any]:
    """Inspect all scoped cards advisory, or require explicitly selected card paths."""
    root = root.resolve()
    findings = []
    selected = records
    if paths is not None:
        if not paths:
            findings.append({"code": "invalid-record-selection", "path": "workspace",
                             "message": "required format verification needs at least one explicit work card"})
        by_path = {(root / record["path"]).resolve(): record for record in records}
        selected = []
        seen = set()
        for value in paths:
            path = (root / value).resolve()
            if path not in by_path:
                findings.append({"code": "invalid-record-selection", "path": value,
                                 "message": "selection must name an existing work card in the requested scope, relative to Home"})
            elif path not in seen:
                selected.append(by_path[path])
                seen.add(path)
    for record in selected:
        mine = [r for r in records if r["_project_dir"] == record["_project_dir"]]
        findings.extend(check_card(root, record, mine))
    return {"mode": "required" if paths is not None else "advisory",
            "checked_records": [r["path"] for r in selected], "findings": findings,
            "limits": "Card metadata and visible Relations only; source coverage, factual accuracy and runtime behavior are not verified."}

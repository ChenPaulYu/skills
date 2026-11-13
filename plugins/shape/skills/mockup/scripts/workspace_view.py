"""Explicit, offline HTML export of reader data; never an authoritative board."""
from datetime import datetime, timezone
import json
from pathlib import Path


def export_view(root, project, graph, records, output):
    root = Path(root).resolve()
    output = Path(output).expanduser().resolve()
    # A view is disposable output, never a replacement for any source record/artifact.
    if output == root or root in output.parents:
        raise ValueError("Export outside the home repository; view must not overwrite source records or artifacts")
    if output.exists():
        raise ValueError("Output exists; choose a fresh path instead of overwriting a file")
    payload = {"project": project, "graph": graph, "records": records,
               "generated": datetime.now(timezone.utc).isoformat(timespec="seconds")}
    data = json.dumps(payload, ensure_ascii=False).replace("<", "\\u003c").replace("&", "\\u0026")
    template = Path(__file__).with_name("workspace_graph.html").read_text(encoding="utf-8")
    html = template.replace('/*__WORKSPACE_DATA__*/null', data)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("x", encoding="utf-8") as stream:
        stream.write(html)
    return {"output": str(output), "project": project["id"], "nodes": len(graph["nodes"]),
            "edges": len(graph["edges"]), "diagnostics": graph["diagnostics"], "read_tier": graph["read_tier"]}

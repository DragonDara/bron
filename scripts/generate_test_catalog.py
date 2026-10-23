"""Build docs/testing/TEST_CATALOG.md from the test files themselves.

Run from the repo root:   python3 scripts/generate_test_catalog.py

Only the text between the BEGIN/END GENERATED markers is rewritten; the
hand-written part of the catalog above them is kept as is.
"""

# The catalog's headings are Russian on purpose; RUF001 would flag every
# Cyrillic letter that looks like a Latin one.
# ruff: noqa: RUF001

import ast
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "docs" / "testing" / "TEST_CATALOG.md"
CI_WORKFLOW = ROOT / ".github" / "workflows" / "test.yml"
BEGIN, END = "<!-- BEGIN GENERATED -->", "<!-- END GENERATED -->"
FRONTEND_APPS = ["pos", "frontend", "self-order", "packages/core", "packages/ui", "mosaic"]

# describe('...') / it("...") / test(`...`), incl. it.only / test.skip
JS_BLOCK = re.compile(r"^(\s*)(describe|it|test)(?:\.\w+)?\(\s*(['\"`])(.+?)\3")


def tracked(*patterns):
	"""Files git knows about: keeps node_modules and build output out."""
	out = subprocess.run(["git", "ls-files", *patterns], cwd=ROOT, capture_output=True, text=True, check=True)
	return sorted(out.stdout.split())


def first_line(text, limit=200):
	text = " ".join((text or "").split())
	return text if len(text) <= limit else text[: limit - 1] + "…"


def ci_modules():
	"""Backend modules listed in the CI workflow's shard matrix."""
	return set(re.findall(r"^\s+(ury\.[\w.]+)\s*$", CI_WORKFLOW.read_text(), flags=re.M))


def describe_python(path, in_ci):
	"""Facts about one backend test file: module, test count, tags, outline."""
	source = (ROOT / path).read_text()
	tree = ast.parse(source)
	module = path[:-3].replace("/", ".")
	tags = []
	if "patch(" in source or "MagicMock" in source:
		tags.append("моки")
	if re.search(r"\.insert\(|\.submit\(\)", source):
		tags.append("реальная БД")
	if "frappe.set_user(" in source:
		tags.append("от имени пользователя")

	body, count = [], 0
	if doc := ast.get_docstring(tree):
		body += [f"> {first_line(doc, 400)}", ""]
	for cls in (n for n in tree.body if isinstance(n, ast.ClassDef)):
		tests = [f for f in cls.body if isinstance(f, ast.FunctionDef) and f.name.startswith("test_")]
		if not tests:
			continue
		cls_doc = ast.get_docstring(cls)
		body.append(f"- **{cls.name}**" + (f": {first_line(cls_doc)}" if cls_doc else ""))
		for fn in tests:
			doc = ast.get_docstring(fn)
			body.append(f"  - `{fn.name}`" + (f": {first_line(doc)}" if doc else ""))
		count += len(tests)
	return {"name": module, "count": count, "in_ci": module in in_ci, "tags": tags, "body": body}


def describe_js(path):
	"""Facts about one Vitest / Playwright file: describe/it outline, nested by indentation."""
	body, stack, count = [], [], 0
	for raw in (ROOT / path).read_text().splitlines():
		match = JS_BLOCK.match(raw)
		if not match:
			continue
		indent, kind, title = len(match.group(1)), match.group(2), match.group(4)
		while stack and stack[-1] >= indent:
			stack.pop()
		bullet = "  " * len(stack) + "- "
		if kind == "describe":
			body.append(f"{bullet}**{title}**")
			stack.append(indent)
		else:
			body.append(f"{bullet}{title}")
			count += 1
	return {"name": path, "count": count, "body": body}


def details(title, body):
	"""A collapsed <details> block; GitHub renders the Markdown inside it."""
	return ["<details>", f"<summary>{title}</summary>", "", *body, "", "</details>", ""]


def folder_of(module):
	"""ury.ury.api.test_x -> ury/ury/api; all doctype tests share one folder row."""
	parts = module.split(".")[:-1]
	if "doctype" in parts:
		parts = parts[: parts.index("doctype") + 1]
	return "/".join(parts)


def total(items):
	return sum(item["count"] for item in items)


def build():
	in_ci = ci_modules()
	backend = [describe_python(p, in_ci) for p in tracked("ury/**/test_*.py")]
	frontend = {
		app: [describe_js(p) for p in tracked(f"{app}/**/*.test.ts", f"{app}/**/*.test.tsx")]
		for app in FRONTEND_APPS
	}
	playwright = [describe_js(p) for p in tracked("e2e/tests/*.spec.ts")]

	out = ["## Итоги", "", "| Набор | Файлов | Тестов |", "|---|---:|---:|"]
	in_ci_count = sum(m["in_ci"] for m in backend)
	out.append(f"| Backend (Python) | {len(backend)} (в CI: {in_ci_count}) | {total(backend)} |")
	out += [
		f"| Frontend `{app}/` (Vitest) | {len(files)} | {total(files)} |" for app, files in frontend.items()
	]
	out += [f"| Браузерные e2e `e2e/` (Playwright) | {len(playwright)} | {total(playwright)} |", ""]

	folders = {}
	for m in backend:
		folders.setdefault(folder_of(m["name"]), []).append(m)
	out += ["## Backend по папкам", "", "| Папка | Модулей | Тестов | Не в CI |", "|---|---:|---:|---:|"]
	for folder, mods in sorted(folders.items(), key=lambda kv: -total(kv[1])):
		out.append(f"| `{folder}` | {len(mods)} | {total(mods)} | {sum(not m['in_ci'] for m in mods)} |")

	missing = sorted((m for m in backend if not m["in_ci"]), key=lambda m: -m["count"])
	out += ["", f"## Backend-модули, которых нет в CI ({len(missing)})", ""]
	out += ["| Модуль | Тестов | Метки |", "|---|---:|---|"]
	out += [f"| `{m['name']}` | {m['count']} | {', '.join(m['tags'])} |" for m in missing]

	out += ["", "## Все backend-модули", ""]
	for folder, mods in sorted(folders.items()):
		out += [f"### `{folder}`", "", "| Модуль | Тестов | CI | Метки |", "|---|---:|:-:|---|"]
		out += [
			f"| `{m['name'].split('.')[-1]}` | {m['count']} | {'✅' if m['in_ci'] else '❌'} | {', '.join(m['tags'])} |"
			for m in mods
		]
		out.append("")
		for m in mods:
			out += details(f"<code>{m['name']}</code> ({m['count']})", m["body"])

	sections = [(f"Frontend `{app}/` (Vitest)", files) for app, files in frontend.items()]
	sections.append(("Браузерные e2e `e2e/` (Playwright, не в CI)", playwright))
	for title, files in sections:
		if not files:
			continue
		out += [f"## {title}", "", "| Файл | Тестов |", "|---|---:|"]
		out += [f"| `{f['name']}` | {f['count']} |" for f in files]
		out.append("")
		for f in files:
			out += details(f"<code>{f['name']}</code> ({f['count']})", f["body"])
	return "\n".join(out)


def main():
	text = CATALOG.read_text() if CATALOG.exists() else f"# Каталог тестов\n\n{BEGIN}\n{END}\n"
	head, _, rest = text.partition(BEGIN)
	_, _, tail = rest.partition(END)
	CATALOG.parent.mkdir(parents=True, exist_ok=True)
	CATALOG.write_text(
		f"{head}{BEGIN}\n_Сгенерировано `scripts/generate_test_catalog.py`, не редактировать вручную._\n\n"
		f"{build()}\n{END}{tail}"
	)
	print(f"wrote {CATALOG.relative_to(ROOT)}")


if __name__ == "__main__":
	main()

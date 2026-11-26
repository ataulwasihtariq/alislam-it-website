#!/usr/bin/env python3
"""Archivio di riferimento dei repository dei dipartimenti (senza copiare i file pesanti).

Per ogni repository crea in docs/archivio/<nome>/ :
  - README.md   (copia del README del repository, con data e commit)
  - INDICE.md   (tutti i file con dimensione, impronta SHA-256 e indirizzo originale, fissati al commit)
Non copia PDF, moduli, configurazioni o indirizzi di script: restano nel repository originale.

Uso:  python3 tools/archivia_dipartimenti.py [cartella-con-i-repository]
"""
import sys, hashlib, pathlib, subprocess, datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent
REPOS = {"waqfe-nau": "Waqf-e-Nau Italia", "rishta-nata": "Rishta Nata"}
SKIP = {".git"}

for name, title in REPOS.items():
    repo = SRC / name
    if not (repo / ".git").exists():
        print("manca", repo); continue
    sha = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()
    out = ROOT / "docs" / "archivio" / name
    out.mkdir(parents=True, exist_ok=True)
    today = datetime.date.today().isoformat()
    base = f"https://github.com/ataulwasihtariq/{name}"
    readme = (repo / "README.md").read_text(encoding="utf-8") if (repo / "README.md").exists() else ""
    (out / "README.md").write_text(
        f"<!-- Copia di riferimento del README di {name}, commit {sha[:10]}, {today}. L'originale è nel repository. -->\n{readme}", encoding="utf-8")
    rows = []
    for f in sorted(repo.rglob("*")):
        if not f.is_file() or SKIP & set(f.relative_to(repo).parts):
            continue
        rel = f.relative_to(repo).as_posix()
        h = hashlib.sha256(f.read_bytes()).hexdigest()[:16]
        rows.append(f"| `{rel}` | {f.stat().st_size/1024:.0f} KB | `{h}` | [apri]({base}/blob/{sha}/{rel}) |")
    (out / "INDICE.md").write_text(
        f"# Archivio: {title}\n\nRepository: {base}\nCommit archiviato: `{sha}` ({today})\n\n"
        "Questo indice fissa i contenuti del repository a un commit preciso. I file restano nel repository originale; qui si conservano elenco, impronte e link. "
        "Nessun modulo compilato, nome, telefono o elenco di persone deve comparire in questa cartella.\n\n"
        "| File | Dimensione | SHA-256 (16) | Originale |\n|---|---|---|---|\n" + "\n".join(rows) + "\n", encoding="utf-8")
    print(name, len(rows), "file indicizzati,", sha[:10])

#!/usr/bin/env python3
"""Costruisce il sito statico in site/ a partire da src/pages/*.html.

Uso:
    python3 src/build.py                      # usa i repository fratelli ../waqfe-nau e ../rishta-nata
    python3 src/build.py --sources /percorso  # cartella che contiene waqfe-nau/ e rishta-nata/

Ogni pagina è un file con intestazione tra '---' (title, description, lead, eyebrow, path, layout, ...)
e un corpo HTML che può usare Jinja ({{ root }} = percorso relativo alla radice del sito).
Dopo la costruzione scrive anche wordpress/pages/*.html (solo il corpo, da incollare in WordPress).
"""
import argparse, json, re, shutil, sys, pathlib, html as _html
from jinja2 import Environment, FileSystemLoader

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from importlib import util as _u
_spec = _u.spec_from_file_location("amj_site", ROOT / "src" / "site.py")
cfg = _u.module_from_spec(_spec); _spec.loader.exec_module(cfg)

ap = argparse.ArgumentParser()
ap.add_argument("--sources", default=str(ROOT.parent))
args = ap.parse_args()
SRC = pathlib.Path(args.sources)

OUT = ROOT / "site"
WPPAGES = ROOT / "wordpress" / "pages"
env = Environment(loader=FileSystemLoader(str(ROOT / "src" / "templates")), autoescape=False, trim_blocks=True, lstrip_blocks=True)
base = env.get_template("base.html.j2")


def parse(path):
    txt = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", txt, re.S)
    meta, body = {}, txt
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1); meta[k.strip()] = v.strip()
        body = m.group(2)
    return meta, body


def depth_root(rel):
    d = len(pathlib.PurePosixPath(rel).parts) - 1
    return "../" * d if d else ""


def section_of(rel):
    first = rel.split("/")[0] + "/"
    return first if any(h == first for _, h in cfg.NAV) else ""


def render(meta, body, rel, wp=False, **extra):
    root = "/" if wp else depth_root(rel)
    assets = "/wp-content/themes/amj-it/assets/" if wp else root + "assets/"
    ctx = dict(site=cfg.SITE, nav=cfg.NAV, departments=cfg.DEPARTMENTS, auxiliary=cfg.AUXILIARY,
               cities=cfg.CITIES, sermons=cfg.SERMONS, books=cfg.BOOKS, press=cfg.PRESS, articles=cfg.ARTICLES, faq_home=cfg.FAQ_HOME, root=root, assets=assets,
               title=meta.get("title", cfg.SITE["name"]), description=meta.get("description", ""),
               noindex=meta.get("noindex") == "true", is_home=rel == "index.html",
               section=section_of(rel), accent=None, extra_head="")
    ctx.update(extra)
    inner = env.from_string(body).render(**ctx)
    layout = meta.get("layout", "page")
    if layout == "page" and not wp:
        crumbs = env.from_string(meta.get("crumbs", "")).render(root=root)
        head = (f'<section class="amj-page"><div class="amj-w">'
                f'{("<p class=amj-crumbs>" + crumbs + "</p>") if crumbs else ""}'
                f'<p class="amj-eyebrow">{meta.get("eyebrow","")}</p><div class="amj-rule"></div>'
                f'<h1>{meta.get("h1", meta.get("title",""))}</h1>'
                f'{("<p class=amj-lead>" + meta["lead"] + "</p>") if meta.get("lead") else ""}</div></section>')
        inner = head + inner
    ctx["body"] = inner
    if wp:
        return None, inner
    html = base.render(**ctx)
    # percorso link: le directory terminano con '/', in locale servono index.html
    html = re.sub(r'href="((?:\.\./)*[a-z0-9\-/]*/)"', lambda m: f'href="{m.group(1)}index.html"', html)
    html = re.sub(r'href="((?:\.\./)*)"', lambda m: f'href="{m.group(1)}index.html"', html)
    return html, inner


def decode_ramadan():
    """Legge data/preghiere-alislam-feb-mar.raw (tabella ufficiale di alislam.it) e produce il JSON del sito."""
    raw = {}
    for line in (ROOT / "data" / "preghiere-alislam-feb-mar.raw").read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        name, *series = line.strip().split(";")
        out = []
        for ser in series:
            v = [int(x) for x in ser.split(",")]
            for i in range(1, len(v)):
                v[i] += v[i - 1]
            out.append(v)
        assert len(out) == 4 and all(len(v) == cfg.RAMADAN["days"] for v in out), name
        raw[name] = dict(zip(["fajr", "zuhr", "asr", "maghrib"], out))
    groups = []
    for g in cfg.RAMADAN_GROUPS:
        items = []
        for label, key, note in g["items"]:
            assert key in raw, key
            items.append({"key": label, "label": label, "table": key, "note": note})
        groups.append({"label": g["label"], "items": items})
    cities = {it["key"]: raw[it["table"]] for g in groups for it in g["items"]}
    return {"source": "https://www.alislam.it/orario-delle-preghiere/", "read_on": "2026-11-24", "start": cfg.RAMADAN["start"],
            "first_fast": cfg.RAMADAN["first_fast"], "days": cfg.RAMADAN["days"], "default": cfg.RAMADAN["default"],
            "groups": groups, "cities": cities}


def write_data():
    d = ROOT / "assets" / "data"
    d.mkdir(parents=True, exist_ok=True)
    (d / "ramadan-2027.json").write_text(json.dumps(decode_ramadan(), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (d / "eventi.json").write_text(json.dumps({"events": cfg.EVENTS}, ensure_ascii=False, indent=1), encoding="utf-8")
    ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//alislam.it//Eventi//IT", "X-WR-CALNAME:Comunità Ahmadiyya Italia · Eventi", "CALSCALE:GREGORIAN"]
    for e in cfg.EVENTS:
        s = e["start"].replace("-", "")
        y, m, dd = int(s[:4]), int(s[4:6]), int(s[6:])
        import datetime as _dt
        nx = (_dt.date(y, m, dd) + _dt.timedelta(days=1)).strftime("%Y%m%d")
        ics += ["BEGIN:VEVENT", f"UID:{e['id']}@alislam.it", "DTSTAMP:20261124T000000Z", f"DTSTART;VALUE=DATE:{s}", f"DTEND;VALUE=DATE:{nx}",
                f"SUMMARY:{e['title']}" + (" (data da confermare)" if e.get("tentative") else ""),
                "LOCATION:" + ", ".join(x for x in (e.get("place"), e.get("city")) if x), "DESCRIPTION:" + e.get("desc", ""), "END:VEVENT"]
    ics.append("END:VCALENDAR")
    (d / "eventi.ics").write_text("\r\n".join(ics) + "\r\n", encoding="utf-8")


def sync_theme_assets():
    """Copia gli asset del sito nel tema WordPress, così tema e anteprima restano identici."""
    dst = ROOT / "wordpress" / "theme" / "amj-it" / "assets"
    for sub in ("css", "js", "img", "data"):
        if (dst / sub).exists():
            shutil.rmtree(dst / sub)
        shutil.copytree(ROOT / "assets" / sub, dst / sub)
    for f in ("favicon.png",):
        shutil.copy2(ROOT / "assets" / f, dst / f)


def faq_jsonld():
    qa = []
    for q, a in cfg.FAQ_HOME:
        txt = _html.unescape(re.sub(r"<[^>]+>", "", a.replace("{root}", ""))).replace(" →", "").strip()
        qa.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": txt}})
    return '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": qa}, ensure_ascii=False) + "</script>"


def write(rel, html):
    p = OUT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(html, encoding="utf-8")


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    write_data()
    OUT.mkdir()
    shutil.copytree(ROOT / "assets", OUT / "assets")
    sync_theme_assets()
    if WPPAGES.exists():
        shutil.rmtree(WPPAGES)
    WPPAGES.mkdir(parents=True)
    n = 0
    for f in sorted((ROOT / "src" / "pages").glob("*.html")):
        meta, body = parse(f)
        rel = meta["path"]
        html, inner = render(meta, body, rel, extra_head=faq_jsonld() if rel == "index.html" else "")
        write(rel, html); n += 1
        _, winner = render(meta, body, rel, wp=True)
        (WPPAGES / (rel.replace("/", "__").replace(".html", "") + ".html")).write_text(winner, encoding="utf-8")

    # dipartimenti: indice + una pagina per ciascuno
    theme_css = ""
    tc = SRC / "waqfe-nau" / "assets" / "theme-jamaat.css"
    if tc.exists():
        theme_css = re.sub(r"@import url\([^)]*\);", "", tc.read_text(encoding="utf-8"))
    tpl_dept = (ROOT / "src" / "templates" / "dept.html.j2").read_text(encoding="utf-8")
    tpl_idx = (ROOT / "src" / "templates" / "dept_index.html.j2").read_text(encoding="utf-8")
    imeta = {"title": "Dipartimenti", "layout": "page", "h1": "I dipartimenti della Comunità",
                          "eyebrow": "Per i membri e per chi vuole conoscerci",
                          "lead": "Ogni dipartimento ha il suo compito e il suo colore, ma tutti seguono lo stesso stile e lo stesso spirito. Qui trovate informazioni, moduli e contatti.",
                          "description": "I dipartimenti della Comunità Islamica Ahmadiyya in Italia: Waqf-e-Nau, Rishta Nata, Tarbiyyat, Tabligh e altri.",
                          "crumbs": '<a href="{{ root }}index.html">Home</a> › Dipartimenti'}
    html, inner = render(imeta, tpl_idx, "dipartimenti/index.html")
    write("dipartimenti/index.html", html); n += 1
    _, winner = render(imeta, tpl_idx, "dipartimenti/index.html", wp=True)
    (WPPAGES / "dipartimenti__index.html").write_text(winner, encoding="utf-8")
    for d in cfg.DEPARTMENTS:
        embed = ""
        if d.get("embed"):
            ep = SRC / d["embed"]
            if ep.exists():
                embed = ep.read_text(encoding="utf-8")
                embed = re.sub(r"(<style>\s*)@import url\([^)]*\);", r"\1", embed, count=1)
            else:
                print("ATTENZIONE: manca", ep, file=sys.stderr)
        if d.get("embed") and not embed and d["slug"] not in cfg.DEPT_TEXT:
            embed = "<section class='amj-s'><div class='amj-w'><p>Contenuti in arrivo.</p></div></section>"
        rel = f"dipartimenti/{d['slug']}/index.html"
        meta = {"title": d["name"], "layout": "raw", "description": d["summary"]}
        html, inner = render(meta, tpl_dept, rel, d=d, accent=d["color"], embed=embed, theme_css=theme_css, auxiliary=cfg.AUXILIARY, DEPT_TEXT=cfg.DEPT_TEXT)
        write(rel, html); n += 1
        _, winner = render(meta, tpl_dept, rel, wp=True, d=d, accent=d["color"], embed=embed, theme_css=theme_css, auxiliary=cfg.AUXILIARY, DEPT_TEXT=cfg.DEPT_TEXT)
        (WPPAGES / f"dipartimenti__{d['slug']}.html").write_text(winner, encoding="utf-8")
    # pagina 404 con il marchio del sito
    m404 = {"title": "Pagina non trovata", "layout": "raw", "noindex": "true"}
    b404 = ("<section class='amj-s'><div class='amj-w' style='text-align:center;max-width:680px'><p class='amj-eyebrow'>Errore 404</p>"
            "<h1>Questa pagina non esiste</h1><p class='amj-lead' style='margin:16px 0 32px'>Forse l’indirizzo è cambiato. Torna alla pagina iniziale oppure scrivici: ti aiutiamo a trovare ciò che cerchi.</p>"
            "<div class='amj-cta2'><a class='amj-btn' href='{{ root }}index.html'>Torna alla home</a><a class='amj-btn2' href='{{ site.whatsapp_link }}'>Scrivici su WhatsApp</a></div></div></section>")
    html, _ = render(m404, b404, "404.html")
    write("404.html", html); n += 1
    print(f"costruite {n} pagine in {OUT}")


if __name__ == "__main__":
    main()

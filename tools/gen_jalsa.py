#!/usr/bin/env python3
"""Genera le pagine dell'archivio Jalsa Salana in src/pages/ da data/jalsa-archivio.json.

Uso:  python3 tools/gen_jalsa.py   (poi: python3 src/build.py)
Crea: src/pages/jalsa-salana.html (hub) e src/pages/jalsa-<anno>.html (una per edizione).
"""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data" / "jalsa-archivio.json").read_text(encoding="utf-8"))
PAGES = ROOT / "src" / "pages"
E = lambda s: html.escape(s, quote=True)
eds = sorted(DATA["editions"], key=lambda e: e["year"], reverse=True)


def fmt_att(a):
    if not a:
        return ""
    parts = []
    labels = [("men", "uomini"), ("women", "donne"), ("women_children", "donne e bambini"), ("children", "bambini"),
              ("italian_guests", "ospiti italiani"), ("abroad", "da altri Paesi")]
    for k, lab in labels:
        if k in a:
            parts.append(f"{a[k]} {lab}")
    return f"{a['total']} presenze" + (f" ({', '.join(parts)})" if parts else "")


def rep_short(e):
    r = e.get("rep")
    if not r:
        return ""
    return "; ".join(x.split(" (")[0] for x in r)


def year_page(e, prev, nxt):
    y = e["year"]
    meta = f"""---
title: Jalsa Salana Italia {y}
h1: Jalsa Salana Italia {y}
eyebrow: {e['n']} edizione · {e['dates']}
lead: {E(e['venue'])}
description: Jalsa Salana Italia {y} ({e['n']} edizione, {e['dates']}): programma, interventi, rappresentante del Califfo, ospiti e presenze.
path: jalsa-salana/{y}/index.html
crumbs: <a href="{{{{ root }}}}index.html">Home</a> › <a href="{{{{ root }}}}jalsa-salana/">Jalsa Salana</a> › {y}
---
"""
    b = ['<section class="amj-s"><div class="amj-w"><div class="amj-prose">']
    b.append(f"<p>{E(e['intro'])}</p>")
    b.append("</div></div></section>")
    # scheda
    rows = []
    rows.append(("Edizione", f"{e['n']} · {e['dates']}"))
    rows.append(("Luogo", e["venue"]))
    if e.get("theme"):
        rows.append(("Tema", e["theme"]))
    if e.get("rep"):
        rows.append(("Dal Markaz", "<br>".join(E(x) for x in e["rep"])))
    if e.get("officer"):
        rows.append(("Organizzazione", e["officer"]))
    if e.get("attendance"):
        t = fmt_att(e["attendance"])
        if e["attendance"].get("nota"):
            t += f" <em>— {E(e['attendance']['nota'])}</em>"
            rows.append(("Presenze", E(fmt_att(e["attendance"])) + f" <em>— {E(e['attendance']['nota'])}</em>"))
        else:
            rows.append(("Presenze", E(t)))
    if e.get("online"):
        rows.append(("In diretta", e["online"]))
    b.append('<section class="amj-w" style="padding-bottom:var(--s-600)"><div class="amj-box"><dl style="margin:0;display:grid;grid-template-columns:max-content 1fr;gap:.6rem 1.5rem">')
    for k, v in rows:
        vv = v if k in ("Presenze", "Dal Markaz") else E(v)
        b.append(f'<dt style="font-weight:600">{E(k)}</dt><dd style="margin:0">{vv}</dd>')
    b.append("</dl></div></section>")
    # programma
    if e["program"]:
        b.append('<section class="amj-pat" style="border-top:1px solid var(--amj-line);border-bottom:1px solid var(--amj-line)"><div class="amj-w amj-s">')
        b.append('<p class="amj-eyebrow">Programma e interventi</p><h2 style="margin-bottom:var(--s-400)">Chi ha parlato</h2><div class="amj-jed">')
        for d in e["program"]:
            b.append(f'<div class="amj-box"><h3 class="heading-5">{E(d["day"])}</h3><ul style="padding-left:1.1rem;margin:.5rem 0 0">')
            for who, role, title in d["items"]:
                line = f"<b>{E(who)}</b>"
                if role:
                    line += f" <span>— {E(role)}</span>"
                if title:
                    line += f"<br><span>{E(title)}</span>"
                b.append(f'<li style="margin-bottom:.55rem">{line}</li>')
            b.append("</ul></div>")
        b.append("</div>")
        if y >= 2013:
            b.append('<p style="margin-top:var(--s-400);font-size:.9em">I titoli degli interventi sono tradotti dall’urdu o dall’inglese quando il rapporto originale non è in italiano.</p>')
        b.append("</div></section>")
    else:
        b.append('<section class="amj-w amj-s"><div class="amj-box"><p class="amj-eyebrow">Programma</p><p>Il programma dettagliato di questa edizione è in corso di inserimento.</p></div></section>')
    # ospiti e messaggi
    if e.get("guests") or e.get("messages"):
        b.append('<section class="amj-w amj-s"><div class="amj-jed">')
        if e.get("guests"):
            b.append('<div class="amj-box"><p class="amj-eyebrow">Ospiti e relatori istituzionali</p><ul style="padding-left:1.1rem;margin:.5rem 0 0">')
            b += [f"<li>{E(g)}</li>" for g in e["guests"]]
            b.append("</ul></div>")
        if e.get("messages"):
            b.append('<div class="amj-box"><p class="amj-eyebrow">Messaggi ricevuti</p><ul style="padding-left:1.1rem;margin:.5rem 0 0">')
            b += [f"<li>{E(g)}</li>" for g in e["messages"]]
            b.append("</ul></div>")
        b.append("</div></section>")
    # link
    links = [l for l in e.get("links", []) if l[1]]
    if links:
        b.append('<section class="amj-w" style="padding-bottom:var(--s-600)"><div class="amj-box"><p class="amj-eyebrow">Video e approfondimenti</p><p>')
        b.append("<br>".join(f'<a class="amj-link" href="{E(u)}" target="_blank" rel="noopener">{E(t)} <i class="ph ph-arrow-up-right"></i></a>' for t, u in links))
        b.append("</p></div></section>")
    # gallery + fonti + navigazione
    b.append('<section class="amj-w" style="padding-bottom:var(--s-600)"><div class="amj-box"><p class="amj-eyebrow">Galleria fotografica</p><p>Le fotografie di questa edizione saranno pubblicate dopo la selezione degli scatti adatti al sito.</p></div></section>')
    b.append(f'<section class="amj-w" style="padding-bottom:var(--s-600)"><p style="font-size:.85em"><b>Fonti:</b> {E("; ".join(e["sources"]))}.</p></section>')
    nav = []
    if prev:
        nav.append(f'<a class="amj-link" href="{{{{ root }}}}jalsa-salana/{prev["year"]}/"><i class="ph ph-arrow-left"></i> Jalsa {prev["year"]}</a>')
    nav.append('<a class="amj-link" href="{{ root }}jalsa-salana/">Tutte le edizioni</a>')
    if nxt:
        nav.append(f'<a class="amj-link" href="{{{{ root }}}}jalsa-salana/{nxt["year"]}/">Jalsa {nxt["year"]} <i class="ph ph-arrow-right"></i></a>')
    b.append(f'<section class="amj-w" style="padding-bottom:var(--s-700)"><p style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem">{"".join(nav)}</p></section>')
    return meta + "\n".join(b) + "\n"


def hub():
    head = """---
title: Jalsa Salana Italia
h1: Jalsa Salana Italia
eyebrow: Il convegno annuale
lead: Tre giorni di preghiera, riflessione e incontro, aperti a chi vuole conoscere la Comunità.
description: Il convegno annuale della Comunità Islamica Ahmadiyya in Italia: prossima edizione e archivio delle edizioni dal 2013 al 2026, con programma, interventi, ospiti e presenze.
path: jalsa-salana/index.html
crumbs: <a href="{{ root }}index.html">Home</a> › Jalsa Salana
---
<section class="amj-s"><div class="amj-w">
<div class="amj-jhero">
<div class="amj-prose">
<p>La Jalsa Salana è il convegno annuale della Comunità. Per tre giorni i membri si riuniscono per pregare, ascoltare gli interventi e incontrarsi. Una parte del programma è dedicata agli ospiti: rappresentanti delle istituzioni, del mondo accademico e di altre fedi.</p>
<p>Il programma include anche momenti di dialogo con i partecipanti. <a href="https://www.alislam.it/cosa-e-jalsa-salana/" target="_blank" rel="noopener">Che cos’è la Jalsa Salana</a>: la scheda storica su alislam.it.</p>
</div>
<img src="{{ assets }}img/dept/jalsa-salana.webp" width="230" height="435" alt="Logo della Jalsa Salana Italia">
</div></div></section>

<section class="amj-w" style="padding-bottom:var(--s-700)">
<div class="amj-jnext"><div><p class="amj-eyebrow">Prossima edizione</p><b>11–13 giugno 2027</b><span>Date proposte, in attesa di conferma.</span></div>
<a class="amj-btn" href="{{ site.whatsapp_link }}"><i class="ph ph-whatsapp-logo"></i> Chiedi informazioni su WhatsApp</a></div>
</section>
"""
    out = [head]
    out.append('<section class="amj-pat" style="border-top:1px solid var(--amj-line);border-bottom:1px solid var(--amj-line)"><div class="amj-w amj-s">')
    out.append('<p class="amj-eyebrow">Archivio</p><h2 style="margin-bottom:var(--s-400)">Le edizioni italiane, anno per anno</h2>')
    out.append('<div class="amj-jed">')
    for e in eds:
        y = e["year"]
        facts = []
        if e.get("rep"):
            facts.append(f"Dal Markaz: {E(rep_short(e))}")
        if e.get("attendance"):
            facts.append(f"{e['attendance']['total']} presenze")
        speakers = len([i for d in e["program"] for i in d["items"] if i[2]]) if e["program"] else 0
        if speakers:
            facts.append(f"{speakers} interventi")
        theme = f'<h3 class="heading-5">{E(e["theme"].split(". Sessione")[0].split(" (")[0])}</h3>' if e.get("theme") and not e["theme"].startswith("Versetto") else f'<h3 class="heading-5">{E(e["venue"])}</h3>'
        out.append(f'<div class="amj-box"><p class="amj-eyebrow">{y} · {e["n"]} edizione · {E(e["dates"])}</p>{theme}')
        if facts:
            out.append("<p>" + " · ".join(facts) + "</p>")
        out.append(f'<p><a class="amj-link" href="{{{{ root }}}}jalsa-salana/{y}/">Programma, ospiti e dettagli <i class="ph ph-arrow-right"></i></a></p></div>')
    out.append("</div>")
    out.append('<p style="margin-top:var(--s-400);font-size:.9em">Per il 2012 (6ª edizione), il 2020 e il 2021 l’archivio non contiene ancora una scheda.</p>')
    out.append("</div></section>")
    # tabella presenze
    att = [e for e in sorted(eds, key=lambda x: x["year"]) if e.get("attendance")]
    out.append('<section class="amj-w amj-s"><p class="amj-eyebrow">In numeri</p><h2 style="margin-bottom:var(--s-400)">Presenze registrate</h2>')
    out.append('<div style="overflow-x:auto"><table style="border-collapse:collapse;min-width:360px"><thead><tr><th style="text-align:left;padding:.4rem 1rem .4rem 0">Anno</th><th style="text-align:left;padding:.4rem 1rem .4rem 0">Edizione</th><th style="text-align:left;padding:.4rem 0">Presenze</th></tr></thead><tbody>')
    for e in att:
        out.append(f'<tr style="border-top:1px solid var(--amj-line)"><td style="padding:.4rem 1rem .4rem 0"><a class="amj-link" href="{{{{ root }}}}jalsa-salana/{e["year"]}/">{e["year"]}</a></td><td style="padding:.4rem 1rem .4rem 0">{e["n"]}</td><td style="padding:.4rem 0">{e["attendance"]["total"]}</td></tr>')
    out.append('</tbody></table></div><p style="margin-top:var(--s-300);font-size:.9em">Dati dei rapporti ufficiali di ogni edizione. Nei rapporti 2015–2019 e 2024–2025 il conteggio è fornito dagli organizzatori.</p></section>')
    # rappresentanti Markaz
    reps = [e for e in sorted(eds, key=lambda x: x["year"]) if e.get("rep")]
    out.append('<section class="amj-pat" style="border-top:1px solid var(--amj-line);border-bottom:1px solid var(--amj-line)"><div class="amj-w amj-s"><p class="amj-eyebrow">Dal Markaz</p><h2 style="margin-bottom:var(--s-400)">I rappresentanti speciali di Hazrat Khalifatul Masih V (aba)</h2><ul style="padding-left:1.1rem">')
    for e in reps:
        out.append(f'<li><b>{e["year"]}</b> — {"; ".join(E(x) for x in e["rep"])}</li>')
    out.append("</ul></div></section>")
    # CTA
    out.append("""
<section class="amj-w amj-s"><div class="amj-final amj-patdark"><h2>Vuoi partecipare o invitarci?</h2>
<p>Scrivici su WhatsApp o chiama il numero verde. Ti rispondiamo con le informazioni più aggiornate.</p>
<div class="amj-cta2"><a class="amj-btn lg" href="{{ site.whatsapp_link }}"><i class="ph ph-whatsapp-logo"></i> WhatsApp</a><a class="amj-btn3" href="tel:{{ site.toll_free|replace(' ','') }}"><i class="ph ph-phone"></i> Numero verde {{ site.toll_free }}</a></div></div></section>
""")
    return "\n".join(out)


(PAGES / "jalsa-salana.html").write_text(hub(), encoding="utf-8")
asc = sorted(eds, key=lambda x: x["year"])
for i, e in enumerate(asc):
    prev = asc[i - 1] if i else None
    nxt = asc[i + 1] if i + 1 < len(asc) else None
    (PAGES / f"jalsa-{e['year']}.html").write_text(year_page(e, prev, nxt), encoding="utf-8")
print("Generate", len(asc) + 1, "pagine")

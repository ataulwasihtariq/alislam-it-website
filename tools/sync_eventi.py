#!/usr/bin/env python3
"""Aggiorna l'elenco eventi da un calendario Google PUBBLICO (indirizzo iCal).
Uso:  python3 tools/sync_eventi.py "https://calendar.google.com/calendar/ical/<ID>/public/basic.ics"
Scrive src/eventi_sync.json; poi copiare le voci in EVENTS di src/site.py (o importarle) e ricostruire.
Consiglio: usare un calendario pubblico a parte («Eventi pubblici»), non il calendario interno."""
import json, re, sys, urllib.request, datetime as dt

def parse(ics):
    ev, cur = [], None
    for line in re.sub(r"\r?\n[ \t]", "", ics).splitlines():
        if line == "BEGIN:VEVENT": cur = {}
        elif line == "END:VEVENT" and cur is not None:
            if cur.get("DTSTART") and cur.get("SUMMARY"):
                s = dt.datetime.strptime(cur["DTSTART"][:8], "%Y%m%d").date()
                e = dt.datetime.strptime((cur.get("DTEND") or cur["DTSTART"])[:8], "%Y%m%d").date() - dt.timedelta(days=1)
                ev.append({"id": cur.get("UID", "").split("@")[0], "title": cur["SUMMARY"].replace("\\,", ","), "start": s.isoformat(),
                           **({"end": max(s, e).isoformat()} if e > s else {}), "kind": "Comunità",
                           "tentative": cur.get("STATUS") == "TENTATIVE", "desc": cur.get("DESCRIPTION", "").replace("\\n", " ").replace("\\,", ",")})
            cur = None
        elif cur is not None and ":" in line:
            k, v = line.split(":", 1); cur[k.split(";")[0]] = v
    return sorted(ev, key=lambda x: x["start"])

if __name__ == "__main__":
    data = urllib.request.urlopen(sys.argv[1]).read().decode("utf-8")
    out = parse(data)
    open("src/eventi_sync.json", "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False, indent=1))
    print(len(out), "eventi scritti in src/eventi_sync.json")

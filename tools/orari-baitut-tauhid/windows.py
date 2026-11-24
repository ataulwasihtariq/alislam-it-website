"""Finestre di preghiera giorno per giorno (astronomia, senza orari di Jama'at).
Uso: python3 windows.py 2026-01-01 2027-12-31 out.json
Valori in minuti dalla mezzanotte (ora di Roma). Inizi arrotondati per eccesso, fini per difetto,
cosi' ogni finestra mostrata sta dentro quella vera (margine di circa 1 minuto)."""
import sys, json, math, datetime as dt
import solar

def mins(t): return t.hour * 60 + t.minute + t.second / 60

def asr_start(date, noon_dt, n):
    jc = (solar._jd(date.year, date.month, date.day) + 0.5 - 2451545) / 36525
    decl, _ = solar._sun(jc)
    lat = math.radians(solar.LAT); d = math.radians(decl)
    alt = math.atan(1 / (n + math.tan(abs(lat - d))))
    ch = (math.sin(alt) - math.sin(lat) * math.sin(d)) / (math.cos(lat) * math.cos(d))
    H = math.degrees(math.acos(ch))
    return mins(noon_dt) + 4 * H

def day(date):
    t = solar.day_times(date)
    sr, noon, ss = mins(t['sunrise']), mins(t['noon']), mins(t['sunset'])
    fajr = sr - 90
    isha = ss + 90
    mid = ((ss + 1440 + fajr) / 2) % 1440 if False else (ss + (fajr + 1440 - ss) / 2)  # meta' notte: tramonto -> inizio Fajr
    c, f = math.ceil, math.floor
    return [c(fajr), f(sr), c(noon), c(asr_start(date, t['noon'], 1)), c(asr_start(date, t['noon'], 2)), f(ss), c(isha), f(mid - 1440 if mid >= 1440 else mid)]

if __name__ == '__main__':
    a, b, out = dt.date.fromisoformat(sys.argv[1]), dt.date.fromisoformat(sys.argv[2]), sys.argv[3]
    days = {}; d = a
    while d <= b: days[d.isoformat()] = day(d); d += dt.timedelta(1)
    data = {'place': 'San Pietro in Casale', 'unit': 'minuti da mezzanotte, ora di Roma',
            'fields': ['fajr_inizio', 'alba', 'zuhr_inizio', 'asr_ombra1', 'asr_ombra2', 'tramonto', 'isha_inizio', 'mezzanotte_islamica'],
            'days': days}
    json.dump(data, open(out, 'w'), separators=(',', ':'))
    print(len(days), 'giorni ->', out)

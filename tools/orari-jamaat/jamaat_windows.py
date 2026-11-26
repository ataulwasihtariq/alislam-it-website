"""Orari di preghiera per le Jama'at (senza unire le preghiere), giorno per giorno.
Uso: python3 jamaat_windows.py 2026-11-01 2027-12-31 ../../assets/data/orari-jamaat.json
Convenzioni (le stesse di Baitut Tauhid, decise dall'Imam):
  Fajr: da 90 minuti prima del sorgere del sole fino al sorgere (shuruq).
  Zuhr: dal mezzogiorno solare fino all'inizio dell'Asr.
  Asr: ombra uguale all'altezza dell'oggetto (hadith Muslim 958), fino al tramonto.
  Maghrib: dal tramonto fino all'inizio dell'Isha.
  Isha: 90 minuti dopo il tramonto (come la tabella di alislam.it), fino a meta' notte.
Minuti dalla mezzanotte, ora di Roma. Inizi arrotondati per eccesso, fini per difetto."""
import sys, json, math, datetime as dt
import solar

CITIES = {  # nome: (latitudine, longitudine). Bologna e San Pietro in Casale non sono in elenco (vedi Baitut Tauhid).
    'Parma': (44.8015, 10.3279), 'Brescia': (45.5416, 10.2118), 'Ravenna': (44.4184, 12.2035),
    'Venezia-Mestre': (45.4903, 12.2424), 'Padova': (45.4064, 11.8768), 'Trento': (46.0748, 11.1217),
    'Bolzano': (46.4983, 11.3548), 'Milano': (45.4642, 9.1900), 'Varese': (45.8206, 8.8251),
    'Como': (45.8081, 9.0852), 'Torino': (45.0703, 7.6869), 'Cuneo': (44.3845, 7.5427),
    'Firenze': (43.7696, 11.2558), 'Roma': (41.9028, 12.4964), 'Napoli': (40.8518, 14.2681), 'Catania': (37.5079, 15.0830)}

def mins(t): return t.hour * 60 + t.minute + t.second / 60

def asr(date, noon, lat_deg, n=1):
    jc = (solar._jd(date.year, date.month, date.day) + 0.5 - 2451545) / 36525
    decl, _ = solar._sun(jc)
    lat, d = math.radians(lat_deg), math.radians(decl)
    alt = math.atan(1 / (n + math.tan(abs(lat - d))))
    H = math.degrees(math.acos((math.sin(alt) - math.sin(lat) * math.sin(d)) / (math.cos(lat) * math.cos(d))))
    return noon + 4 * H

def day(date, lat, lon):
    t = solar.day_times(date, lat, lon)
    sr, noon, ss = mins(t['sunrise']), mins(t['noon']), mins(t['sunset'])
    fajr = sr - 90
    isha = ss + 90
    mid = ss + (fajr + 1440 - ss) / 2
    c, f = math.ceil, math.floor
    return [c(fajr), f(sr), c(noon), c(asr(date, noon, lat)), f(ss), c(isha), f(mid - 1440 if mid >= 1440 else mid)]

if __name__ == '__main__':
    a, b, out = dt.date.fromisoformat(sys.argv[1]), dt.date.fromisoformat(sys.argv[2]), sys.argv[3]
    n = (b - a).days + 1
    cities = {k: [day(a + dt.timedelta(i), la, lo) for i in range(n)] for k, (la, lo) in CITIES.items()}
    json.dump({'start': a.isoformat(), 'days': n, 'unit': 'minuti da mezzanotte, ora di Roma',
               'fields': ['fajr', 'shuruq', 'zuhr', 'asr', 'maghrib', 'isha', 'mezzanotte'],
               'cities': cities}, open(out, 'w'), separators=(',', ':'))
    print(len(cities), 'citta', n, 'giorni ->', out)

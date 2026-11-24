#!/usr/bin/env python3
"""Orari di preghiera Baitut Tauhid: controlla gli orari con l'astronomia, costruisce PDF + PNG + JSON per il sito.
Uso: python3 build.py [--config config.json] [--fonts DIR] [--out DIR] [--web FILE.json]
I font (Garamond Premier Pro, Al_Mushaf, Jameel Noori Nastaleeq) NON sono nel repository: vanno scaricati da Drive
(Private Signature > Fonts) in --fonts. Servono Google Chrome e pdftoppm."""
import sys, json, argparse, datetime as dt, subprocess, html as H
from pathlib import Path
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from solar import day_times

ap = argparse.ArgumentParser()
ap.add_argument('--config', default=str(HERE / 'config.json'))
ap.add_argument('--fonts', default=str(HERE / 'fonts'))
ap.add_argument('--out', default=str(HERE / 'out'))
ap.add_argument('--web', default=None)
A = ap.parse_args()
C = json.load(open(A.config, encoding='utf-8'))
OUT = Path(A.out).resolve(); OUT.mkdir(parents=True, exist_ok=True)
D = dt.date.fromisoformat
START, END = D(C['start']), D(C['end'])
ZUHR_ASR, JUMUAH, MAGHRIB_ISHA = C['zuhr_asr'], C['jumuah'], C['maghrib_isha']
BLOCKS = [(D(b['from']), D(b['to']), b['time']) for b in C['fajr_blocks']]
OVR = {o['date']: o for o in C.get('overrides', [])}
IT_WD = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom']
IT_MS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']
IT_ML = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']
UR_M = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر']
def tmin(s): return int(s[:2]) * 60 + int(s[3:])
def hm(x): x = int(round(x)); return f'{x // 60:02d}:{x % 60:02d}'
def mm(t): return t.hour * 60 + t.minute + t.second / 60
def fajr(d):
    for a, b, t in BLOCKS:
        if a <= d <= b: return t
    raise SystemExit(f'Fajr non definito per {d}')
def val(d, key, default):
    o = OVR.get(d.isoformat()); return (o or {}).get(key, default)

rows = []; d = START
while d <= END:
    t = day_times(d); sr, no, ss = mm(t['sunrise']), mm(t['noon']), mm(t['sunset'])
    f = val(d, 'fajr', fajr(d)); mi = val(d, 'maghrib_isha', MAGHRIB_ISHA); za = val(d, 'zuhr_asr', ZUHR_ASR); ju = val(d, 'jumuah', JUMUAH)
    assert tmin(f) - 5 >= sr - 90, (d, 'Fajr: adhan prima dell\'inizio vero')
    assert tmin(f) <= sr - 60, (d, 'Fajr troppo vicino all\'alba')
    assert tmin(mi) >= ss + 90, (d, 'Isha non ancora entrata')
    assert tmin(ju) > no and tmin(za) > no, (d, 'prima dello zawal')
    rows.append((d, f, za, ju, mi, sr, ss)); d += dt.timedelta(1)
print('tutti i', len(rows), 'giorni superano i controlli')

def period(lang):
    s, e = START, END
    if lang == 'it':
        a = f'{s.day} {IT_ML[s.month - 1]}' + (f' {s.year}' if s.year != e.year else '')
        return f'Dal {a} al {e.day} {IT_ML[e.month - 1]} {e.year}'
    a = f'{s.day} {UR_M[s.month - 1]}' + (f' {s.year}' if s.year != e.year else '')
    return f'{a} تا {e.day} {UR_M[e.month - 1]} {e.year}'
def short(d): return f'{d.day} {IT_MS[d.month - 1]}'
def fajr_rows():
    out = []
    for a, b, t in BLOCKS:
        a = max(a, START); b = min(b, END)
        if a > b: continue
        if a == b:
            il, ul = short(a), f'{a.day} {UR_M[a.month - 1]}'
        elif a.month == b.month:
            il, ul = f'{a.day} – {b.day} {IT_MS[b.month - 1]}', f'{a.day} تا {b.day} {UR_M[b.month - 1]}'
        else:
            il, ul = f'{short(a)} – {short(b)}', f'{a.day} {UR_M[a.month - 1]} تا {b.day} {UR_M[b.month - 1]}'
        out.append(f'   <div class="row"><div class="l">{il}</div><div class="t">{t}</div><div class="r"><span class="ur">{ul}</span></div></div>')
    return '\n'.join(out)
def fridays():
    groups = {}
    for r in rows:
        x = r[0]
        if x.weekday() == 4: groups.setdefault(x.month, []).append(x.day)
    return ' · '.join(', '.join(map(str, v)) + ' ' + IT_MS[k - 1] for k, v in groups.items())
def daily_html():
    out = []
    for d, f, za, ju, mi, sr, ss in rows:
        fri = d.weekday() == 4
        mid = f'<b>Jumu\'ah {ju}</b> <span class="ur">جمعہ</span>' if fri else za
        star = '*' if d.isoformat() in OVR else ''
        out.append(f'<tr{" class=fri" if fri else ""}><td class="dt">{IT_WD[d.weekday()]} {d.day} {IT_MS[d.month - 1]}{star}</td><td>{f}</td><td>{mid}</td><td>{mi}</td><td class="sun">{hm(sr)}</td><td class="sun">{hm(ss)}</td></tr>')
    return '\n'.join(out)
def quote():
    Q = json.load(open(HERE / 'quotes.json', encoding='utf-8')); ym = START.strftime('%Y-%m')
    return next((x for x in Q if x['month'] == ym), Q[(START.month - 1) % len(Q)])
def page3():
    q = quote(); blocks = ''
    for i, it in enumerate(q['items']):
        blocks += (f'<div class="q{" k" if i else ""}"><div class="kind"><span class="it">{H.escape(it["kind_it"])}</span><span class="ur">{H.escape(it["kind_ur"])}</span></div>'
                   f'<div class="ur big">{H.escape(it["ur"])}</div><div class="itx">«{H.escape(it["it"])}»</div>'
                   f'<div class="ref">{H.escape(it["ref_it"])}</div><div class="ur refu">{H.escape(it["ref_ur"])}</div></div>')
    return ('<section class="page p3"><div class="hd" style="padding:6mm 12mm 5mm"><div class="ar">بِسۡمِ اللّٰہِ الرَّحۡمٰنِ الرَّحِیۡمِ</div>'
            '<div class="place" style="margin:0">Baitut Tauhid · San Pietro in Casale</div>'
            f'<div style="font-size:21pt">{H.escape(q["title_it"])}</div><div class="ur">{H.escape(q["title_ur"])}</div></div>'
            + blocks + '<div class="endnote">Ogni mese un nuovo hadith e un nuovo riferimento · Baitut Tauhid</div></section>')

pub = D(C['published_on'])
T = (HERE / 'template.html').read_text(encoding='utf-8')
subs = {'FONTS': 'file://' + str(Path(A.fonts).resolve()), 'PERIOD_SHORT': f'{short(START)}–{short(END)} {END.year}', 'PERIOD_IT': period('it'), 'PERIOD_UR': period('ur'),
        'FAJR_ROWS': fajr_rows(), 'FRIDAYS': fridays(), 'ZUHR_ASR': ZUHR_ASR, 'JUMUAH': JUMUAH, 'MAGHRIB_ISHA': MAGHRIB_ISHA,
        'TODAY_IT': f'{pub.day} {IT_ML[pub.month - 1]} {pub.year}', 'DAILY': daily_html(), 'PAGE3': page3()}
for k, v in subs.items(): T = T.replace('{{' + k + '}}', v)
if OVR:
    T = T.replace('Venerdì evidenziato.', 'Venerdì evidenziato. * ' + '; '.join(f'{short(D(k))}: {o.get("label_it", "orario speciale")}' for k, o in OVR.items()) + '.')
stem = f'Orari_Baitut_Tauhid_{START.isoformat()}_{END.isoformat()}'
html_path = OUT / (stem + '.html'); html_path.write_text(T, encoding='utf-8')
pdf = OUT / (stem + '.pdf')
subprocess.run(['google-chrome', '--headless=new', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={pdf}', f'file://{html_path}'], check=True, capture_output=True, timeout=180)
subprocess.run(['pdftoppm', '-r', '150', '-png', '-f', '1', '-l', '1', '-singlefile', str(pdf), str(OUT / 'whatsapp-orari')], check=True)
subprocess.run(['pdftoppm', '-r', '150', '-png', '-f', '3', '-l', '3', '-singlefile', str(pdf), str(OUT / 'whatsapp-pensiero')], check=True)
print('PDF:', pdf)

if A.web:
    periods = [{'from': a.isoformat(), 'to': b.isoformat(), 'fajr': t, 'zuhr_asr': ZUHR_ASR, 'jumuah': JUMUAH, 'maghrib_isha': MAGHRIB_ISHA} for a, b, t in BLOCKS]
    web = {'place': 'Baitut Tauhid · San Pietro in Casale', 'updated': C['published_on'], 'start': START.isoformat(), 'end': END.isoformat(),
           'periods': periods, 'overrides': C.get('overrides', []),
           'pdf': 'orari/orari-baitut-tauhid.pdf', 'image': 'orari/orari-baitut-tauhid.png', 'quote_image': 'orari/pensiero-del-mese.png', 'quote': quote()}
    Path(A.web).write_text(json.dumps(web, ensure_ascii=False, indent=1), encoding='utf-8'); print('JSON:', A.web)

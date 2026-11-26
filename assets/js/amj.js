/* alislam.it – script senza dipendenze: menu, comparsa delle sezioni, frase di apertura,
   orari del Ramadan (scelta della città, tabella, calendario .ics) ed eventi. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  };

  /* menu */
  var b = $('.amj-burger'), n = $('.amj-nav');
  if (b && n) {
    $$('.amj-nav > a, .amj-nav > .amj-dd').forEach(function (el, i) { el.style.setProperty('--i', Math.min(i, 6)); });
    var close = function () { n.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); document.body.classList.remove('amj-lock'); };
    b.addEventListener('click', function () {
      var open = n.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('amj-lock', open);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    $$('.amj-nav a').forEach(function (a) { a.addEventListener('click', close); });
  }

  /* comparsa delle sezioni, una volta sola */
  var rv = $$('.amj-rv');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* frase di apertura: una parola alla volta */
  $$('.amj-reveal p').forEach(function (p) {
    var words = p.textContent.trim().split(/\s+/);
    p.textContent = '';
    var spans = words.map(function (w, i) {
      var s = document.createElement('span'); s.className = 'w'; s.textContent = w; p.appendChild(s);
      if (i < words.length - 1) p.appendChild(document.createTextNode(' '));
      return s;
    });
    if (reduce || !('IntersectionObserver' in window)) { spans.forEach(function (s) { s.classList.add('on'); }); return; }
    var wo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('on', e.isIntersecting || e.boundingClientRect.top < 0); });
    }, { rootMargin: '0px 0px -40% 0px', threshold: 0 });
    spans.forEach(function (s) { wo.observe(s); });
  });

  /* ---------- Ramadan ---------- */
  var DAYS = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'], MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
  var FULLD = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'], FULLM = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var hm = function (m) { return Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2); };
  var pad = function (x) { return ('0' + x).slice(-2); };
  function dayOf(base, i) { var d = new Date(Date.UTC(base[0], base[1] - 1, base[2] + i)); return d; }
  function rome(d) { var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d).split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }


  /* ---------- Calcolo degli orari di preghiera nel browser (algoritmo NOAA / Meeus, margine circa 1 minuto) ---------- */
  var PT = (function () {
    var R = Math.PI / 180, DG = 180 / Math.PI;
    function jd(y, m, d) { if (m <= 2) { y -= 1; m += 12; } var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }
    function sun(jc) {
      var L0 = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360, M = 357.52911 + jc * (35999.05029 - 0.0001537 * jc), e = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
      var C = Math.sin(M * R) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) + Math.sin(2 * M * R) * (0.019993 - 0.000101 * jc) + Math.sin(3 * M * R) * 0.000289;
      var om = 125.04 - 1934.136 * jc, app = L0 + C - 0.00569 - 0.00478 * Math.sin(om * R);
      var eps0 = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60, eps = eps0 + 0.00256 * Math.cos(om * R);
      var decl = Math.asin(Math.sin(eps * R) * Math.sin(app * R)) * DG, y = Math.pow(Math.tan(eps * R / 2), 2);
      var eot = 4 * DG * (y * Math.sin(2 * L0 * R) - 2 * e * Math.sin(M * R) + 4 * e * y * Math.sin(M * R) * Math.cos(2 * L0 * R) - 0.5 * y * y * Math.sin(4 * L0 * R) - 1.25 * e * e * Math.sin(2 * M * R));
      return [decl, eot];
    }
    function solve(y, m, d, lat, lon, ev, zen) {
      var t = 0.5, mins = 0;
      for (var i = 0; i < 4; i++) {
        var s = sun((jd(y, m, d) + t - 2451545) / 36525), decl = s[0], eot = s[1];
        var c = Math.cos(zen * R) / (Math.cos(lat * R) * Math.cos(decl * R)) - Math.tan(lat * R) * Math.tan(decl * R);
        var ha = Math.acos(Math.max(-1, Math.min(1, c))) * DG, noon = 720 - 4 * lon - eot;
        mins = ev === 'noon' ? noon : (ev === 'rise' ? noon - 4 * ha : noon + 4 * ha); t = mins / 1440;
      }
      return mins;
    }
    function tzOff(y, m, d, tz) {
      var p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(Date.UTC(y, m - 1, d, 12)));
      var h = +p.filter(function (x) { return x.type === 'hour'; })[0].value, mi = +p.filter(function (x) { return x.type === 'minute'; })[0].value;
      return (h - 12) * 60 + mi;
    }
    /* valori in minuti dalla mezzanotte locale. Fajr = alba - 90; Isha = il piu' tardi tra tramonto + 90 e fine del crepuscolo rosso (15°). Il Maghrib non ha una finestra: si prega subito dopo il tramonto */
    function day(y, m, d, lat, lon, tz) {
      var o = tzOff(y, m, d, tz || 'Europe/Rome'), sr = solve(y, m, d, lat, lon, 'rise', 90.833) + o, ss = solve(y, m, d, lat, lon, 'set', 90.833) + o, no = solve(y, m, d, lat, lon, 'noon', 90.833) + o;
      var s = sun((jd(y, m, d) + 0.5 - 2451545) / 36525), la = lat * R, de = s[0] * R, alt = Math.atan(1 / (1 + Math.tan(Math.abs(la - de))));
      var H = Math.acos((Math.sin(alt) - Math.sin(la) * Math.sin(de)) / (Math.cos(la) * Math.cos(de))) * DG, fa = sr - 90, mid = ss + (fa + 1440 - ss) / 2;
      var sh = solve(y, m, d, lat, lon, 'set', 105) + o; /* Isha: non prima della fine del crepuscolo rosso (15°) e non prima di 90 minuti dopo il tramonto */
      return { fajr: Math.ceil(fa), sunrise: Math.floor(sr), zuhr: Math.ceil(no), asr: Math.ceil(no + 4 * H), maghrib: Math.floor(ss), isha: Math.ceil(Math.max(ss + 90, sh)), mid: Math.floor(mid >= 1440 ? mid - 1440 : mid) };
    }
    var CITIES = { 'Bologna': [44.4949, 11.3426], 'San Pietro in Casale': [44.7006, 11.4119], 'Parma': [44.8015, 10.3279], 'Brescia': [45.5416, 10.2118], 'Ravenna': [44.4184, 12.2035], 'Venezia-Mestre': [45.4903, 12.2424], 'Padova': [45.4064, 11.8768], 'Trento': [46.0748, 11.1217], 'Bolzano': [46.4983, 11.3548], 'Milano': [45.4642, 9.19], 'Varese': [45.8206, 8.8251], 'Como': [45.8081, 9.0852], 'Torino': [45.0703, 7.6869], 'Cuneo': [44.3845, 7.5427], 'Firenze': [43.7696, 11.2558], 'Roma': [41.9028, 12.4964], 'Napoli': [40.8518, 14.2681], 'Catania': [37.5079, 15.083] };
    return { day: day, CITIES: CITIES };
  })();

  var ram = $('[data-ram]');
  if (ram) {
    var url = ram.getAttribute('data-src');
    fetch(url, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (D) {
      var base = D.start.split('-').map(Number);
      /* orari calcolati qui, per le coordinate di ogni città (non copiati da una tabella) */
      var GROUPS = [{ label: 'Sedi della Comunità', items: ['Bologna', 'Parma', 'Brescia', 'Ravenna', 'Venezia-Mestre', 'Padova', 'Trento', 'Bolzano', 'Milano', 'Varese', 'Como', 'Torino', 'Cuneo', 'Firenze', 'Roma', 'Napoli', 'Catania'].map(function (k) { return { key: k, label: k, note: '' }; }) },
        { label: 'Altre località', items: [{ key: 'San Pietro in Casale', label: 'San Pietro in Casale', note: '' }] }];
      D.groups = GROUPS; D.cities = {};
      function buildCity(k, lat, lon, tz) {
        var c = { fajr: [], zuhr: [], asr: [], maghrib: [], isha: [] };
        for (var i = 0; i < D.days; i++) { var d0 = dayOf(base, i), x = PT.day(d0.getUTCFullYear(), d0.getUTCMonth() + 1, d0.getUTCDate(), lat, lon, tz); c.fajr.push(x.fajr); c.zuhr.push(x.zuhr); c.asr.push(x.asr); c.maghrib.push(x.maghrib); c.isha.push(x.isha); }
        D.cities[k] = c;
      }
      Object.keys(PT.CITIES).forEach(function (k) { buildCity(k, PT.CITIES[k][0], PT.CITIES[k][1]); });
      var cityKeys = Object.keys(D.cities);
      var sels = $$('[data-ram-city]');
      var cur = store.get('amj-city');
      if (!D.cities[cur]) cur = D.default;
      sels.forEach(function (sel) {
        sel.innerHTML = D.groups.map(function (g) { return '<optgroup label="' + g.label + '">' + g.items.map(function (it) { return '<option value="' + it.key + '">' + it.label + '</option>'; }).join('') + '</optgroup>'; }).join('');
        sel.value = cur;
        sel.addEventListener('change', function () { cur = sel.value; store.set('amj-city', cur); sels.forEach(function (o) { o.value = cur; }); render(); });
      });
      function row(c, i) { var f = c.fajr[i], m = c.maghrib[i]; return { fajr: f, alba: f + 90, zuhr: c.zuhr[i], asr: c.asr[i], maghrib: m, isha: c.isha[i] }; }
      function cityInfo() { var it = null; D.groups.forEach(function (g) { g.items.forEach(function (x) { if (x.key === cur) it = x; }); }); return it; }
      function render() {
        var c = D.cities[cur], info = cityInfo(), todayMs = rome(new Date()), first = Date.UTC(base[0], base[1] - 1, base[2]);
        var idx = Math.round((todayMs - first) / 864e5), label, past = false;
        if (idx < 1) { idx = 1; label = 'Primo giorno previsto: ' + FULLD[dayOf(base, 1).getUTCDay()] + ' ' + dayOf(base, 1).getUTCDate() + ' ' + FULLM[dayOf(base, 1).getUTCMonth()] + ' ' + dayOf(base, 1).getUTCFullYear(); }
        else if (idx > D.days - 1) { idx = D.days - 1; past = true; label = 'Ultimo giorno del calendario (9 marzo)'; }
        else { var dd = dayOf(base, idx); label = 'Oggi, ' + FULLD[dd.getUTCDay()] + ' ' + dd.getUTCDate() + ' ' + FULLM[dd.getUTCMonth()]; }
        var t = row(c, idx);
        $$('[data-ram-today]').forEach(function (box) {
          box.innerHTML = '<p class="amj-tnote" style="margin:0 0 12px;font-weight:600;color:var(--amj-green-d)">' + label + ' · ' + info.label.replace(/ \(.*/, '') + '</p>' +
            '<div class="amj-tgrid"><div class="hot"><small>Fine del suhūr (Fajr)</small><b>' + hm(t.fajr) + '</b></div><div><small>Alba</small><b>' + hm(t.alba) + '</b></div><div><small>Zuhr</small><b>' + hm(t.zuhr) + '</b></div>' +
            '<div><small>Asr</small><b>' + hm(t.asr) + '</b></div><div class="hot"><small>Iftar (Maghrib)</small><b>' + hm(t.maghrib) + '</b></div><div><small>Isha</small><b>' + hm(t.isha) + '</b></div></div>' +
            (info.note ? '<p class="amj-tnote">' + info.note + '</p>' : '');
        });
        var tb = $('[data-ram-table]');
        if (tb) {
          var html = '';
          for (var i = 1; i < D.days; i++) {
            var d = dayOf(base, i), r = row(c, i), isT = (i === idx && !past && todayMs >= first + 864e5 && todayMs <= first + (D.days - 1) * 864e5);
            html += '<tr' + (isT ? ' class="today"' : '') + '><td>' + i + ' · ' + DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + '</td><td class="hot">' + hm(r.fajr) + '</td><td>' + hm(r.alba) + '</td><td>' + hm(r.zuhr) + '</td><td>' + hm(r.asr) + '</td><td class="hot">' + hm(r.maghrib) + '</td><td>' + hm(r.isha) + '</td></tr>';
          }
          tb.innerHTML = html;
        }
        $$('[data-ram-cityname]').forEach(function (e) { e.textContent = info.label; });
      }
      render();
      var ics = $('[data-ram-ics]');
      if (ics) ics.addEventListener('click', function () {
        var c = D.cities[cur], info = cityInfo(), city = info.label.replace(/ \(.*/, ''), L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//alislam.it//Ramadan 2027//IT', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Ramadan 2027 · ' + city];
        function utc(d, min) { var t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, min - 60); var x = new Date(t); return x.getUTCFullYear() + pad(x.getUTCMonth() + 1) + pad(x.getUTCDate()) + 'T' + pad(x.getUTCHours()) + pad(x.getUTCMinutes()) + '00Z'; }
        for (var i = 1; i < D.days; i++) {
          var d = dayOf(base, i), r = row(c, i);
          [['Fine del suhūr (Fajr)', r.fajr, 10, 0], ['Iftar (Maghrib)', r.maghrib, 15, 15]].forEach(function (e) {
            L.push('BEGIN:VEVENT', 'UID:ramadan2027-' + cur.replace(/\W/g, '') + '-' + i + '-' + e[3] + '@alislam.it', 'DTSTAMP:20261124T000000Z', 'DTSTART:' + utc(d, e[1]), 'DTEND:' + utc(d, e[1] + e[2]),
              'SUMMARY:' + e[0] + ' · Ramadan ' + i + ' · ' + city, 'DESCRIPTION:Orari calcolati per la località (algoritmo NOAA). Data del Ramadan da confermare con l’annuncio della Comunità.');
            if (e[3]) L.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Iftar tra ' + e[3] + ' minuti', 'TRIGGER:-PT' + e[3] + 'M', 'END:VALARM');
            L.push('END:VEVENT');
          });
        }
        L.push('END:VCALENDAR');
        var blob = new Blob([L.join('\r\n')], { type: 'text/calendar;charset=utf-8' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'ramadan-2027-' + city.toLowerCase().replace(/\W+/g, '-') + '.ics'; document.body.appendChild(a); a.click(); a.remove();
      });
      var pr = $('[data-ram-print]'); if (pr) pr.addEventListener('click', function () { window.print(); });
      $$('[data-ram-count]').forEach(function (box) {
        var start = Date.UTC(base[0], base[1] - 1, base[2] + 1), days = Math.ceil((start - rome(new Date())) / 864e5);
        box.innerHTML = days > 0 ? '<div><b>' + days + '</b><small>' + (days === 1 ? 'giorno' : 'giorni') + ' all’inizio previsto</small></div>' : '';
      });
    }).catch(function () {
      $$('[data-ram-today]').forEach(function (b) { b.innerHTML = '<p class="amj-tnote">Gli orari non si caricano. Consulta la tabella ufficiale su alislam.it/orario-delle-preghiere.</p>'; });
    });
  }

  /* ---------- Eventi ---------- */
  var FULLM = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var DAY = 86400000;
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pd(s) { var p = s.slice(0, 10).split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function norm(D) {
    return D.events.map(function (e) { e.s = pd(e.start); e.e = e.end ? pd(e.end) : e.s; return e; })
      .sort(function (a, b) { return a.s - b.s || a.e - b.e; });
  }
  function range(e) {
    var a = new Date(e.s), b = new Date(e.e), A = a.getUTCDate() + ' ' + MONTHS[a.getUTCMonth()];
    if (e.e === e.s) return FULLD[a.getUTCDay()] + ' ' + A;
    return a.getUTCMonth() === b.getUTCMonth() ? a.getUTCDate() + '–' + b.getUTCDate() + ' ' + MONTHS[b.getUTCMonth()] : A + ' – ' + b.getUTCDate() + ' ' + MONTHS[b.getUTCMonth()];
  }
  function icsFor(e) {
    var s = new Date(e.s).toISOString().slice(0, 10).replace(/-/g, ''), nx = new Date(e.e + DAY).toISOString().slice(0, 10).replace(/-/g, '');
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//alislam.it//Eventi//IT', 'BEGIN:VEVENT', 'UID:' + e.id + '@alislam.it', 'DTSTAMP:20261124T000000Z', 'DTSTART;VALUE=DATE:' + s, 'DTEND;VALUE=DATE:' + nx, 'SUMMARY:' + e.title + (e.tentative ? ' (data da confermare)' : ''), 'STATUS:' + (e.tentative ? 'TENTATIVE' : 'CONFIRMED')];
    if (e.place || e.city) L.push('LOCATION:' + [e.place, e.city].filter(Boolean).join(', '));
    if (e.desc) L.push('DESCRIPTION:' + e.desc);
    L.push('END:VEVENT', 'END:VCALENDAR');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([L.join('\r\n')], { type: 'text/calendar;charset=utf-8' })); a.download = e.id + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function when(e, today) {
    if (e.s <= today && today <= e.e) return 'In corso';
    var n = Math.round((e.s - today) / DAY);
    return n === 1 ? 'Domani' : 'Tra ' + n + ' giorni';
  }
  var evApp = $('[data-ev-app]'), evNext = $('[data-ev-next]');
  if (evApp || evNext) {
    var src = (evApp || evNext).getAttribute('data-src');
    fetch(src, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (D) {
      var today = rome(new Date()), all = norm(D), up = all.filter(function (e) { return e.e >= today; });
      if (evNext) {
        var nx = up.slice(0, 3);
        evNext.innerHTML = nx.length ? nx.map(function (e) {
          var d = new Date(e.s);
          return '<a class="amj-nx" href="' + evNext.getAttribute('data-href') + '"><span class="d"><b>' + d.getUTCDate() + '</b><small>' + MONTHS[d.getUTCMonth()] + '</small></span><span><small>' + esc(e.kind) + ' · ' + when(e, today) + '</small><b>' + esc(e.title) + '</b></span></a>';
        }).join('') : '<p class="amj-tnote">Nessun evento in programma per ora.</p>';
      }
      if (!evApp) return;
      if (!up.length) { evApp.innerHTML = '<div class="amj-empty"><p class="body-2" style="margin:0 0 8px">Nessun evento in programma per ora.</p><p style="margin:0">Scrivici su WhatsApp per sapere che cosa si organizza.</p></div>'; return; }
      var kinds = []; up.forEach(function (e) { if (kinds.indexOf(e.kind) < 0) kinds.push(e.kind); });
      var state = { kind: 'all', ym: new Date(up[0].s).getUTCFullYear() * 12 + new Date(up[0].s).getUTCMonth() };
      var f = up.filter(function (e) { return !e.minor; })[0] || up[0];
      var html = '<div class="amj-evf"><div><p class="amj-eyebrow">Prossimo appuntamento</p><h2 class="heading-4">' + esc(f.title) + '</h2><p class="amj-evf-m">' + range(f) + (f.tentative ? ' · data da confermare' : '') + '</p>' + (f.desc ? '<p>' + esc(f.desc) + '</p>' : '') + '<button class="amj-btn" type="button" data-ics-id="' + esc(f.id) + '"><i class="ph ph-calendar-plus"></i> Aggiungi al calendario</button></div><div class="amj-evf-c"><b>' + when(f, today) + '</b><small>' + esc(f.kind) + '</small></div></div>';
      html += '<div class="amj-evgrid"><div><div class="amj-chips2" role="group" aria-label="Filtra gli eventi"><button class="amj-chip" type="button" data-k="all" aria-pressed="true">Tutti</button>' + kinds.map(function (k) { return '<button class="amj-chip" type="button" data-k="' + esc(k) + '" aria-pressed="false">' + esc(k) + '</button>'; }).join('') + '</div><div data-ev-list></div></div><aside class="amj-mcal"><div class="amj-mcal-h"><button type="button" data-m="-1" aria-label="Mese precedente">&#8249;</button><b data-mt></b><button type="button" data-m="1" aria-label="Mese successivo">&#8250;</button></div><div class="amj-mcal-g" data-mg></div><p class="amj-tnote">I giorni con un punto hanno un evento.</p></aside></div>';
      evApp.innerHTML = html;
      function list() {
        var rows = up.filter(function (e) { return state.kind === 'all' || e.kind === state.kind; }), out = '', cur = '';
        rows.forEach(function (e) {
          var d = new Date(e.s), key = d.getUTCFullYear() + '-' + d.getUTCMonth();
          if (key !== cur) { cur = key; out += '<h3 class="amj-evm">' + FULLM[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + '</h3>'; }
          var dd = e.e !== e.s ? '<b>' + d.getUTCDate() + '–' + new Date(e.e).getUTCDate() + '</b>' : '<b>' + d.getUTCDate() + '</b>';
          out += '<article class="amj-ev"><div class="d">' + dd + '<small>' + MONTHS[d.getUTCMonth()] + '</small></div><div><span class="amj-pill">' + (e.tentative ? 'Data da confermare' : esc(e.kind)) + '</span><h3 style="margin-top:8px">' + esc(e.title) + '</h3><p>' + range(e) + (e.place ? ' · ' + esc(e.place) : '') + (e.city ? ' · ' + esc(e.city) : '') + '</p>' + (e.desc ? '<p style="margin-top:4px">' + esc(e.desc) + '</p>' : '') + '</div><div class="act">' + (e.url ? '<a class="amj-btn2" href="' + esc(e.url) + '">Dettagli</a> ' : '') + '<button class="amj-btn2" type="button" data-ics-id="' + esc(e.id) + '"><i class="ph ph-calendar-plus"></i> Calendario</button></div></article>';
        });
        $('[data-ev-list]', evApp).innerHTML = out || '<p class="amj-tnote">Nessun evento in questa categoria.</p>';
      }
      function cal() {
        var y = Math.floor(state.ym / 12), m = state.ym % 12, first = new Date(Date.UTC(y, m, 1)), lead = (first.getUTCDay() + 6) % 7, n = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
        $('[data-mt]', evApp).textContent = FULLM[m] + ' ' + y;
        var g = ['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(function (x) { return '<span class="h">' + x + '</span>'; }).join('');
        for (var i = 0; i < lead; i++) g += '<span></span>';
        for (var d = 1; d <= n; d++) {
          var t = Date.UTC(y, m, d), has = up.some(function (e) { return e.s <= t && t <= e.e && (state.kind === 'all' || e.kind === state.kind); });
          g += '<span class="' + (t === today ? 'td ' : '') + (has ? 'ev' : '') + '">' + d + '</span>';
        }
        $('[data-mg]', evApp).innerHTML = g;
      }
      list(); cal();
      evApp.addEventListener('click', function (ev) {
        var t = ev.target.closest('button'); if (!t) return;
        if (t.hasAttribute('data-k')) { state.kind = t.getAttribute('data-k'); $$('[data-k]', evApp).forEach(function (c) { c.setAttribute('aria-pressed', c === t ? 'true' : 'false'); }); list(); cal(); }
        else if (t.hasAttribute('data-m')) { state.ym += +t.getAttribute('data-m'); cal(); }
        else if (t.hasAttribute('data-ics-id')) { var id = t.getAttribute('data-ics-id'); all.some(function (e) { if (e.id === id) { icsFor(e); return true; } return false; }); }
      });
    }).catch(function () {
      var m = '<div class="amj-empty">Gli eventi non si caricano. Riprova più tardi.</div>';
      if (evApp) evApp.innerHTML = m; if (evNext) evNext.innerHTML = '';
    });
  }


  /* ---------- Baitut Tauhid: orari della moschea, scelti in base alla data di oggi ---------- */
  var btBoxes = $$('[data-bt]');
  if (btBoxes.length) {
    fetch(btBoxes[0].getAttribute('data-src'), { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (B) {
      var iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      var dow = new Date(iso + 'T12:00:00Z').getUTCDay(), dd = iso.split('-').map(Number);
      var P = null; B.periods.forEach(function (x) { if (iso >= x.from && iso <= x.to) P = x; });
      var O = null; (B.overrides || []).forEach(function (x) { if (x.date === iso) O = x; });
      var label = 'Oggi, ' + FULLD[dow] + ' ' + dd[2] + ' ' + FULLM[dd[1] - 1];
      var base = P, stale = false;
      if (!P) { stale = true; base = iso < B.periods[0].from ? B.periods[0] : B.periods[B.periods.length - 1]; label = iso < B.periods[0].from ? 'Orari dal ' + B.periods[0].from.split('-').reverse().join('/') : 'Ultimo calendario pubblicato'; }
      var t = {}; ['fajr', 'zuhr_asr', 'jumuah', 'maghrib_isha'].forEach(function (k) { t[k] = (O && O[k]) || base[k]; });
      var fri = dow === 5, mid = fri ? ['Jumu‘ah', t.jumuah] : ['Zuhr + Asr', t.zuhr_asr];
      var html = '<p class="amj-tnote" style="margin:0 0 12px;font-weight:600;color:var(--amj-green-d)">' + label + ' · ' + B.place + '</p>' +
        '<div class="amj-tgrid" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div class="hot"><small>Fajr</small><b>' + t.fajr + '</b></div><div><small>' + mid[0] + '</small><b>' + mid[1] + '</b></div>' +
        '<div class="hot"><small>Maghrib + Isha</small><b>' + t.maghrib_isha + '</b></div></div>' +
        (fri ? '<p class="amj-tnote">Il venerdì il Jumu‘ah è alle ' + t.jumuah + ' e l’Asr segue il Jumu‘ah.</p>' : '') +
        (O && O.label_it ? '<p class="amj-tnote" style="font-weight:600;color:var(--amj-gold-d)">Oggi: ' + O.label_it + '</p>' : '') +
        (stale ? '<p class="amj-tnote">Il calendario del periodo è in aggiornamento: fa fede l’ultimo PDF.</p>' : '');
      $$('[data-bt-today]').forEach(function (b) { b.innerHTML = html; });
      var tb = $('[data-bt-table]');
      if (tb) tb.innerHTML = B.periods.map(function (x) {
        var a = x.from.split('-').map(Number), z = x.to.split('-').map(Number);
        var r = a[2] + (a[1] !== z[1] ? ' ' + MONTHS[a[1] - 1] : '') + (x.from === x.to ? '' : ' – ' + z[2]) + ' ' + MONTHS[z[1] - 1];
        return '<tr' + (P === x ? ' class="today"' : '') + '><td>' + r + '</td><td class="hot">' + x.fajr + '</td><td>' + x.zuhr_asr + '</td><td>' + x.jumuah + '</td><td class="hot">' + x.maghrib_isha + '</td></tr>';
      }).join('');
      var sp = $('[data-bt-special]');
      if (sp) sp.innerHTML = (B.overrides && B.overrides.length) ? '<ul>' + B.overrides.map(function (o) {
        var z = o.date.split('-').map(Number);
        return '<li><b>' + z[2] + ' ' + FULLM[z[1] - 1] + '</b>: ' + (o.label_it || 'orario speciale') + ' — ' + ['fajr', 'zuhr_asr', 'jumuah', 'maghrib_isha'].filter(function (k) { return o[k]; }).map(function (k) { return { fajr: 'Fajr', zuhr_asr: 'Zuhr + Asr', jumuah: 'Jumu‘ah', maghrib_isha: 'Maghrib + Isha' }[k] + ' ' + o[k]; }).join(', ') + '</li>';
      }).join('') + '</ul>' : '<p class="amj-tnote">Nessun orario speciale in programma.</p>';
      var q = $('[data-bt-quote]');
      if (q && B.quote) q.innerHTML = B.quote.items.map(function (it) {
        return '<figure class="amj-btq"><figcaption>' + it.kind_it + '</figcaption><p lang="ur" dir="rtl" class="ur">' + it.ur + '</p><blockquote>«' + it.it + '»</blockquote><small>' + it.ref_it + '</small></figure>';
      }).join('');
      $$('[data-bt-updated]').forEach(function (e) { var u = B.updated.split('-').map(Number); e.textContent = u[2] + ' ' + FULLM[u[1] - 1] + ' ' + u[0]; });
      var root = btBoxes[0].getAttribute('data-src').replace(/data\/baitut-tauhid\.json.*$/, '');
      $$('[data-bt-pdf]').forEach(function (a) { a.href = root + B.pdf; });
      $$('[data-bt-img]').forEach(function (a) { a.href = root + B.image; });
    }).catch(function () {
      $$('[data-bt-today]').forEach(function (b) { b.innerHTML = '<p class="amj-tnote">Gli orari non si caricano. Chiedi gli orari del mese su WhatsApp.</p>'; });
    });
  }

  /* ---------- Baitut Tauhid: pianificatore eventi (finestre di preghiera per data) ---------- */
  var btp = $('[data-btp]');
  if (btp) {
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var hm = function (m) { m = Math.round(m); if (m >= 1440) m -= 1440; return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
    var toMin = function (s) { var z = s.split(':'); return +z[0] * 60 + +z[1]; };
    var todayIso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    var inp = $('[data-btp-date]', btp), out = $('[data-btp-out]', btp), chk = $('[data-btp-check]', btp), ttl = $('[data-btp-title]', btp);
    var evFrom = $('[data-btp-from]', btp), evTo = $('[data-btp-to]', btp);
    var W = null, B = null, cur = null;
    var shift = function (iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    var rows = function (iso) {
      var w = W.days[iso]; if (!w) return null;
      var dow = new Date(iso + 'T12:00:00Z').getUTCDay(), fri = dow === 5;
      var P = null; B.periods.forEach(function (x) { if (iso >= x.from && iso <= x.to) P = x; });
      var O = null; (B.overrides || []).forEach(function (x) { if (x.date === iso) O = x; });
      var t = null; if (P) { t = {}; ['fajr', 'zuhr_asr', 'jumuah', 'maghrib_isha'].forEach(function (k) { t[k] = (O && O[k]) || P[k]; }); }
      var mid = w[9]; var midEnd = mid < 600 ? mid + 1440 : mid;
      return [
        { n: 'Fajr', s: w[0], e: w[1], j: t && t.fajr, jl: t ? t.fajr : 'da definire', note: 'Fine: alba. L’Adhan non prima dell’inizio.' },
        { n: fri ? 'Jumu‘ah (al posto di Zuhr)' : 'Zuhr', s: w[2], e: w[3], j: t && (fri ? t.jumuah : t.zuhr_asr), jl: t ? (fri ? t.jumuah : t.zuhr_asr + ' (con l’Asr)') : 'da definire', note: 'Inizio: mezzogiorno solare (zawal). Fine: quando l’ombra è uguale all’altezza (' + hm(w[3]) + '); secondo Abu Hanifa fino a ombra doppia (' + hm(w[4]) + ').' + (fri ? ' Il Jumu‘ah va dopo lo zawal.' : '') },
        { n: 'Asr', s: w[3], e: w[5], j: t && (fri ? null : t.zuhr_asr), jl: t ? (fri ? 'segue il Jumu‘ah' : t.zuhr_asr + ' (con lo Zuhr)') : 'da definire', note: 'Inizio: ombra uguale all’altezza (' + hm(w[3]) + '); secondo Abu Hanifa ombra doppia (' + hm(w[4]) + '). Fine: tramonto; meglio prima che il sole ingiallisca.' },
        { n: 'Maghrib', s: w[5], e: w[5], nowin: true, j: t && t.maghrib_isha, jl: t ? t.maghrib_isha + ' (con l’Isha)' : 'da definire', note: 'Inizio: tramonto. Nessuna finestra: secondo l’hadith dell’imamato di Gabriele il Maghrib è nello stesso momento in entrambi i giorni, quindi si prega subito dopo il tramonto. Solo a Baitut Tauhid, con la regola dell’Imam, si unisce all’Isha.' },
        { n: 'Isha', s: Math.max(w[5] + 90, w[7]), e: midEnd, noend: true, j: t && t.maghrib_isha, jl: t ? t.maghrib_isha + ' (con il Maghrib)' : 'da definire', note: 'Inizio: il più tardi tra 90 minuti dopo il tramonto (' + hm(w[5] + 90) + ') e la scomparsa del crepuscolo rosso a 15° (' + hm(w[7]) + '). Secondo Abu Hanifa si aspetta il crepuscolo bianco (18°): ' + hm(w[8]) + '. Fine: nessun orario indicato.' }
      ].map(function (r) { r.ws = r.s; return r; });
    };
    var render = function (iso) {
      cur = iso; inp.value = iso;
      var dow = new Date(iso + 'T12:00:00Z').getUTCDay(), d = iso.split('-').map(Number);
      ttl.textContent = FULLD[dow] + ' ' + d[2] + ' ' + FULLM[d[1] - 1] + ' ' + d[0];
      var R = rows(iso);
      if (!R) { out.innerHTML = '<p class="amj-tnote">Data fuori dal periodo disponibile (2026–2027).</p>'; chk.textContent = ''; return; }
      var w = W.days[iso];
      out.innerHTML = '<div class="amj-twrap"><table class="amj-rtable amj-btp-t"><thead><tr><th>Preghiera</th><th>Inizio (awwal waqt)</th><th>Fine (ākhir waqt)</th><th>Jama‘at</th></tr></thead><tbody>' + R.map(function (r) {
        var l = Math.max(0, r.s / 1440 * 100), wd = (r.nowin || r.noend) ? 0.8 : Math.max(1.2, (Math.min(r.e, 1440) - r.s) / 1440 * 100);
        var mk = r.j ? '<i class="m" style="left:' + (toMin(r.j) / 1440 * 100) + '%"></i>' : '';
        return '<tr><td><b>' + r.n + '</b></td><td>' + hm(r.s) + '</td><td>' + (r.nowin || r.noend ? '—' : hm(r.e)) + '</td><td class="hot">' + r.jl + '</td></tr>' +
          '<tr class="bar"><td colspan="4"><div class="amj-btp-bar"><span style="left:' + l + '%;width:' + wd + '%"></span>' + mk + '</div><small>' + r.note + '</small></td></tr>';
      }).join('') + '</tbody></table></div><p class="amj-tnote">Alba ' + hm(w[1]) + ' · Mezzogiorno solare ' + hm(w[2]) + ' · Tramonto ' + hm(w[5]) + ' · Metà notte ' + hm(w[9]) + '. La linea verde è la finestra; il segno scuro è la Jama‘at.</p>';
      check();
    };
    var check = function () {
      if (!cur || !evFrom.value || !evTo.value) { chk.textContent = 'Inserisci l’orario di inizio e di fine.'; return; }
      var a = toMin(evFrom.value), b = toMin(evTo.value), R = rows(cur), msg = [];
      if (b <= a) { chk.textContent = 'L’orario di fine deve essere dopo l’inizio.'; return; }
      R.forEach(function (r) {
        if (r.j) { var j = toMin(r.j); if (j >= a && j < b) msg.push('<li>L’evento comprende la Jama‘at di <b>' + r.n + '</b> (' + r.j + ').</li>'); }
        else if (r.jl === 'da definire' && r.s < b && r.e > a) msg.push('<li>L’evento cade nella finestra di <b>' + r.n + '</b> (' + hm(r.s) + '–' + hm(r.e) + '): orario della Jama‘at da definire.</li>');
        if (r.nowin) { if (a < r.s && b > r.s) msg.push('<li>L’evento attraversa il tramonto (' + hm(r.s) + '): il <b>Maghrib</b> va pregato subito.</li>'); return; }
        if (a <= r.s && b >= r.e && r.e <= 1440) msg.push('<li>L’evento copre tutta la finestra di <b>' + r.n + '</b>: la preghiera va prevista durante l’evento.</li>');
      });
      chk.innerHTML = msg.length ? '<ul style="margin:0;padding-left:20px">' + msg.join('') + '</ul>' : 'Nessuna Jama‘at cade in questo orario.';
    };
    Promise.all([fetch(btp.getAttribute('data-wsrc')).then(function (r) { return r.json(); }), fetch(btp.getAttribute('data-src'), { cache: 'no-cache' }).then(function (r) { return r.json(); })]).then(function (x) {
      W = x[0]; B = x[1];
      var start = (todayIso >= inp.min && todayIso <= inp.max) ? todayIso : inp.min;
      render(start);
      inp.addEventListener('change', function () { if (inp.value) render(inp.value); });
      $('[data-btp-prev]', btp).addEventListener('click', function () { if (cur > inp.min) render(shift(cur, -1)); });
      $('[data-btp-next]', btp).addEventListener('click', function () { if (cur < inp.max) render(shift(cur, 1)); });
      $('[data-btp-today]', btp).addEventListener('click', function () { render(start); });
      evFrom.addEventListener('input', check); evTo.addEventListener('input', check);
    }).catch(function () { out.innerHTML = '<p class="amj-tnote">Gli orari non si caricano. Riprova più tardi.</p>'; });
  }


  /* ---------- Eventi: richiesta di una data, con controllo di preghiere e sovrapposizioni ---------- */
  var rq = $('[data-evreq]');
  if (rq) {
    var rf = $('form', rq), rc = $('[data-evreq-chk]', rq), rs = $('[data-evreq-send]', rq);
    var rW = null, rB = null, rE = [];
    var p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var rhm = function (m) { m = Math.round(m); if (m >= 1440) m -= 1440; return p2(Math.floor(m / 60)) + ':' + p2(m % 60); };
    var rmin = function (t) { var z = t.split(':'); return +z[0] * 60 + +z[1]; };
    var rdays = function (a, b) { var o = [], d = new Date(a + 'T12:00:00Z'), z = new Date((b || a) + 'T12:00:00Z'); while (d <= z && o.length < 15) { o.push(d.toISOString().slice(0, 10)); d.setUTCDate(d.getUTCDate() + 1); } return o; };
    var fv = function (n) { return rf.elements[n].value.trim(); };
    var jam = function (iso) {
      var P = null; rB.periods.forEach(function (x) { if (iso >= x.from && iso <= x.to) P = x; });
      if (!P) return null;
      var O = null; (rB.overrides || []).forEach(function (x) { if (x.date === iso) O = x; });
      var g = function (k) { return (O && O[k]) || P[k]; }, fri = new Date(iso + 'T12:00:00Z').getUTCDay() === 5;
      return [['Fajr', g('fajr')], [fri ? 'Jumu‘ah' : 'Zuhr + Asr', fri ? g('jumuah') : g('zuhr_asr')], ['Maghrib + Isha', g('maghrib_isha')]];
    };
    var rcheck = function () {
      var d1 = fv('data'), d2 = fv('fine') || d1, a = fv('dalle'), b = fv('alle'), msg = [], ok = true;
      if (!d1) { rc.innerHTML = '<p class="amj-tnote">Scegli la data per vedere gli orari di preghiera e le sovrapposizioni.</p>'; return; }
      if (d2 < d1) { rc.innerHTML = '<p class="amj-tnote">La fine deve essere dopo l’inizio.</p>'; return; }
      var days = rdays(d1, d2);
      days.forEach(function (iso) {
        var w = rW && rW.days[iso], L = jam(iso), lab = iso.split('-').reverse().slice(0, 2).join('/');
        if (!w) { msg.push('<li>' + lab + ': data fuori dal periodo degli orari (2026–2027).</li>'); return; }
        if (a && b && rmin(b) > rmin(a)) {
          var A = rmin(a), Bm = rmin(b);
          if (L) L.forEach(function (x) { var j = rmin(x[1]); if (j >= A && j < Bm) msg.push('<li>' + lab + ': comprende la Jama‘at di <b>' + x[0] + '</b> (' + x[1] + '). Prevedi la preghiera nel programma.</li>'); });
          if (Bm > w[5] && A < w[5] + 1) msg.push('<li>' + lab + ': l’evento attraversa il tramonto (' + rhm(w[5]) + '): il Maghrib va previsto.</li>');
        } else if (days.length === 1) msg.push('<li>Aggiungi l’orario di inizio e di fine per controllare le preghiere.</li>');
        if (new Date(iso + 'T12:00:00Z').getUTCDay() === 5) msg.push('<li>' + lab + ' è venerdì: il Jumu‘ah è alle ' + (L ? L[1][1] : '13:25') + '.</li>');
      });
      rE.forEach(function (e) {
        var s = new Date(e.s).toISOString().slice(0, 10), z = new Date(e.e).toISOString().slice(0, 10);
        if (!e.minor && s <= d2 && z >= d1) msg.push('<li>Si sovrappone a <b>' + esc(e.title) + '</b> (' + s.split('-').reverse().join('/') + (z !== s ? '–' + z.split('-').reverse().join('/') : '') + (e.tentative ? ', da confermare' : '') + '). Concorda con il responsabile.</li>');
      });
      rc.innerHTML = msg.length ? '<div class="amj-note"><b>Da considerare</b><ul style="margin:6px 0 0;padding-left:20px">' + msg.join('') + '</ul></div>' : '<div class="amj-note">Nessuna Jama‘at e nessun evento pubblicato in questa data.</div>';
    };
    var rsend = function () {
      var t = ['Assalamu alaikum wa rahmatullahi wa barakatuhu.', 'RICHIESTA DATA/PROGRAMMA (per il Segretario Generale nazionale)', 'Struttura: ' + fv('struttura'), 'Titolo: ' + fv('titolo'),
        'Data: ' + fv('data') + (fv('fine') ? ' – ' + fv('fine') : ''), 'Orario: ' + (fv('dalle') || '?') + ' – ' + (fv('alle') || '?'), 'Luogo: ' + (fv('luogo') || '?'), 'Referente: ' + (fv('referente') || '?')];
      if (fv('note')) t.push('Note: ' + fv('note'));
      t.push('Controllo preghiere eseguito sul sito. In attesa di approvazione.');
      return rq.getAttribute('data-wa') + '?text=' + encodeURIComponent(t.join('\n'));
    };
    rs.addEventListener('click', function (ev) {
      if (!fv('struttura') || !fv('titolo') || !fv('data')) { ev.preventDefault(); rc.innerHTML = '<div class="amj-note"><b>Mancano dati</b>: struttura, titolo e data sono obbligatori.</div>'; return; }
      rs.href = rsend(); rs.target = '_blank';
    });
    rf.addEventListener('input', rcheck); rf.addEventListener('change', rcheck);
    Promise.all([fetch(rq.getAttribute('data-wsrc')).then(function (r) { return r.json(); }), fetch(rq.getAttribute('data-bsrc'), { cache: 'no-cache' }).then(function (r) { return r.json(); }), fetch(rq.getAttribute('data-esrc'), { cache: 'no-cache' }).then(function (r) { return r.json(); })])
      .then(function (x) { rW = x[0]; rB = x[1]; rE = norm(x[2]); rcheck(); }).catch(function () { rc.innerHTML = '<p class="amj-tnote">Il controllo degli orari non si carica: puoi comunque inviare la richiesta.</p>'; });
  }


  /* ---------- Orari di preghiera: calcolati dal browser per la città scelta o per la posizione dell'utente ---------- */
  var opj = $('[data-opj]');
  if (opj) {
    var q2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var qh = function (m) { if (m >= 1440) m -= 1440; return q2(Math.floor(m / 60)) + ':' + q2(m % 60); };
    var qIso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    var qsel = $('[data-opj-city]', opj), qd = $('[data-opj-date]', opj), qcur = qIso, qloc = null;
    var qnames = Object.keys(PT.CITIES).filter(function (k) { return k !== 'Bologna' && k !== 'San Pietro in Casale'; });
    qnames.forEach(function (c) { var o = document.createElement('option'); o.value = o.textContent = c; qsel.appendChild(o); });
    var og = document.createElement('option'); og.value = '__gps'; og.textContent = 'La mia posizione'; og.hidden = true; qsel.appendChild(og);
    var saved = null; try { saved = localStorage.getItem('amj-city'); } catch (e) {}
    if (saved && PT.CITIES[saved] && qnames.indexOf(saved) >= 0) qsel.value = saved;
    var qloc2 = function () {
      if (qsel.value === '__gps' && qloc) return { name: 'La tua posizione', lat: qloc[0], lon: qloc[1], tz: Intl.DateTimeFormat().resolvedOptions().timeZone };
      var c = PT.CITIES[qsel.value]; return { name: qsel.value, lat: c[0], lon: c[1], tz: 'Europe/Rome' };
    };
    var qcalc = function (iso, L) { var z = iso.split('-').map(Number); return PT.day(z[0], z[1], z[2], L.lat, L.lon, L.tz); };
    var qshift = function (iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    var qsrc = function (L) {
      $('[data-opj-src]', opj).innerHTML = '<b>' + esc(L.name) + '</b>: latitudine ' + L.lat.toFixed(4) + '°, longitudine ' + L.lon.toFixed(4) + '° · fuso ' + esc(L.tz) + ' · <a href="https://www.openstreetmap.org/?mlat=' + L.lat + '&mlon=' + L.lon + '#map=12/' + L.lat + '/' + L.lon + '" target="_blank" rel="noopener">vedi il punto su OpenStreetMap</a>';
    };
    var qrender = function (iso) {
      qcur = iso; qd.value = iso;
      var L = qloc2(), v = qcalc(iso, L), d = iso.split('-').map(Number), dow = new Date(iso + 'T12:00:00Z').getUTCDay();
      $('[data-opj-title]', opj).textContent = L.name + ' · ' + FULLD[dow] + ' ' + d[2] + ' ' + FULLM[d[1] - 1] + ' ' + d[0];
      var R = [['Fajr', v.fajr, v.sunrise], [dow === 5 ? 'Zuhr (il venerdì Jumu‘ah)' : 'Zuhr', v.zuhr, v.asr], ['Asr', v.asr, v.maghrib], ['Maghrib', v.maghrib, null], ['Isha', v.isha, null, true]];
      $('[data-opj-out]', opj).innerHTML = '<div class="amj-twrap"><table class="amj-rtable amj-btp-t"><thead><tr><th>Preghiera</th><th>Inizio (awwal waqt)</th><th>Fine (ākhir waqt)</th></tr></thead><tbody>' + R.map(function (r) {
        return '<tr><td><b>' + r[0] + '</b></td><td class="hot">' + qh(r[1]) + '</td><td>' + (r[2] === null ? (r[3] ? '<small>nessun orario indicato</small>' : '<small>si prega subito dopo il tramonto</small>') : qh(r[2])) + (r[2] >= 1440 ? ' <small>(dopo mezzanotte)</small>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="amj-tnote">Shuruq (sorgere del sole): ' + qh(v.sunrise) + '. Tramonto: ' + qh(v.maghrib) + '.</p>';
      qsrc(L);
      var n = new Date(Date.UTC(d[0], d[1], 0)).getUTCDate(), rows = '';
      $('[data-opj-mtitle]', opj).textContent = L.name + ', ' + FULLM[d[1] - 1] + ' ' + d[0];
      for (var k = 1; k <= n; k++) {
        var s2 = d[0] + '-' + q2(d[1]) + '-' + q2(k), x = qcalc(s2, L), dw = new Date(s2 + 'T12:00:00Z').getUTCDay();
        rows += '<tr' + (s2 === iso ? ' class="today"' : '') + '><td>' + k + ' ' + MONTHS[d[1] - 1] + (dw === 5 ? ' <small>ven</small>' : '') + '</td><td>' + qh(x.fajr) + '</td><td>' + qh(x.sunrise) + '</td><td>' + qh(x.zuhr) + '</td><td>' + qh(x.asr) + '</td><td>' + qh(x.maghrib) + '</td><td>' + qh(x.isha) + '</td></tr>';
      }
      $('[data-opj-month]', opj).innerHTML = '<table class="amj-rtable amj-btp-t"><thead><tr><th>Giorno</th><th>Fajr</th><th>Shuruq</th><th>Zuhr</th><th>Asr</th><th>Maghrib</th><th>Isha</th></tr></thead><tbody>' + rows + '</tbody></table>';
    };
    var tb = $('[data-opj-cities]', opj);
    if (tb) tb.innerHTML = qnames.map(function (c) { var p = PT.CITIES[c]; return '<tr><td>' + c + '</td><td>' + p[0].toFixed(4) + '</td><td>' + p[1].toFixed(4) + '</td><td><a href="https://www.openstreetmap.org/?mlat=' + p[0] + '&mlon=' + p[1] + '#map=12/' + p[0] + '/' + p[1] + '" target="_blank" rel="noopener">mappa</a></td></tr>'; }).join('');
    qrender(qIso);
    qsel.addEventListener('change', function () { if (qsel.value !== '__gps') { try { localStorage.setItem('amj-city', qsel.value); } catch (e) {} } qrender(qcur); });
    qd.addEventListener('change', function () { if (qd.value) qrender(qd.value); });
    $('[data-opj-prev]', opj).addEventListener('click', function () { qrender(qshift(qcur, -1)); });
    $('[data-opj-next]', opj).addEventListener('click', function () { qrender(qshift(qcur, 1)); });
    $('[data-opj-today]', opj).addEventListener('click', function () { qrender(qIso); });
    $('[data-opj-print]', opj).addEventListener('click', function () { window.print(); });
    var gb = $('[data-opj-gps]', opj);
    if (gb) gb.addEventListener('click', function () {
      var msg = $('[data-opj-gpsmsg]', opj);
      if (!navigator.geolocation) { msg.textContent = 'Il browser non permette di leggere la posizione.'; return; }
      msg.textContent = 'Leggo la posizione…';
      navigator.geolocation.getCurrentPosition(function (p) { qloc = [p.coords.latitude, p.coords.longitude]; qsel.value = '__gps'; msg.textContent = 'Posizione letta. La posizione resta nel tuo browser e non viene inviata.'; qrender(qcur); },
        function () { msg.textContent = 'Posizione non disponibile: scegli la città dall’elenco.'; }, { timeout: 10000 });
    });
  }

  /* ---------- filtro del blog ---------- */
  var chips = $$('.amj-chip[data-filter]');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
      var f = c.getAttribute('data-filter');
      $$('.amj-post[data-kind]').forEach(function (p) { p.hidden = !(f === 'all' || p.getAttribute('data-kind') === f); });
    });
  });
})();

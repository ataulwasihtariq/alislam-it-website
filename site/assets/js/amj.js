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

  var ram = $('[data-ram]');
  if (ram) {
    var url = ram.getAttribute('data-src');
    fetch(url, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (D) {
      var base = D.start.split('-').map(Number), cityKeys = Object.keys(D.cities);
      var sels = $$('[data-ram-city]');
      var cur = store.get('amj-city');
      if (!D.cities[cur]) cur = D.default;
      sels.forEach(function (sel) {
        sel.innerHTML = D.groups.map(function (g) { return '<optgroup label="' + g.label + '">' + g.items.map(function (it) { return '<option value="' + it.key + '">' + it.label + '</option>'; }).join('') + '</optgroup>'; }).join('');
        sel.value = cur;
        sel.addEventListener('change', function () { cur = sel.value; store.set('amj-city', cur); sels.forEach(function (o) { o.value = cur; }); render(); });
      });
      function row(c, i) { var f = c.fajr[i], m = c.maghrib[i]; return { fajr: f, alba: f + 90, zuhr: c.zuhr[i], asr: c.asr[i], maghrib: m, isha: m + 90 }; }
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
            '<div class="amj-tgrid"><div class="hot"><small>Fine pasto (Fajr)</small><b>' + hm(t.fajr) + '</b></div><div><small>Alba</small><b>' + hm(t.alba) + '</b></div><div><small>Zuhr</small><b>' + hm(t.zuhr) + '</b></div>' +
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
          [['Fine del pasto (Fajr)', r.fajr, 10, 0], ['Iftar (Maghrib)', r.maghrib, 15, 15]].forEach(function (e) {
            L.push('BEGIN:VEVENT', 'UID:ramadan2027-' + cur.replace(/\W/g, '') + '-' + i + '-' + e[3] + '@alislam.it', 'DTSTAMP:20261124T000000Z', 'DTSTART:' + utc(d, e[1]), 'DTEND:' + utc(d, e[1] + e[2]),
              'SUMMARY:' + e[0] + ' · Ramadan ' + i + ' · ' + city, 'DESCRIPTION:Orari della tabella pubblicata da alislam.it. Data del Ramadan da confermare con l’annuncio della Comunità.');
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

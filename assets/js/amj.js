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
  var evBox = $('[data-events]');
  if (evBox) {
    fetch(evBox.getAttribute('data-src'), { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (D) {
      var now = rome(new Date()), list = D.events.slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      var up = list.filter(function (e) { return Date.UTC.apply(null, e.start.slice(0, 10).split('-').map(function (x, i) { return i === 1 ? x - 1 : +x; })) >= now; });
      if (!up.length) { evBox.innerHTML = '<div class="amj-empty"><p class="body-2" style="margin:0 0 8px">Nessun evento in programma per ora.</p><p style="margin:0">Scrivici su WhatsApp per sapere che cosa si organizza nella tua città.</p></div>'; return; }
      evBox.innerHTML = up.map(function (e, i) {
        var p = e.start.slice(0, 10).split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
        return '<article class="amj-ev"><div class="d"><b>' + p[2] + '</b><small>' + MONTHS[p[1] - 1] + ' ' + p[0] + '</small></div><div><span class="amj-pill">' + (e.tentative ? 'Data da confermare' : e.kind) + '</span><h3 style="margin-top:8px">' + e.title + '</h3><p>' + [FULLD[d.getUTCDay()] + (e.time ? ' alle ' + e.time : ''), e.place, e.city].filter(Boolean).join(' · ') + '</p>' + (e.desc ? '<p style="margin-top:4px">' + e.desc + '</p>' : '') + '</div><div class="act">' + (e.url ? '<a class="amj-btn2" href="' + e.url + '">Dettagli</a> ' : '') + '<button class="amj-btn2" type="button" data-ics="' + i + '"><i class="ph ph-calendar-plus"></i> Calendario</button></div></article>';
      }).join('');
      $$('[data-ics]', evBox).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var e = up[+btn.getAttribute('data-ics')], s = e.start.slice(0, 10).replace(/-/g, ''), nx = new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8) + 1));
          var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//alislam.it//Eventi//IT', 'BEGIN:VEVENT', 'UID:' + e.id + '@alislam.it', 'DTSTAMP:20261124T000000Z', 'DTSTART;VALUE=DATE:' + s, 'DTEND;VALUE=DATE:' + nx.getUTCFullYear() + pad(nx.getUTCMonth() + 1) + pad(nx.getUTCDate()), 'SUMMARY:' + e.title, 'LOCATION:' + [e.place, e.city].filter(Boolean).join(', '), 'DESCRIPTION:' + (e.desc || '') + (e.tentative ? ' (data da confermare)' : ''), 'END:VEVENT', 'END:VCALENDAR'];
          var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([L.join('\r\n')], { type: 'text/calendar;charset=utf-8' })); a.download = e.id + '.ics'; document.body.appendChild(a); a.click(); a.remove();
        });
      });
    }).catch(function () { evBox.innerHTML = '<div class="amj-empty">Gli eventi non si caricano. Riprova più tardi.</div>'; });
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

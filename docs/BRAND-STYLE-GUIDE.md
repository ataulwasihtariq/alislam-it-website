# Brand Style Guide: alislam.it (Jama'at Italia)

Due marchi, un'unica famiglia. Il blog dell'Imam (imamtariq.wordpress.com) è personale e più caldo; alislam.it è istituzionale. Questa guida riguarda solo alislam.it.

## Carattere
Istituzionale all'italiana, facile da navigare, sobrio. Eleganza discreta in stile Dubai: spazio, luce, precisione, niente decorazione gridata. Tono: chiaro, rispettoso, dignitoso.

## Riconoscibilità
Un solo segno distintivo: **l'emblema ufficiale della Jama'at (il minareto nel cerchio)**. Compare nell'intestazione (logo esteso), nel motivo di sfondo, nell'illustrazione della home e nell'immagine di condivisione.
- Nessun altro simbolo religioso o decorativo: niente stelle, mezzelune generiche, stelle a otto punte, geometrie importate.
- Le icone Phosphor sono solo funzionali (WhatsApp, telefono, PDF, frecce). Non usarne di simboliche.

## Colori
Avorio `#faf8f4` e sabbia `#f1ede4` (fondi), verde profondo `#1f4a3a` e `#16201c` (marchio, testi, sezioni scure), oro sobrio `#a98b4f` (filetti e dettagli, mai grandi superfici), antracite `#1f2421` (testo).

## Motivo di sfondo
`assets/img/pattern-emblema.svg` (sfondi chiari) e `pattern-emblema-chiaro.svg` (sfondi scuri): l'emblema ripetuto in reticolo diagonale, tono su tono, molto tenue. Si usa solo sulle fasce `.amj-pat` e `.amj-patdark` (sezioni a fascia e piè di pagina), mai dietro il testo lungo. Per attenuarlo o toglierlo si modifica l'opacità ricreando il file SVG con opacità più bassa, oppure togliendo `url(...)` dalla regola in `assets/css/amj.css`.

## Immagini
- Fotografie: luce mediterranea, marmo avorio, archi, verde profondo; nessun volto riconoscibile di minori.
- Illustrazioni: linea sottile, verde e oro, con l'emblema (`hero-arcate.svg`).
- Condivisione sui social: `assets/img/og-jamaat.png` (1200×630, logo esteso e motto «Amore per tutti, odio per nessuno»).

## Navigazione
Cinque voci con sottomenu, più la voce speciale della Jalsa Salana e il pulsante «Parliamone»:
1. **Conoscere**: Che cos'è l'Islam, Chi siamo, Il Messia Promesso, La Khilafat, Domande e risposte, Dicono di noi.
2. **Orari e Ramadan**: Orari di preghiera, Orari di Baitut Tauhid, Ramadan 2027.
3. **Eventi**.
4. **Sermoni e libri**.
5. **Dipartimenti** (sottomenu con tutti i dipartimenti e l'area riservata).
- **Jalsa Salana**: voce speciale con il proprio logo (pillola dorata), pagina `jalsa-salana/`.
Sotto 1180 px il menu diventa a icona; la pagina corrente è sempre evidenziata. Obiettivo: ogni pagina a due clic. Il menu si modifica in `src/site.py` (`NAV`, `JALSA`) e in `wordpress/theme/amj-it/header.php`.

## Dipartimenti e logo propri
Ogni dipartimento segue lo stesso stile del sito (stessi caratteri, spazi, filetto in oro, motivo dell'emblema) e ha il proprio colore e il proprio logo.
- Se il dipartimento ha un logo ufficiale, si usa quello (`logo` in `DEPARTMENTS`, file in `assets/img/dept/`): oggi Waqf-e-Nau.
- Finché non c'è, un medaglione provvisorio con l'iniziale nel colore del dipartimento, con il doppio cerchio dell'emblema. Rishta Nata, Tarbiyyat, Tabligh, Talim, Mal, Isha'at e Servizio all'umanità aspettano il proprio logo.
- Ogni pagina di dipartimento porta la dicitura «Dipartimento della Jama'at» e resta sotto il logo esteso della Jama'at nell'intestazione.
- Per aggiungere un logo: copiare il file in `assets/img/dept/`, aggiungere `"logo": "img/dept/<nome>.webp"` al dipartimento e ricostruire con `python3 src/build.py --sources ..`.

## Jalsa Salana
Ha un proprio logo (oro su trasparente, `assets/img/dept/jalsa-salana.webp`, dal file «Jalsa Logo.png» del repository jalsa-salana-italia: ora senza la scritta dell’anno: solo l’emblema; l’icona quadrata del menu è `jalsa-salana-icon.webp`). La pagina riassume prossima edizione, edizione 2026, archivio e video.

## Da decidere
1. Loghi ufficiali degli altri sette dipartimenti.
2. Ospitare i font sul sito (GDPR) e valutare un carattere con grazie per i titoli.
3. Date della Jalsa 2027 (11–13 giugno, ancora da confermare).

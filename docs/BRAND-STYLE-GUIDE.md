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
Menu a icona (burger) sotto i 1440 px per evitare che le voci si sovrappongano; barra completa sopra. Evidenziare sempre la pagina corrente. Obiettivo: ogni pagina raggiungibile in due clic.

## Da decidere
1. Ridurre le voci del menu principale (oggi nove più il pulsante) raggruppando: «Conoscere» (Islam, Chi siamo, Domande), «Orari e Ramadan», «Eventi», «Sermoni e libri», «Dipartimenti».
2. Ospitare i font sul sito (GDPR) e valutare un carattere con grazie per i titoli.
3. Sostituire la fotografia con la cupola e la mezzaluna sul finale (`chi-siamo.webp`) con una immagine senza mezzaluna, oppure con l'emblema.

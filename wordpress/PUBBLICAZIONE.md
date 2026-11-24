# Come pubblicare (per Bilal)
1. Fare un backup completo e verificato di alislam.it.
2. Su una copia (staging): Aspetto > Temi > Aggiungi > Carica `amj-it.zip` > Attiva.
3. Creare le pagine con lo stesso indirizzo di `wordpress/pages/` e incollare il contenuto (blocco HTML personalizzato).
4. Creare il menu «Menu principale» e assegnarlo alla posizione principale.
5. Controllare tutte le pagine, poi in `src/site.py` impostare `published: True` e ricostruire.
6. Solo dopo approvazione di Ataul, ripetere sul sito attivo.
Deploy automatico da GitHub (opzionale): Git Updater / WP Pusher, oppure una GitHub Action via SFTP.


## Novità del tema (versione 2.0.0)
- Nuovo menu e nuova intestazione (barra flottante, menu a schermo intero su telefono). Le voci sono nel file `header.php`; «Dipartimenti» si compila dai contenuti di tipo Dipartimenti.
- Nuove pagine da creare in WordPress con i corpi in `wordpress/pages/`: `ramadan__index.html`, `eventi__index.html`, `dicono-di-noi__index.html` (e `domande__accuse.html`). I dati di Ramadan sono in `assets/data/ramadan-2027.json` dentro il tema.
- Tipo di contenuto «Eventi» e shortcode `[amj_eventi]`: vedi `docs/RAMADAN-EVENTI.md`.
- Caratteri Manrope e icone Phosphor vengono caricati da Google Fonts e unpkg.

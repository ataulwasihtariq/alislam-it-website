# Come pubblicare (per Bilal)
1. Fare un backup completo e verificato di alislam.it.
2. Su una copia (staging): Aspetto > Temi > Aggiungi > Carica `amj-it.zip` > Attiva.
3. Creare le pagine con lo stesso indirizzo di `wordpress/pages/` e incollare il contenuto (blocco HTML personalizzato).
4. Creare il menu «Menu principale» e assegnarlo alla posizione principale.
5. Controllare tutte le pagine, poi in `src/site.py` impostare `published: True` e ricostruire.
6. Solo dopo approvazione di Ataul, ripetere sul sito attivo.
Deploy automatico da GitHub (opzionale): Git Updater / WP Pusher, oppure una GitHub Action via SFTP.

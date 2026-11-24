# Orari di preghiera di Baitut Tauhid

Genera ogni mese, con un solo comando, il PDF (italiano e urdu), le immagini per WhatsApp e il file dati del sito.

## Come si usa
1. Aggiorna `config.json`: periodo (`start`, `end`), blocchi del Fajr (`fajr_blocks`), orari fissi e giorni speciali (`overrides`).
2. Scarica i font da Drive (Private Signature › Fonts) in `fonts/`: Garamond Premier Pro, Al_Mushaf, Jameel Noori Nastaleeq. I font non sono nel repository.
3. `python3 tools/orari-baitut-tauhid/build.py --out /tmp/orari --web assets/data/baitut-tauhid.json`
4. Copia `…pdf` in `assets/orari/orari-baitut-tauhid.pdf`, `whatsapp-orari.png` in `assets/orari/orari-baitut-tauhid.png` e `whatsapp-pensiero.png` in `assets/orari/pensiero-del-mese.png`, poi `python3 src/build.py`.
   Attenzione: `src/build.py` senza i repository fratelli `waqfe-nau` e `rishta-nata` svuota le due pagine dipartimento; ripristinale con `git checkout` prima del commit.

Il sito (`assets/js/amj.js`) legge `assets/data/baitut-tauhid.json` e mostra da solo gli orari della data di oggi; i giorni speciali compaiono nell'elenco e valgono solo per il giorno indicato.

## Regole (decise dall'Imam, 24 novembre 2026)
- Solo gli orari della Jama'at, senza colonna dell'Adhan.
- Fajr: Adhan all'inizio vero (alba meno 90 minuti), Jama'at = Adhan + 5 minuti, arrotondata ai 5 minuti e tenuta in blocchi; i cambi partono dal sabato, dopo il Jumu'ah.
- Jumu'ah: un solo orario tutto l'anno (13:25), dopo il mezzogiorno solare più tardivo (13:20,9). L'Asr segue il Jumu'ah (da confermare).
- Inverno: Zuhr + Asr unite alle 13:30. Maghrib + Isha unite alle 20:15, valide fino a sabato 27 marzo 2027 (poi ora legale).
- `build.py` controlla ogni giorno con l'astronomia (NOAA/Meeus, ±1 minuto) e si ferma se un orario non è valido.
- `quotes.json`: hadith e riferimento del mese (testi urdu copiati dalla biblioteca Hawala; traduzione italiana da rivedere).

Esempio di giorno speciale in `config.json`:
`"overrides": [{"date": "2026-12-12", "label_it": "Incontro speciale", "zuhr_asr": "14:00"}]`

# Come si aggiornano Ramadan ed eventi

## Eventi (sito statico)
Modifica `EVENTS` in `src/site.py` (id, title, start `AAAA-MM-GG`, kind, city, place, tentative, desc, url), poi `python3 src/build.py --sources ..`. Il build scrive `assets/data/eventi.json` e il feed `assets/data/eventi.ics`.

## Eventi (WordPress)
Il tema crea il tipo «Eventi». Per ogni evento: titolo, descrizione breve (riassunto) e i campi personalizzati `amj_data` (AAAA-MM-GG), `amj_ora` (HH:MM), `amj_luogo`, `amj_citta`, `amj_da_confermare` (1 se la data non è certa). Nella pagina Eventi inserire lo shortcode `[amj_eventi]`: mostra gli eventi futuri con il pulsante «Aggiungi al calendario».

## Orari di preghiera
I dati stanno in `data/preghiere-alislam-feb-mar.raw` (formato `Città;fajr0,delta…;zuhr0,delta…;asr0,delta…;maghrib0,delta…`, minuti dalla mezzanotte, poi differenze giorno per giorno). Per un altro periodo o altre città: leggere la tabella su alislam.it/orario-delle-preghiere, aggiornare il file e ricostruire. Alba e Isha si ricavano da Fajr e Maghrib (+90 minuti), come fa la tabella ufficiale.

## Dopo il Ramadan
Aggiornare le date in `RAMADAN` (site.py) e togliere o sostituire il file dati.

## Calendario della Jama'at (Google Calendar)
La pagina Eventi è alimentata da `EVENTS` in `src/site.py`, copiato dal calendario annuale «Ahmadiyya Muslim Jamaat Italia» (24.11.2026). Non sono pubblicati: riunioni di Majlis-e-Amla, Shura in attesa di approvazione, fine settimana riservati, festività e vacanze scolastiche.
Il calendario interno non va reso pubblico né incorporato: contiene note interne. Per un aggiornamento automatico: creare un calendario Google separato «Eventi pubblici», renderlo pubblico e lanciare `python3 tools/sync_eventi.py "<indirizzo iCal pubblico>"`.

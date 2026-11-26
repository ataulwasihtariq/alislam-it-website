# Verifica delle fonti
Fonti usate nei testi: Corano (numerazione standard e, tra parentesi quadre, quella «Ahmadiyya» con la bismillah come versetto 1); Sahih Muslim 2937; Musnad Ahmad 18406; Bukhari, Kitab al-Salat; Matteo 7:20 e 11:14; Pakistan: secondo emendamento (7.9.1974) e Ordinanza XX (26.4.1984); Jalsa Salana 1891; motto «Amore per tutti» (Hazrat Khalifatul Masih III, Cordova).

## Da confermare prima della pubblicazione
- Numeri esatti degli hadith (verificare con la biblioteca Rohani Khazain / raccolte originali).
- Opinione di Mahmud Shaltut su Hazrat Isa (as): citazione e fonte esatte.
- Numero di Paesi («oltre 200») e delle città, indirizzo, telefoni, email.
- Elenco libri e sermoni mostrati nel sito.
- Testo privacy: revisione legale.

## Storia in Italia (pagina chi-siamo/storia-in-italia)
Fonte unica: Al Hakam, 31.10.2024, Ata-ul-Haye Nasir (alhakam.org/islam-ahmadiyya-italy). Da confermare: date della ripresa dopo il 2010 e nascita delle 17 comunità locali; sostituire «in Italia dal 1937» solo se emergono fonti diverse.


## Convenzione dei riferimenti coranici (aggiornata)
Tutti i riferimenti usano solo la numerazione della Jama'at (la basmala conta come versetto 1) e sono link a `https://www.alislam.org/quran/app/<sura>:<versetto>?options=it`, che apre l'app del Corano con solo arabo e traduzione italiana (verificato). Il collegamento breve `tilaw.at/<sura>:<versetto>` porta alla stessa app ma perde il parametro `options=it`, quindi nel sito si usa l'indirizzo esteso. In caso di intervallo il link porta al primo versetto.


## Ramadan, eventi e «Dicono di noi» (24 novembre 2026)
- **Orari di preghiera**: tabella ufficiale di alislam.it/orario-delle-preghiere (plugin «Daily Prayer Time for Mosques»), letta il 24.11.2026 per 17 città, dal 7 febbraio al 10 marzo 2027. Convenzione verificata su tutte le righe: Alba = Fajr + 90 minuti, Isha = Maghrib + 90 minuti. I numeri sono quelli ufficiali, non calcolati. Cinque città usano la tabella di una città vicina (Venezia-Mestre→Padova, Trento→Strigno, Bolzano→Brunico, Cuneo→Mondovì, Firenze→Barberino di Mugello), dichiarato nella pagina.
- **Date del Ramadan**: inizio previsto lunedì 8 febbraio 2027, fine intorno al 9 marzo. È una previsione astronomica: da confermare con l'annuncio della Comunità.
- **Versetti**: Corano 2:184, 2:185, 2:186, 2:187, 2:188 (numerazione Jama'at, link all'app).
- **Hadith**: Sahih al-Bukhari, Kitab as-Saum, n. 1904 e n. 1901 (numerazione dell'edizione urdu della biblioteca hawala). La traduzione italiana è di Claude, dal testo urdu: da rivedere.
- **Dicono di noi**: 6 voci verificate in `src/site.py` (PRESS), una per una con data e link. Al Hakam è una pubblicazione della Comunità; Avvenire è indipendente (la pagina li distingue). ANSA, Città Nuova e Confronti non sono state aggiunte perché non verificate.
- **Eventi**: una sola voce, l'inizio previsto del Ramadan. Nessun evento inventato.


## Archivio Jalsa Salana Italia 2013–2026 (26 novembre 2026)
Dati in `data/jalsa-archivio.json`; le pagine si rigenerano con `python3 tools/gen_jalsa.py` e poi `python3 src/build.py`. Fonte unica: cartella Jalsa dell'OneDrive dell'Imam (rapporti per Al Fazl 2015–2019, 2024, 2025; programmi 2013, 2014, 2022, 2026; comunicati stampa 2019, 2023, 2025). I titoli degli interventi in urdu sono tradotti: da rivedere.
- **Numerazione**: 9ª (2015) – 13ª (2019) – 16ª (2024) – 17ª (2025) – 18ª (2026) sono scritte nei rapporti. 7ª (2013) è scritta nell'invito. 8ª (2014), 14ª (2022) e 15ª (2023) sono dedotte dalla successione.
- **Luogo**: 2017–2019 e 2024–2026 «Bait at-Tauhid» come nei rapporti; 2022 da programma (Via Morgobbo 1035/A); 2013–2014 da programma (Via Morgobbo); 2015, 2016 e 2023 il luogo non è scritto nella fonte: indicato San Pietro in Casale come sede della Comunità. Da confermare.
- **Presenze**: 2015 305; 2017 317; 2018 431; 2019 369; 2024 466; 2025 412. Il rapporto 2025 dà 136 uomini + 127 donne + 23 bambini + 26 ospiti = 312, non 412: pubblicato com'è con nota. Nessun dato per 2013, 2014, 2016, 2022, 2023, 2026.
- **Non pubblicato di proposito**: Red Book 2013 (critiche interne con nomi di volontari), numeri di telefono dei programmi 2013–2014, morte di un ex presidente nel rapporto 2016, nome della famiglia vicina del 2025, scambi con la DIGOS del 2013.
- **Rappresentante del Califfo 2013**: il programma dice solo «rappresentante speciale»; il nome (Tahir Nadeem) viene dalla lettera del Presidente nazionale del 12.06.2013. Per 2022, 2025 e 2026 le fonti non indicano un rappresentante speciale.
- **Mancano**: scheda 2012 (rapporto e programma PDF illeggibili per codifica dei font), 2020 e 2021 (nessuna edizione nell'archivio), relatori 2023 (programma urdu), foto, altri link YouTube oltre ai due del 2026.

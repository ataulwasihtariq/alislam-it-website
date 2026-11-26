# Richieste di date e programmi (pagina Eventi)

## Come funziona oggi
1. Un responsabile (Amila nazionale, ausiliaria, dipartimento, Zaitun, Jama'at locale) apre `eventi/#richiesta`.
2. Il modulo controlla la data contro gli orari di Baitut Tauhid (Jama'at e finestre di preghiera) e contro gli eventi già pubblicati.
3. «Invia la richiesta» apre WhatsApp con il testo già scritto. Nessun dato è salvato dal sito.
4. L'Imam (o chi approva) decide. Se approvato, l'evento va nel calendario **pubblico** e compare sul sito.

## Calendario: regola
- Decisione dell'Imam (26 nov 2026): il «Calendario Annuale» contiene solo eventi nazionali e viene incorporato nel sito. Deve essere condiviso come pubblico con «tutti i dettagli dell'evento»; ogni evento inserito lì diventa visibile. Le note interne vanno quindi tenute fuori da questo calendario.
- Per il sito serve un secondo calendario Google, «Eventi pubblici». Solo gli eventi approvati e pubblicabili vi vengono copiati.
- Quando esiste: impostarlo come pubblico, copiare il suo ID in `public_calendar_id` (src/site.py). La pagina Eventi mostra allora il calendario Google dal vivo.
- Per avere anche l'elenco interattivo e il file .ics: indirizzo iCal pubblico in `tools/sync_eventi.py`.

## Passo successivo (richiede una decisione)
Sostituire WhatsApp con Google Form → Foglio → colonna «Stato» (Approvato) → Apps Script che crea l'evento nel calendario pubblico. Va deciso: chi approva e quali strutture compaiono nell'elenco.

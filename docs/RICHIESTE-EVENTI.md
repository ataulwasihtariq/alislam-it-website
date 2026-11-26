# Richieste di date e programmi (pagina Eventi)

## Come funziona oggi
1. Un responsabile (Amila nazionale, ausiliaria, dipartimento, Zaitun, Jama'at locale) apre `eventi/#richiesta`.
2. Il modulo controlla la data contro gli orari di Baitut Tauhid (Jama'at e finestre di preghiera) e contro gli eventi già pubblicati.
3. «Invia la richiesta» apre WhatsApp con il testo già scritto. Nessun dato è salvato dal sito.
4. L'Imam (o chi approva) decide. Se approvato, l'evento va nel calendario **pubblico** e compare sul sito.

## Calendario: regola
- Il calendario «Calendario Annuale» è **interno** (note, Shura in attesa, riunioni di Amla, fine settimana riservati). Non si incorpora e non si rende pubblico.
- Per il sito serve un secondo calendario Google, «Eventi pubblici». Solo gli eventi approvati e pubblicabili vi vengono copiati.
- Quando esiste: impostarlo come pubblico, copiare il suo ID in `public_calendar_id` (src/site.py). La pagina Eventi mostra allora il calendario Google dal vivo.
- Per avere anche l'elenco interattivo e il file .ics: indirizzo iCal pubblico in `tools/sync_eventi.py`.

## Passo successivo (richiede una decisione)
Sostituire WhatsApp con Google Form → Foglio → colonna «Stato» (Approvato) → Apps Script che crea l'evento nel calendario pubblico. Va deciso: chi approva e quali strutture compaiono nell'elenco.

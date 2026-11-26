# Orari di preghiera (pagina /orari-preghiera/ e pagina Ramadan)

- Gli orari sono **calcolati nel browser** (`PT` in assets/js/amj.js, algoritmo NOAA/Meeus, margine circa 1 minuto) per le coordinate della città o della posizione dell'utente. Non ci sono tabelle copiate.
- `tools/orari-jamaat/jamaat_windows.py` è il riferimento Python per controllare il JavaScript (stesse formule).
- Coordinate: centro città, inserite a mano e mostrate nella pagina con il link a OpenStreetMap. Bologna e San Pietro in Casale non sono nell'elenco della pagina Orari (la moschea ha Baitut Tauhid); restano nella pagina Ramadan.
- Convenzioni, come la tabella di alislam.it: Fajr = alba − 90 min; Isha = il più tardi tra tramonto + 90 min e fine del crepuscolo rosso (15°). Il Maghrib non ha finestra (hadith di Gabriele: stesso momento nei due giorni), si prega subito dopo il tramonto. Asr a un'ombra (Muslim 958). Nessuna preghiera unita fuori da Baitut Tauhid.
- Differenza dalla tabella di alislam.it (26 nov 2026, Bologna): alba 7:28 contro 7:24, tramonto 16:41 contro 16:38, Zuhr 12:17 contro 12:02, Asr 14:34 contro 14:20. La tabella ufficiale è più tarda; va chiarito con chi la pubblica.
- Le date islamiche (Ramadan, 1 Rajab, ecc.) vengono dal calendario della Jama'at, non sono calcolate qui.
- Anche il planner di Baitut Tauhid usa questa regola (26 nov 2026).

# Archivio dei contenuti: come è organizzato

Il sito resta unico, ma ogni area tiene il proprio repository. Il repository principale conserva una copia di riferimento di tutto ciò che è pubblico.

| Area | Dove vive il lavoro | Archivio nel repository principale |
|---|---|---|
| Jalsa Salana | repository principale | `data/jalsa-archivio.json`, pagine generate con `tools/gen_jalsa.py` |
| Waqf-e-Nau | `ataulwasihtariq/waqfe-nau` | `docs/archivio/waqfe-nau/` (README e indice con commit e impronte) |
| Rishta Nata | `ataulwasihtariq/rishta-nata` | `docs/archivio/rishta-nata/` (README e indice con commit e impronte) |

- Per aggiornare l'archivio dei dipartimenti: `python3 tools/archivia_dipartimenti.py <cartella con i repository>`, poi commit.
- Non si copiano PDF, moduli, configurazioni, indirizzi di script o dati di persone.
- Ogni pagina pubblica che usa quei contenuti cita la fonte in `docs/VERIFICA-FONTI.md`.
- Per regole di scrittura e spelling: `docs/REGOLE-REDAZIONALI.md`.

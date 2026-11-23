# alislam.it · sito della Comunità Musulmana Ahmadiyya in Italia

Un solo repository produce:
- **anteprima statica** (`site/`), apribile in qualsiasi browser;
- **pagine per WordPress** (`wordpress/pages/`, solo corpo);
- **tema WordPress** `amj-it` (`wordpress/theme/amj-it/`, zip pronto in `wordpress/amj-it.zip`).

## Come si lavora
- Testi: `src/pages/*.html` (intestazione + HTML).
- Dati comuni (contatti, menu, dipartimenti, città): `src/site.py`.
- Costruire: `python3 src/build.py` (opzione `--sources` per la cartella dei repository fratelli `waqfe-nau`, `rishta-nata`).
- Il sito resta in **bozza** (noindex) finché `published` in `src/site.py` è `False`.

## Regole
- Nessuna modifica al sito attivo senza backup completo verificato e approvazione.
- Nessun nome, telefono o dato di bambini, famiglie o pratiche nei repository pubblici.
- Nessun fatto senza fonte: vedi `docs/VERIFICA-FONTI.md`.

Altri documenti: `docs/ARCHITETTURA.md`, `docs/CODICI-SOCIO.md`, `docs/SUGGERIMENTI.md`, `wordpress/PUBBLICAZIONE.md`.

# Architettura
- `src/build.py` legge `src/pages/` e `src/templates/` (Jinja2) e `src/site.py`; scrive `site/` e `wordpress/pages/`.
- CSS con prefisso `amj-`; ogni dipartimento ha un colore (`--amj-dept`) definito in `site.py`.
- Le pagine dei dipartimenti Waqf-e-Nau e Rishta Nata incorporano i blocchi dei repository fratelli.
- Il tema `amj-it` usa gli stessi CSS/JS e registra i tipi di contenuto `dipartimento` e `sermone`.

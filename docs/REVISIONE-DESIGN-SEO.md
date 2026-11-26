# Revisione design, menu e SEO (26 novembre 2026)

**Menu.** Cinque voci (Conoscere, Orari e Ramadan, Eventi, Sermoni e libri, Dipartimenti) più la voce speciale Jalsa Salana, come deciso nell'ultima versione di `main`. Ogni pagina è raggiungibile dal menu o dal piè di pagina; la voce attiva si evidenzia da sola. Il menu si modifica solo in `src/site.py` (`NAV`). Il tema WordPress ha lo stesso schema in `header.php`.

**Grafica.** Contorni e ombre delle schede più visibili; barra del menu che non esce più dal riquadro; logo ingrandito; date degli eventi non più tagliate; blocchi Waqf-e-Nau e Rishta Nata con gli stessi caratteri e colori del sito (regole `.amj-embed`); testi mai sotto 12 px; comparsa delle sezioni attiva solo se JavaScript funziona.

**SEO.** `canonical`, `og:url`, Twitter card, dati strutturati Organization, WebSite, BreadcrumbList; titoli entro 60 caratteri; descrizioni 100–160; `sitemap.xml` e `robots.txt` generati dalla build. Finché `published` in `src/site.py` è `False`, il sito resta `noindex`, `robots.txt` vieta tutto e la mappa è vuota; con `True` si aprono da soli.

"""Dati comuni del sito alislam.it: contatti, menu, dipartimenti.
Per cambiare un numero, un colore o aggiungere un dipartimento si modifica solo questo file."""

SITE = {
    "name": "Associazione The Ahmadiyya Muslim Jama’at Italia",
    "tagline": "in Italia · prima missione 1937",
    "legal": "Associazione The Ahmadiyya Muslim Jama’at Italia",
    "base_url": "https://alislam.it",
    "whatsapp": "+39 051 199 00 451",
    "whatsapp_link": "https://wa.me/390511990451",
    # ID del calendario Google PUBBLICO «Eventi pubblici» (non quello interno). Vuoto = nessun calendario incorporato.
    "public_calendar_id": "6eac6d82f39ca2f50434bf232cc5be0e8ac6aaf4bf429a7330d6a2405e9dd5ea@group.calendar.google.com",
    "toll_free": "800 598 005",
    "email": "contatti@alislam.it",
    "address": "Bait-ul-Tauhid (sede nazionale e moschea), Via Morgobbo 1035/A, Gavaseto, 40018 San Pietro in Casale (BO)",
    # Dopo la verifica con l'amministratore: mettere True per togliere "noindex" e la fascia "bozza".
    "published": False,
}

CITIES = ["Bologna", "Parma", "Brescia", "Ravenna", "Venezia-Mestre", "Padova", "Trento", "Bolzano",
          "Milano", "Varese", "Como", "Torino", "Cuneo", "Firenze", "Roma", "Napoli", "Catania"]

# Menu principale: (etichetta, percorso). "Dipartimenti" ha il sottomenu generato da DEPARTMENTS.
# Menu principale: cinque voci (con sottomenu dove serve) più la voce speciale Jalsa Salana.
# Ogni voce: (etichetta, indirizzo, [(etichetta, indirizzo), ...]).
NAV = [
    ("Conoscere", "islam/", [
        ("Che cos’è l’Islam", "islam/"), ("Chi siamo", "chi-siamo/"), ("Il Messia Promesso", "chi-siamo/messia-promesso.html"),
        ("La Khilafat", "chi-siamo/khulafa.html"), ("Domande e risposte", "domande/"), ("Dicono di noi", "dicono-di-noi/")]),
    ("Orari e Ramadan", "orari-preghiera/", [
        ("Orari di preghiera", "orari-preghiera/"), ("Orari di Baitut Tauhid", "baitut-tauhid/"), ("Ramadan 2027", "ramadan/")]),
    ("Eventi", "eventi/", []),
    ("Sermoni e libri", "sermoni/", [("Sermoni del Venerdì", "sermoni/"), ("Libri", "libri/")]),
    ("Dipartimenti", "dipartimenti/", None),  # None: il sottomenu si compila dai dipartimenti
]
# Voce speciale: ha un proprio logo.
JALSA = {"label": "Jalsa Salana", "href": "jalsa-salana/", "logo": "img/dept/jalsa-salana.webp"}
DEPARTMENTS = [
    {"slug": "waqf-e-nau", "name": "Waqf-e-Nau", "ur": "وقفِ نو", "color": "#1f4a3a", "initial": "W", "status": "attivo", "logo": "img/dept/waqf-e-nau.webp",
     "summary": "I bambini dedicati al servizio della fede: programma 2026, Nisab per età, Jaiza, quiz per i genitori.",
     "embed": "waqfe-nau/wordpress/waqfe-nau-embed.html"},
    {"slug": "rishta-nata", "name": "Rishta Nata", "ur": "رشتہ ناطہ", "color": "#8a3b4a", "initial": "R", "status": "attivo",
     "summary": "Matrimonio: istruzioni, moduli del Nikah, counselling, certificati, in italiano, inglese e urdu.",
     "embed": "rishta-nata/wordpress/rishta-nata-embed.html"},
    {"slug": "tarbiyyat", "name": "Tarbiyyat", "ur": "تربیت", "color": "#1f5a73", "initial": "T", "status": "bozza",
     "summary": "La formazione morale e spirituale dei membri: preghiera, buon carattere, vita familiare e comunitaria."},
    {"slug": "tabligh", "name": "Tabligh", "ur": "تبلیغ", "color": "#7a5f22", "initial": "T", "status": "bozza",
     "summary": "Far conoscere l’Islam: incontri, stand, mostre del Corano, dialogo con scuole, parrocchie e associazioni."},
    {"slug": "talim", "name": "Talim", "ur": "تعلیم", "color": "#3d4f8a", "initial": "T", "status": "bozza",
     "summary": "Istruzione e formazione: corsi, classi tarbiyyati, studio del Corano e della lingua."},
    {"slug": "mal", "name": "Mal", "ur": "مال", "color": "#5b4a7a", "initial": "M", "status": "bozza",
     "summary": "Le offerte volontarie dei membri e la loro rendicontazione: Tehrik-e-Jadid, Waqf-e-Jadid, contributi."},
    {"slug": "ishaat", "name": "Isha‘at", "ur": "اشاعت", "color": "#8a5a2b", "initial": "I", "status": "bozza",
     "summary": "Pubblicazioni: libri, traduzioni del Corano, riviste e materiali in italiano."},
    {"slug": "khidmat", "name": "Servizio all’umanità", "ur": "خدمتِ خلق", "color": "#a04a2a", "initial": "S", "status": "bozza",
     "summary": "Volontariato e aiuto concreto, senza distinzione di fede: iniziative locali e umanitarie."},
]

# Organizzazioni ausiliarie: età secondo l'ordinamento della Comunità
AUXILIARY = [
    ("Lajna Imaillah", "Le donne dai 15 anni in su"),
    ("Majlis Khuddam-ul-Ahmadiyya", "Gli uomini dai 15 ai 40 anni"),
    ("Majlis Ansarullah", "Gli uomini oltre i 40 anni"),
    ("Majlis Atfal-ul-Ahmadiyya", "I ragazzi dai 7 ai 15 anni"),
    ("Nasirat-ul-Ahmadiyya", "Le ragazze dai 7 ai 15 anni"),
]

# Sermoni di esempio (verificare prima di pubblicare; in WordPress arrivano dagli articoli della categoria "sermoni")
SERMONS = [
    ("6 novembre 2026", "Sacrificio finanziario: lo spirito della Tahrik-e-Jadid"),
    ("30 ottobre 2026", "Muhammad (sa): la semplicità della sua vita"),
    ("23 ottobre 2026", "Muhammad (sa): la semplicità del Santo Profeta"),
]

BOOKS = [
    ("La Filosofia degli Insegnamenti dell’Islam", "Hazrat Mirza Ghulam Ahmad (as)", "#1f4a3a"),
    ("La Crisi Mondiale e la Via per la Pace", "Hazrat Mirza Masroor Ahmad (aba)", "#16201c"),
    ("Gesù in India", "Hazrat Mirza Ghulam Ahmad (as)", "#6c5524"),
]


# Testi dei dipartimenti senza sito proprio (solo fatti generali; niente nomi di persone).
DEPT_TEXT = {
    "tarbiyyat": {
        "meaning": "Tarbiyyat significa «educazione, formazione».",
        "about": ["Il dipartimento aiuta i membri a vivere la fede nella vita di ogni giorno: la preghiera, la lettura del Corano, l’onestà nel lavoro, la cura della famiglia e il rapporto con i vicini.",
                  "Si occupa delle classi tarbiyyati per adulti, giovani e bambini e dei materiali di studio, in collaborazione con i dipartimenti Talim e Waqf-e-Nau."],
        "do": ["Classi tarbiyyati nelle comunità locali", "Programmi per giovani e famiglie", "Materiali di studio in italiano, urdu e inglese"]},
    "tabligh": {
        "meaning": "Tabligh significa «trasmettere, far arrivare un messaggio».",
        "about": ["Il dipartimento presenta l’Islam a chi vuole conoscerlo: a scuole, parrocchie, associazioni, istituzioni e a chiunque faccia domande.",
                  "Lo fa con incontri pubblici, stand, mostre del Corano, conferenze e dialogo interreligioso, partendo sempre dalle fonti e senza forzare nessuno: «non c’è costrizione nella religione» (Corano <a class='amj-q' href='https://www.alislam.org/quran/app/2:257?options=it' target='_blank' rel='noopener'>2:257</a>)."],
        "do": ["Incontri e conferenze aperte al pubblico", "Stand e mostre del Corano", "Dialogo con scuole, parrocchie e istituzioni"]},
    "talim": {
        "meaning": "Talim significa «istruzione, insegnamento».",
        "about": ["Il dipartimento promuove lo studio: del Corano, della lingua araba, della storia dell’Islam e dei libri della Comunità.",
                  "Sostiene gli insegnanti e prepara il materiale per le classi, perché ogni membro, grande o piccolo, possa capire ciò in cui crede."],
        "do": ["Corsi di Corano e di lingua araba", "Materiali per insegnanti", "Programmi di studio per età"]},
    "mal": {
        "meaning": "Mal significa «ricchezza, risorse»: è il dipartimento delle finanze.",
        "about": ["La Comunità vive di offerte volontarie dei suoi membri. Il dipartimento le raccoglie, le registra e ne rende conto secondo le regole della Comunità.",
                  "Qui saranno pubblicate le informazioni sulle principali iniziative di contribuzione (come Tehrik-e-Jadid e Waqf-e-Jadid) e le modalità per versare le offerte."],
        "do": ["Informazioni sulle offerte volontarie", "Modalità di versamento", "Rendicontazione"]},
    "ishaat": {
        "meaning": "Isha‘at significa «diffusione, pubblicazione».",
        "about": ["Il dipartimento cura i libri, le traduzioni e le riviste della Comunità. In Italia pubblica testi in italiano, tra cui la traduzione del Sacro Corano.",
                  "Qui troverete le pubblicazioni, ciascuna con la sua pagina e il PDF da scaricare gratuitamente."],
        "do": ["Libri in PDF da scaricare", "Traduzioni del Corano", "Materiali per mostre ed eventi"]},
    "khidmat": {
        "meaning": "Khidmat-e-Khalq significa «servizio alla creazione, alla gente».",
        "about": ["Il motto della Comunità è «Amore per tutti, odio per nessuno». Il servizio all’umanità ne è la prova pratica: aiutare chi ha bisogno, senza chiedergli in che cosa crede.",
                  "Qui saranno raccolte le iniziative di volontariato locali e le attività umanitarie a cui i membri partecipano."],
        "do": ["Iniziative di volontariato locali", "Raccolte e aiuti umanitari", "Collaborazione con enti e associazioni del territorio"]},
}


# ---------------------------------------------------------------------------------------------
# DICONO DI NOI: cronache e articoli. Per aggiungerne uno basta una voce qui (ordine: dal più recente).
# kind: "stampa" = giornale indipendente; "comunita" = pubblicazione della Comunità (Al Hakam, Review of Religions).
# Ogni voce è stata aperta e letta prima di essere inserita; il riassunto è nostro, non una citazione.
PRESS = [
    {"kind": "comunita", "outlet": "Al Hakam", "date": "29 novembre 2025", "author": "Ataul Wasih Tariq",
     "title": "Recent tabligh activities of Jamaat-e-Ahmadiyya Italy",
     "url": "https://www.alhakam.org/recent-tabligh-activities-jamaat-e-ahmadiyya-italy",
     "summary": "Cronaca di ottobre e novembre 2025: l’incontro interreligioso in Vaticano per i 60 anni di Nostra Aetate, la presentazione del messaggio di pace dell’Islam al Senato della Repubblica e il ricevimento con il cardinale Matteo Zuppi a Bait-ul-Tauhid, a San Pietro in Casale."},
    {"kind": "comunita", "outlet": "Al Hakam", "date": "26 maggio 2025", "author": "Ataul Wasih Tariq",
     "title": "Ahmadiyya missionary attends Vatican inauguration events and conveys message on Gaza crisis",
     "url": "https://www.alhakam.org/ahmadiyya-missionary-vatican-inauguration-gaza",
     "summary": "Il racconto della partecipazione alla messa di inizio pontificato di Leone XIV, il 18 maggio 2025, e del messaggio consegnato il giorno dopo da parte del Califfo della Comunità."},
    {"kind": "comunita", "outlet": "Al Hakam", "date": "1 novembre 2024", "author": "Ataul Wasih Tariq",
     "title": "Jamaat-e-Ahmadiyya Italy hosts historic event in Rome",
     "url": "https://www.alhakam.org/jamaat-e-ahmadiyya-italy-hosts-historic-event-in-rome",
     "summary": "L’incontro di dialogo interreligioso del 18 ottobre 2024 nella Sala della Protomoteca, in Campidoglio, a Roma, con rappresentanti delle istituzioni, del mondo accademico e della stampa."},
    {"kind": "comunita", "outlet": "Al Hakam", "date": "31 ottobre 2024", "author": "Ata-ul-Haye Nasir, Ahmadiyya Archive & Research Centre",
     "title": "Islam in Italy and Tahrik-e-Jadid: The early years of the Ahmadiyya Mission and press coverage",
     "url": "https://www.alhakam.org/islam-ahmadiyya-italy",
     "summary": "Un articolo di storia: i primi contatti con l’Italia, la visita del Califfo nel 1924, la fondazione della missione nel 1937, le difficoltà del periodo bellico e i tentativi successivi di riaprirla, con la rassegna della stampa italiana dell’epoca."},
    {"kind": "comunita", "outlet": "Al Hakam", "date": "4 novembre 2022", "author": "Marwan Gill",
     "title": "Ahmadi Muslim missionaries meet Pope Francis, who pays homage to Hazrat Mirza Masroor Ahmad",
     "url": "https://www.alhakam.org/ahmadi-muslim-missionaries-meet-pope-francis-who-pays-homage-to-hazrat-mirza-masroor-ahmad",
     "summary": "L’incontro del 5 settembre 2022 in Vaticano tra papa Francesco e due missionari della Comunità, fra cui il responsabile per l’Italia: il dialogo sull’armonia tra le religioni e lo scambio di doni."},
    {"kind": "stampa", "outlet": "Avvenire", "date": "15 giugno 2021", "author": "Stefano Vecchia",
     "title": "«Noi, Ahmadi, musulmani ma perseguitati in Pakistan»",
     "url": "https://www.avvenire.it/idee-e-commenti/noi-ahmadi-musulmani-ma-perseguitati-in-pakistan_53332",
     "summary": "Il quotidiano dei vescovi italiani racconta la condizione degli ahmadi in Pakistan, tra restrizioni legali e violenze, partendo dalla testimonianza dell’imam della Comunità in Italia."},
]

# Approfondimenti nostri (articoli della Comunità in stile blog). In WordPress sono gli articoli della categoria «approfondimenti».
ARTICLES = [
    {"title": "Gli ahmadi sono musulmani?", "href": "domande/accuse.html#musulmani", "summary": "La definizione di «musulmano» data dal Corano e dal Profeta (sa), e che cosa è successo nel 1974 in Pakistan."},
    {"title": "Muhammad (sa) è l’ultimo profeta?", "href": "domande/accuse.html#khatam", "summary": "Che cosa significa «sigillo dei profeti» e che cosa crediamo davvero, con i versetti e gli hadith."},
    {"title": "Gesù: vivo in cielo o morto?", "href": "domande/gesu.html", "summary": "I versetti del Corano sulla morte di Gesù (as), con la lettura di un rettore di al-Azhar."},
    {"title": "Il Messia Promesso (as)", "href": "chi-siamo/messia-promesso.html", "summary": "Chi era Mirza Ghulam Ahmad, che cosa ha affermato e che cosa ha scritto, con passi dai suoi libri."},
]

# ---------------------------------------------------------------------------------------------
# EVENTI. Per aggiungere un evento: una voce qui sotto (o un «Evento» in WordPress) e ricostruire.
# start = AAAA-MM-GG; time facoltativo "HH:MM"; tentative=True mostra «Data da confermare».
EVENTS = [
    # Fonte: calendario annuale della Jama'at (Google Calendar «Ahmadiyya Muslim Jamaat Italia»), letto il 24 novembre 2026.
    # Esclusi dal sito pubblico: riunioni di Majlis-e-Amla, Shura in attesa di approvazione, fine settimana riservati, festività e vacanze scolastiche.
    # start/end: date inclusive (AAAA-MM-GG). tentative = data da confermare.
    {"id": "ijlas-dic-2026", "title": "Ijlas mensile nelle Jama'at locali", "start": "2026-12-19", "end": "2026-12-20", "kind": "Comunità", "tentative": False,
     "desc": "Due giorni: ogni Jama'at sceglie sabato o domenica."},
    {"id": "rajab-1448", "minor": True, "title": "1 Rajab 1448", "start": "2026-12-11", "kind": "Calendario islamico", "tentative": True,
     "desc": "Data calcolata sulla visibilità prevista della luna a Bologna. Se la luna non viene avvistata, il mese inizia il giorno dopo."},
    {"id": "tarbiyyati-nazionali-dic-2026", "title": "Classi Tarbiyyati nazionali", "start": "2026-12-24", "end": "2026-12-26", "kind": "Formazione", "tentative": True, "desc": ""},
    {"id": "lajna-refresher-2027", "title": "Lajna: Refresher Course", "start": "2027-01-10", "kind": "Formazione", "tentative": False, "desc": "In presenza."},
    {"id": "shaban-1448", "minor": True, "title": "1 Sha‘ban 1448", "start": "2027-01-10", "kind": "Calendario islamico", "tentative": True,
     "desc": "Data calcolata sulla visibilità prevista della luna a Bologna. L’avvistamento effettivo prevale sul calcolo."},
    {"id": "ijlas-fede-2027", "title": "Ijlas: La nostra fede e religione", "start": "2027-01-16", "end": "2027-01-17", "kind": "Comunità", "tentative": True, "desc": ""},
    {"id": "gregoriana-2027", "title": "Conferenza alla Pontificia Università Gregoriana", "start": "2027-01-28", "kind": "Relazioni esterne", "tentative": True,
     "desc": "Spostata dal 27 novembre 2026."},
    {"id": "ansar-tarbiyyati-2027", "title": "Ansar: Classe Tarbiyyati", "start": "2027-01-30", "end": "2027-01-31", "kind": "Formazione", "tentative": False, "desc": ""},
    {"id": "bid-rajab-1448", "minor": True, "title": "Ayyam al-Bid (13–15 Rajab 1448): digiuno raccomandato", "start": "2026-12-23", "end": "2026-12-25", "kind": "Calendario islamico", "tentative": True,
     "desc": "I giorni bianchi: secondo la Sunnah si raccomanda di digiunare il 13, 14 e 15 di ogni mese islamico. Date calcolate dall'inizio del mese."},
    {"id": "bid-shaban-1448", "minor": True, "title": "Ayyam al-Bid (13–15 Sha‘ban 1448): digiuno raccomandato", "start": "2027-01-22", "end": "2027-01-24", "kind": "Calendario islamico", "tentative": True,
     "desc": "I giorni bianchi: secondo la Sunnah si raccomanda di digiunare il 13, 14 e 15 di ogni mese islamico. Date calcolate dall'inizio del mese."},
    {"id": "ramadan-1448", "title": "Ramadan 1448", "start": "2027-02-08", "end": "2027-03-09", "kind": "Calendario islamico", "tentative": True,
     "desc": "Il digiuno comincia lunedì 8 febbraio 2027 secondo il calcolo della luna. La data sarà confermata dalla Jama'at.", "url": "ramadan/index.html"},
    {"id": "musleh-maud-ijlas-2027", "title": "Ijlas: Giornata del Musleh Mau'ud", "start": "2027-02-20", "end": "2027-02-21", "kind": "Comunità", "tentative": True, "desc": ""},
    {"id": "eid-fitr-2027", "title": "Eid al-Fitr (1 Shawwal 1448)", "start": "2027-03-10", "kind": "Calendario islamico", "tentative": True,
     "desc": "Data calcolata sulla visibilità prevista della luna a Bologna. La data sarà confermata dalla Jama'at.", "url": "ramadan/index.html"},
    {"id": "bid-shawwal-1448", "minor": True, "title": "Ayyam al-Bid (13–15 Shawwal 1448): digiuno raccomandato", "start": "2027-03-22", "end": "2027-03-24", "kind": "Calendario islamico", "tentative": True,
     "desc": "I giorni bianchi: secondo la Sunnah si raccomanda di digiunare il 13, 14 e 15 di ogni mese islamico. Date calcolate dall'inizio del mese."},
    {"id": "qadah-1448", "minor": True, "title": "1 Dhul Qa‘dah 1448", "start": "2027-04-08", "kind": "Calendario islamico", "tentative": True,
     "desc": "Data calcolata sulla visibilità prevista della luna a Bologna. L’avvistamento effettivo prevale sul calcolo."},
    {"id": "bid-qadah-1448", "minor": True, "title": "Ayyam al-Bid (13–15 Dhul Qa‘dah 1448): digiuno raccomandato", "start": "2027-04-20", "end": "2027-04-22", "kind": "Calendario islamico", "tentative": True,
     "desc": "I giorni bianchi: secondo la Sunnah si raccomanda di digiunare il 13, 14 e 15 di ogni mese islamico. Date calcolate dall'inizio del mese."},
    {"id": "jalsa-masih-maud-2027", "title": "Ijlas: Jalsa Masih Mau'ud", "start": "2027-03-20", "end": "2027-03-21", "kind": "Comunità", "tentative": True, "desc": ""},
    {"id": "messia-promesso-2027", "title": "Giornata del Messia Promesso", "start": "2027-03-23", "kind": "Comunità", "tentative": False, "desc": ""},
    {"id": "lajna-ijtema-2027", "title": "Lajna: Ijtema Nazionale", "start": "2027-03-26", "end": "2027-03-28", "kind": "Formazione", "tentative": True, "desc": "In presenza."},
]

RAMADAN = {"start": "2027-02-07", "first_fast": "2027-02-08", "days": 32, "default": "Bologna"}
# Città della Comunità -> tabella ufficiale di alislam.it. Dove la città non è nella tabella ufficiale si usa la località più vicina.
RAMADAN_GROUPS = [
    {"label": "Sedi della Comunità", "items": [
        ("Bologna", "Bologna", ""), ("Parma", "Parma", ""), ("Brescia", "Brescia", ""), ("Ravenna", "Ravenna", ""),
        ("Padova", "Padova", ""), ("Milano", "Milano", ""), ("Varese", "Varese", ""), ("Como", "Como", ""), ("Torino", "Torino", ""),
        ("Roma", "Roma", ""), ("Napoli", "Napoli", ""), ("Catania", "Catania", ""),
        ("Venezia-Mestre (orari di Padova)", "Padova", "Venezia-Mestre non è nella tabella ufficiale: orari di Padova, la località più vicina."),
        ("Trento (orari di Strigno)", "Strigno", "Trento non è nella tabella ufficiale: orari di Strigno, la località più vicina."),
        ("Bolzano (orari di Brunico)", "Brunico", "Bolzano non è nella tabella ufficiale: orari di Brunico, la località più vicina. Possono differire di qualche minuto."),
        ("Cuneo (orari di Mondovì)", "Mondovi", "Cuneo non è nella tabella ufficiale: orari di Mondovì, la località più vicina."),
        ("Firenze (orari di Barberino di Mugello)", "Barberino Di Mugello", "Firenze non è nella tabella ufficiale: orari di Barberino di Mugello, la località più vicina."),
    ]},
    {"label": "Altre località della tabella", "items": [("San Pietro in Casale", "San Pietro In Casale", "")]},
]

FAQ_HOME = [
    ("Chi sono gli ahmadi?", "Siamo musulmani che credono che il Messia atteso sia venuto nella persona di Mirza Ghulam Ahmad (as) di Qadian, fondatore della Comunità nel 1889. Leggiamo lo stesso Corano e seguiamo gli stessi cinque pilastri di tutti i musulmani. <a href=\"{root}chi-siamo/\">Chi siamo →</a>"),
    ("Gli ahmadi sono musulmani?", "Sì: recitiamo la professione di fede, preghiamo rivolti alla Ka‘ba, digiuniamo a Ramadan, versiamo la zakat e compiamo il pellegrinaggio. Alcuni teologi non ci riconoscono come tali, e noi spieghiamo perché non siamo d’accordo. <a href=\"{root}domande/accuse.html#musulmani\">La risposta con le fonti →</a>"),
    ("Che cosa significa «jihad»?", "La parola significa «sforzo». Per noi è anzitutto lo sforzo su sé stessi per migliorarsi, e la Comunità respinge ogni uso della religione per giustificare la violenza. <a href=\"{root}domande/#jihad\">Il dettaglio con le fonti →</a>"),
    ("Posso visitare una vostra sede o invitarvi a un incontro?", "Sì. Scrivici su WhatsApp o chiama il numero verde: ti indichiamo la sede più vicina fra le 17 città in cui siamo presenti e come organizzare un incontro in una scuola, una parrocchia o un’associazione."),
    ("Quando inizia il Ramadan 2027?", "La data prevista è lunedì 8 febbraio 2027. Dipende dalla luna nuova e sarà confermata con l’annuncio della Comunità. Gli orari di preghiera sono calcolati per la tua città. <a href=\"{root}ramadan/\">Orari e calendario →</a>"),
    ("Dove trovo i sermoni del Venerdì in italiano?", "Ogni settimana pubblichiamo il sermone del Califfo della Comunità tradotto in italiano. <a href=\"{root}sermoni/\">Vai ai sermoni →</a>"),
]

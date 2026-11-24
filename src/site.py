"""Dati comuni del sito alislam.it: contatti, menu, dipartimenti.
Per cambiare un numero, un colore o aggiungere un dipartimento si modifica solo questo file."""

SITE = {
    "name": "Comunità Musulmana Ahmadiyya",
    "tagline": "in Italia · prima missione nel 1937",
    "legal": "Associazione The Ahmadiyya Muslim Jama’at Italia",
    "base_url": "https://alislam.it",
    "whatsapp": "+39 051 199 00 451",
    "whatsapp_link": "https://wa.me/390511990451",
    "toll_free": "800 598 005",
    "email": "contatti@alislam.it",
    "address": "[indirizzo della sede: da confermare]",
    # Dopo la verifica con l'amministratore: mettere True per togliere "noindex" e la fascia "bozza".
    "published": False,
}

CITIES = ["Bologna", "Parma", "Brescia", "Ravenna", "Venezia-Mestre", "Padova", "Trento", "Bolzano",
          "Milano", "Varese", "Como", "Torino", "Cuneo", "Firenze", "Roma", "Napoli", "Catania"]

# Menu principale: (etichetta, percorso). "Dipartimenti" ha il sottomenu generato da DEPARTMENTS.
NAV = [
    ("Conoscere l’Islam", "islam/"),
    ("Chi siamo", "chi-siamo/"),
    ("Domande e risposte", "domande/"),
    ("Dicono di noi", "dicono-di-noi/"),
    ("Sermoni del Venerdì", "sermoni/"),
    ("Libri", "libri/"),
    ("Dipartimenti", "dipartimenti/"),
]

# status: "attivo" = pagina con contenuti reali; "bozza" = scheda introduttiva, contenuti da completare
DEPARTMENTS = [
    {"slug": "waqf-e-nau", "name": "Waqf-e-Nau", "ur": "وقفِ نو", "color": "#2f5d4a", "initial": "W", "status": "attivo",
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
    ("La Filosofia degli Insegnamenti dell’Islam", "Hazrat Mirza Ghulam Ahmad (as)", "#2f5d4a"),
    ("La Crisi Mondiale e la Via per la Pace", "Hazrat Mirza Masroor Ahmad (aba)", "#1e2b26"),
    ("Gesù in India", "Hazrat Mirza Ghulam Ahmad (as)", "#7a5f22"),
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
                  "Lo fa con incontri pubblici, stand, mostre del Corano, conferenze e dialogo interreligioso, partendo sempre dalle fonti e senza forzare nessuno: «non c’è costrizione nella religione» (Corano 2:257 [2:256])."],
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

// Klubzertifizierung — Kriterienkatalog des Verbandes.
//
// Quelle sind die beiden PDF-Anhänge der Clubberatung vom 28.04.2026
// ("Vereinszertifizierung_Basiskriterien.pdf" und
// "Vereinszertifizierung_Zusatzkriterien.pdf"). Die Liste steht fest im Code und
// ist NICHT in der App pflegbar (Michel-Entscheidung): es ist eine Verbandsliste,
// kein Vereinsinhalt. Ändert der Verband etwas, wird diese Datei geändert.
//
// ⚠️ Die `id` ist der Schlüssel, unter dem Status, Notiz, Ressort, Verlauf und die
// Aufgaben in `zertifizierung.json` hängen. Sie darf sich NIE ändern — auch nicht,
// wenn der Verband eine Nummer verschiebt oder ein Kriterium umbenennt. Wer eine id
// ändert, verliert lautlos den gesamten Bearbeitungsstand dieses Kriteriums.
//
// ⚠️ In den Texten stehen deutsche Anführungszeichen („…“). Gerade Anführungszeichen
// würden hier den JS-String zerlegen — siehe die Flottenregel dazu.

// Die drei Bereiche des Verbandes. In beiden Listen (Basis und Zusatz) dieselben.
const ZERT_BEREICHE = [
  { id: "spielbetrieb", label: "Spielbetrieb & Fußballangebote" },
  { id: "organisation", label: "Organisation & Strategie" },
  { id: "kultur",       label: "Vereinskultur" }
];

// Die zwei Listen. „basis“ muss vollständig erfüllt sein, „zusatz“ nicht — deshalb
// darf auch nur dort „Passt nicht zu uns“ gesetzt werden (siehe ZERT_STATUS).
const ZERT_ARTEN = [
  { id: "basis",  label: "Basiskriterien",  kurz: "Basis"  },
  { id: "zusatz", label: "Zusatzkriterien", kurz: "Zusatz" }
];

// Status eines Kriteriums. Ein eigener Zustand „in Arbeit“ fehlt bewusst: der wird
// bei jeder Anzeige daraus abgeleitet, dass an einem offenen Kriterium noch
// Aufgaben hängen (zertInArbeit() in app.js). Ein gespeicherter Zwischenstand
// müsste von Hand gepflegt werden und würde nach wenigen Wochen lügen.
const ZERT_STATUS = [
  { id: "offen",        label: "Offen",              farbe: "#7f8c8d" },
  { id: "erfuellt",     label: "Erfüllt",            farbe: "#1e8449" },
  { id: "nichtrelevant", label: "Passt nicht zu uns", farbe: "#95a5a6" }
];

// ⚠️ Nur bei Zusatzkriterien erlaubt. Ein Basiskriterium, das „nicht zu uns passt“,
// gibt es nicht — die 29 sind das Pflichtprogramm. Der Worker prüft dasselbe.
const ZERT_STATUS_NUR_ZUSATZ = ["nichtrelevant"];

const ZERT_MAX_NOTIZ_MB = 8;      // je Nachweis-Datei, wie bei den Aufgaben-Anhängen

const ZERT_KRITERIEN = [

  // ================= BASISKRITERIEN =================

  // ---- Basis · Spielbetrieb & Fußballangebote (5) ----
  { id: "basis-spielbetrieb-01", art: "basis", bereich: "spielbetrieb", nummer: "01",
    name: "Qualifizierte Trainer*innen",
    text: "In jeder Altersklasse ist mindestens eine Person aktiv, die an einer Qualifizierungsmaßnahme für Trainer*innen teilgenommen hat." },
  { id: "basis-spielbetrieb-02", art: "basis", bereich: "spielbetrieb", nummer: "02",
    name: "Schiri-Soll",
    text: "Der Verein erfüllt zur letzten Prüfung seinen Schiedsrichter*innen-Soll." },
  { id: "basis-spielbetrieb-03", art: "basis", bereich: "spielbetrieb", nummer: "03",
    name: "Schiri-Beauftragte*r",
    text: "Im Verein gibt es eine verantwortliche Person für die Gruppe der Schiedsrichter*innen." },
  { id: "basis-spielbetrieb-04", art: "basis", bereich: "spielbetrieb", nummer: "04",
    name: "Equipment",
    text: "Dem Verein stehen für alle angebotenen Fußballvarianten (z. B. Kinder-, Jugend-, Erwachsenen- & Walking-Football) die notwendigen Materialien zur Verfügung (z. B. altersentsprechende Bälle, Tore, usw.)." },
  { id: "basis-spielbetrieb-05", art: "basis", bereich: "spielbetrieb", nummer: "05",
    name: "Aktive Mannschaft",
    text: "Der Verein hat eine Mannschaft, die an einem aktiven Spielbetrieb teilnimmt." },

  // ---- Basis · Organisation & Strategie (16) ----
  { id: "basis-organisation-01", art: "basis", bereich: "organisation", nummer: "01",
    name: "Budgetplanung",
    text: "Der Verein erstellt jährlich eine Budgetplanung für die Fußballabteilung." },
  { id: "basis-organisation-02", art: "basis", bereich: "organisation", nummer: "02",
    name: "Dokumentenablage",
    text: "Es existiert eine gemeinsame Dokumentenablage, auf die der Vorstand zugreifen kann. Hier werden mindestens die Protokolle der Vorstandssitzungen und Mitgliederversammlungen gespeichert." },
  { id: "basis-organisation-03", art: "basis", bereich: "organisation", nummer: "03",
    name: "Ehrenamtsmanager*in",
    text: "Im Verein gibt es eine Person, die sich um die ehrenamtlichen Mitarbeiter*innen im Verein kümmert." },
  { id: "basis-organisation-04", art: "basis", bereich: "organisation", nummer: "04",
    name: "Fördermittel",
    text: "Der Verein stellt Anträge auf Fördermittel, um die eigenen finanziellen Ressourcen zu schonen." },
  { id: "basis-organisation-05", art: "basis", bereich: "organisation", nummer: "05",
    name: "Fußballplatz",
    text: "Dem Verein steht mindestens ein Fußballplatz zur Verfügung, so dass ein geordneter Spielbetrieb stattfinden kann." },
  { id: "basis-organisation-06", art: "basis", bereich: "organisation", nummer: "06",
    name: "Kabinen",
    text: "Es sind mindestens zwei Kabinen vorhanden, die ausreichend groß sind, so dass eine Fußballmannschaft sich dort umziehen kann." },
  { id: "basis-organisation-07", art: "basis", bereich: "organisation", nummer: "07",
    name: "Materialraum",
    text: "Auf der Sportanlage befindet sich ein Materialraum, in dem das Trainingsequipment untergebracht ist." },
  { id: "basis-organisation-08", art: "basis", bereich: "organisation", nummer: "08",
    name: "Öffentlichkeitsarbeit",
    text: "Der Verein verfügt über einen digitalen öffentlichen Auftritt, der auf einem aktuellen Stand (= maximal vier Wochen zum letzten Beitrag) ist und über alle Informationen verfügt, so dass Interessent*innen sich mit den Vereinsvertreter*innen in Verbindung setzen können." },
  { id: "basis-organisation-09", art: "basis", bereich: "organisation", nummer: "09",
    name: "Organigramm",
    text: "Es sind ein Organigramm sowie Aufgabenbeschreibungen für jede laut Satzung vorgesehene Vorstandsposition vorhanden." },
  { id: "basis-organisation-10", art: "basis", bereich: "organisation", nummer: "10",
    name: "Qualifizierungsmaßnahmen",
    text: "Vorstandsvorsitzende*r und Schatzmeister*in haben jeweils an einer überfachlichen Qualifizierungsmaßnahme (des Verbandes) teilgenommen." },
  { id: "basis-organisation-11", art: "basis", bereich: "organisation", nummer: "11",
    name: "Schiri-Kabinen",
    text: "Es ist eine separate Kabine für Schiedsrichter*innen vorhanden, die über eine ausreichende Größe verfügt und stets sauber gehalten wird." },
  { id: "basis-organisation-12", art: "basis", bereich: "organisation", nummer: "12",
    name: "Vereinsbuchhaltung",
    text: "Die Vereinsbuchhaltung wird digital abgewickelt." },
  { id: "basis-organisation-13", art: "basis", bereich: "organisation", nummer: "13",
    name: "Vereinssatzung",
    text: "Der Verein hat sich in den letzten fünf Jahren mit der Aktualisierung der Satzung beschäftigt." },
  { id: "basis-organisation-14", art: "basis", bereich: "organisation", nummer: "14",
    name: "Vereinsziele",
    text: "Der Verein hat sich für die kommenden drei Jahre konkrete Ziele gesetzt." },
  { id: "basis-organisation-15", art: "basis", bereich: "organisation", nummer: "15",
    name: "Vorstandspositionen",
    text: "Alle laut Vereinssatzung vorgesehenen Vorstandspositionen sind besetzt." },
  { id: "basis-organisation-16", art: "basis", bereich: "organisation", nummer: "16",
    name: "Wertschätzung",
    text: "Der Verein würdigt jahrelange Mitgliedschaft und freiwillige Mitarbeit im Verein, z. B. mit Auszeichnungen." },

  // ---- Basis · Vereinskultur (8) ----
  { id: "basis-kultur-01", art: "basis", bereich: "kultur", nummer: "01",
    name: "Leitbild",
    text: "Der Verein verfügt über ein Leitbild (welches in der Mitgliederversammlung verabschiedet wurde)." },
  { id: "basis-kultur-02", art: "basis", bereich: "kultur", nummer: "02",
    name: "Veranstaltungen",
    text: "Der Verein richtet eine oder mehrere Veranstaltungen aus, an denen alle Vereinsmitglieder willkommen sind." },
  { id: "basis-kultur-03", art: "basis", bereich: "kultur", nummer: "03",
    name: "Identifikation",
    text: "Der Verein hat eigene Vereinsfarben und besitzt ein Vereinslogo." },
  { id: "basis-kultur-04", art: "basis", bereich: "kultur", nummer: "04",
    name: "Verhaltensregeln",
    text: "Es wurden Verhaltensregeln für Vereinsmitglieder formuliert, die sichtbar auf dem Vereinsgelände ausgehängt werden und somit jederzeit ersichtlich sind." },
  { id: "basis-kultur-05", art: "basis", bereich: "kultur", nummer: "05",
    name: "Kindeswohl",
    text: "Alle Kinder- & Jugendtrainer*innen und -betreuer*innen kennen und beachten den Handlungsleitfaden zur Prävention und Intervention im Umgang mit Kindern und Jugendlichen." },
  { id: "basis-kultur-06", art: "basis", bereich: "kultur", nummer: "06",
    name: "Kinderschutz",
    text: "Der Verein positioniert sich klar und dauerhaft nachlesbar gegenüber der Öffentlichkeit und allen am Vereinsleben Interessierten für den Kinderschutz." },
  { id: "basis-kultur-07", art: "basis", bereich: "kultur", nummer: "07",
    name: "Konfliktmanager*in",
    text: "Im Verein gibt es eine (geschulte) Ansprechperson für Konfliktmanagement, welche allen Vereinsmitgliedern bekannt ist." },
  { id: "basis-kultur-08", art: "basis", bereich: "kultur", nummer: "08",
    name: "Gleichberechtigung",
    text: "Der Verein bekennt sich öffentlich dazu, dass er keine Menschen ausschließt, unabhängig von Geschlecht, ethnischer oder sozialer Herkunft, Religion, sexueller Orientierung, Alter oder Behinderung." },

  // ================= ZUSATZKRITERIEN =================

  // ---- Zusatz · Spielbetrieb & Fußballangebote (20) ----
  { id: "zusatz-spielbetrieb-01", art: "zusatz", bereich: "spielbetrieb", nummer: "01",
    name: "Ferienbetreuung",
    text: "Der Verein bietet Betreuungsangebote in den Ferien an." },
  { id: "zusatz-spielbetrieb-02", art: "zusatz", bereich: "spielbetrieb", nummer: "02",
    name: "Frauenmannschaft",
    text: "Der Verein hat eine Frauenmannschaft im Spielbetrieb gemeldet oder ist Teil einer Spielgemeinschaft." },
  { id: "zusatz-spielbetrieb-03", art: "zusatz", bereich: "spielbetrieb", nummer: "03",
    name: "Fußballvarianten",
    text: "Mindestens eine der Fußballvarianten Futsal, Beachsoccer oder Kleinfeldfußball ist Teil des Vereinsangebots." },
  { id: "zusatz-spielbetrieb-04", art: "zusatz", bereich: "spielbetrieb", nummer: "04",
    name: "Freie Spielmöglichkeiten",
    text: "Der Verein bietet freie Spielmöglichkeiten auf der Vereinsanlage." },
  { id: "zusatz-spielbetrieb-05", art: "zusatz", bereich: "spielbetrieb", nummer: "05",
    name: "Junioren",
    text: "Der Verein hat eine Juniorenmannschaft im Spielbetrieb gemeldet oder ist Teil einer Spielgemeinschaft." },
  { id: "zusatz-spielbetrieb-06", art: "zusatz", bereich: "spielbetrieb", nummer: "06",
    name: "Juniorinnen",
    text: "Der Verein hat eine Juniorinnenmannschaft im Spielbetrieb gemeldet oder ist Teil einer Spielgemeinschaft." },
  { id: "zusatz-spielbetrieb-07", art: "zusatz", bereich: "spielbetrieb", nummer: "07",
    name: "Kinderfußball",
    text: "Der Verein hat eine Mannschaft im Kinderfußball gemeldet oder ist Teil einer Spielgemeinschaft." },
  { id: "zusatz-spielbetrieb-08", art: "zusatz", bereich: "spielbetrieb", nummer: "08",
    name: "Kostenübernahme",
    text: "Der Verein beteiligt sich an den Kosten für Fortbildungs-, Weiterbildungs- und Qualifizierungsmaßnahmen von Trainer*innen." },
  { id: "zusatz-spielbetrieb-09", art: "zusatz", bereich: "spielbetrieb", nummer: "09",
    name: "Männermannschaft",
    text: "Der Verein hat eine Männermannschaft im Spielbetrieb gemeldet oder ist Teil einer Spielgemeinschaft." },
  { id: "zusatz-spielbetrieb-10", art: "zusatz", bereich: "spielbetrieb", nummer: "10",
    name: "Schiri-Ansprechpartner*in",
    text: "An Heimspieltagen stellt der Verein eine Ansprechperson für die Schiedsrichter*innen." },
  { id: "zusatz-spielbetrieb-11", art: "zusatz", bereich: "spielbetrieb", nummer: "11",
    name: "Schiri-Ausstattung",
    text: "Der Verein stattet seine Schiedsrichter*innen mit Outfit und SR-Equipment aus." },
  { id: "zusatz-spielbetrieb-12", art: "zusatz", bereich: "spielbetrieb", nummer: "12",
    name: "Schiri-Personalentwicklung",
    text: "Der Verein versucht, neue Schiedsrichter*innen zu gewinnen, und unterstützt die aktiven Schiedsrichter*innen im Verein bei ihrer Weiterentwicklung." },
  { id: "zusatz-spielbetrieb-13", art: "zusatz", bereich: "spielbetrieb", nummer: "13",
    name: "Schnuppertraining",
    text: "Der Verein veranstaltet regelmäßig (mindestens einmal im Jahr) Schnuppertrainingsangebote." },
  { id: "zusatz-spielbetrieb-14", art: "zusatz", bereich: "spielbetrieb", nummer: "14",
    name: "Trainer*innen-Dialog",
    text: "Es wird mindestens einmal pro Jahr ein Trainer*innen-Dialog im Verein veranstaltet." },
  { id: "zusatz-spielbetrieb-15", art: "zusatz", bereich: "spielbetrieb", nummer: "15",
    name: "Trainingsequipment",
    text: "Der Verein kennt seinen Bestand an Trainingsmaterial und füllt diesen nach Bedarf auf." },
  { id: "zusatz-spielbetrieb-16", art: "zusatz", bereich: "spielbetrieb", nummer: "16",
    name: "Trainingsphilosophie Deutschland",
    text: "Die Trainingsgestaltung im Kinder- und Jugendfußball richtet sich nach der „Trainingsphilosophie Deutschland“." },
  { id: "zusatz-spielbetrieb-17", art: "zusatz", bereich: "spielbetrieb", nummer: "17",
    name: "Ü-Training",
    text: "Der Verein bietet regelmäßig Training für Ü-Fußballer*innen an." },
  { id: "zusatz-spielbetrieb-18", art: "zusatz", bereich: "spielbetrieb", nummer: "18",
    name: "Ü-Wettbewerbe",
    text: "Der Verein nimmt an Ü-Wettbewerben des Kreises/Verbandes teil." },
  { id: "zusatz-spielbetrieb-19", art: "zusatz", bereich: "spielbetrieb", nummer: "19",
    name: "Walking Football",
    text: "Der Verein bietet regelmäßig Walking Football an." },
  { id: "zusatz-spielbetrieb-20", art: "zusatz", bereich: "spielbetrieb", nummer: "20",
    name: "Weitere Fußballangebote",
    text: "Der Verein bietet zusätzlich andere Fußballvarianten an." },

  // ---- Zusatz · Organisation & Strategie (21) ----
  { id: "zusatz-organisation-01", art: "zusatz", bereich: "organisation", nummer: "01",
    name: "Aufenthaltsraum",
    text: "Im Vereinsheim gibt es einen Gastro-/Küchenbereich sowie einen Aufenthaltsraum für Mitglieder." },
  { id: "zusatz-organisation-02", art: "zusatz", bereich: "organisation", nummer: "02",
    name: "Barrierefreiheit",
    text: "Die Barrierefreiheit auf dem Vereinsgelände ist gegeben." },
  { id: "zusatz-organisation-03", art: "zusatz", bereich: "organisation", nummer: "03",
    name: "CO2-Fußabdruck",
    text: "Der Verein errechnet seinen CO2-Fußabdruck mit dem kostenlosen DFB-Klimabilanztool." },
  { id: "zusatz-organisation-04", art: "zusatz", bereich: "organisation", nummer: "04",
    name: "Datenschutz",
    text: "Der Verein ergreift technische und organisatorische Maßnahmen, um die Vorschriften der DSGVO einhalten zu können." },
  { id: "zusatz-organisation-05", art: "zusatz", bereich: "organisation", nummer: "05",
    name: "Jugendförderpartner",
    text: "Es gibt einen Partner zur gezielten Förderung der Jugendabteilung." },
  { id: "zusatz-organisation-06", art: "zusatz", bereich: "organisation", nummer: "06",
    name: "Kindergartenkooperation",
    text: "Der Verein kooperiert mit Kindergärten." },
  { id: "zusatz-organisation-07", art: "zusatz", bereich: "organisation", nummer: "07",
    name: "Kommunikationskonzept",
    text: "Es liegt ein Kommunikationskonzept vor." },
  { id: "zusatz-organisation-08", art: "zusatz", bereich: "organisation", nummer: "08",
    name: "Konzept Viererkette im Ehrenamt",
    text: "Es liegt ein (schriftliches) Konzept zur Gewinnung, Qualifizierung, Bindung und Verabschiedung ehrenamtlicher Vereinsmitarbeiter*innen vor." },
  { id: "zusatz-organisation-09", art: "zusatz", bereich: "organisation", nummer: "09",
    name: "Kooperation",
    text: "Der Verein kooperiert neben Kindergarten und Schulen mit mindestens einer weiteren sozialen Einrichtung und setzt gemeinsame Projekte um." },
  { id: "zusatz-organisation-10", art: "zusatz", bereich: "organisation", nummer: "10",
    name: "Kostenübernahme",
    text: "Der Verein beteiligt sich an den Kosten für Fortbildungs-, Weiterbildungs- und Qualifizierungsmaßnahmen von Vereinsmitarbeiter*innen." },
  { id: "zusatz-organisation-11", art: "zusatz", bereich: "organisation", nummer: "11",
    name: "Prozessbeschreibung",
    text: "Die wesentlichen Prozesse der alltäglichen Vereinsarbeit sind definiert und schriftlich dokumentiert." },
  { id: "zusatz-organisation-12", art: "zusatz", bereich: "organisation", nummer: "12",
    name: "Qualifizierungsmaßnahmen",
    text: "Jugendleiter*in und Abteilungsleiter*in haben an einer überfachlichen Qualifizierungsmaßnahme (des Verbandes) teilgenommen." },
  { id: "zusatz-organisation-13", art: "zusatz", bereich: "organisation", nummer: "13",
    name: "Schulkooperation",
    text: "Der Verein kooperiert mit Schulen." },
  { id: "zusatz-organisation-14", art: "zusatz", bereich: "organisation", nummer: "14",
    name: "Social Media",
    text: "Der Verein hat einen Social-Media-Kanal und nutzt diesen aktiv." },
  { id: "zusatz-organisation-15", art: "zusatz", bereich: "organisation", nummer: "15",
    name: "Sponsoringkonzept",
    text: "Der Verein verfügt über ein schriftliches Sponsoringkonzept, welches auf Partnerschaften basiert, die gewinnbringend für alle Seiten sind." },
  { id: "zusatz-organisation-16", art: "zusatz", bereich: "organisation", nummer: "16",
    name: "Toiletten",
    text: "Im Vereinsheim gibt es Toiletten für alle Geschlechter." },
  { id: "zusatz-organisation-17", art: "zusatz", bereich: "organisation", nummer: "17",
    name: "Trainer*innen-Kabinen",
    text: "Der Verein verfügt über separate Kabinen in ausreichender Größe für die Trainer*innen." },
  { id: "zusatz-organisation-18", art: "zusatz", bereich: "organisation", nummer: "18",
    name: "Umwelt-Maßnahmen",
    text: "Der Verein ergreift mindestens eine Umwelt-Maßnahme, die auf der DFB-Klimaschutz-Website zu finden ist." },
  { id: "zusatz-organisation-19", art: "zusatz", bereich: "organisation", nummer: "19",
    name: "Vereinsphilosophie",
    text: "Das Vereinsmanager-C-Modul „Fußballverein mit Philosophie“ wurde absolviert." },
  { id: "zusatz-organisation-20", art: "zusatz", bereich: "organisation", nummer: "20",
    name: "Vereinsstrategie",
    text: "Es liegt eine schriftliche Vereinsstrategie vor." },
  { id: "zusatz-organisation-21", art: "zusatz", bereich: "organisation", nummer: "21",
    name: "Verwaltungstool",
    text: "Zur Organisation und Verwaltung des Vereins wird mit einem zentralen digitalen Tool gearbeitet." },

  // ---- Zusatz · Vereinskultur (8) ----
  { id: "zusatz-kultur-01", art: "zusatz", bereich: "kultur", nummer: "01",
    name: "Analysen",
    text: "Der Verein hat eine Risikoanalyse und Potentialanalyse in Bezug auf interpersonelle Gewalt durchgeführt." },
  { id: "zusatz-kultur-02", art: "zusatz", bereich: "kultur", nummer: "02",
    name: "Antidiskriminierung",
    text: "Der Verein führt Aktionen zum Thema Antidiskriminierung durch." },
  { id: "zusatz-kultur-03", art: "zusatz", bereich: "kultur", nummer: "03",
    name: "Fair Play",
    text: "Die Werte des Vereins wie z. B. Fair Play, Respekt etc. prägen die Aktivitäten des Vereins." },
  { id: "zusatz-kultur-04", art: "zusatz", bereich: "kultur", nummer: "04",
    name: "Führungszeugnis",
    text: "Der Verein fordert ein erweitertes polizeiliches Führungszeugnis von den Personen ein, die im Verein in Kontakt mit Kindern und Jugendlichen stehen. Einschlägige Einträge sind ein KO-Kriterium." },
  { id: "zusatz-kultur-05", art: "zusatz", bereich: "kultur", nummer: "05",
    name: "Gewalt",
    text: "Der Verein positioniert sich klar gegen jede Form der Gewalt." },
  { id: "zusatz-kultur-06", art: "zusatz", bereich: "kultur", nummer: "06",
    name: "Inklusive Angebote & Vielfalt",
    text: "Der Verein macht inklusive und integrative Vereinsangebote, um allen Menschen die Teilhabe zu ermöglichen." },
  { id: "zusatz-kultur-07", art: "zusatz", bereich: "kultur", nummer: "07",
    name: "Leitbild",
    text: "Das Leitbild ist gut sichtbar auf der Website des Vereins publiziert." },
  { id: "zusatz-kultur-08", art: "zusatz", bereich: "kultur", nummer: "08",
    name: "Suchtprävention",
    text: "Der Verein führt Aktionen im Bereich der Suchtprävention durch." }
];

// Schneller Zugriff nach id. Wird beim Rendern je Kriterium gebraucht und beim
// Zusammenführen von Katalog (fest) und Bearbeitungsstand (aus der Datei).
const ZERT_KRITERIEN_MAP = ZERT_KRITERIEN.reduce((m, k) => { m[k.id] = k; return m; }, Object.create(null));

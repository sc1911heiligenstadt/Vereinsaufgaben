const APP_VERSION = "1.0";

// Prioritätsstufen. Die Frist bleibt das führende Ordnungsmerkmal — die Priorität
// entscheidet nur bei gleichem Datum, welche Aufgabe oben steht.
const PRIORITAETEN = [
  { id: "hoch",    label: "Hoch",    farbe: "#c0392b", rang: 0 },
  { id: "normal",  label: "Normal",  farbe: "#7f8c8d", rang: 1 },
  { id: "niedrig", label: "Niedrig", farbe: "#95a5a6", rang: 2 }
];

// Status einer Aufgabe. "ueberfaellig" steht bewusst NICHT hier: das ist kein
// gespeicherter Zustand, sondern wird bei jeder Anzeige aus Frist + Status
// gerechnet (istUeberfaellig() in app.js). Ein gespeicherter Überfällig-Status
// bräuchte einen nächtlichen Lauf, der Datensätze umschreibt.
const STATUS_WERTE = [
  { id: "offen",           label: "Offen",             farbe: "#2c6fbb" },
  { id: "gemeldet",        label: "Zur Abnahme",       farbe: "#d68910" },
  { id: "erledigt",        label: "Erledigt",          farbe: "#1e8449" },
  { id: "abgelehnt",       label: "Abgelehnt",         farbe: "#922b21" },
  { id: "zurueckgezogen",  label: "Zurückgezogen",     farbe: "#7f8c8d" }
];

// Ein abgeschlossener Vorgang ist einer, bei dem nichts mehr zu tun ist. Nur diese
// Status wandern in der Personenübersicht aus der Spalte "offen" heraus.
const STATUS_ABGESCHLOSSEN = ["erledigt", "abgelehnt", "zurueckgezogen"];

// Die Auswahl im Statusfilter -- eine Liste für alle vier Aufgabenlisten der App.
// "offen-alle" und "ueberfaellig" sind keine gespeicherten Status, sondern
// gerechnete Sichten (passtZuStatusFilter() in app.js). Die erste Zeile ist
// zugleich die Vorgabe: Erledigtes bleibt dauerhaft erhalten, soll aber nicht die
// tägliche Arbeitsliste füllen.
const STATUS_FILTER_AUSWAHL = [
  { value: "offen-alle",     label: "Offen und zur Abnahme" },
  { value: "",               label: "Alle Status" },
  { value: "offen",          label: "Nur offen" },
  { value: "gemeldet",       label: "Nur zur Abnahme" },
  { value: "ueberfaellig",   label: "Nur überfällig" },
  { value: "erledigt",       label: "Nur erledigt" },
  { value: "abgelehnt",      label: "Nur abgelehnt" },
  { value: "zurueckgezogen", label: "Nur zurückgezogen" }
];

const MAX_ANHANG_MB = 8;

// Was die Vereinsaufgaben koennen -- steht im Info-Reiter als Karte "Funktionen".
// WICHTIG: Das ist NICHT der Changelog. Hier steht der ZUSTAND ("Aufgaben lassen
// sich einem Ressort zuweisen"), dort die Aenderung. Wer eine Funktion umbaut oder
// abschaltet, zieht diesen Text mit -- und ebenso E:\SC1911-Tools-Anleitung.txt,
// wo dasselbe ausfuehrlich steht.
const APP_FUNKTIONEN = [
  {
    title: "Wofür die Vereinsaufgaben da sind",
    items: [
      "Hier steht, was eine Person einer anderen aufträgt — mit Frist, Zuständigkeit, Abnahme und dauerhafter Historie.",
      "Was man sich selbst notiert, gehört in „Meine ToDos“ in der Kopfzeile der Tools-Übersicht. Zwei Orte für dieselbe Sache wären eine Doppelung.",
      "Auch ohne offene Aufgabe beantwortet die App die Frage, wer wofür zuständig ist."
    ]
  },
  {
    title: "Eine Aufgabe vergeben",
    items: [
      "Eine Aufgabe geht an eine Person oder an ein Ressort — mit Pflicht-Frist, Priorität, Beschreibung und wahlweise einem Anhang bis 8 MB.",
      "An ein Ressort zugewiesen heißt: der Verantwortliche erledigt, die Mitglieder sehen mit. Alternativ fächert eine Zuweisung in eine eigene Aufgabe je Ressort-Mitglied auf — für Fälle, in denen jeder einzeln liefern muss.",
      "Auf Wunsch muss der Zuweiser die Erledigung abnehmen. Die Aufgabe wartet dann als „Zur Abnahme“ und lässt sich mit Begründung zurückgeben."
    ]
  },
  {
    title: "Erledigen, ablehnen, wieder öffnen",
    items: [
      "Der Empfänger hakt ab, kommentiert und kann einen Nachweis hochladen. Den Text der Aufgabe ändert er nie.",
      "Wer eine Aufgabe für falsch adressiert hält, lehnt sie mit Begründung ab, statt sie stillschweigend liegen zu lassen.",
      "„Wieder öffnen…“ holt eine erledigte, abgelehnte oder zurückgezogene Aufgabe zurück auf offen. Der Verlauf hält fest, aus welchem Zustand sie zurückkam und von wem.",
      "Erledigte Aufgaben bleiben dauerhaft sichtbar. Es gibt keine automatische Löschfrist."
    ]
  },
  {
    title: "Ressorts und Zuständigkeiten",
    items: [
      "Jedes Ressort hat eine Zuständigkeitsbeschreibung, genau einen Verantwortlichen, einen Stellvertreter und weitere Mitglieder.",
      "Zuweisen darf, wer ein Ressort verantwortet oder vertritt — und zwar an die Mitglieder seines Ressorts. Wer die App administriert, weist jedem zu.",
      "Beim Ausscheiden lassen sich alle offenen Aufgaben einer Person in einem Schritt auf jemand anderen übertragen. Erledigtes bleibt beim ursprünglichen Bearbeiter stehen."
    ]
  },
  {
    title: "An eine Aufgabe erinnern",
    items: [
      "Offene Aufgaben haben einen Knopf „🔔 Erinnern“. Er schickt dem Empfänger dieselbe E-Mail wie beim Zuweisen noch einmal, dazu eine Nachricht aufs Handy, wenn er dafür ein Gerät angemeldet hat.",
      "Den Knopf sieht, wer die Aufgabe gestellt hat, und wer die App administriert. An die eigene Aufgabe kann man sich nicht selbst erinnern.",
      "Höchstens eine Erinnerung alle zwölf Stunden je Aufgabe. Jede steht mit Zeitpunkt und Namen im Verlauf des Vorgangs."
    ]
  },
  {
    title: "Benachrichtigung per E-Mail",
    items: [
      "Wer eine neue Aufgabe bekommt, wird per E-Mail informiert — mit Titel, Ressort, Frist und Text. Wer nur mitliest, bekommt keine Mail.",
      "Eine vertrauliche Aufgabe verrät in der E-Mail weder Titel noch Text — nur, dass es sie gibt und bis wann sie läuft.",
      "Nur das Anlegen löst eine Mail aus. Erledigungen, Abnahmen und Kommentare bleiben im Mailweg still, damit aus der Benachrichtigung kein Rauschen wird.",
      "Die Adresse kommt aus den Trainerdaten. Fehlt sie, sagt die App beim Zuweisen ausdrücklich, wer keine E-Mail bekommen hat."
    ]
  },
  {
    title: "Nachricht aufs Handy",
    items: [
      "Rückfragen und alle Statuswechsel melden sich aufs Handy: erledigt gemeldet, zur Abnahme, abgenommen, abgelehnt, zurückgegeben, zurückgezogen und wieder geöffnet.",
      "Benachrichtigt werden ausschließlich die beiden Beteiligten eines Vorgangs. Wer über sein Ressort nur mitliest, bekommt nichts.",
      "Die Nachricht nennt weder den Titel noch einen Namen noch den Wortlaut einer Rückfrage — sie steht auf dem Sperrbildschirm, den auch jemand anders sehen kann.",
      "Eingeschaltet wird das in der Tools-Übersicht unter „Mein Konto“."
    ]
  },
  {
    title: "Klubzertifizierung",
    items: [
      "Der Reiter „Zertifizierung“ führt alle 78 Kriterien des Verbandes: 29 Basiskriterien, die alle erfüllt sein müssen, und 49 Zusatzkriterien — gegliedert nach Spielbetrieb, Organisation & Strategie und Vereinskultur.",
      "Zwei Balken zeigen den Stand. Eine Schwelle, ab der die Zertifizierung geschafft wäre, zeigt die App bewusst nicht — die Regel dafür liegt beim Verband.",
      "Jedes Kriterium lässt sich auf „Erfüllt“ setzen, Zusatzkriterien zusätzlich auf „Passt nicht zu uns“. „In Arbeit“ zeigt die App von selbst an, solange an einem offenen Kriterium eine Aufgabe hängt.",
      "Zu jedem Kriterium gehören eine Notiz, beliebige Nachweis-Dateien und eine Ressort-Zuordnung. Die Kriterienliste selbst stammt vom Verband und ist in der App nicht änderbar."
    ]
  },
  {
    title: "Aufgaben und Bericht zur Zertifizierung",
    items: [
      "An jedem Kriterium lassen sich Aufgaben anlegen: was zu tun ist, wer es macht und bis wann. Die Frist ist hier freiwillig, und ein Kriterium kann mehrere Aufgaben haben.",
      "Abhaken darf die zuständige Person, wer die Aufgabe angelegt hat, und wer die App administriert. Es gibt hier keine Abnahme und kein Ablehnen — ein Haken ist ein Haken.",
      "⚠️ Diese Aufgaben verschicken weder eine E-Mail noch eine Nachricht aufs Handy. Wer eine Aufgabe verteilt, muss der Person selbst Bescheid sagen.",
      "„Bericht drucken“ öffnet eine Seite mit allen 78 Kriterien, ihrem Status, den Notizen und den offenen Aufgaben — immer der vollständige Stand, nie die gerade gefilterte Ansicht."
    ]
  },
  {
    title: "Übersicht, Filter und Export",
    items: [
      "Startbild der Verwaltung ist die Personenübersicht „Wer tut was“: je Funktionär offen, überfällig und erledigt auf einen Blick, aufklappbar bis zur einzelnen Aufgabe.",
      "Die Gesamtliste ist nach Person, Ressort, Status und Frist filterbar. Der Statusfilter steht von sich aus auf „Offen und zur Abnahme“ — also auf dem, was tatsächlich noch Arbeit macht.",
      "Neben jedem Filter steht, wie viel gerade ausgeblendet ist. Die Zahlen an den Personen und am Reiter „Meine Aufgaben“ zählen dagegen immer den echten Bestand.",
      "Druckansicht und CSV-Export der gerade gefilterten Liste."
    ]
  },
  {
    title: "Vertraulichkeit und Nachvollziehbarkeit",
    items: [
      "Bei vertraulichen Aufgaben sehen Unbeteiligte nur Empfänger, Frist und Status. Der Text wird schon auf dem Server entfernt und nicht bloß am Bildschirm ausgeblendet.",
      "Jede nachträgliche Änderung an Titel, Beschreibung, Frist oder Priorität wird am Vorgang protokolliert — mit altem und neuem Wert.",
      "Gelöschte Aufgaben erscheinen im Protokoll der Verwaltung mit Zeitpunkt, Person und dem Status zum Zeitpunkt der Löschung.",
      "Jede Änderung am Status eines Zertifizierungs-Kriteriums und an seiner Ressort-Zuordnung wird mit Zeitpunkt und Person festgehalten."
    ]
  },
  {
    title: "Wer was darf",
    items: [
      "Sehen: die eigenen Aufgaben und die des eigenen Ressorts.",
      "Bearbeiten: zuweisen im eigenen Ressort, Druckansicht, CSV-Export und Zertifizierungs-Bericht — dazu Notiz, Nachweise, Ressort-Zuordnung und Aufgaben an einem Kriterium.",
      "Administrieren: Ressorts pflegen, jedem zuweisen, Aufgaben übertragen, ändern, zurückziehen, löschen, das Protokoll einsehen — und den Status eines Zertifizierungs-Kriteriums setzen.",
      "Abnehmen und zur Nacharbeit zurückgeben darf ausschließlich die Person, die die Aufgabe gestellt hat — auch Administrieren nicht an ihrer Stelle. Der Reiter „Info“ ist für alle sichtbar."
    ]
  }
];

const APP_CHANGELOG = [
  {
    version: "1.4",
    groups: [
      {
        title: "Im Info-Reiter steht, was die App kann",
        items: [
          "Die Liste der Änderungen und die Versionsnummer sind aus dem Info-Reiter verschwunden.",
          "Stattdessen steht dort die Karte „Funktionen“: was die App kann, nach Themen geordnet.",
          "Was sich geändert hat, steht weiterhin in den Neuigkeiten auf der Startseite der Tools-Übersicht."
        ]
      }
    ]
  },
  {
    version: "1.3",
    groups: [
      {
        title: "Beschriftungen im Auftrags-Block sind mit ihrem Feld verbunden",
        items: [
          "Titel, Frist, Priorität und Beschreibung trugen ihre Beschriftung daneben, ohne mit ihr verknüpft zu sein. Ein Vorleseprogramm nennt dann nur ‚Eingabefeld‘, und ein Klick auf die Beschriftung setzte den Schreibzeiger nicht ins Feld.",
          "Am Bildschirm ändert sich nichts."
        ]
      }
    ]
  },
  {
    version: "1.2",
    groups: [
      {
        title: "Klubzertifizierung",
        items: [
          "Beim Ändern einer Aufgabe zu einem Kriterium wurde der Empfänger stillschweigend auf eine andere Person umgeschrieben, wenn der bisherige Empfänger sein Bearbeiten-Recht verloren hatte — der Dialog zeigte dann einfach die oberste Person der Liste. Der gespeicherte Empfänger steht jetzt immer mit in der Auswahl, gekennzeichnet mit „(ohne Bearbeiten-Recht)“.",
          "Zusätzlich wird der Empfänger nur noch mitgespeichert, wenn er im Dialog wirklich geändert wurde. Wer nur die Frist verschiebt, kann die Zuständigkeit gar nicht mehr versehentlich verschieben."
        ]
      }
    ]
  },
  {
    version: "1.1",
    groups: [
      {
        title: "Ressort-Dialog",
        items: [
          "Wer sein Bearbeiten-Recht verloren hat, blieb bisher zwar im Ressort gespeichert, tauchte im Ressort-Dialog aber nicht mehr auf — und wurde beim nächsten Speichern lautlos als Stellvertreter geleert und aus den Mitgliedern gestrichen. Diese Namen stehen jetzt weiter in der Auswahl, gekennzeichnet mit „(ohne Bearbeiten-Recht)“.",
          "Auch der Verantwortliche bleibt damit sichtbar; vorher ließ sich ein solches Ressort gar nicht mehr speichern, ohne dass irgendwo stand, wer es war."
        ]
      }
    ]
  },
  {
    version: "1.0",
    groups: [
      {
        title: "Aufgaben mit Frist",
        items: [
          "Aufgaben werden einer Person oder einem Ressort zugewiesen — mit Pflicht-Frist, Priorität, Beschreibung und wahlweise einem Anhang.",
          "An ein Ressort zugewiesen heißt: der Verantwortliche erledigt, die Mitglieder sehen mit. Alternativ fächert eine Zuweisung in eine eigene Aufgabe je Ressort-Mitglied auf — für Fälle, in denen jeder einzeln liefern muss.",
          "Wer eine Aufgabe für falsch adressiert hält, lehnt sie mit Begründung ab, statt sie stillschweigend liegen zu lassen.",
          "Auf Wunsch muss der Zuweiser die Erledigung abnehmen. Die Aufgabe wartet dann als „Zur Abnahme“ und lässt sich mit Begründung zurückgeben.",
          "Eine erledigte, abgelehnte oder zurückgezogene Aufgabe lässt sich über „Wieder öffnen…“ zurück auf offen holen — gedacht für den Fall, dass ein Abschluss ein Versehen war. Der Verlauf hält fest, aus welchem Zustand sie zurückkam und von wem.",
          "Erledigte Aufgaben bleiben dauerhaft sichtbar. Es gibt keine automatische Löschfrist."
        ]
      },
      {
        title: "Benachrichtigung per E-Mail",
        items: [
          "Wer eine neue Aufgabe bekommt, wird per E-Mail informiert — mit Titel, Ressort, Frist und Text.",
          "Benachrichtigt wird, wer die Aufgabe erledigen muss: bei einer Zuweisung an ein Ressort der Verantwortliche, bei einer aufgefächerten Zuweisung jedes Mitglied. Wer nur mitliest, bekommt keine Mail.",
          "Eine vertrauliche Aufgabe verrät in der E-Mail weder Titel noch Text — nur, dass es sie gibt, bis wann sie läuft und dass die Einzelheiten in der App stehen.",
          "Nur das Anlegen löst eine Mail aus. Erledigungen, Abnahmen und Kommentare bleiben im Mailweg bewusst still, damit aus der Benachrichtigung kein Rauschen wird — für sie gibt es die Nachricht aufs Handy.",
          "Die Adresse kommt aus den Trainerdaten. Ist dort keine hinterlegt, sagt die App beim Zuweisen ausdrücklich, wer keine E-Mail bekommen hat."
        ]
      },
      {
        title: "Nachricht aufs Handy, wenn sich etwas tut",
        items: [
          "Wer eine Rückfrage in einen Vorgang schreibt, erreicht damit auch die andere Seite: sie bekommt eine Nachricht aufs Handy, ohne dass jemand die App offen haben muss. Das gilt in beide Richtungen — die Antwort des Zuweisers meldet sich beim Empfänger genauso.",
          "Ebenso melden sich die Statuswechsel: als erledigt gemeldet, zur Abnahme, abgenommen, abgelehnt, zurückgegeben, zurückgezogen und wieder geöffnet.",
          "Benachrichtigt werden ausschließlich die beiden Beteiligten eines Vorgangs. Wer über sein Ressort nur mitliest, bekommt nichts — er muss ja auch nichts tun.",
          "Die Nachricht nennt weder den Titel der Aufgabe noch einen Namen noch den Wortlaut der Rückfrage: sie steht auf dem Sperrbildschirm, den auch jemand anders sehen kann. Was genau passiert ist, steht in der App.",
          "Eingeschaltet wird das in der Tools-Übersicht unter „Mein Konto“ — mit demselben Schalter, über den auch neue Aufgaben gemeldet werden. Wer ihn ausschaltet, bekommt auch das hier nicht."
        ]
      },
      {
        title: "An eine Aufgabe erinnern",
        items: [
          "Offene Aufgaben haben einen Knopf „🔔 Erinnern“. Ein Druck darauf schickt dem Empfänger dieselbe E-Mail wie beim Zuweisen noch einmal — und zusätzlich eine Nachricht aufs Handy, wenn er dafür ein Gerät angemeldet hat.",
          "Den Knopf sieht, wer die Aufgabe gestellt hat, sowie wer die Vereinsaufgaben administrieren darf. Er steht in jeder Aufgabenliste rechts in der Zeile und außerdem im geöffneten Vorgang.",
          "Nur bei offenen Aufgaben: eine bereits als erledigt gemeldete wartet auf die Abnahme des Zuweisers, nicht auf den Empfänger. An die eigene Aufgabe kann man sich nicht selbst erinnern.",
          "Höchstens eine Erinnerung alle zwölf Stunden je Aufgabe. Sonst wäre der Knopf ein Störsender, und mehrere gleiche Nachrichten hintereinander liest ohnehin niemand mehr.",
          "Jede Erinnerung steht im Verlauf des Vorgangs, mit Zeitpunkt und Namen. Die E-Mail nennt bei einer vertraulichen Aufgabe weder Titel noch Beschreibung."
        ]
      },
      {
        title: "Ressorts und Zuständigkeiten",
        items: [
          "Jedes Ressort hat eine Zuständigkeitsbeschreibung, genau einen Verantwortlichen, einen Stellvertreter und weitere Mitglieder. Damit ist auch ohne offene Aufgabe beantwortet, wer wofür zuständig ist.",
          "Zuweisen darf, wer ein Ressort verantwortet oder vertritt — und zwar an die Mitglieder seines Ressorts. Wer die App administriert, weist jedem zu.",
          "Beim Ausscheiden lassen sich alle offenen Aufgaben einer Person in einem Schritt auf jemand anderen übertragen. Erledigtes bleibt beim ursprünglichen Bearbeiter stehen."
        ]
      },
      {
        title: "Klubzertifizierung",
        items: [
          "Der Reiter „Zertifizierung“ führt alle 78 Kriterien des Verbandes: 29 Basiskriterien, die alle erfüllt sein müssen, und 49 Zusatzkriterien. Beide Listen sind nach den drei Bereichen Spielbetrieb, Organisation & Strategie und Vereinskultur gegliedert und werden zum Aufklappen angeboten.",
          "Zwei Balken oben zeigen den Stand: wie viele Basiskriterien erfüllt sind und wie viele Zusatzkriterien. Eine Schwelle, ab der die Zertifizierung „geschafft“ wäre, zeigt die App bewusst nicht — die Regel dafür liegt beim Verband.",
          "Jedes Kriterium steht mit dem Wortlaut des Verbandes da und lässt sich auf „Erfüllt“ setzen. Bei den Zusatzkriterien gibt es zusätzlich „Passt nicht zu uns“ — damit fällt ein Punkt aus der Rechnung, den der Verein nie anbieten will, etwa Walking Football. Bei den Basiskriterien gibt es das nicht, die sind das Pflichtprogramm.",
          "„In Arbeit“ zeigt die App von selbst an, sobald an einem offenen Kriterium noch eine Aufgabe hängt. Es ist kein Status, den jemand pflegen muss.",
          "Zu jedem Kriterium lassen sich eine Notiz und beliebige Nachweis-Dateien hinterlegen — wo das Dokument liegt, wer es gemacht hat, wann es beschlossen wurde. Nichts davon ist Pflicht, um ein Kriterium als erfüllt zu setzen.",
          "Jedes Kriterium kann einem Ressort zugeordnet werden. Über den Filter oben lässt sich dann alles anzeigen, was zu einem Ressort gehört — praktisch für ein Vorstandsgespräch. Ein Filter „Nur offene zeigen“ blendet aus, was schon erledigt oder abgelegt ist; wie viele Kriterien dabei verschwinden, steht daneben.",
          "Die 78 Kriterien stammen aus den beiden Anhängen der Clubberatung vom 28. April 2026. Sie stehen fest in der App und sind nicht änderbar — es ist eine Liste des Verbandes, kein Vereinsinhalt. Ändert der Verband etwas, wird die Liste nachgezogen; der bisherige Bearbeitungsstand bleibt erhalten."
        ]
      },
      {
        title: "Aufgaben und Bericht zur Zertifizierung",
        items: [
          "An jedem Kriterium lassen sich Aufgaben anlegen: was zu tun ist, wer es macht und bis wann. Die Frist ist hier freiwillig — manche Schritte haben einen echten Termin, viele nicht. Ein Kriterium kann mehrere Aufgaben haben, zum Beispiel „Leitbild schreiben“ und „Leitbild in der Versammlung verabschieden“.",
          "Abhaken darf die zuständige Person, wer die Aufgabe angelegt hat, und wer die App administriert. Es gibt hier keine Abnahme und kein Ablehnen — ein Haken ist ein Haken.",
          "⚠️ Diese Aufgaben verschicken bewusst KEINE E-Mail und keine Nachricht aufs Handy. Wer eine Aufgabe verteilt, muss der Person selbst Bescheid sagen; sie findet sie danach im Reiter am Kriterium.",
          "Das sind absichtlich nicht die normalen Vereinsaufgaben aus derselben App: dort ist eine Frist Pflicht und es gibt eine Abnahme. Ein Kriterium hat aber keinen Fristenlauf — es ist erfüllt oder nicht.",
          "Der Knopf „Bericht drucken“ öffnet eine saubere Seite mit allen 78 Kriterien, ihrem Status, den Notizen und den noch offenen Aufgaben. Daraus lässt sich mit Strg+P ein PDF machen.",
          "Der Bericht zeigt immer den vollständigen Stand, nicht die gerade gefilterte Ansicht — ein gefilterter Ausdruck würde beim Termin täuschen."
        ]
      },
      {
        title: "Übersicht, Filter und Export",
        items: [
          "Startbild ist die Personenübersicht „Wer tut was“: je Funktionär offen, überfällig und erledigt auf einen Blick, aufklappbar bis zur einzelnen Aufgabe. Daneben eine Gesamtliste, filterbar nach Person, Ressort, Status und Frist.",
          "Jede Aufgabenliste hat einen eigenen Statusfilter, und der steht von sich aus auf „Offen und zur Abnahme“. Erledigte, abgelehnte und zurückgezogene Vorgänge liegen damit nicht auf der täglichen Arbeitsliste — sie sind einen Klick entfernt und bleiben dauerhaft erhalten.",
          "Neben jedem Filter steht, wie viel gerade ausgeblendet ist — etwa „12 von 30 · 18 ausgeblendet“. Nichts verschwindet stillschweigend.",
          "Die Zahlen am Kopf jeder Person und die Zahl am Reiter „Meine Aufgaben“ zählen immer den echten Bestand. Sie ließen sich sonst durch eine Filterwahl kleinrechnen.",
          "Das rote Dreieck für „hohe Priorität“ steht nur an offenen Aufgaben. Es ist ein Hinweis zum Handeln — an einer erledigten Aufgabe wäre es eine Warnung, auf die niemand mehr reagieren kann.",
          "Druckansicht und CSV-Export der gerade gefilterten Liste."
        ]
      },
      {
        title: "Nachvollziehbarkeit",
        items: [
          "Jede nachträgliche Änderung an Titel, Beschreibung, Frist oder Priorität wird am Vorgang protokolliert — mit altem und neuem Wert.",
          "Der Empfänger kann eine Aufgabe abhaken, ablehnen, kommentieren und einen Nachweis hochladen, ihren Text aber nie ändern.",
          "Gelöschte Aufgaben erscheinen im Protokoll der Verwaltung mit Zeitpunkt, Person und dem Status zum Zeitpunkt der Löschung.",
          "Bei vertraulichen Aufgaben sehen Unbeteiligte nur Empfänger, Frist und Status. Der Text wird schon auf dem Server entfernt und nicht bloß am Bildschirm ausgeblendet.",
          "Jede Änderung am Status eines Zertifizierungs-Kriteriums und an seiner Ressort-Zuordnung wird mit Zeitpunkt und Person festgehalten."
        ]
      },
      {
        title: "Wer darf was",
        items: [
          "Sehen: die eigenen Aufgaben und die des eigenen Ressorts.",
          "Bearbeiten: Aufgaben zuweisen im eigenen Ressort, Druckansicht, CSV-Export und der Zertifizierungs-Bericht. Notiz, Nachweise, Ressort-Zuordnung und Aufgaben an einem Kriterium pflegt ebenfalls jeder mit Bearbeiten-Recht.",
          "Administrieren: Ressorts pflegen, jedem zuweisen, Aufgaben übertragen, ändern, zurückziehen, löschen, das Protokoll einsehen — und den Status eines Zertifizierungs-Kriteriums setzen. „Erfüllt“ ist die Aussage, die der Verein dem Verband gegenüber macht; die soll nicht jeder setzen können.",
          "Abnehmen und zur Nacharbeit zurückgeben darf ausschließlich die Person, die die Aufgabe gestellt hat — auch Administrieren nicht an ihrer Stelle. Sonst könnte jemand eine Aufgabe, die ihm selbst gestellt wurde, erst als erledigt melden und sich anschließend selbst abnehmen; die verlangte Prüfung fände nie statt.",
          "Wieder öffnen darf, wer die Aufgabe gestellt hat, und wer administriert — dieselbe Regel wie beim Zurückziehen. Ein Wiedereröffnen ist eine Korrektur, kein Urteil über geleistete Arbeit.",
          "Als zuständige Person für eine Kriteriums-Aufgabe kommen nur Leute in Frage, die Zugang zu dieser App haben. Wer sie nicht sieht, würde von seiner Aufgabe nie erfahren und könnte sie auch nicht abhaken.",
          "Der Reiter „Info“ ist für alle sichtbar."
        ]
      },
      {
        title: "Abgrenzung und Bedienung am Handy",
        items: [
          "Hier steht, was einem anderen aufgetragen wird — mit Frist, Zuständigkeit und Abnahme. Was man sich selbst notiert, gehört in „Meine ToDos“ in der Kopfzeile der Tools-Übersicht. Zwei Orte für dieselbe Sache wären eine Doppelung.",
          "Die Ansicht ist für das Handy gebaut und funktioniert dort vollständig.",
          "Eingabefelder sind mindestens 16 Pixel groß, damit der iPhone-Browser beim Antippen nicht ungefragt in die Seite hineinzoomt und verschoben stehen bleibt.",
          "Endet die Anmeldung, während die App offen ist, erscheint der Hinweis „bitte neu anmelden“ — und der Bildschirm dahinter wird samt aller Dialoge und der Druckansicht geleert, damit nichts für den Nächsten am selben Rechner stehen bleibt. Der Weg zurück ist ein Neuladen der Seite."
        ]
      }
    ]
  }
];

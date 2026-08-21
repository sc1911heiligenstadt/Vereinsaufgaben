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

const APP_CHANGELOG = [
  {
    version: "1.5",
    groups: [
      {
        title: "Der richtige Vereinsname",
        items: [
          "Im Ausdruck der Klubzertifizierung stand „1. SC 1911 Heilbad Heiligenstadt“ — ohne Rechtsform und mit dem Ortsnamen im Vereinsnamen. Richtig ist „1. SC 1911 Heiligenstadt e.V.“, und so steht es jetzt dort."
        ]
      }
    ]
  },
  {
    version: "1.4",
    groups: [
      {
        title: "Am Handy",
        items: [
          "Bisher brach die Reiterleiste selbst um, die rechte Reiter-Gruppe darin aber nicht: Sie rutschte als ein Stück in die zweite Zeile und lief dort weiter über den rechten Rand hinaus. Jetzt bricht auch sie um, sobald sie zu breit wird. Zu sehen ist das nur, wenn genug Reiter nebeneinanderstehen — bis dahin sieht alles aus wie bisher."
        ]
      }
    ]
  },
  {
    version: "1.3",
    groups: [
      {
        title: "An eine Aufgabe erinnern",
        items: [
          "Offene Aufgaben haben jetzt einen Knopf „🔔 Erinnern“. Ein Druck darauf schickt dem Empfänger dieselbe E-Mail wie beim Zuweisen noch einmal — und zusätzlich eine Nachricht aufs Handy, wenn er dafür ein Gerät angemeldet hat.",
          "Den Knopf sieht, wer die Aufgabe gestellt hat, sowie wer die Vereinsaufgaben administrieren darf. Er steht in jeder Aufgabenliste rechts in der Zeile und außerdem im geöffneten Vorgang.",
          "Nur bei offenen Aufgaben: eine bereits als erledigt gemeldete wartet auf deine Abnahme, nicht auf den Empfänger. An die eigene Aufgabe kann man sich nicht selbst erinnern.",
          "Höchstens eine Erinnerung alle zwölf Stunden je Aufgabe. Sonst wäre der Knopf ein Störsender, und mehrere gleiche Nachrichten hintereinander liest ohnehin niemand mehr.",
          "Jede Erinnerung steht im Verlauf des Vorgangs, mit Zeitpunkt und Namen. Die E-Mail nennt bei einer vertraulichen Aufgabe wie gehabt weder Titel noch Beschreibung."
        ]
      }
    ]
  },
  {
    version: "1.2",
    groups: [
      {
        title: "Erledigtes aus dem Weg",
        items: [
          "Jede Aufgabenliste hat jetzt einen eigenen Statusfilter, und der steht von sich aus auf „Offen und zur Abnahme“. Erledigte, abgelehnte und zurückgezogene Vorgänge liegen damit nicht mehr auf der täglichen Arbeitsliste — sie sind einen Klick entfernt und bleiben, wie versprochen, dauerhaft erhalten.",
          "Das betrifft die drei Listen, die bisher keinen Filter hatten: die aufgeklappten Vorgänge unter „Wer tut was“, „An mich gerichtet“ und „Von mir zugewiesen“. Der Reiter „Alle Aufgaben“ hatte ihn bereits.",
          "Neben jedem Filter steht, wie viel gerade ausgeblendet ist — etwa „12 von 30 · 18 ausgeblendet“. Nichts verschwindet stillschweigend.",
          "Die Zahlen am Kopf jeder Person und die Zahl am Reiter „Meine Aufgaben“ zählen weiter den echten Bestand. Sie ließen sich sonst durch eine Filterwahl kleinrechnen."
        ]
      },
      {
        title: "Kleinigkeit am Rand",
        items: [
          "Das rote Dreieck für „hohe Priorität“ steht nicht mehr an abgeschlossenen Aufgaben. Es ist ein Hinweis zum Handeln — an einer erledigten Aufgabe war es eine Warnung, auf die niemand mehr reagieren konnte."
        ]
      }
    ]
  },
  {
    version: "1.1",
    groups: [
      {
        title: "Klubzertifizierung",
        items: [
          "Neuer Reiter „Zertifizierung“ mit allen 78 Kriterien des Verbandes: 29 Basiskriterien, die alle erfüllt sein müssen, und 49 Zusatzkriterien. Beide Listen sind nach den drei Bereichen Spielbetrieb, Organisation & Strategie und Vereinskultur gegliedert und werden zum Aufklappen angeboten.",
          "Zwei Balken oben zeigen den Stand: wie viele Basiskriterien erfüllt sind und wie viele Zusatzkriterien. Eine Schwelle, ab der die Zertifizierung „geschafft“ wäre, zeigt die App bewusst nicht — die Regel dafür liegt beim Verband.",
          "Jedes Kriterium steht mit dem Wortlaut des Verbandes da und lässt sich auf „Erfüllt“ setzen. Bei den Zusatzkriterien gibt es zusätzlich „Passt nicht zu uns“ — damit fällt ein Punkt aus der Rechnung, den der Verein nie anbieten will, etwa Walking Football. Bei den Basiskriterien gibt es das nicht, die sind das Pflichtprogramm.",
          "„In Arbeit“ zeigt die App von selbst an, sobald an einem offenen Kriterium noch eine Aufgabe hängt. Es ist kein Status, den jemand pflegen muss.",
          "Zu jedem Kriterium lassen sich eine Notiz und beliebige Nachweis-Dateien hinterlegen — wo das Dokument liegt, wer es gemacht hat, wann es beschlossen wurde. Nichts davon ist Pflicht, um ein Kriterium als erfüllt zu setzen.",
          "Jedes Kriterium kann einem Ressort zugeordnet werden. Über den Filter oben lässt sich dann alles anzeigen, was zu einem Ressort gehört — praktisch für ein Vorstandsgespräch.",
          "Ein Filter „Nur offene zeigen“ blendet aus, was schon erledigt oder abgelegt ist. Wie viele Kriterien dabei verschwinden, steht daneben."
        ]
      },
      {
        title: "Aufgaben zu einem Kriterium",
        items: [
          "An jedem Kriterium lassen sich Aufgaben anlegen: was zu tun ist, wer es macht und bis wann. Die Frist ist hier freiwillig — manche Schritte haben einen echten Termin, viele nicht.",
          "Ein Kriterium kann mehrere Aufgaben haben, zum Beispiel „Leitbild schreiben“ und „Leitbild in der Versammlung verabschieden“.",
          "Abhaken darf die zuständige Person, wer die Aufgabe angelegt hat, und wer die App administriert. Es gibt hier keine Abnahme und kein Ablehnen — ein Haken ist ein Haken.",
          "⚠️ Diese Aufgaben verschicken bewusst KEINE E-Mail und keine Nachricht aufs Handy. Wer eine Aufgabe verteilt, muss der Person selbst Bescheid sagen; sie findet sie danach im Reiter am Kriterium.",
          "Das sind absichtlich nicht die normalen Vereinsaufgaben aus derselben App: dort ist eine Frist Pflicht und es gibt eine Abnahme. Ein Kriterium hat aber keinen Fristenlauf — es ist erfüllt oder nicht."
        ]
      },
      {
        title: "Bericht für den Verbandstermin",
        items: [
          "Der Knopf „Bericht drucken“ öffnet eine saubere Seite mit allen 78 Kriterien, ihrem Status, den Notizen und den noch offenen Aufgaben. Daraus lässt sich mit Strg+P ein PDF machen.",
          "Der Bericht zeigt immer den vollständigen Stand, nicht die gerade gefilterte Ansicht — ein gefilterter Ausdruck würde beim Termin täuschen.",
          "Wie beim CSV-Export der Aufgaben steht der Bericht ab dem Bearbeiten-Recht zur Verfügung."
        ]
      },
      {
        title: "Wer darf was in der Zertifizierung",
        items: [
          "Den Status eines Kriteriums setzt nur, wer die App administriert. „Erfüllt“ ist die Aussage, die der Verein dem Verband gegenüber macht — die soll nicht jeder setzen können.",
          "Notiz, Nachweise, Ressort-Zuordnung und Aufgaben pflegt jeder mit Bearbeiten-Recht.",
          "Als zuständige Person für eine Aufgabe kommen nur Leute in Frage, die Zugang zu dieser App haben. Wer sie nicht sieht, würde von seiner Aufgabe nie erfahren und könnte sie auch nicht abhaken.",
          "Jede Änderung am Status und an der Ressort-Zuordnung wird am Kriterium mit Zeitpunkt und Person festgehalten."
        ]
      },
      {
        title: "Woher die Liste kommt",
        items: [
          "Die 78 Kriterien stammen aus den beiden Anhängen der Clubberatung vom 28. April 2026. Sie stehen fest in der App und sind nicht änderbar — es ist eine Liste des Verbandes, kein Vereinsinhalt.",
          "Ändert der Verband etwas, wird die Liste in der App nachgezogen. Der bisherige Bearbeitungsstand bleibt dabei erhalten."
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
          "Erledigte Aufgaben bleiben dauerhaft sichtbar. Es gibt keine automatische Löschfrist.",
          "Wer eine Aufgabe für falsch adressiert hält, lehnt sie mit Begründung ab, statt sie stillschweigend liegen zu lassen.",
          "Auf Wunsch muss der Zuweiser die Erledigung abnehmen. Die Aufgabe wartet dann als „Zur Abnahme“ und lässt sich mit Begründung zurückgeben."
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
        title: "Abgeschlossene Aufgaben wieder öffnen",
        items: [
          "Eine Aufgabe, die erledigt, abgelehnt oder zurückgezogen wurde, lässt sich über den Knopf „Wieder öffnen…“ im Vorgang zurück auf offen holen. Gedacht für den Fall, dass ein Abschluss ein Versehen war.",
          "Der Verlauf hält fest, aus welchem Zustand die Aufgabe zurückgeholt wurde und von wem. War eine Begründung hinterlegt — etwa der Grund einer Ablehnung —, wird sie in den Verlauf übernommen, bevor sie aus dem Vorgang verschwindet.",
          "Die Gegenseite bekommt eine Nachricht aufs Handy: die Aufgabe liegt wieder auf ihrem Tisch."
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
        title: "Nachvollziehbarkeit",
        items: [
          "Jede nachträgliche Änderung an Titel, Beschreibung, Frist oder Priorität wird am Vorgang protokolliert — mit altem und neuem Wert.",
          "Der Empfänger kann eine Aufgabe abhaken, ablehnen, kommentieren und einen Nachweis hochladen, ihren Text aber nie ändern.",
          "Gelöschte Aufgaben erscheinen im Protokoll der Verwaltung mit Zeitpunkt, Person und dem Status zum Zeitpunkt der Löschung.",
          "Bei vertraulichen Aufgaben sehen Unbeteiligte nur Empfänger, Frist und Status. Der Text wird schon auf dem Server entfernt und nicht bloß am Bildschirm ausgeblendet."
        ]
      },
      {
        title: "Übersicht",
        items: [
          "Startbild der Verwaltung ist die Personenübersicht: je Funktionär offen, überfällig und erledigt auf einen Blick, aufklappbar bis zur einzelnen Aufgabe.",
          "Daneben eine Gesamtliste, filterbar nach Person, Ressort, Status und Frist.",
          "Druckansicht und CSV-Export der gerade gefilterten Liste."
        ]
      },
      {
        title: "Wer darf was",
        items: [
          "Sehen: die eigenen Aufgaben und die des eigenen Ressorts.",
          "Bearbeiten: Aufgaben zuweisen im eigenen Ressort, Druckansicht und CSV-Export.",
          "Administrieren: Ressorts pflegen, jedem zuweisen, Aufgaben übertragen, ändern, zurückziehen, löschen und das Protokoll einsehen.",
          "Abnehmen und zur Nacharbeit zurückgeben darf ausschließlich die Person, die die Aufgabe gestellt hat — auch Administrieren nicht an ihrer Stelle. Sonst könnte jemand eine Aufgabe, die ihm selbst gestellt wurde, erst als erledigt melden und sich anschließend selbst abnehmen; die verlangte Prüfung fände nie statt.",
          "Wieder öffnen darf, wer die Aufgabe gestellt hat, und wer administriert — dieselbe Regel wie beim Zurückziehen. Ein Wiedereröffnen ist eine Korrektur, kein Urteil über geleistete Arbeit.",
          "Der Reiter „Info“ ist für alle sichtbar."
        ]
      },
      {
        title: "Abgrenzung zu den eigenen ToDos",
        items: [
          "Hier steht, was einem anderen aufgetragen wird — mit Frist, Zuständigkeit und Abnahme.",
          "Was man sich selbst notiert, gehört in „Meine ToDos“ in der Kopfzeile der Tools-Übersicht. Zwei Orte für dieselbe Sache wären eine Doppelung."
        ]
      },
      {
        title: "Bedienung am Handy",
        items: [
          "Die Ansicht ist für das Handy gebaut und funktioniert dort vollständig.",
          "Eingabefelder sind mindestens 16 Pixel groß, damit der iPhone-Browser beim Antippen nicht ungefragt in die Seite hineinzoomt und verschoben stehen bleibt."
        ]
      }
    ]
  }
];

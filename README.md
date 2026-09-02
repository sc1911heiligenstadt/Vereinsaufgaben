# 🗂️ Vereinsaufgaben

Was jemand einem anderen aufträgt — mit Frist, Zuständigkeit und dauerhaft
einsehbarer Historie. Dazu die Struktur dahinter: welches **Ressort** wofür
zuständig ist, wer es verantwortet, und wie die **Klubzertifizierung** des
Verbandes steht.

> Was du dir **selbst** notierst, gehört weiterhin in die persönliche
> Aufgabenliste auf der Startseite der Tools-Übersicht. Hier steht ausschließlich,
> was jemand einem **anderen** aufträgt.

**➡️ [Vereinsaufgaben öffnen](https://sc1911heiligenstadt.github.io/Vereinsaufgaben/)**

## Was drin ist

| Reiter | Wofür |
|---|---|
| **Übersicht** | „Wer tut was“: je Funktionär offen, überfällig und erledigt, aufklappbar bis zur einzelnen Aufgabe |
| **Meine Aufgaben** | Was **an mich** gerichtet ist und was **von mir** zugewiesen wurde |
| **Alle Aufgaben** | Die Gesamtsicht, filterbar nach Person, Ressort, Status und Frist — dazu Druckansicht und CSV-Export |
| **Ressorts** | Wer tut was: Zuständigkeiten, Verantwortliche, Vertretung, Mitarbeit |
| **Zertifizierung** | Die Kriterien des Verbandes nach Bereich, je mit Status, Notiz, Nachweisen und offenen Aufgaben — dazu der Bericht zum Ausdrucken |
| **Verwaltung** | Ressorts pflegen, Amtsübergabe und Protokoll |
| **Info** | Was die App kann, die Änderungen und der Datenschutzhinweis — für alle sichtbar |

Jede Aufgabenliste hat einen eigenen **Statusfilter**, der von sich aus auf „Offen und zur
Abnahme“ steht. Erledigtes bleibt dauerhaft erhalten, liegt aber nicht auf der täglichen
Arbeitsliste. Daneben steht immer, wie viel gerade ausgeblendet ist.

Offene Aufgaben lassen sich mit **🔔 Erinnern** anstoßen: E-Mail und Nachricht aufs Handy
gehen noch einmal an den Empfänger, höchstens alle zwölf Stunden je Aufgabe. Und ein
versehentlich abgeschlossener Vorgang lässt sich über **Wieder öffnen…** zurückholen.

## Ressorts und Amtsübergabe

Jedes Ressort hat **genau einen Verantwortlichen**, dazu Vertretung und
Mitarbeitende. Wechselt das Amt, läuft das über die **Amtsübergabe** — die
Aufgaben verschwinden aus den Listen des Vorgängers, bleiben aber in der
Historie nachlesbar. Nichts geht dabei verloren, und niemand muss raten, wer
vorher zuständig war.

## Klubzertifizierung

Der Reiter **Zertifizierung** bildet alle 78 Kriterien des Verbandes ab — 29 Basis- und
49 Zusatzkriterien, nach Bereichen sortiert. Zu jedem Kriterium lassen sich Status, Notiz,
Nachweis-Dateien und eine Ressort-Zuordnung führen, dazu eigene kleine Aufgaben mit
freiwilliger Frist. Der Knopf **Bericht drucken** gibt den vollständigen Stand als saubere
Seite aus — zum Ausdrucken oder als PDF für den Verbandstermin.

> Die Aufgaben an einem Kriterium verschicken bewusst **keine** E-Mail und keine Nachricht
> aufs Handy. Wer eine verteilt, sagt der Person selbst Bescheid.

## Zugang

Die Anmeldung läuft über die [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) — dort einmal anmelden, danach ist dieses Werkzeug offen.

Die Rechte gelten in drei Stufen: **Sehen** (Aufgaben, Ressorts und den
Zertifizierungsstand ansehen), **Bearbeiten** (Aufgaben zuweisen und bearbeiten,
Druckansicht, CSV-Export und der Zertifizierungs-Bericht) und **Administrieren** (Reiter
*Verwaltung* mit Ressorts, Amtsübergabe und Protokoll — dazu der Status eines
Zertifizierungs-Kriteriums). Wer welche Stufe hat, legt die Tools-Übersicht fest.

Abnehmen und zur Nacharbeit zurückgeben darf ausschließlich die Person, die die Aufgabe
gestellt hat — Administrieren zählt dort ausdrücklich **nicht** mit.

## Lokal starten

Über den Eintrag `vereinsaufgaben` in `E:\.claude\launch.json` — der Server läuft dann auf `http://localhost:8809/`.

## Technik

Vanilla JavaScript ohne Build-Schritt — die Dateien werden so ausgeliefert, wie sie im Repo liegen. Veröffentlicht über GitHub Pages. Die Daten liegen in der Vereins-Nextcloud; der Zugriff läuft ausschließlich über den Login-Worker der Tools-Übersicht, nie mit Zugangsdaten im Browser.

---

Ein Werkzeug des 1. SC 1911 Heiligenstadt. Alle Werkzeuge auf einen Blick: [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) · Erklärungen im [Toolbox Wiki](https://sc1911heiligenstadt.github.io/Vereinswiki/).

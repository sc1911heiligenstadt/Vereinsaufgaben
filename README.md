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
| **Übersicht** | Der Stand auf einen Blick |
| **Meine Aufgaben** | Was **an mich** gerichtet ist und was **von mir** zugewiesen wurde |
| **Alle Aufgaben** | Die Gesamtsicht, inklusive Protokoll |
| **Ressorts** | Wer tut was: Zuständigkeiten, Verantwortliche, Vertretung, Mitarbeit — und die Amtsübergabe |
| **Zertifizierung** | Die Kriterien des Verbandes nach Bereich, je mit Status, Notiz und offenen Punkten |
| **Verwaltung** | Ressorts pflegen, Bericht und Export |

## Ressorts und Amtsübergabe

Jedes Ressort hat **genau einen Verantwortlichen**, dazu Vertretung und
Mitarbeitende. Wechselt das Amt, läuft das über die **Amtsübergabe** — die
Aufgaben verschwinden aus den Listen des Vorgängers, bleiben aber in der
Historie nachlesbar. Nichts geht dabei verloren, und niemand muss raten, wer
vorher zuständig war.

## Klubzertifizierung

Der Reiter **Zertifizierung** bildet die Kriterien des Verbandes ab, nach
Bereichen sortiert. Zu jedem Kriterium lassen sich Status und Notiz führen, und
die offenen Punkte stehen zusammengefasst — damit vor der nächsten Prüfung klar
ist, woran noch gearbeitet werden muss.

## Zugang

Die Anmeldung läuft über die [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) — dort einmal anmelden, danach ist dieses Werkzeug offen.

Die Rechte gelten in drei Stufen: **Sehen** (Aufgaben und Ressorts ansehen),
**Bearbeiten** (Aufgaben zuweisen und bearbeiten) und **Administrieren** (Reiter
*Verwaltung*: Ressorts pflegen, Bericht und Export). Wer welche Stufe hat, legt
die Tools-Übersicht fest.

## Lokal starten

Über den Eintrag `vereinsaufgaben` in `E:\.claude\launch.json` — der Server läuft dann auf `http://localhost:8809/`.

## Technik

Vanilla JavaScript ohne Build-Schritt — die Dateien werden so ausgeliefert, wie sie im Repo liegen. Veröffentlicht über GitHub Pages. Die Daten liegen in der Vereins-Nextcloud; der Zugriff läuft ausschließlich über den Login-Worker der Tools-Übersicht, nie mit Zugangsdaten im Browser.

---

Ein Werkzeug des 1. SC 1911 Heiligenstadt. Alle Werkzeuge auf einen Blick: [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) · Erklärungen im [Toolbox Wiki](https://sc1911heiligenstadt.github.io/Vereinswiki/).

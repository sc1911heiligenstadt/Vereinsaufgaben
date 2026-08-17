// Persistenz über das zentrale ToolsUebersicht-Login-Gateway.
//
// ABWEICHUNG vom üblichen Gateway-Muster: diese App nutzt NICHT dav-load/dav-save.
// "vereinsaufgaben" steht bewusst nicht in DAV_APPS des Workers — es gibt also gar
// keinen generischen Schreibweg auf die Datendatei. Grund: die Regeln dieser App
// (Empfänger darf nur abhaken, nicht umschreiben; vertrauliche Texte verlassen den
// Worker für Unbeteiligte nicht; Lösch- und Änderungsprotokoll sind fälschungssicher)
// lassen sich nur serverseitig durchsetzen. Ein dav-save, das die ganze Datei
// entgegennimmt, wäre die offene Hintertür zu allen dreien.
//
// Jede Aktion hier hat deshalb ein Gegenstück in admin-worker.js, das Rechte,
// Beteiligung und Statusübergänge selbst prüft.
const GATEWAY_URL = "https://landingpage.michel-brunner.workers.dev";
const TOKEN_STORAGE_KEY = "tu_session_token";
const GATEWAY_APP_ID = "vereinsaufgaben";

class NotLoggedInError extends Error {
  constructor(message) {
    super(message || "Nicht angemeldet");
    this.name = "NotLoggedInError";
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message || "Daten wurden zwischenzeitlich von einem anderen Gerät geändert");
    this.name = "ConflictError";
  }
}

function getSessionToken() {
  try { return localStorage.getItem(TOKEN_STORAGE_KEY); } catch (_) { return null; }
}

async function gatewayRequest(payload) {
  const token = getSessionToken();
  if (!token) throw new NotLoggedInError();
  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(payload)
  });
  if (resp.status === 401) throw new NotLoggedInError("Sitzung abgelaufen");
  if (resp.status === 409) throw new ConflictError();
  // 400/403 tragen eine sprechende Begründung aus dem Worker (z.B. "Nur der
  // Empfänger darf abhaken") — die ist für den Nutzer wertvoller als ein
  // generischer Text und wird deshalb durchgereicht statt ersetzt.
  if (!resp.ok) {
    let msg = `Gateway-Fehler (HTTP ${resp.status})`;
    try {
      const body = await resp.json();
      if (body && body.error) msg = body.error;
    } catch (_) { /* Antwort ohne JSON-Körper — Standardtext bleibt */ }
    throw new Error(msg);
  }
  return resp.json();
}

// ---------- Laden ----------

// Liefert { ressorts, aufgaben, protokoll, me, personen }. Der Worker filtert dabei
// selbst: vertrauliche Texte fehlen für Unbeteiligte bereits in der Antwort, das
// Protokoll kommt nur mit Administrieren-Recht mit.
async function ladeAlles() {
  return gatewayRequest({ action: "vereinsaufgaben-load", app: GATEWAY_APP_ID });
}

// ---------- Ressorts (Administrieren) ----------

async function speichereRessort(ressort) {
  return gatewayRequest({ action: "vereinsaufgaben-ressort-speichern", app: GATEWAY_APP_ID, ressort });
}

async function loescheRessort(id) {
  return gatewayRequest({ action: "vereinsaufgaben-ressort-loeschen", app: GATEWAY_APP_ID, id });
}

// ---------- Aufgaben ----------

// modus: "person" (empfaenger: [usernames]) | "ressort" (an den Verantwortlichen)
// | "ressort-einzeln" (fächert je Mitglied auf).
async function legeAufgabeAn(daten) {
  return gatewayRequest({ action: "vereinsaufgabe-anlegen", app: GATEWAY_APP_ID, ...daten });
}

// Nur Titel/Beschreibung/Frist/Priorität, nur Zuweiser oder Administrieren.
// Jede Änderung schreibt der Worker in den Verlauf der Aufgabe.
async function aendereAufgabe(id, felder) {
  return gatewayRequest({ action: "vereinsaufgabe-aendern", app: GATEWAY_APP_ID, id, felder });
}

// aktion: "erledigt" | "gemeldet" | "abgelehnt" | "abgenommen" | "zurueckgegeben"
async function setzeStatus(id, aktion, grund) {
  return gatewayRequest({ action: "vereinsaufgabe-status", app: GATEWAY_APP_ID, id, aktion, grund: grund || "" });
}

async function zieheAufgabeZurueck(id, grund) {
  return gatewayRequest({ action: "vereinsaufgabe-zurueckziehen", app: GATEWAY_APP_ID, id, grund: grund || "" });
}

// Holt eine abgeschlossene Aufgabe (erledigt/abgelehnt/zurueckgezogen) zurueck auf
// "offen". Rechte wie beim Zurueckziehen — der Server prueft es noch einmal.
async function reaktiviereAufgabe(id) {
  return gatewayRequest({ action: "vereinsaufgabe-reaktivieren", app: GATEWAY_APP_ID, id });
}

async function loescheAufgabe(id) {
  return gatewayRequest({ action: "vereinsaufgabe-loeschen", app: GATEWAY_APP_ID, id });
}

async function schreibeKommentar(id, text) {
  return gatewayRequest({ action: "vereinsaufgabe-kommentar", app: GATEWAY_APP_ID, id, text });
}

// ---------- Anhänge ----------

// Die Dateien liegen in einem eigenen Nextcloud-Unterordner, den dav-file-get NICHT
// erreicht (die App steht nicht in DAV_APPS). Zugriff ausschließlich über die
// Aktionen hier, die die Datei-Id immer aus der Aufgabe auflösen — nie aus dem Body,
// sonst käme man mit einer geratenen Id an der Beteiligtenprüfung vorbei.
async function ladeAnhangHoch(aufgabeId, name, art, dataUrl) {
  return gatewayRequest({
    action: "vereinsaufgabe-datei-put", app: GATEWAY_APP_ID,
    id: aufgabeId, name, art, daten: dataUrl
  });
}

// Liefert einen Blob, keine JSON: der Worker reicht die Bytes durch, statt sie als
// base64 zu verpacken (das würde bei mehreren Megabyte sein CPU-Limit reißen).
// Deshalb hier ein eigener fetch statt gatewayRequest, das immer JSON erwartet.
async function holeAnhang(aufgabeId, fileId) {
  const token = getSessionToken();
  if (!token) throw new NotLoggedInError();
  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ action: "vereinsaufgabe-datei-get", app: GATEWAY_APP_ID, id: aufgabeId, fileId })
  });
  if (resp.status === 401) throw new NotLoggedInError("Sitzung abgelaufen");
  if (!resp.ok) {
    let msg = `Anhang konnte nicht geladen werden (HTTP ${resp.status})`;
    try { const b = await resp.json(); if (b && b.error) msg = b.error; } catch (_) { /* kein JSON-Körper */ }
    throw new Error(msg);
  }
  return resp.blob();
}

async function loescheAnhang(aufgabeId, fileId) {
  return gatewayRequest({ action: "vereinsaufgabe-datei-loeschen", app: GATEWAY_APP_ID, id: aufgabeId, fileId });
}

// ---------- Amtsübergabe (Administrieren) ----------

async function uebergebeAufgaben(vonUser, aufUser) {
  return gatewayRequest({ action: "vereinsaufgaben-uebergabe", app: GATEWAY_APP_ID, vonUser, aufUser });
}

// ---------- Klubzertifizierung ----------
//
// Eigene Datei (`zertifizierung.json`) und eigene Aktionen, obwohl es derselbe Tab
// derselben App ist. Grund für die getrennte Datei: die Aufgaben werden im Alltag
// laufend geschrieben, der Zertifizierungsstand selten — ein If-Match-Konflikt beim
// Abhaken soll nicht den Kriterienstand zurückwerfen.
//
// Der Kriterienkatalog selbst steht in `kriterien.js` und ist dem Worker unbekannt.
// Der prüft nur die FORM der Kriterium-Id und leitet aus ihrem Präfix ab, ob es ein
// Basis- oder Zusatzkriterium ist — eine zweite Kopie der 78 Kriterien im Worker
// wäre auseinandergelaufen.

// Liefert { kriterien, aufgaben, namen, me }. Wird erst beim ersten Wechsel in den
// Tab gerufen, nicht beim Seitenstart: es ist ein eigener Nextcloud-Read, und die
// Mehrheit öffnet den Tab nie.
async function ladeZertifizierung() {
  return gatewayRequest({ action: "zertifizierung-load", app: GATEWAY_APP_ID });
}

// status: "offen" | "erfuellt" | "nichtrelevant" — Letzteres nur bei Zusatzkriterien.
// Nur mit Administrieren-Recht; der Worker prüft es noch einmal.
async function setzeZertStatus(kritId, status) {
  return gatewayRequest({ action: "zertifizierung-status", app: GATEWAY_APP_ID, kritId, status });
}

// Ein FEHLENDES Feld heißt „unverändert", ein leeres leert. Deshalb werden hier
// beide immer mitgeschickt — die Maske speichert sie gemeinsam.
async function speichereZertNotiz(kritId, notiz, ressortId) {
  return gatewayRequest({ action: "zertifizierung-notiz", app: GATEWAY_APP_ID, kritId, notiz, ressortId });
}

async function legeZertAufgabeAn(kritId, titel, empfaenger, faellig) {
  return gatewayRequest({ action: "zertifizierung-aufgabe-anlegen", app: GATEWAY_APP_ID, kritId, titel, empfaenger, faellig });
}

async function aendereZertAufgabe(id, titel, empfaenger, faellig) {
  return gatewayRequest({ action: "zertifizierung-aufgabe-aendern", app: GATEWAY_APP_ID, id, titel, empfaenger, faellig });
}

async function setzeZertAufgabeErledigt(id, erledigt) {
  return gatewayRequest({ action: "zertifizierung-aufgabe-status", app: GATEWAY_APP_ID, id, erledigt: !!erledigt });
}

async function loescheZertAufgabe(id) {
  return gatewayRequest({ action: "zertifizierung-aufgabe-loeschen", app: GATEWAY_APP_ID, id });
}

async function ladeZertNachweisHoch(kritId, name, dataUrl) {
  return gatewayRequest({ action: "zertifizierung-datei-put", app: GATEWAY_APP_ID, kritId, name, daten: dataUrl });
}

// Liefert einen Blob, keine JSON — wie holeAnhang(): der Worker reicht die Bytes
// durch, statt sie als base64 zu verpacken.
async function holeZertNachweis(kritId, fileId) {
  const token = getSessionToken();
  if (!token) throw new NotLoggedInError();
  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ action: "zertifizierung-datei-get", app: GATEWAY_APP_ID, kritId, fileId })
  });
  if (resp.status === 401) throw new NotLoggedInError("Sitzung abgelaufen");
  if (!resp.ok) {
    let msg = `Nachweis konnte nicht geladen werden (HTTP ${resp.status})`;
    try { const b = await resp.json(); if (b && b.error) msg = b.error; } catch (_) { /* kein JSON-Körper */ }
    throw new Error(msg);
  }
  return resp.blob();
}

async function loescheZertNachweis(kritId, fileId) {
  return gatewayRequest({ action: "zertifizierung-datei-loeschen", app: GATEWAY_APP_ID, kritId, fileId });
}

// ---------- Personen ----------

// Empfängerpicker: nur wer diese App bearbeiten darf, kann eine Aufgabe je abhaken.
// Bestehende Worker-Aktion, kein neuer Endpunkt (gleiches Muster wie der
// Vertreter-Picker im Abwesenheitskalender).
async function ladeMoeglicheEmpfaenger() {
  return gatewayRequest({ action: "list-tool-editors", app: GATEWAY_APP_ID });
}

// Liefert {username, isAdmin, groupIds, vorname, nachname, canEdit, canAdmin}.
async function fetchMe() {
  return gatewayRequest({ action: "me", app: GATEWAY_APP_ID });
}

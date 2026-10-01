---
titel: Anmeldung
gruppe: muster
kurz: Der Weg ins Konto: E-Mail und Passwort, zweiter Faktor, zurücksetzen und bremsen.
stichworte: [anmeldung, login, einloggen, passwort, passwort vergessen, zwei-faktor, 2fa, magic link, passkey, pin, sitzung, konto]
bausteine: [anmeldung, aktion-knopf]
demo: [anmeldung]
stand: 2026-10-02
---

## Wofür

Die Anmeldung ist die Tür zur App. Sie muss für Berechtigte schnell gehen und
für alle anderen langsam. Sie verrät nicht, wer ein Konto hat, und sie ist so
gebaut, dass Passwortmanager und Screenreader ohne Umwege funktionieren. Jeder
zusätzliche Weg ins Konto (Link, Code, PIN) bekommt dieselbe Härtung wie der
erste.

## Aufbau

Wie im Baustein `anmeldung`, eine schmale Spalte, höchstens 24rem breit:

- **Titel:** „Anmelden“ als Überschrift, sonst nichts darüber außer dem Logo.
- **E-Mail:** Label über dem Feld, `type="email"`,
  `autocomplete="username"`.
- **Passwort:** Label links, „Passwort vergessen?“ rechts in derselben Zeile.
  Im Feld rechts der Knopf „Anzeigen“ bzw. „Verbergen“. Darunter bei Bedarf
  „Die Feststelltaste ist an.“
- **Fehlerzeile:** zwischen Feldern und Knopf, mit Zeichen und Text, nie nur
  ein roter Rand.
- **Knopf:** „Anmelden“ über die ganze Breite, als `aktion-knopf` mit Laden,
  „Angemeldet“ und „Erneut versuchen“.
- **Code-Schritt (wenn ein zweiter Faktor aktiv ist):** Titel „Code eingeben“,
  ein Satz, woher der Code kommt, sechs einzelne Ziffernfelder, darunter
  „Zurück zur Anmeldung“.
- **Fertig:** „Angemeldet.“ und der Hinweis, wohin es weitergeht, dann die
  Weiterleitung.

## Funktionen

**Grundausstattung**
- E-Mail und Passwort mit Anzeigen-Knopf und Feststelltasten-Hinweis
- Passwort zurücksetzen per Link in einer Mail
- Neutrale Fehlermeldungen, die kein Konto verraten
- Bremse bei Fehlversuchen, je Konto und je Quelle

**Ausbau**
- Magic Link: Anmeldung über einen Link per Mail, ohne Passwort
- Code per Mail: 6 Ziffern statt Link, für Geräte, auf denen die Mail nicht
  liegt
- Authenticator-App als zweiter Faktor (6 Ziffern, wechseln alle 30 Sekunden),
  mit Wiederherstellungscodes beim Einrichten
- „Angemeldet bleiben“: längere Sitzung auf eigenen Geräten
- Passkey: Anmeldung mit Fingerabdruck, Gesicht oder Geräte-PIN, ohne Passwort

**Speziell**
- PIN auf einem vertrauten Gerät (Terminal in Werkstatt oder Lager), nur für
  freigegebene Geräte und Rollen
- Anmeldung mit dem Firmenkonto (Microsoft oder Google)
- Übersicht der aktiven Sitzungen mit „Überall abmelden“
- Zweiter Faktor Pflicht für bestimmte Rollen

## Worauf es ankommt

- **Fehler verraten nichts.** „E-Mail oder Passwort stimmt nicht.“ statt
  „Dieses Konto gibt es nicht.“ Beim Zurücksetzen: „Falls ein Konto mit dieser
  Adresse existiert, ist eine Mail unterwegs.“, auch wenn keines existiert.
  Der echte Grund steht im Server-Log.
- **Zwei Bremsen.** Fehlversuche zählen je Konto und je Quelle. Nur
  Fehlversuche zählen, ein Erfolg setzt zurück. Die Grenze je Quelle wird aus
  der Zahl der Menschen hergeleitet, die sich eine IP teilen (ein ganzes Büro),
  sonst sperrt ein normaler Montagmorgen alle aus. Die Bremsmeldung lautet für
  jede Adresse gleich.
- **Bremsen, wo die Anfrage ankommt.** Meldet sich der Browser direkt beim
  Auth-Dienst an, ist ein Zähler auf dem eigenen Server wirkungslos. Erst
  nachsehen, wessen Prozess die Anmeldung sieht.
- **Jeder Weg gleich hart.** Ein vierstelliger PIN neben einer Anmeldung mit
  zweitem Faktor macht den zweiten Faktor wertlos. Entweder der Nebenweg ist
  für die Rolle gesperrt, oder er verlangt denselben Faktor.
- **Passwortmanager nicht behindern.** Richtige `autocomplete`-Werte
  (`username`, `current-password`, `new-password`, `one-time-code`), Einfügen
  erlaubt, E-Mail und Passwort auf einer Seite.
- **Passwortregeln über Länge.** Mindestlänge (12 Zeichen) statt Pflicht zu
  Sonderzeichen und Großbuchstaben. Bekannte, geleakte Passwörter ablehnen.
- **Links und Codes laufen ab.** Magic Link und Code einmal gültig und mit
  kurzer Frist (zum Beispiel 15 Minuten), die Frist steht in der Mail.
- **Mails für Anmeldung kommen vom Auth-Dienst.** Magic Link, Bestätigung und
  Zurücksetzen verschickt meist der Auth-Dienst selbst, nicht der eigene
  Mailversand. Vor dem Start einen eigenen SMTP-Zugang dort eintragen und die
  Absenderadresse prüfen.
- **„Angemeldet bleiben“ ist eine Wahl.** Ohne Haken endet die Sitzung nach
  Stunden, mit Haken nach Wochen. Auf geteilten Geräten bleibt der Haken aus.

## Bewegung

- **Schrittwechsel:** Code-Schritt und Bestätigung gleiten um 24 px von rechts
  herein, `DAUER.md`, `KURVE.raus`. Grund: Man sieht, dass es vorwärts geht.
- **Falscher Code:** Das Codefeld schüttelt einmal waagerecht (8, 8, 5, 5 px,
  `DAUER.md`), leert sich, der Fokus springt ins erste Feld. Das ist das
  einzige Wackeln im Produkt, weil die sechs Felder selbst der Fehler sind.
- **Falsches Passwort:** kein Schütteln. Die Fehlerzeile erscheint, der
  `aktion-knopf` zeigt „Erneut versuchen“.
- **Knopf:** Laden, Erfolg und Fehler im Knopf selbst, keine Überlagerung
  der Seite.
- **Nicht bewegen:** Karte, Logo, Hintergrund. Kein Auftritt beim Laden der
  Seite, keine Endlosschleife im Hintergrund, kein Konfetti nach der
  Anmeldung.
- Bei „Bewegung reduzieren“ kein Schütteln und kein Gleiten, die Fehlerzeile
  und der Fokuswechsel bleiben.

## Zugänglichkeit

- Labels über den Feldern, nie Platzhalter als Label.
- Fehlerzeile mit `role="alert"`, Felder mit `aria-invalid` und
  `aria-describedby` auf die Fehlerzeile.
- Der Anzeigen-Knopf trägt `aria-pressed` und einen Text („Anzeigen“), kein
  Auge ohne Namen.
- Der Feststelltasten-Hinweis ist Text unter dem Feld, kein Zeichen allein.
- Codefelder als `role="group"` mit Namen „Sicherheitscode, 6 Ziffern“, jedes
  Feld „Ziffer 1“ bis „Ziffer 6“, `inputMode="numeric"`. Einfügen verteilt den
  Code auf alle Felder, jede Ziffer springt weiter, Rücktaste im leeren Feld
  springt zurück, mit der sechsten Ziffer wird geprüft.
- Nach dem Schrittwechsel liegt der Fokus im ersten Codefeld bzw. auf dem
  Titel der Bestätigung.
- Keine Rätsel zur Anmeldung (Bilder erkennen, Zeichen abtippen). Kopieren,
  Einfügen und Passwortmanager müssen gehen.
- Alle Knöpfe mindestens 44 px hoch, Codefelder mindestens 52 px.

## Typische Fehler

- „Kein Konto mit dieser E-Mail gefunden“: Die Anmeldung wird zur Abfrage
  der Kundenliste.
- Bremse nur je IP: Ein Büro sperrt sich gemeinsam aus.
- Bremse auf dem eigenen Server, obwohl der Browser direkt beim Auth-Dienst
  anmeldet.
- PIN-Anmeldung ohne zweiten Faktor neben einer Passwortanmeldung mit Faktor.
- Einfügen im Passwort- oder Codefeld gesperrt.
- E-Mail und Passwort auf zwei Seiten verteilt, der Passwortmanager füllt nur
  die erste.
- Magic-Link-Mails über den eingebauten Testversand des Auth-Dienstes: Sie
  kommen nicht an.
- Schütteln bei jedem Fehler, auch beim leeren Feld.

## Prüfliste

- [ ] Fehler und Zurücksetzen verraten nicht, ob ein Konto existiert
- [ ] Bremse je Konto und je Quelle, nur Fehlversuche, Reset bei Erfolg
- [ ] Jeder Anmeldeweg mit derselben Härtung
- [ ] `autocomplete` korrekt, Einfügen erlaubt, Anzeigen-Knopf und Feststelltaste
- [ ] Codefeld: 6 Ziffern, Einfügen, Auto-Weiter, Schütteln nur bei falschem Code
- [ ] Eigener SMTP beim Auth-Dienst, Links und Codes mit Frist
- [ ] `role="alert"`, Fokus nach Schrittwechsel, 44 px, still bei reduzierter Bewegung

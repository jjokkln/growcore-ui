---
titel: Formular
gruppe: muster
kurz: Anfragen und Eingaben aufnehmen, mit so wenig Feldern und Hürden wie möglich.
stichworte: [formular, kontaktformular, anfrage, eingabefeld, validierung, fehlermeldung, pflichtfeld, datenschutz, spamschutz, absenden]
bausteine: [aktion-knopf, aufklappen]
demo: [formular]
stand: 2026-10-02
---

## Wofür

Ein Formular ist der Moment, in dem aus einem Besucher eine Anfrage wird. Jedes
Feld kostet Abbrüche, jede unklare Fehlermeldung kostet Vertrauen. Die erste
Frage lautet deshalb nicht „Was wollen wir wissen?“, sondern „Was brauchen wir,
um sinnvoll zu antworten?“. Alles andere klärt das erste Gespräch.

## Aufbau

- **Eine Spalte.** Felder untereinander, in der Reihenfolge, in der man sie im
  Kopf beantwortet. Zwei Felder nebeneinander nur, wenn sie zusammengehören
  (PLZ und Ort, Vor- und Nachname).
- **Label über dem Feld,** Hilfetext direkt darunter, Fehlertext darunter.
  Abstand innerhalb einer Gruppe 8 px, zwischen Gruppen 24 px.
- **Feldbreite nach Inhalt:** PLZ etwa 6 Zeichen breit, Nachricht volle Breite
  mit mindestens 5 Zeilen. Die Breite sagt, wie viel erwartet wird.
- **Pflicht oder optional:** Die kleinere Gruppe wird markiert. Sind fast alle
  Felder Pflicht, tragen die wenigen anderen „(optional)“ im Label.
- **Absenden** mit einem Knopf, der die Handlung nennt („Anfrage senden“), nicht
  „Absenden“ oder „Submit“.
- **Datenschutzhinweis** als ein Satz direkt über oder unter dem Knopf, mit
  Link zur Datenschutzerklärung.

## Funktionen

**Grundausstattung**
- Kontaktformular mit Name, E-Mail und Nachricht; Telefon und Firma optional
- Prüfung beim Verlassen eines Feldes, Fehlermeldung direkt am Feld
- Knopf mit Zuständen: bereit, sendet, gesendet, fehlgeschlagen (`aktion-knopf`)
- Erfolgsansicht an derselben Stelle, mit dem nächsten Schritt
- Spam-Schutz ohne Drittanbieter (Honigtopf-Feld, Zeitprüfung, serverseitige
  Prüfung)

**Ausbau**
- Anliegen als Auswahl (Angebot, Termin, Frage), die passende Felder einblendet
- Weitere Angaben aufklappbar statt immer sichtbar (`aufklappen`)
- Bestätigungsmail an den Absender mit Kopie der Anfrage
- Anhang hochladen (siehe Kapitel Upload)
- Wunschtermin oder Rückrufzeit

**Speziell**
- Mehrstufige Anfrage mit Fortschritt (siehe Kapitel Wizard)
- Weiterleitung an verschiedene Empfänger je Anliegen
- Übergabe an ein CRM oder einen Projektraum statt nur per Mail
- Newsletter-Anmeldung als eigene, nicht vorangekreuzte Checkbox

## Worauf es ankommt

- **Nur nötige Felder.** Drei Felder sind der Normalfall. Jedes weitere Feld
  braucht einen Grund, der die Antwort besser macht. Anrede, Faxnummer und
  „Wie haben Sie uns gefunden?“ als Pflicht haben keinen.
- **Prüfen beim Verlassen, nicht beim Tippen.** Wer „max@“ tippt, ist noch nicht
  fertig. Der Fehler erscheint beim Verlassen des Feldes (in CSS `:user-invalid`).
  Steht ein Fehler einmal da, verschwindet er beim Tippen, sobald die Eingabe
  stimmt.
- **Fehler sagen, was zu tun ist.** „Bitte eine E-Mail-Adresse mit @ angeben“
  statt „Ungültige Eingabe“. Roter Rand allein reicht nie, der Text gehört dazu.
- **Nichts geht verloren.** Schlägt das Senden fehl, bleiben alle Eingaben
  stehen. Die Meldung nennt einen zweiten Weg (E-Mail-Adresse zum Kopieren).
- **Einmal senden.** Der Knopf sperrt sich nach dem ersten Klick, seine Breite
  bleibt gleich, der Text wechselt auf „Wird gesendet“. Doppelte Anfragen sind
  ein Fehler des Formulars, nicht des Nutzers.
- **Erfolg ist eine Ansicht, kein Toast.** Das Formular wird durch eine
  Bestätigung ersetzt: was angekommen ist und was als Nächstes passiert. Eine
  Antwortzeit steht dort nur, wenn sie stimmt.
- **Spam-Schutz ohne Captcha-Dienst.** Kein reCAPTCHA, kein hCaptcha: Beide laden
  vor jeder Einwilligung Code eines Dritten. Stattdessen ein unsichtbares
  Honigtopf-Feld, das Menschen leer lassen, eine Zeitprüfung (gesendet weniger
  als 3 s nach dem Laden wird verworfen), eine Begrenzung je Absender auf dem
  Server und dort dieselbe Prüfung wie im Browser.
- **Browser helfen lassen.** `type="email"`, `type="tel"`, passendes
  `autocomplete` (`name`, `email`, `tel`, `organization`) und `inputmode`. Auf
  dem Handy öffnet dann die richtige Tastatur und das Ausfüllen dauert Sekunden.
- **Kontrast für alles.** Feldrand, Platzhalter, Fokusring, Hilfe- und
  Fehlertext bestehen AA gegen den Hintergrund der Sektion.

## Bewegung

- **Fehlertext:** erscheint unter dem Feld mit Deckkraft und 4 px Versatz nach
  unten, `DAUER.xs`, `KURVE.raus`. Reines CSS, die Zeile darunter rückt mit.
- **Knopf:** Der Wechsel bereit, sendet, gesendet ist eine Kreuzblende des
  Inhalts in `DAUER.xs`. Die Form des Knopfs bleibt, er schrumpft nicht zum
  Kreis.
- **Erfolg:** Das Formular blendet in `DAUER.xs` mit `KURVE.rein` aus, die
  Bestätigung kommt in `DAUER.sm` mit `KURVE.raus` herein. Die Höhe des
  Bereichs gleitet mit, damit die Seite darunter nicht springt.
- **Aufgeklappte Zusatzfelder:** über `aufklappen`, schließen schneller als
  öffnen.
- **Nicht bewegen:** Labels (keine schwebenden Labels, die ins Feld rutschen),
  Felder bei Fokus, kein Schütteln bei Fehlern, kein Konfetti nach einer
  Kontaktanfrage.
- Bei „Bewegung reduzieren“ erscheinen Fehler und Bestätigung sofort.

## Zugänglichkeit

- Jedes Feld hat ein sichtbares `<label for>`. Platzhalter ersetzen nie das
  Label; sie zeigen höchstens ein Beispiel.
- Hilfe- und Fehlertext hängen per `aria-describedby` am Feld, ein fehlerhaftes
  Feld trägt `aria-invalid="true"`. Pflichtfelder tragen `required`.
- Beim Absenden mit Fehlern springt der Fokus auf das erste fehlerhafte Feld. Ab
  etwa 6 Feldern steht oben zusätzlich eine Zusammenfassung mit Links zu den
  Feldern.
- Die Erfolgsansicht bekommt den Fokus auf ihre Überschrift, damit
  Screenreader sie vorlesen.
- Felder und Knopf mindestens 44 px hoch, Fokusring mindestens 2 px mit 3:1
  Kontrast.
- Keine Zeitbegrenzung zum Ausfüllen. Die Zeitprüfung gegen Spam ist eine
  Untergrenze, keine Obergrenze.

## Typische Fehler

- Platzhalter als Label: Beim Tippen ist weg, was gefragt war.
- Fehler beim ersten Tastendruck: Das Formular schimpft, bevor man fertig ist.
- Alle Fehler nur oben in einem roten Kasten oder als Toast, fern vom Feld.
- Nach einem Serverfehler ist die lange Nachricht gelöscht.
- reCAPTCHA auf der Kontaktseite, geladen vor der Einwilligung.
- Pflichtfelder für Anrede, Firma und Telefon bei einer einfachen Frage.
- Knopf „Absenden“, der beim zweiten Klick eine zweite Anfrage schickt.
- Erfolg als Toast, der nach 3 s verschwindet, das Formular steht noch gefüllt da.

## Prüfliste

- [ ] Nur nötige Felder, Label über dem Feld, eine Spalte
- [ ] Pflicht oder optional erkennbar, ohne Legende zu suchen
- [ ] Prüfung beim Verlassen, Fehlertext am Feld mit Handlungsanweisung
- [ ] `type`, `autocomplete`, `inputmode` gesetzt, auf dem Handy getestet
- [ ] Knopf nennt die Handlung, sperrt nach dem Klick, Eingaben bleiben bei Fehler
- [ ] Erfolgsansicht an derselben Stelle, Fokus auf ihrer Überschrift
- [ ] Datenschutzhinweis mit Link am Formular, Newsletter nie vorangekreuzt
- [ ] Spam-Schutz ohne Drittanbieter, Prüfung auch auf dem Server
- [ ] Alles still bei reduzierter Bewegung

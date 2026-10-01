---
titel: Terminbuchung
gruppe: muster
kurz: Einen freien Termin wählen und in derselben Karte verbindlich buchen.
stichworte: [terminbuchung, termin buchen, buchungskalender, online-termin, erstgespräch, zeitfenster, verfügbarkeit, terminvereinbarung, calendly, uhrzeit wählen]
bausteine: [terminbuchung, monatsraster, aktion-knopf]
demo: [terminbuchung]
stand: 2026-10-02
---

## Wofür

Eine Terminbuchung ersetzt das Hin und Her per Mail. Wer bucht, sieht nur
freie Zeiten, wählt eine aus, nennt Name und E-Mail und hat danach einen
festen Termin im eigenen Kalender. Alles geschieht in **einer Karte**, ohne
Seitenwechsel und ohne Modal. Der Kalender darin folgt dem Kapitel „Kalender“.

## Aufbau

Von links nach rechts, wie im Baustein `terminbuchung`:

- **Infospalte (links, 13rem):** Terminart als Titel, Dauer, Ort oder
  „Videotermin“, kurze Beschreibung. Sobald Tag und Uhrzeit gewählt sind,
  steht hier zusätzlich „Mittwoch, 14. Oktober, 10:30 Uhr“. Die Spalte bleibt
  in allen Schritten stehen.
- **Monat (Mitte, 22rem):** `monatsraster`, nicht buchbare Tage gedämpft und
  nicht wählbar.
- **Uhrzeiten (rechts, 11rem):** fährt erst auf, wenn ein Tag gewählt ist. Kopf
  mit dem Datum, darunter die freien Zeiten als Knöpfe, höchstens 24rem hoch,
  danach scrollt die Spalte. Solange geladen wird: „Freie Zeiten werden
  geladen …“. Ist nichts frei: „An diesem Tag ist nichts mehr frei. Bitte einen
  anderen Tag wählen.“
- **Uhrzeit teilt sich:** Die gewählte Uhrzeit wird zu zwei Knöpfen
  nebeneinander, „10:30 | Weiter“. Ein zweiter Klick ist die Bestätigung, ein
  versehentlicher Klick kostet nichts.
- **Formular (in derselben Karte):** ersetzt Monat und Uhrzeiten. Oben
  „Zurück zur Terminwahl“, dann Name, E-Mail, „Worum geht es?“ (optional),
  Datenschutzhinweis, Knopf „Termin buchen“.
- **Bestätigung:** „Der Termin steht.“ mit Datum, Uhrzeit und dem Hinweis, dass
  die Mail mit Link zum Verschieben oder Absagen unterwegs ist.

Auf dem Handy stehen alle Teile untereinander: Info, Monat, Uhrzeiten.

## Funktionen

**Grundausstattung**
- Eine Terminart mit fester Dauer
- Freie Zeiten je Tag, belegte erscheinen nicht
- Formular mit Name, E-Mail, optionaler Notiz, Spamschutz per verstecktem Feld
- Bestätigungsmail mit Kalenderdatei (iCal) und Link zum Umbuchen und Absagen
- Benachrichtigung an den Anbieter

**Ausbau**
- Mehrere Terminarten zur Wahl (Erstgespräch 30 Minuten, Beratung 60 Minuten)
- Zeitzone: Zeiten in der Zeitzone des Besuchers, sichtbar und umschaltbar;
  bei Terminen vor Ort in der Ortszeit
- Puffer vor und nach jedem Termin (zum Beispiel 15 Minuten)
- Mindestvorlauf (zum Beispiel 24 Stunden) und längster Vorlauf (zum Beispiel
  60 Tage)
- Höchstzahl Termine je Tag
- Kalenderabgleich mit Google oder Outlook: Belegtes dort ist hier nicht frei
- Erinnerung per Mail 24 Stunden vorher
- Videolink automatisch in Mail und Kalendereintrag
- Zusatzfragen je Terminart

**Speziell**
- Bezahlung vorab: Die Zeit wird für 15 Minuten reserviert, fest wird der
  Termin erst nach der Zahlung
- Mehrere Personen: Termin bei der Person, die frei ist, oder bei einer
  bestimmten
- Gruppentermine mit begrenzten Plätzen und Warteliste
- Einbettung in eine fremde Seite

## Worauf es ankommt

- **Erst die Zeit, dann die Daten.** Wer zuerst Name und E-Mail eintippen muss,
  bevor er sieht, ob etwas frei ist, bricht ab.
- **Beim Buchen neu prüfen.** Der Server prüft die Zeit beim Absenden noch
  einmal. Ist sie inzwischen weg: „Diese Zeit ist eben vergeben worden.“ und
  zurück zu den Uhrzeiten des Tages, mit allen Eingaben erhalten.
- **Zeitzone nie raten lassen.** Unter den Uhrzeiten steht die Zeitzone
  („Zeiten in MEZ“). Mail und Kalenderdatei tragen die Zeit mit Zeitzone.
- **Umbuchen und Absagen ohne Konto.** Der Link in der Mail enthält ein nicht
  erratbares Zeichen, führt direkt auf die Karte mit dem bestehenden Termin
  und hat eine Frist (zum Beispiel bis 24 Stunden vorher).
- **Kalenderdatei mit fester Kennung.** Jeder Termin hat eine eigene UID. Eine
  Umbuchung schickt dieselbe UID mit höherer Sequenznummer, damit der
  Kalender den Eintrag ersetzt statt einen zweiten anzulegen. Eine Absage
  schickt eine Absage, keine neue Mail ohne Anhang.
- **Wenige Felder.** Name und E-Mail sind Pflicht, alles andere optional.
  Telefon nur, wenn wirklich angerufen wird.
- **Kein Modal, keine eigene Seite je Schritt.** Die Karte wächst und wechselt
  ihren Inhalt; die Infospalte hält den Zusammenhang.
- **Leere Monate vermeiden.** Öffnet der Kalender, steht der erste Monat mit
  freien Tagen da. Ein Monat ohne freien Tag zeigt das als Satz.

## Bewegung

- **Uhrzeitspalte:** fährt per Flip auf, die Karte wird breiter, Monat und
  Info gleiten an ihren neuen Platz, `DAUER.md`, `KURVE.stark`. Grund:
  Kontinuität, nichts springt.
- **Uhrzeiten:** kommen gestaffelt von links (12 px, `DAUER.sm`,
  `KURVE.raus`, `STAFFEL` halbiert, gesamt höchstens 0,3 s).
- **Uhrzeit teilt sich:** per Flip in „Uhrzeit | Weiter“, `DAUER.md`. Man sieht,
  dass der Weiter-Knopf aus der Wahl entsteht.
- **Schrittwechsel:** Formular und Bestätigung gleiten um 24 px von rechts
  herein, `DAUER.md`, `KURVE.raus`.
- **Buchen:** `aktion-knopf` zeigt Laden, Erfolg („Gebucht“) und Fehler im Knopf
  selbst; nach 0,9 s folgt die Bestätigung.
- **Nicht bewegen:** Infospalte, Monatskopf, Formularfelder. Kein Konfetti
  nach der Buchung.
- Bei „Bewegung reduzieren“ öffnet die Spalte sofort, die Schritte wechseln
  ohne Gleiten. Gesteuert über `bewegungErlaubt()`.

## Zugänglichkeit

- Monat wie im Kapitel „Kalender“: Pfeiltasten, Bild auf und ab, roving
  tabindex, vollständige Namen je Tag.
- Die Uhrzeitspalte ist `aria-live="polite"`: Laden, „nichts frei“ und die
  Zeiten werden angesagt.
- Uhrzeitknöpfe tragen `aria-pressed`, sind mindestens 44 px hoch und nutzen
  `tabular-nums`.
- Nach jedem Schrittwechsel liegt der Fokus am Anfang des neuen Inhalts (erstes
  Feld im Formular, Titel der Bestätigung), nicht mehr auf einem Knopf, den es
  nicht mehr gibt.
- Labels über den Feldern, `autocomplete="name"` und `"email"`.
- Das versteckte Spamschutzfeld ist `aria-hidden` und `tabIndex={-1}`.
- Die Bestätigung ist `role="status"`.

## Typische Fehler

- Formular vor dem Kalender.
- Freie Zeiten nur beim Laden der Seite geprüft: Zwei Personen buchen dieselbe
  Zeit.
- Uhrzeiten ohne Zeitzone, Besucher aus einer anderen Zeitzone kommen eine
  Stunde zu früh.
- Bestätigungsmail ohne Kalenderdatei oder ohne Link zum Absagen.
- Umbuchung legt im Kalender einen zweiten Eintrag an.
- Jeder Schritt in einem Modal oder auf einer eigenen Seite, die Infospalte
  geht verloren.
- Kalender öffnet auf einem Monat, in dem nichts frei ist.
- Zehn Pflichtfelder für ein 30-Minuten-Gespräch.

## Prüfliste

- [ ] Info links, Monat, Uhrzeitspalte fährt auf, Uhrzeit teilt sich in „Uhrzeit | Weiter“
- [ ] Formular und Bestätigung in derselben Karte, Handy untereinander
- [ ] Server prüft beim Buchen erneut, Kollision mit Rückweg und erhaltenen Eingaben
- [ ] Zeitzone sichtbar, Puffer und Mindestvorlauf eingestellt
- [ ] Mail mit iCal (feste UID) und Link zum Umbuchen und Absagen
- [ ] Fokus nach Schrittwechsel, `aria-live` an den Uhrzeiten, 44 px
- [ ] Flip und Gleiten still bei reduzierter Bewegung

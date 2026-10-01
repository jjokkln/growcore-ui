---
titel: Rückmeldung
gruppe: muster
kurz: Zeigen, ob etwas geklappt hat: am Knopf, am Feld, als Meldung oder als Banner.
stichworte: [rückmeldung, meldung, toast, hinweis, banner, fehlermeldung, erfolgsmeldung, benachrichtigung, rückgängig, ladezustand, konfetti]
bausteine: [meldung, aktion-knopf, feiern]
demo: [meldung, aktion-knopf]
stand: 2026-10-02
---

## Wofür

Rückmeldung beantwortet eine Frage: **Hat es geklappt?** Sie gehört so nah wie
möglich an die Handlung, die sie auslöst. Daraus folgt eine Rangfolge:

1. **Am Knopf:** Speichern zeigt am Knopf selbst, dass es lädt und dass es
   fertig ist (Baustein `aktion-knopf`).
2. **Am Feld (inline):** Fehler und Hinweise stehen dort, wo sie behoben werden.
3. **Meldung (Toast):** vorübergehend, für Handlungen, deren Wirkung woanders
   liegt oder die sich rückgängig machen lassen (Baustein `meldung`).
4. **Banner:** dauerhafter Zustand, der die ganze Seite oder das Konto betrifft:
   offline, Testzugang endet, Wartung angekündigt.

Wer eine Meldung baut, prüft zuerst, ob Knopf oder Feld reichen.

## Aufbau

- **Knopf im Ladezustand:** Ein kleiner Kreis dreht sich, die Breite bleibt
  fest. Danach rund 2,4 s ein Haken mit „Gespeichert“, dann zurück in den
  Ruhezustand. Bei einem Fehler steht „Erneut versuchen“ auf dem Knopf.
- **Inline-Hinweis:** unter dem Feld, Symbol plus ein Satz. Bei mehreren
  Fehlern nach dem Absenden zusätzlich eine Zusammenfassung über dem Formular,
  jeder Eintrag ein Link zum Feld.
- **Meldung:** auf dem Desktop unten rechts, auf dem Handy unten mittig über
  einer unteren Navigation. 320–420 px breit. Symbol, ein Satz, höchstens eine
  Aktion („Rückgängig“, „Ansehen“), Schließen-Knopf.
- **Banner:** volle Breite direkt unter dem Kopf, schiebt den Inhalt nach unten
  statt ihn zu verdecken. Schließbar nur, wenn der Zustand nicht kritisch ist.
- **Arten:** Erfolg, Hinweis, Warnung, Fehler. Jede mit eigenem Symbol und
  eigenem Wort, Farbe kommt nur dazu.

## Funktionen

**Grundausstattung**
- Knopf mit Lade-, Erledigt- und Fehlerzustand
- Fehler am Feld, Zusammenfassung bei mehreren Fehlern
- Erfolgsmeldung, die von selbst verschwindet

**Ausbau**
- „Rückgängig“ in der Meldung statt eines Bestätigungsdialogs
- Stapel mit Obergrenze, gleiche Meldungen zusammengefasst
- Timer hält an bei Hover, Fokus und verstecktem Tab
- Banner für Konto- und Systemzustände
- Fortschritt bei langen Vorgängen („3 von 12 Dateien hochgeladen“)

**Speziell**
- Feiern mit Konfetti für einen echten Abschluss (Baustein `feiern`)
- Benachrichtigungszentrale mit Verlauf der letzten Meldungen
- Meldung, wenn ein Hintergrundvorgang fertig ist („Export bereit“)
- Offline-Banner, das von selbst verschwindet, sobald das Netz zurück ist

## Worauf es ankommt

- **Dauer nach Inhalt.** Meldung ohne Aktion 5 s, mit Aktion 8 s. Der Timer
  steht still, solange Zeiger oder Fokus auf der Meldung liegen. Was behoben
  werden muss, ist keine Meldung, sondern steht am Feld oder im Banner.
- **Stapeln mit Obergrenze.** Höchstens drei Meldungen sichtbar, die älteste
  geht zuerst. Die gleiche Meldung zweimal wird eine: „3 Dateien gelöscht“
  statt dreimal „Datei gelöscht“.
- **Rückgängig statt Nachfragen.** Umkehrbares wird sofort ausgeführt, die
  Meldung bietet „Rückgängig“. Endgültig gelöscht wird erst nach Ablauf oder
  über einen Papierkorb. Der Bestätigungsdialog bleibt Unumkehrbarem vorbehalten.
- **Was passiert ist, nicht wie es sich anfühlt.** „Angebot gespeichert.“
  statt „Erfolg!“. Fehler nennen Problem und Ausweg: „Keine Verbindung.
  Änderungen werden gespeichert, sobald das Netz zurück ist.“
- **Fehler gehören an den Ort.** Ein Formularfehler als Meldung verschwindet,
  bevor er behoben ist. Meldungen sind für Vorübergehendes.
- **Keine Meldung für Selbstverständliches.** Bei automatischem Speichern reicht
  ein leiser Status („Gespeichert vor 1 Min.“), keine Meldung je Feld.
- **Nichts verdecken.** Meldungen liegen nicht über primären Knöpfen, nicht
  über der Eingabe, an der gerade gearbeitet wird.
- **Feiern ist selten.** Konfetti einmal für einen echten Erfolg (Auftrag
  abgeschickt, Projekt abgeschlossen), nie bei Routine wie Speichern.

## Bewegung

- **Meldung:** kommt 12 px von unten und blendet ein, `DAUER.sm`
  mit `KURVE.raus`. Geht in `DAUER.xs` mit `KURVE.rein`. Rücken andere Meldungen
  nach, gleiten sie per Flip an den neuen Platz (`KURVE.wechsel`, `DAUER.sm`).
  Grund: Rückmeldung und Kontinuität im Stapel.
- **Knopf:** Der neue Inhalt steigt 8 px auf und blendet ein (`DAUER.xs`), die
  Breite bleibt. Der Haken zeichnet sich in `DAUER.md` (DrawSVG). Ein Fehler
  schüttelt den Knopf einmal, höchstens 6 px weit, dazu Farbe und Text. Mehr
  Schütteln gibt es nicht.
- **Inline-Hinweis:** klappt in `DAUER.xs` auf (`aufklappen`), damit das Formular
  nicht ruckartig springt.
- **Fortschritt:** Balken wächst über `scaleX`, nie über `width`.
- **Feiern:** etwa 90 Teilchen aus dem geklickten Knopf, Schwerkraft über
  Physics2D, rund 2 s, auf einer nicht klickbaren Ebene. Farben aus der Marke
  des Projekts.
- **Nicht bewegen:** Banner (erscheint beim Laden ohne Auftritt), Symbole in
  Meldungen. Kein Pulsieren, kein Blinken, keine Endlosschleife.
- Bei „Bewegung reduzieren“ erscheinen Meldungen sofort, `feiern` tut nichts.

## Zugänglichkeit

- Die Live-Region existiert beim Laden schon, leer. Wird sie erst mit der
  Meldung eingefügt, sagt der Screenreader nichts an.
- `role="status"` (höflich) für Erfolg und Hinweis. `role="alert"` nur für
  Fehler, die sofort Handeln verlangen.
- Meldungen mit Aktion verschwinden nicht, solange der Fokus darin liegt. Die
  Aktion ist per Tastatur erreichbar, ohne die Arbeit zu verlieren.
- Formularfehler: `aria-invalid="true"` am Feld, `aria-describedby` auf den
  Fehlertext. Nach dem Absenden geht der Fokus auf die Zusammenfassung oder das
  erste fehlerhafte Feld.
- Knopf im Ladezustand: gegen Doppelklick gesperrt, `aria-busy="true"`. Das
  Ergebnis sagt eine Live-Region am Knopf an („Gespeichert“ oder
  „Fehlgeschlagen. Erneut versuchen“).
- Text in Meldungen mindestens 4,5:1, Symbole mindestens 3:1. Art nie nur über
  Farbe. Schließen-Knopf mindestens 44 × 44 px.
- Konfetti ist `aria-hidden`. Den Erfolg sagt der Text an, nicht die Animation.

## Typische Fehler

- Formularfehler als Meldung oben rechts, weit weg vom Feld.
- Erfolgsmeldung nach jedem Tastendruck beim automatischen Speichern.
- Meldung mit „Rückgängig“, die nach 3 s verschwindet, bevor jemand reagieren kann.
- Fünf gestapelte Meldungen verdecken den Speichern-Knopf.
- „Wirklich löschen?“ bei jedem Eintrag, obwohl Rückgängig möglich wäre.
- Knopf wird beim Laden schmaler, weil der Text dem Ladesymbol weicht.
- Live-Region erst beim Anzeigen eingefügt: Niemand hört etwas.
- Konfetti beim Speichern eines Entwurfs.

## Prüfliste

- [ ] Rangfolge geprüft: Knopf, dann Feld, dann Meldung, dann Banner
- [ ] Knopf mit Lade-, Erledigt- und Fehlerzustand bei fester Breite (`aktion-knopf`)
- [ ] Fehler am Feld mit `aria-invalid` und `aria-describedby`
- [ ] Meldungen 5 s, mit Aktion 8 s, Timer hält bei Hover und Fokus
- [ ] Höchstens drei sichtbar, gleiche zusammengefasst (`meldung`)
- [ ] Umkehrbares mit „Rückgängig“ statt Bestätigungsdialog
- [ ] Live-Region vorab im DOM, `status` oder `alert` bewusst gewählt
- [ ] `feiern` nur für echten Abschluss, still bei reduzierter Bewegung

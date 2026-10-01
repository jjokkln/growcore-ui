---
titel: Wizard
gruppe: muster
kurz: Lange Eingaben in kurze Schritte teilen, mit Fortschritt und ohne Datenverlust.
stichworte: [wizard, mehrstufig, schritte, konfigurator, buchung, onboarding, fortschritt, strecke, assistent, schrittfolge]
bausteine: [wizard, aktion-knopf, feiern]
demo: [wizard]
stand: 2026-10-02
---

## Wofür

Ein Wizard teilt eine lange Eingabe in Schritte, die man nacheinander beantworten
kann: einen Konfigurator (Leistung, Umfang, Extras), eine Buchung (Termin,
Daten, Bestätigung) oder ein Onboarding (Konto, Firma, Einstellungen). Er lohnt
sich ab etwa 8 Feldern oder sobald eine Antwort die nächsten Fragen bestimmt.
Darunter ist ein einseitiges Formular schneller.

## Aufbau

- **Fortschritt oben:** Schritte mit Namen („Leistung“, „Termin“, „Kontakt“),
  nicht nur Nummern. Erledigt, aktuell und offen sind unterscheidbar. Ab 6
  Schritten genügt „Schritt 3 von 7“ plus Name des aktuellen Schritts.
- **Ein Thema je Schritt,** 1 bis 5 Felder. Die Überschrift ist die Frage
  („Welche Leistung brauchen Sie?“).
- **Fußleiste:** „Zurück“ links als zweitrangiger Knopf, „Weiter“ rechts als
  Hauptknopf. Auf dem Handy bleibt die Leiste am unteren Rand stehen.
- **Zusammenfassung** als letzter Schritt vor dem Absenden: alle Antworten in
  Gruppen, je Gruppe ein Link „Ändern“, der direkt in den Schritt führt.
- **Abschluss:** eine eigene Ansicht mit dem Ergebnis und dem nächsten Schritt,
  nicht der letzte Formularschritt mit einer Meldung darüber.

## Funktionen

**Grundausstattung**
- Schritte mit Fortschrittsanzeige, Zurück und Weiter
- Prüfung je Schritt beim Weiter, Fehler am Feld
- Zurück ohne Datenverlust, auch über die Zurück-Taste des Browsers
- Zusammenfassung mit „Ändern“ je Gruppe, dann Absenden (`aktion-knopf`)

**Ausbau**
- Zwischenstand speichern: lokal im Browser oder per Link zum Fortsetzen
- Verzweigung: Antworten blenden Schritte ein oder aus, der Fortschritt passt sich an
- Laufender Preis oder Umfang in einer Seitenleiste (Konfigurator)
- Schritt in der URL (`?schritt=termin`), damit Neuladen und Teilen funktionieren
- Optionale Schritte überspringbar, sichtbar als „Überspringen“

**Speziell**
- Fortsetzen auf einem anderen Gerät über einen Link per Mail
- Konfigurator mit Vorschaubild, das jede Wahl sofort zeigt
- Abschluss mit `feiern`, nur bei echtem Erfolg (Buchung bestätigt, Konto aktiv)
- Übergabe der Konfiguration als Anfrage an den Projektraum

## Worauf es ankommt

- **Zurück verliert nichts.** Jede Eingabe bleibt beim Wechsel erhalten, in
  beide Richtungen. Der Zustand liegt in einem Speicher für die ganze Strecke,
  nicht in den einzelnen Schritten, die beim Wechsel neu entstehen.
- **Die Browser-Zurück-Taste funktioniert.** Jeder Schritt ist ein Eintrag im
  Verlauf. Wer Zurück drückt und dabei die ganze Strecke verlässt, war schon
  einmal da und kommt nicht wieder.
- **Weiter prüft nur den aktuellen Schritt.** Fehler zeigen sich am Feld, der
  Fokus springt auf das erste. Eine Fehlermeldung über einen späteren Schritt
  ist unmöglich, wenn jeder Schritt sich selbst prüft.
- **Zwischenstand ab der dritten Minute.** Dauert die Strecke länger als etwa
  drei Minuten, wird der Stand gespeichert. Beim Wiederkommen steht oben „Weiter
  bei Schritt 3“ und „Neu beginnen“. Personenbezogene Daten nur mit Hinweis im
  Browser speichern und nach dem Absenden löschen.
- **Die Zusammenfassung ist Pflicht.** Vor dem Absenden sieht man alles auf einer
  Seite. „Ändern“ führt in den Schritt und danach direkt zurück zur
  Zusammenfassung, nicht durch alle Schritte dazwischen.
- **Kein Überraschungsschritt.** Die Zahl der Schritte steht am Anfang fest oder
  ändert sich sichtbar durch eine eigene Antwort. Ein Schritt „Konto anlegen“
  kurz vor dem Ende ist ein Abbruchgrund.
- **Ein Hauptknopf je Schritt.** „Weiter“ heißt im letzten Schritt nach der
  Handlung („Buchung absenden“), nicht wieder „Weiter“.

## Bewegung

- **Schrittwechsel mit Richtung:** Vorwärts gleitet der alte Schritt 24 px nach
  links hinaus und blendet aus (`DAUER.xs`, `KURVE.rein`), der neue kommt von
  rechts herein (`DAUER.sm`, `KURVE.raus`). Zurück genau gespiegelt. Die
  Richtung sagt, ob man vor- oder zurückgeht, und ist der einzige Grund für die
  Bewegung. Ist jeder Schritt eine eigene Route, übernimmt `seitenwechsel` mit
  `vor` und `zurueck`; sonst eine GSAP-Timeline im Wizard-Rahmen.
- **Höhe:** Der Rahmen gleitet auf die Höhe des neuen Schritts, statt zu
  springen, `DAUER.sm`.
- **Fortschritt:** Der Balken oder die Markierung wandert zum neuen Schritt
  (`scaleX` oder Flip), höchstens `DAUER.sm`.
- **Verzweigung:** Ein- oder ausgeblendete Unterfelder über `aufklappen`.
- **Nicht bewegen:** Fußleiste, Kopf, Seitenleiste mit Preis. Der Preis wechselt
  ohne Hochzählen, denn er ist eine Angabe, keine Erzählung.
- Bei „Bewegung reduzieren“ wechselt der Schritt sofort, nur der Fokus wandert.

## Zugänglichkeit

- Der Fortschritt ist eine Liste (`<ol>`); der aktuelle Schritt trägt
  `aria-current="step"`, erledigte tragen den Zusatz „erledigt“ im Namen.
- Nach jedem Wechsel liegt der Fokus auf der Überschrift des neuen Schritts
  (`tabindex="-1"`). Der Seitentitel nennt den Schritt: „Termin, Schritt 2 von
  4“.
- Fehler beim Weiter: Fokus auf das erste fehlerhafte Feld, Fehler per
  `aria-describedby` am Feld.
- „Zurück“ und „Weiter“ sind echte Knöpfe mit mindestens 44 px Höhe; Enter im
  letzten Feld eines Schritts löst „Weiter“ aus.
- Zeitbegrenzungen (Reservierung hält 10 Minuten) stehen als Text da und lassen
  sich verlängern.

## Typische Fehler

- „Zurück“ leert den Schritt, weil sein Zustand beim Wechsel verworfen wurde.
- Die Browser-Zurück-Taste verlässt den ganzen Wizard.
- Fortschritt nur als Punkte ohne Namen: Niemand weiß, was noch kommt.
- Keine Zusammenfassung: Abgesendet wird, was man vor vier Schritten eingegeben hat.
- Ein Schritt je Feld bei einer Strecke mit sechs Feldern.
- Schrittwechsel mit Überblenden ohne Richtung, oder jeder Schritt mit eigener
  Auftrittsanimation.
- Konto-Pflicht im vorletzten Schritt.

## Prüfliste

- [ ] Schritte mit Namen, aktueller Schritt markiert, Zahl der Schritte klar
- [ ] Zurück und Browser-Zurück verlieren keine Eingabe
- [ ] Prüfung je Schritt, Fehler am Feld, Fokus auf das erste
- [ ] Zusammenfassung vor dem Absenden, „Ändern“ springt hin und zurück
- [ ] Zwischenstand gespeichert, wenn die Strecke länger als drei Minuten dauert
- [ ] Schrittwechsel mit Richtung in `DAUER.sm`, Fokus auf der neuen Überschrift
- [ ] Letzter Knopf nennt die Handlung, Abschluss als eigene Ansicht
- [ ] Alles sofort bei reduzierter Bewegung

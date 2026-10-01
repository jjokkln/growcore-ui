---
titel: Kalender
gruppe: muster
kurz: Termine, Fristen und Zeiträume zeigen und auswählen.
stichworte: [kalender, monatsansicht, wochenansicht, termin, datum, datumsauswahl, frist, buchung, urlaub, zeitraum]
bausteine: [monatsraster]
demo: [monatsraster]
stand: 2026-10-02
---

## Wofür

Ein Kalender beantwortet zwei Fragen: **Was ist wann?** und **Wann geht es?**
Die erste ist eine Übersicht (Termine, Fristen, Abwesenheiten), die zweite eine
Auswahl (Termin buchen, Zeitraum wählen). Jedes Projekt entscheidet zuerst,
welche der beiden Fragen der Kalender hauptsächlich beantwortet. Davon hängen
Größe, Dichte und Bedienung ab.

## Aufbau

- **Kopf:** Monat und Jahr als Überschrift, links und rechts blättern, ein Knopf
  „Heute“. Der Kopf bleibt beim Blättern stehen, nur das Raster wechselt.
- **Wochentagszeile:** Mo bis So, Woche beginnt am Montag (deutsche Norm).
  Wochenenden dürfen leiser sein, aber nie unlesbar.
- **Raster:** sechs Wochenzeilen, damit die Höhe beim Blättern nicht springt.
  Tage des Vor- und Folgemonats stehen gedämpft in den Randzellen.
- **Zelle:** Tageszahl oben links, darunter der Inhalt (Punkte, Balken,
  Kurztitel). Die Zelle gibt die Höhe vor, nicht ihr Inhalt.
- **Markierungen:** heute (Kontur), ausgewählt (gefüllte Fläche im Akzent),
  Zeitraum (durchgehendes Band), nicht wählbar (gedämpft, durchgestrichen
  oder ausgegraut, nie nur durch Farbe).
- **Legende:** sobald es mehr als eine Art von Eintrag gibt.

## Funktionen

**Grundausstattung**
- Monatsansicht mit Blättern und „Heute“
- Einträge als Punkt oder Kurztitel je Tag
- Klick auf einen Tag zeigt die Einträge des Tages (darunter oder daneben,
  nicht in einem Modal)

**Ausbau**
- Wochen- und Listenansicht als Umschalter; die Listenansicht ist auf dem Handy
  oft die bessere Monatsansicht
- Zeitraum wählen (Anreise bis Abreise, Urlaub von bis)
- Mehrtägige Einträge als durchgehende Balken über die Tage
- Filter nach Art (Termin, Frist, Abwesenheit) mit farbigen Kennungen und Legende
- Wochensumme am Zeilenende (Stunden, Buchungen)

**Speziell**
- Verfügbarkeit buchen: freie Zeitfenster eines Tages, belegte nicht wählbar
- Ziehen und Ablegen von Terminen
- Mehrere Personen oder Räume nebeneinander (Ressourcenansicht)
- Export als iCal-Abo, Abgleich mit Google oder Outlook
- Feiertage nach Bundesland

## Worauf es ankommt

- **Feste Geometrie.** Sechs Zeilen, gleiche Zellhöhe, Tageszahlen mit
  `tabular-nums`. Nichts springt beim Blättern, nichts wächst mit dem Inhalt.
  Passt ein Tag nicht, zeigt er „+2“ statt die Zelle zu dehnen.
- **Heute sofort finden.** Die Kontur um heute ist das stärkste Signal nach der
  Auswahl. Wer den Kalender öffnet, sieht heute ohne zu suchen.
- **Eine Akzentfarbe für die Auswahl,** Kategorien in ruhigeren Tönen. Wird alles
  bunt, ist nichts mehr ausgewählt.
- **Dichte nach Zweck.** Übersicht darf dicht sein (Operate), Auswahl braucht
  große Treffflächen (mindestens 44 × 44 px auf dem Handy).
- **Auf dem Handy umdenken.** Ein Monatsraster mit Kurztiteln bricht unter
  400 px. Dort: Raster nur mit Punkten, darunter die Liste des gewählten Tages.
- **Gleicher Kalender überall.** In einem Produkt sieht jeder Kalender gleich
  aus und verhält sich gleich. Zwei Kalenderansichten mit eigener Optik sind
  ein Fehler, kein Stil.

## Bewegung

- **Blättern:** Das Raster gleitet in Blätterrichtung, der alte Monat 24 px und
  ausgeblendet hinaus, der neue von der Gegenseite herein. `DAUER.sm` raus,
  `DAUER.md` herein mit `KURVE.raus`. Die Richtung erklärt, wohin man geht, und
  ist der einzige Grund für die Bewegung.
- **Auswahl:** Die Auswahlfläche gleitet von der alten zur neuen Zelle (Flip),
  statt zu verschwinden und neu aufzutauchen. So sieht man, dass sich die Auswahl
  bewegt hat und nicht verdoppelt.
- **Zeitraum:** Das Band wächst beim Wählen des Endtags von links nach rechts
  (`scaleX`, Ursprung links), höchstens `DAUER.sm`.
- **Tagesliste:** Einträge des gewählten Tages kommen gestaffelt (höchstens
  6 Elemente, `STAFFEL`), danach still.
- **Nicht bewegen:** Kopf, Wochentagszeile, Legende. Kein Hüpfen der Zellen bei
  Hover, kein Pulsieren von heute.
- Bei „Bewegung reduzieren“ wechselt der Monat sofort, die Auswahl springt.

## Zugänglichkeit

- Das Raster ist eine `grid`-Rolle mit Zeilen und Zellen oder eine echte
  `<table>`. Jede Zelle hat einen vollständigen Namen: „Mittwoch, 14. Oktober
  2026, 2 Termine“.
- Pfeiltasten wandern zwischen Tagen, Bild auf und ab blättern den Monat, Pos 1
  und Ende springen an Wochenanfang und -ende. Nur der gewählte Tag ist in der
  Tab-Reihenfolge (roving tabindex).
- Der Monatswechsel wird angesagt (`aria-live="polite"` am Monatstitel).
- Zustand nie nur über Farbe: heute mit Kontur, nicht wählbar zusätzlich
  durchgestrichen oder mit Text.

## Typische Fehler

- Fünf oder sechs Zeilen je nach Monat: Die Seite springt bei jedem Blättern.
- Zellen, die mit ihrem Inhalt wachsen: Eine volle Woche zerreißt das Raster.
- Woche beginnt am Sonntag (US-Vorlage nicht angepasst).
- Tagesdetails im Modal, obwohl darunter Platz ist.
- Jede Kategorie in einer gesättigten Farbe, dazu ein Auswahl-Blau: Niemand
  sieht mehr, was gewählt ist.
- Eine zweite, eigene Kalenderansicht im selben Produkt, weil die erste nicht
  gefunden wurde.

## Prüfliste

- [ ] Sechs Zeilen, Woche ab Montag, Zellhöhe fest, `tabular-nums`
- [ ] Heute, Auswahl, Zeitraum und nicht wählbar unterscheidbar ohne Farbe
- [ ] Handy unter 400 px: Punkte im Raster plus Tagesliste darunter
- [ ] Pfeiltasten, Bild auf/ab, roving tabindex, Monatswechsel angesagt
- [ ] Blättern mit Richtung, Auswahl per Flip, alles still bei reduzierter Bewegung
- [ ] Gleicher Kalender-Baustein wie im Rest des Produkts (`monatsraster`)

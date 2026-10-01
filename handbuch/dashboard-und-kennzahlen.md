---
titel: Dashboard und Kennzahlen
gruppe: muster
kurz: Die Übersicht einer App: wenige Zahlen mit Vergleich, Diagramme und der nächste Schritt.
stichworte: [dashboard, übersicht, kennzahlen, kpi, statistik, diagramm, chart, auswertung, startseite app, cockpit, reporting]
bausteine: [zahl, platzhalter, svg-zeichnen, reiter, meldung]
demo: [zahl, auftritt]
stand: 2026-10-02
---

## Wofür

Das Dashboard ist die erste Seite nach der Anmeldung. Es beantwortet: **Ist
alles in Ordnung?** und **Was muss ich heute tun?** Es ist kein Bericht, der
alles zeigt, was die Datenbank hergibt. Jede Kachel muss eine Entscheidung
oder eine Handlung auslösen können, sonst gehört sie in eine Auswertung
dahinter.

## Aufbau

- **Kopf:** Seitentitel, Zeitraumwahl (Heute, 7 Tage, Monat, Jahr, eigener
  Zeitraum) und Stand der Daten („Stand 14:32“). Der Zeitraum gilt für die
  ganze Seite, nicht je Kachel.
- **Kennzahlenzeile:** 3 bis 5 Kennzahlen nebeneinander, gleich groß. Jede
  hat Name, Wert mit Einheit, Vergleich und Bezug („+8 % zum Vormonat“).
- **Zu erledigen:** offene Vorgänge, die auf den Nutzer warten (Freigaben,
  Fristen, Fehler). Steht über den Diagrammen, wenn es etwas gibt.
- **Diagramme:** ein Hauptdiagramm über die Breite, darunter höchstens zwei
  kleinere. Jedes mit Titel, der die Aussage nennt, nicht nur die Größe.
- **Letzte Aktivität:** eine kurze Liste (5 Einträge), dann „Alle ansehen“.

Auf dem Handy: Kennzahlen als zweispaltiges Raster, Diagramme untereinander
in voller Breite, „Zu erledigen“ zuerst.

## Funktionen

**Grundausstattung**
- 3 bis 5 Kennzahlen mit Vergleich zum Vorzeitraum
- Zeitraumwahl für die ganze Seite
- Liste „Zu erledigen“ mit direktem Sprung in den Vorgang
- Leerzustand für neue Konten

**Ausbau**
- Diagramme: Verlauf als Linie, Vergleich als Balken, Anteil als gestapelter
  Balken (kein Kreis mit mehr als 3 Teilen)
- Klick auf eine Kennzahl öffnet die gefilterte Liste dahinter
- Vergleich gegen Ziel statt Vorzeitraum, wo ein Ziel existiert
- Export als CSV oder PDF
- Ansichten je Rolle (Geschäftsführung sieht Umsatz, Disposition sieht Touren)

**Speziell**
- Kacheln ein- und ausblenden oder umordnen je Nutzer
- Live-Aktualisierung (Lager, Auslastung, Störungen)
- Schwellen mit Hinweis („Auslastung über 90 %“)
- Bericht per Mail jeden Montag

## Worauf es ankommt

- **Wenige Zahlen, alle mit Vergleich.** Eine Zahl ohne Bezug sagt nichts.
  „1.240 Anfragen“ wird erst mit „+12 % zum Vormonat“ lesbar. Mehr als 5
  Kennzahlen in einer Zeile liest niemand.
- **Keine Hero-Metrik-Vorlage.** Nicht eine Riesenzahl mit kleinem Label,
  drei Nebenwerten und Akzentfläche als Seitengerüst. Kennzahlen sind gleich
  gewichtet, die Hierarchie entsteht durch Reihenfolge, nicht durch Größe.
- **Keine Deko-Grafik.** Sparklines, Fortschrittsringe und Balken mit
  gefüllter Spur nur, wenn sie eine echte Aussage tragen. Sonst Zahl plus
  Vergleich.
- **Eine Farbe für die Aussage.** Die Hauptreihe im Akzent, Vergleichsreihen
  in Grautönen. Grün und Rot nur für gut und schlecht, nie als Reihenfarben.
- **Dichte ist erlaubt.** Es ist eine Arbeitsfläche: kleinere Abstände als auf
  einer Website, Zahlen mit `tabular-nums`, Einheiten in leiserer Farbe.
- **Diagramme stehen ohne JavaScript.** Server rendert das fertige SVG mit den
  echten Werten. Die Bewegung startet aus dem fertigen Zustand, nicht aus
  einer leeren Fläche.
- **Laden in der Endform.** `platzhalter` zeigt Kacheln und Diagrammflächen in
  ihrer echten Größe. Nichts verschiebt sich, wenn die Daten kommen.
- **Leerzustand für neue Konten.** Ein leeres Dashboard mit Nullen und flachen
  Linien wirkt kaputt. Stattdessen: ein Satz, was hier erscheinen wird, und
  der eine Schritt, der die ersten Daten erzeugt („Ersten Auftrag anlegen“).
  Beispieldaten nur deutlich als Beispiel markiert.

## Bewegung

Operate-Fläche: 150 bis 250 ms, keine Lade-Choreografie.

- **Kennzahlen:** `zahl` zählt einmal hoch, beim ersten Laden der Übersicht.
  Wechselt der Zeitraum, läuft der Wert vom alten zum neuen; das ist ein
  Zustandswechsel und darf sichtbar sein. Bei Live-Daten mit kurzer Frequenz
  keine `zahl`, sondern reiner Text: Ständiges Zählen ist Flackern.
- **Balken:** wachsen beim ersten Laden aus der Grundlinie (`scaleY` von 0,
  Ursprung unten), alle zusammen in `DAUER.md`, `KURVE.raus`, Staffel
  höchstens 0,3 s gesamt.
- **Linien:** zeichnen sich einmal von links (`svg-zeichnen`, DrawSVG,
  `DAUER.md`). Fläche unter der Linie blendet danach in `DAUER.sm` ein.
- **Zeitraumwechsel:** Balken und Linien gehen vom alten zum neuen Wert,
  `DAUER.sm`, `KURVE.wechsel`. Kein erneutes Wachsen aus null.
- **Kacheln umordnen (Speziell):** `flip-liste`, `DAUER.sm`.
- **Nicht bewegen:** Kopf, Navigation, Kachelrahmen, Achsen, Beschriftungen.
  Keine Kachel, die beim Hover hochspringt. Kein Auftritt der Kacheln beim
  Seitenwechsel innerhalb der App.
- Bei „Bewegung reduzieren“ stehen alle Werte sofort, Diagramme ohne Wachsen.

## Zugänglichkeit

- Jede Kennzahl ist als ganzer Satz lesbar: „Anfragen im Oktober: 1.240, 12 %
  mehr als im September.“ `zahl` liest nur den Endwert vor.
- Steigen und Fallen nie nur über Farbe: Vorzeichen, Pfeil und Text.
- Diagramme haben `role="img"` und eine Kurzaussage als `aria-label`, dazu
  einen Umschalter „Als Tabelle“ mit den Werten.
- Tooltips erscheinen auch bei Tastaturfokus auf dem Datenpunkt, nicht nur bei
  Hover. Pfeiltasten wandern zwischen Datenpunkten.
- Linien, Balken und Achsen haben mindestens 3:1 Kontrast zum Hintergrund.
- Live-Aktualisierungen werden nicht angesagt. Nur überschrittene Schwellen
  gehen als `role="status"` (über `meldung`).
- Klickbare Kacheln sind Links mit Namen, mindestens 44 px hoch.

## Typische Fehler

- Zwölf Kennzahlen in zwei Reihen, keine davon mit Vergleich.
- Eine riesige Zahl mit Akzentverlauf als Mittelpunkt der Seite.
- Jede Reihe in einer eigenen gesättigten Farbe, dazu Grün und Rot.
- Kreisdiagramm mit sieben Teilen.
- Alle Kacheln zählen und wachsen bei jedem Seitenaufruf, auch beim
  Zurückkehren nach einer Minute.
- Diagramm erst im Browser gebaut: drei Sekunden leere Fläche.
- Neues Konto sieht Nullen, flache Linien und „Keine Daten“.
- Zeitraumwahl je Kachel: Niemand weiß, welche Zahlen zusammengehören.

## Prüfliste

- [ ] 3 bis 5 Kennzahlen, jede mit Einheit, Vergleich und Bezug
- [ ] Ein Zeitraum für die ganze Seite, Stand der Daten sichtbar
- [ ] Diagramme serverseitig gerendert, ein Akzent für die Aussage, Kontrast 3:1
- [ ] `zahl` nur beim ersten Laden und bei Zeitraumwechsel, nicht bei Live-Daten
- [ ] Laden mit `platzhalter` in Endform, Leerzustand mit erstem Schritt
- [ ] Diagramme mit Kurzaussage und Tabellenansicht, Tooltips per Tastatur

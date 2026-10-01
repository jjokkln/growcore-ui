---
titel: Tabelle und Liste
gruppe: muster
kurz: Datensätze in Apps vergleichen, sortieren und bearbeiten, am Desktop wie am Handy.
stichworte: [tabelle, datentabelle, liste, spalten, sortieren, auswahl, zeilenaktionen, paginierung, nachladen, übersicht]
bausteine: [platzhalter, aktion-knopf, meldung]
demo: [platzhalter]
stand: 2026-10-02
---

## Wofür

Eine Tabelle zeigt viele gleichartige Datensätze so, dass man sie vergleichen
kann: Rechnungen, Aufgaben, Kunden, Buchungen. Sie ist das Arbeitsgerät einer
App, kein Schaustück. Auf einer Website ist sie selten richtig; dort sind 3 bis
5 Einträge mit „Alle ansehen“ meist besser. Die erste Frage lautet: **Vergleicht
man hier Spalten, oder sucht man einen Eintrag?** Vergleichen braucht eine
Tabelle, Suchen oft nur eine Liste.

## Aufbau

- **Kopfzeile** mit Spaltennamen, kurz und eindeutig („Fällig“, „Betrag“).
  Sortierbare Spalten tragen einen Pfeil, die aktive Sortierung ist markiert.
- **Zeilen** mit fester Höhe: dicht 36 px, normal 44 px, mit Zeilenaktionen auf
  dem Handy 48 px. Trennung durch eine dünne Linie oder abwechselnde Tönung,
  nicht beides.
- **Erste Spalte** ist der Name des Datensatzes und der Link in die
  Detailansicht. Auswahl-Checkbox davor, wenn es Sammelaktionen gibt.
- **Letzte Spalte** für Zeilenaktionen: höchstens eine sichtbare Aktion, der
  Rest in einem Menü „Weitere Aktionen“.
- **Leiste darüber:** Suche und Filter (siehe Kapitel Filter und Suche); bei
  Auswahl ersetzt eine Aktionsleiste („3 ausgewählt · Exportieren · Löschen“).
- **Fuß:** Ergebniszahl und Paginierung oder Nachladen.

## Funktionen

**Grundausstattung**
- Spalten mit klarer Ausrichtung, Zahlen rechtsbündig mit `tabular-nums`
- Sortieren per Klick auf den Spaltenkopf
- Zeile führt in die Detailansicht, eine Zeilenaktion sichtbar
- Lade- und Leerzustand in der Form der Tabelle (`platzhalter`)
- Darstellung als Karten auf dem Handy

**Ausbau**
- Mehrere Zeilen auswählen, Sammelaktionen in einer Leiste
- Feste Kopfzeile beim Scrollen, feste erste Spalte bei breiten Tabellen
- Paginierung mit wählbarer Seitengröße oder Nachladen per Knopf
- Löschen mit „Rückgängig“ statt Rückfrage (`meldung`)
- Summenzeile (Beträge, Stunden)
- Spalten ein- und ausblenden, Dichte umschalten

**Speziell**
- Bearbeiten direkt in der Zelle
- Gruppieren nach einer Spalte mit aufklappbaren Gruppen
- Export als CSV oder Excel, genau mit den aktiven Filtern
- Spaltenbreite ziehen, Reihenfolge per Ziehen
- Virtualisierung ab mehreren Tausend Zeilen

## Worauf es ankommt

- **Ausrichtung nach Inhalt.** Text links, Zahlen und Beträge rechts, Status und
  Symbole zentriert oder links, Datum links in einem festen Format (02.10.2026).
  Der Spaltenkopf folgt der Ausrichtung seiner Spalte.
- **Zahlen mit `tabular-nums`.** Gleiche Ziffernbreite, damit Stellen
  untereinander stehen. Beträge mit gleicher Zahl an Nachkommastellen und
  Einheit im Kopf („Betrag €“) statt in jeder Zelle.
- **Feste Spaltenbreiten.** Eine Tabelle, deren Spalten beim Sortieren oder
  Nachladen springen, kann man nicht lesen. Lange Texte werden mit „…“ gekürzt,
  der volle Text steht im `title` oder in der Detailansicht.
- **Sortierung sichtbar und stabil.** Der aktive Spaltenkopf zeigt Richtung und
  Zustand. Gleiche Werte behalten ihre vorherige Reihenfolge. Die Sortierung
  steht in der URL.
- **Paginierung oder Nachladen.** Paginierung, wenn man Positionen wiederfinden
  oder auf eine Seite verweisen will (Verwaltung, Buchhaltung). Nachladen per
  Knopf „Weitere 50 laden“, wenn man stöbert. Endloses Scrollen nur bei Feeds,
  nie bei einer Tabelle mit Fußzeile.
- **Auswahl ohne Überraschung.** Die Kopf-Checkbox wählt die sichtbare Seite.
  Danach erscheint „Alle 214 auswählen“ als eigener Schritt. Die Zahl der
  ausgewählten Zeilen steht in der Aktionsleiste.
- **Handy heißt Karten.** Unter 640 px wird jede Zeile eine Karte: Name als
  Titel, 2 bis 4 wichtige Werte als Paare darunter, Aktion rechts. Eine
  Tabelle, die man seitlich scrollen muss, ist auf dem Handy nur als Ausnahme
  für echte Vergleichsdaten erlaubt.
- **Leer heißt erklären.** Eine leere Tabelle sagt, warum sie leer ist und wie
  sie sich füllt („Noch keine Rechnungen. Die erste legen Sie über ‚Neue
  Rechnung‘ an.“). Leer wegen Filter ist ein anderer Fall und bietet „Filter
  zurücksetzen“.

## Bewegung

- **Operate-Fläche:** alle Übergänge 150 bis 250 ms, `DAUER.xs` oder `DAUER.sm`.
  Keine Lade-Choreografie, keine gestaffelt einfliegenden Zeilen.
- **Sortieren:** Zeilen werden sofort getauscht. Bei kleinen Listen bis etwa 30
  Zeilen darf `flip-liste` die Bewegung zeigen, in Tabellen nie.
- **Auswahl:** Die Aktionsleiste ersetzt die Filterleiste mit Kreuzblende in
  `DAUER.xs`, ohne Höhenänderung.
- **Löschen:** Die Zeile blendet in `DAUER.xs` aus und klappt in `DAUER.sm`
  zu; `meldung` mit „Rückgängig“ bleibt mindestens 5 s stehen.
- **Hover und Fokus:** Zeilentönung als CSS-Zustand, ohne Übergang oder mit
  höchstens `DAUER.xs`.
- **Nicht bewegen:** Kopfzeile, Spaltenbreiten, Paginierung. Kein Pulsieren
  neuer Zeilen.
- Bei „Bewegung reduzieren“ fällt alles weg außer Farbwechseln.

## Zugänglichkeit

- Echte `<table>` mit `<th scope="col">`, Beschriftung per `<caption>` oder
  `aria-label`. Keine Tabelle aus `<div>`.
- Sortierbare Köpfe sind Knöpfe im `<th>`; die aktive Spalte trägt
  `aria-sort="ascending"` oder `"descending"`.
- Checkboxen mit Namen der Zeile („Rechnung 2026-041 auswählen“). Die Zahl der
  ausgewählten wird per `aria-live="polite"` angesagt.
- Zeilenaktionen nennen den Datensatz („Rechnung 2026-041 bearbeiten“), Ziel
  mindestens 44 × 44 px auf dem Handy, 32 px am Desktop mit Abstand.
- Die ganze Zeile darf klickbar sein, aber der Link liegt auf dem Namen in der
  ersten Spalte, damit Tastatur und Screenreader ihn finden.
- Nach dem Löschen liegt der Fokus auf der nächsten Zeile, nicht am Seitenanfang.
- Kartenansicht auf dem Handy als Liste (`<ul>`), Werte als `<dl>`.

## Typische Fehler

- Zahlen linksbündig in Proportionalziffern: Beträge kann niemand vergleichen.
- Spalten, die beim Sortieren ihre Breite ändern.
- Fünf Symbol-Aktionen je Zeile ohne Beschriftung.
- Rückfrage-Dialog bei jedem Löschen statt „Rückgängig“.
- Kopf-Checkbox wählt still alle 2000 Datensätze statt der sichtbaren Seite.
- Spinner in der Mitte statt Platzhalterzeilen in Tabellenform.
- Die Desktop-Tabelle auf dem Handy, seitlich scrollend, ohne Kopfzeile im Blick.
- „Keine Daten“ als einziger Text einer leeren Tabelle.

## Prüfliste

- [ ] Text links, Zahlen rechts mit `tabular-nums`, Datum im festen Format
- [ ] Feste Spaltenbreiten, feste Zeilenhöhe, Kopfzeile bleibt stehen
- [ ] Sortierung sichtbar, stabil, in der URL, `aria-sort` gesetzt
- [ ] Auswahl mit Zahl, „Alle auswählen“ als eigener Schritt
- [ ] Höchstens eine sichtbare Zeilenaktion, Löschen mit „Rückgängig“
- [ ] Paginierung oder Nachladen bewusst gewählt
- [ ] Handy unter 640 px als Karten, Lade- und Leerzustand in Endform
- [ ] Übergänge 150 bis 250 ms, keine Lade-Choreografie

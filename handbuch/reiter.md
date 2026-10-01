---
titel: Reiter
gruppe: muster
kurz: Gleichrangige Inhalte desselben Gegenstands nebeneinander, von denen einer sichtbar ist.
stichworte: [reiter, tabs, registerkarten, tab-leiste, umschalter, unterseiten, ansichten, segmente]
bausteine: [reiter]
demo: [reiter]
stand: 2026-10-02
---

## Wofür

Reiter teilen Inhalte, die **zum selben Gegenstand gehören, gleichrangig sind
und einzeln gebraucht werden**: Übersicht, Aktivität und Einstellungen eines
Projekts. Sie sparen Platz und halten die Seite ruhig.

Reiter sind falsch, wenn

- alles gelesen werden soll: dann Abschnitte untereinander, auf Websites fast
  immer, weil Besucher scrollen statt klicken;
- die Inhalte nacheinander kommen: dann Schritte;
- sie Daten filtern: dann Filterchips oder ein Segmentschalter;
- es mehr als 6 sind: dann eine Seitenleiste oder eine Auswahl;
- jeder Reiter eine eigene Seite lädt: dann ist es Navigation (siehe Navigation).

## Aufbau

- **Leiste:** waagerecht über dem Inhalt, 40–48 px hoch, Treffflächen mindestens
  44 px. Labels ein bis zwei Wörter, gleiche Wortart (Substantive).
- **Indikator:** 2 px Linie unter dem aktiven Reiter im Akzent, dazu
  kräftigeres Gewicht. Als Segmentschalter eine gefüllte Fläche hinter dem
  aktiven Reiter.
- **Zähler:** optional rechts am Label („Dateien 12“), gedämpft, `tabular-nums`.
- **Panel:** direkt darunter, ohne eigene Karte um sich. Die Leiste bleibt beim
  Wechsel stehen.
- **Überlauf:** auf dem Handy scrollt die Leiste waagerecht, angeschnittener
  letzter Reiter zeigt, dass es weitergeht. Kein Umbruch in zwei Zeilen.
- **Senkrecht:** für Einstellungen links eine Liste, rechts der Inhalt. Unter
  768 px wird daraus eine Liste, die zu einer eigenen Ansicht führt.

## Funktionen

**Grundausstattung**
- 2–6 Reiter mit Indikator
- Tastatur nach WAI-ARIA (Pfeile, Pos 1, Ende)
- Aktiver Reiter in der Adresse (`?tab=aktivitaet`)

**Ausbau**
- Gleitender Indikator
- Zähler an Reitern
- Waagerecht scrollende Leiste auf dem Handy, aktiver Reiter im Blick
- Ungespeicherte Änderungen bleiben beim Wechsel erhalten
- Inhalt erst beim ersten Öffnen laden, mit Platzhalter in Endform

**Speziell**
- Senkrechte Reiter für Einstellungsseiten
- Fehlersymbol am Reiter, wenn darin ein Pflichtfeld fehlt
- Schließbare und verschiebbare Reiter (Editoren, mehrere offene Dokumente)

## Worauf es ankommt

- **Inhalt springt nicht.** Die Leiste bleibt an ihrem Platz, auch wenn ein
  Panel kürzer ist. Panels gleicher Art stehen im selben Rasterfeld
  übereinander (`grid-area: 1 / 1`), die Höhe richtet sich nach dem größten.
  Bei sehr ungleichen Panels reicht eine Mindesthöhe, damit der Fuß der Seite
  nicht hochspringt.
- **Zustand in der Adresse.** `?tab=` mit deutschem, kleingeschriebenem Wert.
  Ein Link öffnet genau diesen Reiter, Neuladen behält ihn. Gesetzt wird mit
  `router.replace`, damit „Zurück“ die Seite verlässt und nicht durch jeden
  Reiter einzeln zurückblättert. Der Seitenwechsel animiert dabei nicht, weil
  sich nur die Abfrage ändert.
- **Ungespeichertes schützen.** Panels mit Formularen bleiben beim Wechsel
  erhalten (versteckt, nicht entfernt), Eingaben gehen nicht verloren.
  Nachgefragt wird erst beim Verlassen der Seite, und nur wenn etwas geändert
  wurde.
- **Eine Ebene.** Keine Reiter in Reitern. Braucht ein Reiter eigene Reiter,
  ist er eine eigene Seite.
- **Eine Akzentfarbe für aktiv.** Inaktive Reiter neutral und lesbar, nicht
  verblasst unter 4,5:1.
- **Gleiche Reiter überall.** In einem Produkt sieht jede Reiterleiste gleich
  aus. Linie hier und Segmentschalter dort nur, wenn die Bedeutung verschieden
  ist (Ansichten gegenüber Filter).

## Bewegung

- **Indikator:** gleitet vom alten zum neuen Reiter, statt zu verschwinden und
  neu aufzutauchen. Bewegt wird `x` und `scaleX` (Ursprung links), nie `width`
  oder `left`. `DAUER.sm` mit `KURVE.wechsel`, weil er den Platz wechselt. Per
  GSAP `to` auf die gemessene Position oder per Flip. Grund: Kontinuität, man
  sieht, wohin die Auswahl gegangen ist.
- **Panel:** blendet in `DAUER.sm` mit `KURVE.raus` ein und steigt dabei 6 px
  auf. Kein seitliches Gleiten, kein Auftritt einzelner Inhalte.
- **Hover:** Hintergrund oder Textfarbe per CSS-Übergang in `DAUER.xs`.
- **Überlauf:** Wird ein Reiter angewählt, der halb verdeckt ist, scrollt die
  Leiste ihn sanft ins Bild (`scrollIntoView` mit `inline: 'nearest'`).
- **Nicht bewegen:** Leiste, Labels, Zähler, Höhe des Bereichs. Kein
  gestaffelter Auftritt der Panel-Inhalte bei jedem Wechsel.
- Bei „Bewegung reduzieren“ springt der Indikator, das Panel wechselt sofort.

## Zugänglichkeit

- Rollen: `tablist` mit Namen (`aria-label` oder `aria-labelledby`), darin
  `tab`, dazu je ein `tabpanel`. Der aktive Reiter hat `aria-selected="true"`,
  jeder Reiter `aria-controls` auf sein Panel, jedes Panel `aria-labelledby`
  auf seinen Reiter.
- **Tastatur:** Pfeil links und rechts wandern zwischen Reitern (senkrecht:
  hoch und runter), Pos 1 und Ende springen zum ersten und letzten. Nur der
  aktive Reiter ist in der Tab-Reihenfolge (roving tabindex), Tab springt von
  dort ins Panel.
- **Aktivierung:** automatisch beim Pfeil, wenn der Inhalt sofort da ist (so
  arbeitet der Baustein). Lädt ein Panel nach, aktivieren erst Enter oder
  Leertaste, damit Pfeiltasten nicht jedes Panel laden.
- Ein Panel ohne fokussierbaren Inhalt bekommt `tabindex="0"`.
- Zähler gehören in den Namen: „Dateien, 12“.
- Reiter, die Seiten laden, sind keine `tablist`, sondern `<nav>` mit
  `aria-current="page"`.
- Indikator mindestens 3:1 gegen den Hintergrund, Labels mindestens 4,5:1,
  Treffflächen mindestens 44 px hoch.

## Typische Fehler

- Reiter auf einer Leistungsseite, deren Inhalt alle lesen sollten.
- Leiste springt, weil das neue Panel kürzer ist und die Seite hochrutscht.
- Reiter ohne Adresse: Neuladen und geteilte Links landen immer im ersten.
- Jeder Reiterwechsel erzeugt einen Eintrag im Verlauf, „Zurück“ blättert
  durch alle Reiter.
- Formulareingaben weg, weil das Panel beim Wechsel entfernt wurde.
- Indikator über `width` und `left` animiert: ruckelt.
- Zweizeilige Reiterleiste auf dem Handy.
- `role="tablist"` für eine Navigation, die Seiten wechselt.

## Prüfliste

- [ ] Reiter sind die richtige Wahl (gleichrangig, einzeln gebraucht, höchstens 6)
- [ ] `tablist`, `tab`, `tabpanel` mit `aria-selected`, `aria-controls`, Namen
- [ ] Pfeile, Pos 1, Ende, roving tabindex
- [ ] Aktiver Reiter in `?tab=`, gesetzt per `replace`
- [ ] Leiste springt nicht, Panelhöhe stabil
- [ ] Ungespeicherte Eingaben überleben den Wechsel
- [ ] Indikator gleitet über `x` und `scaleX`, `DAUER.sm`, sofort bei reduzierter Bewegung
- [ ] Gleiche Reiterleiste wie im Rest des Produkts (`reiter`)

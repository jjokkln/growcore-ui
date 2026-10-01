---
titel: Abstand und Raster
gruppe: grundlagen
kurz: Abstände aus einer Skala, Breiten und Breakpoints fest, Dichte nach Zweck.
stichworte: [abstand, abstände, weißraum, raster, grid, layout, breakpoint, responsive, container, dichte]
bausteine: [flip-liste, aufklappen]
demo: []
stand: 2026-10-02
---

## Wofür

Abstand ordnet, bevor Linien oder Kästen nötig werden. Was nah beieinander
steht, gehört zusammen; was weit auseinander steht, ist etwas Neues. Ein festes
Raster sorgt dafür, dass jede Seite eines Projekts gleich atmet und dass ein
Layout auf dem Handy nicht zufällig, sondern geplant umbricht.

## Abstandsskala

- **Grundeinheit 4 px,** gedacht im 8-px-Raster. Die Skala: 4 · 8 · 12 · 16 ·
  24 · 32 · 48 · 64 · 96 · 128 px. In Tailwind entspricht eine Stufe 4 px
  (`gap-2` = 8 px, `py-16` = 64 px).
- **Nur Werte aus der Skala.** Kein `mt-[13px]`. Eine Lücke, die nicht passt,
  ist meist ein Zeichen für falsche Gruppierung, nicht für einen fehlenden Wert.
- **Abstand über `gap`,** nicht über Außenabstände an Kindern. Das Elternelement
  bestimmt den Rhythmus, das Kind bleibt frei verwendbar.
- **Innenabstände** von Feldern und Knöpfen aus derselben Skala: etwa 8 × 12 px
  in Apps, 12 × 20 px auf Marketingseiten.

## Nähe gruppiert

- Innerhalb einer Gruppe (Label und Feld, Titel und Text): 4 bis 12 px.
- Zwischen Gruppen (zwei Formularblöcke, zwei Karten): 24 bis 32 px.
- Zwischen Sektionen: in Apps 32 bis 48 px, auf Marketingseiten 64 bis 128 px.
- **Mehr Raum über als unter einer Überschrift.** Faustregel: oben mindestens
  das Doppelte von unten, etwa 48 px darüber, 16 px darunter. Sonst klebt die
  Überschrift am vorigen Abschnitt statt an ihrem eigenen.
- Wer gleichmäßige Abstände überall setzt, verliert die Gruppierung. Dann
  werden Rahmen und Linien nötig, die eigentlich der Weißraum leisten könnte.

## Container und Breiten

- **Seitencontainer:** `max-w-7xl` (1280 px) oder `max-w-[1400px]`, mittig.
- **Lesespalte:** höchstens 65 bis 75 Zeichen (`max-w-[65ch]`), auch wenn der
  Container breiter ist.
- **Formulare:** einspaltig, höchstens etwa 36rem (576 px). Zwei Felder nur
  nebeneinander, wenn sie zusammengehören (PLZ und Ort, Vor- und Nachname).
- **Seitenrand:** 16 px auf dem Handy, 24 px ab `md`, 32 px ab `lg`. Nichts
  berührt den Bildschirmrand außer bewusst randlosen Bildern.
- **Hero:** `min-h-[100dvh]`, nie `h-screen` (springt in mobilen Browsern mit
  der Adressleiste).

## Breakpoints

| Name | ab | typische Änderung |
| --- | --- | --- |
| `sm` | 640 px | größere Abstände, zwei Knöpfe nebeneinander |
| `md` | 768 px | erste Mehrspaltigkeit |
| `lg` | 1024 px | Seitenleiste sichtbar, volle Navigation |
| `xl` | 1280 px | volle Containerbreite, Zusatzspalte |

- **Unter 768 px einspaltig.** Jede mehrspaltige Komponente legt ihren
  Handy-Aufbau selbst fest, in derselben Datei.
- Mobil zuerst schreiben: Grundklassen für das Handy, Präfixe für größere
  Bildschirme.
- Komponenten, die in Seitenleiste und Hauptfläche vorkommen, reagieren auf
  ihren Container (`@container`), nicht auf den Bildschirm.
- Responsives Verhalten ist Struktur: Seitenleiste einklappen, Tabelle zur
  Liste, Spalten stapeln. Nicht: Schrift stufenlos verkleinern.

## Dichte nach Fläche

| Fläche | Zweck | Dichte |
| --- | --- | --- |
| Persuade | Marketing, Landingpage | großzügig: Sektionen 64–128 px, wenig je Bildschirm |
| Operate | App, Dashboard, Tabelle | dicht: Zeilen 40–48 px, Sektionen 24–48 px |
| Read | Doku, Ratgeber, Rechtstexte | ruhig: Lesespalte, Absätze 16–24 px auseinander |

- Eine Seite kann mehrere Flächen haben (Marketingseite mit Preisrechner). Jede
  Fläche hält ihre eigene Dichte.
- Dichte heißt nicht kleine Ziele: Auch in Operate-Flächen bleiben
  Bedienelemente auf dem Handy mindestens 44 × 44 px groß.

## CSS Grid statt Prozentrechnung

- Spalten über `grid-template-columns` und `gap`, nie über
  `w-[calc(33%-1rem)]` und Flex-Umbruch.
- Ungleiche Spalten direkt benennen: `grid-cols-[2fr_1fr]`.
- Kartenraster ohne Breakpoints: `repeat(auto-fill, minmax(18rem, 1fr))`.
- Flex für eine Zeile (Knopfgruppe, Kopfzeile), Grid für zwei Richtungen.
- `z-index` nur für Systemebenen (Navigation, Menü, Dialog) aus einer Skala in
  einer Datei, nicht `z-50` nach Gefühl.

## Worauf es ankommt

- **Skala statt Gefühl.** Jeder Abstand stammt aus der Skala; wer zwei
  Bildschirme vergleicht, findet dieselben Werte.
- **Gruppen sichtbar ohne Linien.** Erst Abstand, dann Hintergrundton, erst
  zuletzt eine Linie oder ein Rahmen.
- **Der Handy-Aufbau ist ein eigener Entwurf.** Er wird geplant, nicht
  dem Umbruch überlassen. Geprüft wird bei 390 px.
- **Nichts springt.** Platz für Bilder, Werbeflächen und nachladende Inhalte
  ist reserviert (`aspect-ratio`, feste Höhen), damit der Inhalt beim Laden
  nicht verrutscht.

## Bewegung

- Abstand selbst bewegt sich nicht. Wechselt ein Layout (Filter, Umsortieren,
  Spalte ein- und ausklappen), gleiten die Elemente mit `flip-liste` (GSAP
  Flip) an den neuen Platz, `DAUER.sm` mit `KURVE.wechsel`.
- Aufklappende Bereiche öffnen über `aufklappen` (Höhe als Grid-Zeile, nicht
  als `height`), `DAUER.sm`.
- Nie `top`, `left`, `width` oder `height` animieren.
- Bei „Bewegung reduzieren“ springt das Layout an die neue Stelle.

## Typische Fehler

- Überall 16 px: Alles ist gleich weit voneinander entfernt, nichts gruppiert.
- Überschrift mit gleichem Abstand nach oben und unten.
- Freie Werte (`mt-[22px]`) neben Skalenwerten.
- Drei Spalten bleiben auf dem Handy stehen und quetschen den Text auf
  80 px Breite.
- Prozentrechnung mit `calc()` statt Grid, Umbruch bricht bei einer
  zusätzlichen Karte.
- Absatz über die volle Containerbreite von 1280 px.
- `h-screen` im Hero, auf dem Handy ist der Knopf unter der Adressleiste.

## Prüfliste

- [ ] Alle Abstände aus der 4/8-px-Skala, Abstand über `gap`
- [ ] Mehr Raum über als unter Überschriften (etwa 2 : 1)
- [ ] Container `max-w-7xl`, Lesespalte 65–75 Zeichen, Seitenrand 16 px mobil
- [ ] Breakpoints `sm` 640, `md` 768, `lg` 1024, `xl` 1280, unter 768 einspaltig
- [ ] Dichte passt zur Fläche (Persuade, Operate, Read)
- [ ] Spalten mit CSS Grid, keine `calc()`-Prozente
- [ ] Bei 390 px geprüft, nichts läuft über, nichts springt beim Laden

---
titel: Typografie
gruppe: grundlagen
kurz: Schrift wählen, Größen staffeln und deutschen Text sauber setzen.
stichworte: [typografie, schrift, schriftart, font, schriftgröße, zeilenhöhe, zeilenlänge, überschrift, silbentrennung, zahlen]
bausteine: [text-auftritt, zahl]
demo: [text-auftritt]
stand: 2026-10-02
---

## Wofür

Typografie entscheidet, ob eine Seite lesbar ist, bevor jemand eine Farbe oder
ein Bild wahrnimmt. Sie trägt die Hierarchie: Was ist Überschrift, was ist
Text, was ist ein Wert. Jedes Projekt legt einmal Schrift, Skala und
Zeilenmaße fest und hält sich überall daran.

## Schriftwahl

- **Eine Familie reicht oft.** In Apps trägt eine gut gesetzte Sans
  Überschriften, Knöpfe, Labels, Text und Zahlen. Eine zweite Familie nur mit
  einer Aufgabe, die die erste nicht erfüllt (etwa Mono für Code oder Messwerte).
- **Sans-Kandidaten:** Geist, Satoshi, Cabinet Grotesk, ABC Diatype, Söhne,
  GT America, GT Walsheim, PP Neue Montreal. Erprobte Paare: Geist mit Geist
  Mono, Satoshi mit JetBrains Mono, Cabinet Grotesk mit Inter Tight.
- **Nicht aus Gewohnheit:** Inter als Display, Fraunces, Instrument Serif und
  Sans, Playfair Display, Cormorant, Lora, Crimson, Newsreader, Syne, Space
  Grotesk, Space Mono, IBM Plex, DM Sans, DM Serif, Outfit, Plus Jakarta Sans.
  Grund: Sie sind die Voreinstellungen generierter Oberflächen und lassen eine
  Seite austauschbar wirken. Erlaubt nur mit einem Grund, den keine andere
  Schrift erfüllt. „Buch, also Serif“ oder „Technik, also Mono“ ist kein
  solcher Grund.
- **Inter ist in Ordnung,** wenn ausdrücklich neutral gewünscht ist oder die
  Seite öffentlich und barrierefrei zuerst ist.
- **Serif nur begründet:** wenn die Marke eine nennt oder die Seite wirklich
  editorial, Publikation oder Heritage ist. Nie in Dashboards.
- **Betonung** in einer Überschrift über Kursiv oder Fett derselben Familie,
  nie über ein eingestreutes Wort aus einer zweiten Schrift.

## Skala

- **Marketing (Persuade):** Display `text-4xl md:text-6xl`, `tracking-tighter`,
  `leading-none`. Höchstens 6rem, Laufweite nicht enger als -0.04em. Die
  Überschrift im Hero hat höchstens zwei Zeilen; vier Zeilen sind ein
  Größenfehler, kein Inhaltsproblem.
- **App (Operate):** feste rem-Skala, keine fließenden Größen mit `clamp()`.
  Verhältnis 1.125 bis 1.2 zwischen den Stufen, etwa 12 · 14 · 16 · 18 · 20 ·
  24 px. Eine Überschrift, die in einer Seitenleiste schrumpft, hilft niemandem.
- **Lesen (Read):** Fließtext 17 bis 18 px, Überschriften in deutlichen
  Stufen, damit das Überfliegen funktioniert.
- **Untergrenzen:** Fließtext 16 px. Eingabefelder auf dem Handy mindestens
  16 px, sonst zoomt iOS beim Antippen. Kleinster Text (Fußnote, Label) 12 px.

## Zeilen

- **Länge:** Fließtext 65 bis 75 Zeichen (`max-w-[65ch]`). Tabellen und dichte
  Bedienflächen dürfen breiter laufen.
- **Höhe:** Fließtext 1.5 bis 1.7 (`leading-relaxed`), Überschriften 1.0 bis
  1.2. Kursive Display-Zeilen mit Unterlängen (g, j, p, q, y) mindestens 1.1
  plus etwas Innenabstand unten, sonst schneidet der Container ab.
- **Umbruch:** Überschriften mit `text-wrap: balance`, Absätze mit
  `text-wrap: pretty`. Kein `<br>` als Gestaltungsmittel.

## Deutscher Text

- `lang="de"` am `<html>`. Ohne diese Angabe trennt der Browser nicht deutsch
  und Screenreader lesen mit falscher Aussprache.
- **Silbentrennung** im Fließtext schmaler Spalten mit `hyphens: auto`. In
  Überschriften, Knöpfen und Labels nicht automatisch trennen; dort gezielt mit
  `&shy;` an der gewünschten Stelle.
- **Lange Wörter** („Datenschutzerklärung“, „Auftragsbestätigung“) brechen
  unter 400 px aus Karten und Tabellenzellen. Abhilfe in dieser Reihenfolge:
  kürzeres Wort, `&shy;`, `overflow-wrap: anywhere` als Netz. Jede Seite mit
  dem echten, längsten Text prüfen.
- **Deutsche Anführungszeichen** „…“ und der Apostroph ’, keine geraden
  Zeichen im sichtbaren Text.

## Zahlen

- `tabular-nums` überall, wo Zahlen untereinander stehen oder sich ändern:
  Tabellen, Preise, Summen, Zähler, Uhrzeiten, Kalender. Sonst springt die
  Breite bei jeder Ziffer.
- In dichten Datenflächen dürfen Zahlen in einem Mono-Schnitt laufen, im
  Fließtext nicht.
- Hochzählende Kennzahlen über den Baustein `zahl`, nicht mit eigenem Zähler.

## Laden über next/font

- Schriften über `next/font/local` (eigene Dateien) oder `next/font/google`.
  Beide liefern die Datei vom eigenen Server aus; es geht keine Anfrage an
  Google. Nie ein Google-Fonts-`<link>` im Kopf.
- Variable Schrift statt einzelner Schnitte, `display: 'swap'`, Teilmenge
  `latin` (enthält die Umlaute und ß).
- Schrift als CSS-Variable an `<html>` hängen und in Tailwind als
  `--font-sans` eintragen. Kein Schriftname direkt in Komponenten.
- Höchstens zwei Familien und so wenige Schnitte wie möglich laden; jeder
  Schnitt kostet Ladezeit vor dem ersten lesbaren Text.

## Worauf es ankommt

- **Gewicht statt Größe.** Hierarchie entsteht über Gewicht und Farbe, nicht
  über eine immer größere Überschrift. Drei Gewichte reichen meist (400, 500,
  600 oder 700).
- **Gedämpft, aber lesbar.** Nebentext in gedämpfter Farbe hält mindestens
  4,5:1 Kontrast, große Schrift mindestens 3:1.
- **Eine Skala für alles.** Jede Größe im Projekt stammt aus der Skala. Eine
  15-px-Ausnahme in einer Karte ist der Anfang vom Wildwuchs.
- **Keine Display-Schrift in Bedienelementen.** Knöpfe, Labels, Tabellen und
  Formulare laufen in der Textschrift.
- **Echter Text beim Prüfen.** Blindtext ist kürzer als deutscher Text. Erst
  mit den echten Wörtern an jeder Breite zeigt sich, was überläuft.

## Bewegung

- Text bewegt sich höchstens an **einem** gestalteten Moment, meist der
  Hero-Überschrift: zeilen- oder wortweise mit `text-auftritt` (SplitText),
  `DAUER.lg`, `KURVE.stark`, `STAFFEL`. Der Text ist vorher im DOM und ohne
  Animation lesbar.
- Fließtext, Labels, Tabellen und Zahlen in Apps bewegen sich nicht. Keine
  Schreibmaschine, kein Buchstabenregen.
- Bei „Bewegung reduzieren“ steht der Text sofort.

## Typische Fehler

- Inter mit slate-900 als ungeprüfte Voreinstellung.
- Fließende Größen mit `clamp()` in einer App, dadurch springen Labels
  zwischen Bildschirmen.
- Absätze über die volle Breite eines 1440-px-Bildschirms.
- Fehlendes `lang="de"`: keine Trennung, falsche Aussprache im Screenreader.
- Ein langes Kompositum sprengt eine Karte auf dem Handy.
- Proportionale Ziffern in einer Preistabelle: Die Spalten tanzen.
- Schrift per `<link>` von Google geladen (Anfrage vor der Einwilligung).
- Verlaufsschrift in einer großen Überschrift.

## Prüfliste

- [ ] Schrift nicht aus der Gewohnheitsliste oder mit Grund belegt
- [ ] Feste rem-Skala in Apps (Verhältnis 1.125–1.2), Display höchstens 6rem
- [ ] Fließtext 16 px oder mehr, 65–75 Zeichen, Zeilenhöhe 1.5–1.7
- [ ] `lang="de"`, `hyphens: auto` im Fließtext, längstes Wort an 390 px geprüft
- [ ] `tabular-nums` in Tabellen, Preisen, Zählern und Uhrzeiten
- [ ] Schrift über `next/font`, variabel, `swap`, kein externer Request
- [ ] Höchstens ein bewegter Textmoment, bei reduzierter Bewegung statisch

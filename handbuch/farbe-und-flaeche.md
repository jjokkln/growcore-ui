---
titel: Farbe und Fläche
gruppe: grundlagen
kurz: Ein Akzent, ruhige Neutrale, feste Zustandsfarben und eine Radius-Skala.
stichworte: [farbe, farben, palette, akzent, kontrast, dark mode, hell dunkel, schatten, radius, ecken]
bausteine: [meldung]
demo: []
stand: 2026-10-02
---

## Wofür

Farbe zeigt, was wichtig ist, was gewählt ist und was gerade passiert. Fläche
(Ebenen, Schatten, Ecken) zeigt, was zusammengehört und was darüber liegt.
Beides funktioniert nur, wenn es sparsam und überall gleich eingesetzt wird.
Jedes Projekt legt Farben und Formen einmal als Tokens fest; Komponenten
verwenden nur diese Tokens, nie freie Werte.

## Ein Akzent

- **Eine Akzentfarbe je Projekt,** Sättigung unter 80 %. Sie markiert die
  Hauptaktion, die aktuelle Auswahl und aktive Zustände. Sonst nichts.
- **Farb-Lock:** Der Akzent gilt auf jeder Seite und in jeder Sektion. Kein
  blauer Knopf in Sektion 7, kein türkises Abzeichen im Footer.
- **Kein Akzent als Dekoration.** Wird er für Hintergründe, Icons und Rahmen
  verbraucht, fällt die Hauptaktion nicht mehr auf.
- **Kein Lila-Blau-Glühen** und keine Neonverläufe aus Gewohnheit. Ist die
  Marke lila, bleibt sie lila, dann konsequent und mit passenden Neutralen.
- **Keine Beige-Messing-Palette** als Voreinstellung für hochwertige
  Produkte. Sie ist das Muster generierter Premiumseiten. Alternativen:
  Silbergrau und Chrom, Tiefgrün mit Bernstein, Kobalt mit Creme,
  Terrakotta mit Schiefer, Monochrom mit einem gesättigten Akzent.

## Neutrale

- **Eine Grau-Familie** (Zinc, Slate oder Stone), nie warme und kalte Grautöne
  gemischt. Neutrale tragen Text, Linien, Flächen und deaktivierte Zustände.
- **Kein reines Schwarz und Weiß.** Text in Fast-Schwarz (etwa zinc-950),
  Hintergrund in Fast-Weiß. Reines `#000` auf `#fff` flimmert bei langen Texten,
  reines Schwarz als Dunkelfläche lässt Ebenen verschwinden.
- **Vier bis fünf Stufen** reichen für Text: stark (Überschrift), normal,
  gedämpft (Nebentext), leise (Platzhalter in Feldern, Trennlinien). Jede
  Textstufe besteht den Kontrast.

## Zustandsfarben

Ein festes Vokabular, in jedem Projekt dieselben vier Bedeutungen:

| Zustand | Farbfamilie | Bedeutung |
| --- | --- | --- |
| Erfolg | Grün | erledigt, gespeichert, aktiv |
| Warnung | Bernstein | Achtung, bald fällig, unvollständig |
| Fehler | Rot | fehlgeschlagen, ungültig, überfällig |
| Info | Blau oder Neutral | Hinweis ohne Handlungsdruck |

- Jede Zustandsfarbe hat drei Tokens: Fläche (hell getönt), Rand, Text. Text
  auf der getönten Fläche besteht 4,5:1.
- **Nie nur Farbe.** Jeder Zustand trägt zusätzlich ein Icon und ein Wort.
  Rot-Grün-Schwäche ist häufig, und Graustufen-Ausdrucke gibt es weiter.
- Ist der Akzent selbst grün oder rot, wird die Zustandsfarbe im Ton
  verschoben, damit „gewählt“ und „Erfolg“ nicht verwechselt werden.
- Zustandsfarben nur für Zustände. Kein grüner Knopf, weil Grün freundlich
  wirkt.

## Kontrast

- Fließtext und Platzhaltertext mindestens 4,5:1, große Schrift (ab 24 px oder
  ab 18,7 px fett) mindestens 3:1.
- Bedienelemente und Fokusringe mindestens 3:1 gegen ihre Umgebung: Rahmen von
  Eingabefeldern, Checkboxen, Schalter.
- Auf farbigen Flächen den Nebentext aus dem Farbton der Fläche abtönen, nicht
  mit Grau. Grau auf Farbe wirkt schmutzig und fällt oft durch.
- Knopf über einem Foto nur mit Abdunklung oder Kontur.

## Theme

- **Hell oder dunkel nach Nutzungsszene,** nicht nach Branche: Wer nutzt es, wo,
  bei welchem Licht? Eine Disposition im Lager braucht etwas anderes als ein
  Portal, das abends am Sofa geöffnet wird.
- **Ein Theme je Seite.** Keine invertierte Sektion mittendrin; Tönungen
  derselben Familie sind erlaubt. Theme einmal am Root setzen.
- **Zweiter Modus nur auf Wunsch.** Gibt es beide: eine Token-Strategie
  (CSS-Variablen), `prefers-color-scheme` respektiert, Kontrast in beiden
  Modi geprüft, beide angesehen.
- **Im dunklen Modus** entsteht Erhöhung über hellere Flächen, nicht über
  Schatten. Akzent und Zustandsfarben eine Stufe heller und weniger gesättigt.

## Schatten

- **Schatten haben Versatz und weiche Unschärfe,** etwa `0 1px 2px` für
  Karten und `0 8px 24px` für schwebende Ebenen. Ein Schatten ohne Versatz
  ist ein Glühen und damit Dekoration.
- Schattenfarbe aus dem Hintergrund getönt, nie reines Schwarz auf hell.
- Höchstens drei Schattenstufen: aufliegend, schwebend (Menü, Popover),
  überlagernd (Dialog, Schublade).
- Kein Glas und keine Unschärfe als Schmuck. Wo Glas eine Aufgabe hat, gibt es
  unter `prefers-reduced-transparency` eine massive Fläche.

## Radius (Form-Lock)

- **Eine Radius-Skala je Projekt.** Zum Beispiel: Ecken 0 überall, oder 6 px
  für Felder und Knöpfe, 12 px für Karten, 16 px für Dialoge, oder Pill für
  Bedienelemente. Gemischt nur mit einer Regel, die überall gilt.
- **Verschachtelte Ecken:** Der innere Radius ist der äußere minus Innenabstand.
  Gleiche Radien ineinander sehen ausgebeult aus.
- shadcn/ui nie im Auslieferungszustand: Radius, Farben und Schatten an das
  Projekt anpassen.

## Flächenebenen in Apps

- **Grund:** der Seitenhintergrund.
- **Fläche:** Inhaltsbereiche, Tabellen, Formulare.
- **Zweite Neutralebene:** Seitenleiste, Werkzeugleiste, Paneele, eine Spur
  kühler oder wärmer als die Inhaltsfläche.
- **Schwebend:** Menüs, Popover, Tooltips.
- **Überlagernd:** Dialog und Schublade mit abgedunkeltem Hintergrund.

Mehr als diese fünf Ebenen braucht keine App. Karten in Karten sind immer
falsch.

## Worauf es ankommt

- **Farbe heißt etwas.** Akzent ist Aktion und Auswahl, Rot ist Fehler, Grün
  ist Erfolg. Wer eine Farbe sieht, weiß ohne Legende, was sie bedeutet.
- **Inaktive Zustände leise.** Volle Sättigung auf nicht gewählten Elementen
  macht die Auswahl unsichtbar.
- **Tokens statt Werte.** Kein Hex-Code in einer Komponente. Ein Farbwechsel
  ist eine Zeile in den Tokens.
- **Gleiche Form überall.** Wenn ein Speichern-Knopf an zwei Stellen
  verschiedene Ecken hat, ist einer davon falsch.

## Bewegung

- Farbwechsel an Bedienelementen (Hover, Aktiv) per CSS-Übergang in
  `DAUER.xs`, nur `background-color`, `border-color`, `color`.
- Schatten darf beim Anheben einer ziehbaren Karte wachsen, `DAUER.sm`,
  `KURVE.raus`.
- Theme-Wechsel ohne Übergang auf allen Elementen; höchstens ein
  Seitenwechsel über `<ViewTransition>`.
- Nicht bewegen: pulsierende Farben, wandernde Verläufe im Hintergrund.

## Typische Fehler

- Drei Akzentfarben, weil jede Sektion „etwas Eigenes“ bekommen sollte.
- Fehler nur in Rot, ohne Icon und Text.
- Reines Schwarz als Dunkelmodus-Hintergrund, Schatten darauf unsichtbar.
- Grauer Nebentext auf farbiger Fläche unter 4,5:1.
- Farbiger Glow ohne Versatz als „Tiefe“.
- Ecken 8, 10, 12 und 20 px nebeneinander, ohne Regel.
- Eine dunkle Sektion mitten in einer hellen Seite.

## Prüfliste

- [ ] Ein Akzent, Sättigung unter 80 %, nur für Aktion und Auswahl
- [ ] Eine Grau-Familie, kein reines `#000` oder `#fff`
- [ ] Erfolg, Warnung, Fehler, Info als Tokens, jeweils mit Icon und Wort
- [ ] Text 4,5:1, große Schrift und Bedienelemente 3:1, in jedem Modus
- [ ] Theme aus der Nutzungsszene begründet, eins je Seite
- [ ] Schatten mit Versatz, getönt, höchstens drei Stufen
- [ ] Eine Radius-Skala, innere Ecken kleiner als äußere

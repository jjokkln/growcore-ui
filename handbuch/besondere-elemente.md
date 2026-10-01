---
titel: Besondere Elemente
gruppe: besonderes
kurz: Gestaltete Bewegungsmomente für Marketingseiten: was wirkt, wann es passt, was schadet.
stichworte: [animation, effekt, wow-effekt, scroll-animation, parallax, textanimation, hover-effekt, laufband, marquee, preloader, seitenübergang, gsap]
bausteine: [bild-enthuellung, kartenstapel, laufband, zeiger-vorschau, text-auftritt, svg-zeichnen, zahl, magnet, neigung, flip-liste, seitenwechsel]
demo: [bild-enthuellung, kartenstapel, laufband, zeiger-vorschau]
stand: 2026-10-02
---

## Wofür

Hochwertige Seiten fallen selten durch viele Effekte auf, sondern durch einen
Effekt an der richtigen Stelle. Dieses Kapitel sammelt die Elemente, die auf
ausgezeichneten Marketingseiten immer wiederkehren, ordnet jedes einem Zweck zu
(Erzählung, Rückmeldung, Marke) und nennt die GSAP-Technik, mit der es gebaut
wird. Es ist eine Auswahlkarte: Ein Projekt wählt daraus höchstens einen
Hauptmoment und zwei leise Begleiter. Gebaut wird selbst, nach Idee, nie nach
fremdem Code, Text oder Bild.

## Die Regel des einen Moments

- **Ein gestalteter Moment je Seite.** Meist der Einstieg oder die eine
  Sektion, die das Angebot erklärt. Dort darf es `DAUER.lg` und `KURVE.stark`
  sein. Alles andere bleibt ruhig: `DAUER.sm` bis `DAUER.md`, `KURVE.raus`.
- **Begleiter sind leise.** Hover an Bedienelementen, ein Zähler, eine Linie.
  Sie geben Rückmeldung oder setzen einen Akzent, erzählen aber nichts.
- **Nie derselbe Auftritt auf jeder Sektion.** Zehn gleiche Einblendungen von
  unten sind kein Stil, sondern Rauschen.
- **App-Flächen sind ausgenommen.** In Software gelten 150 bis 250 ms, keine
  Lade-Choreografie, kein Scroll-Effekt. Aus dieser Liste passen dort nur
  Flip-Übergang, Zähler und gezeichnete Linie als Rückmeldung.
- **Jeder Moment ist in einem Satz begründbar.** „Sah gut aus“ ist keine
  Begründung.

## Elemente

### Zeilen aus der Maske

Eine Überschrift erscheint Zeile für Zeile, jede Zeile steigt aus einer
unsichtbaren Kante hoch. **Passt** für die Hauptüberschrift im Einstieg, einmal
je Seite. **Technik:** `SplitText` mit `type: "lines"` und `mask: "lines"`,
Zeilen von `yPercent: 100` auf 0, `STAFFEL`, `KURVE.stark`. Baustein
`text-auftritt`. **Risiko:** Auf Fließtext oder jeder Zwischenüberschrift wird
es Kitsch; Screenreader brauchen den ungeteilten Text (`aria-label` am Element).

### Bildenthüllung per Ausschnitt

Ein Bild öffnet sich von einem schmalen Streifen oder aus der Mitte zur vollen
Fläche. **Passt** für das eine Schlüsselbild, Referenzen, Produktfotos.
**Technik:** `clip-path: inset()` von `inset(0 0 100% 0)` auf `inset(0)`, dazu
das Bild innen von `scale: 1.15` auf 1. Einmalig per ScrollTrigger oder als
`auftritt`. **Risiko:** gering; nur auf großen Flächen messen, ob es flüssig
bleibt.

### Gepinnte Erzählsektion

Links steht ein Bild oder Schaubild still, rechts laufen drei bis fünf
Textschritte vorbei; das Bild wechselt mit jedem Schritt. **Passt** für „So
arbeiten wir“, Abläufe, Produktfunktionen. **Technik:** `scroll-geschichte`
(sticky statt Pin, kein Ruckeln auf iOS); für Übergänge im Bild ein
ScrollTrigger je Schritt. `pin` mit `scrub` nur, wenn sticky nicht reicht.
**Risiko:** mehr als 5 Schritte ermüden; auf dem Handy untereinander auflösen.

### Kartenstapel

Karten schieben sich beim Scrollen übereinander, die untere wird leicht kleiner
und dunkler. **Passt** für drei bis fünf Leistungen oder Werte. **Technik:**
Karten `position: sticky` mit wachsendem `top`, die verdeckte Karte per
ScrollTrigger mit `scrub` auf `scale: 0.95` und gedämpfte Helligkeit.
**Risiko:** Ab 6 Karten wird der Weg zu lang; der Inhalt verdeckter Karten muss
vorher lesbar gewesen sein.

### Horizontale Galerie

Beim senkrechten Scrollen wandert eine Bildreihe waagerecht. **Passt** für
Portfolios und Referenzreihen mit 4 bis 8 Bildern. **Technik:** Sektion
pinnen, Spur per `x` mit `scrub` verschieben,
``end: () => `+=${distanz}` `` und `invalidateOnRefresh`. Auf Touch-Geräten
stattdessen natives Wischen mit `scroll-snap`, wahlweise `Draggable` mit
`InertiaPlugin`. **Risiko:** Tastatur und Screenreader verlieren die
Orientierung; nie für Inhalte, die gelesen werden müssen.

### Bildvorschau am Zeiger

Über einer Textliste (Projekte, Leistungen) schwebt beim Überfahren ein kleines
Bild, das dem Zeiger weich folgt. **Passt** für Projektlisten im Agentur- oder
Portfolio-Ton. **Technik:** `gsap.quickTo` für `x` und `y` (Dauer 0,4 s,
`KURVE.raus`), Bildwechsel per `opacity`. Nur bei
`(hover: hover) and (pointer: fine)`. **Risiko:** Ohne Maus unsichtbar; jeder
Eintrag braucht ein normales Bild oder einen Link als Ersatz.

### Magnetische Schaltfläche

Der Hauptknopf zieht sich wenige Pixel zum Zeiger, der Text etwas stärker.
**Passt** für den einen Abschluss-Knopf, premium oder verspielt. **Technik:**
Baustein `magnet` (`quickTo`, außerhalb des Render-Zyklus, höchstens 8 bis 12 px
Weg). **Risiko:** Auf jedem Link nervt es; das Klickziel darf nicht wegwandern.

### Zähler und Wortwechsel

Kennzahlen zählen beim Erscheinen hoch, oder ein Wort wechselt durch Zeichen,
bevor es steht. **Passt** für drei bis vier belegte Zahlen, Status, Fachbegriffe.
**Technik:** Baustein `zahl` (`tabular-nums`, feste Breite, einmalig per
ScrollTrigger), Wortwechsel mit `ScrambleTextPlugin` in `DAUER.lg`. **Risiko:**
Zahlen ohne Beleg werden durch Bewegung nicht glaubwürdiger. Der Endwert steht
im HTML.

### Laufband

Ein Schriftband läuft endlos, beim Scrollen kurz schneller und in
Scrollrichtung. **Passt** für Kundenlogos oder ein Markenversprechen,
höchstens einmal je Seite. **Technik:** `horizontalLoop`-Muster aus einer
Timeline, Tempo per ScrollTrigger-`getVelocity()` oder `Observer` auf
`timeScale` und mit `gsap.utils.clamp` begrenzt. **Risiko:** Bewegt sich länger
als 5 s, braucht es eine Pause-Möglichkeit; Inhalte darin sind nie die einzige
Quelle.

### Gezeichnete Linie

Eine Akzentlinie, Unterstreichung oder ein Verbindungspfad zeichnet sich beim
Erreichen. **Passt** für Abläufe, Zeitleisten, das betonte Wort. **Technik:**
Baustein `svg-zeichnen` (`DrawSVGPlugin`, `0%` auf `100%`); läuft ein Punkt die
Linie entlang, `MotionPathPlugin`. **Risiko:** gering; als Dauerschleife wird
es Deko.

### Tiefe durch Parallaxe

Vorder- und Hintergrund bewegen sich beim Scrollen verschieden schnell.
**Passt** für das Einstiegsbild und großformatige Fotos. **Technik:**
ScrollTrigger mit `scrub`, Bild im Rahmen um höchstens 10 bis 15 `yPercent`.
**Risiko:** Mehrere Ebenen in jeder Sektion lösen Schwindel aus und kosten
Leistung; bei reduzierter Bewegung statisch.

### Neigung und Bildreaktion

Eine Karte neigt sich leicht zum Zeiger, oder ein Bild zoomt im Rahmen.
**Passt** für Produktkarten und Referenzkacheln. **Technik:** Baustein
`neigung` (`quickTo` auf `rotationX`/`rotationY`, höchstens 6 Grad); Zoom
`scale: 1.04` in `DAUER.md`. Echte Bildverzerrung braucht WebGL und ein eigenes
Leistungsbudget. **Risiko:** Auf Touch wirkungslos, auf Text unlesbar.

### Raster wird Detail

Ein Vorschaubild wächst an seinen Platz in der Detailansicht, statt dass die
Seite neu lädt. **Passt** für Galerien, Filter, Listen, auch in Apps.
**Technik:** `Flip` innerhalb einer Seite (Baustein `flip-liste`), zwischen
Seiten React `<ViewTransition>` mit gemeinsamem Namen (`seitenwechsel`).
**Risiko:** gering; über `DAUER.md` hinaus wirkt es träge.

### Vorhang beim Seitenwechsel

Eine Farbfläche schiebt sich über die alte Seite und gibt die neue frei.
**Passt** selten: Portfolios mit wenigen, langen Seiten. **Technik:**
`seitenwechsel` mit `<ViewTransition>` und CSS, nicht GSAP. **Risiko:** Jede
Navigation dauert länger; über 400 ms nur auf der Startseite vertretbar.

### Meist schädlich: Ladezähler und Scroll-Übernahme

Ein Vorspann mit Zähler von 0 bis 100 % verzögert jeden Besuch, zeigt selten
echten Fortschritt und verschlechtert den ersten sichtbaren Inhalt. Er wird
nicht gebaut; erlaubt ist höchstens ein Markenauftritt unter 1 s auf der
Startseite, der den Inhalt nicht blockiert. Ebenso schädlich ist
Scroll-Übernahme: Sektionen, die per `Observer` einrasten, oder ein
geglättetes Scrollen, das das Tempo des Systems ersetzt. Beides bricht
Tastatur, Suche im Text, Anker und Bildschirmlupe.

## Worauf es ankommt

- **Inhalt zuerst sichtbar.** Kein `opacity: 0` im CSS als Ausgangszustand;
  GSAP setzt Startwerte erst, wenn es läuft. Ohne JavaScript ist alles lesbar.
- **Nur `transform`, `opacity`, `clip-path`, `mask`.** Nie `top`, `left`,
  `width`, `height`. Ein Effekt, der auf einem Mittelklasse-Handy ruckelt,
  fliegt raus.
- **Bausteine statt Eigenbau.** Jedes Element mit Baustein nutzt ihn; neue
  Muster entstehen als Baustein, nicht als Einzelcode.
- **Handy eigenständig denken.** Zeigerfolger, Magnet und Neigung entfallen,
  Pin wird zu sticky oder zu einer Liste.
- **Aufräumen.** Alles in `useGSAP`; ScrollTrigger werden beim Verlassen der
  Seite entfernt.

## Zugänglichkeit

- Bei „Bewegung reduzieren“ (`gsap.matchMedia()`) entfallen Parallaxe, Pin,
  Laufband, Magnet, Neigung und Scramble; Inhalte stehen sofort am Ziel.
- Auto-Bewegung über 5 s (Laufband) braucht einen Knopf „Anhalten“, mindestens
  44 × 44 px (WCAG 2.2.2).
- Geteilter Text bleibt als Ganzes vorlesbar; Zählerwerte stehen als Endwert im
  DOM, nicht als Zwischenschritte in einer Live-Region.
- Was beim Hover erscheint, erscheint auch bei Tastaturfokus oder ist nicht
  wichtig.
- Seitenwechsel setzen den Fokus auf die neue Hauptüberschrift.

## Typische Fehler

- Drei Hauptmomente auf einer Seite; keiner bleibt hängen.
- Ladezähler vor einer Seite, die in unter 1 s fertig wäre.
- Horizontale Galerie mit Fließtext, den niemand mehr lesen kann.
- Laufband ohne Pause und dazu ein zweites im Fuß.
- Zeigerfolger als einzige Stelle, an der ein Projektbild zu sehen ist.
- Gepinnte Sektion, die auf dem Handy springt, weil sie nie dort geprüft wurde.
- Scroll-Effekte in einer App-Oberfläche.

## Prüfliste

- [ ] Höchstens ein Hauptmoment, in einem Satz begründet
- [ ] Alle anderen Bewegungen ≤ `DAUER.md`, kein Auftritt doppelt
- [ ] Kein Ladezähler, keine Scroll-Übernahme
- [ ] Inhalt ohne JavaScript und bei reduzierter Bewegung vollständig sichtbar
- [ ] Laufband mit Anhalten, höchstens eines je Seite
- [ ] Hover-Elemente nur bei feinem Zeiger, mit Ersatz für Tastatur und Touch
- [ ] Auf 390 px Breite geprüft, Pin und Galerie aufgelöst
- [ ] Vorhandener Baustein genutzt, wo es einen gibt

---
titel: Hero
gruppe: muster
kurz: Der erste Bildschirm einer Website: sagen, was es ist, und den einen nächsten Schritt.
stichworte: [hero, startbild, erster bildschirm, kopfbereich, bühne, header-bild, startseite, headline, aufmacher, video-hintergrund]
bausteine: [text-auftritt, auftritt]
demo: []
stand: 2026-10-02
---

## Wofür

Der Hero beantwortet in drei Sekunden zwei Fragen: **Was ist das hier?** und
**Was mache ich als Nächstes?** Er ist kein Ort für alles, was die Firma kann.
Alles, was nicht zu diesen zwei Fragen gehört, steht in der Sektion darunter.
Der Hero passt vollständig in den ersten Viewport, auf dem Handy wie am Desktop.

## Aufbau

Höchstens vier Textelemente, mehr nicht:

- **Markenleiste oder nichts:** ein Kundenname, ein Ort, ein Produktname. Keine
  Eyebrow-Zeile in Versalien mit weiter Laufweite.
- **Headline:** höchstens 2 Zeilen am Desktop, meist `text-4xl md:text-5xl
  lg:text-6xl`. `text-6xl md:text-7xl` nur bei 3 bis 5 Wörtern.
- **Subtext:** höchstens 20 Wörter, 3 bis 4 Zeilen, Zeilenlänge unter 65ch.
- **Knöpfe:** ein primärer, höchstens ein sekundärer. Der primäre hat höchstens
  3 Wörter und steht einzeilig.

Dazu **ein echtes Visual**: Foto, Produktbild, Video oder ein echter
Screenshot. Oberer Abstand höchstens `pt-24` am Desktop.

**Varianten**

- **Split:** Text links, Visual rechts, asymmetrischer Weißraum. Der Standard
  für Dienstleister und Software. Unter 768 px Text oben, Bild darunter, der
  Knopf bleibt im ersten Viewport.
- **Vollbild-Bild:** Bild über die ganze Breite, Text auf einer Fläche oder
  einem Verlauf, der 4,5:1 Kontrast sichert. Für Orte, Räume, Handwerk.
- **Video-Loop:** stummes Video als Hintergrund oder im Split-Feld. 6 bis 12
  Sekunden, nahtlos, mit Posterbild.
- **Produktbild:** das Produkt freigestellt und groß, Text knapp daneben.
  Für Geräte, Software mit starker Oberfläche, physische Produkte.

Zentrierter Text passt nur für Manifest, Editorial oder eine
Launch-Ankündigung.

## Funktionen

**Grundausstattung**
- Headline, Subtext, ein primärer Knopf
- Ein echtes Visual in einer der vier Varianten
- Handy-Fassung mit eigenem Bildausschnitt (Hochformat statt verkleinertem
  Querformat)

**Ausbau**
- Sekundärer Knopf (zum Beispiel „Arbeiten ansehen“ neben „Anfrage stellen“)
- Markenleiste über der Headline
- Video-Loop mit Posterbild und Pause-Knopf
- Der eine gestaltete Moment (siehe Bewegung)

**Speziell**
- Headline-Varianten je Anzeigenkampagne über einen Parameter in der URL
- Bild, das beim Scrollen leicht zurückbleibt (Parallax, höchstens 10 %)
- Unterschiedliche Visuals für hell und dunkel, wenn das Projekt beide Modi hat

## Worauf es ankommt

- **Ein Knopf gewinnt.** Primär gefüllt im Akzent, sekundär als Kontur oder
  Textlink. Das Label ist auf der ganzen Seite dasselbe: wer oben „Anfrage
  stellen“ schreibt, schreibt unten nicht „Lass uns reden“.
- **Nicht in den Hero:** Logowand, Trust-Streifen, Preis-Teaser,
  Feature-Liste, Avatar-Reihe, Versionslabels, Scroll-Hinweise, Tagline unter
  den Knöpfen. Das gehört in die Sektion darunter oder fliegt raus.
- **Das Visual ist echt.** Text plus Verlaufsfläche ist ein Platzhalter, kein
  Design. Fehlt das Bild, steht ein benannter Platzhalter im Code und eine
  Bitte an den Kunden in der Aufgabenliste.
- **Das LCP-Element ist sofort da.** Das Hero-Bild (oder ohne Bild die
  Headline) lädt mit `next/image priority`, steht nie auf `opacity: 0`, nie
  hinter einem Ausschnitt, nie hinter einem Preloader. Ziel LCP unter 2,5 s.
- **Platz reservieren.** Bild und Video haben feste Seitenverhältnisse, damit
  nichts nachrutscht (CLS unter 0,1).
- **Größe mit dem Bild planen.** Vier Zeilen Headline sind ein Größenfehler:
  Schrift kleiner oder Text kürzen, nie den Hero höher machen.
- **Video ist teuer.** Ziel unter 3 MB, ohne Tonspur, `muted playsinline loop`,
  Poster als erstes Bild. Auf langsamer Verbindung und bei „Daten sparen“ nur
  das Poster.

## Bewegung

Der Hero ist der eine Ort, an dem der gestaltete Moment einer Seite liegen
darf. Er ist einer, nicht drei.

- **Headline:** Zeilen kommen nacheinander aus einer Maske nach oben
  (`text-auftritt`, SplitText nach Zeilen, `DAUER.lg`, `KURVE.stark`,
  `STAFFEL`). Nur wenn die Headline nicht das LCP-Element ist, also ein Bild im
  Hero steht. Ohne Bild bleibt die Headline still.
- **Subtext und Knöpfe:** folgen mit `auftritt` um `VERSATZ` nach oben,
  `DAUER.md`, `KURVE.raus`. Der ganze Auftritt ist nach 1,2 s vorbei.
- **Bild:** sichtbar ab dem ersten Bild, höchstens eine leichte Skalierung von
  1,04 auf 1 über `DAUER.lg`. Kein Ausblenden, kein Vorhang. `bild-enthuellung`
  ist für Bilder weiter unten, nie für das Hero-Bild.
- **Parallax (Speziell):** ScrollTrigger mit `scrub`, nur `transform`, nur im
  Hero.
- **Primärer Knopf:** Hover und `:active` in CSS (`scale-[0.98]`). `magnet`
  nur bei verspielten Marken mit feinem Zeiger.
- **Nicht bewegen:** Navigation, Markenleiste, Hintergrundflächen. Kein
  Preloader, kein Zähler bis 100 %, keine Endlosschleife außer dem Video.
- Bei „Bewegung reduzieren“ steht alles sofort, das Video zeigt nur das Poster
  und startet erst auf Knopfdruck. Steuerung über `gsap.matchMedia()`.

## Zugänglichkeit

- Die Headline ist die einzige `<h1>` der Seite. Die Markenleiste ist keine
  Überschrift.
- Text auf Bild hat mindestens 4,5:1 Kontrast an jeder Stelle des Bildes,
  geprüft an der hellsten Stelle hinter dem Text. Notfalls Fläche oder Verlauf
  hinter den Text.
- Bewegt sich ein Video länger als 5 Sekunden, braucht es einen sichtbaren
  Pause-Knopf mit Namen („Video anhalten“), per Tastatur erreichbar.
- Ein dekoratives Video oder Bild hat `alt=""` bzw. `aria-hidden`. Trägt es
  Inhalt (Produkt, Team), beschreibt der Alt-Text, was zu sehen ist.
- Knöpfe mindestens 44 px hoch, Fokusring sichtbar auf jedem Hintergrund.
- Animierter Text wird vorgelesen wie normaler Text: SplitText mit `aria` auf
  dem Elternelement, nicht Zeile für Zeile.

## Typische Fehler

- Headline über vier Zeilen, Knopf erst nach dem Scrollen sichtbar.
- Logowand, Bewertungssterne und drei Feature-Punkte im Hero.
- Hero-Bild per Vorhang oder Fade eingeblendet: LCP kommt eine Sekunde später.
- Preloader vor dem ersten Bild.
- Text plus Verlaufsblob statt echtem Visual.
- Querformatbild auf dem Handy verkleinert: Das Motiv ist nur noch ein Streifen.
- Video mit 15 MB und Tonspur, ohne Poster und ohne Pause.
- Zwei gleich starke Knöpfe, keiner gewinnt.

## Prüfliste

- [ ] Höchstens vier Textelemente, Headline höchstens 2 Zeilen, Subtext höchstens 20 Wörter
- [ ] Ein primärer Knopf, höchstens 3 Wörter, im ersten Viewport auf Handy und Desktop
- [ ] Echtes Visual, eigener Bildausschnitt unter 768 px
- [ ] LCP-Element sofort sichtbar, `priority`, kein Preloader, LCP unter 2,5 s
- [ ] Höchstens ein gestalteter Moment, nach 1,2 s vorbei, still bei reduzierter Bewegung
- [ ] Text auf Bild 4,5:1, Video mit Poster, Pause-Knopf und unter 3 MB

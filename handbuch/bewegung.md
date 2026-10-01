---
titel: Bewegung
gruppe: grundlagen
kurz: Wann sich etwas bewegt, wie schnell, auf welcher Kurve und mit welchem GSAP-Werkzeug.
stichworte: [bewegung, animation, animieren, gsap, motion, übergang, mikrointeraktion, scroll, timeline, easing, kurve, dauer]
bausteine: [bewegung, auftritt, text-auftritt, zahl, ablauf, scroll-geschichte, svg-zeichnen, flip-liste, aktion-knopf]
demo: [ablauf, svg-zeichnen]
stand: 2026-10-02
---

## Wofür Bewegung da ist

Bewegung hat genau fünf Aufgaben. Kann eine Animation keiner davon zugeordnet
werden, wird sie gestrichen.

1. **Rückmeldung:** „Angekommen.“ Der Knopf gibt beim Drücken nach, der Haken
   zeichnet sich nach dem Speichern.
2. **Zustandswechsel:** „Jetzt ist es anders.“ Ein Bereich klappt auf, ein Reiter
   wechselt, ein Ladeplatzhalter wird zum Inhalt.
3. **Kontinuität:** „Das ist dasselbe Ding, nur woanders.“ Die Auswahl im Kalender
   gleitet zur neuen Zelle, Filterergebnisse rücken an ihren Platz, eine Karte
   wird zur Detailseite.
4. **Aufmerksamkeit:** „Hier schauen.“ Eine neue Meldung kommt von unten, eine
   Kennzahl zählt einmal hoch.
5. **Erzählung:** „Erst das, dann das.“ Ein Ablauf baut sich beim Scrollen auf,
   eine Grafik zeichnet den Weg der Daten.

## Wie viel, je nach Fläche

| Fläche | Bewegung | Tempo |
| --- | --- | --- |
| Website (überzeugen) | ein gestalteter Moment je Seite, dazu ruhige Auftritte und Rückmeldung an Bedienelementen | Auftritte 450–800 ms |
| App (bedienen) | nur Rückmeldung, Zustandswechsel und Kontinuität, keine Lade-Choreografie | 150–250 ms |
| Hilfe, Doku (lesen) | fast keine, Seitenwechsel und Aufklappen | 150–250 ms |
| Portfolio, Kampagne (erleben) | mehrere Momente erlaubt, Erzählung über Scroll | bis 1,2 s |

Der **gestaltete Moment** ist die eine Stelle, an der sich eine Seite etwas
traut: der Ablauf, der sich zeichnet, das Bild, das sich öffnet, die Überschrift,
die aus der Maske steigt. Liegt er überall, ist er nirgends.

## Zeit und Kurven

Alle Werte kommen aus `lib/motion/tokens.ts`, nie aus dem Kopf.

| Token | Wert | wofür |
| --- | --- | --- |
| `DAUER.xs` | 150 ms | Hover, Abgang kleiner Elemente, Ziffernwechsel |
| `DAUER.sm` | 250 ms | Rückmeldung, Schließen, Reiter, App-Zustände |
| `DAUER.md` | 450 ms | Auftritt, Öffnen, Schrittwechsel, Flip |
| `DAUER.lg` | 800 ms | der eine Moment, Text aus der Maske, Linien zeichnen |

| Kurve | GSAP | Bedeutung |
| --- | --- | --- |
| `KURVE.raus` | `power3.out` | etwas kommt an (Standard) |
| `KURVE.rein` | `power2.in` | etwas geht weg |
| `KURVE.wechsel` | `power2.inOut` | etwas wechselt den Platz |
| `KURVE.stark` | `expo.out` | der gestaltete Moment |

Drei Faustregeln: **Abgang dauert rund 70 % des Auftritts** (wer geht, soll nicht
aufhalten). **Weiter Weg, mehr Zeit**, aber nie über `DAUER.lg` für Bedienelemente.
**Linear nur, wenn die Bewegung am Scrollen hängt** (`scrub`), sonst wirkt sie
mechanisch. Federnde oder hüpfende Kurven (`elastic`, `bounce`) passen nicht zu
B2B; die einzige Ausnahme ist ein kleines Aufploppen (`back.out(2)`) bei
Punkten, die eine Linie erreicht.

## Choreografie

- **Staffeln, aber begrenzt.** Höchstens 6 bis 8 Elemente gestaffelt, Abstand
  `STAFFEL` (60 ms). Bei langen Listen die Gesamtzeit deckeln:
  `stagger: { each: 0.06, amount: 0.4 }`. Lange Tabellen werden nie gestaffelt.
- **Überlappen statt anstellen.** In einer Timeline beginnt das Nächste, bevor das
  Vorige fertig ist: Positionsparameter `'<0.1'` oder `'-=0.2'`. Eine Kette aus
  vollständig nacheinander laufenden Schritten fühlt sich langsam an.
- **Wichtiges zuerst.** Überschrift vor Text vor Knopf. Bild und Text nie
  gleichzeitig aus derselben Richtung.
- **Eine Richtung je Szene.** Kommt der Inhalt von unten, kommt alles von unten.
  Seitliche Bewegung ist für Richtung reserviert (vor, zurück, blättern).
- **Kurze Wege.** Auftritte bewegen 8 bis 16 px (`VERSATZ` 14 px), keine halben
  Bildschirme.

## Werkzeuge: welche Aufgabe, welches Werkzeug

| Aufgabe | GSAP-Werkzeug | Baustein |
| --- | --- | --- |
| Element einblenden, einmal | `gsap.to` + `ScrollTrigger` mit `once: true` | `auftritt` |
| Überschrift aus der Maske | `SplitText` mit `mask: 'lines'`, `autoSplit` | `text-auftritt` |
| Mehrere Schritte als Drehbuch | `gsap.timeline` mit Labels und Positionsparametern | `ablauf`, `svg-zeichnen` |
| Bewegung hängt am Scrollen | `ScrollTrigger` mit `scrub: 0.5–1` | `ablauf`, `kartenstapel` |
| Abschnitt bleibt stehen | erst `position: sticky`, nur im Ausnahmefall `pin` | `scroll-geschichte` |
| Umordnen, Layoutwechsel | `Flip.getState` vorher, `Flip.from` nachher | `flip-liste`, `monatsraster` |
| Folgt der Maus | `gsap.quickTo` (ein Tween, nur neue Ziele) | `magnet`, `neigung`, `zeiger-vorschau` |
| Linie zeichnet sich | `DrawSVGPlugin` | `svg-zeichnen`, `aktion-knopf` |
| Punkt läuft auf einem Pfad | `MotionPathPlugin` | `svg-zeichnen` |
| Zahl zählt | Tween auf ein Objekt, Text am Knoten setzen | `zahl` |
| Bild öffnet sich | `clip-path` + `scale` | `bild-enthuellung` |
| Endlos laufen | Tween mit `repeat: -1`, `timeScale` bei Scroll | `laufband` |
| Bildschirmgrößen, reduzierte Bewegung | `gsap.matchMedia()` | alle |

Seitenwechsel laufen **nicht** über GSAP, sondern über Reacts
`<ViewTransition>` (Baustein `seitenwechsel`). Einfache Zustände wie Hover, Fokus
oder das Öffnen eines Popovers bleiben CSS.

## Scrollen

- **Startpunkte einheitlich:** Auftritte bei `'top 80%'` bis `'top 88%'`, Erzählung
  von `'top 75%'` bis `'bottom 40–60%'`.
- **Einmal heißt einmal:** Auftritte mit `once: true`. Was beim Zurückscrollen
  wieder verschwindet und neu kommt, ermüdet.
- **Scrub nur für Erzählung**, mit Glättung `scrub: 0.6`, nie `true` (ruckelt bei
  Mausrädern).
- **Nie das Scrollen übernehmen.** Keine Seiten, die beim Scrollen festhängen, bis
  eine Animation durch ist, kein Umlenken der Scrollrichtung, kein künstlich
  verlangsamtes Scrollen. Ein Pin höchstens einmal je Seite und nie auf dem Handy.
- **Nach Schriften neu messen:** `ScrollTrigger.refresh()` nach `document.fonts.ready`
  (macht der Kern `bewegung` schon). Bilder brauchen feste Maße.

## Rückmeldung im Kleinen

- Drücken: `scale(0.98)` per CSS `:active`, sofort.
- Arbeiten: Ladekreis **im** Knopf, Breite bleibt, Knopf gesperrt (`aktion-knopf`).
- Erfolg: Haken zeichnet sich (`DAUER.md`), Text wechselt, nach 2,4 s zurück.
- Fehler: einmal schütteln (`x: [-6, 6, -4, 4, 0]`), Meldung am Feld.
- Vorübergehendes: Meldung von unten (`meldung`), höchstens drei.

## Code-Regeln in React

```tsx
import { BEWEGUNG, DAUER, KURVE, gsap, useGSAP } from '@/lib/motion/gsap'

useGSAP(() => {
  const mm = gsap.matchMedia()
  mm.add(BEWEGUNG, () => {
    gsap.from('.karte', { y: 14, opacity: 0, duration: DAUER.md, ease: KURVE.raus })
  })
  return () => mm.revert()
}, { scope: ref })
```

1. Nur aus `@/lib/motion/gsap` importieren; Plugins registriert der Baustein mit
   `registriere()`.
2. Nur `useGSAP` mit `scope`, nie `useEffect`. Es räumt beim Verlassen der Seite und
   im Strict Mode selbst auf.
3. Alles unter `gsap.matchMedia()` mit `BEWEGUNG`: Ohne Bewegungswunsch ist der
   Inhalt sofort im Endzustand.
4. Was nach dem Laden passiert (Klick, Hover), läuft über `contextSafe`, das erst im
   Handler aufgerufen wird.
5. Startzustand per CSS setzen, nicht erst per JavaScript, sonst blitzt der Inhalt
   kurz auf. Das größte Element der Seite (Hero-Headline, Hero-Bild) wird nie
   ausgeblendet.
6. Nur `transform`, `opacity`, `clip-path`, gemessen auch `filter`. Nie `width`,
   `height`, `top`, `left`.
7. Dauer und Kurve nur aus den Tokens. Zahlen im Code sind ein Fehler.

## Leistung

- Kern (`gsap` + `ScrollTrigger`) rund 46 KB gepackt; Plugins wie `MorphSVG` oder
  `SplitText` nur dort laden, wo sie gebraucht werden.
- `will-change` nur an Elementen, die dauernd laufen (Laufband, Kartenstapel).
- Effekte unterhalb des sichtbaren Bereichs starten erst, wenn sie ins Bild kommen.
- Ein Zähler setzt Text direkt am Knoten, nicht über React-State pro Bild.
- Auf einem Mittelklasse-Handy messen, nicht nur auf dem Entwicklerrechner.

## Zugänglichkeit

- **„Bewegung reduzieren“** im Betriebssystem schaltet alle Bewegung aus, Inhalte
  stehen sofort da. Das ist in jedem Baustein eingebaut und wird bei jedem neuen
  Effekt mit geprüft.
- **Anhalten können:** Was sich länger als 5 Sekunden von selbst bewegt (Laufband,
  Endlosschleife), hat einen sichtbaren Knopf zum Anhalten (WCAG 2.2.2).
- **Keine großen Bewegungen im Sichtfeld:** starke Parallaxe, Zoom über den ganzen
  Bildschirm und Drehungen lösen bei manchen Menschen Schwindel aus.
- **Inhalt ohne JavaScript sichtbar.** Fällt das Skript aus, ist die Seite
  vollständig, nur ohne Bewegung.
- **Fokus folgt der Bewegung:** Nach einem Schrittwechsel oder Seitenwechsel steht
  der Fokus auf der neuen Überschrift.

## Worauf es ankommt

- Jede Bewegung hat eine der fünf Aufgaben. Ein Satz reicht als Begründung.
- Ein gestalteter Moment je Seite, alles andere schnell und still.
- Apps sind schnell (150–250 ms), Websites dürfen sich einen Auftritt nehmen.
- Werte nur aus den Tokens, Werkzeuge aus der Tabelle, Bausteine statt Eigenbau.

## Typische Fehler

- Dieselbe Einblendung auf jeder Sektion.
- Ladebildschirm mit Zähler vor der Website: kostet Sekunden, bringt nichts.
- Animationen in `useEffect` ohne Aufräumen: Sie laufen nach dem Seitenwechsel weiter.
- `width` oder `height` animiert: ruckelt und verschiebt das Layout.
- Scrollen übernommen oder verlangsamt.
- Bewegung, die bei „Bewegung reduzieren“ trotzdem läuft.
- Ein zweites Animations-Paket (framer-motion) neben GSAP.

## Prüfliste

- [ ] Jede Animation einer der fünf Aufgaben zugeordnet
- [ ] Höchstens ein gestalteter Moment je Seite
- [ ] Dauer und Kurve aus `DAUER` und `KURVE`, Abgang kürzer als Auftritt
- [ ] Nur `useGSAP` mit `scope`, alles unter `gsap.matchMedia()` mit `BEWEGUNG`
- [ ] Nur `transform`, `opacity`, `clip-path`; Startzustand per CSS; Hero nie ausgeblendet
- [ ] Kein Scroll-Übernehmen, Pin höchstens einmal und nicht auf dem Handy
- [ ] Endlose Bewegung mit sichtbarem Anhalten-Knopf
- [ ] Mit „Bewegung reduzieren“ und auf einem Handy angesehen

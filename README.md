# growcore-ui

Motion-Bausteine von GrowCore für Next.js (App Router, React 19.2+) und Tailwind 4. Eine
shadcn-Registry direkt aus diesem öffentlichen Repo: Der Code landet editierbar im Projekt, die
Quelle bleibt hier.

```bash
npx shadcn@latest add jjokkln/growcore-ui/auftritt
```

Der Kern `bewegung` kommt bei jedem Baustein automatisch mit (`src/lib/motion/gsap.ts`,
`tokens.ts`, CSS-Variablen `--dauer-*` und `--kurve-*` in `globals.css`). Voraussetzung im
Zielprojekt: `components.json` (`npx shadcn@latest init`) mit Alias `@/`.

## Bausteine

| Name | Was |
| --- | --- |
| `bewegung` | Kern: GSAP einmal registriert, Tokens `DAUER`/`KURVE`, Bedingung `BEWEGUNG` für reduced motion |
| `auftritt` | gestaffeltes Einblenden (`data-auftritt`) und wachsende Balken (`data-balken`), beim Laden oder Scrollen |
| `text-auftritt` | Zeilen/Wörter steigen aus einer Maske auf (SplitText) |
| `zahl` | Kennzahl zählt hoch, ohne Springen; vorgelesen wird der Endwert |
| `aufklappen` | `height: auto` auf und zu, geschlossen `inert` |
| `schublade` | seitliches Menü auf nativem `<dialog>` |
| `scroll-geschichte` | Erklärseite: Bild steht, Schritte scrollen vorbei |
| `ablauf` | Schritte, die eine Linie beim Scrollen verbindet |
| `svg-zeichnen` | Erklärgrafik aus eigenem SVG: zeichnen, erscheinen, Pfaden folgen |
| `flip-liste` | Einträge gleiten nach Filtern an ihren Platz |
| `magnet`, `neigung` | Zeiger-Effekte, nur mit echter Maus |
| `feiern` | Konfetti für einen echten Erfolg |
| `seitenwechsel` | View Transitions zwischen Seiten, ohne GSAP |
| `platzhalter` | Ladeplatzhalter in Endform, reines CSS |

## Regeln, die jeder Baustein einhält

- „Bewegung reduzieren“ über `gsap.matchMedia()`: Ohne Bewegungswunsch steht der Inhalt sofort da.
- Nur `transform` und `opacity`. Das größte Element der Seite (Hero-Headline) wird nie ausgeblendet.
- Kein Aufblitzen: Den Startzustand setzt CSS, bevor JavaScript läuft.
- Dauer und Kurve nur aus den Tokens.
- Nur `useGSAP` (räumt bei Unmount und im Strict Mode auf), Selektoren mit `scope`.

## Demo

```bash
npm install && npm run dev
```

Alle Bausteine live auf `/`, die Tokens mit Kurvenvergleich auf `/tokens`.

## Neuen Baustein aufnehmen

1. Datei unter `src/components/motion/`, `src/hooks/` oder `src/lib/motion/` anlegen, nur aus `@/lib/motion/gsap` importieren.
2. Eintrag in `registry.json` (mit `registryDependencies: ["jjokkln/growcore-ui/bewegung"]`, falls GSAP gebraucht wird).
3. Abschnitt auf der Demo-Seite, dann `npx shadcn@latest registry validate ./registry.json`, `npm run lint`, `npm run build`.

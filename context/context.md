# growcore-ui — Code-Kontext

> Wegweiser für Agenten: wie der Code gebaut ist und wo man was anfasst.
> Stand, offene Aufgaben und Funktionen stehen im AI-OS
> (`10_Projects/growcore-ui/`, lädt als Steckbrief beim Start). Höchstens 15 KB.

## Was das ist

shadcn-Registry mit GrowCores Motion-Bausteinen (GSAP 3.15, React `<ViewTransition>`, CSS)
plus Demo-App und Handbuch. Installiert wird über die GitHub-Adresse
`jjokkln/growcore-ui/<name>`; die CLI liest `registry.json` direkt aus dem Repo, es gibt
keinen Build und kein Hosting. Nutzer: Lenny und die Agenten in den Kundenprojekten.
Das Repo ist **öffentlich** (keine Kundennamen, keine Zugangsdaten, siehe `CLAUDE.md`).

## Ich will … → Datei

| Ich will … | Schau in |
| --- | --- |
| einen Baustein ändern | `src/components/motion/<name>.tsx` (Hooks: `src/hooks/`, Hilfen: `src/lib/motion/`) |
| einen neuen Baustein anlegen | Datei in `src/components/motion/` + Eintrag in `registry.json` |
| ein Startpaket (Pflichtbaustein für Kundenprojekte) ändern | `src/registry/start/<baustein>/` + dessen Eintrag in `registry.json` |
| GSAP registrieren, Bewegung an/aus (Panel-Schalter, reduce) | `src/lib/motion/gsap.ts` (`bewegungErlaubt()`, `registriere()`) |
| Dauer, Kurve, Staffel, Versatz ändern | `src/lib/motion/tokens.ts` **und** `registry.json` (Feld `css`) **und** `src/app/globals.css` |
| den Seitenwechsel ändern | `src/app/template.tsx` · `src/components/motion/seitenwechsel.tsx` |
| ein Handbuch-Kapitel schreiben oder ändern | `handbuch/<slug>.md` · Darstellung `src/app/handbuch/` (`_daten.ts`, `[slug]/page.tsx`) |
| ein Live-Beispiel im Handbuch/der Demo ändern | `src/app/_demo/` · `src/app/bausteine/page.tsx` |
| eine Prüfregel ergänzen (gilt für alle Projekte) | `pruefung/pruefe.mjs`, Liste `PRUEFUNGEN` · `.github/workflows/pruefung.yml` |
| Kurven vergleichen | `src/app/tokens/` |
| eine echte Kundenseite als Referenz zeigen (nur lokal) | `lokal/referenzen.json` · `src/app/referenzen/` |
| Testdaten für den Schlimmstfall | `src/lib/testdaten/schlimmstfall.ts` |

## Aufbau auf einer Seite

- **Stack:** Next.js 16 (App Router, React 19), Tailwind 4, GSAP 3.15 mit `@gsap/react`,
  `marked` für das Handbuch. Kein Test-Skript in `package.json`.
- **Einstiege (gezählt):** `registry.json` mit 45 Einträgen (23 Komponenten, 11 Libs,
  3 Hooks, 2 Seiten, 2 Dateien, 2 Blöcke, 2 vom Typ `registry:item`) · 25 Handbuch-Kapitel in
  `handbuch/` · Seiten `/`, `/handbuch/<slug>`, `/bausteine`, `/tokens`, `/referenzen`
  (`noindex`, nicht öffentlich betrieben, Impressum fehlt) · 17 Startpaket-Ordner unter
  `src/registry/start/`. Keine API-Routen, kein Cron, keine Datenbank im Repo.
- **Registry:** `registry.json` listet die Bausteine; die Pfade zeigen auf die echten Dateien
  der Demo-App, es gibt keine zweite Kopie.
- **Handbuch:** `handbuch/*.md` ist die Quelle für UI-Muster und Grundlagen, gerendert
  beim Build, von Agenten per grep gelesen. Der Katalog-Hook im AI-OS legt passende Kapitel
  bei Bau-Wünschen vor.
- **GSAP an einer Stelle:** Nur `src/lib/motion/gsap.ts` registriert GSAP (Kern-Baustein
  `bewegung`). Plugins, die nur ein Baustein braucht, registriert dieser selbst mit
  `registriere()`.
- **CSS reist mit der Komponente:** als `<style href precedence>`; React 19 hängt es einmal
  in den `<head>` und entdoppelt es.
- **Startpakete** sind in `tsconfig` ausgeschlossen, weil ihre Importe auf Pfade des
  Zielprojekts zeigen. Testen nur im frischen Projekt (siehe Befehle).
- **Prüfung:** `pruefung/pruefe.mjs` (Regeln als Code, ohne Abhängigkeiten) und der
  wiederverwendbare Workflow `.github/workflows/pruefung.yml`. Projekte rufen ihn über den
  Baustein `pruefung` auf (`.github/workflows/growcore.yml` im Projekt, `uses:
  jjokkln/growcore-ui/.github/workflows/pruefung.yml@main`), kopieren ihn also nicht.

## Regeln, die nie gebrochen werden

1. **Jeder Push hier ändert die Prüfung aller Projekte.** Neue Regel: Eintrag in `PRUEFUNGEN`,
   dann gegen alle Projekte laufen lassen, bevor gepusht wird.
2. **Bewegung respektiert den Panel-Schalter.** `bewegungErlaubt()` beachtet auch
   `data-a11y-stop-animations` (@growcore/a11y); ein MutationObserver hält beim Umschalten
   alles an (Trigger lösen, `scrub`-Animationen per `revert()` in den Ruhezustand, sonst die
   **oberste Ebene** der globalen Timeline per `totalProgress(1)` ans Ende; Angehaltenes und
   Aufrufe ohne Dauer ausgenommen). **Nie einzelne Tweens in einer Timeline vorspulen**, die
   Timeline setzt sie im nächsten Tick zurück.
3. **Jeder Baustein prüft `bewegungErlaubt()` zusätzlich** in seinem `mm.add(BEWEGUNG, …)` und
   in jedem Rückruf, der später eine Bewegung startet, sonst tritt nach einem Seitenwechsel die
   neue Seite trotz Schalter auf.
4. **Zwei Dateien eines Registry-Eintrags nie gleich benennen** (shadcn biegt Importe sonst
   falsch um); Migrationszeitstempel eindeutig halten.
5. **Tokens an drei Stellen** (`tokens.ts`, `registry.json` Feld `css`, `globals.css`):
   bei Änderung alle nachziehen.
6. **Referenzen mit echten Kundenseiten nur lokal** (`/lokal`, `/public/lokal` sind
   gitignoriert, das Repo ist öffentlich). Ohne `lokal/referenzen.json` gibt es keinen
   Nav-Link.
7. Weiteres: `CLAUDE.md` und `AGENTS.md`.

**Fallen**
- `contextSafe(fn)` direkt im Render meldet die React-Compiler-Regel `react-hooks/refs`.
  Lösung: `contextSafe` erst im Handler aufrufen (`src/app/tokens/kurven.tsx`).
- `gsap.matchMedia().add({…}, fn)` ruft `fn` nur auf, wenn mindestens eine Bedingung zutrifft.
  Wer auch bei reduce laufen muss, nimmt `immer: 'all'` dazu (`scroll-geschichte.tsx`).
- `ScrollTrigger#getTween()` liefert ohne Nachlauf `0`, nicht `undefined`: `getTween()?.kill()`
  wirft.
- Mit `autoAlpha` ausgeblendete Elemente sind nicht fokussierbar. Scroll-Reveals nutzen
  deshalb nur `opacity`.

## Befehle

```bash
npm run dev
npm run lint && npm run build
npx shadcn@latest registry validate ./registry.json
# Startpaket testen, nur in einem frischen Projekt:
#   create-next-app, shadcn init -d -y, shadcn add jjokkln/growcore-ui/website-start -y,
#   Layout verdrahten, npm run lint && npm test && npm run build
# Neue Referenzbilder (nur lokal):
node ~/.claude/tools/ui-verify/referenzen-bilder.mjs <id>
# Panel-Schalter je Scroll-Baustein, gegen `next start -p 3127`:
node ~/.claude/tools/ui-verify/probe-growcore-ui-stopp.mjs
```

Unklar: Die früher genannten Skripte `probe-growcore-ui.mjs` (Laufprobe gegen
`next start -p 3123`) und `probe-growcore-handbuch.mjs` liegen nicht mehr in
`~/.claude/tools/ui-verify/`.

## Themen-Dateien

Keine. Alles Verhalten steht hier; Herleitungen im AI-OS (`AI-OS/30_Knowledge/Referenzen/gsap.md`),
Verlauf in `docs/context-verlauf.md`.

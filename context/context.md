# growcore-ui — Kontext

**Was:** shadcn-Registry mit GrowCores Motion-Bausteinen (GSAP 3.15, React `<ViewTransition>`, CSS)
plus Demo-Seite. Installiert wird über die GitHub-Adresse `jjokkln/growcore-ui/<name>`; die CLI liest
`registry.json` direkt aus dem Repo, es gibt keinen Build und kein Hosting.

**Handbuch:** `handbuch/*.md` ist die Quelle für UI-Muster (Kalender, Formular, Wizard …) und
Grundlagen (Bewegung, Typografie …). Gerendert von `src/app/handbuch/` (marked, beim Build), gelesen
von Agenten per grep. Der Katalog-Hook im AI-OS legt passende Kapitel bei Bau-Wünschen vor.

**Startpakete:** `src/registry/start/<baustein>/` (14 Pflichtbausteine, in tsconfig ausgeschlossen,
weil ihre Importe auf Pfade des Zielprojekts zeigen). Testen nur im frischen Projekt:
create-next-app, `shadcn init -d -y`, `shadcn add jjokkln/growcore-ui/website-start -y`, Layout verdrahten,
`npm run lint && npm test && npm run build`. Zwei Dateien eines Eintrags nie gleich benennen (shadcn biegt
Importe sonst falsch um), Migrationszeitstempel eindeutig halten.

**Aufbau**
- `registry.json`: die Liste der Bausteine. Pfade zeigen auf die echten Dateien der Demo-App,
  daher gibt es keine zweite Kopie.
- `src/lib/motion/gsap.ts`: einzige Registrierungsstelle für GSAP (Kern-Baustein `bewegung`).
  Plugins, die nur ein Baustein braucht, registriert dieser selbst mit `registriere()`.
- `src/lib/motion/tokens.ts`: `DAUER`, `KURVE`, `STAFFEL`, `VERSATZ`. Die CSS-Fassung steht in
  `registry.json` (Feld `css`) und in `src/app/globals.css`. Bei Änderung beide nachziehen.
- CSS, das ein Baustein braucht, liegt in der Komponente als `<style href precedence>`. React 19
  hängt es einmal in den `<head>` und entdoppelt es. So reist es mit der Datei.
- `src/app/`: `/` Handbuch, `/handbuch/<slug>` Kapitel mit Live-Beispiel, `/bausteine` alle Bausteine,
  `/tokens` Kurvenvergleich. `noindex`, noch nicht öffentlich betrieben (Impressum fehlt).
- `/referenzen`: echte Kundenseiten nach Branche, **nur lokal**. Liste `lokal/referenzen.json`,
  Bilder `public/lokal/referenzen/<id>.jpg`, beide gitignoriert (öffentliches Repo). Ohne die Datei
  kein Nav-Link. Neue Seite: Eintrag in die JSON, dann
  `node ~/.claude/tools/ui-verify/referenzen-bilder.mjs <id>`.

**Prüfen**
- `npm run lint && npm run build`
- Handbuch: `node ~/.claude/tools/ui-verify/probe-growcore-handbuch.mjs` (alle Kapitel 1280/390, eine h1,
  kein Überlauf, kein Geviertstrich; Abläufe Terminbuchung, Wizard, Anmeldung, Kalender)
- `npx shadcn@latest registry validate ./registry.json`
- Laufprobe: `node ~/.claude/tools/ui-verify/probe-growcore-ui.mjs` gegen `next start -p 3123`.
  Prüft Desktop 1280 und Handy 390, ob nach dem Durchscrollen alles sichtbar ist, ob bei reduce sofort
  alles steht, Schublade, Filter, Fokus nach Seitenwechsel und Konsolenfehler.

**Fallen**
- `contextSafe(fn)` direkt im Render meldet die React-Compiler-Regel `react-hooks/refs`. Lösung:
  `contextSafe` erst im Handler aufrufen (`src/app/tokens/kurven.tsx`).
- `gsap.matchMedia().add({…}, fn)` ruft `fn` nur auf, wenn mindestens eine Bedingung zutrifft. Wer
  auch bei reduce laufen muss, nimmt `immer: 'all'` dazu (`scroll-geschichte.tsx`).
- Mit `autoAlpha` ausgeblendete Elemente sind nicht fokussierbar. Scroll-Reveals nutzen deshalb nur
  `opacity`.

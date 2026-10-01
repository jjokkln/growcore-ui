---
titel: Seitenwechsel
gruppe: muster
kurz: Der Übergang von einer Seite zur nächsten, mit Richtung, festem Kopf und Fokus.
stichworte: [seitenwechsel, übergang, page transition, view transition, navigation animieren, ladezustand, skelett, zurück, weiter]
bausteine: [seitenwechsel, platzhalter]
demo: [seitenwechsel]
stand: 2026-10-02
---

## Wofür

Ein Seitenwechsel zeigt, **dass** sich die Seite geändert hat und **in welche
Richtung** man gegangen ist: tiefer hinein (Liste zu Eintrag) oder wieder
heraus. Er ist kein Schmuck. Ohne Übergang springt die neue Seite einfach
herein, und das ist besser als ein Übergang ohne Grund. Gebaut wird er mit
React `<ViewTransition>`, nicht mit GSAP: Der Browser animiert selbst, und wo er
es nicht kann, wechselt die Seite ohne Animation.

## Aufbau

- **Ort:** Der Baustein liegt um den Inhaltsbereich, nie um Kopf und
  Navigation: `<main id="hauptbereich"><Seitenwechsel>{children}</Seitenwechsel></main>`.
- **Fester Kopf:** Der Kopf bekommt `style={{ viewTransitionName: 'kopf' }}`.
  Sonst wird er als Teil der Seite mit ausgeblendet oder der Inhalt gleitet
  über ihn.
- **Richtung:** über Next-Links, `transitionTypes={['vor']}` oder
  `transitionTypes={['zurueck']}`. Wechsel ohne Typ bekommen das neutrale
  Überblenden.
- **Was als Wechsel zählt:** nur ein neuer Pfad. Speichern, Neuladen der Daten
  und Änderungen der Abfrage (`?q=`, `?tab=`) animieren nicht.
- **Laden:** `loading.tsx` zeigt einen Platzhalter in der Form der Zielseite
  (Baustein `platzhalter`). Er erscheint erst nach 180 ms, schnelle Seiten
  blitzen nicht grau auf.
- **Fokus:** Nach dem Wechsel steht der Fokus auf der `<h1>` der neuen Seite.

## Funktionen

**Grundausstattung**
- Neutrales Überblenden: alte Seite geht, neue steigt leicht auf
- Fester Kopf und feste Navigation
- Fokus auf der neuen Überschrift
- Sofortiger Wechsel bei „Bewegung reduzieren“ und ohne Browserunterstützung

**Ausbau**
- Richtung vor und zurück (Liste zu Eintrag, Brotkrumen zurück)
- Platzhalter in Endform während des Ladens
- Weicher Übergang vom Platzhalter zum Inhalt (Suspense)

**Speziell**
- Geteiltes Element: Das Bild einer Karte wächst zum Kopfbild der Detailseite
  (gleicher `name` an beiden `<ViewTransition>`)
- Schrittfolgen mit Richtung (Schritt 2 zu 3 vor, 3 zu 2 zurück)
- Zwei Fassungen in einem Projekt: Website mit Auftritt, Kundenbereich nur
  mit Überblenden

## Worauf es ankommt

- **Kurz.** Die alte Seite geht in 150–220 ms, die neue ist nach höchstens
  440 ms vollständig da. Wer navigiert, will lesen, nicht zusehen.
- **Richtung heißt Hierarchie.** „Vor“ geht eine Ebene tiefer, „zurück“ eine
  Ebene höher. Punkte derselben Ebene (Hauptnavigation) wechseln neutral. Eine
  Richtung, die nichts bedeutet, verwirrt mehr als keine.
- **Kopf und Navigation bewegen sich nie.** Sie sind der feste Rahmen, an dem
  das Auge den Wechsel abliest.
- **Keine Lade-Choreografie in Apps.** Nach dem Wechsel steht der Inhalt. Keine
  gestaffelten Karten, keine hochzählenden Kennzahlen bei jedem Besuch. In Apps
  reicht ein Überblenden in `DAUER.sm`; die 380 ms Auftritt des Bausteins
  passen zu Websites.
- **Nicht doppelt bewegen.** Elemente, die der Übergang schon bewegt, bekommen
  keinen zusätzlichen `auftritt` oder `text-auftritt` beim Laden.
- **Platzhalter in Endform.** Gleiche Höhen, gleiche Raster wie die fertige
  Seite. Der Wechsel vom Platzhalter zum Inhalt darf nichts verschieben.
- **Ein Seitenwechsel je Fläche.** Alle Seiten einer Website oder einer App
  nutzen denselben Baustein mit denselben Werten.

## Bewegung

- **Neutral:** Die alte Seite blendet in `DAUER.xs` (150 ms) mit `KURVE.rein`
  aus und schrumpft auf 99 %. Die neue steigt 14 px (`VERSATZ`) auf und blendet
  ein, 380 ms mit `KURVE.stark`, 60 ms versetzt. Grund: Zustandswechsel.
- **Vor:** Alt gleitet 32 px nach links und blendet aus (220 ms, `KURVE.rein`),
  neu kommt 40 px von rechts (380 ms, `KURVE.stark`, 40 ms versetzt).
- **Zurück:** spiegelbildlich, alt nach rechts, neu von links.
- **Platzhalter zu Inhalt:** Eine `<ViewTransition>` um die Suspense-Grenze
  blendet Platzhalter und Inhalt ineinander, `DAUER.sm`. Kein Aufsteigen, weil
  der Inhalt genau dort erscheint, wo der Platzhalter stand.
- **Platzhalter selbst:** leiser Schimmer, nur solange geladen wird, entfällt
  bei reduzierter Bewegung.
- **Nicht bewegen:** Kopf, Navigation, Seitenleiste, Fuß. Kein seitliches
  Gleiten über mehr als 40 px, kein Zoom, keine Wischblende über die ganze
  Seite.
- Bei „Bewegung reduzieren“ werden alle `::view-transition-*`-Animationen
  abgeschaltet, die Seite wechselt sofort.

## Zugänglichkeit

- **Fokus auf `<h1>`:** Nach dem Wechsel setzt der Baustein den Fokus auf die
  Überschrift der neuen Seite (`tabindex="-1"`, ohne Scrollen). Nicht beim
  ersten Laden und nicht, wenn die neue Seite den Fokus selbst gesetzt hat
  (etwa `autoFocus` in einem Formular). So beginnen Tastatur und Screenreader
  beim Inhalt, nicht wieder im Menü.
- **Seitentitel:** Jede Seite hat einen eigenen `<title>`. Next.js sagt beim
  Wechsel den neuen Titel an, ein doppelter Titel wird doppelt angesagt.
- **Eine `<h1>` je Seite**, sonst landet der Fokus auf der falschen.
- **Platzhalter:** Der Bereich hat `role="status"` und den Namen „Wird
  geladen“, die einzelnen Flächen sind `aria-hidden`.
- **Reduzierte Bewegung** wird immer beachtet, ohne Ausnahme für den einen
  schönen Übergang.
- **Zurück-Taste:** Der Browser-Zurück muss funktionieren wie ohne Übergang,
  Scrollposition und Fokus inklusive.

## Typische Fehler

- Übergang um das ganze Layout gelegt: Kopf und Navigation blenden bei jedem
  Klick mit aus.
- Kopf ohne `viewTransitionName`: Der Inhalt gleitet über ihn hinweg.
- Richtung nach Gefühl: Hauptnavigation gleitet mal links, mal rechts.
- Reiter- oder Filterwechsel animiert wie ein Seitenwechsel.
- Dashboard mit gestaffelten Karten und hochzählenden Zahlen bei jedem Besuch.
- Spinner in der Seitenmitte statt Platzhalter in Endform.
- Fokus bleibt nach dem Wechsel auf dem geklickten Link, der nicht mehr da ist.
- GSAP-Timeline für den Seitenwechsel gebaut, die mit dem App Router kämpft.

## Prüfliste

- [ ] `seitenwechsel` um `<main id="hauptbereich">`, nicht um das Layout
- [ ] Kopf mit `viewTransitionName: 'kopf'`, steht beim Wechsel still
- [ ] Richtung nur für Ebenenwechsel, gleiche Ebene neutral
- [ ] Nur Pfadwechsel animiert, `?tab=` und Speichern nicht
- [ ] Platzhalter in Endform (`platzhalter`), nichts verschiebt sich
- [ ] Fokus auf `<h1>`, eigener `<title>` je Seite
- [ ] Apps: kurz, keine Lade-Choreografie
- [ ] Sofortiger Wechsel bei reduzierter Bewegung

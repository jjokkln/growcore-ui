---
titel: Navigation
gruppe: muster
kurz: Kopfzeile, Menüs und Seitenleiste, die zeigen, wo man ist und wohin es geht.
stichworte: [navigation, menü, kopfzeile, header, hauptmenü, mega-menü, hamburger, seitenleiste, sidebar, brotkrumen, breadcrumb, topbar]
bausteine: [schublade, seitenwechsel]
demo: [schublade]
stand: 2026-10-02
---

## Wofür

Navigation beantwortet drei Fragen: **Wo bin ich? Wohin kann ich? Wie komme
ich zurück?** Es gibt zwei Formen. Der **Website-Kopf** führt Besucher zu
wenigen Zielen und zu einem Handlungsaufruf. Die **App-Navigation** trägt
Arbeitsbereiche, zwischen denen jemand jeden Tag wechselt. Jedes Projekt
entscheidet zuerst, welche Form es braucht.

## Aufbau

- **Website-Kopf:** eine Zeile, 64–72 px hoch, höchstens 80. Links das Logo
  (führt zur Startseite), dann 4–6 Hauptpunkte, rechts ein primärer Knopf.
  Passt die Zeile bei 1024 px nicht mehr, wandern Nebenpunkte in den Fuß oder
  ins mobile Menü.
- **Mega-Menü:** erst ab rund 8 Unterseiten in einem Bereich. Höchstens 3–4
  Spalten, jede mit einer Gruppenüberschrift. Höchstens ein hervorgehobener
  Eintrag mit Bild, kein Katalog in der Kopfzeile.
- **Mobiles Menü:** unter 1024 px ein Knopf „Menü“ im Kopf, der eine Schublade
  öffnet (Baustein `schublade`). Die Schublade kommt von der Seite, auf der der
  Knopf sitzt. Der primäre Knopf bleibt im Kopf sichtbar, solange Platz ist.
- **App-Seitenleiste:** links, 240–280 px breit, einklappbar auf 64–72 px (nur
  Symbole). Oben Produkt oder Mandant, darunter Gruppen mit Überschrift, unten
  Konto und Einstellungen. Sie scrollt nicht mit dem Inhalt.
- **App-Topbar:** 56–64 px. Suche oder Befehlspalette, Benachrichtigungen,
  Konto. Unter 1024 px wird die Seitenleiste zur Schublade, die Topbar bekommt
  den Menüknopf.
- **Aktiver Zustand:** getönte Fläche und kräftigeres Gewicht in der App,
  2 px Unterstreichung auf der Website. Auf Unterseiten bleibt der Elternpunkt
  aktiv.
- **Brotkrumen:** ab drei Ebenen Tiefe, direkt über der Überschrift. Der letzte
  Eintrag ist die aktuelle Seite und nicht verlinkt.
- **Zähler:** kleine Zahl rechts am Menüpunkt, nur für Dinge, die eine Handlung
  verlangen (offene Aufgaben, ungelesene Nachrichten). Ab 100 steht „99+“.

## Funktionen

**Grundausstattung**
- Einzeiliger Kopf mit Logo, Hauptpunkten und einem Knopf
- Mobiles Menü als Schublade
- Aktiver Zustand auf jeder Seite
- Link „Zum Inhalt springen“ als erstes Element
- Fokus nach dem Seitenwechsel auf der neuen Überschrift

**Ausbau**
- Mega-Menü für große Bereiche
- Kopf, der beim Runterscrollen weicht und beim Hochscrollen zurückkommt
- Brotkrumen für tiefe Strukturen
- Einklappbare Seitenleiste, die sich ihren Zustand merkt
- Zähler an Menüpunkten

**Speziell**
- Befehlspalette mit Strg+K oder Cmd+K
- Mandanten- oder Projektwechsler oben in der Seitenleiste
- Zuletzt besucht und Favoriten
- Menüpunkte nach Rolle (wer etwas nicht darf, sieht es nicht)
- Sprachumschalter

## Worauf es ankommt

- **Feste Höhe, eine Zeile.** Der Kopf ändert seine Höhe nicht beim Laden der
  Schrift, nicht beim Scrollen über Inhalt und nicht bei langen Labels.
- **Wenige Punkte, klare Namen.** Ein bis zwei Wörter aus der Sprache der
  Besucher: „Leistungen“ statt „Was wir tun“, „Kontakt“ statt „Lass uns reden“.
  Der Knopf im Kopf trägt dasselbe Label wie jeder andere Kontaktknopf der Seite.
- **Ein Signal für „hier bin ich“.** Akzentfarbe nur für den aktiven Punkt,
  alle anderen Punkte neutral. Hover ist leiser als aktiv.
- **Hover-Menüs mit Geduld.** Öffnen nach 100–150 ms Verweilen, schließen erst
  250–300 ms nach dem Verlassen. Sonst klappt das Menü beim Vorbeifahren auf
  und beim schrägen Weg zur Spalte zu. Klick und Tastatur öffnen immer sofort.
- **Gleiche Reihenfolge überall.** Das mobile Menü enthält alle Punkte des
  Kopfs in derselben Reihenfolge, Treffflächen mindestens 44 px hoch.
- **Die App-Navigation steht still.** Nur der Inhaltsbereich wechselt. Kopf
  und Seitenleiste werden nicht neu gerendert und flackern nicht.
- **Ein Muster je Produkt.** Zwei Arten von Seitenleiste in einem Produkt sind
  ein Fehler, kein Stil.

## Bewegung

- **Mobiles Menü:** Schublade nach Baustein. Schleier blendet in `DAUER.md`
  ein, das Panel gleitet mit `KURVE.stark` herein, die Einträge folgen
  gestaffelt (40 ms). Zu geht schneller: `DAUER.sm` mit `KURVE.rein`.
  Grund: Zustandswechsel, man sieht, woher das Menü kommt.
- **Mega-Menü:** Panel blendet ein und gleitet 8 px herab, `DAUER.xs` bis
  `DAUER.sm`, `KURVE.raus`. Wechselt man von einem Mega-Menü zum nächsten,
  bleibt das Panel stehen und nur der Inhalt tauscht (Kontinuität).
- **Website-Unterstreichung:** darf beim Hover per CSS-Übergang in `DAUER.xs`
  von links wachsen (`scaleX`). In Apps springt der aktive Zustand sofort, weil
  ohnehin die Seite wechselt.
- **Kopf beim Scrollen:** weicht mit `yPercent: -100` in `DAUER.sm` und kommt
  beim Hochscrollen zurück. Die Richtung kommt aus ScrollTrigger (`onUpdate`,
  `self.direction`), nie aus einem eigenen Scroll-Listener.
- **Seitenleiste einklappen:** Die Spaltenbreite wird nicht über `width`
  animiert. Beschriftungen blenden in `DAUER.xs` aus, die Spalte wechselt
  sofort oder per Flip.
- **Seitenwechsel:** Kopf und Navigation bleiben stehen, nur der Inhalt wechselt
  (Baustein `seitenwechsel`, Kopf mit `viewTransitionName: 'kopf'`).
- **Nicht bewegen:** Logo, Menüpunkte beim Hover (kein Hüpfen, kein Skalieren),
  Zähler (kein Pulsieren).
- Bei „Bewegung reduzieren“ öffnet alles sofort, der Kopf weicht nicht.

## Zugänglichkeit

- `<header>` mit `<nav aria-label="Hauptnavigation">`, die Punkte als Liste.
  Mehrere `<nav>` auf einer Seite haben verschiedene Namen.
- Der Sprunglink „Zum Inhalt springen“ ist das erste fokussierbare Element und
  wird beim Fokus sichtbar.
- Der aktive Punkt trägt `aria-current="page"`.
- Mega-Menü als Aufklapp-Muster: ein Knopf mit `aria-expanded` und
  `aria-controls`, Enter und Leertaste öffnen, Escape schließt und gibt den
  Fokus an den Knopf zurück. Kein `role="menu"` für Website-Navigation.
- Der Menüknopf heißt „Menü“ und hat `aria-expanded`. Die Schublade ist ein
  natives `<dialog>`: Fokus bleibt darin, Escape schließt, der Fokus kehrt zum
  Knopf zurück.
- Brotkrumen: `<nav aria-label="Brotkrumen">` mit `<ol>`, letzter Eintrag mit
  `aria-current="page"`.
- Zähler gehören in den Namen: „Aufgaben, 3 offen“. Die sichtbare Zahl ist
  `aria-hidden`.
- Eingeklappte Seitenleiste: jedes Symbol mit Namen und einem Tooltip, der bei
  Hover und Fokus erscheint.
- Nach einem Seitenwechsel steht der Fokus auf der neuen `<h1>`, nicht im Menü.
- Menütext mindestens 4,5:1, aktive Markierung mindestens 3:1 gegen ihre
  Umgebung, Treffflächen mindestens 44 × 44 px.

## Typische Fehler

- Zweizeiliger Kopf oder ein Kopf über 80 px, weil zehn Punkte hineinmussten.
- Hamburger-Menü auf dem Desktop, obwohl Platz für fünf Punkte ist.
- Mega-Menü für drei Unterseiten.
- Hover-Menü ohne Verzögerung: klappt beim Vorbeifahren auf und beim Weg zur
  Spalte wieder zu.
- Kein aktiver Zustand auf Unterseiten.
- Seitenleiste, die mit dem Inhalt wegscrollt.
- Zähler an jedem Menüpunkt, auch an „Einstellungen“.
- Fokus bleibt nach dem Seitenwechsel im Menü, Screenreader starten oben neu.

## Prüfliste

- [ ] Kopf einzeilig, 64–72 px, bei 1024 px noch einzeilig
- [ ] Mobiles Menü als `schublade`, gleiche Punkte in gleicher Reihenfolge
- [ ] Aktiver Punkt mit `aria-current="page"`, auch auf Unterseiten
- [ ] Sprunglink, Treffflächen 44 px, Kontrast 4,5:1
- [ ] Mega-Menü mit Verzögerung, `aria-expanded`, Escape schließt
- [ ] Brotkrumen ab drei Ebenen, letzter Eintrag nicht verlinkt
- [ ] Zähler nur für Handlungsbedarf, Zahl im zugänglichen Namen
- [ ] Kopf steht beim Seitenwechsel, Fokus auf der neuen `<h1>` (`seitenwechsel`)
- [ ] Alles sofort bei reduzierter Bewegung

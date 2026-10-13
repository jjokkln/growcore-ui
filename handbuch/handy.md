---
titel: Handy wie eine App
gruppe: grundlagen
kurz: Die elf Stellen, an denen man auf dem Handy den Browser merkt, und die eine Zeile, die jede davon behebt.
stichworte: [handy, mobil, touch, tap, hover, zoom, viewport, notch, safe area, dvh, svh, tastatur, pwa, nativ]
bausteine: [handy-grundlinie]
demo: []
stand: 2026-10-13
---

## Wofür

Eine Seite kann in der Geräte-Emulation des Desktop-Browsers tadellos aussehen
und sich auf dem Telefon trotzdem wie „eine Website im Browser“ anfühlen. Die
Gründe sind klein: ein Hover-Zustand, der nach dem Antippen hängen bleibt, ein
grauer Blitz beim Tippen, eine Höhe, die unter der Adressleiste verschwindet, ein
Eingabefeld, in das iOS hineinzoomt und nicht mehr heraus. Jeder dieser Fehler
ist eine Zeile CSS oder ein Meta-Tag. Keiner ist in der Emulation sichtbar.
Quelle: Emil Kowalski, `mobile-native` (installiert 2026-10-13).

## Grundlinie

Kommt mit `npx shadcn@latest add jjokkln/growcore-ui/handy-grundlinie` (im
Startpaket enthalten): CSS in `globals.css` und `lib/viewport.ts`, das
`app/layout.tsx` mit `export { viewport } from '@/lib/viewport'` übernimmt.

| Symptom | Ursache | Zeile |
| --- | --- | --- |
| Hover bleibt nach dem Tippen hängen | Touch kennt kein Hover, der Browser tut so | `:hover` nur in `@media (hover: hover) and (pointer: fine)`; Tailwind 4 macht das von selbst |
| Grauer oder blauer Blitz beim Tippen | Standard-Highlight von iOS und Android | `html { -webkit-tap-highlight-color: transparent }`, dafür jedes Bedienelement mit `:active` |
| Layout zu hoch, Knopf unter der Adressleiste | `100vh` ist der größte Viewport | App-Rahmen `100dvh`, Hero `min-height: 100svh` |
| Seite zoomt ins Eingabefeld | Schrift im Feld unter 16 px | `input, textarea, select { font-size: max(1rem, 16px) }`. Nie `maximum-scale=1` |
| Tippen fühlt sich träge an | 300-ms-Wartezeit und Rückmeldung erst beim Loslassen | `touch-action: manipulation` und `:active { transform: scale(0.97) }` mit 100–160 ms |
| Ziehen am Seitenanfang lädt neu | Pull-to-refresh | App: `html { overscroll-behavior: none }`; innere Scrollflächen `contain` |
| Inhalt endet an der Notch | Browser lässt Rand frei | `viewport-fit=cover` **und** `padding: env(safe-area-inset-*)` an fixen Leisten |
| Langes Drücken markiert Knopftext | Text ist auswählbar | `user-select: none` nur auf Knöpfen, **nie auf `body`** |
| Karussell scrollt die Seite | Browser rät die Achse | `touch-action: pan-y` auf dem Karussell, oder `scroll-snap` und gar kein JS |
| Statusleiste in falscher Farbe | ein `theme-color` für beide Schemata | `themeColor` je `prefers-color-scheme` im `viewport`-Export |
| Im Browser richtig, auf dem Telefon falsch | Emulation kennt keins davon | Auf dem Gerät prüfen: Dev-Server auf `0.0.0.0`, per LAN-IP öffnen, Safari → Entwickler |

## Regeln

- Fähigkeiten abfragen, nie Geräte raten: `(hover)`, `(pointer)`, `env()`, `dvh`.
  Kein User-Agent-Sniffing, keine Breite als Touch-Erkennung.
- Zoom bleibt immer möglich. `user-scalable=no` und `maximum-scale=1` sind
  Barrierefreiheitsfehler, die Prüfung (`handy-zoom`) macht sie rot.
- Touch und Maus schließen sich nicht aus (iPad mit Trackpad, Laptop mit
  Touchscreen). Beides zugleich bedienen.
- Eingaben bekommen den passenden Tastaturtyp: `inputmode="numeric"` für Codes,
  `type="email"`, `type="tel"`, `enterkeyhint="send"`.

## Prüfliste

- `node pruefung/pruefe.mjs .` ohne `handy-*`-Fehler.
- Auf einem echten Telefon, nicht dem neuesten: Knopf antippen (sofortige
  Rückmeldung, kein Blitz, kein hängender Hover), Eingabefeld antippen (kein
  Zoom, Tastatur verdeckt keinen Knopf), ganz oben ziehen (kein Neuladen in der
  App), Kopf- und Fußleiste frei von Notch und Home-Balken, einmal quer.
- Ohne Gerät: im Abnahmebericht „Gerät nicht verifiziert“ (launch-check 7e).

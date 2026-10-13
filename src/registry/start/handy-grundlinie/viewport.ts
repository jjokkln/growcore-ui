import type { Viewport } from 'next'

// Viewport jeder GrowCore-Seite (Baustein „handy-grundlinie“). Zusammen mit den CSS-Zeilen, die
// der Baustein in globals.css legt, nimmt er einer Website die Tells, an denen man auf dem Handy
// „das ist ein Browser“ merkt. Quelle: Emil Kowalski, mobile-native (2026-10-13).
//
//   viewportFit: 'cover'      Die Seite darf unter Notch und Home-Balken. Ohne diese Zeile sind alle
//                             env(safe-area-inset-*) gleich 0. Fixe Kopf-, Fußleisten und Sheets
//                             bekommen dann padding mit env(safe-area-inset-top|bottom).
//   interactiveWidget         Die Tastatur verkleinert den Layout-Viewport auch auf Android, damit
//                             100dvh und unten angepinnte Eingaben reagieren wie auf iOS.
//   themeColor je Schema      Statusleiste in der Farbe des Kopfbereichs (nicht der Markenfarbe),
//                             sonst hat Dunkelmodus eine weiße Leiste. Werte an das Projekt anpassen.
//
// Was hier NICHT steht, mit Absicht: userScalable: false und maximumScale: 1. Beides sperrt den
// Zoom und ist ein Barrierefreiheitsfehler (pruefe.mjs: handy-zoom). Zoomt iOS beim Antippen eines
// Feldes hinein, ist die Schrift im Feld unter 16 px, und das ist die Stelle, die man behebt.
//
// Einbau in app/layout.tsx:
//   export { viewport } from '@/lib/viewport'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

import { Geist } from 'next/font/google'

// Schriften der Seite über next/font. Die Dateien werden beim Build geladen und von der eigenen
// Domain ausgeliefert: kein Request an Google im Browser, also keine Einwilligung nötig und
// kein Absatz in der Datenschutzerklärung (Pflichtkern 3). Nie per <link> von fonts.googleapis.com.
//
// Zwei Rollen mit den Variablennamen, die shadcn in globals.css erwartet:
//   --font-sans     Fließtext (Tailwind `font-sans`, Standard auf <body>)
//   --font-heading  Überschriften (Regel für h1 bis h3 in globals.css, kommt mit dem Baustein)
// Vorgabe ist Geist für beides (Handbuch „Typografie“: Sans als Standard, Serif nur mit Grund).
// Andere Schrift: Import und Aufruf tauschen, Variablennamen behalten. Nur benötigte Schnitte laden.
//
// Einbau in app/layout.tsx (die Geist-Importe von create-next-app entfernen):
//   import { schriftVariablen } from '@/lib/fonts'
//   <html lang="de" className={`${schriftVariablen} antialiased`}>

export const schriftText = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const schriftTitel = Geist({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
})

export const schriftVariablen = `${schriftText.variable} ${schriftTitel.variable}`

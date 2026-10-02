import Link from 'next/link'
import { ConsentProvider } from '@/components/consent/consent-provider'
import { ConsentBanner } from '@/components/consent/consent-banner'
import { ConsentEinstellungenKnopf } from '@/components/consent/consent-einstellungen-knopf'
import { einwilligungNachweisen } from '@/lib/einwilligung-nachweis'
import { anzeigename } from '@/lib/site-config'

// Rahmen jeder Seite aus der Startvorlage: Einwilligung (mit Nachweis als Datensatz, Pflichtkern 12),
// Banner und ein Fuß mit Impressum, Datenschutz, Barrierefreiheit und Widerruf (Pflichtkern 2, 3, 7).
// Einbau in src/app/layout.tsx, innerhalb von <body>:
//   <SeitenRahmen>{children}</SeitenRahmen>
// Eigener Kopf und eigene Navigation gehören in children oder darüber; den Fuß gestaltet das Projekt
// weiter, die vier Links bleiben Pflicht und von jeder Seite in einem Klick erreichbar.
export function SeitenRahmen({ children }: { children: React.ReactNode }) {
  return (
    <ConsentProvider beiEntscheidung={einwilligungNachweisen}>
      {children}
      <SeitenFuss />
      <ConsentBanner />
    </ConsentProvider>
  )
}

export function SeitenFuss() {
  const link = 'underline-offset-4 hover:underline'
  return (
    <footer className="border-t px-4 py-8 text-sm sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} {anzeigename()}</span>
        <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/impressum" className={link}>Impressum</Link>
          <Link href="/datenschutz" className={link}>Datenschutz</Link>
          <Link href="/barrierefreiheit" className={link}>Barrierefreiheit</Link>
          <ConsentEinstellungenKnopf className={link} />
        </nav>
      </div>
    </footer>
  )
}

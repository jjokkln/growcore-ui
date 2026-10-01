import type { Metadata } from 'next'
import Link from 'next/link'
import { Geist, Geist_Mono } from 'next/font/google'
import { Seitenwechsel } from '@/components/motion/seitenwechsel'
import { MeldungenRahmen } from '@/components/motion/meldung'
import './globals.css'

// next/font lädt die Schriften beim Build und liefert sie selbst aus: kein Request an Google.
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'growcore-ui · Handbuch',
  description: 'Design-Handbuch und Bausteine von GrowCore: Muster, Regeln, Bewegung mit GSAP.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        <header
          className="sticky top-0 z-20 border-b border-linie bg-papier/85 backdrop-blur"
          style={{ viewTransitionName: 'kopf' }}
        >
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" transitionTypes={['zurueck']} className="font-semibold tracking-tight">
              growcore-ui
            </Link>
            <div className="flex gap-5 text-sm text-leise sm:gap-6">
              <Link href="/" transitionTypes={['zurueck']} className="hover:text-tinte">Handbuch</Link>
              <Link href="/bausteine" transitionTypes={['vor']} className="hover:text-tinte">Bausteine</Link>
              <Link href="/tokens" transitionTypes={['vor']} className="hover:text-tinte">Tokens</Link>
            </div>
          </nav>
        </header>
        <MeldungenRahmen>
          <main id="hauptbereich" className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">
            <Seitenwechsel>{children}</Seitenwechsel>
          </main>
        </MeldungenRahmen>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { FehlerFlaeche, KNOPF_HAUPT } from '@/components/fehler/fehler-flaeche'

// Die 404-Seite. Next rendert sie im Root-Layout, Kopf und Fuß der Seite bleiben also stehen
// und mit ihnen Impressum und Datenschutz. Server Component: ein alter Link ist der Normalfall,
// kein Defekt, und wird deshalb nicht geloggt.
// Next antwortet hier selbst mit Status 404 und setzt noindex.

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
}

export default function NichtGefunden() {
  return (
    <FehlerFlaeche
      kennzeichen="Fehler 404"
      titel="Diese Seite gibt es nicht"
      text="Der Link ist veraltet oder in der Adresse steckt ein Tippfehler. Von der Startseite aus finden Sie alles Weitere."
    >
      <Link href="/" className={KNOPF_HAUPT}>
        Zur Startseite
      </Link>
    </FehlerFlaeche>
  )
}

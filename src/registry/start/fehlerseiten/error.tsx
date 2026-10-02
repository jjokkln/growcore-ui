'use client'

// Fehlerfläche für jeden Seitenbereich unterhalb des Root-Layouts. Zwei Regeln:
// 1. Der Besucher sieht keine technische Meldung: error.message aus einer Server Component ist in
//    Produktion ohnehin nur ein Platzhalter, und eine durchgereichte Datenbankmeldung verrät
//    Interna. Er bekommt, was passiert ist, was er tun kann, und eine Referenz (digest).
// 2. Der echte Fehler steht trotzdem irgendwo: Next loggt Serverfehler selbst, ein Fehler, der
//    erst im Browser entsteht, hinterlässt ohne das console.error unten keine Spur.
// Wiederholen: Next 16.3 gibt `retry` (holt die Daten neu), ältere 16er nur `reset` (rendert neu).
import Link from 'next/link'
import { useEffect } from 'react'
import { FehlerFlaeche, KNOPF_HAUPT, KNOPF_NEBEN } from '@/components/fehler/fehler-flaeche'

export default function Fehler({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string }
  reset: () => void
  retry?: () => void
}) {
  useEffect(() => {
    console.error('[fehler]', { digest: error.digest }, error)
  }, [error])

  return (
    <FehlerFlaeche
      kennzeichen="Fehler"
      titel="Da ist etwas schiefgelaufen"
      text="Diese Seite konnte gerade nicht geladen werden. Meist hilft es, es gleich noch einmal zu versuchen."
      referenz={error.digest}
    >
      <button type="button" className={KNOPF_HAUPT} onClick={() => (retry ?? reset)()}>
        Erneut versuchen
      </button>
      <Link href="/" className={KNOPF_NEBEN}>
        Zur Startseite
      </Link>
    </FehlerFlaeche>
  )
}

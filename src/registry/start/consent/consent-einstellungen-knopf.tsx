'use client'

// Öffnet das Banner erneut: Widerruf muss so einfach sein wie die Erteilung (Art. 7 Abs. 3
// DSGVO). Gehört dauerhaft in den Fuß, direkt neben Impressum und Datenschutz.
// Gibt es nichts einzuwilligen, rendert er nichts. Aussehen über className, Standard: wie ein Link.
import { EINWILLIGUNG_NOETIG } from '@/lib/consent'
import { useConsent } from '@/components/consent/consent-provider'

export function ConsentEinstellungenKnopf({
  className = 'underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
}: {
  className?: string
}) {
  const { einstellungenOeffnen } = useConsent()
  if (!EINWILLIGUNG_NOETIG) return null
  return (
    <button type="button" className={className} onClick={einstellungenOeffnen}>
      Datenschutz-Einstellungen
    </button>
  )
}

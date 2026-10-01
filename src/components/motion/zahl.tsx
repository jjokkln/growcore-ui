'use client'

import { useMemo, useRef } from 'react'
import { BEWEGUNG, KURVE, gsap, useGSAP } from '@/lib/motion/gsap'

// Eine Kennzahl, die beim ersten Erscheinen hochzählt und bei jeder späteren Änderung vom alten
// zum neuen Wert läuft. Nur für echte KPIs, nicht für jede Zahl auf der Seite.
// nurErstes: Spätere Änderungen springen sofort auf den neuen Wert. Für Kacheln, die zugleich
// Filter sind: Wer klickt, will die neue Zahl lesen, nicht zusehen, wie sie dorthin läuft.
// Gegen Springen und Umbrechen: Eine unsichtbare Kopie des Endwerts im selben Grid-Feld hält die
// Breite fest, tabular-nums macht alle Ziffern gleich breit, nowrap verhindert Umbrüche. Der
// Server rendert den Endwert. Vorgelesen wird immer der Endwert, nie ein Zwischenstand.
// Gezählt wird am Textknoten, den React selbst hält: kein setState pro Frame.
export function Zahl({
  wert,
  format,
  locale = 'de-DE',
  className,
  beimScrollen = true,
  nurErstes = false,
}: {
  wert: number
  format?: Intl.NumberFormatOptions
  locale?: string
  className?: string
  beimScrollen?: boolean
  nurErstes?: boolean
}) {
  const fmt = useMemo(() => new Intl.NumberFormat(locale, format), [locale, format])
  const text = fmt.format(wert)
  const anzeige = useRef<HTMLSpanElement>(null)
  const stand = useRef<number | null>(null)

  useGSAP(
    () => {
      const knoten = anzeige.current?.firstChild
      if (!knoten || !Number.isFinite(wert)) return
      const ganz = Number.isInteger(wert) && !format?.maximumFractionDigits
      const zeige = (w: number) => { knoten.nodeValue = fmt.format(ganz ? Math.round(w) : w) }
      // stand folgt dem angezeigten Wert. Er wird erst gesetzt, wenn wirklich gezählt wurde: Der
      // doppelte Mount im Strict Mode verschluckt sonst das erste Hochzählen.
      const von = stand.current ?? 0
      const erstes = stand.current === null
      if (!erstes && nurErstes) {
        stand.current = wert
        knoten.nodeValue = text
        return
      }

      const mm = gsap.matchMedia()
      mm.add(BEWEGUNG, () => {
        const z = { w: von }
        zeige(von)
        gsap.to(z, {
          w: wert,
          duration: erstes ? 1.2 : 0.6,
          ease: KURVE.raus,
          delay: erstes ? 0.1 : 0,
          onUpdate: () => { stand.current = z.w; zeige(z.w) },
          onComplete: () => { stand.current = wert; knoten.nodeValue = text },
          scrollTrigger: erstes && beimScrollen ? { trigger: anzeige.current, start: 'top 90%', once: true } : undefined,
        })
        return () => { knoten.nodeValue = text }
      })
      return () => mm.revert()
    },
    { dependencies: [wert, text, nurErstes], revertOnUpdate: true },
  )

  return (
    <span className={className} style={{ display: 'inline-grid', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
      <span aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden' }}>{text}</span>
      <span ref={anzeige} aria-hidden style={{ gridArea: '1 / 1' }}>{text}</span>
      <span style={NUR_VORLESEN}>{text}</span>
    </span>
  )
}

const NUR_VORLESEN: React.CSSProperties = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden',
  clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
}

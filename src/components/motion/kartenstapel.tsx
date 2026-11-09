'use client'

import { useRef } from 'react'
import { BEWEGUNG, ScrollTrigger, bewegungErlaubt, gsap, useGSAP } from '@/lib/motion/gsap'

// Karten legen sich beim Scrollen übereinander: Jede bleibt oben stehen (position: sticky), die
// nächste schiebt sich darüber, die verdeckte tritt leicht zurück (kleiner, etwas dunkler).
// Gut für drei bis fünf Leistungen, Schritte oder Fallbeispiele, die nacheinander gelesen werden
// sollen. Kein Pin, kein Scroll-Hijacking: Die Seite scrollt normal, ohne JavaScript stapeln sich
// die Karten trotzdem (nur ohne Zurücktreten).
// Abdunkeln über eine eigene Schattenfläche mit opacity, nie über filter: GSAP interpoliert filter
// ab „none“ wie ab brightness(0), die Karte startet dann schwarz (Lehre L-0261).
// --kopf-hoehe setzen, wenn ein fester Kopf die Karten sonst verdeckt. data-stapel: Mit
// gefuehrtes-scrollen.tsx ist jede Karte ein eigener Landepunkt.
const STIL = `
.gc-ks{display:grid;gap:2rem}
.gc-ks-karte{position:sticky;top:calc(var(--kopf-hoehe,0px) + 1.5rem + var(--gc-ks-i) * .75rem);transform-origin:50% 0;will-change:transform}
.gc-ks-schatten{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none}
`

export function Kartenstapel({ karten, className }: { karten: React.ReactNode[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(BEWEGUNG, () => {
        // Panel-Schalter „Animationen stoppen“ wie reduzierte Bewegung (lib/motion/gsap.ts).
        if (!bewegungErlaubt()) return
        const liste = gsap.utils.toArray<HTMLElement>('.gc-ks-karte', el)
        liste.slice(0, -1).forEach((karte, i) => {
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: liste[i + 1],
              start: 'top bottom',
              end: () => `top ${ScrollTrigger.isTouch ? 30 : 20}%`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          tl.fromTo(karte, { scale: 1 }, { scale: 0.94 }, 0)
          const schatten = karte.querySelector('.gc-ks-schatten')
          if (schatten) tl.fromTo(schatten, { opacity: 0 }, { opacity: 0.1 }, 0)
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={['gc-ks', className].filter(Boolean).join(' ')} data-stapel>
      <style href="gc-kartenstapel" precedence="default">{STIL}</style>
      {karten.map((k, i) => (
        <div key={i} className="gc-ks-karte" style={{ ['--gc-ks-i' as string]: i }}>
          {k}
          <span aria-hidden className="gc-ks-schatten" />
        </div>
      ))}
    </div>
  )
}

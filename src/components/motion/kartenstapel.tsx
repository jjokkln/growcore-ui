'use client'

import { useRef } from 'react'
import { BEWEGUNG, ScrollTrigger, gsap, useGSAP } from '@/lib/motion/gsap'

// Karten legen sich beim Scrollen übereinander: Jede bleibt oben stehen (position: sticky), die
// nächste schiebt sich darüber, die verdeckte tritt leicht zurück (kleiner, etwas dunkler).
// Gut für drei bis fünf Leistungen, Schritte oder Fallbeispiele, die nacheinander gelesen werden
// sollen. Kein Pin, kein Scroll-Hijacking: Die Seite scrollt normal, ohne JavaScript stapeln sich
// die Karten trotzdem (nur ohne Zurücktreten).
// --kopf-hoehe setzen, wenn ein fester Kopf die Karten sonst verdeckt.
const STIL = `
.gc-ks{display:grid;gap:2rem}
.gc-ks-karte{position:sticky;top:calc(var(--kopf-hoehe,0px) + 1.5rem + var(--gc-ks-i) * .75rem);transform-origin:50% 0;will-change:transform}
`

export function Kartenstapel({ karten, className }: { karten: React.ReactNode[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(BEWEGUNG, () => {
        const liste = gsap.utils.toArray<HTMLElement>('.gc-ks-karte', el)
        liste.slice(0, -1).forEach((karte, i) => {
          gsap.to(karte, {
            scale: 0.94,
            filter: 'brightness(0.9)',
            ease: 'none',
            scrollTrigger: {
              trigger: liste[i + 1],
              start: 'top bottom',
              end: () => `top ${ScrollTrigger.isTouch ? 30 : 20}%`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={['gc-ks', className].filter(Boolean).join(' ')}>
      <style href="gc-kartenstapel" precedence="default">{STIL}</style>
      {karten.map((k, i) => (
        <div key={i} className="gc-ks-karte" style={{ ['--gc-ks-i' as string]: i }}>
          {k}
        </div>
      ))}
    </div>
  )
}

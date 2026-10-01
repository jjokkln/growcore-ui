'use client'

import { useRef } from 'react'
import { BEWEGUNG, DAUER, KURVE, gsap, useGSAP } from '@/lib/motion/gsap'

// Bild öffnet sich aus einem Ausschnitt (clip-path) und setzt sich dabei von leicht vergrößert
// auf normal. Wirkt wie ein Vorhang, kostet aber kaum Rechenleistung: clip-path und transform
// laufen auf der Grafikkarte. Für ein bis zwei Schlüsselbilder je Seite, nicht für jedes Bild,
// und nie für das Hero-Bild (LCP bleibt sofort sichtbar).
//   <BildEnthuellung><Image src=… alt=… /></BildEnthuellung>
// von: 'mitte' öffnet von innen nach außen, 'unten' von unten nach oben, 'links' von links.
// scrub: true hängt das Öffnen ans Scrollen, sonst spielt es einmal beim Eintritt.
const AUSSCHNITT = {
  mitte: 'inset(14% 14% 14% 14% round 1rem)',
  unten: 'inset(100% 0% 0% 0% round 1rem)',
  links: 'inset(0% 100% 0% 0% round 1rem)',
}
const STIL = `@media (prefers-reduced-motion: no-preference){[data-enthuellung="warte"]{clip-path:inset(14% 14% 14% 14% round 1rem)}}`

export function BildEnthuellung({
  children,
  von = 'mitte',
  scrub = false,
  className,
}: {
  children: React.ReactNode
  von?: keyof typeof AUSSCHNITT
  scrub?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(BEWEGUNG, () => {
        const innen = el.firstElementChild
        const tl = gsap.timeline({
          scrollTrigger: scrub
            ? { trigger: el, start: 'top 85%', end: 'center 55%', scrub: 0.6 }
            : { trigger: el, start: 'top 80%', once: true },
        })
        tl.fromTo(el, { clipPath: AUSSCHNITT[von] }, { clipPath: 'inset(0% 0% 0% 0% round 1rem)', duration: DAUER.lg * 1.4, ease: KURVE.stark }, 0)
        if (innen) tl.fromTo(innen, { scale: 1.15 }, { scale: 1, duration: DAUER.lg * 1.6, ease: KURVE.stark }, 0)
        el.dataset.enthuellung = 'bereit'
      })
      el.dataset.enthuellung = 'bereit'
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} data-enthuellung="warte" className={className} style={{ overflow: 'hidden', borderRadius: '1rem' }}>
      <style href="gc-bild-enthuellung" precedence="default">{STIL}</style>
      {children}
    </div>
  )
}

'use client'

import { useRef } from 'react'
import { BEWEGUNG, DAUER, KURVE, ScrollTrigger, gsap, useGSAP } from '@/lib/motion/gsap'

// Erklärseite in Schritten: Links (auf dem Handy oben) steht ein Bild fest, rechts scrollen die
// Schritte vorbei. Erreicht ein Schritt die Mitte, wird er hervorgehoben und sein Bild blendet über.
// Festgehalten wird mit position: sticky, nicht mit einem GSAP-Pin: kein Layoutsprung, kein
// Ruckeln auf iOS, und ohne JavaScript bleibt alles lesbar (alle Schritte voll sichtbar, das erste
// Bild steht). Bei „Bewegung reduzieren" wechselt das Bild sofort statt zu blenden.
// --kopf-hoehe setzen, wenn ein fester Kopf das Bild sonst verdeckt.
const STIL = `
.gc-gs{display:grid;gap:2rem}
.gc-gs-buehne{position:sticky;top:var(--kopf-hoehe,1rem);height:42vh;z-index:1}
.gc-gs-bild{position:absolute;inset:0}
.gc-gs-schritt{min-height:60vh;display:flex;flex-direction:column;justify-content:center}
@media (min-width:768px){.gc-gs{grid-template-columns:1fr 1fr;gap:4rem}.gc-gs-buehne{height:calc(100vh - var(--kopf-hoehe,0px) - 4rem);top:calc(var(--kopf-hoehe,0px) + 2rem)}.gc-gs-schritt{min-height:80vh}}`

export type Schritt = { titel: string; text: React.ReactNode; bild: React.ReactNode }

export function ScrollGeschichte({ schritte, className }: { schritte: Schritt[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const bilder = gsap.utils.toArray<HTMLElement>('.gc-gs-bild', el)
      const texte = gsap.utils.toArray<HTMLElement>('.gc-gs-schritt', el)
      const mm = gsap.matchMedia()
      mm.add({ bewegung: BEWEGUNG, immer: 'all' }, (ctx) => {
        const dauer = ctx.conditions?.bewegung ? DAUER.md : 0
        const zeige = (i: number) => {
          bilder.forEach((b, j) =>
            gsap.to(b, { autoAlpha: j === i ? 1 : 0, scale: j === i ? 1 : 0.97, duration: dauer, ease: KURVE.raus, overwrite: true }),
          )
          texte.forEach((t, j) => gsap.to(t, { opacity: j === i ? 1 : 0.35, duration: dauer, overwrite: true }))
        }
        gsap.set(bilder, { autoAlpha: 0 })
        zeige(0)
        texte.forEach((t, i) =>
          ScrollTrigger.create({
            trigger: t,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => self.isActive && zeige(i),
          }),
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={['gc-gs', className].filter(Boolean).join(' ')}>
      <style href="gc-scroll-geschichte" precedence="default">{STIL}</style>
      <div className="gc-gs-buehne" aria-hidden>
        {schritte.map((s, i) => (
          <div key={i} className="gc-gs-bild" style={i > 0 ? { visibility: 'hidden' } : undefined}>
            {s.bild}
          </div>
        ))}
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {schritte.map((s, i) => (
          <li key={i} className="gc-gs-schritt">
            <h3>{s.titel}</h3>
            <div>{s.text}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}

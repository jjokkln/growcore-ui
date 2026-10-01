'use client'

import { useRef } from 'react'
import { BEWEGUNG, DAUER, KURVE, STAFFEL, VERSATZ, ScrollTrigger, gsap, useGSAP } from '@/lib/motion/gsap'

// Auftritt: Alles darin mit
//   data-auftritt  blendet gestaffelt von unten ein,
//   data-balken    wächst von links auf seine Breite (Fortschritt, Diagrammbalken).
// beimScrollen=false: sofort beim Laden (App-Seiten, Dashboards).
// beimScrollen=true:  jedes Element, sobald es ins Bild kommt (Websites).
// Die Hülle ist display: contents und ändert das Layout nicht. Bis GSAP startet, hält CSS die
// Elemente im Startzustand, damit beim ersten Laden nichts aufblitzt. Ohne Bewegungswunsch
// greift diese Regel gar nicht. Nur opacity, nie visibility: Links in noch nicht gezeigten
// Abschnitten bleiben per Tastatur erreichbar.
// Nicht für die Hero-Headline: Das größte Element der Seite (LCP) bleibt sofort sichtbar.
const STIL = `@media (prefers-reduced-motion: no-preference){[data-auftritt-huelle="warte"] [data-auftritt]{opacity:0}[data-auftritt-huelle="warte"] [data-balken]{transform:scaleX(0);transform-origin:0 50%}}`

export function Auftritt({ children, beimScrollen = false }: { children: React.ReactNode; beimScrollen?: boolean }) {
  const huelle = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = huelle.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(BEWEGUNG, () => {
        const teile = gsap.utils.toArray<HTMLElement>('[data-auftritt]', el)
        const balken = gsap.utils.toArray<HTMLElement>('[data-balken]', el)
        gsap.set(teile, { opacity: 0, y: VERSATZ })
        gsap.set(balken, { scaleX: 0, transformOrigin: '0 50%' })
        el.dataset.auftrittHuelle = 'bereit'

        const zeige = (ziele: Element[]) =>
          gsap.to(ziele, { opacity: 1, y: 0, duration: DAUER.md, ease: KURVE.raus, stagger: STAFFEL, overwrite: true })
        const fuelle = (ziele: Element[]) =>
          gsap.to(ziele, { scaleX: 1, duration: DAUER.lg, ease: KURVE.raus, stagger: 0.035, delay: 0.1 })

        if (!beimScrollen) {
          zeige(teile)
          fuelle(balken)
          return
        }
        ScrollTrigger.batch(teile, { start: 'top 88%', once: true, onEnter: zeige })
        ScrollTrigger.batch(balken, { start: 'top 92%', once: true, onEnter: fuelle })
      })
      el.dataset.auftrittHuelle = 'bereit'
      return () => mm.revert()
    },
    { scope: huelle },
  )

  return (
    <>
      <style href="gc-auftritt" precedence="default">{STIL}</style>
      <div ref={huelle} data-auftritt-huelle="warte" style={{ display: 'contents' }}>
        {children}
      </div>
    </>
  )
}

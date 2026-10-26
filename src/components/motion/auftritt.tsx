'use client'

import { useRef } from 'react'
import { BEWEGUNG, DAUER, KURVE, ScrollTrigger, STAFFEL, STOPP_ATTRIBUT, VERSATZ, bewegungErlaubt, gsap, useGSAP } from '@/lib/motion/gsap'

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
        // Panel-Schalter „Animationen stoppen“ wie reduzierte Bewegung (lib/motion/gsap.ts).
        if (!bewegungErlaubt()) return
        const teile = gsap.utils.toArray<HTMLElement>('[data-auftritt]', el)
        const balken = gsap.utils.toArray<HTMLElement>('[data-balken]', el)
        gsap.set(teile, { opacity: 0, y: VERSATZ })
        gsap.set(balken, { scaleX: 0, transformOrigin: '0 50%' })
        el.dataset.auftrittHuelle = 'bereit'

        // Je Einsatz neu gefragt: Kommt der Schalter erst nach dem Laden, erscheint, was danach ins
        // Bild scrollt, sofort statt aufzutreten.
        const zeige = (ziele: Element[]) =>
          bewegungErlaubt()
            ? gsap.to(ziele, { opacity: 1, y: 0, duration: DAUER.md, ease: KURVE.raus, stagger: STAFFEL, overwrite: true })
            : gsap.set(ziele, { opacity: 1, y: 0, overwrite: true })
        const fuelle = (ziele: Element[]) =>
          bewegungErlaubt()
            ? gsap.to(ziele, { scaleX: 1, duration: DAUER.lg, ease: KURVE.raus, stagger: 0.035, delay: 0.1 })
            : gsap.set(ziele, { scaleX: 1, overwrite: true })

        if (!beimScrollen) {
          zeige(teile)
          fuelle(balken)
          return
        }
        const trigger = [
          ...ScrollTrigger.batch(teile, { start: 'top 88%', once: true, onEnter: zeige }),
          ...ScrollTrigger.batch(balken, { start: 'top 92%', once: true, onEnter: fuelle }),
        ]
        // Schalter kommt nach dem Laden: Was noch auf seinen Einsatz wartet, steht sofort da, auch
        // wenn es schon unten im Bild ist. Diese Trigger haben keine Animation, die der Kern
        // (lib/motion/gsap.ts) ans Ende spulen könnte, deshalb hier.
        const stopp = new MutationObserver(() => {
          if (bewegungErlaubt()) return
          trigger.forEach((st) => st.kill())
          zeige(teile)
          fuelle(balken)
        })
        stopp.observe(document.documentElement, { attributes: true, attributeFilter: [STOPP_ATTRIBUT] })
        return () => stopp.disconnect()
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

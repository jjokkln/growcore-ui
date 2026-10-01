'use client'

import { useRef } from 'react'
import { BEWEGUNG, gsap, useGSAP } from '@/lib/motion/gsap'

// Element folgt dem Zeiger ein Stück und federt beim Verlassen zurück. Für den einen
// Haupt-Button einer Seite, nicht für jeden. Nur mit echter Maus (hover + feiner Zeiger) und
// Bewegungswunsch; auf Touch passiert nichts. quickTo legt den Tween einmal an und füttert ihn
// nur noch mit Zielwerten: kein neuer Tween pro pointermove.
//   const ref = useMagnet<HTMLAnchorElement>(0.3)
//   <a ref={ref} …>
export function useMagnet<T extends HTMLElement>(staerke = 0.3) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(`${BEWEGUNG} and (hover: hover) and (pointer: fine)`, () => {
        const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
        const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
        let mitte = { x: 0, y: 0 }
        const betreten = () => {
          const r = el.getBoundingClientRect()
          mitte = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
        }
        const bewegen = (e: PointerEvent) => {
          x((e.clientX - mitte.x) * staerke)
          y((e.clientY - mitte.y) * staerke)
        }
        const verlassen = () => {
          x(0)
          y(0)
        }
        el.addEventListener('pointerenter', betreten)
        el.addEventListener('pointermove', bewegen)
        el.addEventListener('pointerleave', verlassen)
        return () => {
          el.removeEventListener('pointerenter', betreten)
          el.removeEventListener('pointermove', bewegen)
          el.removeEventListener('pointerleave', verlassen)
        }
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [staerke] },
  )

  return ref
}

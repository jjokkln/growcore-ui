'use client'

import { useRef } from 'react'
import { BEWEGUNG, gsap, useGSAP } from '@/lib/motion/gsap'

// Karte neigt sich leicht zum Zeiger, als läge sie im Raum. Für Leistungs- oder Projektkarten,
// höchstens wenige Grad: Ab etwa 8° wirkt es verspielt statt hochwertig. Nur mit echter Maus und
// Bewegungswunsch.
//   const ref = useNeigung<HTMLDivElement>(6)
export function useNeigung<T extends HTMLElement>(grad = 6) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(`${BEWEGUNG} and (hover: hover) and (pointer: fine)`, () => {
        gsap.set(el, { transformPerspective: 900 })
        const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
        const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
        const bewegen = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5
          rx(-ny * grad * 2)
          ry(nx * grad * 2)
        }
        const verlassen = () => {
          rx(0)
          ry(0)
        }
        el.addEventListener('pointermove', bewegen)
        el.addEventListener('pointerleave', verlassen)
        return () => {
          el.removeEventListener('pointermove', bewegen)
          el.removeEventListener('pointerleave', verlassen)
        }
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [grad] },
  )

  return ref
}

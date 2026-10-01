'use client'

import { useRef } from 'react'
import { DAUER, KURVE, gsap, useGSAP } from '@/lib/motion/gsap'

// Spielt alle Kurven nebeneinander ab, damit man den Unterschied sieht statt ihn zu lesen.
export function KurvenVergleich() {
  const ref = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: ref })
  // contextSafe erst im Handler aufrufen: Beim Rendern aufgerufen meldet die React-Compiler-Regel
  // react-hooks/refs einen Ref-Zugriff während des Renderns.
  const abspielen = () => contextSafe(() => {
    gsap.utils.toArray<HTMLElement>('[data-kugel]', ref.current).forEach((k) => {
      const kurve = k.dataset.kugel as keyof typeof KURVE
      gsap.fromTo(k, { xPercent: 0, left: 0 }, { left: '100%', xPercent: -100, duration: DAUER.lg, ease: KURVE[kurve], overwrite: true })
    })
  })()
  return (
    <div ref={ref} className="rounded-xl border border-linie bg-flaeche p-6">
      <div className="grid gap-5">
        {(Object.keys(KURVE) as (keyof typeof KURVE)[]).map((k) => (
          <div key={k} className="grid grid-cols-[6rem_1fr] items-center gap-4">
            <span className="font-mono text-xs text-leise">{k}</span>
            <div className="relative h-4 rounded-full bg-papier">
              <span data-kugel={k} className="absolute top-0 block size-4 rounded-full bg-akzent" />
            </div>
          </div>
        ))}
      </div>
      <button onClick={abspielen} className="mt-6 rounded-full bg-tinte px-5 py-2.5 text-sm font-medium text-papier hover:bg-akzent">
        Abspielen ({DAUER.lg * 1000} ms)
      </button>
    </div>
  )
}

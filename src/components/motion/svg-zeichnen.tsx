'use client'

import { useRef } from 'react'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { BEWEGUNG, DAUER, KURVE, gsap, registriere, useGSAP } from '@/lib/motion/gsap'

registriere(DrawSVGPlugin, MotionPathPlugin)

// Erklärgrafik aus einem eigenen Inline-SVG: Prozess, Datenfluss, Architektur, Vorher/Nachher.
// Im SVG markieren:
//   data-zeichnen                    Linie wird gezeichnet (path, line, polyline, circle, rect)
//   data-erscheinen                  Element blendet ein, nachdem die Linien davor stehen
//   data-folgt="#pfad-id"            Element läuft endlos auf diesem Pfad (Datenpunkt, Paket)
// Reihenfolge = Reihenfolge im SVG. scrub=true hängt das Zeichnen ans Scrollen, sonst spielt es
// einmal, wenn die Grafik ins Bild kommt. Die Grafik braucht einen <title> für Screenreader;
// ohne Bewegungswunsch steht sie sofort fertig da.
export function SvgZeichnen({ children, scrub = false, className }: { children: React.ReactNode; scrub?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(BEWEGUNG, () => {
        const tl = gsap.timeline({
          scrollTrigger: scrub
            ? { trigger: el, start: 'top 75%', end: 'bottom 40%', scrub: 0.6 }
            : { trigger: el, start: 'top 80%', once: true },
        })
        gsap.utils.toArray<SVGElement>('[data-zeichnen], [data-erscheinen]', el).forEach((teil) => {
          if (teil.hasAttribute('data-zeichnen')) {
            tl.fromTo(teil, { drawSVG: '0%' }, { drawSVG: '100%', duration: DAUER.lg, ease: KURVE.wechsel }, '>-0.25')
          } else {
            tl.fromTo(teil, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: DAUER.sm, ease: KURVE.raus }, '>-0.1')
          }
        })
        gsap.utils.toArray<SVGElement>('[data-folgt]', el).forEach((teil, i) => {
          const pfad = teil.getAttribute('data-folgt')!
          gsap.to(teil, {
            motionPath: { path: pfad, align: pfad, alignOrigin: [0.5, 0.5] },
            duration: 3,
            ease: 'none',
            repeat: -1,
            delay: i * 0.6,
          })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

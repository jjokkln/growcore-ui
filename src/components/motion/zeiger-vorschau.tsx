'use client'

import { useRef, useState } from 'react'
import { BEWEGUNG, DAUER, KURVE, gsap, useGSAP } from '@/lib/motion/gsap'

// Liste (Projekte, Leistungen, Referenzen), bei der ein Vorschaubild dem Mauszeiger folgt, sobald
// man über einen Eintrag fährt. Das Bild wechselt mit dem Eintrag, ohne neu aufzutauchen.
// Nur mit echter Maus. Auf Touch und ohne Bewegungswunsch steht das Bild klein in der Zeile;
// mit der Tastatur erscheint es neben dem fokussierten Eintrag. Jeder Eintrag ist ein echter Link.
export type Vorschau = { titel: string; zusatz?: string; href: string; bild: React.ReactNode }

const STIL = `
.gc-zv{position:relative;list-style:none;margin:0;padding:0;border-top:1px solid var(--vorschau-linie,color-mix(in oklab,currentColor 15%,transparent))}
.gc-zv-eintrag{border-bottom:1px solid var(--vorschau-linie,color-mix(in oklab,currentColor 15%,transparent))}
.gc-zv-link{display:grid;grid-template-columns:1fr auto;align-items:center;gap:1rem;padding:1.25rem 0;color:inherit;text-decoration:none}
.gc-zv-titel{font-size:clamp(1.25rem,2.5vw,2rem);font-weight:600;letter-spacing:-.02em;transition:transform var(--dauer-sm,.25s) var(--kurve-raus,ease-out)}
.gc-zv-zusatz{color:var(--vorschau-leise,color-mix(in oklab,currentColor 60%,transparent));font-size:.9rem}
.gc-zv-klein{display:none;width:4.5rem;aspect-ratio:4/3;border-radius:.5rem;overflow:hidden}
.gc-zv-bild{position:fixed;left:0;top:0;width:clamp(14rem,22vw,20rem);aspect-ratio:4/3;border-radius:.75rem;overflow:hidden;pointer-events:none;z-index:30;opacity:0;visibility:hidden}
.gc-zv-bild>div{position:absolute;inset:0}
@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){.gc-zv-link:hover .gc-zv-titel,.gc-zv-link:focus-visible .gc-zv-titel{transform:translateX(.75rem)}}
@media not ((hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)){.gc-zv-klein{display:block}.gc-zv-bild{display:none}.gc-zv-link{grid-template-columns:auto 1fr auto}}
`

export function ZeigerVorschau({ eintraege, className }: { eintraege: Vorschau[]; className?: string }) {
  const ref = useRef<HTMLUListElement>(null)
  const bild = useRef<HTMLDivElement>(null)
  const [aktiv, setAktiv] = useState(0)

  const { contextSafe } = useGSAP(
    () => {
      const el = ref.current
      const b = bild.current
      if (!el || !b) return
      const mm = gsap.matchMedia()
      mm.add(`${BEWEGUNG} and (hover: hover) and (pointer: fine)`, () => {
        const x = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'power3.out' })
        const y = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'power3.out' })
        const folgen = (e: PointerEvent) => {
          x(e.clientX + 24)
          y(e.clientY - b.offsetHeight / 2)
        }
        const rein = () => gsap.to(b, { autoAlpha: 1, scale: 1, duration: DAUER.sm, ease: KURVE.raus, overwrite: 'auto' })
        const raus = () => gsap.to(b, { autoAlpha: 0, scale: 0.92, duration: DAUER.xs, ease: KURVE.rein, overwrite: 'auto' })
        gsap.set(b, { scale: 0.92 })
        el.addEventListener('pointermove', folgen)
        el.addEventListener('pointerenter', rein)
        el.addEventListener('pointerleave', raus)
        return () => {
          el.removeEventListener('pointermove', folgen)
          el.removeEventListener('pointerenter', rein)
          el.removeEventListener('pointerleave', raus)
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  // Bildwechsel: das neue blendet über das alte, statt neu aufzutauchen.
  useGSAP(
    () => {
      const b = bild.current
      if (!b) return
      gsap.utils.toArray<HTMLElement>(':scope > div', b).forEach((teil, i) =>
        gsap.to(teil, { opacity: i === aktiv ? 1 : 0, duration: DAUER.sm, ease: KURVE.raus, overwrite: true }),
      )
    },
    { dependencies: [aktiv] },
  )

  // Tastatur: Bild neben den fokussierten Eintrag stellen.
  const fokus = (i: number, ziel: HTMLElement) =>
    contextSafe(() => {
      setAktiv(i)
      const b = bild.current
      if (!b || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      const r = ziel.getBoundingClientRect()
      gsap.set(b, { x: r.right - b.offsetWidth - 16, y: r.top + r.height / 2 - b.offsetHeight / 2 })
      gsap.to(b, { autoAlpha: 1, scale: 1, duration: DAUER.sm, ease: KURVE.raus })
    })()

  return (
    <ul ref={ref} className={['gc-zv', className].filter(Boolean).join(' ')}>
      <style href="gc-zeiger-vorschau" precedence="default">{STIL}</style>
      {eintraege.map((e, i) => (
        <li key={e.href + i} className="gc-zv-eintrag" onPointerEnter={() => setAktiv(i)}>
          <a
            href={e.href}
            className="gc-zv-link"
            onFocus={(ev) => fokus(i, ev.currentTarget)}
            onBlur={() => bild.current && gsap.to(bild.current, { autoAlpha: 0, duration: DAUER.xs })}
          >
            <span className="gc-zv-klein" aria-hidden>{e.bild}</span>
            <span className="gc-zv-titel">{e.titel}</span>
            {e.zusatz && <span className="gc-zv-zusatz">{e.zusatz}</span>}
          </a>
        </li>
      ))}
      <div ref={bild} className="gc-zv-bild" aria-hidden>
        {eintraege.map((e, i) => (
          <div key={i} style={{ opacity: i === 0 ? 1 : 0 }}>{e.bild}</div>
        ))}
      </div>
    </ul>
  )
}

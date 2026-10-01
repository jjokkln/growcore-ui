'use client'

import { useRef } from 'react'
import { BEWEGUNG, gsap, useGSAP } from '@/lib/motion/gsap'

// Ablauf in Schritten („So arbeiten wir", „In drei Schritten zum Angebot"). Beim Scrollen läuft eine
// Linie von Schritt zu Schritt, jeder Punkt ploppt auf, wenn sie ihn erreicht, der Text folgt.
// Die Linie hängt am Scrollen (scrub): Wer zurückscrollt, sieht sie zurückgehen; das erklärt
// Reihenfolge besser als jede Nummer. Ab 768 px waagerecht, darunter senkrecht.
// Ohne Bewegungswunsch oder ohne JavaScript ist alles sofort fertig gezeichnet.
// Farbe: --ablauf-farbe (Standard currentColor), Spur: --ablauf-spur.
const STIL = `
.gc-ab{--gc-ab-punkt:2.5rem;--gc-ab-luecke:2rem;list-style:none;margin:0;padding:0;display:grid;gap:var(--gc-ab-luecke)}
.gc-ab-schritt{position:relative;display:grid;grid-template-columns:var(--gc-ab-punkt) 1fr;gap:1rem;align-items:start}
.gc-ab-punkt{position:relative;z-index:1;width:var(--gc-ab-punkt);height:var(--gc-ab-punkt);border-radius:999px;display:grid;place-items:center;font-weight:600;font-variant-numeric:tabular-nums;background:var(--ablauf-farbe,currentColor)}
.gc-ab-punkt>span{color:var(--ablauf-punkt-text,Canvas)}
.gc-ab-spur,.gc-ab-linie{position:absolute;left:calc(var(--gc-ab-punkt)/2 - 1px);top:calc(var(--gc-ab-punkt)/2);width:2px;height:calc(100% + var(--gc-ab-luecke))}
.gc-ab-spur{background:var(--ablauf-spur,color-mix(in oklab,currentColor 15%,transparent))}
.gc-ab-linie{background:var(--ablauf-farbe,currentColor);transform-origin:50% 0}
@media (min-width:768px){
.gc-ab{grid-auto-flow:column;grid-auto-columns:1fr}
.gc-ab-schritt{grid-template-columns:1fr;grid-template-rows:var(--gc-ab-punkt) auto}
.gc-ab-spur,.gc-ab-linie{left:calc(var(--gc-ab-punkt)/2);top:calc(var(--gc-ab-punkt)/2 - 1px);height:2px;width:calc(100% + var(--gc-ab-luecke))}
.gc-ab-linie{transform-origin:0 50%}}`

export function Ablauf({
  schritte,
  className,
}: {
  schritte: { titel: string; text?: React.ReactNode }[]
  className?: string
}) {
  const ref = useRef<HTMLOListElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add({ bewegung: BEWEGUNG, quer: '(min-width: 768px)' }, (ctx) => {
        if (!ctx.conditions?.bewegung) return
        const achse = ctx.conditions.quer ? 'scaleX' : 'scaleY'
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top 75%', end: ctx.conditions.quer ? 'bottom 45%' : 'bottom 60%', scrub: 0.6 },
        })
        gsap.utils.toArray<HTMLElement>('.gc-ab-schritt', el).forEach((schritt) => {
          const punkt = schritt.querySelector('.gc-ab-punkt')
          const text = schritt.querySelector('.gc-ab-text')
          const linie = schritt.querySelector('.gc-ab-linie')
          tl.fromTo(punkt, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' })
          tl.fromTo(text, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, '<0.1')
          if (linie) tl.fromTo(linie, { [achse]: 0 }, { [achse]: 1, duration: 1 })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <ol ref={ref} className={['gc-ab', className].filter(Boolean).join(' ')}>
      <style href="gc-ablauf" precedence="default">{STIL}</style>
      {schritte.map((s, i) => (
        <li key={i} className="gc-ab-schritt">
          {i < schritte.length - 1 && (
            <>
              <span className="gc-ab-spur" aria-hidden />
              <span className="gc-ab-linie" aria-hidden />
            </>
          )}
          <span className="gc-ab-punkt" aria-hidden>
            <span>{i + 1}</span>
          </span>
          <div className="gc-ab-text">
            <h3>{s.titel}</h3>
            {s.text && <div>{s.text}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}

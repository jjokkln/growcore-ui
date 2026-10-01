'use client'

import { useRef, useState } from 'react'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { DAUER, KURVE, bewegungErlaubt, gsap, registriere, useGSAP } from '@/lib/motion/gsap'

registriere(DrawSVGPlugin)

// Knopf für eine Aktion, die dauert (Absenden, Speichern, Buchen). Vier Zustände:
//   ruhe    Beschriftung
//   laedt   Kreis dreht sich, Knopf gesperrt, aria-busy
//   fertig  Haken zeichnet sich (DrawSVG), „Gesendet“, nach 2,4 s zurück
//   fehler  kurzes Schütteln, „Erneut versuchen“
// Die Breite wird beim Klick festgehalten, damit der Knopf nicht schrumpft oder wächst, wenn
// der Text wechselt. Ergebnis wird über eine Live-Region vorgelesen.
//   <AktionKnopf beiAktion={() => speichern(daten)} fertigText="Gespeichert">Speichern</AktionKnopf>
// beiAktion wirft bei Fehlern (oder gibt ein abgelehntes Promise zurück).
type Zustand = 'ruhe' | 'laedt' | 'fertig' | 'fehler'

const STIL = `
.gc-ak{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:44px;padding:0 1.25rem;border-radius:999px;border:0;font:inherit;font-weight:500;cursor:pointer;background:var(--knopf-bg,CanvasText);color:var(--knopf-text,Canvas);transition:background-color var(--dauer-sm,.25s) var(--kurve-raus,ease-out),transform 120ms}
.gc-ak:active:not([disabled]){transform:scale(.98)}
.gc-ak[data-zustand=fertig]{background:var(--knopf-erfolg,#1f7a4d);color:#fff}
.gc-ak[data-zustand=fehler]{background:var(--knopf-fehler,#9f1d1d);color:#fff}
.gc-ak[disabled]{cursor:progress}
.gc-ak-kreis{width:1em;height:1em;border-radius:999px;border:2px solid currentColor;border-right-color:transparent;animation:gc-ak-dreh .7s linear infinite}
@keyframes gc-ak-dreh{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.gc-ak-kreis{animation:none;border-right-color:currentColor;opacity:.6}}
.gc-ak-haken{width:1.1em;height:1.1em}
`

export function AktionKnopf({
  beiAktion,
  children,
  fertigText = 'Gesendet',
  fehlerText = 'Erneut versuchen',
  className,
  type = 'button',
}: {
  beiAktion: () => Promise<unknown> | unknown
  children: React.ReactNode
  fertigText?: string
  fehlerText?: string
  className?: string
  type?: 'button' | 'submit'
}) {
  const [zustand, setZustand] = useState<Zustand>('ruhe')
  const knopf = useRef<HTMLButtonElement>(null)
  const inhalt = useRef<HTMLSpanElement>(null)

  // Bei jedem Zustandswechsel: neuer Inhalt steigt kurz auf; bei „fertig“ zeichnet sich der Haken,
  // bei „fehler“ schüttelt der Knopf einmal.
  useGSAP(
    () => {
      if (zustand === 'ruhe' || !bewegungErlaubt()) return
      gsap.fromTo(inhalt.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: DAUER.xs, ease: KURVE.raus })
      if (zustand === 'fertig') {
        gsap.fromTo(knopf.current!.querySelector('.gc-ak-haken path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: DAUER.md, ease: KURVE.raus, delay: 0.05 })
      }
      if (zustand === 'fehler') {
        gsap.fromTo(knopf.current, { x: 0 }, { keyframes: { x: [-6, 6, -4, 4, 0] }, duration: DAUER.md, ease: 'none' })
      }
    },
    { dependencies: [zustand], scope: knopf },
  )

  const klick = async () => {
    if (zustand === 'laedt') return
    const k = knopf.current
    if (k) k.style.minWidth = `${k.offsetWidth}px`
    setZustand('laedt')
    try {
      await beiAktion()
      setZustand('fertig')
      setTimeout(() => setZustand('ruhe'), 2400)
    } catch {
      setZustand('fehler')
    }
  }

  return (
    <>
      <style href="gc-aktion-knopf" precedence="default">{STIL}</style>
      <button
        ref={knopf}
        type={type}
        className={['gc-ak', className].filter(Boolean).join(' ')}
        data-zustand={zustand}
        disabled={zustand === 'laedt'}
        aria-busy={zustand === 'laedt'}
        onClick={klick}
      >
        <span ref={inhalt} style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
          {zustand === 'laedt' && <span className="gc-ak-kreis" aria-hidden />}
          {zustand === 'fertig' && (
            <svg className="gc-ak-haken" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {zustand === 'ruhe' || zustand === 'laedt' ? children : zustand === 'fertig' ? fertigText : fehlerText}
        </span>
      </button>
      <span role="status" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {zustand === 'fertig' ? fertigText : zustand === 'fehler' ? 'Fehlgeschlagen. ' + fehlerText : ''}
      </span>
    </>
  )
}

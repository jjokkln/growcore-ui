'use client'

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { DAUER, KURVE, bewegungErlaubt, gsap, useGSAP } from '@/lib/motion/gsap'

// Reiter (Tabs) nach WAI-ARIA: Pfeiltasten wechseln, Pos 1/Ende springen, der aktive Reiter ist
// sofort aktiv (automatische Aktivierung). Ein Strich unter dem aktiven Reiter gleitet zum neuen
// statt zu springen; so sieht man, woher man kommt. Bewegt wird nur transform (x, scaleX auf einer
// 1 px breiten Linie), nie width. Der neue Inhalt blendet kurz ein (DAUER.sm), der Platz darunter
// springt nicht, weil die Leiste fest steht.
// Gesteuert (aktiv + beiWechsel) oder ungesteuert (startReiter).
export type Reiter = { id: string; titel: string; inhalt: React.ReactNode }

const STIL = `
.gc-rt-leiste{position:relative;display:flex;gap:.25rem;border-bottom:1px solid var(--reiter-linie,color-mix(in oklab,currentColor 15%,transparent));overflow-x:auto;scrollbar-width:none}
.gc-rt-reiter{position:relative;padding:.75rem 1rem;min-height:44px;background:none;border:0;color:var(--reiter-leise,color-mix(in oklab,currentColor 65%,transparent));font:inherit;white-space:nowrap;cursor:pointer}
.gc-rt-reiter[aria-selected=true]{color:inherit;font-weight:600}
.gc-rt-reiter:hover{color:inherit}
.gc-rt-strich{position:absolute;left:0;bottom:-1px;width:1px;height:2px;background:var(--reiter-akzent,currentColor);transform-origin:0 50%;pointer-events:none}
.gc-rt-flaeche{padding-top:1.25rem}
`

export function Reiter({
  reiter,
  aktiv,
  beiWechsel,
  startReiter,
  label,
  className,
}: {
  reiter: Reiter[]
  aktiv?: string
  beiWechsel?: (id: string) => void
  startReiter?: string
  label: string
  className?: string
}) {
  const [eigener, setEigener] = useState(startReiter ?? reiter[0]?.id)
  const aktuell = aktiv ?? eigener
  const leiste = useRef<HTMLDivElement>(null)
  const strich = useRef<HTMLSpanElement>(null)
  const flaeche = useRef<HTMLDivElement>(null)
  const erster = useRef(true)
  const basis = useId()

  const wechseln = (id: string) => {
    if (aktiv === undefined) setEigener(id)
    beiWechsel?.(id)
  }

  // Strich an den aktiven Reiter: beim ersten Mal und bei Größenänderung sofort, sonst gleitend.
  const setzeStrich = (gleiten: boolean) => {
    const knopf = leiste.current?.querySelector<HTMLElement>('[aria-selected=true]')
    if (!knopf || !strich.current) return
    const ziel = { x: knopf.offsetLeft, scaleX: knopf.offsetWidth }
    if (gleiten && bewegungErlaubt()) gsap.to(strich.current, { ...ziel, duration: DAUER.sm, ease: KURVE.wechsel, overwrite: true })
    else gsap.set(strich.current, ziel)
  }

  useLayoutEffect(() => {
    const el = leiste.current
    if (!el) return
    const beobachter = new ResizeObserver(() => setzeStrich(false))
    beobachter.observe(el)
    return () => beobachter.disconnect()
  }, [])

  useGSAP(
    () => {
      setzeStrich(!erster.current)
      if (!erster.current && flaeche.current && bewegungErlaubt()) {
        gsap.fromTo(flaeche.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: DAUER.sm, ease: KURVE.raus })
      }
      erster.current = false
    },
    { dependencies: [aktuell] },
  )

  const taste = (e: React.KeyboardEvent, index: number) => {
    const ziel =
      e.key === 'ArrowRight' ? (index + 1) % reiter.length
      : e.key === 'ArrowLeft' ? (index - 1 + reiter.length) % reiter.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? reiter.length - 1
      : -1
    if (ziel < 0) return
    e.preventDefault()
    wechseln(reiter[ziel].id)
    leiste.current?.querySelectorAll<HTMLElement>('[role=tab]')[ziel]?.focus()
  }

  const aktiverReiter = reiter.find((r) => r.id === aktuell)

  return (
    <div className={className}>
      <style href="gc-reiter" precedence="default">{STIL}</style>
      <div ref={leiste} role="tablist" aria-label={label} className="gc-rt-leiste">
        {reiter.map((r, i) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            id={`${basis}-${r.id}`}
            aria-selected={r.id === aktuell}
            aria-controls={`${basis}-${r.id}-flaeche`}
            tabIndex={r.id === aktuell ? 0 : -1}
            className="gc-rt-reiter"
            onClick={() => wechseln(r.id)}
            onKeyDown={(e) => taste(e, i)}
          >
            {r.titel}
          </button>
        ))}
        <span ref={strich} className="gc-rt-strich" aria-hidden />
      </div>
      {aktiverReiter && (
        <div
          ref={flaeche}
          role="tabpanel"
          id={`${basis}-${aktiverReiter.id}-flaeche`}
          aria-labelledby={`${basis}-${aktiverReiter.id}`}
          tabIndex={0}
          className="gc-rt-flaeche"
        >
          {aktiverReiter.inhalt}
        </div>
      )}
    </div>
  )
}

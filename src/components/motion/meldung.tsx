'use client'

import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react'
import { Flip } from 'gsap/Flip'
import { DAUER, KURVE, bewegungErlaubt, gsap, registriere, useGSAP } from '@/lib/motion/gsap'

registriere(Flip)

// Kurze Rückmeldungen (Toasts) für Vorübergehendes: „Gespeichert“, „Link kopiert“, „Rückgängig“.
// Fehler, die man beheben muss, gehören ans Feld, nicht hierher (Handbuch „Rückmeldung“).
// Einbau: einmal <MeldungenRahmen> um die App, dann const zeige = useMeldung().
//   zeige({ text: 'Gespeichert' })
//   zeige({ text: 'Termin gelöscht', aktion: { label: 'Rückgängig', beiKlick: wiederherstellen } })
// Höchstens drei sichtbar, jede verschwindet nach 5 s (mit Aktion nach 8 s), pausiert bei Hover
// und Fokus. Rücken andere nach, gleiten sie per Flip an ihren Platz. Vorgelesen über eine
// Live-Region: Erfolg/Info höflich (status), Fehler sofort (alert).
type Art = 'erfolg' | 'info' | 'fehler'
type Eingabe = { text: string; art?: Art; aktion?: { label: string; beiKlick: () => void } }
type Meldung = Eingabe & { id: number }

const Kontext = createContext<(m: Eingabe) => void>(() => {})
export const useMeldung = () => useContext(Kontext)

const STIL = `
.gc-ml-region{position:fixed;z-index:60;right:1rem;bottom:1rem;display:flex;flex-direction:column;gap:.5rem;width:min(24rem,calc(100vw - 2rem));pointer-events:none}
@media (max-width:640px){.gc-ml-region{left:1rem;right:1rem;width:auto}}
.gc-ml{pointer-events:auto;display:flex;align-items:center;gap:.75rem;padding:.75rem .75rem .75rem 1rem;border-radius:.75rem;background:var(--meldung-bg,CanvasText);color:var(--meldung-text,Canvas);box-shadow:0 8px 24px -8px rgb(0 0 0 / .35)}
.gc-ml[data-art=fehler]{background:var(--meldung-fehler,#9f1d1d);color:#fff}
.gc-ml-text{flex:1;font-size:.9rem}
.gc-ml-knopf{min-height:36px;padding:0 .75rem;border-radius:999px;border:1px solid color-mix(in oklab,currentColor 35%,transparent);background:transparent;color:inherit;font:inherit;font-size:.85rem;font-weight:600;cursor:pointer}
.gc-ml-zu{min-width:36px;min-height:36px;border:0;background:transparent;color:inherit;opacity:.7;cursor:pointer;font-size:1.1rem}
`

function EineMeldung({ m, weg }: { m: Meldung; weg: (id: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const uhr = useRef<ReturnType<typeof setTimeout> | null>(null)
  const geht = useRef(false)

  const { contextSafe } = useGSAP(
    () => {
      if (bewegungErlaubt()) gsap.fromTo(ref.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DAUER.sm, ease: KURVE.raus })
    },
    { scope: ref },
  )

  const schliessen = () =>
    contextSafe(() => {
      if (geht.current) return
      geht.current = true
      if (uhr.current) clearTimeout(uhr.current)
      if (!bewegungErlaubt()) return weg(m.id)
      gsap.to(ref.current, { opacity: 0, y: 8, duration: DAUER.xs, ease: KURVE.rein, onComplete: () => weg(m.id) })
    })()

  const starten = () => {
    if (uhr.current) clearTimeout(uhr.current)
    uhr.current = setTimeout(schliessen, m.aktion ? 8000 : 5000)
  }
  const anhalten = () => {
    if (uhr.current) clearTimeout(uhr.current)
  }

  useLayoutEffect(() => {
    starten()
    return () => anhalten()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      data-meldung={m.id}
      data-flip-id={`meldung-${m.id}`}
      data-art={m.art ?? 'info'}
      className="gc-ml"
      onMouseEnter={anhalten}
      onMouseLeave={starten}
      onFocus={anhalten}
      onBlur={starten}
    >
      <span className="gc-ml-text">{m.text}</span>
      {m.aktion && (
        <button
          type="button"
          className="gc-ml-knopf"
          onClick={() => {
            m.aktion!.beiKlick()
            schliessen()
          }}
        >
          {m.aktion.label}
        </button>
      )}
      <button type="button" className="gc-ml-zu" aria-label="Meldung schließen" onClick={schliessen}>×</button>
    </div>
  )
}

export function MeldungenRahmen({ children }: { children: React.ReactNode }) {
  const [liste, setListe] = useState<Meldung[]>([])
  const region = useRef<HTMLDivElement>(null)
  const zustand = useRef<Flip.FlipState | null>(null)
  const zaehler = useRef(0)

  const merken = () => {
    if (region.current && bewegungErlaubt()) zustand.current = Flip.getState(region.current.querySelectorAll('[data-meldung]'))
  }

  const zeige = useCallback((m: Eingabe) => {
    merken()
    setListe((l) => [...l, { ...m, id: ++zaehler.current }].slice(-3))
  }, [])

  const weg = useCallback((id: number) => {
    merken()
    setListe((l) => l.filter((x) => x.id !== id))
  }, [])

  useLayoutEffect(() => {
    const z = zustand.current
    zustand.current = null
    if (!z || !region.current) return
    Flip.from(z, { targets: region.current.querySelectorAll('[data-meldung]'), duration: DAUER.sm, ease: KURVE.wechsel })
  }, [liste])

  const fehler = liste.filter((m) => m.art === 'fehler')
  const sonst = liste.filter((m) => m.art !== 'fehler')

  return (
    <Kontext.Provider value={zeige}>
      {children}
      <style href="gc-meldung" precedence="default">{STIL}</style>
      <div ref={region} className="gc-ml-region">
        <div role="status" aria-live="polite" style={{ display: 'contents' }}>
          {sonst.map((m) => <EineMeldung key={m.id} m={m} weg={weg} />)}
        </div>
        <div role="alert" style={{ display: 'contents' }}>
          {fehler.map((m) => <EineMeldung key={m.id} m={m} weg={weg} />)}
        </div>
      </div>
    </Kontext.Provider>
  )
}

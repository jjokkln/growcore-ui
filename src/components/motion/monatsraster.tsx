'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { Flip } from 'gsap/Flip'
import { DAUER, KURVE, bewegungErlaubt, gsap, registriere, useGSAP } from '@/lib/motion/gsap'

registriere(Flip)

// Monatskalender nach dem Handbuch-Kapitel „Kalender“: sechs Wochenzeilen (die Höhe springt nie),
// Woche ab Montag, heute mit Kontur, Auswahl als Fläche im Akzent.
// Bewegung: Beim Blättern gleitet das neue Raster aus der Blätterrichtung herein, die Auswahl
// gleitet per Flip von Zelle zu Zelle. Beides entfällt bei „Bewegung reduzieren“.
// Tastatur: Pfeile wandern, Bild auf/ab blättert, Pos 1/Ende springen an Wochenanfang/-ende,
// Enter/Leertaste wählt. Nur ein Tag ist in der Tab-Reihenfolge (roving tabindex).
// Farben: --kalender-akzent (Auswahl), --kalender-akzent-text, --kalender-linie, --kalender-leise.
export type Eintrag = { titel: string; farbe?: string }

const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONAT = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })
const LANG = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export function tagSchluessel(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function gleich(a: Date | null | undefined, b: Date) {
  return !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function plusTage(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

// 42 Tage ab dem Montag vor (oder am) Monatsersten.
function rasterTage(jahr: number, monat: number) {
  const erster = new Date(jahr, monat, 1)
  const versatz = (erster.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => new Date(jahr, monat, 1 - versatz + i))
}

const STIL = `
.gc-mr{--gc-mr-zelle:3.25rem;font-variant-numeric:tabular-nums}
.gc-mr-kopf{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.75rem}
.gc-mr-titel{font-weight:600;text-transform:capitalize}
.gc-mr-knoepfe{display:flex;gap:.25rem}
.gc-mr-knopf{min-width:2.5rem;height:2.5rem;padding:0 .75rem;border-radius:999px;border:1px solid var(--kalender-linie,color-mix(in oklab,currentColor 15%,transparent));background:transparent;color:inherit;cursor:pointer}
.gc-mr-knopf:hover{border-color:currentColor}
.gc-mr-raster{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;overflow:hidden}
.gc-mr-wt{font-size:.75rem;text-align:center;padding:.25rem 0;color:var(--kalender-leise,color-mix(in oklab,currentColor 60%,transparent))}
.gc-mr-zeile{display:contents}
.gc-mr-tag{position:relative;height:var(--gc-mr-zelle);border-radius:.5rem;display:grid;place-items:center;cursor:pointer;outline-offset:2px;user-select:none}
.gc-mr-tag:hover{background:color-mix(in oklab,currentColor 6%,transparent)}
.gc-mr-tag[data-fremd]{color:var(--kalender-leise,color-mix(in oklab,currentColor 45%,transparent))}
.gc-mr-tag[aria-disabled=true]{cursor:not-allowed;text-decoration:line-through;color:var(--kalender-leise,color-mix(in oklab,currentColor 40%,transparent))}
.gc-mr-tag[data-heute]::before{content:"";position:absolute;inset:3px;border-radius:.45rem;border:1.5px solid currentColor;pointer-events:none}
.gc-mr-zahl{position:relative;z-index:1}
.gc-mr-tag[aria-selected=true] .gc-mr-zahl{color:var(--kalender-akzent-text,Canvas);font-weight:600}
.gc-mr-markierung{position:absolute;inset:3px;border-radius:.45rem;background:var(--kalender-akzent,CanvasText)}
.gc-mr-punkte{position:absolute;bottom:.4rem;left:0;right:0;display:flex;justify-content:center;gap:3px;z-index:1}
.gc-mr-punkt{width:5px;height:5px;border-radius:999px;background:var(--kalender-punkt,currentColor)}
.gc-mr-mehr{font-size:.6rem;line-height:5px}
`

export function Monatsraster({
  wert,
  beiWahl,
  eintraege = {},
  nichtWaehlbar,
  startMonat,
  className,
}: {
  wert?: Date | null
  beiWahl?: (tag: Date) => void
  eintraege?: Record<string, Eintrag[]>
  nichtWaehlbar?: (tag: Date) => boolean
  startMonat?: Date
  className?: string
}) {
  const heute = useMemo(() => new Date(), [])
  const anfang = startMonat ?? wert ?? heute
  const [ansicht, setAnsicht] = useState({ jahr: anfang.getFullYear(), monat: anfang.getMonth() })
  const [fokus, setFokus] = useState<Date>(wert ?? heute)
  const richtung = useRef(0)
  const flipZustand = useRef<Flip.FlipState | null>(null)
  const perTastatur = useRef(false)
  const raster = useRef<HTMLDivElement>(null)
  const titelId = useId()

  const tage = useMemo(() => rasterTage(ansicht.jahr, ansicht.monat), [ansicht])
  const monatsName = MONAT.format(new Date(ansicht.jahr, ansicht.monat, 1))

  const blaettern = (schritt: number, ziel?: Date) => {
    richtung.current = schritt
    const neu = new Date(ansicht.jahr, ansicht.monat + schritt, 1)
    setAnsicht({ jahr: neu.getFullYear(), monat: neu.getMonth() })
    setFokus(ziel ?? new Date(neu.getFullYear(), neu.getMonth(), Math.min(fokus.getDate(), 28)))
  }

  const zuTag = (ziel: Date) => {
    const diff = (ziel.getFullYear() - ansicht.jahr) * 12 + ziel.getMonth() - ansicht.monat
    if (diff !== 0) blaettern(Math.sign(diff), ziel)
    else setFokus(ziel)
  }

  const waehlen = (tag: Date) => {
    if (nichtWaehlbar?.(tag)) return
    // Zustand der Markierung VOR dem Wechsel festhalten, Flip spielt nach dem Rendern ab.
    if (raster.current && bewegungErlaubt()) flipZustand.current = Flip.getState(raster.current.querySelectorAll('.gc-mr-markierung'))
    setFokus(tag)
    if (tag.getMonth() !== ansicht.monat) zuTag(tag)
    beiWahl?.(tag)
  }

  // Monatswechsel: neues Raster gleitet aus der Blätterrichtung herein.
  useGSAP(
    () => {
      const el = raster.current
      if (!el || richtung.current === 0 || !bewegungErlaubt()) return
      gsap.fromTo(
        el.querySelectorAll('.gc-mr-tag'),
        { x: 24 * richtung.current, opacity: 0 },
        { x: 0, opacity: 1, duration: DAUER.md, ease: KURVE.raus, stagger: { each: 0.004, from: richtung.current > 0 ? 'start' : 'end' } },
      )
      richtung.current = 0
    },
    { dependencies: [ansicht.jahr, ansicht.monat], scope: raster },
  )

  // Auswahl: Markierung gleitet von der alten zur neuen Zelle.
  const wertSchluessel = wert ? tagSchluessel(wert) : ''
  useGSAP(
    () => {
      const zustand = flipZustand.current
      flipZustand.current = null
      if (!zustand || !raster.current) return
      Flip.from(zustand, { targets: raster.current.querySelectorAll('.gc-mr-markierung'), duration: DAUER.sm, ease: KURVE.wechsel })
    },
    { dependencies: [wertSchluessel], scope: raster },
  )

  // Fokus nach Tastaturbewegung auf die neue Zelle setzen.
  const fokusSchluessel = tagSchluessel(fokus)
  useGSAP(
    () => {
      if (!perTastatur.current) return
      perTastatur.current = false
      raster.current?.querySelector<HTMLElement>(`[data-tag="${fokusSchluessel}"]`)?.focus()
    },
    { dependencies: [fokusSchluessel] },
  )

  const taste = (e: React.KeyboardEvent) => {
    const schritte: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    let ziel: Date | null = null
    if (e.key in schritte) ziel = plusTage(fokus, schritte[e.key])
    else if (e.key === 'PageUp') ziel = new Date(fokus.getFullYear(), fokus.getMonth() - 1, Math.min(fokus.getDate(), 28))
    else if (e.key === 'PageDown') ziel = new Date(fokus.getFullYear(), fokus.getMonth() + 1, Math.min(fokus.getDate(), 28))
    else if (e.key === 'Home') ziel = plusTage(fokus, -((fokus.getDay() + 6) % 7))
    else if (e.key === 'End') ziel = plusTage(fokus, 6 - ((fokus.getDay() + 6) % 7))
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      waehlen(fokus)
      return
    }
    if (!ziel) return
    e.preventDefault()
    perTastatur.current = true
    zuTag(ziel)
  }

  return (
    <div className={['gc-mr', className].filter(Boolean).join(' ')}>
      <style href="gc-monatsraster" precedence="default">{STIL}</style>
      <div className="gc-mr-kopf">
        <div id={titelId} className="gc-mr-titel" aria-live="polite">{monatsName}</div>
        <div className="gc-mr-knoepfe">
          <button type="button" className="gc-mr-knopf" onClick={() => blaettern(-1)} aria-label="Vorheriger Monat">‹</button>
          <button
            type="button"
            className="gc-mr-knopf"
            onClick={() => {
              const d = (heute.getFullYear() - ansicht.jahr) * 12 + heute.getMonth() - ansicht.monat
              if (d !== 0) blaettern(Math.sign(d), heute)
              else setFokus(heute)
            }}
          >
            Heute
          </button>
          <button type="button" className="gc-mr-knopf" onClick={() => blaettern(1)} aria-label="Nächster Monat">›</button>
        </div>
      </div>
      <div role="grid" aria-labelledby={titelId} ref={raster} className="gc-mr-raster" onKeyDown={taste}>
        <div role="row" className="gc-mr-zeile">
          {WOCHENTAGE.map((w) => (
            <div key={w} role="columnheader" className="gc-mr-wt">{w}</div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, z) => (
          <div key={z} role="row" className="gc-mr-zeile">
            {tage.slice(z * 7, z * 7 + 7).map((tag) => {
              const s = tagSchluessel(tag)
              const liste = eintraege[s] ?? []
              const gewaehlt = gleich(wert, tag)
              const gesperrt = nichtWaehlbar?.(tag) ?? false
              return (
                <div
                  key={s}
                  role="gridcell"
                  data-tag={s}
                  className="gc-mr-tag"
                  data-fremd={tag.getMonth() !== ansicht.monat || undefined}
                  data-heute={gleich(heute, tag) || undefined}
                  aria-selected={gewaehlt}
                  aria-disabled={gesperrt || undefined}
                  aria-label={`${LANG.format(tag)}${liste.length ? `, ${liste.length} ${liste.length === 1 ? 'Eintrag' : 'Einträge'}` : ''}`}
                  tabIndex={gleich(fokus, tag) ? 0 : -1}
                  onClick={() => waehlen(tag)}
                >
                  {gewaehlt && <span className="gc-mr-markierung" data-flip-id="auswahl" aria-hidden />}
                  <span className="gc-mr-zahl" aria-hidden>{tag.getDate()}</span>
                  {liste.length > 0 && (
                    <span className="gc-mr-punkte" aria-hidden>
                      {liste.slice(0, 3).map((e, i) => (
                        <span key={i} className="gc-mr-punkt" style={e.farbe ? { background: e.farbe } : undefined} />
                      ))}
                      {liste.length > 3 && <span className="gc-mr-mehr">+{liste.length - 3}</span>}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

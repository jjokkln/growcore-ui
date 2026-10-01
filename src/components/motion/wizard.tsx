'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { DAUER, KURVE, bewegungErlaubt, gsap, useGSAP } from '@/lib/motion/gsap'
import { AktionKnopf } from './aktion-knopf'

// Konfigurator in Schritten (Anfrage, Bedarf, Buchung). Aufgebaut aus einer Liste von Schritten,
// nicht aus Code je Projekt. Kann verzweigen (Antwort A führt zu Schritt X), merkt sich den
// Entwurf im Browser und zeigt vor dem Absenden eine Zusammenfassung mit „Ändern“.
// Bewegung: Schritte gleiten in Leserichtung (vor von rechts, zurück von links), der Fortschritt
// wächst als Balken (scaleX). Der Fokus springt auf die neue Frage, damit Tastatur und
// Screenreader mitkommen. Datenunabhängig: Absenden über beiAbsenden(antworten).
export type Option = { wert: string; titel: string; text?: string }
export type Schritt =
  | { id: string; typ: 'einfach'; frage: string; hilfe?: string; optionen: Option[]; weiterZu?: Record<string, string> }
  | { id: string; typ: 'mehrfach'; frage: string; hilfe?: string; optionen: Option[] }
  | { id: string; typ: 'felder'; frage: string; hilfe?: string; felder: { name: string; label: string; art?: 'text' | 'email' | 'tel' | 'textarea'; pflicht?: boolean }[] }

type Antworten = Record<string, string | string[] | Record<string, string>>

const STIL = `
.gc-wz{display:grid;gap:1.5rem;max-width:40rem}
.gc-wz-kopf{display:grid;gap:.5rem}
.gc-wz-stand{font-size:.85rem;color:var(--wizard-leise,color-mix(in oklab,currentColor 65%,transparent))}
.gc-wz-spur{height:4px;border-radius:999px;background:var(--wizard-spur,color-mix(in oklab,currentColor 12%,transparent));overflow:hidden}
.gc-wz-balken{height:100%;background:var(--wizard-akzent,CanvasText);transform-origin:0 50%}
.gc-wz-frage{font-size:1.4rem;font-weight:600;letter-spacing:-.01em;outline:none}
.gc-wz-hilfe{color:var(--wizard-leise,color-mix(in oklab,currentColor 65%,transparent));margin-top:.35rem}
.gc-wz-optionen{display:grid;gap:.6rem;border:0;padding:0;margin:0}
@media (min-width:640px){.gc-wz-optionen{grid-template-columns:1fr 1fr}}
.gc-wz-option{position:relative;display:grid;gap:.2rem;padding:1rem 1.1rem;border-radius:.75rem;border:1px solid var(--wizard-linie,color-mix(in oklab,currentColor 18%,transparent));cursor:pointer;transition:border-color var(--dauer-xs,.15s),background-color var(--dauer-xs,.15s)}
.gc-wz-option:hover{border-color:currentColor}
.gc-wz-option:has(input:checked){border-color:var(--wizard-akzent,CanvasText);background:color-mix(in oklab,var(--wizard-akzent,CanvasText) 7%,transparent);box-shadow:inset 0 0 0 1px var(--wizard-akzent,CanvasText)}
.gc-wz-option:has(input:focus-visible){outline:2px solid var(--wizard-akzent,CanvasText);outline-offset:2px}
.gc-wz-option input{position:absolute;opacity:0;pointer-events:none}
.gc-wz-option small{color:var(--wizard-leise,color-mix(in oklab,currentColor 65%,transparent))}
.gc-wz-feld{display:grid;gap:.4rem}
.gc-wz-feld input,.gc-wz-feld textarea{font:inherit;padding:.7rem .8rem;border-radius:.5rem;border:1px solid var(--wizard-linie,color-mix(in oklab,currentColor 25%,transparent));background:transparent;color:inherit}
.gc-wz-fuss{display:flex;justify-content:space-between;align-items:center;gap:1rem}
.gc-wz-knopf{min-height:44px;padding:0 1.25rem;border-radius:999px;font:inherit;font-weight:500;cursor:pointer;border:1px solid var(--wizard-linie,color-mix(in oklab,currentColor 25%,transparent));background:transparent;color:inherit}
.gc-wz-knopf[data-primaer]{border:0;background:var(--wizard-akzent,CanvasText);color:var(--wizard-akzent-text,Canvas)}
.gc-wz-knopf:disabled{opacity:.45;cursor:not-allowed}
.gc-wz-zusammen{display:grid;gap:.75rem;margin:0}
.gc-wz-zusammen div{display:grid;grid-template-columns:1fr auto;gap:.25rem 1rem;padding-bottom:.75rem;border-bottom:1px solid var(--wizard-linie,color-mix(in oklab,currentColor 12%,transparent))}
.gc-wz-zusammen dt{color:var(--wizard-leise,color-mix(in oklab,currentColor 65%,transparent));font-size:.85rem}
.gc-wz-zusammen dd{margin:0;grid-column:1}
.gc-wz-aendern{grid-row:1/3;grid-column:2;align-self:center;background:none;border:0;color:inherit;text-decoration:underline;cursor:pointer;font:inherit}
.gc-wz-hinweis{font-size:.85rem;display:flex;gap:.75rem;align-items:center;color:var(--wizard-leise,color-mix(in oklab,currentColor 65%,transparent))}
`

function lesbar(s: Schritt, a: Antworten[string] | undefined) {
  if (a === undefined) return '–'
  if (s.typ === 'felder') return Object.values(a as Record<string, string>).filter(Boolean).join(', ')
  const werte = Array.isArray(a) ? a : [a as string]
  return werte.map((w) => s.optionen.find((o) => o.wert === w)?.titel ?? w).join(', ')
}

export function Wizard({
  schritte,
  beiAbsenden,
  entwurfSchluessel,
  fertig,
}: {
  schritte: Schritt[]
  beiAbsenden: (antworten: Antworten) => Promise<void>
  entwurfSchluessel?: string
  fertig?: React.ReactNode
}) {
  const [pfad, setPfad] = useState<string[]>([schritte[0].id])
  const [antworten, setAntworten] = useState<Antworten>({})
  const [phase, setPhase] = useState<'fragen' | 'pruefen' | 'fertig'>('fragen')
  const [wiederhergestellt, setWiederhergestellt] = useState(false)
  const richtung = useRef(1)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  // Entwurf: Gespeichert wird bei jeder Änderung, angeboten wird er beim nächsten Besuch als
  // „Entwurf fortsetzen“. Gelesen wird über useSyncExternalStore (Server: kein Entwurf), damit die
  // erste Darstellung auf Server und Browser gleich ist.
  const entwurf = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return entwurfSchluessel ? localStorage.getItem(entwurfSchluessel) : null
      } catch {
        return null
      }
    },
    () => null,
  )
  const [angeboten, setAngeboten] = useState(true)
  const fortsetzen = () => {
    try {
      const e = JSON.parse(entwurf!)
      setPfad(e.pfad)
      setAntworten(e.antworten)
      setWiederhergestellt(true)
    } catch {}
    setAngeboten(false)
  }
  useEffect(() => {
    if (!entwurfSchluessel || phase === 'fertig' || Object.keys(antworten).length === 0) return
    try {
      localStorage.setItem(entwurfSchluessel, JSON.stringify({ pfad, antworten }))
    } catch {}
  }, [entwurfSchluessel, pfad, antworten, phase])

  const aktuell = schritte.find((s) => s.id === pfad[pfad.length - 1])!
  const index = schritte.indexOf(aktuell)
  const anteil = phase === 'fragen' ? (pfad.length - 1) / schritte.length : 1
  const antwort = antworten[aktuell.id]
  const beantwortet =
    aktuell.typ === 'felder'
      ? aktuell.felder.every((f) => !f.pflicht || ((antwort as Record<string, string>)?.[f.name] ?? '').trim())
      : aktuell.typ === 'mehrfach'
        ? Array.isArray(antwort) && antwort.length > 0
        : typeof antwort === 'string'

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const balken = el.querySelector('.gc-wz-balken')
      const inhalt = el.querySelector('[data-wz-inhalt]')
      if (!bewegungErlaubt()) {
        gsap.set(balken, { scaleX: anteil })
      } else {
        gsap.to(balken, { scaleX: anteil, duration: DAUER.md, ease: KURVE.wechsel })
        gsap.fromTo(inhalt, { x: 32 * richtung.current, opacity: 0 }, { x: 0, opacity: 1, duration: DAUER.md, ease: KURVE.raus })
      }
      el.querySelector<HTMLElement>('.gc-wz-frage')?.focus({ preventScroll: true })
    },
    { dependencies: [pfad.length, aktuell.id, phase], scope: ref },
  )

  const vor = () => {
    richtung.current = 1
    const naechster =
      aktuell.typ === 'einfach' && typeof antwort === 'string' && aktuell.weiterZu?.[antwort]
        ? aktuell.weiterZu[antwort]
        : schritte[index + 1]?.id
    if (naechster) setPfad([...pfad, naechster])
    else setPhase('pruefen')
  }
  const zurueck = () => {
    richtung.current = -1
    if (phase === 'pruefen') setPhase('fragen')
    else setPfad(pfad.slice(0, -1))
  }
  const springe = (schrittId: string) => {
    richtung.current = -1
    setPhase('fragen')
    setPfad(pfad.slice(0, pfad.indexOf(schrittId) + 1))
  }
  const setze = (wert: Antworten[string]) => setAntworten({ ...antworten, [aktuell.id]: wert })

  if (phase === 'fertig') {
    return (
      <div ref={ref} className="gc-wz" role="status">
        <style href="gc-wizard" precedence="default">{STIL}</style>
        <div data-wz-inhalt>{fertig ?? <p className="gc-wz-frage">Danke, die Anfrage ist angekommen.</p>}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className="gc-wz">
      <style href="gc-wizard" precedence="default">{STIL}</style>
      <div className="gc-wz-kopf">
        <div className="gc-wz-stand">
          {phase === 'pruefen' ? 'Zusammenfassung' : `Schritt ${pfad.length} von ${Math.max(schritte.length, pfad.length)}`}
        </div>
        <div className="gc-wz-spur" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(anteil * 100)} aria-label="Fortschritt">
          <div className="gc-wz-balken" style={{ transform: `scaleX(${anteil})` }} />
        </div>
        {angeboten && !wiederhergestellt && entwurf && Object.keys(antworten).length === 0 && (
          <div className="gc-wz-hinweis">
            Es gibt einen angefangenen Entwurf.
            <button type="button" className="gc-wz-aendern" style={{ gridRow: 'auto' }} onClick={fortsetzen}>
              Entwurf fortsetzen
            </button>
          </div>
        )}
        {wiederhergestellt && (
          <div className="gc-wz-hinweis">
            Ihr Entwurf ist wiederhergestellt.
            <button type="button" className="gc-wz-aendern" style={{ gridRow: 'auto' }} onClick={() => { setPfad([schritte[0].id]); setAntworten({}); setWiederhergestellt(false) }}>
              Neu beginnen
            </button>
          </div>
        )}
      </div>

      <div data-wz-inhalt>
        {phase === 'pruefen' ? (
          <>
            <h3 className="gc-wz-frage" tabIndex={-1}>Stimmt alles?</h3>
            <dl className="gc-wz-zusammen" style={{ marginTop: '1rem' }}>
              {pfad.map((sid) => {
                const s = schritte.find((x) => x.id === sid)!
                return (
                  <div key={sid}>
                    <dt>{s.frage}</dt>
                    <dd>{lesbar(s, antworten[sid])}</dd>
                    <button type="button" className="gc-wz-aendern" onClick={() => springe(sid)}>Ändern</button>
                  </div>
                )
              })}
            </dl>
          </>
        ) : (
          <fieldset className="gc-wz-optionen" style={{ display: 'block' }}>
            <legend style={{ padding: 0 }}>
              <h3 className="gc-wz-frage" tabIndex={-1}>{aktuell.frage}</h3>
              {aktuell.hilfe && <p className="gc-wz-hilfe">{aktuell.hilfe}</p>}
            </legend>
            <div className="gc-wz-optionen" style={{ marginTop: '1rem' }}>
              {aktuell.typ === 'felder'
                ? aktuell.felder.map((f) => {
                    const werte = (antwort as Record<string, string>) ?? {}
                    const props = {
                      id: `${id}-${f.name}`,
                      required: f.pflicht,
                      value: werte[f.name] ?? '',
                      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setze({ ...werte, [f.name]: e.target.value }),
                    }
                    return (
                      <div key={f.name} className="gc-wz-feld" style={f.art === 'textarea' ? { gridColumn: '1 / -1' } : undefined}>
                        <label htmlFor={props.id}>{f.label}{!f.pflicht && <span style={{ opacity: 0.65 }}> (optional)</span>}</label>
                        {f.art === 'textarea' ? <textarea rows={4} {...props} /> : <input type={f.art ?? 'text'} {...props} />}
                      </div>
                    )
                  })
                : aktuell.optionen.map((o) => {
                    const mehr = aktuell.typ === 'mehrfach'
                    const liste = Array.isArray(antwort) ? antwort : []
                    const an = mehr ? liste.includes(o.wert) : antwort === o.wert
                    return (
                      <label key={o.wert} className="gc-wz-option">
                        <input
                          type={mehr ? 'checkbox' : 'radio'}
                          name={`${id}-${aktuell.id}`}
                          checked={an}
                          onChange={() => setze(mehr ? (an ? liste.filter((w) => w !== o.wert) : [...liste, o.wert]) : o.wert)}
                          onClick={(e) => {
                            // Mausklick bei Einfachauswahl: direkt weiter. Tastatur (auch Pfeile, die
                            // ebenfalls ein click auslösen, aber mit detail 0) wählt nur, weiter mit „Weiter“.
                            if (!mehr && e.detail > 0) setTimeout(() => vorNach(o.wert), 180)
                          }}
                        />
                        <span style={{ fontWeight: 600 }}>{o.titel}</span>
                        {o.text && <small>{o.text}</small>}
                      </label>
                    )
                  })}
            </div>
          </fieldset>
        )}
      </div>

      <div className="gc-wz-fuss">
        <button type="button" className="gc-wz-knopf" onClick={zurueck} disabled={pfad.length === 1 && phase === 'fragen'}>
          Zurück
        </button>
        {phase === 'pruefen' ? (
          <AktionKnopf
            fertigText="Abgeschickt"
            beiAktion={async () => {
              await beiAbsenden(antworten)
              try {
                if (entwurfSchluessel) localStorage.removeItem(entwurfSchluessel)
              } catch {}
              setTimeout(() => { richtung.current = 1; setPhase('fertig') }, 900)
            }}
          >
            Anfrage absenden
          </AktionKnopf>
        ) : (
          <button type="button" className="gc-wz-knopf" data-primaer onClick={vor} disabled={!beantwortet}>
            Weiter
          </button>
        )}
      </div>
    </div>
  )

  // Einfachauswahl per Klick: Wert ist schon gesetzt, die Verzweigung braucht ihn aber sofort.
  function vorNach(wert: string) {
    richtung.current = 1
    const s = aktuell
    const naechster = s.typ === 'einfach' && s.weiterZu?.[wert] ? s.weiterZu[wert] : schritte[index + 1]?.id
    if (naechster) setPfad((p) => (p[p.length - 1] === s.id ? [...p, naechster] : p))
    else setPhase('pruefen')
  }
}

'use client'

import { useId, useRef, useState } from 'react'
import { Flip } from 'gsap/Flip'
import { DAUER, KURVE, STAFFEL, bewegungErlaubt, gsap, registriere, useGSAP } from '@/lib/motion/gsap'
import { Monatsraster } from './monatsraster'
import { AktionKnopf } from './aktion-knopf'

registriere(Flip)

// Terminbuchung nach dem Vorbild des Projektraums: links die Terminart, in der Mitte der Monat,
// nach der Wahl eines Tages fährt rechts die Spalte mit Uhrzeiten auf. Eine gewählte Uhrzeit
// teilt sich in „Uhrzeit | Weiter“. Danach ersetzt das Formular Kalender und Uhrzeiten in
// derselben Karte, am Ende steht die Bestätigung.
// Datenunabhängig: Freie Zeiten liefert ladeZeiten(tag), das Buchen übernimmt beiBuchung(daten).
// Bewegung: Aufklappen der Uhrzeitenspalte per Flip (die Karte wird breiter, ohne zu springen),
// Uhrzeiten gestaffelt von links, Schrittwechsel als Gleiten. Auf dem Handy untereinander.
export type Terminart = { titel: string; dauer: string; ort?: string; beschreibung?: string }
export type Buchung = { tag: Date; zeit: string; name: string; email: string; notiz?: string }

const DATUM = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

const STIL = `
.gc-tb{display:grid;gap:1.5rem;border:1px solid var(--buchung-linie,color-mix(in oklab,currentColor 14%,transparent));border-radius:1rem;padding:1.5rem;background:var(--buchung-bg,transparent)}
@media (min-width:1024px){
.gc-tb{grid-template-columns:13rem 22rem;width:fit-content}
.gc-tb[data-spalten="3"]{grid-template-columns:13rem 22rem 11rem}
.gc-tb[data-schritt=formular],.gc-tb[data-schritt=fertig]{grid-template-columns:13rem 34rem}
.gc-tb-info{border-right:1px solid var(--buchung-linie,color-mix(in oklab,currentColor 14%,transparent));padding-right:1.5rem}}
.gc-tb-art{font-size:1.25rem;font-weight:600;margin:.25rem 0 .75rem}
.gc-tb-meta{display:grid;gap:.35rem;font-size:.9rem;color:var(--buchung-leise,color-mix(in oklab,currentColor 65%,transparent))}
.gc-tb-zeiten{display:grid;gap:.5rem;align-content:start;max-height:24rem;overflow-y:auto}
.gc-tb-zeitkopf{font-weight:600;font-size:.9rem;margin-bottom:.25rem}
.gc-tb-paar{display:grid;grid-template-columns:1fr;gap:.5rem}
.gc-tb-paar[data-aktiv]{grid-template-columns:1fr 1fr}
.gc-tb-zeit,.gc-tb-weiter{min-height:44px;border-radius:.5rem;font:inherit;font-variant-numeric:tabular-nums;cursor:pointer}
.gc-tb-zeit{border:1px solid var(--buchung-linie,color-mix(in oklab,currentColor 20%,transparent));background:transparent;color:inherit}
.gc-tb-zeit:hover{border-color:currentColor}
.gc-tb-paar[data-aktiv] .gc-tb-zeit{background:color-mix(in oklab,currentColor 10%,transparent)}
.gc-tb-weiter{border:0;background:var(--buchung-akzent,CanvasText);color:var(--buchung-akzent-text,Canvas);font-weight:600}
.gc-tb-leer{font-size:.9rem;color:var(--buchung-leise,color-mix(in oklab,currentColor 65%,transparent))}
.gc-tb-form{display:grid;gap:1rem}
.gc-tb-feld{display:grid;gap:.4rem}
.gc-tb-feld input,.gc-tb-feld textarea{font:inherit;padding:.65rem .75rem;border-radius:.5rem;border:1px solid var(--buchung-linie,color-mix(in oklab,currentColor 25%,transparent));background:transparent;color:inherit}
.gc-tb-zurueck{justify-self:start;background:none;border:0;padding:.25rem 0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}
.gc-tb-falle{position:absolute;left:-9999px}
`

export function Terminbuchung({
  art,
  ladeZeiten,
  istBuchbar,
  beiBuchung,
  datenschutz,
}: {
  art: Terminart
  ladeZeiten: (tag: Date) => Promise<string[]>
  istBuchbar?: (tag: Date) => boolean
  beiBuchung: (b: Buchung) => Promise<void>
  datenschutz?: React.ReactNode
}) {
  const [tag, setTag] = useState<Date | null>(null)
  const [zeiten, setZeiten] = useState<string[] | null>(null)
  const [zeit, setZeit] = useState<string | null>(null)
  const [schritt, setSchritt] = useState<'wahl' | 'formular' | 'fertig'>('wahl')
  const [daten, setDaten] = useState({ name: '', email: '', notiz: '', falle: '' })
  const karte = useRef<HTMLDivElement>(null)
  const flip = useRef<Flip.FlipState | null>(null)
  const id = useId()

  // Layoutwechsel festhalten, bevor React umbaut; nach dem Rendern gleitet alles an den neuen Platz.
  const merken = () => {
    if (karte.current && bewegungErlaubt()) flip.current = Flip.getState(karte.current.querySelectorAll('[data-flip-id]'))
  }

  const tagWaehlen = async (t: Date) => {
    merken()
    setTag(t)
    setZeit(null)
    setZeiten(null)
    const liste = await ladeZeiten(t)
    setZeiten(liste)
  }

  useGSAP(
    () => {
      const z = flip.current
      flip.current = null
      if (z && karte.current) {
        Flip.from(z, { targets: karte.current.querySelectorAll('[data-flip-id]'), duration: DAUER.md, ease: KURVE.stark, nested: true, absolute: false })
      }
    },
    { dependencies: [tag?.getTime(), zeit, schritt], scope: karte },
  )

  // Uhrzeiten gestaffelt von links, sobald sie da sind.
  useGSAP(
    () => {
      if (!zeiten?.length || !bewegungErlaubt()) return
      gsap.fromTo('.gc-tb-paar', { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: DAUER.sm, ease: KURVE.raus, stagger: { each: STAFFEL / 2, amount: 0.3 } })
    },
    { dependencies: [zeiten], scope: karte },
  )

  // Schrittwechsel: neuer Inhalt gleitet von rechts (vor) herein.
  useGSAP(
    () => {
      if (schritt === 'wahl' || !bewegungErlaubt()) return
      gsap.fromTo('[data-schritt-inhalt]', { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: DAUER.md, ease: KURVE.raus })
    },
    { dependencies: [schritt], scope: karte },
  )

  const wechsel = (s: typeof schritt) => {
    merken()
    setSchritt(s)
  }

  return (
    <div ref={karte} className="gc-tb" data-schritt={schritt} data-spalten={tag && schritt === 'wahl' ? 3 : 2}>
      <style href="gc-terminbuchung" precedence="default">{STIL}</style>

      <div className="gc-tb-info" data-flip-id="info">
        <div className="gc-tb-art">{art.titel}</div>
        <div className="gc-tb-meta">
          <span>{art.dauer}</span>
          {art.ort && <span>{art.ort}</span>}
          {tag && zeit && <span style={{ color: 'inherit', fontWeight: 600 }}>{DATUM.format(tag)}, {zeit} Uhr</span>}
        </div>
        {art.beschreibung && <p className="gc-tb-meta" style={{ marginTop: '1rem' }}>{art.beschreibung}</p>}
      </div>

      {schritt === 'wahl' && (
        <>
          <div data-flip-id="monat">
            <Monatsraster wert={tag} beiWahl={tagWaehlen} nichtWaehlbar={(t) => (istBuchbar ? !istBuchbar(t) : false)} />
          </div>
          {tag && (
            <div className="gc-tb-zeiten" data-flip-id="zeiten" aria-live="polite">
              <div className="gc-tb-zeitkopf">{DATUM.format(tag)}</div>
              {zeiten === null && <div className="gc-tb-leer">Freie Zeiten werden geladen …</div>}
              {zeiten?.length === 0 && <div className="gc-tb-leer">An diesem Tag ist nichts mehr frei. Bitte einen anderen Tag wählen.</div>}
              {zeiten?.map((z) => (
                <div key={z} className="gc-tb-paar" data-aktiv={zeit === z || undefined}>
                  <button type="button" className="gc-tb-zeit" data-flip-id={`zeit-${z}`} aria-pressed={zeit === z} onClick={() => { merken(); setZeit(z) }}>
                    {z}
                  </button>
                  {zeit === z && (
                    <button type="button" className="gc-tb-weiter" data-flip-id="weiter" onClick={() => wechsel('formular')}>
                      Weiter
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {schritt === 'formular' && tag && zeit && (
        <form className="gc-tb-form" data-schritt-inhalt onSubmit={(e) => e.preventDefault()}>
          <button type="button" className="gc-tb-zurueck" onClick={() => wechsel('wahl')}>Zurück zur Terminwahl</button>
          <div className="gc-tb-feld">
            <label htmlFor={`${id}-name`}>Name</label>
            <input id={`${id}-name`} required autoComplete="name" value={daten.name} onChange={(e) => setDaten({ ...daten, name: e.target.value })} />
          </div>
          <div className="gc-tb-feld">
            <label htmlFor={`${id}-mail`}>E-Mail</label>
            <input id={`${id}-mail`} type="email" required autoComplete="email" value={daten.email} onChange={(e) => setDaten({ ...daten, email: e.target.value })} />
          </div>
          <div className="gc-tb-feld">
            <label htmlFor={`${id}-notiz`}>Worum geht es? <span style={{ opacity: 0.65 }}>(optional)</span></label>
            <textarea id={`${id}-notiz`} rows={3} value={daten.notiz} onChange={(e) => setDaten({ ...daten, notiz: e.target.value })} />
          </div>
          <input className="gc-tb-falle" tabIndex={-1} autoComplete="off" aria-hidden value={daten.falle} onChange={(e) => setDaten({ ...daten, falle: e.target.value })} />
          {datenschutz && <p className="gc-tb-meta">{datenschutz}</p>}
          <div>
            <AktionKnopf
              fertigText="Gebucht"
              beiAktion={async () => {
                if (!daten.name.trim() || !/^\S+@\S+\.\S+$/.test(daten.email)) throw new Error('unvollständig')
                if (!daten.falle) await beiBuchung({ tag, zeit, name: daten.name, email: daten.email, notiz: daten.notiz || undefined })
                setTimeout(() => wechsel('fertig'), 900)
              }}
            >
              Termin buchen
            </AktionKnopf>
          </div>
        </form>
      )}

      {schritt === 'fertig' && tag && zeit && (
        <div data-schritt-inhalt role="status">
          <div className="gc-tb-art">Der Termin steht.</div>
          <p className="gc-tb-meta">
            {DATUM.format(tag)}, {zeit} Uhr. Die Bestätigung geht an {daten.email}, mit Link zum Verschieben oder Absagen.
          </p>
        </div>
      )}
    </div>
  )
}

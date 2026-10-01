'use client'

import { useRef, useState } from 'react'
import { Aufklappen } from '@/components/motion/aufklappen'
import { Schublade } from '@/components/motion/schublade'
import { Zahl } from '@/components/motion/zahl'
import { Platzhalter, PlatzhalterBereich, PlatzhalterText } from '@/components/motion/platzhalter'
import { useFlipListe } from '@/hooks/use-flip-liste'
import { useMagnet } from '@/hooks/use-magnet'
import { useNeigung } from '@/hooks/use-neigung'
import { feiern } from '@/lib/motion/feiern'

const knopf = 'rounded-full bg-tinte px-5 py-2.5 text-sm font-medium text-papier transition-colors hover:bg-akzent'
const knopfLeise = 'rounded-full border border-linie bg-flaeche px-4 py-2 text-sm hover:border-tinte'

export function ZahlDemo() {
  const [wert, setWert] = useState(12480)
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="rounded-xl border border-linie bg-flaeche p-6">
        <div className="text-sm text-leise">Anfragen im Jahr (Beispiel)</div>
        <Zahl wert={wert} className="mt-2 text-4xl font-semibold tracking-tight" />
        <button className={`${knopfLeise} mt-4`} onClick={() => setWert((w) => w + Math.round(Math.random() * 4000))}>
          Wert ändern
        </button>
      </div>
      <div className="rounded-xl border border-linie bg-flaeche p-6">
        <div className="text-sm text-leise">Quote</div>
        <Zahl wert={0.874} format={{ style: 'percent', maximumFractionDigits: 1 }} className="mt-2 text-4xl font-semibold tracking-tight" />
      </div>
      <div className="rounded-xl border border-linie bg-flaeche p-6">
        <div className="text-sm text-leise">Volumen</div>
        <Zahl wert={1250000} format={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} className="mt-2 text-4xl font-semibold tracking-tight" />
      </div>
    </div>
  )
}

const FRAGEN = [
  { f: 'Wie lange dauert ein Projekt?', a: 'Die Antwort öffnet sich auf ihre natürliche Höhe, ohne feste Pixelwerte. Geschlossen ist der Inhalt inert, also weder fokussierbar noch vorgelesen.' },
  { f: 'Was passiert bei „Bewegung reduzieren“?', a: 'Der Bereich springt sofort auf oder zu. Jeder Baustein prüft das selbst über gsap.matchMedia().' },
  { f: 'Warum GSAP und nicht CSS?', a: 'CSS kann height: auto nur in Chromium animieren (interpolate-size). GSAP kann es überall.' },
]

export function AufklappenDemo() {
  const [offen, setOffen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-linie rounded-xl border border-linie bg-flaeche">
      {FRAGEN.map((q, i) => (
        <div key={i}>
          <button
            className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
            aria-expanded={offen === i}
            aria-controls={`frage-${i}`}
            onClick={() => setOffen(offen === i ? null : i)}
          >
            {q.f}
            <span aria-hidden className="text-leise transition-transform duration-300 ease-raus" style={{ transform: offen === i ? 'rotate(45deg)' : undefined }}>+</span>
          </button>
          <Aufklappen offen={offen === i} id={`frage-${i}`}>
            <p className="px-5 pb-5 text-leise">{q.a}</p>
          </Aufklappen>
        </div>
      ))}
    </div>
  )
}

export function SchubladeDemo() {
  const [offen, setOffen] = useState(false)
  return (
    <>
      <button className={knopf} onClick={() => setOffen(true)}>Menü öffnen</button>
      <Schublade offen={offen} beiSchliessen={() => setOffen(false)} titel="Hauptmenü" panelClassName="bg-papier p-6">
        <div className="mb-8 flex items-center justify-between">
          <span className="font-semibold">Menü</span>
          <button className={knopfLeise} onClick={() => setOffen(false)} aria-label="Menü schließen">Schließen</button>
        </div>
        <ul className="grid gap-1 text-2xl font-medium tracking-tight">
          {['Leistungen', 'Projekte', 'Ablauf', 'Über uns', 'Kontakt'].map((p) => (
            <li key={p} data-schublade-punkt>
              <a href="#" className="block rounded-md py-2 hover:text-akzent" onClick={() => setOffen(false)}>{p}</a>
            </li>
          ))}
        </ul>
      </Schublade>
    </>
  )
}

const PROJEKTE = [
  { id: 1, name: 'Kanzlei-Website', art: 'Website' },
  { id: 2, name: 'Kundenportal', art: 'App' },
  { id: 3, name: 'Werkstatt-Termine', art: 'App' },
  { id: 4, name: 'Praxis-Landingpage', art: 'Website' },
  { id: 5, name: 'Angebotsrechner', art: 'Werkzeug' },
  { id: 6, name: 'Recruiting-Seite', art: 'Website' },
  { id: 7, name: 'Fuhrpark-Verwaltung', art: 'App' },
  { id: 8, name: 'Konfigurator', art: 'Werkzeug' },
]

export function FlipDemo() {
  const [filter, setFilter] = useState('Alle')
  const liste = useRef<HTMLUListElement>(null)
  useFlipListe(liste, filter, '[data-flip-id]')
  const sichtbar = PROJEKTE.filter((p) => filter === 'Alle' || p.art === filter)
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter">
        {['Alle', 'Website', 'App', 'Werkzeug'].map((f) => (
          <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm ${filter === f ? 'border-tinte bg-tinte text-papier' : 'border-linie bg-flaeche'}`}>
            {f}
          </button>
        ))}
      </div>
      <ul ref={liste} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {sichtbar.map((p) => (
          <li key={p.id} data-flip-id={p.id} className="rounded-xl border border-linie bg-flaeche p-4">
            <div className="text-xs text-leise">{p.art}</div>
            <div className="mt-6 font-medium">{p.name}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ZeigerDemo() {
  const magnet = useMagnet<HTMLButtonElement>(0.35)
  const karte = useNeigung<HTMLDivElement>(6)
  const knopfFeiern = useRef<HTMLButtonElement>(null)
  return (
    <div className="grid items-center gap-8 sm:grid-cols-3">
      <div className="grid place-items-center rounded-xl border border-linie bg-flaeche py-14">
        <button ref={magnet} className={knopf}>Projekt anfragen</button>
        <p className="mt-4 text-xs text-leise">useMagnet</p>
      </div>
      <div ref={karte} className="rounded-xl border border-linie bg-gradient-to-br from-flaeche to-papier p-8 shadow-sm">
        <div className="text-xs text-leise">useNeigung</div>
        <div className="mt-10 text-xl font-semibold tracking-tight">Leistungskarte</div>
        <p className="mt-1 text-sm text-leise">neigt sich höchstens 6° zum Zeiger</p>
      </div>
      <div className="grid place-items-center rounded-xl border border-linie bg-flaeche py-14">
        <button ref={knopfFeiern} className={knopfLeise} onClick={() => feiern(knopfFeiern.current, ['#15171b', '#2747c7', '#e0a526', '#2f8f6b', '#e3e1da'])}>
          Auftrag abschicken
        </button>
        <p className="mt-4 text-xs text-leise">feiern()</p>
      </div>
    </div>
  )
}

export function PlatzhalterDemo() {
  const [laedt, setLaedt] = useState(true)
  return (
    <div>
      <button className={`${knopfLeise} mb-5`} onClick={() => setLaedt((l) => !l)}>{laedt ? 'Daten zeigen' : 'Wieder laden'}</button>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) =>
          laedt ? (
            <PlatzhalterBereich key={i} className="rounded-xl border border-linie bg-flaeche p-5">
              <Platzhalter className="h-32 w-full" />
              <Platzhalter className="mt-4 h-5 w-2/3" />
              <PlatzhalterText zeilen={2} className="mt-3" />
            </PlatzhalterBereich>
          ) : (
            <div key={i} className="rounded-xl border border-linie bg-flaeche p-5">
              <div className="h-32 rounded-md bg-gradient-to-br from-akzent/20 to-akzent/5" />
              <div className="mt-4 font-medium">Projekt {i + 1}</div>
              <p className="mt-2 text-sm text-leise">Der Platzhalter hatte genau diese Form, deshalb springt beim Wechsel nichts.</p>
            </div>
          ),
        )}
      </div>
    </div>
  )
}

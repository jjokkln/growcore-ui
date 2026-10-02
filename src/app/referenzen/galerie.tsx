'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { useFlipListe } from '@/hooks/use-flip-liste'
import type { Kategorie, Referenz } from './_daten'

type Eintrag = Referenz & { bild: string | null }

const PROJEKT_TEXT: Record<string, string> = {
  aktiv: 'In Arbeit',
  pausiert: 'Pausiert',
  abgeschlossen: 'Abgeschlossen',
  'ohne Karte': 'Ohne Projektkarte',
}

function adresse(url: string) {
  const host = new URL(url).hostname.replace(/^www\./, '')
  return { host, vorschau: host.endsWith('.vercel.app') }
}

// Filter nach Branche; die Karten gleiten beim Wechsel an ihren neuen Platz (flip-liste).
// Ohne Filter stehen die Karten nach Kategorie gruppiert, mit Filter nur die eine Gruppe.
export function Galerie({ kategorien, eintraege }: { kategorien: Kategorie[]; eintraege: Eintrag[] }) {
  const [aktiv, setAktiv] = useState<string>('alle')
  const liste = useRef<HTMLDivElement>(null)
  useFlipListe(liste, aktiv, '[data-flip-id]')

  const belegt = kategorien.filter((k) => eintraege.some((e) => e.kategorie === k.id))
  const gruppen = belegt.filter((k) => aktiv === 'alle' || k.id === aktiv)

  return (
    <>
      <div role="group" aria-label="Nach Branche filtern" className="mb-10 flex flex-wrap gap-2">
        {[{ id: 'alle', titel: 'Alle' }, ...belegt].map((k) => {
          const anzahl = k.id === 'alle' ? eintraege.length : eintraege.filter((e) => e.kategorie === k.id).length
          return (
            <button
              key={k.id}
              type="button"
              aria-pressed={aktiv === k.id}
              onClick={() => setAktiv(k.id)}
              className="rounded-full border border-linie bg-flaeche px-3.5 py-1.5 text-sm transition-colors hover:border-tinte aria-pressed:border-tinte aria-pressed:bg-tinte aria-pressed:text-papier"
            >
              {k.titel} <span className="tabular-nums opacity-60">{anzahl}</span>
            </button>
          )
        })}
      </div>

      <div ref={liste} className="space-y-14">
        {gruppen.map((k) => (
          <section key={k.id} aria-labelledby={`kat-${k.id}`}>
            <h2 id={`kat-${k.id}`} className="mb-5 text-xl font-semibold tracking-tight">{k.titel}</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eintraege.filter((e) => e.kategorie === k.id).map((e) => {
                const { host, vorschau } = adresse(e.url)
                return (
                  <li key={e.id} data-flip-id={e.id} className="group overflow-hidden rounded-xl border border-linie bg-flaeche">
                    <a href={e.url} target="_blank" rel="noreferrer" className="block focus-visible:outline-2 focus-visible:outline-offset-2">
                      <div className="aspect-[16/10] overflow-hidden border-b border-linie bg-papier">
                        {e.bild ? (
                          <Image
                            src={e.bild}
                            alt={`Startseite von ${e.kunde}`}
                            width={1440}
                            height={900}
                            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-sm text-leise">Kein Vorschaubild</div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-semibold">{e.kunde}</h3>
                          <span className="shrink-0 text-xs text-leise">{PROJEKT_TEXT[e.projekt] ?? e.projekt}</span>
                        </div>
                        <p className="mt-2 text-sm text-leise">{e.beschreibung}</p>
                        <p className="mt-4 flex items-center gap-2 font-mono text-xs text-leise">
                          <span className="truncate">{host}</span>
                          {vorschau && <span className="shrink-0 whitespace-nowrap rounded-full border border-linie px-2 py-0.5 font-sans">Vorschau</span>}
                          <span aria-hidden className="ml-auto transition-transform group-hover:translate-x-0.5">↗</span>
                        </p>
                      </div>
                    </a>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}

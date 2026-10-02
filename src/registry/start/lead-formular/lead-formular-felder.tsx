'use client'

// Die Felder des Kontaktformulars. Absenden über den Baustein AktionKnopf (laden, Haken, Schütteln).
//
// - Beschriftungen sind mit den Feldern verknüpft, Fehler hängen per aria-describedby am Feld,
//   der erste fehlerhafte Eintrag bekommt den Fokus (Pflichtkern 7).
// - Honigfalle: ein für Menschen unsichtbares Feld, das nur Bots ausfüllen.
// - Zeitfalle: Zeitpunkt, zu dem das Formular im Browser bereit war, geht mit. Wer schneller
//   abschickt, als ein Mensch tippen kann, wird verworfen (lib/lead/schutz.ts).
// - Die Seite, von der die Anfrage kommt, geht als `quelle` mit.
//
// Einbau: nicht direkt, sondern über <LeadFormular /> (components/lead-formular.tsx).
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { leadAbsenden } from '@/app/actions/lead'
import { AktionKnopf } from '@/components/motion/aktion-knopf'
import {
  HONIGFALLE_FELD,
  LEAD_GRENZEN,
  ZEITFALLE_FELD,
  type LeadErgebnis,
  type LeadFeld,
} from '@/lib/lead/schema'

const FELD =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive'

export function LeadFormularFelder({ hinweis, className }: { hinweis: ReactNode; className?: string }) {
  const id = useId()
  const pfad = usePathname()
  const formular = useRef<HTMLFormElement>(null)
  const bereitSeit = useRef(0)
  const [ergebnis, setErgebnis] = useState<LeadErgebnis | null>(null)

  // Erst im Browser gesetzt, nach dem Mounten: Ein Zeitstempel aus dem Render stünde bei statischen
  // Seiten auf dem Zeitpunkt des Builds.
  useEffect(() => {
    bereitSeit.current = Date.now()
  }, [])

  const fehler = ergebnis && !ergebnis.ok ? (ergebnis.felder ?? {}) : {}
  const feldId = (feld: string) => `${id}-${feld}`
  const fehlerId = (feld: LeadFeld) => (fehler[feld] ? `${feldId(feld)}-fehler` : undefined)
  const beschreibung = (feld: LeadFeld, ...weitere: (string | undefined)[]) =>
    [fehlerId(feld), ...weitere].filter(Boolean).join(' ') || undefined

  async function senden() {
    const form = formular.current
    if (!form) throw new Error('Formular fehlt')
    // Der Browser zeigt die Lücke und setzt den Fokus; der Knopf schüttelt einmal.
    if (!form.reportValidity()) throw new Error('Eingabe unvollständig')

    const daten = new FormData(form)
    daten.set(ZEITFALLE_FELD, String(bereitSeit.current))
    daten.set('quelle', pfad)

    const antwort = await leadAbsenden(daten)
    setErgebnis(antwort)
    if (!antwort.ok) {
      const erstes = Object.keys(antwort.felder ?? {})[0]
      const element = erstes ? form.elements.namedItem(erstes) : null
      if (element instanceof HTMLElement) element.focus()
      throw new Error(antwort.meldung)
    }
    form.reset()
  }

  return (
    <form
      ref={formular}
      onSubmit={(ereignis) => ereignis.preventDefault()}
      className={['grid gap-5', className].filter(Boolean).join(' ')}
    >
      <div className="grid gap-1.5">
        <label htmlFor={feldId('name')} className="text-sm font-medium">
          Name <span aria-hidden>*</span>
        </label>
        <input
          id={feldId('name')}
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={LEAD_GRENZEN.name}
          aria-invalid={Boolean(fehler.name)}
          aria-describedby={beschreibung('name')}
          className={FELD}
        />
        {fehler.name ? (
          <p id={fehlerId('name')} className="text-sm text-destructive">
            {fehler.name}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor={feldId('email')} className="text-sm font-medium">
            E-Mail
          </label>
          <input
            id={feldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LEAD_GRENZEN.email}
            aria-invalid={Boolean(fehler.email)}
            aria-describedby={beschreibung('email', `${id}-rueckweg`)}
            className={FELD}
          />
          {fehler.email ? (
            <p id={fehlerId('email')} className="text-sm text-destructive">
              {fehler.email}
            </p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor={feldId('telefon')} className="text-sm font-medium">
            Telefon
          </label>
          <input
            id={feldId('telefon')}
            name="telefon"
            type="tel"
            autoComplete="tel"
            maxLength={LEAD_GRENZEN.telefon}
            aria-invalid={Boolean(fehler.telefon)}
            aria-describedby={beschreibung('telefon', `${id}-rueckweg`)}
            className={FELD}
          />
          {fehler.telefon ? (
            <p id={fehlerId('telefon')} className="text-sm text-destructive">
              {fehler.telefon}
            </p>
          ) : null}
        </div>
        <p id={`${id}-rueckweg`} className="-mt-3 text-sm text-muted-foreground sm:col-span-2">
          E-Mail oder Telefon, damit wir Ihnen antworten können.
        </p>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={feldId('nachricht')} className="text-sm font-medium">
          Ihre Nachricht <span aria-hidden>*</span>
        </label>
        <textarea
          id={feldId('nachricht')}
          name="nachricht"
          required
          minLength={10}
          maxLength={LEAD_GRENZEN.nachricht}
          rows={6}
          aria-invalid={Boolean(fehler.nachricht)}
          aria-describedby={beschreibung('nachricht')}
          className={FELD}
        />
        {fehler.nachricht ? (
          <p id={fehlerId('nachricht')} className="text-sm text-destructive">
            {fehler.nachricht}
          </p>
        ) : null}
      </div>

      {/* Honigfalle: aus dem Bild geschoben statt display:none, das erkennen manche Bots. */}
      <div aria-hidden style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={feldId(HONIGFALLE_FELD)}>Bitte leer lassen</label>
        <input id={feldId(HONIGFALLE_FELD)} name={HONIGFALLE_FELD} tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-sm text-muted-foreground">{hinweis}</p>

      <div className="flex flex-wrap items-center gap-4">
        <AktionKnopf type="submit" beiAktion={senden} fertigText="Gesendet">
          Anfrage senden
        </AktionKnopf>
        <span className="text-sm text-muted-foreground">
          <span aria-hidden>*</span> Pflichtfeld
        </span>
      </div>

      {ergebnis && !ergebnis.ok ? (
        <p role="alert" className="text-sm text-destructive">
          {ergebnis.meldung}
        </p>
      ) : null}
      {ergebnis?.ok ? (
        <p role="status" className="text-sm">
          Danke, Ihre Nachricht ist angekommen. Wir melden uns bei Ihnen.
        </p>
      ) : null}
    </form>
  )
}

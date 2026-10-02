'use client'

// Das Einwilligungs-Banner. Was es einhält (§ 25 TDDDG, Art. 7 DSGVO, Pflichtkern 3):
// - „Ablehnen“ und „Akzeptieren“ sind derselbe Knopf: gleiche Größe, Schrift und Farbe (KNOPF).
//   Keine Vorauswahl, kein grauer Mini-Link.
// - Es nennt vor der Entscheidung jeden Empfänger, direkt aus site-config.dienste.
// - Es verdeckt nichts Wichtiges: unten angedockt statt vollflächig, und auf Impressum,
//   Datenschutz und Barrierefreiheit geht es nicht von selbst auf.
// - Widerruf: Der Knopf im Fuß (ConsentEinstellungenKnopf) öffnet es wieder.
// Gibt es nichts einzuwilligen (keine Kategorie in site-config), rendert es nichts.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useId, useState, type KeyboardEvent } from 'react'
import { FREIE_PFADE, KATEGORIEN, type Auswahl } from '@/lib/consent'
import { useConsent } from '@/components/consent/consent-provider'

const KNOPF =
  'inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-border bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:flex-none'

export function ConsentBanner() {
  const consent = useConsent()
  const pfad = usePathname() ?? '/'
  const [details, setDetails] = useState(false)
  const titelId = useId()
  const textId = useId()
  // Stabile Ref-Funktion: fokussiert einmal beim Öffnen, nicht bei jedem Render erneut.
  const fokussieren = useCallback((el: HTMLHeadingElement | null) => el?.focus(), [])

  const freierPfad = FREIE_PFADE.some((p) => pfad === p || pfad.startsWith(`${p}/`))
  const offen = consent.manuellOffen || (consent.ersteAbfrage && !freierPfad)
  if (!offen || KATEGORIEN.length === 0) return null

  // Escape schließt nur die selbst geöffneten Einstellungen. Die Erstabfrage braucht eine Antwort.
  function taste(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape' && consent.manuellOffen) {
      e.preventDefault()
      consent.einstellungenSchliessen()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titelId}
      aria-describedby={textId}
      onKeyDown={taste}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[calc(100dvh-1.5rem)] max-w-2xl overflow-y-auto rounded-lg border border-border bg-background p-5 text-foreground shadow-lg sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <h2
        id={titelId}
        tabIndex={-1}
        // Selbst geöffnet: Fokus in das Banner, damit Tastatur und Screenreader dort landen.
        ref={consent.manuellOffen ? fokussieren : undefined}
        className="text-lg font-semibold outline-none"
      >
        Ihre Einwilligung
      </h2>
      <p id={textId} className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Wir möchten Dienste einbinden, die Daten an Dritte übertragen:{' '}
        {KATEGORIEN.map((k) => `${k.titel} (${k.dienste.join(', ')})`).join(', ')}. Das geschieht
        nur mit Ihrer Zustimmung. Ihre Entscheidung können Sie jederzeit über
        „Datenschutz-Einstellungen“ am Seitenende ändern.
      </p>

      {details ? (
        <Einstellungen
          auswahl={consent.auswahl}
          speichern={consent.speichern}
          ablehnen={consent.nurNotwendige}
          annehmen={consent.allesAnnehmen}
        />
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className={KNOPF} onClick={consent.nurNotwendige}>
            Ablehnen
          </button>
          <button type="button" className={KNOPF} onClick={consent.allesAnnehmen}>
            Akzeptieren
          </button>
          <button
            type="button"
            className="min-h-11 px-1 text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={() => setDetails(true)}
          >
            Einstellungen
          </button>
        </div>
      )}

      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link href="/datenschutz" className="underline underline-offset-4">
          Datenschutzerklärung
        </Link>
        <Link href="/impressum" className="underline underline-offset-4">
          Impressum
        </Link>
        {consent.manuellOffen && consent.auswahl !== null ? (
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={consent.einstellungenSchliessen}
          >
            Schließen, Auswahl behalten
          </button>
        ) : null}
      </p>
    </div>
  )
}

/** Je Kategorie ein Schalter. Eigene Komponente, damit der Startwert ohne Effekt gesetzt wird. */
function Einstellungen({
  auswahl,
  speichern,
  ablehnen,
  annehmen,
}: {
  auswahl: Auswahl | null
  speichern: (a: Auswahl) => void
  ablehnen: () => void
  annehmen: () => void
}) {
  const [entwurf, setEntwurf] = useState<Auswahl>(() =>
    Object.fromEntries(KATEGORIEN.map((k) => [k.id, auswahl?.[k.id] === true])),
  )

  return (
    <>
      <fieldset className="mt-5 space-y-4">
        <legend className="sr-only">Kategorien</legend>
        <div className="text-sm">
          <p className="font-medium">Notwendig (immer aktiv)</p>
          <p className="mt-1 text-muted-foreground">
            Auslieferung der Seite und das Speichern dieser Entscheidung in Ihrem Browser.
          </p>
        </div>
        {KATEGORIEN.map((k) => (
          <label key={k.id} className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-5 shrink-0 accent-primary"
              checked={entwurf[k.id] === true}
              onChange={(e) => setEntwurf({ ...entwurf, [k.id]: e.target.checked })}
            />
            <span>
              <span className="font-medium">{k.titel}</span>
              <span className="mt-1 block text-muted-foreground">
                {k.beschreibung} Anbieter: {k.dienste.join(', ')}.
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className={KNOPF} onClick={ablehnen}>
          Ablehnen
        </button>
        <button type="button" className={KNOPF} onClick={() => speichern(entwurf)}>
          Auswahl speichern
        </button>
        <button type="button" className={KNOPF} onClick={annehmen}>
          Akzeptieren
        </button>
      </div>
    </>
  )
}

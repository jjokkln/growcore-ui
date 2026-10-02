'use client'

// Einwilligungs-Schranke für eingebettete Inhalte („Zwei-Klick-Lösung“). Vor der Einwilligung
// geht kein einziger Request an den Anbieter, auch kein Vorschaubild: Das übertrüge die
// IP-Adresse genauso (Pflichtkern 3). Der Platzhalter nennt den Empfänger, damit die Einwilligung
// informiert ist (Art. 4 Nr. 11 DSGVO), und bietet zwei Wege: nur diesen Inhalt laden oder die
// Kategorie dauerhaft erlauben.
//
// Einbau:
//   <YoutubeVideo id="dQw4w9WgXcQ" titel="Imagefilm" />
//   <Karte src="https://www.openstreetmap.org/export/embed.html?bbox=…" titel="Anfahrt"
//          alternativeHref="https://www.openstreetmap.org/?mlat=…" />
//   <EinbettungsSchranke anbieter="Vimeo" empfaenger="Vimeo.com, Inc. (USA)" titel="…">
//     <iframe … />
//   </EinbettungsSchranke>
// Den Anbieter vorher in site-config.dienste (videos bzw. karten) eintragen, sonst fehlt er in
// Banner und Datenschutzerklärung.
import { useState, type ReactNode } from 'react'
import { KATEGORIEN, type KategorieId } from '@/lib/consent'
import { useConsent } from '@/components/consent/consent-provider'

const KNOPF =
  'inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export function EinbettungsSchranke({
  anbieter,
  empfaenger,
  titel,
  kategorie = 'externeMedien',
  alternativeHref,
  seitenverhaeltnis = '16 / 9',
  children,
}: {
  /** Name wie im Banner, z. B. „YouTube“. */
  anbieter: string
  /** Wer die Daten bekommt, z. B. „Google Ireland Limited“. */
  empfaenger: string
  titel: string
  kategorie?: KategorieId
  /** Direktlink zum Anbieter, für alle, die nicht einwilligen wollen. */
  alternativeHref?: string
  seitenverhaeltnis?: string
  children: ReactNode
}) {
  const { erlaubt, hydriert, speichern, auswahl } = useConsent()
  const [einmal, setEinmal] = useState(false)
  // Kategorie ohne Dienst in site-config: Banner und Datenschutz kennen den Anbieter nicht.
  // Dann gibt es nur „Einmal laden“, und im Entwicklungsmodus eine laute Meldung.
  const bekannt = KATEGORIEN.find((k) => k.id === kategorie)
  if (!bekannt && process.env.NODE_ENV !== 'production') {
    console.error(`[einbettung] ${anbieter} fehlt in site-config.dienste (Kategorie ${kategorie}).`)
  }

  if (hydriert && (einmal || erlaubt(kategorie))) {
    return (
      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: seitenverhaeltnis }}>
        {children}
      </div>
    )
  }

  return (
    <div
      className="flex w-full items-center justify-center rounded-lg border border-border bg-muted p-5 text-center"
      style={{ aspectRatio: seitenverhaeltnis }}
    >
      <div className="max-w-md">
        <p className="text-sm font-medium text-foreground">{titel}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Dieser Inhalt liegt bei {anbieter}. Beim Laden werden Ihre IP-Adresse und
          Geräteinformationen an {empfaenger} übertragen.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button type="button" className={KNOPF} onClick={() => setEinmal(true)}>
            Einmal laden
          </button>
          {bekannt ? (
            <button
              type="button"
              className={KNOPF}
              onClick={() => speichern({ ...auswahl, [kategorie]: true })}
            >
              {bekannt.titel} immer erlauben
            </button>
          ) : null}
        </div>
        {alternativeHref ? (
          <a
            href={alternativeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm underline underline-offset-4"
          >
            Stattdessen bei {anbieter} öffnen
          </a>
        ) : null}
      </div>
    </div>
  )
}

const IFRAME = 'absolute inset-0 size-full border-0'

/** YouTube über youtube-nocookie.com. Auch diese Adresse überträgt die IP, daher die Schranke. */
export function YoutubeVideo({ id, titel }: { id: string; titel: string }) {
  return (
    <EinbettungsSchranke
      anbieter="YouTube"
      empfaenger="Google Ireland Limited"
      titel={titel}
      alternativeHref={`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`}
    >
      <iframe
        className={IFRAME}
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
        title={titel}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </EinbettungsSchranke>
  )
}

/** Eingebettete Karte, Standard OpenStreetMap. Für Google Maps anbieter/empfaenger setzen. */
export function Karte({
  src,
  titel,
  alternativeHref,
  anbieter = 'OpenStreetMap',
  empfaenger = 'OpenStreetMap Foundation (Vereinigtes Königreich)',
  seitenverhaeltnis = '4 / 3',
}: {
  src: string
  titel: string
  alternativeHref?: string
  anbieter?: string
  empfaenger?: string
  seitenverhaeltnis?: string
}) {
  return (
    <EinbettungsSchranke
      anbieter={anbieter}
      empfaenger={empfaenger}
      titel={titel}
      alternativeHref={alternativeHref}
      seitenverhaeltnis={seitenverhaeltnis}
    >
      <iframe className={IFRAME} src={src} title={titel} loading="lazy" referrerPolicy="no-referrer" />
    </EinbettungsSchranke>
  )
}

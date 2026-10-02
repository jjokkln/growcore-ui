'use client'

// Hält die Einwilligung für die ganze Seite. Die Entscheidung liegt im localStorage, also einem
// externen Speicher, und wird deshalb mit useSyncExternalStore gelesen: kein setState im Effekt,
// kein zusätzlicher Render, und sie bleibt über Tabs hinweg gleich. Der Server kennt keine
// Einwilligung, dort gilt „nichts erlaubt“ (fail-closed).
//
// Einbau in app/layout.tsx:
//   <body>
//     <ConsentProvider>            ← optional beiEntscheidung={einwilligungNachweisen}
//       {children}
//       <ConsentBanner />
//     </ConsentProvider>
//   </body>
// Im Fuß neben Impressum und Datenschutz: <ConsentEinstellungenKnopf /> (Widerruf, Art. 7 Abs. 3).
// Etwas freischalten: useEinwilligung('statistik') oder <NurMitEinwilligung kategorie="…">.
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  ALLE_ANGENOMMEN,
  CONSENT_VERSION,
  EINWILLIGUNG_NOETIG,
  NUR_NOTWENDIGE,
  STAND,
  abonniere,
  auswerten,
  besucherKennung,
  leseRoh,
  speichere,
  type Auswahl,
  type EntscheidungsMeldung,
  type KategorieId,
} from '@/lib/consent'

type ConsentWert = {
  /** Gespeicherte Auswahl; null = noch keine Entscheidung. */
  auswahl: Auswahl | null
  /** false bis zur Hydration. Vorher wird nichts geladen und kein Banner gezeigt. */
  hydriert: boolean
  /** Erstabfrage fällig: es gibt etwas einzuwilligen und noch keine Entscheidung. */
  ersteAbfrage: boolean
  /** Über den Knopf im Fuß geöffnet. */
  manuellOffen: boolean
  erlaubt: (kategorie: KategorieId) => boolean
  speichern: (auswahl: Auswahl) => void
  allesAnnehmen: () => void
  nurNotwendige: () => void
  einstellungenOeffnen: () => void
  einstellungenSchliessen: () => void
}

const ConsentKontext = createContext<ConsentWert | null>(null)

const nichts = () => null
const nieAbonnieren = () => () => {}
const wahr = () => true
const falsch = () => false

export function ConsentProvider({
  children,
  beiEntscheidung,
}: {
  children: ReactNode
  /**
   * Wird nach jeder Entscheidung aufgerufen, z. B. mit der Server-Action einwilligungNachweisen
   * (Baustein einwilligung-nachweis). Läuft nebenher: Der Klick wartet nicht darauf.
   */
  beiEntscheidung?: (meldung: EntscheidungsMeldung) => unknown
}) {
  const roh = useSyncExternalStore(abonniere, leseRoh, nichts)
  const hydriert = useSyncExternalStore(nieAbonnieren, wahr, falsch)
  const auswahl = useMemo(() => auswerten(roh), [roh])
  const [manuellOffen, setManuellOffen] = useState(false)

  const speichern = useCallback(
    (neu: Auswahl) => {
      speichere(neu)
      setManuellOffen(false)
      if (!beiEntscheidung) return
      const kennung = besucherKennung()
      if (!kennung) return
      // Widerruf ist ein eigener Vorgang (Art. 7 Abs. 3): Wer vorher etwas erlaubt hatte und
      // jetzt nichts mehr, widerruft. Unterschieden wird am vorherigen Zustand.
      const willigtEin = Object.values(neu).some(Boolean)
      const hatteEingewilligt = auswahl !== null && Object.values(auswahl).some(Boolean)
      const meldung: EntscheidungsMeldung = {
        entscheidung: willigtEin ? 'erteilt' : hatteEingewilligt ? 'widerrufen' : 'abgelehnt',
        version: CONSENT_VERSION,
        stand: STAND,
        kategorien: neu,
        besucherKennung: kennung,
      }
      Promise.resolve()
        .then(() => beiEntscheidung(meldung))
        .catch((fehler) => console.error('[einwilligung] Nachweis fehlgeschlagen', fehler))
    },
    [auswahl, beiEntscheidung],
  )

  const wert = useMemo<ConsentWert>(
    () => ({
      auswahl,
      hydriert,
      ersteAbfrage: hydriert && EINWILLIGUNG_NOETIG && auswahl === null,
      manuellOffen,
      erlaubt: (kategorie) => auswahl?.[kategorie] === true,
      speichern,
      allesAnnehmen: () => speichern(ALLE_ANGENOMMEN),
      nurNotwendige: () => speichern(NUR_NOTWENDIGE),
      einstellungenOeffnen: () => setManuellOffen(true),
      einstellungenSchliessen: () => setManuellOffen(false),
    }),
    [auswahl, hydriert, manuellOffen, speichern],
  )

  return <ConsentKontext.Provider value={wert}>{children}</ConsentKontext.Provider>
}

export function useConsent(): ConsentWert {
  const kontext = useContext(ConsentKontext)
  if (!kontext) throw new Error('useConsent braucht einen <ConsentProvider> darüber.')
  return kontext
}

/** true erst nach aktiver Zustimmung zu dieser Kategorie. Auf dem Server immer false. */
export function useEinwilligung(kategorie: KategorieId): boolean {
  return useConsent().erlaubt(kategorie)
}

/** Rendert die Kinder erst nach Einwilligung, z. B. das Analytics-Skript. */
export function NurMitEinwilligung({
  kategorie,
  children,
}: {
  kategorie: KategorieId
  children: ReactNode
}) {
  return useEinwilligung(kategorie) ? children : null
}

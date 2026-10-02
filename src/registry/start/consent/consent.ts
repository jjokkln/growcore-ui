import { siteConfig } from '@/lib/site-config'

// Kern der Einwilligung nach § 25 TDDDG: welche Kategorien es gibt, welche Fassung gilt, und wie
// die Entscheidung im Browser liegt. Ohne Direktive, damit Server (Datenschutz, Server-Action des
// Nachweises) und Client dieselben Konstanten lesen (stack-standards: Kennungen nie in 'use client').
//
// Die Kategorien kommen aus site-config.dienste: Steht dort ein Anbieter für analytics, videos
// oder karten, gibt es die Kategorie, sonst nicht. Gibt es keine, erscheint gar kein Banner, denn
// es gibt nichts einzuwilligen. So ändern sich Banner und Datenschutzerklärung im selben Schritt
// (Pflichtkern 4).
//
// Neu fragen: STAND enthält CONSENT_VERSION und die Liste der Empfänger. Kommt ein Anbieter dazu,
// ändert sich STAND, und jede gespeicherte Einwilligung verfällt von selbst (Art. 4 Nr. 11 DSGVO:
// eine Einwilligung deckt nur die Empfänger, die beim Klick genannt waren). CONSENT_VERSION von
// Hand hochzählen, wenn sich der Text ändert, ohne dass ein Anbieter dazukommt.
//
// Einbau: siehe consent-provider.tsx.

/** Von Hand hochzählen, wenn sich Bannertext oder Zweck ändern. */
export const CONSENT_VERSION = 1

/** Danach wird neu gefragt. Die DSK empfiehlt spätestens nach zwölf Monaten. */
export const GUELTIGKEIT_TAGE = 180

export type KategorieId = 'statistik' | 'externeMedien'
export type Auswahl = Partial<Record<KategorieId, boolean>>
export type Entscheidung = 'erteilt' | 'abgelehnt' | 'widerrufen'

export type Kategorie = {
  id: KategorieId
  titel: string
  beschreibung: string
  /** Anbieter aus site-config.dienste, so wie sie im Banner genannt werden. */
  dienste: string[]
}

/** Was der Nachweis bekommt (einwilligung-nachweis). Keine IP, keine URL, kein Browser. */
export type EntscheidungsMeldung = {
  entscheidung: Entscheidung
  version: number
  stand: string
  kategorien: Auswahl
  besucherKennung: string
}

function anbieter(wert: string | false | null): string[] {
  return typeof wert === 'string' && wert.trim() ? [wert.trim()] : []
}

const ALLE_KATEGORIEN: Kategorie[] = [
  {
    id: 'statistik',
    titel: 'Statistik',
    beschreibung:
      'Reichweitenmessung: welche Seiten wie oft aufgerufen werden. Hilft uns, die Seite zu verbessern.',
    dienste: anbieter(siteConfig.dienste.analytics),
  },
  {
    id: 'externeMedien',
    titel: 'Externe Medien',
    beschreibung:
      'Eingebettete Videos und Karten. Beim Laden werden Ihre IP-Adresse und Geräteinformationen an den Anbieter übertragen.',
    dienste: [...anbieter(siteConfig.dienste.videos), ...anbieter(siteConfig.dienste.karten)],
  },
]

/** Nur die Kategorien, für die es einen echten Dienst gibt. */
export const KATEGORIEN: Kategorie[] = ALLE_KATEGORIEN.filter((k) => k.dienste.length > 0)

/** false: Die Seite bindet nichts Einwilligungspflichtiges ein, Banner und Knopf entfallen. */
export const EINWILLIGUNG_NOETIG = KATEGORIEN.length > 0

/** Fassung der Einwilligung: Version plus Empfänger je Kategorie. */
export const STAND = `${CONSENT_VERSION}:${KATEGORIEN.map((k) => `${k.id}=${k.dienste.join(',')}`).join('|')}`

export const NUR_NOTWENDIGE: Auswahl = Object.fromEntries(KATEGORIEN.map((k) => [k.id, false]))
export const ALLE_ANGENOMMEN: Auswahl = Object.fromEntries(KATEGORIEN.map((k) => [k.id, true]))

/** Rechtsseiten, auf denen das Banner nicht von selbst aufgeht (Pflichtkern 3). */
export const FREIE_PFADE = ['/impressum', '/datenschutz', '/barrierefreiheit']

// ── Speicher im Browser ─────────────────────────────────────────────────────

const SCHLUESSEL = 'einwilligung'
const KENNUNG_SCHLUESSEL = 'einwilligung-kennung'
const GEAENDERT = 'einwilligung:geaendert'

type Gespeichert = { stand: string; zeitpunkt: number; kategorien: Auswahl }

/**
 * Snapshot für useSyncExternalStore: die gespeicherte Zeichenkette, wenn sie noch gilt, sonst
 * null. Eine Zeichenkette und kein Objekt, weil React den Snapshot mit Object.is vergleicht; ein
 * neu geparstes Objekt wäre bei jedem Aufruf „anders“ und löste eine Endlosschleife aus.
 */
export function leseRoh(): string | null {
  try {
    const roh = localStorage.getItem(SCHLUESSEL)
    if (!roh) return null
    const daten = JSON.parse(roh) as Gespeichert
    const abgelaufen = Date.now() > daten.zeitpunkt + GUELTIGKEIT_TAGE * 24 * 60 * 60 * 1000
    if (daten.stand !== STAND || abgelaufen) {
      localStorage.removeItem(SCHLUESSEL)
      return null
    }
    return roh
  } catch {
    // Kaputte Daten oder gesperrter Speicher: wie „noch keine Entscheidung“.
    return null
  }
}

/** Macht aus dem Snapshot die Auswahl. Nur bekannte Kategorien, nur echte true-Werte. */
export function auswerten(roh: string | null): Auswahl | null {
  if (!roh) return null
  try {
    const { kategorien } = JSON.parse(roh) as Gespeichert
    return Object.fromEntries(KATEGORIEN.map((k) => [k.id, kategorien?.[k.id] === true]))
  } catch {
    return null
  }
}

export function speichere(kategorien: Auswahl): void {
  try {
    const daten: Gespeichert = { stand: STAND, zeitpunkt: Date.now(), kategorien }
    localStorage.setItem(SCHLUESSEL, JSON.stringify(daten))
  } catch {
    // Privater Modus: Die Entscheidung gilt dann nur, bis die Seite neu lädt.
  }
  // storage feuert nur in anderen Tabs, dieses Ereignis meldet die Änderung im eigenen.
  window.dispatchEvent(new Event(GEAENDERT))
}

export function abonniere(melden: () => void): () => void {
  window.addEventListener(GEAENDERT, melden)
  window.addEventListener('storage', melden)
  return () => {
    window.removeEventListener(GEAENDERT, melden)
    window.removeEventListener('storage', melden)
  }
}

/**
 * Zufallskennung für den Nachweis, ohne Personenbezug: Sie beantwortet nur „wurde dieselbe
 * Einwilligung später widerrufen“. Wer den Speicher leert, bekommt eine neue. Ist der Speicher
 * gesperrt, gibt es keine Kennung und damit keinen Nachweis; eine erfundene wäre ein Nachweis
 * über jemand anderen.
 */
export function besucherKennung(): string | null {
  try {
    const vorhanden = localStorage.getItem(KENNUNG_SCHLUESSEL)
    if (vorhanden && /^[a-f0-9]{32}$/.test(vorhanden)) return vorhanden
    const neu = crypto.randomUUID().replace(/-/g, '')
    localStorage.setItem(KENNUNG_SCHLUESSEL, neu)
    return neu
  } catch {
    return null
  }
}

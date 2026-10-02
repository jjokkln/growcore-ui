const LOKAL = 'http://localhost:3000'

// Unter welcher Adresse die Seite in Produktion erreichbar ist. Steht in canonical, og:url,
// sitemap, robots und den strukturierten Daten.
//
// Warum nicht eingetragen: Eine falsche Adresse ist schlimmer als keine. Ein canonical auf eine
// Domain, die noch etwas anderes ausliefert, schickt Suchmaschinen aktiv weg. Deshalb kommt die
// Adresse von Vercel (VERCEL_PROJECT_PRODUCTION_URL = Produktionsadresse des Projekts, zieht nach,
// sobald die eigene Domain verbunden ist). NEXT_PUBLIC_SITE_URL sticht für Sonderfälle.
// Nie VERCEL_URL nehmen: Das ist die Adresse des einzelnen Deployments und wechselt bei jedem Push.
//
// Harter Abbruch: Läuft der Build auf Vercel und es gibt keine gültige https-Adresse, bricht er ab.
// Sonst stünde localhost in canonical und sitemap, der Build wäre grün und niemand sähe es.
// Lokal (auch `next build` auf dem Rechner) gilt http://localhost:3000.
//
// Einbau: `import { BASIS_URL, absolut } from '@/lib/basis-url'`.
// In layout.tsx: `metadataBase: new URL(BASIS_URL)`.
// (Kommentar steht unter der ersten Zeile: shadcn entfernt Kommentare vor der ersten Anweisung.)

function ermittle(): string {
  // Jede Variable wörtlich ausschreiben: Next ersetzt NEXT_PUBLIC_* nur so im Client-Bundle.
  const vonHand = process.env.NEXT_PUBLIC_SITE_URL
  const vonVercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  const roh = vonHand || (vonVercel ? `https://${vonVercel}` : LOKAL)

  let url: URL
  try {
    url = new URL(roh)
  } catch {
    throw new Error(`basis-url: "${roh}" ist keine gültige Adresse. NEXT_PUBLIC_SITE_URL prüfen.`)
  }

  // process.env.VERCEL gibt es nur im Build und auf dem Server von Vercel, nie im Browser.
  if (process.env.VERCEL && (url.hostname === 'localhost' || url.protocol !== 'https:')) {
    throw new Error(
      'basis-url: Build läuft auf Vercel, aber es gibt keine https-Produktionsadresse. ' +
        'System-Umgebungsvariablen im Vercel-Projekt aktivieren oder NEXT_PUBLIC_SITE_URL setzen.',
    )
  }

  return url.origin
}

/** Basisadresse ohne Schrägstrich am Ende, z. B. `https://example.com`. */
export const BASIS_URL = ermittle()

/** Absolute Adresse zu einem Pfad: `absolut('/impressum')` → `https://example.com/impressum`. */
export function absolut(pfad: string = '/'): string {
  return new URL(pfad, BASIS_URL).toString()
}

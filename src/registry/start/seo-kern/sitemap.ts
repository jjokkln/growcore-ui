import type { MetadataRoute } from 'next'
import { absolut } from '@/lib/basis-url'
import { siteConfig } from '@/lib/site-config'

// Sitemap aus einer Liste der öffentlichen Seiten. Adressen absolut über basis-url.
//
// Warum eine Liste von Hand: Nur Seiten, die wirklich öffentlich und fertig sind, gehören hinein.
// Neue öffentliche Seite → hier eintragen (launch-check vergleicht die Liste mit den echten Routen).
// Ohne Freigabe zur Indexierung bleibt die Sitemap leer, damit nichts Unfertiges gemeldet wird.
//
// Einbau: liegt als app/sitemap.ts, ausgeliefert unter /sitemap.xml.

// lastModified nur angeben, wenn es stimmt. Ein Build-Datum auf jeder Seite ist keine Änderung.
const SEITEN: { pfad: string; geaendert?: string }[] = [{ pfad: '/' }]

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexierbar) return []
  return SEITEN.map(({ pfad, geaendert }) => ({
    url: absolut(pfad),
    ...(geaendert ? { lastModified: geaendert } : {}),
  }))
}

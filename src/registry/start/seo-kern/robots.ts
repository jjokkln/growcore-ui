import type { MetadataRoute } from 'next'
import { absolut } from '@/lib/basis-url'
import { siteConfig } from '@/lib/site-config'

// robots.txt aus der site-config. Ohne Freigabe (NEXT_PUBLIC_INDEXIERBAR=true, nicht in
// Previews) ist alles gesperrt; zusätzlich setzen die Metadaten-Helfer noindex.
// Mit Freigabe: alles erlaubt außer /api/, dazu der Verweis auf die Sitemap.
//
// Einbau: liegt als app/robots.ts. Weitere interne Bereiche (z. B. /admin/) unten ergänzen.

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexierbar) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: absolut('/sitemap.xml'),
  }
}

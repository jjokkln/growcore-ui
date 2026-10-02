import { ogAlt, ogBild, OG_GROESSE, OG_TYP } from '@/lib/seo/og-bild'

// Vorschaubild der Website (gilt für alle Seiten ohne eigenes). Inhalt in '@/lib/seo/og-bild'.

export const size = OG_GROESSE
export const contentType = OG_TYP
export const alt = ogAlt()

export default function Image() {
  return ogBild()
}

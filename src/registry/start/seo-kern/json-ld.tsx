import { serialisiereJsonLd } from '@/lib/seo/jsonld'

// Rendert strukturierte Daten als <script type="application/ld+json">. Server-Komponente, kein
// JavaScript im Browser. Daten aus den Fabriken in '@/lib/seo/jsonld'.
//
// Einbau: `<JsonLd daten={organisationJsonLd()} />` oder mehrere als Array.

export function JsonLd({ daten }: { daten: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Inhalt kommt nur aus der site-config und den Fabriken, nie aus Nutzereingaben; `<` ist maskiert.
      dangerouslySetInnerHTML={{ __html: serialisiereJsonLd(daten) }}
    />
  )
}

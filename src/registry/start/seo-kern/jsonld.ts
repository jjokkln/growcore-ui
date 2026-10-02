import { absolut } from '@/lib/basis-url'
import { anzeigename, siteConfig } from '@/lib/site-config'

// Fabriken für strukturierte Daten (schema.org, JSON-LD). Gespeist nur aus der site-config.
// Was dort null oder false ist, fehlt hier: lieber eine kürzere Angabe als eine erfundene
// (Pflichtkern 5). Gerendert wird mit <JsonLd daten={…} /> aus '@/components/seo/json-ld'.
//
// Einbau: Startseite `<JsonLd daten={[organisationJsonLd(), webseiteJsonLd()]} />`,
// Unterseiten `breadcrumbJsonLd([{ name: 'Start', pfad: '/' }, …])`, FAQ `faqJsonLd(fragen)`.

type Objekt = Record<string, unknown>

/** Entfernt Felder ohne Wert, damit kein null und kein leerer Text in den Daten steht. */
function ohneLeeres<T extends Objekt>(objekt: T): T {
  return Object.fromEntries(
    Object.entries(objekt).filter(([, wert]) => wert !== null && wert !== undefined && wert !== false && wert !== ''),
  ) as T
}

function anschriftJsonLd(): Objekt | undefined {
  const { strasse, plz, ort, land } = siteConfig.anschrift
  if (!strasse && !plz && !ort) return undefined
  return ohneLeeres({
    '@type': 'PostalAddress',
    streetAddress: strasse,
    postalCode: plz,
    addressLocality: ort,
    addressCountry: land,
  })
}

/**
 * Das Unternehmen. `typ` nach schema.org wählen: 'Organization', 'LocalBusiness' oder
 * spezieller (z. B. 'ProfessionalService', 'MedicalClinic'). `logo` als Pfad unter /public.
 */
export function organisationJsonLd(optionen: { typ?: string; logo?: string } = {}): Objekt {
  const profile = Object.values(siteConfig.social)
  return ohneLeeres({
    '@context': 'https://schema.org',
    '@type': optionen.typ ?? 'Organization',
    '@id': absolut('/#organisation'),
    name: siteConfig.firma ?? anzeigename(),
    url: absolut('/'),
    description: siteConfig.beschreibung,
    logo: optionen.logo ? absolut(optionen.logo) : undefined,
    email: siteConfig.kontakt.email,
    telephone: siteConfig.kontakt.telefon,
    address: anschriftJsonLd(),
    vatID: siteConfig.ustId || undefined,
    sameAs: profile.length > 0 ? profile : undefined,
  })
}

/** Die Website selbst, verknüpft mit der Organisation. */
export function webseiteJsonLd(): Objekt {
  return ohneLeeres({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absolut('/#webseite'),
    name: anzeigename(),
    url: absolut('/'),
    inLanguage: siteConfig.sprache,
    publisher: { '@id': absolut('/#organisation') },
  })
}

/** Brotkrumen. Pfade relativ, z. B. [{ name: 'Start', pfad: '/' }, { name: 'Leistungen', pfad: '/leistungen' }]. */
export function breadcrumbJsonLd(stufen: { name: string; pfad: string }[]): Objekt {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: stufen.map((stufe, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: stufe.name,
      item: absolut(stufe.pfad),
    })),
  }
}

/** Fragen und Antworten, nur wenn sie genau so sichtbar auf der Seite stehen. */
export function faqJsonLd(fragen: { frage: string; antwort: string }[]): Objekt {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: fragen.map(({ frage, antwort }) => ({
      '@type': 'Question',
      name: frage,
      acceptedAnswer: { '@type': 'Answer', text: antwort },
    })),
  }
}

/** JSON für ein <script>-Tag: `<` wird maskiert, damit `</script>` im Text den Tag nicht schließt. */
export function serialisiereJsonLd(daten: unknown): string {
  return JSON.stringify(daten).replace(/</g, '\\u003c')
}

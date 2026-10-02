import type { Metadata } from 'next'
import { BASIS_URL } from '@/lib/basis-url'
import { anzeigename, siteConfig } from '@/lib/site-config'
import { ogAlt, OG_GROESSE, OG_TYP } from '@/lib/seo/og-bild'

// Metadaten-Helfer für den App Router. Eine Stelle für Titelmuster, canonical, Open Graph und
// noindex, gespeist aus site-config und basis-url.
//
// Warum: canonical und og:url müssen absolut und auf die Produktionsadresse zeigen, und eine
// Seite ohne Freigabe (NEXT_PUBLIC_INDEXIERBAR) darf nirgends indexierbar sein, auch nicht über
// das Meta-Tag. Das soll nicht in jeder Seite neu entschieden werden.
//
// Einbau:
//   app/layout.tsx:  `export const metadata = basisMetadaten()`
//   app/page.tsx:    `export const metadata = seitenMetadaten({ pfad: '/' })`  (Titel = Seitenname)
//   app/x/page.tsx:  `export const metadata = seitenMetadaten({ titel: 'X', beschreibung: '…', pfad: '/x' })`

const OG_LOCALE: Record<string, string> = { de: 'de_DE', en: 'en_US' }

// Next führt openGraph nicht feldweise zusammen: Wer es in einer Seite setzt, ersetzt das des
// Layouts ganz, auch das Bild aus app/opengraph-image.tsx. Deshalb tragen beide Helfer diese
// Grundfelder samt Bild mit. Eine eigene opengraph-image.tsx im Seitenordner sticht trotzdem.
function ogGrund() {
  const name = anzeigename()
  return {
    type: 'website' as const,
    siteName: name || undefined,
    locale: OG_LOCALE[siteConfig.sprache] ?? siteConfig.sprache,
    images: [{ url: '/opengraph-image', ...OG_GROESSE, type: OG_TYP, alt: ogAlt() }],
  }
}

/** Grundmetadaten für das Root-Layout. */
export function basisMetadaten(): Metadata {
  const name = anzeigename()
  return {
    metadataBase: new URL(BASIS_URL),
    title: name ? { default: name, template: `%s | ${name}` } : { default: '', template: '%s' },
    description: siteConfig.beschreibung ?? undefined,
    applicationName: name || undefined,
    // Kein canonical und keine og:url hier: Das Layout vererbt sie an jede Seite, die keine eigene
    // setzt, und dann zeigte jede Unterseite auf die Startseite. Jede Seite ruft seitenMetadaten().
    openGraph: ogGrund(),
    twitter: { card: 'summary_large_image' },
    robots: siteConfig.indexierbar ? { index: true, follow: true } : { index: false, follow: false },
  }
}

/**
 * Metadaten einer Seite. `pfad` ist Pflicht, damit canonical und og:url stimmen. Ohne `titel`
 * gilt der Seitenname aus dem Layout (für die Startseite).
 * `indexieren: false` für Seiten, die nie in den Index sollen (Danke-Seite, Vorschau).
 */
export function seitenMetadaten(optionen: {
  titel?: string
  beschreibung?: string
  pfad: string
  indexieren?: boolean
}): Metadata {
  const { titel, beschreibung, pfad, indexieren = true } = optionen
  const index = siteConfig.indexierbar && indexieren
  return {
    ...(titel ? { title: titel } : {}),
    description: beschreibung ?? siteConfig.beschreibung ?? undefined,
    alternates: { canonical: pfad },
    openGraph: {
      ...ogGrund(),
      title: titel ?? (anzeigename() || undefined),
      description: beschreibung ?? siteConfig.beschreibung ?? undefined,
      url: pfad,
    },
    robots: { index, follow: index },
  }
}

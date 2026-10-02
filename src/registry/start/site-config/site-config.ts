import { BASIS_URL } from '@/lib/basis-url'

// Stammdaten des Kunden: die eine Stelle dafür (Pflichtkern 10). Kopf, Fuß, Impressum,
// Datenschutz, Metadaten, sitemap, robots und strukturierte Daten lesen von hier und nirgends sonst.
// Ändert sich die Telefonnummer, wird sie hier geändert, nicht an den Stellen, die sie zeigen.
//
// Drei Zustände je Angabe:
//   null   = noch nicht geliefert bzw. noch nicht geklärt. Nie mit Platzhaltern füllen
//            (Pflichtkern 5). fehlendePflichtangaben() listet alle offenen Pflichtfelder.
//   false  = gibt es bewusst nicht (z. B. kein Registereintrag, kein Analytics).
//   Wert   = echte, vom Kunden gelieferte Angabe.
//
// Schnittstelle (andere Bausteine verlassen sich auf genau diese Felder):
//   firma            string | null           Name mit Rechtsform, wie im Impressum
//   vertreten_durch  string | null           Inhaber bzw. vertretungsberechtigte Person(en)
//   anschrift        { strasse, plz, ort: string | null; land: string }   land als ISO-Code
//   kontakt          { email, telefon: string | null }
//   register         { gericht, nummer } | false | null
//   ustId            string | false | null   USt-IdNr. nach § 27a UStG
//   url              string                  aus @/lib/basis-url, nie von Hand eintragen
//   indexierbar      boolean                 nur true mit NEXT_PUBLIC_INDEXIERBAR=true und nie in Previews
//   seitenname       string | null           kurzer Name für Titel und og:site_name (Rückfall: firma)
//   beschreibung     string | null           Standard-Beschreibung für Metadaten
//   dienste          je Dienst: Anbietername | false | null  (siehe unten)
//   social           Record<Plattform, Profil-URL>, nur Links, keine Einbettungen
//
// Dienste: Was hier steht, steht in der Datenschutzerklärung, und nur das (Pflichtkern 2 und 4).
// Ein neuer Dienst ändert drei Dinge im selben Schritt: Code, Einwilligung, diesen Eintrag.
// Übliche Werte bei GrowCore: hosting 'Vercel', datenbank 'Supabase', mail Name des SMTP-Anbieters,
// analytics z. B. 'Vercel Web Analytics', karten z. B. 'OpenStreetMap', videos 'YouTube' oder
// 'Vimeo', ki z. B. 'Google Gemini (Vertex AI, europe-west1)'.
//
// Einbau: `import { siteConfig, fehlendePflichtangaben } from '@/lib/site-config'`.

type Angabe = string | null
type Dienst = string | false | null

export type SiteConfig = {
  firma: Angabe
  vertreten_durch: Angabe
  anschrift: { strasse: Angabe; plz: Angabe; ort: Angabe; land: string }
  kontakt: { email: Angabe; telefon: Angabe }
  register: { gericht: string; nummer: string } | false | null
  ustId: string | false | null
  url: string
  indexierbar: boolean
  seitenname: Angabe
  beschreibung: Angabe
  sprache: string
  dienste: {
    hosting: Dienst
    datenbank: Dienst
    mail: Dienst
    analytics: Dienst
    karten: Dienst
    videos: Dienst
    ki: Dienst
  }
  social: Record<string, string>
}

export const siteConfig: SiteConfig = {
  firma: null,
  vertreten_durch: null,
  anschrift: { strasse: null, plz: null, ort: null, land: 'DE' },
  kontakt: { email: null, telefon: null },
  register: null,
  ustId: null,
  url: BASIS_URL,
  // Erst zum Livegang in Vercel (nur Production) setzen. Previews bleiben immer noindex.
  indexierbar:
    process.env.NEXT_PUBLIC_INDEXIERBAR === 'true' && process.env.VERCEL_ENV !== 'preview',
  seitenname: null,
  beschreibung: null,
  sprache: 'de',
  dienste: {
    hosting: null,
    datenbank: null,
    mail: null,
    analytics: null,
    karten: null,
    videos: null,
    ki: null,
  },
  social: {},
}

/**
 * Pflichtangaben, die noch null sind. Ohne sie gehen Impressum (§ 5 DDG), Datenschutzerklärung
 * (Art. 13 DSGVO) und damit der Livegang nicht. Leere Liste heißt: vollständig.
 */
export function fehlendePflichtangaben(config: SiteConfig = siteConfig): string[] {
  const felder: Record<string, unknown> = {
    firma: config.firma,
    vertreten_durch: config.vertreten_durch,
    'anschrift.strasse': config.anschrift.strasse,
    'anschrift.plz': config.anschrift.plz,
    'anschrift.ort': config.anschrift.ort,
    'kontakt.email': config.kontakt.email,
    'kontakt.telefon': config.kontakt.telefon,
    register: config.register,
    ustId: config.ustId,
    ...Object.fromEntries(
      Object.entries(config.dienste).map(([dienst, wert]) => [`dienste.${dienst}`, wert]),
    ),
  }
  return Object.entries(felder)
    .filter(([, wert]) => wert === null || wert === '')
    .map(([feld]) => feld)
}

/** Name für Titel und og:site_name: seitenname, sonst firma, sonst leer. */
export function anzeigename(config: SiteConfig = siteConfig): string {
  return config.seitenname ?? config.firma ?? ''
}

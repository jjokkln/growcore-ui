import type { Metadata } from 'next'
import { Abschnitt, Pflichtangaben, RechtsSeite } from '@/components/recht/rechts-seite'
import { fehlendePflichtangaben, siteConfig } from '@/lib/site-config'

// Impressum nach § 5 DDG, vollständig aus site-config (Pflichtkern 10). Was dort null ist,
// erscheint hier nicht und wird nie mit Platzhaltern gefüllt (Pflichtkern 5); der Hinweis von
// <Pflichtangaben> nennt es, und ist die Seite indexierbar, bricht der Build ab.
// register/ustId = false heißt „gibt es nicht“: dann entfällt der Abschnitt ohne Hinweis.

export const metadata: Metadata = {
  title: 'Impressum',
  alternates: { canonical: '/impressum' },
  // Nicht in die Suche und nicht in die sitemap, aber verlinkt: Pflichtseite, kein Inhalt.
  robots: { index: false, follow: true },
}

const IMPRESSUM_FELDER = ['firma', 'vertreten_durch', 'anschrift.', 'kontakt.', 'register', 'ustId']

export default function ImpressumSeite() {
  const { firma, vertreten_durch, anschrift, kontakt, register, ustId } = siteConfig
  const fehlend = fehlendePflichtangaben().filter((feld) =>
    IMPRESSUM_FELDER.some((f) => feld === f || feld.startsWith(f)),
  )
  const ortszeile = [anschrift.plz, anschrift.ort].filter(Boolean).join(' ')

  return (
    <RechtsSeite titel="Impressum">
      <Pflichtangaben fehlend={fehlend} seite="Impressum" />

      <Abschnitt titel="Angaben nach § 5 DDG">
        <p>
          {[firma, anschrift.strasse, ortszeile].filter(Boolean).map((zeile, i) => (
            <span key={i} className="block">
              {zeile}
            </span>
          ))}
        </p>
        {vertreten_durch ? <p>Vertreten durch: {vertreten_durch}</p> : null}
      </Abschnitt>

      {kontakt.telefon || kontakt.email ? (
        <Abschnitt titel="Kontakt">
          <p>
            {kontakt.telefon ? (
              <span className="block">
                Telefon: <a href={`tel:${kontakt.telefon.replace(/[^\d+]/g, '')}`}>{kontakt.telefon}</a>
              </span>
            ) : null}
            {kontakt.email ? (
              <span className="block">
                E-Mail: <a href={`mailto:${kontakt.email}`}>{kontakt.email}</a>
              </span>
            ) : null}
          </p>
        </Abschnitt>
      ) : null}

      {register ? (
        <Abschnitt titel="Registereintrag">
          <p>
            Registergericht: {register.gericht}
            <br />
            Registernummer: {register.nummer}
          </p>
        </Abschnitt>
      ) : null}

      {ustId ? (
        <Abschnitt titel="Umsatzsteuer-Identifikationsnummer">
          <p>nach § 27a Umsatzsteuergesetz: {ustId}</p>
        </Abschnitt>
      ) : null}
    </RechtsSeite>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Abschnitt, Pflichtangaben, RechtsSeite } from '@/components/recht/rechts-seite'
import { RECHTSTEXTE } from '@/lib/rechtstexte'
import { anzeigename, siteConfig } from '@/lib/site-config'

// Erklärung zur Barrierefreiheit mit erreichbarem Kontakt (Pflichtkern 7, BFSG). Sie beschreibt
// den technischen Zustand dieser Seite und steht deshalb im Code: Wer eine Barriere behebt oder
// findet, ändert RECHTSTEXTE.einschraenkungen im selben Commit. Sie behauptet keine volle
// Konformität, denn ohne Audit durch Dritte wäre das falsch.
// Kontakt aus site-config; fehlt er, meldet <Pflichtangaben> das (die Seite braucht einen Weg).

export const metadata: Metadata = {
  title: 'Erklärung zur Barrierefreiheit',
  description:
    'Stand der Barrierefreiheit dieser Website, bekannte Einschränkungen und wie Sie Barrieren melden können.',
  alternates: { canonical: '/barrierefreiheit' },
  // Nicht in die Suche und nicht in die sitemap, aber verlinkt: Pflichtseite, kein Inhalt.
  robots: { index: false, follow: true },
}

export default function BarrierefreiheitSeite() {
  const { email, telefon } = siteConfig.kontakt
  const name = anzeigename() || new URL(siteConfig.url).host
  const betreff = encodeURIComponent(`Barriere auf ${new URL(siteConfig.url).host}`)
  const fehlend = email || telefon ? [] : ['kontakt.email oder kontakt.telefon']

  return (
    <RechtsSeite
      titel="Erklärung zur Barrierefreiheit"
      einleitung={
        <p>
          Für die Website von {name}. Stand: {RECHTSTEXTE.barrierefreiheitStand}.
        </p>
      }
    >
      <Pflichtangaben fehlend={fehlend} seite="Barrierefreiheit" />

      <Abschnitt titel="Was wir anstreben">
        <p>
          Diese Website soll für alle nutzbar sein, auch mit Screenreader, ausschließlich über die
          Tastatur, mit starker Vergrößerung oder bei eingeschränktem Farbsehen. Maßstab sind die Web
          Content Accessibility Guidelines 2.1, Stufe AA, in der Fassung der EN 301 549, die auch das
          Barrierefreiheitsstärkungsgesetz zugrunde legt.
        </p>
      </Abschnitt>

      <Abschnitt titel="Stand der Vereinbarkeit: teilweise vereinbar">
        <p>
          Die Website ist <strong>teilweise</strong> mit WCAG 2.1 AA vereinbar. Eine vollständige
          Prüfung durch Dritte hat nicht stattgefunden. Bekannte Einschränkungen:
        </p>
        <ul>
          {RECHTSTEXTE.einschraenkungen.map((eintrag) => (
            <li key={eintrag}>{eintrag}</li>
          ))}
        </ul>
      </Abschnitt>

      {RECHTSTEXTE.barrierefreiheitsMenue ? (
        <Abschnitt titel="Was das Barrierefreiheits-Menü leistet, und was nicht">
          <p>
            Über die Schaltfläche für Barrierefreiheit können Sie Schriftgröße, Abstände, Kontrast und
            mehrere Lesehilfen einstellen. Die Einstellung gilt nur für Sie und bleibt auf Ihrem Gerät.
          </p>
          <p>
            Dieses Menü ersetzt keine barrierefreie Website. Es kann Text größer machen, aber keine
            fehlende Bildbeschreibung erfinden und keine Bedienung reparieren, die ohne Maus nicht
            funktioniert. Wenn Ihnen etwas im Weg steht, ist das ein Fehler bei uns.
          </p>
        </Abschnitt>
      ) : null}

      <Abschnitt titel="Barriere melden">
        <p>
          Wenn Ihnen etwas auffällt, eine Stelle, die Sie mit der Tastatur nicht erreichen, ein Text,
          der zu schwach ist, eine Grafik ohne Beschreibung: Schreiben Sie uns oder rufen Sie an.
        </p>
        <p>
          {email ? (
            <span className="block">
              E-Mail: <a href={`mailto:${email}?subject=${betreff}`}>{email}</a>
            </span>
          ) : null}
          {telefon ? (
            <span className="block">
              Telefon: <a href={`tel:${telefon.replace(/[^\d+]/g, '')}`}>{telefon}</a>
            </span>
          ) : null}
        </p>
        <p>
          Bitte nennen Sie möglichst die Seite und das Gerät oder Hilfsmittel, das Sie verwenden. Wir
          antworten so schnell wie möglich.
        </p>
        <p>
          Sind Sie mit der Antwort nicht zufrieden, können Sie sich an die Marktüberwachungsstelle der
          Länder für die Barrierefreiheit von Produkten und Dienstleistungen (MLBF) wenden.
        </p>
        <p>
          <Link href="/">Zurück zur Startseite</Link>
        </p>
      </Abschnitt>
    </RechtsSeite>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Abschnitt, Pflichtangaben, RechtsSeite } from '@/components/recht/rechts-seite'
import { RECHTSTEXTE } from '@/lib/rechtstexte'
import { fehlendePflichtangaben, siteConfig, type SiteConfig } from '@/lib/site-config'

// Datenschutzerklärung nach Art. 13 DSGVO. Keine Standardvorlage: Jeder Abschnitt zu einem Dienst
// erscheint nur, wenn site-config.dienste ihn nennt, und der Abschnitt „Was diese Seite nicht tut“
// entsteht aus den Diensten, die dort bewusst false sind (Pflichtkern 2 und 4). Ein neuer Dienst
// heißt: Code, Einwilligung und site-config im selben Schritt, dann stimmt diese Seite von selbst.
//
// Für die üblichen GrowCore-Anbieter (Vercel, Supabase, YouTube, OpenStreetMap, Vercel Web
// Analytics) stehen fertige Texte unten in TEXTE. Für jeden anderen Anbieter erscheint ein
// allgemeiner Absatz plus ein Entwurfs-Hinweis: Dann den Text in TEXTE ergänzen.
// Entwurfsstand, juristisch nicht geprüft. Vor dem Livegang /rechtscheck laufen lassen.

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  alternates: { canonical: '/datenschutz' },
  // Nicht in die Suche und nicht in die sitemap, aber verlinkt: Pflichtseite, kein Inhalt.
  robots: { index: false, follow: true },
}

type DienstArt = keyof SiteConfig['dienste']

/** Fertige Absätze je Anbieter. Schlüssel: Anfang des Namens in site-config, klein geschrieben. */
const TEXTE: Partial<Record<DienstArt, Record<string, ReactNode>>> = {
  hosting: {
    vercel: (
      <p>
        Diese Website wird bei der Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA)
        betrieben. Serverseitige Funktionen laufen in Frankfurt am Main, statische Dateien liefert das
        weltweite Netz des Anbieters aus. Beim Abruf verarbeitet Vercel technisch notwendige
        Verbindungsdaten (IP-Adresse, Zeitpunkt, abgerufene Seite, Browserkennung), um die Seite
        auszuliefern und Angriffe abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die
        Übermittlung in die USA stützt sich auf das EU-US Data Privacy Framework und die
        Standardvertragsklauseln der EU-Kommission. Mit Vercel besteht ein Vertrag zur
        Auftragsverarbeitung.
      </p>
    ),
  },
  datenbank: {
    supabase: (
      <p>
        Inhalte dieser Seite und Angaben, die Sie uns senden, speichern wir in einer Datenbank der
        Supabase Inc. (970 Toa Payoh North #07-04, Singapur 318992). Die Datenbank steht in Frankfurt am
        Main (Region eu-central-1). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. f DSGVO. Für den
        Fall eines Zugriffs aus Drittländern bestehen Standardvertragsklauseln der EU-Kommission. Mit
        Supabase besteht ein Vertrag zur Auftragsverarbeitung.
      </p>
    ),
  },
  analytics: {
    'vercel web analytics': (
      <p>
        Mit Ihrer Einwilligung messen wir mit Vercel Web Analytics (Vercel Inc., USA), welche Seiten
        wie oft aufgerufen werden. Der Dienst setzt keine Cookies und bildet keine Profile; Besuche
        werden über einen Wert gezählt, der nach 24 Stunden verfällt. Rechtsgrundlage ist Ihre
        Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Übermittlung in die USA wie
        beim Hosting beschrieben.
      </p>
    ),
  },
  videos: {
    youtube: (
      <p>
        Wir binden Videos von YouTube ein (Google Ireland Limited, Gordon House, Barrow Street, Dublin
        4, Irland) und nutzen dafür die Adresse youtube-nocookie.com. Ein Video lädt erst, wenn Sie
        zustimmen; vorher geht keine Verbindung zu YouTube, auch kein Vorschaubild. Beim Laden
        erhält Google Ihre IP-Adresse und Geräteinformationen und kann Daten auf Ihrem Gerät
        speichern; eine Übermittlung an Google LLC in den USA ist möglich (EU-US Data Privacy
        Framework). Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1
        TDDDG).
      </p>
    ),
  },
  karten: {
    openstreetmap: (
      <p>
        Karten beziehen wir von OpenStreetMap (OpenStreetMap Foundation, St John’s Innovation Centre,
        Cowley Road, Cambridge, CB4 0WS, Vereinigtes Königreich). Eine Karte lädt erst, wenn Sie
        zustimmen. Beim Laden erhält der Anbieter Ihre IP-Adresse. Für das Vereinigte Königreich
        besteht ein Angemessenheitsbeschluss der EU-Kommission. Rechtsgrundlage ist Ihre
        Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).
      </p>
    ),
  },
}

const TITEL: Record<DienstArt, string> = {
  hosting: 'Hosting',
  datenbank: 'Datenbank',
  mail: 'E-Mail-Versand',
  analytics: 'Reichweitenmessung',
  karten: 'Karten',
  videos: 'Videos',
  ki: 'Künstliche Intelligenz',
}

/** Allgemeiner Absatz für Anbieter ohne fertigen Text. */
function allgemein(art: DienstArt, anbieter: string): ReactNode {
  const zweck: Record<DienstArt, string> = {
    hosting: 'betreibt die Server, die diese Seite ausliefern',
    datenbank: 'speichert Inhalte dieser Seite und Angaben, die Sie uns senden',
    mail: 'verschickt E-Mails dieser Seite, zum Beispiel Bestätigungen Ihrer Anfrage',
    analytics: 'misst mit Ihrer Einwilligung, welche Seiten wie oft aufgerufen werden',
    karten: 'liefert eingebettete Karten aus, die erst nach Ihrer Zustimmung laden',
    videos: 'liefert eingebettete Videos aus, die erst nach Ihrer Zustimmung laden',
    ki: 'verarbeitet Eingaben in Funktionen, die als KI-gestützt gekennzeichnet sind',
  }
  const einwilligung = art === 'analytics' || art === 'karten' || art === 'videos'
  return (
    <p>
      {anbieter} {zweck[art]}. Dabei werden die dafür nötigen Daten an den Anbieter übertragen,
      mindestens Ihre IP-Adresse. Rechtsgrundlage ist{' '}
      {einwilligung
        ? 'Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG)'
        : 'Art. 6 Abs. 1 lit. b bzw. f DSGVO'}
      .
    </p>
  )
}

function text(art: DienstArt, anbieter: string): { inhalt: ReactNode; bekannt: boolean } {
  const name = anbieter.toLowerCase()
  const eintraege = Object.entries(TEXTE[art] ?? {})
  // Längster passender Schlüssel gewinnt: „Vercel Web Analytics“ vor „Vercel“.
  const treffer = eintraege
    .filter(([schluessel]) => name.startsWith(schluessel))
    .sort((a, b) => b[0].length - a[0].length)[0]
  return treffer ? { inhalt: treffer[1], bekannt: true } : { inhalt: allgemein(art, anbieter), bekannt: false }
}

const DATENSCHUTZ_FELDER = ['firma', 'anschrift.', 'kontakt.', 'dienste.']

export default function DatenschutzSeite() {
  const { firma, anschrift, kontakt, dienste } = siteConfig
  const arten = Object.keys(dienste) as DienstArt[]
  const aktiv = arten.filter((art) => typeof dienste[art] === 'string' && dienste[art])
  const abschnitte = aktiv.map((art) => ({ art, anbieter: dienste[art] as string, ...text(art, dienste[art] as string) }))
  const ohneText = abschnitte.filter((a) => !a.bekannt).map((a) => `Text für ${a.anbieter} (${a.art})`)

  const fehlend = [
    ...fehlendePflichtangaben().filter((feld) => DATENSCHUTZ_FELDER.some((f) => feld.startsWith(f))),
    ...ohneText,
  ]
  const einwilligungNoetig = aktiv.some((art) => art === 'analytics' || art === 'videos' || art === 'karten')
  const ortszeile = [anschrift.plz, anschrift.ort].filter(Boolean).join(' ')

  const nicht: string[] = []
  if (dienste.analytics === false) nicht.push('keinen Analyse- oder Trackingdienst und keine Werbe-Pixel')
  if (dienste.videos === false) nicht.push('keine eingebetteten Videos')
  if (dienste.karten === false) nicht.push('keine eingebetteten Karten')
  if (dienste.ki === false) nicht.push('keine KI-Dienste')

  return (
    <RechtsSeite titel="Datenschutzerklärung" einleitung={<p>Stand: {RECHTSTEXTE.datenschutzStand}</p>}>
      <Pflichtangaben fehlend={fehlend} seite="Datenschutzerklärung" />

      <Abschnitt titel="Verantwortlicher">
        <p>
          {[firma, anschrift.strasse, ortszeile].filter(Boolean).map((zeile, i) => (
            <span key={i} className="block">
              {zeile}
            </span>
          ))}
          {kontakt.telefon ? <span className="block">Telefon: {kontakt.telefon}</span> : null}
          {kontakt.email ? (
            <span className="block">
              E-Mail: <a href={`mailto:${kontakt.email}`}>{kontakt.email}</a>
            </span>
          ) : null}
        </p>
      </Abschnitt>

      {abschnitte.map(({ art, inhalt }) => (
        <Abschnitt key={art} titel={TITEL[art]}>
          {inhalt}
        </Abschnitt>
      ))}

      <Abschnitt titel="Kontakt per E-Mail oder Telefon">
        <p>
          Wenn Sie uns schreiben oder anrufen, verarbeiten wir Ihre Angaben, um Ihr Anliegen zu
          bearbeiten (Art. 6 Abs. 1 lit. b DSGVO bei Anfragen zu einem Vertrag, sonst lit. f). Wir
          löschen sie, sobald das Anliegen erledigt ist, es sei denn, gesetzliche Aufbewahrungsfristen
          verlangen mehr.
        </p>
      </Abschnitt>

      {RECHTSTEXTE.anfrageformular ? (
        <Abschnitt titel="Anfrageformular">
          <p>
            Was Sie in das Anfrageformular eingeben, speichern wir, um Ihre Anfrage zu bearbeiten, und
            benachrichtigen uns darüber per E-Mail{dienste.mail ? ` (Versand über ${dienste.mail})` : ''}.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Pflichtfelder sind gekennzeichnet; alle
            anderen Angaben sind freiwillig. Wir löschen die Anfrage, sobald sie erledigt ist, spätestens
            nach Ablauf gesetzlicher Aufbewahrungsfristen, wenn daraus ein Auftrag entstanden ist.
          </p>
        </Abschnitt>
      ) : null}

      {einwilligungNoetig ? (
        <Abschnitt titel="Ihre Einwilligung und wie Sie sie ändern">
          <p>
            Dienste, die Daten an Dritte übertragen, laden erst nach Ihrer Zustimmung. Ihre Entscheidung
            speichern wir für 180 Tage im Speicher Ihres Browsers (localStorage), damit wir nicht bei
            jedem Aufruf neu fragen (§ 25 Abs. 2 Nr. 2 TDDDG). Cookies setzen wir dafür nicht. Sie
            können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, über
            „Datenschutz-Einstellungen“ am Ende jeder Seite.
          </p>
          {RECHTSTEXTE.einwilligungsnachweis ? (
            <p>
              <strong>Nachweis Ihrer Einwilligung.</strong> Weil wir eine Einwilligung nachweisen
              können müssen (Art. 7 Abs. 1 DSGVO), speichern wir jede Entscheidung als Datensatz: wann,
              in welcher Fassung des Hinweises, was Sie gewählt haben, und eine zufällig erzeugte
              Kennung aus Ihrem Browser, die keinen Rückschluss auf Ihre Person zulässt. Ihre
              IP-Adresse und Ihren Browser speichern wir dabei nicht. Rechtsgrundlage ist Art. 6 Abs. 1
              lit. c DSGVO. Wir löschen die Einträge nach 36 Monaten.
            </p>
          ) : null}
        </Abschnitt>
      ) : null}

      <Abschnitt titel="Schriften">
        <p>
          Alle Schriften werden vom eigenen Server ausgeliefert. Es besteht keine Verbindung zu Google
          Fonts oder einem anderen Schriftanbieter.
        </p>
      </Abschnitt>

      {RECHTSTEXTE.barrierefreiheitsMenue ? (
        <Abschnitt titel="Einstellungen zur Barrierefreiheit">
          <p>
            Wählen Sie im Barrierefreiheits-Menü eine Einstellung, zum Beispiel Schriftgröße oder
            Kontrast, legen wir sie im Speicher Ihres Browsers (localStorage) ab, damit sie beim
            nächsten Aufruf erhalten bleibt. Sie verlässt Ihr Gerät nicht. Löschen können Sie sie über
            „Zurücksetzen“ im Menü oder in den Einstellungen Ihres Browsers (§ 25 Abs. 2 Nr. 2 TDDDG).
          </p>
        </Abschnitt>
      ) : null}

      {nicht.length > 0 ? (
        <Abschnitt titel="Was diese Seite nicht tut">
          <p>
            Diese Seite nutzt {nicht.join(', ')}. Sollte sich das ändern, passen wir diese Erklärung im
            selben Schritt an.
          </p>
        </Abschnitt>
      ) : null}

      <Abschnitt titel="Ihre Rechte">
        <p>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17),
          Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch
          gegen eine Verarbeitung auf Grundlage berechtigter Interessen (Art. 21). Eine Einwilligung
          können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3). Wenden Sie sich
          dafür an die oben genannte Adresse.
        </p>
        <p>
          Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren, insbesondere in
          dem Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
          Verstoßes (Art. 77 DSGVO).
        </p>
      </Abschnitt>

      <Abschnitt titel="Barrierefreiheit">
        <p>
          Zur Bedienbarkeit dieser Seite und wie Sie uns Barrieren melden:{' '}
          <Link href="/barrierefreiheit">Erklärung zur Barrierefreiheit</Link>.
        </p>
      </Abschnitt>
    </RechtsSeite>
  )
}

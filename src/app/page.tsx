import Link from 'next/link'
import { Auftritt } from '@/components/motion/auftritt'
import { TextAuftritt } from '@/components/motion/text-auftritt'
import { Ablauf } from '@/components/motion/ablauf'
import { ScrollGeschichte } from '@/components/motion/scroll-geschichte'
import { SvgZeichnen } from '@/components/motion/svg-zeichnen'
import { Abschnitt } from './_demo/abschnitt'
import { AufklappenDemo, FlipDemo, PlatzhalterDemo, SchubladeDemo, ZahlDemo, ZeigerDemo } from './_demo/interaktiv'

const KARTEN = [
  { t: 'Strategie', w: 82 },
  { t: 'Gestaltung', w: 64 },
  { t: 'Entwicklung', w: 91 },
  { t: 'Betrieb', w: 47 },
]

const BUEHNE = ['bg-akzent', 'bg-tinte', 'bg-[#2f8f6b]']

export default function Seite() {
  return (
    <>
      <section className="pb-20 pt-20 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-widest text-leise">growcore-ui · Bewegung</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Ein gestalteter Moment pro Seite. Feedback an jedem Element.
        </h1>
        <Auftritt>
          <p data-auftritt className="mt-6 max-w-2xl text-lg text-leise">
            Zwölf Bausteine, eine Quelle. CSS übernimmt Zustände, View Transitions die Seitenwechsel,
            GSAP die Choreografie. Jeder Baustein prüft „Bewegung reduzieren“ selbst und lässt das
            größte Element der Seite in Ruhe.
          </p>
          <div data-auftritt className="mt-8 flex flex-wrap gap-2 text-sm">
            {['auftritt', 'text-auftritt', 'zahl', 'ablauf', 'scroll-geschichte', 'svg-zeichnen', 'aufklappen', 'schublade', 'flip-liste', 'magnet', 'platzhalter', 'seitenwechsel'].map((n) => (
              <a key={n} href={`#${n}`} className="rounded-full border border-linie bg-flaeche px-3 py-1 font-mono text-xs hover:border-tinte">{n}</a>
            ))}
          </div>
        </Auftritt>
      </section>

      <Abschnitt name="auftritt" titel="Auftritt" zweck="Gestaffeltes Einblenden beim Laden oder beim Scrollen. Balken wachsen auf ihren Wert. Ersetzt FadeIn, Reveal und RevealRoot aus fünf Repos.">
        <Auftritt beimScrollen>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {KARTEN.map((k) => (
              <div key={k.t} data-auftritt className="rounded-xl border border-linie bg-flaeche p-5">
                <div className="font-medium">{k.t}</div>
                <div className="mt-6 h-1.5 rounded-full bg-linie">
                  <div data-balken className="h-full rounded-full bg-akzent" style={{ width: `${k.w}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Auftritt>
      </Abschnitt>

      <Abschnitt name="text-auftritt" titel="TextAuftritt" zweck="Zeilen steigen aus einer Maske auf. Für Abschnitts-Überschriften und Zitate, nicht für die Hero-Headline.">
        <TextAuftritt className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Gute Bewegung erklärt, was gerade passiert. Alles andere ist Dekoration.
        </TextAuftritt>
        <TextAuftritt as="p" art="woerter" className="mt-6 max-w-2xl text-lg text-leise">
          Wortweise eignet sich für kurze Zitate und Untertitel, zeilenweise für Überschriften.
        </TextAuftritt>
      </Abschnitt>

      <Abschnitt name="zahl" titel="Zahl" zweck="Kennzahlen zählen einmal hoch, wenn sie ins Bild kommen. Die Breite steht vorher fest, deshalb springt und umbricht nichts.">
        <ZahlDemo />
      </Abschnitt>

      <Abschnitt name="ablauf" titel="Ablauf" zweck="Schritte, die eine Linie beim Scrollen verbindet. Zurückscrollen lässt sie zurücklaufen. Ab 768 px waagerecht.">
        <Ablauf
          className="[--ablauf-farbe:var(--akzent)]"
          schritte={[
            { titel: 'Anfrage', text: <p className="mt-1 text-sm text-leise">Fragebogen statt Telefon-Pingpong.</p> },
            { titel: 'Angebot', text: <p className="mt-1 text-sm text-leise">Festpreis auf Basis der Antworten.</p> },
            { titel: 'Umsetzung', text: <p className="mt-1 text-sm text-leise">Wöchentlicher Stand im Projektraum.</p> },
            { titel: 'Start', text: <p className="mt-1 text-sm text-leise">Abnahme, Übergabe, Betreuung.</p> },
          ]}
        />
      </Abschnitt>

      <Abschnitt name="scroll-geschichte" titel="ScrollGeschichte" zweck="Erklärseite in Schritten. Das Bild bleibt stehen, die Schritte scrollen vorbei, das Bild blendet mit. Sticky statt Pin, also kein Ruckeln auf iOS.">
        <ScrollGeschichte
          schritte={[0, 1, 2].map((i) => ({
            titel: ['Daten kommen an', 'Das System sortiert', 'Sie entscheiden'][i],
            text: <p className="mt-2 max-w-sm text-leise">Jeder Schritt bekommt sein eigenes Bild. Hier steht der erklärende Text zum Schritt {i + 1}.</p>,
            bild: (
              <div className={`grid h-full place-items-center rounded-2xl ${BUEHNE[i]} text-7xl font-semibold text-papier`}>
                {i + 1}
              </div>
            ),
          }))}
        />
      </Abschnitt>

      <Abschnitt name="svg-zeichnen" titel="SvgZeichnen" zweck="Erklärgrafik aus einem eigenen SVG. Linien werden gezeichnet, Knoten erscheinen, Datenpunkte laufen auf ihren Pfaden.">
        <SvgZeichnen className="rounded-xl border border-linie bg-flaeche p-6">
          <svg viewBox="0 0 640 200" className="w-full" role="img" aria-labelledby="svg-titel">
            <title id="svg-titel">Anfrage läuft über den Projektraum zum Kunden</title>
            <path id="pfad-a" data-zeichnen d="M116 100 C 200 30, 260 30, 320 100" fill="none" stroke="var(--akzent)" strokeWidth="2" />
            <path id="pfad-b" data-zeichnen d="M320 100 C 380 170, 440 170, 524 100" fill="none" stroke="var(--akzent)" strokeWidth="2" />
            {[
              { x: 70, t: 'Anfrage' },
              { x: 320, t: 'Projektraum' },
              { x: 570, t: 'Kunde' },
            ].map((k) => (
              <g key={k.t} data-erscheinen>
                <circle cx={k.x} cy={100} r={46} fill="var(--papier)" stroke="var(--tinte)" strokeWidth="1.5" />
                <text x={k.x} y={104} textAnchor="middle" fontSize="12" fill="var(--tinte)">{k.t}</text>
              </g>
            ))}
            <circle data-folgt="#pfad-a" r={5} fill="var(--akzent)" cx={116} cy={100} />
            <circle data-folgt="#pfad-b" r={5} fill="var(--akzent)" cx={320} cy={100} />
          </svg>
        </SvgZeichnen>
      </Abschnitt>

      <Abschnitt name="aufklappen" titel="Aufklappen" zweck="Akkordeon, FAQ, „mehr anzeigen“. Öffnet auf die natürliche Höhe, schließt schneller, als es aufgeht.">
        <AufklappenDemo />
      </Abschnitt>

      <Abschnitt name="schublade" titel="Schublade" zweck="Seitliches Menü auf einem nativen dialog. Fokusfalle, Escape und Rückkehr des Fokus liefert der Browser.">
        <SchubladeDemo />
      </Abschnitt>

      <Abschnitt name="flip-liste" titel="useFlipListe" zweck="Nach Filtern oder Sortieren gleiten die Einträge an ihren neuen Platz, statt zu springen.">
        <FlipDemo />
      </Abschnitt>

      <Abschnitt name="magnet" titel="useMagnet · useNeigung · feiern" zweck="Zeiger-Effekte nur mit echter Maus. Konfetti nur für einen echten Erfolg. Installation: magnet, neigung, feiern.">
        <ZeigerDemo />
      </Abschnitt>

      <Abschnitt name="platzhalter" titel="Platzhalter" zweck="Ladezustand in der Form des Endlayouts. Erscheint erst nach 180 ms, damit schnelle Ladevorgänge nicht grau aufblitzen. Reines CSS, läuft auch in loading.tsx.">
        <PlatzhalterDemo />
      </Abschnitt>

      <Abschnitt name="seitenwechsel" titel="Seitenwechsel" zweck="View Transitions zwischen Seiten, mit Richtung. Kein GSAP, kein Zusatz-JavaScript. Der Kopf bleibt stehen, der Fokus springt auf die neue h1.">
        <Link href="/tokens" transitionTypes={['vor']} className="inline-flex items-center gap-2 rounded-full bg-tinte px-5 py-2.5 text-sm font-medium text-papier hover:bg-akzent">
          Zu den Tokens wechseln <span aria-hidden>→</span>
        </Link>
      </Abschnitt>
    </>
  )
}

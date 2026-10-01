import { Auftritt } from '@/components/motion/auftritt'
import { TextAuftritt } from '@/components/motion/text-auftritt'
import { Ablauf } from '@/components/motion/ablauf'
import { ScrollGeschichte } from '@/components/motion/scroll-geschichte'
import { SvgZeichnen } from '@/components/motion/svg-zeichnen'
import { Platzhalter, PlatzhalterBereich, PlatzhalterText } from '@/components/motion/platzhalter'

// Beispiele ohne eigenen Zustand (Server-Komponenten), für Handbuch und Bausteine-Seite.
const KARTEN = [
  { t: 'Strategie', w: 82 },
  { t: 'Gestaltung', w: 64 },
  { t: 'Entwicklung', w: 91 },
  { t: 'Betrieb', w: 47 },
]
const BUEHNE = ['bg-akzent', 'bg-tinte', 'bg-[#1f6f55]']

export function AuftrittBeispiel() {
  return (
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
  )
}

export function TextAuftrittBeispiel() {
  return (
    <>
      <TextAuftritt className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Gute Bewegung erklärt, was gerade passiert. Alles andere ist Dekoration.
      </TextAuftritt>
      <TextAuftritt as="p" art="woerter" className="mt-6 max-w-2xl text-lg text-leise">
        Wortweise eignet sich für kurze Zitate und Untertitel, zeilenweise für Überschriften.
      </TextAuftritt>
    </>
  )
}

export function AblaufBeispiel() {
  return (
    <Ablauf
      className="[--ablauf-farbe:var(--akzent)] [--ablauf-punkt-text:#fff]"
      schritte={[
        { titel: 'Anfrage', text: <p className="mt-1 text-sm text-leise">Fragebogen statt Telefon-Pingpong.</p> },
        { titel: 'Angebot', text: <p className="mt-1 text-sm text-leise">Festpreis auf Basis der Antworten.</p> },
        { titel: 'Umsetzung', text: <p className="mt-1 text-sm text-leise">Wöchentlicher Stand im Projektraum.</p> },
        { titel: 'Start', text: <p className="mt-1 text-sm text-leise">Abnahme, Übergabe, Betreuung.</p> },
      ]}
    />
  )
}

export function ScrollGeschichteBeispiel() {
  return (
    <ScrollGeschichte
      schritte={[0, 1, 2].map((i) => ({
        titel: ['Daten kommen an', 'Das System sortiert', 'Sie entscheiden'][i],
        text: <p className="mt-2 max-w-sm text-leise">Jeder Schritt bekommt sein eigenes Bild. Hier steht der erklärende Text zum Schritt {i + 1}.</p>,
        bild: <div className={`grid h-full place-items-center rounded-2xl ${BUEHNE[i]} text-7xl font-semibold text-white`}>{i + 1}</div>,
      }))}
    />
  )
}

export function SvgBeispiel() {
  return (
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
  )
}

export function PlatzhalterStatisch() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <PlatzhalterBereich key={i} className="rounded-xl border border-linie bg-flaeche p-5">
          <Platzhalter className="h-32 w-full" />
          <Platzhalter className="mt-4 h-5 w-2/3" />
          <PlatzhalterText zeilen={2} className="mt-3" />
        </PlatzhalterBereich>
      ))}
    </div>
  )
}

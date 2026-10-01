import { Auftritt } from '@/components/motion/auftritt'
import { Abschnitt } from '../_demo/abschnitt'
import { DEMOS } from '../_demo/register'
import registry from '../../../registry.json'

// Alle Bausteine mit Live-Beispiel. Name und Zweck kommen aus registry.json, nicht doppelt von Hand.
const REIHENFOLGE = [
  'auftritt', 'text-auftritt', 'zahl', 'ablauf', 'scroll-geschichte', 'svg-zeichnen',
  'monatsraster', 'terminbuchung', 'wizard', 'anmeldung', 'aktion-knopf', 'meldung', 'reiter',
  'aufklappen', 'schublade', 'flip-liste', 'magnet', 'platzhalter', 'seitenwechsel',
  'bild-enthuellung', 'kartenstapel', 'laufband', 'zeiger-vorschau',
]

export default function Bausteine() {
  const info = Object.fromEntries(registry.items.map((i) => [i.name, i]))
  return (
    <>
      <section className="pb-16 pt-20 sm:pt-24">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Alle Bausteine, live.</h1>
        <Auftritt>
          <p data-auftritt className="mt-6 max-w-2xl text-lg text-leise">
            Jeder Baustein kommt mit einem Befehl ins Projekt, prüft „Bewegung reduzieren“ selbst und
            lässt das größte Element der Seite in Ruhe. Die Regeln dazu stehen im Handbuch.
          </p>
          <div data-auftritt className="mt-8 flex flex-wrap gap-2 text-sm">
            {REIHENFOLGE.map((n) => (
              <a key={n} href={`#${n}`} className="rounded-full border border-linie bg-flaeche px-3 py-1 font-mono text-xs hover:border-tinte">{n}</a>
            ))}
          </div>
        </Auftritt>
      </section>
      {REIHENFOLGE.map((n) => (
        <Abschnitt key={n} name={n} titel={DEMOS[n].titel} zweck={info[n]?.description ?? ''} installierbar={!!info[n]}>
          {DEMOS[n].element}
        </Abschnitt>
      ))}
    </>
  )
}

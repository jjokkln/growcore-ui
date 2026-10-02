import type { Metadata } from 'next'
import { ladeReferenzen } from './_daten'
import { Galerie } from './galerie'

export const metadata: Metadata = { title: 'Referenzen · growcore-ui', robots: { index: false, follow: false } }

// Liest bei jedem Aufruf von der Platte, damit eine neue Seite in lokal/referenzen.json ohne
// Neustart erscheint und der Build nie Kundendaten ins Ergebnis backt.
export const dynamic = 'force-dynamic'

export default function ReferenzenSeite() {
  const daten = ladeReferenzen()
  return (
    <>
      <section className="pb-10 pt-20 sm:pt-24">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Referenzen</h1>
        <p className="mt-6 max-w-2xl text-lg text-leise">
          Unsere echten Kundenseiten, nach Branche. Nur auf diesem Rechner sichtbar: Liste und Bilder
          liegen außerhalb des öffentlichen Repos.
        </p>
      </section>
      {daten ? (
        <Galerie
          kategorien={daten.kategorien}
          eintraege={daten.eintraege.map((e) => ({ ...e, bild: daten.mitBild.has(e.id) ? `/lokal/referenzen/${e.id}.jpg` : null }))}
        />
      ) : (
        <p className="rounded-lg border border-linie bg-flaeche p-6 text-leise">
          Keine lokale Liste gefunden. Sie gehört nach <code className="font-mono text-sm">lokal/referenzen.json</code>,
          die Vorschaubilder nach <code className="font-mono text-sm">public/lokal/referenzen/</code>.
        </p>
      )}
    </>
  )
}

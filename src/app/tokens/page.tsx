import Link from 'next/link'
import { DAUER, KURVE } from '@/lib/motion/tokens'
import { KurvenVergleich } from './kurven'

export default function Tokens() {
  return (
    <section className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Vier Dauern, vier Kurven.</h1>
      <p className="mt-4 max-w-2xl text-leise">
        Die einzigen Zahlen für Bewegung in einem Projekt. In TypeScript für GSAP, als CSS-Variablen für
        Übergänge und View Transitions. Ein Exit dauert rund 70 % des Enters.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <table className="w-full text-left text-sm">
          <thead className="text-leise"><tr><th className="py-2 font-normal">Dauer</th><th className="font-normal">Wert</th><th className="font-normal">wofür</th></tr></thead>
          <tbody className="divide-y divide-linie">
            {Object.entries(DAUER).map(([k, v]) => (
              <tr key={k}><td className="py-2 font-mono">{k}</td><td className="font-mono">{v * 1000} ms</td><td className="text-leise">{{ xs: 'Hover, Exit', sm: 'Feedback, Schließen', md: 'Auftritt, Öffnen', lg: 'der eine Moment' }[k]}</td></tr>
            ))}
          </tbody>
        </table>
        <table className="w-full text-left text-sm">
          <thead className="text-leise"><tr><th className="py-2 font-normal">Kurve</th><th className="font-normal">GSAP</th></tr></thead>
          <tbody className="divide-y divide-linie">
            {Object.entries(KURVE).map(([k, v]) => (
              <tr key={k}><td className="py-2 font-mono">{k}</td><td className="font-mono">{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10"><KurvenVergleich /></div>
      <Link href="/" transitionTypes={['zurueck']} className="mt-10 inline-flex items-center gap-2 text-sm text-leise hover:text-tinte">
        <span aria-hidden>←</span> Zurück zu den Bausteinen
      </Link>
    </section>
  )
}

import Link from 'next/link'
import { GRUPPEN, alleKapitel } from './handbuch/_daten'

export default function Start() {
  const alle = alleKapitel()
  return (
    <>
      <section className="max-w-3xl pb-16 pt-20 sm:pt-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">So bauen wir Oberflächen.</h1>
        <p className="mt-6 text-lg text-leise">
          Jedes Muster mit Aufbau, möglichen Funktionen, den Regeln für gute Gestaltung und einem Live-Beispiel.
          Für Kunden zum Auswählen, für das Team als Maßstab, für die KI als Nachschlagewerk.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/handbuch/grundsaetze" className="rounded-full bg-tinte px-5 py-2.5 font-medium text-papier hover:bg-akzent">Grundsätze lesen</Link>
          <Link href="/bausteine" className="rounded-full border border-linie bg-flaeche px-5 py-2.5 hover:border-tinte">Alle Bausteine</Link>
        </div>
      </section>

      {GRUPPEN.map((g) => {
        const kapitel = alle.filter((k) => k.gruppe === g.id)
        if (!kapitel.length) return null
        return (
          <section key={g.id} className="border-t border-linie py-12">
            <h2 className="text-sm font-semibold text-leise">{g.titel}</h2>
            <ul className="mt-6 grid gap-x-10 md:grid-cols-2">
              {kapitel.map((k) => (
                <li key={k.slug} className="border-b border-linie">
                  <Link href={`/handbuch/${k.slug}`} className="group grid gap-1 py-4">
                    <span className="flex items-center justify-between gap-4 text-lg font-medium tracking-tight">
                      {k.titel}
                      <span aria-hidden className="text-leise transition-transform duration-200 ease-raus group-hover:translate-x-1">→</span>
                    </span>
                    <span className="text-sm text-leise">{k.kurz}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

import type { ReactNode } from 'react'
import { siteConfig } from '@/lib/site-config'

// Gerüst für Impressum, Datenschutz und Barrierefreiheit: eine schmale Textspalte mit genau
// einer <h1>. Kopf und Fuß kommen aus dem Root-Layout, damit Impressum und Datenschutz von jeder
// Seite in einem Klick erreichbar bleiben (Pflichtkern 2).
//
// Fehlende Pflichtangaben (null in site-config) werden nie mit Platzhaltern gefüllt
// (Pflichtkern 5). Stattdessen:
//   - solange die Seite nicht indexierbar ist: ein sichtbarer Entwurfs-Hinweis mit den Feldern,
//   - sobald indexierbar (also live): Abbruch beim Rendern, der Build wird rot.
// So kann eine Seite mit unvollständigem Impressum nicht unbemerkt live gehen.

export function RechtsSeite({
  titel,
  einleitung,
  children,
}: {
  titel: string
  einleitung?: ReactNode
  children: ReactNode
}) {
  return (
    <main
      id="hauptinhalt"
      className="mx-auto w-full max-w-3xl px-5 py-14 text-foreground sm:px-6 sm:py-20 [&_a]:underline [&_a]:underline-offset-4 [&_li]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
    >
      <h1 className="mb-6 text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] text-balance hyphens-auto sm:text-4xl">
        {titel}
      </h1>
      {einleitung ? <div className="text-muted-foreground">{einleitung}</div> : null}
      {children}
    </main>
  )
}

export function Abschnitt({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-semibold tracking-tight">{titel}</h2>
      {children}
    </section>
  )
}

/**
 * Prüft die Pflichtangaben einer Rechtsseite. Live (indexierbar) und unvollständig: Abbruch.
 * Sonst ein Hinweis für Kunde und Entwickler, der vor dem Livegang verschwinden muss.
 */
export function Pflichtangaben({ fehlend, seite }: { fehlend: string[]; seite: string }) {
  if (fehlend.length === 0) return null
  if (siteConfig.indexierbar) {
    throw new Error(
      `${seite}: Pflichtangaben fehlen in src/lib/site-config.ts (${fehlend.join(', ')}). ` +
        'Ohne sie darf die Seite nicht indexierbar sein.',
    )
  }
  return (
    <div role="note" className="mb-8 rounded-md border border-border bg-muted p-4 text-sm">
      <p className="!mb-1 font-medium">Entwurf: Diese Seite ist noch unvollständig.</p>
      <p className="!mb-0 text-muted-foreground">
        Es fehlen noch Angaben in site-config: {fehlend.join(', ')}. Vor dem Livegang ergänzen.
      </p>
    </div>
  )
}

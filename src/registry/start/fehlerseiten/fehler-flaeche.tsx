import Link from 'next/link'
import type { ReactNode } from 'react'

// Die gemeinsame Fläche für 404 und Laufzeitfehler: Überschrift, ein Satz, was man tun kann,
// Knöpfe. Server-tauglich (keine Hooks), damit not-found.tsx sie ohne Client-Bundle nutzt und
// error.tsx sie trotzdem importieren kann.
// Einbau: kommt mit dem Baustein `fehlerseiten`; Farben aus den shadcn-Tokens (background,
// foreground, muted-foreground, primary, border), daher ohne Anpassung im Markenlook.

export const KNOPF_HAUPT =
  'inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export const KNOPF_NEBEN =
  'inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export function FehlerFlaeche({
  kennzeichen,
  titel,
  text,
  children,
  referenz,
}: {
  /** Kleine Zeile über der Überschrift, z. B. „Fehler 404“. */
  kennzeichen: string
  titel: string
  text: string
  /** Die Knöpfe. Ohne Angabe: zurück zur Startseite. */
  children?: ReactNode
  /** Fehler-Digest: kein Fehlertext, sondern der Schlüssel zur Serverzeile im Log. */
  referenz?: string
}) {
  return (
    <main
      id="hauptinhalt"
      className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center px-6 py-16"
    >
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
        {kennzeichen}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
        {titel}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">{text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {children ?? (
          <Link href="/" className={KNOPF_HAUPT}>
            Zur Startseite
          </Link>
        )}
      </div>
      {referenz ? (
        <p className="mt-8 text-xs text-muted-foreground">
          Falls es bleibt, nennen Sie uns bitte diese Referenz:{' '}
          <span className="font-mono">{referenz}</span>
        </p>
      ) : null}
    </main>
  )
}

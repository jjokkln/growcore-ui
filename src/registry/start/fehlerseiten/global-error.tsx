'use client'

// Die letzte Instanz: greift, wenn schon das Root-Layout scheitert. Sie ersetzt das Layout und
// bringt deshalb eigenes <html> und <body> mit. Zwei Folgen, die man nicht „aufräumen“ darf:
// - Keine Tailwind-Klassen und keine Tokens: globals.css kommt über das Root-Layout und ist hier
//   womöglich gar nicht geladen. Alles steht inline, die Dunkelvariante über prefers-color-scheme.
// - Kein metadata-Export (Client Component), der Titel kommt als React-<title>.
// Der Weg zurück ist ein echter Seitenaufbau (einfaches <a>), kein <Link>: eine weiche
// Navigation würde denselben kaputten Baum erneut rendern.
import { useEffect } from 'react'

const knopf = {
  minHeight: '2.75rem',
  padding: '0 1.25rem',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
} as const

export default function GlobalerFehler({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string }
  reset: () => void
  retry?: () => void
}) {
  useEffect(() => {
    console.error('[globaler-fehler]', { digest: error.digest }, error)
  }, [error])

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          background: '#ffffff',
          color: '#171717',
        }}
      >
        <title>Etwas ist schiefgelaufen</title>
        <style>{`
          @media (prefers-color-scheme: dark) {
            body { background: #0a0a0a !important; color: #ededed !important; }
            .gf-gedaempft { color: #a3a3a3 !important; }
            .gf-neben { background: #0a0a0a !important; color: #ededed !important; border-color: #404040 !important; }
            .gf-haupt { background: #ededed !important; color: #0a0a0a !important; }
          }
          .gf-knopf:focus-visible { outline: 2px solid #737373; outline-offset: 2px; }
        `}</style>
        <main style={{ width: '100%', maxWidth: '36rem' }}>
          <h1 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem', lineHeight: 1.2, fontWeight: 600 }}>
            Etwas ist schiefgelaufen
          </h1>
          <p className="gf-gedaempft" style={{ margin: '0 0 1.75rem', lineHeight: 1.6, color: '#525252' }}>
            Die Seite konnte nicht geladen werden. Bitte versuchen Sie es noch einmal oder laden Sie die
            Seite neu.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              type="button"
              className="gf-knopf gf-haupt"
              onClick={() => (retry ?? reset)()}
              style={{ ...knopf, border: '1px solid transparent', background: '#171717', color: '#fafafa' }}
            >
              Erneut versuchen
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- echter Seitenaufbau gewollt, siehe oben */}
            <a
              href="/"
              className="gf-knopf gf-neben"
              style={{
                ...knopf,
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                border: '1px solid #d4d4d4',
                background: '#ffffff',
                color: '#171717',
              }}
            >
              Zur Startseite
            </a>
          </div>
          {error.digest ? (
            <p className="gf-gedaempft" style={{ margin: '2rem 0 0', fontSize: '0.75rem', color: '#525252' }}>
              Falls es bleibt, nennen Sie uns bitte diese Referenz:{' '}
              <span style={{ fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>{error.digest}</span>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  )
}

import 'server-only'

// Die Rollen-Testleiste existiert nur auf dem eigenen Rechner. Zwei unabhängige Sperren:
//
//   1. NODE_ENV !== 'production': Next setzt NODE_ENV beim Build als Konstante ein. Im
//      Produktionsbau fällt jeder Zweig dahinter als toter Code weg, die Leiste ist nicht im Bundle.
//   2. DEV_TOOLBAR === '1': bewusst in .env.local gesetzt. Kein NEXT_PUBLIC_, nie in Vercel. Selbst
//      ein versehentlich deployter Entwicklungsbau bleibt damit stumm.
//
// Nichts an der Leiste darf ohne isDevLeisteAn() erreichbar sein. Jede Server Action ruft
// devLeistePruefen() als erste Anweisung auf.
//
// Diese Sperren schützen die Leiste, nicht die Prüfkonten. Läuft die Leiste gegen die
// Produktionsdatenbank, sind die .test-Konten auch live anmeldbar. Dafür lib/dev/produktions-sperre.ts.

export function isDevLeisteAn(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.DEV_TOOLBAR === '1'
}

export function devLeistePruefen(): void {
  if (!isDevLeisteAn()) throw new Error('Die Rollen-Testleiste ist aus.')
}

/** Das gemeinsame Passwort aller Prüfkonten, oder null, wenn es nicht gesetzt ist. */
export function devPasswort(): string | null {
  const wert = process.env.DEV_ACCOUNT_PASSWORD
  return wert && wert.length > 0 ? wert : null
}

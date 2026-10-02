export type DevGruppe = 'intern' | 'nutzer' | 'negativ'

// Die Prüfkonten der Rollen-Testleiste: wer existiert, welche Rolle, wozu. Reine Daten und reine
// Funktionen, importiert von der Leiste UND den Server Actions. Keine Geheimnisse: Das gemeinsame
// Passwort steht in DEV_ACCOUNT_PASSWORD (.env.local, nur Server).
//
// Beim Übernehmen anpassen: Rollen und Konten unten. Nicht „ein Admin und ein Nutzer“, sondern eine
// Matrix mit Negativtests. Die Negativfälle sind der Punkt:
//   - gesperrt: aktiv = false, in Supabase Auth NICHT gebannt. Die Anmeldung gelingt, die App muss
//     die gültige Sitzung hinauswerfen. Ein Bann würde früher abweisen und diesen Weg nie zeigen.
//   - ohne Zugriff / fremder Mandant: gleiche Rolle, aber nichts freigegeben → Listen müssen leer
//     bleiben. Ergänzen, sobald das Projekt Mandanten oder Freigaben hat.
//
// Adressen nur auf der reservierten Endung .test (RFC 2606): Dorthin geht nie eine Mail. Die
// Namen tragen „DEV ·“, damit sie in jeder Nutzerliste als Testdaten erkennbar sind.
//
// Sicherheitsregel: Jeder Schreibzugriff der Leiste geht durch findDevKonto(), eine Exakt-Suche
// in dieser Liste. Kein Muster, kein Endungsvergleich: Ein echtes Konto ist über die Leiste nicht
// erreichbar, auch nicht mit gebautem Request.
//
// Einbau: Rollen stehen in app_metadata.rolle (nur serverseitig setzbar, steht im JWT). Hat das
// Projekt eine profiles-Tabelle, schreibt lib/dev/anlegen.ts sie zusätzlich (dort markiert).

export type DevKonto = {
  email: string
  /** Kurzname auf dem Knopf. */
  label: string
  /** Wert für app_metadata.rolle. */
  rolle: string
  /** Wert für app_metadata.aktiv. */
  aktiv: boolean
  gruppe: DevGruppe
  /** Wofür dieses Konto taugt; steht als Hinweis in der Leiste. */
  hinweis: string
}

export const DEV_KONTEN: DevKonto[] = [
  {
    email: 'dev-admin@projekt.test',
    label: 'Admin',
    rolle: 'admin',
    aktiv: true,
    gruppe: 'intern',
    hinweis: 'Höchste Rolle der App: alles, was hinter der Admin-Prüfung liegt.',
  },
  {
    email: 'dev-nutzer@projekt.test',
    label: 'Nutzer',
    rolle: 'nutzer',
    aktiv: true,
    gruppe: 'nutzer',
    hinweis: 'Die engste normale Sicht. Was hier zu sehen ist, sieht jeder Kunde.',
  },
  {
    email: 'dev-gesperrt@projekt.test',
    label: 'Gesperrt',
    rolle: 'nutzer',
    aktiv: false,
    gruppe: 'negativ',
    hinweis: 'aktiv = false: Die Anmeldung gelingt, die App muss die Sitzung hinauswerfen.',
  },
]

export const DEV_GRUPPEN_BESCHRIFTUNG: Record<DevGruppe, string> = {
  intern: 'Intern',
  nutzer: 'Nutzer',
  negativ: 'Negativtests',
}

/** Exakt-Suche, kein Muster. null für jede Adresse, die nicht in DEV_KONTEN steht. */
export function findDevKonto(email: string | null | undefined): DevKonto | null {
  if (!email) return null
  const gesucht = email.trim().toLowerCase()
  return DEV_KONTEN.find((konto) => konto.email === gesucht) ?? null
}

// Seiten, auf denen man nach einem Wechsel nicht stehen bleiben soll. Ein Ziel /login löst eine
// zweite Umleitung aus (angemeldet auf der Anmeldeseite), und in diesem Zustand stellt der Browser
// Formularwerte wieder her und feuert change: So landeten einmal Schreibzugriffe, die niemand
// ausgelöst hatte. Beim Übernehmen um die eigenen Anmelde-Pfade ergänzen.
const KEIN_ZIEL = ['/login', '/anmelden', '/passwort', '/auth', '/einladung']

/** Wohin nach dem Wechsel: dieselbe Seite, außer sie gehört zum Anmelden. */
export function wechselZiel(pfad: string): string {
  const sauber = pfad.split('?')[0] || '/'
  return KEIN_ZIEL.some((p) => sauber === p || sauber.startsWith(`${p}/`) || sauber.startsWith(`${p}-`))
    ? '/'
    : sauber
}

/**
 * Nur eigene Pfade als Ziel nach dem Wechsel. Ein ungeprüftes Umleitungsziel an einer
 * anmeldeähnlichen Aktion ist ein Phishing-Werkzeug.
 */
export function sicheresZiel(roh: unknown, rueckfall = '/'): string {
  const wert = typeof roh === 'string' ? roh.trim() : ''
  if (!wert.startsWith('/') || wert.startsWith('//') || wert.startsWith('/\\')) return rueckfall
  return wert
}

import 'server-only'
import { devPasswort } from '@/lib/dev/freigabe'
import { DEV_KONTEN } from '@/lib/dev/konten'
import { createAdminClient } from '@/lib/supabase/admin'

// Legt die Prüfkonten aus DEV_KONTEN an oder stellt sie wieder her, idempotent. Mit dem Admin-Client,
// bewusst nicht über die Produkt-Actions: Die Leiste ist ein Werkzeug für Testdaten und wird benutzt,
// während man als Nutzer angemeldet ist, also genau dann, wenn diese Actions zu Recht ablehnen.
//
// Angefasst werden nur Adressen aus DEV_KONTEN. Kein echtes Konto ist darüber erreichbar.
// Gesperrte Konten werden NICHT in Auth gebannt, nur app_metadata.aktiv = false (siehe konten.ts).
//
// Einbau: nur über die Server Action devKontenAnlegen (app/actions/dev-leiste-aktionen.ts).

/** null bei Erfolg, sonst die erste Fehlermeldung. */
export async function kontenAnlegen(): Promise<string | null> {
  const passwort = devPasswort()
  if (!passwort) return 'DEV_ACCOUNT_PASSWORD fehlt in .env.local.'

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 })
  if (error) return `Konten lesen: ${error.message}`
  const vorhanden = new Map(data.users.map((nutzer) => [nutzer.email?.toLowerCase() ?? '', nutzer.id]))

  for (const konto of DEV_KONTEN) {
    const app_metadata = { rolle: konto.rolle, aktiv: konto.aktiv }
    const user_metadata = { full_name: `DEV · ${konto.label}` }
    const id = vorhanden.get(konto.email)

    const ergebnis = id
      ? await admin.auth.admin.updateUserById(id, { password: passwort, app_metadata, user_metadata })
      : await admin.auth.admin.createUser({
          email: konto.email,
          password: passwort,
          email_confirm: true,
          app_metadata,
          user_metadata,
        })
    if (ergebnis.error) return `${konto.email}: ${ergebnis.error.message}`

    // Hat das Projekt eine profiles-Tabelle mit Rolle und aktiv, hier zusätzlich schreiben und die
    // getroffenen Zeilen zählen (.select('id'), Regel supabase-sicherheit 12).
  }

  return null
}

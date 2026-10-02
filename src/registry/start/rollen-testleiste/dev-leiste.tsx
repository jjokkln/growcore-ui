import { DevLeisteClient } from '@/components/dev/dev-leiste-client'
import { isDevLeisteAn } from '@/lib/dev/freigabe'
import { findDevKonto } from '@/lib/dev/konten'
import { createClient } from '@/lib/supabase/server'

// Rollen-Testleiste: schmale Leiste über der App, nur auf dem eigenen Rechner. Links, wer man gerade
// ist, rechts ein Knopf, der Kontowechsel, RLS-Zähler und Werkzeuge aufklappt. Pflicht-Baustein für
// jede Software mit Konten, ab der ersten Rolle (Regel pflicht-bausteine-apps).
//
// Gibt null zurück, bevor irgendetwas gelesen wird, wenn die Leiste aus ist: Ein Produktionsbau
// fragt weder Cookies noch Datenbank ab und rendert nichts. Siehe lib/dev/freigabe.ts.
//
// Einbau im Wurzel-Layout (nicht im App-Rahmen: Sie muss auch auf /login stehen, dort landet man
// nach dem Wechsel auf ein gesperrtes Konto):
//
//   <body>
//     <DevLeiste />
//     {children}
//   </body>
//
// .env.local: DEV_TOOLBAR=1, DEV_ACCOUNT_PASSWORD=<lang, zufällig>. Dann einmal „Prüfkonten anlegen“.

export async function DevLeiste() {
  if (!isDevLeisteAn()) return null

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  const email = typeof claims?.email === 'string' ? claims.email : null
  const rolle = claims?.app_metadata?.rolle

  return (
    <DevLeisteClient
      email={email}
      rolle={typeof rolle === 'string' ? rolle : null}
      istPruefkonto={findDevKonto(email) !== null}
      passwortGesetzt={Boolean(process.env.DEV_ACCOUNT_PASSWORD)}
    />
  )
}

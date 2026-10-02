import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseFetch } from '@/lib/supabase/query-budget'
import { supabaseUrl } from '@/lib/supabase/umgebung'

// Supabase mit dem geheimen Schlüssel: UMGEHT Row Level Security. Nur auf dem Server.
// `server-only` lässt den Build scheitern, sobald eine Client Component diese Datei importiert.
//
// Wofür: Schreibwege, die bewusst ohne Sitzung laufen und ihre Berechtigung selbst prüfen
// (Formular-Eingang in `leads`, Audit-Log, Einladungen, Webhooks). Nie, um eine fehlende Policy
// zu umgehen: Dann fehlt die Policy.
//
// Schlüssel: SUPABASE_SECRET_KEY (sb_secret_…), bei älteren Projekten SUPABASE_SERVICE_ROLE_KEY.
// Kein NEXT_PUBLIC_ davor, sonst steht er im Browser.
//
// Einbau: `const admin = createAdminClient()` aus '@/lib/supabase/admin'.

export function createAdminClient() {
  const geheimerSchluessel =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!geheimerSchluessel) {
    throw new Error('SUPABASE_SECRET_KEY fehlt (.env.local bzw. Vercel-Umgebung, nur Server).')
  }

  return createSupabaseClient(supabaseUrl(), geheimerSchluessel, {
    auth: { autoRefreshToken: false, persistSession: false },
    // Nur beim Entwickeln, siehe query-budget.ts. Zählt mit dem RLS-Client zusammen: beides ist
    // Last auf derselben Datenbank.
    global: { fetch: supabaseFetch() },
  })
}

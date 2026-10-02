import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseFetch } from '@/lib/supabase/query-budget'
import { oeffentlicherSchluessel, supabaseUrl } from '@/lib/supabase/umgebung'

// Supabase auf dem Server (Server Components, Server Actions, Route Handler). Öffentlicher Schlüssel
// plus die Sitzung aus den Cookies, also gilt RLS mit der Rolle des angemeldeten Nutzers.
//
// cookies() ist in Next 16 asynchron: immer `await createClient()`.
// Identität über `supabase.auth.getClaims()` (prüft das JWT lokal), nicht getUser() (Netzwerkaufruf
// je Render). getUser() nur dort, wo eine serverseitig widerrufene Sitzung zählen muss: Admin,
// Geld, Löschen (Regel supabase-sicherheit 4).
//
// Einbau: `const supabase = await createClient()` aus '@/lib/supabase/server'.

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl(), oeffentlicherSchluessel(), {
    // Nur beim Entwickeln: eine Terminalzeile je Seitenaufruf mit Abfragen und Runden.
    global: { fetch: supabaseFetch() },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(zuSetzen) {
        try {
          zuSetzen.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Aus einer Server Component heraus sind Cookies schreibgeschützt. Unbedenklich, solange
          // der Proxy die Sitzung auffrischt (lib/supabase/sitzung.ts).
        }
      },
    },
  })
}

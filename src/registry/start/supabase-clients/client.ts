import { createBrowserClient } from '@supabase/ssr'
import { oeffentlicherSchluessel, supabaseUrl } from '@/lib/supabase/umgebung'

// Supabase im Browser (Client Components). Arbeitet mit dem öffentlichen Schlüssel, also gilt RLS:
// Der angemeldete Nutzer sieht nur, was die Policies erlauben, ohne Anmeldung gilt die Rolle anon.
//
// Eins von drei Clients, nie vermischen (Regel supabase-sicherheit 1):
//   client.ts  Browser          server.ts  Server Components, Actions, Routen          admin.ts  nur Server, umgeht RLS
//
// Typen: Nach `npx supabase gen types typescript --project-id <id> > src/types/database.types.ts`
// hier `createBrowserClient<Database>(…)` setzen, ebenso in server.ts und admin.ts.
//
// Einbau: `import { createClient } from '@/lib/supabase/client'`.

export function createClient() {
  return createBrowserClient(supabaseUrl(), oeffentlicherSchluessel())
}

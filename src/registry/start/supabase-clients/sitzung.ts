import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { oeffentlicherSchluessel, supabaseUrl } from '@/lib/supabase/umgebung'

// Frischt die Supabase-Sitzung im Proxy auf. Server Components dürfen keine Cookies schreiben;
// ohne diesen Schritt läuft das Zugriffstoken nach einer Stunde ab und die Seiten sehen den
// Nutzer als abgemeldet, obwohl das Refresh-Token noch gilt.
//
// Nur nötig, wenn es eine Anmeldung gibt. Eine Website, die Supabase nur für den Formular-Eingang
// nutzt, braucht keinen Proxy.
//
// Prüfung über getClaims(): Das JWT wird lokal gegen die Signaturschlüssel geprüft, kein
// Netzwerkaufruf je Anfrage. Der Proxy läuft auch für Prefetches, RSC-Payloads und Server-Action-
// POSTs. Darum hier keine Datenbankabfrage ohne Kurzzeit-Memo (Regel supabase-sicherheit,
// „Sparsamkeit“). Der Proxy allein ist kein Schutz: Jede Action und Route prüft selbst.
//
// Einbau in src/proxy.ts (Next 16 heißt die Datei proxy.ts, nicht middleware.ts):
//
//   import type { NextRequest } from 'next/server'
//   import { sitzungAuffrischen } from '@/lib/supabase/sitzung'
//
//   export async function proxy(request: NextRequest) {
//     const { antwort } = await sitzungAuffrischen(request)
//     return antwort
//   }
//
//   export const config = {
//     matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)'],
//   }

export async function sitzungAuffrischen(request: NextRequest) {
  let antwort = NextResponse.next({ request })

  // Für jede Anfrage ein neuer Client: Die Cache-Header kommen nur mit dem ersten Cookie-Schreiben.
  const supabase = createServerClient(supabaseUrl(), oeffentlicherSchluessel(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(zuSetzen, kopfzeilen) {
        zuSetzen.forEach(({ name, value }) => request.cookies.set(name, value))
        antwort = NextResponse.next({ request })
        zuSetzen.forEach(({ name, value, options }) => antwort.cookies.set(name, value, options))
        // Antworten, die Sitzungscookies setzen, dürfen in keinem Cache landen, sonst bekommt ein
        // anderer Besucher dieses Token.
        Object.entries(kopfzeilen ?? {}).forEach(([schluessel, wert]) =>
          antwort.headers.set(schluessel, wert),
        )
      },
    },
  })

  // Zwischen createServerClient und getClaims nichts anderes tun: Sonst kann ein Refresh verloren
  // gehen, und der Nutzer fliegt zufällig hinaus.
  const { data } = await supabase.auth.getClaims()

  return {
    /**
     * Diese Antwort zurückgeben (oder ihre Cookies auf eine Umleitung übertragen). Ein Getter, weil
     * ein späteres signOut() die Antwort mit gelöschten Cookies neu baut.
     */
    get antwort() {
      return antwort
    },
    /** Inhalt des geprüften JWT, null ohne Sitzung. `claims.sub` ist die Nutzer-Id. */
    claims: data?.claims ?? null,
    /** Derselbe Client, z. B. für signOut() in einer Sperre. */
    supabase,
  }
}

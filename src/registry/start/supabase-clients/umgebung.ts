const WO = '(.env.local bzw. Vercel-Umgebung)'

// Wo die Datenbank liegt und mit welchem öffentlichen Schlüssel der Browser sie anspricht.
// Eine Stelle für beide Werte, damit ein fehlender Eintrag mit einer lesbaren Meldung abbricht
// statt mit „Invalid URL“ irgendwo in supabase-js.
//
// Schlüssel nach dem neuen Schema von Supabase:
//   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  sb_publishable_…  öffentlich, RLS gilt
//   SUPABASE_SECRET_KEY                   sb_secret_…       nur Server, umgeht RLS (admin.ts)
// Ältere Projekte mit anon-/service_role-Schlüssel laufen über die Rückfälle weiter.
//
// Projekt immer in Frankfurt (eu-central-1), Pflichtkern 1.
// Einbau: nur die drei Clients und lib/supabase/sitzung.ts importieren das hier.

export function supabaseUrl(): string {
  // Wörtlich ausgeschrieben: Next ersetzt NEXT_PUBLIC_* im Browser-Bundle nur so.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error(`NEXT_PUBLIC_SUPABASE_URL fehlt ${WO}.`)
  return url
}

export function oeffentlicherSchluessel(): string {
  const schluessel =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!schluessel) throw new Error(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY fehlt ${WO}.`)
  return schluessel
}

import { findDevKonto } from '@/lib/dev/konten'

// Harte Sperre für die Prüfkonten im Betrieb. Die Leiste selbst ist im Produktionsbau weg, die
// Konten aber nicht: Teilen sich Entwicklung und Betrieb eine Datenbank, sind die .test-Adressen mit
// dem gemeinsamen Passwort auch auf der Live-Domain anmeldbar (gefunden 2026-09-23: ein Prüf-Admin
// mit Sicht auf alle Mandanten). Auf Vercel wird jede Sitzung eines Prüfkontos deshalb beendet.
//
// Grenze: Das sperrt nur die App. Supabase stellt das Token weiter aus, die REST-API bleibt mit dem
// Passwort offen. Darum zusätzlich: eigene Entwicklungsdatenbank (Supabase-Branch) oder die
// Prüfkonten nach dem Test entfernen.
//
// Einbau in src/proxy.ts, direkt nach sitzungAuffrischen():
//
//   const sitzung = await sitzungAuffrischen(request)
//   if (istGesperrtesPruefkonto(sitzung.claims?.email)) {
//     await sitzung.supabase.auth.signOut()
//     const umleitung = NextResponse.redirect(new URL('/', request.url))
//     sitzung.antwort.cookies.getAll().forEach((cookie) => umleitung.cookies.set(cookie))
//     return umleitung
//   }
//   return sitzung.antwort

export function istGesperrtesPruefkonto(email: unknown): boolean {
  if (process.env.VERCEL !== '1') return false
  if (typeof email !== 'string') return false
  // Exakte Liste ODER die reservierte Endung: Hier ist „zu viel sperren“ die sichere Richtung.
  return findDevKonto(email) !== null || email.trim().toLowerCase().endsWith('.test')
}

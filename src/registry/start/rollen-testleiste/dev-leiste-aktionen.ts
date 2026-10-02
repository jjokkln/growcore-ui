'use server'

// Server Actions der Rollen-Testleiste. NICHT Teil des Produkts.
//
// Jede beginnt mit devLeistePruefen(): wirft, außer NODE_ENV !== 'production' UND DEV_TOOLBAR=1.
// Im Produktionsbau ist die NODE_ENV-Hälfte eine Konstante, auf Vercel sind diese Funktionen also
// nie erreichbar. scripts/dev-leiste.test.mjs prüft, dass das so bleibt.
//
// Der Wechsel ist eine echte Anmeldung mit Passwort, kein selbst gebautes Token. Nur so verhalten
// sich Proxy, Layout, JWT und RLS danach genau wie für diese Person im Betrieb, und genau das will
// man prüfen.
//
// Einbau: Die Leiste (components/dev/dev-leiste-client.tsx) ruft sie auf.
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kontenAnlegen } from '@/lib/dev/anlegen'
import { devLeistePruefen, devPasswort } from '@/lib/dev/freigabe'
import { findDevKonto, sicheresZiel } from '@/lib/dev/konten'
import { ladeDevLeistenDaten, type DevLeistenDaten } from '@/lib/dev/zustand'
import { createClient } from '@/lib/supabase/server'

export async function devWechseln(formData: FormData): Promise<void> {
  devLeistePruefen()

  // Exakt-Suche in DEV_KONTEN: Eine Adresse aus dem Request wandert nie direkt in eine Anmeldung.
  const konto = findDevKonto(String(formData.get('email') ?? ''))
  if (!konto) throw new Error('Kein Prüfkonto.')
  const passwort = devPasswort()
  if (!passwort) throw new Error('DEV_ACCOUNT_PASSWORD fehlt in .env.local.')

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: konto.email, password: passwort })
  if (error) {
    console.error(`[dev-leiste] Wechsel zu ${konto.email} fehlgeschlagen:`, error.message)
    redirect('/?dev=wechsel-fehlgeschlagen')
  }

  redirect(sicheresZiel(formData.get('ziel'), '/'))
}

/** Lesend: Bestand der Prüfkonten und die RLS-Zähler der aktuellen Sitzung. */
export async function devDatenLaden(): Promise<DevLeistenDaten> {
  devLeistePruefen()

  return ladeDevLeistenDaten()
}

export async function devKontenAnlegen(): Promise<{ fehler: string | null }> {
  devLeistePruefen()

  const fehler = await kontenAnlegen()
  revalidatePath('/', 'layout')
  return { fehler }
}

/** Abmelden: der Weg zurück zum eigenen, echten Konto (dessen Passwort kennt die Leiste nicht). */
export async function devAbmelden(): Promise<void> {
  devLeistePruefen()

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

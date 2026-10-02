import 'server-only'
import { DEV_KONTEN, type DevKonto } from '@/lib/dev/konten'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// Was die Rollen-Testleiste anzeigt. Zwei sehr verschiedene Lesewege, und sie zu vermischen hieße,
// dass das Werkzeug lügt:
//
//   - Bestand der Prüfkonten (wer existiert, mit welcher Rolle): mit dem Admin-Client. Muss so sein,
//     als Nutzer sieht man fremde Konten nicht, die Leiste soll aber die ganze Matrix zeigen.
//   - Die Zähler („was sieht dieses Konto wirklich“): mit dem RLS-Client der Sitzung, demselben wie
//     jede Seite. Alles andere misst die Sicht des Admins und sagt nichts.
//
// Ein Zähler, der fehlschlägt, zeigt „Fehler“, nie 0. Leerer Zustand und kaputte Policy sehen von
// außen gleich aus. Ohne Sitzung wird nicht gezählt: Als anon wäre jede Tabelle rot, und wer dort
// „Fehler“ sieht, wo keiner ist, glaubt der Leiste nicht mehr, wo einer ist.
//
// Geladen wird erst beim Öffnen der Leiste, nicht bei jedem Render des Layouts (sonst laufen die
// Zähler bei jedem Seitenaufruf gegen die echte Datenbank).
//
// Beim Übernehmen anpassen: GEZAEHLT.

/**
 * Tabellen, deren Sichtbarkeit sich zwischen den Rollen wirklich unterscheidet. Eine Tabelle, die
 * alle gleich sehen, ist eine Zahl ohne Aussage. Beispiel: { tabelle: 'projekte', label: 'Projekte' }.
 */
export const GEZAEHLT: { tabelle: string; label: string }[] = []

export type DevKontoZustand = {
  konto: DevKonto
  /** false, solange das Konto in dieser Datenbank noch nicht angelegt ist. */
  vorhanden: boolean
  /** true, wenn Rolle oder aktiv von DEV_KONTEN abweichen. */
  abweichend: boolean
}

export type DevZaehler = {
  label: string
  anzahl: number | null
  /** Meldung der Datenbank, wenn das Zählen fehlschlug. Wird statt einer Zahl angezeigt. */
  fehler: string | null
}

export type DevLeistenDaten = {
  konten: DevKontoZustand[]
  zaehler: DevZaehler[]
  /** Fehler beim Lesen der Prüfkonten (z. B. SUPABASE_SECRET_KEY fehlt). */
  fehler: string | null
}

async function ladeKonten(): Promise<{ konten: DevKontoZustand[]; fehler: string | null }> {
  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 })
  if (error) {
    return {
      konten: DEV_KONTEN.map((konto) => ({ konto, vorhanden: false, abweichend: true })),
      fehler: error.message,
    }
  }

  const nachEmail = new Map(data.users.map((nutzer) => [nutzer.email?.toLowerCase() ?? '', nutzer]))
  return {
    konten: DEV_KONTEN.map((konto) => {
      const nutzer = nachEmail.get(konto.email)
      const meta = nutzer?.app_metadata ?? {}
      return {
        konto,
        vorhanden: Boolean(nutzer),
        abweichend: !nutzer || meta.rolle !== konto.rolle || meta.aktiv !== konto.aktiv,
      }
    }),
    fehler: null,
  }
}

async function ladeZaehler(): Promise<DevZaehler[]> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) return []

  return Promise.all(
    GEZAEHLT.map(async ({ tabelle, label }) => {
      const { count, error } = await supabase
        .from(tabelle)
        .select('*', { count: 'exact', head: true })
      return { label, anzahl: error ? null : (count ?? 0), fehler: error ? error.message : null }
    }),
  )
}

export async function ladeDevLeistenDaten(): Promise<DevLeistenDaten> {
  try {
    const [{ konten, fehler }, zaehler] = await Promise.all([ladeKonten(), ladeZaehler()])
    return { konten, zaehler, fehler }
  } catch (fehler) {
    return {
      konten: DEV_KONTEN.map((konto) => ({ konto, vorhanden: false, abweichend: true })),
      zaehler: [],
      fehler: fehler instanceof Error ? fehler.message : String(fehler),
    }
  }
}

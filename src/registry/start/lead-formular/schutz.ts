import 'server-only'
import { createHmac } from 'node:crypto'
import { HONIGFALLE_FELD, ZEITFALLE_FELD } from '@/lib/lead/schema'
import { createAdminClient } from '@/lib/supabase/admin'

// Missbrauchsschutz für das öffentliche Kontaktformular. Jeder Eingang verschickt Mails über die
// Absenderdomain des Kunden. Ohne Bremse ist das Formular ein Werkzeug, um das Postfach zu fluten
// und die Domain-Reputation zu ruinieren.
//
// Drei Bremsen, absteigend nach Wirksamkeit:
//   1. Rate-Limit je Quelle, in der Datenbank (Funktion anfrage_zaehlen, Migration *_leads.sql).
//      Nicht im Speicher: Auf Vercel hat jede Instanz ihren eigenen Speicher, ein Zähler dort
//      begrenzt also nichts Verlässliches.
//   2. Honigfalle: ein unsichtbares Feld, das nur Bots ausfüllen.
//   3. Zeitfalle: Wer das Formular in unter MINDESTDAUER_MS abschickt, hat es nicht gelesen.
//
// Datensparsam: Die IP-Adresse wird nicht gespeichert, nur ein HMAC davon (Schlüssel ist der
// geheime Supabase-Schlüssel), und die Zeile verschwindet nach spätestens einem Tag. Gehört trotzdem
// in die Datenschutzerklärung (berechtigtes Interesse, Missbrauchsschutz).
//
// Einbau: nur aus der Server Action app/actions/lead.ts.

/** Erlaubte Anfragen je Quelle im Fenster. */
const GRENZE = 5
const FENSTER_SEKUNDEN = 60 * 60

/** Schneller schickt kein Mensch ein Formular mit Nachricht ab. */
const MINDESTDAUER_MS = 3000

/**
 * Grund, warum dieser Eingang von einem Bot stammt, oder null. Der Aufrufer antwortet dem Bot
 * trotzdem mit Erfolg, damit er nichts lernt, speichert aber nichts und verschickt nichts.
 *
 * Fehlt der Zeitstempel, zählt das als Bot: Das Formular setzt ihn im Browser, ohne JavaScript
 * lässt es sich nicht abschicken.
 */
export function botGrund(formData: FormData): string | null {
  const honig = formData.get(HONIGFALLE_FELD)
  if (typeof honig === 'string' && honig.trim() !== '') return 'Honigfalle'

  const bereitSeit = Number(formData.get(ZEITFALLE_FELD))
  if (!Number.isFinite(bereitSeit) || bereitSeit <= 0) return 'Zeitfalle ohne Zeitstempel'
  if (Date.now() - bereitSeit < MINDESTDAUER_MS) return 'Zeitfalle zu schnell'

  return null
}

/** Pseudonymer Schlüssel für die Quelle. Nie die IP selbst speichern. */
function quellSchluessel(ip: string): string {
  const geheim = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return 'lead:' + createHmac('sha256', geheim).update(ip).digest('hex').slice(0, 32)
}

/**
 * Zählt den Eingang und meldet, ob die Quelle noch darf. Fällt die Zählung aus (Migration fehlt,
 * Datenbank nicht erreichbar), wird der Eingang durchgelassen und der Fehler laut geloggt: Eine
 * verlorene Anfrage wiegt schwerer als eine Spam-Mail mehr.
 */
export async function darfAnfragen(ip: string): Promise<boolean> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.rpc('anfrage_zaehlen', {
      p_schluessel: quellSchluessel(ip),
      p_grenze: GRENZE,
      p_fenster_sekunden: FENSTER_SEKUNDEN,
    })
    if (error) {
      console.error('[lead] Rate-Limit nicht zählbar, Eingang durchgelassen:', error.message)
      return true
    }
    return data !== false
  } catch (fehler) {
    console.error('[lead] Rate-Limit nicht zählbar, Eingang durchgelassen:', fehler)
    return true
  }
}

/** Client-IP aus den Kopfzeilen des Hosters. Auf Vercel ist der erste Eintrag der echte Client. */
export function clientIp(kopf: Headers): string {
  const weitergeleitet = kopf.get('x-forwarded-for')
  if (weitergeleitet) return weitergeleitet.split(',')[0].trim()
  return kopf.get('x-real-ip')?.trim() || 'unbekannt'
}

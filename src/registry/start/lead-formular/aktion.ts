'use server'

// Server Action des Kontaktformulars: prüfen, bremsen, speichern, benachrichtigen.
//
// Reihenfolge mit Absicht:
//   1. Bot? → Erfolg vortäuschen, nichts speichern, nichts senden.
//   2. Eingabe prüfen (Zod). Der Browser prüft auch, aber nur zum Komfort.
//   3. Rate-Limit je Quelle (Datenbank, nicht Speicher).
//   4. In `leads` schreiben, über den Admin-Client: Die Tabelle hat für anon keine Rechte, sonst
//      könnte jeder mit dem öffentlichen Schlüssel an der Action vorbei Zeilen und Felder setzen.
//   5. Mails. Ein Mailfehler macht den Eingang nicht ungültig, er steht schon in der Datenbank.
//      Was daraus folgte, steht in `benachrichtigt_am` (Pflichtkern 12: Spur mit Folge, die Mail
//      selbst ist kein Nachweis).
//
// Jede exportierte Funktion hier ist ein öffentlicher Endpunkt. Darum nur diese eine.
// Einbau: Die Komponente components/lead-formular.tsx ruft sie auf.
import { headers } from 'next/headers'
import { leadSchema, type LeadErgebnis, type LeadFeld } from '@/lib/lead/schema'
import { leadVerschicken } from '@/lib/lead/mail'
import { botGrund, clientIp, darfAnfragen } from '@/lib/lead/schutz'
import { siteConfig } from '@/lib/site-config'
import { createAdminClient } from '@/lib/supabase/admin'

function text(formData: FormData, feld: string): string {
  const wert = formData.get(feld)
  return typeof wert === 'string' ? wert : ''
}

/** Nur eigene Pfade, kurz. Sagt dem Kunden, von welcher Seite die Anfrage kam. */
function quelleAus(formData: FormData): string | null {
  const roh = text(formData, 'quelle').trim()
  return /^\/[\w\-./]{0,199}$/.test(roh) ? roh : null
}

function fehlschlag(): LeadErgebnis {
  const email = siteConfig.kontakt.email
  return {
    ok: false,
    meldung: email
      ? `Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie an ${email}.`
      : 'Das hat leider nicht geklappt. Bitte versuchen Sie es in ein paar Minuten erneut.',
  }
}

export async function leadAbsenden(formData: FormData): Promise<LeadErgebnis> {
  // audit-ausnahme: Die Anfrage ist selbst der Datensatz in `leads` (Zeitpunkt, Inhalt, Folge in
  // benachrichtigt_am). Ein Besucher ohne Konto hat keinen Handelnden fürs Audit-Log.
  const bot = botGrund(formData)
  if (bot) {
    console.warn(`[lead] Eingang verworfen: ${bot}`)
    return { ok: true }
  }

  const geprueft = leadSchema.safeParse({
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    telefon: text(formData, 'telefon'),
    nachricht: text(formData, 'nachricht'),
  })
  if (!geprueft.success) {
    const felder: Partial<Record<LeadFeld, string>> = {}
    for (const fehler of geprueft.error.issues) {
      const feld = fehler.path[0] as LeadFeld
      felder[feld] ??= fehler.message
    }
    return { ok: false, meldung: 'Bitte prüfen Sie die markierten Felder.', felder }
  }

  if (!(await darfAnfragen(clientIp(await headers())))) {
    return {
      ok: false,
      meldung: 'Es kamen gerade sehr viele Anfragen von Ihrem Anschluss. Bitte versuchen Sie es später erneut.',
    }
  }

  const lead = geprueft.data
  const quelle = quelleAus(formData)
  const admin = createAdminClient()

  // .select('id'): Ein Schreibvorgang ohne Treffer liefert keinen Fehler. Gezählt wird die Zeile,
  // nicht das Ausbleiben eines Fehlers (Regel supabase-sicherheit 12).
  const { data: zeile, error } = await admin
    .from('leads')
    .insert({
      name: lead.name,
      email: lead.email || null,
      telefon: lead.telefon || null,
      nachricht: lead.nachricht,
      quelle,
    })
    .select('id')
    .single()

  if (error || !zeile) {
    console.error('[lead] Speichern fehlgeschlagen:', error?.message ?? 'keine Zeile zurück')
    return fehlschlag()
  }

  const id = String(zeile.id)
  if (await leadVerschicken({ ...lead, id, quelle })) {
    const { data: vermerkt, error: vermerkFehler } = await admin
      .from('leads')
      .update({ benachrichtigt_am: new Date().toISOString() })
      .eq('id', id)
      .select('id')
    if (vermerkFehler || vermerkt?.length !== 1) {
      console.error(`[lead] benachrichtigt_am für ${id} nicht gesetzt:`, vermerkFehler?.message ?? '0 Zeilen')
    }
  }

  return { ok: true }
}

import 'server-only'
import type { AuditAktion, PersonenEntitaet, SonstigeEntitaet } from '@/lib/audit/aktionen'
import { createAdminClient } from '@/lib/supabase/admin'

// Schreibt ins Audit-Log (Pflichtkern 12). Bewusst KEIN 'use server'-Modul: Jede exportierte
// Funktion eines solchen Moduls ist ein aufrufbarer HTTP-Endpunkt. logAudit schreibt mit dem
// geheimen Schlüssel, umgeht also RLS; als Server Action wäre sie ein offener Schreibkanal ins
// Protokoll (fremde Nutzer-Id, erfundene Aktion). So ist sie importierbar von Server Actions und
// nicht erreichbar von außen.
//
// Nur aus Server-Code aufrufen, der die Berechtigung vorher selbst geprüft hat, und erst NACH dem
// Schreibvorgang, dessen Zeilen gezählt wurden: Ein von der RLS verschluckter Update trifft 0 Zeilen
// ohne Fehler, das Protokoll beschriebe dann eine Änderung, die es nie gab.
//
// Fehler beim Schreiben werden geloggt und geschluckt: Ein fehlgeschlagenes Protokoll bricht die
// eigentliche Handlung nicht ab. Dass jede schreibende Server-Funktion hier ankommt, prüft
// scripts/audit-abdeckung.test.mjs.
//
// Nur Felder, die es braucht: keine IP-Adressen, keine Standorte, keine ganzen Formularinhalte. Das
// Protokoll ist selbst eine Verarbeitung und gehört mit Zweck und Frist in die Datenschutzerklärung.
//
// Einbau:
//   await logAudit({ aktion: 'rolle_geaendert', entitaet: 'profil', entitaetId: id,
//                    handelnderId: claims.sub, betroffenerId: id, details: { alt, neu } })

type Json = string | number | boolean | null | Json[] | { [schluessel: string]: Json }

type Basis = {
  aktion: AuditAktion
  /** Wer gehandelt hat (auth.users.id). null nur für Systemvorgänge (Cron, Webhook). */
  handelnderId: string | null
  entitaetId?: string
  details?: { [schluessel: string]: Json }
}

/**
 * `entitaet` entscheidet, ob `betroffenerId` Pflicht ist. Ein Eintrag zu einer Person ohne
 * Betroffenen kompiliert nicht: Sonst wäre die Zeile für genau diese Person später unsichtbar.
 */
export type AuditEintrag =
  | (Basis & {
      entitaet: PersonenEntitaet
      /** Wessen Ereignis das ist, NICHT wer gehandelt hat (das ist handelnderId). */
      betroffenerId: string
    })
  | (Basis & { entitaet: SonstigeEntitaet; betroffenerId?: string })

/** true, wenn genau eine Zeile im Protokoll steht. Wirft nie. */
export async function logAudit(eintrag: AuditEintrag): Promise<boolean> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('audit_logs')
      .insert({
        aktion: eintrag.aktion,
        entitaet: eintrag.entitaet,
        entitaet_id: eintrag.entitaetId ?? null,
        handelnder_id: eintrag.handelnderId,
        betroffener_id: eintrag.betroffenerId ?? null,
        details: eintrag.details ?? null,
      })
      .select('id')

    if (error || data?.length !== 1) {
      console.error(`[audit] ${eintrag.aktion} nicht protokolliert:`, error?.message ?? '0 Zeilen')
      return false
    }
    return true
  } catch (fehler) {
    console.error(`[audit] ${eintrag.aktion} nicht protokolliert:`, fehler)
    return false
  }
}

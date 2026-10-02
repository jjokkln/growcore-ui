export type AuditAktion =
  | 'rolle_geaendert'
  | 'zugang_gesperrt'
  | 'zugang_entsperrt'
  | 'nutzer_eingeladen'
  | 'einladung_zurueckgezogen'
  | 'einstellung_geaendert'

// Welche Handlungen das Audit-Log kennt und wie sie heißen. Reine Daten, auch im Browser nutzbar
// (Protokoll-Ansicht, Suche); geschrieben wird nur über lib/audit/protokoll.ts.
//
// Fachlich, nicht generisch: Die Liste unten ist ein Startpunkt und wird je Projekt neu
// geschrieben. Paarweise denken: freigeben/zurücknehmen, sperren/entsperren, zuweisen/entziehen.
// Wer nur die Rücknahme protokolliert, hat im Ernstfall nichts über die Handlung selbst.
//
// AUDIT_AKTION_BESCHRIFTUNG ist ein Record über die Union: Eine neue Aktion ohne Beschriftung ist
// ein Typfehler. Oberflächen zeigen nie den rohen Bezeichner, sondern immer diese Tabelle.
//
// Einbau: `import { auditAktionBeschriftung } from '@/lib/audit/aktionen'`.

export const AUDIT_AKTION_BESCHRIFTUNG: Record<AuditAktion, string> = {
  rolle_geaendert: 'Rolle geändert',
  zugang_gesperrt: 'Zugang gesperrt',
  zugang_entsperrt: 'Zugang entsperrt',
  nutzer_eingeladen: 'Nutzer eingeladen',
  einladung_zurueckgezogen: 'Einladung zurückgezogen',
  einstellung_geaendert: 'Einstellung geändert',
}

/**
 * Entitäten, die genau einer Person gehören: Ihre Ereignisse passieren jemandem. Für sie ist
 * `betroffenerId` Pflicht (protokoll.ts), denn daran hängt später, wer seine eigene Historie sehen
 * darf. Faustregel: Gehört die Zeile einer Person und darf sie sie sehen, gehört sie hierher.
 * Das Profil gehört immer dazu: Rolle, Sperre, zurückgesetzter Anmeldeweg passieren einem Menschen.
 */
export type PersonenEntitaet = 'profil'

/** Alles Übrige. `betroffenerId` ist erlaubt, aber nicht verlangt. */
export type SonstigeEntitaet = 'einstellung' | 'einladung'

/** Beschriftung auch für Zeilen, deren Aktion es im Code nicht mehr gibt. */
export function auditAktionBeschriftung(aktion: string): string {
  return (AUDIT_AKTION_BESCHRIFTUNG as Record<string, string>)[aktion] ?? `Unbekannte Aktion (${aktion})`
}

import { z } from 'zod'

// Was das Kontaktformular annimmt. Läuft im Browser (Hinweise am Feld) und auf dem Server (die
// eigentliche Prüfung, der Browser ist nur Komfort).
//
// Nur das Nötige (Pflichtkern 8): Name, ein Rückweg (E-Mail oder Telefon), die Nachricht. Jedes
// weitere Feld steht danach in der Datenbank, in der Benachrichtigungsmail und im Log des
// Mailanbieters. Wer ein Feld ergänzt, ergänzt es hier, in der Migration (Spalte + Längengrenze)
// und in der Datenschutzerklärung.
//
// Keine Einwilligungs-Checkbox: Eine Anfrage zu beantworten ist Vertragsanbahnung (Art. 6 Abs. 1
// lit. b DSGVO), keine Einwilligung. Der Art.-13-Hinweis steht am Formular.
//
// Einbau: `leadSchema.safeParse(eingabe)`; LEAD_GRENZEN für maxLength im Formular.

/** Längengrenzen je Feld. Dieselben Zahlen stehen als CHECK in der Migration. */
export const LEAD_GRENZEN = {
  name: 120,
  email: 160,
  telefon: 40,
  nachricht: 3000,
} as const

/** Feldname der Honigfalle: für Menschen unsichtbar und leer, Bots füllen ihn aus. */
export const HONIGFALLE_FELD = 'website'

/** Feldname der Zeitfalle: Zeitpunkt, zu dem das Formular im Browser bereit war (ms). */
export const ZEITFALLE_FELD = 'bereit_seit'

const TELEFON = /^[+0-9 ()/.-]{5,}$/

export const leadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Bitte geben Sie Ihren Namen an.')
      .max(LEAD_GRENZEN.name, 'Der Name ist zu lang.'),
    email: z.string().trim().max(LEAD_GRENZEN.email, 'Die E-Mail-Adresse ist zu lang.'),
    telefon: z.string().trim().max(LEAD_GRENZEN.telefon, 'Die Telefonnummer ist zu lang.'),
    nachricht: z
      .string()
      .trim()
      .min(10, 'Bitte schreiben Sie kurz, worum es geht.')
      .max(LEAD_GRENZEN.nachricht, 'Die Nachricht ist zu lang.'),
  })
  .superRefine((daten, ctx) => {
    if (daten.email && !z.email().safeParse(daten.email).success) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
      })
    }
    if (daten.telefon && !TELEFON.test(daten.telefon)) {
      ctx.addIssue({
        code: 'custom',
        path: ['telefon'],
        message: 'Bitte geben Sie eine gültige Telefonnummer an.',
      })
    }
    if (!daten.email && !daten.telefon) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Bitte geben Sie eine E-Mail-Adresse oder eine Telefonnummer an.',
      })
    }
  })

export type LeadEingabe = z.infer<typeof leadSchema>
export type LeadFeld = keyof LeadEingabe

/** Antwort der Server Action an das Formular. */
export type LeadErgebnis =
  | { ok: true }
  | { ok: false; meldung: string; felder?: Partial<Record<LeadFeld, string>> }

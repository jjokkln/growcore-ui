import 'server-only'
import nodemailer from 'nodemailer'
import type { LeadEingabe } from '@/lib/lead/schema'
import { anzeigename, siteConfig } from '@/lib/site-config'

// Mails zum Formular-Eingang: eine Benachrichtigung an den Kunden, eine Eingangsbestätigung an den
// Absender (Pflichtkern 8: abgeschickt, in der Datenbank, Mail beim Kunden, Bestätigung beim Absender).
//
// Versand über SMTP mit Nodemailer. Bei GrowCore ist der Anbieter Resend (SMTP-Relay
// smtp.resend.com:465, Benutzer `resend`, Passwort = API-Schlüssel, Absenderdomain mail.<kunde>.de,
// Region eu-west-1). Resend ist US-Auftragsverarbeiter: AVV und Eintrag in die Datenschutzerklärung
// (site-config: dienste.mail). Ein anderer SMTP-Anbieter braucht keinen Codewechsel.
//
// Umgebung (nur Server):
//   SMTP_HOST, SMTP_PORT (465 = SSL, 587 = STARTTLS), SMTP_USER, SMTP_PASS
//   SMTP_FROM          Absenderadresse auf der verifizierten Domain, z. B. anfrage@mail.example.de
//   LEAD_EMPFAENGER    optional; sonst kontakt.email aus der site-config
//
// Die Bestätigung an den Absender enthält bewusst nichts, was im Formular stand: Sonst ließe sich
// über das Formular beliebiger Text an beliebige Adressen im Namen des Kunden verschicken.
//
// Nodemailer braucht die Node-Runtime (Server Actions laufen dort standardmäßig).
// Einbau: nur aus der Server Action app/actions/lead.ts.

const ZEITZONE = 'Europe/Berlin'

function maskiere(wert: unknown): string {
  return String(wert ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function oderLeer(wert: string): string {
  return wert ? maskiere(wert).replace(/\n/g, '<br>') : '<em>nicht angegeben</em>'
}

function transport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const adresse = process.env.SMTP_FROM
  if (!host || !user || !pass || !adresse) return null

  const name = anzeigename(siteConfig)
  return {
    versand: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } }),
    von: adresse.includes('<') || !name ? adresse : { name, address: adresse },
  }
}

/** Firmenangaben für den Fuß der Bestätigung, nur was in der site-config wirklich steht. */
function fusszeile(): string[] {
  const { firma, anschrift } = siteConfig
  const ort = [anschrift.plz, anschrift.ort].filter(Boolean).join(' ')
  return [firma, anschrift.strasse, ort].filter((teil): teil is string => Boolean(teil))
}

export type LeadZumVersand = LeadEingabe & { id: string; quelle: string | null }

/**
 * Verschickt Benachrichtigung und Bestätigung. Liefert true, wenn die Benachrichtigung an den
 * Kunden raus ist; die Bestätigung ist Beiwerk und bricht nichts ab. Wirft nie: Der Eingang steht
 * schon in der Datenbank, ein Mailfehler wird geloggt und am fehlenden benachrichtigt_am sichtbar.
 */
export async function leadVerschicken(lead: LeadZumVersand): Promise<boolean> {
  const smtp = transport()
  const empfaenger = process.env.LEAD_EMPFAENGER || siteConfig.kontakt.email
  if (!smtp || !empfaenger) {
    console.error(
      `[lead] Keine Benachrichtigung für ${lead.id}: ` +
        (!smtp ? 'SMTP_HOST/SMTP_USER/SMTP_PASS/SMTP_FROM fehlen.' : 'kein Empfänger (kontakt.email in der site-config).'),
    )
    return false
  }

  const eingang = new Date().toLocaleString('de-DE', {
    timeZone: ZEITZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const zeilen: [string, string][] = [
    ['Name', lead.name],
    ['E-Mail', lead.email],
    ['Telefon', lead.telefon],
    ['Seite', lead.quelle ?? ''],
    ['Eingang', eingang],
  ]

  let benachrichtigt = false
  try {
    await smtp.versand.sendMail({
      from: smtp.von,
      to: empfaenger,
      replyTo: lead.email || undefined,
      subject: `Neue Anfrage über die Website: ${lead.name}`,
      text:
        zeilen.map(([feld, wert]) => `${feld}: ${wert || 'nicht angegeben'}`).join('\n') +
        `\n\n${lead.nachricht}\n\nVorgang ${lead.id}`,
      html:
        '<table cellpadding="4" style="border-collapse:collapse;font-family:sans-serif">' +
        zeilen
          .map(([feld, wert]) => `<tr><th align="left">${feld}</th><td>${oderLeer(wert)}</td></tr>`)
          .join('') +
        `</table><p style="font-family:sans-serif;white-space:pre-wrap">${oderLeer(lead.nachricht)}</p>` +
        `<p style="font-family:sans-serif;color:#666;font-size:12px">Vorgang ${maskiere(lead.id)}</p>`,
    })
    benachrichtigt = true
  } catch (fehler) {
    console.error(`[lead] Benachrichtigung für ${lead.id} fehlgeschlagen:`, fehler)
  }

  if (lead.email) {
    const absender = anzeigename(siteConfig)
    const fuss = fusszeile()
    try {
      await smtp.versand.sendMail({
        from: smtp.von,
        to: lead.email,
        replyTo: empfaenger,
        subject: 'Ihre Anfrage ist eingegangen',
        text:
          'Guten Tag,\n\nvielen Dank für Ihre Nachricht. Sie ist bei uns eingegangen, wir melden uns bei Ihnen.\n\n' +
          `Mit freundlichen Grüßen\n${absender}` +
          (fuss.length ? `\n\n${fuss.join('\n')}` : ''),
      })
    } catch (fehler) {
      console.error(`[lead] Eingangsbestätigung für ${lead.id} fehlgeschlagen:`, fehler)
    }
  }

  return benachrichtigt
}

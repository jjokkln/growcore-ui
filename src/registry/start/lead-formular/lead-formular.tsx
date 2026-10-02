import Link from 'next/link'
import { LeadFormularFelder } from '@/components/lead-formular-felder'
import { siteConfig } from '@/lib/site-config'

// Kontaktformular mit Datenschutzhinweis nach Art. 13 DSGVO direkt am Formular (Pflichtkern 8).
// Dieser Teil läuft auf dem Server und liest den Verantwortlichen aus der site-config; die Felder
// selbst stehen in lead-formular-felder.tsx.
//
// Fehlt die Firma in der site-config, entfällt der Satz zum Verantwortlichen, statt einen
// Platzhalter zu zeigen (Pflichtkern 5). Vor dem Livegang muss sie gesetzt sein
// (fehlendePflichtangaben()).
//
// Einbau: `<LeadFormular />` auf der Kontaktseite oder in einer Sektion. Überschrift setzt die Seite.
// Voraussetzungen: Migration *_leads.sql angewendet, SMTP_* und SUPABASE_SECRET_KEY gesetzt,
// Seite /datenschutz mit Abschnitt zum Formular, Datenbank und Mailversand.

export function LeadFormular({
  datenschutzPfad = '/datenschutz',
  className,
}: {
  datenschutzPfad?: string
  className?: string
}) {
  const firma = siteConfig.firma

  return (
    <LeadFormularFelder
      className={className}
      hinweis={
        <>
          Ihre Angaben verwenden wir nur, um Ihre Anfrage zu bearbeiten.
          {firma ? ` Verantwortlich ist ${firma}.` : null} Einzelheiten, auch zur Speicherdauer und
          zu Ihren Rechten, finden Sie in der{' '}
          <Link href={datenschutzPfad} className="underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </>
      }
    />
  )
}

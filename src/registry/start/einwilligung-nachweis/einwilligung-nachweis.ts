'use server'

// Nachweis erteilter, abgelehnter und widerrufener Einwilligungen als Datensatz (Art. 7 Abs. 1
// DSGVO, Pflichtkern 12 Fall 3). Ein Datum im localStorage des Besuchers ist kein Nachweis: nicht
// abfragbar, nicht zählbar, weg mit dem Leeren des Browsers.
//
// Gespeichert wird nur, was der Nachweis braucht: wann (setzt die Datenbank), worin (Version und
// STAND, also die genannten Empfänger), was entschieden wurde, und eine Zufallskennung ohne
// Personenbezug, um einen späteren Widerruf derselben Einwilligung zuzuordnen.
// Nicht gespeichert: IP, Browser, URL. Ein Protokoll über Menschen ist selbst eine Verarbeitung.
//
// Warum eine Server-Action mit Secret-Key und kein Insert aus dem Browser: Eine offene
// INSERT-Policy sagt, WER schreiben darf, nie WELCHE SPALTEN (supabase-sicherheit 18). Aus dem
// Browser ließe sich created_at rückdatieren und ein Nachweis fälschen. Hier setzt der Server
// alle Werte selbst und prüft jeden einzelnen; die Tabelle hat für anon gar keine Rechte.
//
// Einbau in app/layout.tsx:
//   import { einwilligungNachweisen } from '@/lib/einwilligung-nachweis'
//   <ConsentProvider beiEntscheidung={einwilligungNachweisen}>
// Umgebung: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SECRET_KEY (sb_secret_…, ältere Projekte
// SUPABASE_SERVICE_ROLE_KEY), nur serverseitig. Migration: supabase/migrations/*_einwilligungen.sql.
// Datenschutzerklärung: Abschnitt „Nachweis Ihrer Einwilligung“ einschalten.
import { createClient } from '@supabase/supabase-js'
import { CONSENT_VERSION, KATEGORIEN, STAND, type Auswahl, type Entscheidung } from '@/lib/consent'

const ENTSCHEIDUNGEN: Entscheidung[] = ['erteilt', 'abgelehnt', 'widerrufen']

/** Mehr Entscheidungen je Kennung und Stunde macht kein Mensch, der seine Meinung ändert. */
const HOECHSTENS_JE_STUNDE = 20

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const schluessel = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !schluessel) return null
  return createClient(url, schluessel, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Hält eine Entscheidung fest. Wirft nie: Ein Bannerklick darf an der Datenbank nicht scheitern.
 * Fehler gehen ins Server-Log, der Besucher merkt nichts.
 */
export async function einwilligungNachweisen(meldung: unknown): Promise<void> {
  // Alles, was aus dem Browser kommt, ist ungeprüft. Eine Server-Action ist ein öffentlicher
  // Endpunkt, auch wenn nur das Banner sie aufruft.
  if (typeof meldung !== 'object' || meldung === null) return
  const m = meldung as Record<string, unknown>

  if (!ENTSCHEIDUNGEN.includes(m.entscheidung as Entscheidung)) return
  if (m.version !== CONSENT_VERSION || m.stand !== STAND) {
    // Veralteter Tab mit einem Banner, das andere Empfänger nannte: kein gültiger Nachweis.
    console.warn('[einwilligung] Meldung mit veraltetem Stand verworfen')
    return
  }
  if (typeof m.besucherKennung !== 'string' || !/^[a-f0-9]{32}$/.test(m.besucherKennung)) return
  if (typeof m.kategorien !== 'object' || m.kategorien === null) return

  const roh = m.kategorien as Record<string, unknown>
  const kategorien: Auswahl = Object.fromEntries(KATEGORIEN.map((k) => [k.id, roh[k.id] === true]))

  const supabase = adminClient()
  if (!supabase) {
    console.error('[einwilligung] NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SECRET_KEY fehlt, kein Nachweis.')
    return
  }

  try {
    const eineStundeZurueck = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('einwilligungen')
      .select('id', { count: 'exact', head: true })
      .eq('besucher_kennung', m.besucherKennung)
      .gt('created_at', eineStundeZurueck)
    if ((count ?? 0) >= HOECHSTENS_JE_STUNDE) return

    // .select('id'): Zeilen zählen statt dem fehlenden Fehler glauben (supabase-sicherheit 12).
    const { data, error } = await supabase
      .from('einwilligungen')
      .insert({
        entscheidung: m.entscheidung,
        banner_version: CONSENT_VERSION,
        stand: STAND,
        kategorien,
        besucher_kennung: m.besucherKennung,
      })
      .select('id')
    if (error || !data?.length) {
      console.error('[einwilligung] Nachweis nicht gespeichert:', error?.message ?? '0 Zeilen')
    }
  } catch (fehler) {
    console.error('[einwilligung] Nachweis fehlgeschlagen:', fehler)
  }
}

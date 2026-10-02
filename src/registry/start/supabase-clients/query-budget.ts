const RUHE_MS = 400

// Abfragezähler, nur beim Entwickeln: eine Terminalzeile je Seitenaufruf, etwa
//
//   [supabase] 31 Abfragen in 3 Runden, 412 ms, über Budget (15 / 3)
//              tasks ×3, files ×2, projects, …
//
// Warum: Die teuren Muster (Daten für unsichtbare Tabs, Wasserfälle, Bilder je Render neu
// signieren) machen nichts kaputt, werden nicht rot und bleiben unter jeder Schwelle, die man von
// Hand bemerkt. Gemessen kamen sie erst im Monats-Audit ans Licht. Die Zahl beim Bauen zu sehen ist
// billiger, als sie einen Monat später zu finden (Regel supabase-sicherheit, „Sparsamkeit“).
//
// - Abfragen: jede Anfrage an Supabase (REST, Storage, Auth) aus server.ts und admin.ts. Treffer aus
//   einem Cache erreichen fetch nicht und zählen nicht, genau so soll es sein.
// - Runden: wie oft die Seite warten musste. Eine neue Runde beginnt, wenn eine Anfrage startet,
//   während keine läuft. Promise.all über zehn Abfragen ist eine Runde, drei await hintereinander
//   sind drei. Vorgabe 3: Identität, die Daten der Seite, eine abhängige Folgeabfrage.
// - Ein Seitenaufruf ist ein Schub: alles bis RUHE_MS ohne Anfrage. Lokal mit einem Entwickler ist
//   das ein Aufruf (oder eine Server Action samt Neu-Rendern).
//
// In Produktion aus (liefert undefined, die Clients nehmen das normale fetch).
// Einstellen: SUPABASE_QUERY_BUDGET=<abfragen>, SUPABASE_ROUND_BUDGET=<runden>,
// abschalten: SUPABASE_QUERY_BUDGET=off.
//
// Einbau: `global: { fetch: supabaseFetch() }` in jedem Server-Client. Keine App-Imports, mit Absicht.

type Schub = {
  anzahl: number
  runden: number
  laufend: number
  beginn: number
  /** Ende der letzten Anfrage; der Bericht wartet RUHE_MS länger. */
  ende: number
  ziele: Map<string, number>
  zeitgeber?: ReturnType<typeof setTimeout>
}

let schub: Schub | null = null

function budget() {
  const abfragen = Number(process.env.SUPABASE_QUERY_BUDGET)
  const runden = Number(process.env.SUPABASE_ROUND_BUDGET)
  return {
    abfragen: abfragen > 0 ? abfragen : 15,
    runden: runden > 0 ? runden : 3,
  }
}

/** `leads`, `POST leads`, `rpc:anfrage_zaehlen`, `storage:sign`, `auth:token` … */
function zielVon(input: RequestInfo | URL, init?: RequestInit): string {
  const url = new URL(
    typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
  )
  const methode = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
  const [, dienst, , ...rest] = url.pathname.split('/')
  const name =
    dienst === 'rest'
      ? rest[0] === 'rpc'
        ? `rpc:${rest[1]}`
        : rest[0]
      : dienst === 'storage'
        ? `storage:${rest[1] ?? rest[0]}`
        : `${dienst}:${rest.at(-1)}`
  return methode === 'GET' || methode === 'HEAD' ? name : `${methode} ${name}`
}

function berichten(fertig: Schub) {
  const ms = fertig.ende - fertig.beginn
  const grenze = budget()
  const drueber = fertig.anzahl > grenze.abfragen || fertig.runden > grenze.runden
  const haeufigste = [...fertig.ziele.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([ziel, n]) => (n > 1 ? `${ziel} ×${n}` : ziel))
    .join(', ')
  const zeile =
    `[supabase] ${fertig.anzahl} Abfragen in ${fertig.runden} Runde${fertig.runden === 1 ? '' : 'n'}, ${ms} ms` +
    (drueber ? `, über Budget (${grenze.abfragen} / ${grenze.runden})` : '') +
    `\n           ${haeufigste}${fertig.ziele.size > 8 ? ', …' : ''}`
  if (drueber) console.warn(zeile)
  else console.info(zeile)
}

function anfang(ziel: string) {
  if (!schub) {
    const jetzt = Date.now()
    schub = { anzahl: 0, runden: 0, laufend: 0, beginn: jetzt, ende: jetzt, ziele: new Map() }
  }
  if (schub.zeitgeber) clearTimeout(schub.zeitgeber)
  if (schub.laufend === 0) schub.runden += 1
  schub.laufend += 1
  schub.anzahl += 1
  schub.ziele.set(ziel, (schub.ziele.get(ziel) ?? 0) + 1)
}

function schluss() {
  const aktuell = schub
  if (!aktuell) return
  aktuell.laufend = Math.max(0, aktuell.laufend - 1)
  aktuell.ende = Date.now()
  if (aktuell.laufend > 0) return
  aktuell.zeitgeber = setTimeout(() => {
    if (schub === aktuell && aktuell.laufend === 0) {
      schub = null
      berichten(aktuell)
    }
  }, RUHE_MS)
}

/** Als `global.fetch` an jeden Server-Client; außerhalb von development `undefined`. */
export function supabaseFetch(): typeof fetch | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  if (process.env.SUPABASE_QUERY_BUDGET === 'off') return undefined

  return async (input, init) => {
    let ziel = 'unbekannt'
    try {
      ziel = zielVon(input, init)
    } catch {
      // Eine kaputte URL meldet fetch selbst, nicht der Zähler.
    }
    anfang(ziel)
    try {
      return await fetch(input, init)
    } finally {
      schluss()
    }
  }
}

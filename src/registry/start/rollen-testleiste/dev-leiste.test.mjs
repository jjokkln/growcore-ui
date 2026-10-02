import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

// Vertragstest der Rollen-Testleiste: die Eigenschaften, ohne die sie gefährlich wird. Liest nur
// Text, importiert nichts aus der App.
//
// Aufruf: node --test scripts/*.test.mjs

const WURZEL = fileURLToPath(new URL('..', import.meta.url))
const lies = (pfad) => readFileSync(join(WURZEL, pfad), 'utf8')

test('Die Leiste ist doppelt auf den eigenen Rechner begrenzt', () => {
  const freigabe = lies('src/lib/dev/freigabe.ts')
  // NODE_ENV ist eine Build-Konstante (der Zweig fällt im Produktionsbau weg), DEV_TOOLBAR eine
  // bewusste Handlung in .env.local. Fällt eines weg, ist die Leiste deploybar.
  assert.match(freigabe, /process\.env\.NODE_ENV !== 'production'/)
  assert.match(freigabe, /process\.env\.DEV_TOOLBAR === '1'/)
  assert.match(freigabe, /import 'server-only'/)
  // Nie NEXT_PUBLIC_: Sonst steht das Flag im Browser und lässt sich nicht wegoptimieren.
  assert.doesNotMatch(freigabe, /process\.env\.NEXT_PUBLIC_/)

  // Das Server-Bauteil fragt vor jedem Datenzugriff, ob die Leiste an ist.
  const leiste = lies('src/components/dev/dev-leiste.tsx')
  const sperre = leiste.indexOf('isDevLeisteAn()')
  const zugriff = leiste.indexOf('createClient()')
  assert.ok(sperre > -1 && zugriff > sperre, 'dev-leiste.tsx: isDevLeisteAn() muss vor createClient() stehen.')
})

test('Jede Server Action der Leiste prüft die Sperre als erste Anweisung', () => {
  const aktionen = lies('src/app/actions/dev-leiste-aktionen.ts')
  assert.match(aktionen, /^'use server'/)
  const namen = [...aktionen.matchAll(/export async function (\w+)/g)].map((treffer) => treffer[1])
  assert.ok(namen.length >= 4, 'Actions der Leiste nicht gefunden')
  for (const name of namen) {
    const rumpf = aktionen.slice(aktionen.indexOf(`export async function ${name}`))
    const ersteAnweisung = rumpf.slice(rumpf.indexOf('{\n') + 2).trim().split('\n')[0]
    assert.match(ersteAnweisung, /^devLeistePruefen\(\)/, `${name} prüft die Sperre nicht zuerst`)
  }
})

test('Ziele werden nur über die Exakt-Suche in DEV_KONTEN erreicht', () => {
  const aktionen = lies('src/app/actions/dev-leiste-aktionen.ts')
  assert.match(aktionen, /findDevKonto\(/)
  assert.match(aktionen, /sicheresZiel\(/)

  const konten = lies('src/lib/dev/konten.ts')
  assert.match(konten, /konto\.email === gesucht/, 'findDevKonto muss exakt vergleichen, kein Muster')
  for (const [, adresse] of konten.matchAll(/email: '([^']+)'/g)) {
    assert.match(adresse, /\.test$/, `${adresse}: Prüfkonten nur auf der reservierten Endung .test`)
  }
})

test('Gesperrte Prüfkonten werden nicht in Auth gebannt', () => {
  const anlegen = lies('src/lib/dev/anlegen.ts')
  assert.doesNotMatch(anlegen, /ban_duration/, 'Ein Bann verhindert die Anmeldung und prüft den Rauswurf nie.')
})

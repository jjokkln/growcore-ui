// Supabase-Sparsamkeit als Test. Die teuren Ladewege machen nichts kaputt, kein Fehler, kein Rot,
// keine spürbare Wartezeit, kein Advisor-Hinweis. Darum wird dieser Test rot. Jede Regel stammt aus
// einer Messung (Regel supabase-sicherheit, Abschnitt „Sparsamkeit“).
//
// Liest nur Text unter src/, importiert nichts aus der App. Läuft mit Node 20+:
//   node --test scripts/*.test.mjs
// Empfohlen als package.json-Skript: "test": "node --test scripts/*.test.mjs".
//
// Anpassen: nur die vier Listen unten (Budget, Sperrklinke, Signier-Stellen, getUser-Stellen).
// Ein neues Projekt lässt SEITEN_UEBER_BUDGET leer.
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const WURZEL = fileURLToPath(new URL('..', import.meta.url))
const QUELLE = join(WURZEL, 'src')

/** Höchstzahl `.from(` in einer page.tsx. Daten, die nur ein Tab zeigt, gehören in dessen Komponente. */
const SEITEN_BUDGET = 20

/**
 * Seiten über dem Budget, mit der Zahl, die sie nicht überschreiten dürfen. Eine Sperrklinke: Wird
 * eine Seite schlanker, wird die Zahl gesenkt, nie erhöht. Eine neue Seite bekommt keinen Eintrag.
 * Schlüssel: Pfad ab Projektwurzel, z. B. 'src/app/(app)/projekte/[id]/page.tsx'.
 */
const SEITEN_UEBER_BUDGET = {}

/**
 * Wo eine signierte URL entstehen darf, und warum es dort in Ordnung ist. Jede neue Signatur ist
 * eine neue Adresse, der Browser lädt das Bild dann bei jedem Aufruf neu. Bilder für alle
 * Angemeldeten laufen über einen gecachten Helfer (Schlüssel = Storage-Pfad).
 * Routen unter src/app/api/ sind ausgenommen: kurzlebige Download-Links hinter eigener Prüfung.
 */
const SIGNIEREN_ERLAUBT = {}

/** getUser() fragt den Auth-Server (~50 ms je Aufruf); getClaims() prüft das JWT lokal. */
const GET_USER_ERLAUBT = [
  // z. B. 'src/app/actions/passwort.ts', bewusst gegen den Auth-Server
]

function dateienUnter(verzeichnis) {
  if (!existsSync(verzeichnis)) return []
  return readdirSync(verzeichnis).flatMap((name) => {
    const pfad = join(verzeichnis, name)
    return statSync(pfad).isDirectory() ? dateienUnter(pfad) : [pfad]
  })
}

const dateien = dateienUnter(QUELLE)
  .filter((pfad) => /\.(ts|tsx)$/.test(pfad))
  .map((pfad) => ({ rel: relative(WURZEL, pfad), text: readFileSync(pfad, 'utf8') }))
const nachName = (muster) => dateien.filter((datei) => muster.test(datei.rel))
const zaehle = (text, muster) => (text.match(muster) ?? []).length

test('Seiten bleiben unter dem Abfragebudget (Daten gehören in die Tab-Komponente)', () => {
  for (const seite of nachName(/\/page\.tsx$/)) {
    const n = zaehle(seite.text, /\.from\(/g)
    const erlaubt = SEITEN_UEBER_BUDGET[seite.rel] ?? SEITEN_BUDGET
    assert.ok(
      n <= erlaubt,
      `${seite.rel}: ${n} × .from(), erlaubt ${erlaubt}. Daten, die nur ein Tab zeigt, in eine ` +
        'eigene async Komponente je Tab verschieben; sie läuft nur, wenn sie gerendert wird.',
    )
  }
  for (const [rel, erlaubt] of Object.entries(SEITEN_UEBER_BUDGET)) {
    const seite = dateien.find((datei) => datei.rel === rel)
    assert.ok(seite, `${rel} steht in SEITEN_UEBER_BUDGET, existiert aber nicht mehr. Eintrag löschen.`)
    const n = zaehle(seite.text, /\.from\(/g)
    assert.ok(
      n === erlaubt || n > SEITEN_BUDGET,
      `${rel}: nur noch ${n} × .from(). Eintrag in SEITEN_UEBER_BUDGET auf ${n} senken oder löschen.`,
    )
  }
})

test('Kein Zählen im Layout', () => {
  for (const datei of [...nachName(/\/layout\.tsx$/), ...nachName(/^src\/components\/layout\//)]) {
    assert.doesNotMatch(
      datei.text,
      /count:\s*["']exact["']/,
      `${datei.rel}: count: "exact" läuft bei jedem Render jeder Seite, auch auf /login.`,
    )
  }
})

test('Der Proxy fragt die Datenbank nur hinter einem Kurzzeit-Memo', () => {
  const [proxy] = nachName(/^src\/proxy\.ts$/)
  if (!proxy || !/\.from\(/.test(proxy.text)) return
  assert.match(
    proxy.text,
    /\w*[Mm]emo\w*\(/,
    'src/proxy.ts: .from() ohne Memo läuft auch für Prefetches, RSC-Payloads und Server-Action-POSTs.',
  )
})

test('Signierte URLs nur über den gecachten Weg oder kurzlebig hinter einer Route', () => {
  for (const datei of dateien) {
    if (!/\.createSignedUrls?\(/.test(datei.text)) continue
    if (/^src\/app\/api\//.test(datei.rel)) continue
    assert.ok(
      SIGNIEREN_ERLAUBT[datei.rel],
      `${datei.rel}: signiert selbst. Bilder über einen gecachten Helfer signieren (Schlüssel = ` +
        'Storage-Pfad, Cache kürzer als die Gültigkeit) und ihn in SIGNIEREN_ERLAUBT eintragen.',
    )
  }
})

test('Identität über getClaims(), getUser() nur in Auth-Abläufen', () => {
  for (const datei of dateien) {
    if (!/auth\.getUser\(\)/.test(datei.text)) continue
    assert.ok(
      GET_USER_ERLAUBT.includes(datei.rel),
      `${datei.rel}: auth.getUser() ist ein Netzwerkaufruf je Render. getClaims() nehmen, oder ` +
        'mit Begründung in GET_USER_ERLAUBT eintragen (Admin, Geld, Löschen).',
    )
  }
})

test('Jeder Server-Client zählt beim Entwickeln mit', () => {
  for (const rel of ['src/lib/supabase/server.ts', 'src/lib/supabase/admin.ts']) {
    const datei = dateien.find((eintrag) => eintrag.rel === rel)
    assert.ok(datei, `${rel} fehlt (Baustein supabase-clients).`)
    assert.match(
      datei.text,
      /global:\s*\{\s*fetch:\s*supabaseFetch\(\)/,
      `${rel}: global.fetch = supabaseFetch() fehlt. Sonst sieht man beim Bauen nicht, was eine Seite kostet.`,
    )
  }
})

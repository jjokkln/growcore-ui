import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Abdeckungstest fürs Audit-Log (Pflichtkern 12): Jede schreibende Server-Funktion ruft logAudit
// auf oder ist mit Begründung ausgenommen.
//
// Warum: Ein fehlender Protokolleintrag macht nichts kaputt. Kein Fehler, kein roter Test, keine
// Warnung. In einem echten Projekt schrieb so die Wochenfreigabe, also der Schritt, nach dem Geld
// fließt, sechs Monate lang keine Zeile, während ihre Rücknahme protokolliert wurde. Dieser Test
// dreht das um: Wer eine schreibende Funktion anlegt, protokolliert oder begründet. Vergessen geht
// nicht mehr.
//
// Was als „schreibend“ gilt, ist absichtlich grob: .insert/.update/.delete/.upsert, .rpc(, der
// Admin-Client und admin.auth. Ein .rpc() ist oft nur lesend; das erzeugt Falschmeldungen, und das
// ist gewollt. Eine Falschmeldung kostet eine Begründung, eine übersehene Funktion den Nachweis.
//
// Geprüft werden Dateien mit 'use server' und alle, die logAudit erwähnen, jeweils die exportierten
// async Funktionen (auch `export const x = async () =>`), über den TypeScript-Parser.
//
// Zwei Wege für eine Ausnahme, beide mit Begründung, die jemand lesen kann („später“ ist keine):
//   1. Im Rumpf der Funktion ein Kommentar `// audit-ausnahme: <Begründung>`. Wandert mit der Funktion.
//   2. In AUSNAHMEN unten, Schlüssel `<pfad relativ zu src>::<funktion>`. Eine Ausnahme, die ins
//      Leere zeigt, lässt den Test fehlschlagen, sonst verrottet die Liste.
//
// Aufruf: node --test scripts/*.test.mjs

const WURZEL = fileURLToPath(new URL('..', import.meta.url))
const QUELLE = join(WURZEL, 'src')

/** Schreibende Funktionen, die bewusst nicht protokollieren: Schlüssel → Begründung. */
const AUSNAHMEN = {
  // 'lib/actions/einstellungen.ts::eigeneAnsichtSpeichern': 'eigene Voreinstellung, keine fremden Daten',
}

const SCHREIBT = /\.(insert|update|delete|upsert)\(|\.rpc\(|admin\.auth\.|createAdminClient/
const PROTOKOLLIERT = /\blogAudit\(/
const INLINE_AUSNAHME = /\/\/\s*audit-ausnahme:\s*(.{10,})/

function dateienUnter(verzeichnis) {
  if (!existsSync(verzeichnis)) return []
  const treffer = []
  for (const name of readdirSync(verzeichnis)) {
    const pfad = join(verzeichnis, name)
    if (statSync(pfad).isDirectory()) treffer.push(...dateienUnter(pfad))
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) treffer.push(pfad)
  }
  return treffer
}

function istExportiertAsync(knoten) {
  const mod = ts.canHaveModifiers(knoten) ? (ts.getModifiers(knoten) ?? []) : []
  return mod.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
}

/** Exportierte async Funktionen auf oberster Ebene, samt vollständigem Rumpf. */
function funktionen(quelltext, pfad = 'datei.ts') {
  const quelle = ts.createSourceFile(pfad, quelltext, ts.ScriptTarget.Latest, true)
  const gefunden = []
  const zeile = (knoten) => quelle.getLineAndCharacterOfPosition(knoten.getStart(quelle)).line + 1
  const asynchron = (knoten) =>
    (ts.getModifiers(knoten) ?? []).some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)

  for (const knoten of quelle.statements) {
    if (ts.isFunctionDeclaration(knoten) && knoten.name && knoten.body) {
      if (istExportiertAsync(knoten) && asynchron(knoten)) {
        gefunden.push({ name: knoten.name.text, zeile: zeile(knoten), koerper: knoten.getText(quelle) })
      }
      continue
    }
    if (ts.isVariableStatement(knoten) && istExportiertAsync(knoten)) {
      for (const dekl of knoten.declarationList.declarations) {
        const wert = dekl.initializer
        if (!wert || !ts.isIdentifier(dekl.name)) continue
        if ((ts.isArrowFunction(wert) || ts.isFunctionExpression(wert)) && asynchron(wert)) {
          gefunden.push({ name: dekl.name.text, zeile: zeile(knoten), koerper: knoten.getText(quelle) })
        }
      }
    }
  }
  return gefunden
}

test('Selbstprobe: der Scanner sieht den ganzen Rumpf', () => {
  // Eine Klammerzählung scheiterte früher an Objekttypen in der Signatur und las den Rumpf nie.
  // Schlägt die Probe fehl, ist der Test blind; dann lieber sofort rot als still grün.
  const probe = funktionen(
    'export async function f(\n  ziel: { id: string },\n): Promise<{ ok: true }> {\n  await db.from("t").insert({ id: ziel.id })\n}\n' +
      'export const g = async () => { await db.from("t").delete() }\n',
  )
  assert.equal(probe.length, 2)
  assert.ok(probe.every((fn) => SCHREIBT.test(fn.koerper)))
})

test('Jede schreibende Server-Funktion protokolliert oder ist begründet', () => {
  const offen = []
  const unbenutzt = new Set(Object.keys(AUSNAHMEN))

  for (const datei of dateienUnter(QUELLE)) {
    const text = readFileSync(datei, 'utf8')
    const serverModul = /^\s*['"]use server['"]/m.test(text)
    if (!serverModul && !text.includes('logAudit')) continue
    const kurz = relative(QUELLE, datei).split('\\').join('/')

    for (const fn of funktionen(text, datei)) {
      const schluessel = `${kurz}::${fn.name}`
      if (!SCHREIBT.test(fn.koerper)) continue
      if (PROTOKOLLIERT.test(fn.koerper) || INLINE_AUSNAHME.test(fn.koerper)) {
        unbenutzt.delete(schluessel)
        continue
      }
      if (schluessel in AUSNAHMEN) {
        unbenutzt.delete(schluessel)
        continue
      }
      offen.push(`src/${kurz}:${fn.zeile}  ${fn.name}`)
    }
  }

  assert.deepEqual(
    offen,
    [],
    `${offen.length} schreibende Funktion(en) ohne Audit-Log und ohne Begründung. Entweder ` +
      'logAudit() aufrufen oder im Rumpf `// audit-ausnahme: <Begründung>` vermerken.',
  )
  assert.deepEqual(
    [...unbenutzt],
    [],
    'Ausnahme(n) zeigen ins Leere: Funktion umbenannt, entfernt oder sie protokolliert inzwischen. Eintrag löschen.',
  )
})

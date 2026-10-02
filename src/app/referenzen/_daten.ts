import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

// Echte Kundenseiten stehen NICHT im Repo: Das Repo ist öffentlich (CLAUDE.md). Die Liste liegt in
// lokal/referenzen.json, die Vorschaubilder in public/lokal/referenzen/, beide in .gitignore.
// Fehlt die Datei (frischer Klon, Build auf einem anderen Rechner), zeigt die Seite einen Hinweis
// und die Navigation keinen Link.
export type Kategorie = { id: string; titel: string }
export type Referenz = {
  id: string
  kunde: string
  kategorie: string
  url: string
  projekt: string
  beschreibung: string
}
export type Referenzen = { kategorien: Kategorie[]; eintraege: Referenz[] }

const DATEI = path.join(process.cwd(), 'lokal', 'referenzen.json')
const BILDER = path.join(process.cwd(), 'public', 'lokal', 'referenzen')

export function referenzenVorhanden(): boolean {
  return existsSync(DATEI)
}

export function ladeReferenzen(): (Referenzen & { mitBild: Set<string> }) | null {
  if (!referenzenVorhanden()) return null
  const daten = JSON.parse(readFileSync(DATEI, 'utf8')) as Referenzen
  const mitBild = new Set(daten.eintraege.filter((e) => existsSync(path.join(BILDER, `${e.id}.jpg`))).map((e) => e.id))
  return { ...daten, mitBild }
}

import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

// Liest die Kapitel aus /handbuch/*.md. Eine Quelle für Webseite und Agenten: Was hier
// angezeigt wird, ist genau die Datei, die ein Agent per grep findet.
export type Kapitel = {
  slug: string
  titel: string
  gruppe: 'grundlagen' | 'muster' | 'besonderes'
  kurz: string
  stichworte: string[]
  bausteine: string[]
  demo: string[]
  inhalt: string
}

const ORDNER = path.join(process.cwd(), 'handbuch')
export const GRUPPEN = [
  { id: 'grundlagen', titel: 'Grundlagen' },
  { id: 'muster', titel: 'Muster' },
  { id: 'besonderes', titel: 'Besondere Elemente' },
] as const
// Reihenfolge innerhalb der Grundlagen; Muster alphabetisch.
const ZUERST = ['grundsaetze', 'bewegung', 'typografie', 'farbe-und-flaeche', 'abstand-und-raster', 'zustaende', 'texte']

function liste(wert: string | undefined) {
  return (wert ?? '').replace(/^\[|\]$/g, '').split(',').map((s) => s.trim()).filter(Boolean)
}

function lies(datei: string): Kapitel {
  const roh = fs.readFileSync(path.join(ORDNER, datei), 'utf8')
  const m = roh.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  const kopf: Record<string, string> = {}
  for (const zeile of (m?.[1] ?? '').split('\n')) {
    const i = zeile.indexOf(':')
    if (i > 0) kopf[zeile.slice(0, i).trim()] = zeile.slice(i + 1).trim()
  }
  return {
    slug: datei.replace(/\.md$/, ''),
    titel: kopf.titel ?? datei,
    gruppe: (kopf.gruppe as Kapitel['gruppe']) ?? 'muster',
    kurz: kopf.kurz ?? '',
    stichworte: liste(kopf.stichworte),
    bausteine: liste(kopf.bausteine),
    demo: liste(kopf.demo),
    inhalt: m?.[2] ?? roh,
  }
}

export function alleKapitel(): Kapitel[] {
  const alle = fs.readdirSync(ORDNER).filter((d) => d.endsWith('.md')).map(lies)
  const rang = (k: Kapitel) => (ZUERST.includes(k.slug) ? ZUERST.indexOf(k.slug) : 100)
  return alle.sort((a, b) => rang(a) - rang(b) || a.titel.localeCompare(b.titel, 'de'))
}

export function kapitel(slug: string) {
  return alleKapitel().find((k) => k.slug === slug)
}

// HTML des Kapitels, geteilt nach dem ersten Abschnitt: Dort setzt die Seite das Live-Beispiel ein.
// Die Dateien liegen im eigenen Repo und werden beim Build gelesen; fremder Inhalt kommt nicht hinein.
export function kapitelHtml(k: Kapitel): [string, string] {
  const html = marked.parse(k.inhalt, { gfm: true, async: false }) as string
  const zweite = html.indexOf('<h2', html.indexOf('<h2') + 1)
  return zweite > 0 ? [html.slice(0, zweite), html.slice(zweite)] : [html, '']
}

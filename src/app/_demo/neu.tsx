'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { Monatsraster, tagSchluessel } from '@/components/motion/monatsraster'
import { Reiter } from '@/components/motion/reiter'
import { useMeldung } from '@/components/motion/meldung'
import { AktionKnopf } from '@/components/motion/aktion-knopf'
import { Terminbuchung } from '@/components/motion/terminbuchung'
import { Wizard } from '@/components/motion/wizard'
import { Anmeldung } from '@/components/motion/anmeldung'
import { BildEnthuellung } from '@/components/motion/bild-enthuellung'
import { Kartenstapel } from '@/components/motion/kartenstapel'
import { Laufband } from '@/components/motion/laufband'
import { ZeigerVorschau } from '@/components/motion/zeiger-vorschau'

// Beispiele für Handbuch und Bausteine-Seite. Alle Daten sind erkennbar Beispieldaten.
const warte = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
const rahmen = 'rounded-xl border border-linie bg-flaeche p-5 sm:p-6'
const knopfLeise = 'rounded-full border border-linie bg-flaeche px-4 py-2 text-sm hover:border-tinte'

function beispielEintraege() {
  const heute = new Date()
  const e: Record<string, { titel: string; farbe?: string }[]> = {}
  const plus = (n: number, titel: string, farbe?: string) => {
    const d = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() + n)
    ;(e[tagSchluessel(d)] ??= []).push({ titel, farbe })
  }
  plus(1, 'Abstimmung')
  plus(3, 'Frist', '#c2562a')
  plus(3, 'Abnahme')
  plus(8, 'Workshop', '#1f6f55')
  plus(12, 'Abstimmung')
  plus(12, 'Frist', '#c2562a')
  plus(12, 'Termin')
  plus(12, 'Termin')
  return e
}

export function MonatsrasterDemo() {
  const [tag, setTag] = useState<Date | null>(null)
  const [eintraege] = useState(beispielEintraege)
  const liste = tag ? eintraege[tagSchluessel(tag)] ?? [] : []
  return (
    <div className={`${rahmen} grid gap-6 md:grid-cols-[22rem_1fr] [--kalender-akzent:var(--akzent)] [--kalender-akzent-text:#fff]`}>
      <Monatsraster wert={tag} beiWahl={setTag} eintraege={eintraege} nichtWaehlbar={(d) => d.getDay() === 0} />
      <div aria-live="polite">
        <div className="text-sm text-leise">{tag ? tag.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Einen Tag wählen'}</div>
        <ul className="mt-3 grid gap-2">
          {tag && liste.length === 0 && <li className="text-leise">Keine Einträge an diesem Tag.</li>}
          {liste.map((e, i) => (
            <li key={i} className="flex items-center gap-3 rounded-lg border border-linie px-3 py-2">
              <span className="size-2 rounded-full" style={{ background: e.farbe ?? 'currentColor' }} />
              {e.titel}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-leise">Sonntage sind in diesem Beispiel nicht wählbar. Pfeiltasten, Bild auf/ab, Pos 1 und Ende funktionieren.</p>
      </div>
    </div>
  )
}

export function ReiterDemo() {
  return (
    <div className={`${rahmen} [--reiter-akzent:var(--akzent)]`}>
      <Reiter
        label="Projektbereiche"
        reiter={[
          { id: 'uebersicht', titel: 'Übersicht', inhalt: <p className="max-w-prose text-leise">Der Strich gleitet zum neuen Reiter. Der Inhalt darunter blendet kurz ein, die Leiste bleibt stehen.</p> },
          { id: 'aufgaben', titel: 'Aufgaben', inhalt: <p className="max-w-prose text-leise">Pfeiltasten wechseln den Reiter, Pos 1 und Ende springen an den Anfang und das Ende.</p> },
          { id: 'dokumente', titel: 'Dokumente', inhalt: <p className="max-w-prose text-leise">Bei vielen Reitern scrollt die Leiste waagerecht, statt umzubrechen.</p> },
          { id: 'verlauf', titel: 'Verlauf', inhalt: <p className="max-w-prose text-leise">Der aktive Reiter steht in der Adresse (?tab=), damit ein Link genau hierher führt.</p> },
        ]}
      />
    </div>
  )
}

export function MeldungDemo() {
  const zeige = useMeldung()
  return (
    <div className={`${rahmen} flex flex-wrap gap-3`}>
      <button className={knopfLeise} onClick={() => zeige({ text: 'Änderungen gespeichert', art: 'erfolg' })}>Gespeichert</button>
      <button className={knopfLeise} onClick={() => zeige({ text: 'Termin gelöscht', aktion: { label: 'Rückgängig', beiKlick: () => zeige({ text: 'Termin wiederhergestellt' }) } })}>
        Löschen mit Rückgängig
      </button>
      <button className={knopfLeise} onClick={() => zeige({ text: 'Verbindung unterbrochen. Erneut versuchen.', art: 'fehler' })}>Fehler</button>
    </div>
  )
}

export function AktionKnopfDemo() {
  const [n, setN] = useState(0)
  return (
    <div className={`${rahmen} flex flex-wrap items-center gap-4 [--knopf-bg:var(--tinte)] [--knopf-text:var(--papier)]`}>
      <AktionKnopf beiAktion={() => warte(1200)} fertigText="Gespeichert">Speichern</AktionKnopf>
      <AktionKnopf
        beiAktion={async () => {
          await warte(900)
          setN((x) => x + 1)
          if (n % 2 === 0) throw new Error('Beispielfehler')
        }}
        fertigText="Gesendet"
      >
        Senden (scheitert jedes zweite Mal)
      </AktionKnopf>
    </div>
  )
}

export function TerminbuchungDemo() {
  return (
    <div className="overflow-x-auto [--buchung-akzent:var(--akzent)] [--buchung-akzent-text:#fff] [--kalender-akzent:var(--akzent)] [--kalender-akzent-text:#fff] [--buchung-bg:var(--flaeche)]">
      <Terminbuchung
        art={{ titel: 'Erstgespräch', dauer: '30 Minuten', ort: 'Videocall', beschreibung: 'Beispiel: Ziele, Umfang und nächste Schritte klären.' }}
        istBuchbar={(d) => {
          const heute = new Date()
          heute.setHours(0, 0, 0, 0)
          return d >= heute && d.getDay() !== 0 && d.getDay() !== 6
        }}
        ladeZeiten={async (d) => {
          await warte(400)
          return d.getDate() % 5 === 0 ? [] : ['09:00', '09:30', '10:30', '11:00', '14:00', '15:30', '16:00'].filter((_, i) => (i + d.getDate()) % 3 !== 0)
        }}
        beiBuchung={() => warte(1000)}
        datenschutz="Beispiel: Name und E-Mail werden nur für diesen Termin verwendet."
      />
    </div>
  )
}

export function WizardDemo() {
  return (
    <div className={`${rahmen} [--wizard-akzent:var(--akzent)] [--wizard-akzent-text:#fff] [--knopf-bg:var(--akzent)] [--knopf-text:#fff]`}>
      <Wizard
        entwurfSchluessel="growcore-ui-demo-wizard"
        beiAbsenden={() => warte(1000)}
        schritte={[
          {
            id: 'art',
            typ: 'einfach',
            frage: 'Was soll entstehen?',
            hilfe: 'Beispiel-Konfigurator. Die Antwort entscheidet, welche Frage als Nächstes kommt.',
            optionen: [
              { wert: 'website', titel: 'Website', text: 'Auftritt, Leistungen, Anfrage' },
              { wert: 'app', titel: 'Software', text: 'Kundenportal, Verwaltung, Abläufe' },
            ],
            weiterZu: { website: 'seiten', app: 'nutzer' },
          },
          {
            id: 'seiten',
            typ: 'mehrfach',
            frage: 'Welche Bereiche braucht die Website?',
            optionen: [
              { wert: 'leistungen', titel: 'Leistungen' },
              { wert: 'referenzen', titel: 'Referenzen' },
              { wert: 'karriere', titel: 'Karriere' },
              { wert: 'buchung', titel: 'Terminbuchung' },
            ],
          },
          {
            id: 'nutzer',
            typ: 'einfach',
            frage: 'Wer arbeitet damit?',
            optionen: [
              { wert: 'intern', titel: 'Nur das eigene Team' },
              { wert: 'kunden', titel: 'Team und Kunden' },
            ],
          },
          {
            id: 'kontakt',
            typ: 'felder',
            frage: 'Wie erreichen wir Sie?',
            felder: [
              { name: 'name', label: 'Name', pflicht: true },
              { name: 'email', label: 'E-Mail', art: 'email', pflicht: true },
              { name: 'notiz', label: 'Was ist noch wichtig?', art: 'textarea' },
            ],
          },
        ]}
        fertig={
          <div>
            <p className="text-xl font-semibold">Danke, die Anfrage ist angekommen.</p>
            <p className="mt-2 text-leise">Beispiel: Innerhalb von zwei Werktagen kommt eine Rückmeldung mit Terminvorschlag.</p>
          </div>
        }
      />
    </div>
  )
}

export function AnmeldungDemo() {
  return (
    <div className={`${rahmen} grid gap-6 md:grid-cols-[1fr_16rem] [--knopf-bg:var(--tinte)] [--knopf-text:var(--papier)]`}>
      <Anmeldung
        passwortVergessen="#"
        beiAnmelden={async ({ passwort }) => {
          await warte(800)
          return passwort === 'demo' ? { code: true } : { fehler: 'E-Mail oder Passwort stimmen nicht.' }
        }}
        beiCode={async (code) => {
          await warte(500)
          return code === '123456' ? { ok: true } : { fehler: 'Der Code stimmt nicht. Bitte den aktuellen Code eingeben.' }
        }}
      />
      <p className="text-sm text-leise">Beispiel: beliebige E-Mail, Passwort <code className="font-mono">demo</code>, danach Code <code className="font-mono">123456</code>. Ein falscher Code schüttelt das Feld.</p>
    </div>
  )
}

export function FormularDemo() {
  const id = useId()
  const [fehler, setFehler] = useState<Record<string, string>>({})
  const [werte, setWerte] = useState({ name: '', email: '', nachricht: '' })
  const pruefen = (feld: keyof typeof werte, wert: string) => {
    const meldung =
      feld === 'email' && wert && !/^\S+@\S+\.\S+$/.test(wert) ? 'Bitte eine vollständige E-Mail-Adresse eingeben, z. B. name@firma.de.'
      : !wert.trim() && feld !== 'nachricht' ? 'Bitte ausfüllen.'
      : ''
    setFehler((f) => ({ ...f, [feld]: meldung }))
    return !meldung
  }
  const feld = (name: keyof typeof werte, label: string, typ = 'text') => (
    <div className="grid gap-1.5">
      <label htmlFor={`${id}-${name}`} className="text-sm font-medium">{label}{name === 'nachricht' && <span className="font-normal text-leise"> (optional)</span>}</label>
      {name === 'nachricht' ? (
        <textarea id={`${id}-${name}`} rows={3} className="rounded-lg border border-linie bg-transparent px-3 py-2" value={werte[name]} onChange={(e) => setWerte({ ...werte, [name]: e.target.value })} />
      ) : (
        <input
          id={`${id}-${name}`}
          type={typ}
          aria-invalid={!!fehler[name]}
          aria-describedby={fehler[name] ? `${id}-${name}-f` : undefined}
          className="rounded-lg border border-linie bg-transparent px-3 py-2 aria-[invalid=true]:border-[#b42318]"
          value={werte[name]}
          onChange={(e) => setWerte({ ...werte, [name]: e.target.value })}
          onBlur={(e) => pruefen(name, e.target.value)}
        />
      )}
      {fehler[name] && <p id={`${id}-${name}-f`} className="text-sm text-[#b42318]">{fehler[name]}</p>}
    </div>
  )
  return (
    <form className={`${rahmen} grid max-w-xl gap-4 [--knopf-bg:var(--tinte)] [--knopf-text:var(--papier)]`} onSubmit={(e) => e.preventDefault()} noValidate>
      {feld('name', 'Name')}
      {feld('email', 'E-Mail', 'email')}
      {feld('nachricht', 'Nachricht')}
      <p className="text-xs text-leise">Beispiel-Hinweis: Die Angaben werden nur zur Bearbeitung der Anfrage genutzt. Mehr in der Datenschutzerklärung.</p>
      <div>
        <AktionKnopf
          beiAktion={async () => {
            const ok = [pruefen('name', werte.name), pruefen('email', werte.email)].every(Boolean)
            if (!ok) throw new Error('unvollständig')
            await warte(1000)
          }}
        >
          Anfrage senden
        </AktionKnopf>
      </div>
    </form>
  )
}

const BILD = (n: number, alt: string) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`/beispiel/${n}.svg`} alt={alt} width={1200} height={900} className="block h-full w-full object-cover" />
)

export function BildEnthuellungDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
      <BildEnthuellung>{BILD(1, 'Beispielbild in Blau')}</BildEnthuellung>
      <BildEnthuellung von="unten" scrub>{BILD(2, 'Beispielbild in Grün')}</BildEnthuellung>
    </div>
  )
}

export function KartenstapelDemo() {
  const karten = [
    ['Analyse', 'Wir sehen uns Abläufe, Zahlen und Wettbewerb an, bevor wir etwas gestalten.', 'bg-tinte text-papier'],
    ['Konzept', 'Seitenstruktur, Texte und Klickwege stehen, bevor die erste Zeile Code entsteht.', 'bg-akzent text-white'],
    ['Umsetzung', 'Gebaut wird aus geprüften Bausteinen, sichtbar Woche für Woche im Projektraum.', 'bg-[#1f6f55] text-white'],
    ['Betrieb', 'Nach dem Start bleiben Pflege, Auswertung und Weiterentwicklung in einer Hand.', 'bg-flaeche text-tinte border border-linie'],
  ]
  return (
    <Kartenstapel
      karten={karten.map(([t, x, c]) => (
        <div key={t} className={`grid min-h-[16rem] content-between rounded-2xl p-8 shadow-[0_12px_32px_-16px_rgb(15_20_40/.45)] ${c}`}>
          <div className="text-3xl font-semibold tracking-tight">{t}</div>
          <p className="max-w-md opacity-85">{x}</p>
        </div>
      ))}
    />
  )
}

export function LaufbandDemo() {
  return (
    <div className={rahmen}>
      <Laufband label="Leistungen im Überblick">
        {['Websites', 'Kundenportale', 'Terminbuchung', 'Konfiguratoren', 'Dashboards', 'Automatisierung'].map((w) => (
          <span key={w} className="text-2xl font-semibold tracking-tight text-tinte/80">{w}</span>
        ))}
      </Laufband>
    </div>
  )
}

export function ZeigerVorschauDemo() {
  return (
    <ZeigerVorschau
      eintraege={[
        { titel: 'Kanzlei-Website', zusatz: 'Beispiel · Website', href: '#zeiger-vorschau', bild: BILD(1, '') },
        { titel: 'Werkstatt-Termine', zusatz: 'Beispiel · Buchung', href: '#zeiger-vorschau', bild: BILD(2, '') },
        { titel: 'Kundenportal', zusatz: 'Beispiel · Software', href: '#zeiger-vorschau', bild: BILD(3, '') },
        { titel: 'Angebotsrechner', zusatz: 'Beispiel · Konfigurator', href: '#zeiger-vorschau', bild: BILD(4, '') },
      ]}
    />
  )
}

export function SeitenwechselDemo() {
  return (
    <div className={`${rahmen} flex flex-wrap items-center gap-4`}>
      <Link href="/tokens" transitionTypes={['vor']} className="rounded-full bg-tinte px-5 py-2.5 text-sm font-medium text-papier hover:bg-akzent">
        Vorwärts zu den Tokens
      </Link>
      <p className="text-sm text-leise">Der Kopf bleibt stehen, der Inhalt gleitet in Richtung des Wechsels. Zurück gleitet er von links.</p>
    </div>
  )
}

'use client'

// Die Leiste selbst. Absichtlich fest Bernstein auf fast Schwarz statt Theme-Tokens: Ein
// Entwicklerwerkzeug darf in keinem Theme mit Produkt-Oberfläche verwechselbar sein.
//
// Sie steht als erstes Element im <body>, nicht als fixierte Ebene, damit sie keinen Kopfbereich
// verdeckt. Konten und Zähler werden erst beim Öffnen geladen.
//
// Jedes Formular hat autoComplete="off": Nach einer Navigation auf dieselbe Adresse stellt der
// Browser sonst Werte wieder her und feuert change, und ein selbst absendendes Feld schreibt dann
// ohne Klick.
//
// data-dev-identitaet: Eine Abnahme (Playwright) wartet darauf, wer man gerade ist, ohne die Texte
// der Knöpfe mitzulesen.
//
// Einbau: nicht direkt, sondern über <DevLeiste /> (components/dev/dev-leiste.tsx).
import { usePathname } from 'next/navigation'
import { useState, useTransition, type ReactNode } from 'react'
import { devAbmelden, devDatenLaden, devKontenAnlegen, devWechseln } from '@/app/actions/dev-leiste-aktionen'
import { DEV_GRUPPEN_BESCHRIFTUNG, wechselZiel, type DevGruppe } from '@/lib/dev/konten'
import type { DevLeistenDaten } from '@/lib/dev/zustand'

const KNOPF =
  'rounded border border-amber-400/30 bg-black/40 px-2 py-0.5 text-[12px] text-amber-50 transition-colors ' +
  'hover:border-amber-300 hover:bg-amber-400/10 focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-amber-300 disabled:opacity-40'

function Abschnitt({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <section className="min-w-0 space-y-1.5">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/70">{titel}</h2>
      {children}
    </section>
  )
}

export function DevLeisteClient({
  email,
  rolle,
  istPruefkonto,
  passwortGesetzt,
}: {
  email: string | null
  rolle: string | null
  istPruefkonto: boolean
  passwortGesetzt: boolean
}) {
  const pfad = usePathname()
  const [offen, setOffen] = useState(false)
  const [daten, setDaten] = useState<DevLeistenDaten | null>(null)
  const [meldung, setMeldung] = useState<string | null>(null)
  const [laedt, starte] = useTransition()

  const laden = () =>
    starte(async () => {
      setDaten(await devDatenLaden())
    })

  const umschalten = () => {
    const naechst = !offen
    setOffen(naechst)
    if (naechst) laden()
  }

  const anlegen = () =>
    starte(async () => {
      const { fehler } = await devKontenAnlegen()
      setMeldung(fehler ?? 'Prüfkonten angelegt bzw. wiederhergestellt.')
      setDaten(await devDatenLaden())
    })

  const ziel = wechselZiel(pfad)
  const abweichend = daten?.konten.filter((zeile) => zeile.abweichend).length ?? 0

  return (
    <div
      data-dev-leiste
      className="relative z-[70] shrink-0 border-b border-amber-400/30 bg-[#17140f] font-sans text-amber-50"
    >
      <div className="flex h-9 items-center gap-2 overflow-hidden px-2 text-[12px] sm:px-3">
        <span className="shrink-0 rounded bg-amber-400 px-1.5 py-px text-[10px] font-bold tracking-wider text-black">
          DEV
        </span>
        {email ? (
          <span data-dev-identitaet className="flex min-w-0 items-center gap-1.5">
            <span className="truncate font-medium">{email}</span>
            <span className="shrink-0 text-amber-200/60">{rolle ?? 'ohne Rolle'}</span>
            {!istPruefkonto ? (
              <span className="shrink-0 rounded bg-amber-400/15 px-1 text-[10px] text-amber-200">
                echtes Konto
              </span>
            ) : null}
          </span>
        ) : (
          <span data-dev-identitaet className="text-amber-200/60">
            nicht angemeldet
          </span>
        )}
        <span className="ml-auto flex shrink-0 items-center gap-2">
          {abweichend > 0 ? (
            <span className="rounded bg-amber-400/20 px-1 text-[10px] text-amber-200" title="Prüfkonten weichen ab">
              {abweichend}&nbsp;≠
            </span>
          ) : null}
          <button type="button" onClick={umschalten} aria-expanded={offen} className={KNOPF}>
            {offen ? 'Leiste schließen' : 'Leiste öffnen'}
          </button>
        </span>
      </div>

      {offen ? (
        <div className="absolute inset-x-0 top-9 max-h-[75vh] overflow-y-auto border-b border-amber-400/30 bg-[#17140f] px-2 pb-4 pt-3 shadow-2xl sm:px-3">
          {!passwortGesetzt ? (
            <p className="mb-3 rounded border border-red-400/40 bg-red-500/10 px-2 py-1 text-[12px] text-red-200">
              DEV_ACCOUNT_PASSWORD fehlt in .env.local. Ohne Passwort kann sich der Wechsel nicht anmelden.
            </p>
          ) : null}
          {daten?.fehler ? (
            <p className="mb-3 rounded border border-red-400/40 bg-red-500/10 px-2 py-1 text-[12px] text-red-200">
              Prüfkonten nicht lesbar: {daten.fehler}
            </p>
          ) : null}

          <div className="grid gap-x-6 gap-y-4 lg:grid-cols-3">
            <Abschnitt titel="Konto wechseln">
              {daten === null ? (
                <p className="text-[12px] text-amber-200/50">Lade …</p>
              ) : (
                (['intern', 'nutzer', 'negativ'] as DevGruppe[]).map((gruppe) => {
                  const zeilen = daten.konten.filter((zeile) => zeile.konto.gruppe === gruppe)
                  if (zeilen.length === 0) return null
                  return (
                    <div key={gruppe}>
                      <div className="mb-1 text-[10px] uppercase tracking-wide text-amber-200/40">
                        {DEV_GRUPPEN_BESCHRIFTUNG[gruppe]}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {zeilen.map(({ konto, vorhanden, abweichend: weichtAb }) => (
                          <form key={konto.email} action={devWechseln} autoComplete="off">
                            <input type="hidden" name="email" value={konto.email} />
                            <input type="hidden" name="ziel" value={ziel} />
                            <button
                              type="submit"
                              disabled={!passwortGesetzt || !vorhanden}
                              title={`${konto.hinweis}\nRolle: ${konto.rolle}, Ziel: ${ziel}`}
                              className={
                                konto.email === email
                                  ? `${KNOPF} border-amber-300 bg-amber-400/20`
                                  : KNOPF
                              }
                            >
                              {konto.label}
                              {weichtAb && vorhanden ? <span className="ml-1 text-amber-300">≠</span> : null}
                              {!vorhanden ? <span className="ml-1 text-red-300">fehlt</span> : null}
                            </button>
                          </form>
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
              <p className="text-[11px] leading-snug text-amber-200/50">
                Echte Anmeldung mit Passwort, kein Token. Zurück zum eigenen Konto nur über Abmelden.
              </p>
            </Abschnitt>

            <Abschnitt titel="Was dieses Konto sieht (RLS)">
              {!email ? (
                <p className="text-[12px] text-amber-200/50">Keine Sitzung, nichts gezählt.</p>
              ) : daten === null || laedt ? (
                <p className="text-[12px] text-amber-200/50">Zähle …</p>
              ) : daten.zaehler.length === 0 ? (
                <p className="text-[12px] text-amber-200/50">
                  Noch keine Tabellen eingetragen (GEZAEHLT in lib/dev/zustand.ts).
                </p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {daten.zaehler.map((zaehler) => (
                    <span
                      key={zaehler.label}
                      title={zaehler.fehler ?? undefined}
                      className={`rounded border px-1.5 py-0.5 text-[12px] ${
                        zaehler.fehler
                          ? 'border-red-400/40 bg-red-500/10 text-red-200'
                          : 'border-amber-400/25 bg-black/40 text-amber-50'
                      }`}
                    >
                      {zaehler.label} <span className="font-semibold">{zaehler.fehler ? 'Fehler' : zaehler.anzahl}</span>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[11px] leading-snug text-amber-200/50">
                Gezählt mit dem RLS-Client dieser Sitzung, nicht als Admin. „Fehler“ statt einer Zahl heißt:
                Die Policy wirft. Ein leerer Zustand hätte das als „keine Daten“ getarnt.
              </p>
            </Abschnitt>

            <Abschnitt titel="Werkzeuge">
              <div className="flex flex-wrap gap-1">
                <button type="button" onClick={anlegen} disabled={laedt || !passwortGesetzt} className={KNOPF}>
                  Prüfkonten anlegen
                </button>
                <button type="button" onClick={laden} disabled={laedt} className={KNOPF}>
                  Neu zählen
                </button>
                <form action={devAbmelden} autoComplete="off">
                  <button type="submit" className={KNOPF}>
                    Abmelden
                  </button>
                </form>
              </div>
              {meldung ? (
                <p role="status" className="text-[12px] text-amber-100">
                  {meldung}
                </p>
              ) : null}
              <p className="text-[11px] leading-snug text-amber-200/50">
                Legt die Konten aus lib/dev/konten.ts an oder setzt Passwort, Rolle und Status zurück.
              </p>
            </Abschnitt>
          </div>
        </div>
      ) : null}
    </div>
  )
}

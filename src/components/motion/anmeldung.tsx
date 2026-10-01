'use client'

import { useId, useRef, useState } from 'react'
import { DAUER, KURVE, bewegungErlaubt, gsap, useGSAP } from '@/lib/motion/gsap'
import { AktionKnopf } from './aktion-knopf'

// Anmeldung mit E-Mail und Passwort, auf Wunsch mit zweitem Schritt (6-stelliger Code aus der
// Authenticator-App oder per Mail). Datenunabhängig: Prüfen übernehmen beiAnmelden und beiCode.
// Was zählt (Handbuch „Formular“, Regel auth-haertung): Label über dem Feld, Passwort anzeigbar,
// Feststelltaste wird gemeldet, Fehler sagen nicht, ob es die Adresse gibt, und stehen in einer
// role="alert"-Zeile mit aria-invalid an den Feldern. Der Code nimmt Einfügen an und springt
// selbst weiter. Bewegung: falscher Code schüttelt das Feld einmal, der Schrittwechsel gleitet.
export type AnmeldeErgebnis = { ok: true } | { code: true } | { fehler: string }

const STIL = `
.gc-an{display:grid;gap:1.1rem;width:min(24rem,100%)}
.gc-an-titel{font-size:1.4rem;font-weight:600;letter-spacing:-.01em;outline:none}
.gc-an-feld{display:grid;gap:.4rem}
.gc-an-zeile{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;font-size:.9rem}
.gc-an-eingabe{position:relative}
.gc-an-feld input{width:100%;font:inherit;padding:.7rem .8rem;border-radius:.5rem;border:1px solid var(--anmeldung-linie,color-mix(in oklab,currentColor 25%,transparent));background:transparent;color:inherit}
.gc-an-feld input[aria-invalid=true]{border-color:var(--anmeldung-fehler,#b42318)}
.gc-an-zeigen{position:absolute;right:.35rem;top:50%;transform:translateY(-50%);min-height:36px;padding:0 .6rem;border:0;border-radius:.4rem;background:transparent;color:inherit;font:inherit;font-size:.85rem;cursor:pointer;text-decoration:underline}
.gc-an-hinweis{font-size:.85rem;color:var(--anmeldung-leise,color-mix(in oklab,currentColor 65%,transparent))}
.gc-an-fehler{display:flex;gap:.5rem;align-items:flex-start;font-size:.9rem;color:var(--anmeldung-fehler,#b42318)}
.gc-an-link{color:inherit}
.gc-an-code{display:grid;grid-template-columns:repeat(6,1fr);gap:.5rem}
.gc-an-code input{text-align:center;font-size:1.4rem;font-variant-numeric:tabular-nums;padding:.6rem 0;min-height:52px}
.gc-an-knopf{width:100%}
`

export function Anmeldung({
  beiAnmelden,
  beiCode,
  passwortVergessen,
  titel = 'Anmelden',
}: {
  beiAnmelden: (d: { email: string; passwort: string }) => Promise<AnmeldeErgebnis>
  beiCode?: (code: string) => Promise<AnmeldeErgebnis>
  passwortVergessen?: string
  titel?: string
}) {
  const [schritt, setSchritt] = useState<'daten' | 'code' | 'fertig'>('daten')
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [zeigen, setZeigen] = useState(false)
  const [feststell, setFeststell] = useState(false)
  const [fehler, setFehler] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useGSAP(
    () => {
      if (schritt === 'daten') return
      if (bewegungErlaubt()) gsap.fromTo('[data-an-inhalt]', { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: DAUER.md, ease: KURVE.raus })
      ref.current?.querySelector<HTMLElement>(schritt === 'code' ? '.gc-an-code input' : '.gc-an-titel')?.focus()
    },
    { dependencies: [schritt], scope: ref },
  )

  const schuetteln = (ziel: string) => {
    if (bewegungErlaubt()) gsap.fromTo(ref.current!.querySelector(ziel), { x: 0 }, { keyframes: { x: [-8, 8, -5, 5, 0] }, duration: DAUER.md, ease: 'none' })
  }

  const anmelden = async () => {
    setFehler('')
    if (!email.trim() || !passwort) {
      setFehler('Bitte E-Mail und Passwort eingeben.')
      throw new Error('leer')
    }
    const r = await beiAnmelden({ email: email.trim(), passwort })
    if ('fehler' in r) {
      setFehler(r.fehler)
      throw new Error(r.fehler)
    }
    setTimeout(() => setSchritt('code' in r ? 'code' : 'fertig'), 'code' in r ? 300 : 900)
  }

  const codePruefen = async (ziffern: string[]) => {
    if (!beiCode || ziffern.join('').length < 6) return
    const r = await beiCode(ziffern.join(''))
    if ('fehler' in r) {
      setFehler(r.fehler)
      setCode(['', '', '', '', '', ''])
      schuetteln('.gc-an-code')
      ref.current?.querySelector<HTMLElement>('.gc-an-code input')?.focus()
      return
    }
    setSchritt('fertig')
  }

  const ziffer = (i: number, wert: string) => {
    const nur = wert.replace(/\D/g, '')
    const neu = [...code]
    if (nur.length > 1) {
      // Eingefügter Code: auf die Felder verteilen.
      nur.slice(0, 6).split('').forEach((z, j) => (neu[j] = z))
    } else neu[i] = nur
    setCode(neu)
    setFehler('')
    const felder = ref.current?.querySelectorAll<HTMLInputElement>('.gc-an-code input')
    const naechstes = nur.length > 1 ? Math.min(nur.length, 5) : nur ? i + 1 : i
    felder?.[naechstes]?.focus()
    if (neu.every(Boolean)) codePruefen(neu)
  }

  const fehlerZeile = fehler && (
    <div className="gc-an-fehler" role="alert">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: 2 }}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7.5v5.5M12 16.5v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>{fehler}</span>
    </div>
  )

  return (
    <div ref={ref} className="gc-an">
      <style href="gc-anmeldung" precedence="default">{STIL}</style>

      {schritt === 'daten' && (
        <form className="gc-an" onSubmit={(e) => e.preventDefault()} noValidate>
          <h2 className="gc-an-titel" tabIndex={-1}>{titel}</h2>
          <div className="gc-an-feld">
            <label htmlFor={`${id}-mail`}>E-Mail</label>
            <input
              id={`${id}-mail`}
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              aria-invalid={!!fehler}
              aria-describedby={fehler ? `${id}-fehler` : undefined}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="gc-an-feld">
            <div className="gc-an-zeile">
              <label htmlFor={`${id}-pw`}>Passwort</label>
              {passwortVergessen && <a className="gc-an-link" href={passwortVergessen}>Passwort vergessen?</a>}
            </div>
            <div className="gc-an-eingabe">
              <input
                id={`${id}-pw`}
                type={zeigen ? 'text' : 'password'}
                autoComplete="current-password"
                value={passwort}
                aria-invalid={!!fehler}
                onChange={(e) => setPasswort(e.target.value)}
                onKeyUp={(e) => setFeststell(e.getModifierState('CapsLock'))}
                style={{ paddingRight: '6rem' }}
              />
              <button type="button" className="gc-an-zeigen" aria-pressed={zeigen} onClick={() => setZeigen(!zeigen)}>
                {zeigen ? 'Verbergen' : 'Anzeigen'}
              </button>
            </div>
            {feststell && <div className="gc-an-hinweis">Die Feststelltaste ist an.</div>}
          </div>
          <div id={`${id}-fehler`}>{fehlerZeile}</div>
          <AktionKnopf type="submit" className="gc-an-knopf" beiAktion={anmelden} fertigText="Angemeldet" fehlerText="Erneut versuchen">
            Anmelden
          </AktionKnopf>
        </form>
      )}

      {schritt === 'code' && (
        <div className="gc-an" data-an-inhalt>
          <h2 className="gc-an-titel" tabIndex={-1}>Code eingeben</h2>
          <p className="gc-an-hinweis" id={`${id}-code-hilfe`}>Den 6-stelligen Code aus der Authenticator-App eingeben. Er wechselt alle 30 Sekunden.</p>
          <div className="gc-an-feld">
            <div className="gc-an-code" role="group" aria-label="Sicherheitscode, 6 Ziffern" aria-describedby={`${id}-code-hilfe`}>
              {code.map((z, i) => (
                <input
                  key={i}
                  inputMode="numeric"
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  aria-label={`Ziffer ${i + 1}`}
                  aria-invalid={!!fehler}
                  maxLength={i === 0 ? 6 : 1}
                  value={z}
                  onChange={(e) => ziffer(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !z && i > 0) ref.current?.querySelectorAll<HTMLInputElement>('.gc-an-code input')[i - 1]?.focus()
                  }}
                />
              ))}
            </div>
          </div>
          {fehlerZeile}
          <button type="button" className="gc-an-zeigen" style={{ position: 'static', transform: 'none', justifySelf: 'start', padding: 0 }} onClick={() => { setSchritt('daten'); setFehler('') }}>
            Zurück zur Anmeldung
          </button>
        </div>
      )}

      {schritt === 'fertig' && (
        <div data-an-inhalt role="status">
          <h2 className="gc-an-titel" tabIndex={-1}>Angemeldet.</h2>
          <p className="gc-an-hinweis">Weiter geht es zur Übersicht.</p>
        </div>
      )}
    </div>
  )
}

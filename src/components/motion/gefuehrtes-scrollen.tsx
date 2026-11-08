'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/motion/gsap'

// Geführtes Scrollen (aus lennyhelps.de, 08.11.2026, nach talp.ai). Eine Sache pro Bildschirm, und die
// Seite begleitet, statt festzuhalten:
// - Folgen: Das Rad bewegt die Seite ab dem ersten Pixel, über eine kritisch gedämpfte Feder geglättet.
// - Landen: Lässt die Hand los oder klingt der Trackpad-Schwung ab, läuft die Seite mit ihrer
//   momentanen Geschwindigkeit weich auf einem Abschnitt aus (Kurve 5. Grades, ohne Ruck).
// - Absicht lesen: Schub trägt zum nächsten, ein Stups federt zurück, der zweite geht weiter, viel
//   Schwung rauscht frei durch. Jede neue Eingabe beendet ein Landen und behält das Tempo.
// - Hohe Abschnitte und der Fuß sind frei lesbar; ein Abschnitt mit [data-punkte="0,160,…"] oder
//   einem Kartenstapel ([data-stapel], kartenstapel.tsx) nennt eigene Landepunkte. Teile mit
//   [data-segment] in einem hohen Abschnitt landen je mittig im Bild.
// - Finger und Scrollbalken nativ, danach Landen, wenn ein Abschnitt nah ist; Tasten springen weich.
//   Nie nach Tab, Anker oder Suche. Frei: Strg+Rad, waagerecht, eigene Scrollbereiche, Dialoge.
// - Passen: Ist ein Abschnitt am Desktop höher als der Bildschirm, wird sein Inhalt um höchstens 20 %
//   verkleinert (wie talp); passt er dann nicht, braucht er ein anderes Layout.
// Einbau: <GefuehrtesScrollen /> einmal im Layout, data-gefuehrt an <main>. Andere Bausteine gleiten
// mit derselben Bewegung über window.dispatchEvent(new CustomEvent(GLEITE_EREIGNIS, { detail: { nach } })).
// Aus bei reduzierter Bewegung und auf Seiten mit einem Element [data-frei-scrollen] (Formulare, Rechtstexte).
// Verhalten getestet mit nachgestellten Trackpad- und Rad-Ereignissen; die Zahlen unten sind die
// abgestimmten Werte von lennyhelps.de.

const ABSCHNITTE = '[data-gefuehrt] > :is(section, div)'
const AUS = '[data-frei-scrollen]'
const KOPF = 'header'
export const GLEITE_EREIGNIS = 'gc:gleite'

const FEDER = 60 // ms: wie weich die Seite einem Trackpad folgt
const FEDER_MAUS = 95 // … einem Mausrad
const STUPS = 0.14 // vom Bildschirm: weniger ist ein Stups, mehr ein Schub
const AUSROLLEN = 300 // ms: so weit liefe ein abklingender Trackpad-Schwung noch
const DURCHRAUSCHEN = 0.9 // Bildschirme: mehr Restschwung als das heißt „ich will weiter“
const ABKLINGEN_MS = 130 // so lange fallend …
const ABKLINGEN_AUF = 0.7 // … auf diesen Anteil heißt: der Schwung klingt ab (Fingerrauschen nicht)
const STILL = 110 // ms ohne Rad, dann ist die Hand weg
const STILL_LANGSAM = 240
const STILL_MAUS = 220
const NEUE_GESTE = 70 // ms Abstand: ein neues Ansetzen
const LANDEN_MIN = 380
const LANDEN_MAX = 1150
const HAND_WARTEN = 240 // ms nach Finger oder Scrollbalken
const HAND_REICHWEITE = 0.35 // Bildschirme: so nah muss ein Abschnitt nach Finger oder Balken sein

type Halt = { a: number; b: number } // a = b: ein Abschnitt; a < b: frei lesbarer hoher Abschnitt
type Landung = { y0: number; v0: number; nach: number; T: number; t0: number; c3: number; c4: number; c5: number }

const begrenzt = (x: number, lo: number, hi: number) => (x < lo ? lo : x > hi ? hi : x)

/** Kann ein Element unter dem Zeiger selbst in diese Richtung scrollen? Dann gehört das Rad ihm. */
function eigenerScroll(e: Event, richtung: number): boolean {
  for (const ziel of e.composedPath()) {
    if (!(ziel instanceof Element) || ziel === document.body || ziel === document.documentElement) break
    if (ziel.scrollHeight <= ziel.clientHeight + 1) continue
    const o = getComputedStyle(ziel).overflowY
    if (o !== 'auto' && o !== 'scroll') continue
    if (richtung > 0 ? ziel.scrollTop + ziel.clientHeight < ziel.scrollHeight - 1 : ziel.scrollTop > 0) return true
  }
  return false
}

const KLEINSTER = 0.8

/** Verkleinert den Inhalt eines zu hohen Abschnitts, bis er auf den Bildschirm passt (höchstens 20 %).
 *  Läuft auch bei reduzierter Bewegung, denn es ist Layout. Sticky-Szenen bleiben, wie sie sind. */
function abschnittePassen() {
  document.querySelectorAll<HTMLElement>('[data-passen]').forEach((el) => {
    el.removeAttribute('data-passen')
    el.style.removeProperty('--passen')
  })
  if (document.querySelector(AUS)) return
  if (!window.matchMedia('(min-width: 861px) and (min-height: 620px)').matches) return
  const nav = document.querySelector<HTMLElement>(KOPF)?.getBoundingClientRect().height ?? 72
  const raum = window.innerHeight - nav
  document.querySelectorAll<HTMLElement>(ABSCHNITTE).forEach((el) => {
    if (el.offsetHeight <= raum + 1) return
    if (Array.from(el.querySelectorAll('*')).some((x) => getComputedStyle(x).position === 'sticky')) return
    el.setAttribute('data-passen', '')
    const hoch = (z: number) => {
      el.style.setProperty('--passen', z.toFixed(3))
      return el.offsetHeight
    }
    if (hoch(KLEINSTER) > raum + 1) {
      // Passt auch klein nicht: bleibt groß, die Führung schreitet ihn bildschirmweise ab.
      el.removeAttribute('data-passen')
      el.style.removeProperty('--passen')
      return
    }
    let lo = KLEINSTER
    let hi = 1
    for (let i = 0; i < 7; i++) {
      const m = (lo + hi) / 2
      if (hoch(m) <= raum + 1) lo = m
      else hi = m
    }
    hoch(lo)
  })
}

const STIL = `
@media (min-width:861px) and (min-height:620px){
  html:not(:has([data-frei-scrollen])) [data-gefuehrt] > :is(section,div){min-height:calc(100svh - var(--kopf-hoehe,0px));align-content:center}
  html:not(:has([data-frei-scrollen])) [data-gefuehrt] > [data-passen] > *{zoom:var(--passen,1)}
}`

export function GefuehrtesScrollen() {
  const pfad = usePathname()

  // Passen: nach dem Laden, wenn Schriften und Bilder da sind, und bei jeder Größenänderung.
  useEffect(() => {
    let takt = 0
    const spaeter = () => {
      cancelAnimationFrame(takt)
      takt = requestAnimationFrame(() => {
        abschnittePassen()
        ScrollTrigger.refresh()
      })
    }
    spaeter()
    document.fonts?.ready.then(spaeter)
    const nachBildern = setTimeout(spaeter, 1200)
    window.addEventListener('resize', spaeter)
    window.addEventListener('load', spaeter)
    return () => {
      cancelAnimationFrame(takt)
      clearTimeout(nachBildern)
      window.removeEventListener('resize', spaeter)
      window.removeEventListener('load', spaeter)
    }
  }, [pfad])

  useEffect(() => {
    const html = document.documentElement
    const reduziert = !window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    const ausgenommen = Boolean(document.querySelector(AUS))

    // Ohne Führung gleiten andere Bausteine trotzdem: so, wie der Browser es kann.
    if (reduziert || ausgenommen) {
      const einfach = (e: Event) => {
        const nach = (e as CustomEvent<{ nach: number }>).detail?.nach ?? 0
        window.scrollTo({ top: nach, behavior: reduziert ? 'instant' : 'smooth' })
      }
      window.addEventListener(GLEITE_EREIGNIS, einfach)
      return () => window.removeEventListener(GLEITE_EREIGNIS, einfach)
    }

    const navHoehe = () => document.querySelector<HTMLElement>(KOPF)?.getBoundingClientRect().height ?? 72
    const raum = () => window.innerHeight - navHoehe()
    const belegt = () => Boolean(document.querySelector('dialog[open], [aria-modal="true"]'))
    let maxY = 0
    let maxAm = -Infinity
    const grenze = (jetzt: number) => {
      if (jetzt - maxAm > 250) {
        maxY = Math.max(0, html.scrollHeight - window.innerHeight)
        maxAm = jetzt
      }
      return maxY
    }

    // Lage und Bewegung der Seite (px, px/ms)
    let y = window.scrollY
    let v = 0
    let ziel = y
    let geschrieben = y
    let feder = FEDER
    let modus: 0 | 1 | 2 = 0 // 0 still, 1 folgt der Hand, 2 landet
    let landung: Landung | null = null
    let rahmen = 0
    let letzterRahmen = 0
    // Die Geste
    let von: number | null = null // wo die Seite stand, als die Geste begann
    let stups: { r: number; t: number } | null = null
    let richtung = 1
    let maus = false
    let mitnahme = 0 // Rad in Landerichtung während des Landens
    // Das Rad als Strom
    let letztesEv = -Infinity
    let vorD = 0
    let tempo = 0 // geglättete Raddrehung, px/ms
    let abfallAb = 0
    let abfallHoch = 0
    let abfallTief = 0
    let schwanz = false // der Rest eines Schwungs, der schon gelandet wird
    let schwanzAb = 0
    let schwanzHoch = 0
    let schwanzTief = 0
    let eigenerBereich = false
    let still: ReturnType<typeof setTimeout> | undefined
    // Andere Eingaben
    let fingerUnten = false
    let gedrueckt = false
    let letzteHand = -Infinity
    let letzteTaste = -Infinity

    function halte(): Halt[] {
      const nav = navHoehe()
      const r = window.innerHeight - nav
      const max = Math.max(0, html.scrollHeight - window.innerHeight)
      const aus: Halt[] = []
      document.querySelectorAll<HTMLElement>(ABSCHNITTE).forEach((el) => {
        const h = el.offsetHeight
        if (h < 2) return
        const oben = el.getBoundingClientRect().top + window.scrollY - nav
        const a = begrenzt(Math.round(oben), 0, max)
        const b = h <= r + 2 ? a : begrenzt(Math.round(oben + h - r), a, max)
        // Tunnel und andere Szenen nennen ihre Landepunkte selbst (px ab ihrem Anfang).
        const eigene = a < b ? (el.matches('[data-punkte]') ? el : el.querySelector<HTMLElement>('[data-punkte]')) : null
        if (eigene) {
          const basis = eigene.getBoundingClientRect().top + window.scrollY - nav
          const liste = (eigene.dataset.punkte ?? '').split(',').map(Number).filter(Number.isFinite)
          Array.from(new Set([a, ...liste.map((o) => begrenzt(Math.round(basis + o), a, b)), b]))
            .sort((x, z) => x - z)
            .forEach((p) => aus.push({ a: p, b: p }))
          return
        }
        // Abschnitte aus mehreren Teilen (data-segment): jedes Teil ist ein Landepunkt, mittig im
        // Bild wie bei talp; ein Teil, das höher ist als der Bildschirm, landet mit der Oberkante.
        // Ein Teil, das beim Punkt davor schon ganz zu sehen ist, bekommt keinen eigenen.
        const segmente = a < b ? Array.from(el.querySelectorAll<HTMLElement>('[data-segment]')) : []
        if (segmente.length) {
          const punkte = [a]
          segmente.forEach((s) => {
            const q = s.getBoundingClientRect()
            const t = q.top + window.scrollY
            const u = t + q.height
            const letzter = punkte[punkte.length - 1]
            if (t >= letzter + nav - 1 && u <= letzter + nav + r + 1) return
            const p = q.height <= r ? (t + u) / 2 - nav - r / 2 : t - nav - 24
            punkte.push(begrenzt(Math.round(p), a, b))
          })
          const geordnet = [...punkte, b].sort((x, z) => x - z)
          const gesetzt: number[] = []
          geordnet.forEach((p) => {
            const vorher = gesetzt[gesetzt.length - 1]
            if (vorher === undefined || p - vorher > 40) gesetzt.push(p)
            else if (p === b) gesetzt[gesetzt.length - 1] = b
          })
          gesetzt.forEach((p) => aus.push({ a: p, b: p }))
          return
        }
        const stapel = a < b ? el.querySelector<HTMLElement>('[data-stapel]') : null
        if (!stapel) {
          aus.push({ a, b })
          return
        }
        // Kartenstapel: jede Karte ist ein Landepunkt, dort, wo sie an ihrer Klebekante ankommt.
        // Gerechnet aus dem Stapel selbst (klebt nicht) und den Kartenhöhen, denn eine klebende
        // Karte meldet ihre geklebte Lage, nicht ihren Platz im Fluss.
        const punkte = [a]
        const st = getComputedStyle(stapel)
        const luecke = parseFloat(st.rowGap) || 0
        let fluss = stapel.getBoundingClientRect().top + window.scrollY
        ;(Array.from(stapel.children) as HTMLElement[]).forEach((karte, i) => {
          const kante = parseFloat(getComputedStyle(karte).top)
          // Die erste Karte steht beim Abschnittsanfang schon ganz da (mit Überschrift): kein eigener Punkt.
          const schonDa = i === 0 && fluss + karte.offsetHeight <= oben + nav + r
          if (Number.isFinite(kante) && !schonDa) punkte.push(begrenzt(Math.round(fluss - kante), a, b))
          fluss += karte.offsetHeight + luecke
        })
        punkte.push(b)
        Array.from(new Set(punkte))
          .sort((x, z) => x - z)
          .forEach((p) => aus.push({ a: p, b: p }))
      })
      return aus
    }

    /** Wohin eine Seite, die bei p stünde und sich in Richtung r bewegt, gleiten soll; null lässt sie frei. */
    function entscheide(p: number, r: number, jetzt: number): number | null {
      const H = halte()
      if (!H.length) return null
      const R = raum()
      const letzter = H[H.length - 1].b
      if (p > letzter + 2 && (r > 0 || (von !== null && Math.abs(p - von) < R * STUPS))) {
        return null // der Fuß ist frei
      }
      for (const h of H) {
        if (p >= h.a - 2 && p <= h.b + 2) {
          if (h.a === h.b) return h.a
          return null // mitten in einem hohen Abschnitt: lesen
        }
      }
      let vor: number | null = null
      let zurueck: number | null = null
      for (const h of H) {
        const kante = p < h.a ? h.a : h.b
        const g = (kante - p) * r
        if (g > 0 && (vor === null || g < (vor - p) * r)) vor = kante
        if (g < 0 && (zurueck === null || -g < (p - zurueck) * r)) zurueck = kante
      }
      // Von einem Abschnitt losgelassen und noch keinen neuen erreicht.
      if (von !== null && zurueck !== null && Math.abs(von - zurueck) < 6) {
        const wieder = stups !== null && stups.r === r && jetzt - stups.t < 3000
        if (maus || wieder || vor === null || Math.abs(p - von) >= R * STUPS) {
          stups = null
          return vor ?? zurueck
        }
        stups = { r, t: jetzt } // ein Stups: zurück, gemerkt, der nächste geht weiter
        return zurueck
      }
      // Lang gescrollt: der nächstgelegene, mit Neigung in Scrollrichtung.
      const dv = vor === null ? Infinity : Math.abs(vor - p) * 0.75
      const dz = zurueck === null ? Infinity : Math.abs(p - zurueck) * 1.25
      return dv <= dz ? vor : zurueck
    }

    function rahmenLauf(jetzt: number) {
      rahmen = 0
      const dt = begrenzt(jetzt - letzterRahmen, 1, 34)
      letzterRahmen = jetzt
      if (modus === 1) {
        // Kritisch gedämpfte Feder, exakt gelöst: bei jeder Bildrate dieselbe Bewegung.
        const w = 1 / feder
        const x = y - ziel
        const e = Math.exp(-w * dt)
        const k = (v + w * x) * dt
        v = (v - w * k) * e
        y = ziel + (x + k) * e
        if (Math.abs(y - ziel) < 0.3 && Math.abs(v) < 0.01) {
          y = ziel
          v = 0
          modus = 0
        }
      } else if (modus === 2 && landung) {
        const L = landung
        const t = begrenzt(jetzt - L.t0, 0, L.T)
        y = L.y0 + t * (L.v0 + t * t * (L.c3 + t * (L.c4 + t * L.c5)))
        v = L.v0 + t * t * (3 * L.c3 + t * (4 * L.c4 + t * 5 * L.c5))
        if (t >= L.T) {
          y = L.nach
          v = 0
          modus = 0
          von = null
          landung = null
        }
      }
      const max = grenze(jetzt)
      if (y > max) {
        y = max
        if (v > 0) v = 0
      } else if (y < 0) {
        y = 0
        if (v < 0) v = 0
      }
      geschrieben = y
      window.scrollTo({ top: y, behavior: 'instant' })
      if (modus) rahmen = requestAnimationFrame(rahmenLauf)
    }
    function laufen() {
      if (rahmen) return
      const jetzt = performance.now()
      if (jetzt - letzterRahmen > 40) letzterRahmen = jetzt - 16
      rahmen = requestAnimationFrame(rahmenLauf)
    }

    /** Landen: von der Lage und Geschwindigkeit jetzt weich auf nach, ohne Ruck an beiden Enden. */
    function lande(nach: number) {
      const D = nach - y
      const n = Math.abs(D)
      const sp = Math.abs(v)
      let v0 = v
      if (n < 0.5 && sp < 0.02) {
        von = null
        modus = 1
        ziel = nach
        laufen()
        return
      }
      let T = begrenzt(560 + n * 0.62, 560, LANDEN_MAX)
      if (v0 * D > 0) {
        // Schon unterwegs dorthin: Bei T = 2D/v fällt die Geschwindigkeit nur noch, wie beim Ausrollen.
        T = Math.min(T, Math.max(LANDEN_MIN, (2 * n) / sp))
        if ((v0 * T) / D > 2.4) v0 = (2.4 * D) / T // darüber schösse sie übers Ziel
      } else if (sp > 0.02) T = Math.max(T, 700) // umkehren braucht einen Moment
      const T3 = T * T * T
      const a = v0 * T
      // Aus dem Stand (Taste, Logo) ist die letzte Bildzeit alt: Die Landung beginnt jetzt, nicht dann.
      const jetzt = performance.now()
      if (!rahmen || jetzt - letzterRahmen > 40) letzterRahmen = jetzt - 16
      landung = {
        y0: y,
        v0,
        nach,
        T,
        t0: letzterRahmen,
        c3: (10 * D - 6 * a) / T3,
        c4: (-15 * D + 8 * a) / (T3 * T),
        c5: (6 * D - 3 * a) / (T3 * T * T),
      }
      modus = 2
      mitnahme = 0
      laufen()
    }

    function anhalten() {
      if (rahmen) cancelAnimationFrame(rahmen)
      rahmen = 0
      modus = 0
      landung = null
      v = 0
      schwanz = false
      clearTimeout(still)
      y = ziel = geschrieben = window.scrollY
    }

    /** Die Hand ist weg und es kommt nichts mehr. */
    function loslassen() {
      still = undefined
      if (von === null) return
      if (belegt() || fingerUnten || gedrueckt) {
        von = null
        return
      }
      const nach = entscheide(ziel, richtung, performance.now())
      if (nach === null) {
        von = null
        return
      }
      lande(nach)
    }

    /** Finger oder Scrollbalken haben die Seite bewegt und sind fertig. */
    function nachDerHand() {
      still = undefined
      if (von === null || fingerUnten || gedrueckt) return
      const jetzt = performance.now()
      if (belegt() || jetzt - letzteTaste < 900 || jetzt - letzteHand > 1500) {
        von = null // Tasten, Tab, Anker, Suche: nie hinterher landen
        return
      }
      y = ziel = geschrieben = window.scrollY
      v = 0
      const nach = entscheide(y, richtung, jetzt)
      if (nach === null || Math.abs(nach - y) > raum() * HAND_REICHWEITE) {
        von = null
        return
      }
      lande(nach)
    }

    const beiRad = (e: WheelEvent) => {
      if (e.ctrlKey || belegt()) return
      const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY
      if (!d || Math.abs(e.deltaX) > Math.abs(d)) return
      const jetzt = e.timeStamp || performance.now()
      const luecke = jetzt - letztesEv
      if (luecke > NEUE_GESTE) eigenerBereich = eigenerScroll(e, d)
      if (eigenerBereich || !e.cancelable) {
        letztesEv = jetzt
        vorD = d
        return
      }
      const frisch = luecke > NEUE_GESTE || d * vorD < 0
      const momentan = Math.abs(d) / (frisch ? 16 : Math.max(luecke, 8))
      tempo = frisch ? momentan * 0.4 : tempo + (momentan - tempo) * 0.4 // jede Geste beginnt bei null

      if (schwanz) {
        // Der abklingende Rest eines Schwungs, der schon gelandet wird: gehört dazu, wird geschluckt.
        const alter = jetzt - schwanzAb
        const faellt = alter < 160 || tempo < 0.15 || tempo < schwanzHoch * Math.exp(-alter / 1100) + 0.02
        if (!frisch && faellt && tempo < schwanzTief * 1.5 + 0.08) {
          schwanzTief = Math.min(schwanzTief, tempo)
          letztesEv = jetzt
          vorD = d
          e.preventDefault()
          return
        }
        schwanz = false // wieder stärker: eine neue Geste
      }
      const max = grenze(jetzt)
      if ((d < 0 && y <= 0.5 && ziel <= 0) || (d > 0 && y >= max - 0.5 && ziel >= max)) {
        letztesEv = jetzt
        vorD = d
        return // die Enden der Seite federn wie gewohnt
      }
      e.preventDefault()

      if (frisch) maus = Math.abs(d) >= 50 && d === Math.round(d)
      else if (maus && Math.abs(d) < 50) maus = false
      richtung = d > 0 ? 1 : -1
      letztesEv = jetzt
      vorD = d
      if (von === null) von = modus ? y : window.scrollY
      if (frisch) feder = maus ? FEDER_MAUS : FEDER

      if (modus === 2 && landung && (landung.nach - y) * d > 0) {
        // Mehr in dieselbe Richtung, während sie schon dorthin landet: nicht weniger verlangt.
        mitnahme += d
        if ((y + mitnahme + (maus ? 0 : richtung * tempo * AUSROLLEN) - landung.nach) * richtung < 0) {
          clearTimeout(still)
          still = undefined
          return
        }
      }
      if (modus === 2 && landung) {
        // Ein unterbrochenes Landen behält seine Geschwindigkeit: die Feder läuft in diesem Tempo weiter.
        const drueber = mitnahme ? (y + mitnahme - landung.nach) * richtung : 0
        if (drueber >= 0 && mitnahme) von = landung.nach
        ziel = y + 2 * feder * v + (drueber > 0 ? richtung * drueber - d : 0)
        landung = null
        mitnahme = 0
      } else if (modus === 0) {
        y = geschrieben = window.scrollY
        v = 0
        ziel = y
      }
      modus = 1
      ziel = begrenzt(ziel + d, 0, max)
      laufen()

      if (frisch || tempo > abfallTief * 1.12 + 0.01) {
        abfallAb = jetzt
        abfallHoch = tempo
        abfallTief = tempo
      } else abfallTief = Math.min(abfallTief, tempo)
      clearTimeout(still)
      still = setTimeout(loslassen, maus ? STILL_MAUS : tempo < 0.15 ? STILL_LANGSAM : STILL)
      if (!maus && jetzt - abfallAb >= ABKLINGEN_MS && abfallTief < abfallHoch * ABKLINGEN_AUF) {
        // Der Schwung klingt ab. Bleibt nicht mehr viel, landet sie jetzt; bei viel Rest rauscht sie weiter.
        const rest = tempo * AUSROLLEN
        if (rest <= raum() * DURCHRAUSCHEN) {
          const nach = entscheide(ziel + richtung * rest, richtung, jetzt)
          if (nach !== null) {
            clearTimeout(still)
            still = undefined
            schwanz = true
            schwanzAb = jetzt
            schwanzHoch = schwanzTief = tempo
            lande(nach)
          }
        }
      }
    }

    const beiScroll = () => {
      const sy = window.scrollY
      if (Math.abs(sy - geschrieben) < (modus ? 3 : 0.75)) return // die eigene Bewegung
      const war = geschrieben
      anhalten()
      if (von === null) von = war
      richtung = sy >= war ? 1 : -1
      still = setTimeout(nachDerHand, HAND_WARTEN)
    }
    const nochmal = () => {
      letzteHand = performance.now()
      if (von !== null) {
        clearTimeout(still)
        still = setTimeout(nachDerHand, HAND_WARTEN)
      }
    }
    const beiFingerStart = () => {
      anhalten()
      fingerUnten = true
    }
    const beiFingerEnde = () => {
      fingerUnten = false
      nochmal()
    }
    const beiZeigerUnten = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      anhalten()
      gedrueckt = true
    }
    const beiZeigerOben = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !gedrueckt) return
      gedrueckt = false
      nochmal()
    }

    const beiTaste = (e: KeyboardEvent) => {
      const zielEl = e.target as HTMLElement | null
      const r =
        e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)
          ? 1
          : e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)
            ? -1
            : 0
      const bedienung = Boolean(zielEl?.isContentEditable || zielEl?.closest('input, textarea, select, button, video, [role="slider"], [contenteditable="true"]'))
      if (e.repeat) {
        if (r && !bedienung && !e.defaultPrevented && !e.altKey && !e.ctrlKey && !e.metaKey && !eigenerScroll(e, r)) e.preventDefault()
        return
      }
      anhalten()
      letzteTaste = performance.now()
      if (!r || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || bedienung || eigenerScroll(e, r)) return
      if (belegt()) return
      const H = halte()
      const p = window.scrollY
      // In einem hohen Abschnitt lesen die Tasten normal; an seiner Kante geht es zum Nachbarn.
      for (const h of H) {
        if (h.b - h.a <= 4 || p < h.a - 4 || p > h.b + 4) continue
        if (r > 0 ? p < h.b - 4 : p > h.a + 4) return
      }
      let nach: number | null = null
      if (r > 0) nach = H.find((h) => h.a > p + 4)?.a ?? null
      else nach = [...H].reverse().find((h) => h.b < p - 4)?.b ?? null
      if (nach === null) return // an den Enden und im Fuß wie gewohnt
      e.preventDefault()
      von = null
      y = ziel = geschrieben = p
      v = 0
      lande(nach)
    }

    // Andere Bausteine (Logo, Intro) gleiten mit derselben Bewegung.
    const beiGleiten = (e: Event) => {
      const nach = (e as CustomEvent<{ nach: number }>).detail?.nach ?? 0
      anhalten()
      von = null
      lande(begrenzt(nach, 0, grenze(performance.now())))
    }
    const beiGroesse = () => {
      maxAm = -Infinity
    }

    window.addEventListener('wheel', beiRad, { passive: false })
    window.addEventListener('scroll', beiScroll, { passive: true })
    window.addEventListener('touchstart', beiFingerStart, { passive: true })
    window.addEventListener('touchend', beiFingerEnde, { passive: true })
    window.addEventListener('touchcancel', beiFingerEnde, { passive: true })
    window.addEventListener('pointerdown', beiZeigerUnten, { passive: true })
    window.addEventListener('pointerup', beiZeigerOben, { passive: true })
    window.addEventListener('pointercancel', beiZeigerOben, { passive: true })
    window.addEventListener('keydown', beiTaste)
    window.addEventListener('resize', beiGroesse)
    window.addEventListener(GLEITE_EREIGNIS, beiGleiten)
    return () => {
      anhalten()
      window.removeEventListener('wheel', beiRad)
      window.removeEventListener('scroll', beiScroll)
      window.removeEventListener('touchstart', beiFingerStart)
      window.removeEventListener('touchend', beiFingerEnde)
      window.removeEventListener('touchcancel', beiFingerEnde)
      window.removeEventListener('pointerdown', beiZeigerUnten)
      window.removeEventListener('pointerup', beiZeigerOben)
      window.removeEventListener('pointercancel', beiZeigerOben)
      window.removeEventListener('keydown', beiTaste)
      window.removeEventListener('resize', beiGroesse)
      window.removeEventListener(GLEITE_EREIGNIS, beiGleiten)
    }
  }, [pfad])

  return <style href="gc-gefuehrtes-scrollen" precedence="default">{STIL}</style>
}

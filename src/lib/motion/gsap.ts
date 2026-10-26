import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { DAUER, KURVE } from './tokens'

// Die eine Stelle, an der GSAP angemeldet wird. Alle Bausteine importieren gsap von hier, nie
// direkt aus 'gsap'. Plugins, die nur ein Baustein braucht (Flip, SplitText, DrawSVG …), meldet
// dieser Baustein selbst mit registriere() an, damit sie nur dort im Bundle landen.
// Gebündelt über npm: kein Request an einen Dritten (Pflichtkern 3/4).

// Schalter „Animationen stoppen“ des Barrierefreiheits-Panels (@growcore/a11y). Er setzt dieses
// Attribut am <html> und bremst damit nur CSS. GSAP prüft es hier selbst: beim Start über
// bewegungErlaubt(), beim Umschalten im laufenden Betrieb über den Beobachter unten.
export const STOPP_ATTRIBUT = 'data-a11y-stop-animations'

function gestoppt(): boolean {
  return document.documentElement.hasAttribute(STOPP_ATTRIBUT)
}

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
  gsap.defaults({ duration: DAUER.md, ease: KURVE.raus })
  // Die Adressleiste auf dem Handy ändert die Höhe beim Scrollen; das ist kein echtes Resize.
  ScrollTrigger.config({ ignoreMobileResize: true })
  // Nachgeladene Schriften verschieben Zeilen. Danach einmal neu messen, sonst lösen Trigger zu
  // früh oder zu spät aus.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  // Panel schaltet um: Auftritte springen ans Ende, scrollgebundene Effekte (Parallaxe) gehen an
  // den Anfang zurück und stehen still. Erst den Trigger lösen, sonst startet er die Animation beim
  // nächsten Scrollen neu. Greift auch beim Laden: Das Panel nimmt das Attribut beim Hydrieren kurz
  // weg und setzt es wieder; was in dieser Lücke gestartet ist, wird hier eingeholt.
  // Ausschalten wirkt ab dem nächsten Seitenaufbau.
  new MutationObserver(() => {
    if (!gestoppt()) return
    ScrollTrigger.getAll().forEach((st) => {
      // Ohne Animation (Fortschrittsbalken, „Nach oben“) ist es Anzeige, keine Bewegung: bleibt.
      const animation = st.animation
      if (!animation) return
      const scrub = Boolean(st.vars.scrub)
      st.kill(false, true)
      // Nicht zusätzlich kill(): Der erste Frame rendert GSAP am Ende des Ticks, ein sofortiges
      // kill() ließe die Elemente im Startzustand stehen.
      animation.progress(scrub ? 0 : 1)
    })
    gsap.globalTimeline.getChildren(true, true, false).forEach((t) => t.progress(1))
  }).observe(document.documentElement, { attributes: true, attributeFilter: [STOPP_ATTRIBUT] })
}

export { gsap, ScrollTrigger, useGSAP }
export * from './tokens'

// Jede Bewegung läuft nur unter dieser Bedingung (gsap.matchMedia). Ohne sie ist der Inhalt
// sofort in seinem Endzustand da. Zusätzlich gilt der Schalter des Panels: bewegungErlaubt().
export const BEWEGUNG = '(prefers-reduced-motion: no-preference)'

export function bewegungErlaubt(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(BEWEGUNG).matches && !gestoppt()
}

export function registriere(...plugins: object[]) {
  if (typeof window !== 'undefined') gsap.registerPlugin(...plugins)
}

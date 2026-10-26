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

  // Panel schaltet um: Im nächsten Frame steht alles im Endzustand und bleibt dort. Greift auch
  // beim Laden: Das Panel nimmt das Attribut beim Hydrieren kurz weg und setzt es wieder; was in
  // dieser Lücke gestartet ist, wird hier eingeholt. Ausschalten wirkt ab dem nächsten Seitenaufbau.
  new MutationObserver(() => {
    if (!gestoppt()) return
    // 1. Scrollgebunden: erst den Trigger lösen, sonst startet Scrollen die Animation neu, und den
    //    Nachlauf von scrub: 0.6 (ein eigener Tween) beenden, sonst schreibt er weiter. Hängt sie am
    //    Scrollen, geht sie zurück in den Zustand ohne GSAP (revert), also den von „Bewegung
    //    reduzieren“: Ablauf und Enthüllung fertig, Kartenstapel ruhend. Sonst spult sie ans Ende,
    //    auch wenn sie noch auf ihren Einsatz wartet. Ohne Animation (Fortschrittsbalken,
    //    Schrittwechsel) ist es Anzeige, keine Bewegung: bleibt.
    ScrollTrigger.getAll().forEach((st) => {
      const animation = st.animation
      if (!animation) return
      const scrub = Boolean(st.vars.scrub)
      // Ohne Nachlauf liefert getTween() 0, nicht undefined: kein ?. verwenden.
      const nachlauf = st.getTween()
      if (nachlauf) nachlauf.kill()
      st.kill(false, true)
      if (scrub) animation.revert()
      else animation.totalProgress(1)
    })
    // 2. Alles Übrige: die oberste Ebene der globalen Timeline ans Ende spulen, nie die Tweens in
    //    einer Timeline einzeln. Die setzt sie sonst im nächsten Tick auf ihre eigene Position
    //    zurück und spielt weiter (gemessen: 43,9 statt 100), und ihr onComplete käme nie.
    //    totalProgress, nicht progress: Endlosschleifen (repeat: -1) enden so auch. Ausgelassen:
    //    Angehaltenes (bewegt sich nicht; eine vorbereitete Menü-Timeline spränge sonst auf) und
    //    verzögerte Aufrufe ohne Dauer, auch die von ScrollTrigger selbst.
    gsap.globalTimeline.getChildren(false, true, true).forEach((t) => {
      if (!t.paused() && t.totalDuration()) t.totalProgress(1)
    })
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

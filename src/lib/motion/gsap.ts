import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { DAUER, KURVE } from './tokens'

// Die eine Stelle, an der GSAP angemeldet wird. Alle Bausteine importieren gsap von hier, nie
// direkt aus 'gsap'. Plugins, die nur ein Baustein braucht (Flip, SplitText, DrawSVG …), meldet
// dieser Baustein selbst mit registriere() an, damit sie nur dort im Bundle landen.
// Gebündelt über npm: kein Request an einen Dritten (Pflichtkern 3/4).

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
  gsap.defaults({ duration: DAUER.md, ease: KURVE.raus })
  // Die Adressleiste auf dem Handy ändert die Höhe beim Scrollen; das ist kein echtes Resize.
  ScrollTrigger.config({ ignoreMobileResize: true })
  // Nachgeladene Schriften verschieben Zeilen. Danach einmal neu messen, sonst lösen Trigger zu
  // früh oder zu spät aus.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
}

export { gsap, ScrollTrigger, useGSAP }
export * from './tokens'

// Jede Bewegung läuft nur unter dieser Bedingung (gsap.matchMedia). Ohne sie ist der Inhalt
// sofort in seinem Endzustand da.
export const BEWEGUNG = '(prefers-reduced-motion: no-preference)'

export function bewegungErlaubt(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(BEWEGUNG).matches
}

export function registriere(...plugins: object[]) {
  if (typeof window !== 'undefined') gsap.registerPlugin(...plugins)
}

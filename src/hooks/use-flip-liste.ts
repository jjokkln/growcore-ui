'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { Flip } from 'gsap/Flip'
import { DAUER, KURVE, bewegungErlaubt, gsap, registriere } from '@/lib/motion/gsap'

registriere(Flip)

// Einträge einer Liste gleiten nach Filtern, Sortieren oder Gruppieren an ihren neuen Platz,
// statt zu springen; neu erscheinende blenden ein. FLIP braucht den Zustand VOR der Änderung:
// Er wird bei jeder Eingabe (Zeiger, Taste) festgehalten, also unmittelbar bevor ein Filter
// wechselt, und nach dem nächsten Rendern mit geändertem `schluessel` abgespielt.
//   const ref = useRef<HTMLUListElement>(null)
//   useFlipListe(ref, `${filter}|${sortierung}`, '[data-flip-id]')
// Jeder Eintrag braucht ein stabiles data-flip-id (die Datensatz-ID), sonst weiß Flip nicht,
// welcher alte zu welchem neuen gehört.
export function useFlipListe(ref: React.RefObject<HTMLElement | null>, schluessel: string, auswahl: string) {
  const zustand = useRef<Flip.FlipState | null>(null)
  const letzter = useRef(schluessel)

  useEffect(() => {
    const festhalten = () => {
      const el = ref.current
      if (!el || !bewegungErlaubt()) return
      zustand.current = Flip.getState(el.querySelectorAll(auswahl))
    }
    document.addEventListener('pointerdown', festhalten, true)
    document.addEventListener('keydown', festhalten, true)
    return () => {
      document.removeEventListener('pointerdown', festhalten, true)
      document.removeEventListener('keydown', festhalten, true)
    }
  }, [ref, auswahl])

  useLayoutEffect(() => {
    if (letzter.current === schluessel) return
    letzter.current = schluessel
    const el = ref.current
    const vorher = zustand.current
    zustand.current = null
    if (!el || !vorher || !bewegungErlaubt()) return
    const flip = Flip.from(vorher, {
      targets: el.querySelectorAll(auswahl),
      duration: DAUER.md,
      ease: KURVE.wechsel,
      stagger: 0.012,
      scale: false,
      simple: true,
      onEnter: (neu) =>
        gsap.fromTo(neu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: DAUER.sm, ease: KURVE.raus, stagger: 0.02 }),
    })
    return () => { flip.progress(1).kill() }
  }, [ref, schluessel, auswahl])
}

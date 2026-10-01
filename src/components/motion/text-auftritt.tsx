'use client'

import { useRef } from 'react'
import { SplitText } from 'gsap/SplitText'
import { BEWEGUNG, DAUER, KURVE, gsap, registriere, useGSAP } from '@/lib/motion/gsap'

registriere(SplitText)

// Text, der zeilen- oder wortweise aus einer unsichtbaren Maske aufsteigt. Für Abschnitts-
// Überschriften und Zitate, nicht für die Hero-Headline (LCP bleibt sofort sichtbar).
// SplitText teilt erst nach dem Laden der Schriften (sonst brechen die Zeilen später anders) und
// teilt bei Größenänderung selbst neu (autoSplit). Screenreader lesen den ganzen Satz, nicht die
// Teilstücke (aria: 'auto'). Gespielt wird einmal; ein Resize danach zeigt den Text ruhig.
const STIL = `@media (prefers-reduced-motion: no-preference){[data-text-auftritt="warte"]{visibility:hidden}}`

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote'

export function TextAuftritt({
  as: Element = 'h2',
  children,
  className,
  art = 'zeilen',
  beimScrollen = true,
}: {
  as?: Tag
  children: React.ReactNode
  className?: string
  art?: 'zeilen' | 'woerter'
  beimScrollen?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const gespielt = useRef(false)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(BEWEGUNG, (ctx) => {
        let aktiv = true
        document.fonts.ready.then(() => {
          if (!aktiv) return
          ctx.add(() => {
            SplitText.create(el, {
              type: art === 'zeilen' ? 'lines' : 'words,lines',
              mask: 'lines',
              autoSplit: true,
              onSplit(self) {
                el.dataset.textAuftritt = 'bereit'
                if (gespielt.current) return
                return gsap.from(art === 'zeilen' ? self.lines : self.words, {
                  yPercent: 110,
                  duration: DAUER.lg,
                  ease: KURVE.stark,
                  stagger: art === 'zeilen' ? 0.08 : 0.03,
                  onComplete: () => { gespielt.current = true },
                  scrollTrigger: beimScrollen ? { trigger: el, start: 'top 85%', once: true } : undefined,
                })
              },
            })
          })
        })
        return () => { aktiv = false }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <>
      <style href="gc-text-auftritt" precedence="default">{STIL}</style>
      <Element ref={ref as never} data-text-auftritt="warte" className={className}>
        {children}
      </Element>
    </>
  )
}

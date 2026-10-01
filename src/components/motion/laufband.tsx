'use client'

import { useRef, useState } from 'react'
import { BEWEGUNG, ScrollTrigger, gsap, useGSAP } from '@/lib/motion/gsap'

// Endloses Laufband (Logos, Schlagworte, Leistungen). Höchstens eines je Seite.
// Läuft gleichmäßig; schnelles Scrollen beschleunigt es kurz, danach beruhigt es sich wieder.
// Hält an bei Hover und Fokus und hat einen sichtbaren Knopf „Anhalten“: Was sich länger als
// 5 s von selbst bewegt, muss man stoppen können (WCAG 2.2.2). Bei „Bewegung reduzieren“ steht
// es still und bricht als normale Liste um. Der doppelte Inhalt ist für Screenreader verborgen.
const STIL = `
.gc-lb{position:relative;display:flex;align-items:center;gap:1rem}
.gc-lb-fenster{overflow:hidden;flex:1;min-width:0;mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.gc-lb-band{display:flex;width:max-content}
.gc-lb-teil{display:flex;align-items:center;gap:var(--laufband-abstand,3rem);padding-right:var(--laufband-abstand,3rem);flex-shrink:0}
.gc-lb-knopf{flex-shrink:0;min-width:44px;min-height:44px;border-radius:999px;border:1px solid color-mix(in oklab,currentColor 20%,transparent);background:transparent;color:inherit;cursor:pointer;font:inherit;font-size:.8rem}
@media (prefers-reduced-motion: reduce){.gc-lb-fenster{mask-image:none}.gc-lb-band{width:auto;flex-wrap:wrap}.gc-lb-teil{flex-wrap:wrap}.gc-lb-teil[aria-hidden]{display:none}.gc-lb-knopf{display:none}}
`

export function Laufband({
  children,
  tempo = 60,
  label,
  className,
}: {
  children: React.ReactNode
  tempo?: number
  label: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const band = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Tween | null>(null)
  const [steht, setSteht] = useState(false)

  useGSAP(
    () => {
      const b = band.current
      if (!b) return
      const mm = gsap.matchMedia()
      mm.add(BEWEGUNG, () => {
        const breite = (b.firstElementChild as HTMLElement).offsetWidth
        tl.current = gsap.to(b, { x: -breite, duration: breite / tempo, ease: 'none', repeat: -1 })
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (!tl.current || tl.current.paused()) return
            const schub = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 600)
            gsap.to(tl.current, { timeScale: schub, duration: 0.2, overwrite: true })
            gsap.to(tl.current, { timeScale: 1, duration: 1, delay: 0.2, ease: 'power2.out' })
          },
        })
        return () => st.kill()
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [tempo] },
  )

  const umschalten = () => {
    if (!tl.current) return
    if (steht) tl.current.play()
    else tl.current.pause()
    setSteht(!steht)
  }

  return (
    <div ref={ref} className={['gc-lb', className].filter(Boolean).join(' ')} role="region" aria-label={label}>
      <style href="gc-laufband" precedence="default">{STIL}</style>
      <div
        className="gc-lb-fenster"
        onMouseEnter={() => !steht && tl.current?.pause()}
        onMouseLeave={() => !steht && tl.current?.play()}
        onFocusCapture={() => tl.current?.pause()}
        onBlurCapture={() => !steht && tl.current?.play()}
      >
        <div ref={band} className="gc-lb-band">
          <div className="gc-lb-teil">{children}</div>
          <div className="gc-lb-teil" aria-hidden inert>{children}</div>
        </div>
      </div>
      <button type="button" className="gc-lb-knopf" onClick={umschalten} aria-pressed={steht}>
        {steht ? 'Weiter' : 'Anhalten'}
      </button>
    </div>
  )
}

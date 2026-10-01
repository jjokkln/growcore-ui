'use client'

import { useRef } from 'react'
import { DAUER, KURVE, bewegungErlaubt, gsap, useGSAP } from '@/lib/motion/gsap'

// Seitliche Schublade für Menü, Filter oder Warenkorb. Ein natives <dialog> (showModal): Fokus
// bleibt darin gefangen, Escape schließt, der Fokus kehrt danach zum Auslöser zurück, der Rest der
// Seite ist inert. Der Schleier ist ein eigenes Element, weil GSAP ::backdrop nicht animieren kann.
// Auf: Schleier blendet ein, Panel gleitet mit starker Kurve herein, Einträge mit
//      data-schublade-punkt folgen gestaffelt.
// Zu:  schneller und mit Kurve nach innen (Exit ≈ 70 % des Enters), erst danach schließt der Dialog.
// Farbe des Panels über panelClassName oder --schublade-bg. Die Vorgabe liegt in @layer base, damit
// jede Utility-Klasse sie schlägt.
const STIL = `dialog[data-schublade]{position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:0;border:0;background:transparent;overflow:hidden}dialog[data-schublade]::backdrop{background:transparent}html:has(dialog[data-schublade][open]){overflow:hidden}@layer base{[data-schublade-panel]{background:var(--schublade-bg,Canvas);color:CanvasText}}`

export function Schublade({
  offen,
  beiSchliessen,
  titel,
  children,
  seite = 'rechts',
  panelClassName,
}: {
  offen: boolean
  beiSchliessen: () => void
  titel: string
  children: React.ReactNode
  seite?: 'rechts' | 'links'
  panelClassName?: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)

  useGSAP(
    () => {
      const d = dialog.current
      if (!d) return
      const panel = d.querySelector('[data-schublade-panel]')
      const schleier = d.querySelector('[data-schublade-schleier]')
      const punkte = gsap.utils.toArray<HTMLElement>('[data-schublade-punkt]', d)
      const weg = seite === 'rechts' ? 100 : -100
      const ruhig = !bewegungErlaubt()

      if (offen) {
        if (!d.open) d.showModal()
        if (ruhig) return
        gsap
          .timeline()
          .fromTo(schleier, { opacity: 0 }, { opacity: 1, duration: DAUER.md, ease: KURVE.raus }, 0)
          .fromTo(panel, { xPercent: weg }, { xPercent: 0, duration: DAUER.md, ease: KURVE.stark }, 0)
          .fromTo(
            punkte,
            { opacity: 0, x: weg > 0 ? 24 : -24 },
            { opacity: 1, x: 0, duration: DAUER.sm, ease: KURVE.raus, stagger: 0.04 },
            0.12,
          )
      } else if (d.open) {
        if (ruhig) return d.close()
        gsap
          .timeline({ onComplete: () => d.close() })
          .to(panel, { xPercent: weg, duration: DAUER.sm, ease: KURVE.rein }, 0)
          .to(schleier, { opacity: 0, duration: DAUER.sm, ease: KURVE.rein }, 0)
      }
    },
    { dependencies: [offen, seite], scope: dialog },
  )

  return (
    <>
      <style href="gc-schublade" precedence="default">{STIL}</style>
      <dialog
        ref={dialog}
        data-schublade
        aria-label={titel}
        onCancel={(e) => {
          e.preventDefault()
          beiSchliessen()
        }}
      >
        <div
          data-schublade-schleier
          onClick={beiSchliessen}
          style={{ position: 'absolute', inset: 0, background: 'rgb(0 0 0 / 0.4)' }}
        />
        <div
          data-schublade-panel
          className={panelClassName}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            [seite === 'rechts' ? 'right' : 'left']: 0,
            width: 'min(22rem, 86vw)',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </dialog>
    </>
  )
}

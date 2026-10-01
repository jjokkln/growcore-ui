'use client'

import { useRef, useState } from 'react'
import { DAUER, KURVE, bewegungErlaubt, gsap, useGSAP } from '@/lib/motion/gsap'

// Bereich, der auf seine natürliche Höhe aufgeht (height: auto) und wieder zu. Für Akkordeon,
// FAQ, „mehr anzeigen", Filterleisten. Geschlossen ist der Inhalt inert: nicht fokussierbar und
// nicht vorgelesen. Der Auslöser setzt aria-expanded und aria-controls={id} selbst.
// React schreibt die Höhe nur beim ersten Rendern, danach gehört sie GSAP; sonst würde React sie
// bei jedem Wechsel zurücksetzen und die Animation verschlucken.
export function Aufklappen({
  offen,
  children,
  id,
  className,
}: {
  offen: boolean
  children: React.ReactNode
  id?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [anfangsOffen] = useState(offen)
  const erster = useRef(true)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (erster.current) {
        erster.current = false
        return
      }
      const ziel = offen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }
      if (!bewegungErlaubt()) {
        gsap.set(el, ziel)
        return
      }
      gsap.to(el, {
        ...ziel,
        duration: offen ? DAUER.md : DAUER.sm,
        ease: offen ? KURVE.raus : KURVE.rein,
        overwrite: true,
      })
    },
    { dependencies: [offen] },
  )

  return (
    <div
      ref={ref}
      id={id}
      inert={!offen}
      className={className}
      style={{ overflow: 'hidden', height: anfangsOffen ? undefined : 0, opacity: anfangsOffen ? undefined : 0 }}
    >
      {children}
    </div>
  )
}

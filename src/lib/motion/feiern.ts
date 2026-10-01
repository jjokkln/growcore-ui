'use client'

import { Physics2DPlugin } from 'gsap/Physics2DPlugin'
import { bewegungErlaubt, gsap, registriere } from './gsap'

registriere(Physics2DPlugin)

// Konfetti für einen echten Erfolg (Auftrag abgeschickt, Projekt abgeschlossen), nicht für jeden
// Klick. Schießt aus `von` (meist der geklickte Knopf) nach oben und fällt mit Schwerkraft.
// Ein fester, nicht klickbarer Layer über allem, aria-hidden. Ohne Bewegungswunsch passiert
// nichts. Farben aus der Marke des Projekts übergeben.
export function feiern(von?: Element | null, farben: string[] = ['#0f172a', '#2563eb', '#f59e0b', '#10b981', '#e5e7eb']) {
  if (!bewegungErlaubt()) return
  const r = von?.getBoundingClientRect()
  const x = r ? r.left + r.width / 2 : window.innerWidth / 2
  const y = r ? r.top + r.height / 2 : window.innerHeight / 3

  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden'
  document.body.appendChild(layer)

  const tl = gsap.timeline({ onComplete: () => layer.remove() })
  for (let i = 0; i < 90; i++) {
    const t = document.createElement('span')
    const breite = gsap.utils.random(6, 11)
    const rund = Math.random() < 0.3
    t.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${breite}px;height:${rund ? breite : breite * 0.45}px;border-radius:${rund ? '50%' : '2px'};background:${farben[i % farben.length]};will-change:transform`
    layer.appendChild(t)
    tl.to(
      t,
      {
        physics2D: { velocity: gsap.utils.random(420, 900), angle: gsap.utils.random(-150, -30), gravity: 1400 },
        rotation: gsap.utils.random(-540, 540),
        rotationX: gsap.utils.random(-360, 360),
        duration: gsap.utils.random(1.6, 2.4),
        ease: 'none',
      },
      0,
    )
    tl.to(t, { opacity: 0, duration: 0.5, ease: 'power1.in' }, '>-0.5')
  }
}

'use client'

import { useEffect, useRef, ViewTransition } from 'react'
import { usePathname } from 'next/navigation'

// Übergang beim Seitenwechsel (React <ViewTransition>, im App Router ohne Konfiguration). Kein
// GSAP: Der Browser animiert selbst, und ohne Unterstützung wechselt die Seite einfach ohne
// Animation. Um den Inhaltsbereich legen, nicht um Kopf und Navigation:
//   <main id="hauptbereich"><Seitenwechsel>{children}</Seitenwechsel></main>
// Richtung über Next-Links: <Link href="…" transitionTypes={['vor']}> bzw. ['zurueck'].
//   vor / zurueck  Inhalt gleitet seitlich, sonst blendet die alte Seite aus und die neue steigt auf.
// key={pathname}: Nur ein neuer Pfad ist ein Seitenwechsel. Speichern (refresh) und Filter in der
// Adresse (?q=, ?tab=) animieren nicht, default="none" hält auch Updates still.
// Einen festen Kopf mit style={{ viewTransitionName: 'kopf' }} festhalten, sonst gleitet der Inhalt
// über ihn. Mit „Bewegung reduzieren" wechselt die Seite sofort.
const REIN = { vor: 'gc-von-rechts', zurueck: 'gc-von-links', default: 'gc-rein' }
const RAUS = { vor: 'gc-nach-links', zurueck: 'gc-nach-rechts', default: 'gc-raus' }

const STIL = `
::view-transition-old(.gc-raus){animation:var(--dauer-xs,150ms) var(--kurve-rein,cubic-bezier(.55,.085,.68,.53)) both gc-vt-aus}
::view-transition-new(.gc-rein){animation:380ms var(--kurve-stark,cubic-bezier(.19,1,.22,1)) 60ms both gc-vt-auf}
::view-transition-old(.gc-nach-links){animation:220ms var(--kurve-rein,cubic-bezier(.55,.085,.68,.53)) both gc-vt-nach-links}
::view-transition-new(.gc-von-rechts){animation:380ms var(--kurve-stark,cubic-bezier(.19,1,.22,1)) 40ms both gc-vt-von-rechts}
::view-transition-old(.gc-nach-rechts){animation:220ms var(--kurve-rein,cubic-bezier(.55,.085,.68,.53)) both gc-vt-nach-rechts}
::view-transition-new(.gc-von-links){animation:380ms var(--kurve-stark,cubic-bezier(.19,1,.22,1)) 40ms both gc-vt-von-links}
@keyframes gc-vt-aus{to{opacity:0;transform:scale(.99)}}
@keyframes gc-vt-auf{from{opacity:0;transform:translateY(14px)}}
@keyframes gc-vt-nach-links{to{opacity:0;transform:translateX(-32px)}}
@keyframes gc-vt-von-rechts{from{opacity:0;transform:translateX(40px)}}
@keyframes gc-vt-nach-rechts{to{opacity:0;transform:translateX(32px)}}
@keyframes gc-vt-von-links{from{opacity:0;transform:translateX(-40px)}}
@media (prefers-reduced-motion: reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}`

export function Seitenwechsel({ children, bereichId = 'hauptbereich' }: { children: React.ReactNode; bereichId?: string }) {
  const pathname = usePathname()
  const erster = useRef(true)

  // Fokus nach dem Wechsel auf die Überschrift der neuen Seite, damit Tastatur und Screenreader
  // dort weitermachen statt in der Navigation (Pflichtkern 7). Nicht beim ersten Laden und nicht,
  // wenn die neue Seite den Fokus schon selbst gesetzt hat (autoFocus in einem Formular).
  useEffect(() => {
    if (erster.current) {
      erster.current = false
      return
    }
    const bereich = document.getElementById(bereichId)
    if (!bereich || bereich.contains(document.activeElement)) return
    const ziel = bereich.querySelector<HTMLElement>('h1') ?? bereich
    if (!ziel.hasAttribute('tabindex')) ziel.setAttribute('tabindex', '-1')
    ziel.focus({ preventScroll: true })
  }, [pathname, bereichId])

  return (
    <>
      <style href="gc-seitenwechsel" precedence="default">{STIL}</style>
      <ViewTransition key={pathname} enter={REIN} exit={RAUS} default="none">
        {children}
      </ViewTransition>
    </>
  )
}

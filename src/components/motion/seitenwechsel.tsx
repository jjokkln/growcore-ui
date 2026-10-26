'use client'

import { useEffect, ViewTransition } from 'react'

// Übergang beim Seitenwechsel (React <ViewTransition>, im App Router ohne Konfiguration). Kein
// GSAP: Der Browser animiert selbst, und ohne Unterstützung wechselt die Seite einfach ohne
// Animation.
// Einbau im Projekt über template.tsx, nicht im Layout: Ein Template wird bei jeder Navigation neu
// angelegt, darum feuern enter/exit dort, und ein usePathname() mit Suspense-Grenze entfällt
// (cacheComponents, dynamische Parameter). Änderungen der Abfrage (?anliegen=) legen das Template
// nicht neu an, Speichern (refresh) ebenso wenig; default="none" hält Updates still.
//   app/template.tsx              <Seitenwechsel>{children}</Seitenwechsel>
//   app/teambereich/template.tsx  <Seitenwechsel ruhig>{children}</Seitenwechsel>
// Richtung über Next-Links: <Link href="…" transitionTypes={['vor']}> bzw. ['zurueck'].
//   vor / zurueck  Inhalt gleitet seitlich, sonst blendet die alte Seite aus und die neue steigt auf.
//   ruhig          nur Überblenden in DAUER.sm (App-Flächen: kein Auftritt, Navigation steht still).
// Den festen Kopf mit style={{ viewTransitionName: 'kopf' }} festhalten, sonst gleitet der Inhalt
// über ihn. Mit „Bewegung reduzieren“ und dem Panel-Schalter „Animationen stoppen“ wechselt die
// Seite sofort.
const REIN = { vor: 'gc-von-rechts', zurueck: 'gc-von-links', default: 'gc-rein' }
const RAUS = { vor: 'gc-nach-links', zurueck: 'gc-nach-rechts', default: 'gc-raus' }
const RUHIG_REIN = { default: 'gc-ruhig-rein' }
const RUHIG_RAUS = { default: 'gc-ruhig-raus' }

const STIL = `
::view-transition{pointer-events:none}
::view-transition-group(kopf){animation:none;z-index:100}
::view-transition-old(kopf){display:none}
::view-transition-new(kopf){animation:none}
::view-transition-old(.gc-raus){animation:var(--dauer-xs,150ms) var(--kurve-rein,cubic-bezier(.55,.085,.68,.53)) both gc-vt-aus}
::view-transition-new(.gc-rein){animation:380ms var(--kurve-stark,cubic-bezier(.19,1,.22,1)) 60ms both gc-vt-auf}
::view-transition-old(.gc-nach-links){animation:220ms var(--kurve-rein,cubic-bezier(.55,.085,.68,.53)) both gc-vt-nach-links}
::view-transition-new(.gc-von-rechts){animation:380ms var(--kurve-stark,cubic-bezier(.19,1,.22,1)) 40ms both gc-vt-von-rechts}
::view-transition-old(.gc-nach-rechts){animation:220ms var(--kurve-rein,cubic-bezier(.55,.085,.68,.53)) both gc-vt-nach-rechts}
::view-transition-new(.gc-von-links){animation:380ms var(--kurve-stark,cubic-bezier(.19,1,.22,1)) 40ms both gc-vt-von-links}
::view-transition-old(.gc-ruhig-raus){animation:var(--dauer-xs,150ms) var(--kurve-rein,cubic-bezier(.55,.085,.68,.53)) both gc-vt-blende-aus}
::view-transition-new(.gc-ruhig-rein){animation:var(--dauer-sm,250ms) var(--kurve-raus,cubic-bezier(.215,.61,.355,1)) both gc-vt-blende-ein}
@keyframes gc-vt-aus{to{opacity:0;transform:scale(.99)}}
@keyframes gc-vt-auf{from{opacity:0;transform:translateY(14px)}}
@keyframes gc-vt-nach-links{to{opacity:0;transform:translateX(-32px)}}
@keyframes gc-vt-von-rechts{from{opacity:0;transform:translateX(40px)}}
@keyframes gc-vt-nach-rechts{to{opacity:0;transform:translateX(32px)}}
@keyframes gc-vt-von-links{from{opacity:0;transform:translateX(-40px)}}
@keyframes gc-vt-blende-aus{to{opacity:0}}
@keyframes gc-vt-blende-ein{from{opacity:0}}
@media (prefers-reduced-motion: reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
html[data-a11y-stop-animations]::view-transition-group(*),html[data-a11y-stop-animations]::view-transition-old(*),html[data-a11y-stop-animations]::view-transition-new(*){animation:none!important}`

// Erster Aufruf der Sitzung: kein Fokussprung. Auf Modulebene, weil jedes Template neu mountet.
let startPfad: string | null = null
let navigiert = false

export function Seitenwechsel({
  children,
  bereichId = 'hauptbereich',
  ruhig = false,
}: {
  children: React.ReactNode
  bereichId?: string
  ruhig?: boolean
}) {
  // Fokus nach dem Wechsel auf die Überschrift der neuen Seite, damit Tastatur und Screenreader
  // dort weitermachen statt in der Navigation (Pflichtkern 7). Nicht beim ersten Laden und nicht,
  // wenn die neue Seite den Fokus schon selbst gesetzt hat (autoFocus in einem Formular).
  useEffect(() => {
    const pfad = window.location.pathname
    if (startPfad === null) startPfad = pfad
    if (!navigiert && pfad === startPfad) return
    navigiert = true
    const bereich = document.getElementById(bereichId)
    if (!bereich || bereich.contains(document.activeElement)) return
    const ziel = bereich.querySelector<HTMLElement>('h1') ?? bereich
    if (!ziel.hasAttribute('tabindex')) ziel.setAttribute('tabindex', '-1')
    ziel.focus({ preventScroll: true })
  }, [bereichId])

  return (
    <>
      <style href="gc-seitenwechsel" precedence="default">
        {STIL}
      </style>
      <ViewTransition enter={ruhig ? RUHIG_REIN : REIN} exit={ruhig ? RUHIG_RAUS : RAUS} default="none">
        {children}
      </ViewTransition>
    </>
  )
}

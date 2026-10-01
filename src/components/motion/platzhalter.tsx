// Ladeplatzhalter in der Form des Endlayouts, kein Spinner. Reines CSS, läuft auch in
// Server-Komponenten und in loading.tsx. Der Bereich erscheint erst nach 180 ms: Was schneller
// lädt, blitzt nicht kurz grau auf. Der Schimmer ist bewusst leise und fällt bei „Bewegung
// reduzieren" weg. Farbe folgt der Schrift (currentColor), überschreibbar mit --platzhalter.
//   <PlatzhalterBereich><Platzhalter className="h-8 w-48" /><PlatzhalterText zeilen={3} /></PlatzhalterBereich>
const STIL = `
[data-platzhalter-bereich]{animation:gc-spaet 1ms 180ms both}
[data-platzhalter]{display:block;position:relative;overflow:hidden;border-radius:.375rem;background:var(--platzhalter,color-mix(in oklab,currentColor 8%,transparent))}
@media (prefers-reduced-motion: no-preference){[data-platzhalter]::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,color-mix(in oklab,currentColor 6%,transparent),transparent);animation:gc-schimmer 1.6s var(--kurve-wechsel,cubic-bezier(.455,.03,.515,.955)) infinite}}
@keyframes gc-schimmer{to{transform:translateX(100%)}}
@keyframes gc-spaet{from{opacity:0}}`

function Stil() {
  return <style href="gc-platzhalter" precedence="default">{STIL}</style>
}

export function PlatzhalterBereich({ children, className, label = 'Wird geladen' }: { children: React.ReactNode; className?: string; label?: string }) {
  return (
    <div data-platzhalter-bereich role="status" aria-label={label} className={className}>
      <Stil />
      {children}
    </div>
  )
}

export function Platzhalter({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <>
      <Stil />
      <span data-platzhalter aria-hidden className={className} style={style} />
    </>
  )
}

export function PlatzhalterText({ zeilen = 3, className }: { zeilen?: number; className?: string }) {
  return (
    <span aria-hidden className={className} style={{ display: 'grid', gap: '0.55em' }}>
      {Array.from({ length: zeilen }, (_, i) => (
        <Platzhalter key={i} style={{ height: '0.8em', width: i === zeilen - 1 ? '62%' : '100%' }} />
      ))}
    </span>
  )
}

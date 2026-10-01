// Rahmen je Baustein auf der Demo-Seite: Name, Zweck, Installationsbefehl, Live-Beispiel.
export function Abschnitt({ name, titel, zweck, children }: { name: string; titel: string; zweck: string; children: React.ReactNode }) {
  return (
    <section id={name} className="scroll-mt-24 border-t border-linie py-16">
      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{titel}</h2>
          <p className="mt-2 max-w-xl text-leise">{zweck}</p>
        </div>
        <code className="block overflow-x-auto rounded-md border border-linie bg-flaeche px-3 py-2 font-mono text-xs text-leise">
          npx shadcn@latest add jjokkln/growcore-ui/{name}
        </code>
      </div>
      {children}
    </section>
  )
}

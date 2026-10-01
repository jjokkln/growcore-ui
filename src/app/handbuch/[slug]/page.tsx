import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DEMOS } from '../../_demo/register'
import { GRUPPEN, alleKapitel, kapitel, kapitelHtml } from '../_daten'
import registry from '../../../../registry.json'

const IM_REGISTRY = new Set(registry.items.map((i) => i.name))

export function generateStaticParams() {
  return alleKapitel().map((k) => ({ slug: k.slug }))
}

export async function generateMetadata({ params }: PageProps<'/handbuch/[slug]'>): Promise<Metadata> {
  const k = kapitel((await params).slug)
  return { title: k ? `${k.titel} · growcore-ui` : 'growcore-ui', description: k?.kurz }
}

export default async function KapitelSeite({ params }: PageProps<'/handbuch/[slug]'>) {
  const { slug } = await params
  const k = kapitel(slug)
  if (!k) notFound()
  const [anfang, rest] = kapitelHtml(k)
  const demos = k.demo.filter((d) => DEMOS[d])
  const alle = alleKapitel()

  return (
    <div className="grid gap-10 pt-10 lg:grid-cols-[13rem_1fr] lg:gap-14">
      <nav aria-label="Kapitel" className="hidden lg:block">
        <div className="sticky top-24 grid gap-6 text-sm">
          {GRUPPEN.map((g) => (
            <div key={g.id}>
              <div className="font-semibold text-leise">{g.titel}</div>
              <ul className="mt-2 grid gap-1">
                {alle.filter((x) => x.gruppe === g.id).map((x) => (
                  <li key={x.slug}>
                    <Link
                      href={`/handbuch/${x.slug}`}
                      aria-current={x.slug === k.slug ? 'page' : undefined}
                      className="block rounded-md px-2 py-1 hover:bg-flaeche aria-[current=page]:bg-flaeche aria-[current=page]:font-medium"
                    >
                      {x.titel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <article className="min-w-0">
        <Link href="/" transitionTypes={['zurueck']} className="text-sm text-leise hover:text-tinte">← Handbuch</Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{k.titel}</h1>
        <p className="mt-4 max-w-2xl text-lg text-leise">{k.kurz}</p>
        {k.bausteine.length > 0 && (
          <p className="mt-6 flex flex-wrap gap-2 text-xs">
            {k.bausteine.map((b) => (
              <code key={b} className="rounded-md border border-linie bg-flaeche px-2 py-1 font-mono text-leise">{b}</code>
            ))}
          </p>
        )}

        <div className="handbuch-text mt-10" dangerouslySetInnerHTML={{ __html: anfang }} />

        {demos.length > 0 && (
          <section aria-label="Live-Beispiel" className="my-12 grid min-w-0 gap-10 [&>*]:min-w-0">
            {demos.map((d) => (
              <div key={d} id={d} className="min-w-0 scroll-mt-24">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">So sieht es aus: {DEMOS[d].titel}</h2>
                  {IM_REGISTRY.has(d) && <code className="break-all font-mono text-xs text-leise">npx shadcn@latest add jjokkln/growcore-ui/{d}</code>}
                </div>
                {DEMOS[d].element}
              </div>
            ))}
          </section>
        )}

        <div className="handbuch-text" dangerouslySetInnerHTML={{ __html: rest }} />
      </article>
    </div>
  )
}

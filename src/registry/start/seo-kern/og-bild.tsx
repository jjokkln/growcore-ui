import { ImageResponse } from 'next/og'
import { BASIS_URL } from '@/lib/basis-url'
import { anzeigename, siteConfig } from '@/lib/site-config'

// Vorschaubild für Links (Open Graph, auch von X/LinkedIn/WhatsApp gelesen). Wird beim Build
// einmal als PNG erzeugt, Text aus der site-config. Kein Request an Dritte: next/og bringt
// seine Schrift mit.
//
// Anpassen: Farben unten, gern ein Logo als data-URI (satori lädt keine relativen URLs):
//   const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), 'public/logo.png')).toString('base64')}`
//
// Einbau: app/opengraph-image.tsx ruft ogBild() auf. Eigene Bilder je Seite: dort eine eigene
// opengraph-image.tsx anlegen und ogBild({ titel: '…' }) aufrufen.

export const OG_GROESSE = { width: 1200, height: 630 }
export const OG_TYP = 'image/png'

const FARBEN = { grund: '#111111', text: '#ffffff', leise: 'rgba(255,255,255,0.72)', akzent: '#ffffff' }

export function ogAlt(titel?: string): string {
  return [titel, anzeigename()].filter(Boolean).join(' | ') || new URL(BASIS_URL).host
}

export function ogBild(optionen: { titel?: string; text?: string } = {}) {
  const name = anzeigename()
  const titel = optionen.titel ?? (name || new URL(BASIS_URL).host)
  const text = optionen.text ?? siteConfig.beschreibung ?? ''
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: FARBEN.grund,
          color: FARBEN.text,
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: FARBEN.leise }}>
          {optionen.titel && name ? name : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>{titel}</div>
          {text ? (
            <div style={{ display: 'flex', fontSize: 34, marginTop: 24, color: FARBEN.leise, lineHeight: 1.3 }}>
              {text}
            </div>
          ) : null}
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: FARBEN.akzent }}>{new URL(BASIS_URL).host}</div>
      </div>
    ),
    OG_GROESSE,
  )
}

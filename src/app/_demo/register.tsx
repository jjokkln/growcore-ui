import { AblaufBeispiel, AuftrittBeispiel, ScrollGeschichteBeispiel, SvgBeispiel, TextAuftrittBeispiel } from './beispiele'
import { AufklappenDemo, FlipDemo, PlatzhalterDemo, SchubladeDemo, ZahlDemo, ZeigerDemo } from './interaktiv'
import {
  AktionKnopfDemo, AnmeldungDemo, BildEnthuellungDemo, FormularDemo, KartenstapelDemo, LaufbandDemo, MeldungDemo,
  MonatsrasterDemo, ReiterDemo, SeitenwechselDemo, TerminbuchungDemo, WizardDemo, ZeigerVorschauDemo,
} from './neu'

// Welches Live-Beispiel zu welchem Namen gehört. Kapitel nennen die Namen im Feld `demo:`.
export const DEMOS: Record<string, { titel: string; element: React.ReactNode }> = {
  auftritt: { titel: 'Auftritt', element: <AuftrittBeispiel /> },
  'text-auftritt': { titel: 'TextAuftritt', element: <TextAuftrittBeispiel /> },
  zahl: { titel: 'Zahl', element: <ZahlDemo /> },
  ablauf: { titel: 'Ablauf', element: <AblaufBeispiel /> },
  'scroll-geschichte': { titel: 'ScrollGeschichte', element: <ScrollGeschichteBeispiel /> },
  'svg-zeichnen': { titel: 'SvgZeichnen', element: <SvgBeispiel /> },
  aufklappen: { titel: 'Aufklappen', element: <AufklappenDemo /> },
  schublade: { titel: 'Schublade', element: <SchubladeDemo /> },
  'flip-liste': { titel: 'useFlipListe', element: <FlipDemo /> },
  magnet: { titel: 'useMagnet · useNeigung · feiern', element: <ZeigerDemo /> },
  platzhalter: { titel: 'Platzhalter', element: <PlatzhalterDemo /> },
  monatsraster: { titel: 'Monatsraster', element: <MonatsrasterDemo /> },
  reiter: { titel: 'Reiter', element: <ReiterDemo /> },
  meldung: { titel: 'Meldung', element: <MeldungDemo /> },
  'aktion-knopf': { titel: 'AktionKnopf', element: <AktionKnopfDemo /> },
  terminbuchung: { titel: 'Terminbuchung', element: <TerminbuchungDemo /> },
  wizard: { titel: 'Wizard', element: <WizardDemo /> },
  anmeldung: { titel: 'Anmeldung', element: <AnmeldungDemo /> },
  formular: { titel: 'Formular', element: <FormularDemo /> },
  'bild-enthuellung': { titel: 'BildEnthuellung', element: <BildEnthuellungDemo /> },
  kartenstapel: { titel: 'Kartenstapel', element: <KartenstapelDemo /> },
  laufband: { titel: 'Laufband', element: <LaufbandDemo /> },
  'zeiger-vorschau': { titel: 'ZeigerVorschau', element: <ZeigerVorschauDemo /> },
  seitenwechsel: { titel: 'Seitenwechsel', element: <SeitenwechselDemo /> },
}

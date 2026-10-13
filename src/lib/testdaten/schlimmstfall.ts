// Schlimmstfall-Daten: realistische Werte, gegen die eine Oberfläche bestehen muss, bevor sie
// einem Kunden gezeigt wird. Alles hier ist ERFUNDEN und nur für Tests, Prototypen und den
// Dev-Umschalter des Skills `break-ui` gedacht; nichts davon gehört in sichtbaren Produkttext
// (Pflichtkern 5). Domains enden auf .example (RFC 2606, nie vergeben), Telefonnummern bestehen
// aus Nullen, die IBAN hat keine gültige Prüfziffer.
//
// Warum deutsche Werte: Demo-Daten sind „Anna Berg, anna@firma.de, 12 Mitglieder“. In echten
// Projekten heißt die Firma „Müller-Lüdenscheidt Gebäudetechnik GmbH & Co. KG“, der Ort
// „Neustadt an der Weinstraße“ und der Posten „Stellvertretende Niederlassungsleiterin“. Genau an
// diesen Längen, Umlauten und Komposita bricht eine Karte, ein Tabellenkopf oder ein Badge.
//
// Gebrauch: Fixture an der Datengrenze einsetzen (Mock, Props, API-Stub), nie das Markup anpassen.
//   import { schlimmstfall, varianten } from '@/lib/testdaten/schlimmstfall'
//   const daten = suche.get('daten') === 'schlimmstfall' ? schlimmstfall.personen : demo

export type TestPerson = {
  vorname: string
  nachname: string
  anrede: string | null
  titel: string | null
  position: string | null
  email: string
  telefon: string | null
  avatarUrl: string | null
}

export type TestFirma = {
  name: string
  kurzname: string
  rechtsform: string
  strasse: string
  plz: string
  ort: string
  ustId: string | null
  iban: string | null
}

/** Personen, deren Werte je eine andere Schwachstelle treffen. Reihenfolge bewusst: die ersten
 *  Zeilen stehen beim Öffnen im Sichtfeld, also verteilt sich dort ein Bruch je Zeile. */
export const personen: TestPerson[] = [
  {
    // Langer Doppelname mit Umlaut und Adelsprädikat: bricht Namensspalten und Initialen-Logik.
    vorname: 'Anna-Katharina',
    nachname: 'Freifrau von Müller-Lüdenscheidt',
    anrede: 'Frau',
    titel: 'Dr. med. dent.',
    position: 'Stellvertretende Niederlassungsleiterin Vertriebsinnendienst Süd',
    email: 'anna-katharina.freifrau-von-mueller-luedenscheidt@nordlicht-industrie-beteiligungs-holding.example',
    telefon: '+49 (0) 2151 / 00 00 00-00',
    avatarUrl: null,
  },
  {
    // Kurzer Name: „Jo“ ergibt nur einen Buchstaben, kein Bild, keine Position; der Platzhalter
    // darf keine leere Zeile oder einen verwaisten Strich hinterlassen.
    vorname: 'Jo',
    nachname: 'Ng',
    anrede: null,
    titel: null,
    position: null,
    email: 'jo@ng.example',
    telefon: null,
    avatarUrl: null,
  },
  {
    // Nicht-lateinische Schrift und Emoji im Namen: Initialen aus Graphem-Clustern bilden,
    // nicht aus Bytes; Zeilenhöhe darf nicht beschneiden.
    vorname: 'Zoë 🌱',
    nachname: 'Nguyễn Thị Phương Thảo',
    anrede: 'Frau',
    titel: null,
    position: 'Geschäftsführerin',
    email: 'zoe.nguyen@thao-consulting.example',
    telefon: '+84 00 0000 0000',
    avatarUrl: 'https://bilder.nordlicht-industrie-beteiligungs-holding.example/kaputt.jpg',
  },
  {
    // E-Mail ohne Trennstellen über 70 Zeichen: läuft ohne `overflow-wrap: anywhere` aus der Karte.
    vorname: 'Bartholomäus',
    nachname: 'Fitzgerald-Oberhuber',
    anrede: 'Herr',
    titel: 'Prof. Dr.-Ing. habil.',
    position: 'Leiter Qualitätsmanagement und Arbeitssicherheit',
    email: 'bartholomaeus.fitzgerald-oberhuber.qualitaetsmanagement@sued-west-metallverarbeitung-und-oberflaechentechnik.example',
    telefon: '+49 (0) 89 / 00 00 00 00 00',
    avatarUrl: null,
  },
  {
    // Ein Buchstabe als Nachname, Apostroph, führende Leerzeichen aus einem Import.
    vorname: " D'Angelo ",
    nachname: 'O',
    anrede: 'Herr',
    titel: null,
    position: 'Azubi',
    email: 'dangelo.o@o-und-soehne.example',
    telefon: '0000',
    avatarUrl: null,
  },
]

/** Firmen mit Rechtsform, Adresszusatz und langen Ortsnamen: das Impressum, der Kopf einer
 *  Rechnung und die Kundenliste müssen damit umbrechen, nicht abschneiden. */
export const firmen: TestFirma[] = [
  {
    name: 'Müller-Lüdenscheidt Gebäudetechnik, Heizung, Lüftung und Sanitär GmbH & Co. KG',
    kurzname: 'Müller-Lüdenscheidt',
    rechtsform: 'GmbH & Co. KG',
    strasse: 'Straße der Deutsch-Französischen Freundschaft 1 a, Hinterhaus, 3. OG links',
    plz: '67433',
    ort: 'Neustadt an der Weinstraße',
    ustId: 'DE000000000',
    iban: 'DE00 0000 0000 0000 0000 00',
  },
  {
    name: 'Ö',
    kurzname: 'Ö',
    rechtsform: 'e. K.',
    strasse: 'Ring 1',
    plz: '01067',
    ort: 'Au',
    ustId: null,
    iban: null,
  },
  {
    name: 'Hellschen-Heringsand-Unterschaar Landschaftsbau- und Gartengestaltungsgesellschaft mbH',
    kurzname: 'HHU Landschaftsbau',
    rechtsform: 'GmbH',
    strasse: 'Schmedeswurtherwesterdeich 7',
    plz: '25724',
    ort: 'Hellschen-Heringsand-Unterschaar',
    ustId: 'DE000000001',
    iban: 'DE00 0000 0000 0000 0000 01',
  },
]

/** Zahlen und Beträge, die Formatierung und Spaltenbreite prüfen. Immer über Intl formatieren. */
export const zahlen = {
  null: 0,
  eins: 1, // „1 Mitglieder“ ist der klassische Pluralfehler
  gross: 1_284_903,
  negativ: -17.5,
  bruch: 1 / 3,
  betragGross: 12_345_678.9,
  betragCent: 0.01,
  prozentUeber: 128.4,
  unbekannt: Number.NaN, // muss als „–“ oder gar nicht erscheinen, nie als NaN
}

/** Texte, die Kopfzeilen, Badges und Buttons sprengen. */
export const texte = {
  kompositum: 'Donaudampfschifffahrtsgesellschaftskapitänsmützenhersteller',
  badgeLang: 'Warten auf Rückmeldung der Rechtsabteilung',
  buttonLang: 'Kostenvoranschlag als PDF herunterladen und per E-Mail versenden',
  leer: '',
  nurLeerzeichen: '   ',
  htmlRoh: '<b>fett</b> &amp; <script>alert(1)</script>',
  markdownRoh: '**nicht fett** _nicht kursiv_',
  absatzLang:
    'Sehr geehrte Damen und Herren, wir beziehen uns auf Ihr Schreiben vom 1. des Monats und teilen Ihnen mit, dass die Lieferung der bestellten Ware sich aufgrund von Umständen, die wir nicht zu vertreten haben, um voraussichtlich drei bis fünf Werktage verzögern wird; wir bitten um Ihr Verständnis und stehen für Rückfragen jederzeit zur Verfügung.',
}

/** Zeitpunkte: Jahreswechsel, Zeitumstellung, Schaltjahr, weit weg. */
export const zeiten = {
  jahreswechsel: new Date('2026-12-31T23:59:59+01:00'),
  zeitumstellung: new Date('2026-10-25T02:30:00+02:00'),
  schalttag: new Date('2028-02-29T12:00:00+01:00'),
  langeHer: new Date('1999-01-01T00:00:00+01:00'),
  weitVoraus: new Date('2099-12-31T00:00:00+01:00'),
}

/** Listen-Varianten für den Umschalter: Demo / Schlimmstfall / Leer / Eins / Viele. */
export const varianten = {
  leer: <T>(): T[] => [],
  eins: <T>(liste: T[]): T[] => liste.slice(0, 1),
  viele: <T>(liste: T[], anzahl = 1284): T[] =>
    Array.from({ length: anzahl }, (_, i) => ({ ...liste[i % liste.length], _nr: i + 1 })),
}

export const schlimmstfall = { personen, firmen, zahlen, texte, zeiten }

export const DAUER = { xs: 0.15, sm: 0.25, md: 0.45, lg: 0.8 } as const

// Motion-Tokens: die einzigen Zahlen für Dauer und Kurve in einem Projekt. Bausteine und eigene
// Animationen nehmen ihre Werte von hier, nie frei erfundene. Die CSS-Fassung (--dauer-*,
// --kurve-*) steht in globals.css, damit CSS-Übergänge und View Transitions dieselbe Sprache
// sprechen. Faustregeln: Ein Exit dauert rund 70 % des Enters, UI-Feedback bleibt unter 250 ms,
// Reveals liegen bei 400–800 ms.

export const KURVE = {
  raus: 'power3.out', // Standard: Dinge kommen an
  rein: 'power2.in', // Dinge gehen weg
  wechsel: 'power2.inOut', // Dinge wechseln den Platz
  stark: 'expo.out', // der eine gestaltete Moment der Seite
} as const

// Abstand zwischen gestaffelten Elementen und der Weg, den ein Element beim Auftritt zurücklegt.
export const STAFFEL = 0.06
export const VERSATZ = 14

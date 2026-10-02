export const RECHTSTEXTE = {
  // Technische Fakten für die Rechtsseiten, die nicht in site-config gehören, weil sie keine
  // Kundendaten sind, sondern beschreiben, was im Code eingebaut ist. Wer einen der Bausteine
  // einbaut oder entfernt, schaltet hier im selben Schritt um (Pflichtkern 4). Ein Schalter, der
  // true sagt, ohne dass der Baustein läuft, macht die Datenschutzerklärung genauso unwahr wie
  // ein fehlender.
  //
  // Einbau: wird von app/impressum, app/datenschutz und app/barrierefreiheit gelesen.

  /** Datum der letzten inhaltlichen Prüfung der Datenschutzerklärung. Bei jeder Änderung mitziehen. */
  datenschutzStand: '2. Oktober 2026',
  /** Datum der letzten Prüfung der Barrierefreiheit. Ohne Mitziehen altert die Erklärung lautlos. */
  barrierefreiheitStand: '2. Oktober 2026',

  /** Baustein einwilligung-nachweis eingebaut: Entscheidungen landen als Datensatz in Supabase. */
  einwilligungsnachweis: false,
  /** Ein Anfrage- oder Kontaktformular sendet an den Server (Baustein lead-formular). */
  anfrageformular: false,
  /** Barrierefreiheits-Menü @growcore/a11y eingebaut (speichert Einstellungen im Browser). */
  barrierefreiheitsMenue: false,

  /**
   * Bekannte Einschränkungen der Barrierefreiheit, ehrlich und konkret. Der erste Eintrag gilt
   * immer, bis ein Audit durch Dritte stattgefunden hat. Gefundene Barrieren hier ergänzen.
   */
  einschraenkungen: [
    'Kein vollständiges Audit. Geprüft wird mit automatisierten Werkzeugen und stichprobenhaft per Tastatur. Automatische Prüfungen finden erfahrungsgemäß nur etwa ein Drittel der Probleme.',
    'Für Dokumente, die wir austauschen (zum Beispiel PDF), können wir keine Barrierefreiheit zusichern.',
  ] as string[],
}

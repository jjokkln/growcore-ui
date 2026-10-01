---
titel: Filter und Suche
gruppe: muster
kurz: Große Mengen eingrenzen, mit Suchfeld, Filtern, Ergebniszahl und teilbarer URL.
stichworte: [suche, suchfeld, filter, filterleiste, chips, sortieren, ergebnisse, eingrenzen, facetten, keine treffer]
bausteine: [flip-liste, schublade, platzhalter]
demo: [flip-liste]
stand: 2026-10-02
---

## Wofür

Filter und Suche machen eine lange Liste benutzbar: Referenzen nach Branche,
Stellen nach Ort, Produkte nach Eigenschaft, Einträge in einer App nach Status.
Die Suche findet, was man beim Namen kennt. Filter grenzen ein, was man nur
beschreiben kann. Unter etwa 12 Einträgen braucht es beides nicht, dort reicht
eine gut sortierte Liste.

## Aufbau

- **Suchfeld** oben, mit Lupe, Label (sichtbar oder per `aria-label`), Platzhalter
  mit Beispiel („z. B. Rechnung 2026“) und einem Knopf zum Leeren, sobald Text
  darin steht.
- **Filterleiste** darunter oder links daneben: je Merkmal eine Gruppe
  (Kategorie, Status, Zeitraum). Bis 5 Werte als Chips zum Antippen, mehr als
  Auswahlliste mit Suche.
- **Aktive Filter als Chips** über der Liste, jeder mit „×“, dazu „Alle
  zurücksetzen“, sobald mehr als ein Filter aktiv ist.
- **Ergebniszeile:** „24 Ergebnisse“ und die Sortierung („Neueste zuerst“) in
  einer Zeile direkt über der Liste.
- **Liste oder Raster** der Treffer, darunter Paginierung oder Nachladen.
- **Auf dem Handy:** ein Knopf „Filter (2)“, der eine Schublade öffnet; unten
  in der Schublade „24 Ergebnisse anzeigen“.

## Funktionen

**Grundausstattung**
- Suchfeld mit Sofortsuche und Leeren-Knopf
- Filter als Chips oder Auswahl, aktive Filter sichtbar und einzeln entfernbar
- Ergebniszahl, Sortierung, gestalteter Leerzustand bei null Treffern
- Zustand in der URL (`?q=rechnung&status=offen`), Neuladen und Teilen behalten ihn

**Ausbau**
- Trefferzahl je Filterwert („Offen (12)“), Werte mit null Treffern gedämpft
- Hervorhebung des Suchbegriffs in den Treffern
- Umsortieren und Filtern mit gleitenden Einträgen (`flip-liste`)
- Filter-Schublade auf dem Handy (`schublade`)
- Gespeicherte Filter („Meine offenen Aufgaben“)

**Speziell**
- Tippfehlertolerante Suche und Synonyme (Volltextsuche auf dem Server)
- Vorschläge beim Tippen mit Tastatursteuerung (Combobox)
- Zeitraum- und Bereichsfilter (Preis von bis, Datum von bis)
- Kartenansicht der Treffer neben der Liste
- Befehlsleiste mit Strg+K für Apps

## Worauf es ankommt

- **Sofortsuche mit Verzögerung.** Gesucht wird nach dem Tippen, 250 bis 300 ms
  nach dem letzten Tastendruck, nicht bei jedem Zeichen. Ab 2 Zeichen, außer die
  Daten sind so kurz (Kennzeichen, Nummern). Eine ältere Antwort darf eine
  neuere nie überschreiben: laufende Anfragen werden abgebrochen.
- **Die URL ist der Zustand.** Suchbegriff, Filter, Sortierung und Seite stehen
  in der URL. Wer einen Treffer öffnet und zurückgeht, findet die Liste genau
  so vor, samt Scrollposition. Beim Tippen wird der Verlauf ersetzt, nicht
  ergänzt, sonst braucht Zurück 14 Klicks.
- **Ergebniszahl immer sichtbar.** Sie ist die Rückmeldung, ob ein Filter
  gewirkt hat. Sie ändert sich mit jeder Eingabe, die Liste darunter auch.
- **Null Treffer ist ein Zustand, kein Fehler.** Der Leerzustand nennt, wonach
  gesucht wurde, und bietet einen Ausweg: „Keine Treffer für ‚Rechnug‘. Filter
  zurücksetzen oder anders suchen.“ Nie eine leere weiße Fläche.
- **Filter verbinden sich vorhersehbar.** Innerhalb einer Gruppe heißt mehrfach
  wählen „oder“ (Status offen oder in Arbeit), zwischen Gruppen „und“. Das gilt
  überall im Produkt gleich.
- **Die Liste springt nicht.** Während neue Treffer laden, bleiben die alten
  gedämpft stehen (Deckkraft 60 %) statt zu verschwinden. Erst beim ersten Laden
  zeigt `platzhalter` die Endform.
- **Auf dem Handy wird nicht bei jedem Antippen neu geladen,** wenn die Filter
  in einer Schublade liegen. Der Knopf unten nennt die Zahl, die Liste wechselt
  beim Schließen.

## Bewegung

- **Filtern und Sortieren:** Bleibende Einträge gleiten an ihren neuen Platz,
  wegfallende blenden aus, neue blenden ein (`flip-liste`, `DAUER.sm`,
  `KURVE.wechsel`). So sieht man, was geblieben ist. Ab etwa 50 sichtbaren
  Einträgen oder beim Seitenwechsel wird ohne Flip getauscht.
- **Chips:** Ein neuer aktiver Chip erscheint in `DAUER.xs`, ein entfernter
  schrumpft und blendet aus, die Nachbarn rücken per Flip nach.
- **Ergebniszahl:** wechselt ohne Hochzählen. Sie ist eine Angabe.
- **Schublade:** über `schublade`, Exit schneller als Auftritt.
- **Nicht bewegen:** Suchfeld, Filterleiste, Sortierauswahl. Keine Animation
  beim Tippen.
- Bei „Bewegung reduzieren“ wird die Liste sofort getauscht.

## Zugänglichkeit

- Das Suchfeld liegt in einem `<form role="search">` mit `type="search"`; Esc
  leert es.
- Die Ergebniszahl steht in einem `aria-live="polite"`-Bereich und wird nach dem
  Laden angesagt („24 Ergebnisse“), nicht bei jedem Tastendruck.
- Chips sind Knöpfe mit `aria-pressed` oder Checkboxen in einer `<fieldset>` mit
  `<legend>`. Der Entfernen-Knopf eines aktiven Chips heißt „Filter Offen
  entfernen“.
- Vorschläge beim Tippen folgen dem Combobox-Muster: Pfeiltasten wandern, Enter
  wählt, Esc schließt, `aria-activedescendant` zeigt die Position.
- Nach „Alle zurücksetzen“ liegt der Fokus auf dem Suchfeld.
- Chips und Filterknöpfe mindestens 44 px hoch auf dem Handy.

## Typische Fehler

- Suche bei jedem Zeichen ohne Verzögerung: Die Liste flackert, der Server
  bekommt 12 Anfragen für ein Wort.
- Zustand nur im Speicher: Zurück aus einem Treffer verliert Suche und Filter.
- Jeder Tastendruck ein neuer Eintrag im Browserverlauf.
- Aktive Filter nur in der Leiste versteckt, nicht über der Liste sichtbar.
- Null Treffer als leere Fläche ohne Hinweis und ohne Ausweg.
- Liste verschwindet bei jedem Filtern und baut sich neu auf.
- Filterlogik mal „und“, mal „oder“, je nach Seite.

## Prüfliste

- [ ] Sofortsuche nach 250 bis 300 ms, alte Anfragen abgebrochen
- [ ] Suche, Filter, Sortierung und Seite in der URL, Zurück stellt alles her
- [ ] Aktive Filter als Chips sichtbar, einzeln und gesammelt zurücksetzbar
- [ ] Ergebniszahl sichtbar und angesagt, gestalteter Leerzustand mit Ausweg
- [ ] Umsortieren per `flip-liste`, alte Treffer bleiben beim Nachladen stehen
- [ ] Handy: Filter in der Schublade mit Zahl im Knopf
- [ ] Tastatur: Esc leert, Combobox-Muster bei Vorschlägen
- [ ] Alles sofort bei reduzierter Bewegung

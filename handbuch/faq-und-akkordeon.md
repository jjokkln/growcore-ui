---
titel: FAQ und Akkordeon
gruppe: muster
kurz: Fragen und Antworten oder lange Inhalte, die sich einzeln aufklappen lassen.
stichworte: [faq, häufige fragen, akkordeon, aufklappen, ausklappen, fragen und antworten, accordion, details, hilfe, zusammenklappen]
bausteine: [aufklappen, flip-liste]
demo: [aufklappen]
stand: 2026-10-02
---

## Wofür

Ein Akkordeon zeigt viele Überschriften auf einen Blick und den Inhalt nur
dort, wo jemand nachfragt. Das passt für FAQ, Leistungsdetails,
Vertragsbedingungen, Hilfeseiten und Einstellungen mit Erklärungen. Es passt
nicht für Inhalte, die jeder lesen muss: Was alle brauchen, steht offen da.

## Aufbau

- **Gruppe:** eine Liste von Einträgen, bei mehr als 10 Fragen nach Themen
  gruppiert, jedes Thema mit eigener Zwischenüberschrift.
- **Kopfzeile je Eintrag:** die Frage als vollständiger Satz, rechts ein
  Zeichen (Pfeil oder Plus), das den Zustand zeigt. Die ganze Zeile ist
  klickbar, nicht nur das Zeichen.
- **Inhalt:** die Antwort, höchstens 65ch breit. Kurze Antworten (2 bis 5
  Sätze), bei mehr ein Link auf eine eigene Seite.
- **Trenner:** eine Linie zwischen den Einträgen, keine Karte um jeden.
- **Abschluss:** unter der Liste ein Weg weiter („Frage nicht dabei?
  Nachricht schreiben“).

**Grundlage ist HTML.** `<details>` und `<summary>` funktionieren ohne
JavaScript, die Antwort steht im Quelltext, und die Suche des Browsers öffnet
einen Eintrag, wenn der Treffer darin liegt. Mehrere Einträge dürfen
gleichzeitig offen sein; deshalb kein `name`-Attribut, das die Einträge
gegenseitig schließt.

`aufklappen` kommt dazu, wenn der Zustand gesteuert werden muss: „Alle
öffnen“, Öffnen per Anker, Filtern per Suche, oder wenn die Fragen als echte
Überschriften navigierbar sein sollen.

## Funktionen

**Grundausstattung**
- Einträge einzeln auf- und zuklappen, mehrere offen gleichzeitig
- Antworten im Quelltext, auffindbar für Browsersuche und Suchmaschinen
- Weg zum Kontakt unter der Liste

**Ausbau**
- Gruppen nach Thema mit Sprungleiste darüber
- Anker je Frage: `/faq#lieferzeit` öffnet und zeigt genau diesen Eintrag
- „Alle öffnen“ und „Alle schließen“ ab 8 Einträgen
- FAQ-Schema (`FAQPage` als JSON-LD) für Suchmaschinen

**Speziell**
- Suchfeld über der Liste ab etwa 20 Fragen: filtert beim Tippen, öffnet
  Treffer und hebt das Suchwort hervor
- „Hat das geholfen?“ mit Ja und Nein je Antwort, ausgewertet im Backend
- Antworten aus einem CMS, damit der Kunde sie selbst pflegt

## Worauf es ankommt

- **Die Frage ist das Label.** So formuliert, wie Kunden fragen: „Wie lange
  dauert die Lieferung?“, nicht „Lieferzeiten“. Wer nur die Fragen liest,
  weiß, ob die Antwort dabei ist.
- **Nichts Wichtiges verstecken.** Preise, Fristen, Widerrufsrecht und alles,
  was eine Entscheidung trägt, steht nicht nur in einem geschlossenen Eintrag.
- **Alle geschlossen beim Laden,** außer ein Anker zeigt auf einen Eintrag.
  Den ersten Eintrag vorab zu öffnen lässt die Liste uneinheitlich wirken.
- **Schema gleich Inhalt.** Das JSON-LD enthält genau die Fragen und Antworten,
  die sichtbar auf der Seite stehen, Wort für Wort. Google zeigt FAQ-Ergebnisse
  inzwischen nur noch für wenige Seitenarten; das Schema bleibt sinnvoll als
  maschinenlesbare Fassung, ein Ranking-Versprechen ist es nicht.
- **Suche ab etwa 20 Fragen.** Bei weniger reicht die Gruppierung. Die Suche
  filtert sofort ab 2 Zeichen, zeigt die Trefferzahl und hat einen
  Leerzustand mit Kontaktweg („Keine Antwort gefunden. Frage direkt stellen“).
- **Ein Zeichen, eine Richtung.** Pfeil nach unten heißt zu, nach oben offen;
  Plus heißt zu, Minus oder Kreuz offen. Im Produkt überall dasselbe.
- **Linien statt Karten.** Ein Akkordeon aus zehn Karten mit Schatten ist
  Lärm. Eine Linie zwischen den Einträgen reicht.

## Bewegung

- **Öffnen:** Der Inhalt geht auf seine natürliche Höhe auf, `DAUER.md`,
  `KURVE.raus`. Grund: Man sieht, woher der neue Text kommt, und verliert die
  Stelle nicht.
- **Schließen:** schneller, `DAUER.sm`, `KURVE.rein`.
- **Mit `<details>`:** in CSS über `::details-content` mit
  `interpolate-size: allow-keywords` und Übergang auf `block-size`. Wo der
  Browser das nicht kann, öffnet der Eintrag sofort. Das ist in Ordnung.
- **Mit `aufklappen`:** GSAP übernimmt die Höhe (`height: auto`), geschlossen
  ist der Inhalt `inert`.
- **Zeichen:** dreht in `DAUER.sm` per CSS-Übergang (Pfeil 180°, Plus 45°).
- **Suchfilter:** Einträge, die wegfallen, verschwinden sofort, die übrigen
  rücken per Flip nach (`flip-liste`, `DAUER.sm`).
- **Nicht bewegen:** die Liste beim Laden. Kein gestaffelter Auftritt der
  Fragen beim Scrollen, kein Hover-Sprung der Zeilen.
- In Apps (Hilfe, Einstellungen) 150 bis 250 ms, also auch beim Öffnen
  `DAUER.sm`.
- Bei „Bewegung reduzieren“ öffnet und schließt alles sofort.

## Zugänglichkeit

- `<summary>` ist von sich aus ein Knopf: Enter und Leertaste schalten,
  Zustand wird angesagt. Keine Überschrift ins `<summary>` legen, manche
  Screenreader verschlucken sie dort.
- Sollen Fragen als Überschriften navigierbar sein, Variante mit
  `aufklappen`: `<h3><button aria-expanded aria-controls="antwort-3">`. Der
  Knopf setzt `aria-expanded` selbst.
- Tab wandert von Kopfzeile zu Kopfzeile; der Inhalt eines geschlossenen
  Eintrags ist nicht fokussierbar.
- Kopfzeile mindestens 44 px hoch, über die ganze Breite klickbar,
  Fokusring sichtbar.
- Das Zeichen ist `aria-hidden`, der Zustand steckt im Knopf, nicht im Bild.
- Die Trefferzahl der Suche wird angesagt (`aria-live="polite"`, „4 Fragen
  gefunden“).
- Ein Anker öffnet den Eintrag und setzt den Fokus auf seine Kopfzeile.

## Typische Fehler

- Nur eine Frage gleichzeitig offen: Wer zwei Antworten vergleichen will,
  klickt hin und her.
- Antworten erst per JavaScript nachgeladen: unsichtbar für Browsersuche und
  Suchmaschinen.
- Nur das Pfeilsymbol ist klickbar, nicht die Zeile.
- Stichworte statt Fragen („Versand“, „Zahlung“).
- Schema mit Fragen, die auf der Seite nicht stehen.
- 40 Fragen ohne Gruppen und ohne Suche.
- Jeder Eintrag als Karte mit Schatten und eigenem Rand.
- Preise und Kündigungsfristen nur im geschlossenen Akkordeon.

## Prüfliste

- [ ] `<details>`/`<summary>` als Grundlage, `aufklappen` nur bei gesteuertem Zustand
- [ ] Mehrere Einträge offen möglich, alle geschlossen beim Laden
- [ ] Fragen als ganze Sätze, Antworten höchstens 65ch breit
- [ ] Ganze Zeile klickbar, 44 px, Tastatur und Fokusring geprüft
- [ ] JSON-LD deckungsgleich mit dem sichtbaren Text
- [ ] Ab etwa 20 Fragen Suche mit Trefferzahl und Leerzustand
- [ ] Öffnen `DAUER.md`, Schließen `DAUER.sm`, sofort bei reduzierter Bewegung

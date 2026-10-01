---
titel: Zustände
gruppe: grundlagen
kurz: Laden, leer, Fehler, Erfolg, deaktiviert und offline so zeigen, dass es weitergeht.
stichworte: [zustände, laden, ladezustand, skelett, leer, leerer zustand, fehler, fehlermeldung, erfolg, offline]
bausteine: [platzhalter, meldung, aktion-knopf, feiern]
demo: [platzhalter, aktion-knopf]
stand: 2026-10-02
---

## Wofür

Eine Oberfläche ist nur selten im Idealzustand mit fertig geladenen, passenden
Daten. Meist lädt sie gerade, ist leer, hat einen Fehler oder wartet auf eine
Antwort. Jeder dieser Zustände ist ein eigener Entwurf. Fehlt einer, sieht der
Nutzer eine leere Fläche, einen ewig drehenden Kreis oder eine technische
Meldung, und weiß nicht, was er tun soll.

## Laden

- **Skelett in Endform.** Der Platzhalter hat die Form des fertigen Inhalts:
  gleiche Zeilen, gleiche Höhen, gleiche Spalten. Beim Austausch springt nichts.
  Baustein `platzhalter` (`PlatzhalterBereich`, `Platzhalter`,
  `PlatzhalterText`), reines CSS, läuft auch in `loading.tsx`.
- **Erst nach 180 ms zeigen.** Was schneller lädt, soll nicht kurz grau
  aufblitzen. `platzhalter` verzögert das von selbst.
- **Kein Spinner mitten im Inhalt.** Ein drehender Kreis sagt nichts über Form
  und Dauer. Erlaubt ist er nur im Knopf, der die Aktion ausgelöst hat
  (`aktion-knopf`).
- **Fortschritt nur bei echtem Fortschritt.** Ein Balken mit Prozenten nur,
  wenn der Wert gemessen ist (Upload, Import mit bekannter Zeilenzahl). Ein
  erfundener Balken, der bei 90 % stehen bleibt, zerstört Vertrauen.
- **Teilweise laden.** Was schon da ist, wird gezeigt; nur der fehlende Teil
  hat ein Skelett. Kopf, Navigation und Filter laden nie mit.
- **Aktionen sofort quittieren.** Ein Klick bekommt innerhalb von 100 ms eine
  sichtbare Antwort (gedrückter Knopf, Ladezustand). Wo das Ergebnis fast
  sicher ist (Häkchen setzen, umbenennen), wird es sofort gezeigt und bei einem
  Fehler zurückgenommen.

## Leer

Drei Arten, drei Texte. Jede hat eine Handlung.

| Art | Lage | Inhalt |
| --- | --- | --- |
| Erster Start | Es gibt noch nichts | Was hier entsteht, ein Knopf zum ersten Eintrag, eventuell eine Vorlage |
| Kein Treffer | Filter oder Suche findet nichts | Wonach gesucht wurde, „Filter zurücksetzen“, Hinweis auf Schreibweise |
| Alles erledigt | Liste ist abgearbeitet | Bestätigung in einem Satz, der nächste sinnvolle Schritt |

- Ein leerer Zustand erklärt die Fläche. „Keine Daten“ erklärt nichts.
- Kein Bild aus einer Illustrationsbibliothek als Pflicht. Ein klarer Satz
  und ein Knopf reichen; ein Bild nur, wenn es zum Projekt gehört.
- Leer heißt nicht fehlerhaft: keine roten Farben, keine Warnsymbole.

## Fehler

- **Am Ort des Fehlers.** Feldfehler unter dem Feld, Abschnittsfehler im
  Abschnitt, Seitenfehler an Stelle des Inhalts. Ein Toast nur für
  Vorübergehendes, nie für einen Fehler, den man beheben muss.
- **Problem und Ausweg.** Jede Meldung sagt, was nicht ging, und was jetzt
  hilft: „Die Datei ist größer als 10 MB. Bitte eine kleinere Datei wählen.“
  Ohne Ausweg ist es keine Fehlermeldung, sondern ein Achselzucken.
- **Eingaben behalten.** Nach einem Fehler bleibt alles Eingetippte stehen.
- **Prüfen beim Verlassen,** nicht bei jedem Tastendruck. Ein Feld, das schon
  beim ersten Buchstaben rot wird, schimpft, bevor der Nutzer fertig ist.
- **Seitenfehler mit „Erneut versuchen“.** Bei Netzfehlern lädt dieser Knopf
  den Teil neu, nicht die ganze Seite. Technische Codes höchstens klein darunter.
- Formular mit mehreren Fehlern: oben eine Zusammenfassung mit Links zu den
  Feldern, Fokus auf diese Zusammenfassung.

## Erfolg

- **Leise und kurz.** „Gespeichert“ als Meldung (`meldung`), verschwindet nach
  5 s, mit Aktion nach 8 s. Kein Dialog, der bestätigt werden muss.
- **Rückgängig statt Nachfrage.** Löschen und Archivieren sofort ausführen und
  „Rückgängig“ anbieten, wo das technisch geht.
- **Ergebnis zeigen.** Nach dem Anlegen steht der neue Eintrag in der Liste
  und ist kurz hervorgehoben. Die Meldung ist Zusatz, nicht Ersatz.
- **Feiern nur bei Meilensteinen** (Projekt abgeschlossen, erste Zahlung),
  mit `feiern`, nie bei jedem Speichern.

## Deaktiviert

- **Lieber nicht deaktivieren.** Ein grauer Knopf ohne Grund lässt raten.
  Besser: Knopf aktiv lassen und beim Klick erklären, was fehlt.
- Muss er deaktiviert sein, steht der Grund sichtbar daneben: „Erst eine
  Datei hochladen“.
- Deaktiviert sieht gedämpft aus, bleibt aber lesbar. Nicht nur über
  Transparenz, sondern über Farbe und Mauszeiger.
- `disabled` entfernt den Knopf aus der Tab-Reihenfolge. Soll der Grund per
  Tastatur erreichbar sein: `aria-disabled="true"` und den Klick im Code
  abfangen.

## Offline

- Verbindung weg: ein schmaler Hinweis oben oder unten, „Keine Verbindung.
  Änderungen werden gespeichert, sobald sie wieder da ist.“ Nur, wenn das
  stimmt.
- Eingaben nie verwerfen. Was nicht gesendet werden konnte, bleibt im Formular
  oder in einer Warteschlange und wird markiert.
- Kommt die Verbindung zurück, verschwindet der Hinweis, ausstehende
  Änderungen werden gesendet, ein kurzes „Wieder verbunden“.

## Worauf es ankommt

- **Jeder Zustand hat einen Ausweg.** Leer, Fehler und deaktiviert nennen
  immer den nächsten Schritt.
- **Nichts springt.** Skelett und Inhalt haben dieselben Maße, ein Knopf im
  Ladezustand behält seine Breite.
- **Zustände sind CSS.** Hover, Fokus, Aktiv, Deaktiviert und Ladezustand laufen
  über Attribute (`data-zustand`, `aria-busy`, `:disabled`), nicht über
  Animationsbibliotheken.
- **Jedes Bedienelement hat sieben Zustände:** normal, Hover, Fokus, Aktiv,
  Deaktiviert, Laden, Fehler. Keiner fehlt bei der Auslieferung.

## Bewegung

- Skelett zu Inhalt: Inhalt blendet in `DAUER.xs` ein, ohne Versatz. Kein
  gestaffelter Auftritt von Tabellenzeilen. In Apps gibt es keine
  Lade-Choreografie.
- Der Schimmer im Skelett ist leise und fällt bei „Bewegung reduzieren“ weg.
- `aktion-knopf`: Kreis dreht während des Ladens, danach zeichnet sich ein
  Haken (DrawSVG), bei Fehler ein kurzes Schütteln. Alles unter 250 ms je
  Schritt.
- `meldung`: herein in `DAUER.sm` mit `KURVE.raus`, hinaus in rund 70 % davon
  mit `KURVE.rein`; nachrückende Meldungen gleiten per Flip.
- Nicht bewegen: Fehlermeldungen am Feld (erscheinen sofort), leere Zustände,
  Offline-Hinweis.

## Zugänglichkeit

- Ladebereich mit `role="status"` und Namen („Wird geladen“), der Bereich
  selbst mit `aria-busy="true"`. Das Skelett ist `aria-hidden`.
- Erfolg und Info über eine höfliche Live-Region (`role="status"`), Fehler
  nach dem Absenden über `role="alert"`.
- Feldfehler: `aria-invalid="true"` am Feld, Meldung über `aria-describedby`
  verknüpft.
- Nach einem fehlgeschlagenen Absenden springt der Fokus auf die
  Zusammenfassung oder das erste fehlerhafte Feld.
- Zustand nie nur über Farbe: Fehler mit Icon und Text, Erfolg mit Haken und
  Wort. Meldungen pausieren bei Hover und Fokus.

## Typische Fehler

- Spinner in der Mitte einer leeren Seite, danach springt das Layout.
- Skelett blitzt bei schnellen Antworten kurz auf.
- „Keine Einträge“ ohne Knopf, ohne Erklärung.
- Gleicher Text für „noch nichts angelegt“ und „Filter findet nichts“.
- Fehler als Toast, der verschwindet, bevor er gelesen ist.
- „Ein Fehler ist aufgetreten.“ ohne Ursache, ohne Ausweg.
- Formular leert sich nach einem Serverfehler.
- Grauer Knopf ohne Grund.

## Prüfliste

- [ ] Skelett in Endform über `platzhalter`, erscheint erst nach 180 ms
- [ ] Spinner nur im auslösenden Knopf, Fortschrittsbalken nur bei gemessenem Wert
- [ ] Drei leere Zustände unterschieden, jeder mit Handlung
- [ ] Fehler am Ort, mit Problem und Ausweg, Eingaben bleiben stehen
- [ ] Erfolg über `meldung`, Löschen mit „Rückgängig“
- [ ] Deaktiviert nur mit sichtbarem Grund
- [ ] Offline-Hinweis, keine verlorenen Eingaben
- [ ] Live-Regionen, `aria-invalid`, Fokus nach Fehler, nichts nur über Farbe

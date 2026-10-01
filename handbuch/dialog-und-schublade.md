---
titel: Dialog und Schublade
gruppe: muster
kurz: Ebenen über der Seite, und wann eine Aufgabe besser an Ort und Stelle bleibt.
stichworte: [dialog, modal, popup, schublade, drawer, seitenpanel, overlay, bestätigung, löschen bestätigen, fenster]
bausteine: [schublade, aufklappen]
demo: [schublade]
stand: 2026-10-02
---

## Wofür

Eine Ebene über der Seite unterbricht. Das ist nur dann richtig, wenn die
Unterbrechung gewollt ist. Die Entscheidung läuft in dieser Reihenfolge:

1. **Inline:** Die Aufgabe ist klein und der Zusammenhang soll sichtbar
   bleiben. Feld an Ort und Stelle bearbeiten, Bereich aufklappen (Baustein
   `aufklappen`), Details unter der Zeile zeigen.
2. **Schublade:** Die Aufgabe ist größer, der Zusammenhang soll daneben stehen
   bleiben. Menü, Filter, Warenkorb, Details eines Listeneintrags, ein
   Datensatz mit mehreren Feldern.
3. **Dialog:** Es muss jetzt entschieden werden, bevor es weitergeht.
   Unumkehrbares bestätigen, eine kurze Pflichtangabe („Name der neuen
   Mappe“), Sitzung abgelaufen.

Wer zuerst an einen Dialog denkt, prüft die beiden Stufen davor.

## Aufbau

- **Dialog:** zentriert, 400–560 px breit, höchstens 85 % der
  Fensterhöhe. Titel als Überschrift, darunter höchstens drei Sätze, unten die
  Aktionen: primär rechts, „Abbrechen“ links daneben. Bei langem Inhalt
  scrollt nur die Mitte, Titel und Aktionen bleiben stehen.
- **Schublade:** am Seitenrand, volle Höhe. Für Menüs `min(22rem, 86vw)` wie im
  Baustein, für Bearbeiten 480–640 px. Kopf mit Titel und Schließen-Knopf,
  Inhalt scrollt, Fuß mit Aktionen bleibt stehen.
- **Schleier:** dunkelt die Seite ab (im Baustein Schwarz mit 40 % Deckkraft),
  ein Klick darauf schließt. Bei Dialogen mit Eingaben schließt der Schleier
  nicht, damit kein Fehlklick Eingaben verwirft.
- **Löschen bestätigen:** Titel nennt Handlung und Gegenstand („Angebot
  A-2026-014 löschen?“), ein Satz zur Folge („Das lässt sich nicht
  rückgängig machen.“), der Knopf nennt die Handlung („Löschen“), nie „OK“
  oder „Ja“.

## Funktionen

**Grundausstattung**
- Natives `<dialog>` mit `showModal()`
- Schließen per Escape, Schließen-Knopf und (ohne Eingaben) Schleier
- Fokus kehrt nach dem Schließen zum Auslöser zurück
- Die Seite dahinter scrollt nicht

**Ausbau**
- Schublade von links oder rechts mit gestaffelten Einträgen
- Bestätigungsdialog für unumkehrbares Löschen
- Schutz ungespeicherter Änderungen beim Schließen
- Detail-Schublade mit eigener Adresse (`?eintrag=42`), damit Zurück sie schließt
  und ein Link genau sie öffnet

**Speziell**
- Auf dem Handy als Blatt von unten, mit Ziehen zum Schließen
- Nicht-modale Seitenleiste (Inspektor), die neben dem Inhalt stehen bleibt
- Name des Gegenstands eintippen, bevor ein ganzes Projekt gelöscht wird
- Zwei Ebenen Schublade übereinander (Liste, dann Eintrag), nie mehr

## Worauf es ankommt

- **Nativ statt nachgebaut.** `<dialog>` mit `showModal()` liegt in der
  obersten Ebene, macht den Rest der Seite inert und kennt Escape. Ein
  nachgebautes `div` mit `z-index` wird von `overflow: hidden` abgeschnitten
  und lässt die Tastatur hinaus.
- **Rückgängig schlägt Nachfragen.** Lässt sich eine Handlung umkehren, wird
  sie sofort ausgeführt und eine Meldung mit „Rückgängig“ erscheint (siehe
  Rückmeldung). Der Bestätigungsdialog ist nur für Unumkehrbares da. Wer bei
  jedem Löschen fragt, erzieht zum blinden Klicken.
- **Exit schneller als Enter.** Öffnen in `DAUER.md` oder `DAUER.sm`, Schließen
  in `DAUER.sm` oder `DAUER.xs`. Wer schließt, ist fertig und will nicht warten.
- **Nur nachfragen, wenn sich etwas geändert hat.** Ein unberührtes Formular
  schließt ohne Rückfrage. Ein geändertes fragt: „Änderungen verwerfen?“ mit
  „Verwerfen“ und „Weiter bearbeiten“.
- **Kein Dialog im Dialog.** Braucht ein Dialog einen zweiten, war die erste
  Ebene falsch gewählt, meist hätte es eine Schublade oder eine Seite sein
  müssen.
- **Seite friert ein, ohne zu springen.** Scrollsperre über
  `html:has(dialog[open])`, dazu `scrollbar-gutter: stable`, damit der Inhalt
  beim Verschwinden der Scrollleiste nicht seitlich rutscht.
- **Aktionen gleich gebaut.** In jedem Dialog eines Produkts stehen die Knöpfe
  an derselben Stelle in derselben Reihenfolge.

## Bewegung

- **Schublade:** nach Baustein. Schleier blendet in `DAUER.md` mit `KURVE.raus`
  ein, das Panel gleitet mit `KURVE.stark` vom Rand herein, Einträge mit
  `data-schublade-punkt` folgen gestaffelt (40 ms). Zu: Panel und Schleier in
  `DAUER.sm` mit `KURVE.rein`, erst danach schließt der Dialog. Grund:
  Kontinuität, die Ebene kommt von dort, wohin sie wieder geht.
- **Dialog:** Fenster blendet ein und wächst von `scale: 0.96` auf 1, dazu
  8 px Weg nach oben, `DAUER.sm` mit `KURVE.raus`. Zu in `DAUER.xs` mit
  `KURVE.rein`. In Apps bleibt alles bei 150–250 ms.
- **Ohne GSAP:** Ein einfacher Dialog braucht keinen Baustein. CSS mit
  `@starting-style` und `transition-behavior: allow-discrete` animiert auch
  `::backdrop`, mit denselben Variablen (`--dauer-sm`, `--kurve-raus`).
  GSAP kann `::backdrop` nicht animieren, deshalb hat die Schublade einen
  eigenen Schleier.
- **Nicht bewegen:** Inhalt im Dialog (keine gestaffelten Felder), Titel,
  Aktionen. Kein Aufploppen aus der Ecke, kein Federn, kein Drehen.
- Bei „Bewegung reduzieren“ öffnet und schließt alles sofort.

## Zugänglichkeit

- `showModal()` gibt dem Dialog die Rolle `dialog` und macht den Rest inert.
  Der Name kommt über `aria-labelledby` vom Titel (oder `aria-label` wie im
  Baustein), der erklärende Satz über `aria-describedby`.
- Bestätigungen vor Unumkehrbarem bekommen `role="alertdialog"`.
- **Erster Fokus:** bei Eingaben das erste Feld, bei Bestätigungen „Abbrechen“,
  bei langem Text der Titel (`tabindex="-1"`). Gesetzt mit `autofocus` am
  Element im Dialog.
- Escape löst `cancel` aus. Bei ungespeicherten Änderungen wird das Ereignis
  abgefangen und die Rückfrage gezeigt, statt still zu schließen.
- Nach dem Schließen steht der Fokus wieder auf dem Knopf, der geöffnet hat.
  Ist der Auslöser verschwunden (gelöschte Zeile), auf dem nächsten sinnvollen
  Element.
- Schließen-Knopf mit Namen „Schließen“, mindestens 44 × 44 px.
- Der destruktive Knopf ist nicht nur rot: Er trägt die Handlung als Wort.

## Typische Fehler

- Modal für Details, die unter der Zeile Platz gehabt hätten.
- Bestätigungsdialog bei jedem Löschen, obwohl es einen Papierkorb gibt.
- Knöpfe „OK“ und „Abbrechen“: Niemand weiß, was „OK“ tut.
- Klick auf den Schleier verwirft ein halb ausgefülltes Formular.
- Nachgebautes Modal: Tab läuft in die Seite dahinter, Escape tut nichts.
- Fokus landet nach dem Schließen am Seitenanfang.
- Schließen dauert so lange wie Öffnen oder länger.
- Seite springt seitlich, weil die Scrollleiste verschwindet.

## Prüfliste

- [ ] Inline und Schublade geprüft, bevor ein Dialog entsteht
- [ ] Natives `<dialog>` mit `showModal()`, Schublade über `schublade`
- [ ] Escape, Schließen-Knopf, Fokus zurück zum Auslöser
- [ ] Erster Fokus bewusst gesetzt, Name über den Titel
- [ ] Umkehrbares mit Rückgängig, Unumkehrbares mit `alertdialog` und Handlungswort
- [ ] Rückfrage nur bei echten Änderungen
- [ ] Schließen schneller als Öffnen, Apps 150–250 ms, still bei reduzierter Bewegung
- [ ] Scrollsperre ohne seitlichen Sprung

---
titel: Texte
gruppe: grundlagen
kurz: Knöpfe, Meldungen und leere Zustände in klarer, gleichbleibender Sprache.
stichworte: [texte, ux-texte, microcopy, beschriftung, knopftext, fehlermeldung, ansprache, duzen, siezen, datumsformat]
bausteine: [meldung, aktion-knopf]
demo: []
stand: 2026-10-02
---

## Wofür

Die Texte in einer Oberfläche sind Bedienelemente. Ein Knopf, der „OK“ heißt,
zwingt zum Nachdenken; einer, der „Rechnung senden“ heißt, nicht. UX-Texte
sagen kurz, was passiert, was schiefging und was als Nächstes zu tun ist. Sie
klingen im ganzen Produkt gleich, weil sie nach festen Regeln geschrieben sind.

## Knöpfe benennen die Handlung

- **Verb plus Gegenstand:** „Angebot senden“, „Termin speichern“, „Datei
  hochladen“. Nicht „OK“, „Absenden“, „Weiter“, wenn klar ist, was passiert.
- **Höchstens drei Wörter,** am Desktop einzeilig. Bricht ein Knopf um, wird
  der Text gekürzt, nicht der Knopf verbreitert.
- **Satzschreibung,** keine Versalien: „Projekt anlegen“, nicht „PROJEKT
  ANLEGEN“.
- **Der Knopf wiederholt die Frage.** Heißt der Dialog „Projekt löschen?“,
  heißen die Knöpfe „Projekt löschen“ und „Abbrechen“, nicht „Ja“ und „Nein“.
- **Links sagen, wohin sie führen:** „Alle Rechnungen ansehen“ statt „Hier
  klicken“ oder „Mehr“.

## Ein Label je Absicht

- Eine Handlung hat im ganzen Produkt ein Wort. Wer „Kontakt aufnehmen“ wählt,
  schreibt nicht an anderer Stelle „Lass uns reden“ oder „Projekt starten“
  für dasselbe Ziel.
- Dasselbe Ding hat überall denselben Namen. Heißt es in der Navigation
  „Aufträge“, heißt es in der Überschrift, im leeren Zustand und in der Meldung
  nicht „Projekte“.
- Pro Projekt eine kurze Wortliste (Begriff, Bedeutung, nicht verwenden) im
  repo-eigenen `context/`. Neue Bildschirme nehmen die Wörter von dort.

## Fehlermeldungen

- **Was ist passiert, und was hilft jetzt.** „Die Datei ist größer als 10 MB.
  Bitte eine kleinere Datei wählen.“
- **Keine Schuld.** „Das Passwort ist zu kurz, mindestens 12 Zeichen“, nicht
  „Sie haben ein ungültiges Passwort eingegeben“.
- **Konkret statt allgemein.** „Diese E-Mail-Adresse hat kein @“ statt
  „Ungültige Eingabe“. „Ein Fehler ist aufgetreten“ nur als letzte Rückfallebene,
  dann mit „Erneut versuchen“.
- **Kein Fachjargon.** Fehlercodes, „500“, „Timeout“, „Request failed“ höchstens
  klein unter der Meldung, für den Support.
- **Keine Ausrufezeichen, keine Witze** in Fehlern. Wer gerade Daten verloren
  glaubt, braucht Ruhe.

## Leere Zustände

- Ein Satz, was hier entsteht, und ein Knopf, der es tut: „Noch keine
  Rechnungen. Die erste Rechnung entsteht aus einem Angebot.“ Darunter
  „Angebot öffnen“.
- „Kein Treffer“ nennt den Suchbegriff: „Keine Kunden zu ‚Meier‘. Filter
  zurücksetzen?“
- „Alles erledigt“ bestätigt kurz und schlägt den nächsten Schritt vor.

## Bestätigungen und Erfolg

- **Erfolg in zwei Wörtern:** „Gespeichert“, „Angebot gesendet“, „Link
  kopiert“. Kein „Erfolgreich gespeichert!“; das Partizip sagt schon, dass es
  geklappt hat.
- **Nachfragen nur vor Unumkehrbarem** und dann mit den Folgen: „Projekt
  löschen? Alle 12 Aufgaben und 3 Dateien werden mit gelöscht. Das lässt sich
  nicht rückgängig machen.“ Die Zahlen stammen aus den echten Daten.
- Wo es geht, „Rückgängig“ statt Nachfrage.

## Platzhalter nie als Label

- Das Label steht über dem Feld, immer sichtbar. Der Platzhalter verschwindet
  beim Tippen; wer dann nachsehen will, was gefragt war, sieht nichts mehr.
- Platzhalter nur als Beispiel für das Format: „z. B. 0171 2345678“ oder
  „TT.MM.JJJJ“. Kein „Bitte hier eingeben“.
- Pflichtfelder gekennzeichnet, oder die wenigen freiwilligen mit „optional“.
  Eine Regel je Formular, nicht beides.
- Hilfetext unter dem Label, nicht im Tooltip, wenn er zum Ausfüllen nötig ist.

## Ansprache: Sie oder du

- **Je Projekt einmal entscheiden** und als Entscheidung im Projekt festhalten.
  Grundlage: Zielgruppe, Branche, wie die Marke sonst spricht.
- **Durchziehen:** Oberfläche, Mails, Fehlermeldungen, Hilfetexte.
  Ein „Du“ im Onboarding und ein „Sie“ in der Bestätigungsmail ist ein Bruch.
- In Bedienelementen oft gar keine Anrede: „Passwort ändern“ statt „Ändern Sie
  Ihr Passwort“. Das spart Wörter und umgeht die Frage dort, wo sie nichts
  beiträgt.
- „Sie“ und „Ihr“ großgeschrieben, „du“ und „dein“ klein (beides zulässig, eine
  Form je Projekt).

## Zahlen und Datum (de-DE)

- **Formatieren über `Intl`** mit `de-DE`, nie von Hand zusammensetzen.
- Zahlen: `1.234,56`. Beträge: `1.234,56 €` mit Leerzeichen vor dem Zeichen
  (`Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })`).
- Prozent mit Leerzeichen: `12 %`.
- Datum: `02.10.2026` in Tabellen und Feldern, `2. Oktober 2026` im
  Fließtext, mit Wochentag wo es hilft: `Fr., 2. Okt.`
- Uhrzeit: `14:30 Uhr`, 24-Stunden-Format, kein „pm“.
- Relative Zeit für Frisches („vor 3 Minuten“, `Intl.RelativeTimeFormat`), ab
  einem Tag das Datum. Das genaue Datum per `<time datetime>` und Tooltip.
- Zeiträume mit Halbgeviertstrich ohne Leerzeichen oder mit „bis“:
  `9–17 Uhr`, `2. bis 6. Oktober`.
- Zahlen zwischen Wert und Einheit mit geschütztem Leerzeichen, damit „10“ und
  „MB“ nicht auf zwei Zeilen landen.

## Keine Füllverben

- Konkrete Verben statt Werbeverben. Nicht „entfesseln“, „revolutionieren“,
  „auf das nächste Level heben“, „transformieren“, sondern sagen, was
  passiert: „Rechnung aus dem Angebot erzeugen“.
- Keine Meta-Sätze unter Überschriften („Hier finden Sie alles zu …“), keine
  „Schritt 1“-Labels, wenn der Inhalt das Label sein kann („Daten eingeben“).
- Ein Sprachregister je Produkt: nicht Technikjargon, Werbesprache und
  Plauderton gemischt.

## Worauf es ankommt

- **Der Text ist die Bedienung.** Wer nur die Texte liest, versteht, was zu
  tun ist.
- **Gleich klingt vertrauenswürdig.** Gleiche Wörter, gleiche Anrede, gleiche
  Formate auf jedem Bildschirm.
- **Kurz schlägt vollständig,** solange nichts Wichtiges fehlt. Jeder Satz wird
  vor der Auslieferung einmal laut gelesen; was schief klingt, wird umgeschrieben.
- **Nichts erfinden.** Keine Zahlen, Kundenstimmen oder Versprechen ohne
  Freigabe, auch nicht als Platzhalter in einem ausgelieferten Bildschirm.

## Bewegung

- Text wechselt in Knöpfen ohne Animation des Textes selbst; `aktion-knopf`
  hält die Breite fest, damit „Speichern“ zu „Gespeichert“ nicht springt.
- Meldungen erscheinen über `meldung`. Der Text darin bewegt sich nicht.
- Keine Schreibmaschinen-Effekte für UI-Texte.

## Typische Fehler

- „OK“ und „Abbrechen“ unter einer Löschfrage.
- Drei Wörter für dieselbe Handlung auf einer Seite.
- Platzhalter als einzige Beschriftung im Formular.
- „Ungültige Eingabe“ ohne Hinweis, was gültig wäre.
- Du im Formular, Sie in der Mail.
- `10/02/2026`, `2:30 PM`, `€1,234.56` aus einer US-Vorlage.
- Geviertstrich oder gerade Anführungszeichen im sichtbaren Text.

## Prüfliste

- [ ] Jeder Knopf: Verb plus Gegenstand, höchstens drei Wörter, einzeilig
- [ ] Ein Label je Absicht, ein Name je Ding, Wortliste im `context/`
- [ ] Fehler nennen Problem und Ausweg, ohne Schuld und ohne Codes im Vordergrund
- [ ] Leere Zustände mit Satz und Handlung
- [ ] Label über dem Feld, Platzhalter nur als Formatbeispiel
- [ ] Sie oder du entschieden, festgehalten und überall gleich
- [ ] Zahlen, Beträge, Datum und Uhrzeit über `Intl` mit `de-DE`
- [ ] Keine Füllverben, ein Register, deutsche Anführungszeichen „…“

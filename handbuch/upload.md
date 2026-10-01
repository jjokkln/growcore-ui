---
titel: Upload
gruppe: muster
kurz: Dateien und Bilder hochladen, mit Grenzen vorab, Fortschritt und Fehler je Datei.
stichworte: [upload, hochladen, datei, bild, ziehen und ablegen, anhang, dokument, foto, zuschnitt, dateiauswahl]
bausteine: [flip-liste]
demo: []
stand: 2026-10-02
---

## Wofür

Ein Upload nimmt Dateien entgegen: Anhänge zu einer Anfrage, Fotos für ein
Profil, Belege und Dokumente in einer App. Vor dem Bau stehen drei
Entscheidungen: **welche Formate**, **wie groß** und **wie viele**. Davon hängen
Hinweistext, Prüfung und Speicher ab. Wer sie nicht trifft, bekommt 40-MB-Fotos
im HEIC-Format und eine Fehlermeldung, die niemand versteht.

## Aufbau

- **Ablagefläche:** ein umrandeter Bereich mit einem Satz („Dateien hierher
  ziehen oder auswählen“) und einem echten Knopf „Dateien auswählen“. Auf dem
  Handy nur der Knopf, denn dort zieht niemand.
- **Grenzen sichtbar vor dem Hochladen:** direkt in der Fläche, z. B. „PDF, JPG
  oder PNG, bis 10 MB je Datei, höchstens 5 Dateien“.
- **Dateiliste darunter:** je Datei eine Zeile mit Vorschau oder Formatsymbol,
  Name (gekürzt in der Mitte, Endung bleibt sichtbar), Größe, Zustand und
  „Entfernen“.
- **Zustände je Zeile:** wartet, lädt (mit Fortschritt in Prozent), fertig,
  fehlgeschlagen (mit Grund und „Erneut versuchen“).
- **Bilder:** Vorschau als Kachel im richtigen Seitenverhältnis, Zuschnitt über
  einen eigenen Schritt, nicht automatisch.

## Funktionen

**Grundausstattung**
- Auswahl per Knopf und per Ziehen und Ablegen
- Formate, Größe und Anzahl vorab genannt und vor dem Hochladen geprüft
- Fortschritt je Datei, Entfernen je Datei
- Fehler je Datei mit Grund, die übrigen laden weiter
- Speicherort in der EU, Zugriff nur für Berechtigte

**Ausbau**
- Bildvorschau als Kacheln, Großansicht per Klick
- Zuschnitt auf ein festes Seitenverhältnis (Profilbild 1:1, Titelbild 16:9)
- Bilder vor dem Hochladen im Browser verkleinern (z. B. auf 2400 px Kante)
- Reihenfolge per Ziehen ändern, die Kacheln gleiten an ihren Platz (`flip-liste`)
- Einfügen aus der Zwischenablage (Bildschirmfoto mit Strg+V)
- Abbrechen eines laufenden Uploads

**Speziell**
- Fortsetzbarer Upload für große Dateien (ab etwa 50 MB in Teilen)
- Virenprüfung auf dem Server vor der Freigabe
- Kamera direkt öffnen auf dem Handy (`capture`) für Belege und Schadensfotos
- Ordner hochladen mit erhaltener Struktur
- Texterkennung oder Auslesen von Belegen nach dem Hochladen

## Worauf es ankommt

- **Grenzen vorher, nicht hinterher.** Formate, Größe und Anzahl stehen da,
  bevor jemand eine Datei wählt. `accept` im Feld filtert schon den Dialog des
  Betriebssystems.
- **Im Browser prüfen, auf dem Server erzwingen.** Der Browser sagt sofort
  „Datei zu groß (14 MB, erlaubt 10 MB)“. Der Server prüft Größe und echten
  Dateityp (Inhalt, nicht Endung) trotzdem, denn die Browserprüfung lässt sich
  umgehen.
- **Fehler je Datei.** Von fünf Dateien scheitert eine: Die anderen vier laden
  weiter, die eine zeigt ihren Grund in ihrer Zeile. Ein Sammelfehler oben, der
  alles verwirft, ist der häufigste Fehler dieses Musters.
- **Fortschritt, der stimmt.** Ein echter Prozentwert je Datei aus dem
  Upload-Ereignis, kein Balken, der auf 90 % fährt und wartet. Unter 1 s Dauer
  genügt der Zustand „fertig“ ohne Balken.
- **Handyfotos mitdenken.** Fotos vom Handy sind oft 4 bis 12 MB und manchmal
  HEIC. Entweder HEIC annehmen und auf dem Server wandeln oder vorher im Browser
  verkleinern und als JPG senden. Ablehnen ohne Erklärung ist keine Option.
- **Speicher in der EU, privat als Standard.** Hochgeladene Dateien liegen in
  einem Speicher mit EU-Region (z. B. Supabase Storage in Frankfurt), der Eimer
  ist privat, Abruf über zeitlich begrenzte Links. Öffentlich nur, was
  öffentlich sein soll (Bilder einer Website).
- **Eigene Dateinamen auf dem Server.** Der Originalname wird angezeigt, aber nie
  als Speicherpfad verwendet. Gespeichert wird unter einer zufälligen Kennung.
- **Metadaten entfernen.** Fotos tragen oft GPS-Koordinaten. Für öffentlich
  sichtbare Bilder werden EXIF-Daten beim Verarbeiten entfernt.

## Bewegung

- **Ziehen über die Fläche:** Rand und Fläche wechseln auf den Akzent, wenn eine
  Datei darüber schwebt, `DAUER.xs`. Reiner CSS-Zustand, keine Animation der
  Fläche selbst.
- **Neue Datei in der Liste:** Die Zeile erscheint mit Deckkraft und 8 px
  Versatz, `DAUER.sm`, `KURVE.raus`. Mehrere gleichzeitig mit `STAFFEL`,
  höchstens 6.
- **Fortschritt:** Der Balken wächst per `scaleX` mit dem echten Wert, ohne
  eigene Kurve, die ihm vorauseilt.
- **Fertig:** Das Symbol wechselt auf ein Häkchen, `DAUER.xs`. Kein Konfetti.
- **Entfernen und Umsortieren:** Die übrigen Kacheln gleiten an ihren neuen Platz
  (`flip-liste`), `DAUER.sm`.
- **Nicht bewegen:** die Ablagefläche beim Hover, Vorschaubilder (kein Zoomen
  beim Überfahren), der Hinweistext.
- Bei „Bewegung reduzieren“ erscheinen Zeilen sofort, der Fortschritt bleibt als
  Zahl sichtbar.

## Zugänglichkeit

- Unter der Fläche liegt ein echtes `<input type="file">` mit sichtbarem Label;
  der Knopf „Dateien auswählen“ ist per Tastatur erreichbar. Ziehen ist nur ein
  zusätzlicher Weg.
- Die Grenzen hängen per `aria-describedby` am Feld.
- Statusänderungen werden angesagt (`aria-live="polite"`): „bericht.pdf
  hochgeladen“, „foto.heic: Format nicht unterstützt“. Kein Ansagen jedes
  Prozentschritts.
- Fortschritt als `<progress>` mit Namen der Datei.
- „Entfernen“ trägt den Dateinamen im Namen („bericht.pdf entfernen“), mindestens
  44 × 44 px. Nach dem Entfernen liegt der Fokus auf der nächsten Zeile oder der
  Ablagefläche.
- Zustände nie nur über Farbe: fehlgeschlagen mit Symbol und Text.

## Typische Fehler

- Grenzen erst in der Fehlermeldung genannt.
- Eine zu große Datei verwirft den ganzen Stapel.
- „Upload fehlgeschlagen“ ohne Grund und ohne erneuten Versuch.
- Ablagefläche ohne Knopf: per Tastatur und auf dem Handy nicht bedienbar.
- Öffentlicher Speicher für Bewerbungsunterlagen oder Belege.
- Speicher außerhalb der EU, weil der Standard des Dienstes so eingestellt war.
- Originaldateiname als Pfad auf dem Server.
- Handyfotos mit 12 MB scheitern an einer 5-MB-Grenze, die nirgends stand.

## Prüfliste

- [ ] Formate, Größe und Anzahl vor der Auswahl sichtbar, `accept` gesetzt
- [ ] Prüfung im Browser und auf dem Server, echter Dateityp
- [ ] Fortschritt und Fehler je Datei, die übrigen laden weiter
- [ ] Knopf und `<input type="file">` per Tastatur, Ziehen nur zusätzlich
- [ ] Statusänderungen angesagt, Entfernen mit Dateinamen im Namen
- [ ] Handyfotos (Größe, HEIC) getestet
- [ ] Speicher in der EU, privat als Standard, zufällige Dateinamen
- [ ] Alles still bei reduzierter Bewegung

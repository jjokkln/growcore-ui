---
titel: Grundsätze
gruppe: grundlagen
kurz: Was gutes Design bei GrowCore ausmacht, in zehn Sätzen.
stichworte: [grundsätze, prinzipien, designregeln, qualität, standard, handbuch, was ist gutes design]
bausteine: []
demo: []
stand: 2026-10-02
---

## Wozu dieses Handbuch

Es beschreibt, wie die Bausteine einer Website oder App bei GrowCore aussehen,
was sie können und woran man gute Umsetzung erkennt. Es richtet sich an drei
Leser zugleich: an Kunden, die wissen wollen, was sie bekommen und was möglich
ist; an GrowCore selbst, damit jedes Projekt auf demselben Niveau startet; und
an die KI-Agenten, die mit am Code arbeiten und hier nachschlagen, bevor sie
etwas bauen.

Jedes Muster hat dieselbe Gliederung: **Wofür** es da ist, wie es **aufgebaut**
ist, welche **Funktionen** es haben kann (von der Grundausstattung bis zum
Speziellen), **worauf es ankommt**, wie es sich **bewegt**, wie es **für alle
bedienbar** bleibt, welche **Fehler** typisch sind und eine **Prüfliste** zum
Abhaken.

**Vorrang:** Gesetzliche Pflichten und der GrowCore-Pflichtkern (Datenschutz,
Barrierefreiheit, Impressum) gehen vor. Danach kommt die Marke des Kunden.
Danach dieses Handbuch.

## Die zehn Grundsätze

1. **Die Fläche bestimmt den Ton.** Eine Website will überzeugen, eine App will
   eine Aufgabe erledigen, eine Hilfeseite will erklärt werden. Dieselbe Karte
   sieht auf einer Landingpage anders aus als in einem Dashboard. Zuerst klären,
   welche Fläche es ist, dann gestalten.
2. **Klarheit vor Wirkung.** Jedes Element muss in einem Satz sagen können, wofür
   es da ist. Was nur gut aussieht, fliegt.
3. **Nichts springt.** Platz wird reserviert, bevor Inhalt lädt. Zahlen haben feste
   Breiten, Kalender feste Zeilen, Bilder feste Seitenverhältnisse. Ein Layout,
   das beim Laden oder Blättern zuckt, wirkt billig, egal wie schön es danach ist.
4. **Jeder Zustand ist gestaltet.** Laden, leer, Fehler, Erfolg, deaktiviert. Die
   meisten Oberflächen sehen nur im Idealzustand gut aus. Gute auch dazwischen.
5. **Ein Akzent, ein Theme, eine Form.** Eine Akzentfarbe für das Wichtige, ein
   Hell- oder Dunkelmodus aus der Nutzungsszene, eine Radius-Skala. Konsequenz
   wirkt hochwertiger als Vielfalt.
6. **Bewegung erklärt.** Sie zeigt, woher etwas kommt, wohin es geht und dass eine
   Handlung angekommen ist. Je Seite gibt es höchstens einen gestalteten Moment,
   der Rest ist ruhig und schnell (Kapitel „Bewegung“).
7. **Für alle bedienbar ist Standard, nicht Zusatz.** Tastatur, Screenreader,
   Kontrast 4,5:1, Treffflächen ab 44 px, „Bewegung reduzieren“. Das wird nicht am
   Ende geprüft, sondern ist in jedem Baustein schon eingebaut.
8. **Nichts wird erfunden.** Keine Zahl, kein Logo, kein Kundenstimmen-Zitat ohne
   Freigabe. Fehlt ein Inhalt, fehlt die Sektion.
9. **Schnell ist schön.** Die größte Sichtbarkeit lädt sofort, Bewegung nutzt nur
   Eigenschaften, die der Browser günstig berechnet, schwere Effekte laden erst,
   wenn man sie sieht.
10. **Einmal gut, dann wiederverwenden.** Jedes Muster existiert einmal als
    Baustein in `growcore-ui` und wird von dort eingebaut. Zwei verschiedene
    Kalender in einem Produkt sind ein Fehler, kein Stil.

## Worauf es ankommt

- Vor dem ersten Strich: Fläche (überzeugen, bedienen, lesen, erleben) und
  Zielgruppe benennen. Daraus folgen Dichte, Tempo und Ton.
- Erst den passenden Baustein suchen, dann anpassen, erst zuletzt neu bauen.
- Die Prüfliste des jeweiligen Kapitels ist die Abnahme, nicht der Geschmack.

## Typische Fehler

- Effekte, weil die Technik sie kann, nicht weil die Seite sie braucht.
- Jede Sektion mit derselben Einblend-Animation.
- Oberflächen, die nur mit Beispieldaten gut aussehen.
- Drei gleiche Karten nebeneinander als Seitenaufbau.
- Ein Muster im selben Produkt zweimal unterschiedlich gelöst.

## Prüfliste

- [ ] Fläche benannt (überzeugen, bedienen, lesen, erleben)
- [ ] Passender Baustein aus `growcore-ui` verwendet oder Neubau begründet
- [ ] Alle Zustände gestaltet: laden, leer, Fehler, Erfolg, deaktiviert
- [ ] Nichts springt beim Laden, Blättern oder Umschalten
- [ ] Ein Akzent, ein Theme, eine Radius-Skala
- [ ] Höchstens ein gestalteter Bewegungsmoment je Seite, „Bewegung reduzieren“ beachtet
- [ ] Tastatur, Screenreader, Kontrast, Treffflächen geprüft
- [ ] Jede Zahl und jedes Zitat freigegeben

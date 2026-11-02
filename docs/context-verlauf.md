# context-Verlauf — growcore-ui

> Aus `context/context.md` herausgenommen am 2026-11-02 (Standard `kontext`), Wortlaut unverändert. Kein Lesepfad.

- Nie einzelne Tweens in einer Timeline vorspulen: Die Timeline setzt sie im nächsten Tick zurück (gemessen
  2026-10-26, 43,9 statt 100).
- Jeder Baustein prüft `bewegungErlaubt()` zusätzlich in seinem `mm.add(BEWEGUNG, …)`, sonst tritt nach einem Seitenwechsel die neue Seite trotz Schalter auf
  (gemessen 2026-10-26)

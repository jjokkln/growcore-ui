#!/usr/bin/env node
/**
 * growcore-pruefung — die Regeln, die jedes GrowCore-Projekt einhält, als Code.
 *
 *   node pruefe.mjs [repo-pfad]          # Standard: aktuelles Verzeichnis
 *   node pruefe.mjs . --live             # vor dem Livegang: Platzhalter sind Fehler
 *   node pruefe.mjs . --typ=app          # website | app | werkzeug; sonst geraten: Anmeldung → app
 *   node pruefe.mjs . --json             # Maschinenform
 *
 * Läuft ohne Abhängigkeiten und ohne Build, in unter einer Sekunde. Lokal vor
 * jedem Push und zentral in GitHub Actions (`.github/workflows/pruefung.yml`).
 * Was hier steht, muss niemand mehr lesen, um es einzuhalten.
 *
 * Typ und Ausnahmen (immer mit Grund) in `.growcore-pruefung.json` im Projekt:
 *   { "typ": "website", "aus": { "barrierefreiheit": "reines Intranet, kein Verbraucherangebot" } }
 * Ohne `typ` wird geraten (Anmeldung im Code → app), und eine Website mit
 * Admin-Bereich gilt dann fälschlich als App.
 *
 * Exit 1 bei mindestens einem Fehler. Hinweise färben nichts rot.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, basename, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const flag = (name) => {
  const t = args.find((a) => a.startsWith(`--${name}=`));
  return t ? t.slice(name.length + 3) : args.includes(`--${name}`);
};
const WURZEL = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const LIVE = Boolean(flag("live"));
const ALS_JSON = Boolean(flag("json"));

const AUSLASSEN = new Set([
  "node_modules", ".next", ".git", "dist", "out", "build", ".vercel", ".turbo",
  "coverage", "context", "docs", ".claude", "handbuch", "supabase",
]);
const CODE_ENDUNG = /\.(tsx?|jsx?|mjs|cjs|css|html)$/;
/** Nur was ausgeliefert wird. Design-Übergaben, Skripte und Werkzeugordner zählen nicht. */
const AUSLIEFERUNG = ["src", "app", "components", "lib", "pages", "public", "content", "styles", "hooks", "utils", "apps", "packages"];
const NIE = /\.dc\.html$|\.(test|spec|stories)\.[jt]sx?$/;
const TEST_DATEI = /(\.test\.|\.spec\.|__tests__|\/tests?\/|\/e2e\/)/;

/** Alle Code-Dateien des Projekts, einmal gelesen. */
function dateienLesen(ordner, liste = []) {
  for (const name of readdirSync(ordner)) {
    if (AUSLASSEN.has(name) || name.startsWith(".")) continue;
    const pfad = join(ordner, name);
    const info = statSync(pfad);
    if (info.isDirectory()) dateienLesen(pfad, liste);
    else if (CODE_ENDUNG.test(name) && !NIE.test(name) && info.size < 400_000) {
      const roh = readFileSync(pfad, "utf8");
      liste.push({ pfad: relative(WURZEL, pfad), roh, text: ohneKommentare(roh) });
    }
  }
  return liste;
}

/** Kommentare zählen nicht: Wer im Kommentar erklärt, warum kein CDN, verstößt nicht. */
function ohneKommentare(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(^|[\s;{}(,])\/\/.*$/gm, "$1");
}

if (!existsSync(join(WURZEL, "package.json"))) {
  console.error(`✖ ${WURZEL} hat keine package.json, ist das ein Projekt?`);
  process.exit(2);
}
const paket = JSON.parse(readFileSync(join(WURZEL, "package.json"), "utf8"));
const abhaengig = { ...paket.dependencies, ...paket.devDependencies };
const ordner = AUSLIEFERUNG.filter((o) => existsSync(join(WURZEL, o)));
const dateien = ordner.length
  ? ordner.flatMap((o) => dateienLesen(join(WURZEL, o))).concat(
      readdirSync(WURZEL)
        .filter((n) => /^(middleware|proxy|instrumentation)\.[jt]s$/.test(n))
        .map((n) => {
          const roh = readFileSync(join(WURZEL, n), "utf8");
          return { pfad: n, roh, text: ohneKommentare(roh) };
        })
    )
  : dateienLesen(WURZEL);
const code = dateien.filter((d) => !TEST_DATEI.test(`/${d.pfad}`));
const projekt = existsSync(join(WURZEL, ".growcore-pruefung.json"))
  ? JSON.parse(readFileSync(join(WURZEL, ".growcore-pruefung.json"), "utf8"))
  : {};
const ausnahmen = projekt.aus ?? {};

const mitAnmeldung = code.some((d) =>
  /auth\.(signInWith|getUser|getClaims)|signInWithPassword|signInWithOtp|next-auth|better-auth/.test(d.text)
);
const TYP = flag("typ") || projekt.typ || (mitAnmeldung ? "app" : "website");

const treffer = (muster, liste = code) => liste.filter((d) => muster.test(d.text));
const seite = (segment) =>
  dateien.some((d) => new RegExp(`(^|/)${segment}/page\\.(tsx|jsx|ts|js|mdx)$`).test(d.pfad)) ||
  dateien.some((d) => new RegExp(`(^|/)${segment}\\.html$`).test(d.pfad));
const zeige = (liste, n = 3) =>
  liste.slice(0, n).map((d) => d.pfad).join(", ") + (liste.length > n ? ` (+${liste.length - n})` : "");

/**
 * Jede Prüfung: id, Stufe (fehler | hinweis), Kurztext, gilt für welche Typen,
 * und eine Funktion, die bei Verstoß den Befund liefert, sonst null.
 */
const PRUEFUNGEN = [
  {
    id: "agents", stufe: "fehler", gilt: ["website", "app", "werkzeug"],
    text: "AGENTS.md mit Pflichtkern",
    test: () => (existsSync(join(WURZEL, "AGENTS.md")) ? null : "AGENTS.md fehlt"),
  },
  {
    id: "impressum", stufe: "fehler", gilt: ["website", "app", "werkzeug"],
    text: "Seite /impressum",
    test: () => (seite("impressum") ? null : "keine Seite …/impressum/page.tsx"),
  },
  {
    id: "datenschutz", stufe: "fehler", gilt: ["website", "app", "werkzeug"],
    text: "Seite /datenschutz",
    test: () => (seite("datenschutz") ? null : "keine Seite …/datenschutz/page.tsx"),
  },
  {
    id: "barrierefreiheit", stufe: "fehler", gilt: ["website", "app"],
    text: "Seite /barrierefreiheit (BFSG)",
    test: () => (seite("barrierefreiheit") ? null : "keine Seite …/barrierefreiheit/page.tsx"),
  },
  {
    id: "sprache", stufe: "fehler", gilt: ["website", "app", "werkzeug"],
    text: '<html lang="de"> (mehrsprachig: lang={locale})',
    test: () => {
      const ohne = treffer(/<html[\s>]/).filter((d) => !/<html[^>]*\blang=(\{?["'`]de|\{\s*[a-zA-Z_])/.test(d.text));
      return ohne.length ? `<html> ohne lang="de" in ${zeige(ohne)}` : null;
    },
  },
  {
    id: "schriften-lokal", stufe: "fehler", gilt: ["website", "app"],
    text: "Schriften lokal, kein Google-Fonts-CDN",
    test: () => {
      const t = treffer(/fonts\.(googleapis|gstatic)\.com/);
      return t.length ? `Google-Fonts-CDN in ${zeige(t)}, next/font oder lokale Dateien nehmen` : null;
    },
  },
  {
    id: "env-im-git", stufe: "fehler", gilt: ["website", "app", "werkzeug"],
    text: "keine .env-Datei im Repo",
    test: () => {
      let liste = "";
      try {
        liste = execFileSync("git", ["ls-files"], { cwd: WURZEL, encoding: "utf8" });
      } catch {
        return null; // kein Git-Repo, nichts zu prüfen
      }
      const env = liste.split("\n").filter((p) => /(^|\/)\.env(\.[\w-]+)?$/.test(p) && !/example|sample|vorlage/i.test(p));
      return env.length ? `eingecheckt: ${env.join(", ")}` : null;
    },
  },
  {
    id: "service-role", stufe: "fehler", gilt: ["website", "app", "werkzeug"],
    text: "Service-Role-Schlüssel nie im Browser",
    test: () => {
      const t = code.filter(
        (d) => /^\s*["']use client["']/m.test(d.text) && /SERVICE_ROLE|service_role|createAdminClient|supabaseAdmin/.test(d.text)
      );
      const offen = treffer(/NEXT_PUBLIC_[A-Z_]*SERVICE_ROLE/);
      const alle = [...new Set([...t, ...offen])];
      return alle.length ? `in Client-Code: ${zeige(alle)}` : null;
    },
  },
  {
    id: "tracker-consent", stufe: "fehler", gilt: ["website", "app"],
    text: "Tracking nur mit Einwilligung",
    test: () => {
      const tracker = treffer(/googletagmanager\.com|gtag\(|connect\.facebook\.net|fbq\(|hotjar\.com|clarity\.ms|linkedin\.com\/insight|plausible\.io\/js/);
      if (!tracker.length) return null;
      const consent = treffer(/consent|Consent|einwilligung|Einwilligung/);
      return consent.length ? null : `Tracker ohne Consent-Gate in ${zeige(tracker)}`;
    },
  },
  {
    id: "seo-dateien", stufe: "fehler", gilt: ["website"],
    text: "robots und sitemap",
    test: () => {
      const robots = dateien.some((d) => /(^|\/)app\/robots\.(ts|js)$/.test(d.pfad)) || existsSync(join(WURZEL, "public/robots.txt"));
      const sitemap = dateien.some((d) => /(^|\/)app\/sitemap\.(ts|js)$/.test(d.pfad)) || existsSync(join(WURZEL, "public/sitemap.xml"));
      const fehlt = [!robots && "robots", !sitemap && "sitemap"].filter(Boolean);
      return fehlt.length ? `fehlt: ${fehlt.join(", ")}` : null;
    },
  },
  {
    id: "metadata-base", stufe: "hinweis", gilt: ["website"],
    text: "metadataBase gesetzt (OG-Bilder, Canonical)",
    test: () => (treffer(/metadataBase/).length || !abhaengig.next ? null : "metadataBase fehlt im Layout"),
  },
  {
    id: "region", stufe: "hinweis", gilt: ["website", "app"],
    text: "Server-Funktionen in fra1",
    test: () => {
      if (!abhaengig["@supabase/supabase-js"] && !abhaengig["@supabase/ssr"]) return null;
      const vercel = join(WURZEL, "vercel.json");
      const inhalt = existsSync(vercel) ? readFileSync(vercel, "utf8") : "";
      return /fra1/.test(inhalt) || treffer(/preferredRegion\s*=\s*["'`]fra1/).length
        ? null
        : 'vercel.json ohne "regions": ["fra1"]';
    },
  },
  {
    id: "platzhalter", stufe: LIVE ? "fehler" : "hinweis", gilt: ["website", "app", "werkzeug"],
    text: "keine Platzhalter im sichtbaren Text",
    test: () => {
      // Eingabe-Platzhalter wie placeholder="name@example.com" sind gewollt.
      const sichtbar = code.map((d) => ({ ...d, text: d.text.replace(/placeholder=\{?["'`][^"'`]*["'`]/g, "") }));
      const t = treffer(/Lorem ipsum|Musterstra(ß|ss)e|Max Mustermann|Erika Mustermann|@example\.(com|de)|0123[ /-]?456/, sichtbar);
      return t.length ? `${t.length} Datei(en): ${zeige(t)}` : null;
    },
  },
  {
    id: "bild-alt", stufe: "hinweis", gilt: ["website", "app"],
    text: "Bilder mit alt",
    test: () => {
      const t = code.filter((d) => /\.(tsx|jsx|html)$/.test(d.pfad) && /<(img|Image)\s(?![^>]*\b(alt=|\{\.\.\.))[^>]*>/s.test(d.text));
      return t.length ? `<img>/<Image> ohne alt in ${zeige(t)}` : null;
    },
  },
];

const ergebnisse = [];
for (const p of PRUEFUNGEN) {
  if (!p.gilt.includes(TYP)) continue;
  if (ausnahmen[p.id]) {
    ergebnisse.push({ id: p.id, stufe: "aus", text: p.text, befund: ausnahmen[p.id] });
    continue;
  }
  const befund = p.test();
  ergebnisse.push({ id: p.id, stufe: befund ? p.stufe : "ok", text: p.text, befund });
}

const fehler = ergebnisse.filter((e) => e.stufe === "fehler");
const hinweise = ergebnisse.filter((e) => e.stufe === "hinweis");

if (ALS_JSON) {
  console.log(JSON.stringify({ projekt: basename(WURZEL), typ: TYP, live: LIVE, ergebnisse }, null, 2));
} else {
  console.log(`growcore-pruefung · ${paket.name ?? basename(WURZEL)} (${TYP}${LIVE ? ", live" : ""})`);
  for (const e of fehler) console.log(`  ✖ ${e.id}: ${e.befund}`);
  for (const e of hinweise) console.log(`  ⚠ ${e.id}: ${e.befund}`);
  for (const e of ergebnisse.filter((x) => x.stufe === "aus")) console.log(`  – ${e.id} aus: ${e.befund}`);
  const ok = ergebnisse.filter((e) => e.stufe === "ok").length;
  console.log(`  ${fehler.length ? "✖" : "✓"} ${ok}/${ergebnisse.length} bestanden, ${fehler.length} Fehler, ${hinweise.length} Hinweise`);
}
process.exit(fehler.length ? 1 : 0);

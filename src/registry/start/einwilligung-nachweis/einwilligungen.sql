-- Nachweis erteilter, abgelehnter und widerrufener Einwilligungen (Art. 7 Abs. 1 DSGVO,
-- Pflichtkern 12 Fall 3). Geschrieben wird ausschließlich über die Server-Action
-- einwilligungNachweisen mit dem Secret-Key. anon und authenticated haben KEINE Rechte:
-- weder lesen noch schreiben. Eine öffentliche INSERT-Policy könnte created_at rückdatieren
-- (supabase-sicherheit 18), deshalb gibt es keine.
--
-- Nicht gespeichert: IP-Adresse, User-Agent, URL. Ein Protokoll über Menschen ist selbst eine
-- Verarbeitung und bekommt nur die Felder, die es braucht.
--
-- Nach dem Anwenden: get_advisors(security) laufen lassen und in der Datenschutzerklärung den
-- Abschnitt „Nachweis Ihrer Einwilligung“ einschalten (Zweck und 36 Monate Aufbewahrung).

create table if not exists public.einwilligungen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- erteilt = mindestens eine Kategorie angenommen, abgelehnt = nur das Notwendige,
  -- widerrufen = eine frühere Einwilligung zurückgenommen (Art. 7 Abs. 3, eigener Vorgang).
  entscheidung text not null check (entscheidung in ('erteilt', 'abgelehnt', 'widerrufen')),

  -- Welche Fassung des Banners gezeigt wurde. Ohne sie ist nicht belegbar, WORIN eingewilligt
  -- wurde (Art. 4 Nr. 11 DSGVO: „für den bestimmten Fall“).
  banner_version integer not null check (banner_version > 0),

  -- Version plus die genannten Empfänger je Kategorie, z. B. '1:externeMedien=YouTube'.
  stand text not null check (char_length(stand) between 1 and 1000),

  -- Die gespeicherte Auswahl, z. B. {"externeMedien": true, "statistik": false}.
  kategorien jsonb not null check (jsonb_typeof(kategorien) = 'object'),

  -- Zufallszahl aus dem Browser (32 Hex-Zeichen), kein Personenbezug.
  besucher_kennung text not null check (besucher_kennung ~ '^[a-f0-9]{32}$')
);

comment on table public.einwilligungen is
  'Nachweis nach Art. 7 Abs. 1 DSGVO. Ohne IP, ohne User-Agent, ohne URL. '
  'Schreiben nur über die Server-Action (Secret-Key). Aufbewahrung 36 Monate.';

create index if not exists einwilligungen_created_at_idx
  on public.einwilligungen (created_at desc);
create index if not exists einwilligungen_kennung_idx
  on public.einwilligungen (besucher_kennung, created_at desc);

alter table public.einwilligungen enable row level security;

-- Keine Policy für anon und authenticated: RLS ohne Policy heißt „nichts“. Zusätzlich die
-- Tabellenrechte entziehen, die Supabase beim Anlegen vergibt (grant all … to anon). Der
-- Secret-Key (service_role) umgeht RLS und braucht keine Policy.
revoke all on table public.einwilligungen from anon, authenticated;

-- ── Aufbewahrung ───────────────────────────────────────────────────────────
-- 36 Monate: so lange, wie aus der Einwilligung Ansprüche entstehen können (regelmäßige
-- Verjährung § 195 BGB plus Puffer). Danach ist der Nachweis nutzlos und damit unzulässig.
-- Im eigenen Schema, damit PostgREST die Funktion nicht als /rest/v1/rpc anbietet.

create schema if not exists private;
revoke all on schema private from public;

create or replace function private.einwilligungen_aufraeumen()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  v_anzahl integer;
begin
  delete from public.einwilligungen where created_at < now() - interval '36 months';
  get diagnostics v_anzahl = row_count;
  return v_anzahl;
end;
$$;

revoke execute on function private.einwilligungen_aufraeumen() from public, anon, authenticated;

-- Täglich aufräumen, wenn pg_cron aktiv ist (Dashboard: Integrations, Cron). Sonst einmal im
-- Monat von Hand: select private.einwilligungen_aufraeumen();
-- select cron.schedule('einwilligungen-aufraeumen', '17 3 * * *', 'select private.einwilligungen_aufraeumen()');

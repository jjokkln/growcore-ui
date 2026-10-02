-- =============================================================================
-- LEADS: Anfragen aus dem Kontaktformular (Pflichtkern 8 und 12)
--
-- Die Zeile ist der Nachweis der Anfrage: Zeitpunkt, Inhalt und was daraus
-- folgte (`benachrichtigt_am`). Eine Mail ist kein Nachweis.
--
-- Zugriff: anon und authenticated haben KEINE Rechte (Regel supabase-sicherheit
-- 2 und 18). Geschrieben wird nur von der Server Action mit dem geheimen
-- Schlüssel (service_role, umgeht RLS). Eine öffentliche INSERT-Policy würde
-- jedem mit dem öffentlichen Schlüssel erlauben, an der Action vorbei Zeilen
-- und Felder wie `status` zu setzen, ohne Rate-Limit und ohne Benachrichtigung.
--
-- Lesen für eine Verwaltungsoberfläche: je Projekt eine SELECT-/UPDATE-Policy
-- für die Admin-Rolle ergänzen, Helfer in `(select …)` gewrappt.
--
-- Dazu die Anfrage-Bremse: ein Zähler je Quelle (HMAC der IP, nie die IP
-- selbst), Zeilen leben höchstens einen Tag. Gehört mit in die
-- Datenschutzerklärung (berechtigtes Interesse, Missbrauchsschutz).
--
-- Längengrenzen = LEAD_GRENZEN in src/lib/lead/schema.ts. Wer eine ändert,
-- ändert beide.
-- =============================================================================

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  eingegangen_am timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text check (email is null or char_length(email) <= 160),
  telefon text check (telefon is null or char_length(telefon) <= 40),
  nachricht text not null check (char_length(nachricht) between 1 and 3000),
  -- Pfad der Seite, von der die Anfrage kam.
  quelle text check (quelle is null or char_length(quelle) <= 200),
  status text not null default 'neu'
    check (status in ('neu', 'in_bearbeitung', 'erledigt', 'spam')),
  -- Wann die Benachrichtigung an den Kunden raus ist. NULL heißt: Mail fehlgeschlagen
  -- oder nicht eingerichtet. Danach suchen, nicht im Postfach.
  benachrichtigt_am timestamptz,
  constraint leads_rueckweg check (email is not null or telefon is not null)
);

comment on table public.leads is
  'Anfragen aus dem Kontaktformular. Schreiben nur serverseitig mit service_role.';

create index leads_eingegangen_am_idx on public.leads (eingegangen_am desc);

alter table public.leads enable row level security;

-- Keine Policy: anon und authenticated sehen nichts und schreiben nichts.
revoke all on table public.leads from anon, authenticated;
grant select, insert, update on table public.leads to service_role;

-- -----------------------------------------------------------------------------
-- Anfrage-Bremse (Rate-Limit in der Datenbank statt im Speicher einer Instanz)
-- -----------------------------------------------------------------------------

create table public.anfrage_bremse (
  schluessel text primary key check (char_length(schluessel) <= 100),
  fenster_beginn timestamptz not null default now(),
  anzahl integer not null default 1
);

comment on table public.anfrage_bremse is
  'Zähler je Quelle für öffentliche Formulare. Kein Personenbezug im Klartext, Zeilen leben höchstens einen Tag.';

create index anfrage_bremse_fenster_idx on public.anfrage_bremse (fenster_beginn);

alter table public.anfrage_bremse enable row level security;
revoke all on table public.anfrage_bremse from anon, authenticated;
grant select, insert, update, delete on table public.anfrage_bremse to service_role;

-- Zählt einen Zugriff und meldet, ob die Quelle im Fenster noch darf. Atomar über
-- insert … on conflict, also auch bei parallelen Anfragen genau.
create function public.anfrage_zaehlen(
  p_schluessel text,
  p_grenze integer,
  p_fenster_sekunden integer
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_anzahl integer;
begin
  insert into public.anfrage_bremse as b (schluessel, fenster_beginn, anzahl)
  values (p_schluessel, now(), 1)
  on conflict (schluessel) do update
    set anzahl = case
          when b.fenster_beginn < now() - make_interval(secs => p_fenster_sekunden) then 1
          else b.anzahl + 1
        end,
        fenster_beginn = case
          when b.fenster_beginn < now() - make_interval(secs => p_fenster_sekunden) then now()
          else b.fenster_beginn
        end
  returning anzahl into v_anzahl;

  -- Abgelaufene Fenster gelegentlich wegräumen statt bei jedem Aufruf.
  if random() < 0.05 then
    delete from public.anfrage_bremse where fenster_beginn < now() - interval '1 day';
  end if;

  return v_anzahl <= p_grenze;
end;
$$;

-- PUBLIC hat sonst EXECUTE auf jede neue Funktion, anon steckt darin (Regel supabase-sicherheit 15).
revoke execute on function public.anfrage_zaehlen(text, integer, integer) from public, anon, authenticated;
grant execute on function public.anfrage_zaehlen(text, integer, integer) to service_role;

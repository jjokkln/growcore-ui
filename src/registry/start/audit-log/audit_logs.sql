-- =============================================================================
-- AUDIT-LOG (Pflichtkern 12)
--
-- Wer hat wann was geändert, und wem ist es passiert. Geschrieben wird nur
-- serverseitig über `logAudit()` (src/lib/audit/protokoll.ts) mit dem geheimen
-- Schlüssel (Rolle service_role). Über die REST-API mit einer Nutzersitzung ist
-- die Tabelle weder les- noch schreibbar.
--
-- Drei Eigenschaften:
--   * `betroffener_id` ist ein echter Fremdschlüssel, kein Name im JSONB. Bei
--     zwei Personen gleichen Namens wäre ein Name keine Zuordnung, und an diesem
--     Feld hängt später, wer seine eigene Historie sehen darf.
--   * Nur anhängen: Ein Trigger lehnt UPDATE und DELETE ab. Einzige Ausnahme:
--     Wird eine Person gelöscht, fallen ihre Ids auf NULL (on delete set null),
--     der Eintrag selbst bleibt.
--   * Keine Rechte für anon und authenticated, auch kein TRUNCATE (ein
--     Zeilentrigger feuert bei TRUNCATE nicht).
--
-- Lesen für eine Verwaltungsoberfläche: je Projekt eine SELECT-Policy für die
-- Admin-Rolle ergänzen, Helfer in `(select …)` gewrappt (Regel rls-performance).
-- Den eigenen Verlauf für Betroffene nie über eine aufgeweichte Tabellen-Policy,
-- sondern über eine security-definer-Funktion mit Positivliste der Aktionen und
-- Felder (Regel supabase-sicherheit 16).
--
-- Das Protokoll ist selbst eine Verarbeitung: Zweck und Aufbewahrungsfrist
-- gehören in die Datenschutzerklärung, `details` bekommt nur, was es braucht.
-- =============================================================================

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  erstellt_am timestamptz not null default now(),
  aktion text not null check (char_length(aktion) between 1 and 80),
  entitaet text not null check (char_length(entitaet) between 1 and 80),
  entitaet_id text check (entitaet_id is null or char_length(entitaet_id) <= 200),
  -- Wer gehandelt hat. NULL nur bei Systemvorgängen oder wenn die Person gelöscht wurde.
  handelnder_id uuid references auth.users (id) on delete set null,
  -- Wem es passiert ist. Pflicht für Personen-Entitäten, erzwungen im TypeScript-Typ.
  betroffener_id uuid references auth.users (id) on delete set null,
  details jsonb
);

comment on table public.audit_logs is
  'Audit-Log, nur anhängen. Geschrieben über logAudit() mit service_role.';

create index audit_logs_erstellt_am_idx on public.audit_logs (erstellt_am desc);
create index audit_logs_betroffener_idx on public.audit_logs (betroffener_id)
  where betroffener_id is not null;
-- Für on delete set null: ohne Index liest das Löschen einer Person die ganze Tabelle.
create index audit_logs_handelnder_idx on public.audit_logs (handelnder_id)
  where handelnder_id is not null;

alter table public.audit_logs enable row level security;

-- Keine Policy: anon und authenticated sehen nichts und schreiben nichts.
revoke all on table public.audit_logs from anon, authenticated;
-- service_role (logAudit) darf lesen und anhängen, sonst nichts. Supabase vergibt ihr per Vorgabe
-- alle Rechte; ohne den Entzug könnte Server-Code den Handelnden einer Zeile auf NULL setzen
-- (die Ausnahme des Triggers unten). on delete set null läuft trotzdem: Referenzaktionen laufen
-- mit den Rechten des Tabelleneigentümers.
revoke update, delete, truncate on table public.audit_logs from service_role;
grant select, insert on table public.audit_logs to service_role;

-- Nur anhängen. UPDATE ist nur erlaubt, wenn sich ausschließlich
-- handelnder_id/betroffener_id ändern und dabei auf NULL fallen (Löschen einer Person).
create function public.audit_logs_nur_anhaengen()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'audit_logs: Einträge werden nicht gelöscht'
      using errcode = '42501';
  end if;

  if (new.id, new.erstellt_am, new.aktion, new.entitaet, new.entitaet_id, new.details)
       is distinct from
     (old.id, old.erstellt_am, old.aktion, old.entitaet, old.entitaet_id, old.details)
     or (new.handelnder_id is distinct from old.handelnder_id and new.handelnder_id is not null)
     or (new.betroffener_id is distinct from old.betroffener_id and new.betroffener_id is not null)
  then
    raise exception 'audit_logs: Einträge werden nicht geändert'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke execute on function public.audit_logs_nur_anhaengen() from public, anon, authenticated;

create trigger audit_logs_nur_anhaengen
  before update or delete on public.audit_logs
  for each row execute function public.audit_logs_nur_anhaengen();

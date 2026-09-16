-- ============================================================================
-- Site hit tracking + Supabase keep-alive cron
--
-- Run this ONCE in the Supabase SQL Editor (Project > SQL Editor > New query).
-- It creates:
--   1. site_hits           table logging real visits and keep-alive pings
--   2. RLS policies         public can log a visit; only admins can read rows
--   3. get_hit_totals()     public RPC returning aggregate counts (footer)
--   4. a pg_cron job        pings the project 5x/day so the free tier never pauses
--
-- Step 4 needs your service_role key stored in Vault first — see the note
-- above that section before running it.
-- ============================================================================

-- 1. Table -------------------------------------------------------------------

create table if not exists public.site_hits (
    id bigint generated always as identity primary key,
    type text not null check (type in ('visit', 'ping')),
    path text,
    created_at timestamptz not null default now()
);

create index if not exists site_hits_created_at_idx on public.site_hits (created_at desc);
create index if not exists site_hits_type_idx on public.site_hits (type);

-- 2. Row Level Security -------------------------------------------------------

alter table public.site_hits enable row level security;

-- The public site (anon key) may log a visit, and only a visit — it can never
-- insert type = 'ping', so visitors can't fake keep-alive pings or inflate them.
drop policy if exists "public can insert visits" on public.site_hits;
create policy "public can insert visits"
    on public.site_hits for insert
    to anon
    with check (type = 'visit');

-- Only the logged-in dashboard admin can read raw rows.
drop policy if exists "authenticated can read hits" on public.site_hits;
create policy "authenticated can read hits"
    on public.site_hits for select
    to authenticated
    using (true);

-- Ping rows are inserted by the cron job below using the service_role key,
-- which bypasses RLS entirely — no insert policy is needed (or wanted) for it.

-- 3. Public RPC for the footer counter ---------------------------------------
-- Exposes only aggregate totals to anon visitors — never the raw rows.

create or replace function public.get_hit_totals()
returns json
language sql
security definer
set search_path = public
as $$
    select json_build_object(
        'visits', count(*) filter (where type = 'visit'),
        'pings', count(*) filter (where type = 'ping'),
        'total', count(*)
    )
    from public.site_hits;
$$;

grant execute on function public.get_hit_totals() to anon, authenticated;

-- 4. Keep-alive cron -----------------------------------------------------------
-- Runs entirely inside Supabase (pg_cron + pg_net) — independent of GitHub,
-- Vercel, or how often you commit to the repo. It makes a real HTTP request to
-- your own REST API 5x/day, which counts as genuine project activity.
--
-- BEFORE running this section:
--   Project Settings > Vault > New secret
--     name:  service_role_key
--     value: <your service_role key, from Project Settings > API>
--   (Never put the service_role key in client-side code — Vault + this cron
--   job is the only place it should live.)

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
    'keep-alive-ping',
    '0 0,5,10,15,20 * * *',  -- 5x/day, UTC
    $$
    select net.http_post(
        url := 'https://ehulysecnfbmcxgjinsp.supabase.co/rest/v1/site_hits',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'apikey', (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key'),
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')
        ),
        body := jsonb_build_object('type', 'ping', 'path', 'cron')
    );
    $$
);

-- To verify it's scheduled:
--   select * from cron.job;
-- To test it immediately without waiting for the schedule:
--   select net.http_post(url := 'https://ehulysecnfbmcxgjinsp.supabase.co/rest/v1/site_hits', headers := jsonb_build_object('Content-Type','application/json','apikey',(select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key'),'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')), body := jsonb_build_object('type','ping','path','manual-test'));
--   then: select * from site_hits order by created_at desc limit 5;
-- To remove the job later:
--   select cron.unschedule('keep-alive-ping');

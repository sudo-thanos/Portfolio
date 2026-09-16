-- ============================================================================
-- Split projects into client work and personal work
--
-- Run this ONCE in the Supabase SQL Editor (Project > SQL Editor > New query).
-- It is idempotent — re-running it is harmless.
--
-- Everything that existed before this ran was client work, which is exactly
-- what the DEFAULT gives the backfill: no manual data fix-up needed.
-- ============================================================================

alter table public.projects
    add column if not exists project_type text not null default 'client';

-- Reject anything the app doesn't know how to render, rather than letting a
-- typo silently drop a project out of both sections on the public page.
alter table public.projects
    drop constraint if exists projects_project_type_check;

alter table public.projects
    add constraint projects_project_type_check
    check (project_type in ('client', 'personal'));

-- The public page reads every project and groups them in memory, but the
-- dashboard and any future per-kind query benefit from this.
create index if not exists projects_project_type_idx
    on public.projects (project_type, sort_order);

-- Verify:
--   select project_type, count(*) from public.projects group by project_type;

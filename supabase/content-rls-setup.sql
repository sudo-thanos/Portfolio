-- ============================================================================
-- Row Level Security for the content tables + storage buckets
--
-- Run this ONCE in the Supabase SQL Editor. It is idempotent.
--
-- The site talks to Supabase directly with the anon key, which ships to every
-- visitor's browser. So "only the admin may write" cannot be enforced in the
-- app — it has to be a database rule. That is what this file is.
--
-- The shape is the same for every content table:
--   anon + authenticated  -> SELECT   (the public site reads these)
--   authenticated only    -> INSERT / UPDATE / DELETE  (the dashboard)
--
-- "authenticated" means a real Supabase Auth session. Create the single admin
-- user under Authentication > Users, and leave sign-ups disabled
-- (Authentication > Providers > Email > "Allow new users to sign up" = off) so
-- nobody can mint themselves a writing account.
-- ============================================================================

do $$
declare
    t text;
begin
    foreach t in array array['projects', 'skills', 'work_history', 'social_links', 'resumes']
    loop
        execute format('alter table public.%I enable row level security', t);

        execute format('drop policy if exists "public can read" on public.%I', t);
        execute format(
            'create policy "public can read" on public.%I for select to anon, authenticated using (true)',
            t
        );

        execute format('drop policy if exists "admin can write" on public.%I', t);
        execute format(
            'create policy "admin can write" on public.%I for all to authenticated using (true) with check (true)',
            t
        );
    end loop;
end $$;

-- site_hits is deliberately NOT in that list: visitors may insert a 'visit' row
-- but must never read the raw log. Those policies live in site-hits-setup.sql.

-- ---------------------------------------------------------------------------
-- Storage
--
-- Both buckets are public-read (the site serves thumbnails and the CV straight
-- from them) but writable only by the signed-in admin.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true), ('resumes', 'resumes', true)
on conflict (id) do update set public = true;

drop policy if exists "public can read site assets" on storage.objects;
create policy "public can read site assets"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id in ('project-images', 'resumes'));

drop policy if exists "admin can write site assets" on storage.objects;
create policy "admin can write site assets"
    on storage.objects for all
    to authenticated
    using (bucket_id in ('project-images', 'resumes'))
    with check (bucket_id in ('project-images', 'resumes'));

-- Verify:
--   select tablename, policyname, roles, cmd from pg_policies
--   where schemaname in ('public', 'storage') order by tablename, policyname;

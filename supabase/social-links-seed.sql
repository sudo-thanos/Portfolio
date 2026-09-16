-- ============================================================================
-- Seed the social_links table
--
-- OPTIONAL — run this in the Supabase SQL Editor only if you'd rather not type
-- these into the dashboard by hand.
--
-- Why this exists: the home page used to hardcode these links. It now reads
-- them from social_links (they also feed the Person structured data as
-- `sameAs`, which is how Google ties the site to those profiles) — but the
-- table was created and never populated, so the "Find me on" block renders
-- empty until there are rows.
--
-- Idempotent on `slug`, so re-running it updates rather than duplicates.
-- ============================================================================

create unique index if not exists social_links_slug_key
    on public.social_links (slug);

insert into public.social_links (platform, slug, url, sort_order)
values
    ('GitHub',   'github',   'https://github.com/sudo-thanos',            0),
    ('Linkedin', 'linkedin', 'https://www.linkedin.com/in/udechukwudc/',  1)
    -- Was commented out on the old hardcoded home page; uncomment to show it.
    -- , ('Twitter', 'x', 'https://x.com/ChumaUdechukwu', 2)
on conflict (slug) do update
    set platform   = excluded.platform,
        url        = excluded.url,
        sort_order = excluded.sort_order;

-- Verify:
--   select platform, slug, url, sort_order from public.social_links order by sort_order;

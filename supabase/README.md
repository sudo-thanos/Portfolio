# Supabase setup

The site talks to Supabase directly — from the server for the public pages
(Server Components, sitemap, metadata) and from the browser for the dashboard.
There is no backend service in between, so **everything that protects the data
is a database rule**, not app code.

## Run these once, in order

| # | File | What it does |
|---|------|--------------|
| 1 | `content-rls-setup.sql` | RLS on the content tables + the two storage buckets: public read, admin-only writes. |
| 2 | `site-hits-setup.sql` | The `site_hits` table, its policies, the `get_hit_totals()` RPC the footer counter calls, and the pg_cron keep-alive that stops the free tier pausing. |
| 3 | `project-type-setup.sql` | Adds `projects.project_type` and splits the projects page into client and personal work. |
| 4 | `social-links-seed.sql` | Optional. Fills `social_links`, which the home page and the Person structured data read. |

Each file is idempotent — re-running one is harmless.

## The admin user

The dashboard authenticates against Supabase Auth. Create the single admin under
**Authentication > Users > Add user**, then turn sign-ups **off** under
**Authentication > Providers > Email** so nobody can mint themselves an account
that the `authenticated` write policies would then trust.

## Environment

Copy `.env.example` to `.env.local` and fill in the project URL and anon key from
**Settings > API**. The anon key is public by design — it ships to every
visitor's browser. That is fine, and is exactly why step 1 is not optional.

-- =====================================================================
--  I'M HERE — Official Short Film  |  Supabase schema + RLS + Storage
--  Run this entire file in: Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ADMINS TABLE
--    Lists the user ids allowed to edit the site. A row here = admin.
--    Membership is NEVER supplied by the browser; it is checked server
--    side by RLS policies below using auth.uid().
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- An authenticated user may read ONLY their own admin row (used by the app
-- to confirm “am I an admin?”). They can never see or modify other rows.
drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- No insert/update/delete policies => the table is only manageable from the
-- Supabase dashboard / service role. Admins cannot grant admin to others
-- from the browser.

-- Helper: is the current user an admin? (SECURITY DEFINER bypasses RLS
-- recursion safely and is used by the content policies.)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- 2. CONTENT TABLE
--    Two singleton rows: 'published' (public) and 'draft' (admins only).
--    All editable site content is stored as JSONB in `data`.
-- ---------------------------------------------------------------------
create table if not exists public.content (
  id text primary key check (id in ('published', 'draft')),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.content enable row level security;

-- PUBLIC READ: anonymous + authenticated visitors may read ONLY the
-- published row. The private draft is never exposed to anonymous users.
drop policy if exists "public can read published" on public.content;
create policy "public can read published"
  on public.content for select
  to anon, authenticated
  using (id = 'published');

-- ADMIN READ DRAFT: admins may also read the draft row.
drop policy if exists "admins can read draft" on public.content;
create policy "admins can read draft"
  on public.content for select
  to authenticated
  using (id = 'draft' and public.is_admin());

-- ADMIN WRITE: only admins may insert/update/delete any content row.
drop policy if exists "admins can insert content" on public.content;
create policy "admins can insert content"
  on public.content for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins can update content" on public.content;
create policy "admins can update content"
  on public.content for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete content" on public.content;
create policy "admins can delete content"
  on public.content for delete
  to authenticated
  using (public.is_admin());

-- Seed empty rows so upserts/first load work smoothly.
insert into public.content (id, data) values ('published', '{}'::jsonb)
  on conflict (id) do nothing;
insert into public.content (id, data) values ('draft', '{}'::jsonb)
  on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3. STORAGE BUCKET  (posters, trailer, stills, cast photos, etc.)
--    Public READ so the website can display media; admin-only WRITE.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read of files in the media bucket.
drop policy if exists "public read media" on storage.objects;
create policy "public read media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Admin-only upload.
drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

-- Admin-only replace/update.
drop policy if exists "admins update media" on storage.objects;
create policy "admins update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- Admin-only delete.
drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- =====================================================================
--  CREATE THE FIRST ADMIN  (run AFTER creating the user in Auth)
--  1) Supabase Dashboard > Authentication > Users > Add user
--     (set an email + password; there is no public signup).
--  2) Copy that user's UUID, then run:
--
--     insert into public.admins (user_id)
--     values ('PASTE-THE-USER-UUID-HERE');
--
--  That account can now sign in at /admin. Repeat for additional admins.
-- =====================================================================

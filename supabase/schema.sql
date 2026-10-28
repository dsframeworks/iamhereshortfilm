-- I'M HERE: admin authorization allow-list for Supabase Auth.
-- Site content and media are managed in GitHub; no content or storage tables
-- are required by the current site.

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- No browser insert/update/delete policies. Manage allow-list rows only in the
-- Supabase Dashboard or through a trusted server-side process.

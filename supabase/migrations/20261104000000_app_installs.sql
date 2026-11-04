-- Home-screen installs of the Lampstand web app, one row per installed copy.
-- Written by /api/install (service role) when the app opens from the home
-- screen or Chrome reports an install; no device details beyond the platform.

create table public.app_installs (
  device_id        uuid primary key,
  user_id          uuid references auth.users (id) on delete set null,
  platform         text not null check (platform in ('ios', 'android', 'desktop', 'other')),
  installed_at     timestamptz not null default now(),
  first_launch_at  timestamptz,
  last_launch_at   timestamptz,
  launch_days      integer not null default 0
);

create index app_installs_user_idx on public.app_installs (user_id);
create index app_installs_installed_idx on public.app_installs (installed_at);

alter table public.app_installs enable row level security;

-- No policies: only the service role reads or writes.

-- Lampstand accounts + server-side Premium.
-- Run once in Supabase → SQL Editor (or `supabase db push`).
--
-- profiles       one row per auth user (created by trigger on sign-up)
-- subscriptions  mirror of Paddle subscriptions, written ONLY by the webhook (service role)
-- Premium = any subscription for the user with status active | trialing | past_due.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  username    text not null,
  newsletter  boolean not null default false,
  created_at  timestamptz not null default now(),
  constraint username_length check (char_length(username) between 3 and 24)
);

create unique index profiles_username_lower_idx on public.profiles (lower(username));
create index profiles_email_lower_idx on public.profiles (lower(email));

alter table public.profiles enable row level security;

create policy "Read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users may change only username/newsletter; email mirrors auth.users.
revoke update on public.profiles from authenticated;
grant update (username, newsletter) on public.profiles to authenticated;

-- Create the profile when an auth user is created. Username comes from sign-up
-- metadata; fall back to the email's local part plus a short suffix.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  wanted text := nullif(trim(new.raw_user_meta_data ->> 'username'), '');
begin
  if wanted is null
     or char_length(wanted) not between 3 and 24
     or exists (select 1 from public.profiles p where lower(p.username) = lower(wanted)) then
    wanted := left(split_part(new.email, '@', 1), 18) || '-' || substr(md5(new.id::text), 1, 5);
  end if;

  insert into public.profiles (id, email, username, newsletter)
  values (
    new.id,
    new.email,
    wanted,
    coalesce((new.raw_user_meta_data ->> 'newsletter')::boolean, false)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email in sync if the user changes their email.
create function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- Sign-up form check, callable before an account exists.
create function public.username_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.profiles where lower(username) = lower(trim(candidate))
  );
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- subscriptions (Paddle mirror)
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  paddle_subscription_id  text primary key,
  user_id                 uuid references auth.users (id) on delete set null,
  paddle_customer_id      text not null,
  status                  text not null
    check (status in ('active', 'trialing', 'past_due', 'paused', 'canceled')),
  price_id                text,
  current_period_end      timestamptz,
  scheduled_change        text,          -- e.g. 'cancel' when set to end at period end
  paddle_updated_at       timestamptz not null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index subscriptions_user_idx on public.subscriptions (user_id);

alter table public.subscriptions enable row level security;

create policy "Read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies: only the service role (webhook) writes.

-- ---------------------------------------------------------------------------
-- Webhook upsert. Paddle retries and may deliver out of order, so a write is
-- applied only when it is newer than what is stored.
-- ---------------------------------------------------------------------------
create function public.upsert_paddle_subscription(
  p_subscription_id text,
  p_user_id uuid,
  p_customer_id text,
  p_status text,
  p_price_id text,
  p_current_period_end timestamptz,
  p_scheduled_change text,
  p_paddle_updated_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  applied boolean;
begin
  insert into public.subscriptions as s (
    paddle_subscription_id, user_id, paddle_customer_id, status, price_id,
    current_period_end, scheduled_change, paddle_updated_at
  )
  values (
    p_subscription_id, p_user_id, p_customer_id, p_status, p_price_id,
    p_current_period_end, p_scheduled_change, p_paddle_updated_at
  )
  on conflict (paddle_subscription_id) do update
    set user_id            = coalesce(excluded.user_id, s.user_id),
        paddle_customer_id = excluded.paddle_customer_id,
        status             = excluded.status,
        price_id           = excluded.price_id,
        current_period_end = excluded.current_period_end,
        scheduled_change   = excluded.scheduled_change,
        paddle_updated_at  = excluded.paddle_updated_at,
        updated_at         = now()
    where s.paddle_updated_at <= excluded.paddle_updated_at
  returning true into applied;

  return coalesce(applied, false);
end;
$$;

revoke execute on function public.upsert_paddle_subscription(text, uuid, text, text, text, timestamptz, text, timestamptz)
  from public, anon, authenticated;

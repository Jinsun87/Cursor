-- Founding members: a one-time Paddle purchase that gives Premium for life.
-- Written by the Paddle webhook (service role) on transaction.completed;
-- marked refunded when a refund is approved.

create table public.lifetime_purchases (
  paddle_transaction_id  text primary key,
  user_id                uuid references auth.users (id) on delete set null,
  paddle_customer_id     text not null,
  price_id               text not null,
  status                 text not null default 'completed'
    check (status in ('completed', 'refunded')),
  purchased_at           timestamptz not null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index lifetime_purchases_user_idx on public.lifetime_purchases (user_id);

alter table public.lifetime_purchases enable row level security;

create policy "Read own lifetime purchases"
  on public.lifetime_purchases for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies: only the service role (webhook) writes.

-- How many founding spots are taken, for the live "spots left" count. Only a
-- number leaves the table, so anyone may call it.
create function public.founding_spots_taken()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.lifetime_purchases where status = 'completed';
$$;

revoke all on function public.founding_spots_taken() from public;
grant execute on function public.founding_spots_taken() to anon, authenticated;

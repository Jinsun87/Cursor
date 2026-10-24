-- Progress kept with the account, so it follows the reader across devices:
-- the lamp streak (seconds listened per day), the Walk/Sleep reading position
-- and the reading plan. The browser still keeps its own copy and works
-- offline; sync_progress() merges what a device sends and returns the
-- combined state. Each person can only ever read or write their own rows.

-- Seconds listened, per device per local day. A device reports only its own
-- seconds, so a day's total is the sum over devices and nothing is counted twice.
create table public.listening_days (
  user_id    uuid not null references auth.users (id) on delete cascade,
  device_id  text not null check (char_length(device_id) between 8 and 64),
  day        date not null,
  seconds    numeric(8, 1) not null check (seconds between 0 and 86400),
  updated_at timestamptz not null default now(),
  primary key (user_id, device_id, day)
);

-- Where the reader is in each chapter (shared by Walk and Sleep).
create table public.reading_progress (
  user_id    uuid not null references auth.users (id) on delete cascade,
  slug       text not null check (slug ~ '^[a-z0-9-]{3,60}$'),
  verse      integer not null check (verse between 1 and 200),
  done       boolean not null default false,
  updated_at timestamptz not null,
  primary key (user_id, slug)
);

-- The reader's plan (lib/plan/storage.ts SavedPlan), as sent by the app.
create table public.reading_plans (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  plan       jsonb not null check (pg_column_size(plan) < 65536),
  updated_at timestamptz not null
);

alter table public.listening_days enable row level security;
alter table public.reading_progress enable row level security;
alter table public.reading_plans enable row level security;

create policy "Own listening" on public.listening_days for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own reading progress" on public.reading_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own reading plan" on public.reading_plans for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Merge one device's progress into the account and return the combined state.
--   p_device:    this device's id
--   p_listening: {"2026-10-24": 612.5, ...}  this device's own seconds per day
--   p_progress:  {"genesis-3": {"verse": 14, "done": false, "at": <ms>}, ...}
--   p_plan:      {"plan": {...}, "at": <ms>} or null
-- Rules: listening keeps the larger count per device and day; a chapter keeps
-- the most recent change; a plan with the same settings combines the days read
-- and takes the newer place, while a different plan replaces the older one.
-- Runs as the caller, so the row-level policies above still apply.
create function public.sync_progress(p_device text, p_listening jsonb, p_progress jsonb, p_plan jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  existing public.reading_plans;
  incoming jsonb := p_plan -> 'plan';
  incoming_at timestamptz := to_timestamp(nullif(p_plan ->> 'at', '')::double precision / 1000);
  merged jsonb;
begin
  if uid is null then
    raise exception 'Sign in to sync progress' using errcode = '42501';
  end if;

  -- Listening: this device's own seconds; a count only ever grows within a day.
  insert into public.listening_days as l (user_id, device_id, day, seconds)
  select uid, p_device, key::date, least(greatest(value::text::numeric, 0), 86400)
  from jsonb_each(coalesce(p_listening, '{}'::jsonb))
  where key ~ '^\d{4}-\d{2}-\d{2}$' and jsonb_typeof(value) = 'number'
  on conflict (user_id, device_id, day)
  do update set seconds = greatest(l.seconds, excluded.seconds), updated_at = now();

  -- Reading position: the most recent change to each chapter wins.
  insert into public.reading_progress as r (user_id, slug, verse, done, updated_at)
  select uid, key,
         least(greatest(coalesce((value ->> 'verse')::integer, 1), 1), 200),
         coalesce((value ->> 'done')::boolean, false),
         to_timestamp((value ->> 'at')::double precision / 1000)
  from jsonb_each(coalesce(p_progress, '{}'::jsonb))
  where key ~ '^[a-z0-9-]{3,60}$' and jsonb_typeof(value -> 'at') = 'number'
  on conflict (user_id, slug)
  do update set verse = excluded.verse, done = excluded.done, updated_at = excluded.updated_at
  where excluded.updated_at > r.updated_at;

  -- Reading plan.
  if incoming is not null and incoming_at is not null then
    select * into existing from public.reading_plans where user_id = uid;
    if not found then
      insert into public.reading_plans (user_id, plan, updated_at) values (uid, incoming, incoming_at);
    elsif existing.plan -> 'input' = incoming -> 'input' then
      -- Same plan on two devices: keep every day read on either, the newer place.
      merged := case when incoming_at > existing.updated_at then incoming else existing.plan end;
      merged := jsonb_set(merged, '{done}', (
        select coalesce(jsonb_agg(d order by d), '[]'::jsonb)
        from (
          select distinct (x)::integer as d
          from jsonb_array_elements_text(coalesce(existing.plan -> 'done', '[]') || coalesce(incoming -> 'done', '[]')) as x
        ) days
      ));
      update public.reading_plans
        set plan = merged, updated_at = greatest(existing.updated_at, incoming_at)
        where user_id = uid;
    elsif incoming_at > existing.updated_at then
      -- A different plan started more recently replaces the older one.
      update public.reading_plans set plan = incoming, updated_at = incoming_at where user_id = uid;
    end if;
  end if;

  return jsonb_build_object(
    'listening', (
      select coalesce(jsonb_object_agg(day::text, total), '{}'::jsonb)
      from (
        select day, sum(seconds) as total from public.listening_days
        where user_id = uid and day > current_date - 400
        group by day
      ) t
    ),
    'progress', (
      select coalesce(jsonb_object_agg(slug, jsonb_build_object(
        'verse', verse, 'done', done, 'at', floor(extract(epoch from updated_at) * 1000)
      )), '{}'::jsonb)
      from public.reading_progress where user_id = uid
    ),
    'plan', (
      select jsonb_build_object('plan', plan, 'at', floor(extract(epoch from updated_at) * 1000))
      from public.reading_plans where user_id = uid
    )
  );
end;
$$;

revoke all on function public.sync_progress(text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.sync_progress(text, jsonb, jsonb, jsonb) to authenticated;

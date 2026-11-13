-- Sandbox test purchases made on 13 Oct 2026 (before checkout went live) were stored in the
-- production table and counted as founding members on the public counter. Keep the rows but
-- mark them 'test' so they never count as founding spots or grant access.
alter table public.lifetime_purchases drop constraint if exists lifetime_purchases_status_check;
alter table public.lifetime_purchases
  add constraint lifetime_purchases_status_check check (status in ('completed', 'refunded', 'test'));

update public.lifetime_purchases
  set status = 'test', updated_at = now()
  where paddle_transaction_id in ('txn_01m4tmrj7cak0jj9n7e6fatxpw', 'txn_01m4tp7dw7w1gy9edksw9sj893');

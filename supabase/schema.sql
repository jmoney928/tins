-- Ice Tins — stock and customer data
-- Run once in Supabase → SQL Editor. Safe to re-run.
--
-- Everything here is reached only from the server with the service-role key.
-- RLS is on with no policies, so the anon key can read nothing even if it leaks.

create extension if not exists pgcrypto;

-- ─────────────────────────────── stock ───────────────────────────────
create table if not exists products (
  sku        text primary key,
  name       text not null,
  -- null means unlimited; a number is the remaining allocation for the drop
  remaining  integer,
  drop_label text not null default 'Drop 01',
  updated_at timestamptz not null default now(),
  constraint remaining_not_negative check (remaining is null or remaining >= 0)
);

insert into products (sku, name, remaining) values
  ('ice-tin',     'The Ice Tin',          142),
  ('chillcore-3', 'Chillcore three-pack', null)
on conflict (sku) do nothing;

-- ────────────────────────────── customers ────────────────────────────
create table if not exists customers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  name       text,
  first_seen timestamptz not null default now(),
  last_seen  timestamptz not null default now(),
  orders_count integer not null default 0,
  lifetime_cents integer not null default 0
);

-- ─────────────────────────────── orders ──────────────────────────────
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,          -- idempotency key
  stripe_payment_intent text,
  customer_id       uuid references customers(id) on delete set null,
  email             text,
  status            text not null default 'paid',
  currency          text not null default 'cad',
  amount_subtotal   integer,
  amount_shipping   integer,
  amount_total      integer,
  shipping_name     text,
  shipping_address  jsonb,
  drop_label        text not null default 'Drop 01',
  created_at        timestamptz not null default now()
);

create table if not exists order_lines (
  id          bigserial primary key,
  order_id    uuid not null references orders(id) on delete cascade,
  sku         text not null,
  name        text not null,
  qty         integer not null check (qty > 0),
  unit_amount integer not null,
  total_amount integer not null
);

create index if not exists orders_email_idx      on orders (email);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists order_lines_order_idx on order_lines (order_id);

-- ───────────────────────── lock everything down ──────────────────────
alter table products    enable row level security;
alter table customers   enable row level security;
alter table orders      enable row level security;
alter table order_lines enable row level security;
-- deliberately no policies: only the service-role key (which bypasses RLS)
-- can touch these tables. The browser never talks to Supabase directly.

-- ───────────────────────────── settle_order ──────────────────────────
-- One transaction that records the customer, the order and its lines, and
-- decrements stock. Two properties matter:
--
--   idempotent — Stripe retries webhooks until it gets a 2xx, so a repeat
--   delivery of the same session must not decrement twice. The unique
--   constraint on stripe_session_id is what enforces that, not a lookup.
--
--   atomic — the decrement guards on `remaining >= qty` inside the same
--   statement, so two concurrent buyers cannot both pass the check and
--   oversell. Read-then-write in application code cannot do this.
create or replace function settle_order(
  p_session_id     text,
  p_payment_intent text,
  p_email          text,
  p_name           text,
  p_currency       text,
  p_subtotal       integer,
  p_shipping       integer,
  p_total          integer,
  p_shipping_name  text,
  p_address        jsonb,
  p_lines          jsonb            -- [{sku,name,qty,unit_amount,total_amount}]
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_order_id   uuid;
  v_customer   uuid;
  v_line       jsonb;
  v_updated    integer;
  v_rem        integer;
begin
  -- already settled? report it and change nothing
  select id into v_order_id from orders where stripe_session_id = p_session_id;
  if found then
    return jsonb_build_object('applied', false, 'reason', 'duplicate', 'order_id', v_order_id);
  end if;

  if p_email is not null and length(p_email) > 0 then
    insert into customers (email, name)
    values (lower(p_email), p_name)
    on conflict (email) do update
      set last_seen = now(),
          name = coalesce(excluded.name, customers.name)
    returning id into v_customer;
  end if;

  insert into orders (
    stripe_session_id, stripe_payment_intent, customer_id, email, currency,
    amount_subtotal, amount_shipping, amount_total, shipping_name, shipping_address
  ) values (
    p_session_id, p_payment_intent, v_customer, lower(p_email), p_currency,
    p_subtotal, p_shipping, p_total, p_shipping_name, p_address
  )
  returning id into v_order_id;

  for v_line in select * from jsonb_array_elements(p_lines) loop
    insert into order_lines (order_id, sku, name, qty, unit_amount, total_amount)
    values (
      v_order_id,
      v_line->>'sku',
      v_line->>'name',
      (v_line->>'qty')::int,
      (v_line->>'unit_amount')::int,
      (v_line->>'total_amount')::int
    );

    -- Existence first, so an unknown sku raises instead of silently skipping.
    -- This is only a lookup; the guarded UPDATE below is still what makes the
    -- decrement atomic, so a concurrent buyer cannot slip past it.
    select remaining into v_rem from products where sku = v_line->>'sku';
    if not found then
      raise exception 'unknown sku: %', v_line->>'sku';
    end if;

    if v_rem is not null then
      update products
         set remaining = remaining - (v_line->>'qty')::int,
             updated_at = now()
       where sku = v_line->>'sku'
         and remaining >= (v_line->>'qty')::int;

      get diagnostics v_updated = row_count;
      if v_updated = 0 then
        raise exception 'oversold: % has fewer than % remaining',
          v_line->>'sku', (v_line->>'qty')::int;
      end if;
    end if;

  end loop;

  if v_customer is not null then
    update customers
       set orders_count = orders_count + 1,
           lifetime_cents = lifetime_cents + coalesce(p_total, 0)
     where id = v_customer;
  end if;

  return jsonb_build_object('applied', true, 'order_id', v_order_id);
end;
$$;

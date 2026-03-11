-- Orders and order_items tables. Run in Supabase SQL Editor (Dashboard → SQL Editor) if not using Supabase CLI.

-- Orders: one row per purchase (linked to Stripe session and optional user).
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_number text unique not null,
  stripe_session_id text unique,
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
  total_cents integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order line items.
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity integer not null check (quantity >= 1),
  unit_price_cents integer not null
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- RLS: users can only read their own orders.
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- Inserts/updates are done from API using service_role (bypasses RLS). Users only read their own orders.
comment on table public.orders is 'Customer orders; inserts from API with service_role.';

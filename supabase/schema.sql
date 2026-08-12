-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category text not null,
  images text[] not null default '{}',
  sizes text[],
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- Original price before a discount. When set and higher than `price`,
-- the product is treated as on clearance/sale.
alter table products add column if not exists compare_at_price numeric(10, 2);

alter table products enable row level security;

-- Anyone (including anonymous site visitors) can read products.
create policy "Public read access" on products
  for select
  using (true);

-- No insert/update/delete policy is defined for the anon/public role,
-- so writes are only possible via the service role key (used server-side
-- by the admin panel), which bypasses RLS entirely.

-- Storage bucket for product photos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Anyone can view images (bucket is public), only the service role can
-- upload/delete (no insert/update/delete policy granted to anon).
create policy "Public read product images" on storage.objects
  for select
  using (bucket_id = 'product-images');

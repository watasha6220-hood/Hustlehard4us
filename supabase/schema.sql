-- ============================================================
--  HUSTLE HARD 4 US DESIGNS — Supabase schema
--  Paste this whole file into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Quote requests from the Quote Builder wizard
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product text not null,
  quantity int not null default 1,
  colors text[] default '{}',
  print_method text,
  needs_design boolean default false,
  notes text,
  name text not null,
  email text not null,
  phone text not null,
  estimate numeric,
  status text not null default 'new'   -- new | contacted | quoted | won | lost
);

-- Contact form messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  details text not null,
  status text not null default 'new'   -- new | replied | closed
);

-- Gang sheet builder orders
create table if not exists gang_sheets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sheet_width numeric not null default 22,     -- inches
  sheet_length numeric not null,               -- inches used
  items jsonb not null default '[]',           -- [{name,w,h,x,y,rotated}]
  item_count int not null default 0,
  price numeric not null default 0,
  name text not null,
  email text not null,
  phone text not null,
  notes text,
  status text not null default 'new'           -- new | printing | shipped | done
);

-- 3D printing orders (shop designs or customer uploads)
create table if not exists print3d_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  mode text not null default 'design',      -- design | upload
  design_id text,
  design_name text,
  file_url text,                            -- uploaded STL/3MF in storage
  material text not null,
  color text,
  grams numeric,
  quantity int not null default 1,
  rush boolean default false,
  price numeric,
  notes text,
  name text not null,
  email text not null,
  phone text not null,
  status text not null default 'new'        -- new | printing | ready | done
);

alter table print3d_orders enable row level security;
create policy "public insert print3d" on print3d_orders for insert with check (true);
create policy "public read print3d"   on print3d_orders for select using (true);
create policy "public update print3d" on print3d_orders for update using (true);

-- 3D designs managed from the admin panel (merged with data/printing3d.js)
create table if not exists designs3d (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  image text not null,
  weight_grams numeric not null default 50,
  size_note text,
  badge text,
  blurb text,
  flat_price numeric,          -- null = per-gram pricing; set = flat rate incl. labor
  flat_note text,
  active boolean default true
);

alter table designs3d enable row level security;
create policy "public read designs3d"   on designs3d for select using (true);
create policy "public write designs3d"  on designs3d for insert with check (true);
create policy "public update designs3d" on designs3d for update using (true);
create policy "public delete designs3d" on designs3d for delete using (true);

-- Portfolio / recent work (admin-managed)
create table if not exists portfolio (
  id text primary key,
  created_at timestamptz not null default now(),
  title text not null,
  category text not null,
  image text not null,
  caption text,
  active boolean default true
);
alter table portfolio enable row level security;
create policy "public read portfolio"   on portfolio for select using (true);
create policy "public write portfolio"  on portfolio for insert with check (true);
create policy "public update portfolio" on portfolio for update using (true);
create policy "public delete portfolio" on portfolio for delete using (true);

-- Email subscribers ("10% off first order" capture)
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  source text
);
alter table subscribers enable row level security;
create policy "public insert subscribers" on subscribers for insert with check (true);
create policy "public read subscribers"   on subscribers for select using (true);

-- Language + referral tracking on leads
alter table quotes         add column if not exists lang text default 'en';
alter table quotes         add column if not exists referral text;
alter table messages       add column if not exists lang text default 'en';
alter table gang_sheets    add column if not exists lang text default 'en';
alter table print3d_orders add column if not exists lang text default 'en';

-- Products managed from the admin panel (merged with data/products.js defaults)
create table if not exists products (
  id text primary key,                          -- url-safe slug
  created_at timestamptz not null default now(),
  name text not null,
  category text not null,                       -- Apparel | Prints | Displays
  price numeric not null,
  price_note text,
  image text not null,                          -- /images/... path or full URL
  badge text,
  featured boolean default false,
  description text,
  options text[] default '{}',
  active boolean default true
);

-- ── Row Level Security ──────────────────────────────────────
-- Public visitors may INSERT leads and READ products.
-- Admin reads/updates go through the anon key too for simplicity;
-- lock this down with Supabase Auth when you're ready (see README).

alter table quotes enable row level security;
alter table messages enable row level security;
alter table gang_sheets enable row level security;
alter table products enable row level security;

create policy "public insert quotes"      on quotes      for insert with check (true);
create policy "public read quotes"        on quotes      for select using (true);
create policy "public update quotes"      on quotes      for update using (true);

create policy "public insert messages"    on messages    for insert with check (true);
create policy "public read messages"      on messages    for select using (true);
create policy "public update messages"    on messages    for update using (true);

create policy "public insert gang_sheets" on gang_sheets for insert with check (true);
create policy "public read gang_sheets"   on gang_sheets for select using (true);
create policy "public update gang_sheets" on gang_sheets for update using (true);

create policy "public read products"      on products    for select using (true);
create policy "public write products"     on products    for insert with check (true);
create policy "public update products"    on products    for update using (true);
create policy "public delete products"    on products    for delete using (true);

-- ── Storage: artwork bucket (customer design files) ─────────
insert into storage.buckets (id, name, public)
values ('artwork', 'artwork', true)
on conflict (id) do nothing;

create policy "public upload artwork" on storage.objects
  for insert with check (bucket_id = 'artwork');
create policy "public read artwork" on storage.objects
  for select using (bucket_id = 'artwork');

-- ── Columns for uploaded file URLs ──────────────────────────
alter table quotes      add column if not exists artwork_url text;
alter table gang_sheets add column if not exists artwork_urls text[] default '{}';

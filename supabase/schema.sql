-- Supabase migration schema for IDGM
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  password_hash text,
  name text,
  image text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  unique(user_id, role_id)
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  slug text unique not null,
  name text not null,
  description text,
  price numeric not null,
  compare_at numeric,
  currency text not null default 'NGN',
  category_id uuid references public.categories(id) on delete restrict,
  images jsonb default '[]'::jsonb,
  attributes jsonb default '{}'::jsonb,
  gross_weight_kg numeric,
  length_cm numeric,
  width_cm numeric,
  height_cm numeric,
  max_dimension_cm numeric,
  is_bulky boolean default false,
  has_free_shipping boolean default false,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text,
  product_id uuid not null references public.products(id) on delete cascade
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid unique not null references public.products(id) on delete cascade,
  quantity integer not null default 0,
  threshold integer not null default 0
);

create table if not exists public.flash_sales (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  product_id uuid not null references public.products(id) on delete cascade,
  discount_percent integer not null,
  flash_price numeric not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  max_quantity integer,
  sold_count integer not null default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  currency text not null default 'NGN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  price numeric not null
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  status text not null default 'PENDING',
  total numeric not null,
  currency text not null default 'NGN',
  shipping_id uuid,
  billing_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null,
  price numeric not null
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  line_1 text not null,
  line_2 text,
  city text not null,
  state text,
  country text not null default 'NG',
  postcode text,
  latitude numeric,
  longitude numeric
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique references public.orders(id) on delete set null,
  invoice_id uuid,
  user_id uuid references public.users(id) on delete set null,
  provider text not null,
  reference text unique not null,
  amount numeric not null,
  currency text not null default 'NGN',
  status text not null default 'INITIATED',
  raw jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  is_active boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  min_subtotal_ngn numeric,
  max_uses integer,
  max_uses_per_user integer,
  percent_off numeric,
  amount_off_ngn numeric,
  free_shipping boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  price numeric not null,
  category_id uuid references public.categories(id) on delete restrict,
  images jsonb default '[]'::jsonb,
  units jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.maintenance_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  subject text not null,
  description text not null,
  status text not null default 'OPEN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "Users can read their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can read public products" on public.products for select using (is_active = true);
create policy "Users can read their own orders" on public.orders for select using (auth.uid() = user_id);

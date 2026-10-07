-- Apply this migration to the target Supabase project after creating the tables.
-- Policies are repeat-safe and are scoped to auth.uid(); no client-supplied IDs are trusted.

alter table public.users enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.permissions enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.flash_sales enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.addresses enable row level security;
alter table public.payments enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.coupons enable row level security;
alter table public.properties enable row level security;
alter table public.maintenance_tickets enable row level security;

drop policy if exists "Users can read their own profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
drop policy if exists "Staff can read users" on public.users;
drop policy if exists "Users can read public categories" on public.categories;
drop policy if exists "Users can read active public products" on public.products;
drop policy if exists "Users can manage their own carts" on public.carts;
drop policy if exists "Users can manage their own cart items" on public.cart_items;
drop policy if exists "Users can manage their own orders" on public.orders;
drop policy if exists "Users can manage their own order items" on public.order_items;
drop policy if exists "Users can manage their own addresses" on public.addresses;
drop policy if exists "Users can manage their own payments" on public.payments;
drop policy if exists "Users can manage their own wishlist" on public.wishlist_items;
drop policy if exists "Users can manage their own tickets" on public.maintenance_tickets;
drop policy if exists "Admins can manage roles" on public.roles;
drop policy if exists "Admins can manage user roles" on public.user_roles;
drop policy if exists "Admins can manage permissions" on public.permissions;

create policy "Users can read their own profile"
  on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile"
  on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Staff can read users"
  on public.users for select using (exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and r.name in ('ADMIN', 'STAFF')
  ));
create policy "Users can read public categories"
  on public.categories for select using (true);
create policy "Users can read active public products"
  on public.products for select using (is_active = true);
create policy "Users can manage their own carts"
  on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own cart items"
  on public.cart_items for all using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  );
create policy "Users can manage their own orders"
  on public.orders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own order items"
  on public.order_items for all using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "Users can manage their own addresses"
  on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own payments"
  on public.payments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own wishlist"
  on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own tickets"
  on public.maintenance_tickets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can manage roles"
  on public.roles for all using (
    exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.name = 'ADMIN')
  ) with check (
    exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.name = 'ADMIN')
  );
create policy "Admins can manage user roles"
  on public.user_roles for all using (
    exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.name = 'ADMIN')
  ) with check (
    exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.name = 'ADMIN')
  );
create policy "Admins can manage permissions"
  on public.permissions for all using (
    exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.name = 'ADMIN')
  ) with check (
    exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = auth.uid() and r.name = 'ADMIN')
  );

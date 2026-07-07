-- ============================================================
--  AUTH HARDENING — run this AFTER you're ready to secure /admin
--  with a real Supabase Auth login (recommended before real volume).
--
--  Steps:
--  1. Supabase Dashboard → Authentication → Users → Add user
--     (create the owner's email + password; disable public signups
--      in Authentication → Providers → Email → "Enable Signups" OFF)
--  2. Run this file in the SQL Editor.
--  3. In the code, swap the passcode gate in
--     components/admin/AdminPanel.jsx for supabase.auth.signInWithPassword
--     (see README "Enabling Supabase Auth").
--
--  Effect: public visitors can still SUBMIT (insert) leads and READ
--  products/designs/portfolio, but only a logged-in user can read
--  leads, change statuses, or manage catalog content.
-- ============================================================

-- ---- QUOTES: public insert only; admin read/update ----
drop policy if exists "public read quotes"   on quotes;
drop policy if exists "public update quotes" on quotes;
create policy "auth read quotes"   on quotes for select to authenticated using (true);
create policy "auth update quotes" on quotes for update to authenticated using (true);

-- ---- MESSAGES ----
drop policy if exists "public read messages"   on messages;
drop policy if exists "public update messages" on messages;
create policy "auth read messages"   on messages for select to authenticated using (true);
create policy "auth update messages" on messages for update to authenticated using (true);

-- ---- GANG SHEETS ----
drop policy if exists "public read gang_sheets"   on gang_sheets;
drop policy if exists "public update gang_sheets" on gang_sheets;
create policy "auth read gang_sheets"   on gang_sheets for select to authenticated using (true);
create policy "auth update gang_sheets" on gang_sheets for update to authenticated using (true);

-- ---- 3D PRINT ORDERS ----
drop policy if exists "public read print3d"   on print3d_orders;
drop policy if exists "public update print3d" on print3d_orders;
create policy "auth read print3d"   on print3d_orders for select to authenticated using (true);
create policy "auth update print3d" on print3d_orders for update to authenticated using (true);

-- ---- SUBSCRIBERS: public can only subscribe ----
drop policy if exists "public read subscribers" on subscribers;
create policy "auth read subscribers" on subscribers for select to authenticated using (true);

-- ---- CATALOG TABLES: public read stays; writes become admin-only ----
drop policy if exists "public write products"  on products;
drop policy if exists "public update products" on products;
drop policy if exists "public delete products" on products;
create policy "auth write products"  on products for insert to authenticated with check (true);
create policy "auth update products" on products for update to authenticated using (true);
create policy "auth delete products" on products for delete to authenticated using (true);

drop policy if exists "public write designs3d"  on designs3d;
drop policy if exists "public update designs3d" on designs3d;
drop policy if exists "public delete designs3d" on designs3d;
create policy "auth write designs3d"  on designs3d for insert to authenticated with check (true);
create policy "auth update designs3d" on designs3d for update to authenticated using (true);
create policy "auth delete designs3d" on designs3d for delete to authenticated using (true);

drop policy if exists "public write portfolio"  on portfolio;
drop policy if exists "public update portfolio" on portfolio;
drop policy if exists "public delete portfolio" on portfolio;
create policy "auth write portfolio"  on portfolio for insert to authenticated with check (true);
create policy "auth update portfolio" on portfolio for update to authenticated using (true);
create policy "auth delete portfolio" on portfolio for delete to authenticated using (true);

-- NOTE: public ORDER TRACKING (/track) needs lead reads. After hardening,
-- either (a) keep tracking client-side only in demo mode, or (b) create a
-- SECURITY DEFINER function that returns only rows matching the email:
create or replace function public.track_orders(lookup_email text)
returns json language sql security definer set search_path = public as $$
  select json_build_object(
    'quotes', coalesce((select json_agg(json_build_object('id', id, 'created_at', created_at, 'product', product, 'quantity', quantity, 'status', status))
      from quotes where lower(email) = lower(lookup_email)), '[]'::json),
    'gangSheets', coalesce((select json_agg(json_build_object('id', id, 'created_at', created_at, 'item_count', item_count, 'price', price, 'status', status))
      from gang_sheets where lower(email) = lower(lookup_email)), '[]'::json),
    'prints3d', coalesce((select json_agg(json_build_object('id', id, 'created_at', created_at, 'design_name', design_name, 'quantity', quantity, 'price', price, 'status', status))
      from print3d_orders where lower(email) = lower(lookup_email)), '[]'::json)
  );
$$;
grant execute on function public.track_orders(text) to anon;

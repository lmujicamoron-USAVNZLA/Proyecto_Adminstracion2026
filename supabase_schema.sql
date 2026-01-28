-- ⚠️ RESET COMPLETO (Borra lo anterior para asegurar una instalación limpia)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists expenses cascade;
drop table if exists property_activity cascade;
drop table if exists transactions cascade;
drop table if exists properties cascade;
drop table if exists profiles cascade;
drop type if exists expense_category cascade;
drop type if exists activity_type cascade;
drop type if exists transaction_status cascade;
drop type if exists property_status cascade;
drop type if exists user_role cascade;

-- AHORA CREAMOS TODO DESDE CERO

-- 1. PROFILES (Usuarios y Roles)
create type user_role as enum ('admin', 'editor', 'agent');

create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role user_role default 'agent',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 2. PROPERTIES (Inmuebles)
create type property_status as enum ('captado', 'visitado', 'vendido', 'financiado', 'en_tramite');

create table properties (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  address text not null,
  price numeric,
  status property_status default 'captado',
  agent_id uuid references profiles(id),
  owner_name text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table properties enable row level security;
create policy "Enable read access for all users" on properties for select using (true);
create policy "Enable insert for authenticated users only" on properties for insert with check (auth.role() = 'authenticated');
create policy "Enable update for owners or admins" on properties for update using (auth.uid() = agent_id);

-- 3. TRANSACTIONS (Ventas y Cierres)
create type transaction_status as enum ('pendiente', 'completado', 'cancelado');

create table transactions (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id),
  buyer_name text,
  final_price numeric,
  commission_amount numeric,
  notary_name text,
  surveyor_name text,
  signature_date date,
  status transaction_status default 'pendiente',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table transactions enable row level security;
create policy "Authenticated users can view transactions" on transactions for select using (auth.role() = 'authenticated');

-- 4. PROPERTY_ACTIVITY (Bitácora de Seguimiento)
create type activity_type as enum ('visita', 'llamada', 'oferta', 'cambio_estado');

create table property_activity (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references properties(id) on delete cascade,
  performed_by uuid references profiles(id),
  type activity_type not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table property_activity enable row level security;
create policy "Authenticated users can view activity" on property_activity for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert activity" on property_activity for insert with check (auth.role() = 'authenticated');

-- 5. EXPENSES (Gastos y Finanzas)
create type expense_category as enum ('marketing', 'operativo', 'personal', 'otros');

create table expenses (
  id uuid default uuid_generate_v4() primary key,
  description text not null,
  amount numeric not null,
  category expense_category default 'otros',
  linked_property_id uuid references properties(id),
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table expenses enable row level security;
create policy "Authenticated users can view expenses" on expenses for select using (auth.role() = 'authenticated');

-- TRIGGER
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'agent');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
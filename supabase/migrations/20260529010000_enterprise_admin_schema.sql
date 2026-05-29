-- =========================================
-- ENTERPRISE ADMIN / RBAC / ASSETS / PRICING
-- =========================================

create extension if not exists "pgcrypto";

do $$
begin
  create type public.admin_role as enum ('owner', 'admin', 'finance', 'editor', 'viewer');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.asset_kind as enum ('logo', 'document', 'image', 'video', 'other');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.billing_interval as enum ('one_time', 'monthly', 'quarterly', 'yearly');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.admin_role not null default 'viewer',
  is_active boolean not null default true,
  last_seen_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.role_permissions (
  role public.admin_role not null,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  primary key (role, permission_id)
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default 'null'::jsonb,
  is_public boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.brand_logos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  storage_path text,
  public_url text,
  version integer not null default 1,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint brand_logos_source_check check (storage_path is not null or public_url is not null)
);

create table if not exists public.managed_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind public.asset_kind not null default 'other',
  bucket text not null default 'assets',
  storage_path text not null,
  public_url text,
  mime_type text,
  size_bytes bigint,
  version integer not null default 1,
  checksum text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (bucket, storage_path, version)
);

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  currency char(3) not null default 'BRL',
  amount_cents integer not null check (amount_cents >= 0),
  billing_interval public.billing_interval not null default 'monthly',
  is_active boolean not null default true,
  rules jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.pricing_plans(id) on delete cascade,
  previous_amount_cents integer,
  next_amount_cents integer not null,
  previous_currency char(3),
  next_currency char(3) not null,
  changed_by uuid references public.profiles(id) on delete set null,
  reason text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  plan_id uuid references public.pricing_plans(id) on delete restrict,
  status text not null default 'active',
  started_at timestamp with time zone not null default now(),
  ends_at timestamp with time zone,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.transactions_admin_logs (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references public.transactions(id) on delete cascade,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  actor_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  audience public.admin_role[] not null default array['owner','admin']::public.admin_role[],
  read_by uuid[] not null default array[]::uuid[],
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_admin_role()
returns public.admin_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid() and is_active = true), 'viewer')::public.admin_role;
$$;

create or replace function public.is_admin(minimum_role public.admin_role default 'admin')
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case public.current_admin_role()
    when 'owner' then true
    when 'admin' then minimum_role in ('admin','finance','editor','viewer')
    when 'finance' then minimum_role in ('finance','viewer')
    when 'editor' then minimum_role in ('editor','viewer')
    when 'viewer' then minimum_role = 'viewer'
    else false
  end;
$$;

create or replace function public.log_pricing_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and (old.amount_cents <> new.amount_cents or old.currency <> new.currency) then
    insert into public.price_history (plan_id, previous_amount_cents, next_amount_cents, previous_currency, next_currency, changed_by, reason)
    values (new.id, old.amount_cents, new.amount_cents, old.currency, new.currency, auth.uid(), 'pricing_plans update');
  end if;
  return new;
end;
$$;

create or replace function public.audit_admin_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id text;
begin
  target_id = case when tg_op = 'DELETE' then old.id::text else new.id::text end;

  insert into public.audit_logs (actor_id, action, entity, entity_id, metadata)
  values (auth.uid(), tg_op, tg_table_name, target_id, jsonb_build_object('table', tg_table_name));

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at before update on public.app_settings for each row execute function public.set_updated_at();

drop trigger if exists brand_logos_set_updated_at on public.brand_logos;
create trigger brand_logos_set_updated_at before update on public.brand_logos for each row execute function public.set_updated_at();

drop trigger if exists managed_assets_set_updated_at on public.managed_assets;
create trigger managed_assets_set_updated_at before update on public.managed_assets for each row execute function public.set_updated_at();

drop trigger if exists pricing_plans_set_updated_at on public.pricing_plans;
create trigger pricing_plans_set_updated_at before update on public.pricing_plans for each row execute function public.set_updated_at();

drop trigger if exists pricing_plans_history on public.pricing_plans;
create trigger pricing_plans_history after update on public.pricing_plans for each row execute function public.log_pricing_change();

drop trigger if exists audit_brand_logos on public.brand_logos;
create trigger audit_brand_logos after insert or update or delete on public.brand_logos for each row execute function public.audit_admin_change();

drop trigger if exists audit_managed_assets on public.managed_assets;
create trigger audit_managed_assets after insert or update or delete on public.managed_assets for each row execute function public.audit_admin_change();

drop trigger if exists audit_pricing_plans on public.pricing_plans;
create trigger audit_pricing_plans after insert or update or delete on public.pricing_plans for each row execute function public.audit_admin_change();

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_brand_logos_active on public.brand_logos(is_active, slug);
create index if not exists idx_managed_assets_kind_active on public.managed_assets(kind, is_active);
create index if not exists idx_pricing_plans_active on public.pricing_plans(is_active, amount_cents);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);

alter table public.profiles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.app_settings enable row level security;
alter table public.brand_logos enable row level security;
alter table public.managed_assets enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.price_history enable row level security;
alter table public.subscriptions enable row level security;
alter table public.transactions_admin_logs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Profiles can view own profile" on public.profiles;
create policy "Profiles can view own profile" on public.profiles for select using (id = auth.uid() or public.is_admin('admin'));

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin('admin')) with check (public.is_admin('admin'));

drop policy if exists "Public can view public settings" on public.app_settings;
create policy "Public can view public settings" on public.app_settings for select using (is_public = true or public.is_admin('viewer'));

drop policy if exists "Admins manage settings" on public.app_settings;
create policy "Admins manage settings" on public.app_settings for all using (public.is_admin('admin')) with check (public.is_admin('admin'));

drop policy if exists "Public can view active logos" on public.brand_logos;
create policy "Public can view active logos" on public.brand_logos for select using (is_active = true or public.is_admin('viewer'));

drop policy if exists "Admins manage logos" on public.brand_logos;
create policy "Admins manage logos" on public.brand_logos for all using (public.is_admin('editor')) with check (public.is_admin('editor'));

drop policy if exists "Public can view active assets" on public.managed_assets;
create policy "Public can view active assets" on public.managed_assets for select using (is_active = true or public.is_admin('viewer'));

drop policy if exists "Admins manage assets" on public.managed_assets;
create policy "Admins manage assets" on public.managed_assets for all using (public.is_admin('editor')) with check (public.is_admin('editor'));

drop policy if exists "Public can view active plans" on public.pricing_plans;
create policy "Public can view active plans" on public.pricing_plans for select using (is_active = true or public.is_admin('viewer'));

drop policy if exists "Finance manage pricing" on public.pricing_plans;
create policy "Finance manage pricing" on public.pricing_plans for all using (public.is_admin('finance')) with check (public.is_admin('finance'));

drop policy if exists "Admins view audit" on public.audit_logs;
create policy "Admins view audit" on public.audit_logs for select using (public.is_admin('admin'));

drop policy if exists "System writes audit" on public.audit_logs;
create policy "System writes audit" on public.audit_logs for insert with check (public.is_admin('viewer'));

drop policy if exists "Admins view price history" on public.price_history;
create policy "Admins view price history" on public.price_history for select using (public.is_admin('finance'));

drop policy if exists "Users view subscriptions" on public.subscriptions;
create policy "Users view subscriptions" on public.subscriptions for select using (profile_id = auth.uid() or public.is_admin('finance'));

drop policy if exists "Admins view transaction logs" on public.transactions_admin_logs;
create policy "Admins view transaction logs" on public.transactions_admin_logs for select using (public.is_admin('finance'));

drop policy if exists "Admins view notifications" on public.notifications;
create policy "Admins view notifications" on public.notifications for select using (public.is_admin('viewer'));

drop policy if exists "Admins manage notifications" on public.notifications;
create policy "Admins manage notifications" on public.notifications for all using (public.is_admin('editor')) with check (public.is_admin('editor'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'assets',
  'assets',
  true,
  5242880,
  array['image/png','image/jpeg','image/webp','image/svg+xml','application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

insert into public.app_settings (key, value, is_public)
values
  ('app_name', '"Dashboard RKC FAJ"'::jsonb, true),
  ('default_currency', '"BRL"'::jsonb, true),
  ('asset_cache_seconds', '3600'::jsonb, true)
on conflict (key) do nothing;

insert into public.pricing_plans (slug, name, description, currency, amount_cents, billing_interval, is_active)
values
  ('base-rkc', 'Plano Base RKC', 'Plano operacional padrão para prestação de contas e gestão administrativa.', 'BRL', 0, 'monthly', true)
on conflict (slug) do nothing;

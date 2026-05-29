-- =========================================
-- EXTENSÕES
-- =========================================

create extension if not exists "pgcrypto";

-- =========================================
-- TABELA DE PROJETOS
-- =========================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  slug text unique not null,

  description text,

  organization text,

  semester text,

  public boolean default true,

  start_date date,

  end_date date,

  created_at timestamp with time zone default now()
);

-- =========================================
-- TABELA DE TRANSAÇÕES
-- =========================================

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),

  project_id uuid references public.projects(id) on delete cascade,

  date date not null,

  title text not null,

  description text,

  rubrica text,

  solicitado numeric(12,2) default 0,

  executado numeric(12,2) default 0,

  favorecido text,

  status text default 'Pago',

  comprovante_url text,

  created_at timestamp with time zone default now()
);

-- =========================================
-- ÍNDICES
-- =========================================

create index if not exists idx_transactions_project_id
on public.transactions(project_id);

create index if not exists idx_projects_slug
on public.projects(slug);

-- =========================================
-- RLS
-- =========================================

alter table public.projects enable row level security;
alter table public.transactions enable row level security;

-- =========================================
-- POLÍTICAS PÚBLICAS (READ ONLY)
-- =========================================

-- Recria as políticas para manter a migração reexecutável em ambientes locais.
drop policy if exists "Public can view projects" on public.projects;
create policy "Public can view projects"
on public.projects
for select
using (public = true);

drop policy if exists "Public can view transactions" on public.transactions;
create policy "Public can view transactions"
on public.transactions
for select
using (true);

-- =========================================
-- STORAGE
-- =========================================

insert into storage.buckets (id, name, public)
values ('comprovantes', 'comprovantes', true)
on conflict (id) do nothing;

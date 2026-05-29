-- =========================================
-- EXTENSÕES
-- =========================================

create extension if not exists "pgcrypto";

-- =========================================
-- TABELA DE TRANSAÇÕES DO DASHBOARD ORIGINAL
-- =========================================

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text,
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

create index if not exists idx_transactions_date
on public.transactions(date desc);

-- =========================================
-- RLS
-- =========================================

alter table public.transactions enable row level security;

-- =========================================
-- POLÍTICAS PÚBLICAS (READ ONLY)
-- =========================================

-- Recria a política para manter a migração reexecutável em ambientes locais.
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

# Supabase

Este diretório contém a migração inicial do banco de dados para o dashboard financeiro original.

## Aplicar o schema

Execute a migração em um projeto Supabase com o CLI:

```bash
supabase db push
```

Ou cole o conteúdo de `migrations/20260529000000_initial_public_finance_schema.sql` no SQL Editor do Supabase.

## Estrutura criada

- Extensão `pgcrypto` para gerar UUIDs com `gen_random_uuid()`.
- Tabela pública `transactions` com os dados reais usados pelo dashboard original.
- Índice para ordenação por data e leitura pública.
- RLS habilitado na tabela, com política pública apenas de leitura.
- Bucket público `comprovantes` no Supabase Storage para os PDFs reais.

# Supabase

Este diretório contém a migração inicial do banco de dados para o dashboard financeiro.

## Aplicar o schema

Execute a migração em um projeto Supabase com o CLI:

```bash
supabase db push
```

Ou cole o conteúdo de `migrations/20260529000000_initial_public_finance_schema.sql` no SQL Editor do Supabase.

## Estrutura criada

- Extensão `pgcrypto` para gerar UUIDs com `gen_random_uuid()`.
- Tabela pública `projects` com dados dos projetos e slug único.
- Tabela pública `transactions` vinculada aos projetos, com valores solicitados/executados e URL do comprovante.
- Índices para busca por `projects.slug` e relacionamento `transactions.project_id`.
- RLS habilitado nas duas tabelas, com políticas públicas apenas de leitura.
- Bucket público `comprovantes` no Supabase Storage.

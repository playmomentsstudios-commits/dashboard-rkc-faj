import { assertSupabaseConfigured, supabase } from '../lib/supabase';
import type { SupabaseFinanceRow } from '../app/components/data';

const comprovantesBucket = 'comprovantes';

function publicComprovanteUrl(value: string | null | undefined) {
  const path = value?.trim();
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) return path;

  return supabase.storage.from(comprovantesBucket).getPublicUrl(path).data.publicUrl;
}

function normalizeMoney(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value.replace(',', '.')) || 0;
  return 0;
}

function fallbackId() {
  return `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeRow(row: Record<string, unknown>): SupabaseFinanceRow {
  const rawId = row.id;
  const rawDate = row.date ?? row.data;

  return {
    id: typeof rawId === 'string' ? rawId : String(rawId ?? fallbackId()),
    date: typeof rawDate === 'string' ? rawDate : new Date().toISOString().slice(0, 10),
    title: typeof row.title === 'string' ? row.title : null,
    description: typeof row.description === 'string' ? row.description : null,
    rubrica: typeof row.rubrica === 'string' ? row.rubrica : null,
    solicitado: normalizeMoney(row.solicitado),
    executado: normalizeMoney(row.executado ?? row.valor),
    favorecido: typeof row.favorecido === 'string' ? row.favorecido : null,
    status: typeof row.status === 'string' ? row.status : null,
    comprovante_url: publicComprovanteUrl(typeof row.comprovante_url === 'string' ? row.comprovante_url : null),
    banco: typeof row.banco === 'string' ? row.banco : null,
    tipo: typeof row.tipo === 'string' ? row.tipo : null,
    tx_id: typeof row.tx_id === 'string' ? row.tx_id : null,
  };
}

function raiseDashboardDataError(error: unknown): never {
  const message = error instanceof Error && error.message ? error.message : 'Não foi possível carregar as transações reais do Supabase.';

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    throw new Error('Não foi possível conectar ao Supabase. Verifique VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY e o status do projeto Supabase.');
  }

  throw new Error(message);
}

export async function getDashboardTransactions() {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) raiseDashboardDataError(error);

  return (data ?? []).map((row) => normalizeRow(row as Record<string, unknown>));
}

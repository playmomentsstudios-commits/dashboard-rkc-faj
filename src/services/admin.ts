import { assertSupabaseConfigured, supabase } from '../lib/supabase';
import type { AdminOverview, AuditLog } from '../types/admin';
import { normalizeServiceError } from './errors';

async function safeCount(table: string, filter?: (query: ReturnType<typeof supabase.from>) => unknown) {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  if (filter) query = filter(query) as typeof query;
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  assertSupabaseConfigured();

  try {
    const [users, activePlans, activeAssets, logsResult] = await Promise.all([
      safeCount('profiles'),
      safeCount('pricing_plans', (query) => query.eq('is_active', true)),
      safeCount('managed_assets', (query) => query.eq('is_active', true)),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6),
    ]);

    if (logsResult.error) throw logsResult.error;

    return {
      users,
      activePlans,
      activeAssets,
      latestLogs: (logsResult.data ?? []) as AuditLog[],
    };
  } catch (error) {
    throw new Error(normalizeServiceError(error, 'Não foi possível carregar o overview administrativo.'));
  }
}

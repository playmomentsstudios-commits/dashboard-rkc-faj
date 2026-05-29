import { supabase } from '../lib/supabase';
import type { Project, Transaction, TransactionView } from '../types/supabase';

const projectColumns = 'id,name,slug,description,organization,semester,public,start_date,end_date,created_at';
const transactionColumns = 'id,project_id,date,title,description,rubrica,solicitado,executado,favorecido,status,comprovante_url,created_at';

const normalizeMoney = (value: number | string | null | undefined) => Number(value ?? 0);
const normalizeTransaction = (transaction: Transaction): TransactionView => ({
  ...transaction,
  solicitado: normalizeMoney(transaction.solicitado),
  executado: normalizeMoney(transaction.executado),
});

export async function getPublicProjects() {
  const { data, error } = await supabase
    .from<Project>('projects')
    .select(projectColumns)
    .eq('public', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from<Project>('projects')
    .select(projectColumns)
    .eq('slug', slug)
    .eq('public', true)
    .limit(1);

  if (error) throw error;
  return data?.[0] ?? null;
}

export async function getTransactionsByProject(projectId: string) {
  const { data, error } = await supabase
    .from<Transaction>('transactions')
    .select(transactionColumns)
    .eq('project_id', projectId)
    .order('date', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizeTransaction);
}

import { assertSupabaseConfigured, supabase } from '../lib/supabase';
import type { Project, ProjectDashboardData, Transaction, TransactionView } from '../types/supabase';
import { calculateMetrics, groupByMonth, groupByRubrica } from './analytics';

const projectColumns = 'id,name,slug,description,organization,semester,public,start_date,end_date,created_at';
const transactionColumns = 'id,project_id,date,title,description,rubrica,solicitado,executado,favorecido,status,comprovante_url,created_at';

const normalizeMoney = (value: number | string | null | undefined) => Number(value ?? 0);
const normalizeTransaction = (transaction: Transaction): TransactionView => ({
  ...transaction,
  solicitado: normalizeMoney(transaction.solicitado),
  executado: normalizeMoney(transaction.executado),
});

function raisePublicDataError(error: unknown, fallback: string): never {
  const message = error instanceof Error && error.message ? error.message : fallback;

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    throw new Error('Não foi possível conectar ao Supabase. Verifique as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY e se o projeto Supabase está ativo.');
  }

  throw new Error(message);
}

export async function getPublicProjects() {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('projects')
    .select(projectColumns)
    .eq('public', true)
    .order('created_at', { ascending: false })
    .returns<Project[]>();

  if (error) raisePublicDataError(error, 'Não foi possível carregar os projetos públicos.');
  return data ?? [];
}

export async function getProjectBySlug(slug: string) {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('projects')
    .select(projectColumns)
    .eq('slug', slug)
    .eq('public', true)
    .limit(1)
    .returns<Project[]>();

  if (error) raisePublicDataError(error, 'Não foi possível carregar o projeto público.');
  return data?.[0] ?? null;
}

export async function getTransactionsByProject(projectId: string) {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('transactions')
    .select(transactionColumns)
    .eq('project_id', projectId)
    .order('date', { ascending: false })
    .returns<Transaction[]>();

  if (error) raisePublicDataError(error, 'Não foi possível carregar as transações do projeto.');
  return (data ?? []).map(normalizeTransaction);
}

export async function getProjectDashboardBySlug(slug: string): Promise<ProjectDashboardData | null> {
  const project = await getProjectBySlug(slug);

  if (!project) return null;

  const transactions = await getTransactionsByProject(project.id);

  return {
    project,
    transactions,
    metrics: calculateMetrics(transactions),
    rubricas: groupByRubrica(transactions),
    monthly: groupByMonth(transactions),
  };
}

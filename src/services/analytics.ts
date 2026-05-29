import type { MonthlySummary, ProjectMetrics, RubricaSummary, TransactionView } from '../types/supabase';

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });

export function calculateMetrics(transactions: TransactionView[]): ProjectMetrics {
  const totalSolicitado = transactions.reduce((sum, item) => sum + item.solicitado, 0);
  const totalExecutado = transactions.reduce((sum, item) => sum + item.executado, 0);
  const saldoDisponivel = totalSolicitado - totalExecutado;
  const percentualExecutado = totalSolicitado > 0 ? Number(((totalExecutado / totalSolicitado) * 100).toFixed(1)) : 0;

  return { totalSolicitado, totalExecutado, saldoDisponivel, percentualExecutado };
}

export function groupByRubrica(transactions: TransactionView[]): RubricaSummary[] {
  const rubricas = new Map<string, RubricaSummary>();

  transactions.forEach((transaction) => {
    const key = transaction.rubrica || 'Sem rubrica';
    const current = rubricas.get(key) ?? { rubrica: key, solicitado: 0, executado: 0 };
    current.solicitado += transaction.solicitado;
    current.executado += transaction.executado;
    rubricas.set(key, current);
  });

  return Array.from(rubricas.values()).sort((a, b) => b.executado - a.executado);
}

export function groupByMonth(transactions: TransactionView[]): MonthlySummary[] {
  const months = new Map<string, MonthlySummary & { sort: string }>();

  transactions.forEach((transaction) => {
    const date = new Date(`${transaction.date}T00:00:00Z`);
    const monthKey = transaction.date.slice(0, 7);
    const current = months.get(monthKey) ?? {
      mes: monthFormatter.format(date).replace('.', ''),
      solicitado: 0,
      executado: 0,
      sort: monthKey,
    };

    current.solicitado += transaction.solicitado;
    current.executado += transaction.executado;
    months.set(monthKey, current);
  });

  return Array.from(months.values())
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .map(({ sort: _sort, ...summary }) => summary);
}

import { useEffect, useState } from 'react';
import { Sidebar, type Page } from './components/Sidebar';
import { DashboardGeral } from './components/DashboardGeral';
import { Financeiro } from './components/Financeiro';
import { PlanoDeTrabalho } from './components/PlanoDeTrabalho';
import { Relatorios } from './components/Relatorios';
import { PrestacaoDeContas } from './components/PrestacaoDeContas';
import { applySupabaseFinanceData } from './components/data';
import { getDashboardTransactions } from '../services/dashboard';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [financTab, setFinancTab] = useState('resumo');
  const [planoTab, setPlanoTab] = useState('atividades');
  const [loadingSupabase, setLoadingSupabase] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getDashboardTransactions()
      .then((transactions) => {
        if (!active) return;
        applySupabaseFinanceData(transactions);
        setSupabaseError(null);
      })
      .catch((error) => {
        if (!active) return;
        setSupabaseError(error instanceof Error ? error.message : 'Não foi possível conectar o dashboard ao Supabase.');
      })
      .finally(() => {
        if (active) setLoadingSupabase(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        current={page}
        onChange={setPage}
        financTab={financTab}
        setFinancTab={setFinancTab}
        planoTab={planoTab}
        setPlanoTab={setPlanoTab}
      />

      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          {loadingSupabase && (
            <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              Sincronizando transações, KPIs e comprovantes reais do Supabase...
            </div>
          )}

          {supabaseError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {supabaseError}
            </div>
          )}

          {page === 'dashboard'  && <DashboardGeral />}
          {page === 'financeiro' && <Financeiro activeTab={financTab} setActiveTab={setFinancTab} />}
          {page === 'prestacao'  && <PrestacaoDeContas />}
          {page === 'plano'      && <PlanoDeTrabalho activeTab={planoTab} setActiveTab={setPlanoTab} />}
          {page === 'relatorios' && <Relatorios />}
        </div>
      </main>
    </div>
  );
}

import { Suspense, lazy, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Sidebar, type Page } from './components/Sidebar';
import { DashboardGeral } from './components/DashboardGeral';
import { Financeiro } from './components/Financeiro';
import { PlanoDeTrabalho } from './components/PlanoDeTrabalho';
import { Relatorios } from './components/Relatorios';
import { PrestacaoDeContas } from './components/PrestacaoDeContas';
import { applySupabaseFinanceData } from './components/data';
import { getDashboardTransactions } from '../services/dashboard';
import { AppConfigProvider, useAppConfig } from '../contexts/AppConfigContext';
import { SkeletonBlock } from '../components/common/SkeletonBlock';

const AdminPanel = lazy(() => import('../features/admin/AdminPanel').then((module) => ({ default: module.AdminPanel })));

function DashboardShell() {
  const [page, setPage] = useState<Page>('dashboard');
  const [financTab, setFinancTab] = useState('resumo');
  const [planoTab, setPlanoTab] = useState('atividades');
  const [loadingSupabase, setLoadingSupabase] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const appConfig = useAppConfig();

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors">
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
          <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-border bg-card/85 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Dashboard RKC · FAJ</p>
              <p className="mt-1 text-sm text-muted-foreground">Dados financeiros, prestação de contas e governança administrativa em uma única operação.</p>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
              aria-pressed={darkMode}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? 'Modo claro' : 'Modo escuro'}
            </button>
          </div>

          {appConfig.loading && (
            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-200">
              Atualizando configurações, logos e parâmetros públicos...
            </div>
          )}

          {appConfig.error && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-100">
              {appConfig.error}
            </div>
          )}
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
          {page === 'admin' && (
            <Suspense fallback={<SkeletonBlock className="h-[70vh]" />}>
              <AdminPanel />
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppConfigProvider>
      <DashboardShell />
    </AppConfigProvider>
  );
}

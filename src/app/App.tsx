import { useState } from 'react';
import { Sidebar, type Page } from './components/Sidebar';
import { DashboardGeral } from './components/DashboardGeral';
import { Financeiro } from './components/Financeiro';
import { PlanoDeTrabalho } from './components/PlanoDeTrabalho';
import { Relatorios } from './components/Relatorios';
import { PrestacaoDeContas } from './components/PrestacaoDeContas';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [financTab, setFinancTab] = useState('resumo');
  const [planoTab, setPlanoTab] = useState('atividades');

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

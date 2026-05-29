import { useState } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { atividades, statusColors, formatCurrency, rubricas } from './data';

const tabs = [
  { id: 'atividades', label: 'Atividades' },
  { id: 'execucao', label: 'Execução' },
  { id: 'relatorios', label: 'Relatórios' },
];

interface PlanoProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
}

export function PlanoDeTrabalho({ activeTab, setActiveTab }: PlanoProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-foreground" style={{ fontSize: 22 }}>Plano de Trabalho</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Atividades e entregas — 1º Semestre 2026</p>
      </div>

      <div className="flex gap-1 bg-secondary rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === t.id ? 'bg-primary text-primary-foreground shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'atividades' && <Atividades />}
      {activeTab === 'execucao' && <Execucao />}
      {activeTab === 'relatorios' && <RelatoriosPlano />}
    </div>
  );
}

function statusIcon(status: string) {
  if (status === 'Concluído') return <CheckCircle size={15} className="text-blue-600" />;
  if (status === 'Em execução' || status === 'Concluído (parcial)') return <Clock size={15} className="text-blue-400" />;
  if (status === 'Iniciado') return <AlertCircle size={15} className="text-blue-300" />;
  return <Circle size={15} className="text-muted-foreground" />;
}

function Atividades() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total de Atividades', value: atividades.length },
          { label: 'Concluídas', value: atividades.filter(a => a.status.startsWith('Concluído')).length },
          { label: 'Em Execução', value: atividades.filter(a => a.status === 'Em execução').length },
          { label: 'Progresso Médio', value: `${Math.round(atividades.reduce((s, a) => s + a.progresso, 0) / atividades.length)}%` },
        ].map((k, i) => (
          <div key={i} className="bg-card rounded-xl p-3 shadow-sm border border-border text-center">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="text-primary mt-0.5 tabular-nums" style={{ fontSize: 20, fontWeight: 600 }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Activities list */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-secondary/60">
            <tr>
              {['#', 'Atividade', 'Rubrica', 'Status', 'Progresso', ''].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {atividades.map((a, i) => (
              <>
                <tr
                  key={a.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                >
                  <td className="py-3 px-4 text-muted-foreground">{i + 1}</td>
                  <td className="py-3 px-4 font-medium text-foreground max-w-xs">
                    <div className="flex items-center gap-2">
                      {statusIcon(a.status)}
                      <span className="line-clamp-2">{a.atividade}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{a.rubrica}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ background: statusColors[a.status] || '#90CAF9' }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${a.progresso}%` }} />
                      </div>
                      <span className="text-primary tabular-nums">{a.progresso}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-primary text-xs">{expanded === a.id ? '▲' : '▼'}</td>
                </tr>
                {expanded === a.id && (
                  <tr key={`exp-${a.id}`} className="bg-secondary/20">
                    <td colSpan={6} className="px-8 py-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">O que foi produzido / entregue:</p>
                      <p className="text-xs text-foreground leading-relaxed">{a.entrega}</p>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Execucao() {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h3 className="text-sm font-medium text-foreground mb-1">Relação Atividade × Rubrica × Justificativa</h3>
        <p className="text-xs text-muted-foreground mb-4">Vinculação entre execução de atividades e rubricas financeiras</p>
        <div className="space-y-3">
          {atividades.map(a => {
            const r = rubricas.find(r => r.nome.includes(a.rubrica.split('/')[0].trim()));
            return (
              <div key={a.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcon(a.status)}
                      <span className="text-sm font-medium text-foreground">{a.atividade}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1.5">
                      <span>Rubrica: <strong className="text-foreground">{a.rubrica}</strong></span>
                      {r && <span>Executado: <strong className="text-primary tabular-nums">{formatCurrency(r.executado)}</strong></span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${a.progresso}%` }} />
                    </div>
                    <span className="text-xs text-primary tabular-nums">{a.progresso}%</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground bg-secondary/40 rounded-lg p-3 leading-relaxed">
                  <strong className="text-foreground">Entrega: </strong>{a.entrega}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RelatoriosPlano() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          {
            titulo: 'Resumo Operacional — 1º Semestre 2026',
            data: 'Período: Janeiro a Junho de 2026',
            conteudo: 'Durante o primeiro semestre de 2026, a Rede Kalunga Comunicações executou atividades de produção jornalística, formação comunitária, fortalecimento de canais digitais e aquisição de equipamentos. O projeto alcançou 62,6% de execução financeira, com destaque para a rubrica de Equipamentos (100% executada) e Canais Digitais (83%). As ações formativas envolveram comunidades Kalunga Engenho II, Vão do Moleque e Riachão.',
          },
          {
            titulo: 'Justificativas de Alterações',
            data: 'Atualizado: Maio 2026',
            conteudo: 'Algumas rubricas apresentaram execução abaixo do previsto em razão das condições climáticas do território, logística de acesso às comunidades no período chuvoso e reorganização de cronograma. O Jornal Impresso e as Séries Temáticas foram postergados para o 2º semestre. As rubricas de Alimentação e Hospedagem foram inseridas para adequar as despesas operacionais das atividades territoriais.',
          },
          {
            titulo: 'Destaques da Execução',
            data: 'Jan–Mai 2026',
            conteudo: 'Produção contínua de conteúdos jornalísticos sobre o Território Quilombola Kalunga. Três oficinas de formação realizadas. Site institucional da RKC desenvolvido e lançado. Equipamentos adquiridos e em pleno uso. Campanhas temáticas executadas, incluindo Campanha RKC contra o feminicídio e Campanha Juntos pela Autonomia do Quilombo Kalunga.',
          },
          {
            titulo: 'Perspectivas para o 2º Semestre',
            data: 'Jun–Dez 2026',
            conteudo: 'Para o segundo semestre, estão previstas: impressão e distribuição do jornal comunitário, realização das séries temáticas (Cerrado, Juventude Quilombola e Ancestralidade), intercâmbios presenciais com outras mídias, intensificação das ações formativas e consolidação dos canais digitais. O saldo disponível de R$ 74.180,00 será utilizado nas rubricas com menor execução.',
          },
        ].map((r, i) => (
          <div key={i} className="bg-card rounded-xl p-5 shadow-sm border border-border">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold text-foreground">{r.titulo}</h3>
              <span className="text-xs text-muted-foreground shrink-0">{r.data}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.conteudo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

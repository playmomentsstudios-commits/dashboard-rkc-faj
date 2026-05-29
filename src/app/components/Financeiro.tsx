import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { monthlyData, rubricas, totalSolicitado, totalExecutado, totalDiferenca, percentualExecutado, formatCurrency } from './data';

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #E3EAF6', borderRadius: 8, fontSize: 12 };

const tabs = [
  { id: 'resumo', label: 'Resumo Financeiro' },
  { id: 'rubricas', label: 'Rubricas' },
  { id: 'comparativo', label: 'Comparativo Mensal' },
];

interface FinanceiroProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
}

export function Financeiro({ activeTab, setActiveTab }: FinanceiroProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-foreground" style={{ fontSize: 22 }}>Financeiro</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Prestação de Contas Financeira 2026.1 — Dezembro/2025 a Maio/2026</p>
      </div>

      {/* Tabs */}
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

      {activeTab === 'resumo' && <ResumoFinanceiro />}
      {activeTab === 'rubricas' && <Rubricas />}
      {activeTab === 'comparativo' && <ComparativoMensal />}
    </div>
  );
}

function ResumoFinanceiro() {
  const acum = monthlyData.map((m, i) => ({
    ...m,
    acumSol: monthlyData.slice(0, i + 1).reduce((a, b) => a + b.solicitado, 0),
    acumExec: monthlyData.slice(0, i + 1).reduce((a, b) => a + b.executado, 0),
    saldo: monthlyData.slice(0, i + 1).reduce((a, b) => a + b.solicitado - b.executado, 0),
  }));

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Solicitado', value: formatCurrency(totalSolicitado), sub: 'Orçamento aprovado 2026.1' },
          { label: 'Total Executado', value: formatCurrency(totalExecutado), sub: `${percentualExecutado}% realizado` },
          { label: 'Saldo a Executar', value: formatCurrency(totalDiferenca), sub: 'Disponível para 2º semestre' },
          { label: 'Percentual Executado', value: `${percentualExecutado}%`, sub: 'Meta de execução: 100%' },
        ].map((k, i) => (
          <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-1 tabular-nums text-primary" style={{ fontSize: 18, fontWeight: 600 }}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly table */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border overflow-x-auto">
        <h3 className="text-sm text-muted-foreground mb-4">Totais por Mês</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {['Mês', 'Solicitado', 'Executado', 'Saldo Mensal', 'Acum. Executado', '% Executado'].map(h => (
                <th key={h} className="text-left py-2 pr-4 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {acum.map((row, i) => {
              const pct = Math.round((row.executado / row.solicitado) * 100);
              return (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-2.5 pr-4 font-medium text-foreground">{row.mes}/2026</td>
                  <td className="py-2.5 pr-4 tabular-nums text-muted-foreground">{formatCurrency(row.solicitado)}</td>
                  <td className="py-2.5 pr-4 tabular-nums text-primary font-medium">{formatCurrency(row.executado)}</td>
                  <td className="py-2.5 pr-4 tabular-nums text-muted-foreground">{formatCurrency(row.solicitado - row.executado)}</td>
                  <td className="py-2.5 pr-4 tabular-nums text-foreground">{formatCurrency(row.acumExec)}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="tabular-nums text-primary">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-secondary/60 font-semibold">
              <td className="py-2.5 pr-4 text-foreground">TOTAL</td>
              <td className="py-2.5 pr-4 tabular-nums text-foreground">{formatCurrency(totalSolicitado)}</td>
              <td className="py-2.5 pr-4 tabular-nums text-primary">{formatCurrency(totalExecutado)}</td>
              <td className="py-2.5 pr-4 tabular-nums text-foreground">{formatCurrency(totalDiferenca)}</td>
              <td className="py-2.5 pr-4 tabular-nums text-foreground">—</td>
              <td className="py-2.5 text-primary">{percentualExecutado}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Indicadores saldo */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h3 className="text-sm text-muted-foreground mb-4">Indicador de Saldo Acumulado</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={acum}>
            <defs>
              <linearGradient id="gradSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1565C0" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF6" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#5A6A85' }} />
            <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5A6A85' }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
            <Area type="monotone" dataKey="saldo" name="Saldo Disponível" stroke="#1565C0" fill="url(#gradSaldo)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Rubricas() {
  const [selected, setSelected] = useState<number | null>(null);
  const sel = rubricas.find(r => r.id === selected);

  const rubricaMonth = [
    { mes: 'Jan', solicitado: 6000, executado: 4000 },
    { mes: 'Fev', solicitado: 6000, executado: 5200 },
    { mes: 'Mar', solicitado: 6000, executado: 4800 },
    { mes: 'Abr', solicitado: 6000, executado: 5500 },
    { mes: 'Mai', solicitado: 6000, executado: 3800 },
    { mes: 'Jun', solicitado: 6000, executado: 2200 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rubricas.map(r => {
          const pct = Math.round((r.executado / r.solicitado) * 100);
          return (
            <button
              key={r.id}
              onClick={() => setSelected(selected === r.id ? null : r.id)}
              className={`bg-card rounded-xl p-4 shadow-sm border text-left transition-all hover:shadow-md ${selected === r.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.nome}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                    <span>Sol: <strong className="text-foreground tabular-nums">{formatCurrency(r.solicitado)}</strong></span>
                    <span>Exec: <strong className="text-primary tabular-nums">{formatCurrency(r.executado)}</strong></span>
                  </div>
                  <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: r.cor }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-semibold tabular-nums" style={{ color: r.cor }}>{pct}%</span>
                  <p className="text-xs text-muted-foreground mt-0.5">executado</p>
                </div>
              </div>
              <div className="mt-2 flex gap-3 text-xs">
                <span className="text-muted-foreground">Diferença: <span className="text-foreground tabular-nums">{formatCurrency(r.solicitado - r.executado)}</span></span>
              </div>
            </button>
          );
        })}
      </div>

      {sel && (
        <div className="bg-card rounded-xl p-5 shadow-sm border border-primary/30">
          <h3 className="text-sm font-medium text-foreground mb-1">{sel.nome}</h3>
          <p className="text-xs text-muted-foreground mb-4">Evolução mensal estimada</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rubricaMonth} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF6" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#5A6A85' }} />
              <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5A6A85' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="solicitado" name="Solicitado" fill="#90CAF9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="executado" name="Executado" fill={sel.cor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function ComparativoMensal() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Barras agrupadas */}
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h3 className="text-sm text-muted-foreground mb-4">Solicitado × Executado (Barras)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF6" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#5A6A85' }} />
              <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5A6A85' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="solicitado" name="Solicitado" fill="#90CAF9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="executado" name="Executado" fill="#1565C0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Linha tendência */}
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h3 className="text-sm text-muted-foreground mb-4">Tendência Mensal (Linha)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF6" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#5A6A85' }} />
              <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5A6A85' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="solicitado" name="Solicitado" stroke="#90CAF9" strokeWidth={2} dot={false} strokeDasharray="5 3" />
              <Line type="monotone" dataKey="executado" name="Executado" stroke="#1565C0" strokeWidth={2.5} dot={{ r: 4, fill: '#1565C0' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diferença mensal */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h3 className="text-sm text-muted-foreground mb-4">Diferença Mensal (Solicitado − Executado)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthlyData.map(m => ({ ...m, diferenca: m.solicitado - m.executado }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF6" />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#5A6A85' }} />
            <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5A6A85' }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
            <Bar dataKey="diferenca" name="Diferença" fill="#42A5F5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela comparativa */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border overflow-x-auto">
        <h3 className="text-sm text-muted-foreground mb-4">Comparativo Detalhado</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {['Mês', 'Solicitado', 'Executado', 'Diferença', '% Exec.'].map(h => (
                <th key={h} className="text-left py-2 pr-6 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((row, i) => {
              const pct = Math.round((row.executado / row.solicitado) * 100);
              const diff = row.solicitado - row.executado;
              return (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-2.5 pr-6 font-medium text-foreground">{row.mes}/2026</td>
                  <td className="py-2.5 pr-6 tabular-nums text-muted-foreground">{formatCurrency(row.solicitado)}</td>
                  <td className="py-2.5 pr-6 tabular-nums text-primary font-medium">{formatCurrency(row.executado)}</td>
                  <td className="py-2.5 pr-6 tabular-nums text-muted-foreground">{formatCurrency(diff)}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pct >= 80 ? 'bg-blue-100 text-blue-700' : pct >= 50 ? 'bg-blue-50 text-blue-600' : 'bg-secondary text-muted-foreground'}`}>
                      {pct}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

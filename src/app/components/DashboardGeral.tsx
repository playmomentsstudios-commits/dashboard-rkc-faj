import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingDown, Activity, FileCheck } from 'lucide-react';
import { monthlyData, rubricas, totalSolicitado, totalExecutado, totalDiferenca, percentualExecutado, formatCurrency, transacoes } from './data';

const PIE_COLORS = ['#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#42A5F5', '#64B5F6'];
const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #E3EAF6', borderRadius: 8, fontSize: 12 };

export function DashboardGeral() {
  const pieData = rubricas
    .filter(r => r.executado > 0)
    .map((r, i) => ({ name: r.nome.split('/')[0].trim(), value: r.executado, fill: PIE_COLORS[i % PIE_COLORS.length] }));

  const monthlyRows = monthlyData.map((m) => ({
    ...m,
    saldo: m.solicitado - m.executado,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground" style={{ fontSize: 22 }}>Dashboard Geral</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Prestação de Contas Financeira 2026.1 — Dezembro/2025 a Maio/2026
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Solicitado"   value={formatCurrency(totalSolicitado)} icon={<DollarSign size={20}/>} sub="Orçamento aprovado" color="#1565C0" bg="#EBF2FF" />
        <KpiCard label="Total Executado"    value={formatCurrency(totalExecutado)}  icon={<FileCheck size={20}/>}  sub={`${percentualExecutado}% do orçamento`} color="#1E88E5" bg="#E8F3FE" />
        <KpiCard label="Saldo Disponível"   value={formatCurrency(totalDiferenca)}  icon={<TrendingDown size={20}/>} sub="Recursos a executar" color="#0D47A1" bg="#E3EAF6" />
        <KpiCard label="% Executado" value={`${percentualExecutado}%`} icon={<Activity size={20}/>} sub={`${transacoes.length} transações comprovadas`} color="#1565C0" bg="#EBF2FF" progress={percentualExecutado} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-sm border border-border">
          <h3 className="text-sm text-muted-foreground mb-4">Solicitado × Executado por Período</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF6" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#5A6A85' }} />
              <YAxis tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5A6A85' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="solicitado" name="Solicitado" fill="#90CAF9" radius={[4,4,0,0]} />
              <Bar dataKey="executado"  name="Executado"  fill="#1565C0" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h3 className="text-sm text-muted-foreground mb-3">Distribuição — Executado</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1.5">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-muted-foreground truncate flex-1">{d.name}</span>
                    <span className="text-foreground tabular-nums">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">Sem dados executados</div>
          )}
        </div>
      </div>

      {/* Evolução mensal */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h3 className="text-sm text-muted-foreground mb-4">Evolução Mensal — valores do mês</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={monthlyRows}>
            <defs>
              <linearGradient id="gradExec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1565C0" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#90CAF9" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#90CAF9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF6" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#5A6A85' }} />
            <YAxis tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#5A6A85' }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="solicitado" name="Solicitado no mês" stroke="#90CAF9" fill="url(#gradSol)" strokeWidth={2} strokeDasharray="4 2" />
            <Area type="monotone" dataKey="executado" name="Executado no mês" stroke="#1565C0" fill="url(#gradExec)" strokeWidth={2.5} dot={{ r: 4, fill: '#1565C0' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Rubricas overview */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-muted-foreground">Rubricas — Visão Geral</h3>
          <span className="text-xs text-muted-foreground">{rubricas.filter(r => r.executado > 0).length} de {rubricas.length} com movimentação</span>
        </div>
        <div className="space-y-3">
          {rubricas.map(r => {
            const pct = r.solicitado > 0 ? Math.round((r.executado / r.solicitado) * 100) : 0;
            return (
              <div key={r.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground">{r.nome}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatCurrency(r.executado)} / {formatCurrency(r.solicitado)}
                    <span className="ml-2 text-primary font-medium">{pct}%</span>
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: r.cor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest transactions */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-muted-foreground">Últimas Transações Comprovadas</h3>
          <span className="text-xs text-primary">{transacoes.length} total</span>
        </div>
        <div className="space-y-2">
          {transacoes.slice(0, 5).map(t => (
            <div key={t.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <DollarSign size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{t.favorecido}</p>
                <p className="text-xs text-muted-foreground">{t.data} · {t.rubrica}</p>
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">{formatCurrency(t.valor)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, sub, color, bg, progress }: {
  label: string; value: string; icon: React.ReactNode; sub: string;
  color: string; bg: string; progress?: number;
}) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 tabular-nums" style={{ fontSize: 17, fontWeight: 600, color }}>{value}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: bg, color }}>{icon}</div>
      </div>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%`, background: color }} />
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2">{sub}</p>
    </div>
  );
}

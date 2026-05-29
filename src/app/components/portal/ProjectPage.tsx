import { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, ExternalLink, FileText, PieChart as PieIcon, Receipt, Wallet } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useProjectDashboard } from '../../../hooks/useProjectDashboard';
import { resolveComprovanteUrls } from '../../../services/comprovantes';
import type { TransactionView } from '../../../types/supabase';
import { formatCurrency, formatDate } from '../data';
import { EmptyState, ErrorState, LoadingState } from './States';

const colors = ['#0f172a', '#1d4ed8', '#0284c7', '#0ea5e9', '#38bdf8', '#93c5fd', '#bfdbfe'];
const tooltipStyle = { borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)' };

export function ProjectPage({ slug }: { slug: string }) {
  const { data, loading, error } = useProjectDashboard(slug);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionView | null>(null);

  const pieData = useMemo(() => data?.rubricas.filter((rubrica) => rubrica.executado > 0).map((rubrica) => ({ name: rubrica.rubrica, value: rubrica.executado })) ?? [], [data]);

  if (loading) return <LoadingState label="Sincronizando projeto, transações e comprovantes..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState title="Projeto não encontrado" description="Verifique o slug informado na URL ou publique este projeto na tabela projects." />;

  const { project, transactions, metrics, rubricas, monthly } = data;

  return (
    <div className="space-y-6">
      <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"><ArrowLeft size={16} /> Todos os projetos</a>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm md:p-9">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">{project.slug}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">{project.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{project.description ?? 'Dashboard financeiro institucional com dados públicos sincronizados.'}</p>
          </div>
          <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">Organização</p>
            <p className="mt-2 text-lg font-semibold">{project.organization ?? 'Não informada'}</p>
            <p className="mt-4 text-sm text-white/60">{project.semester ?? 'Semestre aberto'} · {formatDate(project.start_date)} a {formatDate(project.end_date)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total solicitado" value={formatCurrency(metrics.totalSolicitado)} icon={<Wallet size={18} />} helper="Somatório de transactions.solicitado" />
        <KpiCard label="Total executado" value={formatCurrency(metrics.totalExecutado)} icon={<Receipt size={18} />} helper={`${metrics.percentualExecutado}% do orçamento`} />
        <KpiCard label="Saldo disponível" value={formatCurrency(metrics.saldoDisponivel)} icon={<BarChart3 size={18} />} helper="Solicitado menos executado" />
        <KpiCard label="Percentual executado" value={`${metrics.percentualExecutado}%`} icon={<PieIcon size={18} />} helper={`${transactions.length} transações sincronizadas`} progress={metrics.percentualExecutado} />
      </section>

      {transactions.length === 0 ? (
        <EmptyState title="Nenhuma transação relacionada" description="Quando transactions receber registros com este project_id, KPIs, gráficos e tabela serão preenchidos automaticamente." />
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
            <ChartCard title="Solicitado vs. executado" subtitle="Agrupamento mensal por data da transação">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthly} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tickFormatter={(value) => `R$${Number(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="solicitado" name="Solicitado" fill="#bfdbfe" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="executado" name="Executado" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Distribuição por rubrica" subtitle="Execução financeira por categoria">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
                    {pieData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {rubricas.slice(0, 6).map((rubrica, index) => (
                  <div key={rubrica.rubrica} className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[index % colors.length] }} />
                    <span className="flex-1 truncate">{rubrica.rubrica}</span>
                    <span className="font-semibold text-slate-950">{formatCurrency(rubrica.executado)}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </section>

          <ChartCard title="Evolução mensal" subtitle="Linha de execução acumulada sobre dados reais">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="executadoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickFormatter={(value) => `R$${Number(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="executado" name="Executado" stroke="#1d4ed8" fill="url(#executadoGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <TransactionsTable transactions={transactions} onSelect={setSelectedTransaction} />
        </>
      )}

      <TransactionDrawer transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
    </div>
  );
}

function KpiCard({ label, value, icon, helper, progress }: { label: string; value: string; icon: React.ReactNode; helper: string; progress?: number }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">{icon}</span>
        {typeof progress === 'number' && <span className="text-xs font-semibold text-blue-700">{progress}%</span>}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{helper}</p>
      {typeof progress === 'number' && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-700" style={{ width: `${Math.min(progress, 100)}%` }} /></div>}
    </article>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function TransactionsTable({ transactions, onSelect }: { transactions: TransactionView[]; onSelect: (transaction: TransactionView) => void }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-slate-950">Transações</h2>
        <p className="text-sm text-slate-500">Tabela premium com detalhes e comprovantes em drawer lateral.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Data</th>
              <th className="px-5 py-4 font-semibold">Transação</th>
              <th className="px-5 py-4 font-semibold">Rubrica</th>
              <th className="px-5 py-4 text-right font-semibold">Valor</th>
              <th className="px-5 py-4 text-center font-semibold">PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((transaction) => {
              const urls = resolveComprovanteUrls(transaction.comprovante_url);
              return (
                <tr key={transaction.id} className="cursor-pointer transition hover:bg-slate-50" onClick={() => onSelect(transaction)}>
                  <td className="px-5 py-4 text-slate-500">{formatDate(transaction.date)}</td>
                  <td className="px-5 py-4"><p className="font-medium text-slate-950">{transaction.title}</p><p className="mt-1 line-clamp-1 text-xs text-slate-500">{transaction.favorecido ?? transaction.description}</p></td>
                  <td className="px-5 py-4 text-slate-600">{transaction.rubrica ?? '—'}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-950">{formatCurrency(transaction.executado || transaction.solicitado)}</td>
                  <td className="px-5 py-4 text-center">{urls.primaryUrl ? <a className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700" href={urls.primaryUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><FileText size={13} /> PDF</a> : <span className="text-xs text-slate-400">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TransactionDrawer({ transaction, onClose }: { transaction: TransactionView | null; onClose: () => void }) {
  if (!transaction) return null;

  const urls = resolveComprovanteUrls(transaction.comprovante_url);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" onClick={onClose}>
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Detalhes da transação</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{transaction.title}</h2>
          </div>
          <button className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 hover:bg-slate-50" onClick={onClose}>Fechar</button>
        </div>

        <dl className="mt-8 grid gap-4 rounded-3xl bg-slate-50 p-5 text-sm">
          <Info label="Data" value={formatDate(transaction.date)} />
          <Info label="Rubrica" value={transaction.rubrica ?? '—'} />
          <Info label="Valor executado" value={formatCurrency(transaction.executado)} />
          <Info label="Valor solicitado" value={formatCurrency(transaction.solicitado)} />
          <Info label="Favorecido" value={transaction.favorecido ?? '—'} />
          <Info label="Status" value={transaction.status ?? '—'} />
        </dl>

        <div className="mt-6 rounded-3xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-950">Descrição completa</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{transaction.description ?? 'Sem descrição complementar.'}</p>
        </div>

        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-slate-950">Comprovantes</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <ProofLink label="Visualizar PDF" url={urls.primaryUrl} />
            <ProofLink label="Google Drive" url={urls.driveUrl} />
            <ProofLink label="Supabase Storage" url={urls.storageUrl} />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-white pb-3 last:border-0 last:pb-0"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium text-slate-950">{value}</dd></div>;
}

function ProofLink({ label, url }: { label: string; url: string | null }) {
  return url ? <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-3 text-xs font-semibold text-white hover:bg-blue-700">{label}<ExternalLink size={13} /></a> : <span className="inline-flex items-center justify-center rounded-2xl border border-dashed border-slate-200 px-3 py-3 text-xs text-slate-400">{label}</span>;
}

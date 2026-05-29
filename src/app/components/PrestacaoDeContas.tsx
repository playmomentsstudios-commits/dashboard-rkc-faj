import { useState } from 'react';
import { Paperclip, ExternalLink, X, Search, Filter, CheckCircle, Eye } from 'lucide-react';
import { transacoes, formatCurrency, Transacao, rubricas } from './data';

const DRIVE_URL =
  'https://drive.google.com/drive/folders/1vh-w-zPeJ7sA4mkCigJ_JAWDFDEsvV_p';

export function PrestacaoDeContas() {
  const [busca, setBusca] = useState('');
  const [filtroRubrica, setFiltroRubrica] = useState('Todas');
  const [modal, setModal] = useState<Transacao | null>(null);

  const rubrNames = ['Todas', ...Array.from(new Set(transacoes.map(t => t.rubrica)))];

  const filtradas = transacoes.filter(t => {
    const q = busca.toLowerCase();

    const matchBusca =
      !q ||
      t.favorecido?.toLowerCase().includes(q) ||
      t.descricao?.toLowerCase().includes(q) ||
      t.rubrica?.toLowerCase().includes(q) ||
      t.valor?.toString().includes(q);

    const matchRubrica =
      filtroRubrica === 'Todas' || t.rubrica === filtroRubrica;

    return matchBusca && matchRubrica;
  });

  const totalFiltrado = filtradas.reduce((s, t) => s + t.valor, 0);
  const totalGeral = transacoes.reduce((s, t) => s + t.valor, 0);

  const openComprovantes = () => {
    window.open(DRIVE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-foreground" style={{ fontSize: 22 }}>
          Prestação de Contas
        </h1>

        <p className="text-muted-foreground text-sm mt-0.5">
          Transações comprovadas — Dez/2025 a Mai/2026 · Conta: Ag 0001 Cc
          6306712-1 · CNPJ: 61.657.428/0001-04
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          label="Transações"
          value={String(transacoes.length)}
          sub="Comprovantes anexados"
        />

        <SummaryCard
          label="Total Executado"
          value={formatCurrency(totalGeral)}
          sub="Jan/2026"
        />

        <SummaryCard
          label="Rubricas"
          value={String(rubricas.filter(r => r.executado > 0).length)}
          sub="Com movimentação"
        />

        <SummaryCard
          label="Comprovação"
          value="100%"
          sub="Todas documentadas"
          green
        />
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por favorecido, rubrica, descrição…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary rounded-lg border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Filter size={15} className="text-muted-foreground" />

            <select
              value={filtroRubrica}
              onChange={e => setFiltroRubrica(e.target.value)}
              className="text-sm bg-secondary rounded-lg border border-border text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
            >
              {rubrNames.map(r => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {(busca || filtroRubrica !== 'Todas') && (
          <div className="mt-2 text-xs text-muted-foreground">
            {filtradas.length} resultado(s) · Total filtrado:{' '}
            <strong className="text-primary">
              {formatCurrency(totalFiltrado)}
            </strong>
          </div>
        )}
      </div>

      {/* Transaction table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary/60 sticky top-0">
              <tr>
                {[
                  '#',
                  'Data',
                  'Favorecido',
                  'Rubrica',
                  'Descrição',
                  'Tipo',
                  'Valor',
                  'Comprovantes'
                ].map(h => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-muted-foreground font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtradas.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-b border-border/40 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-4 text-muted-foreground tabular-nums">
                    {i + 1}
                  </td>

                  <td className="py-3 px-4 text-foreground whitespace-nowrap tabular-nums">
                    {t.data}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => setModal(t)}
                      className="text-primary hover:underline font-medium text-left"
                    >
                      {t.favorecido || 'Não informado'}
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-foreground whitespace-nowrap">
                      {t.rubrica}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-muted-foreground max-w-xs">
                    <span className="line-clamp-2">{t.descricao}</span>
                  </td>

                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                    {t.tipo}
                  </td>

                  <td className="py-3 px-4 tabular-nums font-semibold text-foreground whitespace-nowrap">
                    {formatCurrency(t.valor)}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setModal(t)}
                        title="Ver detalhes"
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary hover:bg-primary/10 text-primary transition-colors text-xs font-medium"
                      >
                        <Eye size={12} />
                        Detalhes
                      </button>

                      <button
                        onClick={openComprovantes}
                        title="Ver comprovantes"
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-xs font-medium"
                      >
                        <Paperclip size={12} />
                        Comprovantes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtradas.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Nenhuma transação encontrada
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot className="bg-secondary/60 border-t-2 border-border">
              <tr>
                <td
                  colSpan={6}
                  className="py-3 px-4 text-sm font-semibold text-foreground"
                >
                  {filtradas.length} transação(ões) exibida(s)
                </td>

                <td className="py-3 px-4 text-sm font-bold text-primary tabular-nums whitespace-nowrap">
                  {formatCurrency(totalFiltrado)}
                </td>

                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Auditoria summary */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={16} className="text-primary" />

          <h3 className="text-sm font-semibold text-foreground">
            Status de Auditoria Documental
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-xs text-muted-foreground">
              Transações com comprovante
            </p>

            <p
              className="text-primary mt-1"
              style={{ fontSize: 20, fontWeight: 700 }}
            >
              {transacoes.length}/{transacoes.length}
            </p>

            <p className="text-xs text-muted-foreground mt-0.5">
              100% documentadas
            </p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-xs text-muted-foreground">
              Valor total comprovado
            </p>

            <p
              className="text-primary mt-1 tabular-nums"
              style={{ fontSize: 20, fontWeight: 700 }}
            >
              {formatCurrency(totalGeral)}
            </p>

            <p className="text-xs text-muted-foreground mt-0.5">
              Via PIX / Cora SCFI
            </p>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-xs text-muted-foreground">
              Período coberto
            </p>

            <p
              className="text-primary mt-1"
              style={{ fontSize: 20, fontWeight: 700 }}
            >
              Jan/2026
            </p>

            <p className="text-xs text-muted-foreground mt-0.5">
              CNPJ 61.657.428/0001-04
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setModal(null)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b border-border"
              style={{
                background:
                  'linear-gradient(135deg, #0D47A1, #1565C0)'
              }}
            >
              <div>
                <p className="text-xs text-white/70">
                  Comprovante de Transação
                </p>

                <p className="text-white font-semibold mt-0.5">
                  {modal.id}
                </p>
              </div>

              <button
                onClick={() => setModal(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Amount */}
            <div className="px-6 py-5 border-b border-border">
              <p className="text-xs text-muted-foreground">
                Valor Executado
              </p>

              <p
                className="text-primary tabular-nums mt-1"
                style={{ fontSize: 28, fontWeight: 700 }}
              >
                {formatCurrency(modal.valor)}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {modal.data} · {modal.tipo}
              </p>
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-3">
              <DetailRow
                label="Favorecido"
                value={modal.favorecido || 'Não informado'}
              />

              <DetailRow label="Banco" value={modal.banco} />

              <DetailRow label="Rubrica" value={modal.rubrica} />

              <DetailRow
                label="Descrição"
                value={modal.descricao}
              />

              <DetailRow
                label="ID da Transação"
                value={modal.txId}
                mono
              />
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={openComprovantes}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background:
                    'linear-gradient(135deg, #0D47A1, #1565C0)'
                }}
              >
                <Paperclip size={15} />
                Ver comprovantes
              </button>

              <button
                onClick={openComprovantes}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
              >
                <ExternalLink size={15} />
                Nova aba
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  green
}: {
  label: string;
  value: string;
  sub: string;
  green?: boolean;
}) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p
        className="mt-1 tabular-nums"
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: green ? '#1976D2' : '#1565C0'
        }}
      >
        {value}
      </p>

      <p className="text-xs text-muted-foreground mt-1">
        {sub}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <span className="text-xs text-muted-foreground shrink-0 w-28">
        {label}
      </span>

      <span
        className={`text-xs text-foreground flex-1 break-all leading-relaxed ${
          mono
            ? 'font-mono text-[10px] text-muted-foreground'
            : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}

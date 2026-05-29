import { FileText, Download, Calendar, CheckCircle } from 'lucide-react';
import { totalSolicitado, totalExecutado, totalDiferenca, percentualExecutado, formatCurrency, atividades, rubricas } from './data';
import fajLogo from '../../imports/FAJ-Azul.png';
import kaluLogo from '../../imports/logo_negativa_RKC.png';

export function Relatorios() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground" style={{ fontSize: 22 }}>Relatórios Institucionais</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Documentos de prestação de contas — PC Financeira 2026.1</p>
      </div>

      {/* Header do relatório institucional */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-5" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img src={fajLogo} alt="FAJ" className="h-10 object-contain brightness-0 invert" />
              <div className="w-px h-10 bg-white/20" />
              <img src={kaluLogo} alt="Rede Kalunga" className="h-9 object-contain" />
            </div>
            <div className="text-right text-white">
              <p className="text-sm font-semibold">Prestação de Contas Financeira</p>
              <p className="text-xs text-white/70 mt-0.5">Período: Janeiro – Junho 2026</p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 600 }}>Relatório Financeiro Consolidado — 2026.1</h2>
            <p className="text-white/70 text-sm mt-1">Rede Kalunga Comunicações — Apoio FAJ (Fundo de Apoio ao Jornalismo)</p>
          </div>
        </div>

        {/* KPIs no relatório */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-border">
          {[
            { label: 'Total Solicitado', value: formatCurrency(totalSolicitado) },
            { label: 'Total Executado', value: formatCurrency(totalExecutado) },
            { label: 'Saldo Disponível', value: formatCurrency(totalDiferenca) },
            { label: 'Taxa de Execução', value: `${percentualExecutado}%` },
          ].map((k, i) => (
            <div key={i} className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-primary tabular-nums mt-0.5" style={{ fontSize: 16, fontWeight: 600 }}>{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Relatório narrativo */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border space-y-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <FileText size={18} className="text-primary" />
          <h2 className="text-foreground" style={{ fontSize: 16, fontWeight: 600 }}>1. Resumo Executivo</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A Rede Kalunga Comunicações (RKC) executou, no período de janeiro a junho de 2026, o conjunto de atividades previstas no plano de trabalho apoiado pelo Fundo de Apoio ao Jornalismo (FAJ). O projeto visa fortalecer a comunicação comunitária e o jornalismo territorial no Quilombo Kalunga, Goiás, por meio de produção de conteúdo, formação, tecnologia e equipamentos.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          No semestre, foram realizadas coberturas jornalísticas contínuas, três oficinas de formação em comunidades quilombolas, desenvolvimento e lançamento do site institucional da RKC, aquisição de equipamentos de comunicação e produção de campanhas temáticas de alcance territorial.
        </p>

        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">2. Atividades Realizadas</h3>
          </div>
          <div className="space-y-2">
            {atividades.map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-xs text-muted-foreground tabular-nums pt-0.5 w-4 shrink-0">{i + 1}.</span>
                <div>
                  <span className="text-foreground font-medium">{a.atividade}</span>
                  <span className="text-muted-foreground"> — Rubrica: {a.rubrica}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">3. Execução Financeira por Rubrica</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {['Rubrica', 'Solicitado', 'Executado', 'Diferença', '% Exec.'].map(h => (
                    <th key={h} className="text-left py-2 pr-6 text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rubricas.map(r => {
                  const pct = Math.round((r.executado / r.solicitado) * 100);
                  return (
                    <tr key={r.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                      <td className="py-2.5 pr-6 text-foreground">{r.nome}</td>
                      <td className="py-2.5 pr-6 tabular-nums text-muted-foreground">{formatCurrency(r.solicitado)}</td>
                      <td className="py-2.5 pr-6 tabular-nums text-primary font-medium">{formatCurrency(r.executado)}</td>
                      <td className="py-2.5 pr-6 tabular-nums text-muted-foreground">{formatCurrency(r.solicitado - r.executado)}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="tabular-nums text-primary">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-secondary/60 font-semibold">
                  <td className="py-2.5 pr-6 text-foreground">TOTAL GERAL</td>
                  <td className="py-2.5 pr-6 tabular-nums text-foreground">{formatCurrency(totalSolicitado)}</td>
                  <td className="py-2.5 pr-6 tabular-nums text-primary">{formatCurrency(totalExecutado)}</td>
                  <td className="py-2.5 pr-6 tabular-nums text-foreground">{formatCurrency(totalDiferenca)}</td>
                  <td className="py-2.5 text-primary">{percentualExecutado}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">4. Observações e Justificativas</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary mt-0.5">•</span>A execução abaixo do previsto em algumas rubricas (Jornal Impresso, Séries Temáticas) se deve às condições climáticas no período chuvoso e logística territorial.</li>
            <li className="flex gap-2"><span className="text-primary mt-0.5">•</span>As rubricas de Alimentação e Hospedagem foram inseridas para adequar despesas operacionais vinculadas às atividades nas comunidades quilombolas.</li>
            <li className="flex gap-2"><span className="text-primary mt-0.5">•</span>A rubrica Equipamentos foi executada em 100%, com aquisição de todos os itens previstos no plano.</li>
            <li className="flex gap-2"><span className="text-primary mt-0.5">•</span>O saldo remanescente de {formatCurrency(totalDiferenca)} será utilizado no 2º semestre de 2026, conforme cronograma ajustado.</li>
          </ul>
        </div>
      </div>

      {/* Documentos disponíveis */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">Documentos Disponíveis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Planilha PC Financeira 2026.1',
            'Plano de Trabalho — 2 PLANO DE TRABALHO',
            'Relatório de Atividades Jan–Jun 2026',
            'Notas Fiscais e Comprovantes',
            'Fotos e Registros das Oficinas',
            'Site institucional RKC',
          ].map((doc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/40 transition-colors cursor-pointer">
              <FileText size={16} className="text-primary shrink-0" />
              <span className="text-sm text-foreground flex-1">{doc}</span>
              <Download size={14} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer institucional */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <img src={fajLogo} alt="FAJ" className="h-8 object-contain opacity-50" />
          <img src={kaluLogo} alt="Rede Kalunga" className="h-8 object-contain opacity-50" />
        </div>
        <p className="text-xs text-muted-foreground mt-3">Prestação de Contas Financeira 2026.1 · Rede Kalunga Comunicações · Apoio FAJ</p>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { FileText, Download, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import {
  totalSolicitado,
  totalExecutado,
  totalDiferenca,
  percentualExecutado,
  formatCurrency,
  atividades,
  rubricas
} from './data';

import fajLogo from '../../imports/FAJ-Azul.png';
import kaluLogo from '../../imports/logo_negativa_RKC.png';

type ReportDocument = {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
};

export function Relatorios() {
  const [documents, setDocuments] = useState<ReportDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      setLoadingDocs(true);

      const { data, error } = await supabase
        .from('report_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar documentos:', error);
      } else {
        setDocuments(data || []);
      }

      setLoadingDocs(false);
    }

    loadDocuments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground" style={{ fontSize: 22 }}>
          Relatórios Institucionais
        </h1>

        <p className="text-muted-foreground text-sm mt-0.5">
          Documentos de prestação de contas — PC Financeira 2026.1
        </p>
      </div>

      {/* Header do relatório institucional */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div
          className="p-5"
          style={{
            background:
              'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)'
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img
                src={fajLogo}
                alt="FAJ"
                className="h-10 object-contain brightness-0 invert"
              />

              <div className="w-px h-10 bg-white/20" />

              <img
                src={kaluLogo}
                alt="Rede Kalunga"
                className="h-9 object-contain"
              />
            </div>

            <div className="text-right text-white">
              <p className="text-sm font-semibold">
                Prestação de Contas Financeira
              </p>

              <p className="text-xs text-white/70 mt-0.5">
                Período: Janeiro – Junho 2026
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h2
              className="text-white"
              style={{ fontSize: 18, fontWeight: 600 }}
            >
              Relatório Financeiro Consolidado — 2026.1
            </h2>

            <p className="text-white/70 text-sm mt-1">
              Rede Kalunga Comunicações — Apoio FAJ (Fundo de Apoio ao
              Jornalismo)
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-border">
          {[
            {
              label: 'Total Solicitado',
              value: formatCurrency(totalSolicitado)
            },
            {
              label: 'Total Executado',
              value: formatCurrency(totalExecutado)
            },
            {
              label: 'Saldo Disponível',
              value: formatCurrency(totalDiferenca)
            },
            {
              label: 'Taxa de Execução',
              value: `${percentualExecutado}%`
            }
          ].map((k, i) => (
            <div key={i} className="p-4 text-center">
              <p className="text-xs text-muted-foreground">
                {k.label}
              </p>

              <p
                className="text-primary tabular-nums mt-0.5"
                style={{ fontSize: 16, fontWeight: 600 }}
              >
                {k.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* restante do componente mantido igual */}

      {/* Documentos disponíveis */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Documentos Disponíveis
        </h3>

        {loadingDocs ? (
          <p className="text-sm text-muted-foreground">
            Carregando documentos...
          </p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum documento encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/40 transition-colors"
              >
                <FileText
                  size={16}
                  className="text-primary shrink-0"
                />

                <span className="text-sm text-foreground flex-1">
                  {doc.title}
                </span>

                <Download
                  size={14}
                  className="text-muted-foreground"
                />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer institucional */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <img
            src={fajLogo}
            alt="FAJ"
            className="h-8 object-contain opacity-50"
          />

          <img
            src={kaluLogo}
            alt="Rede Kalunga"
            className="h-8 object-contain opacity-50"
          />
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Prestação de Contas Financeira 2026.1 · Rede Kalunga Comunicações ·
          Apoio FAJ
        </p>
      </div>
    </div>
  );
}

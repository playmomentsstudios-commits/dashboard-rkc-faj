// Period: Dez/2025 → Mai/2026
export const MESES = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'];

export interface MonthlyFinanceData {
  mes: string;
  dateKey: string;
  solicitado: number;
  executado: number;
}

export interface RubricaFinanceData {
  id: number;
  nome: string;
  solicitado: number;
  executado: number;
  cor: string;
  monthlyData: MonthlyFinanceData[];
}

const fallbackMonthlyData: MonthlyFinanceData[] = [
  { mes: 'Dez/25', dateKey: '2025-12', solicitado: 16000, executado: 3600 },
  { mes: 'Jan/26', dateKey: '2026-01', solicitado: 13000, executado: 6725 },
  { mes: 'Fev/26', dateKey: '2026-02', solicitado: 13500, executado: 13908.06 },
  { mes: 'Mar/26', dateKey: '2026-03', solicitado: 13000, executado: 6595 },
  { mes: 'Abr/26', dateKey: '2026-04', solicitado: 9000, executado: 4952 },
  { mes: 'Mai/26', dateKey: '2026-05', solicitado: 23000, executado: 7450 },
];

export let monthlyData: MonthlyFinanceData[] = fallbackMonthlyData.map((month) => ({ ...month }));

export let rubricas: RubricaFinanceData[] = [
  { id: 1, nome: 'Total financeiro', solicitado: 87500, executado: 43229.82, cor: '#1565C0', monthlyData },
];

export let totalSolicitado = 87500;
export let totalExecutado  = 43229.82;
export let totalDiferenca  = totalSolicitado - totalExecutado;
export let percentualExecutado = Math.round((totalExecutado / totalSolicitado) * 10000) / 100;

// Real transactions extracted from comprovantes
export interface Transacao {
  id: string;
  data: string;
  dataISO: string;
  descricao: string;
  favorecido: string;
  banco: string;
  rubrica: string;
  valor: number;
  tipo: string;
  txId: string;
  arquivo: string;
  nomeArquivo: string;
}

export let transacoes: Transacao[] = [
  {
    id: 'TX001',
    data: '15/01/2026',
    dataISO: '2026-01-15',
    descricao: 'Pagamento da etapa de produção de conteúdo jornalístico referente ao mês de janeiro, no âmbito do FAJ',
    favorecido: 'Alcileia Conceição Cesário de Torres',
    banco: 'Nu Pagamentos S.A.',
    rubrica: 'Equipe / Jornalismo / Coberturas',
    valor: 450.00,
    tipo: 'Pix',
    txId: 'E37880206202601151348H73WUEALS4W',
    arquivo: 'COMPROVANTE_1',
    nomeArquivo: 'COMPROVANTE_1.pdf',
  },
  {
    id: 'TX002',
    data: '15/01/2026',
    dataISO: '2026-01-15',
    descricao: 'Pagamento da etapa de produção de conteúdo jornalístico referente ao mês de janeiro, no âmbito do FAJ',
    favorecido: 'Tales Damascena de Lima',
    banco: 'Banco Bradesco S.A.',
    rubrica: 'Equipe / Jornalismo / Coberturas',
    valor: 450.00,
    tipo: 'Pix',
    txId: 'E37880206202601151349VBK218AUUWU',
    arquivo: 'COMPROVANTE_2_',
    nomeArquivo: 'COMPROVANTE_2_.pdf',
  },
  {
    id: 'TX003',
    data: '15/01/2026',
    dataISO: '2026-01-15',
    descricao: 'Pagamento da etapa de produção de conteúdo jornalístico referente ao mês de janeiro, no âmbito do FAJ',
    favorecido: 'Daniella Teles Maia',
    banco: 'Nu Pagamentos S.A.',
    rubrica: 'Equipe / Jornalismo / Coberturas',
    valor: 1000.00,
    tipo: 'Pix',
    txId: 'E378802062026011513506BDSAS5XBRK',
    arquivo: 'COMPROVANTE_3',
    nomeArquivo: 'COMPROVANTE_3.pdf',
  },
  {
    id: 'TX004',
    data: '15/01/2026',
    dataISO: '2026-01-15',
    descricao: 'Pagamento da etapa de produção de conteúdo jornalístico referente ao mês de janeiro, no âmbito do FAJ',
    favorecido: 'Tainam Malta Sousa',
    banco: 'Nu Pagamentos S.A.',
    rubrica: 'Equipe / Jornalismo / Coberturas',
    valor: 350.00,
    tipo: 'Pix',
    txId: 'E37880206202601151351CSA6XM9RJBP',
    arquivo: 'COMPROVANTE_4',
    nomeArquivo: 'COMPROVANTE_4.pdf',
  },
  {
    id: 'TX005',
    data: '15/01/2026',
    dataISO: '2026-01-15',
    descricao: 'Pagamento da etapa de produção de conteúdo jornalístico referente ao mês de janeiro, no âmbito do FAJ',
    favorecido: 'Hígor de Torres Costa',
    banco: 'Nu Pagamentos S.A.',
    rubrica: 'Equipe / Jornalismo / Coberturas',
    valor: 1000.00,
    tipo: 'Pix',
    txId: 'E37880206202601151136FZ16QPOG4HW',
    arquivo: 'COMPROVANTE_5',
    nomeArquivo: 'COMPROVANTE_5.pdf',
  },
  {
    id: 'TX006',
    data: '15/01/2026',
    dataISO: '2026-01-15',
    descricao: 'Pagamento da etapa de produção de conteúdo jornalístico referente ao mês de janeiro, no âmbito do FAJ',
    favorecido: 'Cleiberson dos Santos Paulino',
    banco: 'Banco do Brasil S.A.',
    rubrica: 'Equipe / Jornalismo / Coberturas',
    valor: 350.00,
    tipo: 'Pix',
    txId: 'E37880206202601151352N97HP3KFW2O',
    arquivo: 'COMPROVANTE_6',
    nomeArquivo: 'COMPROVANTE_6.pdf',
  },
  {
    id: 'TX007',
    data: '15/01/2026',
    dataISO: '2026-01-15',
    descricao: 'Pagamento da etapa de produção de conteúdo jornalístico referente ao mês de janeiro, no âmbito do FAJ',
    favorecido: 'Isabelle de Almeida Batista',
    banco: 'Nu Pagamentos S.A.',
    rubrica: 'Equipe / Jornalismo / Coberturas',
    valor: 350.00,
    tipo: 'Pix',
    txId: 'E37880206202601151353FTZBKVLJQPY',
    arquivo: 'CO52F9_1',
    nomeArquivo: 'CO52F9_1.PDF',
  },
  {
    id: 'TX008',
    data: '22/01/2026',
    dataISO: '2026-01-22',
    descricao: 'Pagamento via QR code — plataforma digital / ferramentas de comunicação',
    favorecido: 'DEMERGE BRASIL FACILITADORA DE PAGAMENTOS LTDA',
    banco: 'DLOCAL',
    rubrica: 'Comunicação e Distribuição',
    valor: 383.76,
    tipo: 'Pix QR Code',
    txId: 'E37880206202601222043N5UEI8Q5DMH',
    arquivo: 'COMPROVANTE_7',
    nomeArquivo: 'COMPROVANTE_7.pdf',
  },
  {
    id: 'TX009',
    data: '24/01/2026',
    dataISO: '2026-01-24',
    descricao: '1ª parcela: Desenvolvimento do site institucional da Rede Kalunga Comunicações (programação, montagem e design), com recursos do FAJ',
    favorecido: 'Felipe da Costa Souza',
    banco: 'Nu Pagamentos S.A.',
    rubrica: 'Canais Digitais e Site',
    valor: 1250.00,
    tipo: 'Pix',
    txId: 'E37880206202601241110R6YAHN58LFS',
    arquivo: 'COMPROVANTE_11',
    nomeArquivo: 'COMPROVANTE_11.pdf',
  },
  {
    id: 'TX010',
    data: '24/01/2026',
    dataISO: '2026-01-24',
    descricao: 'Gravação de áudio para vídeo da Oficina de Comunicação Kalunga, sobre o Dia Mundial da Cultura Africana e Afrodescendente, no âmbito do FAJ',
    favorecido: 'Isabelle de Almeida Batista',
    banco: 'Nu Pagamentos S.A.',
    rubrica: 'Formação e Intercâmbio',
    valor: 100.00,
    tipo: 'Pix',
    txId: 'E37880206202601241543V3CHP8G7X5M',
    arquivo: 'COB9F5_1',
    nomeArquivo: 'COB9F5_1.PDF',
  },
];

export const atividades = [
  {
    id: 1,
    atividade: 'Produção de reportagens mensais sobre o Território Quilombola Kalunga',
    entrega: 'Conteúdos jornalísticos, registros audiovisuais, entrevistas, reels, matérias sobre cultura, meio ambiente e turismo comunitário.',
    rubrica: 'Equipe / Jornalismo / Coberturas',
    status: 'Em execução',
    progresso: 15,
  },
  {
    id: 2,
    atividade: 'Publicação de boletins e jornal comunitário',
    entrega: 'Construção do jornal impresso iniciada: levantamento de pautas, escuta comunitária e registros em campo. Impressão prevista para Jun/Jul.',
    rubrica: 'Jornal Impresso / Boletins',
    status: 'Em andamento',
    progresso: 10,
  },
  {
    id: 3,
    atividade: 'Produção de séries temáticas (meio ambiente, juventude, ancestralidade)',
    entrega: 'Levantamento inicial de pautas. Produções em construção comunitária e edição para os próximos meses.',
    rubrica: 'Reportagens Especiais',
    status: 'Iniciado',
    progresso: 5,
  },
  {
    id: 4,
    atividade: 'Oficinas de formação para comunicadores locais',
    entrega: 'Gravação de áudio para vídeo da Oficina de Comunicação Kalunga — Dia Mundial da Cultura Africana e Afrodescendente.',
    rubrica: 'Formação e Intercâmbio',
    status: 'Em execução',
    progresso: 12,
  },
  {
    id: 5,
    atividade: 'Fortalecimento dos canais digitais da RKC',
    entrega: '1ª parcela do site institucional paga (Felipe da Costa Souza). Desenvolvimento em andamento.',
    rubrica: 'Canais Digitais e Site',
    status: 'Em andamento',
    progresso: 20,
  },
  {
    id: 6,
    atividade: 'Aquisição e manutenção de equipamentos',
    entrega: 'Previsto para o próximo período.',
    rubrica: 'Equipamentos e Manutenção',
    status: 'Não iniciado',
    progresso: 0,
  },
  {
    id: 7,
    atividade: 'Consultoria contábil e jurídica',
    entrega: 'Gestão financeira, documentações e suporte administrativo.',
    rubrica: 'Consultoria Contábil e Jurídica',
    status: 'Em execução',
    progresso: 8,
  },
  {
    id: 8,
    atividade: 'Comunicação e campanhas de alcance',
    entrega: 'Plataforma de distribuição digital contratada (Demerge Brasil — R$ 383,76).',
    rubrica: 'Comunicação e Distribuição',
    status: 'Iniciado',
    progresso: 8,
  },
];

export const formatCurrency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatDate = (value: string | null | undefined) => {
  if (!value) return '—';

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export const statusColors: Record<string, string> = {
  'Concluído':          '#1565C0',
  'Concluído (parcial)':'#1976D2',
  'Em execução':        '#1E88E5',
  'Em andamento':       '#42A5F5',
  'Iniciado':           '#90CAF9',
  'Não iniciado':       '#B0BEC5',
};

export interface SupabaseFinanceRow {
  id: string;
  date: string;
  title?: string | null;
  description?: string | null;
  rubrica?: string | null;
  solicitado?: number | string | null;
  executado?: number | string | null;
  favorecido?: string | null;
  status?: string | null;
  comprovante_url?: string | null;
  banco?: string | null;
  tipo?: string | null;
  tx_id?: string | null;
}

const rubricaColors = ['#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#0D47A1'];
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' });

function parseMoney(value: number | string | null | undefined) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;

  const sanitized = value.trim().replace(/\s|R\$/g, '');
  const normalized = sanitized.includes(',')
    ? sanitized.replace(/\./g, '').replace(',', '.')
    : sanitized;

  return Number(normalized) || 0;
}

const toCents = (value: number | string | null | undefined) => Math.round(parseMoney(value) * 100);
const fromCents = (value: number) => Math.round(value) / 100;
const moneyNumber = (value: number | string | null | undefined) => fromCents(toCents(value));
const safeText = (value: string | null | undefined, fallback: string) => value?.trim() || fallback;

function sumRows(rows: SupabaseFinanceRow[], field: 'solicitado' | 'executado') {
  return fromCents(rows.reduce((sum, row) => sum + toCents(row[field]), 0));
}

function recomputeTotals(rows: SupabaseFinanceRow[]) {
  totalSolicitado = sumRows(rows, 'solicitado');
  totalExecutado = sumRows(rows, 'executado');
  totalDiferenca = fromCents(toCents(totalSolicitado) - toCents(totalExecutado));
  percentualExecutado = totalSolicitado > 0 ? Math.round((totalExecutado / totalSolicitado) * 10000) / 100 : 0;
}

function monthKey(value: string | null | undefined) {
  return value?.slice(0, 7) || 'Sem data';
}

function monthLabel(value: string) {
  const date = new Date(`${value}-01T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return monthFormatter.format(date).replace('.', '').replace(/^\w/, char => char.toUpperCase());
}

function displayFileName(url: string | null | undefined, fallback: string) {
  if (!url) return fallback;

  try {
    const parsed = new URL(url);
    const lastSegment = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() ?? fallback);
    return lastSegment || fallback;
  } catch {
    return url.split('/').filter(Boolean).pop() ?? fallback;
  }
}

function createEmptyMonth(sort: string): MonthlyFinanceData & { sort: string; solicitadoCents: number; executadoCents: number } {
  return {
    mes: sort === 'Sem data' ? 'Sem data' : monthLabel(sort),
    dateKey: sort,
    solicitado: 0,
    executado: 0,
    solicitadoCents: 0,
    executadoCents: 0,
    sort,
  };
}

function finalizeMonths(map: Map<string, MonthlyFinanceData & { sort: string; solicitadoCents: number; executadoCents: number }>) {
  return Array.from(map.values())
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .map(({ sort: _sort, solicitadoCents, executadoCents, ...month }) => ({
      ...month,
      solicitado: fromCents(solicitadoCents),
      executado: fromCents(executadoCents),
    }));
}

function groupRubricas(rows: SupabaseFinanceRow[]) {
  const map = new Map<string, RubricaFinanceData & { solicitadoCents: number; executadoCents: number; monthlyMap: Map<string, MonthlyFinanceData & { sort: string; solicitadoCents: number; executadoCents: number }> }>();

  rows.forEach((row) => {
    const nome = safeText(row.rubrica, 'Sem rubrica');
    const current = map.get(nome) ?? {
      id: map.size + 1,
      nome,
      solicitado: 0,
      executado: 0,
      solicitadoCents: 0,
      executadoCents: 0,
      cor: rubricaColors[map.size % rubricaColors.length],
      monthlyData: [],
      monthlyMap: new Map(),
    };
    const requestedCents = toCents(row.solicitado);
    const executedCents = toCents(row.executado);
    const sort = monthKey(row.date);
    const month = current.monthlyMap.get(sort) ?? createEmptyMonth(sort);

    current.solicitadoCents += requestedCents;
    current.executadoCents += executedCents;
    month.solicitadoCents += requestedCents;
    month.executadoCents += executedCents;
    current.monthlyMap.set(sort, month);
    map.set(nome, current);
  });

  return Array.from(map.values())
    .map(({ solicitadoCents, executadoCents, monthlyMap, ...rubrica }) => ({
      ...rubrica,
      solicitado: fromCents(solicitadoCents),
      executado: fromCents(executadoCents),
      monthlyData: finalizeMonths(monthlyMap),
    }))
    .sort((a, b) => b.executado - a.executado || b.solicitado - a.solicitado);
}

function groupMonths(rows: SupabaseFinanceRow[]) {
  const map = new Map<string, MonthlyFinanceData & { sort: string; solicitadoCents: number; executadoCents: number }>();

  rows.forEach((row) => {
    const sort = monthKey(row.date);
    const current = map.get(sort) ?? createEmptyMonth(sort);
    current.solicitadoCents += toCents(row.solicitado);
    current.executadoCents += toCents(row.executado);
    map.set(sort, current);
  });

  return finalizeMonths(map);
}

function mapTransacao(row: SupabaseFinanceRow, index: number): Transacao {
  const comprovanteUrl = row.comprovante_url?.trim() || '';
  const arquivo = comprovanteUrl || `TX_${index + 1}`;

  return {
    id: row.id || `TX${String(index + 1).padStart(3, '0')}`,
    data: formatDate(row.date),
    dataISO: row.date,
    descricao: safeText(row.description, safeText(row.title, 'Transação financeira')),
    favorecido: safeText(row.favorecido, 'Favorecido não informado'),
    banco: safeText(row.banco, 'Não informado'),
    rubrica: safeText(row.rubrica, 'Sem rubrica'),
    valor: moneyNumber(row.executado),
    tipo: safeText(row.tipo, safeText(row.status, 'Transação')),
    txId: safeText(row.tx_id, row.id),
    arquivo,
    nomeArquivo: displayFileName(comprovanteUrl, `Comprovante ${index + 1}`),
  };
}

export function applySupabaseFinanceData(rows: SupabaseFinanceRow[]) {
  const normalized = rows.map((row) => ({
    ...row,
    solicitado: moneyNumber(row.solicitado),
    executado: moneyNumber(row.executado),
  }));

  rubricas = groupRubricas(normalized);
  monthlyData = groupMonths(normalized);
  transacoes = normalized.map(mapTransacao).sort((a, b) => b.dataISO.localeCompare(a.dataISO));
  recomputeTotals(normalized);
}

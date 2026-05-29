export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  organization: string | null;
  semester: string | null;
  public: boolean | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
};

export type Transaction = {
  id: string;
  project_id: string;
  date: string;
  title: string;
  description: string | null;
  rubrica: string | null;
  solicitado: number | string | null;
  executado: number | string | null;
  favorecido: string | null;
  status: string | null;
  comprovante_url: string | null;
  created_at: string | null;
};

export type TransactionView = Omit<Transaction, 'solicitado' | 'executado'> & {
  solicitado: number;
  executado: number;
};

export type ProjectMetrics = {
  totalSolicitado: number;
  totalExecutado: number;
  saldoDisponivel: number;
  percentualExecutado: number;
};

export type RubricaSummary = {
  rubrica: string;
  solicitado: number;
  executado: number;
};

export type MonthlySummary = {
  mes: string;
  solicitado: number;
  executado: number;
};

export type ProjectDashboardData = {
  project: Project;
  transactions: TransactionView[];
  metrics: ProjectMetrics;
  rubricas: RubricaSummary[];
  monthly: MonthlySummary[];
};

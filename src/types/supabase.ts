export type Transaction = {
  id: string;
  date: string;
  title: string | null;
  description: string | null;
  rubrica: string | null;
  solicitado: number | string | null;
  executado: number | string | null;
  favorecido: string | null;
  status: string | null;
  comprovante_url: string | null;
  created_at: string | null;
};

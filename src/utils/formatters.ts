export const formatCurrencyFromCents = (amountCents: number, currency = 'BRL') =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(amountCents / 100);

export const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const formatDateTime = (value: string | null | undefined) => {
  if (!value) return 'Sem registro';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
};

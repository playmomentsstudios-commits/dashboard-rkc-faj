export function normalizeServiceError(error: unknown, fallback: string) {
  const message = error instanceof Error && error.message ? error.message : fallback;

  if (/relation .* does not exist|schema cache|could not find/i.test(message)) {
    return 'Estrutura administrativa ainda não publicada no Supabase. Execute as migrations antes de liberar em produção.';
  }

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return 'Não foi possível conectar ao Supabase. Confira as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.';
  }

  return message;
}

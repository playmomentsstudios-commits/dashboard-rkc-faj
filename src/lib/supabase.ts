import { createClient } from '@supabase/supabase-js';
import type { Project, Transaction } from '../types/supabase';

type PublicSchema = {
  Tables: {
    projects: {
      Row: Project;
      Insert: never;
      Update: never;
    };
    transactions: {
      Row: Transaction;
      Insert: never;
      Update: never;
    };
  };
  Views: Record<string, never>;
  Functions: Record<string, never>;
  Enums: Record<string, never>;
  CompositeTypes: Record<string, never>;
};

export type SupabaseDatabase = {
  public: PublicSchema;
};

const normalizeUrl = (value: string | undefined) => value?.trim().replace(/\/+$/, '') ?? '';
const normalizeKey = (value: string | undefined) => value?.trim() ?? '';

export const supabaseUrl = normalizeUrl(import.meta.env.VITE_SUPABASE_URL);
export const supabaseAnonKey = normalizeKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

const missingEnvNames = [
  ['VITE_SUPABASE_URL', supabaseUrl],
  ['VITE_SUPABASE_ANON_KEY', supabaseAnonKey],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

const invalidSupabaseUrl = Boolean(supabaseUrl) && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl);

export const supabaseConfigError = missingEnvNames.length
  ? `Configuração do Supabase incompleta. Defina ${missingEnvNames.join(' e ')} nas variáveis de ambiente da Vercel/Vite.`
  : invalidSupabaseUrl
    ? 'VITE_SUPABASE_URL deve ser a URL HTTPS do projeto Supabase, por exemplo https://seu-projeto.supabase.co.'
    : null;

// The client is still created with safe placeholders so the React bundle can render
// an actionable error state instead of crashing during module initialization when
// an environment variable is missing in production.
const clientUrl = supabaseUrl || 'https://missing-project.supabase.co';
const clientAnonKey = supabaseAnonKey || 'missing-anon-key';

export const supabase = createClient<SupabaseDatabase>(clientUrl, clientAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'dashboard-rkc-faj-public',
    },
  },
});

export function assertSupabaseConfigured() {
  if (supabaseConfigError) {
    throw new Error(supabaseConfigError);
  }
}

import { createClient } from '@supabase/supabase-js';
import type { Transaction } from '../types/supabase';
import type { AppSetting, AuditLog, BrandLogo, ManagedAsset, PricingPlan } from '../types/admin';

type PublicSchema = {
  Tables: {
    transactions: {
      Row: Transaction;
      Insert: Partial<Transaction>;
      Update: Partial<Transaction>;
    };
    app_settings: {
      Row: AppSetting;
      Insert: Partial<AppSetting>;
      Update: Partial<AppSetting>;
    };
    brand_logos: {
      Row: BrandLogo;
      Insert: Partial<BrandLogo>;
      Update: Partial<BrandLogo>;
    };
    managed_assets: {
      Row: ManagedAsset;
      Insert: Partial<ManagedAsset>;
      Update: Partial<ManagedAsset>;
    };
    pricing_plans: {
      Row: PricingPlan;
      Insert: Partial<PricingPlan>;
      Update: Partial<PricingPlan>;
    };
    audit_logs: {
      Row: AuditLog;
      Insert: Partial<AuditLog>;
      Update: Partial<AuditLog>;
    };
    profiles: {
      Row: { id: string; role: string | null };
      Insert: { id: string; role?: string | null };
      Update: { role?: string | null };
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

// O cliente é criado com placeholders seguros para que o dashboard original
// consiga exibir uma mensagem clara caso as variáveis não estejam definidas.
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
      'X-Client-Info': 'dashboard-rkc-faj-enterprise',
    },
  },
});

export function assertSupabaseConfigured() {
  if (supabaseConfigError) {
    throw new Error(supabaseConfigError);
  }
}

import { assertSupabaseConfigured, supabase } from '../lib/supabase';
import type { PricingPlan } from '../types/admin';
import { normalizeServiceError } from './errors';

export async function getPricingPlans() {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('amount_cents', { ascending: true });

  if (error) throw new Error(normalizeServiceError(error, 'Não foi possível carregar planos e valores.'));
  return (data ?? []) as PricingPlan[];
}

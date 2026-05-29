import { assertSupabaseConfigured, supabase } from '../lib/supabase';
import type { AppSetting, BrandLogo } from '../types/admin';
import { normalizeServiceError } from './errors';

export type PublicAppConfig = {
  settings: Record<string, unknown>;
  logos: Record<string, BrandLogo>;
};

function mapSettings(rows: AppSetting[] | null | undefined) {
  return (rows ?? []).reduce<Record<string, unknown>>((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
}

function mapLogos(rows: BrandLogo[] | null | undefined) {
  return (rows ?? []).reduce<Record<string, BrandLogo>>((acc, logo) => {
    acc[logo.slug] = logo;
    return acc;
  }, {});
}

export async function getPublicAppConfig(): Promise<PublicAppConfig> {
  assertSupabaseConfigured();

  const [settingsResult, logosResult] = await Promise.all([
    supabase.from('app_settings').select('key,value,is_public,updated_at').eq('is_public', true),
    supabase.from('brand_logos').select('*').eq('is_active', true),
  ]);

  if (settingsResult.error) throw new Error(normalizeServiceError(settingsResult.error, 'Não foi possível carregar configurações públicas.'));
  if (logosResult.error) throw new Error(normalizeServiceError(logosResult.error, 'Não foi possível carregar logos públicas.'));

  return {
    settings: mapSettings(settingsResult.data as AppSetting[]),
    logos: mapLogos(logosResult.data as BrandLogo[]),
  };
}

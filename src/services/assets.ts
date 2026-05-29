import { assertSupabaseConfigured, supabase } from '../lib/supabase';
import type { BrandLogo, ManagedAsset } from '../types/admin';
import { normalizeServiceError } from './errors';

const ASSETS_BUCKET = 'assets';

export function resolvePublicAssetUrl(bucket: string, path: string | null | undefined, publicUrl?: string | null) {
  if (publicUrl) return publicUrl;
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function getBrandLogos() {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('brand_logos')
    .select('*')
    .order('slug', { ascending: true });

  if (error) throw new Error(normalizeServiceError(error, 'Não foi possível carregar logos.'));

  return ((data ?? []) as BrandLogo[]).map((logo) => ({
    ...logo,
    public_url: resolvePublicAssetUrl(ASSETS_BUCKET, logo.storage_path, logo.public_url),
  }));
}

export async function getManagedAssets() {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from('managed_assets')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(normalizeServiceError(error, 'Não foi possível carregar assets.'));

  return ((data ?? []) as ManagedAsset[]).map((asset) => ({
    ...asset,
    public_url: resolvePublicAssetUrl(asset.bucket, asset.storage_path, asset.public_url),
  }));
}

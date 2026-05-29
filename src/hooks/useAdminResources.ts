import { useCallback } from 'react';
import { getAdminOverview } from '../services/admin';
import { getBrandLogos, getManagedAssets } from '../services/assets';
import { getPricingPlans } from '../services/pricing';
import type { AdminOverview, BrandLogo, ManagedAsset, PricingPlan } from '../types/admin';
import { useAsyncResource } from './useAsyncResource';
import { useSupabaseRealtime } from './useSupabaseRealtime';

export type AdminResources = {
  overview: AdminOverview | null;
  logos: BrandLogo[];
  assets: ManagedAsset[];
  plans: PricingPlan[];
};

async function loadAdminResources(): Promise<AdminResources> {
  const [overview, logos, assets, plans] = await Promise.allSettled([
    getAdminOverview(),
    getBrandLogos(),
    getManagedAssets(),
    getPricingPlans(),
  ]);

  const firstError = [overview, logos, assets, plans].find((result) => result.status === 'rejected');
  if (firstError?.status === 'rejected') throw firstError.reason;

  return {
    overview: overview.status === 'fulfilled' ? overview.value : null,
    logos: logos.status === 'fulfilled' ? logos.value : [],
    assets: assets.status === 'fulfilled' ? assets.value : [],
    plans: plans.status === 'fulfilled' ? plans.value : [],
  };
}

export function useAdminResources() {
  const loader = useCallback(() => loadAdminResources(), []);
  const resource = useAsyncResource(loader, [loader]);

  useSupabaseRealtime({ table: 'brand_logos', onChange: resource.refresh, enabled: !resource.error });
  useSupabaseRealtime({ table: 'managed_assets', onChange: resource.refresh, enabled: !resource.error });
  useSupabaseRealtime({ table: 'pricing_plans', onChange: resource.refresh, enabled: !resource.error });
  useSupabaseRealtime({ table: 'audit_logs', onChange: resource.refresh, enabled: !resource.error });

  return resource;
}

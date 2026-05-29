import { createContext, useContext, useMemo } from 'react';
import { getPublicAppConfig, type PublicAppConfig } from '../services/appSettings';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useSupabaseRealtime } from '../hooks/useSupabaseRealtime';

type AppConfigContextValue = PublicAppConfig & {
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const emptyConfig: PublicAppConfig = {
  settings: {},
  logos: {},
};

const AppConfigContext = createContext<AppConfigContextValue>({
  ...emptyConfig,
  loading: false,
  error: null,
  refresh: async () => undefined,
});

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const resource = useAsyncResource(getPublicAppConfig, []);

  useSupabaseRealtime({ table: 'app_settings', onChange: resource.refresh, enabled: !resource.error });
  useSupabaseRealtime({ table: 'brand_logos', onChange: resource.refresh, enabled: !resource.error });

  const value = useMemo<AppConfigContextValue>(() => ({
    ...(resource.data ?? emptyConfig),
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
  }), [resource.data, resource.error, resource.loading, resource.refresh]);

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
}

export const useAppConfig = () => useContext(AppConfigContext);

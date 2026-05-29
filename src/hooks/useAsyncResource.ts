import { useCallback, useEffect, useState } from 'react';
import type { DependencyList } from 'react';

export type AsyncResourceState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useAsyncResource<T>(loader: () => Promise<T>, deps: DependencyList = []): AsyncResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const nextData = await loader();
      setData(nextData);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    loader()
      .then((nextData) => {
        if (!mounted) return;
        setData(nextData);
        setError(null);
      })
      .catch((caught) => {
        if (!mounted) return;
        setError(caught instanceof Error ? caught.message : 'Erro inesperado ao carregar dados.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, error, loading, refresh };
}

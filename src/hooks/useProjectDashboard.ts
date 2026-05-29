import { useEffect, useState } from 'react';
import { getProjectDashboardBySlug } from '../services/projects';
import type { ProjectDashboardData } from '../types/supabase';

export function useProjectDashboard(slug: string) {
  const [data, setData] = useState<ProjectDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProject() {
      setLoading(true);
      setError(null);

      try {
        const dashboardData = await getProjectDashboardBySlug(slug);

        if (active) setData(dashboardData);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar o projeto.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [slug]);

  return { data, loading, error };
}

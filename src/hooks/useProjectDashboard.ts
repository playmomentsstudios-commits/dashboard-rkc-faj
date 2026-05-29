import { useEffect, useState } from 'react';
import { calculateMetrics, groupByMonth, groupByRubrica } from '../services/analytics';
import { getProjectBySlug, getTransactionsByProject } from '../services/projects';
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
        const project = await getProjectBySlug(slug);

        if (!project) {
          if (active) setData(null);
          return;
        }

        const transactions = await getTransactionsByProject(project.id);
        const dashboardData: ProjectDashboardData = {
          project,
          transactions,
          metrics: calculateMetrics(transactions),
          rubricas: groupByRubrica(transactions),
          monthly: groupByMonth(transactions),
        };

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

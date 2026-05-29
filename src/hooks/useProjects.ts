import { useEffect, useState } from 'react';
import { getPublicProjects } from '../services/projects';
import type { Project } from '../types/supabase';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getPublicProjects()
      .then((data) => {
        if (active) setProjects(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Não foi possível carregar os projetos.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { projects, loading, error };
}

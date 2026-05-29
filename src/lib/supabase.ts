import { projectId, publicAnonKey } from '../../utils/supabase/info';

export const supabaseUrl = `https://${projectId}.supabase.co`;

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

class SupabaseRestQuery<T> {
  private params = new URLSearchParams();

  constructor(private table: string) {}

  select(columns = '*') {
    this.params.set('select', columns);
    return this;
  }

  eq(column: string, value: string | number | boolean) {
    this.params.set(column, `eq.${value}`);
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.params.set('order', `${column}.${options.ascending === false ? 'desc' : 'asc'}`);
    return this;
  }

  limit(count: number) {
    this.params.set('limit', String(count));
    return this;
  }

  async execute(): Promise<{ data: T[] | null; error: Error | null }> {
    const endpoint = `${supabaseUrl}/rest/v1/${this.table}?${this.params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          apikey: publicAnonKey,
          Authorization: `Bearer ${publicAnonKey}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const message = await response.text();
        return { data: null, error: new Error(message || `Supabase HTTP ${response.status}`) };
      }

      return { data: (await response.json()) as T[], error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao consultar o Supabase') };
    }
  }

  then<TResult1 = { data: T[] | null; error: Error | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export function createClient(url: string, anonKey: string) {
  return {
    url,
    anonKey,
    from<T>(table: string) {
      return new SupabaseRestQuery<T>(table);
    },
    storage: {
      from(bucket: string) {
        return {
          getPublicUrl(path: string) {
            return { data: { publicUrl: `${url}/storage/v1/object/public/${bucket}/${path}` } };
          },
        };
      },
    },
  };
}

export const supabase = createClient(supabaseUrl, publicAnonKey);

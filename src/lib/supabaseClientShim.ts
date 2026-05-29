type QueryOptions = {
  count?: 'exact';
  head?: boolean;
};

type ClientOptions = {
  global?: { headers?: Record<string, string> };
};

type QueryResult<T = Record<string, unknown>> = {
  data: T[] | null;
  error: Error | null;
  count?: number | null;
};

class RestQueryBuilder<T = Record<string, unknown>> implements PromiseLike<QueryResult<T>> {
  private selected = '*';
  private filters: string[] = [];
  private orderBy: { column: string; ascending: boolean } | null = null;
  private maxRows: number | null = null;
  private options: QueryOptions = {};

  constructor(
    private readonly baseUrl: string,
    private readonly anonKey: string,
    private readonly table: string,
    private readonly headers: Record<string, string>,
  ) {}

  select(columns = '*', options: QueryOptions = {}) {
    this.selected = columns;
    this.options = options;
    return this;
  }

  eq(column: string, value: string | number | boolean) {
    this.filters.push(`${encodeURIComponent(column)}=eq.${encodeURIComponent(String(value))}`);
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderBy = { column, ascending: options.ascending ?? true };
    return this;
  }

  limit(count: number) {
    this.maxRows = count;
    return this;
  }

  private async execute(): Promise<QueryResult<T>> {
    try {
      const url = new URL(`${this.baseUrl}/rest/v1/${this.table}`);
      url.searchParams.set('select', this.selected);
      this.filters.forEach((filter) => {
        const [key, value] = filter.split('=');
        url.searchParams.set(decodeURIComponent(key), decodeURIComponent(value));
      });
      if (this.orderBy) url.searchParams.set('order', `${this.orderBy.column}.${this.orderBy.ascending ? 'asc' : 'desc'}`);
      if (this.maxRows !== null) url.searchParams.set('limit', String(this.maxRows));

      const response = await fetch(url, {
        method: this.options.head ? 'HEAD' : 'GET',
        headers: {
          apikey: this.anonKey,
          Authorization: `Bearer ${this.anonKey}`,
          Prefer: this.options.count ? `count=${this.options.count}` : '',
          ...this.headers,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        return { data: null, error: new Error(message || `Supabase REST retornou ${response.status}.`), count: null };
      }

      const contentRange = response.headers.get('content-range');
      const count = contentRange?.includes('/') ? Number(contentRange.split('/').pop()) : null;
      const data = this.options.head ? null : ((await response.json()) as T[]);
      return { data, error: null, count };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Erro inesperado no cliente Supabase.'), count: null };
    }
  }

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export function createClient<TDatabase = unknown>(url: string, anonKey: string, options: ClientOptions = {}) {
  const baseUrl = url.replace(/\/+$/, '');
  const headers = options.global?.headers ?? {};

  return {
    from<T = Record<string, unknown>>(table: string) {
      return new RestQueryBuilder<T>(baseUrl, anonKey, table, headers);
    },
    storage: {
      from(bucket: string) {
        return {
          getPublicUrl(path: string) {
            return { data: { publicUrl: `${baseUrl}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, '')}` } };
          },
        };
      },
    },
    channel(name: string) {
      return {
        on() {
          return this;
        },
        subscribe() {
          return { name };
        },
      };
    },
    async removeChannel() {
      return 'ok';
    },
  };
}

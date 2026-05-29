export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

export function LoadingState({ label = 'Carregando dados do Supabase...' }: { label?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-64" />
          <SkeletonBlock className="h-4 w-80 max-w-full" />
        </div>
        <SkeletonBlock className="hidden h-10 w-32 md:block" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} className="h-32" />)}
      </div>
      <SkeletonBlock className="h-80" />
      <p className="text-center text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-900 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Erro de sincronização</p>
      <h2 className="mt-3 text-2xl font-semibold">Não foi possível carregar os dados públicos.</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-red-700">{message}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Sem dados</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

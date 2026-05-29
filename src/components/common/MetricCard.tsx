import type { ReactNode } from 'react';

export function MetricCard({ label, value, helper, icon }: { label: string; value: ReactNode; helper?: string; icon?: ReactNode }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
        </div>
        {icon && <div className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</div>}
      </div>
      {helper && <p className="mt-3 text-sm text-muted-foreground">{helper}</p>}
    </article>
  );
}

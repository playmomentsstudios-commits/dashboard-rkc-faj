import { ArrowRight, Building2, CalendarDays } from 'lucide-react';
import { useProjects } from '../../../hooks/useProjects';
import { formatDate } from '../data';
import { EmptyState, ErrorState, LoadingState } from './States';

export function HomePage() {
  const { projects, loading, error } = useProjects();

  if (loading) return <LoadingState label="Buscando projetos públicos em tempo real..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="relative p-8 md:p-12">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-950 via-blue-600 to-sky-300" />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">Portal institucional</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Prestação pública multi-projeto conectada ao Supabase.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                Acompanhe projetos, semestres, rubricas, comprovantes e execução financeira em uma experiência pública, auditável e pronta para escalar.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Projetos publicados</p>
              <p className="mt-2 text-5xl font-semibold text-slate-950">{projects.length}</p>
              <p className="mt-3 text-sm text-slate-500">Dados lidos diretamente das tabelas públicas <strong>projects</strong> e <strong>transactions</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      {projects.length === 0 ? (
        <EmptyState title="Nenhum projeto público encontrado" description="Quando a tabela projects tiver registros com public=true, eles aparecerão automaticamente nesta página inicial." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{project.slug}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">{project.name}</h2>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{project.semester ?? 'Semestre aberto'}</span>
              </div>

              <p className="mt-4 min-h-12 text-sm leading-6 text-slate-500">{project.description ?? 'Projeto institucional com dados financeiros públicos.'}</p>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2"><Building2 size={16} className="text-blue-600" />{project.organization ?? 'Organização não informada'}</div>
                <div className="flex items-center gap-2"><CalendarDays size={16} className="text-blue-600" />{formatDate(project.start_date)} — {formatDate(project.end_date)}</div>
              </div>

              <a href={`/${project.slug}`} className="mt-8 inline-flex w-full items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                Acessar dashboard
                <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

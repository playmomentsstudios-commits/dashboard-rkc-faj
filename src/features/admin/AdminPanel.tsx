import {
  Activity,
  Bell,
  Coins,
  FileClock,
  Image,
  Mail,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  Users,
} from 'lucide-react';

import { EmptyState } from '../../components/common/EmptyState';
import { MetricCard } from '../../components/common/MetricCard';
import { SkeletonBlock } from '../../components/common/SkeletonBlock';
import { useAdminResources } from '../../hooks/useAdminResources';
import { formatCurrencyFromCents, formatDateTime } from '../../utils/formatters';

const adminModules = [
  {
    title: 'Usuários e RBAC',
    description: 'Perfis, cargos, permissões granulares e proteção de rotas.',
    icon: Users,
  },
  {
    title: 'Logos e assets',
    description: 'Storage organizado, versionamento, preview e cache-busting.',
    icon: Image,
  },
  {
    title: 'Preços e planos',
    description: 'Valores dinâmicos, moedas, histórico e regras de negócio.',
    icon: Coins,
  },
  {
    title: 'Auditoria e logs',
    description: 'Rastreabilidade de ações críticas e eventos administrativos.',
    icon: FileClock,
  },
  {
    title: 'Notificações',
    description: 'Comunicados, alertas operacionais e status de publicação.',
    icon: Bell,
  },
  {
    title: 'Uploads seguros',
    description: 'Buckets segregados, políticas RLS e validação de metadados.',
    icon: UploadCloud,
  },
];

function AdminSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-32" />

      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-32" />
      </div>

      <SkeletonBlock className="h-72" />
    </div>
  );
}

export function AdminPanel() {
  const { data, error, loading, refresh } = useAdminResources();

  if (loading) return <AdminSkeleton />;

  if (error) {
    return (
      <EmptyState
        title="Módulo administrativo aguardando estrutura do Supabase"
        description={error}
        action={
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </button>
        }
      />
    );
  }

  const overview = data?.overview;

  const plans = data?.plans ?? [];
  const logos = data?.logos ?? [];
  const assets = data?.assets ?? [];

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary via-accent to-[#062D6B] p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
              Painel administrativo
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Operação, governança e conteúdo em tempo real
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
              Centraliza configurações globais, assets, planos,
              permissões e auditoria com assinatura Realtime do
              Supabase para manter o frontend sincronizado.
            </p>
          </div>

          <button
            onClick={refresh}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
          >
            <RefreshCw size={16} />
            Atualizar agora
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Usuários"
          value={overview?.users ?? 0}
          helper="Perfis prontos para RBAC e auditoria."
          icon={<Users size={20} />}
        />

        <MetricCard
          label="Planos ativos"
          value={
            overview?.activePlans ??
            plans.filter((plan) => plan.is_active).length
          }
          helper="Valores dinâmicos publicados."
          icon={<Coins size={20} />}
        />

        <MetricCard
          label="Assets ativos"
          value={
            overview?.activeAssets ??
            assets.filter((asset) => asset.is_active).length
          }
          helper="Arquivos versionados no Storage."
          icon={<Image size={20} />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                Módulos enterprise
              </h2>

              <p className="text-sm text-muted-foreground">
                Backlog técnico já refletido na arquitetura e nas
                migrations.
              </p>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
              Realtime ready
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {adminModules.map(
              ({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-border bg-background/60 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Icon size={18} />
                    </span>

                    <div>
                      <h3 className="font-semibold">
                        {title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-primary/10 p-2 text-primary">
                <Activity size={18} />
              </span>

              <div>
                <h2 className="text-xl font-bold">
                  Auditoria recente
                </h2>

                <p className="text-sm text-muted-foreground">
                  Eventos críticos do painel.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {(overview?.latestLogs ?? []).length === 0 && (
                <EmptyState
                  title="Nenhum log administrativo"
                  description="As próximas alterações em logos, preços, usuários e permissões serão exibidas aqui."
                />
              )}

              {(overview?.latestLogs ?? []).map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl border border-border bg-background/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">
                      {log.action}
                    </p>

                    <ShieldCheck
                      size={16}
                      className="text-primary"
                    />
                  </div>

                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {log.entity}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDateTime(log.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SUPORTE ADMINISTRATIVO */}

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-primary/10 p-2 text-primary">
                <MessageCircle size={18} />
              </span>

              <div>
                <h2 className="text-xl font-bold">
                  Suporte Administrativo
                </h2>

                <p className="text-sm text-muted-foreground">
                  Solicite alterações, suporte técnico ou ajustes do painel.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <a
                href="https://wa.me/5562993241277"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={18} />
                Solicitar suporte via WhatsApp
              </a>

              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Mail size={16} />
                  Contato por e-mail
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Para solicitações administrativas e suporte técnico:
                </p>

                <a
                  href="mailto:felipe@kalungacomunicacoes.org"
                  className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  felipe@kalungacomunicacoes.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-xl font-bold">
            Logos dinâmicas
          </h2>

          <p className="text-sm text-muted-foreground">
            Registros ativos atualizam a sidebar automaticamente
            via contexto global.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="rounded-2xl border border-border bg-background/60 p-4"
              >
                <p className="text-sm font-semibold">
                  {logo.name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {logo.slug} · v{logo.version}
                </p>

                {logo.public_url && (
                  <img
                    src={logo.public_url}
                    alt={logo.name}
                    className="mt-4 h-12 max-w-full rounded-lg object-contain"
                  />
                )}
              </div>
            ))}

            {logos.length === 0 && (
              <EmptyState
                title="Sem logos publicadas"
                description="Cadastre registros em brand_logos apontando para o bucket assets."
              />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-xl font-bold">
            Valores e planos
          </h2>

          <p className="text-sm text-muted-foreground">
            Camada preparada para múltiplas moedas,
            histórico e permissões por cargo.
          </p>

          <div className="mt-5 space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 p-4"
              >
                <div>
                  <p className="font-semibold">
                    {plan.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {plan.billing_interval} · {plan.currency}
                  </p>
                </div>

                <p className="text-lg font-bold text-primary">
                  {formatCurrencyFromCents(
                    plan.amount_cents,
                    plan.currency,
                  )}
                </p>
              </div>
            ))}

            {plans.length === 0 && (
              <EmptyState
                title="Sem planos cadastrados"
                description="Publique planos em pricing_plans para ativar preços dinâmicos no frontend."
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

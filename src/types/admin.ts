export type AdminRole = 'owner' | 'admin' | 'finance' | 'editor' | 'viewer';

export type AppSetting = {
  key: string;
  value: unknown;
  is_public: boolean;
  updated_at: string | null;
};

export type BrandLogo = {
  id: string;
  slug: string;
  name: string;
  storage_path: string | null;
  public_url: string | null;
  version: number;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
  updated_at: string | null;
};

export type ManagedAsset = {
  id: string;
  name: string;
  kind: 'logo' | 'document' | 'image' | 'video' | 'other';
  bucket: string;
  storage_path: string;
  public_url: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  version: number;
  is_active: boolean;
  updated_at: string | null;
};

export type PricingPlan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  currency: string;
  amount_cents: number;
  billing_interval: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  is_active: boolean;
  rules: Record<string, unknown> | null;
  updated_at: string | null;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
};

export type AdminOverview = {
  users: number;
  activePlans: number;
  activeAssets: number;
  latestLogs: AuditLog[];
};

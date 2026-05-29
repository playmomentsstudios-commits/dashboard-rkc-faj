import type { AdminRole } from '../types/admin';

const roleHierarchy: AdminRole[] = ['viewer', 'editor', 'finance', 'admin', 'owner'];

export function canAccessRole(userRole: AdminRole | null | undefined, minimumRole: AdminRole) {
  if (!userRole) return false;
  return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(minimumRole);
}

export function assertRole(userRole: AdminRole | null | undefined, minimumRole: AdminRole) {
  if (!canAccessRole(userRole, minimumRole)) {
    throw new Error('Permissão insuficiente para executar esta ação administrativa.');
  }
}
